import Anthropic from "@anthropic-ai/sdk";
import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";
import { DOC_CATEGORIES, DOC_CATEGORY_VALUES } from "@/lib/onboard/categories";

export const runtime = "nodejs";
export const maxDuration = 60;

/**
 * Document auto-classifier. After a board uploads a document, the browser
 * calls this with the file's storage path; the server reads the file and asks
 * Claude which statutory record type it is, writing the guess to
 * hoa_uploads.suggested_category. The team confirms on publish — the board
 * never has to classify anything precisely.
 *
 * Degrades gracefully: no API key, a non-PDF, an oversized file, or a model
 * error all leave the board's own selection intact and simply skip the guess.
 * Token-gated and path-scoped like the sign route — it can only read a file
 * inside the requesting community's own folder.
 */

// A light, cheap model is right for a single-label classification.
const CLASSIFY_MODEL = "claude-haiku-4-5-20251001";
const MAX_BYTES = 12 * 1024 * 1024; // skip very large PDFs to protect the function

function serviceClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SECRET_KEY;
  if (!url || !key) return null;
  return createClient(url, key, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}

async function mark(
  supabase: SupabaseClient,
  path: string,
  status: string,
  category?: string,
) {
  await supabase
    .from("hoa_uploads")
    .update({ classify_status: status, ...(category ? { suggested_category: category } : {}) })
    .eq("path", path);
}

export async function POST(request: Request) {
  const supabase = serviceClient();
  if (!supabase) {
    return NextResponse.json({ status: "skipped" }, { status: 200 });
  }

  let body: { token?: string; path?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Bad request." }, { status: 400 });
  }
  const { token, path } = body;
  if (!token || !path) {
    return NextResponse.json({ error: "Missing fields." }, { status: 400 });
  }

  // Token must own the community whose folder the path lives in.
  const { data: community } = await supabase
    .from("hoa_associations")
    .select("slug")
    .eq("upload_token", token)
    .maybeSingle();
  if (!community || !path.startsWith(`${community.slug}/`)) {
    return NextResponse.json({ error: "Not allowed." }, { status: 403 });
  }

  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    await mark(supabase, path, "skipped");
    return NextResponse.json({ status: "skipped" }, { status: 200 });
  }

  if (!path.toLowerCase().endsWith(".pdf")) {
    await mark(supabase, path, "skipped");
    return NextResponse.json({ status: "skipped", reason: "not a pdf" }, { status: 200 });
  }

  const { data: file, error: dlError } = await supabase.storage
    .from("community-uploads")
    .download(path);
  if (dlError || !file) {
    await mark(supabase, path, "error");
    return NextResponse.json({ status: "error" }, { status: 200 });
  }
  const bytes = new Uint8Array(await file.arrayBuffer());
  if (bytes.byteLength > MAX_BYTES) {
    await mark(supabase, path, "skipped");
    return NextResponse.json({ status: "skipped", reason: "too large" }, { status: 200 });
  }
  const base64 = Buffer.from(bytes).toString("base64");

  const menu = DOC_CATEGORIES.map((c) => `- ${c.value}: ${c.label} (${c.hint})`).join("\n");

  try {
    const anthropic = new Anthropic({ apiKey });
    const res = await anthropic.messages.create({
      model: CLASSIFY_MODEL,
      max_tokens: 20,
      system:
        "You classify a Florida condominium association's official record into exactly one category. " +
        "Reply with only the category's lowercase value from the list — no punctuation, no explanation.",
      messages: [
        {
          role: "user",
          content: [
            {
              type: "document",
              source: { type: "base64", media_type: "application/pdf", data: base64 },
            },
            {
              type: "text",
              text: `Categories:\n${menu}\n\nReturn only the single best value.`,
            },
          ],
        },
      ],
    });
    const first = res.content.find((b) => b.type === "text");
    const guess = first && first.type === "text" ? first.text.trim().toLowerCase() : "";
    const category = DOC_CATEGORY_VALUES.has(guess) ? guess : "other";
    await mark(supabase, path, "done", category);
    return NextResponse.json({ status: "done", suggested: category });
  } catch {
    await mark(supabase, path, "error");
    return NextResponse.json({ status: "error" }, { status: 200 });
  }
}
