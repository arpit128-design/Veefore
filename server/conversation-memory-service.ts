import { MongoStorage } from './mongodb-storage';
import OpenAI from 'openai';
import { DmConversation, DmMessage, ConversationContext, InsertDmConversation, InsertDmMessage, InsertConversationContext } from '@shared/schema';

// the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || process.env.GOOGLE_API_KEY, // Fallback to Google API key if OpenAI not available
});

export class ConversationMemoryService {
  private storage: MongoStorage;
  private readonly MEMORY_DURATION_DAYS = 3;

  constructor(storage: MongoStorage) {
    this.storage = storage;
  }

  // Get or create conversation for a participant
  async getOrCreateConversation(
    workspaceId: string,
    platform: string,
    participantId: string,
    participantUsername?: string
  ): Promise<DmConversation> {
    console.log(`[MEMORY] Getting conversation for ${participantId} on ${platform}`);
    
    try {
      // Check if conversation exists
      const existing = await this.storage.getDmConversation(workspaceId, platform, participantId);
      if (existing) {
        console.log(`[MEMORY] Found existing conversation ID: ${existing.id}`);
        return existing;
      }

      // Create new conversation
      const conversationData: InsertDmConversation = {
        workspaceId: parseInt(workspaceId),
        platform,
        participantId,
        participantUsername: participantUsername || participantId
      };

      const newConversation = await this.storage.createDmConversation(conversationData);
      console.log(`[MEMORY] Created new conversation ID: ${newConversation.id}`);
      return newConversation;
    } catch (error) {
      console.error(`[MEMORY ERROR] Failed to get/create conversation:`, error);
      throw error;
    }
  }

  // Store incoming message and extract context
  async storeMessage(
    conversationId: number,
    messageId: string | null,
    sender: 'user' | 'ai',
    content: string,
    automationRuleId?: number
  ): Promise<DmMessage> {
    console.log(`[MEMORY] Storing ${sender} message for conversation ${conversationId}`);

    try {
      // Analyze message for sentiment and topics using AI
      const analysis = await this.analyzeMessage(content);
      
      const messageData: InsertDmMessage = {
        conversationId,
        messageId,
        sender,
        content,
        messageType: 'text',
        sentiment: analysis.sentiment,
        topics: analysis.topics,
        aiResponse: sender === 'ai',
        automationRuleId
      };

      const message = await this.storage.createDmMessage(messageData);
      
      // Extract and store conversation context if this is a user message
      if (sender === 'user') {
        await this.extractAndStoreContext(conversationId, content, analysis);
      }

      // Update conversation's last message time
      await this.storage.updateConversationLastMessage(conversationId);
      
      console.log(`[MEMORY] Stored message ID: ${message.id} with sentiment: ${analysis.sentiment}`);
      return message;
    } catch (error) {
      console.error(`[MEMORY ERROR] Failed to store message:`, error);
      throw error;
    }
  }

  // Get conversation history for context
  async getConversationHistory(
    conversationId: number,
    limit: number = 10
  ): Promise<DmMessage[]> {
    console.log(`[MEMORY] Getting history for conversation ${conversationId}, limit: ${limit}`);
    
    try {
      const messages = await this.storage.getDmMessages(conversationId, limit);
      console.log(`[MEMORY] Retrieved ${messages.length} messages from history`);
      return messages;
    } catch (error) {
      console.error(`[MEMORY ERROR] Failed to get conversation history:`, error);
      return [];
    }
  }

  // Get conversation context for enhanced AI responses
  async getConversationContext(conversationId: number): Promise<ConversationContext[]> {
    console.log(`[MEMORY] Getting context for conversation ${conversationId}`);
    
    try {
      const context = await this.storage.getConversationContext(conversationId);
      console.log(`[MEMORY] Retrieved ${context.length} context items`);
      return context;
    } catch (error) {
      console.error(`[MEMORY ERROR] Failed to get conversation context:`, error);
      return [];
    }
  }

  // Generate contextual AI response using conversation memory
  async generateContextualResponse(
    conversationId: number,
    userMessage: string,
    workspacePersonality?: string
  ): Promise<string> {
    console.log(`[MEMORY] Generating contextual response for conversation ${conversationId}`);

    try {
      // Get conversation history
      const history = await this.getConversationHistory(conversationId, 8);
      const context = await this.getConversationContext(conversationId);

      // Build context prompt
      const conversationSummary = history
        .slice(-6) // Last 6 messages for immediate context
        .map(msg => `${msg.sender === 'user' ? 'Customer' : 'You'}: ${msg.content}`)
        .join('\n');

      const contextSummary = context
        .filter(ctx => new Date(ctx.expiresAt!) > new Date()) // Only non-expired context
        .map(ctx => `${ctx.contextType}: ${ctx.contextValue}`)
        .join(', ');

      const systemPrompt = `You are a helpful AI assistant for social media customer service. You have memory of previous conversations and should respond contextually.

Personality: ${workspacePersonality || 'Professional and friendly'}

Previous conversation:
${conversationSummary}

Context about this customer:
${contextSummary}

Current message: ${userMessage}

Instructions:
- Remember and reference previous parts of the conversation naturally
- Be conversational and human-like
- Keep responses concise (1-2 sentences max)
- Show you understand the context from previous messages
- Be helpful and engaging
- If greeting someone you've talked to before, acknowledge the previous conversation
- Use emojis appropriately but sparingly`;

      const response = await openai.chat.completions.create({
        model: "gpt-4o",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userMessage }
        ],
        max_tokens: 150,
        temperature: 0.7
      });

