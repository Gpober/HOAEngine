"use client";

import { ArrowRight, Check } from "lucide-react";
import { useActionState } from "react";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { amenityCatalogue, amenityKeys } from "@/lib/amenities";
import { submitIntake, type IntakeState } from "./actions";

const initialState: IntakeState = { status: "idle" };

const fieldClass =
  "w-full rounded-card border border-line bg-card px-4 py-3 text-base text-ink outline-none transition-colors placeholder:text-ink-muted/70 focus:border-accent";

const labelClass = "mb-1.5 block text-sm font-semibold text-ink-soft";

/**
 * Community character, not product names. Nothing here is a thing we sell
 * off a shelf — these words describe *their* community, and the studio
 * translates the answer into design decisions. The submitted values are
 * deliberately neutral adjectives; the mapping to anything internal happens
 * server-side and is never shown.
 */
const CHARACTER_OPTIONS = [
  { value: "", label: "Design it around us", note: "Tell us nothing — we read what you've written above and design from that." },
  { value: "classic", label: "Classic & established", note: "Timeless and elegant. A community with history and standards." },
  { value: "resort", label: "Resort feel", note: "Spacious and polished, with the amenities front and centre." },
  { value: "warm", label: "Warm & neighbourly", note: "Friendly and welcoming. People wave here." },
  { value: "modern", label: "Sleek & modern", note: "Crisp, contemporary, city energy." },
  { value: "relaxed", label: "Relaxed & easygoing", note: "Unhurried, comfortable, easy to read for everyone." },
];

