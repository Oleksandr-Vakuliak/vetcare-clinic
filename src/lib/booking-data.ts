// Local demo booking data. No backend, no persistence.
// Slots are derived deterministically from the date so the same day always
// shows the same free/busy pattern (and server/client render identically).

export interface Slot {
  time: string;
  busy: boolean;
}

const WORKING_HOURS = [9, 10, 11, 12, 13, 14, 15, 16, 17];

export function getSlotsForDate(date: Date): Slot[] {
  return WORKING_HOURS.map((hour) => {
    const seed =
      date.getFullYear() * 1000 + (date.getMonth() + 1) * 50 + date.getDate() + hour;
    // Lunch hour is always busy; the rest follows a stable pseudo-pattern.
    const busy = hour === 13 || seed % 3 === 0;
    return { time: `${String(hour).padStart(2, '0')}:00`, busy };
  });
}
