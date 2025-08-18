import { useEffect, useState } from 'react';

import { parseIncrement, to24HourFormat } from '@/lib/utils';
import { Event, EventFormData } from '@/types/event';

export function useEvent(shortcode: string | null) {
  const [event, setEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!shortcode) return;

    const fetchEvent = async () => {
      setLoading(true);
      setError(null);

      try {
        const response = await fetch(`/api/event/${shortcode}`);
        if (!response.ok) {
          if (response.status === 404) {
            throw new Error('Event not found');
          }
          throw new Error('Failed to fetch event');
        }

        const eventData = await response.json();
        // console.log(eventData);
        setEvent(eventData);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
        setEvent(null);
      } finally {
        setLoading(false);
      }
    };

    fetchEvent();
  }, [shortcode]);

  return {
    event,
    loading,
    error,
    refetch: () => {
      if (shortcode) {
        const fetchEvent = async () => {
          setLoading(true);
          setError(null);

          try {
            const response = await fetch(`/api/event/${shortcode}`);

            if (!response.ok) {
              if (response.status === 404) {
                throw new Error('Event not found');
              }
              throw new Error('Failed to fetch event');
            }

            const eventData = await response.json();
            setEvent(eventData);
          } catch (err) {
            setError(err instanceof Error ? err.message : 'An error occurred');
            setEvent(null);
          } finally {
            setLoading(false);
          }
        };

        fetchEvent();
      }
    },
  };
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
      // console.log(eventData);

      // console.log(payload);

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
