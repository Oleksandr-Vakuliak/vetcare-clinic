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

export function ScanIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M4 8V6a2 2 0 0 1 2-2h2M16 4h2a2 2 0 0 1 2 2v2M20 16v2a2 2 0 0 1-2 2h-2M8 20H6a2 2 0 0 1-2-2v-2" />
      <path d="M7 12c1.5-2 3-3 5-3s3.5 1 5 3c-1.5 2-3 3-5 3s-3.5-1-5-3Z" />
      <circle cx="12" cy="12" r="1" />
    </svg>
  );
}

export function ChatIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M4 5h16v11H9l-4 3v-3H4V5Z" />
      <path d="M8 9h8M8 12h5" />
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
