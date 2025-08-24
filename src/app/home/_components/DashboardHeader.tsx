'use client';

import React, { useState } from 'react';
import { FolderPlus } from 'lucide-react';

import { CreateEventModal } from '@/app/_components/CreateEventModal';
import { Button } from '@/components/ui/button';

import { FolderModal } from './FolderModal';

interface DashboardHeaderProps {
  onCreateFolder: (name: string, color: string) => Promise<void>;
}

export default function DashboardHeader({
  onCreateFolder,
}: DashboardHeaderProps) {
  const [isFolderModalOpen, setIsFolderModalOpen] = useState(false);
  const [folderLoading, setFolderLoading] = useState(false);

  const handleCreateFolder = async (name: string, color: string) => {
    setFolderLoading(true);
    try {
      await onCreateFolder(name, color);
    } finally {
      setFolderLoading(false);
    }
  };

  return (
    <>
      <div className="mb-3 flex items-center justify-between">
        <span className="text-xl font-medium sm:text-2xl">Dashboard</span>

        <div className="flex items-center gap-3">
          <CreateEventModal>
            <Button>Create event</Button>
          </CreateEventModal>

          <Button
            variant="ghost"
            onClick={() => setIsFolderModalOpen(true)}
            className="flex items-center gap-2"
          >
            <FolderPlus className="h-4 w-4" />
            <span className="hidden sm:inline">New Folder</span>
          </Button>
        </div>
      </div>

      <FolderModal
        isOpen={isFolderModalOpen}
        onClose={() => setIsFolderModalOpen(false)}
        onSubmit={handleCreateFolder}
        mode="create"
        loading={folderLoading}
      />
    </>
  );
}
