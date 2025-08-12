'use client';

import type React from 'react';
import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { paths } from '@/config/paths';
import Link from 'next/link';

// Types
interface EventFormData {
  eventName: string;
  selectedMode: 'dates-times' | 'dates-only';
  startTime: string;
  endTime: string;
  selectedDates: number[];
  selectedDays: string[];
  dateMode: 'specific' | 'range';
  timeIncrement: string;
  timezone: string;
}

interface CreateEventModalProps {
  children: React.ReactNode;
}

// Animation wrapper component
const AnimatedSection: React.FC<{
  children: React.ReactNode;
  show: boolean;
  className?: string;
}> = ({ children, show, className = '' }) => (
  <div
    className={`overflow-hidden transition-all duration-300 ease-in-out ${
      show
        ? 'max-h-96 translate-y-0 transform opacity-100'
        : 'max-h-0 -translate-y-2 transform opacity-0'
    } ${className}`}
  >
    <div className={show ? 'p-1 pb-2' : ''}>{children}</div>
  </div>
);

// Mode Toggle Component
const ModeToggle: React.FC<{
  selectedMode: EventFormData['selectedMode'];
  onModeChange: (mode: EventFormData['selectedMode']) => void;
}> = ({ selectedMode, onModeChange }) => (
  <div className="flex gap-2">
    <Button
      variant={selectedMode === 'dates-times' ? 'default' : 'outline'}
      size="sm"
      onClick={() => onModeChange('dates-times')}
      className="flex-1 transition-all duration-200 ease-in-out"
    >
      Dates and times
    </Button>
    <Button
      variant={selectedMode === 'dates-only' ? 'default' : 'outline'}
      size="sm"
      onClick={() => onModeChange('dates-only')}
      className="flex-1 transition-all duration-200 ease-in-out"
    >
      Dates only
    </Button>
  </div>
);

