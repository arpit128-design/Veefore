import { useState, useEffect, useRef, lazy, Suspense, memo, useMemo } from 'react';
import { Link } from 'wouter';
import { motion, useInView, useReducedMotion } from 'framer-motion';
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
  Zap as ZapIcon,
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

// Optimized animation variants 
const fadeInUp = {
  initial: { opacity: 0, y: 30 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.4, ease: "easeOut" }
};

const scaleIn = {
  initial: { opacity: 0, scale: 0.9 },
  animate: { opacity: 1, scale: 1 },
  transition: { duration: 0.3, ease: "easeOut" }
};

// Animated Section Component with Enhanced Lazy Loading
interface AnimatedSectionProps {
  children: React.ReactNode;
  className?: string;
  id?: string;
  delay?: number;
}

function AnimatedSection({ children, className = "", id, delay = 0 }: AnimatedSectionProps) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-50px", amount: 0.1 });

  return (
    <motion.section
      ref={ref}
      id={id}
      className={className}
      initial={{ opacity: 0, y: 60, scale: 0.95 }}
      animate={isInView ? { 
        opacity: 1, 
        y: 0, 
        scale: 1,
        transition: {
          duration: 0.8,
          ease: [0.25, 0.1, 0.25, 1],
          delay: delay,
          staggerChildren: 0.1
        }
      } : { opacity: 0, y: 60, scale: 0.95 }}
    >
      <motion.div
        variants={{
          hidden: { opacity: 0 },
          visible: {
            opacity: 1,
            transition: {
              staggerChildren: 0.15,
              delayChildren: 0.2
            }
          }
        }}
        initial="hidden"
        animate={isInView ? "visible" : "hidden"}
      >
        {children}
      </motion.div>
    </motion.section>
  );
}

// Loading Skeleton Component for Lazy Loading
function LoadingSkeleton() {
  return (
    <div className="animate-pulse">
      <div className="h-64 bg-slate-800/50 rounded-lg mb-4"></div>
      <div className="space-y-3">
        <div className="h-4 bg-slate-700/50 rounded w-3/4"></div>
        <div className="h-4 bg-slate-700/50 rounded w-1/2"></div>
        <div className="h-4 bg-slate-700/50 rounded w-5/6"></div>
      </div>
    </div>
  );
}

// Navigation Component
function Navigation() {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
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
            <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
              <Rocket className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold text-white">VeeFore</span>
          </div>
          
          <div className="hidden md:flex items-center space-x-8">
            <Link href="/features">
              <button className="text-gray-300 hover:text-white transition-colors">Features</button>
            </Link>
            <Link href="/solutions">
              <button className="text-gray-300 hover:text-white transition-colors">Solutions</button>
            </Link>
            <Link href="/pricing">
              <button className="text-gray-300 hover:text-white transition-colors">Pricing</button>
            </Link>
            <Link href="/reviews">
              <button className="text-gray-300 hover:text-white transition-colors">Reviews</button>
            </Link>
            <Link href="/auth">
              <Button variant="ghost" className="text-gray-300 hover:text-white">Sign In</Button>
            </Link>
            <Link href="/auth">
              <Button className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700">
                Get Started
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </motion.nav>
  );
}

// Starfield Background Component
function StarfieldBackground() {
  const stars = Array.from({ length: 150 }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    size: Math.random() * 3 + 1,
    animationDelay: Math.random() * 4,
    twinkleSpeed: 2 + Math.random() * 3
  }));

  return (
    <div className="absolute inset-0 overflow-hidden">
      {stars.map((star) => (
        <motion.div
          key={star.id}
          className="absolute bg-white rounded-full"
          style={{
            left: `${star.x}%`,
            top: `${star.y}%`,
            width: `${star.size}px`,
            height: `${star.size}px`,
          }}
          animate={{
            opacity: [0.1, 1, 0.1],
            scale: [0.8, 1.2, 0.8],
          }}
          transition={{
            duration: star.twinkleSpeed,
            repeat: Infinity,
            delay: star.animationDelay,
            ease: "easeInOut"
          }}
        />
      ))}
      
      {/* Shooting stars */}
      <motion.div 
        className="absolute top-1/4 left-0 w-2 h-2 bg-gradient-to-r from-purple-400 to-transparent rounded-full"
        animate={{
          x: ['-100px', '100vw'],
          opacity: [0, 1, 0]
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
          delay: 2,
          ease: "easeOut"
        }}
      />
      <motion.div 
        className="absolute top-3/4 right-0 w-2 h-2 bg-gradient-to-l from-violet-400 to-transparent rounded-full"
        animate={{
          x: ['100px', '-100vw'],
          opacity: [0, 1, 0]
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          delay: 5,
          ease: "easeOut"
        }}
      />
    </div>
  );
}

