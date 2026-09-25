import { addYears, parseISODate, toISODate } from './dates.ts';
import type { PetFieldError, PetInput, Species } from './types.ts';

const MAX_AGE_YEARS = 40;
const MAX_WEIGHT_KG = 150;
const WEIGHT_RE = /^\d+(\.\d+)?$/;

export function validatePetInput(
  input: PetInput,
  today: Date,
):
  | {
      ok: true;
      value: { name: string; species: Species; breed: string | null; birthDate: string; weightKg: number };
    }
  | { ok: false; errors: Partial<Record<keyof PetInput, PetFieldError>> } {
  const errors: Partial<Record<keyof PetInput, PetFieldError>> = {};

  const name = input.name.trim();
  if (!name) {
    errors.name = 'required';
  }

  const species = input.species;
  if (species !== 'cat' && species !== 'dog') {
    errors.species = 'required';
  }

  const breedTrimmed = input.breed.trim();
  const breed = breedTrimmed === '' ? null : breedTrimmed;

  const birthDateRaw = input.birthDate.trim();
  let birthDate = '';
  if (!birthDateRaw) {
    errors.birthDate = 'required';
  } else {
    const parsedBirth = parseISODate(birthDateRaw);
    if (!parsedBirth) {
      errors.birthDate = 'invalidDate';
    } else {
      const todayMidnight = new Date(today.getFullYear(), today.getMonth(), today.getDate());
      if (parsedBirth.getTime() > todayMidnight.getTime()) {
        errors.birthDate = 'futureDate';
      } else {
        const oldestAllowed = parseISODate(addYears(toISODate(todayMidnight), -MAX_AGE_YEARS));
        if (oldestAllowed && parsedBirth.getTime() < oldestAllowed.getTime()) {
          errors.birthDate = 'tooOld';
        } else {
          birthDate = birthDateRaw;
        }
      }
    }
  }

  const weightRaw = input.weight.trim();
  let weightKg = 0;
  if (!weightRaw) {
    errors.weight = 'required';
  } else {
    const normalized = weightRaw.replace(',', '.');
    const parsedWeight = Number(normalized);
    if (
      !WEIGHT_RE.test(normalized) ||
      !Number.isFinite(parsedWeight) ||
      parsedWeight <= 0 ||
      parsedWeight > MAX_WEIGHT_KG
    ) {
      errors.weight = 'invalidWeight';
    } else {
      weightKg = parsedWeight;
    }
  }

  if (Object.keys(errors).length > 0) {
    return { ok: false, errors };
  }

  return {
    ok: true,
    value: {
      name,
      species: species as Species,
      breed,
      birthDate,
      weightKg,
    },
  };
}
