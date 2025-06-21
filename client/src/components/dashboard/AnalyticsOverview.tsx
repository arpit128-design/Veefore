import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { RefreshCw, TrendingUp, TrendingDown, Users, Eye, Heart, Play, Calendar, BarChart3 } from "lucide-react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useAuth } from "@/hooks/useAuth";
import { useWorkspaceContext } from "@/hooks/useWorkspace";
import { formatNumber, formatEngagement } from "@/lib/utils";
import { apiRequest } from "@/lib/queryClient";
import { useState } from "react";
import { AnalyticsChart } from "./AnalyticsChart";

interface AnalyticsOverviewProps {
  data?: any;
  isLoading?: boolean;
}

const PLATFORM_ICONS = {
  instagram: <i className="fab fa-instagram text-pink-500" />,
  youtube: <Play className="h-4 w-4 text-red-500" />,
  twitter: <i className="fab fa-twitter text-blue-400" />,
  facebook: <i className="fab fa-facebook text-blue-600" />,
  linkedin: <i className="fab fa-linkedin text-blue-500" />,
  tiktok: <i className="fab fa-tiktok text-black" />
};

const TIME_PERIODS = [
  { value: '1d', label: '1 Day' },
  { value: '7d', label: '7 Days' },
  { value: '30d', label: '30 Days' },
  { value: '90d', label: '90 Days' },
  { value: '1y', label: '1 Year' }
];

