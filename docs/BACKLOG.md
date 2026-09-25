# VetClinic — Backlog

Tasks derived from [`SPEC.md`](./SPEC.md), grouped by **site section** and **cross-cutting**
concerns. This file is the source of truth for the GitHub Project board.

Status legend: `Done` (implemented & verified) · `Todo` · `Backlog` (roadmap / out of scope now).

## Cross-cutting / foundation

| ID | Task | Status | Acceptance |
| --- | --- | --- | --- |
| INFRA-1 | Scaffold Next.js 16 + TypeScript + plain CSS + ESLint | Done | Builds; App Router; no Tailwind/UI libs |
| DS-1 | Design system & global styles (tokens: light bg, green accents, red for urgent, cards, spacing) | Done | CSS variables; reused across sections |
| I18N-1 | Locale routing (`/ro`,`/uk`,`/en`; `/`→`/ro`) + dictionary architecture + `Dictionary` type | Done | `generateStaticParams`; `proxy.ts`; shared components |
| I18N-2 | RO / UK / EN translations (all strings; dates via `Intl`) | Done | No untranslated copy; localized dates |
| A11Y-1 | Accessibility baseline (semantic HTML, labels, visible focus, keyboard, skip link) | Done | Keyboard operable; visible focus |
| SEO-1 | Per-locale metadata (`title`/`description`/`lang`/alternates) | Done | Correct per language |

## Sections

| ID | Task | Status | Acceptance |
| --- | --- | --- | --- |
| SEC-HEADER | Header + mobile menu + language switcher | Done | Sticky; hamburger; `aria-current`; closes on Escape/link |
| SEC-HERO | Hero (non-lazy image, contrast, two CTAs) | Done | Localized heading/subtitle; eager hero image |
| SEC-SERVICES | Services — six cards with icons | Done | 6 localized cards; responsive 1→2→3 grid |
| SEC-ABOUT | About + team (two demo profiles, demo note) | Done | Intro + demo note + 2 cards |
| SEC-BOOKING | Booking calendar + form (demo slots, past disabled, validation, intl phone, demo success, no data) | Done | Verified in browser |
| SEC-MESSENGERS | Messengers (WhatsApp/Telegram, demo mode) | Done | Demo message when unconfigured; live when set |
| SEC-EMERGENCY | Emergency section + floating button + accessible modal | Done | Escape + focus return; compact on phones |
| SEC-CONTACTS | Contacts + footer + map placeholder + demo badge | Done | Address/hours (demo), placeholder, badge |

## Assets, QA & delivery

| ID | Task | Status | Acceptance |
| --- | --- | --- | --- |
| ASSET-1 | Source rights-cleared photos + credits | Done | Unsplash License; `CREDITS.md` |
| QA-1 | Verification: build, typecheck, responsive, interactions, console | Done (Chromium) | Passes; other browsers pending (see QA-2) |
| DOCS-1 | Documentation: SPEC, README, backlog | Done | This spec + English README |
| QA-2 | Cross-browser / device check (Safari/iOS, Firefox) | Todo | Manual pass on real Safari/iOS |
| DEPLOY-1 | Deploy to Vercel | Done | Live: https://vetcare-clinic-pi.vercel.app (auto-deploys from `main`) |

## Roadmap (backlog — out of current scope)

| ID | Task | Status | Notes |
| --- | --- | --- | --- |
| ROADMAP-PL | Prepare Polish (PL) language | Backlog | Add locale + `pl.ts`; no component changes |
| ROADMAP-PHOTOS | Replace demo photos / set real contacts when going live | Backlog | Edit `public/images/` + `site-config.ts` |
| ROADMAP-BOOKING | Real booking integration (only if a client needs it) | Backlog | Gather requirements first; Calendly/email/backend |
