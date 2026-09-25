# VetClinic — Specification

Status: living document · Owner: Oleksandr Vakuliak · Type: portfolio demo

## 1. Overview & purpose

A single-page, multilingual marketing website for a **fictional** veterinary clinic,
built as a **portfolio piece** to demonstrate front-end craft (clean code, accessible
UI, responsive design, i18n). It is not a production clinic site.

Primary goal: look professional and be flawless to click through, so it can be shown to
potential clients. Secondary goal: serve as a reusable reference for future real sites.

## 2. Audience & goals

- **Portfolio viewers / potential clients** — judge visual quality, correctness, and
  polish within seconds.
- **The clinic's would-be visitors (simulated)** — find services, meet the team, "book"
  a time, reach the clinic, and see how to get urgent help.

Success = no broken buttons, no console errors, fully translated in four languages,
works on phone/tablet/desktop, accessible by keyboard and screen reader.

## 3. Scope

### In scope
- Static, single-page site with the eight sections in §5.
- Four complete languages: **Romanian (primary), Ukrainian, English, Polish**.
- **Demo** booking calendar + inquiry form: a valid request creates a *pending* demo
  appointment stored **only in this browser** (§12); nothing is sent anywhere.
- **Demo mode** for contacts: messenger/call actions explain themselves when real
  contacts are not configured.
- Content edited directly in source files (dictionaries, `site-config.ts`, images).
- **Demo "Pet account"** at `/[locale]/account` (§10) — browser-only, no real login.
- **Demo admin panel** at `/[locale]/admin` (§11) — browser-only, open, not a secured system.

### Out of scope (now)
- Any backend, database, authentication, roles or real (secured) admin system.
- Real appointment booking / real data submission.
- Analytics, ads, or third-party trackers.
- Animation libraries, large component kits, parallax/3D/scroll effects.

### Possible future rework (backlog, not planned)
- If a real client adopts this, gather their requirements and, if needed, rebuild the
  booking into a real flow (e.g. Calendly, email inquiry, or a small backend + DB) and
  swap demo photos/contacts for real ones. Kept as roadmap notes only.

## 4. Non-functional requirements

- **Internationalization** — all copy in dictionaries; components reused across locales;
  dates/calendar localized via `Intl`; `/` → `/ro`; routes `/ro`, `/uk`, `/en`.
- **Accessibility** — semantic HTML, labelled fields, visible keyboard focus, full
  keyboard operation, sufficient contrast; modal closes on Escape and restores focus;
  skip-to-content link.
- **Responsive** — phone, tablet, desktop; no horizontal overflow; usable tap targets.
- **Performance** — optimized images; hero image eager (not lazy), secondary images lazy;
  minimal JS (client components only where interactive).
- **SEO/meta** — correct `title`, `description`, and `lang` per language; language
  alternates.
- **Quality bar** — production build and TypeScript check pass; no console errors; no
  dead buttons.
- **Security** — no secrets in the repo; no personal data sent or stored; demo mode never
  shows fake confirmations or invented contacts.
- **No animations** beyond simple hover/focus states; normal page scroll.

## 5. Functional requirements (by section)

Each section below is a work item; acceptance criteria are the "done" checklist.

**Visual reference:** the owner's design mockup (single-page PNG, Ukrainian). Composition,
proportions, spacing, colours, type sizes and block styling follow it; where the mockup
conflicts with the rules below (honest demo content, accessibility), these rules win.
Palette: sage/forest green on warm off-white, red only for urgent help. Fonts: Inter (text)
and Caveat (short handwritten accents), self-hosted via `next/font`. No animations.

### 5.1 Header
Paw mark + clinic name; centred navigation to services, doctors, booking, contacts;
compact language menu. Compact working menu on mobile.
- AC: sticky header; desktop nav + language menu; mobile hamburger toggles an accessible
  panel (nav + primary CTA); menu closes on link click and Escape.
