import { IStorage } from './storage';

interface CachedDashboardData {
  totalPosts: number;
  totalReach: number;
  engagementRate: number;
  topPlatform: string;
  followers: number;
  impressions: number;
  accountUsername: string;
  totalLikes: number;
  totalComments: number;
  mediaCount: number;
  lastUpdated: Date;
}

export class DashboardCache {
  private cache = new Map<string, CachedDashboardData>();
  private readonly CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

  constructor(private storage: IStorage) {}

  // Get cached data immediately or return minimal data
  async getCachedData(workspaceId: string): Promise<CachedDashboardData | null> {
    const cached = this.cache.get(workspaceId);
    
    if (cached && this.isCacheValid(cached.lastUpdated)) {
      console.log('[CACHE] Returning valid cached dashboard data');
      return cached;
    }

    // If cache exists but expired, still return it for instant response
    if (cached) {
      console.log('[CACHE] Returning expired cache for instant response');
      return cached;
    }

    // Try to get data from database quickly
    try {
      console.log('[CACHE] Attempting quick database lookup');
      const accounts = await this.storage.getSocialAccountsByWorkspace(workspaceId);
      const instagramAccount = accounts.find(acc => acc.platform === 'instagram' && acc.accessToken);
      
      if (instagramAccount) {
        const account = instagramAccount as any;
        const dashboardData: CachedDashboardData = {
          totalPosts: account.mediaCount || 0,
          totalReach: account.totalReach || 0,
          engagementRate: account.avgEngagement || 0,
          topPlatform: 'instagram',
          followers: account.followersCount || 0,
          impressions: account.totalReach || 0,
          accountUsername: account.username || '',
          totalLikes: account.totalLikes || 0,
          totalComments: account.totalComments || 0,
          mediaCount: account.mediaCount || 0,
          lastUpdated: new Date()
        };

        this.cache.set(workspaceId, dashboardData);
        console.log('[CACHE] Created new cache from database data');
        return dashboardData;
      }
    } catch (error) {
      console.log('[CACHE] Database lookup failed, returning placeholder for instant response');
    }

    // Return placeholder data for instant response
    const placeholderData = this.getPlaceholderData();
    this.cache.set(workspaceId, placeholderData);
    return placeholderData;
  }

  // Update cache with fresh data
  updateCache(workspaceId: string, data: Partial<CachedDashboardData>): void {
    const existing = this.cache.get(workspaceId) || {
      totalPosts: 0,
      totalReach: 0,
      engagementRate: 0,
      topPlatform: 'instagram',
      followers: 0,
      impressions: 0,
      accountUsername: '',
      totalLikes: 0,
      totalComments: 0,
      mediaCount: 0,
      lastUpdated: new Date()
    };

    const updated = {
      ...existing,
      ...data,
      lastUpdated: new Date()
    };

    this.cache.set(workspaceId, updated);
    console.log('[CACHE] Updated dashboard cache for workspace:', workspaceId);
  }

  // Check if cache is still valid
  private isCacheValid(lastUpdated: Date): boolean {
    const now = new Date().getTime();
    const cacheTime = lastUpdated.getTime();
    return (now - cacheTime) < this.CACHE_DURATION;
  }

  // Clear cache for workspace
  clearCache(workspaceId: string): void {
    this.cache.delete(workspaceId);
  }

  // Get minimal placeholder data for immediate response
  getPlaceholderData(): CachedDashboardData {
    return {
      totalPosts: 0,
      totalReach: 0,
      engagementRate: 0,
      topPlatform: 'none',
      followers: 0,
      impressions: 0,
      accountUsername: '',
      totalLikes: 0,
      totalComments: 0,
      mediaCount: 0,
      lastUpdated: new Date()
    };
  }
}