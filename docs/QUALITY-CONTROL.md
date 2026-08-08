# Quality control review

Review of the five demo concepts and the portfolio page, covering responsive
behaviour, accessibility, disclaimers, and visual consistency.

Checks were run against a production build (`npm run build && npm run start`)
driven with headless Chromium. The scripts used are described under each
section so the review can be repeated after changes.

---

## 1. Responsive design

**Method.** Every route loaded at five widths — 360, 390, 768, 1280, and 1440 px
— comparing `document.documentElement.scrollWidth` against the viewport width
and, on any mismatch, walking the DOM for elements crossing the viewport edge.

**Result: pass.** No horizontal overflow on any route at any tested width.

Three real defects were found and fixed during the review:

| Issue | Cause | Fix |
| --- | --- | --- |
| Header pushed pages up to **582 px** wide on a 360 px viewport | The brand lockup was a flex item without `min-w-0`, so the association name refused to shrink and `truncate` never engaged | `min-w-0` on the lockup, `shrink-0` on nav and actions |
| Sample-label pill overflowed announcement cards by 9 px at 768 px | Pill sits beside a 48 px icon in a 221 px card and cannot shrink below its own text | `flex-wrap` on the card header row; announcements now go two-up at `sm` rather than three-up at `md` |
| Long legal names truncated to `"Sunfie…"` in the header | Six nav links plus a full legal name do not fit one row, especially at the enlarged type scale | Optional `shortName` per association; the enlarged type scale uses a focused four-item desktop nav |

**Breakpoint behaviour**

- Desktop navigation appears at `xl` (1280 px); below that a disclosure menu with
  a 48 × 48 px toggle, `aria-expanded`, `aria-controls`, and Escape-to-close.
- Card grids step 1 → 2 → 3 columns (quick links reach 4 at `xl`).
- Split heroes stack to a single column below `lg`.
- The floating badge is `position: fixed` bottom-right and does not obstruct
  content at any width; it is hidden in print.

**Known trade-off.** At 1280–1440 px the Active Adult demo shows four desktop nav
links where the other four demos show six. That is deliberate: at the enlarged
type scale six links only fit by shrinking the targets, which works against the
point of that design. All six sections remain reachable from the mobile menu,
the quick-link cards, and the footer.

---

## 2. Accessibility

**Method.** Programmatic contrast sampling of every text node against its
composited background; keyboard walkthrough of the interactive elements; landmark,
heading, and alternative-text audit.

### Colour contrast — pass

All five palettes clear WCAG AA on every text node: 4.5:1 for body copy, 3:1 for
large text. Verified for `ink` / `ink-soft` / `ink-muted` on both `surface` and
`card`, `accent-ink` on `accent`, and `secondary-ink` on `secondary-soft`.

The Modern Resort hero overlays text on artwork, so it was measured from
rendered pixels rather than computed styles. That check found a genuine failure:
`via-accent/88` is not on Tailwind's gradient opacity scale and **compiled to
nothing**, silently dropping the scrim's middle stop and leaving parts of the
heading at **2.57:1** and the paragraph at **3.15:1**. With in-scale stops
(`from-accent/95 via-accent/90 to-accent/20`) the same measurement now reads
**4.56:1 or better across the entire text column**, and 6:1–8:1 over most of it.

> If you re-run the computed-style contrast script, it will report six
> "failures" on `/demo/modern-resort`. Those are artifacts: the scrim is a
> sibling element, not an ancestor background, so the script walks past it to a
> white ancestor and reports 1.04:1. Trust the pixel measurement.

### Keyboard and semantics — pass

| Check | Result |
| --- | --- |
| First `Tab` reaches a visible "Skip to main content" link | Pass |
| Focus indicator | 3 px accent outline with 3 px offset, applied globally via `:focus-visible`; inverted on dark accent surfaces |
| Concept badge modal | Native `<dialog>` + `showModal()` — focus moves inside, is trapped, Escape closes, backdrop click closes |
| FAQ disclosures | Native `<details>`/`<summary>`; open with Enter or Space; work with JavaScript disabled |
| Mobile menu | `aria-expanded` toggles, `hidden` toggles, Escape closes |
| Landmarks | Exactly one `<main>`, one `<header>`, one `<footer>`, one `<h1>` per page |
| Alternative text | No `<img>` without `alt`; every decorative SVG is `aria-hidden`; every meaningful SVG has `role="img"` and `aria-label` |
| Accessible names | No button without a text or `aria-label` name |

### Other provisions

