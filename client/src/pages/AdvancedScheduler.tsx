import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Switch } from "@/components/ui/switch";
import { Progress } from "@/components/ui/progress";
import { useAuth } from "@/hooks/useAuth";
import { useWorkspace } from "@/hooks/useWorkspace";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { BulkScheduler } from "@/components/scheduler/BulkScheduler";
import { 
  Calendar as CalendarIcon,
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
  CheckCircle2,
  Upload,
  FileText,
  Target,
  BarChart3,
  Settings,
  Zap,
  Globe,
  Users,
  TrendingUp,
  Copy,
  Download,
  Filter,
  Search,
  MoreHorizontal,
  ChevronLeft,
  ChevronRight
} from "lucide-react";
import { format, addDays, startOfWeek, endOfWeek, isSameDay, parseISO } from "date-fns";

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

interface ContentTemplate {
  id: string;
  name: string;
  description: string;
  platform: string;
  type: string;
  template: string;
  hashtags: string[];
  variables: string[];
}

const platformIcons = {
  instagram: Instagram,
  youtube: Youtube,
  facebook: Facebook,
  twitter: Twitter
};

const platformColors = {
  instagram: "text-pink-500 bg-pink-50 border-pink-200",
  youtube: "text-red-500 bg-red-50 border-red-200",
  facebook: "text-blue-500 bg-blue-50 border-blue-200",
  twitter: "text-blue-400 bg-blue-50 border-blue-200"
};

const statusColors = {
  scheduled: "bg-blue-100 text-blue-800",
  published: "bg-green-100 text-green-800",
  failed: "bg-red-100 text-red-800",
  draft: "bg-gray-100 text-gray-800"
};

const contentTemplates: ContentTemplate[] = [
  {
    id: "1",
    name: "Product Launch",
    description: "Template for announcing new products",
    platform: "instagram",
    type: "post",
    template: "🚀 Introducing {product_name}! \n\n{product_description}\n\n✨ Key features:\n• {feature_1}\n• {feature_2}\n• {feature_3}\n\nAvailable now! Link in bio 👆",
    hashtags: ["product", "launch", "new", "innovation"],
    variables: ["product_name", "product_description", "feature_1", "feature_2", "feature_3"]
  },
  {
    id: "2",
    name: "Behind the Scenes",
    description: "Show your work process",
    platform: "instagram",
    type: "story",
    template: "Behind the scenes at {company_name} 🎬\n\nToday we're working on {project_name}. The team is {activity_description}.\n\n{fun_fact}",
    hashtags: ["behindthescenes", "work", "team", "process"],
    variables: ["company_name", "project_name", "activity_description", "fun_fact"]
  },
  {
    id: "3",
    name: "Educational Content",
    description: "Share knowledge and tips",
    platform: "youtube",
    type: "video",
    template: "📚 Today's tip: {tip_title}\n\n{tip_description}\n\n💡 Pro tip: {pro_tip}\n\nWhat would you like to learn next? Let us know in the comments!",
    hashtags: ["education", "tips", "learning", "knowledge"],
    variables: ["tip_title", "tip_description", "pro_tip"]
  }
];

