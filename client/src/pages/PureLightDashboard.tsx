import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useLocation } from 'wouter';
import { 
  Calendar,
  TrendingUp,
  Users,
  Globe,
  Zap,
  BarChart3,
  Clock,
  ArrowRight,
  Rocket,
  Heart,
  MessageCircle,
  PlayCircle
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';

// Define interfaces with exact same structure as original
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

const PureLightDashboard: React.FC = () => {
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

  // Calculate subscription status with pure light theme styling
  const getSubscriptionStatus = () => {
    if (!userData) return { status: 'Loading...', type: 'loading', color: 'text-slate-500' };
    
    const plan = userData.plan || 'free';
    const trialExpiresAt = userData.trialExpiresAt;
    
    // Check if user has an active trial
    if (trialExpiresAt) {
      const trialDate = new Date(trialExpiresAt);
      const today = new Date();
      const daysLeft = Math.ceil((trialDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
      
      if (daysLeft > 0) {
        return { 
          status: `Free Trial - ${daysLeft} day${daysLeft === 1 ? '' : 's'} left`, 
          type: 'trial', 
          color: daysLeft <= 3 ? 'text-red-600' : 'text-blue-600'
        };
      } else {
        return { status: 'Trial Expired', type: 'expired', color: 'text-red-600' };
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
      return { status: planName, type: 'paid', color: 'text-green-600' };
    }
    
    // Default to free plan
    return { status: 'Free Plan', type: 'free', color: 'text-slate-600' };
  };

  const subscriptionStatus = getSubscriptionStatus();

  if (dashboardLoading || userLoading) {
    return (
      <div 
        className="flex items-center justify-center min-h-[400px]"
        style={{ backgroundColor: 'rgb(255, 255, 255)', color: 'rgb(15, 23, 42)' }}
      >
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div 
      className="p-4 sm:p-6 space-y-4 sm:space-y-6 max-w-7xl mx-auto"
      style={{ backgroundColor: 'rgb(255, 255, 255)', color: 'rgb(15, 23, 42)' }}
    >
      {/* Header with greeting - Pure light theme */}
      <div 
        className="rounded-lg p-4 sm:p-6 border shadow-sm"
        style={{ 
          backgroundColor: 'rgb(255, 255, 255)', 
          borderColor: 'rgb(226, 232, 240)',
          color: 'rgb(15, 23, 42)'
        }}
      >
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="space-y-1">
            <h1 
              className="text-2xl sm:text-3xl font-bold"
              style={{ color: 'rgb(15, 23, 42)' }}
            >
              {greeting}, Arpit! {emoji}
            </h1>
            <p 
              className="text-sm sm:text-base"
              style={{ color: 'rgb(100, 116, 139)' }}
            >
              {date} • {time}
            </p>
          </div>
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-4">
            <Badge 
              variant="secondary"
              style={{ 
                backgroundColor: 'rgb(241, 245, 249)', 
                color: subscriptionStatus.color.replace('text-', '').includes('blue') ? 'rgb(37, 99, 235)' : 
                      subscriptionStatus.color.replace('text-', '').includes('green') ? 'rgb(34, 197, 94)' :
                      subscriptionStatus.color.replace('text-', '').includes('red') ? 'rgb(239, 68, 68)' : 'rgb(100, 116, 139)'
              }}
            >
              {subscriptionStatus.status}
            </Badge>
            <Button 
              onClick={() => setLocation('/content-studio')}
              style={{ 
                backgroundColor: 'rgb(37, 99, 235)', 
                color: 'rgb(255, 255, 255)',
                borderColor: 'rgb(37, 99, 235)'
              }}
              className="hover:opacity-90"
            >
              Create Content
            </Button>
          </div>
        </div>
      </div>

      {/* Quick Actions Grid - Pure light theme */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {[
          { 
            icon: Zap, 
            label: 'Create with AI', 
            color: 'rgb(168, 85, 247)', 
            bgColor: 'rgb(255, 255, 255)',
            borderColor: 'rgb(226, 232, 240)',
            onClick: () => setLocation('/ai-features') 
          },
          { 
            icon: Calendar, 
            label: 'Schedule Posts', 
            color: 'rgb(37, 99, 235)', 
            bgColor: 'rgb(255, 255, 255)',
            borderColor: 'rgb(226, 232, 240)',
            onClick: () => setLocation('/scheduler') 
          },
          { 
            icon: TrendingUp, 
            label: 'Analyze Trends', 
            color: 'rgb(34, 197, 94)', 
            bgColor: 'rgb(255, 255, 255)',
            borderColor: 'rgb(226, 232, 240)',
            onClick: () => setLocation('/analyzer') 
          },
          { 
            icon: Globe, 
            label: 'Multi-Platform', 
            color: 'rgb(245, 158, 11)', 
            bgColor: 'rgb(255, 255, 255)',
            borderColor: 'rgb(226, 232, 240)',
            onClick: () => setLocation('/integrations') 
          }
        ].map((action, index) => (
          <Card 
            key={index}
            className="cursor-pointer transition-all duration-200 hover:shadow-md border"
            onClick={action.onClick}
            style={{ 
              backgroundColor: action.bgColor,
              borderColor: action.borderColor 
            }}
          >
            <CardContent className="p-4 text-center">
              <action.icon 
                className="w-6 h-6 mx-auto mb-2" 
                style={{ color: action.color }}
              />
              <h3 
                className="font-medium text-sm"
                style={{ color: 'rgb(15, 23, 42)' }}
              >
                {action.label}
              </h3>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Performance Dashboard - Pure light theme */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
        <Card 
          className="lg:col-span-2 border"
          style={{ 
            backgroundColor: 'rgb(255, 255, 255)', 
            borderColor: 'rgb(226, 232, 240)' 
          }}
        >
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle 
                  style={{ color: 'rgb(15, 23, 42)' }}
                >
                  Performance Dashboard
                </CardTitle>
                <CardDescription 
                  style={{ color: 'rgb(100, 116, 139)' }}
                >
                  Your social media performance overview
                </CardDescription>
              </div>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => setLocation('/analytics')}
                style={{ 
                  backgroundColor: 'rgb(255, 255, 255)', 
                  borderColor: 'rgb(226, 232, 240)',
                  color: 'rgb(15, 23, 42)'
                }}
                className="hover:bg-gray-50"
              >
                View Analytics
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {[
                { 
                  label: 'Total Reach', 
                  value: dashboardData?.totalReach || 171, 
                  bgColor: 'rgb(255, 237, 213)', 
                  textColor: 'rgb(15, 23, 42)' 
                },
                { 
                  label: 'Followers', 
                  value: dashboardData?.totalFollowers || 13, 
                  bgColor: 'rgb(219, 234, 254)', 
                  textColor: 'rgb(15, 23, 42)' 
                },
                { 
                  label: 'Posts', 
                  value: dashboardData?.totalPosts || 14, 
                  bgColor: 'rgb(240, 253, 244)', 
                  textColor: 'rgb(15, 23, 42)' 
                },
                { 
                  label: 'Engagement', 
                  value: '4.8%', 
                  bgColor: 'rgb(254, 242, 242)', 
                  textColor: 'rgb(15, 23, 42)' 
                }
              ].map((metric, index) => (
                <div 
                  key={index}
                  className="p-4 rounded-lg border"
                  style={{ 
                    backgroundColor: metric.bgColor,
                    borderColor: 'rgb(226, 232, 240)'
                  }}
                >
                  <p 
                    className="text-2xl font-bold"
                    style={{ color: metric.textColor }}
                  >
                    {metric.value}
                  </p>
                  <p 
                    className="text-sm mt-1"
                    style={{ color: 'rgb(100, 116, 139)' }}
                  >
                    {metric.label}
                  </p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* AI Growth Insights - Pure light theme */}
        <Card 
          className="border"
          style={{ 
            backgroundColor: 'rgb(255, 255, 255)', 
            borderColor: 'rgb(226, 232, 240)' 
          }}
        >
          <CardHeader>
            <CardTitle 
              style={{ color: 'rgb(15, 23, 42)' }}
            >
              AI Growth Insights
            </CardTitle>
            <CardDescription 
              style={{ color: 'rgb(100, 116, 139)' }}
            >
              Personalized recommendations
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {[
              { 
                title: 'Best Time to Post', 
                value: '2:00 PM - 4:00 PM', 
                icon: Clock,
                bgColor: 'rgb(250, 245, 255)',
                iconColor: 'rgb(168, 85, 247)'
              },
              { 
                title: 'Top Performing Content', 
                value: 'Behind-the-scenes', 
                icon: TrendingUp,
                bgColor: 'rgb(236, 254, 255)',
                iconColor: 'rgb(6, 182, 212)'
              },
              { 
                title: 'Engagement Boost', 
                value: '+23% this week', 
                icon: ArrowRight,
                bgColor: 'rgb(236, 253, 245)',
                iconColor: 'rgb(16, 185, 129)'
              }
            ].map((insight, index) => (
              <div 
                key={index}
                className="p-3 rounded-lg border"
                style={{ 
                  backgroundColor: insight.bgColor,
                  borderColor: 'rgb(226, 232, 240)'
                }}
              >
                <div className="flex items-center gap-2 mb-1">
                  <insight.icon 
                    className="w-4 h-4" 
                    style={{ color: insight.iconColor }}
                  />
                  <p 
                    className="text-sm font-medium"
                    style={{ color: 'rgb(15, 23, 42)' }}
                  >
                    {insight.title}
                  </p>
                </div>
                <p 
                  className="text-sm"
                  style={{ color: 'rgb(100, 116, 139)' }}
                >
                  {insight.value}
                </p>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Social Accounts and Setup Tasks - Pure light theme */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        {/* Connected Accounts */}
        <Card 
          className="border"
          style={{ 
            backgroundColor: 'rgb(255, 255, 255)', 
            borderColor: 'rgb(226, 232, 240)' 
          }}
        >
          <CardHeader>
            <CardTitle 
              style={{ color: 'rgb(15, 23, 42)' }}
            >
              Connected Accounts
            </CardTitle>
            <CardDescription 
              style={{ color: 'rgb(100, 116, 139)' }}
            >
              Manage your social media connections
            </CardDescription>
          </CardHeader>
          <CardContent>
            {accountsLoading ? (
              <div className="space-y-3">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="animate-pulse">
                    <div 
                      className="h-4 rounded"
                      style={{ backgroundColor: 'rgb(226, 232, 240)' }}
                    ></div>
                  </div>
                ))}
              </div>
            ) : socialAccounts.length > 0 ? (
              <div className="space-y-3">
                {socialAccounts.map((account) => (
                  <div 
                    key={account.id}
                    className="flex items-center justify-between p-3 rounded-lg border"
                    style={{ 
                      backgroundColor: 'rgb(248, 250, 252)',
                      borderColor: 'rgb(226, 232, 240)'
                    }}
                  >
                    <div className="flex items-center gap-3">
                      <div 
                        className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium"
                        style={{ 
                          backgroundColor: account.platform === 'instagram' ? 'rgb(233, 30, 99)' : 'rgb(59, 130, 246)',
                          color: 'rgb(255, 255, 255)'
                        }}
                      >
                        {account.username.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <p 
                          className="font-medium"
                          style={{ color: 'rgb(15, 23, 42)' }}
                        >
                          @{account.username}
                        </p>
                        <p 
                          className="text-sm"
                          style={{ color: 'rgb(100, 116, 139)' }}
                        >
                          {account.followers} followers
                        </p>
                      </div>
                    </div>
                    <Badge 
                      variant="secondary"
                      style={{ 
                        backgroundColor: 'rgb(220, 252, 231)', 
                        color: 'rgb(22, 163, 74)'
                      }}
                    >
                      Connected
                    </Badge>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-6">
                <Users 
                  className="w-12 h-12 mx-auto mb-3" 
                  style={{ color: 'rgb(156, 163, 175)' }}
                />
                <p 
                  className="text-sm mb-3"
                  style={{ color: 'rgb(100, 116, 139)' }}
                >
                  No accounts connected yet
                </p>
                <Button 
                  size="sm"
                  onClick={() => setLocation('/integrations')}
                  style={{ 
                    backgroundColor: 'rgb(37, 99, 235)', 
                    color: 'rgb(255, 255, 255)'
                  }}
                >
                  Connect Account
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Setup Tasks */}
        <Card 
          className="border"
          style={{ 
            backgroundColor: 'rgb(255, 255, 255)', 
            borderColor: 'rgb(226, 232, 240)' 
          }}
        >
          <CardHeader>
            <CardTitle 
              style={{ color: 'rgb(15, 23, 42)' }}
            >
              Quick Setup
            </CardTitle>
            <CardDescription 
              style={{ color: 'rgb(100, 116, 139)' }}
            >
              Complete these steps to get started
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { 
                  title: 'Connect Social Media', 
                  description: 'Link your Instagram, Facebook, and other accounts', 
                  completed: socialAccounts.length > 0,
                  action: () => setLocation('/integrations'),
                  icon: Globe
                },
                { 
                  title: 'Create First Post', 
                  description: 'Use AI to generate your first social media post', 
                  completed: false,
                  action: () => setLocation('/content-studio'),
                  icon: Rocket
                },
                { 
                  title: 'Set Up Automation', 
                  description: 'Automate your content scheduling and responses', 
                  completed: false,
                  action: () => setLocation('/automation'),
                  icon: Zap
                }
              ].map((task, index) => (
                <div 
                  key={index}
                  className="flex items-center justify-between p-3 rounded-lg border cursor-pointer hover:shadow-sm transition-all"
                  onClick={task.action}
                  style={{ 
                    backgroundColor: task.completed ? 'rgb(240, 253, 244)' : 'rgb(248, 250, 252)',
                    borderColor: 'rgb(226, 232, 240)'
                  }}
                >
                  <div className="flex items-center gap-3">
                    <task.icon 
                      className="w-5 h-5" 
                      style={{ 
                        color: task.completed ? 'rgb(34, 197, 94)' : 'rgb(100, 116, 139)' 
                      }}
                    />
                    <div>
                      <p 
                        className="font-medium text-sm"
                        style={{ color: 'rgb(15, 23, 42)' }}
                      >
                        {task.title}
                      </p>
                      <p 
                        className="text-xs"
                        style={{ color: 'rgb(100, 116, 139)' }}
                      >
                        {task.description}
                      </p>
                    </div>
                  </div>
                  <div 
                    className="w-4 h-4 rounded-full border-2 flex items-center justify-center"
                    style={{ 
                      backgroundColor: task.completed ? 'rgb(34, 197, 94)' : 'rgb(255, 255, 255)',
                      borderColor: task.completed ? 'rgb(34, 197, 94)' : 'rgb(203, 213, 225)'
                    }}
                  >
                    {task.completed && (
                      <div 
                        className="w-2 h-2 rounded-full"
                        style={{ backgroundColor: 'rgb(255, 255, 255)' }}
                      ></div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default PureLightDashboard;