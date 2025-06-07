import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLocation } from 'wouter';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Slider } from '@/components/ui/slider';
import { SpaceBackground } from '@/components/layout/SpaceBackground';
import {
  Rocket,
  Target,
  Users,
  Zap,
  Instagram,
  CheckCircle,
  ArrowRight,
  Sparkles,
  TrendingUp,
  Calendar,
  Star,
  Globe,
  Award
} from 'lucide-react';

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

// 3D Floating Elements Component
const FloatingElements = () => {
  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
      {/* Floating orbs with 3D effect - reduced count for performance */}
      {[...Array(5)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-8 h-8 rounded-full opacity-15"
          style={{
            background: `conic-gradient(from ${i * 72}deg, #00d4ff, #ffd700, #1a237e)`,
            filter: 'blur(2px)',
            boxShadow: '0 0 30px rgba(0, 212, 255, 0.3)'
          }}
          animate={{
            x: [0, 50, 0],
            y: [0, -30, 0],
            rotate: [0, 360],
            scale: [1, 1.1, 1],
          }}
          transition={{
            duration: 15 + i * 3,
            repeat: Infinity,
            ease: "easeInOut",
            delay: i * 1
          }}
          initial={{
            left: `${15 + i * 15}%`,
            top: `${25 + i * 10}%`
          }}
        />
      ))}
      
      {/* Reduced cosmic particles for better performance */}
      {[...Array(8)].map((_, i) => (
        <motion.div
          key={`particle-${i}`}
          className="absolute w-1 h-1 bg-cyan-400 rounded-full opacity-60"
          animate={{
            y: [-30, -120],
            opacity: [0, 0.6, 0],
            scale: [0, 1.2, 0]
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            delay: i * 0.5,
            ease: "easeOut"
          }}
          style={{
            left: `${20 + i * 10}%`,
            top: `${Math.random() * 50 + 50}%`
          }}
        />
      ))}
    </div>
  );
};