// Hero Section with seamless blending
function HeroSection() {
  const scrollToFeatures = () => {
    const element = document.getElementById('features');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-b from-black via-purple-950 to-slate-900">
      {/* Starfield Background */}
      <StarfieldBackground />
      
      {/* Animated Background Orbs */}
      <div className="absolute inset-0">
        <motion.div 
          className="absolute top-1/4 left-1/4 w-80 h-80 bg-purple-600/20 rounded-full blur-3xl"
          animate={{
            scale: [1, 1.3, 1],
            opacity: [0.2, 0.4, 0.2],
            rotate: [0, 360],
            x: [-20, 20, -20],
            y: [-30, 30, -30]
          }}
          transition={{
            duration: 15,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        <motion.div 
          className="absolute bottom-1/3 right-1/4 w-96 h-96 bg-violet-600/25 rounded-full blur-3xl"
          animate={{
            scale: [1.2, 1, 1.2],
            opacity: [0.3, 0.6, 0.3],
            rotate: [360, 0],
            x: [30, -30, 30],
            y: [20, -20, 20]
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 1
          }}
        />
        <motion.div 
          className="absolute top-1/2 left-1/2 w-64 h-64 bg-indigo-600/15 rounded-full blur-3xl"
          animate={{
            scale: [1, 1.4, 1],
            opacity: [0.1, 0.3, 0.1],
            x: [-40, 40, -40],
            y: [-50, 50, -50]
          }}
          transition={{
            duration: 18,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 2
          }}
        />
      </div>
      
      {/* Gradient overlay for seamless blending */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-slate-900 to-transparent pointer-events-none"></div>

      {/* Hero Content */}
      <div className="relative z-10 text-center px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto">
        <motion.div 
          className="mb-8"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <motion.div
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.2 }}
          >
            <Badge className="mb-4 bg-blue-500/20 text-blue-300 border-blue-500/30">
              <motion.div
                className="w-3 h-3 mr-1 inline-block"
                animate={{ rotate: [0, 360] }}
                transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
              >
                <Sparkles className="w-3 h-3" />
              </motion.div>
              AI-Powered Social Media Management
            </Badge>
          </motion.div>
        </motion.div>

        <motion.h1 
          className="text-4xl sm:text-5xl lg:text-7xl font-bold text-white mb-6 leading-tight"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.3 }}
        >
          Take Your Social Media to{' '}
          <motion.span 
            className="bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.6 }}
          >
            Mission Control
          </motion.span>
        </motion.h1>

        <motion.p 
          className="text-xl sm:text-2xl text-gray-300 mb-8 max-w-3xl mx-auto leading-relaxed"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          Create, schedule, analyze, and optimize social media content. All powered by 
          advanced AI in one user-friendly command center.
        </motion.p>

        <motion.div 
          className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.3 }}
        >
          <Link href="/auth">
            <motion.div
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.4 }}
            >
              <Button size="lg" className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-lg px-8 py-6">
                Start Free Trial
                <motion.div
                  className="ml-2 w-5 h-5 inline-block"
                  whileHover={{ x: 3 }}
                  transition={{ duration: 0.2 }}
                >
                  <ArrowRight className="w-5 h-5" />
                </motion.div>
              </Button>
            </motion.div>
          </Link>
          <Link href="/watch-demo">
            <motion.div
              whileHover={{ scale: 1.05, borderColor: "#8b5cf6" }}
              whileTap={{ scale: 0.95 }}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 1 }}
            >
              <Button size="lg" variant="outline" className="border-gray-600 text-white hover:bg-gray-800 text-lg px-8 py-6">
                <motion.div
                  className="mr-2 w-5 h-5 inline-block"
                  whileHover={{ scale: 1.2 }}
                  transition={{ duration: 0.2 }}
                >
                  <Play className="w-5 h-5" />
                </motion.div>
                Watch Demo
              </Button>
            </motion.div>
          </Link>
        </motion.div>

        {/* Platform Icons */}
        <motion.div 
          className="flex justify-center items-center space-x-6 mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.9 }}
        >
          <motion.div 
            className="text-gray-400 text-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 1.1 }}
          >
            Connect with:
          </motion.div>
          <motion.div
            whileHover={{ scale: 1.2, color: "#f472b6" }}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 1.2 }}
          >
            <Instagram className="w-6 h-6 text-gray-400 hover:text-pink-400 transition-colors cursor-pointer" />
          </motion.div>
          <motion.div
            whileHover={{ scale: 1.2, color: "#f87171" }}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 1.3 }}
          >
            <Youtube className="w-6 h-6 text-gray-400 hover:text-red-400 transition-colors cursor-pointer" />
          </motion.div>
          <motion.div
            whileHover={{ scale: 1.2, color: "#60a5fa" }}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 1.4 }}
          >
            <Twitter className="w-6 h-6 text-gray-400 hover:text-blue-400 transition-colors cursor-pointer" />
          </motion.div>
          <motion.div
            whileHover={{ scale: 1.2, color: "#2563eb" }}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 1.5 }}
          >
            <Linkedin className="w-6 h-6 text-gray-400 hover:text-blue-600 transition-colors cursor-pointer" />
          </motion.div>
          <motion.div
            whileHover={{ scale: 1.2, color: "#3b82f6" }}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 1.6 }}
          >
            <Facebook className="w-6 h-6 text-gray-400 hover:text-blue-500 transition-colors cursor-pointer" />
          </motion.div>
        </motion.div>
      </div>

      {/* Scroll Indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 1.2 }}
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2 cursor-pointer"
        onClick={scrollToFeatures}
      >
        <div className="flex flex-col items-center text-gray-400 hover:text-white transition-colors">
          <span className="text-sm mb-2">Scroll to explore</span>
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <ArrowDown className="w-6 h-6" />
          </motion.div>
        </div>
      </motion.div>
    </section>
  );
}

// Features Section with Media
function FeaturesSection() {
  const features = [
    {
      icon: <BrainCircuit className="w-6 h-6" />,
      title: "AI-Powered Content Creation",
      description: "Generate high-quality posts, captions, and hashtags with our advanced AI that understands your brand voice and audience preferences.",
      image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=600&h=400&fit=crop&crop=center",
      features: [
        "Smart caption generation with brand voice matching",
        "Trending hashtag recommendations",
        "AI image and video creation",
        "Content optimization for each platform",
        "Real-time trend analysis integration"
      ],
      color: "from-blue-500 to-purple-600",
      slug: "ai-content-creation"
    },
    {
      icon: <Calendar className="w-6 h-6" />,
      title: "Intelligent Scheduling & Automation",
      description: "Schedule posts across all platforms with AI-optimized timing, automated responses, and smart content distribution.",
      image: "https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=600&h=400&fit=crop&crop=center",
      features: [
        "AI-optimized posting times for maximum reach",
        "Cross-platform content adaptation",
        "Automated response generation",
        "Bulk scheduling with smart queuing",
        "Time zone optimization for global audiences"
      ],
      color: "from-purple-500 to-pink-600",
      slug: "intelligent-scheduling"
    },
    {
      icon: <BarChart3 className="w-6 h-6" />,
      title: "Advanced Analytics & Insights",
      description: "Track performance across all platforms with comprehensive analytics, competitor analysis, and predictive insights.",
      image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=600&h=400&fit=crop&crop=center",
      features: [
        "Real-time performance tracking",
        "Competitor benchmark analysis",
        "Predictive engagement forecasting",
        "ROI calculation and reporting",
        "Custom dashboard creation"
      ],
      color: "from-green-500 to-blue-600",
      slug: "advanced-analytics"
    },
    {
      icon: <MessageSquare className="w-6 h-6" />,
      title: "Unified Social Media Management",
      description: "Manage all your social accounts from one powerful dashboard with AI-assisted community management and engagement tools.",
      image: "https://images.unsplash.com/photo-1552664730-d307ca884978?w=600&h=400&fit=crop&crop=center",
      features: [
        "Unified inbox for all platforms",
        "AI-powered comment moderation",
        "Smart DM automation and routing",
        "Team collaboration tools",
        "Crisis management alerts"
      ],
      color: "from-orange-500 to-red-600",
      slug: "unified-management"
    }
  ];

  return (
    <AnimatedSection id="features" className="py-24 bg-slate-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div 
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <motion.div
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.2 }}
          >
            <Badge className="mb-4 bg-blue-500/20 text-blue-300 border-blue-500/30">
              <motion.div
                className="w-3 h-3 mr-1 inline-block"
                animate={{ rotate: [0, 180, 360] }}
                transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
              >
                <Zap className="w-3 h-3" />
              </motion.div>
              Powerful Features
            </Badge>
          </motion.div>
          <motion.h2 
            className="text-4xl sm:text-5xl font-bold text-white mb-6"
            initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          >
            Everything You Need to{' '}
            <motion.span 
              className="bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent"
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.3 }}
            >
              Dominate Social Media
            </motion.span>
          </motion.h2>
          <motion.p 
            className="text-xl text-gray-300 max-w-3xl mx-auto"
            initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          >
            From AI-powered content creation to advanced analytics, VeeFore provides all the tools you need to grow your social media presence.
          </motion.p>
        </motion.div>

        <div className="space-y-24">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              className={`flex flex-col ${index % 2 === 0 ? 'lg:flex-row' : 'lg:flex-row-reverse'} items-center gap-12`}
              initial={{ opacity: 0, y: 60 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: index * 0.2 }}
              viewport={{ once: true, amount: 0.3 }}
            >
              {/* Content */}
              <motion.div 
                className="flex-1 space-y-6"
                initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
              >
                <motion.div 
                  className={`inline-flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-r ${feature.color} text-white`}
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  transition={{ duration: 0.3 }}
                >
                  {feature.icon}
                </motion.div>
                <motion.h3 
                  className="text-3xl font-bold text-white"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.3 }}
                >
                  {feature.title}
                </motion.h3>
                <motion.p 
                  className="text-lg text-gray-300 leading-relaxed"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.4 }}
                >
                  {feature.description}
                </motion.p>
                
                <motion.div 
                  className="space-y-3"
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  transition={{ duration: 0.6, delay: 0.5 }}
                >
                  {feature.features.map((item, i) => (
                    <motion.div 
                      key={i} 
                      className="flex items-center text-gray-300"
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.4, delay: 0.1 * i }}
                      whileHover={{ x: 5, color: "#d1d5db" }}
                    >
                      <motion.div
                        whileHover={{ scale: 1.2, color: "#22c55e" }}
                        transition={{ duration: 0.2 }}
                      >
                        <CheckCircle className="w-5 h-5 text-green-400 mr-3 flex-shrink-0" />
                      </motion.div>
                      <span>{item}</span>
                    </motion.div>
                  ))}
                </motion.div>
                
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.6 }}
                >
                  <Link href={`/feature/${feature.slug}`}>
                    <motion.div
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <Button className={`bg-gradient-to-r ${feature.color} hover:opacity-90 transition-opacity`}>
                        Learn more
                        <motion.div
                          className="ml-2 w-4 h-4 inline-block"
                          whileHover={{ x: 3 }}
                          transition={{ duration: 0.2 }}
                        >
                          <ChevronRight className="w-4 h-4" />
                        </motion.div>
                      </Button>
                    </motion.div>
                  </Link>
                </motion.div>
              </motion.div>

              {/* Media */}
              <motion.div 
                className="flex-1"
                initial={{ opacity: 0, x: index % 2 === 0 ? 50 : -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 0.4 }}
              >
                <motion.div 
                  className="relative"
                  whileHover={{ scale: 1.02 }}
                  transition={{ duration: 0.3 }}
                >
                  <motion.div 
                    className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-2xl blur-xl"
                    animate={{ scale: [1, 1.05, 1] }}
                    transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                  />
                  <motion.div 
                    className="relative bg-slate-800 rounded-2xl p-6 border border-slate-700"
                    whileHover={{ borderColor: "#64748b" }}
                    transition={{ duration: 0.3 }}
                  >
                    <motion.img 
                      src={feature.image} 
                      alt={feature.title}
                      className="w-full h-64 object-cover rounded-xl"
                      whileHover={{ scale: 1.05 }}
                      transition={{ duration: 0.3 }}
                    />
                    <motion.div 
                      className="absolute top-8 right-8"
                      animate={{ scale: [1, 1.2, 1] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    >
                      <div className={`w-3 h-3 rounded-full bg-gradient-to-r ${feature.color}`}></div>
                    </motion.div>
                  </motion.div>
                </motion.div>
              </motion.div>
            </motion.div>
          ))}
        </div>
      </div>
    </AnimatedSection>
  );
}

