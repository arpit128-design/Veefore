import { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Slider } from '@/components/ui/slider';
import { Card, CardContent } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { apiRequest } from '@/lib/queryClient';
import { 
  Rocket, 
  Globe, 
  Target, 
  Users, 
  TrendingUp, 
  Calendar,
  Instagram,
  CheckCircle
} from 'lucide-react';
import { useLocation } from 'wouter';

interface UserPreferences {
  businessName: string;
  description: string;
  niches: string[];
  brandTone: string;
  goals: {
    primary: string;
    followers: number;
    engagement: number;
    timeline: string;
  };
}

const CONTENT_GALAXIES = [
  { id: 'lifestyle', name: 'Lifestyle & Wellness', icon: '🌟', description: 'Health, fitness, daily routines' },
  { id: 'tech', name: 'Technology & Innovation', icon: '🚀', description: 'Gadgets, apps, digital trends' },
  { id: 'food', name: 'Food & Culinary', icon: '🍳', description: 'Recipes, restaurants, cooking tips' },
  { id: 'travel', name: 'Travel & Adventure', icon: '✈️', description: 'Destinations, experiences, culture' },
  { id: 'fashion', name: 'Fashion & Style', icon: '👗', description: 'Trends, outfits, accessories' },
  { id: 'business', name: 'Business & Entrepreneurship', icon: '💼', description: 'Startups, leadership, growth' },
  { id: 'entertainment', name: 'Entertainment & Media', icon: '🎬', description: 'Movies, music, pop culture' },
  { id: 'education', name: 'Education & Learning', icon: '📚', description: 'Tutorials, courses, knowledge' },
  { id: 'art', name: 'Art & Creativity', icon: '🎨', description: 'Design, photography, creative work' },
  { id: 'sports', name: 'Sports & Fitness', icon: '⚽', description: 'Athletics, workouts, competitions' }
];

const BRAND_TONES = [
  { id: 'professional', name: 'Professional', description: 'Formal, authoritative, industry-focused' },
  { id: 'friendly', name: 'Friendly', description: 'Approachable, warm, conversational' },
  { id: 'playful', name: 'Playful', description: 'Fun, energetic, creative' },
  { id: 'inspirational', name: 'Inspirational', description: 'Motivating, uplifting, empowering' },
  { id: 'educational', name: 'Educational', description: 'Informative, helpful, teaching-focused' },
  { id: 'luxury', name: 'Luxury', description: 'Premium, sophisticated, exclusive' }
];

const PRIMARY_GOALS = [
  { id: 'brand-awareness', name: 'Brand Awareness', description: 'Increase visibility and recognition' },
  { id: 'lead-generation', name: 'Lead Generation', description: 'Generate qualified prospects' },
  { id: 'community-building', name: 'Community Building', description: 'Build engaged audience' },
  { id: 'sales', name: 'Sales & Revenue', description: 'Drive direct sales and revenue' },
  { id: 'thought-leadership', name: 'Thought Leadership', description: 'Establish industry authority' },
  { id: 'customer-engagement', name: 'Customer Engagement', description: 'Engage existing customers' }
];

const TIMELINES = [
  { id: '3-months', name: '3 Months', description: 'Quick wins and immediate impact' },
  { id: '6-months', name: '6 Months', description: 'Steady growth and optimization' },
  { id: '12-months', name: '1 Year', description: 'Long-term strategy and scaling' },
  { id: '18-months', name: '18+ Months', description: 'Extended vision and market leadership' }
];

