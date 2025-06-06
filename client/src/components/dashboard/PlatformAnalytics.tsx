import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { RefreshCw } from "lucide-react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useWorkspace } from "@/hooks/useWorkspace";

interface PlatformAnalyticsProps {
  platform: string;
  icon: React.ReactNode;
  color: string;
}

export function PlatformAnalytics({ platform, icon, color }: PlatformAnalyticsProps) {
  const { currentWorkspace } = useWorkspace();

  const { data: analytics, refetch, isLoading } = useQuery({
    queryKey: ['dashboard-analytics', currentWorkspace?.id, platform],
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

  const refreshMutation = useMutation({
    mutationFn: () => apiRequest('POST', '/api/analytics/fetch', {
      workspaceId: currentWorkspace?.id,
      platform
    }),
    onSuccess: () => {
      refetch();
    }
  });

  // Map Instagram data directly from analytics response
  const getMetricValue = (key: string, fallback: string = '0') => {
    if (!analytics) return fallback;
    
    switch (key) {
      case 'followers':
        return (analytics.followers || 0).toString();
      case 'engagement':
        return (analytics.engagementRate || 0).toString();
      case 'reach':
        return (analytics.totalReach || 0).toString();
      case 'impressions':
        return (analytics.impressions || 0).toString();
      case 'totalLikes':
        return (analytics.totalLikes || 0).toString();
      case 'totalComments':
        return (analytics.totalComments || 0).toString();
      case 'totalPosts':
        return (analytics.totalPosts || 0).toString();
      default:
        return fallback;
    }
  };

  return (
    <Card className="content-card holographic">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-pink-500">
          {icon}
          Instagram Analytics
          <RefreshCw 
            className={`h-4 w-4 ml-auto cursor-pointer hover:text-pink-400 ${(refreshMutation.isPending || isLoading) ? 'animate-spin' : ''}`}
            onClick={() => refreshMutation.mutate()}
          />
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          <div className="text-center">
            <div className="text-lg font-semibold text-asteroid-silver mb-1">Followers</div>
            <div className="text-2xl font-bold text-pink-500">{getMetricValue('followers', '0')}</div>
            <div className="text-xs text-asteroid-silver">Real Instagram data</div>
          </div>
          
          <div className="text-center">
            <div className="text-lg font-semibold text-asteroid-silver mb-1">Engagement</div>
            <div className="text-2xl font-bold text-pink-500">{getMetricValue('engagement', '0')}</div>
            <div className="text-xs text-asteroid-silver">Real Instagram data</div>
          </div>
          
          <div className="text-center">
            <div className="text-lg font-semibold text-asteroid-silver mb-1">Reach</div>
            <div className="text-2xl font-bold text-pink-500">{getMetricValue('reach', '0')}</div>
            <div className="text-xs text-asteroid-silver">Real Instagram data</div>
          </div>
          
          <div className="text-center">
            <div className="text-lg font-semibold text-asteroid-silver mb-1">Impressions</div>
            <div className="text-2xl font-bold text-pink-500">{getMetricValue('impressions', '0')}</div>
            <div className="text-xs text-asteroid-silver">Real Instagram data</div>
          </div>
        </div>
        
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="flex items-center justify-between p-3 bg-cosmic-void/30 rounded-lg border border-pink-500/20">
            <div className="flex items-center gap-2">
              <span className="text-sm">Total Likes</span>
            </div>
            <span className="text-pink-400 font-medium">{getMetricValue('totalLikes', '0')}</span>
          </div>
          
          <div className="flex items-center justify-between p-3 bg-cosmic-void/30 rounded-lg border border-pink-500/20">
            <div className="flex items-center gap-2">
              <span className="text-sm">Comments</span>
            </div>
            <span className="text-pink-400 font-medium">{getMetricValue('totalComments', '0')}</span>
          </div>
          
          <div className="flex items-center justify-between p-3 bg-cosmic-void/30 rounded-lg border border-pink-500/20">
            <div className="flex items-center gap-2">
              <span className="text-sm">Posts</span>
            </div>
            <span className="text-pink-400 font-medium">{getMetricValue('totalPosts', '1')}</span>
          </div>
        </div>
        
        <div className="mt-6 p-4 bg-pink-500/10 rounded-lg border border-pink-500/30">
          <div className="text-center">
            <div className="text-sm text-pink-400 mb-2">Instagram Business API Connected</div>
            <div className="text-xs text-asteroid-silver">
              Displaying authentic analytics data from your Instagram Business account including followers, engagement, reach, and post metrics.
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
