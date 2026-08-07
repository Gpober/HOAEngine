"use client";

import { MessageCircle, Send, X } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { cn } from "@/lib/cn";

interface Turn {
  role: "user" | "assistant";
  content: string;
}

/**
 * The public community guide.
 *
 * Aimed at the person deciding whether they want to live here, not at someone
 * who already does — so it sits on the public page with no login, which is the
 * whole difference from a resident portal.
 *
 * Rendered inside the demo's theme wrapper, so every colour here is a theme
 * token and the guide takes on each design's palette without a single
 * conditional.
 */
export function Concierge({
  slug,
  communityName,
  suggestions,
}: {
  slug: string;
  communityName: string;
  suggestions: string[];
}) {
  const [open, setOpen] = useState(false);
  const [turns, setTurns] = useState<Turn[]>([]);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [draft, setDraft] = useState("");

  const logRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Keep the newest answer in view without yanking the whole page around.
  useEffect(() => {
    if (logRef.current) logRef.current.scrollTop = logRef.current.scrollHeight;
  }, [turns, pending]);

  useEffect(() => {
    if (open) inputRef.current?.focus();
  }, [open]);

  const ask = useCallback(
    async (question: string) => {
      const text = question.trim();
      if (!text || pending) return;

      const next: Turn[] = [...turns, { role: "user", content: text }];
      setTurns(next);
      setDraft("");
      setPending(true);
      setError(null);

      try {
        const res = await fetch("/api/concierge", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ slug, messages: next }),
        });
        const data = await res.json();
        if (!res.ok) {
          setError(data?.error ?? "Something went wrong.");
        } else {
          setTurns([...next, { role: "assistant", content: data.reply }]);
        }
      } catch {
        setError("Could not reach the guide. Please try again.");
      } finally {
        setPending(false);
      }
    },
    [pending, slug, turns],
  );

  if (!open) {
    return (
      /*
       * Lifted clear of the sales badge on small screens. The badge's container
       * is `inset-x-0` and full width, so even though it is
       * `pointer-events-none` its right-aligned button still lands on top of a
       * left-aligned launcher once the two are wider than the viewport — which
       * at 360px they are. Sitting them on separate rows is the only fix that
       * does not depend on either label's length.
       */
      <div className="pointer-events-none fixed inset-x-0 bottom-0 z-40 flex justify-start p-4 pb-20 print:hidden sm:p-6 sm:pb-6">
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="pointer-events-auto inline-flex min-h-[3rem] items-center gap-2 rounded-pill bg-accent px-5 py-3 text-base font-semibold text-accent-ink shadow-lift transition-colors hover:bg-accent-strong"
        >
          <MessageCircle className="h-5 w-5" aria-hidden="true" />
          Ask about {communityName}
        </button>
      </div>
    );
  }

  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-0 z-50 flex justify-start p-4 print:hidden sm:p-6">
      <section
        aria-label={`Ask about ${communityName}`}
        className="pointer-events-auto flex h-[min(32rem,calc(100vh-6rem))] w-[min(26rem,calc(100vw-2rem))] flex-col overflow-hidden rounded-card border border-line bg-card shadow-lift"
      >
        <header className="flex items-start justify-between gap-3 border-b border-line px-5 py-4">
          <div className="min-w-0">
            <p className="truncate font-display text-base font-semibold text-ink">
              Ask about {communityName}
            </p>
            {/*
             * Said once, here, rather than appended to every answer. The page
             * already carries the sample-design labelling; repeating it in each
             * reply would make the guide unusable to demonstrate.
             */}
            <p className="text-xs text-ink-muted">
              Demo guide — answers from sample community information
            </p>
          </div>
          <button
            type="button"
            onClick={() => setOpen(false)}
            // Distinct from the sales badge's own "Close" — two identically
            // labelled buttons on one page is a coin toss for a screen reader.
            aria-label="Close the community guide"
            className="-mr-2 -mt-1 inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-pill text-ink-muted transition-colors hover:bg-accent-soft hover:text-accent"
          >
            <X className="h-5 w-5" aria-hidden="true" />
          </button>
        </header>

        <div ref={logRef} className="flex-1 space-y-3 overflow-y-auto px-5 py-4">
          {turns.length === 0 ? (
            <p className="text-base leading-relaxed text-ink-soft">
              Ask anything about the community — the amenities, the meetings, or
              how to reach the office.
            </p>
          ) : null}

          {turns.map((turn, i) => (
            <div
              key={i}
              className={cn(
                "max-w-[85%] rounded-card px-4 py-2.5 text-base leading-relaxed",
                turn.role === "user"
                  ? "ml-auto bg-accent text-accent-ink"
                  : "bg-surface-alt text-ink",
              )}
            >
              {turn.content}
            </div>
          ))}

          {pending ? (
            <p className="text-base text-ink-muted" role="status">
              Looking that up…
            </p>
          ) : null}

          {error ? (
            <p
              role="alert"
              className="rounded-card border border-accent/30 bg-accent-soft px-4 py-2.5 text-base text-accent"
            >
              {error}
            </p>
          ) : null}
        </div>

        {turns.length === 0 ? (
          <div className="flex flex-wrap gap-2 border-t border-line px-5 py-3">
            {suggestions.map((q) => (
              <button
                key={q}
                type="button"
                onClick={() => ask(q)}
                className="rounded-pill border border-line px-3 py-1.5 text-sm text-ink-soft transition-colors hover:border-accent hover:text-accent"
              >
                {q}
              </button>
            ))}
          </div>
        ) : null}

        <form
          onSubmit={(e) => {
            e.preventDefault();
            ask(draft);
          }}
          className="flex items-center gap-2 border-t border-line px-4 py-3"
        >
          <label className="sr-only" htmlFor="concierge-input">
            Your question
          </label>
          <input
            id="concierge-input"
            ref={inputRef}
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            maxLength={500}
            placeholder="Ask a question…"
            className="min-w-0 flex-1 rounded-pill border border-line bg-surface px-4 py-2.5 text-base text-ink outline-none focus:border-accent"
          />
          <button
            type="submit"
            disabled={pending || !draft.trim()}
            aria-label="Send"
            className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-pill bg-accent text-accent-ink transition-colors hover:bg-accent-strong disabled:opacity-50"
          >
            <Send className="h-5 w-5" aria-hidden="true" />
          </button>
        </form>
      </section>
    </div>
  );
}
