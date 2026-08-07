import { Info } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { brand } from "@/lib/brand";

/**
 * Required top-of-page notice. Both parts are mandatory on every demo:
 * the "Sample Design by ..." credit and the unofficial-concept notice.
 *
 * One flowing paragraph rather than stacked rows: on a phone the stacked
 * version ran three lines tall and owned the top fifth of the screen before
 * the site itself appeared. Inline, the whole notice is two quiet lines at
 * phone width and one at desktop — present, legible, and out of the way.
 */
export function DisclaimerBar() {
  return (
    <div className="on-accent bg-accent text-accent-ink">
      <Container className="py-2 sm:py-2.5">
        {/* One text flow — the icon is inline so every word shares a baseline. */}
        <p className="text-xs leading-relaxed sm:text-sm">
          <Info
            className="mr-1.5 inline h-3.5 w-3.5 align-[-0.2em] sm:h-4 sm:w-4"
            aria-hidden="true"
          />
          <span className="font-semibold uppercase tracking-eyebrow">
            {brand.sampleDesignLabel}
          </span>{" "}
          <span className="text-accent-ink/85">{brand.unofficialNotice}</span>
        </p>
      </Container>
    </div>
  );
}
