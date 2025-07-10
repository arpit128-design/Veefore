import { useState, useEffect, useRef } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { useWorkspace } from '@/hooks/useWorkspace';
import { apiRequest } from '@/lib/queryClient';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  MessageCircle, 
  Users, 
  TrendingUp, 
  Clock, 
  Brain, 
  Trash2,
  Send,
  BarChart3,
  Zap,
  Search,
  Filter,
  MoreVertical,
  Star,
  Archive,
  Pin,
  Reply,
  Forward,
  Download,
  Volume2,
  VolumeX,
  Settings,
  Eye,
  Heart,
  Share2,
  Bookmark,
  CheckCircle2,
  AlertCircle,
  Smile,
  Paperclip,
  Image,
  Video,
  Mic,
  Phone,
  VideoIcon,
  Instagram,
  Facebook,
  Twitter,
  Youtube,
  Linkedin,
  MessageSquare,
  AtSign,
  Hash,
  ChevronDown,
  RefreshCw,
  Calendar,
  Globe,
  Shield,
  Sparkles
} from 'lucide-react';

interface Message {
  id: string;
  content: string;
  timestamp: string;
  platform: 'instagram' | 'facebook' | 'twitter' | 'youtube' | 'linkedin';
  type: 'dm' | 'comment' | 'mention' | 'reply';
  author: {
    id: string;
    username: string;
    displayName: string;
    avatar?: string;
    verified: boolean;
    followers: number;
  };
  isFromUser: boolean;
  status: 'sent' | 'delivered' | 'read' | 'failed';
  sentiment: 'positive' | 'negative' | 'neutral';
  isAiGenerated?: boolean;
  attachments?: {
    type: 'image' | 'video' | 'audio' | 'document';
    url: string;
    name: string;
  }[];
  parentMessage?: string;
  engagement?: {
    likes: number;
    replies: number;
    shares: number;
  };
}

interface Conversation {
  id: string;
  participant: {
    id: string;
    username: string;
    displayName: string;
    avatar?: string;
    platform: 'instagram' | 'facebook' | 'twitter' | 'youtube' | 'linkedin';
    verified: boolean;
    followers: number;
    lastSeen?: string;
  };
  lastMessage: Message;
  unreadCount: number;
  isPinned: boolean;
  isArchived: boolean;
  tags: string[];
  sentiment: 'positive' | 'negative' | 'neutral';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  assignedTo?: string;
  totalMessages: number;
  createdAt: string;
  updatedAt: string;
}

interface ConversationAnalytics {
  totalConversations: number;
  activeConversations: number;
  totalMessages: number;
  unreadMessages: number;
  responseRate: number;
  averageResponseTime: string;
  sentimentDistribution: {
    positive: number;
    negative: number;
    neutral: number;
  };
  platformBreakdown: {
    instagram: number;
    facebook: number;
    twitter: number;
    youtube: number;
    linkedin: number;
  };
  messageTypes: {
    dms: number;
    comments: number;
    mentions: number;
    replies: number;
  };
  topTopics: {
    topic: string;
    count: number;
    sentiment: string;
  }[];
  peakHours: {
    hour: number;
    count: number;
  }[];
}

