import React from 'react';
import { Loader2 } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Event } from '@/types/event';

import FolderSection from './FolderSection';

interface DashboardSectionProps {
  events: Event[];
  loading: boolean;
  error: string | null;
  folders: Array<{ id: string; name: string }>;
  onCopyLink: (eventId: string) => void;
  onMoveToFolder: (eventId: string, folderId: string) => void;
  onDuplicateEvent: (eventId: string) => void;
  onDeleteEvent: (eventId: string) => void;
  onEditFolder: (folderId: string) => void;
  onDeleteFolder: (folderId: string) => void;
  onAddFolder: () => void;
}

export default function DashboardSection({
  events,
  loading,
  error,
  folders,
  onCopyLink,
  onMoveToFolder,
  onDuplicateEvent,
  onDeleteEvent,
  onEditFolder,
  onDeleteFolder,
  onAddFolder,
}: DashboardSectionProps) {
  // Group events by folder (for now, all events go to "No folder")
  const eventsByFolder = {
    staticFolder: [],
    noFolder: events,
  };

  // Static folders for demo
  const staticFolders = [
    { id: 'static', name: 'Static Folders for now', isDefault: true },
    { id: 'no-folder', name: 'No folder', isDefault: false },
  ];

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

  if (events.length === 0) {
    return (
      <div className="text-muted-foreground py-8 text-center">
        <p className="mb-2">No events found</p>
        <p className="text-sm">Create your first event to get started</p>
      </div>
    );
  }

  return (
    <section>
      {/* Static folder with no events */}
      <FolderSection
        folder={staticFolders[0]}
        events={eventsByFolder.staticFolder}
        allFolders={folders}
        onAddFolder={onAddFolder}
        onCopyLink={onCopyLink}
        onMoveToFolder={onMoveToFolder}
        onDuplicateEvent={onDuplicateEvent}
        onDeleteEvent={onDeleteEvent}
      />

      {/* No folder section with all events */}
      <FolderSection
        folder={staticFolders[1]}
        events={eventsByFolder.noFolder}
        allFolders={folders}
        onEditFolder={onEditFolder}
        onDeleteFolder={onDeleteFolder}
        onAddFolder={onAddFolder}
        onCopyLink={onCopyLink}
        onMoveToFolder={onMoveToFolder}
        onDuplicateEvent={onDuplicateEvent}
        onDeleteEvent={onDeleteEvent}
      />
    </section>
  );
}