- Language menu: one button with the current short label and a down arrow (RO ▾, UA ▾,
  EN ▾, PL ▾) opens Română / Українська / English / Polski with a check mark on the current
  one (`aria-current`). Choosing navigates to that language and closes the list; click
  outside, Escape and Tab close it; arrow keys / Home / End move focus. Labels and names
  use `translate="no"`. "UA" is only the visible label — the locale code and URL stay
  `uk` / `/uk`. On phones it sits in the header next to the menu button and stays on
  screen.

### 5.2 Hero
Large full-width photo (vet with a cat) with a dark gradient; white text; a short
handwritten accent ("Більше щасливих днів разом ♡").
- AC: heading "Турбота про тих, кого ви любите" (localized); subtitle about cats & dogs
  and easy booking; "Обрати час" → booking, "Зв'язатися" → contacts; hero image is
  **not** lazy-loaded; readable over the image at all widths.

### 5.3 Services
Six cards: checkup, vaccination, tests, dentistry, ultrasound, consultation. Each with a
simple icon and short description. No extra pages or dead buttons.
- AC: six localized horizontal cards (round icon left, title + text right) in a responsive
  grid (1→2→3 columns); inline SVG icons.

### 5.4 About & team
Short text and two veterinarian cards. Fictional clinic — no invented awards, reviews,
licenses, or credential claims. Profiles marked as demonstration.
- AC: section title above; intro text + demo note on the left; two horizontal team cards
  (photo left, role, name, demo bio) on the right.

### 5.5 Booking (demo calendar + form)
- Calendar opens on the current month; months navigable forward; future dates selectable;
  **past dates disabled**.
- For a selected date, show free/busy 30-minute slots computed from the shared demo model
  (§12: doctors' hours, breaks, closed slots, existing appointments, clinic time); busy
  slots not selectable; selected time clearly highlighted; label "Демокалендар — години умовні".
- Form fields: owner name, phone, pet name, animal, reason, preferred communication language (defaults to
  the site language, changeable). Show the selected date/time near the form (a compact
  line above the submit button). Fields are boxed with an icon; labels stay available to
  screen readers. Layout on wide screens: calendar card · form · handwritten accent.
- Validate required fields (owner name, phone, pet name, date/time); phone allows
  international format. On valid submit a **pending** demo appointment is saved in this
  browser only (owner name, pet name, species, reason, slot; the phone and communication
  language are validated but not stored) and the form says so: the request waits for
  confirmation in the demo admin panel, nothing was sent to the clinic. Nothing is sent
  over the network; no false confirmation.
- AC: all of the above verified in the browser.

### 5.6 Messengers
"Зручніше написати?" block with WhatsApp and Telegram buttons. Contacts live in one config
file. If real contacts are not set, buttons show a clear demo-mode message — never random
or third-party accounts. Structure allows adding real links later.
- AC: demo-mode message shown when unconfigured; buttons become live links when configured.
- Layout: one row — title + text, two large tinted buttons (WhatsApp green, Telegram blue),
  handwritten accent.

### 5.7 Emergency help
Prominent "Потрібна термінова допомога?" block with a primary "Зателефонувати" action and
text "Зателефонуйте, щоб уточнити можливість прийому." A separate always-available
"Термінова допомога" button opens a compact modal with contact and working hours. If
contacts are not configured, clearly say it is demo mode; do not promise 24/7 or invent an
on-call clinic. On mobile the button must not cover the form or other elements.
- AC: red accent; floating button; accessible modal (Escape + focus return); compact on
  phones; demo-mode messaging.
- Layout: pink band — bell icon, title + text, call button, and working hours on the
  right. The mockup's "after hours — on-call clinic contacts" line is **not** used: no such
  contacts exist, so the slot shows the real working hours instead.

### 5.8 Contacts & footer
Contacts live in the footer (as in the mockup; anchor `#contacts`): brand + tagline,
address and working hours with icons, and the map slot. Space for a Romania address,
working hours, and a map. Until a real address exists, show a
tidy map placeholder (no random real clinic). Prominent "Демонстраційний проєкт" badge.
- AC: address/hours (demo), map placeholder or embed if configured, demo badge, footer.

## 6. Technical approach

- **Next.js 16 (App Router) + TypeScript + plain CSS.** No UI/animation libraries.
- Locale segment `src/app/[lang]/`; `generateStaticParams` for `ro/uk/en`; `proxy.ts`
  redirects `/` → `/ro`.
- Server components by default; client components only for interactive parts (header menu,
  language switcher, calendar, form, emergency modal).
- Content: `src/lib/i18n/dictionaries/{ro,uk,en,pl}.ts` (shape enforced by `Dictionary`
  type), `src/lib/site-config.ts` (contacts), `public/images/` (photos).
- Deploy target: Vercel (no environment variables required).

## 7. Content & localization

- All user-facing text lives in the dictionaries; components never hard-code copy.
- Dates, month names, and weekdays come from `Intl` using each locale's BCP-47 tag.
- **Add a language:** add it to `locales` and `localeMeta`, create its dictionary, register a
  loader, and add the skip-link label in `app/[lang]/layout.tsx` (type-checked). Polish was
  added this way (2026-09-25).

## 8. Assets & rights

- Photos are rights-cleared (Unsplash License), listed in `public/images/CREDITS.md`.
- No image generation via paid APIs; the full mockup is not used as a site image.

## 9. Definition of Done (project-level)

- All eight sections implemented and localized in RO/UK/EN/PL.
- `npm run build` and `npx tsc --noEmit` pass; `npm run lint` clean.
- No console errors; no horizontal overflow; no dead buttons.
- Keyboard + screen-reader friendly; modal focus handling correct.
- Verified on narrow and wide viewports.
- README explains run, deploy, and where to edit photos/translations/contacts.

## 10. Pet account (demo)

**Purpose.** Portfolio example of a client area focused on the animal (no owner photo or
data). Visual reference: the owner's account mockup (PNG); matches the site's palette.

**Entry.** Secondary "Кабінет улюбленця" link on the home page → `/[locale]/account`, no
login. Account header: logo, "На сайт клініки" link, the site's language menu (switching
keeps the selected pet and tab). Label "Демонстраційний кабінет · Усі дані вигадані".

