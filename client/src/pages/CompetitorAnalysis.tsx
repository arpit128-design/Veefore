import { useState } from 'react';
import { Users, Search, TrendingUp, Clock, Target, BarChart3, Eye, Heart, MessageCircle, Share2, Calendar, Zap } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { motion } from 'framer-motion';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useToast } from '@/hooks/use-toast';
import { apiRequest } from '@/lib/queryClient';

interface CompetitorData {
  id: string;
  username: string;
  platform: string;
  followers: number;
  engagement: number;
  avgLikes: number;
  avgComments: number;
  postsPerWeek: number;
  topHashtags: string[];
  bestPerformingPost: {
    caption: string;
    likes: number;
    comments: number;
    engagement: number;
  };
  contentTypes: {
    type: string;
    percentage: number;
  }[];
  postingTimes: {
    day: string;
    hour: number;
    performance: number;
  }[];
  lastUpdated: string;
}

export default function CompetitorAnalysis() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [competitorHandle, setCompetitorHandle] = useState('');
  const [selectedPlatform, setSelectedPlatform] = useState('instagram');
  const [activeTab, setActiveTab] = useState('analyze');

  // Get user data for credits
  const { data: user } = useQuery({
    queryKey: ["/api/user"],
    refetchInterval: 30000
  });

  // Fetch competitor data
  const { data: competitors, isLoading } = useQuery({
    queryKey: ['/api/competitors'],
    queryFn: () => apiRequest('GET', '/api/competitors')
  });

  // Analyze competitor mutation
  const analyzeMutation = useMutation({
    mutationFn: (data: any) => apiRequest('POST', '/api/competitors/analyze', data),
    onSuccess: (data) => {
      toast({
        title: "Analysis Complete!",
        description: "Competitor analysis has been added to your dashboard.",
      });
      queryClient.invalidateQueries({ queryKey: ['/api/competitors'] });
      setCompetitorHandle('');
    },
    onError: (error: any) => {
      toast({
        title: "Analysis Failed",
        description: error.message || "Failed to analyze competitor. Please try again.",
        variant: "destructive"
      });
    }
  });

  // Mock competitor data
  const mockCompetitors: CompetitorData[] = [
    {
      id: '1',
      username: '@competitor_fitness',
      platform: 'instagram',
      followers: 125000,
      engagement: 4.2,
      avgLikes: 5250,
      avgComments: 234,
      postsPerWeek: 7,
      topHashtags: ['#fitness', '#motivation', '#workout', '#health', '#transformation'],
      bestPerformingPost: {
        caption: 'Before & After: 90-day transformation journey! 💪',
        likes: 12500,
        comments: 892,
        engagement: 10.7
      },
      contentTypes: [
        { type: 'Reels', percentage: 45 },
        { type: 'Photos', percentage: 35 },
        { type: 'Carousels', percentage: 20 }
      ],
      postingTimes: [
        { day: 'Monday', hour: 18, performance: 85 },
        { day: 'Wednesday', hour: 12, performance: 92 },
        { day: 'Friday', hour: 19, performance: 88 }
      ],
      lastUpdated: '2025-01-02'
    },
    {
      id: '2',
      username: '@tech_reviewer_pro',
      platform: 'youtube',
      followers: 89000,
      engagement: 6.8,
      avgLikes: 3420,
      avgComments: 156,
      postsPerWeek: 3,
      topHashtags: ['#tech', '#review', '#gadgets', '#apple', '#android'],
      bestPerformingPost: {
        caption: 'iPhone 15 Pro Max: The Ultimate Review You\'ve Been Waiting For!',
        likes: 8900,
        comments: 445,
        engagement: 10.5
      },
      contentTypes: [
        { type: 'Long-form Videos', percentage: 60 },
        { type: 'Shorts', percentage: 30 },
        { type: 'Live Streams', percentage: 10 }
      ],
      postingTimes: [
        { day: 'Tuesday', hour: 14, performance: 90 },
        { day: 'Thursday', hour: 16, performance: 88 },
        { day: 'Saturday', hour: 11, performance: 85 }
      ],
      lastUpdated: '2025-01-02'
    }
  ];

  const handleAnalyzeCompetitor = () => {
    if (!competitorHandle.trim()) {
      toast({
        title: "Missing Information",
        description: "Please enter a competitor handle.",
        variant: "destructive"
      });
      return;
    }

    analyzeMutation.mutate({
      handle: competitorHandle,
      platform: selectedPlatform
    });
  };

  const formatNumber = (num: number) => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
    return num.toString();
  };

  const getPlatformColor = (platform: string) => {
    const colors = {
      instagram: 'from-pink-500 to-purple-500',
      youtube: 'from-red-500 to-red-600',
      tiktok: 'from-black to-red-500',
      twitter: 'from-blue-400 to-blue-600'
    };
    return colors[platform] || colors.instagram;
  };

  const getEngagementColor = (engagement: number) => {
    if (engagement >= 5) return 'text-green-400';
    if (engagement >= 3) return 'text-yellow-400';
    if (engagement >= 1) return 'text-orange-400';
    return 'text-red-400';
  };

  return (
    <div className="min-h-screen bg-transparent text-white p-4 md:p-6">
      {/* Cosmic Background Elements */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-20 left-10 w-2 h-2 bg-electric-cyan rounded-full animate-pulse"></div>
        <div className="absolute top-40 right-20 w-1 h-1 bg-solar-gold rounded-full animate-ping"></div>
        <div className="absolute bottom-20 left-1/4 w-1.5 h-1.5 bg-nebula-purple rounded-full animate-pulse"></div>
      </div>

      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center space-y-4"
        >
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-orange-500 to-red-500 flex items-center justify-center">
              <Users className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-electric-cyan to-nebula-purple bg-clip-text text-transparent">
              Competitor Analysis Engine
            </h1>
          </div>
          <p className="text-asteroid-silver text-lg max-w-2xl mx-auto">
            Analyze your competitors' content strategies, performance metrics, and growth patterns to stay ahead
          </p>
        </motion.div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3 bg-cosmic-void/50 border border-asteroid-silver/30">
            <TabsTrigger value="analyze" className="data-[state=active]:bg-electric-cyan data-[state=active]:text-space-navy">
              Add Competitor
            </TabsTrigger>
            <TabsTrigger value="dashboard" className="data-[state=active]:bg-electric-cyan data-[state=active]:text-space-navy">
              Dashboard
            </TabsTrigger>
            <TabsTrigger value="insights" className="data-[state=active]:bg-electric-cyan data-[state=active]:text-space-navy">
              AI Insights
            </TabsTrigger>
          </TabsList>

          {/* Add Competitor Tab */}
          <TabsContent value="analyze" className="space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="max-w-2xl mx-auto"
            >
              <Card className="bg-cosmic-void/40 border-asteroid-silver/30">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <Target className="w-5 h-5 text-electric-cyan" />
                    Analyze New Competitor
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="platform">Platform</Label>
                      <Select value={selectedPlatform} onValueChange={setSelectedPlatform}>
                        <SelectTrigger className="bg-cosmic-void/50 border-asteroid-silver/30 text-white">
                          <SelectValue placeholder="Select platform" />
                        </SelectTrigger>
                        <SelectContent className="bg-cosmic-void border-asteroid-silver/30">
                          <SelectItem value="instagram">Instagram</SelectItem>
                          <SelectItem value="youtube">YouTube</SelectItem>
                          <SelectItem value="tiktok">TikTok</SelectItem>
                          <SelectItem value="twitter">Twitter</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="handle">Competitor Handle</Label>
                      <Input
                        id="handle"
                        placeholder="@username or channel"
                        value={competitorHandle}
                        onChange={(e) => setCompetitorHandle(e.target.value)}
                        className="bg-cosmic-void/50 border-asteroid-silver/30 text-white"
                      />
                    </div>
                  </div>

                  <div className="bg-gradient-to-r from-electric-cyan/10 to-nebula-purple/10 rounded-lg p-4 border border-electric-cyan/20">
                    <div className="flex items-center gap-2 mb-2">
                      <Zap className="w-4 h-4 text-electric-cyan" />
                      <span className="text-sm font-medium text-electric-cyan">Analysis Includes</span>
                    </div>
                    <ul className="text-xs text-asteroid-silver space-y-1">
                      <li>• Content performance metrics and engagement rates</li>
                      <li>• Top-performing posts and hashtag strategies</li>
                      <li>• Posting frequency and optimal timing analysis</li>
                      <li>• Content type distribution and format preferences</li>
                      <li>• Growth trends and audience insights</li>
                    </ul>
                  </div>

                  <Button
                    onClick={handleAnalyzeCompetitor}
                    disabled={analyzeMutation.isPending}
                    className="w-full bg-gradient-to-r from-electric-cyan to-nebula-purple hover:opacity-90 text-white"
                  >
                    {analyzeMutation.isPending ? (
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                        Analyzing...
                      </div>
                    ) : (
                      <>
                        <Search className="w-4 h-4 mr-2" />
                        Analyze Competitor
                      </>
                    )}
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          </TabsContent>

          {/* Dashboard Tab */}
          <TabsContent value="dashboard" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {mockCompetitors.map((competitor, index) => (
                <motion.div
                  key={competitor.id}
                  initial={{ opacity: 0, y: 40 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                >
                  <Card className="bg-cosmic-void/40 border-asteroid-silver/30 hover:border-electric-cyan/50 transition-all duration-300">
                    <CardHeader className="pb-4">
                      <div className="flex items-center justify-between mb-3">
                        <Badge 
                          className={`bg-gradient-to-r ${getPlatformColor(competitor.platform)} text-white`}
                        >
                          {competitor.platform.charAt(0).toUpperCase() + competitor.platform.slice(1)}
                        </Badge>
                        <div className="flex items-center gap-2">
                          <TrendingUp className={`w-4 h-4 ${getEngagementColor(competitor.engagement)}`} />
                          <span className={`text-sm font-semibold ${getEngagementColor(competitor.engagement)}`}>
                            {competitor.engagement}%
                          </span>
                        </div>
                      </div>
                      <CardTitle className="text-white text-lg">{competitor.username}</CardTitle>
                      <div className="grid grid-cols-3 gap-4 text-sm">
                        <div className="text-center">
                          <div className="text-electric-cyan font-semibold">{formatNumber(competitor.followers)}</div>
                          <div className="text-asteroid-silver text-xs">Followers</div>
                        </div>
                        <div className="text-center">
                          <div className="text-electric-cyan font-semibold">{formatNumber(competitor.avgLikes)}</div>
                          <div className="text-asteroid-silver text-xs">Avg Likes</div>
                        </div>
                        <div className="text-center">
                          <div className="text-electric-cyan font-semibold">{competitor.postsPerWeek}</div>
                          <div className="text-asteroid-silver text-xs">Posts/Week</div>
                        </div>
                      </div>
                    </CardHeader>
                    
                    <CardContent className="space-y-4">
                      {/* Top Hashtags */}
                      <div>
                        <h4 className="text-sm font-medium text-white mb-2">Top Hashtags</h4>
                        <div className="flex flex-wrap gap-1">
                          {competitor.topHashtags.slice(0, 3).map((hashtag, i) => (
                            <Badge key={i} variant="outline" className="text-xs border-electric-cyan/30 text-electric-cyan">
                              {hashtag}
                            </Badge>
                          ))}
                        </div>
                      </div>

                      {/* Content Types */}
                      <div>
                        <h4 className="text-sm font-medium text-white mb-2">Content Mix</h4>
                        <div className="space-y-1">
                          {competitor.contentTypes.map((type, i) => (
                            <div key={i} className="flex items-center justify-between text-xs">
                              <span className="text-asteroid-silver">{type.type}</span>
                              <span className="text-electric-cyan font-medium">{type.percentage}%</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Best Post */}
                      <div className="bg-gradient-to-r from-electric-cyan/10 to-nebula-purple/10 rounded-lg p-3 border border-electric-cyan/20">
                        <h4 className="text-sm font-medium text-electric-cyan mb-2">Best Performing Post</h4>
                        <p className="text-xs text-asteroid-silver mb-2 line-clamp-2">
                          {competitor.bestPerformingPost.caption}
                        </p>
                        <div className="grid grid-cols-3 gap-2 text-xs">
                          <div className="flex items-center gap-1">
                            <Heart className="w-3 h-3 text-red-400" />
                            <span className="text-white">{formatNumber(competitor.bestPerformingPost.likes)}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <MessageCircle className="w-3 h-3 text-blue-400" />
                            <span className="text-white">{formatNumber(competitor.bestPerformingPost.comments)}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <TrendingUp className="w-3 h-3 text-green-400" />
                            <span className="text-white">{competitor.bestPerformingPost.engagement}%</span>
                          </div>
                        </div>
                      </div>

                      <div className="flex gap-2 pt-2">
                        <Button
                          variant="outline"
                          size="sm"
                          className="flex-1 border-asteroid-silver/30 text-asteroid-silver hover:text-white"
                        >
                          View Details
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className="border-electric-cyan/30 text-electric-cyan hover:text-white"
                        >
                          <Eye className="w-4 h-4" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </TabsContent>

          {/* AI Insights Tab */}
          <TabsContent value="insights" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Market Position */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
              >
                <Card className="bg-cosmic-void/40 border-asteroid-silver/30">
                  <CardHeader>
                    <CardTitle className="text-white flex items-center gap-2">
                      <BarChart3 className="w-5 h-5 text-electric-cyan" />
                      Market Position
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="bg-gradient-to-r from-green-500/20 to-emerald-500/20 rounded-lg p-3 border border-green-500/30">
                      <h4 className="text-green-400 font-medium text-sm">Opportunity Found</h4>
                      <p className="text-asteroid-silver text-xs mt-1">
                        Your engagement rate (5.2%) is higher than 60% of competitors in your niche
                      </p>
                    </div>
                    <div className="bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-lg p-3 border border-blue-500/30">
                      <h4 className="text-yellow-400 font-medium text-sm">Growth Gap</h4>
                      <p className="text-asteroid-silver text-xs mt-1">
                        Competitors post 40% more frequently. Consider increasing posting frequency
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              {/* Content Strategy */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                <Card className="bg-cosmic-void/40 border-asteroid-silver/30">
                  <CardHeader>
                    <CardTitle className="text-white flex items-center gap-2">
                      <Target className="w-5 h-5 text-nebula-purple" />
                      Content Strategy
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="space-y-2">
                      <h4 className="text-sm font-medium text-white">Trending Formats</h4>
                      <div className="space-y-1">
                        <div className="flex justify-between text-xs">
                          <span className="text-asteroid-silver">Reels</span>
                          <span className="text-electric-cyan">↑ 25%</span>
                        </div>
                        <div className="flex justify-between text-xs">
                          <span className="text-asteroid-silver">Carousels</span>
                          <span className="text-green-400">↑ 15%</span>
                        </div>
                        <div className="flex justify-between text-xs">
                          <span className="text-asteroid-silver">Stories</span>
                          <span className="text-red-400">↓ 8%</span>
                        </div>
                      </div>
                    </div>
                    <div className="bg-gradient-to-r from-electric-cyan/10 to-nebula-purple/10 rounded-lg p-3 border border-electric-cyan/20">
                      <h4 className="text-electric-cyan font-medium text-sm">AI Recommendation</h4>
                      <p className="text-asteroid-silver text-xs mt-1">
                        Focus on transformation content and behind-the-scenes reels for highest engagement
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              {/* Timing Analysis */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                <Card className="bg-cosmic-void/40 border-asteroid-silver/30">
                  <CardHeader>
                    <CardTitle className="text-white flex items-center gap-2">
                      <Clock className="w-5 h-5 text-solar-gold" />
                      Optimal Timing
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="space-y-2">
                      <h4 className="text-sm font-medium text-white">Best Times to Post</h4>
                      <div className="space-y-1">
                        <div className="flex justify-between text-xs">
                          <span className="text-asteroid-silver">Mon 6-8 PM</span>
                          <span className="text-green-400">High</span>
                        </div>
                        <div className="flex justify-between text-xs">
                          <span className="text-asteroid-silver">Wed 12-2 PM</span>
                          <span className="text-green-400">High</span>
                        </div>
                        <div className="flex justify-between text-xs">
                          <span className="text-asteroid-silver">Fri 7-9 PM</span>
                          <span className="text-yellow-400">Medium</span>
                        </div>
                      </div>
                    </div>
                    <div className="bg-gradient-to-r from-solar-gold/10 to-yellow-500/10 rounded-lg p-3 border border-solar-gold/20">
                      <h4 className="text-solar-gold font-medium text-sm">Peak Performance</h4>
                      <p className="text-asteroid-silver text-xs mt-1">
                        Your competitors see 45% higher engagement during evening posts
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}