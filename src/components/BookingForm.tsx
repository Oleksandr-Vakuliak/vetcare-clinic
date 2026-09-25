'use client';

import { useState } from 'react';
import type { FormEvent } from 'react';
import type { Dictionary } from '@/lib/i18n/types';
import { locales, localeMeta, type Locale } from '@/lib/i18n/config';
import { formatFullDate } from '@/lib/dates';
import { ChevronDownIcon, GlobeIcon, NoteIcon, PawIcon, PhoneIcon, UserIcon } from './icons';

interface Props {
  dict: Dictionary;
  locale: Locale;
  selectedDate: Date | null;
  selectedTime: string | null;
}

type AnimalValue = 'cat' | 'dog' | 'other';

interface Errors {
  name?: string;
  phone?: string;
  date?: string;
}

// Accepts international formats: optional leading +, digits, spaces, (), -, .
function isValidPhone(value: string): boolean {
  if (!/^[+()\d\s.-]+$/.test(value)) return false;
  const digits = value.replace(/\D/g, '');
  return digits.length >= 7 && digits.length <= 15;
}

export default function BookingForm({ dict, locale, selectedDate, selectedTime }: Props) {
  const f = dict.booking.form;

  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [animal, setAnimal] = useState<AnimalValue>('cat');
  const [reason, setReason] = useState('');
  const [commLang, setCommLang] = useState<Locale>(locale);
  const [errors, setErrors] = useState<Errors>({});
  const [showSuccess, setShowSuccess] = useState(false);

  // Any edit hides a previous demo confirmation.
  function dirty<T>(setter: (v: T) => void) {
    return (value: T) => {
      setShowSuccess(false);
      setter(value);
    };
  }

  function validate(): Errors {
    const e: Errors = {};
    if (!name.trim()) e.name = f.errors.nameRequired;
    if (!phone.trim()) e.phone = f.errors.phoneRequired;
    else if (!isValidPhone(phone)) e.phone = f.errors.phoneInvalid;
    if (!selectedDate || !selectedTime) e.date = f.errors.dateRequired;
    return e;
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const found = validate();
    setErrors(found);
    // No network request, no storage — this is a demo only.
    setShowSuccess(Object.keys(found).length === 0);
  }

  const selectionText =
    selectedDate && selectedTime
      ? `${formatFullDate(selectedDate, locale)}, ${selectedTime}`
      : f.noSelection;

  return (
    <form className="booking-form" onSubmit={handleSubmit} noValidate>
      {showSuccess && (
        <p className="form-success" role="status">
          {f.demoSuccess}
        </p>
      )}

      <div className="field">
        <label htmlFor="bf-name" className="visually-hidden">
          {f.nameLabel}
        </label>
        <div className="field__box">
          <UserIcon className="field__icon" width={20} height={20} />
          <input
            id="bf-name"
            type="text"
            value={name}
            onChange={(e) => dirty(setName)(e.target.value)}
            placeholder={f.namePlaceholder}
            autoComplete="name"
            required
            aria-required="true"
            aria-invalid={errors.name ? 'true' : undefined}
            aria-describedby={errors.name ? 'bf-name-error' : undefined}
          />
        </div>
        {errors.name && (
          <span className="field__error" id="bf-name-error" role="alert">
            {errors.name}
          </span>
        )}
      </div>

      <div className="field">
        <label htmlFor="bf-phone" className="visually-hidden">
          {f.phoneLabel}
        </label>
        <div className="field__box">
          <PhoneIcon className="field__icon" width={20} height={20} />
          <input
            id="bf-phone"
            type="tel"
            inputMode="tel"
            value={phone}
            onChange={(e) => dirty(setPhone)(e.target.value)}
            placeholder={`${f.phoneLabel} · ${f.phonePlaceholder}`}
            autoComplete="tel"
            required
            aria-required="true"
            aria-invalid={errors.phone ? 'true' : undefined}
            aria-describedby={errors.phone ? 'bf-phone-error' : undefined}
          />
        </div>
        {errors.phone && (
          <span className="field__error" id="bf-phone-error" role="alert">
            {errors.phone}
          </span>
        )}
      </div>

      <div className="field">
        <label htmlFor="bf-animal" className="visually-hidden">
          {f.animalLabel}
        </label>
        <div className="field__box field__box--select">
          <PawIcon className="field__icon" width={20} height={20} />
          <select
            id="bf-animal"
            value={animal}
            onChange={(e) => dirty<AnimalValue>(setAnimal)(e.target.value as AnimalValue)}
          >
            <option value="cat">{f.animalOptions.cat}</option>
            <option value="dog">{f.animalOptions.dog}</option>
            <option value="other">{f.animalOptions.other}</option>
          </select>
          <ChevronDownIcon className="field__chevron" width={18} height={18} />
        </div>
      </div>

      <div className="field">
        <label htmlFor="bf-reason" className="visually-hidden">
          {f.reasonLabel}
        </label>
        <div className="field__box">
          <NoteIcon className="field__icon" width={20} height={20} />
          <textarea
            id="bf-reason"
            rows={1}
            value={reason}
            onChange={(e) => dirty(setReason)(e.target.value)}
            placeholder={f.reasonLabel}
          />
        </div>
      </div>

      <div className="field">
        <div className="field__box field__box--select field__box--stacked">
          <GlobeIcon className="field__icon" width={20} height={20} />
          <label htmlFor="bf-lang" className="field__inner-label">
            {f.commLangLabel}
          </label>
          <select
            id="bf-lang"
            value={commLang}
            onChange={(e) => dirty<Locale>(setCommLang)(e.target.value as Locale)}
          >
            {locales.map((l) => (
              <option key={l} value={l} lang={localeMeta[l].htmlLang} translate="no">
                {localeMeta[l].endonym}
              </option>
            ))}
          </select>
          <ChevronDownIcon className="field__chevron" width={18} height={18} />
        </div>
      </div>

      {errors.date && (
        <p className="field__error" role="alert" style={{ marginBottom: '0.75rem' }}>
          {errors.date}
        </p>
      )}

      <p className="booking-form__selected" aria-live="polite">
        {f.selectedLabel}: <strong>{selectionText}</strong>
      </p>

      <button type="submit" className="btn btn--primary btn--block btn--lg">
        {f.submit}
      </button>
      <p className="booking-form__hint">{f.demoHint}</p>
    </form>
  );
}
