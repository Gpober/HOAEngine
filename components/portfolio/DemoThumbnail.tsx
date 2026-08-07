import Image from "next/image";
import { PlaceholderScene } from "@/components/ui/CommunityImage";
import { designStyleVars } from "@/lib/design-styles";
import { themeStyle } from "@/lib/themes";
import type { Association, CommunityImage } from "@/lib/types";

/**
 * The hero slot inside the miniature. Real photography when the demo has it,
 * the generated scene otherwise — so the preview matches the page it previews.
 *
 * Every call site is inside a `relative` box, which `fill` requires.
 */
function ThumbHero({ image }: { image: CommunityImage }) {
  if (image.src) {
    return (
      <Image
        src={image.src}
        alt=""
        fill
        sizes="(min-width: 1280px) 15vw, (min-width: 768px) 25vw, 45vw"
        className="object-cover"
      />
    );
  }
  return <PlaceholderScene scene={image.placeholder ?? "village"} alt="" />;
}

/**
 * A miniature of the demo homepage, rendered with that demo's own palette and
 * radii. It is a real preview built from the same tokens — not a screenshot —
 * so it can never drift out of date.
 *
 * Every demo now opens the same way — full-bleed photograph, split navigation,
 * thin letterspaced wordmark — so the miniature shows that opening, and the
 * palette, radii, and section row below carry the differences.
 */
export function DemoThumbnail({ association }: { association: Association }) {
  const style = {
    ...themeStyle(association.accentTheme),
    ...designStyleVars(association.designStyle),
  };

  return (
    <div
      aria-hidden="true"
      style={style}
      className="relative aspect-[16/10] w-full overflow-hidden bg-surface"
    >
      {/* Mini cinematic hero: photograph edge to edge, nav over it. */}
      <div className="relative h-[62%]">
        <ThumbHero image={association.heroImage} />
        <div className="absolute inset-0 bg-gradient-to-b from-black/55 via-black/15 to-black/40" />

        {/* Mini split nav: links left, wordmark centre, links right. */}
        <div className="absolute inset-x-0 top-0 flex items-center justify-between gap-2 px-3 py-2">
          <div className="flex items-center gap-1">
            <span className="h-1 w-4 rounded-pill bg-white/60" />
            <span className="h-1 w-4 rounded-pill bg-white/60" />
          </div>
          <span className="h-1.5 w-16 rounded-pill bg-white/90" />
          <div className="flex items-center gap-1">
            <span className="h-1 w-4 rounded-pill bg-white/60" />
            <span className="h-1 w-4 rounded-pill bg-white/60" />
          </div>
        </div>

        {/* Mini headline: thin centred lines with the divider beneath. */}
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-1.5 px-6">
          <span className="h-1 w-1/3 rounded-pill bg-white/60" />
          <span className="h-2.5 w-2/3 rounded-pill bg-white/95" />
          <span className="mt-0.5 h-px w-8 bg-white/70" />
        </div>

        {/* Mini scroll cue. */}
        <span className="absolute bottom-1.5 left-1/2 h-1 w-2 -translate-x-1/2 rounded-pill bg-white/70" />
      </div>

      {/* Mini card row */}
      <div className="grid grid-cols-3 gap-2 p-3">
        {[0, 1, 2].map((index) => (
          <div
            key={index}
            className="flex flex-col gap-1 rounded-card border border-line bg-card p-2"
          >
            <span className="h-3 w-3 rounded-pill bg-accent-soft" />
            <span className="h-1 w-full rounded-pill bg-ink/20" />
            <span className="h-1 w-2/3 rounded-pill bg-ink/10" />
          </div>
        ))}
      </div>
    </div>
  );
}
