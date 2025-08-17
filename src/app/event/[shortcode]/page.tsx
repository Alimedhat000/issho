'use client';

import { useMemo, useState } from 'react';
import { format, parseISO } from 'date-fns';
import { useParams, useRouter } from 'next/navigation';

import Header from '@/components/layout/Header';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useEvent } from '@/hooks/useEvent';

import { CalendarGrid } from './_components/CalendarGrid';
import EventInfo from './_components/EventInfo';
import Footer from './_components/Footer';
import ResponseSideBar from './_components/ResponseSideBar';

export default function EventPage() {
  const router = useRouter();
  const params = useParams();
  const shortcode = params?.shortcode as string;

  const [isEditActive, setisEditActive] = useState(false);
  const [selectedTimeSlots, setSelectedTimeSlots] = useState<string[]>([]);

  const { event, loading, error, refetch } = useEvent(shortcode);

  // Process event data for display
  const { dates, timeSlots, participants } = useMemo(() => {
    if (!event) return { dates: [], timeSlots: [], participants: [] };

    // Extract dates from EventDates
    const dates =
      event.EventDates?.map((eventDate) => {
        if (eventDate.date) {
          return format(parseISO(eventDate.date), 'yyyy-MM-dd');
        }
        // Handle weekdays if needed
        return eventDate.weekday || '';
      }).filter(Boolean) || [];

    // Generate time slots if event has specific times
    let timeSlots: string[] = [];
    if (event.startTime && event.endTime && !event.isFullDayEvent) {
      const start = parseISO(`2000-01-01T${event.startTime}`);
      const end = parseISO(`2000-01-01T${event.endTime}`);
      const increment = event.timeIncrement || 60; // Default to 60 minutes

      const slots = [];
      let current = start;

      while (current < end) {
        slots.push(format(current, 'h:mm a'));
        current = new Date(current.getTime() + increment * 60000);
      }

      timeSlots = slots;
    }

    // Process participants
    const participants =
      event.Participant?.map((participant) => ({
        id: participant.id,
        name: participant.name,
        avatarUrl: participant.user?.avatar,
        color: participant.color,
      })) || [];

    return { dates, timeSlots, participants };
  }, [event]);

  if (error) {
    router.push('/404');
    return (
      <div className="from-background to-muted/20 min-h-screen bg-gradient-to-br">
        <Header />
        <main className="container mx-auto px-4 py-8">
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        </main>
      </div>
    );
  }

  if (loading || !event) {
    return (
      <div className="from-background to-muted/20 min-h-screen bg-gradient-to-br">
        <Header />
        <main className="container mx-auto px-4 py-8"></main>
      </div>
    );
  }

  return (
    <div className="from-background to-muted/20 min-h-screen bg-gradient-to-br">
      {/* Header */}
      <Header />
      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {/* Event Header */}
        <EventInfo
          event={event}
          setisEditActive={setisEditActive}
          isEditActive={isEditActive}
          onEventUpdate={refetch}
        />

        <div className="grid gap-8 lg:grid-cols-4">
          {/* Calendar Grid */}

          <CalendarGrid
            days={dates}
            timeSlots={timeSlots}
            isEditActive={isEditActive}
            selectedTimeSlots={selectedTimeSlots}
            onTimeSlotChange={setSelectedTimeSlots}
            event={event}
            isFullDayEvent={event.isFullDayEvent}
          />
          {/* Responses Sidebar */}
          <ResponseSideBar
            isEditActive={isEditActive}
            responses={participants}
            // event={event}
          />
        </div>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}
