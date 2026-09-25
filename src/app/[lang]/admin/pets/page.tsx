import type { Metadata } from 'next';
import { getAdminDictionary } from '@/lib/i18n/dictionaries';
import { isLocale, localeMeta, locales } from '@/lib/i18n/config';
import PetsView from '@/components/admin/PetsView';

interface Props {
  params: Promise<{ lang: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang } = await params;
  if (!isLocale(lang)) return {};
  const a = await getAdminDictionary(lang);
  const path = '/admin/pets';
  return {
    title: `${a.nav.pets} — ${a.metaTitle}`,
    alternates: { languages: Object.fromEntries(locales.map((l) => [localeMeta[l].htmlLang, `/${l}${path}`])) },
  };
}

export default function Page() {
  return <PetsView />;
}
