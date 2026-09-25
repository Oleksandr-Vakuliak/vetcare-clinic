'use client';

import { useState } from 'react';
import type { ReactNode } from 'react';
import type { Appointment, DemoState } from '@/lib/clinic/types';
import {
  allowedActions,
  cancelAppointment,
  completeAppointment,
  confirmAppointment,
  createAppointment,
  rescheduleAppointment,
} from '@/lib/clinic/appointments';
import type { Action } from '@/lib/clinic/appointments';
import { clinicNow } from '@/lib/clinic/time';
import Dialog from '../account/Dialog';
import { appointmentPet, doctorName, fill, reasonText, statusLabel } from '../account/format';
import { commitDemo, newId } from '../demo-store';
import { useAdmin } from './AdminContext';
import AppointmentForm from './AppointmentForm';
import type { AppointmentFormValue } from './AppointmentForm';
import type { MenuItem } from './ActionMenu';
import { formatWhen } from './format';

type Modal =
  | { type: 'details'; id: string }
  | { type: 'reschedule'; id: string }
  | { type: 'cancel'; id: string }
  | { type: 'create'; preset?: Partial<AppointmentFormValue> };

type ErrorCode = keyof ReturnType<typeof useAdmin>['a']['errors'];

/**
 * Appointment actions shared by the overview, the list and the schedule:
 * confirm / complete run at once; details, reschedule, cancel (with confirmation)
 * and create open dialogs. Every change goes through the shared model's rules.
 */
