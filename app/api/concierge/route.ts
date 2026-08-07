import Anthropic from "@anthropic-ai/sdk";
import { NextResponse, type NextRequest } from "next/server";
import { getAssociation } from "@/data/associations";
import { CONCIERGE_SLUGS } from "@/lib/concierge/enabled";
import {
  CONCIERGE_MAX_TOKENS,
  CONCIERGE_MODEL,
  buildConciergePrompt,
} from "@/lib/concierge/prompt";
import { SITE_CONCIERGE_SLUG, buildSitePrompt } from "@/lib/concierge/site-prompt";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";



/* -------------------------------------------------------------------------- */
/*  Cost control                                                               */

const MAX_QUESTION_CHARS = 500;
const MAX_TURNS = 12; // user+assistant messages carried into one conversation
const WINDOW_MS = 60_000;
const MAX_PER_WINDOW = 8;

/**
 * Per-IP limiter, in memory.
 *
 * Deliberately modest: this is a demo on a serverless runtime, so the map is
 * per-instance and a determined caller could get more through by landing on
 * different instances. It is a spend guard against a stuck client or a curious
 * visitor, not an anti-abuse system. Before this goes on a paying customer's
 * site it needs a shared counter — a Supabase table or Redis — and a monthly
 * ceiling per association.
 */
const hits = new Map<string, number[]>();

function rateLimited(ip: string): boolean {
  const now = Date.now();
  const recent = (hits.get(ip) ?? []).filter((t) => now - t < WINDOW_MS);
  recent.push(now);
  hits.set(ip, recent);

  // Keep the map from growing without bound on a long-lived instance.
  if (hits.size > 5_000) {
    for (const [key, times] of hits) {
      if (!times.some((t) => now - t < WINDOW_MS)) hits.delete(key);
    }
  }
  return recent.length > MAX_PER_WINDOW;
}

/* -------------------------------------------------------------------------- */

interface Turn {
  role: "user" | "assistant";
  content: string;
}

export async function POST(request: NextRequest) {
  let body: { slug?: string; messages?: Turn[] };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Bad request." }, { status: 400 });
  }

  /*
   * Two guides share this route: the community concierge on enabled demos,
   * and the site guide on the marketing page (a pseudo-slug, so it can never
   * collide with a real association). Same limits, same key, different
   * grounding.
   */
  const slug = String(body.slug ?? "");
  const isSiteGuide = slug === SITE_CONCIERGE_SLUG;
  if (!isSiteGuide && !CONCIERGE_SLUGS.has(slug)) {
    return NextResponse.json({ error: "Not available here." }, { status: 404 });
  }

  const association = isSiteGuide ? null : getAssociation(slug);
  if (!isSiteGuide && !association) {
    return NextResponse.json({ error: "Not available here." }, { status: 404 });
  }

  const incoming = Array.isArray(body.messages) ? body.messages : [];
  const messages = incoming
    .filter(
      (m): m is Turn =>
        !!m &&
        (m.role === "user" || m.role === "assistant") &&
        typeof m.content === "string" &&
        m.content.trim().length > 0,
    )
    // Trim from the front: the newest turns are the ones worth keeping.
    .slice(-MAX_TURNS)
    .map((m) => ({ role: m.role, content: m.content.slice(0, MAX_QUESTION_CHARS) }));

  if (!messages.length || messages[messages.length - 1].role !== "user") {
    return NextResponse.json({ error: "Bad request." }, { status: 400 });
  }

  /*
   * Order matters here. A malformed request is malformed whether or not this
   * deployment has a key, so it earns a 400 on its own merits — checking
   * configuration first made every bad request look like a 503 and hid the
   * real fault. Rate limiting comes next so a flood is turned away before the
   * expensive call, and the key check sits last, immediately before the only
   * thing that needs it.
   */
  const ip =
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    request.headers.get("x-real-ip") ||
    "unknown";
  if (rateLimited(ip)) {
    return NextResponse.json(
      { error: "That is a lot of questions at once — give it a moment." },
      { status: 429 },
    );
  }

  const key = process.env.ANTHROPIC_API_KEY;
  if (!key) {
    // Configuration is missing, not broken. Say which, so it is obvious in a
    // preview deploy rather than looking like a model failure.
    return NextResponse.json(
      { error: "The guide is not configured yet.", reason: "no_api_key" },
      { status: 503 },
    );
  }


  try {
    const anthropic = new Anthropic({ apiKey: key });
    const response = await anthropic.messages.create({
      model: CONCIERGE_MODEL,
      max_tokens: CONCIERGE_MAX_TOKENS,
      system: association ? buildConciergePrompt(association) : buildSitePrompt(),
      messages,
    });

    const reply = response.content
      .filter((block): block is Anthropic.TextBlock => block.type === "text")
      .map((block) => block.text)
      .join("")
      .trim();

    if (!reply) {
      return NextResponse.json(
        { error: "No answer came back. Please try again." },
        { status: 502 },
      );
    }

    return NextResponse.json({ reply });
  } catch (error) {
    console.error("concierge", error instanceof Error ? error.message : error);
    return NextResponse.json(
      { error: "Something went wrong. Please try again." },
      { status: 502 },
    );
  }
}
