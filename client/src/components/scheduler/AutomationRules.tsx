import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useWorkspace } from "@/hooks/useWorkspace";
import { useToast } from "@/hooks/use-toast";
import { Plus, Settings, Play, Pause, Trash2, Clock } from "lucide-react";

export function AutomationRules() {
  const { currentWorkspace } = useWorkspace();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [newRule, setNewRule] = useState({
    name: "",
    description: "",
    trigger: {
      type: "schedule",
      frequency: "daily",
      time: "08:00",
      platforms: []
    },
    action: {
      type: "post_content",
      contentType: "motivational"
    },
    isActive: true
  });

  const { data: automationRules } = useQuery({
    queryKey: ['automation-rules', currentWorkspace?.id],
    queryFn: () => fetch(`/api/automation-rules?workspaceId=${currentWorkspace?.id}`).then(res => res.json()),
    enabled: !!currentWorkspace?.id
  });

  const createRuleMutation = useMutation({
    mutationFn: (data: any) => apiRequest('POST', '/api/automation-rules', data),
    onSuccess: () => {
      toast({
        title: "Automation Rule Created!",
        description: "Your new automation rule is now active.",
      });
      queryClient.invalidateQueries({ queryKey: ['automation-rules'] });
      setIsCreateOpen(false);
      setNewRule({
        name: "",
        description: "",
        trigger: {
          type: "schedule",
          frequency: "daily",
          time: "08:00",
          platforms: []
        },
        action: {
          type: "post_content",
          contentType: "motivational"
        },
        isActive: true
      });
    },
    onError: (error: any) => {
      toast({
        title: "Creation Failed",
        description: error.message || "Failed to create automation rule",
        variant: "destructive",
      });
    }
  });

  const toggleRuleMutation = useMutation({
    mutationFn: ({ id, isActive }: { id: number; isActive: boolean }) => 
      apiRequest('PATCH', `/api/automation-rules/${id}`, { isActive }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['automation-rules'] });
    }
  });

  const handleCreateRule = () => {
    if (!newRule.name.trim()) {
      toast({
        title: "Name Required",
        description: "Please enter a rule name",
        variant: "destructive",
      });
      return;
    }

    createRuleMutation.mutate({
      ...newRule,
      workspaceId: currentWorkspace?.id,
      trigger: newRule.trigger,
      action: newRule.action
    });
  };

  const formatNextRun = (rule: any) => {
    if (rule.nextRun) {
      return new Date(rule.nextRun).toLocaleString();
    }
    return "Not scheduled";
  };

  const getRuleStatusColor = (isActive: boolean) => {
    return isActive ? "bg-green-400" : "bg-gray-400";
  };

  const getRuleIcon = (triggerType: string) => {
    switch (triggerType) {
      case "schedule": return <Clock className="h-4 w-4" />;
      case "engagement": return <Play className="h-4 w-4" />;
      default: return <Settings className="h-4 w-4" />;
    }
  };

  return (
    <Card className="content-card holographic">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-xl font-orbitron font-semibold neon-text text-nebula-purple">
          Active Automations
        </CardTitle>
        <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
          <DialogTrigger asChild>
            <Button size="icon" variant="ghost" className="text-nebula-purple hover:text-white">
              <Plus className="h-4 w-4" />
            </Button>
          </DialogTrigger>
          <DialogContent className="glassmorphism border-nebula-purple/30 max-w-2xl">
            <DialogHeader>
              <DialogTitle className="text-xl font-orbitron text-nebula-purple">
                Create Automation Rule
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="rule-name">Rule Name</Label>
                  <Input
                    id="rule-name"
                    placeholder="e.g., Daily Motivation Posts"
                    value={newRule.name}
                    onChange={(e) => setNewRule({ ...newRule, name: e.target.value })}
                    className="glassmorphism"
                  />
                </div>
                <div>
                  <Label htmlFor="rule-frequency">Frequency</Label>
                  <Select 
                    value={newRule.trigger.frequency} 
                    onValueChange={(value) => setNewRule({
                      ...newRule,
                      trigger: { ...newRule.trigger, frequency: value }
                    })}
                  >
                    <SelectTrigger className="glassmorphism">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="daily">Daily</SelectItem>
                      <SelectItem value="weekly">Weekly</SelectItem>
                      <SelectItem value="monthly">Monthly</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <Label htmlFor="rule-description">Description</Label>
                <Textarea
                  id="rule-description"
                  placeholder="Describe what this automation does..."
                  value={newRule.description}
                  onChange={(e) => setNewRule({ ...newRule, description: e.target.value })}
                  className="glassmorphism"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="rule-time">Posting Time</Label>
                  <Input
                    id="rule-time"
                    type="time"
                    value={newRule.trigger.time}
                    onChange={(e) => setNewRule({
                      ...newRule,
                      trigger: { ...newRule.trigger, time: e.target.value }
                    })}
                    className="glassmorphism"
                  />
                </div>
                <div>
                  <Label htmlFor="rule-content-type">Content Type</Label>
                  <Select 
                    value={newRule.action.contentType} 
                    onValueChange={(value) => setNewRule({
                      ...newRule,
                      action: { ...newRule.action, contentType: value }
                    })}
                  >
                    <SelectTrigger className="glassmorphism">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="motivational">Motivational</SelectItem>
                      <SelectItem value="educational">Educational</SelectItem>
                      <SelectItem value="entertainment">Entertainment</SelectItem>
                      <SelectItem value="promotional">Promotional</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  checked={newRule.isActive}
                  onCheckedChange={(checked) => setNewRule({ ...newRule, isActive: checked })}
                />
                <Label>Activate immediately</Label>
              </div>

              <Button
                onClick={handleCreateRule}
                disabled={createRuleMutation.isPending}
                className="w-full bg-gradient-to-r from-nebula-purple to-purple-600"
              >
                {createRuleMutation.isPending ? "Creating..." : "Create Automation Rule"}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </CardHeader>
      <CardContent>
        {automationRules && automationRules.length > 0 ? (
          <div className="space-y-4">
            {automationRules.map((rule: any) => (
              <div key={rule.id} className="p-4 rounded-lg bg-cosmic-blue border border-nebula-purple/30">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-3">
                    {getRuleIcon(rule.trigger?.type || "schedule")}
                    <div>
                      <div className="font-medium">{rule.name}</div>
                      <div className="text-xs text-asteroid-silver">
                        {rule.description || "No description"}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Switch
                      checked={rule.isActive}
                      onCheckedChange={(checked) => 
                        toggleRuleMutation.mutate({ id: rule.id, isActive: checked })
                      }
                    />
                    <div className="flex items-center space-x-2">
                      <div className={`w-2 h-2 rounded-full ${getRuleStatusColor(rule.isActive)}`}></div>
                      <span className={`text-xs ${rule.isActive ? 'text-green-400' : 'text-gray-400'}`}>
                        {rule.isActive ? 'Active' : 'Paused'}
                      </span>
                    </div>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4 text-xs">
                  <div>
                    <span className="text-asteroid-silver">Frequency:</span>
                    <span className="text-electric-cyan ml-2">
                      {rule.trigger?.frequency || 'Daily'}
                    </span>
                  </div>
                  <div>
                    <span className="text-asteroid-silver">Next run:</span>
                    <span className="text-solar-gold ml-2">
                      {formatNextRun(rule)}
                    </span>
                  </div>
                </div>

                {rule.lastRun && (
                  <div className="mt-2 text-xs text-asteroid-silver">
                    Last executed: {new Date(rule.lastRun).toLocaleString()}
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <Settings className="h-12 w-12 text-nebula-purple mx-auto mb-4 opacity-50" />
            <h3 className="font-semibold mb-2">No Automation Rules</h3>
            <p className="text-asteroid-silver text-sm mb-4">
              Create your first automation rule to streamline your content posting.
            </p>
            <Button
              onClick={() => setIsCreateOpen(true)}
              className="bg-gradient-to-r from-nebula-purple to-purple-600"
            >
              <Plus className="w-4 h-4 mr-2" />
              Create First Rule
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
