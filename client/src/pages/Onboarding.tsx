import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useLocation } from 'wouter';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { apiRequest } from '@/lib/queryClient';
import { 
  Rocket, 
  Instagram, 
  CheckCircle, 
  ArrowRight, 
  ArrowLeft,
  Sparkles,
  Target,
  TrendingUp,
  Palette,
  Building,
  Camera,
  Video,
  FileText,
  Users,
  Heart,
  Gamepad2,
  Music,
  Plane,
  GraduationCap,
  Utensils,
  Shirt,
  Dumbbell,
  Code,
  Car,
  Home,
  ShoppingCart,
  Baby,
  PawPrint
} from 'lucide-react';

const niches = [
  { id: 'lifestyle', name: 'Lifestyle', icon: Heart, description: 'Daily life & personal stories' },
  { id: 'fashion', name: 'Fashion', icon: Shirt, description: 'Style & trends' },
  { id: 'beauty', name: 'Beauty', icon: Sparkles, description: 'Makeup & skincare' },
  { id: 'food', name: 'Food', icon: Utensils, description: 'Recipes & dining' },
  { id: 'travel', name: 'Travel', icon: Plane, description: 'Adventures & destinations' },
  { id: 'business', name: 'Business', icon: TrendingUp, description: 'Entrepreneurship & tips' },
  { id: 'education', name: 'Education', icon: GraduationCap, description: 'Learning & tutorials' },
  { id: 'entertainment', name: 'Entertainment', icon: Gamepad2, description: 'Gaming & fun content' },
  { id: 'music', name: 'Music', icon: Music, description: 'Songs & performances' },
  { id: 'tech', name: 'Technology', icon: Code, description: 'Tech reviews & tutorials' },
  { id: 'fitness', name: 'Fitness', icon: Dumbbell, description: 'Health & workouts' },
  { id: 'automotive', name: 'Automotive', icon: Car, description: 'Cars & motorsports' },
  { id: 'home', name: 'Home & Garden', icon: Home, description: 'Interior design & DIY' },
  { id: 'shopping', name: 'Shopping', icon: ShoppingCart, description: 'Product reviews & deals' },
  { id: 'parenting', name: 'Parenting', icon: Baby, description: 'Family & childcare' },
  { id: 'pets', name: 'Pets', icon: PawPrint, description: 'Pet care & training' },
];

const contentTypes = [
  { id: 'photos', name: 'Photos', icon: Camera, description: 'High-quality images' },
  { id: 'videos', name: 'Videos', icon: Video, description: 'Short-form video content' },
  { id: 'stories', name: 'Stories', icon: Users, description: 'Behind-the-scenes content' },
  { id: 'captions', name: 'Captions', icon: FileText, description: 'Engaging text content' }
];

const tones = [
  { id: 'professional', name: 'Professional', description: 'Formal and business-oriented' },
  { id: 'casual', name: 'Casual', description: 'Friendly and approachable' },
  { id: 'humorous', name: 'Humorous', description: 'Fun and entertaining' },
  { id: 'inspirational', name: 'Inspirational', description: 'Motivating and uplifting' },
  { id: 'educational', name: 'Educational', description: 'Informative and teaching' }
];

