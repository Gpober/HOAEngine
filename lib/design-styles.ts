import type { CSSProperties } from "react";
import type { DesignStyle } from "./types";

/**
 * The blocks a demo *homepage* can carry, below the hero — and nothing more.
 *
 * The homepage is deliberately short: the opening, the photography, the
 * numbers, a glimpse of what's new, and doors to the rest of the site. About,
 * amenities, documents, the full schedule, FAQ, and contact each live on their
 * own page under the demo's slug. Order is still per design, because what
 * comes first after the hero is the thing a visitor actually registers.
 */
export type SectionKey = "photos" | "numbers" | "highlights" | "explore";

export interface DesignStyleTokens {
  /** Font stack for headings — a CSS value, usually a `next/font` variable. */
  fontDisplay: string;
  /** Font stack for body copy. */
  fontBody: string;
  /** Corner radius for cards and panels. */
  radiusCard: string;
  /** Corner radius for buttons and chips. */
  radiusPill: string;
  /**
   * `large` bumps every text utility up a step for low-vision readers
   * (see the `[data-type-scale="large"]` rules in `app/globals.css`).
   */
  typeScale: "regular" | "large";
  /** Eyebrow treatment above section headings. */
  eyebrow: "caps" | "serif";
  /** Extra vertical rhythm between sections. */
  sectionPadding: string;
  /** Heading tracking. */
  headingTracking: string;
  /** What follows the hero, in order. Every key appears exactly once. */
  sectionOrder: SectionKey[];
}

export const designStyles: Record<DesignStyle, DesignStyleTokens> = {
  "coastal-classic": {
    fontDisplay: "var(--font-fraunces), Georgia, 'Times New Roman', serif",
    fontBody: "var(--font-inter), system-ui, -apple-system, sans-serif",
    radiusCard: "1rem",
    radiusPill: "999px",
    typeScale: "regular",
    eyebrow: "serif",
    sectionPadding: "py-16 md:py-24",
    headingTracking: "-0.015em",
    // Waterfront condominium: the place sells itself — photography first,
    // then the numbers, and the practical pages last.
    sectionOrder: ["photos", "numbers", "highlights", "explore"],
  },
  "modern-resort": {
    fontDisplay: "var(--font-manrope), system-ui, sans-serif",
    fontBody: "var(--font-inter), system-ui, -apple-system, sans-serif",
    radiusCard: "1.5rem",
    radiusPill: "999px",
    typeScale: "regular",
    eyebrow: "caps",
    sectionPadding: "py-16 md:py-28",
    headingTracking: "-0.02em",
    // Resort master association: pure showpiece — the tour runs long before
    // anything practical appears.
    sectionOrder: ["photos", "highlights", "numbers", "explore"],
  },
  "friendly-community": {
    fontDisplay: "var(--font-nunito), system-ui, sans-serif",
    fontBody: "var(--font-inter), system-ui, -apple-system, sans-serif",
    radiusCard: "1.75rem",
    radiusPill: "999px",
    typeScale: "regular",
    eyebrow: "caps",
    sectionPadding: "py-16 md:py-24",
    headingTracking: "-0.01em",
    // Resident-resource forward: the doors to the practical pages come first,
    // because that is why people visit a self-managed HOA's site at all.
    sectionOrder: ["explore", "highlights", "photos", "numbers"],
  },
  "urban-condominium": {
    fontDisplay: "var(--font-inter), system-ui, -apple-system, sans-serif",
    fontBody: "var(--font-inter), system-ui, -apple-system, sans-serif",
    radiusCard: "0.625rem",
    radiusPill: "0.5rem",
    typeScale: "regular",
    eyebrow: "caps",
    sectionPadding: "py-14 md:py-20",
    headingTracking: "-0.025em",
    // Urban building: dense and operational — what's happening first, the
    // tour second.
    sectionOrder: ["numbers", "highlights", "photos", "explore"],
  },
  "active-adult": {
    fontDisplay: "var(--font-fraunces), Georgia, 'Times New Roman', serif",
    fontBody: "var(--font-inter), system-ui, -apple-system, sans-serif",
    radiusCard: "1.25rem",
    radiusPill: "999px",
    // Larger base type + roomier touch targets for an older resident audience.
    typeScale: "large",
    eyebrow: "serif",
    sectionPadding: "py-16 md:py-24",
    headingTracking: "-0.01em",
    // Built for an audience that would rather not hunt: what's coming up and
    // the doors to every page sit right under the hero.
    sectionOrder: ["highlights", "explore", "photos", "numbers"],
  },
};

/**
 * Portfolio-facing summary of what makes each style different.
 *
 * Every concept now opens the same way — full-bleed photograph, split
 * navigation, thin letterspaced wordmark — so what distinguishes them is the
 * palette, the typeface, and what the page leads with once you scroll.
 */
export const designStyleNotes: Record<DesignStyle, string> = {
  "coastal-classic": "Elegant serif headings, waterfront character, place before paperwork.",
  "modern-resort": "Wide letter-spacing, luxury spacing, amenities up front.",
  "friendly-community": "Soft rounded cards, resident-resource forward, warm tone.",
  "urban-condominium": "Tighter radii, crisp city aesthetic, operations first.",
  "active-adult": "Enlarged type scale, office up top, extra-accessible navigation.",
};

export function designStyleVars(style: DesignStyle): CSSProperties {
  const tokens = designStyles[style];
  return {
    "--hoa-font-display": tokens.fontDisplay,
    "--hoa-font-body": tokens.fontBody,
    "--hoa-radius-card": tokens.radiusCard,
    "--hoa-radius-pill": tokens.radiusPill,
    "--hoa-heading-tracking": tokens.headingTracking,
  } as CSSProperties;
}
