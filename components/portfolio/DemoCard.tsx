import { ArrowRight } from "lucide-react";
import { DemoThumbnail } from "@/components/portfolio/DemoThumbnail";
import { ButtonLink } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { locationLabel } from "@/lib/content";
import type { Association } from "@/lib/types";

export function DemoCard({ association }: { association: Association }) {
  const location = locationLabel(association);

  return (
    <Card
      as="article"
      interactive
      className="flex h-full flex-col overflow-hidden"
    >
      <div className="border-b border-line">
        <DemoThumbnail association={association} />
      </div>

      <div className="flex flex-1 flex-col gap-4 p-6">
        {/*
         * The community is the subject here, not the design that renders it.
         * The palette name and layout notes that used to lead this card
         * described a template being picked from a shelf — accurate, and
         * exactly the wrong impression for something sold as built for one
         * association. The design tokens still drive every pixel; they are
         * simply not what the card is about.
         */}
        <div>
          <h3 className="font-display text-2xl font-semibold leading-snug text-ink">
            {association.shortName ?? association.name}
          </h3>
          {location ? (
            <p className="mt-1 text-sm text-ink-muted">{location}</p>
          ) : null}
        </div>

        <p className="text-base leading-relaxed text-ink-soft">
          {association.shortDescription}
        </p>

        <div className="mt-auto pt-2">
          <ButtonLink
            href={`/demo/${association.slug}`}
            size="lg"
            className="w-full"
            aria-label={`View the concept for ${association.shortName ?? association.name}`}
          >
            View the concept
            <ArrowRight className="h-5 w-5" aria-hidden="true" />
          </ButtonLink>
        </div>
      </div>
    </Card>
  );
}
