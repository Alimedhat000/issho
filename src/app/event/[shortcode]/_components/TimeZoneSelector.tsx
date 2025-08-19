import { ChevronDown } from 'lucide-react';

import { Button } from '@/components/ui/button';

export function TimezoneSelector({
  timezoneDisplay,
}: {
  timezoneDisplay: string;
}) {
  return (
    <div className="text-muted-foreground mt-4 flex items-center gap-4 px-4 text-sm">
      <span>Shown in</span>
      <Button
        variant="ghost"
        size="sm"
        className="text-muted-foreground hover:text-foreground h-auto p-1"
      >
        {timezoneDisplay}
        <ChevronDown className="ml-1 h-4 w-4" />
      </Button>
      <Button
        variant="ghost"
        size="sm"
        className="text-muted-foreground hover:text-foreground h-auto p-1"
      >
        12h
        <ChevronDown className="ml-1 h-4 w-4" />
      </Button>
    </div>
  );
}
