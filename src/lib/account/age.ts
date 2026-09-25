import { parseISODate } from './dates.ts';

/**
 * Full years and remaining full months between a birth date and `today`.
 * Returns null when `birthISO` is invalid or in the future.
 */
export function petAge(birthISO: string, today: Date): { years: number; months: number } | null {
  const birth = parseISODate(birthISO);
  if (!birth) return null;

  const t = new Date(today.getFullYear(), today.getMonth(), today.getDate());
  if (birth.getTime() > t.getTime()) return null;

  let years = t.getFullYear() - birth.getFullYear();
  let months = t.getMonth() - birth.getMonth();
  const dayDiff = t.getDate() - birth.getDate();

  if (dayDiff < 0) {
    months -= 1;
  }
  if (months < 0) {
    years -= 1;
    months += 12;
  }

  return { years, months };
}
