/**
 * @fileoverview Utility functions for managing timebox scheduling data in localStorage.
 * Provides CRUD operations for slots and bookings, recurring slot expansion, and data persistence.
 */

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

/**
 * Loads organizer data from localStorage, falling back to defaults on error or missing data.
 * @returns {OrganizerData} Merged data with defaults
 */
export function load(): OrganizerData {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return { ...defaults };
    return { ...defaults, ...JSON.parse(raw) };
  } catch {
    return { ...defaults };
  }
}

/**
 * Persists organizer data to localStorage.
 * @param {OrganizerData} d - Data to save
 */
export function save(d: OrganizerData): void {
  localStorage.setItem(KEY, JSON.stringify(d));
}

/**
 * Checks if a slot is a standalone override for a recurring slot (e.g., "slotId_2024-01-15").
 * @param {Slot} slot - Slot to check
 * @param {Slot[]} allSlots - All slots for context
 * @returns {boolean} True if slot overrides a recurring instance
 */
function isRecurringOverride(slot: Slot, allSlots: Slot[]): boolean {
  const match = slot.id.match(/^(.+)_(\d{4}-\d{2}-\d{2})$/);
  if (!match) return false;
  const baseId = match[1];
  return allSlots.some(s => s.id === baseId && s.repeat !== undefined);
}

/**
 * Expands recurring slots into concrete instances for a date range.
 * Handles overrides and respects cancellation status.
 * @param {Slot[]} slots - All slots (including recurring templates)
 * @param {string} from - Start date (YYYY-MM-DD)
 * @param {string} to - End date (YYYY-MM-DD)
 * @returns {Slot[]} Expanded and sorted slot instances
 */
export function expandSlots(slots: Slot[], from: string, to: string): Slot[] {
  const result: Slot[] = [];
  for (const s of slots) {
    if (s.status === 'cancelled') continue;

    if (!s.repeat) {
      // Single slot – skip if it's a recurring override (handled below)
      if (s.date >= from && s.date <= to && !isRecurringOverride(s, slots)) result.push(s);
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

/**
 * Adds a new slot to the array.
 * @param {Slot[]} slots - Current slots
 * @param {Slot} slot - New slot to add
 * @returns {Slot[]} Updated slots array
 */
export function addSlot(slots: Slot[], slot: Slot): Slot[] {
  return [...slots, slot];
}

/**
 * Updates an existing slot by ID.
 * @param {Slot[]} slots - Current slots
 * @param {Slot} updated - Slot with updated data
 * @returns {Slot[]} Updated slots array
 */
export function updateSlot(slots: Slot[], updated: Slot): Slot[] {
  return slots.map(s => s.id === updated.id ? updated : s);
}

/**
 * Deletes a slot by ID.
 * @param {Slot[]} slots - Current slots
 * @param {string} id - ID of slot to delete
 * @returns {Slot[]} Updated slots array
 */
export function deleteSlot(slots: Slot[], id: string): Slot[] {
  return slots.filter(s => s.id !== id);
}

/**
 * Adds a booking to a specific slot.
 * @param {Slot[]} slots - Current slots
 * @param {string} slotId - Target slot ID
 * @param {Booking} booking - Booking to add
 * @returns {Slot[]} Updated slots array
 */
export function addBooking(slots: Slot[], slotId: string, booking: Booking): Slot[] {
  return slots.map(s => {
    if (s.id !== slotId) return s;
    return { ...s, bookings: [...s.bookings, booking] };
  });
}

/**
 * Confirms a booking at a given index within a slot.
 * @param {Slot[]} slots - Current slots
 * @param {string} slotId - Target slot ID
 * @param {number} bookingIdx - Index of booking to confirm
 * @returns {Slot[]} Updated slots array
 */
export function confirmBooking(slots: Slot[], slotId: string, bookingIdx: number): Slot[] {
  return slots.map(s => {
    if (s.id !== slotId) return s;
    const bookings = s.bookings.map((b, i) =>
      i === bookingIdx ? { ...b, status: 'confirmed' as const } : b
    );
    return { ...s, bookings };
  });
}

/**
 * Cancels a booking at a given index within a slot.
 * @param {Slot[]} slots - Current slots
 * @param {string} slotId - Target slot ID
 * @param {number} bookingIdx - Index of booking to cancel
 * @returns {Slot[]} Updated slots array
 */
export function cancelBooking(slots: Slot[], slotId: string, bookingIdx: number): Slot[] {
  return slots.map(s => {
    if (s.id !== slotId) return s;
    const bookings = s.bookings.map((b, i) =>
      i === bookingIdx ? { ...b, status: 'cancelled' as const } : b
    );
    return { ...s, bookings };
  });
}

/**
 * Gets slots with available capacity (not fully booked) within a date range.
 * @param {Slot[]} slots - All slots
 * @param {string} from - Start date (YYYY-MM-DD)
 * @param {string} to - End date (YYYY-MM-DD)
 * @returns {Slot[]} Slots with remaining capacity
 */
export function getFreeSlots(slots: Slot[], from: string, to: string): Slot[] {
  const expanded = expandSlots(slots, from, to);
  return expanded.filter(s => s.bookings.filter(b => b.status === 'confirmed').length < s.capacity);
}

/**
 * Counts confirmed bookings for a slot.
 * @param {Slot} slot - Slot to check
 * @returns {number} Number of confirmed bookings
 */
export function getBookedCount(slot: Slot): number {
  return slot.bookings.filter(b => b.status === 'confirmed').length;
}