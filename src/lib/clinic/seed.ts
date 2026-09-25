// Demo data for the shared model. Every date is relative to the first visit
// (clinic date), so upcoming items always lie in the future.

import { addDays, addMonths, addYears } from '../account/dates.ts';
import { ACCOUNT_OWNER_KEY, DOCTORS, defaultWeek } from './config.ts';
import { dayTimes, fitsHours, inBreak } from './schedule.ts';
import { dateTimeKey, hasStarted, weekdayIndex } from './time.ts';
import type { ClinicNow } from './time.ts';
import type { Appointment, AppointmentStatus, DemoState, DoctorSchedule, HistoryEntry, Pet } from './types.ts';

export function defaultSchedules(): DoctorSchedule[] {
  return DOCTORS.map((doctorId) => ({ doctorId, week: defaultWeek(doctorId) }));
}

/** Pets of other (fictional) clients — visible only in the admin panel. */
export function clinicPets(today: string): Pet[] {
  const pet = (id: string, species: Pet['species'], breed: string, years: number, months: number, weightKg: number, owner: string): Pet => ({
    id,
    name: { key: id },
    species,
    breed: { key: breed },
    birthDate: addMonths(addYears(today, -years), -months),
    weightKg,
    photo: null,
    owner: { key: owner },
    inAccount: false,
  });
  return [
    pet('bella', 'cat', 'britishShorthair', 2, 5, 3.8, 'iryna'),
    pet('rocky', 'dog', 'beagle', 4, 1, 12.5, 'oleh'),
    pet('simba', 'cat', 'maineCoon', 6, 8, 7.2, 'marko'),
    pet('max', 'dog', 'labrador', 1, 9, 24, 'marko'),
  ];
}

function scheduleDay(schedules: DoctorSchedule[], doctorId: string, date: string) {
  return schedules.find((s) => s.doctorId === doctorId)?.week[weekdayIndex(date)] ?? null;
}

/** Nearest date (moving by `step` days) on which the doctor works at `time`. */
function workingDate(schedules: DoctorSchedule[], doctorId: string, date: string, time: string, step: 1 | -1): string {
  let d = date;
  for (let i = 0; i < 14; i += 1) {
    if (fitsHours(scheduleDay(schedules, doctorId, d), time)) return d;
    d = addDays(d, step);
  }
  return date;
}

function history(status: AppointmentStatus, date: string, time: string): HistoryEntry[] {
  const created: HistoryEntry = { action: 'created', at: dateTimeKey(addDays(date, -7), '09:00') };
  if (status === 'pending') return [created];
  const confirmed: HistoryEntry = { action: 'confirmed', at: dateTimeKey(addDays(date, -6), '10:00') };
  if (status === 'confirmed') return [created, confirmed];
  if (status === 'completed') return [created, confirmed, { action: 'completed', at: dateTimeKey(date, time) }];
  return [created, confirmed, { action: 'cancelled', at: dateTimeKey(addDays(date, -1), '12:00') }];
}

function seedAppointment(
  id: string,
  petId: string,
  date: string,
  time: string,
  doctorId: string,
  reasonKey: string,
  status: AppointmentStatus,
  noteKey: string | null = null,
): Appointment {
  return {
    id,
    petId,
    guest: null,
    date,
    time,
    doctorId,
    reason: { key: reasonKey },
    status,
    source: 'seed',
    noteKey,
    history: history(status, date, time),
  };
}

const REASONS = ['checkup', 'vaccination', 'consultation', 'tests', 'dental', 'ultrasound'];

/**
 * Adds generated appointments of the clinic pets for ~10 days back and ~2 weeks ahead.
 * Slots already used by other records are skipped, so it is safe after a migration.
 */
export function withClinicAppointments(state: DemoState, now: ClinicNow): DemoState {
  const petIds = state.pets.filter((p) => !p.inAccount).map((p) => p.id);
  if (petIds.length === 0) return state;
  const added: Appointment[] = [];
  const taken = (doctorId: string, date: string, time: string) =>
    state.appointments.some((a) => a.doctorId === doctorId && a.date === date && a.time === time) ||
    added.some((a) => a.doctorId === doctorId && a.date === date && a.time === time);
  let counter = 0;

  for (let offset = -10; offset <= 14; offset += 1) {
    const date = addDays(now.date, offset);
    DOCTORS.forEach((doctorId, doctorIndex) => {
      const hours = scheduleDay(state.schedules, doctorId, date);
      if (!hours) return;
      dayTimes(hours)
        .filter((time) => !inBreak(hours, time))
        .forEach((time, index) => {
          if ((offset * 5 + index * 3 + doctorIndex * 2 + 100) % 4 !== 0) return;
          if (taken(doctorId, date, time)) return;
          counter += 1;
          const started = hasStarted(date, time, now);
          let status: AppointmentStatus;
          if (started) status = date === now.date ? 'confirmed' : counter % 7 === 0 ? 'cancelled' : 'completed';
          else status = counter % 11 === 0 ? 'cancelled' : counter % 4 === 0 ? 'pending' : 'confirmed';
          added.push(
            seedAppointment(
              `seed-${date}-${doctorId}-${time.replace(':', '')}`,
              petIds[counter % petIds.length],
              date,
              time,
              doctorId,
              REASONS[counter % REASONS.length],
              status,
              status === 'completed' ? 'completedNote' : null,
            ),
          );
        });
    });
  }
  return { ...state, appointments: [...state.appointments, ...added] };
}

