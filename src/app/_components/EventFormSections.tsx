import React, { useState } from 'react';
import Link from 'next/link';

import { AnimatedSection } from '@/components/ui/animatedSection';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { paths } from '@/config/paths';
import { useCalendar } from '@/hooks/useCalendar';
import { EventFormData } from '@/types/event';

import { AdvancedOptions } from './AdvancedOptions';
import { Calendar } from './Calendar';
import { DateModeSelector } from './DateModeSelector';
import { DaysOfWeekSelector } from './DaysOfWeekSelector';
import { TimeSelection } from './TimeSelection';

function EventFormSectionsComponent({
  formData,
  updateFormData,
}: {
  formData: EventFormData;
  updateFormData: (updates: Partial<EventFormData>) => void;
}) {
  const { currentMonth, navigateMonth } = useCalendar();

  const [showAdvanced, setShowAdvanced] = useState(false);

  return (
    <>
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
            formData.dateMode === 'week' &&
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
            onDatesChange={(dates) => updateFormData({ selectedDates: dates })}
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
            <Link
              href={paths.auth.login.getHref()}
              className="text-accent-foreground underline"
            >
              Sign in
            </Link>{' '}
            to use this feature
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
    </>
  );
}

EventFormSectionsComponent.displayName = 'EventFormSections';

export const EventFormSections = React.memo(EventFormSectionsComponent);
