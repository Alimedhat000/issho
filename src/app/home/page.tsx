'use client';

import { useEffect, useState } from 'react';
import {
  CalendarMinus2,
  CalendarRange,
  ChevronDown,
  FolderPlus,
  Loader2,
  MoreHorizontal,
  Plus,
  Users,
} from 'lucide-react';

import Header from '@/components/layout/Header';
import { Button } from '@/components/ui/button';
import { Event } from '@/types/event';

// Helper function to format dates
const formatEventDates = (eventDates: Event['EventDates']) => {
  if (!eventDates || eventDates.length === 0) return 'No dates';

  // Check if it's weekday-based or date-based
  const hasWeekdays = eventDates.every((ed) => ed.weekday !== null);
  const hasDates = eventDates.every((ed) => ed.date !== null);

  // If all entries are weekdays → display sorted weekdays
  if (hasWeekdays) {
    // Map weekday codes to short names in order
    const weekdayOrder = ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'];
    const formattedWeekdays = eventDates
      .map((ed) => ed.weekday!)
      .sort((a, b) => weekdayOrder.indexOf(a) - weekdayOrder.indexOf(b))
      .join(', ');

    return formattedWeekdays;
  }

  // If all entries are dates → handle single date or date range
  if (hasDates) {
    const dates = eventDates
      .map((ed) => new Date(ed.date!))
      .sort((a, b) => a.getTime() - b.getTime());

    if (dates.length === 1) {
      return dates[0].toLocaleDateString('en-US', {
        month: 'numeric',
        day: 'numeric',
      });
    }

    const startDate = dates[0];
    const endDate = dates[dates.length - 1];

    const formatOptions: Intl.DateTimeFormatOptions = {
      month: 'numeric',
      day: 'numeric',
    };

    return `${startDate.toLocaleDateString(
      'en-US',
      formatOptions,
    )} - ${endDate.toLocaleDateString('en-US', formatOptions)}`;
  }

  // Fallback in case of mixed data (shouldn't happen normally)
  return 'Invalid event dates';
};

// Helper function to determine if it's a weekday pattern
const isWeekdayPattern = (eventDates: Event['EventDates']) => {
  if (!eventDates || eventDates.length <= 2) return false;

  return eventDates.every((ed) => ed.weekday !== null);
};

export default function HomePage() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/event');

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        // console.log(data);
        setEvents(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch events');
        console.error('Error fetching events:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  return (
    <div className="from-background to-muted/20 min-h-screen bg-gradient-to-br">
      <Header />

      <main className="container mx-auto px-4 py-8">
        <div className="mb-3 flex items-center justify-between">
          <span className="text-xl font-medium sm:text-2xl">Dashboard</span>

          <div className="flex items-center gap-3">
            <Button>New Event</Button>

            <Button variant={'ghost'}>
              <FolderPlus />
            </Button>
          </div>
        </div>

        <section>
          {/* Folder Structure - Static for now */}
          <div className="mb-6">
            <div className="text-muted-foreground mb-4 flex items-center gap-2 text-sm">
              <ChevronDown className="h-4 w-4" />
              <div className="rounded bg-green-100 px-2 py-1 text-green-800">
                Static Folders for now
              </div>
              <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                <MoreHorizontal className="h-3 w-3" />
              </Button>
              <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                <Plus className="h-3 w-3" />
              </Button>
            </div>
            <p className="text-muted-foreground mb-4 pl-6 text-sm">
              No events in this folder{' '}
            </p>

            <div className="text-muted-foreground mb-4 flex items-center gap-2 text-sm">
              <ChevronDown className="h-4 w-4" />
              <span>No folder</span>
            </div>
          </div>

          {/* Events Grid */}
          {loading && (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-6 w-6 animate-spin" />
              <span className="ml-2">Loading events...</span>
            </div>
          )}

          {error && (
            <div className="text-destructive mb-4 rounded-lg border border-red-200 bg-red-50 p-4">
              <p>Error loading events: {error}</p>
              <Button
                variant="outline"
                size="sm"
                className="mt-2"
                onClick={() => window.location.reload()}
              >
                Retry
              </Button>
            </div>
          )}

          {!loading && !error && events.length === 0 && (
            <div className="text-muted-foreground py-8 text-center">
              <p className="mb-2">No events found</p>
              <p className="text-sm">Create your first event to get started</p>
            </div>
          )}

          {!loading && !error && events.length > 0 && (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-2">
              {events.map((event) => (
                <div
                  key={event.id}
                  className="bg-card flex items-center gap-4 rounded-lg border p-4 shadow-sm transition-shadow hover:shadow-md"
                >
                  <div className="bg-foreground flex h-12 w-12 items-center justify-center rounded-lg">
                    {isWeekdayPattern(event.EventDates) ? (
                      <CalendarMinus2 className="text-accent h-6 w-6" />
                    ) : (
                      <CalendarRange className="text-accent h-6 w-6" />
                    )}
                  </div>

                  <div className="flex-1">
                    <h3 className="text-card-foreground font-medium">
                      {event.title}
                    </h3>
                    <p className="text-muted-foreground text-sm capitalize">
                      {formatEventDates(event.EventDates)}
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <div className="text-muted-foreground flex items-center gap-1 text-sm">
                      <Users className="h-4 w-4" />
                      <span>{event.Participant.length}</span>
                    </div>

                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </main>
    </div>
  );
}
