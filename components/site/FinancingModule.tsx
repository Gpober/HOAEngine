import { ArrowUpRight, BadgeCheck, Clock, Home, Mail, PhoneCall } from "lucide-react";
import { Card, IconWell } from "@/components/ui/Card";
import { Section, SectionHeading } from "@/components/ui/Section";
import { designStyles } from "@/lib/design-styles";
import { financing } from "@/lib/financing";
import type { Association } from "@/lib/types";

/**
 * "Financing at [Community]" — consumer-facing mortgage information for a
 * resident or prospective buyer. Distinct from the lender page (which serves
 * loan-officer professionals): this is the originator's own advertising,
 * pointed at the person who wants to buy or refinance a unit here.
 *
 * The community edge: because HOA Daddy already holds this building's
 * warrantability picture, the originator can speak to condo financing —
 * including the non-warrantable cases most lenders decline — with the
 * building already understood.
 *
 * Compliance is built in: the originator's and company's NMLS IDs and the
 * Equal Housing / not-a-commitment disclosure render on every instance. The
 * caller only mounts this when `financingReady` is true, so placeholder text
 * never reaches a live page.
 */

const POINTS = [
  {
    icon: Home,
    title: "Condo lending, done right",
    body: "Condominium loans hinge on the building, not just the borrower. A specialist who already knows this community's picture moves faster and with fewer surprises.",
  },
  {
    icon: BadgeCheck,
    title: "Warrantable or not",
    body: "Many lenders decline non-warrantable buildings outright. There are purchase and refinance programs for both — the key is matching the right one to this community.",
  },
  {
    icon: Clock,
    title: "Built for a quick close",
    body: "Pre-qualification up front and the community's documents already organized means a purchase or refinance can move on a tight timeline.",
  },
];

export function FinancingModule({ association }: { association: Association }) {
  const design = designStyles[association.designStyle];
  const name = association.shortName ?? association.name;

  const contacts = [
    financing.applyUrl && {
      icon: ArrowUpRight,
      label: "Start your application",
      href: financing.applyUrl,
      external: true,
    },
    financing.phone && {
      icon: PhoneCall,
      label: financing.phone,
      href: `tel:${financing.phone.replace(/[^\d+]/g, "")}`,
      external: false,
    },
    financing.email && {
      icon: Mail,
      label: financing.email,
      href: `mailto:${financing.email}`,
      external: false,
    },
  ].filter(Boolean) as { icon: typeof Home; label: string; href: string; external: boolean }[];

  return (
    <Section tone="surface" padding={design.sectionPadding} labelledBy="financing-heading">
      <SectionHeading
        id="financing-heading"
        eyebrow="Financing"
        eyebrowStyle={design.eyebrow}
        title={`Buying or refinancing at ${name}?`}
        description="Talk with a mortgage specialist who understands condominium financing for this community — before you shop rates elsewhere."
      />

      <ul className="grid gap-4 sm:grid-cols-3">
        {POINTS.map((p) => (
          <li key={p.title}>
            <Card className="flex h-full flex-col gap-3 p-6">
              <IconWell>
                <p.icon className="h-6 w-6" aria-hidden="true" />
              </IconWell>
              <h3 className="font-display text-lg font-semibold text-ink">{p.title}</h3>
              <p className="text-base leading-relaxed text-ink-soft">{p.body}</p>
            </Card>
          </li>
        ))}
      </ul>

      <Card className="mt-6 flex flex-col gap-5 p-6 sm:p-8">
        <div className="flex flex-col gap-1">
          <p className="font-display text-xl font-semibold text-ink">
            {financing.officerName}
          </p>
          <p className="text-base text-ink-soft">
            {financing.officerTitle} · {financing.company}
          </p>
        </div>

        {contacts.length ? (
          <div className="flex flex-wrap gap-3">
            {contacts.map((c) => (
              <a
                key={c.label}
                href={c.href}
                {...(c.external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                className="inline-flex min-h-[2.75rem] items-center gap-2 rounded-pill bg-accent px-5 font-semibold text-accent-ink no-underline transition-opacity hover:opacity-90"
              >
                <c.icon className="h-5 w-5" aria-hidden="true" />
                {c.label}
              </a>
            ))}
          </div>
        ) : null}

        {/* Required mortgage-advertising disclosures — present on every render. */}
        <div className="border-t border-line pt-4 text-xs leading-relaxed text-ink-muted">
          <p className="font-semibold text-ink-soft">
            {financing.officerName}, {financing.officerTitle}, {financing.officerNmls} ·{" "}
            {financing.company}, {financing.companyNmls}
          </p>
          <p className="mt-2">{financing.disclosure}</p>
        </div>
      </Card>
    </Section>
  );
}
