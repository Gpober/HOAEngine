import { Card, IconWell } from "@/components/ui/Card";
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

      <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {amenities.map((amenity, index) => {
          const Icon = amenity.icon;
          // Illustrate the first row only, so the grid has visual rhythm
          // without turning into a wall of placeholder art.
          const withImage = index < 3;

          return (
            <li key={amenity.key}>
              <Card className="flex h-full flex-col overflow-hidden">
                {withImage ? (
                  <div className="relative aspect-[16/9] w-full overflow-hidden border-b border-line bg-accent-soft">
                    <PlaceholderScene
                      scene={amenity.placeholder}
                      alt={`Placeholder illustration representing ${amenity.label.toLowerCase()}.`}
                      focus="center"
                    />
                  </div>
                ) : null}
                <div className="flex flex-1 flex-col gap-3 p-6">
                  <IconWell>
                    <Icon className="h-6 w-6" aria-hidden="true" />
                  </IconWell>
                  <h3 className="font-display text-lg font-semibold text-ink">
                    {amenity.label}
                  </h3>
                  <p className="text-base leading-relaxed text-ink-soft">
                    {amenity.blurb}
                  </p>
                </div>
              </Card>
            </li>
          );
        })}
      </ul>
    </Section>
  );
}