// 3D Step Indicator
const StepIndicator = ({ currentStep, totalSteps }: { currentStep: number; totalSteps: number }) => {
  return (
    <div className="flex justify-center items-center space-x-4 mb-12">
      {[...Array(totalSteps)].map((_, index) => (
        <motion.div
          key={index}
          className="relative"
          initial={{ scale: 0.8, opacity: 0.5 }}
          animate={{ 
            scale: index <= currentStep ? 1.2 : 0.8,
            opacity: index <= currentStep ? 1 : 0.5 
          }}
          transition={{ duration: 0.5, ease: "easeOut" }}
        >
          <div
            className={`w-12 h-12 rounded-full border-2 flex items-center justify-center relative overflow-hidden
              ${index <= currentStep 
                ? 'border-cyan-400 bg-gradient-to-br from-cyan-400/20 to-blue-600/20' 
                : 'border-slate-600 bg-slate-800/50'
              }`}
          >
            {index < currentStep ? (
              <CheckCircle className="w-6 h-6 text-cyan-400" />
            ) : (
              <span className={`text-sm font-bold ${index <= currentStep ? 'text-cyan-400' : 'text-slate-400'}`}>
                {index + 1}
              </span>
            )}
            {index <= currentStep && (
              <motion.div
                className="absolute inset-0 rounded-full bg-gradient-to-r from-cyan-400/30 to-gold-400/30"
                animate={{ rotate: 360 }}
                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              />
            )}
          </div>
          {index < totalSteps - 1 && (
            <motion.div
              className={`absolute top-6 left-12 w-8 h-0.5 ${
                index < currentStep ? 'bg-cyan-400' : 'bg-slate-600'
              }`}
              initial={{ scaleX: 0 }}
              animate={{ scaleX: index < currentStep ? 1 : 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            />
          )}
        </motion.div>
      ))}
    </div>
  );
};

export default function NewOnboarding() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [currentStep, setCurrentStep] = useState(0);
  const [preferences, setPreferences] = useState<UserPreferences>({
    businessName: '',
    description: '',
    niches: [],
    brandTone: '',
    goals: {
      primary: 'brand_awareness',
      followers: 1000,
      engagement: 5,
      timeline: '3_months'
    }
  });

  // Available niches with 3D visual enhancements
  const niches = [
    'Technology', 'Fashion', 'Food & Drink', 'Travel', 'Fitness',
    'Beauty', 'Business', 'Education', 'Entertainment', 'Health',
    'Lifestyle', 'Photography', 'Sports', 'Art & Design', 'Music'
  ];

  // Brand tone options with enhanced styling
  const brandTones = [
    { id: 'professional', label: 'Professional', description: 'Authoritative and trustworthy', icon: Award },
    { id: 'friendly', label: 'Friendly', description: 'Warm and approachable', icon: Users },
    { id: 'playful', label: 'Playful', description: 'Fun and creative', icon: Sparkles },
    { id: 'sophisticated', label: 'Sophisticated', description: 'Elegant and refined', icon: Star },
    { id: 'energetic', label: 'Energetic', description: 'Dynamic and exciting', icon: Zap }
  ];

  // Goal options with enhanced 3D visuals
  const goalTypes = [
    { id: 'brand_awareness', label: 'Brand Awareness', icon: Globe, description: 'Increase visibility and recognition', color: 'from-purple-500 to-pink-500' },
    { id: 'lead_generation', label: 'Lead Generation', icon: Target, description: 'Generate qualified leads and prospects', color: 'from-blue-500 to-cyan-500' },
    { id: 'sales', label: 'Drive Sales', icon: TrendingUp, description: 'Increase revenue and conversions', color: 'from-green-500 to-emerald-500' },
    { id: 'engagement', label: 'Community Building', icon: Users, description: 'Build an engaged community', color: 'from-orange-500 to-red-500' },
    { id: 'thought_leadership', label: 'Thought Leadership', icon: Award, description: 'Establish industry authority', color: 'from-indigo-500 to-purple-500' }
  ];

  const timelineOptions = [
    { id: '1_month', label: '1 Month', description: 'Quick wins', intensity: 'high' },
    { id: '3_months', label: '3 Months', description: 'Standard growth', intensity: 'medium' },
    { id: '6_months', label: '6 Months', description: 'Steady progress', intensity: 'medium' },
    { id: '1_year', label: '1 Year', description: 'Long-term success', intensity: 'low' }
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
        title: "🚀 Setup Complete!",
        description: "Welcome to your cosmic social media journey",
      });
      setLocation('/dashboard');
    },
    onError: (error: any) => {
      toast({
        title: "Setup Failed",
        description: error.message || "Failed to save preferences",
        variant: "destructive",
      });
    }
  });

  const steps = [
    {
      title: "Welcome to the Cosmos",
      subtitle: "Let's launch your brand into the digital universe",
      component: WelcomeStep
    },
    {
      title: "Define Your Brand",
      subtitle: "Tell us about your cosmic mission",
      component: BrandStep
    },
    {
      title: "Choose Your Universe",
      subtitle: "Select your content galaxies",
      component: NichesStep
    },
    {
      title: "Set Your Voice",
      subtitle: "How do you communicate across the cosmos?",
      component: ToneStep
    },
    {
      title: "Mission Objectives",
      subtitle: "Define your stellar goals",
      component: GoalsStep
    },
    {
      title: "Connect Your Satellites",
      subtitle: "Link your social media accounts",
      component: ConnectStep
    }
  ];

  // Step Components
  function WelcomeStep() {
    return (
      <motion.div
        className="text-center space-y-8"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <motion.div
          className="relative mx-auto w-32 h-32"
          animate={{ rotate: 360 }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-cyan-400 to-blue-600 rounded-full blur-lg opacity-50" />
          <div className="relative bg-gradient-to-r from-cyan-400 to-blue-600 rounded-full p-8 shadow-2xl">
            <Rocket className="w-16 h-16 text-white mx-auto" />
          </div>
        </motion.div>
        
        <div className="space-y-6">
          <motion.h1
            className="text-5xl font-bold bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 bg-clip-text text-transparent"
            initial={{ scale: 0.5 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            Welcome to VeeFore
          </motion.h1>
          
          <motion.p
            className="text-xl text-slate-300 max-w-2xl mx-auto leading-relaxed"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            Embark on an interstellar journey where AI meets creativity. 
            We'll transform your social media presence into a cosmic phenomenon.
          </motion.p>
          
          <motion.div
            className="flex justify-center space-x-4 text-cyan-400"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
          >
            <Sparkles className="w-6 h-6 animate-pulse" />
            <Star className="w-6 h-6 animate-pulse" style={{ animationDelay: '0.5s' }} />
            <Sparkles className="w-6 h-6 animate-pulse" style={{ animationDelay: '1s' }} />
          </motion.div>
        </div>
      </motion.div>
    );
  }

  function BrandStep() {
    return (
      <motion.div
        className="space-y-8 max-w-2xl mx-auto"
        initial={{ opacity: 0, x: 50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="space-y-6">
          <div>
            <label className="block text-lg font-semibold text-cyan-400 mb-3">
              Business Name
            </label>
            <Input
              value={preferences.businessName}
              onChange={(e) => setPreferences(prev => ({ ...prev, businessName: e.target.value }))}
              placeholder="Enter your cosmic brand name..."
              className="bg-slate-800/90 border-slate-600 text-white placeholder-slate-400 h-12 text-lg backdrop-blur-sm focus:bg-slate-800 focus:border-cyan-400 transition-colors duration-200 input-stable"
            />
          </div>
          
          <div>
            <label className="block text-lg font-semibold text-cyan-400 mb-3">
              Tell us about your mission
            </label>
            <Textarea
              value={preferences.description}
              onChange={(e) => setPreferences(prev => ({ ...prev, description: e.target.value }))}
              placeholder="Describe your brand's cosmic purpose and what makes you unique in the universe..."
              className="bg-slate-800/90 border-slate-600 text-white placeholder-slate-400 min-h-32 backdrop-blur-sm focus:bg-slate-800 focus:border-cyan-400 transition-colors duration-200 input-stable"
              rows={4}
            />
          </div>
        </div>
      </motion.div>
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
      <motion.div
        className="space-y-8"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6 }}
      >
        <p className="text-slate-300 text-center mb-8">
          Select the galaxies where your content will shine (choose 2-5)
        </p>
        
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {niches.map((niche, index) => {
            const isSelected = preferences.niches.includes(niche);
            return (
              <motion.button
                key={niche}
                onClick={() => toggleNiche(niche)}
                className={`relative p-4 rounded-xl border-2 transition-all duration-300 ${
                  isSelected
                    ? 'border-cyan-400 bg-gradient-to-br from-cyan-400/20 to-blue-600/20 text-cyan-400'
                    : 'border-slate-600 bg-slate-800/30 text-slate-300 hover:border-slate-500'
                }`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
              >
                {isSelected && (
                  <motion.div
                    className="absolute inset-0 rounded-xl bg-gradient-to-r from-cyan-400/10 to-blue-600/10"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.3 }}
                  />
                )}
                <span className="relative font-semibold">{niche}</span>
              </motion.button>
            );
          })}
        </div>
        
        <motion.p
          className="text-center text-slate-400"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          Selected: {preferences.niches.length} galaxies
        </motion.p>
      </motion.div>
    );
  }

  function ToneStep() {
    return (
      <motion.div
        className="space-y-8"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="grid gap-6">
          {brandTones.map((tone, index) => {
            const isSelected = preferences.brandTone === tone.id;
            const IconComponent = tone.icon;
            
            return (
              <motion.button
                key={tone.id}
                onClick={() => setPreferences(prev => ({ ...prev, brandTone: tone.id }))}
                className={`relative p-6 rounded-2xl border-2 text-left transition-all duration-300 ${
                  isSelected
                    ? 'border-cyan-400 bg-gradient-to-br from-cyan-400/20 to-blue-600/20'
                    : 'border-slate-600 bg-slate-800/30 hover:border-slate-500'
                }`}
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ scale: 1.02, x: 10 }}
                whileTap={{ scale: 0.98 }}
              >
                <div className="flex items-center space-x-4">
                  <div className={`p-3 rounded-xl ${
                    isSelected ? 'bg-cyan-400/20' : 'bg-slate-700/50'
                  }`}>
                    <IconComponent className={`w-6 h-6 ${
                      isSelected ? 'text-cyan-400' : 'text-slate-400'
                    }`} />
                  </div>
                  <div className="flex-1">
                    <h3 className={`text-xl font-bold ${
                      isSelected ? 'text-cyan-400' : 'text-white'
                    }`}>
                      {tone.label}
                    </h3>
                    <p className="text-slate-400">{tone.description}</p>
                  </div>
                  {isSelected && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ duration: 0.3 }}
                    >
                      <CheckCircle className="w-6 h-6 text-cyan-400" />
                    </motion.div>
                  )}
                </div>
              </motion.button>
            );
          })}
        </div>
      </motion.div>
    );
  }

  function GoalsStep() {
    return (
      <motion.div
        className="space-y-10"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6 }}
      >
        {/* Primary Goal Selection */}
        <div className="space-y-6">
          <h3 className="text-2xl font-bold text-cyan-400 text-center">Primary Mission</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {goalTypes.map((goal, index) => {
              const isSelected = preferences.goals.primary === goal.id;
              const IconComponent = goal.icon;
              
              return (
                <motion.button
                  key={goal.id}
                  onClick={() => setPreferences(prev => ({
                    ...prev,
                    goals: { ...prev.goals, primary: goal.id }
                  }))}
                  className={`relative p-6 rounded-2xl border-2 text-center transition-all duration-300 overflow-hidden ${
                    isSelected
                      ? 'border-cyan-400 bg-gradient-to-br from-cyan-400/20 to-blue-600/20'
                      : 'border-slate-600 bg-slate-800/30 hover:border-slate-500'
                  }`}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ scale: 1.05, y: -5 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {isSelected && (
                    <motion.div
                      className={`absolute inset-0 bg-gradient-to-br ${goal.color} opacity-10`}
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ duration: 0.5 }}
                    />
                  )}
                  
                  <div className="relative z-10 space-y-4">
                    <div className={`mx-auto w-16 h-16 rounded-full flex items-center justify-center ${
                      isSelected ? 'bg-cyan-400/20' : 'bg-slate-700/50'
                    }`}>
                      <IconComponent className={`w-8 h-8 ${
                        isSelected ? 'text-cyan-400' : 'text-slate-400'
                      }`} />
                    </div>
                    
                    <div>
                      <h4 className={`text-lg font-bold ${
                        isSelected ? 'text-cyan-400' : 'text-white'
                      }`}>
                        {goal.label}
                      </h4>
                      <p className="text-slate-400 text-sm mt-2">{goal.description}</p>
                    </div>
                  </div>
                </motion.button>
              );
            })}
          </div>
        </div>

        {/* Follower Target */}
        <div className="space-y-6">
          <h3 className="text-xl font-bold text-cyan-400 text-center">Follower Target</h3>
          <div className="max-w-md mx-auto space-y-4">
            <div className="text-center">
              <span className="text-3xl font-bold text-white">
                {preferences.goals.followers.toLocaleString()}
              </span>
              <span className="text-slate-400 ml-2">followers</span>
            </div>
            <Slider
              value={[preferences.goals.followers]}
              onValueChange={(value) => setPreferences(prev => ({
                ...prev,
                goals: { ...prev.goals, followers: value[0] }
              }))}
              min={100}
              max={100000}
              step={100}
              className="w-full"
            />
            <div className="flex justify-between text-sm text-slate-400">
              <span>100</span>
              <span>100K</span>
            </div>
          </div>
        </div>

        {/* Engagement Target */}
        <div className="space-y-6">
          <h3 className="text-xl font-bold text-cyan-400 text-center">Engagement Goal</h3>
          <div className="max-w-md mx-auto space-y-4">
            <div className="text-center">
              <span className="text-3xl font-bold text-white">
                {preferences.goals.engagement}%
              </span>
              <span className="text-slate-400 ml-2">engagement rate</span>
            </div>
            <Slider
              value={[preferences.goals.engagement]}
              onValueChange={(value) => setPreferences(prev => ({
                ...prev,
                goals: { ...prev.goals, engagement: value[0] }
              }))}
              min={1}
              max={20}
              step={0.5}
              className="w-full"
            />
            <div className="flex justify-between text-sm text-slate-400">
              <span>1%</span>
              <span>20%</span>
            </div>
          </div>
        </div>

        {/* Timeline Selection */}
        <div className="space-y-6">
          <h3 className="text-xl font-bold text-cyan-400 text-center">Mission Timeline</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {timelineOptions.map((timeline, index) => {
              const isSelected = preferences.goals.timeline === timeline.id;
              
              return (
                <motion.button
                  key={timeline.id}
                  onClick={() => setPreferences(prev => ({
                    ...prev,
                    goals: { ...prev.goals, timeline: timeline.id }
                  }))}
                  className={`p-4 rounded-xl border-2 text-center transition-all duration-300 ${
                    isSelected
                      ? 'border-cyan-400 bg-gradient-to-br from-cyan-400/20 to-blue-600/20'
                      : 'border-slate-600 bg-slate-800/30 hover:border-slate-500'
                  }`}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <div className={`text-lg font-bold ${
                    isSelected ? 'text-cyan-400' : 'text-white'
                  }`}>
                    {timeline.label}
                  </div>
                  <div className="text-slate-400 text-sm">{timeline.description}</div>
                </motion.button>
              );
            })}
          </div>
        </div>
      </motion.div>
    );
  }

  function ConnectStep() {
    const hasInstagram = Array.isArray(socialAccounts) && socialAccounts.some((account: any) => account.platform === 'instagram');

    return (
      <motion.div
        className="space-y-8 text-center"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="space-y-6">
          <h3 className="text-2xl font-bold text-cyan-400">Connect Your Satellites</h3>
          <p className="text-slate-300 max-w-2xl mx-auto">
            Link your social media accounts to begin your cosmic journey. We'll analyze your existing presence and supercharge your content strategy.
          </p>
        </div>

        <div className="max-w-md mx-auto">
          <motion.button
            onClick={() => connectInstagramMutation.mutate()}
            disabled={connectInstagramMutation.isPending || hasInstagram}
            className={`w-full p-6 rounded-2xl border-2 transition-all duration-300 ${
              hasInstagram
                ? 'border-green-500 bg-gradient-to-br from-green-500/20 to-emerald-600/20'
                : 'border-pink-500 bg-gradient-to-br from-pink-500/20 to-purple-600/20 hover:scale-105'
            }`}
            whileHover={!hasInstagram ? { scale: 1.05, y: -5 } : {}}
            whileTap={!hasInstagram ? { scale: 0.95 } : {}}
          >
            <div className="flex items-center justify-center space-x-4">
              <div className={`p-3 rounded-xl ${
                hasInstagram ? 'bg-green-500/20' : 'bg-pink-500/20'
              }`}>
                {hasInstagram ? (
                  <CheckCircle className="w-8 h-8 text-green-400" />
                ) : (
                  <Instagram className="w-8 h-8 text-pink-400" />
                )}
              </div>
              <div className="text-left">
                <h4 className={`text-xl font-bold ${
                  hasInstagram ? 'text-green-400' : 'text-pink-400'
                }`}>
                  {hasInstagram ? 'Instagram Connected' : 'Connect Instagram'}
                </h4>
                <p className="text-slate-400">
                  {hasInstagram ? 'Ready for cosmic content!' : 'Link your Instagram account'}
                </p>
              </div>
            </div>
          </motion.button>
        </div>

        {hasInstagram && Array.isArray(socialAccounts) && (
          <motion.div
            className="max-w-md mx-auto p-4 bg-slate-800/50 rounded-xl border border-slate-600"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3 }}
          >
            {socialAccounts
              .filter((account: any) => account.platform === 'instagram')
              .map((account: any) => (
                <div key={account.id} className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-pink-500 to-purple-600 rounded-full flex items-center justify-center">
                    <Instagram className="w-6 h-6 text-white" />
                  </div>
                  <div className="flex-1 text-left">
                    <div className="font-semibold text-white">@{account.username}</div>
                    <div className="text-sm text-slate-400">
                      {account.followers} followers • {account.mediaCount} posts
                    </div>
                  </div>
                </div>
              ))}
          </motion.div>
        )}
      </motion.div>
    );
  }

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
    if (!preferences.businessName || !preferences.description || preferences.niches.length === 0 || !preferences.brandTone) {
      toast({
        title: "Incomplete Setup",
        description: "Please fill in all required fields before launching",
        variant: "destructive",
      });
      return;
    }
    
    savePreferencesMutation.mutate(preferences);
  };

  const canProceed = () => {
    switch (currentStep) {
      case 0: return true;
      case 1: return preferences.businessName.length > 0 && preferences.description.length > 0;
      case 2: return preferences.niches.length >= 2;
      case 3: return preferences.brandTone.length > 0;
      case 4: return true;
      case 5: return true;
      default: return false;
    }
  };

  const CurrentStepComponent = steps[currentStep]?.component;

  return (
    <div className="min-h-screen relative overflow-hidden" style={{ transform: 'translateZ(0)' }}>
      <SpaceBackground />
      <FloatingElements />
      
      <div className="relative z-10 min-h-screen flex flex-col will-change-auto">
        {/* Header */}
        <div className="p-8">
          <StepIndicator currentStep={currentStep} totalSteps={steps.length} />
          
          <motion.div
            className="text-center mb-12"
            key={currentStep}
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">
              {steps[currentStep]?.title}
            </h1>
            <p className="text-xl text-slate-300">
              {steps[currentStep]?.subtitle}
            </p>
          </motion.div>
        </div>

        {/* Content */}
        <div className="flex-1 px-8 pb-8">
          <div className="max-w-6xl mx-auto">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentStep}
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -50 }}
                transition={{ duration: 0.5 }}
              >
                {CurrentStepComponent && <CurrentStepComponent />}
              </motion.div>
            </AnimatePresence>
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
                className="bg-gradient-to-r from-cyan-400 to-blue-600 hover:from-cyan-500 hover:to-blue-700 text-white font-semibold px-8 disabled:opacity-50"
              >
                Next <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}