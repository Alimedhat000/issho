'use client';

import { useEffect, useState } from 'react';
import { toast } from 'sonner';

import Header from '@/components/layout/Header';
import { Event } from '@/types/event';

import DashboardHeader from './_components/DashboardHeader';
import DashboardSection from './_components/DashboardSection';

export default function HomePage() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Mock folders for now - you can replace this with actual folder data
  const [folders] = useState([
    { id: 'folder-1', name: 'Work Events' },
    { id: 'folder-2', name: 'Personal' },
    { id: 'folder-3', name: 'Meetings' },
  ]);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/event');

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        setEvents(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch events');
        console.error('Error fetching events:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  // Event action handlers
  const handleCopyLink = async (eventId: string) => {
    try {
      const url = `${window.location.origin}/event/${eventId}`;
      await navigator.clipboard.writeText(url);
      console.log('Link copied to clipboard:', url);
      toast.success('Link Copied!');
    } catch (err) {
      console.error('Failed to copy link:', err);
    }
  };

  const handleMoveToFolder = (eventId: string, folderId: string) => {
    console.log('Moving event', eventId, 'to folder', folderId);
    // Implement move to folder logic
  };

  const handleDuplicateEvent = (eventId: string) => {
    console.log('Duplicating event:', eventId);
    // Implement duplicate logic
  };

  const handleDeleteEvent = (eventId: string) => {
    console.log('Deleting event:', eventId);
    // Implement delete logic
    setEvents((prevEvents) =>
      prevEvents.filter((event) => event.id !== eventId),
    );
  };

  // Folder action handlers
  const handleEditFolder = (folderId: string) => {
    console.log('Editing folder:', folderId);
    // Implement edit folder logic
  };

  const handleDeleteFolder = (folderId: string) => {
    console.log('Deleting folder:', folderId);
    // Implement delete folder logic
  };

  const handleAddFolder = () => {
    console.log('Adding new folder');
    // Implement add folder logic
  };

  // Header action handlers
  const handleNewEvent = () => {
    console.log('Creating new event');
    // Navigate to new event page or open modal
  };

  const handleNewFolder = () => {
    console.log('Creating new folder');
    // Open new folder modal or form
  };

  return (
    <div className="from-background to-muted/20 min-h-screen bg-gradient-to-br">
      <Header />

      <main className="container mx-auto px-4 py-8">
        <DashboardHeader
          onNewEvent={handleNewEvent}
          onNewFolder={handleNewFolder}
        />

        <DashboardSection
          events={events}
          loading={loading}
          error={error}
          folders={folders}
          onCopyLink={handleCopyLink}
          onMoveToFolder={handleMoveToFolder}
          onDuplicateEvent={handleDuplicateEvent}
          onDeleteEvent={handleDeleteEvent}
          onEditFolder={handleEditFolder}
          onDeleteFolder={handleDeleteFolder}
          onAddFolder={handleAddFolder}
        />
      </main>
    </div>
  );
}
