"use client";

import { Menu, X } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { Container } from "@/components/ui/Container";
import { cn } from "@/lib/cn";
import { site } from "@/lib/site";

/**
 * The marketing page's split navigation — the same pattern the demo sites
 * carry, because the company's own site should not look one class below the
 * work it sells. Transparent over the hero photograph, wordmark dead centre,
 * and a solid fixed bar once the visitor scrolls past the opening.
 */
const LEFT_NAV = [
  { label: "Our Work", href: "#designs" },
  { label: "What's Included", href: "#included" },
];
const RIGHT_NAV = [
  { label: "Questions", href: "#faq" },
  { label: "Contact", href: "#contact" },
];
const MENU_NAV = [
  { label: "Home", href: "#top" },
  ...LEFT_NAV,
  ...RIGHT_NAV,
];

export function MarketingNav() {
  const [solid, setSolid] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    function onScroll() {
      setSolid(window.scrollY > window.innerHeight * 0.6);
    }
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

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
    solid ? "text-ink-soft hover:text-accent" : "text-white/85 hover:text-white",
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
            "grid grid-cols-[1fr_minmax(0,auto)_1fr] items-center gap-4",
            solid ? "py-3" : "py-5 md:py-6",
          )}
        >
          <nav aria-label="Primary" className="hidden justify-self-start xl:block">
            <ul className="flex items-center gap-1">
              {LEFT_NAV.map((item) => (
                <li key={item.href}>
                  <a href={item.href} className={linkClass}>
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
          <span aria-hidden="true" className="justify-self-start xl:hidden" />

          <a
            href="#top"
            className={cn(
              "min-w-0 max-w-full justify-self-center truncate text-center font-display text-base font-light uppercase tracking-[0.24em] no-underline sm:text-lg",
              solid ? "text-ink" : "text-white",
            )}
          >
            {site.name}
          </a>

          <div className="flex items-center justify-self-end gap-1">
            <nav aria-label="Primary continued" className="hidden xl:block">
              <ul className="flex items-center gap-1">
                {RIGHT_NAV.map((item) => (
                  <li key={item.href}>
                    <a href={item.href} className={linkClass}>
                      {item.label}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>
            <Link
              href="/start"
              className={cn(
                "hidden min-h-[2.5rem] items-center whitespace-nowrap rounded-pill px-4 text-xs font-semibold uppercase tracking-[0.14em] no-underline transition-colors sm:inline-flex",
                solid
                  ? "bg-accent text-accent-ink hover:bg-accent-strong"
                  : "border border-white/70 text-white hover:bg-white/10",
              )}
            >
              Free Concept
            </Link>
            <button
              type="button"
              aria-expanded={open}
              aria-controls="marketing-menu"
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

      {/* Full-screen menu in the house colour. Portalled to <body>, which
          carries the default palette this page runs in. */}
      {open
        ? createPortal(
            <div
              id="marketing-menu"
              className="on-accent fixed inset-0 z-[60] flex animate-fade-in flex-col overflow-y-auto bg-accent text-accent-ink"
            >
              <Container className="flex items-center justify-between py-5">
                <span className="font-display text-base font-light uppercase tracking-[0.28em]">
                  {site.name}
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
                    {MENU_NAV.map((item, index) => (
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
                  <Link
                    href="/start"
                    onClick={() => setOpen(false)}
                    className="inline-flex min-h-[3rem] items-center gap-2 rounded-pill bg-accent-ink px-6 text-sm font-semibold uppercase tracking-eyebrow text-accent no-underline"
                  >
                    Start Your Free Concept
                  </Link>
                  <p className="mt-4 text-sm uppercase tracking-eyebrow text-accent-ink/60">
                    {site.tagline}
                  </p>
                </div>
              </Container>
            </div>,
            document.body,
          )
        : null}
    </>
  );
}