export function useAppointmentActions(state: DemoState | null) {
  const { a, d, locale, notify } = useAdmin();
  const [modal, setModal] = useState<(Modal & { opener?: HTMLElement }) | null>(null);
  const [formError, setFormError] = useState<string | null>(null);

  const errorText = (code: string) => a.errors[code as ErrorCode] ?? a.errors.invalid;
  const label = (action: Action) => a.actions[action];

  function open(next: Modal, opener?: HTMLElement) {
    setFormError(null);
    setModal({ ...next, opener });
  }
  const close = () => setModal(null);

  function run(action: Action, appointment: Appointment, opener?: HTMLElement) {
    if (action === 'reschedule' || action === 'cancel') {
      open({ type: action, id: appointment.id }, opener);
      return;
    }
    const operation = action === 'confirm' ? confirmAppointment : completeAppointment;
    const error = commitDemo((s) => operation(s, appointment.id, clinicNow()));
    notify(error ? errorText(error) : action === 'confirm' ? a.notices.confirmed : a.notices.completed, error ? 'error' : 'ok');
  }

  /** The main button of a row: confirm a request, complete a started visit, else details. */
  function primary(appointment: Appointment): { label: string; onClick: (opener: HTMLElement) => void } {
    const actions = allowedActions(appointment, clinicNow());
    const main = actions.find((x) => x === 'confirm' || x === 'complete');
    if (main) return { label: label(main), onClick: (el) => run(main, appointment, el) };
    return { label: a.actions.details, onClick: (el) => open({ type: 'details', id: appointment.id }, el) };
  }

  function menuItems(appointment: Appointment): MenuItem[] {
    const items: MenuItem[] = [
      { id: 'details', label: a.actions.details, onSelect: (el) => open({ type: 'details', id: appointment.id }, el) },
    ];
    for (const action of allowedActions(appointment, clinicNow())) {
      items.push({ id: action, label: label(action), onSelect: (el) => run(action, appointment, el) });
    }
    return items;
  }

  const openCreate = (opener?: HTMLElement, preset?: Partial<AppointmentFormValue>) => open({ type: 'create', preset }, opener);
  const openDetails = (id: string, opener?: HTMLElement) => open({ type: 'details', id }, opener);

  let element: ReactNode = null;
  const current = modal && 'id' in modal ? state?.appointments.find((x) => x.id === modal.id) : undefined;

  if (modal && state) {
    if (modal.type === 'create') {
      element = (
        <Dialog title={a.form.createTitle} closeLabel={a.close} returnFocus={modal.opener} onClose={close}>
          <AppointmentForm
            state={state}
            initial={modal.preset}
            error={formError}
            onCancel={close}
            onSubmit={(v) => {
              const error = commitDemo((s) =>
                createAppointment(
                  s,
                  { petId: v.petId, guest: null, date: v.date, time: v.time, doctorId: v.doctorId, reason: { key: v.reasonKey }, source: 'admin' },
                  clinicNow(),
                  newId('adm'),
                ),
              );
              if (error) return setFormError(errorText(error));
              notify(a.notices.created);
              close();
            }}
          />
        </Dialog>
      );
    } else if (!current) {
      element = (
        <Dialog title={a.details.title} closeLabel={a.close} returnFocus={modal.opener} onClose={close}>
          <p className="field__error">{a.errors.notFound}</p>
        </Dialog>
      );
    } else if (modal.type === 'reschedule') {
      element = (
        <Dialog title={a.form.rescheduleTitle} closeLabel={a.close} returnFocus={modal.opener} onClose={close}>
          <AppointmentForm
            state={state}
            moving={current}
            error={formError}
            onCancel={close}
            onSubmit={(v) => {
              const error = commitDemo((s) =>
                rescheduleAppointment(s, current.id, { date: v.date, time: v.time, doctorId: v.doctorId }, clinicNow()),
              );
              if (error) return setFormError(errorText(error));
              notify(a.notices.rescheduled);
              close();
            }}
          />
        </Dialog>
      );
    } else if (modal.type === 'cancel') {
      const info = appointmentPet(current, state.pets, d);
      element = (
        <Dialog title={a.cancelDialog.title} closeLabel={a.close} returnFocus={modal.opener} onClose={close}>
          <p>{fill(a.cancelDialog.text, { pet: info.name, when: formatWhen(current.date, current.time, locale) })}</p>
          {formError && (
            <p className="field__error" role="alert">
              {formError}
            </p>
          )}
          <div className="dialog-actions">
            <button type="button" className="btn btn--ghost" onClick={close}>
              {a.cancelDialog.keep}
            </button>
            <button
              type="button"
              className="btn btn--danger"
              onClick={() => {
                const error = commitDemo((s) => cancelAppointment(s, current.id, clinicNow()));
                if (error) return setFormError(errorText(error));
                notify(a.notices.cancelled);
                close();
              }}
            >
              {a.cancelDialog.confirm}
            </button>
          </div>
        </Dialog>
      );
    } else {
      element = renderDetails(current, modal.opener);
    }
  }

  function renderDetails(appointment: Appointment, opener?: HTMLElement) {
    const info = appointmentPet(appointment, state?.pets ?? [], d);
    const actions = allowedActions(appointment, clinicNow());
    return (
      <Dialog title={a.details.title} closeLabel={a.close} returnFocus={opener} onClose={close}>
        <dl className="details">
          <dt>{a.details.when}</dt>
          <dd>{formatWhen(appointment.date, appointment.time, locale)}</dd>
          <dt>{a.details.pet}</dt>
          <dd>
            {info.name} ({info.species})
          </dd>
          <dt>{a.details.owner}</dt>
          <dd>{info.owner}</dd>
          <dt>{a.details.doctor}</dt>
          <dd>{doctorName(appointment.doctorId, d)}</dd>
          <dt>{a.details.reason}</dt>
          <dd>{reasonText(appointment.reason, d)}</dd>
          <dt>{a.details.status}</dt>
          <dd>
            <span className={`status-badge status-badge--${appointment.status}`}>{statusLabel(appointment.status, d)}</span>
          </dd>
          <dt>{a.details.source}</dt>
          <dd>{a.details.sources[appointment.source]}</dd>
        </dl>
        {appointment.guest && <p className="demo-hint">{a.details.guestNote}</p>}

        {appointment.history.length > 0 && (
          <>
            <h3 className="admin-subtitle">{a.details.history}</h3>
            <ol className="admin-history">
              {appointment.history.map((entry, i) => (
                <li key={i}>
                  <strong>{a.details.historyActions[entry.action]}</strong>{' '}
                  <span className="record-row__muted">{formatWhen(entry.at.slice(0, 10), entry.at.slice(11), locale)}</span>
                  {entry.from && (
                    <span className="record-row__muted">
                      {' '}
                      ({fill(a.details.movedFrom, { when: formatWhen(entry.from.date, entry.from.time, locale), doctor: doctorName(entry.from.doctorId, d) })})
                    </span>
                  )}
                </li>
              ))}
            </ol>
          </>
        )}

        <div className="dialog-actions">
          {actions.length === 0 && <p className="demo-hint">{a.details.noActions}</p>}
          {actions.map((action) => (
            <button
              key={action}
              type="button"
              className={action === 'cancel' ? 'btn btn--ghost' : 'btn btn--primary'}
              onClick={() => {
                if (action === 'confirm' || action === 'complete') {
                  run(action, appointment);
                  close();
                } else {
                  open({ type: action, id: appointment.id }, opener);
                }
              }}
            >
              {label(action)}
            </button>
          ))}
        </div>
      </Dialog>
    );
  }

  return { element, primary, menuItems, openCreate, openDetails };
}
