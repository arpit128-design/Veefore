import type { Express } from "express";
import { createServer, type Server } from "http";
import WebSocket, { WebSocketServer } from "ws";
import Stripe from "stripe";
import * as admin from "firebase-admin";
import { storage } from "./storage";
import { 
  insertUserSchema, insertWorkspaceSchema, insertSocialAccountSchema,
  insertContentSchema, insertAutomationRuleSchema, insertAnalyticsSchema,
  insertSuggestionSchema, insertCreditTransactionSchema, insertReferralSchema
} from "@shared/schema";
import { z } from "zod";

// Initialize Firebase Admin with service account
let firebaseAdmin: any = null;
try {
  if (admin.apps.length === 0) {
    // Try to initialize with service account credentials
    if (process.env.FIREBASE_SERVICE_ACCOUNT_KEY) {
      const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_KEY);
      firebaseAdmin = admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
        projectId: process.env.VITE_FIREBASE_PROJECT_ID,
      });
      console.log("Firebase Admin initialized with service account");
    } else if (process.env.VITE_FIREBASE_PROJECT_ID) {
      // Fallback initialization for development
      firebaseAdmin = admin.initializeApp({
        projectId: process.env.VITE_FIREBASE_PROJECT_ID,
      });
      console.log("Firebase Admin initialized without service account (development mode)");
    }
  } else {
    firebaseAdmin = admin.apps[0];
    console.log("Using existing Firebase Admin app");
  }
} catch (error) {
  console.warn("Firebase Admin initialization failed, using token-based auth:", error);
}

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
const TWITTER_BEARER_TOKEN = process.env.TWITTER_BEARER_TOKEN || "";

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

  // Middleware for authentication - simplified for demo
  const requireAuth = async (req: any, res: any, next: any) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'Unauthorized' });
    }
    
    const token = authHeader.substring(7);
    
    try {
      if (firebaseAdmin) {
        // Try Firebase Admin verification
        const decodedToken = await admin.auth().verifyIdToken(token);
        req.user = { 
          firebaseUid: decodedToken.uid,
          email: decodedToken.email,
          name: decodedToken.name 
        };
      } else {
        // Simplified auth for demo - extract user info from token
        req.user = { 
          firebaseUid: token.split('.')[0] || 'demo-user',
          email: 'demo@veefore.com',
          name: 'Demo User'
        };
      }
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
      res.json(user);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.post("/api/user", async (req, res) => {
    try {
      const userData = insertUserSchema.parse(req.body);
      
      // Check if user already exists
      const existingUser = await storage.getUserByFirebaseUid(userData.firebaseUid);
      if (existingUser) {
        return res.json(existingUser);
      }
      
      const user = await storage.createUser(userData);
      
      // Create default workspace
      await storage.createWorkspace({
        userId: user.id,
        name: "Main Brand",
        isDefault: true
      });
      
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
      res.status(400).json({ error: error.message });
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
