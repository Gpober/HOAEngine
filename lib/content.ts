import type { Association, FaqItem, QuickLink } from "./types";

/** Anchor ids shared by the nav, quick links, and footer. */
export const sectionIds = {
  overview: "community-information",
  announcements: "announcements",
  meetings: "meetings",
  documents: "documents",
  amenities: "amenities",
  contact: "contact",
  faq: "faq",
  resources: "resident-resources",
} as const;

/** Header navigation. Kept short so it stays scannable on every screen size. */
export const primaryNav = [
  { label: "Community", href: `#${sectionIds.overview}` },
  { label: "Announcements", href: `#${sectionIds.announcements}` },
  { label: "Meetings", href: `#${sectionIds.meetings}` },
  { label: "Documents", href: `#${sectionIds.documents}` },
  { label: "Amenities", href: `#${sectionIds.amenities}` },
  { label: "Contact", href: `#${sectionIds.contact}` },
];

/**
 * Reduced desktop navigation for the enlarged type scale.
 *
 * At that scale six links plus the association name no longer fit on one row,
 * and squeezing them would mean smaller targets — the opposite of what that
 * design style is for. The full list stays in the mobile menu and the footer.
 */
export const compactNav = [
  { label: "Community", href: `#${sectionIds.overview}` },
  { label: "Meetings", href: `#${sectionIds.meetings}` },
  { label: "Documents", href: `#${sectionIds.documents}` },
  { label: "Contact", href: `#${sectionIds.contact}` },
];

/**
 * The seven quick-link cards. `iconKey` is resolved to a Lucide icon in the
 * QuickLinks component so this module stays free of JSX imports.
 */
export const quickLinks: (QuickLink & { iconKey: string })[] = [
  {
    id: "community-information",
    iconKey: "info",
    label: "Community Information",
    description: "Property details, location, and community overview.",
    href: `#${sectionIds.overview}`,
  },
  {
    id: "contact-information",
    iconKey: "phone",
    label: "Contact Information",
    description: "How to reach the association office.",
    href: `#${sectionIds.contact}`,
  },
  {
    id: "management-company",
    iconKey: "briefcase",
    label: "Management Company",
    description: "The company handling day-to-day management.",
    href: `#${sectionIds.contact}`,
  },
  {
    id: "forms",
    iconKey: "clipboard",
    label: "Forms",
    description: "Architectural requests and resident forms.",
    href: `#${sectionIds.documents}`,
  },
  {
    id: "faq",
    iconKey: "help",
    label: "FAQ",
    description: "Answers to the questions residents ask most.",
    href: `#${sectionIds.faq}`,
  },
  {
    id: "meeting-dates",
    iconKey: "calendar",
    label: "Meeting Dates",
    description: "Board, annual, and committee meeting schedule.",
    href: `#${sectionIds.meetings}`,
  },
  {
    id: "resident-resources",
    iconKey: "users",
    label: "Resident Resources",
    description: "Documents, rules, and everyday resident tools.",
    href: `#${sectionIds.documents}`,
  },
];

/**
 * Fallback FAQ set. Answers describe the *general* process an association
 * follows and never assert a specific policy, deadline, or fee.
 */
export const defaultFaqs: FaqItem[] = [
  {
    id: "architectural-request",
    question: "How do I submit an architectural request?",
    answer:
      "Architectural requests are typically submitted on the association's architectural request form and reviewed by the appropriate committee before work begins. On a live site, this section links directly to the current form and lists the review schedule provided by the association.",
  },
  {
    id: "documents",
    question: "Where can I find association documents?",
    answer:
      "Governing documents, rules, and meeting minutes are gathered in the Documents and Forms section. On a live site, each card links to the current file supplied by the association or its management company.",
  },
  {
    id: "board-meetings",
    question: "When are board meetings held?",
    answer:
      "Meeting dates, times, and locations appear in the Upcoming Meetings section. The schedule shown in this concept is sample content — a live site publishes the association's official notices.",
  },
  {
    id: "management",
    question: "How do I contact property management?",
    answer:
      "Management contact details appear in the Management Contact section. Where a detail has not been supplied for this concept, the site shows a placeholder instead of a phone number or email address.",
  },
  {
    id: "maintenance",
    question: "How do I report a maintenance concern?",
    answer:
      "Maintenance concerns generally go to the management company by phone or email, with emergencies handled through a dedicated after-hours line. A live site publishes the exact reporting steps the association uses.",
  },
];

export function faqsFor(association: Association): FaqItem[] {
  return association.faqs?.length ? association.faqs : defaultFaqs;
}

/** "Harborview, FL" — built only from the fields that were supplied. */
export function locationLabel(association: Association): string | undefined {
  const parts = [association.city, association.state].filter(Boolean);
  return parts.length ? parts.join(", ") : undefined;
}

/** Name used in the compact header lockup. */
export function displayNameFor(association: Association): string {
  return association.shortName ?? association.name;
}

/** Two-letter monogram for the header mark. */
export function monogramFor(association: Association): string {
  if (association.monogram) return association.monogram;
  const words = association.name
    .replace(/[^\p{L}\s]/gu, " ")
    .split(/\s+/)
    .filter(Boolean);
  const initials = words.slice(0, 2).map((word) => word[0]!.toUpperCase());
  return initials.join("") || "HA";
}
