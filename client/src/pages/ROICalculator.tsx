import { useState } from 'react';
import { Calculator, DollarSign, TrendingUp, Target, BarChart3, Zap, AlertCircle, CheckCircle, ArrowUp, ArrowDown } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { motion } from 'framer-motion';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useToast } from '@/hooks/use-toast';
import { apiRequest } from '@/lib/queryClient';

interface ROIInput {
  investment: number;
  costs: {
    contentCreation: number;
    advertising: number;
    tools: number;
    other: number;
  };
  metrics: {
    reach: number;
    engagement: number;
    conversions: number;
    revenue: number;
  };
  timeframe: string;
  industry: string;
  platform: string;
}

interface ROIResult {
  roi: number;
  profit: number;
  costPerConversion: number;
  revenuePerFollower: number;
  engagementValue: number;
  projections: {
    month1: number;
    month3: number;
    month6: number;
    month12: number;
  };
  benchmarks: {
    industry: number;
    platform: number;
    category: string;
  };
  recommendations: string[];
}

export default function ROICalculator() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState('calculator');
  const [roiInput, setROIInput] = useState<ROIInput>({
    investment: 0,
    costs: {
      contentCreation: 0,
      advertising: 0,
      tools: 0,
      other: 0
    },
    metrics: {
      reach: 0,
      engagement: 0,
      conversions: 0,
      revenue: 0
    },
    timeframe: '30d',
    industry: 'general',
    platform: 'instagram'
  });
  const [roiResult, setROIResult] = useState<ROIResult | null>(null);

  // Get user data for credits
  const { data: user } = useQuery({
    queryKey: ["/api/user"],
    refetchInterval: 30000
  });

  // Calculate ROI mutation
  const calculateMutation = useMutation({
    mutationFn: async (data: ROIInput) => {
      const result = await apiRequest('POST', '/api/ai/roi-calculator', {
        campaignId: `roi_${Date.now()}`,
        investment: data.investment,
        revenue: data.metrics.revenue,
        costs: {
          adSpend: data.costs.advertising,
          contentCreation: data.costs.contentCreation,
          toolsAndSoftware: data.costs.tools,
          personnel: 0,
          other: data.costs.other
        },
        metrics: {
          impressions: data.metrics.reach,
          clicks: Math.floor(data.metrics.reach * 0.03), // 3% CTR estimate
          conversions: data.metrics.conversions,
          engagementRate: data.metrics.engagement,
          reachRate: data.metrics.reach > 0 ? (data.metrics.engagement / data.metrics.reach) * 100 : 0
        },
        timeframe: data.timeframe,
        industry: data.industry,
        platform: data.platform
      });
      return result;
    },
    onSuccess: (data: ROIResult) => {
      setROIResult(data);
      setActiveTab('results');
      toast({
        title: "ROI Analysis Complete!",
        description: "Your comprehensive ROI report is ready with AI insights.",
      });
      queryClient.invalidateQueries({ queryKey: ['/api/roi-calculations'] });
    },
    onError: (error: any) => {
      if (error.upgradeModal) {
        toast({
          title: "Insufficient Credits",
          description: `You need ${error.required} credits to use ROI Calculator.`,
          variant: "destructive"
        });
      } else {
        toast({
          title: "Analysis Failed",
          description: error.message || "Failed to calculate ROI. Please try again.",
          variant: "destructive"
        });
      }
    }
  });



  const handleCalculateROI = () => {
    const totalCosts = Object.values(roiInput.costs).reduce((sum, cost) => sum + cost, 0);
    const totalInvestment = roiInput.investment + totalCosts;

    if (totalInvestment === 0 || roiInput.metrics.revenue === 0) {
      toast({
        title: "Missing Information",
        description: "Please enter investment, costs, and revenue data.",
        variant: "destructive"
      });
      return;
    }

    calculateMutation.mutate(roiInput);
  };

  const updateCost = (category: keyof ROIInput['costs'], value: number) => {
    setROIInput(prev => ({
      ...prev,
      costs: {
        ...prev.costs,
        [category]: value
      }
    }));
  };

  const updateMetric = (metric: keyof ROIInput['metrics'], value: number) => {
    setROIInput(prev => ({
      ...prev,
      metrics: {
        ...prev.metrics,
        [metric]: value
      }
    }));
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  const getROIColor = (roi: number) => {
    if (roi >= 200) return 'text-green-400';
    if (roi >= 100) return 'text-yellow-400';
    if (roi >= 50) return 'text-orange-400';
    return 'text-red-400';
  };

  const totalCosts = Object.values(roiInput.costs).reduce((sum, cost) => sum + cost, 0);
  const totalInvestment = roiInput.investment + totalCosts;
  const simpleROI = totalInvestment > 0 ? ((roiInput.metrics.revenue - totalInvestment) / totalInvestment * 100) : 0;

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
            <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-green-500 to-emerald-500 flex items-center justify-center">
              <Calculator className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-electric-cyan to-nebula-purple bg-clip-text text-transparent">
              ROI Calculator AI
            </h1>
          </div>
          <p className="text-asteroid-silver text-lg max-w-2xl mx-auto">
            Calculate your social media return on investment with AI-powered insights and industry benchmarks
          </p>
        </motion.div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3 bg-cosmic-void/50 border border-asteroid-silver/30">
            <TabsTrigger value="calculator" className="data-[state=active]:bg-electric-cyan data-[state=active]:text-space-navy">
              Calculator
            </TabsTrigger>
            <TabsTrigger value="results" className="data-[state=active]:bg-electric-cyan data-[state=active]:text-space-navy">
              Results
            </TabsTrigger>
            <TabsTrigger value="projections" className="data-[state=active]:bg-electric-cyan data-[state=active]:text-space-navy">
              Projections
            </TabsTrigger>
          </TabsList>

          {/* Calculator Tab */}
          <TabsContent value="calculator" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Input Form */}
              <div className="space-y-6">
                {/* Basic Information */}
                <Card className="bg-cosmic-void/40 border-asteroid-silver/30">
                  <CardHeader>
                    <CardTitle className="text-white flex items-center gap-2">
                      <Target className="w-5 h-5 text-electric-cyan" />
                      Campaign Details
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="platform">Platform</Label>
                        <Select 
                          value={roiInput.platform} 
                          onValueChange={(value) => setROIInput(prev => ({ ...prev, platform: value }))}
                        >
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
                        <Label htmlFor="industry">Industry</Label>
                        <Select 
                          value={roiInput.industry} 
                          onValueChange={(value) => setROIInput(prev => ({ ...prev, industry: value }))}
                        >
                          <SelectTrigger className="bg-cosmic-void/50 border-asteroid-silver/30 text-white">
                            <SelectValue placeholder="Select industry" />
                          </SelectTrigger>
                          <SelectContent className="bg-cosmic-void border-asteroid-silver/30">
                            <SelectItem value="ecommerce">E-commerce</SelectItem>
                            <SelectItem value="fitness">Fitness</SelectItem>
                            <SelectItem value="technology">Technology</SelectItem>
                            <SelectItem value="food">Food & Beverage</SelectItem>
                            <SelectItem value="fashion">Fashion</SelectItem>
                            <SelectItem value="general">General</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="timeframe">Timeframe</Label>
                      <Select 
                        value={roiInput.timeframe} 
                        onValueChange={(value) => setROIInput(prev => ({ ...prev, timeframe: value }))}
                      >
                        <SelectTrigger className="bg-cosmic-void/50 border-asteroid-silver/30 text-white">
                          <SelectValue placeholder="Select timeframe" />
                        </SelectTrigger>
                        <SelectContent className="bg-cosmic-void border-asteroid-silver/30">
                          <SelectItem value="7d">7 Days</SelectItem>
                          <SelectItem value="30d">30 Days</SelectItem>
                          <SelectItem value="90d">90 Days</SelectItem>
                          <SelectItem value="180d">6 Months</SelectItem>
                          <SelectItem value="365d">1 Year</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </CardContent>
                </Card>

                {/* Investment & Costs */}
                <Card className="bg-cosmic-void/40 border-asteroid-silver/30">
                  <CardHeader>
                    <CardTitle className="text-white flex items-center gap-2">
                      <DollarSign className="w-5 h-5 text-green-400" />
                      Investment & Costs
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="investment">Initial Investment ($)</Label>
                      <Input
                        id="investment"
                        type="number"
                        placeholder="0"
                        value={roiInput.investment || ''}
                        onChange={(e) => setROIInput(prev => ({ ...prev, investment: Number(e.target.value) }))}
                        className="bg-cosmic-void/50 border-asteroid-silver/30 text-white"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Content Creation ($)</Label>
                        <Input
                          type="number"
                          placeholder="0"
                          value={roiInput.costs.contentCreation || ''}
                          onChange={(e) => updateCost('contentCreation', Number(e.target.value))}
                          className="bg-cosmic-void/50 border-asteroid-silver/30 text-white"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Advertising ($)</Label>
                        <Input
                          type="number"
                          placeholder="0"
                          value={roiInput.costs.advertising || ''}
                          onChange={(e) => updateCost('advertising', Number(e.target.value))}
                          className="bg-cosmic-void/50 border-asteroid-silver/30 text-white"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Tools & Software ($)</Label>
                        <Input
                          type="number"
                          placeholder="0"
                          value={roiInput.costs.tools || ''}
                          onChange={(e) => updateCost('tools', Number(e.target.value))}
                          className="bg-cosmic-void/50 border-asteroid-silver/30 text-white"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Other Costs ($)</Label>
                        <Input
                          type="number"
                          placeholder="0"
                          value={roiInput.costs.other || ''}
                          onChange={(e) => updateCost('other', Number(e.target.value))}
                          className="bg-cosmic-void/50 border-asteroid-silver/30 text-white"
                        />
                      </div>
                    </div>

                    <div className="bg-gradient-to-r from-green-500/10 to-emerald-500/10 rounded-lg p-3 border border-green-500/20">
                      <div className="text-sm font-medium text-green-400">Total Investment</div>
                      <div className="text-xl font-bold text-white">{formatCurrency(totalInvestment)}</div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Performance Metrics */}
              <div className="space-y-6">
                <Card className="bg-cosmic-void/40 border-asteroid-silver/30">
                  <CardHeader>
                    <CardTitle className="text-white flex items-center gap-2">
                      <BarChart3 className="w-5 h-5 text-blue-400" />
                      Performance Metrics
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Reach</Label>
                        <Input
                          type="number"
                          placeholder="0"
                          value={roiInput.metrics.reach || ''}
                          onChange={(e) => updateMetric('reach', Number(e.target.value))}
                          className="bg-cosmic-void/50 border-asteroid-silver/30 text-white"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Engagement</Label>
                        <Input
                          type="number"
                          placeholder="0"
                          value={roiInput.metrics.engagement || ''}
                          onChange={(e) => updateMetric('engagement', Number(e.target.value))}
                          className="bg-cosmic-void/50 border-asteroid-silver/30 text-white"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Conversions</Label>
                        <Input
                          type="number"
                          placeholder="0"
                          value={roiInput.metrics.conversions || ''}
                          onChange={(e) => updateMetric('conversions', Number(e.target.value))}
                          className="bg-cosmic-void/50 border-asteroid-silver/30 text-white"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Revenue ($)</Label>
                        <Input
                          type="number"
                          placeholder="0"
                          value={roiInput.metrics.revenue || ''}
                          onChange={(e) => updateMetric('revenue', Number(e.target.value))}
                          className="bg-cosmic-void/50 border-asteroid-silver/30 text-white"
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Quick ROI Preview */}
                <Card className="bg-cosmic-void/40 border-asteroid-silver/30">
                  <CardHeader>
                    <CardTitle className="text-white flex items-center gap-2">
                      <TrendingUp className="w-5 h-5 text-electric-cyan" />
                      Quick ROI Preview
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center space-y-2">
                      <div className={`text-3xl font-bold ${getROIColor(simpleROI)}`}>
                        {simpleROI.toFixed(1)}%
                      </div>
                      <div className="text-asteroid-silver text-sm">Return on Investment</div>
                      {simpleROI > 0 && (
                        <div className="text-green-400 text-sm">
                          Profit: {formatCurrency(roiInput.metrics.revenue - totalInvestment)}
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>

                {/* Calculate Button */}
                <Button
                  onClick={handleCalculateROI}
                  disabled={calculateMutation.isPending}
                  className="w-full bg-gradient-to-r from-electric-cyan to-nebula-purple hover:opacity-90 text-white py-3"
                >
                  {calculateMutation.isPending ? (
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                      Calculating...
                    </div>
                  ) : (
                    <>
                      <Calculator className="w-4 h-4 mr-2" />
                      Get AI-Powered ROI Analysis
                    </>
                  )}
                </Button>
              </div>
            </div>
          </TabsContent>

          {/* Results Tab */}
          <TabsContent value="results" className="space-y-6">
            {!roiResult ? (
              <div className="text-center py-12">
                <Calculator className="w-16 h-16 text-asteroid-silver mx-auto mb-4 opacity-50" />
                <h3 className="text-xl font-semibold text-white mb-2">No ROI Analysis Available</h3>
                <p className="text-asteroid-silver mb-6">Run a calculation first to see your comprehensive ROI analysis</p>
                <Button
                  onClick={() => setActiveTab('calculator')}
                  className="bg-gradient-to-r from-electric-cyan to-nebula-purple hover:opacity-90 text-white"
                >
                  <Calculator className="w-4 h-4 mr-2" />
                  Start ROI Analysis
                </Button>
              </div>
            ) : (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {/* ROI Metrics */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                  >
                    <Card className="bg-cosmic-void/40 border-asteroid-silver/30">
                      <CardContent className="p-6 text-center">
                        <TrendingUp className="w-8 h-8 text-green-400 mx-auto mb-3" />
                        <div className="text-2xl font-bold text-green-400">{roiResult.roi}%</div>
                        <div className="text-asteroid-silver text-sm">ROI</div>
                      </CardContent>
                    </Card>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                  >
                    <Card className="bg-cosmic-void/40 border-asteroid-silver/30">
                      <CardContent className="p-6 text-center">
                        <DollarSign className="w-8 h-8 text-electric-cyan mx-auto mb-3" />
                        <div className="text-2xl font-bold text-white">{formatCurrency(roiResult.profit)}</div>
                        <div className="text-asteroid-silver text-sm">Profit</div>
                      </CardContent>
                    </Card>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                  >
                    <Card className="bg-cosmic-void/40 border-asteroid-silver/30">
                      <CardContent className="p-6 text-center">
                        <Target className="w-8 h-8 text-nebula-purple mx-auto mb-3" />
                        <div className="text-2xl font-bold text-white">{formatCurrency(roiResult.costPerConversion)}</div>
                        <div className="text-asteroid-silver text-sm">Cost per Conversion</div>
                      </CardContent>
                    </Card>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                  >
                    <Card className="bg-cosmic-void/40 border-asteroid-silver/30">
                      <CardContent className="p-6 text-center">
                        <BarChart3 className="w-8 h-8 text-solar-gold mx-auto mb-3" />
                        <div className="text-2xl font-bold text-white">${roiResult.revenuePerFollower}</div>
                        <div className="text-asteroid-silver text-sm">Revenue per Follower</div>
                      </CardContent>
                    </Card>
                  </motion.div>
                </div>

                {/* Benchmarks */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                >
                  <Card className="bg-cosmic-void/40 border-asteroid-silver/30">
                    <CardHeader>
                      <CardTitle className="text-white flex items-center gap-2">
                        <BarChart3 className="w-5 h-5 text-electric-cyan" />
                        Industry Benchmarks
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="bg-gradient-to-r from-electric-cyan/10 to-blue-500/10 rounded-lg p-4 border border-electric-cyan/20">
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-electric-cyan font-medium">Your ROI</span>
                            <ArrowUp className="w-4 h-4 text-green-400" />
                          </div>
                          <div className="text-2xl font-bold text-white">{roiResult.roi}%</div>
                        </div>
                        <div className="bg-gradient-to-r from-yellow-500/10 to-orange-500/10 rounded-lg p-4 border border-yellow-500/20">
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-yellow-400 font-medium">Industry Average</span>
                            <span className="text-xs bg-yellow-500/20 px-2 py-1 rounded">{roiInput.industry}</span>
                          </div>
                          <div className="text-2xl font-bold text-white">{roiResult.benchmarks.industry}%</div>
                        </div>
                        <div className="bg-gradient-to-r from-purple-500/10 to-pink-500/10 rounded-lg p-4 border border-purple-500/20">
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-purple-400 font-medium">Platform Average</span>
                            <span className="text-xs bg-purple-500/20 px-2 py-1 rounded">{roiInput.platform}</span>
                          </div>
                          <div className="text-2xl font-bold text-white">{roiResult.benchmarks.platform}%</div>
                        </div>
                      </div>
                      
                      <div className="bg-gradient-to-r from-green-500/10 to-emerald-500/10 rounded-lg p-4 border border-green-500/20">
                        <div className="flex items-center gap-2">
                          <CheckCircle className="w-5 h-5 text-green-400" />
                          <span className="text-green-400 font-medium">Performance Category: {roiResult.benchmarks.category}</span>
                        </div>
                        <p className="text-asteroid-silver text-sm mt-2">
                          Your ROI is {roiResult.roi - roiResult.benchmarks.industry}% above industry average and {roiResult.roi - roiResult.benchmarks.platform}% above platform average.
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>

                {/* AI Recommendations */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 }}
                >
                  <Card className="bg-cosmic-void/40 border-asteroid-silver/30">
                    <CardHeader>
                      <CardTitle className="text-white flex items-center gap-2">
                        <Zap className="w-5 h-5 text-electric-cyan" />
                        AI Optimization Recommendations
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      {roiResult.recommendations.map((rec, index) => (
                        <div key={index} className="bg-gradient-to-r from-electric-cyan/10 to-nebula-purple/10 rounded-lg p-3 border border-electric-cyan/20">
                          <div className="flex items-start gap-3">
                            <div className="w-6 h-6 rounded-full bg-electric-cyan/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                              <span className="text-electric-cyan text-xs font-bold">{index + 1}</span>
                            </div>
                            <p className="text-asteroid-silver text-sm">{rec}</p>
                          </div>
                        </div>
                      ))}
                    </CardContent>
                  </Card>
                </motion.div>
              </div>
            )}
          </TabsContent>

          {/* Projections Tab */}
          <TabsContent value="projections" className="space-y-6">
            {!roiResult ? (
              <div className="text-center py-12">
                <TrendingUp className="w-16 h-16 text-asteroid-silver mx-auto mb-4 opacity-50" />
                <h3 className="text-xl font-semibold text-white mb-2">No ROI Projections Available</h3>
                <p className="text-asteroid-silver mb-6">Calculate ROI first to see detailed revenue projections</p>
                <Button
                  onClick={() => setActiveTab('calculator')}
                  className="bg-gradient-to-r from-electric-cyan to-nebula-purple hover:opacity-90 text-white"
                >
                  <Calculator className="w-4 h-4 mr-2" />
                  Start ROI Analysis
                </Button>
              </div>
            ) : (
              <div className="space-y-6">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
                >
                  {Object.entries(roiResult.projections).map(([period, value], index) => (
                    <Card key={period} className="bg-cosmic-void/40 border-asteroid-silver/30">
                      <CardContent className="p-6 text-center">
                        <div className="text-lg font-semibold text-white mb-2">
                          {period === 'month1' ? '1 Month' : 
                           period === 'month3' ? '3 Months' : 
                           period === 'month6' ? '6 Months' : '12 Months'}
                        </div>
                        <div className="text-2xl font-bold text-electric-cyan">{formatCurrency(value)}</div>
                        <div className="text-asteroid-silver text-sm">Projected Revenue</div>
                        {index > 0 && (
                          <div className="text-green-400 text-xs mt-1 flex items-center justify-center gap-1">
                            <ArrowUp className="w-3 h-3" />
                            Growth
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  ))}
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="bg-gradient-to-r from-electric-cyan/10 to-solar-gold/10 rounded-lg p-6 border border-electric-cyan/20 text-center"
                >
                  <BarChart3 className="w-12 h-12 text-electric-cyan mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-white mb-2">
                    12-Month Revenue Projection
                  </h3>
                  <div className="text-3xl font-bold text-electric-cyan mb-2">
                    {formatCurrency(roiResult.projections.month12)}
                  </div>
                  <p className="text-asteroid-silver">
                    Based on current performance trends and optimization recommendations
                  </p>
                </motion.div>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}