import { CalendarDays, Clock, MapPin, Users } from "lucide-react";
import { Card, IconWell } from "@/components/ui/Card";
import { Section, SectionHeading } from "@/components/ui/Section";
import { SampleTag } from "@/components/ui/SampleTag";
import { sampleLabels } from "@/lib/brand";
import { sectionIds } from "@/lib/content";
import { designStyles } from "@/lib/design-styles";
import type { Association, MeetingKind } from "@/lib/types";

const kindLabels: Record<MeetingKind, string> = {
  board: "Board Meeting",
  annual: "Annual Meeting",
  committee: "Committee Meeting",
};

export function UpcomingMeetings({ association }: { association: Association }) {
  const design = designStyles[association.designStyle];
  if (!association.meetings.length) return null;

  return (
    <Section
      id={sectionIds.meetings}
      tone="alt"
      padding={design.sectionPadding}
      labelledBy="meetings-heading"
    >
      <SectionHeading
        id="meetings-heading"
        eyebrow="Meeting dates"
        eyebrowStyle={design.eyebrow}
        title="Upcoming meetings"
        description="Sample schedule only. Official dates, times, and notices are published by the association."
        action={<SampleTag label={sampleLabels.meeting} />}
      />

      <ul className="grid gap-5 lg:grid-cols-3">
        {association.meetings.map((meeting) => (
          <li key={meeting.id}>
            <Card as="article" className="flex h-full flex-col gap-5 p-6">
              <div className="flex items-center gap-3">
                <IconWell>
                  <Users className="h-6 w-6" aria-hidden="true" />
                </IconWell>
                <span className="rounded-pill bg-secondary-soft px-3 py-1 text-xs font-semibold uppercase tracking-eyebrow text-secondary-ink">
                  {kindLabels[meeting.kind]}
                </span>
              </div>

              <h3 className="font-display text-xl font-semibold leading-snug text-ink">
                {meeting.title}
              </h3>

              <dl className="flex flex-col gap-2.5 text-base text-ink-soft">
                <div className="flex items-start gap-3">
                  <dt className="sr-only">Date</dt>
                  <CalendarDays
                    className="mt-0.5 h-5 w-5 shrink-0 text-ink-muted"
                    aria-hidden="true"
                  />
                  <dd>{meeting.dateLabel}</dd>
                </div>
                <div className="flex items-start gap-3">
                  <dt className="sr-only">Time</dt>
                  <Clock
                    className="mt-0.5 h-5 w-5 shrink-0 text-ink-muted"
                    aria-hidden="true"
                  />
                  <dd>{meeting.timeLabel}</dd>
                </div>
                <div className="flex items-start gap-3">
                  <dt className="sr-only">Location</dt>
                  <MapPin
                    className="mt-0.5 h-5 w-5 shrink-0 text-ink-muted"
                    aria-hidden="true"
                  />
                  <dd>{meeting.locationLabel}</dd>
                </div>
              </dl>

              {meeting.note ? (
                <p className="mt-auto border-t border-line pt-4 text-sm leading-relaxed text-ink-muted">
                  {meeting.note}
                </p>
              ) : null}
            </Card>
          </li>
        ))}
      </ul>
    </Section>
  );
}
