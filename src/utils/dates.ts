/**
 * @fileoverview Date utility functions for formatting, week calculations, and comparisons.
 */

/**
 * Returns today's date as YYYY-MM-DD string.
 * @returns {string} Today's date string
 */
export function today(): string {
  const d = new Date();
  return d.getFullYear() + '-' +
    String(d.getMonth() + 1).padStart(2, '0') + '-' +
    String(d.getDate()).padStart(2, '0');
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
  const [y, m, day] = d.split('-').map(Number);
  const date = new Date(y, m - 1, day);
  const dow = date.getDay();
  const diff = dow === 0 ? -6 : 1 - dow; // Monday start
  date.setDate(date.getDate() + diff);
  return date.getFullYear() + '-' +
    String(date.getMonth() + 1).padStart(2, '0') + '-' +
    String(date.getDate()).padStart(2, '0');
}

/**
 * Returns the Sunday of the week containing the given date.
 * @param {string} d - Date string in YYYY-MM-DD format
 * @returns {string} Sunday date string
 */
export function getWeekEnd(d: string): string {
  const start = getWeekStart(d);
  const [y, m, day] = start.split('-').map(Number);
  const date = new Date(y, m - 1, day);
  date.setDate(date.getDate() + 6);
  return date.getFullYear() + '-' +
    String(date.getMonth() + 1).padStart(2, '0') + '-' +
    String(date.getDate()).padStart(2, '0');
}

/**
 * Returns an array of 7 date strings starting from the given date.
 * @param {string} startDate - Starting date in YYYY-MM-DD format
 * @returns {string[]} Array of 7 date strings
 */
export function getWeekDays(startDate: string): string[] {
  const days: string[] = [];
  const [y, m, day] = startDate.split('-').map(Number);
  const cursor = new Date(y, m - 1, day);
  for (let i = 0; i < 7; i++) {
    days.push(
      cursor.getFullYear() + '-' +
      String(cursor.getMonth() + 1).padStart(2, '0') + '-' +
      String(cursor.getDate()).padStart(2, '0')
    );
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
  const [y, m, day] = d.split('-').map(Number);
  const date = new Date(y, m - 1, day);
  date.setDate(date.getDate() + n);
  return date.getFullYear() + '-' +
    String(date.getMonth() + 1).padStart(2, '0') + '-' +
    String(date.getDate()).padStart(2, '0');
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
  const [y, m, day] = d.split('-').map(Number);
  const days = ['вс','пн','вт','ср','чт','пт','сб'];
  return days[new Date(y, m - 1, day).getDay()];
}

/**
 * Extracts the day of month from a date string.
 * @param {string} d - Date string in YYYY-MM-DD format
 * @returns {number} Day of month (1-31)
 */
export function dayOfMonth(d: string): number {
  return parseInt(d.split('-')[2]);
}