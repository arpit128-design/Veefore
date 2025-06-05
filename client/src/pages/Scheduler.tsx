import { Calendar } from "@/components/scheduler/Calendar";
import { AutomationRules } from "@/components/scheduler/AutomationRules";
import { OptimalTimes } from "@/components/scheduler/OptimalTimes";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { useWorkspace } from "@/hooks/useWorkspace";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Plus, Clock, Calendar as CalendarIcon, BarChart3, Zap, Upload, Image, Video, FileText, Trash2 } from "lucide-react";
import { useState } from "react";

interface ScheduleForm {
  title: string;
  description: string;
  type: string;
  platform: string;
  scheduledDate: string;
  scheduledTime: string;
  mediaUrl: string;
  useAIGenerated: boolean;
  aiPrompt: string;
}

export default function Scheduler() {
  const { currentWorkspace } = useWorkspace();
  const [isScheduleDialogOpen, setIsScheduleDialogOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [activeTab, setActiveTab] = useState("calendar");
  const [isBulkMode, setIsBulkMode] = useState(false);
  const [scheduleForm, setScheduleForm] = useState<ScheduleForm>({
    title: "",
    description: "",
    type: "post",
    platform: "instagram",
    scheduledDate: "",
    scheduledTime: "09:00",
    mediaUrl: "",
    useAIGenerated: false,
    aiPrompt: ""
  });
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [isGeneratingAI, setIsGeneratingAI] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: scheduledContent } = useQuery({
    queryKey: ['scheduled-content', currentWorkspace?.id],
    queryFn: async () => {
      const response = await apiRequest('GET', `/api/content?workspaceId=${currentWorkspace?.id}&status=scheduled`);
      return response.json();
    },
    enabled: !!currentWorkspace?.id
  });

  const { data: analytics } = useQuery({
    queryKey: ['analytics', currentWorkspace?.id],
    queryFn: async () => {
      const response = await apiRequest('GET', `/api/analytics?workspaceId=${currentWorkspace?.id}&days=30`);
      return response.json();
    },
    enabled: !!currentWorkspace?.id
  });

  const { data: automationRules } = useQuery({
    queryKey: ['automation-rules', currentWorkspace?.id],
    queryFn: async () => {
      const response = await apiRequest('GET', `/api/automation-rules?workspaceId=${currentWorkspace?.id}`);
      return response.json();
    },
    enabled: !!currentWorkspace?.id
  });

  const createContentMutation = useMutation({
    mutationFn: async (contentData: any) => {
      const response = await apiRequest('POST', '/api/content', {
        body: JSON.stringify(contentData)
      });
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['scheduled-content'] });
      toast({
        title: "Content scheduled",
        description: "Your content has been scheduled successfully."
      });
      setIsScheduleDialogOpen(false);
      resetScheduleForm();
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to schedule content. Please try again.",
        variant: "destructive"
      });
    }
  });

  const deleteContentMutation = useMutation({
    mutationFn: async (contentId: number) => {
      const response = await apiRequest('DELETE', `/api/content/${contentId}`);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['scheduled-content'] });
      toast({
        title: "Content deleted",
        description: "Scheduled content has been removed successfully."
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to delete scheduled content.",
        variant: "destructive"
      });
    }
  });

  const resetScheduleForm = () => {
    setScheduleForm({
      title: "",
      description: "",
      type: "post",
      platform: "instagram",
      scheduledDate: "",
      scheduledTime: "09:00",
      mediaUrl: "",
      useAIGenerated: false,
      aiPrompt: ""
    });
    setUploadedFile(null);
  };

  const handleScheduleContent = (date?: Date) => {
    setSelectedDate(date || null);
    if (date) {
      setScheduleForm(prev => ({
        ...prev,
        scheduledDate: date.toISOString().split('T')[0]
      }));
    }
    setIsScheduleDialogOpen(true);
  };

  const handleBulkUpload = () => {
    setIsBulkMode(true);
    setIsScheduleDialogOpen(true);
  };

  const handleDeleteContent = (contentId: number) => {
    deleteContentMutation.mutate(contentId);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setUploadedFile(file);
      // Create object URL for preview
      const objectUrl = URL.createObjectURL(file);
      setScheduleForm(prev => ({ ...prev, mediaUrl: objectUrl }));
    }
  };

  const generateAIContent = async () => {
    if (!scheduleForm.aiPrompt.trim()) {
      toast({
        title: "Missing prompt",
        description: "Please enter a description for AI image generation.",
        variant: "destructive"
      });
      return;
    }

    setIsGeneratingAI(true);
    try {
      const response = await apiRequest('POST', '/api/generate-image', {
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ prompt: scheduleForm.aiPrompt.trim() })
      });
      const result = await response.json();
      
      if (result.success && result.imageUrl) {
        setScheduleForm(prev => ({ ...prev, mediaUrl: result.imageUrl }));
        toast({
          title: "AI content generated",
          description: "Your AI-generated image is ready for scheduling."
        });
      } else {
        throw new Error(result.error || "Failed to generate image");
      }
    } catch (error) {
      console.error('AI generation error:', error);
      toast({
        title: "Generation failed",
        description: "Unable to generate AI content. Please try again or upload your own image.",
        variant: "destructive"
      });
    } finally {
      setIsGeneratingAI(false);
    }
  };

  const generateAICaption = async () => {
    const title = scheduleForm.title.trim() || "social media post";
    const description = scheduleForm.description.trim() || scheduleForm.aiPrompt.trim() || "";
    
    try {
      const response = await apiRequest('POST', '/api/generate-caption', {
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ 
          title: title,
          description: description,
          type: scheduleForm.type,
          platform: scheduleForm.platform
        })
      });
      const result = await response.json();
      
      if (result.success && result.caption) {
        setScheduleForm(prev => ({ 
          ...prev, 
          description: result.caption + (result.hashtags ? '\n\n' + result.hashtags : '')
        }));
        toast({
          title: "AI caption generated",
          description: "Caption and hashtags have been generated for your post."
        });
      } else {
        throw new Error(result.error || "Failed to generate caption");
      }
    } catch (error) {
      console.error('Caption generation error:', error);
      toast({
        title: "Generation failed",
        description: "Unable to generate AI caption. Please write your own caption.",
        variant: "destructive"
      });
    }
  };

  const publishToInstagram = async (contentData: any) => {
    try {
      const response = await apiRequest('POST', '/api/publish-instagram', {
        body: JSON.stringify(contentData)
      });
      const result = await response.json();
      return result;
    } catch (error) {
      throw new Error("Failed to publish to Instagram");
    }
  };

  const handleScheduleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!currentWorkspace?.id || !scheduleForm.title || !scheduleForm.scheduledDate) {
      toast({
        title: "Missing information",
        description: "Please fill in all required fields.",
        variant: "destructive"
      });
      return;
    }

    if (!scheduleForm.mediaUrl && scheduleForm.platform === 'instagram') {
      toast({
        title: "Media required",
        description: "Instagram posts require an image or video. Please upload media or generate AI content.",
        variant: "destructive"
      });
      return;
    }

    const scheduledDateTime = new Date(`${scheduleForm.scheduledDate}T${scheduleForm.scheduledTime}`);
    const now = new Date();

    const contentData = {
      workspaceId: currentWorkspace.id,
      title: scheduleForm.title,
      description: scheduleForm.description,
      type: scheduleForm.type,
      platform: scheduleForm.platform,
      scheduledAt: scheduledDateTime.toISOString(),
      contentData: {
        mediaUrl: scheduleForm.mediaUrl,
        caption: scheduleForm.description,
        isAIGenerated: scheduleForm.useAIGenerated,
        aiPrompt: scheduleForm.aiPrompt
      }
    };

    // If scheduled for immediate posting (within 5 minutes), publish now
    if (scheduledDateTime.getTime() - now.getTime() < 300000 && scheduleForm.platform === 'instagram') {
      try {
        await publishToInstagram(contentData);
        toast({
          title: "Posted to Instagram",
          description: "Your content has been published to Instagram successfully."
        });
      } catch (error) {
        toast({
          title: "Publishing failed",
          description: "Content saved as scheduled. Instagram publishing requires authentication setup.",
          variant: "destructive"
        });
      }
    }

    createContentMutation.mutate(contentData);
  };

  const getContentTypeIcon = (type: string) => {
    switch (type) {
      case 'video': return <Video className="h-4 w-4" />;
      case 'reel': return <Video className="h-4 w-4" />;
      case 'post': return <Image className="h-4 w-4" />;
      case 'story': return <Image className="h-4 w-4" />;
      default: return <FileText className="h-4 w-4" />;
    }
  };

  const getOptimalTimes = () => {
    const platform = scheduleForm.platform;
    switch (platform) {
      case 'instagram':
        return ['09:00', '11:00', '13:00', '17:00', '19:00', '21:00'];
      case 'twitter':
        return ['08:00', '12:00', '15:00', '17:00', '20:00'];
      case 'facebook':
        return ['09:00', '13:00', '15:00', '19:00', '21:00'];
      case 'linkedin':
        return ['08:00', '10:00', '12:00', '14:00', '17:00'];
      default:
        return ['09:00', '12:00', '15:00', '18:00', '21:00'];
    }
  };

  const getSchedulingStats = () => {
    if (!scheduledContent) return { total: 0, thisWeek: 0, nextWeek: 0 };
    
    const now = new Date();
    const weekStart = new Date(now);
    weekStart.setDate(now.getDate() - now.getDay());
    const nextWeekStart = new Date(weekStart);
    nextWeekStart.setDate(weekStart.getDate() + 7);
    const nextWeekEnd = new Date(nextWeekStart);
    nextWeekEnd.setDate(nextWeekStart.getDate() + 7);

    const thisWeek = scheduledContent.filter((content: any) => {
      if (!content.scheduledAt) return false;
      const date = new Date(content.scheduledAt);
      return date >= weekStart && date < nextWeekStart;
    }).length;

    const nextWeek = scheduledContent.filter((content: any) => {
      if (!content.scheduledAt) return false;
      const date = new Date(content.scheduledAt);
      return date >= nextWeekStart && date < nextWeekEnd;
    }).length;

    return {
      total: scheduledContent.length,
      thisWeek,
      nextWeek
    };
  };

  const stats = getSchedulingStats();

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-4xl font-orbitron font-bold neon-text text-solar-gold">
            Mission Scheduler
          </h2>
          <p className="text-asteroid-silver mt-2">
            Orchestrate your content across the digital cosmos
          </p>
        </div>
        <div className="flex items-center space-x-4">
          <Button 
            variant="outline" 
            onClick={handleBulkUpload}
            className="glassmorphism"
          >
            <Upload className="w-4 h-4 mr-2" />
            Bulk Upload
          </Button>
          <Button 
            onClick={() => handleScheduleContent()}
            className="bg-gradient-to-r from-solar-gold to-orange-500 hover:opacity-90 transition-opacity"
          >
            <Plus className="w-4 h-4 mr-2" />
            Schedule Content
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="content-card holographic">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-asteroid-silver">Total Scheduled</p>
                <p className="text-2xl font-bold text-electric-cyan">{stats.total}</p>
              </div>
              <CalendarIcon className="h-8 w-8 text-electric-cyan" />
            </div>
          </CardContent>
        </Card>
        
        <Card className="content-card holographic">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-asteroid-silver">This Week</p>
                <p className="text-2xl font-bold text-solar-gold">{stats.thisWeek}</p>
              </div>
              <Clock className="h-8 w-8 text-solar-gold" />
            </div>
          </CardContent>
        </Card>

        <Card className="content-card holographic">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-asteroid-silver">Next Week</p>
                <p className="text-2xl font-bold text-nebula-purple">{stats.nextWeek}</p>
              </div>
              <BarChart3 className="h-8 w-8 text-nebula-purple" />
            </div>
          </CardContent>
        </Card>

        <Card className="content-card holographic">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-asteroid-silver">Auto Rules</p>
                <p className="text-2xl font-bold text-green-400">{automationRules?.length || 0}</p>
              </div>
              <Zap className="h-8 w-8 text-green-400" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-4 glassmorphism">
          <TabsTrigger value="calendar">Calendar View</TabsTrigger>
          <TabsTrigger value="list">List View</TabsTrigger>
          <TabsTrigger value="automation">Automation</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="calendar" className="space-y-6">
          <Calendar onScheduleContent={handleScheduleContent} />
        </TabsContent>

        <TabsContent value="list" className="space-y-6">
          <Card className="content-card holographic">
            <CardHeader>
              <CardTitle className="text-xl font-orbitron font-semibold neon-text text-electric-cyan">
                Scheduled Content List
              </CardTitle>
            </CardHeader>
            <CardContent>
              {scheduledContent && scheduledContent.length > 0 ? (
                <div className="space-y-4">
                  {scheduledContent.map((content: any) => (
                    <div key={content.id} className="flex items-center space-x-4 p-4 rounded-lg bg-cosmic-blue hover:bg-space-gray transition-colors">
                      <div className="w-12 h-12 rounded-lg bg-gradient-to-r from-electric-cyan/20 to-nebula-purple/20 flex items-center justify-center">
                        <CalendarIcon className="h-5 w-5 text-electric-cyan" />
                      </div>
                      <div className="flex-1">
                        <div className="font-medium">{content.title}</div>
                        <div className="text-sm text-asteroid-silver">
                          {content.platform || 'Multi-platform'} • {content.type}
                        </div>
                        {content.description && (
                          <div className="text-xs text-asteroid-silver mt-1 line-clamp-2">
                            {content.description}
                          </div>
                        )}
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-mono text-solar-gold">
                          {content.scheduledAt ? new Date(content.scheduledAt).toLocaleString() : 'Not scheduled'}
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDeleteContent(content.id)}
                        className="text-red-400 hover:text-red-300"
                      >
                        Delete
                      </Button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <CalendarIcon className="h-16 w-16 text-asteroid-silver mx-auto mb-4" />
                  <p className="text-asteroid-silver text-lg">No content scheduled yet</p>
                  <p className="text-asteroid-silver/60 text-sm">Create your first scheduled post to get started</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="automation" className="space-y-6">
          <AutomationRules />
        </TabsContent>

        <TabsContent value="analytics" className="space-y-6">
          <OptimalTimes />
        </TabsContent>
      </Tabs>

      {/* Schedule Dialog */}
      <Dialog open={isScheduleDialogOpen} onOpenChange={setIsScheduleDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto glassmorphism border-electric-cyan/20">
          <DialogHeader>
            <DialogTitle className="text-2xl font-orbitron font-semibold neon-text text-electric-cyan">
              {isBulkMode ? "Bulk Content Scheduler" : "Schedule New Content"}
            </DialogTitle>
          </DialogHeader>

          {!isBulkMode ? (
            <form onSubmit={handleScheduleSubmit} className="space-y-6">
              {/* Content Details */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="title" className="text-asteroid-silver">Title *</Label>
                  <Input
                    id="title"
                    value={scheduleForm.title}
                    onChange={(e) => setScheduleForm(prev => ({ ...prev, title: e.target.value }))}
                    placeholder="Enter content title..."
                    className="glassmorphism"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="platform" className="text-asteroid-silver">Platform *</Label>
                  <Select value={scheduleForm.platform} onValueChange={(value) => setScheduleForm(prev => ({ ...prev, platform: value }))}>
                    <SelectTrigger className="glassmorphism">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="instagram">Instagram</SelectItem>
                      <SelectItem value="facebook">Facebook</SelectItem>
                      <SelectItem value="twitter">Twitter</SelectItem>
                      <SelectItem value="linkedin">LinkedIn</SelectItem>
                      <SelectItem value="youtube">YouTube</SelectItem>
                      <SelectItem value="tiktok">TikTok</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="description" className="text-asteroid-silver">Caption & Description</Label>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={generateAICaption}
                    className="text-electric-cyan hover:text-white"
                  >
                    <Zap className="w-4 h-4 mr-1" />
                    AI Generate
                  </Button>
                </div>
                <Textarea
                  id="description"
                  value={scheduleForm.description}
                  onChange={(e) => setScheduleForm(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Write your content description or caption... (or use AI Generate)"
                  className="glassmorphism min-h-[100px]"
                />
              </div>

              {/* Content Type */}
              <div className="space-y-2">
                <Label className="text-asteroid-silver">Content Type</Label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                  {[
                    { value: 'post', label: 'Post' },
                    { value: 'story', label: 'Story' },
                    { value: 'reel', label: 'Reel' },
                    { value: 'video', label: 'Video' }
                  ].map((type) => (
                    <Button
                      key={type.value}
                      type="button"
                      variant={scheduleForm.type === type.value ? "default" : "outline"}
                      className={`glassmorphism ${scheduleForm.type === type.value ? 'bg-electric-cyan' : ''}`}
                      onClick={() => setScheduleForm(prev => ({ ...prev, type: type.value }))}
                    >
                      {getContentTypeIcon(type.value)}
                      <span className="ml-2">{type.label}</span>
                    </Button>
                  ))}
                </div>
              </div>

              {/* Media Upload Section */}
              <div className="space-y-4">
                <Label className="text-asteroid-silver">Media Content</Label>
                
                {/* Toggle between Upload and AI Generate */}
                <div className="flex items-center space-x-4">
                  <Button
                    type="button"
                    variant={!scheduleForm.useAIGenerated ? "default" : "outline"}
                    onClick={() => setScheduleForm(prev => ({ ...prev, useAIGenerated: false }))}
                    className="glassmorphism"
                  >
                    <Upload className="w-4 h-4 mr-2" />
                    Upload Media
                  </Button>
                  <Button
                    type="button"
                    variant={scheduleForm.useAIGenerated ? "default" : "outline"}
                    onClick={() => setScheduleForm(prev => ({ ...prev, useAIGenerated: true }))}
                    className="glassmorphism"
                  >
                    <Image className="w-4 h-4 mr-2" />
                    AI Generate
                  </Button>
                </div>

                {!scheduleForm.useAIGenerated ? (
                  // File Upload Section
                  <div className="border-2 border-dashed border-electric-cyan/20 rounded-lg p-6 glassmorphism">
                    <div className="text-center">
                      <Upload className="h-8 w-8 text-asteroid-silver mx-auto mb-2" />
                      <p className="text-asteroid-silver text-sm mb-2">Upload images or videos for your post</p>
                      <input
                        type="file"
                        accept="image/*,video/*"
                        onChange={handleFileUpload}
                        className="hidden"
                        id="media-upload"
                      />
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        className="glassmorphism"
                        onClick={() => document.getElementById('media-upload')?.click()}
                      >
                        Choose File
                      </Button>
                    </div>
                    
                    {scheduleForm.mediaUrl && (
                      <div className="mt-4">
                        <div className="relative w-full h-48 rounded-lg overflow-hidden bg-cosmic-blue">
                          <img 
                            src={scheduleForm.mediaUrl} 
                            alt="Preview" 
                            className="w-full h-full object-cover"
                          />
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              setScheduleForm(prev => ({ ...prev, mediaUrl: "" }));
                              setUploadedFile(null);
                            }}
                            className="absolute top-2 right-2 bg-black/50 text-white hover:bg-black/70"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                        {uploadedFile && (
                          <p className="text-xs text-asteroid-silver mt-2">{uploadedFile.name}</p>
                        )}
                      </div>
                    )}
                  </div>
                ) : (
                  // AI Generation Section
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label className="text-asteroid-silver">AI Image Prompt</Label>
                      <Textarea
                        value={scheduleForm.aiPrompt}
                        onChange={(e) => setScheduleForm(prev => ({ ...prev, aiPrompt: e.target.value }))}
                        placeholder="Describe the image you want to generate (e.g., 'A modern office workspace with plants')"
                        className="glassmorphism"
                      />
                    </div>
                    
                    <Button
                      type="button"
                      onClick={generateAIContent}
                      disabled={isGeneratingAI || !scheduleForm.aiPrompt.trim()}
                      className="bg-gradient-to-r from-nebula-purple to-electric-cyan hover:opacity-90"
                    >
                      {isGeneratingAI ? "Generating..." : "Generate AI Image"}
                    </Button>

                    {scheduleForm.mediaUrl && (
                      <div className="relative w-full h-48 rounded-lg overflow-hidden bg-cosmic-blue">
                        <img 
                          src={scheduleForm.mediaUrl} 
                          alt="AI Generated" 
                          className="w-full h-full object-cover"
                        />
                        <Badge className="absolute top-2 left-2 bg-nebula-purple">
                          AI Generated
                        </Badge>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => setScheduleForm(prev => ({ ...prev, mediaUrl: "" }))}
                          className="absolute top-2 right-2 bg-black/50 text-white hover:bg-black/70"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Scheduling */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-asteroid-silver">Schedule Date *</Label>
                  <Input
                    type="date"
                    value={scheduleForm.scheduledDate}
                    onChange={(e) => setScheduleForm(prev => ({ ...prev, scheduledDate: e.target.value }))}
                    className="glassmorphism"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label className="text-asteroid-silver">Time *</Label>
                  <Select value={scheduleForm.scheduledTime} onValueChange={(value) => setScheduleForm(prev => ({ ...prev, scheduledTime: value }))}>
                    <SelectTrigger className="glassmorphism">
                      <Clock className="mr-2 h-4 w-4" />
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {getOptimalTimes().map((time) => (
                        <SelectItem key={time} value={time}>
                          {time} <Badge variant="secondary" className="ml-2">Optimal</Badge>
                        </SelectItem>
                      ))}
                      {/* Additional times */}
                      {Array.from({ length: 24 }, (_, i) => {
                        const time = `${i.toString().padStart(2, '0')}:00`;
                        if (!getOptimalTimes().includes(time)) {
                          return (
                            <SelectItem key={time} value={time}>
                              {time}
                            </SelectItem>
                          );
                        }
                        return null;
                      })}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Optimal Times Suggestion */}
              {scheduleForm.platform && (
                <Card className="content-card holographic">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-electric-cyan">
                        Optimal posting times for {scheduleForm.platform}
                      </span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {getOptimalTimes().map((time) => (
                        <Badge
                          key={time}
                          variant={scheduleForm.scheduledTime === time ? "default" : "secondary"}
                          className="cursor-pointer"
                          onClick={() => setScheduleForm(prev => ({ ...prev, scheduledTime: time }))}
                        >
                          {time}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Action Buttons */}
              <div className="flex items-center justify-end space-x-4 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setIsScheduleDialogOpen(false);
                    setIsBulkMode(false);
                    resetScheduleForm();
                  }}
                  className="glassmorphism"
                >
                  Cancel
                </Button>
                <Button
                  type="button"
                  onClick={() => handleScheduleSubmit(true)}
                  disabled={createContentMutation.isPending || !scheduleForm.mediaUrl}
                  className="bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:from-purple-600 hover:to-pink-600"
                >
                  {createContentMutation.isPending ? "Publishing..." : "Post Now"}
                </Button>
                <Button
                  type="submit"
                  disabled={createContentMutation.isPending}
                  className="bg-gradient-to-r from-solar-gold to-orange-500 hover:opacity-90"
                >
                  {createContentMutation.isPending ? "Scheduling..." : "Schedule Content"}
                </Button>
              </div>
            </form>
          ) : (
            <div className="space-y-6">
              <div className="text-center py-8">
                <Upload className="h-16 w-16 text-asteroid-silver mx-auto mb-4" />
                <p className="text-asteroid-silver text-lg">Bulk Upload Feature</p>
                <p className="text-asteroid-silver/60 text-sm">Upload CSV files or create multiple posts at once</p>
                <Button
                  className="mt-4 bg-gradient-to-r from-solar-gold to-orange-500 hover:opacity-90"
                  onClick={() => {
                    setIsBulkMode(false);
                    toast({
                      title: "Feature Coming Soon",
                      description: "Bulk upload functionality will be available in the next update."
                    });
                  }}
                >
                  Continue with Single Post
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
