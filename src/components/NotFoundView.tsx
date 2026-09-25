import Link from 'next/link';
import type { Locale } from '@/lib/i18n/config';
import { notFoundTexts } from '@/lib/i18n/not-found';
import { PawIcon } from './icons';

// Branded 404 content in the language of the URL (see app/global-not-found.tsx).
export default function NotFoundView({ locale }: { locale: Locale }) {
  const t = notFoundTexts[locale];

  return (
    <main id="main" className="not-found">
      <div className="not-found__card">
        <Link href={`/${locale}`} className="brand not-found__brand">
          <PawIcon className="brand__paw" width={30} height={30} fill="currentColor" stroke="none" />
          <span className="brand__name">{t.clinicName}</span>
        </Link>
        <p className="not-found__code" aria-hidden="true">
          404
        </p>
        <h1 className="not-found__title">{t.title}</h1>
        <p className="not-found__text">{t.text}</p>
        <div className="not-found__actions">
          <Link href={`/${locale}`} className="btn btn--primary">
            {t.home}
          </Link>
          <Link href={`/${locale}/account`} className="btn btn--outline">
            {t.account}
          </Link>
          <Link href={`/${locale}/admin`} className="btn btn--outline">
            {t.admin}
          </Link>
        </div>
      </div>
    </main>
  );
}
