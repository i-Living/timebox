
import { useState } from 'preact/hooks';
import { Clipboard, Share2, RefreshCw } from 'lucide-react';
import { Button } from './Button';
import type { Slot } from '../types';
import { getFreeSlots } from '../store';
import { today, addDays, formatDateFull } from '../utils/dates';
import { pluralize } from '../utils/pluralize';

interface Props {
  slots: Slot[];
  onClose: () => void;
}

export function ShareDialog({ slots, onClose }: Props) {
  const [fromDate, setFromDate] = useState(today());
  const [toDate, setToDate] = useState(addDays(today(), 7));
  const [shareText, setShareText] = useState('');
  const [copied, setCopied] = useState(false);

  const freeSlots = getFreeSlots(slots, fromDate, toDate);

  const generateText = () => {
    const lines: string[] = [];
    lines.push('📅 Свободные окна:');
    lines.push('');

    // Group free slots by date
    const byDate: Record<string, typeof freeSlots> = {};
    for (const s of freeSlots) {
      if (!byDate[s.date]) byDate[s.date] = [];
      byDate[s.date].push(s);
    }

    const sortedDates = Object.keys(byDate).sort();
    for (const date of sortedDates) {
      lines.push(formatDateFull(date));
      for (const s of byDate[date]) {
        const remaining = s.bookings.filter(b => b.status === 'confirmed').length;
        const free = s.capacity - remaining;
        if (s.capacity > 1) {
          lines.push('  ' + s.start + '–' + s.end + ' — ' + free + ' ' + pluralize(free, 'место', 'места', 'мест'));
        } else {
          lines.push('  ' + s.start + '–' + s.end);
        }
      }
      lines.push('');
    }

    if (sortedDates.length === 0) {
      lines.push('Нет свободных окон.');
    }
    setShareText(lines.join('\n'));
  };

  const copyText = async () => {
    await navigator.clipboard.writeText(shareText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleShare = async () => {
    if (navigator.share) {
      await navigator.share({ text: shareText });
    } else {
      copyText();
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

        {!shareText && (
          <>
            <div style="font-size:14px;color:var(--text-secondary);">
              Свободных окон: <strong>{freeSlots.length}</strong>
            </div>

            {freeSlots.length > 0 && (
              <div style="max-height:150px;overflow-y:auto;display:flex;flex-direction:column;gap:4px;">
                {freeSlots.map(s => (
                  <div key={s.id} style="font-size:13px;padding:6px 8px;background:var(--bg);border-radius:6px;">
                    {formatDateFull(s.date)} {s.start}–{s.end}
                    {s.capacity > 1 && <span style="color:var(--text-secondary);"> ({s.capacity - s.bookings.filter(b=>b.status==='confirmed').length} {pluralize(s.capacity - s.bookings.filter(b=>b.status==='confirmed').length, 'место', 'места', 'мест')})</span>}
                  </div>
                ))}
              </div>
            )}

            {freeSlots.length === 0 && (
              <div style="text-align:center;padding:20px;color:var(--text-secondary);">
                Нет свободных окон в этом диапазоне
              </div>
            )}

            <Button block onClick={generateText} disabled={freeSlots.length === 0}>
              <Clipboard size={16} style="vertical-align:middle;margin-right:4px;" /> Сгенерировать текст
            </Button>
          </>
        )}

        {shareText && (
          <>
            <div style="margin:12px 0;">
              <textarea class="form-input" rows={Math.min(freeSlots.length + 6, 14)}
                value={shareText} readOnly
                style="font-size:13px;line-height:1.5;resize:none;background:var(--bg);"
                onClick={e => (e.target as HTMLTextAreaElement).select()}
              />
            </div>
            <div style="display:flex;gap:8px;">
              <Button block onClick={copyText} style="flex:1;">
                {copied ? '✓ Скопировано!' : 'Копировать текст'}
              </Button>
              {typeof navigator.share !== 'undefined' && (
                <Button variant="outline" onClick={handleShare} style="flex-shrink:0;padding:12px 16px;">
                  <Share2 size={16} style="vertical-align:middle;margin-right:4px;" /> Поделиться
                </Button>
              )}
            </div>
            <Button variant="ghost" block onClick={() => setShareText('')}>
              <RefreshCw size={16} style="vertical-align:middle;margin-right:4px;" /> Сгенерировать заново
            </Button>
          </>
        )}

        <Button variant="ghost" onClick={onClose} style="margin-top:8px;">Закрыть</Button>
      </div>
    </div>
  );
}
