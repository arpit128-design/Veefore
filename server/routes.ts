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

      // Force HTTPS for Instagram redirect URI (required by Instagram API)
      const redirectUri = `https://${req.get('host')}/api/instagram/callback`;
      const state = `${workspace.id}`;
      
      console.log(`[INSTAGRAM API] Redirect URI: ${redirectUri}`);
      console.log(`[INSTAGRAM API] Client ID: ${process.env.INSTAGRAM_APP_ID}`);
      
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
        return res.redirect(`https://${req.get('host')}/integrations?error=${error}`);
      }
      
      if (!code || !state) {
        return res.redirect(`https://${req.get('host')}/integrations?error=missing_code_or_state`);
      }

      const workspaceId = parseInt(state as string);
      const redirectUri = `https://${req.get('host')}/api/instagram/callback`;
      
      const { instagramAPI } = await import('./instagram-api');
      
      // Exchange code for token
      const tokenData = await instagramAPI.exchangeCodeForToken(code as string, redirectUri);
      
      // Get long-lived token
      const longLivedToken = await instagramAPI.getLongLivedToken(tokenData.access_token);
      
      // Get user profile
      const profile = await instagramAPI.getUserProfile(longLivedToken.access_token);
      
      // Save to database
      const existingAccount = await storage.getSocialAccountByPlatform(workspaceId, 'instagram');
      
      console.log(`[INSTAGRAM CALLBACK] Saving Instagram account: @${profile.username} (ID: ${profile.id})`);
      
      if (existingAccount) {
        await storage.updateSocialAccount(existingAccount.id, {
          accessToken: longLivedToken.access_token,
          refreshToken: null,
          expiresAt: new Date(Date.now() + longLivedToken.expires_in * 1000),
          accountId: profile.id,
          username: profile.username
        });
        console.log(`[INSTAGRAM CALLBACK] Updated existing account: @${profile.username}`);
      } else {
        const newAccount = await storage.createSocialAccount({
          workspaceId,
          platform: 'instagram',
          accountId: profile.id,
          username: profile.username,
          accessToken: longLivedToken.access_token,
          refreshToken: null,
          expiresAt: new Date(Date.now() + longLivedToken.expires_in * 1000)
        });
        console.log(`[INSTAGRAM CALLBACK] Created new account: @${profile.username} (DB ID: ${newAccount.id})`);
      }
      
      res.redirect(`https://${req.get('host')}/integrations?success=instagram_connected`);
    } catch (error: any) {
      console.error('[INSTAGRAM CALLBACK] Error:', error);
      res.redirect(`https://${req.get('host')}/integrations?error=${encodeURIComponent(error.message)}`);
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
      const { user } = req;
      const accountId = req.params.id;
      console.log(`[DISCONNECT ACCOUNT] Attempting to disconnect account ID: ${accountId}`);
      
      // Verify user has access to workspace
      const workspace = await storage.getDefaultWorkspace(user.id);
      if (!workspace) {
        return res.status(400).json({ error: 'No workspace found' });
      }
      
      // Get account details before deletion for logging - handle MongoDB ObjectId
      let account;
      try {
        // Try as string first (MongoDB ObjectId)
        account = await storage.getSocialAccount(accountId);
      } catch (castError) {
        console.log(`[DISCONNECT ACCOUNT] MongoDB cast error, trying numeric ID:`, castError.message);
        // Try as number if string fails
        const numericId = parseInt(accountId);
        if (!isNaN(numericId)) {
          account = await storage.getSocialAccount(numericId);
        }
      }
      
      if (account) {
        console.log(`[DISCONNECT ACCOUNT] Disconnecting ${account.platform} account: @${account.username} (${account.accountId})`);
        
        // Verify account belongs to user's workspace
        if (account.workspaceId !== workspace.id) {
          return res.status(403).json({ error: 'Access denied to this account' });
        }
        
        await storage.deleteSocialAccount(account.id);
        console.log(`[DISCONNECT ACCOUNT] Successfully disconnected ${account.platform} account`);
        
        res.json({ 
          success: true, 
          message: `Successfully disconnected ${account.platform} account`,
          platform: account.platform,
          username: account.username
        });
      } else {
        console.log(`[DISCONNECT ACCOUNT] Account not found: ${accountId}`);
        res.status(404).json({ error: 'Account not found' });
      }
    } catch (error: any) {
      console.error('[DISCONNECT ACCOUNT] Error:', error);
      res.status(500).json({ error: error.message });
    }
  });

  // Complete database wipe - remove ALL social accounts from workspace
  app.post('/api/social-accounts/cleanup', requireAuth, async (req: any, res: Response) => {
    try {
      const { user } = req;
      const workspace = await storage.getDefaultWorkspace(user.id);
      
      if (!workspace) {
        return res.status(400).json({ error: 'No workspace found' });
      }
      
      console.log(`[DATABASE WIPE] Starting complete database wipe for workspace: ${workspace.id}`);
      
      // Multiple deletion approaches to ensure complete removal
      let totalDeleted = 0;
      
      // Approach 1: Use storage layer deletion
      try {
        const existingAccounts = await storage.getSocialAccountsByWorkspace(workspace.id);
        console.log(`[DATABASE WIPE] Storage layer found ${existingAccounts.length} accounts`);
        
        for (const account of existingAccounts) {
          try {
            await storage.deleteSocialAccount(account.id);
            totalDeleted++;
            console.log(`[DATABASE WIPE] Storage deleted: ${account.platform} @${account.username}`);
          } catch (e) {
            console.log(`[DATABASE WIPE] Storage deletion failed for ${account.id}:`, e);
          }
        }
      } catch (storageError) {
        console.log(`[DATABASE WIPE] Storage approach failed:`, storageError);
      }
      
      // Approach 2: Direct MongoDB access using existing connection
      try {
        const mongoStorage = storage as any;
        await mongoStorage.connect();
        
        if (mongoStorage.SocialAccountModel) {
          const directResult = await mongoStorage.SocialAccountModel.deleteMany({ 
            workspaceId: workspace.id 
          });
          console.log(`[DATABASE WIPE] Direct MongoDB deletion result:`, directResult);
          totalDeleted += directResult.deletedCount || 0;
        }
      } catch (directError) {
        console.log(`[DATABASE WIPE] Direct MongoDB approach failed:`, directError);
      }
      
      // Approach 3: Raw MongoDB connection as fallback
      try {
        const mongodb = await import('mongodb');
        const client = new mongodb.MongoClient(process.env.MONGODB_URI!);
        await client.connect();
        
        const db = client.db('veeforedb');
        const collection = db.collection('socialaccounts');
        
        const rawResult = await collection.deleteMany({ 
          workspaceId: workspace.id 
        });
        console.log(`[DATABASE WIPE] Raw MongoDB deletion result:`, rawResult);
        totalDeleted += rawResult.deletedCount || 0;
        
        await client.close();
      } catch (rawError) {
        console.log(`[DATABASE WIPE] Raw MongoDB approach failed:`, rawError);
      }
      
      // Final verification
      let remainingCount = 0;
      try {
        const remaining = await storage.getSocialAccountsByWorkspace(workspace.id);
        remainingCount = remaining.length;
        console.log(`[DATABASE WIPE] Final verification: ${remainingCount} accounts remaining`);
      } catch (verifyError) {
        console.log(`[DATABASE WIPE] Verification failed:`, verifyError);
      }
      
      res.json({ 
        success: true, 
        message: `Database wipe complete: attempted deletion of accounts using multiple methods`,
        totalDeleted: totalDeleted,
        remainingAccounts: remainingCount,
        isComplete: remainingCount === 0,
        note: "If accounts persist, they may be cached - refresh the page"
      });
    } catch (error: any) {
      console.error('[DATABASE WIPE] Error:', error);
      res.status(500).json({ error: error.message });
    }
  });

  // Dashboard analytics - fetch real Instagram data
  app.get('/api/dashboard/analytics', requireAuth, async (req: any, res: Response) => {
    try {
      const { user } = req;
      const workspace = await storage.getDefaultWorkspace(user.id);
      
      if (!workspace) {
        return res.json({ totalPosts: 0, totalReach: 0, engagementRate: 0, topPlatform: 'none' });
      }

      // Get connected Instagram account
      const instagramAccount = await storage.getSocialAccountByPlatform(workspace.id, 'instagram');
      
      if (!instagramAccount || !instagramAccount.accessToken) {
        return res.json({ 
          totalPosts: 0, 
          totalReach: 0, 
          engagementRate: 0, 
          topPlatform: 'none',
          message: 'No Instagram account connected'
        });
      }

      try {
        console.log(`[DASHBOARD] Fetching real Instagram data for @${instagramAccount.username}`);
        
        // Import Instagram API
        const { instagramAPI } = await import('./instagram-api');
        
        // Get user media and insights
        const [media, insights] = await Promise.all([
          instagramAPI.getUserMedia(instagramAccount.accessToken, 25),
          instagramAPI.getAccountInsights(instagramAccount.accessToken, 'day')
        ]);

        console.log(`[DASHBOARD] Retrieved ${media.length} posts and insights for @${instagramAccount.username}`);

        // Calculate real metrics from Instagram data
        const totalPosts = media.length;
        const totalReach = insights.reach || 0;
        const totalLikes = media.reduce((sum, post) => sum + (post.like_count || 0), 0);
        const totalComments = media.reduce((sum, post) => sum + (post.comments_count || 0), 0);
        const totalEngagement = totalLikes + totalComments;
        const engagementRate = totalReach > 0 ? (totalEngagement / totalReach) * 100 : 0;

        res.json({
          totalPosts,
          totalReach,
          engagementRate: Math.round(engagementRate * 10) / 10,
          topPlatform: 'instagram',
          followers: insights.follower_count || 0,
          impressions: insights.impressions || 0,
          accountUsername: instagramAccount.username
        });

      } catch (instagramError: any) {
        console.error(`[DASHBOARD] Instagram API error for @${instagramAccount.username}:`, instagramError);
        
        // Return minimal data if Instagram API fails
        res.json({
          totalPosts: 0,
          totalReach: 0,
          engagementRate: 0,
          topPlatform: 'instagram',
          error: 'Instagram API error - check credentials',
          accountUsername: instagramAccount.username
        });
      }

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