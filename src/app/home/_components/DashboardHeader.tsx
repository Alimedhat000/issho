import React from 'react';
import { FolderPlus } from 'lucide-react';

import { Button } from '@/components/ui/button';

interface DashboardHeaderProps {
  onNewEvent: () => void;
  onNewFolder: () => void;
}

export default function DashboardHeader({
  onNewEvent,
  onNewFolder,
}: DashboardHeaderProps) {
  return (
    <div className="mb-3 flex items-center justify-between">
      <span className="text-xl font-medium sm:text-2xl">Dashboard</span>

      <div className="flex items-center gap-3">
        <Button onClick={onNewEvent}>Create Event</Button>

        <Button variant={'ghost'} onClick={onNewFolder}>
          <FolderPlus />
        </Button>
      </div>
    </div>
  );
}
