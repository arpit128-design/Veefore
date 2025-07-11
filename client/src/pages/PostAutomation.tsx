import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { 
  Instagram, 
  MessageCircle, 
  Heart, 
  Send, 
  Settings,
  Eye,
  Zap,
  Clock,
  Filter,
  Search,
  Plus,
  Edit3,
  Trash2,
  Play,
  Pause,
  MoreHorizontal,
  Share,
  BookmarkIcon,
  ArrowRight,
  CheckCircle,
  AlertCircle,
  TrendingUp,
  Users,
  Target,
  Sparkles,
  Bot,
  Globe,
  Calendar,
  Hash,
  AtSign,
  ThumbsUp,
  Reply,
  Forward,
  ChevronRight,
  Monitor,
  Smartphone,
  Tablet
} from 'lucide-react';
import { useWorkspace } from '@/hooks/useWorkspace';
import { useQuery } from '@tanstack/react-query';

interface Post {
  id: string;
  platform: 'instagram' | 'facebook' | 'twitter' | 'linkedin';
  content: string;
  mediaUrl?: string;
  likes: number;
  comments: number;
  shares: number;
  createdAt: string;
  hashtags: string[];
  mentions: string[];
  automationRules?: AutomationRule[];
}

interface AutomationRule {
  id: string;
  postId: string;
  platform: string;
  type: 'comment_to_dm' | 'comment' | 'story_reply' | 'mention_reply';
  triggerType: 'keyword' | 'hashtag' | 'mention' | 'emoji' | 'all_comments' | 'all_dms';
  triggerValue?: string;
  responseType: 'text' | 'ai_generated' | 'template' | 'media';
  responseContent: string;
  isActive: boolean;
  conditions: {
    timeRestriction?: {
      startTime: string;
      endTime: string;
      timezone: string;
    };
    userFilters?: {
      minFollowers?: number;
      maxFollowers?: number;
      verifiedOnly?: boolean;
      excludeKeywords?: string[];
    };
    rateLimiting?: {
      maxPerHour: number;
      maxPerDay: number;
      cooldownMinutes: number;
    };
    commentToDmFlow?: {
      replyToCommentFirst: boolean;
      publicReplyContent?: string;
      dmFollowUpDelay?: number; // delay in minutes before sending DM
    };
  };
  aiSettings?: {
    personality: string;
    creativity: number;
    contextAware: boolean;
    includeEmojis: boolean;
    responseLength: 'short' | 'medium' | 'long';
  };
  analytics: {
    triggered: number;
    responded: number;
    successRate: number;
    avgResponseTime: number;
  };
  createdAt: string;
  updatedAt: string;
}