export function IntakeForm() {
  const [state, formAction, pending] = useActionState(submitIntake, initialState);

  if (state.status === "success") {
    return (
      <Card className="p-8 text-center shadow-lift">
        <span
          aria-hidden="true"
          className="mx-auto flex h-12 w-12 items-center justify-center rounded-pill bg-accent-soft text-accent"
        >
          <Check className="h-6 w-6" />
        </span>
        <p className="mt-4 font-display text-2xl font-semibold text-ink">
          Intake received
        </p>
        <p className="mx-auto mt-2 max-w-prose text-base leading-relaxed text-ink-soft">
          {state.message}
        </p>
      </Card>
    );
  }

  return (
    <Card className="p-6 text-left shadow-lift sm:p-8">
      <form action={formAction} className="space-y-8">
        {/* Honeypot — hidden from people and assistive technology alike. */}
        <input
          type="text"
          name="website"
          tabIndex={-1}
          autoComplete="off"
          aria-hidden="true"
          className="hidden"
        />

        {/* The community ---------------------------------------------------- */}
        <fieldset className="space-y-5">
          <legend className="font-display text-xl font-semibold text-ink">
            Your community
          </legend>
          <div>
            <label className={labelClass} htmlFor="association_name">
              Association name
            </label>
            <input
              id="association_name"
              name="association_name"
              required
              className={fieldClass}
              placeholder="Oakwood Commons Condominium Association"
            />
          </div>
          <div className="grid gap-5 sm:grid-cols-3">
            <div className="sm:col-span-2">
              <label className={labelClass} htmlFor="city">
                City <span className="font-normal text-ink-muted">(optional)</span>
              </label>
              <input id="city" name="city" className={fieldClass} placeholder="Fort Lauderdale" />
            </div>
            <div>
              <label className={labelClass} htmlFor="state">
                State <span className="font-normal text-ink-muted">(optional)</span>
              </label>
              <input id="state" name="state" className={fieldClass} placeholder="FL" />
            </div>
          </div>
          <div className="grid gap-5 sm:grid-cols-2">
            <div>
              <label className={labelClass} htmlFor="community_type">
                Community type{" "}
                <span className="font-normal text-ink-muted">(optional)</span>
              </label>
              <select
                id="community_type"
                name="community_type"
                className={fieldClass}
                defaultValue=""
              >
                <option value="">Choose one</option>
                <option value="Condominium Association">Condominium Association</option>
                <option value="Homeowners Association">Homeowners Association</option>
                <option value="Master Association">Master Association</option>
                <option value="Active Adult Community">Active Adult Community</option>
                <option value="Cooperative">Cooperative</option>
              </select>
            </div>
            <div>
              <label className={labelClass} htmlFor="residence_count">
                Number of residences{" "}
                <span className="font-normal text-ink-muted">(optional)</span>
              </label>
              <input
                id="residence_count"
                name="residence_count"
                type="number"
                min={1}
                max={50000}
                inputMode="numeric"
                className={fieldClass}
                placeholder="184"
              />
            </div>
          </div>
        </fieldset>

        {/* Amenities --------------------------------------------------------- */}
        <fieldset>
          <legend className="font-display text-xl font-semibold text-ink">
            Amenities{" "}
            <span className="text-sm font-normal text-ink-muted">
              (tick everything you have)
            </span>
          </legend>
          <div className="mt-4 grid grid-cols-2 gap-x-4 gap-y-2.5 sm:grid-cols-3">
            {amenityKeys.map((key) => (
              <label
                key={key}
                className="flex min-h-[2.5rem] cursor-pointer items-center gap-2.5 text-base text-ink-soft"
              >
                <input
                  type="checkbox"
                  name="amenities"
                  value={key}
                  className="h-5 w-5 rounded border-line accent-[rgb(var(--hoa-accent))]"
                />
                {amenityCatalogue[key].label}
              </label>
            ))}
          </div>
        </fieldset>

        {/* Character --------------------------------------------------------- */}
        <fieldset>
          <legend className="font-display text-xl font-semibold text-ink">
            Your community&apos;s character
          </legend>
          <p className="mt-1 text-sm text-ink-muted">
            Every site is designed one at a time, around the community it&apos;s
            for. This just tells our designers who you are.
          </p>
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            {CHARACTER_OPTIONS.map((option, index) => (
              <label
                key={option.value}
                className="flex cursor-pointer items-start gap-3 rounded-card border border-line bg-card p-4 transition-colors has-[:checked]:border-accent has-[:checked]:bg-accent-soft"
              >
                <input
                  type="radio"
                  name="character"
                  value={option.value}
                  defaultChecked={index === 0}
                  className="mt-1 h-5 w-5 accent-[rgb(var(--hoa-accent))]"
                />
                <span>
                  <span className="block font-semibold text-ink">{option.label}</span>
                  <span className="mt-0.5 block text-sm leading-snug text-ink-soft">
                    {option.note}
                  </span>
                </span>
              </label>
            ))}
          </div>
        </fieldset>

        {/* You --------------------------------------------------------------- */}
        <fieldset className="space-y-5">
          <legend className="font-display text-xl font-semibold text-ink">
            How we reach you
          </legend>
          <div className="grid gap-5 sm:grid-cols-2">
            <div>
              <label className={labelClass} htmlFor="contact_name">
                Your name
              </label>
              <input
                id="contact_name"
                name="contact_name"
                required
                autoComplete="name"
                className={fieldClass}
                placeholder="Jane Rivera"
              />
            </div>
            <div>
              <label className={labelClass} htmlFor="contact_email">
                Email
              </label>
              <input
                id="contact_email"
                name="contact_email"
                type="email"
                required
                autoComplete="email"
                className={fieldClass}
                placeholder="you@example.com"
              />
            </div>
          </div>
          <div className="grid gap-5 sm:grid-cols-2">
            <div>
              <label className={labelClass} htmlFor="contact_role">
                You are{" "}
                <span className="font-normal text-ink-muted">(optional)</span>
              </label>
              <select
                id="contact_role"
                name="contact_role"
                className={fieldClass}
                defaultValue=""
              >
                <option value="">Prefer not to say</option>
                <option value="board">On the board</option>
                <option value="manager">A management company</option>
                <option value="resident">A resident</option>
                <option value="other">Something else</option>
              </select>
            </div>
            <div>
              <label className={labelClass} htmlFor="contact_phone">
                Phone <span className="font-normal text-ink-muted">(optional)</span>
              </label>
              <input
                id="contact_phone"
                name="contact_phone"
                type="tel"
                autoComplete="tel"
                className={fieldClass}
                placeholder="(954) 555-0142"
              />
            </div>
          </div>
          <div>
            <label className={labelClass} htmlFor="notes">
              Anything else{" "}
              <span className="font-normal text-ink-muted">(optional)</span>
            </label>
            <textarea
              id="notes"
              name="notes"
              rows={3}
              className={fieldClass}
              placeholder="Whether you have a site today, what you'd want on it, anything that makes your community itself."
            />
          </div>
        </fieldset>

        {state.status === "error" ? (
          <p
            role="alert"
            className="rounded-card border border-accent/30 bg-accent-soft px-4 py-3 text-base text-accent"
          >
            {state.message}
          </p>
        ) : null}

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <Button type="submit" size="lg" disabled={pending}>
            {pending ? "Sending…" : "Build my free concept"}
            {pending ? null : <ArrowRight className="h-5 w-5" aria-hidden="true" />}
          </Button>
          <p className="text-sm text-ink-muted">
            No cost, nothing to sign. You review it before anyone else sees it.
          </p>
        </div>
      </form>
    </Card>
  );
}
