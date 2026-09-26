'use client';

import { useId, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { addDays } from '@/lib/account/dates';
import { DOCTORS, SLOT_MINUTES, isDoctorId } from '@/lib/clinic/config';
import { closeSlot, doctorDay, reopenSlot, weekGrid } from '@/lib/clinic/schedule';
import type { DoctorSlot } from '@/lib/clinic/schedule';
import type { Appointment } from '@/lib/clinic/types';
import { clinicNow, weekdayIndex } from '@/lib/clinic/time';
import { appointmentPet, doctorName, fill, statusLabel } from '../account/format';
import { commitDemo, useDemoState } from '../demo-store';
import { ChevronLeftIcon, ChevronRightIcon, GearIcon } from '../icons';
import { useAdmin } from './AdminContext';
import HoursDialog from './HoursDialog';
import { formatLongDate, formatShortDate, formatWhen } from './format';
import { useAppointmentActions } from './useAppointmentActions';

// "Розклад": a doctor's day or a week grid (time × weekday). Working hours and breaks
// are edited in a dialog; single slots can be closed and reopened in the day view. A
// booked slot can't be closed — the conflict is explained and the appointment has to be
// moved or cancelled first.
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
                      <button
                        type="button"
                        className="btn btn--outline btn--sm"
                        aria-label={`${a.actions.details}: ${pet}, ${slot.time}`}
                        onClick={(e) => actions.openDetails(slot.appointment!.id, e.currentTarget)}
                      >
                        {a.actions.details}
                      </button>
                    )}
                    {!slot.past && (slot.state === 'free' || slot.state === 'booked') && (
                      <button type="button" className="btn btn--ghost btn--sm" aria-label={`${s.close} ${slot.time}`} onClick={() => toggle(slot, true)}>
                        {s.close}
                      </button>
                    )}
                    {!slot.past && slot.state === 'closed' && (
                      <button type="button" className="btn btn--outline btn--sm" aria-label={`${s.reopen} ${slot.time}`} onClick={() => toggle(slot, false)}>
                        {s.reopen}
                      </button>
                    )}
                  </span>
                </li>
              );
            })}
          </ul>
        )}
        {renderOutside(day.outside)}
      </div>
    );
  }

  function renderOutside(list: Appointment[]) {
    if (list.length === 0) return null;
    return (
      <div className="admin-conflict">
        <p>
          <strong>{s.outsideTitle}</strong>
        </p>
        <ul>
          {list.map((x) => (
            <li key={x.id}>
              <button type="button" className="link-btn" onClick={(e) => actions.openDetails(x.id, e.currentTarget)}>
                {formatWhen(x.date, x.time, locale)} — {appointmentPet(x, state!.pets, d).name}
              </button>
            </li>
          ))}
        </ul>
      </div>
    );
  }

  function openDay(iso: string) {
    setDate(iso);
    setView('day');
  }

  // Week grid: rows are 30-minute slots, columns are Mon–Sun. Only booked cells are
  // interactive (details); closing and reopening stay in the day view on purpose.
  function renderWeek() {
    const grid = weekGrid(state!, doctorId, weekStart, now);
    const range = `${formatShortDate(weekStart, locale)} – ${formatShortDate(addDays(weekStart, 6), locale)}`;
    const legend = [
      ['free', s.states.free],
      ['booked', s.states.booked],
      ['pending', statusLabel('pending', d)],
      ['closed', s.states.closed],
      ['break', s.states.break],
      ['off', s.offHours],
      ['past', s.states.past],
    ] as const;
    return (
      <div className="schedule-grid">
        <p className="record-row__muted">{s.gridHint}</p>
        <ul className="grid-legend" aria-label={s.legend}>
          {legend.map(([key, label]) => (
            <li key={key}>
              <span className={`grid-legend__swatch grid-cell--${key}`} aria-hidden="true" />
              {label}
            </li>
          ))}
        </ul>
        <div className="week-grid-wrap" role="region" aria-labelledby={`${uid}-grid`} tabIndex={0}>
          <table className="week-grid">
            <caption id={`${uid}-grid`} className="visually-hidden">
              {fill(s.gridCaption, { name: doctorName(doctorId, d), range })}
            </caption>
            <thead>
              <tr>
                <th scope="col" className="week-grid__time">
                  {s.time}
                </th>
                {grid.days.map((day) => (
                  <th
                    key={day.date}
                    scope="col"
                    className={day.date === now.date ? 'is-today' : undefined}
                    aria-current={day.date === now.date ? 'date' : undefined}
                  >
                    <button
                      type="button"
                      className="week-grid__day"
                      aria-label={`${s.openDay}: ${formatLongDate(day.date, locale)}`}
                      onClick={() => openDay(day.date)}
                    >
                      {formatShortDate(day.date, locale)}
                    </button>
                    <span className="week-grid__hours">
                      {day.hours ? fill(s.hoursRange, { start: day.hours.start, end: day.hours.end }) : s.dayOff}
                    </span>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {grid.times.map((time, row) => (
                <tr key={time}>
                  <th scope="row" className="week-grid__time">
                    {time}
                  </th>
                  {grid.days.map((day) => renderCell(day.cells[row], day.date))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {renderOutside(grid.days.flatMap((day) => day.outside))}
      </div>
    );
  }

  function renderCell(slot: DoctorSlot | null, iso: string) {
    if (!slot) {
      return (
        <td key={iso} className="grid-cell grid-cell--off">
          <span className="visually-hidden">{s.offHours}</span>
        </td>
      );
    }
    const past = slot.past ? ' is-past' : '';
    if (slot.appointment) {
      const pet = appointmentPet(slot.appointment, state!.pets, d).name;
      const status = statusLabel(slot.appointment.status, d);
      return (
        <td key={iso} className={`grid-cell grid-cell--booked grid-cell--${slot.appointment.status}${past}`}>
          <button
            type="button"
            className="grid-cell__btn"
            aria-label={`${a.actions.details}: ${pet}, ${formatWhen(iso, slot.time, locale)}, ${status}`}
            onClick={(e) => actions.openDetails(slot.appointment!.id, e.currentTarget)}
          >
            {pet}
          </button>
        </td>
      );
    }
    return (
      <td key={iso} className={`grid-cell grid-cell--${slot.state}${past}`}>
        <span className="visually-hidden">{slot.past ? s.states.past : s.states[slot.state]}</span>
      </td>
    );
  }
}
