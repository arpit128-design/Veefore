import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { 
  Brain, 
  TrendingUp, 
  Target, 
  Zap, 
  Shield, 
  Heart, 
  BarChart3,
  Search,
  Eye,
  Sparkles,
  Users,
  DollarSign,
  Globe,
  CheckCircle,
  AlertTriangle,
  Rocket,
  PieChart
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { apiRequest } from '@/lib/queryClient';
import { UpgradeModal } from '@/components/modals/UpgradeModal';

interface AIEngineCard {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  credits: number;
  color: string;
  features: string[];
  endpoint: string;
  inputFields: Array<{
    name: string;
    label: string;
    type: 'text' | 'textarea' | 'select' | 'number';
    placeholder?: string;
    options?: string[];
    required?: boolean;
  }>;
}

const aiEngines: AIEngineCard[] = [
  {
    id: 'trend-intelligence',
    title: 'Trend Intelligence Engine',
    description: 'Real-time social media trend analysis with viral potential scoring across all platforms',
    icon: <TrendingUp className="w-6 h-6" />,
    credits: 6,
    color: 'from-blue-500 to-cyan-500',
    features: ['Real-time trend analysis', 'Viral potential scoring', 'Platform-specific insights', 'Competitive benchmarking'],
    endpoint: '/api/ai/trend-intelligence',
    inputFields: [
      { name: 'query', label: 'Trend Topic', type: 'text', placeholder: 'Enter trend topic or keyword...', required: true },
      { name: 'platform', label: 'Platform', type: 'select', options: ['all', 'instagram', 'tiktok', 'youtube', 'twitter', 'linkedin'], required: true },
      { name: 'timeframe', label: 'Timeframe', type: 'select', options: ['24h', '7d', '30d'], required: true }
    ]
  },
  {
    id: 'viral-predictor',
    title: 'Viral Predictor AI',
    description: 'Advanced content viral potential analysis with optimization recommendations',
    icon: <Rocket className="w-6 h-6" />,
    credits: 5,
    color: 'from-purple-500 to-pink-500',
    features: ['Viral potential scoring', 'Optimization recommendations', 'Engagement prediction', 'Platform-specific tips'],
    endpoint: '/api/ai/viral-predictor',
    inputFields: [
      { name: 'content', label: 'Content Description', type: 'textarea', placeholder: 'Describe your content idea...', required: true },
      { name: 'platform', label: 'Target Platform', type: 'select', options: ['instagram', 'tiktok', 'youtube', 'twitter', 'linkedin'], required: true },
      { name: 'contentType', label: 'Content Type', type: 'select', options: ['post', 'reel', 'story', 'video', 'article'], required: true }
    ]
  },
  {
    id: 'roi-calculator',
    title: 'ROI Calculator AI',
    description: 'Comprehensive campaign ROI analysis with projections and industry benchmarks',
    icon: <DollarSign className="w-6 h-6" />,
    credits: 3,
    color: 'from-green-500 to-emerald-500',
    features: ['ROI projections', 'Industry benchmarks', 'Cost optimization', 'Performance forecasting'],
    endpoint: '/api/ai/roi-calculator',
    inputFields: [
      { name: 'budget', label: 'Budget ($)', type: 'number', placeholder: '1000', required: true },
      { name: 'industry', label: 'Industry', type: 'select', options: ['e-commerce', 'saas', 'healthcare', 'education', 'finance', 'real-estate', 'fashion', 'food', 'fitness', 'technology'], required: true },
      { name: 'campaignType', label: 'Campaign Type', type: 'select', options: ['awareness', 'conversion', 'engagement', 'traffic', 'app-installs'], required: true },
      { name: 'duration', label: 'Duration (days)', type: 'number', placeholder: '30', required: true }
    ]
  },
  {
    id: 'social-listening',
    title: 'Social Listening AI',
    description: 'Multi-platform brand monitoring with sentiment analysis and competitor insights',
    icon: <Search className="w-6 h-6" />,
    credits: 4,
    color: 'from-orange-500 to-red-500',
    features: ['Brand monitoring', 'Sentiment analysis', 'Competitor tracking', 'Trend identification'],
    endpoint: '/api/ai/social-listening',
    inputFields: [
      { name: 'brandName', label: 'Brand Name', type: 'text', placeholder: 'Enter brand name...', required: true },
      { name: 'competitors', label: 'Competitors', type: 'text', placeholder: 'competitor1, competitor2, competitor3...' },
      { name: 'keywords', label: 'Keywords', type: 'text', placeholder: 'keyword1, keyword2, keyword3...' },
      { name: 'platforms', label: 'Platforms', type: 'select', options: ['all', 'twitter', 'instagram', 'facebook', 'tiktok', 'linkedin'], required: true }
    ]
  },
  {
    id: 'content-theft-detection',
    title: 'Content Theft Detection',
    description: 'Advanced plagiarism detection with legal protection recommendations',
    icon: <Shield className="w-6 h-6" />,
    credits: 7,
    color: 'from-red-500 to-purple-500',
    features: ['Plagiarism detection', 'Legal recommendations', 'Evidence collection', 'Protection strategies'],
    endpoint: '/api/ai/content-theft-detection',
    inputFields: [
      { name: 'originalContent', label: 'Original Content', type: 'textarea', placeholder: 'Enter your original content...', required: true },
      { name: 'suspectedTheft', label: 'Suspected Theft URL', type: 'text', placeholder: 'https://example.com/stolen-content' },
      { name: 'contentType', label: 'Content Type', type: 'select', options: ['text', 'image', 'video', 'audio', 'mixed'], required: true }
    ]
  },
  {
    id: 'emotion-analysis',
    title: 'Emotion Analysis AI',
    description: 'Psychological content analysis using Plutchik\'s Wheel of Emotions',
    icon: <Heart className="w-6 h-6" />,
    credits: 5,
    color: 'from-pink-500 to-rose-500',
    features: ['Emotion mapping', 'Psychological insights', 'Audience response prediction', 'Engagement optimization'],
    endpoint: '/api/ai/emotion-analysis',
    inputFields: [
      { name: 'content', label: 'Content to Analyze', type: 'textarea', placeholder: 'Enter content for emotional analysis...', required: true },
      { name: 'targetAudience', label: 'Target Audience', type: 'select', options: ['general', 'teens', 'millennials', 'gen-x', 'baby-boomers'], required: true },
      { name: 'platform', label: 'Platform Context', type: 'select', options: ['instagram', 'tiktok', 'youtube', 'twitter', 'linkedin'], required: true }
    ]
  }
];

export default function AIIntelligence() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [activeEngine, setActiveEngine] = useState<string | null>(null);
  const [formData, setFormData] = useState<Record<string, any>>({});
  const [results, setResults] = useState<Record<string, any>>({});
  const [upgradeModal, setUpgradeModal] = useState<{
    isOpen: boolean;
    featureType: string;
    creditsRequired: number;
    currentCredits: number;
  }>({
    isOpen: false,
    featureType: "",
    creditsRequired: 0,
    currentCredits: 0
  });

  // Get user data
  const { data: user } = useQuery({
    queryKey: ["/api/user"],
    refetchInterval: 30000
  });

  // AI Engine Mutation
  const aiMutation = useMutation({
    mutationFn: async ({ endpoint, data }: { endpoint: string; data: any }) => {
      const response = await apiRequest("POST", endpoint, data);
      return await response.json();
    },
    onSuccess: (data, variables) => {
      const engineId = variables.endpoint.split('/').pop();
      setResults(prev => ({ ...prev, [engineId || '']: data }));
      toast({
        title: "Analysis Complete!",
        description: `Used ${data.creditsUsed} credits. ${data.remainingCredits} credits remaining.`
      });
      queryClient.invalidateQueries({ queryKey: ["/api/user"] });
    },
    onError: (error: any) => {
      if (error.status === 402 && error.upgradeModal) {
        setUpgradeModal({
          isOpen: true,
          featureType: error.featureType,
          creditsRequired: error.required,
          currentCredits: error.current
        });
      } else {
        toast({
          title: "Analysis Failed",
          description: error.message || "Please try again",
          variant: "destructive"
        });
      }
    }
  });

  const handleSubmit = (engine: AIEngineCard) => {
    const data = { ...formData[engine.id] };
    aiMutation.mutate({ endpoint: engine.endpoint, data });
  };

  const updateFormData = (engineId: string, field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [engineId]: {
        ...prev[engineId],
        [field]: value
      }
    }));
  };

  const renderResult = (engineId: string, result: any) => {
    if (!result) return null;

    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mt-6 p-6 bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-800 dark:to-slate-900 rounded-xl border border-slate-200 dark:border-slate-700"
      >
        <div className="flex items-center gap-2 mb-4">
          <CheckCircle className="w-5 h-5 text-green-500" />
          <h3 className="font-semibold text-lg">Analysis Results</h3>
        </div>
        
        {engineId === 'trend-intelligence' && (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center p-4 bg-white dark:bg-slate-800 rounded">
                <div className="text-2xl font-bold text-blue-600">{result.viralScore}/100</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Viral Score</div>
              </div>
              <div className="text-center p-4 bg-white dark:bg-slate-800 rounded">
                <div className="text-2xl font-bold text-green-600">{result.trendStrength}</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Trend Strength</div>
              </div>
              <div className="text-center p-4 bg-white dark:bg-slate-800 rounded">
                <div className="text-2xl font-bold text-purple-600">{result.competitorCount}</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Competitors</div>
              </div>
            </div>
            <div>
              <h4 className="font-medium mb-2">Key Insights:</h4>
              <p className="text-sm text-gray-700 dark:text-gray-300">{result.insights}</p>
            </div>
            <div>
              <h4 className="font-medium mb-2">Recommendations:</h4>
              <ul className="text-sm text-gray-700 dark:text-gray-300 space-y-1">
                {result.recommendations?.map((rec: string, i: number) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="text-blue-500">•</span>
                    {rec}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}

        {engineId === 'viral-predictor' && (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="text-center p-4 bg-white dark:bg-slate-800 rounded">
                <div className="text-3xl font-bold text-purple-600">{result.viralPotential}/100</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Viral Potential</div>
              </div>
              <div className="text-center p-4 bg-white dark:bg-slate-800 rounded">
                <div className="text-3xl font-bold text-green-600">{result.confidence}%</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Confidence</div>
              </div>
            </div>
            <div>
              <h4 className="font-medium mb-2">Analysis:</h4>
              <p className="text-sm text-gray-700 dark:text-gray-300">{result.analysis}</p>
            </div>
            <div>
              <h4 className="font-medium mb-2">Optimization Tips:</h4>
              <ul className="text-sm text-gray-700 dark:text-gray-300 space-y-1">
                {result.optimizationTips?.map((tip: string, i: number) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="text-purple-500">•</span>
                    {tip}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}

        {engineId === 'roi-calculator' && (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="text-center p-4 bg-white dark:bg-slate-800 rounded">
                <div className="text-2xl font-bold text-green-600">{result.projectedROI}%</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Projected ROI</div>
              </div>
              <div className="text-center p-4 bg-white dark:bg-slate-800 rounded">
                <div className="text-2xl font-bold text-blue-600">${result.estimatedRevenue}</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Est. Revenue</div>
              </div>
              <div className="text-center p-4 bg-white dark:bg-slate-800 rounded">
                <div className="text-2xl font-bold text-orange-600">${result.recommendedBudget}</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Recommended Budget</div>
              </div>
              <div className="text-center p-4 bg-white dark:bg-slate-800 rounded">
                <div className="text-2xl font-bold text-purple-600">{result.breakEvenDays}</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Break-even Days</div>
              </div>
            </div>
            <div>
              <h4 className="font-medium mb-2">Analysis:</h4>
              <p className="text-sm text-gray-700 dark:text-gray-300">{result.analysis}</p>
            </div>
          </div>
        )}

        {engineId === 'social-listening' && (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center p-4 bg-white dark:bg-slate-800 rounded">
                <div className="text-2xl font-bold text-green-600">{result.overallSentiment}</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Overall Sentiment</div>
              </div>
              <div className="text-center p-4 bg-white dark:bg-slate-800 rounded">
                <div className="text-2xl font-bold text-blue-600">{result.mentionCount}</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Mentions</div>
              </div>
              <div className="text-center p-4 bg-white dark:bg-slate-800 rounded">
                <div className="text-2xl font-bold text-purple-600">{result.engagementRate}%</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Engagement Rate</div>
              </div>
            </div>
            <div>
              <h4 className="font-medium mb-2">Key Insights:</h4>
              <p className="text-sm text-gray-700 dark:text-gray-300">{result.insights}</p>
            </div>
            {result.trending && (
              <div>
                <h4 className="font-medium mb-2">Trending Topics:</h4>
                <div className="flex flex-wrap gap-2">
                  {result.trending.map((topic: string, i: number) => (
                    <Badge key={i} variant="secondary">{topic}</Badge>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {engineId === 'content-theft-detection' && (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="text-center p-4 bg-white dark:bg-slate-800 rounded">
                <div className="text-2xl font-bold text-red-600">{result.similarityScore}%</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Similarity Score</div>
              </div>
              <div className="text-center p-4 bg-white dark:bg-slate-800 rounded">
                <div className={`text-2xl font-bold ${result.riskLevel === 'High' ? 'text-red-600' : result.riskLevel === 'Medium' ? 'text-orange-600' : 'text-green-600'}`}>
                  {result.riskLevel}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Risk Level</div>
              </div>
            </div>
            <div>
              <h4 className="font-medium mb-2">Analysis:</h4>
              <p className="text-sm text-gray-700 dark:text-gray-300">{result.analysis}</p>
            </div>
            {result.legalRecommendations && (
              <div>
                <h4 className="font-medium mb-2">Legal Recommendations:</h4>
                <ul className="text-sm text-gray-700 dark:text-gray-300 space-y-1">
                  {result.legalRecommendations.map((rec: string, i: number) => (
                    <li key={i} className="flex items-start gap-2">
                      <span className="text-red-500">•</span>
                      {rec}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}

        {engineId === 'emotion-analysis' && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {result.emotions && Object.entries(result.emotions).map(([emotion, score]: [string, any]) => (
                <div key={emotion} className="text-center p-4 bg-white dark:bg-slate-800 rounded">
                  <div className="text-xl font-bold text-pink-600">{score}%</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400 capitalize">{emotion}</div>
                </div>
              ))}
            </div>
            <div>
              <h4 className="font-medium mb-2">Emotional Analysis:</h4>
              <p className="text-sm text-gray-700 dark:text-gray-300">{result.analysis}</p>
            </div>
            <div>
              <h4 className="font-medium mb-2">Audience Response Prediction:</h4>
              <p className="text-sm text-gray-700 dark:text-gray-300">{result.audienceResponse}</p>
            </div>
            {result.optimizationSuggestions && (
              <div>
                <h4 className="font-medium mb-2">Optimization Suggestions:</h4>
                <ul className="text-sm text-gray-700 dark:text-gray-300 space-y-1">
                  {result.optimizationSuggestions.map((suggestion: string, i: number) => (
                    <li key={i} className="flex items-start gap-2">
                      <span className="text-pink-500">•</span>
                      {suggestion}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}
      </motion.div>
    );
  };

  const fadeInUp = {
    initial: { opacity: 0, y: 60 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6 }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-space-navy via-slate-900 to-space-navy text-white relative overflow-hidden">
      {/* Animated Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        {[...Array(100)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-white rounded-full opacity-30"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              opacity: [0.3, 1, 0.3],
              scale: [1, 1.5, 1],
            }}
            transition={{
              duration: Math.random() * 3 + 2,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
          />
        ))}
      </div>

      <div className="relative z-10 p-6 max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          variants={fadeInUp}
          initial="initial"
          animate="animate"
          className="text-center mb-12"
        >
          <div className="flex items-center justify-center gap-3 mb-6">
            <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center">
              <Brain className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-4xl lg:text-5xl font-bold bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 bg-clip-text text-transparent">
                AI Intelligence Suite
              </h1>
              <p className="text-gray-400 mt-2 text-lg">
                Advanced AI-powered content intelligence and analysis tools
              </p>
            </div>
          </div>
          
          <div className="flex items-center justify-center gap-4 mt-6">
            <Badge variant="secondary" className="text-lg px-6 py-3 bg-gradient-to-r from-blue-500/20 to-purple-500/20 border-blue-500/30">
              <Sparkles className="w-5 h-5 mr-2" />
              {user?.credits || 0} Credits Available
            </Badge>
            <Badge variant="outline" className="text-lg px-6 py-3 border-green-500/30 text-green-400">
              <CheckCircle className="w-5 h-5 mr-2" />
              13+ AI Engines
            </Badge>
          </div>
        </motion.div>

        {/* AI Engines Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {aiEngines.map((engine, index) => (
            <motion.div
              key={engine.id}
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
            >
              <Card className="bg-slate-800/50 border-slate-700 hover:border-slate-600 transition-all duration-300 backdrop-blur-sm">
                <CardHeader className="pb-4">
                  <div className="flex items-center justify-between mb-3">
                    <div className={`w-12 h-12 rounded-xl bg-gradient-to-r ${engine.color} flex items-center justify-center text-white`}>
                      {engine.icon}
                    </div>
                    <Badge variant="outline" className="border-purple-500/30 text-purple-400">
                      {engine.credits} Credits
                    </Badge>
                  </div>
                  <CardTitle className="text-xl text-white">{engine.title}</CardTitle>
                  <CardDescription className="text-gray-300 leading-relaxed">
                    {engine.description}
                  </CardDescription>
                </CardHeader>
                
                <CardContent className="space-y-4">
                  {/* Features */}
                  <div className="space-y-2">
                    {engine.features.map((feature, i) => (
                      <div key={i} className="flex items-center text-sm text-gray-300">
                        <CheckCircle className="w-4 h-4 text-green-400 mr-2 flex-shrink-0" />
                        {feature}
                      </div>
                    ))}
                  </div>

                  {/* Input Form */}
                  {activeEngine === engine.id && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      className="space-y-4 pt-4 border-t border-slate-700"
                    >
                      {engine.inputFields.map((field) => (
                        <div key={field.name} className="space-y-2">
                          <Label className="text-sm font-medium text-gray-300">
                            {field.label}
                            {field.required && <span className="text-red-400 ml-1">*</span>}
                          </Label>
                          
                          {field.type === 'textarea' ? (
                            <Textarea
                              placeholder={field.placeholder}
                              value={formData[engine.id]?.[field.name] || ''}
                              onChange={(e) => updateFormData(engine.id, field.name, e.target.value)}
                              className="bg-slate-700/50 border-slate-600 text-white placeholder-gray-400"
                              rows={3}
                            />
                          ) : field.type === 'select' ? (
                            <Select
                              value={formData[engine.id]?.[field.name] || ''}
                              onValueChange={(value) => updateFormData(engine.id, field.name, value)}
                            >
                              <SelectTrigger className="bg-slate-700/50 border-slate-600 text-white">
                                <SelectValue placeholder={`Select ${field.label.toLowerCase()}`} />
                              </SelectTrigger>
                              <SelectContent>
                                {field.options?.map((option) => (
                                  <SelectItem key={option} value={option}>
                                    {option.charAt(0).toUpperCase() + option.slice(1)}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          ) : (
                            <Input
                              type={field.type}
                              placeholder={field.placeholder}
                              value={formData[engine.id]?.[field.name] || ''}
                              onChange={(e) => updateFormData(engine.id, field.name, e.target.value)}
                              className="bg-slate-700/50 border-slate-600 text-white placeholder-gray-400"
                            />
                          )}
                        </div>
                      ))}
                      
                      <div className="flex gap-3 pt-2">
                        <Button
                          onClick={() => handleSubmit(engine)}
                          disabled={aiMutation.isPending}
                          className={`flex-1 bg-gradient-to-r ${engine.color} hover:opacity-90 text-white`}
                        >
                          {aiMutation.isPending ? 'Analyzing...' : 'Analyze'}
                        </Button>
                        <Button
                          variant="outline"
                          onClick={() => setActiveEngine(null)}
                          className="border-slate-600 text-gray-300 hover:bg-slate-700"
                        >
                          Cancel
                        </Button>
                      </div>
                    </motion.div>
                  )}

                  {/* Toggle Button */}
                  {activeEngine !== engine.id && (
                    <Button
                      onClick={() => setActiveEngine(engine.id)}
                      className={`w-full bg-gradient-to-r ${engine.color} hover:opacity-90 text-white`}
                    >
                      Launch {engine.title}
                    </Button>
                  )}

                  {/* Results */}
                  {renderResult(engine.id, results[engine.id])}
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

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