import { PlaceholderScene } from "@/components/ui/CommunityImage";
import { cn } from "@/lib/cn";
import { monogramFor } from "@/lib/content";
import { designStyleVars, designStyles } from "@/lib/design-styles";
import { themeStyle } from "@/lib/themes";
import type { Association } from "@/lib/types";

/**
 * A miniature of the demo homepage, rendered with that demo's own palette and
 * radii. It is a real preview built from the same tokens — not a screenshot —
 * so it can never drift out of date.
 */
export function DemoThumbnail({ association }: { association: Association }) {
  const design = designStyles[association.designStyle];
  const style = {
    ...themeStyle(association.accentTheme),
    ...designStyleVars(association.designStyle),
  };
  const monogram = monogramFor(association);
  const overlay = design.heroLayout === "overlay";
  const stacked = design.heroLayout === "stacked";

  return (
    <div
      aria-hidden="true"
      style={style}
      className="relative aspect-[16/10] w-full overflow-hidden bg-surface"
    >
      {/* Mini header */}
      <div className="flex items-center justify-between gap-2 border-b border-line bg-card px-3 py-2">
        <div className="flex items-center gap-1.5">
          <span className="flex h-4 w-4 items-center justify-center rounded-pill bg-accent-soft text-[6px] font-bold text-accent">
            {monogram}
          </span>
          <span className="h-1.5 w-12 rounded-pill bg-ink/25" />
        </div>
        <div className="flex items-center gap-1">
          <span className="h-1 w-4 rounded-pill bg-ink/15" />
          <span className="h-1 w-4 rounded-pill bg-ink/15" />
          <span className="h-1 w-4 rounded-pill bg-ink/15" />
          <span className="ml-1 h-3 w-8 rounded-pill bg-accent" />
        </div>
      </div>

      {/* Mini hero */}
      <div
        className={cn(
          "relative",
          overlay ? "h-[46%]" : stacked ? "h-[52%]" : "flex h-[46%] gap-2 bg-surface-alt p-3",
        )}
      >
        {overlay ? (
          <>
            <PlaceholderScene
              scene={association.heroImage.placeholder ?? "village"}
              alt=""
            />
            <div className="absolute inset-0 bg-gradient-to-r from-accent/90 to-accent/40" />
            <div className="absolute inset-0 flex flex-col justify-center gap-1.5 p-4">
              <span className="h-2 w-1/2 rounded-pill bg-accent-ink/90" />
              <span className="h-1.5 w-2/3 rounded-pill bg-accent-ink/50" />
              <span className="mt-1 h-3 w-14 rounded-pill bg-secondary-soft" />
            </div>
          </>
        ) : stacked ? (
          <div className="flex h-full flex-col items-center gap-1.5 bg-surface-alt px-4 pt-3">
            <span className="h-2.5 w-2/3 rounded-pill bg-ink/70" />
            <span className="h-1.5 w-1/2 rounded-pill bg-ink/25" />
            <span className="mt-0.5 h-3 w-14 rounded-pill bg-accent" />
            <div className="relative mt-1 w-full flex-1 overflow-hidden rounded-t-card border border-line">
              <PlaceholderScene
                scene={association.heroImage.placeholder ?? "village"}
                alt=""
              />
            </div>
          </div>
        ) : (
          <>
            <div
              className={cn(
                "flex flex-1 flex-col justify-center gap-1.5",
                design.heroFlip && "order-2",
              )}
            >
              <span className="h-2.5 w-4/5 rounded-pill bg-ink/70" />
              <span className="h-1.5 w-full rounded-pill bg-ink/20" />
              <span className="h-1.5 w-3/5 rounded-pill bg-ink/20" />
              <span className="mt-1 h-3 w-14 rounded-pill bg-accent" />
            </div>
            <div
              className={cn(
                "relative w-[44%] overflow-hidden rounded-card border border-line",
                design.heroFlip && "order-1",
              )}
            >
              <PlaceholderScene
                scene={association.heroImage.placeholder ?? "village"}
                alt=""
              />
            </div>
          </>
        )}
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
