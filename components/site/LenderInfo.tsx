import { ArrowUpRight, FileCheck2, FileText, PhoneCall, ShieldCheck } from "lucide-react";
import Link from "next/link";
import { Card, IconWell } from "@/components/ui/Card";
import { Section, SectionHeading } from "@/components/ui/Section";
import { designStyles } from "@/lib/design-styles";
import type { Association } from "@/lib/types";

/**
 * The lender page: written for the loan officer, processor, or underwriter
 * who found the community while working a purchase or refinance.
 *
 * Deliberately a pointer, not a data dump. Questionnaire answers, budget
 * detail, and warrantability are HOA Daddy's paid product — this page's job
 * is to route the professional there (with attribution), and to the
 * community's own documents and office for everything public.
 */
const HOA_DADDY_URL =
  "https://hoadaddy.com/?utm_source=condoseen&utm_medium=referral&utm_campaign=lender-page";

export function LenderInfo({ association }: { association: Association }) {
  const design = designStyles[association.designStyle];
  const base = `/demo/${association.slug}`;

  const items = [
    {
      icon: FileCheck2,
      title: "Condo questionnaire",
      body: "Completed questionnaires for thousands of condominium projects are available instantly through HOA Daddy — check availability for this community instead of ordering fresh and waiting weeks.",
      href: HOA_DADDY_URL,
      external: true,
      cta: "Check availability on HOA Daddy",
    },
    {
      icon: ShieldCheck,
      title: "Budget & insurance",
      body: "Current budget and insurance information travels with the questionnaire. Where the association has published summaries publicly, they appear under Documents.",
      href: HOA_DADDY_URL,
      external: true,
      cta: "Request through HOA Daddy",
    },
    {
      icon: FileText,
      title: "Governing documents",
      body: "Declaration, bylaws, and rules — the publicly available documents live on this site, organised and current.",
      href: `${base}/documents`,
      external: false,
      cta: "Open Documents & Forms",
    },
    {
      icon: PhoneCall,
      title: "Management contact",
      body: "For anything the documents and questionnaire don't answer, the office and management company are one page away.",
      href: `${base}/contact`,
      external: false,
      cta: "Contact management",
    },
  ];

  return (
    <Section tone="alt" padding={design.sectionPadding} labelledBy="lenders-heading">
      <SectionHeading
        id="lenders-heading"
        eyebrow="For financing professionals"
        eyebrowStyle={design.eyebrow}
        title="What a loan file needs, without the phone tag"
        description="Lenders, processors, and agents working a purchase or refinance in this community — start here."
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
                  {item.external ? (
                    <a
                      href={item.href}
                      rel="noopener"
                      className="no-underline after:absolute after:inset-0 after:content-['']"
                    >
                      {item.title}
                    </a>
                  ) : (
                    <Link
                      href={item.href}
                      className="no-underline after:absolute after:inset-0 after:content-['']"
                    >
                      {item.title}
                    </Link>
                  )}
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
        Questionnaire and data services are provided by HOA Daddy. Availability
        varies by association; this concept page illustrates the layout.
      </p>
    </Section>
  );
}
