import { ConceptBadge } from "@/components/ConceptBadge";
import { Concierge } from "@/components/demo/Concierge";
import { CONCIERGE_SLUGS } from "@/lib/concierge/enabled";
import { suggestedQuestions } from "@/lib/concierge/context";
import { ByTheNumbers } from "@/components/site/ByTheNumbers";
import { CinemaHero } from "@/components/site/CinemaHero";
import { DisclaimerBar } from "@/components/site/DisclaimerBar";
import { ExploreGrid } from "@/components/site/ExploreGrid";
import { HomeHighlights } from "@/components/site/HomeHighlights";
import { IntroReveal } from "@/components/site/IntroReveal";
import { PhotoBand } from "@/components/site/PhotoBand";
import { SiteFooter } from "@/components/site/SiteFooter";
import { designStyleVars, designStyles, type SectionKey } from "@/lib/design-styles";
import { themeStyle } from "@/lib/themes";
import type { Association } from "@/lib/types";

/**
 * The demo homepage: the showpiece and nothing else.
 *
 * Cinematic opening, photography, the numbers, a glimpse of what's new, and
 * doors to the rest of the site. About, amenities, documents, the full
 * schedule, FAQ, and contact each live on their own page (see `DemoSubPage`
 * and `app/demo/[slug]/*`), because a homepage that carries everything is a
 * homepage nobody reads.
 *
 * The palette and typography arrive as CSS custom properties on the wrapper;
 * the *order* of the four blocks below the hero comes from the design's
 * `sectionOrder`, so the five concepts still differ in what a visitor sees
 * first.
 */
const SECTIONS: Record<
  SectionKey,
  ({ association }: { association: Association }) => React.ReactNode
> = {
  photos: PhotoBand,
  numbers: ByTheNumbers,
  highlights: HomeHighlights,
  explore: ExploreGrid,
};

export function DemoSite({ association }: { association: Association }) {
  const design = designStyles[association.designStyle];

  const style = {
    ...themeStyle(association.accentTheme),
    ...designStyleVars(association.designStyle),
  };

  return (
    <div
      id="top"
      style={style}
      data-type-scale={design.typeScale}
      data-design-style={association.designStyle}
      data-accent-theme={association.accentTheme}
      className="min-h-screen bg-surface font-body text-ink"
    >
      <a
        href="#main-content"
        className="sr-only rounded-pill bg-accent px-5 py-3 font-semibold text-accent-ink focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50"
      >
        Skip to main content
      </a>

      {/*
       * Everything visible sits inside the reveal so the circle opens over the
       * whole page at once. The wash carries its own copy of the disclaimer,
       * so the notice is on screen at every moment of the animation.
       */}
      <IntroReveal association={association}>
        <main id="main-content">
          {/*
           * Disclaimer and hero share one viewport-height column: the hero
           * takes whatever the disclaimer leaves, so its bottom edge — and the
           * scroll cue pinned to it — lands exactly on the fold at every
           * screen size.
           */}
          <div className="flex min-h-[100svh] flex-col">
            <DisclaimerBar />
            <CinemaHero association={association} />
          </div>
          {/* Anchor for the hero's scroll cue: whatever block a design puts
              first, this is where the chevron lands. */}
          <div id="explore" aria-hidden="true" />
          {design.sectionOrder.map((key) => {
            const Section = SECTIONS[key];
            return <Section key={key} association={association} />;
          })}
        </main>

        <SiteFooter association={association} />

        {/*
         * The floating layers live inside the reveal on purpose. They are
         * fixed to the viewport at z-50 — above the intro wash — so if they
         * sat outside they would float over the wordmark during the opening.
         * In here, the ancestor clip hides them until the circle opens.
         *
         * Concierge renders after the sales badge: both end up at z-50 when
         * the guide is open, so DOM order is what puts the working panel in
         * front of the badge rather than behind it.
         *
         * Only the slugs in `CONCIERGE_SLUGS` get one. The real-association
         * concepts must not: those pages assert three facts each, so a guide
         * there would refuse nearly everything and would be putting words in
         * a named association's mouth.
         */}
        <ConceptBadge />
        {CONCIERGE_SLUGS.has(association.slug) ? (
          <Concierge
            slug={association.slug}
            communityName={association.shortName ?? association.name}
            suggestions={suggestedQuestions(association)}
          />
        ) : null}
      </IntroReveal>
    </div>
  );
}
