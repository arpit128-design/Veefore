/**
 * Adaptive Instagram Publisher - Handles Instagram's Changing API Requirements
 * 
 * This service addresses the inconsistency where the same video URL works sometimes
 * but fails other times, adapting to Instagram's evolving requirements.
 */

import { instagramAPI } from './instagram-api';
import * as fs from 'fs';
import * as path from 'path';

interface PublishResult {
  success: boolean;
  id?: string;
  error?: string;
  method?: string;
}

export class AdaptiveInstagramPublisher {
  
  /**
   * Intelligently publishes content with multiple fallback strategies
   */
  static async publishWithAdaptiveStrategy(
    accessToken: string,
    mediaUrl: string,
    caption: string,
    contentType: 'video' | 'photo' | 'reel' | 'story'
  ): Promise<PublishResult> {
    
    console.log(`[ADAPTIVE PUBLISHER] Starting adaptive publishing for ${contentType}`);
    console.log(`[ADAPTIVE PUBLISHER] Media URL: ${mediaUrl}`);
    
    // Strategy 1: Try direct publishing first (what worked before)
    try {
      console.log(`[ADAPTIVE PUBLISHER] Strategy 1: Direct ${contentType} publishing`);
      
      let result;
      switch (contentType) {
        case 'video':
          result = await instagramAPI.publishVideo(accessToken, mediaUrl, caption);
          break;
        case 'reel':
          result = await instagramAPI.publishReel(accessToken, mediaUrl, caption);
          break;
        case 'photo':
          result = await instagramAPI.publishPhoto(accessToken, mediaUrl, caption);
          break;
        case 'story':
          result = await instagramAPI.publishStory(accessToken, mediaUrl, contentType === 'video');
          break;
      }
      
      console.log(`[ADAPTIVE PUBLISHER] Strategy 1 SUCCESS: ${result.id}`);
      return { success: true, id: result.id, method: 'direct' };
      
    } catch (directError: any) {
      console.log(`[ADAPTIVE PUBLISHER] Strategy 1 failed: ${directError.message}`);
      
      // Analyze the error to determine next strategy
      const errorMessage = directError.message.toLowerCase();
      
      // Strategy 2: Handle format/permission issues
      if (errorMessage.includes('format') || errorMessage.includes('supported')) {
        return await this.handleFormatIssues(accessToken, mediaUrl, caption, contentType);
      }
      
      // Strategy 3: Handle permission/access issues
      if (errorMessage.includes('permission') || errorMessage.includes('oauth')) {
        return await this.handlePermissionIssues(accessToken, mediaUrl, caption, contentType);
      }
      
      // Strategy 4: Handle URL accessibility issues
      if (errorMessage.includes('uri') || errorMessage.includes('download') || errorMessage.includes('fetch')) {
        return await this.handleUrlIssues(accessToken, mediaUrl, caption, contentType);
      }
      
      // Strategy 5: Last resort - intelligent retry with delay
      return await this.handleGenericRetry(accessToken, mediaUrl, caption, contentType, directError);
    }
  }
  
  /**
   * Strategy 2: Handle format-related issues
   */
  private static async handleFormatIssues(
    accessToken: string,
    mediaUrl: string,
    caption: string,
    contentType: string
  ): Promise<PublishResult> {
    
    console.log(`[ADAPTIVE PUBLISHER] Strategy 2: Handling format issues`);
    
    // If it's a video, try compression/format conversion
    if (contentType === 'video' || contentType === 'reel') {
      try {
        const { DirectInstagramPublisher } = await import('./direct-instagram-publisher');
        const result = await DirectInstagramPublisher.publishVideoWithIntelligentCompression(
          accessToken,
          mediaUrl,
          caption
        );
        
        console.log(`[ADAPTIVE PUBLISHER] Strategy 2 SUCCESS with compression: ${result.id}`);
        return { success: true, id: result.id, method: 'compression' };
        
      } catch (compressionError: any) {
        console.log(`[ADAPTIVE PUBLISHER] Strategy 2 failed: ${compressionError.message}`);
      }
    }
    
    return { success: false, error: 'Format issues could not be resolved' };
  }
  