// Stats Section
function StatsSection() {
  const stats = [
    { number: "500%", label: "Average engagement increase using VeeFore AI automation", company: "Content Creators Network" },
    { number: "10M+", label: "Posts created and optimized through our AI-powered platform", company: "Global Analytics" },
    { number: "90%", label: "Time saved on content creation and social media management", company: "Digital Marketing Institute" },
    { number: "50K+", label: "Active creators and businesses trust VeeFore daily", company: "User Statistics" }
  ];

  return (
    <AnimatedSection id="stats-section" className="py-24 bg-gradient-to-b from-slate-900 to-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div 
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <motion.h2 
            className="text-4xl sm:text-5xl font-bold text-white mb-6"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            Trusted by{' '}
            <motion.span 
              className="bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent"
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.3 }}
            >
              Creators Worldwide
            </motion.span>
          </motion.h2>
          <motion.p 
            className="text-xl text-gray-300 max-w-3xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            Join thousands of successful creators and businesses who've transformed their social media strategy with VeeFore.
          </motion.p>
        </motion.div>

        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ staggerChildren: 0.1 }}
        >
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              className="text-center p-6 rounded-2xl bg-slate-800/50 border border-slate-700"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3 }}
              whileHover={{ 
                scale: 1.05, 
                borderColor: "#64748b",
                boxShadow: "0 10px 30px rgba(0, 0, 0, 0.3)" 
              }}
              transition={{ duration: 0.3 }}
            >
              <motion.div 
                className="text-4xl sm:text-5xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent mb-2"
                initial={{ opacity: 0, scale: 0.5 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                {stat.number}
              </motion.div>
              <motion.div 
                className="text-gray-300 mb-2 leading-relaxed"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 + 0.2 }}
              >
                {stat.label}
              </motion.div>
              <motion.div 
                className="text-sm text-gray-500"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                transition={{ duration: 0.4, delay: index * 0.1 + 0.4 }}
              >
                {stat.company}
              </motion.div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </AnimatedSection>
  );
}



