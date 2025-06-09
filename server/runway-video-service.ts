/**
 * RunwayML API Video Generation Service
 * Provides authentic AI video generation using RunwayML's Gen-3 Alpha model
 */

interface RunwayVideoRequest {
  prompt: string;
  duration: number;
  dimensions: {
    width: number;
    height: number;
    ratio: string;
  };
  style?: string;
  platform: string;
}

interface RunwayVideoResponse {
  taskId: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  videoUrl?: string;
  thumbnailUrl?: string;
  duration: number;
  prompt: string;
  dimensions: {
    width: number;
    height: number;
    ratio: string;
  };
}

class RunwayVideoService {
  private apiKey: string;
  private baseUrl = 'https://api.runwayml.com/v1';

  constructor() {
    if (!process.env.RUNWAY_API_KEY) {
      throw new Error('RUNWAY_API_KEY environment variable is required');
    }
    this.apiKey = process.env.RUNWAY_API_KEY;
  }

  /**
   * Generate video using RunwayML Gen-3 Alpha model
   */
  async generateVideo(request: RunwayVideoRequest): Promise<RunwayVideoResponse> {
    try {
      console.log('[RUNWAY] Starting video generation:', {
        prompt: request.prompt.substring(0, 100),
        duration: request.duration,
        platform: request.platform
      });

      // Optimize prompt for video generation
      const optimizedPrompt = this.optimizePromptForPlatform(request.prompt, request.platform, request.style);

      // Create video generation task
      const response = await fetch(`${this.baseUrl}/image_to_video`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'gen3a_turbo',
          prompt_text: optimizedPrompt,
          duration: request.duration,
          ratio: request.dimensions.ratio,
          watermark: false
        })
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(`RunwayML API error: ${response.status} - ${errorData.message || 'Unknown error'}`);
      }

      const data = await response.json();
      
      console.log('[RUNWAY] Video generation task created:', data.id);

      return {
        taskId: data.id,
        status: 'pending',
        duration: request.duration,
        prompt: request.prompt,
        dimensions: request.dimensions
      };

    } catch (error: any) {
      console.error('[RUNWAY] Video generation failed:', error);
      throw new Error(`Failed to generate video: ${error.message}`);
    }
  }

  /**
   * Check the status of a video generation task
   */
  async getTaskStatus(taskId: string): Promise<RunwayVideoResponse> {
    try {
      const response = await fetch(`${this.baseUrl}/tasks/${taskId}`, {
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
        }
      });

      if (!response.ok) {
        throw new Error(`Failed to check task status: ${response.status}`);
      }

      const data = await response.json();
      
      return {
        taskId: data.id,
        status: this.mapRunwayStatus(data.status),
        videoUrl: data.output?.[0]?.url,
        thumbnailUrl: data.output?.[0]?.thumbnail_url,
        duration: data.duration || 0,
        prompt: data.prompt_text || '',
        dimensions: this.parseDimensions(data.ratio)
      };

    } catch (error: any) {
      console.error('[RUNWAY] Failed to check task status:', error);
      throw new Error(`Failed to check video status: ${error.message}`);
    }
  }

  /**
   * Wait for video generation to complete
   */
  async waitForCompletion(taskId: string, maxWaitTime = 300000): Promise<RunwayVideoResponse> {
    const startTime = Date.now();
    const pollInterval = 5000; // Check every 5 seconds

    console.log('[RUNWAY] Waiting for video generation to complete...');

    while (Date.now() - startTime < maxWaitTime) {
      const status = await this.getTaskStatus(taskId);
      
      if (status.status === 'completed') {
        console.log('[RUNWAY] Video generation completed successfully');
        return status;
      }
      
      if (status.status === 'failed') {
        throw new Error('Video generation failed');
      }

      console.log(`[RUNWAY] Status: ${status.status}, waiting...`);
      await new Promise(resolve => setTimeout(resolve, pollInterval));
    }

    throw new Error('Video generation timed out');
  }

  /**
   * Generate video and wait for completion in one call
   */
  async generateVideoComplete(request: RunwayVideoRequest): Promise<RunwayVideoResponse> {
    const task = await this.generateVideo(request);
    return await this.waitForCompletion(task.taskId);
  }

  /**
   * Optimize prompt for specific platform and style
   */
  private optimizePromptForPlatform(prompt: string, platform: string, style?: string): string {
    let optimized = prompt;

    // Add platform-specific optimization
    switch (platform.toLowerCase()) {
      case 'instagram':
        optimized = `Vertical mobile-friendly ${optimized}. Bright, engaging, social media optimized.`;
        break;
      case 'youtube':
        optimized = `High-quality ${optimized}. Cinematic, professional, YouTube-ready content.`;
        break;
      case 'tiktok':
        optimized = `Dynamic, fast-paced ${optimized}. TikTok viral style, engaging transitions.`;
        break;
    }

    // Add style-specific optimization
    if (style) {
      switch (style.toLowerCase()) {
        case 'professional':
          optimized = `Professional, clean, corporate style. ${optimized}`;
          break;
        case 'casual':
          optimized = `Casual, relaxed, everyday style. ${optimized}`;
          break;
        case 'creative':
          optimized = `Creative, artistic, innovative style. ${optimized}`;
          break;
        case 'minimal':
          optimized = `Minimalist, clean, simple style. ${optimized}`;
          break;
      }
    }

    // Ensure high quality
    optimized += ' High resolution, professional quality, smooth motion.';

    return optimized;
  }

  /**
   * Map RunwayML status to our internal status
   */
  private mapRunwayStatus(runwayStatus: string): 'pending' | 'processing' | 'completed' | 'failed' {
    switch (runwayStatus.toLowerCase()) {
      case 'pending':
      case 'queued':
        return 'pending';
      case 'running':
      case 'processing':
        return 'processing';
      case 'succeeded':
      case 'completed':
        return 'completed';
      case 'failed':
      case 'error':
        return 'failed';
      default:
        return 'pending';
    }
  }

  /**
   * Parse dimensions from ratio string
   */
  private parseDimensions(ratio: string): { width: number; height: number; ratio: string } {
    const commonDimensions: Record<string, { width: number; height: number }> = {
      '16:9': { width: 1920, height: 1080 },
      '9:16': { width: 1080, height: 1920 },
      '1:1': { width: 1080, height: 1080 },
      '4:3': { width: 1440, height: 1080 },
      '3:4': { width: 1080, height: 1440 }
    };

    const dimensions = commonDimensions[ratio] || { width: 1080, height: 1920 };
    
    return {
      ...dimensions,
      ratio
    };
  }
}

export default RunwayVideoService;