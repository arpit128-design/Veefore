import { useState } from 'react';
import { BarChart3, Clock, TrendingUp, Zap, CheckCircle, XCircle, Play, Pause, ArrowRight, Target, Upload } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { motion } from 'framer-motion';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useToast } from '@/hooks/use-toast';
import { apiRequest } from '@/lib/queryClient';

interface ABTest {
  id: string;
  name: string;
  status: 'draft' | 'running' | 'completed';
  variantA: {
    caption: string;
    hashtags: string[];
    media?: string;
  };
  variantB: {
    caption: string;
    hashtags: string[];
    media?: string;
  };
  results?: {
    variantA: {
      reach: number;
      engagement: number;
      clicks: number;
      conversions: number;
    };
    variantB: {
      reach: number;
      engagement: number;
      clicks: number;
      conversions: number;
    };
    winner: 'A' | 'B' | null;
  };
  platform: string;
  startDate?: string;
  endDate?: string;
  createdAt: string;
}

export default function ABTesting() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState('create');
  const [newTest, setNewTest] = useState<Partial<ABTest>>({
    name: '',
    platform: 'instagram',
    variantA: { caption: '', hashtags: [] },
    variantB: { caption: '', hashtags: [] }
  });

  // Get user data for credits
  const { data: user } = useQuery({
    queryKey: ["/api/user"],
    refetchInterval: 30000
  });

  // Fetch A/B tests
  const { data: testsData, isLoading } = useQuery({
    queryKey: ['/api/ab-tests'],
    queryFn: () => apiRequest('GET', '/api/ab-tests').then(res => res.json())
  });

  // Create A/B test mutation
  const createTestMutation = useMutation({
    mutationFn: (data: any) => apiRequest('POST', '/api/ab-tests', data).then(res => res.json()),
    onSuccess: () => {
      toast({
        title: "A/B Test Created!",
        description: "Your test has been set up and will start running soon.",
      });
      queryClient.invalidateQueries({ queryKey: ['/api/ab-tests'] });
      setActiveTab('tests');
      setNewTest({
        name: '',
        platform: 'instagram',
        variantA: { caption: '', hashtags: [] },
        variantB: { caption: '', hashtags: [] }
      });
    },
    onError: (error: any) => {
      toast({
        title: "Failed to Create Test",
        description: error.message || "Please try again.",
        variant: "destructive"
      });
    }
  });

  // Extract tests from API response
  const tests = testsData?.tests || [];

  const handleCreateTest = () => {
    if (!newTest.name || !newTest.variantA?.caption || !newTest.variantB?.caption) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields.",
        variant: "destructive"
      });
      return;
    }

    createTestMutation.mutate(newTest);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'running': return 'bg-green-500';
      case 'completed': return 'bg-blue-500';
      case 'draft': return 'bg-gray-500';
      default: return 'bg-gray-500';
    }
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

  const calculateWinningMetric = (variantA: any, variantB: any, metric: string) => {
    if (!variantA || !variantB) return null;
    const aValue = variantA[metric] || 0;
    const bValue = variantB[metric] || 0;
    const improvement = aValue > 0 ? ((bValue - aValue) / aValue * 100) : 0;
    return { improvement, winner: bValue > aValue ? 'B' : 'A' };
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
            <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center">
              <BarChart3 className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-electric-cyan to-nebula-purple bg-clip-text text-transparent">
              A/B Testing Module
            </h1>
          </div>
          <p className="text-asteroid-silver text-lg max-w-2xl mx-auto">
            Test different versions of your content to optimize performance and maximize engagement
          </p>
        </motion.div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3 bg-cosmic-void/50 border border-asteroid-silver/30">
            <TabsTrigger value="create" className="data-[state=active]:bg-electric-cyan data-[state=active]:text-space-navy">
              Create Test
            </TabsTrigger>
            <TabsTrigger value="tests" className="data-[state=active]:bg-electric-cyan data-[state=active]:text-space-navy">
              My Tests
            </TabsTrigger>
            <TabsTrigger value="analytics" className="data-[state=active]:bg-electric-cyan data-[state=active]:text-space-navy">
              Analytics
            </TabsTrigger>
          </TabsList>

          {/* Create Test Tab */}
          <TabsContent value="create" className="space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="grid grid-cols-1 lg:grid-cols-2 gap-6"
            >
              {/* Test Configuration */}
              <Card className="bg-cosmic-void/40 border-asteroid-silver/30">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <Target className="w-5 h-5 text-electric-cyan" />
                    Test Configuration
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="test-name">Test Name</Label>
                    <Input
                      id="test-name"
                      placeholder="Enter test name..."
                      value={newTest.name}
                      onChange={(e) => setNewTest(prev => ({ ...prev, name: e.target.value }))}
                      className="bg-cosmic-void/50 border-asteroid-silver/30 text-white"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="platform">Platform</Label>
                    <Select 
                      value={newTest.platform} 
                      onValueChange={(value) => setNewTest(prev => ({ ...prev, platform: value }))}
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

                  <div className="bg-gradient-to-r from-electric-cyan/10 to-nebula-purple/10 rounded-lg p-4 border border-electric-cyan/20">
                    <div className="flex items-center gap-2 mb-2">
                      <Zap className="w-4 h-4 text-electric-cyan" />
                      <span className="text-sm font-medium text-electric-cyan">AI Recommendation</span>
                    </div>
                    <p className="text-xs text-asteroid-silver">
                      Test duration: 48-72 hours for reliable results. Focus on one variable at a time (caption, hashtags, or timing).
                    </p>
                  </div>
                </CardContent>
              </Card>

              {/* Variant A */}
              <Card className="bg-cosmic-void/40 border-asteroid-silver/30">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full bg-blue-500 flex items-center justify-center text-sm font-bold">A</div>
                    Variant A
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="caption-a">Caption</Label>
                    <Textarea
                      id="caption-a"
                      placeholder="Enter caption for variant A..."
                      value={newTest.variantA?.caption}
                      onChange={(e) => setNewTest(prev => ({
                        ...prev,
                        variantA: { ...prev.variantA!, caption: e.target.value }
                      }))}
                      className="bg-cosmic-void/50 border-asteroid-silver/30 text-white"
                      rows={4}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="hashtags-a">Hashtags (comma separated)</Label>
                    <Input
                      id="hashtags-a"
                      placeholder="#hashtag1, #hashtag2, #hashtag3"
                      onChange={(e) => setNewTest(prev => ({
                        ...prev,
                        variantA: { 
                          ...prev.variantA!, 
                          hashtags: e.target.value.split(',').map(tag => tag.trim()).filter(Boolean)
                        }
                      }))}
                      className="bg-cosmic-void/50 border-asteroid-silver/30 text-white"
                    />
                  </div>

                  <Button
                    variant="outline"
                    className="w-full border-asteroid-silver/30 text-asteroid-silver hover:text-white"
                  >
                    <Upload className="w-4 h-4 mr-2" />
                    Upload Media (Optional)
                  </Button>
                </CardContent>
              </Card>

              {/* Variant B */}
              <Card className="bg-cosmic-void/40 border-asteroid-silver/30">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full bg-green-500 flex items-center justify-center text-sm font-bold">B</div>
                    Variant B
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="caption-b">Caption</Label>
                    <Textarea
                      id="caption-b"
                      placeholder="Enter caption for variant B..."
                      value={newTest.variantB?.caption}
                      onChange={(e) => setNewTest(prev => ({
                        ...prev,
                        variantB: { ...prev.variantB!, caption: e.target.value }
                      }))}
                      className="bg-cosmic-void/50 border-asteroid-silver/30 text-white"
                      rows={4}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="hashtags-b">Hashtags (comma separated)</Label>
                    <Input
                      id="hashtags-b"
                      placeholder="#hashtag1, #hashtag2, #hashtag3"
                      onChange={(e) => setNewTest(prev => ({
                        ...prev,
                        variantB: { 
                          ...prev.variantB!, 
                          hashtags: e.target.value.split(',').map(tag => tag.trim()).filter(Boolean)
                        }
                      }))}
                      className="bg-cosmic-void/50 border-asteroid-silver/30 text-white"
                    />
                  </div>

                  <Button
                    variant="outline"
                    className="w-full border-asteroid-silver/30 text-asteroid-silver hover:text-white"
                  >
                    <Upload className="w-4 h-4 mr-2" />
                    Upload Media (Optional)
                  </Button>
                </CardContent>
              </Card>

              {/* Create Test Button */}
              <div className="lg:col-span-2">
                <Button
                  onClick={handleCreateTest}
                  disabled={createTestMutation.isPending}
                  className="w-full bg-gradient-to-r from-electric-cyan to-nebula-purple hover:opacity-90 text-white py-3"
                >
                  {createTestMutation.isPending ? (
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                      Creating Test...
                    </div>
                  ) : (
                    <>
                      <Play className="w-4 h-4 mr-2" />
                      Create A/B Test
                    </>
                  )}
                </Button>
              </div>
            </motion.div>
          </TabsContent>

          {/* My Tests Tab */}
          <TabsContent value="tests" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {tests.map((test, index) => (
                <motion.div
                  key={test.id}
                  initial={{ opacity: 0, y: 40 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                >
                  <Card className="bg-cosmic-void/40 border-asteroid-silver/30 hover:border-electric-cyan/50 transition-all duration-300">
                    <CardHeader className="pb-4">
                      <div className="flex items-center justify-between mb-3">
                        <Badge className={`${getStatusColor(test.status)} text-white`}>
                          {test.status.charAt(0).toUpperCase() + test.status.slice(1)}
                        </Badge>
                        <Badge 
                          className={`bg-gradient-to-r ${getPlatformColor(test.platform)} text-white`}
                        >
                          {test.platform.charAt(0).toUpperCase() + test.platform.slice(1)}
                        </Badge>
                      </div>
                      <CardTitle className="text-white text-lg">{test.name}</CardTitle>
                      <div className="flex items-center gap-2 text-asteroid-silver text-sm">
                        <Clock className="w-4 h-4" />
                        {test.status === 'running' ? 'Started' : 'Completed'} {new Date(test.startDate!).toLocaleDateString()}
                      </div>
                    </CardHeader>
                    
                    <CardContent className="space-y-4">
                      {test.results ? (
                        <div className="space-y-4">
                          {/* Results Summary */}
                          <div className="bg-gradient-to-r from-electric-cyan/10 to-nebula-purple/10 rounded-lg p-3 border border-electric-cyan/20">
                            <div className="flex items-center justify-between mb-2">
                              <span className="text-sm font-medium text-electric-cyan">Winner</span>
                              <div className={`w-6 h-6 rounded-full ${test.results.winner === 'A' ? 'bg-blue-500' : 'bg-green-500'} flex items-center justify-center text-sm font-bold`}>
                                {test.results.winner}
                              </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4 text-xs">
                              <div>
                                <div className="text-asteroid-silver">Variant A</div>
                                <div className="text-white font-medium">{test.results.variantA.engagement} engagement</div>
                              </div>
                              <div>
                                <div className="text-asteroid-silver">Variant B</div>
                                <div className="text-white font-medium">{test.results.variantB.engagement} engagement</div>
                              </div>
                            </div>
                          </div>

                          {/* Detailed Metrics */}
                          <div className="grid grid-cols-2 gap-4">
                            {['reach', 'engagement', 'clicks', 'conversions'].map((metric) => {
                              const result = calculateWinningMetric(test.results?.variantA, test.results?.variantB, metric);
                              return (
                                <div key={metric} className="text-center">
                                  <div className="text-xs text-asteroid-silver capitalize">{metric}</div>
                                  <div className={`text-sm font-medium ${result?.improvement ? (result.improvement > 0 ? 'text-green-400' : 'text-red-400') : 'text-white'}`}>
                                    {result?.improvement ? `${result.improvement > 0 ? '+' : ''}${result.improvement.toFixed(1)}%` : '0%'}
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      ) : (
                        <div className="text-center py-4">
                          <div className="w-8 h-8 border-2 border-electric-cyan/30 border-t-electric-cyan rounded-full animate-spin mx-auto mb-2"></div>
                          <p className="text-asteroid-silver text-sm">Test is running...</p>
                        </div>
                      )}

                      <div className="flex gap-2 pt-2">
                        <Button
                          variant="outline"
                          size="sm"
                          className="flex-1 border-asteroid-silver/30 text-asteroid-silver hover:text-white"
                        >
                          View Details
                        </Button>
                        {test.status === 'running' && (
                          <Button
                            variant="outline"
                            size="sm"
                            className="border-red-500/30 text-red-400 hover:text-red-300"
                          >
                            <Pause className="w-4 h-4" />
                          </Button>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </TabsContent>

          {/* Analytics Tab */}
          <TabsContent value="analytics" className="space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center bg-gradient-to-r from-electric-cyan/10 to-solar-gold/10 rounded-lg p-8 border border-electric-cyan/20"
            >
              <BarChart3 className="w-16 h-16 text-electric-cyan mx-auto mb-4" />
              <h3 className="text-2xl font-semibold text-white mb-2">
                Advanced Analytics Coming Soon
              </h3>
              <p className="text-asteroid-silver mb-4">
                Get detailed insights into your A/B test performance with advanced metrics and AI-powered recommendations
              </p>
              <Button className="bg-gradient-to-r from-electric-cyan to-nebula-purple hover:opacity-90 text-white">
                Join Waitlist
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </motion.div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}