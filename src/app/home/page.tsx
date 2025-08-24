'use client';

import { useEffect, useState } from 'react';
import { toast } from 'sonner';

import Header from '@/components/layout/Header';
import { Event } from '@/types/event';

import DashboardHeader from './_components/DashboardHeader';
import DashboardSection from './_components/DashboardSection';
import { FolderModal } from './_components/FolderModal';

interface Folder {
  id: string;
  name: string;
  color?: string; // Add color property
  _count: {
    events: number;
  };
}

export default function HomePage() {
  const [events, setEvents] = useState<Event[]>([]);
  const [folders, setFolders] = useState<Folder[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Modal states
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingFolder, setEditingFolder] = useState<Folder | null>(null);
  // const [folderLoading, setFolderLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        // Fetch events and folders in parallel
        const [eventsResponse, foldersResponse] = await Promise.all([
          fetch('/api/event'),
          fetch('/api/folder'),
        ]);

        if (!eventsResponse.ok) {
          throw new Error(`Events API error! status: ${eventsResponse.status}`);
        }

        if (!foldersResponse.ok) {
          throw new Error(
            `Folders API error! status: ${foldersResponse.status}`,
          );
        }

        const [eventsData, foldersData] = await Promise.all([
          eventsResponse.json(),
          foldersResponse.json(),
        ]);

        setEvents(eventsData);
        setFolders(foldersData);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch data');
        console.error('Error fetching data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();

    // Cleanup function to ensure body styles are reset
    return () => {
      document.body.style.pointerEvents = '';
    };
  }, []);

  // Event action handlers (unchanged)
  const handleCopyLink = async (eventId: string) => {
    try {
      const url = `${window.location.origin}/event/${eventId}`;
      await navigator.clipboard.writeText(url);
      toast.success('Text copied successfully');

      // console.log('Link copied to clipboard:', url);
    } catch (err) {
      console.error('Failed to copy link:', err);
    }
  };

  const handleMoveToFolder = async (
    shortCode: string,
    folderId: string | null,
  ) => {
    try {
      const response = await fetch(`/api/event/${shortCode}`, {
        method: 'POST', // Changed to POST to match your API
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ folderId }),
      });

      if (!response.ok) {
        // console.log(response);
        throw new Error('Failed to move event to folder');
      }

      const updatedEvent = await response.json();
      const eventId = updatedEvent.id;

      // Update events state
      setEvents((prevEvents) =>
        prevEvents.map((event) => {
          return event.id === eventId ? updatedEvent : event;
        }),
      );

      // Update folder counts
      setFolders((prevFolders) =>
        prevFolders.map((folder) => {
          // Find the old folder and new folder to update counts
          const event = events.find((e) => e.id === eventId);
          const oldFolderId = event?.folder?.id;

          if (folder.id === folderId) {
            // Increment count for new folder
            return {
              ...folder,
              _count: { events: folder._count.events + 1 },
            };
          } else if (folder.id === oldFolderId) {
            // Decrement count for old folder
            return {
              ...folder,
              _count: { events: Math.max(0, folder._count.events - 1) },
            };
          }
          return folder;
        }),
      );

      toast.success('Event moved successfully');
      // console.log('Event moved to folder successfully');
    } catch (err) {
      console.error('Failed to move event to folder:', err);
      toast.error('Failed to move event');
    }
  };

  const handleDuplicateEvent = async (eventId: string) => {
    try {
      const response = await fetch(`/api/event/${eventId}/duplicate`, {
        method: 'POST',
      });

      if (!response.ok) {
        throw new Error('Failed to duplicate event');
      }

      const duplicatedEvent = await response.json();

      setEvents((prevEvents) => [duplicatedEvent, ...prevEvents]);

      // console.log('Event duplicated successfully');
    } catch (err) {
      console.error('Failed to duplicate event:', err);
    }
  };

  const handleDeleteEvent = async (shortCode: string) => {
    try {
      const response = await fetch(`/api/event/${shortCode}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete event');
      }

      setEvents((prevEvents) =>
        prevEvents.filter((event) => event.shortCode !== shortCode),
      );

      // console.log('Event deleted successfully');
    } catch (err) {
      console.error('Failed to delete event:', err);
    }
  };

  // Updated folder handlers with color support
  const handleCreateFolder = async (name: string, color: string) => {
    try {
      const response = await fetch('/api/folder', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, color }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to create folder');
      }

      const newFolder = await response.json();
      setFolders((prevFolders) => [...prevFolders, newFolder]);

      toast.success('Folder created successfully');
      // console.log('Folder created successfully');
    } catch (err) {
      console.error('Failed to create folder:', err);
      toast.error('Failed to create folder');
      throw err; // Re-throw so modal can handle the error
    }
  };

  const handleEditFolder = async (folderId: string) => {
    const folder = folders.find((f) => f.id === folderId);
    if (!folder) return;

    setEditingFolder(folder);
    setIsEditModalOpen(true);
  };

  const handleUpdateFolder = async (name: string, color: string) => {
    if (!editingFolder) return;

    try {
      const response = await fetch(`/api/folder/${editingFolder.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, color }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to update folder');
      }

      const updatedFolder = await response.json();

      setFolders((prevFolders) =>
        prevFolders.map((folder) =>
          folder.id === editingFolder.id ? updatedFolder : folder,
        ),
      );

      // Also update any events that reference this folder
      setEvents((prevEvents) =>
        prevEvents.map((event) =>
          event.folder?.id === editingFolder.id
            ? { ...event, folder: updatedFolder }
            : event,
        ),
      );

      toast.success('Folder updated successfully');
      // console.log('Folder updated successfully');

      // Close modal after successful update
      handleCloseEditModal();
    } catch (err) {
      console.error('Failed to update folder:', err);
      toast.error('Failed to update folder');
      handleCloseEditModal();
      throw err;
    }
  };

  const handleDeleteFolder = async (folderId: string) => {
    try {
      const response = await fetch(`/api/folder/${folderId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete folder');
      }

      setFolders((prevFolders) =>
        prevFolders.filter((folder) => folder.id !== folderId),
      );

      setEvents((prevEvents) =>
        prevEvents.map((event) =>
          event.folder?.id === folderId
            ? { ...event, folder: null, folderId: null }
            : event,
        ),
      );

      toast.success('Folder deleted successfully');
    } catch (err) {
      console.error('Failed to delete folder:', err);
    }
  };

  const handleCloseEditModal = () => {
    console.log('called handleCloseEditModal');
    setIsEditModalOpen(false);
    setEditingFolder(null);
  };

  return (
    <div className="from-background to-muted/20 min-h-screen bg-gradient-to-br">
      <Header />

      <main className="container mx-auto px-4 py-8">
        <DashboardHeader onCreateFolder={handleCreateFolder} />

        <DashboardSection
          events={events}
          folders={folders}
          loading={loading}
          error={error}
          onCopyLink={handleCopyLink}
          onMoveToFolder={handleMoveToFolder}
          onDuplicateEvent={handleDuplicateEvent}
          onDeleteEvent={handleDeleteEvent}
          onEditFolder={handleEditFolder}
          onDeleteFolder={handleDeleteFolder}
        />

        {/* Edit Folder Modal */}
        <FolderModal
          isOpen={isEditModalOpen}
          onClose={handleCloseEditModal}
          onSubmit={handleUpdateFolder}
          initialName={editingFolder?.name || ''}
          initialColor={editingFolder?.color}
          mode="edit"
          loading={false}
        />
      </main>
    </div>
  );
}
