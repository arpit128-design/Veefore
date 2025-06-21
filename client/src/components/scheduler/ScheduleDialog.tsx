import { useState, useRef } from "react";
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
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { useWorkspace } from "@/hooks/useWorkspace";
import { format } from "date-fns";
import { 
  Calendar as CalendarIcon, 
  Clock, 
  Image, 
  Video, 
  FileText, 
  Upload, 
  X, 
  Instagram, 
  Youtube, 
  Twitter, 
  Linkedin, 
  Facebook,
  Sparkles 
} from "lucide-react";

interface ScheduleDialogProps {
  isOpen: boolean;
  onClose: () => void;
  selectedDate?: Date | null;
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

export function ScheduleDialog({ isOpen, onClose, selectedDate }: ScheduleDialogProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { currentWorkspace } = useWorkspace();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [form, setForm] = useState<ContentForm>({
    title: "",
    description: "",
    type: "post",
    platform: "",
    scheduledDate: selectedDate || undefined,
    scheduledTime: "09:00",
    contentData: {}
  });

  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [mediaPreview, setMediaPreview] = useState<string | null>(null);
  const [useOptimalTime, setUseOptimalTime] = useState(false);

  // Get connected social accounts for current workspace
  const { data: socialAccounts = [] } = useQuery({
    queryKey: ['/api/social-accounts'],
    enabled: !!currentWorkspace?.id,
  });

  const platformIcons = {
    instagram: Instagram,
    youtube: Youtube,
    twitter: Twitter,
    linkedin: Linkedin,
    facebook: Facebook,
  };

  const createContentMutation = useMutation({
    mutationFn: async (contentData: any) => {
      // Validate workspace and social account
      if (!currentWorkspace?.id) {
        throw new Error('No workspace selected');
      }
      
      const connectedAccount = socialAccounts.find(account => account.platform === contentData.platform);
      if (!connectedAccount) {
        throw new Error(`No ${contentData.platform} account connected to this workspace`);
      }

      const formData = new FormData();
      
      // Add workspace validation
      formData.append('workspaceId', currentWorkspace.id);
      formData.append('socialAccountId', connectedAccount.id);
      formData.append('title', contentData.title);
      formData.append('description', contentData.description);
      formData.append('type', contentData.type);
      formData.append('platform', contentData.platform);
      formData.append('scheduledAt', contentData.scheduledAt);
      
      // Add media files if any
      uploadedFiles.forEach((file, index) => {
        formData.append(`mediaFile_${index}`, file);
      });
      
      if (uploadedFiles.length > 0) {
        formData.append('mediaCount', uploadedFiles.length.toString());
      }

      const response = await apiRequest('/api/scheduled-content', {
        method: 'POST',
        body: formData,
      });
      
      return response;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/scheduled-content'] });
      toast({
        title: "Content scheduled successfully",
        description: `Your content has been scheduled to your ${form.platform} account.`
      });
      onClose();
      resetForm();
    },
    onError: (error: any) => {
      toast({
        title: "Failed to schedule content",
        description: error.message || "Please check your connection and try again.",
        variant: "destructive"
      });
    }
  });

  const resetForm = () => {
    setForm({
      title: "",
      description: "",
      type: "post",
      platform: "",
      scheduledDate: selectedDate || undefined,
      scheduledTime: "09:00",
      contentData: {}
    });
    setUploadedFiles([]);
    setMediaPreview(null);
    setUseOptimalTime(false);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!currentWorkspace?.id || !form.title || !form.platform || !form.scheduledDate) {
      toast({
        title: "Missing information",
        description: "Please fill in all required fields.",
        variant: "destructive"
      });
      return;
    }

    // Check if platform account is connected
    const connectedAccount = socialAccounts.find(account => account.platform === form.platform);
    if (!connectedAccount) {
      toast({
        title: "Account not connected",
        description: `Please connect your ${form.platform} account first from the Connections page.`,
        variant: "destructive"
      });
      return;
    }

    const scheduledDateTime = new Date(form.scheduledDate);
    const [hours, minutes] = form.scheduledTime.split(':');
    scheduledDateTime.setHours(parseInt(hours), parseInt(minutes));

    const contentData = {
      title: form.title,
      description: form.description,
      type: form.type,
      platform: form.platform,
      scheduledAt: scheduledDateTime.toISOString(),
    };

    createContentMutation.mutate(contentData);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    
    files.forEach(file => {
      // Create preview for images and videos
      if (file.type.startsWith('image/') || file.type.startsWith('video/')) {
        const reader = new FileReader();
        reader.onload = (e) => {
          setMediaPreview(e.target?.result as string);
        };
        reader.readAsDataURL(file);
      }
    });
    
    setUploadedFiles(prev => [...prev, ...files]);
  };

