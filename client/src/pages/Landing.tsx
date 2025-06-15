import { useState, useEffect, useRef, lazy, Suspense } from 'react';
import { Link } from 'wouter';
import { motion, useInView } from 'framer-motion';
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

// Animation variants
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

// Loading Skeleton Component for Lazy Loading
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

// Enhanced Navigation with better mobile support and animations
function Navigation() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

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
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 lg:h-20">
          <motion.div 
            className="flex items-center space-x-3"
            whileHover={{ scale: 1.05 }}
          >
            <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
              <Rocket className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
              VeeFore
            </span>
          </motion.div>

          <div className="hidden lg:flex items-center space-x-8">
            {['Features', 'Solutions', 'Pricing', 'About'].map((item) => (
              <motion.a
                key={item}
                href={`#${item.toLowerCase()}`}
                className="text-gray-300 hover:text-white transition-colors cursor-pointer"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
              >
                {item}
              </motion.a>
            ))}
          </div>

          <div className="hidden lg:flex items-center space-x-4">
            <Link href="/dashboard">
              <Button variant="outline" className="border-gray-600 text-gray-300 hover:bg-gray-800">
                Sign In
              </Button>
            </Link>
            <Link href="/dashboard">
              <Button className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700">
                Get Started Free
              </Button>
            </Link>
          </div>

          <button
            className="lg:hidden text-gray-300 hover:text-white"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            <div className="w-6 h-6 flex flex-col justify-center space-y-1">
              <div className={`w-full h-0.5 bg-current transition-transform ${isMobileMenuOpen ? 'rotate-45 translate-y-1' : ''}`}></div>
              <div className={`w-full h-0.5 bg-current transition-opacity ${isMobileMenuOpen ? 'opacity-0' : ''}`}></div>
              <div className={`w-full h-0.5 bg-current transition-transform ${isMobileMenuOpen ? '-rotate-45 -translate-y-1' : ''}`}></div>
            </div>
          </button>
        </div>

        {isMobileMenuOpen && (
          <motion.div
            className="lg:hidden border-t border-slate-800 mt-4 pt-4 pb-6"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
          >
            <div className="flex flex-col space-y-4">
              {['Features', 'Solutions', 'Pricing', 'About'].map((item) => (
                <a
                  key={item}
                  href={`#${item.toLowerCase()}`}
                  className="text-gray-300 hover:text-white transition-colors"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {item}
                </a>
              ))}
              <div className="flex flex-col space-y-2 mt-4">
                <Link href="/dashboard">
                  <Button variant="outline" className="w-full border-gray-600 text-gray-300 hover:bg-gray-800">
                    Sign In
                  </Button>
                </Link>
                <Link href="/dashboard">
                  <Button className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700">
                    Get Started Free
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

// Enhanced Starfield Background
function StarfieldBackground() {
  const starsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!starsRef.current) return;

    const createStar = () => {
      const star = document.createElement('div');
      star.className = 'absolute rounded-full bg-white';
      
      const size = Math.random() * 3 + 1;
      const x = Math.random() * 100;
      const y = Math.random() * 100;
      const duration = Math.random() * 3 + 2;
      
      star.style.width = `${size}px`;
      star.style.height = `${size}px`;
      star.style.left = `${x}%`;
      star.style.top = `${y}%`;
      star.style.opacity = Math.random().toString();
      star.style.animation = `twinkle ${duration}s infinite alternate`;
      
      return star;
    };

    // Create initial stars
    for (let i = 0; i < 150; i++) {
      starsRef.current.appendChild(createStar());
    }

    // Create shooting stars periodically
    const createShootingStar = () => {
      const shootingStar = document.createElement('div');
      shootingStar.className = 'absolute h-px bg-gradient-to-r from-transparent via-white to-transparent';
      shootingStar.style.width = '100px';
      shootingStar.style.left = '-100px';
      shootingStar.style.top = `${Math.random() * 50}%`;
      shootingStar.style.animation = 'shoot 2s linear forwards';
      
      starsRef.current?.appendChild(shootingStar);
      
      setTimeout(() => {
        shootingStar.remove();
      }, 2000);
    };

    const shootingInterval = setInterval(createShootingStar, 3000);

    return () => {
      clearInterval(shootingInterval);
    };
  }, []);

  return (
    <div 
      ref={starsRef}
      className="fixed inset-0 pointer-events-none z-0"
      style={{
        background: 'radial-gradient(ellipse at center, rgba(30, 41, 59, 0.1) 0%, rgba(0, 0, 0, 0.9) 100%)'
      }}
    />
  );
}

