// Pure data model for the demo "Pet account" feature. No React, no DOM.
// All dates are ISO strings 'YYYY-MM-DD' in LOCAL time; all times are 'HH:MM'.

export type Species = 'cat' | 'dog';

export type TabId = 'visits' | 'vaccines' | 'documents';

/** Seed data uses dictionary keys (translated per language); user input is plain text. */
export type Text = { key: string } | { text: string };

export interface Pet {
  id: string;
  name: Text;
  species: Species;
  breed: Text | null;
  birthDate: string;
  weightKg: number;
  photo: 'cat' | 'dog' | null; // null => stock illustration
}

export interface Appointment {
  id: string;
  petId: string;
  date: string;
  time: string;
  reasonKey: string;
  doctorKey: string;
  demoAdded: boolean;
}

export interface Visit {
  id: string;
  petId: string;
  date: string;
  reasonKey: string;
  doctorKey: string;
  noteKey: string;
}

export interface Vaccination {
  id: string;
  petId: string;
  nameKey: string;
  date: string;
  nextDate: string | null;
}

export interface PetDocument {
  id: string;
  petId: string;
  titleKey: string;
  date: string;
  bodyKey: string;
}

export interface UiState {
  petId: string;
  tab: TabId;
}

export interface AccountState {
  version: 1;
  seededAt: string;
  pets: Pet[];
  appointments: Appointment[];
  visits: Visit[];
  vaccinations: Vaccination[];
  documents: PetDocument[];
  ui: UiState;
}

/** Raw form values, before validation. */
export interface PetInput {
  name: string;
  species: Species | '';
  breed: string;
  birthDate: string;
  weight: string;
}

export type PetFieldError =
  | 'required'
  | 'invalidDate'
  | 'futureDate'
  | 'tooOld'
  | 'invalidWeight';
