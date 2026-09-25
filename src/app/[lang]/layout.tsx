import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import { notFound } from 'next/navigation';
import { Caveat, Inter } from 'next/font/google';
import '../globals.css';
import { getDictionary } from '@/lib/i18n/dictionaries';
import { locales, localeMeta, isLocale, type Locale } from '@/lib/i18n/config';
import Header from '@/components/Header';
import EmergencyFab from '@/components/EmergencyFab';

interface LangParams {
  params: Promise<{ lang: string }>;
}

export function generateStaticParams() {
  return locales.map((lang) => ({ lang }));
}

// Self-hosted at build time by next/font (no runtime request to Google).
// `subsets` only chooses which files are preloaded; the other subsets
// (Cyrillic for UK, Latin Extended for RO/PL) still load on demand via
// unicode-range. Preloading just Latin avoids "preload not used" warnings.
const sans = Inter({
  subsets: ['latin'],
  variable: '--font-sans',
  display: 'swap',
});
// Handwritten accents from the design mockup (decorative, not preloaded).
const hand = Caveat({
  subsets: ['latin'],
  variable: '--font-hand',
  display: 'swap',
  preload: false,
});

const skipLabel: Record<Locale, string> = {
  ro: 'Sari la conținut',
  uk: 'Перейти до вмісту',
  en: 'Skip to content',
  pl: 'Przejdź do treści',
};

export async function generateMetadata({ params }: LangParams): Promise<Metadata> {
  const { lang } = await params;
  if (!isLocale(lang)) return {};
  const dict = await getDictionary(lang);
  return {
    title: dict.meta.title,
    description: dict.meta.description,
    alternates: {
      // Generated from `locales`, so a new language gets its hreflang link automatically.
      languages: Object.fromEntries(locales.map((l) => [localeMeta[l].htmlLang, `/${l}`])),
    },
  };
}

export default async function LangLayout({
  children,
  params,
}: LangParams & { children: ReactNode }) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  const dict = await getDictionary(lang);

  return (
    <html lang={localeMeta[lang].htmlLang} className={`${sans.variable} ${hand.variable}`}>
      <body>
        <a className="skip-link" href="#main">
          {skipLabel[lang]}
        </a>
        <Header dict={dict} locale={lang} />
        <main id="main">{children}</main>
        <EmergencyFab dict={dict} />
      </body>
    </html>
  );
}
