import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { Heart, Brain, Smile, Frown, Angry, Eye, TrendingUp, BarChart3, Target, Lightbulb, Zap, Sparkles } from "lucide-react";

interface EmotionAnalysis {
  primaryEmotion: string;
  emotionIntensity: number;
  emotionProfile: {
    joy: number;
    anger: number;
    sadness: number;
    fear: number;
    surprise: number;
    disgust: number;
    trust: number;
    anticipation: number;
  };
  psychologicalInsights: {
    plutchikWheel: string;
    cognitiveAppraisal: string;
    emotionalValence: 'positive' | 'negative' | 'neutral';
    arousalLevel: 'high' | 'medium' | 'low';
  };
  audienceResonance: {
    expectedEngagement: number;
    emotionalContagion: number;
    viralPotential: number;
    demographicAppeal: {
      age: string;
      gender: string;
      interests: string[];
    };
  };
  contentOptimization: {
    recommendations: string[];
    emotionalTriggers: string[];
    improvementAreas: string[];
    confidenceScore: number;
  };
}

interface EmotionTrend {
  date: string;
  emotion: string;
  intensity: number;
  engagement: number;
  reach: number;
}

interface PsychologicalProfile {
  dominantEmotions: string[];
  emotionalPatterns: string[];
  brandPersonality: {
    archetype: string;
    traits: string[];
    consistency: number;
  };
  audienceConnection: {
    empathyScore: number;
    trustLevel: number;
    emotionalAlignment: number;
  };
}

