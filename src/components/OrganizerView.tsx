
import { ExternalLink, Calendar, ChevronLeft, ChevronRight } from 'lucide-react';
import { useState, useEffect } from 'preact/hooks';
import type { Slot } from '../types';
import { load, save, expandSlots, addSlot, updateSlot, deleteSlot } from '../store';
import { today, getWeekStart, addDays, formatDateFull } from '../utils/dates';
import { createCalendarEvent, updateCalendarEvent, deleteCalendarEvent, slotToEvent, getStoredToken, findEventForSlot } from '../utils/gcal';
import { WeekStrip } from './WeekStrip';
import { Button } from './Button';
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

  // — Shared GCal sync helper —
  const syncSlotToGcal = async (slot: Slot, clientId: string, organizerName: string, knownEventIds: Set<string>): Promise<Slot | null> => {
    const confirmedNames = slot.bookings
      .filter(b => b.status === 'confirmed')
      .map(b => b.name);
    const gcalEvent = slotToEvent(slot, organizerName || '', confirmedNames, slot.notes);

    try {
      if (slot.gcalEventId) {
        // Update existing event
        try {
          await updateCalendarEvent(clientId, slot.gcalEventId, gcalEvent);
          return null; // no change to local slot
        } catch {
          // Event was deleted externally — create a new one
          const eventId = await createCalendarEvent(clientId, gcalEvent);
          return { ...slot, gcalEventId: eventId };
        }
      } else {
        // No event ID saved locally — try to find an orphan event at this time
        const orphanId = await findEventForSlot(clientId, slot);
        if (orphanId && !knownEventIds.has(orphanId)) {
          // Unclaimed orphan — adopt it
          await updateCalendarEvent(clientId, orphanId, gcalEvent);
          return { ...slot, gcalEventId: orphanId };
        }
        const eventId = await createCalendarEvent(clientId, gcalEvent);
        return { ...slot, gcalEventId: eventId };
      }
    } catch (e) {
      console.error('GCal sync error:', e);
      return null;
    }
  };
  const handleSaveSlot = async (slot: Slot) => {
    const isNew = !data.slots.find(s => s.id === slot.id);

    // Sync to Google Calendar FIRST, so gcalEventId is saved immediately
    let finalSlot = slot;
    const gcalClientId = localStorage.getItem('timebox_gcal_client_id') || import.meta.env.VITE_GOOGLE_CLIENT_ID || '';
    const token = getStoredToken();
    if (gcalClientId && token) {
      try {
        const knownIds = new Set(data.slots.map(s => s.gcalEventId).filter((id): id is string => !!id));
        const result = await syncSlotToGcal(slot, gcalClientId, data.organizerName || '', knownIds);
        if (result) finalSlot = result;
      } catch (e) {
        console.error('GCal sync error:', e);
      }
    }

    // Save locally with the (potentially updated) gcalEventId
    if (isNew) {
      setData(d => ({ ...d, slots: addSlot(d.slots, finalSlot) }));
      showToast('Окно создано');
    } else {
      setData(d => ({ ...d, slots: updateSlot(d.slots, finalSlot) }));
      showToast('Окно обновлено');
    }
  };

  const handleDeleteSlot = (id: string) => {
    let slot = data.slots.find(s => s.id === id);

    // Recurring instance that hasn't been saved as override yet?
    if (!slot) {
      const match = id.match(/^(.+)_(\d{4}-\d{2}-\d{2})$/);
      if (match) {
        const baseId = match[1];
        const baseSlot = data.slots.find(s => s.id === baseId && s.repeat !== undefined);
        if (baseSlot) {
          // Create a cancelled override for this date
          const override: Slot = {
            ...baseSlot,
            id,
            date: match[2],
            repeat: undefined,
            status: 'cancelled',
            bookings: [],
            notes: undefined,
            gcalEventId: undefined,
          };
          setData(d => ({ ...d, slots: addSlot(d.slots, override) }));
          showToast('Этот день отменён');
          return;
        }
      }
      return;
    }

    setData(d => ({ ...d, slots: deleteSlot(d.slots, id) }));
    setUndoSlot(slot);
    setToast('Окно удалено');
    setTimeout(() => {
      setUndoSlot(null);
      setToast(t => t === 'Окно удалено' ? '' : t);
    }, 4000);

    // Delete Google Calendar event (fire-and-forget)
    if (slot.gcalEventId) {
      const gcalClientId = localStorage.getItem('timebox_gcal_client_id') || import.meta.env.VITE_GOOGLE_CLIENT_ID || '';
      const token = getStoredToken();
      if (gcalClientId && token) {
        deleteCalendarEvent(gcalClientId, slot.gcalEventId).catch(e =>
          console.error('GCal delete error:', e),
        );
      }
    }
  };

  const handleUndoDelete = () => {
    if (!undoSlot) return;
    setData(d => ({ ...d, slots: [...d.slots, undoSlot] }));
    setUndoSlot(null);
    showToast('Восстановлено');

    // Recreate the GCal event (fire-and-forget)
    const gcalClientId = localStorage.getItem('timebox_gcal_client_id') || import.meta.env.VITE_GOOGLE_CLIENT_ID || '';
    const token = getStoredToken();
    if (gcalClientId && token && undoSlot.gcalEventId) {
      const knownIds = new Set(data.slots.map(s => s.gcalEventId).filter((id): id is string => !!id));
      syncSlotToGcal(undoSlot, gcalClientId, data.organizerName || '', knownIds).then(updatedSlot => {
        if (updatedSlot && updatedSlot.gcalEventId !== undoSlot.gcalEventId) {
          setData(d => ({ ...d, slots: updateSlot(d.slots, updatedSlot) }));
        }
      }).catch(e => console.error('GCal undo sync error:', e));
    }
  };

  const handleCopySlot = (slot: Slot) => {
    const tomorrow = addDays(slot.date, 1);
    const newSlot: Slot = {
      ...slot,
      id: 's' + Date.now().toString(36) + Math.random().toString(36).slice(2, 6),
      date: tomorrow,
      bookings: [],
      gcalEventId: undefined,
    };
    setData(d => ({ ...d, slots: addSlot(d.slots, newSlot) }));
    showToast('Окно скопировано на ' + formatDateFull(tomorrow));
  };

  const handleSlotsChanged = (changedSlots: Slot[]) => {
    if (!changedSlots.length) return;
    const gcalClientId = localStorage.getItem('timebox_gcal_client_id') || import.meta.env.VITE_GOOGLE_CLIENT_ID || '';
    const token = getStoredToken();
    if (!gcalClientId || !token) return;

    const knownIds = new Set(data.slots.map(s => s.gcalEventId).filter((id): id is string => !!id));
    for (const slot of changedSlots) {
      syncSlotToGcal(slot, gcalClientId, data.organizerName || '', knownIds).then(updatedSlot => {
        if (updatedSlot && updatedSlot.gcalEventId !== slot.gcalEventId) {
          setData(d => ({
            ...d,
            slots: updateSlot(d.slots, updatedSlot),
          }));
        }
      }).catch(e => console.error('GCal sync error:', e));
    }
  };

  const goToday = () => {
    setSelectedDate(today());
    setWeekStart(getWeekStart(today()));
  };

  const handlePrevWeek = () => setWeekStart(d => addDays(d, -7));
  const handleNextWeek = () => setWeekStart(d => addDays(d, 7));

  const hasSlots = data.slots.length > 0;

  // All unique client names for autocomplete
  const knownClients = Array.from(
    new Set(
      data.slots.flatMap(s => s.bookings.filter(b => b.status === 'confirmed').map(b => b.name))
    )
  ).sort();

  return (
    <>
      {/* HEADER */}
      <div class="header">
        <div class="header-title">TimeBox</div>
      </div>

      {tab === 'calendar' && (
        <div class="tab-content" key="calendar">
          {/* Week navigation — above the day strip */}
          <div class="week-nav">
            <Button variant="ghost" size="sm" onClick={handlePrevWeek} title="Предыдущая неделя">
              <ChevronLeft size={20} />
            </Button>
            <Button variant="outline" size="sm" onClick={goToday} style="font-weight:600;">
              Сегодня
            </Button>
            <Button variant="ghost" size="sm" onClick={handleNextWeek} title="Следующая неделя">
              <ChevronRight size={20} />
            </Button>
          </div>
          <WeekStrip
            weekStart={weekStart}
            selectedDate={selectedDate}
            slotsByDate={slotsByDate}
            onSelectDate={setSelectedDate}
            onPrevWeek={handlePrevWeek}
            onNextWeek={handleNextWeek}
          />
          <div style="padding:10px 16px 0;font-size:14px;font-weight:600;color:var(--text-secondary);">
            {formatDateFull(selectedDate)}
          </div>

          <div class="slot-list">
            {daySlots.length === 0 ? (
              <div class="empty-state">
                <div class="icon"><Calendar size={48} /></div>
                Нет окон на этот день
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

          {/* Bottom actions for calendar tab */}
          <div style="
            position: fixed; bottom: calc(48px + env(safe-area-inset-bottom, 0px)); left: 50%; transform: translateX(-50%);
            width: 100%; max-width: 480px;
            background: var(--surface); border-top: 1px solid var(--border);
            padding: 10px 16px; display: flex; gap: 10px;
            z-index: 49;
            align-items: center;
          ">
            <Button variant="primary" onClick={() => { setEditingSlot(undefined); setShowEditor(true); }} style="flex:1;">
              ＋ Окно
            </Button>
            <Button variant="outline" onClick={() => setShowShare(true)} disabled={!hasSlots} style="flex:1;">
              <ExternalLink size={16} style="vertical-align:middle;margin-right:4px;" /> Поделиться
            </Button>
          </div>
        </div>
      )}

      {tab === 'diary' && <div class="tab-content" key="diary"><DiaryView slots={data.slots} onChange={setData} /></div>}

      {tab === 'clients' && <div class="tab-content" key="clients"><ClientsView slots={data.slots} onChange={setData} onSlotsChanged={handleSlotsChanged} /></div>}

      {tab === 'settings' && <div class="tab-content" key="settings"><SettingsView data={data} onChange={setData} /></div>}

      <BottomNav active={tab} onSelect={setTab} />

      {/* MODALS */}
      {showEditor && (
        <SlotEditor
          slot={editingSlot}
          defaultDuration={data.defaultSlotDuration}
          knownClients={knownClients}
          onSave={handleSaveSlot}
          onDelete={handleDeleteSlot}
          onClose={() => { setShowEditor(false); setEditingSlot(undefined); }}
        />
      )}

      {showShare && (
        <ShareDialog
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
