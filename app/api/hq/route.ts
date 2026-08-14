import { createMcpHandler } from "mcp-handler";
import { z } from "zod";
import {
  businessSnapshot,
  listCommunities,
  listEnquiries,
  listIntakes,
  listProspects,
  lookupCondo,
  updateEnquiry,
} from "@/lib/mcp/hq";

export const runtime = "nodejs";
export const maxDuration = 60;

/**
 * Business HQ — a remote MCP server for claude.ai's custom connectors,
 * covering Condo Seen (enquiries, intakes, concepts, prospect scans) and
 * HOA Daddy (the condo warrantability dataset) from the one shared Supabase.
 *
 * Auth: the connector URL carries `?key=<MCP_CONNECTOR_SECRET>`, checked on
 * every request before the MCP handler runs. claude.ai custom connectors
 * cannot send custom headers without OAuth, so the long random token in the
 * URL is the credential — treat the full URL as a secret.
 */

const text = (value: string) => ({
  content: [{ type: "text" as const, text: value }],
});

const handler = createMcpHandler(
  (server) => {
    server.registerTool(
      "business_snapshot",
      {
        description:
          "Counts across the whole business: enquiries by pipeline status, intakes, published/draft concepts, and the Florida prospect scan (including stale pre-2024 websites). Start here for 'how are we doing'.",
        inputSchema: z.object({}),
      },
      async () => text(await businessSnapshot()),
    );

    server.registerTool(
      "list_enquiries",
      {
        description:
          "Condo Seen sales pipeline: contact-form enquiries, newest first, with any requested call day/time.",
        inputSchema: z.object({
          status: z
            .enum(["new", "contacted", "qualified", "won", "lost"])
            .optional()
            .describe("Filter by pipeline status"),
          limit: z.number().optional().describe("Max rows, default 50, cap 200"),
        }),
      },
      async (args) => text(await listEnquiries(args)),
    );

    server.registerTool(
      "update_enquiry",
      {
        description:
          "Update an enquiry's pipeline status and/or replace its internal notes. Use the id from list_enquiries.",
        inputSchema: z.object({
          id: z.string().describe("Enquiry id (uuid)"),
          status: z
            .enum(["new", "contacted", "qualified", "won", "lost"])
            .optional(),
          notes: z.string().optional().describe("Replacement internal notes"),
        }),
      },
      async (args) => text(await updateEnquiry(args)),
    );

    server.registerTool(
      "list_intakes",
      {
        description:
          "Concept intake requests from the Start page — a board described its community and asked for a website concept.",
        inputSchema: z.object({
          status: z.enum(["new", "built", "declined"]).optional(),
        }),
      },
      async (args) => text(await listIntakes(args)),
    );

    server.registerTool(
      "list_prospects",
      {
        description:
          "The Florida prospect scan (1,314 condos): tier 'stale' = website with pre-2024 copyright (warmest), 'site-no-year' = site without a visible year, 'no-website' = none found (compliance pitch), 'current' = maintained site. Filter by county.",
        inputSchema: z.object({
          tier: z
            .enum(["stale", "site-no-year", "no-website", "current"])
            .optional(),
          county: z
            .string()
            .optional()
            .describe("County name, partial ok (e.g. BROWARD)"),
          limit: z.number().optional().describe("Max rows, default 100, cap 500"),
        }),
      },
      async (args) => text(await listProspects(args)),
    );

    server.registerTool(
      "list_communities",
      {
        description:
          "Condo Seen website concepts in the database — published demos and unpublished drafts.",
        inputSchema: z.object({
          published: z
            .boolean()
            .optional()
            .describe("true = live demos, false = drafts"),
        }),
      },
      async (args) => text(await listCommunities(args)),
    );

    server.registerTool(
      "lookup_condo",
      {
        description:
          "HOA Daddy warrantability dataset: search condo projects by name/county/state. Returns review status and budget/insurance/questionnaire expirations. Owner use only — this is the paid dataset.",
        inputSchema: z.object({
          name: z.string().optional().describe("Project name, partial ok"),
          county: z.string().optional().describe("County, partial ok"),
          state: z.string().optional().describe("Two-letter state, e.g. FL"),
          limit: z.number().optional().describe("Max rows, default 10, cap 50"),
        }),
      },
      async (args) => text(await lookupCondo(args)),
    );
  },
  {
    serverInfo: { name: "business-hq", version: "1.0.0" },
  },
);

function authorized(request: Request): boolean {
  const secret = process.env.MCP_CONNECTOR_SECRET;
  if (!secret) return false; // unconfigured = closed
  const key = new URL(request.url).searchParams.get("key");
  return key === secret;
}

const guarded = (request: Request) =>
  authorized(request)
    ? handler(request)
    : new Response(JSON.stringify({ error: "unauthorized" }), {
        status: 401,
        headers: { "Content-Type": "application/json" },
      });

export { guarded as GET, guarded as POST, guarded as DELETE };
