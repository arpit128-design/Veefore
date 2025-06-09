import { IStorage } from "./storage";
import { instagramAPI } from "./instagram-api";

export class SchedulerService {
  private storage: IStorage;
  private checkInterval: NodeJS.Timeout | null = null;

  constructor(storage: IStorage) {
    this.storage = storage;
  }

  start() {
    console.log('[SCHEDULER] Starting background scheduler service');
    // Check for scheduled content every minute
    this.checkInterval = setInterval(() => {
      this.processScheduledContent();
    }, 60000); // 60 seconds

    // Also run immediately
    this.processScheduledContent();
  }

  stop() {
    if (this.checkInterval) {
      clearInterval(this.checkInterval);
      this.checkInterval = null;
    }
    console.log('[SCHEDULER] Stopped background scheduler service');
  }

  private async processScheduledContent() {
    try {
      const currentTime = new Date();
      console.log(`[SCHEDULER] Checking for scheduled content to publish at ${currentTime.toISOString()}`);
      
      // Get all scheduled content that should be published now
      const allScheduledContent = await this.getAllScheduledContent();
      console.log(`[SCHEDULER] Found ${allScheduledContent.length} total scheduled items`);
      
      // Debug each item
      allScheduledContent.forEach((content: any, index: number) => {
        console.log(`[SCHEDULER] Item ${index + 1}:`, {
          id: content.id,
          title: content.title,
          status: content.status,
          scheduledAt: content.scheduledAt,
          scheduledTime: content.scheduledAt ? new Date(content.scheduledAt).toISOString() : 'null',
          shouldPublish: content.scheduledAt && content.status === 'scheduled' && new Date(content.scheduledAt) <= currentTime
        });
      });
      
      const contentToPublish = allScheduledContent.filter((content: any) => {
        if (!content.scheduledAt || content.status !== 'scheduled') {
          return false;
        }
        
        const scheduledTime = new Date(content.scheduledAt);
        // Publish if scheduled time is in the past or within the next minute
        return scheduledTime <= currentTime;
      });

      console.log(`[SCHEDULER] Found ${contentToPublish.length} items ready to publish`);

      for (const content of contentToPublish) {
        await this.publishScheduledContent(content);
      }
    } catch (error) {
      console.error('[SCHEDULER] Error processing scheduled content:', error);
    }
  }

  private async getAllScheduledContent(): Promise<any[]> {
    try {
      // Get scheduled content from the storage layer directly (no workspace filter)
      const allScheduled = await this.storage.getScheduledContent();
      console.log(`[SCHEDULER DEBUG] Raw scheduled content from storage:`, allScheduled.map(c => ({
        id: c.id,
        title: c.title,
        workspaceId: c.workspaceId,
        workspaceIdType: typeof c.workspaceId,
        status: c.status,
        scheduledAt: c.scheduledAt
      })));
      return allScheduled;
    } catch (error) {
      console.error('[SCHEDULER] Error getting all scheduled content:', error);
      return [];
    }
  }