export function AnalyticsOverview({ data, isLoading }: AnalyticsOverviewProps) {
  const { token } = useAuth();
  const { currentWorkspace } = useWorkspaceContext();
  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>(['all']);
  const [timePeriod, setTimePeriod] = useState('30d');

  // Fetch filtered analytics data
  const { data: filteredData, isLoading: filteredLoading, refetch } = useQuery({
    queryKey: ['analytics-filtered', currentWorkspace?.id, selectedPlatforms, timePeriod],
    queryFn: async () => {
      const platforms = selectedPlatforms.includes('all') ? [] : selectedPlatforms;
      const response = await fetch(`/api/dashboard/analytics/filtered?workspaceId=${currentWorkspace?.id}&platforms=${platforms.join(',')}&timePeriod=${timePeriod}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('[ANALYTICS FILTER ERROR]', response.status, errorText);
        throw new Error('Failed to fetch filtered analytics');
      }
      const result = await response.json();
      console.log('[ANALYTICS FILTER SUCCESS]', result);
      return result;
    },
    enabled: !!currentWorkspace?.id && !!token
  });

  const refreshMutation = useMutation({
    mutationFn: () => apiRequest('POST', '/api/analytics/refresh', {
      workspaceId: currentWorkspace?.id,
      platforms: selectedPlatforms.includes('all') ? [] : selectedPlatforms
    }),
    onSuccess: () => refetch()
  });

  const displayData = filteredData || data;
  const loading = filteredLoading || isLoading;
  
  console.log('[ANALYTICS OVERVIEW] Selected platforms:', selectedPlatforms);
  console.log('[ANALYTICS OVERVIEW] Time period:', timePeriod);
  console.log('[ANALYTICS OVERVIEW] Filtered data:', filteredData);
  console.log('[ANALYTICS OVERVIEW] Display data:', displayData);

  // Get available platforms from data
  const availablePlatforms = displayData?.connectedPlatforms || [];
  
  // Calculate combined metrics based on filtered data
  const combinedMetrics = {
    totalReach: displayData?.totalReach || 0,
    totalFollowers: (displayData?.platformData?.instagram?.followers || 0) + 
                   (displayData?.platformData?.youtube?.subscribers || 0),
    totalEngagement: (displayData?.totalLikes || 0) + (displayData?.totalComments || 0),
    totalContent: (displayData?.platformData?.instagram?.posts || 0) + 
                 (displayData?.platformData?.youtube?.videos || 0),
    engagementRate: displayData?.engagementRate || 0
  };

  const handlePlatformToggle = (platform: string) => {
    if (platform === 'all') {
      setSelectedPlatforms(['all']);
    } else {
      const newSelection = selectedPlatforms.includes('all') 
        ? [platform]
        : selectedPlatforms.includes(platform)
          ? selectedPlatforms.filter(p => p !== platform)
          : [...selectedPlatforms.filter(p => p !== 'all'), platform];
      
      setSelectedPlatforms(newSelection.length === 0 ? ['all'] : newSelection);
    }
  };

  return (
    <div className="space-y-6">
      {/* Controls */}
      <Card className="content-card holographic">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5 text-electric-cyan" />
              Analytics Overview
            </div>
            <div className="flex items-center gap-3">
              <Select value={timePeriod} onValueChange={setTimePeriod}>
                <SelectTrigger className="w-32 glassmorphism">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {TIME_PERIODS.map(period => (
                    <SelectItem key={period.value} value={period.value}>
                      {period.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <RefreshCw 
                className={`h-4 w-4 cursor-pointer hover:text-electric-cyan ${refreshMutation.isPending ? 'animate-spin' : ''}`}
                onClick={() => refreshMutation.mutate()}
              />
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {/* Platform Filters */}
          <div className="flex flex-wrap gap-2 mb-4">
            <Button
              variant={selectedPlatforms.includes('all') ? 'default' : 'outline'}
              size="sm"
              onClick={() => handlePlatformToggle('all')}
              className="glassmorphism"
            >
              All Platforms
            </Button>
            {availablePlatforms.map((platform: string) => (
              <Button
                key={platform}
                variant={selectedPlatforms.includes(platform) ? 'default' : 'outline'}
                size="sm"
                onClick={() => handlePlatformToggle(platform)}
                className="glassmorphism flex items-center gap-2"
              >
                {PLATFORM_ICONS[platform as keyof typeof PLATFORM_ICONS]}
                {platform.charAt(0).toUpperCase() + platform.slice(1)}
              </Button>
            ))}
          </div>

          {/* Active Filters */}
          {!selectedPlatforms.includes('all') && (
            <div className="flex items-center gap-2 mb-4">
              <span className="text-sm text-asteroid-silver">Active filters:</span>
              {selectedPlatforms.map(platform => (
                <Badge key={platform} variant="secondary" className="glassmorphism">
                  {platform.charAt(0).toUpperCase() + platform.slice(1)}
                </Badge>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="content-card holographic">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-asteroid-silver">Total Reach</p>
                <p className="text-2xl font-bold text-electric-cyan">
                  {loading ? '—' : formatNumber(combinedMetrics.totalReach)}
                </p>
                {displayData?.percentageChanges?.reach && (
                  <div className={`flex items-center gap-1 text-xs ${
                    displayData.percentageChanges.reach.isPositive ? 'text-green-400' : 'text-red-400'
                  }`}>
                    {displayData.percentageChanges.reach.isPositive ? (
                      <TrendingUp className="h-3 w-3" />
                    ) : (
                      <TrendingDown className="h-3 w-3" />
                    )}
                    <span>{displayData.percentageChanges.reach.value}</span>
                  </div>
                )}
              </div>
              <Eye className="h-8 w-8 text-electric-cyan/50" />
            </div>
          </CardContent>
        </Card>

        <Card className="content-card holographic">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-asteroid-silver">Total Followers</p>
                <p className="text-2xl font-bold text-green-400">
                  {loading ? '—' : formatNumber(combinedMetrics.totalFollowers)}
                </p>
                {displayData?.percentageChanges?.followers && (
                  <div className={`flex items-center gap-1 text-xs ${
                    displayData.percentageChanges.followers.isPositive ? 'text-green-400' : 'text-red-400'
                  }`}>
                    {displayData.percentageChanges.followers.isPositive ? (
                      <TrendingUp className="h-3 w-3" />
                    ) : (
                      <TrendingDown className="h-3 w-3" />
                    )}
                    <span>{displayData.percentageChanges.followers.value}</span>
                  </div>
                )}
              </div>
              <Users className="h-8 w-8 text-green-400/50" />
            </div>
          </CardContent>
        </Card>

        <Card className="content-card holographic">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-asteroid-silver">Engagement Rate</p>
                <p className="text-2xl font-bold text-nebula-purple">
                  {loading ? '—' : `${formatEngagement(combinedMetrics.engagementRate)}%`}
                </p>
                {displayData?.percentageChanges?.engagement && (
                  <div className={`flex items-center gap-1 text-xs ${
                    displayData.percentageChanges.engagement.isPositive ? 'text-green-400' : 'text-red-400'
                  }`}>
                    {displayData.percentageChanges.engagement.isPositive ? (
                      <TrendingUp className="h-3 w-3" />
                    ) : (
                      <TrendingDown className="h-3 w-3" />
                    )}
                    <span>{displayData.percentageChanges.engagement.value}</span>
                  </div>
                )}
              </div>
              <Heart className="h-8 w-8 text-nebula-purple/50" />
            </div>
          </CardContent>
        </Card>

        <Card className="content-card holographic">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-asteroid-silver">Total Content</p>
                <p className="text-2xl font-bold text-solar-gold">
                  {loading ? '—' : formatNumber(combinedMetrics.totalContent)}
                </p>
                <p className="text-xs text-asteroid-silver">
                  {displayData?.platformData?.instagram?.posts || 0} posts + {displayData?.platformData?.youtube?.videos || 0} videos
                </p>
              </div>
              <Calendar className="h-8 w-8 text-solar-gold/50" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Analytics Chart */}
      <AnalyticsChart 
        data={displayData} 
        selectedPlatforms={selectedPlatforms}
        timePeriod={timePeriod}
      />

      {/* Platform Breakdown */}
      {availablePlatforms.length > 0 && (
        <Card className="content-card holographic">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              Platform Performance Breakdown
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {availablePlatforms.map((platform: string) => {
                const platformData = displayData?.platformData?.[platform];
                if (!platformData) return null;

                return (
                  <div key={platform} className="p-4 bg-cosmic-void/30 rounded-lg border border-white/10">
                    <div className="flex items-center gap-2 mb-3">
                      {PLATFORM_ICONS[platform as keyof typeof PLATFORM_ICONS]}
                      <span className="font-semibold capitalize">{platform}</span>
                      <Badge variant="outline" className="ml-auto">
                        @{platformData.username || platformData.name}
                      </Badge>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-3 text-sm">
                      {platform === 'instagram' && (
                        <>
                          <div>
                            <div className="text-asteroid-silver">Posts</div>
                            <div className="font-bold text-pink-400">{formatNumber(platformData.posts || 0)}</div>
                          </div>
                          <div>
                            <div className="text-asteroid-silver">Followers</div>
                            <div className="font-bold text-pink-400">{formatNumber(platformData.followers || 0)}</div>
                          </div>
                          <div>
                            <div className="text-asteroid-silver">Reach</div>
                            <div className="font-bold text-pink-400">{formatNumber(platformData.reach || 0)}</div>
                          </div>
                          <div>
                            <div className="text-asteroid-silver">Likes</div>
                            <div className="font-bold text-pink-400">{formatNumber(platformData.likes || 0)}</div>
                          </div>
                        </>
                      )}
                      
                      {platform === 'youtube' && (
                        <>
                          <div>
                            <div className="text-asteroid-silver">Videos</div>
                            <div className="font-bold text-red-400">{formatNumber(platformData.videos || 0)}</div>
                          </div>
                          <div>
                            <div className="text-asteroid-silver">Subscribers</div>
                            <div className="font-bold text-red-400">{formatNumber(platformData.subscribers || 0)}</div>
                          </div>
                          <div>
                            <div className="text-asteroid-silver">Views</div>
                            <div className="font-bold text-red-400">{formatNumber(platformData.views || 0)}</div>
                          </div>
                          <div>
                            <div className="text-asteroid-silver">Watch Time</div>
                            <div className="font-bold text-red-400">{platformData.watchTime || '0h'}</div>
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}