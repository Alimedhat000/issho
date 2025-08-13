import { AnimatedSection } from '@/components/ui/animatedSection';
import { Button } from '@/components/ui/button';
import { useCalendarDrag } from '@/hooks/useCalendarDrag';
import { cn } from '@/lib/utils';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useMemo, useRef } from 'react';

const CalendarDayButton = ({
  day,
  isoDate,
  isPast,
  isHighlighted,
  visualState,
  handleMouseDown,
  handleMouseEnter,
  handleMouseUp,
}: {
  day: number;
  isoDate: string;
  isPast: boolean;
  isHighlighted: boolean;
  visualState: string;
  handleMouseDown: (isoDate: string, e: React.MouseEvent) => void;
  handleMouseEnter: (isoDate: string) => void;
  handleMouseUp: () => void;
}) => (
  <button
    disabled={isPast}
    onMouseDown={(e) => !isPast && handleMouseDown(isoDate, e)}
    onMouseEnter={() => !isPast && handleMouseEnter(isoDate)}
    onMouseUp={() => !isPast && handleMouseUp()}
    className={cn(
      'flex h-8 w-10 items-center justify-center rounded text-sm transition-all duration-200 ease-in-out select-none',
      isPast
        ? 'text-muted-foreground cursor-not-allowed opacity-50 hover:scale-100 hover:bg-transparent'
        : 'hover:scale-110',
      isHighlighted
        ? [
            'text-primary-foreground scale-105',
            visualState === 'selected' && 'bg-primary shadow-md',
            visualState === 'temp-select' && 'bg-primary/70 shadow-sm',
            visualState === 'temp-deselect' &&
              'bg-destructive/70 text-destructive-foreground shadow-sm',
          ]
        : 'hover:bg-muted hover:scale-105',
    )}
    style={{ userSelect: 'none' }}
  >
    {day}
  </button>
);

// Calendar Component
export const Calendar: React.FC<{
  currentMonth: Date;
  selectedDates: string[];
  onNavigateMonth: (direction: 'prev' | 'next') => void;
  onDatesChange: (dates: string[]) => void;
}> = ({ currentMonth, selectedDates, onNavigateMonth, onDatesChange }) => {
  const calendarRef = useRef<HTMLDivElement>(null);
  const today = new Date();
  const isPrevDisabled =
    currentMonth.getFullYear() < today.getFullYear() ||
    (currentMonth.getFullYear() === today.getFullYear() &&
      currentMonth.getMonth() <= today.getMonth());

  const getDaysInMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  };

  const monthNames = useMemo(
    () => [
      'January',
      'February',
      'March',
      'April',
      'May',
      'June',
      'July',
      'August',
      'September',
      'October',
      'November',
      'December',
    ],
    [],
  );
  const {
    isDragging,
    dragMode,
    tempSelectedDates,
    tempDeselectedDates,
    handleMouseDown,
    handleMouseEnter,
    handleMouseUp,
  } = useCalendarDrag(selectedDates, onDatesChange);

  const calendarDays = useMemo(() => {
    const daysInMonth = getDaysInMonth(currentMonth);
    const firstDay = getFirstDayOfMonth(currentMonth);
    const days = [];

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Empty cells for days before the first day of the month
    for (let i = 0; i < firstDay; i++) {
      days.push(<div key={`empty-${i}`} className="h-8"></div>);
    }

    // Days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const dateObj = new Date(
        currentMonth.getFullYear(),
        currentMonth.getMonth(),
        day,
      );
      const isoDate = dateObj.toISOString().split('T')[0]; // YYYY-MM-DD

      const isPast = dateObj < today;

      const isSelected = selectedDates.includes(isoDate);
      const isTempSelected = isDragging && tempSelectedDates.includes(isoDate);
      const isTempDeselected =
        isDragging && tempDeselectedDates.includes(isoDate);

      // Determine the visual state
      let isHighlighted = false;
      let visualState = '';

      if (isDragging) {
        if (dragMode === 'select' && isTempSelected) {
          isHighlighted = true;
          visualState = 'temp-select';
        } else if (dragMode === 'deselect' && isTempDeselected) {
          isHighlighted = true;
          visualState = 'temp-deselect';
        } else if (isSelected && !isTempDeselected) {
          isHighlighted = true;
          visualState = 'selected';
        }
      } else {
        if (isSelected) {
          isHighlighted = true;
          visualState = 'selected';
        }
      }

      days.push(
        <CalendarDayButton
          key={day}
          day={day}
          isoDate={isoDate}
          isPast={isPast}
          isHighlighted={isHighlighted}
          visualState={visualState}
          handleMouseDown={handleMouseDown}
          handleMouseEnter={handleMouseEnter}
          handleMouseUp={handleMouseUp}
        />,
      );
    }

    return days;
  }, [
    currentMonth,
    selectedDates,
    isDragging,
    tempSelectedDates,
    tempDeselectedDates,
    dragMode,
    handleMouseDown,
    handleMouseEnter,
    handleMouseUp,
  ]);

  return (
    <AnimatedSection show={true}>
      <div
        className="rounded-lg border p-4 transition-all duration-300 ease-in-out"
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
      >
        <div className="mb-4 flex items-center justify-between">
          <Button
            variant="ghost"
            size="sm"
            disabled={isPrevDisabled}
            onClick={() => !isPrevDisabled && onNavigateMonth('prev')}
            className={cn(
              'transition-all duration-200 ease-in-out hover:scale-110',
              isPrevDisabled && 'cursor-not-allowed opacity-50 hover:scale-100',
            )}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <h3 className="font-medium transition-all duration-300 ease-in-out">
            {monthNames[currentMonth.getMonth()]} {currentMonth.getFullYear()}
          </h3>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onNavigateMonth('next')}
            className="transition-all duration-200 ease-in-out hover:scale-110"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>

        <div className="mb-2 grid grid-cols-7 gap-1">
          {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((day, index) => (
            <div
              key={index}
              className="text-muted-foreground flex h-8 items-center justify-center text-sm font-medium"
            >
              {day}
            </div>
          ))}
        </div>

        <div
          ref={calendarRef}
          className="grid grid-cols-7 items-center justify-items-center gap-1"
          style={{ userSelect: 'none' }}
        >
          {calendarDays}
        </div>
      </div>
    </AnimatedSection>
  );
};
