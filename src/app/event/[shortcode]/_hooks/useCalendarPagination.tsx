import { useEffect, useMemo, useState } from 'react';

import { groupConsecutiveDates } from '@/lib/dateUtils';
import { CalendarDay } from '@/types/event';

export function useCalendarPagination(days: string[]) {
  const [currentPage, setCurrentPage] = useState(0);
  const [screenSize, setScreenSize] = useState<'small' | 'large'>('large');

  // Parse and group dates
  const dateGroups = useMemo(() => {
    if (!days?.length) return [];

    const parsedDates: CalendarDay[] = days
      .map((day) => {
        const date = new Date(day);
        return {
          original: day,
          date,
          dayOfWeek: date.toLocaleDateString('en', { weekday: 'short' }),
          monthDay: date.toLocaleDateString('en', {
            month: 'short',
            day: 'numeric',
          }),
        };
      })
      .sort((a, b) => a.date.getTime() - b.date.getTime());

    return groupConsecutiveDates(parsedDates);
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

  // Reset page on screen size change
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
