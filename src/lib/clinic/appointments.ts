// Appointments: booking rules, status transitions and list filters.
// The same rules apply to the site form, the pet account and the admin panel.

import { parseISODate } from '../account/dates.ts';
import { isDoctorId } from './config.ts';
import { firstFreeDoctor, slotProblem } from './schedule.ts';
import type { SlotProblem } from './schedule.ts';
import { dateTimeKey, hasStarted, isTime, nowKey } from './time.ts';
import type { ClinicNow } from './time.ts';
import type {
  Appointment,
  AppointmentSource,
  AppointmentStatus,
  DemoState,
  GuestInfo,
  HistoryEntry,
  Text,
} from './types.ts';

export type BookingError = 'required' | 'invalid' | 'unknownPet' | 'unknownDoctor' | 'noDoctor' | SlotProblem;

export interface NewAppointment {
  petId: string | null;
  guest: GuestInfo | null;
  date: string;
  time: string;
  /** null = the first free doctor (site form and pet account). */
  doctorId: string | null;
  reason: Text | null;
  source: Exclude<AppointmentSource, 'seed'>;
}

function textFilled(text: Text | null): text is Text {
  if (!text) return false;
  return 'key' in text ? text.key.trim() !== '' : text.text.trim() !== '';
}

function stamp(action: HistoryEntry['action'], now: ClinicNow, from?: HistoryEntry['from']): HistoryEntry {
  return from ? { action, at: nowKey(now), from } : { action, at: nowKey(now) };
}

export type CreateResult =
  | { ok: true; state: DemoState; appointment: Appointment }
  | { ok: false; error: BookingError };

/** Books a slot. Site and account requests start as pending, admin entries as confirmed. */
export function createAppointment(state: DemoState, input: NewAppointment, now: ClinicNow, id: string): CreateResult {
  const guest = input.guest;
  const hasPet = input.petId !== null;
  const guestFilled = guest !== null && guest.petName.trim() !== '' && guest.ownerName.trim() !== '';
  if (hasPet === (guest !== null) || (!hasPet && !guestFilled) || !textFilled(input.reason)) {
    return { ok: false, error: 'required' };
  }
  if (!input.date || !input.time) return { ok: false, error: 'required' };
  if (!parseISODate(input.date) || !isTime(input.time)) return { ok: false, error: 'invalid' };
  if (hasPet && !state.pets.some((p) => p.id === input.petId)) return { ok: false, error: 'unknownPet' };
  if (guest && !['cat', 'dog', 'other'].includes(guest.species)) return { ok: false, error: 'invalid' };

  let doctorId = input.doctorId;
  if (doctorId === null) {
    if (hasStarted(input.date, input.time, now)) return { ok: false, error: 'past' };
    doctorId = firstFreeDoctor(state, input.date, input.time, now);
    if (!doctorId) return { ok: false, error: 'noDoctor' };
  } else if (!isDoctorId(doctorId)) {
    return { ok: false, error: 'unknownDoctor' };
  }

  const problem = slotProblem(state, doctorId, input.date, input.time, now);
  if (problem) return { ok: false, error: problem };

  const appointment: Appointment = {
    id,
    petId: input.petId,
    guest: guest ? { petName: guest.petName.trim(), species: guest.species, ownerName: guest.ownerName.trim() } : null,
    date: input.date,
    time: input.time,
    doctorId,
    reason: input.reason,
    status: input.source === 'admin' ? 'confirmed' : 'pending',
    source: input.source,
    noteKey: null,
    history: [stamp('created', now)],
  };
  return { ok: true, appointment, state: { ...state, appointments: [...state.appointments, appointment] } };
}

export type Action = 'confirm' | 'reschedule' | 'complete' | 'cancel';

/** Status transitions that make sense right now (see SPEC §11). */
export function allowedActions(appointment: Appointment, now: ClinicNow): Action[] {
  const started = hasStarted(appointment.date, appointment.time, now);
  switch (appointment.status) {
    case 'pending':
      return started ? ['reschedule', 'cancel'] : ['confirm', 'reschedule', 'cancel'];
    case 'confirmed':
      return started ? ['complete', 'reschedule', 'cancel'] : ['reschedule', 'cancel'];
    default:
      return [];
  }
}

export type ChangeResult =
  | { ok: true; state: DemoState }
  | { ok: false; error: 'notFound' | 'notAllowed' | 'sameSlot' | BookingError };

