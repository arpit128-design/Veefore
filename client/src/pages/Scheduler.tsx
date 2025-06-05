import { Calendar } from "@/components/scheduler/Calendar";
import { AutomationRules } from "@/components/scheduler/AutomationRules";
import { OptimalTimes } from "@/components/scheduler/OptimalTimes";
import { ScheduleDialog } from "@/components/scheduler/ScheduleDialog";
import { BulkScheduler } from "@/components/scheduler/BulkScheduler";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useWorkspace } from "@/hooks/useWorkspace";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Plus, Clock, Calendar as CalendarIcon, BarChart3, Zap, Upload } from "lucide-react";
import { useState } from "react";

export default function Scheduler() {
  const { currentWorkspace } = useWorkspace();
  const [isScheduleDialogOpen, setIsScheduleDialogOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [activeTab, setActiveTab] = useState("calendar");
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

  const handleScheduleContent = (date?: Date) => {
    setSelectedDate(date || null);
    setIsScheduleDialogOpen(true);
  };

  const handleDeleteContent = (contentId: number) => {
    deleteContentMutation.mutate(contentId);
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
            onClick={() => handleScheduleContent()}
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
      <ScheduleDialog
        isOpen={isScheduleDialogOpen}
        onClose={() => setIsScheduleDialogOpen(false)}
        selectedDate={selectedDate}
        workspaceId={currentWorkspace?.id}
      />
    </div>
  );
}
