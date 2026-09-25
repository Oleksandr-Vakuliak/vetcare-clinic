// Formatting helpers for the pet account UI (locale-aware, no side effects).

import type { AccountDictionary, PluralForms } from '@/lib/i18n/account-types';
import { localeMeta, type Locale } from '@/lib/i18n/config';
import type { Appointment, AppointmentStatus, Pet, Text } from '@/lib/clinic/types';
import { parseISODate } from '@/lib/account/dates';
import { petAge } from '@/lib/account/age';
import { clinicToday } from '@/lib/clinic/time';

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

export function ownerName(pet: Pet, d: AccountDictionary): string {
  return resolveText(pet.owner, d.records.owners);
}

export function reasonText(reason: Text, d: AccountDictionary): string {
  return resolveText(reason, d.records.reasons);
}

export function doctorName(id: string, d: AccountDictionary): string {
  return d.records.doctors[id as keyof typeof d.records.doctors] ?? id;
}

export function statusLabel(status: AppointmentStatus, d: AccountDictionary): string {
  return d.records.statuses[status];
}

/** Pet name, owner and species label of an appointment (registered pet or site request). */
export function appointmentPet(
  appointment: Appointment,
  pets: Pet[],
  d: AccountDictionary,
): { pet: Pet | null; name: string; owner: string; species: string } {
  const pet = appointment.petId ? (pets.find((p) => p.id === appointment.petId) ?? null) : null;
  if (pet) {
    return { pet, name: petName(pet, d), owner: ownerName(pet, d), species: d.pets.species[pet.species] };
  }
  const guest = appointment.guest;
  return {
    pet: null,
    name: guest?.petName ?? '—',
    owner: guest?.ownerName ?? '—',
    species: guest ? (guest.species === 'other' ? d.records.otherSpecies : d.pets.species[guest.species]) : '—',
  };
}

function plural(forms: PluralForms, n: number, locale: Locale): string {
  const category = new Intl.PluralRules(localeMeta[locale].intl).select(n);
  const form = category in forms ? forms[category as keyof PluralForms] : forms.other;
  return fill(form, { n });
}

export function formatAge(birthDate: string, d: AccountDictionary, locale: Locale): string {
  const age = petAge(birthDate, clinicToday());
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
