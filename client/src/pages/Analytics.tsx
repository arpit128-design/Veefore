import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
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
  Info,
  ChevronDown,
  Settings
} from 'lucide-react';

const Analytics: React.FC = () => {
  const [selectedView, setSelectedView] = useState('weekly');
  const [selectedAccount, setSelectedAccount] = useState('metatraq');

  return (
    <motion.div 
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="min-h-screen bg-white"
    >
      {/* Main Content */}
      <div className="flex-1 p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-4">
            <h1 className="text-2xl font-semibold text-gray-900">Social score and insights</h1>
          </div>
          
          <div className="flex items-center space-x-3">
            <Button variant="outline" size="sm" className="text-blue-600 border-blue-200">
              <Calendar className="h-4 w-4 mr-2" />
              Want industry-specific data?
            </Button>
            <Button className="bg-orange-500 hover:bg-orange-600 text-white">
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
          </div>
        </div>

        {/* Controls */}
        <div className="flex items-center space-x-4 mb-8">
          <Select value={selectedView} onValueChange={setSelectedView}>
            <SelectTrigger className="w-40">
              <Calendar className="h-4 w-4 mr-2" />
              <SelectValue placeholder="Select view" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="weekly">Weekly overview</SelectItem>
              <SelectItem value="monthly">Monthly overview</SelectItem>
              <SelectItem value="quarterly">Quarterly overview</SelectItem>
            </SelectContent>
          </Select>

          <Select value={selectedAccount} onValueChange={setSelectedAccount}>
            <SelectTrigger className="w-40">
              <div className="flex items-center">
                <div className="w-6 h-6 bg-purple-500 rounded-full mr-2 flex items-center justify-center text-white text-xs font-bold">
                  M
                </div>
                <SelectValue placeholder="Select account" />
              </div>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="metatraq">MetaTraq</SelectItem>
              <SelectItem value="veefore">VeeFore</SelectItem>
            </SelectContent>
          </Select>

          <span className="text-sm text-gray-500">For Jun 30 - Jul 06, 2025</span>
        </div>

        {/* Social Performance Score */}
        <Card className="mb-8">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <CardTitle className="text-lg font-semibold">Social performance score</CardTitle>
                <Info className="h-4 w-4 text-gray-400" />
              </div>
              <Button variant="ghost" size="sm">
                <Settings className="h-4 w-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Score Display */}
              <div className="space-y-4">
                <div className="flex items-center space-x-4">
                  <div className="relative">
                    <div className="w-32 h-32 rounded-full border-8 border-gray-200 flex items-center justify-center">
                      <div className="text-center">
                        <div className="text-4xl font-bold text-gray-900">0</div>
                        <div className="text-sm text-gray-500">/ 1,000</div>
                      </div>
                    </div>
                    <Info className="absolute -top-2 -right-2 h-5 w-5 text-gray-400" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">Room to grow.</h3>
                    <p className="text-gray-600 text-sm">
                      You haven't posted in a while. Remember, posting consistency is key to keeping your audience engaged and growing.
                    </p>
                  </div>
                </div>

                {/* Score Factors */}
                <div className="space-y-4">
                  <h4 className="font-medium text-gray-900 uppercase text-xs tracking-wide">
                    FACTORS INFLUENCING YOUR SCORE OVER THE PAST 8 WEEKS
                  </h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex items-center space-x-2 text-sm text-gray-600">
                      <Eye className="h-4 w-4" />
                      <span>Post Views</span>
                    </div>
                    <div className="flex items-center space-x-2 text-sm text-gray-600">
                      <MessageCircle className="h-4 w-4" />
                      <span>Post Clicks</span>
                    </div>
                    <div className="flex items-center space-x-2 text-sm text-gray-600">
                      <Heart className="h-4 w-4" />
                      <span>Post Comments</span>
                    </div>
                    <div className="flex items-center space-x-2 text-sm text-gray-600">
                      <Share2 className="h-4 w-4" />
                      <span>Post Shares</span>
                    </div>
                    <div className="flex items-center space-x-2 text-sm text-gray-600">
                      <TrendingUp className="h-4 w-4" />
                      <span>Post Interactions</span>
                    </div>
                    <div className="flex items-center space-x-2 text-sm text-gray-600">
                      <Users className="h-4 w-4" />
                      <span>Followers</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Score History Chart */}
              <div className="space-y-4">
                <h4 className="font-medium text-gray-900 uppercase text-xs tracking-wide">SCORE HISTORY</h4>
                <div className="h-48 flex items-end justify-center border-b border-gray-200">
                  {/* Simple line chart visualization */}
                  <div className="w-full h-full relative">
                    <div className="absolute bottom-0 w-full h-1 bg-blue-500"></div>
                    <div className="absolute bottom-0 left-0 w-2 h-2 bg-blue-500 rounded-full"></div>
                    <div className="absolute bottom-0 right-0 w-2 h-2 bg-blue-500 rounded-full"></div>
                  </div>
                </div>
                <div className="flex justify-between text-xs text-gray-500">
                  <span>Sep '24</span>
                  <span>Nov '24</span>
                  <span>2025</span>
                  <span>Mar '25</span>
                  <span>May '25</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Your Insights */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="text-lg font-semibold">Your insights</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {/* Most Engaging Post */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-medium text-gray-900">A closer look at your most engaging post</h3>
                  <Button variant="link" className="text-blue-600 text-sm">
                    Analyze more posts
                  </Button>
                </div>
                
                <div className="flex items-center space-x-3 mb-4">
                  <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center text-white text-sm font-bold">
                    M
                  </div>
                  <span className="font-medium">MetaTraq</span>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="aspect-video bg-gray-200 rounded-lg overflow-hidden">
                      <img 
                        src="/api/placeholder/400/200" 
                        alt="Most engaging post"
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                      <h4 className="font-medium text-gray-900 mb-2 uppercase text-xs tracking-wide">
                        SOME THINGS TO CONSIDER
                      </h4>
                      <p className="text-sm text-gray-600 mb-4">
                        You haven't posted in the last week! Schedule a few posts this week, then check back for 
                        personalised insights and recommendations to increase your activity and engagement.
                      </p>
                      
                      <div className="space-y-3">
                        <div className="flex items-start space-x-3">
                          <div className="w-4 h-4 bg-red-500 rounded-full mt-0.5 flex-shrink-0"></div>
                          <div>
                            <p className="text-sm font-medium text-gray-900">Let AI generate a post for you</p>
                            <p className="text-xs text-gray-600">
                              Remember that OwlyWriter AI can craft engaging posts for you. If you're stuck for time, 
                              just give it a simple prompt and watch it go!
                            </p>
                          </div>
                        </div>
                        
                        <div className="flex items-start space-x-3">
                          <div className="w-4 h-4 bg-red-500 rounded-full mt-0.5 flex-shrink-0"></div>
                          <div>
                            <p className="text-sm font-medium text-gray-900">Repurpose a previous post</p>
                            <p className="text-xs text-gray-600">
                              Zero new ideas today? Try taking a previous post that performed well and asking 
                              OwlyWriter to reword it. #recycling
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <Button className="w-full bg-orange-500 hover:bg-orange-600 text-white">
                      Schedule a new post now
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Recommendations */}
        <Card className="mb-8">
          <CardContent className="p-6">
            <div className="bg-gradient-to-r from-orange-100 to-purple-100 rounded-lg p-6 relative overflow-hidden">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h3 className="text-xl font-semibold text-gray-900">Recommendations to grow your brand</h3>
                  
                  <div className="space-y-4">
                    <div className="flex items-start space-x-3">
                      <div className="w-5 h-5 bg-gray-700 rounded-full mt-0.5 flex-shrink-0"></div>
                      <div>
                        <h4 className="font-medium text-gray-900">Consider image sizes</h4>
                        <p className="text-sm text-gray-600">
                          Visual content drives the most engagement on social, so make sure you get your image sizes right. 
                          Here's your guide to image sizes across networks
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-start space-x-3">
                      <div className="w-5 h-5 bg-gray-700 rounded-full mt-0.5 flex-shrink-0"></div>
                      <div>
                        <h4 className="font-medium text-gray-900">Make the most of hashtags</h4>
                        <p className="text-sm text-gray-600">
                          When used strategically, hashtags are still effective at getting your content in front of more people. 
                          Learn how to find and use the right hashtags on social
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-start space-x-3">
                      <div className="w-5 h-5 bg-gray-700 rounded-full mt-0.5 flex-shrink-0"></div>
                      <div>
                        <h4 className="font-medium text-gray-900">When to post</h4>
                        <p className="text-sm text-gray-600">
                          Are early morning weekdays best for engagement and reach? That's usually a yes—just make sure to 
                          adjust times based on your topic, content, and industry. See more times to post
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center justify-center">
                  <img 
                    src="/api/placeholder/300/200" 
                    alt="Recommendations illustration"
                    className="max-w-full h-auto"
                  />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Analytics Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Total Engagements */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg font-semibold">Total engagements</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-48 bg-gray-100 rounded-lg flex items-center justify-center">
                <span className="text-gray-500">Chart placeholder</span>
              </div>
            </CardContent>
          </Card>

          {/* Impressions */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg font-semibold">Impressions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-48 bg-gray-100 rounded-lg flex items-center justify-center">
                <span className="text-gray-500">Chart placeholder</span>
              </div>
            </CardContent>
          </Card>

          {/* Posting Frequency */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg font-semibold">Posting frequency</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-48 bg-gray-100 rounded-lg flex items-center justify-center">
                <span className="text-gray-500">Chart placeholder</span>
              </div>
            </CardContent>
          </Card>

          {/* Follower Growth */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg font-semibold">Follower growth</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-48 bg-gray-100 rounded-lg flex items-center justify-center">
                <span className="text-gray-500">Chart placeholder</span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Industry Data CTA */}
        <Card className="mb-8">
          <CardContent className="p-6 text-center">
            <div className="flex items-center justify-center space-x-2 mb-4">
              <BarChart3 className="h-6 w-6 text-gray-600" />
              <h3 className="text-lg font-semibold text-gray-900">Get data tailored to your industry</h3>
            </div>
            <p className="text-gray-600 mb-4">
              Tell us more about your business size and industry to get a more complete picture of your performance.
            </p>
            <Button variant="outline" className="text-blue-600 border-blue-200">
              Choose your industry
            </Button>
          </CardContent>
        </Card>

        {/* Need More Section */}
        <Card className="mb-8">
          <CardContent className="p-6">
            <h3 className="text-xl font-semibold text-gray-900 mb-6">Need more?</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="text-center space-y-3">
                <BarChart3 className="h-12 w-12 text-gray-400 mx-auto" />
                <div>
                  <h4 className="font-medium text-gray-900 mb-1">Save time analyzing your social performance</h4>
                  <p className="text-sm text-gray-600">
                    Save time analyzing your social performance with our pre-built report templates.
                  </p>
                </div>
                <Button variant="outline" size="sm">
                  Dive into your data and reports
                </Button>
              </div>
              
              <div className="text-center space-y-3">
                <TrendingUp className="h-12 w-12 text-gray-400 mx-auto" />
                <div>
                  <h4 className="font-medium text-gray-900 mb-1">Compare key metrics</h4>
                  <p className="text-sm text-gray-600">
                    Compare key metrics like audience growth and engagement against your industry peers.
                  </p>
                </div>
                <Button variant="outline" size="sm">
                  Find out how you stack up
                </Button>
              </div>
              
              <div className="text-center space-y-3">
                <Calendar className="h-12 w-12 text-gray-400 mx-auto" />
                <div>
                  <h4 className="font-medium text-gray-900 mb-1">Discover your optimal days and times</h4>
                  <p className="text-sm text-gray-600">
                    Discover your optimal days and times to post to get more eyes on your content.
                  </p>
                </div>
                <Button variant="outline" size="sm">
                  Check your best times to post
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Help and Resources */}
        <Card>
          <CardContent className="p-6">
            <h3 className="text-xl font-semibold text-gray-900 mb-6">Help and resources</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-3">
                <div className="aspect-video bg-gray-200 rounded-lg overflow-hidden">
                  <img 
                    src="/api/placeholder/300/200" 
                    alt="Get started with Hootsuite Analytics"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <h4 className="font-medium text-gray-900 mb-1">Get started with Hootsuite Analytics</h4>
                  <p className="text-sm text-gray-600 mb-3">
                    Learn the basics of using Analytics to review your social results.
                  </p>
                  <Button variant="outline" size="sm">Read</Button>
                </div>
              </div>
              
              <div className="space-y-3">
                <div className="aspect-video bg-gray-200 rounded-lg overflow-hidden">
                  <img 
                    src="/api/placeholder/300/200" 
                    alt="Measure your social media success"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <h4 className="font-medium text-gray-900 mb-1">Measure your social media success</h4>
                  <p className="text-sm text-gray-600 mb-3">
                    Read tips and advice on how to track your progress on social.
                  </p>
                  <Button variant="outline" size="sm">Read</Button>
                </div>
              </div>
              
              <div className="space-y-3">
                <div className="aspect-video bg-gray-200 rounded-lg overflow-hidden">
                  <img 
                    src="/api/placeholder/300/200" 
                    alt="Understand your data in Analytics"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <h4 className="font-medium text-gray-900 mb-1">Understand your data in Analytics</h4>
                  <p className="text-sm text-gray-600 mb-3">
                    Find out more about how we collect and display data in Analytics.
                  </p>
                  <Button variant="outline" size="sm">Read</Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </motion.div>
  );
};

export default Analytics;