export default function Onboarding() {
  const [currentStep, setCurrentStep] = useState(0);
  const [, setLocation] = useLocation();
  const [preferences, setPreferences] = useState({
    selectedNiches: [] as string[],
    contentTypes: [] as string[],
    tone: '',
    businessName: '',
    description: ''
  });
  
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: socialAccounts = [] } = useQuery({
    queryKey: ['/api/social-accounts'],
    enabled: currentStep === 1
  });

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
        description: 'Your onboarding is complete. Redirecting to dashboard...'
      });
      setTimeout(() => setLocation('/dashboard'), 2000);
    },
    onError: () => {
      toast({
        title: 'Error',
        description: 'Failed to complete onboarding. Please try again.',
        variant: 'destructive'
      });
    }
  });

  const handleNext = () => {
    if (currentStep < 3) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
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
      case 1: return Array.isArray(socialAccounts) && socialAccounts.length > 0; // Must connect at least one account
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
          <p className="text-xl text-gray-600 mt-2">
            AI-Powered Social Media Management
          </p>
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
        <Card className="text-center">
          <CardContent className="pt-6">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-4">
              <Sparkles className="w-6 h-6 text-blue-600" />
            </div>
            <h3 className="font-semibold mb-2">AI Content Creation</h3>
            <p className="text-sm text-gray-600">
              Generate engaging posts, captions, and media with AI
            </p>
          </CardContent>
        </Card>

        <Card className="text-center">
          <CardContent className="pt-6">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-4">
              <Target className="w-6 h-6 text-green-600" />
            </div>
            <h3 className="font-semibold mb-2">Smart Scheduling</h3>
            <p className="text-sm text-gray-600">
              Schedule posts at optimal times for maximum engagement
            </p>
          </CardContent>
        </Card>

        <Card className="text-center">
          <CardContent className="pt-6">
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-4">
              <TrendingUp className="w-6 h-6 text-purple-600" />
            </div>
            <h3 className="font-semibold mb-2">Analytics & Insights</h3>
            <p className="text-sm text-gray-600">
              Track performance and optimize your strategy
            </p>
          </CardContent>
        </Card>
      </div>

      <p className="text-gray-600 max-w-2xl mx-auto">
        Let's get you set up in just a few simple steps. We'll help you connect your social media accounts, 
        set your preferences, and start creating amazing content with AI.
      </p>
    </motion.div>
  );

  const renderSocialStep = () => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="text-center space-y-8"
    >
      <div className="space-y-4">
        <div className="mx-auto w-16 h-16 bg-gradient-to-br from-pink-500 to-orange-500 rounded-full flex items-center justify-center">
          <Instagram className="w-8 h-8 text-white" />
        </div>
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Connect Your Social Media
          </h1>
          <p className="text-lg text-gray-600">
            Link your Instagram account to start creating amazing content
          </p>
        </div>
      </div>

      {Array.isArray(socialAccounts) && socialAccounts.length > 0 && (
        <div className="mb-6">
          <div className="flex items-center justify-center text-green-600 mb-2">
            <CheckCircle className="w-6 h-6 mr-2" />
            <span className="font-medium">Instagram Connected Successfully!</span>
          </div>
          <p className="text-sm text-gray-600">
            Account: @{socialAccounts[0]?.username}
          </p>
        </div>
      )}

      <Card className="max-w-md mx-auto">
        <CardContent className="pt-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div className="flex items-center space-x-3">
                <Instagram className="w-6 h-6 text-pink-600" />
                <div>
                  <div className="font-medium">Instagram</div>
                  <div className="text-sm text-gray-600">Connect your Instagram Business account</div>
                </div>
              </div>
              <Button 
                onClick={() => setLocation('/integrations')}
                variant="outline"
                size="sm"
              >
                Connect
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <p className="text-sm text-gray-600 max-w-md mx-auto">
        You can connect additional platforms later in the Integrations section.
      </p>
    </motion.div>
  );

  const renderPreferencesStep = () => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-8"
    >
      <div className="text-center space-y-4">
        <div className="mx-auto w-16 h-16 bg-gradient-to-br from-purple-500 to-blue-500 rounded-full flex items-center justify-center">
          <Palette className="w-8 h-8 text-white" />
        </div>
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Personalize Your Experience
          </h1>
          <p className="text-lg text-gray-600">
            Help us create better content by sharing your preferences
          </p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto space-y-8">
        {/* Business Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Building className="w-5 h-5" />
              <span>Business Information</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="businessName">Business/Brand Name *</Label>
                <Input
                  id="businessName"
                  value={preferences.businessName}
                  onChange={(e) => setPreferences(prev => ({ ...prev, businessName: e.target.value }))}
                  placeholder="Enter your business name"
                />
              </div>
              <div>
                <Label htmlFor="description">Description</Label>
                <Input
                  id="description"
                  value={preferences.description}
                  onChange={(e) => setPreferences(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Brief description of your business"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Niche Selection */}
        <Card>
          <CardHeader>
            <CardTitle>Select Your Niches *</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
              {niches.map((niche) => {
                const Icon = niche.icon;
                const isSelected = preferences.selectedNiches.includes(niche.id);
                return (
                  <div
                    key={niche.id}
                    onClick={() => {
                      setPreferences(prev => ({
                        ...prev,
                        selectedNiches: isSelected
                          ? prev.selectedNiches.filter(id => id !== niche.id)
                          : [...prev.selectedNiches, niche.id]
                      }));
                    }}
                    className={`p-3 rounded-lg border cursor-pointer transition-all hover:shadow-md ${
                      isSelected 
                        ? 'border-blue-500 bg-blue-50 text-blue-700' 
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <Icon className={`w-5 h-5 mb-2 ${isSelected ? 'text-blue-600' : 'text-gray-600'}`} />
                    <div className="text-sm font-medium">{niche.name}</div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Brand Tone */}
        <Card>
          <CardHeader>
            <CardTitle>Brand Tone *</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-3">
              {tones.map((tone) => (
                <div
                  key={tone.id}
                  onClick={() => setPreferences(prev => ({ ...prev, tone: tone.id }))}
                  className={`p-4 rounded-lg border cursor-pointer transition-all hover:shadow-md ${
                    preferences.tone === tone.id
                      ? 'border-purple-500 bg-purple-50 text-purple-700'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="font-medium">{tone.name}</div>
                  <div className="text-sm text-gray-600">{tone.description}</div>
                </div>
              ))}
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
        <div className="mx-auto w-24 h-24 bg-gradient-to-br from-green-500 to-blue-500 rounded-full flex items-center justify-center">
          <CheckCircle className="w-12 h-12 text-white" />
        </div>
        <div>
          <h1 className="text-4xl font-bold text-gray-900">
            You're All Set!
          </h1>
          <p className="text-xl text-gray-600">
            Welcome to the future of social media management
          </p>
        </div>
      </div>

      <div className="max-w-2xl mx-auto space-y-6">
        <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-6">
          <h3 className="font-semibold text-lg mb-4">What's Next?</h3>
          <div className="text-left space-y-3">
            <div className="flex items-start space-x-3">
              <CheckCircle className="w-5 h-5 text-green-600 mt-0.5" />
              <div>
                <div className="font-medium">Create Your First Content</div>
                <div className="text-sm text-gray-600">Use our AI-powered Content Studio to generate posts</div>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <CheckCircle className="w-5 h-5 text-green-600 mt-0.5" />
              <div>
                <div className="font-medium">Schedule Posts</div>
                <div className="text-sm text-gray-600">Plan your content calendar for optimal engagement</div>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <CheckCircle className="w-5 h-5 text-green-600 mt-0.5" />
              <div>
                <div className="font-medium">Track Performance</div>
                <div className="text-sm text-gray-600">Monitor your analytics and grow your audience</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );

  const steps = [
    { title: 'Welcome', component: renderWelcomeStep },
    { title: 'Connect Social', component: renderSocialStep },
    { title: 'Preferences', component: renderPreferencesStep },
    { title: 'Complete', component: renderCompleteStep }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="container mx-auto px-4 py-8">
        {/* Progress Bar */}
        <div className="max-w-2xl mx-auto mb-8">
          <div className="flex items-center justify-between mb-4">
            {steps.map((step, index) => (
              <div key={index} className="flex items-center">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                    index <= currentStep
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-200 text-gray-600'
                  }`}
                >
                  {index + 1}
                </div>
                {index < steps.length - 1 && (
                  <div
                    className={`w-16 md:w-24 h-1 mx-2 ${
                      index < currentStep ? 'bg-blue-600' : 'bg-gray-200'
                    }`}
                  />
                )}
              </div>
            ))}
          </div>
          <div className="text-center">
            <div className="text-sm text-gray-600">
              Step {currentStep + 1} of {steps.length}: {steps[currentStep].title}
            </div>
          </div>
        </div>

        {/* Step Content */}
        <div className="max-w-5xl mx-auto">
          {steps[currentStep].component()}
        </div>

        {/* Navigation */}
        <div className="max-w-2xl mx-auto mt-12 flex justify-between">
          <Button
            variant="outline"
            onClick={handleBack}
            disabled={currentStep === 0}
            className="flex items-center space-x-2"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back</span>
          </Button>

          {currentStep < 3 ? (
            <Button
              onClick={handleNext}
              disabled={!canProceed()}
              className="flex items-center space-x-2"
            >
              <span>Next</span>
              <ArrowRight className="w-4 h-4" />
            </Button>
          ) : (
            <Button
              onClick={handleComplete}
              disabled={completeOnboardingMutation.isPending}
              className="flex items-center space-x-2"
            >
              <span>
                {completeOnboardingMutation.isPending ? 'Completing...' : 'Complete Setup'}
              </span>
              <ArrowRight className="w-4 h-4" />
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}