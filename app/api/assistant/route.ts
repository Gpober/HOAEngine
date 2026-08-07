import { NextResponse } from "next/server";
import { createServerSupabase } from "@/lib/supabase-server";
import {
  assistantConfigured,
  normalizeIncomingMessages,
  runAssistant,
} from "@/lib/assistant/llm";
import { buildSystemPrompt } from "@/lib/assistant/prompt";
import { ACTION_TOOLS, ASSISTANT_TOOLS, toolRunner } from "@/lib/assistant/tools";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";
// Tool loops can run several model round-trips; give them room.
export const maxDuration = 120;

/**
 * Zordon's brain, behind two locks: the route refuses anyone `is_admin()`
 * denies, and every tool read still runs through the caller's own RLS-checked
 * client — so even a bug here could not read past what the signed-in account
 * is allowed to see.
 */
export async function POST(req: Request) {
  const supabase = await createServerSupabase();
  if (!supabase) {
    return NextResponse.json(
      { error: "Supabase is not configured." },
      { status: 503 },
    );
  }

  const { data: isAdmin } = await supabase.rpc("is_admin");
  if (!isAdmin) {
    return NextResponse.json(
      { error: "The assistant is admin-only." },
      { status: 403 },
    );
  }

  if (!assistantConfigured()) {
    return NextResponse.json(
      { error: "The assistant isn’t configured yet — set ANTHROPIC_API_KEY." },
      { status: 503 },
    );
  }

  let body: { messages?: unknown };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  const messages = normalizeIncomingMessages(body.messages);
  if (messages.length === 0 || messages[messages.length - 1].role !== "user") {
    return NextResponse.json({ error: "Expected a user message." }, { status: 400 });
  }

  const system = buildSystemPrompt();
  const run = toolRunner(supabase);

  // NDJSON stream: one JSON object per line. {t:'text'|'tool'|'action'|'error', v:...}
  const encoder = new TextEncoder();
  const stream = new ReadableStream({
    async start(controller) {
      const send = (obj: unknown) =>
        controller.enqueue(encoder.encode(JSON.stringify(obj) + "\n"));
      try {
        for await (const event of runAssistant(system, messages, {
          tools: ASSISTANT_TOOLS,
          run,
          actionTools: ACTION_TOOLS,
        })) {
          if (event.type === "text") send({ t: "text", v: event.text });
          else if (event.type === "action")
            send({ t: "action", v: { name: event.name, input: event.input } });
          else send({ t: "tool", v: event.name });
        }
      } catch (e) {
        send({
          t: "error",
          v: e instanceof Error ? e.message : "The assistant hit an error.",
        });
      } finally {
        controller.close();
      }
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "application/x-ndjson; charset=utf-8",
      "Cache-Control": "no-store",
      "X-Accel-Buffering": "no",
    },
  });
}
