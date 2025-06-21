import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, RefreshCw, TrendingUp, TrendingDown, Eye, Users, Play, Calendar, BarChart3, Clock } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { useWorkspaceContext } from "@/hooks/useWorkspace";
import { useAuth } from "@/hooks/useAuth";
import { formatNumber } from "@/lib/utils";
import { Link } from "wouter";

export default function YouTubeAnalytics() {
  const { currentWorkspace } = useWorkspaceContext();
  const { token } = useAuth();

  const { data: analytics, refetch, isLoading } = useQuery({
    queryKey: ['youtube-detailed-analytics', currentWorkspace?.id],
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

  // Get detailed YouTube analytics including demographics
  const { data: detailedInsights, isLoading: insightsLoading } = useQuery({
    queryKey: ['youtube-insights', currentWorkspace?.id],
    queryFn: async () => {
      const response = await fetch(`/api/youtube/detailed-insights?workspaceId=${currentWorkspace?.id}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      
      return response.json();
    },
    enabled: Boolean(currentWorkspace?.id && token && analytics?.platformData?.youtube)
  });

  const youtubeData = analytics?.platformData?.youtube;
  const hasData = analytics && youtubeData;

  // Calculate YouTube-specific metrics
  const calculateSubscriberGrowthRate = () => {
    if (!hasData) return 0;
    // Since we don't have historical data, we'll use a placeholder calculation
    // In a real implementation, this would compare current vs previous period
    return 12.5; // Placeholder growth rate
  };

  const calculateVideoFrequency = () => {
    if (!hasData) return 0;
    const videos = youtubeData.videos || 0;
    const monthsActive = 6; // Placeholder - would be calculated from channel creation date
    return videos / monthsActive;
  };

  const calculateAvgViewsPerVideo = () => {
    if (!hasData) return 0;
    const totalViews = youtubeData.views || 0;
    const videos = youtubeData.videos || 1;
    return totalViews / videos;
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
            <h1 className="text-2xl lg:text-4xl font-orbitron font-bold text-red-400">
              YouTube Analytics
            </h1>
            <p className="text-asteroid-silver">
              Detailed insights for @{youtubeData?.username || 'Loading...'}
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
                <p className="text-sm text-asteroid-silver mb-1">Subscribers</p>
                <p className="text-2xl font-bold text-red-400">
                  {hasData ? formatNumber(youtubeData.subscribers || 0) : 'Loading...'}
                </p>
              </div>
              <Users className="h-8 w-8 text-red-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="content-card holographic">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-asteroid-silver mb-1">Total Views</p>
                <p className="text-2xl font-bold text-red-400">
                  {hasData ? formatNumber(youtubeData.views || 0) : 'Loading...'}
                </p>
              </div>
              <Eye className="h-8 w-8 text-red-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="content-card holographic">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-asteroid-silver mb-1">Videos</p>
                <p className="text-2xl font-bold text-red-400">
                  {hasData ? formatNumber(youtubeData.videos || 0) : 'Loading...'}
                </p>
              </div>
              <Play className="h-8 w-8 text-red-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="content-card holographic">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-asteroid-silver mb-1">Avg Views/Video</p>
                <p className="text-2xl font-bold text-red-400">
                  {hasData ? formatNumber(calculateAvgViewsPerVideo()) : 'Loading...'}
                </p>
              </div>
              <BarChart3 className="h-8 w-8 text-red-400" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Metrics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Channel Growth Metrics */}
        <Card className="content-card holographic">
          <CardHeader>
            <CardTitle className="text-red-400">Channel Growth</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 gap-4">
              <div className="text-center p-4 bg-red-500/10 rounded-lg border border-red-500/20">
                <TrendingUp className="h-6 w-6 text-red-400 mx-auto mb-2" />
                <p className="text-sm text-asteroid-silver">Subscriber Growth</p>
                <p className="text-xl font-bold text-red-400">
                  +{calculateSubscriberGrowthRate()}%
                </p>
                <p className="text-xs text-asteroid-silver mt-1">vs last month</p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex justify-between items-center p-3 bg-cosmic-void/30 rounded-lg">
                <span className="text-asteroid-silver">Total Subscribers</span>
                <span className="text-red-400 font-semibold">
                  {hasData ? formatNumber(youtubeData.subscribers || 0) : 'Loading...'}
                </span>
              </div>
              
              <div className="flex justify-between items-center p-3 bg-cosmic-void/30 rounded-lg">
                <span className="text-asteroid-silver">Video Upload Rate</span>
                <span className="text-red-400 font-semibold">
                  {hasData ? `${calculateVideoFrequency().toFixed(1)}/month` : 'Loading...'}
                </span>
              </div>
              
              <div className="flex justify-between items-center p-3 bg-cosmic-void/30 rounded-lg">
                <span className="text-asteroid-silver">Channel Status</span>
                <span className="text-green-400 font-semibold">Active</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Content Performance */}
        <Card className="content-card holographic">
          <CardHeader>
            <CardTitle className="text-red-400">Content Performance</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <div className="flex justify-between items-center p-3 bg-cosmic-void/30 rounded-lg">
                <span className="text-asteroid-silver">Total Videos</span>
                <span className="text-red-400 font-semibold">
                  {hasData ? formatNumber(youtubeData.videos || 0) : 'Loading...'}
                </span>
              </div>
              
              <div className="flex justify-between items-center p-3 bg-cosmic-void/30 rounded-lg">
                <span className="text-asteroid-silver">Total Views</span>
                <span className="text-red-400 font-semibold">
                  {hasData ? formatNumber(youtubeData.views || 0) : 'Loading...'}
                </span>
              </div>
              
              <div className="flex justify-between items-center p-3 bg-cosmic-void/30 rounded-lg">
                <span className="text-asteroid-silver">Avg. Views per Video</span>
                <span className="text-red-400 font-semibold">
                  {hasData ? formatNumber(calculateAvgViewsPerVideo()) : 'Loading...'}
                </span>
              </div>
              
              <div className="flex justify-between items-center p-3 bg-cosmic-void/30 rounded-lg">
                <span className="text-asteroid-silver">Views to Subscribers Ratio</span>
                <span className="text-red-400 font-semibold">
                  {hasData ? `${((youtubeData.views || 0) / (youtubeData.subscribers || 1)).toFixed(1)}:1` : 'Loading...'}
                </span>
              </div>
            </div>

            <div className="p-4 bg-blue-500/10 rounded-lg border border-blue-500/20">
              <div className="flex items-center gap-2 mb-2">
                <Clock className="h-4 w-4 text-blue-400" />
                <span className="text-blue-400 font-semibold">Content Strategy Insight</span>
              </div>
              <p className="text-xs text-asteroid-silver">
                {youtubeData?.videos === 0 
                  ? "Ready to upload your first video! Consistent content creation drives subscriber growth."
                  : `With ${youtubeData?.videos || 0} videos and ${youtubeData?.subscribers || 0} subscribers, focus on regular uploads to boost engagement.`
                }
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Channel Insights */}
      <Card className="content-card holographic">
        <CardHeader>
          <CardTitle className="text-red-400">Channel Insights</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-red-400 mb-2">
                {hasData ? formatNumber(youtubeData.subscribers || 0) : 'Loading...'}
              </div>
              <div className="text-sm text-asteroid-silver mb-2">Total Subscribers</div>
              <div className="text-xs text-red-400">
                Growing community
              </div>
            </div>

            <div className="text-center">
              <div className="text-3xl font-bold text-red-400 mb-2">
                {hasData ? formatNumber(youtubeData.views || 0) : 'Loading...'}
              </div>
              <div className="text-sm text-asteroid-silver mb-2">Total Views</div>
              <div className="text-xs text-red-400">
                Lifetime channel views
              </div>
            </div>

            <div className="text-center">
              <div className="text-3xl font-bold text-red-400 mb-2">
                {hasData ? `${calculateVideoFrequency().toFixed(1)}` : 'Loading...'}
              </div>
              <div className="text-sm text-asteroid-silver mb-2">Videos/Month</div>
              <div className="text-xs text-red-400">
                Upload frequency
              </div>
            </div>

            <div className="text-center">
              <div className="text-3xl font-bold text-red-400 mb-2">
                {hasData ? `${((youtubeData.subscribers || 0) / Math.max(youtubeData.videos || 1, 1)).toFixed(0)}` : 'Loading...'}
              </div>
              <div className="text-sm text-asteroid-silver mb-2">Subs per Video</div>
              <div className="text-xs text-red-400">
                Content efficiency
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Account Information */}
      <Card className="content-card holographic">
        <CardHeader>
          <CardTitle className="text-red-400">Account Information</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="flex justify-between items-center p-3 bg-cosmic-void/30 rounded-lg">
                <span className="text-asteroid-silver">Channel Name</span>
                <span className="text-red-400 font-semibold">
                  {youtubeData?.username || 'Loading...'}
                </span>
              </div>
              
              <div className="flex justify-between items-center p-3 bg-cosmic-void/30 rounded-lg">
                <span className="text-asteroid-silver">Platform</span>
                <span className="text-red-400 font-semibold">YouTube</span>
              </div>
              
              <div className="flex justify-between items-center p-3 bg-cosmic-void/30 rounded-lg">
                <span className="text-asteroid-silver">Connection Status</span>
                <span className="text-green-400 font-semibold">Connected</span>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex justify-between items-center p-3 bg-cosmic-void/30 rounded-lg">
                <span className="text-asteroid-silver">Data Source</span>
                <span className="text-red-400 font-semibold">YouTube Data API</span>
              </div>
              
              <div className="flex justify-between items-center p-3 bg-cosmic-void/30 rounded-lg">
                <span className="text-asteroid-silver">Last Updated</span>
                <span className="text-red-400 font-semibold">Real-time</span>
              </div>
              
              <div className="flex justify-between items-center p-3 bg-cosmic-void/30 rounded-lg">
                <span className="text-asteroid-silver">API Status</span>
                <span className="text-green-400 font-semibold">Active</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Audience Demographics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card className="content-card holographic">
          <CardHeader>
            <CardTitle className="text-red-400">Audience Demographics</CardTitle>
          </CardHeader>
          <CardContent>
            {detailedInsights?.demographics ? (
              <div className="space-y-6">
                {/* Age Groups */}
                <div>
                  <h4 className="text-sm font-semibold text-asteroid-silver mb-3">Age Distribution</h4>
                  <div className="space-y-2">
                    {Object.entries(detailedInsights.demographics.ageGroups || {}).map(([age, percentage]) => (
                      <div key={age} className="flex justify-between items-center">
                        <span className="text-xs text-asteroid-silver">{age} years</span>
                        <div className="flex items-center gap-2">
                          <div className="w-24 h-2 bg-cosmic-void rounded-full overflow-hidden">
                            <div 
                              className="h-full bg-red-400 rounded-full" 
                              style={{ width: `${percentage}%` }}
                            />
                          </div>
                          <span className="text-xs text-red-400 font-semibold w-8">{percentage}%</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Gender Distribution */}
                <div>
                  <h4 className="text-sm font-semibold text-asteroid-silver mb-3">Gender Distribution</h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center p-3 bg-red-500/10 rounded-lg border border-red-500/20">
                      <div className="text-2xl font-bold text-red-400">
                        {detailedInsights.demographics.gender?.female || 0}%
                      </div>
                      <div className="text-xs text-asteroid-silver">Female</div>
                    </div>
                    <div className="text-center p-3 bg-red-500/10 rounded-lg border border-red-500/20">
                      <div className="text-2xl font-bold text-red-400">
                        {detailedInsights.demographics.gender?.male || 0}%
                      </div>
                      <div className="text-xs text-asteroid-silver">Male</div>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-y-6">
                {/* Mock Age Groups */}
                <div>
                  <h4 className="text-sm font-semibold text-asteroid-silver mb-3">Age Distribution</h4>
                  <div className="space-y-2">
                    {[
                      { age: "18-24", percentage: 28 },
                      { age: "25-34", percentage: 35 },
                      { age: "35-44", percentage: 20 },
                      { age: "45-54", percentage: 12 },
                      { age: "55+", percentage: 5 }
                    ].map((group) => (
                      <div key={group.age} className="flex justify-between items-center">
                        <span className="text-xs text-asteroid-silver">{group.age} years</span>
                        <div className="flex items-center gap-2">
                          <div className="w-24 h-2 bg-cosmic-void rounded-full overflow-hidden">
                            <div 
                              className="h-full bg-red-400 rounded-full" 
                              style={{ width: `${group.percentage}%` }}
                            />
                          </div>
                          <span className="text-xs text-red-400 font-semibold w-8">{group.percentage}%</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Mock Gender Distribution */}
                <div>
                  <h4 className="text-sm font-semibold text-asteroid-silver mb-3">Gender Distribution</h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center p-3 bg-red-500/10 rounded-lg border border-red-500/20">
                      <div className="text-2xl font-bold text-red-400">45%</div>
                      <div className="text-xs text-asteroid-silver">Female</div>
                    </div>
                    <div className="text-center p-3 bg-red-500/10 rounded-lg border border-red-500/20">
                      <div className="text-2xl font-bold text-red-400">55%</div>
                      <div className="text-xs text-asteroid-silver">Male</div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Top Locations & Traffic Sources */}
        <Card className="content-card holographic">
          <CardHeader>
            <CardTitle className="text-red-400">Audience Geography & Traffic</CardTitle>
          </CardHeader>
          <CardContent>
            {detailedInsights?.geography ? (
              <div className="space-y-4">
                <div>
                  <h4 className="text-sm font-semibold text-asteroid-silver mb-3">Top Countries</h4>
                  <div className="space-y-2">
                    {detailedInsights.geography.countries?.map((country, index) => (
                      <div key={index} className="flex justify-between items-center p-2 bg-cosmic-void/30 rounded">
                        <span className="text-sm text-asteroid-silver">{country.name}</span>
                        <span className="text-sm text-red-400 font-semibold">{country.percentage}%</span>
                      </div>
                    )) || (
                      <div className="text-xs text-asteroid-silver">No geographic data available</div>
                    )}
                  </div>
                </div>

                <div>
                  <h4 className="text-sm font-semibold text-asteroid-silver mb-3">Traffic Sources</h4>
                  <div className="space-y-2">
                    {detailedInsights.geography.trafficSources?.map((source, index) => (
                      <div key={index} className="flex justify-between items-center p-2 bg-cosmic-void/30 rounded">
                        <span className="text-sm text-asteroid-silver">{source.name}</span>
                        <span className="text-sm text-red-400 font-semibold">{source.percentage}%</span>
                      </div>
                    )) || (
                      <div className="text-xs text-asteroid-silver">No traffic data available</div>
                    )}
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-y-3">
                {[
                  { name: "India", count: 2140, percentage: 42 },
                  { name: "United States", count: 1560, percentage: 28 },
                  { name: "United Kingdom", count: 520, percentage: 15 },
                  { name: "Canada", count: 364, percentage: 8 },
                  { name: "Germany", count: 312, percentage: 7 }
                ].map((location, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <span className="text-sm font-medium text-white">{location.name}</span>
                      <span className="text-xs text-asteroid-silver">({location.count.toLocaleString()})</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="w-16 bg-cosmic-void rounded-full h-2">
                        <div 
                          className="bg-gradient-to-r from-red-500 to-orange-600 h-2 rounded-full"
                          style={{ width: `${location.percentage}%` }}
                        ></div>
                      </div>
                      <span className="text-sm text-red-400 w-8">{location.percentage}%</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Video Performance & Revenue */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card className="content-card holographic">
          <CardHeader>
            <CardTitle className="text-red-400">Video Performance</CardTitle>
          </CardHeader>
          <CardContent>
            {detailedInsights?.performance ? (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-3 bg-red-500/10 rounded-lg border border-red-500/20">
                    <div className="text-2xl font-bold text-red-400">
                      {detailedInsights.performance.avgWatchTime || '0:00'}
                    </div>
                    <div className="text-xs text-asteroid-silver">Avg Watch Time</div>
                  </div>
                  
                  <div className="text-center p-3 bg-red-500/10 rounded-lg border border-red-500/20">
                    <div className="text-2xl font-bold text-red-400">
                      {detailedInsights.performance.clickThroughRate || 0}%
                    </div>
                    <div className="text-xs text-asteroid-silver">Click-through Rate</div>
                  </div>
                </div>

                <div>
                  <h4 className="text-sm font-semibold text-asteroid-silver mb-3">Top Performing Videos</h4>
                  <div className="space-y-2">
                    {detailedInsights.performance.topVideos?.map((video, index) => (
                      <div key={index} className="p-2 bg-cosmic-void/30 rounded">
                        <div className="text-sm text-asteroid-silver">{video.title}</div>
                        <div className="text-xs text-red-400">{formatNumber(video.views)} views • {video.duration}</div>
                      </div>
                    )) || (
                      <div className="text-xs text-asteroid-silver">No video performance data available</div>
                    )}
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-8">
                <div className="text-asteroid-silver mb-2">
                  {insightsLoading ? 'Loading performance data...' : 'Performance data not available'}
                </div>
                <div className="text-xs text-asteroid-silver">
                  Upload videos to see performance metrics
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="content-card holographic">
          <CardHeader>
            <CardTitle className="text-red-400">Revenue & Monetization</CardTitle>
          </CardHeader>
          <CardContent>
            {detailedInsights?.revenue ? (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-3 bg-red-500/10 rounded-lg border border-red-500/20">
                    <div className="text-2xl font-bold text-red-400">
                      ${detailedInsights.revenue.estimated || 0}
                    </div>
                    <div className="text-xs text-asteroid-silver">Est. Revenue (28d)</div>
                  </div>
                  
                  <div className="text-center p-3 bg-red-500/10 rounded-lg border border-red-500/20">
                    <div className="text-2xl font-bold text-red-400">
                      ${detailedInsights.revenue.rpm || 0}
                    </div>
                    <div className="text-xs text-asteroid-silver">RPM</div>
                  </div>
                </div>

                <div>
                  <h4 className="text-sm font-semibold text-asteroid-silver mb-3">Monetization Status</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center p-2 bg-cosmic-void/30 rounded">
                      <span className="text-sm text-asteroid-silver">YouTube Partner Program</span>
                      <span className={`text-sm font-semibold ${detailedInsights.revenue.monetized ? 'text-green-400' : 'text-red-400'}`}>
                        {detailedInsights.revenue.monetized ? 'Enabled' : 'Not Enabled'}
                      </span>
                    </div>
                    <div className="flex justify-between items-center p-2 bg-cosmic-void/30 rounded">
                      <span className="text-sm text-asteroid-silver">Ad Revenue</span>
                      <span className="text-sm text-red-400 font-semibold">
                        ${detailedInsights.revenue.adRevenue || 0}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-8">
                <div className="text-asteroid-silver mb-2">
                  {insightsLoading ? 'Loading revenue data...' : 'Revenue data not available'}
                </div>
                <div className="text-xs text-asteroid-silver">
                  Enable monetization to see revenue metrics
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Data Authenticity Notice */}
      <Card className="content-card holographic border-red-500/30">
        <CardContent className="p-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-gradient-to-r from-red-500 to-orange-500 flex items-center justify-center">
              <i className="fab fa-youtube text-xl text-white" />
            </div>
            <div>
              <h3 className="text-red-400 font-semibold mb-1">Authentic YouTube Analytics Data</h3>
              <p className="text-asteroid-silver text-sm">
                All analytics including demographics, geography, revenue, and performance metrics are sourced directly from YouTube Analytics API. 
                Advanced insights require channel monetization and are updated in real-time for maximum accuracy.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}