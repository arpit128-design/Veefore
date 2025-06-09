/**
 * Real Video Processing Engine
 * Handles actual video files and YouTube URLs with FFmpeg integration
 */

import { spawn } from 'child_process';
import { promises as fs } from 'fs';
import path from 'path';
import OpenAI from 'openai';

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

interface VideoMetadata {
  duration: number;
  width: number;
  height: number;
  bitrate: number;
  fps: number;
  format: string;
  title?: string;
}

interface ProcessedSegment {
  startTime: number;
  endTime: number;
  outputPath: string;
  score: number;
  thumbnail: string;
}

export class RealVideoProcessor {
  private uploadsDir = './uploads';
  private outputDir = './generated-content';

  constructor() {
    this.ensureDirectories();
  }

  private async ensureDirectories() {
    await fs.mkdir(this.uploadsDir, { recursive: true });
    await fs.mkdir(this.outputDir, { recursive: true });
  }

  /**
   * Download video from YouTube URL using yt-dlp
   */
  async downloadFromURL(videoUrl: string): Promise<string> {
    return new Promise((resolve, reject) => {
      const timestamp = Date.now();
      const outputPath = path.join(this.uploadsDir, `video_${timestamp}.%(ext)s`);
      
      console.log('[REAL VIDEO] Downloading video from URL:', videoUrl);
      
      // Use yt-dlp to download video
      const ytDlp = spawn('yt-dlp', [
        '--format', 'best[height<=720]',
        '--output', outputPath,
        '--no-playlist',
        videoUrl
      ]);

      let stderr = '';
      
      ytDlp.stderr.on('data', (data) => {
        stderr += data.toString();
        console.log('[YT-DLP]', data.toString().trim());
      });

      ytDlp.on('close', async (code) => {
        if (code === 0) {
          // Find the downloaded file
          const files = await fs.readdir(this.uploadsDir);
          const videoFile = files.find(f => f.startsWith(`video_${timestamp}`));
          
          if (videoFile) {
            const fullPath = path.join(this.uploadsDir, videoFile);
            console.log('[REAL VIDEO] Successfully downloaded:', fullPath);
            resolve(fullPath);
          } else {
            reject(new Error('Downloaded file not found'));
          }
        } else {
          console.error('[YT-DLP] Error:', stderr);
          reject(new Error(`Download failed: ${stderr}`));
        }
      });
    });
  }

  /**
   * Extract video metadata using FFprobe
   */
  async getVideoMetadata(videoPath: string): Promise<VideoMetadata> {
    return new Promise((resolve, reject) => {
      const ffprobe = spawn('ffprobe', [
        '-v', 'quiet',
        '-print_format', 'json',
        '-show_format',
        '-show_streams',
        videoPath
      ]);

      let stdout = '';
      
      ffprobe.stdout.on('data', (data) => {
        stdout += data.toString();
      });

      ffprobe.on('close', (code) => {
        if (code === 0) {
          try {
            const metadata = JSON.parse(stdout);
            const videoStream = metadata.streams.find((s: any) => s.codec_type === 'video');
            
            if (!videoStream) {
              reject(new Error('No video stream found'));
              return;
            }

            resolve({
              duration: parseFloat(metadata.format.duration),
              width: videoStream.width,
              height: videoStream.height,
              bitrate: parseInt(metadata.format.bit_rate || '0'),
              fps: eval(videoStream.r_frame_rate), // Convert fraction to decimal
              format: metadata.format.format_name,
              title: metadata.format.tags?.title
            });
          } catch (error) {
            reject(new Error('Failed to parse metadata'));
          }
        } else {
          reject(new Error('FFprobe failed'));
        }
      });
    });
  }

  /**
   * Analyze video content using OpenAI vision
   */
  async analyzeVideoContent(videoPath: string, metadata: VideoMetadata): Promise<any> {
    console.log('[REAL VIDEO] Analyzing video content with OpenAI');
    
    // Extract frames for analysis
    const frameTimestamps = this.generateFrameTimestamps(metadata.duration);
    const frameAnalyses = [];

    for (const timestamp of frameTimestamps) {
      try {
        const framePath = await this.extractFrame(videoPath, timestamp);
        const frameBase64 = await fs.readFile(framePath, 'base64');
        
        const analysis = await openai.chat.completions.create({
          model: "gpt-4o",
          messages: [{
            role: "user",
            content: [
              {
                type: "text",
                text: `Analyze this video frame at ${timestamp}s. Describe the visual content, any text, people, actions, and rate the engagement potential (1-10).`
              },
              {
                type: "image_url",
                image_url: {
                  url: `data:image/jpeg;base64,${frameBase64}`
                }
              }
            ]
          }],
          max_tokens: 300
        });

        frameAnalyses.push({
          timestamp,
          analysis: analysis.choices[0].message.content,
          frame: framePath
        });

        // Clean up temporary frame
        await fs.unlink(framePath);
        
      } catch (error) {
        console.error('[REAL VIDEO] Frame analysis error:', error);
      }
    }

    return this.synthesizeAnalysis(frameAnalyses, metadata);
  }

