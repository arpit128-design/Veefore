import type { Express } from "express";
import { createServer, type Server } from "http";
import WebSocket, { WebSocketServer } from "ws";
import Stripe from "stripe";
// Using client-side Firebase authentication
import { storage } from "./storage";
import { 
  insertUserSchema, insertWorkspaceSchema, insertSocialAccountSchema,
  insertContentSchema, insertAutomationRuleSchema, insertAnalyticsSchema,
  insertSuggestionSchema, insertCreditTransactionSchema, insertReferralSchema
} from "@shared/schema";
import { z } from "zod";
import { instagramAPI } from "./instagram-api";
import { GoogleGenerativeAI } from "@google/generative-ai";

// Configure authentication for client-side Firebase
console.log("Server configured for client-side authentication");

// Initialize Stripe
if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error('Missing required Stripe secret: STRIPE_SECRET_KEY');
}
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: "2024-06-20",
});

// Google Gemini API setup
const GEMINI_API_KEY = process.env.GEMINI_API_KEY || process.env.GOOGLE_AI_API_KEY || "";
if (!GEMINI_API_KEY) {
  console.warn("Warning: GEMINI_API_KEY not found. AI features will not work.");
}

// Social media API setup
const INSTAGRAM_ACCESS_TOKEN = process.env.INSTAGRAM_ACCESS_TOKEN || "";
const INSTAGRAM_APP_ID = process.env.INSTAGRAM_APP_ID || "";
const INSTAGRAM_APP_SECRET = process.env.INSTAGRAM_APP_SECRET || "";
const TWITTER_BEARER_TOKEN = process.env.TWITTER_BEARER_TOKEN || "";

console.log('Instagram API credentials loaded:', {
  hasAccessToken: !!INSTAGRAM_ACCESS_TOKEN,
  hasAppId: !!INSTAGRAM_APP_ID,
  hasAppSecret: !!INSTAGRAM_APP_SECRET
});

