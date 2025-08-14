'use client';
import { Quote } from 'lucide-react';

import { Card } from '@/components/ui/card';

export function QuoteSection() {
  return (
    <Card className="bg-muted/50 border-l-primary border-l-4 p-8">
      <Quote className="text-primary mx-auto mb-4 h-8 w-8" />
      <blockquote className="text-foreground mb-4 text-2xl font-medium italic">
        &quot;Issho transformed how our remote team coordinates. What used to
        take hours of planning now happens in minutes.&quot;
      </blockquote>
      <cite className="text-muted-foreground font-medium">
        — Sarah Chen, Some Random Girl never met
      </cite>
    </Card>
  );
}
