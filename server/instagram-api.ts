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
      // Try comprehensive fields first, then fallback if needed
      let fields = 'id,username,account_type,media_count,followers_count,name,biography,profile_picture_url,website';
      let response;
      
      try {
        response = await axios.get(`${this.baseUrl}/me`, {
          params: { fields, access_token: accessToken }
        });
      } catch (primaryError: any) {
        console.log(`[INSTAGRAM BUSINESS API] Trying basic profile fields due to:`, primaryError.response?.data?.error?.message);
        // Fallback to basic fields if permissions are limited
        fields = 'id,username,account_type,media_count';
        response = await axios.get(`${this.baseUrl}/me`, {
          params: { fields, access_token: accessToken }
        });
      }

      console.log(`[INSTAGRAM BUSINESS API] User profile:`, response.data);
      
      // Ensure we have all required properties
      const profile = {
        id: response.data.id,
        username: response.data.username,
        account_type: response.data.account_type || 'PERSONAL',
        media_count: response.data.media_count || 0,
        followers_count: response.data.followers_count || 0,
        ...response.data
      };
      
      return profile;
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

  // Publish photo to Instagram
  async publishPhoto(accessToken: string, imageUrl: string, caption: string): Promise<{
    id: string;
    permalink?: string;
  }> {
    try {
      console.log(`[INSTAGRAM PUBLISH] Starting photo upload process`);
      
      // Step 1: Create media container
      const containerResponse = await axios.post(`${this.baseUrl}/me/media`, {
        image_url: imageUrl,
        caption: caption,
        access_token: accessToken
      });

      const containerId = containerResponse.data.id;
      console.log(`[INSTAGRAM PUBLISH] Media container created: ${containerId}`);

      // Step 2: Publish the media container
      const publishResponse = await axios.post(`${this.baseUrl}/me/media_publish`, {
        creation_id: containerId,
        access_token: accessToken
      });

      console.log(`[INSTAGRAM PUBLISH] Photo published successfully:`, publishResponse.data);
      return publishResponse.data;
    } catch (error: any) {
      console.error(`[INSTAGRAM PUBLISH] Photo publish failed:`, error.response?.data || error.message);
      throw new Error(`Instagram photo publish failed: ${error.response?.data?.error?.message || error.message}`);
    }
  }

  // Publish reel to Instagram
  async publishReel(accessToken: string, videoUrl: string, caption: string): Promise<{
    id: string;
    permalink?: string;
  }> {
    try {
      console.log(`[INSTAGRAM PUBLISH] Starting reel upload process`);
      console.log(`[INSTAGRAM API] WARNING: Reel publishing requires advanced Instagram API permissions`);
      console.log(`[INSTAGRAM API] If this fails, the video will be published as a regular video post instead`);
      
      // Step 1: Create reel media container
      const containerResponse = await axios.post(`${this.baseUrl}/me/media`, {
        video_url: videoUrl,
        caption: caption,
        media_type: 'REELS',
        access_token: accessToken
      });

      const containerId = containerResponse.data.id;
      console.log(`[INSTAGRAM PUBLISH] Reel container created: ${containerId}`);

      // Step 2: Check container status (reels need processing time)
      let containerReady = false;
      let attempts = 0;
      const maxAttempts = 12; // 2 minutes total wait time

      while (!containerReady && attempts < maxAttempts) {
        await new Promise(resolve => setTimeout(resolve, 10000)); // Wait 10 seconds for reels
        
        const statusResponse = await axios.get(`${this.baseUrl}/${containerId}`, {
          params: {
            fields: 'status_code',
            access_token: accessToken
          }
        });

        console.log(`[INSTAGRAM PUBLISH] Reel status check ${attempts + 1}:`, statusResponse.data.status_code);

        if (statusResponse.data.status_code === 'FINISHED') {
          containerReady = true;
        } else if (statusResponse.data.status_code === 'ERROR') {
          console.log(`[INSTAGRAM PUBLISH] Reel processing failed, falling back to regular video post`);
          // Fall back to regular video post
          return this.publishVideo(accessToken, videoUrl, caption);
        }
        
        attempts++;
      }

      if (!containerReady) {
        console.log(`[INSTAGRAM PUBLISH] Reel processing timeout, falling back to regular video post`);
        // Fall back to regular video post
        return this.publishVideo(accessToken, videoUrl, caption);
      }

      // Step 3: Publish the reel container
      const publishResponse = await axios.post(`${this.baseUrl}/me/media_publish`, {
        creation_id: containerId,
        access_token: accessToken
      });

      console.log(`[INSTAGRAM PUBLISH] Reel published successfully:`, publishResponse.data);
      return publishResponse.data;
    } catch (error: any) {
      console.error(`[INSTAGRAM PUBLISH] Reel publish failed, trying regular video:`, error.response?.data || error.message);
      // Fall back to regular video post if Reels fail
      try {
        return await this.publishVideo(accessToken, videoUrl, caption);
      } catch (fallbackError: any) {
        throw new Error(`Instagram publish failed: ${error.response?.data?.error?.message || error.message}`);
      }
    }
  }

  // Publish story to Instagram
  async publishStory(accessToken: string, mediaUrl: string, isVideo: boolean = false): Promise<{
    id: string;
    permalink?: string;
  }> {
    try {
      console.log(`[INSTAGRAM PUBLISH] Starting story upload process (${isVideo ? 'video' : 'image'})`);
      
      // Step 1: Create story media container
      const mediaData: any = {
        access_token: accessToken
      };

      if (isVideo) {
        mediaData.video_url = mediaUrl;
        mediaData.media_type = 'STORIES';
      } else {
        mediaData.image_url = mediaUrl;
        mediaData.media_type = 'STORIES';
      }

      const containerResponse = await axios.post(`${this.baseUrl}/me/media`, mediaData);

      const containerId = containerResponse.data.id;
      console.log(`[INSTAGRAM PUBLISH] Story container created: ${containerId}`);

      // Step 2: For video stories, check processing status
      if (isVideo) {
        let containerReady = false;
        let attempts = 0;
        const maxAttempts = 10;

        while (!containerReady && attempts < maxAttempts) {
          await new Promise(resolve => setTimeout(resolve, 5000));
          
          const statusResponse = await axios.get(`${this.baseUrl}/${containerId}`, {
            params: {
              fields: 'status_code',
              access_token: accessToken
            }
          });

          if (statusResponse.data.status_code === 'FINISHED') {
            containerReady = true;
          } else if (statusResponse.data.status_code === 'ERROR') {
            throw new Error('Story video processing failed');
          }
          
          attempts++;
        }

        if (!containerReady) {
          throw new Error('Story video processing timeout');
        }
      }

      // Step 3: Publish the story container
      const publishResponse = await axios.post(`${this.baseUrl}/me/media_publish`, {
        creation_id: containerId,
        access_token: accessToken
      });

      console.log(`[INSTAGRAM PUBLISH] Story published successfully:`, publishResponse.data);
      return publishResponse.data;
    } catch (error: any) {
      console.error(`[INSTAGRAM PUBLISH] Story publish failed:`, error.response?.data || error.message);
      throw new Error(`Instagram story publish failed: ${error.response?.data?.error?.message || error.message}`);
    }
  }

  // Publish video to Instagram
  async publishVideo(accessToken: string, videoUrl: string, caption: string): Promise<{
    id: string;
    permalink?: string;
  }> {
    try {
      console.log(`[INSTAGRAM PUBLISH] Starting video upload process`);
      
      // Step 1: Create video media container
      const containerResponse = await axios.post(`${this.baseUrl}/me/media`, {
        video_url: videoUrl,
        caption: caption,
        media_type: 'REELS', // VIDEO is deprecated, use REELS for all video content
        access_token: accessToken
      });

      const containerId = containerResponse.data.id;
      console.log(`[INSTAGRAM PUBLISH] Video container created: ${containerId}`);

      // Step 2: Check container status (videos need processing time)
      let containerReady = false;
      let attempts = 0;
      const maxAttempts = 10;

      while (!containerReady && attempts < maxAttempts) {
        await new Promise(resolve => setTimeout(resolve, 5000)); // Wait 5 seconds
        
        const statusResponse = await axios.get(`${this.baseUrl}/${containerId}`, {
          params: {
            fields: 'status_code',
            access_token: accessToken
          }
        });

        if (statusResponse.data.status_code === 'FINISHED') {
          containerReady = true;
        } else if (statusResponse.data.status_code === 'ERROR') {
          throw new Error('Video processing failed');
        }
        
        attempts++;
      }

      if (!containerReady) {
        throw new Error('Video processing timeout');
      }

      // Step 3: Publish the video container
      const publishResponse = await axios.post(`${this.baseUrl}/me/media_publish`, {
        creation_id: containerId,
        access_token: accessToken
      });

      console.log(`[INSTAGRAM PUBLISH] Video published successfully:`, publishResponse.data);
      return publishResponse.data;
    } catch (error: any) {
      console.error(`[INSTAGRAM PUBLISH] Video publish failed:`, error.response?.data || error.message);
      throw new Error(`Instagram video publish failed: ${error.response?.data?.error?.message || error.message}`);
    }
  }
}

export const instagramAPI = new InstagramAPI();