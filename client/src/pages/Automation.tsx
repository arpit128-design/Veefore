import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
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
  Share2,
  ChevronRight,
  Bot,
  Workflow,
  Database,
  Cpu,
  Network,
  Gauge,
  Layers,
  Command,
  Zap as Lightning,
  Brain,
  Rocket,
  CheckCircle2,
  AlertTriangle,
  Pause as PauseIcon,
  PlayCircle,
  StopCircle,
  RefreshCw,
  Calendar,
  LineChart,
  PieChart,
  BarChart,
  Briefcase,
  Crown,
  Infinity,
  Flame
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useWorkspaceContext } from '@/hooks/useWorkspace';
import { apiRequest } from '@/lib/queryClient';

interface AutomationRule {
  id: string;
  name: string;
  type: 'dm' | 'comment' | 'follow' | 'engagement' | 'content' | 'analytics';
  platform: 'instagram' | 'facebook' | 'twitter' | 'linkedin' | 'youtube' | 'tiktok';
  status: 'active' | 'paused' | 'stopped' | 'learning' | 'optimizing';
  trigger: string;
  action: string;
  dailyLimit: number;
  totalExecutions: number;
  successRate: number;
  lastRun: string;
  createdAt: string;
  isActive: boolean;
  priority: 'low' | 'medium' | 'high' | 'critical';
  aiScore: number;
  efficiency: number;
  category: 'growth' | 'engagement' | 'monetization' | 'protection' | 'analytics';
}

interface AutomationStats {
  totalRules: number;
  activeRules: number;
  totalExecutions: number;
  successRate: number;
  savedTime: string;
  engagementIncrease: string;
  revenueGenerated: string;
  aiOptimizations: number;
  trendsDetected: number;
  crisisInterventions: number;
}

