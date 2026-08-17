/**
 * Public business identity for the marketing site.
 *
 * Kept separate from `lib/brand.ts` on purpose: `brand` holds the disclaimers
 * that must appear on unofficial demo concepts, while this file is the
 * outward-facing company — the part that is meant to be found in search.
 *
 * ── CHANGE THESE BEFORE LAUNCH ───────────────────────────────────────────────
 * `phone` is still a placeholder. Nothing invents a real contact
 * detail: where a value is left empty the marketing page omits that route
 * entirely rather than showing a number nobody answers.
 */
export const site = {
  /** Legal/company name used in metadata and structured data. */
  name: "Condo Seen",

  /** Short tagline used under the wordmark. */
  tagline: "Websites for homeowner and condominium associations",

  /** Canonical origin. Override with NEXT_PUBLIC_SITE_URL if the domain moves. */
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.condoseen.com",

  /**
   * Contact routes. Leave a value as an empty string and the page omits it —
   * an unanswered address is worse than no address.
   */
  // Typed as `string` (not the empty-string literal) so real values can be
  // dropped in without fighting the `as const` narrowing below.
  contactEmail: "gpober@iamcfo.com" as string,
  phone: "" as string,

  /** Service area, stated honestly — the condo dataset spans 48 states. */
  serviceArea: "United States",

  /**
   * Published starting price. The one number stated everywhere — the marketing
   * page, /start, the guide, and print material all read from here, so a price
   * change is a one-line edit.
   */
  priceFrom: "$99 a month",

  /** One-time setup, charged on engagement. The concept itself stays free. */
  setupFee: "$499",
  setupNote: "One-time setup — waived when billed annually.",

  /**
   * The three service tiers. Every feature listed is something the product
   * does today or a service commitment we can keep by hand — nothing
   * aspirational. Caps steer larger communities to the right tier without
   * turning any size away.
   */
  plans: [
    {
      name: "Essentials",
      price: "$99",
      cadence: "per month",
      blurb: "The compliant public website, handled — for communities up to 50 residences.",
      features: [
        "Custom-designed public website for your community",
        "Statute-mapped document center (§ 718.111(12)(g) structure)",
        "Owners-only area for protected records",
        "Meeting notices & agendas posted for you",
        "Hosting, security, SSL, and maintenance included",
        "Content updates posted within 5 business days",
      ],
      highlighted: false,
    },
    {
      name: "Community",
      price: "$199",
      cadence: "per month",
      blurb: "Faster updates and a managed presence — for communities up to 150 residences.",
      features: [
        "Everything in Essentials",
        "Unlimited document & notice updates, posted within 2 business days",
        "News & announcements page managed for you",
        "AI resident concierge answering questions from your site",
        "Photo gallery refreshed with your seasonal photography",
        "Call-scheduling contact forms for the office",
      ],
      highlighted: true,
    },
    {
      name: "Signature",
      price: "$299",
      cadence: "per month",
      blurb: "White-glove service for larger communities — unlimited residences.",
      features: [
        "Everything in Community",
        "Same-day posting for statutory notices",
        "Realtor & lender information page with enquiry routing",
        "Private board area for minutes and working documents",
        "Annual compliance review with a written report for the board",
        "Priority support with a dedicated contact",
      ],
      highlighted: false,
    },
  ],

  /** What the product actually does. Every line here is something that exists. */
  features: [
    {
      title: "A public website residents and buyers can find",
      body: "Community information, amenities, and contact details on one clear page — the things people look for before they call the office.",
    },
    {
      title: "Documents and forms in one place",
      body: "Architectural request forms, rules and regulations, meeting minutes, insurance information, and frequently requested documents.",
    },
    {
      title: "Meeting dates and announcements",
      body: "Board, annual, and committee meetings alongside community notices, so residents stop calling to ask when the next meeting is.",
    },
    {
      title: "Built for phones first",
      body: "Every page is tested from 360px upward. Most residents will open the site on a phone, and boards read it on a tablet.",
    },
    {
      title: "Readable for every resident",
      body: "16px minimum body text, large touch targets, visible keyboard focus, and colour contrast verified against WCAG AA on every design.",
    },
    {
      title: "Links to your existing resident portal",
      body: "The portal you already pay for stays exactly where it is. This sits in front of it for everyone who is not a logged-in owner.",
    },
  ],

  /** The positioning line. Short, and true. */
  positioning: {
    heading: "Your resident portal is built for homeowners. This is built for everyone else.",
    body: "Prospective buyers, real estate agents, lenders, and insurers all need to see that your community exists and is well run. A login screen tells them nothing.",
  },

  /** Honest answers, no invented policies or prices. */
  faqs: [
    {
      q: "Who is this for?",
      a: "Homeowner and condominium associations, and the management companies that serve them — particularly communities with no public website, an outdated one, or nothing online beyond a phone number.",
    },
    {
      q: "Does this replace our resident portal?",
      a: "No. Portals handle payments, work orders, and owner accounts, and they are built for logged-in residents. This is the public-facing side for everyone who cannot log in, and it links straight through to your portal.",
    },
    {
      q: "What do you need from us to start?",
      a: "The association name and location, whatever documents you want published, your meeting schedule, and management contact details. Photographs help but are not required — designs ship with placeholder artwork until you send your own.",
    },
    {
      q: "Can we see what it would look like before deciding?",
      a: "Yes. We build a concept for your community first, with no obligation. Concepts are clearly labelled as unofficial and are not published to search engines.",
    },
    {
      q: "What does it cost?",
      a: "Three plans: Essentials at $99 a month (communities up to 50 residences), Community at $199 (up to 150), and Signature at $299 (unlimited) — each flat, with design, hosting, security, and document publishing included. There is a one-time $499 setup, waived when billed annually, and you see your concept free before committing to anything.",
    },
    {
      q: "Who owns the site and the content?",
      a: "The association does. Documents, photographs, and text supplied by the association remain the association's property.",
    },
  ],
} as const;

/** JSON-LD for the marketing page. Only asserts facts stated above. */
export function organizationJsonLd() {
  const contactPoint =
    site.contactEmail || site.phone
      ? {
          contactPoint: {
            "@type": "ContactPoint",
            contactType: "sales",
            ...(site.contactEmail ? { email: site.contactEmail } : {}),
            ...(site.phone ? { telephone: site.phone } : {}),
          },
        }
      : {};

  return {
    "@context": "https://schema.org",
    "@type": "ProfessionalService",
    name: site.name,
    url: site.url,
    description: site.tagline,
    areaServed: site.serviceArea,
    serviceType: "Website design for homeowner and condominium associations",
    priceRange: `From ${site.priceFrom}`,
    ...contactPoint,
  };
}
