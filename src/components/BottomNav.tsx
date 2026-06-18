import { Calendar, Users, BookOpen, Settings } from 'lucide-react';

interface Props {
  active: 'calendar' | 'clients' | 'diary' | 'settings';
  onSelect: (tab: 'calendar' | 'clients' | 'diary' | 'settings') => void;
}

export function BottomNav({ active, onSelect }: Props) {
  return (
    <div class="bottom-nav">
      <button class={`nav-item ${active === 'calendar' ? 'active' : ''}`} onClick={() => onSelect('calendar')}>
        <span class="nav-icon"><Calendar size={20} /></span>
        Календарь
      </button>
      <button class={`nav-item ${active === 'clients' ? 'active' : ''}`} onClick={() => onSelect('clients')}>
        <span class="nav-icon"><Users size={20} /></span>
        Клиенты
      </button>
      <button class={`nav-item ${active === 'diary' ? 'active' : ''}`} onClick={() => onSelect('diary')}>
        <span class="nav-icon"><BookOpen size={20} /></span>
        Дневник
      </button>
      <button class={`nav-item ${active === 'settings' ? 'active' : ''}`} onClick={() => onSelect('settings')}>
        <span class="nav-icon"><Settings size={20} /></span>
        Настройки
      </button>
    </div>
  );
}
