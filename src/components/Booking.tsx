'use client';

import { useState } from 'react';
import type { Dictionary } from '@/lib/i18n/types';
import type { Locale } from '@/lib/i18n/config';
import Calendar from './Calendar';
import BookingForm from './BookingForm';

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
    </div>
  );
}
