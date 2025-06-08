import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { MessageSquare, Send, Settings, Activity, Clock, Users, AlertCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useWorkspace } from '@/hooks/useWorkspace';
import { apiRequest } from '@/lib/queryClient';

interface AutomationRule {
  id: string;
  workspaceId: string;
  type: 'comment' | 'dm';
  isActive: boolean;
  triggers: {
    keywords?: string[];
    hashtags?: string[];
    mentions?: boolean;
    newFollowers?: boolean;
    postInteraction?: boolean;
  };
  responses: string[];
  conditions: {
    timeDelay?: number;
    maxPerDay?: number;
    excludeKeywords?: string[];
    minFollowers?: number;
  };
  schedule?: {
    timezone: string;
    activeHours: {
      start: string;
      end: string;
    };
    activeDays: number[];
  };
  createdAt: string;
  updatedAt: string;
}

interface AutomationLog {
  id: string;
  ruleId: string;
  workspaceId: string;
  type: 'comment' | 'dm';
  targetUserId: string;
  targetUsername: string;
  message: string;
  status: 'sent' | 'failed' | 'pending';
  errorMessage?: string;
  sentAt: string;
}

export default function Automation() {
  const { toast } = useToast();
  const { currentWorkspace } = useWorkspace();
  const queryClient = useQueryClient();
  
  const [isCreatingRule, setIsCreatingRule] = useState(false);
  const [selectedTab, setSelectedTab] = useState('rules');
  const [newRule, setNewRule] = useState({
    type: 'comment' as 'comment' | 'dm',
    triggers: {
      keywords: [] as string[],
      hashtags: [] as string[],
      mentions: false,
      newFollowers: false,
      postInteraction: false
    },
    responses: [''],
    conditions: {
      timeDelay: 0,
      maxPerDay: 10,
      excludeKeywords: [] as string[],
      minFollowers: 0
    },
    schedule: {
      timezone: 'UTC',
      activeHours: {
        start: '09:00',
        end: '18:00'
      },
      activeDays: [1, 2, 3, 4, 5] // Mon-Fri
    },
    isActive: true
  });

  // Fetch automation rules
  const { data: rulesData, isLoading: rulesLoading } = useQuery({
    queryKey: ['/api/automation/rules', currentWorkspace?.id],
    queryFn: () => apiRequest('GET', `/api/automation/rules/${currentWorkspace?.id}`),
    enabled: !!currentWorkspace?.id
  });
  const rules = rulesData?.rules || [];

  // Fetch automation logs
  const { data: logsData, isLoading: logsLoading } = useQuery({
    queryKey: ['/api/automation/logs', currentWorkspace?.id],
    queryFn: () => apiRequest('GET', `/api/automation/logs/${currentWorkspace?.id}`),
    enabled: !!currentWorkspace?.id
  });
  const logs = logsData?.logs || [];

  // Create automation rule mutation
  const createRuleMutation = useMutation({
    mutationFn: (ruleData: any) => apiRequest('POST', '/api/automation/rules', {
      ...ruleData,
      workspaceId: currentWorkspace?.id
    }),
    onSuccess: () => {
      toast({
        title: "Automation Rule Created",
        description: "Your automation rule has been set up successfully."
      });
      setIsCreatingRule(false);
      resetNewRule();
      queryClient.invalidateQueries({ queryKey: ['/api/automation/rules'] });
    },
    onError: (error: any) => {
      toast({
        title: "Failed to Create Rule",
        description: error.message || "Please try again.",
        variant: "destructive"
      });
    }
  });

  // Update rule mutation
  const updateRuleMutation = useMutation({
    mutationFn: ({ ruleId, updates }: { ruleId: string; updates: any }) => 
      apiRequest('PUT', `/api/automation/rules/${ruleId}`, updates),
    onSuccess: () => {
      toast({
        title: "Rule Updated",
        description: "Automation rule has been updated successfully."
      });
      queryClient.invalidateQueries({ queryKey: ['/api/automation/rules'] });
    },
    onError: (error: any) => {
      toast({
        title: "Update Failed",
        description: error.message || "Please try again.",
        variant: "destructive"
      });
    }
  });

  // Delete rule mutation
  const deleteRuleMutation = useMutation({
    mutationFn: (ruleId: string) => apiRequest('DELETE', `/api/automation/rules/${ruleId}`),
    onSuccess: () => {
      toast({
        title: "Rule Deleted",
        description: "Automation rule has been removed."
      });
      queryClient.invalidateQueries({ queryKey: ['/api/automation/rules'] });
    }
  });

  // Send manual comment mutation
  const sendCommentMutation = useMutation({
    mutationFn: ({ mediaId, message }: { mediaId: string; message: string }) =>
      apiRequest('POST', '/api/automation/comment', {
        workspaceId: currentWorkspace?.id,
        mediaId,
        message
      }),
    onSuccess: () => {
      toast({
        title: "Comment Sent",
        description: "Your comment has been posted successfully."
      });
      queryClient.invalidateQueries({ queryKey: ['/api/automation/logs'] });
    },
    onError: (error: any) => {
      toast({
        title: "Failed to Send Comment",
        description: error.message || "Please try again.",
        variant: "destructive"
      });
    }
  });

  // Send manual DM mutation
  const sendDMMutation = useMutation({
    mutationFn: ({ recipientId, message }: { recipientId: string; message: string }) =>
      apiRequest('POST', '/api/automation/dm', {
        workspaceId: currentWorkspace?.id,
        recipientId,
        message
      }),
    onSuccess: () => {
      toast({
        title: "DM Sent",
        description: "Your direct message has been sent successfully."
      });
      queryClient.invalidateQueries({ queryKey: ['/api/automation/logs'] });
    },
    onError: (error: any) => {
      toast({
        title: "Failed to Send DM",
        description: error.message || "Please try again.",
        variant: "destructive"
      });
    }
  });

  const resetNewRule = () => {
    setNewRule({
      type: 'comment',
      triggers: {
        keywords: [],
        hashtags: [],
        mentions: false,
        newFollowers: false,
        postInteraction: false
      },
      responses: [''],
      conditions: {
        timeDelay: 0,
        maxPerDay: 10,
        excludeKeywords: [],
        minFollowers: 0
      },
      schedule: {
        timezone: 'UTC',
        activeHours: {
          start: '09:00',
          end: '18:00'
        },
        activeDays: [1, 2, 3, 4, 5]
      },
      isActive: true
    });
  };

  const addKeyword = (type: 'triggers' | 'excludeKeywords', value: string) => {
    if (!value.trim()) return;
    
    if (type === 'triggers') {
      setNewRule(prev => ({
        ...prev,
        triggers: {
          ...prev.triggers,
          keywords: [...prev.triggers.keywords || [], value.trim()]
        }
      }));
    } else {
      setNewRule(prev => ({
        ...prev,
        conditions: {
          ...prev.conditions,
          excludeKeywords: [...prev.conditions.excludeKeywords || [], value.trim()]
        }
      }));
    }
  };

  const removeKeyword = (type: 'triggers' | 'excludeKeywords', index: number) => {
    if (type === 'triggers') {
      setNewRule(prev => ({
        ...prev,
        triggers: {
          ...prev.triggers,
          keywords: prev.triggers.keywords?.filter((_, i) => i !== index) || []
        }
      }));
    } else {
      setNewRule(prev => ({
        ...prev,
        conditions: {
          ...prev.conditions,
          excludeKeywords: prev.conditions.excludeKeywords?.filter((_, i) => i !== index) || []
        }
      }));
    }
  };

  const addResponse = () => {
    setNewRule(prev => ({
      ...prev,
      responses: [...prev.responses, '']
    }));
  };

  const updateResponse = (index: number, value: string) => {
    setNewRule(prev => ({
      ...prev,
      responses: prev.responses.map((response, i) => i === index ? value : response)
    }));
  };

  const removeResponse = (index: number) => {
    if (newRule.responses.length > 1) {
      setNewRule(prev => ({
        ...prev,
        responses: prev.responses.filter((_, i) => i !== index)
      }));
    }
  };

  const toggleRuleActive = (ruleId: string, isActive: boolean) => {
    updateRuleMutation.mutate({
      ruleId,
      updates: { isActive }
    });
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'sent':
        return <Badge className="bg-green-100 text-green-800">Sent</Badge>;
      case 'failed':
        return <Badge className="bg-red-100 text-red-800">Failed</Badge>;
      case 'pending':
        return <Badge className="bg-yellow-100 text-yellow-800">Pending</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const getDayName = (dayIndex: number) => {
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    return days[dayIndex];
  };

  if (!currentWorkspace) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <AlertCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <p className="text-lg font-medium">No workspace selected</p>
          <p className="text-muted-foreground">Please select a workspace to manage automation</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Instagram Automation</h1>
          <p className="text-muted-foreground">
            Automate your Instagram engagement with smart comment and DM responses
          </p>
        </div>
        <Button onClick={() => setIsCreatingRule(true)}>
          <Settings className="h-4 w-4 mr-2" />
          Create Rule
        </Button>
      </div>

      <Tabs value={selectedTab} onValueChange={setSelectedTab}>
        <TabsList>
          <TabsTrigger value="rules">
            <Settings className="h-4 w-4 mr-2" />
            Rules
          </TabsTrigger>
          <TabsTrigger value="logs">
            <Activity className="h-4 w-4 mr-2" />
            Activity Log
          </TabsTrigger>
          <TabsTrigger value="manual">
            <Send className="h-4 w-4 mr-2" />
            Manual Actions
          </TabsTrigger>
        </TabsList>

        <TabsContent value="rules" className="space-y-4">
          {rulesLoading ? (
            <div className="text-center py-8">
              <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4" />
              <p>Loading automation rules...</p>
            </div>
          ) : rules.length === 0 ? (
            <Card>
              <CardContent className="text-center py-8">
                <Settings className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-medium mb-2">No automation rules yet</h3>
                <p className="text-muted-foreground mb-4">
                  Create your first automation rule to start automating Instagram engagement
                </p>
                <Button onClick={() => setIsCreatingRule(true)}>
                  Create First Rule
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4">
              {rules.map((rule: AutomationRule) => (
                <Card key={rule.id}>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <div className="flex items-center space-x-2">
                      {rule.type === 'comment' ? (
                        <MessageSquare className="h-5 w-5" />
                      ) : (
                        <Send className="h-5 w-5" />
                      )}
                      <CardTitle className="text-lg">
                        {rule.type === 'comment' ? 'Auto Comment' : 'Auto DM'}
                      </CardTitle>
                      {rule.isActive ? (
                        <Badge className="bg-green-100 text-green-800">Active</Badge>
                      ) : (
                        <Badge variant="secondary">Inactive</Badge>
                      )}
                    </div>
                    <div className="flex items-center space-x-2">
                      <Switch
                        checked={rule.isActive}
                        onCheckedChange={(checked) => toggleRuleActive(rule.id, checked)}
                      />
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => deleteRuleMutation.mutate(rule.id)}
                      >
                        Delete
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {rule.triggers.keywords && rule.triggers.keywords.length > 0 && (
                        <div>
                          <Label className="text-sm text-muted-foreground">Trigger Keywords:</Label>
                          <div className="flex flex-wrap gap-1 mt-1">
                            {rule.triggers.keywords.map((keyword, index) => (
                              <Badge key={index} variant="outline">{keyword}</Badge>
                            ))}
                          </div>
                        </div>
                      )}
                      
                      <div>
                        <Label className="text-sm text-muted-foreground">Responses:</Label>
                        <div className="space-y-1 mt-1">
                          {rule.responses.map((response, index) => (
                            <p key={index} className="text-sm bg-muted p-2 rounded">
                              "{response}"
                            </p>
                          ))}
                        </div>
                      </div>

                      <div className="flex items-center justify-between text-sm text-muted-foreground">
                        <span>Max per day: {rule.conditions.maxPerDay || 'No limit'}</span>
                        <span>
                          Active: {rule.schedule?.activeHours.start} - {rule.schedule?.activeHours.end}
                        </span>
                        <span>
                          Days: {rule.schedule?.activeDays.map(getDayName).join(', ')}
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="logs" className="space-y-4">
          {logsLoading ? (
            <div className="text-center py-8">
              <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4" />
              <p>Loading activity logs...</p>
            </div>
          ) : logs.length === 0 ? (
            <Card>
              <CardContent className="text-center py-8">
                <Activity className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-medium mb-2">No activity yet</h3>
                <p className="text-muted-foreground">
                  Automation activities will appear here once rules are triggered
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-3">
              {logs.map((log: AutomationLog) => (
                <Card key={log.id}>
                  <CardContent className="pt-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        {log.type === 'comment' ? (
                          <MessageSquare className="h-5 w-5 text-blue-500" />
                        ) : (
                          <Send className="h-5 w-5 text-green-500" />
                        )}
                        <div>
                          <p className="font-medium">
                            {log.type === 'comment' ? 'Comment' : 'DM'} to @{log.targetUsername}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            "{log.message}"
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        {getStatusBadge(log.status)}
                        <p className="text-xs text-muted-foreground mt-1">
                          {new Date(log.sentAt).toLocaleString()}
                        </p>
                      </div>
                    </div>
                    {log.errorMessage && (
                      <div className="mt-2 p-2 bg-red-50 border border-red-200 rounded text-red-800 text-sm">
                        Error: {log.errorMessage}
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="manual" className="space-y-4">
          <div className="grid md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <MessageSquare className="h-5 w-5 mr-2" />
                  Send Manual Comment
                </CardTitle>
                <CardDescription>
                  Post a comment on a specific Instagram media
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="comment-media-id">Media ID</Label>
                  <Input
                    id="comment-media-id"
                    placeholder="Enter Instagram media ID"
                  />
                </div>
                <div>
                  <Label htmlFor="comment-message">Comment Text</Label>
                  <Textarea
                    id="comment-message"
                    placeholder="Enter your comment..."
                    rows={3}
                  />
                </div>
                <Button 
                  className="w-full"
                  disabled={sendCommentMutation.isPending}
                >
                  {sendCommentMutation.isPending ? 'Sending...' : 'Post Comment'}
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Send className="h-5 w-5 mr-2" />
                  Send Manual DM
                </CardTitle>
                <CardDescription>
                  Send a direct message to an Instagram user
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="dm-recipient-id">Recipient User ID</Label>
                  <Input
                    id="dm-recipient-id"
                    placeholder="Enter Instagram user ID"
                  />
                </div>
                <div>
                  <Label htmlFor="dm-message">Message Text</Label>
                  <Textarea
                    id="dm-message"
                    placeholder="Enter your message..."
                    rows={3}
                  />
                </div>
                <Button 
                  className="w-full"
                  disabled={sendDMMutation.isPending}
                >
                  {sendDMMutation.isPending ? 'Sending...' : 'Send DM'}
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      {/* Create Rule Modal/Dialog would go here */}
      {isCreatingRule && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <CardHeader>
              <CardTitle>Create Automation Rule</CardTitle>
              <CardDescription>
                Set up automated responses for Instagram engagement
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <Label>Rule Type</Label>
                <div className="flex space-x-4 mt-2">
                  <label className="flex items-center space-x-2">
                    <input
                      type="radio"
                      value="comment"
                      checked={newRule.type === 'comment'}
                      onChange={(e) => setNewRule(prev => ({ ...prev, type: e.target.value as 'comment' | 'dm' }))}
                    />
                    <span>Auto Comment</span>
                  </label>
                  <label className="flex items-center space-x-2">
                    <input
                      type="radio"
                      value="dm"
                      checked={newRule.type === 'dm'}
                      onChange={(e) => setNewRule(prev => ({ ...prev, type: e.target.value as 'comment' | 'dm' }))}
                    />
                    <span>Auto DM</span>
                  </label>
                </div>
              </div>

              <div>
                <Label>Trigger Keywords</Label>
                <div className="space-y-2 mt-2">
                  <Input
                    placeholder="Add keyword and press Enter"
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        addKeyword('triggers', e.currentTarget.value);
                        e.currentTarget.value = '';
                      }
                    }}
                  />
                  <div className="flex flex-wrap gap-1">
                    {newRule.triggers.keywords?.map((keyword, index) => (
                      <Badge key={index} variant="outline" className="cursor-pointer" onClick={() => removeKeyword('triggers', index)}>
                        {keyword} ×
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>

              <div>
                <Label>Responses</Label>
                <div className="space-y-2 mt-2">
                  {newRule.responses.map((response, index) => (
                    <div key={index} className="flex gap-2">
                      <Textarea
                        value={response}
                        onChange={(e) => updateResponse(index, e.target.value)}
                        placeholder="Enter response message..."
                        rows={2}
                      />
                      {newRule.responses.length > 1 && (
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => removeResponse(index)}
                        >
                          ×
                        </Button>
                      )}
                    </div>
                  ))}
                  <Button type="button" variant="outline" onClick={addResponse}>
                    Add Response
                  </Button>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="max-per-day">Max per Day</Label>
                  <Input
                    id="max-per-day"
                    type="number"
                    value={newRule.conditions.maxPerDay}
                    onChange={(e) => setNewRule(prev => ({
                      ...prev,
                      conditions: { ...prev.conditions, maxPerDay: parseInt(e.target.value) || 0 }
                    }))}
                  />
                </div>
                <div>
                  <Label htmlFor="time-delay">Delay (minutes)</Label>
                  <Input
                    id="time-delay"
                    type="number"
                    value={newRule.conditions.timeDelay}
                    onChange={(e) => setNewRule(prev => ({
                      ...prev,
                      conditions: { ...prev.conditions, timeDelay: parseInt(e.target.value) || 0 }
                    }))}
                  />
                </div>
              </div>

              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => setIsCreatingRule(false)}>
                  Cancel
                </Button>
                <Button
                  onClick={() => createRuleMutation.mutate(newRule)}
                  disabled={createRuleMutation.isPending}
                >
                  {createRuleMutation.isPending ? 'Creating...' : 'Create Rule'}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}