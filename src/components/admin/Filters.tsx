'use client';

import { useId } from 'react';
import type { AppointmentFilters } from '@/lib/clinic/appointments';
import type { AppointmentStatus } from '@/lib/clinic/types';
import { DOCTORS } from '@/lib/clinic/config';
import { doctorName } from '../account/format';
import { SearchIcon } from '../icons';
import { useAdmin } from './AdminContext';

const STATUSES: AppointmentStatus[] = ['pending', 'confirmed', 'completed', 'cancelled'];

interface Props {
  value: AppointmentFilters;
  onChange: (next: AppointmentFilters) => void;
  /** Appointments list: date is optional and a period select is shown. */
  withPeriod?: boolean;
}

// Search (pet or owner), doctor, status and date filters — labelled controls.
export default function Filters({ value, onChange, withPeriod }: Props) {
  const { a, d } = useAdmin();
  const f = a.filters;
  const uid = useId();
  const set = <K extends keyof AppointmentFilters>(key: K, v: AppointmentFilters[K]) => onChange({ ...value, [key]: v });

  return (
    <div className={`admin-filters${withPeriod ? ' admin-filters--wide' : ''}`} role="search">
      <div className="admin-field admin-field--search">
        <label htmlFor={`${uid}-q`} className="visually-hidden">
          {f.search}
        </label>
        <SearchIcon width={20} height={20} className="admin-field__icon" />
        <input
          id={`${uid}-q`}
          type="search"
          value={value.query}
          placeholder={f.searchPlaceholder}
          onChange={(e) => set('query', e.target.value)}
        />
      </div>
      <div className="admin-field">
        <label htmlFor={`${uid}-doc`} className="visually-hidden">
          {f.doctor}
        </label>
        <select id={`${uid}-doc`} value={value.doctorId} onChange={(e) => set('doctorId', e.target.value)}>
          <option value="">{f.allDoctors}</option>
          {DOCTORS.map((id) => (
            <option key={id} value={id}>
              {doctorName(id, d)}
            </option>
          ))}
        </select>
      </div>
      <div className="admin-field">
        <label htmlFor={`${uid}-st`} className="visually-hidden">
          {f.status}
        </label>
        <select id={`${uid}-st`} value={value.status} onChange={(e) => set('status', e.target.value as AppointmentStatus | '')}>
          <option value="">{f.allStatuses}</option>
          {STATUSES.map((s) => (
            <option key={s} value={s}>
              {d.records.statuses[s]}
            </option>
          ))}
        </select>
      </div>
      {withPeriod && (
        <div className="admin-field">
          <label htmlFor={`${uid}-per`} className="visually-hidden">
            {f.period}
          </label>
          <select
            id={`${uid}-per`}
            value={value.period}
            disabled={Boolean(value.date)}
            onChange={(e) => set('period', e.target.value as AppointmentFilters['period'])}
          >
            {(['upcoming', 'past', 'all'] as const).map((p) => (
              <option key={p} value={p}>
                {f.periods[p]}
              </option>
            ))}
          </select>
        </div>
      )}
      <div className="admin-field admin-field--date">
        <label htmlFor={`${uid}-date`} className="visually-hidden">
          {f.date}
        </label>
        <input id={`${uid}-date`} type="date" value={value.date} onChange={(e) => set('date', e.target.value)} />
      </div>
    </div>
  );
}
