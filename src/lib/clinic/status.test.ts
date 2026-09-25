import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  allowedActions,
  cancelAppointment,
  completeAppointment,
  confirmAppointment,
  createAppointment,
  rescheduleAppointment,
} from './appointments.ts';
import { NOW, emptyState } from './test-utils.ts';
import type { Appointment, AppointmentStatus, DemoState } from './types.ts';

function withAppointment(status: AppointmentStatus, date: string, time: string): DemoState {
  const appointment: Appointment = {
    id: 'a1',
    petId: 'murchyk',
    guest: null,
    date,
    time,
    doctorId: 'koval',
    reason: { key: 'checkup' },
    status,
    source: 'seed',
    noteKey: null,
    history: [],
  };
  return { ...emptyState(), appointments: [appointment] };
}

const FUTURE = ['2026-09-28', '10:00'] as const;
const STARTED = [NOW.date, '09:30'] as const;

test('allowed actions follow the status model', () => {
  const actions = (status: AppointmentStatus, [date, time]: readonly [string, string]) =>
    allowedActions(withAppointment(status, date, time).appointments[0], NOW);

  assert.deepEqual(actions('pending', FUTURE), ['confirm', 'reschedule', 'cancel']);
  assert.deepEqual(actions('pending', STARTED), ['reschedule', 'cancel']);
  assert.deepEqual(actions('confirmed', FUTURE), ['reschedule', 'cancel']);
  assert.deepEqual(actions('confirmed', STARTED), ['complete', 'reschedule', 'cancel']);
  assert.deepEqual(actions('completed', STARTED), []);
  assert.deepEqual(actions('cancelled', FUTURE), []);
});

test('pending → confirmed → completed, each step recorded in the history', () => {
  const created = createAppointment(emptyState(), {
    petId: 'murchyk',
    guest: null,
    date: NOW.date,
    time: '10:30',
    doctorId: null,
    reason: { key: 'visit' },
    source: 'account',
  }, NOW, 'a1');
  assert.equal(created.ok, true);
  if (!created.ok) return;

  const confirmed = confirmAppointment(created.state, 'a1', NOW);
  assert.equal(confirmed.ok, true);
  if (!confirmed.ok) return;
  assert.equal(confirmed.state.appointments[0].status, 'confirmed');

  // Completing before the start time makes no sense.
  assert.deepEqual(completeAppointment(confirmed.state, 'a1', NOW), { ok: false, error: 'notAllowed' });

  const later = { date: NOW.date, time: '10:45' };
  const completed = completeAppointment(confirmed.state, 'a1', later);
  assert.equal(completed.ok, true);
  if (!completed.ok) return;
  const done = completed.state.appointments[0];
  assert.equal(done.status, 'completed');
  assert.equal(done.noteKey, 'completedNote');
  assert.deepEqual(done.history.map((h) => h.action), ['created', 'confirmed', 'completed']);
  assert.equal(done.history[2].at, '2026-09-25T10:45');
});

test('meaningless actions are rejected', () => {
  const completed = withAppointment('completed', ...STARTED);
  assert.deepEqual(confirmAppointment(completed, 'a1', NOW), { ok: false, error: 'notAllowed' });
  assert.deepEqual(cancelAppointment(completed, 'a1', NOW), { ok: false, error: 'notAllowed' });

  const cancelled = withAppointment('cancelled', ...FUTURE);
  assert.deepEqual(confirmAppointment(cancelled, 'a1', NOW), { ok: false, error: 'notAllowed' });
  assert.deepEqual(
    rescheduleAppointment(cancelled, 'a1', { date: '2026-09-28', time: '11:00', doctorId: 'koval' }, NOW),
    { ok: false, error: 'notAllowed' },
  );

  const confirmed = withAppointment('confirmed', ...FUTURE);
  assert.deepEqual(confirmAppointment(confirmed, 'a1', NOW), { ok: false, error: 'notAllowed' });
  assert.deepEqual(confirmAppointment(confirmed, 'nope', NOW), { ok: false, error: 'notFound' });

  const stalePending = withAppointment('pending', ...STARTED);
  assert.deepEqual(confirmAppointment(stalePending, 'a1', NOW), { ok: false, error: 'notAllowed' });
});

test('cancel keeps the record and appends to its history', () => {
  const result = cancelAppointment(withAppointment('confirmed', ...FUTURE), 'a1', NOW);
  assert.equal(result.ok, true);
  if (!result.ok) return;
  assert.equal(result.state.appointments.length, 1);
  assert.equal(result.state.appointments[0].status, 'cancelled');
  assert.equal(result.state.appointments[0].history.at(-1)?.action, 'cancelled');
});
