import type { ReactNode } from "react";
import { ConceptBadge } from "@/components/ConceptBadge";
import { Concierge } from "@/components/demo/Concierge";
import { CONCIERGE_SLUGS } from "@/lib/concierge/enabled";
import { suggestedQuestions } from "@/lib/concierge/context";
import { CinemaNav } from "@/components/site/CinemaNav";
import { DisclaimerBar } from "@/components/site/DisclaimerBar";
import { PageHero } from "@/components/site/PageHero";
import { SiteFooter } from "@/components/site/SiteFooter";
import { designStyleVars, designStyles } from "@/lib/design-styles";
import { themeStyle } from "@/lib/themes";
import type { Association } from "@/lib/types";

/**
 * The frame every demo sub-page shares: the community's palette and type, the
 * disclaimer, the solid navigation, a quiet title band, and the footer. The
 * page itself supplies only the sections that belong to it.
 *
 * No intro reveal here — the cinematic opening belongs to the homepage alone.
 * A visitor moving between Documents and Contact should not sit through the
 * curtain again on every click.
 */
export function DemoSubPage({
  association,
  title,
  lede,
  children,
}: {
  association: Association;
  title: string;
  lede?: string;
  children: ReactNode;
}) {
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
      <CinemaNav association={association} variant="solid" />

      <main id="main-content">
        <PageHero association={association} title={title} lede={lede} />
        {children}
      </main>

      <SiteFooter association={association} />

      {/*
       * Same floating layers as the homepage, same DOM order: the concierge
       * renders after the badge so the working panel wins when both sit at
       * z-50 with the guide open.
       */}
      <ConceptBadge />
      {CONCIERGE_SLUGS.has(association.slug) ? (
        <Concierge
          slug={association.slug}
          communityName={association.shortName ?? association.name}
          suggestions={suggestedQuestions(association)}
        />
      ) : null}
    </div>
  );
}
