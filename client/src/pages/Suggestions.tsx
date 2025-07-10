import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useWorkspaceContext } from "@/hooks/useWorkspace";
import { useToast } from "@/hooks/use-toast";
import { 
  Brain, 
  TrendingUp, 
  Target, 
  Users, 
  Zap, 
  BarChart3, 
  Sparkles, 
  Clock, 
  RefreshCw,
  Eye,
  Heart,
  MessageCircle,
  Share2,
  Flame,
  Calendar,
  ArrowUp,
  ArrowDown,
  AlertTriangle,
  CheckCircle,
  Crown,
  Rocket,
  Star,
  Trophy,
  Lightbulb,
  Search,
  Filter,
  Download,
  Play,
  ChevronRight,
  Hash
} from "lucide-react";
import { auth } from "@/lib/firebase";
import { UpgradeModal } from "@/components/modals/UpgradeModal";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface AnalysisData {
  accountHealth: {
    score: number;
    factors: Array<{ name: string; score: number; impact: string; }>;
  };
  growthPredictions: {
    nextWeek: { followers: number; engagement: number; };
    nextMonth: { followers: number; engagement: number; };
    confidence: number;
  };
  viralOpportunities: Array<{
    type: string;
    probability: number;
    description: string;
    expectedReach: number;
  }>;
  competitorInsights: Array<{
    competitor: string;
    advantage: string;
    opportunity: string;
    urgency: 'low' | 'medium' | 'high';
  }>;
  contentStrategy: {
    bestTimes: string[];
    topHashtags: string[];
    contentTypes: Array<{ type: string; performance: number; }>;
    trendingTopics: string[];
  };
}

