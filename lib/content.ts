import type { Association, FaqItem } from "./types";

/** Section ids, kept for in-page landmarks on the sub-pages. */
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

/**
 * The demo sites are multi-page. The homepage carries only the showpiece —
 * opening, photography, numbers, a preview of what's new — and everything
 * practical lives on its own page under the demo's slug. These five pages are
 * the whole information architecture; the nav, the footer, and the explore
 * cards on the homepage are all derived from this one list.
 */
export interface DemoNavItem {
  /** Route segment under `/demo/[slug]/`. */
  segment: string;
  label: string;
  /** One line for the homepage explore card. */
  description: string;
  href: string;
}

export function demoPages(slug: string): DemoNavItem[] {
  const base = `/demo/${slug}`;
  return [
    {
      segment: "community",
      label: "Community",
      description: "Property details, location, and the story of the community.",
      href: `${base}/community`,
    },
    {
      segment: "amenities",
      label: "Amenities",
      description: "The pool, the clubhouse, the grounds — everything shared.",
      href: `${base}/amenities`,
    },
    {
      segment: "news",
      label: "News & Meetings",
      description: "Announcements and the full board meeting schedule.",
      href: `${base}/news`,
    },
    {
      segment: "documents",
      label: "Documents",
      description: "Governing documents, forms, and resident resources.",
      href: `${base}/documents`,
    },
    {
      segment: "contact",
      label: "Contact",
      description: "Reach the office, the management company, and the FAQ.",
      href: `${base}/contact`,
    },
    /*
     * Kept last on purpose: the split nav's left/right picks use fixed
     * indexes 0/1/3/4 and the corner nav shows the first five, so appending
     * here changes no existing navigation. Lenders mostly arrive by search
     * or direct link; the menu, footer, and explore cards carry this page.
     */
    {
      segment: "lenders",
      label: "For Lenders",
      description: "Questionnaires, budgets, and insurance — what financing needs.",
      href: `${base}/lenders`,
    },
  ];
}

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
