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
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { MessageSquare, Send, Settings, Activity, Clock, Users, AlertCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useWorkspaceContext } from '@/hooks/useWorkspace';
import { apiRequest } from '@/lib/queryClient';

interface AutomationRule {
  id: string;
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
  const { currentWorkspace } = useWorkspaceContext();
  const queryClient = useQueryClient();
  
  const [isCreatingRule, setIsCreatingRule] = useState(false);
  const [selectedTab, setSelectedTab] = useState('rules');
  const [newRule, setNewRule] = useState({
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

      {/* Create Rule Dialog */}
      <Dialog open={isCreatingRule} onOpenChange={setIsCreatingRule}>
        <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto p-6">
          <DialogHeader>
            <DialogTitle className="text-xl font-semibold">Create Automation Rule</DialogTitle>
            <DialogDescription className="text-muted-foreground">
              Set up automated responses for Instagram engagement
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-6 py-6">
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
                    
                    <div className="space-y-3">
                      <Label htmlFor="ai-personality" className="text-sm">AI Response Personality</Label>
                      <select
                        id="ai-personality"
                        value={newRule.aiPersonality || 'friendly'}
                        onChange={(e) => setNewRule(prev => ({ ...prev, aiPersonality: e.target.value }))}
                        className="w-full p-2 border border-input rounded-md bg-background"
                      >
                        <option value="friendly">Friendly & Approachable</option>
                        <option value="professional">Professional & Polite</option>
                        <option value="casual">Casual & Relaxed</option>
                        <option value="enthusiastic">Enthusiastic & Energetic</option>
                        <option value="helpful">Helpful & Supportive</option>
                      </select>
                    </div>
                    
                    <div className="space-y-3">
                      <Label htmlFor="response-length" className="text-sm">Response Length</Label>
                      <select
                        id="response-length"
                        value={newRule.responseLength || 'medium'}
                        onChange={(e) => setNewRule(prev => ({ ...prev, responseLength: e.target.value }))}
                        className="w-full p-2 border border-input rounded-md bg-background"
                      >
                        <option value="short">Short (1-2 sentences)</option>
                        <option value="medium">Medium (2-3 sentences)</option>
                        <option value="long">Long (3-4 sentences)</option>
                      </select>
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

              <div className="space-y-4">
                <div>
                  <Label className="text-sm font-medium">Safety Settings</Label>
                  <p className="text-xs text-muted-foreground mt-1">
                    Configure limits to avoid spamming and maintain authentic engagement
                  </p>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="max-per-day" className="text-sm">
                      Daily Limit
                    </Label>
                    <Input
                      id="max-per-day"
                      type="number"
                      min="1"
                      max="100"
                      value={newRule.conditions.maxPerDay}
                      onChange={(e) => setNewRule(prev => ({
                        ...prev,
                        conditions: { ...prev.conditions, maxPerDay: parseInt(e.target.value) || 0 }
                      }))}
                      placeholder="e.g., 10"
                    />
                    <p className="text-xs text-muted-foreground">
                      Max responses per day
                    </p>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="time-delay" className="text-sm">
                      Response Delay
                    </Label>
                    <Input
                      id="time-delay"
                      type="number"
                      min="0"
                      max="1440"
                      value={newRule.conditions.timeDelay}
                      onChange={(e) => setNewRule(prev => ({
                        ...prev,
                        conditions: { ...prev.conditions, timeDelay: parseInt(e.target.value) || 0 }
                      }))}
                      placeholder="e.g., 5"
                    />
                    <p className="text-xs text-muted-foreground">
                      Minutes before responding
                    </p>
                  </div>
                </div>
              </div>

            <div className="flex justify-end space-x-2 pt-4">
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
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}