// Hero Section with individual component animations
function HeroSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  return (
    <section ref={ref} className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-slate-900 via-purple-900/10 to-black">
      <StarfieldBackground />
      
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20">
        <div className="text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
            transition={{ duration: 0.8 }}
          >
            <Badge className="mb-6 bg-purple-500/20 text-purple-300 border-purple-500/30">
              <Sparkles className="w-3 h-3 mr-1" />
              AI-Powered Social Media Automation
            </Badge>
          </motion.div>

          <motion.h1
            className="text-5xl sm:text-6xl lg:text-7xl font-bold text-white mb-6 leading-tight"
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
            transition={{ duration: 0.8, delay: 0.1 }}
          >
            Transform Your
            <span className="bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 bg-clip-text text-transparent block">
              Social Media Game
            </span>
          </motion.h1>

          <motion.p
            className="text-xl text-gray-300 max-w-3xl mx-auto mb-8 leading-relaxed"
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            Harness the power of AI to automate content creation, schedule posts across platforms, 
            and engage with your audience like never before. Join thousands of creators who've 
            revolutionized their social media strategy.
          </motion.p>

          <motion.div
            className="flex flex-col sm:flex-row gap-4 justify-center mb-12"
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
            transition={{ duration: 0.8, delay: 0.3 }}
          >
            <Link href="/dashboard">
              <Button 
                size="lg" 
                className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-lg px-8 py-4 h-auto"
              >
                Start Free Trial
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </Link>
            <Button 
              size="lg" 
              variant="outline" 
              className="border-gray-600 text-gray-300 hover:bg-gray-800 text-lg px-8 py-4 h-auto"
            >
              <Play className="mr-2 w-5 h-5" />
              Watch Demo
            </Button>
          </motion.div>

          <motion.div
            className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto"
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            {[
              { icon: <Users className="w-8 h-8" />, label: "50K+ Users", color: "from-blue-400 to-cyan-500" },
              { icon: <Globe className="w-8 h-8" />, label: "6 Platforms", color: "from-purple-400 to-pink-500" },
              { icon: <Zap className="w-8 h-8" />, label: "10M+ Posts", color: "from-green-400 to-emerald-500" },
              { icon: <TrendingUp className="w-8 h-8" />, label: "500% Growth", color: "from-yellow-400 to-orange-500" }
            ].map((stat, index) => (
              <motion.div
                key={index}
                className="text-center"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.8 }}
                transition={{ duration: 0.6, delay: 0.5 + index * 0.1 }}
              >
                <div className={`bg-gradient-to-r ${stat.color} w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-3`}>
                  {stat.icon}
                </div>
                <div className="text-2xl font-bold text-white mb-1">
                  {stat.label.split(' ')[0]}
                </div>
                <div className="text-gray-400 text-sm">
                  {stat.label.split(' ').slice(1).join(' ')}
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>

      <motion.div
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
        initial={{ opacity: 0, y: 20 }}
        animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
        transition={{ duration: 0.8, delay: 0.8 }}
      >
        <div className="animate-bounce">
          <ArrowDown className="w-6 h-6 text-gray-400" />
        </div>
      </motion.div>
    </section>
  );
}

