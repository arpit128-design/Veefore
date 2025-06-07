import { StatsCard } from "@/components/dashboard/StatsCard";
import { PlatformAnalytics } from "@/components/dashboard/PlatformAnalytics";
import { ContentStudio } from "@/components/dashboard/ContentStudio";
import { DailySuggestions } from "@/components/dashboard/DailySuggestions";
import { ContentPerformance } from "@/components/dashboard/ContentPerformance";
import { useAuth } from "@/hooks/useAuth";
import { useWorkspaceContext } from "@/hooks/useWorkspace";
import { Eye, Heart, Users, TrendingUp } from "lucide-react";
import { useQuery } from "@tanstack/react-query";

export default function Dashboard() {
  const { user, token } = useAuth();
  const { currentWorkspace } = useWorkspaceContext();

  // Fetch real analytics data with immediate cache serving
  const { data: analyticsData, isLoading: analyticsLoading, error } = useQuery({
    queryKey: ['/api/dashboard/analytics', currentWorkspace?.id],
    queryFn: () => fetch(`/api/dashboard/analytics?workspaceId=${currentWorkspace?.id}`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    }).then(res => res.json()),
    enabled: !!user && !!currentWorkspace && !!token,
    staleTime: 60000, // Data is fresh for 1 minute
    gcTime: 600000, // Keep in cache for 10 minutes
    refetchInterval: 60000, // Refetch every minute
    retry: 1, // Reduced retry for faster response
    retryDelay: 500,
    refetchOnWindowFocus: false, // Prevent unnecessary refetches
    networkMode: 'always' // Always try to fetch even with cached data
  });

  const currentTime = new Date().toLocaleTimeString('en-US', {
    hour12: false,
    timeZone: 'UTC',
    hour: '2-digit',
    minute: '2-digit'
  });

  // Format numbers for display with null safety
  const formatNumber = (num: number | null) => {
    if (num === null) return null;
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
    return num.toString();
  };

  const formatPercentage = (num: number) => `${num}%`;

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
  
  const analytics = {
    totalViews: hasValidData ? (rawData?.totalReach || rawData?.impressions || 0) : null,
    engagement: hasValidData ? (rawData?.engagementRate || 0) : null,
    newFollowers: hasValidData ? (rawData?.followers || 0) : null,
    contentScore: 85, // Static for now
    platforms: hasValidData && rawData?.accountUsername ? ['instagram'] : []
  };
  
  // Create proper data mapping for Instagram metrics
  const instagramData = {
    followers: hasValidData ? (rawData?.followers || 0) : null,
    engagementRate: hasValidData ? (rawData?.engagementRate || 0) : null,
    impressions: hasValidData ? (rawData?.impressions || 0) : null,
    totalPosts: hasValidData ? (rawData?.totalPosts || 0) : null,
    totalReach: hasValidData ? (rawData?.totalReach || 0) : null,
    totalLikes: hasValidData ? (rawData?.totalLikes || 0) : null,
    totalComments: hasValidData ? (rawData?.totalComments || 0) : null,
    mediaCount: hasValidData ? (rawData?.mediaCount || rawData?.totalPosts || 0) : null,
    accountUsername: rawData?.accountUsername
  };
  
  // Show loading message when data is null/empty
  const isDataLoading = analyticsLoading || !hasValidData;
  
  console.log('[DASHBOARD DEBUG] Mapped analytics:', analytics);
  console.log('[DASHBOARD DEBUG] Formatted engagement:', formatNumber(analytics.engagement));
  console.log('[DASHBOARD DEBUG] Formatted followers:', formatNumber(analytics.newFollowers));

  return (
    <div className="space-y-4 md:space-y-8 w-full max-w-full overflow-x-hidden">
      {/* Welcome Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl md:text-2xl lg:text-4xl font-orbitron font-bold neon-text text-electric-cyan mb-2">
            Mission Control
          </h2>
          <p className="text-asteroid-silver text-sm md:text-base">
            Welcome back, <span className="text-solar-gold font-medium">{user?.displayName || user?.username}</span>
          </p>
        </div>
        <div className="text-left md:text-right">
          <div className="text-xs md:text-sm text-asteroid-silver">Current Time</div>
          <div className="text-lg md:text-xl font-mono text-electric-cyan">{currentTime} UTC</div>
        </div>
      </div>

      {/* Quick Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard
          title="Total Views"
          value={analytics.totalViews !== null ? formatNumber(analytics.totalViews) : null}
          change={analytics.totalViews !== null && analytics.totalViews > 0 ? { value: "Active data", isPositive: true } : undefined}
          icon={<Eye className="text-xl" />}
          gradient="from-electric-cyan to-nebula-purple"
          isLoading={isDataLoading}
        />
        <StatsCard
          title="Engagement"
          value={analytics.engagement !== null ? formatNumber(analytics.engagement) : null}
          change={analytics.engagement !== null && analytics.engagement > 0 ? { value: "Active data", isPositive: true } : undefined}
          icon={<Heart className="text-xl" />}
          gradient="from-solar-gold to-red-500"
          isLoading={isDataLoading}
        />
        <StatsCard
          title="New Followers"
          value={analytics.newFollowers !== null ? formatNumber(analytics.newFollowers) : null}
          change={analytics.newFollowers !== null && analytics.newFollowers > 0 ? { value: "Active data", isPositive: true } : undefined}
          icon={<Users className="text-xl" />}
          gradient="from-nebula-purple to-pink-500"
          isLoading={isDataLoading}
        />
        <StatsCard
          title="Content Score"
          value={formatPercentage(analytics.contentScore)}
          change={{ value: "Active data", isPositive: true }}
          icon={<TrendingUp className="text-xl" />}
          gradient="from-green-400 to-blue-500"
          isLoading={false}
        />
      </div>

      {/* Platform Analytics Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8">
        {/* Instagram Analytics - Live Data */}
        <div className="content-card holographic">
          <div className="p-4 md:p-6">
            <div className="flex items-center justify-between mb-4 md:mb-6">
              <div className="flex items-center space-x-2 md:space-x-3">
                <i className="fab fa-instagram text-xl md:text-2xl text-pink-500" />
                <h3 className="text-lg md:text-xl font-orbitron font-semibold">Instagram Analytics</h3>
              </div>
              {isDataLoading && (
                <div className="w-5 h-5 md:w-6 md:h-6 border-2 border-electric-cyan border-t-transparent rounded-full animate-spin opacity-50" />
              )}
            </div>
            
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-asteroid-silver">Followers</span>
                <span className="text-xl font-bold text-white">{instagramData.followers ?? '—'}</span>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-asteroid-silver">Avg. Engagement</span>
                <span className="text-xl font-bold text-green-400">
                  {instagramData.engagementRate !== null ? `${instagramData.engagementRate.toFixed(1)}%` : '—'}
                </span>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-asteroid-silver">Impressions</span>
                <span className="text-xl font-bold text-white">{instagramData.impressions ?? '—'}</span>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-asteroid-silver">Total Posts</span>
                <span className="text-xl font-bold text-white">{instagramData.totalPosts ?? '—'}</span>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-asteroid-silver">Total Likes</span>
                <span className="text-xl font-bold text-white">{instagramData.totalLikes ?? '—'}</span>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-asteroid-silver">Reach</span>
                <span className="text-xl font-bold text-white">{instagramData.totalReach ?? '—'}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Twitter Analytics */}
        <div className="content-card holographic">
          <div className="p-4 md:p-6">
            <div className="flex items-center justify-between mb-4 md:mb-6">
              <div className="flex items-center space-x-2 md:space-x-3">
                <i className="fab fa-x-twitter text-xl md:text-2xl text-white" />
                <h3 className="text-lg md:text-xl font-orbitron font-semibold">Twitter Analytics</h3>
              </div>
              {/* No loading spinner for Twitter as no data is connected */}
            </div>
            
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-asteroid-silver">Followers</span>
                <span className="text-xl font-bold text-white">0</span>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-asteroid-silver">Avg. Engagement</span>
                <span className="text-xl font-bold text-green-400">0%</span>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-asteroid-silver">Impressions</span>
                <span className="text-xl font-bold text-white">0</span>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-asteroid-silver">Reach (7d)</span>
                <span className="text-xl font-bold text-white">0</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* AI Content Studio Quick Access */}
      <ContentStudio />

      {/* Daily AI Suggestions */}
      <DailySuggestions />

      {/* Recent Content Performance */}
      <ContentPerformance />
    </div>
  );
}