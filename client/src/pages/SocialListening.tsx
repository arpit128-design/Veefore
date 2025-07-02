import { useState } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
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
import { Search, TrendingUp, AlertCircle, Eye, MessageSquare, Share2, ThumbsUp, Users, MapPin, Clock, Filter, Bell, Zap, Globe, Target, Sparkles } from "lucide-react";

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
  const { toast } = useToast();

  const createListeningAnalysisMutation = useMutation({
    mutationFn: (data: { 
      keywords: string[]; 
      platforms: string[]; 
      analysisType: string;
      dateRange: string;
    }) => apiRequest('POST', '/api/ai/social-listening', data),
    onSuccess: (data: SocialListeningData[]) => {
      toast({
        title: "Social Listening Analysis Complete",
        description: `Found ${data.length} trending mentions and insights across platforms`
      });
    },
    onError: () => {
      toast({
        title: "Analysis Failed",
        description: "Unable to complete social listening analysis. Please try again.",
        variant: "destructive"
      });
    }
  });

  // Mock data for demonstration
  const mockListeningData: SocialListeningData[] = [
    {
      id: "1",
      keyword: "content creation",
      platform: "all",
      mentions: 15420,
      sentiment: "positive",
      reach: 2100000,
      engagement: 18.5,
      trendingScore: 89,
      lastUpdated: new Date().toISOString(),
      topMentions: [
        {
          content: "The future of content creation is here! AI tools are revolutionizing how we create...",
          author: "@techguru2024",
          platform: "twitter",
          engagement: 1250,
          sentiment: "positive",
          url: "https://twitter.com/example"
        },
        {
          content: "Best content creation tools I've tried this year. Game-changer!",
          author: "@creativepro",
          platform: "instagram",
          engagement: 890,
          sentiment: "positive", 
          url: "https://instagram.com/example"
        }
      ],
      demographics: {
        ageGroups: [
          { range: "18-24", percentage: 28 },
          { range: "25-34", percentage: 45 },
          { range: "35-44", percentage: 22 },
          { range: "45+", percentage: 5 }
        ],
        locations: [
          { country: "United States", percentage: 42 },
          { country: "United Kingdom", percentage: 18 },
          { country: "Canada", percentage: 15 },
          { country: "Australia", percentage: 12 }
        ],
        interests: ["Marketing", "Social Media", "Technology", "Business", "Design"]
      },
      viralPotential: {
        score: 87,
        factors: ["High engagement rate", "Trending hashtags", "Influencer mentions"],
        predictedReach: 500000
      }
    }
  ];

  const mockAlerts: ListeningAlert[] = [
    {
      id: "1",
      type: "brand_mention",
      title: "Brand Mention Spike",
      description: "Your brand was mentioned 45 times in the last hour",
      priority: "high",
      timestamp: new Date().toISOString(),
      actionRequired: true,
      suggestedResponse: "Thank your community and share behind-the-scenes content"
    },
    {
      id: "2", 
      type: "trending_topic",
      title: "AI Tools Trending",
      description: "AI content creation tools are trending across platforms",
      priority: "medium",
      timestamp: new Date(Date.now() - 3600000).toISOString(),
      actionRequired: false
    }
  ];

  const handleAnalyze = () => {
    if (monitoringKeywords.length === 0) {
      toast({
        title: "No Keywords Selected",
        description: "Please add keywords to monitor",
        variant: "destructive"
      });
      return;
    }

    createListeningAnalysisMutation.mutate({
      keywords: monitoringKeywords,
      platforms: selectedPlatform === "all" ? ["twitter", "instagram", "youtube", "tiktok"] : [selectedPlatform],
      analysisType: "comprehensive",
      dateRange: "7d"
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
                onClick={handleAnalyze} 
                disabled={createListeningAnalysisMutation.isPending}
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
              >
                {createListeningAnalysisMutation.isPending ? (
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
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {mockListeningData.map((data) => (
              <Card key={data.id} className="bg-gray-900/50 border-gray-700">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center gap-2">
                      <span>{getPlatformIcon(data.platform)}</span>
                      {data.keyword}
                    </CardTitle>
                    <Badge className={`${getSentimentColor(data.sentiment)} bg-transparent border`}>
                      {data.sentiment}
                    </Badge>
                  </div>
                  <CardDescription>
                    {data.mentions.toLocaleString()} mentions • {data.reach.toLocaleString()} reach
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-400">Trending Score</p>
                      <div className="flex items-center gap-2">
                        <Progress value={data.trendingScore} className="flex-1" />
                        <span className="text-sm font-medium">{data.trendingScore}%</span>
                      </div>
                    </div>
                    <div>
                      <p className="text-sm text-gray-400">Engagement Rate</p>
                      <p className="text-lg font-semibold text-green-400">{data.engagement}%</p>
                    </div>
                  </div>

                  <Separator className="bg-gray-700" />

                  <div>
                    <p className="text-sm font-medium mb-2">Top Mentions</p>
                    <div className="space-y-2">
                      {data.topMentions.slice(0, 2).map((mention, index) => (
                        <div key={index} className="p-2 bg-gray-800 rounded">
                          <p className="text-sm">{mention.content}</p>
                          <div className="flex items-center justify-between mt-1">
                            <span className="text-xs text-gray-400">@{mention.author}</span>
                            <span className="text-xs text-gray-400">{mention.engagement} engagements</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <p className="text-sm font-medium mb-2">Viral Potential</p>
                    <div className="flex items-center gap-2">
                      <Progress value={data.viralPotential.score} className="flex-1" />
                      <span className="text-sm font-medium text-purple-400">{data.viralPotential.score}%</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
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
              {mockAlerts.map((alert) => (
                <Card key={alert.id} className="bg-gray-800/50 border-gray-600">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between">
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <Badge 
                            variant={alert.priority === 'high' ? 'destructive' : 
                                   alert.priority === 'medium' ? 'default' : 'secondary'}
                          >
                            {alert.priority}
                          </Badge>
                          <h3 className="font-medium">{alert.title}</h3>
                        </div>
                        <p className="text-sm text-gray-400">{alert.description}</p>
                        {alert.suggestedResponse && (
                          <div className="p-2 bg-blue-900/20 rounded border border-blue-800">
                            <p className="text-sm text-blue-300">
                              <strong>Suggested Action:</strong> {alert.suggestedResponse}
                            </p>
                          </div>
                        )}
                      </div>
                      <div className="text-xs text-gray-500">
                        {new Date(alert.timestamp).toLocaleTimeString()}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
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
                <div>
                  <p className="text-sm font-medium mb-2">Age Groups</p>
                  {mockListeningData[0]?.demographics.ageGroups.map((group) => (
                    <div key={group.range} className="flex items-center justify-between mb-1">
                      <span className="text-sm">{group.range}</span>
                      <div className="flex items-center gap-2">
                        <Progress value={group.percentage} className="w-20" />
                        <span className="text-sm w-8">{group.percentage}%</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gray-900/50 border-gray-700">
              <CardHeader>
                <CardTitle>Geographic Distribution</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {mockListeningData[0]?.demographics.locations.map((location) => (
                  <div key={location.country} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-gray-400" />
                      <span className="text-sm">{location.country}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Progress value={location.percentage} className="w-20" />
                      <span className="text-sm w-8">{location.percentage}%</span>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}