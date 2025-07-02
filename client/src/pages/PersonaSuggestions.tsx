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
  User, 
  Target, 
  Lightbulb, 
  Calendar, 
  TrendingUp, 
  Users, 
  Hash, 
  Clock, 
  Star, 
  CheckCircle,
  Brain,
  Zap,
  Heart,
  MessageSquare,
  Share,
  BarChart3,
  Globe
} from "lucide-react";

interface PersonaInput {
  industry: string;
  audience: string;
  brandTone: string;
  goals: string[];
  currentChallenges: string[];
  platforms: string[];
  contentTypes: string[];
  brandValues?: string;
  competitorExamples?: string;
  budget?: number;
  timeframe: string;
}

interface ContentSuggestion {
  id: string;
  title: string;
  description: string;
  platform: string;
  contentType: string;
  estimatedReach: number;
  engagementPotential: number;
  difficulty: 'easy' | 'medium' | 'hard';
  timeToCreate: string;
  keywords: string[];
  callToAction: string;
  personalizedReason: string;
  trendRelevance: number;
}

interface PersonaSuggestions {
  personaAnalysis: {
    profileSummary: string;
    strengthsIdentified: string[];
    growthOpportunities: string[];
    recommendedVoice: string;
    targetAudienceInsights: string[];
  };
  contentSuggestions: ContentSuggestion[];
  strategicRecommendations: {
    postingSchedule: {
      platform: string;
      frequency: string;
      bestTimes: string[];
      contentMix: Record<string, number>;
    }[];
    engagementStrategy: string[];
    hashtags: {
      trending: string[];
      niche: string[];
      branded: string[];
    };
    collaborationOpportunities: string[];
  };
  monthlyContentPlan: {
    week: number;
    theme: string;
    contentTypes: string[];
    keyMessages: string[];
    metrics: string[];
  }[];
  personalizationInsights: {
    uniqueAngles: string[];
    competitiveDifferentiators: string[];
    audienceConnectionPoints: string[];
    brandPersonalityTips: string[];
  };
  growthProjections: {
    timeframe: string;
    expectedGrowth: {
      followers: number;
      engagement: number;
      reach: number;
    };
    milestones: string[];
    successMetrics: string[];
  };
}

