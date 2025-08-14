import React from 'react';
import { ChevronDown } from 'lucide-react';

import { Button } from '@/components/ui/button';

export function CalendarGrid({
  days,
  timeSlots,
}: {
  days: string[];
  timeSlots: string[];
}) {
  return (
    <div className="lg:col-span-3">
      <div className="flex px-4">
        {/* Time */}
        <div className="w-8 flex-none sm:w-12">
          <div className="h-20"></div>
          {timeSlots.map((time, timeIndex) => {
            return (
              <>
                <div
                  className="text-muted-foreground h-5 text-xs"
                  key={timeIndex}
                >
                  {time}
                </div>
                <div
                  className="text-muted-foreground h-5 text-xs"
                  key={time + 15}
                ></div>
                <div
                  className="text-muted-foreground h-5 text-xs"
                  key={time + 30}
                ></div>
                <div
                  className="text-muted-foreground h-5 text-xs"
                  key={time + 45}
                ></div>
              </>
            );
          })}
        </div>

        {/* Days */}
        <div className="relative flex w-full flex-col">
          <div className="sticky top-14 z-10 flex h-14 items-center sm:top-16">
            {days.map((day, dayIndex) => {
              return (
                <>
                  <div key={dayIndex} className="flex-1 space-y-0.5">
                    <div className="text-center text-[12px] capitalize">
                      Aug 13
                    </div>
                    <div className="text-center capitalize">Wed</div>
                  </div>
                  <div key={dayIndex + 10} className="flex-1 space-y-0.5">
                    <div className="text-center text-[12px] capitalize">
                      Aug 13
                    </div>
                    <div className="text-center capitalize">Wed</div>
                  </div>
                </>
              );
            })}
          </div>

          {/* Select Days Grid */}
          <div className="border-gray flex border-b">
            {days.map((day, dayIndex) => {
              return (
                <>
                  <div key={dayIndex} className="flex-1">
                    {timeSlots.map((time) => {
                      return (
                        <>
                          <div
                            key={time}
                            className="timeslot border-l-gray border-t-gray h-5 border-t border-r border-l"
                          ></div>
                          <div
                            key={time + 15}
                            className="timeslot border-l-gray border-t-gray h-5 border-r border-l"
                          ></div>
                          <div
                            key={time + 30}
                            className="timeslot border-l-gray border-t-gray h-5 border-t border-r border-l"
                          ></div>
                          <div
                            key={time + 45}
                            className="timeslot border-l-gray border-t-gray h-5 border-r border-l"
                          ></div>
                        </>
                      );
                    })}
                  </div>
                  <div key={dayIndex + 10} className="flex-1">
                    {timeSlots.map((time) => {
                      return (
                        <>
                          <div
                            key={time}
                            className="timeslot border-l-gray border-t-gray h-5 border-t border-r border-l"
                          ></div>
                          <div
                            key={time + 15}
                            className="timeslot border-l-gray border-t-gray h-5 border-r border-l"
                          ></div>
                          <div
                            key={time + 30}
                            className="timeslot border-l-gray border-t-gray h-5 border-t border-r border-l"
                          ></div>
                          <div
                            key={time + 45}
                            className="timeslot border-l-gray border-t-gray h-5 border-r border-l"
                          ></div>
                        </>
                      );
                    })}
                  </div>
                </>
              );
            })}
          </div>
        </div>
      </div>

      {/* Timezone Selector */}
      <div className="text-muted-foreground mt-4 flex items-center gap-4 text-sm">
        <span>Shown in</span>
        <Button
          variant="ghost"
          size="sm"
          className="text-muted-foreground hover:text-foreground h-auto p-1"
        >
          (GMT+3:00) Cairo
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