- Base font size 16 px; no primary content below 16 px. The only 12 px text is
  uppercase eyebrows and chips, which the enlarged type scale raises to 15 px.
- Touch targets: buttons 44 px minimum height (52 px at `lg`), icon buttons
  48 × 48 px, nav rows 44–52 px.
- `prefers-reduced-motion: reduce` disables animation and smooth scrolling.
- Anchor targets carry `scroll-margin-top` so the sticky header never covers a
  heading after in-page navigation.
- Card-covering links use a stretched pseudo-element so each card is one
  properly-labelled focus stop rather than several.
- Resident Login is labelled *"Resident Login — demo only, not a working portal"*
  for screen readers and carries a visible **Demo** badge.

---

## 3. Disclaimers and guardrails

**Method.** Fetched every rendered route and searched the HTML for each required
string; inspected robots metadata.

**Result: pass on all six routes.**

| Requirement | Status |
| --- | --- |
| "Sample Design by Condo Seen" | Present on all six routes — top bar and footer watermark |
| "Unofficial concept. Not affiliated with or endorsed by the association." | Present on all six routes — top bar and footer |
| Full footer disclaimer | Present on all six routes; also in the badge modal and the contact panel |
| `noindex, nofollow` meta | `<meta name="robots" content="noindex, nofollow, nocache">` on every route |
| `/robots.txt` | `User-Agent: *` / `Disallow: /` |
| Open Graph metadata | Title, description, site name, URL, and placeholder image on each demo |

**Content guardrails**

- No testimonials, board members, staff names, or reviews anywhere.
- Announcement cards carry "Demo Announcement", "Sample Meeting Notice", and
  "Sample Maintenance Update"; meetings carry "Sample Meeting Schedule" and use
  `"Sample date"` rather than plausible dates.
- Document cards are marked "Demo downloads" and each link is announced as
  "demo link, no file attached".
- Placeholder contact details are unmistakably fictional: `555-01xx` numbers,
  `example.com` / `example.org` addresses, management companies prefixed
  *"Example"*.
- Cedar Hollow deliberately omits phone and email, and Sunfield Village omits
  the emergency contact, so the *"Contact information available upon official
  site setup."* fallback is exercised by the bundled data.
- No stock photography is bundled. All imagery is generated SVG tinted by the
  active theme, and each placeholder carries a visible "Photo placeholder" chip.

---

## 4. Visual consistency

**Method.** Full-page captures of all six routes at 1440 px plus a mobile pass at
390 px, reviewed side by side.

**Result: pass.**

- All five demos render from the identical component tree in
  `components/DemoSite.tsx`. Section order, spacing rhythm, card anatomy, and
  icon treatment are the same everywhere; only palette, type, radii, and hero
  layout differ.
- No component contains a hard-coded colour or a theme conditional — palettes
  arrive as CSS custom properties, so a demo cannot drift from its theme.
- Portfolio thumbnails are live miniatures built from each demo's own tokens
  rather than screenshots, so they cannot go stale.
- The five palettes are clearly distinct: navy/sand, teal/beige, sage/gold,
  navy/slate, burgundy/cream.

Two visual defects were found and fixed:

| Issue | Cause | Fix |
| --- | --- | --- |
| Modern Resort hero showed a flat colour wash with no artwork | `CommunityImage` received an `absolute` class that collided with its own `relative`; the wrapper collapsed to zero height and the SVG never rendered | The caller wraps it in its own positioned element; the component documents that its wrapper must stay `relative` |
| Wide frames showed one enormous cropped shape | A 4:3 stage sliced into a 2.8:1 frame zooms hard | `focus="center"` pads the stage horizontally instead of zooming; ground bands extended to cover the padded area |

---

---

## 5. Supabase integration

**Method.** Schema and RLS inspected via SQL; the mapping layer exercised
against a real row; the mapped record rendered through the real component tree.

**Result: pass, with one thing I could not test here.**

| Check | Result |
| --- | --- |
| Migration is additive | Pass — `condo_projects` (6,319), `condo_projects_legacy` (12,390), and `leads` (1) unchanged; no existing table, policy, or function modified |
| RLS on `hoa_associations` | Pass — 5 policies. Anonymous read is limited to `published` rows; all writes require the project's existing `is_admin()` |
| Storage bucket | Pass — `hoa-engine-media`, public read, admin write, 10 MB cap, image MIME types only |
| Security advisors after migration | Pass — 64 advisories exist project-wide, **none** relates to an `hoa_` object |
| Row → Association mapping | Pass — snake_case to camelCase, nulls omitted rather than rendered, unknown amenity key dropped, unknown theme rejects the row |
| DB-sourced record renders | Pass — full component tree renders with the sample-design label, unofficial notice, footer disclaimer, and the contact fallback all intact |
| Fallback when Supabase is unreachable | Pass — demonstrated unintentionally but conclusively (see below) |
| **Live fetch from the deployed app** | **Not verified here** |

