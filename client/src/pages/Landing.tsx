import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Rocket, 
  Brain, 
  Users, 
  TrendingUp, 
  Bot, 
  MessageCircle, 
  BarChart3, 
  Calendar,
  Sparkles,
  Globe,
  Hash,
  Instagram,
  ArrowRight,
  Check,
  Play,
  ChevronDown,
  Crown,
  FileText,
  Youtube,
  Twitter,
  Facebook,
  Linkedin,
  Zap,
  Target,
  Eye,
  Cpu,
  Layers,
  Activity,
  Wifi,
  Smartphone,
  Monitor,
  Camera,
  Video,
  Mic,
  Image,
  Palette,
  Wand2,
  RotateCcw,
  Clock,
  Bell,
  Search,
  Filter,
  BarChart2,
  PieChart,
  TrendingDown,
  Award,
  Star
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Link } from 'wouter';

// Enhanced Animation Components with 3D Effects
const AnimatedCounter = ({ end, suffix = "" }: { end: number; suffix?: string }) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCount(prev => {
        if (prev < end) {
          return Math.min(prev + Math.ceil(end / 100), end);
        }
        return end;
      });
    }, 50);
    return () => clearInterval(timer);
  }, [end]);

  return <span>{count}{suffix}</span>;
};

const TypewriterEffect = ({ texts, speed = 100 }: { texts: string[]; speed?: number }) => {
  const [currentText, setCurrentText] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isTyping, setIsTyping] = useState(true);

  useEffect(() => {
    const text = texts[currentIndex];
    
    if (isTyping) {
      if (currentText.length < text.length) {
        const timeout = setTimeout(() => {
          setCurrentText(text.substring(0, currentText.length + 1));
        }, speed);
        return () => clearTimeout(timeout);
      } else {
        const timeout = setTimeout(() => setIsTyping(false), 2000);
        return () => clearTimeout(timeout);
      }
    } else {
      if (currentText.length > 0) {
        const timeout = setTimeout(() => {
          setCurrentText(currentText.substring(0, currentText.length - 1));
        }, speed / 2);
        return () => clearTimeout(timeout);
      } else {
        setCurrentIndex((prev) => (prev + 1) % texts.length);
        setIsTyping(true);
      }
    }
  }, [currentText, currentIndex, isTyping, texts, speed]);

  return (
    <span className="min-h-[1em] inline-block">
      {currentText}
      <motion.span
        animate={{ opacity: [1, 0, 1] }}
        transition={{ duration: 0.8, repeat: Infinity, ease: "easeInOut" }}
        className="ml-1"
      >
        |
      </motion.span>
    </span>
  );
};

const FloatingOrb = ({ delay = 0, size = "w-4 h-4" }: { delay?: number; size?: string }) => (
  <motion.div
    className={`absolute ${size} bg-gradient-to-r from-blue-400 to-purple-500 rounded-full opacity-60`}
    style={{
      left: `${Math.random() * 100}%`,
      top: `${Math.random() * 100}%`,
    }}
    animate={{
      y: [0, -30, 0],
      x: [0, 20, 0],
      scale: [1, 1.2, 1],
      opacity: [0.3, 0.8, 0.3],
    }}
    transition={{
      duration: 3 + Math.random() * 2,
      repeat: Infinity,
      delay: delay,
      ease: "easeInOut"
    }}
  />
);

const Particle3D = ({ index }: { index: number }) => (
  <motion.div
    className="absolute w-2 h-2 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-full"
    style={{
      left: `${Math.random() * 100}%`,
      top: `${Math.random() * 100}%`,
    }}
    animate={{
      rotateX: [0, 360],
      rotateY: [0, 360],
      y: [0, -40, 0],
      scale: [0.5, 1, 0.5],
      opacity: [0.2, 1, 0.2],
    }}
    transition={{
      duration: 4 + index * 0.3,
      repeat: Infinity,
      delay: index * 0.2,
      ease: "linear"
    }}
  />
);

