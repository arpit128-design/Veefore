import axios from 'axios';
import { ContentRecommendation } from '@shared/schema';

interface PerplexityResponse {
  choices: {
    message: {
      content: string;
    };
  }[];
}

interface YouTubeVideo {
  id: {
    videoId?: string;
  };
  snippet: {
    title: string;
    description: string;
    thumbnails: {
      medium: {
        url: string;
      };
    };
    channelTitle: string;
    publishedAt: string;
  };
  statistics?: {
    viewCount: string;
    likeCount: string;
  };
}

interface YouTubeSearchResponse {
  items: YouTubeVideo[];
}

interface UserPreferences {
  interests?: string[];
  niche?: string;
  targetAudience?: string;
  contentStyle?: string;
}

class ViralContentService {
  private perplexityApiKey: string;
  private youtubeApiKey: string;

  constructor() {
    this.perplexityApiKey = process.env.PERPLEXITY_API_KEY || '';
    this.youtubeApiKey = process.env.YOUTUBE_API_KEY || '';
    
    if (!this.perplexityApiKey || !this.youtubeApiKey) {
      console.warn('[VIRAL CONTENT] Missing API keys - some features will be limited');
    }
  }

  async analyzeViralTrends(userPreferences: UserPreferences): Promise<string[]> {
    if (!this.perplexityApiKey) {
      console.log('[VIRAL CONTENT] Perplexity API key not available, using fallback trends');
      return this.getFallbackTrends(userPreferences);
    }

    try {
      const interests = userPreferences.interests?.join(', ') || 'general content';
      const niche = userPreferences.niche || 'general';
      
      const prompt = `Analyze current viral trends across YouTube, Instagram, TikTok, and Twitter for ${niche} content targeting ${interests}. 
      
      Focus on:
      1. What content is going viral RIGHT NOW (last 24-48 hours)
      2. Trending hashtags and topics with high engagement
      3. Video formats that are performing exceptionally well
      4. Content ideas that have viral potential
      
      Return only a JSON array of trending topic keywords/phrases, maximum 10 items. Format: ["keyword1", "keyword2", ...]`;

      const response = await axios.post(
        'https://api.perplexity.ai/chat/completions',
        {
          model: 'llama-3.1-sonar-small-128k-online',
          messages: [
            {
              role: 'system',
              content: 'You are a social media trends analyst. Provide current viral content trends in JSON format only.'
            },
            {
              role: 'user',
              content: prompt
            }
          ],
          max_tokens: 500,
          temperature: 0.3
        },
        {
          headers: {
            'Authorization': `Bearer ${this.perplexityApiKey}`,
            'Content-Type': 'application/json'
          }
        }
      );

      const content = response.data.choices[0].message.content;
      console.log('[VIRAL CONTENT] Perplexity response:', content);
      
      // Extract JSON from response
      const jsonMatch = content.match(/\[.*\]/);
      if (jsonMatch) {
        const trends = JSON.parse(jsonMatch[0]);
        console.log('[VIRAL CONTENT] Extracted trends:', trends);
        return trends;
      }

      return this.getFallbackTrends(userPreferences);
    } catch (error) {
      console.error('[VIRAL CONTENT] Perplexity API error:', error);
      return this.getFallbackTrends(userPreferences);
    }
  }

  private getFallbackTrends(userPreferences: UserPreferences): string[] {
    const interests = userPreferences.interests || [];
    const niche = userPreferences.niche || 'general';
    
    const baseTrends = [
      'viral challenges', 'trending sounds', 'quick tutorials', 'behind the scenes',
      'day in my life', 'transformation', 'reaction videos', 'tips and tricks'
    ];
    
    // Customize based on niche
    if (niche.includes('tech')) {
      return [...baseTrends, 'ai innovations', 'tech reviews', 'coding tips', 'startup stories'];
    } else if (niche.includes('lifestyle')) {
      return [...baseTrends, 'morning routines', 'productivity hacks', 'self care', 'home organization'];
    } else if (niche.includes('business')) {
      return [...baseTrends, 'entrepreneur tips', 'business growth', 'marketing strategies', 'success stories'];
    }
    
    return baseTrends.slice(0, 8);
  }

  async getYouTubeVideos(searchTerms: string[], contentType: 'youtube-video' | 'youtube-shorts'): Promise<ContentRecommendation[]> {
    if (!this.youtubeApiKey) {
      console.log('[VIRAL CONTENT] YouTube API key not available');
      return [];
    }

    const recommendations: ContentRecommendation[] = [];
    
    try {
      for (let i = 0; i < Math.min(searchTerms.length, 3); i++) {
        const searchTerm = searchTerms[i];
        
        const params: any = {
          part: 'snippet',
          q: searchTerm,
          type: 'video',
          order: 'relevance',
          maxResults: 4,
          publishedAfter: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
          key: this.youtubeApiKey
        };

        // Filter for shorts if needed
        if (contentType === 'youtube-shorts') {
          params.videoDuration = 'short';
          params.q += ' #shorts';
        }

        const response = await axios.get<YouTubeSearchResponse>(
          'https://www.googleapis.com/youtube/v3/search',
          { params }
        );

        for (const video of response.data.items) {
          if (!video.id.videoId) continue;

          const videoDetails = await this.getVideoDetails(video.id.videoId);
          
          recommendations.push({
            id: parseInt(video.id.videoId.replace(/\D/g, '').slice(0, 8) || '0'),
            type: contentType,
            title: video.snippet.title,
            description: video.snippet.description.slice(0, 200),
            thumbnailUrl: video.snippet.thumbnails.medium.url,
            mediaUrl: `https://www.youtube.com/embed/${video.id.videoId}?autoplay=1&mute=1`,
            duration: contentType === 'youtube-shorts' ? 60 : 180,
            category: searchTerm,
            country: 'Global',
            tags: this.extractTags(video.snippet.title + ' ' + video.snippet.description),
            engagement: {
              expectedViews: parseInt(videoDetails?.statistics?.viewCount || '1000'),
              expectedLikes: parseInt(videoDetails?.statistics?.likeCount || '50'),
              expectedShares: Math.floor(parseInt(videoDetails?.statistics?.viewCount || '1000') * 0.02)
            },
            sourceUrl: `https://www.youtube.com/watch?v=${video.id.videoId}`,
            isActive: true,
            createdAt: new Date(video.snippet.publishedAt).toISOString()
          });
        }
      }

      console.log('[VIRAL CONTENT] Fetched', recommendations.length, 'YouTube videos');
      return recommendations;
    } catch (error) {
      console.error('[VIRAL CONTENT] YouTube API error:', error);
      return [];
    }
  }

