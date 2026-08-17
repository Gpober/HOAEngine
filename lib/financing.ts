/**
 * Financing partner (mortgage) details for the "Financing at [Community]"
 * module. This is the loan originator's own advertising — never a
 * pay-per-referral arrangement with the association or Condo Seen, which
 * keeps it clean under RESPA § 8.
 *
 * ── BEFORE GOING LIVE ────────────────────────────────────────────────────────
 * `enabled` stays false until the real NMLS details below are filled in, so a
 * placeholder like "[NMLS #____]" can never appear on a public page. Mortgage
 * advertising must carry the originator's and company's NMLS IDs and Equal
 * Housing language — all present below; fill the bracketed values, set
 * `enabled: true`, and it appears on the community "Financing" pages.
 */
export const financing = {
  /** Master switch. Off = the module never renders (cold demos stay clean). */
  enabled: true,

  /** The individual loan originator. */
  officerName: "Gonzalo De Leon",
  officerTitle: "Mortgage Loan Originator",
  officerNmls: "NMLS #1017196",

  /** The licensed company the originator works under. */
  company: "The Rate Outlet",
  companyNmls: "NMLS #2013978",

  /** Contact + application. Leave a value empty and that route is hidden.
   *  phone: found (305) 999-1823 in a directory — confirm before adding, so an
   *  unverified number never appears in mortgage advertising. */
  phone: "" as string,
  email: "" as string,
  applyUrl:
    "https://therateoutlet.com/?utm_source=condoseen&utm_medium=community-site&utm_campaign=financing" as string,

  /** Standard required disclosures. Edit only with the company's approval. */
  disclosure:
    "This is not a commitment to lend or an offer to extend credit. All loans " +
    "are subject to credit approval, income verification, and property " +
    "appraisal. Rates, terms, and programs are subject to change without " +
    "notice. Not affiliated with, sponsored by, or endorsed by the " +
    "association. Equal Housing Lender.",
} as const;

/**
 * The render guard. True only when it's switched on, the required NMLS
 * disclosures are real (no bracketed placeholders), AND there is at least one
 * way to get in touch — so the module can never render as a dead-end card.
 */
export const financingReady =
  financing.enabled &&
  !financing.officerName.includes("[") &&
  !financing.officerNmls.includes("[") &&
  !financing.companyNmls.includes("[") &&
  Boolean(financing.phone || financing.email || financing.applyUrl);
