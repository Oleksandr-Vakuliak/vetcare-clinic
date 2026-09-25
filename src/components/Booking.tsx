'use client';

import { useState } from 'react';
import type { Dictionary } from '@/lib/i18n/types';
import type { Locale } from '@/lib/i18n/config';
import Calendar from './Calendar';
import BookingForm from './BookingForm';
import { useDemoState } from './demo-store';
import { publicSlots } from '@/lib/clinic/schedule';
import { clinicNow } from '@/lib/clinic/time';
import { HeartIcon, PawIcon } from './icons';

interface Props {
  dict: Dictionary;
  locale: Locale;
}

export default function Booking({ dict, locale }: Props) {
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  // Shared demo model: slots taken in the pet account or the admin panel are busy here too.
  const state = useDemoState();

  function handleSelectDate(date: Date) {
    setSelectedDate(date);
    setSelectedTime(null); // a new date invalidates the previously picked time
  }

  return (
    <div className="booking-grid">
      <Calendar
        dict={dict}
        locale={locale}
        selectedDate={selectedDate}
        selectedTime={selectedTime}
        onSelectDate={handleSelectDate}
        onSelectTime={setSelectedTime}
        getSlots={(iso) => (state ? publicSlots(state, iso, clinicNow()) : [])}
      />
      <BookingForm
        dict={dict}
        locale={locale}
        selectedDate={selectedDate}
        selectedTime={selectedTime}
        onBooked={() => setSelectedTime(null)}
      />
      <p className="handnote booking__note">
        <span className="booking__note-icons" aria-hidden="true">
          <HeartIcon width={30} height={30} />
          <PawIcon width={24} height={24} fill="currentColor" stroke="none" />
        </span>
        {dict.booking.note}
      </p>
    </div>
  );
}
