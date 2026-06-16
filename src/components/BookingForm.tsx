
import { useState } from 'preact/hooks';
import type { SharePayload } from '../types';

interface Props {
  slot: SharePayload['slots'][0];
  onBook: (name: string, contact: string) => void;
  onBack: () => void;
}

export function BookingForm({ slot, onBook, onBack }: Props) {
  const [name, setName] = useState('');
  const [contact, setContact] = useState('');

  const remaining = slot.capacity - slot.bookedCount;

  return (
    <div class="student-form">
      <div style="font-size:14px;color:var(--text-secondary);text-align:center;">
        {remaining > 1 ? `Доступно ${remaining} мест из ${slot.capacity}` : 'Индивидуальное занятие'}
      </div>

      <div class="form-group">
        <label class="form-label">Ваше имя</label>
        <input class="form-input" type="text" value={name} onInput={e => setName(e.currentTarget.value)}
          placeholder="Иван" autoFocus />
      </div>
      <div class="form-group">
        <label class="form-label">Контакт (телефон / Telegram)</label>
        <input class="form-input" type="text" value={contact} onInput={e => setContact(e.currentTarget.value)}
          placeholder="@ivan_tg или +7..." />
      </div>

      <button class="btn btn-primary btn-block" onClick={() => onBook(name, contact)} disabled={!name.trim()}>
        ✅ Забронировать
      </button>
      <button class="btn btn-ghost btn-block" onClick={onBack}>← Назад</button>
    </div>
  );
}
