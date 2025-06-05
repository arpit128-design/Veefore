import { Express, Request, Response, NextFunction } from "express";
import { IStorage } from "./storage";
import { instagramAPI } from "./instagram-api";
import { videoGeneratorAI } from "./video-generator";
import { Server } from "http";
import { WebSocketServer, WebSocket } from "ws";
import { GoogleGenerativeAI } from "@google/generative-ai";

const INSTAGRAM_ACCESS_TOKEN = process.env.INSTAGRAM_ACCESS_TOKEN;

export async function registerRoutes(app: Express, storage: IStorage, upload?: any): Promise<Server> {
  // Middleware for authentication
  const requireAuth = async (req: any, res: Response, next: NextFunction) => {
    try {
      const authHeader = req.headers.authorization;
      console.log(`[AUTH DEBUG] ${req.method} ${req.path} - Headers: {
        authorization: '${authHeader ? 'Present' : 'Missing'}',
        userAgent: '${req.headers['user-agent']}',
        referer: '${req.headers.referer}'
      }`);

      if (!authHeader) {
        console.log(`[AUTH ERROR] Missing or invalid authorization header for ${req.path}`);
        console.log('Available headers:', Object.keys(req.headers));
        return res.status(401).json({ error: 'Unauthorized' });
      }

      const token = authHeader.split(' ')[1];
      if (!token) {
        console.log(`[AUTH ERROR] No token found in authorization header for ${req.path}`);
        return res.status(401).json({ error: 'Unauthorized' });
      }

      // Extract Firebase UID from JWT token payload
      let firebaseUid;
      try {
        // Decode JWT token (base64 decode the payload part)
        const payload = JSON.parse(Buffer.from(token.split('.')[1], 'base64').toString());
        firebaseUid = payload.user_id || payload.sub;
        console.log(`[AUTH DEBUG] Extracted Firebase UID: ${firebaseUid} from JWT token`);
      } catch (error) {
        console.log(`[AUTH ERROR] Failed to decode JWT token:`, error);
        return res.status(401).json({ error: 'Invalid token format' });
      }
      
      let user = await storage.getUserByFirebaseUid(firebaseUid);
      if (!user) {
        console.log(`[AUTH DEBUG] Creating new user for Firebase UID: ${firebaseUid}`);
        // Create new user from JWT payload
        try {
          const payload = JSON.parse(Buffer.from(token.split('.')[1], 'base64').toString());
          const userData = {
            firebaseUid,
            email: payload.email || `user_${firebaseUid}@example.com`,
            username: payload.email?.split('@')[0] || `user_${firebaseUid.slice(0, 8)}`,
            displayName: payload.name || null,
            avatar: payload.picture || null,
            referredBy: null
          };
          
          user = await storage.createUser(userData);
          console.log(`[AUTH DEBUG] Created new user: ${user.id}`);
        } catch (error) {
          console.log(`[AUTH ERROR] Failed to create user:`, error);
          return res.status(500).json({ error: 'Failed to create user account' });
        }
      }

      console.log(`[AUTH DEBUG] User found: ${user.id} (${user.email})`);
      req.user = user;
      next();
    } catch (error) {
      console.error(`[AUTH ERROR] Authentication failed:`, error);
      res.status(401).json({ error: 'Unauthorized' });
    }
  };

  // Get current user
  app.get('/api/user', requireAuth, async (req: any, res: Response) => {
    try {
      const { user } = req;
      console.log(`[USER API] Returning user data for: ${user.id} (${user.email})`);
      res.json(user);
    } catch (error: any) {
      console.error('[USER API] Error fetching user:', error);
      res.status(500).json({ error: error.message });
    }
  });

  // Create new user
  app.post('/api/user', async (req: Request, res: Response) => {
    try {
      const { firebaseUid, email, username, displayName, avatar } = req.body;
      
      console.log('[USER API] Creating new user:', { firebaseUid, email, username });
      
      if (!firebaseUid || !email) {
        return res.status(400).json({ error: 'Firebase UID and email are required' });
      }

      // Check if user already exists
      const existingUser = await storage.getUserByFirebaseUid(firebaseUid);
      if (existingUser) {
        console.log('[USER API] User already exists:', existingUser.id);
        return res.json(existingUser);
      }

      const userData = {
        firebaseUid,
        email,
        username: username || email.split('@')[0],
        displayName: displayName || null,
        avatar: avatar || null,
        referredBy: null
      };

      const newUser = await storage.createUser(userData);
      console.log('[USER API] New user created:', newUser.id);
      
      res.json(newUser);
    } catch (error: any) {
      console.error('[USER API] Error creating user:', error);
      res.status(500).json({ error: error.message });
    }
  });

  // Content creation and publishing
  app.post('/api/content', requireAuth, async (req: any, res: Response) => {
    try {
      const { user } = req;
      const { workspaceId, title, description, type, platform, scheduledAt, publishNow, contentData } = req.body;

      console.log('[CONTENT API] Request body validation:', {
        workspaceId,
        workspaceIdType: typeof workspaceId,
        title,
        titleType: typeof title,
        hasWorkspaceId: !!workspaceId,
        hasTitle: !!title
      });

      if (!workspaceId || !title) {
        console.log('[CONTENT API] Validation failed - missing required fields');
        return res.status(400).json({ error: 'Workspace ID and title are required' });
      }

      console.log('[CONTENT API] Creating content:', { workspaceId, title, type, platform, scheduledAt, publishNow });

      // Create content in database
      const content = await storage.createContent({
        workspaceId: parseInt(workspaceId),
        title,
        description: description || null,
        type,
        platform: platform || 'instagram',
        contentData: contentData || null,
        scheduledAt: scheduledAt ? new Date(scheduledAt) : null,
        creditsUsed: 1
      });

      // If publishNow is true, publish to Instagram immediately
      if (publishNow && platform === 'instagram' && contentData?.mediaUrl) {
        try {
          console.log('[CONTENT API] Publishing to Instagram immediately');
          
          const workspace = await storage.getDefaultWorkspace(user.id);
          if (workspace) {
            const instagramAccount = await storage.getSocialAccountByPlatform(workspace.id, 'instagram');
            
            if (instagramAccount && instagramAccount.accessToken) {
              try {
                console.log('[INSTAGRAM DEBUG] Current connected account details:', {
                  accountId: instagramAccount.accountId,
                  username: instagramAccount.username,
                  platform: instagramAccount.platform,
                  workspaceId: instagramAccount.workspaceId
                });
                console.log('[INSTAGRAM API] Attempting to publish with media URL:', contentData.mediaUrl);
                
                if (contentData.mediaUrl.startsWith('blob:')) {
                  throw new Error('Blob URLs cannot be published to Instagram. Please upload an image file.');
                }
                
                // Create Instagram media container
                const createMediaResponse = await fetch(`https://graph.instagram.com/v18.0/${instagramAccount.accountId}/media`, {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({
                    image_url: contentData.mediaUrl,
                    caption: `${title}\n\n${description || ''}`,
                    access_token: instagramAccount.accessToken
                  })
                });

                console.log('[INSTAGRAM API] Create media response status:', createMediaResponse.status);
                
                if (!createMediaResponse.ok) {
                  const errorData = await createMediaResponse.json();
                  throw new Error(`Instagram API error: ${errorData.error?.message || 'Failed to create media container'}`);
                }

                const mediaData = await createMediaResponse.json();
                console.log('[INSTAGRAM API] Media container created:', mediaData.id);
                
                // Publish the media container
                const publishResponse = await fetch(`https://graph.instagram.com/v18.0/${instagramAccount.accountId}/media_publish`, {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({
                    creation_id: mediaData.id,
                    access_token: instagramAccount.accessToken
                  })
                });

                console.log('[INSTAGRAM API] Publish response status:', publishResponse.status);

                if (!publishResponse.ok) {
                  const errorData = await publishResponse.json();
                  throw new Error(`Instagram publish error: ${errorData.error?.message || 'Failed to publish'}`);
                }

                const publishData = await publishResponse.json();
                console.log('[CONTENT API] Published to Instagram successfully:', publishData.id);
                
                // Update content status
                await storage.updateContent(content.id, {
                  publishedAt: new Date()
                });

                return res.json({
                  success: true,
                  content,
                  published: true,
                  instagramPostId: publishData.id,
                  message: 'Content published to Instagram successfully'
                });
              } catch (instagramError: any) {
                console.log('[CONTENT API] Instagram API error:', instagramError.message);
                return res.json({
                  success: true,
                  content,
                  published: false,
                  message: 'Content saved but Instagram publishing failed',
                  publishingError: instagramError.message
                });
              }
            }
          }
        } catch (error) {
          console.log('[CONTENT API] Publishing failed:', error);
        }
      }

      res.json({
        success: true,
        content,
        published: false,
        message: publishNow ? 'Content saved' : 'Content scheduled successfully'
      });

    } catch (error: any) {
      console.error('[CONTENT API] Error creating content:', error);
      res.status(500).json({ 
        error: 'Failed to create content',
        details: error.message 
      });
    }
  });

  // File upload endpoint
  app.post('/api/upload', requireAuth, upload?.single('file'), (req: any, res: Response) => {
    try {
      if (!req.file) {
        return res.status(400).json({ error: 'No file uploaded' });
      }

      const fileUrl = `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`;
      
      res.json({
        success: true,
        fileUrl,
        filename: req.file.filename,
        originalName: req.file.originalname,
        size: req.file.size
      });
    } catch (error: any) {
      console.error('Upload error:', error);
      res.status(500).json({ error: 'Upload failed', details: error.message });
    }
  });

  // Get content list
  app.get('/api/content', requireAuth, async (req: any, res: Response) => {
    try {
      const { workspaceId, status } = req.query;
      
      if (!workspaceId) {
        return res.status(400).json({ error: 'Workspace ID is required' });
      }

      let content;
      if (status === 'scheduled') {
        content = await storage.getScheduledContent(parseInt(workspaceId));
      } else {
        content = await storage.getContentByWorkspace(parseInt(workspaceId));
      }
      
      res.json(content);
    } catch (error: any) {
      console.error('[CONTENT API] Error fetching content:', error);
      res.status(500).json({ error: error.message });
    }
  });

  // Instagram API routes
  app.get('/api/instagram/auth', requireAuth, async (req: any, res: Response) => {
    try {
      const { user } = req;
      const workspace = await storage.getDefaultWorkspace(user.id);
      
      if (!workspace) {
        return res.status(400).json({ error: 'No workspace found' });
      }

      const redirectUri = `${req.protocol}://${req.get('host')}/api/instagram/callback`;
      const state = `${workspace.id}`;
      
      const { instagramAPI } = await import('./instagram-api');
      const authUrl = instagramAPI.generateAuthUrl(redirectUri, state);
      
      res.json({ authUrl });
    } catch (error: any) {
      console.error('[INSTAGRAM AUTH] Error:', error);
      res.status(500).json({ error: error.message });
    }
  });

  app.get('/api/instagram/callback', async (req: Request, res: Response) => {
    try {
      const { code, state, error } = req.query;
      
      if (error) {
        return res.redirect(`${req.protocol}://${req.get('host')}/integrations?error=${error}`);
      }
      
      if (!code || !state) {
        return res.redirect(`${req.protocol}://${req.get('host')}/integrations?error=missing_code_or_state`);
      }

      const workspaceId = parseInt(state as string);
      const redirectUri = `${req.protocol}://${req.get('host')}/api/instagram/callback`;
      
      const { instagramAPI } = await import('./instagram-api');
      
      // Exchange code for token
      const tokenData = await instagramAPI.exchangeCodeForToken(code as string, redirectUri);
      
      // Get long-lived token
      const longLivedToken = await instagramAPI.getLongLivedToken(tokenData.access_token);
      
      // Get user profile
      const profile = await instagramAPI.getUserProfile(longLivedToken.access_token);
      
      // Save to database
      const existingAccount = await storage.getSocialAccountByPlatform(workspaceId, 'instagram');
      
      if (existingAccount) {
        await storage.updateSocialAccount(existingAccount.id, {
          accessToken: longLivedToken.access_token,
          refreshToken: null,
          expiresAt: new Date(Date.now() + longLivedToken.expires_in * 1000),
          accountId: profile.id,
          username: profile.username,
          metadata: { profile }
        });
      } else {
        await storage.createSocialAccount({
          workspaceId,
          platform: 'instagram',
          accountId: profile.id,
          username: profile.username,
          accessToken: longLivedToken.access_token,
          refreshToken: null,
          expiresAt: new Date(Date.now() + longLivedToken.expires_in * 1000),
          metadata: { profile }
        });
      }
      
      res.redirect(`${req.protocol}://${req.get('host')}/integrations?success=instagram_connected`);
    } catch (error: any) {
      console.error('[INSTAGRAM CALLBACK] Error:', error);
      res.redirect(`${req.protocol}://${req.get('host')}/integrations?error=${encodeURIComponent(error.message)}`);
    }
  });

  // Get social accounts
  app.get('/api/social-accounts', requireAuth, async (req: any, res: Response) => {
    try {
      const { user } = req;
      const workspace = await storage.getDefaultWorkspace(user.id);
      
      if (!workspace) {
        return res.json([]);
      }
      
      const accounts = await storage.getSocialAccountsByWorkspace(workspace.id);
      res.json(accounts);
    } catch (error: any) {
      console.error('[SOCIAL ACCOUNTS] Error:', error);
      res.status(500).json({ error: error.message });
    }
  });

  // Disconnect social account
  app.delete('/api/social-accounts/:id', requireAuth, async (req: any, res: Response) => {
    try {
      const accountId = parseInt(req.params.id);
      console.log(`[DISCONNECT ACCOUNT] Attempting to disconnect account ID: ${accountId}`);
      
      // Get account details before deletion for logging
      const account = await storage.getSocialAccount(accountId);
      if (account) {
        console.log(`[DISCONNECT ACCOUNT] Disconnecting ${account.platform} account: @${account.username} (${account.accountId})`);
      }
      
      await storage.deleteSocialAccount(accountId);
      console.log(`[DISCONNECT ACCOUNT] Successfully disconnected account ID: ${accountId}`);
      
      res.json({ success: true, message: 'Account disconnected successfully' });
    } catch (error: any) {
      console.error('[DISCONNECT ACCOUNT] Error:', error);
      res.status(500).json({ error: error.message });
    }
  });

  // Clear old Instagram accounts for current user (cleanup endpoint)
  app.post('/api/social-accounts/cleanup', requireAuth, async (req: any, res: Response) => {
    try {
      const { user } = req;
      const workspace = await storage.getDefaultWorkspace(user.id);
      
      if (!workspace) {
        return res.status(400).json({ error: 'No workspace found' });
      }
      
      console.log(`[CLEANUP] Starting cleanup for workspace: ${workspace.id}`);
      
      // Get ALL social accounts for this workspace
      const allAccounts = await storage.getSocialAccountsByWorkspace(workspace.id);
      console.log(`[CLEANUP] Found ${allAccounts.length} total accounts in workspace`);
      
      // Filter accounts to delete (all Instagram accounts or accounts with wrong username)
      const accountsToDelete = allAccounts.filter(account => 
        account.platform === 'instagram' || 
        account.username === 'rahulc1020' ||
        account.accountId === '9505923456179711'
      );
      
      console.log(`[CLEANUP] Accounts to delete:`, accountsToDelete.map(a => `${a.platform}:@${a.username} (ID:${a.id})`));
      
      // Delete all targeted accounts
      let deletedCount = 0;
      for (const account of accountsToDelete) {
        try {
          console.log(`[CLEANUP] Deleting account: ${account.platform} @${account.username} (ID: ${account.id})`);
          await storage.deleteSocialAccount(account.id);
          deletedCount++;
        } catch (deleteError) {
          console.error(`[CLEANUP] Failed to delete account ${account.id}:`, deleteError);
        }
      }
      
      // Verify cleanup by checking remaining accounts
      const remainingAccounts = await storage.getSocialAccountsByWorkspace(workspace.id);
      console.log(`[CLEANUP] Remaining accounts after cleanup:`, remainingAccounts.length);
      
      res.json({ 
        success: true, 
        message: `Cleaned up ${deletedCount} accounts`,
        deletedAccounts: deletedCount,
        remainingAccounts: remainingAccounts.length
      });
    } catch (error: any) {
      console.error('[CLEANUP] Error:', error);
      res.status(500).json({ error: error.message });
    }
  });

  // Dashboard analytics
  app.get('/api/dashboard/analytics', requireAuth, async (req: any, res: Response) => {
    try {
      const { user } = req;
      const workspace = await storage.getDefaultWorkspace(user.id);
      
      if (!workspace) {
        return res.json({ totalPosts: 0, totalReach: 0, engagementRate: 0, topPlatform: 'instagram' });
      }
      
      const analytics = await storage.getAnalytics(workspace.id, undefined, 30);
      
      // Calculate metrics
      const totalPosts = analytics.length;
      const totalReach = analytics.reduce((sum, a: any) => sum + (a.metrics?.reach || 0), 0);
      const totalEngagement = analytics.reduce((sum, a: any) => sum + (a.metrics?.engagement || 0), 0);
      const engagementRate = totalReach > 0 ? (totalEngagement / totalReach) * 100 : 0;
      
      // Find top platform
      const platformCounts = analytics.reduce((acc: any, a: any) => {
        acc[a.platform] = (acc[a.platform] || 0) + 1;
        return acc;
      }, {});
      
      const topPlatform = Object.keys(platformCounts).length > 0 
        ? Object.keys(platformCounts).reduce((a, b) => platformCounts[a] > platformCounts[b] ? a : b)
        : 'instagram';
      
      res.json({
        totalPosts,
        totalReach,
        engagementRate: Math.round(engagementRate * 100) / 100,
        topPlatform
      });
    } catch (error: any) {
      console.error('[DASHBOARD ANALYTICS] Error:', error);
      res.status(500).json({ error: error.message });
    }
  });

  // Get workspaces
  app.get('/api/workspaces', requireAuth, async (req: any, res: Response) => {
    try {
      const { user } = req;
      const workspaces = await storage.getWorkspacesByUserId(user.id);
      res.json(workspaces);
    } catch (error: any) {
      console.error('[WORKSPACES] Error:', error);
      res.status(500).json({ error: error.message });
    }
  });

  const http = await import('http');
  return http.createServer(app);
}