import React from 'react';

import { weekdaysMap } from '@/types/constants';
import { CalendarDay } from '@/types/event';

export function CalendarHeader({ groups }: { groups: CalendarDay[][] }) {
  return (
    <div className="flex h-14 items-center sm:top-16">
      {groups.map((group, groupIndex) => (
        <React.Fragment key={groupIndex}>
          {groupIndex > 0 && (
            <div className="bg-background w-4 flex-none border-r border-l border-gray-200"></div>
          )}
          {group.map((day, dayIndex) => (
            <div
              key={`${groupIndex}-${dayIndex}`}
              className="bg-background flex-1 space-y-0.5"
            >
              {day.date !== null ? (
                <>
                  <div className="text-center text-[12px] capitalize">
                    {day.monthDay}
                  </div>
                  <div className="text-center capitalize">{day.dayOfWeek}</div>
                </>
              ) : (
                <div className="text-center text-lg capitalize">
                  {weekdaysMap[day.dayOfWeek] || day.dayOfWeek}
                </div>
              )}
            </div>
          ))}
        </React.Fragment>
      ))}
    </div>
  );
}
