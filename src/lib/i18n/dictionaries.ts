import type { Locale } from './config';
import type { Dictionary } from './types';
import type { AccountDictionary } from './account-types';

// Dictionaries are dynamically imported so each locale ships only what it needs.
const loaders: Record<Locale, () => Promise<{ default: Dictionary }>> = {
  ro: () => import('./dictionaries/ro'),
  uk: () => import('./dictionaries/uk'),
  en: () => import('./dictionaries/en'),
  pl: () => import('./dictionaries/pl'),
};

export async function getDictionary(locale: Locale): Promise<Dictionary> {
  const load = loaders[locale] ?? loaders.ro;
  return (await load()).default;
}

// The demo pet account has its own texts, loaded only on /[locale]/account.
const accountLoaders: Record<Locale, () => Promise<{ default: AccountDictionary }>> = {
  ro: () => import('./dictionaries/account/ro'),
  uk: () => import('./dictionaries/account/uk'),
  en: () => import('./dictionaries/account/en'),
  pl: () => import('./dictionaries/account/pl'),
};

export async function getAccountDictionary(locale: Locale): Promise<AccountDictionary> {
  const load = accountLoaders[locale] ?? accountLoaders.ro;
  return (await load()).default;
}
