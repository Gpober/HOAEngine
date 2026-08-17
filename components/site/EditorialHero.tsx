import { ChevronDown } from "lucide-react";
import { CinemaNav } from "@/components/site/CinemaNav";
import { CommunityImage } from "@/components/ui/CommunityImage";
import { Container } from "@/components/ui/Container";
import { locationLabel } from "@/lib/content";
import type { Association } from "@/lib/types";

/**
 * The editorial opening: a magazine cover, not a title card. Full-height
 * photograph, but the name sits low and left in heavy tight-set type — the
 * opposite gesture from the cinema hero's centred thin capitals — with the
 * wordmark in the corner and the scroll cue on the right. No intro curtain:
 * an urban building's site gets straight to it.
 *
 * Fills the viewport the same way the cinema hero does: the homepage wraps
 * the disclaimer and this section in one `min-h-[100svh]` column and this
 * takes `flex-1`.
 */
export function EditorialHero({ association }: { association: Association }) {
  const location = locationLabel(association);
  const eyebrow = [location, association.communityType]
    .filter(Boolean)
    .join("  ·  ");

  return (
    <>
      <CinemaNav association={association} layout="corner" />
      <section
        aria-labelledby="hero-heading"
        className="relative isolate flex flex-1 flex-col bg-ink"
      >
      <div className="absolute inset-0">
        <CommunityImage
          image={association.heroImage}
          priority
          rounded={false}
          sizes="100vw"
          focus="center"
          labelAlign="right"
          className="h-full w-full"
        />
      </div>

      {/* Scrim weighted to the bottom-left, where the type lives. */}
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-gradient-to-b from-black/25 via-black/10 to-black/70"
      />
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-[linear-gradient(75deg,rgba(0,0,0,0.55),transparent_55%)]"
      />

      <Container className="relative flex flex-1 flex-col justify-end pb-20 pt-16 md:pb-24">
        <div className="max-w-3xl">
          {eyebrow ? (
            <p className="hoa-hero-line text-sm font-semibold uppercase tracking-eyebrow text-white/85 [text-shadow:0_1px_2px_rgba(0,0,0,0.7)]">
              {eyebrow}
            </p>
          ) : null}
          <h1
            id="hero-heading"
            className="hoa-hero-line mt-4 font-display text-5xl font-bold leading-[1.02] tracking-[-0.02em] text-white [animation-delay:150ms] [text-shadow:0_2px_6px_rgba(0,0,0,0.6)] sm:text-6xl lg:text-7xl"
          >
            {association.shortName ?? association.name}
            {(association.shortName ?? association.name) !== association.name ? (
              <span className="sr-only"> — {association.name}</span>
            ) : null}
          </h1>
          {association.tagline ? (
            <p className="hoa-hero-line mt-5 max-w-xl text-base leading-relaxed text-white/90 [animation-delay:300ms] [text-shadow:0_1px_3px_rgba(0,0,0,0.7)] md:text-lg">
              {association.tagline}
            </p>
          ) : null}
        </div>
      </Container>

      {/* Scroll cue in the right corner — the cover's page-turn, not the
          cinema hero's centred chevron. Lifted on phones where the floating
          badge owns the bottom edge. */}
      <a
        href="#explore"
        aria-label="Scroll to explore the community"
        className="absolute bottom-20 right-4 z-20 flex h-12 w-12 items-center justify-center rounded-pill border border-white/40 text-white/90 transition-colors hover:bg-white/10 hover:text-white sm:bottom-6 sm:right-6"
      >
        <ChevronDown
          className="hoa-bob h-6 w-6 drop-shadow-[0_1px_3px_rgba(0,0,0,0.7)]"
          aria-hidden="true"
        />
      </a>
      </section>
    </>
  );
}
