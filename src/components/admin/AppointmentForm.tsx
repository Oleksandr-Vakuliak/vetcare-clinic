'use client';

import { useId, useState } from 'react';
import type { FormEvent } from 'react';
import type { Appointment, DemoState } from '@/lib/clinic/types';
import { DOCTORS } from '@/lib/clinic/config';
import { freeTimes } from '@/lib/clinic/schedule';
import { clinicNow } from '@/lib/clinic/time';
import { doctorName, fill, ownerName, petName } from '../account/format';
import { useAdmin } from './AdminContext';
import { formatWhen } from './format';

/** Reasons the admin can pick (keys of records.reasons). */
const REASONS = ['checkup', 'vaccination', 'consultation', 'tests', 'dental', 'ultrasound'] as const;

export interface AppointmentFormValue {
  petId: string;
  date: string;
  doctorId: string;
  time: string;
  reasonKey: string;
}

interface Props {
  state: DemoState;
  /** Rescheduling: the appointment being moved (pet and reason are fixed). */
  moving?: Appointment;
  initial?: Partial<AppointmentFormValue>;
  error: string | null;
  onSubmit: (value: AppointmentFormValue) => void;
  onCancel: () => void;
}

// Create / reschedule form. Only free times of the chosen doctor and date are
// offered (booked, pending, closed, break and past slots are left out); the model
// re-checks everything on submit.
export default function AppointmentForm({ state, moving, initial, error, onSubmit, onCancel }: Props) {
  const { a, d, locale } = useAdmin();
  const f = a.form;
  const uid = useId();
  const now = clinicNow();
  const [value, setValue] = useState<AppointmentFormValue>({
    petId: moving?.petId ?? initial?.petId ?? '',
    date: initial?.date ?? moving?.date ?? now.date,
    doctorId: initial?.doctorId ?? moving?.doctorId ?? DOCTORS[0],
    time: initial?.time ?? '',
    reasonKey: initial?.reasonKey ?? '',
  });
  const [missing, setMissing] = useState(false);
  const times = value.date && value.doctorId ? freeTimes(state, value.doctorId, value.date, now, moving?.id) : [];
  const time = times.includes(value.time) ? value.time : '';

  function set<K extends keyof AppointmentFormValue>(key: K, v: AppointmentFormValue[K]) {
    setValue((prev) => ({ ...prev, [key]: v }));
    setMissing(false);
  }

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const complete = value.date && value.doctorId && time && (moving || (value.petId && value.reasonKey));
    if (!complete) {
      setMissing(true);
      return;
    }
    onSubmit({ ...value, time });
  }

  const pets = [...state.pets]
    .map((pet) => ({ id: pet.id, label: `${petName(pet, d)} — ${ownerName(pet, d)}` }))
    .sort((x, y) => x.label.localeCompare(y.label, locale));
  const message = missing ? a.errors.required : error;
  const invalid = (empty: boolean) => (missing && empty ? { 'aria-invalid': true as const } : {});

  return (
    <form className="pet-form admin-form" onSubmit={submit} noValidate>
      {moving ? (
        <p className="dialog-intro">
          {fill(f.current, { when: formatWhen(moving.date, moving.time, locale), doctor: doctorName(moving.doctorId, d) })}
        </p>
      ) : (
        <>
          <div className="pet-form__field">
            <label htmlFor={`${uid}-pet`}>{f.pet}</label>
            <select id={`${uid}-pet`} value={value.petId} onChange={(e) => set('petId', e.target.value)} aria-required="true" {...invalid(!value.petId)}>
              <option value="">{f.petPlaceholder}</option>
              {pets.map((pet) => (
                <option key={pet.id} value={pet.id}>
                  {pet.label}
                </option>
              ))}
            </select>
          </div>
          <div className="pet-form__field">
            <label htmlFor={`${uid}-reason`}>{f.reason}</label>
            <select id={`${uid}-reason`} value={value.reasonKey} onChange={(e) => set('reasonKey', e.target.value)} aria-required="true" {...invalid(!value.reasonKey)}>
              <option value="">{f.reasonPlaceholder}</option>
              {REASONS.map((key) => (
                <option key={key} value={key}>
                  {d.records.reasons[key]}
                </option>
              ))}
            </select>
          </div>
        </>
      )}

      <div className="pet-form__row">
        <div className="pet-form__field">
          <label htmlFor={`${uid}-date`}>{f.date}</label>
          <input
            id={`${uid}-date`}
            type="date"
            min={now.date}
            value={value.date}
            onChange={(e) => set('date', e.target.value)}
            aria-required="true"
            {...invalid(!value.date)}
          />
        </div>
        <div className="pet-form__field">
          <label htmlFor={`${uid}-doctor`}>{f.doctor}</label>
          <select id={`${uid}-doctor`} value={value.doctorId} onChange={(e) => set('doctorId', e.target.value)}>
            {DOCTORS.map((id) => (
              <option key={id} value={id}>
                {doctorName(id, d)}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="pet-form__field">
        <label htmlFor={`${uid}-time`}>{f.time}</label>
        <select
          id={`${uid}-time`}
          value={time}
          onChange={(e) => set('time', e.target.value)}
          disabled={times.length === 0}
          aria-required="true"
          aria-describedby={times.length === 0 ? `${uid}-none` : undefined}
          {...invalid(!time)}
        >
          <option value="">{f.timePlaceholder}</option>
          {times.map((t) => (
            <option key={t} value={t}>
              {t}
            </option>
          ))}
        </select>
        {times.length === 0 && (
          <span className="pet-form__hint" id={`${uid}-none`}>
            {f.noTimes}
          </span>
        )}
      </div>

      {!moving && <p className="pet-form__note">{f.adminNote}</p>}
      {message && (
        <p className="field__error" role="alert">
          {message}
        </p>
      )}

      <div className="dialog-actions">
        <button type="button" className="btn btn--ghost" onClick={onCancel}>
          {a.cancel}
        </button>
        <button type="submit" className="btn btn--primary">
          {moving ? f.reschedule : f.create}
        </button>
      </div>
    </form>
  );
}
