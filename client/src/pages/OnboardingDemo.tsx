import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
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
import { 
  Rocket,
  Sparkles,
  Star,
  Brain,
  Shield,
  Zap,
  Atom,
  Heart,
  Users,
  Wand2,
  Cpu,
  Building,
  Camera,
  Video,
  Utensils,
  Plane,
  Shirt,
  Gamepad2,
  Music,
  GraduationCap,
  Car,
  Home,
  ShoppingCart,
  Baby,
  PawPrint
} from 'lucide-react';

const demoSteps = [
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
    title: 'Brand Identity Matrix',
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
    icon: Zap,
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
  }
];

const personalities = [
  { id: 'professional', name: 'Corporate Mastermind', description: 'Sophisticated, authoritative, and strategic', icon: Shield, color: '#1e293b' },
  { id: 'friendly', name: 'Social Catalyst', description: 'Warm, engaging, and approachable', icon: Heart, color: '#f97316' },
  { id: 'creative', name: 'Artistic Visionary', description: 'Innovative, expressive, and imaginative', icon: Wand2, color: '#a855f7' }
];

const businessGoals = [
  { id: 'brand-awareness', name: 'Brand Awareness', description: 'Increase visibility and recognition', icon: Star, color: '#3b82f6' },
  { id: 'lead-generation', name: 'Lead Generation', description: 'Generate qualified prospects', icon: Users, color: '#10b981' },
  { id: 'sales-growth', name: 'Sales Growth', description: 'Drive revenue and conversions', icon: Zap, color: '#f59e0b' },
  { id: 'engagement', name: 'Engagement', description: 'Build community and loyalty', icon: Heart, color: '#ec4899' },
  { id: 'thought-leadership', name: 'Thought Leadership', description: 'Establish industry authority', icon: Brain, color: '#8b5cf6' },
  { id: 'customer-support', name: 'Customer Support', description: 'Enhance customer experience', icon: Shield, color: '#6b7280' }
];

const socialPlatforms = [
  { id: 'instagram', name: 'Instagram', description: 'Visual storytelling & reels', icon: Camera, color: '#e4405f', connected: false },
  { id: 'youtube', name: 'YouTube', description: 'Video content & tutorials', icon: Video, color: '#ff0000', connected: false },
  { id: 'twitter', name: 'X (Twitter)', description: 'Real-time updates & news', icon: Wand2, color: '#1da1f2', connected: false },
  { id: 'linkedin', name: 'LinkedIn', description: 'Professional networking', icon: Building, color: '#0077b5', connected: false },
  { id: 'tiktok', name: 'TikTok', description: 'Short-form viral content', icon: Music, color: '#000000', connected: false },
  { id: 'facebook', name: 'Facebook', description: 'Community building', icon: Users, color: '#1877f2', connected: false }
];

const categories = [
  { id: 'technology', name: 'Technology', icon: Cpu, color: '#3b82f6' },
  { id: 'lifestyle', name: 'Lifestyle', icon: Heart, color: '#ec4899' },
  { id: 'business', name: 'Business', icon: Building, color: '#059669' },
  { id: 'travel', name: 'Travel', icon: Plane, color: '#0891b2' },
  { id: 'fashion', name: 'Fashion', icon: Shirt, color: '#7c3aed' },
  { id: 'gaming', name: 'Gaming', icon: Gamepad2, color: '#dc2626' },
  { id: 'food', name: 'Food & Dining', icon: Utensils, color: '#dc2626' },
  { id: 'fitness', name: 'Health & Fitness', icon: Heart, color: '#10b981' },
  { id: 'education', name: 'Education', icon: GraduationCap, color: '#f59e0b' },
  { id: 'automotive', name: 'Automotive', icon: Car, color: '#6b7280' },
  { id: 'real-estate', name: 'Real Estate', icon: Home, color: '#8b5cf6' },
  { id: 'ecommerce', name: 'E-commerce', icon: ShoppingCart, color: '#059669' }
];

