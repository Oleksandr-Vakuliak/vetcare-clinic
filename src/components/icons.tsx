// Lightweight inline SVG icons (no icon library dependency).
// All use `currentColor` so they inherit text color.

import type { SVGProps } from 'react';

type IconProps = SVGProps<SVGSVGElement>;

const base: IconProps = {
  width: 24,
  height: 24,
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.8,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
  'aria-hidden': true,
  focusable: false,
};

export function PawIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <circle cx="5.5" cy="10.5" r="1.7" />
      <circle cx="9.5" cy="7" r="1.7" />
      <circle cx="14.5" cy="7" r="1.7" />
      <circle cx="18.5" cy="10.5" r="1.7" />
      <path d="M12 12c-2.5 0-4.5 1.7-4.5 3.8 0 1.6 1.3 2.7 3 2.7.9 0 1.2-.3 1.5-.3s.6.3 1.5.3c1.7 0 3-1.1 3-2.7 0-2.1-2-3.8-4.5-3.8Z" />
    </svg>
  );
}

export function MenuIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M4 7h16M4 12h16M4 17h16" />
    </svg>
  );
}

export function CloseIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M6 6l12 12M18 6 6 18" />
    </svg>
  );
}

export function ChevronLeftIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M15 6l-6 6 6 6" />
    </svg>
  );
}

export function ChevronRightIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M9 6l6 6-6 6" />
    </svg>
  );
}

export function PhoneIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M4 5c0-.6.4-1 1-1h2.3c.5 0 .9.3 1 .8l.8 3c.1.4 0 .8-.3 1l-1.4 1.3a12 12 0 0 0 4.5 4.5l1.3-1.4c.3-.3.7-.4 1-.3l3 .8c.5.1.8.5.8 1V17c0 .6-.4 1-1 1A13 13 0 0 1 4 5Z" />
    </svg>
  );
}

export function WhatsAppIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M4 20l1.4-4A7.6 7.6 0 1 1 8 18.6L4 20Z" />
      <path d="M9 9.2c.2-.6.4-.6.7-.6h.5c.2 0 .4 0 .6.5l.6 1.4c.1.2 0 .4-.1.6l-.4.5c-.1.2-.2.3 0 .6.3.5.8 1 1.4 1.4.3.2.5.2.7 0l.5-.5c.2-.2.4-.2.6-.1l1.3.7c.3.2.4.3.4.5 0 .6-.5 1.3-1 1.4-.5.2-1.2.2-3-.6-1.6-.7-2.7-2.4-2.8-2.6-.1-.2-.7-1-.7-1.8 0-.9.4-1.3.5-1.4Z" />
    </svg>
  );
}

export function TelegramIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M21 5 3 12l5 1.7L18 7l-7.5 8.2v3.3l3-2.8 3.7 2.7L21 5Z" />
    </svg>
  );
}

export function ChevronDownIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M6 9l6 6 6-6" />
    </svg>
  );
}

export function HeartIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M12 20s-7-4.4-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 10c0 5.6-7 10-7 10Z" />
    </svg>
  );
}

export function BellIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M6 16V11a6 6 0 0 1 12 0v5l1.5 2h-15L6 16ZM10 20a2 2 0 0 0 4 0" />
    </svg>
  );
}

export function PinIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M12 21s-6-5.4-6-11a6 6 0 0 1 12 0c0 5.6-6 11-6 11Z" />
      <circle cx="12" cy="10" r="2.2" />
    </svg>
  );
}

export function ClockIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <circle cx="12" cy="12" r="8.5" />
      <path d="M12 7.5V12l3 2" />
    </svg>
  );
}

export function UserIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <circle cx="12" cy="8" r="3.5" />
      <path d="M5 20a7 7 0 0 1 14 0" />
    </svg>
  );
}

export function NoteIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M7 3h7l4 4v14H7V3Z" />
      <path d="M14 3v4h4M10 12h5M10 16h5" />
    </svg>
  );
}

export function GlobeIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <circle cx="12" cy="12" r="8.5" />
      <path d="M3.5 12h17M12 3.5c2.3 2.4 3.4 5.2 3.4 8.5s-1.1 6.1-3.4 8.5c-2.3-2.4-3.4-5.2-3.4-8.5S9.7 5.9 12 3.5Z" />
    </svg>
  );
}

/* --- Pet account --- */

export function CalendarIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <rect x="4" y="5.5" width="16" height="14.5" rx="2" />
      <path d="M4 10h16M8.5 3.5v4M15.5 3.5v4" />
    </svg>
  );
}

