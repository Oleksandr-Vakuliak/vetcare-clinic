import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { locales, defaultLocale } from '@/lib/i18n/config';
import { LOCALE_HEADER } from '@/lib/i18n/not-found';

// Redirect the bare "/" (and any locale-less path) to the default locale (/ro).
// Next.js 16 uses the "proxy" convention (formerly "middleware").
export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const locale = locales.find(
    (l) => pathname === `/${l}` || pathname.startsWith(`/${l}/`),
  );
  if (locale) {
    // Tell the 404 page (app/global-not-found.tsx, which gets no params) the language.
    const headers = new Headers(request.headers);
    headers.set(LOCALE_HEADER, locale);
    return NextResponse.next({ request: { headers } });
  }

  const url = request.nextUrl.clone();
  url.pathname = `/${defaultLocale}${pathname === '/' ? '' : pathname}`;
  return NextResponse.redirect(url);
}

export const config = {
  // Skip Next internals, API routes and files with an extension (e.g. images).
  matcher: ['/((?!_next|api|.*\\..*).*)'],
};
