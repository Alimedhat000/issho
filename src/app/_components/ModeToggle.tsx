import { Button } from '@/components/ui/button';
import { EventFormData } from '@/types/event';

export const ModeToggle: React.FC<{
  selectedMode: EventFormData['selectedMode'];
  onModeChange: (mode: EventFormData['selectedMode']) => void;
}> = ({ selectedMode, onModeChange }) => (
  <div className="flex gap-2">
    <Button
      variant={selectedMode === 'dates-times' ? 'default' : 'outline'}
      size="sm"
      onClick={() => onModeChange('dates-times')}
      className="flex-1 transition-all duration-200 ease-in-out"
    >
      Dates and times
    </Button>
    <Button
      variant={selectedMode === 'dates-only' ? 'default' : 'outline'}
      size="sm"
      disabled
      onClick={() => onModeChange('dates-only')}
      className="flex-1 transition-all duration-200 ease-in-out"
    >
      Dates only
    </Button>
  </div>
);
