import { ChevronRight } from 'lucide-react';
import Link from 'next/link';

import { AnimatedSection } from '@/components/ui/animatedSection';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { paths } from '@/config/paths';

// Advanced Options Component
export const AdvancedOptions: React.FC<{
  showAdvanced: boolean;
  timeIncrement: string;
  timezone: string;
  onToggleAdvanced: () => void;
  onTimeIncrementChange: (increment: string) => void;
  onTimezoneChange: (timezone: string) => void;
}> = ({
  showAdvanced,
  timeIncrement,
  timezone,
  onToggleAdvanced,
  onTimeIncrementChange,
  onTimezoneChange,
}) => (
  <div className="space-y-4">
    <Button
      variant="ghost"
      onClick={onToggleAdvanced}
      className="h-auto w-full justify-between p-0 font-medium transition-all duration-200 ease-in-out"
    >
      Advanced options
      <ChevronRight
        className={`h-4 w-4 transition-transform duration-300 ease-in-out ${
          showAdvanced ? 'rotate-90' : ''
        }`}
      />
    </Button>

    <AnimatedSection show={showAdvanced}>
      <div className="border-muted space-y-4 border-l-2 pl-4">
        <div>
          <Label className="text-sm">Time increment:</Label>
          <Select value={timeIncrement} onValueChange={onTimeIncrementChange}>
            <SelectTrigger className="mt-1">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="15 min">15 min</SelectItem>
              <SelectItem value="30 min">30 min</SelectItem>
              <SelectItem value="60 min">60 min</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-start space-x-2">
          <Checkbox id="collect-emails" disabled />
          <div className="space-y-1">
            <Label
              htmlFor="collect-emails"
              className="text-muted-foreground text-sm"
            >
              Collect respondents&apos; email addresses
            </Label>
            <div className="text-muted-foreground text-xs">
              <Link
                href={paths.auth.login.getHref()}
                className="text-accent-foreground underline"
              >
                Sign in
              </Link>{' '}
              to use this feature
            </div>
          </div>
        </div>

        <div className="flex items-start space-x-2">
          <Checkbox id="hide-responses" disabled />
          <div className="space-y-1">
            <Label
              htmlFor="hide-responses"
              className="text-muted-foreground text-sm"
            >
              Hide responses from respondents
            </Label>
            <div className="text-muted-foreground text-xs">
              Only show responses to event creator.{' '}
              <span className="text-muted-foreground text-xs">
                <Link
                  href={paths.auth.login.getHref()}
                  className="text-accent-foreground underline"
                >
                  Sign in
                </Link>{' '}
                to use this feature
              </span>
            </div>
          </div>
        </div>

        <div>
          <Label className="text-sm">Timezone</Label>
          <Select value={timezone} onValueChange={onTimezoneChange}>
            <SelectTrigger className="mt-1">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Africa/Cairo">Cairo (GMT+3)</SelectItem>
              <SelectItem value="Europe/London">London (GMT+0)</SelectItem>
              <SelectItem value="America/New_York">New York (GMT-5)</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </AnimatedSection>
  </div>
);
