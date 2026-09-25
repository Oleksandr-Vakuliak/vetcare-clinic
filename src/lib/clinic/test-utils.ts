// Shared helpers for the clinic model tests (not used by the app).

import { defaultSchedules } from './seed.ts';
import type { ClinicNow } from './time.ts';
import type { DemoState } from './types.ts';
import type { StorageLike } from './storage.ts';

/** Friday, 25 September 2026, 10:00 clinic time. */
export const NOW: ClinicNow = { date: '2026-09-25', time: '10:00' };

/** Minimal model: the default schedule, two account pets, no appointments. */
export function emptyState(): DemoState {
  const pet = (id: string, species: 'cat' | 'dog') => ({
    id,
    name: { key: id },
    species,
    breed: null,
    birthDate: '2022-01-01',
    weightKg: 5,
    photo: null,
    owner: { key: 'anna' },
    inAccount: true,
  });
  return {
    version: 2,
    seededAt: NOW.date,
    pets: [pet('murchyk', 'cat'), pet('luna', 'dog')],
    appointments: [],
    vaccinations: [],
    documents: [],
    schedules: defaultSchedules(),
    closedSlots: [],
    ui: { petId: 'murchyk', tab: 'visits' },
  };
}

export class FakeStorage implements StorageLike {
  map = new Map<string, string>();
  getItem(key: string): string | null {
    return this.map.has(key) ? (this.map.get(key) as string) : null;
  }
  setItem(key: string, value: string): void {
    this.map.set(key, value);
  }
  removeItem(key: string): void {
    this.map.delete(key);
  }
}