// Features Section with individual component animations
function FeaturesSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  const features = [
    {
      title: "AI Content Generation",
      description: "Create engaging posts, captions, and stories with our advanced AI that understands your brand voice and audience preferences.",
      icon: <BrainCircuit className="w-8 h-8" />,
      color: "from-blue-500 to-cyan-600",
      image: "https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&w=800&q=80"
    },
    {
      title: "Smart Scheduling",
      description: "Optimize posting times with AI-driven analytics that determine when your audience is most active across all platforms.",
      icon: <Clock className="w-8 h-8" />,
      color: "from-purple-500 to-pink-600",
      image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=800&q=80"
    },
    {
      title: "Multi-Platform Management",
      description: "Manage Instagram, YouTube, Twitter, LinkedIn, Facebook, and WhatsApp from one unified dashboard with seamless integration.",
      icon: <Globe className="w-8 h-8" />,
      color: "from-green-500 to-emerald-600",
      image: "https://images.unsplash.com/photo-1611224923853-80b023f02d71?auto=format&fit=crop&w=800&q=80"
    },
    {
      title: "Advanced Analytics",
      description: "Get deep insights into your content performance with comprehensive analytics, engagement tracking, and ROI measurement.",
      icon: <BarChart3 className="w-8 h-8" />,
      color: "from-orange-500 to-red-600",
      image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=800&q=80"
    },
    {
      title: "Automated Engagement",
      description: "Respond to comments and messages automatically with AI-powered responses that maintain your brand personality.",
      icon: <MessageSquare className="w-8 h-8" />,
      color: "from-pink-500 to-rose-600",
      image: "https://images.unsplash.com/photo-1556761175-b413da4baf72?auto=format&fit=crop&w=800&q=80"
    },
    {
      title: "Content Templates",
      description: "Access hundreds of professionally designed templates for posts, stories, and videos that match your brand aesthetic.",
      icon: <Palette className="w-8 h-8" />,
      color: "from-indigo-500 to-purple-600",
      image: "https://images.unsplash.com/photo-1558655146-9f40138edfeb?auto=format&fit=crop&w=800&q=80"
    }
  ];

  return (
    <section ref={ref} id="features" className="py-24 bg-gradient-to-b from-black to-slate-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.6 }}
          >
            <Badge className="mb-4 bg-blue-500/20 text-blue-300 border-blue-500/30">
              <Zap className="w-3 h-3 mr-1" />
              Features
            </Badge>
          </motion.div>
          <motion.h2 
            className="text-4xl sm:text-5xl font-bold text-white mb-6"
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            Everything You Need to{' '}
            <span className="bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
              Dominate Social Media
            </span>
          </motion.h2>
          <motion.p 
            className="text-xl text-gray-300 max-w-3xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            Our comprehensive suite of AI-powered tools helps you create, schedule, and optimize your social media presence across all major platforms.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              className="group"
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={isInView ? { opacity: 1, y: 0, scale: 1 } : { opacity: 0, y: 20, scale: 0.95 }}
              transition={{ duration: 0.6, delay: 0.3 + index * 0.1 }}
              whileHover={{ y: -5 }}
            >
              <div className="relative h-full">
                <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm h-full hover:border-slate-600 transition-all duration-300">
                  <CardContent className="p-6">
                    <div className="relative mb-6">
                      <img 
                        src={feature.image} 
                        alt={feature.title}
                        className="w-full h-48 object-cover rounded-xl"
                      />
                      <div className="absolute top-4 right-4">
                        <div className={`w-12 h-12 rounded-xl bg-gradient-to-r ${feature.color} flex items-center justify-center`}>
                          {feature.icon}
                        </div>
                      </div>
                    </div>
                    <h3 className="text-xl font-semibold text-white mb-3">{feature.title}</h3>
                    <p className="text-gray-300 leading-relaxed">{feature.description}</p>
                  </CardContent>
                </Card>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div
          className="text-center mt-12"
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6, delay: 0.8 }}
        >
          <Button className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700">
            Explore All Features
            <ArrowRight className="ml-2 w-4 h-4" />
          </Button>
        </motion.div>
      </div>
    </section>
  );
}

