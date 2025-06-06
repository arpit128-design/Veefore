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
      console.log('[SCHEDULER] Checking for scheduled content to publish');
      
      // Get all scheduled content that should be published now
      const currentTime = new Date();
      const allScheduledContent = await this.getAllScheduledContent();
      
      const contentToPublish = allScheduledContent.filter((content: any) => {
        if (!content.scheduledAt || content.status !== 'scheduled') {
          return false;
        }
        
        const scheduledTime = new Date(content.scheduledAt);
        // Publish if scheduled time is in the past or within the next minute
        return scheduledTime <= currentTime;
      });

      console.log(`[SCHEDULER] Found ${contentToPublish.length} items to publish`);

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
      return await this.storage.getScheduledContent();
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
      const instagramAccount = await this.storage.getSocialAccountByPlatform(content.workspaceId, 'instagram');
      
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

      // Publish to Instagram
      const publishResult = await instagramAPI.publishPhoto(
        instagramAccount.accessToken,
        content.contentData.mediaUrl,
        `${content.title}\n\n${content.description || ''}`
      );

      console.log(`[SCHEDULER] Successfully published content ${content.id} to Instagram:`, publishResult.id);

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