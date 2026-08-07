import {
  ArrowRight,
  Building2,
  CalendarDays,
  FileText,
  Link2,
  Smartphone,
  Type,
} from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { DemoThumbnail } from "@/components/portfolio/DemoThumbnail";
import { ButtonLink } from "@/components/ui/Button";
import { Card, IconWell } from "@/components/ui/Card";
import { Container } from "@/components/ui/Container";
import { Section, SectionHeading } from "@/components/ui/Section";
import { associations } from "@/data/associations";
import { organizationJsonLd, site } from "@/lib/site";

/**
 * The public marketing page — the one part of this site that is meant to be
 * found in search. Everything under /demo stays `noindex` because those pages
 * name real associations; this page carries the SEO instead.
 */
const title = `${site.name} — HOA and Condominium Association Websites`;
const description =
  "We build clear, mobile-friendly public websites for homeowner and condominium associations: community information, documents and forms, meeting dates, and management contact in one place. Free concept before you decide.";

export const metadata: Metadata = {
  title,
  description,
  // Explicitly indexable. The demo routes override this with noindex.
  robots: { index: true, follow: true },
  alternates: { canonical: "/" },
  keywords: [
    "HOA website design",
    "condominium association website",
    "homeowners association website",
    "condo association website design",
    "HOA web design company",
    "community association website",
  ],
  openGraph: {
    type: "website",
    title,
    description,
    siteName: site.name,
    url: "/",
  },
  twitter: { card: "summary_large_image", title, description },
};

const featureIcons = [Building2, FileText, CalendarDays, Smartphone, Type, Link2];

/** The five fictional design styles — safe to show publicly, no real org named. */
const designExamples = associations.slice(0, 5);

