import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import { notFound } from 'next/navigation';
import { getAccountDictionary, getAdminDictionary, getDictionary } from '@/lib/i18n/dictionaries';
import { isLocale } from '@/lib/i18n/config';
import { AdminProvider } from '@/components/admin/AdminContext';
import AdminShell from '@/components/admin/AdminShell';

interface Props {
  params: Promise<{ lang: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang } = await params;
  if (!isLocale(lang)) return {};
  const a = await getAdminDictionary(lang);
  return {
    title: a.metaTitle,
    description: a.demoBanner,
    // Open demo with fictional data — keep it out of search results.
    robots: { index: false },
  };
}

// Demo admin panel: an open, browser-only demo — no login, no server data.
// The shell (sidebar, banner) is shared by all four sections.
export default async function AdminLayout({ children, params }: Props & { children: ReactNode }) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  const [site, d, a] = await Promise.all([getDictionary(lang), getAccountDictionary(lang), getAdminDictionary(lang)]);

  return (
    <AdminProvider a={a} d={d} site={site} locale={lang}>
      <AdminShell>{children}</AdminShell>
    </AdminProvider>
  );
}
