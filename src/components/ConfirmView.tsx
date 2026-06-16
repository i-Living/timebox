
import type { BookPayload, Slot } from '../types';
import { formatDateFull } from '../utils/dates';

interface Props {
  booking: BookPayload;
  slot: Slot | undefined;
  onConfirm: () => void;
  onDecline: () => void;
  alreadyBooked: boolean;
}

export function ConfirmView({ booking, slot, onConfirm, onDecline, alreadyBooked }: Props) {
  if (!slot) {
    return (
      <div style="padding:40px;text-align:center;color:var(--text-secondary);">
        <div style="font-size:48px;">🔍</div>
        <p style="margin-top:16px;">Окно не найдено. Возможно, оно было удалено.</p>
      </div>
    );
  }

  return (
    <div>
      <div class="student-header">
        <h1>Запрос на запись</h1>
      </div>

      <div class="confirm-card">
        <div style="font-size:14px;color:var(--text-secondary);">{formatDateFull(slot.date)}</div>
        <div class="time">{slot.start} – {slot.end}</div>
        <div class="name">{booking.name}</div>
        {booking.contact && (
          <div style="font-size:14px;color:var(--text-secondary);margin-bottom:16px;">
            Контакт: {booking.contact}
          </div>
        )}

        {alreadyBooked ? (
          <div style="padding:12px;background:var(--warning-light);border-radius:8px;color:#92400e;font-size:14px;">
            ⚠️ Это окно уже занято
          </div>
        ) : (
          <div class="confirm-buttons">
            <button class="btn btn-success" onClick={onConfirm}>✅ Подтвердить</button>
            <button class="btn btn-danger" onClick={onDecline}>❌ Отказать</button>
          </div>
        )}
      </div>
    </div>
  );
}