**What I could not test, and why.** This build sandbox blocks outbound requests
to `*.supabase.co` — the egress proxy answers `403` to `CONNECT`. My SQL worked
because the Supabase MCP server reaches the project through separate
infrastructure, but the Next.js build in the container cannot open a socket to
it. A build with credentials present therefore fell back to the bundled records
and prerendered exactly five slugs.

That is a genuine gap: **the end-to-end fetch has not been exercised against a
running app.** It also, incidentally, proved the fallback path works under a
real network failure rather than a simulated one.

Confirm on the first deploy: set the two environment variables, deploy, and
check that a change made to a row in Supabase appears on the corresponding
`/demo/<slug>` page within the five-minute revalidation window. If it does not,
the likely causes are missing environment variables (the app falls back
silently by design) or `published` still being `false`.

---

## 6. Prospect concepts (real, named associations)

`data/prospect-concepts.ts` holds 20 concepts that name **real** condominium
associations, so the guardrails here are load-bearing rather than illustrative.

**Method.** A prospect record was mapped from its database row and rendered
through the full component tree, then asserted against.

**Result: pass.**

| Check | Result |
| --- | --- |
| Sample-design label, unofficial notice, footer disclaimer | Present |
| Contact fields absent → standard fallback shown | Pass |
| Amenities absent → section omitted entirely | Pass |
| No residence count or founding year emitted | Pass |
| No city emitted — state only | Pass |
| Announcements and meetings still carry sample labels | Pass |
| Resident login announced as demo-only | Pass |

**What these records assert.** Exactly three facts, all sourced from the condo
dataset: association name, county, state. Everything else is absent by
construction rather than blanked at render time.

**Why `city` is absent.** The source data holds counties. A county is not a
city, so deriving "York, ME" from York County would place a fabricated fact on a
real organisation's page. The header shows the state alone.

**Standing constraint.** The financing-friendly badge is only truthful for a
project with a `Full` review and an unexpired questionnaire — the
`financing_badge_eligible` column in `hoa_outreach_targets` computes precisely
that. It must never be shown for a lapsed project.

---

## 7. Deployment notes

- The bundled records mean the site renders all 25 concepts with **no
  environment variables**. Supabase credentials are additive: matching database
  rows override bundled ones on `slug`.
- Vercel builds production on a **push to the production branch**. Connecting a
  project does not retroactively deploy the existing head, so a freshly
  connected project shows preview deployments only until the next push to
  `main` (or a preview is promoted to production).
- Check deployment protection before sending any link to a prospect. Vercel
  Authentication set to `all_except_custom_domains` puts every `*.vercel.app`
  URL behind a login wall, which silently breaks outreach.

## Re-running this review

```bash
npm run typecheck && npm run lint && npm run build && npm run start
```

Then, against the running server:

1. **Overflow** — load each route at 360/390/768/1280/1440 px and assert
   `document.documentElement.scrollWidth <= innerWidth`.
2. **Contrast** — walk text nodes, composite each against its background stack,
   and assert 4.5:1 (3:1 for large text). For text over imagery, hide the text,
   screenshot, and sample the rendered pixels instead.
3. **Keyboard** — first `Tab` reaches the skip link; the badge modal traps focus
   and closes on Escape; FAQ summaries respond to Enter; the mobile menu toggles
   `aria-expanded` and closes on Escape.
4. **Disclaimers** — grep each rendered route for the three required strings and
   confirm `/robots.txt` returns `Disallow: /`.

## Current status

| Area | Status |
| --- | --- |
| Build, typecheck, lint | Clean — no errors, no warnings |
| Responsive (360–1440 px) | Pass — no horizontal overflow |
| Contrast (AA) | Pass — verified from rendered pixels where text overlays imagery |
| Keyboard and semantics | Pass |
| Disclaimers and `noindex` | Pass on all six routes |
| Visual consistency | Pass |
| Supabase schema, RLS, mapping | Pass — live fetch unverified in this sandbox (see section 5) |
| Prospect concepts (real associations) | Pass — see section 6 |
