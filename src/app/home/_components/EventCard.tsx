import React from 'react';
import {
  CalendarMinus2,
  CalendarRange,
  Copy,
  FolderOpen,
  Link,
  MoreHorizontal,
  Trash2,
  Users,
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Event } from '@/types/event';

interface EventCardProps {
  event: Event;
  folders: Array<{ id: string; name: string }>;
  onCopyLink: (eventId: string) => void;
  onMoveToFolder: (eventId: string, folderId: string) => void;
  onDuplicate: (eventId: string) => void;
  onDelete: (eventId: string) => void;
}

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

export default function EventCard({
  event,
  folders,
  onCopyLink,
  onMoveToFolder,
  onDuplicate,
  onDelete,
}: EventCardProps) {
  return (
    <div className="bg-card flex items-center gap-4 rounded-lg border p-4 shadow-sm transition-shadow hover:shadow-md">
      <div className="bg-foreground flex h-12 w-12 items-center justify-center rounded-lg">
        {isWeekdayPattern(event.EventDates) ? (
          <CalendarMinus2 className="text-accent h-6 w-6" />
        ) : (
          <CalendarRange className="text-accent h-6 w-6" />
        )}
      </div>

      <div className="flex-1">
        <h3 className="text-card-foreground font-medium">{event.title}</h3>
        <p className="text-muted-foreground text-sm capitalize">
          {formatEventDates(event.EventDates)}
        </p>
      </div>

      <div className="flex items-center gap-2">
        <div className="text-muted-foreground flex items-center gap-1 text-sm">
          <Users className="h-4 w-4" />
          <span>{event.Participant.length}</span>
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
              <MoreHorizontal className="h-4 w-4" />
              <span className="sr-only">Open menu</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            <DropdownMenuItem onClick={() => onCopyLink(event.id)}>
              <Link className="mr-2 h-4 w-4" />
              Copy link
            </DropdownMenuItem>

            <DropdownMenuSub>
              <DropdownMenuSubTrigger>
                <FolderOpen className="text-muted-foreground mr-2 h-4 w-4" />
                Move to
              </DropdownMenuSubTrigger>
              <DropdownMenuSubContent>
                {folders.map((folder) => (
                  <DropdownMenuItem
                    key={folder.id}
                    onClick={() => onMoveToFolder(event.id, folder.id)}
                  >
                    {folder.name}
                  </DropdownMenuItem>
                ))}
                {folders.length === 0 && (
                  <DropdownMenuItem disabled>
                    No folders available
                  </DropdownMenuItem>
                )}
              </DropdownMenuSubContent>
            </DropdownMenuSub>

            <DropdownMenuItem onClick={() => onDuplicate(event.id)}>
              <Copy className="mr-2 h-4 w-4" />
              Duplicate
            </DropdownMenuItem>

            <DropdownMenuSeparator />

            <DropdownMenuItem
              onClick={() => onDelete(event.id)}
              className="text-red-600 focus:text-red-600"
            >
              <Trash2 className="mr-2 h-4 w-4 text-red-600" />
              Delete event
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}
