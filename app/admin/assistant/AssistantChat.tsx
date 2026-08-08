"use client";

import { CheckCircle2, Loader2, Send, Sparkles, Wrench, XCircle } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { MicButton } from "@/components/ui/MicButton";
import { ASSISTANT_NAME } from "@/lib/assistant/config";
import { cn } from "@/lib/cn";

/**
 * The chat face for Zordon, ported lean from the Tulips CRM. Streams NDJSON
 * from /api/assistant: answer text as it's written, a chip for each tool
 * read, and a confirmation card for each proposed action — nothing runs
 * until the human clicks Confirm, which posts to /api/assistant/action.
 */

interface ActionProposal {
  name: string;
  input: Record<string, unknown>;
  state: "pending" | "running" | "done" | "failed" | "cancelled";
  result?: string;
}

interface Turn {
  role: "user" | "assistant";
  text: string;
  tools?: string[];
  actions?: ActionProposal[];
}

const SUGGESTIONS = [
  "How is the pipeline this week?",
  "Summarize the newest enquiries",
  "Which concepts are still drafts?",
  "Where is visitor interest concentrated?",
];

const ACTION_LABELS: Record<string, string> = {
  update_enquiry: "Update enquiry",
  create_concept: "Create concept from intake",
};

export function AssistantChat() {
  const [turns, setTurns] = useState<Turn[]>([]);
  const [input, setInput] = useState("");
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const endRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ block: "end" });
  }, [turns, pending]);

  const send = useCallback(
    async (raw: string) => {
      const text = raw.trim();
      if (!text || pending) return;
      setError(null);
      setInput("");
      setPending(true);

      const history = [...turns, { role: "user" as const, text }];
      // The assistant turn we stream into.
      setTurns([...history, { role: "assistant", text: "", tools: [], actions: [] }]);

      const patchLast = (fn: (turn: Turn) => Turn) =>
        setTurns((prev) => {
          const next = [...prev];
          next[next.length - 1] = fn(next[next.length - 1]);
          return next;
        });

      try {
        const res = await fetch("/api/assistant", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            messages: history.map((t) => ({ role: t.role, content: t.text })),
          }),
        });

        if (!res.ok || !res.body) {
          const data = await res.json().catch(() => null);
          setError(data?.error ?? "The assistant hit an error.");
          setTurns(history);
          return;
        }

        const reader = res.body.getReader();
        const decoder = new TextDecoder();
        let buffer = "";
        for (;;) {
          const { done, value } = await reader.read();
          if (done) break;
          buffer += decoder.decode(value, { stream: true });
          const lines = buffer.split("\n");
          buffer = lines.pop() ?? "";
          for (const line of lines) {
            if (!line.trim()) continue;
            let event: { t: string; v: unknown };
            try {
              event = JSON.parse(line);
            } catch {
              continue;
            }
            if (event.t === "text" && typeof event.v === "string") {
              const chunk = event.v;
              patchLast((turn) => ({ ...turn, text: turn.text + chunk }));
            } else if (event.t === "tool" && typeof event.v === "string") {
              const name = event.v;
              patchLast((turn) => ({
                ...turn,
                tools: turn.tools?.includes(name) ? turn.tools : [...(turn.tools ?? []), name],
              }));
            } else if (event.t === "action" && event.v && typeof event.v === "object") {
              const v = event.v as { name?: string; input?: unknown };
              if (typeof v.name === "string") {
                const proposal: ActionProposal = {
                  name: v.name,
                  input: (v.input ?? {}) as Record<string, unknown>,
                  state: "pending",
                };
                patchLast((turn) => ({ ...turn, actions: [...(turn.actions ?? []), proposal] }));
              }
            } else if (event.t === "error" && typeof event.v === "string") {
              setError(event.v);
            }
          }
        }
      } catch {
        setError("Could not reach the assistant. Please try again.");
        setTurns(history);
      } finally {
        setPending(false);
        textareaRef.current?.focus();
      }
    },
    [pending, turns],
  );

  const resolveAction = useCallback(
    async (turnIndex: number, actionIndex: number, confirm: boolean) => {
      const patch = (fn: (a: ActionProposal) => ActionProposal) =>
        setTurns((prev) =>
          prev.map((turn, i) =>
            i === turnIndex
              ? {
                  ...turn,
                  actions: turn.actions?.map((a, j) => (j === actionIndex ? fn(a) : a)),
                }
              : turn,
          ),
        );

      if (!confirm) {
        patch((a) => ({ ...a, state: "cancelled" }));
        return;
      }
      patch((a) => ({ ...a, state: "running" }));
      const action = turns[turnIndex]?.actions?.[actionIndex];
      if (!action) return;
      try {
        const res = await fetch("/api/assistant/action", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name: action.name, input: action.input }),
        });
        const data = await res.json().catch(() => null);
        if (res.ok && data?.ok) {
          patch((a) => ({ ...a, state: "done", result: data.message }));
        } else {
          patch((a) => ({ ...a, state: "failed", result: data?.error ?? "The action failed." }));
        }
      } catch {
        patch((a) => ({ ...a, state: "failed", result: "Could not reach the server." }));
      }
    },
    [turns],
  );

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      {/* Transcript ---------------------------------------------------------- */}
      <div className="flex-1 overflow-y-auto">
        <Container className="max-w-3xl py-8">
          {turns.length === 0 ? (
            <div className="flex flex-col items-center gap-6 py-16 text-center">
              <span className="flex h-14 w-14 items-center justify-center rounded-pill bg-accent-soft">
                <Sparkles className="h-7 w-7 text-accent" aria-hidden="true" />
              </span>
              <div>
                <p className="font-display text-2xl font-semibold text-ink">
                  Ask {ASSISTANT_NAME} about the business
                </p>
                <p className="mx-auto mt-2 max-w-md text-base text-ink-soft">
                  Enquiries, the concept portfolio, and where visitor interest
                  is landing — read live, never guessed.
                </p>
              </div>
              <div className="flex flex-wrap justify-center gap-2">
                {SUGGESTIONS.map((suggestion) => (
                  <button
                    key={suggestion}
                    type="button"
                    onClick={() => send(suggestion)}
                    className="rounded-pill border border-line bg-card px-4 py-2 text-sm text-ink-soft transition-colors hover:border-accent hover:text-accent"
                  >
                    {suggestion}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <ol className="flex flex-col gap-5">
              {turns.map((turn, turnIndex) => (
                <li
                  key={turnIndex}
                  className={cn("flex", turn.role === "user" ? "justify-end" : "justify-start")}
                >
                  <div
                    className={cn(
                      "max-w-[85%] rounded-card px-4 py-3",
                      turn.role === "user"
                        ? "bg-accent text-accent-ink"
                        : "border border-line bg-card text-ink",
                    )}
                  >
                    {turn.tools?.length ? (
                      <p className="mb-2 flex flex-wrap items-center gap-1.5 text-xs text-ink-muted">
                        <Wrench className="h-3.5 w-3.5" aria-hidden="true" />
                        Read: {turn.tools.join(", ")}
                      </p>
                    ) : null}
                    <p className="whitespace-pre-wrap text-base leading-relaxed">
                      {turn.text ||
                        (turn.role === "assistant" && pending && turnIndex === turns.length - 1
                          ? "…"
                          : turn.text)}
                    </p>

                    {turn.actions?.map((action, actionIndex) => (
                      <div
                        key={actionIndex}
                        className="mt-3 rounded-card border border-line bg-surface-alt p-4"
                      >
                        <p className="text-xs font-semibold uppercase tracking-eyebrow text-ink-muted">
                          Needs your confirmation
                        </p>
                        <p className="mt-1 font-semibold text-ink">
                          {ACTION_LABELS[action.name] ?? action.name}
                        </p>
                        <dl className="mt-2 flex flex-col gap-1 text-sm text-ink-soft">
                          {Object.entries(action.input).map(([key, value]) => (
                            <div key={key} className="flex gap-2">
                              <dt className="shrink-0 font-medium text-ink-muted">{key}:</dt>
                              <dd className="min-w-0 break-words">{String(value)}</dd>
                            </div>
                          ))}
                        </dl>
                        {action.state === "pending" ? (
                          <div className="mt-3 flex gap-2">
                            <Button onClick={() => resolveAction(turnIndex, actionIndex, true)}>
                              Confirm
                            </Button>
                            <Button
                              variant="outline"
                              onClick={() => resolveAction(turnIndex, actionIndex, false)}
                            >
                              Cancel
                            </Button>
                          </div>
                        ) : (
                          <p
                            className={cn(
                              "mt-3 flex items-center gap-1.5 text-sm",
                              action.state === "done"
                                ? "text-ink"
                                : action.state === "running"
                                  ? "text-ink-muted"
                                  : "text-ink-muted",
                            )}
                          >
                            {action.state === "running" ? (
                              <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
                            ) : action.state === "done" ? (
                              <CheckCircle2 className="h-4 w-4 text-accent" aria-hidden="true" />
                            ) : (
                              <XCircle className="h-4 w-4" aria-hidden="true" />
                            )}
                            {action.state === "running"
                              ? "Running…"
                              : action.state === "cancelled"
                                ? "Cancelled."
                                : action.result}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                </li>
              ))}
            </ol>
          )}

          {error ? (
            <p className="mt-4 rounded-card border border-line bg-card px-4 py-3 text-sm text-ink-soft">
              {error}
            </p>
          ) : null}
          <div ref={endRef} />
        </Container>
      </div>

      {/* Composer ------------------------------------------------------------ */}
      <div className="border-t border-line bg-card">
        <Container className="max-w-3xl py-4">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              send(input);
            }}
            className="flex items-end gap-2"
          >
            <textarea
              ref={textareaRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  send(input);
                }
              }}
              rows={2}
              placeholder={`Ask ${ASSISTANT_NAME}…`}
              aria-label={`Message ${ASSISTANT_NAME}`}
              className="min-h-[3rem] flex-1 resize-none rounded-card border border-line bg-surface px-4 py-3 text-base text-ink placeholder:text-ink-muted focus:border-accent focus:outline-none"
            />
            <MicButton
              label="Dictate a message"
              onText={(text) => setInput((prev) => (prev ? `${prev} ${text}` : text))}
            />
            <Button type="submit" disabled={pending || !input.trim()} aria-label="Send">
              {pending ? (
                <Loader2 className="h-5 w-5 animate-spin" aria-hidden="true" />
              ) : (
                <Send className="h-5 w-5" aria-hidden="true" />
              )}
            </Button>
          </form>
          <p className="mt-2 text-xs text-ink-muted">
            {ASSISTANT_NAME} reads live data and proposes changes — nothing runs
            without your confirmation.
          </p>
        </Container>
      </div>
    </div>
  );
}
