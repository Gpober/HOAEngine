import { Info } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { brand } from "@/lib/brand";

/**
 * Required top-of-page notice. Both lines are mandatory on every demo:
 * the "Sample Design by HOA Daddy" credit and the unofficial-concept notice.
 */
export function DisclaimerBar() {
  return (
    <div className="on-accent bg-accent text-accent-ink">
      <Container className="flex flex-col items-start gap-1.5 py-2.5 sm:flex-row sm:items-center sm:gap-3">
        <span className="inline-flex items-center gap-2 text-sm font-semibold uppercase tracking-eyebrow">
          <Info className="h-4 w-4 shrink-0" aria-hidden="true" />
          {brand.sampleDesignLabel}
        </span>
        <span className="text-sm leading-snug text-accent-ink/85">
          {brand.unofficialNotice}
        </span>
      </Container>
    </div>
  );
}
