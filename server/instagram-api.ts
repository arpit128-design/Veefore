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

  // Generate Instagram Business OAuth URL
  generateAuthUrl(redirectUri: string, state?: string): string {
    const params = new URLSearchParams({
      client_id: process.env.INSTAGRAM_APP_ID!,
      redirect_uri: redirectUri,
      scope: 'user_profile,user_media',
      response_type: 'code',
      ...(state && { state })
    });

    return `https://api.instagram.com/oauth/authorize?${params.toString()}`;
  }

  // Exchange authorization code for access token (Instagram Business API)
  async exchangeCodeForToken(code: string, redirectUri: string): Promise<{
    access_token: string;
    user_id?: string;
  }> {
    const params = new URLSearchParams({
      client_id: process.env.INSTAGRAM_APP_ID!,
      client_secret: process.env.INSTAGRAM_APP_SECRET!,
      grant_type: 'authorization_code',
      redirect_uri: redirectUri,
      code
    });

    const response = await axios.post('https://api.instagram.com/oauth/access_token', params, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    });

    return response.data;
  }

  // Get long-lived access token
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

    const response = await axios.get(`${this.baseUrl}/access_token?${params.toString()}`);
    return response.data;
  }

  // Get user profile information
  async getUserProfile(accessToken: string): Promise<InstagramUser> {
    const fields = 'id,username,account_type,media_count,followers_count';
    const response = await axios.get(`${this.baseUrl}/me`, {
      params: {
        fields,
        access_token: accessToken
      }
    });

    return response.data;
  }

  // Get user media
  async getUserMedia(accessToken: string, limit = 25): Promise<InstagramMedia[]> {
    const fields = 'id,media_type,media_url,permalink,timestamp,caption';
    const response = await axios.get(`${this.baseUrl}/me/media`, {
      params: {
        fields,
        limit,
        access_token: accessToken
      }
    });

    return response.data.data || [];
  }

  // Get media insights
  async getMediaInsights(mediaId: string, accessToken: string): Promise<any> {
    const metrics = 'impressions,reach,likes,comments,shares,saves';
    
    try {
      const response = await axios.get(`${this.baseUrl}/${mediaId}/insights`, {
        params: {
          metric: metrics,
          access_token: accessToken
        }
      });

      // Transform insights data into a more usable format
      const insights: any = {};
      response.data.data.forEach((insight: any) => {
        insights[insight.name] = insight.values[0]?.value || 0;
      });

      return insights;
    } catch (error) {
      console.error('Error fetching media insights:', error);
      return {};
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