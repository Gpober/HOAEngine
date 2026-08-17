import { ArrowUpRight, BadgeCheck, FileCheck2, FileText, PhoneCall } from "lucide-react";
import Link from "next/link";
import { Card, IconWell } from "@/components/ui/Card";
import { Section, SectionHeading } from "@/components/ui/Section";
import { designStyles } from "@/lib/design-styles";
import type { Association } from "@/lib/types";

/**
 * The lender & agent page: written for the loan officer, processor, agent, or
 * title company working a purchase or refinance in this community.
 *
 * Deliberately pro-association. The questionnaire and estoppel are the
 * association's own paid services (issued through management on the statutory
 * timeline) — this page's job is to route the professional to the office that
 * provides them, and to the community's public documents, so a loan file
 * moves faster without diverting the association's records income anywhere.
 */
export function LenderInfo({ association }: { association: Association }) {
  const design = designStyles[association.designStyle];
  const base = `/demo/${association.slug}`;

  const items = [
    {
      icon: FileCheck2,
      title: "Condo questionnaire",
      body: "Order the completed condominium questionnaire directly from the association's management office — the fastest route to a signed, current copy for your loan file.",
      href: `${base}/contact`,
      cta: "Request from management",
    },
    {
      icon: BadgeCheck,
      title: "Estoppel certificate",
      body: "Estoppel certificates are issued by the association through management within the timeline set by Florida law. Request yours from the office.",
      href: `${base}/contact`,
      cta: "Request an estoppel",
    },
    {
      icon: FileText,
      title: "Governing documents",
      body: "Declaration, bylaws, rules, budget, and insurance summaries the association publishes are organised and current in the Document Center.",
      href: `${base}/documents`,
      cta: "Open Documents & Forms",
    },
    {
      icon: PhoneCall,
      title: "Management contact",
      body: "For anything the documents don't answer — a status letter, a specific policy, a rush request — the office and management company are one page away.",
      href: `${base}/contact`,
      cta: "Contact management",
    },
  ];

  return (
    <Section tone="alt" padding={design.sectionPadding} labelledBy="lenders-heading">
      <SectionHeading
        id="lenders-heading"
        eyebrow="For lenders & agents"
        eyebrowStyle={design.eyebrow}
        title="What a loan file needs, without the phone tag"
        description="Lenders, processors, agents, and title companies working a purchase or refinance in this community — start here. Official documents come straight from the association's office."
      />

      <ul className="grid gap-4 sm:grid-cols-2">
        {items.map((item) => {
          const Icon = item.icon;
          return (
            <li key={item.title}>
              <Card interactive className="group relative h-full p-6">
                <IconWell>
                  <Icon className="h-6 w-6" aria-hidden="true" />
                </IconWell>
                <h3 className="mt-4 font-display text-xl font-semibold text-ink">
                  <Link
                    href={item.href}
                    className="no-underline after:absolute after:inset-0 after:content-['']"
                  >
                    {item.title}
                  </Link>
                </h3>
                <p className="mt-2 text-base leading-relaxed text-ink-soft">{item.body}</p>
                <p className="mt-3 text-sm font-semibold text-accent">{item.cta}</p>
                <ArrowUpRight
                  aria-hidden="true"
                  className="absolute right-5 top-6 h-5 w-5 text-ink-muted transition-transform duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-accent"
                />
              </Card>
            </li>
          );
        })}
      </ul>

      <p className="mx-auto mt-8 max-w-prose text-center text-sm leading-relaxed text-ink-muted">
        Questionnaires and estoppel certificates are issued by the association
        through its management company; fees and timelines are set by the
        association under Florida law.
      </p>
    </Section>
  );
}
