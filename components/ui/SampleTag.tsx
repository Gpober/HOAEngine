import { cn } from "@/lib/cn";

/**
 * The small "this is not real" pill. Used on announcements, meetings, and any
 * other block that shows illustrative rather than factual content.
 */
export function SampleTag({
  label,
  tone = "accent",
  className,
}: {
  label: string;
  tone?: "accent" | "secondary" | "onDark";
  className?: string;
}) {
  const tones = {
    accent: "bg-accent-soft text-accent border-accent/20",
    secondary: "bg-secondary-soft text-secondary-ink border-secondary/30",
    onDark: "bg-accent-ink/15 text-accent-ink border-accent-ink/30",
  } as const;

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-pill border px-3 py-1 text-xs font-semibold uppercase tracking-eyebrow",
        tones[tone],
        className,
      )}
    >
      <span
        aria-hidden="true"
        className="h-1.5 w-1.5 rounded-pill bg-current opacity-70"
      />
      {label}
    </span>
  );
}
