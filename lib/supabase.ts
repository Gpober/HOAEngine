import { createClient, type SupabaseClient } from "@supabase/supabase-js";

/**
 * Read-only Supabase client for fetching published association concepts.
 *
 * Uses the publishable (anon) key and reads a table whose RLS policy exposes
 * only `published` rows, so nothing sensitive is reachable from the browser
 * bundle even though the key ships publicly.
 *
 * Both variables are optional. With them unset the app falls back to the
 * bundled records in `data/associations.ts`, so the project still builds and
 * runs with no configuration at all.
 */
const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const key = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

let client: SupabaseClient | null = null;

export function getSupabase(): SupabaseClient | null {
  if (!url || !key) return null;
  if (!client) {
    client = createClient(url, key, {
      auth: { persistSession: false, autoRefreshToken: false },
    });
  }
  return client;
}

export const supabaseConfigured = Boolean(url && key);

/** Public URL for an object in the community media bucket. */
export function mediaUrl(path: string): string | undefined {
  if (!path) return undefined;
  // Already a full URL or a local /public path — use as-is.
  if (/^https?:\/\//.test(path) || path.startsWith("/")) return path;
  const supabase = getSupabase();
  if (!supabase) return undefined;
  return supabase.storage.from("hoa-engine-media").getPublicUrl(path).data.publicUrl;
}
