import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useWorkspace } from "@/hooks/useWorkspace";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Calendar, Clock, Edit, Trash2, Play, Pause, Image as ImageIcon, Video, FileText, AlertCircle } from "lucide-react";
import { PublishingProgressTracker } from "@/components/PublishingProgressTracker";

interface ScheduledContentItem {
  id: string;
  title: string;
  description: string;
  type: string;
  platform: string;
  status: string;
  scheduledAt: string;
  contentData: {
    mediaUrl?: string;
    caption?: string;
  };
  createdAt: string;
}

interface EditFormData {
  id: string;
  title: string;
  description: string;
  scheduledDate: string;
  scheduledTime: string;
}

export default function ScheduledContent() {
  const { currentWorkspace } = useWorkspace();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  const [editDialog, setEditDialog] = useState(false);
  const [publishingItems, setPublishingItems] = useState<Set<string>>(new Set());
  const [editForm, setEditForm] = useState<EditFormData>({
    id: "",
    title: "",
    description: "",
    scheduledDate: "",
    scheduledTime: ""
  });

  // Fetch scheduled content
  const { data: scheduledContent = [], isLoading } = useQuery({
    queryKey: ['scheduled-content', currentWorkspace?.id],
    queryFn: async () => {
      const response = await apiRequest('GET', `/api/content?workspaceId=${currentWorkspace?.id}&status=scheduled`);
      return response.json();
    },
    enabled: !!currentWorkspace?.id,
    refetchInterval: 30000 // Refresh every 30 seconds
  });

  // Delete scheduled content mutation
  const deleteMutation = useMutation({
    mutationFn: async (contentId: string) => {
      const response = await apiRequest('DELETE', `/api/content/${contentId}`);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['scheduled-content'] });
      toast({
        title: "Content Cancelled",
        description: "Scheduled content has been cancelled successfully.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to cancel scheduled content",
        variant: "destructive",
      });
    }
  });

  // Update scheduled content mutation
  const updateMutation = useMutation({
    mutationFn: async (data: EditFormData) => {
      const scheduledAt = new Date(`${data.scheduledDate}T${data.scheduledTime}`).toISOString();
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
        title: "Content Updated",
        description: "Scheduled content has been updated successfully.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to update scheduled content",
        variant: "destructive",
      });
    }
  });

  const formatDateTime = (dateString: string) => {
    const date = new Date(dateString);
    return {
      date: date.toLocaleDateString(),
      time: date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
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
      case 'post': return <ImageIcon className="h-4 w-4" />;
      default: return <FileText className="h-4 w-4" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'scheduled': return 'bg-blue-500';
      case 'publishing': return 'bg-blue-500';
      case 'published': return 'bg-green-500';
      case 'failed': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const handleEdit = (content: ScheduledContentItem) => {
    const scheduled = new Date(content.scheduledAt);
    setEditForm({
      id: content.id,
      title: content.title,
      description: content.description,
      scheduledDate: scheduled.toISOString().split('T')[0],
      scheduledTime: scheduled.toTimeString().slice(0, 5)
    });
    setEditDialog(true);
  };

  const handleDelete = (contentId: string) => {
    if (window.confirm('Are you sure you want to cancel this scheduled post?')) {
      deleteMutation.mutate(contentId);
    }
  };

  const handleUpdate = () => {
    updateMutation.mutate(editForm);
  };

  // Post Now functionality with progress tracking
  const publishNowMutation = useMutation({
    mutationFn: async (contentId: string) => {
      console.log(`[CLIENT] Starting immediate publish for content ${contentId}`);
      const response = await fetch(`/api/content/${contentId}/publish`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`
        }
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Publishing failed');
      }
      
      return response.json();
    },
    onSuccess: (data, contentId) => {
      console.log(`[CLIENT] Publish request successful for ${contentId}:`, data);
      
      // Start polling for status updates
      const pollInterval = setInterval(async () => {
        try {
          queryClient.invalidateQueries({ queryKey: ['/api/content'] });
          
          // Check if content is no longer in publishing state
          const updatedContent = scheduledContent.find((c: ScheduledContentItem) => c.id === contentId);
          if (updatedContent && updatedContent.status !== 'publishing') {
            clearInterval(pollInterval);
            
            setPublishingItems(prev => {
              const updated = new Set(prev);
              updated.delete(contentId);
              return updated;
            });
            
            if (updatedContent.status === 'published') {
              toast({
                title: "Success!",
                description: "Content published successfully to Instagram."
              });
            } else if (updatedContent.status === 'failed') {
              toast({
                title: "Publishing Failed",
                description: updatedContent.errorMessage || "Failed to publish content",
                variant: "destructive"
              });
            }
          }
        } catch (error) {
          console.error('[CLIENT] Status polling error:', error);
        }
      }, 3000);
      
      // Clear polling after 2 minutes maximum
      setTimeout(() => {
        clearInterval(pollInterval);
        setPublishingItems(prev => {
          const updated = new Set(prev);
          updated.delete(contentId);
          return updated;
        });
      }, 120000);
    },
    onError: (error: any, contentId) => {
      console.error('[CLIENT] Publish request failed:', error);
      setPublishingItems(prev => {
        const updated = new Set(prev);
        updated.delete(contentId);
        return updated;
      });
      toast({
        title: "Publishing Failed",
        description: error.message || "Failed to start publishing process",
        variant: "destructive",
      });
    }
  });

  const handlePostNow = (contentId: string) => {
    console.log(`[CLIENT] Post Now clicked for content ${contentId}`);
    // Start showing progress tracker immediately
    setPublishingItems(prev => new Set(prev).add(contentId));
    publishNowMutation.mutate(contentId);
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold text-electric-cyan">Scheduled Content</h1>
        </div>
        <div className="grid gap-4">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="content-card glassmorphism animate-pulse">
              <CardContent className="p-6">
                <div className="h-4 bg-gray-300 rounded w-3/4 mb-2"></div>
                <div className="h-3 bg-gray-300 rounded w-1/2"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-electric-cyan">Scheduled Content</h1>
          <p className="text-asteroid-silver mt-2">
            Manage your scheduled posts and content
          </p>
        </div>
        <Badge variant="secondary" className="text-sm">
          {scheduledContent.length} posts scheduled
        </Badge>
      </div>

      {scheduledContent.length === 0 ? (
        <Card className="content-card glassmorphism">
          <CardContent className="p-12 text-center">
            <Calendar className="h-12 w-12 mx-auto text-asteroid-silver mb-4" />
            <h3 className="text-lg font-semibold text-white mb-2">No Scheduled Content</h3>
            <p className="text-asteroid-silver">
              You don't have any content scheduled for publishing yet.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {scheduledContent.map((content: ScheduledContentItem) => {
            const { date, time } = formatDateTime(content.scheduledAt);
            const timeUntil = getTimeUntilScheduled(content.scheduledAt);
            
            return (
              <Card key={content.id} className="content-card glassmorphism hover:border-electric-cyan/50 transition-colors">
                <CardContent className="p-6">
                  {/* Publishing Progress Tracker for Scheduled Content */}
                  {publishingItems.has(content.id) && (
                    <div className="mb-4">
                      <PublishingProgressTracker 
                        contentType={content.type}
                        isPublishing={true}
                        isScheduled={true}
                        contentId={content.id}
                        onComplete={() => {
                          setPublishingItems(prev => {
                            const updated = new Set(prev);
                            updated.delete(content.id);
                            return updated;
                          });
                          toast({
                            title: "Content Published Successfully!",
                            description: `Your ${content.type} has been published to ${content.platform}.`
                          });
                        }}
                      />
                    </div>
                  )}
                  
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-3">
                        {getContentIcon(content.type)}
                        <h3 className="font-semibold text-white">{content.title}</h3>
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
                          <Calendar className="h-4 w-4" />
                          {date}
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="h-4 w-4" />
                          {time}
                        </div>
                        <div className="flex items-center gap-1">
                          <AlertCircle className="h-4 w-4" />
                          {timeUntil}
                        </div>
                      </div>
                      
                      {content.contentData?.mediaUrl && (
                        <div className="mt-3">
                          <img 
                            src={content.contentData.mediaUrl} 
                            alt="Content preview" 
                            className="w-16 h-16 object-cover rounded-lg border border-cosmic-dark"
                          />
                        </div>
                      )}
                    </div>
                    
                    <div className="flex flex-col gap-2">
                      <div className="flex items-center gap-2">
                        <Button
                          variant="default"
                          size="sm"
                          onClick={() => handlePostNow(content.id)}
                          className="bg-electric-cyan hover:bg-electric-cyan/80 text-black font-medium"
                          disabled={publishingItems.has(content.id)}
                        >
                          <Play className="h-4 w-4 mr-1" />
                          Post Now
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEdit(content)}
                          className="glassmorphism"
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDelete(content.id)}
                          className="glassmorphism text-red-400 hover:text-red-300"
                          disabled={deleteMutation.isPending}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      {/* Edit Dialog */}
      <Dialog open={editDialog} onOpenChange={setEditDialog}>
        <DialogContent className="glassmorphism border-cosmic-dark">
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
            
            <div className="flex justify-end gap-3">
              <Button
                variant="outline"
                onClick={() => setEditDialog(false)}
                className="glassmorphism"
              >
                Cancel
              </Button>
              <Button
                onClick={handleUpdate}
                disabled={updateMutation.isPending}
                className="bg-electric-cyan hover:bg-electric-cyan/80 text-cosmic-dark"
              >
                {updateMutation.isPending ? "Updating..." : "Update"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}