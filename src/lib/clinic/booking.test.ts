import { test } from 'node:test';
import assert from 'node:assert/strict';
import { cancelAppointment, createAppointment, rescheduleAppointment } from './appointments.ts';
import type { NewAppointment } from './appointments.ts';
import { closeSlot, publicSlots } from './schedule.ts';
import { NOW, emptyState } from './test-utils.ts';
import type { DemoState } from './types.ts';

const MONDAY = '2026-09-28';

function input(extra: Partial<NewAppointment> = {}): NewAppointment {
  return {
    petId: 'murchyk',
    guest: null,
    date: MONDAY,
    time: '10:00',
    doctorId: 'koval',
    reason: { key: 'checkup' },
    source: 'admin',
    ...extra,
  };
}

function book(state: DemoState, extra: Partial<NewAppointment> = {}, id = 'a1') {
  const result = createAppointment(state, input(extra), NOW, id);
  assert.equal(result.ok, true, JSON.stringify(result));
  if (!result.ok) throw new Error('unreachable');
  return result;
}

function bookError(state: DemoState, extra: Partial<NewAppointment>) {
  const result = createAppointment(state, input(extra), NOW, 'x');
  assert.equal(result.ok, false);
  return result.ok ? null : result.error;
}

test('admin booking is confirmed; site and account requests start as pending', () => {
  assert.equal(book(emptyState()).appointment.status, 'confirmed');
  assert.equal(book(emptyState(), { source: 'account', doctorId: null }).appointment.status, 'pending');
  const site = book(emptyState(), {
    source: 'site',
    petId: null,
    doctorId: null,
    guest: { petName: ' Tom ', species: 'other', ownerName: 'Ana' },
  });
  assert.equal(site.appointment.status, 'pending');
  assert.deepEqual(site.appointment.guest, { petName: 'Tom', species: 'other', ownerName: 'Ana' });
  assert.equal(site.appointment.history[0].action, 'created');
});

test('required fields are checked', () => {
  assert.equal(bookError(emptyState(), { reason: null }), 'required');
  assert.equal(bookError(emptyState(), { reason: { text: '  ' } }), 'required');
  assert.equal(bookError(emptyState(), { date: '' }), 'required');
  assert.equal(bookError(emptyState(), { petId: null }), 'required');
  assert.equal(
    bookError(emptyState(), { petId: null, guest: { petName: '', species: 'cat', ownerName: 'Ana' } }),
    'required',
  );
  assert.equal(bookError(emptyState(), { date: '2026-02-30' }), 'invalid');
  assert.equal(bookError(emptyState(), { petId: 'ghost' }), 'unknownPet');
  assert.equal(bookError(emptyState(), { doctorId: 'house' }), 'unknownDoctor');
});

test('a slot in the past (clinic time) cannot be booked', () => {
  assert.equal(bookError(emptyState(), { date: NOW.date, time: '09:30' }), 'past');
  assert.equal(bookError(emptyState(), { date: NOW.date, time: '10:00' }), 'past');
  assert.equal(bookError(emptyState(), { date: '2026-09-24', time: '12:00' }), 'past');
  assert.equal(book(emptyState(), { date: NOW.date, time: '10:30' }).appointment.time, '10:30');
});

test('slots outside hours, in the break or off the 30-minute grid are rejected', () => {
  assert.equal(bookError(emptyState(), { time: '08:30' }), 'offHours');
  assert.equal(bookError(emptyState(), { time: '10:30', doctorId: 'melnyk' }), 'offHours'); // starts at 11:00
  assert.equal(bookError(emptyState(), { time: '17:00' }), 'offHours'); // koval ends at 17:00
  assert.equal(bookError(emptyState(), { time: '13:30' }), 'offHours'); // break 13–14
  assert.equal(bookError(emptyState(), { time: '10:15' }), 'offHours');
  assert.equal(bookError(emptyState(), { date: '2026-09-27' }), 'offHours'); // koval: Sunday off
});

test('no double booking of the same doctor; another doctor is fine', () => {
  const first = book(emptyState(), { time: '11:00' });
  assert.equal(bookError(first.state, { time: '11:00', petId: 'luna' }), 'taken');
  const other = createAppointment(first.state, input({ time: '11:00', doctorId: 'melnyk' }), NOW, 'a2');
  assert.equal(other.ok, true);
});

