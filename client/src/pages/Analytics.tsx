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
  TrendingDown
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
    <div className="space-y-6">
      {/* Modern Control Bar */}
      <div className="flex items-center justify-between bg-gradient-to-r from-gray-50 to-blue-50 rounded-xl p-4 border border-gray-200">
        <div className="flex items-center space-x-4">
          <Select value={selectedView} onValueChange={setSelectedView}>
            <SelectTrigger className="w-48 bg-white border-gray-300">
              <Calendar className="h-4 w-4 mr-2 text-cyan-600" />
              <SelectValue placeholder="Select time range" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="weekly">Last 7 days</SelectItem>
              <SelectItem value="monthly">Last 30 days</SelectItem>
              <SelectItem value="quarterly">Last 90 days</SelectItem>
              <SelectItem value="yearly">Last 12 months</SelectItem>
            </SelectContent>
          </Select>

          <Select value={selectedAccount} onValueChange={setSelectedAccount}>
            <SelectTrigger className="w-48 bg-white border-gray-300">
              <div className="flex items-center">
                <div className="w-6 h-6 bg-gradient-to-r from-cyan-500 to-purple-500 rounded-full mr-2 flex items-center justify-center text-white text-xs font-bold">
                  V
                </div>
                <SelectValue placeholder="Select account" />
              </div>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="veefore">VeeFore</SelectItem>
              <SelectItem value="personal">Personal Account</SelectItem>
              <SelectItem value="business">Business Account</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <span className="text-sm font-medium text-gray-600 bg-white px-3 py-2 rounded-lg border">
          Real-time data • Updated 2 min ago
        </span>
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

      {/* Modern Recommendations */}
      <Card className="border-0 shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center">
            <Zap className="h-5 w-5 text-purple-600 mr-2" />
            AI-Powered Recommendations
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="flex items-start space-x-3 p-4 bg-gradient-to-r from-cyan-50 to-blue-50 rounded-lg border-l-4 border-cyan-500">
                <Target className="h-5 w-5 text-cyan-600 mt-1" />
                <div>
                  <h4 className="font-semibold text-gray-900">Optimize Posting Times</h4>
                  <p className="text-sm text-gray-600">Your audience is most active between 9-11 AM and 7-9 PM.</p>
                  <Button size="sm" className="mt-2 bg-cyan-600 hover:bg-cyan-700">
                    View Best Times
                  </Button>
                </div>
              </div>

              <div className="flex items-start space-x-3 p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg border-l-4 border-purple-500">
                <Sparkles className="h-5 w-5 text-purple-600 mt-1" />
                <div>
                  <h4 className="font-semibold text-gray-900">Content Performance</h4>
                  <p className="text-sm text-gray-600">Video content gets 3x more engagement than static posts.</p>
                  <Button size="sm" className="mt-2 bg-purple-600 hover:bg-purple-700">
                    Create Video
                  </Button>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-start space-x-3 p-4 bg-gradient-to-r from-emerald-50 to-green-50 rounded-lg border-l-4 border-emerald-500">
                <Globe className="h-5 w-5 text-emerald-600 mt-1" />
                <div>
                  <h4 className="font-semibold text-gray-900">Audience Growth</h4>
                  <p className="text-sm text-gray-600">Use trending hashtags to reach 40% more potential followers.</p>
                  <Button size="sm" className="mt-2 bg-emerald-600 hover:bg-emerald-700">
                    Explore Trends
                  </Button>
                </div>
              </div>

              <div className="flex items-start space-x-3 p-4 bg-gradient-to-r from-orange-50 to-red-50 rounded-lg border-l-4 border-orange-500">
                <Activity className="h-5 w-5 text-orange-600 mt-1" />
                <div>
                  <h4 className="font-semibold text-gray-900">Engagement Strategy</h4>
                  <p className="text-sm text-gray-600">Respond to comments within 2 hours for better reach.</p>
                  <Button size="sm" className="mt-2 bg-orange-600 hover:bg-orange-700">
                    Set Alerts
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
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
    <div className="space-y-6">
      <Card className="border-0 shadow-lg">
        <CardHeader>
          <CardTitle>Custom Reports</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-600">Advanced reporting features coming soon. Create custom analytics reports tailored to your needs.</p>
        </CardContent>
      </Card>
    </div>
  );

  const renderPostPerformance = () => (
    <div className="space-y-6">
      <Card className="border-0 shadow-lg">
        <CardHeader>
          <CardTitle>Post Performance Analysis</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-600">Detailed post performance metrics and optimization suggestions.</p>
        </CardContent>
      </Card>
    </div>
  );

  const renderBestTimes = () => (
    <div className="space-y-6">
      <Card className="border-0 shadow-lg">
        <CardHeader>
          <CardTitle>Best Times to Post</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-600">AI-powered optimal posting time recommendations based on your audience behavior.</p>
        </CardContent>
      </Card>
    </div>
  );

  const renderIndustry = () => (
    <div className="space-y-6">
      <Card className="border-0 shadow-lg">
        <CardHeader>
          <CardTitle>Industry Benchmarks</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-600">Compare your performance against industry standards and competitors.</p>
        </CardContent>
      </Card>
    </div>
  );

  const renderCompetitive = () => (
    <div className="space-y-6">
      <Card className="border-0 shadow-lg">
        <CardHeader>
          <CardTitle>Competitive Analysis</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-600">Monitor competitor performance and identify growth opportunities.</p>
        </CardContent>
      </Card>
    </div>
  );

  const renderAdvertising = () => (
    <div className="space-y-6">
      <Card className="border-0 shadow-lg">
        <CardHeader>
          <CardTitle>Advertising Performance</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-600">Track and optimize your social media advertising campaigns.</p>
        </CardContent>
      </Card>
    </div>
  );

  const renderSettings = () => (
    <div className="space-y-6">
      <Card className="border-0 shadow-lg">
        <CardHeader>
          <CardTitle>Analytics Settings</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-600">Configure your analytics preferences and data collection settings.</p>
        </CardContent>
      </Card>
    </div>
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