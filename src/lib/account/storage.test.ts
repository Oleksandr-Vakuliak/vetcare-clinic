import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createSeed } from './seed.ts';
import { STORAGE_KEY, clearState, isAccountState, loadState, saveState } from './storage.ts';
import type { StorageLike } from './storage.ts';

const TODAY = new Date(2026, 8, 25, 10, 0);

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

class ThrowingGetStorage implements StorageLike {
  getItem(): string {
    throw new Error('boom');
  }
  setItem(): void {}
  removeItem(): void {}
}

class ThrowingSetStorage implements StorageLike {
  getItem(): string | null {
    return null;
  }
  setItem(): void {
    throw new Error('boom');
  }
  removeItem(): void {}
}

test('isAccountState validates the seed', () => {
  assert.equal(isAccountState(createSeed(TODAY)), true);
});

test('isAccountState rejects garbage', () => {
  assert.equal(isAccountState(null), false);
  assert.equal(isAccountState({}), false);
  assert.equal(isAccountState({ version: 2 }), false);
  assert.equal(isAccountState({ ...createSeed(TODAY), pets: [] }), false);
});

test('save then load round-trips the same state', () => {
  const storage = new FakeStorage();
  const state = createSeed(TODAY);
  assert.equal(saveState(storage, state), true);
  const result = loadState(storage, TODAY);
  assert.equal(result.source, 'stored');
  assert.deepEqual(result.state, state);
});

test('missing key falls back to seed', () => {
  const storage = new FakeStorage();
  const result = loadState(storage, TODAY);
  assert.equal(result.source, 'seed');
  assert.equal(isAccountState(result.state), true);
});

test('corrupted JSON falls back to seed', () => {
  const storage = new FakeStorage();
  storage.setItem(STORAGE_KEY, '{not json');
  const result = loadState(storage, TODAY);
  assert.equal(result.source, 'seed');
});

test('wrong shape falls back to seed', () => {
  const storage = new FakeStorage();
  storage.setItem(STORAGE_KEY, JSON.stringify({ version: 1, pets: [] }));
  const result = loadState(storage, TODAY);
  assert.equal(result.source, 'seed');
});

test('getItem throwing falls back to seed', () => {
  const result = loadState(new ThrowingGetStorage(), TODAY);
  assert.equal(result.source, 'seed');
});

test('setItem throwing makes saveState return false', () => {
  assert.equal(saveState(new ThrowingSetStorage(), createSeed(TODAY)), false);
});

test('null storage: loadState seeds, saveState and clearState return false', () => {
  const result = loadState(null, TODAY);
  assert.equal(result.source, 'seed');
  assert.equal(saveState(null, createSeed(TODAY)), false);
  assert.equal(clearState(null), false);
});

test('dangling ui.petId is fixed to the first pet', () => {
  const storage = new FakeStorage();
  const state = createSeed(TODAY);
  storage.setItem(STORAGE_KEY, JSON.stringify({ ...state, ui: { ...state.ui, petId: 'ghost' } }));
  const result = loadState(storage, TODAY);
  assert.equal(result.source, 'stored');
  assert.equal(result.state.ui.petId, state.pets[0].id);
});

test('clearState removes the stored key', () => {
  const storage = new FakeStorage();
  saveState(storage, createSeed(TODAY));
  assert.equal(clearState(storage), true);
  assert.equal(storage.getItem(STORAGE_KEY), null);
});
