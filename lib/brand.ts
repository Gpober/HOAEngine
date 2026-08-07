import { site } from "./site";

/**
 * Every piece of attribution and every disclaimer lives here.
 *
 * These strings are required on every demo page. Do not remove them, and do not
 * weaken the wording — they are what keeps a sales concept from being mistaken
 * for an association's official website. Demos name real associations, so the
 * attribution is not branding, it is the thing that makes the page honest.
 *
 * The attributed name is taken from `site.name` rather than written out again.
 * There is one company, and it should be spelled in one place: when this file
 * held its own copy, the marketing page and the demo disclaimers drifted apart
 * and ended up crediting two different businesses.
 */
export const brand = {
  /** Who the concept is attributed to. Single-sourced from `lib/site.ts`. */
  name: site.name,
  product: "HOA Engine",

  /** Required on every demo — header strip and footer watermark. */
  sampleDesignLabel: `Sample Design by ${site.name}`,

  /** Required on every demo — sits directly with the sample design label. */
  unofficialNotice:
    "Unofficial concept. Not affiliated with or endorsed by the association.",

  /** Long-form footer disclaimer. */
  footerDisclaimer: `This is an unofficial website concept created for demonstration purposes. ${site.name} is not affiliated with or endorsed by this association.`,

  /** Shown wherever a real contact detail has not been supplied. */
  contactFallback: "Contact information available upon official site setup.",

  /** Floating sales badge. */
  badgeLabel: `Website Concept by ${site.name}`,
  modalHeadline: "Need a modern website for your association?",
  modalBody:
    "HOA Engine builds clean, accessible, mobile-friendly websites for homeowner and condominium associations — with resident resources, documents, and meeting information in one place.",

  /**
   * Both routes land on the marketing page's contact section. They used to be
   * bare fragments that matched no element on a demo page, so the two buttons
   * in the sales modal went nowhere at all.
   */
  links: {
    requestDemo: "/#contact",
    contact: "/#contact",
  },
} as const;

/** Sample-content labels used on announcements and meetings. */
export const sampleLabels = {
  announcement: "Demo Announcement",
  meetingNotice: "Sample Meeting Notice",
  maintenance: "Sample Maintenance Update",
  meeting: "Sample Meeting Schedule",
  document: "Sample Document",
} as const;
