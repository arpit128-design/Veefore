import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Upload, FileText, Calendar, Clock, Trash2, Play } from "lucide-react";

interface BulkSchedulerProps {
  isOpen: boolean;
  onClose: () => void;
  workspaceId?: number;
}

interface BulkContent {
  title: string;
  description: string;
  type: string;
  platform: string;
  scheduledAt: Date;
  file?: File;
}

export function BulkScheduler({ isOpen, onClose, workspaceId }: BulkSchedulerProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  const [bulkContent, setBulkContent] = useState<BulkContent[]>([]);
  const [globalSettings, setGlobalSettings] = useState({
    platform: "instagram",
    type: "post",
    startDate: new Date(),
    interval: "daily",
    intervalHours: 24,
    startTime: "09:00"
  });
  const [csvFile, setCsvFile] = useState<File | null>(null);

  const bulkCreateMutation = useMutation({
    mutationFn: async (contentList: any[]) => {
      const promises = contentList.map(content =>
        apiRequest('POST', '/api/content', {
          body: JSON.stringify(content)
        })
      );
      return Promise.all(promises);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['scheduled-content'] });
      toast({
        title: "Bulk content scheduled",
        description: `${bulkContent.length} pieces of content have been scheduled successfully.`
      });
      onClose();
      resetForm();
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to schedule bulk content. Please try again.",
        variant: "destructive"
      });
    }
  });

  const resetForm = () => {
    setBulkContent([]);
    setCsvFile(null);
  };

  const handleCsvUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type === 'text/csv') {
      setCsvFile(file);
      parseCSV(file);
    }
  };

  const parseCSV = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const csv = e.target?.result as string;
      const lines = csv.split('\n');
      const headers = lines[0].split(',').map(h => h.trim());
      
      const content: BulkContent[] = [];
      for (let i = 1; i < lines.length; i++) {
        const values = lines[i].split(',').map(v => v.trim());
        if (values.length >= 2) {
          const scheduledDate = new Date(globalSettings.startDate);
          scheduledDate.setDate(scheduledDate.getDate() + (i - 1) * (globalSettings.intervalHours / 24));
          const [hours, minutes] = globalSettings.startTime.split(':');
          scheduledDate.setHours(parseInt(hours), parseInt(minutes));

          content.push({
            title: values[0] || `Content ${i}`,
            description: values[1] || '',
            type: values[2] || globalSettings.type,
            platform: values[3] || globalSettings.platform,
            scheduledAt: scheduledDate
          });
        }
      }
      setBulkContent(content);
    };
    reader.readAsText(file);
  };

  const addManualContent = () => {
    const newDate = new Date(globalSettings.startDate);
    newDate.setDate(newDate.getDate() + bulkContent.length * (globalSettings.intervalHours / 24));
    const [hours, minutes] = globalSettings.startTime.split(':');
    newDate.setHours(parseInt(hours), parseInt(minutes));

    setBulkContent(prev => [...prev, {
      title: "",
      description: "",
      type: globalSettings.type,
      platform: globalSettings.platform,
      scheduledAt: newDate
    }]);
  };

  const updateContent = (index: number, field: keyof BulkContent, value: any) => {
    setBulkContent(prev => prev.map((content, i) => 
      i === index ? { ...content, [field]: value } : content
    ));
  };

  const removeContent = (index: number) => {
    setBulkContent(prev => prev.filter((_, i) => i !== index));
  };

  const generateSchedule = () => {
    if (bulkContent.length === 0) return;

    const updatedContent = bulkContent.map((content, index) => {
      const scheduledDate = new Date(globalSettings.startDate);
      scheduledDate.setDate(scheduledDate.getDate() + index * (globalSettings.intervalHours / 24));
      const [hours, minutes] = globalSettings.startTime.split(':');
      scheduledDate.setHours(parseInt(hours), parseInt(minutes));

      return {
        ...content,
        scheduledAt: scheduledDate,
        type: content.type || globalSettings.type,
        platform: content.platform || globalSettings.platform
      };
    });

    setBulkContent(updatedContent);
  };

  const handleSubmit = () => {
    if (!workspaceId || bulkContent.length === 0) {
      toast({
        title: "Missing information",
        description: "Please add content to schedule.",
        variant: "destructive"
      });
      return;
    }

    const contentData = bulkContent.map(content => ({
      workspaceId,
      title: content.title,
      description: content.description,
      type: content.type,
      platform: content.platform,
      scheduledAt: content.scheduledAt.toISOString(),
      contentData: {}
    }));

    bulkCreateMutation.mutate(contentData);
  };

  const downloadCSVTemplate = () => {
    const csvContent = "title,description,type,platform\n" +
      "Sample Post 1,This is a sample post description,post,instagram\n" +
      "Sample Post 2,Another sample description,reel,instagram\n" +
      "Sample Post 3,Third sample post,story,facebook";
    
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.style.display = 'none';
    a.href = url;
    a.download = 'bulk_content_template.csv';
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto glassmorphism border-electric-cyan/20">
        <DialogHeader>
          <DialogTitle className="text-2xl font-orbitron font-semibold text-electric-cyan">
            Bulk Content Scheduler
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Global Settings */}
          <Card className="content-card holographic">
            <CardHeader>
              <CardTitle className="text-lg font-orbitron text-electric-cyan">
                Global Settings
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label className="text-asteroid-silver">Default Platform</Label>
                  <Select 
                    value={globalSettings.platform} 
                    onValueChange={(value) => setGlobalSettings(prev => ({ ...prev, platform: value }))}
                  >
                    <SelectTrigger className="glassmorphism">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="instagram">Instagram</SelectItem>
                      <SelectItem value="facebook">Facebook</SelectItem>
                      <SelectItem value="twitter">Twitter</SelectItem>
                      <SelectItem value="linkedin">LinkedIn</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label className="text-asteroid-silver">Default Type</Label>
                  <Select 
                    value={globalSettings.type} 
                    onValueChange={(value) => setGlobalSettings(prev => ({ ...prev, type: value }))}
                  >
                    <SelectTrigger className="glassmorphism">
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

                <div className="space-y-2">
                  <Label className="text-asteroid-silver">Start Time</Label>
                  <Input
                    type="time"
                    value={globalSettings.startTime}
                    onChange={(e) => setGlobalSettings(prev => ({ ...prev, startTime: e.target.value }))}
                    className="glassmorphism"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label className="text-asteroid-silver">Start Date</Label>
                  <Input
                    type="date"
                    value={globalSettings.startDate.toISOString().split('T')[0]}
                    onChange={(e) => setGlobalSettings(prev => ({ 
                      ...prev, 
                      startDate: new Date(e.target.value) 
                    }))}
                    className="glassmorphism"
                  />
                </div>

                <div className="space-y-2">
                  <Label className="text-asteroid-silver">Posting Interval</Label>
                  <Select 
                    value={globalSettings.interval} 
                    onValueChange={(value) => {
                      const hours = value === 'daily' ? 24 : value === 'twice-daily' ? 12 : value === 'weekly' ? 168 : 24;
                      setGlobalSettings(prev => ({ ...prev, interval: value, intervalHours: hours }));
                    }}
                  >
                    <SelectTrigger className="glassmorphism">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="daily">Daily</SelectItem>
                      <SelectItem value="twice-daily">Twice Daily</SelectItem>
                      <SelectItem value="weekly">Weekly</SelectItem>
                      <SelectItem value="custom">Custom</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {globalSettings.interval === 'custom' && (
                  <div className="space-y-2">
                    <Label className="text-asteroid-silver">Hours Between Posts</Label>
                    <Input
                      type="number"
                      value={globalSettings.intervalHours}
                      onChange={(e) => setGlobalSettings(prev => ({ 
                        ...prev, 
                        intervalHours: parseInt(e.target.value) || 24 
                      }))}
                      className="glassmorphism"
                      min="1"
                    />
                  </div>
                )}
              </div>

              <div className="flex items-center space-x-4">
                <Button onClick={generateSchedule} variant="outline" className="glassmorphism">
                  <Calendar className="w-4 h-4 mr-2" />
                  Generate Schedule
                </Button>
                <Button onClick={addManualContent} variant="outline" className="glassmorphism">
                  <FileText className="w-4 h-4 mr-2" />
                  Add Manual Entry
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* CSV Upload */}
          <Card className="content-card holographic">
            <CardHeader>
              <CardTitle className="text-lg font-orbitron text-electric-cyan">
                CSV Import
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center space-x-4">
                <div className="flex-1">
                  <input
                    type="file"
                    accept=".csv"
                    onChange={handleCsvUpload}
                    className="hidden"
                    id="csv-upload"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    className="glassmorphism"
                    onClick={() => document.getElementById('csv-upload')?.click()}
                  >
                    <Upload className="w-4 h-4 mr-2" />
                    Upload CSV
                  </Button>
                </div>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={downloadCSVTemplate}
                  className="text-electric-cyan"
                >
                  Download Template
                </Button>
              </div>
              {csvFile && (
                <div className="text-sm text-asteroid-silver">
                  Loaded: {csvFile.name} ({bulkContent.length} entries)
                </div>
              )}
            </CardContent>
          </Card>

          {/* Content List */}
          {bulkContent.length > 0 && (
            <Card className="content-card holographic">
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="text-lg font-orbitron text-electric-cyan">
                  Content Queue ({bulkContent.length} items)
                </CardTitle>
                <Badge variant="secondary">
                  {bulkContent.filter(c => c.title.trim()).length} ready
                </Badge>
              </CardHeader>
              <CardContent className="space-y-4 max-h-96 overflow-y-auto">
                {bulkContent.map((content, index) => (
                  <div key={index} className="p-4 border border-electric-cyan/20 rounded-lg space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <span className="text-sm font-mono text-asteroid-silver">#{index + 1}</span>
                        <Badge variant="outline">{content.platform}</Badge>
                        <Badge variant="outline">{content.type}</Badge>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className="text-xs text-asteroid-silver">
                          {content.scheduledAt.toLocaleString()}
                        </span>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeContent(index)}
                          className="text-red-400 hover:text-red-300"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <Input
                        placeholder="Content title..."
                        value={content.title}
                        onChange={(e) => updateContent(index, 'title', e.target.value)}
                        className="glassmorphism"
                      />
                      <Input
                        placeholder="Description..."
                        value={content.description}
                        onChange={(e) => updateContent(index, 'description', e.target.value)}
                        className="glassmorphism"
                      />
                    </div>
                  </div>
                ))}
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
              onClick={handleSubmit}
              disabled={bulkCreateMutation.isPending || bulkContent.length === 0}
              className="bg-gradient-to-r from-blue-500 to-purple-500 hover:opacity-90"
            >
              <Play className="w-4 h-4 mr-2" />
              {bulkCreateMutation.isPending ? "Scheduling..." : `Schedule ${bulkContent.length} Items`}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}