import { AnimatedSection } from '@/components/ui/animatedSection';
import { Button } from '@/components/ui/button';
import React from 'react';

export default function CreateEventButton({
  canCreateEvent,
  handleCreateEvent,
}: {
  canCreateEvent: boolean;
  handleCreateEvent: () => void;
}) {
  return (
    <div className="space-y-2">
      <Button
        className={`w-full transition-all duration-300 ease-in-out ${
          canCreateEvent ? 'hover:scale-[1.02] active:scale-[0.98]' : ''
        }`}
        disabled={!canCreateEvent}
        onClick={handleCreateEvent}
      >
        Create event
      </Button>
      <AnimatedSection show={!canCreateEvent}>
        <p className="text-destructive text-center text-xs">
          Please fix form errors before continuing
        </p>
      </AnimatedSection>
    </div>
  );
}
