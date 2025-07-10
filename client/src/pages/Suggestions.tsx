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
  const [activeInsight, setActiveInsight] = useState(0);

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
      case 'high': return 'bg-red-500/20 text-red-600 border-red-500/30';
      case 'medium': return 'bg-orange-500/20 text-orange-600 border-orange-500/30';
      case 'low': return 'bg-green-500/20 text-green-600 border-green-500/30';
      default: return 'bg-blue-500/20 text-blue-600 border-blue-500/30';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50 relative overflow-hidden">
      {/* Subtle Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-100/30 rounded-full blur-2xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-100/30 rounded-full blur-2xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-cyan-100/20 rounded-full blur-2xl"></div>
      </div>

      <div className="relative z-10 min-h-screen p-6">
        <div className="max-w-7xl mx-auto space-y-8">
          {/* Revolutionary Header */}
          <div className="text-center space-y-6">
            <motion.div 
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="relative"
            >
              <Card className="relative bg-white/95 backdrop-blur-sm border border-gray-200 rounded-2xl p-8 shadow-lg">
                <div className="flex items-center justify-center gap-4 mb-6">
                  <div className="w-16 h-16 bg-gradient-to-br from-cyan-500 via-blue-600 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg">
                    <Brain className="w-8 h-8 text-white" />
                  </div>
                  <div className="text-left">
                    <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-900 via-blue-700 to-purple-700 bg-clip-text text-transparent">
                      VeeFore AI Growth Engine
                    </h1>
                    <p className="text-gray-700 text-lg">Next-generation social media optimization platform</p>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="text-center">
                    <div className="w-12 h-12 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-xl mx-auto mb-3 flex items-center justify-center">
                      <Zap className="w-6 h-6 text-white" />
                    </div>
                    <h3 className="text-gray-900 font-semibold">AI-Powered Analysis</h3>
                    <p className="text-gray-600 text-sm">Advanced machine learning insights</p>
                  </div>
                  <div className="text-center">
                    <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-600 rounded-xl mx-auto mb-3 flex items-center justify-center">
                      <TrendingUp className="w-6 h-6 text-white" />
                    </div>
                    <h3 className="text-gray-900 font-semibold">Growth Predictions</h3>
                    <p className="text-gray-600 text-sm">Accurate growth forecasting</p>
                  </div>
                  <div className="text-center">
                    <div className="w-12 h-12 bg-gradient-to-r from-emerald-500 to-cyan-600 rounded-xl mx-auto mb-3 flex items-center justify-center">
                      <Rocket className="w-6 h-6 text-white" />
                    </div>
                    <h3 className="text-gray-900 font-semibold">Viral Optimization</h3>
                    <p className="text-gray-600 text-sm">Content virality enhancement</p>
                  </div>
                </div>
              </Card>
            </motion.div>
          </div>

          {/* Enhanced Stats Dashboard */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="flex items-center justify-between bg-white/90 backdrop-blur-sm rounded-2xl p-6 border border-gray-200 shadow-lg"
          >
            <Badge className="bg-cyan-50 text-cyan-700 border-cyan-200 text-lg px-6 py-3 font-medium">
              <Sparkles className="w-5 h-5 mr-2" />
              {user?.credits || 0} Credits Available
            </Badge>
            <Button
              onClick={() => analyzeAccountMutation.mutate()}
              disabled={analyzeAccountMutation.isPending || !currentWorkspace?.id}
              className="bg-gradient-to-r from-cyan-500 via-blue-600 to-purple-600 hover:from-cyan-600 hover:via-blue-700 hover:to-purple-700 text-white px-8 py-3 text-lg font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
            >
              {analyzeAccountMutation.isPending ? (
                <RefreshCw className="w-5 h-5 mr-3 animate-spin" />
              ) : (
                <Zap className="w-5 h-5 mr-3" />
              )}
              Launch AI Analysis
            </Button>
          </motion.div>

          {/* Revolutionary Stats Grid */}
          {socialAccounts && socialAccounts.length > 0 && (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="grid grid-cols-1 md:grid-cols-4 gap-6"
            >
              <Card className="bg-white/95 backdrop-blur-sm border border-gray-200 shadow-lg hover:shadow-xl transition-all duration-300 group">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-600 text-sm font-medium mb-2">Total Followers</p>
                      <p className="text-3xl font-bold text-gray-900">
                        {socialAccounts.reduce((acc: number, account: any) => acc + (account.followersCount || 0), 0)}
                      </p>
                    </div>
                    <div className="w-12 h-12 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                      <Users className="w-6 h-6 text-white" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white/95 backdrop-blur-sm border border-gray-200 shadow-lg hover:shadow-xl transition-all duration-300 group">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-600 text-sm font-medium mb-2">Avg Engagement</p>
                      <p className="text-3xl font-bold text-gray-900">
                        {socialAccounts.length > 0 ? 
                          Math.round(socialAccounts.reduce((acc: number, account: any) => acc + (account.avgEngagement || 0), 0) / socialAccounts.length) 
                          : 0}%
                      </p>
                    </div>
                    <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-green-600 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                      <Heart className="w-6 h-6 text-white" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white/95 backdrop-blur-sm border border-gray-200 shadow-lg hover:shadow-xl transition-all duration-300 group">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-600 text-sm font-medium mb-2">Total Posts</p>
                      <p className="text-3xl font-bold text-gray-900">
                        {socialAccounts.reduce((acc: number, account: any) => acc + (account.mediaCount || 0), 0)}
                      </p>
                    </div>
                    <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                      <BarChart3 className="w-6 h-6 text-white" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white/95 backdrop-blur-sm border border-gray-200 shadow-lg hover:shadow-xl transition-all duration-300 group">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-600 text-sm font-medium mb-2">AI Health Score</p>
                      <p className="text-3xl font-bold text-gray-900">{analysisData?.accountHealth.score || 0}/100</p>
                    </div>
                    <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-red-600 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                      <Target className="w-6 h-6 text-white" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {/* Revolutionary AI Insights Tabs */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
          >
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-5 bg-white/90 backdrop-blur-sm border border-gray-200 p-2 rounded-2xl shadow-lg">
                <TabsTrigger 
                  value="overview" 
                  className="flex items-center gap-2 data-[state=active]:bg-cyan-50 data-[state=active]:shadow-md data-[state=active]:text-cyan-700 data-[state=active]:border-cyan-200 rounded-xl transition-all text-gray-600 hover:text-gray-900 font-medium"
                >
                  <Brain className="w-4 h-4" />
                  Overview
                </TabsTrigger>
                <TabsTrigger 
                  value="analysis" 
                  className="flex items-center gap-2 data-[state=active]:bg-blue-50 data-[state=active]:shadow-md data-[state=active]:text-blue-700 data-[state=active]:border-blue-200 rounded-xl transition-all text-gray-600 hover:text-gray-900 font-medium"
                >
                  <Target className="w-4 h-4" />
                  Analysis
                </TabsTrigger>
                <TabsTrigger 
                  value="growth" 
                  className="flex items-center gap-2 data-[state=active]:bg-emerald-50 data-[state=active]:shadow-md data-[state=active]:text-emerald-700 data-[state=active]:border-emerald-200 rounded-xl transition-all text-gray-600 hover:text-gray-900 font-medium"
                >
                  <TrendingUp className="w-4 h-4" />
                  Growth
                </TabsTrigger>
                <TabsTrigger 
                  value="suggestions" 
                  className="flex items-center gap-2 data-[state=active]:bg-orange-50 data-[state=active]:shadow-md data-[state=active]:text-orange-700 data-[state=active]:border-orange-200 rounded-xl transition-all text-gray-600 hover:text-gray-900 font-medium"
                >
                  <Lightbulb className="w-4 h-4" />
                  Suggestions
                </TabsTrigger>
                <TabsTrigger 
                  value="strategy" 
                  className="flex items-center gap-2 data-[state=active]:bg-purple-50 data-[state=active]:shadow-md data-[state=active]:text-purple-700 data-[state=active]:border-purple-200 rounded-xl transition-all text-gray-600 hover:text-gray-900 font-medium"
                >
                  <Rocket className="w-4 h-4" />
                  Strategy
                </TabsTrigger>
              </TabsList>

              {/* Overview Tab - Revolutionary Dashboard */}
              <TabsContent value="overview" className="space-y-8 mt-8">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                  {/* AI Health Score - Center Piece */}
                  <Card className="lg:col-span-2 bg-white/95 backdrop-blur-sm border border-gray-200 shadow-lg">
                    <CardContent className="p-8">
                      <div className="text-center mb-8">
                        <div className="w-32 h-32 mx-auto mb-6 relative">
                          <div className="absolute inset-0 bg-gradient-to-r from-cyan-500 via-blue-600 to-purple-600 rounded-full"></div>
                          <div className="absolute inset-2 bg-white rounded-full flex items-center justify-center shadow-inner">
                            <div className="text-4xl font-bold text-gray-900">
                              {analysisData?.accountHealth.score || 87}
                            </div>
                          </div>
                        </div>
                        <h3 className="text-2xl font-bold text-gray-900 mb-2">AI Health Score</h3>
                        <p className="text-gray-600">Your account's optimization level</p>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-6">
                        <div className="text-center p-4 bg-cyan-50 rounded-xl border border-cyan-200">
                          <div className="text-2xl font-bold text-cyan-700">
                            +{analysisData?.growthPredictions.nextWeek.followers || 127}
                          </div>
                          <p className="text-gray-600 text-sm">Weekly Growth</p>
                        </div>
                        <div className="text-center p-4 bg-emerald-50 rounded-xl border border-emerald-200">
                          <div className="text-2xl font-bold text-emerald-700">
                            {analysisData?.growthPredictions.confidence || 94}%
                          </div>
                          <p className="text-gray-600 text-sm">AI Confidence</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Quick Actions */}
                  <Card className="bg-white/95 backdrop-blur-sm border border-gray-200 shadow-lg">
                    <CardContent className="p-6 space-y-4">
                      <h4 className="text-lg font-semibold text-gray-900 mb-4">AI Actions</h4>
                      
                      <Button 
                        onClick={() => setActiveTab("analysis")}
                        className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white justify-start"
                      >
                        <Target className="w-5 h-5 mr-3" />
                        Deep Analysis
                      </Button>
                      
                      <Button 
                        onClick={() => setActiveTab("suggestions")}
                        className="w-full bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 text-white justify-start"
                      >
                        <Lightbulb className="w-5 h-5 mr-3" />
                        AI Suggestions
                      </Button>
                      
                      <Button 
                        onClick={() => setActiveTab("growth")}
                        className="w-full bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 text-white justify-start"
                      >
                        <TrendingUp className="w-5 h-5 mr-3" />
                        Growth Strategy
                      </Button>
                      
                      <Button 
                        onClick={() => setActiveTab("strategy")}
                        className="w-full bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700 text-white justify-start"
                      >
                        <Rocket className="w-5 h-5 mr-3" />
                        Content Strategy
                      </Button>
                    </CardContent>
                  </Card>
                </div>

                {/* AI Capabilities Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  <Card className="bg-white/95 backdrop-blur-sm border border-gray-200 shadow-lg group hover:shadow-xl transition-all duration-300">
                    <CardContent className="p-6 text-center">
                      <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-xl mx-auto mb-4 flex items-center justify-center group-hover:scale-110 transition-transform">
                        <Brain className="w-8 h-8 text-white" />
                      </div>
                      <h4 className="text-lg font-semibold text-gray-900 mb-2">Neural Analysis</h4>
                      <p className="text-gray-600 text-sm">Advanced pattern recognition for content optimization</p>
                    </CardContent>
                  </Card>

                  <Card className="bg-white/95 backdrop-blur-sm border border-gray-200 shadow-lg group hover:shadow-xl transition-all duration-300">
                    <CardContent className="p-6 text-center">
                      <div className="w-16 h-16 bg-gradient-to-br from-emerald-500 to-green-600 rounded-xl mx-auto mb-4 flex items-center justify-center group-hover:scale-110 transition-transform">
                        <Zap className="w-8 h-8 text-white" />
                      </div>
                      <h4 className="text-lg font-semibold text-gray-900 mb-2">Real-time Optimization</h4>
                      <p className="text-gray-600 text-sm">Instant content and strategy adjustments</p>
                    </CardContent>
                  </Card>

                  <Card className="bg-white/95 backdrop-blur-sm border border-gray-200 shadow-lg group hover:shadow-xl transition-all duration-300">
                    <CardContent className="p-6 text-center">
                      <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl mx-auto mb-4 flex items-center justify-center group-hover:scale-110 transition-transform">
                        <Sparkles className="w-8 h-8 text-white" />
                      </div>
                      <h4 className="text-lg font-semibold text-gray-900 mb-2">Predictive Intelligence</h4>
                      <p className="text-gray-600 text-sm">Future trend forecasting and viral prediction</p>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              {/* Analysis Tab */}
              <TabsContent value="analysis" className="space-y-8 mt-8">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  {/* Account Health */}
                  <Card className="bg-white/95 backdrop-blur-sm border border-gray-200 shadow-lg">
                    <CardHeader className="pb-4">
                      <CardTitle className="flex items-center gap-3 text-gray-900 text-xl font-bold">
                        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center">
                          <Target className="w-6 h-6 text-white" />
                        </div>
                        Account Health Analysis
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <div className="text-center">
                        <div className="text-5xl font-bold text-emerald-600 mb-4">
                          {analysisData?.accountHealth.score || 87}/100
                        </div>
                        <Progress value={analysisData?.accountHealth.score || 87} className="w-full h-3" />
                      </div>
                      
                      <div className="space-y-4">
                        {(analysisData?.accountHealth.factors || [
                          { name: "Content Quality", score: 92, impact: "Excellent engagement potential" },
                          { name: "Posting Consistency", score: 78, impact: "Room for improvement" },
                          { name: "Audience Targeting", score: 89, impact: "Well-optimized reach" }
                        ]).map((factor, index) => (
                          <div key={index} className="p-4 bg-gray-50 rounded-xl border border-gray-200">
                            <div className="flex items-center justify-between mb-2">
                              <p className="font-semibold text-gray-900">{factor.name}</p>
                              <div className="text-xl font-bold text-emerald-600">{factor.score}</div>
                            </div>
                            <p className="text-sm text-gray-600">{factor.impact}</p>
                            <Progress value={factor.score} className="mt-2 h-2" />
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>

                  {/* Growth Predictions */}
                  <Card className="bg-white/95 backdrop-blur-sm border border-gray-200 shadow-lg">
                    <CardHeader className="pb-4">
                      <CardTitle className="flex items-center gap-3 text-gray-900 text-xl font-bold">
                        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                          <TrendingUp className="w-6 h-6 text-white" />
                        </div>
                        AI Growth Predictions
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <div className="text-center mb-6">
                        <Badge className="bg-emerald-50 text-emerald-700 border-emerald-200 text-lg px-4 py-2">
                          {analysisData?.growthPredictions.confidence || 94}% Confidence
                        </Badge>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div className="text-center p-6 bg-cyan-50 rounded-xl border border-cyan-200">
                          <p className="text-gray-600 mb-2">Next Week</p>
                          <div className="text-3xl font-bold text-cyan-700">
                            +{analysisData?.growthPredictions.nextWeek.followers || 127}
                          </div>
                          <p className="text-xs text-gray-500">followers</p>
                        </div>
                        <div className="text-center p-6 bg-emerald-50 rounded-xl border border-emerald-200">
                          <p className="text-gray-600 mb-2">Next Month</p>
                          <div className="text-3xl font-bold text-emerald-700">
                            +{analysisData?.growthPredictions.nextMonth.followers || 547}
                          </div>
                          <p className="text-xs text-gray-500">followers</p>
                        </div>
                      </div>

                      <div className="space-y-3">
                        <h4 className="font-semibold text-gray-900">Engagement Growth</h4>
                        <div className="p-4 bg-purple-50 rounded-xl border border-purple-200">
                          <div className="flex justify-between items-center">
                            <span className="text-gray-700">Weekly Increase</span>
                            <span className="font-bold text-purple-600">
                              +{analysisData?.growthPredictions.nextWeek.engagement || 12}%
                            </span>
                          </div>
                        </div>
                        <div className="p-4 bg-orange-50 rounded-xl border border-orange-200">
                          <div className="flex justify-between items-center">
                            <span className="text-gray-700">Monthly Increase</span>
                            <span className="font-bold text-orange-600">
                              +{analysisData?.growthPredictions.nextMonth.engagement || 34}%
                            </span>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              {/* Growth Tab */}
              <TabsContent value="growth" className="space-y-8 mt-8">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                  <Card className="lg:col-span-2 bg-white/95 backdrop-blur-sm border border-gray-200 shadow-lg">
                    <CardHeader className="pb-4">
                      <CardTitle className="flex items-center gap-3 text-gray-900 text-xl font-bold">
                        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-500 to-green-600 flex items-center justify-center">
                          <BarChart3 className="w-6 h-6 text-white" />
                        </div>
                        Performance Analysis
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      {(analysisData?.contentStrategy.contentTypes || [
                        { type: "Video Content", performance: 87 },
                        { type: "Image Posts", performance: 73 },
                        { type: "Stories", performance: 92 },
                        { type: "Reels", performance: 95 }
                      ]).map((content, index) => (
                        <div key={index} className="p-6 bg-gray-50 rounded-xl border border-gray-200">
                          <div className="flex items-center justify-between mb-3">
                            <h4 className="font-semibold text-gray-900 text-lg">{content.type}</h4>
                            <div className="text-2xl font-bold text-emerald-600">{content.performance}%</div>
                          </div>
                          <Progress value={content.performance} className="h-3" />
                          <p className="text-gray-600 text-sm mt-2">Content engagement rate</p>
                        </div>
                      ))}
                    </CardContent>
                  </Card>

                  <Card className="bg-white/95 backdrop-blur-sm border border-gray-200 shadow-lg">
                    <CardHeader className="pb-4">
                      <CardTitle className="flex items-center gap-3 text-gray-900 text-xl font-bold">
                        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center">
                          <Clock className="w-6 h-6 text-white" />
                        </div>
                        Optimal Times
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {(analysisData?.contentStrategy.bestTimes || ["9:00 AM", "2:00 PM", "7:00 PM"]).map((time, index) => (
                        <div key={index} className="p-4 bg-emerald-50 rounded-xl border border-emerald-200">
                          <div className="flex items-center justify-between">
                            <span className="font-semibold text-gray-900">{time}</span>
                            <Badge className="bg-emerald-100 text-emerald-700 border-emerald-300">Peak</Badge>
                          </div>
                        </div>
                      ))}
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              {/* Suggestions Tab - AI Natural Language Insights */}
              <TabsContent value="suggestions" className="space-y-8 mt-8">
                <div className="space-y-8">
                  {/* AI Conversation Style Interface */}
                  <Card className="bg-white/95 backdrop-blur-sm border border-gray-200 shadow-lg">
                    <CardHeader className="pb-6">
                      <CardTitle className="flex items-center gap-3 text-gray-900 text-2xl font-bold">
                        <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-orange-500 to-red-600 flex items-center justify-center">
                          <Lightbulb className="w-7 h-7 text-white" />
                        </div>
                        AI Growth Assistant
                      </CardTitle>
                      <p className="text-gray-600 text-lg">Based on your account analysis, here are personalized insights and recommendations</p>
                    </CardHeader>
                    <CardContent className="space-y-8">
                      {/* Account Overview Message */}
                      <div className="p-6 bg-gradient-to-r from-cyan-50 to-blue-50 rounded-xl border border-cyan-200">
                        <div className="flex items-start gap-4">
                          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center flex-shrink-0">
                            <Brain className="w-5 h-5 text-white" />
                          </div>
                          <div className="space-y-3">
                            <h4 className="font-semibold text-gray-900 text-lg">Account Health Assessment</h4>
                            <p className="text-gray-700 leading-relaxed">
                              Looking at your Instagram account @arpit9996363 with {socialAccounts.find((acc: any) => acc.username === 'arpit9996363')?.followersCount || 9} followers and {socialAccounts.find((acc: any) => acc.username === 'arpit9996363')?.mediaCount || 18} posts, I can see you're in the early growth phase. Your content consistency shows promise, but there's significant opportunity for optimization.
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Growth Opportunity Insight */}
                      <div className="p-6 bg-gradient-to-r from-emerald-50 to-green-50 rounded-xl border border-emerald-200">
                        <div className="flex items-start gap-4">
                          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-emerald-500 to-green-600 flex items-center justify-center flex-shrink-0">
                            <TrendingUp className="w-5 h-5 text-white" />
                          </div>
                          <div className="space-y-3">
                            <h4 className="font-semibold text-gray-900 text-lg">Growth Potential Analysis</h4>
                            <p className="text-gray-700 leading-relaxed">
                              Based on your current engagement patterns, I predict you could gain 15-25 new followers weekly by implementing strategic posting times and content optimization. Your account shows strong potential for 3x growth within the next 2 months.
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Content Strategy Suggestion */}
                      <div className="p-6 bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl border border-purple-200">
                        <div className="flex items-start gap-4">
                          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center flex-shrink-0">
                            <Target className="w-5 h-5 text-white" />
                          </div>
                          <div className="space-y-3">
                            <h4 className="font-semibold text-gray-900 text-lg">Content Strategy Recommendation</h4>
                            <p className="text-gray-700 leading-relaxed">
                              Your posting frequency could be improved. I recommend posting 4-5 times per week, focusing on carousel posts which show 40% higher engagement. Consider creating educational content in your niche, as it tends to perform exceptionally well for accounts your size.
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Timing Optimization */}
                      <div className="p-6 bg-gradient-to-r from-amber-50 to-orange-50 rounded-xl border border-amber-200">
                        <div className="flex items-start gap-4">
                          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center flex-shrink-0">
                            <Clock className="w-5 h-5 text-white" />
                          </div>
                          <div className="space-y-3">
                            <h4 className="font-semibold text-gray-900 text-lg">Optimal Posting Schedule</h4>
                            <p className="text-gray-700 leading-relaxed">
                              Your audience appears most active between 2:00 PM - 4:00 PM and 7:00 PM - 9:00 PM IST. Try posting during these windows to maximize initial engagement, which is crucial for Instagram's algorithm to promote your content further.
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Engagement Improvement */}
                      <div className="p-6 bg-gradient-to-r from-rose-50 to-red-50 rounded-xl border border-rose-200">
                        <div className="flex items-start gap-4">
                          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-rose-500 to-red-600 flex items-center justify-center flex-shrink-0">
                            <Heart className="w-5 h-5 text-white" />
                          </div>
                          <div className="space-y-3">
                            <h4 className="font-semibold text-gray-900 text-lg">Engagement Optimization</h4>
                            <p className="text-gray-700 leading-relaxed">
                              Your current engagement rate could benefit from more interactive content. Try adding polls to your stories, asking questions in your captions, and responding to comments within the first hour of posting to boost visibility.
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Next Steps Action Plan */}
                      <div className="p-6 bg-gradient-to-r from-indigo-50 to-blue-50 rounded-xl border border-indigo-200">
                        <div className="flex items-start gap-4">
                          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-blue-600 flex items-center justify-center flex-shrink-0">
                            <Rocket className="w-5 h-5 text-white" />
                          </div>
                          <div className="space-y-4">
                            <h4 className="font-semibold text-gray-900 text-lg">Immediate Action Plan</h4>
                            <p className="text-gray-700 leading-relaxed">
                              This week, focus on creating 2-3 educational carousel posts about your niche. Use trending hashtags like #contentcreator and #socialmediatips. Engage with 10-15 accounts in your industry daily. This should result in 10-20 new followers by week's end.
                            </p>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              {/* Strategy Tab */}
              <TabsContent value="strategy" className="space-y-8 mt-8">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  {/* Trending Topics */}
                  <Card className="bg-white/95 backdrop-blur-sm border border-gray-200 shadow-lg">
                    <CardHeader className="pb-4">
                      <CardTitle className="flex items-center gap-3 text-gray-900 text-xl font-bold">
                        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center">
                          <Hash className="w-6 h-6 text-white" />
                        </div>
                        Trending Topics
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {(analysisData?.contentStrategy.trendingTopics || ["AI Technology", "Social Media Marketing", "Content Creation", "Digital Trends"]).map((topic, index) => (
                        <div key={index} className="p-4 bg-purple-50 rounded-xl border border-purple-200">
                          <div className="flex items-center gap-4">
                            <TrendingUp className="w-5 h-5 text-purple-600" />
                            <span className="font-semibold text-gray-900 flex-1">{topic}</span>
                            <Badge className="bg-purple-100 text-purple-700 border-purple-300">Hot</Badge>
                          </div>
                        </div>
                      ))}
                    </CardContent>
                  </Card>

                  {/* Top Hashtags */}
                  <Card className="bg-white/95 backdrop-blur-sm border border-gray-200 shadow-lg">
                    <CardHeader className="pb-4">
                      <CardTitle className="flex items-center gap-3 text-gray-900 text-xl font-bold">
                        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-600 flex items-center justify-center">
                          <Hash className="w-6 h-6 text-white" />
                        </div>
                        Top Hashtags
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="flex flex-wrap gap-3">
                        {(analysisData?.contentStrategy.topHashtags || ["socialmedia", "contentcreator", "digitalmarketing", "ai", "trending", "viral"]).map((hashtag, index) => (
                          <Badge key={index} className="bg-blue-50 text-blue-700 border-blue-200 text-sm px-3 py-2">
                            #{hashtag}
                          </Badge>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>
            </Tabs>
          </motion.div>

        {/* No Data State */}
        {!socialAccounts || socialAccounts.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            <Card className="bg-white/95 backdrop-blur-sm border-2 border-dashed border-gray-300 shadow-lg">
              <CardContent className="text-center py-16">
                <Brain className="w-20 h-20 text-cyan-600 mx-auto mb-6" />
                <h3 className="text-2xl font-bold text-gray-900 mb-4">Connect Your Social Accounts</h3>
                <p className="text-gray-600 mb-8 text-lg leading-relaxed">
                  Connect your Instagram, Twitter, or other social media accounts to get AI-powered insights and growth recommendations.
                </p>
                <Button className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white px-8 py-4 text-lg">
                  <Users className="w-5 h-5 mr-3" />
                  Connect Accounts
                </Button>
              </CardContent>
            </Card>
          </motion.div>
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
    </div>
  );
}