/** The full demo model: the visitor's two pets (pet account) plus the clinic's other clients. */
export function createSeed(now: ClinicNow): DemoState {
  const today = now.date;
  const schedules = defaultSchedules();
  const owner = { key: ACCOUNT_OWNER_KEY };

  const pets: Pet[] = [
    {
      id: 'murchyk',
      name: { key: 'murchyk' },
      species: 'cat',
      breed: { key: 'europeanShorthair' },
      birthDate: addMonths(addYears(today, -3), -2),
      weightKg: 4.5,
      photo: 'cat',
      owner,
      inAccount: true,
    },
    {
      id: 'luna',
      name: { key: 'luna' },
      species: 'dog',
      breed: { key: 'goldenRetriever' },
      birthDate: addMonths(addYears(today, -5), -4),
      weightKg: 28,
      photo: 'dog',
      owner,
      inAccount: true,
    },
    ...clinicPets(today),
  ];

  const past = (days: number, doctorId: string, time: string) =>
    workingDate(schedules, doctorId, addDays(today, -days), time, -1);
  const future = (days: number, doctorId: string, time: string) =>
    workingDate(schedules, doctorId, addDays(today, days), time, 1);

  const murchykCheckup = past(10, 'koval', '10:00');
  const murchykVaccination = past(309, 'koval', '10:30');
  const lunaDental = past(45, 'melnyk', '12:00');
  const lunaCheckup = past(200, 'melnyk', '11:30');

  const state: DemoState = {
    version: 2,
    seededAt: today,
    pets,
    appointments: [
      seedAppointment('appt-murchyk-1', 'murchyk', future(17, 'koval', '11:30'), '11:30', 'koval', 'checkup', 'confirmed'),
      seedAppointment('appt-luna-1', 'luna', future(9, 'melnyk', '11:00'), '11:00', 'melnyk', 'vaccination', 'confirmed'),
      seedAppointment('visit-murchyk-1', 'murchyk', murchykCheckup, '10:00', 'koval', 'checkup', 'completed', 'checkupNote'),
      seedAppointment('visit-murchyk-2', 'murchyk', murchykVaccination, '10:30', 'koval', 'vaccination', 'completed', 'vaccinationNote'),
      seedAppointment('visit-luna-1', 'luna', lunaDental, '12:00', 'melnyk', 'dental', 'completed', 'dentalNote'),
      seedAppointment('visit-luna-2', 'luna', lunaCheckup, '11:30', 'melnyk', 'checkup', 'completed', 'checkupNote'),
    ],
    vaccinations: [
      { id: 'vacc-murchyk-1', petId: 'murchyk', nameKey: 'rabies', date: murchykVaccination, nextDate: addDays(today, 56) },
      { id: 'vacc-murchyk-2', petId: 'murchyk', nameKey: 'complexCat', date: murchykVaccination, nextDate: addDays(today, 90) },
      { id: 'vacc-luna-1', petId: 'luna', nameKey: 'rabies', date: lunaCheckup, nextDate: addDays(today, 165) },
      { id: 'vacc-luna-2', petId: 'luna', nameKey: 'complexDog', date: lunaCheckup, nextDate: null },
    ],
    documents: [
      { id: 'doc-murchyk-1', petId: 'murchyk', titleKey: 'afterCheckup', date: murchykCheckup, bodyKey: 'afterCheckupBody' },
      { id: 'doc-murchyk-2', petId: 'murchyk', titleKey: 'vaccineNote', date: murchykVaccination, bodyKey: 'vaccineNoteBody' },
      { id: 'doc-luna-1', petId: 'luna', titleKey: 'afterCheckup', date: lunaCheckup, bodyKey: 'afterCheckupBody' },
      { id: 'doc-luna-2', petId: 'luna', titleKey: 'careTips', date: lunaDental, bodyKey: 'careTipsBody' },
    ],
    schedules,
    closedSlots: [],
    ui: { petId: 'murchyk', tab: 'visits' },
  };
  return withClinicAppointments(state, now);
}
