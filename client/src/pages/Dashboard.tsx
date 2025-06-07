import { StatsCard } from "@/components/dashboard/StatsCard";
import { PlatformAnalytics } from "@/components/dashboard/PlatformAnalytics";
import { ContentStudio } from "@/components/dashboard/ContentStudio";
import { DailySuggestions } from "@/components/dashboard/DailySuggestions";
import { ContentPerformance } from "@/components/dashboard/ContentPerformance";
import { useAuth } from "@/hooks/useAuth";
import { useWorkspaceContext } from "@/hooks/useWorkspace";
import { Eye, Heart, Users, TrendingUp, Calendar, Target, Zap, BarChart3, Globe, Sparkles } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";

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
    staleTime: 60000,
    gcTime: 600000,
    refetchInterval: 60000,
    retry: 1,
    retryDelay: 500,
    refetchOnWindowFocus: false,
    networkMode: 'always'
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
      <div className="min-h-screen bg-space-navy flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="animate-spin w-8 h-8 border-4 border-electric-cyan border-t-transparent rounded-full mx-auto"></div>
          <p className="text-slate-300">Loading your workspace...</p>
        </div>
      </div>
    );
  }

  console.log('[DASHBOARD DEBUG] Analytics data received:', analyticsData);

  // Map analytics data with proper fallbacks
  const mappedAnalytics = {
    totalViews: analyticsData?.totalReach || null,
    engagement: analyticsData?.engagementRate || null,
    newFollowers: analyticsData?.followers || null,
    contentScore: analyticsData?.totalPosts ? Math.min(100, (analyticsData.totalPosts * 15)) : null,
    platforms: analyticsData?.topPlatform ? [analyticsData.topPlatform] : []
  };

  console.log('[DASHBOARD DEBUG] Mapped analytics:', mappedAnalytics);

  const engagementDisplay = mappedAnalytics.engagement ? formatPercentage(mappedAnalytics.engagement) : null;
  const followersDisplay = mappedAnalytics.newFollowers ? formatNumber(mappedAnalytics.newFollowers) : null;

  console.log('[DASHBOARD DEBUG] Formatted engagement:', engagementDisplay);
  console.log('[DASHBOARD DEBUG] Formatted followers:', followersDisplay);

  return (
    <div className="min-h-screen bg-gradient-to-br from-space-navy via-space-black to-space-navy text-white relative overflow-hidden">
      {/* Minimal Animated Stars Background */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="stars-minimal"></div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 p-6 space-y-8">
        {/* Header Section */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-electric-cyan to-solar-gold flex items-center justify-center">
                <BarChart3 className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-4xl font-bold bg-gradient-to-r from-white via-electric-cyan to-solar-gold bg-clip-text text-transparent">
                  Mission Control
                </h1>
                <p className="text-slate-300 text-lg">
                  Welcome back, <span className="text-electric-cyan font-semibold">{user?.displayName || user?.username}</span>
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <Badge variant="outline" className="bg-space-black/50 border-electric-cyan/30 text-electric-cyan px-4 py-2">
              <Globe className="w-4 h-4 mr-2" />
              Live Data
            </Badge>
            <div className="text-right">
              <p className="text-sm text-slate-400">Current Time</p>
              <p className="text-xl font-mono text-electric-cyan">{currentTime} UTC</p>
            </div>
          </div>
        </div>

        {/* 3D Analytics Grid */}
        <div className="perspective-dashboard grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Total Views Card */}
          <Card className="card-3d bg-gradient-to-br from-space-black/80 to-space-navy/60 border-slate-700/50 backdrop-blur-sm glass-morphism neon-border hover:scale-105 transition-all duration-300 transform-gpu animate-float-3d">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center transform rotate-3">
                  <Eye className="w-6 h-6 text-white" />
                </div>
                <Badge className="bg-blue-500/20 text-blue-300 border-blue-500/30">
                  {mappedAnalytics.totalViews ? "Active data" : "Syncing..."}
                </Badge>
              </div>
              <div className="space-y-2">
                <h3 className="text-2xl font-bold text-white">
                  {mappedAnalytics.totalViews ? formatNumber(mappedAnalytics.totalViews) : "---"}
                </h3>
                <p className="text-sm text-slate-400">Total Views</p>
                <div className="flex items-center gap-2 text-xs">
                  <TrendingUp className="w-3 h-3 text-green-400" />
                  <span className="text-green-400">+12% vs last week</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Engagement Card */}
          <Card className="card-3d bg-gradient-to-br from-space-black/80 to-space-navy/60 border-slate-700/50 backdrop-blur-sm glass-morphism hover:scale-105 transition-all duration-300 transform-gpu animate-float-3d" style={{ animationDelay: '0.5s' }}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-pink-500 to-rose-600 flex items-center justify-center transform -rotate-3">
                  <Heart className="w-6 h-6 text-white" />
                </div>
                <Badge className="bg-pink-500/20 text-pink-300 border-pink-500/30">
                  {mappedAnalytics.engagement ? "Active data" : "Syncing..."}
                </Badge>
              </div>
              <div className="space-y-2">
                <h3 className="text-2xl font-bold text-white">
                  {engagementDisplay || "---"}
                </h3>
                <p className="text-sm text-slate-400">Engagement</p>
                <div className="flex items-center gap-2 text-xs">
                  <TrendingUp className="w-3 h-3 text-green-400" />
                  <span className="text-green-400">+25% vs last week</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Followers Card */}
          <Card className="card-3d bg-gradient-to-br from-space-black/80 to-space-navy/60 border-slate-700/50 backdrop-blur-sm glass-morphism hover:scale-105 transition-all duration-300 transform-gpu animate-float-3d" style={{ animationDelay: '1s' }}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center transform rotate-2">
                  <Users className="w-6 h-6 text-white" />
                </div>
                <Badge className="bg-purple-500/20 text-purple-300 border-purple-500/30">
                  {mappedAnalytics.newFollowers ? "Active data" : "Syncing..."}
                </Badge>
              </div>
              <div className="space-y-2">
                <h3 className="text-2xl font-bold text-white">
                  {followersDisplay || "---"}
                </h3>
                <p className="text-sm text-slate-400">New Followers</p>
                <div className="flex items-center gap-2 text-xs">
                  <TrendingUp className="w-3 h-3 text-green-400" />
                  <span className="text-green-400">Growing steadily</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Content Score Card */}
          <Card className="card-3d bg-gradient-to-br from-space-black/80 to-space-navy/60 border-slate-700/50 backdrop-blur-sm glass-morphism hover:scale-105 transition-all duration-300 transform-gpu animate-float-3d" style={{ animationDelay: '1.5s' }}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-500 to-green-600 flex items-center justify-center transform -rotate-2">
                  <Target className="w-6 h-6 text-white" />
                </div>
                <Badge className="bg-emerald-500/20 text-emerald-300 border-emerald-500/30">
                  {mappedAnalytics.contentScore ? "90% Score" : "Calculating..."}
                </Badge>
              </div>
              <div className="space-y-2">
                <h3 className="text-2xl font-bold text-white">
                  {mappedAnalytics.contentScore ? `${mappedAnalytics.contentScore}%` : "---"}
                </h3>
                <p className="text-sm text-slate-400">Content Score</p>
                {mappedAnalytics.contentScore && (
                  <Progress 
                    value={mappedAnalytics.contentScore} 
                    className="h-2 bg-slate-700"
                  />
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Advanced Analytics Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Platform Analytics - Enhanced */}
          <div className="lg:col-span-2">
            <Card className="bg-gradient-to-br from-space-black/80 to-space-navy/60 border-slate-700/50 backdrop-blur-sm">
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-xl font-semibold text-white flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-electric-cyan/20 flex items-center justify-center">
                      <BarChart3 className="w-4 h-4 text-electric-cyan" />
                    </div>
                    Platform Analytics
                  </CardTitle>
                  <Badge variant="outline" className="bg-electric-cyan/10 border-electric-cyan/30 text-electric-cyan">
                    Real-time
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <PlatformAnalytics 
                  platform="instagram" 
                  icon={<Users className="w-4 h-4" />} 
                  color="#E4405F" 
                />
              </CardContent>
            </Card>
          </div>

          {/* Quick Actions Panel */}
          <Card className="bg-gradient-to-br from-space-black/80 to-space-navy/60 border-slate-700/50 backdrop-blur-sm">
            <CardHeader className="pb-4">
              <CardTitle className="text-xl font-semibold text-white flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-solar-gold/20 flex items-center justify-center">
                  <Zap className="w-4 h-4 text-solar-gold" />
                </div>
                Quick Actions
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-3">
                <button className="p-4 rounded-xl bg-gradient-to-r from-electric-cyan/10 to-electric-cyan/5 border border-electric-cyan/20 hover:border-electric-cyan/40 transition-all duration-200 text-left group">
                  <div className="flex items-center gap-3">
                    <Calendar className="w-5 h-5 text-electric-cyan group-hover:scale-110 transition-transform" />
                    <div>
                      <p className="font-semibold text-white">Schedule Content</p>
                      <p className="text-xs text-slate-400">Plan your next posts</p>
                    </div>
                  </div>
                </button>
                
                <button className="p-4 rounded-xl bg-gradient-to-r from-solar-gold/10 to-solar-gold/5 border border-solar-gold/20 hover:border-solar-gold/40 transition-all duration-200 text-left group">
                  <div className="flex items-center gap-3">
                    <Sparkles className="w-5 h-5 text-solar-gold group-hover:scale-110 transition-transform" />
                    <div>
                      <p className="font-semibold text-white">AI Suggestions</p>
                      <p className="text-xs text-slate-400">Get content ideas</p>
                    </div>
                  </div>
                </button>
                
                <button className="p-4 rounded-xl bg-gradient-to-r from-purple-500/10 to-purple-500/5 border border-purple-500/20 hover:border-purple-500/40 transition-all duration-200 text-left group">
                  <div className="flex items-center gap-3">
                    <TrendingUp className="w-5 h-5 text-purple-400 group-hover:scale-110 transition-transform" />
                    <div>
                      <p className="font-semibold text-white">Analyze Trends</p>
                      <p className="text-xs text-slate-400">View detailed insights</p>
                    </div>
                  </div>
                </button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Content & Suggestions Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Daily Suggestions */}
          <Card className="bg-gradient-to-br from-space-black/80 to-space-navy/60 border-slate-700/50 backdrop-blur-sm">
            <CardHeader className="pb-4">
              <CardTitle className="text-xl font-semibold text-white flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-solar-gold/20 flex items-center justify-center">
                  <Sparkles className="w-4 h-4 text-solar-gold" />
                </div>
                AI Recommendations
              </CardTitle>
            </CardHeader>
            <CardContent>
              <DailySuggestions />
            </CardContent>
          </Card>

          {/* Content Performance */}
          <Card className="bg-gradient-to-br from-space-black/80 to-space-navy/60 border-slate-700/50 backdrop-blur-sm">
            <CardHeader className="pb-4">
              <CardTitle className="text-xl font-semibold text-white flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-emerald-500/20 flex items-center justify-center">
                  <TrendingUp className="w-4 h-4 text-emerald-400" />
                </div>
                Content Performance
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ContentPerformance />
            </CardContent>
          </Card>
        </div>

        {/* Content Studio */}
        <Card className="bg-gradient-to-br from-space-black/80 to-space-navy/60 border-slate-700/50 backdrop-blur-sm">
          <CardHeader className="pb-4">
            <CardTitle className="text-xl font-semibold text-white flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-electric-cyan/20 flex items-center justify-center">
                <Target className="w-4 h-4 text-electric-cyan" />
              </div>
              Content Studio
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ContentStudio />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}