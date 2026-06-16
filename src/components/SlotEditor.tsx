
import { useState } from 'preact/hooks';
import type { Slot } from '../types';
import { today } from '../utils/dates';

interface Props {
  slot?: Slot; // undefined = creating new
  defaultDuration?: number;
  onSave: (slot: Slot) => void;
  onDelete?: (id: string) => void;
  onClose: () => void;
}

function addMinutes(time: string, minutes: number): string {
  const [h, m] = time.split(':').map(Number);
  const total = h * 60 + m + minutes;
  const nh = Math.floor(total / 60) % 24;
  const nm = total % 60;
  return `${String(nh).padStart(2, '0')}:${String(nm).padStart(2, '0')}`;
}

let idCounter = Date.now();
function genId(): string {
  return 's' + (++idCounter).toString(36);
}

export function SlotEditor({ slot, defaultDuration, onSave, onDelete, onClose }: Props) {
  const [date, setDate] = useState(slot?.date || today());
  const [start, setStart] = useState(slot?.start || '09:00');
  const defaultEnd = defaultDuration ? addMinutes(start, defaultDuration) : '10:00';
  const [end, setEnd] = useState(slot?.end || defaultEnd);
  const [capacity, setCapacity] = useState(slot?.capacity || 1);
  const [repeat, setRepeat] = useState(slot?.repeat !== undefined);
  const [repeatFreq, setRepeatFreq] = useState<'daily' | 'weekly' | 'biweekly'>(slot?.repeat?.freq || 'weekly');
  const [repeatUntil, setRepeatUntil] = useState(slot?.repeat?.until || '');
  const [notes, setNotes] = useState(slot?.notes || '');

  const handleSave = () => {
    onSave({
      id: slot?.id || genId(),
      date,
      start,
      end,
      capacity,
      status: 'open',
      bookings: slot?.bookings || [],
      notes: notes || undefined,
      repeat: repeat ? { freq: repeatFreq, until: repeatUntil } : undefined,
    });
    onClose();
  };

  const handleDelete = () => {
    if (slot && onDelete) {
      onDelete(slot.id);
      onClose();
    }
  };

  return (
    <div class="modal-overlay" onClick={onClose}>
      <div class="modal-sheet" onClick={e => e.stopPropagation()}>
        <h2>{slot ? 'Редактировать окно' : 'Новое окно'}</h2>

        <div class="form-row">
          <div class="form-group">
            <label class="form-label">Дата</label>
            <input class="form-input" type="date" value={date} onInput={e => setDate(e.currentTarget.value)} />
          </div>
        </div>

        <div class="form-row">
          <div class="form-group">
            <label class="form-label">Начало</label>
            <input class="form-input" type="time" value={start} onInput={e => setStart(e.currentTarget.value)} />
          </div>
          <div class="form-group">
            <label class="form-label">Конец</label>
            <input class="form-input" type="time" value={end} onInput={e => setEnd(e.currentTarget.value)} />
          </div>
        </div>

        <div class="form-group">
          <label class="form-label">Вместимость (1 = индивидуально)</label>
          <input class="form-input" type="number" min="1" max="50" value={capacity}
            onInput={e => setCapacity(parseInt(e.currentTarget.value) || 1)} />
        </div>

        <div class="form-group">
          <label class="form-label" style="display:flex;align-items:center;gap:8px;cursor:pointer;">
            <input type="checkbox" checked={repeat} onChange={e => setRepeat(e.currentTarget.checked)} />
            Повторять
          </label>
        </div>

        {repeat && (
          <div class="form-row">
            <div class="form-group">
              <label class="form-label">Частота</label>
              <select class="form-select" value={repeatFreq}
                onChange={e => setRepeatFreq(e.currentTarget.value as any)}>
                <option value="daily">Ежедневно</option>
                <option value="weekly">Еженедельно</option>
                <option value="biweekly">Раз в 2 недели</option>
              </select>
            </div>
            <div class="form-group">
              <label class="form-label">До (включительно)</label>
              <input class="form-input" type="date" value={repeatUntil} onInput={e => setRepeatUntil(e.currentTarget.value)} />
            </div>
          </div>
        )}

        <div class="form-group">
          <label class="form-label">Заметки (дневник)</label>
          <textarea class="form-input" rows={3} value={notes} onInput={e => setNotes(e.currentTarget.value)}
            placeholder="Что планируется в это время" />
        </div>

        <div style="display:flex;gap:8px;">
          <button class="btn btn-primary btn-block" onClick={handleSave}>
            {slot ? 'Сохранить' : 'Создать окно'}
          </button>
          {slot && onDelete && (
            <button class="btn btn-danger" onClick={handleDelete} style="flex-shrink:0;">Удалить</button>
          )}
          <button class="btn btn-outline" onClick={onClose}>Отмена</button>
        </div>
      </div>
    </div>
  );
}
