# The Galleon — bespoke concept photography (ready to generate)

Prompt pack for the `/demo/the-galleon` concept. Run when the Picsart
connector is available; total cost ≈ 4 credits. The goal is imagery *similar
to* the real setting — an 18-storey curved tower on 200 feet of Fort
Lauderdale beachfront — without depicting the actual building or lifting any
photograph. This is original placeholder scenery in their likeness, clearly
labelled illustrative, exactly like the rest of the library.

## Style line (append to every prompt)

> Editorial real-estate photography, golden hour, natural colour, no people,
> no text or signage, photorealistic, wide format.

## The four images

1. **Hero — `galleon/hero.png`**
   A gently curved 18-storey oceanfront condominium tower in cream and white,
   seen from the beach at golden hour, 200 feet of sandy Atlantic beachfront
   in the foreground, turquoise ocean, palms at the dune line, South Florida
   light.

2. **Gallery 1 — `galleon/beach.png`** (caption: "The beach")
   A wide sandy Atlantic beach at sunrise directly below a row of
   condominium towers, gentle surf, sea oats on the dune, no people.

3. **Gallery 2 — `galleon/pool.png`** (caption: "Pool deck")
   An elevated ocean-view pool deck at a Florida condominium, loungers and
   umbrellas, the Atlantic visible beyond a glass balustrade, tropical
   planting.

4. **Gallery 3 — `galleon/grounds.png`** (caption: "Tropical grounds")
   Manicured tropical grounds at the base of an oceanfront tower — royal
   palms, walkway pavers, bougainvillea — late-afternoon light.

## Import + wiring (the checklist)

1. Generate the four images; note the temporary CDN URLs (they expire).
2. Update the fixed manifest in the `import-design-images` Edge Function
   (Supabase project `whlrbqdqxrpipthxmcbs`) with the four `from` URLs and
   the `galleon/…` destinations above — the fixed-manifest pattern stays; do
   not make the importer accept arbitrary URLs.
3. Invoke it, verify the four objects exist in `hoa-engine-media`.
4. Point the row at them (alt text stays marked illustrative):

```sql
update public.hoa_associations set
  hero_image = '{"src":"galleon/hero.png","alt":"An oceanfront condominium tower above a sandy beach at golden hour — illustrative placeholder photography.","placeholder":"waterfront"}'::jsonb,
  gallery_images = '[
    {"src":"galleon/beach.png","alt":"A wide sandy beach at sunrise below condominium towers — illustrative placeholder photography.","placeholder":"waterfront","caption":"The beach"},
    {"src":"galleon/pool.png","alt":"An ocean-view pool deck with loungers — illustrative placeholder photography.","placeholder":"pool","caption":"Pool deck"},
    {"src":"galleon/grounds.png","alt":"Tropical grounds with royal palms beneath an oceanfront tower — illustrative placeholder photography.","placeholder":"garden","caption":"Tropical grounds"}
  ]'::jsonb
where slug = 'the-galleon';
```

5. The page refreshes within the ISR window (five minutes). Check the hero
   tagline's legibility over the new photograph on a phone.

## Rules that still apply

No photographs from thegalleon.org, no depiction of the actual building
(similar is the brief; identical is not), all alt text marked illustrative,
sample labels and noindex untouched. Real photography replaces all of this
the day the association engages and supplies it.
