import type { ReactNode } from "react";
import { cn } from "@/lib/cn";
import { Container } from "./Container";

type Tone = "surface" | "alt" | "accent";

const tones: Record<Tone, string> = {
  surface: "bg-surface text-ink",
  alt: "bg-surface-alt text-ink",
  accent: "bg-accent text-accent-ink on-accent",
};

export function Section({
  id,
  tone = "surface",
  padding = "py-16 md:py-24",
  className,
  labelledBy,
  children,
}: {
  id?: string;
  tone?: Tone;
  padding?: string;
  className?: string;
  /** id of the heading that names this section, for assistive technology. */
  labelledBy?: string;
  children: ReactNode;
}) {
  return (
    <section
      id={id}
      aria-labelledby={labelledBy}
      className={cn(tones[tone], padding, className)}
    >
      <Container>{children}</Container>
    </section>
  );
}

export function SectionHeading({
  id,
  eyebrow,
  eyebrowStyle = "caps",
  title,
  description,
  align = "start",
  action,
}: {
  id?: string;
  eyebrow?: string;
  eyebrowStyle?: "caps" | "serif";
  title: string;
  description?: string;
  align?: "start" | "center";
  action?: ReactNode;
}) {
  const centered = align === "center";

  return (
    <div
      className={cn(
        "mb-10 flex flex-col gap-5 md:mb-14",
        centered ? "items-center text-center" : "md:flex-row md:items-end md:justify-between",
      )}
    >
      {/* `min-w-0` lets the copy column give way to the action chip on tablet
          widths instead of pushing it past the container edge. */}
      <div className={cn("min-w-0 max-w-prose", centered && "mx-auto")}>
        {eyebrow ? (
          <p
            className={cn(
              "mb-3 text-ink-muted",
              eyebrowStyle === "caps"
                ? "text-xs font-semibold uppercase tracking-eyebrow"
                : "font-display text-base italic",
            )}
          >
            {eyebrow}
          </p>
        ) : null}
        <h2 id={id} className="text-3xl font-semibold leading-tight md:text-4xl">
          {title}
        </h2>
        {description ? (
          <p className="mt-4 text-base leading-relaxed text-ink-soft">{description}</p>
        ) : null}
      </div>
      {action ? <div className="shrink-0">{action}</div> : null}
    </div>
  );
}
