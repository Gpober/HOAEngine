"use server";

import { amenityKeys } from "@/lib/amenities";
import { getSupabase } from "@/lib/supabase";

export interface IntakeState {
  status: "idle" | "success" | "error";
  message?: string;
}

const isEmail = (v: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);

const ROLES = new Set(["board", "manager", "resident", "other"]);
const DESIGN_STYLES = new Set([
  "coastal-classic",
  "modern-resort",
  "friendly-community",
  "urban-condominium",
  "active-adult",
]);
const THEMES = new Set(["coastal", "resort", "sage", "urban", "heritage"]);
const AMENITIES = new Set<string>(amenityKeys);

function clean(value: FormDataEntryValue | null, max: number): string {
  return String(value ?? "")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, max);
}

/**
 * Takes a concept intake from the Start page.
 *
 * Two writes, both as the anonymous public under RLS: the structured intake
 * into `hoa_intakes` (write-only to the public, like `hoa_leads`), and a
 * pipeline entry into `hoa_leads` so the enquiry list and Zordon see the new
 * prospect without looking anywhere new. The public never writes to
 * `hoa_associations` — an admin converts the intake to an unpublished concept.
 */
export async function submitIntake(
  _prev: IntakeState,
  formData: FormData,
): Promise<IntakeState> {
  // Honeypot — bots fill hidden fields; report success and drop it.
  if (String(formData.get("website") ?? "").length > 0) {
    return { status: "success", message: "Thanks — we'll be in touch." };
  }

  const associationName = clean(formData.get("association_name"), 300);
  const city = clean(formData.get("city"), 120);
  const state = clean(formData.get("state"), 40);
  const communityType = clean(formData.get("community_type"), 80);
  const residenceCountRaw = clean(formData.get("residence_count"), 10);
  const designStyle = clean(formData.get("design_style"), 40);
  const accentTheme = clean(formData.get("accent_theme"), 40);
  const notes = clean(formData.get("notes"), 4000);
  const contactName = clean(formData.get("contact_name"), 200);
  const contactEmail = clean(formData.get("contact_email"), 200);
  const contactPhone = clean(formData.get("contact_phone"), 60);
  const contactRole = clean(formData.get("contact_role"), 40);

  const amenities = formData
    .getAll("amenities")
    .map((v) => String(v))
    .filter((v) => AMENITIES.has(v))
    .slice(0, 30);

  const residenceCount = /^\d+$/.test(residenceCountRaw)
    ? Math.min(50000, Math.max(1, parseInt(residenceCountRaw, 10)))
    : null;

  if (!associationName) {
    return { status: "error", message: "Please add the association's name." };
  }
  if (!contactName) {
    return { status: "error", message: "Please add your name." };
  }
  if (!contactEmail || !isEmail(contactEmail)) {
    return {
      status: "error",
      message: "Please add an email address we can reply to.",
    };
  }

  const supabase = getSupabase();
  if (!supabase) {
    return {
      status: "error",
      message: "The form is not connected yet. Please try again shortly.",
    };
  }

  // Never chain `.select()` here — the public has no SELECT on this table,
  // so asking for the row back turns a working write into an RLS failure.
  const { error } = await supabase.from("hoa_intakes").insert({
    association_name: associationName,
    city: city || null,
    state: state || null,
    community_type: communityType || null,
    residence_count: residenceCount,
    amenities,
    design_style: DESIGN_STYLES.has(designStyle) ? designStyle : null,
    accent_theme: THEMES.has(accentTheme) ? accentTheme : null,
    notes: notes || null,
    contact_name: contactName,
    contact_email: contactEmail,
    contact_phone: contactPhone || null,
    contact_role: ROLES.has(contactRole) ? contactRole : null,
  });

  if (error) {
    console.error("submitIntake", error.message);
    return {
      status: "error",
      message: "Something went wrong sending that. Please try again.",
    };
  }

  /*
   * Pipeline entry, best-effort: the intake is already saved, so a failure
   * here should not turn the visitor's success into an error. It only means
   * the enquiry list is one row behind the intakes list.
   */
  const location = [city, state].filter(Boolean).join(", ");
  const { error: leadError } = await supabase.from("hoa_leads").insert({
    name: contactName,
    email: contactEmail,
    phone: contactPhone || null,
    association_name: associationName,
    location: location || null,
    role: ROLES.has(contactRole) ? contactRole : null,
    message: [
      `Concept intake submitted from the Start page.`,
      designStyle ? `Design preference: ${designStyle}.` : null,
      amenities.length ? `Amenities: ${amenities.join(", ")}.` : null,
      notes ? `Notes: ${notes.slice(0, 500)}` : null,
    ]
      .filter(Boolean)
      .join(" "),
    source: "website",
  });
  if (leadError) console.error("submitIntake lead", leadError.message);

  return {
    status: "success",
    message:
      "Thanks — your intake is in. We'll build the concept and email you a private link to review. No cost, nothing to sign.",
  };
}
