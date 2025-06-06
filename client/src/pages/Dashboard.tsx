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

  // Fetch real analytics data with better caching - filtered by workspace
  const { data: analyticsData, isLoading: analyticsLoading, error } = useQuery({
    queryKey: ['/api/dashboard/analytics', currentWorkspace?.id],
    queryFn: () => fetch(`/api/dashboard/analytics?workspaceId=${currentWorkspace?.id}`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    }).then(res => res.json()),
    enabled: !!user && !!currentWorkspace && !!token,
    staleTime: 30000, // Data is fresh for 30 seconds
    gcTime: 300000, // Keep in cache for 5 minutes (TanStack Query v5)
    refetchInterval: 30000, // Refetch every 30 seconds
    retry: 2,
    retryDelay: 1000
  });

  const currentTime = new Date().toLocaleTimeString('en-US', {
    hour12: false,
    timeZone: 'UTC',
    hour: '2-digit',
    minute: '2-digit'
  });

  // Format numbers for display
  const formatNumber = (num: number) => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
    return num.toString();
  };

  const formatPercentage = (num: number) => `${num}%`;

  // Show loading spinner only on true initial load
  if (analyticsLoading && !analyticsData) {
    return (
      <div className="space-y-8">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="animate-spin w-8 h-8 border-4 border-electric-cyan border-t-transparent rounded-full" />
        </div>
      </div>
    );
  }

  // Don't render dashboard if we don't have data yet
  if (!analyticsData) {
    return (
      <div className="space-y-8">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="animate-spin w-8 h-8 border-4 border-electric-cyan border-t-transparent rounded-full" />
        </div>
      </div>
    );
  }
  
  // Use previous data if available while new data loads
  if (!analyticsData && analyticsLoading) {
    return (
      <div className="space-y-8">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-asteroid-silver">Loading your Instagram metrics...</div>
        </div>
      </div>
    );
  }

  // Map API response to dashboard data structure
  console.log('[DASHBOARD DEBUG] Analytics data received:', analyticsData);
  
  // Map Instagram API response to dashboard format
  const rawData = analyticsData as any;
  const analytics = {
    totalViews: rawData?.totalReach || rawData?.impressions || 0,
    engagement: rawData?.engagementRate || 0,
    newFollowers: rawData?.followers || 0,
    contentScore: 85, // Static for now
    platforms: rawData?.accountUsername ? ['instagram'] : []
  };
  
  // Create proper data mapping for Instagram metrics
  const instagramData = {
    followers: rawData?.followers || 0,
    engagementRate: rawData?.engagementRate || 0,
    impressions: rawData?.impressions || 0,
    totalPosts: rawData?.totalPosts || 0,
    totalReach: rawData?.totalReach || 0,
    totalLikes: rawData?.totalLikes || 0,
    totalComments: rawData?.totalComments || 0,
    mediaCount: rawData?.mediaCount || rawData?.totalPosts || 0,
    accountUsername: rawData?.accountUsername
  };
  
  // Show loading message when data is null/empty
  const isDataEmpty = !analyticsData || (analytics.engagement === 0 && analytics.newFollowers === 0 && analytics.platforms.length === 0);
  
  console.log('[DASHBOARD DEBUG] Mapped analytics:', analytics);
  console.log('[DASHBOARD DEBUG] Formatted engagement:', formatNumber(analytics.engagement));
  console.log('[DASHBOARD DEBUG] Formatted followers:', formatNumber(analytics.newFollowers));

  return (
    <div className="space-y-8">
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
          value={formatNumber(analytics.totalViews)}
          change={{ value: analytics.totalViews > 0 ? "Active data" : "Building insights", isPositive: analytics.totalViews >= 0 }}
          icon={<Eye className="text-xl" />}
          gradient="from-electric-cyan to-nebula-purple"
        />
        <StatsCard
          title="Engagement"
          value={formatNumber(analytics.engagement)}
          change={{ value: analytics.engagement > 0 ? "Active data" : "No data yet", isPositive: analytics.engagement > 0 }}
          icon={<Heart className="text-xl" />}
          gradient="from-solar-gold to-red-500"
        />
        <StatsCard
          title="New Followers"
          value={formatNumber(analytics.newFollowers)}
          change={{ value: analytics.newFollowers > 0 ? "Active data" : "No data yet", isPositive: analytics.newFollowers > 0 }}
          icon={<Users className="text-xl" />}
          gradient="from-nebula-purple to-pink-500"
        />
        <StatsCard
          title="Content Score"
          value={formatPercentage(analytics.contentScore)}
          change={{ value: analytics.contentScore > 0 ? "Active data" : "No data yet", isPositive: analytics.contentScore > 0 }}
          icon={<TrendingUp className="text-xl" />}
          gradient="from-green-400 to-blue-500"
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
              <div className="w-5 h-5 md:w-6 md:h-6 border-2 border-electric-cyan border-t-transparent rounded-full animate-spin opacity-50" />
            </div>
            
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-asteroid-silver">Followers</span>
                <span className="text-xl font-bold text-white">{instagramData.followers}</span>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-asteroid-silver">Avg. Engagement</span>
                <span className="text-xl font-bold text-green-400">{instagramData.engagementRate.toFixed(1)}%</span>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-asteroid-silver">Impressions</span>
                <span className="text-xl font-bold text-white">{instagramData.impressions}</span>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-asteroid-silver">Total Posts</span>
                <span className="text-xl font-bold text-white">{instagramData.totalPosts}</span>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-asteroid-silver">Total Likes</span>
                <span className="text-xl font-bold text-white">{instagramData.totalLikes}</span>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-asteroid-silver">Reach</span>
                <span className="text-xl font-bold text-white">{instagramData.totalReach}</span>
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
              <div className="w-5 h-5 md:w-6 md:h-6 border-2 border-electric-cyan border-t-transparent rounded-full animate-spin opacity-50" />
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