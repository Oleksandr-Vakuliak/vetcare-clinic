import { getSlotsForDate } from '../booking-data.ts';
import { compareDateTime, parseISODate } from './dates.ts';
import type {
  AccountState,
  Appointment,
  Pet,
  PetDocument,
  Species,
  TabId,
  Vaccination,
  Visit,
} from './types.ts';

const TIME_RE = /^([01]\d|2[0-3]):[0-5]\d$/;
const TAB_IDS: TabId[] = ['visits', 'vaccines', 'documents'];

type PetValue = {
  name: string;
  species: Species;
  breed: string | null;
  birthDate: string;
  weightKg: number;
};

export function petById(state: AccountState, id: string): Pet | null {
  return state.pets.find((pet) => pet.id === id) ?? null;
}

export function addPet(state: AccountState, value: PetValue, id: string): AccountState {
  const pet: Pet = {
    id,
    name: { text: value.name },
    species: value.species,
    breed: value.breed === null ? null : { text: value.breed },
    birthDate: value.birthDate,
    weightKg: value.weightKg,
    photo: null,
  };
  return {
    ...state,
    pets: [...state.pets, pet],
    ui: { petId: id, tab: 'visits' },
  };
}

export function updatePet(state: AccountState, id: string, value: PetValue): AccountState {
  return {
    ...state,
    pets: state.pets.map((pet) => {
      if (pet.id !== id) return pet;
      const speciesChanged = pet.species !== value.species;
      return {
        ...pet,
        name: { text: value.name },
        species: value.species,
        breed: value.breed === null ? null : { text: value.breed },
        birthDate: value.birthDate,
        weightKg: value.weightKg,
        photo: speciesChanged ? null : pet.photo,
      };
    }),
  };
}

export function selectPet(state: AccountState, petId: string): AccountState {
  if (!petById(state, petId)) return state;
  return { ...state, ui: { ...state.ui, petId } };
}

export function selectTab(state: AccountState, tab: TabId): AccountState {
  if (!TAB_IDS.includes(tab)) return state;
  return { ...state, ui: { ...state.ui, tab } };
}

export function isSlotTaken(state: AccountState, date: string, time: string): boolean {
  return state.appointments.some((a) => a.date === date && a.time === time);
}

export function addAppointment(
  state: AccountState,
  input: { petId: string; date: string; time: string },
  now: Date,
  id: string,
):
  | { ok: true; state: AccountState; appointment: Appointment }
  | { ok: false; reason: 'unknownPet' | 'invalid' | 'past' | 'busy' | 'taken' } {
  if (!petById(state, input.petId)) {
    return { ok: false, reason: 'unknownPet' };
  }

  const parsedDate = parseISODate(input.date);
  if (!parsedDate || !TIME_RE.test(input.time)) {
    return { ok: false, reason: 'invalid' };
  }

  const [h, min] = input.time.split(':').map(Number);
  const target = new Date(
    parsedDate.getFullYear(),
    parsedDate.getMonth(),
    parsedDate.getDate(),
    h,
    min,
  );
  if (target.getTime() <= now.getTime()) {
    return { ok: false, reason: 'past' };
  }

  const slot = getSlotsForDate(parsedDate).find((s) => s.time === input.time);
  if (!slot || slot.busy) {
    return { ok: false, reason: 'busy' };
  }

  if (isSlotTaken(state, input.date, input.time)) {
    return { ok: false, reason: 'taken' };
  }

  const appointment: Appointment = {
    id,
    petId: input.petId,
    date: input.date,
    time: input.time,
    reasonKey: 'visit',
    doctorKey: 'koval',
    demoAdded: true,
  };

  return {
    ok: true,
    appointment,
    state: {
      ...state,
      appointments: [...state.appointments, appointment],
    },
  };
}

export function upcomingAppointments(state: AccountState, petId: string, now: Date): Appointment[] {
  return state.appointments
    .filter((a) => a.petId === petId)
    .filter((a) => {
      const parsed = parseISODate(a.date);
      if (!parsed) return false;
      const [h, min] = a.time.split(':').map(Number);
      const target = new Date(parsed.getFullYear(), parsed.getMonth(), parsed.getDate(), h, min);
      return target.getTime() > now.getTime();
    })
    .sort((a, b) => compareDateTime(a.date, a.time, b.date, b.time));
}

export function nextAppointment(state: AccountState, petId: string, now: Date): Appointment | null {
  return upcomingAppointments(state, petId, now)[0] ?? null;
}

export function nextVaccination(state: AccountState, petId: string, today: Date): Vaccination | null {
  const todayMidnight = new Date(today.getFullYear(), today.getMonth(), today.getDate());
  const upcoming = state.vaccinations
    .filter((v) => v.petId === petId && v.nextDate !== null)
    .filter((v) => {
      const parsed = parseISODate(v.nextDate as string);
      return parsed !== null && parsed.getTime() >= todayMidnight.getTime();
    })
    .sort((a, b) => (a.nextDate as string).localeCompare(b.nextDate as string));
  return upcoming[0] ?? null;
}

export function visitsFor(state: AccountState, petId: string): Visit[] {
  return state.visits
    .filter((v) => v.petId === petId)
    .sort((a, b) => b.date.localeCompare(a.date));
}

export function vaccinationsFor(state: AccountState, petId: string): Vaccination[] {
  return state.vaccinations
    .filter((v) => v.petId === petId)
    .sort((a, b) => b.date.localeCompare(a.date));
}

export function documentsFor(state: AccountState, petId: string): PetDocument[] {
  return state.documents
    .filter((d) => d.petId === petId)
    .sort((a, b) => b.date.localeCompare(a.date));
}