// Optimized Solutions Section
const SolutionsSection = memo(() => {
  const shouldReduceMotion = useReducedMotion();
  
  const solutions = useMemo(() => [
    {
      title: "For Content Creators",
      description: "Streamline your content creation workflow with AI-powered tools designed for individual creators.",
      icon: <Camera className="w-8 h-8" />,
      features: ["AI Content Generation", "Automated Scheduling", "Performance Analytics", "Engagement Tracking"],
      color: "from-pink-500 to-rose-600",
      slug: "content-creators"
    },
    {
      title: "For Small Businesses",
      description: "Grow your business with professional social media management tools that scale with you.",
      icon: <Building className="w-8 h-8" />,
      features: ["Multi-Platform Management", "Customer Engagement", "Brand Monitoring", "ROI Tracking"],
      color: "from-blue-500 to-cyan-600",
      slug: "small-businesses"
    },
    {
      title: "For Agencies",
      description: "Manage multiple client accounts efficiently with advanced collaboration and reporting tools.",
      icon: <Users className="w-8 h-8" />,
      features: ["Client Management", "Team Collaboration", "White-Label Reports", "Bulk Operations"],
      color: "from-purple-500 to-indigo-600",
      slug: "agencies"
    },
    {
      title: "For Enterprises",
      description: "Enterprise-grade social media management with advanced security and compliance features.",
      icon: <Shield className="w-8 h-8" />,
      features: ["Advanced Security", "Compliance Tools", "Custom Integrations", "Priority Support"],
      color: "from-green-500 to-emerald-600",
      slug: "enterprises"
    }
  ], []);

  return (
    <AnimatedSection id="solutions" className="py-24 bg-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div 
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <motion.div
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.2 }}
          >
            <Badge className="mb-4 bg-purple-500/20 text-purple-300 border-purple-500/30">
              <motion.div
                className="w-3 h-3 mr-1 inline-block"
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <Target className="w-3 h-3" />
              </motion.div>
              Solutions
            </Badge>
          </motion.div>
          <motion.h2 
            className="text-4xl sm:text-5xl font-bold text-white mb-6"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            Built for Every{' '}
            <motion.span 
              className="bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent"
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.3 }}
            >
              Use Case
            </motion.span>
          </motion.h2>
          <motion.p 
            className="text-xl text-gray-300 max-w-3xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            Whether you're a solo creator or managing enterprise accounts, VeeFore adapts to your unique needs and workflows.
          </motion.p>
        </motion.div>

        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 gap-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ staggerChildren: 0.1 }}
        >
          {solutions.map((solution, index) => (
            <motion.div 
              key={index} 
              className="group relative"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3 }}
              whileHover={{ y: -5 }}
              transition={{ duration: 0.3 }}
            >
              <motion.div 
                className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-2xl blur-xl"
                animate={{ scale: [1, 1.05, 1] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              />
              <motion.div
                whileHover={{ 
                  scale: 1.02,
                  boxShadow: "0 20px 40px rgba(0, 0, 0, 0.3)"
                }}
                transition={{ duration: 0.3 }}
              >
                <Card className="relative bg-slate-900/80 border-slate-700 hover:border-slate-600 transition-all duration-300 h-full">
                  <CardHeader className="space-y-4">
                    <motion.div 
                      className={`inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-r ${solution.color} text-white`}
                      whileHover={{ scale: 1.1, rotate: 5 }}
                      transition={{ duration: 0.3 }}
                    >
                      {solution.icon}
                    </motion.div>
                    <motion.div
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.5, delay: 0.1 }}
                    >
                      <CardTitle className="text-2xl text-white">{solution.title}</CardTitle>
                    </motion.div>
                    <motion.div
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.5, delay: 0.2 }}
                    >
                      <CardDescription className="text-gray-300 text-base leading-relaxed">
                        {solution.description}
                      </CardDescription>
                    </motion.div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <motion.div 
                      className="space-y-3"
                      initial={{ opacity: 0 }}
                      whileInView={{ opacity: 1 }}
                      transition={{ duration: 0.6, delay: 0.3 }}
                    >
                      {solution.features.map((feature, i) => (
                        <motion.div 
                          key={i} 
                          className="flex items-center text-gray-300"
                          initial={{ opacity: 0, x: -20 }}
                          whileInView={{ opacity: 1, x: 0 }}
                          transition={{ duration: 0.4, delay: 0.1 * i }}
                          whileHover={{ x: 5, color: "#d1d5db" }}
                        >
                          <motion.div
                            whileHover={{ scale: 1.2, color: "#22c55e" }}
                            transition={{ duration: 0.2 }}
                          >
                            <CheckCircle className="w-4 h-4 text-green-400 mr-3 flex-shrink-0" />
                          </motion.div>
                          <span className="text-sm">{feature}</span>
                        </motion.div>
                      ))}
                    </motion.div>
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.6, delay: 0.5 }}
                    >
                      <Link href={`/solution/${solution.slug}`}>
                        <motion.div
                          whileHover={shouldReduceMotion ? {} : { scale: 1.02 }}
                          whileTap={shouldReduceMotion ? {} : { scale: 0.98 }}
                        >
                          <Button className={`w-full bg-gradient-to-r ${solution.color} hover:opacity-90 transition-opacity mt-6`}>
                            Learn More
                            <ArrowRight className="ml-2 w-4 h-4" />
                          </Button>
                        </motion.div>
                      </Link>
                    </motion.div>
                  </CardContent>
                </Card>
              </motion.div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </AnimatedSection>
  );
});

