import { test } from 'node:test';
import assert from 'node:assert/strict';
import { addDays } from '../account/dates.ts';
import { createAppointment } from './appointments.ts';
import { defaultWeek } from './config.ts';
import {
  closeSlot,
  doctorDay,
  doctorNowState,
  freeSlotCount,
  reopenSlot,
  setDoctorWeek,
  validateDayHours,
  weekGrid,
} from './schedule.ts';
import { NOW, emptyState } from './test-utils.ts';
import type { DayHours, DemoState } from './types.ts';

const MONDAY = '2026-09-28';

function withBooking(time = '16:00', doctorId = 'koval'): DemoState {
  const result = createAppointment(emptyState(), {
    petId: 'murchyk',
    guest: null,
    date: MONDAY,
    time,
    doctorId,
    reason: { key: 'checkup' },
    source: 'admin',
  }, NOW, 'a1');
  if (!result.ok) throw new Error(result.error);
  return result.state;
}

function week(monday: DayHours | null): Array<DayHours | null> {
  const w = defaultWeek('koval');
  w[0] = monday;
  return w;
}

test('day hours validation', () => {
  const h = (start: string, end: string, bs: string | null = null, be: string | null = null) =>
    validateDayHours({ start, end, breakStart: bs, breakEnd: be });
  assert.equal(validateDayHours(null), null);
  assert.equal(h('09:00', '17:00', '13:00', '14:00'), null);
  assert.equal(h('17:00', '09:00'), 'order');
  assert.equal(h('09:15', '17:00'), 'grid');
  assert.equal(h('09:00', '17:00', '13:00', null), 'breakPartial');
  assert.equal(h('09:00', '17:00', '14:00', '13:00'), 'breakOrder');
  assert.equal(h('09:00', '17:00', '16:30', '17:30'), 'breakOutside');
});

test('invalid weekly hours are refused', () => {
  const result = setDoctorWeek(emptyState(), 'koval', week({ start: '18:00', end: '10:00', breakStart: null, breakEnd: null }), NOW);
  assert.equal(result.ok, false);
  if (!result.ok && result.reason === 'invalid') assert.equal(result.errors[0], 'order');
});

test('shorter hours that strand an appointment show the conflict and change nothing', () => {
  const state = withBooking('16:00');
  const shorter = week({ start: '09:00', end: '15:00', breakStart: null, breakEnd: null });
  const result = setDoctorWeek(state, 'koval', shorter, NOW);
  assert.equal(result.ok, false);
  if (result.ok || result.reason !== 'conflicts') return;
  assert.deepEqual(result.conflicts.map((a) => a.id), ['a1']);
  assert.equal(state.appointments.length, 1, 'nothing is deleted');
});

test('a new break over an appointment and a day off are conflicts too', () => {
  const state = withBooking('10:00');
  const withBreak = setDoctorWeek(state, 'koval', week({ start: '09:00', end: '17:00', breakStart: '10:00', breakEnd: '11:00' }), NOW);
  assert.equal(withBreak.ok, false);
  const dayOff = setDoctorWeek(state, 'koval', week(null), NOW);
  assert.equal(dayOff.ok, false);
});

test('hours change is saved when no appointment is affected; other doctors unchanged', () => {
  const state = withBooking('10:00');
  const result = setDoctorWeek(state, 'koval', week({ start: '09:00', end: '12:00', breakStart: null, breakEnd: null }), NOW);
  assert.equal(result.ok, true);
  if (!result.ok) return;
  const day = doctorDay(result.state, 'koval', MONDAY, NOW);
  assert.deepEqual(day.slots.map((s) => s.time), ['09:00', '09:30', '10:00', '10:30', '11:00', '11:30']);
  assert.deepEqual(
    result.state.schedules.find((s) => s.doctorId === 'melnyk'),
    state.schedules.find((s) => s.doctorId === 'melnyk'),
  );
});

test('cancelled appointments do not block a schedule change', () => {
  const state = withBooking('16:00');
  state.appointments[0] = { ...state.appointments[0], status: 'cancelled' };
  const result = setDoctorWeek(state, 'koval', week({ start: '09:00', end: '15:00', breakStart: null, breakEnd: null }), NOW);
  assert.equal(result.ok, true);
});

