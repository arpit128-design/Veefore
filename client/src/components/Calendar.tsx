import { useState } from 'react';
import { ChevronLeft, ChevronRight, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface CalendarProps {
  onScheduleContent: (date?: Date) => void;
}

export default function Calendar({ onScheduleContent }: CalendarProps) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  const today = new Date();
  const currentMonth = currentDate.getMonth();
  const currentYear = currentDate.getFullYear();

  // Get first day of the month and number of days
  const firstDayOfMonth = new Date(currentYear, currentMonth, 1);
  const lastDayOfMonth = new Date(currentYear, currentMonth + 1, 0);
  const firstDayWeekday = firstDayOfMonth.getDay();
  const daysInMonth = lastDayOfMonth.getDate();

  // Month navigation
  const goToPreviousMonth = () => {
    setCurrentDate(new Date(currentYear, currentMonth - 1, 1));
  };

  const goToNextMonth = () => {
    setCurrentDate(new Date(currentYear, currentMonth + 1, 1));
  };

  // Generate calendar days
  const generateCalendarDays = () => {
    const days = [];
    
    // Previous month's trailing days
    for (let i = firstDayWeekday - 1; i >= 0; i--) {
      const prevMonth = new Date(currentYear, currentMonth, -i);
      days.push({
        date: prevMonth,
        isCurrentMonth: false,
        isToday: false,
        isPast: true
      });
    }

    // Current month's days
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(currentYear, currentMonth, day);
      const isToday = date.toDateString() === today.toDateString();
      const isPast = date < today && !isToday;
      
      days.push({
        date,
        isCurrentMonth: true,
        isToday,
        isPast
      });
    }

    // Next month's leading days to fill the grid
    const remainingCells = 42 - days.length; // 6 rows × 7 days
    for (let day = 1; day <= remainingCells; day++) {
      const nextMonth = new Date(currentYear, currentMonth + 1, day);
      days.push({
        date: nextMonth,
        isCurrentMonth: false,
        isToday: false,
        isPast: false
      });
    }

    return days;
  };

  const calendarDays = generateCalendarDays();
  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];
  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  const handleDateClick = (date: Date, isPast: boolean, isCurrentMonth: boolean) => {
    if (isPast || !isCurrentMonth) return;
    setSelectedDate(date);
  };

  const handleScheduleContent = () => {
    onScheduleContent(selectedDate || undefined);
  };

  return (
    <Card className="content-card holographic">
      <CardHeader>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <CardTitle className="text-xl font-orbitron font-semibold neon-text text-electric-cyan">
            Content Calendar
          </CardTitle>
          
          {/* Mobile-responsive Schedule Content button */}
          <Button
            onClick={handleScheduleContent}
            className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-purple-500 hover:to-blue-500 transition-all duration-300 w-full sm:w-auto"
            size="sm"
          >
            <Plus className="w-4 h-4 mr-2" />
            <span className="text-sm">Schedule Content</span>
          </Button>
        </div>
        
        {selectedDate && (
          <p className="text-asteroid-silver text-sm">
            Selected: {selectedDate.toLocaleDateString('en-US', { 
              weekday: 'long', 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            })}
          </p>
        )}
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Calendar Header with Month Navigation */}
        <div className="flex items-center justify-between mb-6">
          <Button
            variant="outline"
            size="sm"
            onClick={goToPreviousMonth}
            className="glassmorphism hover:bg-electric-cyan/20 hover:border-electric-cyan"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          
          <h3 className="text-lg font-semibold text-white">
            {monthNames[currentMonth]} {currentYear}
          </h3>
          
          <Button
            variant="outline"
            size="sm"
            onClick={goToNextMonth}
            className="glassmorphism hover:bg-electric-cyan/20 hover:border-electric-cyan"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>

        {/* Day Headers */}
        <div className="grid grid-cols-7 gap-1 mb-2">
          {dayNames.map((day) => (
            <div
              key={day}
              className="text-center text-xs sm:text-sm font-medium text-asteroid-silver p-2"
            >
              {day}
            </div>
          ))}
        </div>

        {/* Calendar Grid */}
        <div className="grid grid-cols-7 gap-1">
          {calendarDays.map((dayInfo, index) => {
            const { date, isCurrentMonth, isToday, isPast } = dayInfo;
            const isSelected = selectedDate?.toDateString() === date.toDateString();
            
            return (
              <button
                key={index}
                onClick={() => handleDateClick(date, isPast, isCurrentMonth)}
                disabled={isPast || !isCurrentMonth}
                className={`
                  aspect-square p-1 sm:p-2 text-xs sm:text-sm rounded-lg transition-all duration-200 relative
                  ${isCurrentMonth 
                    ? isPast 
                      ? 'text-asteroid-silver/40 cursor-not-allowed' 
                      : 'text-white hover:bg-electric-cyan/20 hover:border-electric-cyan/50 border border-transparent cursor-pointer'
                    : 'text-asteroid-silver/30 cursor-not-allowed'
                  }
                  ${isToday 
                    ? 'bg-gradient-to-r from-blue-500/20 to-purple-500/20 border-blue-500 text-blue-500 font-bold' 
                    : ''
                  }
                  ${isSelected 
                    ? 'bg-gradient-to-r from-electric-cyan/30 to-nebula-purple/30 border-electric-cyan text-electric-cyan font-semibold' 
                    : ''
                  }
                `}
              >
                {date.getDate()}
                
                {/* Indicator for scheduled content */}
                {isCurrentMonth && !isPast && (
                  <div className="absolute bottom-0.5 left-1/2 transform -translate-x-1/2">
                    {/* You can add dots here for scheduled content indicators */}
                  </div>
                )}
              </button>
            );
          })}
        </div>

        {/* Mobile-optimized Quick Actions */}
        <div className="mt-6 pt-4 border-t border-white/10">
          <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
            <Button
              variant="outline"
              onClick={() => setCurrentDate(new Date())}
              className="glassmorphism hover:bg-electric-cyan/20 hover:border-electric-cyan flex-1 text-sm"
            >
              Today
            </Button>
            <Button
              variant="outline"
              onClick={() => setSelectedDate(new Date())}
              className="glassmorphism hover:bg-nebula-purple/20 hover:border-nebula-purple flex-1 text-sm"
            >
              Select Today
            </Button>
            <Button
              onClick={handleScheduleContent}
              className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-purple-500 hover:to-blue-500 transition-all duration-300 flex-1 text-sm"
            >
              <Plus className="w-4 h-4 mr-2" />
              Schedule
            </Button>
          </div>
        </div>

        {/* Calendar Legend */}
        <div className="mt-4 pt-4 border-t border-white/10">
          <div className="flex flex-wrap gap-4 text-xs">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded bg-gradient-to-r from-blue-500/20 to-purple-500/20 border border-blue-500"></div>
              <span className="text-asteroid-silver">Today</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded bg-gradient-to-r from-electric-cyan/30 to-nebula-purple/30 border border-electric-cyan"></div>
              <span className="text-asteroid-silver">Selected</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded bg-white/10 border border-white/20"></div>
              <span className="text-asteroid-silver">Available</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}