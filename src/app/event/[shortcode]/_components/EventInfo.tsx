import React from 'react';
import { Copy, Edit3 } from 'lucide-react';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import { Event } from '@/types/event';

const handleCopy = async () => {
  try {
    await navigator.clipboard.writeText(window.location.href); // copies current URL
    console.log('Link copied!');
    toast.success('Link Copied!');
  } catch (err) {
    console.error('Failed to copy: ', err);
  }
};

const formatDate = (d: Date) => `${d.getMonth() + 1}/${d.getDate()}`;

export default function EventInfo({
  event,
  setisEditActive,
  isEditActive,
  onEventUpdate,
}: {
  event: Event;
  isEditActive: boolean;
  setisEditActive: (val: boolean) => void;
  onEventUpdate?: () => void;
}) {
  const startingDate = new Date(event.EventDates[0].date!);
  const endingDate = new Date(
    event.EventDates[event.EventDates.length - 1].date!,
  );

  const handleSave = async () => {
    // TODO: Implement save functionality with API call
    setisEditActive(false);
    if (onEventUpdate) {
      onEventUpdate();
    }
    toast.success('Availability saved successfully!');
  };

  const handleCancel = () => {
    setisEditActive(false);
    // TODO: Reset any unsaved changes
  };

  return (
    <div className="mb-8">
      <div className="mb-6 flex flex-col justify-between gap-4 md:flex-row md:items-center">
        <div>
          <h1 className="mb-2 text-4xl font-bold">{event.title}</h1>
          <div className="text-muted-foreground flex items-center gap-4">
            <span>
              {formatDate(startingDate)} - {formatDate(endingDate)}
            </span>
            {/* TODO */}
            <Button
              variant="ghost"
              size="sm"
              className="text-primary hover:text-primary/80 h-auto p-0"
              disabled
            >
              <Edit3 className="mr-1 h-4 w-4" />
              Edit event
            </Button>
          </div>
        </div>

        <div className="flex gap-3">
          <Button
            variant="outline"
            className="flex items-center gap-2 bg-transparent"
            onClick={handleCopy}
          >
            <Copy className="h-4 w-4" />
            Copy link
          </Button>
          {isEditActive ? (
            <>
              <Button
                className="bg-green-500 hover:bg-green-500/90"
                onClick={handleSave}
              >
                Save
              </Button>
              <Button
                variant={'destructive'}
                className="bg-primary hover:bg-primary/90"
                onClick={() => {
                  setisEditActive(false);
                }}
              >
                Cancel
              </Button>
            </>
          ) : (
            <Button
              className="bg-primary hover:bg-primary/90"
              onClick={handleCancel}
            >
              Add availability
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
