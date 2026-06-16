
import { useState } from 'preact/hooks';
import type { SharePayload, BookPayload } from '../types';
import { formatDateFull } from '../utils/dates';
import { encodeBookPayload } from '../utils/url';
import { downloadICS } from '../utils/ics';
import type { Slot } from '../types';
import { BookingForm } from './BookingForm';

interface Props {
  payload: SharePayload;
}

export function ClientView({ payload }: Props) {
  const [selectedSlot, setSelectedSlot] = useState<SharePayload['slots'][0] | null>(null);
  const [bookedPayload, setBookedPayload] = useState<BookPayload | null>(null);
  const [copied, setCopied] = useState(false);

  // Group slots by date
  const byDate: Record<string, SharePayload['slots']> = {};
  for (const s of payload.slots) {
    if (!byDate[s.date]) byDate[s.date] = [];
    byDate[s.date].push(s);
  }

  const handleBook = (name: string, contact: string) => {
    if (!selectedSlot) return;
    const bp: BookPayload = {
      v: 1,
      slotId: selectedSlot.id,
      name,
      contact,
      at: new Date().toISOString(),
    };
    setBookedPayload(bp);
  };

  const bookLink = bookedPayload
    ? (window.location.origin + window.location.pathname + encodeBookPayload(bookedPayload))
    : '';

  const copyBookLink = async () => {
    if (!bookLink) return;
    await navigator.clipboard.writeText(bookLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const downloadAllICS = () => {
    const slots = payload.slots.filter(s => s.bookedCount < s.capacity);
    const slotObjs: Slot[] = slots.map(s => ({
      id: s.id,
      date: s.date,
      start: s.start,
      end: s.end,
      capacity: s.capacity,
      status: 'open' as const,
      bookings: [],
    }));
    const ics = [
      'BEGIN:VCALENDAR',
      'VERSION:2.0',
      'PRODID:-//TimeBox//EN',
    ];
    for (const s of slotObjs) {
      ics.push('BEGIN:VEVENT');
      ics.push('DTSTART:' + s.date.replace(/-/g, '') + 'T' + s.start.replace(/:/g, '') + '00');
      ics.push('DTEND:' + s.date.replace(/-/g, '') + 'T' + s.end.replace(/:/g, '') + '00');
      ics.push('SUMMARY:' + (payload.organizer || 'Свободное окно'));
      ics.push('TRANSP:TRANSPARENT');
      ics.push('STATUS:CONFIRMED');
      ics.push('END:VEVENT');
    }
    ics.push('END:VCALENDAR');
    downloadICS(ics.join('\r\n'), 'timebox-free-slots.ics');
  };

  // If a slot was selected and we're not yet booked
  if (selectedSlot && !bookedPayload) {
    return (
      <div>
        <div class="client-header">
          <h1>{payload.organizer || 'Организатор'}</h1>
          <p>{formatDateFull(selectedSlot.date)} {selectedSlot.start}–{selectedSlot.end}</p>
        </div>
        <BookingForm
          slot={selectedSlot}
          onBook={handleBook}
          onBack={() => setSelectedSlot(null)}
        />
      </div>
    );
  }

  // After booking
  if (bookedPayload) {
    return (
      <div>
        <div class="client-header">
          <h1>✅ Забронировано!</h1>
          <p>{formatDateFull(selectedSlot!.date)} {selectedSlot!.start}–{selectedSlot!.end}</p>
        </div>
        <div class="client-form">
          <p style="text-align:center;color:var(--text-secondary);">
            Отправьте эту ссылку организатору для подтверждения:
          </p>
          <div class="share-link-box">{bookLink}</div>
          <button class="btn btn-primary btn-block" onClick={copyBookLink}>
            {copied ? '✓ Скопировано!' : '📋 Копировать ссылку'}
          </button>
          {navigator.share && (
            <button class="btn btn-outline btn-block" onClick={() => navigator.share({ text: bookLink })}>
              📱 Отправить
            </button>
          )}
          <button class="btn btn-ghost btn-block" onClick={() => { setBookedPayload(null); setSelectedSlot(null); }}>
            ← К списку окон
          </button>
        </div>
      </div>
    );
  }

  // Main list
  return (
    <div>
      <div class="client-header">
        <h1>{payload.organizer || 'Организатор'}</h1>
        <p>Свободные окна</p>
      </div>

      <div style="padding:12px 16px;display:flex;justify-content:flex-end;">
        <button class="btn btn-sm btn-outline" onClick={downloadAllICS}>📅 В календарь</button>
      </div>

      <div class="slot-list" style="padding-top:0;">
        {Object.keys(byDate).sort().map(date => (
          <div key={date}>
            <h3 style="padding:8px 0;font-size:14px;color:var(--text-secondary);">
              {formatDateFull(date)}
            </h3>
            {byDate[date].map(slot => {
              const remaining = slot.capacity - slot.bookedCount;
              return (
                <div key={slot.id} class="slot-card open" onClick={() => setSelectedSlot(slot)}>
                  <div class="slot-time">
                    {slot.start}
                    <div class="end">{slot.end}</div>
                  </div>
                  <div class="slot-info">
                    <span class={`slot-status ${remaining > 0 ? 'free' : 'booked'}`}>
                      {remaining > 0 ? `${remaining} мест` : 'Заполнено'}
                    </span>
                  </div>
                  <div class="slot-arrow">›</div>
                </div>
              );
            })}
          </div>
        ))}
        {Object.keys(byDate).length === 0 && (
          <div class="empty-state">
            <div class="icon">📭</div>
            Нет доступных окон
          </div>
        )}
      </div>
    </div>
  );
}