SolutionsSection.displayName = 'SolutionsSection';

// Pricing Section
function PricingSection() {
  const plans = [
    {
      name: "Starter",
      price: "$9",
      period: "/month",
      description: "Perfect for individual creators getting started",
      features: [
        "5 social accounts",
        "100 AI-generated posts/month",
        "Basic analytics",
        "Email support",
        "Mobile app access"
      ],
      popular: false,
      color: "from-gray-500 to-gray-600"
    },
    {
      name: "Professional",
      price: "$29",
      period: "/month",
      description: "Ideal for growing businesses and serious creators",
      features: [
        "20 social accounts",
        "500 AI-generated posts/month",
        "Advanced analytics",
        "Priority support",
        "Team collaboration",
        "Custom branding",
        "Automation rules"
      ],
      popular: true,
      color: "from-blue-500 to-purple-600"
    },
    {
      name: "Enterprise",
      price: "$99",
      period: "/month",
      description: "For agencies and large organizations",
      features: [
        "Unlimited social accounts",
        "Unlimited AI content",
        "White-label reports",
        "Dedicated account manager",
        "Custom integrations",
        "Advanced security",
        "SLA guarantee"
      ],
      popular: false,
      color: "from-purple-500 to-pink-600"
    }
  ];

  return (
    <section id="pricing" className="py-24 bg-slate-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <Badge className="mb-4 bg-green-500/20 text-green-300 border-green-500/30">
            <CreditCard className="w-3 h-3 mr-1" />
            Pricing
          </Badge>
          <h2 className="text-4xl sm:text-5xl font-bold text-white mb-6">
            Simple,{' '}
            <span className="bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
              Transparent Pricing
            </span>
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Choose the perfect plan for your needs. All plans include a 14-day free trial with full access to features.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {plans.map((plan, index) => (
            <div
              key={index}
              className={`relative ${plan.popular ? 'scale-105' : ''}`}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <Badge className="bg-gradient-to-r from-blue-500 to-purple-600 text-white border-0 px-4 py-1">
                    <Star className="w-3 h-3 mr-1" />
                    Most Popular
                  </Badge>
                </div>
              )}
              
              <div className={`absolute inset-0 bg-gradient-to-r ${plan.color} opacity-10 rounded-2xl blur-xl`}></div>
              
              <Card className={`relative bg-slate-800/80 border-slate-700 hover:border-slate-600 transition-all duration-300 h-full ${
                plan.popular ? 'border-blue-500/50' : ''
              }`}>
                <CardHeader className="text-center space-y-4">
                  <CardTitle className="text-2xl text-white">{plan.name}</CardTitle>
                  <div className="space-y-2">
                    <div className="flex items-baseline justify-center">
                      <span className="text-5xl font-bold text-white">{plan.price}</span>
                      <span className="text-gray-400 ml-1">{plan.period}</span>
                    </div>
                    <CardDescription className="text-gray-300">{plan.description}</CardDescription>
                  </div>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-3">
                    {plan.features.map((feature, i) => (
                      <div key={i} className="flex items-center text-gray-300">
                        <CheckCircle className="w-4 h-4 text-green-400 mr-3 flex-shrink-0" />
                        <span className="text-sm">{feature}</span>
                      </div>
                    ))}
                  </div>
                  <Button 
                    className={`w-full ${
                      plan.popular 
                        ? `bg-gradient-to-r ${plan.color} hover:opacity-90` 
                        : 'bg-slate-700 hover:bg-slate-600 text-white'
                    } transition-all duration-300`}
                  >
                    {plan.popular ? 'Start Free Trial' : 'Get Started'}
                    <ArrowRight className="ml-2 w-4 h-4" />
                  </Button>
                </CardContent>
              </Card>
            </div>
          ))}
        </div>
        
        <div className="text-center mt-12">
          <p className="text-gray-400 mb-4">All plans include 14-day free trial • No credit card required • Cancel anytime</p>
          <Button variant="outline" className="border-gray-600 text-gray-300 hover:bg-gray-800">
            Compare All Features
            <ArrowRight className="ml-2 w-4 h-4" />
          </Button>
        </div>
      </div>
    </section>
  );
}

