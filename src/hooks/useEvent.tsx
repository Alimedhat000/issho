import { useState } from 'react';

import { Event, EventFormData } from '@/types/event';

function to24HourFormat(time: string | null): string | null {
  if (!time) return null;

  // normalize input (trim + lowercase)
  const input = time.trim().toLowerCase();

  // match am/pm format like "9 am", "8:30 pm"
  const match = input.match(/^(\d{1,2})(?::(\d{2}))?\s*(am|pm)$/);
  if (match) {
    let hours = parseInt(match[1], 10);
    const minutes = match[2] ? parseInt(match[2], 10) : 0;
    const period = match[3];

    if (period === 'pm' && hours !== 12) {
      hours += 12;
    } else if (period === 'am' && hours === 12) {
      hours = 0;
    }

    return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`;
  }

  // fallback: try "HH:mm" or "HH:mm:ss"
  const date = new Date(`1970-01-01T${input}`);
  if (!isNaN(date.getTime())) {
    return date.toTimeString().slice(0, 5);
  }

  return null;
}
function parseIncrement(value: string | number | null): number | null {
  if (!value) return null;
  if (typeof value === 'number') return value;
  const match = value.match(/\d+/);
  return match ? parseInt(match[0], 10) : null;
}

export function useCreateEvent() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createEvent = async (
    eventData: EventFormData,
  ): Promise<Event | null> => {
    setLoading(true);
    setError(null);

    const isWeekdaysActive =
      eventData.selectedMode === 'dates-times' && eventData.dateMode === 'week';

    const isTimesActive = eventData.selectedMode === 'dates-times';

    try {
      const payload = {
        title: eventData.title,
        dates: eventData.dateMode === 'specific' ? eventData.selectedDates : [],
        weekDays: isWeekdaysActive ? eventData.selectedDays : [],
        startTime: isTimesActive ? to24HourFormat(eventData.startTime) : null,
        endTime: isTimesActive ? to24HourFormat(eventData.endTime) : null,
        timeIncrement: parseIncrement(eventData.timeIncrement),
        timezone:
          eventData.timezone ||
          Intl.DateTimeFormat().resolvedOptions().timeZone,
        creatorId: eventData.creatorId || null,
      };
      console.log(eventData);

      console.log(payload);

      const response = await fetch('/api/event', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to create event');
      }

      const newEvent = await response.json();
      return newEvent;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      return null;
    } finally {
      setLoading(false);
    }
  };

  return { createEvent, loading, error };
}
