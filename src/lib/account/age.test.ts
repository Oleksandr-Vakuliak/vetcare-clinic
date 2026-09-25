import { test } from 'node:test';
import assert from 'node:assert/strict';
import { petAge } from './age.ts';

test('exact birthday returns whole years, zero months', () => {
  assert.deepEqual(petAge('2020-09-25', new Date(2026, 8, 25)), { years: 6, months: 0 });
});

test('day before birthday returns previous year, 11 months', () => {
  assert.deepEqual(petAge('2020-09-25', new Date(2026, 8, 24)), { years: 5, months: 11 });
});

test('mid-year gives partial months', () => {
  assert.deepEqual(petAge('2023-07-10', new Date(2026, 8, 25)), { years: 3, months: 2 });
});

test('leap-day birth is handled without throwing, on leap and non-leap years', () => {
  assert.deepEqual(petAge('2020-02-29', new Date(2024, 1, 29)), { years: 4, months: 0 });
  assert.deepEqual(petAge('2020-02-29', new Date(2026, 1, 28)), { years: 5, months: 11 });
  assert.deepEqual(petAge('2020-02-29', new Date(2026, 2, 1)), { years: 6, months: 0 });
});

test('future birth date returns null', () => {
  assert.equal(petAge('2027-01-01', new Date(2026, 8, 25)), null);
});

test('invalid birth date string returns null', () => {
  assert.equal(petAge('not-a-date', new Date(2026, 8, 25)), null);
  assert.equal(petAge('2026-02-30', new Date(2026, 8, 25)), null);
});
