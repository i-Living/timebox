
import { getWeekDays, dayName, dayOfMonth, isToday } from '../utils/dates';

interface Props {
  weekStart: string;
  selectedDate: string;
  slotsByDate: Record<string, number>;
  onSelectDate: (d: string) => void;
  onPrevWeek: () => void;
  onNextWeek: () => void;
}

export function WeekStrip({ weekStart, selectedDate, slotsByDate, onSelectDate, onPrevWeek, onNextWeek }: Props) {
  const days = getWeekDays(weekStart);

  const months = ['янв','фев','мар','апр','мая','июн','июл','авг','сен','окт','ноя','дек'];
  const startM = parseInt(weekStart.split('-')[1]) - 1;
  const endM = parseInt(days[6].split('-')[1]) - 1;
  const label = startM === endM
    ? `${months[startM]} ${weekStart.split('-')[0]}`
    : `${months[startM]} – ${months[endM]} ${days[6].split('-')[0]}`;

  return (
    <div>
      <div class="week-nav">
        <button onClick={onPrevWeek}>‹ Назад</button>
        <span>{label}</span>
        <button onClick={onNextWeek}>Вперёд ›</button>
      </div>
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
