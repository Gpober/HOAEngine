import { AlertCircle, Building2, Clock, Mail, MapPin, Phone, ShieldAlert } from "lucide-react";
import { Card, IconWell } from "@/components/ui/Card";
import { Section, SectionHeading } from "@/components/ui/Section";
import { brand } from "@/lib/brand";
import { sectionIds } from "@/lib/content";
import { designStyles } from "@/lib/design-styles";
import type { Association } from "@/lib/types";

/**
 * Management contact block.
 *
 * Nothing here is invented. Any detail the association has not supplied is
 * reported as pending with the standard fallback message rather than filled in
 * with a plausible-looking phone number or address.
 */
export function ManagementContact({ association }: { association: Association }) {
  const design = designStyles[association.designStyle];

  const rows = [
    association.managementCompany && {
      icon: Building2,
      label: "Management company",
      value: association.managementCompany,
    },
    association.phone && {
      icon: Phone,
      label: "Phone",
      value: association.phone,
      href: `tel:${association.phone.replace(/[^\d+]/g, "")}`,
    },
    association.email && {
      icon: Mail,
      label: "Email",
      value: association.email,
      href: `mailto:${association.email}`,
    },
    association.officeHours && {
      icon: Clock,
      label: "Office hours",
      value: association.officeHours,
    },
    association.emergencyContact && {
      icon: ShieldAlert,
      label: "Emergency contact",
      value: association.emergencyContact,
    },
    association.officeAddress && {
      icon: MapPin,
      label: "Office address",
      value: association.officeAddress,
    },
  ].filter(Boolean) as {
    icon: typeof Phone;
    label: string;
    value: string;
    href?: string;
  }[];

  const pending = [
    !association.managementCompany && "management company",
    !association.phone && "phone",
    !association.email && "email",
    !association.officeHours && "office hours",
    !association.emergencyContact && "emergency contact",
  ].filter(Boolean) as string[];

  return (
    <Section
      id={sectionIds.contact}
      tone="surface"
      padding={design.sectionPadding}
      labelledBy="contact-heading"
    >
      <SectionHeading
        id="contact-heading"
        eyebrow="Get in touch"
        eyebrowStyle={design.eyebrow}
        title="Management contact"
        description="Placeholder contact details for this concept. Real details are added when an association sets up its official site."
      />

      <div className="grid gap-6 lg:grid-cols-12">
        <div className="lg:col-span-7">
          {rows.length ? (
            <Card className="divide-y divide-line overflow-hidden">
              <dl>
                {rows.map((row) => {
                  const Icon = row.icon;
                  return (
                    <div
                      key={row.label}
                      className="flex items-start gap-4 border-b border-line p-5 last:border-b-0 sm:p-6"
                    >
                      <IconWell tone="secondary" className="h-11 w-11">
                        <Icon className="h-5 w-5" aria-hidden="true" />
                      </IconWell>
                      <div className="min-w-0">
                        <dt className="text-xs font-semibold uppercase tracking-eyebrow text-ink-muted">
                          {row.label}
                        </dt>
                        <dd className="mt-1 break-words text-base font-semibold text-ink">
                          {row.href ? (
                            <a
                              href={row.href}
                              className="text-accent underline decoration-accent/30 underline-offset-4 hover:decoration-accent"
                            >
                              {row.value}
                            </a>
                          ) : (
                            row.value
                          )}
                        </dd>
                      </div>
                    </div>
                  );
                })}
              </dl>
            </Card>
          ) : (
            <Card className="flex items-start gap-4 p-6">
              <IconWell tone="secondary" className="h-11 w-11">
                <AlertCircle className="h-5 w-5" aria-hidden="true" />
              </IconWell>
              <p className="text-base leading-relaxed text-ink-soft">
                {brand.contactFallback}
              </p>
            </Card>
          )}
        </div>

        <div className="lg:col-span-5">
          <Card className="h-full bg-accent-soft p-6 sm:p-7">
            <h3 className="font-display text-xl font-semibold text-ink">
              About these details
            </h3>
            {pending.length ? (
              <>
                <p className="mt-3 text-base leading-relaxed text-ink-soft">
                  {brand.contactFallback}
                </p>
                <p className="mt-3 text-base leading-relaxed text-ink-soft">
                  Not yet supplied for this concept: {pending.join(", ")}.
                </p>
              </>
            ) : (
              <p className="mt-3 text-base leading-relaxed text-ink-soft">
                The contact details shown are placeholders created for this design
                concept — not the association&apos;s real contact information.
              </p>
            )}
            <p className="mt-4 border-t border-accent/15 pt-4 text-sm leading-relaxed text-ink-muted">
              {brand.footerDisclaimer}
            </p>
          </Card>
        </div>
      </div>
    </Section>
  );
}
