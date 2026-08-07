import { Container } from "@/components/ui/Container";
import { locationLabel } from "@/lib/content";
import type { Association } from "@/lib/types";

/**
 * The sub-page opening: a band in the community's colour with the page title
 * in the same thin, wide-tracked capitals as the homepage hero. No photograph
 * and no animation — inner pages open quietly so the homepage stays the
 * showpiece — but the type keeps the two clearly part of one site.
 */
export function PageHero({
  association,
  title,
  lede,
}: {
  association: Association;
  title: string;
  lede?: string;
}) {
  const location = locationLabel(association);

  return (
    <section aria-labelledby="page-heading" className="on-accent bg-accent text-accent-ink">
      <Container className="flex flex-col items-center gap-4 py-16 text-center md:py-24">
        {location ? (
          <p className="text-sm font-medium uppercase tracking-eyebrow text-accent-ink/70">
            {location}
          </p>
        ) : null}
        <h1
          id="page-heading"
          className="max-w-4xl font-display text-3xl font-light uppercase leading-[1.2] tracking-[0.14em] sm:text-4xl md:text-5xl md:tracking-[0.2em]"
        >
          {title}
        </h1>
        <span aria-hidden="true" className="h-px w-16 bg-accent-ink/50" />
        {lede ? (
          <p className="max-w-xl text-base font-light leading-relaxed text-accent-ink/85 md:text-lg">
            {lede}
          </p>
        ) : null}
      </Container>
    </section>
  );
}
