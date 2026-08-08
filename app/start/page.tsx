import { ArrowLeft } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { site } from "@/lib/site";
import { IntakeForm } from "./IntakeForm";

export const metadata: Metadata = {
  title: `Start your concept — ${site.name}`,
  description:
    "Describe your community and we design a website concept for it — free, private, and yours to review before anyone else sees it.",
};

/**
 * The intake page, dressed like the rest of the house: the same accent band
 * and thin, wide-tracked capitals as the demo openings, with the form lifted
 * up over the band's edge. First impressions are the product here — a board
 * deciding whether to trust us with their site is looking at this page.
 */
export default function StartPage() {
  return (
    <div className="min-h-screen bg-surface-alt">
      <div className="on-accent bg-accent text-accent-ink">
        {/* Slim top row: the way back, and the proof. */}
        <Container className="flex items-center justify-between py-5">
          <Link
            href="/"
            className="inline-flex min-h-[2.75rem] items-center gap-2 text-xs font-medium uppercase tracking-[0.14em] text-accent-ink/85 no-underline transition-colors hover:text-accent-ink"
          >
            <ArrowLeft className="h-4 w-4" aria-hidden="true" />
            {site.name}
          </Link>
          <Link
            href="/demo"
            className="inline-flex min-h-[2.75rem] items-center text-xs font-medium uppercase tracking-[0.14em] text-accent-ink/85 no-underline transition-colors hover:text-accent-ink"
          >
            See our work
          </Link>
        </Container>

        {/* The opening: same voice as the demo heroes. */}
        <Container className="flex flex-col items-center gap-4 pb-28 pt-10 text-center md:pb-36 md:pt-16">
          <p className="text-sm font-medium uppercase tracking-eyebrow text-accent-ink/70">
            A free concept, designed for you
          </p>
          <h1 className="max-w-4xl font-display text-3xl font-light uppercase leading-[1.2] tracking-[0.14em] sm:text-4xl md:text-5xl md:tracking-[0.2em]">
            Tell us about
            <br className="sm:hidden" /> your community
          </h1>
          <span aria-hidden="true" className="h-px w-16 bg-accent-ink/50" />
          <p className="max-w-xl text-base font-light leading-relaxed text-accent-ink/85 md:text-lg">
            Five minutes of answers is all it takes. We design the concept, you
            get a private link to review, and nothing goes live unless you say
            so.
          </p>
        </Container>
      </div>

      {/* The form rises over the band's edge — one page, one gesture. */}
      <main className="relative pb-20">
        <Container className="-mt-16 max-w-3xl md:-mt-20">
          <IntakeForm />
        </Container>
      </main>

      <footer className="on-accent bg-accent text-accent-ink">
        <Container className="flex flex-col items-center gap-2 py-10 text-center">
          <p className="font-display text-lg font-light uppercase tracking-[0.24em]">
            {site.name}
          </p>
          <p className="text-sm text-accent-ink/75">{site.tagline}</p>
        </Container>
      </footer>
    </div>
  );
}
