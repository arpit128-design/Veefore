import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';
import { useWorkspace } from '@/hooks/useWorkspace';
import { apiRequest } from '@/lib/queryClient';
import { 
  MessageCircle, 
  Users, 
  TrendingUp, 
  Clock, 
  Brain, 
  Trash2,
  Send,
  BarChart3,
  Zap
} from 'lucide-react';

interface ConversationHistory {
  id: string;
  participant: {
    id: string;
    username: string;
    platform: string;
  };
  messageCount: number;
  lastActive: string;
  sentiment: string;
  topics: string[];
  recentMessages: {
    role: string;
    content: string;
    timestamp: string;
  }[];
}

interface ConversationAnalytics {
  totalConversations: number;
  activeConversations: number;
  totalMessages: number;
  activeThisWeek: number;
  responseRate: number;
  memoryRetentionDays: number;
  averageMessagesPerConversation: number;
  sentimentDistribution: {
    positive: number;
    negative: number;
    neutral: number;
  };
  topTopics: {
    topic: string;
    count: number;
  }[];
}

export default function Conversations() {
  const { currentWorkspace } = useWorkspace();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  const [testMessage, setTestMessage] = useState('');
  const [testParticipant, setTestParticipant] = useState('test_user_123');

  // Fetch conversation history
  const { data: conversations, isLoading: conversationsLoading } = useQuery({
    queryKey: ['conversations', currentWorkspace?.id],
    queryFn: async () => {
      const response = await apiRequest('GET', `/api/conversations/${currentWorkspace?.id}`);
      return response.json();
    },
    enabled: !!currentWorkspace?.id,
    refetchInterval: 30000 // Refresh every 30 seconds
  });

  // Fetch conversation analytics
  const { data: analytics, isLoading: analyticsLoading } = useQuery({
    queryKey: ['conversations', currentWorkspace?.id, 'analytics'],
    queryFn: async () => {
      const response = await apiRequest('GET', `/api/conversations/${currentWorkspace?.id}/analytics`);
      return response.json();
    },
    enabled: !!currentWorkspace?.id,
    refetchInterval: 60000 // Refresh every minute
  });

  // Test contextual response mutation
  const testResponseMutation = useMutation({
    mutationFn: async ({ workspaceId, participantId, message }: {
      workspaceId: string;
      participantId: string;
      message: string;
    }) => {
      const response = await apiRequest('POST', '/api/conversations/test-response', {
        workspaceId,
        participantId,
        message
      });
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Test Response Generated",
        description: "Contextual AI response created successfully with conversation memory"
      });
      queryClient.invalidateQueries({ queryKey: ['conversations'] });
    },
    onError: (error: any) => {
      toast({
        title: "Test Failed",
        description: error.message || "Failed to generate test response",
        variant: "destructive"
      });
    }
  });

  // Cleanup memory mutation
  const cleanupMutation = useMutation({
    mutationFn: async () => {
      const response = await apiRequest('POST', '/api/conversations/cleanup');
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Memory Cleaned",
        description: "Expired conversation memory has been cleaned up"
      });
      queryClient.invalidateQueries({ queryKey: ['conversations'] });
    },
    onError: (error: any) => {
      toast({
        title: "Cleanup Failed",
        description: error.message || "Failed to cleanup memory",
        variant: "destructive"
      });
    }
  });

  const handleTestResponse = () => {
    if (!currentWorkspace?.id || !testMessage.trim()) return;
    
    testResponseMutation.mutate({
      workspaceId: currentWorkspace.id,
      participantId: testParticipant,
      message: testMessage.trim()
    });
  };

  const getSentimentColor = (sentiment: string) => {
    switch (sentiment.toLowerCase()) {
      case 'positive': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
      case 'negative': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300';
    }
  };

  const formatTimeAgo = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${diffInHours}h ago`;
    const diffInDays = Math.floor(diffInHours / 24);
    return `${diffInDays}d ago`;
  };

  if (!currentWorkspace) {
    return (
      <div className="flex items-center justify-center h-96">
        <p className="text-muted-foreground">Please select a workspace to view conversations</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-3 sm:gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold">Enhanced Auto DM Conversations</h1>
          <p className="text-muted-foreground text-sm sm:text-base">
            AI-powered conversation memory with 3-day contextual responses
          </p>
        </div>
        <Button
          onClick={() => cleanupMutation.mutate()}
          disabled={cleanupMutation.isPending}
          variant="outline"
          size="sm"
          className="w-full sm:w-auto"
        >
          <Trash2 className="h-3 w-3 sm:h-4 sm:w-4 mr-2" />
          <span className="hidden sm:inline">Cleanup Memory</span>
          <span className="sm:hidden">Cleanup</span>
        </Button>
      </div>

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="conversations">Conversations</TabsTrigger>
          <TabsTrigger value="test">Test Memory</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          {analyticsLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {[...Array(4)].map((_, i) => (
                <Card key={i}>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <div className="h-4 bg-gray-200 rounded w-20 animate-pulse" />
                    <div className="h-4 w-4 bg-gray-200 rounded animate-pulse" />
                  </CardHeader>
                  <CardContent>
                    <div className="h-8 bg-gray-200 rounded w-16 animate-pulse mb-2" />
                    <div className="h-3 bg-gray-200 rounded w-24 animate-pulse" />
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : analytics?.analytics ? (
            <>
              {/* Analytics Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Total Conversations</CardTitle>
                    <MessageCircle className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{analytics.analytics.totalConversations}</div>
                    <p className="text-xs text-muted-foreground">
                      {analytics.analytics.activeConversations} active
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Total Messages</CardTitle>
                    <Users className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{analytics.analytics.totalMessages}</div>
                    <p className="text-xs text-muted-foreground">
                      Avg {analytics.analytics.averageMessagesPerConversation.toFixed(1)} per conversation
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Response Rate</CardTitle>
                    <TrendingUp className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{analytics.analytics.responseRate}%</div>
                    <p className="text-xs text-muted-foreground">
                      {analytics.analytics.activeThisWeek} active this week
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Memory Retention</CardTitle>
                    <Brain className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{analytics.analytics.memoryRetentionDays} days</div>
                    <p className="text-xs text-muted-foreground">
                      Contextual AI responses
                    </p>
                  </CardContent>
                </Card>
              </div>

              {/* Sentiment & Topics */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {analytics.analytics.sentimentDistribution && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <BarChart3 className="h-5 w-5" />
                        Sentiment Distribution
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-sm">Positive</span>
                        <div className="flex items-center gap-2">
                          <div className="w-20 h-2 bg-gray-200 rounded-full overflow-hidden">
                            <div 
                              className="h-full bg-green-500" 
                              style={{ width: `${analytics.analytics.sentimentDistribution.positive}%` }}
                            />
                          </div>
                          <span className="text-sm font-medium">{analytics.analytics.sentimentDistribution.positive}%</span>
                        </div>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm">Neutral</span>
                        <div className="flex items-center gap-2">
                          <div className="w-20 h-2 bg-gray-200 rounded-full overflow-hidden">
                            <div 
                              className="h-full bg-gray-500" 
                              style={{ width: `${analytics.analytics.sentimentDistribution.neutral}%` }}
                            />
                          </div>
                          <span className="text-sm font-medium">{analytics.analytics.sentimentDistribution.neutral}%</span>
                        </div>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm">Negative</span>
                        <div className="flex items-center gap-2">
                          <div className="w-20 h-2 bg-gray-200 rounded-full overflow-hidden">
                            <div 
                              className="h-full bg-red-500" 
                              style={{ width: `${analytics.analytics.sentimentDistribution.negative}%` }}
                            />
                          </div>
                          <span className="text-sm font-medium">{analytics.analytics.sentimentDistribution.negative}%</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )}

                {analytics.analytics.topTopics && analytics.analytics.topTopics.length > 0 && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Zap className="h-5 w-5" />
                        Top Conversation Topics
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        {analytics.analytics.topTopics.slice(0, 5).map((topic: any, index: number) => (
                          <div key={index} className="flex justify-between items-center">
                            <span className="text-sm capitalize">{topic.topic}</span>
                            <Badge variant="secondary">{topic.count}</Badge>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                )}
              </div>
            </>
          ) : (
            <Card>
              <CardContent className="pt-6">
                <div className="text-center text-muted-foreground">
                  No conversation analytics available yet. Start conversations to see insights.
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* Conversations Tab */}
        <TabsContent value="conversations" className="space-y-4">
          {conversationsLoading ? (
            <div className="space-y-4">
              {[...Array(3)].map((_, i) => (
                <Card key={i}>
                  <CardContent className="pt-6">
                    <div className="space-y-3">
                      <div className="h-4 bg-gray-200 rounded w-32 animate-pulse" />
                      <div className="h-3 bg-gray-200 rounded w-48 animate-pulse" />
                      <div className="h-3 bg-gray-200 rounded w-24 animate-pulse" />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : conversations?.conversations && conversations.conversations.length > 0 ? (
            <div className="space-y-4">
              {conversations.conversations.map((conversation: ConversationHistory) => (
                <Card key={conversation.id}>
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-lg">
                          @{conversation.participant.username}
                        </CardTitle>
                        <CardDescription className="flex items-center gap-2">
                          <Badge variant="outline">{conversation.participant.platform}</Badge>
                          <Badge className={getSentimentColor(conversation.sentiment)}>
                            {conversation.sentiment}
                          </Badge>
                          <span className="flex items-center gap-1 text-xs">
                            <Clock className="h-3 w-3" />
                            {formatTimeAgo(conversation.lastActive)}
                          </span>
                        </CardDescription>
                      </div>
                      <div className="text-right text-sm text-muted-foreground">
                        {conversation.messageCount} messages
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    {conversation.topics.length > 0 && (
                      <div className="mb-4">
                        <div className="text-sm font-medium mb-2">Topics:</div>
                        <div className="flex flex-wrap gap-1">
                          {conversation.topics.map((topic, index) => (
                            <Badge key={index} variant="secondary" className="text-xs">
                              {topic}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}
                    
                    {conversation.recentMessages.length > 0 && (
                      <div>
                        <div className="text-sm font-medium mb-2">Recent Messages:</div>
                        <ScrollArea className="h-32 w-full border rounded p-3">
                          <div className="space-y-2">
                            {conversation.recentMessages.map((message, index) => (
                              <div key={index} className={`text-xs p-2 rounded ${
                                message.role === 'user' 
                                  ? 'bg-blue-50 dark:bg-blue-950 ml-4' 
                                  : 'bg-gray-50 dark:bg-gray-950 mr-4'
                              }`}>
                                <div className="font-medium capitalize mb-1">{message.role}:</div>
                                <div>{message.content}</div>
                              </div>
                            ))}
                          </div>
                        </ScrollArea>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="pt-6">
                <div className="text-center text-muted-foreground">
                  No conversations found. DM automation will create conversation memories automatically.
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* Test Memory Tab */}
        <TabsContent value="test" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Test Contextual AI Response</CardTitle>
              <CardDescription>
                Test the conversation memory system with a sample message to see contextual AI responses in action.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium mb-2 block">Test Participant ID</label>
                <Input
                  value={testParticipant}
                  onChange={(e) => setTestParticipant(e.target.value)}
                  placeholder="test_user_123"
                />
              </div>
              
              <div>
                <label className="text-sm font-medium mb-2 block">Test Message</label>
                <Textarea
                  value={testMessage}
                  onChange={(e) => setTestMessage(e.target.value)}
                  placeholder="Hi! I'm interested in your products. Can you help me?"
                  rows={3}
                />
              </div>
              
              <Button
                onClick={handleTestResponse}
                disabled={testResponseMutation.isPending || !testMessage.trim()}
                className="w-full"
              >
                <Send className="h-4 w-4 mr-2" />
                {testResponseMutation.isPending ? 'Generating Response...' : 'Test Contextual Response'}
              </Button>
              
              {testResponseMutation.data && (
                <Card className="mt-4">
                  <CardHeader>
                    <CardTitle className="text-sm">Test Result</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div>
                        <div className="text-xs font-medium text-muted-foreground mb-1">Original Message:</div>
                        <div className="text-sm bg-blue-50 dark:bg-blue-950 p-2 rounded">
                          {testResponseMutation.data.originalMessage}
                        </div>
                      </div>
                      <div>
                        <div className="text-xs font-medium text-muted-foreground mb-1">AI Response:</div>
                        <div className="text-sm bg-gray-50 dark:bg-gray-950 p-2 rounded">
                          {testResponseMutation.data.contextualResponse}
                        </div>
                      </div>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <Badge variant="outline">Memory Enabled</Badge>
                        <Badge variant="outline">{testResponseMutation.data.retentionDays} Day Retention</Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}