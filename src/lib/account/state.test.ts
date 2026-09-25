import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createSeed } from '../clinic/seed.ts';
import { NOW } from '../clinic/test-utils.ts';
import {
  accountPets,
  addPet,
  cancelledUpcoming,
  nextVaccination,
  selectPet,
  selectTab,
  updatePet,
  visitsFor,
} from './state.ts';

const VALUE = { name: 'Rex', species: 'dog' as const, breed: null, birthDate: '2022-01-01', weightKg: 12 };

test('pet account shows only the visitor’s pets', () => {
  const state = createSeed(NOW);
  assert.deepEqual(accountPets(state).map((p) => p.id), ['murchyk', 'luna']);
  assert.ok(state.pets.length > 2, 'clinic pets exist for the admin panel');
  assert.equal(selectPet(state, 'bella'), state, 'a clinic pet cannot be selected in the account');
});

test('addPet: from the account it is selected; from the admin panel it stays out of the account', () => {
  const fromAccount = addPet(createSeed(NOW), VALUE, 'rex');
  assert.equal(fromAccount.ui.petId, 'rex');
  assert.deepEqual(fromAccount.pets.at(-1)?.owner, { key: 'anna' });

  const fromAdmin = addPet(createSeed(NOW), VALUE, 'rex', { owner: { text: 'Ana' }, inAccount: false });
  assert.equal(fromAdmin.ui.petId, 'murchyk');
  assert.equal(accountPets(fromAdmin).some((p) => p.id === 'rex'), false);
});

test('updatePet keeps the owner unless a new one is given; species change drops the photo', () => {
  const state = createSeed(NOW);
  const same = updatePet(state, 'murchyk', { ...VALUE, species: 'cat', name: 'Murr' });
  const murr = same.pets.find((p) => p.id === 'murchyk');
  assert.deepEqual(murr?.name, { text: 'Murr' });
  assert.deepEqual(murr?.owner, { key: 'anna' });
  assert.equal(murr?.photo, 'cat');
  const changed = updatePet(state, 'murchyk', VALUE, { text: 'Ioana' });
  assert.deepEqual(changed.pets.find((p) => p.id === 'murchyk')?.owner, { text: 'Ioana' });
  assert.equal(changed.pets.find((p) => p.id === 'murchyk')?.photo, null);
});

test('history, cancellations, vaccinations and tabs', () => {
  const state = createSeed(NOW);
  const visits = visitsFor(state, 'murchyk');
  assert.equal(visits.length, 2);
  assert.ok(visits[0].date > visits[1].date, 'newest first');
  assert.equal(cancelledUpcoming(state, 'murchyk', NOW).length, 0);
  assert.equal(nextVaccination(state, 'murchyk', NOW)?.nameKey, 'rabies');
  assert.equal(selectTab(state, 'documents').ui.tab, 'documents');
});
