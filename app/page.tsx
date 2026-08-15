import {
  Building2,
  CalendarDays,
  ChevronDown,
  FileText,
  Link2,
  LockKeyhole,
  MonitorSmartphone,
  ShieldCheck,
  Smartphone,
  Type,
} from "lucide-react";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ButtonLink } from "@/components/ui/Button";
import { Card, IconWell } from "@/components/ui/Card";
import { CommunityImage } from "@/components/ui/CommunityImage";
import { Concierge } from "@/components/demo/Concierge";
import { MarketingNav } from "@/components/marketing/MarketingNav";
import { SiteIntro } from "@/components/marketing/SiteIntro";
import { ContactForm } from "./contact/ContactForm";
import {
  SITE_CONCIERGE_SLUG,
  SITE_CONCIERGE_SUGGESTIONS,
} from "@/lib/concierge/site-prompt";
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
    <div id="top" className="min-h-screen bg-surface">
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

      <SiteIntro>
      <main id="main">
        {/* Hero ----------------------------------------------------------- */}
        {/*
         * The same opening the demo sites make — full-viewport photograph,
         * transparent split navigation, thin wide-tracked capitals — because
         * the company's own site must not look one class below the work it
         * sells. The photograph is site chrome supplied by the site owner — a
         * city skyline, not any client community — so it carries no alt text
         * and makes no claim about an association.
         */}
        <section
          aria-labelledby="hero-heading"
          className="on-accent relative isolate flex min-h-[100svh] flex-col bg-ink"
        >
          <Image
            src="/hero-skyline.webp"
            alt=""
            aria-hidden="true"
            fill
            priority
            sizes="100vw"
            // Horizontal position only — `cover` on a 2:1 source in a tall
            // phone frame crops the sides, never the top and bottom. Biased
            // right of centre for the densest run of towers.
            style={{ objectPosition: "68% 50%" }}
            className="-z-10 object-cover"
          />
          {/* Top scrim for the transparent nav, bottom for the scroll cue,
              and a radial pool behind the headline — thin letterspaced caps
              over a photograph is the hardest legibility case there is. */}
          <div
            aria-hidden="true"
            className="absolute inset-0 -z-10 bg-gradient-to-b from-black/60 via-black/20 to-black/45"
          />
          <div
            aria-hidden="true"
            className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_60%_45%_at_50%_52%,rgba(0,0,0,0.45),transparent_70%)]"
          />

          <MarketingNav />

          <div className="relative flex flex-1 flex-col items-center justify-center gap-6 px-6 pb-24 pt-28 text-center">
            <p className="hoa-hero-line text-sm font-medium uppercase tracking-eyebrow text-white/85 [text-shadow:0_1px_2px_rgba(0,0,0,0.7)]">
              Designed one community at a time
            </p>
            <h1
              id="hero-heading"
              className="hoa-hero-line max-w-5xl font-display font-light uppercase leading-[1.2] text-white [animation-delay:150ms] text-[clamp(1.6rem,4.6vw,3.4rem)] tracking-[0.12em] md:tracking-[0.2em] [text-shadow:0_1px_3px_rgba(0,0,0,0.75),0_4px_28px_rgba(0,0,0,0.6)]"
            >
              Websites for homeowner &amp; condominium associations
            </h1>
            <span
              aria-hidden="true"
              className="hoa-hero-line h-px w-16 bg-white/60 [animation-delay:300ms]"
            />
            <p className="hoa-hero-line max-w-xl text-base font-light leading-relaxed text-white/90 [animation-delay:300ms] [text-shadow:0_1px_3px_rgba(0,0,0,0.7)] md:text-lg">
              Clear, mobile-first, and public — so residents, buyers, agents,
              and lenders can see your community is well run. We design a free
              concept before you decide anything.
            </p>
            <div className="hoa-hero-line mt-2 flex flex-col items-center gap-3 [animation-delay:450ms] sm:flex-row sm:justify-center">
              <ButtonLink href="/start" size="lg" variant="inverse">
                Start your free concept
              </ButtonLink>
              <ButtonLink href="#designs" size="lg" variant="inverse-outline">
                See our work
              </ButtonLink>
            </div>
            <p className="hoa-hero-line text-sm font-light tracking-wide text-white/85 [animation-delay:600ms] [text-shadow:0_1px_2px_rgba(0,0,0,0.7)]">
              Plans from {site.priceFrom} — the concept is free.
            </p>
          </div>

          <a
            href="#explore-site"
            aria-label="Scroll to explore"
            className="absolute bottom-20 left-1/2 z-20 flex h-12 w-12 -translate-x-1/2 items-center justify-center rounded-pill text-white/90 transition-colors hover:text-white sm:bottom-6"
          >
            <ChevronDown
              className="hoa-bob h-7 w-7 drop-shadow-[0_1px_3px_rgba(0,0,0,0.7)]"
              aria-hidden="true"
            />
          </a>
        </section>
        <div id="explore-site" aria-hidden="true" />

        {/* Trust band ------------------------------------------------------ */}
        <div className="border-b border-line bg-card">
          <Container className="flex flex-wrap items-center justify-center gap-x-10 gap-y-3 py-5">
            {[
              { icon: ShieldCheck, label: "Compliant" },
              { icon: LockKeyhole, label: "Secure" },
              { icon: FileText, label: "Transparent" },
              { icon: MonitorSmartphone, label: "Accessible" },
            ].map(({ icon: Icon, label }) => (
              <span
                key={label}
                className="inline-flex items-center gap-2.5 text-xs font-semibold uppercase tracking-[0.18em] text-ink-soft"
              >
                <Icon className="h-5 w-5 text-accent" aria-hidden="true" />
                {label}
              </span>
            ))}
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

      {/*
       * The site guide: the same widget as the community concierge, grounded
       * in the company record instead of a community record — for the visitor
       * who wants to know what this is before filling in a form. Inside the
       * reveal on purpose: it is fixed at z-40, and outside it would float
       * over the intro wash.
       */}
      <Concierge
        slug={SITE_CONCIERGE_SLUG}
        communityName={site.name}
        suggestions={[...SITE_CONCIERGE_SUGGESTIONS]}
        tagline="Answers about what we do, from the site itself"
        emptyHint="Ask what Condo Seen does, how the demos work, or how to get started."
      />
      </SiteIntro>
    </div>
  );
}
