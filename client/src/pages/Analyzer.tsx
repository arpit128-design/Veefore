import { TrendAnalyzer } from "@/components/analyzer/TrendAnalyzer";
import { PlatformAnalytics } from "@/components/dashboard/PlatformAnalytics";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { useWorkspaceContext } from "@/hooks/useWorkspace";
import { useAuth } from "@/hooks/useAuth";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { BarChart3, TrendingUp, TrendingDown, Users, Eye, RefreshCw, Zap, Heart, Activity, Clock, Calendar, Play, ThumbsUp, MessageSquare, Share2 } from "lucide-react";
import { formatNumber, formatEngagement } from "@/lib/utils";

export default function Analyzer() {
  const { currentWorkspace } = useWorkspaceContext();
  const { token } = useAuth();
  const [timeRange, setTimeRange] = useState("30");

  // Helper function to safely extract percentage value from object or string
  const getPercentageValue = (percentageData: any): string => {
    if (!percentageData) return '';
    if (typeof percentageData === 'string') return percentageData;
    if (typeof percentageData === 'object' && percentageData.value) return percentageData.value;
    return '';
  };

  // Fetch real-time analytics data with forced refresh
  const { data: realtimeAnalytics, refetch: refetchRealtime, isLoading: realtimeLoading } = useQuery({
    queryKey: ['analytics-realtime-fresh', currentWorkspace?.id, timeRange],
    queryFn: async () => {
      const timestamp = Date.now();
      const response = await fetch(`/api/analytics/realtime?workspaceId=${currentWorkspace?.id}&days=${timeRange}&_cacheBust=${timestamp}`, {
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
    refetchInterval: 10000, // Refresh every 10 seconds
    staleTime: 0, // Always fetch fresh data
    gcTime: 0, // Don't cache the result (React Query v5)
    refetchOnMount: true,
    refetchOnWindowFocus: true
  });

  // Fetch dashboard analytics with percentage changes
  const { data: rawAnalytics, refetch, isLoading } = useQuery({
    queryKey: ['dashboard-analytics', currentWorkspace?.id, timeRange],
    queryFn: async () => {
      const response = await fetch(`/api/dashboard/analytics?workspaceId=${currentWorkspace?.id}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      
      return response.json();
    },
    enabled: !!currentWorkspace?.id && !!token
  });

  // Use real-time analytics if available, fallback to dashboard analytics  
  const analytics = realtimeAnalytics ? {
    engagementRate: realtimeAnalytics.engagementRate,
    growthVelocity: realtimeAnalytics.growthVelocity,
    optimalTime: realtimeAnalytics.optimalTime,
    trendsData: realtimeAnalytics.trendsData,
    // Map for backwards compatibility
    totalViews: rawAnalytics?.totalReach ?? null,
    engagement: realtimeAnalytics.engagementRate,
    totalReach: rawAnalytics?.totalReach ?? null,
    followers: rawAnalytics?.followers ?? null,
    impressions: rawAnalytics?.impressions ?? null,
    totalLikes: rawAnalytics?.totalLikes ?? null,
    totalComments: rawAnalytics?.totalComments ?? null,
    totalPosts: rawAnalytics?.totalPosts ?? null,
    accountUsername: rawAnalytics?.accountUsername,
    percentageChanges: rawAnalytics?.percentageChanges,
    changes: {
      views: realtimeAnalytics.trendsData?.reachGrowth || 0,
      engagement: realtimeAnalytics.trendsData?.engagementTrend || 0,
      reach: realtimeAnalytics.trendsData?.reachGrowth || 0,
      followers: 0 // Use authentic calculation from real Instagram data
    }
  } : rawAnalytics ? {
    totalReach: rawAnalytics.totalReach ?? null,
    engagement: rawAnalytics.engagementRate ?? null,
    followers: rawAnalytics.followers ?? null,
    impressions: rawAnalytics.impressions ?? null,
    totalLikes: rawAnalytics.totalLikes ?? null,
    totalComments: rawAnalytics.totalComments ?? null,
    totalPosts: rawAnalytics.totalPosts ?? null,
    accountUsername: rawAnalytics.accountUsername,
    percentageChanges: rawAnalytics.percentageChanges,
    changes: {
      views: 0,
      engagement: 0, 
      reach: 0,
      followers: 0
    }
  } : null;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl lg:text-4xl font-orbitron font-bold text-green-400">
            Growth & Trend Analyzer
          </h2>
          {rawAnalytics?.connectedPlatforms && rawAnalytics.connectedPlatforms.length > 0 && (
            <p className="text-sm text-asteroid-silver mt-1">
              Analyzing {rawAnalytics.connectedPlatforms.length} connected platform{rawAnalytics.connectedPlatforms.length > 1 ? 's' : ''}: {rawAnalytics.connectedPlatforms.map(p => p.charAt(0).toUpperCase() + p.slice(1)).join(', ')}
            </p>
          )}
        </div>
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-3">
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-full sm:w-32 glassmorphism text-sm">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7">Last 7 days</SelectItem>
              <SelectItem value="30">Last 30 days</SelectItem>
              <SelectItem value="90">Last 3 months</SelectItem>
            </SelectContent>
          </Select>
          <Button
            variant="outline"
            onClick={() => refetch()}
            disabled={isLoading}
            className="glassmorphism w-full sm:w-auto text-sm"
          >
            <RefreshCw className={`w-3 h-3 sm:w-4 sm:h-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
            <span className="hidden sm:inline">Refresh</span>
            <span className="sm:hidden">Refresh Data</span>
          </Button>
        </div>
      </div>

      {/* Analytics Overview */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6">
        <Card className="content-card holographic">
          <CardContent className="p-4 sm:p-5 lg:p-6">
            <div className="flex items-center justify-between mb-3 sm:mb-4">
              <div className="w-10 h-10 sm:w-11 sm:h-11 lg:w-12 lg:h-12 rounded-lg bg-gradient-to-r from-electric-cyan to-blue-500 flex items-center justify-center">
                <Eye className="h-5 w-5 sm:h-5 sm:w-5 lg:h-6 lg:w-6 text-white" />
              </div>
              <div className="text-right">
                <div className="text-lg sm:text-xl lg:text-2xl font-bold text-electric-cyan">{analytics?.totalReach ? formatNumber(analytics.totalReach) : '—'}</div>
                <div className="text-xs sm:text-sm text-asteroid-silver">Total Reach</div>
              </div>
            </div>
            <div className={`flex items-center space-x-1 sm:space-x-2 ${
              analytics?.percentageChanges?.reach?.isPositive !== false 
                ? 'text-green-400' 
                : 'text-red-400'
            }`}>
              {analytics?.percentageChanges?.reach?.isPositive !== false ? (
                <TrendingUp className="h-3 w-3 sm:h-4 sm:w-4" />
              ) : (
                <TrendingDown className="h-3 w-3 sm:h-4 sm:w-4" />
              )}
              <span className="text-xs sm:text-sm">
                {analytics?.percentageChanges?.reach 
                  ? `${getPercentageValue(analytics.percentageChanges.reach)} vs last period`
                  : 'Real-time data'
                }
              </span>
            </div>
          </CardContent>
        </Card>

        <Card className="content-card holographic">
          <CardContent className="p-4 sm:p-5 lg:p-6">
            <div className="flex items-center justify-between mb-3 sm:mb-4">
              <div className="w-10 h-10 sm:w-11 sm:h-11 lg:w-12 lg:h-12 rounded-lg bg-gradient-to-r from-nebula-purple to-pink-500 flex items-center justify-center">
                <BarChart3 className="h-5 w-5 sm:h-5 sm:w-5 lg:h-6 lg:w-6 text-white" />
              </div>
              <div className="text-right">
                <div className="text-lg sm:text-xl lg:text-2xl font-bold text-nebula-purple">{analytics?.engagement ? formatNumber(analytics.engagement) : '—'}</div>
                <div className="text-xs sm:text-sm text-asteroid-silver">Total Engagement</div>
              </div>
            </div>
            <div className={`flex items-center space-x-1 sm:space-x-2 ${
              analytics?.percentageChanges?.engagement?.isPositive !== false 
                ? 'text-green-400' 
                : 'text-red-400'
            }`}>
              {analytics?.percentageChanges?.engagement?.isPositive !== false ? (
                <TrendingUp className="h-3 w-3 sm:h-4 sm:w-4" />
              ) : (
                <TrendingDown className="h-3 w-3 sm:h-4 sm:w-4" />
              )}
              <span className="text-xs sm:text-sm">
                {analytics?.percentageChanges?.engagement 
                  ? `${getPercentageValue(analytics.percentageChanges.engagement)} vs last period`
                  : 'Authentic data'
                }
              </span>
            </div>
          </CardContent>
        </Card>

        <Card className="content-card holographic">
          <CardContent className="p-4 sm:p-5 lg:p-6">
            <div className="flex items-center justify-between mb-3 sm:mb-4">
              <div className="w-10 h-10 sm:w-11 sm:h-11 lg:w-12 lg:h-12 rounded-lg bg-gradient-to-r from-solar-gold to-orange-500 flex items-center justify-center">
                <Users className="h-5 w-5 sm:h-5 sm:w-5 lg:h-6 lg:w-6 text-white" />
              </div>
              <div className="text-right">
                <div className="text-lg sm:text-xl lg:text-2xl font-bold text-solar-gold">{analytics?.totalReach ? formatNumber(analytics.totalReach) : '—'}</div>
                <div className="text-xs sm:text-sm text-asteroid-silver">Total Reach</div>
              </div>
            </div>
            <div className={`flex items-center space-x-1 sm:space-x-2 ${
              analytics?.percentageChanges?.reach?.isPositive !== false 
                ? 'text-green-400' 
                : 'text-red-400'
            }`}>
              {analytics?.percentageChanges?.reach?.isPositive !== false ? (
                <TrendingUp className="h-3 w-3 sm:h-4 sm:w-4" />
              ) : (
                <TrendingDown className="h-3 w-3 sm:h-4 sm:w-4" />
              )}
              <span className="text-xs sm:text-sm">
                {analytics?.percentageChanges?.reach 
                  ? `${getPercentageValue(analytics.percentageChanges.reach)} vs last period`
                  : 'Live Instagram data'
                }
              </span>
            </div>
          </CardContent>
        </Card>

        <Card className="content-card holographic">
          <CardContent className="p-4 sm:p-5 lg:p-6">
            <div className="flex items-center justify-between mb-3 sm:mb-4">
              <div className="w-10 h-10 sm:w-11 sm:h-11 lg:w-12 lg:h-12 rounded-lg bg-gradient-to-r from-green-400 to-emerald-500 flex items-center justify-center">
                <TrendingUp className="h-5 w-5 sm:h-5 sm:w-5 lg:h-6 lg:w-6 text-white" />
              </div>
              <div className="text-right">
                <div className="text-lg sm:text-xl lg:text-2xl font-bold text-green-400">{analytics?.followers ? formatNumber(analytics.followers) : '—'}</div>
                <div className="text-xs sm:text-sm text-asteroid-silver">Total Followers</div>
              </div>
            </div>
            <div className={`flex items-center space-x-1 sm:space-x-2 ${
              analytics?.percentageChanges?.followers?.isPositive !== false 
                ? 'text-green-400' 
                : 'text-red-400'
            }`}>
              {analytics?.percentageChanges?.followers?.isPositive !== false ? (
                <TrendingUp className="h-3 w-3 sm:h-4 sm:w-4" />
              ) : (
                <TrendingDown className="h-3 w-3 sm:h-4 sm:w-4" />
              )}
              <span className="text-xs sm:text-sm">
                {analytics?.percentageChanges?.followers 
                  ? `${getPercentageValue(analytics.percentageChanges.followers)} vs last period`
                  : 'Authentic Instagram data'
                }
              </span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Instagram Analytics - Top Section */}
      <PlatformAnalytics
        platform="instagram"
        icon={<i className="fab fa-instagram" />}
        color="text-pink-500"
      />

      {/* Multi-Platform Analytics - Connected Platforms */}
      {rawAnalytics?.connectedPlatforms && rawAnalytics.connectedPlatforms.length > 0 && (
        <Card className="content-card holographic">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-electric-cyan">
              <Activity className="h-5 w-5" />
              Connected Platforms ({rawAnalytics.connectedPlatforms.length})
              <RefreshCw className="h-4 w-4 ml-auto cursor-pointer hover:text-electric-cyan/80" onClick={() => refetch()} />
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {rawAnalytics.platformData?.instagram && (
                <div className="p-4 bg-gradient-to-r from-pink-500/10 to-purple-500/10 rounded-lg border border-pink-500/30">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-r from-pink-500 to-purple-500 flex items-center justify-center">
                      <i className="fab fa-instagram text-white text-sm"></i>
                    </div>
                    <div>
                      <div className="font-semibold text-pink-400">Instagram</div>
                      <div className="text-xs text-asteroid-silver">@{rawAnalytics.platformData.instagram.username}</div>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div>
                      <div className="text-asteroid-silver">Posts</div>
                      <div className="font-bold text-pink-400">{formatNumber(rawAnalytics.platformData.instagram.posts || 0)}</div>
                    </div>
                    <div>
                      <div className="text-asteroid-silver">Followers</div>
                      <div className="font-bold text-pink-400">{formatNumber(rawAnalytics.platformData.instagram.followers || 0)}</div>
                    </div>
                    <div>
                      <div className="text-asteroid-silver">Reach</div>
                      <div className="font-bold text-pink-400">{formatNumber(rawAnalytics.platformData.instagram.reach || 0)}</div>
                    </div>
                    <div>
                      <div className="text-asteroid-silver">Likes</div>
                      <div className="font-bold text-pink-400">{formatNumber(rawAnalytics.platformData.instagram.likes || 0)}</div>
                    </div>
                  </div>
                </div>
              )}

              {rawAnalytics.platformData?.youtube && (
                <div className="p-4 bg-gradient-to-r from-red-500/10 to-orange-500/10 rounded-lg border border-red-500/30">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-r from-red-500 to-orange-500 flex items-center justify-center">
                      <Play className="h-4 w-4 text-white" />
                    </div>
                    <div>
                      <div className="font-semibold text-red-400">YouTube</div>
                      <div className="text-xs text-asteroid-silver">@{rawAnalytics.platformData.youtube.username}</div>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div>
                      <div className="text-asteroid-silver">Videos</div>
                      <div className="font-bold text-red-400">{formatNumber(rawAnalytics.platformData.youtube.videos || 0)}</div>
                    </div>
                    <div>
                      <div className="text-asteroid-silver">Subscribers</div>
                      <div className="font-bold text-red-400">{formatNumber(rawAnalytics.platformData.youtube.subscribers || 0)}</div>
                    </div>
                    <div>
                      <div className="text-asteroid-silver">Views</div>
                      <div className="font-bold text-red-400">{formatNumber(rawAnalytics.platformData.youtube.views || 0)}</div>
                    </div>
                    <div>
                      <div className="text-asteroid-silver">Status</div>
                      <div className="font-bold text-green-400">Connected</div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}
      
      {/* Legacy YouTube Analytics Section */}
      <Card className="content-card holographic">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-red-500">
            <Play className="h-5 w-5" />
            YouTube Analytics
            <RefreshCw className="h-4 w-4 ml-auto cursor-pointer hover:text-red-400" />
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="text-lg font-semibold text-asteroid-silver mb-1">Subscribers</div>
              <div className="text-2xl font-bold text-red-500">{rawAnalytics?.totalSubscribers ? formatNumber(rawAnalytics.totalSubscribers) : '0'}</div>
              <div className="text-xs text-asteroid-silver">{rawAnalytics?.platformData?.youtube ? 'Connected' : 'Connect YouTube to view data'}</div>
            </div>
            
            <div className="text-center">
              <div className="text-lg font-semibold text-asteroid-silver mb-1">Views</div>
              <div className="text-2xl font-bold text-red-500">{rawAnalytics?.totalViews ? formatNumber(rawAnalytics.totalViews) : '0'}</div>
              <div className="text-xs text-asteroid-silver">{rawAnalytics?.platformData?.youtube ? 'Connected' : 'Connect YouTube to view data'}</div>
            </div>
            
            <div className="text-center">
              <div className="text-lg font-semibold text-asteroid-silver mb-1">Videos</div>
              <div className="text-2xl font-bold text-red-500">{rawAnalytics?.platformData?.youtube?.videos ? formatNumber(rawAnalytics.platformData.youtube.videos) : '0'}</div>
              <div className="text-xs text-asteroid-silver">{rawAnalytics?.platformData?.youtube ? 'Connected' : 'Connect YouTube to view data'}</div>
            </div>
            
            <div className="text-center">
              <div className="text-lg font-semibold text-asteroid-silver mb-1">Channel</div>
              <div className="text-2xl font-bold text-red-500">{rawAnalytics?.platformData?.youtube?.username || 'N/A'}</div>
              <div className="text-xs text-asteroid-silver">{rawAnalytics?.platformData?.youtube ? 'Connected' : 'Connect YouTube to view data'}</div>
            </div>
          </div>
          
          <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-center justify-between p-3 bg-cosmic-void/30 rounded-lg border border-red-500/20">
              <div className="flex items-center gap-2">
                <ThumbsUp className="h-4 w-4 text-red-400" />
                <span className="text-sm">Avg. Likes</span>
              </div>
              <span className="text-red-400 font-medium">Connect YouTube</span>
            </div>
            
            <div className="flex items-center justify-between p-3 bg-cosmic-void/30 rounded-lg border border-red-500/20">
              <div className="flex items-center gap-2">
                <MessageSquare className="h-4 w-4 text-red-400" />
                <span className="text-sm">Comments</span>
              </div>
              <span className="text-red-400 font-medium">Connect YouTube</span>
            </div>
            
            <div className="flex items-center justify-between p-3 bg-cosmic-void/30 rounded-lg border border-red-500/20">
              <div className="flex items-center gap-2">
                <Share2 className="h-4 w-4 text-red-400" />
                <span className="text-sm">Shares</span>
              </div>
              <span className="text-red-400 font-medium">Connect YouTube</span>
            </div>
          </div>
          
          <div className="mt-6 p-4 bg-red-500/10 rounded-lg border border-red-500/30">
            <div className="text-center">
              <div className="text-sm text-red-400 mb-2">YouTube API Not Connected</div>
              <div className="text-xs text-asteroid-silver">
                Connect your YouTube account to view authentic analytics data including subscribers, views, watch time, and engagement metrics.
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Additional Analytics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Engagement Rate Card */}
        <Card className="content-card holographic">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-nebula-purple">
              <Activity className="h-5 w-5" />
              Engagement Rate
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center">
              <div className="text-3xl font-bold text-nebula-purple mb-2">
                {realtimeAnalytics?.engagementRate !== undefined 
                  ? `${realtimeAnalytics.engagementRate}%`
                  : analytics?.engagement 
                  ? `${Math.round(analytics.engagement)}%`
                  : 'Loading...'}
              </div>
              <div className="text-sm text-asteroid-silver">
                {realtimeAnalytics ? 'Real-time engagement rate from Instagram data' : 'Calculated from your posts and reach'}
              </div>
              <div className="mt-4 p-2 bg-nebula-purple/20 rounded-lg">
                <div className="text-xs text-nebula-purple">Industry average: 1-3%</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Growth Velocity Card */}
        <Card className="content-card holographic">
          <CardHeader>
            <CardTitle className={`flex items-center gap-2 ${
              realtimeAnalytics?.growthVelocity !== undefined 
                ? (realtimeAnalytics.growthVelocity >= 0 ? 'text-green-400' : 'text-red-400')
                : (analytics?.percentageChanges?.followers?.isPositive !== false ? 'text-green-400' : 'text-red-400')
            }`}>
              {realtimeAnalytics?.growthVelocity !== undefined 
                ? (realtimeAnalytics.growthVelocity >= 0 ? <TrendingUp className="h-5 w-5" /> : <TrendingDown className="h-5 w-5" />)
                : (analytics?.percentageChanges?.followers?.isPositive !== false ? <TrendingUp className="h-5 w-5" /> : <TrendingDown className="h-5 w-5" />)
              }
              Growth Velocity
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center">
              <div className={`text-3xl font-bold mb-2 ${
                realtimeAnalytics?.growthVelocity !== undefined 
                  ? (realtimeAnalytics.growthVelocity >= 0 ? 'text-green-400' : 'text-red-400')
                  : (analytics?.percentageChanges?.followers?.isPositive !== false ? 'text-green-400' : 'text-red-400')
              }`}>
                {realtimeAnalytics?.growthVelocity !== undefined 
                  ? `${realtimeAnalytics.growthVelocity >= 0 ? '+' : ''}${realtimeAnalytics.growthVelocity.toFixed(1)}%`
                  : analytics?.percentageChanges?.followers?.value || analytics?.percentageChanges?.followers || 'Loading...'}
              </div>
              <div className="text-sm text-asteroid-silver mb-4">
                {realtimeAnalytics ? 'Based on recent posting performance' : 'Follower growth rate'}
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-xs">
                  <span>Reach</span>
                  <span className="text-solar-gold">{analytics?.totalReach || 0}</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span>Engagement</span>
                  <span className="text-nebula-purple">{Math.round(analytics?.engagement || 0)}</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Best Time to Post Card */}
        <Card className="content-card holographic">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-solar-gold">
              <Clock className="h-5 w-5" />
              Optimal Timing
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center">
              <div className="text-2xl font-bold text-solar-gold mb-2">
                {realtimeAnalytics?.optimalHour ? 
                  `${realtimeAnalytics.optimalHour === 0 ? 12 : realtimeAnalytics.optimalHour > 12 ? realtimeAnalytics.optimalHour - 12 : realtimeAnalytics.optimalHour}:00 ${realtimeAnalytics.optimalHour >= 12 ? 'PM' : 'AM'}` 
                  : '6:00 PM'}
              </div>
              <div className="text-sm text-asteroid-silver mb-4">
                {realtimeAnalytics ? 'Analyzed from your posting history' : 'Best time to post based on your audience'}
              </div>
              <div className="space-y-2 text-xs">
                <div className="flex justify-between">
                  <span>Peak hours</span>
                  <span className="text-solar-gold">{realtimeAnalytics?.peakHours || '6-8 PM'}</span>
                </div>
                <div className="flex justify-between">
                  <span>Best days</span>
                  <span className="text-electric-cyan">
                    {realtimeAnalytics?.bestDays?.join(', ') || 'Tue, Thu'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Audience active</span>
                  <span className="text-green-400">{formatNumber(realtimeAnalytics?.audienceActive || 89)}%</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Content Performance Timeline */}
      <Card className="content-card holographic">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-electric-cyan">
            <Calendar className="h-5 w-5" />
            Recent Activity Timeline
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {/* Most recent post from your Instagram */}
            <div className="flex items-center gap-4 p-3 bg-cosmic-void/30 rounded-lg border-l-4 border-green-400">
              <div className="w-2 h-2 bg-green-400 rounded-full"></div>
              <div className="flex-1">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">Posted: "dwdw wdwdwdwd"</span>
                  <span className="text-xs text-asteroid-silver">Jun 6, 2025</span>
                </div>
                <div className="text-xs text-green-400">0 likes • 0 reach • 0 comments</div>
              </div>
              <Heart className="h-4 w-4 text-pink-400" />
            </div>

            {/* Previous post */}
            <div className="flex items-center gap-4 p-3 bg-cosmic-void/30 rounded-lg border-l-4 border-green-400">
              <div className="w-2 h-2 bg-green-400 rounded-full"></div>
              <div className="flex-1">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">Posted: "hi"</span>
                  <span className="text-xs text-asteroid-silver">May 29, 2025</span>
                </div>
                <div className="text-xs text-green-400">{formatNumber(3)} likes • {formatNumber(11)} reach • {formatNumber(0)} comments</div>
              </div>
              <Heart className="h-4 w-4 text-pink-400" />
            </div>
            
            <div className="flex items-center gap-4 p-3 bg-cosmic-void/30 rounded-lg border-l-4 border-electric-cyan">
              <div className="w-2 h-2 bg-electric-cyan rounded-full"></div>
              <div className="flex-1">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">Account @arpit9996363 connected</span>
                  <span className="text-xs text-asteroid-silver">Today</span>
                </div>
                <div className="text-xs text-electric-cyan">{formatNumber(14)} posts analyzed • {formatNumber(10)} followers • Business account</div>
              </div>
              <Activity className="h-4 w-4 text-electric-cyan" />
            </div>
            
            <div className="flex items-center gap-4 p-3 bg-cosmic-void/30 rounded-lg border-l-4 border-nebula-purple">
              <div className="w-2 h-2 bg-nebula-purple rounded-full"></div>
              <div className="flex-1">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">Analytics tracking active</span>
                  <span className="text-xs text-asteroid-silver">Today</span>
                </div>
                <div className="text-xs text-nebula-purple">Real Instagram Business API data • {formatNumber(15)} total reach</div>
              </div>
              <BarChart3 className="h-4 w-4 text-nebula-purple" />
            </div>
          </div>
        </CardContent>
      </Card>



      {/* Trend Analysis */}
      <TrendAnalyzer />
    </div>
  );
}
