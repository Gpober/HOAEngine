import type { Metadata } from "next";
import { brand } from "./brand";
import { locationLabel } from "./content";
import type { Association } from "./types";

/**
 * Placeholder Open Graph image.
 *
 * Replace `public/og/hoa-engine-concept.svg` with a 1200×630 PNG or JPG before
 * sharing links anywhere that renders previews — most social crawlers ignore SVG.
 */
export const placeholderOgImage = {
  url: "/og/hoa-engine-concept.svg",
  width: 1200,
  height: 630,
  alt: `${brand.sampleDesignLabel} — unofficial website concept.`,
};

/**
 * `noindex, nofollow` on every route in this project.
 *
 * These are unofficial concepts about real-world organisations. They must never
 * appear in search results where someone could mistake one for an association's
 * official website. Do not remove this.
 */
export const noIndexRobots: Metadata["robots"] = {
  index: false,
  follow: false,
  nocache: true,
  googleBot: { index: false, follow: false, noimageindex: true },
};

export function demoMetadata(association: Association): Metadata {
  const location = locationLabel(association);
  const where = location ? ` in ${location}` : "";

  const title = `${association.name} — ${association.designName} Concept`;
  const description = `${brand.sampleDesignLabel}. An unofficial ${association.designName.toLowerCase()} website concept for a ${
    association.communityType?.toLowerCase() ?? "community"
  }${where}. Not affiliated with or endorsed by the association.`;

  return {
    title,
    description,
    robots: noIndexRobots,
    alternates: { canonical: `/demo/${association.slug}` },
    openGraph: {
      type: "website",
      title,
      description,
      siteName: `${brand.product} by ${brand.name}`,
      url: `/demo/${association.slug}`,
      images: [placeholderOgImage],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [placeholderOgImage.url],
    },
  };
}
