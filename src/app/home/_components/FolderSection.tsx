import React, { useState } from 'react';
import {
  ChevronDown,
  ChevronRight,
  Download,
  Edit,
  MoreHorizontal,
  Trash2,
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Event } from '@/types/event';

import EventCard from './EventCard';

interface FolderSectionProps {
  folder: {
    id: string;
    name: string;
    isDefault?: boolean;
    color?: string;
  };
  events: Event[];
  allFolders: Array<{ id: string; name: string }>;
  onEditFolder?: (folderId: string) => void;
  onDeleteFolder?: (folderId: string) => void;
  onCopyLink: (eventId: string) => void;
  onMoveToFolder: (eventId: string, folderId: string | null) => void;
  onDuplicateEvent: (eventId: string) => void;
  onDeleteEvent: (eventId: string) => void;
}

export default function FolderSection({
  folder,
  events,
  allFolders,
  onEditFolder,
  onDeleteFolder,
  onCopyLink,
  onMoveToFolder,
  onDuplicateEvent,
  onDeleteEvent,
}: FolderSectionProps) {
  const [isExpanded, setIsExpanded] = useState(true);
  const [isDragOver, setIsDragOver] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const handleToggle = () => {
    setIsExpanded(!isExpanded);
  };

  const handleEditFolder = () => {
    setDropdownOpen(false); // Close dropdown before opening modal
    if (onEditFolder) {
      onEditFolder(folder.id);
    }
  };

  const handleDeleteFolder = () => {
    setDropdownOpen(false); // Close dropdown before opening modal/action
    if (onDeleteFolder) {
      onDeleteFolder(folder.id);
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';

    // Check if the dragged item can be dropped here
    try {
      const dragData = JSON.parse(e.dataTransfer.getData('application/json'));
      const currentFolderId = dragData.currentFolderId;
      const targetFolderId = folder.id === 'no-folder' ? null : folder.id;

      // Only show drop indicator if moving to a different folder
      if (currentFolderId !== targetFolderId) {
        setIsDragOver(true);
      }
    } catch {
      // Fallback if JSON data isn't available
      setIsDragOver(true);
    }
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    // Only remove highlight if leaving the folder section entirely
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX;
    const y = e.clientY;

    if (x < rect.left || x > rect.right || y < rect.top || y > rect.bottom) {
      setIsDragOver(false);
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragOver(false);

    try {
      const dragData = JSON.parse(e.dataTransfer.getData('application/json'));
      const eventId = dragData.eventId;
      const currentFolderId = dragData.currentFolderId;
      const targetFolderId = folder.id === 'no-folder' ? null : folder.id;

      // Only move if dropping to a different folder
      if (currentFolderId !== targetFolderId) {
        onMoveToFolder(eventId, targetFolderId);
      }
    } catch (error) {
      console.log(error);
      // Fallback to plain text data transfer
      const eventId = e.dataTransfer.getData('text/plain');
      if (eventId) {
        const targetFolderId = folder.id === 'no-folder' ? null : folder.id;
        onMoveToFolder(eventId, targetFolderId);
      }
    }
  };

  return (
    <div
      className={`mb-6 transition-all duration-200 ${
        isDragOver
          ? 'rounded-lg border-2 border-dashed border-zinc-500 bg-zinc-100/70 p-2 dark:border-zinc-400 dark:bg-zinc-800/30'
          : ''
      }`}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      <div className="text-muted-foreground mb-4 flex items-center gap-2 text-sm">
        <Button
          variant="ghost"
          size="sm"
          className="h-4 w-4 p-0"
          onClick={handleToggle}
        >
          {isExpanded ? (
            <ChevronDown className="h-4 w-4" />
          ) : (
            <ChevronRight className="h-4 w-4" />
          )}
        </Button>

        {folder.id === 'no-folder' ? (
          <span className={`${isDragOver ? 'font-semibold' : ''}`}>
            {folder.name}
          </span>
        ) : (
          <div
            className={`text-foreground rounded px-2 py-1 text-xs transition-all ${
              isDragOver ? 'font-semibold' : ''
            }`}
            style={{ background: folder.color }}
          >
            {folder.name}
          </div>
        )}

        {!folder.isDefault && onEditFolder && onDeleteFolder && (
          <DropdownMenu open={dropdownOpen} onOpenChange={setDropdownOpen}>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                <MoreHorizontal className="h-3 w-3" />
                <span className="sr-only">Folder options</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-36">
              <DropdownMenuItem onClick={handleEditFolder}>
                <Edit className="mr-2 h-4 w-4" />
                Edit
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={handleDeleteFolder}
                className="text-red-600 focus:text-red-600"
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </div>

      {isExpanded && (
        <>
          {events.length === 0 ? (
            <div
              className={`text-muted-foreground mb-4 pl-6 text-sm transition-all ${
                isDragOver
                  ? 'text-muted-foreground flex items-center justify-center gap-2 py-10 font-medium'
                  : ''
              }`}
            >
              {isDragOver ? (
                <>
                  <Download /> Drop event here
                </>
              ) : (
                'No events in this folder'
              )}
            </div>
          ) : (
            <div className="grid gap-4 pl-6 sm:grid-cols-2 lg:grid-cols-2">
              {events.map((event) => (
                <EventCard
                  key={event.id}
                  event={event}
                  folders={allFolders.filter((f) => f.id !== folder.id)}
                  onCopyLink={onCopyLink}
                  onMoveToFolder={onMoveToFolder}
                  onDuplicate={onDuplicateEvent}
                  onDelete={onDeleteEvent}
                />
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}