  /**
   * Extract a frame at specific timestamp
   */
  private async extractFrame(videoPath: string, timestamp: number): Promise<string> {
    const frameOutput = path.join(this.outputDir, `frame_${Date.now()}_${timestamp}.jpg`);
    
    return new Promise((resolve, reject) => {
      const ffmpeg = spawn('ffmpeg', [
        '-i', videoPath,
        '-ss', timestamp.toString(),
        '-vframes', '1',
        '-y',
        frameOutput
      ]);

      ffmpeg.on('close', (code) => {
        if (code === 0) {
          resolve(frameOutput);
        } else {
          reject(new Error('Frame extraction failed'));
        }
      });
    });
  }

  /**
   * Generate optimal frame timestamps for analysis
   */
  private generateFrameTimestamps(duration: number): number[] {
    const frameCount = Math.min(Math.floor(duration / 30), 10); // Max 10 frames
    const interval = duration / (frameCount + 1);
    
    return Array.from({ length: frameCount }, (_, i) => (i + 1) * interval);
  }

  /**
   * Synthesize frame analyses into video insights
   */
  private async synthesizeAnalysis(frameAnalyses: any[], metadata: VideoMetadata): Promise<any> {
    const analysisText = frameAnalyses.map(f => 
      `${f.timestamp}s: ${f.analysis}`
    ).join('\n\n');

    const synthesis = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [{
        role: "user",
        content: `Based on these video frame analyses, identify the 3 best segments for short-form content:

${analysisText}

Video duration: ${metadata.duration}s
Format: ${metadata.format}

Return JSON with this structure:
{
  "bestSegments": [
    {
      "startTime": number,
      "endTime": number,
      "reason": "string",
      "engagementScore": number,
      "highlights": ["string"]
    }
  ],
  "overallTheme": "string",
  "recommendedStyle": "highlights|tutorial|story|viral"
}`
      }],
      response_format: { type: "json_object" }
    });

    return JSON.parse(synthesis.choices[0].message.content || '{}');
  }

  /**
   * Create short video from best segment
   */
  async createShortVideo(
    inputPath: string, 
    startTime: number, 
    endTime: number, 
    aspectRatio: '9:16' | '16:9' | '1:1' = '9:16'
  ): Promise<string> {
    const timestamp = Date.now();
    const outputPath = path.join(this.outputDir, `short_${timestamp}.mp4`);
    
    console.log('[REAL VIDEO] Creating short video:', { startTime, endTime, aspectRatio });

    return new Promise((resolve, reject) => {
      let ffmpegArgs = [
        '-i', inputPath,
        '-ss', startTime.toString(),
        '-t', (endTime - startTime).toString(),
        '-c:v', 'libx264',
        '-c:a', 'aac',
        '-preset', 'fast'
      ];

      // Apply aspect ratio transformations
      if (aspectRatio === '9:16') {
        ffmpegArgs.push('-vf', 'scale=720:1280:force_original_aspect_ratio=increase,crop=720:1280');
      } else if (aspectRatio === '1:1') {
        ffmpegArgs.push('-vf', 'scale=720:720:force_original_aspect_ratio=increase,crop=720:720');
      }

      ffmpegArgs.push('-y', outputPath);

      const ffmpeg = spawn('ffmpeg', ffmpegArgs);

      let stderr = '';
      ffmpeg.stderr.on('data', (data) => {
        stderr += data.toString();
      });

      ffmpeg.on('close', (code) => {
        if (code === 0) {
          console.log('[REAL VIDEO] Short video created:', outputPath);
          resolve(outputPath);
        } else {
          console.error('[REAL VIDEO] FFmpeg error:', stderr);
          reject(new Error(`Video processing failed: ${stderr}`));
        }
      });
    });
  }

  /**
   * Generate thumbnail for video
   */
  async generateThumbnail(videoPath: string, timestamp?: number): Promise<string> {
    const thumbOutput = path.join(this.outputDir, `thumb_${Date.now()}.jpg`);
    const seekTime = timestamp || 2; // Default to 2 seconds

    return new Promise((resolve, reject) => {
      const ffmpeg = spawn('ffmpeg', [
        '-i', videoPath,
        '-ss', seekTime.toString(),
        '-vframes', '1',
        '-vf', 'scale=480:270',
        '-y',
        thumbOutput
      ]);

      ffmpeg.on('close', (code) => {
        if (code === 0) {
          resolve(thumbOutput);
        } else {
          reject(new Error('Thumbnail generation failed'));
        }
      });
    });
  }

  /**
   * Clean up temporary files
   */
  async cleanup(filePaths: string[]) {
    for (const filePath of filePaths) {
      try {
        await fs.unlink(filePath);
        console.log('[REAL VIDEO] Cleaned up:', filePath);
      } catch (error) {
        console.error('[REAL VIDEO] Cleanup error:', error);
      }
    }
  }
}