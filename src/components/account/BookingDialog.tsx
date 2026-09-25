'use client';

import { useState } from 'react';
import type { Dictionary } from '@/lib/i18n/types';
import type { AccountDictionary } from '@/lib/i18n/account-types';
import type { Locale } from '@/lib/i18n/config';
import type { DemoState } from '@/lib/clinic/types';
import { createAppointment } from '@/lib/clinic/appointments';
import { publicSlots } from '@/lib/clinic/schedule';
import { clinicNow } from '@/lib/clinic/time';
import { toISODate } from '@/lib/account/dates';
import Calendar from '../Calendar';
import Dialog from './Dialog';
import { fill } from './format';
import { newId } from '../demo-store';

interface Props {
  site: Dictionary;
  d: AccountDictionary;
  locale: Locale;
  state: DemoState;
  petId: string;
  petName: string;
  onBooked: (next: DemoState) => void;
  onClose: () => void;
  returnFocus?: HTMLElement;
}

// Reuses the site's demo calendar on the shared model: booked (also pending), closed
// and past slots can't be chosen; createAppointment re-checks and picks a free doctor.
// The request starts as "pending" until the demo admin confirms it.
export default function BookingDialog({
  site,
  d,
  locale,
  state,
  petId,
  petName,
  onBooked,
  onClose,
  returnFocus,
}: Props) {
  const [date, setDate] = useState<Date | null>(null);
  const [time, setTime] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  function confirm() {
    if (!date || !time) {
      setError(d.booking.chooseSlot);
      return;
    }
    const result = createAppointment(
      state,
      { petId, guest: null, date: toISODate(date), time, doctorId: null, reason: { key: 'visit' }, source: 'account' },
      clinicNow(),
      newId('appt'),
    );
    if (!result.ok) {
      const e = result.error;
      setError(
        e === 'past'
          ? d.booking.errors.past
          : e === 'taken'
            ? d.booking.errors.taken
            : e === 'offHours' || e === 'closed' || e === 'noDoctor'
              ? d.booking.errors.busy
              : d.booking.errors.invalid,
      );
      setTime(null);
      return;
    }
    onBooked(result.state);
  }

  return (
    <Dialog title={fill(d.booking.title, { name: petName })} closeLabel={d.close} onClose={onClose} returnFocus={returnFocus} wide>
      <p className="dialog-intro">{d.booking.intro}</p>
      <Calendar
        dict={site}
        locale={locale}
        selectedDate={date}
        selectedTime={time}
        onSelectDate={(value) => {
          setDate(value);
          setTime(null);
          setError(null);
        }}
        onSelectTime={(value) => {
          setTime(value);
          setError(null);
        }}
        getSlots={(iso) => publicSlots(state, iso, clinicNow())}
      />
      {error && (
        <p className="field__error" role="alert">
          {error}
        </p>
      )}
      <div className="dialog-actions">
        <button type="button" className="btn btn--ghost" onClick={onClose}>
          {d.cancel}
        </button>
        <button type="button" className="btn btn--primary" onClick={confirm}>
          {d.booking.confirm}
        </button>
      </div>
    </Dialog>
  );
}
