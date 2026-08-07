"use server";

import { revalidatePath } from "next/cache";
import { createServerSupabase } from "@/lib/supabase-server";

export interface SaveState {
  status: "idle" | "saved" | "error";
  message?: string;
}

const text = (form: FormData, key: string, max: number): string | null => {
  const value = String(form.get(key) ?? "").trim().slice(0, max);
  return value === "" ? null : value;
};

/**
 * Every write here goes through the *user's* Supabase client, never a
 * service-role key.
 *
 * That is the whole security design: this code does not check whether the
 * signed-in account may edit this community, because the database already
 * does. An RLS policy decides the row and a trigger rejects the columns that
 * are ours rather than theirs. A bug in this file can therefore fail to save,
 * but cannot save something the account was not entitled to change.
 */
async function updateAssociation(
  slug: string,
  patch: Record<string, unknown>,
): Promise<SaveState> {
  const supabase = await createServerSupabase();
  if (!supabase) return { status: "error", message: "Not configured." };

  const { data, error } = await supabase
    .from("hoa_associations")
    .update(patch)
    .eq("slug", slug)
    .select("slug");

  if (error) {
    // The column guard raises 42501; surface that as a permission message
    // rather than a generic failure, because it means something different.
    const denied = error.code === "42501" || /administrator/i.test(error.message);
    return {
      status: "error",
      message: denied
        ? "That change is not yours to make. Contact us if you need it."
        : "Could not save. Please try again.",
    };
  }

  // An update that matches no row is not an error — it is RLS declining, and
  // it must not be reported as success.
  if (!data || data.length === 0) {
    return {
      status: "error",
      message: "You do not have access to edit this community.",
    };
  }

  revalidatePath(`/demo/${slug}`);
  revalidatePath(`/admin/communities/${slug}`);
  return { status: "saved", message: "Saved. The site updates within a few minutes." };
}

export async function saveContact(
  slug: string,
  _prev: SaveState,
  formData: FormData,
): Promise<SaveState> {
  return updateAssociation(slug, {
    management_company: text(formData, "management_company", 200),
    phone: text(formData, "phone", 60),
    email: text(formData, "email", 200),
    office_hours: text(formData, "office_hours", 200),
    emergency_contact: text(formData, "emergency_contact", 200),
    office_address: text(formData, "office_address", 300),
  });
}

export interface MeetingInput {
  id: string;
  kind: string;
  title: string;
  dateLabel: string;
  timeLabel: string;
  locationLabel: string;
  note?: string;
}

const KINDS = new Set(["board", "annual", "committee", "special"]);

export async function saveMeetings(
  slug: string,
  _prev: SaveState,
  formData: FormData,
): Promise<SaveState> {
  let parsed: unknown;
  try {
    parsed = JSON.parse(String(formData.get("meetings") ?? "[]"));
  } catch {
    return { status: "error", message: "Could not read those meetings." };
  }
  if (!Array.isArray(parsed)) {
    return { status: "error", message: "Could not read those meetings." };
  }

  /*
   * Rebuilt field by field rather than passed through. The column is JSONB, so
   * the database will accept any shape at all — which means whatever arrives
   * here is what the public page will try to render. Anything not named below
   * is dropped.
   */
  const meetings: MeetingInput[] = [];
  for (const raw of parsed.slice(0, 40)) {
    if (!raw || typeof raw !== "object") continue;
    const m = raw as Record<string, unknown>;
    const title = String(m.title ?? "").trim().slice(0, 160);
    if (!title) continue;
    meetings.push({
      id: String(m.id ?? "").trim().slice(0, 60) || `m-${meetings.length + 1}`,
      kind: KINDS.has(String(m.kind)) ? String(m.kind) : "board",
      title,
      dateLabel: String(m.dateLabel ?? "").trim().slice(0, 120),
      timeLabel: String(m.timeLabel ?? "").trim().slice(0, 60),
      locationLabel: String(m.locationLabel ?? "").trim().slice(0, 160),
      ...(String(m.note ?? "").trim()
        ? { note: String(m.note).trim().slice(0, 300) }
        : {}),
    });
  }

  return updateAssociation(slug, { meetings });
}
