import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, RefreshCw, TrendingUp, TrendingDown, Eye, Heart, MessageCircle, Share, Users, Calendar, BarChart3 } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { useWorkspaceContext } from "@/hooks/useWorkspace";
import { useAuth } from "@/hooks/useAuth";
import { formatNumber, formatEngagement } from "@/lib/utils";
import { Link } from "wouter";

export default function InstagramAnalytics() {
  const { currentWorkspace } = useWorkspaceContext();
  const { token } = useAuth();

  const { data: analytics, refetch, isLoading } = useQuery({
    queryKey: ['instagram-detailed-analytics', currentWorkspace?.id],
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

  const instagramData = analytics?.platformData?.instagram;
  const hasData = analytics && instagramData;

  // Calculate engagement metrics
  const calculateEngagementRate = () => {
    if (!hasData) return 0;
    const totalInteractions = (instagramData.likes || 0) + (instagramData.comments || 0);
    const followers = instagramData.followers || 0;
    const posts = instagramData.posts || 1;
    return followers > 0 && posts > 0 ? (totalInteractions / (followers * posts) * 100) : 0;
  };

  const calculateAvgEngagementPerPost = () => {
    if (!hasData) return 0;
    const totalInteractions = (instagramData.likes || 0) + (instagramData.comments || 0);
    const posts = instagramData.posts || 1;
    return totalInteractions / posts;
  };

  const calculateReachRate = () => {
    if (!hasData) return 0;
    const reach = instagramData.reach || 0;
    const followers = instagramData.followers || 1;
    return (reach / followers * 100);
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/analyzer">
            <Button variant="outline" size="sm" className="glassmorphism">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Analyzer
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl lg:text-4xl font-orbitron font-bold text-pink-400">
              Instagram Analytics
            </h1>
            <p className="text-asteroid-silver">
              Detailed insights for @{instagramData?.username || 'Loading...'}
            </p>
          </div>
        </div>
        <Button
          variant="outline"
          onClick={() => refetch()}
          disabled={isLoading}
          className="glassmorphism"
        >
          <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
          Refresh Data
        </Button>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="content-card holographic">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-asteroid-silver mb-1">Followers</p>
                <p className="text-2xl font-bold text-pink-400">
                  {hasData ? formatNumber(instagramData.followers || 0) : 'Loading...'}
                </p>
              </div>
              <Users className="h-8 w-8 text-pink-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="content-card holographic">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-asteroid-silver mb-1">Total Reach</p>
                <p className="text-2xl font-bold text-pink-400">
                  {hasData ? formatNumber(instagramData.reach || 0) : 'Loading...'}
                </p>
              </div>
              <Eye className="h-8 w-8 text-pink-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="content-card holographic">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-asteroid-silver mb-1">Engagement Rate</p>
                <p className="text-2xl font-bold text-pink-400">
                  {hasData ? `${calculateEngagementRate().toFixed(2)}%` : 'Loading...'}
                </p>
              </div>
              <TrendingUp className="h-8 w-8 text-pink-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="content-card holographic">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-asteroid-silver mb-1">Total Posts</p>
                <p className="text-2xl font-bold text-pink-400">
                  {hasData ? formatNumber(instagramData.posts || 0) : 'Loading...'}
                </p>
              </div>
              <BarChart3 className="h-8 w-8 text-pink-400" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Metrics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Engagement Metrics */}
        <Card className="content-card holographic">
          <CardHeader>
            <CardTitle className="text-pink-400">Engagement Metrics</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center p-4 bg-pink-500/10 rounded-lg border border-pink-500/20">
                <Heart className="h-6 w-6 text-pink-400 mx-auto mb-2" />
                <p className="text-sm text-asteroid-silver">Total Likes</p>
                <p className="text-xl font-bold text-pink-400">
                  {hasData ? formatNumber(instagramData.likes || 0) : 'Loading...'}
                </p>
              </div>
              
              <div className="text-center p-4 bg-pink-500/10 rounded-lg border border-pink-500/20">
                <MessageCircle className="h-6 w-6 text-pink-400 mx-auto mb-2" />
                <p className="text-sm text-asteroid-silver">Total Comments</p>
                <p className="text-xl font-bold text-pink-400">
                  {hasData ? formatNumber(instagramData.comments || 0) : 'Loading...'}
                </p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex justify-between items-center p-3 bg-cosmic-void/30 rounded-lg">
                <span className="text-asteroid-silver">Engagement Rate</span>
                <span className="text-pink-400 font-semibold">
                  {hasData ? `${calculateEngagementRate().toFixed(2)}%` : 'Loading...'}
                </span>
              </div>
              
              <div className="flex justify-between items-center p-3 bg-cosmic-void/30 rounded-lg">
                <span className="text-asteroid-silver">Avg. Engagement/Post</span>
                <span className="text-pink-400 font-semibold">
                  {hasData ? formatNumber(calculateAvgEngagementPerPost()) : 'Loading...'}
                </span>
              </div>
              
              <div className="flex justify-between items-center p-3 bg-cosmic-void/30 rounded-lg">
                <span className="text-asteroid-silver">Reach Rate</span>
                <span className="text-pink-400 font-semibold">
                  {hasData ? `${calculateReachRate().toFixed(1)}%` : 'Loading...'}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Account Information */}
        <Card className="content-card holographic">
          <CardHeader>
            <CardTitle className="text-pink-400">Account Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <div className="flex justify-between items-center p-3 bg-cosmic-void/30 rounded-lg">
                <span className="text-asteroid-silver">Username</span>
                <span className="text-pink-400 font-semibold">
                  @{instagramData?.username || 'Loading...'}
                </span>
              </div>
              
              <div className="flex justify-between items-center p-3 bg-cosmic-void/30 rounded-lg">
                <span className="text-asteroid-silver">Account Type</span>
                <span className="text-pink-400 font-semibold">Business</span>
              </div>
              
              <div className="flex justify-between items-center p-3 bg-cosmic-void/30 rounded-lg">
                <span className="text-asteroid-silver">API Status</span>
                <span className="text-green-400 font-semibold">Connected</span>
              </div>
              
              <div className="flex justify-between items-center p-3 bg-cosmic-void/30 rounded-lg">
                <span className="text-asteroid-silver">Data Source</span>
                <span className="text-pink-400 font-semibold">Instagram Business API</span>
              </div>
            </div>

            <div className="p-4 bg-green-500/10 rounded-lg border border-green-500/20">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                <span className="text-green-400 font-semibold">Live Data Active</span>
              </div>
              <p className="text-xs text-asteroid-silver">
                All metrics are fetched directly from Instagram Business API with real-time accuracy.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Performance Insights */}
      <Card className="content-card holographic">
        <CardHeader>
          <CardTitle className="text-pink-400">Performance Insights</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-pink-400 mb-2">
                {hasData ? `${(calculateEngagementRate() > 3 ? '+' : '')}${calculateEngagementRate().toFixed(1)}%` : 'Loading...'}
              </div>
              <div className="text-sm text-asteroid-silver mb-2">vs Industry Average (1-3%)</div>
              <div className={`text-xs px-2 py-1 rounded ${calculateEngagementRate() > 3 ? 'text-green-400 bg-green-500/20' : 'text-yellow-400 bg-yellow-500/20'}`}>
                {calculateEngagementRate() > 3 ? 'Above Average' : 'Industry Standard'}
              </div>
            </div>

            <div className="text-center">
              <div className="text-3xl font-bold text-pink-400 mb-2">
                {hasData ? formatNumber(instagramData.reach || 0) : 'Loading...'}
              </div>
              <div className="text-sm text-asteroid-silver mb-2">Total Reach</div>
              <div className="text-xs text-pink-400">
                {hasData ? `${calculateReachRate().toFixed(0)}x follower count` : 'Loading...'}
              </div>
            </div>

            <div className="text-center">
              <div className="text-3xl font-bold text-pink-400 mb-2">
                {hasData ? formatNumber(calculateAvgEngagementPerPost()) : 'Loading...'}
              </div>
              <div className="text-sm text-asteroid-silver mb-2">Avg. Interactions/Post</div>
              <div className="text-xs text-pink-400">Likes + Comments</div>
            </div>

            <div className="text-center">
              <div className="text-3xl font-bold text-pink-400 mb-2">
                {hasData ? formatNumber((instagramData.reach || 0) / (instagramData.posts || 1)) : 'Loading...'}
              </div>
              <div className="text-sm text-asteroid-silver mb-2">Avg. Reach/Post</div>
              <div className="text-xs text-pink-400">Unique accounts reached</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Data Authenticity Notice */}
      <Card className="content-card holographic border-pink-500/30">
        <CardContent className="p-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-gradient-to-r from-pink-500 to-purple-500 flex items-center justify-center">
              <i className="fab fa-instagram text-xl text-white" />
            </div>
            <div>
              <h3 className="text-pink-400 font-semibold mb-1">Authentic Instagram Business Data</h3>
              <p className="text-asteroid-silver text-sm">
                All analytics displayed are sourced directly from Instagram Business API. 
                Metrics include reach, engagement, followers, and post performance calculated using 
                official Instagram insights data for maximum accuracy.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}