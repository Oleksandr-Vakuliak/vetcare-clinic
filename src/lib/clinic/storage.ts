// Browser storage of the shared demo model: validation, v1 → v2 migration and
// graceful fallback (unavailable storage, broken JSON, unknown shape).

import { parseISODate } from '../account/dates.ts';
import type { AccountStateV1 } from '../account/types.ts';
import { ACCOUNT_OWNER_KEY } from './config.ts';
import { clinicPets, createSeed, defaultSchedules, withClinicAppointments } from './seed.ts';
import { dateTimeKey, isTime } from './time.ts';
import type { ClinicNow } from './time.ts';
import type { Appointment, DayHours, DemoState, Pet, Text } from './types.ts';

export const STORAGE_KEY = 'vetcare.demo.v2';
/** Where a broken stored value is kept before the seed replaces it. */
export const BACKUP_KEY = `${STORAGE_KEY}.backup`;
/** First pet-account release. */
export const LEGACY_KEY = 'vetcare.petAccount.v1';

export type StorageLike = Pick<Storage, 'getItem' | 'setItem' | 'removeItem'>;

/** How the state was obtained; the UI explains anything but 'stored' / 'seed'. */
export type LoadSource = 'stored' | 'seed' | 'migrated' | 'recovered' | 'unavailable';

type Obj = Record<string, unknown>;

const isObj = (x: unknown): x is Obj => typeof x === 'object' && x !== null && !Array.isArray(x);
const isString = (x: unknown): x is string => typeof x === 'string';
const isDate = (x: unknown): x is string => isString(x) && parseISODate(x) !== null;
const isNum = (x: unknown): x is number => typeof x === 'number' && Number.isFinite(x);
const isArrayOf = <T>(x: unknown, check: (item: unknown) => item is T): x is T[] =>
  Array.isArray(x) && x.every(check);

function isText(x: unknown): x is Text {
  if (!isObj(x)) return false;
  const keys = Object.keys(x);
  return keys.length === 1 && (keys[0] === 'key' || keys[0] === 'text') && isString(x[keys[0]]);
}

function isPetBase(p: Obj): boolean {
  return (
    isString(p.id) &&
    isText(p.name) &&
    (p.species === 'cat' || p.species === 'dog') &&
    (p.breed === null || isText(p.breed)) &&
    isDate(p.birthDate) &&
    isNum(p.weightKg) &&
    (p.photo === null || p.photo === 'cat' || p.photo === 'dog')
  );
}

function isPet(x: unknown): x is Pet {
  return isObj(x) && isPetBase(x) && isText(x.owner) && typeof x.inAccount === 'boolean';
}

function isHistory(x: unknown): boolean {
  if (!isObj(x)) return false;
  const actions = ['created', 'confirmed', 'rescheduled', 'completed', 'cancelled'];
  if (!actions.includes(x.action as string) || !isString(x.at)) return false;
  if (x.from === undefined) return true;
  return isObj(x.from) && isDate(x.from.date) && isTime(x.from.time) && isString(x.from.doctorId);
}

function isAppointment(x: unknown): x is Appointment {
  if (!isObj(x)) return false;
  const guest = x.guest;
  const guestOk =
    guest === null ||
    (isObj(guest) &&
      isString(guest.petName) &&
      isString(guest.ownerName) &&
      ['cat', 'dog', 'other'].includes(guest.species as string));
  return (
    isString(x.id) &&
    (x.petId === null || isString(x.petId)) &&
    guestOk &&
    (x.petId === null) !== (guest === null) &&
    isDate(x.date) &&
    isTime(x.time) &&
    isString(x.doctorId) &&
    isText(x.reason) &&
    ['pending', 'confirmed', 'completed', 'cancelled'].includes(x.status as string) &&
    ['seed', 'site', 'account', 'admin'].includes(x.source as string) &&
    (x.noteKey === null || isString(x.noteKey)) &&
    isArrayOf(x.history, (h): h is unknown => isHistory(h))
  );
}

