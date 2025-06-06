import { instagramAPI } from './instagram-api';
import { IStorage } from './storage';

interface EngagementData {
  mediaId: string;
  timestamp: string;
  likes: number;
  comments: number;
  reach: number;
  impressions: number;
  shares: number;
  saves: number;
}

interface OptimalTimingData {
  hour: number;
  dayOfWeek: number;
  avgEngagement: number;
  postCount: number;
}

interface AnalyticsResult {
  engagementRate: number;
  growthVelocity: number;
  optimalTime: {
    hour: string;
    peakHours: string;
    bestDays: string[];
    audienceActive: number;
  };
  trendsData: {
    weeklyGrowth: number;
    engagementTrend: number;
    reachGrowth: number;
  };
}

export class AnalyticsEngine {
  constructor(private storage: IStorage) {}

  async calculateRealTimeAnalytics(accessToken: string, workspaceId: number): Promise<AnalyticsResult> {
    try {
      // Get user's media data from last 30 days
      const mediaData = await instagramAPI.getUserMedia(accessToken, 25);
      
      // Get detailed insights for each media
      const engagementData: EngagementData[] = [];
      
      for (const media of mediaData) {
        try {
          const insights = await instagramAPI.getMediaInsights(media.id, accessToken);
          engagementData.push({
            mediaId: media.id,
            timestamp: media.timestamp,
            likes: media.like_count || 0,
            comments: media.comments_count || 0,
            reach: insights.reach || 0,
            impressions: insights.impressions || 0,
            shares: insights.shares || 0,
            saves: insights.saved || 0
          });
        } catch (error) {
          console.log(`[ANALYTICS] Could not get insights for media ${media.id}`);
        }
      }

      // Calculate authentic engagement rate
      const engagementRate = this.calculateEngagementRate(engagementData, accessToken);
      
      // Calculate growth velocity based on posting patterns
      const growthVelocity = await this.calculateGrowthVelocity(engagementData, accessToken);
      
      // Analyze optimal posting times from user's historical data
      const optimalTime = this.calculateOptimalTiming(engagementData);
      
      // Calculate trend data
      const trendsData = this.calculateTrends(engagementData);

      return {
        engagementRate,
        growthVelocity,
        optimalTime,
        trendsData
      };

    } catch (error) {
      console.error('[ANALYTICS ENGINE] Error calculating analytics:', error);
      throw error;
    }
  }

  private calculateEngagementRate(engagementData: EngagementData[], accessToken: string): number {
    if (engagementData.length === 0) return 0;

    const totalEngagements = engagementData.reduce((sum, data) => {
      return sum + data.likes + data.comments + data.shares + data.saves;
    }, 0);

    const totalReach = engagementData.reduce((sum, data) => sum + data.reach, 0);
    
    if (totalReach === 0) return 0;
    
    // Calculate engagement rate as percentage of total engagements vs total reach
    const rate = (totalEngagements / totalReach) * 100;
    return Math.round(rate * 10) / 10; // Round to 1 decimal place
  }

  private async calculateGrowthVelocity(engagementData: EngagementData[], accessToken: string): Promise<number> {
    try {
      // Get current follower count
      const profile = await instagramAPI.getUserProfile(accessToken);
      const currentFollowers = profile.followers_count || 0;

      if (engagementData.length < 5) {
        return 0; // Not enough data for meaningful growth calculation
      }

      // Sort by date to analyze chronological growth patterns
      const sortedData = engagementData.sort((a, b) => 
        new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
      );

      // Calculate engagement efficiency over time
      const recentData = sortedData.slice(-7); // Last 7 posts
      const olderData = sortedData.slice(0, 7); // First 7 posts

      const recentAvgEngagement = recentData.reduce((sum, data) => 
        sum + data.likes + data.comments, 0) / recentData.length;
      
      const olderAvgEngagement = olderData.reduce((sum, data) => 
        sum + data.likes + data.comments, 0) / olderData.length;

      if (olderAvgEngagement === 0) return 0;

      // Calculate growth velocity as percentage change in engagement efficiency
      const velocityPercentage = ((recentAvgEngagement - olderAvgEngagement) / olderAvgEngagement) * 100;
      
      return Math.round(velocityPercentage * 10) / 10;

    } catch (error) {
      console.error('[ANALYTICS] Error calculating growth velocity:', error);
      return 0;
    }
  }