// Mock data for comprehensive platform and message type demonstration
const mockConversations: Conversation[] = [
  {
    id: 'conv-1',
    participant: {
      id: 'user-1',
      username: 'sarah_creative',
      displayName: 'Sarah Johnson',
      avatar: 'https://i.pravatar.cc/150?img=1',
      platform: 'instagram',
      verified: true,
      followers: 12500,
      lastSeen: '2025-07-10T16:45:00Z'
    },
    lastMessage: {
      id: 'msg-1',
      content: 'Love your latest post! The colors are amazing 🎨',
      timestamp: '2025-07-10T16:45:00Z',
      platform: 'instagram',
      type: 'dm',
      author: {
        id: 'user-1',
        username: 'sarah_creative',
        displayName: 'Sarah Johnson',
        verified: true,
        followers: 12500
      },
      isFromUser: false,
      status: 'delivered',
      sentiment: 'positive',
      isAiGenerated: false,
      engagement: { likes: 0, replies: 0, shares: 0 }
    },
    unreadCount: 2,
    isPinned: true,
    isArchived: false,
    tags: ['design', 'collaboration'],
    sentiment: 'positive',
    priority: 'high',
    totalMessages: 8,
    createdAt: '2025-07-09T10:30:00Z',
    updatedAt: '2025-07-10T16:45:00Z'
  },
  {
    id: 'conv-2',
    participant: {
      id: 'user-2',
      username: 'tech_guru_mike',
      displayName: 'Mike Chen',
      avatar: 'https://i.pravatar.cc/150?img=2',
      platform: 'youtube',
      verified: false,
      followers: 5420,
      lastSeen: '2025-07-10T16:30:00Z'
    },
    lastMessage: {
      id: 'msg-2',
      content: 'Great tutorial! Could you make one about React hooks next?',
      timestamp: '2025-07-10T16:30:00Z',
      platform: 'youtube',
      type: 'comment',
      author: {
        id: 'user-2',
        username: 'tech_guru_mike',
        displayName: 'Mike Chen',
        verified: false,
        followers: 5420
      },
      isFromUser: false,
      status: 'read',
      sentiment: 'positive',
      isAiGenerated: false,
      engagement: { likes: 15, replies: 3, shares: 2 }
    },
    unreadCount: 0,
    isPinned: false,
    isArchived: false,
    tags: ['tutorial', 'react'],
    sentiment: 'positive',
    priority: 'medium',
    totalMessages: 4,
    createdAt: '2025-07-10T14:00:00Z',
    updatedAt: '2025-07-10T16:30:00Z'
  },
  {
    id: 'conv-3',
    participant: {
      id: 'user-3',
      username: 'business_pro',
      displayName: 'Emma Rodriguez',
      avatar: 'https://i.pravatar.cc/150?img=3',
      platform: 'linkedin',
      verified: true,
      followers: 8900,
      lastSeen: '2025-07-10T16:15:00Z'
    },
    lastMessage: {
      id: 'msg-3',
      content: 'Would love to discuss a potential partnership opportunity',
      timestamp: '2025-07-10T16:15:00Z',
      platform: 'linkedin',
      type: 'dm',
      author: {
        id: 'user-3',
        username: 'business_pro',
        displayName: 'Emma Rodriguez',
        verified: true,
        followers: 8900
      },
      isFromUser: false,
      status: 'delivered',
      sentiment: 'neutral',
      isAiGenerated: false,
      engagement: { likes: 0, replies: 0, shares: 0 }
    },
    unreadCount: 1,
    isPinned: false,
    isArchived: false,
    tags: ['business', 'partnership'],
    sentiment: 'neutral',
    priority: 'high',
    totalMessages: 2,
    createdAt: '2025-07-10T16:00:00Z',
    updatedAt: '2025-07-10T16:15:00Z'
  },
  {
    id: 'conv-4',
    participant: {
      id: 'user-4',
      username: 'foodie_alex',
      displayName: 'Alex Thompson',
      avatar: 'https://i.pravatar.cc/150?img=4',
      platform: 'twitter',
      verified: false,
      followers: 3200,
      lastSeen: '2025-07-10T15:45:00Z'
    },
    lastMessage: {
      id: 'msg-4',
      content: '@veefore This recipe didn\'t work for me. Instructions unclear 😕',
      timestamp: '2025-07-10T15:45:00Z',
      platform: 'twitter',
      type: 'mention',
      author: {
        id: 'user-4',
        username: 'foodie_alex',
        displayName: 'Alex Thompson',
        verified: false,
        followers: 3200
      },
      isFromUser: false,
      status: 'read',
      sentiment: 'negative',
      isAiGenerated: false,
      engagement: { likes: 2, replies: 1, shares: 0 }
    },
    unreadCount: 1,
    isPinned: false,
    isArchived: false,
    tags: ['feedback', 'recipe'],
    sentiment: 'negative',
    priority: 'medium',
    totalMessages: 3,
    createdAt: '2025-07-10T15:30:00Z',
    updatedAt: '2025-07-10T15:45:00Z'
  },
  {
    id: 'conv-5',
    participant: {
      id: 'user-5',
      username: 'marketing_maven',
      displayName: 'Lisa Kim',
      avatar: 'https://i.pravatar.cc/150?img=5',
      platform: 'facebook',
      verified: true,
      followers: 15600,
      lastSeen: '2025-07-10T15:30:00Z'
    },
    lastMessage: {
      id: 'msg-5',
      content: 'Thanks for the quick response! Your customer service is excellent 👍',
      timestamp: '2025-07-10T15:30:00Z',
      platform: 'facebook',
      type: 'reply',
      author: {
        id: 'user-5',
        username: 'marketing_maven',
        displayName: 'Lisa Kim',
        verified: true,
        followers: 15600
      },
      isFromUser: false,
      status: 'read',
      sentiment: 'positive',
      isAiGenerated: false,
      engagement: { likes: 8, replies: 2, shares: 1 }
    },
    unreadCount: 0,
    isPinned: false,
    isArchived: false,
    tags: ['customer-service', 'positive'],
    sentiment: 'positive',
    priority: 'low',
    totalMessages: 6,
    createdAt: '2025-07-10T12:00:00Z',
    updatedAt: '2025-07-10T15:30:00Z'
  },
  {
    id: 'conv-6',
    participant: {
      id: 'user-6',
      username: 'content_creator_pro',
      displayName: 'David Wilson',
      avatar: 'https://i.pravatar.cc/150?img=6',
      platform: 'instagram',
      verified: false,
      followers: 7800,
      lastSeen: '2025-07-10T15:00:00Z'
    },
    lastMessage: {
      id: 'msg-6',
      content: 'Could you share the preset you used for this edit?',
      timestamp: '2025-07-10T15:00:00Z',
      platform: 'instagram',
      type: 'comment',
      author: {
        id: 'user-6',
        username: 'content_creator_pro',
        displayName: 'David Wilson',
        verified: false,
        followers: 7800
      },
      isFromUser: false,
      status: 'delivered',
      sentiment: 'neutral',
      isAiGenerated: false,
      engagement: { likes: 5, replies: 0, shares: 0 }
    },
    unreadCount: 1,
    isPinned: false,
    isArchived: false,
    tags: ['editing', 'preset'],
    sentiment: 'neutral',
    priority: 'low',
    totalMessages: 1,
    createdAt: '2025-07-10T15:00:00Z',
    updatedAt: '2025-07-10T15:00:00Z'
  }
];

