'use client';

import { useEffect, useState } from 'react';
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
import { useProcessedEvent } from './_hooks/useProcessedEvent';

export default function EventPage() {
  const router = useRouter();
  const params = useParams();
  const shortcode = params?.shortcode as string;

  const [isEditActive, setIsEditActive] = useState(false);
  const [selectedTimeSlots, setSelectedTimeSlots] = useState<string[]>([]);
  const [guestName, setGuestName] = useState('');

  const { event, loading, error, refetch } = useEvent(shortcode);
  const { user } = useAuth();
  const { participant, showModal, setShowModal, registerParticipant } =
    useParticipant(shortcode, user);

  const {
    dates,
    timeSlots,
    participants,
    timeSlotParticipantCounts,
    currentParticipantTimeSlots,
  } = useProcessedEvent(event, participant);

  const getTimeSlotIntensity = (timeSlotId: string) => {
    const data = timeSlotParticipantCounts.get(timeSlotId);
    if (!data || data.count === 0) return 0;

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
      finalParticipant = await registerParticipant();
    }

    if (!finalParticipant) {
      toast.error('Could not register participant');
      return;
    }

    try {
      const res = await fetch(`/api/event/${shortcode}/timeslot`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          participantId: finalParticipant.id,
          dates: selectedTimeSlots,
        }),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || 'Failed to save timeslots');
      }

      toast.success('Availability saved successfully!');
      setIsEditActive(false);

      refetch?.();
    } catch (error) {
      console.error(error);
      toast.error('Failed to save availability');
    }
  };

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
      <Header />

      <main className="container mx-auto px-4 py-8">
        <EventInfo
          event={event}
          isEditActive={isEditActive}
          setisEditActive={setIsEditActive}
          onEventUpdate={refetch}
          handleSave={handleSave}
        />

        <div className="grid gap-8 lg:grid-cols-4">
          <CalendarGrid
            days={dates}
            timeSlots={timeSlots}
            isEditActive={isEditActive}
            selectedTimeSlots={selectedTimeSlots}
            onTimeSlotChange={setSelectedTimeSlots}
            event={event}
            isFullDayEvent={event.isFullDayEvent}
            timeSlotParticipantCounts={timeSlotParticipantCounts}
            getTimeSlotIntensity={getTimeSlotIntensity}
          />

          <ResponseSideBar
            isEditActive={isEditActive}
            responses={participants}
          />
        </div>
      </main>

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
                if (guestName.trim()) registerParticipant(guestName.trim());
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
