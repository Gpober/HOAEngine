import { ArrowRight, MapPin, Phone } from "lucide-react";
import { ButtonLink } from "@/components/ui/Button";
import { CommunityImage } from "@/components/ui/CommunityImage";
import { Container } from "@/components/ui/Container";
import { SampleTag } from "@/components/ui/SampleTag";
import { cn } from "@/lib/cn";
import { locationLabel, sectionIds } from "@/lib/content";
import { designStyles } from "@/lib/design-styles";
import type { Association } from "@/lib/types";

export function HeroSection({ association }: { association: Association }) {
  const design = designStyles[association.designStyle];

  switch (design.heroLayout) {
    case "overlay":
      return <OverlayHero association={association} />;
    case "stacked":
      return <StackedHero association={association} />;
    case "panel":
      return <PanelHero association={association} />;
    case "split":
    default:
      return <SplitHero association={association} flip={design.heroFlip} />;
  }
}

/* -------------------------------------------------------------------------- */
/*  Shared pieces                                                              */
/* -------------------------------------------------------------------------- */

function HeroEyebrow({
  association,
  tone = "default",
}: {
  association: Association;
  tone?: "default" | "onDark";
}) {
  const location = locationLabel(association);
  const bits = [location, association.communityType].filter(Boolean);
  if (!bits.length) return null;

  return (
    <p
      className={cn(
        "flex flex-wrap items-center gap-x-2 gap-y-1 text-sm font-semibold uppercase tracking-eyebrow",
        tone === "onDark" ? "text-accent-ink/90" : "text-ink-muted",
      )}
    >
      <MapPin className="h-4 w-4" aria-hidden="true" />
      {bits.map((bit, index) => (
        <span key={bit} className="flex items-center gap-2">
          {index > 0 ? (
            <span aria-hidden="true" className="opacity-50">
              ·
            </span>
          ) : null}
          {bit}
        </span>
      ))}
    </p>
  );
}

function HeroActions({
  tone = "default",
  size = "lg",
}: {
  tone?: "default" | "onDark";
  size?: "md" | "lg";
}) {
  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap">
      <ButtonLink
        href={`#${sectionIds.documents}`}
        size={size}
        variant={tone === "onDark" ? "secondary" : "primary"}
      >
        Resident Resources
        <ArrowRight className="h-5 w-5" aria-hidden="true" />
      </ButtonLink>
      <ButtonLink
        href={`#${sectionIds.contact}`}
        size={size}
        variant="outline"
        className={tone === "onDark" ? "border-card/60 bg-card/95" : undefined}
      >
        <Phone className="h-5 w-5" aria-hidden="true" />
        Contact Management
      </ButtonLink>
    </div>
  );
}

function HeroTitle({
  association,
  className,
}: {
  association: Association;
  className?: string;
}) {
  return (
    <h1
      id="hero-heading"
      className={cn(
        "font-display text-4xl font-semibold leading-[1.08] sm:text-5xl lg:text-6xl",
        className,
      )}
    >
      {association.name}
    </h1>
  );
}

/* -------------------------------------------------------------------------- */
/*  Layout 1 — split                                                           */
/* -------------------------------------------------------------------------- */

function SplitHero({
  association,
  flip = false,
}: {
  association: Association;
  flip?: boolean;
}) {
  return (
    <section aria-labelledby="hero-heading" className="hoa-grain bg-surface-alt">
      <Container className="grid items-center gap-10 py-14 md:py-20 lg:grid-cols-2 lg:gap-16">
        <div className={cn("flex flex-col gap-6", flip && "lg:order-2")}>
          <HeroEyebrow association={association} />
          <HeroTitle association={association} className="text-ink" />
          <p className="max-w-prose text-lg leading-relaxed text-ink-soft">
            {association.shortDescription}
          </p>
          <HeroActions />
          <SampleTag label="Demo homepage concept" className="self-start" />
        </div>
        <div className={cn(flip && "lg:order-1")}>
          <CommunityImage
            image={association.heroImage}
            priority
            sizes="(min-width: 1024px) 46vw, 92vw"
            className="aspect-[4/3] w-full shadow-lift"
          />
        </div>
      </Container>
    </section>
  );
}

/* -------------------------------------------------------------------------- */
/*  Layout 2 — full-bleed overlay                                              */
/* -------------------------------------------------------------------------- */

