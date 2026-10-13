# Trekker Himalaya — trekking website

A responsive website for an independent trek guide in **Himachal Pradesh** and **Uttarakhand**.
Visitors browse treks, filter them, read day-by-day itineraries, pick a package and send a
prefilled enquiry on **WhatsApp**. There is no backend, database, login or payment — trek
content lives in typed local files.

**Stack:** Next.js 16 (App Router, static generation) · React 19 · TypeScript · Tailwind CSS 4 ·
Motion · Lucide icons · Inter (self-hosted via Fontsource). Layout style inspired by the
Waymark template: light neutral theme, floating pill navigation, two-tone headlines, soft
bordered cards with tinted panels.

---

## Quick start

```bash
npm install
cp .env.example .env.local     # then fill in the values below
npm run dev                    # http://localhost:3000
```

| Script              | What it does                         |
| ------------------- | ------------------------------------ |
| `npm run dev`       | Development server                   |
| `npm run build`     | Production build (all pages static)  |
| `npm start`         | Serve the production build           |
| `npm run typecheck` | TypeScript check                     |
| `npm run lint`      | ESLint                               |
| `npm test`          | Unit tests (filters, WhatsApp links) |

---

## ⚠️ Before launch — fill these in

### 1. Environment variables (`.env.local` or your host's settings)

| Variable                      | Example format      | Purpose                                                                 |
| ----------------------------- | ------------------- | ----------------------------------------------------------------------- |
| `NEXT_PUBLIC_WHATSAPP_NUMBER` | `91XXXXXXXXXX`      | Your WhatsApp number, **digits only** with country code (no `+`/spaces) |
| `NEXT_PUBLIC_SITE_URL`        | `https://yoursite.in` | Production domain — enables canonical URLs, sitemap and structured data |

These are read at **build time** — rebuild after changing them.

Without a WhatsApp number, enquiry buttons are disabled in development (with an
explanation) and link to `/contact` in production. No broken `wa.me` links are ever generated.

### 2. Business details — `src/config/site.ts`

Brand name and wordmark, optional logo, email, phone, base location, social links, the hero's
featured trek, and the **guide profile** (name, photo, introduction, why you trek, guiding
philosophy, real credentials only). Anything left `null`/empty is hidden or replaced with
neutral copy. In development, yellow "Setup" notes show what's still missing — they never
appear in production.

Policies (`policies.terms`, `policies.cancellation`, `policies.emergencyContact`) stay
"being finalised" until you add the real text. The privacy page describes the site as
shipped (no forms, accounts, analytics or tracking cookies) — update it if you add any.

### 3. Trek catalog — `src/data/treks.ts`

**All six treks are illustrative samples** (`status: "sample"`), based on commonly published
route outlines. Each trek page shows a visible "Sample itinerary" notice until you change the
status to `"verified"`. For each trek:

- Confirm or rewrite the itinerary (the number of days must match `durationDays`).
- Add `pricePerPerson` in INR — leave it out to show "Contact us for pricing".
- Add real `inclusions` / `exclusions` (empty shows "to be confirmed").
- Optionally add verified `maxAltitudeM`, `distanceKm`, and per-day altitudes/distances.
- Packages: each trek has a "Group departure" option (some also "Private / custom group").
  Add prices, accommodation, transport, group size or requirements per package as needed.

Every card, count, filter, destination page and detail page is derived from this one file.
No departure dates are listed anywhere — visitors suggest a date and you confirm availability.

### 4. Photos — `src/data/images.ts`

Current images are **stock photos from Unsplash** (free under the Unsplash License). They are
atmospheric placeholders, **not photos of these specific treks or your groups**. Replace them
with your own: put files in `public/photos/` and use `{ src: "/photos/name.jpg", alt: "…" }`.

### 5. Testimonials — `src/data/testimonials.ts`

Empty by design: the section stays hidden until you add real, permitted feedback.

### 6. Homepage FAQ — `src/data/faqs.ts`

General answers that describe how the site works. Edit them to match your actual policies.

---

## How it fits together

```
src/
  app/                     Routes (App Router)
    page.tsx               Homepage
    treks/page.tsx         Catalog with search, filters, sort (state in the URL)
    treks/[slug]/          Trek detail: itinerary, packages, booking, packing, safety, FAQ
    destinations/[slug]/   Himachal Pradesh / Uttarakhand pages
    about, contact, privacy, terms, cancellation-policy, not-found, sitemap, robots
  components/
    layout/                Navbar, footer, page header, wordmark
    home/                  Homepage sections
    treks/                 Trek card, explorer, filter panel
    itinerary/             Day-by-day timeline accordion
    booking/               Booking context, package selector, panel, mobile bar
    trek/ contact/ ui/     Smaller building blocks
  config/site.ts           Business settings
  data/                    Treks, destinations, images, gallery, FAQs, testimonials
  lib/                     WhatsApp links, filters, formatting, SEO, image loader
  types/trek.ts            Domain types
```

**WhatsApp** — `src/lib/whatsapp.ts` builds official `https://wa.me/<number>?text=<encoded>`
links. Trek enquiries include the trek, state, duration, and the visitor's selected package,
preferred date and group size — only what they actually chose. Visitors can preview the
message before WhatsApp opens. Nothing on the site claims a booking is confirmed.

**Filters** — `src/lib/filters.ts` handles search, destination, difficulty, duration, season
and price filters plus sorting. Filter state is kept in the URL (e.g.
`/treks?state=uttarakhand&difficulty=easy`) so it's shareable. Price filters appear once at
least one trek has a price.

**Design tokens** — `src/app/globals.css` (`@theme`). Change `--color-accent` to re-brand;
keep white text on it at 4.5:1 contrast or better.

**Motion** — scroll reveals, a light hero parallax on desktop, and accordion transitions.
Everything respects the OS "reduce motion" setting.

---

## Quality checks

```bash
npm run typecheck && npm run lint && npm test && npm run build
```

Browser QA scripts (Python Playwright) live in `scripts/`:

- `scripts/qa.py` — every route at 320–1680 px for horizontal overflow, console errors and
  stray `undefined`/`null`/`NaN`; filters, sorting, URL state, itinerary accordions, package
  selection, message preview, mobile menu, filter drawer, gallery lightbox, mobile booking bar,
  404 page and reduced motion. Run against `npm start -- -p 3100`.
- `scripts/qa_whatsapp.py` — WhatsApp links when built with a test number
  (`NEXT_PUBLIC_WHATSAPP_NUMBER=910000000000 npm run build`).

## Deploying

Any Next.js host works (Vercel, Netlify, a Node server). Set the two environment variables,
then build. All pages are pre-rendered at build time.
