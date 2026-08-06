"use client";

import { Menu, X } from "lucide-react";
import { useEffect, useState } from "react";
import { ButtonLink } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { cn } from "@/lib/cn";
import {
  compactNav,
  displayNameFor,
  locationLabel,
  monogramFor,
  primaryNav,
} from "@/lib/content";
import { designStyles } from "@/lib/design-styles";
import type { Association } from "@/lib/types";

export function SiteHeader({ association }: { association: Association }) {
  const [open, setOpen] = useState(false);
  const monogram = monogramFor(association);
  const location = locationLabel(association);
  const displayName = displayNameFor(association);

  // The enlarged type scale needs a shorter desktop nav to keep touch targets
  // generous; the mobile menu below still lists every section.
  const enlarged = designStyles[association.designStyle].typeScale === "large";
  const desktopNav = enlarged ? compactNav : primaryNav;

  // Escape closes the mobile menu, matching normal disclosure behaviour.
  useEffect(() => {
    if (!open) return;
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") setOpen(false);
    }
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [open]);

  return (
    <header className="sticky top-0 z-40 border-b border-line bg-card/90 backdrop-blur supports-[backdrop-filter]:bg-card/75">
      <Container className="flex items-center justify-between gap-4 py-3 md:py-4">
        {/* `min-w-0` lets a long association name truncate instead of pushing
            the header wider than the viewport. Default flex sizing keeps the
            name at its natural width whenever the row has room for it. */}
        <a
          href="#top"
          className="group flex min-w-0 items-center gap-3 rounded-pill py-1 no-underline"
        >
          <span
            aria-hidden="true"
            className="flex h-12 w-12 shrink-0 items-center justify-center rounded-pill border border-accent/20 bg-accent-soft font-display text-lg font-semibold text-accent"
          >
            {monogram}
          </span>
          <span className="flex min-w-0 flex-col">
            <span className="truncate font-display text-lg font-semibold leading-tight text-ink">
              {displayName}
              {/* The full legal name still reaches assistive technology. */}
              {displayName !== association.name ? (
                <span className="sr-only"> — {association.name}</span>
              ) : null}
            </span>
            {location ? (
              <span className="truncate text-sm text-ink-muted">{location}</span>
            ) : null}
          </span>
        </a>

        <nav aria-label="Primary" className="hidden shrink-0 xl:block">
          <ul className="flex items-center gap-0.5">
            {desktopNav.map((item) => (
              <li key={item.href}>
                <a
                  href={item.href}
                  className="inline-flex min-h-[2.75rem] items-center rounded-pill px-3 text-base font-medium text-ink-soft no-underline transition-colors hover:bg-accent-soft hover:text-accent"
                >
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <div className="flex shrink-0 items-center gap-2">
          <ResidentLoginButton className="hidden sm:inline-flex" />
          <button
            type="button"
            aria-expanded={open}
            aria-controls="mobile-navigation"
            aria-label={open ? "Close menu" : "Open menu"}
            onClick={() => setOpen((value) => !value)}
            className="inline-flex h-12 w-12 items-center justify-center rounded-pill border border-line bg-card text-ink transition-colors hover:bg-accent-soft hover:text-accent xl:hidden"
          >
            {open ? (
              <X className="h-6 w-6" aria-hidden="true" />
            ) : (
              <Menu className="h-6 w-6" aria-hidden="true" />
            )}
          </button>
        </div>
      </Container>

      <div
        id="mobile-navigation"
        hidden={!open}
        className={cn("border-t border-line bg-card xl:hidden", open && "animate-fade-in")}
      >
        <Container className="py-4">
          <nav aria-label="Primary mobile">
            <ul className="flex flex-col gap-1">
              {primaryNav.map((item) => (
                <li key={item.href}>
                  <a
                    href={item.href}
                    onClick={() => setOpen(false)}
                    className="flex min-h-[3.25rem] items-center rounded-card px-4 text-lg font-medium text-ink no-underline transition-colors hover:bg-accent-soft hover:text-accent"
                  >
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
          <ResidentLoginButton className="mt-4 w-full sm:hidden" />
        </Container>
      </div>
    </header>
  );
}

/**
 * The resident login entry point. It is explicitly labelled "Demo" so nobody
 * mistakes this concept for a working resident portal.
 */
function ResidentLoginButton({ className }: { className?: string }) {
  return (
    <ButtonLink
      href="#"
      variant="outline"
      className={cn("gap-2", className)}
      aria-label="Resident Login — demo only, not a working portal"
    >
      Resident Login
      <span className="rounded-pill bg-accent px-2 py-0.5 text-xs font-bold uppercase tracking-eyebrow text-accent-ink">
        Demo
      </span>
    </ButtonLink>
  );
}
