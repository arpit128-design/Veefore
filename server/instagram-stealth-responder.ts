import { AIResponseGenerator, MessageContext, AIResponseConfig } from './ai-response-generator';

interface StealthConfig {
  maxDailyResponses: number;
  responseRate: number; // 0-1, percentage of comments to respond to
  minDelayMs: number;
  maxDelayMs: number;
  useTypingSimulation: boolean;
  varyResponsePatterns: boolean;
}

interface ResponsePattern {
  useEmoji: boolean;
  usePunctuation: boolean;
  useAbbreviations: boolean;
  useLowercase: boolean;
  addTypos: boolean;
}

/**
 * Ultra-stealth Instagram response system designed to completely bypass spam detection
 * Uses advanced human behavior simulation and response randomization
 */
export class InstagramStealthResponder {
  private aiGenerator: AIResponseGenerator;
  private responseHistory: Map<string, number> = new Map();
  private lastResponseTime: number = 0;
  private dailyResponseCount: number = 0;
  private sessionStartTime: number = Date.now();
  private userInteractionPatterns: Map<string, any> = new Map();

  private config: StealthConfig = {
    maxDailyResponses: 15, // Ultra-conservative daily limit
    responseRate: 0.25, // Only respond to 25% of comments
    minDelayMs: 120000, // Minimum 2 minutes  
    maxDelayMs: 600000, // Maximum 10 minutes
    useTypingSimulation: true,
    varyResponsePatterns: true
  };

  // Ultra-natural response templates with maximum variation
  private stealthResponses = {
    appreciation: ['🔥', '❤️', '👍', '💯', '✨', '👌', 'nice!', 'love this', 'amazing', 'awesome work', 'so good', 'perfect'],
    agreement: ['exactly!', 'so true', 'absolutely', 'couldn\'t agree more', 'you\'re right', 'facts', 'this!', 'yes!'],
    questions: ['how did you do this?', 'where is this?', 'really?', 'can you share more?', 'tell me more', 'details please'],
    casual: ['haha love it', 'lol this is great', 'wow amazing', 'omg yes', 'this made my day', 'so cool', 'brilliant'],
    price_inquiry: ['dm me details', 'inbox please', 'can you message me?', 'send me info', 'price details?'],
    simple: ['thanks for sharing', 'appreciate this', 'well done', 'great job', 'keep it up', 'loving your content']
  };

  constructor() {
    this.aiGenerator = new AIResponseGenerator();
  }

  /**
   * Main method to generate stealth response with maximum human-like behavior
   */
  async generateStealthResponse(
    comment: string,
    username: string,
    postContext?: any
  ): Promise<{ response: string; delay: number; shouldRespond: boolean }> {
    
    // Early exit checks
    if (!this.shouldAttemptResponse(comment, username)) {
      return { response: '', delay: 0, shouldRespond: false };
    }

    // Generate response using multiple strategies
    const response = await this.createHumanLikeResponse(comment, username, postContext);
    
    // Calculate stealth delay
    const delay = this.calculateStealthDelay(comment, username);
    
    // Update tracking
    this.updateResponseTracking(username);
    
    return {
      response,
      delay,
      shouldRespond: true
    };
  }

  /**
   * Determine if we should respond based on ultra-conservative rules
   */
  private shouldAttemptResponse(comment: string, username: string): boolean {
    // Reset daily count if new day
    this.resetDailyCountIfNeeded();
    
    // Check daily limits
    if (this.dailyResponseCount >= this.config.maxDailyResponses) {
      console.log('[STEALTH] Daily response limit reached');
      return false;
    }

    // Random skip based on response rate
    if (Math.random() > this.config.responseRate) {
      console.log('[STEALTH] Randomly skipping response to appear natural');
      return false;
    }

    // Skip if too soon after last response
    const timeSinceLastResponse = Date.now() - this.lastResponseTime;
    if (timeSinceLastResponse < 15000) { // Less than 15 seconds
      console.log('[STEALTH] Too soon since last response');
      return false;
    }

    // Skip very short comments sometimes
    if (comment.length < 10 && Math.random() < 0.6) {
      console.log('[STEALTH] Skipping short comment');
      return false;
    }

    // Check user interaction history
    const userHistory = this.userInteractionPatterns.get(username);
    if (userHistory && userHistory.responseCount > 2) {
      console.log('[STEALTH] Too many responses to same user');
      return false;
    }

    return true;
  }

  /**
   * Create ultra-human-like response using multiple strategies
   */
  private async createHumanLikeResponse(
    comment: string,
    username: string,
    postContext?: any
  ): Promise<string> {
    
    const commentLower = comment.toLowerCase();
    
    // Strategy 1: Use ultra-simple responses for common patterns
    if (this.isSimpleAppreciation(commentLower)) {
      return this.getRandomResponse(this.stealthResponses.appreciation);
    }
    
    if (this.isPriceInquiry(commentLower)) {
      return this.getRandomResponse(this.stealthResponses.price_inquiry);
    }
    
    if (this.isQuestion(commentLower)) {
      return this.getRandomResponse(this.stealthResponses.questions);
    }

    // Strategy 2: Generate AI response with extreme brevity
    try {
      const context: MessageContext = {
        message: comment,
        userProfile: { username },
        postContext
      };

      const config: AIResponseConfig = {
        personality: 'casual',
        responseLength: 'very_short'
      };

      const aiResponse = await this.aiGenerator.generateContextualResponse(context, config);
      
      // Make AI response ultra-brief and natural
      let response = this.makeResponseStealth(aiResponse.response);
      
      // Apply human patterns
      response = this.applyStealthPatterns(response);
      
      return response;
      
    } catch (error) {
      console.log('[STEALTH] AI generation failed, using fallback');
      return this.getRandomResponse(this.stealthResponses.simple);
    }
  }

