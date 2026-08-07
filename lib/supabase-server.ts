import { createServerClient, type CookieOptions } from "@supabase/ssr";
import { cookies } from "next/headers";
import type { SupabaseClient } from "@supabase/supabase-js";

type CookieToSet = { name: string; value: string; options: CookieOptions };

/**
 * Server-side Supabase client bound to the request cookies.
 *
 * Distinct from `lib/supabase.ts`, which is the anonymous read-only client the
 * public pages use. This one runs as the *logged-in user*, so every read and
 * write is checked by RLS on the database rather than by anything in this app.
 * That is what makes the admin views safe: there is no service-role key here,
 * so a bug in a page cannot read past what the signed-in account is allowed to
 * see.
 *
 * Returns null when Supabase is not configured, so the app still builds and
 * runs with no environment at all — the same contract the public client keeps.
 */
export async function createServerSupabase(): Promise<SupabaseClient | null> {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
  if (!url || !key) return null;

  const cookieStore = await cookies();

  return createServerClient(url, key, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet: CookieToSet[]) {
        try {
          cookiesToSet.forEach(({ name, value, options }) =>
            cookieStore.set(name, value, options),
          );
        } catch {
          // Called from a Server Component, where cookies are read-only. Safe
          // to ignore: the middleware refreshes the session on every request.
        }
      },
    },
  });
}
