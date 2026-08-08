import { ArrowLeft } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { Section, SectionHeading } from "@/components/ui/Section";
import { site } from "@/lib/site";
import { IntakeForm } from "./IntakeForm";

export const metadata: Metadata = {
  title: `Start your concept — ${site.name}`,
  description:
    "Describe your community and we build a website concept for it — free, private, and yours to review before anyone else sees it.",
};

export default function StartPage() {
  return (
    <div className="min-h-screen bg-surface">
      <header className="border-b border-line bg-card">
        <Container className="flex items-center justify-between py-4">
          <Link
            href="/"
            className="inline-flex min-h-[2.75rem] items-center gap-2 text-base font-medium text-ink-soft no-underline hover:text-accent"
          >
            <ArrowLeft className="h-5 w-5" aria-hidden="true" />
            {site.name}
          </Link>
          <Link
            href="/demo"
            className="inline-flex min-h-[2.75rem] items-center text-base font-medium text-ink-soft no-underline hover:text-accent"
          >
            See the demos
          </Link>
        </Container>
      </header>

      <main>
        <Section labelledBy="start-heading">
          <SectionHeading
            id="start-heading"
            eyebrow="Free concept"
            title="Tell us about your community"
            description="Five minutes of answers is all a concept needs. We build it, you get a private link to review, and nothing goes live unless you say so."
          />
          <div className="mx-auto max-w-3xl">
            <IntakeForm />
          </div>
        </Section>
      </main>
    </div>
  );
}
