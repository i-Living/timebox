/**
 * @fileoverview Date utility functions for formatting, week calculations, and comparisons.
 */

/**
 * Returns today's date as YYYY-MM-DD string.
 * @returns {string} Today's date string
 */
export function today(): string {
  return new Date().toISOString().slice(0, 10);
}

/**
 * Formats a date string to short Russian format (e.g., "5 мар").
 * @param {string} d - Date string in YYYY-MM-DD format
 * @returns {string} Formatted date string
 */
export function formatDate(d: string): string {
  const [, m, day] = d.split('-');
  const months = ['янв','фев','мар','апр','мая','июн','июл','авг','сен','окт','ноя','дек'];
  return `${parseInt(day)} ${months[parseInt(m) - 1]}`;
}

/**
 * Formats a date string to full Russian format with weekday (e.g., "пн 5 марта").
 * @param {string} d - Date string in YYYY-MM-DD format
 * @returns {string} Formatted date string with weekday
 */
export function formatDateFull(d: string): string {
  const parts = d.split('-').map(Number);
  const [y, m, day] = parts;
  const months = ['января','февраля','марта','апреля','мая','июня','июля','августа','сентября','октября','ноября','декабря'];
  const date = new Date(y, m - 1, day);
  const days = ['вс','пн','вт','ср','чт','пт','сб'];
  return `${days[date.getDay()]} ${day} ${months[m - 1]}`;
}

/**
 * Returns the Monday of the week containing the given date.
 * @param {string} d - Date string in YYYY-MM-DD format
 * @returns {string} Monday date string
 */
export function getWeekStart(d: string): string {
  const date = new Date(d);
  const day = date.getDay();
  const diff = day === 0 ? -6 : 1 - day; // Monday start
  date.setDate(date.getDate() + diff);
  return date.toISOString().slice(0, 10);
}

/**
 * Returns the Sunday of the week containing the given date.
 * @param {string} d - Date string in YYYY-MM-DD format
 * @returns {string} Sunday date string
 */
export function getWeekEnd(d: string): string {
  const start = getWeekStart(d);
  const date = new Date(start);
  date.setDate(date.getDate() + 6);
  return date.toISOString().slice(0, 10);
}

/**
 * Returns an array of 7 date strings starting from the given date.
 * @param {string} startDate - Starting date in YYYY-MM-DD format
 * @returns {string[]} Array of 7 date strings
 */
export function getWeekDays(startDate: string): string[] {
  const days: string[] = [];
  const cursor = new Date(startDate);
  for (let i = 0; i < 7; i++) {
    days.push(cursor.toISOString().slice(0, 10));
    cursor.setDate(cursor.getDate() + 1);
  }
  return days;
}

/**
 * Adds n days to a date string.
 * @param {string} d - Date string in YYYY-MM-DD format
 * @param {number} n - Number of days to add (can be negative)
 * @returns {string} Resulting date string
 */
export function addDays(d: string, n: number): string {
  const date = new Date(d);
  date.setDate(date.getDate() + n);
  return date.toISOString().slice(0, 10);
}

/**
 * Checks if a date string represents today.
 * @param {string} d - Date string in YYYY-MM-DD format
 * @returns {boolean} True if the date is today
 */
export function isToday(d: string): boolean {
  return d === today();
}

/**
 * Returns the Russian weekday name for a given date.
 * @param {string} d - Date string in YYYY-MM-DD format
 * @returns {string} Russian weekday abbreviation
 */
export function dayName(d: string): string {
  const days = ['вс','пн','вт','ср','чт','пт','сб'];
  return days[new Date(d).getDay()];
}

/**
 * Extracts the day of month from a date string.
 * @param {string} d - Date string in YYYY-MM-DD format
 * @returns {number} Day of month (1-31)
 */
export function dayOfMonth(d: string): number {
  return parseInt(d.split('-')[2]);
}