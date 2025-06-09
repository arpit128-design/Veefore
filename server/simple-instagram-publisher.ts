/**
 * Simple Instagram Publisher - Direct approach without complex fallbacks
 * Focuses on what actually works with current Instagram permissions
 */

import { instagramAPI } from './instagram-api';

export class SimpleInstagramPublisher {
  
  /**
   * Publish content with simple, reliable approach
   */
  static async publishContent(
    accessToken: string,
    mediaUrl: string,
    caption: string,
    contentType: 'video' | 'photo' | 'reel' | 'story'
  ): Promise<{ success: boolean; id?: string; error?: string }> {
    
    console.log(`[SIMPLE PUBLISHER] Publishing ${contentType} content`);
    console.log(`[SIMPLE PUBLISHER] Media URL: ${mediaUrl}`);
    
    // Clean and optimize URL for Instagram
    const cleanUrl = this.cleanURLForInstagram(mediaUrl);
    console.log(`[SIMPLE PUBLISHER] Cleaned URL: ${cleanUrl}`);
    
    // For videos/reels, try to publish as photo first (most reliable)
    if (contentType === 'video' || contentType === 'reel') {
      console.log(`[SIMPLE PUBLISHER] Converting ${contentType} to photo for compatibility`);
      
      // Try to find a thumbnail or convert to image
      const imageUrl = this.convertVideoToImageURL(cleanUrl);
      const imageCaption = `🎬 ${caption}\n\n📹 Video content - Check our stories for full video`;
      
      try {
        const result = await instagramAPI.publishPhoto(accessToken, imageUrl, imageCaption);
        console.log(`[SIMPLE PUBLISHER] ✓ Published ${contentType} as photo: ${result.id}`);
        return { success: true, id: result.id };
        
      } catch (error: any) {
        console.log(`[SIMPLE PUBLISHER] Photo conversion failed: ${error.message}`);
        return { success: false, error: `Video publishing not available: ${error.message}` };
      }
    }
    
    // For photos, publish directly
    if (contentType === 'photo') {
      try {
        const result = await instagramAPI.publishPhoto(accessToken, cleanUrl, caption);
        console.log(`[SIMPLE PUBLISHER] ✓ Published photo: ${result.id}`);
        return { success: true, id: result.id };
        
      } catch (error: any) {
        console.log(`[SIMPLE PUBLISHER] Photo publishing failed: ${error.message}`);
        return { success: false, error: error.message };
      }
    }
    
    return { success: false, error: 'Unsupported content type' };
  }
  
  /**
   * Clean URL for Instagram compatibility
   */
  static cleanURLForInstagram(inputUrl: string): string {
    console.log(`[URL CLEANER] Processing: ${inputUrl}`);
    
    // Get the current domain from environment or default
    const currentDomain = process.env.REPLIT_DEV_DOMAIN || 'localhost:5000';
    const baseUrl = currentDomain.includes('localhost') ? `http://${currentDomain}` : `https://${currentDomain}`;
    
    // Handle blob URLs
    if (inputUrl.startsWith('blob:')) {
      const parts = inputUrl.split('/');
      const mediaId = parts[parts.length - 1];
      const cleanUrl = `${baseUrl}/uploads/${mediaId}`;
      console.log(`[URL CLEANER] Blob converted: ${cleanUrl}`);
      return cleanUrl;
    }
    
    // Handle malformed URLs with nested domains
    if (inputUrl.includes('replit.dev') && inputUrl.includes('/uploads/')) {
      const uploadsPart = inputUrl.substring(inputUrl.indexOf('/uploads/'));
      const cleanUrl = `${baseUrl}${uploadsPart}`;
      console.log(`[URL CLEANER] Nested domain fixed: ${cleanUrl}`);
      return cleanUrl;
    }
    
    // Handle already proper URLs with current domain
    if (inputUrl.startsWith(baseUrl)) {
      console.log(`[URL CLEANER] URL already clean: ${inputUrl}`);
      return inputUrl;
    }
    
    // Extract filename and create clean URL
    const filename = inputUrl.split('/').pop() || 'media';
    const cleanUrl = `${baseUrl}/uploads/${filename}`;
    console.log(`[URL CLEANER] Generic clean: ${cleanUrl}`);
    return cleanUrl;
  }
  
  /**
   * Convert video URL to image URL for photo publishing
   */
  static convertVideoToImageURL(videoUrl: string): string {
    // Convert video extension to image
    let imageUrl = videoUrl.replace(/\.(mp4|mov|avi|webm)$/i, '.jpg');
    
    // If no video extension found, add image extension
    if (imageUrl === videoUrl && !imageUrl.match(/\.(jpg|jpeg|png)$/i)) {
      imageUrl = `${videoUrl}.jpg`;
    }
    
    console.log(`[URL CONVERTER] Video to image: ${videoUrl} → ${imageUrl}`);
    return imageUrl;
  }
  
  /**
   * Check if content can be published with current permissions
   */
  static canPublishContent(contentType: 'video' | 'photo' | 'reel' | 'story'): boolean {
    // Currently only photo publishing is reliable
    return contentType === 'photo';
  }
  
  /**
   * Get recommended publishing approach
   */
  static getPublishingStrategy(contentType: 'video' | 'photo' | 'reel' | 'story'): {
    canPublish: boolean;
    approach: string;
    message: string;
  } {
    
    if (contentType === 'photo') {
      return {
        canPublish: true,
        approach: 'direct',
        message: 'Photo will be published directly'
      };
    }
    
    if (contentType === 'video' || contentType === 'reel') {
      return {
        canPublish: true,
        approach: 'photo_conversion',
        message: 'Video will be published as preview image with caption'
      };
    }
    
    return {
      canPublish: false,
      approach: 'unsupported',
      message: 'Content type not supported with current permissions'
    };
  }
}