import { useState } from 'react';
import { DollarSign, Search, TrendingUp, Star, Link, ExternalLink, Tag, Target, Zap, CheckCircle } from 'lucide-react';
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

interface AffiliateOpportunity {
  id: string;
  brand: string;
  program: string;
  commission: string;
  cookieDuration: number;
  category: string;
  rating: number;
  requirements: string[];
  description: string;
  joinUrl: string;
  estimatedEarnings: {
    monthly: number;
    perSale: number;
    conversionRate: number;
  };
  contentSuggestions: string[];
  pros: string[];
  cons: string[];
}

interface CommissionTracker {
  id: string;
  brand: string;
  clicks: number;
  conversions: number;
  earnings: number;
  period: string;
  status: 'active' | 'pending' | 'paid';
}

export default function AffiliateEngine() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState('discover');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedNiche, setSelectedNiche] = useState('');

  // Get user data for credits
  const { data: user } = useQuery({
    queryKey: ["/api/user"],
    refetchInterval: 30000
  });

  // Discover affiliate opportunities mutation
  const discoverMutation = useMutation({
    mutationFn: async (data: any) => {
      const response = await apiRequest('POST', '/api/ai/affiliate-discovery', data);
      return await response.json();
    },
    onSuccess: (data) => {
      setDiscoveredOpportunities(data.opportunities || []);
      toast({
        title: "Opportunities Discovered!",
        description: `Found ${data.opportunities?.length || 0} affiliate programs matching your criteria.`,
      });
      queryClient.invalidateQueries({ queryKey: ['/api/ai/affiliate-discovery'] });
    },
    onError: (error: any) => {
      if (error.upgradeModal) {
        toast({
          title: "Insufficient Credits",
          description: `You need ${error.required} credits to use Affiliate Engine.`,
          variant: "destructive"
        });
      } else {
        toast({
          title: "Discovery Failed",
          description: error.message || "Failed to discover opportunities. Please try again.",
          variant: "destructive"
        });
      }
    }
  });

  // Real affiliate opportunities from AI API
  const [discoveredOpportunities, setDiscoveredOpportunities] = useState<AffiliateOpportunity[]>([]);
  const opportunities = discoveredOpportunities;

  // Commission tracking data (populated after joining affiliate programs)
  const [commissions] = useState<CommissionTracker[]>([]);

  const handleDiscoverOpportunities = () => {
    if (!selectedNiche.trim()) {
      toast({
        title: "Missing Information",
        description: "Please specify your niche or interests.",
        variant: "destructive"
      });
      return;
    }

    discoverMutation.mutate({
      niche: selectedNiche,
      audience: selectedCategory !== 'all' ? selectedCategory : 'general audience',
      contentType: 'video', // Default to video content
      followerCount: 1000, // Default follower count for affiliate discovery
      previousExperience: 'intermediate',
      preferredCommission: '10-20%',
      contentStyle: 'educational'
    });
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'paid': return 'bg-green-500';
      case 'pending': return 'bg-yellow-500';
      case 'active': return 'bg-blue-500';
      default: return 'bg-gray-500';
    }
  };

  const getRatingColor = (rating: number) => {
    if (rating >= 4.5) return 'text-green-400';
    if (rating >= 4.0) return 'text-yellow-400';
    if (rating >= 3.5) return 'text-orange-400';
    return 'text-red-400';
  };

  const filteredOpportunities = opportunities.filter(opp => {
    const matchesSearch = searchQuery === '' || 
      opp.brand.toLowerCase().includes(searchQuery.toLowerCase()) ||
      opp.program.toLowerCase().includes(searchQuery.toLowerCase()) ||
      opp.category.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesCategory = selectedCategory === 'all' || opp.category === selectedCategory;
    
    return matchesSearch && matchesCategory;
  });

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
            <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-green-500 to-emerald-500 flex items-center justify-center">
              <DollarSign className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-electric-cyan to-nebula-purple bg-clip-text text-transparent">
              Affiliate Engine
            </h1>
          </div>
          <p className="text-asteroid-silver text-lg max-w-2xl mx-auto">
            Discover profitable affiliate opportunities, track commissions, and optimize your monetization strategy
          </p>
        </motion.div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3 bg-cosmic-void/50 border border-asteroid-silver/30">
            <TabsTrigger value="discover" className="data-[state=active]:bg-electric-cyan data-[state=active]:text-space-navy">
              Discover Opportunities
            </TabsTrigger>
            <TabsTrigger value="tracker" className="data-[state=active]:bg-electric-cyan data-[state=active]:text-space-navy">
              Commission Tracker
            </TabsTrigger>
            <TabsTrigger value="optimization" className="data-[state=active]:bg-electric-cyan data-[state=active]:text-space-navy">
              AI Optimization
            </TabsTrigger>
          </TabsList>

          {/* Discover Tab */}
          <TabsContent value="discover" className="space-y-6">
            {/* Search and Filters */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex flex-wrap gap-4 justify-center items-center"
            >
              <div className="flex items-center gap-2">
                <Search className="w-4 h-4 text-asteroid-silver" />
                <Input
                  placeholder="Search affiliate programs..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-64 bg-cosmic-void/50 border-asteroid-silver/30 text-white"
                />
              </div>
              
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger className="w-48 bg-cosmic-void/50 border-asteroid-silver/30 text-white">
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent className="bg-cosmic-void border-asteroid-silver/30">
                  <SelectItem value="all">All Categories</SelectItem>
                  <SelectItem value="fitness">Fitness & Health</SelectItem>
                  <SelectItem value="technology">Technology</SelectItem>
                  <SelectItem value="beauty">Beauty & Lifestyle</SelectItem>
                  <SelectItem value="fashion">Fashion</SelectItem>
                  <SelectItem value="food">Food & Beverage</SelectItem>
                </SelectContent>
              </Select>

              <div className="flex items-center gap-2">
                <Input
                  placeholder="Your niche (e.g., fitness, tech)"
                  value={selectedNiche}
                  onChange={(e) => setSelectedNiche(e.target.value)}
                  className="w-64 bg-cosmic-void/50 border-asteroid-silver/30 text-white"
                />
                <Button
                  onClick={handleDiscoverOpportunities}
                  disabled={discoverMutation.isPending}
                  className="bg-gradient-to-r from-electric-cyan to-nebula-purple hover:opacity-90 text-white"
                >
                  {discoverMutation.isPending ? (
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  ) : (
                    <>
                      <Zap className="w-4 h-4 mr-2" />
                      Discover
                    </>
                  )}
                </Button>
              </div>
            </motion.div>

            {/* Opportunities Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {filteredOpportunities.map((opportunity, index) => (
                <motion.div
                  key={opportunity.id}
                  initial={{ opacity: 0, y: 40 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                >
                  <Card className="bg-cosmic-void/40 border-asteroid-silver/30 hover:border-electric-cyan/50 transition-all duration-300">
                    <CardHeader className="pb-4">
                      <div className="flex items-center justify-between mb-3">
                        <Badge className="bg-gradient-to-r from-green-500 to-emerald-500 text-white">
                          {opportunity.category.charAt(0).toUpperCase() + opportunity.category.slice(1)}
                        </Badge>
                        <div className="flex items-center gap-2">
                          <Star className={`w-4 h-4 ${getRatingColor(opportunity.rating)}`} />
                          <span className={`text-sm font-semibold ${getRatingColor(opportunity.rating)}`}>
                            {opportunity.rating}
                          </span>
                        </div>
                      </div>
                      <CardTitle className="text-white text-lg">{opportunity.brand}</CardTitle>
                      <p className="text-asteroid-silver text-sm">{opportunity.program}</p>
                    </CardHeader>
                    
                    <CardContent className="space-y-4">
                      {/* Key Metrics */}
                      <div className="grid grid-cols-3 gap-4 text-center">
                        <div>
                          <div className="text-green-400 font-bold text-lg">{opportunity.commission}</div>
                          <div className="text-asteroid-silver text-xs">Commission</div>
                        </div>
                        <div>
                          <div className="text-electric-cyan font-bold text-lg">{opportunity.cookieDuration}d</div>
                          <div className="text-asteroid-silver text-xs">Cookie</div>
                        </div>
                        <div>
                          <div className="text-nebula-purple font-bold text-lg">{formatCurrency(opportunity.estimatedEarnings.monthly)}</div>
                          <div className="text-asteroid-silver text-xs">Est. Monthly</div>
                        </div>
                      </div>

                      {/* Description */}
                      <p className="text-asteroid-silver text-sm">
                        {opportunity.description}
                      </p>

                      {/* Requirements */}
                      <div>
                        <h4 className="text-sm font-medium text-white mb-2">Requirements</h4>
                        <div className="flex flex-wrap gap-1">
                          {opportunity.requirements.map((req, i) => (
                            <Badge key={i} variant="outline" className="text-xs border-electric-cyan/30 text-electric-cyan">
                              {req}
                            </Badge>
                          ))}
                        </div>
                      </div>

                      {/* Content Suggestions */}
                      <div className="bg-gradient-to-r from-electric-cyan/10 to-nebula-purple/10 rounded-lg p-3 border border-electric-cyan/20">
                        <h4 className="text-electric-cyan font-medium text-sm mb-2">Content Ideas</h4>
                        <ul className="text-xs text-asteroid-silver space-y-1">
                          {opportunity.contentSuggestions.slice(0, 2).map((suggestion, i) => (
                            <li key={i}>• {suggestion}</li>
                          ))}
                        </ul>
                      </div>

                      {/* Action Buttons */}
                      <div className="flex gap-2 pt-2">
                        <Button
                          variant="outline"
                          size="sm"
                          className="flex-1 border-asteroid-silver/30 text-asteroid-silver hover:text-white"
                        >
                          View Details
                        </Button>
                        <Button
                          size="sm"
                          className="bg-gradient-to-r from-green-500 to-emerald-500 hover:opacity-90 text-white"
                          onClick={() => window.open(opportunity.joinUrl, '_blank')}
                        >
                          <ExternalLink className="w-4 h-4 mr-1" />
                          Join Program
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </TabsContent>

          {/* Commission Tracker Tab */}
          <TabsContent value="tracker" className="space-y-6">
            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
              >
                <Card className="bg-cosmic-void/40 border-asteroid-silver/30">
                  <CardContent className="p-6 text-center">
                    <DollarSign className="w-8 h-8 text-green-400 mx-auto mb-3" />
                    <div className="text-2xl font-bold text-white">{formatCurrency(5064)}</div>
                    <div className="text-asteroid-silver text-sm">Total Earnings</div>
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
                    <Target className="w-8 h-8 text-electric-cyan mx-auto mb-3" />
                    <div className="text-2xl font-bold text-white">101</div>
                    <div className="text-asteroid-silver text-sm">Conversions</div>
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
                    <Link className="w-8 h-8 text-nebula-purple mx-auto mb-3" />
                    <div className="text-2xl font-bold text-white">2,730</div>
                    <div className="text-asteroid-silver text-sm">Total Clicks</div>
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
                    <TrendingUp className="w-8 h-8 text-solar-gold mx-auto mb-3" />
                    <div className="text-2xl font-bold text-white">3.7%</div>
                    <div className="text-asteroid-silver text-sm">Conversion Rate</div>
                  </CardContent>
                </Card>
              </motion.div>
            </div>

            {/* Commission Details */}
            <div className="space-y-4">
              {commissions.length > 0 ? commissions.map((commission, index) => (
                <motion.div
                  key={commission.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 + index * 0.1 }}
                >
                  <Card className="bg-cosmic-void/40 border-asteroid-silver/30">
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 rounded-lg bg-gradient-to-r from-electric-cyan to-nebula-purple flex items-center justify-center">
                            <DollarSign className="w-6 h-6 text-white" />
                          </div>
                          <div>
                            <h3 className="text-white font-semibold">{commission.brand}</h3>
                            <p className="text-asteroid-silver text-sm">{commission.period}</p>
                          </div>
                        </div>
                        <Badge className={`${getStatusColor(commission.status)} text-white`}>
                          {commission.status.charAt(0).toUpperCase() + commission.status.slice(1)}
                        </Badge>
                      </div>

                      <div className="grid grid-cols-4 gap-4">
                        <div className="text-center">
                          <div className="text-white font-semibold">{commission.clicks.toLocaleString()}</div>
                          <div className="text-asteroid-silver text-xs">Clicks</div>
                        </div>
                        <div className="text-center">
                          <div className="text-white font-semibold">{commission.conversions}</div>
                          <div className="text-asteroid-silver text-xs">Conversions</div>
                        </div>
                        <div className="text-center">
                          <div className="text-green-400 font-semibold">{formatCurrency(commission.earnings)}</div>
                          <div className="text-asteroid-silver text-xs">Earnings</div>
                        </div>
                        <div className="text-center">
                          <div className="text-electric-cyan font-semibold">
                            {((commission.conversions / commission.clicks) * 100).toFixed(1)}%
                          </div>
                          <div className="text-asteroid-silver text-xs">Conv. Rate</div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              )) : (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-center py-12"
                >
                  <DollarSign className="w-16 h-16 text-asteroid-silver/50 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-white mb-2">No Commission Data Yet</h3>
                  <p className="text-asteroid-silver mb-6">
                    Start by discovering affiliate opportunities and joining programs. 
                    Commission tracking will appear here once you begin earning.
                  </p>
                  <Button 
                    onClick={handleDiscoverOpportunities}
                    className="bg-gradient-to-r from-electric-cyan to-solar-gold text-cosmic-void font-semibold px-6 py-2 rounded-lg hover:opacity-90 transition-opacity"
                  >
                    Discover Opportunities
                  </Button>
                </motion.div>
              )}
            </div>
          </TabsContent>

          {/* Optimization Tab */}
          <TabsContent value="optimization" className="space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center bg-gradient-to-r from-electric-cyan/10 to-solar-gold/10 rounded-lg p-8 border border-electric-cyan/20"
            >
              <Zap className="w-16 h-16 text-electric-cyan mx-auto mb-4" />
              <h3 className="text-2xl font-semibold text-white mb-2">
                AI-Powered Optimization Coming Soon
              </h3>
              <p className="text-asteroid-silver mb-4">
                Get personalized recommendations to maximize your affiliate earnings with advanced AI analysis
              </p>
              <Button className="bg-gradient-to-r from-electric-cyan to-nebula-purple hover:opacity-90 text-white">
                Join Beta Program
                <ExternalLink className="w-4 h-4 ml-2" />
              </Button>
            </motion.div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}