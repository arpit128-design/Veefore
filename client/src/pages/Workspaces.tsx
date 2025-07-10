import { useState, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger, AlertDialogAction, AlertDialogCancel } from "@/components/ui/alert-dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useWorkspaceContext } from "@/hooks/useWorkspace";
import { useAuth } from "@/hooks/useAuth";
import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { 
  Plus, Globe, Settings, Star, Users, Edit3, Trash2, AlertTriangle, 
  Building, Activity, TrendingUp, Zap, Shield, Crown, FileText, 
  BarChart3, Rocket, Calendar, MessageSquare, Brain, Palette,
  Clock, ChevronRight, Filter, Search, Grid3X3, List, Eye,
  Database, Lock, Share2, Download, Upload, Archive, Target,
  Smartphone, Monitor, Tablet, Wifi, WifiOff, CheckCircle2,
  XCircle, AlertCircle, Loader2, Sparkles, Award, Trophy,
  PieChart, LineChart, DollarSign, Users2, Briefcase, Mail
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
  
  // View states
  const [viewMode, setViewMode] = useState<'grid' | 'list' | 'analytics'>('grid');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'active' | 'archived'>('all');
  const [selectedWorkspaces, setSelectedWorkspaces] = useState<string[]>([]);
  
  // Modal states
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isTemplateOpen, setIsTemplateOpen] = useState(false);
  const [isImportOpen, setIsImportOpen] = useState(false);
  const [isBulkActionsOpen, setIsBulkActionsOpen] = useState(false);
  const [newWorkspace, setNewWorkspace] = useState({
    name: "",
    description: "",
    theme: "default",
    template: "blank",
    privacy: "private",
    aiPersonality: "professional",
    autoSync: true,
    notifications: true
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

  // Workspace management states
  const [isManageOpen, setIsManageOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [editingWorkspace, setEditingWorkspace] = useState<any>(null);
  const [editForm, setEditForm] = useState({
    name: "",
    description: "",
    theme: "default",
    privacy: "private",
    autoSync: true,
    notifications: true
  });

  // Fetch workspace analytics
  const { data: workspaceAnalytics } = useQuery({
    queryKey: ['workspace-analytics'],
    queryFn: async () => {
      const response = await fetch('/api/workspaces/analytics', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (!response.ok) throw new Error('Failed to fetch analytics');
      return response.json();
    },
    enabled: !!token
  });

  // Fetch workspace templates
  const { data: templates } = useQuery({
    queryKey: ['workspace-templates'],
    queryFn: async () => [
      { id: 'personal', name: 'Personal Brand', description: 'Perfect for individual creators', icon: '👤', features: ['Content Calendar', 'Analytics', 'Basic Automation'] },
      { id: 'business', name: 'Business', description: 'Professional business workspace', icon: '🏢', features: ['Team Collaboration', 'Advanced Analytics', 'Custom Branding'] },
      { id: 'agency', name: 'Agency', description: 'Multi-client management', icon: '🎯', features: ['Client Management', 'White-label', 'Advanced Reporting'] },
      { id: 'ecommerce', name: 'E-commerce', description: 'Online store optimization', icon: '🛒', features: ['Product Catalog', 'Sales Analytics', 'Conversion Tracking'] },
      { id: 'influencer', name: 'Influencer', description: 'Content creator focused', icon: '⭐', features: ['Sponsorship Tracking', 'Engagement Analytics', 'Brand Partnerships'] },
      { id: 'nonprofit', name: 'Non-Profit', description: 'Organization management', icon: '❤️', features: ['Campaign Tracking', 'Donation Analytics', 'Volunteer Management'] }
    ]
  });

  // Create workspace mutation with template support
  const createWorkspaceMutation = useMutation({
    mutationFn: async (data: any) => {
      const response = await fetch('/api/workspaces/create-from-template', {
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
        (error as any).response = { status: response.status, data: JSON.parse(errorText) };
        throw error;
      }
      
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Workspace Created Successfully!",
        description: "Your new workspace is ready with all configured features.",
      });
      queryClient.invalidateQueries({ queryKey: ['workspaces'] });
      queryClient.invalidateQueries({ queryKey: ['workspace-analytics'] });
      setIsCreateOpen(false);
      setIsTemplateOpen(false);
      setNewWorkspace({
        name: "",
        description: "",
        theme: "default",
        template: "blank",
        privacy: "private",
        aiPersonality: "professional",
        autoSync: true,
        notifications: true
      });
    },
    onError: (error: any) => {
      const errorData = error?.response?.data || {};
      const statusCode = error?.status || error?.response?.status;
      
      if (statusCode === 403) {
        setIsCreateOpen(false);
        setIsTemplateOpen(false);
        setUpgradeModal({
          isOpen: true,
          feature: 'workspace_creation',
          currentPlan: errorData.currentPlan || user?.plan || 'Free',
          upgradeMessage: errorData.upgradeMessage || "Upgrade to create unlimited workspaces with advanced features!",
          limitReached: {
            current: errorData.currentWorkspaces || workspaces?.length || 0,
            max: errorData.maxWorkspaces || 1,
            type: 'workspaces'
          }
        });
      } else {
        toast({
          title: "Creation Failed",
          description: error.message || "Failed to create workspace",
          variant: "destructive",
        });
      }
    }
  });

  // Bulk actions mutations
  const bulkArchiveMutation = useMutation({
    mutationFn: (workspaceIds: string[]) => 
      apiRequest('POST', '/api/workspaces/bulk-archive', { workspaceIds }),
    onSuccess: () => {
      toast({ title: "Workspaces Archived", description: "Selected workspaces have been archived." });
      queryClient.invalidateQueries({ queryKey: ['workspaces'] });
      setSelectedWorkspaces([]);
    }
  });

  const bulkDeleteMutation = useMutation({
    mutationFn: (workspaceIds: string[]) => 
      apiRequest('DELETE', '/api/workspaces/bulk-delete', { workspaceIds }),
    onSuccess: () => {
      toast({ title: "Workspaces Deleted", description: "Selected workspaces have been permanently deleted." });
      queryClient.invalidateQueries({ queryKey: ['workspaces'] });
      setSelectedWorkspaces([]);
    }
  });

  // Filter and search workspaces
  const filteredWorkspaces = workspaces.filter(workspace => {
    const matchesSearch = workspace.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         workspace.description?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = filterStatus === 'all' || 
                         (filterStatus === 'active' && !workspace.isArchived) ||
                         (filterStatus === 'archived' && workspace.isArchived);
    return matchesSearch && matchesFilter;
  });

  const handleCreateWorkspace = () => {
    if (!newWorkspace.name.trim()) {
      toast({
        title: "Name Required",
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

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-8"
    >
      {/* Advanced Header with Multiple Actions */}
      <div className="relative">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 via-purple-600/10 to-cyan-600/10 rounded-3xl blur-xl"></div>
        <div className="relative bg-white/95 backdrop-blur-sm border border-slate-200/50 rounded-3xl p-8 shadow-2xl">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-6 lg:space-y-0">
            <div className="flex items-center space-x-4">
              <div className="p-4 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl shadow-lg">
                <Building className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-4xl font-bold text-slate-900">Enterprise Workspaces</h1>
                <p className="text-slate-600 mt-2 text-lg">Advanced workspace management with AI-powered insights</p>
                <div className="flex items-center space-x-4 mt-3">
                  <Badge className="bg-emerald-100 text-emerald-800 border-emerald-200">
                    {workspaces.length} Active
                  </Badge>
                  <Badge className="bg-blue-100 text-blue-800 border-blue-200">
                    {workspaceAnalytics?.totalPosts || 0} Posts
                  </Badge>
                  <Badge className="bg-purple-100 text-purple-800 border-purple-200">
                    {workspaceAnalytics?.totalEngagement || 0} Engagement
                  </Badge>
                </div>
              </div>
            </div>
            
            {/* Action Buttons */}
            <div className="flex flex-wrap items-center space-x-3">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsImportOpen(true)}
                className="bg-white border-slate-300 text-slate-700 hover:bg-slate-50"
              >
                <Upload className="w-4 h-4 mr-2" />
                Import
              </Button>
              
              <Dialog open={isTemplateOpen} onOpenChange={setIsTemplateOpen}>
                <DialogTrigger asChild>
                  <Button
                    variant="outline"
                    size="sm"
                    className="bg-white border-slate-300 text-slate-700 hover:bg-slate-50"
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
                    className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg"
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

      {/* Advanced Control Panel */}
      <div className="bg-white/95 backdrop-blur-sm border border-slate-200/50 rounded-2xl p-6 shadow-xl">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
          {/* Search and Filter */}
          <div className="flex flex-1 items-center space-x-4">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
              <Input
                placeholder="Search workspaces..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-white border-slate-200 focus:border-blue-500"
              />
            </div>
            
            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger className="w-32 bg-white border-slate-200">
                <Filter className="w-4 h-4 mr-2 text-slate-400" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="archived">Archived</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* View Mode and Bulk Actions */}
          <div className="flex items-center space-x-3">
            {selectedWorkspaces.length > 0 && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsBulkActionsOpen(true)}
                className="bg-white border-slate-300 text-slate-700"
              >
                <Settings className="w-4 h-4 mr-2" />
                Bulk Actions ({selectedWorkspaces.length})
              </Button>
            )}
            
            <div className="flex bg-slate-100 rounded-lg p-1">
              <Button
                variant={viewMode === 'grid' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setViewMode('grid')}
                className="h-8 px-3"
              >
                <Grid3X3 className="w-4 h-4" />
              </Button>
              <Button
                variant={viewMode === 'list' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setViewMode('list')}
                className="h-8 px-3"
              >
                <List className="w-4 h-4" />
              </Button>
              <Button
                variant={viewMode === 'analytics' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setViewMode('analytics')}
                className="h-8 px-3"
              >
                <BarChart3 className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Workspace Content */}
      <AnimatePresence mode="wait">
        {viewMode === 'grid' && (
          <motion.div
            key="grid"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            {filteredWorkspaces.map((workspace, index) => (
              <motion.div
                key={workspace.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                className="group"
              >
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 to-purple-600/10 rounded-2xl blur-lg group-hover:blur-xl transition-all duration-300"></div>
                  <div className="relative bg-white/95 backdrop-blur-sm border border-slate-200/50 rounded-2xl p-6 shadow-xl hover:shadow-2xl transition-all duration-300 group-hover:border-blue-300/50">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center space-x-3">
                        <div className={`p-3 rounded-xl shadow-lg ${
                          workspace.id === currentWorkspace?.id 
                            ? 'bg-gradient-to-r from-emerald-600 to-green-600' 
                            : 'bg-gradient-to-r from-slate-600 to-blue-600'
                        }`}>
                          <Building className="w-6 h-6 text-white" />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-bold text-slate-900 text-lg">{workspace.name}</h3>
                          <p className="text-sm text-slate-600 mt-1">
                            {workspace.description || "No description provided"}
                          </p>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          checked={selectedWorkspaces.includes(workspace.id)}
                          onChange={(e) => handleBulkSelect(workspace.id, e.target.checked)}
                          className="rounded border-slate-300"
                        />
                        <Button variant="ghost" size="sm" className="opacity-0 group-hover:opacity-100 transition-opacity">
                          <Eye className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>

                    {/* Workspace Stats */}
                    <div className="grid grid-cols-2 gap-4 mb-4">
                      <div className="bg-blue-50 border border-blue-200 rounded-xl p-3">
                        <div className="flex items-center justify-between">
                          <Calendar className="w-5 h-5 text-blue-600" />
                          <span className="text-xs text-blue-700 font-medium">Posts</span>
                        </div>
                        <div className="text-xl font-bold text-blue-900 mt-1">
                          {Math.floor(Math.random() * 50) + 10}
                        </div>
                      </div>
                      
                      <div className="bg-purple-50 border border-purple-200 rounded-xl p-3">
                        <div className="flex items-center justify-between">
                          <TrendingUp className="w-5 h-5 text-purple-600" />
                          <span className="text-xs text-purple-700 font-medium">Growth</span>
                        </div>
                        <div className="text-xl font-bold text-purple-900 mt-1">
                          +{Math.floor(Math.random() * 30) + 5}%
                        </div>
                      </div>
                    </div>

                    {/* Status Badges */}
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex flex-wrap gap-2">
                        {workspace.isDefault && (
                          <Badge className="bg-amber-100 text-amber-800 border-amber-200 text-xs">
                            <Star className="w-3 h-3 mr-1" />
                            Default
                          </Badge>
                        )}
                        {workspace.id === currentWorkspace?.id && (
                          <Badge className="bg-emerald-100 text-emerald-800 border-emerald-200 text-xs">
                            <Crown className="w-3 h-3 mr-1" />
                            Active
                          </Badge>
                        )}
                        <Badge className="bg-slate-100 text-slate-700 border-slate-200 text-xs">
                          {workspace.credits || 0} credits
                        </Badge>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        {Math.random() > 0.5 ? (
                          <Wifi className="w-4 h-4 text-emerald-500" />
                        ) : (
                          <WifiOff className="w-4 h-4 text-slate-400" />
                        )}
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex space-x-2">
                      <Button
                        size="sm"
                        className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white"
                        onClick={() => switchWorkspace(workspace)}
                      >
                        <ChevronRight className="w-4 h-4 mr-2" />
                        Open
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="bg-white border-slate-300 text-slate-700 hover:bg-slate-50"
                      >
                        <Settings className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}

        {viewMode === 'list' && (
          <motion.div
            key="list"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="bg-white/95 backdrop-blur-sm border border-slate-200/50 rounded-2xl shadow-xl overflow-hidden"
          >
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-slate-50 border-b border-slate-200">
                  <tr>
                    <th className="text-left p-4 font-medium text-slate-700">
                      <input type="checkbox" className="rounded border-slate-300" />
                    </th>
                    <th className="text-left p-4 font-medium text-slate-700">Workspace</th>
                    <th className="text-left p-4 font-medium text-slate-700">Status</th>
                    <th className="text-left p-4 font-medium text-slate-700">Posts</th>
                    <th className="text-left p-4 font-medium text-slate-700">Growth</th>
                    <th className="text-left p-4 font-medium text-slate-700">Credits</th>
                    <th className="text-left p-4 font-medium text-slate-700">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredWorkspaces.map((workspace) => (
                    <tr key={workspace.id} className="border-b border-slate-100 hover:bg-slate-50/50">
                      <td className="p-4">
                        <input
                          type="checkbox"
                          checked={selectedWorkspaces.includes(workspace.id)}
                          onChange={(e) => handleBulkSelect(workspace.id, e.target.checked)}
                          className="rounded border-slate-300"
                        />
                      </td>
                      <td className="p-4">
                        <div className="flex items-center space-x-3">
                          <div className={`p-2 rounded-lg ${
                            workspace.id === currentWorkspace?.id 
                              ? 'bg-gradient-to-r from-emerald-600 to-green-600' 
                              : 'bg-gradient-to-r from-slate-600 to-blue-600'
                          }`}>
                            <Building className="w-4 h-4 text-white" />
                          </div>
                          <div>
                            <div className="font-medium text-slate-900">{workspace.name}</div>
                            <div className="text-sm text-slate-500">{workspace.description}</div>
                          </div>
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="flex flex-wrap gap-1">
                          {workspace.isDefault && (
                            <Badge className="bg-amber-100 text-amber-800 border-amber-200 text-xs">Default</Badge>
                          )}
                          {workspace.id === currentWorkspace?.id && (
                            <Badge className="bg-emerald-100 text-emerald-800 border-emerald-200 text-xs">Active</Badge>
                          )}
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="text-sm font-medium text-slate-900">
                          {Math.floor(Math.random() * 50) + 10}
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="text-sm font-medium text-emerald-600">
                          +{Math.floor(Math.random() * 30) + 5}%
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="text-sm font-medium text-slate-900">
                          {workspace.credits || 0}
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center space-x-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => switchWorkspace(workspace)}
                            className="bg-white border-slate-300 text-slate-700 hover:bg-slate-50"
                          >
                            Open
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            className="text-slate-600 hover:text-slate-900"
                          >
                            <Settings className="w-4 h-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
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
              <Card className="bg-white/95 backdrop-blur-sm border-slate-200/50 shadow-xl">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-slate-600">Total Workspaces</p>
                      <p className="text-3xl font-bold text-slate-900">{workspaces.length}</p>
                    </div>
                    <Building className="w-8 h-8 text-blue-600" />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white/95 backdrop-blur-sm border-slate-200/50 shadow-xl">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-slate-600">Active Projects</p>
                      <p className="text-3xl font-bold text-slate-900">{workspaceAnalytics?.activeProjects || 12}</p>
                    </div>
                    <Rocket className="w-8 h-8 text-purple-600" />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white/95 backdrop-blur-sm border-slate-200/50 shadow-xl">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-slate-600">Total Engagement</p>
                      <p className="text-3xl font-bold text-slate-900">{workspaceAnalytics?.totalEngagement || '24.5K'}</p>
                    </div>
                    <TrendingUp className="w-8 h-8 text-emerald-600" />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white/95 backdrop-blur-sm border-slate-200/50 shadow-xl">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-slate-600">Revenue Generated</p>
                      <p className="text-3xl font-bold text-slate-900">${workspaceAnalytics?.revenue || '12.4K'}</p>
                    </div>
                    <DollarSign className="w-8 h-8 text-green-600" />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Detailed Analytics Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <Card className="bg-white/95 backdrop-blur-sm border-slate-200/50 shadow-xl">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <PieChart className="w-5 h-5 mr-2 text-blue-600" />
                    Workspace Performance Distribution
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {workspaces.slice(0, 5).map((workspace, index) => (
                      <div key={workspace.id} className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div className={`w-3 h-3 rounded-full bg-gradient-to-r ${
                            index === 0 ? 'from-blue-500 to-blue-600' :
                            index === 1 ? 'from-purple-500 to-purple-600' :
                            index === 2 ? 'from-emerald-500 to-emerald-600' :
                            index === 3 ? 'from-amber-500 to-amber-600' :
                            'from-slate-500 to-slate-600'
                          }`}></div>
                          <span className="text-sm font-medium text-slate-900">{workspace.name}</span>
                        </div>
                        <span className="text-sm text-slate-600">{Math.floor(Math.random() * 40) + 10}%</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white/95 backdrop-blur-sm border-slate-200/50 shadow-xl">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <LineChart className="w-5 h-5 mr-2 text-purple-600" />
                    Growth Trends
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 bg-emerald-50 border border-emerald-200 rounded-xl">
                      <div>
                        <p className="text-sm font-medium text-emerald-800">This Month</p>
                        <p className="text-2xl font-bold text-emerald-900">+24.5%</p>
                      </div>
                      <TrendingUp className="w-8 h-8 text-emerald-600" />
                    </div>
                    <div className="flex items-center justify-between p-4 bg-blue-50 border border-blue-200 rounded-xl">
                      <div>
                        <p className="text-sm font-medium text-blue-800">Last Month</p>
                        <p className="text-2xl font-bold text-blue-900">+18.2%</p>
                      </div>
                      <BarChart3 className="w-8 h-8 text-blue-600" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Create Workspace Dialog */}
      <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
        <DialogContent className="bg-white/95 backdrop-blur-sm border-slate-200/50 max-w-2xl">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-slate-900 flex items-center">
              <Plus className="w-6 h-6 mr-3 text-blue-600" />
              Create New Workspace
            </DialogTitle>
          </DialogHeader>
          
          <Tabs defaultValue="basic" className="mt-6">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="basic">Basic Info</TabsTrigger>
              <TabsTrigger value="settings">Settings</TabsTrigger>
              <TabsTrigger value="features">Features</TabsTrigger>
            </TabsList>
            
            <TabsContent value="basic" className="space-y-4 mt-6">
              <div>
                <Label htmlFor="workspace-name" className="text-slate-700 font-medium">Workspace Name</Label>
                <Input
                  id="workspace-name"
                  placeholder="e.g., My Brand Workspace"
                  value={newWorkspace.name}
                  onChange={(e) => setNewWorkspace({ ...newWorkspace, name: e.target.value })}
                  className="mt-2 bg-white border-slate-200 focus:border-blue-500"
                />
              </div>
              
              <div>
                <Label htmlFor="workspace-description" className="text-slate-700 font-medium">Description</Label>
                <Textarea
                  id="workspace-description"
                  placeholder="Brief description of this workspace..."
                  value={newWorkspace.description}
                  onChange={(e) => setNewWorkspace({ ...newWorkspace, description: e.target.value })}
                  className="mt-2 bg-white border-slate-200 focus:border-blue-500"
                />
              </div>
              
              <div>
                <Label htmlFor="workspace-template" className="text-slate-700 font-medium">Template</Label>
                <Select value={newWorkspace.template} onValueChange={(value) => setNewWorkspace({ ...newWorkspace, template: value })}>
                  <SelectTrigger className="mt-2 bg-white border-slate-200">
                    <SelectValue placeholder="Choose a template" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="blank">Blank Workspace</SelectItem>
                    <SelectItem value="personal">Personal Brand</SelectItem>
                    <SelectItem value="business">Business</SelectItem>
                    <SelectItem value="agency">Agency</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </TabsContent>
            
            <TabsContent value="settings" className="space-y-4 mt-6">
              <div>
                <Label htmlFor="workspace-theme" className="text-slate-700 font-medium">Theme</Label>
                <Select value={newWorkspace.theme} onValueChange={(value) => setNewWorkspace({ ...newWorkspace, theme: value })}>
                  <SelectTrigger className="mt-2 bg-white border-slate-200">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="default">Default</SelectItem>
                    <SelectItem value="cosmic">Cosmic Blue</SelectItem>
                    <SelectItem value="nebula">Nebula Purple</SelectItem>
                    <SelectItem value="solar">Solar Gold</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label htmlFor="workspace-privacy" className="text-slate-700 font-medium">Privacy</Label>
                <Select value={newWorkspace.privacy} onValueChange={(value) => setNewWorkspace({ ...newWorkspace, privacy: value })}>
                  <SelectTrigger className="mt-2 bg-white border-slate-200">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="private">Private</SelectItem>
                    <SelectItem value="team">Team</SelectItem>
                    <SelectItem value="public">Public</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label htmlFor="workspace-ai" className="text-slate-700 font-medium">AI Personality</Label>
                <Select value={newWorkspace.aiPersonality} onValueChange={(value) => setNewWorkspace({ ...newWorkspace, aiPersonality: value })}>
                  <SelectTrigger className="mt-2 bg-white border-slate-200">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="professional">Professional</SelectItem>
                    <SelectItem value="creative">Creative</SelectItem>
                    <SelectItem value="casual">Casual</SelectItem>
                    <SelectItem value="technical">Technical</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </TabsContent>
            
            <TabsContent value="features" className="space-y-4 mt-6">
              <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
                <div>
                  <Label className="text-slate-700 font-medium">Auto Sync</Label>
                  <p className="text-sm text-slate-600">Automatically sync data across platforms</p>
                </div>
                <Switch
                  checked={newWorkspace.autoSync}
                  onCheckedChange={(checked) => setNewWorkspace({ ...newWorkspace, autoSync: checked })}
                />
              </div>
              
              <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
                <div>
                  <Label className="text-slate-700 font-medium">Notifications</Label>
                  <p className="text-sm text-slate-600">Receive workspace notifications</p>
                </div>
                <Switch
                  checked={newWorkspace.notifications}
                  onCheckedChange={(checked) => setNewWorkspace({ ...newWorkspace, notifications: checked })}
                />
              </div>
            </TabsContent>
          </Tabs>
          
          <div className="flex space-x-3 pt-6">
            <Button
              onClick={handleCreateWorkspace}
              disabled={createWorkspaceMutation.isPending}
              className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white"
            >
              {createWorkspaceMutation.isPending ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Creating...
                </>
              ) : (
                <>
                  <Plus className="w-4 h-4 mr-2" />
                  Create Workspace
                </>
              )}
            </Button>
            <Button
              variant="outline"
              onClick={() => setIsCreateOpen(false)}
              className="flex-1 bg-white border-slate-300 text-slate-700 hover:bg-slate-50"
            >
              Cancel
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Template Gallery Dialog */}
      <Dialog open={isTemplateOpen} onOpenChange={setIsTemplateOpen}>
        <DialogContent className="bg-white/95 backdrop-blur-sm border-slate-200/50 max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-slate-900 flex items-center">
              <Sparkles className="w-6 h-6 mr-3 text-purple-600" />
              Workspace Templates
            </DialogTitle>
          </DialogHeader>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
            {templates?.map((template) => (
              <div key={template.id} className="border border-slate-200 rounded-xl p-6 hover:border-blue-300 hover:shadow-lg transition-all cursor-pointer">
                <div className="text-center mb-4">
                  <div className="text-4xl mb-3">{template.icon}</div>
                  <h3 className="font-bold text-slate-900">{template.name}</h3>
                  <p className="text-sm text-slate-600 mt-1">{template.description}</p>
                </div>
                
                <div className="space-y-2 mb-4">
                  {template.features.map((feature, index) => (
                    <div key={index} className="flex items-center text-sm text-slate-700">
                      <CheckCircle2 className="w-4 h-4 text-emerald-500 mr-2" />
                      {feature}
                    </div>
                  ))}
                </div>
                
                <Button
                  className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white"
                  onClick={() => {
                    setNewWorkspace({ ...newWorkspace, template: template.id });
                    setIsTemplateOpen(false);
                    setIsCreateOpen(true);
                  }}
                >
                  Use Template
                </Button>
              </div>
            ))}
          </div>
        </DialogContent>
      </Dialog>

      {/* Bulk Actions Dialog */}
      <Dialog open={isBulkActionsOpen} onOpenChange={setIsBulkActionsOpen}>
        <DialogContent className="bg-white/95 backdrop-blur-sm border-slate-200/50">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-slate-900 flex items-center">
              <Settings className="w-6 h-6 mr-3 text-blue-600" />
              Bulk Actions ({selectedWorkspaces.length} selected)
            </DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4 mt-6">
            <Button
              variant="outline"
              className="w-full justify-start bg-white border-slate-300 text-slate-700 hover:bg-slate-50"
              onClick={() => {
                bulkArchiveMutation.mutate(selectedWorkspaces);
                setIsBulkActionsOpen(false);
              }}
            >
              <Archive className="w-4 h-4 mr-2" />
              Archive Selected Workspaces
            </Button>
            
            <Button
              variant="outline"
              className="w-full justify-start bg-white border-red-300 text-red-700 hover:bg-red-50"
              onClick={() => {
                bulkDeleteMutation.mutate(selectedWorkspaces);
                setIsBulkActionsOpen(false);
              }}
            >
              <Trash2 className="w-4 h-4 mr-2" />
              Delete Selected Workspaces
            </Button>
            
            <Button
              variant="outline"
              className="w-full justify-start bg-white border-slate-300 text-slate-700 hover:bg-slate-50"
            >
              <Download className="w-4 h-4 mr-2" />
              Export Workspace Data
            </Button>
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
  );
}