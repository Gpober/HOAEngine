import {
  ArrowUpRight,
  FileText,
  Landmark,
  Newspaper,
  PhoneCall,
  Waves,
  type LucideIcon,
} from "lucide-react";
import Link from "next/link";
import { Card, IconWell } from "@/components/ui/Card";
import { Section, SectionHeading } from "@/components/ui/Section";
import { demoPages } from "@/lib/content";
import { designStyles } from "@/lib/design-styles";
import type { Association } from "@/lib/types";

const icons: Record<string, LucideIcon> = {
  community: Landmark,
  amenities: Waves,
  news: Newspaper,
  documents: FileText,
  contact: PhoneCall,
};

/**
 * The doors to the rest of the site: one card per page, derived from the same
 * list the nav and footer use. This is the homepage's whole answer to "where
 * is everything?" — the sections themselves live on their own pages.
 */
export function ExploreGrid({ association }: { association: Association }) {
  const design = designStyles[association.designStyle];
  const pages = demoPages(association.slug);

  return (
    <Section
      id="explore-pages"
      tone="alt"
      padding={design.sectionPadding}
      labelledBy="explore-heading"
    >
      <SectionHeading
        id="explore-heading"
        eyebrow="Find your way"
        eyebrowStyle={design.eyebrow}
        title="Explore the community site"
        description="Everything practical has a page of its own — pick where you're headed."
      />

      <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
        {pages.map((page) => {
          const Icon = icons[page.segment] ?? Landmark;
          return (
            <li key={page.href}>
              <Card interactive className="group relative h-full p-6">
                <IconWell>
                  <Icon className="h-6 w-6" aria-hidden="true" />
                </IconWell>
                <h3 className="mt-4 font-display text-xl font-semibold text-ink">
                  {/*
                    The stretched link makes the whole card clickable while
                    keeping a single, properly-labelled focus target.
                  */}
                  <Link
                    href={page.href}
                    className="no-underline after:absolute after:inset-0 after:content-['']"
                  >
                    {page.label}
                  </Link>
                </h3>
                <p className="mt-2 text-base leading-relaxed text-ink-soft">
                  {page.description}
                </p>
                <ArrowUpRight
                  aria-hidden="true"
                  className="absolute right-5 top-6 h-5 w-5 text-ink-muted transition-transform duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-accent"
                />
              </Card>
            </li>
          );
        })}
      </ul>
    </Section>
  );
}
