'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { locales, localeMeta, type Locale } from '@/lib/i18n/config';

interface Props {
  current: Locale;
  label: string;
  onNavigate?: () => void;
}

export default function LanguageSwitcher({ current, label, onNavigate }: Props) {
  const pathname = usePathname() || `/${current}`;
  const segments = pathname.split('/');

  function hrefFor(locale: Locale): string {
    const parts = [...segments];
    if (parts.length < 2) return `/${locale}`;
    parts[1] = locale; // swap the locale segment, keep the rest of the path
    return parts.join('/') || `/${locale}`;
  }

  return (
    <nav className="lang-switch" aria-label={label}>
      {locales.map((locale) => (
        <Link
          key={locale}
          href={hrefFor(locale)}
          hrefLang={locale}
          aria-current={locale === current ? 'true' : undefined}
          onClick={onNavigate}
        >
          {localeMeta[locale].label}
        </Link>
      ))}
    </nav>
  );
}
