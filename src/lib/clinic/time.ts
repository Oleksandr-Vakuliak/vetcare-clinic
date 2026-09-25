// Clinic time. Every date and time in the demo model is a wall-clock value in the
// clinic's time zone (Europe/Bucharest), stored as 'YYYY-MM-DD' and 'HH:MM'.
// "Now" is converted with Intl, so the visitor's own time zone never shifts a slot.

import { parseISODate } from '../account/dates.ts';
import { CLINIC_TIME_ZONE } from './config.ts';

export interface ClinicNow {
  /** Clinic calendar date, 'YYYY-MM-DD'. */
  date: string;
  /** Clinic wall-clock time, 'HH:MM'. */
  time: string;
}

const TIME_RE = /^([01]\d|2[0-3]):[0-5]\d$/;

export function isTime(value: unknown): value is string {
  return typeof value === 'string' && TIME_RE.test(value);
}

/** The current date and time in the clinic's time zone. */
export function clinicNow(instant: Date = new Date(), timeZone: string = CLINIC_TIME_ZONE): ClinicNow {
  const parts = new Intl.DateTimeFormat('en-GB', {
    timeZone,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    hourCycle: 'h23',
  }).formatToParts(instant);
  const get = (type: Intl.DateTimeFormatPartTypes) =>
    parts.find((part) => part.type === type)?.value ?? '00';
  return {
    date: `${get('year')}-${get('month')}-${get('day')}`,
    time: `${get('hour')}:${get('minute')}`,
  };
}

/** A clinic date as a local-midnight Date, for calendar arithmetic and Intl formatting. */
export function clinicToday(now: ClinicNow = clinicNow()): Date {
  return parseISODate(now.date) as Date;
}

export function toMinutes(time: string): number {
  const [h, m] = time.split(':').map(Number);
  return h * 60 + m;
}

export function fromMinutes(minutes: number): string {
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
}

/** Sortable key: 'YYYY-MM-DDTHH:MM'. */
export function dateTimeKey(date: string, time: string): string {
  return `${date}T${time}`;
}

export function nowKey(now: ClinicNow): string {
  return dateTimeKey(now.date, now.time);
}

/** True when the slot has already started (clinic time). */
export function hasStarted(date: string, time: string, now: ClinicNow): boolean {
  return dateTimeKey(date, time) <= nowKey(now);
}

/** Monday-first weekday index 0..6 of an ISO date (calendar arithmetic, zone-free). */
export function weekdayIndex(iso: string): number {
  const d = parseISODate(iso);
  if (!d) throw new Error(`weekdayIndex: invalid ISO date "${iso}"`);
  return (d.getDay() + 6) % 7;
}
