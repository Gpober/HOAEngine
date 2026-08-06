import { sampleLabels } from "@/lib/brand";
import type { Association } from "@/lib/types";

/* -------------------------------------------------------------------------- *
 *  REUSABLE ASSOCIATION CONFIGURATION TEMPLATE
 *
 *  Copy this file, rename it, fill in what you actually know, and DELETE every
 *  field you do not have a source for. The site renders only what is present —
 *  a missing phone number or founding year drops out of the layout cleanly.
 *
 *  Rules that are not negotiable:
 *    1. Never invent a fact. No guessed unit counts, founding years, fees,
 *       policies, board members, or contact details.
 *    2. Never copy text, photographs, seals, or logos from an association's
 *       existing website or documents.
 *    3. Sample content stays labelled as sample content.
 *    4. The "Sample Design by HOA Daddy" label, the unofficial-concept notice,
 *       and the `noindex` metadata stay in place.
 *
 *  Then register the record in `data/associations.ts`:
 *
 *      import { myAssociation } from "./my-association";
 *      export const associations: Association[] = [ ...existing, myAssociation ];
 *
 *  See `docs/REPLACING-DATA.md` for the full walkthrough.
 * -------------------------------------------------------------------------- */

export const associationTemplate: Association = {
  /* ---- identity (required) --------------------------------------------- */

  /** URL segment. The demo lives at /demo/<slug>. Lowercase, hyphenated. */
  slug: "association-slug",

  /** Full legal name. Used for the hero heading, the footer, and metadata. */
  name: "Association Full Legal Name",

  /** Optional short name for the header lockup. Omit to use `name`. */
  shortName: "Short Name",

  /** Optional two-letter monogram. Omit to derive initials from `name`. */
  monogram: "AN",

  /**
   * One or two sentences describing the community in neutral terms. Write this
   * yourself — do not paste an association's own "About us" copy.
   */
  shortDescription:
    "A short, neutral description of the community written for this concept.",

  /* ---- community facts (all optional — omit anything unverified) -------- */

  city: "City",
  state: "ST",
  communityType: "Condominium Association",
  residenceCount: 0,
  establishedYear: 2000,

  /* ---- management contact (all optional) -------------------------------- */
  /* Anything omitted renders as:                                            */
  /*   "Contact information available upon official site setup."             */

  managementCompany: "Management Company Name",
  phone: "(555) 010-0000",
  email: "office@example.com",
  officeHours: "Monday – Friday, 9:00 AM – 5:00 PM",
  emergencyContact: "(555) 010-0001 — after-hours line",
  officeAddress: "Street address, suite",

  /* ---- imagery ---------------------------------------------------------- */
  /*  Omit `src` to render a generated placeholder scene. Add `src` (a path    */
  /*  under /public or a whitelisted remote URL) once you have licensed        */
  /*  photography. `alt` is always required.                                   */

  heroImage: {
    alt: "Describe the image for screen readers.",
    placeholder: "village", // waterfront | resort | garden | skyline | village
    //                          | pool | clubhouse | courtyard | interior
    // src: "/images/association/hero.jpg",
  },
  galleryImages: [
    {
      alt: "Describe the image for screen readers.",
      placeholder: "clubhouse",
      caption: "Optional caption",
    },
  ],

  /* ---- amenities -------------------------------------------------------- */
  /*  Only list amenities you can confirm. Valid keys live in                 */
  /*  `lib/amenities.ts`: pool, clubhouse, fitness, parking, security,        */
  /*  waterfront, tennis, pickleball, dock, grounds, elevator, petArea,       */
  /*  evCharging, guestSuites, eventLawn.                                     */

  amenities: ["clubhouse", "pool", "grounds"],

  /* ---- announcements ---------------------------------------------------- */
  /*  Keep `sampleLabel` on every card until the association supplies real     */
  /*  notices. Use `dateLabel: "Sample date"` rather than a plausible date.   */

  announcements: [
    {
      id: "tpl-a1",
      kind: "general",
      sampleLabel: sampleLabels.announcement,
      title: "Sample announcement headline",
      dateLabel: "Sample date",
      body: "Illustrative announcement text showing how community news would appear.",
    },
    {
      id: "tpl-a2",
      kind: "meeting",
      sampleLabel: sampleLabels.meetingNotice,
      title: "Sample meeting notice",
      dateLabel: "Sample date",
      body: "Illustrative notice showing how meeting announcements would appear.",
    },
    {
      id: "tpl-a3",
      kind: "maintenance",
      sampleLabel: sampleLabels.maintenance,
      title: "Sample maintenance update",
      dateLabel: "Sample date",
      body: "Illustrative update showing how maintenance notices would appear.",
    },
  ],

  /* ---- meetings --------------------------------------------------------- */

  meetings: [
    {
      id: "tpl-m1",
      kind: "board",
      title: "Board of Directors Meeting",
      dateLabel: "Sample date",
      timeLabel: "6:00 PM",
      locationLabel: "Location",
      note: "Optional note.",
    },
    {
      id: "tpl-m2",
      kind: "annual",
      title: "Annual Meeting",
      dateLabel: "Sample date",
      timeLabel: "6:00 PM",
      locationLabel: "Location",
    },
    {
      id: "tpl-m3",
      kind: "committee",
      title: "Committee Meeting",
      dateLabel: "Sample date",
      timeLabel: "6:00 PM",
      locationLabel: "Location",
    },
  ],

  /* ---- documents -------------------------------------------------------- */
  /*  `href: "#"` keeps the demo visual-only. Replace with real file URLs     */
  /*  once the association provides documents it wants published.             */

  documents: [
    {
      id: "tpl-d1",
      title: "Architectural Request Form",
      description: "Submit exterior changes for committee review before work begins.",
      fileType: "PDF",
      href: "#",
    },
    {
      id: "tpl-d2",
      title: "Rules and Regulations",
      description: "Community standards covering shared areas and residences.",
      fileType: "PDF",
      href: "#",
    },
    {
      id: "tpl-d3",
      title: "Meeting Minutes",
      description: "Approved minutes from recent association meetings.",
      fileType: "PDF",
      href: "#",
    },
    {
      id: "tpl-d4",
      title: "Resident Information Form",
      description: "Keep contact, vehicle, and emergency details current.",
      fileType: "PDF",
      href: "#",
    },
    {
      id: "tpl-d5",
      title: "Insurance Information",
      description: "Coverage summary and certificate request instructions.",
      fileType: "PDF",
      href: "#",
    },
    {
      id: "tpl-d6",
      title: "Frequently Requested Documents",
      description: "Governing documents, budgets, and disclosure packets.",
      fileType: "ZIP",
      href: "#",
    },
  ],

  /* ---- FAQ (optional) --------------------------------------------------- */
  /*  Omit `faqs` entirely to use the shared sample set in `lib/content.ts`.  */
  /*  Only add answers here that the association has actually confirmed.      */

  // faqs: [{ id: "q1", question: "…", answer: "…" }],

  /* ---- presentation ----------------------------------------------------- */

  /** coastal | resort | sage | urban | heritage  (see lib/themes.ts) */
  accentTheme: "coastal",

  /**
   * coastal-classic | modern-resort | friendly-community
   * | urban-condominium | active-adult          (see lib/design-styles.ts)
   */
  designStyle: "coastal-classic",

  /** Shown on the portfolio card at /demo. */
  designName: "Coastal Classic",
  designTagline: "One-line description of this concept for the portfolio grid.",
};
