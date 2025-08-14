'use client';

import { useState } from 'react';

import Header from '@/components/layout/Header';

import { CalendarGrid } from './_components/CalendarGrid';
import EventInfo from './_components/EventInfo';
import Footer from './_components/Footer';
import ResponseSideBar from './_components/ResponseSideBar';

export default function EventPage() {
  const [isEditActive, setisEditActive] = useState(false);
  const [selectedTimeSlots, setSelectedTimeSlots] = useState<string[]>([]);

  const sampleDates = [
    '2024-08-14',
    '2024-08-15',
    '2024-08-19',
    '2024-08-20',
    '2024-08-28',
    '2024-08-29',
    '2024-09-02',
    '2024-09-03',
    '2024-09-05',
    '2024-09-10',
  ];

  const sampleTimeSlots = [
    '9 AM',
    '10 AM',
    '11 AM',
    '12 PM',
    '1 PM',
    '2 PM',
    '3 PM',
    '4 PM',
  ];

  return (
    <div className="from-background to-muted/20 min-h-screen bg-gradient-to-br">
      {/* Header */}
      <Header />
      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {/* Event Header */}
        <EventInfo
          setisEditActive={setisEditActive}
          isEditActive={isEditActive}
        />

        <div className="grid gap-8 lg:grid-cols-4">
          {/* Calendar Grid */}

          <CalendarGrid
            days={sampleDates}
            timeSlots={sampleTimeSlots}
            isEditActive={isEditActive}
            selectedTimeSlots={selectedTimeSlots}
            onTimeSlotChange={setSelectedTimeSlots}
          />
          {/* Responses Sidebar */}
          <ResponseSideBar
            responses={[
              {
                id: '1',
                name: 'Ali',
                avatarUrl: 'https://avatar.iran.liara.run/public',
              },
              { id: '2', name: 'Sara' },
            ]}
          />
        </div>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}
