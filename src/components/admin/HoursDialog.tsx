'use client';

import { useId, useState } from 'react';
import type { FormEvent } from 'react';
import type { Appointment, DayHours, DemoState } from '@/lib/clinic/types';
import { DOCTORS, SLOT_MINUTES } from '@/lib/clinic/config';
import { editorTimes, setDoctorWeek } from '@/lib/clinic/schedule';
import type { DayHoursError, WeekResult } from '@/lib/clinic/schedule';
import { clinicNow } from '@/lib/clinic/time';
import Dialog from '../account/Dialog';
import { appointmentPet, doctorName, fill } from '../account/format';
import { updateDemo } from '../demo-store';
import { useAdmin } from './AdminContext';
import { formatWhen, weekdayNames } from './format';

interface Row {
  works: boolean;
  start: string;
  end: string;
  breakStart: string;
  breakEnd: string;
}

function toRows(state: DemoState, doctorId: string): Row[] {
  const week = state.schedules.find((s) => s.doctorId === doctorId)?.week ?? [];
  return Array.from({ length: 7 }, (_, i) => {
    const h = week[i] ?? null;
    return {
      works: h !== null,
      start: h?.start ?? '09:00',
      end: h?.end ?? '17:00',
      breakStart: h?.breakStart ?? '',
      breakEnd: h?.breakEnd ?? '',
    };
  });
}

function toWeek(rows: Row[]): Array<DayHours | null> {
  return rows.map((r) =>
    r.works
      ? { start: r.start, end: r.end, breakStart: r.breakStart || null, breakEnd: r.breakEnd || null }
      : null,
  );
}

interface Props {
  state: DemoState;
  doctorId: string;
  returnFocus?: HTMLElement;
  onClose: () => void;
}

// Weekly working hours and one break per day. The model refuses a change that
// would leave upcoming appointments outside the hours; they are listed here and
// have to be rescheduled or cancelled first — nothing is removed silently.
export default function HoursDialog({ state, doctorId: initialDoctor, returnFocus, onClose }: Props) {
  const { a, d, locale, notify } = useAdmin();
  const s = a.schedule;
  const uid = useId();
  const [doctorId, setDoctorId] = useState(initialDoctor);
  const [rows, setRows] = useState<Row[]>(() => toRows(state, initialDoctor));
  const [errors, setErrors] = useState<Array<DayHoursError | null>>([]);
  const [conflicts, setConflicts] = useState<Appointment[]>([]);
  const times = editorTimes();
  const days = weekdayNames(locale);

  function change(i: number, patch: Partial<Row>) {
    setRows((prev) => prev.map((r, j) => (j === i ? { ...r, ...patch } : r)));
    setErrors([]);
    setConflicts([]);
  }

  function chooseDoctor(id: string) {
    setDoctorId(id);
    setRows(toRows(state, id));
    setErrors([]);
    setConflicts([]);
  }

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    // Checked against the latest data (another tab may have added appointments meanwhile).
    let refused: WeekResult | null = null;
    updateDemo((latest) => {
      const result = setDoctorWeek(latest, doctorId, toWeek(rows), clinicNow());
      if (result.ok) return result.state;
      refused = result;
      return latest;
    });
    const failure = refused as WeekResult | null;
    if (failure && !failure.ok) {
      if (failure.reason === 'invalid') setErrors(failure.errors);
      else setConflicts(failure.conflicts);
      return;
    }
    notify(a.notices.hoursSaved);
    onClose();
  }

  const timeSelect = (id: string, label: string, value: string, onChange: (v: string) => void, optional = false) => (
    <div className="pet-form__field">
      <label htmlFor={id}>{label}</label>
      <select id={id} value={value} onChange={(e) => onChange(e.target.value)}>
        {optional && <option value="">{s.noBreak}</option>}
        {times.map((t) => (
          <option key={t} value={t}>
            {t}
          </option>
        ))}
      </select>
    </div>
  );

  return (
    <Dialog title={fill(s.hoursTitle, { name: doctorName(doctorId, d) })} closeLabel={a.close} returnFocus={returnFocus} onClose={onClose} wide>
      <form className="pet-form admin-form" onSubmit={submit} noValidate>
        <div className="pet-form__field">
          <label htmlFor={`${uid}-doctor`}>{s.doctor}</label>
          <select id={`${uid}-doctor`} value={doctorId} onChange={(e) => chooseDoctor(e.target.value)}>
            {DOCTORS.map((id) => (
              <option key={id} value={id}>
                {doctorName(id, d)}
              </option>
            ))}
          </select>
        </div>
        <p className="dialog-intro">
          {s.hoursIntro} {fill(s.slotLength, { min: SLOT_MINUTES })}
        </p>

        {rows.map((row, i) => {
          const error = errors[i];
          const errorId = `${uid}-${i}-error`;
          return (
            <fieldset key={i} className="hours-row" aria-describedby={error ? errorId : undefined}>
              <legend>{days[i]}</legend>
              <label className="hours-row__toggle">
                <input type="checkbox" checked={row.works} onChange={(e) => change(i, { works: e.target.checked })} />{' '}
                {s.works}
              </label>
              {row.works ? (
                <div className="hours-row__fields">
                  {timeSelect(`${uid}-${i}-s`, s.start, row.start, (v) => change(i, { start: v }))}
                  {timeSelect(`${uid}-${i}-e`, s.end, row.end, (v) => change(i, { end: v }))}
                  {timeSelect(`${uid}-${i}-bs`, s.breakStart, row.breakStart, (v) => change(i, { breakStart: v }), true)}
                  {timeSelect(`${uid}-${i}-be`, s.breakEnd, row.breakEnd, (v) => change(i, { breakEnd: v }), true)}
                </div>
              ) : (
                <span className="record-row__muted">{s.dayOff}</span>
              )}
              {error && (
                <span className="field__error" id={errorId} role="alert">
                  {fill(s.hoursErrors[error], { min: SLOT_MINUTES })}
                </span>
              )}
            </fieldset>
          );
        })}

        {conflicts.length > 0 && (
          <div className="admin-conflict" role="alert">
            <p>
              <strong>{s.conflictTitle}</strong>
            </p>
            <ul>
              {conflicts.map((c) => (
                <li key={c.id}>
                  {formatWhen(c.date, c.time, locale)} — {appointmentPet(c, state.pets, d).name}
                </li>
              ))}
            </ul>
            <p>{s.conflictText}</p>
          </div>
        )}

        <div className="dialog-actions">
          <button type="button" className="btn btn--ghost" onClick={onClose}>
            {a.cancel}
          </button>
          <button type="submit" className="btn btn--primary">
            {a.save}
          </button>
        </div>
      </form>
    </Dialog>
  );
}
