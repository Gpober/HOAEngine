import type { MetadataRoute } from "next";

/**
 * Belt and braces alongside the per-page `noindex` metadata.
 *
 * These are unofficial concepts about real-world organisations — they must not
 * be crawled or indexed anywhere. Do not relax this.
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [{ userAgent: "*", disallow: "/" }],
  };
}
