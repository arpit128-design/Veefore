import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { useQuery } from "@tanstack/react-query";
import { useWorkspace } from "@/hooks/useWorkspace";
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight, Plus } from "lucide-react";

interface CalendarDay {
  date: number;
  fullDate: Date;
  isCurrentMonth: boolean;
  isToday: boolean;
  scheduledContent: any[];
}

export function Calendar() {
  const { currentWorkspace } = useWorkspace();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [viewMode, setViewMode] = useState("month");

  const { data: scheduledContent } = useQuery({
    queryKey: ['scheduled-content', currentWorkspace?.id, currentDate.getFullYear(), currentDate.getMonth()],
    queryFn: () => fetch(`/api/content?workspaceId=${currentWorkspace?.id}&status=scheduled`).then(res => res.json()),
    enabled: !!currentWorkspace?.id
  });

  // Generate calendar days
  const generateCalendarDays = (): CalendarDay[] => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    const days: CalendarDay[] = [];
    const today = new Date();

    // Add days from previous month
    const prevMonth = new Date(year, month - 1, 0);
    for (let i = startingDayOfWeek - 1; i >= 0; i--) {
      const date = prevMonth.getDate() - i;
      days.push({
        date,
        fullDate: new Date(year, month - 1, date),
        isCurrentMonth: false,
        isToday: false,
        scheduledContent: []
      });
    }

    // Add days from current month
    for (let date = 1; date <= daysInMonth; date++) {
      const fullDate = new Date(year, month, date);
      const isToday = fullDate.toDateString() === today.toDateString();
      
      // Filter scheduled content for this date
      const dayContent = scheduledContent?.filter((content: any) => {
        if (!content.scheduledAt) return false;
        const contentDate = new Date(content.scheduledAt);
        return contentDate.toDateString() === fullDate.toDateString();
      }) || [];

      days.push({
        date,
        fullDate,
        isCurrentMonth: true,
        isToday,
        scheduledContent: dayContent
      });
    }

    // Add days from next month to fill the grid
    const remainingDays = 42 - days.length; // 6 rows × 7 days
    for (let date = 1; date <= remainingDays; date++) {
      days.push({
        date,
        fullDate: new Date(year, month + 1, date),
        isCurrentMonth: false,
        isToday: false,
        scheduledContent: []
      });
    }

    return days;
  };

  const navigateMonth = (direction: 'prev' | 'next') => {
    setCurrentDate(prev => {
      const newDate = new Date(prev);
      if (direction === 'prev') {
        newDate.setMonth(prev.getMonth() - 1);
      } else {
        newDate.setMonth(prev.getMonth() + 1);
      }
      return newDate;
    });
  };

  const goToToday = () => {
    setCurrentDate(new Date());
  };

  const getContentTypeColor = (type: string) => {
    switch (type) {
      case 'video': return 'bg-electric-cyan';
      case 'reel': return 'bg-solar-gold';
      case 'post': return 'bg-nebula-purple';
      case 'youtube_short': return 'bg-red-500';
      default: return 'bg-green-400';
    }
  };

  const calendarDays = generateCalendarDays();
  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  return (
    <Card className="content-card holographic">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-2xl font-orbitron font-semibold neon-text text-electric-cyan">
          Content Calendar
        </CardTitle>
        <div className="flex items-center space-x-4">
          <Select value={viewMode} onValueChange={setViewMode}>
            <SelectTrigger className="w-32 glassmorphism">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="month">Month View</SelectItem>
              <SelectItem value="week">Week View</SelectItem>
              <SelectItem value="day">Day View</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" size="sm" className="glassmorphism">
            Export
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {/* Calendar Navigation */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigateMonth('prev')}
              className="glassmorphism hover:bg-electric-cyan/20"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <h3 className="text-xl font-orbitron font-semibold">
              {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
            </h3>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigateMonth('next')}
              className="glassmorphism hover:bg-electric-cyan/20"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
          
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={goToToday}
              className="glassmorphism"
            >
              Today
            </Button>
            <Button
              size="sm"
              className="bg-gradient-to-r from-solar-gold to-orange-500 hover:opacity-90"
            >
              <Plus className="w-4 h-4 mr-2" />
              Schedule Content
            </Button>
          </div>
        </div>

        {/* Calendar Grid */}
        <div className="grid grid-cols-7 gap-2">
          {/* Day Headers */}
          {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day) => (
            <div key={day} className="text-center py-2 text-asteroid-silver font-medium text-sm">
              {day}
            </div>
          ))}

          {/* Calendar Days */}
          {calendarDays.map((day, index) => (
            <div
              key={index}
              className={`aspect-square p-2 border border-space-gray hover:border-electric-cyan transition-colors cursor-pointer rounded-lg ${
                day.isToday 
                  ? 'border-electric-cyan bg-electric-cyan/10' 
                  : day.isCurrentMonth 
                    ? 'hover:bg-cosmic-blue/50' 
                    : 'opacity-40'
              }`}
            >
              <div className={`text-sm mb-1 ${day.isToday ? 'text-electric-cyan font-bold' : day.isCurrentMonth ? 'text-white' : 'text-asteroid-silver'}`}>
                {day.date}
              </div>
              
              {/* Scheduled Content Indicators */}
              <div className="space-y-1">
                {day.scheduledContent.slice(0, 3).map((content: any, contentIndex: number) => (
                  <div
                    key={contentIndex}
                    className={`w-full h-1 rounded ${getContentTypeColor(content.type)}`}
                    title={content.title}
                  />
                ))}
                {day.scheduledContent.length > 3 && (
                  <div className="text-xs text-electric-cyan">
                    +{day.scheduledContent.length - 3} more
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Legend */}
        <div className="mt-6 flex items-center justify-center space-x-6 text-sm">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 rounded bg-electric-cyan"></div>
            <span>Video</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 rounded bg-solar-gold"></div>
            <span>Reel</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 rounded bg-nebula-purple"></div>
            <span>Post</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 rounded bg-green-400"></div>
            <span>Story</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
