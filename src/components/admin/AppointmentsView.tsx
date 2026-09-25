'use client';

import { useState } from 'react';
import { filterAppointments } from '@/lib/clinic/appointments';
import type { AppointmentFilters } from '@/lib/clinic/appointments';
import { clinicNow } from '@/lib/clinic/time';
import { appointmentPet, fill } from '../account/format';
import { useDemoState } from '../demo-store';
import { PlusIcon } from '../icons';
import { useAdmin } from './AdminContext';
import AppointmentTable from './AppointmentTable';
import Filters from './Filters';
import { useAppointmentActions } from './useAppointmentActions';

const PAGE = 30;
const EMPTY: AppointmentFilters = { query: '', date: '', period: 'upcoming', doctorId: '', status: '' };

// "Записи": every appointment (cancelled ones stay as history) with search,
// filters by date or period, doctor and status, and all actions.
export default function AppointmentsView() {
  const { a, d } = useAdmin();
  const state = useDemoState();
  const actions = useAppointmentActions(state);
  const [filters, setFilters] = useState<AppointmentFilters>(EMPTY);
  const [limit, setLimit] = useState(PAGE);

  if (!state) return <p className="account-loading">{a.loading}</p>;

  const list = filterAppointments(state.appointments, filters, clinicNow(), (x) => {
    const info = appointmentPet(x, state.pets, d);
    return { pet: info.name, owner: info.owner };
  });
  const changed = JSON.stringify(filters) !== JSON.stringify(EMPTY);

  return (
    <>
      <div className="admin-head">
        <h1 className="admin-title">{a.nav.appointments}</h1>
        <button type="button" className="btn btn--primary btn--lg" onClick={(e) => actions.openCreate(e.currentTarget)}>
          <PlusIcon width={20} height={20} /> {a.overview.addAppointment}
        </button>
      </div>

      <section className="admin-card admin-panel" aria-labelledby="ap-title">
        <h2 id="ap-title" className="visually-hidden">
          {a.nav.appointments}
        </h2>
        <Filters
          value={filters}
          withPeriod
          onChange={(next) => {
            setFilters(next);
            setLimit(PAGE);
          }}
        />
        <div className="admin-panel__bar">
          <p className="record-row__muted" aria-live="polite">
            {fill(a.table.found, { n: list.length })}
          </p>
          {changed && (
            <button type="button" className="btn btn--ghost btn--sm" onClick={() => setFilters(EMPTY)}>
              {a.filters.clear}
            </button>
          )}
        </div>
        <div className="admin-table-wrap">
          <AppointmentTable appointments={list.slice(0, limit)} pets={state.pets} actions={actions} showDate caption={a.nav.appointments} />
        </div>
        {list.length > limit && (
          <button type="button" className="btn btn--outline admin-more" onClick={() => setLimit((n) => n + PAGE)}>
            {a.table.showMore}
          </button>
        )}
      </section>

      {actions.element}
    </>
  );
}
