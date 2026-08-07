"use client";

import { Mic, Square } from "lucide-react";
import { cn } from "@/lib/cn";
import { useSpeechRecognition } from "@/lib/useSpeechRecognition";

/**
 * Dictate into any text field.
 *
 * Renders nothing where the browser cannot do it, rather than showing a button
 * that fails on press. `interim` is exposed to the caller so the words can
 * appear in the field as they are spoken.
 */
export function MicButton({
  onText,
  onInterim,
  label = "Dictate",
  className,
}: {
  onText: (text: string) => void;
  onInterim?: (text: string) => void;
  label?: string;
  className?: string;
}) {
  const { supported, listening, interim, error, start, stop } =
    useSpeechRecognition({ onFinal: onText });

  // Mirror partial results out to the caller as they arrive.
  if (onInterim) onInterim(interim);

  if (!supported) return null;

  return (
    <>
      <button
        type="button"
        onClick={listening ? stop : start}
        aria-label={listening ? "Stop dictating" : label}
        aria-pressed={listening}
        className={cn(
          "inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-pill transition-colors",
          listening
            ? "bg-accent text-accent-ink"
            : "border border-line text-ink-muted hover:border-accent hover:text-accent",
          className,
        )}
      >
        {listening ? (
          <Square className="h-4 w-4" aria-hidden="true" />
        ) : (
          <Mic className="h-5 w-5" aria-hidden="true" />
        )}
      </button>
      {/*
       * Announced politely rather than as an alert: dictation state changes
       * often, and an assertive region would interrupt the user mid-sentence.
       */}
      <span aria-live="polite" className="sr-only">
        {listening ? "Listening" : ""}
        {error ?? ""}
      </span>
      {error ? (
        <span className="sr-only" role="status">
          {error}
        </span>
      ) : null}
    </>
  );
}
