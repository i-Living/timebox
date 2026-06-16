import type { OrganizerData } from '../types';
import { useState, useEffect } from 'preact/hooks';
import { getStoredToken, clearToken, connectGoogleCalendar } from '../utils/gcal';

interface Props {
  data: OrganizerData;
  onChange: (data: OrganizerData) => void;
}

const DAY_LABELS = ['Вс', 'Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб'];
const DURATION_PRESETS = [30, 45, 60, 90, 120];

const GCAL_CLIENT_ID_KEY = 'timebox_gcal_client_id';

function getSavedClientId(): string {
  const envId = import.meta.env.VITE_GOOGLE_CLIENT_ID || '';
  return localStorage.getItem(GCAL_CLIENT_ID_KEY) || envId;
}

export function SettingsView({ data, onChange }: Props) {
  const update = (patch: Partial<OrganizerData>) => onChange({ ...data, ...patch });

  const toggleDay = (day: number) => {
    const has = data.workingDays.includes(day);
    const days = has
      ? data.workingDays.filter(d => d !== day)
      : [...data.workingDays, day].sort();
    update({ workingDays: days });
  };

  // Google Calendar state
  const [gcalConnected, setGcalConnected] = useState(false);
  const [gcalEmail, setGcalEmail] = useState('');
  const [gcalLoading, setGcalLoading] = useState(false);
  const [gcalError, setGcalError] = useState('');

  useEffect(() => {
    const token = getStoredToken();
    if (token) {
      setGcalConnected(true);
      if (token.email) setGcalEmail(token.email);
    }
  }, []);

  const handleConnect = async () => {
    const clientId = getSavedClientId();
    if (!clientId) {
      setGcalError('Client ID не настроен');
      return;
    }
    setGcalLoading(true);
    setGcalError('');
    try {
      const token = await connectGoogleCalendar(clientId);
      setGcalConnected(true);
      if (token.email) setGcalEmail(token.email);
    } catch (e: any) {
      setGcalError(e.message || 'Ошибка подключения');
    } finally {
      setGcalLoading(false);
    }
  };

  const handleDisconnect = () => {
    clearToken();
    setGcalConnected(false);
    setGcalEmail('');
  };

  return (
    <div class="slot-list">
      {/* Name */}
      <div class="settings-section">
        <h3>Имя организатора</h3>
        <input
          class="form-input"
          type="text"
          value={data.organizerName}
          onInput={e => update({ organizerName: e.currentTarget.value })}
          placeholder="Ваше имя или название"
        />
        <div style="font-size:12px;color:var(--text-secondary);margin-top:4px;">
          Будет показано клиентам в ссылке
        </div>
      </div>

      {/* Working hours */}
      <div class="settings-section">
        <h3>Рабочие часы</h3>
        <div class="form-row">
          <div class="form-group">
            <label class="form-label">Начало</label>
            <input
              class="form-input"
              type="time"
              value={data.workingHoursStart}
              onInput={e => update({ workingHoursStart: e.currentTarget.value })}
            />
          </div>
          <div class="form-group">
            <label class="form-label">Конец</label>
            <input
              class="form-input"
              type="time"
              value={data.workingHoursEnd}
              onInput={e => update({ workingHoursEnd: e.currentTarget.value })}
            />
          </div>
        </div>
      </div>

      {/* Working days */}
      <div class="settings-section">
        <h3>Рабочие дни</h3>
        <div style="display:flex;gap:4px;flex-wrap:wrap;">
          {DAY_LABELS.map((label, i) => {
            const active = data.workingDays.includes(i);
            return (
              <button
                key={i}
                class={`btn btn-sm ${active ? 'btn-primary' : 'btn-outline'}`}
                onClick={() => toggleDay(i)}
                style="min-width:44px;"
              >
                {label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Default duration */}
      <div class="settings-section">
        <h3>Длительность по умолчанию</h3>
        <div style="display:flex;gap:4px;flex-wrap:wrap;">
          {DURATION_PRESETS.map(dur => (
            <button
              key={dur}
              class={`btn btn-sm ${data.defaultSlotDuration === dur ? 'btn-primary' : 'btn-outline'}`}
              onClick={() => update({ defaultSlotDuration: dur })}
              style="min-width:44px;"
            >
              {dur} мин
            </button>
          ))}
        </div>
        <div class="form-row" style="margin-top:8px;">
          <div class="form-group">
            <label class="form-label">Своё значение (мин)</label>
            <input
              class="form-input"
              type="number"
              min="5"
              max="480"
              step="5"
              value={data.defaultSlotDuration}
              onInput={e => update({ defaultSlotDuration: parseInt(e.currentTarget.value) || 60 })}
            />
          </div>
        </div>
      </div>

      {/* Google Calendar */}
      <div class="settings-section">
        <h3>Google Календарь</h3>

        {!gcalConnected && (
          <>
            <div style="font-size:13px;color:var(--text-secondary);margin-bottom:12px;">
              При подтверждении брони событие будет автоматически создано в вашем Google Календаре
            </div>
            {gcalError && (
              <div style="font-size:13px;color:var(--danger);margin-bottom:8px;">{gcalError}</div>
            )}
            <button class="btn btn-primary btn-block" onClick={handleConnect} disabled={gcalLoading}>
              {gcalLoading ? 'Подключение...' : '🔗 Подключить Google Календарь'}
            </button>
          </>
        )}

        {gcalConnected && (
          <>
            <div style="display:flex;align-items:center;gap:8px;padding:8px 0;">
              <span style="font-size:18px;">✅</span>
              <span style="font-size:14px;">{gcalEmail || 'Подключен'}</span>
            </div>
            <div style="font-size:12px;color:var(--text-secondary);margin-bottom:8px;">
              События создаются автоматически при подтверждении брони
            </div>
            <button class="btn btn-outline btn-block btn-sm" onClick={handleDisconnect}>
              Отключить
            </button>
          </>
        )}
      </div>

      {/* About */}
      <div class="settings-section" style="text-align:center;font-size:13px;color:var(--text-secondary);">
        TimeBox v0.1<br />
        Данные хранятся только в этом браузере
      </div>
    </div>
  );
}
