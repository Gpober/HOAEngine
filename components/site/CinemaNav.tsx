"use client";

import { Menu, X } from "lucide-react";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { Container } from "@/components/ui/Container";
import { cn } from "@/lib/cn";
import { displayNameFor, locationLabel, primaryNav } from "@/lib/content";
import type { Association } from "@/lib/types";

/**
 * The split navigation that sits transparent over the hero photograph:
 * links to the left, the wordmark dead centre, links and the resident entry
 * to the right. Once the visitor scrolls past the hero it detaches and comes
 * back as a solid fixed bar, the way the good property sites do it.
 *
 * One element plays both roles — `absolute` inside the hero while the image
 * is on screen, `fixed` to the viewport once it is not — so there is exactly
 * one `<nav>` for assistive technology rather than a visible one and a
 * hidden duplicate.
 */
export function CinemaNav({ association }: { association: Association }) {
  const [solid, setSolid] = useState(false);
  const [open, setOpen] = useState(false);

  // Two links a side, no more. Letterspaced capitals are wide, and six links
  // plus a centred wordmark collide with each other before 1440px. The menu
  // button — present at every width — carries the full list, which is also
  // how the luxury-property sites do it: a sparse bar and a real menu.
  const leftNav = [primaryNav[0], primaryNav[4]]; // Community, Amenities
  const rightNav = [primaryNav[3], primaryNav[5]]; // Documents, Contact

  useEffect(() => {
    function onScroll() {
      // Past ~60% of the viewport the hero is leaving; bring in the solid bar.
      setSolid(window.scrollY > window.innerHeight * 0.6);
    }
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // The full-screen menu behaves like a dialog: Escape closes it, and the
  // page behind it does not scroll while it is open.
  useEffect(() => {
    if (!open) return;
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") setOpen(false);
    }
    document.addEventListener("keydown", onKeyDown);
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = previous;
    };
  }, [open]);

  const linkClass = cn(
    "inline-flex min-h-[2.75rem] items-center whitespace-nowrap rounded-pill px-3 text-xs font-medium uppercase tracking-[0.14em] no-underline transition-colors",
    solid
      ? "text-ink-soft hover:text-accent"
      : "text-white/85 hover:text-white",
  );

  return (
    <>
      <header
        className={cn(
          solid
            ? "fixed inset-x-0 top-0 z-40 animate-fade-in border-b border-line bg-card/95 text-ink shadow-soft backdrop-blur supports-[backdrop-filter]:bg-card/85"
            : "absolute inset-x-0 top-0 z-30 bg-transparent",
        )}
      >
        <Container
          className={cn(
            // minmax(0,…) lets the wordmark column actually shrink, so a long
            // name truncates on a phone instead of pushing the page wider
            // than the viewport (the enlarged type scale found this one).
            "grid grid-cols-[1fr_minmax(0,auto)_1fr] items-center gap-4",
            solid ? "py-3" : "py-5 md:py-6",
          )}
        >
          <nav
            aria-label="Primary"
            className="hidden justify-self-start xl:block"
          >
            <ul className="flex items-center gap-1">
              {leftNav.map((item) => (
                <li key={item.href}>
                  <a href={item.href} className={linkClass}>
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
          {/* Empty grid cell keeps the wordmark centred below xl. */}
          <span aria-hidden="true" className="justify-self-start xl:hidden" />

          <a
            href="#top"
            className={cn(
              "min-w-0 max-w-full justify-self-center truncate text-center font-display text-base font-light uppercase tracking-[0.24em] no-underline sm:text-lg",
              solid ? "text-ink" : "text-white",
            )}
          >
            {displayNameFor(association)}
            {displayNameFor(association) !== association.name ? (
              <span className="sr-only"> — {association.name}</span>
            ) : null}
          </a>

          <div className="flex items-center justify-self-end xl:gap-1">
            <nav aria-label="Primary continued" className="hidden xl:block">
              <ul className="flex items-center gap-1">
                {rightNav.map((item) => (
                  <li key={item.href}>
                    <a href={item.href} className={linkClass}>
                      {item.label}
                    </a>
                  </li>
                ))}
                <li>
                  <a
                    href="#"
                    aria-label="Resident Login — demo only, not a working portal"
                    className={cn(linkClass, "gap-1.5")}
                  >
                    Resident Login
                    <span
                      className={cn(
                        "rounded-pill px-1.5 py-0.5 text-[0.625rem] font-bold",
                        solid
                          ? "bg-accent text-accent-ink"
                          : "bg-white/20 text-white",
                      )}
                    >
                      Demo
                    </span>
                  </a>
                </li>
              </ul>
            </nav>
            <button
              type="button"
              aria-expanded={open}
              aria-controls="cinema-menu"
              aria-label="Open menu"
              onClick={() => setOpen(true)}
              className={cn(
                "inline-flex h-12 w-12 items-center justify-center rounded-pill transition-colors",
                solid
                  ? "border border-line bg-card text-ink hover:bg-accent-soft hover:text-accent"
                  : "border border-white/40 text-white hover:bg-white/10",
              )}
            >
              <Menu className="h-6 w-6" aria-hidden="true" />
            </button>
          </div>
        </Container>
      </header>

      {/*
       * Full-screen menu in the community's colour.
       *
       * Portalled out of the hero: the hero section is `isolate`, so a fixed
       * overlay rendered inside it is trapped in that stacking context and
       * the z-50 concept badge would float over the open menu. The portal
       * target is the demo wrapper (`#top`) rather than <body> because the
       * wrapper is what carries the theme's CSS custom properties — from
       * <body> the menu would render in the default palette, not this
       * community's. Client-only is fine — the menu opens on click.
       */}
      {open
        ? createPortal(
            <div
              id="cinema-menu"
              className="on-accent fixed inset-0 z-[60] flex animate-fade-in flex-col overflow-y-auto bg-accent text-accent-ink"
            >
              <Container className="flex items-center justify-between py-5">
                <span className="font-display text-base font-light uppercase tracking-[0.28em]">
                  {displayNameFor(association)}
                </span>
                <button
                  type="button"
                  aria-label="Close menu"
                  onClick={() => setOpen(false)}
                  className="inline-flex h-12 w-12 items-center justify-center rounded-pill border border-accent-ink/40 text-accent-ink transition-colors hover:bg-accent-ink/10"
                >
                  <X className="h-6 w-6" aria-hidden="true" />
                </button>
              </Container>
              <Container className="flex flex-1 flex-col justify-center py-10">
                <nav aria-label="Primary menu">
                  <ul className="flex flex-col gap-2">
                    {primaryNav.map((item, index) => (
                      <li key={item.href}>
                        <a
                          href={item.href}
                          onClick={() => setOpen(false)}
                          className="group flex min-h-[3.5rem] items-baseline gap-4 no-underline"
                        >
                          <span className="text-sm tabular-nums text-accent-ink/50">
                            {String(index + 1).padStart(2, "0")}
                          </span>
                          <span className="font-display text-3xl font-light tracking-wide text-accent-ink transition-opacity group-hover:opacity-70 md:text-4xl">
                            {item.label}
                          </span>
                        </a>
                      </li>
                    ))}
                  </ul>
                </nav>
                <div className="mt-10 border-t border-accent-ink/20 pt-6">
                  <a
                    href="#"
                    onClick={() => setOpen(false)}
                    aria-label="Resident Login — demo only, not a working portal"
                    className="inline-flex items-center gap-2 text-sm font-semibold uppercase tracking-eyebrow text-accent-ink/85 no-underline"
                  >
                    Resident Login
                    <span className="rounded-pill bg-accent-ink/15 px-2 py-0.5 text-xs font-bold uppercase tracking-eyebrow">
                      Demo
                    </span>
                  </a>
                  {locationLabel(association) ? (
                    <p className="mt-4 text-sm uppercase tracking-eyebrow text-accent-ink/60">
                      {locationLabel(association)}
                    </p>
                  ) : null}
                </div>
              </Container>
            </div>,
            document.getElementById("top") ?? document.body,
          )
        : null}
    </>
  );
}
