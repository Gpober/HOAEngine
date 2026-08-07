import { Mail, Phone } from "lucide-react";
import type { Metadata } from "next";
import { Card } from "@/components/ui/Card";
import { Container } from "@/components/ui/Container";
import { site } from "@/lib/site";
import { createServerSupabase } from "@/lib/supabase-server";
import { AdminHeader } from "../AdminHeader";

export const metadata: Metadata = {
  title: `Enquiries — ${site.name}`,
  robots: { index: false, follow: false },
};

// Always live. An enquiry list served from cache is worse than useless.
export const dynamic = "force-dynamic";

interface LeadRow {
  id: string;
  created_at: string;
  name: string;
  email: string;
  phone: string | null;
  association_name: string | null;
  location: string | null;
  role: string | null;
  message: string | null;
  status: string;
}

const ROLE_LABELS: Record<string, string> = {
  board: "On the board",
  manager: "Management company",
  resident: "Resident",
  other: "Other",
};

function formatDate(iso: string): string {
  return new Date(iso).toLocaleString("en-US", {
    dateStyle: "medium",
    timeStyle: "short",
  });
}

export default async function LeadsPage() {
  const supabase = await createServerSupabase();

  /*
   * No error is swallowed here. If RLS refuses the read — which is what should
   * happen to anyone who is not an admin — the page says so rather than
   * rendering an empty list that reads as "no enquiries yet".
   */
  const { data, error } = supabase
    ? await supabase
        .from("hoa_leads")
        .select(
          "id, created_at, name, email, phone, association_name, location, role, message, status",
        )
        .order("created_at", { ascending: false })
        .limit(200)
    : { data: null, error: { message: "Supabase is not configured." } };

  const leads = (data ?? []) as LeadRow[];

  return (
    <div className="min-h-screen bg-surface">
      <AdminHeader
        title="Enquiries"
        subtitle={
          error
            ? "Could not load"
            : `${leads.length} ${leads.length === 1 ? "enquiry" : "enquiries"}`
        }
      />

      <main>
        <Container className="py-10">
          {error ? (
            <Card className="p-6">
              <p className="font-semibold text-ink">Could not load enquiries.</p>
              <p className="mt-2 text-base text-ink-soft">
                This account may not be an admin. Reading {" "}
                <code className="font-mono text-sm">hoa_leads</code> requires it.
              </p>
            </Card>
          ) : leads.length === 0 ? (
            <Card className="p-8 text-center">
              <p className="font-display text-xl font-semibold text-ink">
                No enquiries yet
              </p>
              <p className="mx-auto mt-2 max-w-prose text-base text-ink-soft">
                Submissions from the form on the homepage appear here as soon as
                they arrive.
              </p>
            </Card>
          ) : (
            <ul className="grid gap-4">
              {leads.map((lead) => (
                <li key={lead.id}>
                  <Card className="p-6">
                    <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
                      <h2 className="font-display text-lg font-semibold text-ink">
                        {lead.name}
                      </h2>
                      <p className="text-sm text-ink-muted">
                        {formatDate(lead.created_at)}
                      </p>
                    </div>

                    {lead.association_name || lead.location || lead.role ? (
                      <p className="mt-1 text-base text-ink-soft">
                        {[
                          lead.association_name,
                          lead.location,
                          lead.role ? ROLE_LABELS[lead.role] : null,
                        ]
                          .filter(Boolean)
                          .join(" · ")}
                      </p>
                    ) : null}

                    <div className="mt-3 flex flex-wrap gap-x-5 gap-y-2 text-base">
                      <a
                        href={`mailto:${lead.email}`}
                        className="inline-flex items-center gap-2"
                      >
                        <Mail className="h-4 w-4" aria-hidden="true" />
                        {lead.email}
                      </a>
                      {lead.phone ? (
                        <a
                          href={`tel:${lead.phone.replace(/[^\d+]/g, "")}`}
                          className="inline-flex items-center gap-2"
                        >
                          <Phone className="h-4 w-4" aria-hidden="true" />
                          {lead.phone}
                        </a>
                      ) : null}
                    </div>

                    {lead.message ? (
                      <p className="mt-4 whitespace-pre-wrap border-t border-line pt-4 text-base leading-relaxed text-ink-soft">
                        {lead.message}
                      </p>
                    ) : null}
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
