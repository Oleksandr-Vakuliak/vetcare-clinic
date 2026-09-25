import { Suspense } from 'react';
import type { Metadata } from 'next';
import { getAdminDictionary } from '@/lib/i18n/dictionaries';
import { isLocale, localeMeta, locales } from '@/lib/i18n/config';
import ScheduleView from '@/components/admin/ScheduleView';

interface Props {
  params: Promise<{ lang: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang } = await params;
  if (!isLocale(lang)) return {};
  const a = await getAdminDictionary(lang);
  const path = '/admin/schedule';
  return {
    title: `${a.nav.schedule} — ${a.metaTitle}`,
    alternates: { languages: Object.fromEntries(locales.map((l) => [localeMeta[l].htmlLang, `/${l}${path}`])) },
  };
}

export default function Page() {
  // ScheduleView reads ?doctor= on the client ("Відкрити розклад" from the overview).
  return (
    <Suspense>
      <ScheduleView />
    </Suspense>
  );
}
