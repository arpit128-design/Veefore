import { useState, useEffect } from 'react';
import { useLocation } from 'wouter';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { useToast } from '@/hooks/use-toast';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
import { 
  Rocket, 
  Instagram, 
  Twitter, 
  Youtube, 
  TrendingUp,
  Sparkles,
  Target,
  Heart,
  Camera,
  Music,
  Gamepad2,
  Utensils,
  Plane,
  BookOpen,
  Briefcase,
  Palette,
  Code,
  Dumbbell,
  Car,
  Home,
  ShoppingCart,
  Baby,
  PawPrint,
  Users,
  ArrowRight,
  Check,
  Star
} from 'lucide-react';

const steps = [
  { id: 'welcome', title: 'Welcome to VeeFore', icon: Rocket },
  { id: 'integrations', title: 'Connect Your Accounts', icon: Instagram },
  { id: 'preferences', title: 'Tell Us About You', icon: Sparkles },
  { id: 'complete', title: 'Ready to Launch', icon: Star }
];

const socialPlatforms = [
  { id: 'instagram', name: 'Instagram', icon: Instagram, color: 'bg-gradient-to-r from-purple-500 to-pink-500' },
  { id: 'twitter', name: 'Twitter', icon: Twitter, color: 'bg-blue-500', comingSoon: true },
  { id: 'youtube', name: 'YouTube', icon: Youtube, color: 'bg-red-500', comingSoon: true },
];

const niches = [
  { id: 'lifestyle', name: 'Lifestyle', icon: Heart, description: 'Fashion, beauty, wellness' },
  { id: 'photography', name: 'Photography', icon: Camera, description: 'Visual storytelling' },
  { id: 'music', name: 'Music', icon: Music, description: 'Artists, producers, fans' },
  { id: 'gaming', name: 'Gaming', icon: Gamepad2, description: 'Gaming content & reviews' },
  { id: 'food', name: 'Food & Cooking', icon: Utensils, description: 'Recipes & culinary arts' },
  { id: 'travel', name: 'Travel', icon: Plane, description: 'Adventures & destinations' },
  { id: 'education', name: 'Education', icon: BookOpen, description: 'Learning & tutorials' },
  { id: 'business', name: 'Business', icon: Briefcase, description: 'Entrepreneurship & tips' },
  { id: 'art', name: 'Art & Design', icon: Palette, description: 'Creative expression' },
  { id: 'tech', name: 'Technology', icon: Code, description: 'Tech reviews & tutorials' },
  { id: 'fitness', name: 'Fitness', icon: Dumbbell, description: 'Health & workouts' },
  { id: 'automotive', name: 'Automotive', icon: Car, description: 'Cars & motorsports' },
  { id: 'home', name: 'Home & Garden', icon: Home, description: 'Interior design & DIY' },
  { id: 'shopping', name: 'Shopping', icon: ShoppingCart, description: 'Product reviews & deals' },
  { id: 'parenting', name: 'Parenting', icon: Baby, description: 'Family & childcare' },
  { id: 'pets', name: 'Pets', icon: PawPrint, description: 'Pet care & training' },
];

const contentTypes = [
  'Posts', 'Stories', 'Reels', 'IGTV', 'Carousel Posts', 'Live Videos', 'Tutorials', 'Behind-the-scenes'
];

const tones = [
  { id: 'professional', name: 'Professional', description: 'Formal and business-focused' },
  { id: 'casual', name: 'Casual', description: 'Relaxed and conversational' },
  { id: 'humorous', name: 'Humorous', description: 'Funny and entertaining' },
  { id: 'inspirational', name: 'Inspirational', description: 'Motivational and uplifting' },
  { id: 'educational', name: 'Educational', description: 'Informative and teaching' },
  { id: 'trendy', name: 'Trendy', description: 'Current and fashionable' }
];

