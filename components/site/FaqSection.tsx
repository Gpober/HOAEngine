import { Plus } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Section, SectionHeading } from "@/components/ui/Section";
import { faqsFor, sectionIds } from "@/lib/content";
import { designStyles } from "@/lib/design-styles";
import type { Association } from "@/lib/types";

/**
 * Native `<details>` disclosures: keyboard accessible, screen-reader friendly,
 * and they work with JavaScript disabled — no custom accordion needed.
 */
export function FaqSection({ association }: { association: Association }) {
  const design = designStyles[association.designStyle];
  const faqs = faqsFor(association);

  return (
    <Section
      id={sectionIds.faq}
      tone="alt"
      padding={design.sectionPadding}
      labelledBy="faq-heading"
    >
      <SectionHeading
        id="faq-heading"
        eyebrow="Questions"
        eyebrowStyle={design.eyebrow}
        title="Frequently asked questions"
        description="Sample answers describing how these processes usually work. A live site publishes the association's own policies."
      />

      <div className="mx-auto grid max-w-3xl gap-3">
        {faqs.map((faq) => (
          <Card key={faq.id} as="div" className="overflow-hidden">
            <details className="group">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 p-5 text-left sm:p-6 [&::-webkit-details-marker]:hidden">
                <h3 className="font-display text-lg font-semibold leading-snug text-ink">
                  {faq.question}
                </h3>
                <span
                  aria-hidden="true"
                  className="flex h-10 w-10 shrink-0 items-center justify-center rounded-pill bg-accent-soft text-accent transition-transform duration-200 group-open:rotate-45"
                >
                  <Plus className="h-5 w-5" />
                </span>
              </summary>
              <div className="border-t border-line px-5 pb-6 pt-4 sm:px-6">
                <p className="text-base leading-relaxed text-ink-soft">{faq.answer}</p>
              </div>
            </details>
          </Card>
        ))}
      </div>
    </Section>
  );
}