const mockAnalytics: ConversationAnalytics = {
  totalConversations: 6,
  activeConversations: 4,
  totalMessages: 24,
  unreadMessages: 5,
  responseRate: 92.5,
  averageResponseTime: '2h 15m',
  sentimentDistribution: {
    positive: 50,
    negative: 17,
    neutral: 33
  },
  platformBreakdown: {
    instagram: 33,
    facebook: 17,
    twitter: 17,
    youtube: 17,
    linkedin: 16
  },
  messageTypes: {
    dms: 42,
    comments: 25,
    mentions: 17,
    replies: 16
  },
  topTopics: [
    { topic: 'Design', count: 8, sentiment: 'positive' },
    { topic: 'Tutorial', count: 6, sentiment: 'positive' },
    { topic: 'Business', count: 4, sentiment: 'neutral' },
    { topic: 'Support', count: 3, sentiment: 'positive' },
    { topic: 'Feedback', count: 3, sentiment: 'negative' }
  ],
  peakHours: [
    { hour: 9, count: 5 },
    { hour: 14, count: 8 },
    { hour: 16, count: 11 },
    { hour: 20, count: 7 }
  ]
};

export default function Messages() {
  const { currentWorkspace } = useWorkspace();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null);
  const [newMessage, setNewMessage] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterPlatform, setFilterPlatform] = useState<string>('all');
  const [filterType, setFilterType] = useState<string>('all');
  const [filterSentiment, setFilterSentiment] = useState<string>('all');
  const [showOnlyUnread, setShowOnlyUnread] = useState(false);
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [notifications, setNotifications] = useState(true);
  const [aiAssistant, setAiAssistant] = useState(true);
  const [selectedTab, setSelectedTab] = useState('conversations');

  // Use mock data for comprehensive demonstration
  const conversations = mockConversations;
  const conversationsLoading = false;
  const analytics = mockAnalytics;
  const analyticsLoading = false;
  const messages: Message[] = [];
  const messagesLoading = false;

  // Send message mutation
  const sendMessageMutation = useMutation({
    mutationFn: async ({ conversationId, content, type }: {
      conversationId: string;
      content: string;
      type: 'reply' | 'ai_generated';
    }) => {
      const response = await apiRequest('POST', `/api/conversations/${conversationId}/messages`, {
        content,
        type,
        aiAssisted: type === 'ai_generated'
      });
      return response.json();
    },
    onSuccess: () => {
      setNewMessage('');
      queryClient.invalidateQueries({ queryKey: ['messages'] });
      scrollToBottom();
    },
    onError: (error: any) => {
      toast({
        title: "Message Failed",
        description: error.message || "Failed to send message",
        variant: "destructive"
      });
    }
  });

  // Generate AI response mutation
  const generateAiResponseMutation = useMutation({
    mutationFn: async ({ conversationId }: { conversationId: string }) => {
      const response = await apiRequest('POST', `/api/conversations/${conversationId}/ai-response`);
      return response.json();
    },
    onSuccess: (data) => {
      setNewMessage(data.suggestedResponse);
      toast({
        title: "AI Response Generated",
        description: "AI has suggested a contextual response based on conversation history"
      });
    },
    onError: (error: any) => {
      toast({
        title: "AI Generation Failed",
        description: error.message || "Failed to generate AI response",
        variant: "destructive"
      });
    }
  });

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const getPlatformIcon = (platform: string) => {
    switch (platform) {
      case 'instagram': return <Instagram className="h-4 w-4" />;
      case 'facebook': return <Facebook className="h-4 w-4" />;
      case 'twitter': return <Twitter className="h-4 w-4" />;
      case 'youtube': return <Youtube className="h-4 w-4" />;
      case 'linkedin': return <Linkedin className="h-4 w-4" />;
      default: return <MessageCircle className="h-4 w-4" />;
    }
  };

  const getPlatformColor = (platform: string) => {
    switch (platform) {
      case 'instagram': return 'bg-gradient-to-r from-purple-500 to-pink-500';
      case 'facebook': return 'bg-blue-600';
      case 'twitter': return 'bg-sky-500';
      case 'youtube': return 'bg-red-600';
      case 'linkedin': return 'bg-blue-700';
      default: return 'bg-gray-600';
    }
  };

  const getSentimentColor = (sentiment: string) => {
    switch (sentiment) {
      case 'positive': return 'text-green-600 bg-green-100';
      case 'negative': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getMessageTypeIcon = (type: string) => {
    switch (type) {
      case 'dm': return <MessageSquare className="h-3 w-3" />;
      case 'comment': return <MessageCircle className="h-3 w-3" />;
      case 'mention': return <AtSign className="h-3 w-3" />;
      case 'reply': return <Reply className="h-3 w-3" />;
      default: return <MessageCircle className="h-3 w-3" />;
    }
  };

  const filteredConversations = (Array.isArray(conversations) ? conversations : [])?.filter(conv => {
    let matches = true;
    
    if (searchQuery) {
      matches = matches && (
        conv.participant.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
        conv.participant.displayName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        conv.lastMessage.content.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    
    if (filterPlatform !== 'all') {
      matches = matches && conv.participant.platform === filterPlatform;
    }
    
    if (filterType !== 'all') {
      matches = matches && conv.lastMessage.type === filterType;
    }
    
    if (filterSentiment !== 'all') {
      matches = matches && conv.sentiment === filterSentiment;
    }
    
    if (showOnlyUnread) {
      matches = matches && conv.unreadCount > 0;
    }
    
    return matches;
  });

  const renderConversationsList = () => (
    <div className="h-full flex flex-col bg-white border-r border-gray-200">
      {/* Header */}
      <div className="p-4 border-b border-gray-200 bg-white">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-gray-900">Messages</h2>
          <div className="flex items-center space-x-2">
            <Button size="sm" variant="outline" onClick={() => setAutoRefresh(!autoRefresh)}>
              <RefreshCw className={`h-4 w-4 ${autoRefresh ? 'animate-spin' : ''}`} />
            </Button>
            <Button size="sm" variant="outline">
              <Settings className="h-4 w-4" />
            </Button>
          </div>
        </div>
        
        {/* Search Bar */}
        <div className="relative mb-3">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search conversations..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        
        {/* Filters */}
        <div className="flex items-center space-x-2 mb-3">
          <Select value={filterPlatform} onValueChange={setFilterPlatform}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Platforms</SelectItem>
              <SelectItem value="instagram">Instagram</SelectItem>
              <SelectItem value="facebook">Facebook</SelectItem>
              <SelectItem value="twitter">Twitter</SelectItem>
              <SelectItem value="youtube">YouTube</SelectItem>
              <SelectItem value="linkedin">LinkedIn</SelectItem>
            </SelectContent>
          </Select>
          
          <Select value={filterType} onValueChange={setFilterType}>
            <SelectTrigger className="w-28">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="dm">DMs</SelectItem>
              <SelectItem value="comment">Comments</SelectItem>
              <SelectItem value="mention">Mentions</SelectItem>
              <SelectItem value="reply">Replies</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        {/* Quick Filters */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Switch checked={showOnlyUnread} onCheckedChange={setShowOnlyUnread} />
            <Label className="text-sm text-gray-700">Unread only</Label>
          </div>
          <Badge variant="secondary" className="text-xs">
            {filteredConversations?.length || 0} conversations
          </Badge>
        </div>
      </div>
      
      {/* Conversations List */}
      <ScrollArea className="flex-1">
        <div className="p-2">
          <AnimatePresence>
            {filteredConversations?.map((conversation, index) => (
              <motion.div
                key={conversation.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.2, delay: index * 0.05 }}
                onClick={() => setSelectedConversation(conversation)}
                className={`p-3 rounded-lg mb-2 cursor-pointer transition-all hover:bg-gray-50 ${
                  selectedConversation?.id === conversation.id ? 'bg-blue-50 border border-blue-200' : 'border border-transparent'
                }`}
              >
                <div className="flex items-start space-x-3">
                  <div className="relative">
                    <Avatar className="h-12 w-12">
                      <AvatarImage src={conversation.participant.avatar} />
                      <AvatarFallback>{conversation.participant.username.slice(0, 2).toUpperCase()}</AvatarFallback>
                    </Avatar>
                    <div className={`absolute -bottom-1 -right-1 p-1 rounded-full ${getPlatformColor(conversation.participant.platform)}`}>
                      {getPlatformIcon(conversation.participant.platform)}
                    </div>
                    {conversation.unreadCount > 0 && (
                      <Badge className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-red-500 text-white text-xs flex items-center justify-center p-0">
                        {conversation.unreadCount}
                      </Badge>
                    )}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <div className="flex items-center space-x-2">
                        <span className="font-semibold text-gray-900 truncate">
                          {conversation.participant.displayName}
                        </span>
                        {conversation.participant.verified && (
                          <CheckCircle2 className="h-4 w-4 text-blue-500" />
                        )}
                        {conversation.isPinned && (
                          <Pin className="h-3 w-3 text-orange-500" />
                        )}
                      </div>
                      <span className="text-xs text-gray-500">
                        {new Date(conversation.lastMessage.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                    
                    <div className="flex items-center space-x-2 mb-1">
                      <span className="text-sm text-gray-600">@{conversation.participant.username}</span>
                      <Badge className={`px-1 py-0 text-xs ${getSentimentColor(conversation.sentiment)}`}>
                        {conversation.sentiment}
                      </Badge>
                      <div className="flex items-center space-x-1">
                        {getMessageTypeIcon(conversation.lastMessage.type)}
                        <span className="text-xs text-gray-500 capitalize">
                          {conversation.lastMessage.type}
                        </span>
                      </div>
                    </div>
                    
                    <p className="text-sm text-gray-600 truncate">
                      {conversation.lastMessage.isAiGenerated && (
                        <Sparkles className="inline h-3 w-3 mr-1 text-purple-500" />
                      )}
                      {conversation.lastMessage.content}
                    </p>
                    
                    {conversation.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-2">
                        {conversation.tags.slice(0, 2).map((tag, i) => (
                          <Badge key={i} variant="outline" className="text-xs px-1 py-0">
                            {tag}
                          </Badge>
                        ))}
                        {conversation.tags.length > 2 && (
                          <Badge variant="outline" className="text-xs px-1 py-0">
                            +{conversation.tags.length - 2}
                          </Badge>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
          
          {filteredConversations?.length === 0 && !conversationsLoading && (
            <div className="text-center py-12">
              <MessageCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No conversations found</h3>
              <p className="text-gray-600">Try adjusting your filters or search query</p>
            </div>
          )}
        </div>
      </ScrollArea>
    </div>
  );

  const renderMessagesView = () => {
    if (!selectedConversation) {
      return (
        <div className="flex-1 flex items-center justify-center bg-gray-50">
          <div className="text-center">
            <MessageCircle className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-medium text-gray-900 mb-2">Select a conversation</h3>
            <p className="text-gray-600">Choose a conversation from the list to start messaging</p>
          </div>
        </div>
      );
    }

    return (
      <div className="flex-1 flex flex-col bg-white">
        {/* Chat Header */}
        <div className="p-4 border-b border-gray-200 bg-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="relative">
                <Avatar className="h-10 w-10">
                  <AvatarImage src={selectedConversation.participant.avatar} />
                  <AvatarFallback>
                    {selectedConversation.participant.username.slice(0, 2).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div className={`absolute -bottom-1 -right-1 p-1 rounded-full ${getPlatformColor(selectedConversation.participant.platform)}`}>
                  {getPlatformIcon(selectedConversation.participant.platform)}
                </div>
              </div>
              
              <div>
                <div className="flex items-center space-x-2">
                  <h3 className="font-semibold text-gray-900">
                    {selectedConversation.participant.displayName}
                  </h3>
                  {selectedConversation.participant.verified && (
                    <CheckCircle2 className="h-4 w-4 text-blue-500" />
                  )}
                  <Badge className={`px-2 py-1 text-xs ${getSentimentColor(selectedConversation.sentiment)}`}>
                    {selectedConversation.sentiment}
                  </Badge>
                </div>
                <div className="flex items-center space-x-2 text-sm text-gray-600">
                  <span>@{selectedConversation.participant.username}</span>
                  <span>•</span>
                  <span>{selectedConversation.participant.followers.toLocaleString()} followers</span>
                  {selectedConversation.participant.lastSeen && (
                    <>
                      <span>•</span>
                      <span>Last seen {selectedConversation.participant.lastSeen}</span>
                    </>
                  )}
                </div>
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              <Button size="sm" variant="outline">
                <Phone className="h-4 w-4" />
              </Button>
              <Button size="sm" variant="outline">
                <VideoIcon className="h-4 w-4" />
              </Button>
              <Button size="sm" variant="outline">
                <BarChart3 className="h-4 w-4" />
              </Button>
              <Button size="sm" variant="outline">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
        
        {/* Messages Area */}
        <ScrollArea className="flex-1 p-4">
          <div className="space-y-4">
            <AnimatePresence>
              {messages?.map((message, index) => (
                <motion.div
                  key={message.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                  className={`flex ${message.isFromUser ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`max-w-xs lg:max-w-md px-4 py-2 rounded-2xl ${
                    message.isFromUser
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-900'
                  }`}>
                    {message.isAiGenerated && (
                      <div className="flex items-center space-x-1 mb-1">
                        <Sparkles className="h-3 w-3 text-purple-400" />
                        <span className="text-xs opacity-75">AI Generated</span>
                      </div>
                    )}
                    
                    <p className="text-sm">{message.content}</p>
                    
                    {message.attachments && message.attachments.length > 0 && (
                      <div className="mt-2 space-y-1">
                        {message.attachments.map((attachment, i) => (
                          <div key={i} className="flex items-center space-x-2 text-xs opacity-75">
                            {attachment.type === 'image' && <Image className="h-3 w-3" />}
                            {attachment.type === 'video' && <Video className="h-3 w-3" />}
                            {attachment.type === 'audio' && <Mic className="h-3 w-3" />}
                            {attachment.type === 'document' && <Paperclip className="h-3 w-3" />}
                            <span>{attachment.name}</span>
                          </div>
                        ))}
                      </div>
                    )}
                    
                    <div className="flex items-center justify-between mt-1 text-xs opacity-75">
                      <span>
                        {new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                      {message.isFromUser && (
                        <div className="flex items-center space-x-1">
                          {message.status === 'sent' && <Clock className="h-3 w-3" />}
                          {message.status === 'delivered' && <CheckCircle2 className="h-3 w-3" />}
                          {message.status === 'read' && <Eye className="h-3 w-3" />}
                          {message.status === 'failed' && <AlertCircle className="h-3 w-3 text-red-400" />}
                        </div>
                      )}
                    </div>
                    
                    {message.engagement && (
                      <div className="flex items-center space-x-3 mt-2 text-xs opacity-75">
                        <div className="flex items-center space-x-1">
                          <Heart className="h-3 w-3" />
                          <span>{message.engagement.likes}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Reply className="h-3 w-3" />
                          <span>{message.engagement.replies}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Share2 className="h-3 w-3" />
                          <span>{message.engagement.shares}</span>
                        </div>
                      </div>
                    )}
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
            <div ref={messagesEndRef} />
          </div>
        </ScrollArea>
        
        {/* Message Input */}
        <div className="p-4 border-t border-gray-200 bg-white">
          {aiAssistant && (
            <div className="mb-3">
              <Button
                size="sm"
                variant="outline"
                onClick={() => generateAiResponseMutation.mutate({ conversationId: selectedConversation.id })}
                disabled={generateAiResponseMutation.isPending}
                className="text-purple-600 border-purple-200 hover:bg-purple-50"
              >
                <Sparkles className="h-4 w-4 mr-2" />
                {generateAiResponseMutation.isPending ? 'Generating...' : 'Generate AI Response'}
              </Button>
            </div>
          )}
          
          <div className="flex items-end space-x-2">
            <div className="flex-1">
              <Textarea
                placeholder="Type your message..."
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    if (newMessage.trim()) {
                      sendMessageMutation.mutate({
                        conversationId: selectedConversation.id,
                        content: newMessage,
                        type: 'reply'
                      });
                    }
                  }
                }}
                className="resize-none"
                rows={2}
              />
            </div>
            
            <div className="flex flex-col space-y-2">
              <Button size="sm" variant="outline">
                <Paperclip className="h-4 w-4" />
              </Button>
              <Button size="sm" variant="outline">
                <Smile className="h-4 w-4" />
              </Button>
            </div>
            
            <Button
              onClick={() => {
                if (newMessage.trim()) {
                  sendMessageMutation.mutate({
                    conversationId: selectedConversation.id,
                    content: newMessage,
                    type: 'reply'
                  });
                }
              }}
              disabled={!newMessage.trim() || sendMessageMutation.isPending}
              className="bg-blue-600 hover:bg-blue-700"
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    );
  };

  const renderAnalyticsView = () => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="p-6 space-y-6"
    >
      {/* Analytics Header */}
      <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-lg">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Messages Analytics</h2>
        <p className="text-gray-700 mb-6">Comprehensive insights into your conversations across all platforms</p>
        
        {/* Key Metrics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { 
              icon: MessageCircle, 
              label: 'Total Conversations', 
              value: analytics?.totalConversations?.toLocaleString() || '0', 
              change: '+12%',
              color: 'blue',
              bg: 'bg-blue-100',
              text: 'text-blue-600'
            },
            { 
              icon: Users, 
              label: 'Active Conversations', 
              value: analytics?.activeConversations?.toLocaleString() || '0', 
              change: '+8%',
              color: 'green',
              bg: 'bg-green-100',
              text: 'text-green-600'
            },
            { 
              icon: TrendingUp, 
              label: 'Response Rate', 
              value: `${analytics?.responseRate || 0}%`, 
              change: '+5%',
              color: 'purple',
              bg: 'bg-purple-100',
              text: 'text-purple-600'
            },
            { 
              icon: Clock, 
              label: 'Avg Response Time', 
              value: analytics?.averageResponseTime || '0m', 
              change: '-15%',
              color: 'orange',
              bg: 'bg-orange-100',
              text: 'text-orange-600'
            }
          ].map((metric, index) => (
            <motion.div
              key={index}
              whileHover={{ scale: 1.05 }}
              className="bg-gray-50 border border-gray-200 rounded-xl p-4 hover:shadow-md transition-all"
            >
              <div className="flex items-center justify-between mb-3">
                <div className={`p-3 ${metric.bg} rounded-xl`}>
                  <metric.icon className={`h-6 w-6 ${metric.text}`} />
                </div>
                <Badge className="bg-green-100 text-green-700 text-xs">
                  {metric.change}
                </Badge>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-800">{metric.label}</p>
                <p className="text-2xl font-bold text-gray-900">{metric.value}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Platform Breakdown and Message Types */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-lg">
          <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
            <Globe className="h-5 w-5 mr-2 text-blue-600" />
            Platform Breakdown
          </h3>
          <div className="space-y-4">
            {Object.entries(analytics?.platformBreakdown || {}).map(([platform, count]) => (
              <div key={platform} className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className={`p-2 rounded-lg ${getPlatformColor(platform)}`}>
                    {getPlatformIcon(platform)}
                  </div>
                  <span className="text-gray-800 font-medium capitalize">{platform}</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-24 bg-gray-200 rounded-full h-2">
                    <div 
                      className={`h-2 rounded-full ${getPlatformColor(platform)}`} 
                      style={{ width: `${(count / (analytics?.totalConversations || 1)) * 100}%` }}
                    ></div>
                  </div>
                  <span className="text-gray-900 font-bold text-sm w-12">{count}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-lg">
          <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
            <BarChart3 className="h-5 w-5 mr-2 text-green-600" />
            Message Types
          </h3>
          <div className="space-y-4">
            {Object.entries(analytics?.messageTypes || {}).map(([type, count]) => (
              <div key={type} className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-gray-100 rounded-lg">
                    {getMessageTypeIcon(type)}
                  </div>
                  <span className="text-gray-800 font-medium capitalize">{type}</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-24 bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-green-500 h-2 rounded-full" 
                      style={{ width: `${(count / (analytics?.totalMessages || 1)) * 100}%` }}
                    ></div>
                  </div>
                  <span className="text-gray-900 font-bold text-sm w-12">{count}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Sentiment Analysis and Top Topics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-lg">
          <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
            <Heart className="h-5 w-5 mr-2 text-pink-600" />
            Sentiment Analysis
          </h3>
          <div className="space-y-4">
            {Object.entries(analytics?.sentimentDistribution || {}).map(([sentiment, percentage]) => (
              <div key={sentiment} className="flex items-center justify-between">
                <span className="text-gray-800 font-medium capitalize">{sentiment}</span>
                <div className="flex items-center space-x-3">
                  <div className="w-32 bg-gray-200 rounded-full h-3">
                    <div 
                      className={`h-3 rounded-full ${
                        sentiment === 'positive' ? 'bg-green-500' :
                        sentiment === 'negative' ? 'bg-red-500' : 'bg-gray-500'
                      }`} 
                      style={{ width: `${percentage}%` }}
                    ></div>
                  </div>
                  <span className="text-gray-900 font-bold text-sm w-12">{percentage}%</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-lg">
          <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
            <Hash className="h-5 w-5 mr-2 text-purple-600" />
            Top Topics
          </h3>
          <div className="space-y-3">
            {analytics?.topTopics?.slice(0, 5).map((topic, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <Badge className="bg-purple-100 text-purple-800 text-xs">
                    #{index + 1}
                  </Badge>
                  <span className="text-gray-800 font-medium">{topic.topic}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Badge className={`text-xs ${getSentimentColor(topic.sentiment)}`}>
                    {topic.sentiment}
                  </Badge>
                  <span className="text-gray-900 font-bold text-sm">{topic.count}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );

  const renderSettingsView = () => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="p-6 space-y-6"
    >
      <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-lg">
        <h2 className="text-2xl font-bold text-gray-900 mb-2 flex items-center">
          <Settings className="h-6 w-6 mr-3 text-blue-600" />
          Message Settings
        </h2>
        <p className="text-gray-700 mb-6">Configure your messaging preferences and automation settings</p>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Notification Settings */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900">Notifications</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-gray-800 font-medium">Real-time Notifications</Label>
                  <p className="text-sm text-gray-600">Get notified of new messages instantly</p>
                </div>
                <Switch checked={notifications} onCheckedChange={setNotifications} />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-gray-800 font-medium">Sound Alerts</Label>
                  <p className="text-sm text-gray-600">Play sound for new messages</p>
                </div>
                <Switch defaultChecked />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-gray-800 font-medium">Email Summaries</Label>
                  <p className="text-sm text-gray-600">Daily email digest of conversations</p>
                </div>
                <Switch defaultChecked />
              </div>
            </div>
          </div>

          {/* AI Assistant Settings */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900">AI Assistant</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-gray-800 font-medium">AI Response Suggestions</Label>
                  <p className="text-sm text-gray-600">Get AI-powered response suggestions</p>
                </div>
                <Switch checked={aiAssistant} onCheckedChange={setAiAssistant} />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-gray-800 font-medium">Auto-categorization</Label>
                  <p className="text-sm text-gray-600">Automatically categorize conversations</p>
                </div>
                <Switch defaultChecked />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-gray-800 font-medium">Sentiment Analysis</Label>
                  <p className="text-sm text-gray-600">Analyze message sentiment automatically</p>
                </div>
                <Switch defaultChecked />
              </div>
            </div>
          </div>

          {/* Auto-refresh Settings */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900">Performance</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-gray-800 font-medium">Auto-refresh</Label>
                  <p className="text-sm text-gray-600">Automatically refresh conversations</p>
                </div>
                <Switch checked={autoRefresh} onCheckedChange={setAutoRefresh} />
              </div>
              <div>
                <Label className="text-gray-800 font-medium">Refresh Interval</Label>
                <Select defaultValue="5000">
                  <SelectTrigger className="mt-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="2000">2 seconds</SelectItem>
                    <SelectItem value="5000">5 seconds</SelectItem>
                    <SelectItem value="10000">10 seconds</SelectItem>
                    <SelectItem value="30000">30 seconds</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* Privacy Settings */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900">Privacy</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-gray-800 font-medium">Read Receipts</Label>
                  <p className="text-sm text-gray-600">Let others know when you've read their messages</p>
                </div>
                <Switch defaultChecked />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-gray-800 font-medium">Message Encryption</Label>
                  <p className="text-sm text-gray-600">Encrypt messages for security</p>
                </div>
                <Switch defaultChecked />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-gray-800 font-medium">Data Retention</Label>
                  <p className="text-sm text-gray-600">Automatically delete old messages</p>
                </div>
                <Switch />
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-50">
      <div className="max-w-7xl mx-auto">
        {/* Professional Navigation Tabs */}
        <Tabs value={selectedTab} onValueChange={setSelectedTab} className="w-full">
          <div className="p-6 pb-0">
            <TabsList className="grid w-full grid-cols-4 bg-white/80 backdrop-blur-sm border border-gray-200 rounded-2xl p-2 shadow-lg">
              <TabsTrigger 
                value="conversations" 
                className="text-gray-800 data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-600 data-[state=active]:to-purple-600 data-[state=active]:text-white rounded-xl font-medium hover:text-gray-900"
              >
                <MessageCircle className="h-4 w-4 mr-2" />
                Conversations
              </TabsTrigger>
              <TabsTrigger 
                value="messages"
                className="text-gray-800 data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-600 data-[state=active]:to-purple-600 data-[state=active]:text-white rounded-xl font-medium hover:text-gray-900"
              >
                <Send className="h-4 w-4 mr-2" />
                Messages
              </TabsTrigger>
              <TabsTrigger 
                value="analytics"
                className="text-gray-800 data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-600 data-[state=active]:to-purple-600 data-[state=active]:text-white rounded-xl font-medium hover:text-gray-900"
              >
                <BarChart3 className="h-4 w-4 mr-2" />
                Analytics
              </TabsTrigger>
              <TabsTrigger 
                value="settings"
                className="text-gray-800 data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-600 data-[state=active]:to-purple-600 data-[state=active]:text-white rounded-xl font-medium hover:text-gray-900"
              >
                <Settings className="h-4 w-4 mr-2" />
                Settings
              </TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="conversations" className="mt-0">
            <div className="h-[calc(100vh-120px)] flex">
              {renderConversationsList()}
              {renderMessagesView()}
            </div>
          </TabsContent>

          <TabsContent value="messages" className="mt-0">
            <div className="h-[calc(100vh-120px)] flex">
              {renderConversationsList()}
              {renderMessagesView()}
            </div>
          </TabsContent>

          <TabsContent value="analytics" className="mt-6">
            {renderAnalyticsView()}
          </TabsContent>

          <TabsContent value="settings" className="mt-6">
            {renderSettingsView()}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}