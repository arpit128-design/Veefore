import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useWorkspace } from "@/hooks/useWorkspace";
import { useToast } from "@/hooks/use-toast";
import { TrendingUp, Hash, RefreshCw, Target, Zap, Eye } from "lucide-react";

interface TrendData {
  id: string;
  type: 'hashtag' | 'audio' | 'content' | 'format';
  name: string;
  popularity: number;
  growth: number;
  engagement: number;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  platforms: string[];
  description: string;
  exampleContent?: string;
}

export function TrendAnalyzer() {
  const { currentWorkspace } = useWorkspace();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: trendData, isLoading, refetch } = useQuery({
    queryKey: ['authentic-trends', currentWorkspace?.id],
    queryFn: async () => {
      console.log('[CLIENT DEBUG] Fetching cached trends for workspace:', currentWorkspace?.id);
      
      // Fetch cached trending data (free) - no credit deduction
      try {
        const response = await apiRequest('GET', `/api/analytics/trends-cache?category=all`);
        console.log('[CLIENT DEBUG] Raw response:', response);
        
        // Check if response is already parsed JSON or needs parsing
        let jsonData;
        if (response && typeof response === 'object' && !response.json) {
          // Already parsed JSON
          jsonData = response;
        } else {
          // Need to parse JSON
          jsonData = await response.json();
        }
        
        console.log('[CLIENT DEBUG] Parsed JSON data:', jsonData);
        console.log('[CLIENT DEBUG] Success status:', jsonData?.success);
        console.log('[CLIENT DEBUG] Hashtags array:', jsonData?.hashtags);
        console.log('[CLIENT DEBUG] Hashtags count:', jsonData?.hashtags?.length || 0);
        
        return jsonData;
      } catch (error) {
        console.error('[CLIENT DEBUG] Error fetching trends:', error);
        throw error;
      }
    },
    enabled: !!currentWorkspace?.id,
    refetchInterval: 5 * 60 * 1000, // Refresh every 5 minutes
    staleTime: 2 * 60 * 1000 // Consider data stale after 2 minutes
  });

  const refreshTrendsMutation = useMutation({
    mutationFn: async () => {
      console.log('[REFRESH TRENDS MUTATION] Starting credit-based refresh with workspace:', currentWorkspace?.id);
      
      if (!currentWorkspace?.id) {
        throw new Error('No workspace selected');
      }
      
      // Get fresh Firebase token before making the request
      let token = localStorage.getItem('veefore_auth_token');
      
      // Validate token format and refresh if needed
      if (!token || token.split('.').length !== 3) {
        console.log('[REFRESH TRENDS MUTATION] Invalid token detected, refreshing...');
        try {
          const { auth } = await import('@/lib/firebase');
          if (auth?.currentUser) {
            const freshToken = await auth.currentUser.getIdToken(true);
            if (freshToken && freshToken.split('.').length === 3) {
              localStorage.setItem('veefore_auth_token', freshToken);
              token = freshToken;
              console.log('[REFRESH TRENDS MUTATION] Token refreshed successfully');
            }
          }
        } catch (error) {
          console.error('[REFRESH TRENDS MUTATION] Token refresh failed:', error);
        }
      }
      
      console.log('[REFRESH TRENDS MUTATION] Making POST request to /api/analytics/refresh-trends');
      const response = await apiRequest('POST', '/api/analytics/refresh-trends', {
        workspaceId: currentWorkspace.id
      });
      
      console.log('[REFRESH TRENDS MUTATION] POST response:', response);
      return response;
    },
    onSuccess: () => {
      toast({
        title: "Trends Updated!",
        description: "Latest trend data has been fetched from social platforms.",
      });
      refetch();
      // Force refresh workspace data to update credits display
      queryClient.invalidateQueries({ queryKey: ['/api/workspaces'] });
    },
    onError: (error: any) => {
      console.error('[REFRESH TRENDS] Error:', error);
      toast({
        title: "Update Failed",
        description: error.message || "Failed to update trend data",
        variant: "destructive",
      });
    }
  });

  // Process authentic trending data from Perplexity API
  const authenticTrends = trendData ? {
    hashtags: (trendData as any).hashtags?.map((trend: any, index: number) => ({
      id: trend.id || `hashtag-${index}`,
      type: 'hashtag' as const,
      name: trend.tag?.startsWith('#') ? trend.tag : `#${trend.tag}`,
      popularity: trend.popularity || 75,
      growth: trend.growth || 15,
      engagement: typeof trend.engagement === 'string' ? parseInt(trend.engagement.replace(/K|M/g, '')) || 85 : trend.engagement || 85,
      difficulty: (trend.difficulty as 'Easy' | 'Medium' | 'Hard') || 'Medium',
      platforms: Array.isArray(trend.platforms) ? trend.platforms : ['Instagram'],
      description: `Authentic trending hashtag with ${trend.engagement || '10K'} engagement - personalized for ${trend.category || 'lifestyle'} content`
    })) || []
  } : { hashtags: [] };

  // Extract hashtags from response - check multiple possible locations
  const finalHashtags = authenticTrends.hashtags.length > 0 ? authenticTrends.hashtags : 
    (trendData as any)?.hashtags?.map((trend: any, index: number) => ({
      id: trend.id || `hashtag-${index}`,
      type: 'hashtag' as const,
      name: trend.tag?.startsWith('#') ? trend.tag : `#${trend.tag || trend.name}`,
      popularity: trend.popularity || 75,
      growth: trend.growth || 15,
      engagement: trend.engagement || trend.uses || '10K',
      difficulty: (trend.difficulty as 'Easy' | 'Medium' | 'Hard') || 'Medium',
      platforms: Array.isArray(trend.platforms) ? trend.platforms : ['Instagram'],
      description: `Trending ${trend.category || 'lifestyle'} hashtag with ${trend.uses || trend.engagement || '10K'} uses`
    })) || [];

  console.log('TrendAnalyzer Debug:', {
    trendData: trendData,
    hashtagsFromResponse: (trendData as any)?.hashtags?.length || 0,
    firstHashtag: (trendData as any)?.hashtags?.[0],
    responseKeys: Object.keys(trendData || {}),
    success: (trendData as any)?.success
  });

  // Fallback data only when API is loading
  const mockTrends: { [key: string]: TrendData[] } = {
    hashtags: [
      {
        id: "1",
        type: "hashtag",
        name: "#MotivationMonday",
        popularity: 92,
        growth: 15,
        engagement: 8.4,
        difficulty: "Easy",
        platforms: ["Instagram", "Twitter", "TikTok"],
        description: "Weekly motivational content that performs well on Mondays"
      },
      {
        id: "2",
        type: "hashtag",
        name: "#ContentCreator",
        popularity: 88,
        growth: 23,
        engagement: 12.1,
        difficulty: "Medium",
        platforms: ["Instagram", "YouTube"],
        description: "General creator content with high engagement rates"
      },
      {
        id: "3",
        type: "hashtag",
        name: "#ProductivityHacks",
        popularity: 76,
        growth: 34,
        engagement: 9.7,
        difficulty: "Medium",
        platforms: ["LinkedIn", "Twitter"],
        description: "Professional content focusing on productivity tips"
      }
    ],
    audio: [
      {
        id: "4",
        type: "audio",
        name: "Uplifting Motivational Beat",
        popularity: 94,
        growth: 28,
        engagement: 15.2,
        difficulty: "Easy",
        platforms: ["TikTok", "Instagram Reels"],
        description: "High-energy track perfect for transformation content"
      },
      {
        id: "5",
        type: "audio",
        name: "Chill Lo-Fi Study Mix",
        popularity: 87,
        growth: 12,
        engagement: 11.3,
        difficulty: "Easy",
        platforms: ["YouTube", "TikTok"],
        description: "Background music for educational and lifestyle content"
      }
    ],
    content: [
      {
        id: "6",
        type: "content",
        name: "Before & After Transformations",
        popularity: 96,
        growth: 41,
        engagement: 18.7,
        difficulty: "Medium",
        platforms: ["Instagram", "TikTok"],
        description: "Visual comparison content showing progress or changes"
      },
      {
        id: "7",
        type: "content",
        name: "Day in My Life",
        popularity: 89,
        growth: 19,
        engagement: 13.5,
        difficulty: "Easy",
        platforms: ["TikTok", "YouTube"],
        description: "Personal vlogs showing daily routines and activities"
      }
    ]
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Easy': return 'bg-green-400/20 text-green-400';
      case 'Medium': return 'bg-blue-400/20 text-blue-400';
      case 'Hard': return 'bg-red-400/20 text-red-400';
      default: return 'bg-gray-400/20 text-gray-400';
    }
  };

  const getPopularityColor = (popularity: number) => {
    if (popularity >= 90) return 'text-green-400';
    if (popularity >= 70) return 'text-blue-400';
    return 'text-red-400';
  };

  const getIconForType = (type: string) => {
    switch (type) {
      case 'hashtag': return <Hash className="h-5 w-5" />;
      default: return <TrendingUp className="h-5 w-5" />;
    }
  };

  const renderTrendCard = (trend: TrendData) => (
    <div key={trend.id} className="p-4 rounded-lg bg-cosmic-blue border border-electric-cyan/20 hover:border-electric-cyan/40 transition-colors">
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center space-x-3">
          <div className="text-electric-cyan">
            {getIconForType(trend.type)}
          </div>
          <div>
            <h4 className="font-semibold">{trend.name}</h4>
            <p className="text-xs text-asteroid-silver">{trend.description}</p>
          </div>
        </div>
        <Badge className={getDifficultyColor(trend.difficulty)}>
          {trend.difficulty}
        </Badge>
      </div>

      <div className="grid grid-cols-3 gap-4 mb-3">
        <div className="text-center">
          <div className={`text-lg font-bold ${getPopularityColor(trend.popularity)}`}>
            {trend.popularity}%
          </div>
          <div className="text-xs text-asteroid-silver">Popularity</div>
        </div>
        <div className="text-center">
          <div className="text-lg font-bold text-green-400">+{trend.growth}%</div>
          <div className="text-xs text-asteroid-silver">Growth</div>
        </div>
        <div className="text-center">
          <div className="text-lg font-bold text-electric-cyan">{trend.engagement}%</div>
          <div className="text-xs text-asteroid-silver">Engagement</div>
        </div>
      </div>

      <div className="space-y-2">
        <div className="flex justify-between text-xs">
          <span className="text-asteroid-silver">Popularity Score</span>
          <span className={getPopularityColor(trend.popularity)}>{trend.popularity}%</span>
        </div>
        <Progress value={trend.popularity} className="h-1" />
      </div>

      <div className="mt-3">
        <div className="text-xs text-asteroid-silver mb-2">Platforms:</div>
        <div className="flex flex-wrap gap-1">
          {trend.platforms.map((platform) => (
            <Badge key={platform} variant="outline" className="text-xs">
              {platform}
            </Badge>
          ))}
        </div>
      </div>

      <Button size="sm" className="w-full mt-3 bg-electric-cyan/20 text-electric-cyan hover:bg-electric-cyan/30">
        Use This Trend
      </Button>
    </div>
  );

  return (
    <Card className="content-card holographic">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-2xl font-orbitron font-semibold neon-text text-electric-cyan">
          Trend Intelligence Center
        </CardTitle>
        <Button
          onClick={() => {
            console.log('[REFRESH BUTTON] Button clicked, workspace:', currentWorkspace);
            
            if (!currentWorkspace) {
              console.log('[REFRESH BUTTON] No workspace selected');
              toast({
                title: "No Workspace Selected",
                description: "Please select a workspace to refresh trends.",
                variant: "destructive",
              });
              return;
            }

            // Note: Credits are now user-based, not workspace-specific
            // The system will check user credits on the server side

            console.log('[REFRESH BUTTON] Triggering refresh trends mutation...');
            refreshTrendsMutation.mutate();
          }}
          disabled={refreshTrendsMutation.isPending || isLoading}
          variant="outline"
          className="glassmorphism"
        >
          <RefreshCw className={`w-4 h-4 mr-2 ${(refreshTrendsMutation.isPending || isLoading) ? 'animate-spin' : ''}`} />
          Refresh Trends
        </Button>
      </CardHeader>
      <CardContent>
        {/* Trending Hashtags Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="p-4 rounded-lg bg-electric-cyan/10 border border-electric-cyan/30 text-center">
            <TrendingUp className="h-8 w-8 text-electric-cyan mx-auto mb-2" />
            <div className="text-2xl font-bold text-electric-cyan">
              {isLoading ? '...' : authenticTrends.hashtags.length || '0'}
            </div>
            <div className="text-sm text-asteroid-silver">Trending Hashtags</div>
          </div>
          <div className="p-4 rounded-lg bg-nebula-purple/10 border border-nebula-purple/30 text-center">
            <Hash className="h-8 w-8 text-nebula-purple mx-auto mb-2" />
            <div className="text-2xl font-bold text-nebula-purple">
              {isLoading ? '...' : authenticTrends.hashtags.filter((h: any) => h.popularity >= 80).length || '0'}
            </div>
            <div className="text-sm text-asteroid-silver">High Potential</div>
          </div>
          <div className="p-4 rounded-lg bg-green-400/10 border border-green-400/30 text-center">
            <Eye className="h-8 w-8 text-green-400 mx-auto mb-2" />
            <div className="text-2xl font-bold text-green-400">
              {(trendData as any)?.accuracy || '98%'}
            </div>
            <div className="text-sm text-asteroid-silver">Data Accuracy</div>
          </div>
        </div>

        {/* Trending Hashtags Content */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-semibold text-white">Trending Hashtags</h3>
            <span className="text-sm text-asteroid-silver">Real-time data from social platforms</span>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {isLoading ? (
              <div className="col-span-full text-center py-8">
                <div className="animate-spin w-8 h-8 border-4 border-electric-cyan border-t-transparent rounded-full mx-auto mb-4" />
                <p className="text-asteroid-silver">Loading authentic trending hashtags...</p>
              </div>
            ) : authenticTrends.hashtags.length > 0 ? (
              authenticTrends.hashtags.map(renderTrendCard)
            ) : (
              <div className="col-span-full text-center py-8">
                <p className="text-asteroid-silver">No trending hashtags available. Click refresh to fetch latest data.</p>
              </div>
            )}
          </div>
        </div>

        {/* AI Insights */}
        <div className="mt-8 p-6 rounded-lg bg-gradient-to-r from-electric-cyan/10 to-nebula-purple/10 border border-electric-cyan/30">
          <div className="flex items-center space-x-3 mb-4">
            <Zap className="h-6 w-6 text-electric-cyan" />
            <h3 className="text-lg font-semibold">AI Trend Insights</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <h4 className="font-medium text-electric-cyan mb-2">🔥 Hot Right Now</h4>
              <p className="text-asteroid-silver">
                Transformation content is performing 45% better this week. Consider creating before/after posts.
              </p>
            </div>
            <div>
              <h4 className="font-medium text-nebula-purple mb-2">📈 Rising Trends</h4>
              <p className="text-asteroid-silver">
                Educational content with quick tips is gaining momentum. Posts with "hack" or "tip" perform 32% better.
              </p>
            </div>
            <div>
              <h4 className="font-medium text-solar-gold mb-2">⚡ Quick Win</h4>
              <p className="text-asteroid-silver">
                Use trending audio within 24 hours of viral detection for maximum reach potential.
              </p>
            </div>
            <div>
              <h4 className="font-medium text-green-400mb-2">🎯 Platform Specific</h4>
              <p className="text-asteroid-silver">
                TikTok favors vertical videos under 30s, while Instagram Reels perform best at 15-30s with trending audio.
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
