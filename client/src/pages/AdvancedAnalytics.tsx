import React from 'react';
import { motion } from 'framer-motion';
import {
  BarChart3,
  TrendingUp,
  PieChart,
  Activity,
  Zap,
  Target,
  Users,
  MessageCircle,
  Heart,
  Share2,
  Eye,
  Calendar,
  Clock,
  Globe,
  Filter,
  Download,
  Settings,
  Lightbulb,
  AlertTriangle,
  CheckCircle,
  ArrowUp,
  ArrowDown,
  Minus,
  Brain,
  Gauge
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Progress } from '@/components/ui/progress';

export default function AdvancedAnalytics() {
  const advancedMetrics = [
    {
      title: 'AI Engagement Score',
      value: '94.7',
      change: '+5.2',
      trend: 'up',
      description: 'Machine learning predicted engagement',
      icon: Brain,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100'
    },
    {
      title: 'Viral Potential Index',
      value: '87.3%',
      change: '+12.8%',
      trend: 'up',
      description: 'Likelihood of content going viral',
      icon: Zap,
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-100'
    },
    {
      title: 'Conversion Velocity',
      value: '2.34x',
      change: '+0.45x',
      trend: 'up',
      description: 'Speed of follower to customer conversion',
      icon: Gauge,
      color: 'text-green-600',
      bgColor: 'bg-green-100'
    },
    {
      title: 'Content Quality Score',
      value: '96/100',
      change: '+4',
      trend: 'up',
      description: 'AI-assessed content quality rating',
      icon: Target,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100'
    }
  ];

  const predictiveAnalytics = [
    {
      metric: 'Follower Growth Prediction',
      current: '24.7K',
      predicted: '31.2K',
      timeframe: 'Next 30 days',
      confidence: 89,
      trend: 'up'
    },
    {
      metric: 'Engagement Rate Forecast',
      current: '8.94%',
      predicted: '11.2%',
      timeframe: 'Next 7 days',
      confidence: 94,
      trend: 'up'
    },
    {
      metric: 'Revenue Impact Projection',
      current: '$12,450',
      predicted: '$18,700',
      timeframe: 'Next 15 days',
      confidence: 76,
      trend: 'up'
    },
    {
      metric: 'Content Viral Probability',
      current: '12.3%',
      predicted: '24.7%',
      timeframe: 'With optimization',
      confidence: 82,
      trend: 'up'
    }
  ];

  const sentimentAnalysis = [
    { platform: 'Instagram', positive: 78, neutral: 15, negative: 7 },
    { platform: 'Facebook', positive: 65, neutral: 25, negative: 10 },
    { platform: 'Twitter', positive: 58, neutral: 22, negative: 20 },
    { platform: 'LinkedIn', positive: 85, neutral: 12, negative: 3 },
    { platform: 'YouTube', positive: 92, neutral: 6, negative: 2 }
  ];

  const contentOptimization = [
    {
      category: 'Hashtag Strategy',
      currentScore: 72,
      optimizedScore: 94,
      improvement: '+22%',
      recommendations: ['Add trending hashtags', 'Use niche-specific tags', 'Reduce hashtag count to 8-12']
    },
    {
      category: 'Posting Schedule',
      currentScore: 65,
      optimizedScore: 89,
      improvement: '+24%',
      recommendations: ['Post at 6-8 PM', 'Increase weekend frequency', 'Add morning slots']
    },
    {
      category: 'Content Mix',
      currentScore: 81,
      optimizedScore: 96,
      improvement: '+15%',
      recommendations: ['More video content', 'Interactive stories', 'Behind-the-scenes posts']
    },
    {
      category: 'Audience Targeting',
      currentScore: 78,
      optimizedScore: 92,
      improvement: '+14%',
      recommendations: ['Focus on 25-34 age group', 'Target evening browsers', 'Geographic expansion']
    }
  ];

  const aiInsights = [
    {
      type: 'Opportunity',
      title: 'Untapped Audience Segment',
      description: 'AI detected 34% engagement potential in 18-24 age group',
      impact: 'High',
      effort: 'Medium',
      confidence: 91
    },
    {
      type: 'Warning',
      title: 'Content Saturation Risk',
      description: 'Similar content types showing 15% engagement decline',
      impact: 'Medium',
      effort: 'Low',
      confidence: 87
    },
    {
      type: 'Trend',
      title: 'Rising Format Preference',
      description: 'Carousel posts gaining 28% more engagement this week',
      impact: 'High',
      effort: 'Low',
      confidence: 95
    },
    {
      type: 'Optimization',
      title: 'Caption Length Sweet Spot',
      description: '150-200 character captions perform 45% better',
      impact: 'Medium',
      effort: 'Low',
      confidence: 88
    }
  ];

  const competitorIntelligence = [
    {
      competitor: 'Brand Alpha',
      engagement: '6.2%',
      growth: '+8.4%',
      contentGaps: ['Video tutorials', 'User-generated content'],
      opportunities: 'Weak on weekends'
    },
    {
      competitor: 'Brand Beta',
      engagement: '9.1%',
      growth: '+12.7%',
      contentGaps: ['Behind-the-scenes', 'Educational content'],
      opportunities: 'Limited story usage'
    },
    {
      competitor: 'Brand Gamma',
      engagement: '5.8%',
      growth: '+5.2%',
      contentGaps: ['Interactive polls', 'Live content'],
      opportunities: 'Poor engagement timing'
    }
  ];

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up': return <ArrowUp className="h-4 w-4" />;
      case 'down': return <ArrowDown className="h-4 w-4" />;
      default: return <Minus className="h-4 w-4" />;
    }
  };

  const getTrendColor = (trend: string) => {
    switch (trend) {
      case 'up': return 'text-green-600';
      case 'down': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  const getInsightIcon = (type: string) => {
    switch (type) {
      case 'Opportunity': return <Lightbulb className="h-5 w-5 text-yellow-600" />;
      case 'Warning': return <AlertTriangle className="h-5 w-5 text-red-600" />;
      case 'Trend': return <TrendingUp className="h-5 w-5 text-blue-600" />;
      case 'Optimization': return <Settings className="h-5 w-5 text-green-600" />;
      default: return <Activity className="h-5 w-5 text-gray-600" />;
    }
  };

  const getInsightColor = (type: string) => {
    switch (type) {
      case 'Opportunity': return 'bg-yellow-50 border-yellow-200';
      case 'Warning': return 'bg-red-50 border-red-200';
      case 'Trend': return 'bg-blue-50 border-blue-200';
      case 'Optimization': return 'bg-green-50 border-green-200';
      default: return 'bg-gray-50 border-gray-200';
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
            <h1 className="text-4xl font-bold text-gray-900 mb-2">Advanced Analytics</h1>
            <p className="text-xl text-gray-600">AI-powered insights and predictive analytics for optimal performance</p>
          </div>
          <div className="flex space-x-3">
            <Button variant="outline" className="text-gray-700">
              <Filter className="h-4 w-4 mr-2" />
              AI Filters
            </Button>
            <Button variant="outline" className="text-gray-700">
              <Download className="h-4 w-4 mr-2" />
              Export Report
            </Button>
            <Button className="bg-purple-600 hover:bg-purple-700 text-white">
              <Brain className="h-4 w-4 mr-2" />
              AI Insights
            </Button>
          </div>
        </motion.div>

        {/* Advanced Metrics */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          {advancedMetrics.map((metric, index) => (
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
                  <p className="text-xs text-gray-500">{metric.description}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </motion.div>

        {/* Predictive Analytics */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card className="bg-white border border-gray-200">
            <CardHeader>
              <CardTitle className="text-xl font-bold text-gray-900 flex items-center">
                <TrendingUp className="h-5 w-5 mr-2 text-purple-600" />
                Predictive Analytics & Forecasting
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {predictiveAnalytics.map((prediction, index) => (
                  <div key={index} className="p-4 bg-gray-50 rounded-xl">
                    <div className="flex justify-between items-start mb-3">
                      <h4 className="font-semibold text-gray-900">{prediction.metric}</h4>
                      <Badge className="bg-purple-100 text-purple-800">
                        {prediction.confidence}% confidence
                      </Badge>
                    </div>
                    <div className="grid grid-cols-2 gap-4 mb-3">
                      <div>
                        <p className="text-xs text-gray-500 mb-1">Current</p>
                        <p className="text-lg font-bold text-gray-900">{prediction.current}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 mb-1">Predicted</p>
                        <p className="text-lg font-bold text-green-600">{prediction.predicted}</p>
                      </div>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-gray-600">{prediction.timeframe}</span>
                      <Progress value={prediction.confidence} className="w-20 h-2" />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Sentiment Analysis and Content Optimization */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="grid grid-cols-1 lg:grid-cols-2 gap-6"
        >
          {/* Sentiment Analysis */}
          <Card className="bg-white border border-gray-200">
            <CardHeader>
              <CardTitle className="text-xl font-bold text-gray-900 flex items-center">
                <MessageCircle className="h-5 w-5 mr-2 text-blue-600" />
                AI Sentiment Analysis
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {sentimentAnalysis.map((platform, index) => (
                  <div key={index} className="p-3 border border-gray-200 rounded-lg">
                    <div className="flex justify-between items-center mb-2">
                      <span className="font-medium text-gray-900">{platform.platform}</span>
                      <div className="flex space-x-2">
                        <Badge className="bg-green-100 text-green-800 text-xs">
                          {platform.positive}% Positive
                        </Badge>
                        <Badge className="bg-red-100 text-red-800 text-xs">
                          {platform.negative}% Negative
                        </Badge>
                      </div>
                    </div>
                    <div className="flex space-x-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div 
                        className="bg-green-500" 
                        style={{ width: `${platform.positive}%` }}
                      ></div>
                      <div 
                        className="bg-yellow-500" 
                        style={{ width: `${platform.neutral}%` }}
                      ></div>
                      <div 
                        className="bg-red-500" 
                        style={{ width: `${platform.negative}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Content Optimization */}
          <Card className="bg-white border border-gray-200">
            <CardHeader>
              <CardTitle className="text-xl font-bold text-gray-900 flex items-center">
                <Target className="h-5 w-5 mr-2 text-green-600" />
                AI Content Optimization
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {contentOptimization.map((item, index) => (
                  <div key={index} className="p-3 bg-gray-50 rounded-lg">
                    <div className="flex justify-between items-center mb-2">
                      <span className="font-medium text-gray-900">{item.category}</span>
                      <Badge className="bg-blue-100 text-blue-800">
                        {item.improvement} improvement
                      </Badge>
                    </div>
                    <div className="flex items-center space-x-4 mb-2">
                      <div className="flex-1">
                        <div className="flex justify-between text-xs text-gray-600 mb-1">
                          <span>Current: {item.currentScore}%</span>
                          <span>Optimized: {item.optimizedScore}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-gradient-to-r from-blue-500 to-green-500 h-2 rounded-full"
                            style={{ width: `${item.optimizedScore}%` }}
                          ></div>
                        </div>
                      </div>
                    </div>
                    <div className="text-xs text-gray-600">
                      <span className="font-medium">Top suggestions:</span> {item.recommendations.join(', ')}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* AI Insights */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Card className="bg-white border border-gray-200">
            <CardHeader>
              <CardTitle className="text-xl font-bold text-gray-900 flex items-center">
                <Brain className="h-5 w-5 mr-2 text-purple-600" />
                AI-Generated Insights & Recommendations
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {aiInsights.map((insight, index) => (
                  <div key={index} className={`p-4 rounded-lg border ${getInsightColor(insight.type)}`}>
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center space-x-2">
                        {getInsightIcon(insight.type)}
                        <span className="font-semibold text-gray-900">{insight.title}</span>
                      </div>
                      <div className="flex space-x-2">
                        <Badge variant="outline" className={`text-xs ${
                          insight.impact === 'High' ? 'border-red-300 text-red-700' :
                          insight.impact === 'Medium' ? 'border-yellow-300 text-yellow-700' :
                          'border-green-300 text-green-700'
                        }`}>
                          {insight.impact} Impact
                        </Badge>
                        <Badge variant="outline" className="text-xs border-gray-300 text-gray-700">
                          {insight.confidence}% confidence
                        </Badge>
                      </div>
                    </div>
                    <p className="text-sm text-gray-700 mb-2">{insight.description}</p>
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-gray-600">Effort: {insight.effort}</span>
                      <Button size="sm" variant="outline" className="text-xs">
                        Apply Suggestion
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Competitor Intelligence */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <Card className="bg-white border border-gray-200">
            <CardHeader>
              <CardTitle className="text-xl font-bold text-gray-900 flex items-center">
                <Eye className="h-5 w-5 mr-2 text-red-600" />
                Competitive Intelligence Dashboard
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="text-left py-3 px-4 text-gray-800 font-semibold">Competitor</th>
                      <th className="text-left py-3 px-4 text-gray-800 font-semibold">Engagement Rate</th>
                      <th className="text-left py-3 px-4 text-gray-800 font-semibold">Growth Rate</th>
                      <th className="text-left py-3 px-4 text-gray-800 font-semibold">Content Gaps</th>
                      <th className="text-left py-3 px-4 text-gray-800 font-semibold">Opportunities</th>
                    </tr>
                  </thead>
                  <tbody>
                    {competitorIntelligence.map((competitor, index) => (
                      <tr key={index} className="border-b border-gray-100 hover:bg-gray-50">
                        <td className="py-3 px-4 text-gray-900 font-medium">{competitor.competitor}</td>
                        <td className="py-3 px-4 text-gray-800">{competitor.engagement}</td>
                        <td className="py-3 px-4 text-green-600 font-semibold">{competitor.growth}</td>
                        <td className="py-3 px-4">
                          <div className="flex flex-wrap gap-1">
                            {competitor.contentGaps.map((gap, gapIndex) => (
                              <Badge key={gapIndex} variant="outline" className="text-xs">
                                {gap}
                              </Badge>
                            ))}
                          </div>
                        </td>
                        <td className="py-3 px-4 text-blue-600 text-sm">{competitor.opportunities}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Action Center */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <Card className="bg-gradient-to-r from-purple-50 to-blue-50 border border-purple-200">
            <CardHeader>
              <CardTitle className="text-xl font-bold text-gray-900 flex items-center">
                <CheckCircle className="h-5 w-5 mr-2 text-purple-600" />
                AI-Recommended Action Center
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 bg-white rounded-lg border border-purple-200">
                  <h4 className="font-semibold text-gray-900 mb-2">Immediate Actions</h4>
                  <ul className="space-y-2 text-sm text-gray-700">
                    <li className="flex items-center">
                      <CheckCircle className="h-4 w-4 text-green-600 mr-2" />
                      Optimize posting time to 6-8 PM
                    </li>
                    <li className="flex items-center">
                      <CheckCircle className="h-4 w-4 text-green-600 mr-2" />
                      Add 3 trending hashtags to next post
                    </li>
                    <li className="flex items-center">
                      <CheckCircle className="h-4 w-4 text-green-600 mr-2" />
                      Create carousel for product showcase
                    </li>
                  </ul>
                </div>
                <div className="p-4 bg-white rounded-lg border border-blue-200">
                  <h4 className="font-semibold text-gray-900 mb-2">This Week</h4>
                  <ul className="space-y-2 text-sm text-gray-700">
                    <li className="flex items-center">
                      <Clock className="h-4 w-4 text-blue-600 mr-2" />
                      Test video content format
                    </li>
                    <li className="flex items-center">
                      <Clock className="h-4 w-4 text-blue-600 mr-2" />
                      Engage with 18-24 age demographic
                    </li>
                    <li className="flex items-center">
                      <Clock className="h-4 w-4 text-blue-600 mr-2" />
                      Monitor competitor content gaps
                    </li>
                  </ul>
                </div>
                <div className="p-4 bg-white rounded-lg border border-orange-200">
                  <h4 className="font-semibold text-gray-900 mb-2">Long Term</h4>
                  <ul className="space-y-2 text-sm text-gray-700">
                    <li className="flex items-center">
                      <Calendar className="h-4 w-4 text-orange-600 mr-2" />
                      Develop video content strategy
                    </li>
                    <li className="flex items-center">
                      <Calendar className="h-4 w-4 text-orange-600 mr-2" />
                      Geographic audience expansion
                    </li>
                    <li className="flex items-center">
                      <Calendar className="h-4 w-4 text-orange-600 mr-2" />
                      Build brand voice consistency
                    </li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}