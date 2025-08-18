import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { ChevronDown, ChevronLeft, ChevronRight } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { cn, to24HourFormat } from '@/lib/utils';
import { Event } from '@/types/event';

function useCalendarDrag(
  selectedDates: string[],
  onDatesChange: (dates: string[]) => void,
  editable: boolean,
) {
  const [isDragging, setIsDragging] = useState(false);
  const [dragStartDate, setDragStartDate] = useState<string | null>(null);
  const [dragMode, setDragMode] = useState<'select' | 'deselect'>('select');
  const [tempSelectedDates, setTempSelectedDates] = useState<string[]>([]);
  const [tempDeselectedDates, setTempDeselectedDates] = useState<string[]>([]);
  const [isClick, setIsClick] = useState(false);
  const dragTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const toggleDate = useCallback(
    (isoDate: string) => {
      const newDates = selectedDates.includes(isoDate)
        ? selectedDates.filter((d) => d !== isoDate)
        : [...selectedDates, isoDate];
      onDatesChange(newDates);
    },
    [selectedDates, onDatesChange],
  );

  const resetDragState = useCallback(() => {
    setIsDragging(false);
    setIsClick(false);
    setDragStartDate(null);
    setDragMode('select');
    setTempSelectedDates([]);
    setTempDeselectedDates([]);
  }, []);

  const handleMouseDown = useCallback(
    (isoDate: string, event: React.MouseEvent) => {
      if (!editable) return;
      event.preventDefault();
      setIsClick(true);
      setDragStartDate(isoDate);

      const isInitiallySelected = selectedDates.includes(isoDate);
      const mode = isInitiallySelected ? 'deselect' : 'select';
      setDragMode(mode);

      if (mode === 'select') {
        setTempSelectedDates([isoDate]);
        setTempDeselectedDates([]);
      } else {
        setTempSelectedDates([]);
        setTempDeselectedDates([isoDate]);
      }

      dragTimeoutRef.current = setTimeout(() => {
        setIsDragging(true);
        setIsClick(false);
      }, 30);
    },
    [selectedDates, editable],
  );

  const handleMouseEnter = useCallback(
    (isoDate: string) => {
      if (!editable) return;

      if (isDragging) {
        if (dragMode === 'select') {
          setTempSelectedDates((prev) =>
            prev.includes(isoDate) ? prev : [...prev, isoDate],
          );
        } else {
          setTempDeselectedDates((prev) =>
            prev.includes(isoDate) ? prev : [...prev, isoDate],
          );
        }
      }
    },
    [isDragging, dragMode, editable],
  );

  const handleMouseUp = useCallback(() => {
    if (!editable) return;

    if (dragTimeoutRef.current) {
      clearTimeout(dragTimeoutRef.current);
      dragTimeoutRef.current = null;
    }

    if (isClick && dragStartDate !== null) {
      toggleDate(dragStartDate);
    } else if (isDragging) {
      let newSelection = [...selectedDates];

      if (dragMode === 'select') {
        tempSelectedDates.forEach((date) => {
          if (!newSelection.includes(date)) {
            newSelection.push(date);
            console.log(newSelection);
          }
        });
      } else {
        newSelection = newSelection.filter(
          (date) => !tempDeselectedDates.includes(date),
        );
      }

      onDatesChange(
        newSelection.sort(
          (a, b) => new Date(a).getTime() - new Date(b).getTime(),
        ),
      );
    }

    resetDragState();
  }, [
    isClick,
    dragStartDate,
    isDragging,
    dragMode,
    tempSelectedDates,
    tempDeselectedDates,
    selectedDates,
    onDatesChange,
    toggleDate,
    resetDragState,
    editable,
  ]);

  return {
    isDragging,
    dragMode,
    tempSelectedDates,
    tempDeselectedDates,
    handleMouseDown,
    handleMouseEnter,
    handleMouseUp,
    resetDragState,
  };
}

