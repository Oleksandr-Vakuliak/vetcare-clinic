import { test } from 'node:test';
import assert from 'node:assert/strict';
import { validatePetInput } from './validate.ts';
import type { PetInput } from './types.ts';

const TODAY = new Date(2026, 8, 25);

function baseInput(overrides: Partial<PetInput> = {}): PetInput {
  return {
    name: 'Bars',
    species: 'cat',
    breed: 'Siamese',
    birthDate: '2023-05-10',
    weight: '4.5',
    ...overrides,
  };
}

test('valid input is accepted, breed trimmed, weight parsed', () => {
  const result = validatePetInput(baseInput({ breed: '  Siamese  ' }), TODAY);
  assert.equal(result.ok, true);
  if (result.ok) {
    assert.equal(result.value.name, 'Bars');
    assert.equal(result.value.species, 'cat');
    assert.equal(result.value.breed, 'Siamese');
    assert.equal(result.value.birthDate, '2023-05-10');
    assert.equal(result.value.weightKg, 4.5);
  }
});

test('empty breed becomes null', () => {
  const result = validatePetInput(baseInput({ breed: '   ' }), TODAY);
  assert.equal(result.ok, true);
  if (result.ok) assert.equal(result.value.breed, null);
});

test('comma decimal weight is accepted', () => {
  const result = validatePetInput(baseInput({ weight: '4,5' }), TODAY);
  assert.equal(result.ok, true);
  if (result.ok) assert.equal(result.value.weightKg, 4.5);
});

test('missing required fields', () => {
  const result = validatePetInput(
    { name: '  ', species: '', breed: '', birthDate: '', weight: '' },
    TODAY,
  );
  assert.equal(result.ok, false);
  if (!result.ok) {
    assert.equal(result.errors.name, 'required');
    assert.equal(result.errors.species, 'required');
    assert.equal(result.errors.birthDate, 'required');
    assert.equal(result.errors.weight, 'required');
    assert.equal(result.errors.breed, undefined);
  }
});

test('invalid birth date string', () => {
  const result = validatePetInput(baseInput({ birthDate: '2026-02-30' }), TODAY);
  assert.equal(result.ok, false);
  if (!result.ok) assert.equal(result.errors.birthDate, 'invalidDate');
});

test('future birth date rejected', () => {
  const result = validatePetInput(baseInput({ birthDate: '2026-09-26' }), TODAY);
  assert.equal(result.ok, false);
  if (!result.ok) assert.equal(result.errors.birthDate, 'futureDate');
});

test('birth date more than 40 years ago rejected', () => {
  const result = validatePetInput(baseInput({ birthDate: '1980-01-01' }), TODAY);
  assert.equal(result.ok, false);
  if (!result.ok) assert.equal(result.errors.birthDate, 'tooOld');
});

test('birth date exactly 40 years ago is accepted', () => {
  const result = validatePetInput(baseInput({ birthDate: '1986-09-25' }), TODAY);
  assert.equal(result.ok, true);
});

test('invalid weight: non-numeric, zero, negative, too heavy', () => {
  for (const weight of ['abc', '0', '-3', '151', '4.5.5']) {
    const result = validatePetInput(baseInput({ weight }), TODAY);
    assert.equal(result.ok, false, `expected weight "${weight}" to be invalid`);
    if (!result.ok) assert.equal(result.errors.weight, 'invalidWeight');
  }
});

test('weight exactly at the 150kg boundary is accepted', () => {
  const result = validatePetInput(baseInput({ weight: '150' }), TODAY);
  assert.equal(result.ok, true);
});
