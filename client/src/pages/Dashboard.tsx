import { StatsCard } from "@/components/dashboard/StatsCard";
import { PlatformAnalytics } from "@/components/dashboard/PlatformAnalytics";
import { ContentStudio } from "@/components/dashboard/ContentStudio";
import { DailySuggestions } from "@/components/dashboard/DailySuggestions";
import { ContentPerformance } from "@/components/dashboard/ContentPerformance";
import { TrendingHashtags } from "@/components/dashboard/TrendingHashtags";
import { ChatPerformance } from "@/components/dashboard/ChatPerformance";
import { useAuth } from "@/hooks/useAuth";
import { useWorkspaceContext } from "@/hooks/useWorkspace";
import { Eye, Heart, Users, TrendingUp, RefreshCw } from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { formatNumber, formatEngagement } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { useState } from "react";

export default function Dashboard() {
  const { user, token } = useAuth();
  const { currentWorkspace } = useWorkspaceContext();
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const [isRefreshing, setIsRefreshing] = useState(false);

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

  // Enhanced Instagram data refresh mutation
  const refreshInstagramData = useMutation({
    mutationFn: async () => {
      setIsRefreshing(true);
      // Force refresh analytics which triggers Instagram sync
      await apiRequest('GET', `/api/dashboard/analytics?workspaceId=${currentWorkspace?.id}&forceRefresh=true`);
      return true;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ 
        queryKey: ['/api/dashboard/analytics', currentWorkspace?.id] 
      });
      toast({
        title: "Instagram Data Refreshed",
        description: "Your reach data has been updated with latest Instagram metrics",
      });
      setIsRefreshing(false);
    },
    onError: (error) => {
      console.error('Failed to refresh Instagram data:', error);
      toast({
        title: "Refresh Failed",
        description: "Unable to update Instagram data. Please try again.",
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
    <div className="space-y-4 md:space-y-8 w-full max-w-full overflow-x-hidden relative z-10">
      {/* Welcome Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl md:text-2xl lg:text-4xl font-orbitron font-bold text-electric-cyan mb-2">
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
          title="Total Reach"
          value={analytics.totalReach !== null ? formatNumber(analytics.totalReach) : null}
          change={analytics.totalReach !== null && analytics.totalReach > 0 ? { value: "Active data", isPositive: true } : undefined}
          icon={<Eye className="text-xl" />}
          gradient="from-electric-cyan to-nebula-purple"
          isLoading={isDataLoading}
        />
        <StatsCard
          title="Engagement"
          value={analytics.engagement !== null ? formatEngagement(analytics.engagement) : null}
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
              <Button
                onClick={() => refreshInstagramData.mutate()}
                disabled={isRefreshing || refreshInstagramData.isPending}
                size="sm"
                variant="outline"
                className="border-electric-cyan/30 text-electric-cyan hover:bg-electric-cyan/10"
              >
                <RefreshCw className={`w-4 h-4 mr-2 ${(isRefreshing || refreshInstagramData.isPending) ? 'animate-spin' : ''}`} />
                {(isRefreshing || refreshInstagramData.isPending) ? 'Syncing...' : 'Refresh Data'}
              </Button>
            </div>
            {isDataLoading && (
              <div className="w-5 h-5 md:w-6 md:h-6 border-2 border-electric-cyan border-t-transparent rounded-full animate-spin opacity-50" />
            )}
            
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-asteroid-silver">Followers</span>
                <span className="text-xl font-bold text-white">{instagramData.followers !== null ? formatNumber(instagramData.followers) : '—'}</span>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-asteroid-silver">Avg. Engagement</span>
                <span className="text-xl font-bold text-green-400">
                  {instagramData.engagementRate !== null ? formatEngagement(instagramData.engagementRate) : '—'}
                </span>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-asteroid-silver">Impressions</span>
                <span className="text-xl font-bold text-white">{instagramData.impressions !== null ? formatNumber(instagramData.impressions) : '—'}</span>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-asteroid-silver">Total Posts</span>
                <span className="text-xl font-bold text-white">{instagramData.totalPosts !== null ? formatNumber(instagramData.totalPosts) : '—'}</span>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-asteroid-silver">Total Likes</span>
                <span className="text-xl font-bold text-white">{instagramData.totalLikes !== null ? formatNumber(instagramData.totalLikes) : '—'}</span>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-asteroid-silver">Reach</span>
                <span className="text-xl font-bold text-white">{instagramData.totalReach !== null ? formatNumber(instagramData.totalReach) : '—'}</span>
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

      {/* Chat Performance */}
      <ChatPerformance />

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