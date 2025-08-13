import { AnimatedSection } from '@/components/ui/animatedSection';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useMemo } from 'react';

export const DaysOfWeekSelector: React.FC<{
  selectedDays: string[];
  onDaysChange: (days: string[]) => void;
}> = ({ selectedDays, onDaysChange }) => {
  const daysOfWeek = useMemo(
    () => [
      { short: 'Sun', full: 'Sunday' },
      { short: 'Mon', full: 'Monday' },
      { short: 'Tue', full: 'Tuesday' },
      { short: 'Wed', full: 'Wednesday' },
      { short: 'Thu', full: 'Thursday' },
      { short: 'Fri', full: 'Friday' },
      { short: 'Sat', full: 'Saturday' },
    ],
    [],
  );

  const toggleDay = (day: string) => {
    const newDays = selectedDays.includes(day)
      ? selectedDays.filter((d) => d !== day)
      : [...selectedDays, day];
    onDaysChange(newDays);
  };

  return (
    <AnimatedSection show={true}>
      <div className="grid grid-cols-7 gap-2">
        {daysOfWeek.map((day) => (
          <Button
            key={day.short}
            variant={selectedDays.includes(day.short) ? 'default' : 'outline'}
            size="sm"
            onClick={() => toggleDay(day.short)}
            className={cn(
              'h-10 transform transition-all duration-200 ease-in-out hover:scale-105',
              selectedDays.includes(day.short)
                ? 'bg-primary text-primary-foreground scale-105 shadow-md'
                : 'bg-background text-foreground border-border',
            )}
          >
            {day.short}
          </Button>
        ))}
      </div>
    </AnimatedSection>
  );
};
