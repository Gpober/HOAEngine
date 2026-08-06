import type { Metadata } from "next";
import { Accessibility, FileWarning, Palette, ShieldCheck } from "lucide-react";
import { DemoCard } from "@/components/portfolio/DemoCard";
import { Card, IconWell } from "@/components/ui/Card";
import { Container } from "@/components/ui/Container";
import { Section, SectionHeading } from "@/components/ui/Section";
import { associations } from "@/data/associations";
import { brand } from "@/lib/brand";
import { noIndexRobots, placeholderOgImage } from "@/lib/seo";

const title = "Association Website Concepts";
const description = `${brand.sampleDesignLabel}. Five unofficial homepage concepts for homeowner and condominium associations — created for demonstration purposes only.`;

export const metadata: Metadata = {
  title,
  description,
  robots: noIndexRobots,
  alternates: { canonical: "/demo" },
  openGraph: {
    type: "website",
    title,
    description,
    siteName: `${brand.product} by ${brand.name}`,
    url: "/demo",
    images: [placeholderOgImage],
  },
  twitter: { card: "summary_large_image", title, description, images: [placeholderOgImage.url] },
};

const principles = [
  {
    icon: ShieldCheck,
    title: "Clearly unofficial",
    body: "Every concept carries the sample-design label at the top of the page and a full disclaimer in the footer.",
  },
  {
    icon: FileWarning,
    title: "No invented facts",
    body: "Sites render only what the configuration supplies. Missing details stay blank instead of being filled in.",
  },
  {
    icon: Accessibility,
    title: "Built to be readable",
    body: "16px minimum body text, visible focus states, semantic landmarks, and large touch targets throughout.",
  },
  {
    icon: Palette,
    title: "One component system",
    body: "All five looks come from the same components — only the palette, type, and layout tokens change.",
  },
];

export default function DemoIndexPage() {
  return (
    <div className="min-h-screen bg-surface">
      <a
        href="#concepts"
        className="sr-only rounded-pill bg-accent px-5 py-3 font-semibold text-accent-ink focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50"
      >
        Skip to the concepts
      </a>

      {/* Header ---------------------------------------------------------- */}
      <header className="border-b border-line bg-card">
        <Container className="flex flex-wrap items-center justify-between gap-4 py-5">
          <div className="flex items-center gap-3">
            <span
              aria-hidden="true"
              className="flex h-11 w-11 items-center justify-center rounded-pill bg-accent font-display text-lg font-bold text-accent-ink"
            >
              HD
            </span>
            <div>
              <p className="font-display text-lg font-semibold leading-tight text-ink">
                {brand.product}
              </p>
              <p className="text-sm text-ink-muted">by {brand.name}</p>
            </div>
          </div>
          <p className="text-sm font-semibold uppercase tracking-eyebrow text-ink-muted">
            Design concept portfolio
          </p>
        </Container>
      </header>

      <main>
        {/* Hero ---------------------------------------------------------- */}
        <div className="hoa-grain border-b border-line bg-surface-alt">
          <Container className="py-14 md:py-20">
            <p className="text-sm font-semibold uppercase tracking-eyebrow text-ink-muted">
              {brand.sampleDesignLabel}
            </p>
            <h1 className="mt-4 max-w-3xl font-display text-4xl font-semibold leading-[1.1] text-ink md:text-5xl lg:text-6xl">
              Website concepts for associations that deserve a better front door
            </h1>
            <p className="mt-5 max-w-prose text-lg leading-relaxed text-ink-soft">
              Five homepage designs for homeowner and condominium associations —
              built for communities with no website, an outdated one, or nothing
              more than a page of contact details. Each concept uses fictional
              placeholder data.
            </p>
            <p className="mt-6 max-w-prose rounded-card border border-line bg-card p-5 text-base leading-relaxed text-ink-soft shadow-soft">
              <strong className="font-semibold text-ink">
                {brand.unofficialNotice}
              </strong>{" "}
              {brand.footerDisclaimer}
            </p>
          </Container>
        </div>

        {/* Concept grid --------------------------------------------------- */}
        <Section id="concepts" tone="surface" labelledBy="concepts-heading">
          <SectionHeading
            id="concepts-heading"
            eyebrow="Five designs"
            title="Choose a concept to preview"
            description="Each demo is a full homepage — hero, quick links, announcements, meetings, documents, amenities, contact, and FAQ."
          />
          <ul className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {associations.map((association) => (
              <li key={association.slug}>
                <DemoCard association={association} />
              </li>
            ))}
          </ul>
        </Section>

        {/* Principles ------------------------------------------------------ */}
        <Section tone="alt" labelledBy="principles-heading">
          <SectionHeading
            id="principles-heading"
            eyebrow="How these are built"
            title="Honest demos, not lookalike websites"
            description="These concepts are sales tools. They are designed so nobody can mistake one for an association's official site."
          />
          <ul className="grid gap-4 sm:grid-cols-2">
            {principles.map((principle) => {
              const Icon = principle.icon;
              return (
                <li key={principle.title}>
                  <Card className="flex h-full items-start gap-4 p-6">
                    <IconWell>
                      <Icon className="h-6 w-6" aria-hidden="true" />
                    </IconWell>
                    <div>
                      <h3 className="font-display text-lg font-semibold text-ink">
                        {principle.title}
                      </h3>
                      <p className="mt-2 text-base leading-relaxed text-ink-soft">
                        {principle.body}
                      </p>
                    </div>
                  </Card>
                </li>
              );
            })}
          </ul>
        </Section>
      </main>

      {/* Footer ----------------------------------------------------------- */}
      <footer className="on-accent bg-accent text-accent-ink">
        <Container className="py-12 md:py-14">
          <p className="font-display text-2xl font-semibold sm:text-3xl md:text-4xl">
            {brand.sampleDesignLabel}
          </p>
          <p className="mt-2 text-base font-medium text-accent-ink/85">
            {brand.unofficialNotice}
          </p>
          <p className="mt-5 max-w-prose text-base leading-relaxed text-accent-ink/75">
            {brand.footerDisclaimer}
          </p>
          <ul className="mt-8 flex flex-wrap gap-x-6 gap-y-2">
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
        </Container>
      </footer>
    </div>
  );
}
