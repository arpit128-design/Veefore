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
      
      // Use intelligent fallback that relies on AI understanding
      const intelligentFallback = this.generateIntelligentFallback(context, config);
      const fallbackResponse = intelligentFallback.response;
      
      return {
        response: fallbackResponse,
        detectedLanguage: intelligentFallback.language,
        confidence: 0.75,
        reasoning: `Generated ${intelligentFallback.language} response with intelligent fallback`
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
      if (firstItem !== undefined) {
        this.responseHistory.delete(firstItem);
      }
    }
    
    // Ensure response is short and natural
    if (response.length > 50) {
      response = this.shortenResponse(response, originalMessage);
    }
    
    return response;
  }

  /**
   * Analyze message language, tone, and personality for contextual responses
   */
  private analyzeMessageStyle(message: string): {
    language: string;
    tone: string;
    personality: string;
    style: string;
    formality: string;
  } {
    const lowerMessage = message.toLowerCase();
    
    // Enhanced language detection with comprehensive Hindi/Hinglish patterns
    let language = 'english';
    const hindiPatterns = /[\u0900-\u097F]|(?:hai|haan|nahi|kya|acha|achchha|theek|thik|bhai|yaar|dost|kar|raha|rahe|rahi|kaise|kahan|kab|kyu|kyun|dekho|sunna|bolna|samjha|samjhi|mai|main|meri|mera|mere|tera|tere|teri|uska|uski|uske|hu|hoon|hain|tha|thi|the|chaliye|chalo|batao|suno|dekho|accha|badhiya|ekdam|bilkul|zarur|pakka|sach|jhooth)/i;
    const hinglishPatterns = /(?:kya|hai|haan|nahi|acha|achchha|theek|thik|bhai|yaar|dost|kar|raha|rahe|rahi|kaise|kahan|kab|kyu|kyun|dekho|sunna|bolna|samjha|samjhi|mai|main|meri|mera|mere|tera|tere|teri|uska|uski|uske|hu|hoon|hain|tha|thi|the|chaliye|chalo|batao|suno|dekho|accha|badhiya|ekdam|bilkul|zarur|pakka|sach|jhooth|bro|yaar|good|nice|okay|ok|thanks|thank|please)/i;
    
    if (hindiPatterns.test(message)) {
      language = /[\u0900-\u097F]/.test(message) ? 'hindi' : 'hinglish';
    } else if (hinglishPatterns.test(message)) {
      language = 'hinglish';
    }
    
    // Advanced tone detection
    let tone = 'neutral';
    if (/[!]{2,}|[?]{2,}|wow|amazing|awesome|great|love|best|fantastic|incredible|super|perfect/i.test(message)) {
      tone = 'excited';
    } else if (/thanks|thank you|appreciate|grateful|shukriya|dhanyawad/i.test(message)) {
      tone = 'appreciative';
    } else if (/help|please|request|need|want|madad|zarurat/i.test(message)) {
      tone = 'requesting';
    } else if (/hi|hello|hey|good morning|good evening|namaste|namaskar/i.test(message)) {
      tone = 'friendly';
    } else if (/angry|upset|disappointed|bad|worst|terrible|bakwas/i.test(message)) {
      tone = 'negative';
    }
    
    // Personality detection with cultural context
    let personality = 'casual';
    if (/bro|bhai|yaar|dude|buddy|mate|boss/i.test(message)) {
      personality = 'informal';
    } else if (/sir|madam|please|kindly|would you|could you|sahab|ji/i.test(message)) {
      personality = 'formal';
    } else if (/haha|lol|😂|😄|😊|😜|funny|joke|mazak/i.test(message)) {
      personality = 'humorous';
    } else if (/urgent|asap|quickly|jaldi|turant/i.test(message)) {
      personality = 'urgent';
    }
    
    // Communication style detection
    let style = 'standard';
    if (message.length < 10) {
      style = 'brief';
    } else if (message.length > 50) {
      style = 'detailed';
    }
    
    // Formality level
    let formality = 'neutral';
    if (/sir|madam|please|kindly|would you|could you|sahab|ji|aap/i.test(message)) {
      formality = 'formal';
    } else if (/bro|bhai|yaar|dude|buddy|tu|tum/i.test(message)) {
      formality = 'informal';
    }
    
    return { language, tone, personality, style, formality };
  }

  /**
   * Generate contextually appropriate responses - DEPRECATED - AI now handles this naturally
   */
  private generateContextualResponseFromAnalysis(messageAnalysis: any, originalMessage: string): string {
    // This method is deprecated - the AI now handles contextual understanding naturally
    return 'Nice';
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
    
    if (messageWords.includes('where') || messageWords.includes('kaha') || messageWords.includes('kahan') || messageWords.includes('location') || 
        (messageWords.includes('hai') && (messageWords.includes('tu') || messageWords.includes('tum') || messageWords.includes('aap')))) {
      const responses = language === 'hindi' || language === 'hinglish'
        ? ['Yahan hun! DM me location details 📍', 'Here only, message me for address', 'Available hun, DM karo', 'Yahan present hun']
        : ['Right here! DM for location 📍', 'Available, message me', 'Here, text me address', 'Present, DM me'];
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

  private analyzeMessageIntent(message: string): { intent: string; language: string; urgency: string } {
    const lowerMessage = message.toLowerCase();
    
    // Detect language
    const hindiPatterns = /[\u0900-\u097F]|(?:hai|haan|nahi|kya|acha|theek|bhai|yaar|dost|kar|raha|rahe|rahi|kaise|kahan|kab|kyu|kyun|kitna|chahiye|price|cost)/i;
    const hinglishPatterns = /(?:kya|hai|haan|nahi|acha|theek|bhai|yaar|dost|kar|raha|rahe|rahi|kaise|kahan|kab|kyu|kyun|kitna|chahiye)/i;
    
    let language = 'english';
    if (hindiPatterns.test(message)) {
      language = /[\u0900-\u097F]/.test(message) ? 'hindi' : 'hinglish';
    } else if (hinglishPatterns.test(message)) {
      language = 'hinglish';
    }
    
    // Detect intent
    let intent = 'general';
    if (lowerMessage.includes('price') || lowerMessage.includes('cost') || lowerMessage.includes('kitna') || lowerMessage.includes('rate')) {
      intent = 'pricing_inquiry';
    } else if (lowerMessage.includes('available') || lowerMessage.includes('stock') || lowerMessage.includes('mil') || lowerMessage.includes('hai kya')) {
      intent = 'availability_check';
    } else if (lowerMessage.includes('where') || lowerMessage.includes('location') || lowerMessage.includes('address') || lowerMessage.includes('kaha')) {
      intent = 'location_inquiry';
    } else if (lowerMessage.includes('how') || lowerMessage.includes('kaise') || lowerMessage.includes('order') || lowerMessage.includes('buy')) {
      intent = 'process_inquiry';
    } else if (lowerMessage.includes('info') || lowerMessage.includes('details') || lowerMessage.includes('tell me') || lowerMessage.includes('batao')) {
      intent = 'information_request';
    } else if (lowerMessage.includes('thank') || lowerMessage.includes('awesome') || lowerMessage.includes('nice') || lowerMessage.includes('good') || lowerMessage.includes('amazing')) {
      intent = 'appreciation';
    } else if (lowerMessage.includes('hello') || lowerMessage.includes('hi') || lowerMessage.includes('hey') || lowerMessage.includes('namaste')) {
      intent = 'greeting';
    } else if (lowerMessage.includes('help') || lowerMessage.includes('support') || lowerMessage.includes('madad')) {
      intent = 'help_request';
    }
    
    // Detect urgency
    let urgency = 'normal';
    if (lowerMessage.includes('urgent') || lowerMessage.includes('asap') || lowerMessage.includes('quickly') || lowerMessage.includes('jaldi') || lowerMessage.includes('turant')) {
      urgency = 'high';
    } else if (lowerMessage.includes('when possible') || lowerMessage.includes('no rush') || lowerMessage.includes('jab time mile')) {
      urgency = 'low';
    }
    
    return { intent, language, urgency };
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

    // Analyze message intent for contextual responses
    const messageAnalysis = this.analyzeMessageIntent(context.message);
    
    return `You are an intelligent social media assistant responding to Instagram DMs. Your goal is to understand the message contextually and respond naturally like a real person.

UNDERSTAND THE MESSAGE MEANING:
- Read and comprehend what the person is actually saying
- Don't rely on keyword matching - understand the context
- For Hindi/Hinglish phrases like "mai bhi thik hu" (I am also fine), understand this means they're saying they're doing well
- For "kya haal" understand this is asking "what's up" 
- For wellbeing statements, respond appropriately (e.g., "achha hai", "nice yaar", "good to hear")

CUSTOMER MESSAGE: "${context.message}"
FROM: @${context.userProfile?.username || 'user'}
${config.businessContext ? `BUSINESS: ${config.businessContext}` : ''}

RESPONSE REQUIREMENTS:
- Keep under 50 characters
- Sound completely natural and conversational  
- Match their language (English/Hindi/Hinglish) exactly
- Understand context, don't use templates
- Respond as a real person would

EXAMPLES OF NATURAL UNDERSTANDING:
- "mai bhi thik hu" → "achha hai" or "nice yaar" 
- "kya haal" → "bas timepass" or "nothing much yaar"
- "hello" → "hey" or "hi there"
- "thanks" → "welcome" or "no problem"

Generate ONE natural response that shows you understood their message:`;
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