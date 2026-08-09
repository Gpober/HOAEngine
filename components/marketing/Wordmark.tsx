/* eslint-disable @next/next/no-img-element */

/**
 * The Condo Seen binocular wordmark: CONDO S[ee]N, where the double-e is a
 * pair of binoculars.
 *
 * Served as standalone SVG files rather than inline SVG on purpose: inline
 * <text> elements inherit the page's font stack and sizing rules, which
 * reflowed the letters straight into the binoculars. A file renders in its
 * own document with its own font stack, so the mark always looks exactly as
 * drawn. `tone` picks the navy or white master; the blue e's are identical
 * in both.
 */
export function Wordmark({
  tone,
  className,
  alt = "Condo Seen",
}: {
  tone: "ink" | "white";
  className?: string;
  alt?: string;
}) {
  const src =
    tone === "white"
      ? "/brand/condo-seen-wordmark-dark.png"
      : "/brand/condo-seen-wordmark.png";
  return <img src={src} alt={alt} className={className} />;
}
