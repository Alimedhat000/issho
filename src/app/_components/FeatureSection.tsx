'use client';
import { Calendar, Clock, Users } from 'lucide-react';

import { Card } from '@/components/ui/card';

export function FeaturesSection() {
  return (
    <div className="mb-20 grid gap-6 md:grid-cols-3">
      <Card className="p-6 text-center transition-shadow hover:shadow-lg">
        <Calendar className="text-primary mx-auto mb-4 h-12 w-12" />
        <h3 className="mb-2 text-xl font-semibold">Smart Scheduling</h3>
        <p className="text-muted-foreground">
          AI-powered scheduling finds the perfect time for everyone
          automatically.
        </p>
      </Card>
      <Card className="p-6 text-center transition-shadow hover:shadow-lg">
        <Users className="text-primary mx-auto mb-4 h-12 w-12" />
        <h3 className="mb-2 text-xl font-semibold">Group Coordination</h3>
        <p className="text-muted-foreground">
          Manage multiple participants with real-time availability tracking.
        </p>
      </Card>
      <Card className="p-6 text-center transition-shadow hover:shadow-lg">
        <Clock className="text-primary mx-auto mb-4 h-12 w-12" />
        <h3 className="mb-2 text-xl font-semibold">Time Zone Magic</h3>
        <p className="text-muted-foreground">
          Seamlessly coordinate across different time zones without confusion.
        </p>
      </Card>
    </div>
  );
}
