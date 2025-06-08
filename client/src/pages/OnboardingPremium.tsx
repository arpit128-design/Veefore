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
import { useWorkspaceContext } from '@/hooks/useWorkspace';
import { SpaceBackground } from '@/components/ui/space-background';
import { 
  FloatingSphere, 
  HolographicCube, 
  GeometricPattern, 
  ParticleField, 
  ThreeDCard 
} from '@/components/ui/three-d-elements';
import { 
  AnimatedText, 
  MorphingIcon, 
  LiquidLoader, 
  HolographicButton, 
  ScrollReveal, 
  MagneticElement, 
  TypewriterText,
  GlitchText 
} from '@/components/ui/advanced-animations';
import { apiRequest } from '@/lib/queryClient';
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
  Wand2,
  Brain,
  Shield,
  Cpu,
  Atom
} from 'lucide-react';

// Complete Business Setup Flow
const onboardingSteps = [
  {
    id: 'welcome',
    title: 'Welcome to VeeFore',
    subtitle: 'The Future of AI-Powered Social Media Management',
    description: 'Experience the next generation of content creation with cutting-edge AI technology',
    color: '#6366f1',
    icon: Rocket,
    particles: 80,
    elements: ['sphere', 'cube', 'pattern']
  },
  {
    id: 'business',
    title: 'Brand Identity Setup',
    subtitle: 'Tell Us About Your Business',
    description: 'Help our AI understand your brand to create personalized content that resonates with your audience',
    color: '#10b981',
    icon: Building,
    particles: 75,
    elements: ['cube', 'pattern', 'sphere']
  },
  {
    id: 'goals',
    title: 'Mission Control Center',
    subtitle: 'What Are Your Primary Goals?',
    description: 'Define your objectives so our AI can optimize content strategy for maximum impact',
    color: '#f59e0b',
    icon: Target,
    particles: 85,
    elements: ['pattern', 'sphere', 'cube']
  },
  {
    id: 'platforms',
    title: 'Social Galaxy Connection',
    subtitle: 'Connect Your Social Media Platforms',
    description: 'Link your accounts to enable cross-platform content distribution and analytics',
    color: '#8b5cf6',
    icon: Users,
    particles: 80,
    elements: ['sphere', 'cube', 'pattern']
  },
  {
    id: 'personality',
    title: 'AI Personality Matrix',
    subtitle: 'Customize Your Digital Twin',
    description: 'Choose your AI personality that will represent your brand across all platforms',
    color: '#ec4899',
    icon: Brain,
    particles: 70,
    elements: ['pattern', 'sphere', 'cube']
  },
  {
    id: 'categories',
    title: 'Content DNA Selection',
    subtitle: 'Define Your Creative Universe',
    description: 'Select categories that resonate with your brand to unlock specialized AI capabilities',
    color: '#06b6d4',
    icon: Atom,
    particles: 90,
    elements: ['sphere', 'pattern', 'cube']
  },
  {
    id: 'workspace',
    title: 'Create Your Universe',
    subtitle: 'Build Your Digital Command Center',
    description: 'Set up your personalized workspace where creativity meets intelligence',
    color: '#059669',
    icon: Cpu,
    particles: 60,
    elements: ['cube', 'pattern', 'sphere']
  },
  {
    id: 'complete',
    title: 'Launch Sequence Initiated',
    subtitle: 'Your AI Empire Awaits',
    description: 'Welcome to the future of content creation. Your journey begins now.',
    color: '#10b981',
    icon: Zap,
    particles: 100,
    elements: ['cube', 'sphere', 'pattern']
  }
];

