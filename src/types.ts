
export interface Booking {
  name: string;
  contact: string;
  status: 'pending' | 'confirmed' | 'cancelled';
  bookedAt: string;
  attendance?: 'present' | 'late' | 'no-show';
}

export interface Slot {
  id: string;
  date: string;
  start: string;
  end: string;
  capacity: number;
  status: 'open' | 'cancelled';
  bookings: Booking[];
  notes?: string;
  repeat?: {
    freq: 'daily' | 'weekly' | 'biweekly';
    until: string;
  };
}

export interface SlotPublic {
  id: string;
  date: string;
  start: string;
  end: string;
  capacity: number;
  bookedCount: number;
}

export interface OrganizerData {
  version: 1;
  organizerName: string;
  timezone: string;
  slots: Slot[];
  defaultSlotDuration: number;
  workingHoursStart: string;
  workingHoursEnd: string;
  workingDays: number[];
}

export interface SharePayload {
  v: 1;
  organizer: string;
  slots: SlotPublic[];
  at: string;
}

export interface BookPayload {
  v: 1;
  slotId: string;
  name: string;
  contact: string;
  at: string;
}
