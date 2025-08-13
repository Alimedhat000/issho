import { AnimatedSection } from '@/components/ui/animatedSection';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { EventFormData } from '@/types/event';
import { Label } from '@radix-ui/react-label';

export const DateModeSelector: React.FC<{
  dateMode: EventFormData['dateMode'];
  onDateModeChange: (mode: EventFormData['dateMode']) => void;
}> = ({ dateMode, onDateModeChange }) => (
  <AnimatedSection show={true}>
    <Label className="text-base font-medium">What dates might work?</Label>
    <Select value={dateMode} onValueChange={onDateModeChange}>
      <SelectTrigger className="mt-2 w-full">
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="specific">Specific dates</SelectItem>
        <SelectItem value="week">Days of the week</SelectItem>
      </SelectContent>
    </Select>
  </AnimatedSection>
);
