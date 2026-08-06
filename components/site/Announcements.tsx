import { CalendarClock, Megaphone, Wrench, type LucideIcon } from "lucide-react";
import { Card, IconWell } from "@/components/ui/Card";
import { Section, SectionHeading } from "@/components/ui/Section";
import { SampleTag } from "@/components/ui/SampleTag";
import { sectionIds } from "@/lib/content";
import { designStyles } from "@/lib/design-styles";
import type { Association, AnnouncementKind } from "@/lib/types";

const kindIcons: Record<AnnouncementKind, LucideIcon> = {
  general: Megaphone,
  meeting: CalendarClock,
  maintenance: Wrench,
};

export function Announcements({ association }: { association: Association }) {
  const design = designStyles[association.designStyle];
  if (!association.announcements.length) return null;

  return (
    <Section
      id={sectionIds.announcements}
      tone="surface"
      padding={design.sectionPadding}
      labelledBy="announcements-heading"
    >
      <SectionHeading
        id="announcements-heading"
        eyebrow="Community news"
        eyebrowStyle={design.eyebrow}
        title="Announcements"
        description="Every announcement below is sample content shown to illustrate the layout. A live site would carry the association's own notices."
      />

      <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {association.announcements.map((announcement) => {
          const Icon = kindIcons[announcement.kind];
          return (
            <li key={announcement.id}>
              <Card as="article" className="flex h-full flex-col gap-4 p-6">
                {/* `flex-wrap` drops the sample label below the icon on narrow
                    cards rather than letting the pill overflow. */}
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <IconWell>
                    <Icon className="h-6 w-6" aria-hidden="true" />
                  </IconWell>
                  <SampleTag label={announcement.sampleLabel} tone="secondary" />
                </div>
                <div>
                  <p className="text-sm font-medium text-ink-muted">
                    {announcement.dateLabel}
                  </p>
                  <h3 className="mt-1 font-display text-xl font-semibold leading-snug text-ink">
                    {announcement.title}
                  </h3>
                </div>
                <p className="text-base leading-relaxed text-ink-soft">
                  {announcement.body}
                </p>
              </Card>
            </li>
          );
        })}
      </ul>
    </Section>
  );
}
