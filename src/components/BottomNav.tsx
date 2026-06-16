
interface Props {
  active: 'calendar' | 'diary';
  onSelect: (tab: 'calendar' | 'diary') => void;
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
    </div>
  );
}
