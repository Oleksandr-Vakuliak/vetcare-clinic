// Pet account types. The data itself is the shared demo model (../clinic/types.ts);
// this file adds the pet form types and the legacy v1 shape used for migration.

export type {
  Appointment,
  DemoState,
  Pet,
  PetDocument,
  Species,
  TabId,
  Text,
  UiState,
  Vaccination,
} from '../clinic/types.ts';

import type { Species, TabId, Text } from '../clinic/types.ts';

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

/** Stored shape of the first pet-account release (`vetcare.petAccount.v1`). */
export interface AccountStateV1 {
  version: 1;
  seededAt: string;
  pets: Array<{
    id: string;
    name: Text;
    species: Species;
    breed: Text | null;
    birthDate: string;
    weightKg: number;
    photo: 'cat' | 'dog' | null;
  }>;
  appointments: Array<{
    id: string;
    petId: string;
    date: string;
    time: string;
    reasonKey: string;
    doctorKey: string;
    demoAdded: boolean;
  }>;
  visits: Array<{
    id: string;
    petId: string;
    date: string;
    reasonKey: string;
    doctorKey: string;
    noteKey: string;
  }>;
  vaccinations: Array<{ id: string; petId: string; nameKey: string; date: string; nextDate: string | null }>;
  documents: Array<{ id: string; petId: string; titleKey: string; date: string; bodyKey: string }>;
  ui: { petId: string; tab: TabId };
}
