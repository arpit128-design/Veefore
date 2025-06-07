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

  // Create workspace with plan restrictions
  app.post('/api/workspaces', requireAuth, async (req: any, res: Response) => {
    try {
      const userId = req.user.id;
      
      // Check user's current subscription plan and workspace count
      const userWorkspaces = await storage.getWorkspacesByUserId(userId);
      const currentPlan = req.user.plan || 'Free';
      
      // Define workspace limits per plan
      const planLimits = {
        'Free': 1,
        'Creator': 3,
        'Agency': 10,
        'Enterprise': 50
      };
      
      const maxWorkspaces = planLimits[currentPlan as keyof typeof planLimits] || 1;
      
      if (userWorkspaces.length >= maxWorkspaces) {
        return res.status(403).json({
          error: 'Workspace limit reached',
          currentPlan: currentPlan,
          currentWorkspaces: userWorkspaces.length,
          maxWorkspaces: maxWorkspaces,
          upgradeMessage: `Your ${currentPlan} plan allows ${maxWorkspaces} workspace${maxWorkspaces > 1 ? 's' : ''}. Upgrade to create more workspaces.`
        });
      }
      
      const workspaceData = {
        ...req.body,
        userId: userId
      };
      const workspace = await storage.createWorkspace(workspaceData);
      res.json(workspace);
    } catch (error: any) {
      console.error('Error creating workspace:', error);
      res.status(500).json({ error: error.message });
    }
  });

  // Update workspace
  app.put('/api/workspaces/:id', requireAuth, async (req: any, res: Response) => {
    try {
      const { user } = req;
      const workspaceId = req.params.id;
      const updates = req.body;

      // Verify user owns this workspace
      const workspace = await storage.getWorkspace(workspaceId);
      if (!workspace || workspace.userId !== user.id) {
        return res.status(403).json({ error: 'Access denied to workspace' });
      }

      const updatedWorkspace = await storage.updateWorkspace(workspaceId, updates);
      res.json(updatedWorkspace);
    } catch (error: any) {
      console.error('Error updating workspace:', error);
      res.status(500).json({ error: error.message });
    }
  });

  // Delete workspace
  app.delete('/api/workspaces/:id', requireAuth, async (req: any, res: Response) => {
    try {
      const { user } = req;
      const workspaceId = req.params.id;

      // Verify user owns this workspace
      const workspace = await storage.getWorkspace(workspaceId);
      if (!workspace || workspace.userId !== user.id) {
        return res.status(403).json({ error: 'Access denied to workspace' });
      }

      // Prevent deleting the last/default workspace
      const userWorkspaces = await storage.getWorkspacesByUserId(user.id);
      if (userWorkspaces.length <= 1) {
        return res.status(400).json({ error: 'Cannot delete your only workspace' });
      }

      await storage.deleteWorkspace(workspaceId);
      res.json({ success: true });
    } catch (error: any) {
      console.error('Error deleting workspace:', error);
      res.status(500).json({ error: error.message });
    }
  });

  // Set default workspace
  app.put('/api/workspaces/:id/default', requireAuth, async (req: any, res: Response) => {
    try {
      const { user } = req;
      const workspaceId = req.params.id;

      // Verify user owns this workspace
      const workspace = await storage.getWorkspace(workspaceId);
      if (!workspace || workspace.userId !== user.id) {
        return res.status(403).json({ error: 'Access denied to workspace' });
      }

      await storage.setDefaultWorkspace(user.id, workspaceId);
      res.json({ success: true });
    } catch (error: any) {
      console.error('Error setting default workspace:', error);
      res.status(500).json({ error: error.message });
    }
  });

  // Get workspace members
  app.get('/api/workspaces/:workspaceId/members', requireAuth, async (req: any, res: Response) => {
    try {
      const { user } = req;
      const workspaceId = req.params.workspaceId;

      // Verify user has access to this workspace
      const workspace = await storage.getWorkspace(workspaceId);
      if (!workspace || workspace.userId.toString() !== user.id.toString()) {
        return res.status(403).json({ error: 'Access denied to workspace' });
      }

      const members = await storage.getWorkspaceMembers(workspaceId);
      res.json(members);
    } catch (error: any) {
      console.error('Error fetching workspace members:', error);
      res.status(500).json({ error: error.message });
    }
  });

  // Get team invitations
  app.get('/api/workspaces/:workspaceId/invitations', requireAuth, async (req: any, res: Response) => {
    try {
      const { user } = req;
      const workspaceId = req.params.workspaceId;

      // Verify user owns this workspace
      const workspace = await storage.getWorkspace(workspaceId);
      if (!workspace || workspace.userId.toString() !== user.id.toString()) {
        return res.status(403).json({ error: 'Access denied to workspace' });
      }

      const invitations = await storage.getTeamInvitations(parseInt(workspaceId));
      res.json(invitations);
    } catch (error: any) {
      console.error('Error fetching team invitations:', error);
      res.status(500).json({ error: error.message });
    }
  });

  // Invite team member - enforces subscription limits
  app.post('/api/workspaces/:workspaceId/invite', requireAuth, async (req: any, res: Response) => {
    try {
      const { user } = req;
      const workspaceId = req.params.workspaceId;
      const { email, role } = req.body;

      // Verify user owns this workspace
      const workspace = await storage.getWorkspace(workspaceId);
      if (!workspace || workspace.userId.toString() !== user.id.toString()) {
        return res.status(403).json({ error: 'Access denied to workspace' });
      }

      // Enforce subscription limits - Free plan only supports 1 member (owner)
      const userPlan = user.plan || 'Free';
      if (userPlan === 'Free') {
        return res.status(402).json({ 
          error: 'Free plan only supports 1 member. Upgrade to invite team members.',
          needsUpgrade: true,
          currentPlan: userPlan
        });
      }

      // For paid plans, implement actual invitation logic
      const invitation = await storage.createTeamInvitation({
        workspaceId: parseInt(workspaceId),
        email,
        role,
        invitedBy: user.id,
        token: Math.random().toString(36).substring(2, 15),
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 days
      });

      res.json(invitation);
    } catch (error: any) {
      console.error('Error inviting team member:', error);
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

  // Get social accounts
  app.get('/api/social-accounts', requireAuth, async (req: any, res: Response) => {
    try {
      const { user } = req;
      const workspaceId = req.query.workspaceId;
      
      if (!workspaceId) {
        const workspaces = await storage.getWorkspacesByUserId(user.id);
        const workspace = workspaces.find((w: any) => w.isDefault) || workspaces[0];
        if (!workspace) {
          return res.json([]);
        }
        const accounts = await storage.getSocialAccountsByWorkspace(workspace.id);
        return res.json(accounts);
      }
      
      // Verify user has access to the requested workspace
      const workspace = await storage.getWorkspace(workspaceId as string);
      if (!workspace || workspace.userId !== user.id) {
        return res.status(403).json({ error: 'Access denied to workspace' });
      }
      
      const accounts = await storage.getSocialAccountsByWorkspace(workspaceId as string);
      res.json(accounts);
    } catch (error: any) {
      console.error('Error fetching social accounts:', error);
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

      // Use any to avoid TypeScript issues with MongoDB dynamic fields
      const account = instagramAccount as any;
      
      // Return stored Instagram data from MongoDB using actual field names
      const analyticsData = {
        totalPosts: account.mediaCount || 0,
        totalReach: account.avgReach || 0,
        engagementRate: account.avgEngagement || 0,
        topPlatform: 'instagram',
        followers: account.followers || account.followersCount || 0,
        impressions: account.avgReach || 0,
        accountUsername: account.username,
        totalLikes: account.avgLikes || 0,
        totalComments: account.avgComments || 0,
        mediaCount: account.mediaCount || 0
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