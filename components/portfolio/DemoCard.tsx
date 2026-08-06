import { ArrowRight } from "lucide-react";
import { DemoThumbnail } from "@/components/portfolio/DemoThumbnail";
import { ButtonLink } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { locationLabel } from "@/lib/content";
import { designStyleNotes } from "@/lib/design-styles";
import { themeLabels } from "@/lib/themes";
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
        <div>
          <p className="text-xs font-semibold uppercase tracking-eyebrow text-ink-muted">
            {themeLabels[association.accentTheme]}
          </p>
          <h3 className="mt-2 font-display text-2xl font-semibold leading-snug text-ink">
            {association.designName}
          </h3>
        </div>

        <p className="text-base leading-relaxed text-ink-soft">
          {association.designTagline}
        </p>

        <dl className="grid gap-1 text-sm text-ink-muted">
          <div className="flex gap-2">
            <dt className="font-semibold">Sample association:</dt>
            <dd>
              {association.name}
              {location ? ` · ${location}` : ""}
            </dd>
          </div>
          <div className="flex gap-2">
            <dt className="font-semibold">Layout notes:</dt>
            <dd>{designStyleNotes[association.designStyle]}</dd>
          </div>
        </dl>

        <div className="mt-auto pt-2">
          <ButtonLink
            href={`/demo/${association.slug}`}
            size="lg"
            className="w-full"
            aria-label={`View the ${association.designName} demo`}
          >
            View Demo
            <ArrowRight className="h-5 w-5" aria-hidden="true" />
          </ButtonLink>
        </div>
      </div>
    </Card>
  );
}
