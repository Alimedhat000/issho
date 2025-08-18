import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

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

export function parseIncrement(value: string | number | null): number | null {
  if (!value) return null;
  if (typeof value === 'number') return value;
  const match = value.match(/\d+/);
  return match ? parseInt(match[0], 10) : null;
}
