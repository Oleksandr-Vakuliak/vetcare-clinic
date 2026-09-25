// Doctors' working hours, breaks, closed slots and slot availability.
// Every appointment lasts SLOT_MINUTES and starts on that grid (v1 limitation).

import { DAY_END, DAY_START, DOCTORS, SLOT_MINUTES } from './config.ts';
import { dateTimeKey, fromMinutes, hasStarted, isTime, toMinutes, weekdayIndex } from './time.ts';
import type { ClinicNow } from './time.ts';
import type { Appointment, DayHours, DemoState } from './types.ts';

export function isActive(appointment: Appointment): boolean {
  return appointment.status === 'pending' || appointment.status === 'confirmed';
}

export function isOnGrid(time: string): boolean {
  return isTime(time) && toMinutes(time) % SLOT_MINUTES === 0;
}

/** Grid times offered in the hours editor (DAY_START..DAY_END inclusive). */
export function editorTimes(): string[] {
  const times: string[] = [];
  for (let m = toMinutes(DAY_START); m <= toMinutes(DAY_END); m += SLOT_MINUTES) {
    times.push(fromMinutes(m));
  }
  return times;
}

export function dayHours(state: DemoState, doctorId: string, date: string): DayHours | null {
  const schedule = state.schedules.find((s) => s.doctorId === doctorId);
  return schedule?.week[weekdayIndex(date)] ?? null;
}

export function inBreak(hours: DayHours, time: string): boolean {
  if (!hours.breakStart || !hours.breakEnd) return false;
  const t = toMinutes(time);
  return t >= toMinutes(hours.breakStart) && t < toMinutes(hours.breakEnd);
}

/** Slot start times of a working day, breaks included. */
export function dayTimes(hours: DayHours): string[] {
  const times: string[] = [];
  for (let m = toMinutes(hours.start); m + SLOT_MINUTES <= toMinutes(hours.end); m += SLOT_MINUTES) {
    times.push(fromMinutes(m));
  }
  return times;
}

/** Inside the doctor's hours, on the grid, not in the break. */
export function fitsHours(hours: DayHours | null, time: string): boolean {
  if (!hours || !isOnGrid(time)) return false;
  const t = toMinutes(time);
  return t >= toMinutes(hours.start) && t + SLOT_MINUTES <= toMinutes(hours.end) && !inBreak(hours, time);
}

export function isClosed(state: DemoState, doctorId: string, date: string, time: string): boolean {
  return state.closedSlots.some((c) => c.doctorId === doctorId && c.date === date && c.time === time);
}

/** The active (pending or confirmed) appointment holding this doctor's slot, if any. */
export function activeAt(
  state: DemoState,
  doctorId: string,
  date: string,
  time: string,
  ignoreId?: string,
): Appointment | undefined {
  return state.appointments.find(
    (a) => a.id !== ignoreId && isActive(a) && a.doctorId === doctorId && a.date === date && a.time === time,
  );
}

export type SlotProblem = 'past' | 'offHours' | 'closed' | 'taken';

/** Why a doctor's slot can't be booked, or null when it is free. */
export function slotProblem(
  state: DemoState,
  doctorId: string,
  date: string,
  time: string,
  now: ClinicNow,
  ignoreId?: string,
): SlotProblem | null {
  if (hasStarted(date, time, now)) return 'past';
  if (!fitsHours(dayHours(state, doctorId, date), time)) return 'offHours';
  if (isClosed(state, doctorId, date, time)) return 'closed';
  if (activeAt(state, doctorId, date, time, ignoreId)) return 'taken';
  return null;
}

/** First doctor (in DOCTORS order) free at this slot. */
export function firstFreeDoctor(state: DemoState, date: string, time: string, now: ClinicNow): string | null {
  return DOCTORS.find((id) => slotProblem(state, id, date, time, now) === null) ?? null;
}

/** Free start times of one doctor on a date (for the admin forms). */
export function freeTimes(
  state: DemoState,
  doctorId: string,
  date: string,
  now: ClinicNow,
  ignoreId?: string,
): string[] {
  const hours = dayHours(state, doctorId, date);
  if (!hours) return [];
  return dayTimes(hours).filter((time) => slotProblem(state, doctorId, date, time, now, ignoreId) === null);
}

/** Site calendar: every time any doctor works that day; available if one of them is free. */
export function publicSlots(state: DemoState, date: string, now: ClinicNow): Array<{ time: string; available: boolean }> {
  const times = new Set<string>();
  for (const id of DOCTORS) {
    const hours = dayHours(state, id, date);
    if (hours) dayTimes(hours).filter((t) => !inBreak(hours, t)).forEach((t) => times.add(t));
  }
  return [...times]
    .sort()
    .map((time) => ({ time, available: firstFreeDoctor(state, date, time, now) !== null }));
}

/** Bookable slots left on a date across all doctors (overview metric). */
export function freeSlotCount(state: DemoState, date: string, now: ClinicNow): number {
  return DOCTORS.reduce((sum, id) => sum + freeTimes(state, id, date, now).length, 0);
}

export type SlotState = 'free' | 'booked' | 'closed' | 'break';

export interface DoctorSlot {
  time: string;
  state: SlotState;
  past: boolean;
  appointment?: Appointment;
}