// Stats Section with seamless blending
function StatsSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });
  
  const stats = [
    { number: "500%", label: "Average engagement increase using VeeFore AI automation", company: "Content Creators Network" },
    { number: "10M+", label: "Posts created and optimized through our AI-powered platform", company: "Global Analytics" },
    { number: "90%", label: "Time saved on content creation and social media management", company: "Digital Marketing Institute" },
    { number: "50K+", label: "Active creators and businesses trust VeeFore daily", company: "User Statistics" }
  ];

  return (
    <section ref={ref} id="stats-section" className="py-24 bg-gradient-to-b from-slate-900 to-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.6 }}
          >
            <Badge className="mb-4 bg-blue-500/20 text-blue-300 border-blue-500/30">
              <TrendingUp className="w-3 h-3 mr-1" />
              Proven Results
            </Badge>
          </motion.div>
          <motion.h2 
            className="text-4xl sm:text-5xl font-bold text-white mb-6"
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            Real Results from{' '}
            <span className="bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
              Real Users
            </span>
          </motion.h2>
          <motion.p 
            className="text-xl text-gray-300 max-w-3xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            Join thousands of successful creators and businesses who have transformed their social media presence with VeeFore.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              className="text-center"
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={isInView ? { opacity: 1, y: 0, scale: 1 } : { opacity: 0, y: 20, scale: 0.95 }}
              transition={{ duration: 0.6, delay: 0.3 + index * 0.1 }}
            >
              <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
                <CardContent className="p-6">
                  <div className="text-4xl font-bold text-white mb-2">{stat.number}</div>
                  <div className="text-gray-300 mb-2">{stat.label}</div>
                  <div className="text-sm text-gray-500">{stat.company}</div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

// Solutions Section
function SolutionsSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });
  
  const solutions = [
    {
      title: "For Content Creators",
      description: "Streamline your content creation workflow with AI-powered tools designed for individual creators.",
      icon: <Camera className="w-8 h-8" />,
      features: ["AI Content Generation", "Automated Scheduling", "Performance Analytics", "Engagement Tracking"],
      color: "from-pink-500 to-rose-600"
    },
    {
      title: "For Small Businesses",
      description: "Grow your business with professional social media management tools that scale with you.",
      icon: <Building className="w-8 h-8" />,
      features: ["Multi-Platform Management", "Customer Engagement", "Brand Monitoring", "ROI Tracking"],
      color: "from-blue-500 to-cyan-600"
    },
    {
      title: "For Agencies",
      description: "Manage multiple client accounts efficiently with advanced collaboration and reporting features.",
      icon: <Briefcase className="w-8 h-8" />,
      features: ["Client Management", "Team Collaboration", "White-label Reports", "Bulk Operations"],
      color: "from-green-500 to-emerald-600"
    }
  ];

  return (
    <section ref={ref} id="solutions" className="py-24 bg-gradient-to-b from-slate-800 to-slate-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.6 }}
          >
            <Badge className="mb-4 bg-purple-500/20 text-purple-300 border-purple-500/30">
              <Target className="w-3 h-3 mr-1" />
              Solutions
            </Badge>
          </motion.div>
          <motion.h2 
            className="text-4xl sm:text-5xl font-bold text-white mb-6"
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            Built for Every{' '}
            <span className="bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
              Use Case
            </span>
          </motion.h2>
          <motion.p 
            className="text-xl text-gray-300 max-w-3xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            Whether you're a solo creator or managing enterprise accounts, VeeFore adapts to your unique needs and workflows.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {solutions.map((solution, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={isInView ? { opacity: 1, y: 0, scale: 1 } : { opacity: 0, y: 20, scale: 0.95 }}
              transition={{ duration: 0.6, delay: 0.3 + index * 0.1 }}
            >
              <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm h-full hover:border-slate-600 transition-all">
                <CardContent className="p-6">
                  <div className={`w-16 h-16 rounded-2xl bg-gradient-to-r ${solution.color} flex items-center justify-center mb-6`}>
                    {solution.icon}
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-3">{solution.title}</h3>
                  <p className="text-gray-300 mb-6">{solution.description}</p>
                  <div className="space-y-3">
                    {solution.features.map((feature, featureIndex) => (
                      <div key={featureIndex} className="flex items-center">
                        <CheckCircle className="w-5 h-5 text-green-400 mr-3" />
                        <span className="text-sm">{feature}</span>
                      </div>
                    ))}
                  </div>
                  <Button className={`w-full bg-gradient-to-r ${solution.color} hover:opacity-90 transition-opacity mt-6`}>
                    Learn More
                    <ArrowRight className="ml-2 w-4 h-4" />
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

// Pricing Section
function PricingSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });
  
  const plans = [
    {
      name: "Starter",
      price: "$9",
      period: "/month",
      description: "Perfect for individuals and small creators",
      features: [
        "3 Social Accounts",
        "50 AI-Generated Posts/month",
        "Basic Analytics",
        "Email Support",
        "Content Templates"
      ],
      popular: false,
      color: "from-blue-500 to-cyan-600"
    },
    {
      name: "Professional",
      price: "$29",
      period: "/month",
      description: "Ideal for growing businesses and agencies",
      features: [
        "10 Social Accounts",
        "500 AI-Generated Posts/month",
        "Advanced Analytics",
        "Priority Support",
        "Custom Templates",
        "Team Collaboration",
        "Auto-Engagement"
      ],
      popular: true,
      color: "from-purple-500 to-pink-600"
    },
    {
      name: "Enterprise",
      price: "$99",
      period: "/month",
      description: "For large teams and enterprise clients",
      features: [
        "Unlimited Accounts",
        "Unlimited AI Posts",
        "Custom Analytics",
        "Dedicated Support",
        "White-label Solution",
        "API Access",
        "Custom Integrations",
        "Advanced Security"
      ],
      popular: false,
      color: "from-green-500 to-emerald-600"
    }
  ];

  return (
    <section ref={ref} id="pricing" className="py-24 bg-gradient-to-b from-slate-900 to-black">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.6 }}
          >
            <Badge className="mb-4 bg-green-500/20 text-green-300 border-green-500/30">
              <CreditCard className="w-3 h-3 mr-1" />
              Pricing
            </Badge>
          </motion.div>
          <motion.h2 
            className="text-4xl sm:text-5xl font-bold text-white mb-6"
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            Simple,{' '}
            <span className="bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
              Transparent Pricing
            </span>
          </motion.h2>
          <motion.p 
            className="text-xl text-gray-300 max-w-3xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            Choose the perfect plan for your needs. All plans include a 14-day free trial with full access to features.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {plans.map((plan, index) => (
            <motion.div
              key={index}
              className="relative"
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={isInView ? { opacity: 1, y: 0, scale: 1 } : { opacity: 0, y: 20, scale: 0.95 }}
              transition={{ duration: 0.6, delay: 0.3 + index * 0.1 }}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <Badge className="bg-gradient-to-r from-purple-500 to-pink-600 text-white border-0">
                    <Star className="w-3 h-3 mr-1" />
                    Most Popular
                  </Badge>
                </div>
              )}
              <Card className={`${plan.popular ? 'border-purple-500 bg-slate-800/80' : 'border-slate-700 bg-slate-800/50'} backdrop-blur-sm h-full transition-all hover:border-slate-600`}>
                <CardContent className="p-8">
                  <div className="text-center mb-6">
                    <h3 className="text-2xl font-bold text-white mb-2">{plan.name}</h3>
                    <p className="text-gray-400 mb-4">{plan.description}</p>
                    <div className="flex items-baseline justify-center">
                      <span className="text-5xl font-bold text-white">{plan.price}</span>
                      <span className="text-gray-400 ml-1">{plan.period}</span>
                    </div>
                  </div>
                  
                  <div className="space-y-4 mb-8">
                    {plan.features.map((feature, featureIndex) => (
                      <div key={featureIndex} className="flex items-center">
                        <CheckCircle className="w-5 h-5 text-green-400 mr-3 flex-shrink-0" />
                        <span className="text-gray-300">{feature}</span>
                      </div>
                    ))}
                  </div>
                  
                  <Button 
                    className={`w-full ${plan.popular 
                      ? 'bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700' 
                      : 'bg-slate-700 hover:bg-slate-600'
                    }`}
                  >
                    {plan.popular ? 'Start Free Trial' : 'Get Started'}
                    <ArrowRight className="ml-2 w-4 h-4" />
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        <motion.div
          className="text-center mt-12"
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6, delay: 0.8 }}
        >
          <p className="text-gray-400 mb-4">All plans include 14-day free trial • No credit card required</p>
          <Button variant="outline" className="border-gray-600 text-gray-300 hover:bg-gray-800">
            Compare All Features
            <ArrowRight className="ml-2 w-4 h-4" />
          </Button>
        </motion.div>
      </div>
    </section>
  );
}

