import { MongoStorage } from './mongodb-storage';
import { ConversationMemoryService } from './conversation-memory-service';
import { InstagramTokenManager } from './instagram-token-manager';
import axios from 'axios';

export class EnhancedAutoDMService {
  private storage: MongoStorage;
  private memoryService: ConversationMemoryService;
  private tokenManager: InstagramTokenManager;
  private processedMessages: Set<string> = new Set(); // Track processed message IDs

  constructor(storage: MongoStorage) {
    this.storage = storage;
    this.memoryService = new ConversationMemoryService(storage);
    this.tokenManager = new InstagramTokenManager(storage);
  }

  // Enhanced webhook handler for Instagram DMs with memory integration
  async handleInstagramDMWebhook(webhookData: any): Promise<void> {
    console.log('[ENHANCED DM] Processing Instagram DM webhook with memory');
    
    try {
      const { entry } = webhookData;
      
      for (const entryItem of entry) {
        const { messaging } = entryItem;
        
        if (messaging) {
          for (const message of messaging) {
            await this.processIncomingMessage(message);
          }
        }
      }
    } catch (error) {
      console.error('[ENHANCED DM ERROR] Failed to process webhook:', error);
      throw error;
    }
  }

  // Process incoming Instagram DM with conversation memory
  private async processIncomingMessage(messageData: any): Promise<void> {
    console.log('[ENHANCED DM] Processing incoming message with context');
    
    try {
      const { sender, recipient, message } = messageData;
      
      // Better error handling for message structure
      if (!sender?.id || !recipient?.id || !message?.text || !message?.mid) {
        console.log('[ENHANCED DM] Skipping message - missing required fields');
        return;
      }
      
      const senderId = sender.id;
      const recipientId = recipient.id;
      const messageText = message.text;
      const messageId = message.mid;

      // Check if we've already processed this message to prevent duplicates
      const messageKey = `${messageId}_${senderId}_${recipientId}`;
      if (this.processedMessages.has(messageKey)) {
        console.log(`[ENHANCED DM] Skipping duplicate message: ${messageKey}`);
        return;
      }
      
      // Mark message as processed
      this.processedMessages.add(messageKey);
      
      // Clean up old processed messages (keep only last 1000)
      if (this.processedMessages.size > 1000) {
        const keysArray = Array.from(this.processedMessages);
        keysArray.slice(0, 500).forEach(key => this.processedMessages.delete(key));
      }

      // Find workspace and automation rules for DM type
      console.log('[ENHANCED DM] Looking for active DM automation rules');
      const automationRules = await this.storage.getAutomationRulesByType('dm');
      console.log(`[ENHANCED DM] Found ${automationRules.length} DM rules`);
      
      // Process only the first active rule to prevent duplicate responses
      let responseGenerated = false;
      
      for (const rule of automationRules) {
        if (!rule.isActive || responseGenerated) {
          console.log(`[ENHANCED DM] Skipping rule: ${rule.name} (${responseGenerated ? 'response already generated' : 'inactive'})`);
          continue;
        }

        console.log(`[ENHANCED DM] Processing rule: ${rule.name} for workspace: ${rule.workspaceId}`);
        const socialAccounts = await this.storage.getSocialAccountsByWorkspace(rule.workspaceId.toString());
        console.log(`[ENHANCED DM] Found ${socialAccounts.length} social accounts for workspace`);
        
        const instagramAccount = socialAccounts.find(acc => 
          acc.platform === 'instagram'
        );
        console.log(`[ENHANCED DM] Instagram account found:`, instagramAccount ? 'YES' : 'NO');

        if (!instagramAccount) continue;

        console.log(`[ENHANCED DM] Processing DM for workspace ${rule.workspaceId}`);
        
        // Get or create conversation with memory
        const conversation = await this.memoryService.getOrCreateConversation(
          rule.workspaceId.toString(),
          'instagram',
          senderId,
          sender.username || senderId
        );

        // Store incoming user message
        await this.memoryService.storeMessage(
          conversation.id,
          messageId,
          'user',
          messageText,
          rule.id
        );

        // Generate contextual AI response using conversation memory
        // Handle workspace ID format issue safely
        let workspace = null;
        try {
          workspace = await this.storage.getWorkspace(rule.workspaceId.toString());
        } catch (error) {
          console.log(`[ENHANCED DM] Could not get workspace ${rule.workspaceId}, using default personality`);
        }
        
        const aiResponse = await this.memoryService.generateContextualResponse(
          conversation.id,
          messageText,
          workspace?.aiPersonality || 'professional'
        );

        // Get valid Instagram page access token using token manager
        const pageTokenInfo = await this.tokenManager.getPageAccessToken(instagramAccount.workspaceId.toString());
        
        let success = false;
        if (pageTokenInfo) {
          success = await this.sendInstagramDM(
            pageTokenInfo.accessToken,
            pageTokenInfo.pageId,
            senderId,
            aiResponse
          );
        } else {
          // Fallback to stored token with enhanced error handling
          success = await this.sendInstagramDM(
            instagramAccount.accessToken!,
            recipientId,
            senderId,
            aiResponse
          );
        }

        if (success) {
          // Store AI response in conversation memory
          await this.memoryService.storeMessage(
            conversation.id,
            null, // Instagram doesn't provide message ID for sent messages immediately
            'ai',
            aiResponse,
            rule.id
          );

          console.log(`[ENHANCED DM] Sent contextual response: ${aiResponse.substring(0, 50)}...`);
          responseGenerated = true; // Prevent other rules from generating duplicate responses
        } else {
          console.error('[ENHANCED DM] Failed to send Instagram DM response');
        }
      }
    } catch (error) {
      console.error('[ENHANCED DM ERROR] Failed to process incoming message:', error);
    }
  }

