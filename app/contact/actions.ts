"use server";

import { getSupabase } from "@/lib/supabase";

export interface ContactState {
  status: "idle" | "success" | "error";
  message?: string;
  /** Field to focus and describe when validation fails. */
  field?: "name" | "email";
}

const isEmail = (v: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);

const ROLES = new Set(["board", "manager", "resident", "other"]);

/** Trim, collapse whitespace, and cap — the column has a length check too. */
function clean(value: FormDataEntryValue | null, max: number): string {
  return String(value ?? "")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, max);
}

/**
 * Takes an enquiry from the marketing page and writes it to `hoa_leads`.
 *
 * The insert runs under the publishable key, which is deliberate: the table's
 * RLS grants the public INSERT and no SELECT at all, so a visitor can leave
 * their details and cannot read anyone else's back. `status` and `notes` are
 * never accepted from the form — the insert policy rejects a row that tries to
 * set them, so a crafted request cannot file itself as already won.
 */
export async function submitLead(
  _prev: ContactState,
  formData: FormData,
): Promise<ContactState> {
  // Honeypot. Bots fill hidden fields; a human never sees this one. Report
  // success so the bot has nothing to learn from, and drop the submission.
  if (String(formData.get("website") ?? "").length > 0) {
    return { status: "success", message: "Thanks — we'll be in touch." };
  }

  const name = clean(formData.get("name"), 200);
  const email = clean(formData.get("email"), 200);
  const phone = clean(formData.get("phone"), 60);
  const associationName = clean(formData.get("association_name"), 300);
  const location = clean(formData.get("location"), 200);
  const roleRaw = clean(formData.get("role"), 40);
  const message = clean(formData.get("message"), 4000);

  if (!name) {
    return { status: "error", message: "Please add your name.", field: "name" };
  }
  if (!email || !isEmail(email)) {
    return {
      status: "error",
      message: "Please add an email address we can reply to.",
      field: "email",
    };
  }

  const supabase = getSupabase();
  if (!supabase) {
    // Nothing is configured — say so plainly rather than swallowing the enquiry.
    return {
      status: "error",
      message: "The form is not connected yet. Please try again shortly.",
    };
  }

  /*
   * Never chain `.select()` onto this insert. Returning the inserted row needs
   * SELECT permission on it, and the public role deliberately has no SELECT
   * policy on `hoa_leads` — so asking for the row back turns a working write
   * into an RLS failure. `.insert()` alone sends `Prefer: return=minimal`,
   * which is what we want. (Learned the hard way: an `INSERT ... RETURNING`
   * against this table fails while the identical insert without it succeeds.)
   */
  const { error } = await supabase.from("hoa_leads").insert({
    name,
    email,
    phone: phone || null,
    association_name: associationName || null,
    location: location || null,
    role: ROLES.has(roleRaw) ? roleRaw : null,
    message: message || null,
    source: "website",
  });

  if (error) {
    console.error("submitLead", error.message);
    return {
      status: "error",
      message: "Something went wrong sending that. Please try again.",
    };
  }

  return {
    status: "success",
    message:
      "Thanks — your enquiry is in. We'll build a concept for your community and send you the link.",
  };
}
