import './globals.css';
import type { Metadata } from 'next';
import { headers } from 'next/headers';
import { Inter } from 'next/font/google';
import { defaultLocale, isLocale, localeMeta, type Locale } from '@/lib/i18n/config';
import { LOCALE_HEADER, notFoundTexts } from '@/lib/i18n/not-found';
import NotFoundView from '@/components/NotFoundView';

// 404 for any unknown URL (/uk/xyz, /pl/admin/xyz, …). It bypasses the [lang]
// layout, so it brings its own styles and font; the language comes from proxy.ts.
// Next.js adds <meta name="robots" content="noindex"> and returns status 404.

const sans = Inter({ subsets: ['latin'], variable: '--font-sans', display: 'swap' });

async function currentLocale(): Promise<Locale> {
  const value = (await headers()).get(LOCALE_HEADER) ?? '';
  return isLocale(value) ? value : defaultLocale;
}

export async function generateMetadata(): Promise<Metadata> {
  const t = notFoundTexts[await currentLocale()];
  return { title: `${t.title} — ${t.clinicName}`, description: t.text };
}

export default async function GlobalNotFound() {
  const locale = await currentLocale();
  return (
    <html lang={localeMeta[locale].htmlLang} className={sans.variable}>
      <body>
        <NotFoundView locale={locale} />
      </body>
    </html>
  );
}
