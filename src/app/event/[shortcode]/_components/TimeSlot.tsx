import { useCalendarDrag } from '@/hooks/useCalendarDrag';
import { cn } from '@/lib/utils';
import { weekdaysMap } from '@/types/constants';
import { CalendarDay } from '@/types/event';

import { useMouseTooltip } from '../_hooks/useMouseTooltip';

interface TimeSlotProps {
  timeSlotId: string;
  timeIdx: number;
  isEditActive: boolean;
  dragHandlers: ReturnType<typeof useCalendarDrag>;
  getTimeSlotIntensity?: (id: string) => number;
  selectedTimeSlots: string[];
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
  time: string;
  day: CalendarDay;
  tooltip: ReturnType<typeof useMouseTooltip>;
}

export function TimeSlot({
  timeSlotId,
  timeIdx,
  isEditActive,
  dragHandlers,
  getTimeSlotIntensity,
  selectedTimeSlots,
  timeSlotParticipantCounts,
  time,
  day,
  tooltip,
}: TimeSlotProps) {
  const intensity = getTimeSlotIntensity?.(timeSlotId) || 0;
  const isSelected =
    selectedTimeSlots.includes(timeSlotId) ||
    dragHandlers.tempSelectedDates.includes(timeSlotId);
  const isTempDeselected =
    dragHandlers.tempDeselectedDates.includes(timeSlotId);
  const showAsSelected = isSelected && !isTempDeselected;
  const hasParticipants = intensity > 0;

  // console.log(timeSlotId);

  const getClassNames = () => {
    const baseClasses = cn(
      'timeslot border-gray h-5 cursor-pointer border-r border-l',
      timeIdx % 2 === 0 ? 'border-t [border-top-style:dashed]' : '',
      timeIdx % 4 === 0 ? 'border-t [border-top-style:solid]' : '',
    );

    if (isEditActive) {
      return cn(
        baseClasses,
        'hover:border-foreground border-background hover:border hover:border-dashed',
        showAsSelected
          ? 'bg-green-400 hover:bg-green-500'
          : 'bg-rose-300 hover:border-gray hover:bg-rose-400',
      );
    }

    return cn(
      baseClasses,
      'hover:border hover:border-dashed',
      hasParticipants
        ? 'hover:border-foreground'
        : 'hover:border-foreground border-gray',
    );
  };

  const getInlineStyles = () => {
    if (isEditActive || intensity === 0) return {};

    const bgOpacity = Math.min(0.15 + intensity * 0.35, 0.7);
    return {
      backgroundColor: `rgba(34, 197, 94, ${bgOpacity})`,
    };
  };

  const getTooltipContent = () => {
    let formattedDate;
    if (day.date) {
      formattedDate = day.date.toLocaleDateString('en-US', {
        weekday: 'long',
        month: 'long',
        day: 'numeric',
        year: 'numeric',
      });
    } else {
      formattedDate = weekdaysMap[day.dayOfWeek];
    }

    const formattedTime = time;

    let content = `${formattedDate}, ${formattedTime}`;

    if (!isEditActive && intensity > 0) {
      const participantCount =
        Math.round(
          intensity * (timeSlotParticipantCounts?.get(timeSlotId)?.count || 0),
        ) || 0;

      if (participantCount > 0) {
        content += ` — ${participantCount === 1 ? '1 person' : `${participantCount} people`} available`;
      }
    }

    return content;
  };

  return (
    <div
      className={getClassNames()}
      style={getInlineStyles()}
      onMouseDown={(e) => {
        if (isEditActive) {
          dragHandlers.handleMouseDown(timeSlotId, e);
        }
      }}
      onMouseEnter={(e) => {
        if (isEditActive) {
          dragHandlers.handleMouseEnter(timeSlotId);
        }
        tooltip.showTooltip(getTooltipContent(), e);
      }}
      onMouseLeave={() => {
        tooltip.hideTooltip();
      }}
      onMouseMove={(e) => {
        tooltip.updatePosition(e);
      }}
    />
  );
}