// Time Selection Component
const TimeSelection: React.FC<{
  startTime: string;
  endTime: string;
  onStartTimeChange: (time: string) => void;
  onEndTimeChange: (time: string) => void;
}> = ({ startTime, endTime, onStartTimeChange, onEndTimeChange }) => {
  const timeOptions = [
    '12 am',
    '1 am',
    '2 am',
    '3 am',
    '4 am',
    '5 am',
    '6 am',
    '7 am',
    '8 am',
    '9 am',
    '10 am',
    '11 am',
    '12 pm',
    '1 pm',
    '2 pm',
    '3 pm',
    '4 pm',
    '5 pm',
    '6 pm',
    '7 pm',
    '8 pm',
    '9 pm',
    '10 pm',
    '11 pm',
  ];

  return (
    <AnimatedSection show={true}>
      <Label className="text-base font-medium">What times might work?</Label>
      <div className="mt-2 flex items-center gap-2">
        <Select value={startTime} onValueChange={onStartTimeChange}>
          <SelectTrigger className="flex-1">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {timeOptions.map((time) => (
              <SelectItem key={time} value={time}>
                {time}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <span className="text-muted-foreground">to</span>
        <Select value={endTime} onValueChange={onEndTimeChange}>
          <SelectTrigger className="flex-1">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {timeOptions.map((time) => (
              <SelectItem key={time} value={time}>
                {time}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </AnimatedSection>
  );
};

// Date Mode Selector Component
const DateModeSelector: React.FC<{
  dateMode: EventFormData['dateMode'];
  onDateModeChange: (mode: EventFormData['dateMode']) => void;
}> = ({ dateMode, onDateModeChange }) => (
  <AnimatedSection show={true}>
    <Label className="text-base font-medium">What dates might work?</Label>
    <Select value={dateMode} onValueChange={onDateModeChange}>
      <SelectTrigger className="mt-2 w-full">
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="specific">Specific dates</SelectItem>
        <SelectItem value="range">Days of the week</SelectItem>
      </SelectContent>
    </Select>
  </AnimatedSection>
);

// Days of Week Selector Component
const DaysOfWeekSelector: React.FC<{
  selectedDays: string[];
  onDaysChange: (days: string[]) => void;
}> = ({ selectedDays, onDaysChange }) => {
  const daysOfWeek = [
    { short: 'Sun', full: 'Sunday' },
    { short: 'Mon', full: 'Monday' },
    { short: 'Tue', full: 'Tuesday' },
    { short: 'Wed', full: 'Wednesday' },
    { short: 'Thu', full: 'Thursday' },
    { short: 'Fri', full: 'Friday' },
    { short: 'Sat', full: 'Saturday' },
  ];

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
            variant="outline"
            size="sm"
            onClick={() => toggleDay(day.short)}
            className={`h-10 transform transition-all duration-200 ease-in-out hover:scale-105 ${
              selectedDays.includes(day.short)
                ? 'bg-primary text-primary-foreground scale-105 shadow-md'
                : ''
            }`}
          >
            {day.short}
          </Button>
        ))}
      </div>
    </AnimatedSection>
  );
};

// Calendar Component
const Calendar: React.FC<{
  currentMonth: Date;
  selectedDates: number[];
  onNavigateMonth: (direction: 'prev' | 'next') => void;
  onDatesChange: (dates: number[]) => void;
}> = ({ currentMonth, selectedDates, onNavigateMonth, onDatesChange }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [dragStartDate, setDragStartDate] = useState<number | null>(null);
  const [dragMode, setDragMode] = useState<'select' | 'deselect'>('select');
  const [tempSelectedDates, setTempSelectedDates] = useState<number[]>([]);
  const [tempDeselectedDates, setTempDeselectedDates] = useState<number[]>([]);
  const [isClick, setIsClick] = useState(false); // Track if this was just a click
  const calendarRef = useRef<HTMLDivElement>(null);
  const dragTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const monthNames = [
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
  ];

  const getDaysInMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  };

  const getDateRange = (start: number, end: number): number[] => {
    const min = Math.min(start, end);
    const max = Math.max(start, end);
    const range = [];
    for (let i = min; i <= max; i++) {
      range.push(i);
    }
    return range;
  };

  const handleMouseDown = (day: number, event: React.MouseEvent) => {
    event.preventDefault();
    setIsClick(true);
    setDragStartDate(day);

    // Set a timer to determine if this is a drag or click
    dragTimeoutRef.current = setTimeout(() => {
      setIsDragging(true);
      setIsClick(false);

      // Determine drag mode based on the initial day's selection state
      const isInitiallySelected = selectedDates.includes(day);
      const mode = isInitiallySelected ? 'deselect' : 'select';
      setDragMode(mode);

      // Set initial temp state
      if (mode === 'select') {
        setTempSelectedDates([day]);
        setTempDeselectedDates([]);
      } else {
        setTempSelectedDates([]);
        setTempDeselectedDates([day]);
      }
    }, 150); // 150ms delay to distinguish click from drag
  };

  const handleMouseEnter = (day: number) => {
    if (isDragging && dragStartDate !== null) {
      const range = getDateRange(dragStartDate, day);

      if (dragMode === 'select') {
        setTempSelectedDates(range);
        setTempDeselectedDates([]);
      } else {
        setTempSelectedDates([]);
        setTempDeselectedDates(range);
      }
    }
  };

  const handleMouseUp = () => {
    // Clear the drag timeout
    if (dragTimeoutRef.current) {
      clearTimeout(dragTimeoutRef.current);
      dragTimeoutRef.current = null;
    }

    // If it was just a click (timeout didn't fire), toggle the date
    if (isClick && dragStartDate !== null) {
      toggleDate(dragStartDate);
    }
    // If it was a drag, apply the selection changes
    else if (isDragging) {
      let newSelection = [...selectedDates];

      if (dragMode === 'select') {
        // Add dates that aren't already selected
        tempSelectedDates.forEach((date) => {
          if (!newSelection.includes(date)) {
            newSelection.push(date);
          }
        });
      } else {
        // Remove dates that are in the deselect range
        newSelection = newSelection.filter(
          (date) => !tempDeselectedDates.includes(date),
        );
      }

      onDatesChange(newSelection.sort((a, b) => a - b));
    }

    // Reset all states
    setIsDragging(false);
    setIsClick(false);
    setDragStartDate(null);
    setDragMode('select');
    setTempSelectedDates([]);
    setTempDeselectedDates([]);
  };

  const toggleDate = (day: number) => {
    const newDates = selectedDates.includes(day)
      ? selectedDates.filter((d) => d !== day)
      : [...selectedDates, day];
    onDatesChange(newDates);
  };

  const renderCalendar = () => {
    const daysInMonth = getDaysInMonth(currentMonth);
    const firstDay = getFirstDayOfMonth(currentMonth);
    const days = [];

    // Empty cells for days before the first day of the month
    for (let i = 0; i < firstDay; i++) {
      days.push(<div key={`empty-${i}`} className="h-8"></div>);
    }

    // Days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const isSelected = selectedDates.includes(day);
      const isTempSelected = isDragging && tempSelectedDates.includes(day);
      const isTempDeselected = isDragging && tempDeselectedDates.includes(day);

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
        <button
          key={day}
          onMouseDown={(e) => handleMouseDown(day, e)}
          onMouseEnter={() => handleMouseEnter(day)}
          onMouseUp={handleMouseUp}
          className={`h-8 w-8 transform rounded text-sm transition-all duration-200 ease-in-out select-none hover:scale-110 ${
            isHighlighted
              ? visualState === 'selected'
                ? 'bg-primary text-primary-foreground scale-105 shadow-md'
                : visualState === 'temp-select'
                  ? 'bg-primary/70 text-primary-foreground scale-105 shadow-sm'
                  : visualState === 'temp-deselect'
                    ? 'bg-destructive/70 text-destructive-foreground scale-105 shadow-sm'
                    : 'bg-primary text-primary-foreground scale-105 shadow-md'
              : 'hover:bg-muted hover:scale-105'
          }`}
          style={{ userSelect: 'none' }}
        >
          {day}
        </button>,
      );
    }

    return days;
  };

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
            onClick={() => onNavigateMonth('prev')}
            className="transition-all duration-200 ease-in-out hover:scale-110"
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
          className="grid grid-cols-7 items-center justify-center gap-1"
          style={{ userSelect: 'none' }}
        >
          {renderCalendar()}
        </div>
      </div>
    </AnimatedSection>
  );
};