const AnimatedFeatureCard = ({ 
  icon: Icon, 
  title, 
  description, 
  gradient, 
  delay = 0,
  visualElements
}: any) => (
  <motion.div
    initial={{ opacity: 0, y: 100, rotateX: -15 }}
    whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
    viewport={{ once: true }}
    transition={{ 
      duration: 0.8, 
      delay,
      type: "spring",
      stiffness: 100
    }}
    whileHover={{ 
      scale: 1.05,
      rotateY: 5,
      rotateX: 5,
      transition: { duration: 0.3 }
    }}
    className="relative bg-gradient-to-br from-gray-900/80 to-black/80 backdrop-blur-xl rounded-3xl p-8 border border-white/10 overflow-hidden transform-gpu perspective-1000"
  >
    {/* Optimized Background Elements */}
    <div className="absolute inset-0 overflow-hidden">
      {[...Array(3)].map((_, i) => (
        <FloatingOrb key={i} delay={i * 0.8} size="w-2 h-2" />
      ))}
    </div>

    {/* 3D Icon Container */}
    <motion.div
      animate={{ 
        rotateY: [0, 10, 0],
        rotateX: [0, 5, 0]
      }}
      transition={{ 
        duration: 6,
        repeat: Infinity,
        ease: "easeInOut"
      }}
      className={`relative w-20 h-20 rounded-2xl bg-gradient-to-br ${gradient} flex items-center justify-center mb-6 shadow-2xl`}
      style={{ transformStyle: "preserve-3d" }}
    >
      <Icon size={32} className="text-white relative z-10" />
      <div className={`absolute inset-0 bg-gradient-to-br ${gradient} rounded-2xl blur-lg opacity-50`} />
    </motion.div>

    <h3 className="text-2xl font-bold mb-4 text-white">{title}</h3>
    <p className="text-gray-300 leading-relaxed mb-6">{description}</p>

    {/* Visual Elements Grid */}
    <div className="grid grid-cols-2 gap-3">
      {visualElements.map((element: any, index: number) => {
        const ElementIcon = element.icon;
        return (
          <motion.div
            key={index}
            initial={{ scale: 0, rotate: -180 }}
            whileInView={{ scale: 1, rotate: 0 }}
            viewport={{ once: true }}
            transition={{ 
              delay: delay + index * 0.1,
              type: "spring",
              stiffness: 200
            }}
            whileHover={{ scale: 1.1, rotate: 5 }}
            className={`p-3 rounded-xl ${element.color} flex flex-col items-center gap-2 cursor-pointer transform-gpu`}
          >
            <ElementIcon className="w-6 h-6 text-white" />
            <span className="text-white text-xs font-medium">{element.name}</span>
            <motion.div
              className="w-full h-1 bg-white/20 rounded-full overflow-hidden"
              initial={{ width: 0 }}
              whileInView={{ width: "100%" }}
              viewport={{ once: true }}
              transition={{ delay: delay + index * 0.2 + 0.5, duration: 1 }}
            >
              <motion.div
                className="h-full bg-white rounded-full"
                initial={{ width: 0 }}
                whileInView={{ width: `${60 + Math.random() * 40}%` }}
                viewport={{ once: true }}
                transition={{ delay: delay + index * 0.2 + 0.8, duration: 1.5 }}
              />
            </motion.div>
          </motion.div>
        );
      })}
    </div>
  </motion.div>
);