**Features**
- Pet switcher: cards with small photos (demo cat Мурчик, dog Луна) + "Додати улюбленця".
- Profile: large photo, name, species, breed, age (computed from birth date), weight,
  "Редагувати профіль". No health ratings or "healthy" claims.
- Next appointment: date, time, reason, fictional doctor; empty state if none. "Записати на
  прийом" reuses the demo calendar; past dates and busy/taken slots can't be chosen. The
  new appointment belongs to the selected pet, with the notice "Демонстраційний прийом
  додано лише в цьому браузері. Клініку не повідомлено".
- Next vaccination reminder with "Переглянути" → Vaccinations tab. Dates are conditional,
  not medical advice.
- Tabs: visit history (date, reason, doctor → details with a short demo note, no treatment
  plans); vaccinations (name, date, next date if set); documents (clearly marked demo
  texts shown in a dialog; no download, not an official passport).
- Add/edit pet form: name, species (cat/dog), breed (optional), birth date, weight.
  Validation: required fields, real past birth date (≤ 40 years), weight > 0 (≤ 150 kg).
  New pets get a neutral cat/dog illustration and no invented history (empty states
  explain why).

**Data & storage.** Seed data in code, generated relative to the first visit (upcoming
dates stay in the future). The selected pet and tab are stored with the data, so they
survive a language switch and a reload. Since the admin panel, data is part of the shared
model (§12): the next appointment shows its status (pending / confirmed), admin reschedules
and cancellations appear here, completed appointments appear in the visit history, and a new
booking starts as pending. Changes live only in `localStorage` (never sent). Notice:
"Зміни зберігаються лише в цьому браузері. Не вводьте реальні персональні чи медичні
дані". "Скинути демодані" with confirmation. If storage is unavailable or data is
invalid, the account works with the seed data. No hydration errors, no flash of another
language.

**Done when**
- RO/UK/EN/PL fully translated (UI, messages, demo records); both pets switch correctly.
- Add/edit pet, demo booking (appears on the right pet), tabs, document dialog and empty
  states work; changes survive reload; reset restores the seed.
