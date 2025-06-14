import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useAuth } from "@/hooks/useAuth";
import { useWorkspaceContext } from "@/hooks/useWorkspace";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { 
  Calendar,
  Clock,
  Instagram,
  Youtube,
  Facebook,
  Twitter,
  Plus,
  Edit,
  Trash2,
  PlayCircle,
  Eye,
  AlertCircle,
  CheckCircle2
} from "lucide-react";
import { format } from "date-fns";

interface ScheduledContent {
  id: string;
  title: string;
  description: string;
  platform: string;
  type: string;
  status: string;
  scheduledAt: string;
  mediaUrl?: string;
  createdAt: string;
  metadata?: {
    hashtags?: string[];
    mentions?: string[];
  };
}

const platformIcons = {
  instagram: Instagram,
  youtube: Youtube,
  facebook: Facebook,
  twitter: Twitter
};

const platformColors = {
  instagram: "text-pink-500",
  youtube: "text-red-500",
  facebook: "text-blue-500",
  twitter: "text-blue-400"
};

const statusColors = {
  scheduled: "bg-blue-100 text-blue-800",
  published: "bg-green-100 text-green-800",
  failed: "bg-red-100 text-red-800",
  draft: "bg-gray-100 text-gray-800"
};

export default function Scheduler() {
  const { user } = useAuth();
  const { currentWorkspace } = useWorkspaceContext();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    platform: "",
    scheduledAt: "",
    hashtags: "",
    mentions: ""
  });

  // Fetch scheduled content
  const { data: scheduledContent = [], isLoading } = useQuery({
    queryKey: ['scheduled-content', currentWorkspace?.id],
    queryFn: async () => {
      if (!currentWorkspace?.id) return [];
      
      const response = await apiRequest('GET', `/api/scheduler/list?workspaceId=${currentWorkspace.id}&status=scheduled`);
      const data = await response.json();
      return data.content || [];
    },
    enabled: !!currentWorkspace?.id
  });

  // Fetch social accounts for platform selection
  const { data: socialAccounts = [] } = useQuery({
    queryKey: ['social-accounts', currentWorkspace?.id],
    queryFn: async () => {
      if (!currentWorkspace?.id) return [];
      
      const response = await apiRequest('GET', '/api/social-accounts');
      return response.json();
    },
    enabled: !!currentWorkspace?.id
  });

  // Create scheduled content mutation
  const createContentMutation = useMutation({
    mutationFn: async (data: any) => {
      const response = await apiRequest('POST', '/api/scheduler/create', data);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['scheduled-content'] });
      toast({
        title: "Content Scheduled",
        description: "Your content has been successfully scheduled.",
      });
      setIsCreateOpen(false);
      setFormData({
        title: "",
        content: "",
        platform: "",
        scheduledAt: "",
        hashtags: "",
        mentions: ""
      });
    },
    onError: (error: any) => {
      toast({
        title: "Scheduling Failed",
        description: error.message || "Failed to schedule content",
        variant: "destructive",
      });
    }
  });

  // Delete scheduled content mutation
  const deleteContentMutation = useMutation({
    mutationFn: async (contentId: string) => {
      const response = await apiRequest('DELETE', `/api/scheduler/delete/${contentId}`);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['scheduled-content'] });
      toast({
        title: "Content Deleted",
        description: "Scheduled content has been removed.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Delete Failed",
        description: error.message || "Failed to delete content",
        variant: "destructive",
      });
    }
  });

  const handleCreateContent = () => {
    if (!formData.title || !formData.content || !formData.platform || !formData.scheduledAt) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    const hashtags = formData.hashtags ? formData.hashtags.split(',').map(h => h.trim()) : [];
    const mentions = formData.mentions ? formData.mentions.split(',').map(m => m.trim()) : [];

    createContentMutation.mutate({
      title: formData.title,
      content: formData.content,
      platform: formData.platform,
      scheduledAt: formData.scheduledAt,
      workspaceId: currentWorkspace?.id,
      hashtags,
      mentions
    });
  };

  const getMinDateTime = () => {
    const now = new Date();
    now.setMinutes(now.getMinutes() + 5); // Minimum 5 minutes from now
    return now.toISOString().slice(0, 16);
  };

  const formatScheduledTime = (dateString: string) => {
    try {
      return format(new Date(dateString), "MMM dd, yyyy 'at' hh:mm a");
    } catch {
      return dateString;
    }
  };

  const getConnectedPlatforms = () => {
    return socialAccounts
      .filter(account => account.isActive)
      .map(account => account.platform)
      .filter((platform, index, self) => self.indexOf(platform) === index);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
            Content Scheduler
          </h1>
          <p className="text-gray-600 mt-2">
            Schedule and manage your social media content across platforms
          </p>
        </div>
        
        <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
          <DialogTrigger asChild>
            <Button className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700">
              <Plus className="w-4 h-4 mr-2" />
              Schedule Content
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Schedule New Content</DialogTitle>
            </DialogHeader>
            
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="title">Title *</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder="Content title"
                  />
                </div>
                
                <div>
                  <Label htmlFor="platform">Platform *</Label>
                  <Select value={formData.platform} onValueChange={(value) => setFormData({ ...formData, platform: value })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select platform" />
                    </SelectTrigger>
                    <SelectContent>
                      {getConnectedPlatforms().map((platform) => {
                        const Icon = platformIcons[platform as keyof typeof platformIcons];
                        return (
                          <SelectItem key={platform} value={platform}>
                            <div className="flex items-center">
                              {Icon && <Icon className="w-4 h-4 mr-2" />}
                              {platform.charAt(0).toUpperCase() + platform.slice(1)}
                            </div>
                          </SelectItem>
                        );
                      })}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div>
                <Label htmlFor="content">Content *</Label>
                <Textarea
                  id="content"
                  value={formData.content}
                  onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                  placeholder="Write your content here..."
                  className="min-h-[100px]"
                />
              </div>
              
              <div>
                <Label htmlFor="scheduledAt">Scheduled Time *</Label>
                <Input
                  id="scheduledAt"
                  type="datetime-local"
                  value={formData.scheduledAt}
                  onChange={(e) => setFormData({ ...formData, scheduledAt: e.target.value })}
                  min={getMinDateTime()}
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="hashtags">Hashtags</Label>
                  <Input
                    id="hashtags"
                    value={formData.hashtags}
                    onChange={(e) => setFormData({ ...formData, hashtags: e.target.value })}
                    placeholder="tag1, tag2, tag3"
                  />
                </div>
                
                <div>
                  <Label htmlFor="mentions">Mentions</Label>
                  <Input
                    id="mentions"
                    value={formData.mentions}
                    onChange={(e) => setFormData({ ...formData, mentions: e.target.value })}
                    placeholder="@user1, @user2"
                  />
                </div>
              </div>
              
              <div className="flex justify-end space-x-2 pt-4">
                <Button variant="outline" onClick={() => setIsCreateOpen(false)}>
                  Cancel
                </Button>
                <Button 
                  onClick={handleCreateContent}
                  disabled={createContentMutation.isPending}
                  className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
                >
                  {createContentMutation.isPending ? "Scheduling..." : "Schedule Content"}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Calendar className="w-5 h-5 text-blue-500" />
              <div>
                <p className="text-sm text-gray-600">Total Scheduled</p>
                <p className="text-xl font-bold">{scheduledContent.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Clock className="w-5 h-5 text-orange-500" />
              <div>
                <p className="text-sm text-gray-600">Today</p>
                <p className="text-xl font-bold">
                  {scheduledContent.filter(content => {
                    const today = new Date().toDateString();
                    return new Date(content.scheduledAt).toDateString() === today;
                  }).length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <CheckCircle2 className="w-5 h-5 text-green-500" />
              <div>
                <p className="text-sm text-gray-600">Connected Platforms</p>
                <p className="text-xl font-bold">{getConnectedPlatforms().length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <PlayCircle className="w-5 h-5 text-purple-500" />
              <div>
                <p className="text-sm text-gray-600">This Week</p>
                <p className="text-xl font-bold">
                  {scheduledContent.filter(content => {
                    const weekFromNow = new Date();
                    weekFromNow.setDate(weekFromNow.getDate() + 7);
                    const scheduledDate = new Date(content.scheduledAt);
                    return scheduledDate >= new Date() && scheduledDate <= weekFromNow;
                  }).length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Scheduled Content List */}
      <Card>
        <CardHeader>
          <CardTitle>Scheduled Content</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" />
            </div>
          ) : scheduledContent.length === 0 ? (
            <div className="text-center py-8">
              <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No Scheduled Content</h3>
              <p className="text-gray-600 mb-4">Start scheduling your content to manage your social media presence</p>
              <Button 
                onClick={() => setIsCreateOpen(true)}
                className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
              >
                <Plus className="w-4 h-4 mr-2" />
                Schedule Your First Content
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {scheduledContent.map((content: ScheduledContent) => {
                const Icon = platformIcons[content.platform as keyof typeof platformIcons];
                const platformColor = platformColors[content.platform as keyof typeof platformColors];
                const statusColor = statusColors[content.status as keyof typeof statusColors];
                
                return (
                  <div key={content.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          {Icon && <Icon className={`w-5 h-5 ${platformColor}`} />}
                          <h3 className="font-medium text-gray-900">{content.title}</h3>
                          <Badge className={statusColor}>{content.status}</Badge>
                        </div>
                        
                        <p className="text-gray-600 mb-3 line-clamp-2">{content.description}</p>
                        
                        <div className="flex items-center space-x-4 text-sm text-gray-500">
                          <div className="flex items-center space-x-1">
                            <Calendar className="w-4 h-4" />
                            <span>{formatScheduledTime(content.scheduledAt)}</span>
                          </div>
                          
                          {content.metadata?.hashtags && content.metadata.hashtags.length > 0 && (
                            <div className="flex items-center space-x-1">
                              <span className="text-blue-500">#</span>
                              <span>{content.metadata.hashtags.length} hashtags</span>
                            </div>
                          )}
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-2 ml-4">
                        <Button variant="outline" size="sm">
                          <Eye className="w-4 h-4" />
                        </Button>
                        <Button variant="outline" size="sm">
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => deleteContentMutation.mutate(content.id)}
                          disabled={deleteContentMutation.isPending}
                        >
                          <Trash2 className="w-4 h-4 text-red-500" />
                        </Button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Connection Warning */}
      {getConnectedPlatforms().length === 0 && (
        <Card className="border-orange-200 bg-orange-50">
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <AlertCircle className="w-5 h-5 text-orange-500" />
              <div>
                <h3 className="font-medium text-orange-800">No Social Accounts Connected</h3>
                <p className="text-sm text-orange-700 mt-1">
                  Connect your social media accounts to start scheduling content. 
                  <a href="/integrations" className="underline ml-1">Go to Integrations</a>
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}