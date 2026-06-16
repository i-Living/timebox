
import { compressToEncodedURIComponent, decompressFromEncodedURIComponent } from 'lz-string';
import type { Slot, SharePayload, BookPayload } from '../types';

export function encodeSharePayload(p: SharePayload): string {
  const json = JSON.stringify(p);
  const compressed = compressToEncodedURIComponent(json);
  return '#s=' + compressed;
}

export function decodeSharePayload(hash: string): SharePayload | null {
  try {
    if (!hash.startsWith('#s=')) return null;
    const compressed = hash.slice(3);
    const json = decompressFromEncodedURIComponent(compressed);
    if (!json) return null;
    return JSON.parse(json);
  } catch {
    return null;
  }
}

export function encodeBookPayload(p: BookPayload): string {
  const json = JSON.stringify(p);
  const compressed = compressToEncodedURIComponent(json);
  return '#b=' + compressed;
}

export function decodeBookPayload(hash: string): BookPayload | null {
  try {
    if (!hash.startsWith('#b=')) return null;
    const compressed = hash.slice(3);
    const json = decompressFromEncodedURIComponent(compressed);
    if (!json) return null;
    return JSON.parse(json);
  } catch {
    return null;
  }
}

export function buildSharePayload(organizer: string, slots: Slot[]): SharePayload {
  return {
    v: 1,
    organizer,
    slots: slots.map(s => ({
      id: s.id,
      date: s.date,
      start: s.start,
      end: s.end,
      capacity: s.capacity,
      bookedCount: s.bookings.filter(b => b.status === 'confirmed').length,
    })),
    at: new Date().toISOString(),
  };
}

