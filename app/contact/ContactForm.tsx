"use client";

import { ArrowRight, Check } from "lucide-react";
import { useActionState } from "react";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { submitLead, type ContactState } from "./actions";

const initialState: ContactState = { status: "idle" };

const fieldClass =
  "w-full rounded-card border border-line bg-card px-4 py-3 text-base text-ink outline-none transition-colors placeholder:text-ink-muted/70 focus:border-accent";

const labelClass = "mb-1.5 block text-sm font-semibold text-ink-soft";

export function ContactForm() {
  const [state, formAction, pending] = useActionState(submitLead, initialState);

  if (state.status === "success") {
    return (
      <Card className="p-8 text-center">
        <span
          aria-hidden="true"
          className="mx-auto flex h-12 w-12 items-center justify-center rounded-pill bg-accent-soft text-accent"
        >
          <Check className="h-6 w-6" />
        </span>
        <p className="mt-4 font-display text-2xl font-semibold text-ink">
          Enquiry received
        </p>
        <p className="mx-auto mt-2 max-w-prose text-base leading-relaxed text-ink-soft">
          {state.message}
        </p>
      </Card>
    );
  }

  return (
    <Card className="p-6 text-left sm:p-8">
      <form action={formAction} className="space-y-5">
        {/*
         * Honeypot. Hidden from sight and from assistive technology, and taken
         * out of the tab order, so no human can reach it — anything in it came
         * from a bot.
         */}
        <input
          type="text"
          name="website"
          tabIndex={-1}
          autoComplete="off"
          aria-hidden="true"
          className="hidden"
        />

        <div className="grid gap-5 sm:grid-cols-2">
          <div>
            <label className={labelClass} htmlFor="name">
              Your name
            </label>
            <input
              id="name"
              name="name"
              required
              autoComplete="name"
              className={fieldClass}
              placeholder="Jane Rivera"
              aria-describedby={state.field === "name" ? "form-error" : undefined}
            />
          </div>
          <div>
            <label className={labelClass} htmlFor="email">
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              autoComplete="email"
              className={fieldClass}
              placeholder="you@example.com"
              aria-describedby={state.field === "email" ? "form-error" : undefined}
            />
          </div>
        </div>

        <div className="grid gap-5 sm:grid-cols-2">
          <div>
            <label className={labelClass} htmlFor="association_name">
              Association name{" "}
              <span className="font-normal text-ink-muted">(optional)</span>
            </label>
            <input
              id="association_name"
              name="association_name"
              className={fieldClass}
              placeholder="Harborlight Condominium Association"
            />
          </div>
          <div>
            <label className={labelClass} htmlFor="location">
              City and state{" "}
              <span className="font-normal text-ink-muted">(optional)</span>
            </label>
            <input
              id="location"
              name="location"
              className={fieldClass}
              placeholder="Fort Lauderdale, FL"
            />
          </div>
        </div>

        <div className="grid gap-5 sm:grid-cols-2">
          <div>
            <label className={labelClass} htmlFor="role">
              You are{" "}
              <span className="font-normal text-ink-muted">(optional)</span>
            </label>
            <select id="role" name="role" className={fieldClass} defaultValue="">
              <option value="">Prefer not to say</option>
              <option value="board">On the board</option>
              <option value="manager">A management company</option>
              <option value="resident">A resident</option>
              <option value="other">Something else</option>
            </select>
          </div>
          <div>
            <label className={labelClass} htmlFor="phone">
              Phone <span className="font-normal text-ink-muted">(optional)</span>
            </label>
            <input
              id="phone"
              name="phone"
              type="tel"
              autoComplete="tel"
              className={fieldClass}
              placeholder="(954) 555-0142"
            />
          </div>
        </div>

        <div>
          <label className={labelClass} htmlFor="message">
            Anything else{" "}
            <span className="font-normal text-ink-muted">(optional)</span>
          </label>
          <textarea
            id="message"
            name="message"
            rows={4}
            className={fieldClass}
            placeholder="How many units, whether you have a site today, anything you'd want on it."
          />
        </div>

        {state.status === "error" ? (
          <p
            id="form-error"
            role="alert"
            className="rounded-card border border-accent/30 bg-accent-soft px-4 py-3 text-base text-accent"
          >
            {state.message}
          </p>
        ) : null}

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <Button type="submit" size="lg" disabled={pending}>
            {pending ? "Sending…" : "Ask for a free concept"}
            {pending ? null : (
              <ArrowRight className="h-5 w-5" aria-hidden="true" />
            )}
          </Button>
          <p className="text-sm text-ink-muted">
            No cost, nothing to sign. We reply with a link to your concept.
          </p>
        </div>
      </form>
    </Card>
  );
}
