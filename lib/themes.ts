import type { CSSProperties } from "react";
import type { AccentTheme } from "./types";

/**
 * Colour palettes.
 *
 * Values are `R G B` triplets so Tailwind can apply opacity modifiers
 * (`bg-accent/10`). Each palette was picked for warm, residential, upscale
 * character — and checked so that body text clears WCAG AA (4.5:1) on the
 * surface it sits on, and `accent-ink` clears AA on `accent`.
 */
export interface ThemeTokens {
  /** Page background. */
  surface: string;
  /** Alternating band background. */
  "surface-alt": string;
  /** Card / panel background. */
  card: string;
  /** Primary body + heading text. */
  ink: string;
  /** Secondary text. */
  "ink-soft": string;
  /** Tertiary / caption text. Still AA on `surface`. */
  "ink-muted": string;
  /** Primary brand colour (deep navy, forest, teal, burgundy...). */
  accent: string;
  /** Hover / pressed state for accent surfaces. */
  "accent-strong": string;
  /** Very light accent tint for chips and icon wells. */
  "accent-soft": string;
  /** Text colour that sits on top of `accent`. */
  "accent-ink": string;
  /** Warm supporting colour (sand, beige, gold, slate, navy). */
  secondary: string;
  "secondary-soft": string;
  /** Text colour that sits on top of `secondary-soft`. */
  "secondary-ink": string;
  /** Hairline borders. */
  line: string;
  /** Base colour used for the soft shadow stack. */
  shadow: string;
}

export const themes: Record<AccentTheme, ThemeTokens> = {
  /* Demo 1 — soft blue, navy, white, sand. */
  coastal: {
    surface: "247 249 251",
    "surface-alt": "234 241 247",
    card: "255 255 255",
    ink: "18 35 58",
    "ink-soft": "51 70 94",
    "ink-muted": "87 104 125",
    accent: "20 57 94",
    "accent-strong": "13 39 64",
    "accent-soft": "220 233 244",
    "accent-ink": "255 255 255",
    secondary: "185 143 85",
    "secondary-soft": "244 233 216",
    "secondary-ink": "92 67 24",
    line: "217 226 236",
    shadow: "15 42 69",
  },

  /* Demo 2 — white, charcoal, muted teal, warm beige. */
  resort: {
    surface: "251 250 247",
    "surface-alt": "241 238 232",
    card: "255 255 255",
    ink: "30 36 34",
    "ink-soft": "61 70 67",
    "ink-muted": "98 107 103",
    accent: "31 78 74",
    "accent-strong": "22 59 56",
    "accent-soft": "223 237 234",
    "accent-ink": "255 255 255",
    secondary: "168 138 95",
    "secondary-soft": "240 231 218",
    "secondary-ink": "85 69 47",
    line: "227 222 213",
    shadow: "42 39 35",
  },

  /* Demo 3 — sage green, cream, muted gold. */
  sage: {
    surface: "250 249 243",
    "surface-alt": "239 240 229",
    card: "255 255 255",
    ink: "33 38 29",
    "ink-soft": "64 73 57",
    "ink-muted": "98 107 88",
    accent: "58 85 64",
    "accent-strong": "43 64 48",
    "accent-soft": "227 237 226",
    "accent-ink": "255 255 255",
    secondary: "176 140 58",
    "secondary-soft": "245 235 211",
    "secondary-ink": "90 68 19",
    line: "225 226 210",
    shadow: "44 51 39",
  },

  /* Demo 4 — slate, white, deep navy, light gray. */
  urban: {
    surface: "246 247 249",
    "surface-alt": "235 238 243",
    card: "255 255 255",
    ink: "19 26 36",
    "ink-soft": "50 60 74",
    "ink-muted": "86 97 111",
    accent: "22 36 60",
    "accent-strong": "13 23 40",
    "accent-soft": "225 231 240",
    "accent-ink": "255 255 255",
    secondary: "78 96 118",
    "secondary-soft": "231 236 242",
    "secondary-ink": "43 58 75",
    line: "220 225 233",
    shadow: "16 24 39",
  },

  /* Demo 5 — warm cream, burgundy, navy, soft green. */
  heritage: {
    surface: "251 248 243",
    "surface-alt": "237 240 229",
    card: "255 255 255",
    ink: "36 28 26",
    "ink-soft": "69 55 57",
    "ink-muted": "102 86 87",
    accent: "110 34 48",
    "accent-strong": "86 23 31",
    "accent-soft": "244 227 228",
    "accent-ink": "255 255 255",
    secondary: "36 57 94",
    "secondary-soft": "228 233 241",
    "secondary-ink": "28 44 73",
    line: "229 220 206",
    shadow: "58 42 34",
  },
};

/** Human-readable palette names for the portfolio page. */
export const themeLabels: Record<AccentTheme, string> = {
  coastal: "Navy · Coastal Blue · Sand",
  resort: "Charcoal · Muted Teal · Warm Beige",
  sage: "Sage Green · Cream · Muted Gold",
  urban: "Deep Navy · Slate · Light Gray",
  heritage: "Burgundy · Navy · Warm Cream",
};

/** Turns a palette into the inline custom properties consumed by Tailwind. */
export function themeStyle(theme: AccentTheme): CSSProperties {
  const tokens = themes[theme];
  const style: Record<string, string> = {};
  for (const [name, value] of Object.entries(tokens)) {
    style[`--hoa-${name}`] = value;
  }
  return style as CSSProperties;
}