      const aiResponse = response.choices[0].message.content || "I understand, thank you for your message!";
      console.log(`[MEMORY] Generated contextual response: ${aiResponse.substring(0, 50)}...`);
      
      return aiResponse;
    } catch (error) {
      console.error(`[MEMORY ERROR] Failed to generate contextual response:`, error);
      // Fallback response
      return "Thank you for your message! How can I help you today?";
    }
  }

  // Analyze message using AI for sentiment and topic extraction
  private async analyzeMessage(content: string): Promise<{
    sentiment: string;
    topics: string[];
  }> {
    try {
      const analysisPrompt = `Analyze this customer message for sentiment and key topics.

Message: "${content}"

Respond in JSON format:
{
  "sentiment": "positive|negative|neutral",
  "topics": ["topic1", "topic2"]
}

Keep topics short (1-2 words) and relevant to customer service context.`;

      const response = await openai.chat.completions.create({
        model: "gpt-4o",
        messages: [{ role: "user", content: analysisPrompt }],
        max_tokens: 100,
        temperature: 0.3,
        response_format: { type: "json_object" }
      });

      const analysis = JSON.parse(response.choices[0].message.content || '{}');
      return {
        sentiment: analysis.sentiment || 'neutral',
        topics: Array.isArray(analysis.topics) ? analysis.topics.slice(0, 3) : []
      };
    } catch (error) {
      console.error(`[MEMORY ERROR] Failed to analyze message:`, error);
      return {
        sentiment: 'neutral',
        topics: []
      };
    }
  }

  // Extract and store conversation context
  private async extractAndStoreContext(
    conversationId: number,
    content: string,
    analysis: { sentiment: string; topics: string[] }
  ): Promise<void> {
    try {
      const expiresAt = new Date();
      expiresAt.setDate(expiresAt.getDate() + this.MEMORY_DURATION_DAYS);

      // Store sentiment as context
      if (analysis.sentiment !== 'neutral') {
        const sentimentContext: InsertConversationContext = {
          conversationId,
          contextType: 'sentiment',
          contextValue: analysis.sentiment,
          confidence: 85,
          expiresAt
        };
        await this.storage.createConversationContext(sentimentContext);
      }

      // Store topics as context
      for (const topic of analysis.topics) {
        const topicContext: InsertConversationContext = {
          conversationId,
          contextType: 'topic',
          contextValue: topic,
          confidence: 80,
          expiresAt
        };
        await this.storage.createConversationContext(topicContext);
      }

      // Extract intent/questions for better context
      if (content.includes('?') || content.toLowerCase().includes('help')) {
        const intentContext: InsertConversationContext = {
          conversationId,
          contextType: 'intent',
          contextValue: content.includes('?') ? 'question' : 'help_request',
          confidence: 90,
          expiresAt
        };
        await this.storage.createConversationContext(intentContext);
      }

      console.log(`[MEMORY] Stored context for conversation ${conversationId}`);
    } catch (error) {
      console.error(`[MEMORY ERROR] Failed to store context:`, error);
    }
  }

  // Clean up expired conversation memory (3+ days old)
  async cleanupExpiredMemory(): Promise<void> {
    console.log(`[MEMORY CLEANUP] Starting cleanup of expired memory`);
    
    try {
      const cutoffDate = new Date();
      cutoffDate.setDate(cutoffDate.getDate() - this.MEMORY_DURATION_DAYS);
      
      await this.storage.cleanupExpiredContext(cutoffDate);
      await this.storage.cleanupOldMessages(cutoffDate);
      
      console.log(`[MEMORY CLEANUP] Cleaned up memory older than ${cutoffDate.toISOString()}`);
    } catch (error) {
      console.error(`[MEMORY CLEANUP ERROR] Failed to cleanup expired memory:`, error);
    }
  }

  // Get conversation statistics
  async getConversationStats(workspaceId: string): Promise<{
    totalConversations: number;
    activeConversations: number;
    totalMessages: number;
    averageResponseTime: number;
  }> {
    try {
      return await this.storage.getConversationStats(workspaceId);
    } catch (error) {
      console.error(`[MEMORY ERROR] Failed to get conversation stats:`, error);
      return {
        totalConversations: 0,
        activeConversations: 0,
        totalMessages: 0,
        averageResponseTime: 0
      };
    }
  }
}