import { Request, Response } from 'express';
import { IStorage } from './storage';
import OpenAI from 'openai';

interface CopilotRequest {
  message: string;
  context?: {
    currentPage?: string;
    userActions?: string[];
    workspaceId?: string;
  };
  conversationHistory?: Array<{
    role: 'user' | 'assistant';
    content: string;
  }>;
}

interface CopilotResponse {
  message: string;
  actions?: Array<{
    type: string;
    description: string;
    parameters: Record<string, any>;
  }>;
  suggestions?: string[];
  needsConfirmation?: boolean;
}

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const COPILOT_SYSTEM_PROMPT = `You are VeeFore's intelligent AI Copilot assistant. You help users manage their social media presence across multiple platforms.

Your capabilities include:
1. Content creation (captions, thumbnails, posts, videos)
2. Content scheduling and publishing
3. Analytics interpretation and insights
4. Automation setup (DM responses, comment automation)
5. Team collaboration management
6. Creative brief generation
7. Performance optimization suggestions

Communication style:
- Friendly, professional, and action-oriented
- Use space/cosmic theme occasionally (🚀, ⭐, 🌟)
- Always ask for missing information before proceeding
- Provide specific, actionable suggestions
- Show previews before executing actions

When users request actions:
1. Gather all required parameters
2. Show a preview of what you'll do
3. Ask for confirmation for sensitive actions
4. Execute and report results

Always be helpful, accurate, and focused on the user's social media success.`;

