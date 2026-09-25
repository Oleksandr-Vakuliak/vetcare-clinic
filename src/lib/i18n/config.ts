// Central locale configuration.
// To add a language: add it to `locales` and `localeMeta`, create its dictionary
// in `dictionaries/`, and register it in `dictionaries.ts`. TypeScript then points
// to the only other place that needs it: the skip-link label in `app/[lang]/layout.tsx`.

export const locales = ['ro', 'uk', 'en', 'pl'] as const;

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
  pl: { label: 'PL', endonym: 'Polski', htmlLang: 'pl', intl: 'pl-PL' },
};

export function isLocale(value: string): value is Locale {
  return (locales as readonly string[]).includes(value);
}
