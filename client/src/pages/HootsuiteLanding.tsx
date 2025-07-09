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
  Clock,
  Target,
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
  ChevronDown,
  Star,
  ExternalLink,
  Download,
  Layers,
  Megaphone,
  TrendingDown,
  Eye,
  MousePointer,
  Repeat,
  Hash,
  Filter,
  Share2,
  Bell,
  Bookmark,
  MessageCircle,
  Heart,
  MoreHorizontal,
  Maximize,
  RotateCcw,
  Layout,
  Lightbulb,
  Puzzle,
  Gauge
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

// Professional Navigation Component
function ProfessionalNavigation() {
  const [isScrolled, setIsScrolled] = useState(false);
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
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      isScrolled ? 'bg-white/95 backdrop-blur-md shadow-sm' : 'bg-white'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">V</span>
              </div>
              <span className="text-xl font-bold text-gray-900">VeeFore</span>
            </div>
          </div>
          
          <div className="hidden md:flex items-center space-x-8">
            <div className="relative group">
              <button className="flex items-center text-gray-700 hover:text-blue-600 font-medium">
                Top features
                <ChevronDown className="w-4 h-4 ml-1" />
              </button>
            </div>
            <button className="text-gray-700 hover:text-blue-600 font-medium">Integrations</button>
            <div className="relative group">
              <button className="flex items-center text-gray-700 hover:text-blue-600 font-medium">
                Industries
                <ChevronDown className="w-4 h-4 ml-1" />
              </button>
            </div>
            <div className="relative group">
              <button className="flex items-center text-gray-700 hover:text-blue-600 font-medium">
                Resources
                <ChevronDown className="w-4 h-4 ml-1" />
              </button>
            </div>
            <button className="text-gray-700 hover:text-blue-600 font-medium">Pricing</button>
            <button className="text-gray-700 hover:text-blue-600 font-medium">Enterprise</button>
          </div>
          
          <div className="flex items-center space-x-4">
            <Button 
              variant="ghost" 
              className="text-gray-700 hover:text-blue-600 font-medium"
              onClick={() => setLocation('/signin')}
            >
              Log in
            </Button>
            <Button 
              className="bg-blue-900 hover:bg-blue-800 text-white px-6 py-2 rounded-md font-medium"
              onClick={handleGetStarted}
            >
              Start your free trial
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
}

