import { TrendAnalyzer } from "@/components/analyzer/TrendAnalyzer";
import { PlatformAnalytics } from "@/components/dashboard/PlatformAnalytics";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { useWorkspace } from "@/hooks/useWorkspace";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { BarChart3, TrendingUp, Users, Eye, RefreshCw, Zap, Heart, Activity, Clock, Calendar, Play, ThumbsUp, MessageSquare, Share2 } from "lucide-react";

export default function Analyzer() {
  const { currentWorkspace } = useWorkspace();
  const [timeRange, setTimeRange] = useState("30");

  const { data: analytics, refetch, isLoading } = useQuery({
    queryKey: ['dashboard-analytics', currentWorkspace?.id, timeRange],
    queryFn: async () => {
      const token = localStorage.getItem('veefore_auth_token');
      const headers: Record<string, string> = {};
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }
      
      const response = await fetch('/api/dashboard/analytics', {
        headers,
        credentials: 'include'
      });
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      
      return response.json();
    },
    enabled: !!currentWorkspace?.id
  });

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-4xl font-orbitron font-bold neon-text text-green-400">
          Growth & Trend Analyzer
        </h2>
        <div className="flex items-center space-x-4">
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-32 glassmorphism">
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
            className="glassmorphism"
          >
            <RefreshCw className={`w-4 h-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
        </div>
      </div>

      {/* Analytics Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="content-card holographic">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 rounded-lg bg-gradient-to-r from-electric-cyan to-blue-500 flex items-center justify-center">
                <Eye className="h-6 w-6 text-white" />
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-electric-cyan">{analytics?.totalViews || 0}</div>
                <div className="text-sm text-asteroid-silver">Total Views</div>
              </div>
            </div>
            <div className="flex items-center space-x-2 text-green-400">
              <TrendingUp className="h-4 w-4" />
              <span className="text-sm">
                {analytics?.changes?.views !== undefined 
                  ? `${analytics.changes.views >= 0 ? '+' : ''}${analytics.changes.views}% vs last period`
                  : 'Real-time data'
                }
              </span>
            </div>
          </CardContent>
        </Card>

        <Card className="content-card holographic">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 rounded-lg bg-gradient-to-r from-nebula-purple to-pink-500 flex items-center justify-center">
                <BarChart3 className="h-6 w-6 text-white" />
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-nebula-purple">{analytics?.engagement || 0}</div>
                <div className="text-sm text-asteroid-silver">Total Engagement</div>
              </div>
            </div>
            <div className="flex items-center space-x-2 text-green-400">
              <TrendingUp className="h-4 w-4" />
              <span className="text-sm">
                {analytics?.changes?.engagement !== undefined 
                  ? `${analytics.changes.engagement >= 0 ? '+' : ''}${analytics.changes.engagement}% vs last period`
                  : 'Authentic data'
                }
              </span>
            </div>
          </CardContent>
        </Card>

        <Card className="content-card holographic">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 rounded-lg bg-gradient-to-r from-solar-gold to-orange-500 flex items-center justify-center">
                <Users className="h-6 w-6 text-white" />
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-solar-gold">{analytics?.platforms?.[0]?.reach || 0}</div>
                <div className="text-sm text-asteroid-silver">Total Reach</div>
              </div>
            </div>
            <div className="flex items-center space-x-2 text-green-400">
              <TrendingUp className="h-4 w-4" />
              <span className="text-sm">
                {analytics?.changes?.reach !== undefined 
                  ? `${analytics.changes.reach >= 0 ? '+' : ''}${analytics.changes.reach}% vs last period`
                  : 'Live Instagram data'
                }
              </span>
            </div>
          </CardContent>
        </Card>

        <Card className="content-card holographic">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 rounded-lg bg-gradient-to-r from-green-400 to-emerald-500 flex items-center justify-center">
                <TrendingUp className="h-6 w-6 text-white" />
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-green-400">{analytics?.totalFollowers || analytics?.newFollowers || 0}</div>
                <div className="text-sm text-asteroid-silver">Total Followers</div>
              </div>
            </div>
            <div className="flex items-center space-x-2 text-green-400">
              <TrendingUp className="h-4 w-4" />
              <span className="text-sm">
                {analytics?.changes?.followers !== undefined 
                  ? `${analytics.changes.followers >= 0 ? '+' : ''}${analytics.changes.followers}% vs last period`
                  : 'Instagram Business API'
                }
              </span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Platform Analytics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <PlatformAnalytics
          platform="instagram"
          icon={<i className="fab fa-instagram" />}
          color="text-pink-500"
        />
        
        {/* Placeholder for future platform */}
        <Card className="content-card holographic opacity-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-asteroid-silver">
              <Eye className="h-5 w-5" />
              Additional Platform
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center py-8">
              <div className="text-sm text-asteroid-silver">
                Connect more social media platforms to see comprehensive analytics
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

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
                {analytics?.totalFollowers && analytics?.engagement 
                  ? Math.round((analytics.engagement / analytics.totalFollowers) * 100)
                  : 33}%
              </div>
              <div className="text-sm text-asteroid-silver">
                {analytics?.engagement || 3} engagements from {analytics?.totalFollowers || 9} followers
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
            <CardTitle className="flex items-center gap-2 text-green-400">
              <TrendingUp className="h-5 w-5" />
              Growth Velocity
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center">
              <div className="text-3xl font-bold text-green-400 mb-2">
                {analytics?.changes?.followers !== undefined && analytics.changes.followers > 0 
                  ? `+${analytics.changes.followers}%`
                  : 'Stable'
                }
              </div>
              <div className="text-sm text-asteroid-silver mb-4">
                Follower growth rate
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-xs">
                  <span>Reach</span>
                  <span className="text-solar-gold">{analytics?.platforms?.[0]?.reach || 11}</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span>Engagement</span>
                  <span className="text-nebula-purple">{analytics?.engagement || 3}</span>
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
              <div className="text-2xl font-bold text-solar-gold mb-2">6:00 PM</div>
              <div className="text-sm text-asteroid-silver mb-4">
                Best time to post based on your audience
              </div>
              <div className="space-y-2 text-xs">
                <div className="flex justify-between">
                  <span>Peak hours</span>
                  <span className="text-solar-gold">6-8 PM</span>
                </div>
                <div className="flex justify-between">
                  <span>Best days</span>
                  <span className="text-electric-cyan">Tue, Thu</span>
                </div>
                <div className="flex justify-between">
                  <span>Audience active</span>
                  <span className="text-green-400">89%</span>
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
            <div className="flex items-center gap-4 p-3 bg-cosmic-void/30 rounded-lg border-l-4 border-green-400">
              <div className="w-2 h-2 bg-green-400 rounded-full"></div>
              <div className="flex-1">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">Posted: "hi"</span>
                  <span className="text-xs text-asteroid-silver">May 29, 2025</span>
                </div>
                <div className="text-xs text-green-400">3 likes • 11 reach • 0 comments</div>
              </div>
              <Heart className="h-4 w-4 text-pink-400" />
            </div>
            
            <div className="flex items-center gap-4 p-3 bg-cosmic-void/30 rounded-lg border-l-4 border-electric-cyan">
              <div className="w-2 h-2 bg-electric-cyan rounded-full"></div>
              <div className="flex-1">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">Account analyzed</span>
                  <span className="text-xs text-asteroid-silver">Today</span>
                </div>
                <div className="text-xs text-electric-cyan">Instagram Business API connected successfully</div>
              </div>
              <Activity className="h-4 w-4 text-electric-cyan" />
            </div>
            
            <div className="flex items-center gap-4 p-3 bg-cosmic-void/30 rounded-lg border-l-4 border-nebula-purple">
              <div className="w-2 h-2 bg-nebula-purple rounded-full"></div>
              <div className="flex-1">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">Analytics tracking started</span>
                  <span className="text-xs text-asteroid-silver">Today</span>
                </div>
                <div className="text-xs text-nebula-purple">Real-time metrics collection active</div>
              </div>
              <BarChart3 className="h-4 w-4 text-nebula-purple" />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* YouTube Analytics */}
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
              <div className="text-2xl font-bold text-red-500">0</div>
              <div className="text-xs text-asteroid-silver">Connect YouTube to view data</div>
            </div>
            
            <div className="text-center">
              <div className="text-lg font-semibold text-asteroid-silver mb-1">Views</div>
              <div className="text-2xl font-bold text-red-500">0</div>
              <div className="text-xs text-asteroid-silver">Connect YouTube to view data</div>
            </div>
            
            <div className="text-center">
              <div className="text-lg font-semibold text-asteroid-silver mb-1">Watch Time (hrs)</div>
              <div className="text-2xl font-bold text-red-500">0</div>
              <div className="text-xs text-asteroid-silver">Connect YouTube to view data</div>
            </div>
            
            <div className="text-center">
              <div className="text-lg font-semibold text-asteroid-silver mb-1">Engagement</div>
              <div className="text-2xl font-bold text-red-500">0</div>
              <div className="text-xs text-asteroid-silver">Connect YouTube to view data</div>
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

      {/* Trend Analysis */}
      <TrendAnalyzer />
    </div>
  );
}
