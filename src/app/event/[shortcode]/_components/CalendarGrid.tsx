import React, { useEffect } from 'react';

import { useCalendarDrag } from '@/app/event/[shortcode]/_hooks/useCalendarGridDrag';
import { useCalendarPagination } from '@/app/event/[shortcode]/_hooks/useCalendarPagination';
import { useTimezone } from '@/app/event/[shortcode]/_hooks/useTimezone';
import { createTimeSlotId } from '@/lib/dateUtils';
import { Event } from '@/types/event';

import { CalendarHeader } from './CalendarHeader';
import { PaginationControls } from './PaginationControls';
import { TimeColumn } from './TimeColumn';
import { TimeSlot } from './TimeSlot';
import { TimezoneSelector } from './TimeZoneSelector';

export interface CalendarGridProps {
  days: string[];
  timeSlots: string[];
  isEditActive: boolean;
  selectedTimeSlots?: string[];
  onTimeSlotChange?: (slots: string[]) => void;
  event?: Event;
  isFullDayEvent?: boolean;
  timeSlotParticipantCounts?: Map<
    string,
    {
      count: number;
      participants: {
        id: string;
        name: string;
        color: string;
        userId: string;
      }[];
    }
  >;
  getTimeSlotIntensity?: (timeSlotId: string) => number;
}

export function CalendarGrid(props: CalendarGridProps) {
  const {
    days,
    timeSlots,
    isEditActive,
    selectedTimeSlots = [],
    onTimeSlotChange,
    event,
    timeSlotParticipantCounts,
    getTimeSlotIntensity,
  } = props;

  const dragHandlers = useCalendarDrag(
    selectedTimeSlots,
    onTimeSlotChange || (() => {}),
    isEditActive,
  );

  const { currentPage, setCurrentPage, totalPages, currentPageGroups } =
    useCalendarPagination(days);

  const { timezoneDisplay } = useTimezone(event);

  // Set up drag event listeners
  useEffect(() => {
    document.addEventListener('mouseup', dragHandlers.handleMouseUp);
    return () =>
      document.removeEventListener('mouseup', dragHandlers.handleMouseUp);
  }, [dragHandlers.handleMouseUp]);

  return (
    <div className="lg:col-span-3">
      <PaginationControls
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
      />

      <div className="flex px-4">
        <TimeColumn timeSlots={timeSlots} />

        <div className="relative flex w-full flex-col">
          <CalendarHeader groups={currentPageGroups} />

          {/* Time Grid */}
          <div className="flex">
            {currentPageGroups.map((group, groupIndex) => (
              <React.Fragment key={groupIndex}>
                {groupIndex > 0 && (
                  <div className="bg-background w-4 flex-none">
                    {timeSlots.map((_, timeIdx) => (
                      <div key={timeIdx} className="h-5"></div>
                    ))}
                  </div>
                )}
                {group.map((day, dayIndex) => (
                  <div
                    key={`${groupIndex}-${dayIndex}`}
                    className="border-gray flex-1 border-b"
                  >
                    {timeSlots.map((time, timeIdx) => (
                      <TimeSlot
                        key={timeIdx}
                        timeSlotId={createTimeSlotId(day.original, time)}
                        timeIdx={timeIdx}
                        isEditActive={isEditActive}
                        dragHandlers={dragHandlers}
                        getTimeSlotIntensity={getTimeSlotIntensity}
                        selectedTimeSlots={selectedTimeSlots}
                        timeSlotParticipantCounts={timeSlotParticipantCounts}
                      />
                    ))}
                  </div>
                ))}
              </React.Fragment>
            ))}
          </div>
        </div>
      </div>

      <TimezoneSelector timezoneDisplay={timezoneDisplay} />
    </div>
  );
}
