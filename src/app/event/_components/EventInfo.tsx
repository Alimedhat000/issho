import React from 'react';
import { Copy, Edit3 } from 'lucide-react';

import { Button } from '@/components/ui/button';

export default function EventInfo({
  onAvailabilityClick,
}: {
  onAvailabilityClick: () => void;
}) {
  return (
    <div className="mb-8">
      <div className="mb-6 flex flex-col justify-between gap-4 md:flex-row md:items-center">
        <div>
          <h1 className="mb-2 text-4xl font-bold">Event Name</h1>
          <div className="text-muted-foreground flex items-center gap-4">
            <span>Mon, Tue, Wed</span>
            <Button
              variant="ghost"
              size="sm"
              className="text-primary hover:text-primary/80 h-auto p-0"
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
          >
            <Copy className="h-4 w-4" />
            Copy link
          </Button>
          <Button
            className="bg-primary hover:bg-primary/90"
            onClick={onAvailabilityClick}
          >
            Add availability
          </Button>
        </div>
      </div>
    </div>
  );
}
