// Local-time date helpers for the Pet account feature.
// IMPORTANT: never use `new Date('YYYY-MM-DD')` — that string form is parsed
// as UTC midnight by the spec, which shifts the calendar day in any
// timezone west of UTC. Everything here works with local date parts.

const ISO_DATE_RE = /^\d{4}-\d{2}-\d{2}$/;
const TIME_RE = /^\d{2}:\d{2}$/;

/** Formats a Date's LOCAL date parts as 'YYYY-MM-DD'. */
export function toISODate(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

/**
 * Strictly parses 'YYYY-MM-DD' into a local-midnight Date.
 * Returns null for malformed strings or calendar-invalid dates
 * (e.g. '2026-02-30', which JS Date would otherwise silently roll over).
 */
export function parseISODate(s: string): Date | null {
  if (!ISO_DATE_RE.test(s)) return null;
  const [yStr, mStr, dStr] = s.split('-');
  const y = Number(yStr);
  const m = Number(mStr);
  const day = Number(dStr);
  if (m < 1 || m > 12 || day < 1 || day > 31) return null;
  const date = new Date(y, m - 1, day);
  if (date.getFullYear() !== y || date.getMonth() !== m - 1 || date.getDate() !== day) {
    return null;
  }
  return date;
}

/** Adds `n` days (may be negative) to an ISO date string. */
export function addDays(iso: string, n: number): string {
  const d = parseISODate(iso);
  if (!d) throw new Error(`addDays: invalid ISO date "${iso}"`);
  const result = new Date(d.getFullYear(), d.getMonth(), d.getDate() + n);
  return toISODate(result);
}

/**
 * Adds `n` months (may be negative) to an ISO date string.
 * Clamps the day when the target month is shorter (e.g. Jan 31 + 1 month = Feb 28/29).
 */
export function addMonths(iso: string, n: number): string {
  const d = parseISODate(iso);
  if (!d) throw new Error(`addMonths: invalid ISO date "${iso}"`);
  const targetMonthIndex = d.getMonth() + n;
  const result = new Date(d.getFullYear(), targetMonthIndex, 1);
  const daysInTargetMonth = new Date(
    result.getFullYear(),
    result.getMonth() + 1,
    0,
  ).getDate();
  result.setDate(Math.min(d.getDate(), daysInTargetMonth));
  return toISODate(result);
}

/** Adds `n` years (may be negative) to an ISO date string. Handles Feb 29 on non-leap years. */
export function addYears(iso: string, n: number): string {
  const d = parseISODate(iso);
  if (!d) throw new Error(`addYears: invalid ISO date "${iso}"`);
  return addMonths(iso, n * 12);
}

/**
 * Compares two (date, time) pairs. Returns <0 if a before b, >0 if a after b, 0 if equal.
 * Invalid inputs sort as -Infinity/NaN-safe by throwing, since callers control these values internally.
 */
export function compareDateTime(
  aDate: string,
  aTime: string,
  bDate: string,
  bTime: string,
): number {
  const a = toDateTime(aDate, aTime);
  const b = toDateTime(bDate, bTime);
  return a - b;
}

function toDateTime(iso: string, time: string): number {
  const d = parseISODate(iso);
  if (!d) throw new Error(`toDateTime: invalid ISO date "${iso}"`);
  if (!TIME_RE.test(time)) throw new Error(`toDateTime: invalid time "${time}"`);
  const [hStr, minStr] = time.split(':');
  const h = Number(hStr);
  const min = Number(minStr);
  return new Date(d.getFullYear(), d.getMonth(), d.getDate(), h, min).getTime();
}