// Testimonials Section
function TestimonialsSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  const testimonials = [
    {
      name: "Sarah Johnson",
      role: "Content Creator",
      company: "@sarahjohnson",
      content: "VeeFore has completely transformed how I manage my social media. The AI-generated content is incredibly engaging, and I've seen a 400% increase in my follower growth!",
      avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b47c?auto=format&fit=crop&w=150&h=150&q=80",
      rating: 5
    },
    {
      name: "Michael Chen",
      role: "Marketing Director",
      company: "TechStart Inc.",
      content: "As a startup, we needed efficient social media management. VeeFore's automation features saved us 20+ hours per week while improving our engagement rates significantly.",
      avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=150&h=150&q=80",
      rating: 5
    },
    {
      name: "Emily Rodriguez",
      role: "Social Media Manager",
      company: "Creative Agency Co.",
      content: "Managing multiple client accounts was a nightmare until we found VeeFore. The platform's intuitive interface and powerful automation make our job so much easier.",
      avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=150&h=150&q=80",
      rating: 5
    }
  ];

  return (
    <section ref={ref} className="py-24 bg-gradient-to-b from-black to-slate-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.6 }}
          >
            <Badge className="mb-4 bg-yellow-500/20 text-yellow-300 border-yellow-500/30">
              <Star className="w-3 h-3 mr-1" />
              Testimonials
            </Badge>
          </motion.div>
          <motion.h2 
            className="text-4xl sm:text-5xl font-bold text-white mb-6"
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            Loved by{' '}
            <span className="bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
              Thousands of Creators
            </span>
          </motion.h2>
          <motion.p 
            className="text-xl text-gray-300 max-w-3xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            See what our users have to say about their experience with VeeFore's AI-powered social media automation.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={isInView ? { opacity: 1, y: 0, scale: 1 } : { opacity: 0, y: 20, scale: 0.95 }}
              transition={{ duration: 0.6, delay: 0.3 + index * 0.1 }}
            >
              <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm h-full">
                <CardContent className="p-6">
                  <div className="flex items-center mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                    ))}
                  </div>
                  <p className="text-gray-300 mb-6 leading-relaxed">"{testimonial.content}"</p>
                  <div className="flex items-center">
                    <img
                      src={testimonial.avatar}
                      alt={testimonial.name}
                      className="w-12 h-12 rounded-full mr-4"
                    />
                    <div>
                      <div className="font-semibold text-white">{testimonial.name}</div>
                      <div className="text-sm text-gray-400">{testimonial.role}</div>
                      <div className="text-sm text-purple-400">{testimonial.company}</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

// Integration Section
function IntegrationSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  const integrations = [
    { name: "Instagram", icon: <Instagram className="w-8 h-8" />, color: "from-pink-500 to-rose-600" },
    { name: "YouTube", icon: <Youtube className="w-8 h-8" />, color: "from-red-500 to-red-600" },
    { name: "Twitter", icon: <Twitter className="w-8 h-8" />, color: "from-blue-400 to-blue-500" },
    { name: "LinkedIn", icon: <Linkedin className="w-8 h-8" />, color: "from-blue-600 to-blue-700" },
    { name: "Facebook", icon: <Facebook className="w-8 h-8" />, color: "from-blue-500 to-indigo-600" },
    { name: "WhatsApp", icon: <MessageSquare className="w-8 h-8" />, color: "from-green-500 to-green-600" }
  ];

  return (
    <section ref={ref} className="py-24 bg-gradient-to-b from-slate-900 to-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.6 }}
          >
            <Badge className="mb-4 bg-purple-500/20 text-purple-300 border-purple-500/30">
              <Globe className="w-3 h-3 mr-1" />
              Integrations
            </Badge>
          </motion.div>
          <motion.h2 
            className="text-4xl sm:text-5xl font-bold text-white mb-6"
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            Connect All Your{' '}
            <span className="bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
              Favorite Platforms
            </span>
          </motion.h2>
          <motion.p 
            className="text-xl text-gray-300 max-w-3xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            Seamlessly manage all major social media platforms from one unified dashboard with native integrations.
          </motion.p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
          {integrations.map((integration, index) => (
            <motion.div
              key={index}
              className="text-center"
              initial={{ opacity: 0, y: 20, scale: 0.9 }}
              animate={isInView ? { opacity: 1, y: 0, scale: 1 } : { opacity: 0, y: 20, scale: 0.9 }}
              transition={{ duration: 0.6, delay: 0.3 + index * 0.1 }}
              whileHover={{ scale: 1.05 }}
            >
              <div className={`w-20 h-20 mx-auto mb-4 rounded-2xl bg-gradient-to-r ${integration.color} flex items-center justify-center shadow-lg`}>
                {integration.icon}
              </div>
              <h3 className="text-white font-semibold">{integration.name}</h3>
            </motion.div>
          ))}
        </div>

        <motion.div
          className="text-center mt-12"
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6, delay: 0.8 }}
        >
          <Button className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700">
            View All Integrations
            <ArrowRight className="ml-2 w-4 h-4" />
          </Button>
        </motion.div>
      </div>
    </section>
  );
}

