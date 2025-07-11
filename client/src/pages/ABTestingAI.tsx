import { useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { 
  TestTube, 
  TrendingUp, 
  Target, 
  Users, 
  BarChart3, 
  Clock, 
  CheckCircle, 
  AlertTriangle, 
  Play, 
  Pause, 
  RotateCcw,
  Zap,
  Brain,
  Lightbulb
} from "lucide-react";

interface ABTestInput {
  title: string;
  description: string;
  platform: string;
  audience: string;
  contentType: string;
  objective: string;
  currentPerformance?: {
    impressions: number;
    clicks: number;
    conversions: number;
    ctr: number;
    conversionRate: number;
  };
  brandGuidelines?: string;
  testDuration: string;
  budget?: number;
}

interface ABTestVariant {
  id: string;
  name: string;
  description: string;
  changes: string[];
  expectedImpact: string;
  riskLevel: 'low' | 'medium' | 'high';
  implementation: string[];
  estimatedLift: {
    metric: string;
    percentage: number;
    confidence: number;
  };
}

interface ABTestStrategy {
  testName: string;
  hypothesis: string;
  primaryMetric: string;
  secondaryMetrics: string[];
  variants: ABTestVariant[];
  testSetup: {
    trafficSplit: Record<string, number>;
    sampleSize: number;
    duration: string;
    successCriteria: string[];
    statisticalSignificance: number;
  };
  implementation: {
    trackingSetup: string[];
    technicalRequirements: string[];
    timeline: string[];
  };
  analysis: {
    keyInsights: string[];
    optimizationRecommendations: string[];
    nextTestSuggestions: string[];
  };
  risks: string[];
  expectedOutcomes: {
    bestCase: string;
    worstCase: string;
    mostLikely: string;
  };
}

export default function ABTestingAI() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState('create');
  const [testInput, setTestInput] = useState<ABTestInput>({
    title: '',
    description: '',
    platform: 'instagram',
    audience: '',
    contentType: 'post',
    objective: 'increase engagement',
    testDuration: '14 days',
    brandGuidelines: '',
    budget: undefined
  });
  const [hasCurrentPerformance, setHasCurrentPerformance] = useState(false);

  // Get user data for credits
  const { data: user } = useQuery({
    queryKey: ["/api/user"],
    refetchInterval: 30000
  });

  // Generate A/B test strategy mutation
  const generateStrategyMutation = useMutation({
    mutationFn: async (data: ABTestInput) => {
      const response = await apiRequest('POST', '/api/ai/ab-testing', data);
      return await response.json();
    },
    onSuccess: (data) => {
      toast({
        title: "Strategy Generated!",
        description: "Your A/B testing strategy has been created with comprehensive implementation plans.",
      });
      setGeneratedStrategy(data.strategy);
      setActiveTab('strategy');
      queryClient.invalidateQueries({ queryKey: ['/api/user'] });
    },
    onError: (error: any) => {
      if (error.upgradeModal) {
        toast({
          title: "Insufficient Credits",
          description: `You need ${error.required} credits to use A/B Testing AI.`,
          variant: "destructive"
        });
      } else {
        toast({
          title: "Strategy Generation Failed",
          description: error.message || "Failed to generate A/B testing strategy. Please try again.",
          variant: "destructive"
        });
      }
    }
  });

  const [generatedStrategy, setGeneratedStrategy] = useState<ABTestStrategy | null>(null);

  const handleGenerateStrategy = () => {
    if (!testInput.title || !testInput.description || !testInput.audience || !testInput.objective) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields to generate your A/B testing strategy.",
        variant: "destructive"
      });
      return;
    }

    const finalInput = {
      ...testInput,
      currentPerformance: hasCurrentPerformance ? testInput.currentPerformance : undefined
    };

    generateStrategyMutation.mutate(finalInput);
  };

  const getRiskColor = (level: string) => {
    switch (level) {
      case 'low': return 'text-green-400 bg-green-400/10 border-green-400/30';
      case 'medium': return 'text-blue-400 bg-blue-400/10 border-blue-400/30';
      case 'high': return 'text-red-400 bg-red-400/10 border-red-400/30';
      default: return 'text-gray-400 bg-gray-400/10 border-gray-400/30';
    }
  };

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat().format(num);
  };

  return (
    <div className="min-h-screen bg-transparent text-white p-4 md:p-6">
      {/* Cosmic Background Elements */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-20 left-10 w-1 h-1 bg-electric-cyan/30 rounded-full animate-pulse"></div>
        <div className="absolute top-40 right-20 w-1 h-1 bg-solar-gold/20 rounded-full"></div>
        <div className="absolute bottom-20 left-1/4 w-1 h-1 bg-nebula-purple/30 rounded-full animate-pulse"></div>
      </div>

      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center space-y-4"
        >
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center">
              <TestTube className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-electric-cyan to-nebula-purple bg-clip-text text-transparent">
              A/B Testing AI
            </h1>
          </div>
          <p className="text-asteroid-silver text-lg max-w-2xl mx-auto">
            Generate data-driven A/B testing strategies with statistical rigor and optimization insights
          </p>
          {user && (
            <div className="flex items-center justify-center gap-2 text-sm">
              <span className="text-asteroid-silver">Credits:</span>
              <span className="text-electric-cyan font-semibold">{user.credits}</span>
              <span className="text-asteroid-silver">• Cost: 4 credits</span>
            </div>
          )}
        </motion.div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3 bg-cosmic-void/50 border border-asteroid-silver/30">
            <TabsTrigger value="create" className="data-[state=active]:bg-electric-cyan data-[state=active]:text-space-navy">
              <Brain className="w-4 h-4 mr-2" />
              Create Strategy
            </TabsTrigger>
            <TabsTrigger 
              value="strategy" 
              className="data-[state=active]:bg-electric-cyan data-[state=active]:text-space-navy"
              disabled={!generatedStrategy}
            >
              <Target className="w-4 h-4 mr-2" />
              Strategy & Analysis
            </TabsTrigger>
            <TabsTrigger value="implementation" className="data-[state=active]:bg-electric-cyan data-[state=active]:text-space-navy">
              <CheckCircle className="w-4 h-4 mr-2" />
              Implementation
            </TabsTrigger>
          </TabsList>

          {/* Create Strategy Tab */}
          <TabsContent value="create" className="space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              {/* Basic Information */}
              <Card className="bg-cosmic-void/40 border-asteroid-silver/30">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <Lightbulb className="w-5 h-5 text-electric-cyan" />
                    Test Campaign Details
                  </CardTitle>
                  <CardDescription className="text-asteroid-silver">
                    Define your campaign and testing objectives
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="title" className="text-white">Campaign Title *</Label>
                      <Input
                        id="title"
                        value={testInput.title}
                        onChange={(e) => setTestInput(prev => ({ ...prev, title: e.target.value }))}
                        placeholder="e.g., Summer Product Launch Campaign"
                        className="bg-cosmic-void/50 border-asteroid-silver/30 text-white"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="platform" className="text-white">Platform *</Label>
                      <Select value={testInput.platform} onValueChange={(value) => setTestInput(prev => ({ ...prev, platform: value }))}>
                        <SelectTrigger className="bg-cosmic-void/50 border-asteroid-silver/30 text-white">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="bg-cosmic-void border-asteroid-silver/30">
                          <SelectItem value="instagram">Instagram</SelectItem>
                          <SelectItem value="facebook">Facebook</SelectItem>
                          <SelectItem value="youtube">YouTube</SelectItem>
                          <SelectItem value="tiktok">TikTok</SelectItem>
                          <SelectItem value="linkedin">LinkedIn</SelectItem>
                          <SelectItem value="twitter">Twitter</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="description" className="text-white">Campaign Description *</Label>
                    <Textarea
                      id="description"
                      value={testInput.description}
                      onChange={(e) => setTestInput(prev => ({ ...prev, description: e.target.value }))}
                      placeholder="Describe your campaign content, goals, and what you want to test..."
                      className="bg-cosmic-void/50 border-asteroid-silver/30 text-white min-h-[100px]"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="audience" className="text-white">Target Audience *</Label>
                      <Input
                        id="audience"
                        value={testInput.audience}
                        onChange={(e) => setTestInput(prev => ({ ...prev, audience: e.target.value }))}
                        placeholder="e.g., 18-35 fitness enthusiasts"
                        className="bg-cosmic-void/50 border-asteroid-silver/30 text-white"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="contentType" className="text-white">Content Type *</Label>
                      <Select value={testInput.contentType} onValueChange={(value) => setTestInput(prev => ({ ...prev, contentType: value }))}>
                        <SelectTrigger className="bg-cosmic-void/50 border-asteroid-silver/30 text-white">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="bg-cosmic-void border-asteroid-silver/30">
                          <SelectItem value="post">Static Post</SelectItem>
                          <SelectItem value="video">Video</SelectItem>
                          <SelectItem value="story">Story</SelectItem>
                          <SelectItem value="reel">Reel/Short</SelectItem>
                          <SelectItem value="carousel">Carousel</SelectItem>
                          <SelectItem value="live">Live Stream</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="objective" className="text-white">Primary Objective *</Label>
                      <Select value={testInput.objective} onValueChange={(value) => setTestInput(prev => ({ ...prev, objective: value }))}>
                        <SelectTrigger className="bg-cosmic-void/50 border-asteroid-silver/30 text-white">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="bg-cosmic-void border-asteroid-silver/30">
                          <SelectItem value="increase engagement">Increase Engagement</SelectItem>
                          <SelectItem value="boost reach">Boost Reach</SelectItem>
                          <SelectItem value="drive traffic">Drive Traffic</SelectItem>
                          <SelectItem value="generate leads">Generate Leads</SelectItem>
                          <SelectItem value="increase conversions">Increase Conversions</SelectItem>
                          <SelectItem value="grow followers">Grow Followers</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="duration" className="text-white">Test Duration *</Label>
                      <Select value={testInput.testDuration} onValueChange={(value) => setTestInput(prev => ({ ...prev, testDuration: value }))}>
                        <SelectTrigger className="bg-cosmic-void/50 border-asteroid-silver/30 text-white">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="bg-cosmic-void border-asteroid-silver/30">
                          <SelectItem value="7 days">7 Days</SelectItem>
                          <SelectItem value="14 days">14 Days</SelectItem>
                          <SelectItem value="21 days">21 Days</SelectItem>
                          <SelectItem value="30 days">30 Days</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="budget" className="text-white">Budget (USD)</Label>
                      <Input
                        id="budget"
                        type="number"
                        value={testInput.budget || ''}
                        onChange={(e) => setTestInput(prev => ({ ...prev, budget: e.target.value ? Number(e.target.value) : undefined }))}
                        placeholder="Optional campaign budget"
                        className="bg-cosmic-void/50 border-asteroid-silver/30 text-white"
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Current Performance */}
              <Card className="bg-cosmic-void/40 border-asteroid-silver/30">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <BarChart3 className="w-5 h-5 text-electric-cyan" />
                    Current Performance Data
                  </CardTitle>
                  <CardDescription className="text-asteroid-silver">
                    Optional: Provide baseline metrics for better optimization
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="hasPerformance"
                      checked={hasCurrentPerformance}
                      onChange={(e) => setHasCurrentPerformance(e.target.checked)}
                      className="rounded border-asteroid-silver/30"
                    />
                    <Label htmlFor="hasPerformance" className="text-white">
                      I have current performance data
                    </Label>
                  </div>

                  {hasCurrentPerformance && (
                    <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                      <div className="space-y-2">
                        <Label className="text-white">Impressions</Label>
                        <Input
                          type="number"
                          value={testInput.currentPerformance?.impressions || ''}
                          onChange={(e) => setTestInput(prev => ({
                            ...prev,
                            currentPerformance: {
                              ...prev.currentPerformance,
                              impressions: Number(e.target.value) || 0,
                              clicks: prev.currentPerformance?.clicks || 0,
                              conversions: prev.currentPerformance?.conversions || 0,
                              ctr: prev.currentPerformance?.ctr || 0,
                              conversionRate: prev.currentPerformance?.conversionRate || 0
                            }
                          }))}
                          className="bg-cosmic-void/50 border-asteroid-silver/30 text-white"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label className="text-white">Clicks</Label>
                        <Input
                          type="number"
                          value={testInput.currentPerformance?.clicks || ''}
                          onChange={(e) => setTestInput(prev => ({
                            ...prev,
                            currentPerformance: {
                              ...prev.currentPerformance,
                              impressions: prev.currentPerformance?.impressions || 0,
                              clicks: Number(e.target.value) || 0,
                              conversions: prev.currentPerformance?.conversions || 0,
                              ctr: prev.currentPerformance?.ctr || 0,
                              conversionRate: prev.currentPerformance?.conversionRate || 0
                            }
                          }))}
                          className="bg-cosmic-void/50 border-asteroid-silver/30 text-white"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label className="text-white">Conversions</Label>
                        <Input
                          type="number"
                          value={testInput.currentPerformance?.conversions || ''}
                          onChange={(e) => setTestInput(prev => ({
                            ...prev,
                            currentPerformance: {
                              ...prev.currentPerformance,
                              impressions: prev.currentPerformance?.impressions || 0,
                              clicks: prev.currentPerformance?.clicks || 0,
                              conversions: Number(e.target.value) || 0,
                              ctr: prev.currentPerformance?.ctr || 0,
                              conversionRate: prev.currentPerformance?.conversionRate || 0
                            }
                          }))}
                          className="bg-cosmic-void/50 border-asteroid-silver/30 text-white"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label className="text-white">CTR (%)</Label>
                        <Input
                          type="number"
                          step="0.01"
                          value={testInput.currentPerformance?.ctr || ''}
                          onChange={(e) => setTestInput(prev => ({
                            ...prev,
                            currentPerformance: {
                              ...prev.currentPerformance,
                              impressions: prev.currentPerformance?.impressions || 0,
                              clicks: prev.currentPerformance?.clicks || 0,
                              conversions: prev.currentPerformance?.conversions || 0,
                              ctr: Number(e.target.value) || 0,
                              conversionRate: prev.currentPerformance?.conversionRate || 0
                            }
                          }))}
                          className="bg-cosmic-void/50 border-asteroid-silver/30 text-white"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label className="text-white">Conv. Rate (%)</Label>
                        <Input
                          type="number"
                          step="0.01"
                          value={testInput.currentPerformance?.conversionRate || ''}
                          onChange={(e) => setTestInput(prev => ({
                            ...prev,
                            currentPerformance: {
                              ...prev.currentPerformance,
                              impressions: prev.currentPerformance?.impressions || 0,
                              clicks: prev.currentPerformance?.clicks || 0,
                              conversions: prev.currentPerformance?.conversions || 0,
                              ctr: prev.currentPerformance?.ctr || 0,
                              conversionRate: Number(e.target.value) || 0
                            }
                          }))}
                          className="bg-cosmic-void/50 border-asteroid-silver/30 text-white"
                        />
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Brand Guidelines */}
              <Card className="bg-cosmic-void/40 border-asteroid-silver/30">
                <CardHeader>
                  <CardTitle className="text-white">Brand Guidelines</CardTitle>
                  <CardDescription className="text-asteroid-silver">
                    Optional: Add brand voice, style, or content restrictions
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Textarea
                    value={testInput.brandGuidelines || ''}
                    onChange={(e) => setTestInput(prev => ({ ...prev, brandGuidelines: e.target.value }))}
                    placeholder="e.g., Always use friendly tone, avoid controversial topics, include brand hashtag..."
                    className="bg-cosmic-void/50 border-asteroid-silver/30 text-white min-h-[80px]"
                  />
                </CardContent>
              </Card>

              {/* Generate Button */}
              <div className="flex justify-center">
                <Button
                  onClick={handleGenerateStrategy}
                  disabled={generateStrategyMutation.isPending}
                  className="bg-gradient-to-r from-electric-cyan to-nebula-purple hover:opacity-90 text-white px-8 py-6 text-lg"
                >
                  {generateStrategyMutation.isPending ? (
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2"></div>
                  ) : (
                    <Zap className="w-5 h-5 mr-2" />
                  )}
                  Generate A/B Testing Strategy
                </Button>
              </div>
            </motion.div>
          </TabsContent>

          {/* Strategy & Analysis Tab */}
          <TabsContent value="strategy" className="space-y-6">
            {generatedStrategy && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-6"
              >
                {/* Test Overview */}
                <Card className="bg-cosmic-void/40 border-asteroid-silver/30">
                  <CardHeader>
                    <CardTitle className="text-white text-xl">{generatedStrategy.testName}</CardTitle>
                    <CardDescription className="text-asteroid-silver">
                      {generatedStrategy.hypothesis}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="text-center p-4 bg-gradient-to-r from-electric-cyan/10 to-nebula-purple/10 rounded-lg border border-electric-cyan/20">
                        <Target className="w-6 h-6 text-electric-cyan mx-auto mb-2" />
                        <div className="text-sm text-asteroid-silver">Primary Metric</div>
                        <div className="text-white font-semibold">{generatedStrategy.primaryMetric}</div>
                      </div>
                      <div className="text-center p-4 bg-gradient-to-r from-electric-cyan/10 to-nebula-purple/10 rounded-lg border border-electric-cyan/20">
                        <Users className="w-6 h-6 text-electric-cyan mx-auto mb-2" />
                        <div className="text-sm text-asteroid-silver">Sample Size</div>
                        <div className="text-white font-semibold">{formatNumber(generatedStrategy.testSetup.sampleSize)}</div>
                      </div>
                      <div className="text-center p-4 bg-gradient-to-r from-electric-cyan/10 to-nebula-purple/10 rounded-lg border border-electric-cyan/20">
                        <Clock className="w-6 h-6 text-electric-cyan mx-auto mb-2" />
                        <div className="text-sm text-asteroid-silver">Duration</div>
                        <div className="text-white font-semibold">{generatedStrategy.testSetup.duration}</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Variants */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {generatedStrategy.variants.map((variant, index) => (
                    <Card key={variant.id} className="bg-cosmic-void/40 border-asteroid-silver/30">
                      <CardHeader>
                        <div className="flex items-center justify-between">
                          <CardTitle className="text-white">{variant.name}</CardTitle>
                          <Badge className={`${getRiskColor(variant.riskLevel)} border`}>
                            {variant.riskLevel} risk
                          </Badge>
                        </div>
                        <CardDescription className="text-asteroid-silver">
                          {variant.description}
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div>
                          <h4 className="text-white font-medium mb-2">Key Changes</h4>
                          <ul className="space-y-1">
                            {variant.changes.map((change, i) => (
                              <li key={i} className="text-asteroid-silver text-sm flex items-start gap-2">
                                <span className="text-electric-cyan mt-1">•</span>
                                {change}
                              </li>
                            ))}
                          </ul>
                        </div>

                        <div>
                          <h4 className="text-white font-medium mb-2">Expected Impact</h4>
                          <p className="text-asteroid-silver text-sm">{variant.expectedImpact}</p>
                        </div>

                        <div className="bg-gradient-to-r from-green-500/10 to-emerald-500/10 rounded-lg p-3 border border-green-500/20">
                          <div className="flex items-center gap-2 mb-1">
                            <TrendingUp className="w-4 h-4 text-green-400" />
                            <span className="text-green-400 font-medium">Estimated Lift</span>
                          </div>
                          <div className="text-white">
                            {variant.estimatedLift.percentage}% improvement in {variant.estimatedLift.metric}
                          </div>
                          <div className="text-green-400 text-sm">
                            {variant.estimatedLift.confidence}% confidence
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>

                {/* Test Setup Details */}
                <Card className="bg-cosmic-void/40 border-asteroid-silver/30">
                  <CardHeader>
                    <CardTitle className="text-white">Test Configuration</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <h4 className="text-white font-medium mb-3">Traffic Split</h4>
                        <div className="space-y-2">
                          {Object.entries(generatedStrategy.testSetup.trafficSplit).map(([variant, percentage]) => (
                            <div key={variant} className="flex items-center justify-between">
                              <span className="text-asteroid-silver capitalize">{variant}</span>
                              <div className="flex items-center gap-2">
                                <Progress value={percentage} className="w-20 h-2" />
                                <span className="text-white text-sm">{percentage}%</span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                      
                      <div>
                        <h4 className="text-white font-medium mb-3">Success Criteria</h4>
                        <ul className="space-y-1">
                          {generatedStrategy.testSetup.successCriteria.map((criteria, i) => (
                            <li key={i} className="text-asteroid-silver text-sm flex items-start gap-2">
                              <CheckCircle className="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0" />
                              {criteria}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>

                    <div>
                      <h4 className="text-white font-medium mb-3">Secondary Metrics</h4>
                      <div className="flex flex-wrap gap-2">
                        {generatedStrategy.secondaryMetrics.map((metric, i) => (
                          <Badge key={i} variant="outline" className="border-electric-cyan/30 text-electric-cyan">
                            {metric}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Analysis & Insights */}
                <Card className="bg-cosmic-void/40 border-asteroid-silver/30">
                  <CardHeader>
                    <CardTitle className="text-white">AI Analysis & Recommendations</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <h4 className="text-white font-medium mb-3 flex items-center gap-2">
                        <Lightbulb className="w-4 h-4 text-electric-cyan" />
                        Key Insights
                      </h4>
                      <ul className="space-y-2">
                        {generatedStrategy.analysis.keyInsights.map((insight, i) => (
                          <li key={i} className="text-asteroid-silver text-sm flex items-start gap-2">
                            <span className="text-electric-cyan mt-1">•</span>
                            {insight}
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div>
                      <h4 className="text-white font-medium mb-3">Optimization Recommendations</h4>
                      <ul className="space-y-2">
                        {generatedStrategy.analysis.optimizationRecommendations.map((rec, i) => (
                          <li key={i} className="text-asteroid-silver text-sm flex items-start gap-2">
                            <span className="text-green-400 mt-1">✓</span>
                            {rec}
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div>
                      <h4 className="text-white font-medium mb-3">Next Test Suggestions</h4>
                      <ul className="space-y-2">
                        {generatedStrategy.analysis.nextTestSuggestions.map((suggestion, i) => (
                          <li key={i} className="text-asteroid-silver text-sm flex items-start gap-2">
                            <span className="text-nebula-purple mt-1">→</span>
                            {suggestion}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </CardContent>
                </Card>

                {/* Expected Outcomes */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Card className="bg-gradient-to-r from-green-500/10 to-emerald-500/10 border-green-500/20">
                    <CardHeader className="pb-3">
                      <CardTitle className="text-green-400 text-sm">Best Case</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-asteroid-silver text-sm">{generatedStrategy.expectedOutcomes.bestCase}</p>
                    </CardContent>
                  </Card>
                  
                  <Card className="bg-gradient-to-r from-blue-500/10 to-cyan-500/10 border-blue-500/20">
                    <CardHeader className="pb-3">
                      <CardTitle className="text-blue-400 text-sm">Most Likely</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-asteroid-silver text-sm">{generatedStrategy.expectedOutcomes.mostLikely}</p>
                    </CardContent>
                  </Card>
                  
                  <Card className="bg-gradient-to-r from-blue-500/10 to-purple-500/10 border-blue-500/20">
                    <CardHeader className="pb-3">
                      <CardTitle className="text-red-400 text-sm">Worst Case</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-asteroid-silver text-sm">{generatedStrategy.expectedOutcomes.worstCase}</p>
                    </CardContent>
                  </Card>
                </div>

                {/* Risks */}
                {generatedStrategy.risks.length > 0 && (
                  <Card className="bg-gradient-to-r from-red-500/10 to-orange-500/10 border-red-500/20">
                    <CardHeader>
                      <CardTitle className="text-red-400 flex items-center gap-2">
                        <AlertTriangle className="w-5 h-5" />
                        Risk Assessment
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-2">
                        {generatedStrategy.risks.map((risk, i) => (
                          <li key={i} className="text-asteroid-silver text-sm flex items-start gap-2">
                            <span className="text-red-400 mt-1">⚠</span>
                            {risk}
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                )}
              </motion.div>
            )}
          </TabsContent>

          {/* Implementation Tab */}
          <TabsContent value="implementation" className="space-y-6">
            {generatedStrategy && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-6"
              >
                {/* Implementation Roadmap */}
                <Card className="bg-cosmic-void/40 border-asteroid-silver/30">
                  <CardHeader>
                    <CardTitle className="text-white">Implementation Roadmap</CardTitle>
                    <CardDescription className="text-asteroid-silver">
                      Step-by-step guide to launch your A/B test
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div>
                      <h4 className="text-white font-medium mb-3">Tracking Setup</h4>
                      <div className="space-y-3">
                        {generatedStrategy.implementation.trackingSetup.map((step, i) => (
                          <div key={i} className="flex items-start gap-3">
                            <div className="w-6 h-6 rounded-full bg-electric-cyan text-space-navy text-xs font-bold flex items-center justify-center mt-1">
                              {i + 1}
                            </div>
                            <p className="text-asteroid-silver text-sm">{step}</p>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div>
                      <h4 className="text-white font-medium mb-3">Technical Requirements</h4>
                      <div className="space-y-2">
                        {generatedStrategy.implementation.technicalRequirements.map((req, i) => (
                          <div key={i} className="flex items-start gap-2">
                            <CheckCircle className="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0" />
                            <p className="text-asteroid-silver text-sm">{req}</p>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div>
                      <h4 className="text-white font-medium mb-3">Timeline</h4>
                      <div className="space-y-2">
                        {generatedStrategy.implementation.timeline.map((phase, i) => (
                          <div key={i} className="flex items-start gap-2">
                            <Clock className="w-4 h-4 text-blue-400 mt-0.5 flex-shrink-0" />
                            <p className="text-asteroid-silver text-sm">{phase}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Implementation Actions */}
                <Card className="bg-cosmic-void/40 border-asteroid-silver/30">
                  <CardHeader>
                    <CardTitle className="text-white">Quick Actions</CardTitle>
                    <CardDescription className="text-asteroid-silver">
                      Launch your test with these recommended next steps
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <Button
                        variant="outline"
                        className="border-electric-cyan/30 text-electric-cyan hover:bg-electric-cyan/10 justify-start"
                        onClick={() => setActiveTab('create')}
                      >
                        <RotateCcw className="w-4 h-4 mr-2" />
                        Create New Test
                      </Button>
                      <Button
                        variant="outline"
                        className="border-green-500/30 text-green-400 hover:bg-green-500/10 justify-start"
                      >
                        <Play className="w-4 h-4 mr-2" />
                        Launch Test Campaign
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}