  private async publishScheduledContent(content: any) {
    try {
      console.log(`[SCHEDULER] Publishing scheduled content: ${content.title} (ID: ${content.id})`);
      
      if (content.platform !== 'instagram') {
        console.log(`[SCHEDULER] Platform ${content.platform} not supported yet`);
        return;
      }

      // Get Instagram account for this workspace
      console.log(`[SCHEDULER] Looking for Instagram account for workspace: ${content.workspaceId} (type: ${typeof content.workspaceId})`);
      // Keep workspace ID as string for MongoDB ObjectId compatibility
      const workspaceId = content.workspaceId.toString();
      const instagramAccount = await this.storage.getSocialAccountByPlatform(workspaceId, 'instagram');
      
      if (!instagramAccount || !instagramAccount.accessToken) {
        console.error(`[SCHEDULER] No Instagram account found for workspace ${content.workspaceId}`);
        await this.updateContentStatus(content.id, 'failed', 'No Instagram account connected');
        return;
      }

      if (!content.contentData?.mediaUrl) {
        console.error(`[SCHEDULER] No media URL found for content ${content.id}`);
        await this.updateContentStatus(content.id, 'failed', 'No media URL');
        return;
      }

      // Publish to Instagram using adaptive strategy to handle changing requirements
      let publishResult;
      const caption = `${content.title}\n\n${content.description || ''}`;
      const mediaUrl = content.contentData.mediaUrl;
      
      console.log(`[SCHEDULER] Publishing ${content.type || 'post'} content to Instagram using adaptive strategy`);
      
      // Use the adaptive publisher that handles Instagram's changing requirements
      const { AdaptiveInstagramPublisher } = await import('./adaptive-instagram-publisher');
      
      // Determine content type for adaptive publisher
      let contentType: 'video' | 'photo' | 'reel' | 'story' = 'photo';
      
      if (content.type === 'story') {
        contentType = 'story';
      } else if (content.type === 'reel') {
        contentType = 'reel';
      } else if (content.type === 'video') {
        contentType = 'video';
      } else {
        // Auto-detect for posts
        const isVideo = mediaUrl?.match(/\.(mp4|mov|avi|mkv|webm|3gp|m4v)$/i) || 
                       mediaUrl?.includes('video');
        contentType = isVideo ? 'video' : 'photo';
      }
      
      console.log(`[SCHEDULER] Detected content type: ${contentType} for URL: ${mediaUrl}`);
      
      // Convert URL for Instagram compatibility first
      const { InstagramURLConverter } = await import('./instagram-url-converter');
      const urlPreparation = await InstagramURLConverter.prepareForInstagramPublishing(
        mediaUrl,
        contentType as 'video' | 'photo' | 'reel'
      );
      
      console.log(`[SCHEDULER] URL conversion: ${urlPreparation.isOptimized ? 'optimized' : 'unchanged'}`);
      console.log(`[SCHEDULER] Optimized URL: ${urlPreparation.url}`);
      
      // Use adaptive publisher with optimized URL
      const adaptiveResult = await AdaptiveInstagramPublisher.publishWithAdaptiveStrategy(
        instagramAccount.accessToken,
        urlPreparation.url,
        caption,
        contentType
      );
      
      if (adaptiveResult.success) {
        console.log(`[SCHEDULER] ✓ Adaptive publishing succeeded using method: ${adaptiveResult.method}`);
        publishResult = { id: adaptiveResult.id };
      } else {
        console.error(`[SCHEDULER] ✗ Adaptive publishing failed: ${adaptiveResult.error}`);
        throw new Error(adaptiveResult.error || 'Adaptive publishing failed');
      }

      console.log(`[SCHEDULER] Successfully published ${content.type || 'post'} content ${content.id} to Instagram:`, publishResult.id);

      // Update content status
      await this.updateContentStatus(content.id, 'published', null, publishResult.id);

    } catch (error: any) {
      console.error(`[SCHEDULER] Failed to publish content ${content.id}:`, error);
      await this.updateContentStatus(content.id, 'failed', error.message);
    }
  }

  private async updateContentStatus(contentId: number, status: string, error?: string, instagramPostId?: string) {
    try {
      const updates: any = {
        status,
        publishedAt: status === 'published' ? new Date() : undefined
      };

      if (error) {
        updates.error = error;
      }

      if (instagramPostId) {
        updates.instagramPostId = instagramPostId;
      }

      await this.storage.updateContent(contentId, updates);
      console.log(`[SCHEDULER] Updated content ${contentId} status to ${status}`);
    } catch (error) {
      console.error(`[SCHEDULER] Error updating content ${contentId} status:`, error);
    }
  }
}

let schedulerService: SchedulerService | null = null;

export function startSchedulerService(storage: IStorage) {
  if (schedulerService) {
    schedulerService.stop();
  }
  
  schedulerService = new SchedulerService(storage);
  schedulerService.start();
  return schedulerService;
}

export function stopSchedulerService() {
  if (schedulerService) {
    schedulerService.stop();
    schedulerService = null;
  }
}