const PostAutomation: React.FC = () => {
  const { currentWorkspace } = useWorkspace();
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);
  const [activeTab, setActiveTab] = useState<'overview' | 'create' | 'preview' | 'analytics'>('overview');
  const [selectedPlatform, setSelectedPlatform] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [showCreateRule, setShowCreateRule] = useState(false);
  const [selectedRule, setSelectedRule] = useState<AutomationRule | null>(null);
  const [newRule, setNewRule] = useState<Partial<AutomationRule>>({
    type: 'comment_to_dm',
    triggerType: 'keyword',
    responseType: 'text',
    isActive: true,
    conditions: {
      rateLimiting: {
        maxPerHour: 10,
        maxPerDay: 50,
        cooldownMinutes: 5
      }
    },
    aiSettings: {
      personality: 'professional',
      creativity: 0.7,
      contextAware: true,
      includeEmojis: true,
      responseLength: 'medium'
    }
  });

  // Mock data for demonstration
  const mockPosts: Post[] = [
    {
      id: '1',
      platform: 'instagram',
      content: 'Check out our latest AI-powered content creation tool! 🚀 #AI #ContentCreation #VeeFore',
      mediaUrl: '/api/placeholder/400/400',
      likes: 245,
      comments: 32,
      shares: 18,
      createdAt: '2025-01-10T14:30:00Z',
      hashtags: ['#AI', '#ContentCreation', '#VeeFore'],
      mentions: ['@techinfluencer', '@contentcreator'],
      automationRules: [
        {
          id: 'rule1',
          postId: '1',
          platform: 'instagram',
          type: 'comment_to_dm',
          triggerType: 'keyword',
          triggerValue: 'price',
          responseType: 'ai_generated',
          responseContent: 'Thanks for your interest! Our pricing starts at $29/month. Would you like to schedule a demo?',
          isActive: true,
          conditions: {
            timeRestriction: {
              startTime: '09:00',
              endTime: '18:00',
              timezone: 'UTC'
            },
            userFilters: {
              minFollowers: 100,
              verifiedOnly: false,
              excludeKeywords: ['spam', 'fake']
            },
            rateLimiting: {
              maxPerHour: 5,
              maxPerDay: 25,
              cooldownMinutes: 10
            }
          },
          aiSettings: {
            personality: 'professional',
            creativity: 0.8,
            contextAware: true,
            includeEmojis: true,
            responseLength: 'medium'
          },
          analytics: {
            triggered: 127,
            responded: 119,
            successRate: 93.7,
            avgResponseTime: 0.8
          },
          createdAt: '2025-01-10T15:00:00Z',
          updatedAt: '2025-01-10T15:00:00Z'
        }
      ]
    },
    {
      id: '2',
      platform: 'instagram',
      content: 'Behind the scenes: How we built our AI thumbnail generator 🎨 #BehindTheScenes #AI #Design',
      mediaUrl: '/api/placeholder/400/400',
      likes: 189,
      comments: 24,
      shares: 12,
      createdAt: '2025-01-09T10:15:00Z',
      hashtags: ['#BehindTheScenes', '#AI', '#Design'],
      mentions: ['@designer', '@developer'],
      automationRules: []
    }
  ];

  const { data: posts = mockPosts } = useQuery({
    queryKey: ['/api/posts', currentWorkspace?.id],
    enabled: !!currentWorkspace?.id
  });

  const filteredPosts = posts.filter(post => {
    const matchesSearch = post.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         post.hashtags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesPlatform = selectedPlatform === 'all' || post.platform === selectedPlatform;
    return matchesSearch && matchesPlatform;
  });

  const createAutomationRule = () => {
    if (!selectedPost) return;
    
    const rule: AutomationRule = {
      ...newRule,
      id: Date.now().toString(),
      postId: selectedPost.id,
      platform: selectedPost.platform,
      analytics: {
        triggered: 0,
        responded: 0,
        successRate: 0,
        avgResponseTime: 0
      },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    } as AutomationRule;

    // Add rule to selected post
    selectedPost.automationRules = [...(selectedPost.automationRules || []), rule];
    setShowCreateRule(false);
    setNewRule({
      type: 'comment_to_dm',
      triggerType: 'keyword',
      responseType: 'text',
      isActive: true,
      conditions: {
        rateLimiting: {
          maxPerHour: 10,
          maxPerDay: 50,
          cooldownMinutes: 5
        }
      },
      aiSettings: {
        personality: 'professional',
        creativity: 0.7,
        contextAware: true,
        includeEmojis: true,
        responseLength: 'medium'
      }
    });
  };

  const renderPostCard = (post: Post) => (
    <Card key={post.id} className="hover:shadow-lg transition-all duration-300 cursor-pointer group">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
              post.platform === 'instagram' ? 'bg-gradient-to-br from-purple-500 to-pink-500' :
              post.platform === 'facebook' ? 'bg-blue-500' :
              post.platform === 'twitter' ? 'bg-sky-500' :
              'bg-blue-600'
            }`}>
              <Instagram className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 capitalize">{post.platform}</h3>
              <p className="text-sm text-gray-500">
                {new Date(post.createdAt).toLocaleDateString()}
              </p>
            </div>
          </div>
          <Badge variant={post.automationRules?.length ? 'default' : 'secondary'}>
            {post.automationRules?.length || 0} Rules
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <p className="text-gray-700 line-clamp-2">{post.content}</p>
          
          {post.mediaUrl && (
            <div className="aspect-video bg-gray-100 rounded-lg overflow-hidden">
              <img 
                src={post.mediaUrl} 
                alt="Post media" 
                className="w-full h-full object-cover"
              />
            </div>
          )}
          
          <div className="flex items-center justify-between text-sm text-gray-500">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-1">
                <Heart className="w-4 h-4" />
                <span>{post.likes}</span>
              </div>
              <div className="flex items-center space-x-1">
                <MessageCircle className="w-4 h-4" />
                <span>{post.comments}</span>
              </div>
              <div className="flex items-center space-x-1">
                <Share className="w-4 h-4" />
                <span>{post.shares}</span>
              </div>
            </div>
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => setSelectedPost(post)}
              className="opacity-0 group-hover:opacity-100 transition-opacity"
            >
              Manage Rules
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  const renderAutomationRuleCard = (rule: AutomationRule) => (
    <Card key={rule.id} className="border-l-4 border-l-blue-500">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
              rule.type === 'comment_to_dm' ? 'bg-blue-100 text-blue-600' :
              rule.type === 'comment' ? 'bg-green-100 text-green-600' :
              rule.type === 'story_reply' ? 'bg-purple-100 text-purple-600' :
              'bg-orange-100 text-orange-600'
            }`}>
              {rule.type === 'comment_to_dm' ? <MessageCircle className="w-4 h-4" /> :
               rule.type === 'comment' ? <Reply className="w-4 h-4" /> :
               rule.type === 'story_reply' ? <Eye className="w-4 h-4" /> :
               <AtSign className="w-4 h-4" />}
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 capitalize">
                {rule.type === 'comment_to_dm' ? 'Comment to DM' : rule.type.replace('_', ' ')} Automation
              </h4>
              <p className="text-sm text-gray-500">
                {rule.type === 'comment_to_dm' ? 'Send DM when user comments' : `Trigger: ${rule.triggerType}`} 
                {rule.triggerValue && ` "${rule.triggerValue}"`}
              </p>
              {rule.type === 'comment_to_dm' && rule.conditions?.commentToDmFlow?.replyToCommentFirst && (
                <p className="text-xs text-blue-600 mt-1">
                  ✓ Reply to comment first, then send DM
                </p>
              )}
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Switch checked={rule.isActive} />
            <Button variant="ghost" size="sm">
              <MoreHorizontal className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="grid grid-cols-4 gap-4 text-sm">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">{rule.analytics.triggered}</div>
              <div className="text-gray-500">Triggered</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">{rule.analytics.responded}</div>
              <div className="text-gray-500">Responded</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">{rule.analytics.successRate}%</div>
              <div className="text-gray-500">Success Rate</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-600">{rule.analytics.avgResponseTime}s</div>
              <div className="text-gray-500">Avg Response</div>
            </div>
          </div>
          
          <div className="p-3 bg-gray-50 rounded-lg">
            <p className="text-sm text-gray-700 font-medium">Response Preview:</p>
            <p className="text-sm text-gray-600 mt-1">{rule.responseContent}</p>
          </div>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Badge variant="outline" className="text-xs">
                {rule.conditions.rateLimiting?.maxPerHour}/hour
              </Badge>
              <Badge variant="outline" className="text-xs">
                {rule.aiSettings?.personality}
              </Badge>
            </div>
            <div className="flex items-center space-x-2">
              <Button variant="outline" size="sm">
                <Edit3 className="w-4 h-4 mr-1" />
                Edit
              </Button>
              <Button variant="outline" size="sm">
                <Eye className="w-4 h-4 mr-1" />
                Preview
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  const renderCreateRuleForm = () => (
    <Card className="border-2 border-dashed border-blue-300 bg-blue-50/50">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Plus className="w-5 h-5 text-blue-600" />
          <span>Create New Automation Rule</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="rule-type">Automation Type</Label>
              <Select value={newRule.type} onValueChange={(value) => setNewRule({...newRule, type: value as any})}>
                <SelectTrigger>
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="comment_to_dm">Comment to DM</SelectItem>
                  <SelectItem value="comment">Comment Reply</SelectItem>
                  <SelectItem value="story_reply">Story Reply</SelectItem>
                  <SelectItem value="mention_reply">Mention Reply</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            {newRule.type === 'comment_to_dm' && (
              <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                <div className="flex items-start space-x-3">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                    <MessageCircle className="w-4 h-4 text-blue-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-blue-900">Comment to DM Automation</h4>
                    <p className="text-sm text-blue-700 mt-1">
                      When users comment on your post, the system will automatically send them a direct message with your response. 
                      You can optionally reply to their comment first publicly, then send a follow-up DM.
                      This is perfect for lead generation, customer support, or providing additional information privately.
                    </p>
                  </div>
                </div>
              </div>
            )}
            
            <div>
              <Label htmlFor="trigger-type">Trigger Type</Label>
              <Select value={newRule.triggerType} onValueChange={(value) => setNewRule({...newRule, triggerType: value as any})}>
                <SelectTrigger>
                  <SelectValue placeholder="Select trigger" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="keyword">Keyword</SelectItem>
                  <SelectItem value="hashtag">Hashtag</SelectItem>
                  <SelectItem value="mention">Mention</SelectItem>
                  <SelectItem value="emoji">Emoji</SelectItem>
                  <SelectItem value="all_comments">All Comments</SelectItem>
                  <SelectItem value="all_dms">All DMs</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {newRule.triggerType !== 'all_comments' && newRule.triggerType !== 'all_dms' && (
            <div>
              <Label htmlFor="trigger-value">Trigger Value</Label>
              <Input 
                id="trigger-value"
                placeholder="Enter keyword, hashtag, or emoji"
                value={newRule.triggerValue || ''}
                onChange={(e) => setNewRule({...newRule, triggerValue: e.target.value})}
              />
            </div>
          )}

          <div>
            <Label htmlFor="response-type">Response Type</Label>
            <Select value={newRule.responseType} onValueChange={(value) => setNewRule({...newRule, responseType: value as any})}>
              <SelectTrigger>
                <SelectValue placeholder="Select response type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="text">Text Message</SelectItem>
                <SelectItem value="ai_generated">AI Generated</SelectItem>
                <SelectItem value="template">Template</SelectItem>
                <SelectItem value="media">Media Response</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="response-content">Response Content</Label>
            <Textarea 
              id="response-content"
              placeholder="Enter your response message..."
              value={newRule.responseContent || ''}
              onChange={(e) => setNewRule({...newRule, responseContent: e.target.value})}
              rows={3}
            />
          </div>

          <Tabs defaultValue="basic" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="basic">Basic</TabsTrigger>
              <TabsTrigger value="advanced">Advanced</TabsTrigger>
              <TabsTrigger value="ai">AI Settings</TabsTrigger>
            </TabsList>
            
            <TabsContent value="basic" className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="max-per-hour">Max Per Hour</Label>
                  <Input 
                    id="max-per-hour"
                    type="number"
                    value={newRule.conditions?.rateLimiting?.maxPerHour || 10}
                    onChange={(e) => setNewRule({
                      ...newRule,
                      conditions: {
                        ...newRule.conditions,
                        rateLimiting: {
                          ...newRule.conditions?.rateLimiting,
                          maxPerHour: parseInt(e.target.value)
                        }
                      }
                    })}
                  />
                </div>
                <div>
                  <Label htmlFor="max-per-day">Max Per Day</Label>
                  <Input 
                    id="max-per-day"
                    type="number"
                    value={newRule.conditions?.rateLimiting?.maxPerDay || 50}
                    onChange={(e) => setNewRule({
                      ...newRule,
                      conditions: {
                        ...newRule.conditions,
                        rateLimiting: {
                          ...newRule.conditions?.rateLimiting,
                          maxPerDay: parseInt(e.target.value)
                        }
                      }
                    })}
                  />
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="advanced" className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="start-time">Start Time</Label>
                  <Input 
                    id="start-time"
                    type="time"
                    value={newRule.conditions?.timeRestriction?.startTime || '09:00'}
                    onChange={(e) => setNewRule({
                      ...newRule,
                      conditions: {
                        ...newRule.conditions,
                        timeRestriction: {
                          ...newRule.conditions?.timeRestriction,
                          startTime: e.target.value,
                          timezone: 'UTC'
                        }
                      }
                    })}
                  />
                </div>
                <div>
                  <Label htmlFor="end-time">End Time</Label>
                  <Input 
                    id="end-time"
                    type="time"
                    value={newRule.conditions?.timeRestriction?.endTime || '18:00'}
                    onChange={(e) => setNewRule({
                      ...newRule,
                      conditions: {
                        ...newRule.conditions,
                        timeRestriction: {
                          ...newRule.conditions?.timeRestriction,
                          endTime: e.target.value,
                          timezone: 'UTC'
                        }
                      }
                    })}
                  />
                </div>
              </div>
              
              {newRule.type === 'comment_to_dm' && (
                <div className="space-y-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
                  <div className="flex items-center space-x-2">
                    <MessageCircle className="w-5 h-5 text-blue-600" />
                    <h4 className="font-semibold text-blue-900">Comment to DM Flow</h4>
                  </div>
                  
                  <div className="space-y-3">
                    <div className="flex items-center space-x-2">
                      <Switch
                        id="reply-first"
                        checked={newRule.conditions?.commentToDmFlow?.replyToCommentFirst || false}
                        onCheckedChange={(checked) => setNewRule({
                          ...newRule,
                          conditions: {
                            ...newRule.conditions,
                            commentToDmFlow: {
                              ...newRule.conditions?.commentToDmFlow,
                              replyToCommentFirst: checked
                            }
                          }
                        })}
                      />
                      <Label htmlFor="reply-first" className="text-sm font-medium text-blue-900">
                        Reply to comment first, then send DM
                      </Label>
                    </div>
                    
                    {newRule.conditions?.commentToDmFlow?.replyToCommentFirst && (
                      <>
                        <div>
                          <Label htmlFor="public-reply">Public Comment Reply</Label>
                          <Textarea
                            id="public-reply"
                            placeholder="Enter your public comment reply..."
                            value={newRule.conditions?.commentToDmFlow?.publicReplyContent || ''}
                            onChange={(e) => setNewRule({
                              ...newRule,
                              conditions: {
                                ...newRule.conditions,
                                commentToDmFlow: {
                                  ...newRule.conditions?.commentToDmFlow,
                                  publicReplyContent: e.target.value
                                }
                              }
                            })}
                            rows={2}
                            className="text-sm"
                          />
                          <p className="text-xs text-blue-600 mt-1">
                            This will be posted as a public comment reply before sending the DM
                          </p>
                        </div>
                        
                        <div>
                          <Label htmlFor="dm-delay">DM Delay (minutes)</Label>
                          <Input
                            id="dm-delay"
                            type="number"
                            min="0"
                            max="60"
                            value={newRule.conditions?.commentToDmFlow?.dmFollowUpDelay || 2}
                            onChange={(e) => setNewRule({
                              ...newRule,
                              conditions: {
                                ...newRule.conditions,
                                commentToDmFlow: {
                                  ...newRule.conditions?.commentToDmFlow,
                                  dmFollowUpDelay: parseInt(e.target.value)
                                }
                              }
                            })}
                            className="text-sm"
                          />
                          <p className="text-xs text-blue-600 mt-1">
                            Wait time before sending DM after comment reply
                          </p>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              )}
            </TabsContent>
            
            <TabsContent value="ai" className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="personality">AI Personality</Label>
                  <Select value={newRule.aiSettings?.personality} onValueChange={(value) => setNewRule({
                    ...newRule,
                    aiSettings: {
                      ...newRule.aiSettings,
                      personality: value
                    }
                  })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select personality" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="professional">Professional</SelectItem>
                      <SelectItem value="friendly">Friendly</SelectItem>
                      <SelectItem value="casual">Casual</SelectItem>
                      <SelectItem value="enthusiastic">Enthusiastic</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="response-length">Response Length</Label>
                  <Select value={newRule.aiSettings?.responseLength} onValueChange={(value) => setNewRule({
                    ...newRule,
                    aiSettings: {
                      ...newRule.aiSettings,
                      responseLength: value as any
                    }
                  })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select length" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="short">Short</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="long">Long</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </TabsContent>
          </Tabs>

          <div className="flex items-center justify-end space-x-2 pt-4 border-t">
            <Button variant="outline" onClick={() => setShowCreateRule(false)}>
              Cancel
            </Button>
            <Button onClick={createAutomationRule} className="bg-blue-600 hover:bg-blue-700">
              Create Rule
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  const renderPostPreview = () => (
    <Card className="w-full max-w-sm mx-auto bg-white border-2 border-gray-200">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
              <span className="text-white text-sm font-bold">R</span>
            </div>
            <div>
              <p className="font-semibold text-sm">rahulc1020</p>
              <p className="text-xs text-gray-500">2 hours ago</p>
            </div>
          </div>
          <MoreHorizontal className="w-5 h-5 text-gray-400" />
        </div>
      </CardHeader>
      <CardContent className="px-0">
        <div className="aspect-square bg-gray-100 mb-3">
          <img 
            src="/api/placeholder/400/400" 
            alt="Post preview" 
            className="w-full h-full object-cover"
          />
        </div>
        <div className="px-4 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Heart className="w-6 h-6 text-gray-600" />
              <MessageCircle className="w-6 h-6 text-gray-600" />
              <Send className="w-6 h-6 text-gray-600" />
            </div>
            <BookmarkIcon className="w-6 h-6 text-gray-600" />
          </div>
          <div>
            <p className="font-semibold text-sm">245 likes</p>
            <p className="text-sm">
              <span className="font-semibold">rahulc1020</span> Check out our latest AI-powered content creation tool! 🚀
            </p>
            <div className="flex flex-wrap gap-1 mt-1">
              <span className="text-blue-600 text-sm">#AI</span>
              <span className="text-blue-600 text-sm">#ContentCreation</span>
              <span className="text-blue-600 text-sm">#VeeFore</span>
            </div>
          </div>
          <div className="space-y-2">
            <p className="text-sm text-gray-500">View all 32 comments</p>
            <div className="flex items-center space-x-2">
              <div className="w-6 h-6 rounded-full bg-blue-500 flex items-center justify-center">
                <span className="text-white text-xs font-bold">U</span>
              </div>
              <div className="flex-1 bg-gray-100 rounded-full px-3 py-1">
                <p className="text-sm text-gray-600">Your keyword</p>
              </div>
              <Button size="sm" variant="ghost" className="text-blue-600">
                Reply
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Post Automation</h1>
            <p className="text-gray-600">Create intelligent automation rules for each post</p>
          </div>
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <Search className="w-5 h-5 text-gray-400" />
              <Input 
                placeholder="Search posts..." 
                className="w-64"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Select value={selectedPlatform} onValueChange={setSelectedPlatform}>
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Platforms</SelectItem>
                <SelectItem value="instagram">Instagram</SelectItem>
                <SelectItem value="facebook">Facebook</SelectItem>
                <SelectItem value="twitter">Twitter</SelectItem>
                <SelectItem value="linkedin">LinkedIn</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      <div className="flex">
        {/* Main Content */}
        <div className="flex-1 p-6">
          {!selectedPost ? (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold text-gray-900">Your Posts</h2>
                <div className="flex items-center space-x-2">
                  <Badge variant="outline">
                    {filteredPosts.length} Posts
                  </Badge>
                  <Badge variant="outline">
                    {filteredPosts.reduce((acc, post) => acc + (post.automationRules?.length || 0), 0)} Rules
                  </Badge>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredPosts.map(renderPostCard)}
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <Button 
                    variant="outline" 
                    onClick={() => setSelectedPost(null)}
                    className="flex items-center space-x-2"
                  >
                    <ArrowRight className="w-4 h-4 rotate-180" />
                    <span>Back to Posts</span>
                  </Button>
                  <div>
                    <h2 className="text-xl font-semibold text-gray-900">
                      {selectedPost.platform.charAt(0).toUpperCase() + selectedPost.platform.slice(1)} Post
                    </h2>
                    <p className="text-gray-600 text-sm">
                      {new Date(selectedPost.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <Button 
                  onClick={() => setShowCreateRule(true)}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Create Rule
                </Button>
              </div>

              <div className="bg-white rounded-lg p-4 border">
                <p className="text-gray-800">{selectedPost.content}</p>
                <div className="flex items-center space-x-4 mt-3 text-sm text-gray-500">
                  <div className="flex items-center space-x-1">
                    <Heart className="w-4 h-4" />
                    <span>{selectedPost.likes}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <MessageCircle className="w-4 h-4" />
                    <span>{selectedPost.comments}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Share className="w-4 h-4" />
                    <span>{selectedPost.shares}</span>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900">Automation Rules</h3>
                
                {showCreateRule && renderCreateRuleForm()}
                
                {selectedPost.automationRules?.map(renderAutomationRuleCard)}
                
                {!selectedPost.automationRules?.length && !showCreateRule && (
                  <Card className="border-2 border-dashed border-gray-300">
                    <CardContent className="py-12 text-center">
                      <Bot className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">No automation rules yet</h3>
                      <p className="text-gray-600 mb-4">
                        Create your first automation rule to start engaging with your audience automatically.
                      </p>
                      <Button 
                        onClick={() => setShowCreateRule(true)}
                        className="bg-blue-600 hover:bg-blue-700"
                      >
                        <Plus className="w-4 h-4 mr-2" />
                        Create First Rule
                      </Button>
                    </CardContent>
                  </Card>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Post Preview Sidebar */}
        {selectedPost && (
          <div className="w-96 bg-white border-l border-gray-200 p-6">
            <div className="sticky top-6 space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Post Preview</h3>
                {renderPostPreview()}
              </div>
              
              <div>
                <h4 className="font-semibold text-gray-900 mb-2">Quick Stats</h4>
                <div className="grid grid-cols-2 gap-3">
                  <div className="text-center p-3 bg-gray-50 rounded-lg">
                    <div className="text-2xl font-bold text-blue-600">{selectedPost.automationRules?.length || 0}</div>
                    <div className="text-sm text-gray-500">Active Rules</div>
                  </div>
                  <div className="text-center p-3 bg-gray-50 rounded-lg">
                    <div className="text-2xl font-bold text-green-600">{selectedPost.comments}</div>
                    <div className="text-sm text-gray-500">Comments</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PostAutomation;