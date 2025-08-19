import { CalendarDay } from '@/types/event';

export function to24HourFormat(time: string | null): string | null {
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
export function groupConsecutiveDates(dates: CalendarDay[]): CalendarDay[][] {
  if (!dates.length) return [];

  const groups = [];
  let currentGroup = [dates[0]];

  for (let i = 1; i < dates.length; i++) {
    const prevDate = dates[i - 1].date;
    const currentDate = dates[i].date;
    const timeDiff = currentDate.getTime() - prevDate.getTime();
    const daysDiff = Math.ceil(timeDiff / (1000 * 60 * 60 * 24));

    if (daysDiff <= 2) {
      currentGroup.push(dates[i]);
    } else {
      groups.push(currentGroup);
      currentGroup = [dates[i]];
    }
  }

  if (currentGroup.length > 0) {
    groups.push(currentGroup);
  }

  return groups;
}

export function createTimeSlotId(date: string, time: string): string {
  const time24 = to24HourFormat(time);
  return `${date}T${time24}:00.000Z`;
}
