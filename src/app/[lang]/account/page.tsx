import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getAccountDictionary, getDictionary } from '@/lib/i18n/dictionaries';
import { socialMetadata } from '@/lib/seo';
import { isLocale, localeMeta, locales } from '@/lib/i18n/config';
import LanguageSwitcher from '@/components/LanguageSwitcher';
import AccountApp from '@/components/account/AccountApp';
import { ArrowUpRightIcon, PawIcon } from '@/components/icons';

interface Props {
  params: Promise<{ lang: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang } = await params;
  if (!isLocale(lang)) return {};
  const [site, d] = await Promise.all([getDictionary(lang), getAccountDictionary(lang)]);
  return {
    title: d.metaTitle,
    description: d.subtitle,
    ...socialMetadata(lang, site.header.clinicName, d.metaTitle, d.subtitle, site.hero.imageAlt),
    // Demo page with fictional data — keep it out of search results.
    robots: { index: false },
    alternates: {
      languages: Object.fromEntries(locales.map((l) => [localeMeta[l].htmlLang, `/${l}/account`])),
    },
  };
}

// Demo "Pet account": static shell rendered per language; the data itself is
// fictional and lives only in the visitor's browser (see AccountApp / store).
export default async function AccountPage({ params }: Props) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  const [site, d] = await Promise.all([getDictionary(lang), getAccountDictionary(lang)]);

  return (
    <>
      <header className="site-header account-header">
        <div className="container site-header__inner">
          <Link href={`/${lang}`} className="brand">
            <PawIcon className="brand__paw" width={30} height={30} fill="currentColor" stroke="none" />
            <span className="brand__name">{site.header.clinicName}</span>
          </Link>
          <div className="account-header__actions">
            <Link href={`/${lang}`} className="account-header__back">
              {d.backToSite} <ArrowUpRightIcon width={18} height={18} />
            </Link>
            <LanguageSwitcher current={lang} label={site.header.languageLabel} />
          </div>
        </div>
      </header>

      <main id="main" className="account">
        <div className="container">
          <h1 className="account__title">{d.title}</h1>
          <p className="account__subtitle">{d.subtitle}</p>
          <AccountApp site={site} d={d} locale={lang} />
        </div>
      </main>

      <footer className="account-footer">
        <div className="container account-footer__inner">
          <p className="account-footer__demo">{d.demoLabel}</p>
          <p className="account-footer__motto">
            <PawIcon width={18} height={18} fill="currentColor" stroke="none" /> {d.footerMotto}
          </p>
        </div>
      </footer>
    </>
  );
}