// FAQ Section
function FAQSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  const faqs = [
    {
      question: "How does VeeFore's AI content generation work?",
      answer: "Our AI analyzes your brand voice, audience preferences, and trending topics to create engaging, personalized content that resonates with your followers across all platforms."
    },
    {
      question: "Can I manage multiple social media accounts?",
      answer: "Yes! VeeFore supports managing multiple accounts across Instagram, YouTube, Twitter, LinkedIn, Facebook, and WhatsApp from a single dashboard."
    },
    {
      question: "Is there a free trial available?",
      answer: "Absolutely! We offer a 14-day free trial with full access to all features. No credit card required to get started."
    },
    {
      question: "How accurate is the AI-generated content?",
      answer: "Our AI is trained on millions of high-performing posts and maintains a 95% accuracy rate. You can always review and edit content before publishing."
    },
    {
      question: "Do you offer customer support?",
      answer: "Yes, we provide 24/7 customer support via email for all plans, with priority support for Professional and Enterprise subscribers."
    }
  ];

  return (
    <section ref={ref} className="py-24 bg-gradient-to-b from-slate-800 to-black">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.6 }}
          >
            <Badge className="mb-4 bg-blue-500/20 text-blue-300 border-blue-500/30">
              <Headphones className="w-3 h-3 mr-1" />
              FAQ
            </Badge>
          </motion.div>
          <motion.h2 
            className="text-4xl sm:text-5xl font-bold text-white mb-6"
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            Frequently Asked{' '}
            <span className="bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
              Questions
            </span>
          </motion.h2>
          <motion.p 
            className="text-xl text-gray-300"
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            Got questions? We've got answers. Find everything you need to know about VeeFore.
          </motion.p>
        </div>

        <div className="space-y-6">
          {faqs.map((faq, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              transition={{ duration: 0.6, delay: 0.3 + index * 0.1 }}
            >
              <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
                <CardContent className="p-6">
                  <h3 className="text-lg font-semibold text-white mb-3">{faq.question}</h3>
                  <p className="text-gray-300 leading-relaxed">{faq.answer}</p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        <motion.div
          className="text-center mt-12"
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6, delay: 0.8 }}
        >
          <p className="text-gray-400 mb-4">Still have questions? We're here to help!</p>
          <Button variant="outline" className="border-gray-600 text-gray-300 hover:bg-gray-800">
            Contact Support
            <Mail className="ml-2 w-4 h-4" />
          </Button>
        </motion.div>
      </div>
    </section>
  );
}