  private calculateOptimalTiming(engagementData: EngagementData[]): {
    hour: string;
    peakHours: string;
    bestDays: string[];
    audienceActive: number;
  } {
    if (engagementData.length === 0) {
      return {
        hour: '6:00 PM',
        peakHours: '6-8 PM',
        bestDays: ['Tue', 'Thu'],
        audienceActive: 89
      };
    }

    // Analyze posting times and their engagement
    const timingAnalysis: OptimalTimingData[] = [];
    
    engagementData.forEach(data => {
      const date = new Date(data.timestamp);
      const hour = date.getHours();
      const dayOfWeek = date.getDay();
      const engagement = data.likes + data.comments + data.shares + data.saves;
      
      timingAnalysis.push({
        hour,
        dayOfWeek,
        avgEngagement: engagement,
        postCount: 1
      });
    });

    // Group by hour and calculate average engagement
    const hourlyStats = new Map<number, { totalEngagement: number; postCount: number }>();
    
    timingAnalysis.forEach(analysis => {
      const existing = hourlyStats.get(analysis.hour) || { totalEngagement: 0, postCount: 0 };
      hourlyStats.set(analysis.hour, {
        totalEngagement: existing.totalEngagement + analysis.avgEngagement,
        postCount: existing.postCount + 1
      });
    });

    // Find optimal hour
    let bestHour = 18; // Default 6 PM
    let maxAvgEngagement = 0;

    hourlyStats.forEach((stats, hour) => {
      const avgEngagement = stats.totalEngagement / stats.postCount;
      if (avgEngagement > maxAvgEngagement) {
        maxAvgEngagement = avgEngagement;
        bestHour = hour;
      }
    });

    // Analyze best days
    const dayStats = new Map<number, { totalEngagement: number; postCount: number }>();
    const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    
    timingAnalysis.forEach(analysis => {
      const existing = dayStats.get(analysis.dayOfWeek) || { totalEngagement: 0, postCount: 0 };
      dayStats.set(analysis.dayOfWeek, {
        totalEngagement: existing.totalEngagement + analysis.avgEngagement,
        postCount: existing.postCount + 1
      });
    });

    const bestDays: string[] = [];
    dayStats.forEach((stats, day) => {
      const avgEngagement = stats.totalEngagement / stats.postCount;
      if (avgEngagement > maxAvgEngagement * 0.8) { // Within 80% of best performance
        bestDays.push(dayNames[day]);
      }
    });

    // Calculate audience activity percentage
    const totalEngagement = engagementData.reduce((sum, data) => 
      sum + data.likes + data.comments + data.shares + data.saves, 0);
    const averageEngagement = totalEngagement / engagementData.length;
    const audienceActive = Math.min(99, Math.max(50, Math.round(averageEngagement * 10)));

    return {
      hour: `${bestHour % 12 || 12}:00 ${bestHour >= 12 ? 'PM' : 'AM'}`,
      peakHours: `${(bestHour-1) % 12 || 12}-${(bestHour+1) % 12 || 12} ${bestHour >= 12 ? 'PM' : 'AM'}`,
      bestDays: bestDays.length > 0 ? bestDays.slice(0, 2) : ['Tue', 'Thu'],
      audienceActive
    };
  }

  private calculateTrends(engagementData: EngagementData[]): {
    weeklyGrowth: number;
    engagementTrend: number;
    reachGrowth: number;
  } {
    if (engagementData.length < 7) {
      return {
        weeklyGrowth: 0,
        engagementTrend: 0,
        reachGrowth: 0
      };
    }

    const sortedData = engagementData.sort((a, b) => 
      new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
    );

    // Split data into two periods for comparison
    const midPoint = Math.floor(sortedData.length / 2);
    const olderPeriod = sortedData.slice(0, midPoint);
    const recentPeriod = sortedData.slice(midPoint);

    // Calculate averages for each period
    const olderAvgEngagement = olderPeriod.reduce((sum, data) => 
      sum + data.likes + data.comments, 0) / olderPeriod.length;
    
    const recentAvgEngagement = recentPeriod.reduce((sum, data) => 
      sum + data.likes + data.comments, 0) / recentPeriod.length;

    const olderAvgReach = olderPeriod.reduce((sum, data) => sum + data.reach, 0) / olderPeriod.length;
    const recentAvgReach = recentPeriod.reduce((sum, data) => sum + data.reach, 0) / recentPeriod.length;

    // Calculate percentage changes
    const engagementTrend = olderAvgEngagement > 0 
      ? ((recentAvgEngagement - olderAvgEngagement) / olderAvgEngagement) * 100 
      : 0;

    const reachGrowth = olderAvgReach > 0 
      ? ((recentAvgReach - olderAvgReach) / olderAvgReach) * 100 
      : 0;

    // Estimate weekly growth based on posting frequency and engagement trends
    const weeklyGrowth = (engagementTrend + reachGrowth) / 2;

    return {
      weeklyGrowth: Math.round(weeklyGrowth * 10) / 10,
      engagementTrend: Math.round(engagementTrend * 10) / 10,
      reachGrowth: Math.round(reachGrowth * 10) / 10
    };
  }
}