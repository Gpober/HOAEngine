/**
 * Statutory document categories for onboarding uploads — the record types a
 * Florida association's website is expected to carry under § 718.111(12)(g).
 * One shared list so the board's optional dropdown and the AI classifier
 * speak the same vocabulary.
 */
export interface DocCategory {
  value: string;
  label: string;
  /** Cues the AI classifier uses; also documents what belongs in each bucket. */
  hint: string;
}

export const DOC_CATEGORIES: DocCategory[] = [
  { value: "declaration", label: "Declaration of Condominium", hint: "the recorded declaration establishing the condominium" },
  { value: "bylaws", label: "Bylaws", hint: "the association's bylaws" },
  { value: "articles", label: "Articles of Incorporation", hint: "articles of incorporation of the association" },
  { value: "rules", label: "Rules & Regulations", hint: "community rules, regulations, and architectural standards" },
  { value: "amendments", label: "Amendments", hint: "amendments to the declaration, bylaws, or articles" },
  { value: "budget", label: "Annual Budget", hint: "the adopted annual operating and reserve budget" },
  { value: "financials", label: "Financial Report", hint: "annual financial report or financial statements" },
  { value: "insurance", label: "Insurance Policies", hint: "insurance policies or certificates of coverage" },
  { value: "minutes", label: "Meeting Minutes", hint: "minutes of board, annual, or committee meetings" },
  { value: "notices", label: "Meeting Notices & Agendas", hint: "notices and agendas for upcoming meetings" },
  { value: "contracts", label: "Contracts & Bids", hint: "executed contracts, management agreements, or bids for materials or services" },
  { value: "inspection", label: "Inspection / SIRS", hint: "milestone inspection, structural integrity reserve study, or recertification report" },
  { value: "other", label: "Other document", hint: "any official record that does not fit the categories above" },
];

export const DOC_CATEGORY_VALUES = new Set(DOC_CATEGORIES.map((c) => c.value));
export const labelForCategory = (value: string | null | undefined): string =>
  DOC_CATEGORIES.find((c) => c.value === value)?.label ?? "";
