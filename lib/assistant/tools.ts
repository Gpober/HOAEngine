import type Anthropic from "@anthropic-ai/sdk";
import type { SupabaseClient } from "@supabase/supabase-js";
import { associations as builtInDesigns } from "@/data/associations";

/**
 * Zordon's hands: the tool registry over the HOA Engine business.
 *
 * Every read runs through the caller's own RLS-checked Supabase client — the
 * one bound to the signed-in admin's cookies — so a tool can never read past
 * what the account is allowed to see. There is no service-role key anywhere
 * in this app, and the assistant does not get one either.
 *
 * Reads run freely. The one write (`update_enquiry`) is an ACTION tool: the
 * loop never executes it — it surfaces a confirmation card, and the human
 * clicking Confirm posts it to `/api/assistant/action`.
 */

const LEAD_STATUSES = ["new", "contacted", "qualified", "won", "lost"] as const;
type LeadStatus = (typeof LEAD_STATUSES)[number];

export const ACTION_TOOLS = ["update_enquiry"];

export const ASSISTANT_TOOLS: Anthropic.Tool[] = [
  {
    name: "list_enquiries",
    description:
      "List enquiries from the marketing site contact form (the sales pipeline), newest first. Each has name, email, phone, association_name, location, role (board/manager/resident/other), message, status (new/contacted/qualified/won/lost), internal notes, and — when the visitor requested a call — preferred_date and preferred_time (morning/afternoon/evening).",
    input_schema: {
      type: "object",
      properties: {
        status: {
          type: "string",
          enum: [...LEAD_STATUSES, "all"],
          description: "Filter by pipeline status. Default: all.",
        },
        limit: {
          type: "number",
          description: "Max rows, 1–200. Default 50.",
        },
      },
    },
  },
  {
    name: "enquiry_stats",
    description:
      "Counts of enquiries by pipeline status, plus arrivals per week for the last 12 weeks. Use for 'how is the pipeline' questions before reaching for the full list.",
    input_schema: { type: "object", properties: {} },
  },
  {
    name: "list_communities",
    description:
      "List every website concept: the five built-in design templates (versioned with the code) and every database row — including unpublished drafts, which only admins can see. Returns slug, name, location, type, design, theme, and published state.",
    input_schema: {
      type: "object",
      properties: {
        published: {
          type: "string",
          enum: ["published", "drafts", "all"],
          description: "Filter database rows. Default: all.",
        },
      },
    },
  },
  {
    name: "get_community",
    description:
      "Full detail for one concept by slug: contact fields, amenities, announcements, meetings, documents, FAQs, design and publish state. Checks the database first, then the built-in designs.",
    input_schema: {
      type: "object",
      properties: {
        slug: { type: "string", description: "The concept's slug." },
      },
      required: ["slug"],
    },
  },
  {
    name: "interest_summary",
    description:
      "Anonymous visitor-interest counters from the demo sites (no visitor identities exist — aggregate only), grouped per community and per interaction kind, over a recent window. Use for 'which demos are getting attention' questions.",
    input_schema: {
      type: "object",
      properties: {
        days: {
          type: "number",
          description: "Window in days, 1–365. Default 30.",
        },
      },
    },
  },
  {
    name: "update_enquiry",
    description:
      "GATED ACTION — propose updating an enquiry's pipeline status and/or internal notes. It does not run until the human confirms it. Use the enquiry's id from list_enquiries. Notes replace the existing notes, so carry forward anything worth keeping.",
    input_schema: {
      type: "object",
      properties: {
        id: { type: "string", description: "The enquiry's id (uuid)." },
        status: {
          type: "string",
          enum: [...LEAD_STATUSES],
          description: "New pipeline status.",
        },
        notes: {
          type: "string",
          description: "Replacement internal notes (optional).",
        },
      },
      required: ["id"],
    },
  },
];

/* -------------------------------------------------------------------------- */
/*  Read-tool implementations                                                  */
/* -------------------------------------------------------------------------- */

const asRecord = (input: unknown): Record<string, unknown> =>
  input && typeof input === "object" ? (input as Record<string, unknown>) : {};

