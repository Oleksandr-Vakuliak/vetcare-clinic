'use client';

import { useState } from 'react';
import Link from 'next/link';
import { filterAppointments } from '@/lib/clinic/appointments';
import type { AppointmentFilters } from '@/lib/clinic/appointments';
import { DOCTORS, SLOT_MINUTES } from '@/lib/clinic/config';
import { doctorNowState, freeSlotCount } from '@/lib/clinic/schedule';
import { clinicNow, hasStarted } from '@/lib/clinic/time';
import { appointmentPet, doctorName, fill } from '../account/format';
import { useDemoState } from '../demo-store';
import { ArrowRightIcon, CalendarIcon, ClockIcon, GearIcon, PawIcon, PlusIcon } from '../icons';
import { useAdmin } from './AdminContext';
import AppointmentTable from './AppointmentTable';
import Filters from './Filters';
import HoursDialog from './HoursDialog';
import PetDialog from './PetDialog';
import { formatLongDate } from './format';
import { useAppointmentActions } from './useAppointmentActions';

const DOCTOR_STATES = ['appointment', 'break', 'free'] as const;

// "Огляд" (mockup): today's figures computed from the demo data, the day's
// appointments with search and filters, doctors' current state and quick actions.
export default function Overview() {
  const { a, d, locale } = useAdmin();
  const state = useDemoState();
  const actions = useAppointmentActions(state);
  const [filters, setFilters] = useState<AppointmentFilters>(() => ({
    query: '',
    date: clinicNow().date,
    period: 'upcoming',
    doctorId: '',
    status: '',
  }));
  const [dialog, setDialog] = useState<{ type: 'pet' | 'hours'; opener: HTMLElement } | null>(null);

  if (!state) return <p className="account-loading">{a.loading}</p>;

  const now = clinicNow();
  const o = a.overview;
  const todayCount = state.appointments.filter((x) => x.date === now.date && x.status !== 'cancelled').length;
  const pendingCount = state.appointments.filter((x) => x.status === 'pending' && !hasStarted(x.date, x.time, now)).length;
  const freeCount = freeSlotCount(state, now.date, now);
  const list = filterAppointments(state.appointments, filters, now, (x) => {
    const info = appointmentPet(x, state.pets, d);
    return { pet: info.name, owner: info.owner };
  });

  const stats = [
    { label: o.today, value: todayCount, Icon: CalendarIcon },
    { label: o.pending, value: pendingCount, Icon: ClockIcon },
    { label: o.freeSlots, value: freeCount, Icon: CalendarIcon, hint: fill(o.freeSlotsHint, { min: SLOT_MINUTES }) },
  ];

  return (
    <>
      <div className="admin-head">
        <div>
          <h1 className="admin-title">{o.title}</h1>
          <p className="admin-date">{formatLongDate(now.date, locale)}</p>
        </div>
        <button type="button" className="btn btn--primary btn--lg" onClick={(e) => actions.openCreate(e.currentTarget)}>
          <PlusIcon width={20} height={20} /> {o.addAppointment}
        </button>
      </div>

      <section aria-label={o.statsLabel} className="admin-stats">
        {stats.map(({ label, value, Icon, hint }) => (
          <div key={label} className="admin-card admin-stat">
            <Icon width={34} height={34} className="admin-stat__icon" />
            <p>
              <span className="admin-stat__label">{label}</span>
              <strong className="admin-stat__value">{value}</strong>
              {hint && <span className="admin-stat__hint">{hint}</span>}
            </p>
          </div>
        ))}
      </section>

      <section className="admin-card admin-panel" aria-labelledby="ov-table">
        <div className="admin-panel__head">
          <h2 id="ov-table" className="admin-h2">
            {o.tableTitle}
          </h2>
          <Filters value={filters} onChange={setFilters} />
        </div>
        <div className="admin-table-wrap">
          <AppointmentTable appointments={list} pets={state.pets} actions={actions} caption={o.tableTitle} />
        </div>
        <Link href={`/${locale}/admin/appointments`} className="admin-more">
          {o.allAppointments} <ArrowRightIcon width={18} height={18} />
        </Link>
      </section>

      <div className="admin-split">
        <section className="admin-card admin-panel" aria-labelledby="ov-doctors">
          <h2 id="ov-doctors" className="admin-h2">
            {o.doctorsTitle}
          </h2>
          <ul className="admin-doctors">
            {DOCTORS.map((id) => {
              const nowState = doctorNowState(state, id, now);
              const name = doctorName(id, d);
              return (
                <li key={id}>
                  <span className="admin-doctors__name">{name}</span>
                  <span className="visually-hidden">{fill(o.doctorNow, { name, state: o.doctorStates[nowState] })}</span>
                  <span className="admin-chips" aria-hidden="true">
                    {nowState === 'off' ? (
                      <span className="admin-chip is-active is-off">{o.doctorStates.off}</span>
                    ) : (
                      DOCTOR_STATES.map((s) => (
                        <span key={s} className={`admin-chip admin-chip--${s}${s === nowState ? ' is-active' : ''}`}>
                          {o.doctorStates[s]}
                        </span>
                      ))
                    )}
                  </span>
                  <Link href={`/${locale}/admin/schedule?doctor=${id}`} className="btn btn--outline btn--sm">
                    {o.openSchedule}
                  </Link>
                </li>
              );
            })}
          </ul>
        </section>

        <section className="admin-card admin-panel" aria-labelledby="ov-quick">
          <h2 id="ov-quick" className="admin-h2">
            {o.quickTitle}
          </h2>
          <div className="admin-quick">
            <button type="button" className="admin-quick__btn" onClick={(e) => setDialog({ type: 'pet', opener: e.currentTarget })}>
              <PawIcon width={24} height={24} fill="currentColor" stroke="none" /> {o.addPet}
            </button>
            <button type="button" className="admin-quick__btn" onClick={(e) => setDialog({ type: 'hours', opener: e.currentTarget })}>
              <GearIcon width={24} height={24} /> {o.setHours}
            </button>
          </div>
        </section>
      </div>

      {actions.element}
      {dialog?.type === 'pet' && <PetDialog returnFocus={dialog.opener} onClose={() => setDialog(null)} />}
      {dialog?.type === 'hours' && (
        <HoursDialog state={state} doctorId={DOCTORS[0]} returnFocus={dialog.opener} onClose={() => setDialog(null)} />
      )}
    </>
  );
}
