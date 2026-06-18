/**
 * Russian pluralization.
 * @example pluralize(1, 'место', 'места', 'мест') → 'место'
 * @example pluralize(2, 'место', 'места', 'мест') → 'места'
 * @example pluralize(5, 'место', 'места', 'мест') → 'мест'
 */
export function pluralize(n: number, t1: string, t2: string, t5: string): string {
  const mod10 = n % 10;
  const mod100 = n % 100;
  if (mod10 === 1 && mod100 !== 11) return t1;
  if (mod10 >= 2 && mod10 <= 4 && (mod100 < 10 || mod100 >= 20)) return t2;
  return t5;
}
