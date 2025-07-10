import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import {
  Settings,
  Play,
  Pause,
  Plus,
  Edit,
  Trash2,
  Clock,
  Users,
  MessageSquare,
  Activity,
  Zap,
  Filter,
  Bell,
  BarChart3,
  Target,
  Shield,
  Globe,
  Sparkles,
  TrendingUp,
  Eye,
  Heart,
  Share2
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useWorkspaceContext } from '@/hooks/useWorkspace';
import { apiRequest } from '@/lib/queryClient';

interface AutomationRule {
  id: string;
  name: string;
  type: 'dm' | 'comment' | 'follow' | 'engagement';
  platform: 'instagram' | 'facebook' | 'twitter' | 'linkedin';
  status: 'active' | 'paused' | 'stopped';
  trigger: string;
  action: string;
  dailyLimit: number;
  totalExecutions: number;
  successRate: number;
  lastRun: string;
  createdAt: string;
  isActive: boolean;
}

interface AutomationStats {
  totalRules: number;
  activeRules: number;
  totalExecutions: number;
  successRate: number;
  savedTime: string;
  engagementIncrease: string;
}

export default function AutomationEnterprise() {
  const { toast } = useToast();
  const { currentWorkspace } = useWorkspaceContext();
  const queryClient = useQueryClient();
  
  const [selectedTab, setSelectedTab] = useState('overview');
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [selectedRule, setSelectedRule] = useState<AutomationRule | null>(null);

  // Mock data for enterprise demo
  const mockStats: AutomationStats = {
    totalRules: 8,
    activeRules: 6,
    totalExecutions: 1247,
    successRate: 94.2,
    savedTime: '23.5 hours',
    engagementIncrease: '+187%'
  };

  const mockRules: AutomationRule[] = [
    {
      id: '1',
      name: 'Welcome New Followers',
      type: 'dm',
      platform: 'instagram',
      status: 'active',
      trigger: 'New follower detected',
      action: 'Send personalized welcome DM',
      dailyLimit: 50,
      totalExecutions: 234,
      successRate: 96.8,
      lastRun: '2 minutes ago',
      createdAt: '2025-01-05',
      isActive: true
    },
    {
      id: '2',
      name: 'Engagement Boost Campaign',
      type: 'comment',
      platform: 'instagram',
      status: 'active',
      trigger: 'Hashtag mention: #veefore',
      action: 'Auto-reply with branded response',
      dailyLimit: 100,
      totalExecutions: 456,
      successRate: 92.1,
      lastRun: '5 minutes ago',
      createdAt: '2025-01-03',
      isActive: true
    },
    {
      id: '3',
      name: 'Crisis Management Alert',
      type: 'engagement',
      platform: 'instagram',
      status: 'paused',
      trigger: 'Negative sentiment detected',
      action: 'Notify team + Auto-response',
      dailyLimit: 25,
      totalExecutions: 12,
      successRate: 100,
      lastRun: '2 hours ago',
      createdAt: '2025-01-01',
      isActive: false
    }
  ];

  // Fetch automation rules
  const { data: rulesData, isLoading: rulesLoading } = useQuery({
    queryKey: ['/api/automation/rules', currentWorkspace?.id],
    queryFn: async () => {
      const response = await apiRequest('GET', `/api/automation/rules/${currentWorkspace?.id}`);
      const data = await response.json();
      return data;
    },
    enabled: !!currentWorkspace?.id
  });

  const rules = rulesData?.rules || mockRules;

  const renderOverview = () => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-6"
    >
      {/* Header Section */}
      <div className="bg-gradient-to-r from-purple-600 to-blue-600 rounded-xl p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Automation Center</h1>
            <p className="text-purple-100 mt-1">Enterprise-grade automation with AI intelligence</p>
          </div>
          <div className="flex items-center space-x-4">
            <div className="bg-white/20 backdrop-blur-sm rounded-lg px-4 py-2">
              <span className="text-sm font-medium">Status: Operational</span>
              <div className="w-2 h-2 bg-green-400 rounded-full ml-2 inline-block animate-pulse"></div>
            </div>
            <Button className="bg-white text-purple-600 hover:bg-purple-50">
              <Plus className="h-4 w-4 mr-2" />
              Create Rule
            </Button>
          </div>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="border-0 shadow-lg bg-gradient-to-br from-blue-50 to-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Activity className="h-6 w-6 text-blue-600" />
              </div>
              <Badge variant="secondary" className="bg-blue-100 text-blue-700">
                +12%
              </Badge>
            </div>
            <h3 className="text-2xl font-bold text-gray-900">{mockStats.activeRules}</h3>
            <p className="text-sm text-gray-600">Active Rules</p>
            <div className="mt-3 text-xs text-gray-500">
              {mockStats.totalRules} total rules
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg bg-gradient-to-br from-emerald-50 to-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="p-2 bg-emerald-100 rounded-lg">
                <Zap className="h-6 w-6 text-emerald-600" />
              </div>
              <Badge variant="secondary" className="bg-emerald-100 text-emerald-700">
                {mockStats.successRate}%
              </Badge>
            </div>
            <h3 className="text-2xl font-bold text-gray-900">{mockStats.totalExecutions}</h3>
            <p className="text-sm text-gray-600">Total Executions</p>
            <div className="mt-3 text-xs text-gray-500">
              Last 30 days
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg bg-gradient-to-br from-purple-50 to-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="p-2 bg-purple-100 rounded-lg">
                <Clock className="h-6 w-6 text-purple-600" />
              </div>
              <Badge variant="secondary" className="bg-purple-100 text-purple-700">
                {mockStats.engagementIncrease}
              </Badge>
            </div>
            <h3 className="text-2xl font-bold text-gray-900">{mockStats.savedTime}</h3>
            <p className="text-sm text-gray-600">Time Saved</p>
            <div className="mt-3 text-xs text-gray-500">
              This month
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Enterprise Features */}
      <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-6">Enterprise Automation Features</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div className="flex items-start space-x-3 p-4 bg-white border border-blue-200 rounded-lg">
              <Shield className="h-5 w-5 text-blue-600 mt-1" />
              <div>
                <h4 className="font-semibold text-gray-900">Advanced Security</h4>
                <p className="text-sm text-gray-600">End-to-end encryption with enterprise-grade security protocols.</p>
                <Button size="sm" className="mt-2 bg-blue-600 hover:bg-blue-700 text-white">
                  Configure Security
                </Button>
              </div>
            </div>

            <div className="flex items-start space-x-3 p-4 bg-white border border-emerald-200 rounded-lg">
              <Target className="h-5 w-5 text-emerald-600 mt-1" />
              <div>
                <h4 className="font-semibold text-gray-900">Smart Targeting</h4>
                <p className="text-sm text-gray-600">AI-powered audience targeting with behavioral analysis.</p>
                <Button size="sm" className="mt-2 bg-emerald-600 hover:bg-emerald-700 text-white">
                  Set Up Targeting
                </Button>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-start space-x-3 p-4 bg-white border border-purple-200 rounded-lg">
              <BarChart3 className="h-5 w-5 text-purple-600 mt-1" />
              <div>
                <h4 className="font-semibold text-gray-900">Advanced Analytics</h4>
                <p className="text-sm text-gray-600">Real-time performance tracking with detailed insights.</p>
                <Button size="sm" className="mt-2 bg-purple-600 hover:bg-purple-700 text-white">
                  View Analytics
                </Button>
              </div>
            </div>

            <div className="flex items-start space-x-3 p-4 bg-white border border-orange-200 rounded-lg">
              <Bell className="h-5 w-5 text-orange-600 mt-1" />
              <div>
                <h4 className="font-semibold text-gray-900">Crisis Management</h4>
                <p className="text-sm text-gray-600">Automated crisis detection and response protocols.</p>
                <Button size="sm" className="mt-2 bg-orange-600 hover:bg-orange-700 text-white">
                  Setup Alerts
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );

  const renderRules = () => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-6"
    >
      {/* Rules Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-gray-900">Automation Rules</h2>
          <p className="text-sm text-gray-600 mt-1">Manage your automation workflows</p>
        </div>
        <Button onClick={() => setIsCreateOpen(true)} className="bg-blue-600 hover:bg-blue-700">
          <Plus className="h-4 w-4 mr-2" />
          Create Rule
        </Button>
      </div>

      {/* Rules List */}
      <div className="space-y-4">
        {rules.map((rule: AutomationRule) => (
          <Card key={rule.id} className="border-0 shadow-sm hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className={`p-2 rounded-lg ${
                    rule.platform === 'instagram' ? 'bg-pink-100' :
                    rule.platform === 'facebook' ? 'bg-blue-100' :
                    rule.platform === 'twitter' ? 'bg-sky-100' : 'bg-blue-100'
                  }`}>
                    {rule.type === 'dm' ? <MessageSquare className="h-5 w-5" /> :
                     rule.type === 'comment' ? <Heart className="h-5 w-5" /> :
                     rule.type === 'follow' ? <Users className="h-5 w-5" /> :
                     <Activity className="h-5 w-5" />}
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">{rule.name}</h3>
                    <p className="text-sm text-gray-600">{rule.trigger}</p>
                    <div className="flex items-center space-x-4 mt-2">
                      <Badge variant={rule.status === 'active' ? 'default' : 'secondary'}>
                        {rule.status}
                      </Badge>
                      <span className="text-xs text-gray-500">
                        {rule.totalExecutions} executions • {rule.successRate}% success
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <div className="text-right mr-4">
                    <div className="text-sm font-medium text-gray-900">
                      {rule.dailyLimit}/day limit
                    </div>
                    <div className="text-xs text-gray-500">
                      Last run: {rule.lastRun}
                    </div>
                  </div>
                  <Switch 
                    checked={rule.isActive} 
                    onCheckedChange={() => {
                      // Toggle rule mutation would go here
                    }}
                  />
                  <Button variant="outline" size="sm">
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" size="sm">
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {rules.length === 0 && (
        <div className="text-center py-12">
          <Settings className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No automation rules yet</h3>
          <p className="text-gray-600 mb-6">Create your first automation rule to get started with intelligent workflows.</p>
          <Button onClick={() => setIsCreateOpen(true)} className="bg-blue-600 hover:bg-blue-700">
            <Plus className="h-4 w-4 mr-2" />
            Create First Rule
          </Button>
        </div>
      )}
    </motion.div>
  );

  const renderAnalytics = () => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-6"
    >
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="border-0 shadow-sm">
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Eye className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Total Reach</p>
                <p className="text-lg font-bold text-gray-900">45.2K</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-sm">
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-emerald-100 rounded-lg">
                <Heart className="h-5 w-5 text-emerald-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Engagement Rate</p>
                <p className="text-lg font-bold text-gray-900">12.8%</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-sm">
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-purple-100 rounded-lg">
                <Share2 className="h-5 w-5 text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Responses Sent</p>
                <p className="text-lg font-bold text-gray-900">1,247</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-sm">
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-orange-100 rounded-lg">
                <TrendingUp className="h-5 w-5 text-orange-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Growth Rate</p>
                <p className="text-lg font-bold text-gray-900">+24%</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </motion.div>
  );

  return (
    <div className="min-h-screen bg-gray-50" style={{ backgroundColor: '#f9fafb !important' }}>
      <div className="p-6 max-w-7xl mx-auto">
        {/* Navigation Tabs */}
        <Tabs value={selectedTab} onValueChange={setSelectedTab} className="w-full">
          <TabsList className="grid w-full grid-cols-4 bg-white">
            <TabsTrigger 
              value="overview" 
              className="data-[state=active]:bg-blue-600 data-[state=active]:text-white"
            >
              Overview
            </TabsTrigger>
            <TabsTrigger 
              value="rules"
              className="data-[state=active]:bg-blue-600 data-[state=active]:text-white"
            >
              Rules
            </TabsTrigger>
            <TabsTrigger 
              value="analytics"
              className="data-[state=active]:bg-blue-600 data-[state=active]:text-white"
            >
              Analytics
            </TabsTrigger>
            <TabsTrigger 
              value="settings"
              className="data-[state=active]:bg-blue-600 data-[state=active]:text-white"
            >
              Settings
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="mt-6">
            {renderOverview()}
          </TabsContent>

          <TabsContent value="rules" className="mt-6">
            {renderRules()}
          </TabsContent>

          <TabsContent value="analytics" className="mt-6">
            {renderAnalytics()}
          </TabsContent>

          <TabsContent value="settings" className="mt-6">
            <div className="text-center py-12">
              <Settings className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Settings Panel</h3>
              <p className="text-gray-600">Configure your automation preferences and advanced settings.</p>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}