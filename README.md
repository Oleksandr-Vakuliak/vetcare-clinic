# VetClinic — multilingual veterinary clinic demo

A single-page website for a **fictional** veterinary clinic, built as a portfolio
piece. It ships three complete language versions and a demo booking experience —
with **no backend, database, or data storage**.

**Live demo:** https://vetcare-clinic-pi.vercel.app

Built with **Next.js 16 (App Router)** and **TypeScript**, using plain CSS and no
UI or animation libraries.

## Features

- **Three full languages** — Romanian, Ukrainian, English — at `/ro`, `/uk`, `/en`
  (`/` redirects to `/ro`), with an RO / UK / EN switcher in the header and mobile menu.
- All copy lives in translation dictionaries; components and layout are shared across
  languages. Dates are localized via `Intl`. Adding a new language (e.g. Polish) is a
  three-step change — see below.
- **Sections:** header with mobile menu, hero, six services, team, demo booking
  calendar + form, messenger links, urgent-help block with an always-available button
  and modal, contacts, and footer.
- **Demo booking calendar** — opens on the current month, disables past dates, marks
  busy/free hours from local demo data, and highlights the selection.
- **Accessibility** — semantic markup, labelled fields, visible focus, keyboard
  navigation, and a modal that closes on Escape and restores focus.
- Calm light theme with green accents; red is reserved for urgent help. Responsive
  for phone, tablet, and desktop.

## Getting started

```bash
npm install
npm run dev      # http://localhost:3000  (/ redirects to /ro)
```

Production build:

```bash
npm run build
npm run start
```

Type check: `npx tsc --noEmit` · Lint: `npm run lint`

Deployed on Vercel: https://vetcare-clinic-pi.vercel.app (auto-deploys from `main`).
Works on any Next.js-compatible host. No environment variables required.

## Configuration

| What | Where |
| --- | --- |
| Translations (all text) | `src/lib/i18n/dictionaries/{ro,uk,en}.ts` |
| Photos (hero, team) | `public/images/` — replace files with the same names |
| Contacts (phone, WhatsApp, Telegram, map) | `src/lib/site-config.ts` |
| Colors, spacing, styles | `src/app/globals.css` (CSS variables at the top) |
| Demo calendar data | `src/lib/booking-data.ts` |

**Contacts / demo mode.** In `src/lib/site-config.ts` all contact values are `null` by
default, so the messenger and call buttons show a clear demo-mode message instead of
fake numbers. Fill in real values and the buttons become live automatically.

**Add a language (e.g. Polish).** Add `'pl'` to `locales` and a `localeMeta.pl` entry in
`src/lib/i18n/config.ts`, create `src/lib/i18n/dictionaries/pl.ts` (copy `uk.ts` and
translate), and register a `pl` loader in `src/lib/i18n/dictionaries.ts`. Components stay
unchanged.

## Project structure

```
src/
  app/[lang]/         # locale segment: layout (header, footer) + page (sections)
  proxy.ts            # redirect / -> /ro
  components/         # sections and interactive parts (calendar, form, modal)
  lib/i18n/           # locale config, Dictionary type, dictionaries
  lib/site-config.ts  # contacts (demo mode)
  lib/booking-data.ts # demo calendar slots
  lib/dates.ts        # locale-aware date formatting (Intl)
public/images/        # photos + CREDITS.md
```

## Notes

- **Portfolio demo.** The clinic, doctor profiles, address, and hours are fictional.
  The booking form performs validation only — it does **not** create real appointments
  and does not send or store any data.
- Photos are from [Unsplash](https://unsplash.com) under the Unsplash License; sources
  are listed in [`public/images/CREDITS.md`](public/images/CREDITS.md).
- This project was built with the help of an AI coding assistant (Claude Code); all code
  was reviewed and verified (build, type check, and browser testing).