function isDayHours(x: unknown): x is DayHours | null {
  if (x === null) return true;
  return (
    isObj(x) &&
    isTime(x.start) &&
    isTime(x.end) &&
    (x.breakStart === null || isTime(x.breakStart)) &&
    (x.breakEnd === null || isTime(x.breakEnd))
  );
}

const isRecord = (fields: Array<[string, (v: unknown) => boolean]>) => (x: unknown): x is Obj =>
  isObj(x) && fields.every(([key, check]) => check(x[key]));

const isVaccination = isRecord([
  ['id', isString],
  ['petId', isString],
  ['nameKey', isString],
  ['date', isDate],
  ['nextDate', (v) => v === null || isDate(v)],
]);
const isDocument = isRecord([
  ['id', isString],
  ['petId', isString],
  ['titleKey', isString],
  ['date', isDate],
  ['bodyKey', isString],
]);
const isSchedule = isRecord([
  ['doctorId', isString],
  ['week', (v) => Array.isArray(v) && v.length === 7 && v.every(isDayHours)],
]);
const isClosedSlot = isRecord([
  ['doctorId', isString],
  ['date', isDate],
  ['time', isTime],
]);
const isUi = isRecord([
  ['petId', isString],
  ['tab', (v) => v === 'visits' || v === 'vaccines' || v === 'documents'],
]);

/** Thorough runtime check of a stored v2 model, including references to pets. */
export function isDemoState(x: unknown): x is DemoState {
  if (!isObj(x) || x.version !== 2 || !isDate(x.seededAt)) return false;
  if (!isArrayOf(x.pets, isPet) || !x.pets.some((p) => p.inAccount)) return false;
  if (!isArrayOf(x.appointments, isAppointment)) return false;
  if (!isArrayOf(x.vaccinations, isVaccination) || !isArrayOf(x.documents, isDocument)) return false;
  if (!isArrayOf(x.schedules, isSchedule) || !isArrayOf(x.closedSlots, isClosedSlot)) return false;
  if (!isUi(x.ui)) return false;
  const petIds = new Set(x.pets.map((p) => p.id));
  const refsOk = (items: Obj[]) => items.every((item) => item.petId === null || petIds.has(item.petId as string));
  return refsOk(x.appointments as unknown as Obj[]) && refsOk(x.vaccinations) && refsOk(x.documents);
}

/** Shape check of the first pet-account release. */
export function isAccountStateV1(x: unknown): x is AccountStateV1 {
  if (!isObj(x) || x.version !== 1 || !isDate(x.seededAt)) return false;
  if (!Array.isArray(x.pets) || x.pets.length === 0 || !x.pets.every((p) => isObj(p) && isPetBase(p))) return false;
  const isV1Appointment = isRecord([
    ['id', isString],
    ['petId', isString],
    ['date', isDate],
    ['time', isTime],
    ['reasonKey', isString],
    ['doctorKey', isString],
    ['demoAdded', (v) => typeof v === 'boolean'],
  ]);
  const isVisit = isRecord([
    ['id', isString],
    ['petId', isString],
    ['date', isDate],
    ['reasonKey', isString],
    ['doctorKey', isString],
    ['noteKey', isString],
  ]);
  return (
    isArrayOf(x.appointments, isV1Appointment) &&
    isArrayOf(x.visits, isVisit) &&
    isArrayOf(x.vaccinations, isVaccination) &&
    isArrayOf(x.documents, isDocument) &&
    isUi(x.ui)
  );
}

/**
 * v1 → v2: keeps the visitor's pets, appointments (a visitor's own booking becomes
 * "pending", seed ones "confirmed"), visits (→ completed appointments), vaccinations,
 * documents and selection; adds the clinic's demo pets, schedule and appointments.
 */