export default function PersonaSuggestions() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState('input');
  const [personaInput, setPersonaInput] = useState<PersonaInput>({
    industry: '',
    audience: '',
    brandTone: 'professional',
    goals: [],
    currentChallenges: [],
    platforms: [],
    contentTypes: [],
    brandValues: '',
    competitorExamples: '',
    budget: undefined,
    timeframe: '1 month'
  });

  // Get user data for credits
  const { data: user } = useQuery({
    queryKey: ["/api/user"],
    refetchInterval: 30000
  });

  // Generate persona suggestions mutation
  const generateSuggestionsMutation = useMutation({
    mutationFn: async (data: PersonaInput) => {
      const response = await apiRequest('POST', '/api/ai/persona-suggestions', data);
      return await response.json();
    },
    onSuccess: (data) => {
      toast({
        title: "Persona Suggestions Generated!",
        description: "Your personalized content strategy has been created with comprehensive recommendations.",
      });
      setGeneratedSuggestions(data.suggestions);
      setActiveTab('analysis');
      queryClient.invalidateQueries({ queryKey: ['/api/user'] });
    },
    onError: (error: any) => {
      if (error.upgradeModal) {
        toast({
          title: "Insufficient Credits",
          description: `You need ${error.required} credits to use Persona-Based Suggestions.`,
          variant: "destructive"
        });
      } else {
        toast({
          title: "Generation Failed",
          description: error.message || "Failed to generate persona-based suggestions. Please try again.",
          variant: "destructive"
        });
      }
    }
  });

  const [generatedSuggestions, setGeneratedSuggestions] = useState<PersonaSuggestions | null>(null);

  const handleAddGoal = (goal: string) => {
    if (goal.trim() && !personaInput.goals.includes(goal.trim())) {
      setPersonaInput(prev => ({
        ...prev,
        goals: [...prev.goals, goal.trim()]
      }));
    }
  };

  const handleRemoveGoal = (goalToRemove: string) => {
    setPersonaInput(prev => ({
      ...prev,
      goals: prev.goals.filter(goal => goal !== goalToRemove)
    }));
  };

  const handleAddChallenge = (challenge: string) => {
    if (challenge.trim() && !personaInput.currentChallenges.includes(challenge.trim())) {
      setPersonaInput(prev => ({
        ...prev,
        currentChallenges: [...prev.currentChallenges, challenge.trim()]
      }));
    }
  };

  const handleRemoveChallenge = (challengeToRemove: string) => {
    setPersonaInput(prev => ({
      ...prev,
      currentChallenges: prev.currentChallenges.filter(challenge => challenge !== challengeToRemove)
    }));
  };

  const handlePlatformToggle = (platform: string) => {
    setPersonaInput(prev => ({
      ...prev,
      platforms: prev.platforms.includes(platform)
        ? prev.platforms.filter(p => p !== platform)
        : [...prev.platforms, platform]
    }));
  };

  const handleContentTypeToggle = (contentType: string) => {
    setPersonaInput(prev => ({
      ...prev,
      contentTypes: prev.contentTypes.includes(contentType)
        ? prev.contentTypes.filter(ct => ct !== contentType)
        : [...prev.contentTypes, contentType]
    }));
  };

  const handleGenerateSuggestions = () => {
    if (!personaInput.industry || !personaInput.audience || !personaInput.brandTone || 
        personaInput.goals.length === 0 || personaInput.currentChallenges.length === 0 || 
        personaInput.platforms.length === 0 || personaInput.contentTypes.length === 0) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields to generate your persona-based suggestions.",
        variant: "destructive"
      });
      return;
    }

    generateSuggestionsMutation.mutate(personaInput);
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'text-green-400 bg-green-400/10 border-green-400/30';
      case 'medium': return 'text-yellow-400 bg-yellow-400/10 border-yellow-400/30';
      case 'hard': return 'text-red-400 bg-red-400/10 border-red-400/30';
      default: return 'text-gray-400 bg-gray-400/10 border-gray-400/30';
    }
  };

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat().format(num);
  };

  const platforms = ['Instagram', 'Facebook', 'TikTok', 'YouTube', 'LinkedIn', 'Twitter'];
  const contentTypes = ['Posts', 'Stories', 'Reels', 'Videos', 'Live Streams', 'Carousels'];
  const brandTones = ['Professional', 'Friendly', 'Authoritative', 'Playful', 'Inspirational', 'Educational'];

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
            <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-purple-500 to-pink-600 flex items-center justify-center">
              <User className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-electric-cyan to-nebula-purple bg-clip-text text-transparent">
              Persona-Based Suggestions
            </h1>
          </div>
          <p className="text-asteroid-silver text-lg max-w-2xl mx-auto">
            Generate personalized content strategies tailored to your unique brand persona and audience
          </p>
          {user && (
            <div className="flex items-center justify-center gap-2 text-sm">
              <span className="text-asteroid-silver">Credits:</span>
              <span className="text-electric-cyan font-semibold">{user.credits}</span>
              <span className="text-asteroid-silver">• Cost: 5 credits</span>
            </div>
          )}
        </motion.div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-4 bg-cosmic-void/50 border border-asteroid-silver/30">
            <TabsTrigger value="input" className="data-[state=active]:bg-electric-cyan data-[state=active]:text-space-navy">
              <Brain className="w-4 h-4 mr-2" />
              Brand Input
            </TabsTrigger>
            <TabsTrigger 
              value="analysis" 
              className="data-[state=active]:bg-electric-cyan data-[state=active]:text-space-navy"
              disabled={!generatedSuggestions}
            >
              <Target className="w-4 h-4 mr-2" />
              Persona Analysis
            </TabsTrigger>
            <TabsTrigger 
              value="suggestions" 
              className="data-[state=active]:bg-electric-cyan data-[state=active]:text-space-navy"
              disabled={!generatedSuggestions}
            >
              <Lightbulb className="w-4 h-4 mr-2" />
              Content Ideas
            </TabsTrigger>
            <TabsTrigger 
              value="strategy" 
              className="data-[state=active]:bg-electric-cyan data-[state=active]:text-space-navy"
              disabled={!generatedSuggestions}
            >
              <Calendar className="w-4 h-4 mr-2" />
              Strategic Plan
            </TabsTrigger>
          </TabsList>

          {/* Brand Input Tab */}
          <TabsContent value="input" className="space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              {/* Basic Brand Information */}
              <Card className="bg-cosmic-void/40 border-asteroid-silver/30">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <Globe className="w-5 h-5 text-electric-cyan" />
                    Brand Foundation
                  </CardTitle>
                  <CardDescription className="text-asteroid-silver">
                    Define your brand's core identity and market position
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="industry" className="text-white">Industry/Niche *</Label>
                      <Input
                        id="industry"
                        value={personaInput.industry}
                        onChange={(e) => setPersonaInput(prev => ({ ...prev, industry: e.target.value }))}
                        placeholder="e.g., Fitness, Tech, Fashion, Food"
                        className="bg-cosmic-void/50 border-asteroid-silver/30 text-white"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="audience" className="text-white">Target Audience *</Label>
                      <Input
                        id="audience"
                        value={personaInput.audience}
                        onChange={(e) => setPersonaInput(prev => ({ ...prev, audience: e.target.value }))}
                        placeholder="e.g., 25-35 year old professionals"
                        className="bg-cosmic-void/50 border-asteroid-silver/30 text-white"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="brandTone" className="text-white">Brand Tone *</Label>
                      <Select value={personaInput.brandTone} onValueChange={(value) => setPersonaInput(prev => ({ ...prev, brandTone: value }))}>
                        <SelectTrigger className="bg-cosmic-void/50 border-asteroid-silver/30 text-white">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="bg-cosmic-void border-asteroid-silver/30">
                          {brandTones.map(tone => (
                            <SelectItem key={tone.toLowerCase()} value={tone.toLowerCase()}>{tone}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="timeframe" className="text-white">Planning Timeframe *</Label>
                      <Select value={personaInput.timeframe} onValueChange={(value) => setPersonaInput(prev => ({ ...prev, timeframe: value }))}>
                        <SelectTrigger className="bg-cosmic-void/50 border-asteroid-silver/30 text-white">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="bg-cosmic-void border-asteroid-silver/30">
                          <SelectItem value="1 month">1 Month</SelectItem>
                          <SelectItem value="3 months">3 Months</SelectItem>
                          <SelectItem value="6 months">6 Months</SelectItem>
                          <SelectItem value="1 year">1 Year</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="brandValues" className="text-white">Brand Values & Mission</Label>
                    <Textarea
                      id="brandValues"
                      value={personaInput.brandValues || ''}
                      onChange={(e) => setPersonaInput(prev => ({ ...prev, brandValues: e.target.value }))}
                      placeholder="Describe your brand's core values, mission, and what you stand for..."
                      className="bg-cosmic-void/50 border-asteroid-silver/30 text-white min-h-[80px]"
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Goals and Challenges */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card className="bg-cosmic-void/40 border-asteroid-silver/30">
                  <CardHeader>
                    <CardTitle className="text-white flex items-center gap-2">
                      <Target className="w-5 h-5 text-electric-cyan" />
                      Goals *
                    </CardTitle>
                    <CardDescription className="text-asteroid-silver">
                      What do you want to achieve?
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex flex-wrap gap-2">
                      {personaInput.goals.map((goal, index) => (
                        <Badge 
                          key={index}
                          variant="outline" 
                          className="border-electric-cyan/30 text-electric-cyan cursor-pointer hover:bg-electric-cyan/10"
                          onClick={() => handleRemoveGoal(goal)}
                        >
                          {goal} ×
                        </Badge>
                      ))}
                    </div>
                    <div className="flex gap-2">
                      <Input
                        placeholder="Type a goal and press Enter"
                        className="bg-cosmic-void/50 border-asteroid-silver/30 text-white"
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            handleAddGoal(e.currentTarget.value);
                            e.currentTarget.value = '';
                          }
                        }}
                      />
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {['Increase engagement', 'Grow followers', 'Drive sales', 'Build brand awareness', 'Generate leads'].map(goal => (
                        <Button
                          key={goal}
                          variant="outline"
                          size="sm"
                          onClick={() => handleAddGoal(goal)}
                          className="text-xs border-asteroid-silver/30 text-asteroid-silver hover:bg-electric-cyan/10"
                        >
                          + {goal}
                        </Button>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-cosmic-void/40 border-asteroid-silver/30">
                  <CardHeader>
                    <CardTitle className="text-white flex items-center gap-2">
                      <CheckCircle className="w-5 h-5 text-electric-cyan" />
                      Current Challenges *
                    </CardTitle>
                    <CardDescription className="text-asteroid-silver">
                      What obstacles are you facing?
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex flex-wrap gap-2">
                      {personaInput.currentChallenges.map((challenge, index) => (
                        <Badge 
                          key={index}
                          variant="outline" 
                          className="border-red-400/30 text-red-400 cursor-pointer hover:bg-red-400/10"
                          onClick={() => handleRemoveChallenge(challenge)}
                        >
                          {challenge} ×
                        </Badge>
                      ))}
                    </div>
                    <div className="flex gap-2">
                      <Input
                        placeholder="Type a challenge and press Enter"
                        className="bg-cosmic-void/50 border-asteroid-silver/30 text-white"
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            handleAddChallenge(e.currentTarget.value);
                            e.currentTarget.value = '';
                          }
                        }}
                      />
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {['Low engagement', 'Content ideas', 'Time constraints', 'Reach limitations', 'Competition'].map(challenge => (
                        <Button
                          key={challenge}
                          variant="outline"
                          size="sm"
                          onClick={() => handleAddChallenge(challenge)}
                          className="text-xs border-asteroid-silver/30 text-asteroid-silver hover:bg-red-400/10"
                        >
                          + {challenge}
                        </Button>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Platforms and Content Types */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card className="bg-cosmic-void/40 border-asteroid-silver/30">
                  <CardHeader>
                    <CardTitle className="text-white">Active Platforms *</CardTitle>
                    <CardDescription className="text-asteroid-silver">
                      Select your social media platforms
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 gap-2">
                      {platforms.map(platform => (
                        <Button
                          key={platform}
                          variant={personaInput.platforms.includes(platform) ? "default" : "outline"}
                          size="sm"
                          onClick={() => handlePlatformToggle(platform)}
                          className={`${
                            personaInput.platforms.includes(platform)
                              ? 'bg-electric-cyan text-space-navy'
                              : 'border-asteroid-silver/30 text-asteroid-silver hover:bg-electric-cyan/10'
                          }`}
                        >
                          {platform}
                        </Button>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-cosmic-void/40 border-asteroid-silver/30">
                  <CardHeader>
                    <CardTitle className="text-white">Content Types *</CardTitle>
                    <CardDescription className="text-asteroid-silver">
                      Select your preferred content formats
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 gap-2">
                      {contentTypes.map(contentType => (
                        <Button
                          key={contentType}
                          variant={personaInput.contentTypes.includes(contentType) ? "default" : "outline"}
                          size="sm"
                          onClick={() => handleContentTypeToggle(contentType)}
                          className={`${
                            personaInput.contentTypes.includes(contentType)
                              ? 'bg-electric-cyan text-space-navy'
                              : 'border-asteroid-silver/30 text-asteroid-silver hover:bg-electric-cyan/10'
                          }`}
                        >
                          {contentType}
                        </Button>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Optional Information */}
              <Card className="bg-cosmic-void/40 border-asteroid-silver/30">
                <CardHeader>
                  <CardTitle className="text-white">Additional Context</CardTitle>
                  <CardDescription className="text-asteroid-silver">
                    Optional information to enhance personalization
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="competitorExamples" className="text-white">Competitor Examples</Label>
                      <Textarea
                        id="competitorExamples"
                        value={personaInput.competitorExamples || ''}
                        onChange={(e) => setPersonaInput(prev => ({ ...prev, competitorExamples: e.target.value }))}
                        placeholder="Mention competitors or brands you admire..."
                        className="bg-cosmic-void/50 border-asteroid-silver/30 text-white"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="budget" className="text-white">Monthly Budget (USD)</Label>
                      <Input
                        id="budget"
                        type="number"
                        value={personaInput.budget || ''}
                        onChange={(e) => setPersonaInput(prev => ({ ...prev, budget: e.target.value ? Number(e.target.value) : undefined }))}
                        placeholder="Optional marketing budget"
                        className="bg-cosmic-void/50 border-asteroid-silver/30 text-white"
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Generate Button */}
              <div className="flex justify-center">
                <Button
                  onClick={handleGenerateSuggestions}
                  disabled={generateSuggestionsMutation.isPending}
                  className="bg-gradient-to-r from-electric-cyan to-nebula-purple hover:opacity-90 text-white px-8 py-6 text-lg"
                >
                  {generateSuggestionsMutation.isPending ? (
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2"></div>
                  ) : (
                    <Zap className="w-5 h-5 mr-2" />
                  )}
                  Generate Persona Suggestions
                </Button>
              </div>
            </motion.div>
          </TabsContent>

          {/* Persona Analysis Tab */}
          <TabsContent value="analysis" className="space-y-6">
            {generatedSuggestions && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-6"
              >
                {/* Profile Summary */}
                <Card className="bg-cosmic-void/40 border-asteroid-silver/30">
                  <CardHeader>
                    <CardTitle className="text-white">Brand Persona Analysis</CardTitle>
                    <CardDescription className="text-asteroid-silver">
                      AI-powered insights into your brand identity and positioning
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-asteroid-silver leading-relaxed">
                      {generatedSuggestions.personaAnalysis.profileSummary}
                    </p>
                  </CardContent>
                </Card>

                {/* Strengths and Opportunities */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Card className="bg-gradient-to-r from-green-500/10 to-emerald-500/10 border-green-500/20">
                    <CardHeader>
                      <CardTitle className="text-green-400 flex items-center gap-2">
                        <Star className="w-5 h-5" />
                        Identified Strengths
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-2">
                        {generatedSuggestions.personaAnalysis.strengthsIdentified.map((strength, i) => (
                          <li key={i} className="text-asteroid-silver text-sm flex items-start gap-2">
                            <CheckCircle className="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0" />
                            {strength}
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>

                  <Card className="bg-gradient-to-r from-blue-500/10 to-cyan-500/10 border-blue-500/20">
                    <CardHeader>
                      <CardTitle className="text-blue-400 flex items-center gap-2">
                        <TrendingUp className="w-5 h-5" />
                        Growth Opportunities
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-2">
                        {generatedSuggestions.personaAnalysis.growthOpportunities.map((opportunity, i) => (
                          <li key={i} className="text-asteroid-silver text-sm flex items-start gap-2">
                            <span className="text-blue-400 mt-1">→</span>
                            {opportunity}
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                </div>

                {/* Voice and Audience Insights */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Card className="bg-cosmic-void/40 border-asteroid-silver/30">
                    <CardHeader>
                      <CardTitle className="text-white flex items-center gap-2">
                        <MessageSquare className="w-5 h-5 text-electric-cyan" />
                        Recommended Voice
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-asteroid-silver">
                        {generatedSuggestions.personaAnalysis.recommendedVoice}
                      </p>
                    </CardContent>
                  </Card>

                  <Card className="bg-cosmic-void/40 border-asteroid-silver/30">
                    <CardHeader>
                      <CardTitle className="text-white flex items-center gap-2">
                        <Users className="w-5 h-5 text-electric-cyan" />
                        Audience Insights
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-2">
                        {generatedSuggestions.personaAnalysis.targetAudienceInsights.slice(0, 3).map((insight, i) => (
                          <li key={i} className="text-asteroid-silver text-sm flex items-start gap-2">
                            <span className="text-electric-cyan mt-1">•</span>
                            {insight}
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                </div>

                {/* Growth Projections */}
                <Card className="bg-cosmic-void/40 border-asteroid-silver/30">
                  <CardHeader>
                    <CardTitle className="text-white flex items-center gap-2">
                      <BarChart3 className="w-5 h-5 text-electric-cyan" />
                      Growth Projections ({generatedSuggestions.growthProjections.timeframe})
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="text-center p-4 bg-gradient-to-r from-electric-cyan/10 to-nebula-purple/10 rounded-lg border border-electric-cyan/20">
                        <Users className="w-6 h-6 text-electric-cyan mx-auto mb-2" />
                        <div className="text-sm text-asteroid-silver">Followers Growth</div>
                        <div className="text-white font-semibold">+{generatedSuggestions.growthProjections.expectedGrowth.followers}%</div>
                      </div>
                      <div className="text-center p-4 bg-gradient-to-r from-electric-cyan/10 to-nebula-purple/10 rounded-lg border border-electric-cyan/20">
                        <Heart className="w-6 h-6 text-electric-cyan mx-auto mb-2" />
                        <div className="text-sm text-asteroid-silver">Engagement Growth</div>
                        <div className="text-white font-semibold">+{generatedSuggestions.growthProjections.expectedGrowth.engagement}%</div>
                      </div>
                      <div className="text-center p-4 bg-gradient-to-r from-electric-cyan/10 to-nebula-purple/10 rounded-lg border border-electric-cyan/20">
                        <Share className="w-6 h-6 text-electric-cyan mx-auto mb-2" />
                        <div className="text-sm text-asteroid-silver">Reach Growth</div>
                        <div className="text-white font-semibold">+{generatedSuggestions.growthProjections.expectedGrowth.reach}%</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )}
          </TabsContent>

          {/* Content Suggestions Tab */}
          <TabsContent value="suggestions" className="space-y-6">
            {generatedSuggestions && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-6"
              >
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {generatedSuggestions.contentSuggestions.map((suggestion) => (
                    <Card key={suggestion.id} className="bg-cosmic-void/40 border-asteroid-silver/30">
                      <CardHeader>
                        <div className="flex items-start justify-between">
                          <CardTitle className="text-white">{suggestion.title}</CardTitle>
                          <Badge className={`${getDifficultyColor(suggestion.difficulty)} border`}>
                            {suggestion.difficulty}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-4 text-sm text-asteroid-silver">
                          <span>{suggestion.platform}</span>
                          <span>•</span>
                          <span>{suggestion.contentType}</span>
                          <span>•</span>
                          <span>{suggestion.timeToCreate}</span>
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <p className="text-asteroid-silver text-sm">{suggestion.description}</p>
                        
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <div className="text-xs text-asteroid-silver mb-1">Est. Reach</div>
                            <div className="text-white font-semibold">{formatNumber(suggestion.estimatedReach)}</div>
                          </div>
                          <div>
                            <div className="text-xs text-asteroid-silver mb-1">Engagement Potential</div>
                            <div className="flex items-center gap-2">
                              <Progress value={suggestion.engagementPotential} className="flex-1 h-2" />
                              <span className="text-white text-sm">{suggestion.engagementPotential}%</span>
                            </div>
                          </div>
                        </div>

                        <div>
                          <div className="text-xs text-asteroid-silver mb-2">Keywords</div>
                          <div className="flex flex-wrap gap-1">
                            {suggestion.keywords.map((keyword, i) => (
                              <Badge key={i} variant="outline" className="border-electric-cyan/30 text-electric-cyan text-xs">
                                #{keyword}
                              </Badge>
                            ))}
                          </div>
                        </div>

                        <div className="bg-gradient-to-r from-electric-cyan/10 to-nebula-purple/10 rounded-lg p-3 border border-electric-cyan/20">
                          <div className="text-xs text-electric-cyan mb-1">Why this works for you:</div>
                          <p className="text-asteroid-silver text-xs">{suggestion.personalizedReason}</p>
                        </div>

                        <div className="flex items-center justify-between">
                          <div className="text-xs text-asteroid-silver">
                            CTA: {suggestion.callToAction}
                          </div>
                          <div className="flex items-center gap-1">
                            <TrendingUp className="w-3 h-3 text-green-400" />
                            <span className="text-xs text-green-400">{suggestion.trendRelevance}% trend relevance</span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </motion.div>
            )}
          </TabsContent>

          {/* Strategic Plan Tab */}
          <TabsContent value="strategy" className="space-y-6">
            {generatedSuggestions && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-6"
              >
                {/* Posting Schedule */}
                <Card className="bg-cosmic-void/40 border-asteroid-silver/30">
                  <CardHeader>
                    <CardTitle className="text-white flex items-center gap-2">
                      <Clock className="w-5 h-5 text-electric-cyan" />
                      Recommended Posting Schedule
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {generatedSuggestions.strategicRecommendations.postingSchedule.map((schedule, i) => (
                        <div key={i} className="bg-gradient-to-r from-electric-cyan/10 to-nebula-purple/10 rounded-lg p-4 border border-electric-cyan/20">
                          <h4 className="text-white font-semibold mb-2">{schedule.platform}</h4>
                          <div className="space-y-2 text-sm">
                            <div className="text-asteroid-silver">
                              <span className="text-electric-cyan">Frequency:</span> {schedule.frequency}
                            </div>
                            <div className="text-asteroid-silver">
                              <span className="text-electric-cyan">Best Times:</span> {schedule.bestTimes.join(', ')}
                            </div>
                            <div>
                              <span className="text-electric-cyan text-xs">Content Mix:</span>
                              <div className="flex flex-wrap gap-1 mt-1">
                                {Object.entries(schedule.contentMix).map(([type, percentage]) => (
                                  <Badge key={type} variant="outline" className="border-electric-cyan/30 text-electric-cyan text-xs">
                                    {type}: {percentage}%
                                  </Badge>
                                ))}
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Hashtag Strategy */}
                <Card className="bg-cosmic-void/40 border-asteroid-silver/30">
                  <CardHeader>
                    <CardTitle className="text-white flex items-center gap-2">
                      <Hash className="w-5 h-5 text-electric-cyan" />
                      Hashtag Strategy
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <h4 className="text-green-400 font-medium mb-2">Trending</h4>
                        <div className="flex flex-wrap gap-1">
                          {generatedSuggestions.strategicRecommendations.hashtags.trending.map((tag, i) => (
                            <Badge key={i} variant="outline" className="border-green-400/30 text-green-400 text-xs">
                              {tag}
                            </Badge>
                          ))}
                        </div>
                      </div>
                      <div>
                        <h4 className="text-blue-400 font-medium mb-2">Niche-Specific</h4>
                        <div className="flex flex-wrap gap-1">
                          {generatedSuggestions.strategicRecommendations.hashtags.niche.map((tag, i) => (
                            <Badge key={i} variant="outline" className="border-blue-400/30 text-blue-400 text-xs">
                              {tag}
                            </Badge>
                          ))}
                        </div>
                      </div>
                      <div>
                        <h4 className="text-purple-400 font-medium mb-2">Branded</h4>
                        <div className="flex flex-wrap gap-1">
                          {generatedSuggestions.strategicRecommendations.hashtags.branded.map((tag, i) => (
                            <Badge key={i} variant="outline" className="border-purple-400/30 text-purple-400 text-xs">
                              {tag}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Monthly Content Plan */}
                <Card className="bg-cosmic-void/40 border-asteroid-silver/30">
                  <CardHeader>
                    <CardTitle className="text-white flex items-center gap-2">
                      <Calendar className="w-5 h-5 text-electric-cyan" />
                      Monthly Content Plan
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                      {generatedSuggestions.monthlyContentPlan.map((week) => (
                        <div key={week.week} className="bg-gradient-to-r from-electric-cyan/10 to-nebula-purple/10 rounded-lg p-4 border border-electric-cyan/20">
                          <h4 className="text-white font-semibold mb-2">Week {week.week}</h4>
                          <div className="space-y-3">
                            <div>
                              <span className="text-electric-cyan text-xs">Theme:</span>
                              <p className="text-asteroid-silver text-sm">{week.theme}</p>
                            </div>
                            <div>
                              <span className="text-electric-cyan text-xs">Content Types:</span>
                              <div className="flex flex-wrap gap-1 mt-1">
                                {week.contentTypes.map((type, i) => (
                                  <Badge key={i} variant="outline" className="border-electric-cyan/30 text-electric-cyan text-xs">
                                    {type}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                            <div>
                              <span className="text-electric-cyan text-xs">Key Messages:</span>
                              <ul className="text-asteroid-silver text-xs mt-1 space-y-1">
                                {week.keyMessages.slice(0, 2).map((message, i) => (
                                  <li key={i}>• {message}</li>
                                ))}
                              </ul>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Personalization Insights */}
                <Card className="bg-cosmic-void/40 border-asteroid-silver/30">
                  <CardHeader>
                    <CardTitle className="text-white flex items-center gap-2">
                      <Brain className="w-5 h-5 text-electric-cyan" />
                      Personalization Insights
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <h4 className="text-electric-cyan font-medium mb-3">Unique Angles</h4>
                        <ul className="space-y-2">
                          {generatedSuggestions.personalizationInsights.uniqueAngles.map((angle, i) => (
                            <li key={i} className="text-asteroid-silver text-sm flex items-start gap-2">
                              <span className="text-electric-cyan mt-1">→</span>
                              {angle}
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div>
                        <h4 className="text-green-400 font-medium mb-3">Competitive Differentiators</h4>
                        <ul className="space-y-2">
                          {generatedSuggestions.personalizationInsights.competitiveDifferentiators.map((diff, i) => (
                            <li key={i} className="text-asteroid-silver text-sm flex items-start gap-2">
                              <Star className="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0" />
                              {diff}
                            </li>
                          ))}
                        </ul>
                      </div>
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