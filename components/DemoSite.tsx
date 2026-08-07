import { ConceptBadge } from "@/components/ConceptBadge";
import { Concierge } from "@/components/demo/Concierge";
import { CONCIERGE_SLUGS } from "@/lib/concierge/enabled";
import { suggestedQuestions } from "@/lib/concierge/context";
import { Amenities } from "@/components/site/Amenities";
import { ByTheNumbers } from "@/components/site/ByTheNumbers";
import { PhotoBand } from "@/components/site/PhotoBand";
import { Announcements } from "@/components/site/Announcements";
import { CommunityOverview } from "@/components/site/CommunityOverview";
import { DisclaimerBar } from "@/components/site/DisclaimerBar";
import { DocumentsAndForms } from "@/components/site/DocumentsAndForms";
import { FaqSection } from "@/components/site/FaqSection";
import { CinemaHero } from "@/components/site/CinemaHero";
import { IntroReveal } from "@/components/site/IntroReveal";
import { ManagementContact } from "@/components/site/ManagementContact";
import { QuickLinks } from "@/components/site/QuickLinks";
import { SiteFooter } from "@/components/site/SiteFooter";
import { UpcomingMeetings } from "@/components/site/UpcomingMeetings";
import { designStyleVars, designStyles, type SectionKey } from "@/lib/design-styles";
import { themeStyle } from "@/lib/themes";
import type { Association } from "@/lib/types";

/**
 * One association configuration in, one complete homepage out.
 *
 * The palette and typography arrive as CSS custom properties on this wrapper.
 * The *order* of the page comes from the design's `sectionOrder`, which is what
 * stops five sites built from one component tree reading as one template in
 * five colours — the first thing below the hero differs per design, and that is
 * the thing a visitor actually registers.
 */
/** Keyed so a design's `sectionOrder` is the only thing deciding what renders. */
const SECTIONS: Record<
  SectionKey,
  ({ association }: { association: Association }) => React.ReactNode
> = {
  photos: PhotoBand,
  numbers: ByTheNumbers,
  quickLinks: QuickLinks,
  overview: CommunityOverview,
  announcements: Announcements,
  meetings: UpcomingMeetings,
  documents: DocumentsAndForms,
  amenities: Amenities,
  contact: ManagementContact,
  faq: FaqSection,
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
        <DisclaimerBar />

        <main id="main-content">
          <CinemaHero association={association} />
          {/* Anchor for the hero's scroll cue: whatever section a design puts
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