export default function HomePage() {
  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: site.faqs.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };

  return (
    <div className="min-h-screen bg-surface">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd()) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />

      <a
        href="#main"
        className="sr-only rounded-pill bg-accent px-5 py-3 font-semibold text-accent-ink focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50"
      >
        Skip to main content
      </a>

      <header className="border-b border-line bg-card">
        <Container className="flex flex-wrap items-center justify-between gap-4 py-5">
          <div className="flex items-center gap-3">
            <span
              aria-hidden="true"
              className="flex h-11 w-11 items-center justify-center rounded-pill bg-accent font-display text-lg font-bold text-accent-ink"
            >
              CS
            </span>
            <div>
              <p className="font-display text-lg font-semibold leading-tight text-ink">
                {site.name}
              </p>
              <p className="text-sm text-ink-muted">{site.tagline}</p>
            </div>
          </div>
          <nav aria-label="Primary">
            <ul className="flex flex-wrap items-center gap-1">
              {[
                ["What's included", "#included"],
                ["Designs", "#designs"],
                ["Questions", "#faq"],
              ].map(([label, href]) => (
                <li key={href}>
                  <a
                    href={href}
                    className="inline-flex min-h-[2.75rem] items-center rounded-pill px-3.5 text-base font-medium text-ink-soft no-underline hover:bg-accent-soft hover:text-accent"
                  >
                    {label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        </Container>
      </header>

      <main id="main">
        {/* Hero ----------------------------------------------------------- */}
        <div className="hoa-grain border-b border-line bg-surface-alt">
          <Container className="py-16 md:py-24">
            <h1 className="max-w-4xl font-display text-4xl font-semibold leading-[1.1] text-ink md:text-5xl lg:text-6xl">
              Websites for homeowner and condominium associations
            </h1>
            <p className="mt-6 max-w-prose text-lg leading-relaxed text-ink-soft">
              Most associations have no public website, or one that has not been
              touched in a decade. We build a clear, mobile-friendly page that
              shows residents, buyers, agents, and lenders that the community
              exists and is well run.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <ButtonLink href="#contact" size="lg">
                Ask for a free concept
                <ArrowRight className="h-5 w-5" aria-hidden="true" />
              </ButtonLink>
              <ButtonLink href="#designs" size="lg" variant="outline">
                See the designs
              </ButtonLink>
            </div>
            <p className="mt-6 max-w-prose text-base text-ink-muted">
              We build a concept for your community first, at no cost and with no
              obligation.
            </p>
          </Container>
        </div>

        {/* Positioning ---------------------------------------------------- */}
        <Section tone="surface" labelledBy="positioning-heading">
          <div className="mx-auto max-w-3xl text-center">
            <h2
              id="positioning-heading"
              className="font-display text-3xl font-semibold leading-tight text-ink md:text-4xl"
            >
              {site.positioning.heading}
            </h2>
            <p className="mt-5 text-lg leading-relaxed text-ink-soft">
              {site.positioning.body}
            </p>
          </div>
        </Section>

        {/* Features ------------------------------------------------------- */}
        <Section id="included" tone="alt" labelledBy="included-heading">
          <SectionHeading
            id="included-heading"
            eyebrow="What's included"
            title="Everything a community actually gets asked for"
            description="Built from the questions association offices field over and over."
          />
          <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {site.features.map((feature, index) => {
              const Icon = featureIcons[index] ?? Building2;
              return (
                <li key={feature.title}>
                  <Card className="flex h-full flex-col gap-3 p-6">
                    <IconWell>
                      <Icon className="h-6 w-6" aria-hidden="true" />
                    </IconWell>
                    <h3 className="font-display text-lg font-semibold text-ink">
                      {feature.title}
                    </h3>
                    <p className="text-base leading-relaxed text-ink-soft">
                      {feature.body}
                    </p>
                  </Card>
                </li>
              );
            })}
          </ul>
        </Section>

        {/* Designs -------------------------------------------------------- */}
        <Section id="designs" tone="surface" labelledBy="designs-heading">
          <SectionHeading
            id="designs-heading"
            eyebrow="Five starting points"
            title="Pick a look that suits the community"
            description="Every design uses the same tested foundation — only the colour, type, and layout change. These examples use fictional communities."
          />
          <ul className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {designExamples.map((example) => (
              <li key={example.slug}>
                <Card interactive className="group h-full overflow-hidden">
                  <div className="border-b border-line">
                    <DemoThumbnail association={example} />
                  </div>
                  <div className="p-6">
                    <h3 className="font-display text-xl font-semibold text-ink">
                      <Link
                        href={`/demo/${example.slug}`}
                        className="no-underline after:absolute after:inset-0 after:content-['']"
                      >
                        {example.designName}
                      </Link>
                    </h3>
                    <p className="mt-2 text-base leading-relaxed text-ink-soft">
                      {example.designTagline}
                    </p>
                  </div>
                </Card>
              </li>
            ))}
          </ul>
        </Section>

        {/* FAQ ------------------------------------------------------------ */}
        <Section id="faq" tone="alt" labelledBy="faq-heading">
          <SectionHeading
            id="faq-heading"
            eyebrow="Questions"
            title="Straight answers"
          />
          <div className="mx-auto grid max-w-3xl gap-3">
            {site.faqs.map((faq) => (
              <Card key={faq.q} className="overflow-hidden">
                <details className="group">
                  <summary className="flex cursor-pointer list-none items-center justify-between gap-4 p-5 sm:p-6 [&::-webkit-details-marker]:hidden">
                    <h3 className="font-display text-lg font-semibold leading-snug text-ink">
                      {faq.q}
                    </h3>
                    <span
                      aria-hidden="true"
                      className="flex h-10 w-10 shrink-0 items-center justify-center rounded-pill bg-accent-soft text-xl font-semibold text-accent transition-transform duration-200 group-open:rotate-45"
                    >
                      +
                    </span>
                  </summary>
                  <div className="border-t border-line px-5 pb-6 pt-4 sm:px-6">
                    <p className="text-base leading-relaxed text-ink-soft">{faq.a}</p>
                  </div>
                </details>
              </Card>
            ))}
          </div>
        </Section>

        {/* Contact -------------------------------------------------------- */}
        <Section id="contact" tone="surface" labelledBy="contact-heading">
          <div className="mx-auto max-w-2xl text-center">
            <h2
              id="contact-heading"
              className="font-display text-3xl font-semibold text-ink md:text-4xl"
            >
              Ask for a concept for your community
            </h2>
            <p className="mt-4 text-lg leading-relaxed text-ink-soft">
              Tell us the association name and where it is. We will build a
              concept and send you a link — free, and with nothing to sign.
            </p>
            {site.contactEmail || site.phone ? (
              <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
                {site.contactEmail ? (
                  <ButtonLink href={`mailto:${site.contactEmail}`} size="lg">
                    Email us
                  </ButtonLink>
                ) : null}
                {site.phone ? (
                  <ButtonLink
                    href={`tel:${site.phone.replace(/[^\d+]/g, "")}`}
                    size="lg"
                    variant="outline"
                  >
                    {site.phone}
                  </ButtonLink>
                ) : null}
              </div>
            ) : (
              <p className="mt-8 rounded-card border border-line bg-card p-5 text-base text-ink-soft shadow-soft">
                Contact details are being set up. Add an email address or phone
                number in <code className="font-mono text-sm">lib/site.ts</code>{" "}
                and it will appear here.
              </p>
            )}
          </div>
        </Section>
      </main>

      <footer className="on-accent bg-accent text-accent-ink">
        <Container className="py-12">
          <p className="font-display text-2xl font-semibold">{site.name}</p>
          <p className="mt-2 text-base text-accent-ink/85">{site.tagline}</p>
          <p className="mt-6 max-w-prose text-sm leading-relaxed text-accent-ink/75">
            Website concepts shown for prospective clients are unofficial and are
            not affiliated with or endorsed by the associations named in them.
            Concept pages are not published to search engines.
          </p>
          <p className="mt-6 text-sm text-accent-ink/70">
            © {site.name}. Serving associations across the {site.serviceArea}.
          </p>
        </Container>
      </footer>
    </div>
  );
}