// CTA Section with seamless blending
function CTASection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  return (
    <section ref={ref} className="py-24 bg-gradient-to-br from-black via-purple-900/20 to-slate-900 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 to-purple-600/10"></div>
      
      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.8 }}
        >
          <Badge className="mb-6 bg-purple-500/20 text-purple-300 border-purple-500/30">
            <Rocket className="w-3 h-3 mr-1" />
            Ready to Launch?
          </Badge>
        </motion.div>

        <motion.h2
          className="text-4xl sm:text-6xl font-bold text-white mb-6"
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.8, delay: 0.1 }}
        >
          Ready to Transform Your
          <span className="bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 bg-clip-text text-transparent block">
            Social Media Strategy?
          </span>
        </motion.h2>

        <motion.p
          className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto"
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          Join thousands of successful creators and businesses who have revolutionized their social media presence with VeeFore's AI-powered automation.
        </motion.p>

        <motion.div
          className="flex flex-col sm:flex-row gap-4 justify-center mb-8"
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.8, delay: 0.3 }}
        >
          <Link href="/dashboard">
            <Button 
              size="lg" 
              className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-lg px-8 py-4 h-auto"
            >
              Start Your Free Trial
              <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
          </Link>
          <Button 
            size="lg" 
            variant="outline" 
            className="border-gray-600 text-gray-300 hover:bg-gray-800 text-lg px-8 py-4 h-auto"
          >
            <Mail className="mr-2 w-5 h-5" />
            Contact Support
          </Button>
        </motion.div>

        <motion.p
          className="text-gray-400 text-sm"
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          Still have questions? We're here to help!
        </motion.p>

        <motion.div
          className="flex flex-col sm:flex-row gap-4 justify-center mt-6"
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.8, delay: 0.5 }}
        >
          <Button 
            variant="outline" 
            className="border-blue-600 text-blue-300 hover:bg-blue-800"
          >
            <Mail className="mr-2 w-4 h-4" />
            Contact Support
          </Button>
          <Button 
            variant="outline" 
            className="border-purple-600 text-purple-300 hover:bg-purple-800"
          >
            <BookOpen className="mr-2 w-4 h-4" />
            View Documentation
          </Button>
        </motion.div>
      </div>
    </section>
  );
}

