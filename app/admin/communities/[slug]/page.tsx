import { ExternalLink } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Card } from "@/components/ui/Card";
import { Container } from "@/components/ui/Container";
import { site } from "@/lib/site";
import { createServerSupabase } from "@/lib/supabase-server";
import { AdminHeader } from "../../AdminHeader";
import { ContactEditor } from "./ContactEditor";
import { MeetingsEditor } from "./MeetingsEditor";
import type { MeetingInput } from "./actions";

export const metadata: Metadata = {
  title: `Edit community — ${site.name}`,
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

export default async function EditCommunityPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const supabase = await createServerSupabase();

  /*
   * If this account may not edit the community, RLS returns nothing and the
   * page 404s — the same response an unknown slug gets. Telling an unauthorised
   * visitor "this exists but is not yours" would confirm which communities are
   * on the platform.
   */
  const { data } = supabase
    ? await supabase
        .from("hoa_associations")
        .select(
          "slug, name, city, state, published, management_company, phone, email, office_hours, emergency_contact, office_address, meetings",
        )
        .eq("slug", slug)
        .maybeSingle()
    : { data: null };

  if (!data) notFound();

  const meetings = (Array.isArray(data.meetings) ? data.meetings : []) as MeetingInput[];

  return (
    <div className="min-h-screen bg-surface">
      <AdminHeader
        title={data.name}
        subtitle={[data.city, data.state].filter(Boolean).join(", ") || undefined}
      />
      <main>
        <Container className="space-y-6 py-10">
          <Card className="flex flex-wrap items-center justify-between gap-4 p-5">
            <p className="text-base text-ink-soft">
              {data.published
                ? "This site is live."
                : "This site is not published yet."}{" "}
              Changes appear within a few minutes.
            </p>
            <Link
              href={`/demo/${data.slug}`}
              className="inline-flex items-center gap-2 text-base font-semibold"
            >
              View the site
              <ExternalLink className="h-4 w-4" aria-hidden="true" />
            </Link>
          </Card>

          <MeetingsEditor slug={data.slug} initialMeetings={meetings} />

          <ContactEditor
            slug={data.slug}
            values={{
              management_company: data.management_company,
              phone: data.phone,
              email: data.email,
              office_hours: data.office_hours,
              emergency_contact: data.emergency_contact,
              office_address: data.office_address,
            }}
          />
        </Container>
      </main>
    </div>
  );
}
