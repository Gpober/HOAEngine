# Supabase integration

HOA Engine can read association records and community photography from
Supabase, so demos can be created and edited without a code deploy.

**The integration is optional.** With no environment variables set, the app
serves the bundled records in `data/associations.ts` exactly as before.

## Which project

These objects live in the **Condo Questionaire** project
(`whlrbqdqxrpipthxmcbs`), alongside the existing condo-questionnaire product.
Everything HOA Engine adds is prefixed `hoa_` and is strictly additive — no
existing table, policy, or function was modified.

## Environment variables

```bash
NEXT_PUBLIC_SUPABASE_URL=https://whlrbqdqxrpipthxmcbs.supabase.co
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=sb_publishable_...
```

Both must be set for the integration to activate; if either is missing the app
falls back to the bundled records. Add them in Vercel under
**Settings → Environment Variables**, or in `.env.local` for local development.

The publishable key is safe to expose. The RLS policy on `hoa_associations`
exposes only rows where `published` is true, and every write requires an admin.

## The table: `public.hoa_associations`

One row renders one demo homepage. Scalar facts are real columns; repeating
content is JSONB, because it is always read whole for a single demo and never
queried relationally. That keeps one row equal to one `Association`
configuration object in the app.

| Column | Notes |
| --- | --- |
| `slug` | Unique. URL segment — `/demo/<slug>`. Constrained to lowercase and hyphens. |
| `name` | Full legal name, used for the hero and footer |
| `short_name` | Optional. Header lockup; long legal names truncate badly |
| `monogram` | Optional. Falls back to initials derived from `name` |
| `city`, `state`, `community_type`, `residence_count`, `established_year` | All nullable — omitted facts drop out of the layout |
| `management_company`, `phone`, `email`, `office_hours`, `emergency_contact`, `office_address` | All nullable — the UI falls back to "Contact information available upon official site setup." |
| `hero_image` | JSONB object: `{ "alt": "...", "placeholder": "waterfront" }` or `{ "alt": "...", "src": "harborlight/hero.jpg" }` |
| `gallery_images` | JSONB array of the same shape |
| `amenities` | JSONB array of amenity keys. Unrecognised keys are dropped at render time |
| `announcements`, `meetings`, `documents` | JSONB arrays matching the types in `lib/types.ts` |
| `faqs` | JSONB array, or null to use the shared sample set |
| `accent_theme` | `coastal` · `resort` · `sage` · `urban` · `heritage` (enforced by check constraint) |
| `design_style` | `coastal-classic` · `modern-resort` · `friendly-community` · `urban-condominium` · `active-adult` |
| `design_name`, `design_tagline` | Shown on the portfolio card |
| `published` | **Defaults to false.** A concept is invisible until you flip this |
| `condo_project_id` | Optional FK to `public.condo_projects`, for concepts built from a project already in that dataset |

Check constraints enforce the theme and design-style values and require the
JSONB content columns to be arrays, so a malformed row is rejected at write
time rather than breaking a page.

### Row level security

| Policy | Effect |
| --- | --- |
| `read published hoa_associations` | Anyone (including `anon`) may read rows where `published` is true |
| `Admins read all hoa_associations` | Admins additionally see unpublished drafts |
| `Admins insert / update / delete` | All writes require `public.is_admin()` |

`is_admin()` is the project's existing helper — it matches the JWT email
against `public.admins`. HOA Engine reuses it rather than adding a parallel
auth path.

## Storage: the `hoa-engine-media` bucket

Public-read, admin-write, 10 MB per file, limited to JPEG, PNG, WebP, and AVIF.

To use a photograph:

1. Upload it in the Supabase dashboard under **Storage → hoa-engine-media**.
   Organising by association (`harborlight/hero.jpg`) keeps things tidy.
2. Put the object path — not the full URL — in the image object:

   ```json
   { "src": "harborlight/hero.jpg", "alt": "Describe the image for screen readers." }
   ```

3. `lib/supabase.ts` resolves the path to a public URL; `next/image` optimises
   it. Full `https://` URLs and local `/public` paths are passed through
   untouched, so you can mix sources.

`alt` is required on every image. Only upload imagery you have the rights to —
never a photograph lifted from an association's own website.

## How the app reads it

`lib/associations-source.ts` is the single source of truth:

```
bundled records (data/associations.ts)   ← always the baseline
        + published rows from Supabase   ← layered on top, wins on matching slug
```

Consequences worth knowing:

- A database outage, a bad key, or a network failure degrades to the bundled
  five rather than an empty site. The failure is logged, not thrown.
- Editing the `coastal-classic` row in Supabase changes that demo, because the
  slugs match.
- New slugs appear as new demos without touching the codebase.
- Rows with an unrecognised theme or design style are skipped; unknown amenity
  keys are dropped. External data cannot break a page render.

Pages use ISR with `revalidate = 300`, so edits go live within five minutes
while pages still serve as static HTML. `dynamicParams = true` means a brand
new row resolves on first request rather than 404ing until the next build.

## Adding a demo through the database

```sql
insert into public.hoa_associations (
  slug, name, short_name, city, state, short_description, community_type,
  hero_image, gallery_images, amenities, announcements, meetings, documents,
  accent_theme, design_style, design_name, design_tagline, published
) values (
  'oakwood-commons',
  'Oakwood Commons Condominium Association',
  'Oakwood Commons',
  'Springfield', 'IL',
  'A description you wrote yourself, in neutral terms.',
  'Condominium Association',
  '{"alt":"Community photograph.","src":"oakwood/hero.jpg"}'::jsonb,
  '[]'::jsonb,
  '["pool","clubhouse","grounds"]'::jsonb,
  '[]'::jsonb, '[]'::jsonb, '[]'::jsonb,
  'coastal', 'coastal-classic',
  'Coastal Classic',
  'One-line description for the portfolio grid.',
  false   -- publish only once you have reviewed it
);
```

The rules in [REPLACING-DATA.md](REPLACING-DATA.md) apply in full to database
rows: no invented facts, no copied content, no fabricated people, sample content
stays labelled, and the disclaimers and `noindex` stay in place. Those labels
are enforced in the application layer, so they cannot be switched off from the
database — which is deliberate.

## What lives where

| | Source of truth | Why |
| --- | --- | --- |
| The five canonical **design** concepts | `data/associations.ts` | Templates, versioned with the code. Nobody edits them at runtime. |
| **Prospect** concepts for real associations | `public.hoa_associations` | Created and edited by sales without a deploy. |

`hoa_associations` **cannot** hold a canonical design slug — a check constraint
(`hoa_associations_not_a_canonical_design`) rejects `coastal-classic`,
`modern-resort`, `friendly-community`, `urban-condominium`, and
`active-adult-community` on insert.

That constraint exists because of a real failure. The five designs were
originally seeded into the table as well. When the file later gained
photography, the stale rows still had placeholder-only `hero_image` values, and
because published rows override bundled records on matching slug, the live site
kept rendering drawn placeholders. Nothing errored: the two sources simply
disagreed and the stale one won.

Holding a second copy of a template that is never edited at runtime bought
nothing and cost correctness. Now it is impossible.

For prospect concepts the override is deliberate and correct: edit the row and
the change is live within the ISR window, no deploy. The bundled copies in
`data/prospect-concepts.ts` are the offline fallback for when Supabase is
unreachable or unconfigured.

**If you change a prospect's images or content in the file, change the row too**
— the row is what visitors see.
