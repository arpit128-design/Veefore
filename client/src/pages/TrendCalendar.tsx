import { useState, useEffect } from 'react';
import { Calendar, Clock, TrendingUp, Zap, Star, Play, ArrowRight, Search } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { motion } from 'framer-motion';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useToast } from '@/hooks/use-toast';
import { apiRequest } from '@/lib/queryClient';

interface TrendEvent {
  id: string;
  title: string;
  date: string;
  platform: string;
  viralPotential: number;
  category: string;
  description: string;
  hashtags: string[];
  suggestedContent: string;
}

export default function TrendCalendar() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [selectedDate, setSelectedDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [selectedPlatform, setSelectedPlatform] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Get user data for credits
  const { data: user } = useQuery({
    queryKey: ["/api/user"],
    refetchInterval: 30000
  });

  // Fetch trend data
  const { data: trends, isLoading } = useQuery({
    queryKey: ['/api/trends/calendar', selectedDate, selectedPlatform],
    queryFn: () => apiRequest('GET', `/api/trends/calendar?date=${selectedDate}&platform=${selectedPlatform}`).then(res => res.json())
  });

  // Generate trend prediction mutation
  const trendMutation = useMutation({
    mutationFn: (data: any) => apiRequest('POST', '/api/ai/trend-intelligence', data).then(res => res.json()),
    onSuccess: (data) => {
      toast({
        title: "Trend Analysis Complete!",
        description: "AI has analyzed the latest trends for your niche.",
      });
      queryClient.invalidateQueries({ queryKey: ['/api/trends/calendar'] });
    },
    onError: (error: any) => {
      if (error.upgradeModal) {
        // Handle upgrade modal if needed
        toast({
          title: "Insufficient Credits",
          description: `You need ${error.required} credits to use Trend Intelligence.`,
          variant: "destructive"
        });
      } else {
        toast({
          title: "Analysis Failed",
          description: error.message || "Failed to analyze trends. Please try again.",
          variant: "destructive"
        });
      }
    }
  });

  // Show error state if API fails
  if (!isLoading && !trends) {
    return (
      <div className="min-h-screen bg-transparent text-white p-4 md:p-6 flex items-center justify-center">
        <Card className="bg-cosmic-void/40 border-asteroid-silver/30 backdrop-blur-sm p-8 text-center">
          <h2 className="text-xl font-bold text-red-400 mb-4">Failed to Load Trends</h2>
          <p className="text-asteroid-silver">Unable to fetch trend calendar data. Please try again later.</p>
        </Card>
      </div>
    );
  }

  const handleAnalyzeTrend = (trend: TrendEvent) => {
    trendMutation.mutate({
      category: trend.category,
      platform: trend.platform,
      timeframe: '7d',
      industry: 'general',
      location: 'global'
    });
  };

  const getPlatformColor = (platform: string) => {
    const colors = {
      instagram: 'from-pink-500 to-purple-500',
      youtube: 'from-red-500 to-red-600',
      tiktok: 'from-black to-red-500',
      twitter: 'from-blue-400 to-blue-600',
      all: 'from-electric-cyan to-nebula-purple'
    };
    return colors[platform] || colors.all;
  };

  const getViralPotentialColor = (score: number) => {
    if (score >= 90) return 'text-green-400';
    if (score >= 75) return 'text-yellow-400';
    if (score >= 60) return 'text-orange-400';
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
            <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center">
              <Calendar className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-electric-cyan to-nebula-purple bg-clip-text text-transparent">
              Trend Calendar & Viral Planner
            </h1>
          </div>
          <p className="text-asteroid-silver text-lg max-w-2xl mx-auto">
            Discover upcoming viral trends, seasonal opportunities, and platform-specific events to plan your content strategy
          </p>
        </motion.div>

        {/* Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="flex flex-wrap gap-4 justify-center items-center"
        >
          <div className="flex items-center gap-2">
            <Search className="w-4 h-4 text-asteroid-silver" />
            <Input
              placeholder="Search trends..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-64 bg-cosmic-void/50 border-asteroid-silver/30 text-white"
            />
          </div>
          
          <div className="flex gap-2">
            {['all', 'instagram', 'youtube', 'tiktok', 'twitter'].map((platform) => (
              <Button
                key={platform}
                variant={selectedPlatform === platform ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedPlatform(platform)}
                className={`${selectedPlatform === platform 
                  ? `bg-gradient-to-r ${getPlatformColor(platform)} text-white` 
                  : 'border-asteroid-silver/30 text-asteroid-silver hover:text-white'
                }`}
              >
                {platform.charAt(0).toUpperCase() + platform.slice(1)}
              </Button>
            ))}
          </div>

          <Input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="bg-cosmic-void/50 border-asteroid-silver/30 text-white"
          />
        </motion.div>

        {/* Trend Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {isLoading ? (
            // Loading skeleton
            Array.from({length: 6}).map((_, i) => (
              <Card key={i} className="bg-cosmic-void/40 border-asteroid-silver/30 backdrop-blur-sm animate-pulse">
                <CardHeader>
                  <div className="h-4 bg-asteroid-silver/20 rounded mb-2"></div>
                  <div className="h-6 bg-asteroid-silver/20 rounded"></div>
                </CardHeader>
                <CardContent>
                  <div className="h-4 bg-asteroid-silver/20 rounded mb-2"></div>
                  <div className="h-4 bg-asteroid-silver/20 rounded w-3/4"></div>
                </CardContent>
              </Card>
            ))
          ) : trends?.events
            ?.filter(trend => 
              selectedPlatform === 'all' || trend.platform === selectedPlatform
            )
            .filter(trend =>
              searchQuery === '' || 
              trend.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
              trend.category.toLowerCase().includes(searchQuery.toLowerCase())
            )
            .map((trend, index) => (
              <motion.div
                key={trend.id}
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <Card className="bg-cosmic-void/40 border-asteroid-silver/30 hover:border-electric-cyan/50 transition-all duration-300 backdrop-blur-sm">
                  <CardHeader className="pb-4">
                    <div className="flex items-center justify-between mb-3">
                      <Badge 
                        className={`bg-gradient-to-r ${getPlatformColor(trend.platform)} text-white`}
                      >
                        {trend.platform.charAt(0).toUpperCase() + trend.platform.slice(1)}
                      </Badge>
                      <div className="flex items-center gap-2">
                        <TrendingUp className={`w-4 h-4 ${getViralPotentialColor(trend.viralPotential)}`} />
                        <span className={`text-sm font-semibold ${getViralPotentialColor(trend.viralPotential)}`}>
                          {trend.viralPotential}%
                        </span>
                      </div>
                    </div>
                    <CardTitle className="text-white text-lg">{trend.title}</CardTitle>
                    <div className="flex items-center gap-2 text-asteroid-silver text-sm">
                      <Clock className="w-4 h-4" />
                      {new Date(trend.date).toLocaleDateString()}
                    </div>
                  </CardHeader>
                  
                  <CardContent className="space-y-4">
                    <p className="text-asteroid-silver text-sm">
                      {trend.description}
                    </p>

                    {/* Hashtags */}
                    <div className="flex flex-wrap gap-2">
                      {trend.hashtags.map((hashtag, i) => (
                        <Badge key={i} variant="outline" className="text-xs border-electric-cyan/30 text-electric-cyan">
                          {hashtag}
                        </Badge>
                      ))}
                    </div>

                    {/* Suggested Content */}
                    <div className="bg-gradient-to-r from-electric-cyan/10 to-nebula-purple/10 rounded-lg p-3 border border-electric-cyan/20">
                      <div className="flex items-center gap-2 mb-2">
                        <Zap className="w-4 h-4 text-electric-cyan" />
                        <span className="text-sm font-medium text-electric-cyan">AI Suggestion</span>
                      </div>
                      <p className="text-xs text-asteroid-silver">
                        {trend.suggestedContent}
                      </p>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-2 pt-2">
                      <Button
                        onClick={() => handleAnalyzeTrend(trend)}
                        disabled={trendMutation.isPending}
                        className="flex-1 bg-gradient-to-r from-electric-cyan to-nebula-purple hover:opacity-90 text-white"
                        size="sm"
                      >
                        {trendMutation.isPending ? (
                          <div className="flex items-center gap-2">
                            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                            Analyzing...
                          </div>
                        ) : (
                          <>
                            <TrendingUp className="w-4 h-4 mr-2" />
                            Analyze Trend
                          </>
                        )}
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="border-asteroid-silver/30 text-asteroid-silver hover:text-white"
                      >
                        <Play className="w-4 h-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
        </div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="text-center bg-gradient-to-r from-electric-cyan/10 to-solar-gold/10 rounded-lg p-6 border border-electric-cyan/20"
        >
          <Star className="w-12 h-12 text-electric-cyan mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-white mb-2">
            Stay Ahead of Trends
          </h3>
          <p className="text-asteroid-silver mb-4">
            Get AI-powered trend predictions and content suggestions delivered to your dashboard daily
          </p>
          <Button className="bg-gradient-to-r from-electric-cyan to-nebula-purple hover:opacity-90 text-white">
            Enable Daily Briefings
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </motion.div>
      </div>
    </div>
  );
}