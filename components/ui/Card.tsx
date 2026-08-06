import type { ElementType, ReactNode } from "react";
import { cn } from "@/lib/cn";

export function Card({
  as: Tag = "div",
  className,
  interactive = false,
  children,
}: {
  as?: ElementType;
  className?: string;
  /** Adds the hover lift used by link cards. Pair with a real focusable child. */
  interactive?: boolean;
  children: ReactNode;
}) {
  return (
    <Tag
      className={cn(
        "rounded-card border border-line bg-card shadow-soft",
        interactive &&
          "transition-shadow duration-200 hover:shadow-lift focus-within:shadow-lift",
        className,
      )}
    >
      {children}
    </Tag>
  );
}

/** Rounded icon well used across quick links, amenities, and contact rows. */
export function IconWell({
  className,
  tone = "accent",
  children,
}: {
  className?: string;
  tone?: "accent" | "secondary";
  children: ReactNode;
}) {
  return (
    <span
      aria-hidden="true"
      className={cn(
        "inline-flex h-12 w-12 shrink-0 items-center justify-center rounded-pill",
        tone === "accent"
          ? "bg-accent-soft text-accent"
          : "bg-secondary-soft text-secondary-ink",
        className,
      )}
    >
      {children}
    </span>
  );
}
