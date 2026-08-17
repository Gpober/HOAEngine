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
  enabled: false,

  /** The individual loan originator. */
  officerName: "[Loan Officer Name]",
  officerTitle: "Mortgage Loan Originator",
  officerNmls: "[NMLS #______]",

  /** The licensed company the originator works under. */
  company: "The Rate Outlet",
  companyNmls: "[Company NMLS #______]",

  /** Contact + application. Leave a value empty and that route is hidden. */
  phone: "" as string,
  email: "" as string,
  applyUrl: "" as string, // secure online application link

  /** Standard required disclosures. Edit only with the company's approval. */
  disclosure:
    "This is not a commitment to lend or an offer to extend credit. All loans " +
    "are subject to credit approval, income verification, and property " +
    "appraisal. Rates, terms, and programs are subject to change without " +
    "notice. Not affiliated with, sponsored by, or endorsed by the " +
    "association. Equal Housing Lender.",
} as const;

/** True only when the real details are in — the render guard. */
export const financingReady =
  financing.enabled &&
  !financing.officerName.includes("[") &&
  !financing.officerNmls.includes("[") &&
  !financing.companyNmls.includes("[");
