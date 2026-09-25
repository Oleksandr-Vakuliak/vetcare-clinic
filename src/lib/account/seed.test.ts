import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createSeed } from './seed.ts';
import { isAccountState } from './storage.ts';
import { nextAppointment, nextVaccination, upcomingAppointments } from './state.ts';
import { toISODate } from './dates.ts';

const TODAY_CASES = [
  new Date(2026, 8, 25, 10, 0),
  new Date(2026, 0, 1, 0, 0),
  new Date(2027, 11, 31, 23, 59),
  new Date(2026, 1, 28, 10, 0), // near a leap-year boundary
];

for (const today of TODAY_CASES) {
  test(`seed produces a valid AccountState for today=${toISODate(today)}`, () => {
    const seed = createSeed(today);
    assert.equal(isAccountState(seed), true);
  });

  test(`seed's upcoming appointments and next vaccinations are strictly in the future for today=${toISODate(today)}`, () => {
    const seed = createSeed(today);
    for (const pet of seed.pets) {
      const appt = nextAppointment(seed, pet.id, today);
      assert.ok(appt, `expected an upcoming appointment for ${pet.id}`);

      const vacc = nextVaccination(seed, pet.id, today);
      assert.ok(vacc, `expected a next vaccination for ${pet.id}`);
      assert.ok(vacc.nextDate !== null);
    }

    // Sanity: every appointment in the seed is upcoming relative to `today`.
    for (const pet of seed.pets) {
      const upcoming = upcomingAppointments(seed, pet.id, today);
      assert.equal(upcoming.length, seed.appointments.filter((a) => a.petId === pet.id).length);
    }
  });
}

test('seed pet ages are consistent with their species (dog older than cat by design)', () => {
  const today = new Date(2026, 8, 25);
  const seed = createSeed(today);
  const murchyk = seed.pets.find((p) => p.id === 'murchyk')!;
  const luna = seed.pets.find((p) => p.id === 'luna')!;
  assert.ok(luna.birthDate < murchyk.birthDate); // luna born earlier => further in the past
});
