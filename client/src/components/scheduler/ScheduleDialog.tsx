import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";
import { Calendar as CalendarIcon, Clock, Image, Video, FileText, Upload } from "lucide-react";

interface ScheduleDialogProps {
  isOpen: boolean;
  onClose: () => void;
  selectedDate?: Date | null;
  workspaceId?: number;
}

interface ContentForm {
  title: string;
  description: string;
  type: string;
  platform: string;
  scheduledDate: Date | undefined;
  scheduledTime: string;
  contentData: any;
}

export function ScheduleDialog({ isOpen, onClose, selectedDate, workspaceId }: ScheduleDialogProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  const [form, setForm] = useState<ContentForm>({
    title: "",
    description: "",
    type: "post",
    platform: "instagram",
    scheduledDate: selectedDate || undefined,
    scheduledTime: "09:00",
    contentData: {}
  });

  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);

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
      onClose();
      resetForm();
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to schedule content. Please try again.",
        variant: "destructive"
      });
    }
  });

  const resetForm = () => {
    setForm({
      title: "",
      description: "",
      type: "post",
      platform: "instagram",
      scheduledDate: selectedDate || undefined,
      scheduledTime: "09:00",
      contentData: {}
    });
    setUploadedFiles([]);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!workspaceId || !form.title || !form.scheduledDate) {
      toast({
        title: "Missing information",
        description: "Please fill in all required fields.",
        variant: "destructive"
      });
      return;
    }

    const scheduledDateTime = new Date(form.scheduledDate);
    const [hours, minutes] = form.scheduledTime.split(':');
    scheduledDateTime.setHours(parseInt(hours), parseInt(minutes));

    const contentData = {
      workspaceId,
      title: form.title,
      description: form.description,
      type: form.type,
      platform: form.platform,
      scheduledAt: scheduledDateTime.toISOString(),
      contentData: {
        ...form.contentData,
        files: uploadedFiles.map(file => ({
          name: file.name,
          type: file.type,
          size: file.size
        }))
      }
    };

    createContentMutation.mutate(contentData);
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    
    for (const file of files) {
      try {
        const formData = new FormData();
        formData.append('file', file);
        
        const response = await apiRequest('/api/upload', {
          method: 'POST',
          body: formData,
          headers: {} // Let browser set Content-Type for FormData
        });
        
        if (response.success) {
          // Update form content data with the uploaded file URL
          setForm(prev => ({
            ...prev,
            contentData: {
              ...prev.contentData,
              mediaUrl: response.fileUrl
            }
          }));
          
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
      }
    }
    
    setUploadedFiles(prev => [...prev, ...files]);
  };

  const removeFile = (index: number) => {
    setUploadedFiles(prev => prev.filter((_, i) => i !== index));
  };

  const getOptimalTimes = () => {
    const platform = form.platform;
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

  const getContentTypeIcon = (type: string) => {
    switch (type) {
      case 'video': return <Video className="h-4 w-4" />;
      case 'reel': return <Video className="h-4 w-4" />;
      case 'post': return <Image className="h-4 w-4" />;
      case 'story': return <Image className="h-4 w-4" />;
      default: return <FileText className="h-4 w-4" />;
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl glassmorphism border-electric-cyan/20">
        <DialogHeader>
          <DialogTitle className="text-2xl font-orbitron font-semibold neon-text text-electric-cyan">
            Schedule New Content
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Content Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="title" className="text-asteroid-silver">Title *</Label>
              <Input
                id="title"
                value={form.title}
                onChange={(e) => setForm(prev => ({ ...prev, title: e.target.value }))}
                placeholder="Enter content title..."
                className="glassmorphism"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="platform" className="text-asteroid-silver">Platform *</Label>
              <Select value={form.platform} onValueChange={(value) => setForm(prev => ({ ...prev, platform: value }))}>
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
            <Label htmlFor="description" className="text-asteroid-silver">Description</Label>
            <Textarea
              id="description"
              value={form.description}
              onChange={(e) => setForm(prev => ({ ...prev, description: e.target.value }))}
              placeholder="Write your content description or caption..."
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
                  variant={form.type === type.value ? "default" : "outline"}
                  className={`glassmorphism ${form.type === type.value ? 'bg-electric-cyan' : ''}`}
                  onClick={() => setForm(prev => ({ ...prev, type: type.value }))}
                >
                  {getContentTypeIcon(type.value)}
                  <span className="ml-2">{type.label}</span>
                </Button>
              ))}
            </div>
          </div>

          {/* File Upload */}
          <div className="space-y-2">
            <Label className="text-asteroid-silver">Media Files</Label>
            <div className="border-2 border-dashed border-electric-cyan/20 rounded-lg p-6 glassmorphism">
              <div className="text-center">
                <Upload className="h-8 w-8 text-asteroid-silver mx-auto mb-2" />
                <p className="text-asteroid-silver text-sm mb-2">Upload images, videos, or documents</p>
                <input
                  type="file"
                  multiple
                  accept="image/*,video/*,.pdf,.doc,.docx"
                  onChange={handleFileUpload}
                  className="hidden"
                  id="file-upload"
                />
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="glassmorphism"
                  onClick={() => document.getElementById('file-upload')?.click()}
                >
                  Choose Files
                </Button>
              </div>
              
              {uploadedFiles.length > 0 && (
                <div className="mt-4 space-y-2">
                  {uploadedFiles.map((file, index) => (
                    <div key={index} className="flex items-center justify-between p-2 bg-cosmic-blue rounded">
                      <span className="text-sm text-asteroid-silver">{file.name}</span>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => removeFile(index)}
                        className="text-red-400 hover:text-red-300"
                      >
                        Remove
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Scheduling */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-asteroid-silver">Schedule Date *</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-full glassmorphism justify-start text-left font-normal"
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {form.scheduledDate ? format(form.scheduledDate, "PPP") : "Pick a date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0 glassmorphism" align="start">
                  <Calendar
                    mode="single"
                    selected={form.scheduledDate}
                    onSelect={(date) => setForm(prev => ({ ...prev, scheduledDate: date }))}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>

            <div className="space-y-2">
              <Label className="text-asteroid-silver">Time *</Label>
              <Select value={form.scheduledTime} onValueChange={(value) => setForm(prev => ({ ...prev, scheduledTime: value }))}>
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
          {form.platform && (
            <Card className="content-card holographic">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-electric-cyan">
                  Optimal posting times for {form.platform}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {getOptimalTimes().map((time) => (
                    <Badge
                      key={time}
                      variant={form.scheduledTime === time ? "default" : "secondary"}
                      className="cursor-pointer"
                      onClick={() => setForm(prev => ({ ...prev, scheduledTime: time }))}
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
              onClick={onClose}
              className="glassmorphism"
            >
              Cancel
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
      </DialogContent>
    </Dialog>
  );
}