import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

interface StreakGraphProps {
  user: {
    dailyStreak: number;
    lastDailyCompletion: string | null;
  };
}

// GitHub-style contribution graph component
const StreakGraph = ({ user }: StreakGraphProps) => {
  // Generate last 371 days (53 weeks * 7 days) of data
  const contributions = useMemo(() => {
    const days: Array<{ date: Date; count: number; level: number }> = [];
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Get user's completion dates (simplified - in real app, fetch from API)
    const lastCompletion = user.lastDailyCompletion 
      ? new Date(user.lastDailyCompletion) 
      : null;

    // Generate array of last 371 days
    for (let i = 370; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      date.setHours(0, 0, 0, 0);

      // Determine if this day had activity
      let count = 0;
      if (lastCompletion) {
        const completionDate = new Date(lastCompletion);
        completionDate.setHours(0, 0, 0, 0);
        
        // Check if this date matches any completion (simplified)
        // In a real app, you'd fetch actual completion history from backend
        const daysDiff = Math.floor((date.getTime() - completionDate.getTime()) / (1000 * 60 * 60 * 24));
        if (daysDiff >= 0 && daysDiff <= user.dailyStreak - 1) {
          count = 1;
        }
      }

      // Determine intensity level (0-4, like GitHub)
      let level = 0;
      if (count > 0) {
        level = Math.min(4, Math.floor(user.dailyStreak / 10) + 1);
      }

      days.push({ date, count, level });
    }

    return days;
  }, [user.dailyStreak, user.lastDailyCompletion]);

  // Group days by week
  const weeks = useMemo(() => {
    const weekArray: Array<Array<typeof contributions[0]>> = [];
    for (let i = 0; i < contributions.length; i += 7) {
      weekArray.push(contributions.slice(i, i + 7));
    }
    return weekArray;
  }, [contributions]);

  // Get color based on level (GitHub green gradient)
  const getColor = (level: number): string => {
    const colors = [
      'hsl(150 20% 90%)',      // Level 0 - no activity
      'hsl(150 50% 60%)',      // Level 1 - light green
      'hsl(150 55% 50%)',      // Level 2 - medium green
      'hsl(150 60% 40%)',      // Level 3 - dark green
      'hsl(150 65% 35%)',      // Level 4 - darkest green
    ];
    return colors[level] || colors[0];
  };

  // Format date for tooltip
  const formatDate = (date: Date): string => {
    return date.toLocaleDateString('en-US', { 
      weekday: 'long', 
      month: 'short', 
      day: 'numeric',
      year: 'numeric'
    });
  };

  // Get month labels
  const monthLabels = useMemo(() => {
    const labels: Array<{ month: string; index: number }> = [];
    let currentMonth = '';
    weeks.forEach((week, weekIndex) => {
      const firstDay = week[0];
      if (firstDay) {
        const month = firstDay.date.toLocaleDateString('en-US', { month: 'short' });
        if (month !== currentMonth) {
          labels.push({ month, index: weekIndex });
          currentMonth = month;
        }
      }
    });
    return labels;
  }, [weeks]);

  return (
    <div className="w-full">
      <div className="flex items-start gap-2 mb-4">
        <div className="flex-1">
          <h3 className="text-sm font-semibold mb-1">Daily Contribution Graph</h3>
          <p className="text-xs text-muted-foreground">
            {user.dailyStreak} {user.dailyStreak === 1 ? 'day' : 'days'} in the last year
          </p>
        </div>
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <span>Less</span>
          <div className="flex items-center gap-1">
            {[0, 1, 2, 3, 4].map((level) => (
              <div
                key={level}
                className="w-3 h-3 rounded-sm"
                style={{ backgroundColor: getColor(level) }}
              />
            ))}
          </div>
          <span>More</span>
        </div>
      </div>

      <div className="overflow-x-auto pb-4">
        <div className="inline-block min-w-full">
          {/* Month labels */}
          <div className="flex gap-1 mb-2 h-4 relative">
            {monthLabels.map((label, idx) => (
              <span
                key={`${label.month}-${idx}`}
                className="text-xs text-muted-foreground absolute"
                style={{ left: `${(label.index / weeks.length) * 100}%` }}
              >
                {label.month}
              </span>
            ))}
          </div>

          {/* Weekday labels */}
          <div className="flex gap-1">
            <div className="flex flex-col gap-1 pr-2">
              {['Sun', 'Mon', 'Wed', 'Fri'].map((day) => (
                <div key={day} className="text-xs text-muted-foreground h-3 leading-3" style={{ height: '11px' }}>
                  {day}
                </div>
              ))}
            </div>

            {/* Graph */}
            <div className="flex gap-1 flex-1">
              {weeks.map((week, weekIndex) => (
                <div key={weekIndex} className="flex flex-col gap-1">
                  {week.map((day, dayIndex) => (
                    <TooltipProvider key={`${weekIndex}-${dayIndex}`} delayDuration={0}>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <div>
                            <motion.div
                              className="w-3 h-3 rounded-sm cursor-pointer hover:ring-2 hover:ring-primary/50 hover:ring-offset-1 transition-all"
                              style={{ backgroundColor: getColor(day.level) }}
                              whileHover={{ scale: 1.15 }}
                              whileTap={{ scale: 0.95 }}
                            />
                          </div>
                        </TooltipTrigger>
                        <TooltipContent side="top" className="text-xs">
                          <p className="font-semibold">{day.count > 0 ? `${day.count} contribution` : 'No contributions'}</p>
                          <p className="text-muted-foreground">{formatDate(day.date)}</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  ))}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StreakGraph;