  /**
   * Calculate stealth delay with advanced timing patterns
   */
  private calculateStealthDelay(comment: string, username: string): number {
    const baseDelay = Math.random() * (this.config.maxDelayMs - this.config.minDelayMs) + this.config.minDelayMs;
    
    // Add extra delay for complex comments
    const complexityMultiplier = Math.min(comment.length / 50, 2);
    
    // Add randomness to break patterns
    const randomFactor = 0.7 + (Math.random() * 0.6); // 0.7 to 1.3
    
    // Occasionally add much longer delays (like human distraction)
    const longDelayChance = Math.random();
    let finalDelay = baseDelay * complexityMultiplier * randomFactor;
    
    if (longDelayChance < 0.1) { // 10% chance
      finalDelay *= 3; // Much longer delay
    }
    
    // Cap at reasonable maximum
    return Math.min(finalDelay, 600000); // Max 10 minutes
  }

  /**
   * Make response extremely brief and natural
   */
  private makeResponseStealth(response: string): string {
    // Trim to maximum 15 characters for ultimate stealth
    if (response.length > 15) {
      const words = response.split(' ');
      if (words.length > 2) {
        response = words.slice(0, 2).join(' ');
      } else {
        response = response.substring(0, 15);
      }
    }
    
    return response.trim();
  }

  /**
   * Apply stealth patterns to make response appear human
   */
  private applyStealthPatterns(response: string): string {
    let stealthResponse = response;
    
    const patterns: ResponsePattern = {
      useEmoji: Math.random() < 0.3,
      usePunctuation: Math.random() < 0.2,
      useAbbreviations: Math.random() < 0.4,
      useLowercase: Math.random() < 0.7,
      addTypos: Math.random() < 0.1
    };

    // Apply lowercase
    if (patterns.useLowercase) {
      stealthResponse = stealthResponse.toLowerCase();
    }

    // Remove punctuation sometimes
    if (!patterns.usePunctuation) {
      stealthResponse = stealthResponse.replace(/[.,!?]/g, '');
    }

    // Apply abbreviations
    if (patterns.useAbbreviations) {
      stealthResponse = stealthResponse
        .replace(/you/g, 'u')
        .replace(/your/g, 'ur')
        .replace(/thanks/g, 'ty')
        .replace(/okay/g, 'ok');
    }

    // Add very subtle typos
    if (patterns.addTypos && stealthResponse.length > 4) {
      const typoChance = Math.random();
      if (typoChance < 0.3) {
        stealthResponse = stealthResponse.replace('the', 'teh');
      } else if (typoChance < 0.6) {
        stealthResponse = stealthResponse.replace('and', 'nd');
      }
    }

    return stealthResponse.trim();
  }

  /**
   * Pattern detection methods
   */
  private isSimpleAppreciation(comment: string): boolean {
    return /^(nice|good|great|cool|awesome|love|beautiful|amazing|wow)/.test(comment);
  }

  private isPriceInquiry(comment: string): boolean {
    return comment.includes('price') || comment.includes('cost') || comment.includes('kitna') || comment.includes('how much');
  }

  private isQuestion(comment: string): boolean {
    return comment.includes('?') || comment.startsWith('how') || comment.startsWith('what') || comment.startsWith('where');
  }

  /**
   * Utility methods
   */
  private getRandomResponse(responses: string[]): string {
    return responses[Math.floor(Math.random() * responses.length)];
  }

  private updateResponseTracking(username: string): void {
    this.dailyResponseCount++;
    this.lastResponseTime = Date.now();
    
    // Update user interaction history
    const userHistory = this.userInteractionPatterns.get(username) || { responseCount: 0, lastResponse: 0 };
    userHistory.responseCount++;
    userHistory.lastResponse = Date.now();
    this.userInteractionPatterns.set(username, userHistory);
  }

  private resetDailyCountIfNeeded(): void {
    const now = new Date();
    const sessionDate = new Date(this.sessionStartTime);
    
    if (now.getDate() !== sessionDate.getDate()) {
      this.dailyResponseCount = 0;
      this.sessionStartTime = Date.now();
      this.userInteractionPatterns.clear(); // Reset user history daily
    }
  }

  /**
   * Get current stats for monitoring
   */
  getStealthStats(): any {
    return {
      dailyResponses: this.dailyResponseCount,
      maxDaily: this.config.maxDailyResponses,
      responseRate: this.config.responseRate,
      timeSinceLastResponse: Date.now() - this.lastResponseTime,
      activeUserInteractions: this.userInteractionPatterns.size
    };
  }
}