export function CalendarGrid({
  days,
  timeSlots,
  isEditActive,
  selectedTimeSlots = [],
  onTimeSlotChange,
  event,
  // isFullDayEvent = false,
}: {
  days: string[];
  timeSlots: string[];
  isEditActive: boolean;
  selectedTimeSlots?: string[];
  onTimeSlotChange?: (slots: string[]) => void;
  event?: Event;
  isFullDayEvent?: boolean;
}) {
  const [currentPage, setCurrentPage] = useState(0);
  const [screenSize, setScreenSize] = useState('large');

  const dragHandlers = useCalendarDrag(
    selectedTimeSlots,
    onTimeSlotChange || (() => {}),
    isEditActive,
  );

  const timezone =
    event?.timezone || Intl.DateTimeFormat().resolvedOptions().timeZone;

  // Format timezone for display
  const timezoneDisplay = useMemo(() => {
    try {
      const date = new Date();
      const formatter = new Intl.DateTimeFormat('en', {
        timeZone: timezone,
        timeZoneName: 'short',
      });
      const parts = formatter.formatToParts(date);
      const tzName = parts.find((part) => part.type === 'timeZoneName')?.value;

      // Get offset
      const offset = date.getTimezoneOffset() * -1;
      const hours = Math.floor(Math.abs(offset) / 60);
      const minutes = Math.abs(offset) % 60;
      const sign = offset >= 0 ? '+' : '-';

      return `(GMT${sign}${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}) ${tzName}`;
    } catch {
      return '(GMT+00:00) UTC';
    }
  }, [timezone]);

  // Track screen size for responsive pagination
  useEffect(() => {
    const checkScreenSize = () => {
      if (window.innerWidth < 768) {
        // md breakpoint
        setScreenSize('small');
      } else {
        setScreenSize('large');
      }
    };

    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);

    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  // Reset to first page when screen size changes
  useEffect(() => {
    setCurrentPage(0);
  }, [screenSize]);

  useEffect(() => {
    document.addEventListener('mouseup', dragHandlers.handleMouseUp);
    return () =>
      document.removeEventListener('mouseup', dragHandlers.handleMouseUp);
  }, [dragHandlers.handleMouseUp]);

  // Group consecutive dates
  const dateGroups = useMemo(() => {
    if (!days || days.length === 0) return [];

    // Parse dates and sort them
    const parsedDates = days
      .map((day) => {
        // Assuming days are in format like "2024-08-14" or similar
        const date = new Date(day);
        return {
          original: day,
          date: date,
          dayOfWeek: date.toLocaleDateString('en', { weekday: 'short' }),
          monthDay: date.toLocaleDateString('en', {
            month: 'short',
            day: 'numeric',
          }),
        };
      })
      .sort((a, b) => a.date.getTime() - b.date.getTime());

    // Group consecutive dates
    const groups = [];
    let currentGroup = [parsedDates[0]];

    for (let i = 1; i < parsedDates.length; i++) {
      const prevDate = parsedDates[i - 1].date;
      const currentDate = parsedDates[i].date;

      // Check if dates are consecutive (within 1-2 days)
      const timeDiff = currentDate.getTime() - prevDate.getTime();
      const daysDiff = Math.ceil(timeDiff / (1000 * 60 * 60 * 24));

      if (daysDiff <= 2) {
        currentGroup.push(parsedDates[i]);
      } else {
        groups.push(currentGroup);
        currentGroup = [parsedDates[i]];
      }
    }

    if (currentGroup.length > 0) {
      groups.push(currentGroup);
    }

    return groups;
  }, [days]);

  // Pagination - show max 3 days on small screens, 7 on large screens
  const paginatedGroups = useMemo(() => {
    const allDays = dateGroups.flat();
    const pages = [];
    const maxDaysPerPage = screenSize === 'small' ? 3 : 7;

    for (let i = 0; i < allDays.length; i += maxDaysPerPage) {
      pages.push(allDays.slice(i, i + maxDaysPerPage));
    }

    return pages;
  }, [dateGroups, screenSize]);

  const totalPages = paginatedGroups.length;

  // Group current page days back into consecutive groups for display
  const currentPageGroups = useMemo(() => {
    const currentDays = paginatedGroups[currentPage] || [];

    if (currentDays.length === 0) return [];

    const groups = [];
    let currentGroup = [currentDays[0]];

    for (let i = 1; i < currentDays.length; i++) {
      const prevDate = currentDays[i - 1].date;
      const currentDate = currentDays[i].date;

      const timeDiff = currentDate.getTime() - prevDate.getTime();
      const daysDiff = Math.ceil(timeDiff / (1000 * 60 * 60 * 24));

      if (daysDiff <= 2) {
        currentGroup.push(currentDays[i]);
      } else {
        groups.push(currentGroup);
        currentGroup = [currentDays[i]];
      }
    }

    if (currentGroup.length > 0) {
      groups.push(currentGroup);
    }

    return groups;
  }, [paginatedGroups, currentPage]);

  const createTimeSlotId = (date: string, time: string) => {
    const time24 = to24HourFormat(time);
    // console.log(`${date}T${time24}:00.000Z`);
    return `${date}T${time24}:00.000Z`; // Force UTC, no local conversion
  };

  const isTimeSlotSelected = (timeSlotId: string) => {
    if (selectedTimeSlots.includes(timeSlotId)) return true;
    if (dragHandlers.tempSelectedDates.includes(timeSlotId)) return true;
    return false;
  };

  const isTimeSlotTempDeselected = (timeSlotId: string) => {
    return dragHandlers.tempDeselectedDates.includes(timeSlotId);
  };

  return (
    <div className="lg:col-span-3">
      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="mb-4 flex items-center justify-between px-4">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage(Math.max(0, currentPage - 1))}
            disabled={currentPage === 0}
            className="flex items-center gap-2"
          >
            <ChevronLeft className="h-4 w-4" />
            <span className="hidden sm:inline">Previous</span>
            <span className="sm:hidden">Prev</span>
          </Button>

          <span className="text-muted-foreground text-sm">
            Page {currentPage + 1} of {totalPages}
          </span>

          <Button
            variant="outline"
            size="sm"
            onClick={() =>
              setCurrentPage(Math.min(totalPages - 1, currentPage + 1))
            }
            disabled={currentPage === totalPages - 1}
            className="flex items-center gap-2"
          >
            <span className="hidden sm:inline">Next</span>
            <span className="sm:hidden">Next</span>
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      )}

      <div className="flex px-4">
        {/* Time Column */}
        <div className="w-10 flex-none sm:w-15">
          <div className="h-13"></div>
          {timeSlots.map((time, timeIndex) => {
            if (timeIndex % 4) {
              return (
                <div
                  key={timeIndex}
                  className="text-muted-foreground h-5 text-xs"
                ></div>
              );
            }
            return (
              <div
                key={timeIndex}
                className="text-muted-foreground h-5 w-full text-xs"
              >
                {time}
              </div>
            );
          })}
        </div>

        {/* Days Columns */}
        <div className="relative flex w-full flex-col">
          {/* Header with grouped dates */}
          <div className="flex h-14 items-center sm:top-16">
            {currentPageGroups.map((group, groupIndex) => (
              <React.Fragment key={groupIndex}>
                {/* Add spacing between groups */}
                {groupIndex > 0 && (
                  <div className="bg-background w-4 flex-none border-r border-l border-gray-200"></div>
                )}
                {group.map((day, dayIndex) => (
                  <div
                    key={`${groupIndex}-${dayIndex}`}
                    className="bg-background flex-1 space-y-0.5"
                  >
                    <div className="text-center text-[12px] capitalize">
                      {day.monthDay}
                    </div>
                    <div className="text-center capitalize">
                      {day.dayOfWeek}
                    </div>
                  </div>
                ))}
              </React.Fragment>
            ))}
          </div>

          {/* Time Grid */}
          <div className="flex">
            {currentPageGroups.map((group, groupIndex) => (
              <React.Fragment key={groupIndex}>
                {/* Add spacing column between groups */}
                {groupIndex > 0 && (
                  <div className="bg-background w-4 flex-none">
                    {timeSlots.map((time, timeIdx) => (
                      <div key={timeIdx} className="h-5"></div>
                    ))}
                  </div>
                )}
                {group.map((day, dayIndex) => (
                  <div
                    key={`${groupIndex}-${dayIndex}`}
                    className="border-gray flex-1 border-b"
                  >
                    {timeSlots.map((time, timeIdx) => {
                      const timeSlotId = createTimeSlotId(day.original, time);
                      // console.log(time);
                      const isSelected = isTimeSlotSelected(timeSlotId);
                      const isTempDeselected =
                        isTimeSlotTempDeselected(timeSlotId);
                      const showAsSelected = isSelected && !isTempDeselected;

                      return (
                        <React.Fragment key={timeIdx}>
                          <div
                            key={timeIdx}
                            className={cn(
                              'timeslot h-5 cursor-pointer border-r border-l',
                              // Border styles based on quarter position
                              timeIdx % 2 === 0
                                ? 'border-t [border-top-style:dashed]'
                                : '',

                              timeIdx % 4 === 0
                                ? 'border-t [border-top-style:solid]'
                                : '',
                              // Selection and edit active styles
                              {
                                // Green when selected
                                'border-green-500 bg-green-200 hover:bg-green-300':
                                  showAsSelected && !isEditActive,
                                // Red when edit is active
                                'border-rose-600 bg-rose-300 hover:border-rose-600 hover:bg-rose-400':
                                  isEditActive && !showAsSelected,
                                // Green with red border when both selected and edit active
                                'border-rose-600 bg-green-200 hover:border-rose-600 hover:bg-green-300':
                                  showAsSelected && isEditActive,
                                // Default hover styles when not selected
                                'hover:border-foreground border-gray hover:border hover:border-dashed':
                                  !isEditActive && !showAsSelected,
                              },
                            )}
                            onMouseDown={(e) =>
                              dragHandlers.handleMouseDown(timeSlotId, e)
                            }
                            onMouseEnter={() =>
                              dragHandlers.handleMouseEnter(timeSlotId)
                            }
                          ></div>
                        </React.Fragment>
                      );
                    })}
                  </div>
                ))}
              </React.Fragment>
            ))}
          </div>
        </div>
      </div>

      {/* Timezone Selector */}
      <div className="text-muted-foreground mt-4 flex items-center gap-4 px-4 text-sm">
        <span>Shown in</span>
        <Button
          variant="ghost"
          size="sm"
          className="text-muted-foreground hover:text-foreground h-auto p-1"
        >
          {timezoneDisplay}
          <ChevronDown className="ml-1 h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          className="text-muted-foreground hover:text-foreground h-auto p-1"
        >
          12h
          <ChevronDown className="ml-1 h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
