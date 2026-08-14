import { createClient, type SupabaseClient } from "@supabase/supabase-js";

/**
 * Business HQ — the data layer behind the /api/hq MCP connector.
 *
 * One deliberate exception to this repo's "no service key anywhere" rule
 * lives here: a claude.ai connector has no user session, so these tools run
 * with `SUPABASE_SECRET_KEY` — set only in Vercel, never in code — behind
 * the connector token check in the route. Everything else in the app still
 * runs RLS-checked as the signed-in user.
 *
 * Covers both businesses on this Supabase project:
 * - Condo Seen: enquiries, intakes, concepts, prospect scans
 * - HOA Daddy: the condo_projects warrantability dataset (owner's own use)
 */

export function hqConfigured(): boolean {
  return Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.SUPABASE_SECRET_KEY,
  );
}

export function hqClient(): SupabaseClient {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SECRET_KEY;
  if (!url || !key) {
    throw new Error(
      "HQ connector is not configured — set SUPABASE_SECRET_KEY in the deployment environment.",
    );
  }
  return createClient(url, key, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}

const LEAD_STATUSES = ["new", "contacted", "qualified", "won", "lost"];

export async function businessSnapshot(): Promise<string> {
  const supabase = hqClient();
  const [leads, intakes, scans, concepts] = await Promise.all([
    supabase.from("hoa_leads").select("status"),
    supabase.from("hoa_intakes").select("status"),
    supabase.from("hoa_site_scans").select("status, copyright_year"),
    supabase.from("hoa_associations").select("published"),
  ]);
  const count = (rows: { [k: string]: unknown }[] | null, key: string) => {
    const out: Record<string, number> = {};
    for (const r of rows ?? []) {
      const v = String(r[key]);
      out[v] = (out[v] ?? 0) + 1;
    }
    return out;
  };
  const stale = (scans.data ?? []).filter(
    (s) => s.status === "found" && s.copyright_year !== null && s.copyright_year < 2024,
  ).length;
  return JSON.stringify({
    enquiriesByStatus: count(leads.data, "status"),
    intakesByStatus: count(intakes.data, "status"),
    concepts: count(concepts.data, "published"),
    prospectScan: {
      ...count(scans.data, "status"),
      staleSitesBefore2024: stale,
    },
  });
}

export async function listEnquiries(input: {
  status?: string;
  limit?: number;
}): Promise<string> {
  const supabase = hqClient();
  let query = supabase
    .from("hoa_leads")
    .select(
      "id, created_at, name, email, phone, association_name, location, role, message, status, notes, preferred_date, preferred_time",
    )
    .order("created_at", { ascending: false })
    .limit(Math.min(200, Math.max(1, input.limit ?? 50)));
  if (input.status && LEAD_STATUSES.includes(input.status)) {
    query = query.eq("status", input.status);
  }
  const { data, error } = await query;
  if (error) return `Error: ${error.message}`;
  return data?.length ? JSON.stringify(data) : "No enquiries match.";
}

export async function updateEnquiry(input: {
  id: string;
  status?: string;
  notes?: string;
}): Promise<string> {
  if (input.status && !LEAD_STATUSES.includes(input.status)) {
    return `Error: status must be one of ${LEAD_STATUSES.join(", ")}.`;
  }
  const patch: Record<string, string> = {};
  if (input.status) patch.status = input.status;
  if (typeof input.notes === "string") patch.notes = input.notes.slice(0, 4000);
  if (!Object.keys(patch).length) return "Nothing to change.";
  const { data, error } = await hqClient()
    .from("hoa_leads")
    .update(patch)
    .eq("id", input.id)
    .select("id, name, status")
    .maybeSingle();
  if (error) return `Error: ${error.message}`;
  if (!data) return "No enquiry with that id.";
  return `Updated ${data.name} — status ${data.status}.`;
}

export async function listIntakes(input: { status?: string }): Promise<string> {
  const supabase = hqClient();
  let query = supabase
    .from("hoa_intakes")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(50);
  if (input.status && ["new", "built", "declined"].includes(input.status)) {
    query = query.eq("status", input.status);
  }
  const { data, error } = await query;
  if (error) return `Error: ${error.message}`;
  return data?.length ? JSON.stringify(data) : "No intakes match.";
}

export async function listProspects(input: {
  tier?: string;
  county?: string;
  limit?: number;
}): Promise<string> {
  const supabase = hqClient();
  let query = supabase
    .from("hoa_site_scans")
    .select("project_name, county, status, domain, copyright_year, is_wordpress, page_title")
    .limit(Math.min(500, Math.max(1, input.limit ?? 100)));

  if (input.county) query = query.ilike("county", `%${input.county}%`);

  // Tier semantics mirror the prospect report.
  if (input.tier === "stale") {
    query = query.eq("status", "found").lt("copyright_year", 2024);
  } else if (input.tier === "site-no-year") {
    query = query.eq("status", "found").is("copyright_year", null);
  } else if (input.tier === "no-website") {
    query = query.eq("status", "no_site");
  } else if (input.tier === "current") {
    query = query.eq("status", "found").gte("copyright_year", 2024);
  }

  const { data, error } = await query.order("county").order("project_name");
  if (error) return `Error: ${error.message}`;
  return data?.length ? JSON.stringify(data) : "No prospects match.";
}

export async function listCommunities(input: { published?: boolean }): Promise<string> {
  const supabase = hqClient();
  let query = supabase
    .from("hoa_associations")
    .select("slug, name, city, state, community_type, design_style, published, created_at")
    .order("created_at", { ascending: false });
  if (typeof input.published === "boolean") query = query.eq("published", input.published);
  const { data, error } = await query;
  if (error) return `Error: ${error.message}`;
  return data?.length ? JSON.stringify(data) : "No concepts yet.";
}

export async function lookupCondo(input: {
  name?: string;
  county?: string;
  state?: string;
  limit?: number;
}): Promise<string> {
  const supabase = hqClient();
  let query = supabase
    .from("condo_projects")
    .select(
      "id, project_name, county, state, zip_code, condo_review, review_date, budget_expiration, insurance_expiration, questionnaire_expiration",
    )
    .limit(Math.min(50, Math.max(1, input.limit ?? 10)));
  if (input.name) query = query.ilike("project_name", `%${input.name}%`);
  if (input.county) query = query.ilike("county", `%${input.county}%`);
  if (input.state) query = query.eq("state", input.state.toUpperCase());
  const { data, error } = await query.order("project_name");
  if (error) return `Error: ${error.message}`;
  return data?.length ? JSON.stringify(data) : "No condo projects match.";
}