export function PencilIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M5 19l1-4L15.5 5.5a2.1 2.1 0 0 1 3 3L9 18l-4 1Z" />
      <path d="M13.5 7.5l3 3" />
    </svg>
  );
}

/** Weight: a kettlebell-like bag. */
export function WeightIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M9 8.5a3 3 0 1 1 6 0" />
      <path d="M6.5 8.5h11l1.5 11h-14l1.5-11Z" />
    </svg>
  );
}

export function PlusIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M12 5v14M5 12h14" />
    </svg>
  );
}

export function ArrowUpRightIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M8 16 16 8M9.5 8H16v6.5" />
    </svg>
  );
}

/* --- Service icons --- */

export function StethoscopeIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M6 4v4a4 4 0 0 0 8 0V4" />
      <path d="M4 4h2M12 4h2" />
      <path d="M10 15a5 5 0 0 0 5 5 4 4 0 0 0 4-4v-2" />
      <circle cx="19" cy="11" r="2" />
    </svg>
  );
}

export function SyringeIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M14 4l6 6M17 7l-9 9-4 1 1-4 9-9M9 11l2 2M12 8l2 2" />
    </svg>
  );
}

export function FlaskIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M9 3v6l-4 8a2 2 0 0 0 1.8 3h10.4A2 2 0 0 0 19 17l-4-8V3M8 3h8M7.5 14h9" />
    </svg>
  );
}

export function ToothIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M12 4c-2.5-1.4-6-1-6 2.5 0 2 .6 3 .9 5 .3 1.7.2 5.5 1.6 5.5 1.2 0 1-2.5 1.5-2.5s.3 2.5 1.5 2.5c1.4 0 1.3-3.8 1.6-5.5.3-2 .9-3 .9-5C16 5 12.5 4.6 12 4Z" />
    </svg>
  );
}

/** Ultrasound: a monitor with a pulse line. */
export function ScanIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <rect x="3.5" y="4.5" width="17" height="12" rx="1.5" />
      <path d="M9 20h6M12 16.5V20M6.5 11.5h2.5l1.5-3 2 5 1.5-2h3.5" />
    </svg>
  );
}

export function ChatIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M12 4c4.7 0 8.5 3.1 8.5 7s-3.8 7-8.5 7c-1 0-2-.1-2.9-.4L5 19.5l1.2-3.4C4.5 14.8 3.5 13 3.5 11c0-3.9 3.8-7 8.5-7Z" />
    </svg>
  );
}

/** Icons for the six services, in dictionary order. */
export const serviceIcons = [
  StethoscopeIcon, // огляд / checkup
  SyringeIcon, // вакцинація
  FlaskIcon, // аналізи
  ToothIcon, // стоматологія
  ScanIcon, // УЗД
  ChatIcon, // консультація
] as const;

/* --- Admin panel --- */

export function HomeIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M4 11.5 12 5l8 6.5V19a1 1 0 0 1-1 1h-4.5v-5.5h-5V20H5a1 1 0 0 1-1-1v-7.5Z" />
    </svg>
  );
}

/** Appointments: a medical bag. */
export function BagIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <rect x="4" y="7.5" width="16" height="12" rx="2" />
      <path d="M9 7.5V5.5a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2M12 11v5M9.5 13.5h5" />
    </svg>
  );
}

export function InfoIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <circle cx="12" cy="12" r="8.5" />
      <path d="M12 11v5M12 8h.01" />
    </svg>
  );
}

export function SearchIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <circle cx="11" cy="11" r="6" />
      <path d="m20 20-4.5-4.5" />
    </svg>
  );
}

export function GearIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <circle cx="12" cy="12" r="3" />
      <path d="M12 3.5v2M12 18.5v2M3.5 12h2M18.5 12h2M6 6l1.4 1.4M16.6 16.6 18 18M6 18l1.4-1.4M16.6 7.4 18 6" />
    </svg>
  );
}

export function DotsIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M6 12h.01M12 12h.01M18 12h.01" strokeWidth={3} />
    </svg>
  );
}

export function ArrowRightIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M5 12h14M13 6l6 6-6 6" />
    </svg>
  );
}

export function ResetIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M5 12a7 7 0 1 0 2.1-5" />
      <path d="M5 4.5V8h3.5" />
    </svg>
  );
}

export function ExternalIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M13 5h6v6M19 5l-8 8" />
      <path d="M17 13.5V18a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1V8a1 1 0 0 1 1-1h4.5" />
    </svg>
  );
}
