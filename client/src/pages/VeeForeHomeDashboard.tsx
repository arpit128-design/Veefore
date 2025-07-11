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

const VeeForeHomeDashboard: React.FC = () => {
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

  // Calculate performance score (0-100)
  const calculatePerformanceScore = () => {
    if (!dashboardData) return 0;
    const baseScore = Math.min(dashboardData.totalReach / 10, 50);
    const engagementBonus = Math.min(dashboardData.engagementRate * 2, 30);
    const postBonus = Math.min(dashboardData.totalPosts * 2, 20);
    return Math.round(baseScore + engagementBonus + postBonus);
  };

  const performanceScore = calculatePerformanceScore();

  // Quick action cards data
  const quickActions = [
    {
      title: 'Create from AI',
      description: 'Generate content with AI',
      icon: <Zap className="w-8 h-8 text-cyan-600" />,
      color: 'bg-cyan-50 border-cyan-200',
      action: () => {},
    },
    {
      title: 'Schedule Posts',
      description: 'Plan your content calendar',
      icon: <Calendar className="w-8 h-8 text-blue-600" />,
      color: 'bg-blue-50 border-blue-200',
      action: () => {},
    },
    {
      title: 'Analyze Trends',
      description: 'Discover trending topics',
      icon: <TrendingUp className="w-8 h-8 text-green-600" />,
      color: 'bg-green-50 border-green-200',
      action: () => {},
    },
    {
      title: 'Optimize Content',
      description: 'Improve with AI insights',
      icon: <Target className="w-8 h-8 text-blue-600" />,
      color: 'bg-blue-50 border-blue-200',
      action: () => {},
    },
  ];

  // Recommendations data
  const recommendations = [
    {
      title: 'Boost your content reach',
      description: 'Post during peak hours (7-9 PM) when your audience is most active',
      icon: <TrendingUp className="w-5 h-5 text-green-500" />,
      priority: 'high',
    },
    {
      title: 'Optimize for engagement',
      description: 'Add 3-5 relevant hashtags to increase discoverability by 40%',
      icon: <Hash className="w-5 h-5 text-blue-500" />,
      priority: 'medium',
    },
    {
      title: 'Create video content',
      description: 'Video posts get 65% more engagement than static images',
      icon: <PlayCircle className="w-5 h-5 text-purple-500" />,
      priority: 'medium',
    },
  ];

  // Trending topics data
  const trendingTopics = [
    {
      topic: 'AI Content Creation',
      trend: '+156% engagement',
      category: 'Technology',
      color: 'text-purple-600',
    },
    {
      topic: 'Social Media Strategy',
      trend: '+89% reach',
      category: 'Marketing',
      color: 'text-blue-600',
    },
    {
      topic: 'Content Automation',
      trend: '+67% efficiency',
      category: 'Productivity',
      color: 'text-green-600',
    },
  ];

  if (dashboardLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Welcome back, Arpit!
          </h1>
          <p className="text-gray-600 mt-1">
            Your social media dashboard is ready
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Badge variant="secondary" className="px-3 py-1">
            <Clock className="w-4 h-4 mr-1" />
            Trial: 28 days left
          </Badge>
          <Button className="bg-cyan-600 hover:bg-cyan-700 text-white">
            <PlusCircle className="w-4 h-4 mr-2" />
            Create Content
          </Button>
        </div>
      </div>

      {/* Quick Actions Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {quickActions.map((action, index) => (
          <Card 
            key={index} 
            className={`cursor-pointer transition-all duration-200 hover:shadow-lg hover:scale-105 ${action.color}`}
            onClick={action.action}
          >
            <CardContent className="p-6 text-center">
              <div className="flex justify-center mb-3">
                {action.icon}
              </div>
              <h3 className="font-semibold text-gray-900 mb-1">
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
          <Card className="bg-gradient-to-br from-cyan-50 to-blue-50">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-lg">Content Performance Score</CardTitle>
                  <p className="text-sm text-gray-600 mt-1">
                    Based on your last 30 days
                  </p>
                </div>
                <Button variant="ghost" size="sm">
                  <Eye className="w-4 h-4 mr-1" />
                  View Details
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-6">
                <div className="relative">
                  <div className="w-24 h-24 rounded-full bg-gradient-to-br from-cyan-500 to-blue-500 flex items-center justify-center">
                    <span className="text-2xl font-bold text-white">{performanceScore}</span>
                  </div>
                  <div className="absolute inset-0 rounded-full border-4 border-transparent bg-gradient-to-br from-cyan-500 to-blue-500 opacity-20"></div>
                </div>
                <div className="flex-1">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-600">Total Reach</p>
                      <p className="text-xl font-bold text-gray-900">
                        {dashboardData?.totalReach || 0}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Posts</p>
                      <p className="text-xl font-bold text-gray-900">
                        {dashboardData?.totalPosts || 0}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Followers</p>
                      <p className="text-xl font-bold text-gray-900">
                        {dashboardData?.totalFollowers || 0}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Engagement</p>
                      <p className="text-xl font-bold text-green-600">
                        {dashboardData?.engagementRate || 0}%
                      </p>
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
                  <Lightbulb className="w-5 h-5 text-emerald-500" />
                  AI Growth Recommendations
                </CardTitle>
                <Button variant="ghost" size="sm">
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {recommendations.map((rec, index) => (
                <div key={index} className="flex items-start gap-3 p-3 rounded-lg bg-gray-50">
                  <div className="p-2 rounded-full bg-white">
                    {rec.icon}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-medium text-gray-900">{rec.title}</h4>
                      <Badge 
                        variant={rec.priority === 'high' ? 'destructive' : 'secondary'}
                        className="text-xs"
                      >
                        {rec.priority}
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-600">{rec.description}</p>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Trending Topics */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-green-500" />
                  Trending in Your Niche
                </CardTitle>
                <Button variant="ghost" size="sm">
                  <Search className="w-4 h-4 mr-1" />
                  Explore More
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {trendingTopics.map((topic, index) => (
                  <div key={index} className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 cursor-pointer">
                    <div>
                      <h4 className="font-medium text-gray-900">{topic.topic}</h4>
                      <p className="text-sm text-gray-600">{topic.category}</p>
                    </div>
                    <div className="text-right">
                      <p className={`text-sm font-medium ${topic.color}`}>{topic.trend}</p>
                      <Button variant="ghost" size="sm" className="h-6 px-2 text-xs">
                        Create Post
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column - Tasks & Social Accounts */}
        <div className="space-y-6">
          {/* Quick Tasks */}
          <Card className="bg-gradient-to-br from-green-50 to-cyan-50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-green-500" />
                Quick Wins
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center gap-3 p-3 rounded-lg bg-white">
                <div className="p-2 rounded-full bg-green-100">
                  <Users className="w-4 h-4 text-green-600" />
                </div>
                <div className="flex-1">
                  <p className="font-medium text-gray-900">Connect Instagram</p>
                  <p className="text-sm text-gray-600">Link your account to start posting</p>
                </div>
                <Badge variant="outline" className="text-xs">1 min</Badge>
              </div>
              
              <div className="flex items-center gap-3 p-3 rounded-lg bg-white">
                <div className="p-2 rounded-full bg-blue-100">
                  <Calendar className="w-4 h-4 text-blue-600" />
                </div>
                <div className="flex-1">
                  <p className="font-medium text-gray-900">Schedule 3 Posts</p>
                  <p className="text-sm text-gray-600">Plan your weekly content</p>
                </div>
                <Badge variant="outline" className="text-xs">5 min</Badge>
              </div>
              
              <div className="flex items-center gap-3 p-3 rounded-lg bg-white">
                <div className="p-2 rounded-full bg-cyan-100">
                  <Zap className="w-4 h-4 text-cyan-600" />
                </div>
                <div className="flex-1">
                  <p className="font-medium text-gray-900">Generate AI Content</p>
                  <p className="text-sm text-gray-600">Create engaging posts with AI</p>
                </div>
                <Badge variant="outline" className="text-xs">2 min</Badge>
              </div>
            </CardContent>
          </Card>

          {/* Social Accounts */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <Globe className="w-5 h-5 text-blue-500" />
                  Connected Accounts
                </CardTitle>
                <Button variant="ghost" size="sm">
                  <Settings className="w-4 h-4" />
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
                socialAccounts.map((account) => (
                  <div key={account.id} className="flex items-center gap-3 p-3 rounded-lg border">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-cyan-500 to-blue-500 flex items-center justify-center">
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
                ))
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

          {/* Quick Stats */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-purple-500" />
                Today's Activity
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Eye className="w-4 h-4 text-blue-500" />
                  <span className="text-sm text-gray-600">Views</span>
                </div>
                <span className="font-semibold text-gray-900">1,234</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Heart className="w-4 h-4 text-red-500" />
                  <span className="text-sm text-gray-600">Likes</span>
                </div>
                <span className="font-semibold text-gray-900">89</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <MessageCircle className="w-4 h-4 text-green-500" />
                  <span className="text-sm text-gray-600">Comments</span>
                </div>
                <span className="font-semibold text-gray-900">12</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4 text-cyan-500" />
                  <span className="text-sm text-gray-600">New Followers</span>
                </div>
                <span className="font-semibold text-green-600">+3</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default VeeForeHomeDashboard;