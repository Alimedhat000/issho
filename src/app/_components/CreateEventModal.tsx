'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { useAuth } from '@/hooks/useAuth';
import { useCreateEvent } from '@/hooks/useEvent';
import { useEventForm } from '@/hooks/useEventForm';
import { CreateEventModalProps } from '@/types/event';

import CreateEventButton from './CreateEventButton';
import { EventFormSections } from './EventFormSections';
import { ModeToggle } from './ModeToggle';

// Main Modal Component
export function CreateEventModal({ children }: CreateEventModalProps) {
  const router = useRouter();

  const [isOpen, setIsOpen] = useState(false);
  const { formData, updateFormData, canCreateEvent, resetForm } =
    useEventForm();
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      updateFormData({ creatorId: user.id });
    }
  }, [user, updateFormData]);

  const { createEvent, loading, error } = useCreateEvent();

  const handleCreateEvent = async () => {
    if (!canCreateEvent || loading) return;

    try {
      const newEvent = await createEvent(formData);

      if (newEvent) {
        toast.success('Event created successfully!');
        setIsOpen(false);
        resetForm();

        // Navigate to the new event page
        router.push(`/event/${newEvent.shortCode}`);
      } else if (error) {
        toast.error(error);
      }
    } catch {
      toast.error('Failed to create event. Please try again.');
    }
  };

  const handleClose = () => {
    setIsOpen(false);
    if (!loading) {
      resetForm();
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
              onClick={handleClose}
              className="h-6 w-6 p-0 transition-all duration-200 ease-in-out hover:scale-110"
            />
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Event Name */}
          <div>
            <Input
              placeholder="Name your event..."
              value={formData.title}
              onChange={(e) => updateFormData({ title: e.target.value })}
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

          {error && (
            <div className="rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-600">
              {error}
            </div>
          )}

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
