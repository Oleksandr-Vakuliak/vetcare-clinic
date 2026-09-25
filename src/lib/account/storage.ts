import { parseISODate } from './dates.ts';
import { createSeed } from './seed.ts';
import type {
  AccountState,
  Appointment,
  Pet,
  PetDocument,
  Text,
  UiState,
  Vaccination,
  Visit,
} from './types.ts';

export const STORAGE_KEY = 'vetcare.petAccount.v1';

export type StorageLike = Pick<Storage, 'getItem' | 'setItem' | 'removeItem'>;

const TIME_RE = /^([01]\d|2[0-3]):[0-5]\d$/;

function isString(x: unknown): x is string {
  return typeof x === 'string';
}

function isFiniteNumber(x: unknown): x is number {
  return typeof x === 'number' && Number.isFinite(x);
}

function isIsoDate(x: unknown): x is string {
  return isString(x) && parseISODate(x) !== null;
}

function isTime(x: unknown): x is string {
  return isString(x) && TIME_RE.test(x);
}

function isText(x: unknown): x is Text {
  if (typeof x !== 'object' || x === null) return false;
  const obj = x as Record<string, unknown>;
  const keys = Object.keys(obj);
  if (keys.length !== 1) return false;
  if (keys[0] === 'key') return isString(obj.key);
  if (keys[0] === 'text') return isString(obj.text);
  return false;
}

function isPet(x: unknown): x is Pet {
  if (typeof x !== 'object' || x === null) return false;
  const p = x as Record<string, unknown>;
  return (
    isString(p.id) &&
    isText(p.name) &&
    (p.species === 'cat' || p.species === 'dog') &&
    (p.breed === null || isText(p.breed)) &&
    isIsoDate(p.birthDate) &&
    isFiniteNumber(p.weightKg) &&
    (p.photo === null || p.photo === 'cat' || p.photo === 'dog')
  );
}

function isAppointment(x: unknown): x is Appointment {
  if (typeof x !== 'object' || x === null) return false;
  const a = x as Record<string, unknown>;
  return (
    isString(a.id) &&
    isString(a.petId) &&
    isIsoDate(a.date) &&
    isTime(a.time) &&
    isString(a.reasonKey) &&
    isString(a.doctorKey) &&
    typeof a.demoAdded === 'boolean'
  );
}

function isVisit(x: unknown): x is Visit {
  if (typeof x !== 'object' || x === null) return false;
  const v = x as Record<string, unknown>;
  return (
    isString(v.id) &&
    isString(v.petId) &&
    isIsoDate(v.date) &&
    isString(v.reasonKey) &&
    isString(v.doctorKey) &&
    isString(v.noteKey)
  );
}

function isVaccination(x: unknown): x is Vaccination {
  if (typeof x !== 'object' || x === null) return false;
  const v = x as Record<string, unknown>;
  return (
    isString(v.id) &&
    isString(v.petId) &&
    isString(v.nameKey) &&
    isIsoDate(v.date) &&
    (v.nextDate === null || isIsoDate(v.nextDate))
  );
}

function isDocument(x: unknown): x is PetDocument {
  if (typeof x !== 'object' || x === null) return false;
  const d = x as Record<string, unknown>;
  return (
    isString(d.id) &&
    isString(d.petId) &&
    isString(d.titleKey) &&
    isIsoDate(d.date) &&
    isString(d.bodyKey)
  );
}

function isUiState(x: unknown): x is UiState {
  if (typeof x !== 'object' || x === null) return false;
  const u = x as Record<string, unknown>;
  return (
    isString(u.petId) &&
    (u.tab === 'visits' || u.tab === 'vaccines' || u.tab === 'documents')
  );
}

/** Thorough runtime shape check, including cross-references between entities and their pets. */
export function isAccountState(x: unknown): x is AccountState {
  if (typeof x !== 'object' || x === null) return false;
  const s = x as Record<string, unknown>;

  if (s.version !== 1) return false;
  if (!isIsoDate(s.seededAt)) return false;
  if (!Array.isArray(s.pets) || s.pets.length === 0 || !s.pets.every(isPet)) return false;
  if (!Array.isArray(s.appointments) || !s.appointments.every(isAppointment)) return false;
  if (!Array.isArray(s.visits) || !s.visits.every(isVisit)) return false;
  if (!Array.isArray(s.vaccinations) || !s.vaccinations.every(isVaccination)) return false;
  if (!Array.isArray(s.documents) || !s.documents.every(isDocument)) return false;
  if (!isUiState(s.ui)) return false;

  const petIds = new Set((s.pets as Pet[]).map((p) => p.id));
  const appointments = s.appointments as Appointment[];
  const visits = s.visits as Visit[];
  const vaccinations = s.vaccinations as Vaccination[];
  const documents = s.documents as PetDocument[];

  if (!appointments.every((a) => petIds.has(a.petId))) return false;
  if (!visits.every((v) => petIds.has(v.petId))) return false;
  if (!vaccinations.every((v) => petIds.has(v.petId))) return false;
  if (!documents.every((d) => petIds.has(d.petId))) return false;

  return true;
}

export function loadState(
  storage: StorageLike | null,
  today: Date,
): { state: AccountState; source: 'stored' | 'seed' } {
  try {
    if (!storage) {
      return { state: createSeed(today), source: 'seed' };
    }
    const raw = storage.getItem(STORAGE_KEY);
    if (!raw) {
      return { state: createSeed(today), source: 'seed' };
    }
    const parsed: unknown = JSON.parse(raw);
    if (!isAccountState(parsed)) {
      return { state: createSeed(today), source: 'seed' };
    }
    const petExists = parsed.pets.some((p) => p.id === parsed.ui.petId);
    const state: AccountState = petExists
      ? parsed
      : { ...parsed, ui: { ...parsed.ui, petId: parsed.pets[0].id } };
    return { state, source: 'stored' };
  } catch {
    return { state: createSeed(today), source: 'seed' };
  }
}

export function saveState(storage: StorageLike | null, state: AccountState): boolean {
  if (!storage) return false;
  try {
    storage.setItem(STORAGE_KEY, JSON.stringify(state));
    return true;
  } catch {
    return false;
  }
}

export function clearState(storage: StorageLike | null): boolean {
  if (!storage) return false;
  try {
    storage.removeItem(STORAGE_KEY);
    return true;
  } catch {
    return false;
  }
}
