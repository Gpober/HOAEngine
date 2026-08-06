/**
 * Every piece of HOA Daddy attribution and every disclaimer lives here.
 *
 * These strings are required on every demo page. Do not remove them, and do not
 * weaken the wording — they are what keeps a sales concept from being mistaken
 * for an association's official website.
 */
export const brand = {
  name: "HOA Daddy",
  product: "HOA Engine",

  /** Required on every demo — header strip and footer watermark. */
  sampleDesignLabel: "Sample Design by HOA Daddy",

  /** Required on every demo — sits directly with the sample design label. */
  unofficialNotice:
    "Unofficial concept. Not affiliated with or endorsed by the association.",

  /** Long-form footer disclaimer. */
  footerDisclaimer:
    "This is an unofficial website concept created for demonstration purposes. HOA Daddy is not affiliated with or endorsed by this association.",

  /** Shown wherever a real contact detail has not been supplied. */
  contactFallback: "Contact information available upon official site setup.",

  /** Floating sales badge. */
  badgeLabel: "Website Concept by HOA Daddy",
  modalHeadline: "Need a modern website for your association?",
  modalBody:
    "HOA Engine builds clean, accessible, mobile-friendly websites for homeowner and condominium associations — with resident resources, documents, and meeting information in one place.",

  /** Placeholder destinations. Replace before sharing with a prospect. */
  links: {
    requestDemo: "#request-a-custom-demo",
    contact: "#contact-hoa-daddy",
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
