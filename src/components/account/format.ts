// Formatting helpers for the pet account UI (locale-aware, no side effects).

import type { AccountDictionary, PluralForms } from '@/lib/i18n/account-types';
import { localeMeta, type Locale } from '@/lib/i18n/config';
import type { Pet, Text } from '@/lib/account/types';
import { parseISODate } from '@/lib/account/dates';
import { petAge } from '@/lib/account/age';

/** Replace {placeholders} in a translated string. */
export function fill(template: string, vars: Record<string, string | number>): string {
  return template.replace(/\{(\w+)\}/g, (match, key: string) =>
    key in vars ? String(vars[key]) : match,
  );
}

/** Seed records store dictionary keys; user input is plain text. */
export function resolveText(text: Text, group: Record<string, string>): string {
  return 'key' in text ? (group[text.key] ?? text.key) : text.text;
}

export function petName(pet: Pet, d: AccountDictionary): string {
  return resolveText(pet.name, d.records.names);
}

export function petBreed(pet: Pet, d: AccountDictionary): string | null {
  return pet.breed ? resolveText(pet.breed, d.records.breeds) : null;
}

function plural(forms: PluralForms, n: number, locale: Locale): string {
  const category = new Intl.PluralRules(localeMeta[locale].intl).select(n);
  const form = category in forms ? forms[category as keyof PluralForms] : forms.other;
  return fill(form, { n });
}

export function formatAge(birthDate: string, d: AccountDictionary, locale: Locale): string {
  const age = petAge(birthDate, new Date());
  if (!age) return '—';
  if (age.years > 0) return plural(d.pets.age.years, age.years, locale);
  if (age.months > 0) return plural(d.pets.age.months, age.months, locale);
  return d.pets.age.lessThanMonth;
}

export function formatWeight(kg: number, locale: Locale): string {
  return new Intl.NumberFormat(localeMeta[locale].intl, { maximumFractionDigits: 1 }).format(kg);
}

/** "12 жовтня" */
export function formatDayMonth(iso: string, locale: Locale): string {
  const date = parseISODate(iso);
  if (!date) return iso;
  return new Intl.DateTimeFormat(localeMeta[locale].intl, { day: 'numeric', month: 'long' }).format(
    date,
  );
}

/** "15 вересня 2026" — day, month and year only (no "р." suffix). */
export function formatDate(iso: string, locale: Locale): string {
  const date = parseISODate(iso);
  if (!date) return iso;
  return new Intl.DateTimeFormat(localeMeta[locale].intl, {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })
    .formatToParts(date)
    .filter((part) => part.type === 'day' || part.type === 'month' || part.type === 'year')
    .map((part) => part.value)
    .join(' ');
}
