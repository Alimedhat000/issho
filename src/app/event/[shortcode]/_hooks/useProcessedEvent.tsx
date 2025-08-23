import { useMemo } from 'react';
import { format, parseISO } from 'date-fns';

import { Event, EventDate, Participant, TimeSlot } from '@/types/event';

type PropParticipant = {
  id: string;
  username: string;
  userId?: string;
};

export function useProcessedEvent(
  event: Event | null,
  participant: PropParticipant | null,
) {
  return useMemo(() => {
    if (!event) {
      return {
        dates: [],
        timeSlots: [],
        participants: [],
        timeSlotParticipantCounts: new Map(),
        currentParticipantTimeSlots: [],
      };
    }

    const WEEKDAYS_MAP: Record<string, string> = {
      mon: 'Mon',
      tue: 'Tue',
      wed: 'Wed',
      thu: 'Thu',
      fri: 'Fri',
      sat: 'Sat',
      sun: 'Sun',
    };

    // Prepare dates (support weekdays + normal dates)
    const dates =
      event.EventDates?.map((eventDate: EventDate) =>
        eventDate.date
          ? format(parseISO(eventDate.date), 'yyyy-MM-dd')
          : WEEKDAYS_MAP[eventDate.weekday?.toLowerCase() || ''] || '',
      ).filter(Boolean) || [];

    // Generate time slots if event has specific times
    const timeSlots: string[] = [];
    if (event.startTime && event.endTime && !event.isFullDayEvent) {
      const start = parseISO(`2000-01-01T${event.startTime}`);
      const end = parseISO(`2000-01-01T${event.endTime}`);
      const increment = event.timeIncrement || 60;

      while (start < end) {
        timeSlots.push(format(start, 'h:mm a'));
        start.setMinutes(start.getMinutes() + increment);
      }
    }

    // Participants list
    const participants =
      event.Participant?.map((p: Participant) => ({
        id: p.id,
        name: p.name,
        avatarUrl: p.user?.avatar,
      })) || [];

    // Build timeslot -> participants map
    const timeSlotParticipantCounts = new Map();
    const currentParticipantTimeSlots: string[] = [];

    event.EventDates?.forEach((eventDate: EventDate) => {
      const dateStr = eventDate.date
        ? format(parseISO(eventDate.date), 'yyyy-MM-dd')
        : WEEKDAYS_MAP[eventDate.weekday?.toLowerCase() || ''];

      eventDate.TimeSlot?.forEach((slot: TimeSlot) => {
        const hours = slot.hour.toString().padStart(2, '0');
        const minutes = slot.minute.toString().padStart(2, '0');
        const timeSlotId = `${dateStr}T${hours}:${minutes}:00.000Z`;

        const existing = timeSlotParticipantCounts.get(timeSlotId) || {
          count: 0,
          participants: [],
        };

        existing.count++;
        existing.participants.push(slot.participant);
        timeSlotParticipantCounts.set(timeSlotId, existing);

        if (participant && slot.participant.id === participant.id) {
          currentParticipantTimeSlots.push(timeSlotId);
        }
      });
    });

    return {
      dates,
      timeSlots,
      participants,
      timeSlotParticipantCounts,
      currentParticipantTimeSlots,
    };
  }, [event, participant]);
}
