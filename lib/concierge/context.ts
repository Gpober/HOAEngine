import { getAmenities } from "@/lib/amenities";
import type { Association } from "@/lib/types";

/**
 * Turns an association record into the *only* thing the concierge may answer
 * from.
 *
 * This is the security boundary, not the prompt. A model told "don't discuss X"
 * can still be argued out of it; a model that was never given X cannot leak it.
 * So the shape here is an allowlist — fields are named one by one, and anything
 * added to `Association` later is invisible to the concierge until someone
 * deliberately includes it. That ordering matters: the default for a new field
 * should be "the public assistant cannot see this".
 */
export function buildCommunityContext(association: Association): string {
  const lines: string[] = [];
  const push = (label: string, value: string | number | undefined | null) => {
    if (value === undefined || value === null || value === "") return;
    lines.push(`${label}: ${value}`);
  };

  lines.push("# Community record");
  lines.push("");
  push("Name", association.name);
  push("Also known as", association.shortName);
  push("Type", association.communityType);
  push(
    "Location",
    [association.city, association.state].filter(Boolean).join(", ") || undefined,
  );
  push("Number of residences", association.residenceCount);
  push("Established", association.establishedYear);
  push("Description", association.shortDescription);

  lines.push("");
  lines.push("## Office and contact");
  push("Managed by", association.managementCompany);
  push("Phone", association.phone);
  push("Email", association.email);
  push("Office hours", association.officeHours);
  push("Office address", association.officeAddress);
  push("After hours", association.emergencyContact);

  // `getAmenities` drops unknown keys, so an unrecognised amenity in the data
  // simply does not reach the model rather than reaching it as a bare string.
  const known = getAmenities(association.amenities);
  if (known.length) {
    lines.push("");
    lines.push("## Amenities");
    for (const a of known) lines.push(`- ${a.label}: ${a.blurb}`);
  }

  if (association.meetings.length) {
    lines.push("");
    lines.push("## Meetings");
    for (const m of association.meetings) {
      lines.push(
        `- ${m.title} — ${m.dateLabel}, ${m.timeLabel}, ${m.locationLabel}` +
          (m.note ? ` (${m.note})` : ""),
      );
    }
  }

  if (association.announcements.length) {
    lines.push("");
    lines.push("## Announcements");
    for (const a of association.announcements) {
      lines.push(`- [${a.sampleLabel}] ${a.title} (${a.dateLabel}): ${a.body}`);
    }
  }

  if (association.documents.length) {
    lines.push("");
    lines.push("## Documents available on this site");
    for (const d of association.documents) {
      lines.push(`- ${d.title} (${d.fileType}): ${d.description}`);
    }
  }

  if (association.faqs?.length) {
    lines.push("");
    lines.push("## Questions the association has already answered");
    for (const f of association.faqs) {
      lines.push(`- Q: ${f.question}`);
      lines.push(`  A: ${f.answer}`);
    }
  }

  /*
   * Gallery captions and alt text describe the place, so they are useful
   * grounding for "what does it look like" — and they are already written to be
   * publishable, since they are the accessible descriptions on the page.
   */
  const visuals = [association.heroImage, ...association.galleryImages]
    .map((img) => img.caption ?? img.alt)
    .filter(Boolean);
  if (visuals.length) {
    lines.push("");
    lines.push("## What the photographs show");
    for (const v of visuals) lines.push(`- ${v}`);
  }

  return lines.join("\n");
}

/**
 * Openers offered as chips. A blank prompt gets no engagement — people need to
 * be shown what the thing is for. Every one of these is answerable from the
 * record above, so the first interaction is never a refusal.
 */
export function suggestedQuestions(association: Association): string[] {
  const qs = ["What is there to do here?"];
  if (association.meetings.length) qs.push("When is the next board meeting?");
  if (association.amenities.includes("pool")) qs.push("Tell me about the pool.");
  if (association.documents.length) qs.push("What documents can I read?");
  qs.push("How do I contact the office?");
  return qs.slice(0, 5);
}
