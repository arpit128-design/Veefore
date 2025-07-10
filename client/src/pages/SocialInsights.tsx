import React from 'react';
import { motion } from 'framer-motion';
import {
  TrendingUp,
  Users,
  Heart,
  MessageCircle,
  Share2,
  Eye,
  BarChart3,
  Calendar,
  Target,
  Zap,
  Instagram,
  Facebook,
  Twitter,
  Linkedin,
  Youtube,
  Clock,
  Globe,
  ArrowUp,
  ArrowDown
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export default function SocialInsights() {
  const platformMetrics = [
    {
      platform: 'Instagram',
      icon: Instagram,
      followers: '24.7K',
      engagement: '8.4%',
      reach: '156.2K',
      color: 'bg-pink-500',
      change: '+12.3%',
      positive: true
    },
    {
      platform: 'Facebook',
      icon: Facebook,
      followers: '18.2K',
      engagement: '6.2%',
      reach: '89.4K',
      color: 'bg-blue-600',
      change: '+8.1%',
      positive: true
    },
    {
      platform: 'Twitter',
      icon: Twitter,
      followers: '12.8K',
      engagement: '4.9%',
      reach: '67.3K',
      color: 'bg-sky-500',
      change: '-2.4%',
      positive: false
    },
    {
      platform: 'LinkedIn',
      icon: Linkedin,
      followers: '9.1K',
      engagement: '7.2%',
      reach: '45.8K',
      color: 'bg-blue-700',
      change: '+15.7%',
      positive: true
    },
    {
      platform: 'YouTube',
      icon: Youtube,
      followers: '6.3K',
      engagement: '12.1%',
      reach: '234.5K',
      color: 'bg-red-600',
      change: '+24.8%',
      positive: true
    }
  ];

  const contentTypes = [
    { type: 'Images', performance: 94, reach: '2.4M', engagement: '8.7%' },
    { type: 'Videos', performance: 87, reach: '1.8M', engagement: '12.3%' },
    { type: 'Carousels', performance: 92, reach: '1.2M', engagement: '9.1%' },
    { type: 'Stories', performance: 76, reach: '890K', engagement: '6.4%' },
    { type: 'Reels', performance: 98, reach: '3.2M', engagement: '15.2%' }
  ];

  const audienceInsights = [
    { metric: 'Age 18-24', percentage: 28, color: 'bg-purple-500' },
    { metric: 'Age 25-34', percentage: 42, color: 'bg-blue-500' },
    { metric: 'Age 35-44', percentage: 22, color: 'bg-green-500' },
    { metric: 'Age 45+', percentage: 8, color: 'bg-orange-500' }
  ];

  const topPosts = [
    {
      title: 'AI-Generated Sunset Landscape',
      platform: 'Instagram',
      likes: '12.4K',
      comments: '892',
      shares: '1.2K',
      engagement: '15.7%'
    },
    {
      title: 'Behind the Scenes: Content Creation',
      platform: 'YouTube',
      likes: '8.9K',
      comments: '567',
      shares: '743',
      engagement: '18.2%'
    },
    {
      title: 'Tips for Social Media Growth',
      platform: 'LinkedIn',
      likes: '5.6K',
      comments: '234',
      shares: '445',
      engagement: '12.9%'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Social Media Insights</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Comprehensive analytics and insights across all your social media platforms
          </p>
        </motion.div>

        {/* Overview Cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          {[
            { icon: Users, label: 'Total Followers', value: '71.1K', change: '+14.2%', positive: true },
            { icon: Eye, label: 'Total Reach', value: '593.2K', change: '+18.7%', positive: true },
            { icon: Heart, label: 'Avg Engagement', value: '8.9%', change: '+2.3%', positive: true },
            { icon: TrendingUp, label: 'Growth Rate', value: '+12.8%', change: '+5.1%', positive: true }
          ].map((metric, index) => (
            <Card key={index} className="bg-white border border-gray-200">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="p-3 bg-blue-100 rounded-xl">
                      <metric.icon className="h-6 w-6 text-blue-600" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-600">{metric.label}</p>
                      <p className="text-2xl font-bold text-gray-900">{metric.value}</p>
                    </div>
                  </div>
                  <div className={`flex items-center ${metric.positive ? 'text-green-600' : 'text-red-600'}`}>
                    {metric.positive ? <ArrowUp className="h-4 w-4 mr-1" /> : <ArrowDown className="h-4 w-4 mr-1" />}
                    <span className="text-sm font-semibold">{metric.change}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </motion.div>

        {/* Platform Performance */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card className="bg-white border border-gray-200">
            <CardHeader>
              <CardTitle className="text-xl font-bold text-gray-900 flex items-center">
                <BarChart3 className="h-5 w-5 mr-2 text-blue-600" />
                Platform Performance
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
                {platformMetrics.map((platform, index) => (
                  <div key={index} className="bg-gray-50 rounded-xl p-4 text-center">
                    <div className={`inline-flex p-3 rounded-xl ${platform.color} mb-3`}>
                      <platform.icon className="h-6 w-6 text-white" />
                    </div>
                    <h3 className="font-semibold text-gray-900 mb-2">{platform.platform}</h3>
                    <div className="space-y-1">
                      <p className="text-sm text-gray-600">Followers: <span className="font-semibold text-gray-900">{platform.followers}</span></p>
                      <p className="text-sm text-gray-600">Engagement: <span className="font-semibold text-gray-900">{platform.engagement}</span></p>
                      <p className="text-sm text-gray-600">Reach: <span className="font-semibold text-gray-900">{platform.reach}</span></p>
                      <div className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-semibold ${
                        platform.positive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                      }`}>
                        {platform.positive ? <ArrowUp className="h-3 w-3 mr-1" /> : <ArrowDown className="h-3 w-3 mr-1" />}
                        {platform.change}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Content Analysis */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="grid grid-cols-1 lg:grid-cols-2 gap-6"
        >
          {/* Content Type Performance */}
          <Card className="bg-white border border-gray-200">
            <CardHeader>
              <CardTitle className="text-xl font-bold text-gray-900 flex items-center">
                <Target className="h-5 w-5 mr-2 text-purple-600" />
                Content Type Performance
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {contentTypes.map((content, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm font-medium text-gray-900">{content.type}</span>
                        <span className="text-sm font-bold text-gray-900">{content.performance}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-gradient-to-r from-purple-500 to-blue-500 h-2 rounded-full"
                          style={{ width: `${content.performance}%` }}
                        ></div>
                      </div>
                      <div className="flex justify-between mt-1">
                        <span className="text-xs text-gray-500">Reach: {content.reach}</span>
                        <span className="text-xs text-gray-500">Engagement: {content.engagement}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Audience Demographics */}
          <Card className="bg-white border border-gray-200">
            <CardHeader>
              <CardTitle className="text-xl font-bold text-gray-900 flex items-center">
                <Globe className="h-5 w-5 mr-2 text-green-600" />
                Audience Demographics
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div>
                  <h4 className="font-semibold text-gray-900 mb-3">Age Distribution</h4>
                  <div className="space-y-3">
                    {audienceInsights.map((insight, index) => (
                      <div key={index} className="flex items-center justify-between">
                        <span className="text-sm font-medium text-gray-700">{insight.metric}</span>
                        <div className="flex items-center space-x-2">
                          <div className="w-24 bg-gray-200 rounded-full h-2">
                            <div
                              className={`${insight.color} h-2 rounded-full`}
                              style={{ width: `${insight.percentage}%` }}
                            ></div>
                          </div>
                          <span className="text-sm font-bold text-gray-900 w-8">{insight.percentage}%</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-3">Top Locations</h4>
                  <div className="space-y-2">
                    {[
                      { country: 'United States', percentage: 35 },
                      { country: 'United Kingdom', percentage: 18 },
                      { country: 'Canada', percentage: 12 },
                      { country: 'Australia', percentage: 8 }
                    ].map((location, index) => (
                      <div key={index} className="flex justify-between items-center">
                        <span className="text-sm text-gray-700">{location.country}</span>
                        <span className="text-sm font-semibold text-gray-900">{location.percentage}%</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Top Performing Posts */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Card className="bg-white border border-gray-200">
            <CardHeader>
              <CardTitle className="text-xl font-bold text-gray-900 flex items-center">
                <Zap className="h-5 w-5 mr-2 text-yellow-600" />
                Top Performing Posts
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="text-left py-3 px-4 text-gray-800 font-semibold">Post Title</th>
                      <th className="text-left py-3 px-4 text-gray-800 font-semibold">Platform</th>
                      <th className="text-left py-3 px-4 text-gray-800 font-semibold">Likes</th>
                      <th className="text-left py-3 px-4 text-gray-800 font-semibold">Comments</th>
                      <th className="text-left py-3 px-4 text-gray-800 font-semibold">Shares</th>
                      <th className="text-left py-3 px-4 text-gray-800 font-semibold">Engagement</th>
                    </tr>
                  </thead>
                  <tbody>
                    {topPosts.map((post, index) => (
                      <tr key={index} className="border-b border-gray-100 hover:bg-gray-50">
                        <td className="py-3 px-4 text-gray-900 font-medium">{post.title}</td>
                        <td className="py-3 px-4">
                          <Badge variant="outline" className="text-blue-600 border-blue-200">
                            {post.platform}
                          </Badge>
                        </td>
                        <td className="py-3 px-4 text-gray-800">{post.likes}</td>
                        <td className="py-3 px-4 text-gray-800">{post.comments}</td>
                        <td className="py-3 px-4 text-gray-800">{post.shares}</td>
                        <td className="py-3 px-4 text-green-600 font-semibold">{post.engagement}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Optimal Posting Times */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <Card className="bg-white border border-gray-200">
            <CardHeader>
              <CardTitle className="text-xl font-bold text-gray-900 flex items-center">
                <Clock className="h-5 w-5 mr-2 text-orange-600" />
                Optimal Posting Times
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center">
                  <h4 className="font-semibold text-gray-900 mb-2">Weekdays</h4>
                  <div className="space-y-2">
                    <div className="bg-blue-100 rounded-lg p-3">
                      <span className="text-blue-800 font-semibold">9:00 AM - 11:00 AM</span>
                      <p className="text-sm text-blue-600">Peak engagement</p>
                    </div>
                    <div className="bg-green-100 rounded-lg p-3">
                      <span className="text-green-800 font-semibold">1:00 PM - 3:00 PM</span>
                      <p className="text-sm text-green-600">High reach</p>
                    </div>
                  </div>
                </div>
                <div className="text-center">
                  <h4 className="font-semibold text-gray-900 mb-2">Weekends</h4>
                  <div className="space-y-2">
                    <div className="bg-purple-100 rounded-lg p-3">
                      <span className="text-purple-800 font-semibold">10:00 AM - 12:00 PM</span>
                      <p className="text-sm text-purple-600">Best visibility</p>
                    </div>
                    <div className="bg-orange-100 rounded-lg p-3">
                      <span className="text-orange-800 font-semibold">7:00 PM - 9:00 PM</span>
                      <p className="text-sm text-orange-600">Evening peak</p>
                    </div>
                  </div>
                </div>
                <div className="text-center">
                  <h4 className="font-semibold text-gray-900 mb-2">Platform Specific</h4>
                  <div className="space-y-2">
                    <div className="bg-pink-100 rounded-lg p-3">
                      <span className="text-pink-800 font-semibold">Instagram: 6-9 PM</span>
                    </div>
                    <div className="bg-blue-100 rounded-lg p-3">
                      <span className="text-blue-800 font-semibold">LinkedIn: 8-10 AM</span>
                    </div>
                    <div className="bg-red-100 rounded-lg p-3">
                      <span className="text-red-800 font-semibold">YouTube: 2-4 PM</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}