// Advanced Options Component
const AdvancedOptions: React.FC<{
  showAdvanced: boolean;
  timeIncrement: string;
  timezone: string;
  onToggleAdvanced: () => void;
  onTimeIncrementChange: (increment: string) => void;
  onTimezoneChange: (timezone: string) => void;
}> = ({
  showAdvanced,
  timeIncrement,
  timezone,
  onToggleAdvanced,
  onTimeIncrementChange,
  onTimezoneChange,
}) => (
  <div className="space-y-4">
    <Button
      variant="ghost"
      onClick={onToggleAdvanced}
      className="h-auto w-full justify-between p-0 font-medium transition-all duration-200 ease-in-out"
    >
      Advanced options
      <ChevronRight
        className={`h-4 w-4 transition-transform duration-300 ease-in-out ${
          showAdvanced ? 'rotate-90' : ''
        }`}
      />
    </Button>

    <AnimatedSection show={showAdvanced}>
      <div className="border-muted space-y-4 border-l-2 pl-4">
        <div>
          <Label className="text-sm">Time increment:</Label>
          <Select value={timeIncrement} onValueChange={onTimeIncrementChange}>
            <SelectTrigger className="mt-1">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="15 min">15 min</SelectItem>
              <SelectItem value="30 min">30 min</SelectItem>
              <SelectItem value="60 min">60 min</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-start space-x-2">
          <Checkbox id="collect-emails" disabled />
          <div className="space-y-1">
            <Label
              htmlFor="collect-emails"
              className="text-muted-foreground text-sm"
            >
              Collect respondents&apos; email addresses
            </Label>
            <div className="text-primary text-xs">
              Sign in to use this feature
            </div>
          </div>
        </div>

        <div className="flex items-start space-x-2">
          <Checkbox id="hide-responses" disabled />
          <div className="space-y-1">
            <Label
              htmlFor="hide-responses"
              className="text-muted-foreground text-sm"
            >
              Hide responses from respondents
            </Label>
            <div className="text-xs">
              Only show responses to event creator.{' '}
              <span className="text-primary">
                <Link href={paths.auth.login.getHref()}>Sign in</Link> to use
                this feature
              </span>
            </div>
          </div>
        </div>

        <div>
          <Label className="text-sm">Timezone</Label>
          <Select value={timezone} onValueChange={onTimezoneChange}>
            <SelectTrigger className="mt-1">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="(GMT+3:00) Cairo">(GMT+3:00) Cairo</SelectItem>
              <SelectItem value="(GMT+0:00) London">
                (GMT+0:00) London
              </SelectItem>
              <SelectItem value="(GMT-5:00) New York">
                (GMT-5:00) New York
              </SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </AnimatedSection>
  </div>
);

