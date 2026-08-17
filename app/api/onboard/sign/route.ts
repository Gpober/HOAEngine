import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";

export const runtime = "nodejs";

/**
 * Onboarding upload signer.
 *
 * A paying board reaches /onboard/<token> and drops photos, a logo, and
 * documents. This route validates the community's upload token and hands
 * back a short-lived signed upload URL scoped to that community's folder in
 * the private `community-uploads` bucket — the browser then uploads straight
 * to storage, so no file passes through this function (no serverless body
 * limit) and the service key never leaves the server.
 *
 * Service key exception: like /api/hq, an onboarding board has no user
 * session, so this runs with SUPABASE_SECRET_KEY behind the per-community
 * token. It can only ever write into that one community's folder.
 */

const ALLOWED = new Set([
  "image/jpeg", "image/png", "image/webp", "image/heic", "image/gif", "application/pdf",
]);
const KINDS = new Set(["photo", "logo", "document", "other"]);

function serviceClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SECRET_KEY;
  if (!url || !key) return null;
  return createClient(url, key, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}

function safeName(name: string): string {
  const base = name.split(/[\\/]/).pop() ?? "file";
  return base.replace(/[^a-zA-Z0-9._-]/g, "_").slice(0, 120) || "file";
}

export async function POST(request: Request) {
  const supabase = serviceClient();
  if (!supabase) {
    return NextResponse.json({ error: "Uploads are not configured." }, { status: 503 });
  }

  let body: { token?: string; filename?: string; contentType?: string; kind?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Bad request." }, { status: 400 });
  }

  const { token, filename, contentType } = body;
  const kind = KINDS.has(body.kind ?? "") ? body.kind! : "other";
  if (!token || !filename || !contentType) {
    return NextResponse.json({ error: "Missing fields." }, { status: 400 });
  }
  if (!ALLOWED.has(contentType)) {
    return NextResponse.json({ error: "That file type isn't supported." }, { status: 415 });
  }

  const { data: community, error: lookupError } = await supabase
    .from("hoa_associations")
    .select("slug")
    .eq("upload_token", token)
    .maybeSingle();
  if (lookupError || !community) {
    return NextResponse.json({ error: "This upload link isn't valid." }, { status: 403 });
  }

  const path = `${community.slug}/${Date.now()}_${safeName(filename)}`;
  const { data: signed, error: signError } = await supabase.storage
    .from("community-uploads")
    .createSignedUploadUrl(path);
  if (signError || !signed) {
    return NextResponse.json({ error: "Could not start the upload." }, { status: 500 });
  }

  await supabase.from("hoa_uploads").insert({
    slug: community.slug,
    path,
    original_name: safeName(filename),
    content_type: contentType,
    kind,
  });

  return NextResponse.json({ path: signed.path, token: signed.token });
}