- Phone: one column, no page-wide horizontal overflow; labelled fields, visible focus,
  keyboard use; dialogs trap focus, close on Escape and return focus.
- Unit tests for the data logic and the key scenario; lint, TypeScript and build pass.

## 11. Admin panel (demo)

**Purpose.** Show a potential client how clinic staff would manage appointments and the
schedule. Portfolio demo: **no server, no real authorization, no real personal data**. The
page is open to anyone and is **not** a secured system — there is deliberately no fake
password or role check.

**Visual reference:** the owner's admin mockup (PNG, "Огляд" screen): left sidebar (brand +
"Демо адміністратора", four sections, links back to the site / pet account and "Скинути
демодані" at the bottom), breadcrumb + language menu on top, green banner, page title, cards
and tables on a light background with green accents. Other sections follow the same style.
Mockup names, dates and numbers are examples only. No animations.

**Entry & navigation.** `/[locale]/admin` (overview), `/admin/appointments`,
`/admin/schedule`, `/admin/pets`. Secondary link "Демо для адміністратора" in the site
footer. Desktop: sidebar; phones: compact top navigation. The site's compact language menu
keeps the current section. Always visible: "Демонстраційна адмінпанель · Усі дані вигадані".
Pages are `noindex`.

**Scenarios**
1. *Overview.* Today in the clinic (clinic date): appointments today (not cancelled),
   requests waiting for confirmation (all dates), free 30-minute slots left today — all
   computed from the demo data. Below: appointments table for a day (default today) with
   search, doctor, status and date; "Додати запис"; doctors' current state (appointment /
   break / free / not working) with "Відкрити розклад"; quick actions "Додати улюбленця"
   and "Налаштувати години". No revenue charts, marketing stats or invented metrics.
2. *Appointments.* List with date & time, pet, fictional owner, doctor, reason, status.
   Search by pet or owner name; filters by date (or period: upcoming / past / all), doctor,
   status. Details (incl. change history), create, confirm, reschedule, complete, cancel
   (with confirmation). Cancelled records stay in the list (history).
3. *Schedule.* Day or week view for a chosen doctor. Set weekly working hours and a break
   per weekday; close a single slot for booking and reopen it. If a change would affect
   existing active appointments, the conflicts are listed and the change is refused until
   they are rescheduled or cancelled — records are never removed silently.
