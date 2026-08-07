import type { CSSProperties } from "react";
import type { DesignStyle } from "./types";

export type HeroLayout = "split" | "overlay" | "stacked" | "panel";

/**
 * The sections a demo homepage can carry, below the hero.
 *
 * Order is per design, not global. Palette and type alone were never enough:
 * five sites with identical information architecture read as one template
 * wearing five coats of paint, however different the colours are. What a
 * visitor actually registers is what comes first — a resort community that
 * opens on its amenities is a different site from a self-managed HOA that
 * opens on its documents, even before anyone notices the typeface.
 */
export type SectionKey =
  | "photos"
  | "numbers"
  | "quickLinks"
  | "overview"
  | "announcements"
  | "meetings"
  | "documents"
  | "amenities"
  | "contact"
  | "faq";

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
    heroLayout: "split",
    eyebrow: "serif",
    sectionPadding: "py-16 md:py-24",
    headingTracking: "-0.015em",
    // Waterfront condominium: the place sells itself, so the shared
    // surroundings come before the paperwork.
    sectionOrder: [
      "overview", "photos", "numbers", "amenities", "quickLinks",
      "announcements", "meetings", "documents", "contact", "faq",
    ],
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
    // Resort master association: opens on what there is to do, because that
    // is what its residents chose it for.
    sectionOrder: [
      "photos", "amenities", "numbers", "overview", "announcements",
      "quickLinks", "meetings", "documents", "contact", "faq",
    ],
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
    // Resident-resource forward: forms and documents are the reason people
    // visit a small self-managed HOA's site at all.
    sectionOrder: [
      "photos", "quickLinks", "documents", "announcements", "meetings",
      "overview", "numbers", "amenities", "contact", "faq",
    ],
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
    // Urban building: dense and operational. What is happening and what is
    // filed, first; the tour second.
    sectionOrder: [
      "photos", "numbers", "quickLinks", "meetings", "announcements",
      "documents", "overview", "amenities", "contact", "faq",
    ],
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
    // Built for an audience that would rather telephone than hunt: the office
    // is near the top, and everything below it is in plain order.
    sectionOrder: [
      "photos", "quickLinks", "contact", "numbers", "meetings",
      "announcements", "documents", "overview", "amenities", "faq",
    ],
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