export default function Onboarding() {
  const [, setLocation] = useLocation();
  const [currentStep, setCurrentStep] = useState(0);
  const [preferences, setPreferences] = useState({
    businessName: '',
    businessType: '',
    targetAudience: '',
    goals: '',
    selectedNiches: [] as string[],
    contentTypes: [] as string[],
    tone: '',
    postingFrequency: 'daily',
    languages: ['English'],
    timezone: 'UTC'
  });
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Check if user is already onboarded
  const { data: user } = useQuery({
    queryKey: ['/api/user'],
    retry: false
  });

  const { data: socialAccounts } = useQuery({
    queryKey: ['/api/social-accounts'],
    enabled: currentStep === 1
  });

  useEffect(() => {
    if (user?.isOnboarded) {
      setLocation('/dashboard');
    }
  }, [user, setLocation]);

  const completeOnboardingMutation = useMutation({
    mutationFn: async (data: any) => {
      return apiRequest('/api/user/complete-onboarding', {
        method: 'POST',
        body: JSON.stringify(data)
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/user'] });
      toast({
        title: 'Welcome to VeeFore!',
        description: 'Your account is now set up and ready to use.'
      });
      setLocation('/dashboard');
    },
    onError: (error: any) => {
      toast({
        title: 'Setup Error',
        description: error.message || 'Failed to complete onboarding',
        variant: 'destructive'
      });
    }
  });

  const connectInstagram = () => {
    window.location.href = '/api/instagram/auth';
  };

  const handleNicheToggle = (nicheId: string) => {
    setPreferences(prev => ({
      ...prev,
      selectedNiches: prev.selectedNiches.includes(nicheId)
        ? prev.selectedNiches.filter(id => id !== nicheId)
        : [...prev.selectedNiches, nicheId]
    }));
  };

  const handleContentTypeToggle = (type: string) => {
    setPreferences(prev => ({
      ...prev,
      contentTypes: prev.contentTypes.includes(type)
        ? prev.contentTypes.filter(t => t !== type)
        : [...prev.contentTypes, type]
    }));
  };

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(prev => prev + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const handleComplete = () => {
    completeOnboardingMutation.mutate({
      preferences: {
        ...preferences,
        completedAt: new Date().toISOString()
      }
    });
  };

  const canProceed = () => {
    switch (currentStep) {
      case 0: return true; // Welcome step
      case 1: return socialAccounts && socialAccounts.length > 0; // Must connect at least one account
      case 2: return preferences.selectedNiches.length > 0 && preferences.tone && preferences.businessName; // Must fill preferences
      case 3: return true; // Complete step
      default: return false;
    }
  };

  const renderWelcomeStep = () => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="text-center space-y-8"
    >
      <div className="space-y-4">
        <div className="mx-auto w-24 h-24 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
          <Rocket className="w-12 h-12 text-white" />
        </div>
        <div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Welcome to VeeFore
          </h1>
          <p className="text-xl text-gray-600 mt-4">
            Your AI-powered social media management platform
          </p>
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
        <Card className="p-6 text-center border-2 hover:border-blue-200 transition-colors">
          <TrendingUp className="w-12 h-12 text-blue-500 mx-auto mb-4" />
          <h3 className="font-semibold text-lg mb-2">AI Content Creation</h3>
          <p className="text-gray-600">Generate engaging content tailored to your audience</p>
        </Card>
        <Card className="p-6 text-center border-2 hover:border-purple-200 transition-colors">
          <Target className="w-12 h-12 text-purple-500 mx-auto mb-4" />
          <h3 className="font-semibold text-lg mb-2">Smart Scheduling</h3>
          <p className="text-gray-600">Optimize posting times for maximum engagement</p>
        </Card>
        <Card className="p-6 text-center border-2 hover:border-green-200 transition-colors">
          <Sparkles className="w-12 h-12 text-green-500 mx-auto mb-4" />
          <h3 className="font-semibold text-lg mb-2">Analytics & Insights</h3>
          <p className="text-gray-600">Track performance with real-time analytics</p>
        </Card>
      </div>

      <p className="text-gray-500">
        Let's get you set up in just a few steps to unlock the full power of AI-driven social media management.
      </p>
    </motion.div>
  );

  const renderIntegrationsStep = () => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-8"
    >
      <div className="text-center">
        <h2 className="text-3xl font-bold mb-4">Connect Your Social Media Accounts</h2>
        <p className="text-gray-600 text-lg">
          Connect your accounts to start managing your social media presence
        </p>
      </div>

      <div className="grid gap-6 max-w-2xl mx-auto">
        {socialPlatforms.map((platform) => (
          <Card key={platform.id} className="overflow-hidden">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className={`w-12 h-12 rounded-full ${platform.color} flex items-center justify-center`}>
                    <platform.icon className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg">{platform.name}</h3>
                    <p className="text-gray-600">
                      {platform.comingSoon ? 'Coming Soon' : 'Ready to connect'}
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  {socialAccounts?.find(acc => acc.platform === platform.id) ? (
                    <div className="flex items-center space-x-2 text-green-600">
                      <Check className="w-5 h-5" />
                      <span className="font-medium">Connected</span>
                    </div>
                  ) : (
                    <Button
                      onClick={platform.id === 'instagram' ? connectInstagram : undefined}
                      disabled={platform.comingSoon}
                      variant={platform.comingSoon ? 'outline' : 'default'}
                      className={platform.id === 'instagram' ? 'bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600' : ''}
                    >
                      {platform.comingSoon ? 'Coming Soon' : 'Connect'}
                    </Button>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {socialAccounts && socialAccounts.length > 0 && (
        <div className="text-center">
          <div className="inline-flex items-center space-x-2 bg-green-50 border border-green-200 rounded-lg px-4 py-2">
            <Check className="w-5 h-5 text-green-600" />
            <span className="text-green-700 font-medium">
              Great! You've connected {socialAccounts.length} account{socialAccounts.length > 1 ? 's' : ''}
            </span>
          </div>
        </div>
      )}
    </motion.div>
  );

  const renderPreferencesStep = () => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-8"
    >
      <div className="text-center">
        <h2 className="text-3xl font-bold mb-4">Tell Us About Your Brand</h2>
        <p className="text-gray-600 text-lg">
          Help our AI understand your brand to create better content
        </p>
      </div>

      <div className="max-w-4xl mx-auto space-y-8">
        {/* Business Information */}
        <Card>
          <CardHeader>
            <CardTitle>Business Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="businessName">Business/Brand Name</Label>
                <Input
                  id="businessName"
                  value={preferences.businessName}
                  onChange={(e) => setPreferences(prev => ({ ...prev, businessName: e.target.value }))}
                  placeholder="Enter your business name"
                />
              </div>
              <div>
                <Label htmlFor="businessType">Business Type</Label>
                <Input
                  id="businessType"
                  value={preferences.businessType}
                  onChange={(e) => setPreferences(prev => ({ ...prev, businessType: e.target.value }))}
                  placeholder="e.g., E-commerce, Service, Personal Brand"
                />
              </div>
            </div>
            <div>
              <Label htmlFor="targetAudience">Target Audience</Label>
              <Textarea
                id="targetAudience"
                value={preferences.targetAudience}
                onChange={(e) => setPreferences(prev => ({ ...prev, targetAudience: e.target.value }))}
                placeholder="Describe your target audience (age, interests, demographics)"
                rows={3}
              />
            </div>
            <div>
              <Label htmlFor="goals">Business Goals</Label>
              <Textarea
                id="goals"
                value={preferences.goals}
                onChange={(e) => setPreferences(prev => ({ ...prev, goals: e.target.value }))}
                placeholder="What are your main business goals? (brand awareness, sales, engagement, etc.)"
                rows={3}
              />
            </div>
          </CardContent>
        </Card>

        {/* Niche Selection */}
        <Card>
          <CardHeader>
            <CardTitle>Your Niches & Industries</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
              {niches.map((niche) => (
                <div
                  key={niche.id}
                  className={`p-4 border-2 rounded-lg cursor-pointer transition-all hover:shadow-md ${
                    preferences.selectedNiches.includes(niche.id)
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                  onClick={() => handleNicheToggle(niche.id)}
                >
                  <div className="flex flex-col items-center text-center space-y-2">
                    <niche.icon className="w-8 h-8 text-gray-600" />
                    <div>
                      <p className="font-medium text-sm">{niche.name}</p>
                      <p className="text-xs text-gray-500">{niche.description}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Content Preferences */}
        <Card>
          <CardHeader>
            <CardTitle>Content Preferences</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <Label className="text-base font-medium">Content Types You Want to Create</Label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-3">
                {contentTypes.map((type) => (
                  <div
                    key={type}
                    className={`p-3 border-2 rounded-lg cursor-pointer text-center transition-all ${
                      preferences.contentTypes.includes(type)
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                    onClick={() => handleContentTypeToggle(type)}
                  >
                    <span className="text-sm font-medium">{type}</span>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <Label className="text-base font-medium">Brand Tone & Voice</Label>
              <div className="grid md:grid-cols-2 gap-3 mt-3">
                {tones.map((tone) => (
                  <div
                    key={tone.id}
                    className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                      preferences.tone === tone.id
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                    onClick={() => setPreferences(prev => ({ ...prev, tone: tone.id }))}
                  >
                    <h4 className="font-medium">{tone.name}</h4>
                    <p className="text-sm text-gray-600">{tone.description}</p>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </motion.div>
  );

  const renderCompleteStep = () => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="text-center space-y-8"
    >
      <div className="space-y-4">
        <div className="mx-auto w-24 h-24 bg-gradient-to-br from-green-500 to-blue-600 rounded-full flex items-center justify-center">
          <Star className="w-12 h-12 text-white" />
        </div>
        <div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
            You're All Set!
          </h1>
          <p className="text-xl text-gray-600 mt-4">
            Your VeeFore account is now configured and ready to use
          </p>
        </div>
      </div>

      <Card className="max-w-2xl mx-auto">
        <CardContent className="p-8">
          <h3 className="text-xl font-semibold mb-6">Setup Summary</h3>
          <div className="space-y-4 text-left">
            <div className="flex items-center justify-between">
              <span>Connected Accounts</span>
              <Badge variant="outline">{socialAccounts?.length || 0} connected</Badge>
            </div>
            <div className="flex items-center justify-between">
              <span>Selected Niches</span>
              <Badge variant="outline">{preferences.selectedNiches.length} selected</Badge>
            </div>
            <div className="flex items-center justify-between">
              <span>Brand Tone</span>
              <Badge variant="outline">{preferences.tone || 'Not set'}</Badge>
            </div>
            <div className="flex items-center justify-between">
              <span>Content Types</span>
              <Badge variant="outline">{preferences.contentTypes.length} selected</Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="space-y-4">
        <p className="text-gray-600">
          Our AI is now learning about your brand and will help you create amazing content that resonates with your audience.
        </p>
        <div className="grid md:grid-cols-3 gap-4 max-w-3xl mx-auto text-sm">
          <div className="flex items-center space-x-2 text-green-600">
            <Check className="w-4 h-4" />
            <span>AI personality configured</span>
          </div>
          <div className="flex items-center space-x-2 text-green-600">
            <Check className="w-4 h-4" />
            <span>Content preferences saved</span>
          </div>
          <div className="flex items-center space-x-2 text-green-600">
            <Check className="w-4 h-4" />
            <span>Ready to create content</span>
          </div>
        </div>
      </div>
    </motion.div>
  );

  const renderStepContent = () => {
    switch (currentStep) {
      case 0: return renderWelcomeStep();
      case 1: return renderIntegrationsStep();
      case 2: return renderPreferencesStep();
      case 3: return renderCompleteStep();
      default: return null;
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="container mx-auto px-4 py-8">
        {/* Progress Header */}
        <div className="max-w-4xl mx-auto mb-12">
          <div className="flex items-center justify-between mb-8">
            {steps.map((step, index) => {
              const Icon = step.icon;
              return (
                <div key={step.id} className="flex items-center">
                  <div className={`flex items-center justify-center w-12 h-12 rounded-full transition-all ${
                    index <= currentStep
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-200 text-gray-400'
                  }`}>
                    {index < currentStep ? (
                      <Check className="w-6 h-6" />
                    ) : (
                      <Icon className="w-6 h-6" />
                    )}
                  </div>
                  {index < steps.length - 1 && (
                    <div className={`w-24 h-1 mx-4 transition-all ${
                      index < currentStep ? 'bg-blue-600' : 'bg-gray-200'
                    }`} />
                  )}
                </div>
              );
            })}
          </div>
          <div className="text-center">
            <h2 className="text-lg font-medium text-gray-600">
              Step {currentStep + 1} of {steps.length}
            </h2>
            <h1 className="text-2xl font-bold text-gray-900 mt-1">
              {steps[currentStep].title}
            </h1>
          </div>
        </div>

        {/* Step Content */}
        <div className="max-w-6xl mx-auto">
          <AnimatePresence mode="wait">
            {renderStepContent()}
          </AnimatePresence>
        </div>

        {/* Navigation */}
        <div className="max-w-4xl mx-auto mt-12">
          <div className="flex justify-between">
            <Button
              variant="outline"
              onClick={handlePrevious}
              disabled={currentStep === 0}
              className="flex items-center space-x-2"
            >
              <span>Previous</span>
            </Button>
            
            <div className="flex space-x-4">
              {currentStep === steps.length - 1 ? (
                <Button
                  onClick={handleComplete}
                  disabled={completeOnboardingMutation.isPending}
                  className="bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 flex items-center space-x-2"
                >
                  {completeOnboardingMutation.isPending ? (
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  ) : (
                    <>
                      <span>Complete Setup</span>
                      <Star className="w-4 h-4" />
                    </>
                  )}
                </Button>
              ) : (
                <Button
                  onClick={handleNext}
                  disabled={!canProceed()}
                  className="flex items-center space-x-2"
                >
                  <span>Next</span>
                  <ArrowRight className="w-4 h-4" />
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}