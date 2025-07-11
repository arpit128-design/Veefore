import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Progress } from '@/components/ui/progress';
import {
  BarChart3,
  TrendingUp,
  Users,
  Eye,
  MessageCircle,
  Heart,
  Share2,
  Calendar,
  Download,
  Filter,
  ArrowUp,
  ArrowDown,
  Star,
  Target,
  Zap,
  Globe,
  Sparkles,
  PieChart,
  Activity,
  Clock,
  Settings,
  FileText,
  TrendingDown,
  Trophy,
  Trending,
  BarChart,
  LineChart,
  DollarSign,
  MousePointer,
  Database,
  Trash2
} from 'lucide-react';

interface AnalyticsProps {
  currentPage?: string;
  onPageChange?: (page: string) => void;
}

const Analytics: React.FC<AnalyticsProps> = ({ 
  currentPage = 'overview', 
  onPageChange 
}) => {
  const [selectedView, setSelectedView] = useState('weekly');
  const [selectedAccount, setSelectedAccount] = useState('veefore');

  const renderOverview = () => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-6"
    >
      {/* Header Section with Gradient */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Analytics Overview</h1>
            <p className="text-blue-100 mt-1">Real-time insights and performance metrics</p>
          </div>
          <div className="bg-white/20 backdrop-blur-sm rounded-lg px-4 py-2">
            <span className="text-sm font-medium">Live Data</span>
            <div className="w-2 h-2 bg-green-400 rounded-full ml-2 inline-block animate-pulse"></div>
          </div>
        </div>
      </div>

      {/* Social Performance Score */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Social Performance Score</h3>
          <div className="flex items-center mb-4">
            <div className="text-3xl font-bold text-emerald-600">87</div>
            <div className="ml-3">
              <div className="text-sm text-gray-500">out of 100</div>
              <div className="text-sm text-emerald-600">+12 from last week</div>
            </div>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3">
            <div className="bg-gradient-to-r from-emerald-500 to-blue-500 h-3 rounded-full" style={{ width: '87%' }}></div>
          </div>
          <div className="grid grid-cols-3 gap-4 mt-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">94%</div>
              <div className="text-sm text-gray-500">Engagement</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">82%</div>
              <div className="text-sm text-gray-500">Reach</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-emerald-600">91%</div>
              <div className="text-sm text-gray-500">Growth</div>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Insights</h3>
          <div className="space-y-4">
            <div className="p-3 bg-emerald-50 rounded-lg border border-emerald-200">
              <div className="text-sm font-medium text-emerald-800">Top Performing Post</div>
              <div className="text-xs text-emerald-600">Video content +248% engagement</div>
            </div>
            <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
              <div className="text-sm font-medium text-blue-800">Best Posting Time</div>
              <div className="text-xs text-blue-600">Tuesdays at 2:00 PM</div>
            </div>
            <div className="p-3 bg-purple-50 rounded-lg border border-purple-200">
              <div className="text-sm font-medium text-purple-800">Trending Hashtag</div>
              <div className="text-xs text-purple-600">#ContentCreator +156% reach</div>
            </div>
          </div>
        </div>
      </div>

      {/* Modern Performance Score */}
      <Card className="border-0 shadow-lg bg-gradient-to-br from-white to-gray-50">
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center justify-between">
            <span className="text-xl font-bold text-gray-900">Social Performance Score</span>
            <div className="flex items-center space-x-2">
              <Badge className="bg-gradient-to-r from-emerald-500 to-cyan-500 text-white">
                <TrendingUp className="h-3 w-3 mr-1" />
                Excellent
              </Badge>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Score Circle */}
            <div className="flex flex-col items-center space-y-4">
              <div className="relative w-32 h-32">
                <div className="absolute inset-0 rounded-full bg-gradient-to-r from-cyan-100 to-purple-100"></div>
                <div className="absolute inset-2 rounded-full bg-white flex items-center justify-center">
                  <div className="text-center">
                    <div className="text-3xl font-bold bg-gradient-to-r from-cyan-600 to-purple-600 bg-clip-text text-transparent">
                      87
                    </div>
                    <div className="text-sm text-gray-500">/100</div>
                  </div>
                </div>
              </div>
              <div className="text-center">
                <p className="font-semibold text-gray-900">Strong Performance</p>
                <p className="text-sm text-gray-600">Your content is performing well across all platforms</p>
              </div>
            </div>

            {/* Performance Factors */}
            <div className="lg:col-span-2 space-y-4">
              <h4 className="font-semibold text-gray-900 uppercase text-xs tracking-wide mb-4">
                Performance Factors (Last 7 Days)
              </h4>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center space-x-3 bg-white p-3 rounded-lg border border-gray-200">
                  <Eye className="h-5 w-5 text-cyan-600" />
                  <div>
                    <p className="font-medium text-gray-900">Reach</p>
                    <p className="text-sm text-gray-600">2.4K views</p>
                  </div>
                  <ArrowUp className="h-4 w-4 text-emerald-500 ml-auto" />
                </div>

                <div className="flex items-center space-x-3 bg-white p-3 rounded-lg border border-gray-200">
                  <Heart className="h-5 w-5 text-pink-600" />
                  <div>
                    <p className="font-medium text-gray-900">Engagement</p>
                    <p className="text-sm text-gray-600">8.7% rate</p>
                  </div>
                  <ArrowUp className="h-4 w-4 text-emerald-500 ml-auto" />
                </div>

                <div className="flex items-center space-x-3 bg-white p-3 rounded-lg border border-gray-200">
                  <Users className="h-5 w-5 text-purple-600" />
                  <div>
                    <p className="font-medium text-gray-900">Followers</p>
                    <p className="text-sm text-gray-600">+47 this week</p>
                  </div>
                  <ArrowUp className="h-4 w-4 text-emerald-500 ml-auto" />
                </div>

                <div className="flex items-center space-x-3 bg-white p-3 rounded-lg border border-gray-200">
                  <Share2 className="h-5 w-5 text-emerald-600" />
                  <div>
                    <p className="font-medium text-gray-900">Shares</p>
                    <p className="text-sm text-gray-600">234 total</p>
                  </div>
                  <ArrowUp className="h-4 w-4 text-emerald-500 ml-auto" />
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Modern Insights Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="border-0 shadow-lg bg-gradient-to-br from-cyan-50 to-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="p-2 bg-cyan-100 rounded-lg">
                <Eye className="h-6 w-6 text-cyan-600" />
              </div>
              <Badge variant="secondary" className="bg-cyan-100 text-cyan-700">
                +24%
              </Badge>
            </div>
            <h3 className="text-2xl font-bold text-gray-900">2,847</h3>
            <p className="text-sm text-gray-600">Total Impressions</p>
            <Progress value={75} className="mt-3 h-2" />
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg bg-gradient-to-br from-purple-50 to-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="p-2 bg-purple-100 rounded-lg">
                <Heart className="h-6 w-6 text-purple-600" />
              </div>
              <Badge variant="secondary" className="bg-purple-100 text-purple-700">
                +18%
              </Badge>
            </div>
            <h3 className="text-2xl font-bold text-gray-900">456</h3>
            <p className="text-sm text-gray-600">Total Engagements</p>
            <Progress value={68} className="mt-3 h-2" />
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg bg-gradient-to-br from-emerald-50 to-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="p-2 bg-emerald-100 rounded-lg">
                <Users className="h-6 w-6 text-emerald-600" />
              </div>
              <Badge variant="secondary" className="bg-emerald-100 text-emerald-700">
                +12%
              </Badge>
            </div>
            <h3 className="text-2xl font-bold text-gray-900">1,234</h3>
            <p className="text-sm text-gray-600">New Followers</p>
            <Progress value={85} className="mt-3 h-2" />
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg bg-gradient-to-br from-pink-50 to-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="p-2 bg-pink-100 rounded-lg">
                <Star className="h-6 w-6 text-pink-600" />
              </div>
              <Badge variant="secondary" className="bg-pink-100 text-pink-700">
                +31%
              </Badge>
            </div>
            <h3 className="text-2xl font-bold text-gray-900">8.7%</h3>
            <p className="text-sm text-gray-600">Engagement Rate</p>
            <Progress value={92} className="mt-3 h-2" />
          </CardContent>
        </Card>
      </div>

      {/* AI-Powered Recommendations - Completely White Background */}
      <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-6" style={{ backgroundColor: '#ffffff !important' }}>
        <div className="flex items-center mb-6">
          <Zap className="h-5 w-5 text-blue-600 mr-2" />
          <h3 className="text-lg font-semibold text-gray-900">AI-Powered Recommendations</h3>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div className="flex items-start space-x-3 p-4 bg-white border border-cyan-200 rounded-lg" style={{ backgroundColor: '#ffffff !important' }}>
              <Target className="h-5 w-5 text-cyan-600 mt-1" />
              <div>
                <h4 className="font-semibold text-gray-900">Optimize Posting Times</h4>
                <p className="text-sm text-gray-600">Your audience is most active between 9-11 AM and 7-9 PM.</p>
                <Button size="sm" className="mt-2 bg-cyan-600 hover:bg-cyan-700 text-white">
                  View Best Times
                </Button>
              </div>
            </div>

            <div className="flex items-start space-x-3 p-4 bg-white border border-purple-200 rounded-lg" style={{ backgroundColor: '#ffffff !important' }}>
              <Sparkles className="h-5 w-5 text-purple-600 mt-1" />
              <div>
                <h4 className="font-semibold text-gray-900">Content Performance</h4>
                <p className="text-sm text-gray-600">Video content gets 3x more engagement than static posts.</p>
                <Button size="sm" className="mt-2 bg-purple-600 hover:bg-purple-700 text-white">
                  Create Video
                </Button>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-start space-x-3 p-4 bg-white border border-emerald-200 rounded-lg" style={{ backgroundColor: '#ffffff !important' }}>
              <Globe className="h-5 w-5 text-emerald-600 mt-1" />
              <div>
                <h4 className="font-semibold text-gray-900">Audience Growth</h4>
                <p className="text-sm text-gray-600">Use trending hashtags to reach 40% more potential followers.</p>
                <Button size="sm" className="mt-2 bg-emerald-600 hover:bg-emerald-700 text-white">
                  Explore Trends
                </Button>
              </div>
            </div>

            <div className="flex items-start space-x-3 p-4 bg-white border border-blue-200 rounded-lg" style={{ backgroundColor: '#ffffff !important' }}>
              <Activity className="h-5 w-5 text-blue-600 mt-1" />
              <div>
                <h4 className="font-semibold text-gray-900">Engagement Strategy</h4>
                <p className="text-sm text-gray-600">Respond to comments within 2 hours for better reach.</p>
                <Button size="sm" className="mt-2 bg-blue-600 hover:bg-blue-700 text-white">
                  Set Alerts
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );

  const renderSocialInsights = () => (
    <div className="space-y-6">
      <Card className="border-0 shadow-lg">
        <CardHeader>
          <CardTitle>Platform Performance Breakdown</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Instagram */}
            <div className="p-4 border border-gray-200 rounded-lg">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-8 h-8 bg-gradient-to-r from-pink-500 to-purple-600 rounded-lg"></div>
                <h3 className="font-semibold">Instagram</h3>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Followers</span>
                  <span className="font-medium">9</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Engagement</span>
                  <span className="font-medium">12.5%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Reach</span>
                  <span className="font-medium">847</span>
                </div>
              </div>
            </div>

            {/* YouTube */}
            <div className="p-4 border border-gray-200 rounded-lg">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-8 h-8 bg-red-600 rounded-lg"></div>
                <h3 className="font-semibold">YouTube</h3>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Subscribers</span>
                  <span className="font-medium">78</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Views</span>
                  <span className="font-medium">1.2K</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Watch Time</span>
                  <span className="font-medium">45m</span>
                </div>
              </div>
            </div>

            {/* Twitter */}
            <div className="p-4 border border-gray-200 rounded-lg">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-8 h-8 bg-sky-500 rounded-lg"></div>
                <h3 className="font-semibold">Twitter</h3>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Followers</span>
                  <span className="font-medium">156</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Impressions</span>
                  <span className="font-medium">3.4K</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Engagement</span>
                  <span className="font-medium">6.8%</span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderReports = () => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-6"
    >
      {/* Header */}
      <div className="bg-gradient-to-r from-emerald-600 to-teal-600 rounded-xl p-6 text-white">
        <h1 className="text-2xl font-bold">All Reports</h1>
        <p className="text-emerald-100 mt-1">Comprehensive analytics reports and custom insights</p>
      </div>

      {/* Quick Report Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-white border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-blue-100 rounded-lg">
                <BarChart3 className="h-6 w-6 text-blue-600" />
              </div>
              <Button size="sm" variant="outline">Generate</Button>
            </div>
            <h3 className="font-semibold text-gray-900">Weekly Performance</h3>
            <p className="text-sm text-gray-600 mt-2">Complete overview of last 7 days activity</p>
          </CardContent>
        </Card>

        <Card className="bg-white border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-purple-100 rounded-lg">
                <TrendingUp className="h-6 w-6 text-purple-600" />
              </div>
              <Button size="sm" variant="outline">Generate</Button>
            </div>
            <h3 className="font-semibold text-gray-900">Growth Analysis</h3>
            <p className="text-sm text-gray-600 mt-2">Detailed follower and engagement growth</p>
          </CardContent>
        </Card>

        <Card className="bg-white border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-emerald-100 rounded-lg">
                <PieChart className="h-6 w-6 text-emerald-600" />
              </div>
              <Button size="sm" variant="outline">Generate</Button>
            </div>
            <h3 className="font-semibold text-gray-900">Content Breakdown</h3>
            <p className="text-sm text-gray-600 mt-2">Post types and performance analysis</p>
          </CardContent>
        </Card>
      </div>

      {/* Recent Reports */}
      <Card className="bg-white border border-gray-200 shadow-sm">
        <CardHeader>
          <CardTitle className="flex items-center">
            <FileText className="h-5 w-5 text-gray-600 mr-2" />
            Recent Reports
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[
              { name: "January 2025 Performance Report", date: "Jan 31, 2025", size: "2.4 MB", type: "Monthly" },
              { name: "Holiday Campaign Analysis", date: "Jan 15, 2025", size: "1.8 MB", type: "Campaign" },
              { name: "Q4 2024 Growth Summary", date: "Dec 31, 2024", size: "3.1 MB", type: "Quarterly" }
            ].map((report, index) => (
              <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center">
                    <FileText className="h-5 w-5 text-emerald-600" />
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900">{report.name}</h4>
                    <p className="text-sm text-gray-500">{report.date} • {report.size} • {report.type}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Button size="sm" variant="ghost">View</Button>
                  <Button size="sm" variant="ghost">
                    <Download className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );

  const renderPostPerformance = () => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-6"
    >
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl p-6 text-white">
        <h1 className="text-2xl font-bold">Post Performance Analysis</h1>
        <p className="text-purple-100 mt-1">Detailed post performance metrics and optimization suggestions</p>
      </div>

      {/* Top Performing Posts */}
      <Card className="bg-white border border-gray-200 shadow-sm">
        <CardHeader>
          <CardTitle className="flex items-center">
            <Trophy className="h-5 w-5 text-purple-600 mr-2" />
            Top Performing Posts (Last 30 Days)
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[
              { 
                content: "Tips for creating engaging social media content",
                platform: "Instagram",
                engagement: "12.4%",
                reach: "2.1K",
                likes: 156,
                comments: 23,
                date: "2 days ago"
              },
              {
                content: "Behind the scenes of our content creation process",
                platform: "YouTube",
                engagement: "8.7%",
                reach: "1.8K",
                likes: 89,
                comments: 45,
                date: "5 days ago"
              },
              {
                content: "Quick tutorial: Setting up automated posting",
                platform: "Twitter",
                engagement: "6.2%",
                reach: "950",
                likes: 67,
                comments: 12,
                date: "1 week ago"
              }
            ].map((post, index) => (
              <div key={index} className="p-4 border border-gray-200 rounded-lg">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-900 mb-2">{post.content}</h4>
                    <div className="flex items-center space-x-4 text-sm text-gray-500">
                      <span className="flex items-center">
                        <div className={`w-3 h-3 rounded mr-2 ${
                          post.platform === 'Instagram' ? 'bg-gradient-to-r from-pink-500 to-purple-600' :
                          post.platform === 'YouTube' ? 'bg-red-600' : 'bg-sky-500'
                        }`}></div>
                        {post.platform}
                      </span>
                      <span>{post.date}</span>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4 text-right">
                    <div>
                      <div className="text-sm font-medium text-purple-600">{post.engagement}</div>
                      <div className="text-xs text-gray-500">Engagement</div>
                    </div>
                    <div>
                      <div className="text-sm font-medium text-emerald-600">{post.reach}</div>
                      <div className="text-xs text-gray-500">Reach</div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Performance Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="bg-white border border-gray-200 shadow-sm">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-2">
              <Heart className="h-5 w-5 text-pink-600" />
              <ArrowUp className="h-4 w-4 text-emerald-500" />
            </div>
            <div className="text-2xl font-bold text-gray-900">8.7%</div>
            <div className="text-sm text-gray-500">Avg. Engagement Rate</div>
          </CardContent>
        </Card>

        <Card className="bg-white border border-gray-200 shadow-sm">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-2">
              <Eye className="h-5 w-5 text-blue-600" />
              <ArrowUp className="h-4 w-4 text-emerald-500" />
            </div>
            <div className="text-2xl font-bold text-gray-900">2.4K</div>
            <div className="text-sm text-gray-500">Avg. Reach</div>
          </CardContent>
        </Card>

        <Card className="bg-white border border-gray-200 shadow-sm">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-2">
              <MessageCircle className="h-5 w-5 text-emerald-600" />
              <ArrowUp className="h-4 w-4 text-emerald-500" />
            </div>
            <div className="text-2xl font-bold text-gray-900">27</div>
            <div className="text-sm text-gray-500">Avg. Comments</div>
          </CardContent>
        </Card>

        <Card className="bg-white border border-gray-200 shadow-sm">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-2">
              <Share2 className="h-5 w-5 text-purple-600" />
              <ArrowUp className="h-4 w-4 text-emerald-500" />
            </div>
            <div className="text-2xl font-bold text-gray-900">156</div>
            <div className="text-sm text-gray-500">Total Shares</div>
          </CardContent>
        </Card>
      </div>
    </motion.div>
  );

  const renderBestTimes = () => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-6"
    >
      {/* Header */}
      <div className="bg-gradient-to-r from-cyan-600 to-blue-600 rounded-xl p-6 text-white">
        <h1 className="text-2xl font-bold">Best Times to Post</h1>
        <p className="text-cyan-100 mt-1">AI-powered optimal posting time recommendations based on your audience behavior</p>
      </div>

      {/* Optimal Times Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-white border border-gray-200 shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center text-lg">
              <Clock className="h-5 w-5 text-cyan-600 mr-2" />
              Monday - Friday
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center p-3 bg-cyan-50 rounded-lg">
                <span className="font-medium">9:00 AM</span>
                <Badge className="bg-cyan-600 text-white">Peak</Badge>
              </div>
              <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg">
                <span className="font-medium">12:30 PM</span>
                <Badge variant="secondary">Good</Badge>
              </div>
              <div className="flex justify-between items-center p-3 bg-purple-50 rounded-lg">
                <span className="font-medium">7:00 PM</span>
                <Badge className="bg-purple-600 text-white">Peak</Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white border border-gray-200 shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center text-lg">
              <Calendar className="h-5 w-5 text-emerald-600 mr-2" />
              Weekends
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center p-3 bg-emerald-50 rounded-lg">
                <span className="font-medium">10:00 AM</span>
                <Badge className="bg-emerald-600 text-white">Peak</Badge>
              </div>
              <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg">
                <span className="font-medium">2:00 PM</span>
                <Badge variant="secondary">Good</Badge>
              </div>
              <div className="flex justify-between items-center p-3 bg-pink-50 rounded-lg">
                <span className="font-medium">8:30 PM</span>
                <Badge className="bg-pink-600 text-white">Peak</Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white border border-gray-200 shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center text-lg">
              <Target className="h-5 w-5 text-purple-600 mr-2" />
              Platform Specific
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="p-3 border border-gray-200 rounded-lg">
                <div className="flex items-center justify-between mb-1">
                  <span className="font-medium text-sm">Instagram</span>
                  <span className="text-xs text-gray-500">11 AM - 1 PM</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-gradient-to-r from-pink-500 to-purple-600 h-2 rounded-full" style={{ width: '85%' }}></div>
                </div>
              </div>
              <div className="p-3 border border-gray-200 rounded-lg">
                <div className="flex items-center justify-between mb-1">
                  <span className="font-medium text-sm">YouTube</span>
                  <span className="text-xs text-gray-500">2 PM - 4 PM</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-red-600 h-2 rounded-full" style={{ width: '92%' }}></div>
                </div>
              </div>
              <div className="p-3 border border-gray-200 rounded-lg">
                <div className="flex items-center justify-between mb-1">
                  <span className="font-medium text-sm">Twitter</span>
                  <span className="text-xs text-gray-500">9 AM - 10 AM</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-sky-500 h-2 rounded-full" style={{ width: '78%' }}></div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Weekly Heatmap */}
      <Card className="bg-white border border-gray-200 shadow-sm">
        <CardHeader>
          <CardTitle>Weekly Engagement Heatmap</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-7 gap-2">
            {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day, dayIndex) => (
              <div key={day} className="text-center">
                <div className="text-sm font-medium text-gray-700 mb-2">{day}</div>
                <div className="space-y-1">
                  {Array.from({ length: 24 }, (_, hour) => {
                    const intensity = Math.random();
                    return (
                      <div
                        key={hour}
                        className={`h-3 rounded ${
                          intensity > 0.7 ? 'bg-emerald-500' :
                          intensity > 0.4 ? 'bg-emerald-300' :
                          intensity > 0.2 ? 'bg-emerald-100' : 'bg-gray-100'
                        }`}
                        title={`${hour}:00 - ${intensity > 0.7 ? 'High' : intensity > 0.4 ? 'Medium' : 'Low'} engagement`}
                      />
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
          <div className="flex items-center justify-center mt-4 space-x-4 text-sm text-gray-500">
            <div className="flex items-center">
              <div className="w-3 h-3 bg-gray-100 rounded mr-2"></div>
              <span>Low</span>
            </div>
            <div className="flex items-center">
              <div className="w-3 h-3 bg-emerald-300 rounded mr-2"></div>
              <span>Medium</span>
            </div>
            <div className="flex items-center">
              <div className="w-3 h-3 bg-emerald-500 rounded mr-2"></div>
              <span>High</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );

  const renderIndustry = () => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-6"
    >
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl p-6 text-white">
        <h1 className="text-2xl font-bold">Industry Benchmarks</h1>
        <p className="text-blue-100 mt-1">Compare your performance against industry standards and competitors</p>
      </div>

      {/* Benchmark Comparison Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="bg-white border border-gray-200 shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center">
              <TrendingUp className="h-5 w-5 text-blue-600 mr-2" />
              Engagement Rate Benchmark
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center p-3 bg-emerald-50 rounded-lg">
                <span className="font-medium">Your Performance</span>
                <span className="text-emerald-600 font-bold">8.7%</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                <span className="font-medium">Industry Average</span>
                <span className="text-gray-600 font-bold">6.2%</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg">
                <span className="font-medium">Top Performers</span>
                <span className="text-blue-600 font-bold">12.4%</span>
              </div>
              <Badge className="bg-emerald-600 text-white w-full justify-center py-2">
                Above Industry Average (+2.5%)
              </Badge>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white border border-gray-200 shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Users className="h-5 w-5 text-purple-600 mr-2" />
              Follower Growth Rate
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center p-3 bg-purple-50 rounded-lg">
                <span className="font-medium">Your Performance</span>
                <span className="text-purple-600 font-bold">12.3%</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                <span className="font-medium">Industry Average</span>
                <span className="text-gray-600 font-bold">8.7%</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg">
                <span className="font-medium">Top Performers</span>
                <span className="text-blue-600 font-bold">18.9%</span>
              </div>
              <Badge className="bg-purple-600 text-white w-full justify-center py-2">
                Above Industry Average (+3.6%)
              </Badge>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Platform Comparison */}
      <Card className="bg-white border border-gray-200 shadow-sm">
        <CardHeader>
          <CardTitle>Platform Performance vs Industry</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {[
              { platform: 'Instagram', your: 8.7, industry: 6.2, color: 'from-pink-500 to-purple-600' },
              { platform: 'YouTube', your: 12.4, industry: 9.8, color: 'bg-red-600' },
              { platform: 'Twitter', your: 5.3, industry: 4.1, color: 'bg-sky-500' },
              { platform: 'LinkedIn', your: 7.8, industry: 5.9, color: 'bg-blue-600' }
            ].map((data, index) => (
              <div key={index} className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="font-medium">{data.platform}</span>
                  <div className="flex items-center space-x-4">
                    <span className="text-sm text-gray-500">You: {data.your}%</span>
                    <span className="text-sm text-gray-500">Industry: {data.industry}%</span>
                  </div>
                </div>
                <div className="relative">
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div 
                      className={`${data.color.startsWith('from-') ? `bg-gradient-to-r ${data.color}` : data.color} h-3 rounded-full transition-all duration-300`}
                      style={{ width: `${(data.your / 20) * 100}%` }}
                    ></div>
                  </div>
                  <div 
                    className="absolute top-0 h-3 w-1 bg-gray-400 rounded"
                    style={{ left: `${(data.industry / 20) * 100}%` }}
                    title="Industry Average"
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );

  const renderCompetitive = () => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-6"
    >
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-xl p-6 text-white">
        <h1 className="text-2xl font-bold">Competitive Analysis</h1>
        <p className="text-indigo-100 mt-1">Monitor competitor performance and identify growth opportunities</p>
      </div>

      {/* Competitor Overview */}
      <Card className="bg-white border border-gray-200 shadow-sm">
        <CardHeader>
          <CardTitle className="flex items-center">
            <Target className="h-5 w-5 text-indigo-600 mr-2" />
            Competitor Performance Overview
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[
              { 
                name: '@socialmedia_expert', 
                followers: '45.2K', 
                engagement: '9.3%', 
                posts: '156',
                growth: '+12%',
                status: 'growing'
              },
              { 
                name: '@content_master', 
                followers: '38.7K', 
                engagement: '7.8%', 
                posts: '203',
                growth: '+8%',
                status: 'stable'
              },
              { 
                name: '@digital_guru', 
                followers: '52.1K', 
                engagement: '6.4%', 
                posts: '89',
                growth: '+3%',
                status: 'declining'
              }
            ].map((competitor, index) => (
              <div key={index} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold">
                    {competitor.name.charAt(1).toUpperCase()}
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">{competitor.name}</h4>
                    <p className="text-sm text-gray-500">{competitor.followers} followers • {competitor.posts} posts</p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4 text-right">
                  <div>
                    <div className="text-sm font-medium text-indigo-600">{competitor.engagement}</div>
                    <div className="text-xs text-gray-500">Engagement</div>
                  </div>
                  <div>
                    <div className={`text-sm font-medium ${
                      competitor.status === 'growing' ? 'text-emerald-600' :
                      competitor.status === 'stable' ? 'text-blue-600' : 'text-red-600'
                    }`}>
                      {competitor.growth}
                    </div>
                    <div className="text-xs text-gray-500">Growth</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Content Strategy Comparison */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="bg-white border border-gray-200 shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center">
              <BarChart3 className="h-5 w-5 text-purple-600 mr-2" />
              Content Type Analysis
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { type: 'Videos', you: 35, competitors: 42, color: 'bg-purple-600' },
                { type: 'Images', you: 50, competitors: 38, color: 'bg-blue-600' },
                { type: 'Carousels', you: 15, competitors: 20, color: 'bg-emerald-600' }
              ].map((content, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex justify-between">
                    <span className="font-medium">{content.type}</span>
                    <div className="text-sm text-gray-500">
                      You: {content.you}% | Competitors: {content.competitors}%
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <div className="flex-1">
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className={`${content.color} h-2 rounded-full`}
                          style={{ width: `${content.you}%` }}
                        ></div>
                      </div>
                    </div>
                    <div className="flex-1">
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-gray-400 h-2 rounded-full"
                          style={{ width: `${content.competitors}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white border border-gray-200 shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Clock className="h-5 w-5 text-emerald-600 mr-2" />
              Posting Frequency
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="text-center p-4 bg-emerald-50 rounded-lg">
                <div className="text-2xl font-bold text-emerald-600">12</div>
                <div className="text-sm text-gray-600">Your Posts/Week</div>
              </div>
              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <div className="text-2xl font-bold text-gray-600">18</div>
                <div className="text-sm text-gray-600">Competitor Average</div>
              </div>
              <Badge variant="outline" className="w-full justify-center py-2 border-emerald-200 text-emerald-700">
                Opportunity: Increase posting frequency by 50%
              </Badge>
            </div>
          </CardContent>
        </Card>
      </div>
    </motion.div>
  );

  const renderAdvertising = () => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-6"
    >
      {/* Header */}
      <div className="bg-gradient-to-r from-emerald-600 to-cyan-600 rounded-xl p-6 text-white">
        <h1 className="text-2xl font-bold">Advertising Performance</h1>
        <p className="text-emerald-100 mt-1">Track and optimize your social media advertising campaigns</p>
      </div>

      {/* Campaign Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="bg-white border border-gray-200 shadow-sm">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-2">
              <DollarSign className="h-5 w-5 text-emerald-600" />
              <ArrowUp className="h-4 w-4 text-emerald-500" />
            </div>
            <div className="text-2xl font-bold text-gray-900">₹12,450</div>
            <div className="text-sm text-gray-500">Total Ad Spend</div>
            <div className="text-xs text-emerald-600 mt-1">+15% from last month</div>
          </CardContent>
        </Card>

        <Card className="bg-white border border-gray-200 shadow-sm">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-2">
              <Eye className="h-5 w-5 text-blue-600" />
              <ArrowUp className="h-4 w-4 text-emerald-500" />
            </div>
            <div className="text-2xl font-bold text-gray-900">245K</div>
            <div className="text-sm text-gray-500">Impressions</div>
            <div className="text-xs text-emerald-600 mt-1">+23% from last month</div>
          </CardContent>
        </Card>

        <Card className="bg-white border border-gray-200 shadow-sm">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-2">
              <MousePointer className="h-5 w-5 text-purple-600" />
              <ArrowUp className="h-4 w-4 text-emerald-500" />
            </div>
            <div className="text-2xl font-bold text-gray-900">3.2%</div>
            <div className="text-sm text-gray-500">Click-through Rate</div>
            <div className="text-xs text-emerald-600 mt-1">+0.8% from last month</div>
          </CardContent>
        </Card>

        <Card className="bg-white border border-gray-200 shadow-sm">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-2">
              <TrendingUp className="h-5 w-5 text-cyan-600" />
              <ArrowUp className="h-4 w-4 text-emerald-500" />
            </div>
            <div className="text-2xl font-bold text-gray-900">4.8x</div>
            <div className="text-sm text-gray-500">ROAS</div>
            <div className="text-xs text-emerald-600 mt-1">+1.2x from last month</div>
          </CardContent>
        </Card>
      </div>

      {/* Active Campaigns */}
      <Card className="bg-white border border-gray-200 shadow-sm">
        <CardHeader>
          <CardTitle className="flex items-center">
            <Zap className="h-5 w-5 text-emerald-600 mr-2" />
            Active Campaigns
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[
              {
                name: 'Summer Collection Launch',
                platform: 'Instagram',
                budget: '₹5,000',
                spent: '₹3,240',
                impressions: '89.2K',
                clicks: '2,847',
                conversions: '156',
                status: 'active'
              },
              {
                name: 'Brand Awareness Campaign',
                platform: 'Facebook',
                budget: '₹3,500',
                spent: '₹3,500',
                impressions: '125.6K',
                clicks: '4,132',
                conversions: '89',
                status: 'completed'
              },
              {
                name: 'Video Ad Series',
                platform: 'YouTube',
                budget: '₹4,000',
                spent: '₹1,890',
                impressions: '30.4K',
                clicks: '967',
                conversions: '45',
                status: 'active'
              }
            ].map((campaign, index) => (
              <div key={index} className="p-4 border border-gray-200 rounded-lg">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <h4 className="font-semibold text-gray-900">{campaign.name}</h4>
                      <Badge className={`${
                        campaign.status === 'active' ? 'bg-emerald-100 text-emerald-700' : 'bg-gray-100 text-gray-700'
                      }`}>
                        {campaign.status}
                      </Badge>
                    </div>
                    <div className="flex items-center space-x-4 text-sm text-gray-500">
                      <span className="flex items-center">
                        <div className={`w-3 h-3 rounded mr-2 ${
                          campaign.platform === 'Instagram' ? 'bg-gradient-to-r from-pink-500 to-purple-600' :
                          campaign.platform === 'Facebook' ? 'bg-blue-600' : 'bg-red-600'
                        }`}></div>
                        {campaign.platform}
                      </span>
                      <span>Budget: {campaign.budget}</span>
                      <span>Spent: {campaign.spent}</span>
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-4 text-right">
                    <div>
                      <div className="text-sm font-medium text-blue-600">{campaign.impressions}</div>
                      <div className="text-xs text-gray-500">Impressions</div>
                    </div>
                    <div>
                      <div className="text-sm font-medium text-purple-600">{campaign.clicks}</div>
                      <div className="text-xs text-gray-500">Clicks</div>
                    </div>
                    <div>
                      <div className="text-sm font-medium text-emerald-600">{campaign.conversions}</div>
                      <div className="text-xs text-gray-500">Conversions</div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* ROI Analysis */}
      <Card className="bg-white border border-gray-200 shadow-sm">
        <CardHeader>
          <CardTitle>Return on Investment Analysis</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center p-4 bg-emerald-50 rounded-lg">
              <div className="text-3xl font-bold text-emerald-600">₹59,760</div>
              <div className="text-sm text-gray-600 mt-1">Revenue Generated</div>
            </div>
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <div className="text-3xl font-bold text-blue-600">₹12,450</div>
              <div className="text-sm text-gray-600 mt-1">Total Investment</div>
            </div>
            <div className="text-center p-4 bg-purple-50 rounded-lg">
              <div className="text-3xl font-bold text-purple-600">4.8x</div>
              <div className="text-sm text-gray-600 mt-1">Return on Ad Spend</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );

  const renderSettings = () => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-6"
    >
      {/* Header */}
      <div className="bg-gradient-to-r from-gray-600 to-slate-600 rounded-xl p-6 text-white">
        <h1 className="text-2xl font-bold">Analytics Settings</h1>
        <p className="text-gray-100 mt-1">Configure your analytics preferences and data collection settings</p>
      </div>

      {/* Data Collection Settings */}
      <Card className="bg-white border border-gray-200 shadow-sm">
        <CardHeader>
          <CardTitle className="flex items-center">
            <Settings className="h-5 w-5 text-gray-600 mr-2" />
            Data Collection Preferences
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
            <div>
              <h4 className="font-semibold text-gray-900">Real-time Analytics</h4>
              <p className="text-sm text-gray-600">Get live updates for engagement metrics and follower changes</p>
            </div>
            <div className="w-11 h-6 bg-blue-600 rounded-full p-1 cursor-pointer">
              <div className="w-4 h-4 bg-white rounded-full ml-auto"></div>
            </div>
          </div>

          <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
            <div>
              <h4 className="font-semibold text-gray-900">Advanced Tracking</h4>
              <p className="text-sm text-gray-600">Track detailed user behavior and content performance</p>
            </div>
            <div className="w-11 h-6 bg-blue-600 rounded-full p-1 cursor-pointer">
              <div className="w-4 h-4 bg-white rounded-full ml-auto"></div>
            </div>
          </div>

          <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
            <div>
              <h4 className="font-semibold text-gray-900">Email Reports</h4>
              <p className="text-sm text-gray-600">Receive weekly analytics summaries via email</p>
            </div>
            <div className="w-11 h-6 bg-gray-300 rounded-full p-1 cursor-pointer">
              <div className="w-4 h-4 bg-white rounded-full"></div>
            </div>
          </div>

          <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
            <div>
              <h4 className="font-semibold text-gray-900">Data Export</h4>
              <p className="text-sm text-gray-600">Allow exporting analytics data to external tools</p>
            </div>
            <div className="w-11 h-6 bg-blue-600 rounded-full p-1 cursor-pointer">
              <div className="w-4 h-4 bg-white rounded-full ml-auto"></div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Report Preferences */}
      <Card className="bg-white border border-gray-200 shadow-sm">
        <CardHeader>
          <CardTitle className="flex items-center">
            <FileText className="h-5 w-5 text-blue-600 mr-2" />
            Report Preferences
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Default Report Period</label>
            <select className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
              <option>Last 7 days</option>
              <option>Last 30 days</option>
              <option>Last 90 days</option>
              <option>Custom range</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Time Zone</label>
            <select className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
              <option>India Standard Time (IST)</option>
              <option>Pacific Standard Time (PST)</option>
              <option>Eastern Standard Time (EST)</option>
              <option>Coordinated Universal Time (UTC)</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Report Format</label>
            <select className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
              <option>PDF</option>
              <option>Excel (.xlsx)</option>
              <option>CSV</option>
              <option>JSON</option>
            </select>
          </div>
        </CardContent>
      </Card>

      {/* Data Retention */}
      <Card className="bg-white border border-gray-200 shadow-sm">
        <CardHeader>
          <CardTitle className="flex items-center">
            <Database className="h-5 w-5 text-purple-600 mr-2" />
            Data Retention & Privacy
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="p-4 bg-blue-50 rounded-lg">
            <h4 className="font-semibold text-blue-900 mb-2">Data Retention Period</h4>
            <p className="text-sm text-blue-700">Analytics data is retained for 24 months. After this period, aggregated data is kept for historical analysis.</p>
          </div>

          <div className="p-4 bg-emerald-50 rounded-lg">
            <h4 className="font-semibold text-emerald-900 mb-2">Privacy Compliance</h4>
            <p className="text-sm text-emerald-700">All data collection complies with GDPR, CCPA, and Indian data protection regulations.</p>
          </div>

          <div className="flex space-x-4">
            <Button variant="outline" className="flex-1">
              <Download className="h-4 w-4 mr-2" />
              Export My Data
            </Button>
            <Button variant="outline" className="flex-1 text-red-600 border-red-300 hover:bg-red-50">
              <Trash2 className="h-4 w-4 mr-2" />
              Delete All Data
            </Button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );

  const renderCurrentPage = () => {
    switch (currentPage) {
      case 'social-insights':
        return renderSocialInsights();
      case 'reports':
        return renderReports();
      case 'post-performance':
        return renderPostPerformance();
      case 'best-times':
        return renderBestTimes();
      case 'industry':
        return renderIndustry();
      case 'competitive':
        return renderCompetitive();
      case 'advertising':
        return renderAdvertising();
      case 'settings':
        return renderSettings();
      default:
        return renderOverview();
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="min-h-screen bg-white"
    >
      {/* Modern Header */}
      <div className="border-b border-gray-200 bg-white">
        <div className="flex items-center justify-between px-6 py-4">
          <div className="flex items-center space-x-4">
            <h1 className="text-2xl font-bold bg-gradient-to-r from-cyan-600 to-purple-600 bg-clip-text text-transparent">
              Analytics Studio
            </h1>
            <Badge variant="secondary" className="bg-gradient-to-r from-emerald-100 to-cyan-100 text-emerald-700 border-emerald-200">
              Real-time Insights
            </Badge>
          </div>
          
          <div className="flex items-center space-x-3">
            <Button variant="outline" size="sm" className="text-cyan-600 border-cyan-200 hover:bg-cyan-50">
              <Filter className="h-4 w-4 mr-2" />
              Filters
            </Button>
            <Button className="bg-gradient-to-r from-cyan-600 to-purple-600 text-white hover:from-cyan-700 hover:to-purple-700">
              <Download className="h-4 w-4 mr-2" />
              Export Report
            </Button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        {renderCurrentPage()}
      </div>
    </motion.div>
  );
};

export default Analytics;