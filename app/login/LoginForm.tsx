"use client";

import { useActionState } from "react";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { signIn, type LoginState } from "./actions";

const initialState: LoginState = { status: "idle" };

const fieldClass =
  "w-full rounded-card border border-line bg-card px-4 py-3 text-base text-ink outline-none transition-colors focus:border-accent";

export function LoginForm({ next }: { next: string }) {
  const [state, formAction, pending] = useActionState(signIn, initialState);

  return (
    <Card className="p-6 sm:p-8">
      <form action={formAction} className="space-y-5">
        <input type="hidden" name="next" value={next} />

        <div>
          <label
            className="mb-1.5 block text-sm font-semibold text-ink-soft"
            htmlFor="email"
          >
            Email
          </label>
          <input
            id="email"
            name="email"
            type="email"
            required
            autoComplete="email"
            className={fieldClass}
          />
        </div>

        <div>
          <label
            className="mb-1.5 block text-sm font-semibold text-ink-soft"
            htmlFor="password"
          >
            Password
          </label>
          <input
            id="password"
            name="password"
            type="password"
            required
            autoComplete="current-password"
            className={fieldClass}
          />
        </div>

        {state.status === "error" ? (
          <p
            role="alert"
            className="rounded-card border border-accent/30 bg-accent-soft px-4 py-3 text-base text-accent"
          >
            {state.message}
          </p>
        ) : null}

        <Button type="submit" size="lg" className="w-full" disabled={pending}>
          {pending ? "Signing in…" : "Sign in"}
        </Button>
      </form>
    </Card>
  );
}
