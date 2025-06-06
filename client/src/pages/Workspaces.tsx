import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { useWorkspaceContext } from "@/hooks/useWorkspace";
import { useAuth } from "@/hooks/useAuth";
import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Plus, Globe, Settings, Star, Users } from "lucide-react";
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

  // Plan upgrade modal state
  const [upgradeModal, setUpgradeModal] = useState({
    isOpen: false,
    feature: '',
    currentPlan: '',
    upgradeMessage: '',
    limitReached: null as any
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
    mutationFn: (data: any) => apiRequest('POST', '/api/workspaces', data),
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
      console.log('Workspace creation error:', error);
      
      // Handle plan restriction errors with upgrade modal
      if (error?.response?.status === 403) {
        const errorData = error.response.data;
        setIsCreateOpen(false); // Close the creation modal immediately
        
        setUpgradeModal({
          isOpen: true,
          feature: 'workspace_creation',
          currentPlan: user?.plan || 'Free',
          upgradeMessage: errorData.upgradeMessage || "Upgrade your plan to create more workspaces",
          limitReached: {
            current: workspaces?.length || 0,
            max: user?.plan === 'Free' ? 1 : 3,
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
              <Button variant="outline" size="sm" className="glassmorphism">
                <Settings className="w-4 h-4 mr-2" />
                Manage
              </Button>
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

      {/* Plan Upgrade Modal */}
      <PlanUpgradeModal
        isOpen={upgradeModal.isOpen}
        onClose={() => setUpgradeModal(prev => ({ ...prev, isOpen: false }))}
        feature={upgradeModal.feature}
        currentPlan={upgradeModal.currentPlan}
        upgradeMessage={upgradeModal.upgradeMessage}
        limitReached={upgradeModal.limitReached}
      />
    </div>
  );
}
