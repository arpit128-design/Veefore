import { useState, useEffect } from 'react';
import { Link } from 'wouter';
import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
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

// Animated Section Component
interface AnimatedSectionProps {
  children: React.ReactNode;
  className?: string;
  id?: string;
}

function AnimatedSection({ children, className = "", id }: AnimatedSectionProps) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <motion.section
      ref={ref}
      id={id}
      initial="initial"
      animate={isInView ? "animate" : "initial"}
      variants={fadeInUp}
      className={className}
    >
      {children}
    </motion.section>
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
            <button onClick={() => scrollToSection('features')} className="text-gray-300 hover:text-white transition-colors">Features</button>
            <button onClick={() => scrollToSection('solutions')} className="text-gray-300 hover:text-white transition-colors">Solutions</button>
            <button onClick={() => scrollToSection('pricing')} className="text-gray-300 hover:text-white transition-colors">Pricing</button>
            <button onClick={() => scrollToSection('testimonials')} className="text-gray-300 hover:text-white transition-colors">Reviews</button>
            <Link href="/login">
              <Button variant="ghost" className="text-gray-300 hover:text-white">Sign In</Button>
            </Link>
            <Link href="/signup">
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

// Hero Section
function HeroSection() {
  const scrollToFeatures = () => {
    const element = document.getElementById('features');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Animated Background */}
      <div className="absolute inset-0">
        <motion.div 
          className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-purple-600/20"
          animate={{ 
            background: [
              "linear-gradient(to right, rgba(59, 130, 246, 0.2), rgba(147, 51, 234, 0.2))",
              "linear-gradient(to right, rgba(147, 51, 234, 0.2), rgba(59, 130, 246, 0.2))",
              "linear-gradient(to right, rgba(59, 130, 246, 0.2), rgba(147, 51, 234, 0.2))"
            ]
          }}
          transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
        />
        
        {/* Floating Particles */}
        {[...Array(50)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-blue-400/40 rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -30, 0],
              opacity: [0.4, 1, 0.4],
            }}
            transition={{
              duration: 3 + Math.random() * 2,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
          />
        ))}
      </div>

      {/* Hero Content */}
      <div className="relative z-10 text-center px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="mb-8"
        >
          <Badge className="mb-4 bg-blue-500/20 text-blue-300 border-blue-500/30">
            <Sparkles className="w-3 h-3 mr-1" />
            AI-Powered Social Media Management
          </Badge>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-4xl sm:text-5xl lg:text-7xl font-bold text-white mb-6 leading-tight"
        >
          Take Your Social Media to{' '}
          <span className="bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
            Mission Control
          </span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="text-xl sm:text-2xl text-gray-300 mb-8 max-w-3xl mx-auto leading-relaxed"
        >
          Create, schedule, analyze, and optimize social media content. All powered by 
          advanced AI in one user-friendly command center.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12"
        >
          <Link href="/signup">
            <Button size="lg" className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-lg px-8 py-6">
              Start Free Trial
              <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
          </Link>
          <Button size="lg" variant="outline" className="border-gray-600 text-white hover:bg-gray-800 text-lg px-8 py-6">
            <Play className="mr-2 w-5 h-5" />
            Watch Demo
          </Button>
        </motion.div>

        {/* Platform Icons */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="flex justify-center items-center space-x-6 mb-12"
        >
          <div className="text-gray-400 text-sm">Connect with:</div>
          <Instagram className="w-6 h-6 text-gray-400 hover:text-pink-400 transition-colors" />
          <Youtube className="w-6 h-6 text-gray-400 hover:text-red-400 transition-colors" />
          <Twitter className="w-6 h-6 text-gray-400 hover:text-blue-400 transition-colors" />
          <Linkedin className="w-6 h-6 text-gray-400 hover:text-blue-600 transition-colors" />
          <Facebook className="w-6 h-6 text-gray-400 hover:text-blue-500 transition-colors" />
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
      color: "from-blue-500 to-purple-600"
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
      color: "from-purple-500 to-pink-600"
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
      color: "from-green-500 to-blue-600"
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
      color: "from-orange-500 to-red-600"
    }
  ];

  return (
    <AnimatedSection id="features" className="py-24 bg-slate-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          className="text-center mb-16"
          variants={fadeInUp}
        >
          <Badge className="mb-4 bg-blue-500/20 text-blue-300 border-blue-500/30">
            <Zap className="w-3 h-3 mr-1" />
            Powerful Features
          </Badge>
          <h2 className="text-4xl sm:text-5xl font-bold text-white mb-6">
            Everything You Need to{' '}
            <span className="bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
              Dominate Social Media
            </span>
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            From AI-powered content creation to advanced analytics, VeeFore provides all the tools you need to grow your social media presence.
          </p>
        </motion.div>

        <div className="space-y-24">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              variants={fadeInUp}
              className={`flex flex-col ${index % 2 === 0 ? 'lg:flex-row' : 'lg:flex-row-reverse'} items-center gap-12`}
            >
              {/* Content */}
              <div className="flex-1 space-y-6">
                <div className={`inline-flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-r ${feature.color} text-white`}>
                  {feature.icon}
                </div>
                <h3 className="text-3xl font-bold text-white">{feature.title}</h3>
                <p className="text-lg text-gray-300 leading-relaxed">{feature.description}</p>
                
                <div className="space-y-3">
                  {feature.features.map((item, i) => (
                    <div key={i} className="flex items-center text-gray-300">
                      <CheckCircle className="w-5 h-5 text-green-400 mr-3 flex-shrink-0" />
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
                
                <Button className={`bg-gradient-to-r ${feature.color} hover:opacity-90 transition-opacity`}>
                  Learn more
                  <ChevronRight className="ml-2 w-4 h-4" />
                </Button>
              </div>

              {/* Media */}
              <div className="flex-1">
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-2xl blur-xl"></div>
                  <div className="relative bg-slate-800 rounded-2xl p-6 border border-slate-700">
                    <img 
                      src={feature.image} 
                      alt={feature.title}
                      className="w-full h-64 object-cover rounded-xl"
                    />
                    <div className="absolute top-8 right-8">
                      <div className={`w-3 h-3 rounded-full bg-gradient-to-r ${feature.color} animate-pulse`}></div>
                    </div>
                  </div>
                </div>
              </div>
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
    <AnimatedSection id="stats-section" className="py-24 bg-gradient-to-r from-slate-900 to-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          className="text-center mb-16"
          variants={fadeInUp}
        >
          <h2 className="text-4xl sm:text-5xl font-bold text-white mb-6">
            Trusted by{' '}
            <span className="bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
              Creators Worldwide
            </span>
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Join thousands of successful creators and businesses who've transformed their social media strategy with VeeFore.
          </p>
        </motion.div>

        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
          variants={staggerContainer}
        >
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              variants={scaleIn}
              className="text-center p-6 rounded-2xl bg-slate-800/50 border border-slate-700 hover:border-slate-600 transition-colors"
            >
              <div className="text-4xl sm:text-5xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent mb-2">
                {stat.number}
              </div>
              <div className="text-gray-300 mb-2 leading-relaxed">{stat.label}</div>
              <div className="text-sm text-gray-500">{stat.company}</div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </AnimatedSection>
  );
}

// Solutions Section
function SolutionsSection() {
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
      description: "Manage multiple client accounts efficiently with advanced collaboration and reporting tools.",
      icon: <Users className="w-8 h-8" />,
      features: ["Client Management", "Team Collaboration", "White-Label Reports", "Bulk Operations"],
      color: "from-purple-500 to-indigo-600"
    },
    {
      title: "For Enterprises",
      description: "Enterprise-grade social media management with advanced security and compliance features.",
      icon: <Shield className="w-8 h-8" />,
      features: ["Advanced Security", "Compliance Tools", "Custom Integrations", "Priority Support"],
      color: "from-green-500 to-emerald-600"
    }
  ];

  return (
    <AnimatedSection id="solutions" className="py-24 bg-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          className="text-center mb-16"
          variants={fadeInUp}
        >
          <Badge className="mb-4 bg-purple-500/20 text-purple-300 border-purple-500/30">
            <Target className="w-3 h-3 mr-1" />
            Solutions
          </Badge>
          <h2 className="text-4xl sm:text-5xl font-bold text-white mb-6">
            Built for Every{' '}
            <span className="bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
              Use Case
            </span>
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Whether you're a solo creator or managing enterprise accounts, VeeFore adapts to your unique needs and workflows.
          </p>
        </motion.div>

        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 gap-8"
          variants={staggerContainer}
        >
          {solutions.map((solution, index) => (
            <motion.div
              key={index}
              variants={scaleIn}
              className="group relative"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-2xl blur-xl group-hover:blur-2xl transition-all duration-300"></div>
              <Card className="relative bg-slate-900/80 border-slate-700 hover:border-slate-600 transition-all duration-300 h-full">
                <CardHeader className="space-y-4">
                  <div className={`inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-r ${solution.color} text-white`}>
                    {solution.icon}
                  </div>
                  <CardTitle className="text-2xl text-white">{solution.title}</CardTitle>
                  <CardDescription className="text-gray-300 text-base leading-relaxed">
                    {solution.description}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    {solution.features.map((feature, i) => (
                      <div key={i} className="flex items-center text-gray-300">
                        <CheckCircle className="w-4 h-4 text-green-400 mr-3 flex-shrink-0" />
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
        </motion.div>
      </div>
    </AnimatedSection>
  );
}

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
    <AnimatedSection id="pricing" className="py-24 bg-slate-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          className="text-center mb-16"
          variants={fadeInUp}
        >
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
        </motion.div>

        <motion.div
          className="grid grid-cols-1 md:grid-cols-3 gap-8"
          variants={staggerContainer}
        >
          {plans.map((plan, index) => (
            <motion.div
              key={index}
              variants={scaleIn}
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
            </motion.div>
          ))}
        </motion.div>
        
        <motion.div
          className="text-center mt-12"
          variants={fadeInUp}
        >
          <p className="text-gray-400 mb-4">All plans include 14-day free trial • No credit card required • Cancel anytime</p>
          <Button variant="outline" className="border-gray-600 text-gray-300 hover:bg-gray-800">
            Compare All Features
            <ArrowRight className="ml-2 w-4 h-4" />
          </Button>
        </motion.div>
      </div>
    </AnimatedSection>
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
    <AnimatedSection id="testimonials" className="py-24 bg-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          className="text-center mb-16"
          variants={fadeInUp}
        >
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
        </motion.div>

        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          variants={staggerContainer}
        >
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={index}
              variants={scaleIn}
              className="group"
            >
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
            </motion.div>
          ))}
        </motion.div>
      </div>
    </AnimatedSection>
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
    <AnimatedSection className="py-24 bg-slate-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          className="text-center mb-16"
          variants={fadeInUp}
        >
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
        </motion.div>

        <motion.div
          className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-6"
          variants={staggerContainer}
        >
          {integrations.map((integration, index) => (
            <motion.div
              key={index}
              variants={scaleIn}
              className="flex flex-col items-center space-y-3 p-6 rounded-2xl bg-slate-800/50 border border-slate-700 hover:border-slate-600 transition-all duration-300 group hover:transform hover:scale-105"
            >
              <div className={`${integration.color} group-hover:scale-110 transition-transform duration-300`}>
                {integration.icon}
              </div>
              <span className="text-sm text-gray-300 font-medium">{integration.name}</span>
            </motion.div>
          ))}
        </motion.div>

        <motion.div
          className="text-center mt-12"
          variants={fadeInUp}
        >
          <p className="text-gray-400 mb-6">Don't see your platform? We're constantly adding new integrations.</p>
          <Button variant="outline" className="border-gray-600 text-gray-300 hover:bg-gray-800">
            Request Integration
            <ArrowRight className="ml-2 w-4 h-4" />
          </Button>
        </motion.div>
      </div>
    </AnimatedSection>
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
    <AnimatedSection className="py-24 bg-slate-800">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          className="text-center mb-16"
          variants={fadeInUp}
        >
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
        </motion.div>

        <motion.div
          className="space-y-6"
          variants={staggerContainer}
        >
          {faqs.map((faq, index) => (
            <motion.div
              key={index}
              variants={fadeInUp}
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
            </motion.div>
          ))}
        </motion.div>

        <motion.div
          className="text-center mt-12"
          variants={fadeInUp}
        >
          <p className="text-gray-400 mb-6">Still have questions? We're here to help!</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700">
              <Mail className="mr-2 w-4 h-4" />
              Contact Support
            </Button>
            <Button variant="outline" className="border-gray-600 text-gray-300 hover:bg-gray-800">
              <BookOpen className="mr-2 w-4 h-4" />
              View Documentation
            </Button>
          </div>
        </motion.div>
      </div>
    </AnimatedSection>
  );
}

// CTA Section
function CTASection() {
  return (
    <AnimatedSection className="py-24 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <motion.div variants={fadeInUp} className="space-y-8">
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white">
            Ready to Transform Your
            <br />
            <span className="text-blue-100">Social Media Strategy?</span>
          </h2>
          
          <p className="text-xl sm:text-2xl text-blue-100 max-w-3xl mx-auto leading-relaxed">
            Join thousands of creators and businesses who've already discovered the power of AI-driven social media management.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-8">
            <Link href="/signup">
              <Button size="lg" className="bg-white text-blue-600 hover:bg-blue-50 text-lg px-8 py-6 font-semibold">
                Start Your Free Trial
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </Link>
            <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10 text-lg px-8 py-6">
              <Play className="mr-2 w-5 h-5" />
              Watch Demo
            </Button>
          </div>

          <div className="pt-8 text-blue-100">
            <p className="text-sm opacity-90">
              ✓ 14-day free trial &nbsp;&nbsp;•&nbsp;&nbsp; ✓ No credit card required &nbsp;&nbsp;•&nbsp;&nbsp; ✓ Cancel anytime
            </p>
          </div>
        </motion.div>
      </div>
    </AnimatedSection>
  );
}

// Footer
function Footer() {
  const footerSections = [
    {
      title: "Product",
      links: ["Features", "Pricing", "Integrations", "API", "Security"]
    },
    {
      title: "Solutions",
      links: ["Creators", "Small Business", "Agencies", "Enterprise", "E-commerce"]
    },
    {
      title: "Resources",
      links: ["Blog", "Help Center", "Webinars", "Templates", "Case Studies"]
    },
    {
      title: "Company",
      links: ["About", "Careers", "Press", "Partners", "Contact"]
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
                    <a href="#" className="text-gray-400 hover:text-white transition-colors text-sm">
                      {link}
                    </a>
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
            <a href="#" className="text-gray-400 hover:text-white transition-colors text-sm">Privacy Policy</a>
            <a href="#" className="text-gray-400 hover:text-white transition-colors text-sm">Terms of Service</a>
            <a href="#" className="text-gray-400 hover:text-white transition-colors text-sm">Cookie Policy</a>
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
      className={`fixed bottom-8 right-8 p-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-300 z-50 ${
        isVisible ? 'opacity-100' : 'opacity-0 pointer-events-none'
      }`}
      onClick={scrollToTop}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
    >
      <ChevronUp className="w-5 h-5" />
    </motion.button>
  );
}

// Main Landing Page Component
export default function Landing() {
  return (
    <div className="min-h-screen bg-slate-900 text-white overflow-x-hidden">
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
  );
}