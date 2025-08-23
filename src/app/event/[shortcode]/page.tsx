'use client';

import { useEffect, useMemo, useState } from 'react';
import { format, parseISO } from 'date-fns';
import { useParams, useRouter } from 'next/navigation';
import { toast } from 'sonner';

import Header from '@/components/layout/Header';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { useAuth } from '@/hooks/useAuth';
import { useEvent } from '@/hooks/useEvent';
import { useParticipant } from '@/hooks/useParticipant';

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
  const { user } = useAuth();
  const { participant, showModal, setShowModal, registerParticipant } =
    useParticipant(shortcode, user);

  const [guestName, setGuestName] = useState('');

  // Process event data for display
  const {
    dates,
    timeSlots,
    participants,
    timeSlotParticipantCounts,
    currentParticipantTimeSlots,
  } = useMemo(() => {
    if (!event)
      return {
        dates: [],
        timeSlots: [],
        participants: [],
        timeSlotParticipantCounts: new Map(),
        currentParticipantTimeSlots: [],
      };

    const WEEKDAYS_MAP: Record<string, string> = {
      mon: 'Mon',
      tue: 'Tue',
      wed: 'Wed',
      thu: 'Thu',
      fri: 'Fri',
      sat: 'Sat',
      sun: 'Sun',
    };

    // console.log(event);

    // Extract dates from EventDates
    const dates =
      event.EventDates?.map((eventDate) => {
        if (eventDate.date) {
          return format(parseISO(eventDate.date), 'yyyy-MM-dd');
        }
        // Handle weekdays if needed
        return WEEKDAYS_MAP[eventDate.weekday?.toLowerCase() || ''] || '';
      }).filter(Boolean) || [];

    // console.log(dates);

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
      })) || [];

    // Create a map to count participants per timeslot
    const timeSlotParticipantCounts = new Map<
      string,
      {
        count: number;
        participants: {
          id: string;
          name: string;
          color: string;
          userId: string;
        }[];
      }
    >();
    const currentParticipantTimeSlots: string[] = [];

    // Process all timeslots from all event dates
    event.EventDates?.forEach((eventDate) => {
      const dateStr = eventDate.date
        ? format(parseISO(eventDate.date), 'yyyy-MM-dd')
        : WEEKDAYS_MAP[eventDate.weekday?.toLowerCase() || ''];

      // console.log(eventDate.date, dateStr);
      eventDate.TimeSlot?.forEach((timeSlot) => {
        // Create ISO format timeslot ID
        const hours = timeSlot.hour.toString().padStart(2, '0');
        const minutes = timeSlot.minute.toString().padStart(2, '0');
        const timeSlotId = `${dateStr}T${hours}:${minutes}:00.000Z`;

        // Count participants for this timeslot
        const existing = timeSlotParticipantCounts.get(timeSlotId) || {
          count: 0,
          participants: [],
        };
        existing.count += 1;
        existing.participants.push(timeSlot.participant);
        timeSlotParticipantCounts.set(timeSlotId, existing);

        // Check if this timeslot belongs to current participant
        if (participant && timeSlot.participant.id === participant.id) {
          currentParticipantTimeSlots.push(timeSlotId);
        }
      });
    });

    return {
      dates,
      timeSlots,
      participants,
      timeSlotParticipantCounts,
      currentParticipantTimeSlots,
    };
  }, [event, participant]);

  // console.log(currentParticipantTimeSlots);

  const getTimeSlotIntensity = (timeSlotId: string) => {
    const data = timeSlotParticipantCounts.get(timeSlotId);
    if (!data || data.count === 0) return 0;

    // Calculate intensity based on participant count
    // You can adjust this logic based on your needs
    const maxParticipants = Math.max(
      ...Array.from(timeSlotParticipantCounts.values()).map((d) => d.count),
    );
    return data.count / maxParticipants;
  };

  useEffect(() => {
    if (participant && currentParticipantTimeSlots.length > 0) {
      setSelectedTimeSlots(currentParticipantTimeSlots);
    } else if (!participant) {
      setSelectedTimeSlots([]);
    }
  }, [participant, currentParticipantTimeSlots]);

  const handleSave = async () => {
    if (!user && !participant) {
      setShowModal(true);
      return;
    }

    let finalParticipant = participant;

    if (user && !participant) {
      // Logged in user but not registered → create participant
      finalParticipant = await registerParticipant();
    }

    if (!finalParticipant) {
      toast.error('Could not register participant');
      return;
    }

    try {
      // Call the PUT route to replace availability
      const res = await fetch(`/api/event/${shortcode}/timeslot`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          participantId: finalParticipant.id,
          dates: selectedTimeSlots, // Make sure these are ISO strings!
        }),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || 'Failed to save timeslots');
      }

      toast.success('Availability saved successfully!');
      setisEditActive(false);

      if (refetch) {
        refetch();
      }
    } catch (error) {
      console.error(error);
      toast.error('Failed to save availability');
    }
  };

  if (error) {
    console.log(error);
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
          handleSave={handleSave}
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
            // New
            timeSlotParticipantCounts={timeSlotParticipantCounts}
            getTimeSlotIntensity={getTimeSlotIntensity}
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

      <Dialog open={showModal} onOpenChange={setShowModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Enter your name</DialogTitle>
          </DialogHeader>
          <div className="flex flex-col gap-4">
            <Input
              placeholder="Your name"
              value={guestName}
              onChange={(e) => setGuestName(e.target.value)}
            />
            <Button
              onClick={() => {
                if (guestName.trim()) {
                  registerParticipant(guestName.trim());
                }
              }}
            >
              Continue
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
