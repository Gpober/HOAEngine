import {
  ArrowRight,
  CalendarClock,
  CalendarDays,
  Clock,
  MapPin,
  Megaphone,
  Wrench,
  type LucideIcon,
} from "lucide-react";
import Link from "next/link";
import { Card, IconWell } from "@/components/ui/Card";
import { SampleTag } from "@/components/ui/SampleTag";
import { Section, SectionHeading } from "@/components/ui/Section";
import { designStyles } from "@/lib/design-styles";
import type { Association, AnnouncementKind } from "@/lib/types";

const kindIcons: Record<AnnouncementKind, LucideIcon> = {
  general: Megaphone,
  meeting: CalendarClock,
  maintenance: Wrench,
};

/**
 * The one practical block the homepage keeps: what's new and what's next.
 *
 * This is the reason a resident comes back — the latest notice and the next
 * meeting — shown as a glimpse, not the archive. Two announcements, one
 * meeting, and a link each to the full News & Meetings page. Everything else
 * lives on the sub-pages.
 */
export function HomeHighlights({ association }: { association: Association }) {
  const design = designStyles[association.designStyle];
  const announcements = association.announcements.slice(0, 2);
  const nextMeeting = association.meetings[0];
  const newsHref = `/demo/${association.slug}/news`;

  if (!announcements.length && !nextMeeting) return null;

  return (
    <Section
      id="highlights"
      tone="surface"
      padding={design.sectionPadding}
      labelledBy="highlights-heading"
    >
      <SectionHeading
        id="highlights-heading"
        eyebrow="The latest"
        eyebrowStyle={design.eyebrow}
        title="What's new & what's next"
        description="Sample notices shown to illustrate the layout. A live site carries the association's own news here."
      />

      <div className="grid gap-5 lg:grid-cols-3">
        {announcements.map((announcement) => {
          const Icon = kindIcons[announcement.kind];
          return (
            <Card key={announcement.id} as="article" className="flex h-full flex-col gap-4 p-6">
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
          );
        })}

        {nextMeeting ? (
          <Card as="article" className="flex h-full flex-col gap-4 p-6">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <IconWell>
                <CalendarDays className="h-6 w-6" aria-hidden="true" />
              </IconWell>
              <span className="rounded-pill bg-secondary-soft px-3 py-1 text-xs font-semibold uppercase tracking-eyebrow text-secondary-ink">
                Next meeting
              </span>
            </div>
            <h3 className="font-display text-xl font-semibold leading-snug text-ink">
              {nextMeeting.title}
            </h3>
            <dl className="flex flex-col gap-2.5 text-base text-ink-soft">
              <div className="flex items-start gap-3">
                <dt className="sr-only">Date</dt>
                <CalendarDays className="mt-0.5 h-5 w-5 shrink-0 text-ink-muted" aria-hidden="true" />
                <dd>{nextMeeting.dateLabel}</dd>
              </div>
              <div className="flex items-start gap-3">
                <dt className="sr-only">Time</dt>
                <Clock className="mt-0.5 h-5 w-5 shrink-0 text-ink-muted" aria-hidden="true" />
                <dd>{nextMeeting.timeLabel}</dd>
              </div>
              <div className="flex items-start gap-3">
                <dt className="sr-only">Location</dt>
                <MapPin className="mt-0.5 h-5 w-5 shrink-0 text-ink-muted" aria-hidden="true" />
                <dd>{nextMeeting.locationLabel}</dd>
              </div>
            </dl>
          </Card>
        ) : null}
      </div>

      <div className="mt-8 text-center">
        <Link
          href={newsHref}
          className="inline-flex min-h-[2.75rem] items-center gap-2 font-semibold text-accent no-underline hover:underline"
        >
          All news and the full meeting schedule
          <ArrowRight className="h-5 w-5" aria-hidden="true" />
        </Link>
      </div>
    </Section>
  );
}
