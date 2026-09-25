import { test } from 'node:test';
import assert from 'node:assert/strict';
import { cancelAppointment, confirmAppointment, createAppointment, rescheduleAppointment } from './appointments.ts';
import { publicSlots } from './schedule.ts';
import { createSeed } from './seed.ts';
import { loadState, saveState } from './storage.ts';
import { FakeStorage, NOW } from './test-utils.ts';
import { addPet, nextAppointment, visitsFor } from '../account/state.ts';
import type { DemoState } from './types.ts';

function freeTime(state: DemoState, date: string): string {
  const slot = publicSlots(state, date, NOW).find((s) => s.available);
  assert.ok(slot, `no free slot on ${date}`);
  return slot.time;
}

function isFree(state: DemoState, date: string, time: string, doctorId: string): boolean {
  return !state.appointments.some(
    (a) => a.doctorId === doctorId && a.date === date && a.time === time && (a.status === 'pending' || a.status === 'confirmed'),
  );
}

test('end to end: visitor books → admin confirms → account sees it → reschedule → cancel → reload', () => {
  const storage = new FakeStorage();
  let state = createSeed(NOW);
  state = addPet(state, { name: 'Pufi', species: 'dog', breed: null, birthDate: '2022-01-01', weightKg: 12 }, 'pufi');
  const date = '2026-10-01';

  // 1. The visitor books from the pet account (the site form works the same way).
  const time = freeTime(state, date);
  const booked = createAppointment(state, {
    petId: 'pufi', guest: null, date, time, doctorId: null, reason: { key: 'visit' }, source: 'account',
  }, NOW, 'appt-pufi');
  assert.equal(booked.ok, true);
  if (!booked.ok) return;
  state = booked.state;
  const { doctorId } = booked.appointment;
  assert.equal(isFree(state, date, time, doctorId), false, 'pending reserves the slot');

  // 2. The admin sees it as pending and confirms it.
  assert.equal(state.appointments.filter((a) => a.status === 'pending').some((a) => a.id === 'appt-pufi'), true);
  const confirmed = confirmAppointment(state, 'appt-pufi', NOW);
  assert.equal(confirmed.ok, true);
  if (!confirmed.ok) return;
  state = confirmed.state;

  // 3. The pet account shows the confirmed appointment.
  assert.equal(nextAppointment(state, 'pufi', NOW)?.status, 'confirmed');

  // 4. Rescheduling moves the busy slot.
  const target = freeTime(state, '2026-10-02');
  const newDoctor = state.appointments.some((a) => a.doctorId === 'koval' && a.date === '2026-10-02' && a.time === target && a.status !== 'cancelled' && a.status !== 'completed') ? 'melnyk' : 'koval';
  const moved = rescheduleAppointment(state, 'appt-pufi', { date: '2026-10-02', time: target, doctorId: newDoctor }, NOW);
  assert.equal(moved.ok, true, JSON.stringify(moved));
  if (!moved.ok) return;
  state = moved.state;
  assert.equal(isFree(state, date, time, doctorId), true, 'old slot free');
  assert.equal(isFree(state, '2026-10-02', target, newDoctor), false, 'new slot busy');
  assert.equal(nextAppointment(state, 'pufi', NOW)?.date, '2026-10-02');

  // 5. Cancelling frees the slot; the record stays.
  const cancelled = cancelAppointment(state, 'appt-pufi', NOW);
  assert.equal(cancelled.ok, true);
  if (!cancelled.ok) return;
  state = cancelled.state;
  assert.equal(isFree(state, '2026-10-02', target, newDoctor), true);
  assert.equal(nextAppointment(state, 'pufi', NOW), null);
  assert.equal(state.appointments.find((a) => a.id === 'appt-pufi')?.status, 'cancelled');
  assert.equal(visitsFor(state, 'pufi').length, 0);

  // 6. The state survives a reload.
  saveState(storage, state);
  const reloaded = loadState(storage, NOW);
  assert.equal(reloaded.source, 'stored');
  assert.deepEqual(reloaded.state, state);
});
