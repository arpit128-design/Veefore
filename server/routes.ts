import { Express, Request, Response, NextFunction } from "express";
import { IStorage } from "./storage";
import { instagramAPI } from "./instagram-api";
import { videoGeneratorAI } from "./video-generator";
import { Server } from "http";
import { WebSocketServer, WebSocket } from "ws";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { AccessControl } from "./access-control";
import { 
  requireFeature, 
  requireCredits, 
  validateWorkspaceLimit, 
  validateSocialAccountLimit,
  validateSchedulingLimit,
  addPlanContext,
  enforceWatermarkPolicy,
  enrichResponseWithPlanInfo
} from "./plan-enforcement-middleware";
import { generateIntelligentSuggestions } from "./ai-suggestions-service";

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
          
          // Automatically create default workspace for new users
          try {
            const defaultWorkspace = await storage.createWorkspace({
              userId: user.id,
              name: 'My VeeFore Workspace',
              description: 'Default workspace for social media management'
            });
            console.log(`[AUTH DEBUG] Created default workspace for new user: ${defaultWorkspace.id} (${defaultWorkspace.name})`);
          } catch (workspaceError) {
            console.error(`[AUTH ERROR] Failed to create default workspace for user ${user.id}:`, workspaceError);
            // Continue even if workspace creation fails - user can create one later
          }
        } catch (error) {
          console.log(`[AUTH ERROR] Failed to create user:`, error);
          return res.status(500).json({ error: 'Failed to create user account' });
        }
      }

      console.log(`[AUTH DEBUG] User found: ${user.id} (${user.email})`);
      
      // Check if existing user has at least one workspace, create default if not
      try {
        const userWorkspaces = await storage.getWorkspacesByUserId(user.id);
        if (userWorkspaces.length === 0) {
          console.log(`[AUTH DEBUG] User ${user.id} has no workspaces, creating default workspace`);
          const defaultWorkspace = await storage.createWorkspace({
            userId: user.id,
            name: 'My VeeFore Workspace',
            description: 'Default workspace for social media management'
          });
          console.log(`[AUTH DEBUG] Created default workspace for existing user: ${defaultWorkspace.id} (${defaultWorkspace.name})`);
        }
      } catch (workspaceError) {
        console.error(`[AUTH ERROR] Failed to check/create workspace for user ${user.id}:`, workspaceError);
        // Continue even if workspace check/creation fails
      }
      
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
      console.log(`[USER API] User isOnboarded: ${user.isOnboarded}, preferences:`, user.preferences ? 'Present' : 'Missing');
      res.json(user);
    } catch (error: any) {
      console.error('[USER API] Error fetching user:', error);
      res.status(500).json({ error: error.message });
    }
  });

  // Complete user onboarding
  app.post('/api/user/complete-onboarding', requireAuth, async (req: any, res: Response) => {
    try {
      const { user } = req;
      const { preferences } = req.body;
      
      console.log('[ONBOARDING] Completing onboarding for user:', user.id);
      
      if (!preferences) {
        return res.status(400).json({ error: 'Preferences are required' });
      }
      
      // Update user with onboarding status and preferences
      const updatedUser = await storage.updateUser(user.id, {
        isOnboarded: true,
        preferences: preferences
      });
      
      console.log('[ONBOARDING] Successfully completed onboarding for user:', user.id);
      res.json({ success: true, user: updatedUser });
    } catch (error: any) {
      console.error('[ONBOARDING] Error completing onboarding:', error);
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
  app.post('/api/content', requireAuth, addPlanContext, requireCredits(5), validateSchedulingLimit(), enforceWatermarkPolicy(), enrichResponseWithPlanInfo(), async (req: any, res: Response) => {
    try {
      const { user } = req;
      const { workspaceId, title, description, type, platform, scheduledAt, publishNow, contentData } = req.body;

      console.log('[CONTENT API] Creating content:', {
        workspaceId,
        title,
        type,
        platform,
        scheduledAt,
        publishNow,
        hasContentData: !!contentData
      });

      if (!workspaceId || !title) {
        console.log('[CONTENT API] Validation failed - missing required fields');
        return res.status(400).json({ 
          error: 'Workspace ID and title are required'
        });
      }

      console.log('[CONTENT API] Creating content:', { workspaceId, title, type, platform, scheduledAt, publishNow });

      // Create content in database
      const content = await storage.createContent({
        workspaceId: workspaceId,
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
                
                // Create Instagram media container based on content type
                let mediaPayload: any = {
                  access_token: instagramAccount.accessToken
                };

                const caption = `${title}\n\n${description || ''}`;

                // Auto-detect if media is video or image
                const mediaUrl = contentData.mediaUrl;
                const isVideo = mediaUrl.match(/\.(mp4|mov|avi|mkv|webm|3gp|m4v)$/i) || 
                               mediaUrl.includes('video') || 
                               type === 'reel' || 
                               type === 'video';

                // Determine media type and configure payload accordingly
                switch (type) {
                  case 'story':
                    if (isVideo) {
                      mediaPayload.video_url = mediaUrl;
                      mediaPayload.media_type = 'STORIES';
                    } else {
                      mediaPayload.image_url = mediaUrl;
                      mediaPayload.media_type = 'STORIES';
                    }
                    console.log('[INSTAGRAM API] WARNING: Story publishing requires advanced Instagram API permissions');
                    break;
                  case 'reel':
                    mediaPayload.video_url = mediaUrl;
                    mediaPayload.caption = caption;
                    mediaPayload.media_type = 'REELS';
                    console.log('[INSTAGRAM API] WARNING: Reel publishing requires advanced Instagram API permissions');
                    break;
                  case 'video':
                    mediaPayload.video_url = mediaUrl;
                    mediaPayload.caption = caption;
                    mediaPayload.media_type = 'REELS';
                    break;
                  case 'post':
                  default:
                    if (isVideo) {
                      mediaPayload.video_url = mediaUrl;
                      mediaPayload.caption = caption;
                      mediaPayload.media_type = 'REELS';
                    } else {
                      mediaPayload.image_url = mediaUrl;
                      mediaPayload.caption = caption;
                    }
                    break;
                }

                console.log(`[INSTAGRAM API] Auto-detected media type: ${isVideo ? 'video' : 'image'} for ${type}`);

                console.log(`[INSTAGRAM API] Creating ${type} media container with payload:`, { ...mediaPayload, access_token: '[HIDDEN]' });

                const createMediaResponse = await fetch(`https://graph.instagram.com/v18.0/${instagramAccount.accountId}/media`, {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify(mediaPayload)
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
                  status: 'published',
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
                console.error('[CONTENT API] Instagram API error for', type, 'content:', instagramError.message);
                console.error('[CONTENT API] Full error details:', instagramError);
                return res.json({
                  success: true,
                  content,
                  published: false,
                  message: `Content saved but Instagram ${type} publishing failed: ${instagramError.message}`,
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

      const fileSizeMB = req.file.size / (1024 * 1024);
      console.log(`[UPLOAD] File uploaded: ${req.file.filename} (${fileSizeMB.toFixed(2)} MB)`);

      // Warn for large video files that may affect Instagram processing
      if (req.file.mimetype.startsWith('video/') && fileSizeMB > 50) {
        console.log(`[UPLOAD WARNING] Large video file (${fileSizeMB.toFixed(2)} MB) - Instagram may take longer to process`);
      }

      const fileUrl = `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`;
      
      res.json({
        success: true,
        fileUrl,
        filename: req.file.filename,
        originalName: req.file.originalname,
        size: req.file.size,
        sizeMB: fileSizeMB.toFixed(2),
        type: req.file.mimetype,
        isVideo: req.file.mimetype.startsWith('video/'),
        warning: req.file.mimetype.startsWith('video/') && fileSizeMB > 50 ? 'Large video files may take longer to process on Instagram' : null
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
        content = await storage.getScheduledContent(workspaceId);
      } else {
        content = await storage.getContentByWorkspace(workspaceId);
      }
      
      res.json(content);
    } catch (error: any) {
      console.error('[CONTENT API] Error fetching content:', error);
      res.status(500).json({ error: error.message });
    }
  });

  // Admin endpoint to fix content status
  app.post('/api/fix-content-status', requireAuth, async (req: any, res: Response) => {
    try {
      const { workspaceId } = req.body;
      
      if (!workspaceId) {
        return res.status(400).json({ error: 'Workspace ID required' });
      }

      // Get all content for this workspace
      const allContent = await storage.getContentByWorkspace(parseInt(workspaceId));
      console.log(`[FIX STATUS] Found ${allContent.length} content items`);
      
      // Find story content that might need status fix
      const storyContent = allContent.filter(c => c.type === 'story' && c.title === 'dvd');
      console.log(`[FIX STATUS] Found ${storyContent.length} story items:`, storyContent.map(c => ({ id: c.id, status: c.status, title: c.title })));
      
      // Update any story content that's still showing as scheduled but should be published
      const fixResults = [];
      for (const content of storyContent) {
        if (content.status === 'scheduled' || content.status === 'publishing') {
          const updated = await storage.updateContent(content.id, {
            status: 'published',
            publishedAt: new Date()
          });
          fixResults.push(updated);
          console.log(`[FIX STATUS] Updated content ${content.id} to published`);
        }
      }
      
      res.json({ 
        success: true, 
        message: `Fixed ${fixResults.length} content items`,
        fixed: fixResults,
        allContent: allContent.map(c => ({ id: c.id, type: c.type, title: c.title, status: c.status }))
      });
      
    } catch (error: any) {
      console.error('[FIX STATUS] Error:', error);
      res.status(500).json({ error: error.message });
    }
  });

  // Update content route
  app.put('/api/content/:id', requireAuth, async (req: any, res: Response) => {
    try {
      const { user } = req;
      const { id } = req.params;
      const updates = req.body;

      console.log(`[CONTENT API] Updating content ${id}:`, updates);

      const updatedContent = await storage.updateContent(id, updates);
      
      res.json({ success: true, content: updatedContent });
    } catch (error: any) {
      console.error('[CONTENT API] Error updating content:', error);
      res.status(500).json({ error: error.message });
    }
  });

  // Delete content route
  app.delete('/api/content/:id', requireAuth, async (req: any, res: Response) => {
    try {
      const { user } = req;
      const { id } = req.params;

      console.log(`[CONTENT API] Deleting content ${id}`);

      await storage.deleteContent(id);
      
      res.json({ success: true, message: 'Content deleted successfully' });
    } catch (error: any) {
      console.error('[CONTENT API] Error deleting content:', error);
      res.status(500).json({ error: error.message });
    }
  });

  // Post Now endpoint - Immediate publishing with progress tracking
  app.post('/api/content/:id/publish', requireAuth, async (req: any, res: Response) => {
    try {
      const { user } = req;
      const { id } = req.params;

      console.log(`[POST NOW] Starting immediate publish for content ${id}`);

      // Get content details
      const content = await storage.getContent(id);
      if (!content) {
        return res.status(404).json({ error: 'Content not found' });
      }

      // Verify user owns this content
      const workspace = await storage.getWorkspace(content.workspaceId);
      if (!workspace || workspace.userId !== user.id) {
        return res.status(403).json({ error: 'Unauthorized access to content' });
      }

      // Update status to publishing
      await storage.updateContent(id, { 
        status: 'publishing',
        publishedAt: new Date()
      });

      // Send immediate response to show progress tracker
      res.json({ 
        success: true, 
        message: 'Publishing started',
        status: 'publishing',
        contentId: id
      });

      // Start publishing in background
      setImmediate(async () => {
        try {
          console.log(`[POST NOW] Publishing content: ${content.title} to ${content.platform}`);
          
          if (content.platform === 'instagram') {
            // Get Instagram account for workspace
            const instagramAccount = await storage.getSocialAccountByPlatform(content.workspaceId, 'instagram');
            
            if (!instagramAccount?.accessToken) {
              console.error(`[POST NOW] No Instagram access token found for workspace ${content.workspaceId}`);
              await storage.updateContent(id, { status: 'failed' });
              return;
            }

            // Parse contentData if it's a string
            let contentData: any = content.contentData;
            if (typeof contentData === 'string') {
              try {
                contentData = JSON.parse(contentData);
              } catch (e) {
                console.error(`[POST NOW] Failed to parse contentData for ${id}`);
                contentData = {};
              }
            }

            // Determine content type and publish accordingly
            if (content.type === 'video' && contentData?.mediaUrl) {
              try {
                console.log(`[POST NOW] Publishing video content to Instagram`);
                let result;
                try {
                  result = await instagramAPI.publishReel(
                    instagramAccount.accessToken, 
                    contentData.mediaUrl, 
                    contentData.caption || content.description || ''
                  );
                } catch (reelError: any) {
                  console.log(`[POST NOW] Reel publish failed, trying with intelligent compression`);
                  const { DirectInstagramPublisher } = await import('./direct-instagram-publisher');
                  result = await DirectInstagramPublisher.publishVideoWithIntelligentCompression(
                    instagramAccount.accessToken, 
                    contentData.mediaUrl, 
                    contentData.caption || content.description || ''
                  );
                }
                
                // Update content with success status
                await storage.updateContent(id, { 
                  status: 'published',
                  publishedAt: new Date()
                });
                
                console.log(`[POST NOW] Successfully published content ${id} to Instagram`);
                
              } catch (publishError: any) {
                console.error(`[POST NOW] Instagram publish failed for content ${id}:`, publishError.message);
                await storage.updateContent(id, { 
                  status: 'failed'
                });
              }
            } else if (content.type === 'image' && contentData?.mediaUrl) {
              try {
                console.log(`[POST NOW] Publishing image content to Instagram`);
                const result = await instagramAPI.publishPhoto(
                  instagramAccount.accessToken, 
                  contentData.mediaUrl, 
                  contentData.caption || content.description || ''
                );
                
                await storage.updateContent(id, { 
                  status: 'published',
                  publishedAt: new Date()
                });
                
                console.log(`[POST NOW] Successfully published content ${id} to Instagram`);
                
              } catch (publishError: any) {
                console.error(`[POST NOW] Instagram publish failed for content ${id}:`, publishError.message);
                await storage.updateContent(id, { 
                  status: 'failed'
                });
              }
            } else {
              console.error(`[POST NOW] Unsupported content type or missing media: ${content.type}`);
              await storage.updateContent(id, { 
                status: 'failed'
              });
            }
          } else {
            console.error(`[POST NOW] Unsupported platform: ${content.platform}`);
            await storage.updateContent(id, { 
              status: 'failed'
            });
          }
          
        } catch (error: any) {
          console.error(`[POST NOW] Error publishing content ${id}:`, error);
          await storage.updateContent(id, { 
            status: 'failed',
            errorMessage: error.message 
          });
        }
      });

    } catch (error: any) {
      console.error('[POST NOW] Error starting publish:', error);
      res.status(500).json({ error: error.message });
    }
  });

  // Instagram API routes
  app.get('/api/instagram/auth', requireAuth, async (req: any, res: Response) => {
    try {
      const { user } = req;
      const workspaceId = req.query.workspaceId;
      
      console.log('[INSTAGRAM AUTH] Request for user:', user.id, 'workspaceId:', workspaceId);
      
      let workspace;
      if (workspaceId) {
        // Convert string workspace ID to ObjectId for MongoDB
        let workspaceObjectId;
        try {
          workspaceObjectId = workspaceId.toString();
        } catch (error) {
          console.log('[INSTAGRAM AUTH] Invalid workspace ID format:', workspaceId);
          return res.status(400).json({ error: 'Invalid workspace ID format' });
        }
        
        // Verify user has access to the requested workspace
        workspace = await storage.getWorkspace(workspaceObjectId);
        if (!workspace || workspace.userId !== user.id) {
          console.log('[INSTAGRAM AUTH] Access denied to workspace:', workspaceId);
          return res.status(403).json({ error: 'Access denied to workspace' });
        }
      } else {
        // Fallback to default workspace if no workspaceId provided
        workspace = await storage.getDefaultWorkspace(user.id);
        
        // If no default workspace exists, create one automatically
        if (!workspace) {
          console.log('[INSTAGRAM AUTH] No workspace found, creating default workspace for user:', user.id);
          workspace = await storage.createWorkspace({
            userId: user.id,
            name: 'My VeeFore Workspace',
            description: 'Default workspace for social media management'
          });
          console.log('[INSTAGRAM AUTH] Created default workspace:', workspace.id, workspace.name);
        }
      }
      
      if (!workspace) {
        console.error('[INSTAGRAM AUTH] Failed to get or create workspace for user:', user.id);
        return res.status(400).json({ error: 'Unable to access or create workspace' });
      }
      
      console.log('[INSTAGRAM AUTH] Using workspace:', workspace.id, workspace.name);

      // Check if Instagram credentials are properly configured
      if (!process.env.INSTAGRAM_APP_ID || !process.env.INSTAGRAM_APP_SECRET) {
        return res.status(400).json({ 
          error: 'Instagram app credentials not configured. Please provide INSTAGRAM_APP_ID and INSTAGRAM_APP_SECRET.' 
        });
      }

      // Diagnostic information for debugging redirect URI issues
      const currentDomain = req.get('host');
      const requiredRedirectUri = `https://${currentDomain}/api/instagram/callback`;
      
      console.log(`[INSTAGRAM AUTH] Current domain: ${currentDomain}`);
      console.log(`[INSTAGRAM AUTH] Required redirect URI: ${requiredRedirectUri}`);
      console.log(`[INSTAGRAM AUTH] App ID: ${process.env.INSTAGRAM_APP_ID}`);
      console.log(`[INSTAGRAM AUTH] CRITICAL: Ensure your Instagram app has this exact redirect URI configured`);
      
      // Validate domain format
      if (!currentDomain || !currentDomain.includes('replit.dev')) {
        console.warn(`[INSTAGRAM AUTH] Warning: Domain format may not be supported by Instagram: ${currentDomain}`);
      }

      // Force HTTPS for Instagram redirect URI (required by Instagram API)
      const redirectUri = `https://${req.get('host')}/api/instagram/callback`;
      const stateData = {
        workspaceId: workspace.id,
        userId: user.id,
        timestamp: Date.now(),
        source: req.query.source || 'integrations' // Track where OAuth was initiated
      };
      const state = JSON.stringify(stateData);
      
      console.log(`[INSTAGRAM AUTH] Starting OAuth flow for user ${user.id}`);
      console.log(`[INSTAGRAM AUTH] Redirect URI: ${redirectUri}`);
      console.log(`[INSTAGRAM AUTH] App ID: ${process.env.INSTAGRAM_APP_ID}`);
      console.log(`[INSTAGRAM AUTH] State data:`, stateData);
      
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
      const { code, state, error, error_reason, error_description } = req.query;
      
      console.log(`[INSTAGRAM CALLBACK] Received callback with all parameters:`, {
        code: code ? `present (${String(code).substring(0, 10)}...)` : 'missing',
        state: state ? 'present' : 'missing',
        error: error || 'none',
        error_reason: error_reason || 'none',
        error_description: error_description || 'none',
        fullUrl: req.url,
        host: req.get('host')
      });
      
      if (error) {
        console.error(`[INSTAGRAM CALLBACK] OAuth error: ${error}`);
        const redirectPage = state ? 'integrations' : 'integrations'; // Default to integrations for errors
        return res.redirect(`https://${req.get('host')}/${redirectPage}?error=${encodeURIComponent(error as string)}`);
      }
      
      if (!code || !state) {
        console.error('[INSTAGRAM CALLBACK] Missing code or state parameter');
        return res.redirect(`https://${req.get('host')}/integrations?error=missing_code_or_state`);
      }

      // Parse state parameter
      let stateData;
      try {
        stateData = JSON.parse(state as string);
        console.log(`[INSTAGRAM CALLBACK] Parsed state data:`, stateData);
      } catch (e) {
        // Fallback for old simple state format
        stateData = { workspaceId: parseInt(state as string) };
        console.log(`[INSTAGRAM CALLBACK] Using fallback state parsing:`, stateData);
      }

      const { workspaceId } = stateData;
      const redirectUri = `https://${req.get('host')}/api/instagram/callback`;
      
      console.log(`[INSTAGRAM CALLBACK] Processing for workspace ${workspaceId}`);
      console.log(`[INSTAGRAM CALLBACK] Using redirect URI: ${redirectUri}`);
      
      const { instagramAPI } = await import('./instagram-api');
      
      // Exchange code for token
      console.log(`[INSTAGRAM CALLBACK] Exchanging authorization code for access token...`);
      const tokenData = await instagramAPI.exchangeCodeForToken(code as string, redirectUri);
      console.log(`[INSTAGRAM CALLBACK] Token exchange successful`);
      
      // Get long-lived token
      console.log(`[INSTAGRAM CALLBACK] Converting to long-lived token...`);
      const longLivedToken = await instagramAPI.getLongLivedToken(tokenData.access_token);
      console.log(`[INSTAGRAM CALLBACK] Long-lived token obtained, expires in ${longLivedToken.expires_in} seconds`);
      
      // Get user profile
      console.log(`[INSTAGRAM CALLBACK] Fetching user profile...`);
      const profile = await instagramAPI.getUserProfile(longLivedToken.access_token);
      console.log(`[INSTAGRAM CALLBACK] Profile retrieved: @${profile.username} (ID: ${profile.id})`);
      
      // Validate workspace ID and handle undefined/null cases
      console.log(`[INSTAGRAM CALLBACK] Processing workspace ID: ${workspaceId} (type: ${typeof workspaceId})`);
      
      if (!workspaceId || workspaceId === 'undefined' || workspaceId === 'null') {
        console.error(`[INSTAGRAM CALLBACK] Invalid workspace ID: ${workspaceId}`);
        return res.redirect(`https://${req.get('host')}/integrations?error=invalid_workspace`);
      }
      
      // Verify workspace exists and user has access
      let workspace;
      try {
        workspace = await storage.getWorkspace(workspaceId);
        if (!workspace) {
          console.error(`[INSTAGRAM CALLBACK] Workspace not found: ${workspaceId}`);
          return res.redirect(`https://${req.get('host')}/integrations?error=workspace_not_found`);
        }
        console.log(`[INSTAGRAM CALLBACK] Verified workspace: ${workspace.name} (${workspace.id})`);
      } catch (error) {
        console.error(`[INSTAGRAM CALLBACK] Error verifying workspace:`, error);
        return res.redirect(`https://${req.get('host')}/integrations?error=workspace_error`);
      }
      
      // Save to database - handle workspace ID conversion
      console.log(`[INSTAGRAM CALLBACK] Looking for existing Instagram account in workspace: ${workspaceId}`);
      
      let existingAccount;
      try {
        // Try to find existing account with workspace-specific method
        const accounts = await storage.getSocialAccountsByWorkspace(workspaceId);
        existingAccount = accounts.find(account => account.platform === 'instagram');
        console.log(`[INSTAGRAM CALLBACK] Found ${accounts.length} accounts in workspace, existing Instagram: ${existingAccount ? 'Yes' : 'No'}`);
      } catch (error) {
        console.log(`[INSTAGRAM CALLBACK] Error looking up existing accounts:`, error);
        existingAccount = null;
      }
      
      const accountData = {
        accessToken: longLivedToken.access_token,
        refreshToken: null,
        expiresAt: new Date(Date.now() + longLivedToken.expires_in * 1000),
        accountId: profile.id,
        username: profile.username,
        isActive: true
      };
      
      if (existingAccount) {
        console.log(`[INSTAGRAM CALLBACK] Updating existing account ID: ${existingAccount.id}`);
        await storage.updateSocialAccount(existingAccount.id, accountData);
        console.log(`[INSTAGRAM CALLBACK] Updated existing account: @${profile.username}`);
      } else {
        console.log(`[INSTAGRAM CALLBACK] Creating new Instagram account for workspace: ${workspaceId}`);
        const newAccount = await storage.createSocialAccount({
          workspaceId,
          platform: 'instagram',
          ...accountData
        });
        console.log(`[INSTAGRAM CALLBACK] Created new account: @${profile.username} (DB ID: ${newAccount.id})`);
      }
      
      console.log(`[INSTAGRAM CALLBACK] Successfully connected Instagram account @${profile.username}`);
      
      // Redirect based on where OAuth was initiated
      const redirectPage = stateData.source === 'onboarding' ? 'onboarding' : 'integrations';
      console.log(`[INSTAGRAM CALLBACK] Redirecting to ${redirectPage} page`);
      res.redirect(`https://${req.get('host')}/${redirectPage}?success=instagram_connected&username=${profile.username}`);
      
    } catch (error: any) {
      console.error('[INSTAGRAM CALLBACK] Error details:', {
        message: error.message,
        stack: error.stack?.split('\n')[0],
        response: error.response?.data
      });
      
      let errorMessage = error.message;
      if (error.response?.data) {
        errorMessage = `Instagram API Error: ${JSON.stringify(error.response.data)}`;
      }
      
      res.redirect(`https://${req.get('host')}/integrations?error=${encodeURIComponent(errorMessage)}`);
    }
  });

  // Manual Instagram account connection
  app.post('/api/instagram/manual-connect', requireAuth, addPlanContext, validateSocialAccountLimit('instagram'), enrichResponseWithPlanInfo(), async (req: any, res: Response) => {
    try {
      const { user } = req;
      const { accessToken, username } = req.body;
      
      if (!accessToken || !username) {
        return res.status(400).json({ error: 'Access token and username are required' });
      }
      
      const workspace = await storage.getDefaultWorkspace(user.id);
      if (!workspace) {
        return res.status(400).json({ error: 'No workspace found' });
      }

      console.log(`[MANUAL CONNECT] Connecting Instagram account @${username}`);

      // Test the access token by making a basic API call
      try {
        const { instagramAPI } = await import('./instagram-api');
        const profile = await instagramAPI.getUserProfile(accessToken);
        
        console.log(`[MANUAL CONNECT] Token validated for @${profile.username}`);
        
        // Save to database
        const existingAccount = await storage.getSocialAccountByPlatform(workspace.id, 'instagram');
        
        if (existingAccount) {
          await storage.updateSocialAccount(existingAccount.id, {
            accessToken,
            username: profile.username,
            accountId: profile.id
          });
          console.log(`[MANUAL CONNECT] Updated existing account: @${profile.username}`);
        } else {
          const newAccount = await storage.createSocialAccount({
            workspaceId: workspace.id,
            platform: 'instagram',
            accountId: profile.id,
            username: profile.username,
            accessToken,
            refreshToken: null,
            expiresAt: null
          });
          console.log(`[MANUAL CONNECT] Created new account: @${profile.username} (DB ID: ${newAccount.id})`);
        }

        res.json({ success: true, username: profile.username, accountId: profile.id });
      } catch (apiError: any) {
        console.error(`[MANUAL CONNECT] Instagram API error:`, apiError);
        res.status(400).json({ error: 'Invalid Instagram access token or API error' });
      }
    } catch (error: any) {
      console.error('[MANUAL CONNECT] Error:', error);
      res.status(500).json({ error: error.message });
    }
  });

  // Get social accounts
  app.get('/api/social-accounts', requireAuth, async (req: any, res: Response) => {
    try {
      const { user } = req;
      const workspaceId = req.query.workspaceId;
      
      console.log('[SOCIAL ACCOUNTS DEBUG] ===== API REQUEST START =====');
      console.log('[SOCIAL ACCOUNTS DEBUG] User ID:', user.id);
      console.log('[SOCIAL ACCOUNTS DEBUG] Raw workspaceId param:', workspaceId);
      console.log('[SOCIAL ACCOUNTS DEBUG] WorkspaceId type:', typeof workspaceId);
      console.log('[SOCIAL ACCOUNTS DEBUG] Query params:', req.query);
      
      if (!workspaceId) {
        console.log('[SOCIAL ACCOUNTS] No workspaceId provided, using default workspace');
        const workspace = await storage.getDefaultWorkspace(user.id);
        if (!workspace) {
          return res.json([]);
        }
        const accounts = await storage.getSocialAccountsByWorkspace(workspace.id);
        console.log('[SOCIAL ACCOUNTS] Returning accounts for default workspace:', workspace.id, 'count:', accounts.length);
        return res.json(accounts);
      }
      
      console.log('[SOCIAL ACCOUNTS DEBUG] Looking up workspace with ID:', workspaceId);
      
      // Verify user has access to the requested workspace
      const workspace = await storage.getWorkspace(workspaceId as string);
      console.log('[SOCIAL ACCOUNTS DEBUG] Found workspace:', workspace ? {
        id: workspace.id,
        name: workspace.name,
        userId: workspace.userId
      } : null);
      
      if (!workspace || workspace.userId !== user.id) {
        console.log('[SOCIAL ACCOUNTS] Access denied to workspace:', workspaceId);
        console.log('[SOCIAL ACCOUNTS DEBUG] Access check failed - workspace exists:', !!workspace, 'user match:', workspace?.userId === user.id);
        return res.status(403).json({ error: 'Access denied to workspace' });
      }
      
      console.log('[SOCIAL ACCOUNTS DEBUG] Fetching accounts for workspace:', workspaceId);
      const accounts = await storage.getSocialAccountsByWorkspace(workspaceId as string);
      console.log('[SOCIAL ACCOUNTS DEBUG] Database returned accounts:');
      accounts.forEach((account, index) => {
        console.log(`[SOCIAL ACCOUNTS DEBUG]   ${index + 1}. Platform: ${account.platform}, Username: @${account.username}, WorkspaceId: ${account.workspaceId}`);
      });
      
      console.log('[SOCIAL ACCOUNTS] Returning accounts for workspace:', workspaceId, 'count:', accounts.length);
      console.log('[SOCIAL ACCOUNTS DEBUG] ===== API REQUEST END =====');
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

  // Real-time analytics endpoint with authentic data calculation
  app.get('/api/analytics/realtime', requireAuth, async (req: any, res: Response) => {
    try {
      const { user } = req;
      const workspace = await storage.getDefaultWorkspace(user.id);
      
      if (!workspace) {
        return res.status(404).json({ error: 'No workspace found' });
      }

      const instagramAccount = await storage.getSocialAccountByPlatform(workspace.id, 'instagram');
      
      if (!instagramAccount || !instagramAccount.accessToken) {
        return res.status(400).json({ 
          error: 'Instagram account not connected',
          message: 'Connect your Instagram account to view real-time analytics'
        });
      }

      // Import analytics engine
      const { AnalyticsEngine } = await import('./analytics-engine');
      const analyticsEngine = new AnalyticsEngine(storage);

      // Calculate real-time analytics from Instagram data
      const realTimeAnalytics = await analyticsEngine.calculateRealTimeAnalytics(
        instagramAccount.accessToken, 
        workspace.id
      );

      res.json(realTimeAnalytics);

    } catch (error: any) {
      console.error('[REALTIME ANALYTICS] Error:', error);
      res.status(500).json({ 
        error: 'Failed to calculate real-time analytics',
        details: error.message 
      });
    }
  });

  // Dashboard analytics - fetch real Instagram data filtered by workspace
  app.get('/api/dashboard/analytics', requireAuth, async (req: any, res: Response) => {
    try {
      const { user } = req;
      const workspaceId = req.query.workspaceId;
      
      console.log(`[DASHBOARD ANALYTICS] Request for user ${user.id}, workspaceId: ${workspaceId}`);
      
      let workspace;
      if (workspaceId) {
        // Get specific workspace
        workspace = await storage.getWorkspace(workspaceId);
        console.log(`[DASHBOARD ANALYTICS] Found workspace: ${workspace?.name} (${workspace?.id})`);
        if (!workspace || workspace.userId !== user.id) {
          console.log(`[DASHBOARD ANALYTICS] Workspace access denied or not found`);
          return res.status(403).json({ error: 'Workspace not found or access denied' });
        }
      } else {
        // Fallback to default workspace
        console.log(`[DASHBOARD ANALYTICS] No workspaceId provided, using default`);
        workspace = await storage.getDefaultWorkspace(user.id);
      }
      
      if (!workspace) {
        return res.json({ totalPosts: 0, totalReach: 0, engagementRate: 0, topPlatform: 'none' });
      }

      console.log(`[DASHBOARD ANALYTICS] Fetching data for workspace: ${workspace.name} (${workspace.id})`);

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
        const totalLikes = media.reduce((sum, post) => sum + (post.like_count || 0), 0);
        const totalComments = media.reduce((sum, post) => sum + (post.comments_count || 0), 0);
        const totalEngagement = totalLikes + totalComments;
        
        // Get reach from media insights if available, otherwise use account insights
        let totalReach = insights.reach || 0;
        if (totalReach === 0 && media.length > 0) {
          // Try to get reach from individual media insights
          const mediaReach = await Promise.all(
            media.map(async (post) => {
              try {
                const mediaInsights = await instagramAPI.getMediaInsights(post.id, instagramAccount.accessToken);
                return mediaInsights.reach || 0;
              } catch (e) {
                return 0;
              }
            })
          );
          totalReach = mediaReach.reduce((sum, reach) => sum + reach, 0);
        }
        
        const engagementRate = totalReach > 0 ? (totalEngagement / totalReach) * 100 : 0;

        // Get profile data to supplement insights
        console.log(`[DASHBOARD] Fetching profile data for @${instagramAccount.username}`);
        const profile = await instagramAPI.getUserProfile(instagramAccount.accessToken);
        console.log(`[DASHBOARD] Profile data retrieved:`, JSON.stringify(profile, null, 2));
        
        res.json({
          totalPosts,
          totalReach,
          engagementRate: Math.round(engagementRate * 10) / 10,
          topPlatform: 'instagram',
          followers: profile.followers_count || insights.follower_count || 0,
          impressions: insights.impressions || 0,
          accountUsername: instagramAccount.username,
          totalLikes,
          totalComments,
          mediaCount: profile.media_count || totalPosts
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

  // Create workspace
  app.post('/api/workspaces', requireAuth, async (req: any, res: Response) => {
    try {
      const { user } = req;
      const { name, description, theme } = req.body;

      console.log(`[WORKSPACES] Starting workspace creation for user ${user.id}:`, { name, description, theme });

      if (!name || !name.trim()) {
        console.log(`[WORKSPACES] Validation failed - empty name`);
        return res.status(400).json({ error: 'Workspace name is required' });
      }

      // Check workspace limits directly
      const userPlan = user.plan || 'free';
      console.log(`[WORKSPACES] Getting workspaces for user ${user.id}...`);
      
      const workspaces = await storage.getWorkspacesByUserId(user.id);
      const currentCount = workspaces.length;
      
      console.log(`[WORKSPACES] User ${user.id} has ${currentCount} workspaces on plan ${userPlan}`);
      console.log(`[WORKSPACES] Checking access control...`);
      
      const access = AccessControl.canCreateWorkspace(userPlan, currentCount);
      
      console.log(`[WORKSPACES] Access control result:`, access);
      
      if (!access.allowed) {
        const upgradeMessage = AccessControl.generateUpgradeMessage(userPlan, 'workspaces');
        console.log(`[WORKSPACES] BLOCKING workspace creation - plan limit reached`);
        return res.status(403).json({ 
          error: access.reason,
          upgradeMessage,
          currentWorkspaces: currentCount,
          maxWorkspaces: AccessControl.getPlanLimits(userPlan).workspaces,
          currentPlan: userPlan
        });
      }

      console.log(`[WORKSPACES] Validation passed, creating workspace for user ${user.id}`);

      const workspaceData = {
        userId: user.id,
        name: name.trim(),
        description: description?.trim() || null,
        theme: theme || 'default',
        isDefault: false,
        credits: 50 // Give new workspaces 50 credits to start
      };

      console.log(`[WORKSPACES] Calling storage.createWorkspace with data:`, workspaceData);
      const newWorkspace = await storage.createWorkspace(workspaceData);
      
      console.log(`[WORKSPACES] Successfully created workspace ${newWorkspace.id}: ${newWorkspace.name}`);
      
      res.json(newWorkspace);
    } catch (error: any) {
      console.error('[WORKSPACES] Error creating workspace:', error);
      res.status(500).json({ error: error.message });
    }
  });

  // Update workspace
  app.put('/api/workspaces/:id', requireAuth, async (req: any, res: Response) => {
    try {
      const { user } = req;
      const workspaceId = req.params.id;
      const { name, description, theme } = req.body;

      console.log(`[WORKSPACES] Updating workspace ${workspaceId} for user ${user.id}`);

      if (!name || !name.trim()) {
        return res.status(400).json({ error: 'Workspace name is required' });
      }

      // Verify user owns this workspace
      const workspace = await storage.getWorkspace(workspaceId);
      if (!workspace || workspace.userId !== user.id) {
        return res.status(403).json({ error: 'Access denied to workspace' });
      }

      const updateData = {
        name: name.trim(),
        description: description?.trim() || null,
        theme: theme || workspace.theme
      };

      console.log(`[WORKSPACES] Updating workspace with data:`, updateData);
      const updatedWorkspace = await storage.updateWorkspace(workspaceId, updateData);
      
      console.log(`[WORKSPACES] Successfully updated workspace ${workspaceId}`);
      res.json(updatedWorkspace);
    } catch (error: any) {
      console.error('[WORKSPACES] Error updating workspace:', error);
      res.status(500).json({ error: error.message });
    }
  });

  // Delete workspace
  app.delete('/api/workspaces/:id', requireAuth, async (req: any, res: Response) => {
    try {
      const { user } = req;
      const workspaceId = req.params.id;

      console.log(`[WORKSPACES] Deleting workspace ${workspaceId} for user ${user.id}`);

      // Verify user owns this workspace
      const workspace = await storage.getWorkspace(workspaceId);
      if (!workspace || workspace.userId !== user.id) {
        return res.status(403).json({ error: 'Access denied to workspace' });
      }

      // Prevent deletion of default workspace
      if (workspace.isDefault) {
        return res.status(400).json({ error: 'Cannot delete default workspace' });
      }

      await storage.deleteWorkspace(workspaceId);
      
      console.log(`[WORKSPACES] Successfully deleted workspace ${workspaceId}`);
      res.json({ success: true });
    } catch (error: any) {
      console.error('[WORKSPACES] Error deleting workspace:', error);
      res.status(500).json({ error: error.message });
    }
  });

  // Set default workspace
  app.put('/api/workspaces/:id/default', requireAuth, async (req: any, res: Response) => {
    try {
      const { user } = req;
      const workspaceId = req.params.id;

      console.log(`[WORKSPACES] Setting default workspace ${workspaceId} for user ${user.id}`);

      // Verify user owns this workspace
      const workspace = await storage.getWorkspace(workspaceId);
      if (!workspace || workspace.userId !== user.id) {
        return res.status(403).json({ error: 'Access denied to workspace' });
      }

      await storage.setDefaultWorkspace(user.id, workspaceId);
      
      console.log(`[WORKSPACES] Successfully set default workspace ${workspaceId}`);
      res.json({ success: true });
    } catch (error: any) {
      console.error('[WORKSPACES] Error setting default workspace:', error);
      res.status(500).json({ error: error.message });
    }
  });

  // Publish content to Instagram
  app.post('/api/instagram/publish', requireAuth, async (req: any, res: Response) => {
    try {
      const { workspaceId, contentType, imageUrl, videoUrl, caption } = req.body;

      if (!workspaceId) {
        return res.status(400).json({ error: 'Workspace ID is required' });
      }

      if (!caption) {
        return res.status(400).json({ error: 'Caption is required' });
      }

      if (contentType === 'image' && !imageUrl) {
        return res.status(400).json({ error: 'Image URL is required for image posts' });
      }

      if (contentType === 'video' && !videoUrl) {
        return res.status(400).json({ error: 'Video URL is required for video posts' });
      }

      // Get Instagram account for this workspace
      const instagramAccount = await storage.getSocialAccountByPlatform(workspaceId, 'instagram');
      if (!instagramAccount) {
        return res.status(404).json({ error: 'Instagram account not connected for this workspace' });
      }

      console.log(`[INSTAGRAM PUBLISH] Publishing ${contentType} to @${instagramAccount.username}`);

      let publishResult;
      if (contentType === 'image') {
        publishResult = await instagramAPI.publishPhoto(
          instagramAccount.accessToken,
          imageUrl,
          caption
        );
      } else if (contentType === 'video') {
        try {
          publishResult = await instagramAPI.publishVideo(
            instagramAccount.accessToken,
            videoUrl,
            caption
          );
        } catch (videoError: any) {
          console.log(`[INSTAGRAM PUBLISH] Video publish failed, trying with intelligent compression`);
          const { DirectInstagramPublisher } = await import('./direct-instagram-publisher');
          publishResult = await DirectInstagramPublisher.publishVideoWithIntelligentCompression(
            instagramAccount.accessToken, 
            videoUrl, 
            caption
          );
        }
      } else {
        return res.status(400).json({ error: 'Invalid content type. Must be "image" or "video"' });
      }

      console.log(`[INSTAGRAM PUBLISH] Successfully published to Instagram:`, publishResult);

      // Save the published content to database
      const contentData = {
        workspaceId: parseInt(workspaceId),
        platform: 'instagram' as const,
        content: caption,
        mediaUrl: imageUrl || videoUrl,
        status: 'published' as const,
        scheduledFor: new Date(),
        publishedAt: new Date(),
        instagramPostId: publishResult.id
      };

      const savedContent = await storage.createContent(contentData);

      res.json({
        success: true,
        publishResult,
        content: savedContent,
        message: `Successfully published ${contentType} to Instagram @${instagramAccount.username}`
      });

    } catch (error: any) {
      console.error('[INSTAGRAM PUBLISH] Publish error:', error);
      res.status(500).json({ 
        error: 'Failed to publish to Instagram', 
        details: error.message 
      });
    }
  });

  // ==================== SUBSCRIPTION & PAYMENT ROUTES ====================
  
  // Import payment services
  const { razorpayService } = await import('./razorpay-service');
  const { creditService } = await import('./credit-service');
  const { SUBSCRIPTION_PLANS, CREDIT_PACKAGES, ADDONS } = await import('./pricing-config');

  // Get pricing information
  app.get('/api/pricing', (req: Request, res: Response) => {
    res.json({
      plans: SUBSCRIPTION_PLANS,
      creditPackages: CREDIT_PACKAGES,
      addons: ADDONS
    });
  });

  // Get user's subscription and credit information
  app.get('/api/subscription', requireAuth, async (req: any, res: Response) => {
    try {
      const userId = req.user.id;
      const creditInfo = await creditService.getUserCreditInfo(userId);
      res.json(creditInfo);
    } catch (error: any) {
      console.error('[SUBSCRIPTION] Failed to get subscription info:', error);
      res.status(500).json({ error: 'Failed to get subscription information' });
    }
  });

  // Create subscription order
  app.post('/api/subscription/create-order', requireAuth, async (req: any, res: Response) => {
    try {
      const { planId } = req.body;
      const userId = req.user.id;

      if (!planId || planId === 'free') {
        return res.status(400).json({ error: 'Invalid plan selection' });
      }

      const order = await razorpayService.createSubscriptionOrder(planId, userId.toString());
      res.json(order);
    } catch (error: any) {
      console.error('[SUBSCRIPTION] Order creation failed:', error);
      res.status(500).json({ error: error.message });
    }
  });

  // Create credit purchase order
  app.post('/api/credits/create-order', requireAuth, async (req: any, res: Response) => {
    try {
      const { packageId } = req.body;
      const userId = req.user.id;

      if (!packageId) {
        return res.status(400).json({ error: 'Package ID is required' });
      }

      const order = await razorpayService.createCreditOrder(packageId, userId.toString());
      res.json(order);
    } catch (error: any) {
      console.error('[CREDITS] Order creation failed:', error);
      res.status(500).json({ error: error.message });
    }
  });

  // Create addon order
  app.post('/api/addons/create-order', requireAuth, async (req: any, res: Response) => {
    try {
      const { addonId } = req.body;
      const userId = req.user.id;

      if (!addonId) {
        return res.status(400).json({ error: 'Addon ID is required' });
      }

      const order = await razorpayService.createAddonOrder(addonId, userId.toString());
      res.json(order);
    } catch (error: any) {
      console.error('[ADDON] Order creation failed:', error);
      res.status(500).json({ error: error.message });
    }
  });

  // Verify payment and process subscription
  app.post('/api/payment/verify', requireAuth, async (req: any, res: Response) => {
    try {
      const { 
        razorpay_order_id, 
        razorpay_payment_id, 
        razorpay_signature,
        purpose 
      } = req.body;
      const userId = req.user.id;

      // Verify payment signature
      const isValid = razorpayService.verifyPaymentSignature(
        razorpay_order_id,
        razorpay_payment_id,
        razorpay_signature
      );

      if (!isValid) {
        return res.status(400).json({ error: 'Invalid payment signature' });
      }

      // Get payment and order details
      const payment = await razorpayService.getPayment(razorpay_payment_id);
      const order = await razorpayService.getOrder(razorpay_order_id);

      if (payment.status !== 'captured') {
        return res.status(400).json({ error: 'Payment not captured' });
      }

      // Save payment record
      await storage.createPayment({
        userId,
        razorpayOrderId: razorpay_order_id,
        razorpayPaymentId: razorpay_payment_id,
        razorpaySignature: razorpay_signature,
        amount: Number(order.amount) / 100, // Convert from paise
        currency: order.currency,
        status: 'paid',
        purpose: order.notes?.purpose || 'unknown',
        metadata: {
          orderId: razorpay_order_id,
          planId: order.notes?.planId,
          packageId: order.notes?.packageId,
          addonId: order.notes?.addonId
        }
      });

      // Process based on payment purpose
      if (order.notes?.purpose === 'subscription') {
        await processSubscriptionPayment(userId, order.notes.planId as string);
      } else if (order.notes?.purpose === 'credits') {
        await processCreditPurchase(userId, order.notes);
      } else if (order.notes?.purpose === 'addon') {
        await processAddonPurchase(userId, order.notes);
      }

      res.json({ 
        success: true, 
        message: 'Payment processed successfully',
        purpose: order.notes?.purpose || 'unknown'
      });

    } catch (error: any) {
      console.error('[PAYMENT] Verification failed:', error);
      res.status(500).json({ error: 'Payment verification failed' });
    }
  });

  // Process subscription payment
  async function processSubscriptionPayment(userId: number, planId: string) {
    const plan = SUBSCRIPTION_PLANS[planId as keyof typeof SUBSCRIPTION_PLANS];
    if (!plan) throw new Error('Invalid plan');

    const now = new Date();
    const nextMonth = new Date(now.getFullYear(), now.getMonth() + 1, now.getDate());

    // Create subscription record
    await storage.createSubscription({
      userId,
      plan: plan.id,
      status: 'active',
      currentPeriodStart: now,
      currentPeriodEnd: nextMonth,
      monthlyCredits: plan.credits,
      extraCredits: 0,
      autoRenew: true
    });

    // Update user plan
    await storage.updateUser(userId, { plan: plan.id });

    // Add monthly credits
    await creditService.addCredits(
      userId,
      plan.credits,
      'earned',
      `${plan.name} subscription credits`,
      `subscription_${planId}`
    );
  }

  // Process credit purchase
  async function processCreditPurchase(userId: number, orderNotes: any) {
    const baseCredits = parseInt(orderNotes.baseCredits);
    const bonusCredits = parseInt(orderNotes.bonusCredits);
    const totalCredits = parseInt(orderNotes.totalCredits);

    await creditService.addCredits(
      userId,
      totalCredits,
      'purchase',
      `Credit package purchase: ${baseCredits} + ${bonusCredits} bonus`,
      `credit_purchase_${orderNotes.packageId}`
    );
  }

  // Process addon purchase
  async function processAddonPurchase(userId: number, orderNotes: any) {
    const addon = ADDONS[orderNotes.addonId as keyof typeof ADDONS];
    if (!addon) throw new Error('Invalid addon');

    const now = new Date();
    const expiresAt = new Date(now.getFullYear(), now.getMonth() + 1, now.getDate());

    await storage.createAddon({
      userId,
      type: addon.type,
      name: addon.name,
      price: addon.price,
      isActive: true,
      expiresAt,
      metadata: { addonId: addon.id }
    });
  }

  // Get credit transaction history
  app.get('/api/credits/history', requireAuth, async (req: any, res: Response) => {
    try {
      const userId = req.user.id;
      const limit = parseInt(req.query.limit as string) || 50;
      const history = await creditService.getCreditHistory(userId, limit);
      res.json(history);
    } catch (error: any) {
      console.error('[CREDITS] Failed to get history:', error);
      res.status(500).json({ error: 'Failed to get credit history' });
    }
  });

  // Check credit cost for a feature
  app.get('/api/credits/cost/:feature', requireAuth, async (req: any, res: Response) => {
    try {
      const { feature } = req.params;
      const quantity = parseInt(req.query.quantity as string) || 1;
      
      const cost = creditService.getCreditCost(feature, quantity);
      const userId = req.user.id;
      const hasCredits = await creditService.hasCredits(userId, feature, quantity);
      
      res.json({ 
        feature,
        quantity,
        cost,
        hasCredits,
        userCredits: await creditService.getUserCredits(userId)
      });
    } catch (error: any) {
      console.error('[CREDITS] Cost check failed:', error);
      res.status(500).json({ error: error.message });
    }
  });

  // ==================== SUBSCRIPTION ROUTES ====================
  
  // Get user subscription status
  app.get('/api/subscription', requireAuth, async (req: any, res: Response) => {
    try {
      const userId = req.user.id;
      const subscriptionService = await import('./subscription-service');
      const status = await subscriptionService.SubscriptionService.getUserSubscriptionStatus(userId);
      res.json(status);
    } catch (error: any) {
      console.error('[SUBSCRIPTION] Failed to get status:', error);
      res.status(500).json({ error: 'Failed to get subscription status' });
    }
  });

  // Create Razorpay order for subscription
  app.post('/api/subscription/create-order', requireAuth, async (req: any, res: Response) => {
    try {
      const { planId } = req.body;
      const userId = req.user.id;
      
      if (!planId || !['creator', 'pro', 'enterprise'].includes(planId)) {
        return res.status(400).json({ error: 'Invalid plan ID' });
      }

      const subscriptionService = await import('./subscription-service');
      const order = await subscriptionService.SubscriptionService.createSubscription(userId, planId);
      
      res.json({
        success: true,
        orderId: order.orderId,
        amount: order.amount,
        currency: order.currency,
        key: process.env.RAZORPAY_KEY_ID
      });
    } catch (error: any) {
      console.error('[SUBSCRIPTION] Failed to create order:', error);
      res.status(500).json({ error: 'Failed to create subscription order' });
    }
  });

  // Verify Razorpay payment and activate subscription
  app.post('/api/subscription/verify-payment', requireAuth, async (req: any, res: Response) => {
    try {
      const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;
      
      if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
        return res.status(400).json({ error: 'Missing payment verification data' });
      }

      const subscriptionService = await import('./subscription-service');
      
      // Verify payment signature
      const isValid = await subscriptionService.SubscriptionService.verifyPayment(
        razorpay_order_id,
        razorpay_payment_id,
        razorpay_signature
      );

      if (!isValid) {
        return res.status(400).json({ error: 'Invalid payment signature' });
      }

      // Handle successful payment
      await subscriptionService.SubscriptionService.handleSuccessfulPayment(
        razorpay_order_id,
        razorpay_payment_id,
        razorpay_signature
      );

      res.json({ success: true, message: 'Subscription activated successfully' });
    } catch (error: any) {
      console.error('[SUBSCRIPTION] Payment verification failed:', error);
      res.status(500).json({ error: 'Payment verification failed' });
    }
  });

  // Cancel subscription
  app.post('/api/subscription/cancel', requireAuth, async (req: any, res: Response) => {
    try {
      const userId = req.user.id;
      const subscriptionService = await import('./subscription-service');
      
      await subscriptionService.SubscriptionService.cancelSubscription(userId);
      
      res.json({ success: true, message: 'Subscription canceled successfully' });
    } catch (error: any) {
      console.error('[SUBSCRIPTION] Failed to cancel subscription:', error);
      res.status(500).json({ error: 'Failed to cancel subscription' });
    }
  });

  // Get plan limits and features
  app.get('/api/subscription/plans', async (req: Request, res: Response) => {
    try {
      const subscriptionService = await import('./subscription-service');
      res.json({
        plans: subscriptionService.PLAN_LIMITS,
        pricing: subscriptionService.PLAN_PRICING
      });
    } catch (error: any) {
      console.error('[SUBSCRIPTION] Failed to get plans:', error);
      res.status(500).json({ error: 'Failed to get subscription plans' });
    }
  });

  // Check feature access
  app.get('/api/subscription/feature/:feature', requireAuth, async (req: any, res: Response) => {
    try {
      const { feature } = req.params;
      const userId = req.user.id;
      
      const subscriptionService = await import('./subscription-service');
      const hasAccess = await subscriptionService.SubscriptionService.checkFeatureAccess(userId, feature);
      
      res.json({ hasAccess, feature });
    } catch (error: any) {
      console.error('[SUBSCRIPTION] Feature check failed:', error);
      res.status(500).json({ error: 'Failed to check feature access' });
    }
  });

  // Refresh monthly credits (admin endpoint for testing)
  app.post('/api/subscription/refresh-credits', requireAuth, async (req: any, res: Response) => {
    try {
      const userId = req.user.id;
      const subscriptionService = await import('./subscription-service');
      
      await subscriptionService.SubscriptionService.refreshCredits(userId);
      
      res.json({ success: true, message: 'Credits refreshed successfully' });
    } catch (error: any) {
      console.error('[SUBSCRIPTION] Failed to refresh credits:', error);
      res.status(500).json({ error: 'Failed to refresh credits' });
    }
  });

  // Consume credits for a feature
  app.post('/api/credits/consume', requireAuth, async (req: any, res: Response) => {
    try {
      const { feature, quantity = 1, description } = req.body;
      const userId = req.user.id;

      if (!feature) {
        return res.status(400).json({ error: 'Feature type is required' });
      }

      const success = await creditService.consumeCredits(userId, feature, quantity, description);
      
      if (!success) {
        return res.status(400).json({ 
          error: 'Insufficient credits',
          required: creditService.getCreditCost(feature, quantity),
          available: await creditService.getUserCredits(userId)
        });
      }

      res.json({ 
        success: true,
        creditsUsed: creditService.getCreditCost(feature, quantity),
        remainingCredits: await creditService.getUserCredits(userId)
      });
    } catch (error: any) {
      console.error('[CREDITS] Consumption failed:', error);
      res.status(500).json({ error: error.message });
    }
  });

  // Get user's active addons
  app.get('/api/addons', requireAuth, async (req: any, res: Response) => {
    try {
      const userId = req.user.id;
      const addons = await storage.getUserAddons(userId);
      res.json(addons);
    } catch (error: any) {
      console.error('[ADDONS] Failed to get addons:', error);
      res.status(500).json({ error: 'Failed to get addons' });
    }
  });

  // Cancel subscription
  app.post('/api/subscription/cancel', requireAuth, async (req: any, res: Response) => {
    try {
      const userId = req.user.id;
      
      // Update subscription status
      await storage.updateSubscriptionStatus(userId, 'canceled', new Date());
      
      // Update user plan to free
      await storage.updateUser(userId, { plan: 'free' });

      res.json({ success: true, message: 'Subscription cancelled successfully' });
    } catch (error: any) {
      console.error('[SUBSCRIPTION] Cancellation failed:', error);
      res.status(500).json({ error: 'Failed to cancel subscription' });
    }
  });

  // Referral endpoints
  app.post('/api/referrals/reward', requireAuth, async (req: any, res: Response) => {
    try {
      const { type } = req.body;
      const userId = req.user.id;

      if (!['inviteFriend', 'submitFeedback'].includes(type)) {
        return res.status(400).json({ error: 'Invalid referral type' });
      }

      await creditService.awardReferralCredits(userId, type);
      
      res.json({ 
        success: true, 
        message: `Referral reward credited`,
        credits: await creditService.getUserCredits(userId)
      });
    } catch (error: any) {
      console.error('[REFERRAL] Reward failed:', error);
      res.status(500).json({ error: 'Failed to process referral reward' });
    }
  });

  // ==================== AI SUGGESTIONS ROUTES ====================
  
  // Get AI suggestions for workspace
  app.get('/api/suggestions', requireAuth, async (req: any, res: Response) => {
    try {
      const userId = req.user.id;
      const workspaceId = req.query.workspaceId;
      
      if (!workspaceId) {
        return res.status(400).json({ error: 'Workspace ID required' });
      }
      
      // Get suggestions from storage
      const suggestions = await storage.getSuggestionsByWorkspace(workspaceId);
      
      console.log(`[SUGGESTIONS] Found ${suggestions.length} suggestions for workspace ${workspaceId}`);
      res.json(suggestions);
    } catch (error: any) {
      console.error('[SUGGESTIONS] Failed to get suggestions:', error);
      res.status(500).json({ error: 'Failed to get suggestions' });
    }
  });

  // Generate new AI suggestions
  app.post('/api/suggestions/generate', requireAuth, requireFeature('ai_suggestions'), async (req: any, res: Response) => {
    try {
      const userId = req.user.id;
      const { workspaceId } = req.body;
      
      if (!workspaceId) {
        return res.status(400).json({ error: 'Workspace ID required' });
      }
      
      // Check credits
      const creditCost = creditService.getCreditCost('ai_suggestions');
      const hasCredits = await creditService.hasCredits(userId, 'ai_suggestions');
      
      if (!hasCredits) {
        return res.status(402).json({ 
          error: 'Insufficient credits',
          required: creditCost,
          current: await creditService.getUserCredits(userId)
        });
      }
      
      console.log(`[AI SUGGESTIONS] Generating suggestions for workspace ${workspaceId}`);
      
      // Get workspace and analytics data for AI context
      const workspace = await storage.getWorkspace(workspaceId);
      const socialAccounts = await storage.getSocialAccountsByWorkspace(workspaceId);
      const recentAnalytics = await storage.getAnalyticsByWorkspace(workspaceId);
      const recentContent = await storage.getContentByWorkspace(workspaceId);
      
      console.log('[AI SUGGESTIONS DEBUG] Data retrieval:');
      console.log('- Workspace:', workspace?.name);
      console.log('- Social accounts:', socialAccounts?.length || 0);
      console.log('- Analytics entries:', recentAnalytics?.length || 0);
      console.log('- Content entries:', recentContent?.length || 0);
      
      if (socialAccounts?.length > 0) {
        const account = socialAccounts[0];
        console.log('- Instagram account:', account?.username, 'followers:', account?.followersCount);
        console.log('- Account details:', JSON.stringify({
          platform: account?.platform,
          accountId: account?.accountId,
          mediaCount: account?.mediaCount,
          accountType: account?.accountType,
          isBusinessAccount: account?.isBusinessAccount
        }, null, 2));
      }
      
      // Generate AI-powered suggestions based on real data
      const suggestions = await generateIntelligentSuggestions(workspace, socialAccounts, recentAnalytics, recentContent);
      
      // Sync Instagram account data before generating suggestions
      try {
        await syncInstagramData(socialAccounts);
      } catch (syncError) {
        console.log('[AI SUGGESTIONS] Instagram sync failed, proceeding with existing data:', syncError.message);
      }

      // Save suggestions to storage
      const savedSuggestions = [];
      for (const suggestion of suggestions) {
        const saved = await storage.createSuggestion({
          workspaceId: workspaceId,
          type: suggestion.type,
          data: suggestion.data,
          confidence: suggestion.confidence,
          validUntil: suggestion.validUntil
        });
        savedSuggestions.push(saved);
      }
      
      // Deduct credits
      await creditService.deductCredits(userId, creditCost, 'AI suggestions generation');
      
      console.log(`[AI SUGGESTIONS] Generated ${savedSuggestions.length} suggestions successfully`);
      res.json({ 
        suggestions: savedSuggestions,
        creditsUsed: creditCost,
        remainingCredits: await creditService.getUserCredits(userId)
      });
      
    } catch (error: any) {
      console.error('[AI SUGGESTIONS] Generation failed:', error);
      res.status(500).json({ error: 'Failed to generate suggestions' });
    }
  });

  const http = await import('http');
  return http.createServer(app);
}