4. *Pets.* Searchable list of demo pets; card with photo, name, species, breed, birth date,
   weight, fictional owner and appointment history. Edit basic data; add a pet (reuses the
   pet account's form and model). No prescriptions, diagnoses, billing or medical records.

**Status model.** `pending` («Очікує підтвердження») · `confirmed` («Підтверджено») ·
`completed` («Завершено») · `cancelled` («Скасовано»).

| From | Allowed actions |
| --- | --- |
| pending | confirm (only while the start is in the future), reschedule, cancel |
| confirmed | complete (only once the start time has come), reschedule, cancel |
| completed, cancelled | none (final) |

Rescheduling keeps the status. Every change is appended to the appointment's history.

**Booking rules** (same for the site form, pet account and admin): required fields; slot on
the 30-minute grid inside the doctor's hours, outside the break, not closed; not in the past
(clinic time); no second active (pending or confirmed) appointment for the same doctor and
slot. Pending requests reserve their slot too. The site form and the pet account pick the
first free doctor; admin chooses the doctor. Admin-created appointments start as confirmed
(staff entered them); site/account requests start as pending.

**Done when**
- RO/UK/EN/PL fully translated (UI, statuses, errors, demo content).
- End-to-end: visitor books → admin sees pending → confirms → pet account shows it →
  rescheduling moves the busy slot → cancelling frees it → state survives reload.
- Schedule conflicts shown and enforced; invalid status actions not offered or rejected.
- Phone layout without page-wide horizontal overflow (tables become cards); keyboard
  operable; dialogs trap focus, close on Escape, return focus; no hydration errors.
- Unit tests: booking conflicts, status transitions, storage + migration; lint, TypeScript,
  tests and build pass.

**Limitations (v1).** One fixed appointment length for everyone (`SLOT_MINUTES = 30` in
`src/lib/clinic/config.ts`); one break per weekday; closing works per single slot; demo
appointments are generated for about two weeks around the first visit, later days are free.
Data lives in one browser — no sync between devices or people.

**For a real system** (not in this demo): server-side authentication, roles and access
rights, a shared database with transactions (so two people can't take one slot), audit
log, notifications to clients, GDPR-compliant handling of personal and medical data.

## 12. Shared demo data (browser storage)

The site calendar, the pet account and the admin panel read and write **one** local model:
pets (with a fictional owner and an "in pet account" flag), appointments (status, source,
history; a site request stores only pet name, species and owner name instead of a pet),
vaccinations, documents, doctors' weekly hours/breaks, closed slots and UI state.

- **Key:** `localStorage["vetcare.demo.v2"]`, `version: 2`. The previous pet-account key
  `vetcare.petAccount.v1` is **migrated** once (pets, appointments, visits → completed
  appointments, vaccinations, documents and selection are kept; clinic demo data is added
  around them) and then removed.
- **Time zone:** all dates and times are wall-clock times in the clinic's zone,
  `Europe/Bucharest` ("now" is computed with `Intl`, independent of the visitor's zone).
- Seed data is relative to the first visit. Invalid stored data → start from the seed with
  a visible notice (the broken value is kept under `vetcare.demo.v2.backup`). Storage
  unavailable → works in memory with a notice. Other tabs update through the `storage` event.
- Notice where data is edited: "Демо: зміни зберігаються лише в цьому браузері й не
  синхронізуються з іншими пристроями. Не вводьте реальні персональні або медичні дані".
- "Скинути демодані" (with confirmation) resets the whole model — including demo
  appointments shown in the pet account and the site calendar. Nothing is ever sent to a
  server, e-mail or messenger.

## 13. Presentation for clients

Small additions that make the demo easy to show (issues #20–#22).

**13.1 Demo guide on the home page (#20).** A compact band right after the hero (the hero
composition stays as in the mockup): "Це демо-проєкт — спробуйте за хвилину" and three
numbered steps with links: 1) pet account — book a visit for a pet; 2) admin panel —
confirm the request; 3) back in the pet account — the status has changed. A short line
adds that the site form also sends a request to the admin panel. Honest wording: all data
is fictional and stays in this browser.
- AC: RO/UK/EN/PL; links go to `/[locale]/account`, `/[locale]/admin/appointments`;
  no horizontal overflow at 320 px; keyboard focus visible; no animations.

**13.2 Link preview — Open Graph (#21).** Every page shares a 1200×630 JPEG
(`public/images/og.jpg`, ~65 KB so messengers show it: green panel with "VetClinic" +
language-neutral caption, hero photo on the right; rebuilt with `node scripts/og-image.mjs`) plus `og:title`, `og:description`, `og:locale`, `og:site_name`,
`og:type` and `twitter:card = summary_large_image`. Absolute URLs use `siteUrl` from
`src/lib/site-config.ts` (change it together with a custom domain).
- AC: tags present on every locale and page (site, pet account, admin); image reachable
  with 200; lint/types/build pass.

**13.3 Custom 404 (#22).** Any unknown address inside a locale (`/uk/xyz`,
`/pl/admin/xyz`, …) shows a branded page in that language — "Сторінку не знайдено", short
text, links to the home page, the pet account and the admin panel — with HTTP status 404
and `noindex`. Paths without a locale are already redirected to `/ro/...` by `proxy.ts`.
Implementation: `app/global-not-found.tsx` (experimental `globalNotFound` flag — the Next.js
docs recommend it when the root layout lives in a dynamic segment such as `app/[lang]`; a
plain `[lang]/not-found.tsx` was not server-rendered). `proxy.ts` passes the URL locale in the
`x-vetcare-locale` request header, so the page renders in the right language on the server.
- AC: 4 languages, correct `<html lang>`, status 404, phone layout, no console errors.

## 14. Open questions

- Which browsers/devices to formally test beyond Chromium (Safari/iOS)?
- Final decision on Polish: include now or keep as backlog?
