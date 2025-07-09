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
  Clock,
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
        <div className="bg-gray-100 rounded-lg p-4 sm:p-8 mb-16">
          <div className="bg-white rounded-lg shadow-2xl overflow-hidden">
            {/* Dashboard Header */}
            <div className="bg-gray-50 border-b border-gray-200 px-4 sm:px-6 py-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2 sm:space-x-4">
                  <div className="w-6 h-6 sm:w-8 sm:h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                    <span className="text-white font-bold text-xs sm:text-sm">V</span>
                  </div>
                  <h3 className="text-lg sm:text-xl font-bold text-gray-900">VeeFore Dashboard</h3>
                </div>
                <div className="flex items-center space-x-2 sm:space-x-4">
                  <Button size="sm" variant="outline" className="hidden sm:flex">
                    <Calendar className="w-4 h-4 mr-2" />
                    Schedule
                  </Button>
                  <Button size="sm" className="bg-blue-600 text-white">
                    <BrainCircuit className="w-4 h-4 mr-2" />
                    <span className="hidden sm:inline">AI Generate</span>
                    <span className="sm:hidden">AI</span>
                  </Button>
                </div>
              </div>
            </div>

            {/* Dashboard Content */}
            <div className="p-4 sm:p-6">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
                {/* Left Column - Content Creation */}
                <div className="lg:col-span-2 space-y-4 sm:space-y-6">
                  {/* AI Content Generator */}
                  <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg p-4 sm:p-6 border border-purple-200">
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
                  <div className="bg-white rounded-lg border border-gray-200 p-4 sm:p-6">
                    <div className="flex items-center justify-between mb-4">
                      <h4 className="text-base sm:text-lg font-semibold text-gray-900">Content Calendar</h4>
                      <Button size="sm" variant="outline" className="text-xs sm:text-sm">View All</Button>
                    </div>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-200">
                        <div className="flex items-center space-x-2 sm:space-x-3 flex-wrap sm:flex-nowrap">
                          <div className="w-3 h-3 bg-blue-500 rounded-full flex-shrink-0"></div>
                          <span className="text-xs sm:text-sm font-medium text-gray-900">Instagram Post</span>
                          <Badge className="text-xs bg-blue-100 text-blue-800 border-blue-300">Scheduled</Badge>
                        </div>
                        <span className="text-xs sm:text-sm text-gray-800 font-medium flex-shrink-0">2:00 PM</span>
                      </div>
                      <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-200">
                        <div className="flex items-center space-x-2 sm:space-x-3 flex-wrap sm:flex-nowrap">
                          <div className="w-3 h-3 bg-green-500 rounded-full flex-shrink-0"></div>
                          <span className="text-xs sm:text-sm font-medium text-gray-900">LinkedIn Article</span>
                          <Badge className="text-xs bg-orange-100 text-orange-800 border-orange-300">Draft</Badge>
                        </div>
                        <span className="text-xs sm:text-sm text-gray-800 font-medium flex-shrink-0">4:30 PM</span>
                      </div>
                      <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-200">
                        <div className="flex items-center space-x-2 sm:space-x-3 flex-wrap sm:flex-nowrap">
                          <div className="w-3 h-3 bg-purple-500 rounded-full flex-shrink-0"></div>
                          <span className="text-xs sm:text-sm font-medium text-gray-900">Twitter Thread</span>
                          <Badge className="text-xs bg-purple-100 text-purple-800 border-purple-300">AI Generated</Badge>
                        </div>
                        <span className="text-xs sm:text-sm text-gray-800 font-medium flex-shrink-0">6:00 PM</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Right Column - Analytics & Insights */}
                <div className="space-y-4 sm:space-y-6">
                  {/* Analytics Widget */}
                  <div className="bg-white rounded-lg border border-gray-200 p-4 sm:p-6">
                    <div className="flex items-center justify-between mb-4">
                      <h4 className="text-base sm:text-lg font-semibold text-gray-900">Analytics</h4>
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
                  <div className="bg-white rounded-lg border border-gray-200 p-4 sm:p-6">
                    <div className="flex items-center justify-between mb-4">
                      <h4 className="text-base sm:text-lg font-semibold text-gray-900">Trending Now</h4>
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
                  <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-4 sm:p-6 border border-blue-200">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center space-x-2">
                        <div className="w-6 h-6 sm:w-8 sm:h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center">
                          <span className="text-white font-bold text-xs">AI</span>
                        </div>
                        <span className="text-sm sm:text-base font-semibold text-gray-900">VeeGPT</span>
                      </div>
                      <Button size="sm" variant="outline" className="text-xs sm:text-sm">Chat</Button>
                    </div>
                    <div className="bg-white rounded-lg p-3 mb-3">
                      <p className="text-xs sm:text-sm text-gray-700">💡 Try: "Create a viral Instagram post about productivity tips"</p>
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