// Main Modal Component
export function CreateEventModal({ children }: CreateEventModalProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [formData, setFormData] = useState<EventFormData>({
    eventName: '',
    selectedMode: 'dates-times',
    startTime: '9 am',
    endTime: '5 pm',
    selectedDates: [],
    selectedDays: [],
    dateMode: 'specific',
    timeIncrement: '15 min',
    timezone: '(GMT+3:00) Cairo',
  });
  const [currentMonth, setCurrentMonth] = useState(new Date(2025, 7)); // August 2025
  const [showAdvanced, setShowAdvanced] = useState(false);

  const updateFormData = (updates: Partial<EventFormData>) => {
    setFormData((prev) => ({ ...prev, ...updates }));
  };

  const navigateMonth = (direction: 'prev' | 'next') => {
    setCurrentMonth((prev) => {
      const newMonth = new Date(prev);
      if (direction === 'prev') {
        newMonth.setMonth(prev.getMonth() - 1);
      } else {
        newMonth.setMonth(prev.getMonth() + 1);
      }
      return newMonth;
    });
  };

  const canCreateEvent =
    formData.eventName.trim().length > 0 && formData.selectedDates.length > 0;

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="max-h-[90vh] max-w-md overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            New event
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsOpen(false)}
              className="h-6 w-6 p-0 transition-all duration-200 ease-in-out hover:scale-110"
            />
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Event Name */}
          <div>
            <Input
              placeholder="Name your event..."
              value={formData.eventName}
              onChange={(e) => updateFormData({ eventName: e.target.value })}
              className="text-base transition-all duration-200 ease-in-out focus:scale-[1.02]"
            />
          </div>

          {/* Mode Toggle */}
          <ModeToggle
            selectedMode={formData.selectedMode}
            onModeChange={(mode) => updateFormData({ selectedMode: mode })}
          />

          {/* Time Selection */}
          <AnimatedSection show={formData.selectedMode === 'dates-times'}>
            <TimeSelection
              startTime={formData.startTime}
              endTime={formData.endTime}
              onStartTimeChange={(time) => updateFormData({ startTime: time })}
              onEndTimeChange={(time) => updateFormData({ endTime: time })}
            />
          </AnimatedSection>

          {/* Date Selection */}
          <div className="space-y-4">
            <AnimatedSection show={formData.selectedMode === 'dates-times'}>
              <DateModeSelector
                dateMode={formData.dateMode}
                onDateModeChange={(mode) => updateFormData({ dateMode: mode })}
              />
            </AnimatedSection>

            <div className="text-muted-foreground text-sm transition-opacity duration-300 ease-in-out">
              Click to select dates, or drag to select multiple dates
            </div>

            {/* Days of Week Selection */}
            <AnimatedSection
              show={
                formData.dateMode === 'range' &&
                formData.selectedMode === 'dates-times'
              }
            >
              <DaysOfWeekSelector
                selectedDays={formData.selectedDays}
                onDaysChange={(days) => updateFormData({ selectedDays: days })}
              />
            </AnimatedSection>

            {/* Calendar */}
            <AnimatedSection
              show={
                (formData.selectedMode === 'dates-times' &&
                  formData.dateMode === 'specific') ||
                formData.selectedMode === 'dates-only'
              }
            >
              <Calendar
                currentMonth={currentMonth}
                selectedDates={formData.selectedDates}
                onNavigateMonth={navigateMonth}
                onDatesChange={(dates) =>
                  updateFormData({ selectedDates: dates })
                }
              />
            </AnimatedSection>
          </div>

          {/* Email Notification */}
          <div className="flex items-center space-x-2 transition-opacity duration-300 ease-in-out">
            <Checkbox id="email-notifications" disabled />
            <div className="relative space-y-1">
              <Label
                htmlFor="email-notifications"
                className="text-muted-foreground text-sm"
              >
                Email me each time someone joins my event
              </Label>
              <div className="text-muted-foreground absolute text-xs">
                Sign in to use this feature
              </div>
            </div>
          </div>

          {/* Advanced Options */}
          <AdvancedOptions
            showAdvanced={showAdvanced}
            timeIncrement={formData.timeIncrement}
            timezone={formData.timezone}
            onToggleAdvanced={() => setShowAdvanced(!showAdvanced)}
            onTimeIncrementChange={(increment) =>
              updateFormData({ timeIncrement: increment })
            }
            onTimezoneChange={(timezone) => updateFormData({ timezone })}
          />

          {/* Create Button */}
          <div className="space-y-2">
            <Button
              className={`w-full transition-all duration-300 ease-in-out ${
                canCreateEvent ? 'hover:scale-[1.02] active:scale-[0.98]' : ''
              }`}
              disabled={!canCreateEvent}
              onClick={() => {
                if (canCreateEvent) {
                  // Handle event creation
                  setIsOpen(false);
                }
              }}
            >
              Create event
            </Button>
            <AnimatedSection show={!canCreateEvent}>
              <p className="text-destructive text-center text-xs">
                Please fix form errors before continuing
              </p>
            </AnimatedSection>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
