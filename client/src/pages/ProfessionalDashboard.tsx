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
      title: 'Create from scratch',
      description: 'Start with a blank canvas',
      icon: <FileText className="w-12 h-12 text-cyan-600" />,
      color: 'bg-cyan-50 border-cyan-200',
      action: () => {},
    },
    {
      title: 'Post across networks',
      description: 'Share to multiple platforms',
      icon: <Globe className="w-12 h-12 text-blue-600" />,
      color: 'bg-blue-50 border-blue-200',
      action: () => {},
    },
    {
      title: 'Post about a trend',
      description: 'Join trending conversations',
      icon: <TrendingUp className="w-12 h-12 text-green-600" />,
      color: 'bg-green-50 border-green-200',
      action: () => {},
    },
    {
      title: 'Start with AI',
      description: 'Generate content instantly',
      icon: <Zap className="w-12 h-12 text-orange-600" />,
      color: 'bg-orange-50 border-orange-200',
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
    <div className="space-y-6">
      {/* Header Section */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Welcome, Arpit!
          </h1>
          <p className="text-gray-600 mt-1">
            For June 30-July 6, 2025
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Badge variant="secondary" className="px-3 py-1">
            <Clock className="w-4 h-4 mr-1" />
            Trial ends in 29 days
          </Badge>
          <Button className="bg-slate-800 hover:bg-slate-900 text-white">
            <PlusCircle className="w-4 h-4 mr-2" />
            Create a post
          </Button>
        </div>
      </div>

      {/* Quick Actions Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {quickActions.map((action, index) => (
          <Card 
            key={index} 
            className={`cursor-pointer transition-all duration-200 hover:shadow-lg ${action.color}`}
            onClick={action.action}
          >
            <CardContent className="p-6 text-center">
              <div className="flex justify-center mb-4">
                {action.icon}
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">
                {action.title}
              </h3>
              <p className="text-sm text-gray-600">
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
          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <BarChart3 className="w-5 h-5 text-gray-600" />
                    Social performance score
                  </CardTitle>
                  <p className="text-sm text-gray-600 mt-1">
                    For June 30-July 6, 2025
                  </p>
                </div>
                <Button variant="ghost" size="sm" className="text-cyan-600 hover:text-cyan-700">
                  Check progress
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-8">
                <div className="relative">
                  <div className="w-32 h-32 rounded-full border-8 border-gray-200 flex items-center justify-center">
                    <div className="text-center">
                      <div className="text-4xl font-bold text-gray-900">{performanceScore}</div>
                      <div className="text-sm text-gray-500">/ 1,000</div>
                    </div>
                  </div>
                  <div className="absolute top-0 left-0 w-32 h-32 rounded-full border-8 border-transparent border-t-cyan-500" style={{
                    transform: `rotate(${(performanceScore / 1000) * 360}deg)`
                  }}></div>
                </div>
                <div className="flex-1">
                  <div className="mb-4">
                    <h4 className="font-medium text-gray-900 mb-2">Room to grow.</h4>
                    <p className="text-sm text-gray-600">
                      You haven't posted in a while. Remember, posting consistently is key to keeping your audience engaged and growing.
                    </p>
                  </div>
                  <div className="space-y-2">
                    <div className="text-sm text-gray-600">Your selected social network</div>
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
                        <span className="text-white text-xs font-bold">I</span>
                      </div>
                      <span className="text-sm font-medium text-gray-900">Instagram</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* AI Recommendations */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <Lightbulb className="w-5 h-5 text-yellow-500" />
                  Your recommendations
                </CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {recommendations.map((rec, index) => (
                <div key={index} className="flex items-start gap-3 p-4 rounded-lg border-l-4 border-l-blue-500 bg-blue-50">
                  <div className="p-2 rounded-full bg-white">
                    {rec.icon}
                  </div>
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-900 mb-2">{rec.title}</h4>
                    <p className="text-sm text-gray-600 leading-relaxed">{rec.description}</p>
                    <div className="mt-3">
                      <Button variant="link" className="p-0 h-auto text-cyan-600 hover:text-cyan-700">
                        Read more about optimal post length →
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
          <Card className="bg-gradient-to-br from-cyan-50 to-blue-50">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-green-500" />
                  Get started - earn a reward!
                </CardTitle>
                <Button variant="ghost" size="sm" className="text-gray-400">
                  ×
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-3 p-3 rounded-lg bg-white">
                <div className="w-8 h-8 rounded-full bg-green-500 flex items-center justify-center">
                  <CheckCircle className="w-5 h-5 text-white" />
                </div>
                <div className="flex-1">
                  <p className="font-medium text-gray-900">Add another social account</p>
                  <p className="text-sm text-gray-600">Connect an additional social account.</p>
                </div>
                <span className="text-xs text-gray-500">1</span>
              </div>
              
              <div className="flex items-center gap-3 p-3 rounded-lg bg-white">
                <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-gray-600 font-bold">
                  2
                </div>
                <div className="flex-1">
                  <p className="font-medium text-gray-900">Schedule 3 posts</p>
                  <p className="text-sm text-cyan-600 underline">Create and schedule 3 posts.</p>
                </div>
                <span className="text-xs text-gray-500">2</span>
              </div>
              
              <div className="flex items-center gap-3 p-3 rounded-lg bg-white">
                <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-gray-600 font-bold">
                  3
                </div>
                <div className="flex-1">
                  <p className="font-medium text-gray-900">Report on your wins with Analytics</p>
                  <p className="text-sm text-gray-600">See how your posts are performing.</p>
                </div>
                <span className="text-xs text-gray-500">3</span>
              </div>
              
              <div className="mt-4 p-3 bg-green-100 rounded-lg">
                <div className="flex items-center gap-2">
                  <Star className="w-5 h-5 text-green-600" />
                  <span className="font-medium text-green-900">Unlock your reward!</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Most Engaging Post */}
          <Card>
            <CardHeader>
              <CardTitle>Most engaging post</CardTitle>
              <p className="text-sm text-gray-600">Last 7 days</p>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <BarChart3 className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                <p className="text-gray-600 mb-2">We're working to retrieve your posts and analytics. Check back in a few hours.</p>
                <Button variant="outline" className="mt-2">
                  Create a post
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Social Accounts */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <Globe className="w-5 h-5 text-blue-500" />
                  Social accounts
                </CardTitle>
                <Button variant="ghost" size="sm" className="text-cyan-600 hover:text-cyan-700">
                  See all accounts
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              {accountsLoading ? (
                <div className="animate-pulse space-y-3">
                  <div className="h-12 bg-gray-200 rounded"></div>
                  <div className="h-12 bg-gray-200 rounded"></div>
                </div>
              ) : socialAccounts.length > 0 ? (
                <>
                  {socialAccounts.map((account) => (
                    <div key={account.id} className="flex items-center gap-3 p-3 rounded-lg border">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
                        <span className="text-white text-sm font-bold">
                          {account.platform.charAt(0).toUpperCase()}
                        </span>
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-gray-900">@{account.username}</p>
                        <p className="text-sm text-gray-600">
                          {account.followers} followers
                        </p>
                      </div>
                      <div className="w-3 h-3 rounded-full bg-green-500"></div>
                    </div>
                  ))}
                  <Button variant="outline" className="w-full">
                    Connect more accounts
                  </Button>
                </>
              ) : (
                <div className="text-center py-8">
                  <Globe className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                  <p className="text-gray-600 mb-3">No accounts connected yet</p>
                  <Button size="sm" className="bg-cyan-600 hover:bg-cyan-700">
                    <PlusCircle className="w-4 h-4 mr-1" />
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