'use client';

import { useEffect, useId, useRef, useState } from 'react';
import type { KeyboardEvent as ReactKeyboardEvent, FocusEvent as ReactFocusEvent } from 'react';
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

  const [open, setOpen] = useState(false);
  const listId = useId();
  const rootRef = useRef<HTMLElement | null>(null);
  const triggerRef = useRef<HTMLButtonElement | null>(null);
  const itemRefs = useRef<Array<HTMLAnchorElement | null>>([]);
  const pendingFocusIndex = useRef<number | null>(null);

  function hrefFor(locale: Locale): string {
    const parts = [...segments];
    if (parts.length < 2) return `/${locale}`;
    parts[1] = locale; // swap the locale segment, keep the rest of the path
    return parts.join('/') || `/${locale}`;
  }

  function focusItem(index: number) {
    const count = locales.length;
    const normalized = ((index % count) + count) % count;
    itemRefs.current[normalized]?.focus();
  }

  function openList(focusIndex: number | null) {
    pendingFocusIndex.current = focusIndex;
    setOpen(true);
  }

  function closeAndFocusTrigger() {
    setOpen(false);
    triggerRef.current?.focus();
  }

  // Focus the requested item once the list has actually mounted.
  useEffect(() => {
    if (open && pendingFocusIndex.current !== null) {
      focusItem(pendingFocusIndex.current);
      pendingFocusIndex.current = null;
    }
  }, [open]);

  // Close on outside click/tap and on Escape while open.
  useEffect(() => {
    if (!open) return;

    function onPointerDown(e: PointerEvent) {
      const root = rootRef.current;
      if (root && e.target instanceof Node && !root.contains(e.target)) {
        setOpen(false);
      }
    }
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') {
        closeAndFocusTrigger();
      }
    }

    document.addEventListener('pointerdown', onPointerDown);
    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.removeEventListener('pointerdown', onPointerDown);
      document.removeEventListener('keydown', onKeyDown);
    };
  }, [open]);

  function handleRootFocusOut(e: ReactFocusEvent<HTMLElement>) {
    const root = rootRef.current;
    if (!open || !root) return;
    if (!e.relatedTarget || !root.contains(e.relatedTarget as Node)) {
      setOpen(false);
    }
  }

  function handleTriggerClick() {
    setOpen((v) => !v);
  }

  function handleTriggerKeyDown(e: ReactKeyboardEvent<HTMLButtonElement>) {
    if (e.key === 'ArrowDown' || e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      openList(locales.indexOf(current));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      openList(locales.length - 1);
    }
  }

  function handleListKeyDown(e: ReactKeyboardEvent<HTMLUListElement>) {
    const activeIndex = itemRefs.current.findIndex((el) => el === document.activeElement);
    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        focusItem(activeIndex === -1 ? 0 : activeIndex + 1);
        break;
      case 'ArrowUp':
        e.preventDefault();
        focusItem(activeIndex === -1 ? locales.length - 1 : activeIndex - 1);
        break;
      case 'Home':
        e.preventDefault();
        focusItem(0);
        break;
      case 'End':
        e.preventDefault();
        focusItem(locales.length - 1);
        break;
      case 'Escape':
        e.preventDefault();
        closeAndFocusTrigger();
        break;
      default:
        break;
    }
  }

  function handleItemClick() {
    setOpen(false);
    onNavigate?.();
  }

  return (
    <nav
      className="lang-menu"
      aria-label={label}
      ref={rootRef}
      onBlur={handleRootFocusOut}
    >
      <button
        type="button"
        ref={triggerRef}
        className="lang-menu__trigger"
        aria-expanded={open}
        aria-controls={listId}
        aria-label={`${label}: ${localeMeta[current].endonym}`}
        onClick={handleTriggerClick}
        onKeyDown={handleTriggerKeyDown}
      >
        <span translate="no">{localeMeta[current].label}</span>
        <svg
          aria-hidden="true"
          focusable="false"
          className="lang-menu__chevron"
          width="12"
          height="12"
          viewBox="0 0 24 24"
          fill="none"
        >
          <path d="M6 9l6 6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>

      {open && (
        <ul id={listId} className="lang-menu__list" onKeyDown={handleListKeyDown}>
          {locales.map((locale, index) => {
            const isCurrent = locale === current;
            return (
              <li key={locale}>
                <Link
                  ref={(el) => {
                    itemRefs.current[index] = el;
                  }}
                  href={hrefFor(locale)}
                  hrefLang={locale}
                  lang={localeMeta[locale].htmlLang}
                  aria-current={isCurrent ? 'true' : undefined}
                  className="lang-menu__item"
                  onClick={handleItemClick}
                >
                  <span translate="no">{localeMeta[locale].endonym}</span>
                  <svg
                    aria-hidden="true"
                    focusable="false"
                    className="lang-menu__check"
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                  >
                    {isCurrent && (
                      <path d="M5 13l4 4L19 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    )}
                  </svg>
                </Link>
              </li>
            );
          })}
        </ul>
      )}
    </nav>
  );
}