function clampInt(v: unknown, fallback: number, min: number, max: number): number {
  const n = typeof v === "number" && Number.isFinite(v) ? Math.floor(v) : fallback;
  return Math.min(max, Math.max(min, n));
}

async function listEnquiries(
  supabase: SupabaseClient,
  input: unknown,
): Promise<string> {
  const { status, limit } = asRecord(input);
  let query = supabase
    .from("hoa_leads")
    .select(
      "id, created_at, name, email, phone, association_name, location, role, message, status, notes, preferred_date, preferred_time",
    )
    .order("created_at", { ascending: false })
    .limit(clampInt(limit, 50, 1, 200));
  if (typeof status === "string" && (LEAD_STATUSES as readonly string[]).includes(status)) {
    query = query.eq("status", status);
  }
  const { data, error } = await query;
  if (error) return `Could not read enquiries: ${error.message}`;
  if (!data?.length) return "No enquiries match.";
  return JSON.stringify(data);
}

async function enquiryStats(supabase: SupabaseClient): Promise<string> {
  const { data, error } = await supabase
    .from("hoa_leads")
    .select("created_at, status")
    .order("created_at", { ascending: false })
    .limit(2000);
  if (error) return `Could not read enquiries: ${error.message}`;
  const rows = data ?? [];
  const byStatus: Record<string, number> = {};
  const byWeek: Record<string, number> = {};
  const cutoff = Date.now() - 12 * 7 * 24 * 3600 * 1000;
  for (const row of rows) {
    byStatus[row.status] = (byStatus[row.status] ?? 0) + 1;
    const t = new Date(row.created_at).getTime();
    if (t >= cutoff) {
      const d = new Date(t);
      // Bucket by the Monday of that week.
      d.setUTCDate(d.getUTCDate() - ((d.getUTCDay() + 6) % 7));
      const key = d.toISOString().slice(0, 10);
      byWeek[key] = (byWeek[key] ?? 0) + 1;
    }
  }
  return JSON.stringify({ total: rows.length, byStatus, arrivalsByWeekStarting: byWeek });
}

interface CommunityRow {
  slug: string;
  name: string;
  city: string | null;
  state: string | null;
  community_type: string | null;
  residence_count: number | null;
  design_style: string;
  design_name: string | null;
  accent_theme: string;
  published: boolean;
}

async function listCommunities(
  supabase: SupabaseClient,
  input: unknown,
): Promise<string> {
  const { published } = asRecord(input);
  let query = supabase
    .from("hoa_associations")
    .select(
      "slug, name, city, state, community_type, residence_count, design_style, design_name, accent_theme, published",
    )
    .order("name");
  if (published === "published") query = query.eq("published", true);
  if (published === "drafts") query = query.eq("published", false);
  const { data, error } = await query;
  const builtIn = builtInDesigns.map((a) => ({
    slug: a.slug,
    name: a.name,
    location: [a.city, a.state].filter(Boolean).join(", ") || null,
    designStyle: a.designStyle,
    accentTheme: a.accentTheme,
  }));
  if (error) {
    return JSON.stringify({
      builtInDesigns: builtIn,
      databaseError: `Could not read hoa_associations: ${error.message}`,
    });
  }
  return JSON.stringify({
    builtInDesigns: builtIn,
    databaseConcepts: (data ?? []) as CommunityRow[],
  });
}

async function getCommunity(
  supabase: SupabaseClient,
  input: unknown,
): Promise<string> {
  const { slug } = asRecord(input);
  if (typeof slug !== "string" || !slug.trim()) return "Pass a slug.";
  const clean = slug.trim().toLowerCase();
  const { data, error } = await supabase
    .from("hoa_associations")
    .select("*")
    .eq("slug", clean)
    .maybeSingle();
  if (error) return `Could not read the community: ${error.message}`;
  if (data) return JSON.stringify(data);
  const builtIn = builtInDesigns.find((a) => a.slug === clean);
  if (builtIn) return JSON.stringify({ source: "built-in design template", ...builtIn });
  return `No concept with slug "${clean}". Use list_communities to see what exists.`;
}

