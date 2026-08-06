import {
  ArrowUpRight,
  Briefcase,
  CalendarDays,
  ClipboardList,
  HelpCircle,
  Info,
  PhoneCall,
  Users,
  type LucideIcon,
} from "lucide-react";
import { Card, IconWell } from "@/components/ui/Card";
import { Section, SectionHeading } from "@/components/ui/Section";
import { quickLinks } from "@/lib/content";
import { designStyles } from "@/lib/design-styles";
import type { Association } from "@/lib/types";

const icons: Record<string, LucideIcon> = {
  info: Info,
  phone: PhoneCall,
  briefcase: Briefcase,
  clipboard: ClipboardList,
  help: HelpCircle,
  calendar: CalendarDays,
  users: Users,
};

export function QuickLinks({ association }: { association: Association }) {
  const design = designStyles[association.designStyle];

  return (
    <Section
      id="quick-links"
      tone="surface"
      padding={design.sectionPadding}
      labelledBy="quick-links-heading"
    >
      <SectionHeading
        id="quick-links-heading"
        eyebrow="Start here"
        eyebrowStyle={design.eyebrow}
        title="Quick links for residents"
        description="The pages residents ask for most, one tap away on any device."
      />

      <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {quickLinks.map((link) => {
          const Icon = icons[link.iconKey] ?? Info;
          return (
            <li key={link.id}>
              <Card interactive className="group relative h-full p-6">
                <IconWell>
                  <Icon className="h-6 w-6" aria-hidden="true" />
                </IconWell>
                <h3 className="mt-4 font-display text-xl font-semibold text-ink">
                  {/*
                    The stretched link makes the whole card clickable while
                    keeping a single, properly-labelled focus target.
                  */}
                  <a
                    href={link.href}
                    className="no-underline after:absolute after:inset-0 after:content-['']"
                  >
                    {link.label}
                  </a>
                </h3>
                <p className="mt-2 text-base leading-relaxed text-ink-soft">
                  {link.description}
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
