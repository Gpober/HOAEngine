import { NextResponse } from "next/server";
import { createServerSupabase } from "@/lib/supabase-server";
import { runCreateConcept, runUpdateEnquiry } from "@/lib/assistant/tools";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

/**
 * Executes a Zordon action ONLY after the human confirmed it in the UI. The
 * model never reaches here — the browser posts the confirmed proposal. The
 * write itself still runs as the signed-in admin through RLS.
 */
export async function POST(req: Request) {
  const supabase = await createServerSupabase();
  if (!supabase) {
    return NextResponse.json(
      { ok: false, error: "Supabase is not configured." },
      { status: 503 },
    );
  }

  const { data: isAdmin } = await supabase.rpc("is_admin");
  if (!isAdmin) {
    return NextResponse.json({ ok: false, error: "Admin only." }, { status: 403 });
  }

  let body: { name?: string; input?: unknown };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid request." }, { status: 400 });
  }

  const runners: Record<
    string,
    (input: unknown) => Promise<{ ok: boolean; message: string }>
  > = {
    update_enquiry: (input) => runUpdateEnquiry(supabase, input),
    create_concept: (input) => runCreateConcept(supabase, input),
  };

  const run = body.name ? runners[body.name] : undefined;
  if (run) {
    const result = await run(body.input);
    return NextResponse.json(
      result.ok ? { ok: true, message: result.message } : { ok: false, error: result.message },
      { status: result.ok ? 200 : 400 },
    );
  }

  return NextResponse.json({ ok: false, error: "Unknown action." }, { status: 400 });
}