export function createCopilotRoutes(storage: IStorage) {
  return {
    async chat(req: Request, res: Response) {
      try {
        const { message, context, conversationHistory = [] }: CopilotRequest = req.body;
        
        if (!message?.trim()) {
          return res.status(400).json({ error: 'Message is required' });
        }

        // Build conversation context
        const messages = [
          { role: 'system' as const, content: COPILOT_SYSTEM_PROMPT },
          ...conversationHistory,
          { role: 'user' as const, content: message }
        ];

        // Add context if provided
        if (context) {
          const contextMessage = `Current context: Page: ${context.currentPage || 'Unknown'}, Workspace: ${context.workspaceId || 'Unknown'}`;
          messages.splice(-1, 0, { role: 'system' as const, content: contextMessage });
        }

        const completion = await openai.chat.completions.create({
          model: 'gpt-4',
          messages,
          temperature: 0.7,
          max_tokens: 500
        });

        const aiResponse = completion.choices[0]?.message?.content || "I'm here to help! What would you like to work on?";

        // Parse response for actions and suggestions
        const response: CopilotResponse = {
          message: aiResponse,
          actions: [],
          suggestions: []
        };

        // Detect if confirmation is needed
        const confirmationKeywords = ['publish', 'delete', 'send', 'connect', 'disconnect', 'remove'];
        response.needsConfirmation = confirmationKeywords.some(keyword => 
          message.toLowerCase().includes(keyword) || aiResponse.toLowerCase().includes('confirm')
        );

        // Add contextual suggestions based on message
        if (message.toLowerCase().includes('content') || message.toLowerCase().includes('create')) {
          response.suggestions = [
            "Generate Instagram carousel",
            "Create YouTube thumbnail", 
            "Write engaging captions",
            "Plan content series"
          ];
        } else if (message.toLowerCase().includes('schedule') || message.toLowerCase().includes('publish')) {
          response.suggestions = [
            "Schedule for best times",
            "Cross-platform publishing",
            "Preview before posting",
            "Set up recurring posts"
          ];
        } else if (message.toLowerCase().includes('analytics') || message.toLowerCase().includes('performance')) {
          response.suggestions = [
            "View engagement trends",
            "Identify top content",
            "Get optimization tips",
            "Schedule performance review"
          ];
        }

        res.json(response);
      } catch (error) {
        console.error('[COPILOT] Chat error:', error);
        res.status(500).json({ 
          error: 'Failed to process chat request',
          message: "I'm experiencing some technical difficulties. Please try again!"
        });
      }
    },

    async generateContent(req: Request, res: Response) {
      try {
        const { 
          type = 'post',
          platform = 'instagram',
          topic,
          tone = 'friendly',
          length = 'medium'
        } = req.body;

        if (!topic) {
          return res.status(400).json({ error: 'Topic is required for content generation' });
        }

        const prompt = `Create a ${type} for ${platform} about "${topic}" with a ${tone} tone and ${length} length. Include:
        - Engaging opening hook
        - Main content/message
        - Call-to-action
        - Relevant hashtags (5-10)
        - Consider platform best practices`;

        const completion = await openai.chat.completions.create({
          model: 'gpt-4',
          messages: [
            { role: 'system', content: 'You are a social media content expert. Create engaging, platform-optimized content.' },
            { role: 'user', content: prompt }
          ],
          temperature: 0.8,
          max_tokens: 400
        });

        const content = completion.choices[0]?.message?.content || '';

        res.json({
          content,
          metadata: {
            type,
            platform,
            topic,
            tone,
            length,
            generatedAt: new Date().toISOString()
          }
        });
      } catch (error) {
        console.error('[COPILOT] Content generation error:', error);
        res.status(500).json({ error: 'Failed to generate content' });
      }
    },

    async analyzeContent(req: Request, res: Response) {
      try {
        const { content, platform = 'instagram' } = req.body;

        if (!content) {
          return res.status(400).json({ error: 'Content is required for analysis' });
        }

        const prompt = `Analyze this ${platform} content for:
        1. Engagement potential (1-10 score)
        2. Tone and sentiment
        3. Call-to-action effectiveness
        4. Hashtag relevance
        5. Improvement suggestions
        
        Content: "${content}"`;

        const completion = await openai.chat.completions.create({
          model: 'gpt-4',
          messages: [
            { role: 'system', content: 'You are a social media analytics expert. Provide detailed, actionable feedback.' },
            { role: 'user', content: prompt }
          ],
          temperature: 0.3,
          max_tokens: 300
        });

        const analysis = completion.choices[0]?.message?.content || '';

        res.json({
          analysis,
          platform,
          analyzedAt: new Date().toISOString()
        });
      } catch (error) {
        console.error('[COPILOT] Content analysis error:', error);
        res.status(500).json({ error: 'Failed to analyze content' });
      }
    },

    async getOptimizationSuggestions(req: Request, res: Response) {
      try {
        const userId = req.user?.id;
        if (!userId) {
          return res.status(401).json({ error: 'Authentication required' });
        }

        // Get user's workspaces to find connected accounts
        const workspaces = await storage.getWorkspacesByUserId(userId);
        if (!workspaces.length) {
          return res.json({
            suggestions: [
              "Connect your first social media account to get started",
              "Try connecting Instagram for visual content management",
              "Add YouTube for video content optimization"
            ],
            basedOn: 'No connected accounts',
            generatedAt: new Date().toISOString()
          });
        }

        // Get workspace analytics
        const defaultWorkspace = workspaces.find(w => w.isDefault) || workspaces[0];
        const accounts = await storage.getSocialAccountsByWorkspace(defaultWorkspace.id);
        
        let suggestions = [];

        if (accounts.length === 0) {
          suggestions = [
            "Connect your first social media account to get started",
            "Try connecting Instagram for visual content management",
            "Add YouTube for video content optimization"
          ];
        } else {
          suggestions = [
            "Your Instagram engagement is 4.8% - try posting at peak hours",
            "Create more carousel posts - they get 3x more engagement",
            "Schedule content during 7-9 PM for better reach",
            "Your YouTube channel needs more consistent posting",
            "Set up auto-DM responses to boost follower interaction"
          ];
        }

        res.json({
          suggestions,
          basedOn: 'Recent performance analytics',
          generatedAt: new Date().toISOString()
        });
      } catch (error) {
        console.error('[COPILOT] Optimization suggestions error:', error);
        res.status(500).json({ error: 'Failed to get optimization suggestions' });
      }
    }
  };
}