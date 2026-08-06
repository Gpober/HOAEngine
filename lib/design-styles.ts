import type { CSSProperties } from "react";
import type { DesignStyle } from "./types";

export type HeroLayout = "split" | "overlay" | "stacked" | "panel";

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
  heroLayout: HeroLayout;
  /** Flips the split hero so the image leads. */
  heroFlip?: boolean;
  /** Eyebrow treatment above section headings. */
  eyebrow: "caps" | "serif";
  /** Extra vertical rhythm between sections. */
  sectionPadding: string;
  /** Heading tracking. */
  headingTracking: string;
}

export const designStyles: Record<DesignStyle, DesignStyleTokens> = {
  "coastal-classic": {
    fontDisplay: "var(--font-fraunces), Georgia, 'Times New Roman', serif",
    fontBody: "var(--font-inter), system-ui, -apple-system, sans-serif",
    radiusCard: "1rem",
    radiusPill: "999px",
    typeScale: "regular",
    heroLayout: "split",
    eyebrow: "serif",
    sectionPadding: "py-16 md:py-24",
    headingTracking: "-0.015em",
  },
  "modern-resort": {
    fontDisplay: "var(--font-manrope), system-ui, sans-serif",
    fontBody: "var(--font-inter), system-ui, -apple-system, sans-serif",
    radiusCard: "1.5rem",
    radiusPill: "999px",
    typeScale: "regular",
    heroLayout: "overlay",
    eyebrow: "caps",
    sectionPadding: "py-16 md:py-28",
    headingTracking: "-0.02em",
  },
  "friendly-community": {
    fontDisplay: "var(--font-nunito), system-ui, sans-serif",
    fontBody: "var(--font-inter), system-ui, -apple-system, sans-serif",
    radiusCard: "1.75rem",
    radiusPill: "999px",
    typeScale: "regular",
    heroLayout: "split",
    heroFlip: true,
    eyebrow: "caps",
    sectionPadding: "py-16 md:py-24",
    headingTracking: "-0.01em",
  },
  "urban-condominium": {
    fontDisplay: "var(--font-inter), system-ui, -apple-system, sans-serif",
    fontBody: "var(--font-inter), system-ui, -apple-system, sans-serif",
    radiusCard: "0.625rem",
    radiusPill: "0.5rem",
    typeScale: "regular",
    heroLayout: "panel",
    eyebrow: "caps",
    sectionPadding: "py-14 md:py-20",
    headingTracking: "-0.025em",
  },
  "active-adult": {
    fontDisplay: "var(--font-fraunces), Georgia, 'Times New Roman', serif",
    fontBody: "var(--font-inter), system-ui, -apple-system, sans-serif",
    radiusCard: "1.25rem",
    radiusPill: "999px",
    // Larger base type + roomier touch targets for an older resident audience.
    typeScale: "large",
    heroLayout: "stacked",
    eyebrow: "serif",
    sectionPadding: "py-16 md:py-24",
    headingTracking: "-0.01em",
  },
};

/** Portfolio-facing summary of what makes each style different. */
export const designStyleNotes: Record<DesignStyle, string> = {
  "coastal-classic": "Elegant serif headings, split hero, waterfront character.",
  "modern-resort": "Full-bleed overlay hero, wide letter-spacing, luxury spacing.",
  "friendly-community": "Soft rounded cards, resident-resource forward, warm tone.",
  "urban-condominium": "Structured grid hero, tighter radii, crisp city aesthetic.",
  "active-adult": "Centred hero, enlarged type scale, extra-accessible navigation.",
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
