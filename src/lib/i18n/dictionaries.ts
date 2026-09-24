import type { Locale } from './config';
import type { Dictionary } from './types';

// Dictionaries are dynamically imported so each locale ships only what it needs.
const loaders: Record<Locale, () => Promise<{ default: Dictionary }>> = {
  ro: () => import('./dictionaries/ro'),
  uk: () => import('./dictionaries/uk'),
  en: () => import('./dictionaries/en'),
};

export async function getDictionary(locale: Locale): Promise<Dictionary> {
  const load = loaders[locale] ?? loaders.ro;
  return (await load()).default;
}
