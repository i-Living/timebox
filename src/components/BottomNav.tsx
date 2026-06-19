/**
 * @fileoverview Bottom navigation bar with four tabs: calendar, clients, diary, settings.
 * Highlights the active tab and calls onSelect when a tab is clicked.
 */

import { Calendar, Users, BookOpen, Settings } from 'lucide-react';

interface Props {
  active: 'calendar' | 'clients' | 'diary' | 'settings';
  onSelect: (tab: 'calendar' | 'clients' | 'diary' | 'settings') => void;
}

/**
 * Bottom navigation component for switching between main app sections.
 * @param {Props} props - Component props
 * @param {string} props.active - Currently active tab identifier
 * @param {function} props.onSelect - Callback fired when a tab is selected
 */
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