const personalities = [
  { id: 'professional', name: 'Corporate Mastermind', description: 'Sophisticated, authoritative, and strategic', icon: Shield, color: '#1e293b' },
  { id: 'friendly', name: 'Social Catalyst', description: 'Warm, engaging, and approachable', icon: Heart, color: '#f97316' },
  { id: 'casual', name: 'Digital Rebel', description: 'Relaxed, authentic, and conversational', icon: Users, color: '#3b82f6' },
  { id: 'enthusiastic', name: 'Energy Amplifier', description: 'Dynamic, passionate, and inspiring', icon: Zap, color: '#eab308' },
  { id: 'minimalist', name: 'Zen Creator', description: 'Clean, focused, and intentional', icon: Cpu, color: '#6366f1' },
  { id: 'creative', name: 'Artistic Visionary', description: 'Innovative, expressive, and imaginative', icon: Wand2, color: '#a855f7' }
];

const businessGoals = [
  { id: 'brand-awareness', name: 'Brand Awareness', description: 'Increase visibility and recognition', icon: TrendingUp, color: '#3b82f6' },
  { id: 'lead-generation', name: 'Lead Generation', description: 'Generate qualified prospects', icon: Target, color: '#059669' },
  { id: 'sales-growth', name: 'Sales Growth', description: 'Drive revenue and conversions', icon: Trophy, color: '#eab308' },
  { id: 'community-building', name: 'Community Building', description: 'Build engaged communities', icon: Users, color: '#ec4899' },
  { id: 'thought-leadership', name: 'Thought Leadership', description: 'Establish industry authority', icon: Brain, color: '#8b5cf6' },
  { id: 'customer-retention', name: 'Customer Retention', description: 'Strengthen existing relationships', icon: Heart, color: '#dc2626' }
];

const socialPlatforms = [
  { id: 'instagram', name: 'Instagram', icon: Instagram, color: '#e1306c', connected: false },
  { id: 'youtube', name: 'YouTube', icon: Video, color: '#ff0000', connected: false },
  { id: 'twitter', name: 'X (Twitter)', icon: Globe, color: '#1da1f2', connected: false },
  { id: 'linkedin', name: 'LinkedIn', icon: Users, color: '#0077b5', connected: false },
  { id: 'tiktok', name: 'TikTok', icon: Music, color: '#000000', connected: false },
  { id: 'facebook', name: 'Facebook', icon: Users, color: '#1877f2', connected: false }
];

const contentCategories = [
  { id: 'technology', name: 'Technology', icon: Cpu, color: '#3b82f6' },
  { id: 'lifestyle', name: 'Lifestyle', icon: Heart, color: '#ec4899' },
  { id: 'business', name: 'Business', icon: Building, color: '#059669' },
  { id: 'fitness', name: 'Fitness', icon: Dumbbell, color: '#dc2626' },
  { id: 'food', name: 'Food & Culinary', icon: Utensils, color: '#ea580c' },
  { id: 'travel', name: 'Travel', icon: Plane, color: '#0891b2' },
  { id: 'fashion', name: 'Fashion', icon: Shirt, color: '#7c3aed' },
  { id: 'gaming', name: 'Gaming', icon: Gamepad2, color: '#dc2626' },
  { id: 'music', name: 'Music', icon: Music, color: '#059669' },
  { id: 'education', name: 'Education', icon: GraduationCap, color: '#0f766e' },
  { id: 'automotive', name: 'Automotive', icon: Car, color: '#4338ca' },
  { id: 'realestate', name: 'Real Estate', icon: Home, color: '#9333ea' },
  { id: 'ecommerce', name: 'E-commerce', icon: ShoppingCart, color: '#c2410c' },
  { id: 'parenting', name: 'Parenting', icon: Baby, color: '#be185d' },
  { id: 'pets', name: 'Pets', icon: PawPrint, color: '#0d9488' },
  { id: 'photography', name: 'Photography', icon: Camera, color: '#7c2d12' }
];

