
import type { Slot } from '../types';
import { getBookedCount } from '../store';

interface Props {
  slot: Slot;
  onClick: () => void;
}

export function SlotCard({ slot, onClick }: Props) {
  const booked = getBookedCount(slot);
  const remaining = slot.capacity - booked;
  const isFull = remaining <= 0;

  const cardClass = slot.status === 'cancelled' ? 'cancelled' : isFull ? 'full' : 'open';

  let statusText = '';
  let statusClass = '';
  if (slot.status === 'cancelled') {
    statusText = 'Отменено';
    statusClass = '';
  } else if (remaining <= 0) {
    statusText = 'Заполнено';
    statusClass = 'booked';
  } else if (booked > 0) {
    statusText = `Свободно ${remaining} из ${slot.capacity}`;
    statusClass = 'pending';
  } else {
    statusText = 'Свободно';
    statusClass = 'free';
  }

  return (
    <div class={`slot-card ${cardClass}`} onClick={onClick}>
      <div class="slot-time">
        {slot.start}
        <div class="end">{slot.end}</div>
      </div>
      <div class="slot-info">
        <span class={`slot-status ${statusClass}`}>{statusText}</span>
        {booked > 0 && (
          <div class="slot-bookings">
            {slot.bookings.filter(b => b.status === 'confirmed').map(b => b.name).join(', ')}
          </div>
        )}
      </div>
      <div class="slot-arrow">›</div>
    </div>
  );
}
