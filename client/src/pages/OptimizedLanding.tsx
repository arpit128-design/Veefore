import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useDeviceWaitlistStatus } from '@/hooks/useDeviceWaitlistStatus';
import { useLocation } from 'wouter';
import veeforeLogo from '@/assets/veefore-logo.png';
import { 
  ArrowRight, 
  Calendar, 
  BarChart3, 
  MessageSquare, 
  Users, 
  Zap, 
  Shield, 
  Globe, 
  TrendingUp,
  Clock,
  Target,
  Sparkles,
  Rocket,
  Star,
  CheckCircle,
  ChevronRight,
  Play,
  Instagram,
  Youtube,
  Twitter,
  Linkedin,
  Facebook,
  ArrowDown,
  Award,
  Building,
  Camera,
  Code,
  CreditCard,
  Database,
  FileText,
  Headphones,
  Lock,
  Mail,
  Monitor,
  PieChart,
  Search,
  Settings,
  Smartphone,
  Timer,
  UserCheck,
  Video,
  Wifi,
  Bot,
  BrainCircuit,
  Palette,
  BarChart2,
  Activity,
  BookOpen,
  Briefcase,
  ChevronUp
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

// Optimized Navigation Component
function OptimizedNavigation() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [, setLocation] = useLocation();
  const deviceStatus = useDeviceWaitlistStatus();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleGetStarted = () => {
    if (deviceStatus.hasEarlyAccess) {
      setLocation('/signup');
    } else {
      setLocation('/signup');
    }
  };

  const getButtonText = () => {
    if (deviceStatus.hasEarlyAccess) {
      return 'Start Free Trial';
    } else {
      return 'Get Started';
    }
  };

  return (
    <motion.nav 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled ? 'bg-slate-900/95 backdrop-blur-md shadow-lg' : 'bg-transparent'
      }`}
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-2">
            <img 
              src={veeforeLogo} 
              alt="VeeFore Logo" 
              className="w-8 h-8 object-contain"
            />
            <span className="text-xl font-bold text-white">VeeFore</span>
          </div>
          
          <div className="flex items-center space-x-4">
            <Button 
              variant="ghost" 
              className="text-gray-300 hover:text-white"
              onClick={() => setLocation('/signin')}
            >
              Sign In
            </Button>
            <Button 
              className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
              onClick={handleGetStarted}
            >
              {getButtonText()}
            </Button>
          </div>
        </div>
      </div>
    </motion.nav>
  );
}

// Optimized Hero Section
function OptimizedHero() {
  const [, setLocation] = useLocation();

  return (
    <section className="min-h-screen flex items-center justify-center px-4 relative">
      {/* Simplified background */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-900/20 via-purple-900/20 to-pink-900/20" />
      
      <div className="max-w-6xl mx-auto text-center relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="space-y-8"
        >
          <Badge className="bg-gradient-to-r from-blue-500/20 to-purple-500/20 text-blue-300 border-blue-500/30">
            <Sparkles className="w-4 h-4 mr-2" />
            AI-Powered Content Intelligence
          </Badge>
          
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold leading-tight">
            <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
              Automate Your Social Media
            </span>
            <br />
            <span className="text-white">
              with AI Intelligence
            </span>
          </h1>
          
          <p className="text-lg md:text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
            VeeFore transforms your social media strategy with 15+ AI-powered tools for content creation, 
            scheduling, analytics, and automation. Scale your presence across all platforms effortlessly.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-8">
            <Button 
              size="lg" 
              className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white px-8 py-6 text-lg font-semibold rounded-xl shadow-2xl hover:shadow-purple-500/25 transform hover:scale-105 transition-all duration-300"
              onClick={() => setLocation('/signup')}
            >
              Start Free Trial
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
            
            <Button 
              variant="outline" 
              size="lg" 
              className="border-purple-500 text-purple-300 hover:bg-purple-500/10 px-8 py-6 text-lg font-semibold rounded-xl"
              onClick={() => setLocation('/watch-demo')}
            >
              <Play className="w-5 h-5 mr-2" />
              Watch Demo
            </Button>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

// Optimized Features Section
function OptimizedFeatures() {
  const features = [
    {
      icon: <Bot className="w-8 h-8" />,
      title: "AI Content Creation",
      description: "Generate viral posts, captions, and hashtags with advanced AI models"
    },
    {
      icon: <Calendar className="w-8 h-8" />,
      title: "Smart Scheduling",
      description: "Optimize posting times with AI-powered scheduling across all platforms"
    },
    {
      icon: <BarChart3 className="w-8 h-8" />,
      title: "Advanced Analytics",
      description: "Deep insights and performance tracking with predictive analytics"
    },
    {
      icon: <MessageSquare className="w-8 h-8" />,
      title: "Auto Engagement",
      description: "AI-powered DM automation and comment management"
    },
    {
      icon: <BrainCircuit className="w-8 h-8" />,
      title: "Trend Intelligence",
      description: "Stay ahead with real-time trend analysis and viral predictions"
    },
    {
      icon: <Palette className="w-8 h-8" />,
      title: "Visual Creator",
      description: "AI thumbnail maker and visual content optimization"
    }
  ];

  return (
    <section className="py-20 px-4">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Powerful AI Tools for Every Creator
          </h2>
          <p className="text-gray-300 text-lg max-w-2xl mx-auto">
            15+ production-grade AI tools designed to automate, optimize, and scale your social media presence
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
            >
              <Card className="bg-slate-800/50 border-slate-700/50 hover:bg-slate-800/80 transition-all duration-300 hover:border-purple-500/50">
                <CardHeader>
                  <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center mb-4">
                    {feature.icon}
                  </div>
                  <CardTitle className="text-white">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-300">{feature.description}</p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

// Main Optimized Landing Component
export default function OptimizedLanding() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-slate-900 to-black text-white overflow-x-hidden">
      <OptimizedNavigation />
      <OptimizedHero />
      <OptimizedFeatures />
    </div>
  );
}