export default function NewOnboarding() {
  const [currentStep, setCurrentStep] = useState(0);
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const [preferences, setPreferences] = useState<UserPreferences>({
    businessName: '',
    description: '',
    niches: [],
    brandTone: '',
    goals: {
      primary: '',
      followers: 1000,
      engagement: 5,
      timeline: ''
    }
  });

  const { data: socialAccounts } = useQuery({
    queryKey: ['/api/social-accounts'],
    enabled: currentStep === 5
  });

  const savePreferencesMutation = useMutation({
    mutationFn: (data: UserPreferences) => apiRequest('POST', '/api/user/complete-onboarding', { preferences: data }),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['/api/user'] });
      await queryClient.refetchQueries({ queryKey: ['/api/user'] });
      toast({
        title: "Mission Initiated!",
        description: "Your cosmic journey begins now. Welcome to VeeFore!",
      });
      setTimeout(() => setLocation('/dashboard'), 1000);
    },
    onError: () => {
      toast({
        title: "Launch Failed",
        description: "Unable to save your preferences. Please try again.",
        variant: "destructive",
      });
    }
  });

  const steps = [
    { id: 'welcome', title: 'Welcome to VeeFore', component: WelcomeStep },
    { id: 'brand', title: 'Define Your Brand', component: BrandStep },
    { id: 'niches', title: 'Choose Content Galaxies', component: NichesStep },
    { id: 'tone', title: 'Set Your Voice', component: ToneStep },
    { id: 'goals', title: 'Mission Objectives', component: GoalsStep },
    { id: 'connect', title: 'Connect Platforms', component: ConnectStep }
  ];

  const canProceed = () => {
    switch (currentStep) {
      case 0: return true;
      case 1: return preferences.businessName.trim() && preferences.description.trim();
      case 2: return preferences.niches.length > 0;
      case 3: return preferences.brandTone;
      case 4: return preferences.goals.primary && preferences.goals.timeline;
      case 5: return true;
      default: return false;
    }
  };

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleFinish = () => {
    savePreferencesMutation.mutate(preferences);
  };

  const CurrentStepComponent = steps[currentStep]?.component;

  function WelcomeStep() {
    return (
      <div className="text-center space-y-8 max-w-4xl mx-auto">
        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-r from-cyan-400/20 to-blue-600/20 rounded-full blur-3xl"></div>
          <div className="relative bg-slate-800/50 backdrop-blur-sm border border-slate-600/50 rounded-3xl p-12">
            <div className="w-24 h-24 mx-auto mb-8 bg-gradient-to-br from-cyan-400 to-blue-600 rounded-2xl flex items-center justify-center">
              <Rocket className="w-12 h-12 text-white" />
            </div>
            
            <h1 className="text-5xl font-bold bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent mb-6">
              Welcome to VeeFore
            </h1>
            
            <p className="text-xl text-slate-300 mb-8 leading-relaxed">
              Your AI-powered mission control for social media domination.
              <br />
              Let's launch your cosmic content strategy in just a few steps.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
              <div className="p-6 bg-slate-800/30 border border-slate-600/30 rounded-xl">
                <Globe className="w-8 h-8 text-cyan-400 mb-4 mx-auto" />
                <h3 className="font-semibold text-white mb-2">Multi-Platform</h3>
                <p className="text-slate-400 text-sm">Manage all your social accounts from one cosmic dashboard</p>
              </div>
              
              <div className="p-6 bg-slate-800/30 border border-slate-600/30 rounded-xl">
                <Target className="w-8 h-8 text-cyan-400 mb-4 mx-auto" />
                <h3 className="font-semibold text-white mb-2">AI-Powered</h3>
                <p className="text-slate-400 text-sm">Intelligent content suggestions tailored to your brand</p>
              </div>
              
              <div className="p-6 bg-slate-800/30 border border-slate-600/30 rounded-xl">
                <TrendingUp className="w-8 h-8 text-cyan-400 mb-4 mx-auto" />
                <h3 className="font-semibold text-white mb-2">Analytics</h3>
                <p className="text-slate-400 text-sm">Track performance and optimize your cosmic strategy</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  function BrandStep() {
    return (
      <div className="space-y-8 max-w-2xl mx-auto">
        <div 
          className="space-y-6"
          style={{ 
            contain: 'layout style paint',
            isolation: 'isolate',
            transform: 'translateZ(0)'
          }}
        >
          <div className="input-stable">
            <label className="block text-lg font-semibold text-cyan-400 mb-3">
              Business Name
            </label>
            <Input
              value={preferences.businessName}
              onChange={(e) => setPreferences(prev => ({ ...prev, businessName: e.target.value }))}
              placeholder="Enter your cosmic brand name..."
              className="bg-slate-800 border-slate-600 text-white placeholder-slate-400 h-12 text-lg focus:bg-slate-800 focus:border-cyan-400 input-stable"
              style={{
                contain: 'layout style paint',
                willChange: 'auto',
                transform: 'translateZ(0)'
              }}
            />
          </div>
          
          <div className="input-stable">
            <label className="block text-lg font-semibold text-cyan-400 mb-3">
              Tell us about your mission
            </label>
            <Textarea
              value={preferences.description}
              onChange={(e) => setPreferences(prev => ({ ...prev, description: e.target.value }))}
              placeholder="Describe your brand's cosmic purpose and what makes you unique in the universe..."
              className="bg-slate-800 border-slate-600 text-white placeholder-slate-400 min-h-32 focus:bg-slate-800 focus:border-cyan-400 input-stable"
              rows={4}
              style={{
                contain: 'layout style paint',
                willChange: 'auto',
                transform: 'translateZ(0)'
              }}
            />
          </div>
        </div>
      </div>
    );
  }

  function NichesStep() {
    const toggleNiche = (niche: string) => {
      setPreferences(prev => ({
        ...prev,
        niches: prev.niches.includes(niche)
          ? prev.niches.filter(n => n !== niche)
          : [...prev.niches, niche]
      }));
    };

    return (
      <div className="space-y-8">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-white mb-4">Choose Your Content Galaxies</h2>
          <p className="text-slate-400 text-lg">Select the cosmic realms where your content will shine brightest</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-w-6xl mx-auto">
          {CONTENT_GALAXIES.map((galaxy) => (
            <Card
              key={galaxy.id}
              className={`cursor-pointer border-2 transition-all duration-200 ${
                preferences.niches.includes(galaxy.id)
                  ? 'border-cyan-400 bg-cyan-400/10'
                  : 'border-slate-600 bg-slate-800/50 hover:border-cyan-400/50'
              }`}
              onClick={() => toggleNiche(galaxy.id)}
            >
              <CardContent className="p-6 text-center">
                <div className="text-3xl mb-3">{galaxy.icon}</div>
                <h3 className="font-semibold text-white mb-2">{galaxy.name}</h3>
                <p className="text-slate-400 text-sm">{galaxy.description}</p>
                {preferences.niches.includes(galaxy.id) && (
                  <CheckCircle className="w-6 h-6 text-cyan-400 mx-auto mt-3" />
                )}
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="text-center">
          <p className="text-slate-400">
            Selected: {preferences.niches.length} galaxies
            {preferences.niches.length > 0 && (
              <span className="text-cyan-400 ml-2">
                ({preferences.niches.length} selected)
              </span>
            )}
          </p>
        </div>
      </div>
    );
  }

  function ToneStep() {
    return (
      <div className="space-y-8">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-white mb-4">Set Your Cosmic Voice</h2>
          <p className="text-slate-400 text-lg">Choose the tone that best represents your brand's personality</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-w-4xl mx-auto">
          {BRAND_TONES.map((tone) => (
            <Card
              key={tone.id}
              className={`cursor-pointer border-2 transition-all duration-200 ${
                preferences.brandTone === tone.id
                  ? 'border-cyan-400 bg-cyan-400/10'
                  : 'border-slate-600 bg-slate-800/50 hover:border-cyan-400/50'
              }`}
              onClick={() => setPreferences(prev => ({ ...prev, brandTone: tone.id }))}
            >
              <CardContent className="p-6 text-center">
                <h3 className="font-semibold text-white mb-2 text-lg">{tone.name}</h3>
                <p className="text-slate-400 text-sm">{tone.description}</p>
                {preferences.brandTone === tone.id && (
                  <CheckCircle className="w-6 h-6 text-cyan-400 mx-auto mt-3" />
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  function GoalsStep() {
    return (
      <div className="space-y-8 max-w-4xl mx-auto">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-white mb-4">Mission Objectives</h2>
          <p className="text-slate-400 text-lg">Define your cosmic goals and set your trajectory for success</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Primary Goal Selection */}
          <div className="space-y-4">
            <h3 className="text-xl font-semibold text-cyan-400 mb-4">Primary Mission</h3>
            <div className="space-y-3">
              {PRIMARY_GOALS.map((goal) => (
                <Card
                  key={goal.id}
                  className={`cursor-pointer border transition-all duration-200 ${
                    preferences.goals.primary === goal.id
                      ? 'border-cyan-400 bg-cyan-400/10'
                      : 'border-slate-600 bg-slate-800/50 hover:border-cyan-400/50'
                  }`}
                  onClick={() => setPreferences(prev => ({
                    ...prev,
                    goals: { ...prev.goals, primary: goal.id }
                  }))}
                >
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-semibold text-white">{goal.name}</h4>
                        <p className="text-slate-400 text-sm">{goal.description}</p>
                      </div>
                      {preferences.goals.primary === goal.id && (
                        <CheckCircle className="w-5 h-5 text-cyan-400" />
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Targets and Timeline */}
          <div className="space-y-6">
            <div>
              <h3 className="text-xl font-semibold text-cyan-400 mb-4">Target Metrics</h3>
              
              <div className="space-y-6">
                <div>
                  <label className="block text-white font-medium mb-3">
                    Follower Target: {preferences.goals.followers.toLocaleString()}
                  </label>
                  <Slider
                    value={[preferences.goals.followers]}
                    onValueChange={(value) => setPreferences(prev => ({
                      ...prev,
                      goals: { ...prev.goals, followers: value[0] }
                    }))}
                    max={100000}
                    min={100}
                    step={100}
                    className="w-full"
                  />
                  <div className="flex justify-between text-slate-400 text-sm mt-1">
                    <span>100</span>
                    <span>100K+</span>
                  </div>
                </div>

                <div>
                  <label className="block text-white font-medium mb-3">
                    Engagement Rate: {preferences.goals.engagement}%
                  </label>
                  <Slider
                    value={[preferences.goals.engagement]}
                    onValueChange={(value) => setPreferences(prev => ({
                      ...prev,
                      goals: { ...prev.goals, engagement: value[0] }
                    }))}
                    max={20}
                    min={1}
                    step={0.5}
                    className="w-full"
                  />
                  <div className="flex justify-between text-slate-400 text-sm mt-1">
                    <span>1%</span>
                    <span>20%</span>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-cyan-400 mb-3">Timeline</h3>
              <div className="space-y-2">
                {TIMELINES.map((timeline) => (
                  <Card
                    key={timeline.id}
                    className={`cursor-pointer border transition-all duration-200 ${
                      preferences.goals.timeline === timeline.id
                        ? 'border-cyan-400 bg-cyan-400/10'
                        : 'border-slate-600 bg-slate-800/50 hover:border-cyan-400/50'
                    }`}
                    onClick={() => setPreferences(prev => ({
                      ...prev,
                      goals: { ...prev.goals, timeline: timeline.id }
                    }))}
                  >
                    <CardContent className="p-3">
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-semibold text-white text-sm">{timeline.name}</h4>
                          <p className="text-slate-400 text-xs">{timeline.description}</p>
                        </div>
                        {preferences.goals.timeline === timeline.id && (
                          <CheckCircle className="w-4 h-4 text-cyan-400" />
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  function ConnectStep() {
    const connectedAccounts = socialAccounts || [];
    const hasInstagram = connectedAccounts.some((account: any) => account.platform === 'instagram');

    return (
      <div className="space-y-8 max-w-3xl mx-auto">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-white mb-4">Connect Your Platforms</h2>
          <p className="text-slate-400 text-lg">Link your social accounts to begin your cosmic journey</p>
        </div>

        <div className="space-y-6">
          {/* Instagram */}
          <Card className="border-slate-600 bg-slate-800/50">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
                    <Instagram className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-white">Instagram</h3>
                    {hasInstagram ? (
                      <div className="space-y-1">
                        {connectedAccounts
                          .filter((account: any) => account.platform === 'instagram')
                          .map((account: any) => (
                            <div key={account.id} className="flex items-center space-x-2">
                              <CheckCircle className="w-4 h-4 text-green-400" />
                              <span className="text-green-400 font-medium">@{account.username}</span>
                              <span className="text-slate-400 text-sm">
                                ({account.followers} followers, {account.mediaCount} posts)
                              </span>
                            </div>
                          ))}
                      </div>
                    ) : (
                      <p className="text-slate-400">Connect your Instagram account</p>
                    )}
                  </div>
                </div>
                
                {hasInstagram ? (
                  <div className="flex items-center space-x-2 text-green-400">
                    <CheckCircle className="w-5 h-5" />
                    <span className="font-medium">Connected</span>
                  </div>
                ) : (
                  <Button 
                    onClick={() => window.open('/api/auth/instagram', '_blank')}
                    className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
                  >
                    Connect
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Coming Soon Platforms */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              { name: 'TikTok', icon: '🎵', color: 'from-black to-red-500' },
              { name: 'YouTube', icon: '📺', color: 'from-red-500 to-red-600' },
              { name: 'Twitter/X', icon: '🐦', color: 'from-blue-400 to-blue-500' },
              { name: 'LinkedIn', icon: '💼', color: 'from-blue-600 to-blue-700' }
            ].map((platform) => (
              <Card key={platform.name} className="border-slate-700 bg-slate-800/30 opacity-60">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className={`w-10 h-10 bg-gradient-to-br ${platform.color} rounded-lg flex items-center justify-center text-lg`}>
                        {platform.icon}
                      </div>
                      <div>
                        <h3 className="font-semibold text-white">{platform.name}</h3>
                        <p className="text-slate-500 text-sm">Coming Soon</p>
                      </div>
                    </div>
                    <Button disabled variant="outline" size="sm" className="opacity-50">
                      Coming Soon
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        <div className="text-center">
          <p className="text-slate-400 text-sm">
            {hasInstagram 
              ? "Great! You're ready to launch your mission. You can connect more platforms later from your dashboard."
              : "You can skip this step and connect platforms later from your dashboard."
            }
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-900 text-white relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-10 left-10 w-72 h-72 bg-cyan-400/5 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 right-10 w-96 h-96 bg-blue-600/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-10 left-1/3 w-80 h-80 bg-purple-500/5 rounded-full blur-3xl"></div>
      </div>

      <div className="relative z-10 flex flex-col min-h-screen">
        {/* Header */}
        <div className="p-8 text-center">
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent mb-2">
              {steps[currentStep].title}
            </h1>
            <p className="text-slate-400">
              Step {currentStep + 1} of {steps.length} - Building your cosmic strategy
            </p>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 px-8 pb-8 typing-container">
          <div className="max-w-6xl mx-auto" style={{ contain: 'layout style paint', isolation: 'isolate' }}>
            <div key={currentStep} className="w-full">
              {CurrentStepComponent && <CurrentStepComponent />}
            </div>
          </div>
        </div>

        {/* Navigation */}
        <div className="p-8">
          <div className="max-w-4xl mx-auto flex justify-between items-center">
            <Button
              onClick={handlePrevious}
              disabled={currentStep === 0}
              variant="outline"
              className="bg-slate-800/50 border-slate-600 text-white hover:bg-slate-700 disabled:opacity-50"
            >
              Previous
            </Button>

            <div className="text-slate-400 text-sm">
              Step {currentStep + 1} of {steps.length}
            </div>

            {currentStep === steps.length - 1 ? (
              <Button
                onClick={handleFinish}
                disabled={savePreferencesMutation.isPending || !canProceed()}
                className="bg-gradient-to-r from-cyan-400 to-blue-600 hover:from-cyan-500 hover:to-blue-700 text-white font-semibold px-8"
              >
                {savePreferencesMutation.isPending ? (
                  "Launching..."
                ) : (
                  <>
                    Launch Mission <Rocket className="w-4 h-4 ml-2" />
                  </>
                )}
              </Button>
            ) : (
              <Button
                onClick={handleNext}
                disabled={!canProceed()}
                className="bg-gradient-to-r from-cyan-400 to-blue-600 hover:from-cyan-500 hover:to-blue-700 text-white font-semibold px-8"
              >
                Next Step <Target className="w-4 h-4 ml-2" />
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}