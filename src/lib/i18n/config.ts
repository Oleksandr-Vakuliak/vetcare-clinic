// Central locale configuration.
// To add Polish later: add 'pl' to `locales`, add a `localeMeta.pl` entry,
// and create `dictionaries/pl.ts`. Nothing else needs to change.

export const locales = ['ro', 'uk', 'en'] as const;

export type Locale = (typeof locales)[number];

export const defaultLocale: Locale = 'ro';

export interface LocaleMeta {
  /** Short label shown in the RO / UK / EN switcher. */
  label: string;
  /** Native language name (endonym), used in the "preferred language" field. */
  endonym: string;
  /** Value for the <html lang> attribute. */
  htmlLang: string;
  /** BCP-47 tag used for Intl date formatting. */
  intl: string;
}

export const localeMeta: Record<Locale, LocaleMeta> = {
  ro: { label: 'RO', endonym: 'Română', htmlLang: 'ro', intl: 'ro-RO' },
  uk: { label: 'UK', endonym: 'Українська', htmlLang: 'uk', intl: 'uk-UA' },
  en: { label: 'EN', endonym: 'English', htmlLang: 'en', intl: 'en-GB' },
};

export function isLocale(value: string): value is Locale {
  return (locales as readonly string[]).includes(value);
}
