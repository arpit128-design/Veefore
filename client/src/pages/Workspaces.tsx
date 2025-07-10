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
import { useWorkspaceContext } from "@/hooks/useWorkspace";
import { useAuth } from "@/hooks/useAuth";
import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Plus, Globe, Settings, Star, Users, Edit3, Trash2, AlertTriangle, StarOff, Building, Activity, TrendingUp, Zap, Shield, Crown, FileText, BarChart3, Rocket } from "lucide-react";
import { WorkspaceSwitchingOverlay } from "@/components/workspaces/WorkspaceSwitchingOverlay";
import SimplePlanUpgradeModal from "@/components/subscription/SimplePlanUpgradeModal";
import { motion, AnimatePresence } from "framer-motion";



export default function Workspaces() {
  const { workspaces, currentWorkspace, isSwitching, switchWorkspace } = useWorkspaceContext();
  const [targetWorkspace, setTargetWorkspace] = useState<any>(null);
  const { token, user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [newWorkspace, setNewWorkspace] = useState({
    name: "",
    description: "",
    theme: "default"
  });

  // Plan upgrade modal state - persist across re-renders
  const [upgradeModal, setUpgradeModal] = useState({
    isOpen: false,
    feature: '',
    currentPlan: '',
    upgradeMessage: '',
    limitReached: null as any
  });

  // Prevent modal from closing unexpectedly
  const closeUpgradeModal = () => {
    setUpgradeModal({
      isOpen: false,
      feature: '',
      currentPlan: '',
      upgradeMessage: '',
      limitReached: null
    });
  };

  // Workspace management state
  const [isManageOpen, setIsManageOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [editingWorkspace, setEditingWorkspace] = useState<any>(null);
  const [editForm, setEditForm] = useState({
    name: "",
    description: "",
    theme: "default"
  });

  // Fetch workspace-specific social accounts for activity
  const { data: socialAccounts } = useQuery({
    queryKey: ['social-accounts', currentWorkspace?.id],
    queryFn: async () => {
      const response = await fetch(`/api/social-accounts?workspaceId=${currentWorkspace?.id}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (!response.ok) throw new Error('Failed to fetch social accounts');
      const data = await response.json();
      console.log('[WORKSPACE DEBUG] Social accounts data:', data);
      return data;
    },
    enabled: !!currentWorkspace?.id && !!token
  });

  // Fetch social accounts for all workspaces for the grid display
  const { data: allWorkspaceAccounts } = useQuery({
    queryKey: ['all-workspace-accounts'],
    queryFn: async () => {
      const accountsMap = new Map();
      for (const workspace of workspaces) {
        try {
          const response = await fetch(`/api/social-accounts?workspaceId=${workspace.id}`, {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          });
          if (response.ok) {
            const accounts = await response.json();
            accountsMap.set(workspace.id, accounts);
          }
        } catch (error) {
          console.error(`Failed to fetch accounts for workspace ${workspace.id}:`, error);
        }
      }
      return accountsMap;
    },
    enabled: !!token && workspaces.length > 0
  });

  const createWorkspaceMutation = useMutation({
    mutationFn: async (data: any) => {
      console.log('=== MUTATION FUNCTION START ===');
      
      try {
        const token = localStorage.getItem('veefore_auth_token');
        console.log('=== MAKING FETCH REQUEST ===');
        
        const response = await fetch('/api/workspaces', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify(data),
          credentials: 'include'
        });
        
        console.log('=== RESPONSE RECEIVED ===', response.status, response.ok);
        
        if (!response.ok) {
          const errorText = await response.text();
          console.log('=== ERROR RESPONSE TEXT ===', errorText);
          
          // Create structured error that onError can handle
          const error = new Error(errorText);
          (error as any).status = response.status;
          (error as any).response = { status: response.status, data: JSON.parse(errorText) };
          
          console.log('=== THROWING ERROR ===', error);
          throw error;
        }
        
        console.log('=== MUTATION SUCCESS ===');
        return response.json();
      } catch (error) {
        console.log('=== MUTATION FUNCTION CAUGHT ERROR ===', error);
        throw error; // Re-throw to trigger onError
      }
    },
    onSuccess: () => {
      toast({
        title: "Workspace Created!",
        description: "Your new brand workspace is ready to use.",
      });
      queryClient.invalidateQueries({ queryKey: ['workspaces'] });
      setIsCreateOpen(false);
      setNewWorkspace({ name: "", description: "", theme: "default" });
    },
    onError: (error: any) => {
      console.log('=== WORKSPACE CREATION ERROR CAUGHT ===');
      console.log('Error object:', error);
      console.log('Error message:', error?.message);
      console.log('Error status:', error?.status);
      console.log('Error keys:', Object.keys(error || {}));
      
      // Extract error data from structured error object
      const errorData = error?.response?.data || {};
      const statusCode = error?.status || error?.response?.status;
      
      if (statusCode === 403) {
        console.log('Processing 403 error for upgrade modal');
        setIsCreateOpen(false); // Close the creation modal
        
        const modalData = {
          isOpen: true,
          feature: 'workspace_creation',
          currentPlan: errorData.currentPlan || user?.plan || 'Free',
          upgradeMessage: errorData.upgradeMessage || "Upgrade your plan to create more workspaces and unlock the full potential of VeeFore!",
          limitReached: {
            current: errorData.currentWorkspaces || workspaces?.length || 0,
            max: errorData.maxWorkspaces || (user?.plan === 'Free' ? 1 : user?.plan === 'Creator' ? 3 : 10),
            type: 'workspaces'
          }
        };
        
        console.log('Setting upgrade modal:', modalData);
        setUpgradeModal(modalData);
        console.log('Upgrade modal state should now be open');
      } else {
        console.log('Non-403 error, showing toast');
        toast({
          title: "Creation Failed",
          description: error.message || "Failed to create workspace",
          variant: "destructive",
        });
      }
    }
  });

  // Update workspace mutation
  const updateWorkspaceMutation = useMutation({
    mutationFn: ({ id, data }: { id: string, data: any }) => apiRequest('PUT', `/api/workspaces/${id}`, data),
    onSuccess: () => {
      toast({
        title: "Workspace Updated!",
        description: "Your workspace settings have been saved.",
      });
      queryClient.invalidateQueries({ queryKey: ['workspaces'] });
      setIsEditOpen(false);
      setEditingWorkspace(null);
    },
    onError: (error: any) => {
      toast({
        title: "Update Failed",
        description: error.message || "Failed to update workspace",
        variant: "destructive",
      });
    }
  });

  // Delete workspace mutation
  const deleteWorkspaceMutation = useMutation({
    mutationFn: (id: string) => apiRequest('DELETE', `/api/workspaces/${id}`),
    onSuccess: () => {
      toast({
        title: "Workspace Deleted",
        description: "The workspace has been permanently removed.",
      });
      // Invalidate multiple related queries to ensure UI updates
      queryClient.invalidateQueries({ queryKey: ['workspaces'] });
      queryClient.invalidateQueries({ queryKey: ['all-workspace-accounts'] });
      queryClient.invalidateQueries({ queryKey: ['social-accounts'] });
      // Force immediate refetch
      queryClient.refetchQueries({ queryKey: ['workspaces'] });
    },
    onError: (error: any) => {
      toast({
        title: "Delete Failed",
        description: error.message || "Failed to delete workspace",
        variant: "destructive",
      });
    }
  });

  // Set as default workspace mutation
  const setDefaultMutation = useMutation({
    mutationFn: (id: string) => apiRequest('PUT', `/api/workspaces/${id}/default`),
    onSuccess: () => {
      toast({
        title: "Default Workspace Set",
        description: "This workspace is now your default.",
      });
      queryClient.invalidateQueries({ queryKey: ['workspaces'] });
    },
    onError: (error: any) => {
      toast({
        title: "Update Failed",
        description: error.message || "Failed to set default workspace",
        variant: "destructive",
      });
    }
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

  const handleEditWorkspace = (workspace: any) => {
    setEditingWorkspace(workspace);
    setEditForm({
      name: workspace.name,
      description: workspace.description || "",
      theme: workspace.theme || "default"
    });
    setIsEditOpen(true);
  };

  const handleUpdateWorkspace = () => {
    if (!editingWorkspace || !editForm.name.trim()) {
      toast({
        title: "Name Required",
        description: "Please enter a workspace name",
        variant: "destructive",
      });
      return;
    }
    
    updateWorkspaceMutation.mutate({
      id: editingWorkspace.id,
      data: editForm
    });
  };

  const handleDeleteWorkspace = (workspace: any) => {
    if (workspace.isDefault) {
      toast({
        title: "Cannot Delete",
        description: "Default workspace cannot be deleted",
        variant: "destructive",
      });
      return;
    }
    
    deleteWorkspaceMutation.mutate(workspace.id);
  };

  const handleSetDefault = (workspace: any) => {
    if (!workspace.isDefault) {
      setDefaultMutation.mutate(workspace.id);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-8"
    >
      {/* Professional Header with Gradient */}
      <div className="relative">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 via-purple-600/10 to-cyan-600/10 rounded-2xl blur-xl"></div>
        <div className="relative bg-white/95 backdrop-blur-sm border border-slate-200/50 rounded-2xl p-8 shadow-xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl shadow-lg">
                <Building className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-slate-900">Workspace Management</h1>
                <p className="text-slate-600 mt-1">Organize your brands and projects with enterprise-grade workspaces</p>
              </div>
            </div>
            
            {/* Enhanced Create Button */}
            <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
              <DialogTrigger asChild>
                <Button 
                  className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-6 py-3 rounded-xl shadow-lg transition-all duration-200 hover:shadow-xl hover:scale-105"
                >
                  <Plus className="w-5 h-5 mr-2" />
                  Create Workspace
                </Button>
              </DialogTrigger>
              <DialogContent className="bg-white/95 backdrop-blur-sm border-slate-200/50 max-w-md">
                <DialogHeader>
                  <DialogTitle className="text-2xl font-bold text-slate-900 flex items-center">
                    <Zap className="w-6 h-6 mr-3 text-blue-600" />
                    Create New Workspace
                  </DialogTitle>
                </DialogHeader>
                <div className="space-y-6 mt-6">
                  <div>
                    <Label htmlFor="workspace-name" className="text-slate-700 font-medium">Workspace Name</Label>
                    <Input
                      id="workspace-name"
                      placeholder="e.g., My Business Brand"
                      value={newWorkspace.name}
                      onChange={(e) => setNewWorkspace({ ...newWorkspace, name: e.target.value })}
                      className="mt-2 bg-white border-slate-200 focus:border-blue-500 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <Label htmlFor="workspace-description" className="text-slate-700 font-medium">Description (Optional)</Label>
                    <Textarea
                      id="workspace-description"
                      placeholder="Brief description of this workspace..."
                      value={newWorkspace.description}
                      onChange={(e) => setNewWorkspace({ ...newWorkspace, description: e.target.value })}
                      className="mt-2 bg-white border-slate-200 focus:border-blue-500 focus:ring-blue-500"
                    />
                  </div>
                  <Button
                    onClick={handleCreateWorkspace}
                    disabled={createWorkspaceMutation.isPending}
                    className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white py-3 rounded-xl shadow-lg"
                  >
                    {createWorkspaceMutation.isPending ? "Creating..." : "Create Workspace"}
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
          
          {/* Enterprise Statistics Bar */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-8">
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-600 font-medium">Total Workspaces</p>
                  <p className="text-2xl font-bold text-blue-800">{workspaces.length}</p>
                </div>
                <Building className="w-8 h-8 text-blue-600" />
              </div>
            </div>
            <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-emerald-600 font-medium">Active</p>
                  <p className="text-2xl font-bold text-emerald-800">{workspaces.filter(w => w.id === currentWorkspace?.id).length}</p>
                </div>
                <Activity className="w-8 h-8 text-emerald-600" />
              </div>
            </div>
            <div className="bg-purple-50 border border-purple-200 rounded-xl p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-purple-600 font-medium">Total Credits</p>
                  <p className="text-2xl font-bold text-purple-800">{workspaces.reduce((sum, w) => sum + (w.credits || 0), 0)}</p>
                </div>
                <Zap className="w-8 h-8 text-purple-600" />
              </div>
            </div>
            <div className="bg-cyan-50 border border-cyan-200 rounded-xl p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-cyan-600 font-medium">Performance</p>
                  <p className="text-2xl font-bold text-cyan-800">98%</p>
                </div>
                <TrendingUp className="w-8 h-8 text-cyan-600" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Active Workspace Dashboard */}
      {currentWorkspace && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
          className="relative"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-emerald-600/10 via-blue-600/10 to-purple-600/10 rounded-2xl blur-xl"></div>
          <div className="relative bg-white/95 backdrop-blur-sm border border-slate-200/50 rounded-2xl p-8 shadow-xl">
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center space-x-4">
                <div className="relative">
                  <div className="p-4 bg-gradient-to-r from-emerald-600 to-blue-600 rounded-2xl shadow-lg">
                    <Crown className="w-8 h-8 text-white" />
                  </div>
                  {currentWorkspace.isDefault && (
                    <div className="absolute -top-2 -right-2 bg-amber-500 rounded-full p-1">
                      <Star className="w-4 h-4 text-white" />
                    </div>
                  )}
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-slate-900">{currentWorkspace.name}</h2>
                  <p className="text-slate-600">Active Workspace</p>
                  {currentWorkspace.description && (
                    <p className="text-slate-500 text-sm mt-1">{currentWorkspace.description}</p>
                  )}
                </div>
              </div>
              
              <div className="flex items-center space-x-3">
                {currentWorkspace.isDefault && (
                  <Badge className="bg-amber-100 text-amber-800 border-amber-200">
                    <Star className="w-3 h-3 mr-1" />
                    Default
                  </Badge>
                )}
                <Badge className="bg-emerald-100 text-emerald-800 border-emerald-200">
                  <Activity className="w-3 h-3 mr-1" />
                  Active
                </Badge>
              </div>
            </div>

            {/* Enhanced Metrics Grid */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
              <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-blue-600 font-medium text-sm">Content Items</p>
                    <p className="text-3xl font-bold text-blue-800">
                      {socialAccounts?.reduce((total: number, account: any) => {
                        console.log('[WORKSPACE DEBUG] Account mediaCount:', account.mediaCount);
                        return total + (account.mediaCount || 0);
                      }, 0) || 0}
                    </p>
                  </div>
                  <Activity className="w-8 h-8 text-blue-600" />
                </div>
              </div>
              
              <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-emerald-600 font-medium text-sm">Total Followers</p>
                    <p className="text-3xl font-bold text-emerald-800">
                      {socialAccounts?.reduce((total: number, account: any) => {
                        console.log('[WORKSPACE DEBUG] Account followersCount:', account.followersCount);
                        return total + (account.followersCount || 0);
                      }, 0) || 0}
                    </p>
                  </div>
                  <Users className="w-8 h-8 text-emerald-600" />
                </div>
              </div>
              
              <div className="bg-purple-50 border border-purple-200 rounded-xl p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-purple-600 font-medium text-sm">Available Credits</p>
                    <p className="text-3xl font-bold text-purple-800">{currentWorkspace.credits || 0}</p>
                  </div>
                  <Zap className="w-8 h-8 text-purple-600" />
                </div>
              </div>
              
              <div className="bg-cyan-50 border border-cyan-200 rounded-xl p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-cyan-600 font-medium text-sm">Status</p>
                    <p className="text-xl font-bold text-cyan-800">
                      {socialAccounts && socialAccounts.length > 0 ? 'Active' : 'Setup'}
                    </p>
                  </div>
                  <Shield className="w-8 h-8 text-cyan-600" />
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between pt-6 border-t border-slate-200">
              <div className="text-slate-600">
                <span className="text-sm">Last updated: </span>
                <span className="font-medium">Just now</span>
              </div>
              
              <Button 
                variant="outline" 
                className="bg-white border-slate-300 text-slate-700 hover:bg-slate-50"
                onClick={() => setIsManageOpen(true)}
              >
                <Settings className="w-4 h-4 mr-2" />
                Manage Workspaces
              </Button>
            </div>
          </div>
        </motion.div>
      )}

      {/* Modern Workspace Grid */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.2 }}
        className="relative"
      >
        <div className="absolute inset-0 bg-gradient-to-r from-slate-600/5 via-blue-600/5 to-purple-600/5 rounded-2xl blur-xl"></div>
        <div className="relative bg-white/95 backdrop-blur-sm border border-slate-200/50 rounded-2xl p-8 shadow-xl">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center space-x-3">
              <div className="p-3 bg-gradient-to-r from-slate-600 to-blue-600 rounded-xl shadow-lg">
                <Building className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-slate-900">All Workspaces</h2>
                <p className="text-slate-600">Switch between your different brand workspaces</p>
              </div>
            </div>
            
            <Badge variant="outline" className="bg-slate-50 text-slate-700 border-slate-300">
              {workspaces.length} Workspace{workspaces.length !== 1 ? 's' : ''}
            </Badge>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {workspaces.map((workspace) => {
              const workspaceAccounts = allWorkspaceAccounts?.get(workspace.id) || [];
              const instagramAccount = workspaceAccounts.find((acc: any) => acc.platform === 'instagram');
              const totalContent = workspaceAccounts.reduce((total: number, acc: any) => total + (acc.mediaCount || 0), 0);
              const isActiveWorkspace = currentWorkspace?.id === workspace.id;
              
              return (
                <motion.div
                  key={workspace.id}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.2 }}
                  className={`relative group cursor-pointer transition-all duration-200 ${
                    isActiveWorkspace 
                      ? 'transform scale-105' 
                      : 'hover:transform hover:scale-102'
                  }`}
                  onClick={async () => {
                    if (!isActiveWorkspace) {
                      setTargetWorkspace(workspace);
                      await switchWorkspace(workspace);
                      setTargetWorkspace(null);
                    }
                  }}
                >
                  <div className={`absolute inset-0 rounded-2xl transition-all duration-200 ${
                    isActiveWorkspace 
                      ? 'bg-gradient-to-r from-blue-600/20 via-purple-600/20 to-cyan-600/20 blur-lg'
                      : 'bg-gradient-to-r from-slate-600/10 to-blue-600/10 blur-lg opacity-0 group-hover:opacity-100'
                  }`}></div>
                  
                  <div className={`relative bg-white/95 backdrop-blur-sm border rounded-2xl p-6 shadow-lg transition-all duration-200 ${
                    isActiveWorkspace 
                      ? 'border-blue-300/50 shadow-xl' 
                      : 'border-slate-200/50 group-hover:border-blue-200/50 group-hover:shadow-xl'
                  }`}>
                    {/* Header with Icon and Actions */}
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center space-x-3">
                        <div className={`p-3 rounded-xl shadow-md transition-all duration-200 ${
                          isActiveWorkspace 
                            ? 'bg-gradient-to-r from-blue-600 to-purple-600' 
                            : 'bg-gradient-to-r from-slate-600 to-blue-600 group-hover:from-blue-600 group-hover:to-purple-600'
                        }`}>
                          <Building className="w-6 h-6 text-white" />
                        </div>
                        <div>
                          <h3 className="font-bold text-slate-900 text-lg">{workspace.name}</h3>
                          {workspace.description && (
                            <p className="text-slate-600 text-sm mt-1 line-clamp-2">
                              {workspace.description}
                            </p>
                          )}
                        </div>
                      </div>
                      
                      <div className="flex flex-col space-y-2">
                        {workspace.isDefault && (
                          <Badge className="bg-amber-100 text-amber-800 border-amber-200 text-xs">
                            <Star className="w-3 h-3 mr-1" />
                            Default
                          </Badge>
                        )}
                        {isActiveWorkspace && (
                          <Badge className="bg-emerald-100 text-emerald-800 border-emerald-200 text-xs">
                            <Crown className="w-3 h-3 mr-1" />
                            Active
                          </Badge>
                        )}
                      </div>
                    </div>

                    {/* Metrics Grid */}
                    <div className="grid grid-cols-2 gap-3 mb-4">
                      <div className="bg-slate-50 border border-slate-200 rounded-lg p-3">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-slate-600 text-xs font-medium">Content</p>
                            <p className="text-slate-900 font-bold text-lg">{totalContent}</p>
                          </div>
                          <FileText className="w-4 h-4 text-slate-600" />
                        </div>
                      </div>
                      
                      <div className="bg-slate-50 border border-slate-200 rounded-lg p-3">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-slate-600 text-xs font-medium">Credits</p>
                            <p className="text-slate-900 font-bold text-lg">{workspace.credits || 0}</p>
                          </div>
                          <Zap className="w-4 h-4 text-slate-600" />
                        </div>
                      </div>
                    </div>

                    {/* Connection Status */}
                    <div className="space-y-2 mb-4">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-slate-600 font-medium">Instagram:</span>
                        <span className={instagramAccount ? "text-emerald-700 font-medium" : "text-slate-500"}>
                          {instagramAccount ? `@${instagramAccount.username}` : "Not connected"}
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-slate-600 font-medium">Status:</span>
                        <span className={workspaceAccounts.length > 0 ? "text-emerald-700 font-medium" : "text-orange-600 font-medium"}>
                          {workspaceAccounts.length > 0 ? "Active" : "Setup required"}
                        </span>
                      </div>
                    </div>

                    {/* Action Footer */}
                    <div className="flex items-center justify-between pt-4 border-t border-slate-200">
                      <div className="flex items-center space-x-2 text-xs text-slate-500">
                        <Users className="w-3 h-3" />
                        <span>Personal workspace</span>
                      </div>
                      
                      {isActiveWorkspace ? (
                        <Badge className="bg-emerald-100 text-emerald-800 border-emerald-200 text-xs px-3 py-1">
                          Current
                        </Badge>
                      ) : (
                        <Button
                          size="sm"
                          variant="outline"
                          className="bg-white border-slate-300 text-slate-700 hover:bg-slate-50 hover:border-blue-300 hover:text-blue-700 text-xs px-3 py-1 transition-all duration-200"
                        >
                          Switch to this
                        </Button>
                      )}
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </motion.div>

      {/* Modern Activity Timeline */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.3 }}
        className="relative"
      >
        <div className="absolute inset-0 bg-gradient-to-r from-emerald-600/5 via-blue-600/5 to-purple-600/5 rounded-2xl blur-xl"></div>
        <div className="relative bg-white/95 backdrop-blur-sm border border-slate-200/50 rounded-2xl p-8 shadow-xl">
          <div className="flex items-center space-x-3 mb-8">
            <div className="p-3 bg-gradient-to-r from-emerald-600 to-blue-600 rounded-xl shadow-lg">
              <Activity className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-slate-900">Recent Activity</h2>
              <p className="text-slate-600">Latest workspace and account activities</p>
            </div>
          </div>

          <div className="space-y-4">
            {socialAccounts && socialAccounts.length > 0 ? (
              socialAccounts.map((account: any, index: number) => (
                <div key={account._id} className="flex items-center gap-4 p-4 bg-emerald-50 border border-emerald-200 rounded-xl">
                  <div className="w-3 h-3 bg-emerald-500 rounded-full shadow-lg"></div>
                  <div className="flex-1">
                    <div className="flex justify-between items-center">
                      <span className="text-slate-900 font-medium">
                        {account.platform} @{account.username} connected
                      </span>
                      <span className="text-xs text-slate-500 bg-slate-100 px-2 py-1 rounded-full">Today</span>
                    </div>
                    <div className="text-sm text-emerald-700 mt-1">
                      {account.accountType} account verified and ready
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="flex items-center gap-4 p-4 bg-blue-50 border border-blue-200 rounded-xl">
                <div className="w-3 h-3 bg-blue-500 rounded-full shadow-lg"></div>
                <div className="flex-1">
                  <div className="flex justify-between items-center">
                    <span className="text-slate-900 font-medium">Workspace created successfully</span>
                    <span className="text-xs text-slate-500 bg-slate-100 px-2 py-1 rounded-full">Today</span>
                  </div>
                  <div className="text-sm text-blue-700 mt-1">Ready for social media integrations</div>
                </div>
              </div>
            )}
          </div>
        </div>
      </motion.div>

      {/* Modern Workspace Features */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.4 }}
        className="relative"
      >
        <div className="absolute inset-0 bg-gradient-to-r from-purple-600/5 via-blue-600/5 to-cyan-600/5 rounded-2xl blur-xl"></div>
        <div className="relative bg-white/95 backdrop-blur-sm border border-slate-200/50 rounded-2xl p-8 shadow-xl">
          <div className="flex items-center space-x-3 mb-8">
            <div className="p-3 bg-gradient-to-r from-purple-600 to-blue-600 rounded-xl shadow-lg">
              <Zap className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-slate-900">Workspace Capabilities</h2>
              <p className="text-slate-600">Powerful features available in every workspace</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center p-6 bg-blue-50 border border-blue-200 rounded-xl">
              <div className="p-4 bg-blue-100 rounded-2xl w-fit mx-auto mb-4">
                <Globe className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="font-bold text-slate-900 mb-3">Instagram Integration</h3>
              <p className="text-sm text-slate-600">Direct connection to Instagram Business API for authentic content and analytics data.</p>
            </div>
            
            <div className="text-center p-6 bg-purple-50 border border-purple-200 rounded-xl">
              <div className="p-4 bg-purple-100 rounded-2xl w-fit mx-auto mb-4">
                <BarChart3 className="h-8 w-8 text-purple-600" />
              </div>
              <h3 className="font-bold text-slate-900 mb-3">Real-time Analytics</h3>
              <p className="text-sm text-slate-600">Live performance tracking with authentic engagement metrics and growth insights.</p>
            </div>
            
            <div className="text-center p-6 bg-emerald-50 border border-emerald-200 rounded-xl">
              <div className="p-4 bg-emerald-100 rounded-2xl w-fit mx-auto mb-4">
                <Rocket className="h-8 w-8 text-emerald-600" />
              </div>
              <h3 className="font-bold text-slate-900 mb-3">Content Publishing</h3>
              <p className="text-sm text-slate-600">Direct publishing to Instagram with intelligent video compression and scheduling capabilities.</p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Beautiful workspace switching overlay */}
      <WorkspaceSwitchingOverlay
        isVisible={isSwitching}
        currentWorkspace={currentWorkspace}
        targetWorkspace={targetWorkspace}
      />

      {/* Workspace Management Dialog */}
      <Dialog open={isManageOpen} onOpenChange={setIsManageOpen}>
        <DialogContent className="bg-white/95 backdrop-blur-sm border-slate-200/50 max-w-4xl">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-slate-900 flex items-center">
              <Settings className="w-6 h-6 mr-3 text-blue-600" />
              Workspace Management
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-6 mt-6">
            {workspaces.map((workspace) => (
              <div key={workspace.id} className="p-6 bg-slate-50 border border-slate-200 rounded-xl">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="p-3 bg-gradient-to-r from-slate-600 to-blue-600 rounded-xl shadow-lg">
                      <Building className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <div className="font-bold text-slate-900 text-lg">{workspace.name}</div>
                      <div className="text-sm text-slate-600 mt-1">
                        {workspace.description || "No description provided"}
                      </div>
                      <div className="flex items-center space-x-3 mt-2">
                        {workspace.isDefault && (
                          <Badge className="bg-amber-100 text-amber-800 border-amber-200 text-xs">
                            <Star className="w-3 h-3 mr-1" />
                            Default
                          </Badge>
                        )}
                        {currentWorkspace?.id === workspace.id && (
                          <Badge className="bg-emerald-100 text-emerald-800 border-emerald-200 text-xs">
                            <Crown className="w-3 h-3 mr-1" />
                            Active
                          </Badge>
                        )}
                        <span className="text-xs text-slate-500">{workspace.credits || 0} credits</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEditWorkspace(workspace)}
                      className="bg-white border-slate-300 text-slate-700 hover:bg-slate-50"
                    >
                      <Edit3 className="w-4 h-4 mr-2" />
                      Edit
                    </Button>
                    {!workspace.isDefault && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleSetDefault(workspace)}
                        disabled={setDefaultMutation.isPending}
                        className="bg-white border-slate-300 text-slate-700 hover:bg-slate-50"
                      >
                        <Star className="w-4 h-4 mr-2" />
                        Set Default
                      </Button>
                    )}
                    {!workspace.isDefault && (
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button
                            variant="outline"
                            size="sm"
                            className="bg-white border-red-300 text-red-700 hover:bg-red-50"
                          >
                            <Trash2 className="w-4 h-4 mr-2" />
                            Delete
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent className="bg-white/95 backdrop-blur-sm border-slate-200/50">
                          <AlertDialogHeader>
                            <AlertDialogTitle className="text-red-600">Delete Workspace</AlertDialogTitle>
                            <AlertDialogDescription className="text-slate-600">
                              Are you sure you want to delete "{workspace.name}"? This action cannot be undone and will permanently remove all associated content and data.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel className="bg-white border-slate-300 text-slate-700">Cancel</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => handleDeleteWorkspace(workspace)}
                              className="bg-red-600 hover:bg-red-700 text-white"
                              disabled={deleteWorkspaceMutation.isPending}
                            >
                              {deleteWorkspaceMutation.isPending ? "Deleting..." : "Delete Workspace"}
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </DialogContent>
      </Dialog>

      {/* Edit Workspace Dialog */}
      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent className="bg-white/95 backdrop-blur-sm border-slate-200/50">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-slate-900 flex items-center">
              <Edit3 className="w-6 h-6 mr-3 text-blue-600" />
              Edit Workspace
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-6 mt-6">
            <div>
              <Label htmlFor="edit-workspace-name" className="text-slate-700 font-medium">Workspace Name</Label>
              <Input
                id="edit-workspace-name"
                placeholder="e.g., My Business Brand"
                value={editForm.name}
                onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                className="mt-2 bg-white border-slate-200 focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
            <div>
              <Label htmlFor="edit-workspace-description" className="text-slate-700 font-medium">Description (Optional)</Label>
              <Textarea
                id="edit-workspace-description"
                placeholder="Brief description of this workspace..."
                value={editForm.description}
                onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                className="mt-2 bg-white border-slate-200 focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
            <div>
              <Label htmlFor="edit-workspace-theme" className="text-slate-700 font-medium">Theme</Label>
              <Select value={editForm.theme} onValueChange={(value) => setEditForm({ ...editForm, theme: value })}>
                <SelectTrigger className="mt-2 bg-white border-slate-200 focus:border-blue-500 focus:ring-blue-500">
                  <SelectValue placeholder="Select a theme" />
                </SelectTrigger>
                <SelectContent className="bg-white border-slate-200">
                  <SelectItem value="default">Default</SelectItem>
                  <SelectItem value="cosmic">Cosmic Blue</SelectItem>
                  <SelectItem value="nebula">Nebula Purple</SelectItem>
                  <SelectItem value="solar">Solar Gold</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex space-x-3 pt-4">
              <Button
                onClick={handleUpdateWorkspace}
                disabled={updateWorkspaceMutation.isPending}
                className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white"
              >
                {updateWorkspaceMutation.isPending ? "Saving..." : "Save Changes"}
              </Button>
              <Button
                variant="outline"
                onClick={() => setIsEditOpen(false)}
                className="flex-1 bg-white border-slate-300 text-slate-700 hover:bg-slate-50"
              >
                Cancel
              </Button>
            </div>
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
    </motion.div>
  );
}
