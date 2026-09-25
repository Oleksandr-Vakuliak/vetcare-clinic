'use client';

import { useId, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { addDays } from '@/lib/account/dates';
import { DOCTORS, SLOT_MINUTES, isDoctorId } from '@/lib/clinic/config';
import { closeSlot, doctorDay, reopenSlot } from '@/lib/clinic/schedule';
import type { DoctorSlot } from '@/lib/clinic/schedule';
import { clinicNow, weekdayIndex } from '@/lib/clinic/time';
import { appointmentPet, doctorName, fill, statusLabel } from '../account/format';
import { commitDemo, useDemoState } from '../demo-store';
import { ChevronLeftIcon, ChevronRightIcon, GearIcon } from '../icons';
import { useAdmin } from './AdminContext';
import HoursDialog from './HoursDialog';
import { formatLongDate, formatShortDate, formatWhen } from './format';
import { useAppointmentActions } from './useAppointmentActions';

// "Розклад": a doctor's day or week. Working hours and breaks are edited in a
// dialog; single slots can be closed and reopened. A booked slot can't be closed —
// the conflict is explained and the appointment has to be moved or cancelled first.
export default function ScheduleView() {
  const { a, d, locale, notify } = useAdmin();
  const s = a.schedule;
  const uid = useId();
  const params = useSearchParams();
  const requested = params.get('doctor');
  const state = useDemoState();
  const actions = useAppointmentActions(state);
  const [doctorId, setDoctorId] = useState<string>(isDoctorId(requested) ? requested : DOCTORS[0]);
  const [view, setView] = useState<'day' | 'week'>('day');
  const [date, setDate] = useState(() => clinicNow().date);
  const [hoursOpener, setHoursOpener] = useState<HTMLElement | null>(null);

  if (!state) return <p className="account-loading">{a.loading}</p>;

  const now = clinicNow();
  const weekStart = addDays(date, -weekdayIndex(date));
  const step = view === 'day' ? 1 : 7;

  function toggle(slot: DoctorSlot, close: boolean) {
    const operation = close ? closeSlot : reopenSlot;
    const error = commitDemo((st) => {
      const result = operation(st, doctorId, date, slot.time, clinicNow());
      return result.ok ? result : { ok: false as const, error: result.reason };
    });
    if (error === 'conflict' && slot.appointment) {
      notify(fill(s.slotConflict, { time: slot.time, pet: appointmentPet(slot.appointment, state!.pets, d).name }), 'error');
    } else if (error) {
      notify(s.closeErrors[error as keyof typeof s.closeErrors] ?? a.errors.invalid, 'error');
    } else {
      notify(close ? a.notices.slotClosed : a.notices.slotReopened);
    }
  }

  const day = doctorDay(state, doctorId, date, now);

  return (
    <>
      <div className="admin-head">
        <div>
          <h1 className="admin-title">{s.title}</h1>
          <p className="admin-date">{fill(s.slotLength, { min: SLOT_MINUTES })}</p>
        </div>
        <button type="button" className="btn btn--primary btn--lg" onClick={(e) => setHoursOpener(e.currentTarget)}>
          <GearIcon width={20} height={20} /> {s.hoursButton}
        </button>
      </div>

      <section className="admin-card admin-panel" aria-labelledby="sc-title">
        <h2 id="sc-title" className="visually-hidden">
          {s.title}
        </h2>
        <div className="admin-filters admin-filters--schedule">
          <div className="admin-field">
            <label htmlFor={`${uid}-doc`} className="visually-hidden">
              {s.doctor}
            </label>
            <select id={`${uid}-doc`} value={doctorId} onChange={(e) => setDoctorId(e.target.value)}>
              {DOCTORS.map((id) => (
                <option key={id} value={id}>
                  {doctorName(id, d)}
                </option>
              ))}
            </select>
          </div>
          <div className="admin-toggle" role="group" aria-label={s.view}>
            {(['day', 'week'] as const).map((v) => (
              <button key={v} type="button" aria-pressed={view === v} onClick={() => setView(v)}>
                {s[v]}
              </button>
            ))}
          </div>
          <div className="admin-datenav">
            <button type="button" className="icon-btn" aria-label={s.prev} onClick={() => setDate(addDays(date, -step))}>
              <ChevronLeftIcon width={20} height={20} />
            </button>
            <label htmlFor={`${uid}-date`} className="visually-hidden">
              {s.date}
            </label>
            <input id={`${uid}-date`} type="date" value={date} onChange={(e) => e.target.value && setDate(e.target.value)} />
            <button type="button" className="icon-btn" aria-label={s.next} onClick={() => setDate(addDays(date, step))}>
              <ChevronRightIcon width={20} height={20} />
            </button>
            <button type="button" className="btn btn--ghost btn--sm" onClick={() => setDate(now.date)}>
              {s.today}
            </button>
          </div>
        </div>

        {view === 'day' ? renderDay() : renderWeek()}
      </section>

      {actions.element}
      {hoursOpener && <HoursDialog state={state} doctorId={doctorId} returnFocus={hoursOpener} onClose={() => setHoursOpener(null)} />}
    </>
  );

  function hoursLine(hours: NonNullable<typeof day.hours>) {
    const range = fill(s.hoursRange, { start: hours.start, end: hours.end });
    return hours.breakStart && hours.breakEnd
      ? `${range}, ${fill(s.breakRange, { start: hours.breakStart, end: hours.breakEnd })}`
      : range;
  }

  function renderDay() {
    return (
      <div className="schedule-day">
        <h3 className="admin-subtitle">
          {formatLongDate(date, locale)} · {day.hours ? hoursLine(day.hours) : s.dayOff}
        </h3>
        {day.slots.length > 0 && (
          <ul className="slot-list">
            {day.slots.map((slot) => {
              const label = slot.past && slot.state !== 'booked' ? s.states.past : s.states[slot.state];
              const pet = slot.appointment ? appointmentPet(slot.appointment, state!.pets, d).name : null;
              return (
                <li key={slot.time} className={`slot-row slot-row--${slot.state}${slot.past ? ' is-past' : ''}`}>
                  <strong className="slot-row__time">{slot.time}</strong>
                  <span className="slot-row__state">
                    {label}
                    {slot.appointment && (
                      <>
                        {': '}
                        {pet}{' '}
                        <span className={`status-badge status-badge--${slot.appointment.status}`}>
                          {statusLabel(slot.appointment.status, d)}
                        </span>
                      </>
                    )}
                  </span>
                  <span className="slot-row__actions">
                    {slot.appointment && (
                      <button type="button" className="btn btn--outline btn--sm" onClick={(e) => actions.openDetails(slot.appointment!.id, e.currentTarget)}>
                        {a.actions.details}
                        <span className="visually-hidden">: {pet}, {slot.time}</span>
                      </button>
                    )}
                    {!slot.past && (slot.state === 'free' || slot.state === 'booked') && (
                      <button type="button" className="btn btn--ghost btn--sm" onClick={() => toggle(slot, true)}>
                        {s.close}
                        <span className="visually-hidden"> {slot.time}</span>
                      </button>
                    )}
                    {!slot.past && slot.state === 'closed' && (
                      <button type="button" className="btn btn--outline btn--sm" onClick={() => toggle(slot, false)}>
                        {s.reopen}
                        <span className="visually-hidden"> {slot.time}</span>
                      </button>
                    )}
                  </span>
                </li>
              );
            })}
          </ul>
        )}
        {day.outside.length > 0 && (
          <div className="admin-conflict">
            <p>
              <strong>{s.outsideTitle}</strong>
            </p>
            <ul>
              {day.outside.map((x) => (
                <li key={x.id}>
                  <button type="button" className="link-btn" onClick={(e) => actions.openDetails(x.id, e.currentTarget)}>
                    {formatWhen(x.date, x.time, locale)} — {appointmentPet(x, state!.pets, d).name}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    );
  }

  function renderWeek() {
    return (
      <ul className="schedule-week">
        {Array.from({ length: 7 }, (_, i) => {
          const iso = addDays(weekStart, i);
          const info = doctorDay(state!, doctorId, iso, now);
          const count = (st: string) => info.slots.filter((x) => x.state === st && (st === 'booked' || !x.past)).length;
          return (
            <li key={iso} className={`admin-card week-day${iso === now.date ? ' is-today' : ''}`}>
              <h3 className="week-day__title">{formatShortDate(iso, locale)}</h3>
              <p className="week-day__hours">{info.hours ? hoursLine(info.hours) : s.dayOff}</p>
              {info.hours && (
                <p className="record-row__muted">
                  {fill(s.summary, { booked: count('booked'), free: count('free'), closed: count('closed') })}
                </p>
              )}
              <button
                type="button"
                className="btn btn--outline btn--sm"
                onClick={() => {
                  setDate(iso);
                  setView('day');
                }}
              >
                {s.openDay}
                <span className="visually-hidden">: {formatShortDate(iso, locale)}</span>
              </button>
            </li>
          );
        })}
      </ul>
    );
  }
}
