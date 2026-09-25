// Formatting helpers for the admin panel (clinic dates are 'YYYY-MM-DD').

import { localeMeta, type Locale } from '@/lib/i18n/config';
import { parseISODate } from '@/lib/account/dates';

function capitalize(text: string, locale: Locale): string {
  return text.charAt(0).toLocaleUpperCase(localeMeta[locale].intl) + text.slice(1);
}

/** "Понеділок, 12 жовтня 2026" */
export function formatLongDate(iso: string, locale: Locale): string {
  const date = parseISODate(iso);
  if (!date) return iso;
  const parts = new Intl.DateTimeFormat(localeMeta[locale].intl, {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).formatToParts(date);
  const pick = (type: string) => parts.find((p) => p.type === type)?.value ?? '';
  const weekday = capitalize(pick('weekday'), locale);
  const rest = parts
    .filter((p) => p.type === 'day' || p.type === 'month' || p.type === 'year')
    .map((p) => p.value);
  // English puts the month first ("October 12, 2026"); keep the locale's order.
  const monthFirst = parts.findIndex((p) => p.type === 'month') < parts.findIndex((p) => p.type === 'day');
  const body = monthFirst ? `${rest[0]} ${rest[1]}, ${rest[2]}` : rest.join(' ');
  return `${weekday}, ${body}`;
}

/** "пт, 25 вер." — compact date for tables. */
export function formatShortDate(iso: string, locale: Locale): string {
  const date = parseISODate(iso);
  if (!date) return iso;
  return new Intl.DateTimeFormat(localeMeta[locale].intl, {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
  }).format(date);
}

/** "пт, 25 вер. · 10:00" */
export function formatWhen(iso: string, time: string, locale: Locale): string {
  return `${formatShortDate(iso, locale)} · ${time}`;
}

/** Monday-first weekday names, e.g. "Понеділок". */
export function weekdayNames(locale: Locale, style: 'long' | 'short' = 'long'): string[] {
  const fmt = new Intl.DateTimeFormat(localeMeta[locale].intl, { weekday: style });
  // 2024-01-01 is a Monday.
  return Array.from({ length: 7 }, (_, i) => capitalize(fmt.format(new Date(2024, 0, 1 + i)), locale));
}
