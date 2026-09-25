import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createSeed } from './seed.ts';
import { toISODate, addDays } from './dates.ts';
import { getSlotsForDate } from '../booking-data.ts';
import { addAppointment, addPet, documentsFor, nextAppointment, vaccinationsFor, visitsFor } from './state.ts';
import { loadState, saveState } from './storage.ts';
import type { StorageLike } from './storage.ts';

class FakeStorage implements StorageLike {
  private map = new Map<string, string>();
  getItem(key: string): string | null {
    return this.map.has(key) ? this.map.get(key)! : null;
  }
  setItem(key: string, value: string): void {
    this.map.set(key, value);
  }
  removeItem(key: string): void {
    this.map.delete(key);
  }
}

test('full flow: seed -> add pet -> book appointment -> persist -> reload', () => {
  const NOW = new Date(2026, 8, 25, 10, 0);
  const todayIso = toISODate(NOW);

  let state = createSeed(NOW);

  // Add a brand-new dog with no history.
  state = addPet(
    state,
    { name: 'Rex', species: 'dog', breed: null, birthDate: '2022-01-01', weightKg: 12 },
    'rex',
  );
  assert.equal(state.ui.petId, 'rex');
  assert.equal(visitsFor(state, 'rex').length, 0);
  assert.equal(vaccinationsFor(state, 'rex').length, 0);
  assert.equal(documentsFor(state, 'rex').length, 0);
  assert.equal(nextAppointment(state, 'rex', NOW), null);

  const murchykNextBefore = nextAppointment(state, 'murchyk', NOW);
  const lunaNextBefore = nextAppointment(state, 'luna', NOW);

  // Book an appointment for the new pet on a known-free slot.
  const futureDate = addDays(todayIso, 6);
  const freeSlot = getSlotsForDate(
    new Date(NOW.getFullYear(), NOW.getMonth(), NOW.getDate() + 6),
  ).find((s) => !s.busy);
  assert.ok(freeSlot);

  const booking = addAppointment(
    state,
    { petId: 'rex', date: futureDate, time: freeSlot!.time },
    NOW,
    'appt-rex-1',
  );
  assert.equal(booking.ok, true);
  if (!booking.ok) return;
  state = booking.state;

  const rexNext = nextAppointment(state, 'rex', NOW);
  assert.equal(rexNext?.id, 'appt-rex-1');

  // Other pets' upcoming appointments are unaffected.
  assert.deepEqual(nextAppointment(state, 'murchyk', NOW), murchykNextBefore);
  assert.deepEqual(nextAppointment(state, 'luna', NOW), lunaNextBefore);

  // Persist and reload.
  const storage = new FakeStorage();
  assert.equal(saveState(storage, state), true);
  const reloaded = loadState(storage, NOW);
  assert.equal(reloaded.source, 'stored');
  assert.deepEqual(reloaded.state, state);
});
