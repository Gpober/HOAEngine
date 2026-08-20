import { ChevronDown } from "lucide-react";
import { CinemaNav } from "@/components/site/CinemaNav";
import { CommunityImage } from "@/components/ui/CommunityImage";
import { cn } from "@/lib/cn";
import { displayNameFor, locationLabel } from "@/lib/content";
import type { Association } from "@/lib/types";

/**
 * The full-bleed opening. One photograph filling the viewport, the split
 * navigation transparent over it, and the community's name centred in thin,
 * wide-tracked capitals — nothing else. No card, no frame, no grey backdrop,
 * no row of buttons: the restraint is the point, and everything practical
 * lives one scroll down or in the navigation.
 *
 * Legibility is the hard problem here. Thin letterspaced capitals over a
 * photograph is the worst case for contrast, so three things stack up behind
 * the type: a top scrim for the nav, a radial pool of darkness behind the
 * headline block, and a layered text-shadow halo on the glyphs themselves.
 * The photograph still reads because the scrims are gradients, not a flat
 * wash.
 */
export function CinemaHero({ association }: { association: Association }) {
  const location = locationLabel(association);
  const eyebrow = [location, association.communityType]
    .filter(Boolean)
    .join("  ·  ");

  return (
    /*
     * No viewport height of its own: the homepage wraps the disclaimer, the
     * solid bar, and this section in one `min-h-[100svh]` column and the hero
     * takes `flex-1`, so it fills exactly what the bar and disclaimer leave.
     * The navigation renders above the photograph — the boutique-property
     * arrangement — rather than floating transparent over it.
     */
    <>
      <CinemaNav association={association} />
      <section
        aria-labelledby="hero-heading"
        className="relative isolate flex flex-1 flex-col overflow-hidden bg-ink"
      >
      {/* Slow cinematic settle on the photograph — see .hoa-kenburns. The
          overflow-hidden on the section clips the brief over-scale. */}
      <div className="hoa-kenburns absolute inset-0">
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

      {/* Gentle top scrim for depth, bottom scrim for the scroll cue. */}
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-gradient-to-b from-black/25 via-black/15 to-black/45"
      />
      {/* Pool of darkness behind the headline, fading out well before the edges. */}
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-[radial-gradient(ellipse_60%_45%_at_50%_52%,rgba(0,0,0,0.45),transparent_70%)]"
      />

      <div className="relative flex flex-1 flex-col items-center justify-center gap-6 px-6 pb-24 pt-16 text-center">
        {eyebrow ? (
          <p className="hoa-hero-line text-sm font-medium uppercase tracking-eyebrow text-white/85 [text-shadow:0_1px_2px_rgba(0,0,0,0.7)]">
            {eyebrow}
          </p>
        ) : null}

        <h1
          id="hero-heading"
          className={cn(
            "hoa-hero-line max-w-5xl font-display font-light uppercase leading-[1.15] text-white [animation-delay:150ms]",
            "text-[clamp(1.9rem,6vw,4.25rem)] tracking-[0.18em] md:tracking-[0.26em]",
            // Layered halo: a tight shadow for edge definition and a wide one
            // for overall separation. Thin caps get no help from stroke weight,
            // so the shadow does all the work.
            "[text-shadow:0_1px_3px_rgba(0,0,0,0.75),0_4px_28px_rgba(0,0,0,0.6)]",
          )}
        >
          {/* The short name carries the display; the legal name still reaches
              assistive technology and search engines. */}
          {displayNameFor(association)}
          {displayNameFor(association) !== association.name ? (
            <span className="sr-only"> — {association.name}</span>
          ) : null}
        </h1>

        <span
          aria-hidden="true"
          className="hoa-hero-line h-px w-16 bg-white/60 [animation-delay:300ms]"
        />

        {association.tagline ? (
          <p className="hoa-hero-line max-w-xl text-base font-light leading-relaxed text-white/90 [animation-delay:300ms] [text-shadow:0_1px_3px_rgba(0,0,0,0.7)] md:text-lg">
            {association.tagline}
          </p>
        ) : null}
      </div>

      {/* Scroll cue: the only call to action the opening needs. Sits above
          the floating badge row on phones, where the badge's right-aligned
          pill reaches past the horizontal centre of the screen. */}
      <a
        href="#explore"
        aria-label="Scroll to explore the community"
        className="absolute bottom-20 left-1/2 z-20 flex h-12 w-12 -translate-x-1/2 items-center justify-center rounded-pill text-white/90 transition-colors hover:text-white sm:bottom-6"
      >
        <ChevronDown
          className="hoa-bob h-7 w-7 drop-shadow-[0_1px_3px_rgba(0,0,0,0.7)]"
          aria-hidden="true"
        />
      </a>

      {/*
       * No "demo concept" chip here: the floating ConceptBadge already owns
       * the bottom-right corner, and the disclaimer bar sits above the fold.
       */}
      </section>
    </>
  );
}
