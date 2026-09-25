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
| QA-2 | Cross-browser / device check (Safari/iOS, Firefox) | Partly done | Automated pass (Playwright) on Firefox 155 and WebKit 26.6, desktop + narrow + iPhone 15 **emulation**: 3 languages, menu, language switch, calendar, form, emergency modal, no overflow, clean console. Fixed month-name casing (PR #10). Pending: manual check on a real iPhone (owner). |
| DEPLOY-1 | Deploy to Vercel | Done | Live: https://vetcare-clinic-pi.vercel.app (auto-deploys from `main`) |

## Roadmap (backlog — out of current scope)

| ID | Task | Status | Notes |
| --- | --- | --- | --- |
| ROADMAP-PL | Polish (PL) language | Done | Live at `/pl`; checked in Firefox + WebKit (desktop, narrow, iPhone emulation). Native-speaker review of the copy recommended before a real client launch. |
| ROADMAP-PHOTOS | Replace demo photos / set real contacts when going live | Backlog | Edit `public/images/` + `site-config.ts` |
| ROADMAP-BOOKING | Real booking integration (only if a client needs it) | Backlog | Gather requirements first; Calendly/email/backend |
| ADMIN-DEMO | Demo admin panel `/[locale]/admin` + shared local data model (#16) | In review | SPEC §11–12. Real admin would need server auth, roles, shared DB — see README. |
| QA-NARROW | Horizontal overflow on very narrow screens (site + pet account) | In review | Found while testing #16, already on `main`: overflow at 320 px (home, account) and 375 px (account header). Fixed in #19 (issue #18), CSS only. |

## Maintenance (backlog — noticed in CI logs, not urgent)

| ID | Task | Status | Notes |
| --- | --- | --- | --- |
| MAINT-ESLINT | Upgrade ESLint 9 → supported major | Backlog | `npm ci` warns `eslint@9` is no longer supported. Lint still works; upgrade together with `eslint-config-next` and re-check the rules. |
| MAINT-INSTALL-SCRIPTS | Decide on `unrs-resolver` postinstall script | Backlog | npm warns the package's `postinstall` is not in `allowScripts`, so it is not run. Install, lint and build pass without it. Review before allowing. |
