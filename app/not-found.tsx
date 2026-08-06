import { ArrowRight } from "lucide-react";
import type { Metadata } from "next";
import { ButtonLink } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { brand } from "@/lib/brand";
import { noIndexRobots } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Page not found",
  robots: noIndexRobots,
};

export default function NotFound() {
  return (
    <main className="flex min-h-screen items-center bg-surface">
      <Container className="py-20">
        <p className="text-sm font-semibold uppercase tracking-eyebrow text-ink-muted">
          {brand.product}
        </p>
        <h1 className="mt-4 font-display text-4xl font-semibold text-ink md:text-5xl">
          We couldn&apos;t find that page
        </h1>
        <p className="mt-4 max-w-prose text-lg leading-relaxed text-ink-soft">
          The concept you were looking for may have been renamed or removed.
          All available concepts are listed on the portfolio page.
        </p>
        <div className="mt-8">
          <ButtonLink href="/demo" size="lg">
            View all concepts
            <ArrowRight className="h-5 w-5" aria-hidden="true" />
          </ButtonLink>
        </div>
        <p className="mt-10 max-w-prose text-sm leading-relaxed text-ink-muted">
          {brand.footerDisclaimer}
        </p>
      </Container>
    </main>
  );
}
