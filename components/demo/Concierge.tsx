"use client";

import { MessageCircle, Send, X } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { MicButton } from "@/components/ui/MicButton";
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
  tagline = "Demo guide — answers from sample community information",
  emptyHint = "Ask anything about the community — the amenities, the meetings, or how to reach the office.",
}: {
  slug: string;
  communityName: string;
  suggestions: string[];
  /** One line under the panel title. */
  tagline?: string;
  /** Shown in the empty transcript before the first question. */
  emptyHint?: string;
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
       * On phones the launcher is a circular icon button: label-width pills on
       * both sides of a 390px screen collide with the sales badge and bury the
       * hero's scroll cue, and an icon bubble is what phone users expect a chat
       * entry to be anyway. The full "Ask about …" pill returns from `sm:` up,
       * where there is room for both labels on one row.
       */
      <div className="pointer-events-none fixed inset-x-0 bottom-0 z-40 flex justify-start p-4 print:hidden sm:p-6">
        <button
          type="button"
          onClick={() => setOpen(true)}
          aria-label={`Ask about ${communityName}`}
          className="pointer-events-auto inline-flex min-h-[3.25rem] min-w-[3.25rem] items-center justify-center gap-2 rounded-pill bg-accent p-3.5 text-base font-semibold text-accent-ink shadow-lift transition-colors hover:bg-accent-strong sm:min-h-[3rem] sm:min-w-0 sm:px-5 sm:py-3"
        >
          <MessageCircle className="h-6 w-6 sm:h-5 sm:w-5" aria-hidden="true" />
          <span className="hidden sm:inline">Ask about {communityName}</span>
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
            <p className="text-xs text-ink-muted">{tagline}</p>
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
            <p className="text-base leading-relaxed text-ink-soft">{emptyHint}</p>
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
          {/*
           * Dictation appends rather than replaces, so someone can type part of
           * a question and speak the rest. It does not auto-send: hearing your
           * own words fired off before you have checked them is unnerving, and
           * speech recognition mishears proper nouns constantly — which is most
           * of what gets asked here.
           */}
          <MicButton
            label="Ask by voice"
            onText={(text) =>
              setDraft((current) =>
                (current ? `${current} ${text}` : text).slice(0, 500),
              )
            }
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
