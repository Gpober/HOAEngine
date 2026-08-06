import Link from "next/link";
import type { ButtonHTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/cn";

type Variant = "primary" | "secondary" | "outline" | "quiet";
type Size = "md" | "lg";

const variants: Record<Variant, string> = {
  primary:
    "bg-accent text-accent-ink shadow-soft hover:bg-accent-strong active:bg-accent-strong",
  secondary:
    "bg-secondary-soft text-secondary-ink hover:bg-secondary/30 border border-secondary/30",
  outline:
    "border border-accent/35 bg-card text-accent hover:bg-accent-soft hover:border-accent/60",
  quiet: "text-accent hover:bg-accent-soft",
};

const sizes: Record<Size, string> = {
  // Generous hit areas: 44px and 52px minimum height.
  md: "min-h-[2.75rem] px-5 py-2.5 text-base",
  lg: "min-h-[3.25rem] px-7 py-3 text-base md:text-lg",
};

function classesFor(variant: Variant, size: Size, className?: string) {
  return cn(
    "inline-flex items-center justify-center gap-2 rounded-pill font-semibold no-underline transition-colors duration-150",
    "focus-visible:outline-3",
    variants[variant],
    sizes[size],
    className,
  );
}

interface CommonProps {
  variant?: Variant;
  size?: Size;
  className?: string;
  children: ReactNode;
}

export function ButtonLink({
  href,
  variant = "primary",
  size = "md",
  className,
  children,
  ...rest
}: CommonProps & {
  href: string;
  "aria-label"?: string;
  target?: string;
  rel?: string;
}) {
  const classes = classesFor(variant, size, className);

  // In-page anchors and demo placeholders stay as plain anchors; real routes
  // use next/link for client-side navigation.
  if (href.startsWith("#") || href.startsWith("http")) {
    return (
      <a href={href} className={classes} {...rest}>
        {children}
      </a>
    );
  }

  return (
    <Link href={href} className={classes} {...rest}>
      {children}
    </Link>
  );
}

export function Button({
  variant = "primary",
  size = "md",
  className,
  children,
  type = "button",
  ...rest
}: CommonProps & ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button type={type} className={classesFor(variant, size, className)} {...rest}>
      {children}
    </button>
  );
}