// Footer with seamless blending
function Footer() {
  return (
    <footer className="bg-gradient-to-t from-black to-slate-900 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
                <Rocket className="w-6 h-6 text-white" />
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
                VeeFore
              </span>
            </div>
            <p className="text-gray-400 mb-6 max-w-md">
              Transform your social media strategy with AI-powered automation. Create, schedule, and optimize content across all major platforms.
            </p>
            <div className="flex space-x-4">
              {[
                { icon: <Twitter className="w-5 h-5" />, href: "#" },
                { icon: <Instagram className="w-5 h-5" />, href: "#" },
                { icon: <Linkedin className="w-5 h-5" />, href: "#" },
                { icon: <Youtube className="w-5 h-5" />, href: "#" }
              ].map((social, index) => (
                <a
                  key={index}
                  href={social.href}
                  className="w-10 h-10 bg-slate-800 rounded-lg flex items-center justify-center text-gray-400 hover:text-white hover:bg-slate-700 transition-colors"
                >
                  {social.icon}
                </a>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-white font-semibold mb-4">Product</h3>
            <div className="space-y-3">
              {['Features', 'Pricing', 'API', 'Integrations', 'Updates'].map((item) => (
                <a key={item} href="#" className="block text-gray-400 hover:text-white transition-colors">
                  {item}
                </a>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-white font-semibold mb-4">Support</h3>
            <div className="space-y-3">
              {['Help Center', 'Documentation', 'Contact Us', 'Status', 'Community'].map((item) => (
                <a key={item} href="#" className="block text-gray-400 hover:text-white transition-colors">
                  {item}
                </a>
              ))}
            </div>
          </div>
        </div>

        <div className="border-t border-slate-800 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-400 text-sm">
            © 2024 VeeFore. All rights reserved.
          </p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            {['Privacy Policy', 'Terms of Service', 'Cookie Policy'].map((item) => (
              <a key={item} href="#" className="text-gray-400 hover:text-white text-sm transition-colors">
                {item}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}

// Scroll to Top Button
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
      className={`fixed bottom-8 right-8 z-50 w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white shadow-lg hover:shadow-xl transition-all ${
        isVisible ? 'opacity-100' : 'opacity-0 pointer-events-none'
      }`}
      onClick={scrollToTop}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      animate={isVisible ? { 
        opacity: 1,
        boxShadow: "0 0 20px rgba(139, 92, 246, 0.5)"
      } : { 
        opacity: 0,
        boxShadow: "0 0 0px rgba(139, 92, 246, 0)"
      }}
    >
      <ChevronUp className="w-6 h-6" />
    </motion.button>
  );
}

// Main Landing Page Component
export default function Landing() {
  return (
    <Suspense fallback={<LoadingSkeleton />}>
      <div className="min-h-screen bg-black text-white overflow-x-hidden">
        <Navigation />
        <HeroSection />
        <FeaturesSection />
        <StatsSection />
        <SolutionsSection />
        <PricingSection />
        <TestimonialsSection />
        <IntegrationSection />
        <FAQSection />
        <CTASection />
        <Footer />
        <ScrollToTopButton />
      </div>
    </Suspense>
  );
}