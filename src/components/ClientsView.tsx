
import { useState } from 'preact/hooks';
import { Users, Check, Clock, X } from 'lucide-react';
import { Button } from './Button';
import { pluralize } from '../utils/pluralize';
import type { Slot, OrganizerData } from '../types';

interface Props {
  slots: Slot[];
  onChange?: (data: OrganizerData) => void;
}

interface ClientSummary {
  name: string;
  contact: string;
  totalVisits: number;
  lastVisit: string;
  attendance: { present: number; late: number; noShow: number };
}

export function ClientsView({ slots, onChange }: Props) {
  const clients = new Map<string, ClientSummary>();
  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState<'name' | 'visits' | 'last'>('visits');
  const [undoClient, setUndoClient] = useState<{ name: string; slots: Slot[] } | null>(null);

  for (const slot of slots) {
    if (slot.status === 'cancelled') continue;
    for (const b of slot.bookings) {
      if (b.status !== 'confirmed') continue;
      const key = b.name.toLowerCase().trim() + '|' + b.contact;
      const existing = clients.get(key);
      if (existing) {
        existing.totalVisits++;
        const slotDate = slot.date;
        if (slotDate > existing.lastVisit) existing.lastVisit = slotDate;
        if (b.attendance === 'present') existing.attendance.present++;
        else if (b.attendance === 'late') existing.attendance.late++;
        else if (b.attendance === 'no-show') existing.attendance.noShow++;
      } else {
        clients.set(key, {
          name: b.name,
          contact: b.contact,
          totalVisits: 1,
          lastVisit: slot.date,
          attendance: {
            present: b.attendance === 'present' ? 1 : 0,
            late: b.attendance === 'late' ? 1 : 0,
            noShow: b.attendance === 'no-show' ? 1 : 0,
          },
        });
      }
    }
  }

  const sortClients = (list: ClientSummary[]) => {
    switch (sortBy) {
      case 'name': return list.sort((a, b) => a.name.localeCompare(b.name));
      case 'last': return list.sort((a, b) => b.lastVisit.localeCompare(a.lastVisit));
      default: return list.sort((a, b) => b.totalVisits - a.totalVisits);
    }
  };

  let sortedClients = sortClients(Array.from(clients.values()));

  // Filter by search
  if (search.trim()) {
    const q = search.toLowerCase();
    sortedClients = sortedClients.filter(c => c.name.toLowerCase().includes(q) || c.contact.toLowerCase().includes(q));
  }

  const totalLessons = slots.reduce((sum, s) => {
    return sum + s.bookings.filter(b => b.status === 'confirmed').length;
  }, 0);

  const handleDeleteClient = (clientName: string) => {
    if (!onChange) return;
    const data = JSON.parse(localStorage.getItem('timebox_data') || '{}');
    // Save deleted bookings for undo
    const deletedSlots = data.slots
      .map((s: Slot) => ({
        ...s,
        bookings: s.bookings.filter((b: any) => b.status === 'confirmed' && b.name === clientName),
      }))
      .filter((s: Slot) => s.bookings.length > 0);
    const updated = data.slots.map((s: Slot) => ({
      ...s,
      bookings: s.bookings.filter(b => !(b.status === 'confirmed' && b.name === clientName)),
    }));
    onChange({ ...data, slots: updated });
    setUndoClient({ name: clientName, slots: deletedSlots });
    setTimeout(() => setUndoClient(null), 4000);
  };

  const handleUndoDelete = () => {
    if (!onChange || !undoClient) return;
    const data = JSON.parse(localStorage.getItem('timebox_data') || '{}');
    const restored = data.slots.map((s: Slot) => {
      const deleted = undoClient.slots.find(ds => ds.id === s.id);
      if (!deleted) return s;
      return { ...s, bookings: [...s.bookings, ...deleted.bookings] };
    });
    onChange({ ...data, slots: restored });
    setUndoClient(null);
  };

  return (
    <div class="slot-list">
      {/* Stats */}
      <div style="display:flex;gap:8px;margin-bottom:8px;">
        <div class="diary-entry" style="flex:1;text-align:center;padding:12px;">
          <div style="font-size:24px;font-weight:700;">{clients.size}</div>
          <div style="font-size:12px;color:var(--text-secondary);">{pluralize(clients.size, 'клиент', 'клиента', 'клиентов')}</div>
        </div>
        <div class="diary-entry" style="flex:1;text-align:center;padding:12px;">
          <div style="font-size:24px;font-weight:700;">{totalLessons}</div>
          <div style="font-size:12px;color:var(--text-secondary);">{pluralize(totalLessons, 'занятие', 'занятия', 'занятий')}</div>
        </div>
      </div>

      {sortedClients.length === 0 && !search ? (
        <div class="empty-state">
          <div class="icon"><Users size={48} /></div>
          Пока нет клиентов<br />
          <span style="font-size:13px;">Добавьте клиента в слот, и он появится здесь</span>
        </div>
      ) : (
        <>
          {/* Search & sort */}
          <div style="display:flex;gap:6px;align-items:center;">
            <input class="form-input" type="text" placeholder="Поиск клиента..." value={search}
              style="flex:1;padding:8px 10px;font-size:14px;"
              onInput={e => setSearch(e.currentTarget.value)} />
            <select class="form-select" value={sortBy} style="width:auto;padding:8px 10px;font-size:13px;"
              onChange={e => setSortBy(e.currentTarget.value as any)}>
              <option value="visits">По визитам</option>
              <option value="name">По имени</option>
              <option value="last">По дате</option>
            </select>
          </div>
          {sortedClients.length === 0 ? (
            <div style="text-align:center;padding:24px;color:var(--text-secondary);font-size:14px;">
              Ничего не найдено
            </div>
          ) : (
            sortedClients.map(client => {
              const totalMarked = client.attendance.present + client.attendance.late + client.attendance.noShow;
              return (
                <div class="diary-entry" key={client.name + client.contact}>
                  <div style="display:flex;justify-content:space-between;align-items:center;">
                    <div>
                      <strong>{client.name}</strong>
                      {client.contact && <span style="font-size:13px;color:var(--text-secondary);margin-left:8px;">{client.contact}</span>}
                    </div>
                    <div style="display:flex;align-items:center;gap:8px;">
                      <span style="font-size:13px;font-weight:600;">{client.totalVisits}×</span>
                      {onChange && (
                        <Button variant="ghost" size="sm"
                          style="padding:2px 6px;font-size:14px;line-height:1;min-width:0;color:var(--text-secondary);"
                          onClick={() => handleDeleteClient(client.name)}
                          title="Удалить клиента"><X size={14} /></Button>
                      )}
                    </div>
                  </div>
                  <div style="font-size:12px;color:var(--text-secondary);margin-top:2px;">
                    {totalMarked > 0 && (
                      <span>
                        <Check size={12} style="vertical-align:middle;" />{client.attendance.present}{' '}
                        <Clock size={12} style="vertical-align:middle;" />{client.attendance.late}{' '}
                        <X size={12} style="vertical-align:middle;" />{client.attendance.noShow}
                        {' · '}
                      </span>
                    )}
                    Последний визит: {client.lastVisit}
                  </div>
                </div>
              );
            })
          )}
        </>
      )}

      {/* Undo toast */}
      {undoClient && onChange && (
        <div class="toast" style="bottom:80px;">
          <span>Клиент «{undoClient.name}» удалён</span>
          <button class="toast-action" onClick={handleUndoDelete}>Отменить</button>
        </div>
      )}
    </div>
  );
}
