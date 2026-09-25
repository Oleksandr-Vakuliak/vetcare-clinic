// Pet account view of the shared demo model (../clinic): the visitor's pets,
// their appointments, history, vaccinations and documents.

import { ACCOUNT_OWNER_KEY } from '../clinic/config.ts';
import { byDateTime } from '../clinic/appointments.ts';
import { isActive } from '../clinic/schedule.ts';
import { hasStarted } from '../clinic/time.ts';
import type { ClinicNow } from '../clinic/time.ts';
import type {
  Appointment,
  DemoState,
  Pet,
  PetDocument,
  Species,
  TabId,
  Text,
  Vaccination,
} from '../clinic/types.ts';

const TAB_IDS: TabId[] = ['visits', 'vaccines', 'documents'];

export type PetValue = {
  name: string;
  species: Species;
  breed: string | null;
  birthDate: string;
  weightKg: number;
};

export function petById(state: DemoState, id: string): Pet | null {
  return state.pets.find((pet) => pet.id === id) ?? null;
}

/** Pets shown in the pet account (the visitor's own). */
export function accountPets(state: DemoState): Pet[] {
  return state.pets.filter((pet) => pet.inAccount);
}

/**
 * Adds a pet. From the pet account (default) it belongs to the account owner and
 * becomes the selected pet; the admin panel passes the owner and `inAccount: false`.
 */
export function addPet(
  state: DemoState,
  value: PetValue,
  id: string,
  options: { owner: Text; inAccount: boolean } = { owner: { key: ACCOUNT_OWNER_KEY }, inAccount: true },
): DemoState {
  const pet: Pet = {
    id,
    name: { text: value.name },
    species: value.species,
    breed: value.breed === null ? null : { text: value.breed },
    birthDate: value.birthDate,
    weightKg: value.weightKg,
    photo: null,
    owner: options.owner,
    inAccount: options.inAccount,
  };
  return {
    ...state,
    pets: [...state.pets, pet],
    ui: options.inAccount ? { petId: id, tab: 'visits' } : state.ui,
  };
}

/** Updates the basic data; `owner` is changed only when given (admin panel). */
export function updatePet(state: DemoState, id: string, value: PetValue, owner?: Text): DemoState {
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
        owner: owner ?? pet.owner,
      };
    }),
  };
}

export function selectPet(state: DemoState, petId: string): DemoState {
  if (!accountPets(state).some((pet) => pet.id === petId)) return state;
  return { ...state, ui: { ...state.ui, petId } };
}

export function selectTab(state: DemoState, tab: TabId): DemoState {
  if (!TAB_IDS.includes(tab)) return state;
  return { ...state, ui: { ...state.ui, tab } };
}

/** Pending or confirmed appointments that haven't started yet, soonest first. */
export function upcomingAppointments(state: DemoState, petId: string, now: ClinicNow): Appointment[] {
  return state.appointments
    .filter((a) => a.petId === petId && isActive(a) && !hasStarted(a.date, a.time, now))
    .sort(byDateTime);
}

export function nextAppointment(state: DemoState, petId: string, now: ClinicNow): Appointment | null {
  return upcomingAppointments(state, petId, now)[0] ?? null;
}

/** Cancelled appointments that were still ahead — shown so the visitor sees the change. */
export function cancelledUpcoming(state: DemoState, petId: string, now: ClinicNow): Appointment[] {
  return state.appointments
    .filter((a) => a.petId === petId && a.status === 'cancelled' && !hasStarted(a.date, a.time, now))
    .sort(byDateTime);
}

export function nextVaccination(state: DemoState, petId: string, now: ClinicNow): Vaccination | null {
  const upcoming = state.vaccinations
    .filter((v) => v.petId === petId && v.nextDate !== null && v.nextDate >= now.date)
    .sort((a, b) => (a.nextDate as string).localeCompare(b.nextDate as string));
  return upcoming[0] ?? null;
}

/** Visit history = completed appointments, newest first. */
export function visitsFor(state: DemoState, petId: string): Appointment[] {
  return state.appointments
    .filter((a) => a.petId === petId && a.status === 'completed')
    .sort((a, b) => byDateTime(b, a));
}

export function vaccinationsFor(state: DemoState, petId: string): Vaccination[] {
  return state.vaccinations
    .filter((v) => v.petId === petId)
    .sort((a, b) => b.date.localeCompare(a.date));
}

export function documentsFor(state: DemoState, petId: string): PetDocument[] {
  return state.documents
    .filter((d) => d.petId === petId)
    .sort((a, b) => b.date.localeCompare(a.date));
}
