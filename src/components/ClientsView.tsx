
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

  const sortedClients = Array.from(clients.values()).sort((a, b) => b.totalVisits - a.totalVisits);

  const totalLessons = slots.reduce((sum, s) => {
    return sum + s.bookings.filter(b => b.status === 'confirmed').length;
  }, 0);

  const handleDeleteClient = (clientName: string) => {
    if (!onChange || !window.confirm(`Удалить клиента «${clientName}» из всех окон?`)) return;
    const data = JSON.parse(localStorage.getItem('timebox_data') || '{}');
    const updated = data.slots.map((s: Slot) => ({
      ...s,
      bookings: s.bookings.filter(b => !(b.status === 'confirmed' && b.name === clientName)),
    }));
    onChange({ ...data, slots: updated });
  };

  return (
    <div class="slot-list">
      {/* Stats */}
      <div style="display:flex;gap:8px;margin-bottom:8px;">
        <div class="diary-entry" style="flex:1;text-align:center;padding:12px;">
          <div style="font-size:24px;font-weight:700;">{clients.size}</div>
          <div style="font-size:12px;color:var(--text-secondary);">Клиентов</div>
        </div>
        <div class="diary-entry" style="flex:1;text-align:center;padding:12px;">
          <div style="font-size:24px;font-weight:700;">{totalLessons}</div>
          <div style="font-size:12px;color:var(--text-secondary);">Занятий</div>
        </div>
      </div>

      {sortedClients.length === 0 ? (
        <div class="empty-state">
          <div class="icon">👥</div>
          Пока нет клиентов<br />
          <span style="font-size:13px;">Добавьте клиента в слот, и он появится здесь</span>
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
                    <button class="btn btn-ghost btn-sm"
                      style="padding:2px 6px;font-size:14px;line-height:1;min-width:0;color:var(--text-secondary);"
                      onClick={() => handleDeleteClient(client.name)}
                      title="Удалить клиента">✕</button>
                  )}
                </div>
              </div>
              <div style="font-size:12px;color:var(--text-secondary);margin-top:2px;">
                {totalMarked > 0 && (
                  <span>
                    ✅{client.attendance.present} ⏰{client.attendance.late} ❌{client.attendance.noShow}
                    {' · '}
                  </span>
                )}
                Последний визит: {client.lastVisit}
              </div>
            </div>
          );
        })
      )}
    </div>
  );
}
