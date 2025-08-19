import { cn } from '@/lib/utils';

export function TimeColumn({ timeSlots }: { timeSlots: string[] }) {
  return (
    <div className="w-10 flex-none sm:w-15">
      <div className="h-13"></div>
      {timeSlots.map((time, timeIndex) => (
        <div
          key={timeIndex}
          className={cn(
            'text-muted-foreground h-5 text-xs',
            timeIndex % 4 === 0 ? 'w-full' : '',
          )}
        >
          {timeIndex % 4 === 0 ? time : ''}
        </div>
      ))}
    </div>
  );
}
