import type { Express, Response, NextFunction } from "express";
import { createServer, type Server } from "http";
import { getAuthenticHashtags } from "./authentic-hashtags";
import { IStorage } from "./storage";

export async function registerRoutes(app: Express, storage: IStorage): Promise<Server> {
  const requireAuth = async (req: any, res: Response, next: NextFunction) => {
    try {
      const authHeader = req.headers.authorization;
      
      if (!authHeader) {
        return res.status(401).json({ error: 'Unauthorized' });
      }

      const token = authHeader.split(' ')[1];
      if (!token) {
        return res.status(401).json({ error: 'Unauthorized' });
      }

      // Extract Firebase UID from JWT token payload
      let firebaseUid;
      try {
        const payload = JSON.parse(Buffer.from(token.split('.')[1], 'base64').toString());
        firebaseUid = payload.user_id || payload.sub;
      } catch (error) {
        return res.status(401).json({ error: 'Invalid token format' });
      }
      
      let user = await storage.getUserByFirebaseUid(firebaseUid);
      if (!user) {
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
          
          // Create default workspace for new users
          try {
            await storage.createWorkspace({
              userId: user.id,
              name: 'My VeeFore Workspace',
              description: 'Default workspace for social media management'
            });
          } catch (workspaceError) {
            console.error('Failed to create default workspace:', workspaceError);
          }
        } catch (error) {
          return res.status(500).json({ error: 'Failed to create user account' });
        }
      }
      
      req.user = user;
      next();
    } catch (error) {
      console.error('Authentication failed:', error);
      res.status(401).json({ error: 'Unauthorized' });
    }
  };

  // Get current user
  app.get('/api/user', requireAuth, async (req: any, res: Response) => {
    try {
      res.json(req.user);
    } catch (error: any) {
      console.error('Error fetching user:', error);
      res.status(500).json({ error: error.message });
    }
  });

  // Clean hashtags endpoint that only returns authentic Instagram data
  app.get("/api/hashtags/trending", requireAuth, async (req: any, res: any) => {
    try {
      const { category = 'all' } = req.query;
      const userId = req.user.id;
      
      // Get user's workspace
      const workspaces = await storage.getWorkspacesByUserId(userId);
      const defaultWorkspace = workspaces.find((w: any) => w.isDefault) || workspaces[0];
      
      if (!defaultWorkspace) {
        return res.json([]);
      }

      // Get connected Instagram accounts only
      const instagramAccounts = await storage.getSocialAccountsByWorkspace(defaultWorkspace.id);
      const connectedInstagramAccounts = instagramAccounts.filter((acc: any) => 
        acc.platform === 'instagram' && acc.accessToken
      );

      if (connectedInstagramAccounts.length === 0) {
        console.log('[HASHTAGS] No connected Instagram accounts found');
        return res.json([]);
      }

      // Get authentic hashtags from connected Instagram accounts
      const authenticHashtags = await getAuthenticHashtags(defaultWorkspace.id.toString(), category);
      
      console.log('[HASHTAGS] Returning', authenticHashtags.length, 'authentic hashtags');
      res.json(authenticHashtags);

    } catch (error) {
      console.error('[HASHTAGS] Error fetching authentic hashtags:', error);
      res.status(500).json({ error: 'Failed to fetch authentic hashtags' });
    }
  });

  // Get workspaces for user
  app.get('/api/workspaces', requireAuth, async (req: any, res: Response) => {
    try {
      const workspaces = await storage.getWorkspacesByUserId(req.user.id);
      res.json(workspaces);
    } catch (error: any) {
      console.error('Error fetching workspaces:', error);
      res.status(500).json({ error: error.message });
    }
  });

  // Create workspace
  app.post('/api/workspaces', requireAuth, async (req: any, res: Response) => {
    try {
      const workspaceData = {
        ...req.body,
        userId: req.user.id
      };
      const workspace = await storage.createWorkspace(workspaceData);
      res.json(workspace);
    } catch (error: any) {
      console.error('Error creating workspace:', error);
      res.status(500).json({ error: error.message });
    }
  });

  // Get credit transactions
  app.get('/api/credit-transactions', requireAuth, async (req: any, res: Response) => {
    try {
      const transactions = await storage.getCreditTransactions(req.user.id);
      res.json(transactions);
    } catch (error: any) {
      console.error('Error fetching credit transactions:', error);
      res.status(500).json({ error: error.message });
    }
  });

  // Dashboard analytics endpoint
  app.get('/api/dashboard/analytics', requireAuth, async (req: any, res: Response) => {
    try {
      const { user } = req;
      const workspaceId = req.query.workspaceId;
      
      let workspace;
      if (workspaceId) {
        workspace = await storage.getWorkspace(workspaceId);
        if (!workspace || workspace.userId !== user.id) {
          return res.status(403).json({ error: 'Workspace not found or access denied' });
        }
      } else {
        const workspaces = await storage.getWorkspacesByUserId(user.id);
        workspace = workspaces.find((w: any) => w.isDefault) || workspaces[0];
      }
      
      if (!workspace) {
        return res.json({ totalPosts: 0, totalReach: 0, engagementRate: 0, topPlatform: 'none' });
      }

      // Get connected Instagram accounts
      const socialAccounts = await storage.getSocialAccountsByWorkspace(workspace.id);
      const instagramAccount = socialAccounts.find((acc: any) => acc.platform === 'instagram' && acc.accessToken);
      
      if (!instagramAccount) {
        return res.json({ 
          totalPosts: 0, 
          totalReach: 0, 
          engagementRate: 0, 
          topPlatform: 'none',
          message: 'No Instagram account connected'
        });
      }

      // Return stored Instagram data from MongoDB using actual field names
      const analyticsData = {
        totalPosts: instagramAccount.mediaCount || 0,
        totalReach: instagramAccount.avgReach || 0,
        engagementRate: instagramAccount.avgEngagement || 0,
        topPlatform: 'instagram',
        followers: instagramAccount.followers || 0,
        impressions: instagramAccount.avgReach || 0,
        accountUsername: instagramAccount.username,
        totalLikes: instagramAccount.avgLikes || 0,
        totalComments: instagramAccount.avgComments || 0,
        mediaCount: instagramAccount.mediaCount || 0
      };

      res.json(analyticsData);

    } catch (error: any) {
      console.error('Error fetching dashboard analytics:', error);
      res.status(500).json({ error: error.message });
    }
  });

  // Chat performance endpoint
  app.get("/api/chat-performance", requireAuth, async (req: any, res: any) => {
    try {
      const userId = req.user.id;
      const { workspaceId } = req.query;

      // Return empty performance data for now
      res.json([]);

    } catch (error) {
      console.error('[CHAT PERFORMANCE] Error analyzing chat performance:', error);
      res.status(500).json({ error: 'Failed to analyze chat performance' });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}