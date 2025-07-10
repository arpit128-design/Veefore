/**
 * Shared OpenAI Client Configuration
 * Provides a centralized way to access OpenAI client with proper error handling
 */

import OpenAI from 'openai';

let openaiClient: OpenAI | null = null;

/**
 * Get OpenAI client instance - creates one if not exists
 */
export const getOpenAIClient = (): OpenAI => {
  if (!openaiClient) {
    if (!process.env.OPENAI_API_KEY) {
      throw new Error('OpenAI API key is not configured. Please set OPENAI_API_KEY environment variable.');
    }
    openaiClient = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
  }
  return openaiClient;
};

/**
 * Check if OpenAI is available
 */
export const isOpenAIAvailable = (): boolean => {
  return !!process.env.OPENAI_API_KEY;
};

/**
 * Reset OpenAI client (useful for testing or config changes)
 */
export const resetOpenAIClient = (): void => {
  openaiClient = null;
};