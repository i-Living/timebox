
import { useState, useEffect } from 'preact/hooks';
import type { Slot } from '../types';
import { load, save, expandSlots, addSlot, updateSlot, deleteSlot } from '../store';
import { today, getWeekStart, addDays, formatDateFull } from '../utils/dates';
import { WeekStrip } from './WeekStrip';
import { SlotCard } from './SlotCard';
import { SlotEditor } from './SlotEditor';
import { ShareDialog } from './ShareDialog';
import { DiaryView } from './DiaryView';
import { ClientsView } from './ClientsView';
import { BottomNav } from './BottomNav';
import { SettingsView } from './SettingsView';

export function OrganizerView() {
  const [data, setData] = useState(() => load());
  const [selectedDate, setSelectedDate] = useState(today());
  const [weekStart, setWeekStart] = useState(() => getWeekStart(today()));
  const [showEditor, setShowEditor] = useState(false);
  const [editingSlot, setEditingSlot] = useState<Slot | undefined>();
  const [showShare, setShowShare] = useState(false);
  const [tab, setTab] = useState<'calendar' | 'clients' | 'diary' | 'settings'>('calendar');
  const [toast, setToast] = useState('');
  const [undoSlot, setUndoSlot] = useState<Slot | null>(null);

  // Handle Share Target API — shared text from other apps
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const shared = params.get('text') || params.get('url') || '';
    if (shared) {
      showToast('📨 Получено: ' + shared.slice(0, 50) + (shared.length > 50 ? '…' : ''));
      window.history.replaceState(null, '', '/');
    }
  }, []);

  // Save data on every change
  useEffect(() => { save(data); }, [data]);

  // Expand slots for current week to show dots on date strip
  const weekEnd = addDays(weekStart, 6);
  const weekSlots = expandSlots(data.slots, weekStart, weekEnd);
  const slotsByDate: Record<string, number> = {};
  for (const s of weekSlots) {
    slotsByDate[s.date] = (slotsByDate[s.date] || 0) + 1;
  }

  // Slots for selected date
  const daySlots = expandSlots(data.slots, selectedDate, selectedDate);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(''), 2000);
  };

  const handleSaveSlot = (slot: Slot) => {
    if (data.slots.find(s => s.id === slot.id)) {
      setData(d => ({ ...d, slots: updateSlot(d.slots, slot) }));
      showToast('Окно обновлено');
    } else {
      setData(d => ({ ...d, slots: addSlot(d.slots, slot) }));
      showToast('Окно создано');
    }
  };

  const handleDeleteSlot = (id: string) => {
    const slot = data.slots.find(s => s.id === id);
    if (!slot) return;
    setData(d => ({ ...d, slots: deleteSlot(d.slots, id) }));
    setUndoSlot(slot);
    setToast('Окно удалено');
    setTimeout(() => {
      setUndoSlot(null);
      setToast(t => t === 'Окно удалено' ? '' : t);
    }, 4000);
  };

  const handleUndoDelete = () => {
    if (!undoSlot) return;
    setData(d => ({ ...d, slots: [...d.slots, undoSlot] }));
    setUndoSlot(null);
    showToast('Восстановлено');
  };

  const handleCopySlot = (slot: Slot) => {
    const tomorrow = addDays(slot.date, 1);
    const newSlot: Slot = {
      ...slot,
      id: '',
      date: tomorrow,
      bookings: [],
    };
    setData(d => ({ ...d, slots: addSlot(d.slots, newSlot) }));
    showToast('Окно скопировано на ' + formatDateFull(tomorrow));
  };

  const goToday = () => {
    setSelectedDate(today());
    setWeekStart(getWeekStart(today()));
  };

  const handlePrevWeek = () => setWeekStart(d => addDays(d, -7));
  const handleNextWeek = () => setWeekStart(d => addDays(d, 7));

  const hasSlots = data.slots.length > 0;

  return (
    <>
      {/* HEADER */}
      <div class="header">
        <div class="header-title">TimeBox</div>
        <div style="display:flex;gap:8px;">
          <button class="header-btn" onClick={() => { setEditingSlot(undefined); setShowEditor(true); }}>
            ＋ Окно
          </button>
          <button class="header-btn" onClick={() => setShowShare(true)} disabled={!hasSlots}>
            ↗️ Поделиться
          </button>
        </div>
      </div>

      {tab === 'calendar' && (
        <>
          <WeekStrip
            weekStart={weekStart}
            selectedDate={selectedDate}
            slotsByDate={slotsByDate}
            onSelectDate={setSelectedDate}
            onPrevWeek={handlePrevWeek}
            onNextWeek={handleNextWeek}
          />

          <div class="week-nav">
            <button onClick={handlePrevWeek}>← Пред.</button>
            <button onClick={goToday} style="font-weight:600;">Сегодня</button>
            <button onClick={handleNextWeek}>След. →</button>
          </div>

          <div style="padding:10px 16px 0;font-size:14px;font-weight:600;color:var(--text-secondary);">
            {formatDateFull(selectedDate)}
          </div>

          <div class="slot-list">
            {daySlots.length === 0 ? (
              <div class="empty-state">
                <div class="icon">📅</div>
                Нет окон на этот день<br />
                <button class="btn btn-primary btn-sm" style="margin-top:12px;"
                  onClick={() => { setEditingSlot(undefined); setShowEditor(true); }}>
                  ＋ Создать окно
                </button>
              </div>
            ) : (
              daySlots.map(slot => (
                <SlotCard key={slot.id} slot={slot}
                  onClick={() => { setEditingSlot(slot); setShowEditor(true); }}
                  onCopy={() => handleCopySlot(slot)}
                />
              ))
            )}
          </div>
        </>
      )}

      {tab === 'diary' && <DiaryView slots={data.slots} onChange={setData} />}

      {tab === 'clients' && <ClientsView slots={data.slots} />}

      {tab === 'settings' && <SettingsView data={data} onChange={setData} />}

      <BottomNav active={tab} onSelect={setTab} />

      {/* MODALS */}
      {showEditor && (
        <SlotEditor
          slot={editingSlot}
          defaultDuration={data.defaultSlotDuration}
          onSave={handleSaveSlot}
          onDelete={handleDeleteSlot}
          onClose={() => { setShowEditor(false); setEditingSlot(undefined); }}
        />
      )}

      {showShare && (
        <ShareDialog
          organizerName={data.organizerName}
          slots={data.slots}
          onClose={() => setShowShare(false)}
        />
      )}

      {/* TOAST */}
      {toast && (
        <div class="toast">
          <span>{toast}</span>
          {undoSlot && (
            <button class="toast-action" onClick={handleUndoDelete}>Отменить</button>
          )}
        </div>
      )}
    </>
  );
}
