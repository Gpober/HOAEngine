import type { Metadata } from "next";
import { Container } from "@/components/ui/Container";
import { site } from "@/lib/site";
import { LoginForm } from "./LoginForm";

export const metadata: Metadata = {
  title: `Sign in — ${site.name}`,
  // Staff-only. Nothing here should ever appear in a search result.
  robots: { index: false, follow: false },
};

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string }>;
}) {
  const { next } = await searchParams;

  return (
    <div className="flex min-h-screen items-center bg-surface">
      <Container className="py-16">
        <div className="mx-auto max-w-md">
          <div className="mb-8 text-center">
            <span
              aria-hidden="true"
              className="mx-auto flex h-12 w-12 items-center justify-center rounded-pill bg-accent font-display text-lg font-bold text-accent-ink"
            >
              CS
            </span>
            <h1 className="mt-4 font-display text-2xl font-semibold text-ink">
              Sign in to {site.name}
            </h1>
            <p className="mt-2 text-base text-ink-muted">
              Staff access to enquiries and community concepts.
            </p>
          </div>
          <LoginForm next={next ?? "/admin/leads"} />
        </div>
      </Container>
    </div>
  );
}
