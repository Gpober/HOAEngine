# Replacing placeholder data with a real association

The five bundled records are fictional. This is how to build a concept for a
real association without turning it into something that could be mistaken for
their official website.

## Before you start — the rules

These apply to every concept you build for a named, real-world association.

1. **The labels stay.** *"Sample Design by Condoseen"* and *"Unofficial concept.
   Not affiliated with or endorsed by the association."* appear at the top of
   the page and again in the footer. Do not remove, shrink, or hide them.
2. **`noindex` stays on.** Nothing here should ever be indexed.
3. **Only use facts you can point at a source for.** If a detail is not
   published by the association or its management company, leave the field out.
   The layout handles absence — it does not need filling.
4. **Do not copy their content.** No text lifted from their site or documents,
   no photographs, no association seal, crest, or logo. Write your own neutral
   description; use the generated placeholder imagery.
5. **No invented people.** No board members, no staff, no testimonials.
6. **Do not present sample content as real.** Announcements, meetings, and
   documents keep their sample labels and `"Sample date"` values until the
   association supplies its own.
7. **Placeholder contact details must be obviously fake.** Use the reserved
   `555-01xx` phone range and `example.com` / `example.org` email domains — or
   omit the field entirely, which is usually better.

## Two routes: file or database

You can add a concept either as a TypeScript record (below) or as a row in
Supabase (see [SUPABASE.md](SUPABASE.md)). The rules in this document apply
identically to both. Database rows win over file records on matching `slug`.

Use the file route for concepts you want versioned in git; use the database
route when someone non-technical needs to create or edit demos without a deploy.

## Step 1 — copy the template

```bash
cp data/association-template.ts data/oakwood-commons.ts
```

`data/association-template.ts` documents every field inline, including which
values are valid for `amenities`, `accentTheme`, and `designStyle`.

## Step 2 — fill in what you know, delete what you don't

Rename the export and set the fields you have sources for:

```ts
export const oakwoodCommons: Association = {
  slug: "oakwood-commons",
  name: "Oakwood Commons Condominium Association",
  shortName: "Oakwood Commons",
  city: "Springfield",
  state: "IL",
  shortDescription: "A description you wrote yourself, in neutral terms.",
  communityType: "Condominium Association",
  // residenceCount: omitted — not published anywhere
  // establishedYear: omitted — not published anywhere
  managementCompany: "Verified Management Company Name",
  // phone / email omitted — the site will show the standard fallback
  ...
};
```

Deleting a field is the correct move when you are unsure. Here is what each
omission does:

| Omitted field                       | What the page does                                                |
| ----------------------------------- | ----------------------------------------------------------------- |
| `residenceCount`, `establishedYear`, `communityType`, `city`/`state` | The row simply disappears from the community overview |
| `phone`, `email`, `officeHours`, `emergencyContact`, `managementCompany` | Contact section lists what is pending and shows *"Contact information available upon official site setup."* |
| all contact fields                  | The whole contact card becomes the fallback message                |
| `faqs`                              | Falls back to the shared sample FAQ set in `lib/content.ts`        |
| `heroImage.src`                     | A generated placeholder scene is drawn instead                     |
| `monogram`                          | Initials are derived from `name`                                   |
| `shortName`                         | The full `name` is used in the header (and may truncate)           |

## Step 3 — register the record

In `data/associations.ts`:

```ts
import { oakwoodCommons } from "./oakwood-commons";

export const associations: Association[] = [
  harborlightPoint,
  velaRidge,
  cedarHollow,
  marquetteNinth,
  sunfieldVillage,
  oakwoodCommons,
];
```

The route `/demo/oakwood-commons`, the portfolio card, the static params, and
the SEO metadata are all generated from that array. Nothing else to wire up.

To *replace* a bundled demo rather than add to it, swap the entry and delete the
old record's file.

## Step 4 — verify before you send the link

```bash
npm run typecheck
npm run build
npm run start
```

Then walk the page and confirm:

- [ ] The sample-design bar is visible at the top.
- [ ] The footer watermark and full disclaimer are present.
- [ ] Announcements and meetings still carry their sample labels.
- [ ] No fact appears that you cannot source.
- [ ] No association logo, seal, or photograph has been added.
- [ ] `/robots.txt` returns `Disallow: /`.
- [ ] View source: `<meta name="robots" content="noindex, nofollow">` is present.

## Turning a concept into a real site

When an association signs on, the same configuration becomes the real site's
data. At that point — and only then:

- Replace `href: "#"` on documents with real file URLs.
- Replace placeholder contact details with the association's own.
- Replace sample announcements and meetings with real notices, and drop the
  `sampleLabel` / `"Sample date"` values.
- Add licensed photography via `src` on the image objects.
- Remove the demo labels and the `noindex` rules — see
  [THEMING.md](THEMING.md) for where those live.

Until that point, the labels stay on.