  private async getVideoDetails(videoId: string): Promise<YouTubeVideo | null> {
    try {
      const response = await axios.get(
        'https://www.googleapis.com/youtube/v3/videos',
        {
          params: {
            part: 'statistics',
            id: videoId,
            key: this.youtubeApiKey
          }
        }
      );

      return response.data.items[0] || null;
    } catch (error) {
      console.error('[VIRAL CONTENT] Error fetching video details:', error);
      return null;
    }
  }

  async getInstagramContent(searchTerms: string[]): Promise<ContentRecommendation[]> {
    // This would integrate with Instagram Basic Display API
    // For now, return structured data based on trending terms
    const recommendations: ContentRecommendation[] = [];
    
    searchTerms.slice(0, 3).forEach((term, index) => {
      // Instagram posts
      recommendations.push({
        id: 90000 + index,
        type: 'instagram-post',
        title: `Trending: ${term}`,
        description: `Popular Instagram post about ${term} with high engagement potential`,
        thumbnailUrl: '/api/placeholder/320/320',
        mediaUrl: '/api/placeholder/320/320',
        duration: 0,
        category: term,
        country: 'Global',
        tags: [term, 'trending', 'viral'],
        engagement: {
          expectedViews: Math.floor(Math.random() * 100000) + 10000,
          expectedLikes: Math.floor(Math.random() * 5000) + 500,
          expectedShares: Math.floor(Math.random() * 1000) + 100
        },
        sourceUrl: 'https://instagram.com',
        isActive: true,
        createdAt: new Date().toISOString()
      });

      // Instagram reels
      recommendations.push({
        id: 95000 + index,
        type: 'instagram-reel',
        title: `Viral Reel: ${term}`,
        description: `High-performing Instagram reel showcasing ${term} content`,
        thumbnailUrl: '/api/placeholder/320/320',
        mediaUrl: '/api/placeholder/320/320',
        duration: 30,
        category: term,
        country: 'Global',
        tags: [term, 'reels', 'viral'],
        engagement: {
          expectedViews: Math.floor(Math.random() * 500000) + 50000,
          expectedLikes: Math.floor(Math.random() * 25000) + 2500,
          expectedShares: Math.floor(Math.random() * 5000) + 500
        },
        sourceUrl: 'https://instagram.com',
        isActive: true,
        createdAt: new Date().toISOString()
      });
    });

    return recommendations;
  }

  private extractTags(text: string): string[] {
    const words = text.toLowerCase().split(/\s+/);
    const commonWords = ['the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'with', 'by'];
    
    return words
      .filter(word => word.length > 3 && !commonWords.includes(word))
      .slice(0, 5)
      .map(word => word.replace(/[^\w]/g, ''));
  }

  async getViralContentRecommendations(
    contentType: string,
    userPreferences: UserPreferences,
    limit: number = 12
  ): Promise<ContentRecommendation[]> {
    console.log('[VIRAL CONTENT] Getting recommendations for:', contentType, 'with preferences:', userPreferences);
    
    // Step 1: Analyze current viral trends
    const viralTrends = await this.analyzeViralTrends(userPreferences);
    console.log('[VIRAL CONTENT] Viral trends identified:', viralTrends);

    let recommendations: ContentRecommendation[] = [];

    // Step 2: Fetch content based on type
    switch (contentType) {
      case 'youtube-video':
        recommendations = await this.getYouTubeVideos(viralTrends, 'youtube-video');
        break;
      case 'youtube-shorts':
        recommendations = await this.getYouTubeVideos(viralTrends, 'youtube-shorts');
        break;
      case 'instagram-post':
      case 'instagram-video':
      case 'instagram-reel':
        const instagramContent = await this.getInstagramContent(viralTrends);
        recommendations = instagramContent.filter(item => item.type === contentType);
        break;
      default:
        // Mix of all types
        const youtubeVideos = await this.getYouTubeVideos(viralTrends, 'youtube-video');
        const youtubeShorts = await this.getYouTubeVideos(viralTrends, 'youtube-shorts');
        const instagramAll = await this.getInstagramContent(viralTrends);
        recommendations = [...youtubeVideos, ...youtubeShorts, ...instagramAll];
    }

    // Step 3: Sort by viral potential and limit results
    recommendations.sort((a, b) => {
      const aViews = (a.engagement as any)?.expectedViews || 0;
      const bViews = (b.engagement as any)?.expectedViews || 0;
      return bViews - aViews;
    });
    
    return recommendations.slice(0, limit);
  }
}

export const viralContentService = new ViralContentService();