// Comprehensive Feature Detail Sections - All 9 Features
function FeatureDetailSections() {
  return (
    <section id="features" className="py-16 sm:py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="space-y-16 sm:space-y-24 lg:space-y-32">
          {/* Feature 1: AI Content Generator */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-12 items-center">
            <div>
              <div className="flex items-center mb-6">
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-purple-100 rounded-lg flex items-center justify-center mr-4">
                  <BrainCircuit className="w-5 h-5 sm:w-6 sm:h-6 text-purple-600" />
                </div>
                <div>
                  <h3 className="text-2xl sm:text-3xl font-bold text-gray-900">Create smarter with AI-powered content</h3>
                </div>
              </div>
              <p className="text-base sm:text-lg text-gray-600 mb-6">
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
                <div className="flex items-center">
                  <CheckCircle className="w-5 h-5 text-green-500 mr-3" />
                  <span className="text-gray-700">Viral content suggestions</span>
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
                    "Ready to level up your content game? 🚀 Our AI tools help you create scroll-stopping posts that actually convert. #ContentCreation #AIMarketing #VeeFore"
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

          {/* Feature 2: AI Image Generator */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="order-2 lg:order-1">
              <div className="bg-white rounded-lg shadow-xl p-8">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h4 className="text-lg font-semibold text-gray-900">AI Image Generator</h4>
                    <Badge className="bg-blue-100 text-blue-800">DALL-E 3</Badge>
                  </div>
                  <div className="bg-gray-100 rounded-lg h-40 flex items-center justify-center border border-gray-300">
                    <div className="text-center">
                      <Camera className="w-8 h-8 text-gray-500 mx-auto mb-2" />
                      <p className="text-sm text-gray-800 font-medium">Generated Image Preview</p>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-800 font-medium">Style</span>
                      <span className="text-sm font-medium text-gray-900">Professional</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-800 font-medium">Resolution</span>
                      <span className="text-sm font-medium text-gray-900">1080x1080</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-800 font-medium">Brand Colors</span>
                      <span className="text-sm font-medium text-gray-900">Applied</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="order-1 lg:order-2">
              <div className="flex items-center mb-6">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mr-4">
                  <Camera className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <h3 className="text-3xl font-bold text-gray-900">Generate stunning visuals with AI</h3>
                </div>
              </div>
              <p className="text-lg text-gray-600 mb-6">
                Create professional-quality images with DALL-E 3 integration. Generate custom visuals that match your brand aesthetic and engage your audience.
              </p>
              <div className="space-y-3">
                <div className="flex items-center">
                  <CheckCircle className="w-5 h-5 text-green-500 mr-3" />
                  <span className="text-gray-700">DALL-E 3 powered generation</span>
                </div>
                <div className="flex items-center">
                  <CheckCircle className="w-5 h-5 text-green-500 mr-3" />
                  <span className="text-gray-700">Brand-consistent styling</span>
                </div>
                <div className="flex items-center">
                  <CheckCircle className="w-5 h-5 text-green-500 mr-3" />
                  <span className="text-gray-700">Multiple format support</span>
                </div>
                <div className="flex items-center">
                  <CheckCircle className="w-5 h-5 text-green-500 mr-3" />
                  <span className="text-gray-700">Custom prompt optimization</span>
                </div>
              </div>
            </div>
          </div>

          {/* Feature 3: AI Thumbnail Maker Pro */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="flex items-center mb-6">
                <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center mr-4">
                  <Video className="w-6 h-6 text-red-600" />
                </div>
                <div>
                  <h3 className="text-3xl font-bold text-gray-900">Create scroll-stopping YouTube thumbnails</h3>
                </div>
              </div>
              <p className="text-lg text-gray-600 mb-6">
                Design professional YouTube thumbnails with our 7-stage AI process. Maximize your click-through rates with data-driven thumbnail optimization.
              </p>
              <div className="space-y-3">
                <div className="flex items-center">
                  <CheckCircle className="w-5 h-5 text-green-500 mr-3" />
                  <span className="text-gray-700">7-stage AI generation process</span>
                </div>
                <div className="flex items-center">
                  <CheckCircle className="w-5 h-5 text-green-500 mr-3" />
                  <span className="text-gray-700">CTR optimization algorithms</span>
                </div>
                <div className="flex items-center">
                  <CheckCircle className="w-5 h-5 text-green-500 mr-3" />
                  <span className="text-gray-700">Professional canvas editor</span>
                </div>
                <div className="flex items-center">
                  <CheckCircle className="w-5 h-5 text-green-500 mr-3" />
                  <span className="text-gray-700">Multiple layout variants</span>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-lg shadow-xl p-8">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-700">Thumbnail Maker Pro</span>
                  <Badge className="bg-red-100 text-red-800">7-Stage Process</Badge>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-gray-100 rounded-lg h-24 flex items-center justify-center">
                    <span className="text-xs text-gray-600">Layout 1</span>
                  </div>
                  <div className="bg-gray-100 rounded-lg h-24 flex items-center justify-center">
                    <span className="text-xs text-gray-600">Layout 2</span>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">CTR Prediction</span>
                    <span className="text-sm font-medium text-green-600">89%</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Viral Potential</span>
                    <span className="text-sm font-medium text-blue-600">High</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Feature 4: Content Scheduler */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="order-2 lg:order-1">
              <div className="bg-white rounded-lg shadow-xl p-8">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h4 className="text-lg font-semibold text-gray-900">Content Calendar</h4>
                    <Calendar className="w-5 h-5 text-gray-400" />
                  </div>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg border border-green-200">
                      <div className="flex items-center space-x-3">
                        <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                        <span className="text-sm font-medium text-green-900">Instagram Post</span>
                      </div>
                      <Badge className="bg-green-100 text-green-800">Scheduled</Badge>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg border border-blue-200">
                      <div className="flex items-center space-x-3">
                        <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                        <span className="text-sm font-medium text-blue-900">LinkedIn Article</span>
                      </div>
                      <Badge className="bg-blue-100 text-blue-800">Draft</Badge>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-purple-50 rounded-lg border border-purple-200">
                      <div className="flex items-center space-x-3">
                        <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
                        <span className="text-sm font-medium text-purple-900">Twitter Thread</span>
                      </div>
                      <Badge className="bg-purple-100 text-purple-800">AI Generated</Badge>
                    </div>
                  </div>
                  <div className="pt-4 border-t">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-800 font-medium">Optimal posting time</span>
                      <span className="font-medium text-green-700">2:00 PM</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="order-1 lg:order-2">
              <div className="flex items-center mb-6">
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mr-4">
                  <Calendar className="w-6 h-6 text-green-600" />
                </div>
                <div>
                  <h3 className="text-3xl font-bold text-gray-900">Schedule posts and manage content</h3>
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
                <div className="flex items-center">
                  <CheckCircle className="w-5 h-5 text-green-500 mr-3" />
                  <span className="text-gray-700">Content approval workflow</span>
                </div>
              </div>
            </div>
          </div>

          {/* Feature 5: Analytics & Insights */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="flex items-center mb-6">
                <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mr-4">
                  <BarChart3 className="w-6 h-6 text-orange-600" />
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
                <div className="flex items-center">
                  <CheckCircle className="w-5 h-5 text-green-500 mr-3" />
                  <span className="text-gray-700">Custom report generation</span>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-lg shadow-xl p-8">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="text-lg font-semibold text-gray-900">Performance Dashboard</h4>
                  <Button size="sm" variant="outline">Export Report</Button>
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
                  <div className="text-center">
                    <BarChart3 className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                    <span className="text-sm text-gray-500">Analytics Chart</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Feature 6: Smart DM Automation */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="order-2 lg:order-1">
              <div className="bg-white rounded-lg shadow-xl p-8">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h4 className="text-lg font-semibold text-gray-900">DM Automation</h4>
                    <Badge className="bg-indigo-100 text-indigo-800">AI Powered</Badge>
                  </div>
                  <div className="space-y-3">
                    <div className="bg-gray-50 p-3 rounded-lg">
                      <div className="flex items-center space-x-2 mb-2">
                        <MessageSquare className="w-4 h-4 text-blue-600" />
                        <span className="text-sm font-medium">Auto-Response Rule</span>
                      </div>
                      <p className="text-sm text-gray-600">
                        "Thanks for reaching out! We'll get back to you within 24 hours."
                      </p>
                    </div>
                    <div className="bg-gray-50 p-3 rounded-lg">
                      <div className="flex items-center space-x-2 mb-2">
                        <Users className="w-4 h-4 text-green-600" />
                        <span className="text-sm font-medium">Lead Qualification</span>
                      </div>
                      <p className="text-sm text-gray-600">
                        AI detects potential customers and tags them automatically
                      </p>
                    </div>
                  </div>
                  <div className="pt-4 border-t">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">Response Rate</span>
                      <span className="font-medium text-green-600">95%</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="order-1 lg:order-2">
              <div className="flex items-center mb-6">
                <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center mr-4">
                  <MessageSquare className="w-6 h-6 text-indigo-600" />
                </div>
                <div>
                  <h3 className="text-3xl font-bold text-gray-900">Automate messages and engagement</h3>
                </div>
              </div>
              <p className="text-lg text-gray-600 mb-6">
                Never miss a message with intelligent DM automation. Our AI responds to inquiries, qualifies leads, and maintains engagement 24/7.
              </p>
              <div className="space-y-3">
                <div className="flex items-center">
                  <CheckCircle className="w-5 h-5 text-green-500 mr-3" />
                  <span className="text-gray-700">Smart auto-responses</span>
                </div>
                <div className="flex items-center">
                  <CheckCircle className="w-5 h-5 text-green-500 mr-3" />
                  <span className="text-gray-700">Lead qualification</span>
                </div>
                <div className="flex items-center">
                  <CheckCircle className="w-5 h-5 text-green-500 mr-3" />
                  <span className="text-gray-700">24/7 availability</span>
                </div>
                <div className="flex items-center">
                  <CheckCircle className="w-5 h-5 text-green-500 mr-3" />
                  <span className="text-gray-700">Sentiment analysis</span>
                </div>
              </div>
            </div>
          </div>

          {/* Feature 7: Social Listening */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="flex items-center mb-6">
                <div className="w-12 h-12 bg-pink-100 rounded-lg flex items-center justify-center mr-4">
                  <Eye className="w-6 h-6 text-pink-600" />
                </div>
                <div>
                  <h3 className="text-3xl font-bold text-gray-900">Monitor mentions and track trends</h3>
                </div>
              </div>
              <p className="text-lg text-gray-600 mb-6">
                Stay ahead of the conversation with comprehensive social listening. Track brand mentions, monitor competitors, and discover trending topics.
              </p>
              <div className="space-y-3">
                <div className="flex items-center">
                  <CheckCircle className="w-5 h-5 text-green-500 mr-3" />
                  <span className="text-gray-700">Brand mention tracking</span>
                </div>
                <div className="flex items-center">
                  <CheckCircle className="w-5 h-5 text-green-500 mr-3" />
                  <span className="text-gray-700">Competitor analysis</span>
                </div>
                <div className="flex items-center">
                  <CheckCircle className="w-5 h-5 text-green-500 mr-3" />
                  <span className="text-gray-700">Sentiment tracking</span>
                </div>
                <div className="flex items-center">
                  <CheckCircle className="w-5 h-5 text-green-500 mr-3" />
                  <span className="text-gray-700">Trending topic discovery</span>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-lg shadow-xl p-8">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="text-lg font-semibold text-gray-900">Social Listening Dashboard</h4>
                  <Badge className="bg-pink-100 text-pink-800">Live</Badge>
                </div>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg border border-green-200">
                    <div className="flex items-center space-x-3">
                      <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                      <span className="text-sm font-medium text-green-900">Brand Mentions</span>
                    </div>
                    <span className="text-sm font-semibold text-green-700">+25</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg border border-blue-200">
                    <div className="flex items-center space-x-3">
                      <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                      <span className="text-sm font-medium text-blue-900">Sentiment Score</span>
                    </div>
                    <span className="text-sm font-semibold text-blue-700">89% Positive</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-purple-50 rounded-lg border border-purple-200">
                    <div className="flex items-center space-x-3">
                      <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
                      <span className="text-sm font-medium text-purple-900">Trending Topics</span>
                    </div>
                    <span className="text-sm font-semibold text-purple-700">12 New</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Feature 8: Trend Intelligence */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="order-2 lg:order-1">
              <div className="bg-white rounded-lg shadow-xl p-8">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h4 className="text-lg font-semibold text-gray-900">Trend Intelligence</h4>
                    <Badge className="bg-yellow-100 text-yellow-800">Real-time</Badge>
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
                  <div className="pt-4 border-t">
                    <div className="bg-yellow-50 p-3 rounded-lg">
                      <div className="flex items-center space-x-2 mb-2">
                        <TrendingUp className="w-4 h-4 text-yellow-600" />
                        <span className="text-sm font-medium">Viral Prediction</span>
                      </div>
                      <p className="text-sm text-gray-600">
                        AI predicts 85% chance of viral success for #TechTrends
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="order-1 lg:order-2">
              <div className="flex items-center mb-6">
                <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center mr-4">
                  <TrendingUp className="w-6 h-6 text-yellow-600" />
                </div>
                <div>
                  <h3 className="text-3xl font-bold text-gray-900">Stay ahead with trend intelligence</h3>
                </div>
              </div>
              <p className="text-lg text-gray-600 mb-6">
                Discover trending topics before they explode. Our AI analyzes millions of posts to identify emerging trends and predict viral content.
              </p>
              <div className="space-y-3">
                <div className="flex items-center">
                  <CheckCircle className="w-5 h-5 text-green-500 mr-3" />
                  <span className="text-gray-700">Real-time trend analysis</span>
                </div>
                <div className="flex items-center">
                  <CheckCircle className="w-5 h-5 text-green-500 mr-3" />
                  <span className="text-gray-700">Viral prediction algorithms</span>
                </div>
                <div className="flex items-center">
                  <CheckCircle className="w-5 h-5 text-green-500 mr-3" />
                  <span className="text-gray-700">Content optimization suggestions</span>
                </div>
                <div className="flex items-center">
                  <CheckCircle className="w-5 h-5 text-green-500 mr-3" />
                  <span className="text-gray-700">Trend forecasting</span>
                </div>
              </div>
            </div>
          </div>

          {/* Feature 9: Competitor Analysis */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="flex items-center mb-6">
                <div className="w-12 h-12 bg-cyan-100 rounded-lg flex items-center justify-center mr-4">
                  <Target className="w-6 h-6 text-cyan-600" />
                </div>
                <div>
                  <h3 className="text-3xl font-bold text-gray-900">Analyze competitors and market positioning</h3>
                </div>
              </div>
              <p className="text-lg text-gray-600 mb-6">
                Understand your competitive landscape with comprehensive competitor analysis. Track their strategies, performance, and identify opportunities.
              </p>
              <div className="space-y-3">
                <div className="flex items-center">
                  <CheckCircle className="w-5 h-5 text-green-500 mr-3" />
                  <span className="text-gray-700">Competitor content analysis</span>
                </div>
                <div className="flex items-center">
                  <CheckCircle className="w-5 h-5 text-green-500 mr-3" />
                  <span className="text-gray-700">Performance benchmarking</span>
                </div>
                <div className="flex items-center">
                  <CheckCircle className="w-5 h-5 text-green-500 mr-3" />
                  <span className="text-gray-700">Market gap identification</span>
                </div>
                <div className="flex items-center">
                  <CheckCircle className="w-5 h-5 text-green-500 mr-3" />
                  <span className="text-gray-700">Strategic recommendations</span>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-lg shadow-xl p-8">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="text-lg font-semibold text-gray-900">Competitor Analysis</h4>
                  <Badge className="bg-cyan-100 text-cyan-800">Advanced</Badge>
                </div>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg border border-blue-200">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                        <span className="text-white font-bold text-xs">A</span>
                      </div>
                      <div>
                        <span className="text-sm font-medium text-blue-900">Competitor A</span>
                        <p className="text-xs text-gray-700">Engagement: 5.2K</p>
                      </div>
                    </div>
                    <span className="text-sm font-semibold text-blue-700">+15%</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg border border-green-200">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                        <span className="text-white font-bold text-xs">B</span>
                      </div>
                      <div>
                        <span className="text-sm font-medium text-green-900">Competitor B</span>
                        <p className="text-xs text-gray-700">Engagement: 3.8K</p>
                      </div>
                    </div>
                    <span className="text-sm font-semibold text-green-700">+8%</span>
                  </div>
                </div>
                <div className="pt-4 border-t">
                  <div className="bg-cyan-50 p-3 rounded-lg border border-cyan-200">
                    <div className="flex items-center space-x-2 mb-2">
                      <Target className="w-4 h-4 text-cyan-600" />
                      <span className="text-sm font-medium text-cyan-900">Market Opportunity</span>
                    </div>
                    <p className="text-sm text-gray-800">
                      Video content shows 40% higher engagement than competitors
                    </p>
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
    <section className="py-16 sm:py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12 sm:mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
            Real Results from VeeFore Users
          </h2>
          <p className="text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto">
            Join thousands of creators, businesses, and agencies who are already transforming 
            their social media presence with VeeFore's AI-powered platform.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
          {stats.map((stat, index) => (
            <div key={index} className="text-center bg-gray-50 rounded-2xl p-6 sm:p-8 hover:shadow-lg transition-shadow duration-300">
              <div className="flex justify-center mb-4 sm:mb-6">
                {stat.icon}
              </div>
              <div className={`text-4xl sm:text-5xl font-bold ${stat.color} mb-4`}>{stat.number}</div>
              <p className="text-gray-600 text-base sm:text-lg leading-relaxed">{stat.description}</p>
            </div>
          ))}
        </div>
        
        {/* Detailed User Testimonials */}
        <div className="mt-16 sm:mt-20 bg-gray-50 rounded-3xl p-6 sm:p-8 lg:p-12">
          <div className="text-center mb-8 sm:mb-12">
            <h3 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4">What Our Users Say</h3>
            <p className="text-base sm:text-lg text-gray-600">Trusted by creators, marketers, and agencies worldwide</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
            <div className="bg-white rounded-xl p-6 sm:p-8 shadow-lg">
              <div className="flex text-yellow-400 mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 sm:w-5 sm:h-5 fill-current" />
                ))}
              </div>
              <p className="text-gray-700 mb-6 text-base sm:text-lg">
                "VeeFore's AI content generator has completely transformed my workflow. I'm creating better content in half the time and my engagement has tripled!"
              </p>
              <div className="flex items-center space-x-4">
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                  <span className="text-white font-bold text-sm sm:text-base">SJ</span>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 text-sm sm:text-base">Sarah Johnson</h4>
                  <p className="text-xs sm:text-sm text-gray-600">Content Creator • 150K followers</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl p-8 shadow-lg">
              <div className="flex text-yellow-400 mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 fill-current" />
                ))}
              </div>
              <p className="text-gray-700 mb-6 text-lg">
                "The analytics insights are incredible. I finally understand what content resonates with my audience. ROI tracking has improved our campaigns by 200%."
              </p>
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-teal-600 rounded-full flex items-center justify-center">
                  <span className="text-white font-bold">MC</span>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900">Mike Chen</h4>
                  <p className="text-sm text-gray-600">Digital Marketing Director • Tech Startup</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl p-8 shadow-lg">
              <div className="flex text-yellow-400 mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 fill-current" />
                ))}
              </div>
              <p className="text-gray-700 mb-6 text-lg">
                "Managing 15+ clients is effortless now. The automation features and team collaboration tools have revolutionized our agency operations."
              </p>
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-600 rounded-full flex items-center justify-center">
                  <span className="text-white font-bold">ER</span>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900">Emma Rodriguez</h4>
                  <p className="text-sm text-gray-600">Agency Owner • Social Media Agency</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Success Stories Grid */}
        <div className="mt-20">
          <div className="text-center mb-12">
            <h3 className="text-3xl font-bold text-gray-900 mb-4">Success Stories</h3>
            <p className="text-lg text-gray-600">Real results from businesses of all sizes</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-8 border border-blue-200">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h4 className="text-xl font-bold text-gray-900">TechStartup Inc.</h4>
                  <p className="text-gray-600">B2B SaaS Company</p>
                </div>
                <div className="text-right">
                  <div className="text-3xl font-bold text-blue-600">450%</div>
                  <p className="text-sm text-gray-600">Lead increase</p>
                </div>
              </div>
              <p className="text-gray-700 mb-4">
                "After implementing VeeFore's AI content strategy, our LinkedIn engagement skyrocketed. We went from 50 leads/month to 275 leads/month in just 3 months."
              </p>
              <div className="flex items-center space-x-4 text-sm text-gray-600">
                <div className="flex items-center">
                  <Users className="w-4 h-4 mr-1" />
                  Team: 5 people
                </div>
                <div className="flex items-center">
                  <Calendar className="w-4 h-4 mr-1" />
                  Timeline: 3 months
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-r from-green-50 to-teal-50 rounded-xl p-8 border border-green-200">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h4 className="text-xl font-bold text-gray-900">Fashion Forward</h4>
                  <p className="text-gray-600">E-commerce Brand</p>
                </div>
                <div className="text-right">
                  <div className="text-3xl font-bold text-green-600">280%</div>
                  <p className="text-sm text-gray-600">Sales growth</p>
                </div>
              </div>
              <p className="text-gray-700 mb-4">
                "VeeFore's trend intelligence helped us identify viral fashion trends early. Our Instagram sales increased by 280% using AI-generated content."
              </p>
              <div className="flex items-center space-x-4 text-sm text-gray-600">
                <div className="flex items-center">
                  <TrendingUp className="w-4 h-4 mr-1" />
                  Revenue: $2.8M
                </div>
                <div className="flex items-center">
                  <Calendar className="w-4 h-4 mr-1" />
                  Timeline: 6 months
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl p-8 border border-purple-200">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h4 className="text-xl font-bold text-gray-900">Creative Agency Pro</h4>
                  <p className="text-gray-600">Digital Marketing Agency</p>
                </div>
                <div className="text-right">
                  <div className="text-3xl font-bold text-purple-600">15</div>
                  <p className="text-sm text-gray-600">Hours saved/week</p>
                </div>
              </div>
              <p className="text-gray-700 mb-4">
                "VeeFore's automation and team collaboration features allow us to manage 3x more clients with the same team size. Game-changer for our productivity."
              </p>
              <div className="flex items-center space-x-4 text-sm text-gray-600">
                <div className="flex items-center">
                  <Users className="w-4 h-4 mr-1" />
                  Clients: 45+
                </div>
                <div className="flex items-center">
                  <Clock className="w-4 h-4 mr-1" />
                  Time saved: 60hrs/month
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-r from-orange-50 to-red-50 rounded-xl p-8 border border-orange-200">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h4 className="text-xl font-bold text-gray-900">FitLife Coach</h4>
                  <p className="text-gray-600">Fitness Influencer</p>
                </div>
                <div className="text-right">
                  <div className="text-3xl font-bold text-orange-600">500K</div>
                  <p className="text-sm text-gray-600">New followers</p>
                </div>
              </div>
              <p className="text-gray-700 mb-4">
                "Using VeeFore's viral prediction AI, I consistently create content that hits 100K+ views. Grew from 50K to 550K followers in 8 months."
              </p>
              <div className="flex items-center space-x-4 text-sm text-gray-600">
                <div className="flex items-center">
                  <TrendingUp className="w-4 h-4 mr-1" />
                  Avg views: 250K
                </div>
                <div className="flex items-center">
                  <Calendar className="w-4 h-4 mr-1" />
                  Timeline: 8 months
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Platform Comparison */}
        <div className="mt-20 bg-gradient-to-r from-gray-900 to-black rounded-3xl p-12 text-white">
          <div className="text-center mb-12">
            <h3 className="text-3xl font-bold mb-4">Why Choose VeeFore Over Traditional Tools?</h3>
            <p className="text-lg opacity-90">See how VeeFore's AI-powered approach outperforms legacy social media tools</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-red-500 rounded-full flex items-center justify-center mx-auto mb-6">
                <X className="w-8 h-8 text-white" />
              </div>
              <h4 className="text-xl font-bold mb-4">Traditional Tools</h4>
              <ul className="space-y-3 text-gray-300">
                <li>• Manual content creation</li>
                <li>• Basic scheduling only</li>
                <li>• Limited analytics</li>
                <li>• No AI assistance</li>
                <li>• Platform silos</li>
                <li>• Time-consuming workflows</li>
              </ul>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle className="w-8 h-8 text-white" />
              </div>
              <h4 className="text-xl font-bold mb-4 text-blue-400">VeeFore AI Platform</h4>
              <ul className="space-y-3 text-blue-200">
                <li>• AI-powered content generation</li>
                <li>• Smart scheduling optimization</li>
                <li>• Advanced analytics & insights</li>
                <li>• 9+ AI tools integrated</li>
                <li>• Unified platform experience</li>
                <li>• Automated workflows</li>
              </ul>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-purple-500 rounded-full flex items-center justify-center mx-auto mb-6">
                <Zap className="w-8 h-8 text-white" />
              </div>
              <h4 className="text-xl font-bold mb-4">The VeeFore Advantage</h4>
              <ul className="space-y-3 text-gray-300">
                <li>• 95% time savings</li>
                <li>• 300% engagement boost</li>
                <li>• Real-time trend analysis</li>
                <li>• Viral prediction AI</li>
                <li>• Complete automation</li>
                <li>• ROI optimization</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Industry Recognition */}
        <div className="mt-20 text-center">
          <h3 className="text-2xl font-bold text-gray-900 mb-8">Trusted by Industry Leaders</h3>
          <div className="flex items-center justify-center space-x-12 opacity-60">
            <div className="text-2xl font-bold text-gray-600">TechCrunch</div>
            <div className="text-2xl font-bold text-gray-600">Forbes</div>
            <div className="text-2xl font-bold text-gray-600">Entrepreneur</div>
            <div className="text-2xl font-bold text-gray-600">Inc.</div>
            <div className="text-2xl font-bold text-gray-600">Wired</div>
          </div>
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

