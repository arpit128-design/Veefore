import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useLocation } from 'wouter';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';
import { useWorkspaceContext } from '@/hooks/useWorkspace';
import { apiRequest } from '@/lib/queryClient';
// VeeFore logo will be text-based
import { 
  Instagram, 
  CheckCircle, 
  ArrowRight, 
  ArrowLeft,
  Rocket,
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
  PawPrint,
  Star,
  Zap,
  Globe,
  Trophy,
  ChevronDown,
  Plus,
  X,
  Calendar,
  BrainCircuit,
  Wand2,
  Eye,
  Play,
  Youtube,
  Twitter,
  Linkedin,
  Facebook,
  Monitor,
  Smartphone,
  Timer,
  BarChart3,
  MessageSquare,
  Shield,
  Crown,
  Briefcase,
  Send
} from 'lucide-react';

const niches = [
  { id: 'lifestyle', name: 'Lifestyle', icon: Heart, description: 'Daily life & wellness', category: 'Personal' },
  { id: 'fashion', name: 'Fashion', icon: Shirt, description: 'Style & trends', category: 'Creative' },
  { id: 'beauty', name: 'Beauty', icon: Sparkles, description: 'Makeup & skincare', category: 'Creative' },
  { id: 'food', name: 'Food', icon: Utensils, description: 'Recipes & dining', category: 'Lifestyle' },
  { id: 'travel', name: 'Travel', icon: Plane, description: 'Adventures & places', category: 'Lifestyle' },
  { id: 'business', name: 'Business', icon: TrendingUp, description: 'Growth & strategy', category: 'Professional' },
  { id: 'fitness', name: 'Fitness', icon: Dumbbell, description: 'Health & workouts', category: 'Personal' },
  { id: 'tech', name: 'Technology', icon: Code, description: 'Tech & innovation', category: 'Professional' },
  { id: 'education', name: 'Education', icon: GraduationCap, description: 'Learning & tutorials', category: 'Professional' },
  { id: 'entertainment', name: 'Entertainment', icon: Gamepad2, description: 'Gaming & fun content', category: 'Creative' },
  { id: 'music', name: 'Music', icon: Music, description: 'Songs & performances', category: 'Creative' },
  { id: 'automotive', name: 'Automotive', icon: Car, description: 'Cars & motorsports', category: 'Specialty' },
  { id: 'home', name: 'Home & Garden', icon: Home, description: 'Interior design & DIY', category: 'Lifestyle' },
  { id: 'shopping', name: 'Shopping', icon: ShoppingCart, description: 'Product reviews & deals', category: 'Commercial' },
  { id: 'parenting', name: 'Parenting', icon: Baby, description: 'Family & childcare', category: 'Personal' },
  { id: 'pets', name: 'Pets', icon: PawPrint, description: 'Pet care & training', category: 'Personal' },
  { id: 'photography', name: 'Photography', icon: Camera, description: 'Photos & visual art', category: 'Creative' },
  { id: 'gaming', name: 'Gaming', icon: Gamepad2, description: 'Video games & esports', category: 'Entertainment' },
  { id: 'sports', name: 'Sports', icon: Star, description: 'Athletics & competitions', category: 'Entertainment' },
  { id: 'art', name: 'Art & Design', icon: Palette, description: 'Creative arts & design', category: 'Creative' },
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

// Professional Header Component
function ProfessionalHeader() {
  return (
    <motion.div 
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md border-b border-gray-200"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <Rocket className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold text-gray-900">VeeFore</span>
          </div>
          
          <div className="flex items-center space-x-4">
            <Badge variant="secondary" className="text-blue-600 bg-blue-50">
              Setup & Onboarding
            </Badge>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

// Progress Steps Component
function ProgressSteps({ currentStep, totalSteps }: { currentStep: number; totalSteps: number }) {
  const steps = [
    { label: 'Welcome', icon: Rocket },
    { label: 'Connect', icon: Instagram },
    { label: 'Customize', icon: Palette },
    { label: 'Complete', icon: CheckCircle }
  ];

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-3xl mx-auto mb-12"
    >
      <div className="flex items-center justify-between">
        {steps.map((step, index) => {
          const Icon = step.icon;
          const isActive = index === currentStep;
          const isCompleted = index < currentStep;
          
          return (
            <div key={index} className="flex items-center">
              <div className={`flex flex-col items-center ${index < steps.length - 1 ? 'flex-1' : ''}`}>
                <motion.div 
                  className={`w-12 h-12 rounded-full flex items-center justify-center mb-2 transition-all duration-300 ${
                    isActive 
                      ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30' 
                      : isCompleted 
                        ? 'bg-green-600 text-white' 
                        : 'bg-gray-100 text-gray-400'
                  }`}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Icon className="w-5 h-5" />
                </motion.div>
                <span className={`text-sm font-medium ${
                  isActive || isCompleted ? 'text-gray-900' : 'text-gray-500'
                }`}>
                  {step.label}
                </span>
              </div>
              
              {index < steps.length - 1 && (
                <div className="flex-1 mx-4">
                  <div className={`h-0.5 transition-all duration-300 ${
                    isCompleted ? 'bg-green-600' : 'bg-gray-200'
                  }`} />
                </div>
              )}
            </div>
          );
        })}
      </div>
    </motion.div>
  );
}

export default function OnboardingPremium() {
  const [currentStep, setCurrentStep] = useState(() => {
    const savedStep = localStorage.getItem('onboarding_current_step');
    return savedStep ? parseInt(savedStep) : 0;
  });
  
  const [, setLocation] = useLocation();
  const [nicheDropdownOpen, setNicheDropdownOpen] = useState(false);
  const [preferences, setPreferences] = useState({
    selectedNiches: [] as string[],
    contentTypes: [] as string[],
    tone: '',
    businessName: '',
    description: ''
  });
  
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { user } = useAuth();
  const { currentWorkspace } = useWorkspaceContext();

  const { data: socialAccounts = [] } = useQuery({
    queryKey: ['/api/social-accounts'],
    enabled: currentStep === 1
  });

  const { data: workspaces = [] } = useQuery({
    queryKey: ['/api/workspaces'],
    enabled: !!user
  });

  // Check if user is returning from Instagram OAuth
  useEffect(() => {
    const returningFromOAuth = localStorage.getItem('onboarding_returning_from_oauth');
    if (returningFromOAuth === 'true') {
      localStorage.removeItem('onboarding_returning_from_oauth');
      localStorage.removeItem('onboarding_current_step');
      
      if (currentStep === 1) {
        setTimeout(() => {
          setCurrentStep(2);
          toast({
            title: 'Instagram Connected!',
            description: 'Your Instagram account has been successfully connected.'
          });
        }, 1000);
      }
    }
  }, [currentStep, toast]);

  // Instagram connection mutation
  const connectInstagramMutation = useMutation({
    mutationFn: async () => {
      const workspaceId = currentWorkspace?.id || workspaces[0]?.id;
      
      if (!workspaceId) {
        throw new Error('No workspace available. Please refresh the page and try again.');
      }
      
      let token = localStorage.getItem('veefore_auth_token');
      
      if (user && token) {
        if (user.firebaseUid === 'demo-user') {
          token = 'demo-token';
          localStorage.setItem('veefore_auth_token', token);
        } else {
          try {
            const { auth } = await import('@/lib/firebase');
            if (auth.currentUser) {
              const freshToken = await auth.currentUser.getIdToken(true);
              if (freshToken) {
                token = freshToken;
                localStorage.setItem('veefore_auth_token', freshToken);
              }
            }
          } catch (error) {
            console.error('Failed to get fresh token:', error);
          }
        }
      }
      
      if (!token) {
        throw new Error('Authentication token not found. Please refresh the page and try again.');
      }
      
      const response = await fetch(`/api/instagram/auth?workspaceId=${workspaceId}&source=onboarding`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        credentials: 'include'
      });
      
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`HTTP ${response.status}: ${errorText}`);
      }
      
      const data = await response.json();
      
      if (data.authUrl) {
        localStorage.setItem('onboarding_current_step', currentStep.toString());
        localStorage.setItem('onboarding_returning_from_oauth', 'true');
        localStorage.setItem('oauth_source', 'onboarding');
        window.location.href = data.authUrl;
      } else {
        throw new Error('Failed to get Instagram authorization URL');
      }
    },
    onError: (error: any) => {
      toast({
        title: "Connection Failed",
        description: error.message || "Failed to connect Instagram account",
        variant: "destructive"
      });
    }
  });

  const completeOnboardingMutation = useMutation({
    mutationFn: async (data: any) => {
      return apiRequest('POST', '/api/user/complete-onboarding', data);
    },
    onSuccess: () => {
      localStorage.removeItem('onboarding_current_step');
      localStorage.setItem('onboarding_just_completed', 'true');
      toast({
        title: "Welcome to VeeFore!",
        description: "Your account has been set up successfully."
      });
      queryClient.invalidateQueries({ queryKey: ['/api/user'] });
      setLocation('/dashboard');
    },
    onError: (error: any) => {
      toast({
        title: "Setup Failed",
        description: error.message || "Failed to complete setup",
        variant: "destructive"
      });
    }
  });

  const handleNext = () => {
    if (currentStep < 3) {
      setCurrentStep(currentStep + 1);
    } else {
      completeOnboardingMutation.mutate(preferences);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleNicheToggle = (nicheId: string) => {
    setPreferences(prev => ({
      ...prev,
      selectedNiches: prev.selectedNiches.includes(nicheId)
        ? prev.selectedNiches.filter(id => id !== nicheId)
        : [...prev.selectedNiches, nicheId]
    }));
  };

  const handleContentTypeToggle = (typeId: string) => {
    setPreferences(prev => ({
      ...prev,
      contentTypes: prev.contentTypes.includes(typeId)
        ? prev.contentTypes.filter(id => id !== typeId)
        : [...prev.contentTypes, typeId]
    }));
  };

  const renderWelcomeStep = () => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="text-center space-y-8"
    >
      <div className="space-y-6">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="w-24 h-24 mx-auto bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg"
        >
          <Rocket className="w-12 h-12 text-white" />
        </motion.div>
        
        <div className="space-y-4">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900">
            Welcome to VeeFore
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Your AI-powered social media management platform. Let's get you set up in just a few steps.
          </p>
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
        {[
          { icon: BrainCircuit, title: "15+ AI Tools", description: "Content creation, thumbnails, analytics" },
          { icon: BarChart3, title: "Smart Analytics", description: "Track performance across all platforms" },
          { icon: Timer, title: "Auto Scheduling", description: "Publish content at optimal times" }
        ].map((feature, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 + index * 0.1 }}
            className="bg-white rounded-xl border border-gray-200 p-6 hover:border-blue-200 hover:shadow-lg transition-all duration-300"
          >
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
              <feature.icon className="w-6 h-6 text-blue-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">{feature.title}</h3>
            <p className="text-gray-600">{feature.description}</p>
          </motion.div>
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="flex justify-center"
      >
        <Button
          onClick={handleNext}
          size="lg"
          className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-3 text-lg font-medium shadow-lg"
        >
          Get Started
          <ArrowRight className="w-5 h-5 ml-2" />
        </Button>
      </motion.div>
    </motion.div>
  );

  const renderConnectStep = () => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="text-center space-y-8"
    >
      <div className="space-y-4">
        <h2 className="text-3xl font-bold text-gray-900">Connect Your Instagram</h2>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Connect your Instagram Business account to start creating and managing content with AI.
        </p>
      </div>

      {Array.isArray(socialAccounts) && socialAccounts.length > 0 ? (
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-green-50 border border-green-200 rounded-xl p-6 max-w-md mx-auto"
        >
          <div className="flex items-center justify-center text-green-700 mb-3">
            <CheckCircle className="w-8 h-8 mr-3" />
            <span className="text-xl font-semibold">Instagram Connected!</span>
          </div>
          <p className="text-green-600">
            Account: @{socialAccounts[0]?.username}
          </p>
        </motion.div>
      ) : (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-md mx-auto"
        >
          <Card className="border-2 border-gray-200 hover:border-blue-200 transition-all duration-300">
            <CardContent className="p-6">
              <div className="flex items-center space-x-4 mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-pink-500 to-orange-500 rounded-xl flex items-center justify-center">
                  <Instagram className="w-6 h-6 text-white" />
                </div>
                <div className="text-left">
                  <h3 className="text-lg font-semibold text-gray-900">Instagram Business</h3>
                  <p className="text-gray-600">Connect your business account</p>
                </div>
              </div>
              
              <Button
                onClick={() => connectInstagramMutation.mutate()}
                disabled={connectInstagramMutation.isPending}
                className="w-full bg-gradient-to-r from-pink-500 to-orange-500 hover:from-pink-600 hover:to-orange-600 text-white"
              >
                {connectInstagramMutation.isPending ? 'Connecting...' : 'Connect Instagram'}
              </Button>
            </CardContent>
          </Card>
        </motion.div>
      )}

      <div className="flex justify-center space-x-4">
        <Button
          variant="outline"
          onClick={handlePrevious}
          className="px-6"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Previous
        </Button>
        <Button
          onClick={handleNext}
          className="bg-blue-600 hover:bg-blue-700 text-white px-6"
        >
          {socialAccounts.length > 0 ? 'Continue' : 'Skip for now'}
          <ArrowRight className="w-4 h-4 ml-2" />
        </Button>
      </div>
    </motion.div>
  );

  const renderCustomizeStep = () => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-8"
    >
      <div className="text-center space-y-4">
        <h2 className="text-3xl font-bold text-gray-900">Customize Your Experience</h2>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Tell us about your brand so we can personalize AI-generated content for you.
        </p>
      </div>

      <div className="max-w-2xl mx-auto space-y-8">
        {/* Business Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Building className="w-5 h-5 mr-2" />
              Business Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="businessName">Business Name</Label>
              <Input
                id="businessName"
                value={preferences.businessName}
                onChange={(e) => setPreferences(prev => ({ ...prev, businessName: e.target.value }))}
                placeholder="Enter your business name"
              />
            </div>
            <div>
              <Label htmlFor="description">Description</Label>
              <textarea
                id="description"
                value={preferences.description}
                onChange={(e) => setPreferences(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Brief description of your business or brand"
                className="w-full min-h-[80px] px-3 py-2 border border-gray-300 rounded-md resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </CardContent>
        </Card>

        {/* Niche Selection */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Target className="w-5 h-5 mr-2" />
              Your Niche
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {niches.slice(0, 12).map((niche) => {
                const Icon = niche.icon;
                const isSelected = preferences.selectedNiches.includes(niche.id);
                
                return (
                  <motion.div
                    key={niche.id}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleNicheToggle(niche.id)}
                    className={`p-3 rounded-lg border-2 cursor-pointer transition-all duration-200 ${
                      isSelected 
                        ? 'border-blue-500 bg-blue-50' 
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="flex items-center space-x-2">
                      <Icon className={`w-4 h-4 ${isSelected ? 'text-blue-600' : 'text-gray-500'}`} />
                      <span className={`text-sm font-medium ${isSelected ? 'text-blue-900' : 'text-gray-700'}`}>
                        {niche.name}
                      </span>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Content Type Selection */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Camera className="w-5 h-5 mr-2" />
              Content Types
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-3">
              {contentTypes.map((type) => {
                const Icon = type.icon;
                const isSelected = preferences.contentTypes.includes(type.id);
                
                return (
                  <motion.div
                    key={type.id}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleContentTypeToggle(type.id)}
                    className={`p-4 rounded-lg border-2 cursor-pointer transition-all duration-200 ${
                      isSelected 
                        ? 'border-blue-500 bg-blue-50' 
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <Icon className={`w-5 h-5 ${isSelected ? 'text-blue-600' : 'text-gray-500'}`} />
                      <div>
                        <div className={`font-medium ${isSelected ? 'text-blue-900' : 'text-gray-700'}`}>
                          {type.name}
                        </div>
                        <div className="text-sm text-gray-500">{type.description}</div>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Tone Selection */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <MessageSquare className="w-5 h-5 mr-2" />
              Brand Tone
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {tones.map((tone) => (
                <motion.div
                  key={tone.id}
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                  onClick={() => setPreferences(prev => ({ ...prev, tone: tone.id }))}
                  className={`p-3 rounded-lg border-2 cursor-pointer transition-all duration-200 ${
                    preferences.tone === tone.id
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <div className={`font-medium ${preferences.tone === tone.id ? 'text-blue-900' : 'text-gray-700'}`}>
                        {tone.name}
                      </div>
                      <div className="text-sm text-gray-500">{tone.description}</div>
                    </div>
                    {preferences.tone === tone.id && (
                      <CheckCircle className="w-5 h-5 text-blue-600" />
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="flex justify-center space-x-4">
        <Button
          variant="outline"
          onClick={handlePrevious}
          className="px-6"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Previous
        </Button>
        <Button
          onClick={handleNext}
          className="bg-blue-600 hover:bg-blue-700 text-white px-6"
        >
          Continue
          <ArrowRight className="w-4 h-4 ml-2" />
        </Button>
      </div>
    </motion.div>
  );

  const renderCompleteStep = () => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="text-center space-y-8"
    >
      <div className="space-y-6">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="w-24 h-24 mx-auto bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl flex items-center justify-center shadow-lg"
        >
          <CheckCircle className="w-12 h-12 text-white" />
        </motion.div>
        
        <div className="space-y-4">
          <h2 className="text-3xl font-bold text-gray-900">You're All Set!</h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Your VeeFore account is ready. Let's start creating amazing content with AI.
          </p>
        </div>
      </div>

      <div className="bg-gray-50 rounded-xl p-6 max-w-2xl mx-auto">
        <h3 className="text-xl font-semibold text-gray-900 mb-4">What's Next?</h3>
        <div className="grid md:grid-cols-2 gap-4">
          {[
            { icon: BrainCircuit, title: "AI Content Generator", description: "Create engaging posts automatically" },
            { icon: Camera, title: "AI Image Generator", description: "Generate stunning visuals" },
            { icon: Play, title: "AI Thumbnail Maker", description: "Create viral YouTube thumbnails" },
            { icon: BarChart3, title: "Analytics Dashboard", description: "Track your performance" }
          ].map((feature, index) => (
            <div key={index} className="flex items-start space-x-3">
              <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0 mt-1">
                <feature.icon className="w-4 h-4 text-blue-600" />
              </div>
              <div>
                <h4 className="font-medium text-gray-900">{feature.title}</h4>
                <p className="text-sm text-gray-600">{feature.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="flex justify-center space-x-4">
        <Button
          variant="outline"
          onClick={handlePrevious}
          className="px-6"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Previous
        </Button>
        <Button
          onClick={handleNext}
          disabled={completeOnboardingMutation.isPending}
          className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-3 text-lg font-medium shadow-lg"
        >
          {completeOnboardingMutation.isPending ? 'Setting up...' : 'Enter VeeFore'}
          <Send className="w-5 h-5 ml-2" />
        </Button>
      </div>
    </motion.div>
  );

  const renderCurrentStep = () => {
    switch (currentStep) {
      case 0:
        return renderWelcomeStep();
      case 1:
        return renderConnectStep();
      case 2:
        return renderCustomizeStep();
      case 3:
        return renderCompleteStep();
      default:
        return renderWelcomeStep();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
      <ProfessionalHeader />
      
      <div className="pt-24 pb-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <ProgressSteps currentStep={currentStep} totalSteps={4} />
          
          <AnimatePresence mode="wait">
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              transition={{ duration: 0.3 }}
            >
              {renderCurrentStep()}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}