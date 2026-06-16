import type { OrganizerData } from '../types';

interface Props {
  data: OrganizerData;
  onChange: (data: OrganizerData) => void;
}

const DAY_LABELS = ['Вс', 'Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб'];
const DURATION_PRESETS = [30, 45, 60, 90, 120];

export function SettingsView({ data, onChange }: Props) {
  const update = (patch: Partial<OrganizerData>) => onChange({ ...data, ...patch });

  const toggleDay = (day: number) => {
    const has = data.workingDays.includes(day);
    const days = has
      ? data.workingDays.filter(d => d !== day)
      : [...data.workingDays, day].sort();
    update({ workingDays: days });
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

      {/* About */}
      <div class="settings-section" style="text-align:center;font-size:13px;color:var(--text-secondary);">
        TimeBox v0.1<br />
        Данные хранятся только в этом браузере
      </div>
    </div>
  );
}