  /**
   * Strategy 3: Handle permission/access issues
   */
  private static async handlePermissionIssues(
    accessToken: string,
    mediaUrl: string,
    caption: string,
    contentType: string
  ): Promise<PublishResult> {
    
    console.log(`[ADAPTIVE PUBLISHER] Strategy 3: Handling permission issues`);
    
    // For permission issues, try simplified publishing approach
    if (contentType === 'video' || contentType === 'reel') {
      // Fallback to photo publishing if video permissions are limited
      try {
        console.log(`[ADAPTIVE PUBLISHER] Attempting photo fallback for ${contentType}`);
        const result = await instagramAPI.publishPhoto(accessToken, mediaUrl, caption);
        console.log(`[ADAPTIVE PUBLISHER] Strategy 3 SUCCESS with photo fallback: ${result.id}`);
        return { success: true, id: result.id, method: 'photo_fallback' };
        
      } catch (fallbackError: any) {
        console.log(`[ADAPTIVE PUBLISHER] Strategy 3 failed: ${fallbackError.message}`);
      }
    }
    
    return { 
      success: false, 
      error: 'Permission issues detected. Your Instagram app may need additional permissions for video publishing.' 
    };
  }
  
  /**
   * Strategy 4: Handle URL accessibility issues
   */
  private static async handleUrlIssues(
    accessToken: string,
    mediaUrl: string,
    caption: string,
    contentType: string
  ): Promise<PublishResult> {
    
    console.log(`[ADAPTIVE PUBLISHER] Strategy 4: Handling URL accessibility issues`);
    
    // Wait for URL to become accessible
    const maxRetries = 3;
    const delays = [2000, 5000, 10000]; // 2s, 5s, 10s
    
    for (let i = 0; i < maxRetries; i++) {
      console.log(`[ADAPTIVE PUBLISHER] URL retry ${i + 1}/${maxRetries}, waiting ${delays[i]}ms`);
      await new Promise(resolve => setTimeout(resolve, delays[i]));
      
      try {
        let result;
        switch (contentType) {
          case 'video':
            result = await instagramAPI.publishVideo(accessToken, mediaUrl, caption);
            break;
          case 'reel':
            result = await instagramAPI.publishReel(accessToken, mediaUrl, caption);
            break;
          case 'photo':
            result = await instagramAPI.publishPhoto(accessToken, mediaUrl, caption);
            break;
          case 'story':
            result = await instagramAPI.publishStory(accessToken, mediaUrl, contentType === 'video');
            break;
        }
        
        console.log(`[ADAPTIVE PUBLISHER] Strategy 4 SUCCESS on retry ${i + 1}: ${result.id}`);
        return { success: true, id: result.id, method: `url_retry_${i + 1}` };
        
      } catch (retryError: any) {
        console.log(`[ADAPTIVE PUBLISHER] URL retry ${i + 1} failed: ${retryError.message}`);
      }
    }
    
    return { success: false, error: 'URL accessibility issues could not be resolved after retries' };
  }
  
  /**
   * Strategy 5: Generic retry with intelligent delay
   */
  private static async handleGenericRetry(
    accessToken: string,
    mediaUrl: string,
    caption: string,
    contentType: string,
    originalError: Error
  ): Promise<PublishResult> {
    
    console.log(`[ADAPTIVE PUBLISHER] Strategy 5: Generic intelligent retry`);
    
    // Wait longer for Instagram's internal processing
    console.log(`[ADAPTIVE PUBLISHER] Waiting 15 seconds for Instagram processing...`);
    await new Promise(resolve => setTimeout(resolve, 15000));
    
    try {
      let result;
      switch (contentType) {
        case 'video':
          result = await instagramAPI.publishVideo(accessToken, mediaUrl, caption);
          break;
        case 'reel':
          result = await instagramAPI.publishReel(accessToken, mediaUrl, caption);
          break;
        case 'photo':
          result = await instagramAPI.publishPhoto(accessToken, mediaUrl, caption);
          break;
        case 'story':
          result = await instagramAPI.publishStory(accessToken, mediaUrl, contentType === 'video');
          break;
      }
      
      console.log(`[ADAPTIVE PUBLISHER] Strategy 5 SUCCESS after delay: ${result.id}`);
      return { success: true, id: result.id, method: 'delayed_retry' };
      
    } catch (finalError: any) {
      console.log(`[ADAPTIVE PUBLISHER] All strategies exhausted. Final error: ${finalError.message}`);
      return { 
        success: false, 
        error: `Publishing failed after all strategies. Original: ${originalError.message}, Final: ${finalError.message}` 
      };
    }
  }
}