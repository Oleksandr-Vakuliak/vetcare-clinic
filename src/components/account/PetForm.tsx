'use client';

import { useState } from 'react';
import type { FormEvent } from 'react';
import type { AccountDictionary } from '@/lib/i18n/account-types';
import type { Pet, PetFieldError, PetInput, Species } from '@/lib/account/types';
import { validatePetInput } from '@/lib/account/validate';
import { toISODate } from '@/lib/account/dates';

type PetValue = Extract<ReturnType<typeof validatePetInput>, { ok: true }>['value'];

interface Props {
  d: AccountDictionary;
  /** Current values when editing; undefined when adding a new pet. */
  initial?: { input: PetInput };
  onSubmit: (value: PetValue) => void;
  onCancel: () => void;
}

const FIELDS: Array<keyof PetInput> = ['name', 'species', 'breed', 'birthDate', 'weight'];

export function petToInput(pet: Pet, name: string, breed: string | null): PetInput {
  return {
    name,
    species: pet.species,
    breed: breed ?? '',
    birthDate: pet.birthDate,
    weight: String(pet.weightKg),
  };
}

export default function PetForm({ d, initial, onSubmit, onCancel }: Props) {
  const f = d.form;
  const [input, setInput] = useState<PetInput>(
    initial?.input ?? { name: '', species: '', breed: '', birthDate: '', weight: '' },
  );
  const [errors, setErrors] = useState<Partial<Record<keyof PetInput, PetFieldError>>>({});
  const today = toISODate(new Date());

  function set<K extends keyof PetInput>(key: K, value: PetInput[K]) {
    setInput((prev) => ({ ...prev, [key]: value }));
    setErrors((prev) => ({ ...prev, [key]: undefined }));
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const result = validatePetInput(input, new Date());
    if (result.ok) {
      onSubmit(result.value);
      return;
    }
    setErrors(result.errors);
    // Move focus to the first invalid field.
    const firstInvalid = FIELDS.find((key) => result.errors[key]);
    if (firstInvalid) document.getElementById(`pf-${firstInvalid}`)?.focus();
  }

  function errorProps(key: keyof PetInput) {
    return errors[key]
      ? { 'aria-invalid': true as const, 'aria-describedby': `pf-${key}-error` }
      : {};
  }

  function errorText(key: keyof PetInput) {
    const code = errors[key];
    return code ? (
      <span className="field__error" id={`pf-${key}-error`} role="alert">
        {f.errors[code]}
      </span>
    ) : null;
  }

  return (
    <form className="pet-form" onSubmit={handleSubmit} noValidate>
      <div className="pet-form__field">
        <label htmlFor="pf-name">{f.name}</label>
        <input
          id="pf-name"
          type="text"
          maxLength={40}
          autoComplete="off"
          value={input.name}
          onChange={(e) => set('name', e.target.value)}
          aria-required="true"
          {...errorProps('name')}
        />
        {errorText('name')}
      </div>

      <div className="pet-form__field">
        <label htmlFor="pf-species">{f.species}</label>
        <select
          id="pf-species"
          value={input.species}
          onChange={(e) => set('species', e.target.value as Species | '')}
          aria-required="true"
          {...errorProps('species')}
        >
          <option value="">{f.speciesPlaceholder}</option>
          <option value="cat">{d.pets.species.cat}</option>
          <option value="dog">{d.pets.species.dog}</option>
        </select>
        {errorText('species')}
      </div>

      <div className="pet-form__field">
        <label htmlFor="pf-breed">
          {f.breed} <span className="pet-form__hint">({f.breedHint})</span>
        </label>
        <input
          id="pf-breed"
          type="text"
          maxLength={60}
          autoComplete="off"
          value={input.breed}
          onChange={(e) => set('breed', e.target.value)}
        />
      </div>

      <div className="pet-form__row">
        <div className="pet-form__field">
          <label htmlFor="pf-birthDate">{f.birthDate}</label>
          <input
            id="pf-birthDate"
            type="date"
            max={today}
            value={input.birthDate}
            onChange={(e) => set('birthDate', e.target.value)}
            aria-required="true"
            {...errorProps('birthDate')}
          />
          {errorText('birthDate')}
        </div>

        <div className="pet-form__field">
          <label htmlFor="pf-weight">{f.weight}</label>
          <input
            id="pf-weight"
            type="text"
            inputMode="decimal"
            placeholder={f.weightHint}
            value={input.weight}
            onChange={(e) => set('weight', e.target.value)}
            aria-required="true"
            {...errorProps('weight')}
          />
          {errorText('weight')}
        </div>
      </div>

      {!initial && <p className="pet-form__note">{f.photoNote}</p>}

      <div className="dialog-actions">
        <button type="button" className="btn btn--ghost" onClick={onCancel}>
          {d.cancel}
        </button>
        <button type="submit" className="btn btn--primary">
          {f.save}
        </button>
      </div>
    </form>
  );
}
