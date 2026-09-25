'use client';

import { createContext, useCallback, useContext, useMemo, useState } from 'react';
import type { ReactNode } from 'react';
import type { Dictionary } from '@/lib/i18n/types';
import type { AccountDictionary } from '@/lib/i18n/account-types';
import type { AdminDictionary } from '@/lib/i18n/admin-types';
import type { Locale } from '@/lib/i18n/config';

interface AdminContextValue {
  /** Admin panel texts. */
  a: AdminDictionary;
  /** Pet account texts — shared demo records (names, owners, reasons, statuses). */
  d: AccountDictionary;
  site: Dictionary;
  locale: Locale;
  /** Latest result message, announced in a polite live region. */
  notice: { text: string; tone: 'ok' | 'error' } | null;
  notify: (text: string, tone?: 'ok' | 'error') => void;
  clearNotice: () => void;
}

const AdminContext = createContext<AdminContextValue | null>(null);

export function AdminProvider({
  a,
  d,
  site,
  locale,
  children,
}: Pick<AdminContextValue, 'a' | 'd' | 'site' | 'locale'> & { children: ReactNode }) {
  const [notice, setNotice] = useState<AdminContextValue['notice']>(null);
  const notify = useCallback((text: string, tone: 'ok' | 'error' = 'ok') => setNotice({ text, tone }), []);
  const clearNotice = useCallback(() => setNotice(null), []);
  const value = useMemo(
    () => ({ a, d, site, locale, notice, notify, clearNotice }),
    [a, d, site, locale, notice, notify, clearNotice],
  );
  return <AdminContext.Provider value={value}>{children}</AdminContext.Provider>;
}

export function useAdmin(): AdminContextValue {
  const value = useContext(AdminContext);
  if (!value) throw new Error('useAdmin must be used inside <AdminProvider>');
  return value;
}