async function interestSummary(
  supabase: SupabaseClient,
  input: unknown,
): Promise<string> {
  const { days } = asRecord(input);
  const window = clampInt(days, 30, 1, 365);
  const since = new Date(Date.now() - window * 24 * 3600 * 1000).toISOString();
  const { data, error } = await supabase
    .from("hoa_events")
    .select("created_at, association_id, kind, interest, target")
    .gte("created_at", since)
    .order("created_at", { ascending: false })
    .limit(5000);
  if (error) return `Could not read interest events: ${error.message}`;
  const rows = data ?? [];
  if (!rows.length) return `No interest events in the last ${window} days.`;

  // Resolve association ids to names in one lookup.
  const { data: names } = await supabase
    .from("hoa_associations")
    .select("id, slug, name");
  const nameById = new Map(
    (names ?? []).map((a: { id: string; slug: string; name: string }) => [
      a.id,
      `${a.name} (${a.slug})`,
    ]),
  );

  const perCommunity: Record<string, { total: number; byKind: Record<string, number>; topTargets: Record<string, number> }> = {};
  for (const row of rows) {
    const key = nameById.get(row.association_id) ?? row.association_id ?? "unknown";
    const bucket = (perCommunity[key] ??= { total: 0, byKind: {}, topTargets: {} });
    bucket.total++;
    if (row.kind) bucket.byKind[row.kind] = (bucket.byKind[row.kind] ?? 0) + 1;
    const target = row.target ?? row.interest;
    if (target) bucket.topTargets[target] = (bucket.topTargets[target] ?? 0) + 1;
  }
  return JSON.stringify({ windowDays: window, events: rows.length, perCommunity });
}

/** Dispatcher for the model's read-tool calls, bound to one request's client. */
export function toolRunner(
  supabase: SupabaseClient,
): (name: string, input: unknown) => Promise<string> {
  return async (name, input) => {
    try {
      switch (name) {
        case "list_enquiries":
          return await listEnquiries(supabase, input);
        case "enquiry_stats":
          return await enquiryStats(supabase);
        case "list_communities":
          return await listCommunities(supabase, input);
        case "get_community":
          return await getCommunity(supabase, input);
        case "interest_summary":
          return await interestSummary(supabase, input);
        default:
          return `Unknown tool: ${name}`;
      }
    } catch (e) {
      return `Tool failed: ${e instanceof Error ? e.message : "unknown error"}`;
    }
  };
}

/* -------------------------------------------------------------------------- */
/*  The confirmed action — called from /api/assistant/action only              */
/* -------------------------------------------------------------------------- */

export async function runUpdateEnquiry(
  supabase: SupabaseClient,
  input: unknown,
): Promise<{ ok: boolean; message: string }> {
  const { id, status, notes } = asRecord(input);
  if (typeof id !== "string" || !id.trim()) {
    return { ok: false, message: "Missing enquiry id." };
  }
  const patch: { status?: LeadStatus; notes?: string } = {};
  if (typeof status === "string") {
    if (!(LEAD_STATUSES as readonly string[]).includes(status)) {
      return { ok: false, message: `Status must be one of: ${LEAD_STATUSES.join(", ")}.` };
    }
    patch.status = status as LeadStatus;
  }
  if (typeof notes === "string") patch.notes = notes.slice(0, 4000);
  if (!Object.keys(patch).length) {
    return { ok: false, message: "Nothing to change — pass a status and/or notes." };
  }
  const { data, error } = await supabase
    .from("hoa_leads")
    .update(patch)
    .eq("id", id.trim())
    .select("id, name, status")
    .maybeSingle();
  if (error) return { ok: false, message: `Update failed: ${error.message}` };
  if (!data) return { ok: false, message: "No enquiry with that id (or no permission to change it)." };
  return {
    ok: true,
    message: `Updated ${data.name} — status ${data.status}${patch.notes !== undefined ? ", notes saved" : ""}.`,
  };
}
