// Shared demo model (version 2): one local "database" used by the site calendar,
// the pet account and the admin panel. Pure data, no React, no DOM.
// Dates are 'YYYY-MM-DD' and times 'HH:MM', both in clinic time (see time.ts).

export type Species = 'cat' | 'dog';
/** The site form also accepts "other" animals; they never become a Pet. */
export type GuestSpecies = Species | 'other';

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
  /** Fictional owner. */
  owner: Text;
  /** Shown in the demo pet account (the visitor's own pets). */
  inAccount: boolean;
}

/** What a site request keeps instead of a Pet: just enough to identify the visit. */
export interface GuestInfo {
  petName: string;
  species: GuestSpecies;
  ownerName: string;
}

export type AppointmentStatus = 'pending' | 'confirmed' | 'completed' | 'cancelled';
export type AppointmentSource = 'seed' | 'site' | 'account' | 'admin';
export type HistoryAction = 'created' | 'confirmed' | 'rescheduled' | 'completed' | 'cancelled';

export interface HistoryEntry {
  action: HistoryAction;
  /** Clinic date-time of the change, 'YYYY-MM-DDTHH:MM'. */
  at: string;
  /** For "rescheduled": the previous slot. */
  from?: { date: string; time: string; doctorId: string };
}

export interface Appointment {
  id: string;
  /** Registered pet, or null for a site request (see `guest`). */
  petId: string | null;
  guest: GuestInfo | null;
  date: string;
  time: string;
  doctorId: string;
  reason: Text;
  status: AppointmentStatus;
  source: AppointmentSource;
  /** Short demo note shown in the visit history (dictionary key). */
  noteKey: string | null;
  history: HistoryEntry[];
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

/** Working hours of one weekday; the break is optional. */
export interface DayHours {
  start: string;
  end: string;
  breakStart: string | null;
  breakEnd: string | null;
}

export interface DoctorSchedule {
  doctorId: string;
  /** Monday first, length 7; null = day off. */
  week: Array<DayHours | null>;
}

/** A single slot closed for booking by the admin. */
export interface ClosedSlot {
  doctorId: string;
  date: string;
  time: string;
}

export interface UiState {
  petId: string;
  tab: TabId;
}

export interface DemoState {
  version: 2;
  seededAt: string;
  pets: Pet[];
  appointments: Appointment[];
  vaccinations: Vaccination[];
  documents: PetDocument[];
  schedules: DoctorSchedule[];
  closedSlots: ClosedSlot[];
  /** Pet account selection (kept across language switches and reloads). */
  ui: UiState;
}
