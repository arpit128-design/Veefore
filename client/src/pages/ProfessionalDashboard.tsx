import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useWorkspaceContext } from "@/hooks/useWorkspace";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ProfessionalStatsCard } from "@/components/dashboard/ProfessionalStatsCard";
import { 
  Eye, 
  Heart, 
  Users, 
  TrendingUp, 
  RefreshCw,
  Calendar,
  MessageSquare,
  BarChart3,
  Zap,
  Clock
} from "lucide-react";
import { formatNumber } from "@/lib/utils";

export default function ProfessionalDashboard() {
  const { user, token } = useAuth();
  const { currentWorkspace } = useWorkspaceContext();
  const [currentTime, setCurrentTime] = useState(new Date());

  // Real-time analytics query
  const { data: analyticsData, isLoading: analyticsLoading, refetch } = useQuery({
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
    staleTime: 0,
    gcTime: 0,
    refetchInterval: 30000,
    refetchOnMount: true,
    refetchOnWindowFocus: true,
    refetchOnReconnect: true
  });

  // Live clock
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

  // Process analytics data
  const stats = analyticsData ? {
    totalReach: analyticsData.totalReach || 0,
    engagement: analyticsData.engagementRate || 0,
    followers: analyticsData.followers || 0,
    posts: analyticsData.totalPosts || 0,
    percentageChanges: analyticsData.percentageChanges || {}
  } : {
    totalReach: 0,
    engagement: 0,
    followers: 0,
    posts: 0,
    percentageChanges: {}
  };

  return (
    <div className="main-dashboard-container min-h-screen bg-gray-50 dark:bg-slate-900" style={{ backgroundColor: '#f9fafb', minHeight: '100vh' }}>
      <div className="p-6 space-y-6" style={{ backgroundColor: 'transparent' }}>
        {/* Header Section */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-slate-800 dark:text-slate-100">Dashboard</h1>
            <p className="text-slate-600 dark:text-slate-400 mt-1">
              Welcome back, {user?.username || user?.email}
            </p>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400">
              <Clock className="h-4 w-4" />
              <span>{formattedTime} IST</span>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => refetch()}
              disabled={analyticsLoading}
              className="border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              <RefreshCw className={`h-4 w-4 mr-2 ${analyticsLoading ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <ProfessionalStatsCard
          title="Total Reach"
          value={formatNumber(stats.totalReach)}
          change={stats.percentageChanges.reach ? {
            value: stats.percentageChanges.reach.value,
            isPositive: stats.percentageChanges.reach.isPositive
          } : undefined}
          icon={Eye}
          description="People reached across all platforms"
        />
        <ProfessionalStatsCard
          title="Engagement Rate"
          value={`${stats.engagement.toFixed(1)}%`}
          change={stats.percentageChanges.engagement ? {
            value: stats.percentageChanges.engagement.value,
            isPositive: stats.percentageChanges.engagement.isPositive
          } : undefined}
          icon={Heart}
          description="Average engagement across content"
        />
        <ProfessionalStatsCard
          title="Followers"
          value={formatNumber(stats.followers)}
          change={stats.percentageChanges.followers ? {
            value: stats.percentageChanges.followers.value,
            isPositive: stats.percentageChanges.followers.isPositive
          } : undefined}
          icon={Users}
          description="Total followers across platforms"
        />
        <ProfessionalStatsCard
          title="Content Score"
          value={stats.percentageChanges.contentScore ? 
            stats.percentageChanges.contentScore.value.replace('%', '') : '0'}
          change={stats.percentageChanges.contentScore ? {
            value: stats.percentageChanges.contentScore.value,
            isPositive: stats.percentageChanges.contentScore.isPositive
          } : undefined}
          icon={TrendingUp}
          description="AI-calculated content performance"
        />
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Activity */}
        <div className="lg:col-span-2">
          <Card className="bg-white border border-slate-200 dark:bg-slate-800 dark:border-slate-700 shadow-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-slate-800 dark:text-slate-100">
                <BarChart3 className="h-5 w-5 text-slate-600 dark:text-slate-400" />
                Recent Activity
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {analyticsData?.connectedPlatforms?.length > 0 ? (
                  analyticsData.connectedPlatforms.map((platform: string) => (
                    <div key={platform} className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-700 rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-cyan-100 dark:bg-cyan-900 rounded-full flex items-center justify-center">
                          <span className="text-sm font-medium capitalize text-cyan-700 dark:text-cyan-300">
                            {platform[0]}
                          </span>
                        </div>
                        <div>
                          <p className="font-medium text-slate-800 dark:text-slate-100 capitalize">{platform}</p>
                          <p className="text-sm text-slate-600 dark:text-slate-400">
                            {analyticsData.platformData?.[platform]?.posts || 0} posts
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-medium text-slate-800 dark:text-slate-100">
                          {formatNumber(analyticsData.platformData?.[platform]?.reach || 0)} reach
                        </p>
                        <p className="text-sm text-slate-600 dark:text-slate-400">
                          {analyticsData.platformData?.[platform]?.followers || 0} followers
                        </p>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8">
                    <p className="text-slate-600 dark:text-slate-400">No connected platforms yet</p>
                    <Button variant="outline" size="sm" className="mt-2 border-slate-200 dark:border-slate-600 text-slate-700 dark:text-slate-300">
                      Connect Platform
                    </Button>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="space-y-6">
          <Card className="bg-white border border-slate-200 dark:bg-slate-800 dark:border-slate-700 shadow-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-slate-800 dark:text-slate-100">
                <Zap className="h-5 w-5 text-slate-600 dark:text-slate-400" />
                Quick Actions
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button className="w-full justify-start bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-600 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700" variant="outline">
                <Calendar className="h-4 w-4 mr-2" />
                Schedule Post
              </Button>
              <Button className="w-full justify-start bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-600 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700" variant="outline">
                <BarChart3 className="h-4 w-4 mr-2" />
                View Analytics
              </Button>
              <Button className="w-full justify-start bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-600 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700" variant="outline">
                <MessageSquare className="h-4 w-4 mr-2" />
                Check Messages
              </Button>
            </CardContent>
          </Card>

          <Card className="bg-white border border-slate-200 dark:bg-slate-800 dark:border-slate-700 shadow-sm">
            <CardHeader>
              <CardTitle className="text-slate-800 dark:text-slate-100">Today's Schedule</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center gap-3 p-2 bg-slate-50 dark:bg-slate-700 rounded">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <div>
                    <p className="text-sm font-medium text-slate-800 dark:text-slate-100">Instagram Post</p>
                    <p className="text-xs text-slate-600 dark:text-slate-400">2:30 PM</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-2 bg-slate-50 dark:bg-slate-700 rounded">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <div>
                    <p className="text-sm font-medium text-slate-800 dark:text-slate-100">Twitter Thread</p>
                    <p className="text-xs text-slate-600 dark:text-slate-400">4:00 PM</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-2 bg-slate-50 dark:bg-slate-700 rounded">
                  <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                  <div>
                    <p className="text-sm font-medium text-slate-800 dark:text-slate-100">LinkedIn Article</p>
                    <p className="text-xs text-slate-600 dark:text-slate-400">6:30 PM</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
      </div>
    </div>
  );
}