"use client";

import { useActionState } from "react";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { saveContact, type SaveState } from "./actions";

const initial: SaveState = { status: "idle" };

const fieldClass =
  "w-full rounded-card border border-line bg-card px-3 py-2 text-base text-ink outline-none focus:border-accent";
const labelClass = "mb-1 block text-sm font-semibold text-ink-soft";

const FIELDS = [
  ["management_company", "Managed by", "Example Property Management"],
  ["phone", "Phone", "(954) 555-0142"],
  ["email", "Email", "office@example.com"],
  ["office_hours", "Office hours", "Monday – Friday, 9:00 AM – 4:00 PM"],
  ["emergency_contact", "After hours", "(954) 555-0199 — emergency line"],
  ["office_address", "Office address", "100 Example Way, Suite 200"],
] as const;

export function ContactEditor({
  slug,
  values,
}: {
  slug: string;
  values: Record<string, string | null>;
}) {
  const [state, formAction, pending] = useActionState(
    saveContact.bind(null, slug),
    initial,
  );

  return (
    <Card className="p-6 sm:p-8">
      <h2 className="font-display text-xl font-semibold text-ink">
        Office and contact
      </h2>
      <p className="mt-1 text-sm text-ink-muted">
        Leave anything blank and the site simply omits it.
      </p>

      <form action={formAction} className="mt-6 space-y-4">
        <div className="grid gap-4 sm:grid-cols-2">
          {FIELDS.map(([name, label, placeholder]) => (
            <div key={name} className={name === "office_address" ? "sm:col-span-2" : ""}>
              <label className={labelClass} htmlFor={name}>
                {label}
              </label>
              <input
                id={name}
                name={name}
                defaultValue={values[name] ?? ""}
                placeholder={placeholder}
                className={fieldClass}
              />
            </div>
          ))}
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <Button type="submit" disabled={pending}>
            {pending ? "Saving…" : "Save contact details"}
          </Button>
          {state.status !== "idle" ? (
            <p
              role="status"
              className={
                state.status === "saved"
                  ? "text-base text-ink-soft"
                  : "text-base font-semibold text-accent"
              }
            >
              {state.message}
            </p>
          ) : null}
        </div>
      </form>
    </Card>
  );
}
