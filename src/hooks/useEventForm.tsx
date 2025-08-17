import { useCallback, useState } from 'react';

import type { EventFormData } from '@/types/event';

const initialFormData: EventFormData = {
  title: '',
  selectedMode: 'dates-times',
  dateMode: 'specific',
  selectedDates: [],
  selectedDays: [],
  startTime: '9 am',
  endTime: '5 pm',
  timeIncrement: '15 min',
  timezone: 'Africa/Cairo',
  creatorId: undefined,
};

export function useEventForm() {
  const [formData, setFormData] = useState<EventFormData>(initialFormData);

  const updateFormData = (updates: Partial<EventFormData>) => {
    setFormData((prev) => ({ ...prev, ...updates }));
  };

  const canCreateEvent =
    formData.title.trim().length > 0 && formData.selectedDates.length > 0;

  const resetForm = useCallback(() => {
    setFormData(initialFormData);
  }, []);

  return { formData, updateFormData, canCreateEvent, resetForm };
}
