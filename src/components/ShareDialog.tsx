
import { useState } from 'preact/hooks';
import type { Slot } from '../types';
import { getFreeSlots } from '../store';
import { today, addDays, formatDateFull } from '../utils/dates';
import { encodeSharePayload, buildSharePayload } from '../utils/url';

interface Props {
  organizerName: string;
  slots: Slot[];
  onClose: () => void;
}

export function ShareDialog({ organizerName, slots, onClose }: Props) {
  const [fromDate, setFromDate] = useState(today());
  const [toDate, setToDate] = useState(addDays(today(), 7));
  const [link, setLink] = useState('');
  const [copied, setCopied] = useState(false);

  const freeSlots = getFreeSlots(slots, fromDate, toDate);

  const generateLink = () => {
    const payload = buildSharePayload(organizerName, freeSlots);
    const fullUrl = window.location.origin + window.location.pathname + encodeSharePayload(payload);
    setLink(fullUrl);
  };

  const copyLink = async () => {
    await navigator.clipboard.writeText(link);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const shareNative = async () => {
    if (navigator.share) {
      await navigator.share({ title: 'TimeBox – свободные окна', text: link, url: link });
    } else {
      copyLink();
    }
  };

  return (
    <div class="modal-overlay" onClick={onClose}>
      <div class="modal-sheet" onClick={e => e.stopPropagation()}>
        <h2>Поделиться окнами</h2>

        <div class="form-row">
          <div class="form-group">
            <label class="form-label">С</label>
            <input class="form-input" type="date" value={fromDate} onInput={e => setFromDate(e.currentTarget.value)} />
          </div>
          <div class="form-group">
            <label class="form-label">По</label>
            <input class="form-input" type="date" value={toDate} onInput={e => setToDate(e.currentTarget.value)} />
          </div>
        </div>

        {!link && (
          <>
            <div style="font-size:14px;color:var(--text-secondary);">
              Свободных окон: <strong>{freeSlots.length}</strong>
            </div>

            {freeSlots.length > 0 && (
              <div style="max-height:150px;overflow-y:auto;display:flex;flex-direction:column;gap:4px;">
                {freeSlots.map(s => (
                  <div key={s.id} style="font-size:13px;padding:6px 8px;background:var(--bg);border-radius:6px;">
                    {formatDateFull(s.date)} {s.start}–{s.end}
                    {s.capacity > 1 && <span style="color:var(--text-secondary);"> ({s.capacity - s.bookings.filter(b=>b.status==='confirmed').length} мест)</span>}
                  </div>
                ))}
              </div>
            )}

            {freeSlots.length === 0 && (
              <div style="text-align:center;padding:20px;color:var(--text-secondary);">
                Нет свободных окон в этом диапазоне
              </div>
            )}

            <button class="btn btn-primary btn-block" onClick={generateLink} disabled={freeSlots.length === 0}>
              Сгенерировать ссылку
            </button>
          </>
        )}

        {link && (
          <>
            <div class="share-link-box">{link}</div>
            <button class="btn btn-primary btn-block" onClick={copyLink}>
              {copied ? '✓ Скопировано!' : '📋 Копировать ссылку'}
            </button>
            <button class="btn btn-outline btn-block" onClick={shareNative}>
              📱 Поделиться
            </button>
            <button class="btn btn-ghost btn-block" onClick={() => setLink('')}>
              ↻ Сгенерировать заново
            </button>
          </>
        )}

        <button class="btn btn-ghost" onClick={onClose} style="margin-top:8px;">Закрыть</button>
      </div>
    </div>
  );
}
