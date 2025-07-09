import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useDeviceWaitlistStatus } from '@/hooks/useDeviceWaitlistStatus';
import { useLocation } from 'wouter';
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
  Timer,
  Target,
  CheckCircle,
  Play,
  Instagram,
  Youtube,
  Twitter,
  Linkedin,
  Facebook,
  Camera,
  Video,
  BrainCircuit,
  Eye,
  Heart,
  Menu,
  X,
  Star,
  BookOpen,
  Award,
  Building,
  Monitor,
  Smartphone,
  Mail,
  ExternalLink
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

// Navigation Component
function VeeForeNavigation() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [, setLocation] = useLocation();
  const deviceStatus = useDeviceWaitlistStatus();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
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

  return (
    <nav className={`fixed w-full top-0 z-50 transition-all duration-300 ${
      isScrolled ? 'bg-white/95 backdrop-blur-md shadow-lg' : 'bg-white'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">V</span>
              </div>
              <span className="text-xl font-bold text-gray-900">VeeFore</span>
            </div>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <a href="#features" className="text-gray-600 hover:text-blue-600 transition-colors">Features</a>
            <a href="#pricing" className="text-gray-600 hover:text-blue-600 transition-colors">Pricing</a>
            <a href="#about" className="text-gray-600 hover:text-blue-600 transition-colors">About</a>
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => setLocation('/signin')}
            >
              Sign In
            </Button>
            <Button 
              size="sm"
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
              onClick={handleGetStarted}
            >
              Get Started
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </Button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden bg-white border-t">
            <div className="px-2 pt-2 pb-3 space-y-1">
              <a href="#features" className="block px-3 py-2 text-gray-600 hover:text-blue-600">Features</a>
              <a href="#pricing" className="block px-3 py-2 text-gray-600 hover:text-blue-600">Pricing</a>
              <a href="#about" className="block px-3 py-2 text-gray-600 hover:text-blue-600">About</a>
              <div className="pt-2 space-y-2">
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="w-full"
                  onClick={() => setLocation('/signin')}
                >
                  Sign In
                </Button>
                <Button 
                  size="sm" 
                  className="w-full bg-gradient-to-r from-blue-600 to-purple-600"
                  onClick={handleGetStarted}
                >
                  Get Started
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}

// Hero Section
function HeroSection() {
  const [, setLocation] = useLocation();

  return (
    <section className="pt-24 pb-16 bg-gradient-to-br from-blue-50 to-purple-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-4xl mx-auto"
          >
            <Badge className="mb-6 bg-blue-100 text-blue-800 px-4 py-2 text-sm font-medium">
              🚀 15+ AI-Powered Tools Available Now
            </Badge>
            
            <h1 className="text-5xl md:text-6xl font-bold text-gray-900 leading-tight mb-6">
              Transform Your Social Media with{' '}
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                AI-Powered Intelligence
              </span>
            </h1>
            
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
              VeeFore combines 15+ advanced AI tools to automate content creation, scheduling, 
              analytics, and engagement across all your social media platforms. Save hours daily 
              while growing your audience faster than ever before.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mt-8">
              <Button 
                size="lg" 
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-4 text-lg font-semibold rounded-lg shadow-lg transform hover:scale-105 transition-all duration-300"
                onClick={() => setLocation('/signup')}
              >
                Start Free Trial
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
              
              <Button 
                variant="outline" 
                size="lg" 
                className="border-2 border-blue-600 text-blue-600 hover:bg-blue-50 px-8 py-4 text-lg font-semibold rounded-lg"
                onClick={() => setLocation('/demo')}
              >
                <Play className="w-5 h-5 mr-2" />
                Watch Demo
              </Button>
            </div>
            
            <div className="mt-12 flex items-center justify-center space-x-8 text-sm text-gray-500">
              <div className="flex items-center">
                <CheckCircle className="w-5 h-5 text-green-500 mr-2" />
                No Credit Card Required
              </div>
              <div className="flex items-center">
                <CheckCircle className="w-5 h-5 text-green-500 mr-2" />
                14-Day Free Trial
              </div>
              <div className="flex items-center">
                <CheckCircle className="w-5 h-5 text-green-500 mr-2" />
                Cancel Anytime
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

// Platform Stats Section
function PlatformStats() {
  const stats = [
    {
      icon: <BrainCircuit className="w-8 h-8 text-purple-600" />,
      number: "15+",
      label: "AI-Powered Tools",
      description: "Advanced automation suite"
    },
    {
      icon: <Users className="w-8 h-8 text-blue-600" />,
      number: "500K+",
      label: "Active Users",
      description: "Growing community worldwide"
    },
    {
      icon: <BarChart3 className="w-8 h-8 text-green-600" />,
      number: "95%",
      label: "Time Saved",
      description: "Automated workflows"
    },
    {
      icon: <Globe className="w-8 h-8 text-orange-600" />,
      number: "50+",
      label: "Countries",
      description: "Global reach"
    }
  ];

  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <div key={index} className="text-center">
              <div className="flex justify-center mb-4">
                {stat.icon}
              </div>
              <div className="text-3xl font-bold text-gray-900 mb-2">{stat.number}</div>
              <div className="text-lg font-semibold text-gray-700 mb-1">{stat.label}</div>
              <div className="text-sm text-gray-500">{stat.description}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// AI Tools Features Section
function AIToolsSection() {
  const aiTools = [
    {
      icon: <BrainCircuit className="w-8 h-8 text-purple-600" />,
      title: "AI Content Generator",
      description: "Generate engaging posts, captions, and hashtags with advanced AI technology.",
      features: ["Auto-hashtag generation", "Caption writing", "Content ideation", "Multi-platform optimization"]
    },
    {
      icon: <Camera className="w-8 h-8 text-blue-600" />,
      title: "AI Image Generator",
      description: "Create stunning visual content with DALL-E 3 integration for your brand.",
      features: ["DALL-E 3 integration", "Brand consistency", "Custom prompts", "High-quality output"]
    },
    {
      icon: <Video className="w-8 h-8 text-red-600" />,
      title: "AI Thumbnail Maker Pro",
      description: "Design scroll-stopping YouTube thumbnails with 7-stage AI process.",
      features: ["7-stage generation", "CTR optimization", "Professional layouts", "Canvas editor"]
    },
    {
      icon: <TrendingUp className="w-8 h-8 text-green-600" />,
      title: "Trend Intelligence Engine",
      description: "Stay ahead of viral trends with real-time social media analysis.",
      features: ["Real-time analysis", "Viral prediction", "Trend forecasting", "Competitor tracking"]
    },
    {
      icon: <BarChart3 className="w-8 h-8 text-orange-600" />,
      title: "Analytics & Insights",
      description: "Deep dive into your social media performance with AI-powered analytics.",
      features: ["Cross-platform analytics", "Growth tracking", "ROI calculation", "Performance insights"]
    },
    {
      icon: <MessageSquare className="w-8 h-8 text-indigo-600" />,
      title: "Smart DM Automation",
      description: "Automate your direct messages with AI-powered responses.",
      features: ["Auto-responses", "Smart filtering", "Personalization", "24/7 availability"]
    },
    {
      icon: <Calendar className="w-8 h-8 text-cyan-600" />,
      title: "Content Scheduler",
      description: "Plan and schedule your content across multiple platforms.",
      features: ["Multi-platform scheduling", "Optimal timing", "Content calendar", "Bulk scheduling"]
    },
    {
      icon: <Eye className="w-8 h-8 text-pink-600" />,
      title: "Social Listening",
      description: "Monitor brand mentions, track competitors, and discover opportunities.",
      features: ["Brand monitoring", "Competitor analysis", "Sentiment tracking", "Opportunity detection"]
    },
    {
      icon: <Target className="w-8 h-8 text-yellow-600" />,
      title: "Competitor Analysis",
      description: "Analyze your competitors' strategies and performance.",
      features: ["Strategy analysis", "Performance comparison", "Content gaps", "Market positioning"]
    }
  ];

  return (
    <section id="features" className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            15+ AI-Powered Tools in One Platform
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Everything you need to dominate social media. From content creation to analytics, 
            our AI tools work together to grow your audience and boost engagement.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {aiTools.map((tool, index) => (
            <Card key={index} className="hover:shadow-lg transition-shadow duration-300">
              <CardHeader>
                <div className="flex items-center space-x-3 mb-3">
                  {tool.icon}
                  <CardTitle className="text-xl">{tool.title}</CardTitle>
                </div>
                <CardDescription className="text-gray-600">
                  {tool.description}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {tool.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-center text-sm">
                      <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                      {feature}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}

// Results Section
function ResultsSection() {
  const stats = [
    {
      number: "95%",
      description: "Average time saved on content creation with VeeFore's AI automation",
      icon: <Timer className="w-8 h-8 text-blue-600" />,
      color: "text-blue-600"
    },
    {
      number: "300%",
      description: "Average engagement increase within first 30 days of using VeeFore",
      icon: <TrendingUp className="w-8 h-8 text-green-600" />,
      color: "text-green-600"
    },
    {
      number: "15+",
      description: "AI-powered tools working together to optimize your social media strategy",
      icon: <BrainCircuit className="w-8 h-8 text-purple-600" />,
      color: "text-purple-600"
    }
  ];

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Real Results from VeeFore Users
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Join thousands of creators, businesses, and agencies who are already transforming 
            their social media presence with VeeFore's AI-powered platform.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {stats.map((stat, index) => (
            <div key={index} className="text-center bg-gray-50 rounded-2xl p-8 hover:shadow-lg transition-shadow duration-300">
              <div className="flex justify-center mb-6">
                {stat.icon}
              </div>
              <div className={`text-5xl font-bold ${stat.color} mb-4`}>{stat.number}</div>
              <p className="text-gray-600 text-lg leading-relaxed">{stat.description}</p>
            </div>
          ))}
        </div>
        
        <div className="mt-16 text-center">
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 text-white">
            <h3 className="text-2xl font-bold mb-4">Ready to Transform Your Social Media?</h3>
            <p className="text-lg mb-6 opacity-90">
              Join the AI revolution and discover what VeeFore can do for your brand
            </p>
            <Button 
              size="lg" 
              className="bg-white text-blue-600 hover:bg-gray-100 px-8 py-3 font-semibold rounded-lg"
              onClick={() => window.location.href = '/signup'}
            >
              Start Your Free Trial
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}

// Pricing Section
function PricingSection() {
  const plans = [
    {
      name: "Free",
      price: "₹0",
      period: "forever",
      description: "Perfect for getting started",
      features: [
        "20 AI credits monthly",
        "1 social account",
        "Basic analytics",
        "Email support"
      ],
      highlighted: false
    },
    {
      name: "Starter",
      price: "₹699",
      period: "per month",
      description: "Ideal for individual creators",
      features: [
        "300 AI credits monthly",
        "2 social accounts",
        "Advanced analytics",
        "Priority support",
        "Content scheduling"
      ],
      highlighted: true
    },
    {
      name: "Pro",
      price: "₹1,499",
      period: "per month",
      description: "Perfect for growing businesses",
      features: [
        "1,100 AI credits monthly",
        "5 social accounts",
        "Team collaboration",
        "Advanced AI tools",
        "Custom analytics"
      ],
      highlighted: false
    },
    {
      name: "Business",
      price: "₹2,199",
      period: "per month",
      description: "For agencies and enterprises",
      features: [
        "2,000 AI credits monthly",
        "Unlimited social accounts",
        "White-label solution",
        "API access",
        "Dedicated support"
      ],
      highlighted: false
    }
  ];

  return (
    <section id="pricing" className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Choose Your Plan
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Start free and upgrade as you grow. All plans include our core AI tools 
            and 24/7 support to help you succeed.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {plans.map((plan, index) => (
            <Card key={index} className={`relative ${plan.highlighted ? 'ring-2 ring-blue-500 shadow-lg' : ''}`}>
              {plan.highlighted && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <Badge className="bg-blue-500 text-white">Most Popular</Badge>
                </div>
              )}
              <CardHeader className="text-center">
                <CardTitle className="text-2xl">{plan.name}</CardTitle>
                <div className="mt-4">
                  <span className="text-4xl font-bold text-gray-900">{plan.price}</span>
                  <span className="text-gray-600 ml-2">/{plan.period}</span>
                </div>
                <CardDescription className="mt-2">{plan.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  {plan.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-center text-sm">
                      <CheckCircle className="w-4 h-4 text-green-500 mr-3" />
                      {feature}
                    </li>
                  ))}
                </ul>
                <Button 
                  className={`w-full mt-6 ${plan.highlighted ? 'bg-blue-600 hover:bg-blue-700' : 'bg-gray-900 hover:bg-gray-800'}`}
                  onClick={() => window.location.href = '/signup'}
                >
                  Get Started
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}

// Footer
function VeeForeFooter() {
  return (
    <footer className="bg-gray-900 text-white py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">V</span>
              </div>
              <span className="text-xl font-bold">VeeFore</span>
            </div>
            <p className="text-gray-400 mb-4">
              Transform your social media with AI-powered intelligence. 
              Save time, grow faster, engage better.
            </p>
            <div className="flex space-x-4">
              <Button variant="ghost" size="sm">
                <Instagram className="w-5 h-5" />
              </Button>
              <Button variant="ghost" size="sm">
                <Twitter className="w-5 h-5" />
              </Button>
              <Button variant="ghost" size="sm">
                <Linkedin className="w-5 h-5" />
              </Button>
              <Button variant="ghost" size="sm">
                <Youtube className="w-5 h-5" />
              </Button>
            </div>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4">Product</h3>
            <ul className="space-y-2 text-gray-400">
              <li><a href="#features" className="hover:text-white transition-colors">Features</a></li>
              <li><a href="#pricing" className="hover:text-white transition-colors">Pricing</a></li>
              <li><a href="/demo" className="hover:text-white transition-colors">Demo</a></li>
              <li><a href="/api" className="hover:text-white transition-colors">API</a></li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4">Company</h3>
            <ul className="space-y-2 text-gray-400">
              <li><a href="/about" className="hover:text-white transition-colors">About</a></li>
              <li><a href="/careers" className="hover:text-white transition-colors">Careers</a></li>
              <li><a href="/blog" className="hover:text-white transition-colors">Blog</a></li>
              <li><a href="/contact" className="hover:text-white transition-colors">Contact</a></li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4">Support</h3>
            <ul className="space-y-2 text-gray-400">
              <li><a href="/help" className="hover:text-white transition-colors">Help Center</a></li>
              <li><a href="/privacy" className="hover:text-white transition-colors">Privacy Policy</a></li>
              <li><a href="/terms" className="hover:text-white transition-colors">Terms of Service</a></li>
              <li><a href="/security" className="hover:text-white transition-colors">Security</a></li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-gray-800 mt-12 pt-8 text-center text-gray-400">
          <p>&copy; 2025 VeeFore — A product of VEEFED TECHNOLOGIES PRIVATE LIMITED. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}

// Main Landing Page Component
export default function HootsuiteLanding() {
  return (
    <div className="min-h-screen bg-white">
      <VeeForeNavigation />
      <HeroSection />
      <PlatformStats />
      <AIToolsSection />
      <ResultsSection />
      <PricingSection />
      <VeeForeFooter />
    </div>
  );
}