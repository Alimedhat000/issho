'use client';

import {
  CalendarDays,
  CalendarRange,
  ChevronDown,
  FolderPlus,
  MoreHorizontal,
  Plus,
  Users,
} from 'lucide-react';

import Header from '@/components/layout/Header';
import { Button } from '@/components/ui/button';

const events = [
  {
    id: 1,
    name: 'kajsjbd',
    dates: 'Mon, Tue, Thu, Sat',
    participants: 0,
    weekdays: true,
  },
  {
    id: 2,
    name: 'asdasd',
    dates: '8/18 - 8/21',
    participants: 0,
    weekdays: false,
  },
  {
    id: 3,
    name: 'asdasd',
    dates: '8/16 - 8/22',
    participants: 0,
    weekdays: false,
  },
  {
    id: 4,
    name: 'asdasd',
    dates: '8/17 - 8/25',
    participants: 1,
    weekdays: false,
  },
  {
    id: 5,
    name: 'ads',
    dates: '8/14 - 8/29',
    participants: 2,
    weekdays: false,
  },
  {
    id: 6,
    name: 'adasd',
    dates: '8/13 - 8/29',
    participants: 0,
    weekdays: false,
  },
  {
    id: 7,
    name: 'asdasdassd',
    dates: '8/13 - 8/31',
    participants: 0,
    weekdays: false,
  },
  {
    id: 8,
    name: 'شیشیشی',
    dates: '8/13 - 8/27',
    participants: 1,
    weekdays: false,
  },
  {
    id: 9,
    name: 'شیشیشی',
    dates: '8/19 - 8/28',
    participants: 0,
    weekdays: false,
  },
  {
    id: 10,
    name: 'شیشیشی',
    dates: '8/13 - 8/21',
    participants: 0,
    weekdays: false,
  },
];

export default function HomePage() {
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
          {/* Folder Structure */}
          <div className="mb-6">
            <div className="text-muted-foreground mb-4 flex items-center gap-2 text-sm">
              <ChevronDown className="h-4 w-4" />
              <div className="rounded bg-green-100 px-2 py-1 text-green-800">
                masmd
              </div>
              <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                <MoreHorizontal className="h-3 w-3" />
              </Button>
              <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                <Plus className="h-3 w-3" />
              </Button>
            </div>
            <p className="text-muted-foreground mb-4 pl-6 text-sm">
              No events in this folder
            </p>

            <div className="text-muted-foreground mb-4 flex items-center gap-2 text-sm">
              <ChevronDown className="h-4 w-4" />
              <span>No folder</span>
            </div>
          </div>

          {/* Events Grid */}
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-2">
            {events.map((event) => (
              <div
                key={event.id}
                className="bg-card flex items-center gap-4 rounded-lg border p-4 shadow-sm transition-shadow hover:shadow-md"
              >
                <div className="bg-foreground flex h-12 w-12 items-center justify-center rounded-lg">
                  {event.weekdays ? (
                    <CalendarDays className="text-accent h-6 w-6" />
                  ) : (
                    <CalendarRange className="text-accent h-6 w-6" />
                  )}
                </div>

                <div className="flex-1">
                  <h3 className="text-card-foreground font-medium">
                    {event.name}
                  </h3>
                  <p className="text-muted-foreground text-sm">{event.dates}</p>
                </div>

                <div className="flex items-center gap-2">
                  <div className="text-muted-foreground flex items-center gap-1 text-sm">
                    <Users className="h-4 w-4" />
                    <span>{event.participants}</span>
                  </div>

                  <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}
