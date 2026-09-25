# VetClinic — multilingual veterinary clinic demo

[![CI](https://github.com/Oleksandr-Vakuliak/vetcare-clinic/actions/workflows/ci.yml/badge.svg)](https://github.com/Oleksandr-Vakuliak/vetcare-clinic/actions/workflows/ci.yml)

A single-page website for a **fictional** veterinary clinic, built as a portfolio
piece. It ships four complete language versions and a demo booking experience —
with **no backend or database** (the demo pet account and admin panel keep changes only
in your browser).

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
- **Demo booking calendar** — opens on the current month, disables past dates, and shows
  free/busy 30-minute slots from the shared demo data (doctors' hours, breaks, closed
  slots, existing appointments). A valid request is saved **in this browser only** as
  "awaiting confirmation" and appears in the demo admin panel.
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
- The next appointment shows its status; confirmations, reschedules and cancellations made
  in the admin panel appear here, completed visits appear in the history.
- **Demo data and storage** are shared with the admin panel — see below.
- Details and acceptance criteria: [`docs/SPEC.md` §10](docs/SPEC.md).

## Admin panel (demo)

Open **/[locale]/admin** (e.g. `/uk/admin`) or the secondary "Демо для адміністратора"
link in the site footer. It shows how clinic staff could manage appointments and the
schedule. It is an **open demo, not a secured system**: there is deliberately no password
or role check, and all data is fictional.

- **Overview** — today's appointments, requests awaiting confirmation and free slots left
  today (all computed from the demo data); the day's appointments with search and
  filters; doctors' current state; quick actions.
- **Appointments** — search by pet or owner, filter by date/period, doctor and status;
  details with change history; create, confirm, reschedule, complete, cancel (with
  confirmation; cancelled records stay in the list). Only meaningful status changes are
  offered: *pending → confirmed → completed*, *pending/confirmed → cancelled*.
- **Schedule** — day or week view per doctor; weekly working hours and a break; close or
  reopen a single slot. Changes that would affect existing appointments are refused and
  the conflicting appointments are listed — nothing is deleted silently.
- **Pets** — searchable list; card with photo, species, breed, birth date, weight,
  fictional owner and appointment history; edit basic data or add a pet.

Booking rules are the same everywhere (site form, pet account, admin): required fields, no
past time, inside the doctor's hours and outside the break, not closed, and no second
active appointment for the same doctor and slot (a pending request reserves its slot).

### Shared demo data & storage

- The site calendar, the pet account and the admin panel use **one local model**
  (`src/lib/clinic/`: types, seed, schedule, appointments, storage + tests).
- Saved only in this browser: `localStorage["vetcare.demo.v2"]` (versioned). Data from the
  first pet-account release (`vetcare.petAccount.v1`) is **migrated** once and nothing is
  lost. Broken data → start from the seed with a notice (the old value is kept in
  `vetcare.demo.v2.backup`); unavailable storage → works in memory with a notice. Other
  open tabs update through the `storage` event. Nothing is sent to a server, e-mail or
  messenger; the site form validates the phone number but does not store it.
- All dates and times are clinic time, **Europe/Bucharest**.
- **"Скинути демодані"** (in the pet account or the admin sidebar, with confirmation)
  resets everything — including the related demo appointments in the pet account and the
  site calendar.

### Demo limitations

- One appointment length for everyone: **30 minutes** (`SLOT_MINUTES` in
  `src/lib/clinic/config.ts`); one break per weekday; closing works per single slot.
- Demo appointments are generated for about two weeks around the first visit; later days
  are empty.
- Data lives in one browser: no sync between devices or people. This is **not** a
  multi-user system.

**What a real system would need:** server-side authentication, roles and access rights, a
shared database with transactions (so two people can't book one slot), an audit log,
notifications to clients, and GDPR-compliant handling of personal and medical data.
Details: [`docs/SPEC.md` §11–12](docs/SPEC.md).

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

Type check: `npx tsc --noEmit` · Lint: `npm run lint` · Tests: `npm test` (demo data logic:
booking conflicts, status transitions, schedule, storage and migration; Node's built-in test
runner — no extra dependencies)

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
| Demo data (doctors' hours, slot length, time zone) | `src/lib/clinic/config.ts`, seed in `src/lib/clinic/seed.ts` |

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
  app/[lang]/         # locale segment: layout + page; account/ = pet account; admin/ = admin panel
  proxy.ts            # redirect / -> /ro
  components/         # sections and interactive parts (calendar, form, modal)
  components/demo-store.ts # shared localStorage store (React hook)
  components/account/ # pet account UI and dialogs
  components/admin/   # admin panel UI: shell, overview, appointments, schedule, pets
  lib/i18n/           # locale config, Dictionary types, dictionaries (+ account/, admin/)
  lib/clinic/         # shared demo model: schedule, appointments, seed, storage (+ tests)
  lib/account/        # pet account view of the model, pet form validation (+ tests)
  lib/site-config.ts  # contacts (demo mode)
  lib/dates.ts        # locale-aware date formatting (Intl)
public/images/        # photos + CREDITS.md
```

## Notes

- **Portfolio demo.** The clinic, doctor profiles, address, and hours are fictional.
  The booking form does **not** create real appointments: a valid request is stored only
  in this browser as a demo record and nothing is sent anywhere.
- Photos are from [Unsplash](https://unsplash.com) under the Unsplash License; sources
  are listed in [`public/images/CREDITS.md`](public/images/CREDITS.md).
- This project was built with the help of an AI coding assistant (Claude Code); all code
  was reviewed and verified (build, type check, and browser testing).
