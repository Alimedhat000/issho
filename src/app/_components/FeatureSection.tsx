"use client";
import { Card } from "@/components/ui/card";
import { Calendar, Users, Clock } from "lucide-react";

export function FeaturesSection() {
  return (
    <div className="grid md:grid-cols-3 gap-6 mb-20">
      <Card className="p-6 text-center hover:shadow-lg transition-shadow">
        <Calendar className="w-12 h-12 text-primary mx-auto mb-4" />
        <h3 className="text-xl font-semibold mb-2">Smart Scheduling</h3>
        <p className="text-muted-foreground">
          AI-powered scheduling finds the perfect time for everyone
          automatically.
        </p>
      </Card>
      <Card className="p-6 text-center hover:shadow-lg transition-shadow">
        <Users className="w-12 h-12 text-primary mx-auto mb-4" />
        <h3 className="text-xl font-semibold mb-2">Group Coordination</h3>
        <p className="text-muted-foreground">
          Manage multiple participants with real-time availability tracking.
        </p>
      </Card>
      <Card className="p-6 text-center hover:shadow-lg transition-shadow">
        <Clock className="w-12 h-12 text-primary mx-auto mb-4" />
        <h3 className="text-xl font-semibold mb-2">Time Zone Magic</h3>
        <p className="text-muted-foreground">
          Seamlessly coordinate across different time zones without confusion.
        </p>
      </Card>
    </div>
  );
}
