import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { 
  TrendingUp, 
  Users, 
  Eye, 
  MessageSquare, 
  Calendar, 
  Zap, 
  BarChart3, 
  Globe,
  Star,
  ArrowUp,
  ArrowDown,
  Clock,
  Target,
  PlayCircle,
  Heart,
  Share2,
  Plus,
  ChevronRight,
  Activity,
  Sparkles,
  Rocket,
  Trophy,
  DollarSign,
  TrendingDown
} from 'lucide-react';

interface DashboardMetrics {
  totalFollowers: number;
  totalReach: number;
  totalEngagement: number;
  totalPosts: number;
  engagementRate: number;
  growthRate: number;
  activeAccounts: number;
  scheduledPosts: number;
}

interface SocialAccount {
  id: string;
  platform: string;
  username: string;
  followers: number;
  engagement: number;
  posts: number;
  growth: number;
  isActive: boolean;
  profilePicture?: string;
}

interface RecentActivity {
  id: string;
  type: 'post' | 'comment' | 'like' | 'follow';
  platform: string;
  content: string;
  timestamp: Date;
  engagement: number;
}

const ModernPureDashboard: React.FC = () => {
  const [currentTime, setCurrentTime] = useState(new Date());
  
  // Update time every second
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const { data: metrics, isLoading: metricsLoading } = useQuery<DashboardMetrics>({
    queryKey: ['dashboard-metrics'],
    queryFn: () => fetch('/api/dashboard/metrics').then(res => res.json())
  });

  const { data: socialAccounts, isLoading: accountsLoading } = useQuery<SocialAccount[]>({
    queryKey: ['social-accounts'],
    queryFn: () => fetch('/api/social-accounts').then(res => res.json())
  });

  const { data: recentActivity, isLoading: activityLoading } = useQuery<RecentActivity[]>({
    queryKey: ['recent-activity'],
    queryFn: () => fetch('/api/dashboard/activity').then(res => res.json())
  });

  const getGreeting = () => {
    const hour = currentTime.getHours();
    if (hour < 12) return "Good morning";
    if (hour < 17) return "Good afternoon";
    if (hour < 21) return "Good evening";
    return "Working late";
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit', 
      second: '2-digit' 
    });
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const quickActions = [
    {
      title: "Create Content",
      description: "Generate AI-powered posts",
      icon: Sparkles,
      color: "from-purple-500 to-indigo-600",
      path: "/content-studio"
    },
    {
      title: "Schedule Posts",
      description: "Plan your content calendar",
      icon: Calendar,
      color: "from-blue-500 to-cyan-600",
      path: "/scheduler"
    },
    {
      title: "View Analytics",
      description: "Track your performance",
      icon: BarChart3,
      color: "from-emerald-500 to-teal-600",
      path: "/analytics"
    },
    {
      title: "Manage Automation",
      description: "Set up smart workflows",
      icon: Zap,
      color: "from-orange-500 to-red-600",
      path: "/automation"
    }
  ];

  const metricCards = [
    {
      title: "Total Followers",
      value: metrics?.totalFollowers || 0,
      change: metrics?.growthRate || 0,
      icon: Users,
      color: "text-blue-600",
      bgColor: "bg-blue-50"
    },
    {
      title: "Total Reach",
      value: metrics?.totalReach || 0,
      change: 15.2,
      icon: Eye,
      color: "text-emerald-600",
      bgColor: "bg-emerald-50"
    },
    {
      title: "Engagement Rate",
      value: `${metrics?.engagementRate || 0}%`,
      change: 8.4,
      icon: Heart,
      color: "text-pink-600",
      bgColor: "bg-pink-50"
    },
    {
      title: "Active Accounts",
      value: metrics?.activeAccounts || 0,
      change: 2.1,
      icon: Globe,
      color: "text-purple-600",
      bgColor: "bg-purple-50"
    }
  ];

  if (metricsLoading) {
    return (
      <div 
        className="min-h-screen p-8 flex items-center justify-center"
        style={{ backgroundColor: 'rgb(249, 250, 251)' }}
      >
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div 
      className="min-h-screen p-8"
      style={{ backgroundColor: 'rgb(249, 250, 251)' }}
    >
      {/* Header Section */}
      <div className="mb-12">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold text-gray-900 mb-2">
              {getGreeting()}, Welcome back! 👋
            </h1>
            <p className="text-xl text-gray-600">
              {formatDate(currentTime)}
            </p>
          </div>
          <div className="text-right">
            <div className="text-3xl font-mono font-bold text-gray-900 mb-1">
              {formatTime(currentTime)}
            </div>
            <div className="text-sm text-gray-500">
              Live Time
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="mb-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {quickActions.map((action, index) => (
            <div
              key={index}
              className="group relative overflow-hidden rounded-2xl bg-white p-6 shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 cursor-pointer"
              style={{ backgroundColor: 'rgb(255, 255, 255)' }}
            >
              <div className={`absolute inset-0 bg-gradient-to-r ${action.color} opacity-0 group-hover:opacity-5 transition-opacity duration-300`}></div>
              <div className="relative z-10">
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-r ${action.color} flex items-center justify-center mb-4`}>
                  <action.icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{action.title}</h3>
                <p className="text-gray-600 text-sm mb-4">{action.description}</p>
                <div className="flex items-center text-sm font-medium text-gray-400 group-hover:text-gray-600 transition-colors">
                  Get started
                  <ChevronRight className="w-4 h-4 ml-1" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="mb-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Performance Overview</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {metricCards.map((metric, index) => (
            <div
              key={index}
              className="rounded-2xl bg-white p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-300"
              style={{ backgroundColor: 'rgb(255, 255, 255)' }}
            >
              <div className="flex items-center justify-between mb-4">
                <div className={`w-12 h-12 rounded-xl ${metric.bgColor} flex items-center justify-center`}>
                  <metric.icon className={`w-6 h-6 ${metric.color}`} />
                </div>
                <div className={`flex items-center text-sm font-medium ${
                  typeof metric.change === 'number' && metric.change > 0 ? 'text-emerald-600' : 'text-red-600'
                }`}>
                  {typeof metric.change === 'number' && metric.change > 0 ? <ArrowUp className="w-4 h-4 mr-1" /> : <ArrowDown className="w-4 h-4 mr-1" />}
                  {Math.abs(metric.change || 0)}%
                </div>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-1">
                {typeof metric.value === 'number' ? metric.value.toLocaleString() : metric.value}
              </h3>
              <p className="text-gray-600 text-sm">{metric.title}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Social Accounts Grid */}
      <div className="mb-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Connected Accounts</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {socialAccounts && socialAccounts.length > 0 ? socialAccounts.map((account) => (
            <div
              key={account.id}
              className="rounded-2xl bg-white p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-300"
              style={{ backgroundColor: 'rgb(255, 255, 255)' }}
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center text-white font-bold">
                    {account.username.charAt(0).toUpperCase()}
                  </div>
                  <div className="ml-3">
                    <h3 className="font-semibold text-gray-900">@{account.username}</h3>
                    <p className="text-sm text-gray-500 capitalize">{account.platform}</p>
                  </div>
                </div>
                <div className={`w-3 h-3 rounded-full ${account.isActive ? 'bg-emerald-500' : 'bg-gray-300'}`}></div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-2xl font-bold text-gray-900">{account.followers.toLocaleString()}</p>
                  <p className="text-sm text-gray-600">Followers</p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900">{account.engagement}%</p>
                  <p className="text-sm text-gray-600">Engagement</p>
                </div>
              </div>
            </div>
          )) : (
            <div className="col-span-full text-center py-12">
              <Globe className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No accounts connected</h3>
              <p className="text-gray-600 mb-6">Connect your social media accounts to get started</p>
              <button 
                className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-6 py-3 rounded-xl font-semibold hover:shadow-lg transition-all duration-300"
                style={{ backgroundColor: 'rgb(59, 130, 246)' }}
              >
                Connect Account
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Recent Activity */}
      <div className="mb-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Recent Activity</h2>
        <div 
          className="rounded-2xl bg-white p-6 shadow-sm border border-gray-100"
          style={{ backgroundColor: 'rgb(255, 255, 255)' }}
        >
          {recentActivity?.length ? (
            <div className="space-y-4">
              {recentActivity.map((activity) => (
                <div key={activity.id} className="flex items-center justify-between p-4 rounded-xl bg-gray-50">
                  <div className="flex items-center">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center">
                      {activity.type === 'post' && <PlayCircle className="w-5 h-5 text-white" />}
                      {activity.type === 'comment' && <MessageSquare className="w-5 h-5 text-white" />}
                      {activity.type === 'like' && <Heart className="w-5 h-5 text-white" />}
                      {activity.type === 'follow' && <Users className="w-5 h-5 text-white" />}
                    </div>
                    <div className="ml-4">
                      <p className="font-medium text-gray-900">{activity.content}</p>
                      <p className="text-sm text-gray-500">{activity.platform} • {activity.timestamp.toLocaleDateString()}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-gray-900">{activity.engagement}</p>
                    <p className="text-sm text-gray-500">engagements</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <Activity className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No recent activity</h3>
              <p className="text-gray-600">Your recent social media activity will appear here</p>
            </div>
          )}
        </div>
      </div>

      {/* Growth Insights */}
      <div className="mb-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Growth Insights</h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div 
            className="rounded-2xl bg-white p-6 shadow-sm border border-gray-100"
            style={{ backgroundColor: 'rgb(255, 255, 255)' }}
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Weekly Performance</h3>
              <Trophy className="w-6 h-6 text-yellow-500" />
            </div>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Reach Growth</span>
                <span className="font-semibold text-emerald-600">+24.5%</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Engagement Rate</span>
                <span className="font-semibold text-blue-600">+12.3%</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Follower Growth</span>
                <span className="font-semibold text-purple-600">+8.7%</span>
              </div>
            </div>
          </div>
          
          <div 
            className="rounded-2xl bg-white p-6 shadow-sm border border-gray-100"
            style={{ backgroundColor: 'rgb(255, 255, 255)' }}
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Top Performing Content</h3>
              <Star className="w-6 h-6 text-yellow-500" />
            </div>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Video Content</span>
                <span className="font-semibold text-emerald-600">89% engagement</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Image Posts</span>
                <span className="font-semibold text-blue-600">76% engagement</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Stories</span>
                <span className="font-semibold text-purple-600">68% engagement</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ModernPureDashboard;