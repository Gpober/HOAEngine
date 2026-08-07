"use client";

import { Plus, Trash2 } from "lucide-react";
import { useActionState, useState } from "react";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { MicButton } from "@/components/ui/MicButton";
import { saveMeetings, type MeetingInput, type SaveState } from "./actions";

const initial: SaveState = { status: "idle" };

const fieldClass =
  "w-full rounded-card border border-line bg-card px-3 py-2 text-base text-ink outline-none focus:border-accent";
const labelClass = "mb-1 block text-sm font-semibold text-ink-soft";

const KINDS = [
  ["board", "Board"],
  ["annual", "Annual"],
  ["committee", "Committee"],
  ["special", "Special"],
] as const;

function blank(index: number): MeetingInput {
  return {
    id: `m-${Date.now()}-${index}`,
    kind: "board",
    title: "",
    dateLabel: "",
    timeLabel: "",
    locationLabel: "",
  };
}

export function MeetingsEditor({
  slug,
  initialMeetings,
}: {
  slug: string;
  initialMeetings: MeetingInput[];
}) {
  const [rows, setRows] = useState<MeetingInput[]>(
    initialMeetings.length ? initialMeetings : [blank(0)],
  );
  const [state, formAction, pending] = useActionState(
    saveMeetings.bind(null, slug),
    initial,
  );

  const update = (i: number, key: keyof MeetingInput, value: string) =>
    setRows((prev) =>
      prev.map((row, index) => (index === i ? { ...row, [key]: value } : row)),
    );

  return (
    <Card className="p-6 sm:p-8">
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <h2 className="font-display text-xl font-semibold text-ink">Meetings</h2>
        <p className="text-sm text-ink-muted">
          Dates are shown exactly as you type them.
        </p>
      </div>

      <form action={formAction} className="mt-6 space-y-5">
        <input type="hidden" name="meetings" value={JSON.stringify(rows)} />

        {rows.map((row, i) => (
          <div
            key={row.id}
            className="rounded-card border border-line p-4 sm:p-5"
          >
            <div className="flex items-start gap-3">
              <div className="grid flex-1 gap-4 sm:grid-cols-2">
                <div className="sm:col-span-2">
                  <label className={labelClass} htmlFor={`title-${i}`}>
                    What is it
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      id={`title-${i}`}
                      value={row.title}
                      onChange={(e) => update(i, "title", e.target.value)}
                      className={fieldClass}
                      placeholder="Board of Directors Meeting"
                    />
                    <MicButton
                      label="Dictate the meeting name"
                      onText={(t) => update(i, "title", t)}
                    />
                  </div>
                </div>

                <div>
                  <label className={labelClass} htmlFor={`date-${i}`}>
                    When
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      id={`date-${i}`}
                      value={row.dateLabel}
                      onChange={(e) => update(i, "dateLabel", e.target.value)}
                      className={fieldClass}
                      placeholder="Second Tuesday, 12 August"
                    />
                    {/*
                     * Free text, not a date picker. Boards write "second
                     * Tuesday of the month" far more often than a single date,
                     * and a picker cannot hold that — it would force them to
                     * invent twelve entries for a recurring meeting.
                     */}
                    <MicButton
                      label="Dictate the date"
                      onText={(t) => update(i, "dateLabel", t)}
                    />
                  </div>
                </div>

                <div>
                  <label className={labelClass} htmlFor={`time-${i}`}>
                    Time
                  </label>
                  <input
                    id={`time-${i}`}
                    value={row.timeLabel}
                    onChange={(e) => update(i, "timeLabel", e.target.value)}
                    className={fieldClass}
                    placeholder="6:30 PM"
                  />
                </div>

                <div>
                  <label className={labelClass} htmlFor={`where-${i}`}>
                    Where
                  </label>
                  <input
                    id={`where-${i}`}
                    value={row.locationLabel}
                    onChange={(e) => update(i, "locationLabel", e.target.value)}
                    className={fieldClass}
                    placeholder="Clubhouse — Main Hall"
                  />
                </div>

                <div>
                  <label className={labelClass} htmlFor={`kind-${i}`}>
                    Type
                  </label>
                  <select
                    id={`kind-${i}`}
                    value={row.kind}
                    onChange={(e) => update(i, "kind", e.target.value)}
                    className={fieldClass}
                  >
                    {KINDS.map(([value, label]) => (
                      <option key={value} value={value}>
                        {label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setRows((prev) => prev.filter((_, x) => x !== i))}
                aria-label={`Remove ${row.title || `meeting ${i + 1}`}`}
                className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-pill text-ink-muted hover:bg-accent-soft hover:text-accent"
              >
                <Trash2 className="h-5 w-5" aria-hidden="true" />
              </button>
            </div>
          </div>
        ))}

        <div className="flex flex-wrap items-center gap-3">
          <Button
            type="button"
            variant="outline"
            onClick={() => setRows((prev) => [...prev, blank(prev.length)])}
          >
            <Plus className="h-5 w-5" aria-hidden="true" />
            Add a meeting
          </Button>
          <Button type="submit" disabled={pending}>
            {pending ? "Saving…" : "Save meetings"}
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