function change(
  state: DemoState,
  id: string,
  action: Action,
  now: ClinicNow,
  apply: (a: Appointment) => Appointment,
): ChangeResult {
  const current = state.appointments.find((a) => a.id === id);
  if (!current) return { ok: false, error: 'notFound' };
  if (!allowedActions(current, now).includes(action)) return { ok: false, error: 'notAllowed' };
  return {
    ok: true,
    state: { ...state, appointments: state.appointments.map((a) => (a.id === id ? apply(a) : a)) },
  };
}

function withStatus(status: AppointmentStatus, now: ClinicNow, extra: Partial<Appointment> = {}) {
  const action = status === 'confirmed' ? 'confirmed' : status === 'completed' ? 'completed' : 'cancelled';
  return (a: Appointment): Appointment => ({ ...a, ...extra, status, history: [...a.history, stamp(action, now)] });
}

export function confirmAppointment(state: DemoState, id: string, now: ClinicNow): ChangeResult {
  return change(state, id, 'confirm', now, withStatus('confirmed', now));
}

export function completeAppointment(state: DemoState, id: string, now: ClinicNow): ChangeResult {
  return change(state, id, 'complete', now, withStatus('completed', now, { noteKey: 'completedNote' }));
}

/** Cancelled records stay in the list (history); the slot becomes free. */
export function cancelAppointment(state: DemoState, id: string, now: ClinicNow): ChangeResult {
  return change(state, id, 'cancel', now, withStatus('cancelled', now));
}

/** Moves the appointment to another free slot; the status stays the same. */
export function rescheduleAppointment(
  state: DemoState,
  id: string,
  target: { date: string; time: string; doctorId: string },
  now: ClinicNow,
): ChangeResult {
  const current = state.appointments.find((a) => a.id === id);
  if (!current) return { ok: false, error: 'notFound' };
  if (!target.date || !target.time || !target.doctorId) return { ok: false, error: 'required' };
  if (!parseISODate(target.date) || !isTime(target.time)) return { ok: false, error: 'invalid' };
  if (!isDoctorId(target.doctorId)) return { ok: false, error: 'unknownDoctor' };
  if (current.date === target.date && current.time === target.time && current.doctorId === target.doctorId) {
    return { ok: false, error: 'sameSlot' };
  }
  const problem = slotProblem(state, target.doctorId, target.date, target.time, now, id);
  if (problem) return { ok: false, error: problem };
  return change(state, id, 'reschedule', now, (a) => ({
    ...a,
    ...target,
    history: [...a.history, stamp('rescheduled', now, { date: a.date, time: a.time, doctorId: a.doctorId })],
  }));
}

export function byDateTime(a: Appointment, b: Appointment): number {
  return dateTimeKey(a.date, a.time).localeCompare(dateTimeKey(b.date, b.time));
}

export function appointmentsForPet(state: DemoState, petId: string): Appointment[] {
  return state.appointments.filter((a) => a.petId === petId).sort((a, b) => byDateTime(b, a));
}

export interface AppointmentFilters {
  query: string;
  /** Exact day; when set, `period` is ignored. */
  date: string;
  period: 'upcoming' | 'past' | 'all';
  doctorId: string;
  status: AppointmentStatus | '';
}

/**
 * Filters and sorts appointments. `names` resolves the translated pet and owner
 * names used by the search. Upcoming = from today on (ascending), past = newest first.
 */
export function filterAppointments(
  list: Appointment[],
  filters: AppointmentFilters,
  now: ClinicNow,
  names: (a: Appointment) => { pet: string; owner: string },
): Appointment[] {
  const query = filters.query.trim().toLocaleLowerCase();
  const result = list.filter((a) => {
    if (filters.date) {
      if (a.date !== filters.date) return false;
    } else if (filters.period === 'upcoming' && a.date < now.date) {
      return false;
    } else if (filters.period === 'past' && a.date >= now.date) {
      return false;
    }
    if (filters.doctorId && a.doctorId !== filters.doctorId) return false;
    if (filters.status && a.status !== filters.status) return false;
    if (query) {
      const { pet, owner } = names(a);
      if (!pet.toLocaleLowerCase().includes(query) && !owner.toLocaleLowerCase().includes(query)) return false;
    }
    return true;
  });
  const descending = !filters.date && filters.period === 'past';
  return result.sort((a, b) => (descending ? byDateTime(b, a) : byDateTime(a, b)));
}
