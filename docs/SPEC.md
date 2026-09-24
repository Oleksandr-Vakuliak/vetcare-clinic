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

Success = no broken buttons, no console errors, fully translated in three languages,
works on phone/tablet/desktop, accessible by keyboard and screen reader.

## 3. Scope

### In scope
- Static, single-page site with the eight sections in §5.
- Three complete languages: **Romanian (primary), Ukrainian, English**; structure ready
  for Polish.
- **Demo** booking calendar + inquiry form (validation only — no submission, no storage).
- **Demo mode** for contacts: messenger/call actions explain themselves when real
  contacts are not configured.
- Content edited directly in source files (dictionaries, `site-config.ts`, images).

### Out of scope (now)
- Any backend, database, authentication, or admin panel.
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

### 5.1 Header
Clinic name + simple mark; navigation to services, doctors, booking, contacts; RO/UK/EN
switcher. Compact working menu on mobile.
- AC: sticky header; desktop nav + language switcher; mobile hamburger toggles an
  accessible panel (nav + language + primary CTA); current language marked
  `aria-current`; menu closes on link click and Escape.

### 5.2 Hero
Large still photo (vet with a cat) as the visual; strong text contrast.
- AC: heading "Турбота про тих, кого ви любите" (localized); subtitle about cats & dogs
  and easy booking; "Обрати час" → booking, "Зв'язатися" → contacts; hero image is
  **not** lazy-loaded; readable over the image at all widths.

### 5.3 Services
Six cards: checkup, vaccination, tests, dentistry, ultrasound, consultation. Each with a
simple icon and short description. No extra pages or dead buttons.
- AC: six localized cards in a responsive grid (1→2→3 columns); inline SVG icons.

### 5.4 About & team
Short text and two veterinarian cards. Fictional clinic — no invented awards, reviews,
licenses, or credential claims. Profiles marked as demonstration.
- AC: intro text + demo note; two team cards with photo, role, and demo bio.

### 5.5 Booking (demo calendar + form)
- Calendar opens on the current month; months navigable forward; future dates selectable;
  **past dates disabled**.
- For a selected date, show demo free/busy hours; busy hours not selectable; selected time
  clearly highlighted; local demo data only; label "Демокалендар — години умовні".
- Form fields: name, phone, animal, reason, preferred communication language (defaults to
  the site language, changeable). Show the selected date/time near the form.
- Validate required fields; phone allows international format. On valid submit show
  "Це демонстрація. Запис не створено, дані не надіслано". **No** data sent or stored; no
  false confirmation.
- AC: all of the above verified in the browser.

### 5.6 Messengers
"Зручніше написати?" block with WhatsApp and Telegram buttons. Contacts live in one config
file. If real contacts are not set, buttons show a clear demo-mode message — never random
or third-party accounts. Structure allows adding real links later.
- AC: demo-mode message shown when unconfigured; buttons become live links when configured.

### 5.7 Emergency help
Prominent "Потрібна термінова допомога?" block with a primary "Зателефонувати" action and
text "Зателефонуйте, щоб уточнити можливість прийому." A separate always-available
"Термінова допомога" button opens a compact modal with contact and working hours. If
contacts are not configured, clearly say it is demo mode; do not promise 24/7 or invent an
on-call clinic. On mobile the button must not cover the form or other elements.
- AC: red accent; floating button; accessible modal (Escape + focus return); compact on
  phones; demo-mode messaging.

### 5.8 Contacts & footer
Space for a Romania address, working hours, and a map. Until a real address exists, show a
tidy map placeholder (no random real clinic). Prominent "Демонстраційний проєкт" badge.
- AC: address/hours (demo), map placeholder or embed if configured, demo badge, footer.

## 6. Technical approach

- **Next.js 16 (App Router) + TypeScript + plain CSS.** No UI/animation libraries.
- Locale segment `src/app/[lang]/`; `generateStaticParams` for `ro/uk/en`; `proxy.ts`
  redirects `/` → `/ro`.
- Server components by default; client components only for interactive parts (header menu,
  language switcher, calendar, form, emergency modal).
- Content: `src/lib/i18n/dictionaries/{ro,uk,en}.ts` (shape enforced by `Dictionary`
  type), `src/lib/site-config.ts` (contacts), `public/images/` (photos).
- Deploy target: Vercel (no environment variables required).

## 7. Content & localization

- All user-facing text lives in the dictionaries; components never hard-code copy.
- Dates, month names, and weekdays come from `Intl` using each locale's BCP-47 tag.
- **Add Polish (future):** add `'pl'` to `locales` and `localeMeta`, create `pl.ts`, and
  register a loader — no component changes.

## 8. Assets & rights

- Photos are rights-cleared (Unsplash License), listed in `public/images/CREDITS.md`.
- No image generation via paid APIs; the full mockup is not used as a site image.

## 9. Definition of Done (project-level)

- All eight sections implemented and localized in RO/UK/EN.
- `npm run build` and `npx tsc --noEmit` pass; `npm run lint` clean.
- No console errors; no horizontal overflow; no dead buttons.
- Keyboard + screen-reader friendly; modal focus handling correct.
- Verified on narrow and wide viewports.
- README explains run, deploy, and where to edit photos/translations/contacts.

## 10. Open questions

- Which browsers/devices to formally test beyond Chromium (Safari/iOS)?
- Final decision on Polish: include now or keep as backlog?
