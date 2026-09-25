'use client';

import { useState } from 'react';
import type { Dictionary } from '@/lib/i18n/types';
import type { AccountDictionary } from '@/lib/i18n/account-types';
import type { Locale } from '@/lib/i18n/config';
import type { AccountState } from '@/lib/account/types';
import { addAppointment, isSlotTaken } from '@/lib/account/state';
import { toISODate } from '@/lib/account/dates';
import Calendar from '../Calendar';
import Dialog from './Dialog';
import { fill } from './format';
import { newId } from './store';

interface Props {
  site: Dictionary;
  d: AccountDictionary;
  locale: Locale;
  state: AccountState;
  petId: string;
  petName: string;
  onBooked: (next: AccountState) => void;
  onClose: () => void;
}

// Reuses the site's demo calendar. Past times, busy demo slots and slots that
// already have a demo appointment can't be chosen; addAppointment re-checks it.
export default function BookingDialog({
  site,
  d,
  locale,
  state,
  petId,
  petName,
  onBooked,
  onClose,
}: Props) {
  const [date, setDate] = useState<Date | null>(null);
  const [time, setTime] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  function confirm() {
    if (!date || !time) {
      setError(d.booking.chooseSlot);
      return;
    }
    const result = addAppointment(
      state,
      { petId, date: toISODate(date), time },
      new Date(),
      newId('appt'),
    );
    if (!result.ok) {
      setError(result.reason === 'unknownPet' ? d.booking.errors.invalid : d.booking.errors[result.reason]);
      setTime(null);
      return;
    }
    onBooked(result.state);
  }

  return (
    <Dialog title={fill(d.booking.title, { name: petName })} closeLabel={d.close} onClose={onClose} wide>
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
        isSlotTaken={(day, slot) => isSlotTaken(state, toISODate(day), slot)}
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