export async function registerRoutes(app: Express): Promise<Server> {
  const httpServer = createServer(app);
  
  // WebSocket server for real-time updates
  const wss = new WebSocketServer({ server: httpServer, path: '/ws' });
  
  wss.on('connection', (ws: WebSocket) => {
    console.log('WebSocket client connected');
    
    ws.on('message', (message: Buffer) => {
      try {
        const data = JSON.parse(message.toString());
        console.log('Received WebSocket message:', data);
        
        // Handle different message types
        switch (data.type) {
          case 'subscribe':
            // Subscribe to workspace updates
            ws.send(JSON.stringify({ type: 'subscribed', workspaceId: data.workspaceId }));
            break;
        }
      } catch (error) {
        console.error('WebSocket message error:', error);
      }
    });
    
    ws.on('close', () => {
      console.log('WebSocket client disconnected');
    });
  });

  // Simplified authentication middleware for client-side Firebase
  const requireAuth = async (req: any, res: any, next: any) => {
    console.log(`[AUTH DEBUG] ${req.method} ${req.path} - Headers:`, {
      authorization: req.headers.authorization ? 'Present' : 'Missing',
      userAgent: req.headers['user-agent'],
      referer: req.headers.referer
    });
    
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      console.error(`[AUTH ERROR] Missing or invalid authorization header for ${req.path}`);
      console.error('Available headers:', Object.keys(req.headers));
      return res.status(401).json({ error: 'Unauthorized' });
    }
    
    const token = authHeader.substring(7);
    
    try {
      let firebaseUid;
      
      // Handle demo token for testing
      if (token === 'demo-token') {
        firebaseUid = 'demo-user';
      } else {
        // Parse Firebase JWT token payload
        const parts = token.split('.');
        
        if (parts.length !== 3) {
          return res.status(401).json({ error: 'Invalid token format' });
        }
        
        try {
          // Add padding if needed for base64 decoding
          let payloadPart = parts[1];
          while (payloadPart.length % 4) {
            payloadPart += '=';
          }
          
          const payload = JSON.parse(atob(payloadPart));
          firebaseUid = payload.user_id || payload.sub || payload.uid;
          
          if (!firebaseUid) {
            return res.status(401).json({ error: 'Invalid token payload' });
          }
        } catch (parseError) {
          return res.status(401).json({ error: 'Invalid token format' });
        }
      }

      // Look up user in database
      console.log(`[AUTH DEBUG] Looking up user with Firebase UID: ${firebaseUid}`);
      let user = await storage.getUserByFirebaseUid(firebaseUid);
      
      // Handle demo mode - create demo user if it doesn't exist
      if (!user && firebaseUid === 'demo-user') {
        console.log(`[AUTH DEBUG] Demo mode detected, creating demo user record`);
        const demoUser = {
          firebaseUid: 'demo-user',
          email: 'demo@veefore.com',
          username: 'DemoCommander',
          displayName: 'Demo Commander',
          avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=64&h=64&fit=crop&crop=face'
        };
        user = await storage.createUser(demoUser);
        console.log(`[AUTH DEBUG] Demo user created: ${user.id}`);
      }
      
      if (!user) {
        console.error(`[AUTH ERROR] User not found in database for Firebase UID: ${firebaseUid}`);
        return res.status(401).json({ error: 'User not found' });
      }
      console.log(`[AUTH DEBUG] User found: ${user.id} (${user.email})`);

      req.user = user;
      next();
    } catch (error) {
      console.error('Token verification failed:', error);
      return res.status(401).json({ error: 'Invalid token' });
    }
  };

  // User routes
  app.get("/api/user", requireAuth, async (req: any, res) => {
    try {
      const user = await storage.getUserByFirebaseUid(req.user.firebaseUid);
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }
      // Attach user to request for other endpoints
      req.user = user;
      res.json(user);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.post("/api/user", async (req, res) => {
    try {
      const userData = insertUserSchema.parse(req.body);
      
      // Check if user already exists by Firebase UID
      let existingUser = await storage.getUserByFirebaseUid(userData.firebaseUid);
      if (existingUser) {
        return res.json(existingUser);
      }
      
      // Also check by email to prevent duplicates
      if (userData.email) {
        existingUser = await storage.getUserByEmail(userData.email);
        if (existingUser) {
          return res.json(existingUser);
        }
      }
      
      // Handle username uniqueness by adding timestamp suffix if needed
      let finalUserData = { ...userData };
      let user;
      
      try {
        user = await storage.createUser(finalUserData);
      } catch (createError: any) {
        // If user creation fails due to duplicate key, handle appropriately
        if (createError.message && createError.message.includes('E11000')) {
          console.log('User already exists, attempting to retrieve...');
          
          // Check if it's a username duplicate
          if (createError.message.includes('username_1')) {
            // Generate unique username
            const timestamp = Date.now();
            const baseUsername = userData.username.replace(/[^a-zA-Z0-9]/g, '');
            finalUserData.username = `${baseUsername}_${timestamp}`;
            
            try {
              user = await storage.createUser(finalUserData);
            } catch (retryError: any) {
              // If still fails, try to find existing user
              user = await storage.getUserByFirebaseUid(userData.firebaseUid) || 
                     await storage.getUserByEmail(userData.email!);
              if (user) {
                return res.json(user);
              }
              throw retryError;
            }
          } else {
            // For other duplicates, try to find existing user
            user = await storage.getUserByFirebaseUid(userData.firebaseUid) || 
                   await storage.getUserByEmail(userData.email!);
            if (user) {
              return res.json(user);
            }
            throw createError;
          }
        } else {
          throw createError;
        }
      }
      
      // Create default workspace with proper validation
      try {
        const workspaceData = insertWorkspaceSchema.parse({
          userId: user.id,
          name: "Main Brand",
          description: "Your primary workspace for content creation",
          isDefault: true
        });
        await storage.createWorkspace(workspaceData);
      } catch (workspaceError) {
        console.warn('Failed to create default workspace:', workspaceError);
        // Continue even if workspace creation fails
      }
      
      // Handle referral if provided
      if (userData.referredBy) {
        const referrer = await storage.getUserByReferralCode(userData.referredBy);
        if (referrer) {
          await storage.createReferral({
            referrerId: referrer.id,
            referredId: user.id,
            rewardAmount: 100
          });
          
          // Award referral credits
          await storage.updateUserCredits(referrer.id, referrer.credits + 100);
          await storage.createCreditTransaction({
            userId: referrer.id,
            type: "earned",
            amount: 100,
            description: "Referral bonus"
          });
        }
      }
      
      res.json(user);
    } catch (error: any) {
      console.error('User creation error:', error);
      
      // Handle MongoDB duplicate key errors gracefully
      if (error.message && error.message.includes('E11000')) {
        // Try one more time to find the user
        try {
          const requestBody = req.body;
          const existingUser = await storage.getUserByFirebaseUid(requestBody.firebaseUid) || 
                             await storage.getUserByEmail(requestBody.email);
          if (existingUser) {
            return res.json(existingUser);
          }
        } catch (retrieveError) {
          console.error('Failed to retrieve existing user:', retrieveError);
        }
        res.status(409).json({ error: 'User already exists but could not be retrieved' });
      } else {
        res.status(400).json({ error: error.message });
      }
    }
  });

  // Workspace routes
  app.get("/api/workspaces", requireAuth, async (req: any, res) => {
    try {
      const workspaces = await storage.getWorkspacesByUserId(req.user.id);
      res.json(workspaces);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.post("/api/workspaces", requireAuth, async (req: any, res) => {
    try {
      const workspaceData = insertWorkspaceSchema.parse({
        ...req.body,
        userId: req.user.id
      });
      
      const workspace = await storage.createWorkspace(workspaceData);
      res.json(workspace);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  });

  // Content routes
  app.get("/api/content", requireAuth, async (req, res) => {
    try {
      const { workspaceId } = req.query;
      if (!workspaceId) {
        return res.status(400).json({ error: 'workspaceId is required' });
      }
      
      const content = await storage.getContentByWorkspace(Number(workspaceId));
      res.json(content);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.post("/api/content/generate", requireAuth, async (req: any, res) => {
    try {
      const { type, prompt, workspaceId, platform } = req.body;
      
      if (!GEMINI_API_KEY) {
        return res.status(503).json({ error: 'AI service not configured' });
      }
      
      // Credit cost mapping
      const creditCosts = {
        video: 25,
        reel: 15,
        post: 10,
        caption: 5,
        thumbnail: 8,
        youtube_short: 20
      };
      
      const creditsRequired = creditCosts[type as keyof typeof creditCosts] || 10;
      
      // Check user credits
      const user = await storage.getUserByFirebaseUid(req.user.firebaseUid);
      if (!user || user.credits < creditsRequired) {
        return res.status(402).json({ error: 'Insufficient credits' });
      }
      
      // Generate content using Gemini API
      try {
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${GEMINI_API_KEY}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            contents: [{
              parts: [{
                text: `Create a ${type} for social media with the following prompt: ${prompt}`
              }]
            }]
          })
        });
        
        if (!response.ok) {
          throw new Error(`Gemini API error: ${response.statusText}`);
        }
        
        const data = await response.json();
        const generatedContent = data.candidates?.[0]?.content?.parts?.[0]?.text || 'Generated content';
        
        // Create content record
        const content = await storage.createContent({
          workspaceId: Number(workspaceId),
          type,
          title: `Generated ${type}`,
          description: generatedContent,
          contentData: { generated: true, prompt, platform },
          prompt,
          platform,
          creditsUsed: creditsRequired
        });
        
        // Deduct credits
        await storage.updateUserCredits(user.id, user.credits - creditsRequired);
        await storage.createCreditTransaction({
          userId: user.id,
          workspaceId: Number(workspaceId),
          type: "used",
          amount: -creditsRequired,
          description: `Generated ${type}`,
          referenceId: content.id.toString()
        });
        
        res.json({ content, generatedContent });
      } catch (aiError: any) {
        console.error('AI generation error:', aiError);
        res.status(500).json({ error: 'Failed to generate content' });
      }
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  });

  // Analytics routes
  app.get("/api/analytics", requireAuth, async (req, res) => {
    try {
      const { workspaceId, platform, days } = req.query;
      if (!workspaceId) {
        return res.status(400).json({ error: 'workspaceId is required' });
      }
      
      const analytics = await storage.getAnalytics(
        Number(workspaceId),
        platform as string,
        days ? Number(days) : undefined
      );
      
      res.json(analytics);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // Dashboard analytics summary endpoint
  app.get("/api/dashboard/analytics", requireAuth, async (req: any, res) => {
    try {
      const user = req.user;
      // Handle both string and number user IDs from MongoDB
      const userId = typeof user.id === 'string' ? user.id : Number(user.id);
      const workspaces = await storage.getWorkspacesByUserId(userId);
      
      let analytics: any[] = [];
      let defaultWorkspace;

      if (workspaces.length === 0) {
        // Create default workspace for new users
        defaultWorkspace = await storage.createWorkspace({
          userId: userId,
          name: "My VeeFore Workspace",
          description: "Default workspace for content creation"
        });
        
        // Return empty analytics for new workspace until social accounts are connected
        analytics = [];
      } else {
        defaultWorkspace = workspaces[0];
        analytics = await storage.getAnalytics(Number(defaultWorkspace.id), undefined, 30);
      }
      
      // Try to fetch fresh Instagram data if we have connected accounts
      const connectedAccounts = await storage.getSocialAccountsByWorkspace(Number(defaultWorkspace.id));
      const instagramAccount = connectedAccounts.find(acc => acc.platform === 'instagram');
      
      // Fetch real Instagram analytics if we have an access token
      if (INSTAGRAM_ACCESS_TOKEN) {
        try {
          console.log('Fetching Instagram analytics with provided access token...');
          
          // Fetch user profile
          const profileResponse = await fetch(`https://graph.instagram.com/me?fields=id,username,account_type,media_count,followers_count&access_token=${INSTAGRAM_ACCESS_TOKEN}`);
          if (!profileResponse.ok) {
            throw new Error(`Instagram API error: ${profileResponse.status}`);
          }
          const profile = await profileResponse.json();
          
          // Fetch media insights
          const mediaResponse = await fetch(`https://graph.instagram.com/me/media?fields=id,caption,media_type,timestamp,like_count,comments_count,impressions,reach&access_token=${INSTAGRAM_ACCESS_TOKEN}&limit=10`);
          if (!mediaResponse.ok) {
            throw new Error(`Instagram Media API error: ${mediaResponse.status}`);
          }
          const mediaData = await mediaResponse.json();
          
          // Calculate total metrics from recent posts
          const totalLikes = mediaData.data?.reduce((sum: number, post: any) => sum + (post.like_count || 0), 0) || 0;
          const totalComments = mediaData.data?.reduce((sum: number, post: any) => sum + (post.comments_count || 0), 0) || 0;
          const totalImpressions = mediaData.data?.reduce((sum: number, post: any) => sum + (post.impressions || 0), 0) || 0;
          const totalReach = mediaData.data?.reduce((sum: number, post: any) => sum + (post.reach || 0), 0) || 0;
          
          // Store fresh analytics data with correct schema format
          await storage.createAnalytics({
            workspaceId: defaultWorkspace.id,
            platform: 'instagram',
            metrics: {
              views: totalImpressions,
              likes: totalLikes,
              comments: totalComments,
              shares: 0,
              followers: profile.followers_count || 0,
              engagement: totalLikes + totalComments,
              reach: totalReach,
              impressions: totalImpressions
            },
            date: new Date()
          });
          
          console.log('Successfully fetched and stored Instagram analytics:', {
            followers: profile.followers_count,
            mediaCount: profile.media_count,
            totalEngagement: totalLikes + totalComments,
            totalImpressions
          });
          
          // Refresh analytics data
          analytics = await storage.getAnalytics(Number(defaultWorkspace.id), undefined, 30);
        } catch (error) {
          console.error('Instagram API fetch failed:', error);
        }
      } else if (instagramAccount && instagramAccount.accessToken) {
        try {
          const profile = await instagramAPI.getUserProfile(instagramAccount.accessToken);
          const insights = await instagramAPI.getAccountInsights(instagramAccount.accessToken);
          
          // Store fresh analytics data
          await storage.createAnalytics({
            workspaceId: Number(defaultWorkspace.id),
            platform: 'instagram',
            metrics: {
              ...insights,
              profile_views: insights.profile_views,
              follower_count: insights.follower_count,
              media_count: profile.media_count
            }
          });
          
          // Refresh analytics data
          analytics = await storage.getAnalytics(Number(defaultWorkspace.id), undefined, 30);
        } catch (error) {
          console.log('Instagram API fetch failed, using stored data:', error);
        }
      }
      
      // Calculate aggregated metrics from JSON structure
      const totalViews = analytics.reduce((sum, a) => {
        const metrics = a.metrics as any;
        return sum + (metrics?.views || metrics?.impressions || metrics?.profile_views || 0);
      }, 0);
      
      const totalEngagement = analytics.reduce((sum, a) => {
        const metrics = a.metrics as any;
        return sum + (metrics?.likes || 0) + (metrics?.comments || 0) + (metrics?.shares || 0);
      }, 0);
      
      const totalFollowers = analytics.reduce((sum, a) => {
        const metrics = a.metrics as any;
        return sum + (metrics?.followers || metrics?.follower_count || 0);
      }, 0);
      
      // Calculate content score based on engagement rate
      const contentScore = totalViews > 0 ? Math.round((totalEngagement / totalViews) * 100) : 85;

      // Group analytics by platform
      const platformAnalytics = analytics.reduce((acc, a) => {
        const metrics = a.metrics as any;
        if (!acc[a.platform]) {
          acc[a.platform] = {
            platform: a.platform,
            views: 0,
            engagement: 0,
            followers: 0,
            posts: 0
          };
        }
        acc[a.platform].views += metrics?.views || metrics?.impressions || 0;
        acc[a.platform].engagement += (metrics?.likes || 0) + (metrics?.comments || 0) + (metrics?.shares || 0);
        acc[a.platform].followers += metrics?.followers || 0;
        acc[a.platform].posts += 1;
        return acc;
      }, {} as any);

      res.json({
        totalViews,
        engagement: totalEngagement,
        newFollowers: totalFollowers,
        contentScore,
        platforms: Object.values(platformAnalytics)
      });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // Social platform OAuth routes (Instagram auth moved to separate section below)

  app.get("/api/twitter/auth", requireAuth, async (req: any, res) => {
    try {
      // Twitter OAuth implementation placeholder - requires Twitter API v2 credentials
      res.status(501).json({ error: 'Twitter OAuth integration requires API credentials. Please provide TWITTER_CLIENT_ID and TWITTER_CLIENT_SECRET.' });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.get("/api/linkedin/auth", requireAuth, async (req: any, res) => {
    try {
      // LinkedIn OAuth implementation placeholder - requires LinkedIn API credentials
      res.status(501).json({ error: 'LinkedIn OAuth integration requires API credentials. Please provide LINKEDIN_CLIENT_ID and LINKEDIN_CLIENT_SECRET.' });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.get("/api/youtube/auth", requireAuth, async (req: any, res) => {
    try {
      // YouTube OAuth implementation placeholder - requires Google API credentials
      res.status(501).json({ error: 'YouTube OAuth integration requires Google API credentials. Please provide GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET.' });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.get("/api/facebook/auth", requireAuth, async (req: any, res) => {
    try {
      // Facebook OAuth implementation placeholder - requires Facebook API credentials
      res.status(501).json({ error: 'Facebook OAuth integration requires Facebook API credentials. Please provide FACEBOOK_APP_ID and FACEBOOK_APP_SECRET.' });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.get("/api/instagram/callback", async (req, res) => {
    try {
      const { code, state, error } = req.query;
      
      if (error) {
        return res.redirect(`/dashboard?error=${encodeURIComponent(error as string)}`);
      }

      if (!code || !state) {
        return res.redirect('/dashboard?error=missing_code_or_state');
      }

      // State contains the workspace ID (can be ObjectId string or number)
      const workspaceId = state as string;
      console.log(`[INSTAGRAM CALLBACK] Received state (workspace ID): ${workspaceId}`);
      
      // Handle both ObjectId strings and numeric IDs
      const workspace = await storage.getWorkspace(workspaceId);
      
      if (!workspace) {
        return res.redirect('/dashboard?error=invalid_workspace');
      }

      // Force HTTPS for redirect URI
      const redirectUri = `https://${req.get('host')}/api/instagram/callback`;
      console.log(`[INSTAGRAM CALLBACK] Processing callback with workspace ID: ${workspaceId}`);
      console.log(`[INSTAGRAM CALLBACK] Using redirect URI: ${redirectUri}`);
      
      // Exchange code for short-lived token
      const tokenData = await instagramAPI.exchangeCodeForToken(code as string, redirectUri);
      console.log(`[INSTAGRAM CALLBACK] Exchanged code for token successfully`);
      
      // Get long-lived token
      const longLivedToken = await instagramAPI.getLongLivedToken(tokenData.access_token);
      console.log(`[INSTAGRAM CALLBACK] Got long-lived token successfully`);
      
      // Get user profile
      const profile = await instagramAPI.getUserProfile(longLivedToken.access_token);
      console.log(`[INSTAGRAM CALLBACK] Got user profile: ${profile.username}`);
      
      const defaultWorkspace = workspace;

      // Store Instagram account
      await storage.createSocialAccount({
        workspaceId: defaultWorkspace.id,
        platform: "instagram",
        accountId: profile.id,
        username: profile.username,
        accessToken: longLivedToken.access_token,
        refreshToken: null,
        expiresAt: new Date(Date.now() + longLivedToken.expires_in * 1000),

      });

      // Fetch and store initial analytics data
      try {
        const insights = await instagramAPI.getAccountInsights(longLivedToken.access_token);
        const media = await instagramAPI.getUserMedia(longLivedToken.access_token, 10);
        
        // Store account insights
        await storage.createAnalytics({
          workspaceId: defaultWorkspace.id,
          platform: "instagram",
          metrics: {
            views: insights.impressions,
            likes: 0,
            comments: 0,
            shares: 0,
            followers: insights.follower_count,
            impressions: insights.impressions,
            reach: insights.reach,
            profile_views: insights.profile_views
          }
        });

        // Store media insights
        for (const item of media.slice(0, 5)) {
          try {
            const mediaInsights = await instagramAPI.getMediaInsights(item.id, longLivedToken.access_token);
            await storage.createAnalytics({
              workspaceId: defaultWorkspace.id,
              platform: "instagram",
              postId: item.id,
              metrics: {
                views: mediaInsights.impressions || 0,
                likes: mediaInsights.likes || 0,
                comments: mediaInsights.comments || 0,
                shares: mediaInsights.shares || 0,
                saves: mediaInsights.saves || 0,
                impressions: mediaInsights.impressions || 0,
                reach: mediaInsights.reach || 0
              }
            });
          } catch (mediaError) {
            console.error(`Error fetching insights for media ${item.id}:`, mediaError);
          }
        }
      } catch (analyticsError) {
        console.error('Error fetching Instagram analytics:', analyticsError);
      }

      res.redirect('/dashboard?success=instagram_connected');
    } catch (error: any) {
      console.error('Instagram callback error:', error);
      res.redirect(`/dashboard?error=${encodeURIComponent(error.message)}`);
    }
  });

  app.post("/api/analytics/fetch", requireAuth, async (req, res) => {
    try {
      const { workspaceId, platform } = req.body;
      
      // Fetch real analytics from social media APIs
      let analyticsData = {};
      
      if (platform === 'instagram' && INSTAGRAM_ACCESS_TOKEN) {
        try {
          const response = await fetch(`https://graph.instagram.com/me/media?fields=id,caption,media_type,timestamp,like_count,comments_count&access_token=${INSTAGRAM_ACCESS_TOKEN}`);
          if (response.ok) {
            analyticsData = await response.json();
          }
        } catch (error) {
          console.error('Instagram API error:', error);
        }
      } else if (platform === 'twitter' && TWITTER_BEARER_TOKEN) {
        try {
          const response = await fetch('https://api.twitter.com/2/users/me/tweets?tweet.fields=public_metrics', {
            headers: {
              'Authorization': `Bearer ${TWITTER_BEARER_TOKEN}`
            }
          });
          if (response.ok) {
            analyticsData = await response.json();
          }
        } catch (error) {
          console.error('Twitter API error:', error);
        }
      }
      
      // Store analytics
      const analytics = await storage.createAnalytics({
        workspaceId: Number(workspaceId),
        platform,
        metrics: analyticsData
      });
      
      res.json(analytics);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // Social accounts endpoint
  app.get("/api/social-accounts", requireAuth, async (req: any, res) => {
    try {
      const user = req.user;
      const userId = typeof user.id === 'string' ? user.id : Number(user.id);
      const workspaces = await storage.getWorkspacesByUserId(userId);
      
      if (workspaces.length === 0) {
        return res.json([]);
      }
      
      const socialAccounts = await storage.getSocialAccountsByWorkspace(Number(workspaces[0].id));
      res.json(socialAccounts);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // Instagram OAuth initiation
  app.get("/api/instagram/auth", requireAuth, async (req: any, res) => {
    try {
      const user = req.user;
      
      // Handle demo mode
      if (user.firebaseUid === 'demo-user') {
        return res.status(400).json({ 
          error: 'Instagram integration requires real authentication. Please log in with your Google account to connect your Instagram Business account and access authentic analytics data.',
          requiresRealAuth: true 
        });
      }
      
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
      
      // Force HTTPS for Instagram OAuth redirect URI
      const redirectUri = `https://${req.get('host')}/api/instagram/callback`;
      console.log(`[INSTAGRAM AUTH] Generated redirect URI: ${redirectUri}`);
      console.log(`[INSTAGRAM AUTH] Request protocol: ${req.protocol}`);
      console.log(`[INSTAGRAM AUTH] Request host: ${req.get('host')}`);
      
      const authUrl = instagramAPI.generateAuthUrl(redirectUri, defaultWorkspace.id.toString());
      console.log(`[INSTAGRAM AUTH] Generated auth URL: ${authUrl}`);
      res.json({ authUrl });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // Suggestions routes
  app.get("/api/suggestions", requireAuth, async (req, res) => {
    try {
      const { workspaceId } = req.query;
      if (!workspaceId) {
        return res.status(400).json({ error: 'workspaceId is required' });
      }
      
      const suggestions = await storage.getValidSuggestions(Number(workspaceId));
      res.json(suggestions);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.post("/api/suggestions/generate", requireAuth, async (req, res) => {
    try {
      const { workspaceId } = req.body;
      
      if (!GEMINI_API_KEY) {
        return res.status(503).json({ error: 'AI service not configured' });
      }
      
      // Generate AI suggestions using Gemini
      const prompts = [
        "Suggest trending content ideas for social media",
        "Recommend popular audio tracks for reels",
        "Suggest effective hashtag strategies"
      ];
      
      const suggestions = [];
      
      for (const [index, promptText] of prompts.entries()) {
        try {
          const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${GEMINI_API_KEY}`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              contents: [{
                parts: [{
                  text: promptText
                }]
              }]
            })
          });
          
          if (response.ok) {
            const data = await response.json();
            const suggestionText = data.candidates?.[0]?.content?.parts?.[0]?.text || 'No suggestion available';
            
            const suggestion = await storage.createSuggestion({
              workspaceId: Number(workspaceId),
              type: ['trending', 'audio', 'hashtag'][index],
              data: { suggestion: suggestionText },
              confidence: Math.floor(Math.random() * 30) + 70, // 70-100%
              validUntil: new Date(Date.now() + 24 * 60 * 60 * 1000) // 24 hours
            });
            
            suggestions.push(suggestion);
          }
        } catch (error) {
          console.error('Failed to generate suggestion:', error);
        }
      }
      
      res.json(suggestions);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // Automation routes
  app.get("/api/automation-rules", requireAuth, async (req, res) => {
    try {
      const { workspaceId } = req.query;
      if (!workspaceId) {
        return res.status(400).json({ error: 'workspaceId is required' });
      }
      
      const rules = await storage.getAutomationRules(Number(workspaceId));
      res.json(rules);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.post("/api/automation-rules", requireAuth, async (req, res) => {
    try {
      const ruleData = insertAutomationRuleSchema.parse(req.body);
      const rule = await storage.createAutomationRule(ruleData);
      res.json(rule);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  });

  // Social accounts management routes
  app.get("/api/social-accounts", requireAuth, async (req, res) => {
    try {
      const { workspaceId } = req.query;
      if (!workspaceId) {
        return res.status(400).json({ error: 'workspaceId is required' });
      }
      
      const accounts = await storage.getSocialAccountsByWorkspace(Number(workspaceId));
      res.json(accounts);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.delete("/api/social-accounts/:id", requireAuth, async (req, res) => {
    try {
      const accountId = Number(req.params.id);
      await storage.deleteSocialAccount(accountId);
      res.json({ success: true });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.patch("/api/social-accounts/:id", requireAuth, async (req, res) => {
    try {
      const accountId = Number(req.params.id);
      const updates = req.body;
      const updatedAccount = await storage.updateSocialAccount(accountId, updates);
      res.json(updatedAccount);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.post("/api/social-accounts/:id/refresh", requireAuth, async (req, res) => {
    try {
      const accountId = Number(req.params.id);
      const account = await storage.getSocialAccount(accountId);
      
      if (!account) {
        return res.status(404).json({ error: 'Account not found' });
      }

      if (account.platform === 'instagram' && account.refreshToken) {
        try {
          const refreshResult = await instagramAPI.refreshAccessToken(account.refreshToken);
          
          const updatedAccount = await storage.updateSocialAccount(accountId, {
            accessToken: refreshResult.access_token,
            expiresAt: new Date(Date.now() + refreshResult.expires_in * 1000)
          });
          
          res.json(updatedAccount);
        } catch (error) {
          res.status(400).json({ error: 'Failed to refresh Instagram token' });
        }
      } else {
        res.status(400).json({ error: 'Token refresh not supported for this platform' });
      }
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // Referral routes
  app.get("/api/referrals", requireAuth, async (req: any, res) => {
    try {
      const referrals = await storage.getReferrals(req.user.id);
      const stats = await storage.getReferralStats(req.user.id);
      res.json({ referrals, stats });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.get("/api/leaderboard", async (req, res) => {
    try {
      const leaderboard = await storage.getLeaderboard(10);
      res.json(leaderboard);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // Credit and subscription routes
  app.post("/api/create-payment-intent", requireAuth, async (req, res) => {
    try {
      const { amount } = req.body;
      const paymentIntent = await stripe.paymentIntents.create({
        amount: Math.round(amount * 100), // Convert to cents
        currency: "usd",
      });
      res.json({ clientSecret: paymentIntent.client_secret });
    } catch (error: any) {
      res.status(500).json({ error: "Error creating payment intent: " + error.message });
    }
  });

  app.post('/api/get-or-create-subscription', requireAuth, async (req: any, res) => {
    try {
      let user = await storage.getUserByFirebaseUid(req.user.firebaseUid);
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }

      if (user.stripeSubscriptionId) {
        const subscription = await stripe.subscriptions.retrieve(user.stripeSubscriptionId);
        return res.json({
          subscriptionId: subscription.id,
          clientSecret: (subscription.latest_invoice as any)?.payment_intent?.client_secret,
        });
      }
      
      if (!user.email) {
        return res.status(400).json({ error: 'No user email on file' });
      }

      const customer = await stripe.customers.create({
        email: user.email,
        name: user.username,
      });

      user = await storage.updateUserStripeInfo(user.id, customer.id);

      const subscription = await stripe.subscriptions.create({
        customer: customer.id,
        items: [{
          price: process.env.STRIPE_PRICE_ID || "price_1234567890", // Default price ID
        }],
        payment_behavior: 'default_incomplete',
        expand: ['latest_invoice.payment_intent'],
      });

      await storage.updateUserStripeInfo(user.id, customer.id, subscription.id);
  
      res.json({
        subscriptionId: subscription.id,
        clientSecret: (subscription.latest_invoice as any)?.payment_intent?.client_secret,
      });
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  });

  return httpServer;
}
