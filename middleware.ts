import { createServerClient, type CookieOptions } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

type CookieToSet = { name: string; value: string; options: CookieOptions };

/**
 * Refreshes the Supabase session cookie and gates `/admin`.
 *
 * Everything else on this site is public and stays that way — the marketing
 * page, the demo concepts, robots and sitemap all pass through untouched. Only
 * `/admin` requires a session.
 *
 * The gate here is a redirect for people, not a security boundary. The real
 * boundary is RLS: `hoa_leads` has no SELECT policy for anonymous callers, so
 * even a request that reached the page without a session would read nothing.
 */
const PROTECTED = "/admin";

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

  // With no Supabase configured there are no sessions to refresh and nothing
  // behind the gate worth reaching, so send admin traffic to the login page and
  // leave the public site alone.
  if (!url || !key) {
    if (pathname.startsWith(PROTECTED)) {
      const to = request.nextUrl.clone();
      to.pathname = "/login";
      return NextResponse.redirect(to);
    }
    return NextResponse.next({ request });
  }

  let response = NextResponse.next({ request });

  const supabase = createServerClient(url, key, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet: CookieToSet[]) {
        cookiesToSet.forEach(({ name, value }) =>
          request.cookies.set(name, value),
        );
        response = NextResponse.next({ request });
        cookiesToSet.forEach(({ name, value, options }) =>
          response.cookies.set(name, value, options),
        );
      },
    },
  });

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user && pathname.startsWith(PROTECTED)) {
    const to = request.nextUrl.clone();
    to.pathname = "/login";
    to.searchParams.set("next", pathname);
    return NextResponse.redirect(to);
  }

  if (user && pathname === "/login") {
    const to = request.nextUrl.clone();
    to.pathname = "/admin/leads";
    to.search = "";
    return NextResponse.redirect(to);
  }

  return response;
}

export const config = {
  // Static assets and image optimisation never need a session check.
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|txt|xml|ico)$).*)",
  ],
};
