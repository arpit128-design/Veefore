import React from 'react';
import { motion } from 'framer-motion';
import {
  BarChart3,
  TrendingUp,
  Eye,
  Heart,
  MessageCircle,
  Share2,
  Play,
  Calendar,
  Clock,
  Target,
  ThumbsUp,
  Repeat,
  Users,
  Zap,
  FileText,
  Image,
  Video,
  Music,
  ChevronDown,
  Filter,
  Download,
  Settings,
  ArrowUp,
  ArrowDown,
  Star,
  Activity
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Progress } from '@/components/ui/progress';

export default function ContentPerformanceAnalytics() {
  const topPerformingContent = [
    {
      id: 1,
      type: 'video',
      title: 'Behind the Scenes: Product Launch',
      platform: 'Instagram',
      publishedAt: '2 days ago',
      views: 45672,
      likes: 3241,
      comments: 456,
      shares: 234,
      engagementRate: 12.4,
      score: 94,
      thumbnail: '/placeholder-video.jpg'
    },
    {
      id: 2,
      type: 'carousel',
      title: 'Top 10 Tips for Success',
      platform: 'LinkedIn',
      publishedAt: '1 week ago',
      views: 23891,
      likes: 1876,
      comments: 289,
      shares: 167,
      engagementRate: 9.7,
      score: 89,
      thumbnail: '/placeholder-carousel.jpg'
    },
    {
      id: 3,
      type: 'story',
      title: 'Quick Tutorial',
      platform: 'Instagram',
      publishedAt: '3 days ago',
      views: 18432,
      likes: 1245,
      comments: 98,
      shares: 56,
      engagementRate: 7.6,
      score: 82,
      thumbnail: '/placeholder-story.jpg'
    },
    {
      id: 4,
      type: 'post',
      title: 'Customer Success Story',
      platform: 'Facebook',
      publishedAt: '5 days ago',
      views: 34521,
      likes: 2134,
      comments: 345,
      shares: 178,
      engagementRate: 7.8,
      score: 85,
      thumbnail: '/placeholder-post.jpg'
    }
  ];

  const contentMetrics = [
    {
      title: 'Total Content Published',
      value: '247',
      change: '+23',
      period: 'This month',
      icon: FileText,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100'
    },
    {
      title: 'Average Engagement Rate',
      value: '8.7%',
      change: '+1.2%',
      period: 'Last 30 days',
      icon: Heart,
      color: 'text-red-600',
      bgColor: 'bg-red-100'
    },
    {
      title: 'Total Reach',
      value: '1.2M',
      change: '+185K',
      period: 'This month',
      icon: Eye,
      color: 'text-green-600',
      bgColor: 'bg-green-100'
    },
    {
      title: 'Content Score',
      value: '92/100',
      change: '+5',
      period: 'Overall quality',
      icon: Star,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100'
    }
  ];

  const contentTypes = [
    {
      type: 'Video',
      count: 89,
      engagement: 11.2,
      reach: 425000,
      icon: Video,
      color: 'text-red-600',
      bgColor: 'bg-red-100'
    },
    {
      type: 'Carousel',
      count: 67,
      engagement: 8.9,
      reach: 312000,
      icon: Image,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100'
    },
    {
      type: 'Single Post',
      count: 91,
      engagement: 6.4,
      reach: 289000,
      icon: FileText,
      color: 'text-green-600',
      bgColor: 'bg-green-100'
    },
    {
      type: 'Stories',
      count: 156,
      engagement: 4.7,
      reach: 178000,
      icon: Play,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100'
    },
    {
      type: 'Reels',
      count: 34,
      engagement: 15.3,
      reach: 567000,
      icon: Zap,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100'
    }
  ];

  const platformPerformance = [
    { platform: 'Instagram', posts: 127, avgEngagement: 9.2, topFormat: 'Reels' },
    { platform: 'Facebook', posts: 89, avgEngagement: 6.8, topFormat: 'Video' },
    { platform: 'LinkedIn', posts: 45, avgEngagement: 11.4, topFormat: 'Carousel' },
    { platform: 'Twitter', posts: 78, avgEngagement: 5.2, topFormat: 'Thread' },
    { platform: 'YouTube', posts: 12, avgEngagement: 18.7, topFormat: 'Long-form' }
  ];

  const contentCalendar = [
    { date: 'Mon, Jan 15', posts: 3, scheduled: 2, performance: 'high' },
    { date: 'Tue, Jan 16', posts: 2, scheduled: 1, performance: 'medium' },
    { date: 'Wed, Jan 17', posts: 4, scheduled: 3, performance: 'high' },
    { date: 'Thu, Jan 18', posts: 1, scheduled: 2, performance: 'low' },
    { date: 'Fri, Jan 19', posts: 3, scheduled: 1, performance: 'medium' },
    { date: 'Sat, Jan 20', posts: 2, scheduled: 4, performance: 'high' },
    { date: 'Sun, Jan 21', posts: 1, scheduled: 2, performance: 'medium' }
  ];

  const hashtagPerformance = [
    { hashtag: '#socialmedia', usage: 45, avgReach: 23400, engagementBoost: '+12%' },
    { hashtag: '#marketing', usage: 38, avgReach: 18900, engagementBoost: '+8%' },
    { hashtag: '#business', usage: 42, avgReach: 21200, engagementBoost: '+15%' },
    { hashtag: '#entrepreneur', usage: 29, avgReach: 17800, engagementBoost: '+6%' },
    { hashtag: '#growth', usage: 33, avgReach: 19600, engagementBoost: '+11%' }
  ];

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'video': return <Video className="h-4 w-4" />;
      case 'carousel': return <Image className="h-4 w-4" />;
      case 'story': return <Play className="h-4 w-4" />;
      case 'post': return <FileText className="h-4 w-4" />;
      default: return <FileText className="h-4 w-4" />;
    }
  };

  const getPerformanceColor = (performance: string) => {
    switch (performance) {
      case 'high': return 'bg-green-500';
      case 'medium': return 'bg-purple-500';
      case 'low': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const formatNumber = (num: number) => {
    if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
    if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
    return num.toString();
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex justify-between items-center"
        >
          <div>
            <h1 className="text-4xl font-bold text-gray-900 mb-2">Content Performance Analytics</h1>
            <p className="text-xl text-gray-600">Detailed insights into your content performance across all platforms</p>
          </div>
          <div className="flex space-x-3">
            <Button variant="outline" className="text-gray-700">
              <Filter className="h-4 w-4 mr-2" />
              Filter Content
            </Button>
            <Button variant="outline" className="text-gray-700">
              <Download className="h-4 w-4 mr-2" />
              Export Report
            </Button>
            <Button className="bg-blue-600 hover:bg-blue-700 text-white">
              <Activity className="h-4 w-4 mr-2" />
              View Live Data
            </Button>
          </div>
        </motion.div>

        {/* Content Metrics */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          {contentMetrics.map((metric, index) => (
            <Card key={index} className="bg-white border border-gray-200">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className={`p-3 rounded-xl ${metric.bgColor}`}>
                    <metric.icon className={`h-6 w-6 ${metric.color}`} />
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-green-600 font-semibold">{metric.change}</p>
                    <p className="text-xs text-gray-500">{metric.period}</p>
                  </div>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600 mb-1">{metric.title}</p>
                  <p className="text-2xl font-bold text-gray-900">{metric.value}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </motion.div>

        {/* Top Performing Content */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card className="bg-white border border-gray-200">
            <CardHeader>
              <CardTitle className="text-xl font-bold text-gray-900 flex items-center">
                <TrendingUp className="h-5 w-5 mr-2 text-blue-600" />
                Top Performing Content
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {topPerformingContent.map((content) => (
                  <div key={content.id} className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className="flex items-center space-x-2">
                          {getTypeIcon(content.type)}
                          <div>
                            <h4 className="font-semibold text-gray-900">{content.title}</h4>
                            <p className="text-sm text-gray-600">{content.platform} • {content.publishedAt}</p>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-6">
                        <div className="text-center">
                          <div className="flex items-center space-x-1 text-gray-700">
                            <Eye className="h-4 w-4" />
                            <span className="text-sm font-medium">{formatNumber(content.views)}</span>
                          </div>
                          <p className="text-xs text-gray-500">Views</p>
                        </div>
                        <div className="text-center">
                          <div className="flex items-center space-x-1 text-gray-700">
                            <Heart className="h-4 w-4" />
                            <span className="text-sm font-medium">{formatNumber(content.likes)}</span>
                          </div>
                          <p className="text-xs text-gray-500">Likes</p>
                        </div>
                        <div className="text-center">
                          <div className="flex items-center space-x-1 text-gray-700">
                            <MessageCircle className="h-4 w-4" />
                            <span className="text-sm font-medium">{content.comments}</span>
                          </div>
                          <p className="text-xs text-gray-500">Comments</p>
                        </div>
                        <div className="text-center">
                          <div className="flex items-center space-x-1 text-gray-700">
                            <Share2 className="h-4 w-4" />
                            <span className="text-sm font-medium">{content.shares}</span>
                          </div>
                          <p className="text-xs text-gray-500">Shares</p>
                        </div>
                        <div className="text-center">
                          <Badge className={`${
                            content.score >= 90 ? 'bg-green-100 text-green-800' :
                            content.score >= 80 ? 'bg-purple-100 text-purple-800' :
                            'bg-red-100 text-red-800'
                          }`}>
                            {content.score}/100
                          </Badge>
                          <p className="text-xs text-gray-500 mt-1">Score</p>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Content Types Performance and Platform Analysis */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="grid grid-cols-1 lg:grid-cols-2 gap-6"
        >
          {/* Content Types */}
          <Card className="bg-white border border-gray-200">
            <CardHeader>
              <CardTitle className="text-xl font-bold text-gray-900 flex items-center">
                <BarChart3 className="h-5 w-5 mr-2 text-purple-600" />
                Content Types Performance
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {contentTypes.map((type, index) => (
                  <div key={index} className="p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center space-x-3">
                        <div className={`p-2 rounded-lg ${type.bgColor}`}>
                          <type.icon className={`h-4 w-4 ${type.color}`} />
                        </div>
                        <span className="font-medium text-gray-900">{type.type}</span>
                      </div>
                      <Badge variant="outline" className="text-xs">
                        {type.count} posts
                      </Badge>
                    </div>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="text-gray-600">Engagement</p>
                        <p className="font-semibold text-gray-900">{type.engagement}%</p>
                      </div>
                      <div>
                        <p className="text-gray-600">Reach</p>
                        <p className="font-semibold text-gray-900">{formatNumber(type.reach)}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Platform Performance */}
          <Card className="bg-white border border-gray-200">
            <CardHeader>
              <CardTitle className="text-xl font-bold text-gray-900 flex items-center">
                <Target className="h-5 w-5 mr-2 text-green-600" />
                Platform Performance Analysis
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {platformPerformance.map((platform, index) => (
                  <div key={index} className="p-3 border border-gray-200 rounded-lg">
                    <div className="flex justify-between items-center mb-2">
                      <h4 className="font-semibold text-gray-900">{platform.platform}</h4>
                      <Badge className="bg-blue-100 text-blue-800 text-xs">
                        {platform.topFormat}
                      </Badge>
                    </div>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="text-gray-600">Posts Published</p>
                        <p className="font-semibold text-gray-900">{platform.posts}</p>
                      </div>
                      <div>
                        <p className="text-gray-600">Avg Engagement</p>
                        <p className="font-semibold text-gray-900">{platform.avgEngagement}%</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Content Calendar and Hashtag Performance */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="grid grid-cols-1 lg:grid-cols-2 gap-6"
        >
          {/* Content Calendar */}
          <Card className="bg-white border border-gray-200">
            <CardHeader>
              <CardTitle className="text-xl font-bold text-gray-900 flex items-center">
                <Calendar className="h-5 w-5 mr-2 text-blue-600" />
                Content Publishing Calendar
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {contentCalendar.map((day, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <p className="font-medium text-gray-900">{day.date}</p>
                      <p className="text-sm text-gray-600">{day.posts} published • {day.scheduled} scheduled</p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className={`w-3 h-3 rounded-full ${getPerformanceColor(day.performance)}`}></div>
                      <span className="text-sm capitalize text-gray-700">{day.performance}</span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Hashtag Performance */}
          <Card className="bg-white border border-gray-200">
            <CardHeader>
              <CardTitle className="text-xl font-bold text-gray-900 flex items-center">
                <Zap className="h-5 w-5 mr-2 text-purple-600" />
                Top Performing Hashtags
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {hashtagPerformance.map((hashtag, index) => (
                  <div key={index} className="p-3 border border-gray-200 rounded-lg">
                    <div className="flex justify-between items-center mb-2">
                      <span className="font-medium text-blue-600">{hashtag.hashtag}</span>
                      <Badge className="bg-green-100 text-green-800 text-xs">
                        {hashtag.engagementBoost}
                      </Badge>
                    </div>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="text-gray-600">Times Used</p>
                        <p className="font-semibold text-gray-900">{hashtag.usage}</p>
                      </div>
                      <div>
                        <p className="text-gray-600">Avg Reach</p>
                        <p className="font-semibold text-gray-900">{formatNumber(hashtag.avgReach)}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Content Insights */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <Card className="bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200">
            <CardHeader>
              <CardTitle className="text-xl font-bold text-gray-900 flex items-center">
                <Settings className="h-5 w-5 mr-2 text-purple-600" />
                AI-Powered Content Insights
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 bg-white rounded-lg border border-blue-200">
                  <h4 className="font-semibold text-gray-900 mb-2 flex items-center">
                    <TrendingUp className="h-4 w-4 mr-2 text-green-600" />
                    Best Performing Format
                  </h4>
                  <p className="text-sm text-gray-700 mb-2">Video content performs 67% better than other formats</p>
                  <Badge className="bg-green-100 text-green-800 text-xs">
                    15.3% avg engagement
                  </Badge>
                </div>
                <div className="p-4 bg-white rounded-lg border border-purple-200">
                  <h4 className="font-semibold text-gray-900 mb-2 flex items-center">
                    <Clock className="h-4 w-4 mr-2 text-purple-600" />
                    Optimal Posting Time
                  </h4>
                  <p className="text-sm text-gray-700 mb-2">6-8 PM weekdays show highest engagement rates</p>
                  <Badge className="bg-purple-100 text-purple-800 text-xs">
                    +23% engagement boost
                  </Badge>
                </div>
                <div className="p-4 bg-white rounded-lg border border-purple-200">
                  <h4 className="font-semibold text-gray-900 mb-2 flex items-center">
                    <Users className="h-4 w-4 mr-2 text-purple-600" />
                    Audience Preference
                  </h4>
                  <p className="text-sm text-gray-700 mb-2">Educational content receives 45% more shares</p>
                  <Badge className="bg-purple-100 text-purple-800 text-xs">
                    High share rate
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}