// Hootsuite-Style Pricing Section
function PricingSection() {
  const [isAnnual, setIsAnnual] = useState(false);
  const [expandedPlan, setExpandedPlan] = useState<string | null>(null);

  const plans = [
    {
      name: "Free",
      monthlyPrice: "₹0",
      annualPrice: "₹0",
      period: "forever",
      description: "Perfect for getting started with AI-powered social media management",
      features: [
        "Up to 1 social account connection",
        "20 AI credits monthly for content generation", 
        "Basic analytics and performance tracking",
        "Email support during business hours",
        "Access to AI Content Generator",
        "Basic post scheduling",
        "Community support forum"
      ],
      isPopular: false,
      buttonText: "Free 30-day trial",
      buttonVariant: "outline" as const,
      detailedFeatures: [
        "Connect 1 Instagram, Facebook, Twitter, LinkedIn, or YouTube account",
        "Generate 20 AI-powered posts, captions, and hashtags per month",
        "View basic engagement metrics and follower growth",
        "Schedule up to 10 posts per month",
        "Access to VeeFore community and knowledge base"
      ]
    },
    {
      name: "Starter", 
      monthlyPrice: "₹699",
      annualPrice: "₹489",
      period: "per user/mo*",
      description: "Everything in Free, PLUS advanced AI tools and analytics",
      features: [
        "Up to 2 social accounts",
        "300 AI credits monthly",
        "Advanced analytics dashboard", 
        "Priority email support",
        "Content calendar and scheduling",
        "AI Image Generator access",
        "Basic automation rules",
        "Performance insights and recommendations"
      ],
      isPopular: true,
      buttonText: "Free 30-day trial",
      buttonVariant: "default" as const,
      detailedFeatures: [
        "Connect 2 social media accounts across all major platforms",
        "Generate 300 AI-powered posts, images, and content pieces monthly",
        "Advanced analytics with engagement tracking and competitor insights",
        "Unlimited post scheduling with optimal timing suggestions",
        "Create custom images with DALL-E 3 integration",
        "Set up basic DM automation and auto-responses",
        "Access to trend analysis and viral prediction tools"
      ]
    },
    {
      name: "Pro",
      monthlyPrice: "₹1,499", 
      annualPrice: "₹1,049",
      period: "per user/mo*",
      description: "Everything in Starter, PLUS team collaboration and advanced AI tools",
      features: [
        "Up to 5 social accounts",
        "1,100 AI credits monthly",
        "Team collaboration workspace",
        "Advanced AI tools (Thumbnail Maker Pro, ROI Calculator)",
        "Custom analytics reports",
        "Advanced automation rules",
        "White-label content options",
        "Phone and email support"
      ],
      isPopular: false,
      buttonText: "Free 30-day trial", 
      buttonVariant: "outline" as const,
      detailedFeatures: [
        "Connect 5 social media accounts with full cross-platform management",
        "1,100 AI credits for comprehensive content creation and analysis",
        "Team workspace with role-based access and collaboration tools",
        "Access to all AI tools including Thumbnail Maker Pro and Competitor Analysis",
        "Generate custom analytics reports with advanced insights",
        "Advanced automation with sentiment analysis and lead qualification",
        "Priority phone support with dedicated account assistance"
      ]
    },
    {
      name: "Business",
      monthlyPrice: "₹2,199",
      annualPrice: "₹1,539", 
      period: "per user/mo*",
      description: "Everything in Pro, PLUS enterprise features and unlimited access",
      features: [
        "Unlimited social accounts",
        "2,000 AI credits monthly",
        "White-label solution with custom branding", 
        "API access for integrations",
        "Dedicated account manager",
        "Custom AI model training",
        "Advanced team management",
        "24/7 priority support"
      ],
      isPopular: false,
      buttonText: "Request a Demo",
      buttonVariant: "outline" as const,
      detailedFeatures: [
        "Connect unlimited social media accounts across all platforms",
        "2,000 AI credits with option to purchase additional credits",
        "Complete white-label solution with your branding and domain",
        "Full API access for custom integrations and workflow automation",
        "Dedicated account manager for strategic guidance and support",
        "Custom AI model training for your specific brand voice and style",
        "Advanced team management with detailed permissions and audit logs",
        "24/7 phone, email, and chat support with 1-hour response time"
      ]
    }
  ];

  const togglePlan = (planName: string) => {
    setExpandedPlan(expandedPlan === planName ? null : planName);
  };

  return (
    <section id="pricing" className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Pick the plan that's right for you
          </h2>
          <p className="text-xl text-gray-600 mb-8">
            Manage all of your social media in one place.
          </p>

          {/* Billing Toggle */}
          <div className="flex items-center justify-center space-x-4 mb-12">
            <span className={`text-sm font-medium ${!isAnnual ? 'text-gray-900' : 'text-gray-500'}`}>
              Pay monthly
            </span>
            <button
              onClick={() => setIsAnnual(!isAnnual)}
              className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                isAnnual ? 'bg-gray-900' : 'bg-gray-300'
              }`}
            >
              <span
                className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                  isAnnual ? 'translate-x-5' : 'translate-x-0'
                }`}
              />
            </button>
            <span className={`text-sm font-medium ${isAnnual ? 'text-gray-900' : 'text-gray-500'}`}>
              Pay annually
              <span className="ml-1 text-xs text-green-600 font-medium">(Save up to 30%)</span>
            </span>
          </div>
        </div>

        {/* Desktop Layout */}
        <div className="hidden lg:grid grid-cols-4 gap-6">
          {plans.map((plan, index) => (
            <div key={index} className={`relative bg-white rounded-lg border ${plan.isPopular ? 'border-red-500' : 'border-gray-200'} p-6`}>
              {plan.isPopular && (
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                  <span className="bg-red-500 text-white px-4 py-1 rounded-full text-sm font-medium">
                    Most popular
                  </span>
                </div>
              )}
              
              <div className="mb-6">
                <h3 className="text-xl font-bold text-gray-900 mb-2">{plan.name}</h3>
                <div className="mb-2">
                  <span className="text-3xl font-bold text-gray-900">
                    {isAnnual ? plan.annualPrice : plan.monthlyPrice}
                  </span>
                  <span className="text-sm text-gray-500 ml-1">{plan.period}</span>
                </div>
                
                <Button 
                  variant={plan.buttonVariant}
                  className={`w-full mb-4 ${
                    plan.isPopular 
                      ? 'bg-red-500 hover:bg-red-600 text-white' 
                      : plan.buttonVariant === 'outline' 
                        ? 'border-gray-900 text-gray-900 hover:bg-gray-50'
                        : 'bg-gray-900 hover:bg-gray-800 text-white'
                  }`}
                  onClick={() => plan.buttonText === 'Request a Demo' 
                    ? window.open('mailto:contact@veefore.com?subject=Business Plan Demo Request', '_blank')
                    : window.location.href = '/signup'
                  }
                >
                  {plan.buttonText}
                </Button>

                {/* Social Media Icons */}
                <div className="flex items-center justify-center space-x-2 mb-4">
                  <Instagram className="w-4 h-4 text-gray-400" />
                  <Facebook className="w-4 h-4 text-gray-400" />
                  <Twitter className="w-4 h-4 text-gray-400" />
                  <Youtube className="w-4 h-4 text-gray-400" />
                  <Linkedin className="w-4 h-4 text-gray-400" />
                </div>
              </div>

              <div>
                <p className="text-sm font-medium text-gray-900 mb-3">{plan.description}</p>
                <ul className="space-y-2">
                  {plan.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-start text-sm text-gray-700">
                      <span className="text-gray-400 mr-2">–</span>
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>

        {/* Mobile Layout - Accordion Style */}
        <div className="lg:hidden space-y-4">
          {plans.map((plan, index) => (
            <div key={index} className={`bg-white rounded-lg border ${plan.isPopular ? 'border-red-500' : 'border-gray-200'} overflow-hidden`}>
              {plan.isPopular && (
                <div className="bg-red-500 text-white text-center py-2 text-sm font-medium">
                  Most popular
                </div>
              )}
              
              <button 
                onClick={() => togglePlan(plan.name)}
                className="w-full p-4 flex items-center justify-between text-left"
              >
                <div className="flex-1">
                  <h3 className="text-base sm:text-lg font-bold text-gray-900">{plan.name}</h3>
                  <div className="mt-1">
                    <span className="text-xl sm:text-2xl font-bold text-gray-900">
                      {isAnnual ? plan.annualPrice : plan.monthlyPrice}
                    </span>
                    <span className="text-xs sm:text-sm text-gray-500 ml-1">{plan.period}</span>
                  </div>
                </div>
                <div className="text-gray-400 text-xl">
                  {expandedPlan === plan.name ? '−' : '+'}
                </div>
              </button>

              {expandedPlan === plan.name && (
                <div className="px-4 pb-4 border-t border-gray-100">
                  <Button 
                    variant={plan.buttonVariant}
                    className={`w-full mb-4 mt-4 ${
                      plan.isPopular 
                        ? 'bg-red-500 hover:bg-red-600 text-white' 
                        : 'bg-gray-900 hover:bg-gray-800 text-white'
                    }`}
                    onClick={() => plan.buttonText === 'Request a Demo' 
                      ? window.open('mailto:contact@veefore.com?subject=Business Plan Demo Request', '_blank')
                      : window.location.href = '/signup'
                    }
                  >
                    {plan.buttonText}
                  </Button>

                  {/* Social Media Icons */}
                  <div className="flex items-center justify-center space-x-2 mb-4">
                    <Instagram className="w-4 h-4 text-gray-400" />
                    <Facebook className="w-4 h-4 text-gray-400" />
                    <Twitter className="w-4 h-4 text-gray-400" />
                    <Youtube className="w-4 h-4 text-gray-400" />
                    <Linkedin className="w-4 h-4 text-gray-400" />
                  </div>

                  <div>
                    <p className="text-sm font-medium text-gray-900 mb-3">Features included:</p>
                    <ul className="space-y-2">
                      {plan.detailedFeatures.map((feature, featureIndex) => (
                        <li key={featureIndex} className="flex items-start text-sm text-gray-700">
                          <span className="text-gray-400 mr-2">–</span>
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Additional Information */}
        <div className="mt-12 text-center">
          <p className="text-sm text-gray-500">
            * Prices displayed in INR, based on annual billing, but do not include applicable taxes.
          </p>
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

// AI Tools Showcase Section
function AIToolsShowcase() {
  const aiTools = [
    {
      name: "AI Content Generator",
      description: "Generate engaging posts, captions, and hashtags instantly with brand voice consistency",
      icon: <BrainCircuit className="w-8 h-8 text-purple-600" />,
      credits: "2 credits",
      features: ["Multi-platform optimization", "Brand voice learning", "Hashtag generation", "Content calendar integration"],
      color: "from-purple-500 to-indigo-600"
    },
    {
      name: "AI Image Generator", 
      description: "Create stunning visuals with DALL-E 3 integration for professional-quality content",
      icon: <Camera className="w-8 h-8 text-blue-600" />,
      credits: "4 credits",
      features: ["DALL-E 3 powered", "Custom brand styling", "Multiple formats", "Instant generation"],
      color: "from-blue-500 to-cyan-600"
    },
    {
      name: "AI Thumbnail Maker Pro",
      description: "7-stage AI process for creating high-CTR YouTube thumbnails with professional layouts",
      icon: <Video className="w-8 h-8 text-red-600" />,
      credits: "8 credits", 
      features: ["7-stage generation", "CTR optimization", "Canvas editor", "Multiple variants"],
      color: "from-red-500 to-pink-600"
    },
    {
      name: "Content Scheduler",
      description: "AI-optimized scheduling across platforms with intelligent timing recommendations",
      icon: <Calendar className="w-8 h-8 text-green-600" />,
      credits: "1 credit",
      features: ["Smart timing", "Multi-platform", "Bulk scheduling", "Analytics integration"],
      color: "from-green-500 to-teal-600"
    },
    {
      name: "Analytics & Insights",
      description: "Comprehensive performance tracking with AI-powered recommendations",
      icon: <BarChart3 className="w-8 h-8 text-orange-600" />,
      credits: "Free",
      features: ["Real-time metrics", "Cross-platform analytics", "AI insights", "Custom reports"],
      color: "from-orange-500 to-red-600"
    },
    {
      name: "Smart DM Automation",
      description: "24/7 intelligent message automation with lead qualification and sentiment analysis",
      icon: <MessageSquare className="w-8 h-8 text-indigo-600" />,
      credits: "1 credit",
      features: ["Auto responses", "Lead qualification", "Sentiment analysis", "24/7 availability"],
      color: "from-indigo-500 to-purple-600"
    },
    {
      name: "Social Listening",
      description: "Monitor brand mentions, track competitors, and discover trending topics in real-time",
      icon: <Eye className="w-8 h-8 text-pink-600" />,
      credits: "4 credits",
      features: ["Brand monitoring", "Competitor analysis", "Sentiment tracking", "Trend discovery"],
      color: "from-pink-500 to-rose-600"
    },
    {
      name: "Trend Intelligence",
      description: "AI-powered trend analysis with viral prediction and content optimization",
      icon: <TrendingUp className="w-8 h-8 text-yellow-600" />,
      credits: "6 credits",
      features: ["Viral prediction", "Trend forecasting", "Content optimization", "Real-time analysis"],
      color: "from-yellow-500 to-orange-600"
    },
    {
      name: "Competitor Analysis",
      description: "Comprehensive competitive intelligence with strategic recommendations",
      icon: <Target className="w-8 h-8 text-cyan-600" />,
      credits: "7 credits",
      features: ["Performance benchmarking", "Content analysis", "Market gaps", "Strategic insights"],
      color: "from-cyan-500 to-blue-600"
    }
  ];

  return (
    <section className="py-16 sm:py-20 bg-gradient-to-br from-gray-50 to-blue-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12 sm:mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
            9 Powerful AI Tools, One Unified Platform
          </h2>
          <p className="text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto">
            Experience the complete suite of AI-powered social media tools designed to transform your content strategy and maximize engagement.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {aiTools.map((tool, index) => (
            <div key={index} className="bg-white rounded-2xl p-6 sm:p-8 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100">
              <div className={`w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-r ${tool.color} rounded-xl flex items-center justify-center mb-4 sm:mb-6`}>
                {tool.icon}
              </div>
              
              <div className="mb-4">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-lg sm:text-xl font-bold text-gray-900">{tool.name}</h3>
                  <Badge className="bg-gray-100 text-gray-700 text-xs">{tool.credits}</Badge>
                </div>
                <p className="text-sm sm:text-base text-gray-600 mb-4">{tool.description}</p>
              </div>

              <ul className="space-y-2">
                {tool.features.map((feature, featureIndex) => (
                  <li key={featureIndex} className="flex items-center text-sm text-gray-700">
                    <CheckCircle className="w-4 h-4 text-green-500 mr-2 flex-shrink-0" />
                    {feature}
                  </li>
                ))}
              </ul>

              <Button 
                variant="outline" 
                className="w-full mt-6 border-gray-300 hover:bg-gray-50"
                onClick={() => window.location.href = '/signup'}
              >
                Try {tool.name}
              </Button>
            </div>
          ))}
        </div>

        <div className="mt-16 text-center">
          <div className="bg-gradient-to-r from-purple-600 to-blue-600 rounded-3xl p-12 text-white">
            <h3 className="text-3xl font-bold mb-4">Ready to Experience All 9 AI Tools?</h3>
            <p className="text-xl mb-8 opacity-90">
              Start with our free plan and explore the complete AI-powered social media toolkit
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                size="lg" 
                className="bg-white text-purple-600 hover:bg-gray-100 px-8 py-4 font-bold rounded-xl"
                onClick={() => window.location.href = '/signup'}
              >
                Start Free Trial
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
              <Button 
                size="lg" 
                variant="outline"
                className="border-white text-white hover:bg-white hover:text-purple-600 px-8 py-4 font-bold rounded-xl"
                onClick={() => document.getElementById('pricing')?.scrollIntoView({ behavior: 'smooth' })}
              >
                View Pricing
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
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
      <AIToolsShowcase />
      <ResultsSection />
      <PricingSection />
      <VeeForeFooter />
    </div>
  );
}