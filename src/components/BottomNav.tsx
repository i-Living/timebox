interface Props {
  active: 'calendar' | 'diary' | 'settings';
  onSelect: (tab: 'calendar' | 'diary' | 'settings') => void;
}

export function BottomNav({ active, onSelect }: Props) {
  return (
    <div class="bottom-nav">
      <button class={`nav-item ${active === 'calendar' ? 'active' : ''}`} onClick={() => onSelect('calendar')}>
        <span class="nav-icon">📅</span>
        Календарь
      </button>
      <button class={`nav-item ${active === 'diary' ? 'active' : ''}`} onClick={() => onSelect('diary')}>
        <span class="nav-icon">📓</span>
        Дневник
      </button>
      <button class={`nav-item ${active === 'settings' ? 'active' : ''}`} onClick={() => onSelect('settings')}>
        <span class="nav-icon">⚙️</span>
        Настройки
      </button>
    </div>
  );
}
