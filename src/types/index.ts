export interface User {
  id: string;
  email: string;
  name?: string;
  avatar?: string;
  googleId?: string;
}

export interface TimeSlot {
  id: string;
  day: string;
  hour: number;
  isSelected: boolean;
  participantId: string;
}

export interface Participant {
  id: string;
  name: string;
  color: string;
  availability: TimeSlot[];
  user?: User; // Present if participant is logged in
  isGuest: boolean; // Helper to identify guest vs authenticated users
}

export interface MeetingEvent {
  id: string;
  title: string;
  description?: string;
  dateRange: {
    start: Date;
    end: Date;
  };
  participants: Participant[];
  creator?: User; // Present if event was created by authenticated user
  createdAt: Date;
}

// Maps each day to hours, each hour to a list of participant IDs available at that time
export interface AvailabilityGrid {
  [day: string]: {
    [hour: number]: string[]; // participant IDs
  };
}
