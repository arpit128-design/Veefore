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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { MessageSquare, Send, Settings, Activity, Clock, Users, AlertCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useWorkspaceContext } from '@/hooks/useWorkspace';
import { apiRequest } from '@/lib/queryClient';

interface AutomationRule {
  id: string;
  name?: string;
  workspaceId: string;
  type: 'comment' | 'dm';
  isActive: boolean;
  triggers: {
    aiMode?: 'contextual' | 'keyword';
    keywords?: string[];
    hashtags?: string[];
    mentions?: boolean;
    newFollowers?: boolean;
    postInteraction?: boolean;
  };
  responses: string[];
  aiPersonality?: string;
  responseLength?: string;
  conditions: {
    timeDelay?: number;
    maxPerDay?: number;
    excludeKeywords?: string[];
    minFollowers?: number;
    responseDelay?: number; // seconds between responses
    ruleDuration?: number; // days to keep rule active
  };
  schedule?: {
    timezone: string;
    activeHours: {
      start: string;
      end: string;
    };
    activeDays: number[];
  };
  aiConfig?: {
    personality: 'friendly' | 'professional' | 'casual' | 'enthusiastic' | 'helpful' | 'humorous';
    responseLength: 'short' | 'medium' | 'long';
    dailyLimit: number;
    responseDelay: number; // minutes
    language: 'auto' | 'english' | 'hindi' | 'hinglish';
    contextualMode: boolean;
  };
  duration?: {
    startDate: string;
    endDate?: string;
    durationDays?: number;
    autoExpire: boolean;
  };
  activeTime?: {
    enabled: boolean;
    startTime: string;
    endTime: string;
    timezone: string;
    activeDays: number[]; // 0=Sunday, 1=Monday, etc.
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
  const { currentWorkspace } = useWorkspaceContext();
  const queryClient = useQueryClient();
  
  const [isCreatingRule, setIsCreatingRule] = useState(false);
  const [selectedTab, setSelectedTab] = useState('rules');
  const [newRule, setNewRule] = useState({
    name: '',
    platform: 'instagram' as 'instagram' | 'twitter' | 'linkedin' | 'facebook' | 'all',
    type: 'comment' as 'comment' | 'dm',
    triggers: {
      aiMode: 'contextual' as 'contextual' | 'keyword',
      keywords: [] as string[],
      hashtags: [] as string[],
      mentions: false,
      newFollowers: false,
      postInteraction: false
    },
    responses: [''],
    aiPersonality: 'friendly',
    responseLength: 'medium',
    conditions: {
      timeDelay: 0,
      maxPerDay: 10,
      excludeKeywords: [] as string[],
      minFollowers: 0,
      responseDelay: 30, // seconds between responses
      ruleDuration: 30 // days to keep rule active
    },
    schedule: {
      timezone: 'UTC',
      activeHours: {
        start: '09:00',
        end: '18:00'
      },
      activeDays: [1, 2, 3, 4, 5] // Mon-Fri
    },
    aiConfig: {
      personality: 'friendly' as 'friendly' | 'professional' | 'casual' | 'enthusiastic' | 'helpful' | 'humorous',
      responseLength: 'medium' as 'short' | 'medium' | 'long',
      dailyLimit: 50,
      responseDelay: 2, // minutes
      language: 'auto' as 'auto' | 'english' | 'hindi' | 'hinglish',
      contextualMode: true
    },
    duration: {
      startDate: new Date().toISOString().split('T')[0],
      durationDays: 30,
      autoExpire: true
    },
    activeTime: {
      enabled: true,
      startTime: '09:00',
      endTime: '21:00',
      timezone: 'Asia/Kolkata',
      activeDays: [1, 2, 3, 4, 5, 6, 7] // All days
    },
    isActive: true
  });

  // Fetch automation rules
  const { data: rulesData, isLoading: rulesLoading } = useQuery({
    queryKey: ['/api/automation/rules', currentWorkspace?.id],
    queryFn: async () => {
      const response = await apiRequest('GET', `/api/automation/rules/${currentWorkspace?.id}`);
      const data = await response.json();
      console.log('[AUTOMATION] Rules API response:', data);
      return data;
    },
    enabled: !!currentWorkspace?.id
  });
  const rules = rulesData?.rules || [];

  // Fetch automation logs
  const { data: logsData, isLoading: logsLoading } = useQuery({
    queryKey: ['/api/automation/logs', currentWorkspace?.id],
    queryFn: async () => {
      const response = await apiRequest('GET', `/api/automation/logs/${currentWorkspace?.id}`);
      const data = await response.json();
      return data;
    },
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
      name: '',
      platform: 'instagram',
      type: 'comment',
      triggers: {
        aiMode: 'contextual',
        keywords: [],
        hashtags: [],
        mentions: false,
        newFollowers: false,
        postInteraction: false
      },
      responses: [''],
      aiPersonality: 'friendly',
      responseLength: 'medium',
      conditions: {
        timeDelay: 0,
        maxPerDay: 10,
        excludeKeywords: [],
        minFollowers: 0,
        responseDelay: 30,
        ruleDuration: 30
      },
      schedule: {
        timezone: 'UTC',
        activeHours: {
          start: '09:00',
          end: '18:00'
        },
        activeDays: [1, 2, 3, 4, 5]
      },
      aiConfig: {
        personality: 'friendly',
        responseLength: 'medium',
        dailyLimit: 50,
        responseDelay: 2,
        language: 'auto',
        contextualMode: true
      },
      duration: {
        startDate: new Date().toISOString().split('T')[0],
        durationDays: 30,
        autoExpire: true
      },
      activeTime: {
        enabled: true,
        startTime: '09:00',
        endTime: '21:00',
        timezone: 'Asia/Kolkata',
        activeDays: [1, 2, 3, 4, 5, 6, 7]
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
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-3 sm:gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold">Instagram Automation</h1>
          <p className="text-muted-foreground text-sm sm:text-base">
            Automate your Instagram engagement with smart comment and DM responses
          </p>
        </div>
        <Button onClick={() => setIsCreatingRule(true)} className="w-full sm:w-auto">
          <Settings className="h-3 w-3 sm:h-4 sm:w-4 mr-2" />
          <span className="hidden sm:inline">Create Rule</span>
          <span className="sm:hidden">Create</span>
        </Button>
      </div>

      <Tabs value={selectedTab} onValueChange={setSelectedTab}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="rules" className="flex items-center justify-center gap-1 sm:gap-2">
            <Settings className="h-3 w-3 sm:h-4 sm:w-4" />
            <span className="hidden sm:inline">Rules</span>
            <span className="sm:hidden text-xs">Rules</span>
          </TabsTrigger>
          <TabsTrigger value="logs" className="flex items-center justify-center gap-1 sm:gap-2">
            <Activity className="h-3 w-3 sm:h-4 sm:w-4" />
            <span className="hidden sm:inline">Activity Log</span>
            <span className="sm:hidden text-xs">Logs</span>
          </TabsTrigger>
          <TabsTrigger value="manual" className="flex items-center justify-center gap-1 sm:gap-2">
            <Send className="h-3 w-3 sm:h-4 sm:w-4" />
            <span className="hidden sm:inline">Manual Actions</span>
            <span className="sm:hidden text-xs">Manual</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="rules" className="space-y-3 sm:space-y-4">
          {rulesLoading ? (
            <div className="text-center py-6 sm:py-8">
              <div className="animate-spin w-6 h-6 sm:w-8 sm:h-8 border-4 border-primary border-t-transparent rounded-full mx-auto mb-3 sm:mb-4" />
              <p className="text-sm sm:text-base">Loading automation rules...</p>
            </div>
          ) : rules.length === 0 ? (
            <Card>
              <CardContent className="text-center py-6 sm:py-8">
                <Settings className="h-8 w-8 sm:h-12 sm:w-12 text-muted-foreground mx-auto mb-3 sm:mb-4" />
                <h3 className="text-base sm:text-lg font-medium mb-2">No automation rules yet</h3>
                <p className="text-muted-foreground mb-3 sm:mb-4 text-sm sm:text-base">
                  Create your first automation rule to start automating Instagram engagement
                </p>
                <Button onClick={() => setIsCreatingRule(true)} className="w-full sm:w-auto">
                  Create First Rule
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-3 sm:gap-4">
              {rules.map((rule: AutomationRule) => (
                <Card key={rule.id}>
                  <CardHeader className="flex flex-col sm:flex-row sm:items-center justify-between space-y-2 sm:space-y-0 pb-2">
                    <div className="flex items-center space-x-2">
                      {rule.type === 'comment' ? (
                        <MessageSquare className="h-4 w-4 sm:h-5 sm:w-5" />
                      ) : (
                        <Send className="h-4 w-4 sm:h-5 sm:w-5" />
                      )}
                      <CardTitle className="text-base sm:text-lg">
                        {rule.name || (rule.type === 'comment' ? 'Auto Comment' : 'Auto DM')}
                      </CardTitle>
                      {rule.isActive ? (
                        <Badge className="bg-green-100 text-green-800 text-xs">Active</Badge>
                      ) : (
                        <Badge variant="secondary" className="text-xs">Inactive</Badge>
                      )}
                    </div>
                    <div className="flex items-center justify-between sm:justify-end space-x-2">
                      <Switch
                        checked={rule.isActive}
                        onCheckedChange={(checked) => toggleRuleActive(rule.id, checked)}
                      />
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => deleteRuleMutation.mutate(rule.id)}
                        className="h-8 px-2 sm:px-3"
                      >
                        Delete
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {rule.triggers?.keywords && rule.triggers.keywords.length > 0 && (
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
                          {(rule.responses || []).map((response, index) => (
                            <p key={index} className="text-sm bg-muted p-2 rounded">
                              "{response}"
                            </p>
                          ))}
                        </div>
                      </div>

                      {rule.aiConfig && (
                        <div className="bg-blue-50 dark:bg-blue-950/20 p-3 rounded-lg">
                          <Label className="text-sm font-medium text-blue-800 dark:text-blue-200">AI Configuration:</Label>
                          <div className="grid grid-cols-2 gap-2 mt-2 text-xs text-blue-700 dark:text-blue-300">
                            <span>Personality: {rule.aiConfig.personality}</span>
                            <span>Length: {rule.aiConfig.responseLength}</span>
                            <span>Daily Limit: {rule.aiConfig.dailyLimit}</span>
                            <span>Response Delay: {rule.aiConfig.responseDelay}min</span>
                            <span>Language: {rule.aiConfig.language}</span>
                            <span>Mode: {rule.aiConfig.contextualMode ? 'Contextual' : 'Standard'}</span>
                          </div>
                        </div>
                      )}

                      <div className="flex items-center justify-between text-sm text-muted-foreground">
                        <span>Max per day: {rule.aiConfig?.dailyLimit || rule.conditions?.maxPerDay || 'No limit'}</span>
                        <span>
                          Active: {rule.activeTime?.startTime || rule.schedule?.activeHours?.start || '09:00'} - {rule.activeTime?.endTime || rule.schedule?.activeHours?.end || '18:00'}
                        </span>
                        <span>
                          Days: {rule.activeTime?.activeDays?.map(getDayName).join(', ') || rule.schedule?.activeDays?.map(getDayName).join(', ') || 'All days'}
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="logs" className="space-y-3 sm:space-y-4">
          {logsLoading ? (
            <div className="text-center py-6 sm:py-8">
              <div className="animate-spin w-6 h-6 sm:w-8 sm:h-8 border-4 border-primary border-t-transparent rounded-full mx-auto mb-3 sm:mb-4" />
              <p className="text-sm sm:text-base">Loading activity logs...</p>
            </div>
          ) : logs.length === 0 ? (
            <Card>
              <CardContent className="text-center py-6 sm:py-8">
                <Activity className="h-8 w-8 sm:h-12 sm:w-12 text-muted-foreground mx-auto mb-3 sm:mb-4" />
                <h3 className="text-base sm:text-lg font-medium mb-2">No activity yet</h3>
                <p className="text-muted-foreground text-sm sm:text-base">
                  Automation activities will appear here once rules are triggered
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-2 sm:space-y-3">
              {logs.map((log: AutomationLog) => (
                <Card key={log.id}>
                  <CardContent className="pt-3 sm:pt-4">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div className="flex items-center space-x-3">
                        {log.type === 'comment' ? (
                          <MessageSquare className="h-4 w-4 sm:h-5 sm:w-5 text-blue-500" />
                        ) : (
                          <Send className="h-4 w-4 sm:h-5 sm:w-5 text-green-500" />
                        )}
                        <div className="flex-1">
                          <p className="font-medium text-sm sm:text-base">
                            {log.type === 'comment' ? 'Comment' : 'DM'} to @{log.targetUsername}
                          </p>
                          <p className="text-xs sm:text-sm text-muted-foreground break-words">
                            "{log.message}"
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center justify-between sm:justify-end sm:text-right gap-2">
                        {getStatusBadge(log.status)}
                        <p className="text-xs text-muted-foreground">
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

        <TabsContent value="manual" className="space-y-3 sm:space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
            <Card>
              <CardHeader className="pb-3 sm:pb-6">
                <CardTitle className="flex items-center text-base sm:text-lg">
                  <MessageSquare className="h-4 w-4 sm:h-5 sm:w-5 mr-2" />
                  Send Manual Comment
                </CardTitle>
                <CardDescription className="text-xs sm:text-sm">
                  Post a comment on a specific Instagram media
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3 sm:space-y-4">
                <div>
                  <Label htmlFor="comment-media-id" className="text-xs sm:text-sm">Media ID</Label>
                  <Input
                    id="comment-media-id"
                    placeholder="Enter Instagram media ID"
                    className="text-sm"
                  />
                </div>
                <div>
                  <Label htmlFor="comment-message" className="text-xs sm:text-sm">Comment Text</Label>
                  <Textarea
                    id="comment-message"
                    placeholder="Enter your comment..."
                    rows={3}
                    className="text-sm"
                  />
                </div>
                <Button 
                  className="w-full h-9 text-sm"
                  disabled={sendCommentMutation.isPending}
                >
                  {sendCommentMutation.isPending ? 'Sending...' : 'Post Comment'}
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3 sm:pb-6">
                <CardTitle className="flex items-center text-base sm:text-lg">
                  <Send className="h-4 w-4 sm:h-5 sm:w-5 mr-2" />
                  Send Manual DM
                </CardTitle>
                <CardDescription className="text-xs sm:text-sm">
                  Send a direct message to an Instagram user
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3 sm:space-y-4">
                <div>
                  <Label htmlFor="dm-recipient-id" className="text-xs sm:text-sm">Recipient User ID</Label>
                  <Input
                    id="dm-recipient-id"
                    placeholder="Enter Instagram user ID"
                    className="text-sm"
                  />
                </div>
                <div>
                  <Label htmlFor="dm-message" className="text-xs sm:text-sm">Message Text</Label>
                  <Textarea
                    id="dm-message"
                    placeholder="Enter your message..."
                    rows={3}
                    className="text-sm"
                  />
                </div>
                <Button 
                  className="w-full h-9 text-sm"
                  disabled={sendDMMutation.isPending}
                >
                  {sendDMMutation.isPending ? 'Sending...' : 'Send DM'}
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      {/* Create Rule Dialog */}
      <Dialog open={isCreatingRule} onOpenChange={setIsCreatingRule}>
        <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto p-4 sm:p-6">
          <DialogHeader>
            <DialogTitle className="text-lg sm:text-xl font-semibold">Create Automation Rule</DialogTitle>
            <DialogDescription className="text-muted-foreground text-sm sm:text-base">
              Set up automated responses for Instagram engagement
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 sm:space-y-6 py-4 sm:py-6">
              {/* Rule Name Field */}
              <div className="space-y-2">
                <Label htmlFor="rule-name" className="text-sm font-medium">Rule Name *</Label>
                <Input
                  id="rule-name"
                  placeholder="Enter rule name (e.g., Auto Reply Comments)"
                  value={newRule.name}
                  onChange={(e) => setNewRule(prev => ({ ...prev, name: e.target.value }))}
                  className="w-full"
                />
              </div>

              {/* Platform Selector */}
              <div className="space-y-2">
                <Label className="text-sm font-medium">Target Platform</Label>
                <Select 
                  value={newRule.platform} 
                  onValueChange={(value) => setNewRule(prev => ({ ...prev, platform: value as any }))}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select platform" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="instagram">Instagram</SelectItem>
                    <SelectItem value="twitter">Twitter</SelectItem>
                    <SelectItem value="linkedin">LinkedIn</SelectItem>
                    <SelectItem value="facebook">Facebook</SelectItem>
                    <SelectItem value="all">All Platforms</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-3">
                <Label className="text-sm font-medium">Rule Type</Label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <label className={`flex items-center space-x-3 p-3 border-2 rounded-lg cursor-pointer transition-colors ${
                    newRule.type === 'comment' 
                      ? 'border-primary bg-primary/5' 
                      : 'border-muted hover:border-primary/50'
                  }`}>
                    <input
                      type="radio"
                      value="comment"
                      checked={newRule.type === 'comment'}
                      onChange={(e) => setNewRule(prev => ({ ...prev, type: e.target.value as 'comment' | 'dm' }))}
                      className="w-4 h-4"
                    />
                    <div>
                      <div className="font-medium">AI Auto Comment</div>
                      <div className="text-xs text-muted-foreground">Intelligent replies to all comments</div>
                    </div>
                  </label>
                  <label className={`flex items-center space-x-3 p-3 border-2 rounded-lg cursor-pointer transition-colors ${
                    newRule.type === 'dm' 
                      ? 'border-primary bg-primary/5' 
                      : 'border-muted hover:border-primary/50'
                  }`}>
                    <input
                      type="radio"
                      value="dm"
                      checked={newRule.type === 'dm'}
                      onChange={(e) => setNewRule(prev => ({ ...prev, type: e.target.value as 'comment' | 'dm' }))}
                      className="w-4 h-4"
                    />
                    <div>
                      <div className="font-medium">AI Auto DM</div>
                      <div className="text-xs text-muted-foreground">Smart direct message responses</div>
                    </div>
                  </label>
                </div>
              </div>

              <div className="space-y-3">
                <div>
                  <Label className="text-sm font-medium">AI Response Mode</Label>
                  <p className="text-xs text-muted-foreground mt-1">
                    Choose how AI should respond to messages
                  </p>
                </div>
                <div className="space-y-3">
                  <div className="grid grid-cols-1 gap-3">
                    <label className={`flex items-start space-x-3 p-3 border-2 rounded-lg cursor-pointer transition-colors ${
                      newRule.triggers.aiMode === 'contextual' 
                        ? 'border-primary bg-primary/5' 
                        : 'border-muted hover:border-primary/50'
                    }`}>
                      <input
                        type="radio"
                        name="aiMode"
                        value="contextual"
                        checked={newRule.triggers.aiMode === 'contextual'}
                        onChange={(e) => setNewRule(prev => ({
                          ...prev,
                          triggers: { ...prev.triggers, aiMode: e.target.value }
                        }))}
                        className="w-4 h-4 mt-1"
                      />
                      <div>
                        <div className="font-medium">Smart Contextual AI (Recommended)</div>
                        <div className="text-xs text-muted-foreground mt-1">
                          AI analyzes each comment/DM and generates intelligent responses in the same language (Hindi/Hinglish/English). 
                          Understands internet slang, tone, and personality to reply naturally.
                        </div>
                        <div className="text-xs text-primary mt-1 font-medium">
                          No keywords needed • Multilingual • Tone matching • Context aware
                        </div>
                      </div>
                    </label>
                    <label className={`flex items-start space-x-3 p-3 border-2 rounded-lg cursor-pointer transition-colors ${
                      newRule.triggers.aiMode === 'keyword' 
                        ? 'border-primary bg-primary/5' 
                        : 'border-muted hover:border-primary/50'
                    }`}>
                      <input
                        type="radio"
                        name="aiMode"
                        value="keyword"
                        checked={newRule.triggers.aiMode === 'keyword'}
                        onChange={(e) => setNewRule(prev => ({
                          ...prev,
                          triggers: { ...prev.triggers, aiMode: e.target.value }
                        }))}
                        className="w-4 h-4 mt-1"
                      />
                      <div>
                        <div className="font-medium">Keyword-Based Responses</div>
                        <div className="text-xs text-muted-foreground mt-1">
                          Traditional keyword matching with predefined responses
                        </div>
                      </div>
                    </label>
                  </div>
                  
                  {newRule.triggers.aiMode === 'keyword' && (
                    <div className="space-y-3 pt-2">
                      <Input
                        placeholder="Type a keyword and press Enter to add..."
                        onKeyPress={(e) => {
                          if (e.key === 'Enter') {
                            const value = e.currentTarget.value.trim();
                            if (value) {
                              addKeyword('triggers', value);
                              e.currentTarget.value = '';
                            }
                          }
                        }}
                        className="w-full"
                      />
                      {newRule.triggers.keywords && newRule.triggers.keywords.length > 0 && (
                        <div className="flex flex-wrap gap-2">
                          {newRule.triggers.keywords.map((keyword, index) => (
                            <Badge 
                              key={index} 
                              variant="secondary" 
                              className="cursor-pointer hover:bg-destructive hover:text-destructive-foreground transition-colors"
                              onClick={() => removeKeyword('triggers', index)}
                            >
                              {keyword} ×
                            </Badge>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>

              <div className="space-y-3">
                <div>
                  <Label className="text-sm font-medium">
                    {newRule.triggers.aiMode === 'contextual' ? 'AI Response Settings' : 'Automated Responses'}
                  </Label>
                  <p className="text-xs text-muted-foreground mt-1">
                    {newRule.triggers.aiMode === 'contextual' 
                      ? 'Configure how AI should respond to messages'
                      : 'Messages that will be sent automatically. System will randomly choose from these.'
                    }
                  </p>
                </div>
                
                {newRule.triggers.aiMode === 'contextual' ? (
                  <div className="space-y-4">
                    <div className="p-4 bg-primary/5 border border-primary/20 rounded-lg">
                      <div className="flex items-start space-x-3">
                        <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                          <svg className="w-4 h-4 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                          </svg>
                        </div>
                        <div>
                          <h4 className="font-medium text-sm">Smart AI Response Engine</h4>
                          <div className="text-xs text-muted-foreground mt-1 space-y-1">
                            <p>• Analyzes incoming messages in any language (Hindi/Hinglish/English)</p>
                            <p>• Understands tone, personality, and context</p>
                            <p>• Generates natural, engaging responses</p>
                            <p>• Matches customer's communication style and language</p>
                            <p>• Comprehends internet slang and modern expressions</p>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    {/* AI Configuration Panel */}
                    <div className="space-y-4 p-4 bg-muted/30 rounded-lg border">
                      <h4 className="font-medium text-sm text-gray-200">AI Response Configuration</h4>
                      
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="ai-personality" className="text-sm">AI Personality</Label>
                          <Select 
                            value={newRule.aiConfig?.personality || 'friendly'} 
                            onValueChange={(value) => setNewRule(prev => ({
                              ...prev,
                              aiConfig: { ...prev.aiConfig!, personality: value as any }
                            }))}
                          >
                            <SelectTrigger className="w-full">
                              <SelectValue placeholder="Choose personality" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="friendly">😊 Friendly & Warm</SelectItem>
                              <SelectItem value="professional">💼 Professional & Polite</SelectItem>
                              <SelectItem value="casual">😎 Casual & Relaxed</SelectItem>
                              <SelectItem value="enthusiastic">⚡ Enthusiastic & Energetic</SelectItem>
                              <SelectItem value="helpful">🤝 Helpful & Supportive</SelectItem>
                              <SelectItem value="humorous">😄 Humorous & Fun</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="response-length" className="text-sm">Response Length</Label>
                          <Select 
                            value={newRule.aiConfig?.responseLength || 'medium'} 
                            onValueChange={(value) => setNewRule(prev => ({
                              ...prev,
                              aiConfig: { ...prev.aiConfig!, responseLength: value as any }
                            }))}
                          >
                            <SelectTrigger className="w-full">
                              <SelectValue placeholder="Choose length" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="short">📝 Short (1-2 sentences)</SelectItem>
                              <SelectItem value="medium">📄 Medium (2-3 sentences)</SelectItem>
                              <SelectItem value="long">📋 Long (3-4 sentences)</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="daily-limit" className="text-sm">Daily Response Limit</Label>
                          <Input
                            id="daily-limit"
                            type="number"
                            min="1"
                            max="200"
                            value={newRule.aiConfig?.dailyLimit || 50}
                            onChange={(e) => setNewRule(prev => ({
                              ...prev,
                              aiConfig: { ...prev.aiConfig!, dailyLimit: parseInt(e.target.value) || 50 }
                            }))}
                            placeholder="50"
                          />
                          <p className="text-xs text-muted-foreground">Max AI responses per day</p>
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="response-delay" className="text-sm">Response Delay (minutes)</Label>
                          <Input
                            id="response-delay"
                            type="number"
                            min="0"
                            max="60"
                            value={newRule.aiConfig?.responseDelay || 2}
                            onChange={(e) => setNewRule(prev => ({
                              ...prev,
                              aiConfig: { ...prev.aiConfig!, responseDelay: parseInt(e.target.value) || 2 }
                            }))}
                            placeholder="2"
                          />
                          <p className="text-xs text-muted-foreground">Wait time before responding</p>
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="ai-language" className="text-sm">Response Language</Label>
                        <Select 
                          value={newRule.aiConfig?.language || 'auto'} 
                          onValueChange={(value) => setNewRule(prev => ({
                            ...prev,
                            aiConfig: { ...prev.aiConfig!, language: value as any }
                          }))}
                        >
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Choose language" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="auto">🌐 Auto-detect (Recommended)</SelectItem>
                            <SelectItem value="english">🇺🇸 English Only</SelectItem>
                            <SelectItem value="hindi">🇮🇳 Hindi Only</SelectItem>
                            <SelectItem value="hinglish">🔄 Hinglish Mix</SelectItem>
                          </SelectContent>
                        </Select>
                        <p className="text-xs text-muted-foreground">AI will match user's language automatically</p>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {newRule.responses.map((response, index) => (
                      <div key={index} className="space-y-2">
                        <div className="flex items-center justify-between">
                          <Label className="text-xs font-medium text-muted-foreground">
                            Response {index + 1}
                          </Label>
                          {newRule.responses.length > 1 && (
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              onClick={() => removeResponse(index)}
                              className="h-6 w-6 p-0 hover:bg-destructive hover:text-destructive-foreground"
                            >
                              ×
                            </Button>
                          )}
                        </div>
                        <Textarea
                          value={response}
                          onChange={(e) => updateResponse(index, e.target.value)}
                          placeholder="Enter your automated response message..."
                          rows={3}
                          className="resize-none"
                        />
                      </div>
                    ))}
                    <Button 
                      type="button" 
                      variant="outline" 
                      onClick={addResponse}
                      className="w-full"
                    >
                      + Add Another Response
                    </Button>
                  </div>
                )}
              </div>

              {/* Rule Duration Settings */}
              <div className="space-y-4 p-4 bg-amber-50 dark:bg-amber-950/20 rounded-lg border border-amber-200 dark:border-amber-800">
                <div>
                  <Label className="text-sm font-medium flex items-center">
                    <Clock className="h-4 w-4 mr-2" />
                    Rule Duration & Expiry
                  </Label>
                  <p className="text-xs text-muted-foreground mt-1">
                    Control how long this automation rule should stay active
                  </p>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="start-date" className="text-sm">Start Date</Label>
                    <Input
                      id="start-date"
                      type="date"
                      value={newRule.duration?.startDate || new Date().toISOString().split('T')[0]}
                      onChange={(e) => setNewRule(prev => ({
                        ...prev,
                        duration: { ...prev.duration!, startDate: e.target.value }
                      }))}
                      className="w-full glassmorphism text-gray-200"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="duration-days" className="text-sm">Duration (Days)</Label>
                    <Input
                      id="duration-days"
                      type="number"
                      min="1"
                      max="365"
                      value={newRule.duration?.durationDays || 30}
                      onChange={(e) => setNewRule(prev => ({
                        ...prev,
                        duration: { ...prev.duration!, durationDays: parseInt(e.target.value) || 30 }
                      }))}
                      placeholder="30"
                    />
                    <p className="text-xs text-muted-foreground">How many days to keep active</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Switch
                    id="auto-expire"
                    checked={newRule.duration?.autoExpire ?? true}
                    onCheckedChange={(checked) => setNewRule(prev => ({
                      ...prev,
                      duration: { ...prev.duration!, autoExpire: checked }
                    }))}
                  />
                  <Label htmlFor="auto-expire" className="text-sm">
                    Automatically deactivate when duration expires
                  </Label>
                </div>
              </div>

              {/* Active Time Controls */}
              <div className="space-y-4 p-4 bg-blue-50 dark:bg-blue-950/20 rounded-lg border border-blue-200 dark:border-blue-800">
                <div>
                  <Label className="text-sm font-medium flex items-center">
                    <Activity className="h-4 w-4 mr-2" />
                    Active Time Settings
                  </Label>
                  <p className="text-xs text-muted-foreground mt-1">
                    Set specific hours and days when AI should respond
                  </p>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Switch
                    id="enable-active-time"
                    checked={newRule.activeTime?.enabled ?? true}
                    onCheckedChange={(checked) => setNewRule(prev => ({
                      ...prev,
                      activeTime: { ...prev.activeTime!, enabled: checked }
                    }))}
                  />
                  <Label htmlFor="enable-active-time" className="text-sm">
                    Enable time-based restrictions
                  </Label>
                </div>
                
                {newRule.activeTime?.enabled && (
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="start-time" className="text-sm">Start Time</Label>
                        <Input
                          id="start-time"
                          type="time"
                          value={newRule.activeTime?.startTime || '09:00'}
                          onChange={(e) => setNewRule(prev => ({
                            ...prev,
                            activeTime: { ...prev.activeTime!, startTime: e.target.value }
                          }))}
                          className="glassmorphism text-gray-200"
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="end-time" className="text-sm">End Time</Label>
                        <Input
                          id="end-time"
                          type="time"
                          value={newRule.activeTime?.endTime || '21:00'}
                          onChange={(e) => setNewRule(prev => ({
                            ...prev,
                            activeTime: { ...prev.activeTime!, endTime: e.target.value }
                          }))}
                          className="glassmorphism text-gray-200"
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="timezone" className="text-sm">Timezone</Label>
                        <Select 
                          value={newRule.activeTime?.timezone || 'Asia/Kolkata'} 
                          onValueChange={(value) => setNewRule(prev => ({
                            ...prev,
                            activeTime: { ...prev.activeTime!, timezone: value }
                          }))}
                        >
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Select timezone" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Asia/Kolkata">🇮🇳 India (IST)</SelectItem>
                            <SelectItem value="America/New_York">🇺🇸 Eastern Time</SelectItem>
                            <SelectItem value="America/Los_Angeles">🇺🇸 Pacific Time</SelectItem>
                            <SelectItem value="Europe/London">🇬🇧 GMT/BST</SelectItem>
                            <SelectItem value="UTC">🌍 UTC</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label className="text-sm">Active Days</Label>
                      <div className="grid grid-cols-7 gap-2">
                        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day, index) => (
                          <label key={index} className={`flex items-center justify-center p-2 border-2 rounded-lg cursor-pointer text-xs transition-colors ${
                            newRule.activeTime?.activeDays?.includes(index) 
                              ? 'border-primary bg-primary/10 text-primary' 
                              : 'border-muted hover:border-primary/50'
                          }`}>
                            <input
                              type="checkbox"
                              checked={newRule.activeTime?.activeDays?.includes(index) ?? true}
                              onChange={(e) => {
                                const currentDays = newRule.activeTime?.activeDays || [1, 2, 3, 4, 5, 6, 7];
                                const newDays = e.target.checked 
                                  ? [...currentDays, index]
                                  : currentDays.filter(d => d !== index);
                                setNewRule(prev => ({
                                  ...prev,
                                  activeTime: { ...prev.activeTime!, activeDays: newDays }
                                }));
                              }}
                              className="sr-only"
                            />
                            {day}
                          </label>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>



            <div className="flex justify-end space-x-2 pt-4">
              <Button variant="outline" onClick={() => setIsCreatingRule(false)}>
                Cancel
              </Button>
              <Button
                onClick={() => {
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
                    workspaceId: currentWorkspace?.id
                  });
                }}
                disabled={createRuleMutation.isPending}
              >
                {createRuleMutation.isPending ? 'Creating...' : 'Create Rule'}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}