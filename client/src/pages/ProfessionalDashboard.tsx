import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
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
  Clock,
  CheckCircle,
  Star,
  Rocket,
  Globe,
  Eye,
  MessageCircle,
  Heart,
  ArrowRight,
  Settings,
  PlayCircle
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
      icon: <Zap className="w-8 h-8" />,
      action: () => {},
    },
    {
      title: 'Schedule Posts',
      description: 'Plan your content calendar',
      icon: <Calendar className="w-8 h-8" />,
      action: () => {},
    },
    {
      title: 'Analyze Trends',
      description: 'Discover what is trending now',
      icon: <TrendingUp className="w-8 h-8" />,
      action: () => {},
    },
    {
      title: 'Multi-Platform',
      description: 'Post to all social networks',
      icon: <Globe className="w-8 h-8" />,
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
    <div className="space-y-8 bg-gray-50 min-h-screen p-6">
      {/* Header Section */}
      <div className="flex items-center justify-between bg-white p-6 rounded-xl shadow-sm border">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Good morning, Arpit! ☀️
          </h1>
          <p className="text-gray-500 mt-2 flex items-center gap-2">
            <Calendar className="w-4 h-4" />
            Today is July 10, 2025 • Let's create something amazing
          </p>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 px-4 py-2 bg-blue-50 rounded-lg">
            <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
            <span className="text-sm font-medium text-blue-700">Free Trial Active</span>
          </div>
          <Button className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-lg px-6">
            <PlusCircle className="w-4 h-4 mr-2" />
            Create Content
          </Button>
        </div>
      </div>

      {/* Quick Actions Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {quickActions.map((action, index) => (
          <Card 
            key={index} 
            className="group cursor-pointer transition-all duration-300 hover:shadow-xl hover:-translate-y-1 bg-white border-0 shadow-sm"
            onClick={action.action}
          >
            <CardContent className="p-8 text-center">
              <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-blue-50 to-indigo-50 flex items-center justify-center group-hover:scale-110 transition-transform">
                {action.icon}
              </div>
              <h3 className="font-bold text-gray-900 mb-2 text-lg">
                {action.title}
              </h3>
              <p className="text-sm text-gray-500 leading-relaxed">
                {action.description}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Performance & Recommendations */}
        <div className="lg:col-span-2 space-y-6">
          {/* Performance Score */}
          <Card className="bg-gradient-to-br from-white to-blue-50 border-0 shadow-lg">
            <CardHeader className="pb-6">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-xl flex items-center gap-3 text-gray-900">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-r from-blue-500 to-indigo-500 flex items-center justify-center">
                      <BarChart3 className="w-5 h-5 text-white" />
                    </div>
                    Performance Dashboard
                  </CardTitle>
                  <p className="text-sm text-gray-500 mt-2 ml-13">
                    Your content insights for this week
                  </p>
                </div>
                <Button variant="outline" size="sm" className="border-blue-200 text-blue-600 hover:bg-blue-50">
                  View Analytics
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center gap-8">
                <div className="relative">
                  <div className="w-36 h-36 rounded-full bg-gradient-to-r from-blue-500 to-indigo-500 flex items-center justify-center shadow-xl">
                    <div className="text-center">
                      <div className="text-4xl font-bold text-white">{performanceScore}</div>
                      <div className="text-sm text-blue-100">Score</div>
                    </div>
                  </div>
                  <div className="absolute -top-2 -right-2 w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                    <TrendingUp className="w-4 h-4 text-white" />
                  </div>
                </div>
                <div className="flex-1 space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-white p-4 rounded-xl shadow-sm">
                      <div className="flex items-center gap-2 mb-2">
                        <Eye className="w-4 h-4 text-blue-500" />
                        <span className="text-sm font-medium text-gray-600">Total Reach</span>
                      </div>
                      <div className="text-2xl font-bold text-gray-900">{dashboardData?.totalReach || 170}</div>
                    </div>
                    <div className="bg-white p-4 rounded-xl shadow-sm">
                      <div className="flex items-center gap-2 mb-2">
                        <Users className="w-4 h-4 text-green-500" />
                        <span className="text-sm font-medium text-gray-600">Followers</span>
                      </div>
                      <div className="text-2xl font-bold text-gray-900">{dashboardData?.totalFollowers || 13}</div>
                    </div>
                  </div>
                  <div className="bg-white p-4 rounded-xl shadow-sm">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-gray-600">Engagement Rate</span>
                      <span className="text-lg font-bold text-green-600">{dashboardData?.engagementRate || 8.5}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-gradient-to-r from-green-400 to-green-600 h-2 rounded-full" style={{width: `${dashboardData?.engagementRate || 8.5}%`}}></div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* AI Recommendations */}
          <Card className="bg-white border-0 shadow-lg">
            <CardHeader className="pb-6">
              <div className="flex items-center justify-between">
                <CardTitle className="text-xl flex items-center gap-3 text-gray-900">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center">
                    <Lightbulb className="w-5 h-5 text-white" />
                  </div>
                  AI Growth Insights
                </CardTitle>
                <Badge className="bg-purple-100 text-purple-700 hover:bg-purple-200">
                  3 insights
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {recommendations.map((rec, index) => (
                <div key={index} className="group p-6 rounded-2xl bg-gradient-to-r from-gray-50 to-blue-50 hover:from-blue-50 hover:to-indigo-50 transition-all duration-300 border border-gray-100 hover:border-blue-200">
                  <div className="flex items-start gap-4">
                    <div className="p-3 rounded-xl bg-white shadow-sm group-hover:scale-110 transition-transform">
                      {rec.icon}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-3">
                        <h4 className="font-bold text-gray-900">{rec.title}</h4>
                        <Badge variant={rec.priority === 'high' ? 'destructive' : 'secondary'} className="text-xs">
                          {rec.priority} priority
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-600 leading-relaxed mb-4">{rec.description}</p>
                      <Button variant="ghost" className="p-0 h-auto text-blue-600 hover:text-blue-700 font-medium">
                        Apply this insight →
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Listening Section */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <Search className="w-5 h-5 text-blue-500" />
                  Listening
                </CardTitle>
                <Button variant="ghost" size="sm" className="text-cyan-600 hover:text-cyan-700">
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
                    <select className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-cyan-500 focus:border-cyan-500">
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
                    <Button variant="outline" size="sm" className="text-xs">
                      <FileText className="w-3 h-3 mr-1" />
                      Create draft post
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Scheduled Posts */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Scheduled posts</CardTitle>
                  <p className="text-sm text-gray-600">Created in VeeFore</p>
                </div>
                <Button variant="ghost" size="sm" className="text-cyan-600 hover:text-cyan-700">
                  View all scheduled
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                <p className="text-gray-600 mb-4">No scheduled posts</p>
                <Button variant="outline" className="mb-4">
                  Create a post
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Drafts */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Drafts</CardTitle>
                  <p className="text-sm text-gray-600">Created in VeeFore</p>
                </div>
                <Button variant="ghost" size="sm" className="text-cyan-600 hover:text-cyan-700">
                  View all drafts
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <FileText className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                <p className="text-gray-600 mb-4">Start drafting content to edit and publish whenever you'd like.</p>
                <div className="space-x-2">
                  <Button variant="outline">Create a draft</Button>
                  <Button variant="outline" className="bg-cyan-600 text-white hover:bg-cyan-700">
                    Draft post with AI
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column - Tasks & Social Accounts */}
        <div className="space-y-6">
          {/* Get Started Card */}
          <Card className="bg-gradient-to-br from-emerald-500 to-green-600 text-white border-0 shadow-xl">
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-3 text-white text-lg">
                  <div className="w-8 h-8 rounded-lg bg-white/20 flex items-center justify-center">
                    <Star className="w-5 h-5 text-white" />
                  </div>
                  Quick Setup Tasks
                </CardTitle>
                <div className="text-sm bg-white/20 px-3 py-1 rounded-full">
                  1/3 Complete
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center gap-4 p-4 rounded-xl bg-white/10 backdrop-blur-sm">
                <div className="w-10 h-10 rounded-full bg-green-400 flex items-center justify-center shadow-lg">
                  <CheckCircle className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-white">Connect Instagram ✓</p>
                  <p className="text-sm text-green-100">Account successfully linked</p>
                </div>
              </div>
              
              <div className="flex items-center gap-4 p-4 rounded-xl bg-white/10 backdrop-blur-sm hover:bg-white/20 transition-colors cursor-pointer">
                <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center border-2 border-white/40">
                  <span className="text-white font-bold">2</span>
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-white">Create your first post</p>
                  <p className="text-sm text-green-100">Start with AI-powered content</p>
                </div>
                <ArrowRight className="w-5 h-5 text-white/60" />
              </div>
              
              <div className="flex items-center gap-4 p-4 rounded-xl bg-white/10 backdrop-blur-sm">
                <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center border-2 border-white/40">
                  <span className="text-white font-bold">3</span>
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-white">Schedule content</p>
                  <p className="text-sm text-green-100">Plan your posting strategy</p>
                </div>
              </div>
              
              <div className="mt-6 p-4 bg-white/20 rounded-xl backdrop-blur-sm">
                <div className="flex items-center gap-3 mb-2">
                  <Rocket className="w-5 h-5 text-white" />
                  <span className="font-bold text-white">Almost there!</span>
                </div>
                <p className="text-sm text-green-100">Complete setup to unlock premium features</p>
              </div>
            </CardContent>
          </Card>

          {/* Analytics Preview */}
          <Card className="bg-gradient-to-br from-orange-500 to-red-500 text-white border-0 shadow-xl">
            <CardHeader className="pb-4">
              <CardTitle className="text-xl flex items-center gap-3 text-white">
                <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center">
                  <BarChart3 className="w-5 h-5 text-white" />
                </div>
                Analytics Preview
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-white/10 p-4 rounded-xl backdrop-blur-sm">
                  <div className="flex items-center gap-2 mb-2">
                    <Eye className="w-4 h-4 text-white" />
                    <span className="text-sm font-medium text-white">Views</span>
                  </div>
                  <div className="text-2xl font-bold text-white">2.4K</div>
                  <div className="text-xs text-orange-100">+12% this week</div>
                </div>
                <div className="bg-white/10 p-4 rounded-xl backdrop-blur-sm">
                  <div className="flex items-center gap-2 mb-2">
                    <Heart className="w-4 h-4 text-white" />
                    <span className="text-sm font-medium text-white">Likes</span>
                  </div>
                  <div className="text-2xl font-bold text-white">186</div>
                  <div className="text-xs text-orange-100">+8% this week</div>
                </div>
              </div>
              <div className="bg-white/10 p-4 rounded-xl backdrop-blur-sm">
                <div className="flex items-center gap-2 mb-2">
                  <MessageCircle className="w-4 h-4 text-white" />
                  <span className="text-sm font-medium text-white">Engagement Rate</span>
                </div>
                <div className="text-2xl font-bold text-white">8.5%</div>
                <div className="w-full bg-white/20 rounded-full h-2 mt-2">
                  <div className="bg-white h-2 rounded-full" style={{width: '65%'}}></div>
                </div>
              </div>
              <Button variant="ghost" className="w-full bg-white/20 text-white hover:bg-white/30 border-0">
                <PlayCircle className="w-4 h-4 mr-2" />
                View Full Analytics
              </Button>
            </CardContent>
          </Card>

          {/* Social Accounts */}
          <Card className="bg-white border-0 shadow-lg">
            <CardHeader className="pb-6">
              <div className="flex items-center justify-between">
                <CardTitle className="text-xl flex items-center gap-3 text-gray-900">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-500 flex items-center justify-center">
                    <Globe className="w-5 h-5 text-white" />
                  </div>
                  Connected Accounts
                </CardTitle>
                <Badge className="bg-indigo-100 text-indigo-700">
                  {socialAccounts.length} connected
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {accountsLoading ? (
                <div className="animate-pulse space-y-4">
                  <div className="h-16 bg-gray-200 rounded-xl"></div>
                  <div className="h-16 bg-gray-200 rounded-xl"></div>
                </div>
              ) : socialAccounts.length > 0 ? (
                <>
                  {socialAccounts.map((account) => (
                    <div key={account.id} className="group p-4 rounded-2xl bg-gradient-to-r from-gray-50 to-indigo-50 hover:from-indigo-50 hover:to-purple-50 transition-all duration-300 border border-gray-100 hover:border-indigo-200">
                      <div className="flex items-center gap-4">
                        <div className="relative">
                          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-pink-500 to-purple-600 flex items-center justify-center shadow-lg">
                            <span className="text-white text-lg font-bold">
                              {account.platform.charAt(0).toUpperCase()}
                            </span>
                          </div>
                          <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white"></div>
                        </div>
                        <div className="flex-1">
                          <p className="font-bold text-gray-900">@{account.username}</p>
                          <p className="text-sm text-gray-600 flex items-center gap-1">
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
                  <Button variant="outline" className="w-full border-indigo-200 text-indigo-600 hover:bg-indigo-50 h-12">
                    <PlusCircle className="w-4 h-4 mr-2" />
                    Connect Another Account
                  </Button>
                </>
              ) : (
                <div className="text-center py-12">
                  <div className="w-20 h-20 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-indigo-100 to-purple-100 flex items-center justify-center">
                    <Globe className="w-10 h-10 text-indigo-600" />
                  </div>
                  <h3 className="font-bold text-gray-900 mb-2">Connect Your First Account</h3>
                  <p className="text-gray-600 mb-6">Start by connecting your social media accounts to manage all your content in one place.</p>
                  <Button className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700">
                    <PlusCircle className="w-4 h-4 mr-2" />
                    Connect Account
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Kickstart Card */}
          <Card className="bg-gradient-to-br from-slate-100 to-blue-50">
            <CardContent className="p-6">
              <div className="text-center">
                <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Rocket className="w-8 h-8 text-orange-600" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">Kickstart your social content</h3>
                <p className="text-sm text-gray-600 mb-4">
                  Get 30 days of social media posts in minutes
                </p>
                <Button className="bg-slate-800 hover:bg-slate-900 text-white">
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