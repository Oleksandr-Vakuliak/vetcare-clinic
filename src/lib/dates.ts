import { localeMeta, type Locale } from './i18n/config';

// All date formatting goes through Intl with the locale's BCP-47 tag, so
// month names, weekday names and full dates are localized automatically.

export function formatMonthYear(date: Date, locale: Locale): string {
  return new Intl.DateTimeFormat(localeMeta[locale].intl, {
    month: 'long',
    year: 'numeric',
  }).format(date);
}

export function formatFullDate(date: Date, locale: Locale): string {
  return new Intl.DateTimeFormat(localeMeta[locale].intl, {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(date);
}

/** Monday-first short weekday names for the calendar header. */
export function weekdayShortNames(locale: Locale): string[] {
  const fmt = new Intl.DateTimeFormat(localeMeta[locale].intl, { weekday: 'short' });
  // 2024-01-01 is a Monday — build seven consecutive days from it.
  return Array.from({ length: 7 }, (_, i) =>
    fmt.format(new Date(Date.UTC(2024, 0, 1 + i))),
  );
}

/** Days in a month, laid out Monday-first with leading nulls for padding. */
export function buildMonthGrid(year: number, month: number): Array<Date | null> {
  const first = new Date(year, month, 1);
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  // JS getDay(): 0=Sun..6=Sat -> convert to Monday-first offset 0..6.
  const leading = (first.getDay() + 6) % 7;
  const cells: Array<Date | null> = Array.from({ length: leading }, () => null);
  for (let d = 1; d <= daysInMonth; d += 1) {
    cells.push(new Date(year, month, d));
  }
  return cells;
}

/** True if `date` is strictly before today (local midnight). */
export function isPastDate(date: Date, today: Date): boolean {
  const a = new Date(date.getFullYear(), date.getMonth(), date.getDate());
  const b = new Date(today.getFullYear(), today.getMonth(), today.getDate());
  return a.getTime() < b.getTime();
}

export function isSameDay(a: Date, b: Date): boolean {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}