export default function OnboardingDemo() {
  const [currentStep, setCurrentStep] = useState(0);
  const [progress, setProgress] = useState(0);
  const [businessName, setBusinessName] = useState('');
  const [businessDescription, setBusinessDescription] = useState('');
  const [selectedGoals, setSelectedGoals] = useState<string[]>([]);
  const [connectedPlatforms, setConnectedPlatforms] = useState<string[]>([]);
  const [selectedPersonality, setSelectedPersonality] = useState('');
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);

  useEffect(() => {
    setProgress((currentStep / (demoSteps.length - 1)) * 100);
  }, [currentStep]);

  const currentStepData = demoSteps[currentStep];

  const handleNext = () => {
    if (currentStep < demoSteps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleGoalToggle = (goalId: string) => {
    setSelectedGoals(prev => 
      prev.includes(goalId)
        ? prev.filter(id => id !== goalId)
        : [...prev, goalId]
    );
  };

  const handlePlatformToggle = (platformId: string) => {
    setConnectedPlatforms(prev => 
      prev.includes(platformId)
        ? prev.filter(id => id !== platformId)
        : [...prev, platformId]
    );
  };

  const handleCategoryToggle = (categoryId: string) => {
    setSelectedCategories(prev => 
      prev.includes(categoryId)
        ? prev.filter(id => id !== categoryId)
        : [...prev, categoryId]
    );
  };

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
                        <div className="w-full max-w-2xl mx-auto">
                          <div className="space-y-6">
                            {/* Business Name Input */}
                            <div>
                              <label className="block text-white/80 text-sm font-medium mb-2">
                                Business Name *
                              </label>
                              <input
                                type="text"
                                value={businessName}
                                onChange={(e) => setBusinessName(e.target.value)}
                                placeholder="Enter your business or brand name"
                                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:border-white/60 focus:bg-white/15 transition-all duration-300"
                              />
                            </div>

                            {/* Business Description */}
                            <div>
                              <label className="block text-white/80 text-sm font-medium mb-2">
                                Business Description
                              </label>
                              <textarea
                                value={businessDescription}
                                onChange={(e) => setBusinessDescription(e.target.value)}
                                placeholder="Tell us what your business does and what makes it unique..."
                                rows={4}
                                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:border-white/60 focus:bg-white/15 transition-all duration-300 resize-none"
                              />
                            </div>

                            {/* Preview Card */}
                            {businessName && (
                              <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="mt-6 p-4 bg-white/5 border border-white/20 rounded-lg"
                              >
                                <div className="flex items-center gap-3">
                                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                                    <span className="text-white font-bold text-lg">
                                      {businessName.charAt(0).toUpperCase()}
                                    </span>
                                  </div>
                                  <div>
                                    <h3 className="text-white font-semibold">{businessName}</h3>
                                    {businessDescription && (
                                      <p className="text-white/60 text-sm mt-1">
                                        {businessDescription.substring(0, 60)}
                                        {businessDescription.length > 60 ? '...' : ''}
                                      </p>
                                    )}
                                  </div>
                                </div>
                              </motion.div>
                            )}
                          </div>
                        </div>
                      </ScrollReveal>
                    )}

                    {currentStep === 2 && (
                      <ScrollReveal direction="up" delay={0.3}>
                        <div className="w-full">
                          <div className="text-center mb-6">
                            <p className="text-white/80 mb-4">
                              Selected: {selectedGoals.length} goals
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
                                <MagneticElement strength={8}>
                                  <motion.div
                                    className={`p-4 rounded-lg border cursor-pointer transition-all duration-300 ${
                                      selectedGoals.includes(goal.id)
                                        ? 'border-white/60 bg-white/10'
                                        : 'border-white/20 bg-white/5 hover:border-white/40'
                                    }`}
                                    onClick={() => handleGoalToggle(goal.id)}
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.95 }}
                                  >
                                    <div className="flex items-start gap-3">
                                      <div 
                                        className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0"
                                        style={{
                                          background: `radial-gradient(circle, ${goal.color}40 0%, ${goal.color}20 100%)`,
                                          border: `1px solid ${goal.color}60`
                                        }}
                                      >
                                        <goal.icon size={18} color={goal.color} />
                                      </div>
                                      <div>
                                        <h3 className="font-semibold text-white mb-1">{goal.name}</h3>
                                        <p className="text-sm text-white/60">{goal.description}</p>
                                      </div>
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
                              Connected: {connectedPlatforms.length} platforms
                            </p>
                          </div>
                          
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {socialPlatforms.map((platform, index) => (
                              <motion.div
                                key={platform.id}
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: index * 0.1 }}
                              >
                                <MagneticElement strength={8}>
                                  <motion.div
                                    className={`p-4 rounded-lg border cursor-pointer transition-all duration-300 ${
                                      connectedPlatforms.includes(platform.id)
                                        ? 'border-green-400/60 bg-green-400/10'
                                        : 'border-white/20 bg-white/5 hover:border-white/40'
                                    }`}
                                    onClick={() => handlePlatformToggle(platform.id)}
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.95 }}
                                  >
                                    <div className="flex items-center justify-between">
                                      <div className="flex items-center gap-3">
                                        <div 
                                          className="w-10 h-10 rounded-lg flex items-center justify-center"
                                          style={{
                                            background: `radial-gradient(circle, ${platform.color}40 0%, ${platform.color}20 100%)`,
                                            border: `1px solid ${platform.color}60`
                                          }}
                                        >
                                          <platform.icon size={18} color={platform.color} />
                                        </div>
                                        <div>
                                          <h3 className="font-semibold text-white">{platform.name}</h3>
                                          <p className="text-sm text-white/60">{platform.description}</p>
                                        </div>
                                      </div>
                                      
                                      {connectedPlatforms.includes(platform.id) && (
                                        <motion.div
                                          initial={{ scale: 0 }}
                                          animate={{ scale: 1 }}
                                          className="w-6 h-6 bg-green-400 rounded-full flex items-center justify-center"
                                        >
                                          <span className="text-white text-xs">✓</span>
                                        </motion.div>
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
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
                                      selectedPersonality === personality.id
                                        ? 'border-white/60 bg-white/10'
                                        : 'border-white/20 bg-white/5 hover:border-white/40'
                                    }`}
                                    onClick={() => setSelectedPersonality(personality.id)}
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
                              Selected: {selectedCategories.length} categories
                            </p>
                          </div>
                          
                          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                            {categories.map((category, index) => (
                              <motion.div
                                key={category.id}
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: index * 0.05 }}
                              >
                                <MagneticElement strength={8}>
                                  <motion.div
                                    className={`p-4 rounded-lg border cursor-pointer transition-all duration-300 ${
                                      selectedCategories.includes(category.id)
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
                  </div>

                  {/* Navigation */}
                  <div className="flex justify-between items-center mt-8">
                    {currentStep > 0 ? (
                      <HolographicButton
                        onClick={handleBack}
                        glowColor="#6b7280"
                        className="flex items-center gap-2"
                      >
                        ← Back
                      </HolographicButton>
                    ) : (
                      <div />
                    )}

                    <div className="flex items-center gap-2">
                      {demoSteps.map((_, index) => (
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

                    {currentStep < demoSteps.length - 1 ? (
                      <HolographicButton
                        onClick={handleNext}
                        glowColor={currentStepData.color}
                        className="flex items-center gap-2"
                      >
                        Next →
                      </HolographicButton>
                    ) : (
                      <HolographicButton
                        onClick={() => {
                          const summary = `
🚀 VeeFore Setup Complete!

📊 Business Profile:
• Name: ${businessName || 'Not provided'}
• Description: ${businessDescription || 'Not provided'}

🎯 Goals (${selectedGoals.length} selected):
${selectedGoals.map(id => businessGoals.find(g => g.id === id)?.name).filter(Boolean).join(', ') || 'None selected'}

🌐 Connected Platforms (${connectedPlatforms.length}):
${connectedPlatforms.map(id => socialPlatforms.find(p => p.id === id)?.name).filter(Boolean).join(', ') || 'None connected'}

🤖 AI Personality:
${personalities.find(p => p.id === selectedPersonality)?.name || 'Not selected'}

🏷️ Content Categories (${selectedCategories.length}):
${selectedCategories.map(id => categories.find(c => c.id === id)?.name).filter(Boolean).join(', ') || 'None selected'}

Your AI is now configured to create personalized content for your brand!
                          `;
                          alert(summary);
                        }}
                        glowColor="#10b981"
                        className="flex items-center gap-2"
                      >
                        Launch VeeFore
                        <Zap size={20} />
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