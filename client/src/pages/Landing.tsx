import { useState, useEffect, useRef, lazy, Suspense } from 'react';
import { Link } from 'wouter';
import { motion, useInView, useScroll, useTransform } from 'framer-motion';
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
  ChevronUp,
  Eye,
  Heart,
  ThumbsUp,
  Share2,
  Download,
  Upload,
  Filter,
  Tag,
  Layers,
  Sliders,
  MousePointer,
  Cpu,
  Network,
  CloudLightning,
  Gauge,
  LineChart,
  TrendingDown,
  Repeat,
  RefreshCw,
  BarChart4,
  PlusCircle,
  MinusCircle,
  Edit3,
  Copy,
  Save,
  FolderOpen,
  Archive,
  Trash2,
  MoreHorizontal,
  Image,
  Music,
  Film,
  Mic,
  Speaker,
  Volume2,
  Radio,
  Tv,
  Gamepad2,
  Laptop,
  Tablet,
  Watch,
  Home,
  MapPin,
  Compass,
  Map,
  Route,
  Car,
  Plane,
  Ship,
  Train,
  Bike,
  ShoppingCart,
  ShoppingBag,
  Wallet,
  Banknote,
  Receipt,
  Calculator,
  Percent,
  DollarSign,
  Euro,
  PoundSterling,
  Bitcoin,
  Coins,
  User,
  Crown,
  X
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

// Advanced animation variants
const fadeInUp = {
  initial: { opacity: 0, y: 60 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6, ease: "easeOut" }
};

const staggerContainer = {
  animate: {
    transition: {
      staggerChildren: 0.1
    }
  }
};

const scaleIn = {
  initial: { opacity: 0, scale: 0.8 },
  animate: { opacity: 1, scale: 1 },
  transition: { duration: 0.5, ease: "easeOut" }
};

const slideInLeft = {
  initial: { opacity: 0, x: -100 },
  animate: { opacity: 1, x: 0 },
  transition: { duration: 0.6, ease: "easeOut" }
};

const slideInRight = {
  initial: { opacity: 0, x: 100 },
  animate: { opacity: 1, x: 0 },
  transition: { duration: 0.6, ease: "easeOut" }
};

// Loading Skeleton Component
function LoadingSkeleton() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900/20 to-black animate-pulse">
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full mx-auto animate-spin"></div>
          <div className="h-4 bg-slate-700 rounded w-32 mx-auto"></div>
        </div>
      </div>
    </div>
  );
}

// Advanced Navigation with scroll effects
function NavigationBar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { scrollY } = useScroll();
  const navOpacity = useTransform(scrollY, [0, 100], [0.95, 1]);
  const navBlur = useTransform(scrollY, [0, 100], [10, 20]);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <motion.nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled 
          ? 'bg-slate-900/95 backdrop-blur-md border-b border-slate-800' 
          : 'bg-transparent'
      }`}
      style={{ 
        opacity: navOpacity,
        backdropFilter: `blur(${navBlur}px)`
      }}
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 lg:h-20">
          <motion.div 
            className="flex items-center space-x-3"
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.2 }}
          >
            <motion.div 
              className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center"
              whileHover={{ rotate: 360 }}
              transition={{ duration: 0.5 }}
            >
              <Rocket className="w-6 h-6 text-white" />
            </motion.div>
            <span className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
              VeeFore
            </span>
          </motion.div>

          <div className="hidden lg:flex items-center space-x-8">
            {[
              { name: 'Features', href: '#features' },
              { name: 'Solutions', href: '#solutions' },
              { name: 'Pricing', href: '#pricing' },
              { name: 'Enterprise', href: '#enterprise' },
              { name: 'Resources', href: '#resources' }
            ].map((item, index) => (
              <motion.a
                key={item.name}
                href={item.href}
                className="text-gray-300 hover:text-white transition-colors cursor-pointer relative group"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 + index * 0.1 }}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
              >
                {item.name}
                <motion.div
                  className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-blue-400 to-purple-500 group-hover:w-full transition-all duration-300"
                  layoutId={`underline-${item.name}`}
                />
              </motion.a>
            ))}
          </div>

          <div className="hidden lg:flex items-center space-x-4">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
            >
              <Link href="/dashboard">
                <Button variant="outline" className="border-gray-600 text-gray-300 hover:bg-gray-800">
                  Sign In
                </Button>
              </Link>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
            >
              <Link href="/dashboard">
                <Button className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700">
                  Start Free Trial
                  <Sparkles className="ml-2 w-4 h-4" />
                </Button>
              </Link>
            </motion.div>
          </div>

          <motion.button
            className="lg:hidden text-gray-300 hover:text-white"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            whileTap={{ scale: 0.95 }}
          >
            <div className="w-6 h-6 flex flex-col justify-center space-y-1">
              <motion.div 
                className="w-full h-0.5 bg-current"
                animate={{ 
                  rotate: isMobileMenuOpen ? 45 : 0,
                  y: isMobileMenuOpen ? 6 : 0
                }}
                transition={{ duration: 0.3 }}
              />
              <motion.div 
                className="w-full h-0.5 bg-current"
                animate={{ opacity: isMobileMenuOpen ? 0 : 1 }}
                transition={{ duration: 0.3 }}
              />
              <motion.div 
                className="w-full h-0.5 bg-current"
                animate={{ 
                  rotate: isMobileMenuOpen ? -45 : 0,
                  y: isMobileMenuOpen ? -6 : 0
                }}
                transition={{ duration: 0.3 }}
              />
            </div>
          </motion.button>
        </div>

        {isMobileMenuOpen && (
          <motion.div
            className="lg:hidden border-t border-slate-800 mt-4 pt-4 pb-6"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="flex flex-col space-y-4">
              {['Features', 'Solutions', 'Pricing', 'Enterprise', 'Resources'].map((item, index) => (
                <motion.a
                  key={item}
                  href={`#${item.toLowerCase()}`}
                  className="text-gray-300 hover:text-white transition-colors"
                  onClick={() => setIsMobileMenuOpen(false)}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                >
                  {item}
                </motion.a>
              ))}
              <div className="flex flex-col space-y-2 mt-4">
                <Link href="/dashboard">
                  <Button variant="outline" className="w-full border-gray-600 text-gray-300 hover:bg-gray-800">
                    Sign In
                  </Button>
                </Link>
                <Link href="/dashboard">
                  <Button className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700">
                    Start Free Trial
                  </Button>
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </motion.nav>
  );
}

