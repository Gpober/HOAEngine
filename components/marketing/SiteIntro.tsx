"use client";

import { useEffect, useState, type ReactNode } from "react";
import { Wordmark } from "@/components/marketing/Wordmark";
import { cn } from "@/lib/cn";
import { site } from "@/lib/site";

type Phase = "intro" | "reveal" | "done";

/**
 * The company site's own opening moment — the same wash-and-circle arrival
 * the demo sites make, because the first thing a prospect should learn about
 * us is that our pages arrive like this. Identical constraints to the demo
 * version: `prefers-reduced-motion` skips the whole sequence, and without
 * JavaScript a `<noscript>` style neutralises the clip so the page simply
 * renders. (No disclaimer copy here — this is the company's own page, not an
 * unofficial concept.)
 */
export function SiteIntro({ children }: { children: ReactNode }) {
  const [phase, setPhase] = useState<Phase>("intro");

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setPhase("done");
      return;
    }
    const reveal = window.setTimeout(() => setPhase("reveal"), 1300);
    const done = window.setTimeout(() => setPhase("done"), 2500);
    return () => {
      window.clearTimeout(reveal);
      window.clearTimeout(done);
    };
  }, []);

  return (
    <div className="relative">
      <noscript>
        <style>{`.hoa-intro-clip{clip-path:none !important;animation:none !important}.hoa-intro-wash{display:none !important}`}</style>
      </noscript>

      {phase !== "done" ? (
        <div
          aria-hidden="true"
          className="hoa-intro-wash on-accent fixed inset-0 z-[45] flex flex-col items-center justify-center gap-4 bg-accent px-6 pb-10 text-center text-accent-ink"
        >
          <Wordmark tone="white" className="hoa-wordmark-in h-14 w-auto sm:h-20 md:h-24" />
          <p className="hoa-wordmark-in text-sm font-medium uppercase tracking-eyebrow text-accent-ink/70 [animation-delay:180ms]">
            {site.tagline}
          </p>
        </div>
      ) : null}

      <div
        className={cn(
          phase === "intro" && "hoa-intro-clip",
          phase === "reveal" && "hoa-intro-clip hoa-intro-reveal relative z-[46]",
        )}
      >
        {children}
      </div>
    </div>
  );
}