function OverlayHero({ association }: { association: Association }) {
  return (
    <section aria-labelledby="hero-heading" className="relative isolate">
      <div className="absolute inset-0">
        <CommunityImage
          image={association.heroImage}
          priority
          rounded={false}
          sizes="100vw"
          // A letterbox frame this wide would show only foreground if cropped
          // from the bottom, so keep the middle of the scene.
          focus="center"
          // The scrim is opaque on the left, so keep the chip readable.
          labelAlign="right"
          className="h-full w-full"
        />
      </div>
      {/*
        Scrim keeps overlaid text at AA contrast regardless of the image. It
        holds ≥90% opacity across the whole text column (the left half) and only
        then falls away, so the photography still reads on the right.

        Keep every stop on Tailwind's opacity scale: `via-accent/88` compiles to
        nothing, which silently drops the middle stop and halves the contrast.
      */}
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-gradient-to-r from-accent/95 via-accent/90 to-accent/20"
      />
      <Container className="on-accent relative flex min-h-[32rem] flex-col justify-center gap-6 py-20 md:min-h-[38rem] md:py-28">
        <HeroEyebrow association={association} tone="onDark" />
        <HeroTitle association={association} className="max-w-3xl text-accent-ink" />
        {/* Narrower than `max-w-prose` so the copy stays inside the dark
            portion of the scrim at every width. */}
        <p className="max-w-xl text-lg leading-relaxed text-accent-ink">
          {association.shortDescription}
        </p>
        <HeroActions tone="onDark" />
        <SampleTag label="Demo homepage concept" tone="onDark" className="self-start" />
      </Container>
    </section>
  );
}

/* -------------------------------------------------------------------------- */
/*  Layout 3 — centred stack (large type, active-adult friendly)               */
/* -------------------------------------------------------------------------- */

function StackedHero({ association }: { association: Association }) {
  return (
    <section aria-labelledby="hero-heading" className="hoa-grain bg-surface-alt">
      <Container className="flex flex-col items-center gap-7 py-14 text-center md:py-20">
        <HeroEyebrow association={association} />
        <HeroTitle association={association} className="max-w-4xl text-ink" />
        <p className="max-w-prose text-lg leading-relaxed text-ink-soft md:text-xl">
          {association.shortDescription}
        </p>
        <div className="flex justify-center">
          <HeroActions />
        </div>
        <SampleTag label="Demo homepage concept" />
        <CommunityImage
          image={association.heroImage}
          priority
          sizes="(min-width: 1024px) 76rem, 92vw"
          focus="center"
          className="mt-4 aspect-[16/9] w-full shadow-lift"
        />
      </Container>
    </section>
  );
}

/* -------------------------------------------------------------------------- */
/*  Layout 4 — structured panel                                                */
/* -------------------------------------------------------------------------- */

function PanelHero({ association }: { association: Association }) {
  const facts = [
    association.communityType ? { label: "Property type", value: association.communityType } : null,
    association.residenceCount
      ? { label: "Residences", value: association.residenceCount.toLocaleString("en-US") }
      : null,
    association.establishedYear
      ? { label: "Established", value: String(association.establishedYear) }
      : null,
  ].filter(Boolean) as { label: string; value: string }[];

  return (
    <section aria-labelledby="hero-heading" className="bg-surface-alt">
      <Container className="py-10 md:py-14">
        <div className="grid gap-6 lg:grid-cols-12">
          <div className="flex flex-col gap-6 rounded-card border border-line bg-card p-7 shadow-soft md:p-10 lg:col-span-7">
            <HeroEyebrow association={association} />
            <HeroTitle association={association} className="text-ink" />
            <p className="max-w-prose text-lg leading-relaxed text-ink-soft">
              {association.shortDescription}
            </p>
            <HeroActions />
            <SampleTag label="Demo homepage concept" className="self-start" />
          </div>
          <div className="flex flex-col gap-6 lg:col-span-5">
            <CommunityImage
              image={association.heroImage}
              priority
              sizes="(min-width: 1024px) 38vw, 92vw"
              className="aspect-[4/3] w-full flex-1 shadow-lift"
            />
            {facts.length ? (
              <dl className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-1 xl:grid-cols-3">
                {facts.map((fact) => (
                  <div
                    key={fact.label}
                    className="rounded-card border border-line bg-card px-4 py-3 shadow-soft"
                  >
                    <dt className="text-xs font-semibold uppercase tracking-eyebrow text-ink-muted">
                      {fact.label}
                    </dt>
                    <dd className="mt-1 font-display text-lg font-semibold text-ink">
                      {fact.value}
                    </dd>
                  </div>
                ))}
              </dl>
            ) : null}
          </div>
        </div>
      </Container>
    </section>
  );
}
