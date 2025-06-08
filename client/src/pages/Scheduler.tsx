import { useState, useRef, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { 
  Calendar as CalendarIcon, 
  Clock, 
  Plus, 
  Upload, 
  Zap, 
  Edit, 
  Trash2, 
  AlertCircle,
  Image as ImageIcon,
  Video,
  FileText,
  BarChart3,
  Settings,
  TrendingUp,
  Hash
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { apiRequest } from '@/lib/queryClient';
import Calendar from '@/components/Calendar';
import PublishingProgressTracker from '@/components/PublishingProgressTracker';

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
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // State management
  const [activeTab, setActiveTab] = useState('overview');
  const [isScheduleDialogOpen, setIsScheduleDialogOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [scheduleForm, setScheduleForm] = useState<ScheduleForm>({
    title: '',
    description: '',
    type: 'post',
    platform: 'instagram',
    scheduledDate: '',
    scheduledTime: '',
    mediaUrl: '',
    useAIGenerated: false,
    aiPrompt: ''
  });
  const [progressState, setProgressState] = useState({
    isVisible: false,
    status: 'preparing' as 'preparing' | 'uploading' | 'processing' | 'scheduling' | 'completed' | 'error',
    progress: 0,
    currentStep: '',
    timeRemaining: ''
  });
  const [isGeneratingAI, setIsGeneratingAI] = useState(false);
  const [isGeneratingCaption, setIsGeneratingCaption] = useState(false);
  const [isGeneratingHashtags, setIsGeneratingHashtags] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [mediaPreviewUrl, setMediaPreviewUrl] = useState<string>('');
  const [selectedContent, setSelectedContent] = useState<any>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

  // Data fetching
  const { data: scheduledContent = [], isLoading: isScheduledLoading } = useQuery({
    queryKey: ['/api/content/scheduled'],
    staleTime: 30000
  });

  const { data: contentMetrics = {} } = useQuery({
    queryKey: ['/api/content/metrics'],
    staleTime: 60000
  });

  // Mutations
  const createContentMutation = useMutation({
    mutationFn: (data: any) => apiRequest('POST', '/api/content/schedule', data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/content/scheduled'] });
      setIsScheduleDialogOpen(false);
      resetForm();
      toast({
        title: "Content Scheduled",
        description: "Your content has been scheduled successfully!"
      });
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
    mutationFn: (id: string) => apiRequest('DELETE', `/api/content/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/content/scheduled'] });
      toast({
        title: "Content Deleted",
        description: "Scheduled content has been removed."
      });
    }
  });

  const updateContentMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) => apiRequest('PUT', `/api/content/${id}`, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/content/scheduled'] });
      setIsEditDialogOpen(false);
      setSelectedContent(null);
      toast({
        title: "Content Updated",
        description: "The scheduled content has been updated."
      });
    }
  });

  // Helper functions
  const resetForm = () => {
    setScheduleForm({
      title: '',
      description: '',
      type: 'post',
      platform: 'instagram',
      scheduledDate: '',
      scheduledTime: '',
      mediaUrl: '',
      useAIGenerated: false,
      aiPrompt: ''
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

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setUploadedFile(file);
      const url = URL.createObjectURL(file);
      setMediaPreviewUrl(url);
      setScheduleForm(prev => ({ ...prev, mediaUrl: url }));
    }
  };

  const getFileType = (file: File | string) => {
    if (typeof file === 'string') {
      if (file.includes('.mp4') || file.includes('.mov') || file.includes('.avi')) return 'video';
      return 'image';
    }
    return file.type.startsWith('video/') ? 'video' : 'image';
  };

  const MediaPreview = ({ src, fileType }: { src: string; fileType: string }) => {
    if (fileType === 'video') {
      return (
        <video 
          src={src} 
          controls 
          className="w-full h-48 object-cover rounded-lg"
          preload="metadata"
        >
          Your browser does not support video playback.
        </video>
      );
    }
    return (
      <img 
        src={src} 
        alt="Media preview" 
        className="w-full h-48 object-cover rounded-lg"
      />
    );
  };

  const generateAIContent = async () => {
    if (!scheduleForm.aiPrompt) return;
    
    setIsGeneratingAI(true);
    try {
      const response = await apiRequest('POST', '/api/ai/generate-image', {
        prompt: scheduleForm.aiPrompt
      });
      const data = await response.json();
      setScheduleForm(prev => ({ ...prev, mediaUrl: data.imageUrl }));
      toast({
        title: "Image Generated",
        description: "AI image has been generated successfully!"
      });
    } catch (error) {
      toast({
        title: "Generation Failed",
        description: "Failed to generate AI image. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsGeneratingAI(false);
    }
  };

  const generateAICaption = async () => {
    if (!scheduleForm.title && !scheduleForm.mediaUrl) {
      toast({
        title: "Missing Content",
        description: "Please provide a title or upload media to generate a caption.",
        variant: "destructive"
      });
      return;
    }

    setIsGeneratingCaption(true);
    try {
      const response = await apiRequest('POST', '/api/ai/generate-caption', {
        title: scheduleForm.title,
        type: scheduleForm.type,
        platform: scheduleForm.platform,
        mediaUrl: scheduleForm.mediaUrl
      });
      
      if (!response.ok) {
        throw new Error('Failed to generate caption');
      }
      
      const data = await response.json();
      setScheduleForm(prev => ({ ...prev, description: data.caption }));
      
      toast({
        title: "Caption Generated",
        description: "AI caption has been generated successfully!"
      });
    } catch (error: any) {
      toast({
        title: "Caption Generation Failed",
        description: error.message || "Failed to generate caption. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsGeneratingCaption(false);
    }
  };

  const generateAIHashtags = async () => {
    if (!scheduleForm.title && !scheduleForm.description) {
      toast({
        title: "Missing Content",
        description: "Please provide a title or description to generate hashtags.",
        variant: "destructive"
      });
      return;
    }

    setIsGeneratingHashtags(true);
    try {
      const response = await apiRequest('POST', '/api/ai/generate-hashtags', {
        title: scheduleForm.title,
        description: scheduleForm.description,
        type: scheduleForm.type,
        platform: scheduleForm.platform
      });
      
      if (!response.ok) {
        throw new Error('Failed to generate hashtags');
      }
      
      const data = await response.json();
      const hashtagText = data.hashtags.join(' ');
      const currentDescription = scheduleForm.description;
      const newDescription = currentDescription 
        ? `${currentDescription}\n\n${hashtagText}`
        : hashtagText;
      
      setScheduleForm(prev => ({ ...prev, description: newDescription }));
      
      toast({
        title: "Hashtags Generated",
        description: `Generated ${data.hashtags.length} relevant hashtags!`
      });
    } catch (error: any) {
      toast({
        title: "Hashtag Generation Failed",
        description: error.message || "Failed to generate hashtags. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsGeneratingHashtags(false);
    }
  };

  const handleScheduleSubmit = async (publishNow: boolean, e: React.FormEvent) => {
    e.preventDefault();
    
    if (!scheduleForm.title || !scheduleForm.description) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields.",
        variant: "destructive"
      });
      return;
    }

    const scheduledAt = publishNow 
      ? new Date()
      : new Date(`${scheduleForm.scheduledDate}T${scheduleForm.scheduledTime}`);

    const contentData = {
      title: scheduleForm.title,
      description: scheduleForm.description,
      type: scheduleForm.type,
      platform: scheduleForm.platform,
      scheduledAt: scheduledAt.toISOString(),
      contentData: {
        mediaUrl: scheduleForm.mediaUrl,
        aiGenerated: scheduleForm.useAIGenerated,
        prompt: scheduleForm.aiPrompt
      }
    };

    createContentMutation.mutate(contentData);
  };

  const getContentIcon = (type: string) => {
    switch (type) {
      case 'video': 
      case 'reel': 
        return <Video className="h-5 w-5 text-electric-cyan" />;
      case 'story': 
        return <ImageIcon className="h-5 w-5 text-nebula-purple" />;
      default: 
        return <FileText className="h-5 w-5 text-solar-gold" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'scheduled': return 'bg-yellow-500';
      case 'published': return 'bg-green-500';
      case 'failed': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const getTimeUntilScheduled = (scheduledAt: string) => {
    const now = new Date();
    const scheduled = new Date(scheduledAt);
    const diffMs = scheduled.getTime() - now.getTime();
    
    if (diffMs <= 0) return 'Overdue';
    
    const days = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diffMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
    
    if (days > 0) return `${days}d ${hours}h`;
    if (hours > 0) return `${hours}h ${minutes}m`;
    return `${minutes}m`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-cosmic-dark via-space-gray to-nebula-dark text-white">
      {/* Mobile-responsive header */}
      <div className="sticky top-0 z-40 bg-cosmic-dark/95 backdrop-blur-sm border-b border-white/10">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between p-4 sm:p-6 gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-orbitron font-bold neon-text text-electric-cyan">
              Content Scheduler
            </h1>
            <p className="text-asteroid-silver text-sm sm:text-base">
              Plan, schedule, and automate your social media content
            </p>
          </div>
          
          {/* Mobile-responsive action buttons */}
          <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
            <Button
              onClick={() => handleScheduleContent()}
              className="bg-gradient-to-r from-solar-gold to-orange-500 hover:from-orange-500 hover:to-solar-gold transition-all duration-300 w-full sm:w-auto"
            >
              <Plus className="w-4 h-4 mr-2" />
              <span className="sm:inline">Schedule Content</span>
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile-responsive tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="p-4 sm:p-6">
        <div className="overflow-x-auto">
          <TabsList className="grid w-full grid-cols-4 lg:grid-cols-6 glassmorphism min-w-max">
            <TabsTrigger value="overview" className="text-xs sm:text-sm whitespace-nowrap">
              Overview
            </TabsTrigger>
            <TabsTrigger value="calendar" className="text-xs sm:text-sm whitespace-nowrap">
              Calendar
            </TabsTrigger>
            <TabsTrigger value="scheduled" className="text-xs sm:text-sm whitespace-nowrap">
              Scheduled
            </TabsTrigger>
            <TabsTrigger value="list" className="text-xs sm:text-sm whitespace-nowrap">
              List View
            </TabsTrigger>
            <TabsTrigger value="automation" className="text-xs sm:text-sm whitespace-nowrap hidden lg:block">
              Automation
            </TabsTrigger>
            <TabsTrigger value="analytics" className="text-xs sm:text-sm whitespace-nowrap hidden lg:block">
              Analytics
            </TabsTrigger>
          </TabsList>
        </div>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6 mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            <Card className="content-card glassmorphism">
              <CardContent className="p-4 sm:p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-asteroid-silver">Scheduled</p>
                    <p className="text-2xl font-bold text-solar-gold">{scheduledContent.length}</p>
                  </div>
                  <CalendarIcon className="h-8 w-8 text-solar-gold" />
                </div>
              </CardContent>
            </Card>

            <Card className="content-card glassmorphism">
              <CardContent className="p-4 sm:p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-asteroid-silver">Published</p>
                    <p className="text-2xl font-bold text-green-400">{contentMetrics.published || 0}</p>
                  </div>
                  <TrendingUp className="h-8 w-8 text-green-400" />
                </div>
              </CardContent>
            </Card>

            <Card className="content-card glassmorphism">
              <CardContent className="p-4 sm:p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-asteroid-silver">This Week</p>
                    <p className="text-2xl font-bold text-electric-cyan">{contentMetrics.thisWeek || 0}</p>
                  </div>
                  <BarChart3 className="h-8 w-8 text-electric-cyan" />
                </div>
              </CardContent>
            </Card>

            <Card className="content-card glassmorphism">
              <CardContent className="p-4 sm:p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-asteroid-silver">Success Rate</p>
                    <p className="text-2xl font-bold text-nebula-purple">98%</p>
                  </div>
                  <Settings className="h-8 w-8 text-nebula-purple" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Quick actions for mobile */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <Card className="content-card glassmorphism hover:border-electric-cyan/50 transition-all cursor-pointer">
              <CardContent className="p-6 text-center">
                <Plus className="h-12 w-12 mx-auto text-electric-cyan mb-4" />
                <h3 className="font-semibold text-white mb-2">Quick Schedule</h3>
                <p className="text-asteroid-silver text-sm">Schedule content for optimal engagement</p>
              </CardContent>
            </Card>

            <Card className="content-card glassmorphism hover:border-solar-gold/50 transition-all cursor-pointer">
              <CardContent className="p-6 text-center">
                <Zap className="h-12 w-12 mx-auto text-solar-gold mb-4" />
                <h3 className="font-semibold text-white mb-2">AI Generate</h3>
                <p className="text-asteroid-silver text-sm">Create content with AI assistance</p>
              </CardContent>
            </Card>

            <Card className="content-card glassmorphism hover:border-nebula-purple/50 transition-all cursor-pointer sm:col-span-2 lg:col-span-1">
              <CardContent className="p-6 text-center">
                <Upload className="h-12 w-12 mx-auto text-nebula-purple mb-4" />
                <h3 className="font-semibold text-white mb-2">Bulk Upload</h3>
                <p className="text-asteroid-silver text-sm">Upload multiple files at once</p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Calendar Tab */}
        <TabsContent value="calendar" className="space-y-6 mt-6">
          <Calendar onScheduleContent={handleScheduleContent} />
        </TabsContent>

        {/* Scheduled Tab */}
        <TabsContent value="scheduled" className="space-y-6 mt-6">
          {isScheduledLoading ? (
            <div className="grid gap-4">
              {[...Array(3)].map((_, i) => (
                <Card key={i} className="content-card glassmorphism animate-pulse">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex-1 space-y-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-white/10 rounded" />
                          <div className="h-4 bg-white/10 rounded w-32" />
                        </div>
                        <div className="h-3 bg-white/10 rounded w-full" />
                        <div className="flex gap-4">
                          <div className="h-3 bg-white/10 rounded w-20" />
                          <div className="h-3 bg-white/10 rounded w-16" />
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <div className="w-8 h-8 bg-white/10 rounded" />
                        <div className="w-8 h-8 bg-white/10 rounded" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : scheduledContent.length === 0 ? (
            <Card className="content-card holographic">
              <CardContent className="flex flex-col items-center justify-center py-16">
                <CalendarIcon className="h-16 w-16 text-asteroid-silver mb-6" />
                <h3 className="text-xl font-semibold text-white mb-2">No Scheduled Content</h3>
                <p className="text-asteroid-silver text-center mb-6">
                  You don't have any content scheduled for publishing yet.
                  <br />
                  Create your first scheduled post to get started!
                </p>
                <Button
                  onClick={() => setIsScheduleDialogOpen(true)}
                  className="bg-gradient-to-r from-solar-gold to-orange-500"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Schedule Content
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4">
              {scheduledContent.map((content: any) => {
                const scheduledDate = new Date(content.scheduledAt);
                const timeUntil = getTimeUntilScheduled(content.scheduledAt);
                
                return (
                  <Card key={content.id} className="content-card glassmorphism hover:border-electric-cyan/50 hover:shadow-lg hover:shadow-electric-cyan/20 transition-all duration-300 cursor-pointer group">
                    <CardContent className="p-4 sm:p-6">
                      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                        <div className="flex-1">
                          <div className="flex flex-wrap items-center gap-3 mb-3">
                            {getContentIcon(content.type)}
                            <h3 className="font-semibold text-white group-hover:text-electric-cyan transition-colors">{content.title}</h3>
                            <Badge className={`${getStatusColor(content.status)} text-white`}>
                              {content.status}
                            </Badge>
                            <Badge variant="secondary" className="text-xs">
                              {content.platform}
                            </Badge>
                          </div>
                          
                          {content.description && (
                            <p className="text-asteroid-silver mb-3 text-sm">
                              {content.description}
                            </p>
                          )}
                          
                          <div className="flex flex-wrap items-center gap-4 text-sm text-asteroid-silver">
                            <div className="flex items-center gap-1">
                              <CalendarIcon className="h-4 w-4" />
                              {scheduledDate.toLocaleDateString()}
                            </div>
                            <div className="flex items-center gap-1">
                              <Clock className="h-4 w-4" />
                              {scheduledDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </div>
                            <div className="flex items-center gap-1">
                              <AlertCircle className="h-4 w-4" />
                              {timeUntil}
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            className="glassmorphism hover:bg-electric-cyan/20 hover:border-electric-cyan transition-all"
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation();
                              deleteContentMutation.mutate(content.id);
                            }}
                            className="glassmorphism text-red-400 hover:text-red-300 hover:bg-red-500/20 hover:border-red-400 transition-all"
                            disabled={deleteContentMutation.isPending}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </TabsContent>

        {/* List View Tab */}
        <TabsContent value="list" className="space-y-6 mt-6">
          <Card className="content-card holographic">
            <CardHeader>
              <CardTitle className="text-xl font-orbitron font-semibold neon-text text-electric-cyan">
                Content List
              </CardTitle>
              <p className="text-asteroid-silver">
                All your scheduled content in an organized view
              </p>
            </CardHeader>
            <CardContent>
              {scheduledContent.length === 0 ? (
                <div className="text-center py-12">
                  <BarChart3 className="h-12 w-12 mx-auto text-asteroid-silver mb-4" />
                  <h3 className="text-lg font-semibold text-white mb-2">No Scheduled Content</h3>
                  <p className="text-asteroid-silver">
                    You don't have any content scheduled for publishing yet.
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {scheduledContent.map((content: any) => (
                    <div key={content.id} className="flex flex-col sm:flex-row sm:items-center gap-4 p-4 rounded-lg bg-cosmic-blue/20 hover:bg-space-gray/30 transition-colors">
                      <div className="flex items-center gap-3">
                        {getContentIcon(content.type)}
                        <div>
                          <h4 className="font-medium text-white">{content.title}</h4>
                          <p className="text-sm text-asteroid-silver capitalize">
                            {content.platform} • {content.type}
                          </p>
                        </div>
                      </div>
                      <div className="flex-1">
                        {content.description && (
                          <p className="text-xs text-asteroid-silver line-clamp-2">
                            {content.description}
                          </p>
                        )}
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-mono text-solar-gold">
                          {content.scheduledAt ? new Date(content.scheduledAt).toLocaleString() : 'Not scheduled'}
                        </div>
                        <Badge className={`text-xs mt-1 ${getStatusColor(content.status)} text-white`}>
                          {content.status}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Schedule Content Dialog */}
      <Dialog open={isScheduleDialogOpen} onOpenChange={setIsScheduleDialogOpen}>
        <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto p-4 sm:p-6">
          <DialogHeader>
            <DialogTitle className="text-lg sm:text-xl font-semibold">Schedule Content</DialogTitle>
          </DialogHeader>
          <form onSubmit={(e) => handleScheduleSubmit(false, e)} className="space-y-4 sm:space-y-6">
            {/* Basic Information */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Title *</Label>
                <Input
                  value={scheduleForm.title}
                  onChange={(e) => setScheduleForm(prev => ({ ...prev, title: e.target.value }))}
                  placeholder="Enter content title"
                  className="w-full"
                />
              </div>
              <div className="space-y-2">
                <Label>Platform</Label>
                <Select
                  value={scheduleForm.platform}
                  onValueChange={(value) => setScheduleForm(prev => ({ ...prev, platform: value }))}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="instagram">Instagram</SelectItem>
                    <SelectItem value="twitter">Twitter</SelectItem>
                    <SelectItem value="facebook">Facebook</SelectItem>
                    <SelectItem value="linkedin">LinkedIn</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Content Type */}
            <div className="space-y-2">
              <Label>Content Type</Label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {['post', 'story', 'reel', 'video'].map((type) => (
                  <label 
                    key={type}
                    className={`flex items-center justify-center p-3 border-2 rounded-lg cursor-pointer transition-all ${
                      scheduleForm.type === type 
                        ? 'border-electric-cyan bg-electric-cyan/10' 
                        : 'border-white/20 hover:border-white/40'
                    }`}
                  >
                    <input
                      type="radio"
                      value={type}
                      checked={scheduleForm.type === type}
                      onChange={(e) => setScheduleForm(prev => ({ ...prev, type: e.target.value }))}
                      className="sr-only"
                    />
                    <span className="capitalize text-white font-medium text-sm">{type}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Media Upload */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label>Media Content</Label>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setScheduleForm(prev => ({ ...prev, useAIGenerated: !prev.useAIGenerated }))}
                  className={`${scheduleForm.useAIGenerated ? 'border-electric-cyan' : ''}`}
                >
                  <Zap className="w-4 h-4 mr-2" />
                  AI Generate
                </Button>
              </div>

              {scheduleForm.useAIGenerated ? (
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label>AI Prompt</Label>
                    <Textarea
                      value={scheduleForm.aiPrompt}
                      onChange={(e) => setScheduleForm(prev => ({ ...prev, aiPrompt: e.target.value }))}
                      placeholder="Describe the image you want to generate..."
                      rows={3}
                    />
                  </div>
                  <Button
                    type="button"
                    onClick={generateAIContent}
                    disabled={isGeneratingAI}
                    className="bg-gradient-to-r from-nebula-purple to-electric-cyan"
                  >
                    {isGeneratingAI ? (
                      <>
                        <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full mr-2" />
                        Generating...
                      </>
                    ) : (
                      <>
                        <Zap className="w-4 h-4 mr-2" />
                        Generate Image
                      </>
                    )}
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="border-2 border-dashed border-white/20 rounded-lg p-6">
                    <input
                      type="file"
                      accept="image/*,video/*"
                      onChange={handleFileUpload}
                      className="hidden"
                      ref={fileInputRef}
                    />
                    <div className="text-center">
                      <Upload className="h-8 w-8 mx-auto text-asteroid-silver mb-2" />
                      <p className="text-asteroid-silver mb-2 text-sm">
                        {uploadedFile ? uploadedFile.name : "Click to upload or drag & drop"}
                      </p>
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => fileInputRef.current?.click()}
                      >
                        Choose File
                      </Button>
                    </div>
                  </div>
                  
                  {/* Media Preview */}
                  {(mediaPreviewUrl || scheduleForm.mediaUrl) && (
                    <div className="space-y-2">
                      <Label>Media Preview</Label>
                      <div className="relative">
                        <MediaPreview 
                          src={mediaPreviewUrl || scheduleForm.mediaUrl} 
                          fileType={uploadedFile ? getFileType(uploadedFile) : getFileType(scheduleForm.mediaUrl)}
                        />
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setMediaPreviewUrl('');
                            setUploadedFile(null);
                            setScheduleForm(prev => ({ ...prev, mediaUrl: '' }));
                            if (fileInputRef.current) fileInputRef.current.value = '';
                          }}
                          className="absolute top-2 right-2 bg-red-500/20 border-red-500 hover:bg-red-500/40"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Caption */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label>Caption</Label>
                <div className="flex gap-2">
                  <Button
                    type="button"
                    size="sm"
                    variant="outline"
                    onClick={generateAICaption}
                    disabled={isGeneratingCaption}
                    className="text-xs glassmorphism hover:bg-electric-cyan/20 hover:border-electric-cyan"
                  >
                    {isGeneratingCaption ? (
                      <>
                        <Zap className="h-3 w-3 mr-1 animate-pulse" />
                        Generating...
                      </>
                    ) : (
                      <>
                        <Zap className="h-3 w-3 mr-1" />
                        AI Caption
                      </>
                    )}
                  </Button>
                  <Button
                    type="button"
                    size="sm"
                    variant="outline"
                    onClick={generateAIHashtags}
                    disabled={isGeneratingHashtags}
                    className="text-xs glassmorphism hover:bg-nebula-purple/20 hover:border-nebula-purple"
                  >
                    {isGeneratingHashtags ? (
                      <>
                        <Hash className="h-3 w-3 mr-1 animate-pulse" />
                        Generating...
                      </>
                    ) : (
                      <>
                        <Hash className="h-3 w-3 mr-1" />
                        AI Hashtags
                      </>
                    )}
                  </Button>
                </div>
              </div>
              <Textarea
                value={scheduleForm.description}
                onChange={(e) => setScheduleForm(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Write your caption..."
                rows={4}
              />
            </div>

            {/* Scheduling Options */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Schedule Date</Label>
                <Input
                  type="date"
                  value={scheduleForm.scheduledDate}
                  onChange={(e) => setScheduleForm(prev => ({ ...prev, scheduledDate: e.target.value }))}
                />
              </div>
              <div className="space-y-2">
                <Label>Schedule Time</Label>
                <Input
                  type="time"
                  value={scheduleForm.scheduledTime}
                  onChange={(e) => setScheduleForm(prev => ({ ...prev, scheduledTime: e.target.value }))}
                />
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsScheduleDialogOpen(false)}
                className="w-full sm:w-auto"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="w-full sm:w-auto bg-gradient-to-r from-solar-gold to-orange-500"
                disabled={createContentMutation.isPending}
              >
                {createContentMutation.isPending ? 'Scheduling...' : 'Schedule Content'}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Publishing Progress */}
      <PublishingProgressTracker 
        isVisible={progressState.isVisible}
        status={progressState.status}
        progress={progressState.progress}
        currentStep={progressState.currentStep}
        timeRemaining={progressState.timeRemaining}
        onClose={() => setProgressState(prev => ({ ...prev, isVisible: false }))}
      />
    </div>
  );
}