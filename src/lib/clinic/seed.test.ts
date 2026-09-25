import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createSeed } from './seed.ts';
import { fitsHours, dayHours, isActive } from './schedule.ts';
import { nextAppointment } from '../account/state.ts';
import { NOW } from './test-utils.ts';

test('seed is deterministic for the same clinic time', () => {
  assert.deepEqual(createSeed(NOW), createSeed(NOW));
});

test('seed has no double bookings and active appointments fit the schedule', () => {
  for (const date of ['2026-09-25', '2026-09-26', '2026-09-27', '2026-12-31']) {
    const now = { date, time: '12:00' };
    const state = createSeed(now);
    const active = state.appointments.filter(isActive);
    const keys = active.map((a) => `${a.doctorId} ${a.date} ${a.time}`);
    assert.equal(new Set(keys).size, keys.length, `double booking on ${date}`);
    for (const a of state.appointments) {
      assert.ok(fitsHours(dayHours(state, a.doctorId, a.date), a.time), `${a.id} outside hours`);
    }
  }
});

test('seed: account pets have an upcoming confirmed appointment, clinic has pending requests', () => {
  const state = createSeed(NOW);
  for (const id of ['murchyk', 'luna']) {
    assert.equal(nextAppointment(state, id, NOW)?.status, 'confirmed');
  }
  assert.ok(state.appointments.some((a) => a.status === 'pending'));
  assert.ok(state.appointments.some((a) => a.date === NOW.date));
  // Past days hold only finished records.
  for (const a of state.appointments.filter((x) => x.date < NOW.date)) {
    assert.ok(a.status === 'completed' || a.status === 'cancelled', a.id);
  }
});
