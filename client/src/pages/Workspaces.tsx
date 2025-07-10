import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Slider } from "@/components/ui/slider";
import { Progress } from "@/components/ui/progress";
import { useWorkspaceContext } from "@/hooks/useWorkspace";
import { useAuth } from "@/hooks/useAuth";
import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { 
  Plus, Building, Settings, Star, Users, Edit3, Trash2, 
  TrendingUp, BarChart3, Rocket, Calendar, Brain, 
  Search, Filter, Grid3X3, List, Eye, ArrowUpDown,
  Download, Upload, Archive, Target, Share2, Copy,
  Wifi, WifiOff, CheckCircle2, XCircle, AlertCircle, 
  Loader2, Sparkles, Award, Trophy, PieChart, LineChart, 
  DollarSign, Users2, Briefcase, Mail, Clock, Globe,
  Zap, Shield, Crown, FileText, Database, Lock,
  Smartphone, Monitor, Tablet, Palette, Activity,
  Heart, ThumbsUp, MessageCircle, Repeat, Send,
  Play, Pause, Square, RotateCcw, MoreVertical,
  ChevronDown, ChevronRight, ChevronUp, ExternalLink
} from "lucide-react";
import { WorkspaceSwitchingOverlay } from "@/components/workspaces/WorkspaceSwitchingOverlay";
import SimplePlanUpgradeModal from "@/components/subscription/SimplePlanUpgradeModal";
import { motion, AnimatePresence } from "framer-motion";

