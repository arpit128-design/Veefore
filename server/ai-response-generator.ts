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
      const model = this.genAI.getGenerativeModel({ model: "gemini-pro" });

      const prompt = this.buildPrompt(context, config);
      const result = await model.generateContent(prompt);
      const response = result.response;
      const text = response.text();

      // Parse the structured response
      const parsedResponse = this.parseAIResponse(text);
      
      return {
        response: parsedResponse.response,
        detectedLanguage: parsedResponse.language,
        confidence: parsedResponse.confidence,
        reasoning: parsedResponse.reasoning
      };
    } catch (error) {
      console.error('[AI RESPONSE] Error generating response:', error);
      
      // Generate intelligent fallback based on message content and context
      const fallbackResponse = this.generateIntelligentFallback(context, config);
      return {
        response: fallbackResponse.response,
        detectedLanguage: fallbackResponse.language,
        confidence: 0.7,
        reasoning: "Generated using intelligent fallback due to AI service unavailability"
      };
    }
  }

  private generateIntelligentFallback(context: MessageContext, config: AIResponseConfig): { response: string; language: string } {
    const message = context.message.toLowerCase();
    const username = context.username || 'friend';
    
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

    return `You are an advanced AI assistant for social media automation. Your task is to analyze incoming messages and generate contextually appropriate responses.

CRITICAL INSTRUCTIONS:
1. ALWAYS respond in the SAME LANGUAGE as the incoming message
2. If message is in Hindi/Hinglish, respond in Hindi/Hinglish
3. If message is in English, respond in English
4. Understand and use internet slang, emojis, and modern expressions appropriately
5. Match the tone and energy level of the incoming message
6. Be ${personalityMap[config.personality] || 'friendly and helpful'}
7. Keep response ${lengthMap[config.responseLength] || 'concise (2-3 sentences)'}

INCOMING MESSAGE TO ANALYZE:
"${context.message}"

${context.userProfile?.username ? `USER: @${context.userProfile.username}` : ''}
${context.postContext?.caption ? `POST CONTEXT: ${context.postContext.caption}` : ''}
${context.postContext?.hashtags ? `HASHTAGS: ${context.postContext.hashtags.join(' ')}` : ''}

ANALYSIS REQUIRED:
1. Detect the language (Hindi/Hinglish/English/Mixed)
2. Understand the tone (positive/negative/neutral/questioning/complaining)
3. Identify the intent (appreciation/question/complaint/general comment)
4. Note any slang, emojis, or cultural references
5. Determine appropriate response style

Please respond in this JSON format:
{
  "language": "detected language code (hi/en/hi-en for hinglish)",
  "tone": "detected tone",
  "intent": "detected intent", 
  "confidence": 0.95,
  "response": "Your contextual response in the same language and appropriate tone",
  "reasoning": "Brief explanation of your response strategy"
}

EXAMPLES:
- For "Bhai ye product kaisa hai?" → Respond in Hinglish with product info
- For "Amazing post! Love it ❤️" → Respond in English with gratitude
- For "Yaar shipping kab hogi?" → Respond in Hinglish about shipping
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
      const model = this.genAI.getGenerativeModel({ model: "gemini-pro" });
      
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