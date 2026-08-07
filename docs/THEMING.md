# Changing colours, type, and images

Every visual difference between the five demos comes from two files. No section
component contains a colour, a font, or a conditional class name.

## How theming works

`components/DemoSite.tsx` puts two sets of CSS custom properties on a wrapper
element:

```tsx
<div style={{ ...themeStyle(accentTheme), ...designStyleVars(designStyle) }}>
```

`tailwind.config.ts` maps every colour utility to those variables:

```ts
colors: { accent: "rgb(var(--hoa-accent) / <alpha-value>)", … }
```

So `bg-accent` on a card resolves to whatever the active palette says, opacity
modifiers included.

## Changing colours

### Adjust an existing palette

Edit the entry in `lib/themes.ts`. Values are `R G B` triplets (space-separated,
no commas — that is what lets Tailwind apply `/50` opacity modifiers).

```ts
coastal: {
  surface: "247 249 251",       // page background
  "surface-alt": "234 241 247", // alternating band
  card: "255 255 255",          // cards and panels
  ink: "18 35 58",              // headings and body text
  "ink-soft": "51 70 94",       // secondary text
  "ink-muted": "87 104 125",    // captions, eyebrows
  accent: "20 57 94",           // primary brand colour
  "accent-strong": "13 39 64",  // hover / pressed
  "accent-soft": "220 233 244", // icon wells, tints
  "accent-ink": "255 255 255",  // text sitting on `accent`
  secondary: "185 143 85",      // warm supporting colour
  "secondary-soft": "244 233 216",
  "secondary-ink": "92 67 24",  // text sitting on `secondary-soft`
  line: "217 226 236",          // hairline borders
  shadow: "15 42 69",           // base colour of the shadow stack
}
```

**Contrast rules when you change these:**

- `ink`, `ink-soft`, `ink-muted` must each clear **4.5:1** against both `surface`
  and `card`.
- `accent-ink` must clear **4.5:1** against `accent`.
- `secondary-ink` must clear **4.5:1** against `secondary-soft`.

`docs/QUALITY-CONTROL.md` describes the automated check used to verify this.

### Add a new palette

1. Add a key to `AccentTheme` in `lib/types.ts`.
2. Add the matching entry to `themes` and a label to `themeLabels` in
   `lib/themes.ts`.
3. Set `accentTheme: "your-key"` on an association.

TypeScript will point at anything you missed.

### A gotcha worth knowing

Tailwind's **gradient** stop utilities only accept opacity values from the
default scale (`10 20 25 30 40 50 60 70 75 80 90 95 100`). `via-accent/88`
compiles to *nothing* — the stop silently disappears and the gradient loses its
middle colour. Regular colour utilities (`bg-card/85`) are more permissive. If a
scrim looks wrong, check the compiled CSS before adjusting the design.

## Changing type, radii, and layout

Edit `lib/design-styles.ts`:

```ts
"coastal-classic": {
  fontDisplay: "var(--font-fraunces), Georgia, serif",  // headings
  fontBody: "var(--font-inter), system-ui, sans-serif", // body
  radiusCard: "1rem",       // cards, panels, images
  radiusPill: "999px",      // buttons, chips
  typeScale: "regular",     // "large" bumps every text size up a step
  heroLayout: "split",      // split | overlay | stacked | panel
  heroFlip: false,          // mirrors the split hero
  eyebrow: "serif",         // "caps" or "serif" section eyebrows
  sectionPadding: "py-16 md:py-24",
  headingTracking: "-0.015em",
}
```

### The four hero layouts

| Layout    | Shape                                              | Used by             |
| --------- | -------------------------------------------------- | ------------------- |
| `split`   | Text and image side by side (`heroFlip` mirrors it) | Demos 1 and 3       |
| `overlay` | Full-bleed image with a scrim and overlaid text     | Demo 2              |
| `stacked` | Centred text above a wide image                     | Demo 5              |
| `panel`   | Text card plus image and fact tiles in a grid       | Demo 4              |

### The enlarged type scale

`typeScale: "large"` sets `data-type-scale="large"` on the wrapper. Because
Tailwind's `text-*` utilities are root-relative rems, the scale is applied by
overriding those utilities inside that subtree — see the rules at the bottom of
`app/globals.css`. The navigation itself stays sparse at every scale — two
links a side plus the full-screen menu — so touch targets stay generous.

### Changing fonts

Fonts are loaded in `app/layout.tsx` via `next/font/google` and exposed as CSS
variables (`--font-inter`, `--font-fraunces`, `--font-manrope`, `--font-nunito`).
To swap one:

```tsx
import { Playfair_Display } from "next/font/google";
const playfair = Playfair_Display({
  subsets: ["latin"], display: "swap", variable: "--font-playfair",
});
// add `${playfair.variable}` to the <html> className
```

Then reference `var(--font-playfair)` in `lib/design-styles.ts`.

## Changing images

### Using real photography

Every image is a `CommunityImage` object. Add a `src` and the generated
placeholder is replaced with an optimised `next/image`:

```ts
heroImage: {
  src: "/images/oakwood/hero.jpg",
  alt: "Describe the image for screen readers — this is required.",
},
```

- **Local files:** drop them in `public/images/…` and reference them as
  `/images/…`.
- **Supabase Storage:** upload to the `hoa-engine-media` bucket and use the
  object path (`harborlight/hero.jpg`); it resolves to a public URL
  automatically. See [SUPABASE.md](SUPABASE.md).
- **Other remote hosts:** add the host to `remotePatterns` in `next.config.mjs`.
  `*.supabase.co` is already whitelisted.
- **Only use imagery you have the rights to.** Do not reuse photographs from an
  association's own website.
- `alt` is required on every image, with or without `src`.

### The generated placeholders

With no `src`, a themed SVG scene is drawn — tinted with the active palette, so
it always matches. Pick one with `placeholder`:

`waterfront` · `resort` · `garden` · `skyline` · `village` · `pool` ·
`clubhouse` · `courtyard` · `interior`

Each renders a "Photo placeholder" chip so nobody mistakes it for a real photo.

Scenes are drawn on an 800 × 600 stage and cropped to fit their frame. The
`focus` prop controls how:

- `focus="bottom"` (default) — keeps the ground line. Right for square and tall
  frames.
- `focus="center"` — pads the stage horizontally instead of zooming in. Right for
  wide letterbox frames (16:9 and wider); used by the overlay and stacked heroes
  and the amenity cards.

To add a scene, extend `PlaceholderScene` in `lib/types.ts` and add a `case` to
the `Scene` switch in `components/ui/CommunityImage.tsx`. Draw with the `A()` and
`S()` helpers so the artwork picks up the active theme, and extend any ground
band from `x = -400` to `x = 1200` so it still covers when the stage is padded.

### The Open Graph image

`public/og/hoa-engine-concept.svg` is a placeholder. Replace it with a
1200 × 630 PNG or JPG and update `placeholderOgImage` in `lib/seo.ts` — most
social crawlers ignore SVG.

## What not to change

`lib/brand.ts` holds the sample-design label, the unofficial-concept notice, the
footer disclaimer, and the contact fallback. `lib/seo.ts` and `app/robots.ts`
hold the `noindex` rules. Those exist so a sales concept cannot be mistaken for
an association's official website — leave them in place.
