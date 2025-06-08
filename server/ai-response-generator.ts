import { GoogleGenerativeAI } from '@google/generative-ai';

interface MessageContext {
  message: string;
  userProfile?: {
    username: string;
    language?: string;
    previousInteractions?: string[];
  };
  postContext?: {
    caption: string;
    hashtags: string[];
  };
}

interface AIResponseConfig {
  personality: string;
  responseLength: string;
  businessContext?: string;
}

interface AIResponse {
  response: string;
  detectedLanguage: string;
  confidence: number;
  reasoning?: string;
}

class AIResponseGenerator {
  private genAI: GoogleGenerativeAI;
  private responseHistory: Set<string> = new Set();
  
  // Ultra-natural response templates optimized for Instagram's spam detection
  private naturalResponses = {
    price: [
      "DM", "Check my story", "Inbox", "Message", "Text me", "Slide into DMs", 
      "Link in bio", "DM me details", "Check highlights", "Story has info"
    ],
    greeting: [
      "Hey", "Hi there", "Hello", "What's up", "Sup", "Yo", "Heyy", "Hiiii"
    ],
    thanks: [
      "Thanks", "Ty", "Thank you", "Appreciate it", "Love", "❤️", "🙏", "Much love"
    ],
    location: [
      "Here", "Online", "Available", "Present", "Around", "Active"
    ],
    excitement: [
      "Amazing", "Love this", "So cool", "Nice", "Great", "Awesome", "Perfect", "Yes"
    ],
    question: [
      "What", "How", "When", "Where", "Tell me more", "Info please", "Details"
    ]
  };

