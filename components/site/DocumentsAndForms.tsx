import { Download, FileText } from "lucide-react";
import { Card, IconWell } from "@/components/ui/Card";
import { Section, SectionHeading } from "@/components/ui/Section";
import { SampleTag } from "@/components/ui/SampleTag";
import { sectionIds } from "@/lib/content";
import { designStyles } from "@/lib/design-styles";
import type { Association } from "@/lib/types";

export function DocumentsAndForms({ association }: { association: Association }) {
  const design = designStyles[association.designStyle];
  if (!association.documents.length) return null;

  return (
    <Section
      id={sectionIds.documents}
      tone="surface"
      padding={design.sectionPadding}
      labelledBy="documents-heading"
    >
      <SectionHeading
        id="documents-heading"
        eyebrow="Resident resources"
        eyebrowStyle={design.eyebrow}
        title="Documents and forms"
        description="Download links are placeholders in this concept. On a live site each card points at the current file supplied by the association."
        action={<SampleTag label="Demo downloads" />}
      />

      <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {association.documents.map((doc) => (
          <li key={doc.id}>
            <Card interactive className="group relative flex h-full flex-col gap-4 p-6">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <IconWell>
                  <FileText className="h-6 w-6" aria-hidden="true" />
                </IconWell>
                <span className="rounded-pill border border-line px-2.5 py-1 text-xs font-bold uppercase tracking-eyebrow text-ink-muted">
                  {doc.fileType}
                </span>
              </div>

              <div>
                <h3 className="font-display text-lg font-semibold leading-snug text-ink">
                  <a
                    href={doc.href}
                    className="no-underline after:absolute after:inset-0 after:content-['']"
                  >
                    {doc.title}
                    <span className="sr-only"> — demo link, no file attached</span>
                  </a>
                </h3>
                <p className="mt-2 text-base leading-relaxed text-ink-soft">
                  {doc.description}
                </p>
              </div>

              <span
                aria-hidden="true"
                className="mt-auto inline-flex items-center gap-2 pt-2 text-base font-semibold text-accent"
              >
                <Download className="h-5 w-5 transition-transform duration-200 group-hover:translate-y-0.5" />
                Download
              </span>
            </Card>
          </li>
        ))}
      </ul>
    </Section>
  );
}
