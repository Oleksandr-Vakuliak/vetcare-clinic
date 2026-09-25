# VetClinic — multilingual veterinary clinic demo

[![CI](https://github.com/Oleksandr-Vakuliak/vetcare-clinic/actions/workflows/ci.yml/badge.svg)](https://github.com/Oleksandr-Vakuliak/vetcare-clinic/actions/workflows/ci.yml)

A single-page website for a **fictional** veterinary clinic, built as a portfolio
piece. It ships four complete language versions and a demo booking experience —
with **no backend or database** (the demo pet account keeps changes only in your browser).

**Live demo:** https://vetcare-clinic-pi.vercel.app

Built with **Next.js 16 (App Router)** and **TypeScript**, using plain CSS and no
UI or animation libraries.

## Features

- **Four full languages** — Romanian, Ukrainian, English, Polish — at `/ro`, `/uk`, `/en`, `/pl`
  (`/` redirects to `/ro`), with an RO / UK / EN / PL switcher in the header and mobile menu.
- All copy lives in translation dictionaries; components and layout are shared across
  languages. Dates are localized via `Intl`. Adding another language is a small,
  type-checked change — see below.
- **Sections:** header with mobile menu, hero, six services, team, demo booking
  calendar + form, messenger links, urgent-help block with an always-available button
  and modal, contacts, and footer.
- **Demo booking calendar** — opens on the current month, disables past dates, marks
  busy/free hours from local demo data, and highlights the selection.
- **Accessibility** — semantic markup, labelled fields, visible focus, keyboard
  navigation, and a modal that closes on Escape and restores focus.
- Calm light theme with green accents; red is reserved for urgent help. Responsive
  for phone, tablet, and desktop.

## Pet account (demo)

Open **/[locale]/account** (e.g. `/uk/account`) or the "Кабінет улюбленця" link in the
site header — no login. It shows how a clinic's client area could look, focused on the
animal: two demo pets (cat, dog), profile with age from the birth date, next appointment
(booking reuses the site's demo calendar), vaccination reminder, visit history,
vaccinations and demo documents; add / edit a pet.

- **No real authorization, backend or medical system.** All records are fictional; demo
  documents are not medical reports or official papers.
- **Demo data:** seed in `src/lib/account/seed.ts` (dates are relative to the first visit,
  so upcoming items stay in the future); texts per language in
  `src/lib/i18n/dictionaries/account/`.
- **Storage:** changes are saved only in the browser's `localStorage`
  (key `vetcare.petAccount.v1`) and never sent anywhere. If storage is unavailable or the
  data is invalid, the account falls back to the seed. **"Скинути демодані"** (with
  confirmation) clears it.
- Details and acceptance criteria: [`docs/SPEC.md` §10](docs/SPEC.md).

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

Type check: `npx tsc --noEmit` · Lint: `npm run lint` · Tests: `npm test` (account data logic,
Node's built-in test runner — no extra dependencies)

The same checks (lint → type check → tests → build) run in GitHub Actions on every pull request
and every push to `main` — see `.github/workflows/ci.yml`.

Deployed on Vercel: https://vetcare-clinic-pi.vercel.app (auto-deploys from `main`).
Works on any Next.js-compatible host. No environment variables required.

## Configuration

| What | Where |
| --- | --- |
| Translations (all text) | `src/lib/i18n/dictionaries/{ro,uk,en,pl}.ts` |
| Photos (hero, team) | `public/images/` — replace files with the same names |
| Contacts (phone, WhatsApp, Telegram, map) | `src/lib/site-config.ts` |
| Colors, spacing, styles | `src/app/globals.css` (CSS variables at the top) |
| Demo calendar data | `src/lib/booking-data.ts` |

**Contacts / demo mode.** In `src/lib/site-config.ts` all contact values are `null` by
default, so the messenger and call buttons show a clear demo-mode message instead of
fake numbers. Fill in real values and the buttons become live automatically.

**Add a language (e.g. German).** Add `'de'` to `locales` and a `localeMeta.de` entry in
`src/lib/i18n/config.ts`, create `src/lib/i18n/dictionaries/de.ts` (copy `en.ts` and
translate), register a `de` loader in `src/lib/i18n/dictionaries.ts`, and add the skip-link
label in `src/app/[lang]/layout.tsx` (TypeScript flags it). Components stay unchanged.

## Project structure

```
src/
  app/[lang]/         # locale segment: layout + page (sections); account/ = pet account
  proxy.ts            # redirect / -> /ro
  components/         # sections and interactive parts (calendar, form, modal)
  components/account/ # pet account UI, dialogs, localStorage store
  lib/i18n/           # locale config, Dictionary types, dictionaries (+ account/)
  lib/account/        # pet account data: types, seed, validation, storage (+ tests)
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