  constructor() {
    if (!process.env.GOOGLE_API_KEY) {
      throw new Error('GOOGLE_API_KEY is required for AI response generation');
    }
    this.genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);
  }

  async generateContextualResponse(
    context: MessageContext,
    config: AIResponseConfig
  ): Promise<AIResponse> {
    try {
      const model = this.genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

      const prompt = this.buildPrompt(context, config);
      const result = await model.generateContent(prompt);
      const response = result.response;
      const text = response.text();

      // Apply anti-spam filtering and ensure uniqueness
      const cleanResponse = this.generateAntiSpamResponse(text, context.message);
      
      return {
        response: cleanResponse,
        detectedLanguage: this.detectLanguage(context.message),
        confidence: 0.85,
        reasoning: "Generated with anti-spam optimization"
      };
    } catch (error) {
      console.error('[AI RESPONSE] Error generating response:', error);
      
      // Generate natural fallback that avoids spam detection
      const fallbackResponse = this.generateNaturalFallback(context.message, context.userProfile?.username);
      return {
        response: fallbackResponse.response,
        detectedLanguage: fallbackResponse.language,
        confidence: 0.75,
        reasoning: "Generated using natural fallback to avoid spam detection"
      };
    }
  }

  /**
   * Generate anti-spam response by ensuring uniqueness and natural language
   */
  private generateAntiSpamResponse(aiResponse: string, originalMessage: string): string {
    // Clean the AI response
    let response = aiResponse.trim();
    
    // Remove quotes if present
    response = response.replace(/^["']|["']$/g, '');
    
    // Check if this response was used recently
    if (this.responseHistory.has(response)) {
      // Generate a completely different response
      return this.generateNaturalFallback(originalMessage, undefined).response;
    }
    
    // Add to history (keep only last 100 responses)
    this.responseHistory.add(response);
    if (this.responseHistory.size > 100) {
      const firstItem = this.responseHistory.values().next().value;
      this.responseHistory.delete(firstItem);
    }
    
    // Ensure response is short and natural
    if (response.length > 50) {
      response = this.shortenResponse(response, originalMessage);
    }
    
    return response;
  }

  /**
   * Generate ultra-natural responses optimized for Instagram's spam detection
   */
  private generateNaturalFallback(message: string, username?: string): { response: string; language: string } {
    const language = this.detectLanguage(message);
    const messageWords = message.toLowerCase();
    
    // Use extremely short, natural responses that real people use
    if (messageWords.includes('price') || messageWords.includes('cost') || messageWords.includes('kitna')) {
      const responses = language === 'hindi' || language === 'hinglish' 
        ? ['DM', 'Inbox', 'Message karo', 'DM me']
        : ['DM', 'Inbox', 'Message', 'Text'];
      return {
        response: this.getRandomResponse(responses),
        language
      };
    }
    
    if (messageWords.includes('where') || messageWords.includes('kaha') || messageWords.includes('location')) {
      const responses = language === 'hindi' || language === 'hinglish'
        ? ['Yahan', 'Here', 'Available', 'Present']
        : ['Here', 'Available', 'Around', 'Present'];
      return {
        response: this.getRandomResponse(responses),
        language
      };
    }
    
    if (messageWords.includes('thanks') || messageWords.includes('thank') || messageWords.includes('dhanyawad')) {
      const responses = language === 'hindi' || language === 'hinglish'
        ? ['Welcome', 'Anytime', '❤️', '🙏']
        : ['Welcome', 'Anytime', '❤️', 'No problem'];
      return {
        response: this.getRandomResponse(responses),
        language
      };
    }
    
    if (messageWords.includes('nice') || messageWords.includes('good') || messageWords.includes('great') || messageWords.includes('amazing')) {
      const responses = language === 'hindi' || language === 'hinglish'
        ? ['Thanks', 'Dhanyawad', '❤️', 'Love']
        : ['Thanks', 'Appreciate it', '❤️', 'Love'];
      return {
        response: this.getRandomResponse(responses),
        language
      };
    }
    
    // Ultra-short default responses that real humans use
    const defaultResponses = language === 'hindi' || language === 'hinglish'
      ? ['Haan', 'Yes', 'Ok', 'Sure', 'Right']
      : ['Yes', 'Ok', 'Sure', 'Right', 'True'];
    
    return {
      response: this.getRandomResponse(defaultResponses),
      language
    };
  }

  /**
   * Get random response from array to ensure variety
   */
  private getRandomResponse(responses: string[]): string {
    return responses[Math.floor(Math.random() * responses.length)];
  }

  /**
   * Shorten response while maintaining meaning
   */
  private shortenResponse(response: string, originalMessage: string): string {
    // Extract key intent and create short response
    if (response.toLowerCase().includes('price') || originalMessage.toLowerCase().includes('price')) {
      return 'DM me';
    }
    
    // Default to first few words
    const words = response.split(' ');
    return words.slice(0, 3).join(' ');
  }

  private generateIntelligentFallback(context: MessageContext, config: AIResponseConfig): { response: string; language: string } {
    const message = context.message.toLowerCase();
    const username = (context as any).username || 'friend';
    
    // Detect language
    const language = this.detectLanguage(context.message);
    
    // Generate contextual responses based on message content
    if (message.includes('price') || message.includes('cost') || message.includes('chahiye')) {
      if (language === 'hindi' || language === 'hinglish') {
        return {
          response: `Namaste @${username}! Price details ke liye please DM kariye. Hum aapko best rates provide karenge! 🙏`,
          language: 'hinglish'
        };
      } else {
        return {
          response: `Hi @${username}! For pricing details, please send us a DM. We'll provide you with our best rates!`,
          language: 'english'
        };
      }
    }
    
    if (message.includes('info') || message.includes('details') || message.includes('help')) {
      if (language === 'hindi' || language === 'hinglish') {
        return {
          response: `Hi @${username}! Hum yahan help karne ke liye hain. Kya specific information chahiye?`,
          language: 'hinglish'
        };
      } else {
        return {
          response: `Hi @${username}! We're here to help. What specific information do you need?`,
          language: 'english'
        };
      }
    }
    
    // Default contextual responses
    if (language === 'hindi' || language === 'hinglish') {
      return {
        response: `Dhanyawad @${username}! Aapka message receive hua hai. Hum jaldi reply karenge! 🙏`,
        language: 'hinglish'
      };
    } else {
      return {
        response: `Thank you @${username}! We've received your message and will get back to you soon!`,
        language: 'english'
      };
    }
  }

  private detectLanguage(text: string): string {
    const hindiPattern = /[\u0900-\u097F]/;
    const hinglishWords = ['chahiye', 'kya', 'hai', 'aur', 'kar', 'ke', 'se', 'me', 'ki', 'ka'];
    
    if (hindiPattern.test(text)) {
      return 'hindi';
    } else if (hinglishWords.some(word => text.toLowerCase().includes(word))) {
      return 'hinglish';
    } else {
      return 'english';
    }
  }

  private buildPrompt(context: MessageContext, config: AIResponseConfig): string {
    const personalityMap = {
      friendly: "friendly, warm, and approachable",
      professional: "professional, polite, and respectful",
      casual: "casual, relaxed, and conversational",
      enthusiastic: "enthusiastic, energetic, and excited",
      helpful: "helpful, supportive, and solution-oriented"
    };

    const lengthMap = {
      short: "1-2 sentences maximum",
      medium: "2-3 sentences",
      long: "3-4 sentences with detailed response"
    };

    return `You are a real person managing Instagram comments. Create NATURAL responses that avoid spam detection.

Comment: "${context.message}"
User: @${context.userProfile?.username || 'user'}
${context.postContext ? `Post context: ${context.postContext.caption}` : ''}
${config.businessContext ? `Business: ${config.businessContext}` : ''}

ANTI-SPAM REQUIREMENTS:
1. Generate UNIQUE responses - never use templates
2. Keep under 30 characters when possible
3. Sound conversational, not robotic
4. Use natural language matching the comment's tone
5. Avoid promotional language
6. Be specific to this exact comment
7. Use emojis sparingly (max 1)

Response style: ${lengthMap[config.responseLength as keyof typeof lengthMap] || 'short'}, ${personalityMap[config.personality as keyof typeof personalityMap] || 'friendly'}

Generate ONLY the response text, nothing else:
- For "This is so cool 🔥🔥" → Match the energy in English

Generate response now:`;
  }

  private parseAIResponse(text: string): any {
    try {
      // Try to extract JSON from the response
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        const parsed = JSON.parse(jsonMatch[0]);
        return {
          response: parsed.response || text,
          language: parsed.language || 'en',
          confidence: parsed.confidence || 0.8,
          reasoning: parsed.reasoning || 'Standard response generation'
        };
      }
      
      // Fallback if JSON parsing fails
      return {
        response: text,
        language: 'en',
        confidence: 0.7,
        reasoning: 'Fallback response parsing'
      };
    } catch (error) {
      console.error('[AI RESPONSE] Error parsing response:', error);
      return {
        response: text,
        language: 'en',
        confidence: 0.6,
        reasoning: 'Error in response parsing'
      };
    }
  }

  async analyzeMessage(message: string): Promise<{
    language: string;
    tone: string;
    intent: string;
    needsResponse: boolean;
    urgency: 'low' | 'medium' | 'high';
  }> {
    try {
      const model = this.genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
      
      const analysisPrompt = `Analyze this social media message and provide insights:

MESSAGE: "${message}"

Provide analysis in JSON format:
{
  "language": "hi/en/hi-en (for hinglish)",
  "tone": "positive/negative/neutral/questioning/urgent",
  "intent": "appreciation/question/complaint/general/spam",
  "needsResponse": true/false,
  "urgency": "low/medium/high",
  "keywords": ["extracted", "keywords"],
  "sentiment_score": 0.8
}`;

      const result = await model.generateContent(analysisPrompt);
      const response = result.response.text();
      
      const jsonMatch = response.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0]);
      }
      
      // Fallback analysis
      return {
        language: 'en',
        tone: 'neutral',
        intent: 'general',
        needsResponse: true,
        urgency: 'low'
      };
    } catch (error) {
      console.error('[AI ANALYSIS] Error analyzing message:', error);
      return {
        language: 'en',
        tone: 'neutral', 
        intent: 'general',
        needsResponse: true,
        urgency: 'low'
      };
    }
  }
}

export { AIResponseGenerator, type MessageContext, type AIResponseConfig, type AIResponse };