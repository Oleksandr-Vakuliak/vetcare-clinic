'use client';

import { useState } from 'react';
import type { ReactNode } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import LanguageSwitcher from '../LanguageSwitcher';
import Dialog from '../account/Dialog';
import { resetDemo, useDemoSnapshot } from '../demo-store';
import {
  BagIcon,
  CalendarIcon,
  ExternalIcon,
  HomeIcon,
  InfoIcon,
  PawIcon,
  ResetIcon,
  UserIcon,
} from '../icons';
import { useAdmin } from './AdminContext';

const SECTIONS = [
  { id: 'overview', path: '', Icon: HomeIcon },
  { id: 'appointments', path: '/appointments', Icon: BagIcon },
  { id: 'schedule', path: '/schedule', Icon: CalendarIcon },
  { id: 'pets', path: '/pets', Icon: PawIcon },
] as const;

// Layout of the demo admin panel (as in the owner's mockup): sidebar on desktop,
// compact top navigation on phones; breadcrumb + language menu; the demo banner and
// the local-storage notice are always visible. There is deliberately no login.
export default function AdminShell({ children }: { children: ReactNode }) {
  const { a, d, site, locale, notice, notify, clearNotice } = useAdmin();
  const pathname = usePathname() ?? '';
  const snapshot = useDemoSnapshot();
  const [resetOpener, setResetOpener] = useState<HTMLElement | null>(null);
  const base = `/${locale}/admin`;
  const current =
    SECTIONS.find((s) => s.path && pathname.startsWith(base + s.path)) ?? SECTIONS[0];

  const dataNotice =
    snapshot && !snapshot.saved
      ? d.dataNotice.notSaved
      : snapshot && (snapshot.source === 'migrated' || snapshot.source === 'recovered' || snapshot.source === 'unavailable')
        ? d.dataNotice[snapshot.source]
        : null;

  return (
    <div className="admin">
      <aside className="admin-side">
        <Link href={base} className="admin-brand">
          <PawIcon className="brand__paw" width={34} height={34} fill="currentColor" stroke="none" />
          <span>
            <span className="admin-brand__name">{site.header.clinicName}</span>
            <span className="admin-brand__sub">{a.brandSubtitle}</span>
          </span>
        </Link>

        <nav className="admin-nav" aria-label={a.nav.label}>
          {SECTIONS.map(({ id, path, Icon }) => (
            <Link
              key={id}
              href={base + path}
              className="admin-nav__link"
              aria-current={current.id === id ? 'page' : undefined}
              onClick={clearNotice}
            >
              <Icon width={22} height={22} />
              <span>{a.nav[id]}</span>
            </Link>
          ))}
        </nav>

        <div className="admin-side__foot">
          <Link href={`/${locale}`} className="admin-side__link">
            <ExternalIcon width={20} height={20} /> {a.links.site}
          </Link>
          <Link href={`/${locale}/account`} className="admin-side__link">
            <UserIcon width={20} height={20} /> {a.links.account}
          </Link>
          <button
            type="button"
            className="admin-side__link admin-side__link--muted"
            onClick={(e) => setResetOpener(e.currentTarget)}
          >
            <ResetIcon width={20} height={20} /> {a.links.reset}
          </button>
        </div>
      </aside>

      <div className="admin-main">
        <div className="admin-top">
          <p className="admin-crumbs">
            <span>{a.breadcrumbRoot}</span>
            <span aria-hidden="true">/</span>
            <strong>{a.nav[current.id]}</strong>
          </p>
          <LanguageSwitcher current={locale} label={site.header.languageLabel} />
        </div>

        <p className="admin-banner" role="note">
          <InfoIcon width={20} height={20} /> {a.demoBanner}
        </p>

        {dataNotice && (
          <p className="admin-notice admin-notice--warn" role="status">
            {dataNotice}
          </p>
        )}
        <div aria-live="polite" role="status" className="admin-live">
          {notice && (
            <p className={`admin-notice${notice.tone === 'error' ? ' admin-notice--error' : ''}`}>
              {notice.text}
              <button type="button" className="admin-notice__close" onClick={clearNotice} aria-label={a.close}>
                ×
              </button>
            </p>
          )}
        </div>

        <main id="main" className="admin-content">
          {children}
        </main>

        <p className="admin-storage">{d.storageNotice}</p>
      </div>

      {resetOpener && (
        <Dialog title={a.reset.title} closeLabel={a.close} returnFocus={resetOpener} onClose={() => setResetOpener(null)}>
          <p>{a.reset.text}</p>
          <div className="dialog-actions">
            <button type="button" className="btn btn--ghost" onClick={() => setResetOpener(null)}>
              {a.cancel}
            </button>
            <button
              type="button"
              className="btn btn--danger"
              onClick={() => {
                resetDemo();
                notify(a.reset.done);
                setResetOpener(null);
              }}
            >
              {a.reset.confirm}
            </button>
          </div>
        </Dialog>
      )}
    </div>
  );
}