  // Send Instagram DM using Instagram Graph API
  private async sendInstagramDM(
    accessToken: string,
    pageId: string,
    recipientId: string,
    messageText: string
  ): Promise<boolean> {
    console.log('[ENHANCED DM] Sending Instagram DM via Instagram Graph API');
    
    try {
      // Use Instagram Graph API messaging endpoint as per documentation
      const url = `https://graph.instagram.com/v23.0/${pageId}/messages`;
      
      const payload = {
        recipient: {
          id: recipientId
        },
        message: {
          text: messageText
        }
      };

      const response = await axios.post(url, payload, {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        },
        timeout: 10000
      });

      if (response.status === 200) {
        console.log('[ENHANCED DM] Successfully sent Instagram Graph API DM');
        return true;
      } else {
        console.error('[ENHANCED DM] Instagram Graph API returned non-200 status:', response.status);
        return false;
      }
    } catch (error: any) {
      console.error('[ENHANCED DM ERROR] Failed to send Instagram Graph API DM:', error.response?.data || error.message);
      return false;
    }
  }

  // Get conversation history for dashboard display
  async getConversationHistory(workspaceId: string, limit: number = 50): Promise<any[]> {
    console.log(`[ENHANCED DM] Getting conversation history for workspace ${workspaceId}`);
    
    try {
      // Get all conversations for workspace
      const conversations = await this.storage.getDmConversations(workspaceId, limit);
      
      const conversationHistory = [];
      
      for (const conversation of conversations) {
        const messages = await this.memoryService.getConversationHistory(conversation.id, 5);
        const context = await this.memoryService.getConversationContext(conversation.id);
        
        conversationHistory.push({
          id: conversation.id,
          participant: {
            id: conversation.participantId,
            username: conversation.participantUsername,
            platform: conversation.platform
          },
          lastMessage: messages[messages.length - 1] || null,
          messageCount: conversation.messageCount,
          lastActive: conversation.lastMessageAt,
          recentMessages: messages.slice(-3), // Last 3 messages for preview
          context: context.slice(0, 5), // Top 5 context items
          sentiment: this.extractOverallSentiment(context),
          topics: this.extractTopics(context)
        });
      }
      
      return conversationHistory.sort((a, b) => 
        new Date(b.lastActive).getTime() - new Date(a.lastActive).getTime()
      );
    } catch (error) {
      console.error('[ENHANCED DM ERROR] Failed to get conversation history:', error);
      return [];
    }
  }

  // Get conversation statistics for analytics
  async getConversationAnalytics(workspaceId: string): Promise<any> {
    console.log(`[ENHANCED DM] Getting conversation analytics for workspace ${workspaceId}`);
    
    try {
      const stats = await this.memoryService.getConversationStats(workspaceId);
      
      // Get additional analytics
      const last7Days = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
      const last30Days = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
      
      const recentConversations = await this.getConversationHistory(workspaceId, 100);
      const activeThisWeek = recentConversations.filter(conv => 
        new Date(conv.lastActive) > last7Days
      ).length;
      
      const sentimentDistribution = this.calculateSentimentDistribution(recentConversations);
      const topTopics = this.calculateTopTopics(recentConversations);
      const responseRate = this.calculateResponseRate(recentConversations);
      
      return {
        ...stats,
        activeThisWeek,
        sentimentDistribution,
        topTopics,
        responseRate,
        averageMessagesPerConversation: stats.totalMessages / Math.max(stats.totalConversations, 1),
        memoryRetentionDays: 3
      };
    } catch (error) {
      console.error('[ENHANCED DM ERROR] Failed to get conversation analytics:', error);
      return {
        totalConversations: 0,
        activeConversations: 0,
        totalMessages: 0,
        averageResponseTime: 0,
        activeThisWeek: 0,
        sentimentDistribution: { positive: 0, negative: 0, neutral: 0 },
        topTopics: [],
        responseRate: 0,
        averageMessagesPerConversation: 0,
        memoryRetentionDays: 3
      };
    }
  }

  // Cleanup expired conversation memory (run daily)
  async cleanupExpiredMemory(): Promise<void> {
    console.log('[ENHANCED DM] Running memory cleanup for expired conversations');
    
    try {
      await this.memoryService.cleanupExpiredMemory();
      console.log('[ENHANCED DM] Memory cleanup completed successfully');
    } catch (error) {
      console.error('[ENHANCED DM ERROR] Failed to cleanup expired memory:', error);
    }
  }

  // Test contextual response generation
  async testContextualResponse(
    workspaceId: string,
    participantId: string,
    testMessage: string
  ): Promise<string> {
    console.log(`[ENHANCED DM] Testing contextual response for ${participantId}`);
    
    try {
      // Get or create test conversation
      const conversation = await this.memoryService.getOrCreateConversation(
        workspaceId,
        'instagram',
        participantId,
        `test_user_${participantId}`
      );

      // Store test message
      await this.memoryService.storeMessage(
        conversation.id,
        `test_${Date.now()}`,
        'user',
        testMessage
      );

      // Generate contextual response
      const workspace = await this.storage.getWorkspace(parseInt(workspaceId));
      const response = await this.memoryService.generateContextualResponse(
        conversation.id,
        testMessage,
        workspace?.aiPersonality
      );

      // Store AI response
      await this.memoryService.storeMessage(
        conversation.id,
        null,
        'ai',
        response
      );

      return response;
    } catch (error) {
      console.error('[ENHANCED DM ERROR] Failed to test contextual response:', error);
      return 'I apologize, but I encountered an error processing your message. Please try again.';
    }
  }

  // Helper methods for analytics
  private extractOverallSentiment(context: any[]): string {
    const sentiments = context
      .filter(ctx => ctx.contextType === 'sentiment')
      .map(ctx => ctx.contextValue);
    
    if (sentiments.length === 0) return 'neutral';
    
    const sentimentCounts = sentiments.reduce((acc, sentiment) => {
      acc[sentiment] = (acc[sentiment] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    
    return Object.entries(sentimentCounts)
      .sort(([,a], [,b]) => b - a)[0]?.[0] || 'neutral';
  }

  private extractTopics(context: any[]): string[] {
    return context
      .filter(ctx => ctx.contextType === 'topic')
      .map(ctx => ctx.contextValue)
      .slice(0, 5);
  }

  private calculateSentimentDistribution(conversations: any[]): any {
    const sentiments = conversations.map(conv => conv.sentiment);
    const total = sentiments.length;
    
    if (total === 0) return { positive: 0, negative: 0, neutral: 0 };
    
    const counts = sentiments.reduce((acc, sentiment) => {
      acc[sentiment] = (acc[sentiment] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    
    return {
      positive: Math.round((counts.positive || 0) / total * 100),
      negative: Math.round((counts.negative || 0) / total * 100),
      neutral: Math.round((counts.neutral || 0) / total * 100)
    };
  }

  private calculateTopTopics(conversations: any[]): { topic: string; count: number }[] {
    const allTopics = conversations.flatMap(conv => conv.topics || []);
    const topicCounts = allTopics.reduce((acc, topic) => {
      acc[topic] = (acc[topic] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    
    return Object.entries(topicCounts)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 10)
      .map(([topic, count]) => ({ topic, count }));
  }

  private calculateResponseRate(conversations: any[]): number {
    if (conversations.length === 0) return 0;
    
    const conversationsWithAIResponse = conversations.filter(conv => 
      conv.recentMessages?.some((msg: any) => msg.sender === 'ai')
    ).length;
    
    return Math.round(conversationsWithAIResponse / conversations.length * 100);
  }
}