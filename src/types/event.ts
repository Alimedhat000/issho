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
