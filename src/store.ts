
import type { Slot, OrganizerData, Booking } from './types';

const KEY = 'timebox_data';

const defaults: OrganizerData = {
  version: 1,
  organizerName: '',
  timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
  slots: [],
  defaultSlotDuration: 60,
  workingHoursStart: '08:00',
  workingHoursEnd: '20:00',
  workingDays: [1, 2, 3, 4, 5],
};

export function load(): OrganizerData {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return { ...defaults };
    return { ...defaults, ...JSON.parse(raw) };
  } catch {
    return { ...defaults };
  }
}

export function save(d: OrganizerData): void {
  localStorage.setItem(KEY, JSON.stringify(d));
}

// Expand recurring slots into concrete instances for a date range
export function expandSlots(slots: Slot[], from: string, to: string): Slot[] {
  const result: Slot[] = [];
  for (const s of slots) {
    if (s.status === 'cancelled') continue;

    if (!s.repeat) {
      // Single slot – include if in range
      if (s.date >= from && s.date <= to) result.push(s);
    } else {
      // Expand recurring
      const start = new Date(s.date);
      const until = new Date(s.repeat.until);
      const rangeEnd = new Date(to);
      const end = until < rangeEnd ? until : rangeEnd;

      const cursor = new Date(start);
      const freqDays = s.repeat.freq === 'daily' ? 1 : s.repeat.freq === 'weekly' ? 7 : 14;

      while (cursor <= end) {
        const d = cursor.toISOString().slice(0, 10);
        if (d >= from && d >= s.date) {
          const expandedId = s.id + '_' + d;
          const override = slots.find(sl => sl.id === expandedId);
          if (override) {
            result.push(override);
          } else {
            result.push({ ...s, id: expandedId, date: d, repeat: undefined });
          }
        }
        cursor.setDate(cursor.getDate() + freqDays);
      }
    }
  }
  return result.sort((a, b) => a.date.localeCompare(b.date) || a.start.localeCompare(b.start));
}

export function addSlot(slots: Slot[], slot: Slot): Slot[] {
  return [...slots, slot];
}

export function updateSlot(slots: Slot[], updated: Slot): Slot[] {
  return slots.map(s => s.id === updated.id ? updated : s);
}

export function deleteSlot(slots: Slot[], id: string): Slot[] {
  return slots.filter(s => s.id !== id);
}

export function addBooking(slots: Slot[], slotId: string, booking: Booking): Slot[] {
  return slots.map(s => {
    if (s.id !== slotId) return s;
    return { ...s, bookings: [...s.bookings, booking] };
  });
}

export function confirmBooking(slots: Slot[], slotId: string, bookingIdx: number): Slot[] {
  return slots.map(s => {
    if (s.id !== slotId) return s;
    const bookings = s.bookings.map((b, i) =>
      i === bookingIdx ? { ...b, status: 'confirmed' as const } : b
    );
    return { ...s, bookings };
  });
}

export function cancelBooking(slots: Slot[], slotId: string, bookingIdx: number): Slot[] {
  return slots.map(s => {
    if (s.id !== slotId) return s;
    const bookings = s.bookings.map((b, i) =>
      i === bookingIdx ? { ...b, status: 'cancelled' as const } : b
    );
    return { ...s, bookings };
  });
}

export function getFreeSlots(slots: Slot[], from: string, to: string): Slot[] {
  const expanded = expandSlots(slots, from, to);
  return expanded.filter(s => s.bookings.filter(b => b.status === 'confirmed').length < s.capacity);
}

export function getBookedCount(slot: Slot): number {
  return slot.bookings.filter(b => b.status === 'confirmed').length;
}

