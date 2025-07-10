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
  Sparkles,
  Plus
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

// Professional DM conversations - only direct messages
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
      content: 'Hi! I love your latest post! The colors are amazing. Could we collaborate?',
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
    tags: ['collaboration', 'content'],
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
      username: 'business_pro',
      displayName: 'Emma Rodriguez',
      avatar: 'https://i.pravatar.cc/150?img=3',
      platform: 'linkedin',
      verified: true,
      followers: 8900,
      lastSeen: '2025-07-10T16:15:00Z'
    },
    lastMessage: {
      id: 'msg-2',
      content: 'Would love to discuss a potential partnership opportunity with your team.',
      timestamp: '2025-07-10T16:15:00Z',
      platform: 'linkedin',
      type: 'dm',
      author: {
        id: 'user-2',
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
    id: 'conv-3',
    participant: {
      id: 'user-3',
      username: 'marketing_maven',
      displayName: 'Lisa Kim',
      avatar: 'https://i.pravatar.cc/150?img=5',
      platform: 'facebook',
      verified: true,
      followers: 15600,
      lastSeen: '2025-07-10T15:30:00Z'
    },
    lastMessage: {
      id: 'msg-3',
      content: 'Thanks for the quick response! Your customer service is excellent.',
      timestamp: '2025-07-10T15:30:00Z',
      platform: 'facebook',
      type: 'dm',
      author: {
        id: 'user-3',
        username: 'marketing_maven',
        displayName: 'Lisa Kim',
        verified: true,
        followers: 15600
      },
      isFromUser: false,
      status: 'read',
      sentiment: 'positive',
      isAiGenerated: false,
      engagement: { likes: 0, replies: 0, shares: 0 }
    },
    unreadCount: 0,
    isPinned: false,
    isArchived: false,
    tags: ['support', 'positive'],
    sentiment: 'positive',
    priority: 'medium',
    totalMessages: 6,
    createdAt: '2025-07-10T12:00:00Z',
    updatedAt: '2025-07-10T15:30:00Z'
  },
  {
    id: 'conv-4',
    participant: {
      id: 'user-4',
      username: 'content_creator_pro',
      displayName: 'David Wilson',
      avatar: 'https://i.pravatar.cc/150?img=6',
      platform: 'instagram',
      verified: false,
      followers: 7800,
      lastSeen: '2025-07-10T15:00:00Z'
    },
    lastMessage: {
      id: 'msg-4',
      content: 'Hey! Could you share some tips about content creation? I\'m starting out.',
      timestamp: '2025-07-10T15:00:00Z',
      platform: 'instagram',
      type: 'dm',
      author: {
        id: 'user-4',
        username: 'content_creator_pro',
        displayName: 'David Wilson',
        verified: false,
        followers: 7800
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
    tags: ['tips', 'content'],
    sentiment: 'neutral',
    priority: 'low',
    totalMessages: 1,
    createdAt: '2025-07-10T15:00:00Z',
    updatedAt: '2025-07-10T15:00:00Z'
  },
  {
    id: 'conv-5',
    participant: {
      id: 'user-5',
      username: 'tech_enthusiast',
      displayName: 'Mike Chen',
      avatar: 'https://i.pravatar.cc/150?img=2',
      platform: 'twitter',
      verified: false,
      followers: 5420,
      lastSeen: '2025-07-10T14:30:00Z'
    },
    lastMessage: {
      id: 'msg-5',
      content: 'Just wanted to say your tutorials helped me learn so much! Thank you.',
      timestamp: '2025-07-10T14:30:00Z',
      platform: 'twitter',
      type: 'dm',
      author: {
        id: 'user-5',
        username: 'tech_enthusiast',
        displayName: 'Mike Chen',
        verified: false,
        followers: 5420
      },
      isFromUser: false,
      status: 'read',
      sentiment: 'positive',
      isAiGenerated: false,
      engagement: { likes: 0, replies: 0, shares: 0 }
    },
    unreadCount: 0,
    isPinned: false,
    isArchived: false,
    tags: ['tutorial', 'thanks'],
    sentiment: 'positive',
    priority: 'low',
    totalMessages: 3,
    createdAt: '2025-07-10T14:00:00Z',
    updatedAt: '2025-07-10T14:30:00Z'
  }
];

const mockAnalytics: ConversationAnalytics = {
  totalConversations: 5,
  activeConversations: 3,
  totalMessages: 20,
  unreadMessages: 4,
  responseRate: 95.2,
  averageResponseTime: '1h 45m',
  sentimentDistribution: {
    positive: 60,
    negative: 0,
    neutral: 40
  },
  platformBreakdown: {
    instagram: 40,
    facebook: 20,
    twitter: 20,
    youtube: 0,
    linkedin: 20
  },
  messageTypes: {
    dms: 100,
    comments: 0,
    mentions: 0,
    replies: 0
  },
  topTopics: [
    { topic: 'Collaboration', count: 8, sentiment: 'positive' },
    { topic: 'Business', count: 5, sentiment: 'neutral' },
    { topic: 'Support', count: 4, sentiment: 'positive' },
    { topic: 'Content', count: 3, sentiment: 'positive' }
  ],
  peakHours: [
    { hour: 10, count: 4 },
    { hour: 14, count: 7 },
    { hour: 16, count: 9 },
    { hour: 19, count: 5 }
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
  const [showMobileChat, setShowMobileChat] = useState(false);

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
    <div className="h-full flex flex-col bg-white">
      {/* Professional Header */}
      <div className="flex-shrink-0 p-6 border-b border-slate-200 bg-white">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Direct Messages</h1>
            <p className="text-sm text-slate-600 mt-1">Manage your private conversations</p>
          </div>
          <div className="flex items-center space-x-3">
            <Button 
              size="sm" 
              variant="outline" 
              onClick={() => setAutoRefresh(!autoRefresh)}
              className="bg-white border-slate-300 hover:bg-slate-50 text-slate-700"
            >
              <RefreshCw className={`h-4 w-4 ${autoRefresh ? 'animate-spin' : ''}`} />
            </Button>
            <Button 
              size="sm" 
              variant="outline"
              className="bg-white border-slate-300 hover:bg-slate-50 text-slate-700"
            >
              <Plus className="h-4 w-4" />
            </Button>
          </div>
        </div>
        
        {/* Modern Search Bar */}
        <div className="relative mb-4">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
          <Input
            placeholder="Search conversations..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 bg-white border-slate-300 focus:border-blue-500 focus:ring-blue-500 text-slate-900"
          />
        </div>
        
        {/* Clean Filters */}
        <div className="flex items-center space-x-3 mb-4">
          <Select value={filterPlatform} onValueChange={setFilterPlatform}>
            <SelectTrigger className="w-36 bg-white border-slate-300 text-slate-700">
              <SelectValue placeholder="All Platforms" />
            </SelectTrigger>
            <SelectContent className="bg-white border-slate-200">
              <SelectItem value="all">All Platforms</SelectItem>
              <SelectItem value="instagram">Instagram</SelectItem>
              <SelectItem value="facebook">Facebook</SelectItem>
              <SelectItem value="twitter">Twitter</SelectItem>
              <SelectItem value="linkedin">LinkedIn</SelectItem>
            </SelectContent>
          </Select>
          
          <Select value={filterSentiment} onValueChange={setFilterSentiment}>
            <SelectTrigger className="w-32 bg-white border-slate-300 text-slate-700">
              <SelectValue placeholder="Sentiment" />
            </SelectTrigger>
            <SelectContent className="bg-white border-slate-200">
              <SelectItem value="all">All Moods</SelectItem>
              <SelectItem value="positive">Positive</SelectItem>
              <SelectItem value="neutral">Neutral</SelectItem>
              <SelectItem value="negative">Negative</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        {/* Status Bar */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="flex items-center space-x-2">
              <Switch 
                checked={showOnlyUnread} 
                onCheckedChange={setShowOnlyUnread}
                className="data-[state=checked]:bg-blue-600"
              />
              <Label className="text-sm text-slate-700 font-medium">Unread only</Label>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Badge variant="secondary" className="bg-slate-100 text-slate-700 border-slate-300">
              {filteredConversations?.length || 0} conversations
            </Badge>
          </div>
        </div>
      </div>
      
      {/* Compact Conversations List */}
      <div className="flex-1 overflow-y-auto veefore-scrollbar">
        <div className="p-2 space-y-1">
          <AnimatePresence>
            {filteredConversations?.map((conversation, index) => (
              <motion.div
                key={conversation.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2, delay: index * 0.02 }}
                className={`p-3 rounded-xl cursor-pointer transition-all duration-150 border ${
                  selectedConversation?.id === conversation.id
                    ? 'bg-blue-50 border-blue-200 shadow-sm'
                    : 'bg-white hover:bg-slate-50 border-slate-200 hover:border-slate-300'
                }`}
                onClick={() => {
                  setSelectedConversation(conversation);
                  setShowMobileChat(true);
                }}
              >
                <div className="flex items-center space-x-3">
                  {/* Compact Avatar */}
                  <div className="relative flex-shrink-0">
                    <Avatar className="h-12 w-12">
                      <AvatarImage src={conversation.participant.avatar} />
                      <AvatarFallback className="text-xs font-medium bg-gradient-to-br from-blue-500 to-purple-600 text-white">
                        {conversation.participant.displayName.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    
                    {/* Platform Badge */}
                    <div className={`absolute -bottom-1 -right-1 h-5 w-5 rounded-full flex items-center justify-center text-white text-xs ${getPlatformColor(conversation.participant.platform)}`}>
                      {getPlatformIcon(conversation.participant.platform)}
                    </div>
                    
                    {/* Unread Badge */}
                    {conversation.unreadCount > 0 && (
                      <div className="absolute -top-1 -right-1 h-5 w-5 bg-blue-600 text-white text-xs rounded-full flex items-center justify-center font-bold">
                        {conversation.unreadCount}
                      </div>
                    )}
                  </div>
                  
                  {/* Compact Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <div className="flex items-center space-x-1">
                        <h3 className="font-semibold text-slate-900 text-sm truncate">
                          {conversation.participant.displayName}
                        </h3>
                        {conversation.participant.verified && (
                          <CheckCircle2 className="h-4 w-4 text-blue-500 flex-shrink-0" />
                        )}
                      </div>
                      <span className="text-xs text-slate-500">
                        {new Date(conversation.lastMessage.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                    
                    <p className="text-slate-600 text-sm truncate mb-1">
                      {conversation.lastMessage.isAiGenerated && (
                        <Sparkles className="inline h-3 w-3 mr-1 text-purple-500" />
                      )}
                      {conversation.lastMessage.content}
                    </p>
                    
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-slate-500">@{conversation.participant.username}</span>
                      <div className={`px-2 py-0.5 rounded-full text-xs ${getSentimentColor(conversation.sentiment)}`}>
                        {conversation.sentiment}
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
          
          {filteredConversations?.length === 0 && !conversationsLoading && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-8"
            >
              <div className="bg-slate-100 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-3">
                <MessageCircle className="h-6 w-6 text-slate-400" />
              </div>
              <h3 className="text-lg font-semibold text-slate-900 mb-1">No conversations</h3>
              <p className="text-slate-600 text-sm">Try adjusting your filters</p>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );

  const renderMessagesView = () => {
    if (!selectedConversation) {
      return (
        <div className="flex-1 flex items-center justify-center bg-slate-50">
          <div className="text-center">
            <MessageCircle className="h-16 w-16 text-slate-400 mx-auto mb-4" />
            <h3 className="text-xl font-medium text-slate-900 mb-2">Select a conversation</h3>
            <p className="text-slate-600">Choose a conversation from the list to start messaging</p>
          </div>
        </div>
      );
    }

    return (
      <div className="flex flex-col h-full bg-white">
        {/* Chat Header */}
        <div className="flex-shrink-0 p-4 border-b border-slate-200 bg-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              {/* Mobile Back Button */}
              <Button
                size="sm"
                variant="ghost"
                onClick={() => setShowMobileChat(false)}
                className="sm:hidden p-1 h-8 w-8"
              >
                <ChevronDown className="h-4 w-4 rotate-90" />
              </Button>
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
                  <h3 className="font-semibold text-slate-900">
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
        
        {/* Compact Messages Area */}
        <div className="flex-1 overflow-y-auto veefore-scrollbar p-3">
          <div className="space-y-2">
            <AnimatePresence>
              {messages?.map((message, index) => (
                <motion.div
                  key={message.id}
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.2, delay: index * 0.02 }}
                  className={`flex ${message.isFromUser ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`max-w-sm px-3 py-2 rounded-2xl text-sm ${
                    message.isFromUser
                      ? 'bg-blue-600 text-white'
                      : 'bg-slate-100 text-slate-900'
                  }`}>
                    {message.isAiGenerated && (
                      <div className="flex items-center space-x-1 mb-1">
                        <Sparkles className="h-3 w-3 text-purple-400" />
                        <span className="text-xs opacity-75">AI</span>
                      </div>
                    )}
                    
                    <p>{message.content}</p>
                    
                    <div className="flex items-center justify-between mt-1 text-xs opacity-75">
                      <span>
                        {new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                      {message.isFromUser && (
                        <div className="flex items-center space-x-1">
                          {message.status === 'read' && <Eye className="h-3 w-3" />}
                          {message.status === 'delivered' && <CheckCircle2 className="h-3 w-3" />}
                          {message.status === 'sent' && <Clock className="h-3 w-3" />}
                        </div>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
            <div ref={messagesEndRef} />
          </div>
        </div>
        
        {/* Compact Message Input */}
        <div className="flex-shrink-0 p-4 border-t border-slate-200 bg-white">
          {aiAssistant && (
            <div className="mb-3">
              <Button
                size="sm"
                variant="outline"
                onClick={() => generateAiResponseMutation.mutate({ conversationId: selectedConversation.id })}
                disabled={generateAiResponseMutation.isPending}
                className="text-purple-600 border-purple-200 hover:bg-purple-50 bg-white text-sm"
              >
                <Sparkles className="h-4 w-4 mr-2" />
                {generateAiResponseMutation.isPending ? 'Generating...' : 'AI Response'}
              </Button>
            </div>
          )}
          
          <div className="flex items-end space-x-3">
            <div className="flex-1">
              <Textarea
                placeholder="Type your direct message..."
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    if (newMessage.trim()) {
                      sendMessageMutation.mutate({
                        conversationId: selectedConversation.id,
                        content: newMessage,
                        type: 'dm'
                      });
                    }
                  }
                }}
                className="resize-none bg-white border-slate-300 focus:border-blue-500 focus:ring-blue-500 text-slate-900 rounded-xl text-sm"
                rows={2}
              />
            </div>
            
            <div className="flex items-center space-x-2">
              <Button 
                size="sm" 
                variant="outline"
                className="bg-white border-slate-300 hover:bg-slate-50 text-slate-700 h-8 w-8 p-0"
              >
                <Paperclip className="h-4 w-4" />
              </Button>
              <Button
                onClick={() => {
                  if (newMessage.trim()) {
                    sendMessageMutation.mutate({
                      conversationId: selectedConversation.id,
                      content: newMessage,
                      type: 'dm'
                    });
                  }
                }}
                disabled={!newMessage.trim() || sendMessageMutation.isPending}
                className="bg-blue-600 hover:bg-blue-700 text-white h-8 px-4"
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>
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
    <div className="veefore-app-container h-full overflow-hidden">
      <div className="flex flex-col h-full">
        {/* Modern Navigation Tabs */}
        <Tabs value={selectedTab} onValueChange={setSelectedTab} className="flex flex-col h-full">
          <div className="flex-shrink-0 p-4 pb-2 bg-white border-b border-slate-200">
            <TabsList className="grid w-full grid-cols-3 bg-slate-100 border border-slate-200 rounded-lg p-1">
              <TabsTrigger 
                value="conversations" 
                className="text-slate-700 data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-600 data-[state=active]:to-purple-600 data-[state=active]:text-white rounded-xl font-semibold hover:text-slate-900 transition-all"
              >
                <MessageCircle className="h-4 w-4 mr-2" />
                Direct Messages
              </TabsTrigger>
              <TabsTrigger 
                value="analytics"
                className="text-slate-700 data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-600 data-[state=active]:to-purple-600 data-[state=active]:text-white rounded-xl font-semibold hover:text-slate-900 transition-all"
              >
                <BarChart3 className="h-4 w-4 mr-2" />
                Analytics
              </TabsTrigger>
              <TabsTrigger 
                value="settings"
                className="text-slate-700 data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-600 data-[state=active]:to-purple-600 data-[state=active]:text-white rounded-xl font-semibold hover:text-slate-900 transition-all"
              >
                <Settings className="h-4 w-4 mr-2" />
                Settings
              </TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="conversations" className="flex-1 overflow-hidden">
            <div className="flex h-full bg-white overflow-hidden">
              {/* Mobile: Show conversations or chat based on state */}
              <div className={`${showMobileChat ? 'hidden' : 'flex'} sm:flex w-full sm:w-80 md:w-96 border-r border-slate-200 flex-col h-full overflow-hidden`}>
                {renderConversationsList()}
              </div>
              
              {/* Mobile: Show chat when conversation selected */}
              <div className={`${showMobileChat ? 'flex' : 'hidden'} sm:flex flex-1 flex-col h-full overflow-hidden`}>
                {renderMessagesView()}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="messages" className="flex-1 overflow-hidden">
            <div className="flex h-full bg-white overflow-hidden">
              <div className="w-full sm:w-80 md:w-96 border-r border-slate-200 flex flex-col h-full overflow-hidden">
                {renderConversationsList()}
              </div>
              <div className="hidden sm:flex flex-1 flex-col h-full overflow-hidden">
                {renderMessagesView()}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="analytics" className="flex-1 overflow-hidden">
            <div className="veefore-main-content h-full bg-white">
              {renderAnalyticsView()}
            </div>
          </TabsContent>

          <TabsContent value="settings" className="flex-1 overflow-hidden">
            <div className="veefore-main-content h-full bg-white">
              {renderSettingsView()}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}