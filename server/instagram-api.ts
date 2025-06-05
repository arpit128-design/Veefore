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

  // Generate Instagram Business Login OAuth URL (Direct Instagram API)
  generateAuthUrl(redirectUri: string, state?: string): string {
    const params = new URLSearchParams({
      client_id: process.env.INSTAGRAM_APP_ID!,
      redirect_uri: redirectUri,
      scope: 'instagram_business_basic,instagram_business_manage_messages,instagram_business_manage_comments,instagram_business_content_publish',
      response_type: 'code',
      ...(state && { state })
    });

    const authUrl = `https://api.instagram.com/oauth/authorize?${params.toString()}`;
    console.log(`[INSTAGRAM API] Generated Business API auth URL: ${authUrl}`);
    console.log(`[INSTAGRAM API] Redirect URI: ${redirectUri}`);
    console.log(`[INSTAGRAM API] Client ID: ${process.env.INSTAGRAM_APP_ID}`);
    
    return authUrl;
  }

  // Exchange authorization code for access token (Instagram Business API)
  async exchangeCodeForToken(code: string, redirectUri: string): Promise<{
    access_token: string;
    user_id?: string;
  }> {
    console.log(`[INSTAGRAM API] Business API token exchange started`);
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
      console.log(`[INSTAGRAM API] Request params:`, params.toString());
      
      const response = await axios.post('https://api.instagram.com/oauth/access_token', params, {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      });

      console.log(`[INSTAGRAM API] Business API token exchange successful:`, response.data);
      return response.data;
    } catch (error: any) {
      console.error(`[INSTAGRAM API] Business API token exchange failed:`, error.response?.data || error.message);
      console.error(`[INSTAGRAM API] Response status:`, error.response?.status);
      console.error(`[INSTAGRAM API] Response headers:`, error.response?.headers);
      console.error(`[INSTAGRAM API] Full error response:`, JSON.stringify(error.response?.data, null, 2));
      
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

  // Get user profile information with Business API
  async getUserProfile(accessToken: string): Promise<InstagramUser> {
    try {
      const fields = 'id,username,account_type,media_count,followers_count,name,biography,profile_picture_url,website';
      const response = await axios.get(`${this.baseUrl}/me`, {
        params: {
          fields,
          access_token: accessToken
        }
      });

      console.log(`[INSTAGRAM BUSINESS API] User profile:`, response.data);
      return response.data;
    } catch (error: any) {
      console.error(`[INSTAGRAM BUSINESS API] Profile error:`, error.response?.data || error.message);
      throw new Error('Failed to fetch Instagram Business profile');
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

  // Get media insights with Business API
  async getMediaInsights(mediaId: string, accessToken: string): Promise<any> {
    try {
      // For video content, include video-specific metrics
      const videoMetrics = 'video_views,reach,impressions,likes,comments,shares,saves';
      const photoMetrics = 'reach,impressions,likes,comments,shares,saves';
      
      console.log(`[INSTAGRAM BUSINESS API] Fetching insights for media: ${mediaId}`);
      
      const response = await axios.get(`${this.baseUrl}/${mediaId}/insights`, {
        params: {
          metric: videoMetrics, // Try video metrics first, fallback if needed
          access_token: accessToken
        }
      });

      // Transform insights data into a more usable format
      const insights: any = {};
      response.data.data.forEach((insight: any) => {
        insights[insight.name] = insight.values[0]?.value || 0;
      });

      console.log(`[INSTAGRAM BUSINESS API] Media insights for ${mediaId}:`, insights);
      return insights;
    } catch (error: any) {
      console.log(`[INSTAGRAM BUSINESS API] Media insights error for ${mediaId}:`, error.response?.data || error.message);
      
      // Try photo metrics if video metrics failed
      try {
        const response = await axios.get(`${this.baseUrl}/${mediaId}/insights`, {
          params: {
            metric: 'reach,impressions,likes,comments,shares,saves',
            access_token: accessToken
          }
        });

        const insights: any = {};
        response.data.data.forEach((insight: any) => {
          insights[insight.name] = insight.values[0]?.value || 0;
        });

        return insights;
      } catch (fallbackError) {
        console.log(`[INSTAGRAM BUSINESS API] Fallback insights also failed for ${mediaId}`);
        return {};
      }
    }
  }

  // Get account insights
  async getAccountInsights(accessToken: string, period = 'day', since?: string, until?: string): Promise<InstagramInsights> {
    const metrics = 'impressions,reach,profile_views,website_clicks,follower_count';
    const params: any = {
      metric: metrics,
      period,
      access_token: accessToken
    };

    if (since) params.since = since;
    if (until) params.until = until;

    try {
      const response = await axios.get(`${this.baseUrl}/me/insights`, { params });

      // Transform insights data
      const insights: any = {
        impressions: 0,
        reach: 0,
        profile_views: 0,
        website_clicks: 0,
        follower_count: 0
      };

      response.data.data.forEach((insight: any) => {
        if (insight.values && insight.values.length > 0) {
          insights[insight.name] = insight.values[insight.values.length - 1]?.value || 0;
        }
      });

      return insights;
    } catch (error) {
      console.error('Error fetching account insights:', error);
      return {
        impressions: 0,
        reach: 0,
        profile_views: 0,
        website_clicks: 0,
        follower_count: 0
      };
    }
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