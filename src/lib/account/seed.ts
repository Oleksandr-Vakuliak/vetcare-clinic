import { addDays, addMonths, addYears, toISODate } from './dates.ts';
import type { AccountState, Pet } from './types.ts';

/**
 * Builds the demo account state, with every date computed relative to
 * `today` so upcoming items (appointments, next vaccinations) are always
 * in the future no matter when the demo is first opened.
 */
export function createSeed(today: Date): AccountState {
  const todayIso = toISODate(today);

  const murchykBirth = addMonths(addYears(todayIso, -3), -2);
  const lunaBirth = addMonths(addYears(todayIso, -5), -4);

  const pets: Pet[] = [
    {
      id: 'murchyk',
      name: { key: 'murchyk' },
      species: 'cat',
      breed: { key: 'europeanShorthair' },
      birthDate: murchykBirth,
      weightKg: 4.5,
      photo: 'cat',
    },
    {
      id: 'luna',
      name: { key: 'luna' },
      species: 'dog',
      breed: { key: 'goldenRetriever' },
      birthDate: lunaBirth,
      weightKg: 28,
      photo: 'dog',
    },
  ];

  const murchykCheckupVisitDate = addDays(todayIso, -10);
  const murchykVaccinationVisitDate = addDays(todayIso, -310);
  const lunaDentalVisitDate = addDays(todayIso, -45);
  const lunaCheckupVisitDate = addDays(todayIso, -200);

  return {
    version: 1,
    seededAt: todayIso,
    pets,
    appointments: [
      {
        id: 'appt-murchyk-1',
        petId: 'murchyk',
        date: addDays(todayIso, 17),
        time: '11:30',
        reasonKey: 'checkup',
        doctorKey: 'koval',
        demoAdded: false,
      },
      {
        id: 'appt-luna-1',
        petId: 'luna',
        date: addDays(todayIso, 9),
        time: '09:00',
        reasonKey: 'vaccination',
        doctorKey: 'melnyk',
        demoAdded: false,
      },
    ],
    visits: [
      {
        id: 'visit-murchyk-1',
        petId: 'murchyk',
        date: murchykCheckupVisitDate,
        reasonKey: 'checkup',
        doctorKey: 'koval',
        noteKey: 'checkupNote',
      },
      {
        id: 'visit-murchyk-2',
        petId: 'murchyk',
        date: murchykVaccinationVisitDate,
        reasonKey: 'vaccination',
        doctorKey: 'koval',
        noteKey: 'vaccinationNote',
      },
      {
        id: 'visit-luna-1',
        petId: 'luna',
        date: lunaDentalVisitDate,
        reasonKey: 'dental',
        doctorKey: 'melnyk',
        noteKey: 'dentalNote',
      },
      {
        id: 'visit-luna-2',
        petId: 'luna',
        date: lunaCheckupVisitDate,
        reasonKey: 'checkup',
        doctorKey: 'melnyk',
        noteKey: 'checkupNote',
      },
    ],
    vaccinations: [
      {
        id: 'vacc-murchyk-1',
        petId: 'murchyk',
        nameKey: 'rabies',
        date: murchykVaccinationVisitDate,
        nextDate: addDays(todayIso, 56),
      },
      {
        id: 'vacc-murchyk-2',
        petId: 'murchyk',
        nameKey: 'complexCat',
        date: murchykVaccinationVisitDate,
        nextDate: addDays(todayIso, 33),
      },
      {
        id: 'vacc-luna-1',
        petId: 'luna',
        nameKey: 'rabies',
        date: lunaCheckupVisitDate,
        nextDate: addDays(todayIso, 165),
      },
      {
        id: 'vacc-luna-2',
        petId: 'luna',
        nameKey: 'complexDog',
        date: lunaCheckupVisitDate,
        nextDate: null,
      },
    ],
    documents: [
      {
        id: 'doc-murchyk-1',
        petId: 'murchyk',
        titleKey: 'afterCheckup',
        date: murchykCheckupVisitDate,
        bodyKey: 'afterCheckupBody',
      },
      {
        id: 'doc-murchyk-2',
        petId: 'murchyk',
        titleKey: 'vaccineNote',
        date: murchykVaccinationVisitDate,
        bodyKey: 'vaccineNoteBody',
      },
      {
        id: 'doc-luna-1',
        petId: 'luna',
        titleKey: 'afterCheckup',
        date: lunaCheckupVisitDate,
        bodyKey: 'afterCheckupBody',
      },
      {
        id: 'doc-luna-2',
        petId: 'luna',
        titleKey: 'careTips',
        date: lunaDentalVisitDate,
        bodyKey: 'careTipsBody',
      },
    ],
    ui: {
      petId: 'murchyk',
      tab: 'visits',
    },
  };
}
