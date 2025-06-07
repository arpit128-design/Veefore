import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useLocation } from 'wouter';
import { apiRequest } from '@/lib/queryClient';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { SpaceBackground } from '@/components/layout/SpaceBackground';
import { 
  Rocket, 
  Sparkles, 
  Target, 
  TrendingUp, 
  Building, 
  Instagram, 
  CheckCircle,
  Zap,
  ChevronRight,
  Star
} from 'lucide-react';

interface UserPreferences {
  businessName: string;
  description: string;
  niches: string[];
  brandTone: string;
}

export default function NewOnboarding() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [currentStep, setCurrentStep] = useState(0);
  const [preferences, setPreferences] = useState<UserPreferences>({
    businessName: '',
    description: '',
    niches: [],
    brandTone: ''
  });

  // Available niches
  const niches = [
    'Technology', 'Fashion', 'Food & Drink', 'Travel', 'Fitness',
    'Beauty', 'Business', 'Education', 'Entertainment', 'Health',
    'Lifestyle', 'Photography', 'Sports', 'Art & Design', 'Music'
  ];

  // Brand tone options
  const brandTones = [
    { id: 'professional', label: 'Professional', description: 'Authoritative and trustworthy' },
    { id: 'friendly', label: 'Friendly', description: 'Warm and approachable' },
    { id: 'playful', label: 'Playful', description: 'Fun and creative' },
    { id: 'sophisticated', label: 'Sophisticated', description: 'Elegant and refined' },
    { id: 'energetic', label: 'Energetic', description: 'Dynamic and exciting' }
  ];

  // User data query
  const { data: user } = useQuery({
    queryKey: ['/api/user'],
    refetchOnWindowFocus: false
  });

  // Social accounts query
  const { data: socialAccounts } = useQuery({
    queryKey: ['/api/social-accounts'],
    refetchOnWindowFocus: false
  });

  // Connect Instagram mutation
  const connectInstagramMutation = useMutation({
    mutationFn: async () => {
      const response = await apiRequest('POST', '/api/connect-instagram');
      return response.json();
    },
    onSuccess: (data) => {
      if (data.authUrl) {
        window.location.href = data.authUrl;
      }
    },
    onError: (error: any) => {
      toast({
        title: "Connection Failed",
        description: error.message || "Failed to connect Instagram",
        variant: "destructive",
      });
    }
  });

  // Save preferences mutation
  const savePreferencesMutation = useMutation({
    mutationFn: (data: UserPreferences) => apiRequest('POST', '/api/user/preferences', data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/user'] });
      toast({
        title: "Preferences Saved",
        description: "Your preferences have been saved successfully!",
      });
    }
  });

  // Complete onboarding mutation
  const completeOnboardingMutation = useMutation({
    mutationFn: () => apiRequest('POST', '/api/user/complete-onboarding'),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/user'] });
      setLocation('/dashboard');
    }
  });

  const handleNext = () => {
    if (currentStep < 3) {
      setCurrentStep(currentStep + 1);
    } else {
      handleComplete();
    }
  };

  const handleComplete = async () => {
    await savePreferencesMutation.mutateAsync(preferences);
    await completeOnboardingMutation.mutateAsync();
  };

  const isStepValid = () => {
    switch (currentStep) {
      case 0: return preferences.businessName.trim().length > 0;
      case 1: return preferences.niches.length > 0;
      case 2: return preferences.brandTone.length > 0;
      case 3: return Array.isArray(socialAccounts) && socialAccounts.length > 0;
      default: return false;
    }
  };

  const steps = [
    {
      title: "Brand Identity",
      description: "Tell us about your brand",
      icon: Building,
      color: "from-cyan-500 to-blue-500"
    },
    {
      title: "Content Focus",
      description: "Choose your niches",
      icon: Target,
      color: "from-blue-500 to-purple-500"
    },
    {
      title: "Brand Voice",
      description: "Define your tone",
      icon: Zap,
      color: "from-purple-500 to-pink-500"
    },
    {
      title: "Connect Accounts",
      description: "Link your social media",
      icon: Instagram,
      color: "from-pink-500 to-orange-500"
    }
  ];

  return (
    <div className="min-h-screen relative overflow-hidden bg-slate-950">
      <SpaceBackground />
      
      {/* Main Content */}
      <div className="relative z-10 min-h-screen flex flex-col items-center justify-center p-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <motion.div
            className="w-20 h-20 bg-gradient-to-br from-cyan-400 to-yellow-400 rounded-2xl flex items-center justify-center mx-auto mb-6"
            animate={{ 
              boxShadow: [
                "0 0 30px rgba(34, 211, 238, 0.5)",
                "0 0 50px rgba(34, 211, 238, 0.8)",
                "0 0 30px rgba(34, 211, 238, 0.5)"
              ]
            }}
            transition={{ duration: 3, repeat: Infinity }}
          >
            <Rocket className="w-10 h-10 text-white" />
          </motion.div>
          
          <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-cyan-400 via-yellow-400 to-cyan-400 bg-clip-text text-transparent mb-4">
            Welcome to VeeFore
          </h1>
          <p className="text-xl text-slate-300 font-light">
            Let's set up your cosmic content creation journey
          </p>
        </motion.div>

        {/* Progress Indicator */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex items-center justify-center mb-12 space-x-4"
        >
          {steps.map((step, index) => (
            <div key={index} className="flex items-center">
              <motion.div
                className={`w-12 h-12 rounded-full flex items-center justify-center transition-all duration-500 ${
                  index <= currentStep 
                    ? `bg-gradient-to-r ${step.color}` 
                    : 'bg-slate-800 border-2 border-slate-700'
                }`}
                animate={index === currentStep ? { scale: [1, 1.1, 1] } : { scale: 1 }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <step.icon className="w-6 h-6 text-white" />
              </motion.div>
              {index < steps.length - 1 && (
                <div className={`w-8 h-1 transition-all duration-500 ${
                  index < currentStep ? 'bg-cyan-400' : 'bg-slate-700'
                }`} />
              )}
            </div>
          ))}
        </motion.div>

        {/* Step Content */}
        <div className="w-full max-w-2xl">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              transition={{ duration: 0.5 }}
              className="bg-slate-900/50 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-8 shadow-2xl"
            >
              {/* Step 0: Brand Identity */}
              {currentStep === 0 && (
                <div className="space-y-6">
                  <div className="text-center mb-8">
                    <h2 className="text-3xl font-bold bg-gradient-to-r from-cyan-400 to-yellow-400 bg-clip-text text-transparent mb-3">
                      Brand Identity
                    </h2>
                    <p className="text-slate-300">Tell us about your brand to personalize your experience</p>
                  </div>
                  
                  <div className="space-y-6">
                    <div>
                      <Label className="text-slate-200 font-medium mb-3 block">
                        Business/Brand Name *
                      </Label>
                      <Input
                        value={preferences.businessName}
                        onChange={(e) => setPreferences(prev => ({ ...prev, businessName: e.target.value }))}
                        placeholder="Enter your business name"
                        className="bg-slate-800/50 border-slate-600/50 text-white placeholder:text-slate-400 focus:border-cyan-400/50 focus:ring-cyan-400/20 h-12 text-lg"
                      />
                    </div>
                    
                    <div>
                      <Label className="text-slate-200 font-medium mb-3 block">
                        Brand Description
                      </Label>
                      <Input
                        value={preferences.description}
                        onChange={(e) => setPreferences(prev => ({ ...prev, description: e.target.value }))}
                        placeholder="What makes your brand unique?"
                        className="bg-slate-800/50 border-slate-600/50 text-white placeholder:text-slate-400 focus:border-cyan-400/50 focus:ring-cyan-400/20 h-12 text-lg"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Step 1: Content Niches */}
              {currentStep === 1 && (
                <div className="space-y-6">
                  <div className="text-center mb-8">
                    <h2 className="text-3xl font-bold bg-gradient-to-r from-cyan-400 to-yellow-400 bg-clip-text text-transparent mb-3">
                      Content Focus
                    </h2>
                    <p className="text-slate-300">Choose niches that align with your brand</p>
                  </div>
                  
                  <div className="grid grid-cols-3 md:grid-cols-5 gap-3">
                    {niches.map((niche) => (
                      <motion.button
                        key={niche}
                        onClick={() => setPreferences(prev => ({
                          ...prev,
                          niches: prev.niches.includes(niche)
                            ? prev.niches.filter(n => n !== niche)
                            : [...prev.niches, niche]
                        }))}
                        className={`p-3 rounded-xl text-sm font-medium transition-all duration-300 ${
                          preferences.niches.includes(niche)
                            ? 'bg-gradient-to-r from-cyan-500 to-yellow-400 text-white shadow-lg'
                            : 'bg-slate-800/50 text-slate-300 hover:bg-slate-700/50 border border-slate-600/50'
                        }`}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        {niche}
                      </motion.button>
                    ))}
                  </div>
                </div>
              )}

              {/* Step 2: Brand Tone */}
              {currentStep === 2 && (
                <div className="space-y-6">
                  <div className="text-center mb-8">
                    <h2 className="text-3xl font-bold bg-gradient-to-r from-cyan-400 to-yellow-400 bg-clip-text text-transparent mb-3">
                      Brand Voice
                    </h2>
                    <p className="text-slate-300">How should your content sound?</p>
                  </div>
                  
                  <div className="space-y-4">
                    {brandTones.map((tone) => (
                      <motion.button
                        key={tone.id}
                        onClick={() => setPreferences(prev => ({ ...prev, brandTone: tone.id }))}
                        className={`w-full p-4 rounded-xl text-left transition-all duration-300 ${
                          preferences.brandTone === tone.id
                            ? 'bg-gradient-to-r from-cyan-500/20 to-yellow-400/20 border-2 border-cyan-400/50'
                            : 'bg-slate-800/50 border border-slate-600/50 hover:bg-slate-700/50'
                        }`}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <div className="flex items-center justify-between">
                          <div>
                            <h3 className="text-white font-semibold text-lg">{tone.label}</h3>
                            <p className="text-slate-400 text-sm">{tone.description}</p>
                          </div>
                          {preferences.brandTone === tone.id && (
                            <CheckCircle className="w-6 h-6 text-cyan-400" />
                          )}
                        </div>
                      </motion.button>
                    ))}
                  </div>
                </div>
              )}

              {/* Step 3: Connect Accounts */}
              {currentStep === 3 && (
                <div className="space-y-6">
                  <div className="text-center mb-8">
                    <h2 className="text-3xl font-bold bg-gradient-to-r from-cyan-400 to-yellow-400 bg-clip-text text-transparent mb-3">
                      Connect Accounts
                    </h2>
                    <p className="text-slate-300">Link your Instagram to start creating amazing content</p>
                  </div>

                  {/* Success State */}
                  {Array.isArray(socialAccounts) && socialAccounts.length > 0 && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="bg-green-500/20 backdrop-blur-md rounded-xl p-6 border border-green-400/30 text-center"
                    >
                      <CheckCircle className="w-12 h-12 text-green-400 mx-auto mb-4" />
                      <h3 className="text-xl font-bold text-green-300 mb-2">Instagram Connected!</h3>
                      <p className="text-green-200">Account: @{socialAccounts[0]?.username}</p>
                    </motion.div>
                  )}

                  {/* Instagram Connection */}
                  <motion.div
                    className="bg-slate-800/50 backdrop-blur-lg border border-slate-600/50 rounded-xl p-6"
                    whileHover={{ scale: 1.02 }}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 bg-gradient-to-br from-pink-500 to-orange-500 rounded-xl flex items-center justify-center">
                          <Instagram className="w-6 h-6 text-white" />
                        </div>
                        <div>
                          <h3 className="text-white font-semibold text-lg">Instagram</h3>
                          <p className="text-slate-400">Connect your Instagram Business account</p>
                        </div>
                      </div>
                      
                      <Button 
                        onClick={() => connectInstagramMutation.mutate()}
                        disabled={connectInstagramMutation.isPending}
                        className="bg-gradient-to-r from-pink-500 to-orange-500 hover:from-pink-600 hover:to-orange-600 text-white border-0 shadow-lg px-6 py-3"
                      >
                        {connectInstagramMutation.isPending ? 'Connecting...' : 'Connect'}
                      </Button>
                    </div>
                  </motion.div>
                </div>
              )}

              {/* Navigation */}
              <div className="flex justify-between mt-8 pt-6 border-t border-slate-700/50">
                <Button
                  variant="outline"
                  onClick={() => setCurrentStep(Math.max(0, currentStep - 1))}
                  disabled={currentStep === 0}
                  className="bg-slate-800/50 border-slate-600/50 text-slate-300 hover:bg-slate-700/50"
                >
                  Previous
                </Button>
                
                <Button
                  onClick={handleNext}
                  disabled={!isStepValid() || savePreferencesMutation.isPending || completeOnboardingMutation.isPending}
                  className="bg-gradient-to-r from-cyan-500 to-yellow-400 hover:from-cyan-600 hover:to-yellow-500 text-white border-0 shadow-lg px-6"
                >
                  {currentStep === 3 ? 
                    (completeOnboardingMutation.isPending ? 'Completing...' : 'Complete Setup') : 
                    'Next'
                  }
                  <ChevronRight className="w-4 h-4 ml-2" />
                </Button>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Features Preview */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-16 max-w-4xl w-full"
        >
          {[
            { icon: Sparkles, title: "AI Content Creation", desc: "Generate stellar posts and captions", color: "from-cyan-500 to-blue-500" },
            { icon: Target, title: "Smart Scheduling", desc: "Post at optimal times", color: "from-blue-500 to-purple-500" },
            { icon: TrendingUp, title: "Analytics", desc: "Track your cosmic growth", color: "from-purple-500 to-pink-500" }
          ].map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1 + index * 0.2 }}
              whileHover={{ scale: 1.05, y: -5 }}
              className="bg-slate-900/30 backdrop-blur-md border border-slate-700/30 rounded-xl p-6 text-center"
            >
              <div className={`w-12 h-12 bg-gradient-to-br ${feature.color} rounded-xl flex items-center justify-center mx-auto mb-4`}>
                <feature.icon className="w-6 h-6 text-white" />
              </div>
              <h3 className="font-bold text-lg text-white mb-2">{feature.title}</h3>
              <p className="text-slate-400 text-sm">{feature.desc}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </div>
  );
}