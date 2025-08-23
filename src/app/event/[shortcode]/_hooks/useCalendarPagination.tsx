import { useEffect, useMemo, useState } from 'react';

import { groupConsecutiveDates } from '@/lib/dateUtils';
import { CalendarDay } from '@/types/event';

const WEEKDAY_ORDER = ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'];

const WEEKDAY_LABELS: Record<string, string> = {
  sun: 'Sun',
  mon: 'Mon',
  tue: 'Tue',
  wed: 'Wed',
  thu: 'Thu',
  fri: 'Fri',
  sat: 'Sat',
};

export function useCalendarPagination(days: string[]) {
  const [currentPage, setCurrentPage] = useState(0);
  const [screenSize, setScreenSize] = useState<'small' | 'large'>('large');

  // Parse and group dates
  const dateGroups = useMemo(() => {
    if (!days?.length) return [];

    const weekdays: CalendarDay[] = [];
    const specificDates: CalendarDay[] = [];

    days.forEach((day) => {
      // Check if the value is a weekday (mon, tue, etc.)
      if (WEEKDAY_ORDER.includes(day.toLowerCase())) {
        weekdays.push({
          original: day,
          date: null, // no real date
          dayOfWeek: WEEKDAY_LABELS[day.toLowerCase()],
          monthDay: WEEKDAY_LABELS[day.toLowerCase()],
        });
      } else {
        // Assume it's an ISO date string
        const date = new Date(day);
        if (!isNaN(date.getTime())) {
          specificDates.push({
            original: day,
            date,
            dayOfWeek: date.toLocaleDateString('en', { weekday: 'short' }),
            monthDay: date.toLocaleDateString('en', {
              month: 'short',
              day: 'numeric',
            }),
          });
        }
      }
    });

    // Sort specific dates chronologically
    specificDates.sort((a, b) => a.date!.getTime() - b.date!.getTime());

    // Sort weekdays in natural order (Mon → Sun)
    weekdays.sort(
      (a, b) =>
        WEEKDAY_ORDER.indexOf(a.original.toLowerCase()) -
        WEEKDAY_ORDER.indexOf(b.original.toLowerCase()),
    );

    // Group specific dates, but keep weekdays as-is
    const groupedDates = groupConsecutiveDates(specificDates);
    return [...groupedDates, weekdays];
  }, [days]);

  // Pagination logic
  const paginatedGroups = useMemo(() => {
    const allDays = dateGroups.flat();
    const maxDaysPerPage = screenSize === 'small' ? 3 : 7;
    const pages = [];

    for (let i = 0; i < allDays.length; i += maxDaysPerPage) {
      pages.push(allDays.slice(i, i + maxDaysPerPage));
    }

    return pages;
  }, [dateGroups, screenSize]);

  const currentPageGroups = useMemo(() => {
    const currentDays = paginatedGroups[currentPage] || [];
    return currentDays.length ? groupConsecutiveDates(currentDays) : [];
  }, [paginatedGroups, currentPage]);

  // Screen size tracking
  useEffect(() => {
    const checkScreenSize = () => {
      setScreenSize(window.innerWidth < 768 ? 'small' : 'large');
    };

    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  // Reset page when screen size changes
  useEffect(() => {
    setCurrentPage(0);
  }, [screenSize]);

  return {
    currentPage,
    setCurrentPage,
    totalPages: paginatedGroups.length,
    currentPageGroups,
  };
}
