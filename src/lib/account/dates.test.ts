import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  addDays,
  addMonths,
  addYears,
  compareDateTime,
  parseISODate,
  toISODate,
} from './dates.ts';

test('toISODate formats local date parts', () => {
  assert.equal(toISODate(new Date(2026, 8, 5)), '2026-09-05');
  assert.equal(toISODate(new Date(2026, 0, 31)), '2026-01-31');
});

test('parseISODate accepts well-formed dates and rejects malformed ones', () => {
  const d = parseISODate('2026-09-25');
  assert.ok(d);
  assert.equal(d.getFullYear(), 2026);
  assert.equal(d.getMonth(), 8);
  assert.equal(d.getDate(), 25);

  assert.equal(parseISODate('not-a-date'), null);
  assert.equal(parseISODate('2026-9-25'), null);
  assert.equal(parseISODate('2026-13-01'), null);
  assert.equal(parseISODate('2026-02-30'), null); // Feb has 28/29 days
  assert.equal(parseISODate('2026-04-31'), null); // April has 30 days
});

test('parseISODate accepts valid leap-day', () => {
  assert.ok(parseISODate('2024-02-29'));
  assert.equal(parseISODate('2023-02-29'), null); // not a leap year
});

test('addDays moves forward and backward across month/year boundaries', () => {
  assert.equal(addDays('2026-09-25', 17), '2026-10-12');
  assert.equal(addDays('2026-09-25', -310), '2025-11-19');
  assert.equal(addDays('2026-12-31', 1), '2027-01-01');
});

test('addMonths clamps day to the shorter target month', () => {
  assert.equal(addMonths('2026-01-31', 1), '2026-02-28');
  assert.equal(addMonths('2024-01-31', 1), '2024-02-29'); // leap year
  assert.equal(addMonths('2026-09-25', -2), '2026-07-25');
});

test('addYears preserves month/day, clamping Feb 29 on non-leap years', () => {
  assert.equal(addYears('2026-09-25', -3), '2023-09-25');
  assert.equal(addYears('2024-02-29', 1), '2025-02-28');
});

test('compareDateTime orders by date then time', () => {
  assert.ok(compareDateTime('2026-09-25', '09:00', '2026-09-26', '00:00') < 0);
  assert.ok(compareDateTime('2026-09-25', '11:30', '2026-09-25', '09:00') > 0);
  assert.equal(compareDateTime('2026-09-25', '09:00', '2026-09-25', '09:00'), 0);
});
