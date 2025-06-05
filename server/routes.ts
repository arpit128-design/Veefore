import { Express, Request, Response, NextFunction } from "express";
import { IStorage } from "./storage";
import { instagramAPI } from "./instagram-api";
import { videoGeneratorAI } from "./video-generator";
import { Server } from "http";
import { WebSocketServer, WebSocket } from "ws";

const INSTAGRAM_ACCESS_TOKEN = process.env.INSTAGRAM_ACCESS_TOKEN;

export async function registerRoutes(app: Express, storage: IStorage): Promise<Server> {
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
          user = await storage.createUser({
            firebaseUid: firebaseUid,
            email: payload.email,
            username: payload.email.split('@')[0],
            displayName: payload.name || null,
            avatar: payload.picture || null,
            credits: 50, // Initial credits
            plan: 'free'
          });
          console.log(`[AUTH DEBUG] Created new user: ${user.id} (${user.email})`);
        } catch (createError) {
          console.log(`[AUTH ERROR] Failed to create user:`, createError);
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

  // Dashboard analytics with real-time Instagram data
  app.get("/api/dashboard/analytics", requireAuth, async (req: any, res) => {
    try {
      const user = req.user;
      const userId = typeof user.id === 'string' ? user.id : Number(user.id);
      const workspaces = await storage.getWorkspacesByUserId(userId);
      
      let defaultWorkspace;
      if (workspaces.length === 0) {
        defaultWorkspace = await storage.createWorkspace({
          userId: userId,
          name: "My VeeFore Workspace",
          description: "Default workspace for content creation"
        });
      } else {
        defaultWorkspace = workspaces[0];
      }

      // Always fetch fresh Instagram data for real-time updates
      if (INSTAGRAM_ACCESS_TOKEN) {
        console.log(`[LIVE UPDATE] Fetching current Instagram metrics`);
        
        try {
          const userProfile = await instagramAPI.getUserProfile(INSTAGRAM_ACCESS_TOKEN);
          const userMedia = await instagramAPI.getUserMedia(INSTAGRAM_ACCESS_TOKEN, 25);
          
          // Calculate comprehensive metrics from Business API
          const totalViews = userMedia.reduce((sum, media) => sum + (media.views || 0), 0);
          const totalImpressions = userMedia.reduce((sum, media) => sum + (media.impressions || 0), 0);
          const totalReach = userMedia.reduce((sum, media) => sum + (media.reach || 0), 0);
          const totalEngagement = userMedia.reduce((sum, media) => {
            const likes = media.like_count || 0;
            const comments = media.comments_count || 0;
            const engagement = media.engagement || 0;
            return sum + Math.max(likes + comments, engagement);
          }, 0);
          
          // Fetch account-level insights for additional metrics
          let accountInsights = null;
          try {
            accountInsights = await instagramAPI.getAccountInsights(INSTAGRAM_ACCESS_TOKEN, 'day');
            console.log(`[INSTAGRAM BUSINESS API] Account insights:`, accountInsights);
          } catch (insightsError) {
            console.log(`[INSTAGRAM BUSINESS API] Account insights not available:`, insightsError);
          }
          
          // Get historical data for percentage calculations
          const yesterday = new Date();
          yesterday.setDate(yesterday.getDate() - 1);
          
          const historicalAnalytics = await storage.getAnalytics(defaultWorkspace.id, 'instagram', 7);
          
          // Calculate percentage changes
          const calculateChange = (current: number, previous: number): number => {
            if (previous === 0) return current > 0 ? 100 : 0;
            return Math.round(((current - previous) / previous) * 100);
          };
          
          let changes = {
            views: 0,
            engagement: 0,
            reach: 0,
            followers: 0
          };
          
          if (historicalAnalytics.length > 1) {
            const previous = historicalAnalytics[historicalAnalytics.length - 2];
            const prevMetrics = previous.metrics as any;
            
            changes = {
              views: calculateChange(totalViews, prevMetrics.views || 0),
              engagement: calculateChange(totalEngagement, prevMetrics.engagement || 0),
              reach: calculateChange(totalReach, prevMetrics.reach || 0),
              followers: calculateChange(userProfile.followers_count, prevMetrics.followers || 0)
            };
          }

          const liveData = {
            totalViews: totalViews,
            engagement: totalEngagement,
            totalFollowers: userProfile.followers_count,
            newFollowers: userProfile.followers_count,
            contentScore: 85,
            changes: changes,
            platforms: [{
              platform: 'instagram',
              views: totalViews,
              engagement: totalEngagement,
              followers: userProfile.followers_count,
              posts: userMedia.length,
              impressions: totalImpressions,
              reach: totalReach
            }]
          };
          
          console.log(`[INSTAGRAM BUSINESS API] Analytics: ${userProfile.followers_count} followers, ${totalEngagement} engagement, ${totalViews} views, ${totalImpressions} impressions`);
          
          await storage.createAnalytics({
            workspaceId: defaultWorkspace.id,
            platform: 'instagram',
            date: new Date(),
            metrics: {
              followers: userProfile.followers_count,
              follower_count: userProfile.followers_count,
              engagement: totalEngagement,
              likes: totalEngagement,
              views: totalViews,
              impressions: totalImpressions,
              comments: 0,
              shares: 0,
              reach: totalReach
            }
          });
          
          res.setHeader('Cache-Control', 'no-cache');
          return res.json(liveData);
          
        } catch (error) {
          console.log(`[LIVE UPDATE] Instagram API error:`, error);
        }
      }
      
      // Fallback to latest database data
      const analytics = await storage.getAnalytics(defaultWorkspace.id, undefined, 1);
      if (analytics.length > 0) {
        const latestRecord = analytics[0];
        const latestMetrics = latestRecord?.metrics as any;
        
        const fallbackData = {
          totalViews: latestMetrics?.views || 0,
          engagement: latestMetrics?.engagement || latestMetrics?.likes || 0,
          totalFollowers: latestMetrics?.followers || latestMetrics?.follower_count || 0,
          newFollowers: latestMetrics?.followers || latestMetrics?.follower_count || 0,
          contentScore: 85,
          platforms: [{
            platform: latestRecord.platform,
            views: latestMetrics?.views || 0,
            engagement: latestMetrics?.engagement || latestMetrics?.likes || 0,
            followers: latestMetrics?.followers || latestMetrics?.follower_count || 0,
            posts: 1
          }]
        };
        
        return res.json(fallbackData);
      }
      
      res.json({
        totalViews: 0,
        engagement: 0,
        totalFollowers: 0,
        newFollowers: 0,
        contentScore: 85,
        platforms: []
      });
      
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // Add all other routes
  app.get("/api/user", requireAuth, async (req: any, res) => {
    try {
      const user = req.user;
      res.json(user);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.get("/api/workspaces", requireAuth, async (req: any, res) => {
    try {
      const user = req.user;
      const userId = typeof user.id === 'string' ? user.id : Number(user.id);
      const workspaces = await storage.getWorkspacesByUserId(userId);
      res.json(workspaces);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // Video generation endpoint
  app.post('/api/content/generate-video', requireAuth, async (req: any, res: Response) => {
    try {
      const { description, platform = 'youtube', title, workspaceId } = req.body;

      if (!description?.trim()) {
        return res.status(400).json({ error: 'Video description is required' });
      }

      if (!workspaceId) {
        return res.status(400).json({ error: 'Workspace ID is required' });
      }

      console.log('[VIDEO API] Generating video from description:', description);

      // Generate script and video using AI
      const result = await videoGeneratorAI.createVideoFromDescription(
        description.trim(),
        platform,
        title?.trim()
      );

      // Save content to storage
      const content = await storage.createContent({
        workspaceId: parseInt(workspaceId),
        type: 'video',
        title: result.script.title,
        content: JSON.stringify({
          description,
          script: result.script,
          video: result.video
        }),
        platform,
        status: 'ready',
        scheduledFor: null
      });

      console.log('[VIDEO API] Video generated successfully:', content.id);

      res.json({
        success: true,
        content: content,
        script: result.script,
        video: result.video
      });

    } catch (error: any) {
      console.error('[VIDEO API] Error generating video:', error);
      res.status(500).json({ 
        error: 'Failed to generate video',
        details: error.message 
      });
    }
  });

  // Script generation only endpoint
  app.post('/api/content/generate-script', requireAuth, async (req: any, res: Response) => {
    try {
      const { description, platform = 'youtube', title } = req.body;

      if (!description?.trim()) {
        return res.status(400).json({ error: 'Video description is required' });
      }

      console.log('[SCRIPT API] Generating script for description:', description);

      const script = await videoGeneratorAI.generateVideoScript(
        description.trim(),
        platform,
        title?.trim()
      );

      res.json({
        success: true,
        script: script
      });

    } catch (error: any) {
      console.error('[SCRIPT API] Error generating script:', error);
      res.status(500).json({ 
        error: 'Failed to generate script',
        details: error.message 
      });
    }
  });

  // Return the app instead of creating a new server
  return app as any;
}