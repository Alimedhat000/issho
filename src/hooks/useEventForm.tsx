import { useState } from 'react';
import type { EventFormData } from '@/types/event';

export function useEventForm() {
  const [formData, setFormData] = useState<EventFormData>({
    eventName: '',
    selectedMode: 'dates-times',
    startTime: '9 am',
    endTime: '5 pm',
    selectedDates: [],
    selectedDays: [],
    dateMode: 'specific',
    timeIncrement: '15 min',
    timezone: 'Africa/Cairo',
  });

  const updateFormData = (updates: Partial<EventFormData>) => {
    setFormData((prev) => ({ ...prev, ...updates }));
  };

  const canCreateEvent =
    formData.eventName.trim().length > 0 && formData.selectedDates.length > 0;

  return { formData, updateFormData, canCreateEvent };
}