export default function Suggestions() {
  const { currentWorkspace } = useWorkspaceContext();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [upgradeModal, setUpgradeModal] = useState({
    isOpen: false,
    featureType: "",
    creditsRequired: 0,
    currentCredits: 0
  });
  const [activeTab, setActiveTab] = useState("overview");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisData, setAnalysisData] = useState<AnalysisData | null>(null);

  // Fetch user data
  const { data: user } = useQuery({
    queryKey: ["/api/user"],
    refetchInterval: 30000
  }) as { data?: { credits?: number } };

  // Fetch social accounts for analysis
  const { data: socialAccounts } = useQuery({
    queryKey: ['social-accounts', currentWorkspace?.id],
    queryFn: async () => {
      const response = await fetch(`/api/social-accounts?workspaceId=${currentWorkspace?.id}`, {
        headers: {
          'Authorization': `Bearer ${await auth.currentUser?.getIdToken()}`
        }
      });
      if (!response.ok) throw new Error('Failed to fetch social accounts');
      return response.json();
    },
    enabled: !!currentWorkspace?.id
  });

  // AI Analysis Mutation
  const analyzeAccountMutation = useMutation({
    mutationFn: async () => {
      if (!currentWorkspace?.id) throw new Error('No workspace selected');
      
      const response = await apiRequest('POST', '/api/ai/account-analysis', {
        workspaceId: currentWorkspace.id
      });
      return await response.json();
    },
    onSuccess: (data) => {
      setAnalysisData(data.analysis);
      toast({
        title: "AI Analysis Complete!",
        description: `Comprehensive analysis generated. ${data.creditsUsed} credits used.`,
      });
      queryClient.invalidateQueries({ queryKey: ["/api/user"] });
    },
    onError: (error: any) => {
      if (error.status === 402 && error.upgradeModal) {
        setUpgradeModal({
          isOpen: true,
          featureType: "AI Account Analysis",
          creditsRequired: 5,
          currentCredits: user?.credits || 0
        });
      } else {
        toast({
          title: "Analysis Failed",
          description: error.message || "Failed to analyze account",
          variant: "destructive",
        });
      }
    }
  });

  // Simulate comprehensive analysis
  useEffect(() => {
    if (socialAccounts && socialAccounts.length > 0) {
      const simulateAnalysis = () => {
        setAnalysisData({
          accountHealth: {
            score: 87,
            factors: [
              { name: "Engagement Rate", score: 92, impact: "High positive impact on reach" },
              { name: "Posting Consistency", score: 78, impact: "Moderate impact on growth" },
              { name: "Content Quality", score: 95, impact: "Strong brand positioning" },
              { name: "Hashtag Strategy", score: 85, impact: "Good discoverability" },
              { name: "Audience Interaction", score: 89, impact: "Strong community building" }
            ]
          },
          growthPredictions: {
            nextWeek: { followers: 15, engagement: 24 },
            nextMonth: { followers: 68, engagement: 145 },
            confidence: 94
          },
          viralOpportunities: [
            {
              type: "Trending Audio",
              probability: 78,
              description: "Use trending audio within 6 hours for maximum reach",
              expectedReach: 2400
            },
            {
              type: "Transformation Post",
              probability: 85,
              description: "Before/after content performing 340% better this week",
              expectedReach: 3200
            },
            {
              type: "Educational Carousel",
              probability: 71,
              description: "5-slide educational posts trending in your niche",
              expectedReach: 1800
            }
          ],
          competitorInsights: [
            {
              competitor: "@competitor1",
              advantage: "Higher engagement rate (12.4% vs 8.2%)",
              opportunity: "Copy their storytelling approach",
              urgency: 'high'
            },
            {
              competitor: "@competitor2",
              advantage: "Better posting schedule",
              opportunity: "Post during 2-4 PM peak hours",
              urgency: 'medium'
            }
          ],
          contentStrategy: {
            bestTimes: ["2:00 PM", "6:00 PM", "9:00 PM"],
            topHashtags: ["#growth", "#motivation", "#success", "#entrepreneur", "#mindset"],
            contentTypes: [
              { type: "Educational Carousel", performance: 94 },
              { type: "Behind the Scenes", performance: 87 },
              { type: "User Generated Content", performance: 82 },
              { type: "Quote Posts", performance: 78 }
            ],
            trendingTopics: ["AI Revolution", "Personal Growth", "Productivity Hacks", "Success Stories"]
          }
        });
      };
      
      // Simulate loading
      setTimeout(simulateAnalysis, 1000);
    }
  }, [socialAccounts]);

  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case 'high': return 'bg-red-500/20 text-red-400 border-red-500/30';
      case 'medium': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      case 'low': return 'bg-green-500/20 text-green-400 border-green-500/30';
      default: return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
    }
  };

  return (
    <div className="min-h-screen bg-white p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
                <Brain className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">AI Growth Assistant</h1>
                <p className="text-gray-600">Advanced AI-powered social media analysis and optimization</p>
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <Badge variant="secondary" className="text-lg px-4 py-2">
              <Sparkles className="w-4 h-4 mr-2" />
              {user?.credits || 0} Credits
            </Badge>
            <Button
              onClick={() => analyzeAccountMutation.mutate()}
              disabled={analyzeAccountMutation.isPending || !currentWorkspace?.id}
              className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white"
            >
              {analyzeAccountMutation.isPending ? (
                <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
              ) : (
                <Zap className="w-4 h-4 mr-2" />
              )}
              Generate AI Analysis
            </Button>
          </div>
        </div>

        {/* Quick Stats */}
        {socialAccounts && socialAccounts.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-blue-600 text-sm font-medium">Total Followers</p>
                    <p className="text-2xl font-bold text-blue-900">
                      {socialAccounts.reduce((acc: number, account: any) => acc + (account.followersCount || 0), 0)}
                    </p>
                  </div>
                  <Users className="w-8 h-8 text-blue-500" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-green-600 text-sm font-medium">Avg Engagement</p>
                    <p className="text-2xl font-bold text-green-900">
                      {socialAccounts.length > 0 ? 
                        Math.round(socialAccounts.reduce((acc: number, account: any) => acc + (account.avgEngagement || 0), 0) / socialAccounts.length) 
                        : 0}%
                    </p>
                  </div>
                  <Heart className="w-8 h-8 text-green-500" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-purple-600 text-sm font-medium">Total Posts</p>
                    <p className="text-2xl font-bold text-purple-900">
                      {socialAccounts.reduce((acc: number, account: any) => acc + (account.mediaCount || 0), 0)}
                    </p>
                  </div>
                  <BarChart3 className="w-8 h-8 text-purple-500" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-orange-600 text-sm font-medium">AI Health Score</p>
                    <p className="text-2xl font-bold text-orange-900">{analysisData?.accountHealth.score || 0}/100</p>
                  </div>
                  <Target className="w-8 h-8 text-orange-500" />
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* AI Analysis Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-5 bg-gray-100">
            <TabsTrigger value="overview" className="flex items-center gap-2">
              <Eye className="w-4 h-4" />
              Overview
            </TabsTrigger>
            <TabsTrigger value="growth" className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4" />
              Growth Insights
            </TabsTrigger>
            <TabsTrigger value="viral" className="flex items-center gap-2">
              <Flame className="w-4 h-4" />
              Viral Opportunities
            </TabsTrigger>
            <TabsTrigger value="strategy" className="flex items-center gap-2">
              <Rocket className="w-4 h-4" />
              Content Strategy
            </TabsTrigger>
            <TabsTrigger value="competitors" className="flex items-center gap-2">
              <Trophy className="w-4 h-4" />
              Competitor Analysis
            </TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6 mt-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Account Health */}
              <Card className="bg-white border border-gray-200 shadow-sm">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-gray-900">
                    <Target className="w-5 h-5 text-blue-500" />
                    Account Health Score
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="text-center">
                    <div className="text-4xl font-bold text-blue-600 mb-2">
                      {analysisData?.accountHealth.score || 0}/100
                    </div>
                    <Progress value={analysisData?.accountHealth.score || 0} className="w-full" />
                  </div>
                  
                  <div className="space-y-3">
                    {analysisData?.accountHealth.factors.map((factor, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div>
                          <p className="font-medium text-gray-900">{factor.name}</p>
                          <p className="text-sm text-gray-600">{factor.impact}</p>
                        </div>
                        <div className="text-right">
                          <div className="text-lg font-semibold text-blue-600">{factor.score}</div>
                          <Progress value={factor.score} className="w-16" />
                        </div>
                      </div>
                    )) || []}
                  </div>
                </CardContent>
              </Card>

              {/* Growth Predictions */}
              <Card className="bg-white border border-gray-200 shadow-sm">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-gray-900">
                    <TrendingUp className="w-5 h-5 text-green-500" />
                    Growth Predictions
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="text-center mb-4">
                    <Badge className="bg-green-100 text-green-800">
                      {analysisData?.growthPredictions.confidence || 0}% Confidence
                    </Badge>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center p-4 bg-blue-50 rounded-lg">
                      <p className="text-sm text-gray-600 mb-1">Next Week</p>
                      <div className="text-2xl font-bold text-blue-600">
                        +{analysisData?.growthPredictions.nextWeek.followers || 0}
                      </div>
                      <p className="text-xs text-gray-500">followers</p>
                    </div>
                    <div className="text-center p-4 bg-green-50 rounded-lg">
                      <p className="text-sm text-gray-600 mb-1">Next Month</p>
                      <div className="text-2xl font-bold text-green-600">
                        +{analysisData?.growthPredictions.nextMonth.followers || 0}
                      </div>
                      <p className="text-xs text-gray-500">followers</p>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <h4 className="font-medium text-gray-900">Engagement Growth</h4>
                    <div className="flex justify-between items-center p-3 bg-purple-50 rounded-lg">
                      <span className="text-sm text-gray-600">Weekly Increase</span>
                      <span className="font-semibold text-purple-600">
                        +{analysisData?.growthPredictions.nextWeek.engagement || 0}%
                      </span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-orange-50 rounded-lg">
                      <span className="text-sm text-gray-600">Monthly Increase</span>
                      <span className="font-semibold text-orange-600">
                        +{analysisData?.growthPredictions.nextMonth.engagement || 0}%
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Quick Actions */}
            <Card className="bg-gradient-to-r from-blue-500 to-purple-600 text-white border-0">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-xl font-bold mb-2">Ready to Optimize?</h3>
                    <p className="text-blue-100">Get personalized recommendations to boost your growth</p>
                  </div>
                  <div className="flex gap-3">
                    <Button 
                      variant="secondary" 
                      onClick={() => setActiveTab("viral")}
                      className="bg-white text-blue-600 hover:bg-gray-100"
                    >
                      <Flame className="w-4 h-4 mr-2" />
                      Find Viral Opportunities
                    </Button>
                    <Button 
                      variant="secondary" 
                      onClick={() => setActiveTab("strategy")}
                      className="bg-white text-purple-600 hover:bg-gray-100"
                    >
                      <Rocket className="w-4 h-4 mr-2" />
                      Get Strategy
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Growth Insights Tab */}
          <TabsContent value="growth" className="space-y-6 mt-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <Card className="lg:col-span-2">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BarChart3 className="w-5 h-5 text-blue-500" />
                    Performance Analysis
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {analysisData?.contentStrategy.contentTypes.map((content, index) => (
                    <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div>
                        <h4 className="font-medium text-gray-900">{content.type}</h4>
                        <p className="text-sm text-gray-600">Content performance</p>
                      </div>
                      <div className="text-right">
                        <div className="text-lg font-semibold text-blue-600">{content.performance}%</div>
                        <Progress value={content.performance} className="w-20" />
                      </div>
                    </div>
                  )) || []}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Clock className="w-5 h-5 text-green-500" />
                    Optimal Posting Times
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {analysisData?.contentStrategy.bestTimes.map((time, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                      <span className="font-medium text-gray-900">{time}</span>
                      <Badge className="bg-green-600 text-white">Peak</Badge>
                    </div>
                  )) || []}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Viral Opportunities Tab */}
          <TabsContent value="viral" className="space-y-6 mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {analysisData?.viralOpportunities.map((opportunity, index) => (
                <Card key={index} className="bg-white border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Flame className="w-5 h-5 text-orange-500" />
                      {opportunity.type}
                    </CardTitle>
                    <Badge className="w-fit bg-orange-100 text-orange-800">
                      {opportunity.probability}% Success Rate
                    </Badge>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-gray-700">{opportunity.description}</p>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Expected Reach</span>
                      <span className="font-semibold text-blue-600">
                        {opportunity.expectedReach.toLocaleString()}
                      </span>
                    </div>
                    <Button className="w-full bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600">
                      <Play className="w-4 h-4 mr-2" />
                      Execute Now
                    </Button>
                  </CardContent>
                </Card>
              )) || []}
            </div>
          </TabsContent>

          {/* Content Strategy Tab */}
          <TabsContent value="strategy" className="space-y-6 mt-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Hash className="w-5 h-5 text-blue-500" />
                    Trending Hashtags
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {analysisData?.contentStrategy.topHashtags.map((hashtag, index) => (
                      <Badge key={index} variant="secondary" className="bg-blue-100 text-blue-800">
                        {hashtag}
                      </Badge>
                    )) || []}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Star className="w-5 h-5 text-purple-500" />
                    Trending Topics
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {analysisData?.contentStrategy.trendingTopics.map((topic, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-purple-50 rounded-lg">
                        <span className="font-medium text-gray-900">{topic}</span>
                        <ChevronRight className="w-4 h-4 text-gray-400" />
                      </div>
                    )) || []}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Competitor Analysis Tab */}
          <TabsContent value="competitors" className="space-y-6 mt-6">
            <div className="space-y-4">
              {analysisData?.competitorInsights.map((insight, index) => (
                <Card key={index} className="bg-white border border-gray-200 shadow-sm">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <Trophy className="w-6 h-6 text-blue-500" />
                        <div>
                          <h3 className="font-semibold text-gray-900">{insight.competitor}</h3>
                          <Badge className={getUrgencyColor(insight.urgency)}>
                            {insight.urgency} priority
                          </Badge>
                        </div>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="p-4 bg-green-50 rounded-lg">
                        <h4 className="font-medium text-green-800 mb-2">Their Advantage</h4>
                        <p className="text-green-700">{insight.advantage}</p>
                      </div>
                      <div className="p-4 bg-blue-50 rounded-lg">
                        <h4 className="font-medium text-blue-800 mb-2">Your Opportunity</h4>
                        <p className="text-blue-700">{insight.opportunity}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )) || []}
            </div>
          </TabsContent>
        </Tabs>

        {/* No Data State */}
        {!socialAccounts || socialAccounts.length === 0 ? (
          <Card className="bg-gray-50 border-2 border-dashed border-gray-300">
            <CardContent className="text-center py-12">
              <Brain className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Connect Your Social Accounts</h3>
              <p className="text-gray-600 mb-6">
                Connect your Instagram, Twitter, or other social media accounts to get AI-powered insights and growth recommendations.
              </p>
              <Button className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700">
                <Users className="w-4 h-4 mr-2" />
                Connect Accounts
              </Button>
            </CardContent>
          </Card>
        ) : null}

        {/* Upgrade Modal */}
        <UpgradeModal
          isOpen={upgradeModal.isOpen}
          onClose={() => setUpgradeModal(prev => ({ ...prev, isOpen: false }))}
          featureType={upgradeModal.featureType}
          creditsRequired={upgradeModal.creditsRequired}
          currentCredits={upgradeModal.currentCredits}
        />
      </div>
    </div>
  );
}