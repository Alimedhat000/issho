"use client";
import { Card } from "@/components/ui/card";
import { Quote } from "lucide-react";

export function QuoteSection() {
  return (
    <Card className="p-8 bg-muted/50 border-l-4 border-l-primary">
      <Quote className="w-8 h-8 text-primary mx-auto mb-4" />
      <blockquote className="text-2xl font-medium text-foreground mb-4 italic">
        &quot;Issho transformed how our remote team coordinates. What used to
        take hours of planning now happens in minutes.&quot;
      </blockquote>
      <cite className="text-muted-foreground font-medium">
        — Sarah Chen, Some Random Girl never met
      </cite>
    </Card>
  );
}
