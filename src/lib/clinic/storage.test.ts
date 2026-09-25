import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createSeed } from './seed.ts';
import {
  BACKUP_KEY,
  LEGACY_KEY,
  STORAGE_KEY,
  clearState,
  isDemoState,
  loadState,
  migrateV1,
  saveState,
} from './storage.ts';
import type { StorageLike } from './storage.ts';
import { FakeStorage, NOW } from './test-utils.ts';
import type { AccountStateV1 } from '../account/types.ts';

const V1: AccountStateV1 = {
  version: 1,
  seededAt: '2026-09-20',
  pets: [
    { id: 'murchyk', name: { key: 'murchyk' }, species: 'cat', breed: null, birthDate: '2023-07-20', weightKg: 4.5, photo: 'cat' },
    { id: 'pet-x', name: { text: 'Pufi' }, species: 'dog', breed: { text: 'Mix' }, birthDate: '2024-01-01', weightKg: 9, photo: null },
  ],
  appointments: [
    { id: 'appt-1', petId: 'murchyk', date: '2026-10-05', time: '11:30', reasonKey: 'checkup', doctorKey: 'koval', demoAdded: false },
    { id: 'appt-2', petId: 'pet-x', date: '2026-10-06', time: '10:00', reasonKey: 'visit', doctorKey: 'koval', demoAdded: true },
  ],
  visits: [{ id: 'visit-1', petId: 'murchyk', date: '2026-09-10', reasonKey: 'checkup', doctorKey: 'koval', noteKey: 'checkupNote' }],
  vaccinations: [{ id: 'v-1', petId: 'murchyk', nameKey: 'rabies', date: '2025-11-20', nextDate: '2026-11-20' }],
  documents: [{ id: 'd-1', petId: 'murchyk', titleKey: 'afterCheckup', date: '2026-09-10', bodyKey: 'afterCheckupBody' }],
  ui: { petId: 'pet-x', tab: 'documents' },
};

test('the seed is a valid model', () => {
  assert.equal(isDemoState(createSeed(NOW)), true);
});

test('save then load round-trips the same state', () => {
  const storage = new FakeStorage();
  const state = createSeed(NOW);
  assert.equal(saveState(storage, state), true);
  const result = loadState(storage, NOW);
  assert.equal(result.source, 'stored');
  assert.deepEqual(result.state, state);
});

test('empty storage starts from the seed', () => {
  const result = loadState(new FakeStorage(), NOW);
  assert.equal(result.source, 'seed');
  assert.deepEqual(result.state, createSeed(NOW));
});

test('broken JSON or an unknown shape → seed, broken value kept as a backup', () => {
  for (const raw of ['{not json', JSON.stringify({ version: 2, pets: 'x' }), JSON.stringify({ ...createSeed(NOW), version: 3 })]) {
    const storage = new FakeStorage();
    storage.setItem(STORAGE_KEY, raw);
    const result = loadState(storage, NOW);
    assert.equal(result.source, 'recovered');
    assert.equal(isDemoState(result.state), true);
    assert.equal(storage.getItem(BACKUP_KEY), raw);
  }
});

test('an appointment pointing to a missing pet makes the data invalid', () => {
  const state = createSeed(NOW);
  const broken = { ...state, appointments: [{ ...state.appointments[0], petId: 'ghost' }] };
  assert.equal(isDemoState(broken), false);
});

test('unavailable or throwing storage never crashes', () => {
  assert.equal(loadState(null, NOW).source, 'unavailable');
  const throwing: StorageLike = {
    getItem: () => {
      throw new Error('SecurityError');
    },
    setItem: () => {
      throw new Error('QuotaExceeded');
    },
    removeItem: () => {
      throw new Error('SecurityError');
    },
  };
  assert.equal(loadState(throwing, NOW).source, 'unavailable');
  assert.equal(saveState(throwing, createSeed(NOW)), false);
  assert.equal(clearState(throwing), false);
  assert.equal(saveState(null, createSeed(NOW)), false);
});

test('v1 pet-account data is migrated, saved as v2 and the old key removed', () => {
  const storage = new FakeStorage();
  storage.setItem(LEGACY_KEY, JSON.stringify(V1));
  const result = loadState(storage, NOW);
  assert.equal(result.source, 'migrated');
  assert.equal(storage.getItem(LEGACY_KEY), null);
  assert.equal(isDemoState(JSON.parse(storage.getItem(STORAGE_KEY) as string)), true);

  const state = result.state;
  assert.deepEqual(state.ui, V1.ui, 'selection kept');
  const own = state.pets.filter((p) => p.inAccount).map((p) => p.id);
  assert.deepEqual(own, ['murchyk', 'pet-x']);
  assert.ok(state.pets.some((p) => !p.inAccount), 'clinic pets added');

  const byId = (id: string) => state.appointments.find((a) => a.id === id);
  assert.equal(byId('appt-1')?.status, 'confirmed');
  assert.equal(byId('appt-2')?.status, 'pending', 'visitor booking waits for confirmation');
  assert.equal(byId('appt-2')?.source, 'account');
  assert.equal(byId('visit-1')?.status, 'completed');
  assert.equal(byId('visit-1')?.noteKey, 'checkupNote');
  assert.deepEqual(state.vaccinations, V1.vaccinations);
  assert.deepEqual(state.documents, V1.documents);

  // Generated clinic appointments never take a migrated slot.
  const slots = state.appointments
    .filter((a) => a.status === 'pending' || a.status === 'confirmed')
    .map((a) => `${a.doctorId} ${a.date} ${a.time}`);
  assert.equal(new Set(slots).size, slots.length);
});

test('migration is a pure function of the v1 data', () => {
  assert.deepEqual(migrateV1(V1, NOW), migrateV1(V1, NOW));
});

test('clearState removes the current and the legacy key', () => {
  const storage = new FakeStorage();
  storage.setItem(STORAGE_KEY, '{}');
  storage.setItem(LEGACY_KEY, '{}');
  assert.equal(clearState(storage), true);
  assert.equal(storage.map.size, 0);
});
