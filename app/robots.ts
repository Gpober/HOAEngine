import type { MetadataRoute } from "next";
import { site } from "@/lib/site";

/**
 * The marketing site is meant to be found; the demo concepts are not.
 *
 * `/demo` and everything under it names real associations. If those pages
 * ranked, someone searching for an association would find an unofficial mockup
 * of it — which is exactly what the sample-design labelling exists to prevent.
 * They stay disallowed here and carry `noindex` in their own metadata, so the
 * rule survives even if a crawler ignores this file.
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/demo", "/demo/"],
      },
    ],
    sitemap: `${site.url}/sitemap.xml`,
    host: site.url,
  };
}
