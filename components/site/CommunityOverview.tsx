import { Building2, CalendarRange, Home, Landmark, MapPin, Sparkles } from "lucide-react";
import { Card, IconWell } from "@/components/ui/Card";
import { CommunityImage } from "@/components/ui/CommunityImage";
import { Section, SectionHeading } from "@/components/ui/Section";
import { getAmenities } from "@/lib/amenities";
import { locationLabel, sectionIds } from "@/lib/content";
import { designStyles } from "@/lib/design-styles";
import type { Association } from "@/lib/types";

/**
 * Community facts.
 *
 * Only fields present in the configuration are rendered — a missing residence
 * count or founding year simply drops out of the list rather than being
 * guessed at or filled with a plausible-looking number.
 */
export function CommunityOverview({ association }: { association: Association }) {
  const design = designStyles[association.designStyle];
  const amenities = getAmenities(association.amenities);
  const location = locationLabel(association);

  const facts = [
    association.communityType && {
      icon: Home,
      label: "Property type",
      value: association.communityType,
    },
    location && { icon: MapPin, label: "City and state", value: location },
    association.residenceCount && {
      icon: Building2,
      label: "Number of residences",
      value: association.residenceCount.toLocaleString("en-US"),
    },
    association.establishedYear && {
      icon: CalendarRange,
      label: "Year established",
      value: String(association.establishedYear),
    },
    amenities.length > 0 && {
      icon: Sparkles,
      label: "Amenities",
      value: amenities
        .slice(0, 3)
        .map((amenity) => amenity.label)
        .join(", ") + (amenities.length > 3 ? ` +${amenities.length - 3} more` : ""),
    },
    association.managementCompany && {
      icon: Landmark,
      label: "Management company",
      value: association.managementCompany,
    },
  ].filter(Boolean) as {
    icon: typeof Home;
    label: string;
    value: string;
  }[];

  return (
    <Section
      id={sectionIds.overview}
      tone="alt"
      padding={design.sectionPadding}
      labelledBy="overview-heading"
    >
      <SectionHeading
        id="overview-heading"
        eyebrow="Community information"
        eyebrowStyle={design.eyebrow}
        title="About the community"
        description={association.shortDescription}
      />

      <div>
        <div>
          {facts.length ? (
            <dl className="grid gap-4 sm:grid-cols-2">
              {facts.map((fact) => {
                const Icon = fact.icon;
                return (
                  <Card key={fact.label} as="div" className="flex items-start gap-4 p-5">
                    <IconWell tone="secondary" className="h-11 w-11">
                      <Icon className="h-5 w-5" aria-hidden="true" />
                    </IconWell>
                    <div className="min-w-0">
                      <dt className="text-xs font-semibold uppercase tracking-eyebrow text-ink-muted">
                        {fact.label}
                      </dt>
                      <dd className="mt-1 text-base font-semibold leading-snug text-ink">
                        {fact.value}
                      </dd>
                    </div>
                  </Card>
                );
              })}
            </dl>
          ) : (
            <Card className="p-6">
              <p className="text-base text-ink-soft">
                Community details will appear here once the association supplies them.
              </p>
            </Card>
          )}

          <p className="mx-auto mt-6 max-w-prose text-center text-sm leading-relaxed text-ink-muted">
            Only details supplied for this concept are shown. Anything the association
            has not provided is left blank rather than filled in.
          </p>
        </div>

      </div>

      {/*
       * The photographs get the full width and equal weight.
       *
       * They used to sit in a five-column sidebar beside the facts, which laid
       * three of them out one under another — 457x313 each, running a thousand
       * pixels down the page while the text column ended level with the first
       * one. Good photography rendered as a list of thumbnails.
       *
       * Equal columns, one shared aspect ratio, one gap: the three read as a
       * set rather than a stack. The breakpoint goes straight from one column
       * to three and never passes through two, because three items in two
       * columns leaves an orphan on the second row — which is the asymmetry
       * that makes a gallery look accidental.
       */}
      {association.galleryImages.length ? (
        <ul className="mt-10 grid gap-5 md:grid-cols-3 md:gap-6">
          {association.galleryImages.slice(0, 3).map((image) => (
            <li key={image.alt}>
              <figure className="flex h-full flex-col">
                <CommunityImage
                  image={image}
                  sizes="(min-width: 768px) 31vw, 92vw"
                  className="aspect-[4/3] w-full"
                />
                {image.caption ? (
                  <figcaption className="mt-3 text-center text-sm font-semibold uppercase tracking-eyebrow text-ink-muted">
                    {image.caption}
                  </figcaption>
                ) : null}
              </figure>
            </li>
          ))}
        </ul>
      ) : null}
    </Section>
  );
}