export function migrateV1(old: AccountStateV1, now: ClinicNow): DemoState {
  const owner = { key: ACCOUNT_OWNER_KEY };
  const pets: Pet[] = old.pets.map((p) => ({ ...p, owner, inAccount: true }));
  const taken = new Set(pets.map((p) => p.id));
  const extra = clinicPets(now.date).filter((p) => !taken.has(p.id));

  const appointments: Appointment[] = [
    ...old.appointments.map((a): Appointment => {
      const status = a.demoAdded ? 'pending' : 'confirmed';
      return {
        id: a.id,
        petId: a.petId,
        guest: null,
        date: a.date,
        time: a.time,
        doctorId: a.doctorKey,
        reason: { key: a.reasonKey },
        status,
        source: a.demoAdded ? 'account' : 'seed',
        noteKey: null,
        history: [{ action: 'created', at: dateTimeKey(old.seededAt, '00:00') }],
      };
    }),
    ...old.visits.map(
      (v): Appointment => ({
        id: v.id,
        petId: v.petId,
        guest: null,
        date: v.date,
        time: '10:00',
        doctorId: v.doctorKey,
        reason: { key: v.reasonKey },
        status: 'completed',
        source: 'seed',
        noteKey: v.noteKey,
        history: [{ action: 'completed', at: dateTimeKey(v.date, '10:00') }],
      }),
    ),
  ];

  const state: DemoState = {
    version: 2,
    seededAt: old.seededAt,
    pets: [...pets, ...extra],
    appointments,
    vaccinations: old.vaccinations,
    documents: old.documents,
    schedules: defaultSchedules(),
    closedSlots: [],
    ui: old.ui,
  };
  return withClinicAppointments(state, now);
}

function withValidSelection(state: DemoState): DemoState {
  const accountPets = state.pets.filter((p) => p.inAccount);
  return accountPets.some((p) => p.id === state.ui.petId)
    ? state
    : { ...state, ui: { ...state.ui, petId: accountPets[0].id } };
}

function readJson(storage: StorageLike, key: string): { raw: string | null; value: unknown; broken: boolean } {
  const raw = storage.getItem(key);
  if (raw === null) return { raw, value: null, broken: false };
  try {
    return { raw, value: JSON.parse(raw), broken: false };
  } catch {
    return { raw, value: null, broken: true };
  }
}

/**
 * Loads the model. Never throws: unavailable storage → seed in memory; broken data →
 * seed (the broken value is copied to BACKUP_KEY); v1 data → migrated and saved.
 */
export function loadState(storage: StorageLike | null, now: ClinicNow): { state: DemoState; source: LoadSource } {
  if (!storage) return { state: createSeed(now), source: 'unavailable' };
  try {
    const current = readJson(storage, STORAGE_KEY);
    if (current.raw !== null) {
      if (!current.broken && isDemoState(current.value)) {
        return { state: withValidSelection(current.value), source: 'stored' };
      }
      try {
        storage.setItem(BACKUP_KEY, current.raw);
      } catch {
        // Backup is best effort.
      }
      return { state: createSeed(now), source: 'recovered' };
    }

    const legacy = readJson(storage, LEGACY_KEY);
    if (legacy.raw !== null) {
      if (!legacy.broken && isAccountStateV1(legacy.value)) {
        const state = withValidSelection(migrateV1(legacy.value, now));
        if (saveState(storage, state)) storage.removeItem(LEGACY_KEY);
        return { state, source: 'migrated' };
      }
      return { state: createSeed(now), source: 'recovered' };
    }
    return { state: createSeed(now), source: 'seed' };
  } catch {
    return { state: createSeed(now), source: 'unavailable' };
  }
}

export function saveState(storage: StorageLike | null, state: DemoState): boolean {
  if (!storage) return false;
  try {
    storage.setItem(STORAGE_KEY, JSON.stringify(state));
    return true;
  } catch {
    return false;
  }
}

/** Removes the model (and the legacy key) so the next load starts from the seed. */
export function clearState(storage: StorageLike | null): boolean {
  if (!storage) return false;
  try {
    storage.removeItem(STORAGE_KEY);
    storage.removeItem(LEGACY_KEY);
    return true;
  } catch {
    return false;
  }
}