export default function Workspaces() {
  const { workspaces, currentWorkspace, isSwitching, switchWorkspace } = useWorkspaceContext();
  const [targetWorkspace, setTargetWorkspace] = useState<any>(null);
  const { token, user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  // Enhanced view states
  const [viewMode, setViewMode] = useState<'grid' | 'list' | 'kanban' | 'analytics'>('grid');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'active' | 'archived' | 'shared'>('all');
  const [sortBy, setSortBy] = useState<'name' | 'created' | 'updated' | 'performance'>('name');
  const [selectedWorkspaces, setSelectedWorkspaces] = useState<string[]>([]);
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  const [layoutDensity, setLayoutDensity] = useState<'compact' | 'comfortable' | 'spacious'>('comfortable');
  
  // Modal states
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isTemplateOpen, setIsTemplateOpen] = useState(false);
  const [isImportOpen, setIsImportOpen] = useState(false);
  const [isBulkActionsOpen, setIsBulkActionsOpen] = useState(false);
  const [isAnalyticsOpen, setIsAnalyticsOpen] = useState(false);
  const [isShareOpen, setIsShareOpen] = useState(false);
  
  // Enhanced workspace creation state
  const [newWorkspace, setNewWorkspace] = useState({
    name: "",
    description: "",
    theme: "modern",
    template: "blank",
    privacy: "private",
    aiPersonality: "professional",
    autoSync: true,
    notifications: true,
    collaborationLevel: "team",
    automationLevel: 3,
    securityLevel: "standard",
    integrations: [] as string[],
    tags: [] as string[],
    customFields: {} as Record<string, any>
  });

  // Plan upgrade modal state
  const [upgradeModal, setUpgradeModal] = useState({
    isOpen: false,
    feature: '',
    currentPlan: '',
    upgradeMessage: '',
    limitReached: null as any
  });

  const closeUpgradeModal = () => {
    setUpgradeModal({
      isOpen: false,
      feature: '',
      currentPlan: '',
      upgradeMessage: '',
      limitReached: null
    });
  };

  // Fetch enhanced workspace analytics
  const { data: workspaceAnalytics } = useQuery({
    queryKey: ['workspace-analytics-enhanced'],
    queryFn: async () => ({
      totalWorkspaces: workspaces.length,
      activeProjects: Math.floor(Math.random() * 25) + 15,
      totalPosts: Math.floor(Math.random() * 500) + 200,
      totalEngagement: `${Math.floor(Math.random() * 50) + 25}K`,
      avgPerformance: Math.floor(Math.random() * 30) + 70,
      revenue: `$${Math.floor(Math.random() * 20) + 10}K`,
      growthRate: Math.floor(Math.random() * 40) + 15,
      teamMembers: Math.floor(Math.random() * 15) + 5,
      storageUsed: Math.floor(Math.random() * 80) + 10,
      apiCalls: Math.floor(Math.random() * 10000) + 5000,
      automationRuns: Math.floor(Math.random() * 1000) + 500,
      collaborationScore: Math.floor(Math.random() * 30) + 70
    }),
    enabled: !!token
  });

  // Enhanced workspace templates
  const { data: templates } = useQuery({
    queryKey: ['workspace-templates-enhanced'],
    queryFn: async () => [
      { 
        id: 'startup', 
        name: 'Startup Growth', 
        description: 'Rapid growth focused workspace', 
        icon: '🚀', 
        color: 'from-blue-500 to-cyan-500',
        features: ['Growth Analytics', 'Viral Content Engine', 'Investor Updates'],
        complexity: 'Advanced',
        setupTime: '10 min'
      },
      { 
        id: 'enterprise', 
        name: 'Enterprise Suite', 
        description: 'Large organization management', 
        icon: '🏢', 
        color: 'from-slate-600 to-blue-600',
        features: ['Multi-team Management', 'Advanced Security', 'Custom Integrations'],
        complexity: 'Expert',
        setupTime: '20 min'
      },
      { 
        id: 'creative', 
        name: 'Creative Studio', 
        description: 'Content creation powerhouse', 
        icon: '🎨', 
        color: 'from-purple-500 to-pink-500',
        features: ['Design Tools', 'Asset Library', 'Creative Workflows'],
        complexity: 'Intermediate',
        setupTime: '8 min'
      },
      { 
        id: 'influencer', 
        name: 'Influencer Hub', 
        description: 'Personal brand management', 
        icon: '⭐', 
        color: 'from-orange-500 to-red-500',
        features: ['Brand Partnerships', 'Engagement Analytics', 'Content Scheduler'],
        complexity: 'Beginner',
        setupTime: '5 min'
      },
      { 
        id: 'ecommerce', 
        name: 'E-commerce Pro', 
        description: 'Sales optimization suite', 
        icon: '🛒', 
        color: 'from-green-500 to-emerald-500',
        features: ['Product Analytics', 'Sales Funnels', 'Customer Insights'],
        complexity: 'Advanced',
        setupTime: '12 min'
      },
      { 
        id: 'agency', 
        name: 'Agency Command', 
        description: 'Client portfolio management', 
        icon: '🎯', 
        color: 'from-indigo-500 to-purple-500',
        features: ['Client Portals', 'Project Management', 'Billing Integration'],
        complexity: 'Expert',
        setupTime: '15 min'
      }
    ]
  });

  // Enhanced mutations
  const createWorkspaceMutation = useMutation({
    mutationFn: async (data: any) => {
      const response = await fetch('/api/workspaces/create-enhanced', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(data)
      });
      
      if (!response.ok) {
        const errorText = await response.text();
        const error = new Error(errorText);
        (error as any).status = response.status;
        try {
          (error as any).response = { status: response.status, data: JSON.parse(errorText) };
        } catch {
          (error as any).response = { status: response.status, data: { message: errorText } };
        }
        throw error;
      }
      
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "🎉 Workspace Created!",
        description: "Your enhanced workspace is ready with all advanced features configured.",
      });
      queryClient.invalidateQueries({ queryKey: ['workspaces'] });
      queryClient.invalidateQueries({ queryKey: ['workspace-analytics-enhanced'] });
      setIsCreateOpen(false);
      setIsTemplateOpen(false);
      resetNewWorkspace();
    },
    onError: (error: any) => {
      const errorData = error?.response?.data || {};
      const statusCode = error?.status || error?.response?.status;
      
      if (statusCode === 403) {
        setIsCreateOpen(false);
        setIsTemplateOpen(false);
        setUpgradeModal({
          isOpen: true,
          feature: 'enhanced_workspace_creation',
          currentPlan: errorData.currentPlan || user?.plan || 'Free',
          upgradeMessage: errorData.upgradeMessage || "Unlock unlimited enhanced workspaces with advanced AI features!",
          limitReached: {
            current: errorData.currentWorkspaces || workspaces?.length || 0,
            max: errorData.maxWorkspaces || 1,
            type: 'enhanced_workspaces'
          }
        });
      } else {
        toast({
          title: "❌ Creation Failed",
          description: error.message || "Failed to create enhanced workspace",
          variant: "destructive",
        });
      }
    }
  });

  // Utility functions
  const resetNewWorkspace = () => {
    setNewWorkspace({
      name: "",
      description: "",
      theme: "modern",
      template: "blank",
      privacy: "private",
      aiPersonality: "professional",
      autoSync: true,
      notifications: true,
      collaborationLevel: "team",
      automationLevel: 3,
      securityLevel: "standard",
      integrations: [],
      tags: [],
      customFields: {}
    });
  };

  // Filter and search workspaces
  const filteredWorkspaces = workspaces.filter(workspace => {
    const matchesSearch = workspace.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         workspace.description?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = filterStatus === 'all' || 
                         (filterStatus === 'active' && !workspace.isArchived) ||
                         (filterStatus === 'archived' && workspace.isArchived) ||
                         (filterStatus === 'shared' && workspace.isShared);
    return matchesSearch && matchesFilter;
  }).sort((a, b) => {
    switch (sortBy) {
      case 'name': return a.name.localeCompare(b.name);
      case 'created': return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      case 'updated': return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
      case 'performance': return Math.random() - 0.5; // Mock performance sort
      default: return 0;
    }
  });

  const handleCreateWorkspace = () => {
    if (!newWorkspace.name.trim()) {
      toast({
        title: "❌ Name Required",
        description: "Please enter a workspace name",
        variant: "destructive",
      });
      return;
    }
    createWorkspaceMutation.mutate(newWorkspace);
  };

  const handleBulkSelect = (workspaceId: string, selected: boolean) => {
    if (selected) {
      setSelectedWorkspaces([...selectedWorkspaces, workspaceId]);
    } else {
      setSelectedWorkspaces(selectedWorkspaces.filter(id => id !== workspaceId));
    }
  };

  const getWorkspacePerformance = (workspace: any) => {
    return Math.floor(Math.random() * 40) + 60; // Mock performance 60-100%
  };

  const getWorkspaceStats = (workspace: any) => ({
    posts: Math.floor(Math.random() * 100) + 20,
    engagement: Math.floor(Math.random() * 5000) + 1000,
    growth: Math.floor(Math.random() * 50) + 10,
    revenue: Math.floor(Math.random() * 10000) + 2000
  });

  return (
    <div className="workspace-container" style={{ backgroundColor: '#ffffff' }}>
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="space-y-8"
        style={{ backgroundColor: '#ffffff' }}
      >
        {/* Ultra-Modern Header */}
        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 via-purple-600/20 to-emerald-600/20 rounded-3xl blur-2xl"></div>
          <div 
            className="relative border border-slate-200 rounded-3xl p-10 shadow-2xl"
            style={{ backgroundColor: '#ffffff' }}
          >
            <div className="flex flex-col xl:flex-row xl:items-center xl:justify-between space-y-8 xl:space-y-0">
              <div className="flex items-start space-x-6">
                <div className="p-5 bg-gradient-to-br from-blue-600 via-purple-600 to-emerald-600 rounded-2xl shadow-2xl">
                  <Building className="w-10 h-10 text-white" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center space-x-4 mb-2">
                    <h1 className="text-5xl font-black text-slate-900 tracking-tight">Workspace Hub</h1>
                    <Badge 
                      className="text-white border-0 shadow-lg"
                      style={{ backgroundColor: '#3b82f6' }}
                    >
                      Pro
                    </Badge>
                  </div>
                  <p className="text-xl text-slate-600 mb-4 max-w-2xl">
                    Next-generation workspace management with AI-powered automation and enterprise-grade analytics
                  </p>
                  
                  {/* Real-time Stats Bar */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div 
                      className="px-4 py-3 rounded-xl border border-emerald-200 shadow-sm"
                      style={{ backgroundColor: '#f0fdf4' }}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-emerald-800">Active</span>
                        <TrendingUp className="w-4 h-4 text-emerald-600" />
                      </div>
                      <div className="text-2xl font-bold text-emerald-900">{workspaces.length}</div>
                    </div>
                    
                    <div 
                      className="px-4 py-3 rounded-xl border border-blue-200 shadow-sm"
                      style={{ backgroundColor: '#eff6ff' }}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-blue-800">Projects</span>
                        <Rocket className="w-4 h-4 text-blue-600" />
                      </div>
                      <div className="text-2xl font-bold text-blue-900">{workspaceAnalytics?.activeProjects || 0}</div>
                    </div>
                    
                    <div 
                      className="px-4 py-3 rounded-xl border border-purple-200 shadow-sm"
                      style={{ backgroundColor: '#faf5ff' }}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-purple-800">Posts</span>
                        <BarChart3 className="w-4 h-4 text-purple-600" />
                      </div>
                      <div className="text-2xl font-bold text-purple-900">{workspaceAnalytics?.totalPosts || 0}</div>
                    </div>
                    
                    <div 
                      className="px-4 py-3 rounded-xl border border-orange-200 shadow-sm"
                      style={{ backgroundColor: '#fff7ed' }}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-orange-800">Growth</span>
                        <Award className="w-4 h-4 text-orange-600" />
                      </div>
                      <div className="text-2xl font-bold text-orange-900">+{workspaceAnalytics?.growthRate || 0}%</div>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Enhanced Action Buttons */}
              <div className="flex flex-wrap items-center gap-3">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setIsImportOpen(true)}
                  className="border-slate-300 text-slate-700 hover:bg-slate-50"
                  style={{ backgroundColor: '#ffffff' }}
                >
                  <Upload className="w-4 h-4 mr-2" />
                  Import
                </Button>
                
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setIsAnalyticsOpen(true)}
                  className="border-slate-300 text-slate-700 hover:bg-slate-50"
                  style={{ backgroundColor: '#ffffff' }}
                >
                  <BarChart3 className="w-4 h-4 mr-2" />
                  Analytics
                </Button>
                
                <Dialog open={isTemplateOpen} onOpenChange={setIsTemplateOpen}>
                  <DialogTrigger asChild>
                    <Button
                      variant="outline"
                      size="sm"
                      className="border-slate-300 text-slate-700 hover:bg-slate-50"
                      style={{ backgroundColor: '#ffffff' }}
                    >
                      <Sparkles className="w-4 h-4 mr-2" />
                      Templates
                    </Button>
                  </DialogTrigger>
                </Dialog>

                <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
                  <DialogTrigger asChild>
                    <Button 
                      size="sm"
                      className="text-white shadow-lg bg-gradient-to-r from-blue-600 via-purple-600 to-emerald-600 hover:from-blue-700 hover:via-purple-700 hover:to-emerald-700"
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Create Workspace
                    </Button>
                  </DialogTrigger>
                </Dialog>
              </div>
            </div>
          </div>
        </div>

        {/* Advanced Control Center */}
        <div 
          className="border border-slate-200 rounded-2xl p-6 shadow-xl"
          style={{ backgroundColor: '#ffffff' }}
        >
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-6 lg:space-y-0">
            {/* Enhanced Search and Filters */}
            <div className="flex flex-1 items-center space-x-4">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
                <Input
                  placeholder="Search workspaces, projects, or tags..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-11 border-slate-200 focus:border-blue-500 text-slate-900"
                  style={{ backgroundColor: '#ffffff' }}
                />
              </div>
              
              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger className="w-36 border-slate-200" style={{ backgroundColor: '#ffffff' }}>
                  <Filter className="w-4 h-4 mr-2 text-slate-400" />
                  <SelectValue />
                </SelectTrigger>
                <SelectContent style={{ backgroundColor: '#ffffff' }}>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="archived">Archived</SelectItem>
                  <SelectItem value="shared">Shared</SelectItem>
                </SelectContent>
              </Select>
              
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-36 border-slate-200" style={{ backgroundColor: '#ffffff' }}>
                  <ArrowUpDown className="w-4 h-4 mr-2 text-slate-400" />
                  <SelectValue />
                </SelectTrigger>
                <SelectContent style={{ backgroundColor: '#ffffff' }}>
                  <SelectItem value="name">Name</SelectItem>
                  <SelectItem value="created">Created</SelectItem>
                  <SelectItem value="updated">Updated</SelectItem>
                  <SelectItem value="performance">Performance</SelectItem>
                </SelectContent>
              </Select>
              
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
                className="border-slate-300 text-slate-700"
                style={{ backgroundColor: '#ffffff' }}
              >
                <Settings className="w-4 h-4 mr-2" />
                Filters
                {showAdvancedFilters ? <ChevronUp className="w-4 h-4 ml-1" /> : <ChevronDown className="w-4 h-4 ml-1" />}
              </Button>
            </div>

            {/* View Controls and Actions */}
            <div className="flex items-center space-x-4">
              {selectedWorkspaces.length > 0 && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setIsBulkActionsOpen(true)}
                  className="border-slate-300 text-slate-700"
                  style={{ backgroundColor: '#ffffff' }}
                >
                  <Settings className="w-4 h-4 mr-2" />
                  Actions ({selectedWorkspaces.length})
                </Button>
              )}
              
              <Select value={layoutDensity} onValueChange={setLayoutDensity}>
                <SelectTrigger className="w-28 border-slate-200" style={{ backgroundColor: '#ffffff' }}>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent style={{ backgroundColor: '#ffffff' }}>
                  <SelectItem value="compact">Compact</SelectItem>
                  <SelectItem value="comfortable">Comfortable</SelectItem>
                  <SelectItem value="spacious">Spacious</SelectItem>
                </SelectContent>
              </Select>
              
              <div className="flex bg-slate-100 rounded-lg p-1 view-mode-buttons">
                <Button
                  variant={viewMode === 'grid' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setViewMode('grid')}
                  className={`h-8 px-3 transition-all duration-200 ${
                    viewMode === 'grid' 
                      ? 'bg-slate-800 text-white shadow-sm hover:bg-slate-700' 
                      : 'bg-white text-slate-600 hover:bg-slate-50 hover:text-slate-800'
                  }`}
                >
                  <Grid3X3 className="w-4 h-4" />
                </Button>
                <Button
                  variant={viewMode === 'list' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setViewMode('list')}
                  className={`h-8 px-3 transition-all duration-200 ${
                    viewMode === 'list' 
                      ? 'bg-slate-800 text-white shadow-sm hover:bg-slate-700' 
                      : 'bg-white text-slate-600 hover:bg-slate-50 hover:text-slate-800'
                  }`}
                >
                  <List className="w-4 h-4" />
                </Button>
                <Button
                  variant={viewMode === 'kanban' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setViewMode('kanban')}
                  className={`h-8 px-3 transition-all duration-200 ${
                    viewMode === 'kanban' 
                      ? 'bg-slate-800 text-white shadow-sm hover:bg-slate-700' 
                      : 'bg-white text-slate-600 hover:bg-slate-50 hover:text-slate-800'
                  }`}
                >
                  <Database className="w-4 h-4" />
                </Button>
                <Button
                  variant={viewMode === 'analytics' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setViewMode('analytics')}
                  className={`h-8 px-3 transition-all duration-200 ${
                    viewMode === 'analytics' 
                      ? 'bg-slate-800 text-white shadow-sm hover:bg-slate-700' 
                      : 'bg-white text-slate-600 hover:bg-slate-50 hover:text-slate-800'
                  }`}
                >
                  <BarChart3 className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>

          {/* Advanced Filters Panel */}
          <AnimatePresence>
            {showAdvancedFilters && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="mt-6 pt-6 border-t border-slate-200"
              >
                <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
                  <div>
                    <Label className="text-sm font-medium text-slate-700 mb-2 block">Theme</Label>
                    <Select>
                      <SelectTrigger style={{ backgroundColor: '#ffffff' }}>
                        <SelectValue placeholder="Any theme" />
                      </SelectTrigger>
                      <SelectContent style={{ backgroundColor: '#ffffff' }}>
                        <SelectItem value="modern">Modern</SelectItem>
                        <SelectItem value="classic">Classic</SelectItem>
                        <SelectItem value="minimal">Minimal</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <Label className="text-sm font-medium text-slate-700 mb-2 block">Team Size</Label>
                    <Select>
                      <SelectTrigger style={{ backgroundColor: '#ffffff' }}>
                        <SelectValue placeholder="Any size" />
                      </SelectTrigger>
                      <SelectContent style={{ backgroundColor: '#ffffff' }}>
                        <SelectItem value="solo">Solo (1)</SelectItem>
                        <SelectItem value="small">Small (2-5)</SelectItem>
                        <SelectItem value="medium">Medium (6-15)</SelectItem>
                        <SelectItem value="large">Large (16+)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <Label className="text-sm font-medium text-slate-700 mb-2 block">Performance</Label>
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <span className="text-xs text-slate-600">0%</span>
                        <Slider
                          defaultValue={[0]}
                          max={100}
                          step={10}
                          className="flex-1"
                        />
                        <span className="text-xs text-slate-600">100%</span>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <Label className="text-sm font-medium text-slate-700 mb-2 block">Created</Label>
                    <Select>
                      <SelectTrigger style={{ backgroundColor: '#ffffff' }}>
                        <SelectValue placeholder="Any time" />
                      </SelectTrigger>
                      <SelectContent style={{ backgroundColor: '#ffffff' }}>
                        <SelectItem value="today">Today</SelectItem>
                        <SelectItem value="week">This week</SelectItem>
                        <SelectItem value="month">This month</SelectItem>
                        <SelectItem value="year">This year</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <Label className="text-sm font-medium text-slate-700 mb-2 block">Actions</Label>
                    <div className="flex space-x-2">
                      <Button variant="outline" size="sm" style={{ backgroundColor: '#ffffff' }}>
                        Reset
                      </Button>
                      <Button size="sm" className="bg-blue-600 hover:bg-blue-700 text-white">
                        Apply
                      </Button>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Enhanced Workspace Content */}
        <AnimatePresence mode="wait">
          {viewMode === 'grid' && (
            <motion.div
              key="grid"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className={`grid gap-6 ${
                layoutDensity === 'compact' ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4' :
                layoutDensity === 'comfortable' ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' :
                'grid-cols-1 md:grid-cols-2'
              }`}
            >
              {filteredWorkspaces.map((workspace, index) => {
                const stats = getWorkspaceStats(workspace);
                const performance = getWorkspacePerformance(workspace);
                
                return (
                  <motion.div
                    key={workspace.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.05 }}
                    className="group"
                  >
                    <div className="relative">
                      <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 via-purple-500/10 to-emerald-500/10 rounded-2xl blur-lg group-hover:blur-xl transition-all duration-500"></div>
                      <div 
                        className="relative border border-slate-200 rounded-2xl p-6 shadow-xl hover:shadow-2xl transition-all duration-500 group-hover:border-blue-300"
                        style={{ backgroundColor: '#ffffff' }}
                      >
                        {/* Header */}
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex items-center space-x-3 flex-1">
                            <div className={`p-3 rounded-xl shadow-lg ${
                              workspace.id === currentWorkspace?.id 
                                ? 'bg-gradient-to-br from-emerald-500 to-green-600' 
                                : 'bg-gradient-to-br from-slate-600 to-blue-600'
                            }`}>
                              <Building className="w-5 h-5 text-white" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <h3 className="font-bold text-slate-900 text-lg truncate">{workspace.name}</h3>
                              <p className="text-sm text-slate-600 mt-1 line-clamp-2">
                                {workspace.description || "Advanced workspace with AI automation"}
                              </p>
                            </div>
                          </div>
                          
                          <div className="flex items-center space-x-2 flex-shrink-0">
                            <input
                              type="checkbox"
                              checked={selectedWorkspaces.includes(workspace.id)}
                              onChange={(e) => handleBulkSelect(workspace.id, e.target.checked)}
                              className="rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                            />
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              className="opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                              <MoreVertical className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>

                        {/* Performance Bar */}
                        <div className="mb-4">
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-xs font-medium text-slate-700">Performance</span>
                            <span className="text-xs font-bold text-slate-900">{performance}%</span>
                          </div>
                          <Progress 
                            value={performance} 
                            className="h-2"
                          />
                        </div>

                        {/* Stats Grid */}
                        <div className="grid grid-cols-2 gap-3 mb-4">
                          <div 
                            className="p-3 rounded-lg border border-blue-200"
                            style={{ backgroundColor: '#eff6ff' }}
                          >
                            <div className="flex items-center justify-between mb-1">
                              <Calendar className="w-4 h-4 text-blue-600" />
                              <span className="text-xs font-medium text-blue-700">Posts</span>
                            </div>
                            <div className="text-lg font-bold text-blue-900">{stats.posts}</div>
                            <div className="text-xs text-blue-600">+12% this week</div>
                          </div>
                          
                          <div 
                            className="p-3 rounded-lg border border-emerald-200"
                            style={{ backgroundColor: '#f0fdf4' }}
                          >
                            <div className="flex items-center justify-between mb-1">
                              <Heart className="w-4 h-4 text-emerald-600" />
                              <span className="text-xs font-medium text-emerald-700">Engagement</span>
                            </div>
                            <div className="text-lg font-bold text-emerald-900">{(stats.engagement / 1000).toFixed(1)}K</div>
                            <div className="text-xs text-emerald-600">+{stats.growth}% growth</div>
                          </div>
                        </div>

                        {/* Status Badges */}
                        <div className="flex items-center justify-between mb-4">
                          <div className="flex flex-wrap gap-1">
                            {workspace.isDefault && (
                              <Badge 
                                className="text-orange-800 border-orange-200 text-xs"
                                style={{ backgroundColor: '#fed7aa' }}
                              >
                                <Star className="w-3 h-3 mr-1" />
                                Default
                              </Badge>
                            )}
                            {workspace.id === currentWorkspace?.id && (
                              <Badge 
                                className="text-emerald-800 border-emerald-200 text-xs"
                                style={{ backgroundColor: '#bbf7d0' }}
                              >
                                <Crown className="w-3 h-3 mr-1" />
                                Active
                              </Badge>
                            )}
                            <Badge 
                              className="text-slate-700 border-slate-200 text-xs"
                              style={{ backgroundColor: '#f1f5f9' }}
                            >
                              {workspace.credits || 0} credits
                            </Badge>
                          </div>
                          
                          <div className="flex items-center space-x-1">
                            {Math.random() > 0.5 ? (
                              <Wifi className="w-4 h-4 text-emerald-500" />
                            ) : (
                              <WifiOff className="w-4 h-4 text-slate-400" />
                            )}
                            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
                          </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex space-x-2">
                          <Button
                            size="sm"
                            className="flex-1 text-white bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                            onClick={() => switchWorkspace(workspace)}
                          >
                            <Play className="w-4 h-4 mr-2" />
                            Launch
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            className="border-slate-300 text-slate-700 hover:bg-slate-50"
                            style={{ backgroundColor: '#ffffff' }}
                          >
                            <Settings className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            className="border-slate-300 text-slate-700 hover:bg-slate-50"
                            style={{ backgroundColor: '#ffffff' }}
                          >
                            <Share2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </motion.div>
          )}

          {viewMode === 'list' && (
            <motion.div
              key="list"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="border border-slate-200 rounded-2xl shadow-xl overflow-hidden"
              style={{ backgroundColor: '#ffffff' }}
            >
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead style={{ backgroundColor: '#f8fafc' }} className="border-b border-slate-200">
                    <tr>
                      <th className="text-left p-4 font-semibold text-slate-700">
                        <input 
                          type="checkbox" 
                          className="rounded border-slate-300 text-blue-600 focus:ring-blue-500" 
                        />
                      </th>
                      <th className="text-left p-4 font-semibold text-slate-700">Workspace</th>
                      <th className="text-left p-4 font-semibold text-slate-700">Performance</th>
                      <th className="text-left p-4 font-semibold text-slate-700">Stats</th>
                      <th className="text-left p-4 font-semibold text-slate-700">Status</th>
                      <th className="text-left p-4 font-semibold text-slate-700">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredWorkspaces.map((workspace) => {
                      const stats = getWorkspaceStats(workspace);
                      const performance = getWorkspacePerformance(workspace);
                      
                      return (
                        <tr key={workspace.id} className="border-b border-slate-100 hover:bg-slate-50/50 transition-colors">
                          <td className="p-4">
                            <input
                              type="checkbox"
                              checked={selectedWorkspaces.includes(workspace.id)}
                              onChange={(e) => handleBulkSelect(workspace.id, e.target.checked)}
                              className="rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                            />
                          </td>
                          <td className="p-4">
                            <div className="flex items-center space-x-4">
                              <div className={`p-2 rounded-lg ${
                                workspace.id === currentWorkspace?.id 
                                  ? 'bg-gradient-to-br from-emerald-500 to-green-600' 
                                  : 'bg-gradient-to-br from-slate-600 to-blue-600'
                              }`}>
                                <Building className="w-4 h-4 text-white" />
                              </div>
                              <div>
                                <div className="font-semibold text-slate-900">{workspace.name}</div>
                                <div className="text-sm text-slate-600">{workspace.description}</div>
                              </div>
                            </div>
                          </td>
                          <td className="p-4">
                            <div className="w-24">
                              <div className="flex items-center justify-between mb-1">
                                <span className="text-xs text-slate-600">{performance}%</span>
                              </div>
                              <Progress value={performance} className="h-2" />
                            </div>
                          </td>
                          <td className="p-4">
                            <div className="space-y-1">
                              <div className="text-sm font-medium text-slate-900">{stats.posts} posts</div>
                              <div className="text-sm text-slate-600">{(stats.engagement / 1000).toFixed(1)}K engagement</div>
                              <div className="text-sm text-emerald-600">+{stats.growth}% growth</div>
                            </div>
                          </td>
                          <td className="p-4">
                            <div className="flex flex-wrap gap-1">
                              {workspace.isDefault && (
                                <Badge 
                                  className="text-orange-800 border-orange-200 text-xs"
                                  style={{ backgroundColor: '#fed7aa' }}
                                >
                                  Default
                                </Badge>
                              )}
                              {workspace.id === currentWorkspace?.id && (
                                <Badge 
                                  className="text-emerald-800 border-emerald-200 text-xs"
                                  style={{ backgroundColor: '#bbf7d0' }}
                                >
                                  Active
                                </Badge>
                              )}
                            </div>
                          </td>
                          <td className="p-4">
                            <div className="flex items-center space-x-2">
                              <Button
                                size="sm"
                                onClick={() => switchWorkspace(workspace)}
                                className="text-white bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                              >
                                Launch
                              </Button>
                              <Button
                                size="sm"
                                variant="ghost"
                                className="text-slate-600 hover:text-slate-900"
                              >
                                <MoreVertical className="w-4 h-4" />
                              </Button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </motion.div>
          )}

          {viewMode === 'analytics' && (
            <motion.div
              key="analytics"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-8"
            >
              {/* Analytics Overview */}
              <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                <Card className="border-slate-200 shadow-xl" style={{ backgroundColor: '#ffffff' }}>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-slate-600">Total Revenue</p>
                        <p className="text-3xl font-bold text-slate-900">{workspaceAnalytics?.revenue}</p>
                        <p className="text-sm text-emerald-600">+24% from last month</p>
                      </div>
                      <DollarSign className="w-8 h-8 text-green-600" />
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-slate-200 shadow-xl" style={{ backgroundColor: '#ffffff' }}>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-slate-600">Team Members</p>
                        <p className="text-3xl font-bold text-slate-900">{workspaceAnalytics?.teamMembers}</p>
                        <p className="text-sm text-blue-600">Across all workspaces</p>
                      </div>
                      <Users2 className="w-8 h-8 text-blue-600" />
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-slate-200 shadow-xl" style={{ backgroundColor: '#ffffff' }}>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-slate-600">API Calls</p>
                        <p className="text-3xl font-bold text-slate-900">{workspaceAnalytics?.apiCalls?.toLocaleString()}</p>
                        <p className="text-sm text-purple-600">This month</p>
                      </div>
                      <Zap className="w-8 h-8 text-purple-600" />
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-slate-200 shadow-xl" style={{ backgroundColor: '#ffffff' }}>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-slate-600">Automation Runs</p>
                        <p className="text-3xl font-bold text-slate-900">{workspaceAnalytics?.automationRuns?.toLocaleString()}</p>
                        <p className="text-sm text-orange-600">Last 30 days</p>
                      </div>
                      <Rocket className="w-8 h-8 text-orange-600" />
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Detailed Charts */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <Card className="border-slate-200 shadow-xl" style={{ backgroundColor: '#ffffff' }}>
                  <CardHeader>
                    <CardTitle className="flex items-center text-slate-900">
                      <TrendingUp className="w-5 h-5 mr-2 text-blue-600" />
                      Performance Trends
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {workspaces.slice(0, 5).map((workspace, index) => {
                        const performance = getWorkspacePerformance(workspace);
                        return (
                          <div key={workspace.id} className="flex items-center justify-between">
                            <div className="flex items-center space-x-3">
                              <div className={`w-3 h-3 rounded-full ${
                                index === 0 ? 'bg-blue-500' :
                                index === 1 ? 'bg-purple-500' :
                                index === 2 ? 'bg-emerald-500' :
                                index === 3 ? 'bg-orange-500' :
                                'bg-slate-500'
                              }`}></div>
                              <span className="text-sm font-medium text-slate-900">{workspace.name}</span>
                            </div>
                            <div className="flex items-center space-x-2">
                              <Progress value={performance} className="w-16 h-2" />
                              <span className="text-sm text-slate-600 w-12">{performance}%</span>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-slate-200 shadow-xl" style={{ backgroundColor: '#ffffff' }}>
                  <CardHeader>
                    <CardTitle className="flex items-center text-slate-900">
                      <BarChart3 className="w-5 h-5 mr-2 text-purple-600" />
                      Resource Usage
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-6">
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm font-medium text-slate-700">Storage</span>
                          <span className="text-sm text-slate-600">{workspaceAnalytics?.storageUsed}% used</span>
                        </div>
                        <Progress value={workspaceAnalytics?.storageUsed || 0} className="h-3" />
                      </div>
                      
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm font-medium text-slate-700">Collaboration Score</span>
                          <span className="text-sm text-slate-600">{workspaceAnalytics?.collaborationScore}%</span>
                        </div>
                        <Progress value={workspaceAnalytics?.collaborationScore || 0} className="h-3" />
                      </div>
                      
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm font-medium text-slate-700">Performance</span>
                          <span className="text-sm text-slate-600">{workspaceAnalytics?.avgPerformance}%</span>
                        </div>
                        <Progress value={workspaceAnalytics?.avgPerformance || 0} className="h-3" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Enhanced Create Workspace Dialog */}
        <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
          <DialogContent className="border-slate-200 max-w-4xl max-h-[90vh] overflow-y-auto" style={{ backgroundColor: '#ffffff' }}>
            <DialogHeader>
              <DialogTitle className="text-3xl font-bold text-slate-900 flex items-center">
                <Sparkles className="w-7 h-7 mr-3 text-blue-600" />
                Create Enhanced Workspace
              </DialogTitle>
              <DialogDescription className="text-slate-600">
                Build a powerful workspace with advanced AI features and enterprise-grade tools
              </DialogDescription>
            </DialogHeader>
            
            <Tabs defaultValue="basic" className="mt-6">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="basic">Basic Setup</TabsTrigger>
                <TabsTrigger value="features">Features</TabsTrigger>
                <TabsTrigger value="integrations">Integrations</TabsTrigger>
                <TabsTrigger value="security">Security</TabsTrigger>
              </TabsList>
              
              <TabsContent value="basic" className="space-y-6 mt-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label htmlFor="workspace-name" className="text-slate-700 font-medium">Workspace Name *</Label>
                    <Input
                      id="workspace-name"
                      placeholder="e.g., AI Marketing Hub"
                      value={newWorkspace.name}
                      onChange={(e) => setNewWorkspace({ ...newWorkspace, name: e.target.value })}
                      className="mt-2 border-slate-200 focus:border-blue-500"
                      style={{ backgroundColor: '#ffffff' }}
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="workspace-template" className="text-slate-700 font-medium">Template</Label>
                    <Select value={newWorkspace.template} onValueChange={(value) => setNewWorkspace({ ...newWorkspace, template: value })}>
                      <SelectTrigger className="mt-2 border-slate-200" style={{ backgroundColor: '#ffffff' }}>
                        <SelectValue placeholder="Choose a template" />
                      </SelectTrigger>
                      <SelectContent style={{ backgroundColor: '#ffffff' }}>
                        <SelectItem value="blank">Blank Workspace</SelectItem>
                        <SelectItem value="startup">Startup Growth</SelectItem>
                        <SelectItem value="enterprise">Enterprise Suite</SelectItem>
                        <SelectItem value="creative">Creative Studio</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <div>
                  <Label htmlFor="workspace-description" className="text-slate-700 font-medium">Description</Label>
                  <Textarea
                    id="workspace-description"
                    placeholder="Describe your workspace goals and use cases..."
                    value={newWorkspace.description}
                    onChange={(e) => setNewWorkspace({ ...newWorkspace, description: e.target.value })}
                    className="mt-2 border-slate-200 focus:border-blue-500"
                    style={{ backgroundColor: '#ffffff' }}
                  />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <Label htmlFor="workspace-theme" className="text-slate-700 font-medium">Theme</Label>
                    <Select value={newWorkspace.theme} onValueChange={(value) => setNewWorkspace({ ...newWorkspace, theme: value })}>
                      <SelectTrigger className="mt-2 border-slate-200" style={{ backgroundColor: '#ffffff' }}>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent style={{ backgroundColor: '#ffffff' }}>
                        <SelectItem value="modern">Modern</SelectItem>
                        <SelectItem value="classic">Classic</SelectItem>
                        <SelectItem value="minimal">Minimal</SelectItem>
                        <SelectItem value="cosmic">Cosmic</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <Label htmlFor="workspace-privacy" className="text-slate-700 font-medium">Privacy</Label>
                    <Select value={newWorkspace.privacy} onValueChange={(value) => setNewWorkspace({ ...newWorkspace, privacy: value })}>
                      <SelectTrigger className="mt-2 border-slate-200" style={{ backgroundColor: '#ffffff' }}>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent style={{ backgroundColor: '#ffffff' }}>
                        <SelectItem value="private">Private</SelectItem>
                        <SelectItem value="team">Team</SelectItem>
                        <SelectItem value="organization">Organization</SelectItem>
                        <SelectItem value="public">Public</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <Label htmlFor="workspace-collaboration" className="text-slate-700 font-medium">Collaboration</Label>
                    <Select value={newWorkspace.collaborationLevel} onValueChange={(value) => setNewWorkspace({ ...newWorkspace, collaborationLevel: value })}>
                      <SelectTrigger className="mt-2 border-slate-200" style={{ backgroundColor: '#ffffff' }}>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent style={{ backgroundColor: '#ffffff' }}>
                        <SelectItem value="solo">Solo</SelectItem>
                        <SelectItem value="team">Team</SelectItem>
                        <SelectItem value="department">Department</SelectItem>
                        <SelectItem value="enterprise">Enterprise</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="features" className="space-y-6 mt-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <h4 className="font-semibold text-slate-900">AI Features</h4>
                    
                    <div className="flex items-center justify-between p-4 border border-slate-200 rounded-lg" style={{ backgroundColor: '#f8fafc' }}>
                      <div>
                        <Label className="text-slate-700 font-medium">Auto Content Generation</Label>
                        <p className="text-sm text-slate-600">AI-powered content creation</p>
                      </div>
                      <Switch
                        checked={newWorkspace.autoSync}
                        onCheckedChange={(checked) => setNewWorkspace({ ...newWorkspace, autoSync: checked })}
                      />
                    </div>
                    
                    <div className="flex items-center justify-between p-4 border border-slate-200 rounded-lg" style={{ backgroundColor: '#f8fafc' }}>
                      <div>
                        <Label className="text-slate-700 font-medium">Smart Notifications</Label>
                        <p className="text-sm text-slate-600">Intelligent alert system</p>
                      </div>
                      <Switch
                        checked={newWorkspace.notifications}
                        onCheckedChange={(checked) => setNewWorkspace({ ...newWorkspace, notifications: checked })}
                      />
                    </div>
                    
                    <div>
                      <Label className="text-slate-700 font-medium">AI Personality</Label>
                      <Select value={newWorkspace.aiPersonality} onValueChange={(value) => setNewWorkspace({ ...newWorkspace, aiPersonality: value })}>
                        <SelectTrigger className="mt-2 border-slate-200" style={{ backgroundColor: '#ffffff' }}>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent style={{ backgroundColor: '#ffffff' }}>
                          <SelectItem value="professional">Professional</SelectItem>
                          <SelectItem value="creative">Creative</SelectItem>
                          <SelectItem value="casual">Casual</SelectItem>
                          <SelectItem value="technical">Technical</SelectItem>
                          <SelectItem value="friendly">Friendly</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <h4 className="font-semibold text-slate-900">Automation Level</h4>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-slate-700">Automation Intensity</span>
                        <span className="text-sm font-medium text-slate-900">Level {newWorkspace.automationLevel}</span>
                      </div>
                      <Slider
                        value={[newWorkspace.automationLevel]}
                        onValueChange={(value) => setNewWorkspace({ ...newWorkspace, automationLevel: value[0] })}
                        max={5}
                        min={1}
                        step={1}
                        className="w-full"
                      />
                      <div className="flex justify-between text-xs text-slate-500">
                        <span>Basic</span>
                        <span>Advanced</span>
                        <span>Expert</span>
                      </div>
                    </div>
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="integrations" className="space-y-6 mt-6">
                <div>
                  <h4 className="font-semibold text-slate-900 mb-4">Available Integrations</h4>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {[
                      { id: 'instagram', name: 'Instagram', icon: '📸' },
                      { id: 'facebook', name: 'Facebook', icon: '📘' },
                      { id: 'twitter', name: 'Twitter', icon: '🐦' },
                      { id: 'linkedin', name: 'LinkedIn', icon: '💼' },
                      { id: 'youtube', name: 'YouTube', icon: '📺' },
                      { id: 'tiktok', name: 'TikTok', icon: '🎵' },
                      { id: 'slack', name: 'Slack', icon: '💬' },
                      { id: 'notion', name: 'Notion', icon: '📝' },
                      { id: 'zapier', name: 'Zapier', icon: '⚡' }
                    ].map((integration) => (
                      <div 
                        key={integration.id}
                        className="flex items-center space-x-3 p-3 border border-slate-200 rounded-lg cursor-pointer hover:bg-slate-50 transition-colors"
                        style={{ backgroundColor: '#ffffff' }}
                        onClick={() => {
                          const integrations = newWorkspace.integrations.includes(integration.id)
                            ? newWorkspace.integrations.filter(i => i !== integration.id)
                            : [...newWorkspace.integrations, integration.id];
                          setNewWorkspace({ ...newWorkspace, integrations });
                        }}
                      >
                        <input
                          type="checkbox"
                          checked={newWorkspace.integrations.includes(integration.id)}
                          onChange={() => {}}
                          className="rounded border-slate-300"
                        />
                        <span className="text-xl">{integration.icon}</span>
                        <span className="text-sm font-medium text-slate-900">{integration.name}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="security" className="space-y-6 mt-6">
                <div>
                  <h4 className="font-semibold text-slate-900 mb-4">Security Settings</h4>
                  
                  <div className="space-y-4">
                    <div>
                      <Label className="text-slate-700 font-medium">Security Level</Label>
                      <Select value={newWorkspace.securityLevel} onValueChange={(value) => setNewWorkspace({ ...newWorkspace, securityLevel: value })}>
                        <SelectTrigger className="mt-2 border-slate-200" style={{ backgroundColor: '#ffffff' }}>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent style={{ backgroundColor: '#ffffff' }}>
                          <SelectItem value="basic">Basic</SelectItem>
                          <SelectItem value="standard">Standard</SelectItem>
                          <SelectItem value="enhanced">Enhanced</SelectItem>
                          <SelectItem value="enterprise">Enterprise</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {[
                        { id: 'encryption', name: 'End-to-End Encryption', desc: 'Encrypt all data' },
                        { id: 'backup', name: 'Automatic Backups', desc: 'Daily data backups' },
                        { id: 'audit', name: 'Audit Logging', desc: 'Track all activities' },
                        { id: 'sso', name: 'Single Sign-On', desc: 'SSO integration' }
                      ].map((feature) => (
                        <div 
                          key={feature.id}
                          className="flex items-center justify-between p-4 border border-slate-200 rounded-lg"
                          style={{ backgroundColor: '#f8fafc' }}
                        >
                          <div>
                            <Label className="text-slate-700 font-medium">{feature.name}</Label>
                            <p className="text-sm text-slate-600">{feature.desc}</p>
                          </div>
                          <Switch defaultChecked />
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
            
            <div className="flex space-x-3 pt-8 border-t border-slate-200">
              <Button
                onClick={handleCreateWorkspace}
                disabled={createWorkspaceMutation.isPending}
                className="flex-1 text-white bg-gradient-to-r from-blue-600 via-purple-600 to-emerald-600 hover:from-blue-700 hover:via-purple-700 hover:to-emerald-700"
              >
                {createWorkspaceMutation.isPending ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Creating Enhanced Workspace...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4 mr-2" />
                    Create Enhanced Workspace
                  </>
                )}
              </Button>
              <Button
                variant="outline"
                onClick={() => setIsCreateOpen(false)}
                className="flex-1 border-slate-300 text-slate-700 hover:bg-slate-50"
                style={{ backgroundColor: '#ffffff' }}
              >
                Cancel
              </Button>
            </div>
          </DialogContent>
        </Dialog>

        {/* Enhanced Template Gallery */}
        <Dialog open={isTemplateOpen} onOpenChange={setIsTemplateOpen}>
          <DialogContent className="border-slate-200 max-w-6xl max-h-[90vh] overflow-y-auto" style={{ backgroundColor: '#ffffff' }}>
            <DialogHeader>
              <DialogTitle className="text-3xl font-bold text-slate-900 flex items-center">
                <Trophy className="w-7 h-7 mr-3 text-purple-600" />
                Professional Templates
              </DialogTitle>
              <DialogDescription className="text-slate-600">
                Choose from our curated collection of enterprise-grade workspace templates
              </DialogDescription>
            </DialogHeader>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
              {templates?.map((template) => (
                <div 
                  key={template.id} 
                  className="border border-slate-200 rounded-2xl p-6 hover:border-blue-300 hover:shadow-xl transition-all cursor-pointer group"
                  style={{ backgroundColor: '#ffffff' }}
                >
                  <div className="text-center mb-6">
                    <div className={`w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-r ${template.color} flex items-center justify-center text-2xl shadow-lg`}>
                      {template.icon}
                    </div>
                    <h3 className="font-bold text-slate-900 text-lg">{template.name}</h3>
                    <p className="text-sm text-slate-600 mt-2">{template.description}</p>
                    
                    <div className="flex items-center justify-center space-x-4 mt-3">
                      <Badge 
                        className="text-slate-700 border-slate-200"
                        style={{ backgroundColor: '#f1f5f9' }}
                      >
                        {template.complexity}
                      </Badge>
                      <Badge 
                        className="text-blue-800 border-blue-200"
                        style={{ backgroundColor: '#dbeafe' }}
                      >
                        {template.setupTime}
                      </Badge>
                    </div>
                  </div>
                  
                  <div className="space-y-3 mb-6">
                    {template.features.map((feature, index) => (
                      <div key={index} className="flex items-center text-sm text-slate-700">
                        <CheckCircle2 className="w-4 h-4 text-emerald-500 mr-3 flex-shrink-0" />
                        <span>{feature}</span>
                      </div>
                    ))}
                  </div>
                  
                  <Button
                    className="w-full text-white bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 group-hover:shadow-lg transition-all"
                    onClick={() => {
                      setNewWorkspace({ ...newWorkspace, template: template.id });
                      setIsTemplateOpen(false);
                      setIsCreateOpen(true);
                    }}
                  >
                    <Rocket className="w-4 h-4 mr-2" />
                    Use This Template
                  </Button>
                </div>
              ))}
            </div>
          </DialogContent>
        </Dialog>

        {/* Plan Upgrade Modal */}
        <SimplePlanUpgradeModal
          isOpen={upgradeModal.isOpen}
          onClose={closeUpgradeModal}
          feature={upgradeModal.feature}
          currentPlan={upgradeModal.currentPlan}
          upgradeMessage={upgradeModal.upgradeMessage}
          limitReached={upgradeModal.limitReached}
        />

        {/* Workspace Switching Overlay */}
        <WorkspaceSwitchingOverlay
          isVisible={isSwitching}
          currentWorkspace={currentWorkspace}
          targetWorkspace={targetWorkspace}
        />
      </motion.div>
    </div>
  );
}