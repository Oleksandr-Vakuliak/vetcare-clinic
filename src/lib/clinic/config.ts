// Clinic-wide demo configuration shared by the site calendar, the pet account
// and the admin panel.

import type { DayHours } from './types.ts';

/** All dates and times in the demo are wall-clock values in this zone. */
export const CLINIC_TIME_ZONE = 'Europe/Bucharest';

/** v1 limitation: every appointment has the same length and starts on this grid. */
export const SLOT_MINUTES = 30;

/** Earliest and latest time offered in the working-hours editor. */
export const DAY_START = '07:00';
export const DAY_END = '21:00';

/** Fictional doctors (names are translated in the dictionaries under records.doctors). */
export const DOCTORS = ['koval', 'melnyk'] as const;
export type DoctorId = (typeof DOCTORS)[number];

export function isDoctorId(value: unknown): value is DoctorId {
  return typeof value === 'string' && (DOCTORS as readonly string[]).includes(value);
}

/** Owner key of the pets shown in the demo pet account. */
export const ACCOUNT_OWNER_KEY = 'anna';

function day(start: string, end: string, breakStart: string | null = null, breakEnd: string | null = null): DayHours {
  return { start, end, breakStart, breakEnd };
}

/** Default weekly hours, Monday first (null = day off). Together they cover Mon–Sun. */
export function defaultWeek(doctorId: DoctorId): Array<DayHours | null> {
  if (doctorId === 'koval') {
    const weekday = day('09:00', '17:00', '13:00', '14:00');
    return [weekday, weekday, weekday, weekday, weekday, day('09:00', '14:00'), null];
  }
  const weekday = day('11:00', '19:00', '15:00', '15:30');
  return [weekday, weekday, weekday, weekday, weekday, null, day('10:00', '16:00', '13:00', '13:30')];
}
