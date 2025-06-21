/**
 * Multi-platform engagement rate calculation utility
 * Supports Instagram, YouTube, X/Twitter, and TikTok with platform-specific logic
 */

export interface EngagementMetrics {
  likes: number;
  comments: number;
  shares?: number;
  saves?: number;
  views?: number;
  followers?: number;
  subscribers?: number;
  impressions?: number;
}

export interface EngagementResult {
  rate: number;
  formattedRate: string;
  platform: string;
  contentType?: string;
}

/**
 * Calculate engagement rate for Instagram content
 */
export function calculateInstagramEngagement(
  metrics: EngagementMetrics,
  contentType: 'post' | 'reel' = 'post'
): EngagementResult {
  const { likes = 0, comments = 0, shares = 0, saves = 0, views = 0, followers = 1 } = metrics;
  
  const totalEngagements = likes + comments + shares + saves;
  let base: number;
  
  if (contentType === 'reel') {
    // Instagram Reel: (likes + comments + shares + saves) / views * 100
    base = views > 0 ? views : 1;
  } else {
    // Instagram Post: (likes + comments + shares + saves) / followers * 100
    base = followers > 0 ? followers : 1;
  }
  
  const rate = (totalEngagements / base) * 100;
  
  return {
    rate: parseFloat(rate.toFixed(2)),
    formattedRate: `${rate.toFixed(2)}%`,
    platform: 'instagram',
    contentType
  };
}

/**
 * Calculate engagement rate for YouTube content
 */
export function calculateYouTubeEngagement(
  metrics: EngagementMetrics,
  contentType: 'video' | 'channel' = 'video'
): EngagementResult {
  const { likes = 0, comments = 0, shares = 0, views = 0, subscribers = 1 } = metrics;
  
  const totalEngagements = likes + comments + shares;
  let base: number;
  
  if (contentType === 'video') {
    // YouTube Video: (likes + comments + shares) / views * 100
    base = views > 0 ? views : 1;
  } else {
    // YouTube Channel: (likes + comments + shares) / subscribers * 100
    base = subscribers > 0 ? subscribers : 1;
  }
  
  const rate = (totalEngagements / base) * 100;
  
  return {
    rate: parseFloat(rate.toFixed(2)),
    formattedRate: `${rate.toFixed(2)}%`,
    platform: 'youtube',
    contentType
  };
}

/**
 * Calculate engagement rate for X/Twitter content
 */
export function calculateTwitterEngagement(metrics: EngagementMetrics): EngagementResult {
  const { likes = 0, comments = 0, shares = 0, impressions = 1 } = metrics;
  
  // X/Twitter: (likes + comments + shares) / impressions * 100
  const totalEngagements = likes + comments + shares;
  const base = impressions > 0 ? impressions : 1;
  const rate = (totalEngagements / base) * 100;
  
  return {
    rate: parseFloat(rate.toFixed(2)),
    formattedRate: `${rate.toFixed(2)}%`,
    platform: 'twitter'
  };
}

/**
 * Calculate engagement rate for TikTok content
 */
export function calculateTikTokEngagement(metrics: EngagementMetrics): EngagementResult {
  const { likes = 0, comments = 0, shares = 0, saves = 0, views = 1 } = metrics;
  
  // TikTok: (likes + comments + shares + saves) / views * 100
  const totalEngagements = likes + comments + shares + saves;
  const base = views > 0 ? views : 1;
  const rate = (totalEngagements / base) * 100;
  
  return {
    rate: parseFloat(rate.toFixed(2)),
    formattedRate: `${rate.toFixed(2)}%`,
    platform: 'tiktok'
  };
}

/**
 * Universal engagement rate calculator
 * Automatically determines the appropriate calculation based on platform
 */
export function calculateEngagementRate(
  platform: string,
  metrics: EngagementMetrics,
  contentType?: string
): EngagementResult {
  const normalizedPlatform = platform.toLowerCase();
  
  switch (normalizedPlatform) {
    case 'instagram':
      return calculateInstagramEngagement(
        metrics,
        contentType as 'post' | 'reel' || 'post'
      );
    
    case 'youtube':
      return calculateYouTubeEngagement(
        metrics,
        contentType as 'video' | 'channel' || 'video'
      );
    
    case 'twitter':
    case 'x':
      return calculateTwitterEngagement(metrics);
    
    case 'tiktok':
      return calculateTikTokEngagement(metrics);
    
    default:
      // Fallback calculation for unknown platforms
      const { likes = 0, comments = 0, shares = 0, followers = 1 } = metrics;
      const totalEngagements = likes + comments + shares;
      const rate = (totalEngagements / followers) * 100;
      
      return {
        rate: parseFloat(rate.toFixed(2)),
        formattedRate: `${rate.toFixed(2)}%`,
        platform: normalizedPlatform
      };
  }
}

/**
 * Calculate aggregated engagement rate across multiple platforms
 */
export function calculateCrossPllatformEngagement(
  platformMetrics: Array<{
    platform: string;
    metrics: EngagementMetrics;
    contentType?: string;
  }>
): EngagementResult {
  if (platformMetrics.length === 0) {
    return {
      rate: 0,
      formattedRate: '0.00%',
      platform: 'combined'
    };
  }
  
  const engagementRates = platformMetrics.map(({ platform, metrics, contentType }) =>
    calculateEngagementRate(platform, metrics, contentType)
  );
  
  // Calculate weighted average based on follower/subscriber count
  let totalWeightedEngagement = 0;
  let totalWeight = 0;
  
  engagementRates.forEach((result, index) => {
    const { metrics } = platformMetrics[index];
    const weight = Math.max(
      metrics.followers || 0,
      metrics.subscribers || 0,
      metrics.views || 0,
      1
    );
    
    totalWeightedEngagement += result.rate * weight;
    totalWeight += weight;
  });
  
  const averageRate = totalWeight > 0 ? totalWeightedEngagement / totalWeight : 0;
  
  return {
    rate: parseFloat(averageRate.toFixed(2)),
    formattedRate: `${averageRate.toFixed(2)}%`,
    platform: 'combined'
  };
}

/**
 * Helper function to format engagement rate for display
 */
export function formatEngagementRate(rate: number): string {
  return `${rate.toFixed(2)}%`;
}

/**
 * Determine engagement quality based on rate and platform
 */
export function getEngagementQuality(rate: number, platform: string): {
  quality: 'excellent' | 'good' | 'average' | 'poor';
  color: string;
  description: string;
} {
  const normalizedPlatform = platform.toLowerCase();
  
  // Platform-specific benchmarks
  const benchmarks = {
    instagram: { excellent: 6, good: 3, average: 1 },
    youtube: { excellent: 10, good: 5, average: 2 },
    twitter: { excellent: 3, good: 1.5, average: 0.5 },
    tiktok: { excellent: 10, good: 5, average: 2 }
  };
  
  const benchmark = benchmarks[normalizedPlatform as keyof typeof benchmarks] || benchmarks.instagram;
  
  if (rate >= benchmark.excellent) {
    return {
      quality: 'excellent',
      color: 'text-green-400',
      description: 'Exceptional engagement'
    };
  } else if (rate >= benchmark.good) {
    return {
      quality: 'good',
      color: 'text-blue-400',
      description: 'Above average engagement'
    };
  } else if (rate >= benchmark.average) {
    return {
      quality: 'average',
      color: 'text-yellow-400',
      description: 'Average engagement'
    };
  } else {
    return {
      quality: 'poor',
      color: 'text-red-400',
      description: 'Below average engagement'
    };
  }
}