// Enhanced Starfield Background with parallax
function StarfieldBackground() {
  const starsRef = useRef<HTMLDivElement>(null);
  const { scrollY } = useScroll();
  const y = useTransform(scrollY, [0, 1000], [0, -200]);

  useEffect(() => {
    if (!starsRef.current) return;

    const createStar = (layer: number) => {
      const star = document.createElement('div');
      star.className = 'absolute rounded-full bg-white';
      
      const size = Math.random() * (layer === 1 ? 4 : 2) + 1;
      const x = Math.random() * 100;
      const y = Math.random() * 100;
      const duration = Math.random() * 4 + 2;
      const opacity = layer === 1 ? Math.random() * 0.8 + 0.2 : Math.random() * 0.6 + 0.1;
      
      star.style.width = `${size}px`;
      star.style.height = `${size}px`;
      star.style.left = `${x}%`;
      star.style.top = `${y}%`;
      star.style.opacity = opacity.toString();
      star.style.animation = `twinkle ${duration}s infinite alternate`;
      star.style.zIndex = layer.toString();
      
      return star;
    };

    // Create multiple star layers for depth
    for (let layer = 1; layer <= 3; layer++) {
      for (let i = 0; i < 100; i++) {
        starsRef.current.appendChild(createStar(layer));
      }
    }

    // Enhanced shooting stars
    const createShootingStar = () => {
      const shootingStar = document.createElement('div');
      shootingStar.className = 'absolute h-px bg-gradient-to-r from-transparent via-white to-transparent';
      shootingStar.style.width = `${Math.random() * 150 + 100}px`;
      shootingStar.style.left = '-200px';
      shootingStar.style.top = `${Math.random() * 60}%`;
      shootingStar.style.animation = 'shoot 3s linear forwards';
      shootingStar.style.boxShadow = '0 0 6px rgba(255, 255, 255, 0.8)';
      
      starsRef.current?.appendChild(shootingStar);
      
      setTimeout(() => {
        shootingStar.remove();
      }, 3000);
    };

    const shootingInterval = setInterval(createShootingStar, 2000);

    return () => {
      clearInterval(shootingInterval);
    };
  }, []);

  return (
    <motion.div 
      ref={starsRef}
      className="fixed inset-0 pointer-events-none z-0"
      style={{
        y,
        background: 'radial-gradient(ellipse at center, rgba(30, 41, 59, 0.1) 0%, rgba(0, 0, 0, 0.9) 100%)'
      }}
    />
  );
}

