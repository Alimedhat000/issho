'use client';

import EventInfo from './_components/EventInfo';
import { CalendarGrid } from './_components/CalendarGrid';
import ResponseSideBar from './_components/ResponseSideBar';
import Footer from './_components/Footer';
import { useState } from 'react';
import Header from '@/components/layout/Header';

export default function EventPage() {
  const [isEditActive, setisEditActive] = useState(false);

  const timeSlots = [
    '10 AM',
    '11 AM',
    '12 PM',
    '1 PM',
    '2 PM',
    '3 PM',
    '4 PM',
    '5 PM',
  ];

  const days = ['Mon', 'Tue', 'Wed'];

  return (
    <div className="from-background to-muted/20 min-h-screen bg-gradient-to-br">
      {/* Header */}
      <Header />
      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {/* Event Header */}
        <EventInfo
          onAvailabilityClick={() => {
            setisEditActive(!isEditActive);
            console.log('Clicked');
          }}
        />

        <div className="grid gap-8 lg:grid-cols-4">
          {/* Calendar Grid */}

          <CalendarGrid timeSlots={timeSlots} days={days} />
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
