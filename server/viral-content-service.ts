import axios from 'axios';
import { trendingScraper } from './trending-scraper';
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
    try {
      const interests = Array.isArray(userPreferences.interests) 
        ? userPreferences.interests 
        : ['general content'];
      const niche = userPreferences.niche || 'general';
      
      // Use advanced trending scraper for real viral content
      console.log('[VIRAL CONTENT] Using advanced trending scraper for viral content analysis');
      const viralTrends = await trendingScraper.getViralContentFromMultipleSources(niche, interests);
      
      if (viralTrends && viralTrends.length > 0) {
        console.log('[VIRAL CONTENT] Got viral trends from multiple sources:', viralTrends);
        return viralTrends;
      }

      // Fallback to Perplexity if trending scraper fails
      if (!this.perplexityApiKey) {
        console.log('[VIRAL CONTENT] No Perplexity API key, using enhanced fallback trends');
        return this.getFallbackTrends(userPreferences);
      }

      console.log('[VIRAL CONTENT] Trending scraper returned no results, trying Perplexity fallback');
      const interestString = interests.join(', ');
      
      const prompt = `You are a viral content analyst. Find CURRENT viral content trends from the last 48 hours specifically for ${niche} and ${interestString} professionals.

      Search for actual viral content that is getting millions of views RIGHT NOW in these areas:
      - Social media management automation and AI tools
      - App development with viral growth hacks  
      - Business productivity and management strategies
      - Tech entrepreneur success stories and failures
      - Social media marketing case studies with real numbers
      - App monetization and scaling strategies
      - Team management and remote work innovations
      - Professional development and skill building

      Focus on content that has PROVEN viral metrics (1M+ views, high engagement, trending hashtags).
      Look for specific viral formats like "How I grew X to Y in Z days", "X mistakes that cost me $Y", "Day in the life of a X", "X vs Y comparison".

      Return ONLY a JSON array of SPECIFIC viral content topics that are currently trending, with exact numbers/claims when possible. Maximum 10 items.
      Example format: ["How I built a $1M app in 6 months", "5 social media mistakes costing you sales", "Day in the life running a tech startup"]`;

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
    
    // Professional base trends focused on business and development
    const baseTrends = [
      'productivity hacks', 'business automation', 'app development tutorial', 'social media strategy'
    ];
    
    // High-viral potential content specifically for social media management niche
    if (niche.includes('social media management') || interests.includes('social media')) {
      return [
        'How I grew Instagram from 0 to 100k in 90 days', 'Social media manager salary secrets exposed', 
        'I tried every social media tool so you don\'t have to', 'Day in the life managing 50 Instagram accounts',
        'Social media mistakes that cost me $50k', 'How to get verified on Instagram in 2025',
        'Behind the scenes of viral content creation', 'I quit my 9-5 to become a social media manager'
      ];
    } else if (niche.includes('app development') || interests.includes('app development')) {
      return [
        'How I built a $1M app with no coding experience', 'App developer salary vs reality check',
        'I spent $100k on app development and failed', 'Building an app in 24 hours challenge',
        'Why 99% of apps fail and how to avoid it', 'App store rejected my app 47 times',
        'From idea to $1M ARR app development story', 'Junior vs senior developer code comparison'
      ];
    } else if (niche.includes('tech') || interests.includes('tech')) {
      return [
        'Tech CEO morning routine that changed everything', 'I interviewed at 100 tech companies',
        'Why I left Google to start my own company', 'Tech salary negotiation secrets they don\'t want you to know',
        'Day in the life at a $10B tech startup', 'I got fired from my tech job and this happened',
        'Tech industry layoffs reality check 2025', 'From bootcamp to $200k tech job in 6 months'
      ];
    } else if (niche.includes('business') || interests.includes('management')) {
      return [
        'How I built a $10M business in my bedroom', 'Business owner vs employee mindset shift',
        'I hired 100 employees and learned this', 'Why I sold my $5M company and regret it',
        'Team management secrets from Silicon Valley', 'From broke to $1M revenue in 12 months',
        'I fired my entire team and business doubled', 'Entrepreneur morning routine that made millions'
      ];
    }
    
    return baseTrends;
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
            createdAt: new Date(video.snippet.publishedAt)
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
        createdAt: new Date()
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
        createdAt: new Date()
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