export default function EmotionAnalysis() {
  const [contentText, setContentText] = useState("");
  const [contentUrl, setContentUrl] = useState("");
  const [analysisType, setAnalysisType] = useState<'text' | 'url' | 'image'>('text');
  const [targetAudience, setTargetAudience] = useState("");
  const { toast } = useToast();

  const [emotionResult, setEmotionResult] = useState<EmotionAnalysis | null>(null);

  const analyzeEmotionMutation = useMutation({
    mutationFn: async (data: { content?: string; url?: string; type: string; audience?: string }) => {
      const result = await apiRequest('POST', '/api/ai/emotion-analysis', {
        content: data.content || data.url || '',
        contentType: data.type,
        targetAudience: data.audience || 'general',
        platform: 'instagram'
      });
      return result;
    },
    onSuccess: (data) => {
      setEmotionResult(data);
      toast({
        title: "Emotion Analysis Complete",
        description: `Primary emotion: ${data.primaryEmotion} with ${data.emotionIntensity}% intensity.`,
      });
    },
    onError: (error) => {
      toast({
        title: "Analysis Failed",
        description: "Unable to complete emotion analysis. Please try again.",
        variant: "destructive",
      });
    },
  });

  const generateProfileMutation = useMutation({
    mutationFn: () => apiRequest('POST', '/api/ai/psychological-profile', {}),
    onSuccess: () => {
      toast({
        title: "Profile Generated",
        description: "Your psychological content profile has been created.",
      });
    },
  });

  const optimizeContentMutation = useMutation({
    mutationFn: (data: { emotion: string; intensity: number }) =>
      apiRequest('POST', '/api/ai/emotion-optimization', data),
    onSuccess: () => {
      toast({
        title: "Optimization Complete",
        description: "Emotional optimization suggestions have been generated.",
      });
    },
  });

  const handleAnalyzeEmotion = () => {
    if (analysisType === 'text' && !contentText.trim()) {
      toast({
        title: "Content Required",
        description: "Please enter content text to analyze.",
        variant: "destructive",
      });
      return;
    }

    if (analysisType === 'url' && !contentUrl.trim()) {
      toast({
        title: "URL Required",
        description: "Please enter a content URL to analyze.",
        variant: "destructive",
      });
      return;
    }

    analyzeEmotionMutation.mutate({
      content: analysisType === 'text' ? contentText : undefined,
      url: analysisType === 'url' ? contentUrl : undefined,
      type: analysisType,
      audience: targetAudience || undefined
    });
  };

  const handleGenerateProfile = () => {
    generateProfileMutation.mutate();
  };

  const handleOptimizeContent = (emotion: string, intensity: number) => {
    optimizeContentMutation.mutate({ emotion, intensity });
  };

  // Mock data for demonstration
  const mockEmotionAnalysis: EmotionAnalysis = {
    primaryEmotion: 'Joy',
    emotionIntensity: 78,
    emotionProfile: {
      joy: 78,
      anger: 5,
      sadness: 12,
      fear: 8,
      surprise: 45,
      disgust: 3,
      trust: 62,
      anticipation: 55
    },
    psychologicalInsights: {
      plutchikWheel: 'Joy-Trust quadrant with Anticipation elements',
      cognitiveAppraisal: 'Positive valence with high approach motivation',
      emotionalValence: 'positive',
      arousalLevel: 'high'
    },
    audienceResonance: {
      expectedEngagement: 85,
      emotionalContagion: 72,
      viralPotential: 68,
      demographicAppeal: {
        age: '18-34',
        gender: 'All genders',
        interests: ['lifestyle', 'motivation', 'wellness']
      }
    },
    contentOptimization: {
      recommendations: [
        'Increase anticipation elements to boost engagement',
        'Add more trust-building language for credibility',
        'Consider subtle surprise elements for memorability'
      ],
      emotionalTriggers: ['Achievement', 'Belonging', 'Growth', 'Recognition'],
      improvementAreas: ['Emotional depth', 'Relatability', 'Call-to-action strength'],
      confidenceScore: 92
    }
  };

  const mockTrends: EmotionTrend[] = [
    { date: '2025-01-01', emotion: 'Joy', intensity: 75, engagement: 1200, reach: 8500 },
    { date: '2025-01-02', emotion: 'Trust', intensity: 68, engagement: 980, reach: 7200 },
    { date: '2025-01-03', emotion: 'Surprise', intensity: 82, engagement: 1450, reach: 9800 },
    { date: '2025-01-04', emotion: 'Anticipation', intensity: 70, engagement: 1100, reach: 8000 },
    { date: '2025-01-05', emotion: 'Joy', intensity: 78, engagement: 1300, reach: 8900 }
  ];

  const mockPsychProfile: PsychologicalProfile = {
    dominantEmotions: ['Joy', 'Trust', 'Anticipation'],
    emotionalPatterns: [
      'Consistently positive messaging',
      'High energy and enthusiasm',
      'Future-focused optimism',
      'Community-building language'
    ],
    brandPersonality: {
      archetype: 'The Optimist',
      traits: ['Enthusiastic', 'Trustworthy', 'Inspiring', 'Relatable'],
      consistency: 87
    },
    audienceConnection: {
      empathyScore: 78,
      trustLevel: 82,
      emotionalAlignment: 75
    }
  };

  const getEmotionColor = (emotion: string) => {
    const colors: { [key: string]: string } = {
      joy: 'text-yellow-400',
      anger: 'text-red-400',
      sadness: 'text-blue-400',
      fear: 'text-purple-400',
      surprise: 'text-orange-400',
      disgust: 'text-green-400',
      trust: 'text-cyan-400',
      anticipation: 'text-pink-400'
    };
    return colors[emotion.toLowerCase()] || 'text-gray-400';
  };

  const getEmotionIcon = (emotion: string) => {
    switch (emotion.toLowerCase()) {
      case 'joy': return <Smile className="h-4 w-4" />;
      case 'anger': return <Angry className="h-4 w-4" />;
      case 'sadness': return <Frown className="h-4 w-4" />;
      case 'surprise': return <Zap className="h-4 w-4" />;
      default: return <Heart className="h-4 w-4" />;
    }
  };

  return (
    <div className="min-h-screen bg-transparent">
      <div className="container mx-auto px-4 py-8 space-y-6">
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-pink-400 via-purple-500 to-blue-500 bg-clip-text text-transparent">
            AI Emotion Analysis
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Understand the emotional impact of your content using advanced psychological AI analysis
          </p>
        </div>

        <Tabs defaultValue="analysis" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 bg-gray-900/50">
            <TabsTrigger value="analysis" className="data-[state=active]:bg-pink-600">
              <Brain className="h-4 w-4 mr-2" />
              Analysis
            </TabsTrigger>
            <TabsTrigger value="trends" className="data-[state=active]:bg-purple-600">
              <TrendingUp className="h-4 w-4 mr-2" />
              Trends
            </TabsTrigger>
            <TabsTrigger value="profile" className="data-[state=active]:bg-blue-600">
              <Eye className="h-4 w-4 mr-2" />
              Profile
            </TabsTrigger>
            <TabsTrigger value="optimization" className="data-[state=active]:bg-indigo-600">
              <Target className="h-4 w-4 mr-2" />
              Optimization
            </TabsTrigger>
          </TabsList>

          {/* Emotion Analysis Tab */}
          <TabsContent value="analysis" className="space-y-6">
            <Card className="bg-gray-900/50 border-gray-700">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Brain className="h-5 w-5 text-pink-400" />
                  Content Emotion Analysis
                </CardTitle>
                <CardDescription>
                  Analyze the emotional profile and psychological impact of your content
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-3 gap-4">
                  <Button
                    variant={analysisType === 'text' ? 'default' : 'outline'}
                    onClick={() => setAnalysisType('text')}
                    className="w-full"
                  >
                    Text Analysis
                  </Button>
                  <Button
                    variant={analysisType === 'url' ? 'default' : 'outline'}
                    onClick={() => setAnalysisType('url')}
                    className="w-full"
                  >
                    URL Analysis
                  </Button>
                  <Button
                    variant={analysisType === 'image' ? 'default' : 'outline'}
                    onClick={() => setAnalysisType('image')}
                    className="w-full"
                  >
                    Image Analysis
                  </Button>
                </div>

                {analysisType === 'text' && (
                  <div className="space-y-2">
                    <Label>Content Text</Label>
                    <Textarea
                      placeholder="Enter your content text for emotional analysis..."
                      rows={4}
                      value={contentText}
                      onChange={(e) => setContentText(e.target.value)}
                      className="bg-gray-800 border-gray-600"
                    />
                  </div>
                )}

                {analysisType === 'url' && (
                  <div className="space-y-2">
                    <Label>Content URL</Label>
                    <Input
                      placeholder="https://your-content-url.com"
                      value={contentUrl}
                      onChange={(e) => setContentUrl(e.target.value)}
                      className="bg-gray-800 border-gray-600"
                    />
                  </div>
                )}

                {analysisType === 'image' && (
                  <div className="space-y-2">
                    <Label>Image Upload</Label>
                    <div className="border-2 border-dashed border-gray-600 rounded-lg p-8 text-center">
                      <p className="text-gray-400">Click to upload or drag and drop</p>
                      <p className="text-sm text-gray-500">PNG, JPG, GIF up to 10MB</p>
                    </div>
                  </div>
                )}

                <div className="space-y-2">
                  <Label>Target Audience (Optional)</Label>
                  <Input
                    placeholder="e.g., Gen Z, professionals, parents"
                    value={targetAudience}
                    onChange={(e) => setTargetAudience(e.target.value)}
                    className="bg-gray-800 border-gray-600"
                  />
                </div>

                <Button 
                  onClick={handleAnalyzeEmotion} 
                  disabled={analyzeEmotionMutation.isPending}
                  className="w-full bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-700 hover:to-purple-700"
                >
                  {analyzeEmotionMutation.isPending ? (
                    <>
                      <Brain className="mr-2 h-4 w-4 animate-spin" />
                      Analyzing Emotions...
                    </>
                  ) : (
                    <>
                      <Heart className="mr-2 h-4 w-4" />
                      Analyze Emotional Impact (5 Credits)
                    </>
                  )}
                </Button>

                {/* Analysis Results */}
                {emotionResult && (
                  <div className="space-y-6 pt-4">
                    <div className="text-center space-y-2">
                      <h3 className="text-lg font-semibold text-pink-400">Primary Emotion Analysis</h3>
                      <div className="flex items-center justify-center gap-3">
                        {getEmotionIcon(emotionResult.primaryEmotion)}
                        <span className="text-2xl font-bold">{emotionResult.primaryEmotion}</span>
                        <Badge className="bg-pink-900/50 text-pink-300">
                          {emotionResult.emotionIntensity}% intensity
                        </Badge>
                      </div>
                    </div>

                  <Card className="bg-gray-800/50 border-gray-600">
                    <CardHeader>
                      <CardTitle className="text-lg">Emotion Profile (Plutchik's Wheel)</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {Object.entries(emotionResult.emotionProfile).map(([emotion, intensity]) => (
                          <div key={emotion} className="space-y-2">
                            <div className="flex items-center justify-between">
                              <span className={`capitalize ${getEmotionColor(emotion)}`}>{emotion}</span>
                              <span className="text-sm text-gray-400">{intensity}%</span>
                            </div>
                            <Progress value={intensity} className="h-2" />
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Card className="bg-gray-800/50 border-gray-600">
                      <CardHeader>
                        <CardTitle className="text-lg flex items-center gap-2">
                          <Brain className="h-5 w-5 text-purple-400" />
                          Psychological Insights
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        <div>
                          <span className="text-sm text-gray-400">Plutchik Analysis:</span>
                          <p className="text-sm text-gray-300">{emotionResult.psychologicalInsights.plutchikWheel}</p>
                        </div>
                        <div>
                          <span className="text-sm text-gray-400">Cognitive Appraisal:</span>
                          <p className="text-sm text-gray-300">{emotionResult.psychologicalInsights.cognitiveAppraisal}</p>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-400">Valence:</span>
                          <Badge className={
                            emotionResult.psychologicalInsights.emotionalValence === 'positive' 
                              ? 'bg-green-900/50 text-green-300' 
                              : emotionResult.psychologicalInsights.emotionalValence === 'negative'
                              ? 'bg-red-900/50 text-red-300'
                              : 'bg-gray-900/50 text-gray-300'
                          }>
                            {emotionResult.psychologicalInsights.emotionalValence}
                          </Badge>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-400">Arousal:</span>
                          <Badge className="bg-orange-900/50 text-orange-300">
                            {emotionResult.psychologicalInsights.arousalLevel}
                          </Badge>
                        </div>
                      </CardContent>
                    </Card>

                    <Card className="bg-gray-800/50 border-gray-600">
                      <CardHeader>
                        <CardTitle className="text-lg flex items-center gap-2">
                          <TrendingUp className="h-5 w-5 text-blue-400" />
                          Audience Resonance
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        <div className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span>Expected Engagement</span>
                            <span className="text-blue-400">{emotionResult.audienceResonance.expectedEngagement}%</span>
                          </div>
                          <Progress value={emotionResult.audienceResonance.expectedEngagement} className="h-2" />
                        </div>
                        <div className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span>Emotional Contagion</span>
                            <span className="text-purple-400">{emotionResult.audienceResonance.emotionalContagion}%</span>
                          </div>
                          <Progress value={emotionResult.audienceResonance.emotionalContagion} className="h-2" />
                        </div>
                        <div className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span>Viral Potential</span>
                            <span className="text-green-400">{emotionResult.audienceResonance.viralPotential}%</span>
                          </div>
                          <Progress value={emotionResult.audienceResonance.viralPotential} className="h-2" />
                        </div>
                        <div className="pt-2 border-t border-gray-700">
                          <p className="text-xs text-gray-400">Best fit: {emotionResult.audienceResonance.demographicAppeal.age}, {emotionResult.audienceResonance.demographicAppeal.gender}</p>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Emotion Trends Tab */}
          <TabsContent value="trends" className="space-y-6">
            <Card className="bg-gray-900/50 border-gray-700">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5 text-purple-400" />
                  Emotional Content Trends
                </CardTitle>
                <CardDescription>
                  Track how different emotions perform in your content over time
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Card className="bg-gray-800/50 border-gray-600">
                    <CardContent className="p-4 text-center">
                      <div className="text-2xl font-bold text-yellow-400">78%</div>
                      <p className="text-sm text-gray-400">Avg. Joy Intensity</p>
                    </CardContent>
                  </Card>
                  <Card className="bg-gray-800/50 border-gray-600">
                    <CardContent className="p-4 text-center">
                      <div className="text-2xl font-bold text-cyan-400">82%</div>
                      <p className="text-sm text-gray-400">Avg. Trust Level</p>
                    </CardContent>
                  </Card>
                  <Card className="bg-gray-800/50 border-gray-600">
                    <CardContent className="p-4 text-center">
                      <div className="text-2xl font-bold text-green-400">+15%</div>
                      <p className="text-sm text-gray-400">Engagement Growth</p>
                    </CardContent>
                  </Card>
                </div>

                <div className="space-y-4">
                  <h4 className="font-medium text-purple-400">Recent Emotional Performance</h4>
                  <div className="space-y-3">
                    {mockTrends.map((trend, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-gray-800/50 rounded-lg">
                        <div className="flex items-center gap-3">
                          <div className={`${getEmotionColor(trend.emotion)} flex items-center gap-2`}>
                            {getEmotionIcon(trend.emotion)}
                            <span className="font-medium">{trend.emotion}</span>
                          </div>
                          <Badge variant="outline" className="text-xs">
                            {trend.intensity}%
                          </Badge>
                        </div>
                        <div className="flex items-center gap-4 text-sm text-gray-400">
                          <span>{trend.engagement} engagements</span>
                          <span>{trend.reach.toLocaleString()} reach</span>
                          <span>{trend.date}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Psychological Profile Tab */}
          <TabsContent value="profile" className="space-y-6">
            <Card className="bg-gray-900/50 border-gray-700">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Eye className="h-5 w-5 text-blue-400" />
                  Psychological Content Profile
                </CardTitle>
                <CardDescription>
                  Understand your content's psychological patterns and brand personality
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Button 
                  onClick={handleGenerateProfile} 
                  disabled={generateProfileMutation.isPending}
                  className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
                >
                  {generateProfileMutation.isPending ? (
                    <>
                      <Brain className="mr-2 h-4 w-4 animate-spin" />
                      Generating Profile...
                    </>
                  ) : (
                    <>
                      <Eye className="mr-2 h-4 w-4" />
                      Generate Psychological Profile (6 Credits)
                    </>
                  )}
                </Button>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Card className="bg-gray-800/50 border-gray-600">
                    <CardHeader>
                      <CardTitle className="text-lg">Brand Personality</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="text-center space-y-2">
                        <h4 className="text-xl font-bold text-blue-400">{mockPsychProfile.brandPersonality.archetype}</h4>
                        <Progress value={mockPsychProfile.brandPersonality.consistency} className="h-2" />
                        <p className="text-sm text-gray-400">{mockPsychProfile.brandPersonality.consistency}% consistency</p>
                      </div>
                      <div className="space-y-2">
                        <h5 className="font-medium text-gray-300">Key Traits:</h5>
                        <div className="flex flex-wrap gap-2">
                          {mockPsychProfile.brandPersonality.traits.map((trait, index) => (
                            <Badge key={index} variant="outline" className="text-blue-400 border-blue-400">
                              {trait}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="bg-gray-800/50 border-gray-600">
                    <CardHeader>
                      <CardTitle className="text-lg">Audience Connection</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>Empathy Score</span>
                          <span className="text-pink-400">{mockPsychProfile.audienceConnection.empathyScore}%</span>
                        </div>
                        <Progress value={mockPsychProfile.audienceConnection.empathyScore} className="h-2" />
                      </div>
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>Trust Level</span>
                          <span className="text-cyan-400">{mockPsychProfile.audienceConnection.trustLevel}%</span>
                        </div>
                        <Progress value={mockPsychProfile.audienceConnection.trustLevel} className="h-2" />
                      </div>
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>Emotional Alignment</span>
                          <span className="text-purple-400">{mockPsychProfile.audienceConnection.emotionalAlignment}%</span>
                        </div>
                        <Progress value={mockPsychProfile.audienceConnection.emotionalAlignment} className="h-2" />
                      </div>
                    </CardContent>
                  </Card>
                </div>

                <Card className="bg-gray-800/50 border-gray-600">
                  <CardHeader>
                    <CardTitle className="text-lg">Emotional Patterns</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <h5 className="font-medium text-gray-300 mb-2">Dominant Emotions:</h5>
                        <div className="space-y-1">
                          {mockPsychProfile.dominantEmotions.map((emotion, index) => (
                            <div key={index} className={`flex items-center gap-2 ${getEmotionColor(emotion)}`}>
                              {getEmotionIcon(emotion)}
                              <span>{emotion}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                      <div>
                        <h5 className="font-medium text-gray-300 mb-2">Content Patterns:</h5>
                        <ul className="space-y-1 text-sm text-gray-400">
                          {mockPsychProfile.emotionalPatterns.map((pattern, index) => (
                            <li key={index}>• {pattern}</li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Emotion Optimization Tab */}
          <TabsContent value="optimization" className="space-y-6">
            <Card className="bg-gray-900/50 border-gray-700">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="h-5 w-5 text-indigo-400" />
                  Emotional Optimization
                </CardTitle>
                <CardDescription>
                  Get AI-powered recommendations to optimize your content's emotional impact
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Button 
                  onClick={() => handleOptimizeContent('joy', 78)} 
                  disabled={optimizeContentMutation.isPending}
                  className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700"
                >
                  {optimizeContentMutation.isPending ? (
                    <>
                      <Zap className="mr-2 h-4 w-4 animate-spin" />
                      Optimizing Content...
                    </>
                  ) : (
                    <>
                      <Lightbulb className="mr-2 h-4 w-4" />
                      Generate Optimization Strategy (4 Credits)
                    </>
                  )}
                </Button>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Card className="bg-gray-800/50 border-gray-600">
                    <CardHeader>
                      <CardTitle className="text-lg flex items-center gap-2">
                        <Lightbulb className="h-5 w-5 text-yellow-400" />
                        Recommendations
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-2 text-sm">
                        {mockEmotionAnalysis.contentOptimization.recommendations.map((rec, index) => (
                          <li key={index} className="flex items-start gap-2">
                            <Sparkles className="h-3 w-3 text-yellow-400 mt-1 flex-shrink-0" />
                            <span className="text-gray-300">{rec}</span>
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>

                  <Card className="bg-gray-800/50 border-gray-600">
                    <CardHeader>
                      <CardTitle className="text-lg flex items-center gap-2">
                        <Zap className="h-5 w-5 text-orange-400" />
                        Emotional Triggers
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="flex flex-wrap gap-2">
                        {mockEmotionAnalysis.contentOptimization.emotionalTriggers.map((trigger, index) => (
                          <Badge key={index} className="bg-orange-900/50 text-orange-300">
                            {trigger}
                          </Badge>
                        ))}
                      </div>
                      <div className="mt-4 pt-4 border-t border-gray-700">
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-gray-400">Confidence Score:</span>
                          <Badge className="bg-green-900/50 text-green-300">
                            {mockEmotionAnalysis.contentOptimization.confidenceScore}%
                          </Badge>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                <Card className="bg-gray-800/50 border-gray-600">
                  <CardHeader>
                    <CardTitle className="text-lg">Improvement Areas</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {mockEmotionAnalysis.contentOptimization.improvementAreas.map((area, index) => (
                        <div key={index} className="text-center p-3 bg-gray-900/50 rounded-lg">
                          <Target className="h-6 w-6 text-indigo-400 mx-auto mb-2" />
                          <p className="text-sm font-medium text-gray-300">{area}</p>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}