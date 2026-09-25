import { test } from 'node:test';
import assert from 'node:assert/strict';
import { clinicNow, hasStarted, weekdayIndex } from './time.ts';

test('clinicNow converts an instant to Europe/Bucharest wall-clock time', () => {
  // Summer time (UTC+3).
  assert.deepEqual(clinicNow(new Date('2026-09-25T21:30:00Z')), { date: '2026-09-26', time: '00:30' });
  // Winter time (UTC+2).
  assert.deepEqual(clinicNow(new Date('2026-12-31T22:15:00Z')), { date: '2027-01-01', time: '00:15' });
  // Independent of the visitor's zone: the same instant, the same clinic time.
  assert.deepEqual(clinicNow(new Date('2026-09-25T07:00:00Z')), { date: '2026-09-25', time: '10:00' });
});

test('hasStarted compares clinic date-times', () => {
  const now = { date: '2026-09-25', time: '10:00' };
  assert.equal(hasStarted('2026-09-25', '10:00', now), true);
  assert.equal(hasStarted('2026-09-25', '10:30', now), false);
  assert.equal(hasStarted('2026-09-24', '23:30', now), true);
});

test('weekdayIndex is Monday-first', () => {
  assert.equal(weekdayIndex('2026-09-28'), 0); // Monday
  assert.equal(weekdayIndex('2026-09-27'), 6); // Sunday
});
