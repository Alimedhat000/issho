import React from 'react';
import { Loader2 } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Event } from '@/types/event';

import FolderSection from './FolderSection';

interface Folder {
  id: string;
  name: string;
  color?: string;
  _count: {
    events: number;
  };
}

interface DashboardSectionProps {
  events: Event[];
  folders: Folder[];
  loading: boolean;
  error: string | null;
  onCopyLink: (eventId: string) => void;
  onMoveToFolder: (eventId: string, folderId: string | null) => void;
  onDuplicateEvent: (eventId: string) => void;
  onDeleteEvent: (eventId: string) => void;
  onEditFolder: (folderId: string) => void;
  onDeleteFolder: (folderId: string) => void;
}

export default function DashboardSection({
  events,
  folders,
  loading,
  error,
  onCopyLink,
  onMoveToFolder,
  onDuplicateEvent,
  onDeleteEvent,
  onEditFolder,
  onDeleteFolder,
}: DashboardSectionProps) {
  // Group events by folder
  const eventsByFolder = React.useMemo(() => {
    const grouped: Record<string, Event[]> = {
      'no-folder': events.filter((event) => !event.folderId),
    };

    folders.forEach((folder) => {
      grouped[folder.id] = events.filter(
        (event) => event.folderId === folder.id,
      );
    });

    return grouped;
  }, [events, folders]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <Loader2 className="h-6 w-6 animate-spin" />
        <span className="ml-2">Loading events...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-destructive mb-4 rounded-lg border border-red-200 bg-red-50 p-4">
        <p>Error loading events: {error}</p>
        <Button
          variant="outline"
          size="sm"
          className="mt-2"
          onClick={() => window.location.reload()}
        >
          Retry
        </Button>
      </div>
    );
  }

  // Available folders for moving events (excluding current folder)
  const availableFolders = folders.map((folder) => ({
    id: folder.id,
    name: folder.name,
    color: folder.color,
  }));

  if (events.length === 0 && folders.length === 0) {
    return (
      <div className="text-muted-foreground py-8 text-center">
        <p className="mb-2">No events or folders found</p>
        <p className="text-sm">
          Create your first event or folder to get started
        </p>
      </div>
    );
  }

  return (
    <section>
      {/* Display each folder with its events */}
      {folders.map((folder) => (
        <FolderSection
          key={folder.id}
          folder={{
            id: folder.id,
            name: folder.name,
            isDefault: false,
            color: folder.color,
          }}
          events={eventsByFolder[folder.id] || []}
          allFolders={availableFolders.filter((f) => f.id !== folder.id)}
          onEditFolder={onEditFolder}
          onDeleteFolder={onDeleteFolder}
          onCopyLink={onCopyLink}
          onMoveToFolder={onMoveToFolder}
          onDuplicateEvent={onDuplicateEvent}
          onDeleteEvent={onDeleteEvent}
        />
      ))}

      {/* No folder section */}
      <FolderSection
        folder={{
          id: 'no-folder',
          name: 'No folder',
          isDefault: false,
        }}
        events={eventsByFolder['no-folder'] || []}
        allFolders={availableFolders}
        onEditFolder={onEditFolder}
        onDeleteFolder={onDeleteFolder}
        onCopyLink={onCopyLink}
        onMoveToFolder={onMoveToFolder}
        onDuplicateEvent={onDuplicateEvent}
        onDeleteEvent={onDeleteEvent}
      />
    </section>
  );
}
