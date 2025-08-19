import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function parseIncrement(value: string | number | null): number | null {
  if (!value) return null;
  if (typeof value === 'number') return value;
  const match = value.match(/\d+/);
  return match ? parseInt(match[0], 10) : null;
}
