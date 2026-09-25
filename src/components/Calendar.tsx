'use client';

import { useState, useSyncExternalStore } from 'react';
import type { Dictionary } from '@/lib/i18n/types';
import type { Locale } from '@/lib/i18n/config';
import {
  buildMonthGrid,
  formatMonthYear,
  formatDayMonth,
  formatFullDate,
  isPastDate,
  isSameDay,
  weekdayShortNames,
} from '@/lib/dates';
import { toISODate } from '@/lib/account/dates';
import { clinicToday } from '@/lib/clinic/time';
import { ChevronLeftIcon, ChevronRightIcon } from './icons';

interface Props {
  dict: Dictionary;
  locale: Locale;
  selectedDate: Date | null;
  selectedTime: string | null;
  onSelectDate: (date: Date) => void;
  onSelectTime: (time: string) => void;
  /** Slots of a clinic date ('YYYY-MM-DD') from the shared demo model. */
  getSlots: (isoDate: string) => Array<{ time: string; available: boolean }>;
}

function subscribeNoop() {
  return () => {};
}

export default function Calendar({
  dict,
  locale,
  selectedDate,
  selectedTime,
  onSelectDate,
  onSelectTime,
  getSlots,
}: Props) {
  const c = dict.booking.calendar;
  // `today` is resolved only on the client (the server snapshot is `false`) so
  // the server and client never disagree about "today" (no hydration mismatch).
  const isClient = useSyncExternalStore(subscribeNoop, () => true, () => false);
  // The visible month is stored as an offset from the current month.
  const [monthOffset, setMonthOffset] = useState(0);

  if (!isClient) {
    return <div className="card calendar" style={{ minHeight: 440 }} aria-hidden="true" />;
  }

  // "Today" is the clinic's date (Europe/Bucharest), not the visitor's.
  const today = clinicToday();
  const monthDate = new Date(today.getFullYear(), today.getMonth() + monthOffset, 1);
  const visible = { y: monthDate.getFullYear(), m: monthDate.getMonth() };
  const cells = buildMonthGrid(visible.y, visible.m);
  const weekdays = weekdayShortNames(locale);
  const atCurrentMonth = visible.y === today.getFullYear() && visible.m === today.getMonth();
  // Busy = booked (incl. pending requests), closed, in a break or already passed.
  const slots = selectedDate
    ? getSlots(toISODate(selectedDate)).map((slot) => ({ time: slot.time, busy: !slot.available }))
    : [];

  function changeMonth(delta: number) {
    setMonthOffset((o) => o + delta);
  }

  // Grey, non-interactive days of the neighbouring months fill the first and last week.
  const leading = cells.filter((d) => d === null).length;
  const prevMonthDays = new Date(visible.y, visible.m, 0).getDate();
  const trailing = (7 - (cells.length % 7)) % 7;

  return (
    <div className="card calendar">
      <p className="calendar__demo">{dict.booking.demoNote}</p>

      <div className="calendar__head">
        <button
          type="button"
          className="calendar__nav"
          onClick={() => changeMonth(-1)}
          disabled={atCurrentMonth}
          aria-label={c.prevMonth}
        >
          <ChevronLeftIcon width={20} height={20} />
        </button>
        <span className="calendar__month">{formatMonthYear(monthDate, locale)}</span>
        <button
          type="button"
          className="calendar__nav"
          onClick={() => changeMonth(1)}
          aria-label={c.nextMonth}
        >
          <ChevronRightIcon width={20} height={20} />
        </button>
      </div>

      <div className="calendar__weekdays" aria-hidden="true">
        {weekdays.map((w, i) => (
          <span key={i} className="calendar__weekday">
            {w}
          </span>
        ))}
      </div>

      <div className="calendar__grid" role="group" aria-label={formatMonthYear(monthDate, locale)}>
        {cells.map((date, i) => {
          if (!date) {
            return (
              <span key={i} className="day day--other" aria-hidden="true">
                {prevMonthDays - leading + i + 1}
              </span>
            );
          }
          const past = isPastDate(date, today);
          const selected = selectedDate ? isSameDay(date, selectedDate) : false;
          return (
            <button
              key={i}
              type="button"
              className="day"
              disabled={past}
              aria-pressed={selected}
              aria-label={
                past
                  ? `${formatFullDate(date, locale)} — ${c.pastDay}`
                  : `${c.chooseDay} ${formatFullDate(date, locale)}`
              }
              onClick={() => onSelectDate(date)}
            >
              {date.getDate()}
            </button>
          );
        })}
        {Array.from({ length: trailing }, (_, i) => (
          <span key={`next-${i}`} className="day day--other" aria-hidden="true">
            {i + 1}
          </span>
        ))}
      </div>

      <div className="slots">
        {!selectedDate ? (
          <p className="slots__empty">{c.selectDatePrompt}</p>
        ) : (
          <>
            <p className="slots__title">
              {c.availableOn} <strong>{formatDayMonth(selectedDate, locale)}</strong>
            </p>
            {slots.length === 0 ? (
              <p className="slots__empty">{c.noSlots}</p>
            ) : (
              <div className="slots__grid" role="group" aria-label={dict.booking.title}>
                {slots.map((slot) => (
                  <button
                    key={slot.time}
                    type="button"
                    className="slot"
                    disabled={slot.busy}
                    aria-pressed={selectedTime === slot.time}
                    aria-label={`${slot.time}${slot.busy ? ` — ${c.legendBusy}` : ''}`}
                    onClick={() => onSelectTime(slot.time)}
                  >
                    {slot.time}
                  </button>
                ))}
              </div>
            )}
          </>
        )}
        <div className="slots__legend" aria-hidden="true">
          <span>
            <i className="dot dot--free" /> {c.legendFree}
          </span>
          <span>
            <i className="dot dot--busy" /> {c.legendBusy}
          </span>
          <span>
            <i className="dot dot--other" /> {c.legendOtherMonth}
          </span>
        </div>
      </div>
    </div>
  );
}
