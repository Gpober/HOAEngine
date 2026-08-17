import { CalendarDays, FileText, Landmark } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Section, SectionHeading } from "@/components/ui/Section";
import { SampleTag } from "@/components/ui/SampleTag";
import { designStyles } from "@/lib/design-styles";
import type { Association } from "@/lib/types";

/**
 * The statute-shaped document ledger: three columns — corporation documents,
 * budget & financials by year, and meeting notices — the arrangement Florida
 * associations that take § 718.111(12)(g) seriously actually publish. Every
 * row is a clearly sample-labelled placeholder; a live engagement swaps in
 * the association's real files, with owner-protected records behind login.
 *
 * The current year anchors the financial ledger so the concept never shows
 * a stale year.
 */

const YEAR = new Date().getFullYear();

const CORPORATION_DOCS = [
  "Prospectus",
  "Declaration of Condominium",
  "Bylaws",
  "Articles of Incorporation",
  "Rules & Regulations",
  "Inspection & Recertification Report",
  "Insurance Policies",
  "Management Agreement",
  "Executed Contracts & Bids",
];

const MEETING_ROWS = [
  "Annual Meeting — Second Notice",
  "Annual Meeting — First Notice",
  "Board Meeting Agenda",
  "Board Meeting Minutes",
  "Budget Meeting Notice",
  "Committee Meeting Agenda",
];

function LedgerColumn({
  icon: Icon,
  title,
  rows,
}: {
  icon: typeof FileText;
  title: string;
  rows: { label: string; meta: string }[];
}) {
  return (
    <Card className="flex h-full flex-col p-6">
      <div className="flex items-center gap-3 border-b border-line pb-4">
        <Icon className="h-5 w-5 text-accent" aria-hidden="true" />
        <h3 className="font-display text-sm font-semibold uppercase tracking-eyebrow text-ink">
          {title}
        </h3>
      </div>
      <ul className="divide-y divide-line">
        {rows.map((row) => (
          <li key={row.label + row.meta}>
            <a
              href="#"
              className="flex min-h-[2.75rem] items-baseline justify-between gap-4 py-2.5 text-base no-underline"
            >
              <span className="leading-snug text-ink transition-colors hover:text-accent">
                {row.label}
                <span className="sr-only"> — sample entry, no file attached</span>
              </span>
              <span className="shrink-0 text-sm text-ink-muted">{row.meta}</span>
            </a>
          </li>
        ))}
      </ul>
    </Card>
  );
}

export function ComplianceRegistry({ association }: { association: Association }) {
  const design = designStyles[association.designStyle];

  const financialRows = [
    { label: `Adopted Budget ${YEAR}`, meta: "PDF" },
    ...Array.from({ length: 5 }, (_, i) => ({
      label: `Annual Financial Report ${YEAR - 1 - i}`,
      meta: "PDF",
    })),
    { label: "Structural Integrity Reserve Study", meta: "PDF" },
  ];

  return (
    <Section
      tone="alt"
      padding={design.sectionPadding}
      labelledBy="registry-heading"
    >
      <SectionHeading
        id="registry-heading"
        eyebrow="Official records"
        eyebrowStyle={design.eyebrow}
        title="The record, in order"
        description={`Structured to the posting requirements of Section 718.111(12)(g), Florida Statutes. In this concept every entry is sample content; at launch each row holds ${association.shortName ?? association.name}'s current file, with owner-protected records behind resident login.`}
        action={<SampleTag label="Sample entries" />}
      />

      <div className="grid gap-6 lg:grid-cols-3">
        <LedgerColumn
          icon={Landmark}
          title="Corporation Documents"
          rows={CORPORATION_DOCS.map((label) => ({ label, meta: "PDF" }))}
        />
        <LedgerColumn icon={FileText} title="Budget & Financials" rows={financialRows} />
        <LedgerColumn
          icon={CalendarDays}
          title="Meetings"
          rows={MEETING_ROWS.map((label) => ({ label, meta: "Sample date" }))}
        />
      </div>
    </Section>
  );
}
