import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useLocation } from 'wouter';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';
import { SpaceBackground } from '@/components/ui/space-background';
import { FloatingRocket, FloatingSparkles, FloatingOrbs, FloatingIcons } from '@/components/ui/floating-elements';
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
  PawPrint,
  Star,
  Zap,
  Globe
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
  const { token } = useAuth();

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
      className="text-center space-y-12 relative z-10"
    >
      {/* Hero Section with 3D Effect */}
      <div className="space-y-8">
        <motion.div
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ duration: 1, ease: "easeOut" }}
          className="mx-auto relative"
        >
          <div className="w-32 h-32 mx-auto relative">
            {/* Outer Glow Ring */}
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
              className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 p-1"
            >
              <div className="w-full h-full rounded-full bg-transparent border-2 border-dashed border-white/30" />
            </motion.div>
            
            {/* Main Rocket Container */}
            <motion.div
              animate={{ 
                y: [0, -10, 0],
                boxShadow: [
                  "0 20px 40px rgba(59, 130, 246, 0.3)",
                  "0 25px 50px rgba(147, 51, 234, 0.4)", 
                  "0 20px 40px rgba(59, 130, 246, 0.3)"
                ]
              }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              className="absolute inset-2 bg-gradient-to-br from-blue-500 via-purple-600 to-pink-500 rounded-full flex items-center justify-center"
            >
              <Rocket className="w-16 h-16 text-white" />
            </motion.div>
            
            {/* Particle Effects */}
            {[...Array(8)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-2 h-2 bg-yellow-300 rounded-full"
                style={{
                  top: "50%",
                  left: "50%",
                  transform: `translate(-50%, -50%) rotate(${i * 45}deg) translateY(-80px)`
                }}
                animate={{
                  scale: [0, 1, 0],
                  opacity: [0, 1, 0]
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  delay: i * 0.2,
                  ease: "easeInOut"
                }}
              />
            ))}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <h1 className="text-6xl md:text-7xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent mb-4">
            VeeFore
          </h1>
          <motion.p 
            className="text-2xl md:text-3xl text-white/90 font-light"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
          >
            AI-Powered Social Media Galaxy
          </motion.p>
        </motion.div>
      </div>

      {/* Feature Cards with 3D Animation */}
      <motion.div 
        className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto"
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1 }}
      >
        {[
          { icon: Sparkles, title: "AI Content Creation", desc: "Generate stellar posts, captions, and media", color: "from-blue-500 to-cyan-400" },
          { icon: Target, title: "Smart Scheduling", desc: "Launch posts at optimal galactic times", color: "from-purple-500 to-pink-400" },
          { icon: TrendingUp, title: "Cosmic Analytics", desc: "Track performance across the social universe", color: "from-green-500 to-blue-400" }
        ].map((feature, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20, rotateY: -30 }}
            animate={{ opacity: 1, y: 0, rotateY: 0 }}
            transition={{ delay: 1.2 + index * 0.2 }}
            whileHover={{ 
              scale: 1.05, 
              rotateY: 5,
              boxShadow: "0 20px 40px rgba(255, 255, 255, 0.1)"
            }}
            className="relative"
          >
            <Card className="bg-white/10 backdrop-blur-md border-white/20 text-white overflow-hidden group">
              <CardContent className="pt-8 pb-6 relative">
                {/* Background Glow */}
                <div className={`absolute inset-0 bg-gradient-to-br ${feature.color} opacity-0 group-hover:opacity-20 transition-opacity duration-500`} />
                
                <motion.div
                  className={`w-16 h-16 bg-gradient-to-br ${feature.color} rounded-xl flex items-center justify-center mx-auto mb-6 relative z-10`}
                  whileHover={{ rotate: 360 }}
                  transition={{ duration: 0.6 }}
                >
                  <feature.icon className="w-8 h-8 text-white" />
                </motion.div>
                
                <h3 className="font-bold text-xl mb-3 relative z-10">{feature.title}</h3>
                <p className="text-white/80 text-sm relative z-10">{feature.desc}</p>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </motion.div>

      {/* Call to Action */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2 }}
        className="max-w-3xl mx-auto"
      >
        <p className="text-white/90 text-lg leading-relaxed">
          Embark on a journey to transform your social media presence. 
          <br />
          <span className="text-blue-300 font-medium">Connect, create, and conquer the digital cosmos.</span>
        </p>
      </motion.div>
    </motion.div>
  );

  const renderSocialStep = () => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="text-center space-y-12 relative z-10"
    >
      {/* Hero Section with 3D Instagram Icon */}
      <div className="space-y-8">
        <motion.div
          initial={{ scale: 0, rotateY: -180 }}
          animate={{ scale: 1, rotateY: 0 }}
          transition={{ duration: 1, ease: "easeOut" }}
          className="mx-auto relative"
        >
          <div className="w-32 h-32 mx-auto relative">
            {/* Outer Glow Ring */}
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
              className="absolute inset-0 rounded-full bg-gradient-to-r from-pink-500 via-purple-500 to-orange-500 p-1"
            >
              <div className="w-full h-full rounded-full bg-transparent border-2 border-dashed border-white/30" />
            </motion.div>
            
            {/* Main Instagram Container with 3D Effect */}
            <motion.div
              animate={{ 
                y: [0, -15, 0],
                rotateY: [0, 10, 0],
                boxShadow: [
                  "0 20px 40px rgba(236, 72, 153, 0.3)",
                  "0 30px 60px rgba(147, 51, 234, 0.4)", 
                  "0 20px 40px rgba(236, 72, 153, 0.3)"
                ]
              }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              className="absolute inset-2 bg-gradient-to-br from-pink-500 via-purple-600 to-orange-500 rounded-2xl flex items-center justify-center shadow-xl"
            >
              <Instagram className="w-16 h-16 text-white" />
            </motion.div>
            
            {/* Connection Pulse Effects */}
            {[...Array(6)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-3 h-3 bg-pink-300 rounded-full"
                style={{
                  top: "50%",
                  left: "50%",
                  transform: `translate(-50%, -50%) rotate(${i * 60}deg) translateY(-100px)`
                }}
                animate={{
                  scale: [0, 1.5, 0],
                  opacity: [0, 1, 0]
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  delay: i * 0.3,
                  ease: "easeInOut"
                }}
              />
            ))}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-pink-400 via-purple-400 to-orange-400 bg-clip-text text-transparent mb-4">
            Connect Social
          </h1>
          <motion.p 
            className="text-xl md:text-2xl text-white/90 font-light"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
          >
            Link your Instagram account to start creating amazing content
          </motion.p>
        </motion.div>
      </div>

      {/* Success State with Animation */}
      {Array.isArray(socialAccounts) && socialAccounts.length > 0 && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, ease: "backOut" }}
          className="mb-8"
        >
          <div className="flex items-center justify-center text-green-400 mb-3">
            <motion.div
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <CheckCircle className="w-8 h-8 mr-3" />
            </motion.div>
            <span className="text-xl font-bold">Instagram Connected Successfully!</span>
          </div>
          <motion.div
            className="bg-green-500/20 backdrop-blur-md rounded-xl p-4 max-w-sm mx-auto border border-green-400/30"
            animate={{ boxShadow: ["0 0 20px rgba(34, 197, 94, 0.3)", "0 0 40px rgba(34, 197, 94, 0.5)", "0 0 20px rgba(34, 197, 94, 0.3)"] }}
            transition={{ duration: 3, repeat: Infinity }}
          >
            <p className="text-green-200 font-medium">
              Account: @{socialAccounts[0]?.username}
            </p>
          </motion.div>
        </motion.div>
      )}

      {/* Enhanced Instagram Connection Card */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1 }}
        className="max-w-lg mx-auto"
      >
        <Card className="bg-white/10 backdrop-blur-lg border-white/20 text-white overflow-hidden group hover:bg-white/15 transition-all duration-500">
          <CardContent className="p-8 relative">
            {/* Background Glow Effect */}
            <div className="absolute inset-0 bg-gradient-to-br from-pink-500/20 to-orange-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            
            <div className="flex items-center justify-between relative z-10">
              <div className="flex items-center space-x-6">
                <motion.div
                  className="w-16 h-16 bg-gradient-to-br from-pink-500 to-orange-500 rounded-2xl flex items-center justify-center relative overflow-hidden"
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  transition={{ duration: 0.3 }}
                >
                  <Instagram className="w-8 h-8 text-white relative z-10" />
                  
                  {/* Shimmer Effect */}
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
                    animate={{ x: ["-100%", "100%"] }}
                    transition={{ duration: 3, repeat: Infinity }}
                  />
                </motion.div>
                
                <div className="text-left">
                  <div className="text-xl font-bold mb-1">Instagram</div>
                  <div className="text-white/70">Connect your Instagram Business account</div>
                  <div className="text-sm text-pink-300 mt-1">✨ AI-powered content creation</div>
                </div>
              </div>
              
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button 
                  onClick={() => setLocation('/integrations')}
                  className="bg-gradient-to-r from-pink-500 to-orange-500 hover:from-pink-600 hover:to-orange-600 text-white border-0 shadow-lg shadow-pink-500/25 px-6 py-3 text-lg font-medium"
                >
                  Connect
                </Button>
              </motion.div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Additional Platforms Preview */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5 }}
        className="max-w-2xl mx-auto"
      >
        <p className="text-white/80 text-lg mb-6">
          More platforms coming soon
        </p>
        
        <div className="flex justify-center space-x-4">
          {[
            { name: "TikTok", color: "from-red-500 to-black", icon: "🎵" },
            { name: "Twitter", color: "from-blue-400 to-blue-600", icon: "🐦" },
            { name: "LinkedIn", color: "from-blue-600 to-blue-800", icon: "💼" }
          ].map((platform, index) => (
            <motion.div
              key={platform.name}
              className={`w-12 h-12 bg-gradient-to-br ${platform.color} rounded-xl flex items-center justify-center opacity-50 relative overflow-hidden`}
              animate={{ opacity: [0.3, 0.7, 0.3] }}
              transition={{ duration: 3, repeat: Infinity, delay: index * 0.5 }}
            >
              <span className="text-white text-lg">{platform.icon}</span>
              
              {/* Coming Soon Badge */}
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-yellow-400 rounded-full" />
            </motion.div>
          ))}
        </div>
      </motion.div>
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

        {/* Enhanced Niche Selection with 3D Effects */}
        <Card className="bg-white/10 backdrop-blur-lg border-white/20 text-white overflow-hidden">
          <CardHeader className="text-center pb-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-4"
            >
              <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center mx-auto">
                <Target className="w-8 h-8 text-white" />
              </div>
              <CardTitle className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                Choose Your Creative Universe
              </CardTitle>
              <p className="text-white/70">Select the niches that spark your passion</p>
            </motion.div>
          </CardHeader>
          <CardContent className="p-8">
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {niches.map((niche, index) => {
                const Icon = niche.icon;
                const isSelected = preferences.selectedNiches.includes(niche.id);
                const colors = [
                  'from-blue-500 to-cyan-400',
                  'from-purple-500 to-pink-400',
                  'from-green-500 to-emerald-400',
                  'from-orange-500 to-red-400',
                  'from-indigo-500 to-purple-400',
                  'from-pink-500 to-rose-400',
                  'from-cyan-500 to-blue-400',
                  'from-emerald-500 to-green-400',
                  'from-rose-500 to-pink-400',
                  'from-amber-500 to-orange-400',
                  'from-violet-500 to-purple-400',
                  'from-teal-500 to-cyan-400',
                  'from-red-500 to-pink-400',
                  'from-lime-500 to-green-400',
                  'from-sky-500 to-blue-400',
                  'from-fuchsia-500 to-pink-400'
                ];
                const colorClass = colors[index % colors.length];
                
                return (
                  <motion.div
                    key={niche.id}
                    initial={{ opacity: 0, y: 20, scale: 0.8 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    transition={{ delay: index * 0.05, duration: 0.4 }}
                    onClick={() => {
                      setPreferences(prev => ({
                        ...prev,
                        selectedNiches: isSelected
                          ? prev.selectedNiches.filter(id => id !== niche.id)
                          : [...prev.selectedNiches, niche.id]
                      }));
                    }}
                    whileHover={{ 
                      scale: 1.05, 
                      rotateY: 5,
                      boxShadow: "0 20px 40px rgba(255, 255, 255, 0.1)"
                    }}
                    whileTap={{ scale: 0.95 }}
                    className={`relative p-6 rounded-2xl cursor-pointer transition-all duration-300 group overflow-hidden ${
                      isSelected 
                        ? 'bg-white/20 backdrop-blur-md border-2 border-white/40 shadow-xl' 
                        : 'bg-white/5 backdrop-blur-sm border border-white/20 hover:bg-white/10'
                    }`}
                  >
                    {/* Background Glow Effect */}
                    <div className={`absolute inset-0 bg-gradient-to-br ${colorClass} opacity-0 group-hover:opacity-20 transition-opacity duration-500`} />
                    
                    {/* Selection Ring */}
                    {isSelected && (
                      <motion.div
                        className="absolute inset-0 rounded-2xl border-2 border-white/60"
                        animate={{ 
                          boxShadow: [
                            "0 0 20px rgba(255, 255, 255, 0.3)",
                            "0 0 30px rgba(255, 255, 255, 0.5)",
                            "0 0 20px rgba(255, 255, 255, 0.3)"
                          ]
                        }}
                        transition={{ duration: 2, repeat: Infinity }}
                      />
                    )}
                    
                    {/* Icon Container with 3D Effect */}
                    <motion.div
                      className={`w-12 h-12 bg-gradient-to-br ${colorClass} rounded-xl flex items-center justify-center mb-4 mx-auto relative z-10`}
                      animate={isSelected ? { 
                        rotateY: [0, 360],
                        scale: [1, 1.1, 1]
                      } : {}}
                      transition={{ duration: 2, repeat: isSelected ? Infinity : 0 }}
                    >
                      <Icon className="w-6 h-6 text-white" />
                      
                      {/* Shimmer Effect */}
                      <motion.div
                        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent rounded-xl"
                        animate={{ x: ["-100%", "100%"] }}
                        transition={{ duration: 3, repeat: Infinity }}
                      />
                    </motion.div>
                    
                    {/* Text Content */}
                    <div className="text-center relative z-10">
                      <div className={`text-sm font-bold mb-1 ${isSelected ? 'text-white' : 'text-white/90'}`}>
                        {niche.name}
                      </div>
                      <div className={`text-xs ${isSelected ? 'text-white/80' : 'text-white/60'}`}>
                        {niche.description}
                      </div>
                    </div>
                    
                    {/* Selection Checkmark */}
                    {isSelected && (
                      <motion.div
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        className="absolute top-2 right-2 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center"
                      >
                        <CheckCircle className="w-4 h-4 text-white" />
                      </motion.div>
                    )}
                    
                    {/* Particle Effects for Selected Items */}
                    {isSelected && (
                      <div className="absolute inset-0 pointer-events-none">
                        {[...Array(6)].map((_, i) => (
                          <motion.div
                            key={i}
                            className="absolute w-1 h-1 bg-white rounded-full"
                            style={{
                              top: `${20 + Math.random() * 60}%`,
                              left: `${20 + Math.random() * 60}%`,
                            }}
                            animate={{
                              y: [-10, -20, -10],
                              opacity: [0, 1, 0],
                              scale: [0, 1, 0]
                            }}
                            transition={{
                              duration: 2,
                              repeat: Infinity,
                              delay: i * 0.3,
                              ease: "easeInOut"
                            }}
                          />
                        ))}
                      </div>
                    )}
                  </motion.div>
                );
              })}
            </div>
            
            {/* Selection Counter */}
            <motion.div
              className="mt-8 text-center"
              animate={{ opacity: preferences.selectedNiches.length > 0 ? 1 : 0.6 }}
            >
              <div className="text-white/80">
                Selected: <span className="font-bold text-white">{preferences.selectedNiches.length}</span> niche{preferences.selectedNiches.length !== 1 ? 's' : ''}
              </div>
              {preferences.selectedNiches.length > 0 && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="mt-2 flex flex-wrap justify-center gap-2"
                >
                  {preferences.selectedNiches.map((nicheId) => {
                    const niche = niches.find(n => n.id === nicheId);
                    return niche ? (
                      <span
                        key={nicheId}
                        className="px-3 py-1 bg-white/20 backdrop-blur-sm rounded-full text-sm text-white border border-white/30"
                      >
                        {niche.name}
                      </span>
                    ) : null;
                  })}
                </motion.div>
              )}
            </motion.div>
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
    <div className="min-h-screen relative overflow-hidden">
      {/* Animated Space Background */}
      <SpaceBackground />
      
      {/* Floating Elements */}
      <FloatingSparkles />
      <FloatingOrbs />
      <FloatingIcons />
      
      <div className="container mx-auto px-4 py-8 relative z-20">
        {/* Cosmic Progress Bar */}
        <motion.div 
          className="max-w-3xl mx-auto mb-12"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="relative">
            {/* Progress Track */}
            <div className="flex items-center justify-between mb-6">
              {steps.map((step, index) => (
                <div key={index} className="flex items-center flex-1">
                  <motion.div
                    className={`relative w-12 h-12 rounded-full flex items-center justify-center text-sm font-bold z-10 ${
                      index <= currentStep
                        ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg shadow-blue-500/30'
                        : 'bg-white/20 text-white/60 backdrop-blur-sm border border-white/30'
                    }`}
                    animate={index === currentStep ? { 
                      scale: [1, 1.1, 1],
                      boxShadow: [
                        "0 0 20px rgba(59, 130, 246, 0.5)",
                        "0 0 30px rgba(147, 51, 234, 0.7)",
                        "0 0 20px rgba(59, 130, 246, 0.5)"
                      ]
                    } : {}}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    {index <= currentStep ? (
                      <CheckCircle className="w-6 h-6" />
                    ) : (
                      <span>{index + 1}</span>
                    )}
                    
                    {/* Pulsing Ring for Current Step */}
                    {index === currentStep && (
                      <motion.div
                        className="absolute inset-0 rounded-full border-2 border-blue-400"
                        animate={{ scale: [1, 1.3, 1], opacity: [1, 0, 1] }}
                        transition={{ duration: 2, repeat: Infinity }}
                      />
                    )}
                  </motion.div>
                  
                  {/* Progress Line */}
                  {index < steps.length - 1 && (
                    <div className="flex-1 mx-4 relative">
                      <div className="h-1 bg-white/20 rounded-full overflow-hidden">
                        <motion.div
                          className="h-full bg-gradient-to-r from-blue-500 to-purple-600 rounded-full"
                          initial={{ width: "0%" }}
                          animate={{ 
                            width: index < currentStep ? "100%" : "0%" 
                          }}
                          transition={{ duration: 0.5 }}
                        />
                      </div>
                      
                      {/* Animated Particles */}
                      {index < currentStep && (
                        <motion.div
                          className="absolute top-0 left-0 w-2 h-2 bg-yellow-400 rounded-full"
                          animate={{ x: [0, "100%"] }}
                          transition={{ duration: 1.5, repeat: Infinity }}
                        />
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
            
            {/* Step Labels */}
            <div className="flex justify-between text-center">
              {steps.map((step, index) => (
                <div key={index} className="flex-1">
                  <div className={`text-sm font-medium ${
                    index <= currentStep ? 'text-white' : 'text-white/60'
                  }`}>
                    {step.title}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Step Content with Animation */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            transition={{ duration: 0.5 }}
            className="max-w-6xl mx-auto"
          >
            {steps[currentStep].component()}
          </motion.div>
        </AnimatePresence>

        {/* Cosmic Navigation */}
        <motion.div 
          className="max-w-3xl mx-auto mt-16 flex justify-between"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <Button
            variant="outline"
            onClick={handleBack}
            disabled={currentStep === 0}
            className="flex items-center space-x-2 bg-white/10 border-white/20 text-white hover:bg-white/20 disabled:opacity-50 backdrop-blur-sm"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back</span>
          </Button>

          {currentStep < 3 ? (
            <Button
              onClick={handleNext}
              disabled={!canProceed()}
              className="flex items-center space-x-2 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white border-0 shadow-lg shadow-blue-500/25 disabled:opacity-50"
            >
              <span>Next</span>
              <ArrowRight className="w-4 h-4" />
            </Button>
          ) : (
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Button
                onClick={handleComplete}
                disabled={completeOnboardingMutation.isPending}
                className="flex items-center space-x-2 bg-gradient-to-r from-green-500 to-blue-600 hover:from-green-600 hover:to-blue-700 text-white border-0 shadow-xl shadow-green-500/25 disabled:opacity-50 relative overflow-hidden"
              >
                {/* Shimmer Effect */}
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                  animate={{ x: ["-100%", "100%"] }}
                  transition={{ duration: 2, repeat: Infinity }}
                />
                
                <span className="relative z-10">
                  {completeOnboardingMutation.isPending ? 'Launching...' : 'Launch into VeeFore'}
                </span>
                <Rocket className="w-4 h-4 relative z-10" />
              </Button>
            </motion.div>
          )}
        </motion.div>
      </div>
    </div>
  );
}