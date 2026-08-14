# Business HQ — the claude.ai connector

A remote MCP server built into this deployment at `/api/hq`, exposing both
businesses on the shared Supabase project as tools for claude.ai:

| Tool | What it does |
| --- | --- |
| `business_snapshot` | Counts across everything: pipeline, intakes, concepts, prospect scan |
| `list_enquiries` | Condo Seen pipeline, with requested call times |
| `update_enquiry` | Change an enquiry's status / notes |
| `list_intakes` | Start-page concept intakes |
| `list_prospects` | The Florida scan, by tier (stale / no-website / …) and county |
| `list_communities` | Concepts in the database, published and drafts |
| `lookup_condo` | HOA Daddy warrantability dataset (owner use) |

## One-time setup

1. **Supabase secret key** — Supabase dashboard → Project Settings → API →
   copy the `secret` key. In Vercel → the site's project → Settings →
   Environment Variables, add `SUPABASE_SECRET_KEY` with that value
   (Production only is fine).

   > This is the repo's one deliberate exception to "no service key
   > anywhere": a connector has no user session, so `/api/hq` runs with the
   > secret key behind the connector token. It is used nowhere else.

2. **Connector token** — generate a long random token
   (`openssl rand -hex 24`) and add it as `MCP_CONNECTOR_SECRET` in the same
   place. An unset token means the endpoint answers 401 to everyone —
   unconfigured is closed.

3. **Redeploy** so the environment variables take effect.

4. **Add the connector** — claude.ai → Settings → Connectors → *Add custom
   connector* → URL:

   ```
   https://www.condoseen.com/api/hq?key=<MCP_CONNECTOR_SECRET>
   ```

   No OAuth; the token in the URL is the credential. **Treat the full URL as
   a secret** — anyone holding it can read the pipeline and the dataset.
   Rotate by changing `MCP_CONNECTOR_SECRET` and updating the connector URL.

## Extending to the other platforms

Tulips Talent and PDS Logix live on their own Supabase projects and Vercel
deployments; the same pattern (this route file + `lib/mcp/hq.ts`, pointed at
their tables) drops into each repo, giving each platform its own connector
URL. One connector per platform keeps credentials scoped — a leaked Condo
Seen URL never exposes talent or field-service data.
