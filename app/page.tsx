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
import Image from "next/image";
import Link from "next/link";
import { ButtonLink } from "@/components/ui/Button";
import { Card, IconWell } from "@/components/ui/Card";
import { CommunityImage } from "@/components/ui/CommunityImage";
import { ContactForm } from "./contact/ContactForm";
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
                ["Demos", "#designs"],
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
        {/*
         * `on-accent` inverts the focus ring for this subtree; `isolate` keeps
         * the -z-10 photograph and scrims behind the copy but in front of the
         * page background, rather than letting them escape the stacking context.
         *
         * The photograph is site chrome supplied by the site owner — a city
         * skyline, not any client community — so it carries no alt text and
         * makes no claim about an association.
         */}
        <div className="on-accent relative isolate overflow-hidden border-b border-line">
          <Image
            src="/hero-skyline.webp"
            alt=""
            aria-hidden="true"
            fill
            priority
            sizes="100vw"
            /*
             * Horizontal position only — `cover` on a 2:1 source in a tall
             * phone-width frame crops the sides, never the top and bottom, so
             * the vertical value does nothing. Biased right of centre because
             * that slice holds the densest run of towers; dead centre lands on
             * a gap in the skyline and reads as empty sky on a phone.
             */
            style={{ objectPosition: "68% 50%" }}
            className="-z-10 object-cover"
          />
          {/*
           * Nothing sits between the copy and the photograph — no box, no
           * panel, no scrim, not even a gradient. The picture is delivered as
           * shot.
           *
           * What makes that possible is putting the darkening on the letters
           * instead of behind them. A halo hugging each glyph darkens only the
           * pixels the eye compares that letter against, which is a few
           * thousand of them rather than the whole frame. Measured at the
           * glyph pixels themselves the worst string clears AA by 1.3x, and the
           * hero runs at 83-95% of the untouched file's brightness.
           *
           * Two details make it work and both were found by measuring:
           *
           * - The body copy is `font-medium`. A heavier stroke carries a denser
           *   halo, and the thin 16px line was the binding constraint every
           *   time — at `font-normal` it needed a real scrim behind it.
           * - `text-shadow` inherits, so it is declared once here. The solid
           *   CTA opts out: it has an opaque fill, and a dark halo on navy
           *   text over white just looks smudged.
           */}
          <Container className="py-20 md:py-28">
            <div className="[text-shadow:0_0_2px_rgb(var(--hoa-ink)),0_0_5px_rgb(var(--hoa-ink)),0_1px_4px_rgb(var(--hoa-ink)),0_2px_10px_rgb(var(--hoa-ink)),0_4px_22px_rgb(var(--hoa-ink)/0.95),0_8px_48px_rgb(var(--hoa-ink)/0.88)]">
              <h1 className="max-w-4xl font-display text-4xl font-semibold leading-[1.1] text-accent-ink md:text-5xl lg:text-6xl">
                Websites for homeowner and condominium associations
              </h1>
              <p className="mt-6 max-w-prose text-lg font-medium leading-relaxed text-accent-ink">
                Most associations have no public website, or one that has not
                been touched in a decade. We build a clear, mobile-friendly page
                that shows residents, buyers, agents, and lenders that the
                community exists and is well run.
              </p>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <ButtonLink
                  href="#contact"
                  size="lg"
                  variant="inverse"
                  className="[text-shadow:none]"
                >
                  Ask for a free concept
                  <ArrowRight className="h-5 w-5" aria-hidden="true" />
                </ButtonLink>
                <ButtonLink href="#designs" size="lg" variant="inverse-outline">
                  See the demos
                </ButtonLink>
              </div>
              <p className="mt-6 max-w-prose text-base font-medium text-accent-ink">
                We build a concept for your community first, at no cost and with
                no obligation.
              </p>
            </div>
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
            eyebrow="Demos"
            title="Every one of these is a different site"
            description="Not one layout in five colours. Each is ordered around what its community actually leads with — the amenities, the paperwork, or the office. The communities shown are illustrative; we build yours before you decide."
          />
          <ul className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {designExamples.map((example) => (
              <li key={example.slug}>
                <Card interactive className="group flex h-full flex-col overflow-hidden">
                  <CommunityImage
                    image={example.heroImage}
                    rounded={false}
                    focus="center"
                    sizes="(min-width: 1280px) 30vw, (min-width: 768px) 46vw, 92vw"
                    className="aspect-[16/10] w-full border-b border-line"
                  />
                  <div className="flex flex-1 flex-col p-6">
                    {/*
                     * The community leads, not the design. The palette swatches
                     * and layout notes that used to sit here were accurate and
                     * exactly wrong: they described a product being chosen from,
                     * when the thing being sold is a site built around one
                     * association. The design identity still exists in the data
                     * and is still what drives the render — it just is not the
                     * customer's problem.
                     */}
                    <h3 className="font-display text-xl font-semibold text-ink">
                      <Link
                        href={`/demo/${example.slug}`}
                        className="no-underline after:absolute after:inset-0 after:content-['']"
                      >
                        {example.shortName ?? example.name}
                      </Link>
                    </h3>
                    {example.city || example.state ? (
                      <p className="mt-1 text-sm text-ink-muted">
                        {[example.city, example.state].filter(Boolean).join(", ")}
                      </p>
                    ) : null}
                    <p className="mt-3 text-base leading-relaxed text-ink-soft">
                      {example.shortDescription}
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
          <div className="mx-auto max-w-3xl">
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
            </div>

            <div className="mt-8">
              <ContactForm />
            </div>

            {/*
             * The form is the route that always works, so it leads. A published
             * address or number is an addition to it, never a replacement — and
             * where neither is set nothing is shown, rather than an apology for
             * a channel that does not exist.
             */}
            {site.contactEmail || site.phone ? (
              <p className="mt-6 text-center text-base text-ink-soft">
                Prefer not to use a form?{" "}
                {site.contactEmail ? (
                  <a href={`mailto:${site.contactEmail}`}>{site.contactEmail}</a>
                ) : null}
                {site.contactEmail && site.phone ? " or " : null}
                {site.phone ? (
                  <a href={`tel:${site.phone.replace(/[^\d+]/g, "")}`}>
                    {site.phone}
                  </a>
                ) : null}
              </p>
            ) : null}
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
