import { CommunityImage } from "@/components/ui/CommunityImage";
import type { Association } from "@/lib/types";

/**
 * The photographs, edge to edge.
 *
 * A demo has about four seconds to convince a board that their community could
 * look like this, and nothing in a card does that — the photography is the only
 * thing on the page that carries feeling. So it breaks the container, runs the
 * full width of the viewport, and gets real height rather than sitting politely
 * in a column.
 *
 * Captions sit on the image under a bottom scrim rather than beneath it, so the
 * band reads as one continuous run of photography instead of three framed
 * pictures with labels.
 */
export function PhotoBand({ association }: { association: Association }) {
  const images = association.galleryImages.slice(0, 3);
  if (!images.length) return null;

  return (
    <section aria-label="Photographs of the community" className="bg-ink">
      <ul className="grid gap-px sm:grid-cols-3">
        {images.map((image, index) => (
          <li key={image.alt} className="relative">
            <CommunityImage
              image={image}
              rounded={false}
              /*
               * Tall on a phone where each photograph gets the full width, and
               * squarer across a three-up row so the band keeps a sane height
               * on a wide screen.
               */
              className="aspect-[4/5] w-full sm:aspect-square"
              sizes="(min-width: 640px) 34vw, 100vw"
              priority={index === 0}
            />
            {image.caption ? (
              <>
                <div
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-x-0 bottom-0 h-2/5 bg-gradient-to-t from-ink/90 via-ink/50 to-transparent"
                />
                <p className="absolute inset-x-0 bottom-0 p-5 text-center text-sm font-semibold uppercase tracking-eyebrow text-accent-ink sm:p-6">
                  {image.caption}
                </p>
              </>
            ) : null}
          </li>
        ))}
      </ul>
    </section>
  );
}
