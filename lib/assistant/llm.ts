import Anthropic from "@anthropic-ai/sdk";
import { ASSISTANT_MAX_TOKENS, ASSISTANT_MODEL } from "./config";

/**
 * The provider seam, ported from the Tulips / PDS Logix platforms. Everything
 * model-specific lives here so the rest of the assistant talks to one small
 * interface — swap Claude for anything in this file alone. Server-only: the
 * API key never reaches the browser.
 *
 * Text-only for now (the sibling platforms accept images and PDFs; this one
 * can grow that when there is something to attach).
 */

export type AssistantRole = "user" | "assistant";
export interface AssistantMessage {
  role: AssistantRole;
  content: string;
}

// Generous so a pasted-in list survives (admin-only tool).
const MAX_TEXT = 50_000;

/** Filter to valid user/assistant turns, cap text, keep the last 20. */
export function normalizeIncomingMessages(raw: unknown): AssistantMessage[] {
  const incoming = Array.isArray(raw) ? raw : [];
  return incoming
    .filter(
      (m): m is { role: string; content: unknown } =>
        !!m &&
        typeof m === "object" &&
        "role" in m &&
        ((m as { role: string }).role === "user" ||
          (m as { role: string }).role === "assistant"),
    )
    .map((m) => ({
      role: m.role as AssistantRole,
      content:
        typeof m.content === "string" ? m.content.slice(0, MAX_TEXT) : "",
    }))
    .filter((m) => m.content.trim().length > 0)
    .slice(-20);
}

/**
 * What the loop streams out: answer text as it's written, a marker each time
 * Zordon reaches for a tool, and — for gated write tools — an `action`
 * proposal the human must confirm before anything runs.
 */
export type AssistantEvent =
  | { type: "text"; text: string }
  | { type: "tool"; name: string }
  | { type: "action"; name: string; input: unknown };

export interface ToolLoopOptions {
  tools: Anthropic.Tool[];
  run: (name: string, input: unknown) => Promise<string>;
  maxSteps?: number;
  /**
   * Names of "proposal" tools: instead of running, the loop surfaces them as
   * an `action` event for the human to confirm, and tells the model it's
   * pending.
   */
  actionTools?: string[];
}

export const assistantConfigured = (): boolean =>
  Boolean(process.env.ANTHROPIC_API_KEY);

let cached: Anthropic | null = null;
function client(): Anthropic {
  if (!cached) cached = new Anthropic();
  return cached;
}

/**
 * The brain: an agentic loop. Zordon reads live data through his tools, as
 * many rounds as he needs, and we stream the answer text as it comes.
 * Thinking blocks are preserved between turns (required for tool use with
 * extended thinking); we never surface them to the client.
 */
export async function* runAssistant(
  system: string,
  messages: AssistantMessage[],
  opts: ToolLoopOptions,
): AsyncGenerator<AssistantEvent> {
  const maxSteps = opts.maxSteps ?? 8;
  const convo: Anthropic.MessageParam[] = messages.map((m) => ({
    role: m.role,
    content: m.content,
  }));

  for (let step = 0; step < maxSteps; step++) {
    const stream = client().messages.stream({
      model: ASSISTANT_MODEL,
      max_tokens: ASSISTANT_MAX_TOKENS,
      thinking: { type: "adaptive" },
      system,
      ...(opts.tools.length ? { tools: opts.tools } : {}),
      messages: convo,
    });

    for await (const event of stream) {
      if (
        event.type === "content_block_delta" &&
        event.delta.type === "text_delta"
      ) {
        yield { type: "text", text: event.delta.text };
      }
    }

    const final = await stream.finalMessage();
    convo.push({ role: "assistant", content: final.content });

    const toolUses = final.content.filter(
      (b): b is Anthropic.ToolUseBlock => b.type === "tool_use",
    );
    if (final.stop_reason !== "tool_use" || toolUses.length === 0) return;

    const actionSet = new Set(opts.actionTools ?? []);
    const results: Anthropic.ToolResultBlockParam[] = [];
    for (const tu of toolUses) {
      if (actionSet.has(tu.name)) {
        // A gated write: propose it to the human, don't run it. Tell the
        // model it's pending so it wraps up instead of claiming success.
        yield { type: "action", name: tu.name, input: tu.input };
        results.push({
          type: "tool_result",
          tool_use_id: tu.id,
          content:
            "Proposed to the user for confirmation. It has NOT run yet — the user will confirm or cancel it themselves. Tell them it is ready for their confirmation below; do not claim it is done or repeat the same proposal.",
        });
        continue;
      }
      yield { type: "tool", name: tu.name };
      const out = await opts.run(tu.name, tu.input);
      results.push({ type: "tool_result", tool_use_id: tu.id, content: out });
    }
    convo.push({ role: "user", content: results });
  }

  yield {
    type: "text",
    text: "\n\n(I hit my analysis-step limit for this answer — ask me to keep going if you need more.)",
  };
}
