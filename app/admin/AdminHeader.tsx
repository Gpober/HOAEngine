import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { signOut } from "@/app/login/actions";

/** Shared chrome for the signed-in area. */
export function AdminHeader({
  title,
  subtitle,
}: {
  title: string;
  subtitle?: string;
}) {
  return (
    <header className="border-b border-line bg-card">
      <Container className="flex flex-wrap items-center justify-between gap-4 py-5">
        <div className="min-w-0">
          <h1 className="font-display text-xl font-semibold text-ink">{title}</h1>
          {subtitle ? <p className="text-sm text-ink-muted">{subtitle}</p> : null}
        </div>
        <div className="flex items-center gap-2">
          <Link
            href="/admin/communities"
            className="inline-flex min-h-[2.75rem] items-center rounded-pill px-3.5 text-base font-medium text-ink-soft no-underline hover:bg-accent-soft hover:text-accent"
          >
            Communities
          </Link>
          <Link
            href="/admin/leads"
            className="inline-flex min-h-[2.75rem] items-center rounded-pill px-3.5 text-base font-medium text-ink-soft no-underline hover:bg-accent-soft hover:text-accent"
          >
            Enquiries
          </Link>
          <Link
            href="/admin/assistant"
            className="inline-flex min-h-[2.75rem] items-center rounded-pill px-3.5 text-base font-medium text-ink-soft no-underline hover:bg-accent-soft hover:text-accent"
          >
            Zordon
          </Link>
          <form action={signOut}>
            <Button type="submit" variant="outline">
              Sign out
            </Button>
          </form>
        </div>
      </Container>
    </header>
  );
}
