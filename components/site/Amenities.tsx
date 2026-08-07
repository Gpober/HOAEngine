import { PlaceholderScene } from "@/components/ui/CommunityImage";
import { Section, SectionHeading } from "@/components/ui/Section";
import { getAmenities } from "@/lib/amenities";
import { sectionIds } from "@/lib/content";
import { designStyles } from "@/lib/design-styles";
import type { Association } from "@/lib/types";

/**
 * Amenity cards.
 *
 * Only the amenities listed in an association's configuration are rendered —
 * nothing is added to make the grid look fuller.
 */
export function Amenities({ association }: { association: Association }) {
  const design = designStyles[association.designStyle];
  const amenities = getAmenities(association.amenities);
  if (!amenities.length) return null;

  return (
    <Section
      id={sectionIds.amenities}
      tone="alt"
      padding={design.sectionPadding}
      labelledBy="amenities-heading"
    >
      <SectionHeading
        id="amenities-heading"
        eyebrow="Shared spaces"
        eyebrowStyle={design.eyebrow}
        title="Community amenities"
        description="Amenities shown here come from this concept's configuration. Hours, rules, and reservations are set by the association."
      />

      {/*
       * Every amenity is the same tile: its scene fills the frame, a scrim
       * carries the label over it. Previously only the first three were
       * illustrated and the rest were bare cards, so the grid came out ragged —
       * some tall with art, some short without. Uniform tiles are both the
       * symmetric answer and the one that actually looks composed.
       *
       * The artwork is generated and theme-tinted, so it costs nothing, needs
       * no licence, and takes each design's palette automatically.
       */}
      <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {amenities.map((amenity) => {
          const Icon = amenity.icon;
          return (
            <li key={amenity.key}>
              <div className="relative isolate h-full overflow-hidden rounded-card border border-line bg-accent-soft">
                <div className="relative aspect-[4/3] w-full">
                  <PlaceholderScene
                    scene={amenity.placeholder}
                    alt={`Illustration representing ${amenity.label.toLowerCase()}.`}
                    focus="center"
                  />
                  {/*
                   * Safe by construction rather than by tuning. The text sits
                   * in the bottom of the tile, and the scrim holds >=85% ink
                   * across that whole band before it fades — so the worst case
                   * is 0.85 ink over pure white, which is rgb(54,68,88) and
                   * about 8:1 against white text. That bound holds for every
                   * palette and every generated scene without needing to be
                   * re-checked when either changes.
                   */}
                  <div
                    aria-hidden="true"
                    className="absolute inset-0"
                    style={{
                      backgroundImage:
                        "linear-gradient(to top, rgb(var(--hoa-ink) / 0.95) 0%, rgb(var(--hoa-ink) / 0.92) 40%, rgb(var(--hoa-ink) / 0.85) 55%, rgb(var(--hoa-ink) / 0) 100%)",
                    }}
                  />
                  <div className="absolute inset-x-0 bottom-0 p-5">
                    <span
                      aria-hidden="true"
                      className="mb-3 inline-flex h-10 w-10 items-center justify-center rounded-pill bg-accent-ink/15 text-accent-ink backdrop-blur-sm"
                    >
                      <Icon className="h-5 w-5" />
                    </span>
                    <h3 className="font-display text-xl font-semibold text-accent-ink">
                      {amenity.label}
                    </h3>
                    <p className="mt-1 text-sm font-medium leading-relaxed text-accent-ink/90">
                      {amenity.blurb}
                    </p>
                  </div>
                </div>
              </div>
            </li>
          );
        })}
      </ul>
    </Section>
  );
}
