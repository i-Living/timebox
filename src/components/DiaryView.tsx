/**
 * @fileoverview Diary view component for displaying past and future lesson slots with attendance tracking and notes editing.
 */

import { useState } from 'preact/hooks';
import { BookOpen, Check, Clock, X, Pencil, Plus } from 'lucide-react';
import { Button } from './Button';
import type { Slot, OrganizerData } from '../types';
import { formatDateFull } from '../utils/dates';

interface Props {
  slots: Slot[];
  onChange?: (data: OrganizerData) => void;
}

/**
 * DiaryView component - displays lesson history with attendance management and notes.
 * @param {Props} props - Component props
 * @param {Slot[]} props.slots - Array of time slots to display
 * @param {(data: OrganizerData) => void} [props.onChange] - Callback when data changes
 * @returns {JSX.Element} Diary view with attendance buttons and notes editor
 */
export function DiaryView({ slots, onChange }: Props) {
  const today = new Date().toISOString().slice(0, 10);
  const [editingNotes, setEditingNotes] = useState<string | null>(null);
  const [notesText, setNotesText] = useState('');

  // Separate slots into past (with bookings) and future (with notes), sorted chronologically
  const pastSlots = slots
    .filter(s => s.date < today || (s.date <= today && s.bookings.length > 0))
    .sort((a, b) => b.date.localeCompare(a.date) || a.start.localeCompare(b.start));

  const futureSlots = slots
    .filter(s => s.date > today && s.notes)
    .sort((a, b) => a.date.localeCompare(b.date) || a.start.localeCompare(b.start));

  const allSlots = [...pastSlots, ...futureSlots];

  /**
   * Updates attendance status for a specific booking in a slot.
   * Reads current data from localStorage, modifies the attendance field, and triggers onChange.
   * @param {string} slotId - ID of the slot to update
   * @param {number} bookingIdx - Index of the booking within the slot
   * @param {'present' | 'late' | 'no-show'} value - New attendance status
   */
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

  /**
   * Saves notes for a specific slot to localStorage and triggers onChange.
   * Clears editing state after successful save.
   * @param {string} slotId - ID of the slot to save notes for
   */
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
                <div key={b.name} class="students" style="display:flex;align-items:center;gap:8px;margin-bottom:6px;padding-bottom:6px;border-bottom:1px solid var(--border);">
                  <span style="flex:1;">{b.name}{b.contact ? ' (' + b.contact + ')' : ''}</span>
                  <div style="display:flex;gap:2px;">
                    <Button
                      variant={b.attendance === 'present' ? 'primary' : 'outline'}
                      size="sm"
                      style="padding:2px 6px;font-size:12px;min-width:0;"
                      onClick={() => setAttendance(slot.id, bi, 'present')}
                      title="Присутствовал"><Check size={16} /></Button>
                    <Button
                      variant={b.attendance === 'late' ? 'primary' : 'outline'}
                      size="sm"
                      style="padding:2px 6px;font-size:12px;min-width:0;"
                      onClick={() => setAttendance(slot.id, bi, 'late')}
                      title="Опоздал"><Clock size={16} /></Button>
                    <Button
                      variant={b.attendance === 'no-show' ? 'primary' : 'outline'}
                      size="sm"
                      style="padding:2px 6px;font-size:12px;min-width:0;"
                      onClick={() => setAttendance(slot.id, bi, 'no-show')}
                      title="Не пришёл"><X size={16} /></Button>
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
                    <Button size="sm" onClick={() => saveNotes(slot.id)}>Сохранить</Button>
                    <Button variant="ghost" size="sm" onClick={() => setEditingNotes(null)}>Отмена</Button>
                  </div>
                </div>
              ) : (
                <div style="margin-top:4px;">
                  {slot.notes && (
                    <div class="notes" style="cursor:pointer;" onClick={() => { setEditingNotes(slot.id); setNotesText(slot.notes || ''); }}>
                      {slot.notes}
                    </div>
                  )}
                  <Button variant="ghost" size="sm" style="font-size:12px;color:var(--text-secondary);padding:2px 0;"
                    onClick={() => { setEditingNotes(slot.id); setNotesText(slot.notes || ''); }}>
                    {slot.notes ? <><Pencil size={14} style="vertical-align:middle;margin-right:2px;" /></> : <><Plus size={14} style="vertical-align:middle;margin-right:2px;" /></>}
                    {slot.notes ? 'Изменить' : 'Добавить заметку'}
                  </Button>
                </div>
              )}
            </div>
          );
        })
      )}
    </div>
  );
}