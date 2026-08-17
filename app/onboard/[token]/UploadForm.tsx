"use client";

import { CheckCircle2, Loader2, UploadCloud, X } from "lucide-react";
import { useCallback, useRef, useState } from "react";
import { getSupabase } from "@/lib/supabase";

type Status = "queued" | "uploading" | "done" | "error";
type Item = { id: string; file: File; kind: string; status: Status };

const KIND_OPTIONS = [
  { value: "photo", label: "Community photo" },
  { value: "logo", label: "Logo" },
  { value: "document", label: "Document" },
  { value: "other", label: "Other" },
];

function guessKind(file: File): string {
  if (file.type === "application/pdf") return "document";
  if (/logo/i.test(file.name)) return "logo";
  return "photo";
}

export function UploadForm({ token }: { token: string }) {
  const [items, setItems] = useState<Item[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);

  const addFiles = useCallback((files: FileList | null) => {
    if (!files) return;
    const next = Array.from(files).map((file) => ({
      id: `${file.name}-${file.size}-${Math.random().toString(36).slice(2, 8)}`,
      file,
      kind: guessKind(file),
      status: "queued" as Status,
    }));
    setItems((prev) => [...prev, ...next]);
  }, []);

  const setItem = (id: string, patch: Partial<Item>) =>
    setItems((prev) => prev.map((it) => (it.id === id ? { ...it, ...patch } : it)));

  async function uploadOne(item: Item) {
    const supabase = getSupabase();
    if (!supabase) {
      setItem(item.id, { status: "error" });
      return;
    }
    setItem(item.id, { status: "uploading" });
    try {
      const res = await fetch("/api/onboard/sign", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          token,
          filename: item.file.name,
          contentType: item.file.type,
          kind: item.kind,
        }),
      });
      if (!res.ok) throw new Error(String(res.status));
      const { path, token: signedToken } = await res.json();
      const { error } = await supabase.storage
        .from("community-uploads")
        .uploadToSignedUrl(path, signedToken, item.file, { contentType: item.file.type });
      if (error) throw error;
      setItem(item.id, { status: "done" });
    } catch {
      setItem(item.id, { status: "error" });
    }
  }

  async function uploadAll() {
    const pending = items.filter((it) => it.status === "queued" || it.status === "error");
    for (const item of pending) {
      // Sequential keeps memory low on phones and avoids a burst of signs.
      // eslint-disable-next-line no-await-in-loop
      await uploadOne(item);
    }
  }

  const pendingCount = items.filter((it) => it.status === "queued" || it.status === "error").length;
  const doneCount = items.filter((it) => it.status === "done").length;

  return (
    <div className="flex flex-col gap-6">
      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        className="flex flex-col items-center justify-center gap-3 rounded-2xl border-2 border-dashed border-line bg-card px-6 py-12 text-center transition-colors hover:border-accent hover:bg-accent-soft/40"
      >
        <UploadCloud className="h-10 w-10 text-accent" aria-hidden="true" />
        <span className="font-display text-lg font-semibold text-ink">
          Choose photos, your logo, and documents
        </span>
        <span className="text-sm text-ink-muted">
          JPG, PNG, WEBP, or PDF · up to 25&nbsp;MB each · tap to browse or drop files here
        </span>
      </button>
      <input
        ref={inputRef}
        type="file"
        multiple
        accept="image/jpeg,image/png,image/webp,image/heic,image/gif,application/pdf"
        className="sr-only"
        onChange={(e) => addFiles(e.target.files)}
      />

      {items.length > 0 ? (
        <ul className="flex flex-col gap-2">
          {items.map((item) => (
            <li
              key={item.id}
              className="flex items-center gap-3 rounded-xl border border-line bg-card p-3"
            >
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium text-ink">{item.file.name}</p>
                <p className="text-xs text-ink-muted">
                  {(item.file.size / 1_048_576).toFixed(1)} MB
                </p>
              </div>
              <select
                value={item.kind}
                disabled={item.status === "uploading" || item.status === "done"}
                onChange={(e) => setItem(item.id, { kind: e.target.value })}
                className="rounded-lg border border-line bg-surface px-2 py-1.5 text-sm text-ink"
                aria-label={`What is ${item.file.name}?`}
              >
                {KIND_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
              <span className="flex h-6 w-6 shrink-0 items-center justify-center">
                {item.status === "uploading" ? (
                  <Loader2 className="h-5 w-5 animate-spin text-accent" aria-label="Uploading" />
                ) : item.status === "done" ? (
                  <CheckCircle2 className="h-5 w-5 text-accent" aria-label="Uploaded" />
                ) : item.status === "error" ? (
                  <span className="text-xs font-semibold text-red-600">Retry</span>
                ) : (
                  <button
                    type="button"
                    onClick={() => setItems((prev) => prev.filter((it) => it.id !== item.id))}
                    aria-label={`Remove ${item.file.name}`}
                    className="text-ink-muted hover:text-ink"
                  >
                    <X className="h-4 w-4" aria-hidden="true" />
                  </button>
                )}
              </span>
            </li>
          ))}
        </ul>
      ) : null}

      {items.length > 0 ? (
        <div className="flex flex-col items-center gap-3">
          <button
            type="button"
            onClick={uploadAll}
            disabled={pendingCount === 0}
            className="inline-flex min-h-[3rem] w-full items-center justify-center gap-2 rounded-pill bg-accent px-6 font-semibold text-accent-ink transition-opacity hover:opacity-90 disabled:opacity-50 sm:w-auto"
          >
            {pendingCount > 0 ? `Send ${pendingCount} file${pendingCount === 1 ? "" : "s"}` : "All sent"}
          </button>
          {doneCount > 0 ? (
            <p className="text-sm text-ink-soft">
              {doneCount} file{doneCount === 1 ? "" : "s"} received — thank you. You can close this
              page, or add more anytime with the same link.
            </p>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}
