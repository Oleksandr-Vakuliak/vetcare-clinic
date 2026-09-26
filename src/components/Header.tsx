'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import type { Dictionary } from '@/lib/i18n/types';
import type { Locale } from '@/lib/i18n/config';
import LanguageSwitcher from './LanguageSwitcher';
import { PawIcon, MenuIcon, CloseIcon } from './icons';

interface Props {
  dict: Dictionary;
  locale: Locale;
}

export default function Header({ dict, locale }: Props) {
  const [open, setOpen] = useState(false);
  const accountHref = `/${locale}/account`;

  const navItems = [
    { href: '#services', label: dict.nav.services },
    { href: '#prices', label: dict.nav.prices },
    { href: '#team', label: dict.nav.doctors },
    { href: '#booking', label: dict.nav.booking },
    { href: '#contacts', label: dict.nav.contacts },
  ];

  // Close the mobile menu on Escape.
  useEffect(() => {
    if (!open) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') setOpen(false);
    }
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [open]);

  const brand = (
    <Link href={`/${locale}`} className="brand" aria-label={dict.header.clinicName}>
      <PawIcon className="brand__paw" width={28} height={28} fill="currentColor" stroke="none" />
      <span className="brand__name">{dict.header.clinicName}</span>
    </Link>
  );

  return (
    <header className="site-header">
      <div className="container site-header__inner">
        {brand}

        <div className="header__desktop">
          <nav className="nav" aria-label={dict.header.clinicName}>
            {navItems.map((item) => (
              <a key={item.href} href={item.href}>
                {item.label}
              </a>
            ))}
          </nav>
          <div className="header__actions">
            <Link href={accountHref} className="header__account">
              <PawIcon width={18} height={18} />
              {dict.nav.account}
            </Link>
            <LanguageSwitcher current={locale} label={dict.header.languageLabel} />
          </div>
        </div>

        <div className="header__lang-mobile">
          <LanguageSwitcher current={locale} label={dict.header.languageLabel} />
        </div>

        <button
          type="button"
          className="menu-toggle"
          aria-expanded={open}
          aria-controls="mobile-menu"
          aria-label={open ? dict.header.closeMenu : dict.header.openMenu}
          onClick={() => setOpen((v) => !v)}
        >
          {open ? <CloseIcon /> : <MenuIcon />}
        </button>
      </div>

      {open && (
        <div className="mobile-menu" id="mobile-menu">
          <div className="container mobile-menu__inner">
            <nav className="nav" aria-label={dict.header.clinicName}>
              {navItems.map((item) => (
                <a key={item.href} href={item.href} onClick={() => setOpen(false)}>
                  {item.label}
                </a>
              ))}
              <a href="#emergency" onClick={() => setOpen(false)}>
                {dict.nav.emergency}
              </a>
            </nav>
            <Link href={accountHref} className="btn btn--outline btn--block" onClick={() => setOpen(false)}>
              <PawIcon width={18} height={18} />
              {dict.nav.account}
            </Link>
            <a href="#booking" className="btn btn--primary btn--block" onClick={() => setOpen(false)}>
              {dict.hero.ctaBooking}
            </a>
          </div>
        </div>
      )}
    </header>
  );
}