export default function Automation() {
  const { toast } = useToast();
  const { currentWorkspace } = useWorkspaceContext();
  const queryClient = useQueryClient();
  
  const [selectedTab, setSelectedTab] = useState('overview');
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [selectedRule, setSelectedRule] = useState<AutomationRule | null>(null);
  const [viewMode, setViewMode] = useState<'grid' | 'list' | 'analytics'>('grid');

  // Professional enterprise mock data
  const mockStats: AutomationStats = {
    totalRules: 24,
    activeRules: 18,
    totalExecutions: 47289,
    successRate: 97.3,
    savedTime: '342.7 hours',
    engagementIncrease: '+847%',
    revenueGenerated: '$127,450',
    aiOptimizations: 156,
    trendsDetected: 89,
    crisisInterventions: 7
  };

  const mockRules: AutomationRule[] = [
    {
      id: '1',
      name: 'AI-Powered Welcome Sequence',
      type: 'dm',
      platform: 'instagram',
      status: 'active',
      trigger: 'New premium follower with 10K+ following',
      action: 'Multi-stage personalized DM sequence with product recommendations',
      dailyLimit: 100,
      totalExecutions: 2847,
      successRate: 98.4,
      lastRun: '32 seconds ago',
      createdAt: '2025-01-10',
      isActive: true,
      priority: 'high',
      aiScore: 94,
      efficiency: 97,
      category: 'growth'
    },
    {
      id: '2',
      name: 'Viral Content Amplification Engine',
      type: 'engagement',
      platform: 'instagram',
      status: 'learning',
      trigger: 'Post reaching 1000+ likes in first hour',
      action: 'Auto-amplify with strategic commenting, story shares, and cross-platform promotion',
      dailyLimit: 50,
      totalExecutions: 1289,
      successRate: 96.8,
      lastRun: '1 minute ago',
      createdAt: '2025-01-08',
      isActive: true,
      priority: 'critical',
      aiScore: 98,
      efficiency: 99,
      category: 'engagement'
    },
    {
      id: '3',
      name: 'Crisis Management & Brand Protection',
      type: 'analytics',
      platform: 'instagram',
      status: 'active',
      trigger: 'Negative sentiment spike >15% in mentions',
      action: 'Immediate team alert, auto-response, influencer outreach, PR protocol activation',
      dailyLimit: 25,
      totalExecutions: 47,
      successRate: 100,
      lastRun: '12 hours ago',
      createdAt: '2025-01-05',
      isActive: true,
      priority: 'critical',
      aiScore: 100,
      efficiency: 100,
      category: 'protection'
    },
    {
      id: '4',
      name: 'Revenue Optimization Bot',
      type: 'content',
      platform: 'instagram',
      status: 'optimizing',
      trigger: 'High-intent purchase keywords in comments/DMs',
      action: 'Personalized product recommendations, discount codes, checkout assistance',
      dailyLimit: 200,
      totalExecutions: 8934,
      successRate: 89.2,
      lastRun: '8 minutes ago',
      createdAt: '2025-01-03',
      isActive: true,
      priority: 'high',
      aiScore: 92,
      efficiency: 95,
      category: 'monetization'
    },
    {
      id: '5',
      name: 'Influencer Relationship Manager',
      type: 'dm',
      platform: 'instagram',
      status: 'active',
      trigger: 'Verified account follows + mentions brand',
      action: 'VIP welcome, collaboration proposal, media kit delivery, calendar booking',
      dailyLimit: 30,
      totalExecutions: 234,
      successRate: 94.1,
      lastRun: '45 minutes ago',
      createdAt: '2025-01-01',
      isActive: true,
      priority: 'medium',
      aiScore: 96,
      efficiency: 98,
      category: 'growth'
    },
    {
      id: '6',
      name: 'Competitive Intelligence Scanner',
      type: 'analytics',
      platform: 'instagram',
      status: 'active',
      trigger: 'Competitor posts with >5000 engagement',
      action: 'Content analysis, trend extraction, opportunity identification, strategy recommendations',
      dailyLimit: 100,
      totalExecutions: 1567,
      successRate: 95.7,
      lastRun: '3 minutes ago',
      createdAt: '2024-12-28',
      isActive: true,
      priority: 'medium',
      aiScore: 93,
      efficiency: 94,
      category: 'analytics'
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

  const getPlatformColor = (platform: string) => {
    const colors = {
      instagram: 'from-pink-500 to-purple-600',
      facebook: 'from-blue-600 to-blue-700',
      twitter: 'from-sky-400 to-sky-600',
      linkedin: 'from-blue-700 to-blue-800',
      youtube: 'from-red-500 to-red-600',
      tiktok: 'from-gray-800 to-black'
    };
    return colors[platform] || 'from-gray-500 to-gray-600';
  };

  const getStatusColor = (status: string) => {
    const colors = {
      active: 'bg-emerald-100 text-emerald-800 border-emerald-200',
      paused: 'bg-yellow-100 text-yellow-800 border-yellow-200',
      stopped: 'bg-red-100 text-red-800 border-red-200',
      learning: 'bg-blue-100 text-blue-800 border-blue-200',
      optimizing: 'bg-purple-100 text-purple-800 border-purple-200'
    };
    return colors[status] || 'bg-gray-100 text-gray-800 border-gray-200';
  };

  const getPriorityIcon = (priority: string) => {
    const icons = {
      low: <Clock className="h-3 w-3" />,
      medium: <Target className="h-3 w-3" />,
      high: <Flame className="h-3 w-3" />,
      critical: <AlertTriangle className="h-3 w-3" />
    };
    return icons[priority] || <Clock className="h-3 w-3" />;
  };

  const renderOverview = () => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="space-y-8"
    >
      {/* Hero Header */}
      <div className="relative overflow-hidden bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 rounded-2xl p-8 text-white">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-purple-600/20 backdrop-blur-3xl"></div>
        <div className="relative z-10 flex items-center justify-between">
          <div className="space-y-2">
            <div className="flex items-center space-x-3">
              <div className="p-3 bg-white/20 backdrop-blur-sm rounded-xl">
                <Bot className="h-8 w-8" />
              </div>
              <div>
                <h1 className="text-3xl font-bold">AI Automation Center</h1>
                <p className="text-blue-100">Next-generation intelligent automation platform</p>
              </div>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <div className="bg-emerald-500/20 backdrop-blur-sm border border-emerald-400/30 rounded-lg px-4 py-2">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-emerald-400 rounded-full animate-pulse"></div>
                <span className="text-sm font-medium">System Operational</span>
              </div>
            </div>
            <Button className="bg-white/20 backdrop-blur-sm border border-white/30 hover:bg-white/30 text-white">
              <Plus className="h-4 w-4 mr-2" />
              Create Automation
            </Button>
          </div>
        </div>
        
        {/* Floating metrics */}
        <div className="mt-6 grid grid-cols-3 gap-4">
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-100 text-sm">Active Automations</p>
                <p className="text-2xl font-bold">{mockStats.activeRules}</p>
              </div>
              <Workflow className="h-8 w-8 text-blue-300" />
            </div>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-100 text-sm">Success Rate</p>
                <p className="text-2xl font-bold">{mockStats.successRate}%</p>
              </div>
              <Target className="h-8 w-8 text-emerald-300" />
            </div>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-100 text-sm">Revenue Generated</p>
                <p className="text-2xl font-bold">{mockStats.revenueGenerated}</p>
              </div>
              <TrendingUp className="h-8 w-8 text-yellow-300" />
            </div>
          </div>
        </div>
      </div>

      {/* Advanced Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <motion.div 
          whileHover={{ scale: 1.02 }}
          className="bg-white border border-gray-200 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300"
          style={{ backgroundColor: '#ffffff !important' }}
        >
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl">
              <Activity className="h-6 w-6 text-white" />
            </div>
            <Badge className="bg-blue-100 text-blue-700 border-blue-200">
              +24% vs last month
            </Badge>
          </div>
          <h3 className="text-3xl font-bold text-gray-900 mb-1">{mockStats.totalExecutions.toLocaleString()}</h3>
          <p className="text-gray-800 text-sm font-medium">Total Executions</p>
          <div className="mt-4 flex items-center space-x-2">
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div className="bg-blue-600 h-2 rounded-full" style={{ width: '87%' }}></div>
            </div>
            <span className="text-xs text-gray-700 font-medium">87%</span>
          </div>
        </motion.div>

        <motion.div 
          whileHover={{ scale: 1.02 }}
          className="bg-white border border-gray-200 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300"
          style={{ backgroundColor: '#ffffff !important' }}
        >
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-xl">
              <Brain className="h-6 w-6 text-white" />
            </div>
            <Badge className="bg-emerald-100 text-emerald-700 border-emerald-200">
              +{mockStats.aiOptimizations} this week
            </Badge>
          </div>
          <h3 className="text-3xl font-bold text-gray-900 mb-1">{mockStats.savedTime}</h3>
          <p className="text-gray-800 text-sm font-medium">Time Saved by AI</p>
          <div className="mt-4 flex items-center space-x-2">
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div className="bg-emerald-600 h-2 rounded-full" style={{ width: '95%' }}></div>
            </div>
            <span className="text-xs text-gray-700 font-medium">95%</span>
          </div>
        </motion.div>

        <motion.div 
          whileHover={{ scale: 1.02 }}
          className="bg-white border border-gray-200 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300"
          style={{ backgroundColor: '#ffffff !important' }}
        >
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl">
              <TrendingUp className="h-6 w-6 text-white" />
            </div>
            <Badge className="bg-purple-100 text-purple-700 border-purple-200">
              {mockStats.engagementIncrease}
            </Badge>
          </div>
          <h3 className="text-3xl font-bold text-gray-900 mb-1">{mockStats.trendsDetected}</h3>
          <p className="text-gray-800 text-sm font-medium">Trends Detected</p>
          <div className="mt-4 flex items-center space-x-2">
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div className="bg-purple-600 h-2 rounded-full" style={{ width: '78%' }}></div>
            </div>
            <span className="text-xs text-gray-700 font-medium">78%</span>
          </div>
        </motion.div>

        <motion.div 
          whileHover={{ scale: 1.02 }}
          className="bg-white border border-gray-200 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300"
          style={{ backgroundColor: '#ffffff !important' }}
        >
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl">
              <Shield className="h-6 w-6 text-white" />
            </div>
            <Badge className="bg-orange-100 text-orange-700 border-orange-200">
              {mockStats.crisisInterventions} prevented
            </Badge>
          </div>
          <h3 className="text-3xl font-bold text-gray-900 mb-1">{mockStats.revenueGenerated}</h3>
          <p className="text-gray-800 text-sm font-medium">Revenue Generated</p>
          <div className="mt-4 flex items-center space-x-2">
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div className="bg-orange-600 h-2 rounded-full" style={{ width: '92%' }}></div>
            </div>
            <span className="text-xs text-gray-700 font-medium">92%</span>
          </div>
        </motion.div>
      </div>

      {/* Enterprise AI Features */}
      <div className="bg-white border border-gray-200 rounded-2xl p-8 shadow-lg" style={{ backgroundColor: '#ffffff !important' }}>
        <div className="flex items-center justify-between mb-8">
          <div>
            <h3 className="text-2xl font-bold text-gray-900 flex items-center space-x-3">
              <Crown className="h-7 w-7 text-yellow-500" />
              <span>Enterprise AI Capabilities</span>
            </h3>
            <p className="text-gray-800 mt-2 font-medium">Advanced automation features powered by cutting-edge AI technology</p>
          </div>
          <Badge className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-4 py-2 text-lg">
            <Crown className="h-4 w-4 mr-2" />
            Premium
          </Badge>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <motion.div 
            whileHover={{ scale: 1.03 }}
            className="group p-6 bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-200 rounded-xl hover:shadow-lg transition-all duration-300"
          >
            <div className="flex items-start space-x-4">
              <div className="p-3 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl group-hover:scale-110 transition-transform">
                <Brain className="h-6 w-6 text-white" />
              </div>
              <div className="flex-1">
                <h4 className="font-bold text-gray-900 text-lg mb-2">Neural Learning Engine</h4>
                <p className="text-gray-800 text-sm mb-4 font-medium">Advanced machine learning algorithms that continuously optimize automation performance</p>
                <Button size="sm" className="bg-blue-600 hover:bg-blue-700 text-white group-hover:scale-105 transition-transform">
                  Configure AI
                </Button>
              </div>
            </div>
          </motion.div>

          <motion.div 
            whileHover={{ scale: 1.03 }}
            className="group p-6 bg-gradient-to-br from-emerald-50 to-teal-50 border border-emerald-200 rounded-xl hover:shadow-lg transition-all duration-300"
          >
            <div className="flex items-start space-x-4">
              <div className="p-3 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl group-hover:scale-110 transition-transform">
                <Rocket className="h-6 w-6 text-white" />
              </div>
              <div className="flex-1">
                <h4 className="font-bold text-gray-900 text-lg mb-2">Predictive Analytics</h4>
                <p className="text-gray-800 text-sm mb-4 font-medium">AI-powered trend prediction and opportunity identification with 94% accuracy</p>
                <Button size="sm" className="bg-emerald-600 hover:bg-emerald-700 text-white group-hover:scale-105 transition-transform">
                  View Predictions
                </Button>
              </div>
            </div>
          </motion.div>

          <motion.div 
            whileHover={{ scale: 1.03 }}
            className="group p-6 bg-gradient-to-br from-purple-50 to-pink-50 border border-purple-200 rounded-xl hover:shadow-lg transition-all duration-300"
          >
            <div className="flex items-start space-x-4">
              <div className="p-3 bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl group-hover:scale-110 transition-transform">
                <Lightning className="h-6 w-6 text-white" />
              </div>
              <div className="flex-1">
                <h4 className="font-bold text-gray-900 text-lg mb-2">Real-time Optimization</h4>
                <p className="text-gray-800 text-sm mb-4 font-medium">Instant performance adjustments and A/B testing for maximum efficiency</p>
                <Button size="sm" className="bg-purple-600 hover:bg-purple-700 text-white group-hover:scale-105 transition-transform">
                  Optimize Now
                </Button>
              </div>
            </div>
          </motion.div>

          <motion.div 
            whileHover={{ scale: 1.03 }}
            className="group p-6 bg-gradient-to-br from-orange-50 to-red-50 border border-orange-200 rounded-xl hover:shadow-lg transition-all duration-300"
          >
            <div className="flex items-start space-x-4">
              <div className="p-3 bg-gradient-to-br from-orange-500 to-red-600 rounded-xl group-hover:scale-110 transition-transform">
                <Shield className="h-6 w-6 text-white" />
              </div>
              <div className="flex-1">
                <h4 className="font-bold text-gray-900 text-lg mb-2">Crisis Protection</h4>
                <p className="text-gray-800 text-sm mb-4 font-medium">24/7 brand monitoring with automatic crisis detection and response protocols</p>
                <Button size="sm" className="bg-orange-600 hover:bg-orange-700 text-white group-hover:scale-105 transition-transform">
                  Setup Alerts
                </Button>
              </div>
            </div>
          </motion.div>

          <motion.div 
            whileHover={{ scale: 1.03 }}
            className="group p-6 bg-gradient-to-br from-teal-50 to-cyan-50 border border-teal-200 rounded-xl hover:shadow-lg transition-all duration-300"
          >
            <div className="flex items-start space-x-4">
              <div className="p-3 bg-gradient-to-br from-teal-500 to-cyan-600 rounded-xl group-hover:scale-110 transition-transform">
                <Network className="h-6 w-6 text-white" />
              </div>
              <div className="flex-1">
                <h4 className="font-bold text-gray-900 text-lg mb-2">Multi-Platform Sync</h4>
                <p className="text-gray-800 text-sm mb-4 font-medium">Seamless automation across all social media platforms with unified analytics</p>
                <Button size="sm" className="bg-teal-600 hover:bg-teal-700 text-white group-hover:scale-105 transition-transform">
                  Connect Platforms
                </Button>
              </div>
            </div>
          </motion.div>

          <motion.div 
            whileHover={{ scale: 1.03 }}
            className="group p-6 bg-gradient-to-br from-gray-50 to-slate-50 border border-gray-200 rounded-xl hover:shadow-lg transition-all duration-300"
          >
            <div className="flex items-start space-x-4">
              <div className="p-3 bg-gradient-to-br from-gray-500 to-slate-600 rounded-xl group-hover:scale-110 transition-transform">
                <Infinity className="h-6 w-6 text-white" />
              </div>
              <div className="flex-1">
                <h4 className="font-bold text-gray-900 text-lg mb-2">Infinite Scalability</h4>
                <p className="text-gray-800 text-sm mb-4 font-medium">Enterprise-grade infrastructure that scales with your business growth</p>
                <Button size="sm" className="bg-gray-600 hover:bg-gray-700 text-white group-hover:scale-105 transition-transform">
                  Scale Up
                </Button>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );

  const renderRules = () => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="space-y-6"
    >
      {/* Rules Header with Advanced Controls */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Automation Rules</h2>
          <p className="text-gray-800 mt-1 font-medium">Manage your intelligent automation workflows</p>
        </div>
        <div className="flex items-center space-x-3">
          <Select value={viewMode} onValueChange={setViewMode}>
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="grid">Grid View</SelectItem>
              <SelectItem value="list">List View</SelectItem>
              <SelectItem value="analytics">Analytics View</SelectItem>
            </SelectContent>
          </Select>
          <Button onClick={() => setIsCreateOpen(true)} className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white">
            <Plus className="h-4 w-4 mr-2" />
            Create Rule
          </Button>
        </div>
      </div>

      {/* Rules Grid */}
      <div className={`grid gap-6 ${viewMode === 'grid' ? 'grid-cols-1 lg:grid-cols-2' : 'grid-cols-1'}`}>
        <AnimatePresence>
          {rules.map((rule: AutomationRule, index) => (
            <motion.div
              key={rule.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
              whileHover={{ scale: 1.02 }}
              className="group bg-white border border-gray-200 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300"
              style={{ backgroundColor: '#ffffff !important' }}
            >
              {/* Rule Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-start space-x-4">
                  <div className={`p-3 bg-gradient-to-br ${getPlatformColor(rule.platform)} rounded-xl group-hover:scale-110 transition-transform`}>
                    {rule.type === 'dm' ? <MessageSquare className="h-6 w-6 text-white" /> :
                     rule.type === 'content' ? <Edit className="h-6 w-6 text-white" /> :
                     rule.type === 'analytics' ? <BarChart3 className="h-6 w-6 text-white" /> :
                     rule.type === 'engagement' ? <Heart className="h-6 w-6 text-white" /> :
                     <Activity className="h-6 w-6 text-white" />}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-1">
                      <h3 className="font-bold text-gray-900 text-lg">{rule.name}</h3>
                      <Badge className={`${getStatusColor(rule.status)} text-xs`}>
                        {rule.status}
                      </Badge>
                    </div>
                    <p className="text-gray-600 text-sm">{rule.trigger}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Badge className={`px-2 py-1 text-xs ${rule.priority === 'critical' ? 'bg-red-100 text-red-800' : 
                    rule.priority === 'high' ? 'bg-orange-100 text-orange-800' :
                    rule.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-gray-100 text-gray-800'}`}>
                    {getPriorityIcon(rule.priority)}
                    <span className="ml-1">{rule.priority}</span>
                  </Badge>
                  <Switch checked={rule.isActive} onCheckedChange={() => {}} />
                </div>
              </div>

              {/* Performance Metrics */}
              <div className="grid grid-cols-3 gap-4 mb-4">
                <div className="text-center p-3 bg-gray-50 rounded-lg">
                  <div className="text-2xl font-bold text-gray-900">{rule.aiScore}</div>
                  <div className="text-xs text-gray-600">AI Score</div>
                </div>
                <div className="text-center p-3 bg-gray-50 rounded-lg">
                  <div className="text-2xl font-bold text-gray-900">{rule.successRate}%</div>
                  <div className="text-xs text-gray-600">Success Rate</div>
                </div>
                <div className="text-center p-3 bg-gray-50 rounded-lg">
                  <div className="text-2xl font-bold text-gray-900">{rule.totalExecutions.toLocaleString()}</div>
                  <div className="text-xs text-gray-600">Executions</div>
                </div>
              </div>

              {/* Action and Details */}
              <div className="mb-4">
                <p className="text-sm text-gray-700 mb-2">{rule.action}</p>
                <div className="flex items-center justify-between text-xs text-gray-500">
                  <span>Limit: {rule.dailyLimit}/day</span>
                  <span>Last run: {rule.lastRun}</span>
                </div>
              </div>

              {/* Rule Controls */}
              <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                <div className="flex items-center space-x-2">
                  <Badge className={`px-3 py-1 text-xs ${rule.category === 'growth' ? 'bg-green-100 text-green-800' :
                    rule.category === 'engagement' ? 'bg-blue-100 text-blue-800' :
                    rule.category === 'monetization' ? 'bg-purple-100 text-purple-800' :
                    rule.category === 'protection' ? 'bg-red-100 text-red-800' :
                    'bg-gray-100 text-gray-800'}`}>
                    {rule.category}
                  </Badge>
                </div>
                <div className="flex items-center space-x-2">
                  {rule.status === 'active' ? 
                    <Button size="sm" variant="outline">
                      <PauseIcon className="h-3 w-3" />
                    </Button> :
                    <Button size="sm" variant="outline">
                      <PlayCircle className="h-3 w-3" />
                    </Button>
                  }
                  <Button size="sm" variant="outline">
                    <Edit className="h-3 w-3" />
                  </Button>
                  <Button size="sm" variant="outline">
                    <BarChart className="h-3 w-3" />
                  </Button>
                  <Button size="sm" variant="outline" className="text-red-600 hover:text-red-700">
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {rules.length === 0 && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-16 bg-white border border-gray-200 rounded-2xl" 
          style={{ backgroundColor: '#ffffff !important' }}
        >
          <Bot className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-medium text-gray-900 mb-2">No automation rules yet</h3>
          <p className="text-gray-600 mb-8 max-w-md mx-auto">Create your first automation rule to start building intelligent workflows that work 24/7.</p>
          <Button onClick={() => setIsCreateOpen(true)} className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white">
            <Plus className="h-4 w-4 mr-2" />
            Create First Rule
          </Button>
        </motion.div>
      )}
    </motion.div>
  );

  const renderAnalytics = () => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="space-y-8"
    >
      {/* Analytics Header */}
      <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-lg" style={{ backgroundColor: '#ffffff !important' }}>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Automation Analytics</h2>
        <p className="text-gray-700 mb-6">Comprehensive performance insights and detailed metrics for your automation workflows</p>
        
        {/* Key Metrics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { icon: Eye, label: 'Total Reach', value: '2.4M', color: 'blue', bg: 'bg-blue-100', text: 'text-blue-600' },
            { icon: Heart, label: 'Engagement Rate', value: '24.7%', color: 'pink', bg: 'bg-pink-100', text: 'text-pink-600' },
            { icon: Share2, label: 'Conversions', value: '8,924', color: 'green', bg: 'bg-green-100', text: 'text-green-600' },
            { icon: TrendingUp, label: 'ROI', value: '+347%', color: 'purple', bg: 'bg-purple-100', text: 'text-purple-600' }
          ].map((metric, index) => (
            <motion.div
              key={index}
              whileHover={{ scale: 1.05 }}
              className="bg-gray-50 border border-gray-200 rounded-xl p-4 hover:shadow-md transition-all"
            >
              <div className="flex items-center space-x-3">
                <div className={`p-3 ${metric.bg} rounded-xl`}>
                  <metric.icon className={`h-6 w-6 ${metric.text}`} />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-800">{metric.label}</p>
                  <p className="text-2xl font-bold text-gray-900">{metric.value}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Performance Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-lg" style={{ backgroundColor: '#ffffff !important' }}>
          <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
            <BarChart3 className="h-5 w-5 mr-2 text-blue-600" />
            Execution Performance
          </h3>
          <div className="space-y-4">
            {[
              { label: 'Success Rate', value: '97.3%', color: 'bg-green-500' },
              { label: 'Response Time', value: '1.2s', color: 'bg-blue-500' },
              { label: 'Efficiency Score', value: '94.8%', color: 'bg-purple-500' }
            ].map((metric, index) => (
              <div key={index} className="flex items-center justify-between">
                <span className="text-gray-800 font-medium">{metric.label}</span>
                <div className="flex items-center space-x-3">
                  <div className="w-24 bg-gray-200 rounded-full h-2">
                    <div className={`${metric.color} h-2 rounded-full`} style={{ width: metric.value }}></div>
                  </div>
                  <span className="text-gray-900 font-bold text-sm w-12">{metric.value}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-lg" style={{ backgroundColor: '#ffffff !important' }}>
          <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
            <TrendingUp className="h-5 w-5 mr-2 text-green-600" />
            Growth Metrics
          </h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
              <span className="text-gray-800 font-medium">Monthly Growth</span>
              <span className="text-green-600 font-bold">+42.3%</span>
            </div>
            <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
              <span className="text-gray-800 font-medium">Revenue Impact</span>
              <span className="text-purple-600 font-bold">$127,450</span>
            </div>
            <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
              <span className="text-gray-800 font-medium">Time Saved</span>
              <span className="text-blue-600 font-bold">342.7 hrs</span>
            </div>
          </div>
        </div>
      </div>

      {/* Rule Performance Table */}
      <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-lg" style={{ backgroundColor: '#ffffff !important' }}>
        <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
          <Activity className="h-5 w-5 mr-2 text-orange-600" />
          Top Performing Rules
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 text-gray-800 font-semibold">Rule Name</th>
                <th className="text-left py-3 px-4 text-gray-800 font-semibold">Executions</th>
                <th className="text-left py-3 px-4 text-gray-800 font-semibold">Success Rate</th>
                <th className="text-left py-3 px-4 text-gray-800 font-semibold">Revenue</th>
              </tr>
            </thead>
            <tbody>
              {[
                { name: 'AI-Powered Welcome Sequence', executions: '2,847', success: '98.4%', revenue: '$45,230' },
                { name: 'Revenue Optimization Bot', executions: '8,934', success: '89.2%', revenue: '$67,890' },
                { name: 'Viral Content Amplifier', executions: '1,289', success: '96.8%', revenue: '$12,340' }
              ].map((rule, index) => (
                <tr key={index} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="py-3 px-4 text-gray-900 font-medium">{rule.name}</td>
                  <td className="py-3 px-4 text-gray-800">{rule.executions}</td>
                  <td className="py-3 px-4 text-green-600 font-semibold">{rule.success}</td>
                  <td className="py-3 px-4 text-purple-600 font-semibold">{rule.revenue}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </motion.div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-50" style={{ backgroundColor: '#f8fafc !important' }}>
      <div className="p-8 max-w-7xl mx-auto">
        {/* Premium Navigation Tabs */}
        <Tabs value={selectedTab} onValueChange={setSelectedTab} className="w-full">
          <TabsList className="grid w-full grid-cols-4 bg-white/80 backdrop-blur-sm border border-gray-200 rounded-2xl p-2 shadow-lg">
            <TabsTrigger 
              value="overview" 
              className="text-gray-800 data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-600 data-[state=active]:to-purple-600 data-[state=active]:text-white rounded-xl font-medium hover:text-gray-900"
            >
              <Gauge className="h-4 w-4 mr-2" />
              Overview
            </TabsTrigger>
            <TabsTrigger 
              value="rules"
              className="text-gray-800 data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-600 data-[state=active]:to-purple-600 data-[state=active]:text-white rounded-xl font-medium hover:text-gray-900"
            >
              <Workflow className="h-4 w-4 mr-2" />
              Rules
            </TabsTrigger>
            <TabsTrigger 
              value="analytics"
              className="text-gray-800 data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-600 data-[state=active]:to-purple-600 data-[state=active]:text-white rounded-xl font-medium hover:text-gray-900"
            >
              <BarChart3 className="h-4 w-4 mr-2" />
              Analytics
            </TabsTrigger>
            <TabsTrigger 
              value="settings"
              className="text-gray-800 data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-600 data-[state=active]:to-purple-600 data-[state=active]:text-white rounded-xl font-medium hover:text-gray-900"
            >
              <Settings className="h-4 w-4 mr-2" />
              Settings
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="mt-8">
            {renderOverview()}
          </TabsContent>

          <TabsContent value="rules" className="mt-8">
            {renderRules()}
          </TabsContent>

          <TabsContent value="analytics" className="mt-8">
            {renderAnalytics()}
          </TabsContent>

          <TabsContent value="settings" className="mt-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="space-y-8"
            >
              {/* Settings Header */}
              <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-lg" style={{ backgroundColor: '#ffffff !important' }}>
                <h2 className="text-2xl font-bold text-gray-900 mb-2 flex items-center">
                  <Settings className="h-6 w-6 mr-3 text-blue-600" />
                  Advanced Settings
                </h2>
                <p className="text-gray-700 mb-6">Configure your automation preferences, AI models, and enterprise security settings.</p>
              </div>

              {/* Settings Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* AI Configuration */}
                <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-lg" style={{ backgroundColor: '#ffffff !important' }}>
                  <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                    <Brain className="h-5 w-5 mr-2 text-purple-600" />
                    AI Configuration
                  </h3>
                  <div className="space-y-4">
                    <div>
                      <Label className="text-gray-800 font-medium">AI Model Selection</Label>
                      <Select>
                        <SelectTrigger className="mt-1">
                          <SelectValue placeholder="GPT-4 Advanced (Recommended)" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="gpt4">GPT-4 Advanced</SelectItem>
                          <SelectItem value="gpt35">GPT-3.5 Turbo</SelectItem>
                          <SelectItem value="claude">Claude 3 Opus</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label className="text-gray-800 font-medium">Response Creativity</Label>
                      <div className="mt-2 flex items-center justify-between">
                        <span className="text-sm text-gray-600">Conservative</span>
                        <div className="w-32 h-2 bg-gray-200 rounded-full">
                          <div className="w-20 h-2 bg-purple-600 rounded-full"></div>
                        </div>
                        <span className="text-sm text-gray-600">Creative</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <Label className="text-gray-800 font-medium">Auto-Learning</Label>
                      <Switch defaultChecked />
                    </div>
                  </div>
                </div>

                {/* Security Settings */}
                <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-lg" style={{ backgroundColor: '#ffffff !important' }}>
                  <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                    <Shield className="h-5 w-5 mr-2 text-red-600" />
                    Security & Privacy
                  </h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <Label className="text-gray-800 font-medium">Two-Factor Auth</Label>
                        <p className="text-sm text-gray-600">Enhanced security for automation</p>
                      </div>
                      <Switch defaultChecked />
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <Label className="text-gray-800 font-medium">Data Encryption</Label>
                        <p className="text-sm text-gray-600">End-to-end message encryption</p>
                      </div>
                      <Switch defaultChecked />
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <Label className="text-gray-800 font-medium">Audit Logging</Label>
                        <p className="text-sm text-gray-600">Track all automation activities</p>
                      </div>
                      <Switch defaultChecked />
                    </div>
                  </div>
                </div>

                {/* Performance Settings */}
                <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-lg" style={{ backgroundColor: '#ffffff !important' }}>
                  <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                    <Gauge className="h-5 w-5 mr-2 text-green-600" />
                    Performance Optimization
                  </h3>
                  <div className="space-y-4">
                    <div>
                      <Label className="text-gray-800 font-medium">Execution Speed</Label>
                      <Select>
                        <SelectTrigger className="mt-1">
                          <SelectValue placeholder="Balanced (Recommended)" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="fast">High Speed</SelectItem>
                          <SelectItem value="balanced">Balanced</SelectItem>
                          <SelectItem value="careful">Careful & Precise</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <Label className="text-gray-800 font-medium">Smart Caching</Label>
                        <p className="text-sm text-gray-600">Improve response times</p>
                      </div>
                      <Switch defaultChecked />
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <Label className="text-gray-800 font-medium">Batch Processing</Label>
                        <p className="text-sm text-gray-600">Process multiple requests together</p>
                      </div>
                      <Switch defaultChecked />
                    </div>
                  </div>
                </div>

                {/* Notification Settings */}
                <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-lg" style={{ backgroundColor: '#ffffff !important' }}>
                  <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                    <Bell className="h-5 w-5 mr-2 text-orange-600" />
                    Notification Preferences
                  </h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <Label className="text-gray-800 font-medium">Email Alerts</Label>
                        <p className="text-sm text-gray-600">Critical automation events</p>
                      </div>
                      <Switch defaultChecked />
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <Label className="text-gray-800 font-medium">SMS Notifications</Label>
                        <p className="text-sm text-gray-600">Urgent system alerts</p>
                      </div>
                      <Switch />
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <Label className="text-gray-800 font-medium">Weekly Reports</Label>
                        <p className="text-sm text-gray-600">Performance summaries</p>
                      </div>
                      <Switch defaultChecked />
                    </div>
                  </div>
                </div>
              </div>

              {/* Advanced Configuration */}
              <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-lg" style={{ backgroundColor: '#ffffff !important' }}>
                <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                  <Command className="h-5 w-5 mr-2 text-indigo-600" />
                  Advanced Configuration
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label className="text-gray-800 font-medium">API Rate Limits</Label>
                    <Input 
                      className="mt-1" 
                      placeholder="1000 requests/hour"
                      defaultValue="1000"
                    />
                  </div>
                  <div>
                    <Label className="text-gray-800 font-medium">Webhook Timeout</Label>
                    <Input 
                      className="mt-1" 
                      placeholder="30 seconds"
                      defaultValue="30"
                    />
                  </div>
                  <div>
                    <Label className="text-gray-800 font-medium">Retry Attempts</Label>
                    <Input 
                      className="mt-1" 
                      placeholder="3 attempts"
                      defaultValue="3"
                    />
                  </div>
                  <div>
                    <Label className="text-gray-800 font-medium">Max Queue Size</Label>
                    <Input 
                      className="mt-1" 
                      placeholder="1000 items"
                      defaultValue="1000"
                    />
                  </div>
                </div>
                <div className="mt-6">
                  <Label className="text-gray-800 font-medium">Custom API Endpoints</Label>
                  <Textarea 
                    className="mt-1" 
                    placeholder="Enter custom webhook URLs (one per line)"
                    rows={3}
                  />
                </div>
              </div>

              {/* Save Settings */}
              <div className="flex justify-end space-x-4">
                <Button variant="outline" className="text-gray-700 border-gray-300">
                  Reset to Default
                </Button>
                <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white">
                  Save Settings
                </Button>
              </div>
            </motion.div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}