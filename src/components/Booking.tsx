'use client';

import { useState } from 'react';
import type { Dictionary } from '@/lib/i18n/types';
import type { Locale } from '@/lib/i18n/config';
import Calendar from './Calendar';
import BookingForm from './BookingForm';
import { HeartIcon, PawIcon } from './icons';

interface Props {
  dict: Dictionary;
  locale: Locale;
}

export default function Booking({ dict, locale }: Props) {
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);

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
      />
      <BookingForm
        dict={dict}
        locale={locale}
        selectedDate={selectedDate}
        selectedTime={selectedTime}
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
