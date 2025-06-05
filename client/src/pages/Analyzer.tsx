import { TrendAnalyzer } from "@/components/analyzer/TrendAnalyzer";
import { PlatformAnalytics } from "@/components/dashboard/PlatformAnalytics";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { useWorkspace } from "@/hooks/useWorkspace";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { BarChart3, TrendingUp, Users, Eye, RefreshCw } from "lucide-react";

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
        <PlatformAnalytics
          platform="twitter"
          icon={<i className="fab fa-x-twitter" />}
          color="text-white"
        />
      </div>

      {/* Trend Analysis */}
      <TrendAnalyzer />
    </div>
  );
}
