import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useWorkspace } from "@/hooks/useWorkspace";
import { useToast } from "@/hooks/use-toast";
import { TrendingUp, Hash, Music, Video, Image, RefreshCw, Target, Zap, Eye } from "lucide-react";

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
    queryKey: ['trends', currentWorkspace?.id],
    queryFn: async () => {
      // Fetch real trend data from APIs
      const response = await fetch(`/api/analytics?workspaceId=${currentWorkspace?.id}&type=trends`);
      if (!response.ok) {
        throw new Error('Failed to fetch trend data');
      }
      return response.json();
    },
    enabled: !!currentWorkspace?.id
  });

  const refreshTrendsMutation = useMutation({
    mutationFn: () => apiRequest('POST', '/api/analytics/refresh-trends', {
      workspaceId: currentWorkspace?.id
    }),
    onSuccess: () => {
      toast({
        title: "Trends Updated!",
        description: "Latest trend data has been fetched from social platforms.",
      });
      refetch();
    },
    onError: (error: any) => {
      toast({
        title: "Update Failed",
        description: error.message || "Failed to update trend data",
        variant: "destructive",
      });
    }
  });

  // Mock trending data for display (in real app, this would come from APIs)
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
      case 'Medium': return 'bg-yellow-400/20 text-yellow-400';
      case 'Hard': return 'bg-red-400/20 text-red-400';
      default: return 'bg-gray-400/20 text-gray-400';
    }
  };

  const getPopularityColor = (popularity: number) => {
    if (popularity >= 90) return 'text-green-400';
    if (popularity >= 70) return 'text-yellow-400';
    return 'text-red-400';
  };

  const getIconForType = (type: string) => {
    switch (type) {
      case 'hashtag': return <Hash className="h-5 w-5" />;
      case 'audio': return <Music className="h-5 w-5" />;
      case 'content': return <Video className="h-5 w-5" />;
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
          onClick={() => refreshTrendsMutation.mutate()}
          disabled={refreshTrendsMutation.isPending || isLoading}
          variant="outline"
          className="glassmorphism"
        >
          <RefreshCw className={`w-4 h-4 mr-2 ${(refreshTrendsMutation.isPending || isLoading) ? 'animate-spin' : ''}`} />
          Refresh Trends
        </Button>
      </CardHeader>
      <CardContent>
        {/* Trend Overview Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="p-4 rounded-lg bg-electric-cyan/10 border border-electric-cyan/30 text-center">
            <TrendingUp className="h-8 w-8 text-electric-cyan mx-auto mb-2" />
            <div className="text-2xl font-bold text-electric-cyan">247</div>
            <div className="text-sm text-asteroid-silver">Trending Tags</div>
          </div>
          <div className="p-4 rounded-lg bg-nebula-purple/10 border border-nebula-purple/30 text-center">
            <Music className="h-8 w-8 text-nebula-purple mx-auto mb-2" />
            <div className="text-2xl font-bold text-nebula-purple">156</div>
            <div className="text-sm text-asteroid-silver">Viral Audio</div>
          </div>
          <div className="p-4 rounded-lg bg-solar-gold/10 border border-solar-gold/30 text-center">
            <Video className="h-8 w-8 text-solar-gold mx-auto mb-2" />
            <div className="text-2xl font-bold text-solar-gold">89</div>
            <div className="text-sm text-asteroid-silver">Content Formats</div>
          </div>
          <div className="p-4 rounded-lg bg-green-400/10 border border-green-400/30 text-center">
            <Eye className="h-8 w-8 text-green-400 mx-auto mb-2" />
            <div className="text-2xl font-bold text-green-400">92%</div>
            <div className="text-sm text-asteroid-silver">Accuracy Rate</div>
          </div>
        </div>

        {/* Trend Categories */}
        <Tabs defaultValue="hashtags" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3 glassmorphism">
            <TabsTrigger value="hashtags">Trending Hashtags</TabsTrigger>
            <TabsTrigger value="audio">Viral Audio</TabsTrigger>
            <TabsTrigger value="content">Content Formats</TabsTrigger>
          </TabsList>

          <TabsContent value="hashtags" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {mockTrends.hashtags.map(renderTrendCard)}
            </div>
          </TabsContent>

          <TabsContent value="audio" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {mockTrends.audio.map(renderTrendCard)}
            </div>
          </TabsContent>

          <TabsContent value="content" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {mockTrends.content.map(renderTrendCard)}
            </div>
          </TabsContent>
        </Tabs>

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
