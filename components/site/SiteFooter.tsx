import { Mail, Phone } from "lucide-react";
import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { brand } from "@/lib/brand";
import { demoPages, locationLabel, monogramFor } from "@/lib/content";
import type { Association } from "@/lib/types";

export function SiteFooter({ association }: { association: Association }) {
  const location = locationLabel(association);
  const monogram = monogramFor(association);
  const hasContact = Boolean(association.phone || association.email);

  return (
    <footer className="on-accent bg-accent text-accent-ink">
      <Container className="py-14 md:py-16">
        <div className="grid gap-10 lg:grid-cols-12">
          {/* Association identity ------------------------------------------ */}
          <div className="lg:col-span-5">
            <div className="flex items-center gap-3">
              <span
                aria-hidden="true"
                className="flex h-12 w-12 items-center justify-center rounded-pill border border-accent-ink/25 bg-accent-ink/10 font-display text-lg font-semibold"
              >
                {monogram}
              </span>
              <div>
                <p className="font-display text-xl font-semibold leading-tight">
                  {association.name}
                </p>
                {location ? (
                  <p className="text-sm text-accent-ink/75">{location}</p>
                ) : null}
              </div>
            </div>
            <p className="mt-5 max-w-prose text-base leading-relaxed text-accent-ink/85">
              {association.shortDescription}
            </p>
          </div>

          {/* Navigation ---------------------------------------------------- */}
          <div className="lg:col-span-3">
            <h2 className="text-xs font-semibold uppercase tracking-eyebrow text-accent-ink/70">
              Navigation
            </h2>
            <ul className="mt-4 flex flex-col gap-1">
              {[
                { label: "Home", href: `/demo/${association.slug}` },
                ...demoPages(association.slug),
              ].map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="inline-flex min-h-[2.5rem] items-center text-base text-accent-ink/90 no-underline hover:text-accent-ink hover:underline"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact ------------------------------------------------------- */}
          <div className="lg:col-span-4">
            <h2 className="text-xs font-semibold uppercase tracking-eyebrow text-accent-ink/70">
              Contact
            </h2>
            {hasContact ? (
              <ul className="mt-4 flex flex-col gap-2 text-base text-accent-ink/90">
                {association.managementCompany ? (
                  <li>{association.managementCompany}</li>
                ) : null}
                {association.phone ? (
                  <li className="flex items-center gap-2">
                    <Phone className="h-4 w-4 shrink-0" aria-hidden="true" />
                    <a
                      href={`tel:${association.phone.replace(/[^\d+]/g, "")}`}
                      className="text-accent-ink underline decoration-accent-ink/40 underline-offset-4 hover:decoration-accent-ink"
                    >
                      {association.phone}
                    </a>
                  </li>
                ) : null}
                {association.email ? (
                  <li className="flex items-center gap-2">
                    <Mail className="h-4 w-4 shrink-0" aria-hidden="true" />
                    <a
                      href={`mailto:${association.email}`}
                      className="break-all text-accent-ink underline decoration-accent-ink/40 underline-offset-4 hover:decoration-accent-ink"
                    >
                      {association.email}
                    </a>
                  </li>
                ) : null}
                <li className="pt-1 text-sm text-accent-ink/70">
                  Placeholder details for this concept.
                </li>
              </ul>
            ) : (
              <p className="mt-4 text-base leading-relaxed text-accent-ink/85">
                {brand.contactFallback}
              </p>
            )}

            <ul className="mt-6 flex flex-wrap gap-x-5 gap-y-1">
              <li>
                <a
                  href="#"
                  className="inline-flex min-h-[2.5rem] items-center text-base text-accent-ink/90 underline decoration-accent-ink/30 underline-offset-4 hover:decoration-accent-ink"
                >
                  Privacy Policy
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="inline-flex min-h-[2.5rem] items-center text-base text-accent-ink/90 underline decoration-accent-ink/30 underline-offset-4 hover:decoration-accent-ink"
                >
                  Accessibility
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Watermark + disclaimer ------------------------------------------ */}
        <div className="mt-12 border-t border-accent-ink/20 pt-10">
          <p className="font-display text-2xl font-semibold leading-tight sm:text-3xl md:text-4xl">
            {brand.sampleDesignLabel}
          </p>
          <p className="mt-2 text-base font-medium text-accent-ink/85">
            {brand.unofficialNotice}
          </p>
          <p className="mt-5 max-w-prose text-base leading-relaxed text-accent-ink/75">
            {brand.footerDisclaimer}
          </p>
          <p className="mt-6 text-sm text-accent-ink/70">
            <Link
              href="/demo"
              className="text-accent-ink underline decoration-accent-ink/40 underline-offset-4 hover:decoration-accent-ink"
            >
              Back to all {brand.product} concepts
            </Link>
          </p>
        </div>
      </Container>
    </footer>
  );
}
