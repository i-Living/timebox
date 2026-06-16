
export function today(): string {
  return new Date().toISOString().slice(0, 10);
}

export function formatDate(d: string): string {
  const [, m, day] = d.split('-');
  const months = ['янв','фев','мар','апр','мая','июн','июл','авг','сен','окт','ноя','дек'];
  return `${parseInt(day)} ${months[parseInt(m) - 1]}`;
}

export function formatDateFull(d: string): string {
  const parts = d.split('-').map(Number);
  const [y, m, day] = parts;
  const months = ['января','февраля','марта','апреля','мая','июня','июля','августа','сентября','октября','ноября','декабря'];
  const date = new Date(y, m - 1, day);
  const days = ['вс','пн','вт','ср','чт','пт','сб'];
  return `${days[date.getDay()]} ${day} ${months[m - 1]}`;
}

export function getWeekStart(d: string): string {
  const date = new Date(d);
  const day = date.getDay();
  const diff = day === 0 ? -6 : 1 - day; // Monday start
  date.setDate(date.getDate() + diff);
  return date.toISOString().slice(0, 10);
}

export function getWeekEnd(d: string): string {
  const start = getWeekStart(d);
  const date = new Date(start);
  date.setDate(date.getDate() + 6);
  return date.toISOString().slice(0, 10);
}

export function getWeekDays(startDate: string): string[] {
  const days: string[] = [];
  const cursor = new Date(startDate);
  for (let i = 0; i < 7; i++) {
    days.push(cursor.toISOString().slice(0, 10));
    cursor.setDate(cursor.getDate() + 1);
  }
  return days;
}

export function addDays(d: string, n: number): string {
  const date = new Date(d);
  date.setDate(date.getDate() + n);
  return date.toISOString().slice(0, 10);
}

export function isToday(d: string): boolean {
  return d === today();
}

export function dayName(d: string): string {
  const days = ['вс','пн','вт','ср','чт','пт','сб'];
  return days[new Date(d).getDay()];
}

export function dayOfMonth(d: string): number {
  return parseInt(d.split('-')[2]);
}

