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
 * The boutique-property bar: a solid white navigation on every page — the
 * community's name in its accent colour on the left, pages and the access
 * cluster on the right, with the photograph opening *below* the bar. This is
 * the arrangement small luxury buildings actually use (nav that looks like a
 * concierge desk, not a scrim), and it is deliberate: the bar reads first,
 * the cinema hero still gets the whole viewport underneath it.
 *
 * The access cluster mirrors the resident/board/realtor entries those sites
 * carry. Resident and Board access are demo-labelled placeholders — a real
 * engagement points them at the association's existing portal — while
 * Realtor access is a real page (the lender/realtor information page).
 *
 * `variant` and `layout` are kept for call-site compatibility; every variant
 * now renders the same solid bar so the look cannot drift apart per page.
 */
export function CinemaNav({
  association,
}: {
  association: Association;
  variant?: "hero" | "solid";
  layout?: "split" | "corner";
}) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  const pages = demoPages(association.slug);
  const home = `/demo/${association.slug}`;

  // The bar mirrors the boutique arrangement: Contact plus the access
  // cluster. Community, Amenities, News, and Documents live in the menu.
  const barPages = [pages[4]]; // Contact
  const realtorHref = pages[5]?.href ?? `${home}/lenders`;

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
      "inline-flex min-h-[2.75rem] items-center whitespace-nowrap rounded-pill px-3 text-xs font-medium uppercase tracking-[0.14em] text-ink-soft no-underline transition-colors hover:text-accent",
      isCurrent(href) && "text-accent",
    );

  const demoBadge = (
    <span className="rounded-pill bg-accent-soft px-1.5 py-0.5 text-[0.625rem] font-bold text-accent">
      Demo
    </span>
  );

  return (
    <>
      <header className="sticky top-0 z-40 border-b border-line bg-card/95 text-ink shadow-soft backdrop-blur supports-[backdrop-filter]:bg-card/85">
        <Container className="flex items-center justify-between gap-4 py-3.5">
          <Link
            href={home}
            className="min-w-0 max-w-full truncate font-display text-base font-light uppercase tracking-[0.2em] text-accent no-underline sm:text-lg"
          >
            {displayNameFor(association)}
            {displayNameFor(association) !== association.name ? (
              <span className="sr-only"> — {association.name}</span>
            ) : null}
            <span className="sr-only"> — home</span>
          </Link>

          <div className="flex items-center gap-1">
            <nav aria-label="Primary" className="hidden xl:block">
              <ul className="flex items-center gap-1">
                {barPages.map((item) => (
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

            <span
              aria-hidden="true"
              className="mx-2 hidden h-5 w-px bg-line xl:block"
            />

            {/* Access cluster: resident and board entries are demo-labelled
                placeholders; realtor access is the real lender/realtor page. */}
            <nav aria-label="Access" className="hidden xl:block">
              <ul className="flex items-center gap-1">
                <li>
                  <a
                    href="#"
                    aria-label="Resident Access — demo only, not a working portal"
                    className={cn(linkClass("#"), "gap-1.5")}
                  >
                    Resident Access
                    {demoBadge}
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    aria-label="Board Member Access — demo only, not a working portal"
                    className={cn(linkClass("#"), "gap-1.5")}
                  >
                    Board Access
                    {demoBadge}
                  </a>
                </li>
                <li>
                  <Link
                    href={realtorHref}
                    aria-current={isCurrent(realtorHref) ? "page" : undefined}
                    className={linkClass(realtorHref)}
                  >
                    Realtor Access
                  </Link>
                </li>
              </ul>
            </nav>

            <button
              type="button"
              aria-expanded={open}
              aria-controls="cinema-menu"
              aria-label="Open menu"
              onClick={() => setOpen(true)}
              className="inline-flex h-12 w-12 items-center justify-center rounded-pill border border-line bg-card text-ink transition-colors hover:bg-accent-soft hover:text-accent"
            >
              <Menu className="h-6 w-6" aria-hidden="true" />
            </button>
          </div>
        </Container>
      </header>

      {/*
       * Full-screen menu in the community's colour.
       *
       * Portalled to the demo wrapper (`#top`) rather than <body> because the
       * wrapper carries the theme's CSS custom properties — from <body> the
       * menu would render in the default palette, not this community's.
       * Client-only is fine — the menu opens on click.
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
                <div className="mt-10 flex flex-wrap items-center gap-x-6 gap-y-3 border-t border-accent-ink/20 pt-6">
                  {[
                    { label: "Resident Access", demo: true },
                    { label: "Board Member Access", demo: true },
                  ].map((item) => (
                    <a
                      key={item.label}
                      href="#"
                      onClick={() => setOpen(false)}
                      aria-label={`${item.label} — demo only, not a working portal`}
                      className="inline-flex items-center gap-2 text-sm font-semibold uppercase tracking-eyebrow text-accent-ink/85 no-underline"
                    >
                      {item.label}
                      <span className="rounded-pill bg-accent-ink/15 px-2 py-0.5 text-xs font-bold uppercase tracking-eyebrow">
                        Demo
                      </span>
                    </a>
                  ))}
                  <Link
                    href={realtorHref}
                    onClick={() => setOpen(false)}
                    className="inline-flex items-center gap-2 text-sm font-semibold uppercase tracking-eyebrow text-accent-ink/85 no-underline"
                  >
                    Realtor Access
                  </Link>
                </div>
                {locationLabel(association) ? (
                  <p className="mt-4 text-sm uppercase tracking-eyebrow text-accent-ink/60">
                    {locationLabel(association)}
                  </p>
                ) : null}
              </Container>
            </div>,
            document.getElementById("top") ?? document.body,
          )
        : null}
    </>
  );
}