test('closing a booked slot is a conflict; a free one can be closed and reopened', () => {
  const state = withBooking('10:00');
  const conflict = closeSlot(state, 'koval', MONDAY, '10:00', NOW);
  assert.equal(conflict.ok, false);
  if (!conflict.ok) assert.equal(conflict.reason, 'conflict');

  assert.equal(closeSlot(state, 'koval', NOW.date, '09:00', NOW).ok, false, 'past');
  assert.equal(closeSlot(state, 'koval', MONDAY, '13:00', NOW).ok, false, 'break');

  const closed = closeSlot(state, 'koval', MONDAY, '10:30', NOW);
  assert.equal(closed.ok, true);
  if (!closed.ok) return;
  const slot = doctorDay(closed.state, 'koval', MONDAY, NOW).slots.find((s) => s.time === '10:30');
  assert.equal(slot?.state, 'closed');
  assert.equal(closeSlot(closed.state, 'koval', MONDAY, '10:30', NOW).ok, false, 'already closed');

  const reopened = reopenSlot(closed.state, 'koval', MONDAY, '10:30', NOW);
  assert.equal(reopened.ok, true);
  if (reopened.ok) assert.equal(reopened.state.closedSlots.length, 0);
});

test('free slot count and doctor "now" state', () => {
  const state = emptyState();
  // Friday 10:00 (the 10:00 slot has started): koval 10:30–17:00 minus break = 11; melnyk 11:00–19:00 minus 30 min = 15.
  assert.equal(freeSlotCount(state, NOW.date, NOW), 11 + 15);
  assert.equal(doctorNowState(state, 'koval', NOW), 'free');
  assert.equal(doctorNowState(state, 'melnyk', NOW), 'off');
  assert.equal(doctorNowState(state, 'koval', { date: NOW.date, time: '13:10' }), 'break');
  const booked = withBooking('10:00');
  assert.equal(doctorNowState(booked, 'koval', { date: MONDAY, time: '10:20' }), 'appointment');
});

test('week grid: rows are the union of working times, cells line up with them', () => {
  const grid = weekGrid(withBooking('10:00'), 'koval', MONDAY, NOW);
  // koval: Mon–Fri 09:00–17:00 (break 13:00–14:00), Sat 09:00–14:00, Sun off.
  assert.equal(grid.times.length, 16);
  assert.equal(grid.times[0], '09:00');
  assert.equal(grid.times.at(-1), '16:30');
  assert.deepEqual(grid.days.map((d) => d.date), [
    '2026-09-28', '2026-09-29', '2026-09-30', '2026-10-01', '2026-10-02', '2026-10-03', '2026-10-04',
  ]);
  for (const day of grid.days) assert.equal(day.cells.length, grid.times.length);

  const at = (day: number, time: string) => grid.days[day].cells[grid.times.indexOf(time)];
  assert.equal(at(0, '10:00')?.state, 'booked');
  assert.equal(at(0, '10:00')?.appointment?.id, 'a1');
  assert.equal(at(0, '13:00')?.state, 'break');
  assert.equal(at(1, '10:00')?.state, 'free');
  assert.equal(at(5, '13:30')?.state, 'free', 'Saturday until 14:00');
  assert.equal(at(5, '14:00'), null, 'Saturday ends at 14:00');
  assert.equal(grid.days[6].hours, null);
  assert.ok(grid.days[6].cells.every((c) => c === null), 'Sunday off');
});

test('week grid marks past and closed slots and collects appointments outside the hours', () => {
  const closed = closeSlot(emptyState(), 'koval', MONDAY, '11:00', NOW);
  assert.equal(closed.ok, true);
  if (!closed.ok) return;
  // The 16:00 booking no longer fits once Monday ends at 12:00.
  const state: DemoState = {
    ...closed.state,
    appointments: withBooking('16:00').appointments,
    schedules: closed.state.schedules.map((s) =>
      s.doctorId === 'koval' ? { ...s, week: week({ start: '09:00', end: '12:00', breakStart: null, breakEnd: null }) } : s,
    ),
  };

  const current = weekGrid(state, 'koval', addDays(MONDAY, -7), NOW);
  const friday = current.days[4];
  assert.equal(friday.date, NOW.date);
  assert.equal(friday.cells[current.times.indexOf('09:30')]?.past, true);
  assert.equal(friday.cells[current.times.indexOf('10:30')]?.past, false);

  const next = weekGrid(state, 'koval', MONDAY, NOW);
  assert.equal(next.days[0].cells[next.times.indexOf('11:00')]?.state, 'closed');
  assert.deepEqual(next.days[0].outside.map((a) => a.id), ['a1']);
});
