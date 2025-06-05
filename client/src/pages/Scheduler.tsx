import { Calendar } from "@/components/scheduler/Calendar";
import { AutomationRules } from "@/components/scheduler/AutomationRules";
import { OptimalTimes } from "@/components/scheduler/OptimalTimes";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useWorkspace } from "@/hooks/useWorkspace";
import { useQuery } from "@tanstack/react-query";
import { Plus, Clock, Calendar as CalendarIcon } from "lucide-react";

export default function Scheduler() {
  const { currentWorkspace } = useWorkspace();

  const { data: scheduledContent } = useQuery({
    queryKey: ['scheduled-content', currentWorkspace?.id],
    queryFn: () => fetch(`/api/content?workspaceId=${currentWorkspace?.id}&status=scheduled`).then(res => res.json()),
    enabled: !!currentWorkspace?.id
  });

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-4xl font-orbitron font-bold neon-text text-solar-gold">
          Mission Scheduler
        </h2>
        <Button className="bg-gradient-to-r from-solar-gold to-orange-500 hover:opacity-90 transition-opacity">
          <Plus className="w-4 h-4 mr-2" />
          Schedule New Content
        </Button>
      </div>

      {/* Calendar View */}
      <Calendar />

      {/* Automation and Scheduled Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Active Automations */}
        <AutomationRules />

        {/* Upcoming Launches */}
        <Card className="content-card holographic">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xl font-orbitron font-semibold neon-text text-electric-cyan">
              Upcoming Launches
            </CardTitle>
            <Button variant="ghost" size="sm" className="text-electric-cyan hover:text-white">
              View All
            </Button>
          </CardHeader>
          <CardContent>
            {scheduledContent && scheduledContent.length > 0 ? (
              <div className="space-y-4">
                {scheduledContent.slice(0, 6).map((content: any) => (
                  <div key={content.id} className="flex items-center space-x-4 p-3 rounded-lg bg-cosmic-blue hover:bg-space-gray transition-colors cursor-pointer">
                    <div className="w-12 h-12 rounded-lg bg-gradient-to-r from-electric-cyan/20 to-nebula-purple/20 flex items-center justify-center">
                      <CalendarIcon className="h-5 w-5 text-electric-cyan" />
                    </div>
                    <div className="flex-1">
                      <div className="font-medium text-sm">{content.title}</div>
                      <div className="text-xs text-asteroid-silver">{content.platform || 'Multi-platform'} • {content.type}</div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-mono text-solar-gold">
                        {content.scheduledAt ? new Date(content.scheduledAt).toLocaleTimeString('en-US', { 
                          hour: '2-digit', 
                          minute: '2-digit' 
                        }) : 'TBD'}
                      </div>
                      <div className="text-xs text-asteroid-silver">
                        {content.scheduledAt ? new Date(content.scheduledAt).toLocaleDateString() : 'Not scheduled'}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <Clock className="h-12 w-12 text-asteroid-silver mx-auto mb-4" />
                <p className="text-asteroid-silver">No content scheduled yet</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Optimal Posting Times */}
      <OptimalTimes />
    </div>
  );
}
