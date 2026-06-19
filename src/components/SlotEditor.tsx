
import { useState, useEffect } from 'preact/hooks';
import { Check, X } from 'lucide-react';
import { Button } from './Button';
import type { Slot, Booking } from '../types';
import { today } from '../utils/dates';

interface Props {
  slot?: Slot; // undefined = creating new
  defaultDuration?: number;
  knownClients?: string[]; // for name autocomplete
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

export function SlotEditor({ slot, defaultDuration, knownClients, onSave, onDelete, onClose }: Props) {
  const [date, setDate] = useState(slot?.date || today());
  const [start, setStart] = useState(slot?.start || '09:00');
  const defaultEnd = defaultDuration ? addMinutes(start, defaultDuration) : '10:00';
  const [end, setEnd] = useState(slot?.end || defaultEnd);
  const [capacity, setCapacity] = useState(slot?.capacity || 1);
  const [repeat, setRepeat] = useState(slot?.repeat !== undefined);
  const [repeatFreq, setRepeatFreq] = useState<'daily' | 'weekly' | 'biweekly'>(slot?.repeat?.freq || 'weekly');
  const [repeatUntil, setRepeatUntil] = useState(slot?.repeat?.until || '');
  const [notes, setNotes] = useState(slot?.notes || '');
  const [bookings, setBookings] = useState<Booking[]>(slot?.bookings || []);
  const [showAddClient, setShowAddClient] = useState(false);
  const [clientName, setClientName] = useState('');
  const [clientContact, setClientContact] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);

  const filteredNames = knownClients
    ? knownClients.filter(
        n => n.toLowerCase().includes(clientName.toLowerCase()) && clientName.length > 0
      )
    : [];

  // Auto-adjust end when start changes: if end <= start, recalculate
  useEffect(() => {
    if (end <= start) {
      setEnd(addMinutes(start, defaultDuration || 60));
    }
  }, [start, defaultDuration, end]);

  // Escape → close, Enter → add client when in add mode
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [onClose]);

  const handleSave = () => {
    onSave({
      ...slot,
      id: slot?.id || genId(),
      date,
      start,
      end,
      capacity,
      status: 'open',
      bookings,
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

  const handleAddClient = () => {
    if (!clientName.trim()) return;
    const newBooking: Booking = {
      name: clientName.trim(),
      contact: clientContact.trim(),
      status: 'confirmed',
      bookedAt: new Date().toISOString(),
    };
    setBookings(prev => [...prev, newBooking]);
    setClientName('');
    setClientContact('');
    setShowAddClient(false);
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
            <input class="form-input" type="time" value={start} onInput={e => setStart(e.currentTarget.value)} style="min-width:0;width:0;" />
          </div>
          <div class="form-group">
            <label class="form-label">Конец</label>
            <input class="form-input" type="time" value={end} onInput={e => setEnd(e.currentTarget.value)} style="min-width:0;width:0;" />
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

        {slot && (
          <div style="margin-top:12px;">
            <h3 style="font-size:14px;font-weight:600;margin-bottom:6px;">Клиенты</h3>
            {bookings.filter(b => b.status === 'confirmed').length === 0 && (
              <div style="font-size:13px;color:var(--text-secondary);margin-bottom:6px;">
                Нет записанных клиентов
              </div>
            )}
            {bookings.filter(b => b.status === 'confirmed').map((b, i) => (
              <div key={i} style="display:flex;align-items:center;gap:6px;padding:6px 8px;background:var(--bg);border-radius:6px;margin-bottom:4px;font-size:13px;">
                <span style="flex:1;">{b.name}{b.contact ? ' (' + b.contact + ')' : ''}</span>
                <Button variant="ghost" size="sm"
                  style="padding:2px 6px;font-size:14px;line-height:1;min-width:0;color:var(--text-secondary);"
                  onClick={() => setBookings(prev => prev.filter((_, j) => j !== i))}
                  title="Убрать клиента"><X size={14} /></Button>
              </div>
            ))}
            {showAddClient ? (
              <div style="margin-top:8px;display:flex;flex-direction:column;gap:6px;">
                <div style="position:relative;">
                  <input class="form-input" type="text" placeholder="Имя клиента" value={clientName}
                    onInput={e => { setClientName(e.currentTarget.value); setShowSuggestions(true); }}
                    onFocus={() => filteredNames.length > 0 && setShowSuggestions(true)}
                    onBlur={() => setTimeout(() => setShowSuggestions(false), 150)}
                    onKeyDown={e => { if (e.key === 'Enter' && clientName.trim()) handleAddClient(); }}
                    autoFocus />
                  {showSuggestions && filteredNames.length > 0 && (
                    <div style="position:absolute;top:100%;left:0;right:0;background:var(--surface);border:1px solid var(--border);border-radius:6px;z-index:10;max-height:150px;overflow-y:auto;box-shadow:0 4px 12px rgba(0,0,0,0.15);">
                      {filteredNames.map(name => (
                        <div key={name}
                          style="padding:8px 10px;cursor:pointer;font-size:13px;border-bottom:1px solid var(--border);"
                          onMouseDown={() => { setClientName(name); setShowSuggestions(false); }}>
                          {name}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
                <input class="form-input" type="text" placeholder="Контакт (необязательно)" value={clientContact}
                  onInput={e => setClientContact(e.currentTarget.value)} />
                <div style="display:flex;gap:8px;">
                  <Button size="sm" onClick={handleAddClient} disabled={!clientName.trim()}>
                    <Check size={16} style="vertical-align:middle;margin-right:4px;" /> Добавить
                  </Button>
                  <Button variant="ghost" size="sm" onClick={() => { setShowAddClient(false); setClientName(''); setClientContact(''); }}>
                    Отмена
                  </Button>
                </div>
              </div>
            ) : (
              <Button variant="outline" size="sm" block onClick={() => setShowAddClient(true)} style="margin-top:4px;">
                + Добавить клиента
              </Button>
            )}
          </div>
        )}

        <div style="display:flex;gap:8px;margin-top:16px;">
          <Button block onClick={handleSave}>
            {slot ? 'Сохранить' : 'Создать окно'}
          </Button>
          {slot && onDelete && (
            <Button variant="danger" onClick={handleDelete} style="flex-shrink:0;">Удалить</Button>
          )}
          <Button variant="outline" onClick={onClose}>Отмена</Button>
        </div>
      </div>
    </div>
  );
}
