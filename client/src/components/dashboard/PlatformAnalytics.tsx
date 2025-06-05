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
    queryFn: () => fetch(`/api/dashboard/analytics`).then(res => res.json()),
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

  const platformData = analytics?.platforms?.find(p => p.platform === platform) || {};
  
  const getMetricValue = (key: string, fallback: string = '0') => {
    const value = platformData[key] || analytics?.[key] || 0;
    return value.toString();
  };

  return (
    <Card className="content-card holographic">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="flex items-center space-x-3">
          <span className={`text-2xl ${color}`}>{icon}</span>
          <span className="text-xl font-orbitron font-semibold">{platform} Analytics</span>
        </CardTitle>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => refreshMutation.mutate()}
          disabled={refreshMutation.isPending || isLoading}
          className="text-electric-cyan hover:text-white"
        >
          <RefreshCw className={`h-4 w-4 ${(refreshMutation.isPending || isLoading) ? 'animate-spin' : ''}`} />
        </Button>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <span className="text-asteroid-silver">Followers</span>
            <span className="font-mono text-lg">{getMetricValue('followers', '0')}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-asteroid-silver">Avg. Engagement</span>
            <span className="font-mono text-lg text-green-400">{getMetricValue('engagement_rate', '0%')}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-asteroid-silver">Impressions</span>
            <span className="font-mono text-lg">{getMetricValue('impressions', '0')}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-asteroid-silver">Reach (7d)</span>
            <span className="font-mono text-lg">{getMetricValue('reach', '0')}</span>
          </div>
        </div>
        
        {/* Mini chart placeholder */}
        <div className="mt-6 h-24 bg-cosmic-blue rounded-lg relative overflow-hidden">
          <div className={`absolute inset-0 bg-gradient-to-r ${color}/20 to-purple-500/20`}></div>
          <div className={`absolute bottom-0 left-0 right-0 h-1/2 bg-gradient-to-t ${color}/50 to-transparent`}></div>
        </div>
      </CardContent>
    </Card>
  );
}