test('a pending request reserves its slot; cancelling frees it', () => {
  const pending = book(emptyState(), { source: 'account', doctorId: 'koval', time: '11:00' });
  assert.equal(pending.appointment.status, 'pending');
  assert.equal(bookError(pending.state, { time: '11:00' }), 'taken');

  const cancelled = cancelAppointment(pending.state, 'a1', NOW);
  assert.equal(cancelled.ok, true);
  if (!cancelled.ok) return;
  assert.equal(cancelled.state.appointments.length, 1, 'cancelled record stays in history');
  assert.equal(createAppointment(cancelled.state, input({ time: '11:00' }), NOW, 'a2').ok, true);
});

test('closed slots cannot be booked', () => {
  const closed = closeSlot(emptyState(), 'koval', MONDAY, '10:00', NOW);
  assert.equal(closed.ok, true);
  if (!closed.ok) return;
  assert.equal(bookError(closed.state, {}), 'closed');
});

test('site/account requests get the first free doctor, or noDoctor when all are busy', () => {
  let state = book(emptyState(), { time: '12:00' }).state; // koval busy at 12:00
  const auto = createAppointment(state, input({ source: 'account', doctorId: null, time: '12:00' }), NOW, 'a2');
  assert.equal(auto.ok, true);
  if (!auto.ok) return;
  assert.equal(auto.appointment.doctorId, 'melnyk');
  state = auto.state;
  const none = createAppointment(state, input({ source: 'account', doctorId: null, time: '12:00', petId: 'luna' }), NOW, 'a3');
  assert.deepEqual(none, { ok: false, error: 'noDoctor' });
});

test('site calendar marks a time busy only when every working doctor is taken', () => {
  const at = (s: DemoState, time: string) => publicSlots(s, MONDAY, NOW).find((slot) => slot.time === time);
  let state = emptyState();
  assert.equal(at(state, '09:00')?.available, true);
  assert.equal(at(state, '13:30')?.available, true, 'melnyk works while koval has a break');
  assert.equal(at(state, '15:00')?.available, true, 'koval works while melnyk has a break');
  state = book(state, { time: '12:00' }).state;
  assert.equal(at(state, '12:00')?.available, true);
  state = book(state, { time: '12:00', doctorId: 'melnyk', petId: 'luna' }, 'a2').state;
  assert.equal(at(state, '12:00')?.available, false);
  assert.equal(publicSlots(state, '2026-09-24', NOW).every((slot) => !slot.available), true, 'past day');
});

test('rescheduling moves the reservation and rejects busy or past targets', () => {
  let state = book(emptyState(), { time: '10:00' }).state;
  state = book(state, { time: '11:00', petId: 'luna' }, 'a2').state;

  const busy = rescheduleAppointment(state, 'a1', { date: MONDAY, time: '11:00', doctorId: 'koval' }, NOW);
  assert.deepEqual(busy, { ok: false, error: 'taken' });
  const past = rescheduleAppointment(state, 'a1', { date: NOW.date, time: '09:00', doctorId: 'koval' }, NOW);
  assert.deepEqual(past, { ok: false, error: 'past' });
  const same = rescheduleAppointment(state, 'a1', { date: MONDAY, time: '10:00', doctorId: 'koval' }, NOW);
  assert.deepEqual(same, { ok: false, error: 'sameSlot' });

  const moved = rescheduleAppointment(state, 'a1', { date: MONDAY, time: '10:30', doctorId: 'koval' }, NOW);
  assert.equal(moved.ok, true);
  if (!moved.ok) return;
  const a1 = moved.state.appointments.find((a) => a.id === 'a1');
  assert.equal(a1?.time, '10:30');
  assert.equal(a1?.status, 'confirmed', 'status is kept');
  assert.deepEqual(a1?.history.at(-1)?.from, { date: MONDAY, time: '10:00', doctorId: 'koval' });
  // The old slot is free again, the new one is taken.
  assert.equal(createAppointment(moved.state, input({ time: '10:00', petId: 'luna' }), NOW, 'a3').ok, true);
  assert.equal(bookError(moved.state, { time: '10:30', petId: 'luna' }), 'taken');
});
