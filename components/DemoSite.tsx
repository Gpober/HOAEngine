import type { ReactNode } from "react";
import { ConceptBadge } from "@/components/ConceptBadge";
import { Concierge } from "@/components/demo/Concierge";
import { CONCIERGE_SLUGS } from "@/lib/concierge/enabled";
import { suggestedQuestions } from "@/lib/concierge/context";
import { ByTheNumbers } from "@/components/site/ByTheNumbers";
import { CinemaHero } from "@/components/site/CinemaHero";
import { CinemaNav } from "@/components/site/CinemaNav";
import { DisclaimerBar } from "@/components/site/DisclaimerBar";
import { EditorialHero } from "@/components/site/EditorialHero";
import { ExploreGrid } from "@/components/site/ExploreGrid";
import { HomeHighlights } from "@/components/site/HomeHighlights";
import { IntroReveal } from "@/components/site/IntroReveal";
import { PhotoBand } from "@/components/site/PhotoBand";
import { SiteFooter } from "@/components/site/SiteFooter";
import { WarmHero } from "@/components/site/WarmHero";
import { designStyleVars, designStyles, type SectionKey } from "@/lib/design-styles";
import { themeStyle } from "@/lib/themes";
import type { Association } from "@/lib/types";

/**
 * The demo homepage: the showpiece and nothing else.
 *
 * Opening, photography, numbers, a glimpse of what's new, and doors to the
 * rest of the site. Everything practical lives on its own page (see
 * `DemoSubPage` and `app/demo/[slug]/*`).
 *
 * Two axes keep five concepts from reading as one template: the design's
 * `opening` decides how the page *arrives* (cinema curtain, editorial cover,
 * or a warm welcome), and its `sectionOrder` decides what a visitor sees
 * first below it. Palette and typography ride in as CSS custom properties on
 * the wrapper.
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

  /*
   * The opening block. The full-viewport openings share one viewport-height
   * column with the disclaimer so their bottom edge — and the scroll cue —
   * lands exactly on the fold. The warm opening has no fold to hit: the nav
   * is solid from the first paint and the page simply begins.
   */
  let openingBlock: ReactNode;
  if (design.opening === "editorial") {
    openingBlock = (
      <div className="flex min-h-[100svh] flex-col">
        <DisclaimerBar />
        <EditorialHero association={association} />
      </div>
    );
  } else if (design.opening === "warm") {
    openingBlock = (
      <>
        <DisclaimerBar />
        <CinemaNav association={association} variant="solid" layout="corner" />
        <WarmHero association={association} />
      </>
    );
  } else {
    openingBlock = (
      <div className="flex min-h-[100svh] flex-col">
        <DisclaimerBar />
        <CinemaHero association={association} />
      </div>
    );
  }

  const page = (
    <>
      <main id="main-content">
        {openingBlock}
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
       * Floating layers. Under the cinema opening they must live inside the
       * reveal: they are fixed at z-50 — above the intro wash — and outside
       * it they would float over the wordmark during the opening. The other
       * openings have no wash, so placement only matters for DOM order:
       * Concierge renders after the badge so the working panel wins when
       * both sit at z-50 with the guide open.
       *
       * Only the slugs in `CONCIERGE_SLUGS` get a guide. The real-association
       * concepts must not: those pages assert three facts each, so a guide
       * there would refuse nearly everything and would be putting words in a
       * named association's mouth.
       */}
      <ConceptBadge />
      {CONCIERGE_SLUGS.has(association.slug) ? (
        <Concierge
          slug={association.slug}
          communityName={association.shortName ?? association.name}
          suggestions={suggestedQuestions(association)}
        />
      ) : null}
    </>
  );

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

      {design.opening === "cinema" ? (
        <IntroReveal association={association}>{page}</IntroReveal>
      ) : (
        page
      )}
    </div>
  );
}
