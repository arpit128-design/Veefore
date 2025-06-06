import axios from 'axios';

interface InstagramUser {
  id: string;
  username: string;
  account_type: string;
  media_count: number;
  followers_count: number;
}

interface InstagramMedia {
  id: string;
  media_type: string;
  media_url: string;
  permalink: string;
  timestamp: string;
  caption?: string;
  like_count?: number;
  comments_count?: number;
  views?: number;
  impressions?: number;
  reach?: number;
  engagement?: number;
}

interface InstagramInsights {
  impressions: number;
  reach: number;
  profile_views: number;
  website_clicks: number;
  follower_count: number;
}

export class InstagramAPI {
  private baseUrl = 'https://graph.instagram.com';
  
  constructor() {}

  // Generate Instagram OAuth URL - auto-detect app type
  generateAuthUrl(redirectUri: string, state?: string): string {
    // Try Instagram Business API first, fallback to Basic Display if needed
    const params = new URLSearchParams({
      client_id: process.env.INSTAGRAM_APP_ID!,
      redirect_uri: redirectUri,
      scope: 'user_profile,user_media', // Basic Display scopes
      response_type: 'code',
      ...(state && { state })
    });

    const authUrl = `https://api.instagram.com/oauth/authorize?${params.toString()}`;
    console.log(`[INSTAGRAM API] Generated OAuth URL: ${authUrl}`);
    console.log(`[INSTAGRAM API] Redirect URI: ${redirectUri}`);
    console.log(`[INSTAGRAM API] Client ID: ${process.env.INSTAGRAM_APP_ID}`);
    console.log(`[INSTAGRAM API] Using Basic Display API scopes for compatibility`);
    
    return authUrl;
  }

  // Exchange authorization code for access token (Works with both API types)
  async exchangeCodeForToken(code: string, redirectUri: string): Promise<{
    access_token: string;
    user_id?: string;
  }> {
    console.log(`[INSTAGRAM API] Token exchange started`);
    console.log(`[INSTAGRAM API] Code: ${code}`);
    console.log(`[INSTAGRAM API] Redirect URI: ${redirectUri}`);
    console.log(`[INSTAGRAM API] App ID: ${process.env.INSTAGRAM_APP_ID}`);
    
    const params = new URLSearchParams({
      client_id: process.env.INSTAGRAM_APP_ID!,
      client_secret: process.env.INSTAGRAM_APP_SECRET!,
      grant_type: 'authorization_code',
      redirect_uri: redirectUri,
      code
    });

    try {
      console.log(`[INSTAGRAM API] Making POST request to: https://api.instagram.com/oauth/access_token`);
      
      const response = await axios.post('https://api.instagram.com/oauth/access_token', params, {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      });

      console.log(`[INSTAGRAM API] Token exchange successful:`, response.data);
      return response.data;
    } catch (error: any) {
      console.error(`[INSTAGRAM API] Token exchange failed:`, {
        status: error.response?.status,
        data: error.response?.data,
        message: error.message
      });
      
      throw new Error(`Instagram token exchange failed: ${error.response?.data?.error_message || error.response?.data?.error?.message || error.message}`);
    }
  }

  // Get long-lived access token (Instagram Graph API)
  async getLongLivedToken(shortLivedToken: string): Promise<{
    access_token: string;
    token_type: string;
    expires_in: number;
  }> {
    const params = new URLSearchParams({
      grant_type: 'ig_exchange_token',
      client_secret: process.env.INSTAGRAM_APP_SECRET!,
      access_token: shortLivedToken
    });

    const response = await axios.get(`https://graph.instagram.com/access_token?${params.toString()}`);
    return response.data;
  }

  // Get user profile information (compatible with available API)
  async getUserProfile(accessToken: string): Promise<InstagramUser> {
    try {
      const fields = 'id,username,account_type,media_count';
      const response = await axios.get(`${this.baseUrl}/me`, {
        params: {
          fields,
          access_token: accessToken
        }
      });

      console.log(`[INSTAGRAM API] User profile:`, response.data);
      
      // Set followers_count to 0 as it may not be available in current API
      return {
        ...response.data,
        followers_count: 0
      };
    } catch (error: any) {
      console.error(`[INSTAGRAM API] Profile error:`, error.response?.data || error.message);
      throw new Error('Failed to fetch Instagram profile');
    }
  }

