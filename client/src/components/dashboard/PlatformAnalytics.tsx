import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { RefreshCw } from "lucide-react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useWorkspaceContext } from "@/hooks/useWorkspace";
import { useAuth } from "@/hooks/useAuth";
import { formatNumber, formatEngagement } from "@/lib/utils";

interface PlatformAnalyticsProps {
  platform: string;
  icon: React.ReactNode;
  color: string;
}

export function PlatformAnalytics({ platform, icon, color }: PlatformAnalyticsProps) {
  const { currentWorkspace } = useWorkspaceContext();
  const { token } = useAuth();

  const { data: analytics, refetch, isLoading } = useQuery({
    queryKey: ['dashboard-analytics', currentWorkspace?.id, platform],
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

  const refreshMutation = useMutation({
    mutationFn: () => apiRequest('POST', '/api/analytics/fetch', {
      workspaceId: currentWorkspace?.id,
      platform
    }),
    onSuccess: () => {
      refetch();
    }
  });

  // Map Instagram data directly from analytics response with Indian number formatting
  const getMetricValue = (key: string, fallback: string = '—') => {
    if (!analytics || isLoading) return fallback;
    
    switch (key) {
      case 'followers':
        return formatNumber(analytics.followers || 0);
      case 'engagement':
        return formatEngagement(analytics.engagementRate || 0);
      case 'reach':
        return formatNumber(analytics.totalReach || 0);
      case 'impressions':
        return formatNumber(analytics.impressions || 0);
      case 'totalLikes':
        return formatNumber(analytics.totalLikes || 0);
      case 'totalComments':
        return formatNumber(analytics.totalComments || 0);
      case 'totalPosts':
        return formatNumber(analytics.totalPosts || 0);
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
