import { brand } from "@/lib/brand";
import { site } from "@/lib/site";
import { designStyleNotes } from "@/lib/design-styles";
import { associations } from "@/data/associations";

/**
 * The marketing-site guide: same machinery as the community concierge, aimed
 * at a different visitor — the board member or manager deciding whether to
 * talk to us at all. Everything it may say is assembled here from `lib/site.ts`
 * and `lib/brand.ts`, the same records the page itself renders, so the guide
 * can never promise something the site does not.
 */

/** Routed through the same /api/concierge endpoint, keyed by this pseudo-slug. */
export const SITE_CONCIERGE_SLUG = "__condoseen__";

export const SITE_CONCIERGE_SUGGESTIONS = [
  "What does Condoseen do?",
  "Can we see a demo for our community?",
  "Does this replace our resident portal?",
  "How do we get started?",
];

function siteRecord(): string {
  const lines: string[] = [];
  lines.push(`Company: ${site.name} — ${site.tagline}.`);
  lines.push(`Service area: ${site.serviceArea}.`);
  lines.push("");
  lines.push("Positioning:");
  lines.push(`${site.positioning.heading} ${site.positioning.body}`);
  lines.push("");
  lines.push("What the product includes (every line is something that exists):");
  for (const f of site.features) lines.push(`- ${f.title}: ${f.body}`);
  lines.push("");
  lines.push("Design concepts on this site:");
  for (const a of associations) {
    lines.push(
      `- "${a.designName ?? a.designStyle}" (view at /demo/${a.slug}): ${designStyleNotes[a.designStyle]}`,
    );
  }
  lines.push(
    "There are also website concepts built for real, named associations — all clearly labelled unofficial samples, not published to search engines.",
  );
  lines.push("");
  lines.push("Questions and answers, verbatim from the site:");
  for (const f of site.faqs) lines.push(`Q: ${f.q}\nA: ${f.a}`);
  lines.push("");
  const contact: string[] = [];
  if (site.contactEmail) contact.push(`email ${site.contactEmail}`);
  if (site.phone) contact.push(`phone ${site.phone}`);
  lines.push(
    contact.length
      ? `Contact: ${contact.join(", ")}, or the contact form on this page.`
      : "Contact: the contact form on this page (scroll to the bottom, or the Get Started button). There is no public phone number or email listed.",
  );
  return lines.join("\n");
}

export function buildSitePrompt(): string {
  return [
    `You are the guide on ${site.name}'s own website, answering questions from`,
    `board members, community managers, and residents who want to know what`,
    `${site.name} does and whether it fits their association.`,
    ``,
    `Voice: warm, plain, and brief. Lead with the answer. Two or three short`,
    `sentences is usually right. No emoji, no hard selling, no exclamation`,
    `marks. You may naturally point people to the demo concepts and to the`,
    `contact form when they want to go further — inviting, never pushy.`,
    ``,
    `## The only thing you know`,
    `Everything you may say comes from the company record below. It is the whole`,
    `of your knowledge about ${site.name}.`,
    ``,
    `- If the record does not answer the question, say so plainly and point to`,
    `  the contact form. Never guess and never fill a gap with what is usually`,
    `  true of companies like this one.`,
    `- Never state a price, a contract term, or a delivery timeline — none are`,
    `  published. Pricing and timelines are discussed after an enquiry, and`,
    `  saying exactly that is the correct answer.`,
    `- Do not give legal, financial, or governance advice to associations.`,
    ``,
    `## Demo concepts are samples`,
    `${brand.unofficialNotice} If someone asks about a concept for a named`,
    `association, make clear it is an unofficial sample built to show what their`,
    `site could look like, and that a real engagement starts with the form.`,
    ``,
    `## The company record`,
    siteRecord(),
  ].join("\n");
}
