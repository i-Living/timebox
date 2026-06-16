
import type { Slot } from '../types';
import { formatDateFull } from '../utils/dates';

interface Props {
  slots: Slot[];
}

export function DiaryView({ slots }: Props) {
  // Show only past slots with bookings or notes
  const today = new Date().toISOString().slice(0, 10);
  const pastSlots = slots
    .filter(s => s.date < today || (s.date <= today && s.bookings.length > 0))
    .sort((a, b) => b.date.localeCompare(a.date) || b.start.localeCompare(b.start));

  // Also show future slots with notes (diary entries planned ahead)
  const futureSlots = slots
    .filter(s => s.date > today && s.notes)
    .sort((a, b) => a.date.localeCompare(a.date) || a.start.localeCompare(b.start));

  const allSlots = [...pastSlots, ...futureSlots];

  return (
    <div class="slot-list">
      {allSlots.length === 0 ? (
        <div class="empty-state">
          <div class="icon">📓</div>
          Здесь будет история занятий и заметки
        </div>
      ) : (
        allSlots.map(slot => {
          const confirmed = slot.bookings.filter(b => b.status === 'confirmed');
          return (
            <div key={slot.id} class="diary-entry">
              <div class="meta">
                {formatDateFull(slot.date)} · {slot.start}–{slot.end}
                {slot.status === 'cancelled' && ' · Отменено'}
              </div>
              {confirmed.length > 0 && (
                <div class="students">
                  {confirmed.map(b => (
                    <span key={b.name} style="margin-right:8px;">
                      {b.attendance === 'present' ? '✅' : b.attendance === 'late' ? '⏰' : b.attendance === 'no-show' ? '❌' : ''}
                      {' '}{b.name}
                    </span>
                  ))}
                </div>
              )}
              {slot.notes && <div class="notes">{slot.notes}</div>}
            </div>
          );
        })
      )}
    </div>
  );
}
