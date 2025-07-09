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

// Dashboard Preview Section - Hootsuite Style
function DashboardPreview() {
  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            What's in the VeeFore dashboard?
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Schedule, engage, monitor, and analyze social media posts. All in one user-friendly dashboard.
          </p>
        </div>

        {/* Dashboard Interface Mockup */}
        <div className="bg-gray-100 rounded-lg p-8 mb-16">
          <div className="bg-white rounded-lg shadow-2xl overflow-hidden">
            {/* Dashboard Header */}
            <div className="bg-gray-50 border-b border-gray-200 px-6 py-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                    <span className="text-white font-bold text-sm">V</span>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900">VeeFore Dashboard</h3>
                </div>
                <div className="flex items-center space-x-4">
                  <Button size="sm" variant="outline">
                    <Calendar className="w-4 h-4 mr-2" />
                    Schedule
                  </Button>
                  <Button size="sm" className="bg-blue-600 text-white">
                    <BrainCircuit className="w-4 h-4 mr-2" />
                    AI Generate
                  </Button>
                </div>
              </div>
            </div>

            {/* Dashboard Content */}
            <div className="p-6">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Left Column - Content Creation */}
                <div className="lg:col-span-2 space-y-6">
                  {/* AI Content Generator */}
                  <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg p-6 border border-purple-200">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center space-x-3">
                        <BrainCircuit className="w-6 h-6 text-purple-600" />
                        <h4 className="text-lg font-semibold text-gray-900">AI Content Generator</h4>
                      </div>
                      <Badge className="bg-purple-100 text-purple-800">Active</Badge>
                    </div>
                    <div className="bg-white rounded-lg p-4 mb-4">
                      <p className="text-sm text-gray-600 mb-2">Generated Caption:</p>
                      <p className="text-gray-900 font-medium">
                        "🚀 Ready to transform your social media game? Our AI-powered platform helps you create engaging content in seconds! #SocialMediaMarketing #AIContent #VeeFore"
                      </p>
                    </div>
                    <div className="flex items-center space-x-4 text-sm text-gray-600">
                      <div className="flex items-center">
                        <CheckCircle className="w-4 h-4 text-green-500 mr-1" />
                        Hashtags optimized
                      </div>
                      <div className="flex items-center">
                        <TrendingUp className="w-4 h-4 text-blue-500 mr-1" />
                        Viral potential: 85%
                      </div>
                    </div>
                  </div>

                  {/* Content Calendar */}
                  <div className="bg-white rounded-lg border border-gray-200 p-6">
                    <div className="flex items-center justify-between mb-4">
                      <h4 className="text-lg font-semibold text-gray-900">Content Calendar</h4>
                      <Button size="sm" variant="outline">View All</Button>
                    </div>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div className="flex items-center space-x-3">
                          <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                          <span className="text-sm font-medium">Instagram Post</span>
                          <Badge variant="outline" className="text-xs">Scheduled</Badge>
                        </div>
                        <span className="text-sm text-gray-600">2:00 PM</span>
                      </div>
                      <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div className="flex items-center space-x-3">
                          <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                          <span className="text-sm font-medium">LinkedIn Article</span>
                          <Badge variant="outline" className="text-xs">Draft</Badge>
                        </div>
                        <span className="text-sm text-gray-600">4:30 PM</span>
                      </div>
                      <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div className="flex items-center space-x-3">
                          <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
                          <span className="text-sm font-medium">Twitter Thread</span>
                          <Badge variant="outline" className="text-xs">AI Generated</Badge>
                        </div>
                        <span className="text-sm text-gray-600">6:00 PM</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Right Column - Analytics & Insights */}
                <div className="space-y-6">
                  {/* Analytics Widget */}
                  <div className="bg-white rounded-lg border border-gray-200 p-6">
                    <div className="flex items-center justify-between mb-4">
                      <h4 className="text-lg font-semibold text-gray-900">Analytics</h4>
                      <BarChart3 className="w-5 h-5 text-gray-400" />
                    </div>
                    <div className="space-y-4">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-blue-600">12.5K</div>
                        <div className="text-sm text-gray-600">Total Engagement</div>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="text-center">
                          <div className="text-lg font-semibold text-green-600">+45%</div>
                          <div className="text-xs text-gray-600">Growth</div>
                        </div>
                        <div className="text-center">
                          <div className="text-lg font-semibold text-purple-600">89%</div>
                          <div className="text-xs text-gray-600">Reach</div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Trending Topics */}
                  <div className="bg-white rounded-lg border border-gray-200 p-6">
                    <div className="flex items-center justify-between mb-4">
                      <h4 className="text-lg font-semibold text-gray-900">Trending Now</h4>
                      <TrendingUp className="w-5 h-5 text-gray-400" />
                    </div>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-700">#AIContent</span>
                        <span className="text-sm font-semibold text-green-600">+250%</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-700">#SocialMedia</span>
                        <span className="text-sm font-semibold text-blue-600">+180%</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-700">#Marketing</span>
                        <span className="text-sm font-semibold text-purple-600">+120%</span>
                      </div>
                    </div>
                  </div>

                  {/* AI Assistant */}
                  <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-6 border border-blue-200">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center space-x-2">
                        <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center">
                          <span className="text-white font-bold text-xs">AI</span>
                        </div>
                        <span className="font-semibold text-gray-900">VeeGPT</span>
                      </div>
                      <Button size="sm" variant="outline">Chat</Button>
                    </div>
                    <div className="bg-white rounded-lg p-3 mb-3">
                      <p className="text-sm text-gray-700">💡 Try: "Create a viral Instagram post about productivity tips"</p>
                    </div>
                    <div className="text-xs text-gray-600">
                      <p>✨ AI suggestions ready</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// Feature Detail Sections - Hootsuite Style
