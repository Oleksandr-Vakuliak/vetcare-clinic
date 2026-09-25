import type { Metadata } from 'next';
import { localeMeta, locales, type Locale } from './i18n/config';

// Link-preview (Open Graph / Twitter) fields shared by every page. A page that
// sets its own `openGraph` replaces the parent's object entirely, so pages build
// it with this helper instead of repeating site name, locale and type.
// The image is public/images/og.jpg (built by scripts/og-image.mjs, ~65 KB so
// messengers show it).
export function socialMetadata(
  locale: Locale,
  siteName: string,
  title: string,
  description: string,
  imageAlt: string,
): Pick<Metadata, 'openGraph' | 'twitter'> {
  return {
    openGraph: {
      type: 'website',
      siteName,
      title,
      description,
      images: [{ url: '/images/og.jpg', width: 1200, height: 630, alt: imageAlt }],
      locale: localeMeta[locale].intl.replace('-', '_'),
      alternateLocale: locales.filter((l) => l !== locale).map((l) => localeMeta[l].intl.replace('-', '_')),
    },
    twitter: { card: 'summary_large_image', title, description, images: [{ url: '/images/og.jpg', alt: imageAlt }] },
  };
}
