import { createClient } from "@supabase/supabase-js";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Container } from "@/components/ui/Container";
import { site } from "@/lib/site";
import { UploadForm } from "./UploadForm";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// Onboarding pages are private links — never indexed.
export const metadata: Metadata = {
  title: `Send us your photos — ${site.name}`,
  robots: { index: false, follow: false },
};

type PageProps = { params: Promise<{ token: string }> };

async function communityForToken(token: string): Promise<{ name: string; shortName: string | null } | null> {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SECRET_KEY;
  if (!url || !key) return null;
  const supabase = createClient(url, key, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
  const { data } = await supabase
    .from("hoa_associations")
    .select("name, short_name")
    .eq("upload_token", token)
    .maybeSingle();
  return data ? { name: data.name, shortName: data.short_name } : null;
}

export default async function OnboardPage({ params }: PageProps) {
  const { token } = await params;
  const community = await communityForToken(token);
  if (!community) notFound();

  const display = community.shortName ?? community.name;

  return (
    <div className="min-h-screen bg-surface-alt">
      <div className="on-accent bg-accent text-accent-ink">
        <Container className="flex flex-col items-center gap-4 py-12 text-center md:py-16">
          <p className="text-sm font-medium uppercase tracking-eyebrow text-accent-ink/70">
            Welcome to {site.name}
          </p>
          <h1 className="max-w-3xl font-display text-3xl font-light uppercase leading-[1.2] tracking-[0.14em] sm:text-4xl md:tracking-[0.2em]">
            Let&apos;s make {display} yours
          </h1>
          <span aria-hidden="true" className="h-px w-16 bg-accent-ink/50" />
          <p className="max-w-xl text-base font-light leading-relaxed text-accent-ink/85 md:text-lg">
            Send us your community&apos;s photos, your logo, and any documents you&apos;d like
            published. We place everything for you — you never have to build a page.
          </p>
        </Container>
      </div>

      <main className="relative pb-20">
        <Container className="-mt-10 max-w-2xl md:-mt-12">
          <div className="rounded-3xl border border-line bg-surface p-6 shadow-lift sm:p-8">
            <UploadForm token={token} />
          </div>
          <div className="mx-auto mt-8 max-w-2xl text-center text-sm text-ink-muted">
            <p>
              Best photos to send: the building or grounds, the pool and amenities, the entrance,
              and any seasonal shots you love. Landscape orientation looks best on the homepage.
            </p>
            <p className="mt-3">
              Questions? Email{" "}
              <a href={`mailto:${site.contactEmail}`}>{site.contactEmail}</a>. This link is private
              to your community — you can return to it anytime to add more.
            </p>
          </div>
        </Container>
      </main>
    </div>
  );
}
