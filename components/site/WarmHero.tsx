import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { ButtonLink } from "@/components/ui/Button";
import { CommunityImage } from "@/components/ui/CommunityImage";
import { Container } from "@/components/ui/Container";
import { locationLabel } from "@/lib/content";
import type { Association } from "@/lib/types";

/**
 * The warm opening: a welcome, not a production. No intro curtain, no
 * full-bleed drama — a solid soft-colour ground, sentence-case type that
 * says hello, and the photograph in a big rounded frame beside the words.
 * The nav above it is solid from the first paint. This is the opening for a
 * community that would rather feel like a neighbourhood than a resort.
 */
export function WarmHero({ association }: { association: Association }) {
  const location = locationLabel(association);
  const name = association.shortName ?? association.name;

  return (
    <section aria-labelledby="hero-heading" className="hoa-grain bg-surface-alt">
      <Container className="grid items-center gap-10 py-14 md:py-20 lg:grid-cols-2 lg:gap-16">
        <div className="flex flex-col gap-6">
          {location || association.communityType ? (
            <p className="text-sm font-semibold uppercase tracking-eyebrow text-ink-muted">
              {[location, association.communityType].filter(Boolean).join(" · ")}
            </p>
          ) : null}
          <h1
            id="hero-heading"
            className="font-display text-4xl font-bold leading-[1.08] text-ink sm:text-5xl lg:text-6xl"
          >
            Welcome to {name}
            {name !== association.name ? (
              <span className="sr-only"> — {association.name}</span>
            ) : null}
          </h1>
          <p className="max-w-prose text-lg leading-relaxed text-ink-soft">
            {association.tagline ?? association.shortDescription}
          </p>
          <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap">
            <ButtonLink href={`/demo/${association.slug}/news`} size="lg">
              What&apos;s happening
              <ArrowRight className="h-5 w-5" aria-hidden="true" />
            </ButtonLink>
            <ButtonLink
              href={`/demo/${association.slug}/community`}
              size="lg"
              variant="outline"
            >
              About the community
            </ButtonLink>
          </div>
          <p className="text-sm text-ink-muted">
            Looking for something specific?{" "}
            <Link href={`/demo/${association.slug}/documents`} className="text-accent">
              Documents and forms
            </Link>{" "}
            are one tap away.
          </p>
        </div>
        <div>
          <CommunityImage
            image={association.heroImage}
            priority
            rounded={false}
            sizes="(min-width: 1024px) 46vw, 92vw"
            className="aspect-[4/3] w-full rounded-[2rem] shadow-lift"
          />
        </div>
      </Container>
      {/* Anchor parity with the full-viewport openings: the section order
          starts here whatever the design. */}
    </section>
  );
}
