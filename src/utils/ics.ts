
import type { Slot } from '../types';

function esc(s: string): string {
  return s.replace(/[\\;,]/g, '\\$&').replace(/\n/g, '\\n');
}

function fmtDate(d: string, t: string): string {
  // "2026-06-16" + "09:00" -> "20260616T090000"
  return d.replace(/-/g, '') + 'T' + t.replace(/:/g, '') + '00';
}

export function generateSlotICS(slot: Slot, organizerName: string): string {
  const lines = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//TimeBox//EN',
    'BEGIN:VEVENT',
    'DTSTART:' + fmtDate(slot.date, slot.start),
    'DTEND:' + fmtDate(slot.date, slot.end),
    'SUMMARY:' + esc(organizerName || 'TimeBox'),
  ];

  const confirmed = slot.bookings.filter(b => b.status === 'confirmed');
  if (confirmed.length > 0) {
    const names = confirmed.map(b => b.name).join(', ');
    lines.push('DESCRIPTION:Записан(ы): ' + esc(names));
  }

  if (slot.notes) {
    lines.push('DESCRIPTION:' + esc(slot.notes));
  }

  lines.push('STATUS:CONFIRMED');
  lines.push('END:VEVENT');
  lines.push('END:VCALENDAR');

  return lines.join('\\r\\n');
}

export function generateSlotsICS(slots: Slot[], organizerName: string): string {
  const lines = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//TimeBox//EN',
  ];

  for (const slot of slots) {
    lines.push('BEGIN:VEVENT');
    lines.push('DTSTART:' + fmtDate(slot.date, slot.start));
    lines.push('DTEND:' + fmtDate(slot.date, slot.end));

    const confirmed = slot.bookings.filter(b => b.status === 'confirmed');
    if (confirmed.length > 0) {
      const names = confirmed.map(b => b.name).join(', ');
      lines.push('SUMMARY:' + esc(organizerName || 'TimeBox') + ': ' + names);
      lines.push('DESCRIPTION:Клиенти: ' + esc(names));
    } else {
      lines.push('SUMMARY:' + esc(organizerName || 'Свободное окно'));
      lines.push('TRANSP:TRANSPARENT');
    }

    if (slot.notes) {
      lines.push('DESCRIPTION:' + esc(slot.notes + (slot.notes ? '\\n' : '') + 'Слот TimeBox'));
    }

    lines.push('STATUS:CONFIRMED');
    lines.push('END:VEVENT');
  }

  lines.push('END:VCALENDAR');
  return lines.join('\\r\\n');
}

export function downloadICS(ics: string, filename: string): void {
  const blob = new Blob([ics], { type: 'text/calendar;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

