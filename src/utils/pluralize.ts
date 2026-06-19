/**
 * @fileoverview Utility functions for Russian pluralization rules.
 */

/**
 * Russian pluralization.
 * @example pluralize(1, 'место', 'места', 'мест') → 'место'
 * @example pluralize(2, 'место', 'места', 'мест') → 'места'
 * @example pluralize(5, 'место', 'места', 'мест') → 'мест'
 * @param n - The number to determine plural form for
 * @param t1 - Singular form (1, 21, 31...)
 * @param t2 - Few form (2-4, 22-24...)
 * @param t5 - Many form (0, 5-20, 25-30...)
 * @returns The appropriate plural form based on Russian grammar rules
 */
export function pluralize(n: number, t1: string, t2: string, t5: string): string {
  const mod10 = n % 10;
  const mod100 = n % 100;
  if (mod10 === 1 && mod100 !== 11) return t1;
  if (mod10 >= 2 && mod10 <= 4 && (mod100 < 10 || mod100 >= 20)) return t2;
  return t5;
}