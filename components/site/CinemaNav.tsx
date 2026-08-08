"use client";

import { Menu, X } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { Container } from "@/components/ui/Container";
import { cn } from "@/lib/cn";
import { demoPages, displayNameFor, locationLabel } from "@/lib/content";
import type { Association } from "@/lib/types";

/**
 * The split navigation: links to the left, the wordmark dead centre, links and
 * the resident entry to the right. Every link is a real page under the demo's
 * slug — the homepage carries only the showpiece, so the nav is how a visitor
 * reaches anything practical.
 *
 * Two variants share the one component so link lists never drift apart:
 *
 * - `hero` (the homepage): transparent over the photograph, then detaching
 *   into a solid fixed bar once the visitor scrolls past the hero.
 * - `solid` (every sub-page): solid and sticky from the first paint — there is
 *   no full-bleed photograph to float over.
 *
 * Two layouts, chosen by the design's opening so different concepts read as
 * different sites:
 *
 * - `split`: links left, wordmark dead centre, links right — the
 *   luxury-property arrangement the cinema opening uses.
 * - `corner`: wordmark in the left corner, everything else on the right —
 *   the conventional arrangement the editorial and warm openings use.
 */
export function CinemaNav({
  association,
  variant = "hero",
  layout = "split",
}: {
  association: Association;
  variant?: "hero" | "solid";
  layout?: "split" | "corner";
}) {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  const pages = demoPages(association.slug);
  const home = `/demo/${association.slug}`;

  // Two links a side, no more. Letterspaced capitals are wide, and five links
  // plus a centred wordmark collide with each other before 1440px. The menu
  // button — present at every width — carries the full list, which is also
  // how the luxury-property sites do it: a sparse bar and a real menu.
  const leftNav = [pages[0], pages[1]]; // Community, Amenities
  const rightNav = [pages[3], pages[4]]; // Documents, Contact

  const solid = variant === "solid" || scrolled;

  useEffect(() => {
    if (variant === "solid") return;
    function onScroll() {
      // Past ~60% of the viewport the hero is leaving; bring in the solid bar.
      setScrolled(window.scrollY > window.innerHeight * 0.6);
    }
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [variant]);

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

  function isCurrent(href: string): boolean {
    return pathname === href;
  }

  const linkClass = (href: string) =>
    cn(
      "inline-flex min-h-[2.75rem] items-center whitespace-nowrap rounded-pill px-3 text-xs font-medium uppercase tracking-[0.14em] no-underline transition-colors",
      solid
        ? "text-ink-soft hover:text-accent"
        : "text-white/85 hover:text-white",
      isCurrent(href) && (solid ? "text-accent" : "text-white underline underline-offset-8"),
    );

  return (
    <>
      <header
        className={cn(
          variant === "solid"
            ? "sticky top-0 z-40 border-b border-line bg-card/95 text-ink shadow-soft backdrop-blur supports-[backdrop-filter]:bg-card/85"
            : scrolled
              ? "fixed inset-x-0 top-0 z-40 animate-fade-in border-b border-line bg-card/95 text-ink shadow-soft backdrop-blur supports-[backdrop-filter]:bg-card/85"
              : "absolute inset-x-0 top-0 z-30 bg-transparent",
        )}
      >
        <Container
          className={cn(
            // minmax(0,…) lets the wordmark column actually shrink, so a long
            // name truncates on a phone instead of pushing the page wider
            // than the viewport (the enlarged type scale found this one).
            layout === "split"
              ? "grid grid-cols-[1fr_minmax(0,auto)_1fr] items-center gap-4"
              : "flex items-center justify-between gap-4",
            solid ? "py-3" : "py-5 md:py-6",
          )}
        >
          {layout === "split" ? (
            <>
              <nav
                aria-label="Primary"
                className="hidden justify-self-start xl:block"
              >
                <ul className="flex items-center gap-1">
                  {leftNav.map((item) => (
                    <li key={item.href}>
                      <Link
                        href={item.href}
                        aria-current={isCurrent(item.href) ? "page" : undefined}
                        className={linkClass(item.href)}
                      >
                        {item.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </nav>
              {/* Empty grid cell keeps the wordmark centred below xl. */}
              <span aria-hidden="true" className="justify-self-start xl:hidden" />
            </>
          ) : null}

          <Link
            href={home}
            className={cn(
              "min-w-0 max-w-full truncate no-underline",
              layout === "split"
                ? "justify-self-center text-center font-display text-base font-light uppercase tracking-[0.24em] sm:text-lg"
                : "text-left font-display text-base font-semibold tracking-tight sm:text-lg",
              solid ? "text-ink" : "text-white",
            )}
          >
            {displayNameFor(association)}
            {displayNameFor(association) !== association.name ? (
              <span className="sr-only"> — {association.name}</span>
            ) : null}
            <span className="sr-only"> — home</span>
          </Link>

          <div
            className={cn(
              "flex items-center xl:gap-1",
              layout === "split" && "justify-self-end",
            )}
          >
            <nav
              aria-label={layout === "corner" ? "Primary" : "Primary continued"}
              className="hidden xl:block"
            >
              <ul className="flex items-center gap-1">
                {(layout === "corner" ? pages : rightNav).map((item) => (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      aria-current={isCurrent(item.href) ? "page" : undefined}
                      className={linkClass(item.href)}
                    >
                      {item.label}
                    </Link>
                  </li>
                ))}
                <li>
                  <a
                    href="#"
                    aria-label="Resident Login — demo only, not a working portal"
                    className={cn(linkClass("#"), "gap-1.5")}
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
                    {[{ label: "Home", href: home, segment: "", description: "" }, ...pages].map(
                      (item, index) => (
                        <li key={item.href}>
                          <Link
                            href={item.href}
                            onClick={() => setOpen(false)}
                            aria-current={isCurrent(item.href) ? "page" : undefined}
                            className="group flex min-h-[3.5rem] items-baseline gap-4 no-underline"
                          >
                            <span className="text-sm tabular-nums text-accent-ink/50">
                              {String(index + 1).padStart(2, "0")}
                            </span>
                            <span
                              className={cn(
                                "font-display text-3xl font-light tracking-wide text-accent-ink transition-opacity group-hover:opacity-70 md:text-4xl",
                                isCurrent(item.href) && "underline underline-offset-8",
                              )}
                            >
                              {item.label}
                            </span>
                          </Link>
                        </li>
                      ),
                    )}
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