  const removeFile = (index: number) => {
    setUploadedFiles(prev => prev.filter((_, i) => i !== index));
    if (uploadedFiles.length === 1) {
      setMediaPreview(null);
    }
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
      case 'youtube':
        return ['14:00', '18:00', '20:00', '21:00'];
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

  const getOptimalTimeForPlatform = () => {
    if (!form.platform) return '';
    
    const now = new Date();
    const currentHour = now.getHours();
    const optimalTimes = getOptimalTimes();
    
    // Find the next optimal time
    const nextOptimalTime = optimalTimes.find(time => {
      const [hours] = time.split(':');
      return parseInt(hours) > currentHour;
    }) || optimalTimes[0]; // Default to first optimal time if none found
    
    return nextOptimalTime;
  };

  // Auto-set optimal time when platform changes and optimal time is enabled
  const handlePlatformChange = (platform: string) => {
    setForm(prev => ({ ...prev, platform }));
    if (useOptimalTime) {
      const optimalTime = getOptimalTimeForPlatform();
      setForm(prev => ({ ...prev, scheduledTime: optimalTime }));
    }
  };

  const toggleOptimalTime = () => {
    const newUseOptimalTime = !useOptimalTime;
    setUseOptimalTime(newUseOptimalTime);
    
    if (newUseOptimalTime && form.platform) {
      const optimalTime = getOptimalTimeForPlatform();
      setForm(prev => ({ ...prev, scheduledTime: optimalTime }));
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl glassmorphism border-electric-cyan/20 max-h-[90vh] overflow-y-auto">
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
              <Select value={form.platform} onValueChange={handlePlatformChange}>
                <SelectTrigger className="glassmorphism">
                  <SelectValue placeholder="Select connected platform" />
                </SelectTrigger>
                <SelectContent>
                  {socialAccounts.map((account) => {
                    const Icon = platformIcons[account.platform as keyof typeof platformIcons];
                    return (
                      <SelectItem key={account.id} value={account.platform}>
                        <div className="flex items-center space-x-2">
                          {Icon && <Icon className="w-4 h-4" />}
                          <span>{account.platform.charAt(0).toUpperCase() + account.platform.slice(1)}</span>
                          <span className="text-xs text-muted-foreground">@{account.username}</span>
                        </div>
                      </SelectItem>
                    );
                  })}
                  {socialAccounts.length === 0 && (
                    <SelectItem value="" disabled>
                      No social accounts connected
                    </SelectItem>
                  )}
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
                  className={`glassmorphism ${form.type === type.value ? 'bg-electric-cyan text-black' : ''}`}
                  onClick={() => setForm(prev => ({ ...prev, type: type.value }))}
                >
                  {getContentTypeIcon(type.value)}
                  <span className="ml-2">{type.label}</span>
                </Button>
              ))}
            </div>
          </div>

          {/* Media File Upload */}
          <div className="space-y-2">
            <Label className="text-asteroid-silver">Media Files</Label>
            <div className="border-2 border-dashed border-electric-cyan/20 rounded-lg p-6 glassmorphism">
              <div className="text-center">
                <Upload className="h-8 w-8 text-asteroid-silver mx-auto mb-2" />
                <p className="text-asteroid-silver text-sm mb-2">Upload images, videos, or documents</p>
                <input
                  ref={fileInputRef}
                  type="file"
                  multiple
                  accept="image/*,video/*,.pdf,.doc,.docx"
                  onChange={handleFileUpload}
                  className="hidden"
                />
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="glassmorphism"
                  onClick={() => fileInputRef.current?.click()}
                >
                  Choose Files
                </Button>
              </div>
              
