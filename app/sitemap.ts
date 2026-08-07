import type { MetadataRoute } from "next";
import { site } from "@/lib/site";

/**
 * Indexable pages only. Demo concepts are deliberately excluded — they are
 * `noindex` and disallowed in robots.txt, so listing them here would be
 * contradictory.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: `${site.url}/`,
      changeFrequency: "monthly",
      priority: 1,
    },
  ];
}
