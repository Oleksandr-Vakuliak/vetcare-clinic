'use client';

import { useState, useSyncExternalStore } from 'react';
import type { Dictionary } from '@/lib/i18n/types';
import type { Locale } from '@/lib/i18n/config';
import {
  buildMonthGrid,
  formatMonthYear,
  formatFullDate,
  isPastDate,
  isSameDay,
  weekdayShortNames,
} from '@/lib/dates';
import { getSlotsForDate } from '@/lib/booking-data';
import { ChevronLeftIcon, ChevronRightIcon } from './icons';

interface Props {
  dict: Dictionary;
  locale: Locale;
  selectedDate: Date | null;
  selectedTime: string | null;
  onSelectDate: (date: Date) => void;
  onSelectTime: (time: string) => void;
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
}: Props) {
  const c = dict.booking.calendar;
  // `today` is resolved only on the client (the server snapshot is `false`) so
  // the server and client never disagree about "today" (no hydration mismatch).
  const isClient = useSyncExternalStore(subscribeNoop, () => true, () => false);
  // The visible month is stored as an offset from the current month.
  const [monthOffset, setMonthOffset] = useState(0);

  if (!isClient) {
    return <div className="card" style={{ minHeight: 440 }} aria-hidden="true" />;
  }

  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const monthDate = new Date(today.getFullYear(), today.getMonth() + monthOffset, 1);
  const visible = { y: monthDate.getFullYear(), m: monthDate.getMonth() };
  const cells = buildMonthGrid(visible.y, visible.m);
  const weekdays = weekdayShortNames(locale);
  const atCurrentMonth = visible.y === today.getFullYear() && visible.m === today.getMonth();
  const slots = selectedDate ? getSlotsForDate(selectedDate) : [];

  function changeMonth(delta: number) {
    setMonthOffset((o) => o + delta);
  }

  return (
    <div className="card">
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
          if (!date) return <span key={i} className="day day--empty" aria-hidden="true" />;
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
      </div>

      <div className="slots">
        {!selectedDate ? (
          <p className="slots__empty">{c.selectDatePrompt}</p>
        ) : (
          <>
            <div className="slots__legend">
              <span>
                <i className="dot dot--free" /> {c.legendFree}
              </span>
              <span>
                <i className="dot dot--busy" /> {c.legendBusy}
              </span>
            </div>
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
      </div>
    </div>
  );
}