// Hero Section
function HeroSection() {
  const [, setLocation] = useLocation();

  return (
    <section className="pt-24 pb-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-4xl mx-auto"
          >
            <h1 className="text-5xl md:text-6xl font-bold text-gray-900 leading-tight mb-6">
              Drive real business impact with{' '}
              <span className="text-blue-900">real-time social insights.</span>
              <br />
              <span className="text-red-500">VeeFore makes it easy.</span>
            </h1>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mt-8">
              <Button 
                size="lg" 
                className="bg-blue-900 hover:bg-blue-800 text-white px-8 py-4 text-lg font-semibold rounded-md"
                onClick={() => setLocation('/signup')}
              >
                Start your free trial
              </Button>
              
              <Button 
                variant="outline" 
                size="lg" 
                className="border-blue-900 text-blue-900 hover:bg-blue-50 px-8 py-4 text-lg font-semibold rounded-md"
                onClick={() => setLocation('/demo')}
              >
                Request a demo
              </Button>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

// Awards Section
function AwardsSection() {
  return (
    <section className="py-8 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-center space-x-12">
          <div className="flex items-center space-x-2">
            <Award className="w-8 h-8 text-blue-900" />
            <div>
              <div className="text-2xl font-bold text-gray-900">2025</div>
              <div className="text-sm text-red-500">#1 Social Media Suites</div>
              <div className="text-sm text-red-500">#1 Social Media Analytics</div>
              <div className="text-sm text-red-500">#1 Social Media Listening</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// Main Dashboard Preview
function DashboardPreview() {
  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-r from-pink-100 to-blue-100 rounded-3xl p-8 lg:p-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <img 
                src="/api/placeholder/600/400" 
                alt="Professional using VeeFore dashboard" 
                className="rounded-lg shadow-lg"
              />
            </div>
            <div className="space-y-6">
              <div className="bg-white rounded-lg p-6 shadow-sm">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-sm font-medium text-gray-600">Publish to</span>
                  <div className="flex space-x-2">
                    <Instagram className="w-5 h-5 text-pink-500" />
                    <Facebook className="w-5 h-5 text-blue-600" />
                    <Twitter className="w-5 h-5 text-blue-400" />
                    <Linkedin className="w-5 h-5 text-blue-700" />
                    <Youtube className="w-5 h-5 text-red-600" />
                  </div>
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="flex items-center space-x-2 mb-3">
                    <Lightbulb className="w-5 h-5 text-blue-600" />
                    <span className="text-sm font-medium text-gray-700">Start from scratch</span>
                  </div>
                  <p className="text-sm text-gray-600">Generate new captions to engage, delight, or sell</p>
                </div>
              </div>
              
              <div className="bg-white rounded-lg p-6 shadow-sm">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Analytics Dashboard</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Engagement Rate</span>
                    <span className="text-sm font-semibold text-gray-900">15.38%</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Reach</span>
                    <span className="text-sm font-semibold text-gray-900">6,783</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Followers</span>
                    <span className="text-sm font-semibold text-gray-900">2.3K</span>
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

// Trusted By Section
function TrustedBySection() {
  const companies = [
    "The University of Chicago",
    "Adobe",
    "U-HAUL",
    "IKEA",
    "World Health Organization"
  ];

  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">
            Trusted by leading organizations worldwide
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-8 items-center opacity-60">
            {companies.map((company, index) => (
              <div key={index} className="text-center">
                <div className="text-lg font-semibold text-gray-600">{company}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

// Features Section
function FeaturesSection() {
  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Explore VeeFore features: What's in the dashboard?
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Schedule, engage, monitor, and analyze social media posts. All in one user-friendly dashboard.
          </p>
        </div>

        <div className="space-y-16">
          {/* Feature 1 */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center mr-4">
                  <BrainCircuit className="w-6 h-6 text-red-600" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-gray-900">Strategize smarter with social-first AI</h3>
                  <ChevronUp className="w-5 h-5 text-gray-400" />
                </div>
              </div>
              <p className="text-gray-600 mb-6">
                Supercharge content creation, ideation, and engagement with your very own 
                social media AI assistant. Get personalized strategy advice and learn what 
                people think and feel about your brand, competitors, and hot topics. Know 
                what's trending today and anticipate what's next.
              </p>
              <Button variant="link" className="text-blue-600 hover:text-blue-800 p-0">
                Learn more →
              </Button>
            </div>
            <div className="bg-gray-50 rounded-lg p-6">
              <div className="bg-white rounded-lg p-6 shadow-sm">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-2">
                    <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center">
                      <span className="text-red-600 font-bold text-sm">V</span>
                    </div>
                    <span className="font-semibold text-gray-900">VeeGPT</span>
                  </div>
                  <Button variant="outline" size="sm">+ New chat</Button>
                </div>
                <div className="space-y-3">
                  <div className="bg-gray-50 rounded-lg p-3">
                    <p className="text-sm text-gray-700">How can VeeGPT help?</p>
                  </div>
                  <div className="text-sm text-gray-600">
                    <div className="flex items-center space-x-2 mb-2">
                      <Lightbulb className="w-4 h-4" />
                      <span>Inspire me</span>
                    </div>
                    <div className="flex items-center space-x-2 mb-2">
                      <Target className="w-4 h-4" />
                      <span>I need a campaign idea</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Calendar className="w-4 h-4" />
                      <span>Draft a posting schedule for next month</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Feature 2 */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="order-2 lg:order-1">
              <div className="bg-gray-50 rounded-lg p-6">
                <div className="bg-white rounded-lg p-6 shadow-sm">
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="font-semibold text-gray-900">Social Media Performance</h4>
                    <Button variant="outline" size="sm">Create report</Button>
                  </div>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                          <span className="text-blue-600 font-bold">6,783</span>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">Post reach • Post type</p>
                          <p className="text-sm font-semibold text-gray-900">15.38%</p>
                        </div>
                      </div>
                      <Button variant="outline" size="sm">Add metric</Button>
                    </div>
                    <div className="h-32 bg-gray-100 rounded-lg flex items-center justify-center">
                      <BarChart3 className="w-8 h-8 text-gray-400" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="order-1 lg:order-2">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mr-4">
                  <BarChart3 className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-gray-900">Analyze social media performance</h3>
                  <ChevronDown className="w-5 h-5 text-gray-400" />
                </div>
              </div>
            </div>
          </div>

          {/* Feature 3 */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mr-4">
                  <Calendar className="w-6 h-6 text-green-600" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-gray-900">Schedule posts and create content</h3>
                  <ChevronDown className="w-5 h-5 text-gray-400" />
                </div>
              </div>
            </div>
            <div className="bg-gray-50 rounded-lg p-6">
              <div className="bg-white rounded-lg p-6 shadow-sm">
                <div className="grid grid-cols-3 gap-4 mb-4">
                  <div className="text-center">
                    <div className="bg-blue-100 rounded-lg p-4 mb-2">
                      <Calendar className="w-6 h-6 text-blue-600 mx-auto" />
                    </div>
                    <span className="text-sm text-gray-600">Calendar</span>
                  </div>
                  <div className="text-center">
                    <div className="bg-purple-100 rounded-lg p-4 mb-2">
                      <FileText className="w-6 h-6 text-purple-600 mx-auto" />
                    </div>
                    <span className="text-sm text-gray-600">Content</span>
                  </div>
                  <div className="text-center">
                    <div className="bg-green-100 rounded-lg p-4 mb-2">
                      <CheckCircle className="w-6 h-6 text-green-600 mx-auto" />
                    </div>
                    <span className="text-sm text-gray-600">Approvals</span>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <span className="text-sm font-medium">Schedule multiple</span>
                    <MousePointer className="w-4 h-4 text-gray-400" />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Feature 4 */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="order-2 lg:order-1">
              <div className="bg-gray-50 rounded-lg p-6">
                <div className="bg-white rounded-lg p-6 shadow-sm">
                  <h4 className="font-semibold text-gray-900 mb-4">Message Management</h4>
                  <div className="space-y-3">
                    <div className="flex items-center space-x-3">
                      <MessageSquare className="w-5 h-5 text-blue-600" />
                      <span className="text-sm text-gray-700">Respond to messages and comments</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Bell className="w-5 h-5 text-green-600" />
                      <span className="text-sm text-gray-700">Real-time notifications</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Users className="w-5 h-5 text-purple-600" />
                      <span className="text-sm text-gray-700">Team collaboration</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="order-1 lg:order-2">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mr-4">
                  <MessageSquare className="w-6 h-6 text-purple-600" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-gray-900">Respond to messages and comments</h3>
                  <ChevronDown className="w-5 h-5 text-gray-400" />
                </div>
              </div>
            </div>
          </div>

          {/* Feature 5 */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center mr-4">
                  <TrendingUp className="w-6 h-6 text-yellow-600" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-gray-900">Track mentions, keywords, and trends</h3>
                  <ChevronDown className="w-5 h-5 text-gray-400" />
                </div>
              </div>
            </div>
            <div className="bg-gray-50 rounded-lg p-6">
              <div className="bg-white rounded-lg p-6 shadow-sm">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="font-semibold text-gray-900">Trending Topics</h4>
                  <Search className="w-5 h-5 text-gray-400" />
                </div>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-700">#TechTrends</span>
                    <span className="text-sm font-semibold text-green-600">+450%</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-700">#SocialMedia</span>
                    <span className="text-sm font-semibold text-blue-600">+322%</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-700">#AI</span>
                    <span className="text-sm font-semibold text-purple-600">+268%</span>
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

// Statistics Section
function StatisticsSection() {
  const stats = [
    {
      number: "80%",
      description: "reduction in workload using VeeFore's AI capabilities",
      logo: "VeeFore"
    },
    {
      number: "500%",
      description: "growth across all social channels using VeeFore Enterprise",
      logo: "Enterprise"
    },
    {
      number: "2M+",
      description: "new followers on social media using VeeFore Enterprise",
      logo: "Enterprise"
    }
  ];

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            What can VeeFore do for you?
          </h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {stats.map((stat, index) => (
            <div key={index} className="text-center border-r border-gray-200 last:border-r-0">
              <div className="text-6xl font-bold text-red-500 mb-4">{stat.number}</div>
              <p className="text-gray-600 mb-4">{stat.description}</p>
              <div className="text-sm text-gray-400">{stat.logo}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// AI Assistant Section
function AIAssistantSection() {
  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-4xl font-bold text-gray-900 mb-6">
              Introducing <span className="text-purple-600">VeeGPT</span>: The AI trained on real-time social trends
            </h2>
            <p className="text-xl text-gray-600 mb-8">
              Introducing VeeGPT, our all-new AI assistant that scours live social 
              feeds to help you create content, analyze performance, and build 
              campaigns based on what's happening online right now.
            </p>
            <div className="flex space-x-4">
              <Button className="bg-blue-900 hover:bg-blue-800 text-white">
                Try it for free
              </Button>
              <Button variant="outline" className="border-blue-900 text-blue-900 hover:bg-blue-50">
                Learn more
              </Button>
            </div>
          </div>
          <div className="bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl p-8 text-white">
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 bg-purple-600 rounded-full flex items-center justify-center">
                    <span className="text-white font-bold text-sm">V</span>
                  </div>
                  <span className="font-semibold">VeeGPT</span>
                </div>
              </div>
              <div className="space-y-3">
                <div className="bg-white/20 rounded-lg p-3">
                  <p className="text-sm">What's trending in my industry?</p>
                </div>
                <div className="bg-white/20 rounded-lg p-3">
                  <p className="text-sm">How can I boost engagement?</p>
                </div>
                <div className="bg-white/20 rounded-lg p-3">
                  <p className="text-sm">Draft a posting schedule for next month</p>
                </div>
                <div className="bg-white/20 rounded-lg p-3">
                  <p className="text-sm">I need a campaign idea</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// Feature Detail Sections
function FeatureDetailSections() {
  return (
    <div className="bg-white">
      {/* Content Creation Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Save time, simplify, and grow faster on social media
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              VeeFore is designed to help you manage social media faster, smarter, and with way less effort.
            </p>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-20">
            <div className="bg-gray-50 rounded-lg p-8">
              <div className="bg-white rounded-lg p-6 shadow-sm">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex space-x-2">
                    <div className="bg-blue-100 rounded-lg px-3 py-1 text-sm font-medium text-blue-800">Calendar</div>
                    <div className="bg-purple-100 rounded-lg px-3 py-1 text-sm font-medium text-purple-800">Content</div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Lightbulb className="w-5 h-5 text-blue-600" />
                    <span className="text-sm font-medium text-gray-700">Start from scratch</span>
                  </div>
                </div>
                <p className="text-sm text-gray-600 mb-4">Generate new captions to engage, delight, or sell</p>
                <div className="grid grid-cols-3 gap-3 mb-4">
                  <div className="bg-gradient-to-r from-pink-400 to-purple-400 rounded-lg h-20"></div>
                  <div className="bg-gradient-to-r from-blue-400 to-cyan-400 rounded-lg h-20"></div>
                  <div className="bg-gradient-to-r from-green-400 to-blue-400 rounded-lg h-20"></div>
                </div>
                <Button variant="outline" size="sm" className="w-full">
                  Schedule multiple
                </Button>
              </div>
            </div>
            <div>
              <h3 className="text-3xl font-bold text-gray-900 mb-6">
                Save hours posting, creating, and analyzing content
              </h3>
              <p className="text-gray-600 mb-6">
                Schedule posts to go live anytime — even if you're fast asleep or on the beach. 
                Plus, create content quickly with Canva templates and have AI write your 
                captions and hashtags for you. Then get the full picture with straightforward 
                performance reports. Oh, and did we mention it's all in one (1) tab?
              </p>
              <Button variant="outline" className="border-blue-900 text-blue-900 hover:bg-blue-50">
                Learn more
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Analytics Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h3 className="text-3xl font-bold text-gray-900 mb-6">
                Boost engagement, reach, and follower count with less effort
              </h3>
              <p className="text-gray-600 mb-6">
                See the content that brings in the most engagement and revenue and measure 
                how you're performing against your competitors. Plus, get personalized 
                suggestions for how to win in your industry. And, with reports that show you the 
                best time to post for every network, you can say goodbye to hop-scotching 
                between network tabs for good.
              </p>
              <div className="flex space-x-4">
                <Button className="bg-blue-900 hover:bg-blue-800 text-white">
                  Try it for free
                </Button>
                <Button variant="outline" className="border-blue-900 text-blue-900 hover:bg-blue-50">
                  Learn more
                </Button>
              </div>
            </div>
            <div className="bg-white rounded-lg p-8 shadow-sm">
              <div className="grid grid-cols-2 gap-6 mb-6">
                <div className="text-center">
                  <div className="text-4xl font-bold text-blue-600 mb-2">6,783</div>
                  <div className="text-sm text-gray-600">All-time reach</div>
                </div>
                <div className="text-center">
                  <div className="text-4xl font-bold text-green-600 mb-2">15.38%</div>
                  <div className="text-sm text-gray-600">Engagement rate</div>
                </div>
              </div>
              <div className="mb-6">
                <h4 className="font-semibold text-gray-900 mb-3">Post performance</h4>
                <div className="h-32 bg-gray-100 rounded-lg flex items-center justify-center">
                  <BarChart3 className="w-8 h-8 text-gray-400" />
                </div>
              </div>
              <div className="flex items-center justify-between">
                <Button variant="outline" size="sm">Add metric</Button>
                <Button variant="outline" size="sm">Create report</Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Social Listening Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="bg-gray-50 rounded-lg p-8">
              <div className="bg-white rounded-lg p-6 shadow-sm">
                <h4 className="font-semibold text-gray-900 mb-4">Results over time</h4>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Engagement</span>
                    <div className="flex items-center space-x-2">
                      <span className="text-2xl font-bold text-green-600">7.5M</span>
                      <span className="text-sm text-green-600">↗ 7.9%</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Sentiment</span>
                    <div className="flex items-center space-x-2">
                      <span className="text-lg font-bold text-green-600">62.9%</span>
                      <span className="text-sm text-green-600">Positive</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Negative</span>
                    <div className="flex items-center space-x-2">
                      <span className="text-lg font-bold text-red-600">4.2%</span>
                      <span className="text-sm text-red-600">Negative</span>
                    </div>
                  </div>
                </div>
                <div className="mt-6">
                  <Button variant="outline" size="sm" className="w-full">
                    Suspend posts
                  </Button>
                </div>
              </div>
            </div>
            <div>
              <h3 className="text-3xl font-bold text-gray-900 mb-6">
                Safeguard your reputation and never miss a chance to engage
              </h3>
              <p className="text-gray-600 mb-6">
                Keep an eye on what people are saying about your brand or industry with social 
                listening tools. Track mentions and conversations to find opportunities to engage, 
                discover new trends, or get ahead of feedback. Plus, easily suspend scheduled 
                posts in case of a potential crisis or unexpected opportunity.
              </p>
              <Button variant="outline" className="border-blue-900 text-blue-900 hover:bg-blue-50">
                Learn more
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Trends Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h3 className="text-3xl font-bold text-gray-900 mb-6">
                Stay ahead of the latest trends and boost your chances of going viral
              </h3>
              <p className="text-gray-600 mb-6">
                Figure out exactly what engages your audience with trend tracking and discovery 
                streams. View hot topics by industry and then have AI instantly draft posts based 
                on those trends. You can also search by topic, company, and hashtag to discover 
                what's getting the most action in your niche.
              </p>
              <Button variant="outline" className="border-blue-900 text-blue-900 hover:bg-blue-50">
                Learn more
              </Button>
            </div>
            <div className="bg-white rounded-lg p-8 shadow-sm">
              <div className="mb-6">
                <h4 className="font-semibold text-gray-900 mb-4">Top Themes</h4>
                <div className="relative">
                  <div className="flex flex-wrap gap-3">
                    <div className="bg-blue-100 rounded-full px-4 py-2 text-sm font-medium text-blue-800">#crypto</div>
                    <div className="bg-purple-100 rounded-full px-4 py-2 text-sm font-medium text-purple-800">#Bitcoin</div>
                    <div className="bg-green-100 rounded-full px-4 py-2 text-sm font-medium text-green-800">#fintech</div>
                    <div className="bg-red-100 rounded-full px-4 py-2 text-sm font-medium text-red-800">#banking</div>
                    <div className="bg-yellow-100 rounded-full px-4 py-2 text-sm font-medium text-yellow-800 text-xl">#banking</div>
                  </div>
                </div>
              </div>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span className="text-sm text-gray-700">TikTok</span>
                  </div>
                  <span className="text-sm font-semibold text-gray-900">450%</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    <span className="text-sm text-gray-700">Facebook</span>
                  </div>
                  <span className="text-sm font-semibold text-gray-900">322%</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                    <span className="text-sm text-gray-700">YouTube</span>
                  </div>
                  <span className="text-sm font-semibold text-gray-900">329%</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-pink-500 rounded-full"></div>
                    <span className="text-sm text-gray-700">Instagram</span>
                  </div>
                  <span className="text-sm font-semibold text-gray-900">180%</span>
                </div>
              </div>
              <div className="mt-6">
                <div className="flex items-center space-x-2">
                  <Search className="w-4 h-4 text-gray-400" />
                  <span className="text-sm text-gray-500">Search for a brand, topic or person</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

// Why Choose Us Section
function WhyChooseSection() {
  const reasons = [
    {
      icon: <Clock className="w-12 h-12 text-blue-600" />,
      title: "17 years and 25 million users",
      description: "VeeFore was the first, and we're still the most popular 17 years later. Over 25 million users have used VeeFore to post, track, and find out-performing competitors on social media."
    },
    {
      icon: <BrainCircuit className="w-12 h-12 text-purple-600" />,
      title: "The ultimate social media AI",
      description: "VeeFore helps you automate every part of social media management — posting, writing, messaging, and social listening. Our AI was designed for social pros."
    },
    {
      icon: <Puzzle className="w-12 h-12 text-green-600" />,
      title: "The largest library of integrations",
      description: "Connect over 100 integrations to bring all your favorite tools into the VeeFore dashboard. That's more than any other social media management platform (by far)."
    }
  ];

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">Why VeeFore?</h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Don't worry, we won't make you read our 2,000+ five-star reviews. A few highlights: 
            superior customer service, top-notch security features, and the best blog, webinars, 
            and social media academy in the industry.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {reasons.map((reason, index) => (
            <div key={index} className="text-center">
              <div className="flex justify-center mb-6">
                {reason.icon}
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">{reason.title}</h3>
              <p className="text-gray-600 mb-6">{reason.description}</p>
              <Button variant="outline" className="border-blue-900 text-blue-900 hover:bg-blue-50">
                {index === 0 ? 'More about us' : index === 1 ? 'Learn more' : 'Explore integrations'}
              </Button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// Resources Section
function ResourcesSection() {
  const resources = [
    {
      icon: <Award className="w-12 h-12 text-red-500" />,
      title: "How a retail brand used VeeFore to increase sales by 750%",
      description: "See how legendary candy-maker Stuckey's leveraged VeeFore to skyrocket their online sales and following."
    },
    {
      icon: <BarChart3 className="w-12 h-12 text-blue-500" />,
      title: "Social media competitor analysis: Free template for 2025",
      description: "Find out how to beat the competition with the ultimate guide to competitive analysis and a free template to get started."
    },
    {
      icon: <Briefcase className="w-12 h-12 text-green-500" />,
      title: "Take the VeeFore Social Media Marketing Certification Course",
      description: "Become a social media expert — and slap a shiny new certification on your résumé — with the industry standard in social media education."
    }
  ];

  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">Resources for social media pros</h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {resources.map((resource, index) => (
            <div key={index} className="bg-white rounded-lg p-8 shadow-sm">
              <div className="mb-6">
                {resource.icon}
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">{resource.title}</h3>
              <p className="text-gray-600 mb-6">{resource.description}</p>
              <Button variant="link" className="text-blue-600 hover:text-blue-800 p-0">
                {index === 0 ? 'Read now' : index === 1 ? 'Read now' : 'Sign up now'} →
              </Button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// Footer
function ProfessionalFooter() {
  return (
    <footer className="bg-gray-900 text-white py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center space-x-2 mb-6">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">V</span>
              </div>
              <span className="text-xl font-bold">VeeFore</span>
            </div>
            <p className="text-gray-400 mb-6">
              The ultimate social media management platform for professionals and businesses.
            </p>
            <div className="flex space-x-4">
              <Facebook className="w-5 h-5 text-gray-400 hover:text-white cursor-pointer" />
              <Twitter className="w-5 h-5 text-gray-400 hover:text-white cursor-pointer" />
              <Instagram className="w-5 h-5 text-gray-400 hover:text-white cursor-pointer" />
              <Linkedin className="w-5 h-5 text-gray-400 hover:text-white cursor-pointer" />
            </div>
          </div>
          
          <div>
            <h4 className="font-semibold mb-4">Product</h4>
            <ul className="space-y-2 text-gray-400">
              <li><a href="#" className="hover:text-white">Features</a></li>
              <li><a href="#" className="hover:text-white">Integrations</a></li>
              <li><a href="#" className="hover:text-white">Pricing</a></li>
              <li><a href="#" className="hover:text-white">Enterprise</a></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-semibold mb-4">Resources</h4>
            <ul className="space-y-2 text-gray-400">
              <li><a href="#" className="hover:text-white">Blog</a></li>
              <li><a href="#" className="hover:text-white">Help Center</a></li>
              <li><a href="#" className="hover:text-white">Academy</a></li>
              <li><a href="#" className="hover:text-white">Webinars</a></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-semibold mb-4">Company</h4>
            <ul className="space-y-2 text-gray-400">
              <li><a href="#" className="hover:text-white">About</a></li>
              <li><a href="#" className="hover:text-white">Careers</a></li>
              <li><a href="#" className="hover:text-white">Privacy Policy</a></li>
              <li><a href="#" className="hover:text-white">Terms of Service</a></li>
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

// Main Landing Component
export default function HootsuiteLanding() {
  return (
    <div className="min-h-screen bg-white">
      <ProfessionalNavigation />
      <HeroSection />
      <AwardsSection />
      <DashboardPreview />
      <TrustedBySection />
      <FeaturesSection />
      <StatisticsSection />
      <AIAssistantSection />
      <FeatureDetailSections />
      <WhyChooseSection />
      <ResourcesSection />
      <ProfessionalFooter />
    </div>
  );
}