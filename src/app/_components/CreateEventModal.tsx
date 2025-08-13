'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';

import { CreateEventModalProps } from '@/types/event';
import { ModeToggle } from './ModeToggle';

import CreateEventButton from './CreateEventButton';
import { useEventForm } from '@/hooks/useEventForm';
import { EventFormSections } from './EventFormSections';

// Main Modal Component
export function CreateEventModal({ children }: CreateEventModalProps) {
  const [isOpen, setIsOpen] = useState(false);
  const { formData, updateFormData, canCreateEvent } = useEventForm();

  const handleCreateEvent = () => {
    if (canCreateEvent) {
      // Handle event creation logic here
      console.log(formData);
      setIsOpen(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="max-h-[90vh] max-w-md overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            New event
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsOpen(false)}
              className="h-6 w-6 p-0 transition-all duration-200 ease-in-out hover:scale-110"
            />
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Event Name */}
          <div>
            <Input
              placeholder="Name your event..."
              value={formData.eventName}
              onChange={(e) => updateFormData({ eventName: e.target.value })}
              className="text-base transition-transform duration-200 ease-in-out focus:scale-[1.02]"
            />
          </div>

          {/* Mode Toggle */}
          <ModeToggle
            selectedMode={formData.selectedMode}
            onModeChange={(mode) => updateFormData({ selectedMode: mode })}
          />

          <EventFormSections
            formData={formData}
            updateFormData={updateFormData}
          />

          {/* Create Button */}
          <CreateEventButton
            canCreateEvent={canCreateEvent}
            handleCreateEvent={handleCreateEvent}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
}
