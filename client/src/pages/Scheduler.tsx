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
import { useAuth } from "@/hooks/useAuth";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { PublishingProgressTracker } from "@/components/PublishingProgressTracker";
import { Plus, Clock, Calendar as CalendarIcon, BarChart3, Zap, Upload, Image, Video, FileText, Trash2, Edit, AlertCircle } from "lucide-react";
import { useState, useEffect, useRef } from "react";

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
  const { currentWorkspace, workspaces } = useWorkspace();
  const { user } = useAuth();
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
  const [editDialog, setEditDialog] = useState(false);
  const [publishingState, setPublishingState] = useState<{
    isPublishing: boolean;
    contentType?: string;
    contentId?: string;
  }>({ isPublishing: false });
  const [progressState, setProgressState] = useState<{
    isVisible: boolean;
    status: string;
    progress: number;
    currentStep: string;
    timeRemaining: string;
  }>({ isVisible: false, status: 'idle', progress: 0, currentStep: '', timeRemaining: '' });
  const [editForm, setEditForm] = useState({
    id: "",
    title: "",
    description: "",
    scheduledDate: "",
    scheduledTime: ""
  });
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: scheduledContent = [] } = useQuery({
    queryKey: ['scheduled-content', currentWorkspace?.id],
    queryFn: async () => {
      const response = await apiRequest('GET', `/api/content?workspaceId=${currentWorkspace?.id}&status=scheduled`);
      return response.json();
    },
    enabled: !!currentWorkspace?.id && !!currentWorkspace?.name // Wait for workspace to be fully loaded
  });

  // Simple manual state management for social accounts
  const [socialAccounts, setSocialAccounts] = useState([]);
  const [socialAccountsLoading, setSocialAccountsLoading] = useState(false);

  // Fetch social accounts with proper workspace restoration timing
  useEffect(() => {
    let isCancelled = false;
    let timeoutId: NodeJS.Timeout;
    
    console.log('[SCHEDULER DEBUG] Workspace effect triggered:', {
      currentId: currentWorkspace?.id,
      currentName: currentWorkspace?.name,
      workspacesCount: workspaces.length
    });
    
    // Clear accounts during workspace changes
    setSocialAccounts([]);
    setSocialAccountsLoading(true);
    
    // Wait for both workspace and workspaces array to be populated
    if (currentWorkspace?.id && currentWorkspace?.name && workspaces.length > 0) {
      
      // Get the expected workspace from localStorage immediately using the correct user-specific key
      let expectedWorkspace;
      try {
        if (user?.id) {
          const storageKey = `veefore_current_workspace_${user.id}`;
          const saved = localStorage.getItem(storageKey);
          console.log('[SCHEDULER DEBUG] localStorage key:', storageKey);
          console.log('[SCHEDULER DEBUG] localStorage raw value:', saved);
          expectedWorkspace = saved ? JSON.parse(saved) : null;
        } else {
          expectedWorkspace = null;
          console.log('[SCHEDULER DEBUG] No user.id available for localStorage key');
        }
      } catch (error) {
        console.log('[SCHEDULER DEBUG] Error reading localStorage:', error);
        expectedWorkspace = null;
      }
      
      console.log('[SCHEDULER DEBUG] Expected workspace from localStorage:', expectedWorkspace?.name);
      console.log('[SCHEDULER DEBUG] Current workspace context:', currentWorkspace.name);
      console.log('[SCHEDULER DEBUG] Available workspaces:', workspaces.map((w: any) => w.name));
      console.log('[SCHEDULER DEBUG] User ID:', user?.id);
      
      // Always prioritize current workspace context over localStorage for immediate response
      let targetWorkspace = currentWorkspace;
      
      // Only use localStorage if current workspace context doesn't match what we expect
      if (expectedWorkspace && expectedWorkspace.name !== currentWorkspace.name) {
        const foundWorkspace = workspaces.find(w => w.name === expectedWorkspace.name);
        if (foundWorkspace) {
          console.log('[SCHEDULER DEBUG] Found different workspace in localStorage, using:', foundWorkspace.name, foundWorkspace.id);
          targetWorkspace = foundWorkspace;
        }
      }
      
      console.log('[SCHEDULER DEBUG] Final target workspace:', targetWorkspace.name, targetWorkspace.id);
      
      // Fetch accounts after a brief delay
      timeoutId = setTimeout(async () => {
        if (isCancelled) return;
        
        console.log('[SCHEDULER DEBUG] Fetching accounts for workspace:', targetWorkspace.id, targetWorkspace.name);
        
        try {
          const response = await apiRequest('GET', `/api/social-accounts?workspaceId=${targetWorkspace.id}`);
          const accounts = await response.json();
          
          if (!isCancelled) {
            console.log('[SCHEDULER DEBUG] Retrieved accounts:', accounts.length, 'for workspace:', targetWorkspace.name);
            accounts.forEach((account: any, index: number) => {
              console.log(`[SCHEDULER DEBUG]   ${index + 1}. @${account.username} (${account.platform})`);
            });
            setSocialAccounts(accounts);
          }
        } catch (error) {
          console.error('[SCHEDULER DEBUG] Error fetching accounts:', error);
          if (!isCancelled) {
            setSocialAccounts([]);
          }
        } finally {
          if (!isCancelled) {
            setSocialAccountsLoading(false);
          }
        }
      }, 100); // Minimal delay for immediate response to workspace changes
    } else {
      setSocialAccountsLoading(false);
    }
    
    return () => {
      isCancelled = true;
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };
  }, [currentWorkspace?.id, currentWorkspace?.name, workspaces.length, user?.id]);

  // Force refresh when modal opens to ensure fresh data with correct workspace
  useEffect(() => {
    if (isScheduleDialogOpen && currentWorkspace?.id && currentWorkspace?.name && workspaces.length > 0) {
      // Use the same workspace determination logic as the main effect
      let targetWorkspace = currentWorkspace;
      
      // Check localStorage for the correct workspace
      try {
        if (user?.id) {
          const storageKey = `veefore_current_workspace_${user.id}`;
          const saved = localStorage.getItem(storageKey);
          if (saved) {
            const expectedWorkspace = JSON.parse(saved);
            if (expectedWorkspace && expectedWorkspace.name !== currentWorkspace.name) {
              const foundWorkspace = workspaces.find((w: any) => w.name === expectedWorkspace.name);
              if (foundWorkspace) {
                console.log('[SCHEDULER DEBUG] Modal using localStorage workspace:', foundWorkspace.name, foundWorkspace.id);
                targetWorkspace = foundWorkspace;
              }
            }
          }
        }
      } catch (error) {
        console.log('[SCHEDULER DEBUG] Modal localStorage error:', error);
      }
      
      console.log('[SCHEDULER DEBUG] Modal opened, forcing fresh data fetch for workspace:', targetWorkspace.name);
      // Clear accounts state immediately
      setSocialAccounts([]);
      setSocialAccountsLoading(true);
      
      // Clear all cached data and force immediate refetch
      queryClient.removeQueries({ queryKey: ['social-accounts'] });
      queryClient.removeQueries({ queryKey: ['scheduled-content'] });
      
      // Trigger the main effect to refetch with minimal delay
      const timeoutId = setTimeout(async () => {
        console.log('[SCHEDULER DEBUG] Modal refresh: Fetching accounts for workspace:', targetWorkspace.id, targetWorkspace.name);
        
        try {
          const response = await apiRequest('GET', `/api/social-accounts?workspaceId=${targetWorkspace.id}`);
          const accounts = await response.json();
          
          console.log('[SCHEDULER DEBUG] Modal fetched accounts:', accounts.length, 'for workspace:', targetWorkspace.name);
          accounts.forEach((account: any, index: number) => {
            console.log(`[SCHEDULER DEBUG] Modal account ${index + 1}: @${account.username} (${account.platform})`);
          });
          setSocialAccounts(accounts);
          setSocialAccountsLoading(false);
        } catch (error) {
          console.error('[SCHEDULER DEBUG] Modal error fetching accounts:', error);
          setSocialAccounts([]);
          setSocialAccountsLoading(false);
        }
      }, 50);
      
      return () => clearTimeout(timeoutId);
    }
  }, [isScheduleDialogOpen, currentWorkspace?.id, currentWorkspace?.name, workspaces.length, user?.id, queryClient]);

  // Update platform selection when workspace or social accounts change
  useEffect(() => {
    if (socialAccounts && socialAccounts.length > 0 && currentWorkspace?.id) {
      const firstPlatform = socialAccounts[0].platform;
      // Only update if current platform is not available in this workspace
      const currentPlatformExists = socialAccounts.some((account: any) => account.platform === scheduleForm.platform);
      if (!currentPlatformExists) {
        setScheduleForm(prev => ({ ...prev, platform: firstPlatform }));
      }
    }
  }, [socialAccounts, currentWorkspace?.id, scheduleForm.platform]);

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
      // For immediate publishing, start progress tracking
      if (contentData.publishNow) {
        setPublishingState({
          isPublishing: true,
          contentType: contentData.type,
          contentId: `temp_${Date.now()}`
        });
      }

      const response = await apiRequest('POST', '/api/content', {
        body: JSON.stringify(contentData)
      });
      return response.json();
    },
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['scheduled-content'] });
      
      if (variables.publishNow) {
        // Complete progress tracking for immediate publishing
        setProgressState({
          isVisible: true,
          status: 'completed',
          progress: 100,
          currentStep: 'Published successfully!',
          timeRemaining: 'Complete'
        });
        
        // Hide progress tracker after 3 seconds
        setTimeout(() => {
          setProgressState({ isVisible: false, status: 'idle', progress: 0, currentStep: '', timeRemaining: '' });
          setIsScheduleDialogOpen(false);
          resetScheduleForm();
        }, 3000);
        
        toast({
          title: "Content Published Successfully!",
          description: `Your ${variables.type} has been published to Instagram.`
        });
      } else {
        // For scheduled content
        setIsScheduleDialogOpen(false);
        resetScheduleForm();
        toast({
          title: "Content scheduled",
          description: "Your content has been scheduled successfully."
        });
      }
    },
    onError: (error: any) => {
      // Show error state in progress tracker
      if (progressState.isVisible) {
        setProgressState({
          isVisible: true,
          status: 'error',
          progress: 0,
          currentStep: 'Publishing failed',
          timeRemaining: 'Error'
        });
        
        setTimeout(() => {
          setProgressState({ isVisible: false, status: 'idle', progress: 0, currentStep: '', timeRemaining: '' });
        }, 5000);
      }
      
      setPublishingState({ isPublishing: false });
      toast({
        title: "Error",
        description: error.message || "Failed to publish content. Please try again.",
        variant: "destructive"
      });
    }
  });

  const deleteContentMutation = useMutation({
    mutationFn: async (contentId: string) => {
      const response = await apiRequest('DELETE', `/api/content/${contentId}`);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['scheduled-content'] });
      toast({
        title: "Content cancelled",
        description: "Scheduled content has been cancelled successfully."
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to cancel scheduled content.",
        variant: "destructive"
      });
    }
  });

  // Update scheduled content mutation
  const updateContentMutation = useMutation({
    mutationFn: async (data: any) => {
      const scheduledAt = new Date(`${data.scheduledDate}T${data.scheduledTime}:00.000Z`).toISOString();
      const response = await apiRequest('PUT', `/api/content/${data.id}`, {
        title: data.title,
        description: data.description,
        scheduledAt
      });
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['scheduled-content'] });
      setEditDialog(false);
      toast({
        title: "Content updated",
        description: "Scheduled content has been updated successfully."
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to update scheduled content",
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

  const handleScheduleSubmit = async (publishNow: boolean = false, event?: React.FormEvent) => {
    if (event) {
      event.preventDefault();
    }

    if (!scheduleForm.title || !scheduleForm.description || !scheduleForm.mediaUrl) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields and upload media.",
        variant: "destructive"
      });
      return;
    }

    if (!publishNow && !scheduleForm.scheduledDate) {
      toast({
        title: "Missing Schedule Date",
        description: "Please select a date and time to schedule your content.",
        variant: "destructive"
      });
      return;
    }

    const scheduledAt = publishNow ? 
      new Date().toISOString() : 
      new Date(`${scheduleForm.scheduledDate}T${scheduleForm.scheduledTime}:00.000Z`).toISOString();

    // Show progress tracker immediately for "Post Now"
    if (publishNow) {
      setProgressState({
        isVisible: true,
        status: 'uploading',
        progress: 10,
        currentStep: 'Preparing content...',
        timeRemaining: '2-3 minutes'
      });
      
      // Update progress during processing
      setTimeout(() => {
        setProgressState(prev => ({
          ...prev,
          progress: 40,
          currentStep: 'Uploading to Instagram...',
          timeRemaining: '1-2 minutes'
        }));
      }, 2000);
      
      setTimeout(() => {
        setProgressState(prev => ({
          ...prev,
          progress: 70,
          currentStep: 'Processing video...',
          timeRemaining: '30-60 seconds'
        }));
      }, 10000);
    }

    // Get the correct workspace ID from localStorage (same logic as modal)
    let targetWorkspaceId = currentWorkspace?.id;
    
    try {
      if (user?.id) {
        const storageKey = `veefore_current_workspace_${user.id}`;
        const savedWorkspace = localStorage.getItem(storageKey);
        
        if (savedWorkspace) {
          const parsedWorkspace = JSON.parse(savedWorkspace);
          if (parsedWorkspace && parsedWorkspace.id) {
            targetWorkspaceId = parsedWorkspace.id;
            console.log('[FORM SUBMIT] Using localStorage workspace:', parsedWorkspace.name, parsedWorkspace.id);
          }
        }
      }
    } catch (error) {
      console.log('[FORM SUBMIT] localStorage error, using context workspace:', error);
    }

    createContentMutation.mutate({
      workspaceId: targetWorkspaceId,
      title: scheduleForm.title,
      description: scheduleForm.description,
      type: scheduleForm.type,
      platform: scheduleForm.platform,
      scheduledAt,
      publishNow,
      contentData: {
        mediaUrl: scheduleForm.mediaUrl,
        caption: scheduleForm.description,
        isAIGenerated: scheduleForm.useAIGenerated,
        aiPrompt: scheduleForm.aiPrompt
      }
    });
  };

  const getTimeUntilScheduled = (scheduledAt: string) => {
    const now = new Date();
    const scheduled = new Date(scheduledAt);
    const diff = scheduled.getTime() - now.getTime();
    
    if (diff <= 0) return "Publishing soon...";
    
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    
    if (days > 0) return `${days}d ${hours}h`;
    if (hours > 0) return `${hours}h ${minutes}m`;
    return `${minutes}m`;
  };

  const getContentIcon = (type: string) => {
    switch (type) {
      case 'video': return <Video className="h-4 w-4" />;
      case 'reel': return <Video className="h-4 w-4" />;
      case 'post': return <Image className="h-4 w-4" />;
      default: return <FileText className="h-4 w-4" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'scheduled': return 'bg-blue-500';
      case 'publishing': return 'bg-yellow-500';
      case 'published': return 'bg-green-500';
      case 'failed': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const handleEdit = (content: any) => {
    const scheduled = new Date(content.scheduledAt);
    setEditForm({
      id: content.id,
      title: content.title,
      description: content.description || "",
      scheduledDate: scheduled.toISOString().split('T')[0],
      scheduledTime: scheduled.toISOString().split('T')[1].slice(0, 5)
    });
    setEditDialog(true);
  };

  const handleDelete = (contentId: string) => {
    if (window.confirm('Are you sure you want to cancel this scheduled post?')) {
      deleteContentMutation.mutate(contentId);
    }
  };

  const handleUpdate = () => {
    updateContentMutation.mutate(editForm);
  };

  const handleBulkUpload = () => {
    setIsBulkMode(true);
    setIsScheduleDialogOpen(true);
  };

  const handleDeleteContent = (contentId: number) => {
    deleteContentMutation.mutate(contentId);
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setUploadedFile(file);
      
      try {
        const formData = new FormData();
        formData.append('file', file);
        
        const response = await apiRequest('POST', '/api/upload', formData);
        const result = await response.json();
        
        if (result.success) {
          setScheduleForm(prev => ({ ...prev, mediaUrl: result.fileUrl }));
          toast({
            title: "File uploaded successfully",
            description: `${file.name} is ready for Instagram publishing`
          });
        }
      } catch (error) {
        console.error('File upload error:', error);
        toast({
          title: "Upload failed",
          description: `Failed to upload ${file.name}`,
          variant: "destructive"
        });
        // Fallback to object URL for preview only
        const objectUrl = URL.createObjectURL(file);
        setScheduleForm(prev => ({ ...prev, mediaUrl: objectUrl }));
      }
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
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl md:text-4xl font-orbitron font-bold neon-text text-solar-gold">
            Mission Scheduler
          </h2>
          <p className="text-asteroid-silver mt-2 text-sm md:text-base">
            Orchestrate your content across the digital cosmos
          </p>
        </div>
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:space-x-4 sm:gap-0">
          <Button 
            variant="outline" 
            onClick={handleBulkUpload}
            className="glassmorphism w-full sm:w-auto"
          >
            <Upload className="w-4 h-4 mr-2" />
            <span className="hidden sm:inline">Bulk Upload</span>
            <span className="sm:hidden">Upload</span>
          </Button>
          <Button 
            onClick={() => handleScheduleContent()}
            className="bg-gradient-to-r from-solar-gold to-orange-500 hover:opacity-90 transition-opacity w-full sm:w-auto"
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
        <TabsList className="grid w-full grid-cols-2 md:grid-cols-5 gap-1 glassmorphism">
          <TabsTrigger value="calendar" className="text-xs md:text-sm">
            <span className="hidden md:inline">Calendar View</span>
            <span className="md:hidden">Calendar</span>
          </TabsTrigger>
          <TabsTrigger value="scheduled" className="text-xs md:text-sm">
            <span className="hidden md:inline">Scheduled Content</span>
            <span className="md:hidden">Scheduled</span>
          </TabsTrigger>
          <TabsTrigger value="list" className="text-xs md:text-sm md:block">
            <span className="hidden md:inline">List View</span>
            <span className="md:hidden">List</span>
          </TabsTrigger>
          <TabsTrigger value="automation" className="text-xs md:text-sm hidden md:block">
            Automation
          </TabsTrigger>
          <TabsTrigger value="analytics" className="text-xs md:text-sm hidden md:block">
            Analytics
          </TabsTrigger>
        </TabsList>

        <TabsContent value="calendar" className="space-y-6">
          <Calendar onScheduleContent={handleScheduleContent} />
        </TabsContent>

        <TabsContent value="scheduled" className="space-y-6">
          <Card className="content-card holographic">
            <CardHeader>
              <CardTitle className="text-xl font-orbitron font-semibold neon-text text-electric-cyan">
                Scheduled Content Management
              </CardTitle>
              <p className="text-asteroid-silver">
                Manage your scheduled posts - edit timing or cancel as needed
              </p>
            </CardHeader>
            <CardContent className="space-y-4">
              {scheduledContent.length === 0 ? (
                <div className="text-center py-12">
                  <CalendarIcon className="h-12 w-12 mx-auto text-asteroid-silver mb-4" />
                  <h3 className="text-lg font-semibold text-white mb-2">No Scheduled Content</h3>
                  <p className="text-asteroid-silver">
                    You don't have any content scheduled for publishing yet.
                  </p>
                </div>
              ) : (
                <div className="grid gap-4">
                  {scheduledContent.map((content: any) => {
                    const scheduledDate = new Date(content.scheduledAt);
                    const timeUntil = getTimeUntilScheduled(content.scheduledAt);
                    
                    return (
                      <Card key={content.id} className="content-card glassmorphism hover:border-electric-cyan/50 hover:shadow-lg hover:shadow-electric-cyan/20 transition-all duration-300 cursor-pointer group">
                        <CardContent className="p-6">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <div className="flex items-center gap-3 mb-3">
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
                              
                              <div className="flex items-center gap-4 text-sm text-asteroid-silver">
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
                              
                              {content.contentData?.mediaUrl && (
                                <div className="mt-3">
                                  {content.contentData.mediaUrl.match(/\.(mp4|mov|avi|mkv|webm|3gp|m4v)$/i) || content.type === 'video' || content.type === 'reel' ? (
                                    <video 
                                      src={content.contentData.mediaUrl} 
                                      className="w-16 h-16 object-cover rounded-lg border border-cosmic-dark"
                                      muted
                                    />
                                  ) : (
                                    <img 
                                      src={content.contentData.mediaUrl} 
                                      alt="Content preview" 
                                      className="w-16 h-16 object-cover rounded-lg border border-cosmic-dark"
                                    />
                                  )}
                                </div>
                              )}
                            </div>
                            
                            <div className="flex items-center gap-2 ml-4">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleEdit(content);
                                }}
                                className="glassmorphism hover:bg-electric-cyan/20 hover:border-electric-cyan transition-all opacity-0 group-hover:opacity-100"
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleDelete(content.id);
                                }}
                                className="glassmorphism text-red-400 hover:text-red-300 hover:bg-red-500/20 hover:border-red-400 transition-all opacity-0 group-hover:opacity-100"
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
            </CardContent>
          </Card>
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

          {/* Publishing Progress Tracker */}
          {(createContentMutation.isPending || publishingState.isPublishing) && (
            <PublishingProgressTracker 
              contentType={publishingState.contentType || scheduleForm.type}
              isPublishing={true}
              contentId={publishingState.contentId}
              onComplete={() => {
                setPublishingState({ isPublishing: false });
                toast({
                  title: "Content Published Successfully!",
                  description: `Your ${publishingState.contentType || scheduleForm.type} has been published to Instagram.`
                });
              }}
            />
          )}

          {!isBulkMode ? (
            <div className="space-y-6">
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
                      {socialAccounts.length === 0 ? (
                        <div className="p-2 text-center text-asteroid-silver text-sm">
                          No connected platforms. Go to Integrations to connect accounts.
                        </div>
                      ) : (
                        socialAccounts.map((account: any) => (
                          <SelectItem key={account.id} value={account.platform}>
                            {account.platform.charAt(0).toUpperCase() + account.platform.slice(1)} 
                            <span className="text-asteroid-silver ml-2">(@{account.username})</span>
                          </SelectItem>
                        ))
                      )}
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
                          {uploadedFile && uploadedFile.type.startsWith('video/') ? (
                            <video 
                              src={scheduleForm.mediaUrl} 
                              controls
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <img 
                              src={scheduleForm.mediaUrl} 
                              alt="Preview" 
                              className="w-full h-full object-cover"
                            />
                          )}
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
                          <div className="mt-2">
                            <p className="text-xs text-asteroid-silver">
                              {uploadedFile.name} ({uploadedFile.type.startsWith('video/') ? 'Video' : 'Image'})
                            </p>
                            {uploadedFile.type.startsWith('video/') && uploadedFile.size > 50 * 1024 * 1024 && (
                              <p className="text-xs text-yellow-400 mt-1">
                                ⚠️ Large video ({(uploadedFile.size / (1024 * 1024)).toFixed(1)}MB) - Instagram may take longer to process
                              </p>
                            )}
                            {scheduleForm.type === 'reel' && uploadedFile.type.startsWith('video/') && (
                              <p className="text-xs text-blue-400 mt-1">
                                📝 Note: If Reel publishing fails, your video will be posted as a regular video instead
                              </p>
                            )}
                          </div>
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
                  <div className="flex space-x-2">
                    <Select value={scheduleForm.scheduledTime} onValueChange={(value) => setScheduleForm(prev => ({ ...prev, scheduledTime: value }))}>
                      <SelectTrigger className="glassmorphism flex-1">
                        <Clock className="mr-2 h-4 w-4" />
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="max-h-60">
                        {/* Optimal times first */}
                        {getOptimalTimes().map((time) => (
                          <SelectItem key={time} value={time}>
                            {time} <Badge variant="secondary" className="ml-2">Optimal</Badge>
                          </SelectItem>
                        ))}
                        <div className="px-2 py-1">
                          <div className="border-t border-border my-1"></div>
                          <p className="text-xs text-muted-foreground font-medium">Custom Times</p>
                        </div>
                        {/* All hourly slots */}
                        {Array.from({ length: 24 }, (_, hour) => {
                          return Array.from({ length: 4 }, (_, quarter) => {
                            const minutes = quarter * 15;
                            const time = `${hour.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
                            if (!getOptimalTimes().includes(time)) {
                              return (
                                <SelectItem key={time} value={time}>
                                  {time}
                                </SelectItem>
                              );
                            }
                            return null;
                          });
                        })}
                      </SelectContent>
                    </Select>
                    <Input
                      type="time"
                      value={scheduleForm.scheduledTime}
                      onChange={(e) => setScheduleForm(prev => ({ ...prev, scheduledTime: e.target.value }))}
                      className="glassmorphism w-32"
                      step="300"
                    />
                  </div>
                  <p className="text-xs text-asteroid-silver/60">
                    Use the dropdown for optimal times or the time picker for precise scheduling
                  </p>
                </div>
              </div>

              {/* Time Presets and Optimal Times */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Quick Time Presets */}
                <Card className="content-card holographic">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-sm font-medium text-electric-cyan">
                        Quick Presets
                      </span>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      {[
                        { label: "Now", time: new Date().toTimeString().slice(0, 5) },
                        { label: "In 1 hour", time: new Date(Date.now() + 60 * 60 * 1000).toTimeString().slice(0, 5) },
                        { label: "In 2 hours", time: new Date(Date.now() + 2 * 60 * 60 * 1000).toTimeString().slice(0, 5) },
                        { label: "Tomorrow 9AM", time: "09:00" }
                      ].map((preset) => (
                        <Button
                          key={preset.label}
                          variant="outline"
                          size="sm"
                          className="glassmorphism text-xs"
                          onClick={() => {
                            setScheduleForm(prev => ({ ...prev, scheduledTime: preset.time }));
                            if (preset.label === "Tomorrow 9AM") {
                              const tomorrow = new Date();
                              tomorrow.setDate(tomorrow.getDate() + 1);
                              setScheduleForm(prev => ({ ...prev, scheduledDate: tomorrow.toISOString().split('T')[0] }));
                            }
                          }}
                        >
                          {preset.label}
                        </Button>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Optimal Times */}
                {scheduleForm.platform && (
                  <Card className="content-card holographic">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-sm font-medium text-electric-cyan">
                          Optimal for {scheduleForm.platform}
                        </span>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {getOptimalTimes().map((time) => (
                          <Badge
                            key={time}
                            variant={scheduleForm.scheduledTime === time ? "default" : "secondary"}
                            className="cursor-pointer hover:opacity-80 transition-opacity"
                            onClick={() => setScheduleForm(prev => ({ ...prev, scheduledTime: time }))}
                          >
                            {time}
                          </Badge>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                )}
              </div>

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
                  {createContentMutation.isPending ? (
                    scheduleForm.type === 'reel' || scheduleForm.type === 'video' ? "Processing Video..." : "Publishing..."
                  ) : "Post Now"}
                </Button>
                <Button
                  type="button"
                  onClick={(e) => handleScheduleSubmit(false, e)}
                  disabled={createContentMutation.isPending}
                  className="bg-gradient-to-r from-solar-gold to-orange-500 hover:opacity-90"
                >
                  {createContentMutation.isPending ? "Scheduling..." : "Schedule Content"}
                </Button>
              </div>
            </div>
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

      {/* Edit Content Dialog */}
      <Dialog open={editDialog} onOpenChange={setEditDialog}>
        <DialogContent className="glassmorphism border-cosmic-dark max-w-md">
          <DialogHeader>
            <DialogTitle className="text-electric-cyan">Edit Scheduled Content</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4">
            <div className="space-y-2">
              <Label className="text-asteroid-silver">Title</Label>
              <Input
                value={editForm.title}
                onChange={(e) => setEditForm(prev => ({ ...prev, title: e.target.value }))}
                className="glassmorphism"
              />
            </div>
            
            <div className="space-y-2">
              <Label className="text-asteroid-silver">Description</Label>
              <Input
                value={editForm.description}
                onChange={(e) => setEditForm(prev => ({ ...prev, description: e.target.value }))}
                className="glassmorphism"
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-asteroid-silver">Date</Label>
                <Input
                  type="date"
                  value={editForm.scheduledDate}
                  onChange={(e) => setEditForm(prev => ({ ...prev, scheduledDate: e.target.value }))}
                  className="glassmorphism"
                />
              </div>
              
              <div className="space-y-2">
                <Label className="text-asteroid-silver">Time</Label>
                <Input
                  type="time"
                  value={editForm.scheduledTime}
                  onChange={(e) => setEditForm(prev => ({ ...prev, scheduledTime: e.target.value }))}
                  className="glassmorphism"
                />
              </div>
            </div>
            
            <div className="flex justify-end gap-3 pt-4">
              <Button
                variant="outline"
                onClick={() => setEditDialog(false)}
                className="glassmorphism"
              >
                Cancel
              </Button>
              <Button
                onClick={handleUpdate}
                disabled={updateContentMutation.isPending}
                className="bg-electric-cyan hover:bg-electric-cyan/80 text-cosmic-dark"
              >
                {updateContentMutation.isPending ? "Updating..." : "Update"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Progress Tracker */}
      {progressState.isVisible && (
        <PublishingProgressTracker
          contentType={scheduleForm.type}
          isPublishing={progressState.status === 'uploading'}
          isScheduled={false}
          contentId={publishingState.contentId}
          onComplete={() => setProgressState({ isVisible: false, status: 'idle', progress: 0, currentStep: '', timeRemaining: '' })}
        />
      )}
    </div>
  );
}
