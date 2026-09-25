import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createSeed } from './seed.ts';
import { toISODate, addDays } from './dates.ts';
import { getSlotsForDate } from '../booking-data.ts';
import {
  addAppointment,
  addPet,
  documentsFor,
  isSlotTaken,
  nextAppointment,
  petById,
  selectPet,
  selectTab,
  updatePet,
  vaccinationsFor,
  visitsFor,
} from './state.ts';

const NOW = new Date(2026, 8, 25, 10, 0);
const TODAY_ISO = toISODate(NOW);

function seed() {
  return createSeed(NOW);
}

test('addAppointment rejects an unknown pet', () => {
  const result = addAppointment(
    seed(),
    { petId: 'ghost', date: addDays(TODAY_ISO, 5), time: '10:00' },
    NOW,
    'x',
  );
  assert.equal(result.ok, false);
  if (!result.ok) assert.equal(result.reason, 'unknownPet');
});

test('addAppointment rejects malformed date/time as invalid', () => {
  const state = seed();
  const badDate = addAppointment(state, { petId: 'murchyk', date: 'nope', time: '10:00' }, NOW, 'x');
  assert.equal(badDate.ok, false);
  if (!badDate.ok) assert.equal(badDate.reason, 'invalid');

  const badTime = addAppointment(
    state,
    { petId: 'murchyk', date: addDays(TODAY_ISO, 5), time: '25:99' },
    NOW,
    'x',
  );
  assert.equal(badTime.ok, false);
  if (!badTime.ok) assert.equal(badTime.reason, 'invalid');
});

test('addAppointment rejects a past date/time', () => {
  const result = addAppointment(seed(), { petId: 'murchyk', date: TODAY_ISO, time: '09:00' }, NOW, 'x');
  assert.equal(result.ok, false);
  if (!result.ok) assert.equal(result.reason, 'past');
});

test('addAppointment rejects a busy slot (lunch hour) and a time outside the slot list', () => {
  const futureDate = addDays(TODAY_ISO, 5);

  const lunch = addAppointment(seed(), { petId: 'murchyk', date: futureDate, time: '13:00' }, NOW, 'x');
  assert.equal(lunch.ok, false);
  if (!lunch.ok) assert.equal(lunch.reason, 'busy');

  const offSlot = addAppointment(seed(), { petId: 'murchyk', date: futureDate, time: '11:30' }, NOW, 'x');
  assert.equal(offSlot.ok, false);
  if (!offSlot.ok) assert.equal(offSlot.reason, 'busy');
});

test('addAppointment rejects a slot already taken by any pet, accepts a free one, and shows up only for its own pet', () => {
  const futureDate = addDays(TODAY_ISO, 5);
  const freeSlot = getSlotsForDate(new Date(NOW.getFullYear(), NOW.getMonth(), NOW.getDate() + 5)).find(
    (s) => !s.busy,
  );
  assert.ok(freeSlot, 'expected at least one free slot for the test to be meaningful');

  const first = addAppointment(
    seed(),
    { petId: 'murchyk', date: futureDate, time: freeSlot!.time },
    NOW,
    'new-appt-1',
  );
  assert.equal(first.ok, true);
  if (!first.ok) return;

  assert.equal(isSlotTaken(first.state, futureDate, freeSlot!.time), true);

  const taken = addAppointment(
    first.state,
    { petId: 'luna', date: futureDate, time: freeSlot!.time },
    NOW,
    'new-appt-2',
  );
  assert.equal(taken.ok, false);
  if (!taken.ok) assert.equal(taken.reason, 'taken');

  const murchykNext = nextAppointment(first.state, 'murchyk', NOW);
  assert.equal(murchykNext?.id, 'new-appt-1');
  const lunaNext = nextAppointment(first.state, 'luna', NOW);
  assert.equal(lunaNext?.id, 'appt-luna-1'); // unaffected by murchyk's new appointment
});

test('addPet appends a pet with no history and selects it', () => {
  const state = addPet(
    seed(),
    { name: 'Rex', species: 'dog', breed: null, birthDate: '2022-01-01', weightKg: 12 },
    'rex',
  );
  const pet = petById(state, 'rex');
  assert.ok(pet);
  assert.equal(pet?.photo, null);
  assert.deepEqual(state.ui, { petId: 'rex', tab: 'visits' });
  assert.equal(visitsFor(state, 'rex').length, 0);
  assert.equal(vaccinationsFor(state, 'rex').length, 0);
  assert.equal(documentsFor(state, 'rex').length, 0);
  assert.equal(nextAppointment(state, 'rex', NOW), null);
});

test('updatePet resets photo when species changes, keeps it otherwise', () => {
  const base = seed();
  const sameSpecies = updatePet(base, 'murchyk', {
    name: 'Murchyk',
    species: 'cat',
    breed: 'Mix',
    birthDate: '2023-01-01',
    weightKg: 5,
  });
  assert.equal(petById(sameSpecies, 'murchyk')?.photo, 'cat');

  const changedSpecies = updatePet(base, 'murchyk', {
    name: 'Murchyk',
    species: 'dog',
    breed: 'Mix',
    birthDate: '2023-01-01',
    weightKg: 5,
  });
  assert.equal(petById(changedSpecies, 'murchyk')?.photo, null);
  assert.deepEqual(petById(changedSpecies, 'murchyk')?.name, { text: 'Murchyk' });
});

test('selectPet ignores unknown ids, selectTab ignores unknown tabs', () => {
  const base = seed();
  const unchanged = selectPet(base, 'ghost');
  assert.equal(unchanged, base);

  const selected = selectPet(base, 'luna');
  assert.equal(selected.ui.petId, 'luna');

  const untabbed = selectTab(base, 'unknown' as never);
  assert.equal(untabbed, base);

  const tabbed = selectTab(base, 'vaccines');
  assert.equal(tabbed.ui.tab, 'vaccines');
});

test('visitsFor/vaccinationsFor/documentsFor are sorted by date descending', () => {
  const state = seed();
  const visits = visitsFor(state, 'murchyk');
  for (let i = 1; i < visits.length; i += 1) {
    assert.ok(visits[i - 1].date >= visits[i].date);
  }
  const vaccs = vaccinationsFor(state, 'murchyk');
  for (let i = 1; i < vaccs.length; i += 1) {
    assert.ok(vaccs[i - 1].date >= vaccs[i].date);
  }
  const docs = documentsFor(state, 'murchyk');
  for (let i = 1; i < docs.length; i += 1) {
    assert.ok(docs[i - 1].date >= docs[i].date);
  }
});
