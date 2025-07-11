import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { 
  MessageCircle, 
  Instagram, 
  Send, 
  Clock, 
  Target, 
  TrendingUp,
  Users,
  Heart,
  Eye,
  Play,
  Image as ImageIcon,
  Video,
  Calendar,
  Settings,
  BarChart3,
  Zap,
  CheckCircle,
  XCircle,
  Plus,
  Trash2,
  Edit,
  Copy,
  ExternalLink,
  ArrowRight,
  ArrowLeft,
  Sparkles,
  Bot,
  ChevronRight,
  Globe,
  Share2,
  MessageSquare,
  Filter,
  Search,
  MoreHorizontal,
  X
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";

interface Post {
  id: string;
  caption: string;
  mediaUrl: string;
  mediaType: 'image' | 'video' | 'carousel';
  timestamp: string;
  likes: number;
  comments: number;
  shares: number;
  platform: 'instagram' | 'facebook' | 'twitter';
  isScheduled: boolean;
  status: 'published' | 'scheduled' | 'draft';
}

interface CommentReply {
  id: string;
  text: string;
  emoji?: string;
}

interface DMAutomation {
  id?: string;
  postId: string;
  socialAccountId: string;
  keyword: string;
  commentReplies: CommentReply[];
  commentDelay: number;
  commentDelayUnit: 'minutes' | 'hours';
  directMessage: {
    text: string;
    buttonText: string;
    websiteUrl: string;
  };
  isActive: boolean;
  analytics: {
    totalComments: number;
    dmsSent: number;
    openRate: number;
    totalClicks: number;
  };
}

const STEP_TITLES = [
  "Select a post",
  "Comment replies", 
  "Direct message",
  "Review and save"
];

const MOCK_POSTS: Post[] = [
  {
    id: "1",
    caption: "What are your thoughts on our latest project? We would love to hear your feedback and ideas! Share your insights with us! Comment below with your thoughts! #vfvfv",
    mediaUrl: "/api/placeholder/400/400",
    mediaType: 'image',
    timestamp: "2025-07-11T10:00:00Z",
    likes: 124,
    comments: 18,
    shares: 5,
    platform: 'instagram',
    isScheduled: false,
    status: 'published'
  },
  {
    id: "2", 
    caption: "Behind the scenes of our creative process! 🎨✨",
    mediaUrl: "/api/placeholder/400/400",
    mediaType: 'carousel',
    timestamp: "2025-07-10T14:30:00Z",
    likes: 89,
    comments: 12,
    shares: 3,
    platform: 'instagram',
    isScheduled: false,
    status: 'published'
  },
  {
    id: "3",
    caption: "New video content coming soon! Stay tuned for updates 📺",
    mediaUrl: "/api/placeholder/400/400", 
    mediaType: 'video',
    timestamp: "2025-07-09T09:15:00Z",
    likes: 203,
    comments: 34,
    shares: 12,
    platform: 'instagram',
    isScheduled: true,
    status: 'scheduled'
  }
];

const MOCK_SOCIAL_ACCOUNTS = [
  { id: "1", username: "rahulc1020", platform: "instagram", avatar: "/api/placeholder/32/32" },
  { id: "2", username: "arpit9996363", platform: "instagram", avatar: "/api/placeholder/32/32" },
  { id: "3", username: "veefore_official", platform: "instagram", avatar: "/api/placeholder/32/32" }
];

export default function CommentToDMAutomation() {
  const [currentStep, setCurrentStep] = useState(0);
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);
  const [selectedSocialAccount, setSelectedSocialAccount] = useState("");
  const [keyword, setKeyword] = useState("");
  const [commentReplies, setCommentReplies] = useState<CommentReply[]>([
    { id: "1", text: "Done and sent! 😊", emoji: "😊" },
    { id: "2", text: "There you go! 🎉", emoji: "🎉" },
    { id: "3", text: "You've got it! 👍", emoji: "👍" }
  ]);
  const [commentDelay, setCommentDelay] = useState(15);
  const [commentDelayUnit, setCommentDelayUnit] = useState<'minutes' | 'hours'>('minutes');
  const [directMessage, setDirectMessage] = useState({
    text: "This is the product link",
    buttonText: "Click here",
    websiteUrl: "https://veefore.com"
  });
  const [isPreviewMode, setIsPreviewMode] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState<'all' | 'published' | 'scheduled'>('all');
  const [showAnalytics, setShowAnalytics] = useState(false);

  const { toast } = useToast();

  const progress = ((currentStep + 1) / STEP_TITLES.length) * 100;

  const filteredPosts = MOCK_POSTS.filter(post => {
    const matchesSearch = post.caption.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || post.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const addCommentReply = () => {
    const newReply: CommentReply = {
      id: Date.now().toString(),
      text: "",
      emoji: "😊"
    };
    setCommentReplies([...commentReplies, newReply]);
  };

  const removeCommentReply = (id: string) => {
    setCommentReplies(commentReplies.filter(reply => reply.id !== id));
  };

  const updateCommentReply = (id: string, text: string) => {
    setCommentReplies(commentReplies.map(reply => 
      reply.id === id ? { ...reply, text } : reply
    ));
  };

  const getStepStatus = (stepIndex: number) => {
    if (stepIndex < currentStep) return "completed";
    if (stepIndex === currentStep) return "current";
    return "pending";
  };

  const canProceedToNextStep = () => {
    switch (currentStep) {
      case 0:
        return selectedPost && selectedSocialAccount && keyword;
      case 1:
        return commentReplies.length > 0 && commentReplies.every(reply => reply.text.trim());
      case 2:
        return directMessage.text && directMessage.buttonText && directMessage.websiteUrl;
      default:
        return true;
    }
  };

  const handleSaveAutomation = () => {
    // Save automation logic here
    toast({
      title: "Automation Saved",
      description: "Your Comment to DM automation has been successfully created and activated.",
    });
  };

  const InstagramPostPreview = ({ post }: { post: Post }) => (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 max-w-sm">
      {/* Post Header */}
      <div className="flex items-center justify-between p-3 border-b border-gray-100">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full flex items-center justify-center">
            <span className="text-white text-sm font-semibold">R</span>
          </div>
          <span className="font-semibold text-gray-900">{selectedSocialAccount || 'rahulc1020'}</span>
        </div>
        <button className="p-1">
          <MoreHorizontal className="w-4 h-4 text-gray-600" />
        </button>
      </div>
      
      {/* Post Image */}
      <div className="aspect-square bg-gray-200 flex items-center justify-center">
        <ImageIcon className="w-12 h-12 text-gray-400" />
      </div>
      
      {/* Post Actions */}
      <div className="p-3 space-y-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Heart className="w-6 h-6 text-gray-700" />
            <MessageCircle className="w-6 h-6 text-gray-700" />
            <Send className="w-6 h-6 text-gray-700" />
          </div>
          <div className="w-6 h-6 border-2 border-gray-700 rounded-sm"></div>
        </div>
        
        <div className="text-sm text-gray-900">
          <span className="font-semibold">{selectedSocialAccount || 'rahulc1020'}</span>
        </div>
        
        <div className="text-sm text-gray-700">
          {post.caption}
        </div>
        
        {/* Mock Comments */}
        <div className="space-y-1 mt-3">
          <div className="flex items-start space-x-2">
            <div className="w-6 h-6 bg-gray-300 rounded-full flex items-center justify-center">
              <span className="text-xs text-gray-600">U</span>
            </div>
            <div className="flex-1">
              <div className="text-sm">
                <span className="font-semibold text-gray-900">username</span>
                <span className="text-gray-700 ml-1">{keyword || 'dfd'}</span>
              </div>
              <div className="text-xs text-gray-500">Reply</div>
            </div>
          </div>
          
          {commentReplies.length > 0 && (
            <div className="flex items-start space-x-2">
              <div className="w-6 h-6 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full flex items-center justify-center">
                <span className="text-xs text-white">R</span>
              </div>
              <div className="flex-1">
                <div className="text-sm">
                  <span className="font-semibold text-gray-900">{selectedSocialAccount || 'rahulc1020'}</span>
                  <span className="text-gray-700 ml-1">{commentReplies[0]?.text || 'Done and sent! 😊'}</span>
                </div>
                <div className="text-xs text-gray-500">Reply</div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );

  const InstagramDMPreview = () => (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 max-w-sm">
      {/* DM Header */}
      <div className="flex items-center justify-between p-3 border-b border-gray-100">
        <div className="flex items-center space-x-2">
          <Instagram className="w-5 h-5 text-purple-600" />
          <span className="font-semibold text-gray-900">Instagram direct message</span>
        </div>
        <button className="p-1">
          <MoreHorizontal className="w-4 h-4 text-gray-600" />
        </button>
      </div>
      
      {/* DM Content */}
      <div className="p-4 space-y-4">
        <div className="text-xs text-gray-500 text-center">
          JUL 11, 04:09 PM
        </div>
        
        {/* Message Bubble */}
        <div className="bg-gray-100 rounded-2xl p-4 text-sm text-gray-700 leading-relaxed">
          {directMessage.text || "This is the product link frfrfffrffrgtgtgtgtr 5ytt htgt5tg t5g 6 tgtgt4gtg4 vy65y5 6666 ftbghbtgrbhtgtgtgtrgtg"}
        </div>
        
        {/* Button */}
        {(directMessage.buttonText || directMessage.websiteUrl) && (
          <div className="text-center">
            <button className="bg-white border border-gray-300 text-gray-900 px-6 py-2 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors">
              {directMessage.buttonText || "Click here"}
            </button>
          </div>
        )}
        
        {/* User Initial */}
        <div className="flex justify-end">
          <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
            <span className="text-sm font-medium text-gray-700">R</span>
          </div>
        </div>
        
        {/* Bottom Input Area */}
        <div className="flex items-center space-x-3 bg-gray-50 rounded-full p-3 mt-4">
          <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
            <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
            </svg>
          </div>
          <span className="text-sm text-gray-500 flex-1">Message...</span>
          <div className="flex items-center space-x-2">
            <div className="w-6 h-6 bg-gray-300 rounded flex items-center justify-center">
              <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
              </svg>
            </div>
            <div className="w-6 h-6 bg-gray-300 rounded flex items-center justify-center">
              <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <div className="w-6 h-6 bg-gray-300 rounded flex items-center justify-center">
              <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
            </div>
            <div className="w-6 h-6 bg-gray-300 rounded-full flex items-center justify-center">
              <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
              </svg>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Main Content */}
      <div className="flex-1 flex">
        {/* Left Panel - Configuration */}
        <div className="w-1/2 bg-white border-r border-gray-200 flex flex-col">
          {/* Header */}
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                  <MessageCircle className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h1 className="text-xl font-bold text-gray-900">DM automation</h1>
                  <p className="text-sm text-gray-500">Create automated comment to DM flows</p>
                </div>
              </div>
              <button 
                onClick={() => window.history.back()}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-gray-600" />
              </button>
            </div>
            
            {/* Progress Steps */}
            <div className="mt-6">
              <div className="flex items-center justify-between mb-2">
                {STEP_TITLES.map((title, index) => (
                  <div key={index} className="flex items-center">
                    <div className={cn(
                      "w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-all duration-200",
                      getStepStatus(index) === "completed" 
                        ? "bg-green-100 text-green-700 border-2 border-green-300" 
                        : getStepStatus(index) === "current"
                        ? "bg-blue-100 text-blue-700 border-2 border-blue-300"
                        : "bg-gray-100 text-gray-400 border-2 border-gray-200"
                    )}>
                      {getStepStatus(index) === "completed" ? (
                        <CheckCircle className="w-4 h-4" />
                      ) : (
                        <span>{index + 1}</span>
                      )}
                    </div>
                    {index < STEP_TITLES.length - 1 && (
                      <div className={cn(
                        "w-16 h-1 mx-2 rounded-full transition-all duration-200",
                        index < currentStep ? "bg-green-300" : "bg-gray-200"
                      )} />
                    )}
                  </div>
                ))}
              </div>
              <div className="flex justify-between text-xs text-gray-500 mt-2">
                {STEP_TITLES.map((title, index) => (
                  <span key={index} className={cn(
                    "transition-colors duration-200",
                    index === currentStep ? "text-blue-600 font-medium" : ""
                  )}>
                    {title}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Step Content */}
          <div className="flex-1 p-6 overflow-y-auto">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentStep}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
              >
                {/* Step 1: Select a post */}
                {currentStep === 0 && (
                  <div className="space-y-6">
                    <div>
                      <h2 className="text-lg font-semibold text-gray-900 mb-2">Create a DM automation</h2>
                      <p className="text-sm text-gray-600">
                        Invite people to use a specific keyword in the comments of an Instagram Post or Reel, 
                        and automatically reply to their comment and send them a direct message.
                      </p>
                    </div>

                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="social-account">Social account</Label>
                        <Select value={selectedSocialAccount} onValueChange={setSelectedSocialAccount}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select social account" />
                          </SelectTrigger>
                          <SelectContent>
                            {MOCK_SOCIAL_ACCOUNTS.map(account => (
                              <SelectItem key={account.id} value={account.username}>
                                <div className="flex items-center space-x-2">
                                  <Instagram className="w-4 h-4 text-purple-600" />
                                  <span>{account.username}</span>
                                </div>
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      <div>
                        <Label>Select a scheduled post or reel</Label>
                        <div className="mt-2 space-y-2">
                          <div className="flex items-center space-x-2">
                            <div className="relative flex-1">
                              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                              <Input
                                placeholder="Search posts..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="pl-10"
                              />
                            </div>
                            <Select value={filterStatus} onValueChange={(value: any) => setFilterStatus(value)}>
                              <SelectTrigger className="w-36">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="all">All posts</SelectItem>
                                <SelectItem value="published">Published</SelectItem>
                                <SelectItem value="scheduled">Scheduled</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          
                          <div className="grid grid-cols-2 gap-3 max-h-64 overflow-y-auto">
                            {filteredPosts.map(post => (
                              <div
                                key={post.id}
                                onClick={() => setSelectedPost(post)}
                                className={cn(
                                  "p-3 rounded-lg border-2 cursor-pointer transition-all duration-200 hover:shadow-md",
                                  selectedPost?.id === post.id
                                    ? "border-blue-500 bg-blue-50"
                                    : "border-gray-200 hover:border-gray-300"
                                )}
                              >
                                <div className="aspect-square bg-gray-100 rounded-lg mb-2 flex items-center justify-center">
                                  {post.mediaType === 'video' ? (
                                    <Video className="w-8 h-8 text-gray-400" />
                                  ) : post.mediaType === 'carousel' ? (
                                    <div className="flex space-x-1">
                                      <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
                                      <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
                                      <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
                                    </div>
                                  ) : (
                                    <ImageIcon className="w-8 h-8 text-gray-400" />
                                  )}
                                </div>
                                <div className="space-y-1">
                                  <p className="text-xs text-gray-700 line-clamp-2">{post.caption}</p>
                                  <div className="flex items-center justify-between">
                                    <Badge variant={post.status === 'published' ? 'default' : 'secondary'} className="text-xs">
                                      {post.status}
                                    </Badge>
                                    <div className="flex items-center space-x-2 text-xs text-gray-500">
                                      <span className="flex items-center">
                                        <Heart className="w-3 h-3 mr-1" />
                                        {post.likes}
                                      </span>
                                      <span className="flex items-center">
                                        <MessageCircle className="w-3 h-3 mr-1" />
                                        {post.comments}
                                      </span>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>

                      <div>
                        <Label htmlFor="keyword">Keyword</Label>
                        <Input
                          id="keyword"
                          placeholder="Your keyword"
                          value={keyword}
                          onChange={(e) => setKeyword(e.target.value)}
                        />
                        <p className="text-xs text-gray-500 mt-1">
                          When a user includes this keyword in a comment it will trigger a reply to their comment and a DM.
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Step 2: Comment replies */}
                {currentStep === 1 && (
                  <div className="space-y-6">
                    <div>
                      <h2 className="text-lg font-semibold text-gray-900 mb-2">Write comment replies</h2>
                      <p className="text-sm text-gray-600">
                        Write a few different possible responses, and we'll cycle through them so your responses seem more genuine and varied.
                      </p>
                    </div>

                    <div className="space-y-4">
                      <div>
                        <Label>Comment replies</Label>
                        <div className="space-y-3 mt-2">
                          {commentReplies.map((reply, index) => (
                            <div key={reply.id} className="flex items-center space-x-2">
                              <Input
                                placeholder="Enter comment reply..."
                                value={reply.text}
                                onChange={(e) => updateCommentReply(reply.id, e.target.value)}
                                className="flex-1"
                              />
                              <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                onClick={() => removeCommentReply(reply.id)}
                                className="p-2 hover:bg-red-50 hover:text-red-600"
                              >
                                <XCircle className="w-4 h-4" />
                              </Button>
                            </div>
                          ))}
                          <Button
                            type="button"
                            variant="outline"
                            onClick={addCommentReply}
                            className="w-full"
                          >
                            <Plus className="w-4 h-4 mr-2" />
                            Add another reply
                          </Button>
                        </div>
                      </div>

                      <div>
                        <Label>Delay before comment</Label>
                        <p className="text-sm text-gray-600 mb-2">
                          Adding a short delay before responding to comments helps your replies seem more thoughtful and authentic.
                        </p>
                        <div className="flex items-center space-x-2">
                          <Input
                            type="number"
                            min="1"
                            max="60"
                            value={commentDelay}
                            onChange={(e) => setCommentDelay(parseInt(e.target.value))}
                            className="w-20"
                          />
                          <Select value={commentDelayUnit} onValueChange={(value: any) => setCommentDelayUnit(value)}>
                            <SelectTrigger className="w-28">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="minutes">Minutes</SelectItem>
                              <SelectItem value="hours">Hours</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Step 3: Direct message */}
                {currentStep === 2 && (
                  <div className="space-y-6">
                    <div>
                      <h2 className="text-lg font-semibold text-gray-900 mb-2">Write a direct message</h2>
                      <p className="text-sm text-gray-600">
                        Write the DM you want sent when users include your keyword when they comment on your post.
                      </p>
                    </div>

                    <div className="space-y-4">
                      <div>
                        <Label>Direct message</Label>
                        <p className="text-sm text-gray-600 mb-2">
                          We'll send this DM to the user who included your keyword in their comment.
                        </p>
                        <Textarea
                          placeholder="Enter your DM text here"
                          value={directMessage.text}
                          onChange={(e) => setDirectMessage({...directMessage, text: e.target.value})}
                          rows={3}
                        />
                      </div>

                      <div>
                        <Label>Button text</Label>
                        <Input
                          placeholder="Choose a short and clear button text"
                          value={directMessage.buttonText}
                          onChange={(e) => setDirectMessage({...directMessage, buttonText: e.target.value})}
                        />
                      </div>

                      <div>
                        <Label>Website URL</Label>
                        <Input
                          placeholder="Enter the destination URL for your button"
                          value={directMessage.websiteUrl}
                          onChange={(e) => setDirectMessage({...directMessage, websiteUrl: e.target.value})}
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* Step 4: Review and save */}
                {currentStep === 3 && (
                  <div className="space-y-6">
                    <div>
                      <h2 className="text-lg font-semibold text-gray-900 mb-2">Review and save this DM automation</h2>
                      <p className="text-sm text-gray-600">
                        Review your automation settings and activate when ready.
                      </p>
                    </div>

                    <div className="space-y-4">
                      <div>
                        <Label>Social account</Label>
                        <div className="flex items-center space-x-2 mt-1">
                          <Instagram className="w-4 h-4 text-purple-600" />
                          <span className="text-sm text-gray-700">{selectedSocialAccount}</span>
                        </div>
                      </div>

                      <div>
                        <Label>Select a scheduled post or reel</Label>
                        {selectedPost && (
                          <div className="mt-2 p-3 bg-gray-50 rounded-lg">
                            <div className="flex items-center space-x-3">
                              <div className="w-12 h-12 bg-gray-200 rounded-lg flex items-center justify-center">
                                {selectedPost.mediaType === 'video' ? (
                                  <Video className="w-6 h-6 text-gray-400" />
                                ) : (
                                  <ImageIcon className="w-6 h-6 text-gray-400" />
                                )}
                              </div>
                              <div className="flex-1">
                                <p className="text-sm text-gray-700 line-clamp-1">{selectedPost.caption}</p>
                                <Badge variant="secondary" className="mt-1">
                                  {selectedPost.status}
                                </Badge>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>

                      <div>
                        <Label>Keyword</Label>
                        <p className="text-sm text-gray-600 mt-1">
                          When a user includes this keyword in a comment it will trigger a reply to their comment and a DM.
                        </p>
                        <div className="mt-2 p-2 bg-blue-50 rounded-lg">
                          <span className="text-sm font-medium text-blue-700">✏️ {keyword}</span>
                        </div>
                      </div>

                      <div>
                        <Label>Comment replies</Label>
                        <p className="text-sm text-gray-600 mt-1">
                          We'll cycle through these comments so your responses seem more genuine and varied.
                        </p>
                        <div className="mt-2 space-y-2">
                          {commentReplies.map((reply, index) => (
                            <div key={reply.id} className="p-2 bg-gray-50 rounded-lg">
                              <span className="text-sm text-gray-700">{reply.text}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div>
                        <Label>Delay before comment</Label>
                        <p className="text-sm text-gray-600 mt-1">
                          Adding a short delay before responding to comments helps your replies seem more thoughtful and authentic.
                        </p>
                        <div className="mt-2 p-2 bg-gray-50 rounded-lg">
                          <span className="text-sm text-gray-700">{commentDelay} {commentDelayUnit}</span>
                        </div>
                      </div>

                      <div>
                        <Label>Direct message</Label>
                        <p className="text-sm text-gray-600 mt-1">
                          We'll send this DM to the user who included your keyword in their comment.
                        </p>
                        <div className="mt-2 p-3 bg-gray-50 rounded-lg">
                          <p className="text-sm text-gray-700">{directMessage.text}</p>
                          {directMessage.buttonText && (
                            <div className="mt-2 flex items-center space-x-2">
                              <Button size="sm" className="pointer-events-none">
                                {directMessage.buttonText}
                              </Button>
                              <span className="text-xs text-gray-500">→ {directMessage.websiteUrl}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Navigation Footer */}
          <div className="p-6 border-t border-gray-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                {currentStep > 0 && (
                  <Button
                    variant="outline"
                    onClick={() => setCurrentStep(currentStep - 1)}
                  >
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Back
                  </Button>
                )}
              </div>
              <div className="flex items-center space-x-2">
                {currentStep < STEP_TITLES.length - 1 ? (
                  <Button
                    onClick={() => setCurrentStep(currentStep + 1)}
                    disabled={!canProceedToNextStep()}
                  >
                    Continue
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                ) : (
                  <div className="flex items-center space-x-2">
                    <Button variant="outline">
                      Save for later
                    </Button>
                    <Button
                      onClick={handleSaveAutomation}
                      className="bg-blue-600 hover:bg-blue-700"
                    >
                      <Zap className="w-4 h-4 mr-2" />
                      Activate
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Right Panel - Preview */}
        <div className="w-1/2 bg-gray-50 p-6 flex flex-col">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-2">
              <Instagram className="w-5 h-5 text-purple-600" />
              <span className="font-semibold text-gray-900">
                {currentStep === 2 ? 'Instagram direct message' : 'Instagram post and keyword'}
              </span>
            </div>
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsPreviewMode(!isPreviewMode)}
              >
                <Eye className="w-4 h-4 mr-2" />
                {isPreviewMode ? 'Edit' : 'Preview'}
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowAnalytics(!showAnalytics)}
              >
                <BarChart3 className="w-4 h-4 mr-2" />
                Analytics
              </Button>
            </div>
          </div>

          <div className="flex-1 flex flex-col items-center justify-center space-y-6">
            {currentStep === 2 ? (
              // Step 3: Direct message - Show only DM preview
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <InstagramDMPreview />
              </motion.div>
            ) : (
              // All other steps - Show post preview
              selectedPost && (
                <InstagramPostPreview post={selectedPost} />
              )
            )}
            
            {currentStep >= 2 && currentStep !== 2 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <InstagramDMPreview />
              </motion.div>
            )}
          </div>

          {/* Analytics Panel */}
          {showAnalytics && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              className="mt-6 p-4 bg-white rounded-lg border border-gray-200"
            >
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-semibold text-gray-900">Automation Analytics</h3>
                <Badge variant="secondary">Live Preview</Badge>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-gray-900">-</div>
                  <div className="text-sm text-gray-600">Total comments</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-gray-900">-</div>
                  <div className="text-sm text-gray-600">DMs sent</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-gray-900">-</div>
                  <div className="text-sm text-gray-600">Open rate</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-gray-900">-</div>
                  <div className="text-sm text-gray-600">Total clicks</div>
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}