  // Get user media with Business API insights
  async getUserMedia(accessToken: string, limit = 25): Promise<InstagramMedia[]> {
    try {
      const fields = 'id,media_type,media_url,permalink,timestamp,caption,like_count,comments_count';
      const response = await axios.get(`${this.baseUrl}/me/media`, {
        params: {
          fields,
          limit,
          access_token: accessToken
        }
      });

      console.log(`[INSTAGRAM BUSINESS API] Media response:`, response.data);
      
      // Fetch insights for each media item
      const mediaWithInsights = await Promise.all(
        (response.data.data || []).map(async (media: any) => {
          try {
            const insights = await this.getMediaInsights(media.id, accessToken);
            return {
              ...media,
              impressions: insights.impressions || 0,
              reach: insights.reach || 0,
              engagement: (insights.likes || 0) + (insights.comments || 0),
              views: insights.video_views || 0
            };
          } catch (error) {
            console.log(`[INSTAGRAM BUSINESS API] Could not fetch insights for media ${media.id}`);
            return {
              ...media,
              impressions: 0,
              reach: 0,
              engagement: (media.like_count || 0) + (media.comments_count || 0),
              views: 0
            };
          }
        })
      );

      return mediaWithInsights;
    } catch (error: any) {
      console.error(`[INSTAGRAM BUSINESS API] Media error:`, error.response?.data || error.message);
      return [];
    }
  }

  // Get media insights with correct metrics for media type
  async getMediaInsights(mediaId: string, accessToken: string): Promise<any> {
    // Different metrics available for different media types
    const metricSets = [
      'reach,likes,comments,shares,saved', // For images - no impressions
      'reach,likes,comments', // Minimal for images
      'likes,comments', // Very basic metrics
      'reach' // Single metric
    ];

    for (const metrics of metricSets) {
      try {
        console.log(`[INSTAGRAM BUSINESS API] Trying media insights for ${mediaId} with: ${metrics}`);
        
        const response = await axios.get(`${this.baseUrl}/${mediaId}/insights`, {
          params: {
            metric: metrics,
            access_token: accessToken
          }
        });

        const insights: any = {};
        response.data.data.forEach((insight: any) => {
          insights[insight.name] = insight.values[0]?.value || 0;
        });

        console.log(`[INSTAGRAM BUSINESS API] Media insights success for ${mediaId}:`, insights);
        return insights;
      } catch (error: any) {
        console.log(`[INSTAGRAM BUSINESS API] Metrics '${metrics}' failed for ${mediaId}:`, error.response?.data?.error?.message || error.message);
        continue;
      }
    }

    console.log(`[INSTAGRAM BUSINESS API] All insights failed for ${mediaId}`);
    return {};
  }

  // Get account insights using correct Instagram Business API format
  async getAccountInsights(accessToken: string, period = 'day', since?: string, until?: string): Promise<InstagramInsights> {
    // Try different metric combinations since some may not be available
    const metricAttempts = [
      ['impressions', 'reach', 'profile_views'],
      ['impressions', 'reach'],
      ['profile_views'],
      ['reach']
    ];

    for (const metrics of metricAttempts) {
      try {
        console.log(`[INSTAGRAM BUSINESS API] Attempting account insights with: ${metrics.join(',')}`);
        
        const params: any = {
          metric: metrics.join(','),
          period,
          access_token: accessToken
        };

        // Add date range if provided
        if (since) params.since = since;
        if (until) params.until = until;

        const response = await axios.get(`${this.baseUrl}/me/insights`, { params });
        
        console.log(`[INSTAGRAM BUSINESS API] Account insights success with ${metrics.join(',')}:`, response.data);

        // Transform insights data
        const insights: any = {
          impressions: 0,
          reach: 0,
          profile_views: 0,
          website_clicks: 0,
          follower_count: 0
        };

        if (response.data.data) {
          response.data.data.forEach((insight: any) => {
            if (insight.values && insight.values.length > 0) {
              const value = insight.values[insight.values.length - 1]?.value || 0;
              insights[insight.name] = value;
              console.log(`[INSTAGRAM BUSINESS API] ${insight.name}: ${value}`);
            }
          });
        }

        return insights;
      } catch (error: any) {
        console.log(`[INSTAGRAM BUSINESS API] Metrics ${metrics.join(',')} failed:`, error.response?.data?.error?.message || error.message);
        continue;
      }
    }

    console.log(`[INSTAGRAM BUSINESS API] All account insights attempts failed`);
    return {
      impressions: 0,
      reach: 0,
      profile_views: 0,
      website_clicks: 0,
      follower_count: 0
    };
  }

  // Refresh access token
  async refreshAccessToken(accessToken: string): Promise<{
    access_token: string;
    token_type: string;
    expires_in: number;
  }> {
    const params = new URLSearchParams({
      grant_type: 'ig_refresh_token',
      access_token: accessToken
    });

    const response = await axios.get(`${this.baseUrl}/refresh_access_token?${params.toString()}`);
    return response.data;
  }
}

export const instagramAPI = new InstagramAPI();