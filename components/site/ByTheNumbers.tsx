import { Container } from "@/components/ui/Container";
import { getAmenities } from "@/lib/amenities";
import type { Association } from "@/lib/types";

/**
 * The community in four numbers, at a size you cannot miss.
 *
 * Every figure already appeared on the page inside a small card with an icon
 * and a caption. Nothing was missing — it was just quiet. A board deciding
 * whether this looks like their community does not read a definition list.
 *
 * Only figures actually supplied are shown, and the grid sizes itself to how
 * many survive, so a community with two facts gets two columns rather than two
 * items and two gaps.
 */
export function ByTheNumbers({ association }: { association: Association }) {
  const amenities = getAmenities(association.amenities);

  const stats = [
    association.residenceCount && {
      value: association.residenceCount.toLocaleString("en-US"),
      label: "Residences",
    },
    association.establishedYear && {
      value: String(association.establishedYear),
      label: "Established",
    },
    amenities.length > 0 && {
      value: String(amenities.length),
      label: amenities.length === 1 ? "Shared amenity" : "Shared amenities",
    },
    association.state && {
      value: association.state,
      label: association.city ?? "Location",
    },
  ].filter(Boolean) as { value: string; label: string }[];

  if (stats.length < 2) return null;

  return (
    /*
     * Extra bottom padding clears the floating concept badge.
     *
     * The badge is fixed to the bottom-right of the viewport, so whatever
     * section happens to be scrolled to the bottom sits under it. On this band
     * that landed squarely on the fourth stat's label — the state showed but
     * the city beneath it was covered. The figures are the point of the band,
     * so it gives way rather than the badge.
     */
    <section className="on-accent bg-accent pb-28 pt-14 text-accent-ink md:pb-32 md:pt-20">
      <Container>
        <dl
          /*
           * Two columns on a phone, one per stat from `sm` up. Four across at
           * 360px leaves ~50px columns, and an uppercase letterspaced label
           * like "AMENITIES" is wider than that as a single unbreakable word —
           * the page grew a horizontal scrollbar on the enlarged type scale.
           */
          className="grid grid-cols-2 gap-10 text-center sm:gap-8 sm:[grid-template-columns:repeat(var(--stat-count),minmax(0,1fr))]"
          style={{ "--stat-count": Math.min(stats.length, 4) } as React.CSSProperties}
        >
          {stats.map((stat) => (
            <div key={stat.label}>
              <dd className="font-display text-4xl font-semibold leading-none md:text-6xl">
                {stat.value}
              </dd>
              <dt className="mt-3 text-xs font-semibold uppercase tracking-eyebrow text-accent-ink/75 md:text-sm">
                {stat.label}
              </dt>
            </div>
          ))}
        </dl>
      </Container>
    </section>
  );
}
