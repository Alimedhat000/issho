export interface EventFormData {
  eventName: string;
  selectedMode: 'dates-times' | 'dates-only';
  startTime: string; // 09:00 24h format
  endTime: string; // 10:00 24h format
  selectedDates: string[]; //Iso date strings ["2025-08-20", ...]
  selectedDays: string[]; // ["Monday", "Tuesday"]
  dateMode: 'specific' | 'week'; // specific dates or week days
  timeIncrement: string; // 30min, 1h
  timezone: string; // IANA like "Eroupe/London"
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
