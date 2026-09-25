'use client';

import type { Appointment, Pet } from '@/lib/clinic/types';
import PetImage from '../account/PetImage';
import { appointmentPet, doctorName, fill, reasonText, statusLabel } from '../account/format';
import { PawIcon } from '../icons';
import ActionMenu from './ActionMenu';
import { useAdmin } from './AdminContext';
import { formatShortDate, formatWhen } from './format';
import type { useAppointmentActions } from './useAppointmentActions';

interface Props {
  appointments: Appointment[];
  pets: Pet[];
  actions: ReturnType<typeof useAppointmentActions>;
  /** Show the date column (the overview lists one day, so it only shows the time). */
  showDate?: boolean;
  caption: string;
}

// Readable table on wide screens; on phones each row becomes a card (CSS), so the
// page never scrolls sideways.
export default function AppointmentTable({ appointments, pets, actions, showDate, caption }: Props) {
  const { a, d, locale } = useAdmin();

  if (appointments.length === 0) return <p className="account-empty">{a.table.empty}</p>;

  return (
    <table className="admin-table">
      <caption className="visually-hidden">{caption}</caption>
      <thead>
        <tr>
          <th scope="col">{showDate ? `${a.table.date} · ${a.table.time}` : a.table.time}</th>
          <th scope="col">{a.table.pet}</th>
          <th scope="col">{a.table.doctorReason}</th>
          <th scope="col">{a.table.status}</th>
          <th scope="col">{a.table.actions}</th>
        </tr>
      </thead>
      <tbody>
        {appointments.map((appointment) => {
          const info = appointmentPet(appointment, pets, d);
          const primary = actions.primary(appointment);
          const when = formatWhen(appointment.date, appointment.time, locale);
          return (
            <tr key={appointment.id} className={appointment.status === 'cancelled' ? 'is-cancelled' : undefined}>
              <td className="admin-table__time">
                {showDate && <span className="admin-table__date">{formatShortDate(appointment.date, locale)}</span>}
                <strong>{appointment.time}</strong>
              </td>
              <td>
                <div className="admin-pet">
                  {info.pet ? (
                    <PetImage pet={info.pet} alt="" sizes="48px" className="admin-pet__img" />
                  ) : (
                    <span className="admin-pet__img admin-pet__img--guest" aria-hidden="true">
                      <PawIcon width={24} height={24} />
                    </span>
                  )}
                  <span>
                    <strong className="admin-pet__name">{info.name}</strong>
                    <span className="admin-pet__meta">
                      {info.species} · {info.owner}
                    </span>
                    {appointment.source === 'site' && <span className="demo-tag">{a.table.siteRequest}</span>}
                    {appointment.source === 'account' && <span className="demo-tag">{a.table.fromAccount}</span>}
                  </span>
                </div>
              </td>
              <td>
                <strong className="admin-table__doctor">{doctorName(appointment.doctorId, d)}</strong>
                <span className="admin-pet__meta">{reasonText(appointment.reason, d)}</span>
              </td>
              <td>
                <span className={`status-badge status-badge--${appointment.status}`}>{statusLabel(appointment.status, d)}</span>
              </td>
              <td>
                <div className="admin-table__actions">
                  <button
                    type="button"
                    className="btn btn--outline btn--sm"
                    aria-label={`${primary.label}: ${info.name}, ${when}`}
                    onClick={(e) => primary.onClick(e.currentTarget)}
                  >
                    {primary.label}
                  </button>
                  <ActionMenu label={fill(a.actions.more, { pet: info.name, when })} items={actions.menuItems(appointment)} />
                </div>
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}
