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
import { Plus, Globe, Settings, Star, Users, Edit3, Trash2, AlertTriangle, StarOff } from "lucide-react";
import { WorkspaceSwitchingOverlay } from "@/components/workspaces/WorkspaceSwitchingOverlay";
import PlanUpgradeModal from "@/components/subscription/PlanUpgradeModal";



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
      return response.json();
    },
    enabled: !!currentWorkspace?.id && !!token
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
      queryClient.invalidateQueries({ queryKey: ['workspaces'] });
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
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-4xl font-orbitron font-bold neon-text text-nebula-purple">
          Brand Workspaces
        </h2>
        <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
          <DialogTrigger asChild>
            <Button className="bg-gradient-to-r from-nebula-purple to-purple-600 hover:opacity-90">
              <Plus className="w-4 h-4 mr-2" />
              Create Workspace
            </Button>
          </DialogTrigger>
          <DialogContent className="glassmorphism border-electric-cyan/30">
            <DialogHeader>
              <DialogTitle className="text-xl font-orbitron text-electric-cyan">
                Create New Workspace
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="workspace-name">Workspace Name</Label>
                <Input
                  id="workspace-name"
                  placeholder="e.g., My Business Brand"
                  value={newWorkspace.name}
                  onChange={(e) => setNewWorkspace({ ...newWorkspace, name: e.target.value })}
                  className="glassmorphism"
                />
              </div>
              <div>
                <Label htmlFor="workspace-description">Description (Optional)</Label>
                <Textarea
                  id="workspace-description"
                  placeholder="Brief description of this workspace..."
                  value={newWorkspace.description}
                  onChange={(e) => setNewWorkspace({ ...newWorkspace, description: e.target.value })}
                  className="glassmorphism"
                />
              </div>
              <Button
                onClick={handleCreateWorkspace}
                disabled={createWorkspaceMutation.isPending}
                className="w-full bg-gradient-to-r from-nebula-purple to-purple-600"
              >
                {createWorkspaceMutation.isPending ? "Creating..." : "Create Workspace"}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Current Workspace */}
      {currentWorkspace && (
        <Card className="content-card holographic border-electric-cyan/50">
          <CardHeader>
            <CardTitle className="flex items-center space-x-3">
              <div className="w-12 h-12 workspace-planet rounded-full animate-glow"></div>
              <div>
                <div className="text-xl font-orbitron font-semibold text-electric-cyan">
                  {currentWorkspace.name}
                </div>
                <div className="text-sm text-asteroid-silver">Current Active Workspace</div>
              </div>
              {currentWorkspace.isDefault && (
                <Badge className="bg-solar-gold/20 text-solar-gold">
                  <Star className="w-3 h-3 mr-1" />
                  Default
                </Badge>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {currentWorkspace.description && (
              <p className="text-asteroid-silver mb-4">{currentWorkspace.description}</p>
            )}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <div className="text-center p-3 bg-cosmic-void/30 rounded-lg">
                <div className="text-lg font-bold text-gray-400">0</div>
                <div className="text-xs text-asteroid-silver">Content Items</div>
              </div>
              <div className="text-center p-3 bg-cosmic-void/30 rounded-lg">
                <div className="text-lg font-bold text-gray-400">-</div>
                <div className="text-xs text-asteroid-silver">Followers</div>
              </div>
              <div className="text-center p-3 bg-cosmic-void/30 rounded-lg">
                <div className="text-lg font-bold text-yellow-400">Setup</div>
                <div className="text-xs text-asteroid-silver">Required</div>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4 text-sm">
                <span className="text-asteroid-silver">Credits:</span>
                <span className="text-solar-gold font-mono">{currentWorkspace.credits}</span>
              </div>
              <Dialog open={isManageOpen} onOpenChange={setIsManageOpen}>
                <DialogTrigger asChild>
                  <Button variant="outline" size="sm" className="glassmorphism">
                    <Settings className="w-4 h-4 mr-2" />
                    Manage
                  </Button>
                </DialogTrigger>
                <DialogContent className="glassmorphism border-electric-cyan/30 max-w-2xl">
                  <DialogHeader>
                    <DialogTitle className="text-xl font-orbitron text-electric-cyan">
                      Workspace Management
                    </DialogTitle>
                  </DialogHeader>
                  <div className="space-y-6">
                    {workspaces.map((workspace) => (
                      <div key={workspace.id} className="p-4 rounded-lg border border-cosmic-blue/50 bg-cosmic-void/20">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            <div className="w-8 h-8 workspace-planet rounded-full animate-glow"></div>
                            <div>
                              <div className="font-medium text-white">{workspace.name}</div>
                              <div className="text-sm text-asteroid-silver">
                                {workspace.description || "No description"}
                              </div>
                              <div className="flex items-center space-x-2 mt-1">
                                {workspace.isDefault && (
                                  <Badge className="bg-solar-gold/20 text-solar-gold text-xs">
                                    <Star className="w-2 h-2 mr-1" />
                                    Default
                                  </Badge>
                                )}
                                {currentWorkspace?.id === workspace.id && (
                                  <Badge className="bg-electric-cyan/20 text-electric-cyan text-xs">
                                    Active
                                  </Badge>
                                )}
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleEditWorkspace(workspace)}
                              className="glassmorphism"
                            >
                              <Edit3 className="w-3 h-3" />
                            </Button>
                            {!workspace.isDefault && (
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleSetDefault(workspace)}
                                disabled={setDefaultMutation.isPending}
                                className="glassmorphism"
                              >
                                <Star className="w-3 h-3" />
                              </Button>
                            )}
                            {!workspace.isDefault && (
                              <AlertDialog>
                                <AlertDialogTrigger asChild>
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    className="glassmorphism text-red-400 hover:text-red-300"
                                  >
                                    <Trash2 className="w-3 h-3" />
                                  </Button>
                                </AlertDialogTrigger>
                                <AlertDialogContent className="glassmorphism border-red-500/30">
                                  <AlertDialogHeader>
                                    <AlertDialogTitle className="text-red-400">Delete Workspace</AlertDialogTitle>
                                    <AlertDialogDescription className="text-asteroid-silver">
                                      Are you sure you want to delete "{workspace.name}"? This action cannot be undone and will permanently remove all associated content and data.
                                    </AlertDialogDescription>
                                  </AlertDialogHeader>
                                  <AlertDialogFooter>
                                    <AlertDialogCancel className="glassmorphism">Cancel</AlertDialogCancel>
                                    <AlertDialogAction
                                      onClick={() => handleDeleteWorkspace(workspace)}
                                      className="bg-red-600 hover:bg-red-700"
                                      disabled={deleteWorkspaceMutation.isPending}
                                    >
                                      {deleteWorkspaceMutation.isPending ? "Deleting..." : "Delete"}
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
            </div>
          </CardContent>
        </Card>
      )}

      {/* All Workspaces */}
      <Card className="content-card holographic">
        <CardHeader>
          <CardTitle className="text-xl font-orbitron font-semibold neon-text text-solar-gold">
            All Workspaces
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {workspaces.map((workspace) => (
              <div
                key={workspace.id}
                className={`p-6 rounded-lg border transition-all cursor-pointer hover:border-electric-cyan/50 ${
                  currentWorkspace?.id === workspace.id
                    ? 'border-electric-cyan/50 bg-electric-cyan/10'
                    : 'border-cosmic-blue bg-cosmic-blue hover:bg-space-gray/50'
                }`}
                onClick={async () => {
            setTargetWorkspace(workspace);
            await switchWorkspace(workspace);
            setTargetWorkspace(null);
          }}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 workspace-planet rounded-full"></div>
                    <div>
                      <h3 className="font-semibold">{workspace.name}</h3>
                      {workspace.description && (
                        <p className="text-xs text-asteroid-silver mt-1 line-clamp-2">
                          {workspace.description}
                        </p>
                      )}
                    </div>
                  </div>
                  {workspace.isDefault && (
                    <Badge variant="outline" className="border-solar-gold/50 text-solar-gold">
                      <Star className="w-3 h-3" />
                    </Badge>
                  )}
                </div>

                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-asteroid-silver">Instagram:</span>
                    <span className="text-gray-500">Not connected</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-asteroid-silver">Content:</span>
                    <span className="text-electric-cyan">0 items</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-asteroid-silver">Status:</span>
                    <span className="text-yellow-400">Setup required</span>
                  </div>
                </div>

                <div className="flex items-center justify-between mt-4 pt-4 border-t border-asteroid-silver/20">
                  <div className="flex items-center space-x-1 text-xs text-asteroid-silver">
                    <Users className="w-3 h-3" />
                    <span>Personal</span>
                  </div>
                  {currentWorkspace?.id === workspace.id ? (
                    <Badge className="bg-green-500/20 text-green-400">Active</Badge>
                  ) : (
                    <Button
                      size="sm"
                      variant="ghost"
                      className="text-electric-cyan hover:text-white text-xs"
                    >
                      Switch
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Recent Workspace Activity */}
      <Card className="content-card holographic">
        <CardHeader>
          <CardTitle className="text-xl font-orbitron font-semibold neon-text text-green-400">
            Recent Activity
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {socialAccounts && socialAccounts.length > 0 ? (
              socialAccounts.map((account: any, index: number) => (
                <div key={account._id} className="flex items-center gap-4 p-3 bg-cosmic-void/30 rounded-lg border-l-4 border-pink-400">
                  <div className="w-2 h-2 bg-pink-400 rounded-full"></div>
                  <div className="flex-1">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">
                        {account.platform} @{account.username} connected
                      </span>
                      <span className="text-xs text-asteroid-silver">Today</span>
                    </div>
                    <div className="text-xs text-pink-400">
                      {account.accountType} account verified
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="flex items-center gap-4 p-3 bg-cosmic-void/30 rounded-lg border-l-4 border-electric-cyan">
                <div className="w-2 h-2 bg-electric-cyan rounded-full"></div>
                <div className="flex-1">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">Workspace created</span>
                    <span className="text-xs text-asteroid-silver">Today</span>
                  </div>
                  <div className="text-xs text-electric-cyan">Ready for social media integrations</div>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Workspace Features */}
      <Card className="content-card holographic">
        <CardHeader>
          <CardTitle className="text-xl font-orbitron font-semibold neon-text text-nebula-purple">
            Workspace Capabilities
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center p-4">
              <Globe className="h-12 w-12 text-electric-cyan mx-auto mb-3" />
              <h3 className="font-semibold mb-2">Instagram Integration</h3>
              <p className="text-sm text-asteroid-silver">Direct connection to Instagram Business API for authentic content and analytics data.</p>
            </div>
            <div className="text-center p-4">
              <Settings className="h-12 w-12 text-nebula-purple mx-auto mb-3" />
              <h3 className="font-semibold mb-2">Real-time Analytics</h3>
              <p className="text-sm text-asteroid-silver">Live performance tracking with authentic engagement metrics and growth insights.</p>
            </div>
            <div className="text-center p-4">
              <Star className="h-12 w-12 text-solar-gold mx-auto mb-3" />
              <h3 className="font-semibold mb-2">Content Publishing</h3>
              <p className="text-sm text-asteroid-silver">Direct publishing to Instagram with intelligent video compression and scheduling capabilities.</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Beautiful workspace switching overlay */}
      <WorkspaceSwitchingOverlay
        isVisible={isSwitching}
        currentWorkspace={currentWorkspace}
        targetWorkspace={targetWorkspace}
      />

      {/* Edit Workspace Dialog */}
      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent className="glassmorphism border-electric-cyan/30">
          <DialogHeader>
            <DialogTitle className="text-xl font-orbitron text-electric-cyan">
              Edit Workspace
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="edit-workspace-name">Workspace Name</Label>
              <Input
                id="edit-workspace-name"
                placeholder="e.g., My Business Brand"
                value={editForm.name}
                onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                className="glassmorphism"
              />
            </div>
            <div>
              <Label htmlFor="edit-workspace-description">Description (Optional)</Label>
              <Textarea
                id="edit-workspace-description"
                placeholder="Brief description of this workspace..."
                value={editForm.description}
                onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                className="glassmorphism"
              />
            </div>
            <div>
              <Label htmlFor="edit-workspace-theme">Theme</Label>
              <Select value={editForm.theme} onValueChange={(value) => setEditForm({ ...editForm, theme: value })}>
                <SelectTrigger className="glassmorphism">
                  <SelectValue placeholder="Select a theme" />
                </SelectTrigger>
                <SelectContent className="glassmorphism">
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
                className="flex-1 bg-gradient-to-r from-nebula-purple to-purple-600"
              >
                {updateWorkspaceMutation.isPending ? "Saving..." : "Save Changes"}
              </Button>
              <Button
                variant="outline"
                onClick={() => setIsEditOpen(false)}
                className="flex-1 glassmorphism"
              >
                Cancel
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Plan Upgrade Modal */}
      <PlanUpgradeModal
        isOpen={upgradeModal.isOpen}
        onClose={closeUpgradeModal}
        feature={upgradeModal.feature}
        currentPlan={upgradeModal.currentPlan}
        upgradeMessage={upgradeModal.upgradeMessage}
        limitReached={upgradeModal.limitReached}
      />
    </div>
  );
}
