import { ConceptBadge } from "@/components/ConceptBadge";
import { Amenities } from "@/components/site/Amenities";
import { Announcements } from "@/components/site/Announcements";
import { CommunityOverview } from "@/components/site/CommunityOverview";
import { DisclaimerBar } from "@/components/site/DisclaimerBar";
import { DocumentsAndForms } from "@/components/site/DocumentsAndForms";
import { FaqSection } from "@/components/site/FaqSection";
import { HeroSection } from "@/components/site/HeroSection";
import { ManagementContact } from "@/components/site/ManagementContact";
import { QuickLinks } from "@/components/site/QuickLinks";
import { SiteFooter } from "@/components/site/SiteFooter";
import { SiteHeader } from "@/components/site/SiteHeader";
import { UpcomingMeetings } from "@/components/site/UpcomingMeetings";
import { designStyleVars, designStyles } from "@/lib/design-styles";
import { themeStyle } from "@/lib/themes";
import type { Association } from "@/lib/types";

/**
 * One association configuration in, one complete homepage out.
 *
 * The palette and the typography personality arrive as CSS custom properties on
 * this wrapper, so all five demos share exactly the same component tree.
 */
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

      <DisclaimerBar />
      <SiteHeader association={association} />

      <main id="main-content">
        <HeroSection association={association} />
        <QuickLinks association={association} />
        <CommunityOverview association={association} />
        <Announcements association={association} />
        <UpcomingMeetings association={association} />
        <DocumentsAndForms association={association} />
        <Amenities association={association} />
        <ManagementContact association={association} />
        <FaqSection association={association} />
      </main>

      <SiteFooter association={association} />
      <ConceptBadge />
    </div>
  );
}