export default function AdvancedScheduler() {
  const { user } = useAuth();
  const { currentWorkspace } = useWorkspace();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  const [activeTab, setActiveTab] = useState("calendar");
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [currentWeek, setCurrentWeek] = useState(new Date());
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isBulkOpen, setIsBulkOpen] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<ContentTemplate | null>(null);
  const [viewMode, setViewMode] = useState<"calendar" | "list" | "grid">("calendar");
  const [filterPlatform, setFilterPlatform] = useState<string>("all");
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
  
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    platform: "",
    type: "post",
    scheduledAt: "",
    hashtags: "",
    mentions: "",
    mediaFile: null as File | null,
    useTemplate: false,
    templateVariables: {} as Record<string, string>
  });

  // Fetch scheduled content
  const { data: scheduledContent = [], isLoading } = useQuery({
    queryKey: ['scheduled-content', currentWorkspace?.id],
    queryFn: async () => {
      if (!currentWorkspace?.id) return [];
      
      const response = await apiRequest('GET', `/api/scheduled-content`);
      const data = await response.json();
      return data || [];
    },
    enabled: !!currentWorkspace?.id
  });

  // Fetch social accounts
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
      const formDataToSend = new FormData();
      
      Object.keys(data).forEach(key => {
        if (key === 'mediaFile' && data[key]) {
          formDataToSend.append('media', data[key]);
        } else if (typeof data[key] === 'object') {
          formDataToSend.append(key, JSON.stringify(data[key]));
        } else {
          formDataToSend.append(key, data[key]);
        }
      });

      const response = await apiRequest('POST', '/api/content', {
        body: formDataToSend
      });
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['scheduled-content'] });
      toast({
        title: "Content Scheduled",
        description: "Your content has been successfully scheduled.",
      });
      setIsCreateOpen(false);
      resetForm();
    },
    onError: (error: any) => {
      toast({
        title: "Scheduling Failed",
        description: error.message || "Failed to schedule content",
        variant: "destructive",
      });
    }
  });

  // Delete content mutation
  const deleteContentMutation = useMutation({
    mutationFn: async (contentId: string) => {
      const response = await apiRequest('DELETE', `/api/content/${contentId}`);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['scheduled-content'] });
      toast({
        title: "Content Deleted",
        description: "Scheduled content has been removed.",
      });
    }
  });

  // Duplicate content mutation
  const duplicateContentMutation = useMutation({
    mutationFn: async (content: ScheduledContent) => {
      const duplicateData = {
        ...content,
        title: `${content.title} (Copy)`,
        scheduledAt: new Date(Date.now() + 60 * 60 * 1000).toISOString(), // 1 hour from now
        workspaceId: currentWorkspace?.id
      };
      delete duplicateData.id;
      
      const response = await apiRequest('POST', '/api/content', {
        body: JSON.stringify(duplicateData)
      });
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['scheduled-content'] });
      toast({
        title: "Content Duplicated",
        description: "Content has been duplicated and scheduled for 1 hour from now.",
      });
    }
  });

  const resetForm = () => {
    setFormData({
      title: "",
      content: "",
      platform: "",
      type: "post",
      scheduledAt: "",
      hashtags: "",
      mentions: "",
      mediaFile: null,
      useTemplate: false,
      templateVariables: {}
    });
    setSelectedTemplate(null);
  };

  const handleCreateContent = () => {
    if (!formData.title || !formData.content || !formData.platform || !formData.scheduledAt) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    let finalContent = formData.content;
    
    // Apply template variables if using template
    if (formData.useTemplate && selectedTemplate) {
      finalContent = selectedTemplate.template;
      Object.entries(formData.templateVariables).forEach(([key, value]) => {
        finalContent = finalContent.replace(new RegExp(`{${key}}`, 'g'), value);
      });
    }

    const hashtags = formData.hashtags ? formData.hashtags.split(',').map(h => h.trim()) : [];
    const mentions = formData.mentions ? formData.mentions.split(',').map(m => m.trim()) : [];

    createContentMutation.mutate({
      title: formData.title,
      description: finalContent,
      platform: formData.platform,
      type: formData.type,
      scheduledAt: formData.scheduledAt,
      workspaceId: currentWorkspace?.id,
      metadata: {
        hashtags,
        mentions
      },
      mediaFile: formData.mediaFile
    });
  };

  const applyTemplate = (template: ContentTemplate) => {
    setSelectedTemplate(template);
    setFormData(prev => ({
      ...prev,
      content: template.template,
      platform: template.platform,
      type: template.type,
      hashtags: template.hashtags.join(', '),
      useTemplate: true,
      templateVariables: template.variables.reduce((acc, variable) => {
        acc[variable] = '';
        return acc;
      }, {} as Record<string, string>)
    }));
  };

  const getMinDateTime = () => {
    const now = new Date();
    now.setMinutes(now.getMinutes() + 5);
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

  const getContentForDate = (date: Date) => {
    return scheduledContent.filter(content => 
      isSameDay(new Date(content.scheduledAt), date)
    );
  };

  const getMonthDays = () => {
    const year = currentWeek.getFullYear();
    const month = currentWeek.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = (firstDay.getDay() + 6) % 7; // Adjust for Monday start

    const days = [];
    const today = new Date();

    // Add days from previous month
    const prevMonth = new Date(year, month - 1, 0);
    for (let i = startingDayOfWeek - 1; i >= 0; i--) {
      const date = prevMonth.getDate() - i;
      days.push({
        date: new Date(year, month - 1, date),
        isCurrentMonth: false,
        isToday: false
      });
    }

    // Add days from current month
    for (let date = 1; date <= daysInMonth; date++) {
      const fullDate = new Date(year, month, date);
      const isToday = fullDate.toDateString() === today.toDateString();
      
      days.push({
        date: fullDate,
        isCurrentMonth: true,
        isToday
      });
    }

    // Add days from next month to fill the grid
    const remainingDays = 42 - days.length; // 6 rows × 7 days
    for (let date = 1; date <= remainingDays; date++) {
      days.push({
        date: new Date(year, month + 1, date),
        isCurrentMonth: false,
        isToday: false
      });
    }

    return days;
  };

  const filteredContent = scheduledContent.filter(content => {
    const matchesPlatform = filterPlatform === "all" || content.platform === filterPlatform;
    const matchesStatus = filterStatus === "all" || content.status === filterStatus;
    const matchesSearch = searchQuery === "" || 
      content.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      content.description.toLowerCase().includes(searchQuery.toLowerCase());
    
    return matchesPlatform && matchesStatus && matchesSearch;
  });

  const getStats = () => {
    const total = scheduledContent.length;
    const today = scheduledContent.filter(content => {
      const today = new Date().toDateString();
      return new Date(content.scheduledAt).toDateString() === today;
    }).length;
    const thisWeek = scheduledContent.filter(content => {
      const weekFromNow = new Date();
      weekFromNow.setDate(weekFromNow.getDate() + 7);
      const scheduledDate = new Date(content.scheduledAt);
      return scheduledDate >= new Date() && scheduledDate <= weekFromNow;
    }).length;
    const published = scheduledContent.filter(content => content.status === 'published').length;
    
    return { total, today, thisWeek, published };
  };

  const stats = getStats();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold text-electric-cyan font-orbitron neon-text">
            Advanced Content Scheduler
          </h1>
          <p className="text-asteroid-silver mt-2">
            Schedule, manage, and optimize your social media content with advanced tools
          </p>
        </div>
        
        <div className="flex space-x-3">
          <Button 
            variant="outline"
            onClick={() => setIsBulkOpen(true)}
          >
            <Upload className="w-4 h-4 mr-2" />
            Bulk Schedule
          </Button>
          
          <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
            <DialogTrigger asChild>
              <Button className="bg-gradient-to-r from-electric-cyan to-blue-500 hover:opacity-90 text-black font-medium">
                <Plus className="w-4 h-4 mr-2" />
                Schedule Content
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto glassmorphism border-electric-cyan/20">
              <DialogHeader>
                <DialogTitle>Schedule New Content</DialogTitle>
              </DialogHeader>
              
              <Tabs defaultValue="create" className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="create">Create New</TabsTrigger>
                  <TabsTrigger value="template">Use Template</TabsTrigger>
                </TabsList>
                
                <TabsContent value="create" className="space-y-4">
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
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="type">Content Type</Label>
                      <Select value={formData.type} onValueChange={(value) => setFormData({ ...formData, type: value })}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="post">Post</SelectItem>
                          <SelectItem value="story">Story</SelectItem>
                          <SelectItem value="reel">Reel</SelectItem>
                          <SelectItem value="video">Video</SelectItem>
                        </SelectContent>
                      </Select>
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
                  </div>
                  
                  <div>
                    <Label htmlFor="content">Content *</Label>
                    <Textarea
                      id="content"
                      value={formData.content}
                      onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                      placeholder="Write your content here..."
                      className="min-h-[120px]"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="media">Media File (Optional)</Label>
                    <Input
                      id="media"
                      type="file"
                      accept="image/*,video/*"
                      onChange={(e) => setFormData({ ...formData, mediaFile: e.target.files?.[0] || null })}
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
                </TabsContent>
                
                <TabsContent value="template" className="space-y-4">
                  <div className="grid grid-cols-1 gap-4 max-h-[400px] overflow-y-auto">
                    {contentTemplates.map((template) => {
                      const Icon = platformIcons[template.platform as keyof typeof platformIcons];
                      return (
                        <Card 
                          key={template.id} 
                          className={`cursor-pointer transition-all hover:shadow-md ${
                            selectedTemplate?.id === template.id ? 'ring-2 ring-purple-500' : ''
                          }`}
                          onClick={() => applyTemplate(template)}
                        >
                          <CardContent className="p-4">
                            <div className="flex items-start justify-between">
                              <div className="flex-1">
                                <div className="flex items-center space-x-2 mb-2">
                                  {Icon && <Icon className="w-4 h-4" />}
                                  <h3 className="font-medium">{template.name}</h3>
                                  <Badge variant="outline">{template.type}</Badge>
                                </div>
                                <p className="text-sm text-gray-600 mb-2">{template.description}</p>
                                <div className="flex flex-wrap gap-1">
                                  {template.hashtags.map((tag, index) => (
                                    <Badge key={index} variant="secondary" className="text-xs">
                                      #{tag}
                                    </Badge>
                                  ))}
                                </div>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      );
                    })}
                  </div>
                  
                  {selectedTemplate && (
                    <div className="space-y-4 border-t pt-4">
                      <h4 className="font-medium">Template Variables</h4>
                      <div className="grid grid-cols-2 gap-4">
                        {selectedTemplate.variables.map((variable) => (
                          <div key={variable}>
                            <Label htmlFor={variable}>{variable.replace(/_/g, ' ').toUpperCase()}</Label>
                            <Input
                              id={variable}
                              value={formData.templateVariables[variable] || ''}
                              onChange={(e) => setFormData({
                                ...formData,
                                templateVariables: {
                                  ...formData.templateVariables,
                                  [variable]: e.target.value
                                }
                              })}
                              placeholder={`Enter ${variable.replace(/_/g, ' ')}`}
                            />
                          </div>
                        ))}
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="template-scheduled">Scheduled Time *</Label>
                          <Input
                            id="template-scheduled"
                            type="datetime-local"
                            value={formData.scheduledAt}
                            onChange={(e) => setFormData({ ...formData, scheduledAt: e.target.value })}
                            min={getMinDateTime()}
                          />
                        </div>
                        
                        <div>
                          <Label htmlFor="template-title">Title *</Label>
                          <Input
                            id="template-title"
                            value={formData.title}
                            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                            placeholder="Content title"
                          />
                        </div>
                      </div>
                    </div>
                  )}
                </TabsContent>
              </Tabs>
              
              <div className="flex justify-end space-x-2 pt-4 border-t">
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
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="content-card holographic">
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <CalendarIcon className="w-5 h-5 text-electric-cyan" />
              <div>
                <p className="text-sm text-asteroid-silver">Total Scheduled</p>
                <p className="text-xl font-bold text-white">{stats.total}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="content-card holographic">
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Clock className="w-5 h-5 text-solar-gold" />
              <div>
                <p className="text-sm text-asteroid-silver">Today</p>
                <p className="text-xl font-bold text-white">{stats.today}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="content-card holographic">
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <CheckCircle2 className="w-5 h-5 text-green-400" />
              <div>
                <p className="text-sm text-asteroid-silver">Published</p>
                <p className="text-xl font-bold text-white">{stats.published}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="content-card holographic">
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <TrendingUp className="w-5 h-5 text-nebula-purple" />
              <div>
                <p className="text-sm text-asteroid-silver">This Week</p>
                <p className="text-xl font-bold text-white">{stats.thisWeek}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <div className="flex justify-between items-center">
          <TabsList className="grid w-fit grid-cols-3 glassmorphism">
            <TabsTrigger value="calendar" className="data-[state=active]:bg-electric-cyan data-[state=active]:text-black">Calendar View</TabsTrigger>
            <TabsTrigger value="list" className="data-[state=active]:bg-electric-cyan data-[state=active]:text-black">List View</TabsTrigger>
            <TabsTrigger value="analytics" className="data-[state=active]:bg-electric-cyan data-[state=active]:text-black">Analytics</TabsTrigger>
          </TabsList>
          
          <div className="flex items-center space-x-2">
            <div className="flex items-center space-x-2">
              <Search className="w-4 h-4 text-gray-400" />
              <Input
                placeholder="Search content..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-48 glassmorphism"
              />
            </div>
            
            <Select value={filterPlatform} onValueChange={setFilterPlatform}>
              <SelectTrigger className="w-32 glassmorphism">
                <SelectValue placeholder="Platform" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Platforms</SelectItem>
                {getConnectedPlatforms().map((platform) => (
                  <SelectItem key={platform} value={platform}>
                    {platform.charAt(0).toUpperCase() + platform.slice(1)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger className="w-32 glassmorphism">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="scheduled">Scheduled</SelectItem>
                <SelectItem value="published">Published</SelectItem>
                <SelectItem value="failed">Failed</SelectItem>
                <SelectItem value="draft">Draft</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <TabsContent value="calendar" className="space-y-4">
          <Card className="content-card holographic">
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle className="text-electric-cyan font-orbitron">Monthly Calendar</CardTitle>
                <div className="flex items-center space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentWeek(new Date(currentWeek.getFullYear(), currentWeek.getMonth() - 1, 1))}
                    className="glassmorphism"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </Button>
                  <span className="text-sm font-medium text-white">
                    {format(currentWeek, 'MMMM yyyy')}
                  </span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentWeek(new Date(currentWeek.getFullYear(), currentWeek.getMonth() + 1, 1))}
                    className="glassmorphism"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentWeek(new Date())}
                    className="glassmorphism text-electric-cyan"
                  >
                    Today
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {/* Day Headers */}
              <div className="grid grid-cols-7 gap-2 mb-4">
                {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day) => (
                  <div key={day} className="text-center py-2 text-asteroid-silver font-medium text-sm border-b border-space-gray">
                    {day}
                  </div>
                ))}
              </div>
              
              {/* Calendar Grid */}
              <div className="grid grid-cols-7 gap-2">
                {getMonthDays().map((dayObj, index) => {
                  const dayContent = getContentForDate(dayObj.date);
                  
                  return (
                    <div
                      key={index}
                      className={`min-h-[120px] border rounded-lg p-2 glassmorphism cursor-pointer hover:border-electric-cyan/50 transition-all ${
                        dayObj.isToday 
                          ? 'border-electric-cyan bg-electric-cyan/10' 
                          : dayObj.isCurrentMonth 
                            ? 'border-space-gray' 
                            : 'border-space-gray/30 opacity-40'
                      }`}
                      onClick={() => dayObj.isCurrentMonth && setIsCreateOpen(true)}
                    >
                      <div className="flex justify-between items-center mb-1">
                        <span className={`text-sm font-medium ${
                          dayObj.isToday 
                            ? 'text-electric-cyan' 
                            : dayObj.isCurrentMonth 
                              ? 'text-white' 
                              : 'text-asteroid-silver'
                        }`}>
                          {format(dayObj.date, 'd')}
                        </span>
                        {dayContent.length > 0 && (
                          <Badge variant="secondary" className="text-xs h-4 w-4 rounded-full p-0 flex items-center justify-center bg-electric-cyan text-black">
                            {dayContent.length}
                          </Badge>
                        )}
                      </div>
                      
                      <div className="space-y-1">
                        {dayContent.slice(0, 2).map((content) => {
                          const Icon = platformIcons[content.platform as keyof typeof platformIcons];
                          
                          return (
                            <div
                              key={content.id}
                              className="text-xs p-1 rounded bg-cosmic-blue/30 border border-electric-cyan/20 cursor-pointer hover:bg-cosmic-blue/50 transition-colors"
                              title={`${content.title} - ${format(new Date(content.scheduledAt), 'HH:mm')}`}
                            >
                              <div className="flex items-center space-x-1">
                                {Icon && <Icon className="w-3 h-3 text-electric-cyan" />}
                                <span className="font-medium truncate text-white text-xs">{content.title}</span>
                              </div>
                              <div className="text-asteroid-silver text-xs">
                                {format(new Date(content.scheduledAt), 'HH:mm')}
                              </div>
                            </div>
                          );
                        })}
                        
                        {dayContent.length > 2 && (
                          <div className="text-xs text-electric-cyan text-center py-1">
                            +{dayContent.length - 2}
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="list" className="space-y-4">
          <Card className="content-card holographic">
            <CardHeader>
              <CardTitle className="text-electric-cyan font-orbitron">Scheduled Content</CardTitle>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="flex items-center justify-center py-8">
                  <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" />
                </div>
              ) : filteredContent.length === 0 ? (
                <div className="text-center py-8">
                  <CalendarIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No Content Found</h3>
                  <p className="text-gray-600 mb-4">
                    {searchQuery || filterPlatform !== "all" || filterStatus !== "all" 
                      ? "Try adjusting your filters or search terms"
                      : "Start scheduling your content to manage your social media presence"
                    }
                  </p>
                  <Button 
                    onClick={() => setIsCreateOpen(true)}
                    className="bg-gradient-to-r from-electric-cyan to-blue-500 hover:opacity-90 text-black font-medium"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Schedule Content
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  {filteredContent.map((content: ScheduledContent) => {
                    const Icon = platformIcons[content.platform as keyof typeof platformIcons];
                    const platformColor = platformColors[content.platform as keyof typeof platformColors];
                    const statusColor = statusColors[content.status as keyof typeof statusColors];
                    
                    return (
                      <div key={content.id} className="border border-space-gray rounded-lg p-4 hover:border-electric-cyan/50 transition-all glassmorphism">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center space-x-3 mb-2">
                              {Icon && <Icon className="w-5 h-5" />}
                              <h3 className="font-medium text-white">{content.title}</h3>
                              <Badge className={statusColor}>{content.status}</Badge>
                              <Badge variant="outline">{content.type}</Badge>
                            </div>
                            
                            <p className="text-asteroid-silver mb-3 line-clamp-2">{content.description}</p>
                            
                            <div className="flex items-center space-x-4 text-sm text-asteroid-silver">
                              <div className="flex items-center space-x-1">
                                <CalendarIcon className="w-4 h-4" />
                                <span>{formatScheduledTime(content.scheduledAt)}</span>
                              </div>
                              
                              {content.metadata?.hashtags && (
                                <div className="flex items-center space-x-1">
                                  <span className="text-electric-cyan">#</span>
                                  <span>{content.metadata.hashtags.length} hashtags</span>
                                </div>
                              )}
                              
                              {content.mediaUrl && (
                                <div className="flex items-center space-x-1">
                                  <FileText className="w-4 h-4" />
                                  <span>Media attached</span>
                                </div>
                              )}
                            </div>
                          </div>
                          
                          <div className="flex items-center space-x-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => duplicateContentMutation.mutate(content)}
                              disabled={duplicateContentMutation.isPending}
                            >
                              <Copy className="w-4 h-4" />
                            </Button>
                            
                            <Button
                              variant="ghost"
                              size="sm"
                            >
                              <Edit className="w-4 h-4" />
                            </Button>
                            
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => deleteContentMutation.mutate(content.id)}
                              disabled={deleteContentMutation.isPending}
                            >
                              <Trash2 className="w-4 h-4" />
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
        </TabsContent>

        <TabsContent value="analytics" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Content Performance</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Success Rate</span>
                    <span className="text-lg font-bold text-green-600">
                      {stats.total > 0 ? Math.round((stats.published / stats.total) * 100) : 0}%
                    </span>
                  </div>
                  <Progress value={stats.total > 0 ? (stats.published / stats.total) * 100 : 0} className="w-full" />
                  
                  <div className="grid grid-cols-2 gap-4 text-center">
                    <div>
                      <div className="text-2xl font-bold text-green-600">{stats.published}</div>
                      <div className="text-sm text-gray-600">Published</div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-blue-600">{stats.total - stats.published}</div>
                      <div className="text-sm text-gray-600">Pending</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Platform Distribution</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {getConnectedPlatforms().map((platform) => {
                    const count = scheduledContent.filter(c => c.platform === platform).length;
                    const percentage = stats.total > 0 ? (count / stats.total) * 100 : 0;
                    const Icon = platformIcons[platform as keyof typeof platformIcons];
                    
                    return (
                      <div key={platform} className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          {Icon && <Icon className="w-4 h-4" />}
                          <span className="text-sm capitalize">{platform}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <div className="w-16 bg-gray-200 rounded-full h-2">
                            <div 
                              className="bg-blue-600 h-2 rounded-full" 
                              style={{ width: `${percentage}%` }}
                            />
                          </div>
                          <span className="text-sm font-medium">{count}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      {/* Bulk Scheduler Modal */}
      <BulkScheduler 
        isOpen={isBulkOpen}
        onClose={() => setIsBulkOpen(false)}
        workspaceId={currentWorkspace?.id}
      />
    </div>
  );
}