import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useLocation } from 'wouter';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';

import { 
  PlusCircle, 
  TrendingUp, 
  Target, 
  Zap, 
  Users, 
  Calendar, 
  FileText, 
  BarChart3,
  Lightbulb,
  Search,
  Hash,
  CheckCircle,
  Star,
  Globe,
  Eye,
  ArrowRight,
  Rocket,
  Heart,
  MessageCircle,
  PlayCircle,
  Settings
} from 'lucide-react';

interface DashboardData {
  totalPosts: number;
  totalReach: number;
  totalFollowers: number;
  engagementRate: number;
  topPlatform: string;
  platforms: string[];
}

interface SocialAccount {
  id: string;
  platform: string;
  username: string;
  followers: number;
  isConnected: boolean;
  avatar?: string;
}

const ProfessionalDashboard: React.FC = () => {
  const [selectedTab, setSelectedTab] = useState('overview');
  const [currentTime, setCurrentTime] = useState(new Date());
  const [, setLocation] = useLocation();

  // Update time every second for live clock
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // Dynamic greeting based on time of day
  const getTimeBasedGreeting = () => {
    const hour = currentTime.getHours();
    
    if (hour >= 5 && hour < 12) {
      return { greeting: "Good morning", emoji: "☀️" };
    } else if (hour >= 12 && hour < 17) {
      return { greeting: "Good afternoon", emoji: "🌤️" };
    } else if (hour >= 17 && hour < 21) {
      return { greeting: "Good evening", emoji: "🌅" };
    } else {
      return { greeting: "Own the night", emoji: "🌙" };
    }
  };

  const { greeting, emoji } = getTimeBasedGreeting();

  // Format current date and time
  const formatDateTime = () => {
    const options: Intl.DateTimeFormatOptions = {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    };
    const date = currentTime.toLocaleDateString('en-US', options);
    const time = currentTime.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
    return { date, time };
  };

  const { date, time } = formatDateTime();

  // Fetch dashboard data
  const { data: dashboardData, isLoading: dashboardLoading } = useQuery<DashboardData>({
    queryKey: ['/api/dashboard/analytics'],
    enabled: true,
  });

  // Fetch social accounts
  const { data: socialAccounts = [], isLoading: accountsLoading } = useQuery<SocialAccount[]>({
    queryKey: ['/api/social-accounts'],
    enabled: true,
  });

  // Fetch user subscription data
  const { data: userData, isLoading: userLoading } = useQuery({
    queryKey: ['/api/user'],
    enabled: true,
  });

  // Calculate subscription status
  const getSubscriptionStatus = () => {
    if (!userData) return { status: 'Loading...', type: 'loading', color: 'gray' };
    
    const plan = userData.plan || 'free';
    const trialExpiresAt = userData.trialExpiresAt;
    const planStatus = userData.planStatus || 'active';
    

    
    // Check if user has an active trial
    if (trialExpiresAt) {
      const trialDate = new Date(trialExpiresAt);
      const today = new Date();
      const daysLeft = Math.ceil((trialDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
      
      if (daysLeft > 0) {
        return { 
          status: `Free Trial - ${daysLeft} day${daysLeft === 1 ? '' : 's'} left`, 
          type: 'trial', 
          color: daysLeft <= 3 ? 'red' : 'blue',
          expiryDate: trialDate.toLocaleDateString()
        };
      } else {
        return { status: 'Trial Expired', type: 'expired', color: 'red' };
      }
    }
    
    // Check for paid plans
    if (plan && plan.toLowerCase() !== 'free') {
      const planNames = {
        starter: 'Starter Plan',
        pro: 'Pro Plan', 
        business: 'Business Plan',
        agency: 'Agency Plan'
      };
      
      const planName = planNames[plan.toLowerCase()] || 'Premium Plan';
      
      // Check plan status for paid plans
      if (planStatus === 'expired' || planStatus === 'canceled') {
        return { 
          status: `${planName} - Expired`, 
          type: 'expired', 
          color: 'red',
          plan: plan
        };
      }
      
      return { 
        status: planName, 
        type: 'paid', 
        color: 'green',
        plan: plan
      };
    }
    
    // Default free plan
    return { status: 'Free Plan', type: 'free', color: 'gray' };
  };

  const subscriptionStatus = getSubscriptionStatus();

  // Calculate performance score (0-1000)
  const calculatePerformanceScore = () => {
    if (!dashboardData) return 0;
    const baseScore = Math.min(dashboardData.totalReach / 10, 500);
    const engagementBonus = Math.min(dashboardData.engagementRate * 5, 300);
    const postBonus = Math.min(dashboardData.totalPosts * 5, 200);
    return Math.round(baseScore + engagementBonus + postBonus);
  };

  const performanceScore = calculatePerformanceScore();



  // Quick action cards data
  const quickActions = [
    {
      title: 'Create with AI',
      description: 'Generate content instantly with AI',
      icon: <Zap className="w-8 h-8 text-purple-600" />,
      action: () => setLocation('/create-post'),
    },
    {
      title: 'Schedule Posts',
      description: 'Plan your content calendar',
      icon: <Calendar className="w-8 h-8 text-blue-600" />,
      action: () => setLocation('/scheduler'),
    },
    {
      title: 'Analyze Trends',
      description: 'Discover what is trending now',
      icon: <TrendingUp className="w-8 h-8 text-green-600" />,
      action: () => {},
    },
    {
      title: 'Multi-Platform',
      description: 'Post to all social networks',
      icon: <Globe className="w-8 h-8 text-orange-600" />,
      action: () => {},
    },
  ];

  // Recommendations data
  const recommendations = [
    {
      title: 'Get your post length right',
      description: 'While short captions and videos tend to do better, don\'t be afraid to be a little more generous with your story and engage your audience.',
      icon: <Target className="w-5 h-5 text-blue-500" />,
      priority: 'high',
    },
    {
      title: 'Optimize for discoverability',
      description: 'Want your content to show up at the top of people\'s search results on social? Check out these tips to master social SEO.',
      icon: <Search className="w-5 h-5 text-green-500" />,
      priority: 'medium',
    },
    {
      title: 'Make the most of hashtags',
      description: 'When used strategically, hashtags are still effective at getting your content in front of more people.',
      icon: <Hash className="w-5 h-5 text-purple-500" />,
      priority: 'medium',
    },
  ];

  // Trending topics data
  const trendingTopics = [
    {
      topic: 'Taxing the Rich, Helping the Poor',
      description: 'The documents express strong opinions on wealth inequality and tax policy. There is widespread support for taxing high...',
      category: 'Politics',
      color: 'text-blue-600',
    },
    {
      topic: 'XRP Price Surge Predictions',
      description: 'The online discourse surrounding XRP is overwhelmingly bullish, with many predicting significant price increases...',
      category: 'Finance',
      color: 'text-green-600',
    },
  ];

  if (dashboardLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-4 sm:space-y-6 lg:space-y-8 bg-gray-50 min-h-screen p-3 sm:p-4 lg:p-6">
      {/* Header Section - Responsive */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between bg-white p-4 sm:p-6 rounded-xl shadow-sm border space-y-4 sm:space-y-0">
        <div className="flex-1">
          <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900">
            {greeting}, Arpit! {emoji}
          </h1>
          <p className="text-gray-500 mt-2 flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2 text-sm sm:text-base">
            <span className="flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              Today is {date}
            </span>
            <span className="hidden sm:inline">•</span>
            <span>{time}</span>
            <span className="hidden sm:inline">•</span>
            <span className="text-xs sm:text-sm">Let's create something amazing</span>
          </p>
        </div>
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4">
          <div className={`flex items-center gap-2 px-3 sm:px-4 py-2 rounded-lg text-sm ${
            subscriptionStatus.color === 'blue' ? 'bg-blue-50' :
            subscriptionStatus.color === 'green' ? 'bg-green-50' :
            subscriptionStatus.color === 'red' ? 'bg-red-50' : 'bg-gray-50'
          }`}>
            <div className={`w-2 h-2 rounded-full animate-pulse ${
              subscriptionStatus.color === 'blue' ? 'bg-blue-500' :
              subscriptionStatus.color === 'green' ? 'bg-green-500' :
              subscriptionStatus.color === 'red' ? 'bg-red-500' : 'bg-gray-500'
            }`}></div>
            <span className={`font-medium ${
              subscriptionStatus.color === 'blue' ? 'text-blue-700' :
              subscriptionStatus.color === 'green' ? 'text-green-700' :
              subscriptionStatus.color === 'red' ? 'text-red-700' : 'text-gray-700'
            }`}>
              {subscriptionStatus.status}
            </span>
          </div>
          <Button className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-lg px-4 sm:px-6 w-full sm:w-auto">
            <PlusCircle className="w-4 h-4 mr-2" />
            <span className="text-sm sm:text-base">Create Content</span>
          </Button>
        </div>
      </div>

      {/* Quick Actions Grid - Responsive Hootsuite Style */}
      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {quickActions.map((action, index) => (
          <div 
            key={index} 
            className="group cursor-pointer text-center hover:opacity-80 transition-opacity p-4 sm:p-0"
            onClick={action.action}
          >
            <div className="w-10 h-10 sm:w-12 sm:h-12 mx-auto mb-2 sm:mb-3 flex items-center justify-center">
              {React.cloneElement(action.icon, { 
                className: "w-6 h-6 sm:w-8 sm:h-8 " + action.icon.props.className.split(' ').slice(2).join(' ')
              })}
            </div>
            <h3 className="font-semibold text-gray-900 text-sm sm:text-base leading-tight">
              {action.title}
            </h3>
          </div>
        ))}
      </div>

      {/* Main Content Grid - Responsive */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4 sm:gap-6">
        {/* Left Column - Performance & Recommendations */}
        <div className="xl:col-span-2 space-y-4 sm:space-y-6">
          {/* Performance Score - Responsive */}
          <Card className="bg-gradient-to-br from-white to-blue-50 border-0 shadow-lg">
            <CardHeader className="pb-4 sm:pb-6">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-3 sm:space-y-0">
                <div>
                  <CardTitle className="text-lg sm:text-xl flex items-center gap-3 text-gray-900">
                    <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-r from-blue-500 to-indigo-500 flex items-center justify-center">
                      <BarChart3 className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                    </div>
                    Performance Dashboard
                  </CardTitle>
                  <p className="text-xs sm:text-sm text-gray-500 mt-1 sm:mt-2 ml-11 sm:ml-13">
                    Your content insights for this week
                  </p>
                </div>
                <Button variant="outline" size="sm" className="border-gray-300 text-gray-700 hover:bg-gray-50 w-full sm:w-auto">
                  View Analytics
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4 sm:space-y-6">
              <div className="flex flex-col lg:flex-row items-center gap-6 sm:gap-8">
                <div className="relative mx-auto lg:mx-0">
                  <div className="w-28 h-28 sm:w-32 sm:h-32 lg:w-36 lg:h-36 rounded-full bg-gradient-to-r from-blue-500 to-indigo-500 flex items-center justify-center shadow-xl">
                    <div className="text-center">
                      <div className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white">{performanceScore}</div>
                      <div className="text-xs sm:text-sm text-blue-100">Score</div>
                    </div>
                  </div>
                  <div className="absolute -top-1 -right-1 sm:-top-2 sm:-right-2 w-6 h-6 sm:w-8 sm:h-8 bg-green-500 rounded-full flex items-center justify-center">
                    <TrendingUp className="w-3 h-3 sm:w-4 sm:h-4 text-white" />
                  </div>
                </div>
                <div className="flex-1 space-y-3 sm:space-y-4 w-full">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                    <div className="bg-white p-3 sm:p-4 rounded-xl shadow-sm">
                      <div className="flex items-center gap-2 mb-1 sm:mb-2">
                        <Eye className="w-3 h-3 sm:w-4 sm:h-4 text-blue-500" />
                        <span className="text-xs sm:text-sm font-medium text-gray-600">Total Reach</span>
                      </div>
                      <div className="text-xl sm:text-2xl font-bold text-gray-900">{dashboardData?.totalReach || 170}</div>
                    </div>
                    <div className="bg-white p-3 sm:p-4 rounded-xl shadow-sm">
                      <div className="flex items-center gap-2 mb-1 sm:mb-2">
                        <Users className="w-3 h-3 sm:w-4 sm:h-4 text-green-500" />
                        <span className="text-xs sm:text-sm font-medium text-gray-600">Followers</span>
                      </div>
                      <div className="text-xl sm:text-2xl font-bold text-gray-900">{dashboardData?.totalFollowers || 13}</div>
                    </div>
                  </div>
                  <div className="bg-white p-3 sm:p-4 rounded-xl shadow-sm">
                    <div className="flex items-center justify-between mb-1 sm:mb-2">
                      <span className="text-xs sm:text-sm font-medium text-gray-600">Engagement Rate</span>
                      <span className="text-base sm:text-lg font-bold text-green-600">{dashboardData?.engagementRate || 8.5}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-gradient-to-r from-green-400 to-green-600 h-2 rounded-full" style={{width: `${dashboardData?.engagementRate || 8.5}%`}}></div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* AI Recommendations - Responsive */}
          <Card className="bg-white border-0 shadow-lg">
            <CardHeader className="pb-4 sm:pb-6">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-3 sm:space-y-0">
                <CardTitle className="text-lg sm:text-xl flex items-center gap-3 text-gray-900">
                  <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center">
                    <Lightbulb className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                  </div>
                  AI Growth Insights
                </CardTitle>
                <Badge className="bg-purple-100 text-purple-700 hover:bg-purple-200 w-fit">
                  3 insights
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-3 sm:space-y-4">
              {recommendations.map((rec, index) => (
                <div key={index} className="group p-4 sm:p-6 rounded-2xl bg-gradient-to-r from-gray-50 to-blue-50 hover:from-blue-50 hover:to-indigo-50 transition-all duration-300 border border-gray-100 hover:border-blue-200">
                  <div className="flex items-start gap-3 sm:gap-4">
                    <div className="p-2 sm:p-3 rounded-xl bg-white shadow-sm group-hover:scale-110 transition-transform flex-shrink-0">
                      {rec.icon}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3 mb-2 sm:mb-3">
                        <h4 className="font-bold text-gray-900 text-sm sm:text-base">{rec.title}</h4>
                        <Badge variant={rec.priority === 'high' ? 'destructive' : 'outline'} className="text-xs border-gray-300 w-fit">
                          {rec.priority} priority
                        </Badge>
                      </div>
                      <p className="text-xs sm:text-sm text-gray-600 leading-relaxed mb-3 sm:mb-4">{rec.description}</p>
                      <Button variant="ghost" className="p-0 h-auto text-blue-600 hover:text-blue-700 font-medium text-xs sm:text-sm">
                        Apply this insight →
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Listening Section */}
          <Card className="bg-white border border-gray-200 shadow-sm">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <Search className="w-5 h-5 text-blue-500" />
                  Listening
                </CardTitle>
                <Button variant="ghost" size="sm" className="text-blue-600 hover:text-blue-700">
                  See more insights
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Trending topics</h4>
                  <p className="text-sm text-gray-600 mb-4">Past 24 hours, worldwide</p>
                  
                  <div className="mb-4">
                    <label className="text-sm font-medium text-gray-700">Interest</label>
                    <select className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500">
                      <option>Business and Finance</option>
                      <option>Technology</option>
                      <option>Marketing</option>
                    </select>
                  </div>
                </div>
                
                {trendingTopics.map((topic, index) => (
                  <div key={index} className="border-b border-gray-200 pb-4 last:border-b-0">
                    <h5 className="font-medium text-gray-900 mb-2">{topic.topic}</h5>
                    <p className="text-sm text-gray-600 mb-3 leading-relaxed">{topic.description}</p>
                    <Button variant="outline" size="sm" className="text-xs border-gray-300 text-gray-700 hover:bg-gray-50 bg-white">
                      <FileText className="w-3 h-3 mr-1" />
                      Create draft post
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Scheduled Posts */}
          <Card className="bg-white border border-gray-200 shadow-sm">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-gray-900">Scheduled posts</CardTitle>
                  <p className="text-sm text-gray-600">Created in VeeFore</p>
                </div>
                <Button variant="ghost" size="sm" className="text-blue-600 hover:text-blue-700">
                  View all scheduled
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                <p className="text-gray-600 mb-4">No scheduled posts</p>
                <Button variant="outline" className="mb-4 border-gray-300 text-gray-700 hover:bg-gray-50 bg-white">
                  Create a post
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Drafts */}
          <Card className="bg-white border border-gray-200 shadow-sm">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-gray-900">Drafts</CardTitle>
                  <p className="text-sm text-gray-600">Created in VeeFore</p>
                </div>
                <Button variant="ghost" size="sm" className="text-blue-600 hover:text-blue-700">
                  View all drafts
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <FileText className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                <p className="text-gray-600 mb-4">Start drafting content to edit and publish whenever you'd like.</p>
                <div className="space-x-2">
                  <Button variant="outline" className="border-gray-300 text-gray-700 hover:bg-gray-50 bg-white">Create a draft</Button>
                  <Button className="bg-blue-600 text-white hover:bg-blue-700">
                    Draft post with AI
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column - Tasks & Social Accounts - Responsive */}
        <div className="space-y-4 sm:space-y-6">
          {/* Get Started Card - Responsive */}
          <Card className="bg-gradient-to-br from-slate-50 to-gray-100 border border-gray-200 shadow-lg">
            <CardHeader className="pb-3 sm:pb-4">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-2 sm:space-y-0">
                <CardTitle className="flex items-center gap-3 text-gray-900 text-base sm:text-lg">
                  <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-blue-100 flex items-center justify-center">
                    <Star className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600" />
                  </div>
                  Quick Setup Tasks
                </CardTitle>
                <div className="text-xs sm:text-sm bg-blue-100 text-blue-700 px-2 sm:px-3 py-1 rounded-full font-medium w-fit">
                  1/3 Complete
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center gap-3 sm:gap-4 p-3 sm:p-4 rounded-xl bg-white border border-gray-200 shadow-sm">
                <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
                  <CheckCircle className="w-5 h-5 sm:w-6 sm:h-6 text-green-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-gray-900 text-sm sm:text-base">Connect Instagram ✓</p>
                  <p className="text-xs sm:text-sm text-gray-600">Account successfully linked</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3 sm:gap-4 p-3 sm:p-4 rounded-xl bg-white border border-gray-200 shadow-sm hover:shadow-md transition-shadow cursor-pointer">
                <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-gray-100 flex items-center justify-center border-2 border-gray-300 flex-shrink-0">
                  <span className="text-gray-700 font-bold text-sm sm:text-base">2</span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-gray-900 text-sm sm:text-base">Create your first post</p>
                  <p className="text-xs sm:text-sm text-gray-600">Start with AI-powered content</p>
                </div>
                <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400 flex-shrink-0" />
              </div>
              
              <div className="flex items-center gap-3 sm:gap-4 p-3 sm:p-4 rounded-xl bg-white border border-gray-200 shadow-sm">
                <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-gray-100 flex items-center justify-center border-2 border-gray-300 flex-shrink-0">
                  <span className="text-gray-700 font-bold text-sm sm:text-base">3</span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-gray-900 text-sm sm:text-base">Schedule content</p>
                  <p className="text-xs sm:text-sm text-gray-600">Plan your posting strategy</p>
                </div>
              </div>
              
              <div className="mt-4 sm:mt-6 p-3 sm:p-4 bg-blue-50 rounded-xl border border-blue-200">
                <div className="flex items-center gap-2 sm:gap-3 mb-2">
                  <Rocket className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600" />
                  <span className="font-bold text-blue-900 text-sm sm:text-base">Almost there!</span>
                </div>
                <p className="text-xs sm:text-sm text-blue-700">Complete setup to unlock premium features</p>
              </div>
            </CardContent>
          </Card>

          {/* Analytics Preview - Responsive */}
          <Card className="bg-gradient-to-br from-white to-slate-50 border border-gray-200 shadow-lg">
            <CardHeader className="pb-3 sm:pb-4">
              <CardTitle className="text-base sm:text-xl flex items-center gap-3 text-gray-900">
                <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-r from-slate-100 to-gray-200 flex items-center justify-center">
                  <BarChart3 className="w-4 h-4 sm:w-5 sm:h-5 text-slate-600" />
                </div>
                Analytics Preview
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 sm:space-y-4">
              <div className="grid grid-cols-2 gap-3 sm:gap-4">
                <div className="bg-white p-3 sm:p-4 rounded-xl border border-gray-200 shadow-sm">
                  <div className="flex items-center gap-2 mb-1 sm:mb-2">
                    <Eye className="w-3 h-3 sm:w-4 sm:h-4 text-blue-500" />
                    <span className="text-xs sm:text-sm font-medium text-gray-600">Views</span>
                  </div>
                  <div className="text-lg sm:text-2xl font-bold text-gray-900">2.4K</div>
                  <div className="text-xs text-green-600 font-medium">+12% this week</div>
                </div>
                <div className="bg-white p-3 sm:p-4 rounded-xl border border-gray-200 shadow-sm">
                  <div className="flex items-center gap-2 mb-1 sm:mb-2">
                    <Heart className="w-3 h-3 sm:w-4 sm:h-4 text-pink-500" />
                    <span className="text-xs sm:text-sm font-medium text-gray-600">Likes</span>
                  </div>
                  <div className="text-lg sm:text-2xl font-bold text-gray-900">186</div>
                  <div className="text-xs text-green-600 font-medium">+8% this week</div>
                </div>
              </div>
              <div className="bg-white p-3 sm:p-4 rounded-xl border border-gray-200 shadow-sm">
                <div className="flex items-center gap-2 mb-1 sm:mb-2">
                  <MessageCircle className="w-3 h-3 sm:w-4 sm:h-4 text-purple-500" />
                  <span className="text-xs sm:text-sm font-medium text-gray-600">Engagement Rate</span>
                </div>
                <div className="text-lg sm:text-2xl font-bold text-gray-900">8.5%</div>
                <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                  <div className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full" style={{width: '65%'}}></div>
                </div>
              </div>
              <Button variant="outline" className="w-full border-gray-300 text-gray-700 hover:bg-gray-50 bg-white text-sm">
                <PlayCircle className="w-4 h-4 mr-2" />
                View Full Analytics
              </Button>
            </CardContent>
          </Card>

          {/* Social Accounts - Responsive */}
          <Card className="bg-white border-0 shadow-lg">
            <CardHeader className="pb-4 sm:pb-6">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-2 sm:space-y-0">
                <CardTitle className="text-base sm:text-xl flex items-center gap-3 text-gray-900">
                  <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-500 flex items-center justify-center">
                    <Globe className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                  </div>
                  Connected Accounts
                </CardTitle>
                <Badge className="bg-indigo-100 text-indigo-700 w-fit">
                  {socialAccounts.length} connected
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-3 sm:space-y-4">
              {accountsLoading ? (
                <div className="animate-pulse space-y-3 sm:space-y-4">
                  <div className="h-14 sm:h-16 bg-gray-200 rounded-xl"></div>
                  <div className="h-14 sm:h-16 bg-gray-200 rounded-xl"></div>
                </div>
              ) : socialAccounts.length > 0 ? (
                <>
                  {socialAccounts.map((account) => (
                    <div key={account.id} className="group p-3 sm:p-4 rounded-2xl bg-gradient-to-r from-gray-50 to-indigo-50 hover:from-indigo-50 hover:to-purple-50 transition-all duration-300 border border-gray-100 hover:border-indigo-200">
                      <div className="flex items-center gap-3 sm:gap-4">
                        <div className="relative flex-shrink-0">
                          <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-gradient-to-br from-pink-500 to-purple-600 flex items-center justify-center shadow-lg">
                            <span className="text-white text-base sm:text-lg font-bold">
                              {account.platform.charAt(0).toUpperCase()}
                            </span>
                          </div>
                          <div className="absolute -top-1 -right-1 w-3 h-3 sm:w-4 sm:h-4 bg-green-500 rounded-full border-2 border-white"></div>
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-bold text-gray-900 text-sm sm:text-base">@{account.username}</p>
                          <p className="text-xs sm:text-sm text-gray-600 flex items-center gap-1">
                            <Users className="w-3 h-3" />
                            {account.followers} followers
                          </p>
                        </div>
                        <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                          <Button variant="ghost" size="sm" className="text-indigo-600 hover:text-indigo-700">
                            <Settings className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                  <Button variant="outline" className="w-full border-gray-300 text-gray-600 hover:bg-gray-50 h-10 sm:h-12 bg-white text-sm">
                    <PlusCircle className="w-4 h-4 mr-2" />
                    Connect Another Account
                  </Button>
                </>
              ) : (
                <div className="text-center py-8 sm:py-12">
                  <div className="w-16 h-16 sm:w-20 sm:h-20 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-indigo-100 to-purple-100 flex items-center justify-center">
                    <Globe className="w-8 h-8 sm:w-10 sm:h-10 text-indigo-600" />
                  </div>
                  <h3 className="font-bold text-gray-900 mb-2 text-sm sm:text-base">Connect Your First Account</h3>
                  <p className="text-gray-600 mb-4 sm:mb-6 text-xs sm:text-sm">Start by connecting your social media accounts to manage all your content in one place.</p>
                  <Button className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-sm">
                    <PlusCircle className="w-4 h-4 mr-2" />
                    Connect Account
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Kickstart Card - Responsive */}
          <Card className="bg-gradient-to-br from-slate-100 to-blue-50">
            <CardContent className="p-4 sm:p-6">
              <div className="text-center">
                <div className="w-12 h-12 sm:w-16 sm:h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4">
                  <Rocket className="w-6 h-6 sm:w-8 sm:h-8 text-orange-600" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2 text-sm sm:text-base">Kickstart your social content</h3>
                <p className="text-xs sm:text-sm text-gray-600 mb-3 sm:mb-4">
                  Get 30 days of social media posts in minutes
                </p>
                <Button className="bg-slate-800 hover:bg-slate-900 text-white text-sm">
                  Create posts
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ProfessionalDashboard;