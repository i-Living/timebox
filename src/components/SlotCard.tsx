/**
 * @fileoverview Card component for displaying a time slot with booking status and copy functionality.
 */

import type { Slot } from '../types';
import { getBookedCount } from '../store';
import { Clipboard } from 'lucide-react';

interface Props {
  slot: Slot;
  onClick: () => void;
  onCopy?: () => void;
}

/**
 * SlotCard component - renders a time slot card with availability status and booking details.
 * @param {Props} props - Component props
 * @param {Slot} props.slot - The slot data to display
 * @param {() => void} props.onClick - Click handler for the card
 * @param {() => void} [props.onCopy] - Optional handler for copying slot to next day
 */
export function SlotCard({ slot, onClick, onCopy }: Props) {
  const booked = getBookedCount(slot);
  const remaining = slot.capacity - booked;
  const isFull = remaining <= 0;

  const cardClass = slot.status === 'cancelled' ? 'cancelled' : isFull ? 'full' : 'open';

  // Determine status text and styling based on slot state
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
      <div style="display:flex;flex-direction:column;gap:4px;">
        {onCopy && slot.status !== 'cancelled' && (
          <button class="slot-card-btn" onClick={e => { e.stopPropagation(); onCopy(); }}
            title="Копировать на завтра"><Clipboard size={16} /></button>
        )}
        <div class="slot-arrow">›</div>
      </div>
    </div>
  );
}