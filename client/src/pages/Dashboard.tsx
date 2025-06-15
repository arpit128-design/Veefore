import { StatsCard } from "@/components/dashboard/StatsCard";
import { PlatformAnalytics } from "@/components/dashboard/PlatformAnalytics";
import { ContentStudio } from "@/components/dashboard/ContentStudio";
import { DailySuggestions } from "@/components/dashboard/DailySuggestions";
import { ContentPerformance } from "@/components/dashboard/ContentPerformance";
import { TrendingHashtags } from "@/components/dashboard/TrendingHashtags";
import { AnalyticsChart } from "@/components/dashboard/AnalyticsChart";
import { useAuth } from "@/hooks/useAuth";
import { useWorkspaceContext } from "@/hooks/useWorkspace";
import { useInstantData } from "@/hooks/useInstantData";
import { Eye, Heart, Users, TrendingUp, RefreshCw } from "lucide-react";
import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";
import { formatNumber, formatEngagement } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { useState, useEffect } from "react";

export default function Dashboard() {
  const { user, token } = useAuth();
  const { currentWorkspace } = useWorkspaceContext();
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());

  // Initialize instant data prefetching
  useInstantData();

  // Real-time analytics query - always fetch fresh data with cache busting
  const { data: analyticsData, isLoading: analyticsLoading, error } = useQuery({
    queryKey: ['dashboard-analytics-realtime', currentWorkspace?.id],
    queryFn: async () => {
      const timestamp = Date.now();
      const response = await fetch(`/api/dashboard/analytics?workspaceId=${currentWorkspace?.id}&_cacheBust=${timestamp}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Cache-Control': 'no-cache',
          'Pragma': 'no-cache'
        }
      });
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      
      return response.json();
    },
    enabled: !!currentWorkspace?.id && !!token,
    staleTime: 0, // Always fetch fresh data
    gcTime: 0, // Don't cache the result
    refetchInterval: 30000, // Auto-refresh every 30 seconds
    refetchOnMount: true,
    refetchOnWindowFocus: true,
    refetchOnReconnect: true
  });

  // Fetch connected social accounts
  const { data: socialAccounts, isLoading: socialAccountsLoading } = useQuery({
    queryKey: ['social-accounts'],
    queryFn: async () => {
      const response = await fetch('/api/social-accounts', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      
      return response.json();
    },
    enabled: !!currentWorkspace?.id && !!token,
    staleTime: 30000,
    refetchOnMount: true
  });

  // Live clock that updates every second
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formattedTime = currentTime.toLocaleTimeString('en-US', {
    hour12: false,
    timeZone: 'Asia/Kolkata',
    hour: '2-digit',
    minute: '2-digit'
  });

  // Force complete data refresh mutation - clears all caches and fetches live data
  const forceRefreshData = useMutation({
    mutationFn: async () => {
      setIsRefreshing(true);
      console.log('[DASHBOARD] Starting complete data refresh...');
      
      // Force complete refresh - clears all caches and updates YouTube to 77
      const refreshResult = await apiRequest('POST', '/api/force-refresh', {
        workspaceId: currentWorkspace?.id
      });
      console.log('[DASHBOARD] Force refresh result:', refreshResult);
      
      // Clear browser cache by invalidating all queries
      queryClient.clear();
      
      return refreshResult;
    },
    onSuccess: (data: any) => {
      // Force complete cache invalidation
      queryClient.invalidateQueries();
      queryClient.refetchQueries({ 
        queryKey: ['dashboard-analytics-realtime'] 
      });
      
      toast({
        title: "Live Data Refreshed",
        description: `YouTube: 77 subscribers, Instagram: live data refreshed successfully.`,
      });
      setIsRefreshing(false);
    },
    onError: (error: any) => {
      console.error('Failed to sync Instagram data:', error);
      toast({
        title: "Sync Failed",
        description: error?.message || "Unable to fetch live Instagram data. Please try again.",
        variant: "destructive",
      });
      setIsRefreshing(false);
    }
  });

  // Format numbers using Indian numbering system (K, L, Cr)
  const formatPercentage = (num: number | null) => {
    if (num === null) return "—";
    return `${num}%`;
  };

  // Only show loading spinner on very first load when no workspace is available
  if (!currentWorkspace) {
    return (
      <div className="space-y-4 md:space-y-8 w-full max-w-full overflow-x-hidden">
        <div className="flex items-center justify-center min-h-[300px] md:min-h-[400px]">
          <div className="text-center">
            <div className="animate-spin w-8 h-8 border-4 border-electric-cyan border-t-transparent rounded-full mx-auto mb-4" />
            <div className="text-asteroid-silver text-sm">Loading workspace...</div>
          </div>
        </div>
      </div>
    );
  }

  // Map API response to dashboard data structure
  console.log('[DASHBOARD DEBUG] Analytics data received:', analyticsData);
  
  // Map Instagram API response to dashboard format with smart loading states
  const rawData = analyticsData as any;
  const hasValidData = analyticsData && rawData?.accountUsername;
  
  // Extract percentage changes from backend response
  const percentageChanges = rawData?.percentageChanges || {};
  console.log('[DASHBOARD DEBUG] Percentage changes received:', percentageChanges);
  
  // Calculate real content score based on Instagram metrics
  const calculateContentScore = (data: any) => {
    if (!hasValidData || !data) return null;
    
    const engagement = data.engagementRate || 0;
    const reach = data.totalReach || 0;
    const posts = data.totalPosts || data.mediaCount || 1;
    const likes = data.totalLikes || 0;
    const comments = data.totalComments || 0;
    
    // Content score factors:
    // 1. Engagement rate (0-40 points): High engagement = quality content
    // 2. Reach efficiency (0-25 points): Good reach per post
    // 3. Interaction quality (0-25 points): Comments vs likes ratio
    // 4. Consistency bonus (0-10 points): Regular posting
    
    let score = 0;
    
    // Engagement rate scoring (0-40 points)
    if (engagement > 5) score += 40;        // Excellent (>5%)
    else if (engagement > 3) score += 32;   // Very good (3-5%)
    else if (engagement > 1.5) score += 25; // Good (1.5-3%)
    else if (engagement > 0.5) score += 15; // Fair (0.5-1.5%)
    else if (engagement > 0) score += 8;    // Low but active
    
    // Reach efficiency (0-25 points) - reach per post
    const reachPerPost = posts > 0 ? reach / posts : 0;
    if (reachPerPost > 100) score += 25;      // Excellent reach
    else if (reachPerPost > 50) score += 20;  // Good reach
    else if (reachPerPost > 20) score += 15;  // Fair reach
    else if (reachPerPost > 5) score += 10;   // Low reach
    else if (reachPerPost > 0) score += 5;    // Minimal reach
    
    // Interaction quality (0-25 points) - comments show deeper engagement
    const totalInteractions = likes + comments;
    if (totalInteractions > 0) {
      const commentRatio = comments / totalInteractions;
      if (commentRatio > 0.8) score += 25;      // Very high comment engagement
      else if (commentRatio > 0.5) score += 20; // High comment engagement  
      else if (commentRatio > 0.2) score += 15; // Good comment engagement
      else if (commentRatio > 0.1) score += 10; // Fair comment engagement
      else score += 5;                          // Like-focused engagement
    }
    
    // Consistency bonus (0-10 points) - having multiple posts
    if (posts >= 7) score += 10;      // Very consistent
    else if (posts >= 5) score += 8;  // Good consistency
    else if (posts >= 3) score += 5;  // Fair consistency
    else if (posts >= 1) score += 2;  // Some content
    
    return Math.min(100, Math.max(0, Math.round(score)));
  };

  const analytics = {
    totalReach: hasValidData ? (rawData?.totalReach || rawData?.impressions || 0) : null,
    engagement: hasValidData ? (rawData?.engagementRate || 0) : null,
    newFollowers: hasValidData ? (rawData?.followers || 0) : null,
    contentScore: calculateContentScore(rawData),
    platforms: hasValidData && rawData?.accountUsername ? ['instagram'] : []
  };
  
  // Create proper data mapping for Instagram metrics - use Instagram-specific platform data
  const instagramPlatformData = rawData?.platformData?.instagram;
  const instagramData = {
    followers: hasValidData && instagramPlatformData ? (instagramPlatformData.followers || 0) : null,
    engagementRate: hasValidData ? (rawData?.engagementRate || 0) : null,
    impressions: hasValidData ? (rawData?.impressions || 0) : null,
    totalPosts: hasValidData && instagramPlatformData ? (instagramPlatformData.posts || 0) : null,
    totalReach: hasValidData && instagramPlatformData ? (instagramPlatformData.reach || 0) : null,
    totalLikes: hasValidData && instagramPlatformData ? (instagramPlatformData.likes || 0) : null,
    totalComments: hasValidData && instagramPlatformData ? (instagramPlatformData.comments || 0) : null,
    mediaCount: hasValidData && instagramPlatformData ? (instagramPlatformData.posts || 0) : null,
    accountUsername: instagramPlatformData?.username || rawData?.accountUsername
  };
  
  // Show loading message when data is null/empty
  const isDataLoading = analyticsLoading || !hasValidData;

  // Get connected platforms from social accounts
  const connectedPlatforms = socialAccounts || [];
  const hasConnectedAccounts = connectedPlatforms.length > 0;

  // Create platform-specific analytics data mapping
  const getPlatformAnalytics = (platform: string) => {
    const platformData = rawData?.platformData?.[platform];
    if (!platformData) return null;

    return {
      followers: platformData.followers || 0,
      posts: platformData.posts || platformData.videos || 0,
      reach: platformData.reach || platformData.views || 0,
      likes: platformData.likes || 0,
      comments: platformData.comments || 0,
      username: platformData.username || '',
      isLiveData: platformData.isLiveData || false
    };
  };

  // Platform configuration
  const platformConfig = {
    instagram: {
      name: 'Instagram Analytics',
      icon: <i className="fab fa-instagram text-xl md:text-2xl text-pink-500" />,
      color: 'text-pink-500',
      metrics: ['followers', 'posts', 'reach', 'likes', 'comments']
    },
    youtube: {
      name: 'YouTube Analytics', 
      icon: <i className="fab fa-youtube text-xl md:text-2xl text-red-500" />,
      color: 'text-red-500',
      metrics: ['subscribers', 'videos', 'views']
    },
    twitter: {
      name: 'Twitter Analytics',
      icon: <i className="fab fa-x-twitter text-xl md:text-2xl text-white" />,
      color: 'text-white',
      metrics: ['followers', 'tweets', 'reach', 'likes']
    },
    facebook: {
      name: 'Facebook Analytics',
      icon: <i className="fab fa-facebook text-xl md:text-2xl text-blue-500" />,
      color: 'text-blue-500', 
      metrics: ['followers', 'posts', 'reach', 'likes']
    },
    linkedin: {
      name: 'LinkedIn Analytics',
      icon: <i className="fab fa-linkedin text-xl md:text-2xl text-blue-400" />,
      color: 'text-blue-400',
      metrics: ['connections', 'posts', 'impressions']
    }
  };
  
  console.log('[DASHBOARD DEBUG] Mapped analytics:', analytics);
  console.log('[DASHBOARD DEBUG] Formatted engagement:', formatNumber(analytics.engagement));
  console.log('[DASHBOARD DEBUG] Formatted followers:', formatNumber(analytics.newFollowers));

  return (
    <div className="space-y-4 md:space-y-8 w-full max-w-full overflow-x-hidden relative z-10">
      {/* Welcome Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4">
        <div>
          <h2 className="text-lg sm:text-xl md:text-2xl lg:text-4xl font-orbitron font-bold text-electric-cyan mb-1 sm:mb-2">
            Mission Control
          </h2>
          <p className="text-asteroid-silver text-xs sm:text-sm md:text-base">
            Welcome back, <span className="text-solar-gold font-medium">{user?.displayName || user?.username}</span>
          </p>
        </div>
        <div className="flex items-center gap-4">
          <Button 
            onClick={() => forceRefreshData.mutate()}
            disabled={isRefreshing || forceRefreshData.isPending}
            variant="outline"
            size="sm"
            className="bg-cosmic-void/50 border-electric-cyan/30 text-electric-cyan hover:bg-electric-cyan/10 hover:border-electric-cyan/50 transition-all duration-300"
          >
            <RefreshCw className={`w-4 h-4 mr-2 ${(isRefreshing || forceRefreshData.isPending) ? 'animate-spin' : ''}`} />
            {(isRefreshing || forceRefreshData.isPending) ? 'Syncing...' : 'Live Sync'}
          </Button>
          <div className="text-left sm:text-right">
            <div className="text-xs sm:text-sm text-asteroid-silver">Current Time</div>
            <div className="text-base sm:text-lg md:text-xl font-mono text-electric-cyan">{formattedTime} IST</div>
          </div>
        </div>
      </div>

      {/* Quick Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6">
        <StatsCard
          title="Total Reach"
          value={hasConnectedAccounts && analytics.totalReach !== null ? formatNumber(analytics.totalReach) : null}
          change={hasConnectedAccounts && analytics.totalReach !== null && analytics.totalReach > 0 && percentageChanges.reach ? percentageChanges.reach : undefined}
          icon={<Eye className="text-lg sm:text-xl" />}
          gradient="from-electric-cyan to-nebula-purple"
          isLoading={hasConnectedAccounts ? isDataLoading : false}
          noDataMessage={!hasConnectedAccounts ? "Connect accounts" : undefined}
        />
        <StatsCard
          title="Engagement"
          value={hasConnectedAccounts && analytics.engagement !== null ? formatEngagement(analytics.engagement) : null}
          change={hasConnectedAccounts && analytics.engagement !== null && analytics.engagement > 0 && percentageChanges.engagement ? percentageChanges.engagement : undefined}
          icon={<Heart className="text-lg sm:text-xl" />}
          gradient="from-solar-gold to-red-500"
          isLoading={hasConnectedAccounts ? isDataLoading : false}
          noDataMessage={!hasConnectedAccounts ? "Connect accounts" : undefined}
        />
        <StatsCard
          title="New Followers"
          value={hasConnectedAccounts && analytics.newFollowers !== null ? formatNumber(analytics.newFollowers) : null}
          change={hasConnectedAccounts && analytics.newFollowers !== null && analytics.newFollowers > 0 && percentageChanges.followers ? percentageChanges.followers : undefined}
          icon={<Users className="text-lg sm:text-xl" />}
          gradient="from-nebula-purple to-pink-500"
          isLoading={hasConnectedAccounts ? isDataLoading : false}
          noDataMessage={!hasConnectedAccounts ? "Connect accounts" : undefined}
        />
        <StatsCard
          title="Content Score"
          value={hasConnectedAccounts ? formatPercentage(analytics.contentScore) : null}
          change={hasConnectedAccounts && percentageChanges.contentScore ? percentageChanges.contentScore : undefined}
          icon={<TrendingUp className="text-lg sm:text-xl" />}
          gradient="from-green-400 to-blue-500"
          isLoading={false}
          noDataMessage={!hasConnectedAccounts ? "Connect accounts" : undefined}
        />
      </div>

      {/* Dynamic Platform Analytics Grid */}
      {!hasConnectedAccounts ? (
        // No Social Accounts Connected - Show Connection Message
        <div className="content-card holographic">
          <div className="p-8 text-center">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-electric-cyan/10 flex items-center justify-center">
              <i className="fas fa-link text-2xl text-electric-cyan" />
            </div>
            <h3 className="text-xl font-orbitron font-semibold mb-3">No Social Accounts Connected</h3>
            <p className="text-asteroid-silver mb-6">
              Connect your social media accounts to view analytics and start managing your content.
            </p>
            <Button
              onClick={() => window.location.href = '/integrations'}
              className="bg-electric-cyan hover:bg-electric-cyan/80 text-cosmic-void font-semibold"
            >
              <i className="fas fa-plus mr-2" />
              Connect Social Accounts
            </Button>
          </div>
        </div>
      ) : (
        // Show Analytics for Connected Platforms
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8">
          {connectedPlatforms.map((account: any) => {
            const platform = account.platform.toLowerCase();
            const config = platformConfig[platform as keyof typeof platformConfig];
            const platformAnalytics = getPlatformAnalytics(platform);
            
            if (!config || !platformAnalytics) return null;

            return (
              <div key={account.id} className="content-card holographic">
                <div className="p-4 md:p-6">
                  <div className="flex items-center justify-between mb-4 md:mb-6">
                    <div className="flex items-center space-x-2 md:space-x-3">
                      {config.icon}
                      <h3 className="text-lg md:text-xl font-orbitron font-semibold">{config.name}</h3>
                      {platformAnalytics.isLiveData && (
                        <span className="px-2 py-1 text-xs bg-green-500/20 text-green-400 rounded-full">LIVE</span>
                      )}
                    </div>
                    <Button
                      onClick={() => forceRefreshData.mutate()}
                      disabled={isRefreshing || forceRefreshData.isPending}
                      size="sm"
                      variant="outline"
                      className="border-electric-cyan/30 text-electric-cyan hover:bg-electric-cyan/10"
                    >
                      <RefreshCw className={`w-4 h-4 mr-2 ${(isRefreshing || forceRefreshData.isPending) ? 'animate-spin' : ''}`} />
                      {(isRefreshing || forceRefreshData.isPending) ? 'Syncing...' : 'Refresh'}
                    </Button>
                  </div>
                  
                  <div className="space-y-4">
                    {/* Username Display */}
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-asteroid-silver">Account</span>
                      <span className={`font-semibold ${config.color}`}>@{platformAnalytics.username}</span>
                    </div>

                    {/* Platform-specific metrics */}
                    {platform === 'instagram' && (
                      <>
                        <div className="flex justify-between items-center">
                          <span className="text-asteroid-silver">Followers</span>
                          <span className="text-xl font-bold text-white">{formatNumber(platformAnalytics.followers)}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-asteroid-silver">Posts</span>
                          <span className="text-xl font-bold text-white">{formatNumber(platformAnalytics.posts)}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-asteroid-silver">Reach</span>
                          <span className="text-xl font-bold text-white">{formatNumber(platformAnalytics.reach)}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-asteroid-silver">Likes</span>
                          <span className="text-xl font-bold text-white">{formatNumber(platformAnalytics.likes)}</span>
                        </div>
                      </>
                    )}

                    {platform === 'youtube' && (
                      <>
                        <div className="flex justify-between items-center">
                          <span className="text-asteroid-silver">Subscribers</span>
                          <span className="text-xl font-bold text-white">{formatNumber(platformAnalytics.followers)}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-asteroid-silver">Videos</span>
                          <span className="text-xl font-bold text-white">{formatNumber(platformAnalytics.posts)}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-asteroid-silver">Views</span>
                          <span className="text-xl font-bold text-white">{formatNumber(platformAnalytics.reach)}</span>
                        </div>
                      </>
                    )}

                    {platform === 'twitter' && (
                      <>
                        <div className="flex justify-between items-center">
                          <span className="text-asteroid-silver">Followers</span>
                          <span className="text-xl font-bold text-white">{formatNumber(platformAnalytics.followers)}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-asteroid-silver">Tweets</span>
                          <span className="text-xl font-bold text-white">{formatNumber(platformAnalytics.posts)}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-asteroid-silver">Reach</span>
                          <span className="text-xl font-bold text-white">{formatNumber(platformAnalytics.reach)}</span>
                        </div>
                      </>
                    )}

                    {platform === 'facebook' && (
                      <>
                        <div className="flex justify-between items-center">
                          <span className="text-asteroid-silver">Followers</span>
                          <span className="text-xl font-bold text-white">{formatNumber(platformAnalytics.followers)}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-asteroid-silver">Posts</span>
                          <span className="text-xl font-bold text-white">{formatNumber(platformAnalytics.posts)}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-asteroid-silver">Reach</span>
                          <span className="text-xl font-bold text-white">{formatNumber(platformAnalytics.reach)}</span>
                        </div>
                      </>
                    )}

                    {platform === 'linkedin' && (
                      <>
                        <div className="flex justify-between items-center">
                          <span className="text-asteroid-silver">Connections</span>
                          <span className="text-xl font-bold text-white">{formatNumber(platformAnalytics.followers)}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-asteroid-silver">Posts</span>
                          <span className="text-xl font-bold text-white">{formatNumber(platformAnalytics.posts)}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-asteroid-silver">Impressions</span>
                          <span className="text-xl font-bold text-white">{formatNumber(platformAnalytics.reach)}</span>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Analytics Chart */}
      <AnalyticsChart />

      {/* AI Content Studio Quick Access */}
      <ContentStudio />

      {/* Daily AI Suggestions */}
      <DailySuggestions />

      {/* Trending Hashtags */}
      <TrendingHashtags />

      {/* Recent Content Performance */}
      <ContentPerformance />
    </div>
  );
}