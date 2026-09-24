import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import { notFound } from 'next/navigation';
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

const skipLabel: Record<Locale, string> = {
  ro: 'Sari la conținut',
  uk: 'Перейти до вмісту',
  en: 'Skip to content',
};

export async function generateMetadata({ params }: LangParams): Promise<Metadata> {
  const { lang } = await params;
  if (!isLocale(lang)) return {};
  const dict = await getDictionary(lang);
  return {
    title: dict.meta.title,
    description: dict.meta.description,
    alternates: {
      languages: {
        ro: '/ro',
        uk: '/uk',
        en: '/en',
      },
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
    <html lang={localeMeta[lang].htmlLang}>
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
