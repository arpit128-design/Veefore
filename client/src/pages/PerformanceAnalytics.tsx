import React from 'react';
import { motion } from 'framer-motion';
import {
  TrendingUp,
  BarChart3,
  Activity,
  Clock,
  Users,
  Heart,
  MessageCircle,
  Share2,
  Eye,
  Target,
  Zap,
  Calendar,
  Filter,
  Download,
  RefreshCw,
  AlertCircle,
  CheckCircle,
  ArrowUp,
  ArrowDown,
  Minus
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

export default function PerformanceAnalytics() {
  const performanceMetrics = [
    {
      title: 'Engagement Rate',
      value: '8.94%',
      change: '+2.3%',
      trend: 'up',
      benchmark: '6.2%',
      icon: Heart,
      color: 'text-pink-600',
      bgColor: 'bg-pink-100'
    },
    {
      title: 'Reach Growth',
      value: '847.2K',
      change: '+18.7%',
      trend: 'up',
      benchmark: '650K',
      icon: Eye,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100'
    },
    {
      title: 'Conversion Rate',
      value: '3.47%',
      change: '-0.8%',
      trend: 'down',
      benchmark: '2.9%',
      icon: Target,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100'
    },
    {
      title: 'Response Time',
      value: '1.2s',
      change: '0%',
      trend: 'neutral',
      benchmark: '2.1s',
      icon: Clock,
      color: 'text-green-600',
      bgColor: 'bg-green-100'
    }
  ];

  const contentPerformance = [
    {
      category: 'Images',
      posts: 247,
      avgEngagement: '8.7%',
      totalReach: '2.4M',
      topPerformer: '15.2%',
      performance: 92
    },
    {
      category: 'Videos',
      posts: 89,
      avgEngagement: '12.3%',
      totalReach: '1.8M',
      topPerformer: '24.7%',
      performance: 96
    },
    {
      category: 'Carousels',
      posts: 156,
      avgEngagement: '9.1%',
      totalReach: '1.2M',
      topPerformer: '18.9%',
      performance: 88
    },
    {
      category: 'Stories',
      posts: 324,
      avgEngagement: '6.4%',
      totalReach: '890K',
      topPerformer: '11.3%',
      performance: 75
    },
    {
      category: 'Reels',
      posts: 67,
      avgEngagement: '15.2%',
      totalReach: '3.2M',
      topPerformer: '32.1%',
      performance: 98
    }
  ];

  const timeBasedAnalytics = [
    { hour: '6 AM', engagement: 12, reach: 8400, posts: 2 },
    { hour: '9 AM', engagement: 34, reach: 15600, posts: 8 },
    { hour: '12 PM', engagement: 28, reach: 12300, posts: 6 },
    { hour: '3 PM', engagement: 42, reach: 18900, posts: 12 },
    { hour: '6 PM', engagement: 67, reach: 24700, posts: 15 },
    { hour: '9 PM', engagement: 45, reach: 19800, posts: 9 },
    { hour: '12 AM', engagement: 18, reach: 7200, posts: 3 }
  ];

  const competitorComparison = [
    {
      metric: 'Engagement Rate',
      ourValue: '8.94%',
      competitor1: '6.23%',
      competitor2: '7.45%',
      industryAvg: '6.89%',
      status: 'leading'
    },
    {
      metric: 'Posting Frequency',
      ourValue: '2.3/day',
      competitor1: '4.1/day',
      competitor2: '1.8/day',
      industryAvg: '2.7/day',
      status: 'competitive'
    },
    {
      metric: 'Response Time',
      ourValue: '1.2h',
      competitor1: '3.4h',
      competitor2: '2.1h',
      industryAvg: '2.8h',
      status: 'leading'
    },
    {
      metric: 'Content Quality Score',
      ourValue: '94/100',
      competitor1: '78/100',
      competitor2: '85/100',
      industryAvg: '82/100',
      status: 'leading'
    }
  ];

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up':
        return <ArrowUp className="h-4 w-4" />;
      case 'down':
        return <ArrowDown className="h-4 w-4" />;
      default:
        return <Minus className="h-4 w-4" />;
    }
  };

  const getTrendColor = (trend: string) => {
    switch (trend) {
      case 'up':
        return 'text-green-600';
      case 'down':
        return 'text-red-600';
      default:
        return 'text-gray-600';
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'leading':
        return <Badge className="bg-green-100 text-green-800 border-green-200">Leading</Badge>;
      case 'competitive':
        return <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200">Competitive</Badge>;
      default:
        return <Badge className="bg-red-100 text-red-800 border-red-200">Below Average</Badge>;
    }
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
            <h1 className="text-4xl font-bold text-gray-900 mb-2">Performance Analytics</h1>
            <p className="text-xl text-gray-600">Deep dive into your content performance and optimization opportunities</p>
          </div>
          <div className="flex space-x-3">
            <Button variant="outline" className="text-gray-700">
              <Filter className="h-4 w-4 mr-2" />
              Filters
            </Button>
            <Button variant="outline" className="text-gray-700">
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
            <Button className="bg-blue-600 hover:bg-blue-700 text-white">
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh Data
            </Button>
          </div>
        </motion.div>

        {/* Key Performance Metrics */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          {performanceMetrics.map((metric, index) => (
            <Card key={index} className="bg-white border border-gray-200">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className={`p-3 rounded-xl ${metric.bgColor}`}>
                    <metric.icon className={`h-6 w-6 ${metric.color}`} />
                  </div>
                  <div className={`flex items-center ${getTrendColor(metric.trend)}`}>
                    {getTrendIcon(metric.trend)}
                    <span className="text-sm font-semibold ml-1">{metric.change}</span>
                  </div>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600 mb-1">{metric.title}</p>
                  <p className="text-2xl font-bold text-gray-900 mb-2">{metric.value}</p>
                  <p className="text-xs text-gray-500">
                    Benchmark: <span className="font-semibold">{metric.benchmark}</span>
                  </p>
                </div>
              </CardContent>
            </Card>
          ))}
        </motion.div>

        {/* Content Performance Analysis */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card className="bg-white border border-gray-200">
            <CardHeader>
              <CardTitle className="text-xl font-bold text-gray-900 flex items-center">
                <BarChart3 className="h-5 w-5 mr-2 text-blue-600" />
                Content Performance by Type
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="text-left py-3 px-4 text-gray-800 font-semibold">Content Type</th>
                      <th className="text-left py-3 px-4 text-gray-800 font-semibold">Posts</th>
                      <th className="text-left py-3 px-4 text-gray-800 font-semibold">Avg Engagement</th>
                      <th className="text-left py-3 px-4 text-gray-800 font-semibold">Total Reach</th>
                      <th className="text-left py-3 px-4 text-gray-800 font-semibold">Top Performer</th>
                      <th className="text-left py-3 px-4 text-gray-800 font-semibold">Performance Score</th>
                    </tr>
                  </thead>
                  <tbody>
                    {contentPerformance.map((content, index) => (
                      <tr key={index} className="border-b border-gray-100 hover:bg-gray-50">
                        <td className="py-3 px-4 text-gray-900 font-medium">{content.category}</td>
                        <td className="py-3 px-4 text-gray-800">{content.posts}</td>
                        <td className="py-3 px-4 text-gray-800">{content.avgEngagement}</td>
                        <td className="py-3 px-4 text-gray-800">{content.totalReach}</td>
                        <td className="py-3 px-4 text-green-600 font-semibold">{content.topPerformer}</td>
                        <td className="py-3 px-4">
                          <div className="flex items-center space-x-2">
                            <div className="w-12 bg-gray-200 rounded-full h-2">
                              <div
                                className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full"
                                style={{ width: `${content.performance}%` }}
                              ></div>
                            </div>
                            <span className="text-sm font-semibold text-gray-900">{content.performance}%</span>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Time-Based Analytics */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="grid grid-cols-1 lg:grid-cols-2 gap-6"
        >
          {/* Hourly Performance */}
          <Card className="bg-white border border-gray-200">
            <CardHeader>
              <CardTitle className="text-xl font-bold text-gray-900 flex items-center">
                <Clock className="h-5 w-5 mr-2 text-orange-600" />
                Hourly Performance Analysis
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {timeBasedAnalytics.map((time, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-4">
                      <span className="font-semibold text-gray-900 w-16">{time.hour}</span>
                      <div className="flex items-center space-x-2">
                        <Activity className="h-4 w-4 text-blue-600" />
                        <span className="text-sm text-gray-600">{time.engagement}% engagement</span>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4">
                      <span className="text-sm text-gray-600">{time.reach.toLocaleString()} reach</span>
                      <Badge variant="outline" className="text-purple-600 border-purple-200">
                        {time.posts} posts
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Performance Insights */}
          <Card className="bg-white border border-gray-200">
            <CardHeader>
              <CardTitle className="text-xl font-bold text-gray-900 flex items-center">
                <Zap className="h-5 w-5 mr-2 text-yellow-600" />
                Performance Insights
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                  <div className="flex items-center mb-2">
                    <CheckCircle className="h-5 w-5 text-green-600 mr-2" />
                    <span className="font-semibold text-green-800">Strong Performance</span>
                  </div>
                  <p className="text-sm text-green-700">
                    Video content is performing 32% above industry average. 
                    Consider increasing video production frequency.
                  </p>
                </div>
                
                <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <div className="flex items-center mb-2">
                    <AlertCircle className="h-5 w-5 text-yellow-600 mr-2" />
                    <span className="font-semibold text-yellow-800">Optimization Opportunity</span>
                  </div>
                  <p className="text-sm text-yellow-700">
                    Story engagement is 18% below potential. 
                    Experiment with interactive elements and polls.
                  </p>
                </div>
                
                <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <div className="flex items-center mb-2">
                    <TrendingUp className="h-5 w-5 text-blue-600 mr-2" />
                    <span className="font-semibold text-blue-800">Growth Trend</span>
                  </div>
                  <p className="text-sm text-blue-700">
                    Evening posts (6-9 PM) show consistent 40% higher engagement. 
                    Schedule more content during this window.
                  </p>
                </div>
                
                <div className="p-4 bg-purple-50 border border-purple-200 rounded-lg">
                  <div className="flex items-center mb-2">
                    <Target className="h-5 w-5 text-purple-600 mr-2" />
                    <span className="font-semibold text-purple-800">Conversion Focus</span>
                  </div>
                  <p className="text-sm text-purple-700">
                    Carousel posts drive 23% more website clicks. 
                    Use for product showcases and tutorials.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Competitor Comparison */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Card className="bg-white border border-gray-200">
            <CardHeader>
              <CardTitle className="text-xl font-bold text-gray-900 flex items-center">
                <Users className="h-5 w-5 mr-2 text-green-600" />
                Competitive Benchmarking
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="text-left py-3 px-4 text-gray-800 font-semibold">Metric</th>
                      <th className="text-left py-3 px-4 text-gray-800 font-semibold">Our Performance</th>
                      <th className="text-left py-3 px-4 text-gray-800 font-semibold">Competitor A</th>
                      <th className="text-left py-3 px-4 text-gray-800 font-semibold">Competitor B</th>
                      <th className="text-left py-3 px-4 text-gray-800 font-semibold">Industry Average</th>
                      <th className="text-left py-3 px-4 text-gray-800 font-semibold">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {competitorComparison.map((comparison, index) => (
                      <tr key={index} className="border-b border-gray-100 hover:bg-gray-50">
                        <td className="py-3 px-4 text-gray-900 font-medium">{comparison.metric}</td>
                        <td className="py-3 px-4 text-blue-600 font-semibold">{comparison.ourValue}</td>
                        <td className="py-3 px-4 text-gray-800">{comparison.competitor1}</td>
                        <td className="py-3 px-4 text-gray-800">{comparison.competitor2}</td>
                        <td className="py-3 px-4 text-gray-800">{comparison.industryAvg}</td>
                        <td className="py-3 px-4">{getStatusBadge(comparison.status)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Action Items */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <Card className="bg-white border border-gray-200">
            <CardHeader>
              <CardTitle className="text-xl font-bold text-gray-900 flex items-center">
                <Target className="h-5 w-5 mr-2 text-red-600" />
                Recommended Actions
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {[
                  {
                    title: 'Increase Video Content',
                    description: 'Videos show 96% performance score. Aim for 3 videos per week.',
                    priority: 'High',
                    impact: '+25% engagement',
                    color: 'border-red-200 bg-red-50'
                  },
                  {
                    title: 'Optimize Posting Times',
                    description: 'Shift more content to 6-9 PM window for maximum visibility.',
                    priority: 'Medium',
                    impact: '+18% reach',
                    color: 'border-yellow-200 bg-yellow-50'
                  },
                  {
                    title: 'Improve Story Strategy',
                    description: 'Add interactive elements and behind-the-scenes content.',
                    priority: 'Medium',
                    impact: '+12% engagement',
                    color: 'border-blue-200 bg-blue-50'
                  },
                  {
                    title: 'Enhance Response Speed',
                    description: 'Aim for under 1 hour response time to maintain leadership.',
                    priority: 'Low',
                    impact: '+5% satisfaction',
                    color: 'border-green-200 bg-green-50'
                  },
                  {
                    title: 'Create More Carousels',
                    description: 'Leverage carousel format for product showcases and tutorials.',
                    priority: 'High',
                    impact: '+20% conversions',
                    color: 'border-purple-200 bg-purple-50'
                  },
                  {
                    title: 'Competitor Analysis',
                    description: 'Study top-performing competitor content for inspiration.',
                    priority: 'Low',
                    impact: '+8% strategy',
                    color: 'border-gray-200 bg-gray-50'
                  }
                ].map((action, index) => (
                  <div key={index} className={`p-4 rounded-lg border ${action.color}`}>
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="font-semibold text-gray-900">{action.title}</h4>
                      <Badge variant="outline" className={`text-xs ${
                        action.priority === 'High' ? 'border-red-300 text-red-700' :
                        action.priority === 'Medium' ? 'border-yellow-300 text-yellow-700' :
                        'border-green-300 text-green-700'
                      }`}>
                        {action.priority}
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-700 mb-2">{action.description}</p>
                    <p className="text-xs font-semibold text-gray-600">Expected Impact: {action.impact}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}