const Landing = () => {
  const heroFeatures = [
    "AI-Powered Multi-Platform Content Generation",
    "Instagram • YouTube • Twitter • Facebook • LinkedIn Automation", 
    "Real-Time Cross-Platform Analytics & Intelligence",
    "100% Automated DM & Comment Responses Across All Networks",
    "Unified Social Media Management Dashboard",
    "Viral Hashtag Discovery & Trend Analysis Engine"
  ];

  const platforms = [
    { icon: Instagram, name: "Instagram", color: "bg-gradient-to-br from-pink-500 to-orange-500" },
    { icon: Youtube, name: "YouTube", color: "bg-gradient-to-br from-red-500 to-red-600" },
    { icon: Twitter, name: "Twitter", color: "bg-gradient-to-br from-blue-400 to-blue-500" },
    { icon: Facebook, name: "Facebook", color: "bg-gradient-to-br from-blue-600 to-blue-700" },
    { icon: Linkedin, name: "LinkedIn", color: "bg-gradient-to-br from-blue-500 to-blue-600" },
    { icon: Globe, name: "All Platforms", color: "bg-gradient-to-br from-purple-500 to-purple-600" }
  ];

  const features = [
    {
      icon: Brain,
      title: "AI-Powered Content Generation",
      description: "Revolutionary AI creates viral content optimized for each platform's algorithm and audience behavior patterns.",
      gradient: "from-purple-600 via-blue-600 to-cyan-600",
      visualElements: [
        { icon: Wand2, name: "AI Magic", color: "bg-gradient-to-br from-purple-500 to-pink-500" },
        { icon: Palette, name: "Creative", color: "bg-gradient-to-br from-orange-500 to-red-500" },
        { icon: Target, name: "Targeted", color: "bg-gradient-to-br from-green-500 to-teal-500" },
        { icon: Star, name: "Viral", color: "bg-gradient-to-br from-yellow-500 to-orange-500" }
      ]
    },
    {
      icon: Globe,
      title: "Unified Multi-Platform Hub",
      description: "Command center for all your social media accounts with real-time synchronization and cross-platform insights.",
      gradient: "from-green-600 via-teal-600 to-blue-600",
      visualElements: [
        { icon: Monitor, name: "Dashboard", color: "bg-gradient-to-br from-blue-500 to-indigo-500" },
        { icon: Wifi, name: "Connected", color: "bg-gradient-to-br from-green-500 to-blue-500" },
        { icon: Layers, name: "Unified", color: "bg-gradient-to-br from-purple-500 to-blue-500" },
        { icon: Activity, name: "Real-time", color: "bg-gradient-to-br from-red-500 to-pink-500" }
      ]
    },
    {
      icon: Bot,
      title: "Smart AI Automation Engine",
      description: "Advanced AI responds contextually to every interaction across all platforms with human-like conversations.",
      gradient: "from-orange-600 via-red-600 to-pink-600",
      visualElements: [
        { icon: Cpu, name: "AI Brain", color: "bg-gradient-to-br from-cyan-500 to-blue-500" },
        { icon: MessageCircle, name: "Chat", color: "bg-gradient-to-br from-green-500 to-teal-500" },
        { icon: Zap, name: "Instant", color: "bg-gradient-to-br from-yellow-500 to-orange-500" },
        { icon: Award, name: "Smart", color: "bg-gradient-to-br from-purple-500 to-pink-500" }
      ]
    },
    {
      icon: BarChart3,
      title: "Advanced Analytics Intelligence",
      description: "Deep insights and predictive analytics across all platforms with actionable growth recommendations.",
      gradient: "from-blue-600 via-indigo-600 to-purple-600",
      visualElements: [
        { icon: Eye, name: "Insights", color: "bg-gradient-to-br from-indigo-500 to-purple-500" },
        { icon: TrendingUp, name: "Growth", color: "bg-gradient-to-br from-green-500 to-emerald-500" },
        { icon: PieChart, name: "Reports", color: "bg-gradient-to-br from-blue-500 to-cyan-500" },
        { icon: Filter, name: "Analysis", color: "bg-gradient-to-br from-purple-500 to-pink-500" }
      ]
    },
    {
      icon: Hash,
      title: "Viral Hashtag Discovery",
      description: "AI-powered hashtag research engine that discovers trending tags and predicts viral potential across networks.",
      gradient: "from-pink-600 via-rose-600 to-red-600",
      visualElements: [
        { icon: Search, name: "Discovery", color: "bg-gradient-to-br from-blue-500 to-indigo-500" },
        { icon: TrendingUp, name: "Trending", color: "bg-gradient-to-br from-red-500 to-pink-500" },
        { icon: Target, name: "Targeted", color: "bg-gradient-to-br from-green-500 to-teal-500" },
        { icon: Sparkles, name: "Viral", color: "bg-gradient-to-br from-yellow-500 to-orange-500" }
      ]
    },
    {
      icon: Calendar,
      title: "Intelligent Scheduling System",
      description: "AI determines optimal posting times for each platform and automatically schedules content for maximum engagement.",
      gradient: "from-cyan-600 via-blue-600 to-indigo-600",
      visualElements: [
        { icon: Clock, name: "Timing", color: "bg-gradient-to-br from-blue-500 to-cyan-500" },
        { icon: Bell, name: "Alerts", color: "bg-gradient-to-br from-orange-500 to-red-500" },
        { icon: RotateCcw, name: "Auto", color: "bg-gradient-to-br from-green-500 to-teal-500" },
        { icon: Target, name: "Optimal", color: "bg-gradient-to-br from-purple-500 to-pink-500" }
      ]
    }
  ];

  const advancedFeatures = [
    {
      icon: Camera,
      title: "Visual Content AI",
      description: "Generate stunning images, videos, and graphics tailored for each platform",
      gradient: "from-pink-500 to-rose-500",
      features: ["AI Image Generation", "Video Creation", "Graphic Design", "Brand Assets"]
    },
    {
      icon: Smartphone,
      title: "Mobile-First Design", 
      description: "Optimized for mobile users across all social media platforms",
      gradient: "from-blue-500 to-indigo-500",
      features: ["Responsive Design", "Touch Optimized", "Fast Loading", "Cross-Device"]
    },
    {
      icon: Video,
      title: "Video Intelligence",
      description: "Advanced video content creation and optimization for maximum engagement",
      gradient: "from-purple-500 to-violet-500",
      features: ["Video AI", "Auto Editing", "Captions", "Thumbnails"]
    }
  ];

  const stats = [
    { label: "Cross-Platform Content Generated", value: "2M+", icon: FileText },
    { label: "Automated Interactions Daily", value: "500K+", icon: MessageCircle },
    { label: "Businesses Automated", value: "10K+", icon: Users },
    { label: "Average Engagement Increase", value: "300%", icon: TrendingUp }
  ];

  const pricingPlans = [
    {
      name: "Free Explorer",
      price: "₹0",
      period: "/month",
      description: "Perfect for individual creators starting their journey",
      features: [
        "1 Workspace",
        "Connect 1 social account",
        "Basic AI content generation",
        "Basic analytics dashboard",
        "Community support"
      ],
      popular: false,
      gradient: "from-gray-600 to-gray-700"
    },
    {
      name: "Pro Creator",
      price: "₹999",
      period: "/month",
      description: "For growing businesses and serious influencers",
      features: [
        "5 Workspaces",
        "Connect up to 5 social accounts",
        "Advanced AI content generation",
        "Real-time multi-platform analytics",
        "100% DM automation across all platforms",
        "Comment management & responses",
        "Smart scheduling for all networks",
        "Viral hashtag research engine",
        "Priority support"
      ],
      popular: true,
      gradient: "from-blue-600 to-purple-600"
    },
    {
      name: "Enterprise Agency",
      price: "₹2,999",
      period: "/month",
      description: "For agencies and large-scale operations",
      features: [
        "Unlimited workspaces",
        "Unlimited social accounts",
        "Enterprise AI features",
        "Advanced multi-platform analytics",
        "Unlimited automation",
        "White-label solution",
        "API access & integrations",
        "Custom AI training",
        "Dedicated account manager",
        "24/7 priority support"
      ],
      popular: false,
      gradient: "from-purple-600 to-pink-600"
    }
  ];

  return (
    <div className="min-h-screen bg-black text-white overflow-hidden relative">
      {/* Header Navigation */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-black/80 backdrop-blur-xl border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center">
            <motion.h1 
              className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent"
              whileHover={{ scale: 1.05 }}
            >
              VeeFore
            </motion.h1>
          </div>
          
          <nav className="hidden md:flex items-center space-x-8">
            <a href="#features" className="text-gray-300 hover:text-white transition-colors">Features</a>
            <a href="#pricing" className="text-gray-300 hover:text-white transition-colors">Pricing</a>
            <a href="#about" className="text-gray-300 hover:text-white transition-colors">About</a>
            <a href="#contact" className="text-gray-300 hover:text-white transition-colors">Contact</a>
          </nav>

          <div className="flex items-center space-x-4">
            <Button 
              variant="ghost" 
              className="text-white hover:bg-white/10"
            >
              Sign In
            </Button>
            <Link href="/onboarding">
              <Button 
                className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white"
              >
                Get Started
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Optimized Background */}
      <div className="fixed inset-0 bg-gradient-to-br from-purple-900/20 via-blue-900/20 to-black">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,rgba(120,119,198,0.2),transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_70%,rgba(168,85,247,0.15),transparent_50%)]" />
      </div>

      {/* Reduced Floating Particles */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        {[...Array(8)].map((_, i) => (
          <Particle3D key={i} index={i} />
        ))}
      </div>

      {/* Hero Section with Enhanced Animations */}
      <section className="relative min-h-screen flex items-center justify-center px-4">
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.5 }}
          className="relative z-10 text-center max-w-7xl mx-auto"
        >
          {/* Animated Hero Badge */}
          <motion.div
            initial={{ opacity: 0, y: -30, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ delay: 0.3, type: "spring", stiffness: 200 }}
            className="mb-8"
          >
            <Badge className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-8 py-3 text-lg border-0 shadow-lg">
              <motion.div
                animate={{ rotate: [0, 360] }}
                transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
              >
                <Sparkles className="w-5 h-5 mr-3" />
              </motion.div>
              The Future of Multi-Platform Social Media Automation
            </Badge>
          </motion.div>

          {/* 3D Animated Headline */}
          <motion.h1 
            initial={{ opacity: 0, y: 50, rotateX: -15 }}
            animate={{ opacity: 1, y: 0, rotateX: 0 }}
            transition={{ delay: 0.5, duration: 1, type: "spring" }}
            className="text-6xl md:text-8xl font-bold mb-6 bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 bg-clip-text text-transparent transform-gpu"
            style={{ transformStyle: "preserve-3d" }}
          >
            <motion.span
              animate={{ 
                rotateY: [0, 5, 0],
                scale: [1, 1.02, 1]
              }}
              transition={{ 
                duration: 4,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            >
              VeeFore
            </motion.span>
          </motion.h1>

          {/* Enhanced Typewriter with 3D Effects */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="text-2xl md:text-4xl font-semibold mb-4 h-20 flex items-center justify-center"
          >
            <motion.div
              animate={{ 
                rotateX: [0, 2, 0],
                scale: [1, 1.01, 1]
              }}
              transition={{ 
                duration: 3,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            >
              <TypewriterEffect 
                texts={heroFeatures}
                speed={60}
              />
            </motion.div>
          </motion.div>

          {/* 3D Platform Icons with Advanced Animations */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1 }}
            className="flex justify-center gap-4 mb-12 flex-wrap"
          >
            {platforms.map((platform, index) => {
              const IconComponent = platform.icon;
              return (
                <motion.div
                  key={platform.name}
                  initial={{ scale: 0, rotate: -180, opacity: 0 }}
                  animate={{ scale: 1, rotate: 0, opacity: 1 }}
                  transition={{ 
                    delay: 1.2 + index * 0.1,
                    type: "spring",
                    stiffness: 200,
                    damping: 15
                  }}
                  whileHover={{ 
                    scale: 1.2,
                    rotateY: 15,
                    rotateX: 10,
                    transition: { duration: 0.3 }
                  }}
                  className={`w-16 h-16 rounded-2xl ${platform.color} flex items-center justify-center shadow-2xl cursor-pointer transform-gpu relative overflow-hidden`}
                  style={{ transformStyle: "preserve-3d" }}
                >
                  <IconComponent className="w-8 h-8 text-white relative z-10" />
                  <motion.div
                    className="absolute inset-0 bg-white/20"
                    animate={{ 
                      scale: [1, 1.2, 1],
                      opacity: [0, 0.3, 0]
                    }}
                    transition={{ 
                      duration: 2,
                      repeat: Infinity,
                      delay: index * 0.3
                    }}
                  />
                </motion.div>
              );
            })}
          </motion.div>

          {/* Enhanced Description */}
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.5 }}
            className="text-xl md:text-2xl text-gray-300 mb-12 max-w-5xl mx-auto leading-relaxed"
          >
            Transform your entire social media presence with cutting-edge AI automation. 
            Manage Instagram, YouTube, Twitter, Facebook, LinkedIn and more from one powerful dashboard 
            with intelligent content generation and 100% automated engagement.
          </motion.p>

          {/* Animated CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.8 }}
            className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-16"
          >
            <Link href="/onboarding">
              <motion.div
                whileHover={{ 
                  scale: 1.05,
                  boxShadow: "0 20px 40px rgba(139, 92, 246, 0.3)"
                }}
                whileTap={{ scale: 0.95 }}
                animate={{
                  boxShadow: [
                    "0 0 20px rgba(139, 92, 246, 0.2)",
                    "0 0 30px rgba(139, 92, 246, 0.4)",
                    "0 0 20px rgba(139, 92, 246, 0.2)"
                  ]
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              >
                <Button 
                  size="lg"
                  className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white px-12 py-4 text-xl font-semibold rounded-full shadow-lg"
                >
                  <motion.div
                    animate={{ rotate: [0, 360] }}
                    transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                  >
                    <Rocket className="w-6 h-6 mr-3" />
                  </motion.div>
                  Start Free Trial
                  <ArrowRight className="w-6 h-6 ml-3" />
                </Button>
              </motion.div>
            </Link>
            
            <motion.div
              whileHover={{ 
                scale: 1.05,
                borderColor: "rgba(255, 255, 255, 0.5)"
              }}
              whileTap={{ scale: 0.95 }}
            >
              <Button 
                variant="outline" 
                size="lg"
                className="border-2 border-white/30 text-white hover:bg-white/10 px-12 py-4 text-xl font-semibold rounded-full backdrop-blur-sm"
              >
                <Play className="w-6 h-6 mr-3" />
                Watch Demo
              </Button>
            </motion.div>
          </motion.div>

          {/* Enhanced Animated Stats */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 2 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-5xl mx-auto"
          >
            {stats.map((stat, index) => {
              const IconComponent = stat.icon;
              return (
                <motion.div 
                  key={index} 
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ 
                    delay: 2.2 + index * 0.1,
                    type: "spring",
                    stiffness: 150
                  }}
                  whileHover={{ 
                    scale: 1.1,
                    rotateY: 10,
                    transition: { duration: 0.3 }
                  }}
                  className="text-center transform-gpu"
                >
                  <motion.div 
                    className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-purple-500/20 to-blue-500/20 border border-white/20 mb-4 relative overflow-hidden"
                    animate={{
                      rotate: [0, 360]
                    }}
                    transition={{
                      duration: 8,
                      repeat: Infinity,
                      ease: "linear"
                    }}
                  >
                    <IconComponent className="w-8 h-8 text-blue-400 relative z-10" />
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-r from-purple-500/30 to-blue-500/30"
                      animate={{
                        scale: [1, 1.2, 1],
                        opacity: [0.3, 0.6, 0.3]
                      }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                        delay: index * 0.2
                      }}
                    />
                  </motion.div>
                  <div className="text-3xl font-bold text-white mb-2">
                    <AnimatedCounter end={parseInt(stat.value.replace(/[^\d]/g, ''))} suffix={stat.value.replace(/[\d]/g, '')} />
                  </div>
                  <div className="text-gray-400 text-sm">{stat.label}</div>
                </motion.div>
              );
            })}
          </motion.div>
        </motion.div>

        {/* Enhanced Scroll Indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2.5 }}
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
        >
          <motion.div
            animate={{ y: [0, 15, 0] }}
            transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
            className="flex flex-col items-center text-white/60"
          >
            <span className="text-sm mb-2">Explore Features</span>
            <motion.div
              animate={{ rotate: [0, 180, 360] }}
              transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
            >
              <ChevronDown className="w-6 h-6" />
            </motion.div>
          </motion.div>
        </motion.div>
      </section>

      {/* Enhanced Features Section with 3D Cards */}
      <section id="features" className="relative py-32 px-4 pt-40">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center mb-20"
          >
            <h2 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              Revolutionary Features
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Advanced AI-powered tools designed to dominate every social media platform
            </p>
          </motion.div>

          <div className="grid lg:grid-cols-3 gap-8 mb-20">
            {features.map((feature, index) => (
              <AnimatedFeatureCard
                key={index}
                {...feature}
                delay={index * 0.2}
              />
            ))}
          </div>

          {/* Advanced Features Row */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="grid md:grid-cols-3 gap-8"
          >
            {advancedFeatures.map((feature, index) => {
              const IconComponent = feature.icon;
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.8, rotateY: -15 }}
                  whileInView={{ opacity: 1, scale: 1, rotateY: 0 }}
                  viewport={{ once: true }}
                  transition={{ 
                    delay: index * 0.2,
                    duration: 0.8,
                    type: "spring"
                  }}
                  whileHover={{
                    scale: 1.05,
                    rotateY: 5,
                    transition: { duration: 0.3 }
                  }}
                  className="relative bg-gradient-to-br from-gray-900/80 to-black/80 backdrop-blur-xl rounded-3xl p-6 border border-white/10 overflow-hidden transform-gpu"
                  style={{ transformStyle: "preserve-3d" }}
                >
                  <motion.div
                    animate={{
                      rotateZ: [0, 360]
                    }}
                    transition={{
                      duration: 10,
                      repeat: Infinity,
                      ease: "linear"
                    }}
                    className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${feature.gradient} flex items-center justify-center mb-4 shadow-xl relative`}
                  >
                    <IconComponent size={24} className="text-white" />
                  </motion.div>
                  <h3 className="text-xl font-bold mb-3 text-white">{feature.title}</h3>
                  <p className="text-gray-300 mb-4 text-sm">{feature.description}</p>
                  <div className="space-y-2">
                    {feature.features.map((feat, idx) => (
                      <motion.div
                        key={idx}
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: index * 0.2 + idx * 0.1 }}
                        className="flex items-center text-sm text-gray-400"
                      >
                        <Check className="w-4 h-4 mr-2 text-green-400" />
                        {feat}
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </section>

      {/* Enhanced Pricing Section */}
      <section id="pricing" className="relative py-32 px-4 bg-gradient-to-br from-blue-900/10 to-purple-900/10">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center mb-20"
          >
            <h2 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              Choose Your Plan
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Scale your social media automation from startup to enterprise
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {pricingPlans.map((plan, index) => (
              <motion.div 
                key={index}
                initial={{ opacity: 0, y: 100, rotateX: -15 }}
                whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
                viewport={{ once: true }}
                transition={{ 
                  delay: index * 0.2,
                  duration: 0.8,
                  type: "spring"
                }}
                whileHover={{ 
                  scale: 1.05,
                  rotateY: 5,
                  transition: { duration: 0.3 }
                }}
                className={`relative p-8 bg-gradient-to-br from-gray-900/50 to-black/50 rounded-3xl border ${
                  plan.popular 
                    ? 'border-blue-500/50 scale-105' 
                    : 'border-gray-800'
                } backdrop-blur-sm h-full transform-gpu overflow-hidden`}
                style={{ transformStyle: "preserve-3d" }}
              >
                {plan.popular && (
                  <motion.div
                    initial={{ scale: 0, rotate: -180 }}
                    whileInView={{ scale: 1, rotate: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.2 + 0.3, type: "spring" }}
                    className="absolute -top-4 left-1/2 transform -translate-x-1/2"
                  >
                    <Badge className={`bg-gradient-to-r ${plan.gradient} text-white px-6 py-2 border-0`}>
                      <motion.div
                        animate={{ rotate: [0, 360] }}
                        transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                      >
                        <Crown className="w-4 h-4 mr-2" />
                      </motion.div>
                      Most Popular
                    </Badge>
                  </motion.div>
                )}

                <div className="text-center mb-8">
                  <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
                  <div className="mb-4">
                    <motion.span 
                      className={`text-4xl font-bold bg-gradient-to-r ${plan.gradient} bg-clip-text text-transparent`}
                      animate={{ scale: [1, 1.05, 1] }}
                      transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                    >
                      {plan.price}
                    </motion.span>
                    <span className="text-gray-400">{plan.period}</span>
                  </div>
                  <p className="text-gray-400">{plan.description}</p>
                </div>

                <ul className="space-y-4 mb-8">
                  {plan.features.map((feature, featureIndex) => (
                    <motion.li 
                      key={featureIndex}
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: index * 0.2 + featureIndex * 0.1 }}
                      className="flex items-center"
                    >
                      <Check className="w-5 h-5 mr-3 text-green-400 flex-shrink-0" />
                      <span className="text-gray-300">{feature}</span>
                    </motion.li>
                  ))}
                </ul>

                <Link href="/onboarding">
                  <motion.div
                    whileHover={{ 
                      scale: 1.02,
                      boxShadow: plan.popular ? "0 10px 30px rgba(139, 92, 246, 0.3)" : "0 10px 30px rgba(255, 255, 255, 0.1)"
                    }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Button 
                      className={`w-full py-4 font-semibold rounded-xl transition-all duration-300 ${
                        plan.popular
                          ? `bg-gradient-to-r ${plan.gradient} hover:shadow-lg text-white`
                          : 'bg-white/10 hover:bg-white/20 text-white border border-white/20'
                      }`}
                    >
                      {plan.name === 'Free Explorer' ? 'Get Started Free' : 'Start Free Trial'}
                    </Button>
                  </motion.div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Enhanced CTA Section */}
      <section id="about" className="relative py-32 px-4 bg-gradient-to-br from-purple-900/20 to-blue-900/20">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <motion.h2 
              className="text-5xl md:text-6xl font-bold mb-8 bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent"
              animate={{
                scale: [1, 1.02, 1]
              }}
              transition={{
                duration: 4,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            >
              Ready to Dominate All Social Media?
            </motion.h2>
            
            <p className="text-xl text-gray-300 mb-12 leading-relaxed">
              Join thousands of businesses already using VeeFore to automate Instagram, YouTube, Twitter, 
              Facebook, LinkedIn and drive real growth with AI-powered cross-platform strategies.
            </p>

            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
              <Link href="/onboarding">
                <motion.div
                  whileHover={{ 
                    scale: 1.05,
                    boxShadow: "0 20px 40px rgba(139, 92, 246, 0.3)"
                  }}
                  whileTap={{ scale: 0.95 }}
                  animate={{
                    y: [0, -5, 0]
                  }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                >
                  <Button 
                    size="lg"
                    className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white px-12 py-4 text-xl font-semibold rounded-full shadow-lg"
                  >
                    <Rocket className="w-6 h-6 mr-3" />
                    Start Your Free Trial
                    <ArrowRight className="w-6 h-6 ml-3" />
                  </Button>
                </motion.div>
              </Link>
              
              <motion.div
                whileHover={{ 
                  scale: 1.05,
                  borderColor: "rgba(255, 255, 255, 0.5)"
                }}
                whileTap={{ scale: 0.95 }}
              >
                <Button 
                  variant="outline" 
                  size="lg"
                  className="border-2 border-white/30 text-white hover:bg-white/10 px-12 py-4 text-xl font-semibold rounded-full backdrop-blur-sm"
                >
                  <MessageCircle className="w-6 h-6 mr-3" />
                  Contact Sales
                </Button>
              </motion.div>
            </div>

            <p className="text-gray-400 mt-8">
              No credit card required • 14-day free trial • Cancel anytime
            </p>
          </motion.div>
        </div>
      </section>

      {/* Enhanced Footer */}
      <footer id="contact" className="relative border-t border-gray-800 py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-8">
            <motion.h3 
              className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent mb-4"
              animate={{
                scale: [1, 1.05, 1]
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            >
              VeeFore
            </motion.h3>
            <p className="text-gray-400 max-w-2xl mx-auto">
              The future of AI-powered multi-platform social media automation. Transform your digital presence 
              across Instagram, YouTube, Twitter, Facebook, LinkedIn with intelligent automation.
            </p>
          </div>

          <div className="text-center text-gray-500">
            <p>&copy; 2025 VeeFore. All rights reserved. | Made with ❤️ for the future of social media automation.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;