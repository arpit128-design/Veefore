import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { Search, TrendingUp, AlertCircle, Eye, MessageSquare, Share2, ThumbsUp, Users, MapPin, Clock, Filter, Bell, Zap, Globe, Target, Sparkles, Loader2 } from "lucide-react";

interface SocialListeningData {
  id: string;
  keyword: string;
  platform: string;
  mentions: number;
  sentiment: 'positive' | 'neutral' | 'negative';
  reach: number;
  engagement: number;
  trendingScore: number;
  lastUpdated: string;
  topMentions: {
    content: string;
    author: string;
    platform: string;
    engagement: number;
    sentiment: 'positive' | 'neutral' | 'negative';
    url: string;
  }[];
  demographics: {
    ageGroups: { range: string; percentage: number }[];
    locations: { country: string; percentage: number }[];
    interests: string[];
  };
  viralPotential: {
    score: number;
    factors: string[];
    predictedReach: number;
  };
}

interface ListeningAlert {
  id: string;
  type: 'brand_mention' | 'competitor_mention' | 'trending_topic' | 'negative_sentiment';
  title: string;
  description: string;
  priority: 'high' | 'medium' | 'low';
  timestamp: string;
  actionRequired: boolean;
  suggestedResponse?: string;
}

export default function SocialListening() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedPlatform, setSelectedPlatform] = useState("all");
  const [monitoringKeywords, setMonitoringKeywords] = useState<string[]>([]);
  const [newKeyword, setNewKeyword] = useState("");
  const [listeningResult, setListeningResult] = useState<any>(null);
  const [selectedTimeframe, setSelectedTimeframe] = useState("7d");
  const [activeTab, setActiveTab] = useState("overview");
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Get user data for credit checking
  const { data: user } = useQuery({
    queryKey: ["/api/user"],
    refetchInterval: 30000
  });

  const socialListeningMutation = useMutation({
    mutationFn: async (data: {
      keywords: string[];
      platforms: string[];
      sentiment?: string;
      timeframe: string;
      location?: string;
      language?: string;
      includeInfluencers?: boolean;
    }) => {
      const result = await apiRequest('POST', '/api/ai/social-listening', data);
      return result;
    },
    onSuccess: (data) => {
      setListeningResult(data);
      setActiveTab('insights');
      toast({
        title: "Social Listening Analysis Complete!",
        description: "Your comprehensive social listening report is ready with AI insights.",
      });
      queryClient.invalidateQueries({ queryKey: ['/api/social-listening'] });
    },
    onError: (error: any) => {
      console.error('Social listening analysis failed:', error);
      toast({
        title: "Analysis Failed",
        description: error.message || "Unable to complete social listening analysis. Please try again.",
        variant: "destructive"
      });
    }
  });



  const handleAnalyze = () => {
    if (monitoringKeywords.length === 0) {
      toast({
        title: "No Keywords Selected",
        description: "Please add keywords to monitor",
        variant: "destructive"
      });
      return;
    }

    socialListeningMutation.mutate({
      keywords: monitoringKeywords,
      platforms: selectedPlatform === "all" ? ["twitter", "instagram", "youtube", "tiktok"] : [selectedPlatform],
      timeframe: selectedTimeframe,
      includeInfluencers: true
    });
  };

  const addKeyword = () => {
    if (newKeyword.trim() && !monitoringKeywords.includes(newKeyword.trim())) {
      setMonitoringKeywords([...monitoringKeywords, newKeyword.trim()]);
      setNewKeyword("");
    }
  };

  const removeKeyword = (keyword: string) => {
    setMonitoringKeywords(monitoringKeywords.filter(k => k !== keyword));
  };

  const getPlatformIcon = (platform: string) => {
    const icons = {
      twitter: "𝕏",
      instagram: "📷",
      youtube: "📺",
      tiktok: "🎵",
      all: "🌐"
    };
    return icons[platform as keyof typeof icons] || "🌐";
  };

  const getSentimentColor = (sentiment: string) => {
    switch (sentiment) {
      case 'positive': return 'text-green-400';
      case 'negative': return 'text-red-400';
      default: return 'text-yellow-400';
    }
  };

  const handleStartAnalysis = () => {
    if (monitoringKeywords.length === 0) {
      toast({
        title: "Keywords Required",
        description: "Please add at least one keyword to monitor.",
        variant: "destructive"
      });
      return;
    }

    const platforms = selectedPlatform === 'all' ? ['twitter', 'instagram', 'youtube', 'tiktok'] : [selectedPlatform];

    socialListeningMutation.mutate({
      keywords: monitoringKeywords,
      platforms,
      timeframe: selectedTimeframe,
      sentiment: 'all',
      language: 'en',
      includeInfluencers: true
    });
  };

  return (
    <div 
      className="space-y-6 p-6 max-w-7xl mx-auto"
      style={{ 
        background: 'transparent',
        minHeight: '100vh'
      }}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
            Social Listening Engine
          </h1>
          <p className="text-gray-400 mt-2">
            Monitor trends, brand mentions, and emerging conversations across all platforms
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Globe className="h-5 w-5 text-blue-400" />
          <span className="text-sm text-gray-400">Real-time monitoring</span>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Card className="bg-gray-900/50 border-gray-700">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400">Active Keywords</p>
                <p className="text-2xl font-bold text-white">{monitoringKeywords.length}</p>
              </div>
              <Target className="h-8 w-8 text-blue-400" />
            </div>
          </CardContent>
        </Card>
        <Card className="bg-gray-900/50 border-gray-700">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400">Total Mentions</p>
                <p className="text-2xl font-bold text-white">15.4K</p>
              </div>
              <MessageSquare className="h-8 w-8 text-green-400" />
            </div>
          </CardContent>
        </Card>
        <Card className="bg-gray-900/50 border-gray-700">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400">Sentiment Score</p>
                <p className="text-2xl font-bold text-green-400">+78%</p>
              </div>
              <TrendingUp className="h-8 w-8 text-green-400" />
            </div>
          </CardContent>
        </Card>
        <Card className="bg-gray-900/50 border-gray-700">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400">Active Alerts</p>
                <p className="text-2xl font-bold text-orange-400">2</p>
              </div>
              <AlertCircle className="h-8 w-8 text-orange-400" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="monitor" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4 bg-gray-900/50">
          <TabsTrigger value="monitor" className="data-[state=active]:bg-blue-600">
            <Search className="h-4 w-4 mr-2" />
            Monitor
          </TabsTrigger>
          <TabsTrigger value="insights" className="data-[state=active]:bg-purple-600">
            <Eye className="h-4 w-4 mr-2" />
            Insights
          </TabsTrigger>
          <TabsTrigger value="alerts" className="data-[state=active]:bg-orange-600">
            <Bell className="h-4 w-4 mr-2" />
            Alerts
          </TabsTrigger>
          <TabsTrigger value="analytics" className="data-[state=active]:bg-green-600">
            <TrendingUp className="h-4 w-4 mr-2" />
            Analytics
          </TabsTrigger>
        </TabsList>

        {/* Monitor Tab */}
        <TabsContent value="monitor" className="space-y-6">
          <Card className="bg-gray-900/50 border-gray-700">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="h-5 w-5 text-blue-400" />
                Keyword Monitoring Setup
              </CardTitle>
              <CardDescription>
                Add keywords, brands, or hashtags to monitor across social platforms
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-2">
                <Input
                  placeholder="Enter keyword, #hashtag, or @mention"
                  value={newKeyword}
                  onChange={(e) => setNewKeyword(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && addKeyword()}
                  className="bg-gray-800 border-gray-600"
                />
                <Button onClick={addKeyword} className="bg-blue-600 hover:bg-blue-700">
                  Add
                </Button>
              </div>

              {monitoringKeywords.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {monitoringKeywords.map((keyword) => (
                    <Badge 
                      key={keyword} 
                      variant="secondary" 
                      className="bg-gray-700 text-white cursor-pointer"
                      onClick={() => removeKeyword(keyword)}
                    >
                      {keyword} ×
                    </Badge>
                  ))}
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Platform Focus</Label>
                  <Select value={selectedPlatform} onValueChange={setSelectedPlatform}>
                    <SelectTrigger className="bg-gray-800 border-gray-600">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Platforms</SelectItem>
                      <SelectItem value="twitter">Twitter/X</SelectItem>
                      <SelectItem value="instagram">Instagram</SelectItem>
                      <SelectItem value="youtube">YouTube</SelectItem>
                      <SelectItem value="tiktok">TikTok</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Analysis Depth</Label>
                  <Select defaultValue="comprehensive">
                    <SelectTrigger className="bg-gray-800 border-gray-600">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="basic">Basic Monitoring</SelectItem>
                      <SelectItem value="comprehensive">Comprehensive Analysis</SelectItem>
                      <SelectItem value="advanced">Advanced Insights</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <Button 
                onClick={handleStartAnalysis} 
                disabled={socialListeningMutation.isPending || monitoringKeywords.length === 0}
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
              >
                {socialListeningMutation.isPending ? (
                  <>
                    <Sparkles className="mr-2 h-4 w-4 animate-spin" />
                    Analyzing Social Signals...
                  </>
                ) : (
                  <>
                    <Zap className="mr-2 h-4 w-4" />
                    Start Monitoring (4 Credits)
                  </>
                )}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Insights Tab */}
        <TabsContent value="insights" className="space-y-6">
          {!listeningResult ? (
            <Card className="bg-cosmic-void/40 border-asteroid-silver/30">
              <CardContent className="p-12 text-center">
                <div className="flex flex-col items-center gap-4">
                  <div className="w-16 h-16 rounded-full bg-gradient-to-r from-electric-cyan/20 to-solar-gold/20 flex items-center justify-center">
                    <Search className="w-8 h-8 text-electric-cyan" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-white mb-2">Start Social Listening Analysis</h3>
                    <p className="text-asteroid-silver">Add keywords in the Monitor tab and run analysis to see AI-powered insights</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ) : socialListeningMutation.isPending ? (
            <Card className="bg-cosmic-void/40 border-asteroid-silver/30">
              <CardContent className="p-12 text-center">
                <div className="flex flex-col items-center gap-4">
                  <Loader2 className="w-8 h-8 animate-spin text-electric-cyan" />
                  <div>
                    <h3 className="text-xl font-semibold text-white mb-2">Analyzing Social Media Data</h3>
                    <p className="text-asteroid-silver">AI is processing mentions, sentiment, and trends across platforms...</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Summary Card */}
              <Card className="bg-cosmic-void/40 border-asteroid-silver/30">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-white">
                    <TrendingUp className="w-5 h-5 text-electric-cyan" />
                    Analysis Summary
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center p-3 bg-electric-cyan/10 rounded border border-electric-cyan/20">
                      <p className="text-2xl font-bold text-electric-cyan">{listeningResult.summary?.totalMentions?.toLocaleString() || '0'}</p>
                      <p className="text-sm text-asteroid-silver">Total Mentions</p>
                    </div>
                    <div className="text-center p-3 bg-solar-gold/10 rounded border border-solar-gold/20">
                      <p className="text-2xl font-bold text-solar-gold">{listeningResult.summary?.sentimentDistribution?.positive || 0}%</p>
                      <p className="text-sm text-asteroid-silver">Positive Sentiment</p>
                    </div>
                  </div>
                  
                  {listeningResult.summary?.trendingTopics && listeningResult.summary.trendingTopics.length > 0 && (
                    <div>
                      <p className="text-sm font-medium text-white mb-2">Trending Topics</p>
                      <div className="flex flex-wrap gap-2">
                        {listeningResult.summary.trendingTopics.slice(0, 5).map((topic: string, index: number) => (
                          <Badge key={index} className="bg-electric-cyan/20 text-electric-cyan border-electric-cyan/30">
                            {topic}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Brand Mentions */}
              <Card className="bg-cosmic-void/40 border-asteroid-silver/30">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-white">
                    <MessageSquare className="w-5 h-5 text-electric-cyan" />
                    Recent Mentions
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {listeningResult.insights?.brandMentions?.slice(0, 3).map((mention: any, index: number) => (
                    <div key={index} className="p-3 bg-gray-800/50 rounded border border-gray-700">
                      <p className="text-sm text-white mb-2">{mention.content}</p>
                      <div className="flex items-center justify-between">
                        <Badge className={`${getSentimentColor(mention.sentiment)} bg-transparent border`}>
                          {mention.sentiment}
                        </Badge>
                        <span className="text-xs text-asteroid-silver">{mention.platform}</span>
                      </div>
                    </div>
                  )) || (
                    <p className="text-asteroid-silver text-center py-4">No recent mentions found</p>
                  )}
                </CardContent>
              </Card>

              {/* Recommendations */}
              <Card className="bg-cosmic-void/40 border-asteroid-silver/30 lg:col-span-2">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-white">
                    <Sparkles className="w-5 h-5 text-electric-cyan" />
                    AI Recommendations
                  </CardTitle>
                </CardHeader>
                <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {listeningResult.recommendations?.engagementOpportunities && (
                    <div>
                      <h4 className="font-medium text-electric-cyan mb-3">Engagement Opportunities</h4>
                      <ul className="space-y-2">
                        {listeningResult.recommendations.engagementOpportunities.slice(0, 3).map((opportunity: string, index: number) => (
                          <li key={index} className="text-sm text-asteroid-silver flex items-start gap-2">
                            <div className="w-1.5 h-1.5 rounded-full bg-electric-cyan mt-2 flex-shrink-0"></div>
                            {opportunity}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                  
                  {listeningResult.recommendations?.contentSuggestions && (
                    <div>
                      <h4 className="font-medium text-solar-gold mb-3">Content Suggestions</h4>
                      <ul className="space-y-2">
                        {listeningResult.recommendations.contentSuggestions.slice(0, 3).map((suggestion: string, index: number) => (
                          <li key={index} className="text-sm text-asteroid-silver flex items-start gap-2">
                            <div className="w-1.5 h-1.5 rounded-full bg-solar-gold mt-2 flex-shrink-0"></div>
                            {suggestion}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          )}
        </TabsContent>

        {/* Alerts Tab */}
        <TabsContent value="alerts" className="space-y-6">
          <Card className="bg-gray-900/50 border-gray-700">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="h-5 w-5 text-orange-400" />
                Active Alerts
              </CardTitle>
              <CardDescription>
                Real-time notifications about brand mentions and trending topics
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {socialListeningMutation.isPending ? (
                <div className="flex items-center justify-center p-8">
                  <Loader2 className="h-8 w-8 animate-spin text-purple-400" />
                  <span className="ml-2 text-gray-400">Analyzing social media mentions...</span>
                </div>
              ) : listeningResult?.recommendations?.crisisAlerts?.length > 0 ? (
                listeningResult.recommendations.crisisAlerts.map((alert: string, index: number) => (
                  <Card key={index} className="bg-gray-800/50 border-gray-600">
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between">
                        <div className="space-y-2">
                          <div className="flex items-center gap-2">
                            <Badge variant="destructive">high</Badge>
                            <h3 className="font-medium">Crisis Alert</h3>
                          </div>
                          <p className="text-sm text-gray-400">{alert}</p>
                        </div>
                        <div className="text-xs text-gray-500">
                          {new Date().toLocaleTimeString()}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              ) : (
                <div className="text-center p-8 text-gray-400">
                  <Bell className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>No active alerts. Run a social listening analysis to monitor brand mentions and trends.</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Analytics Tab */}
        <TabsContent value="analytics" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="bg-gray-900/50 border-gray-700">
              <CardHeader>
                <CardTitle>Audience Demographics</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {socialListeningMutation.isPending ? (
                  <div className="flex items-center justify-center p-8">
                    <Loader2 className="h-8 w-8 animate-spin text-purple-400" />
                    <span className="ml-2 text-gray-400">Analyzing audience demographics...</span>
                  </div>
                ) : listeningResult?.summary ? (
                  <div>
                    <p className="text-sm font-medium mb-2">Platform Distribution</p>
                    {listeningResult.summary.topPlatforms?.map((platform: any, index: number) => (
                      <div key={index} className="flex items-center justify-between mb-1">
                        <span className="text-sm capitalize">{platform.platform}</span>
                        <div className="flex items-center gap-2">
                          <Progress value={(platform.mentions / listeningResult.summary.totalMentions) * 100} className="w-20" />
                          <span className="text-sm w-12">{platform.mentions}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center p-8 text-gray-400">
                    <Users className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>Run social listening analysis to view platform demographics.</p>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card className="bg-gray-900/50 border-gray-700">
              <CardHeader>
                <CardTitle>Geographic Distribution</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {socialListeningMutation.isPending ? (
                  <div className="flex items-center justify-center p-8">
                    <Loader2 className="h-8 w-8 animate-spin text-purple-400" />
                    <span className="ml-2 text-gray-400">Analyzing geographic distribution...</span>
                  </div>
                ) : listeningResult?.summary?.trendingTopics?.length > 0 ? (
                  listeningResult.summary.trendingTopics.map((topic: string, index: number) => (
                    <div key={index} className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4 text-gray-400" />
                        <span className="text-sm">{topic}</span>
                      </div>
                      <Badge variant="secondary" className="text-xs">Trending</Badge>
                    </div>
                  ))
                ) : (
                  <div className="text-center p-8 text-gray-400">
                    <MapPin className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>Run social listening analysis to view trending topics by location.</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}