function FeatureDetailSections() {
  return (
    <section id="features" className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="space-y-24">
          {/* Feature 1: AI Content Creation */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="flex items-center mb-6">
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mr-4">
                  <BrainCircuit className="w-6 h-6 text-purple-600" />
                </div>
                <div>
                  <h3 className="text-3xl font-bold text-gray-900">Create smarter with AI-powered content</h3>
                </div>
              </div>
              <p className="text-lg text-gray-600 mb-6">
                Generate engaging posts, captions, and hashtags instantly. Our AI understands your brand voice and creates content that resonates with your audience across all platforms.
              </p>
              <div className="space-y-3">
                <div className="flex items-center">
                  <CheckCircle className="w-5 h-5 text-green-500 mr-3" />
                  <span className="text-gray-700">Auto-generate captions and hashtags</span>
                </div>
                <div className="flex items-center">
                  <CheckCircle className="w-5 h-5 text-green-500 mr-3" />
                  <span className="text-gray-700">Brand voice consistency</span>
                </div>
                <div className="flex items-center">
                  <CheckCircle className="w-5 h-5 text-green-500 mr-3" />
                  <span className="text-gray-700">Multi-platform optimization</span>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-lg shadow-xl p-8">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-700">AI Content Generator</span>
                  <Badge className="bg-purple-100 text-purple-800">Active</Badge>
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="text-sm text-gray-600 mb-2">Generated Caption:</p>
                  <p className="text-gray-900 font-medium">
                    "Ready to level up your content game? 🚀 Our AI tools help you create scroll-stopping posts that actually convert. #ContentCreation #AIMarketing"
                  </p>
                </div>
                <div className="flex items-center space-x-4 text-sm">
                  <div className="flex items-center text-green-600">
                    <TrendingUp className="w-4 h-4 mr-1" />
                    Viral Score: 92%
                  </div>
                  <div className="flex items-center text-blue-600">
                    <Target className="w-4 h-4 mr-1" />
                    Engagement: High
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Feature 2: Analytics & Insights */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="order-2 lg:order-1">
              <div className="bg-white rounded-lg shadow-xl p-8">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h4 className="text-lg font-semibold text-gray-900">Social Media Performance</h4>
                    <Button size="sm" variant="outline">View Report</Button>
                  </div>
                  <div className="grid grid-cols-3 gap-4">
                    <div className="text-center p-4 bg-blue-50 rounded-lg">
                      <div className="text-2xl font-bold text-blue-600">12.5K</div>
                      <div className="text-sm text-gray-600">Engagement</div>
                    </div>
                    <div className="text-center p-4 bg-green-50 rounded-lg">
                      <div className="text-2xl font-bold text-green-600">+45%</div>
                      <div className="text-sm text-gray-600">Growth</div>
                    </div>
                    <div className="text-center p-4 bg-purple-50 rounded-lg">
                      <div className="text-2xl font-bold text-purple-600">89%</div>
                      <div className="text-sm text-gray-600">Reach</div>
                    </div>
                  </div>
                  <div className="h-32 bg-gray-50 rounded-lg flex items-center justify-center">
                    <BarChart3 className="w-8 h-8 text-gray-400" />
                    <span className="ml-2 text-gray-500">Analytics Chart</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="order-1 lg:order-2">
              <div className="flex items-center mb-6">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mr-4">
                  <BarChart3 className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <h3 className="text-3xl font-bold text-gray-900">Analyze social media performance</h3>
                </div>
              </div>
              <p className="text-lg text-gray-600 mb-6">
                Track your success across all platforms with detailed analytics. Understand what content performs best and optimize your strategy with AI-powered insights.
              </p>
              <div className="space-y-3">
                <div className="flex items-center">
                  <CheckCircle className="w-5 h-5 text-green-500 mr-3" />
                  <span className="text-gray-700">Real-time performance tracking</span>
                </div>
                <div className="flex items-center">
                  <CheckCircle className="w-5 h-5 text-green-500 mr-3" />
                  <span className="text-gray-700">Cross-platform analytics</span>
                </div>
                <div className="flex items-center">
                  <CheckCircle className="w-5 h-5 text-green-500 mr-3" />
                  <span className="text-gray-700">AI-powered recommendations</span>
                </div>
              </div>
            </div>
          </div>

          {/* Feature 3: Content Scheduling */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="flex items-center mb-6">
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mr-4">
                  <Calendar className="w-6 h-6 text-green-600" />
                </div>
                <div>
                  <h3 className="text-3xl font-bold text-gray-900">Schedule posts and create content</h3>
                </div>
              </div>
              <p className="text-lg text-gray-600 mb-6">
                Plan your content calendar with AI-suggested optimal posting times. Schedule across all platforms and let our automation handle the rest.
              </p>
              <div className="space-y-3">
                <div className="flex items-center">
                  <CheckCircle className="w-5 h-5 text-green-500 mr-3" />
                  <span className="text-gray-700">Multi-platform scheduling</span>
                </div>
                <div className="flex items-center">
                  <CheckCircle className="w-5 h-5 text-green-500 mr-3" />
                  <span className="text-gray-700">AI-optimized timing</span>
                </div>
                <div className="flex items-center">
                  <CheckCircle className="w-5 h-5 text-green-500 mr-3" />
                  <span className="text-gray-700">Bulk content upload</span>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-lg shadow-xl p-8">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="text-lg font-semibold text-gray-900">Content Calendar</h4>
                  <Calendar className="w-5 h-5 text-gray-400" />
                </div>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                      <span className="text-sm font-medium">Instagram Post</span>
                    </div>
                    <Badge className="bg-green-100 text-green-800">Scheduled</Badge>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                      <span className="text-sm font-medium">LinkedIn Article</span>
                    </div>
                    <Badge className="bg-blue-100 text-blue-800">Draft</Badge>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-purple-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
                      <span className="text-sm font-medium">Twitter Thread</span>
                    </div>
                    <Badge className="bg-purple-100 text-purple-800">AI Generated</Badge>
                  </div>
                </div>
              </div>
            </div>
          </div>
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
      <DashboardPreview />
      <FeatureDetailSections />
      <ResultsSection />
      <PricingSection />
      <VeeForeFooter />
    </div>
  );
}