// Testimonials Section
function TestimonialsSection() {
  const testimonials = [
    {
      name: "Sarah Johnson",
      role: "Content Creator",
      company: "@sarahcreates",
      avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=80&h=80&fit=crop&crop=face",
      content: "VeeFore has completely transformed my content strategy. The AI-generated captions are spot-on and save me hours every week. My engagement has increased by 300% since I started using it!",
      rating: 5,
      platform: "Instagram"
    },
    {
      name: "Mike Chen",
      role: "Marketing Director",
      company: "TechStart Inc.",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&h=80&fit=crop&crop=face",
      content: "Managing multiple client accounts was a nightmare before VeeFore. Now I can schedule weeks of content in minutes and the analytics help me prove ROI to every client. Game changer!",
      rating: 5,
      platform: "Multiple"
    },
    {
      name: "Emily Rodriguez",
      role: "Small Business Owner",
      company: "Bloom Bakery",
      avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=80&h=80&fit=crop&crop=face",
      content: "As a small business owner, I don't have time for complex tools. VeeFore is incredibly intuitive and the automated posting keeps my social media active even when I'm busy baking.",
      rating: 5,
      platform: "Facebook"
    },
    {
      name: "David Park",
      role: "Social Media Manager",
      company: "Creative Agency",
      avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=80&h=80&fit=crop&crop=face",
      content: "The team collaboration features are fantastic. We can manage 50+ client accounts seamlessly. The white-label reports save us so much time and look incredibly professional.",
      rating: 5,
      platform: "Agency"
    },
    {
      name: "Lisa Thompson",
      role: "YouTuber",
      company: "@lisatech",
      avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=80&h=80&fit=crop&crop=face",
      content: "The cross-platform optimization is brilliant. I create content once and VeeFore adapts it perfectly for YouTube, Instagram, and Twitter. My reach has expanded dramatically.",
      rating: 5,
      platform: "YouTube"
    },
    {
      name: "Alex Kumar",
      role: "E-commerce Manager",
      company: "Fashion Forward",
      avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=80&h=80&fit=crop&crop=face",
      content: "VeeFore's AI understands our brand voice perfectly. The generated content feels authentic and drives real sales. Our social commerce revenue is up 250% this quarter.",
      rating: 5,
      platform: "E-commerce"
    }
  ];

  return (
    <section id="testimonials" className="py-24 bg-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <Badge className="mb-4 bg-yellow-500/20 text-yellow-300 border-yellow-500/30">
            <Star className="w-3 h-3 mr-1" />
            Testimonials
          </Badge>
          <h2 className="text-4xl sm:text-5xl font-bold text-white mb-6">
            Loved by{' '}
            <span className="bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
              Creators Everywhere
            </span>
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Don't just take our word for it. Here's what real users say about their experience with VeeFore.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <div key={index} className="group">
              <Card className="bg-slate-900/80 border-slate-700 hover:border-slate-600 transition-all duration-300 h-full group-hover:transform group-hover:scale-105">
                <CardContent className="p-6 space-y-4">
                  <div className="flex items-center space-x-1">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 text-yellow-400 fill-current" />
                    ))}
                  </div>
                  <p className="text-gray-300 leading-relaxed">"{testimonial.content}"</p>
                  <div className="flex items-center space-x-3 pt-4 border-t border-slate-700">
                    <img 
                      src={testimonial.avatar} 
                      alt={testimonial.name}
                      className="w-12 h-12 rounded-full object-cover"
                    />
                    <div>
                      <div className="font-semibold text-white">{testimonial.name}</div>
                      <div className="text-sm text-gray-400">{testimonial.role}</div>
                      <div className="text-sm text-gray-500">{testimonial.company}</div>
                    </div>
                    <div className="ml-auto">
                      <Badge variant="outline" className="border-slate-600 text-slate-400 text-xs">
                        {testimonial.platform}
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// Integration Section
function IntegrationSection() {
  const integrations = [
    { name: "Instagram", icon: <Instagram className="w-8 h-8" />, color: "text-pink-500" },
    { name: "YouTube", icon: <Youtube className="w-8 h-8" />, color: "text-red-500" },
    { name: "Twitter", icon: <Twitter className="w-8 h-8" />, color: "text-blue-400" },
    { name: "LinkedIn", icon: <Linkedin className="w-8 h-8" />, color: "text-blue-600" },
    { name: "Facebook", icon: <Facebook className="w-8 h-8" />, color: "text-blue-500" },
    { name: "TikTok", icon: <Video className="w-8 h-8" />, color: "text-black" },
    { name: "Pinterest", icon: <Camera className="w-8 h-8" />, color: "text-red-600" },
    { name: "Snapchat", icon: <Zap className="w-8 h-8" />, color: "text-yellow-400" }
  ];

  return (
    <section className="py-24 bg-slate-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <Badge className="mb-4 bg-indigo-500/20 text-indigo-300 border-indigo-500/30">
            <Wifi className="w-3 h-3 mr-1" />
            Integrations
          </Badge>
          <h2 className="text-4xl sm:text-5xl font-bold text-white mb-6">
            Connect with{' '}
            <span className="bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
              All Your Platforms
            </span>
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Seamlessly integrate with all major social media platforms and manage everything from one unified dashboard.
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-6">
          {integrations.map((integration, index) => (
            <div
              key={index}
              className="flex flex-col items-center space-y-3 p-6 rounded-2xl bg-slate-800/50 border border-slate-700 hover:border-slate-600 transition-all duration-300 group hover:transform hover:scale-105"
            >
              <div className={`${integration.color} group-hover:scale-110 transition-transform duration-300`}>
                {integration.icon}
              </div>
              <span className="text-sm text-gray-300 font-medium">{integration.name}</span>
            </div>
          ))}
        </div>

        <div className="text-center mt-12">
          <p className="text-gray-400 mb-6">Don't see your platform? We're constantly adding new integrations.</p>
          <Link href="/contact">
            <Button variant="outline" className="border-gray-600 text-gray-300 hover:bg-gray-800">
              Request Integration
              <ArrowRight className="ml-2 w-4 h-4" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}

// FAQ Section
function FAQSection() {
  const faqs = [
    {
      question: "How does VeeFore's AI content generation work?",
      answer: "Our AI analyzes your brand voice, audience preferences, and current trends to generate highly relevant content. It learns from your past posts and engagement patterns to create content that resonates with your specific audience while maintaining your unique brand personality."
    },
    {
      question: "Can I try VeeFore before committing to a paid plan?",
      answer: "Absolutely! We offer a 14-day free trial with full access to all features. No credit card required. You can explore all the capabilities and see how VeeFore transforms your social media workflow before making any commitment."
    },
    {
      question: "Which social media platforms does VeeFore support?",
      answer: "VeeFore integrates with all major social media platforms including Instagram, YouTube, Twitter, LinkedIn, Facebook, TikTok, Pinterest, and Snapchat. We're continuously adding support for new platforms based on user demand."
    },
    {
      question: "Is my data secure with VeeFore?",
      answer: "Security is our top priority. We use enterprise-grade encryption, secure data centers, and comply with all major privacy regulations including GDPR and CCPA. Your data is never shared with third parties and you maintain full control over your content."
    },
    {
      question: "Can I cancel my subscription anytime?",
      answer: "Yes, you can cancel your subscription at any time with no cancellation fees. If you cancel, you'll continue to have access to your paid features until the end of your current billing period."
    },
    {
      question: "Do you offer support for teams and agencies?",
      answer: "Yes! Our Professional and Enterprise plans include team collaboration features, role-based permissions, client management tools, and white-label reporting. Perfect for agencies managing multiple client accounts."
    }
  ];

  return (
    <section className="py-24 bg-slate-800">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <Badge className="mb-4 bg-orange-500/20 text-orange-300 border-orange-500/30">
            <Headphones className="w-3 h-3 mr-1" />
            FAQ
          </Badge>
          <h2 className="text-4xl sm:text-5xl font-bold text-white mb-6">
            Frequently Asked{' '}
            <span className="bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
              Questions
            </span>
          </h2>
          <p className="text-xl text-gray-300">
            Got questions? We've got answers. Here are some of the most common questions about VeeFore.
          </p>
        </div>

        <div className="space-y-6">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className="group"
            >
              <Card className="bg-slate-900/80 border-slate-700 hover:border-slate-600 transition-colors">
                <CardContent className="p-6">
                  <div className="flex items-start space-x-4">
                    <div className="flex-shrink-0 w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center text-white font-bold text-sm">
                      {index + 1}
                    </div>
                    <div className="space-y-2">
                      <h3 className="text-lg font-semibold text-white">{faq.question}</h3>
                      <p className="text-gray-300 leading-relaxed">{faq.answer}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          ))}
        </div>

        <div className="text-center mt-12">
          <p className="text-gray-400 mb-6">Still have questions? We're here to help!</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/contact">
              <Button className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700">
                <Mail className="mr-2 w-4 h-4" />
                Contact Support
              </Button>
            </Link>
            <Link href="/help">
              <Button variant="outline" className="border-gray-600 text-gray-300 hover:bg-gray-800">
                <BookOpen className="mr-2 w-4 h-4" />
                View Documentation
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

