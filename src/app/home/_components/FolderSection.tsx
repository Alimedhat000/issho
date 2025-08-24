import React, { useState } from 'react';
import {
  ChevronDown,
  ChevronRight,
  Edit,
  MoreHorizontal,
  Plus,
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
  };
  events: Event[];
  allFolders: Array<{ id: string; name: string }>;
  onEditFolder?: (folderId: string) => void;
  onDeleteFolder?: (folderId: string) => void;
  onAddFolder: () => void;
  onCopyLink: (eventId: string) => void;
  onMoveToFolder: (eventId: string, folderId: string) => void;
  onDuplicateEvent: (eventId: string) => void;
  onDeleteEvent: (eventId: string) => void;
}

export default function FolderSection({
  folder,
  events,
  allFolders,
  onEditFolder,
  onDeleteFolder,
  onAddFolder,
  onCopyLink,
  onMoveToFolder,
  onDuplicateEvent,
  onDeleteEvent,
}: FolderSectionProps) {
  const [isExpanded, setIsExpanded] = useState(true);

  const handleToggle = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <div className="mb-6">
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

        <span className={folder.isDefault ? 'text-gray-600' : ''}>
          {folder.name}
        </span>

        {folder.isDefault && (
          <div className="rounded bg-green-100 px-2 py-1 text-xs text-green-800">
            Static for now
          </div>
        )}

        {!folder.isDefault && onEditFolder && onDeleteFolder && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                <MoreHorizontal className="h-3 w-3" />
                <span className="sr-only">Folder options</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-36">
              <DropdownMenuItem onClick={() => onEditFolder(folder.id)}>
                <Edit className="mr-2 h-4 w-4" />
                Edit
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => onDeleteFolder(folder.id)}
                className="text-red-600 focus:text-red-600"
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )}

        <Button
          variant="ghost"
          size="sm"
          className="h-6 w-6 p-0"
          onClick={onAddFolder}
        >
          <Plus className="h-3 w-3" />
          <span className="sr-only">Add folder</span>
        </Button>
      </div>

      {isExpanded && (
        <>
          {events.length === 0 ? (
            <p className="text-muted-foreground mb-4 pl-6 text-sm">
              No events in this folder
            </p>
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
