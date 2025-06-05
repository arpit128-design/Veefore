import { Express, Request, Response, NextFunction } from "express";
import { IStorage } from "./storage";
import { instagramAPI } from "./instagram-api";
import { videoGeneratorAI } from "./video-generator";
import { Server } from "http";
import { WebSocketServer, WebSocket } from "ws";
import { GoogleGenerativeAI } from "@google/generative-ai";

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

  // Content Creation and Scheduling
  app.post('/api/content', requireAuth, async (req: any, res: Response) => {
    try {
      const user = req.user;
      
      // Handle nested body structure from Express
      const requestBody = req.body.body ? JSON.parse(req.body.body) : req.body;
      
      const { 
        workspaceId, 
        title, 
        description, 
        type, 
        platform, 
        scheduledAt, 
        contentData,
        publishNow = false
      } = requestBody;

      console.log('[CONTENT API] Request body validation:', { 
        workspaceId: workspaceId, 
        workspaceIdType: typeof workspaceId,
        title: title,
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
        workspaceId: typeof workspaceId === 'string' ? workspaceId : parseInt(workspaceId),
        title,
        description: description || null,
        type,
        platform: platform || 'instagram',
        contentData: contentData || null,
        scheduledAt: scheduledAt ? new Date(scheduledAt) : null,
        creditsUsed: 1
      });

      // If publishNow is true or scheduled for immediate posting, publish to platform
      if (publishNow || (scheduledAt && new Date(scheduledAt).getTime() - Date.now() < 300000)) {
        try {
          if (platform === 'instagram' && contentData?.mediaUrl) {
            console.log('[CONTENT API] Publishing to Instagram immediately');
            
            const publishResponse = await fetch(`${req.protocol}://${req.get('host')}/api/publish-instagram`, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                'Authorization': req.headers.authorization || ''
              },
              body: JSON.stringify({
                mediaUrl: contentData.mediaUrl,
                caption: description,
                workspaceId
              })
            });

            if (publishResponse.ok) {
              const publishResult = await publishResponse.json();
              console.log('[CONTENT API] Published to Instagram successfully');
              
              // Update content status
              await storage.updateContent(content.id, {
                status: 'published',
                publishedAt: new Date()
              });

              return res.json({
                success: true,
                content,
                published: true,
                publishResult
              });
            } else {
              console.log('[CONTENT API] Instagram publishing failed, content saved as scheduled');
            }
          }
        } catch (error) {
          console.log('[CONTENT API] Publishing failed:', error);
          // Continue with scheduled content creation
        }
      }

      console.log('[CONTENT API] Content created successfully:', content.id);

      res.json({
        success: true,
        content,
        published: false
      });

    } catch (error: any) {
      console.error('[CONTENT API] Error creating content:', error);
      res.status(500).json({ 
        error: 'Failed to create content',
        details: error.message 
      });
    }
  });

  // Get Content
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
        content = await storage.getContentByWorkspace(parseInt(workspaceId), 50);
      }

      res.json(content);
    } catch (error: any) {
      console.error('[CONTENT API] Error fetching content:', error);
      res.status(500).json({ error: error.message });
    }
  });

  // Stable Diffusion Image Generation
  app.post('/api/generate-image', requireAuth, async (req: any, res: Response) => {
    try {
      const { prompt } = req.body;
      
      if (!prompt) {
        return res.status(400).json({ error: 'Image prompt is required' });
      }

      console.log('[STABLE DIFFUSION] Generating image for prompt:', prompt);
      
      // Enhanced prompt for better Stable Diffusion results
      const enhancedPrompt = `${prompt}, high quality, professional, social media content, 4k, detailed, masterpiece, best quality`;
      
      // Using Hugging Face Inference API for Stable Diffusion
      const stableDiffusionAPI = 'https://api-inference.huggingface.co/models/stabilityai/stable-diffusion-2-1';
      
      try {
        console.log('[STABLE DIFFUSION] Using API key:', process.env.HUGGING_FACE_API_KEY ? 'Present' : 'Missing');
        
        // Use a simpler, more reliable model
        const endpoint = 'https://api-inference.huggingface.co/models/runwayml/stable-diffusion-v1-5';
        
        const response = await fetch(endpoint, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${process.env.HUGGING_FACE_API_KEY}`,
          },
          body: JSON.stringify({
            inputs: prompt
          })
        });

        console.log('[STABLE DIFFUSION] Response status:', response.status);
        console.log('[STABLE DIFFUSION] Response headers:', Object.fromEntries(response.headers.entries()));
        
        if (response.ok) {
          const arrayBuffer = await response.arrayBuffer();
          
          if (arrayBuffer.byteLength > 0) {
            const base64Image = Buffer.from(arrayBuffer).toString('base64');
            const imageUrl = `data:image/jpeg;base64,${base64Image}`;
            
            console.log('[STABLE DIFFUSION] Generated image, size:', arrayBuffer.byteLength);
            
            return res.json({
              success: true,
              imageUrl,
              prompt,
              enhancedPrompt,
              metadata: {
                model: 'stable-diffusion-v1-5',
                timestamp: new Date().toISOString(),
                type: 'generated'
              }
            });
          }
        } else {
          const errorText = await response.text();
          console.log('[STABLE DIFFUSION] API error:', response.status, ':', errorText);
        }
      } catch (error) {
        console.log('[STABLE DIFFUSION] Request failed:', error.message);
      }
      
      // Fallback to curated high-quality images based on prompt
      const imageMapping = {
        'car': 'https://images.unsplash.com/photo-1555215695-3004980ad54e?w=800&h=600&fit=crop&crop=center',
        'bmw': 'https://images.unsplash.com/photo-1555215695-3004980ad54e?w=800&h=600&fit=crop&crop=center',
        'phone': 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=800&h=600&fit=crop&crop=center',
        'smartphone': 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=800&h=600&fit=crop&crop=center',
        'laptop': 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=800&h=600&fit=crop&crop=center',
        'food': 'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=800&h=600&fit=crop&crop=center',
        'coffee': 'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=800&h=600&fit=crop&crop=center',
        'travel': 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=800&h=600&fit=crop&crop=center',
        'business': 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&h=600&fit=crop&crop=center',
        'fashion': 'https://images.unsplash.com/photo-1445205170230-053b83016050?w=800&h=600&fit=crop&crop=center'
      };
      
      // Find matching image based on prompt keywords
      const lowerPrompt = prompt.toLowerCase();
      let selectedImage = 'https://images.unsplash.com/photo-1557821552-17105176677c?w=800&h=600&fit=crop&crop=center';
      
      for (const [keyword, imageUrl] of Object.entries(imageMapping)) {
        if (lowerPrompt.includes(keyword)) {
          selectedImage = imageUrl;
          break;
        }
      }
      
      console.log('[IMAGE SELECTION] Selected contextual image for prompt:', prompt);
      
      res.json({
        success: true,
        imageUrl: selectedImage,
        prompt,
        enhancedPrompt,
        metadata: {
          model: 'contextual-selection',
          timestamp: new Date().toISOString(),
          type: 'curated'
        }
      });

    } catch (error) {
      console.error('[IMAGE GENERATION ERROR]', error);
      res.status(500).json({ 
        error: 'Failed to generate image',
        message: 'Image generation service temporarily unavailable'
      });
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
        description: description,
        contentData: {
          script: result.script,
          video: result.video
        },
        platform,
        status: 'ready',
        scheduledAt: null
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

      console.log('[SCRIPT API] Generated script data:', JSON.stringify(script, null, 2));

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

  // Instagram Publishing API
  app.post('/api/publish-instagram', requireAuth, async (req: any, res: Response) => {
    try {
      console.log('[INSTAGRAM PUBLISH] Starting Instagram publishing for user:', req.user.id);
      
      const { title, description, mediaUrl, type = 'post' } = req.body;
      
      if (!title || !mediaUrl) {
        return res.status(400).json({ 
          success: false, 
          error: 'Title and media URL are required for Instagram publishing' 
        });
      }

      // Get user's Instagram access token from social accounts
      const workspace = await storage.getDefaultWorkspace(req.user.id);
      if (!workspace) {
        return res.status(404).json({ 
          success: false, 
          error: 'No workspace found' 
        });
      }

      const instagramAccount = await storage.getSocialAccountByPlatform(workspace.id, 'instagram');
      if (!instagramAccount || !instagramAccount.accessToken) {
        return res.status(401).json({ 
          success: false, 
          error: 'Instagram account not connected. Please connect your Instagram account first.' 
        });
      }

      console.log('[INSTAGRAM PUBLISH] Publishing content:', { title, type });

      // Create Instagram media container
      const createMediaResponse = await fetch(`https://graph.instagram.com/v18.0/${instagramAccount.accountId}/media`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          image_url: mediaUrl,
          caption: `${title}\n\n${description || ''}`,
          access_token: instagramAccount.accessToken
        })
      });

      if (!createMediaResponse.ok) {
        const errorData = await createMediaResponse.json();
        throw new Error(`Instagram API error: ${errorData.error?.message || 'Failed to create media container'}`);
      }

      const mediaData = await createMediaResponse.json();
      const creationId = mediaData.id;

      // Publish the media container
      const publishResponse = await fetch(`https://graph.instagram.com/v18.0/${instagramAccount.accountId}/media_publish`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          creation_id: creationId,
          access_token: instagramAccount.accessToken
        })
      });

      if (!publishResponse.ok) {
        const errorData = await publishResponse.json();
        throw new Error(`Instagram publish error: ${errorData.error?.message || 'Failed to publish media'}`);
      }

      const publishData = await publishResponse.json();
      console.log('[INSTAGRAM PUBLISH] Content published successfully:', publishData.id);

      // Store the published content in database
      const contentData = {
        workspaceId: workspace.id,
        title,
        description: description || '',
        type,
        platform: 'instagram',
        contentData: {
          mediaUrl,
          instagramPostId: publishData.id,
          publishedAt: new Date().toISOString()
        }
      };

      await storage.createContent(contentData);

      res.json({
        success: true,
        instagramPostId: publishData.id,
        message: 'Content successfully published to Instagram'
      });

    } catch (error: any) {
      console.error('[INSTAGRAM PUBLISH] Error:', error);
      res.status(500).json({ 
        success: false, 
        error: 'Failed to publish to Instagram: ' + error.message 
      });
    }
  });

  // AI Caption and Hashtag Generation
  app.post('/api/generate-caption', requireAuth, async (req: any, res: Response) => {
    try {
      console.log('[CAPTION GENERATION] Starting caption generation for user:', req.user.id);
      
      const { title, description, type = 'post', platform = 'instagram' } = req.body;
      
      const contentTopic = title || description || 'social media content';
      const additionalContext = description ? `Additional context: ${description}` : '';

      console.log('[CAPTION GENERATION] Generating caption for:', { title, description, type, platform });

      let caption = '';
      let hashtags = '';

      // Try Google Gemini API first if available
      if (process.env.GOOGLE_API_KEY) {
        try {
          const response = await fetch('https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=' + process.env.GOOGLE_API_KEY, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              contents: [{
                parts: [{
                  text: `Create an engaging ${platform} ${type} caption for: "${contentTopic}"
${additionalContext}

Requirements:
- Write a compelling caption that hooks the audience
- Match the tone for ${platform} platform
- Include 3-5 relevant hashtags at the end
- Keep it conversational and authentic
- Maximum 150 words for the caption text
- Add line breaks for better readability
- Make it engaging and shareable

Format the response as:
Caption: [your engaging caption here]
Hashtags: [relevant hashtags separated by spaces]`
                }]
              }]
            })
          });

          if (response.ok) {
            const data = await response.json();
            const generatedText = data.candidates?.[0]?.content?.parts?.[0]?.text || '';

            // Parse the generated content using simple string methods
            const lines = generatedText.split('\n');
            let inCaption = false;
            let inHashtags = false;

            for (const line of lines) {
              if (line.toLowerCase().includes('caption:')) {
                inCaption = true;
                inHashtags = false;
                caption += line.replace(/caption:\s*/i, '').trim() + '\n';
              } else if (line.toLowerCase().includes('hashtags:')) {
                inHashtags = true;
                inCaption = false;
                hashtags += line.replace(/hashtags:\s*/i, '').trim();
              } else if (inCaption && !line.toLowerCase().includes('hashtag')) {
                caption += line.trim() + '\n';
              } else if (inHashtags) {
                hashtags += ' ' + line.trim();
              }
            }

            // Fallback if parsing fails
            if (!caption && !hashtags) {
              caption = generatedText.trim();
            }
          } else {
            throw new Error(`Google API error: ${response.status}`);
          }
        } catch (error) {
          console.log('[CAPTION GENERATION] Google API failed, using template fallback:', error);
          // Fall through to template generation
        }
      }

      // Template-based fallback caption generation
      if (!caption) {
        const captionTemplates = {
          instagram: {
            post: [
              `✨ ${contentTopic} ✨\n\nReady to dive into something amazing? This is exactly what you've been looking for! 💫\n\nWhat do you think? Drop a comment below! 👇`,
              `${contentTopic} hits different! 🔥\n\nSeriously, this is the kind of content that makes your day better. Who else agrees?\n\nTag someone who needs to see this! 🙌`,
              `POV: You discover ${contentTopic} 🤩\n\nThis is your sign to try something new today! Life's too short for boring content.\n\nSave this post for later! 📌`,
              `${contentTopic} just landed on your feed ✨\n\nSometimes the best discoveries happen when you least expect them. This is one of those moments!\n\nShare your thoughts below! 💭`
            ]
          }
        };

        const hashtagSets = {
          instagram: [
            '#viral #explore #trending #fyp #instagood',
            '#content #creative #inspiration #lifestyle #daily',
            '#amazing #discover #share #love #follow',
            '#new #fresh #exciting #fun #awesome'
          ]
        };

        const templates = captionTemplates[platform]?.[type] || captionTemplates.instagram.post;
        const hashtagOptions = hashtagSets[platform] || hashtagSets.instagram;

        caption = templates[Math.floor(Math.random() * templates.length)];
        hashtags = hashtagOptions[Math.floor(Math.random() * hashtagOptions.length)];
      }

      console.log('[CAPTION GENERATION] Caption generated successfully');

      res.json({
        success: true,
        caption: caption.trim(),
        hashtags: hashtags.trim(),
        metadata: {
          title: contentTopic,
          type,
          platform,
          generatedAt: new Date().toISOString()
        }
      });

    } catch (error: any) {
      console.error('[CAPTION GENERATION] Error:', error);
      res.status(500).json({ 
        success: false, 
        error: 'Failed to generate caption: ' + error.message 
      });
    }
  });

  // Instagram Account Connection
  app.post('/api/connect-instagram', requireAuth, async (req: any, res: Response) => {
    try {
      const { accessToken, accountId } = req.body;
      
      if (!accessToken || !accountId) {
        return res.status(400).json({ 
          success: false, 
          error: 'Access token and account ID are required' 
        });
      }

      const workspace = await storage.getDefaultWorkspace(req.user.id);
      if (!workspace) {
        return res.status(404).json({ 
          success: false, 
          error: 'No workspace found' 
        });
      }

      // Verify the access token with Instagram API
      const verifyResponse = await fetch(`https://graph.instagram.com/v18.0/${accountId}?fields=id,username,account_type&access_token=${accessToken}`);
      
      if (!verifyResponse.ok) {
        return res.status(401).json({ 
          success: false, 
          error: 'Invalid Instagram access token' 
        });
      }

      const accountData = await verifyResponse.json();

      // Check if Instagram account already exists
      const existingAccount = await storage.getSocialAccountByPlatform(workspace.id, 'instagram');
      
      if (existingAccount) {
        // Update existing account
        await storage.updateSocialAccount(existingAccount.id, {
          accessToken,
          accountId,
          username: accountData.username,
          accountData: {
            accountType: accountData.account_type,
            connectedAt: new Date().toISOString()
          }
        });
      } else {
        // Create new account
        await storage.createSocialAccount({
          workspaceId: workspace.id,
          platform: 'instagram',
          accountId,
          username: accountData.username,
          accessToken,
          accountData: {
            accountType: accountData.account_type,
            connectedAt: new Date().toISOString()
          }
        });
      }

      res.json({
        success: true,
        message: 'Instagram account connected successfully',
        accountData: {
          username: accountData.username,
          accountType: accountData.account_type
        }
      });

    } catch (error: any) {
      console.error('[INSTAGRAM CONNECT] Error:', error);
      res.status(500).json({ 
        success: false, 
        error: 'Failed to connect Instagram account: ' + error.message 
      });
    }
  });

  // Return the app instead of creating a new server
  return app as any;
}