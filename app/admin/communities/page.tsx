import { ArrowRight, Building2 } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { Card } from "@/components/ui/Card";
import { Container } from "@/components/ui/Container";
import { site } from "@/lib/site";
import { createServerSupabase } from "@/lib/supabase-server";
import { AdminHeader } from "../AdminHeader";

export const metadata: Metadata = {
  title: `Communities — ${site.name}`,
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

interface Row {
  id: string;
  slug: string;
  name: string;
  city: string | null;
  state: string | null;
  published: boolean;
}

export default async function CommunitiesPage() {
  const supabase = await createServerSupabase();

  /*
   * No membership filter in this query, deliberately. The RLS policies already
   * return exactly what this account may edit — everything for an admin, one
   * row for a board. Re-implementing that rule here would give it two homes and
   * one chance to drift.
   */
  const { data, error } = supabase
    ? await supabase
        .from("hoa_associations")
        .select("id, slug, name, city, state, published")
        .order("name")
    : { data: null, error: { message: "Supabase is not configured." } };

  const rows = (data ?? []) as Row[];

  return (
    <div className="min-h-screen bg-surface">
      <AdminHeader
        title="Communities"
        subtitle={
          error
            ? "Could not load"
            : `${rows.length} you can edit`
        }
      />
      <main>
        <Container className="py-10">
          {error ? (
            <Card className="p-6">
              <p className="font-semibold text-ink">Could not load communities.</p>
              <p className="mt-2 text-base text-ink-soft">{error.message}</p>
            </Card>
          ) : rows.length === 0 ? (
            <Card className="p-8 text-center">
              <p className="font-display text-xl font-semibold text-ink">
                Nothing to edit yet
              </p>
              <p className="mx-auto mt-2 max-w-prose text-base text-ink-soft">
                This account is not attached to a community. Ask whoever set it
                up to add you.
              </p>
            </Card>
          ) : (
            <ul className="grid gap-4 md:grid-cols-2">
              {rows.map((row) => (
                <li key={row.id}>
                  <Card interactive className="p-6">
                    <div className="flex items-start gap-4">
                      <span
                        aria-hidden="true"
                        className="flex h-11 w-11 shrink-0 items-center justify-center rounded-pill bg-accent-soft text-accent"
                      >
                        <Building2 className="h-5 w-5" />
                      </span>
                      <div className="min-w-0">
                        <h2 className="font-display text-lg font-semibold text-ink">
                          <Link
                            href={`/admin/communities/${row.slug}`}
                            className="no-underline after:absolute after:inset-0 after:content-['']"
                          >
                            {row.name}
                          </Link>
                        </h2>
                        <p className="mt-1 text-base text-ink-soft">
                          {[row.city, row.state].filter(Boolean).join(", ") ||
                            "Location not set"}
                        </p>
                        <p className="mt-2 text-sm text-ink-muted">
                          {row.published ? "Live" : "Not published"} · /demo/
                          {row.slug}
                        </p>
                      </div>
                      <ArrowRight
                        className="ml-auto h-5 w-5 shrink-0 text-ink-muted"
                        aria-hidden="true"
                      />
                    </div>
                  </Card>
                </li>
              ))}
            </ul>
          )}
        </Container>
      </main>
    </div>
  );
}