// Advanced Hero Section with parallax and morphing effects
function HeroSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });
  const { scrollY } = useScroll();
  const y = useTransform(scrollY, [0, 500], [0, 150]);
  const opacity = useTransform(scrollY, [0, 500], [1, 0]);

  return (
    <section ref={ref} className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-slate-900 via-purple-900/10 to-slate-800">
      <StarfieldBackground />
      
      <motion.div 
        className="absolute inset-0 bg-gradient-to-r from-blue-600/5 to-purple-600/5"
        style={{ opacity }}
      />
      
      <motion.div 
        className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20"
        style={{ y }}
      >
        <div className="text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            animate={isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.5 }}
            transition={{ duration: 1, ease: "easeOut" }}
          >
            <Badge className="mb-6 bg-purple-500/20 text-purple-300 border-purple-500/30 text-lg px-6 py-2">
              <Sparkles className="w-4 h-4 mr-2" />
              Revolutionizing Social Media Management
            </Badge>
          </motion.div>

          <motion.h1
            className="text-6xl sm:text-7xl lg:text-8xl font-bold text-white mb-8 leading-tight"
            initial={{ opacity: 0, y: 50 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
            transition={{ duration: 1, delay: 0.2 }}
          >
            <motion.span
              initial={{ opacity: 0 }}
              animate={isInView ? { opacity: 1 } : { opacity: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              The Future of
            </motion.span>
            <motion.span 
              className="bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 bg-clip-text text-transparent block"
              initial={{ opacity: 0, backgroundPosition: "0% 50%" }}
              animate={isInView ? { 
                opacity: 1,
                backgroundPosition: "100% 50%"
              } : { opacity: 0 }}
              transition={{ 
                duration: 2, 
                delay: 0.6,
                backgroundPosition: { 
                  repeat: Infinity,
                  repeatType: "reverse",
                  duration: 3
                }
              }}
            >
              AI-Powered Marketing
            </motion.span>
          </motion.h1>

          <motion.p
            className="text-2xl text-gray-300 max-w-4xl mx-auto mb-12 leading-relaxed"
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
            transition={{ duration: 0.8, delay: 0.8 }}
          >
            Transform your social media presence with VeeFore's cutting-edge AI technology. 
            From intelligent content creation to automated engagement across all platforms, 
            we empower creators, businesses, and agencies to dominate the digital landscape.
          </motion.p>

          <motion.div
            className="flex flex-col sm:flex-row gap-6 justify-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
            transition={{ duration: 0.8, delay: 1 }}
          >
            <Link href="/dashboard">
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button 
                  size="lg" 
                  className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-xl px-12 py-6 h-auto relative overflow-hidden group"
                >
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent"
                    initial={{ x: "-100%" }}
                    whileHover={{ x: "100%" }}
                    transition={{ duration: 0.6 }}
                  />
                  <span className="relative z-10 flex items-center">
                    Start Your Journey
                    <Rocket className="ml-3 w-6 h-6" />
                  </span>
                </Button>
              </motion.div>
            </Link>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button 
                size="lg" 
                variant="outline" 
                className="border-2 border-gray-600 text-gray-300 hover:bg-gray-800 text-xl px-12 py-6 h-auto group"
              >
                <Play className="mr-3 w-6 h-6 group-hover:animate-pulse" />
                Watch Demo
              </Button>
            </motion.div>
          </motion.div>

          <motion.div
            className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-5xl mx-auto"
            initial={{ opacity: 0, y: 50 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
            transition={{ duration: 0.8, delay: 1.2 }}
          >
            {[
              { icon: <Users className="w-10 h-10" />, number: "100K+", label: "Active Users", color: "from-blue-400 to-cyan-500" },
              { icon: <Globe className="w-10 h-10" />, number: "15", label: "Platforms", color: "from-purple-400 to-pink-500" },
              { icon: <Zap className="w-10 h-10" />, number: "50M+", label: "Posts Created", color: "from-green-400 to-emerald-500" },
              { icon: <TrendingUp className="w-10 h-10" />, number: "800%", label: "Growth Rate", color: "from-yellow-400 to-orange-500" }
            ].map((stat, index) => (
              <motion.div
                key={index}
                className="text-center group"
                initial={{ opacity: 0, scale: 0.5 }}
                animate={isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.5 }}
                transition={{ duration: 0.6, delay: 1.4 + index * 0.1 }}
                whileHover={{ scale: 1.1 }}
              >
                <motion.div 
                  className={`bg-gradient-to-r ${stat.color} w-20 h-20 rounded-3xl flex items-center justify-center mx-auto mb-4 shadow-lg group-hover:shadow-xl transition-all duration-300`}
                  whileHover={{ rotate: 360 }}
                  transition={{ duration: 0.6 }}
                >
                  {stat.icon}
                </motion.div>
                <motion.div 
                  className="text-3xl font-bold text-white mb-2"
                  initial={{ opacity: 0 }}
                  animate={isInView ? { opacity: 1 } : { opacity: 0 }}
                  transition={{ duration: 0.5, delay: 1.6 + index * 0.1 }}
                >
                  {stat.number}
                </motion.div>
                <motion.div 
                  className="text-gray-400 text-sm font-medium"
                  initial={{ opacity: 0 }}
                  animate={isInView ? { opacity: 1 } : { opacity: 0 }}
                  transition={{ duration: 0.5, delay: 1.7 + index * 0.1 }}
                >
                  {stat.label}
                </motion.div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </motion.div>

      <motion.div
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
        initial={{ opacity: 0, y: 20 }}
        animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
        transition={{ duration: 0.8, delay: 2 }}
      >
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="cursor-pointer"
          onClick={() => document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' })}
        >
          <ArrowDown className="w-8 h-8 text-gray-400 hover:text-white transition-colors" />
        </motion.div>
      </motion.div>
    </section>
  );
}

// Advanced Features Section with interactive elements
function FeaturesSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });
  const [activeFeature, setActiveFeature] = useState(0);

  const features = [
    {
      title: "AI-Powered Content Generation",
      description: "Create engaging posts, captions, stories, and videos with our advanced AI that learns your brand voice, analyzes audience preferences, and generates content that drives engagement.",
      icon: <BrainCircuit className="w-8 h-8" />,
      color: "from-blue-500 to-cyan-600",
      image: "https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&w=800&q=80",
      details: [
        "GPT-4 powered content creation",
        "Brand voice learning and adaptation",
        "Multi-language content support",
        "Visual content recommendations",
        "A/B testing for optimal performance"
      ]
    },
    {
      title: "Smart Scheduling & Automation",
      description: "Optimize posting times with AI-driven analytics that determine peak engagement hours, automate your entire content calendar, and ensure consistent presence across all platforms.",
      icon: <Clock className="w-8 h-8" />,
      color: "from-purple-500 to-pink-600",
      image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=800&q=80",
      details: [
        "Intelligent timing optimization",
        "Automated cross-platform posting",
        "Content queue management",
        "Timezone-aware scheduling",
        "Bulk upload and scheduling"
      ]
    },
    {
      title: "Multi-Platform Management",
      description: "Manage Instagram, YouTube, Twitter, LinkedIn, Facebook, TikTok, Pinterest, Snapchat, and more from one unified dashboard with native integrations and real-time synchronization.",
      icon: <Globe className="w-8 h-8" />,
      color: "from-green-500 to-emerald-600",
      image: "https://images.unsplash.com/photo-1611224923853-80b023f02d71?auto=format&fit=crop&w=800&q=80",
      details: [
        "15+ platform integrations",
        "Unified content management",
        "Platform-specific optimization",
        "Real-time synchronization",
        "Cross-platform analytics"
      ]
    },
    {
      title: "Advanced Analytics & Insights",
      description: "Get comprehensive insights into your content performance with detailed analytics, audience segmentation, competitor analysis, and actionable recommendations for growth.",
      icon: <BarChart3 className="w-8 h-8" />,
      color: "from-orange-500 to-red-600",
      image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=800&q=80",
      details: [
        "Real-time performance tracking",
        "Audience demographic analysis",
        "Competitor benchmarking",
        "ROI and conversion tracking",
        "Custom reporting dashboards"
      ]
    },
    {
      title: "Intelligent Auto-Engagement",
      description: "Respond to comments, messages, and mentions automatically with AI-powered responses that maintain your brand personality and increase engagement rates.",
      icon: <MessageSquare className="w-8 h-8" />,
      color: "from-pink-500 to-rose-600",
      image: "https://images.unsplash.com/photo-1556761175-b413da4baf72?auto=format&fit=crop&w=800&q=80",
      details: [
        "Contextual AI responses",
        "Sentiment analysis",
        "Auto-moderation tools",
        "Response time optimization",
        "Engagement rate improvement"
      ]
    },
    {
      title: "Professional Design Suite",
      description: "Access thousands of professionally designed templates, AI-powered design suggestions, and advanced editing tools to create stunning visual content.",
      icon: <Palette className="w-8 h-8" />,
      color: "from-indigo-500 to-purple-600",
      image: "https://images.unsplash.com/photo-1558655146-9f40138edfeb?auto=format&fit=crop&w=800&q=80",
      details: [
        "10,000+ design templates",
        "AI-powered design suggestions",
        "Advanced photo editing",
        "Video editing capabilities",
        "Brand consistency tools"
      ]
    }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveFeature((prev) => (prev + 1) % features.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section ref={ref} id="features" className="py-32 bg-gradient-to-b from-slate-800 to-slate-900 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-r from-blue-600/5 to-purple-600/5" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-20">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.6 }}
          >
            <Badge className="mb-6 bg-blue-500/20 text-blue-300 border-blue-500/30 text-lg px-6 py-2">
              <Zap className="w-4 h-4 mr-2" />
              Powerful Features
            </Badge>
          </motion.div>
          <motion.h2 
            className="text-5xl sm:text-6xl font-bold text-white mb-8"
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            Everything You Need to{' '}
            <span className="bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
              Dominate Social Media
            </span>
          </motion.h2>
          <motion.p 
            className="text-2xl text-gray-300 max-w-4xl mx-auto leading-relaxed"
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            Our comprehensive suite of AI-powered tools revolutionizes how you create, manage, and optimize your social media presence across all platforms.
          </motion.p>
        </div>

        {/* Interactive Feature Showcase */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 mb-20">
          <motion.div
            className="space-y-8"
            initial={{ opacity: 0, x: -50 }}
            animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -50 }}
            transition={{ duration: 0.8, delay: 0.3 }}
          >
            {features.map((feature, index) => (
              <motion.div
                key={index}
                className={`p-6 rounded-2xl cursor-pointer transition-all duration-300 ${
                  activeFeature === index 
                    ? 'bg-slate-800/80 border-2 border-purple-500/50' 
                    : 'bg-slate-800/40 border-2 border-transparent hover:border-slate-600'
                }`}
                onClick={() => setActiveFeature(index)}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <div className="flex items-start space-x-4">
                  <motion.div 
                    className={`w-16 h-16 rounded-xl bg-gradient-to-r ${feature.color} flex items-center justify-center`}
                    animate={{ 
                      scale: activeFeature === index ? 1.1 : 1,
                      rotate: activeFeature === index ? 360 : 0 
                    }}
                    transition={{ duration: 0.5 }}
                  >
                    {feature.icon}
                  </motion.div>
                  <div className="flex-1">
                    <h3 className="text-2xl font-bold text-white mb-3">{feature.title}</h3>
                    <p className="text-gray-300 leading-relaxed">{feature.description}</p>
                    {activeFeature === index && (
                      <motion.div
                        className="mt-4 space-y-2"
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                      >
                        {feature.details.map((detail, detailIndex) => (
                          <motion.div
                            key={detailIndex}
                            className="flex items-center text-sm text-gray-400"
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: detailIndex * 0.1 }}
                          >
                            <CheckCircle className="w-4 h-4 text-green-400 mr-2" />
                            {detail}
                          </motion.div>
                        ))}
                      </motion.div>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>

          <motion.div
            className="relative"
            initial={{ opacity: 0, x: 50 }}
            animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: 50 }}
            transition={{ duration: 0.8, delay: 0.5 }}
          >
            <motion.div
              className="relative overflow-hidden rounded-3xl bg-slate-800/50 border border-slate-700"
              key={activeFeature}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
            >
              <img 
                src={features[activeFeature].image} 
                alt={features[activeFeature].title}
                className="w-full h-96 object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 to-transparent" />
              <div className="absolute bottom-6 left-6 right-6">
                <h4 className="text-2xl font-bold text-white mb-2">
                  {features[activeFeature].title}
                </h4>
                <p className="text-gray-300">
                  {features[activeFeature].description}
                </p>
              </div>
            </motion.div>
          </motion.div>
        </div>

        {/* Feature Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              className="group relative"
              initial={{ opacity: 0, y: 30, scale: 0.95 }}
              animate={isInView ? { opacity: 1, y: 0, scale: 1 } : { opacity: 0, y: 30, scale: 0.95 }}
              transition={{ duration: 0.6, delay: 0.7 + index * 0.1 }}
              whileHover={{ y: -10, transition: { duration: 0.3 } }}
            >
              <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm h-full hover:border-slate-600 transition-all duration-300 overflow-hidden group-hover:shadow-2xl">
                <div className="relative">
                  <motion.img 
                    src={feature.image} 
                    alt={feature.title}
                    className="w-full h-56 object-cover"
                    whileHover={{ scale: 1.1 }}
                    transition={{ duration: 0.5 }}
                  />
                  <div className="absolute top-4 right-4">
                    <motion.div 
                      className={`w-14 h-14 rounded-xl bg-gradient-to-r ${feature.color} flex items-center justify-center shadow-lg`}
                      whileHover={{ rotate: 360, scale: 1.1 }}
                      transition={{ duration: 0.6 }}
                    >
                      {feature.icon}
                    </motion.div>
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </div>
                <CardContent className="p-8">
                  <motion.h3 
                    className="text-2xl font-semibold text-white mb-4"
                    initial={{ opacity: 0, x: -20 }}
                    animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -20 }}
                    transition={{ duration: 0.5, delay: 0.8 + index * 0.1 }}
                  >
                    {feature.title}
                  </motion.h3>
                  <motion.p 
                    className="text-gray-300 leading-relaxed mb-6"
                    initial={{ opacity: 0, x: -20 }}
                    animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -20 }}
                    transition={{ duration: 0.5, delay: 0.9 + index * 0.1 }}
                  >
                    {feature.description}
                  </motion.p>
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                    transition={{ duration: 0.5, delay: 1 + index * 0.1 }}
                  >
                    <Button 
                      variant="outline" 
                      className="group-hover:bg-gradient-to-r group-hover:from-blue-500 group-hover:to-purple-600 group-hover:border-transparent transition-all duration-300"
                    >
                      Learn More
                      <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </Button>
                  </motion.div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        <motion.div
          className="text-center mt-16"
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.6, delay: 1.5 }}
        >
          <Button 
            size="lg" 
            className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-lg px-10 py-4"
          >
            Explore All Features
            <ArrowRight className="ml-2 w-5 h-5" />
          </Button>
        </motion.div>
      </div>
    </section>
  );
}

// Advanced Stats Section with animated counters
function StatsSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });
  const [counters, setCounters] = useState([0, 0, 0, 0, 0, 0]);
  
  const stats = [
    { 
      number: 500, 
      suffix: "%", 
      label: "Average engagement increase using VeeFore's AI automation", 
      company: "Content Creators Network",
      icon: <TrendingUp className="w-8 h-8" />,
      color: "from-green-400 to-emerald-500"
    },
    { 
      number: 50, 
      suffix: "M+", 
      label: "Posts created and optimized through our AI platform", 
      company: "Global Analytics",
      icon: <BarChart3 className="w-8 h-8" />,
      color: "from-blue-400 to-cyan-500"
    },
    { 
      number: 90, 
      suffix: "%", 
      label: "Time saved on content creation and management", 
      company: "Digital Marketing Institute",
      icon: <Clock className="w-8 h-8" />,
      color: "from-purple-400 to-pink-500"
    },
    { 
      number: 100, 
      suffix: "K+", 
      label: "Active creators and businesses trust VeeFore daily", 
      company: "User Statistics",
      icon: <Users className="w-8 h-8" />,
      color: "from-orange-400 to-red-500"
    },
    { 
      number: 15, 
      suffix: "+", 
      label: "Social media platforms seamlessly integrated", 
      company: "Platform Coverage",
      icon: <Globe className="w-8 h-8" />,
      color: "from-indigo-400 to-purple-500"
    },
    { 
      number: 99, 
      suffix: "%", 
      label: "Uptime guarantee with enterprise-grade infrastructure", 
      company: "Reliability Metrics",
      icon: <Shield className="w-8 h-8" />,
      color: "from-teal-400 to-cyan-500"
    }
  ];

  useEffect(() => {
    if (isInView) {
      stats.forEach((stat, index) => {
        let count = 0;
        const increment = stat.number / 50;
        const timer = setInterval(() => {
          count += increment;
          if (count >= stat.number) {
            count = stat.number;
            clearInterval(timer);
          }
          setCounters(prev => {
            const newCounters = [...prev];
            newCounters[index] = Math.floor(count);
            return newCounters;
          });
        }, 50);
      });
    }
  }, [isInView]);

  return (
    <section ref={ref} id="stats-section" className="py-32 bg-gradient-to-b from-slate-900 to-black relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-r from-purple-600/5 to-blue-600/5" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-20">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.6 }}
          >
            <Badge className="mb-6 bg-green-500/20 text-green-300 border-green-500/30 text-lg px-6 py-2">
              <Award className="w-4 h-4 mr-2" />
              Proven Results
            </Badge>
          </motion.div>
          <motion.h2 
            className="text-5xl sm:text-6xl font-bold text-white mb-8"
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            Real Results from{' '}
            <span className="bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
              Real Users
            </span>
          </motion.h2>
          <motion.p 
            className="text-2xl text-gray-300 max-w-4xl mx-auto leading-relaxed"
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            Join hundreds of thousands of successful creators and businesses who have revolutionized their social media strategy with VeeFore's advanced AI technology.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              className="text-center group"
              initial={{ opacity: 0, y: 30, scale: 0.9 }}
              animate={isInView ? { opacity: 1, y: 0, scale: 1 } : { opacity: 0, y: 30, scale: 0.9 }}
              transition={{ duration: 0.6, delay: 0.3 + index * 0.1 }}
              whileHover={{ y: -10, transition: { duration: 0.3 } }}
            >
              <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm group-hover:border-slate-600 transition-all duration-300 p-8 h-full group-hover:shadow-2xl">
                <CardContent className="p-0">
                  <motion.div 
                    className={`w-20 h-20 mx-auto mb-6 rounded-2xl bg-gradient-to-r ${stat.color} flex items-center justify-center shadow-lg`}
                    whileHover={{ rotate: 360, scale: 1.1 }}
                    transition={{ duration: 0.6 }}
                  >
                    {stat.icon}
                  </motion.div>
                  <motion.div 
                    className="text-5xl font-bold text-white mb-4"
                    initial={{ scale: 0.5, opacity: 0 }}
                    animate={isInView ? { scale: 1, opacity: 1 } : { scale: 0.5, opacity: 0 }}
                    transition={{ duration: 0.8, delay: 0.4 + index * 0.1 }}
                  >
                    <span className="bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
                      {counters[index]}{stat.suffix}
                    </span>
                  </motion.div>
                  <motion.div 
                    className="text-lg text-gray-300 mb-4 leading-relaxed"
                    initial={{ opacity: 0, y: 20 }}
                    animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                    transition={{ duration: 0.6, delay: 0.5 + index * 0.1 }}
                  >
                    {stat.label}
                  </motion.div>
                  <motion.div 
                    className="text-sm text-gray-500 font-medium"
                    initial={{ opacity: 0, y: 20 }}
                    animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                    transition={{ duration: 0.6, delay: 0.6 + index * 0.1 }}
                  >
                    {stat.company}
                  </motion.div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        <motion.div
          className="text-center mt-16"
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.6, delay: 1.2 }}
        >
          <p className="text-gray-400 mb-6 text-lg">
            Ready to join these success stories?
          </p>
          <Button 
            size="lg" 
            className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-lg px-10 py-4"
          >
            Start Your Success Story
            <Rocket className="ml-2 w-5 h-5" />
          </Button>
        </motion.div>
      </div>
    </section>
  );
}

// CTA Section with advanced animations
function CTASection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  return (
    <section ref={ref} className="py-32 bg-gradient-to-br from-black via-purple-900/20 to-slate-900 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 to-purple-600/10" />
      <motion.div
        className="absolute inset-0 opacity-30"
        animate={{
          background: [
            "radial-gradient(circle at 20% 50%, rgba(120, 119, 198, 0.3) 0%, transparent 50%)",
            "radial-gradient(circle at 80% 20%, rgba(255, 119, 198, 0.3) 0%, transparent 50%)",
            "radial-gradient(circle at 40% 80%, rgba(119, 198, 255, 0.3) 0%, transparent 50%)"
          ]
        }}
        transition={{ duration: 8, repeat: Infinity, repeatType: "reverse" }}
      />
      
      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.8 }}
          transition={{ duration: 0.8 }}
        >
          <Badge className="mb-8 bg-purple-500/20 text-purple-300 border-purple-500/30 text-lg px-6 py-3">
            <Rocket className="w-5 h-5 mr-2" />
            Ready to Transform Your Business?
          </Badge>
        </motion.div>

        <motion.h2
          className="text-5xl sm:text-7xl font-bold text-white mb-8 leading-tight"
          initial={{ opacity: 0, y: 50 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          Start Your
          <motion.span 
            className="bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 bg-clip-text text-transparent block"
            animate={{
              backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"]
            }}
            transition={{ duration: 3, repeat: Infinity }}
          >
            Success Story Today
          </motion.span>
        </motion.h2>

        <motion.p
          className="text-2xl text-gray-300 mb-12 max-w-3xl mx-auto leading-relaxed"
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          Join over 100,000 creators and businesses who have revolutionized their social media presence with VeeFore's cutting-edge AI technology.
        </motion.p>

        <motion.div
          className="flex flex-col sm:flex-row gap-6 justify-center mb-12"
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.8, delay: 0.6 }}
        >
          <Link href="/dashboard">
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button 
                size="lg" 
                className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-xl px-12 py-6 h-auto relative overflow-hidden group"
              >
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent"
                  initial={{ x: "-100%" }}
                  whileHover={{ x: "100%" }}
                  transition={{ duration: 0.6 }}
                />
                <span className="relative z-10 flex items-center">
                  Start Free Trial
                  <ArrowRight className="ml-3 w-6 h-6" />
                </span>
              </Button>
            </motion.div>
          </Link>
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button 
              size="lg" 
              variant="outline" 
              className="border-2 border-gray-600 text-gray-300 hover:bg-gray-800 text-xl px-12 py-6 h-auto group"
            >
              <Calendar className="mr-3 w-6 h-6 group-hover:animate-pulse" />
              Schedule Demo
            </Button>
          </motion.div>
        </motion.div>

        <motion.div
          className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto mb-12"
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.8, delay: 0.8 }}
        >
          {[
            { icon: <Shield className="w-8 h-8" />, title: "14-Day Free Trial", desc: "Full access, no credit card required" },
            { icon: <Headphones className="w-8 h-8" />, title: "24/7 Support", desc: "Expert help whenever you need it" },
            { icon: <Zap className="w-8 h-8" />, title: "Setup in Minutes", desc: "Start seeing results immediately" }
          ].map((benefit, index) => (
            <motion.div
              key={index}
              className="text-center"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.6, delay: 1 + index * 0.1 }}
            >
              <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center">
                {benefit.icon}
              </div>
              <h4 className="text-xl font-semibold text-white mb-2">{benefit.title}</h4>
              <p className="text-gray-400">{benefit.desc}</p>
            </motion.div>
          ))}
        </motion.div>

        <motion.p
          className="text-gray-400 text-lg"
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.8, delay: 1.4 }}
        >
          Trusted by industry leaders • SOC 2 compliant • 99.9% uptime guarantee
        </motion.p>
      </div>
    </section>
  );
}

// Enhanced Footer
function Footer() {
  return (
    <footer className="bg-gradient-to-t from-black to-slate-900 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12">
          <div className="lg:col-span-2">
            <div className="flex items-center space-x-3 mb-6">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
                <Rocket className="w-7 h-7 text-white" />
              </div>
              <span className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
                VeeFore
              </span>
            </div>
            <p className="text-gray-400 mb-8 max-w-md leading-relaxed">
              Transform your social media strategy with AI-powered automation. Create, schedule, and optimize content across all major platforms with VeeFore's cutting-edge technology.
            </p>
            <div className="flex space-x-6">
              {[
                { icon: <Twitter className="w-6 h-6" />, href: "#", color: "hover:text-blue-400" },
                { icon: <Instagram className="w-6 h-6" />, href: "#", color: "hover:text-pink-400" },
                { icon: <Linkedin className="w-6 h-6" />, href: "#", color: "hover:text-blue-600" },
                { icon: <Youtube className="w-6 h-6" />, href: "#", color: "hover:text-red-500" },
                { icon: <Facebook className="w-6 h-6" />, href: "#", color: "hover:text-blue-500" }
              ].map((social, index) => (
                <motion.a
                  key={index}
                  href={social.href}
                  className={`w-12 h-12 bg-slate-800 rounded-xl flex items-center justify-center text-gray-400 ${social.color} transition-all duration-300 hover:scale-110`}
                  whileHover={{ y: -2 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {social.icon}
                </motion.a>
              ))}
            </div>
          </div>

          {[
            {
              title: "Product",
              links: ["Features", "Integrations", "API", "Pricing", "Changelog", "Roadmap"]
            },
            {
              title: "Solutions",
              links: ["For Creators", "For Businesses", "For Agencies", "Enterprise", "Use Cases"]
            },
            {
              title: "Resources",
              links: ["Blog", "Help Center", "Tutorials", "Webinars", "Community", "Status"]
            },
            {
              title: "Company",
              links: ["About", "Careers", "Press", "Partners", "Contact", "Security"]
            }
          ].map((section, index) => (
            <div key={index}>
              <h3 className="text-white font-semibold mb-6 text-lg">{section.title}</h3>
              <div className="space-y-4">
                {section.links.map((link) => (
                  <motion.a
                    key={link}
                    href="#"
                    className="block text-gray-400 hover:text-white transition-colors"
                    whileHover={{ x: 4 }}
                  >
                    {link}
                  </motion.a>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="border-t border-slate-800 mt-16 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 text-sm mb-4 md:mb-0">
              © 2024 VeeFore. All rights reserved.
            </p>
            <div className="flex flex-wrap justify-center md:justify-end gap-6">
              {['Privacy Policy', 'Terms of Service', 'Cookie Policy', 'GDPR', 'Security'].map((item) => (
                <a key={item} href="#" className="text-gray-400 hover:text-white text-sm transition-colors">
                  {item}
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

// Enhanced Scroll to Top Button
function ScrollToTopButton() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const toggleVisibility = () => {
      if (window.pageYOffset > 300) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener('scroll', toggleVisibility);
    return () => window.removeEventListener('scroll', toggleVisibility);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  return (
    <motion.button
      className={`fixed bottom-8 right-8 z-50 w-14 h-14 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white shadow-lg hover:shadow-xl transition-all ${
        isVisible ? 'opacity-100' : 'opacity-0 pointer-events-none'
      }`}
      onClick={scrollToTop}
      whileHover={{ scale: 1.1, rotate: 360 }}
      whileTap={{ scale: 0.9 }}
      animate={isVisible ? { 
        opacity: 1,
        boxShadow: "0 0 30px rgba(139, 92, 246, 0.6)"
      } : { 
        opacity: 0,
        boxShadow: "0 0 0px rgba(139, 92, 246, 0)"
      }}
      transition={{ duration: 0.3 }}
    >
      <ChevronUp className="w-7 h-7" />
    </motion.button>
  );
}

// Main Landing Page Component
export default function Landing() {
  return (
    <Suspense fallback={<LoadingSkeleton />}>
      <div className="min-h-screen bg-black text-white overflow-x-hidden">
        <NavigationBar />
        <HeroSection />
        <FeaturesSection />
        <StatsSection />
        <CTASection />
        <Footer />
        <ScrollToTopButton />
      </div>
    </Suspense>
  );
}