import { useMemo } from 'react';

import { Event } from '@/types/event';

export function useTimezone(event?: Event) {
  const timezone =
    event?.timezone || Intl.DateTimeFormat().resolvedOptions().timeZone;

  const timezoneDisplay = useMemo(() => {
    try {
      const date = new Date();
      const formatter = new Intl.DateTimeFormat('en', {
        timeZone: timezone,
        timeZoneName: 'short',
      });
      const parts = formatter.formatToParts(date);
      const tzName = parts.find((part) => part.type === 'timeZoneName')?.value;

      const offset = date.getTimezoneOffset() * -1;
      const hours = Math.floor(Math.abs(offset) / 60);
      const minutes = Math.abs(offset) % 60;
      const sign = offset >= 0 ? '+' : '-';

      return `(GMT${sign}${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}) ${tzName}`;
    } catch {
      return '(GMT+00:00) UTC';
    }
  }, [timezone]);

  return { timezone, timezoneDisplay };
}