// CTA Section with seamless blending
function CTASection() {
  return (
    <section className="relative py-24 overflow-hidden bg-gradient-to-t from-black via-purple-950/80 to-slate-900/60">
      {/* Gradient overlay for seamless blending */}
      <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-slate-900 to-transparent pointer-events-none"></div>
      
      {/* Starfield Background */}
      <StarfieldBackground />
      
      {/* Static Background Orbs */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/6 w-72 h-72 bg-purple-600/30 rounded-full blur-3xl opacity-40" />
        <div className="absolute bottom-1/4 right-1/6 w-80 h-80 bg-violet-600/25 rounded-full blur-3xl opacity-30" />
      </div>

      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="space-y-8">
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white">
            Ready to Transform Your
            <br />
            <span className="bg-gradient-to-r from-purple-400 via-violet-400 to-purple-300 bg-clip-text text-transparent">
              Social Media Strategy?
            </span>
          </h2>
          
          <p className="text-xl sm:text-2xl text-purple-100 max-w-3xl mx-auto leading-relaxed">
            Join thousands of creators and businesses who've already discovered the power of AI-driven social media management.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-8">
            <Link href="/auth">
              <Button size="lg" className="bg-gradient-to-r from-purple-600 to-violet-600 hover:from-purple-700 hover:to-violet-700 text-white text-lg px-8 py-6 font-semibold shadow-2xl">
                Start Your Free Trial
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </Link>
            <Link href="/watch-demo">
              <Button size="lg" variant="outline" className="border-purple-400 text-purple-200 hover:bg-purple-900/30 text-lg px-8 py-6">
                <Play className="mr-2 w-5 h-5" />
                Watch Demo
              </Button>
            </Link>
          </div>

          <div className="pt-8 text-purple-200">
            <p className="text-sm opacity-90">
              ✓ 14-day free trial &nbsp;&nbsp;•&nbsp;&nbsp; ✓ No credit card required &nbsp;&nbsp;•&nbsp;&nbsp; ✓ Cancel anytime
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

// Footer
function Footer() {
  const footerSections = [
    {
      title: "Product",
      links: [
        { name: "Features", href: "/features" },
        { name: "Pricing", href: "/pricing" },
        { name: "Integrations", href: "/contact" },
        { name: "API", href: "/help" },
        { name: "Security", href: "/about" }
      ]
    },
    {
      title: "Solutions",
      links: [
        { name: "Creators", href: "/solutions" },
        { name: "Small Business", href: "/solutions" },
        { name: "Agencies", href: "/solutions" },
        { name: "Enterprise", href: "/contact" },
        { name: "E-commerce", href: "/solutions" }
      ]
    },
    {
      title: "Resources",
      links: [
        { name: "Blog", href: "/blog" },
        { name: "Help Center", href: "/help" },
        { name: "Webinars", href: "/contact" },
        { name: "Templates", href: "/contact" },
        { name: "Case Studies", href: "/blog" }
      ]
    },
    {
      title: "Company",
      links: [
        { name: "About", href: "/about" },
        { name: "Careers", href: "/careers" },
        { name: "Press", href: "/contact" },
        { name: "Partners", href: "/contact" },
        { name: "Contact", href: "/contact" }
      ]
    }
  ];

  return (
    <footer className="bg-slate-900 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-8">
          {/* Logo and Description */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                <Rocket className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold text-white">VeeFore</span>
            </div>
            <p className="text-gray-400 leading-relaxed">
              AI-powered social media management platform that helps creators and businesses grow their online presence with intelligent automation and analytics.
            </p>
            <div className="flex space-x-4">
              <Instagram className="w-5 h-5 text-gray-400 hover:text-pink-400 cursor-pointer transition-colors" />
              <Twitter className="w-5 h-5 text-gray-400 hover:text-blue-400 cursor-pointer transition-colors" />
              <Linkedin className="w-5 h-5 text-gray-400 hover:text-blue-600 cursor-pointer transition-colors" />
              <Youtube className="w-5 h-5 text-gray-400 hover:text-red-400 cursor-pointer transition-colors" />
            </div>
          </div>

          {/* Footer Links */}
          {footerSections.map((section, index) => (
            <div key={index} className="space-y-4">
              <h3 className="text-white font-semibold">{section.title}</h3>
              <ul className="space-y-2">
                {section.links.map((link, linkIndex) => (
                  <li key={linkIndex}>
                    <Link href={link.href}>
                      <span className="text-gray-400 hover:text-white transition-colors text-sm cursor-pointer">
                        {link.name}
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="border-t border-slate-800 mt-12 pt-8 flex flex-col sm:flex-row justify-between items-center">
          <p className="text-gray-400 text-sm">
            © 2024 VeeFore. All rights reserved.
          </p>
          <div className="flex space-x-6 mt-4 sm:mt-0">
            <Link href="/privacy-policy">
              <span className="text-gray-400 hover:text-white transition-colors text-sm cursor-pointer">Privacy Policy</span>
            </Link>
            <Link href="/terms-of-service">
              <span className="text-gray-400 hover:text-white transition-colors text-sm cursor-pointer">Terms of Service</span>
            </Link>
            <Link href="/contact">
              <span className="text-gray-400 hover:text-white transition-colors text-sm cursor-pointer">Cookie Policy</span>
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

// Enhanced Scroll to Top Button with Space Theme
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
      className={`fixed bottom-8 right-8 p-4 bg-gradient-to-r from-purple-600 to-violet-600 text-white rounded-full shadow-2xl hover:shadow-purple-500/25 transition-all duration-500 z-50 backdrop-blur-sm border border-purple-500/20 ${
        isVisible ? 'opacity-100' : 'opacity-0 pointer-events-none'
      }`}
      onClick={scrollToTop}
      whileHover={{ 
        scale: 1.15,
        rotate: 360,
        boxShadow: "0 0 30px rgba(147, 51, 234, 0.6)"
      }}
      whileTap={{ scale: 0.9 }}
      animate={{
        boxShadow: [
          "0 0 20px rgba(147, 51, 234, 0.3)",
          "0 0 40px rgba(139, 92, 246, 0.5)",
          "0 0 20px rgba(147, 51, 234, 0.3)"
        ]
      }}
      transition={{
        boxShadow: { duration: 2, repeat: Infinity, ease: "easeInOut" }
      }}
    >
      <Rocket className="w-5 h-5" />
    </motion.button>
  );
}

// Main Landing Page Component with Lazy Loading
export default function Landing() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-slate-900 to-black text-white overflow-x-hidden">
      <Navigation />
      <HeroSection />
      
      {/* Core sections load immediately */}
      <AnimatedSection delay={0.1}>
        <FeaturesSection />
      </AnimatedSection>
      
      {/* Heavy sections use Suspense for lazy loading */}
      <Suspense fallback={<LoadingSkeleton />}>
        <AnimatedSection delay={0.2}>
          <StatsSection />
        </AnimatedSection>
      </Suspense>
      
      <AnimatedSection delay={0.3}>
        <SolutionsSection />
      </AnimatedSection>
      
      <AnimatedSection delay={0.4}>
        <PricingSection />
      </AnimatedSection>
      
      <Suspense fallback={<LoadingSkeleton />}>
        <AnimatedSection delay={0.5}>
          <TestimonialsSection />
        </AnimatedSection>
      </Suspense>
      
      <Suspense fallback={<LoadingSkeleton />}>
        <AnimatedSection delay={0.6}>
          <IntegrationSection />
        </AnimatedSection>
      </Suspense>
      
      <AnimatedSection delay={0.7}>
        <FAQSection />
      </AnimatedSection>
      
      <CTASection />
      <Footer />
      <ScrollToTopButton />
    </div>
  );
}