              {/* File Preview */}
              {uploadedFiles.length > 0 && (
                <div className="mt-4 space-y-2">
                  {uploadedFiles.map((file, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-cosmic-blue/30 border border-electric-cyan/20 rounded glassmorphism">
                      <div className="flex items-center space-x-3">
                        <div className="flex-shrink-0">
                          {file.type.startsWith('image/') && <Image className="w-5 h-5 text-electric-cyan" />}
                          {file.type.startsWith('video/') && <Video className="w-5 h-5 text-electric-cyan" />}
                          {!file.type.startsWith('image/') && !file.type.startsWith('video/') && <FileText className="w-5 h-5 text-electric-cyan" />}
                        </div>
                        <div>
                          <p className="text-sm font-medium text-white truncate max-w-[200px]">{file.name}</p>
                          <p className="text-xs text-asteroid-silver">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                        </div>
                      </div>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => removeFile(index)}
                        className="text-red-400 hover:text-red-300 h-8 w-8 p-0"
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                  ))}
                  
                  {/* Media Preview */}
                  {mediaPreview && uploadedFiles[0] && (
                    <div className="mt-3 p-3 border border-space-gray rounded-lg glassmorphism">
                      <p className="text-sm text-asteroid-silver mb-2">Preview:</p>
                      {uploadedFiles[0].type.startsWith('image/') && (
                        <img
                          src={mediaPreview}
                          alt="Preview"
                          className="max-w-full h-48 object-cover rounded-md border border-space-gray"
                        />
                      )}
                      {uploadedFiles[0].type.startsWith('video/') && (
                        <video
                          src={mediaPreview}
                          className="max-w-full h-48 object-cover rounded-md border border-space-gray"
                          controls
                        />
                      )}
                    </div>
                  )}
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
              <div className="flex items-center justify-between">
                <Label className="text-asteroid-silver">Time *</Label>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={toggleOptimalTime}
                  className={`h-6 px-2 text-xs ${useOptimalTime ? 'bg-electric-cyan text-black' : 'text-asteroid-silver'}`}
                >
                  <Sparkles className="w-3 h-3 mr-1" />
                  Optimal
                </Button>
              </div>
              
              <Select value={form.scheduledTime} onValueChange={(value) => setForm(prev => ({ ...prev, scheduledTime: value }))}>
                <SelectTrigger className="glassmorphism">
                  <Clock className="mr-2 h-4 w-4" />
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {useOptimalTime && form.platform && getOptimalTimes().map((time) => (
                    <SelectItem key={time} value={time}>
                      <div className="flex items-center space-x-2">
                        <span>{time}</span>
                        <Badge variant="secondary" className="text-xs bg-electric-cyan text-black">Optimal</Badge>
                      </div>
                    </SelectItem>
                  ))}
                  {/* All available times */}
                  {Array.from({ length: 24 }, (_, i) => {
                    const time = `${i.toString().padStart(2, '0')}:00`;
                    const isOptimal = useOptimalTime && form.platform && getOptimalTimes().includes(time);
                    
                    if (useOptimalTime && !isOptimal) return null;
                    
                    return (
                      <SelectItem key={time} value={time}>
                        {time}
                      </SelectItem>
                    );
                  })}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Optimal Times Information */}
          {form.platform && useOptimalTime && (
            <Card className="content-card holographic">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-electric-cyan flex items-center">
                  <Sparkles className="w-4 h-4 mr-2" />
                  Optimal posting times for {form.platform}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {getOptimalTimes().map((time) => (
                    <Badge
                      key={time}
                      variant={form.scheduledTime === time ? "default" : "secondary"}
                      className={`cursor-pointer ${form.scheduledTime === time ? 'bg-electric-cyan text-black' : ''}`}
                      onClick={() => setForm(prev => ({ ...prev, scheduledTime: time }))}
                    >
                      {time}
                    </Badge>
                  ))}
                </div>
                <p className="text-xs text-asteroid-silver mt-2">
                  These times show the highest engagement rates for your audience.
                </p>
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
              disabled={createContentMutation.isPending || socialAccounts.length === 0}
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