# HOA Engine

Sample homepage concepts for homeowner and condominium associations, built for
sales demonstrations by **HOA Daddy**.

Five visually distinct designs share one component system. Each site is
generated from a single configuration object, so a new concept is a data change
rather than a design project.

> **Every page carries these two labels, and they are not optional:**
>
> - **Sample Design by HOA Daddy**
> - **Unofficial concept. Not affiliated with or endorsed by the association.**

---

## What's here

| Route                            | What it is                                             |
| -------------------------------- | ------------------------------------------------------ |
| `/demo`                          | Portfolio grid — all five concepts with live thumbnails |
| `/demo/coastal-classic`          | Demo 1 — navy, coastal blue, sand; serif headings       |
| `/demo/modern-resort`            | Demo 2 — charcoal, muted teal, beige; full-bleed hero   |
| `/demo/friendly-community`       | Demo 3 — sage, cream, muted gold; rounded cards         |
| `/demo/urban-condominium`        | Demo 4 — deep navy, slate, light gray; structured grid  |
| `/demo/active-adult-community`   | Demo 5 — burgundy, navy, warm cream; enlarged type      |
| `/`                              | Redirects to `/demo`                                    |

Every homepage includes: header with resident-login (marked **Demo**), hero,
quick links, community overview, announcements, upcoming meetings, documents and
forms, amenities, management contact, FAQ, and footer with the watermark and
disclaimer — plus the floating **Website Concept by HOA Daddy** badge and modal.

## Setup

Requires Node.js 18.18 or newer.

```bash
npm install
npm run dev        # http://localhost:3000
```

Other scripts:

```bash
npm run build      # production build
npm run start      # serve the production build
npm run typecheck  # tsc --noEmit
npm run lint       # eslint
```

No database, no backend, no environment variables required.

## Folder structure

```
app/
  layout.tsx              Root layout, fonts, site-wide noindex metadata
  page.tsx                Redirects / → /demo
  not-found.tsx           404
  robots.ts               Disallows all crawlers (see "Guardrails")
  globals.css             Tailwind layers, focus states, type-scale overrides
  demo/
    page.tsx              Portfolio grid + per-page SEO metadata
    [slug]/page.tsx       One route per association (static, noindex)

components/
  DemoSite.tsx            Composes a whole homepage from one Association object
  HoaDaddyBadge.tsx       Floating sales badge + native <dialog> modal
  site/                   The page sections
    SiteHeader.tsx  DisclaimerBar.tsx  HeroSection.tsx  QuickLinks.tsx
    CommunityOverview.tsx  Announcements.tsx  UpcomingMeetings.tsx
    DocumentsAndForms.tsx  Amenities.tsx  ManagementContact.tsx
    FaqSection.tsx  SiteFooter.tsx
  portfolio/
    DemoCard.tsx          Portfolio card
    DemoThumbnail.tsx     Live miniature of a demo, drawn from its own tokens
  ui/                     Button, Card, Container, Section, SampleTag,
                          CommunityImage (+ generated placeholder scenes)

data/
  associations.ts         The five fictional placeholder records
  association-template.ts Reusable configuration template — start here

lib/
  types.ts                Association shape and content types
  themes.ts               Five colour palettes as CSS custom properties
  design-styles.ts        Typography, radii, hero layout, type scale
  amenities.ts            Amenity catalogue (label, blurb, icon)
  content.ts              Navigation, quick links, default FAQ, helpers
  brand.ts                HOA Daddy strings and every disclaimer
  seo.ts                  Metadata builder + the shared noindex rule
  cn.ts                   Class-name joiner

public/og/                Placeholder Open Graph image
docs/                     Data replacement, theming, and QC guides
```

## How a demo is assembled

```
data/associations.ts        one Association object
        │
        ├── accentTheme  ──→ lib/themes.ts        → CSS custom properties
        ├── designStyle  ──→ lib/design-styles.ts → fonts, radii, hero layout
        │
        └── components/DemoSite.tsx
                 sets both on a wrapper element, then renders the same
                 section components for every demo
```

Because the palette arrives as CSS variables (`--hoa-accent`, `--hoa-surface`,
…) and Tailwind's colour utilities resolve to those variables, there is not a
single conditional class name anywhere in the section components.

## Documentation

- **[docs/REPLACING-DATA.md](docs/REPLACING-DATA.md)** — replacing placeholder
  data with a real association, and the rules that apply when you do
- **[docs/THEMING.md](docs/THEMING.md)** — changing colours, fonts, radii, and
  images
- **[docs/QUALITY-CONTROL.md](docs/QUALITY-CONTROL.md)** — the responsive,
  accessibility, disclaimer, and visual-consistency review

## Deploying to Vercel

1. Push this repository to GitHub.
2. In Vercel, **Add New → Project**, import the repository.
3. Framework preset **Next.js**; build command `npm run build`; output is
   detected automatically. No environment variables are required.
4. Optional — set `NEXT_PUBLIC_SITE_URL` to the deployment URL (for example
   `https://hoa-engine.vercel.app`) so Open Graph image URLs resolve to absolute
   paths. Without it, local development falls back to `http://localhost:3000`.
5. Deploy. All six routes are statically prerendered.

Or from the CLI:

```bash
npm i -g vercel
vercel          # preview deployment
vercel --prod   # production deployment
```

**Before sharing a link with a prospect**, confirm on the deployed URL that the
sample-design label and footer disclaimer are visible, and that
`https://<your-domain>/robots.txt` still returns `Disallow: /`.

Because these are unofficial concepts, prefer keeping deployments unlisted and
sharing links directly rather than publishing them anywhere crawlable.

## Guardrails

These are baked into the project. Please keep them that way.

- **Watermark and disclaimer stay visible.** `DisclaimerBar` at the top of every
  demo and the watermark block in `SiteFooter`. Strings live in `lib/brand.ts`.
- **`noindex, nofollow` stays on.** Set in `app/layout.tsx`, reinforced per page
  via `lib/seo.ts`, and backed by `app/robots.ts` returning `Disallow: /`.
- **No invented facts.** Every factual field on `Association` is optional and
  the UI omits what is missing. Where contact details are absent, the site shows
  *"Contact information available upon official site setup."*
- **No scraped or copyrighted material.** No stock photography is bundled — the
  imagery is generated SVG. Do not copy an association's text, photographs,
  seals, or logos.
- **No fabricated people.** No testimonials, no board member names, no reviews.
- **Placeholder contact details are obviously fake.** Phone numbers use the
  reserved `555-01xx` range; email addresses use `example.com` / `example.org`;
  management companies are prefixed *"Example"*.