/** One doctor's day for the schedule view. `outside` = active appointments that no longer fit the hours. */
export function doctorDay(
  state: DemoState,
  doctorId: string,
  date: string,
  now: ClinicNow,
): { hours: DayHours | null; slots: DoctorSlot[]; outside: Appointment[] } {
  const hours = dayHours(state, doctorId, date);
  const slots: DoctorSlot[] = hours
    ? dayTimes(hours).map((time) => {
        const appointment = activeAt(state, doctorId, date, time);
        const slotState: SlotState = appointment
          ? 'booked'
          : inBreak(hours, time)
            ? 'break'
            : isClosed(state, doctorId, date, time)
              ? 'closed'
              : 'free';
        return { time, state: slotState, past: hasStarted(date, time, now), appointment };
      })
    : [];
  const outside = state.appointments.filter(
    (a) => isActive(a) && a.doctorId === doctorId && a.date === date && !fitsHours(hours, a.time),
  );
  return { hours, slots, outside };
}

export type DoctorNow = 'appointment' | 'break' | 'free' | 'off';

/** What a doctor is doing right now (overview "Розклад лікарів"). */
export function doctorNowState(state: DemoState, doctorId: string, now: ClinicNow): DoctorNow {
  const hours = dayHours(state, doctorId, now.date);
  if (!hours) return 'off';
  const t = toMinutes(now.time);
  if (t < toMinutes(hours.start) || t >= toMinutes(hours.end)) return 'off';
  if (inBreak(hours, now.time)) return 'break';
  const slotStart = fromMinutes(t - (t % SLOT_MINUTES));
  return activeAt(state, doctorId, now.date, slotStart) ? 'appointment' : 'free';
}

export type DayHoursError = 'order' | 'grid' | 'breakPartial' | 'breakOrder' | 'breakOutside';

export function validateDayHours(hours: DayHours | null): DayHoursError | null {
  if (!hours) return null;
  const { start, end, breakStart, breakEnd } = hours;
  if (!isOnGrid(start) || !isOnGrid(end)) return 'grid';
  if (toMinutes(start) >= toMinutes(end)) return 'order';
  if ((breakStart === null) !== (breakEnd === null)) return 'breakPartial';
  if (breakStart && breakEnd) {
    if (!isOnGrid(breakStart) || !isOnGrid(breakEnd)) return 'grid';
    if (toMinutes(breakStart) >= toMinutes(breakEnd)) return 'breakOrder';
    if (toMinutes(breakStart) <= toMinutes(start) || toMinutes(breakEnd) >= toMinutes(end)) return 'breakOutside';
  }
  return null;
}

/** Upcoming active appointments of the doctor that would not fit the new weekly hours. */
export function weekConflicts(
  state: DemoState,
  doctorId: string,
  week: Array<DayHours | null>,
  now: ClinicNow,
): Appointment[] {
  return state.appointments
    .filter((a) => isActive(a) && a.doctorId === doctorId && !hasStarted(a.date, a.time, now))
    .filter((a) => !fitsHours(week[weekdayIndex(a.date)] ?? null, a.time))
    .sort((a, b) => dateTimeKey(a.date, a.time).localeCompare(dateTimeKey(b.date, b.time)));
}

export type WeekResult =
  | { ok: true; state: DemoState }
  | { ok: false; reason: 'invalid'; errors: Array<DayHoursError | null> }
  | { ok: false; reason: 'conflicts'; conflicts: Appointment[] };

/** Saves a doctor's weekly hours unless they are invalid or would strand appointments. */
export function setDoctorWeek(
  state: DemoState,
  doctorId: string,
  week: Array<DayHours | null>,
  now: ClinicNow,
): WeekResult {
  const errors = week.map(validateDayHours);
  if (week.length !== 7 || errors.some(Boolean)) return { ok: false, reason: 'invalid', errors };
  const conflicts = weekConflicts(state, doctorId, week, now);
  if (conflicts.length > 0) return { ok: false, reason: 'conflicts', conflicts };
  const others = state.schedules.filter((s) => s.doctorId !== doctorId);
  return { ok: true, state: { ...state, schedules: [...others, { doctorId, week }] } };
}

export type CloseResult =
  | { ok: true; state: DemoState }
  | { ok: false; reason: 'past' | 'offHours' | 'alreadyClosed' | 'notClosed' }
  | { ok: false; reason: 'conflict'; appointment: Appointment };

export function closeSlot(state: DemoState, doctorId: string, date: string, time: string, now: ClinicNow): CloseResult {
  if (hasStarted(date, time, now)) return { ok: false, reason: 'past' };
  if (!fitsHours(dayHours(state, doctorId, date), time)) return { ok: false, reason: 'offHours' };
  if (isClosed(state, doctorId, date, time)) return { ok: false, reason: 'alreadyClosed' };
  const appointment = activeAt(state, doctorId, date, time);
  if (appointment) return { ok: false, reason: 'conflict', appointment };
  return { ok: true, state: { ...state, closedSlots: [...state.closedSlots, { doctorId, date, time }] } };
}

export function reopenSlot(state: DemoState, doctorId: string, date: string, time: string, now: ClinicNow): CloseResult {
  if (hasStarted(date, time, now)) return { ok: false, reason: 'past' };
  if (!isClosed(state, doctorId, date, time)) return { ok: false, reason: 'notClosed' };
  return {
    ok: true,
    state: {
      ...state,
      closedSlots: state.closedSlots.filter((c) => !(c.doctorId === doctorId && c.date === date && c.time === time)),
    },
  };
}
