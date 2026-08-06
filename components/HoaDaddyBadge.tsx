"use client";

import { MessageSquare, Sparkles, X } from "lucide-react";
import { useCallback, useRef } from "react";
import { Button, ButtonLink } from "@/components/ui/Button";
import { brand } from "@/lib/brand";

/**
 * The discreet floating sales badge shown on every demo.
 *
 * Uses a native `<dialog>`: focus trapping, Escape-to-close, and inertness of
 * the page behind it come from the platform rather than hand-rolled JS.
 */
export function HoaDaddyBadge() {
  const dialogRef = useRef<HTMLDialogElement>(null);

  const open = useCallback(() => dialogRef.current?.showModal(), []);
  const close = useCallback(() => dialogRef.current?.close(), []);

  // Clicking the backdrop (i.e. the dialog element itself) closes the modal.
  const onDialogClick = useCallback((event: React.MouseEvent<HTMLDialogElement>) => {
    if (event.target === dialogRef.current) dialogRef.current?.close();
  }, []);

  return (
    <>
      <div className="pointer-events-none fixed inset-x-0 bottom-0 z-50 flex justify-end p-4 print:hidden sm:p-6">
        <button
          type="button"
          onClick={open}
          className="pointer-events-auto inline-flex min-h-[2.75rem] items-center gap-2 rounded-pill border border-line bg-card px-4 py-2.5 text-sm font-semibold text-ink shadow-lift transition-colors hover:bg-accent-soft hover:text-accent"
        >
          <Sparkles className="h-4 w-4 text-accent" aria-hidden="true" />
          {brand.badgeLabel}
        </button>
      </div>

      <dialog
        ref={dialogRef}
        onClick={onDialogClick}
        aria-labelledby="hoa-daddy-modal-title"
        className="w-[min(32rem,calc(100vw-2rem))] rounded-card border border-line bg-card p-0 text-ink shadow-lift backdrop:bg-ink/50 backdrop:backdrop-blur-sm"
      >
        <div className="relative p-6 sm:p-8">
          <button
            type="button"
            onClick={close}
            aria-label="Close"
            className="absolute right-4 top-4 inline-flex h-11 w-11 items-center justify-center rounded-pill text-ink-muted transition-colors hover:bg-accent-soft hover:text-accent"
          >
            <X className="h-5 w-5" aria-hidden="true" />
          </button>

          <p className="text-xs font-semibold uppercase tracking-eyebrow text-ink-muted">
            {brand.name}
          </p>
          <h2
            id="hoa-daddy-modal-title"
            className="mt-2 max-w-[22ch] font-display text-2xl font-semibold leading-snug text-ink"
          >
            {brand.modalHeadline}
          </h2>
          <p className="mt-3 text-base leading-relaxed text-ink-soft">
            {brand.modalBody}
          </p>

          <div className="mt-6 flex flex-col gap-3 sm:flex-row">
            <ButtonLink href={brand.links.requestDemo} className="sm:flex-1">
              <Sparkles className="h-5 w-5" aria-hidden="true" />
              Request a Custom Demo
            </ButtonLink>
            <ButtonLink
              href={brand.links.contact}
              variant="outline"
              className="sm:flex-1"
            >
              <MessageSquare className="h-5 w-5" aria-hidden="true" />
              Contact {brand.name}
            </ButtonLink>
          </div>

          <p className="mt-5 border-t border-line pt-4 text-sm leading-relaxed text-ink-muted">
            {brand.footerDisclaimer}
          </p>

          <div className="mt-4 flex justify-end">
            <Button variant="quiet" onClick={close}>
              Close
            </Button>
          </div>
        </div>
      </dialog>
    </>
  );
}
