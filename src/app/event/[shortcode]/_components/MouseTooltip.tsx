import React from 'react';

import { cn } from '@/lib/utils';

interface MouseTooltipProps {
  isVisible: boolean;
  position: { x: number; y: number };
  content: string;
  className?: string;
  style?: React.CSSProperties;
}

export const MouseTooltip: React.FC<MouseTooltipProps> = ({
  isVisible,
  position,
  content,
  className = '',
  style = {},
}) => {
  if (!isVisible) return null;

  return (
    <div
      className={cn(
        'bg-background text-foreground pointer-events-none fixed z-50 rounded px-2 py-1 text-sm whitespace-nowrap shadow-lg',
        className,
      )}
      style={{
        left: `${position.x}px`,
        top: `${position.y}px`,
        ...style,
      }}
    >
      {content}
    </div>
  );
};