export default function OnboardingPremium() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const { user } = useAuth();
  const { setCurrentWorkspace } = useWorkspaceContext();
  const queryClient = useQueryClient();

  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState({
    businessName: '',
    businessDescription: '',
    selectedGoals: [] as string[],
    connectedPlatforms: [] as string[],
    workspaceName: '',
    description: '',
    aiPersonality: '',
    selectedCategories: [] as string[]
  });
  const [isLoading, setIsLoading] = useState(false);
  const [progress, setProgress] = useState(0);

  // Security check - only show onboarding for new users during registration
  const { data: userData } = useQuery({
    queryKey: ['/api/user'],
    enabled: !!user
  });

  // Redirect if user is already onboarded
  useEffect(() => {
    if (userData?.isOnboarded) {
      setLocation('/dashboard');
    }
  }, [userData, setLocation]);

  // Calculate progress
  useEffect(() => {
    setProgress((currentStep / (onboardingSteps.length - 1)) * 100);
  }, [currentStep]);

  // Helper function for category toggle
  const handleCategoryToggle = (categoryId: string) => {
    setFormData(prev => ({
      ...prev,
      selectedCategories: prev.selectedCategories.includes(categoryId)
        ? prev.selectedCategories.filter(id => id !== categoryId)
        : [...prev.selectedCategories, categoryId]
    }));
  };

  // Mutations
  const createWorkspaceMutation = useMutation({
    mutationFn: async (data: any) => {
      const response = await apiRequest('POST', '/api/workspaces', data);
      if (!response.ok) {
        throw new Error('Failed to create workspace');
      }
      return response.json();
    },
    onSuccess: async (workspace) => {
      setCurrentWorkspace(workspace);
      queryClient.invalidateQueries({ queryKey: ['/api/workspaces'] });
      
      // Mark user as onboarded
      await apiRequest('PATCH', '/api/user', { isOnboarded: true });
      queryClient.invalidateQueries({ queryKey: ['/api/user'] });
      
      toast({
        title: "🚀 Workspace Created Successfully!",
        description: "Welcome to your new AI-powered creative universe!",
      });
      
      setTimeout(() => {
        setLocation('/dashboard');
      }, 2000);
    },
    onError: (error: any) => {
      toast({
        title: "Creation Failed",
        description: error.message || "Failed to create workspace. Please try again.",
        variant: "destructive",
      });
      setIsLoading(false);
    }
  });

  // Instagram OAuth mutation
  const instagramConnectMutation = useMutation({
    mutationFn: async () => {
      const response = await apiRequest("GET", "/api/instagram/auth?source=onboarding");
      if (!response.ok) {
        throw new Error('Failed to get Instagram authorization URL');
      }
      return response.json();
    },
    onSuccess: (data) => {
      if (data.authUrl) {
        // Store current onboarding state before OAuth redirect
        localStorage.setItem('onboarding_current_step', currentStep.toString());
        localStorage.setItem('onboarding_form_data', JSON.stringify(formData));
        localStorage.setItem('onboarding_returning_from_oauth', 'true');
        localStorage.setItem('oauth_source', 'onboarding');
        
        // Redirect to Instagram OAuth
        window.location.href = data.authUrl;
      } else {
        throw new Error('Failed to get Instagram authorization URL');
      }
    },
    onError: (error: any) => {
      console.error('[ONBOARDING] Instagram connection failed:', error);
      toast({
        title: "Connection Failed",
        description: error.message || "Failed to connect Instagram account. Please try again.",
        variant: "destructive",
      });
    }
  });

  // Handle platform connection
  const handlePlatformConnect = (platformId: string) => {
    if (platformId === 'instagram') {
      instagramConnectMutation.mutate();
    } else {
      // For other platforms, just toggle the connection status in UI for now
      setFormData(prev => ({
        ...prev,
        connectedPlatforms: prev.connectedPlatforms.includes(platformId)
          ? prev.connectedPlatforms.filter(id => id !== platformId)
          : [...prev.connectedPlatforms, platformId]
      }));
      
      toast({
        title: `${platformId} Connection`,
        description: `${platformId} OAuth integration coming soon!`,
      });
    }
  };

  const handleNext = () => {
    if (currentStep < onboardingSteps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      handleComplete();
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleComplete = async () => {
    if (!formData.businessName.trim() || !formData.workspaceName.trim()) {
      toast({
        title: "Required Fields Missing",
        description: "Please complete all required fields",
        variant: "destructive",
      });
      return;
    }

    if (!formData.aiPersonality) {
      toast({
        title: "AI Personality Required",
        description: "Please select an AI personality",
        variant: "destructive",
      });
      return;
    }

    if (formData.selectedCategories.length === 0) {
      toast({
        title: "Categories Required",
        description: "Please select at least one content category",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    
    createWorkspaceMutation.mutate({
      name: formData.workspaceName,
      description: formData.description || `AI-powered workspace for ${formData.businessName}`,
      businessName: formData.businessName,
      businessDescription: formData.businessDescription,
      businessGoals: formData.selectedGoals,
      connectedPlatforms: formData.connectedPlatforms,
      aiPersonality: formData.aiPersonality,
      theme: 'space',
      categories: formData.selectedCategories
    });
  };

  const currentStepData = onboardingSteps[currentStep];

  return (
    <div className="min-h-screen relative overflow-hidden bg-black">
      {/* Advanced Space Background */}
      <SpaceBackground />
      
      {/* Particle Field */}
      <ParticleField 
        count={currentStepData.particles} 
        color={currentStepData.color + '80'} 
        speed={1.5} 
      />

      {/* Floating 3D Elements */}
      <div className="absolute inset-0 pointer-events-none">
        {currentStepData.elements.includes('sphere') && (
          <div className="absolute top-20 right-20">
            <FloatingSphere 
              size={120} 
              color={currentStepData.color} 
              delay={0.2}
              interactive={false}
            />
          </div>
        )}
        
        {currentStepData.elements.includes('cube') && (
          <div className="absolute bottom-32 left-16">
            <HolographicCube 
              size={100} 
              color={currentStepData.color}
              rotationSpeed={15}
            />
          </div>
        )}
        
        {currentStepData.elements.includes('pattern') && (
          <div className="absolute top-1/2 right-32 transform -translate-y-1/2">
            <GeometricPattern 
              pattern="hexagon"
              size={80}
              color={currentStepData.color}
              animate={true}
            />
          </div>
        )}
      </div>

      {/* Progress Bar */}
      <motion.div 
        className="fixed top-0 left-0 right-0 z-50"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        <div className="h-1 bg-white/10 backdrop-blur-sm">
          <motion.div
            className="h-full"
            style={{
              background: `linear-gradient(90deg, ${currentStepData.color}ff 0%, ${currentStepData.color}aa 100%)`
            }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          />
        </div>
        
        {/* Progress Indicator */}
        <div className="absolute top-4 right-6">
          <LiquidLoader 
            progress={progress} 
            size={50} 
            color={currentStepData.color} 
          />
        </div>
      </motion.div>

      {/* Main Content */}
      <div className="flex items-center justify-center min-h-screen p-6">
        <div className="w-full max-w-4xl">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, scale: 0.9, rotateY: -15 }}
              animate={{ opacity: 1, scale: 1, rotateY: 0 }}
              exit={{ opacity: 0, scale: 1.1, rotateY: 15 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
            >
              <ThreeDCard 
                className="w-full"
                glowColor={currentStepData.color}
                tiltIntensity={8}
              >
                <div className="p-8 lg:p-12">
                  {/* Step Header */}
                  <div className="text-center mb-8">
                    <MagneticElement strength={15}>
                      <div 
                        className="w-20 h-20 mx-auto mb-6 rounded-full flex items-center justify-center"
                        style={{
                          background: `radial-gradient(circle, ${currentStepData.color}40 0%, ${currentStepData.color}20 100%)`,
                          border: `2px solid ${currentStepData.color}60`
                        }}
                      >
                        <MorphingIcon 
                          icons={[currentStepData.icon, Sparkles, Star]} 
                          size={32} 
                          color={currentStepData.color}
                          interval={3000}
                        />
                      </div>
                    </MagneticElement>
                    
                    <ScrollReveal direction="up" delay={0.2}>
                      <h1 className="text-4xl lg:text-5xl font-bold mb-4">
                        <GlitchText 
                          text={currentStepData.title}
                          className="text-white"
                          intensity={1}
                        />
                      </h1>
                    </ScrollReveal>
                    
                    <ScrollReveal direction="up" delay={0.4}>
                      <h2 className="text-xl lg:text-2xl text-white/80 mb-4">
                        <TypewriterText 
                          text={currentStepData.subtitle}
                          speed={50}
                          delay={800}
                        />
                      </h2>
                    </ScrollReveal>
                    
                    <ScrollReveal direction="up" delay={0.6}>
                      <p className="text-white/60 text-lg max-w-2xl mx-auto">
                        {currentStepData.description}
                      </p>
                    </ScrollReveal>
                  </div>

                  {/* Step Content */}
                  <div className="min-h-[400px] flex items-center justify-center">
                    {currentStep === 0 && (
                      <ScrollReveal direction="up" delay={0.8}>
                        <div className="text-center space-y-6">
                          <div className="grid grid-cols-3 gap-6 mb-8">
                            {[
                              { icon: Brain, label: 'AI-Powered', color: '#6366f1' },
                              { icon: Rocket, label: 'Lightning Fast', color: '#8b5cf6' },
                              { icon: Shield, label: 'Enterprise Grade', color: '#06b6d4' }
                            ].map((feature, index) => (
                              <motion.div
                                key={index}
                                className="text-center"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 1 + index * 0.2 }}
                              >
                                <div 
                                  className="w-16 h-16 mx-auto mb-3 rounded-full flex items-center justify-center"
                                  style={{
                                    background: `radial-gradient(circle, ${feature.color}40 0%, ${feature.color}20 100%)`,
                                    border: `1px solid ${feature.color}60`
                                  }}
                                >
                                  <feature.icon size={24} color={feature.color} />
                                </div>
                                <p className="text-white/80 text-sm">{feature.label}</p>
                              </motion.div>
                            ))}
                          </div>
                          
                          <AnimatedText 
                            text="Ready to revolutionize your content creation?"
                            className="text-2xl font-semibold text-white"
                            delay={1.5}
                            stagger={0.05}
                          />
                        </div>
                      </ScrollReveal>
                    )}

                    {currentStep === 1 && (
                      <ScrollReveal direction="up" delay={0.3}>
                        <div className="w-full max-w-md space-y-6">
                          <div className="space-y-4">
                            <Label htmlFor="business-name" className="text-white font-medium">
                              Business Name *
                            </Label>
                            <Input
                              id="business-name"
                              type="text"
                              placeholder="Enter your business name..."
                              value={formData.businessName}
                              onChange={(e) => setFormData(prev => ({ ...prev, businessName: e.target.value }))}
                              className="bg-white/10 border-white/20 text-white placeholder:text-white/50 backdrop-blur-sm"
                              required
                            />
                          </div>
                          
                          <div className="space-y-4">
                            <Label htmlFor="business-description" className="text-white font-medium">
                              Business Description *
                            </Label>
                            <Input
                              id="business-description"
                              type="text"
                              placeholder="Describe what your business does..."
                              value={formData.businessDescription}
                              onChange={(e) => setFormData(prev => ({ ...prev, businessDescription: e.target.value }))}
                              className="bg-white/10 border-white/20 text-white placeholder:text-white/50 backdrop-blur-sm"
                              required
                            />
                          </div>
                          
                          {formData.businessName && (
                            <motion.div
                              initial={{ opacity: 0, y: 10 }}
                              animate={{ opacity: 1, y: 0 }}
                              className="p-4 bg-white/5 rounded-lg border border-white/20"
                            >
                              <h3 className="text-white font-medium mb-2">Preview:</h3>
                              <p className="text-green-400 font-semibold">{formData.businessName}</p>
                              <p className="text-white/70 text-sm">{formData.businessDescription}</p>
                            </motion.div>
                          )}
                        </div>
                      </ScrollReveal>
                    )}

                    {currentStep === 2 && (
                      <ScrollReveal direction="up" delay={0.3}>
                        <div className="w-full">
                          <div className="text-center mb-6">
                            <p className="text-white/80 mb-4">
                              Selected: {formData.selectedGoals.length} goals
                            </p>
                          </div>
                          
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {businessGoals.map((goal, index) => (
                              <motion.div
                                key={goal.id}
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: index * 0.1 }}
                              >
                                <MagneticElement strength={10}>
                                  <motion.div
                                    className={`p-6 rounded-xl border-2 cursor-pointer transition-all duration-300 ${
                                      formData.selectedGoals.includes(goal.id)
                                        ? 'border-white/60 bg-white/10'
                                        : 'border-white/20 bg-white/5 hover:border-white/40'
                                    }`}
                                    onClick={() => {
                                      setFormData(prev => ({
                                        ...prev,
                                        selectedGoals: prev.selectedGoals.includes(goal.id)
                                          ? prev.selectedGoals.filter(id => id !== goal.id)
                                          : [...prev.selectedGoals, goal.id]
                                      }));
                                    }}
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                  >
                                    <div className="flex items-start space-x-4">
                                      <div 
                                        className="w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0"
                                        style={{
                                          background: `radial-gradient(circle, ${goal.color}40 0%, ${goal.color}20 100%)`,
                                          border: `1px solid ${goal.color}60`
                                        }}
                                      >
                                        <goal.icon size={20} color={goal.color} />
                                      </div>
                                      <div className="flex-1">
                                        <h3 className="font-semibold text-white mb-1">{goal.name}</h3>
                                        <p className="text-sm text-white/60">{goal.description}</p>
                                      </div>
                                      {formData.selectedGoals.includes(goal.id) && (
                                        <CheckCircle size={20} className="text-green-400" />
                                      )}
                                    </div>
                                  </motion.div>
                                </MagneticElement>
                              </motion.div>
                            ))}
                          </div>
                        </div>
                      </ScrollReveal>
                    )}

                    {currentStep === 3 && (
                      <ScrollReveal direction="up" delay={0.3}>
                        <div className="w-full">
                          <div className="text-center mb-6">
                            <p className="text-white/80 mb-4">
                              Connected: {formData.connectedPlatforms.length} platforms
                            </p>
                          </div>
                          
                          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                            {socialPlatforms.map((platform, index) => (
                              <motion.div
                                key={platform.id}
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: index * 0.1 }}
                              >
                                <MagneticElement strength={10}>
                                  <motion.div
                                    className={`p-6 rounded-xl border-2 cursor-pointer transition-all duration-300 ${
                                      formData.connectedPlatforms.includes(platform.id)
                                        ? 'border-white/60 bg-white/10'
                                        : 'border-white/20 bg-white/5 hover:border-white/40'
                                    }`}
                                    onClick={() => handlePlatformConnect(platform.id)}
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                  >
                                    <div className="text-center">
                                      <div 
                                        className="w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center"
                                        style={{
                                          background: `radial-gradient(circle, ${platform.color}40 0%, ${platform.color}20 100%)`,
                                          border: `2px solid ${platform.color}60`
                                        }}
                                      >
                                        <platform.icon size={24} color={platform.color} />
                                      </div>
                                      <h3 className="font-semibold text-white mb-2">{platform.name}</h3>
                                      {formData.connectedPlatforms.includes(platform.id) ? (
                                        <div className="flex items-center justify-center text-green-400">
                                          <CheckCircle size={16} className="mr-1" />
                                          <span className="text-sm">Connected</span>
                                        </div>
                                      ) : (
                                        <Button 
                                          variant="ghost" 
                                          size="sm"
                                          className="text-white/60 hover:text-white"
                                        >
                                          <Plus size={16} className="mr-1" />
                                          Connect
                                        </Button>
                                      )}
                                    </div>
                                  </motion.div>
                                </MagneticElement>
                              </motion.div>
                            ))}
                          </div>
                        </div>
                      </ScrollReveal>
                    )}

                    {currentStep === 4 && (
                      <ScrollReveal direction="up" delay={0.3}>
                        <div className="w-full">
                          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {personalities.map((personality, index) => (
                              <motion.div
                                key={personality.id}
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: index * 0.1 }}
                              >
                                <MagneticElement strength={10}>
                                  <motion.div
                                    className={`p-6 rounded-xl border-2 cursor-pointer transition-all duration-300 ${
                                      formData.aiPersonality === personality.id
                                        ? 'border-white/60 bg-white/10'
                                        : 'border-white/20 bg-white/5 hover:border-white/40'
                                    }`}
                                    onClick={() => setFormData(prev => ({ ...prev, aiPersonality: personality.id }))}
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                  >
                                    <div className="text-center">
                                      <div 
                                        className="w-12 h-12 mx-auto mb-4 rounded-full flex items-center justify-center"
                                        style={{
                                          background: `radial-gradient(circle, ${personality.color}40 0%, ${personality.color}20 100%)`,
                                          border: `1px solid ${personality.color}60`
                                        }}
                                      >
                                        <personality.icon size={20} color={personality.color} />
                                      </div>
                                      <h3 className="font-semibold text-white mb-2">{personality.name}</h3>
                                      <p className="text-sm text-white/60">{personality.description}</p>
                                    </div>
                                  </motion.div>
                                </MagneticElement>
                              </motion.div>
                            ))}
                          </div>
                        </div>
                      </ScrollReveal>
                    )}

                    {currentStep === 5 && (
                      <ScrollReveal direction="up" delay={0.3}>
                        <div className="w-full">
                          <div className="text-center mb-6">
                            <p className="text-white/80 mb-4">
                              Selected: {formData.selectedCategories.length} categories
                            </p>
                          </div>
                          
                          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                            {contentCategories.map((category, index) => (
                              <motion.div
                                key={category.id}
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: index * 0.05 }}
                              >
                                <MagneticElement strength={8}>
                                  <motion.div
                                    className={`p-4 rounded-lg border cursor-pointer transition-all duration-300 ${
                                      formData.selectedCategories.includes(category.id)
                                        ? 'border-white/60 bg-white/10'
                                        : 'border-white/20 bg-white/5 hover:border-white/40'
                                    }`}
                                    onClick={() => handleCategoryToggle(category.id)}
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.95 }}
                                  >
                                    <div className="text-center">
                                      <div 
                                        className="w-8 h-8 mx-auto mb-2 rounded-full flex items-center justify-center"
                                        style={{
                                          background: `radial-gradient(circle, ${category.color}40 0%, ${category.color}20 100%)`,
                                          border: `1px solid ${category.color}60`
                                        }}
                                      >
                                        <category.icon size={16} color={category.color} />
                                      </div>
                                      <p className="text-sm font-medium text-white">{category.name}</p>
                                    </div>
                                  </motion.div>
                                </MagneticElement>
                              </motion.div>
                            ))}
                          </div>
                        </div>
                      </ScrollReveal>
                    )}

                    {currentStep === 6 && (
                      <ScrollReveal direction="up" delay={0.3}>
                        <div className="w-full max-w-md space-y-6">
                          <div className="space-y-4">
                            <Label htmlFor="workspace-name" className="text-white font-medium">
                              Workspace Name *
                            </Label>
                            <Input
                              id="workspace-name"
                              type="text"
                              placeholder="Enter your workspace name..."
                              value={formData.workspaceName}
                              onChange={(e) => setFormData(prev => ({ ...prev, workspaceName: e.target.value }))}
                              className="bg-white/10 border-white/20 text-white placeholder:text-white/50 backdrop-blur-sm"
                              required
                            />
                          </div>
                          
                          <div className="space-y-4">
                            <Label htmlFor="description" className="text-white font-medium">
                              Description (Optional)
                            </Label>
                            <Input
                              id="description"
                              type="text"
                              placeholder="Describe your workspace..."
                              value={formData.description}
                              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                              className="bg-white/10 border-white/20 text-white placeholder:text-white/50 backdrop-blur-sm"
                            />
                          </div>
                        </div>
                      </ScrollReveal>
                    )}

                    {currentStep === 7 && (
                      <ScrollReveal direction="up" delay={0.3}>
                        <div className="text-center space-y-8">
                          <motion.div
                            animate={{ 
                              scale: [1, 1.1, 1],
                              rotate: [0, 5, -5, 0]
                            }}
                            transition={{ 
                              duration: 3,
                              repeat: Infinity,
                              ease: "easeInOut"
                            }}
                          >
                            <Rocket size={80} className="mx-auto text-green-400" />
                          </motion.div>
                          
                          <div className="space-y-4">
                            <AnimatedText 
                              text="Setup Complete!"
                              className="text-3xl font-bold text-white"
                              delay={0.5}
                              stagger={0.1}
                            />
                            
                            <div className="space-y-2 text-white/80 text-left max-w-md mx-auto">
                              <p>✓ Business: {formData.businessName}</p>
                              <p>✓ Goals: {formData.selectedGoals.length} selected</p>
                              <p>✓ Platforms: {formData.connectedPlatforms.length} connected</p>
                              <p>✓ AI Personality: {personalities.find(p => p.id === formData.aiPersonality)?.name}</p>
                              <p>✓ Categories: {formData.selectedCategories.length} selected</p>
                              <p>✓ Workspace: {formData.workspaceName}</p>
                            </div>
                          </div>
                          
                          {isLoading && (
                            <motion.div
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              className="space-y-4"
                            >
                              <LiquidLoader progress={85} size={60} color="#10b981" />
                              <TypewriterText 
                                text="Creating your AI empire..."
                                className="text-white/80"
                                speed={80}
                              />
                            </motion.div>
                          )}
                        </div>
                      </ScrollReveal>
                    )}
                  </div>

                  {/* Navigation */}
                  <div className="flex justify-between items-center mt-8">
                    {currentStep > 0 && currentStep < onboardingSteps.length - 1 ? (
                      <HolographicButton
                        onClick={handleBack}
                        glowColor="#6b7280"
                        className="flex items-center gap-2"
                      >
                        <ArrowLeft size={20} />
                        Back
                      </HolographicButton>
                    ) : (
                      <div />
                    )}

                    <div className="flex items-center gap-2">
                      {onboardingSteps.map((_, index) => (
                        <motion.div
                          key={index}
                          className={`w-2 h-2 rounded-full ${
                            index === currentStep ? 'bg-white' : 'bg-white/30'
                          }`}
                          animate={{
                            scale: index === currentStep ? 1.2 : 1,
                            opacity: index === currentStep ? 1 : 0.5
                          }}
                          transition={{ duration: 0.3 }}
                        />
                      ))}
                    </div>

                    {currentStep < onboardingSteps.length - 1 ? (
                      <HolographicButton
                        onClick={handleNext}
                        glowColor={currentStepData.color}
                        className="flex items-center gap-2"
                        disabled={
                          (currentStep === 1 && (!formData.businessName.trim() || !formData.businessDescription.trim())) ||
                          (currentStep === 2 && formData.selectedGoals.length === 0) ||
                          (currentStep === 3 && formData.connectedPlatforms.length === 0) ||
                          (currentStep === 4 && !formData.aiPersonality) ||
                          (currentStep === 5 && formData.selectedCategories.length === 0) ||
                          (currentStep === 6 && !formData.workspaceName.trim())
                        }
                      >
                        Next
                        <ArrowRight size={20} />
                      </HolographicButton>
                    ) : (
                      <HolographicButton
                        onClick={handleComplete}
                        glowColor="#10b981"
                        className="flex items-center gap-2"
                        disabled={isLoading}
                      >
                        {isLoading ? (
                          <>
                            <motion.div
                              animate={{ rotate: 360 }}
                              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                            >
                              <Sparkles size={20} />
                            </motion.div>
                            Creating...
                          </>
                        ) : (
                          <>
                            Launch
                            <Rocket size={20} />
                          </>
                        )}
                      </HolographicButton>
                    )}
                  </div>
                </div>
              </ThreeDCard>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}