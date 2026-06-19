/**
 * @fileoverview Week navigation strip with touch swipe support for changing weeks.
 * Displays 7 days with selection, today indicator, and slot availability.
 */

import { useRef } from 'preact/hooks';
import { getWeekDays, dayName, dayOfMonth, isToday } from '../utils/dates';

interface Props {
  weekStart: string;
  selectedDate: string;
  slotsByDate: Record<string, number>;
  onSelectDate: (d: string) => void;
  onPrevWeek: () => void;
  onNextWeek: () => void;
}

/**
 * Week navigation strip component.
 * @param props.weekStart - ISO date string representing the start of the week
 * @param props.selectedDate - Currently selected date
 * @param props.slotsByDate - Map of date strings to available slot counts
 * @param props.onSelectDate - Callback when a day is clicked
 * @param props.onPrevWeek - Callback to navigate to previous week
 * @param props.onNextWeek - Callback to navigate to next week
 */
export function WeekStrip({ weekStart, selectedDate, slotsByDate, onSelectDate, onPrevWeek, onNextWeek }: Props) {
  const days = getWeekDays(weekStart);
  const touchX = useRef(0);

  // Track horizontal swipe start position
  const handleTouchStart = (e: TouchEvent) => {
    touchX.current = e.touches[0].clientX;
  };

  // Detect swipe direction (50px threshold) and navigate weeks
  const handleTouchEnd = (e: TouchEvent) => {
    const dx = e.changedTouches[0].clientX - touchX.current;
    if (dx > 50) onPrevWeek();
    else if (dx < -50) onNextWeek();
  };

  return (
    <div onTouchStart={handleTouchStart} onTouchEnd={handleTouchEnd}>
      <div class="week-strip">
        {days.map(d => {
          const classes = ['week-day'];
          if (d === selectedDate) classes.push('active');
          if (isToday(d)) classes.push('today');
          if (slotsByDate[d] > 0) classes.push('has-slots');

          return (
            <button key={d} class={classes.join(' ')} onClick={() => onSelectDate(d)}>
              {dayName(d)}
              <span class="day-num">{dayOfMonth(d)}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}