
import { useState } from 'preact/hooks';
import { BookOpen, Check, Clock, X, Pencil, Plus } from 'lucide-react';
import type { Slot, OrganizerData } from '../types';
import { formatDateFull } from '../utils/dates';

interface Props {
  slots: Slot[];
  onChange?: (data: OrganizerData) => void;
}

export function DiaryView({ slots, onChange }: Props) {
  const today = new Date().toISOString().slice(0, 10);
  const [editingNotes, setEditingNotes] = useState<string | null>(null);
  const [notesText, setNotesText] = useState('');

  const pastSlots = slots
    .filter(s => s.date < today || (s.date <= today && s.bookings.length > 0))
    .sort((a, b) => b.date.localeCompare(a.date) || b.start.localeCompare(b.start));

  const futureSlots = slots
    .filter(s => s.date > today && s.notes)
    .sort((a, b) => a.date.localeCompare(a.date) || a.start.localeCompare(b.start));

  const allSlots = [...pastSlots, ...futureSlots];

  const setAttendance = (slotId: string, bookingIdx: number, value: 'present' | 'late' | 'no-show') => {
    if (!onChange) return;
    const data = JSON.parse(localStorage.getItem('timebox_data') || '{}');
    const updated = data.slots.map((s: Slot) => {
      if (s.id !== slotId) return s;
      const bookings = s.bookings.map((b, i) =>
        i === bookingIdx ? { ...b, attendance: value } : b
      );
      return { ...s, bookings };
    });
    onChange({ ...data, slots: updated });
  };

  const saveNotes = (slotId: string) => {
    if (!onChange) return;
    const data = JSON.parse(localStorage.getItem('timebox_data') || '{}');
    const updated = data.slots.map((s: Slot) =>
      s.id === slotId ? { ...s, notes: notesText || undefined } : s
    );
    onChange({ ...data, slots: updated });
    setEditingNotes(null);
    setNotesText('');
  };

  return (
    <div class="slot-list">
      {allSlots.length === 0 ? (
        <div class="empty-state">
          <div class="icon"><BookOpen size={48} /></div>
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

              {confirmed.map((b, bi) => (
                <div key={b.name} class="students" style="display:flex;align-items:center;gap:8px;margin-bottom:4px;">
                  <span style="flex:1;">{b.name}{b.contact ? ' (' + b.contact + ')' : ''}</span>
                  <div style="display:flex;gap:2px;">
                    <button
                      class={`btn btn-sm ${b.attendance === 'present' ? 'btn-primary' : 'btn-outline'}`}
                      style="padding:2px 6px;font-size:12px;min-width:0;"
                      onClick={() => setAttendance(slot.id, bi, 'present')}
                      title="Присутствовал"><Check size={16} /></button>
                    <button
                      class={`btn btn-sm ${b.attendance === 'late' ? 'btn-primary' : 'btn-outline'}`}
                      style="padding:2px 6px;font-size:12px;min-width:0;"
                      onClick={() => setAttendance(slot.id, bi, 'late')}
                      title="Опоздал"><Clock size={16} /></button>
                    <button
                      class={`btn btn-sm ${b.attendance === 'no-show' ? 'btn-primary' : 'btn-outline'}`}
                      style="padding:2px 6px;font-size:12px;min-width:0;"
                      onClick={() => setAttendance(slot.id, bi, 'no-show')}
                      title="Не пришёл"><X size={16} /></button>
                  </div>
                </div>
              ))}

              {editingNotes === slot.id ? (
                <div style="margin-top:6px;">
                  <textarea class="form-input" rows={3}
                    value={notesText}
                    onInput={e => setNotesText(e.currentTarget.value)}
                    placeholder="Заметки о занятии" autoFocus
                    style="font-size:13px;"
                  />
                  <div style="display:flex;gap:6px;margin-top:4px;">
                    <button class="btn btn-primary btn-sm" onClick={() => saveNotes(slot.id)}>Сохранить</button>
                    <button class="btn btn-ghost btn-sm" onClick={() => setEditingNotes(null)}>Отмена</button>
                  </div>
                </div>
              ) : (
                <div style="margin-top:4px;">
                  {slot.notes && (
                    <div class="notes" style="cursor:pointer;" onClick={() => { setEditingNotes(slot.id); setNotesText(slot.notes || ''); }}>
                      {slot.notes}
                    </div>
                  )}
                  <button class="btn btn-ghost btn-sm" style="font-size:12px;color:var(--text-secondary);padding:2px 0;"
                    onClick={() => { setEditingNotes(slot.id); setNotesText(slot.notes || ''); }}>
                    {slot.notes ? <><Pencil size={14} style="vertical-align:middle;margin-right:2px;" /></> : <><Plus size={14} style="vertical-align:middle;margin-right:2px;" /></>}
                    {slot.notes ? 'Изменить' : 'Добавить заметку'}
                  </button>
                </div>
              )}
            </div>
          );
        })
      )}
    </div>
  );
}
