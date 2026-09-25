import type { Locale } from './config';

// Texts of the 404 page (app/global-not-found.tsx). That page gets no params, so
// proxy.ts passes the language from the URL in a request header; these few strings
// live here (like the skip-link label in the layout) instead of a whole dictionary.

/** Request header set by proxy.ts with the locale of the URL. */
export const LOCALE_HEADER = 'x-vetcare-locale';
export interface NotFoundTexts {
  clinicName: string;
  title: string;
  text: string;
  home: string;
  account: string;
  admin: string;
}

export const notFoundTexts: Record<Locale, NotFoundTexts> = {
  ro: {
    clinicName: 'VetClinic',
    title: 'Pagina nu a fost găsită',
    text: 'Poate adresa a fost scrisă greșit sau pagina a fost mutată. Restul site-ului demo funcționează ca de obicei.',
    home: 'Pagina principală',
    account: 'Contul animalului',
    admin: 'Panou de administrare',
  },
  uk: {
    clinicName: 'ВетКлініка',
    title: 'Сторінку не знайдено',
    text: 'Можливо, адресу введено з помилкою або сторінку переміщено. Решта демо-сайту працює як звичайно.',
    home: 'На головну',
    account: 'Кабінет улюбленця',
    admin: 'Адмінпанель',
  },
  en: {
    clinicName: 'VetClinic',
    title: 'Page not found',
    text: 'The address may be mistyped or the page has moved. The rest of the demo site works as usual.',
    home: 'Home page',
    account: 'Pet account',
    admin: 'Admin panel',
  },
  pl: {
    clinicName: 'VetKlinika',
    title: 'Nie znaleziono strony',
    text: 'Adres mógł zostać wpisany z błędem lub strona została przeniesiona. Reszta strony demo działa normalnie.',
    home: 'Strona główna',
    account: 'Konto pupila',
    admin: 'Panel administratora',
  },
};
