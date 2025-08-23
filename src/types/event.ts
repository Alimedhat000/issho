export interface EventFormData {
  title: string;
  selectedMode: 'dates-times' | 'dates-only';
  startTime: string; // 09:00 24h format
  endTime: string; // 10:00 24h format
  selectedDates: string[]; //Iso date strings ["2025-08-20", ...]
  selectedDays: string[]; // ["Monday", "Tuesday"]
  dateMode: 'specific' | 'week'; // specific dates or week days
  timeIncrement: string; // 30min, 1h
  timezone: string; // IANA like "Eroupe/London"
  creatorId?: string;
}

export interface CreateEventModalProps {
  children: React.ReactNode;
}

export interface CreateEventPayload {
  title: string;
  shortCode?: string;
  dates: string[]; // YYYY-MM-DD if not week days mode
  weekDays?: string[]; // ["Monday", "Wednesday"], only if using week mode
  startTime?: string; // e.g., "09:00" only if using dates and times
  endTime?: string; // e.g., "17:00"
  timeIncrement?: number; // minutes, e.g., 30
  timezone?: string; // IANA, e.g., "Europe/London"
  creatorId?: string; // optional for anonymous
}

export interface EventDate {
  id: string;
  eventId: string;
  date?: string;
  weekday?: string;
  TimeSlot: TimeSlot[];
}

export interface TimeSlot {
  id: string;
  eventDateId: string;
  hour: number;
  minute: number;
  fullDay: boolean;
  participantId: string;
  eventId: string;
  participant: {
    id: string;
    name: string;
    color: string;
    userId: string;
  };
}

export interface Participant {
  id: string;
  name: string;
  color: string;
  eventId: string;
  userId?: string;
  user?: {
    id: string;
    name: string;
    email: string;
    avatar?: string;
  };
}

export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
}

export interface Event {
  id: string;
  title: string;
  shortCode: string;
  creatorId?: string;
  timezone?: string;
  startTime?: string;
  endTime?: string;
  timeIncrement?: number;
  isFullDayEvent?: boolean;
  createdAt: string;
  updatedAt: string;
  EventDates: EventDate[];
  Participant: Participant[];
  creator?: User;
}

export interface CalendarDay {
  original: string;
  date: Date | null;
  dayOfWeek: string;
  monthDay: string;
}
