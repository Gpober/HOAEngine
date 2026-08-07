"use client";

import { useEffect, useState, type ReactNode } from "react";
import { cn } from "@/lib/cn";
import { displayNameFor, locationLabel } from "@/lib/content";
import { DisclaimerBar } from "@/components/site/DisclaimerBar";
import type { Association } from "@/lib/types";

type Phase = "intro" | "reveal" | "done";

/**
 * The opening moment: a full-screen wash in the community's own colour with
 * the wordmark alone at its centre, held for just over a second, and then the
 * page revealed through a circle that grows from the middle of the screen.
 *
 * This is the luxury-property opening (the Ocean Terrace pattern) rather than
 * a loading spinner — nothing is actually loading. It exists because the first
 * two seconds are the whole first impression, and a page that *arrives* reads
 * as a different class of website from a page that is simply there.
 *
 * Three constraints shape the implementation:
 *
 * 1. The disclaimer must never be off screen while anything is visible, so
 *    the wash carries its own copy of the disclaimer bar (aria-hidden — the
 *    real one is in the page and is what assistive technology reads).
 * 2. `prefers-reduced-motion` skips the whole sequence: the effect is purely
 *    decorative, and a sudden full-screen colour flash is exactly the kind of
 *    motion that setting exists to avoid.
 * 3. Without JavaScript the server-rendered markup must still show the page,
 *    so the clip is applied by a class that a `<noscript>` style neutralises.
 */
export function IntroReveal({
  association,
  children,
}: {
  association: Association;
  children: ReactNode;
}) {
  const [phase, setPhase] = useState<Phase>("intro");

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setPhase("done");
      return;
    }
    // Hold the wordmark, then let the circle run. The second timer removes
    // the overlay and the clip entirely so nothing lingers in the tree.
    const reveal = window.setTimeout(() => setPhase("reveal"), 1300);
    const done = window.setTimeout(() => setPhase("done"), 2500);
    return () => {
      window.clearTimeout(reveal);
      window.clearTimeout(done);
    };
  }, []);

  const location = locationLabel(association);

  return (
    <div className="relative">
      <noscript>
        {/* No JS: kill the clip and the wash so the page simply renders. */}
        <style>{`.hoa-intro-clip{clip-path:none !important;animation:none !important}.hoa-intro-wash{display:none !important}`}</style>
      </noscript>

      {phase !== "done" ? (
        <div
          aria-hidden="true"
          className="hoa-intro-wash on-accent fixed inset-0 z-[45] flex flex-col bg-accent text-accent-ink"
        >
          {/* The notice stays visible even during the opening. */}
          <DisclaimerBar />
          <div className="flex flex-1 flex-col items-center justify-center gap-4 px-6 pb-16 text-center">
            <p className="hoa-wordmark-in font-display text-3xl font-light uppercase tracking-[0.32em] sm:text-4xl md:text-5xl">
              {displayNameFor(association)}
            </p>
            {location ? (
              <p className="hoa-wordmark-in text-sm font-medium uppercase tracking-eyebrow text-accent-ink/70 [animation-delay:180ms]">
                {location}
              </p>
            ) : null}
          </div>
        </div>
      ) : null}

      <div
        className={cn(
          phase === "intro" && "hoa-intro-clip",
          // z above the wash so the circle opens *over* it.
          phase === "reveal" && "hoa-intro-clip hoa-intro-reveal relative z-[46]",
        )}
      >
        {children}
      </div>
    </div>
  );
}
