import { WEEKDAY_ORDER } from '@/types/constants';
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

  // Separate weekdays & specific dates
  const weekdayItems = dates.filter((d) => !d.date);
  const dateItems = dates.filter((d) => d.date);

  // Sort weekdays in natural order (Sunday → Saturday)
  weekdayItems.sort(
    (a, b) =>
      WEEKDAY_ORDER[a.original.toLowerCase()] -
      WEEKDAY_ORDER[b.original.toLowerCase()],
  );

  // Group consecutive weekdays together
  const weekdayGroups: CalendarDay[][] = [];
  if (weekdayItems.length) {
    let currentGroup: CalendarDay[] = [weekdayItems[0]];

    for (let i = 1; i < weekdayItems.length; i++) {
      const prevIndex =
        WEEKDAY_ORDER[weekdayItems[i - 1].original.toLowerCase()];
      const currIndex = WEEKDAY_ORDER[weekdayItems[i].original.toLowerCase()];

      if (currIndex === prevIndex + 1) {
        currentGroup.push(weekdayItems[i]);
      } else {
        weekdayGroups.push(currentGroup);
        currentGroup = [weekdayItems[i]];
      }
    }

    if (currentGroup.length > 0) {
      weekdayGroups.push(currentGroup);
    }
  }

  // If there are no date items, return weekday groups only
  if (dateItems.length === 0) {
    return weekdayGroups;
  }

  // Sort date-based items chronologically
  dateItems.sort((a, b) => a.date!.getTime() - b.date!.getTime());

  // Group consecutive dates
  const dateGroups: CalendarDay[][] = [];
  let currentDateGroup: CalendarDay[] = [dateItems[0]];

  for (let i = 1; i < dateItems.length; i++) {
    const prevDate = dateItems[i - 1].date!;
    const currDate = dateItems[i].date!;
    const daysDiff =
      (currDate.getTime() - prevDate.getTime()) / (1000 * 60 * 60 * 24);

    if (daysDiff <= 1) {
      currentDateGroup.push(dateItems[i]);
    } else {
      dateGroups.push(currentDateGroup);
      currentDateGroup = [dateItems[i]];
    }
  }

  if (currentDateGroup.length > 0) {
    dateGroups.push(currentDateGroup);
  }

  // Merge dates first, then weekdays
  return [...dateGroups, ...weekdayGroups];
}

export function createTimeSlotId(date: string, time: string): string {
  const time24 = to24HourFormat(time);
  return `${date}T${time24}:00.000Z`;
}
