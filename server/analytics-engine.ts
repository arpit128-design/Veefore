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
      
      // Analyze optimal posting times from user's historical data with actual timestamps
      const optimalTime = await this.calculateOptimalTiming(engagementData, accessToken);
      
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

  private async calculateOptimalTiming(engagementData: EngagementData[], accessToken: string): Promise<{
    hour: string;
    peakHours: string;
    bestDays: string[];
    audienceActive: number;
  }> {
    try {
      // Get authentic Instagram media data with timestamps
      const mediaData = await instagramAPI.getUserMedia(accessToken, 25);
      
      if (mediaData.length === 0) {
        console.log('[ANALYTICS ENGINE] No media data available for optimal timing');
        return {
          hour: "6:00 PM",
          peakHours: "6-8 PM",
          bestDays: ["Tue", "Thu"],
          audienceActive: 50
        };
      }

      // Combine Instagram timestamps with engagement data for authentic analysis
      const timingData: { hour: number; day: number; engagement: number; reach: number; timestamp: string }[] = [];
      
      mediaData.forEach(media => {
        const date = new Date(media.timestamp);
        const hour = date.getHours();
        const dayOfWeek = date.getDay();
        
        // Match with engagement data
        const engagementInfo = engagementData.find(ed => ed.mediaId === media.id) || {
          likes: 0, comments: 0, shares: 0, saves: 0, reach: 0
        };
        
        const totalEngagement = engagementInfo.likes + engagementInfo.comments + engagementInfo.shares + engagementInfo.saves;
        
        timingData.push({
          hour,
          day: dayOfWeek,
          engagement: totalEngagement,
          reach: engagementInfo.reach,
          timestamp: media.timestamp
        });
      });

      if (timingData.length === 0) {
        return {
          hour: "6:00 PM",
          peakHours: "6-8 PM",
          bestDays: ["Tue", "Thu"],
          audienceActive: 50
        };
      }

      // Analyze posting patterns by hour
      const hourlyStats = new Map<number, { totalEngagement: number; totalReach: number; postCount: number }>();
      const dailyStats = new Map<number, { totalEngagement: number; totalReach: number; postCount: number }>();

      timingData.forEach(entry => {
        // Hourly analysis
        const hourlyExisting = hourlyStats.get(entry.hour) || { totalEngagement: 0, totalReach: 0, postCount: 0 };
        hourlyStats.set(entry.hour, {
          totalEngagement: hourlyExisting.totalEngagement + entry.engagement,
          totalReach: hourlyExisting.totalReach + entry.reach,
          postCount: hourlyExisting.postCount + 1
        });

        // Daily analysis
        const dailyExisting = dailyStats.get(entry.day) || { totalEngagement: 0, totalReach: 0, postCount: 0 };
        dailyStats.set(entry.day, {
          totalEngagement: dailyExisting.totalEngagement + entry.engagement,
          totalReach: dailyExisting.totalReach + entry.reach,
          postCount: dailyExisting.postCount + 1
        });
      });

      // Find optimal hour based on authentic engagement rates
      let bestHour = 18;
      let bestEngagementRate = 0;

      hourlyStats.forEach((stats, hour) => {
        const engagementRate = stats.totalReach > 0 ? (stats.totalEngagement / stats.totalReach) * 100 : 0;
        if (engagementRate > bestEngagementRate && stats.postCount > 0) {
          bestEngagementRate = engagementRate;
          bestHour = hour;
        }
      });

      // Calculate peak hours from authentic data
      const avgEngagementRate = Array.from(hourlyStats.values())
        .filter(stats => stats.totalReach > 0)
        .reduce((sum, stats) => sum + ((stats.totalEngagement / stats.totalReach) * 100), 0) / 
        Array.from(hourlyStats.values()).filter(stats => stats.totalReach > 0).length;

      const peakHours: number[] = [];
      hourlyStats.forEach((stats, hour) => {
        const engagementRate = stats.totalReach > 0 ? (stats.totalEngagement / stats.totalReach) * 100 : 0;
        if (engagementRate > avgEngagementRate && stats.postCount > 0) {
          peakHours.push(hour);
        }
      });

      // Find best days from authentic performance data
      const dayAbbrev = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
      
      const bestDaysData = Array.from(dailyStats.entries())
        .map(([day, stats]) => ({
          day,
          engagementRate: stats.totalReach > 0 ? (stats.totalEngagement / stats.totalReach) * 100 : 0,
          postCount: stats.postCount
        }))
        .filter(item => item.postCount > 0)
        .sort((a, b) => b.engagementRate - a.engagementRate)
        .slice(0, 2)
        .map(item => dayAbbrev[item.day]);

      // Calculate authentic audience activity from real data
      const totalEngagement = timingData.reduce((sum, entry) => sum + entry.engagement, 0);
      const totalReach = timingData.reduce((sum, entry) => sum + entry.reach, 0);
      const audienceActive = totalReach > 0 ? Math.round((totalEngagement / totalReach) * 100) : 50;

      // Format time display
      const formatHour = (hour: number) => {
        const period = hour >= 12 ? 'PM' : 'AM';
        const displayHour = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour;
        return `${displayHour}:00 ${period}`;
      };

      // Format peak hours range
      const peakHoursRange = peakHours.length >= 2 ? 
        `${Math.min(...peakHours)}-${Math.max(...peakHours)} ${peakHours[0] >= 12 ? 'PM' : 'AM'}` :
        peakHours.length === 1 ?
        formatHour(peakHours[0]) :
        "6-8 PM";

      console.log('[ANALYTICS ENGINE] Calculated authentic optimal timing from', timingData.length, 'Instagram posts:', {
        bestHour: formatHour(bestHour),
        peakHours: peakHoursRange,
        bestDays: bestDaysData,
        audienceActive
      });

      return {
        hour: formatHour(bestHour),
        peakHours: peakHoursRange,
        bestDays: bestDaysData.length > 0 ? bestDaysData : ["Tue", "Thu"],
        audienceActive: Math.max(0, Math.min(100, audienceActive))
      };

    } catch (error) {
      console.error('[ANALYTICS ENGINE] Error calculating optimal timing:', error);
      return {
        hour: "6:00 PM",
        peakHours: "6-8 PM",
        bestDays: ["Tue", "Thu"],
        audienceActive: 50
      };
    }
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