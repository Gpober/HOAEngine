import Image from "next/image";
import { cn } from "@/lib/cn";
import type { CommunityImage as CommunityImageType, PlaceholderScene } from "@/lib/types";

/**
 * Renders community photography.
 *
 * When `image.src` is absent — which is the case for every bundled demo — a
 * generated SVG scene is drawn instead, tinted with the active theme. No stock
 * photography is bundled and nothing is scraped, so there is no third-party
 * imagery to license or attribute.
 *
 * To use real photography, set `src` on the image object in `data/associations.ts`.
 */
export function CommunityImage({
  image,
  className,
  priority = false,
  sizes = "100vw",
  rounded = true,
  focus = "bottom",
  labelAlign = "left",
}: {
  image: CommunityImageType;
  className?: string;
  priority?: boolean;
  sizes?: string;
  rounded?: boolean;
  /** Which part of the artwork to keep when the frame crops it. */
  focus?: SceneFocus;
  /** Which corner the "Photo placeholder" chip sits in. */
  labelAlign?: "left" | "right";
}) {
  /*
   * The wrapper must stay `position: relative` — it is the containing block for
   * the image inside it. Callers that need the whole thing positioned should
   * wrap it in their own absolutely-positioned element rather than passing an
   * `absolute` class in here, which would collapse it to zero height.
   */
  const wrapperClass = cn(
    "relative isolate overflow-hidden bg-accent-soft",
    rounded && "rounded-card",
    className,
  );

  if (image.src) {
    return (
      <div className={wrapperClass}>
        <Image
          src={image.src}
          alt={image.alt}
          fill
          sizes={sizes}
          priority={priority}
          className="object-cover"
        />
      </div>
    );
  }

  return (
    <div className={wrapperClass}>
      <PlaceholderScene
        scene={image.placeholder ?? "village"}
        alt={image.alt}
        focus={focus}
      />
      <span
        className={cn(
          "pointer-events-none absolute bottom-3 z-10 rounded-pill bg-card/85 px-3 py-1 text-xs font-semibold uppercase tracking-eyebrow text-ink-soft shadow-soft",
          labelAlign === "right" ? "right-3" : "left-3",
        )}
      >
        Photo placeholder
      </span>
    </div>
  );
}

/* -------------------------------------------------------------------------- */

/** Stable, dependency-free id so SVG gradient ids never collide on a page. */
function idFrom(value: string): string {
  let hash = 0;
  for (let i = 0; i < value.length; i += 1) {
    hash = (hash * 31 + value.charCodeAt(i)) | 0;
  }
  return Math.abs(hash).toString(36);
}

const A = (opacity: number) => `rgb(var(--hoa-accent) / ${opacity})`;
const S = (opacity: number) => `rgb(var(--hoa-secondary) / ${opacity})`;

/**
 * `bottom` keeps the ground line in frame — right for tall or square frames.
 * `center` keeps the mid-band (rooflines, treetops, water) — right for very
 * wide letterbox frames where a bottom crop would show only foreground.
 */
export type SceneFocus = "bottom" | "center";

export function PlaceholderScene({
  scene,
  alt,
  className,
  focus = "bottom",
}: {
  scene: PlaceholderScene;
  alt: string;
  className?: string;
  focus?: SceneFocus;
}) {
  const uid = idFrom(`${scene}-${alt}`);
  const skyId = `sky-${uid}`;
  const glowId = `glow-${uid}`;

  return (
    <svg
      /*
       * Scenes are drawn on an 800×600 stage. Letterbox frames pad the stage
       * horizontally instead of zooming into it, so the composition stays
       * legible rather than filling the frame with one enormous shape.
       */
      viewBox={focus === "center" ? "-200 -20 1200 640" : "0 0 800 600"}
      preserveAspectRatio={focus === "center" ? "xMidYMid slice" : "xMidYMax slice"}
      role="img"
      aria-label={alt}
      className={cn("absolute inset-0 h-full w-full", className)}
    >
      <defs>
        <linearGradient id={skyId} x1="0" y1="0" x2="0.35" y2="1">
          <stop offset="0%" stopColor="rgb(var(--hoa-accent-soft))" />
          <stop offset="55%" stopColor="rgb(var(--hoa-card))" />
          <stop offset="100%" stopColor="rgb(var(--hoa-secondary-soft))" />
        </linearGradient>
        <radialGradient id={glowId} cx="0.72" cy="0.22" r="0.5">
          <stop offset="0%" stopColor={S(0.45)} />
          <stop offset="100%" stopColor={S(0)} />
        </radialGradient>
      </defs>

      {/* Oversized so the backdrop still covers the padded viewBox above. */}
      <rect x="-400" y="-300" width="1600" height="1200" fill={`url(#${skyId})`} />
      <rect x="-400" y="-300" width="1600" height="1200" fill={`url(#${glowId})`} />

      <Scene scene={scene} />
    </svg>
  );
}

function Scene({ scene }: { scene: PlaceholderScene }) {
  switch (scene) {
    case "waterfront":
      return (
        <g>
          <circle cx="600" cy="150" r="58" fill={S(0.5)} />
          <g fill={A(0.28)}>
            <rect x="60" y="250" width="120" height="180" rx="8" />
            <rect x="196" y="210" width="96" height="220" rx="8" />
            <rect x="308" y="272" width="82" height="158" rx="8" />
          </g>
          <path d="M470 430 L470 300 L556 430 Z" fill={A(0.34)} />
          <rect x="460" y="428" width="112" height="14" rx="7" fill={A(0.5)} />
          <path d="M-400 430 H1200 V600 H-400 Z" fill={A(0.16)} />
          <g stroke={A(0.3)} strokeWidth="6" strokeLinecap="round" fill="none">
            <path d="M60 480 q40 -16 80 0 t80 0 t80 0" />
            <path d="M340 526 q40 -16 80 0 t80 0 t80 0" />
            <path d="M120 566 q40 -16 80 0 t80 0 t80 0" />
          </g>
        </g>
      );

    case "resort":
      return (
        <g>
          <circle cx="672" cy="126" r="52" fill={S(0.55)} />
          <path d="M-400 360 H1200 V600 H-400 Z" fill={A(0.14)} />
          <g fill={A(0.34)}>
            <rect x="80" y="240" width="240" height="130" rx="10" />
            <rect x="360" y="280" width="150" height="90" rx="10" />
            <rect x="540" y="252" width="120" height="118" rx="10" />
          </g>
          <path d="M80 240 L200 182 L320 240 Z" fill={A(0.5)} />
          <path d="M530 252 L600 210 L670 252 Z" fill={A(0.44)} />
          <rect x="120" y="418" width="560" height="132" rx="62" fill={A(0.3)} />
          <g fill={S(0.6)}>
            <rect x="150" y="388" width="70" height="16" rx="8" />
            <rect x="250" y="388" width="70" height="16" rx="8" />
            <rect x="350" y="388" width="70" height="16" rx="8" />
          </g>
          <g fill={A(0.42)}>
            <circle cx="452" cy="318" r="48" />
            <rect x="445" y="318" width="14" height="88" rx="7" />
            <circle cx="726" cy="336" r="40" />
            <rect x="720" y="336" width="12" height="72" rx="6" />
          </g>
        </g>
      );

    case "garden":
      return (
        <g>
          <circle cx="140" cy="140" r="46" fill={S(0.45)} />
          <path d="M-400 380 H0 q200 -70 400 -10 t400 -30 H1200 V600 H-400 Z" fill={A(0.14)} />
          <path d="M-400 460 H0 q200 -60 400 0 t400 -20 H1200 V600 H-400 Z" fill={A(0.24)} />
          <g fill={A(0.4)}>
            <circle cx="220" cy="340" r="58" />
            <rect x="212" y="340" width="16" height="90" rx="8" />
            <circle cx="560" cy="300" r="72" />
            <rect x="551" y="300" width="18" height="120" rx="9" />
          </g>
          <path
            d="M120 600 q180 -120 340 -110 t260 40"
            fill="none"
            stroke={S(0.6)}
            strokeWidth="18"
            strokeLinecap="round"
          />
        </g>
      );

    case "skyline":
      return (
        <g>
          <g fill={A(0.2)}>
            <rect x="40" y="220" width="110" height="380" rx="6" />
            <rect x="560" y="180" width="120" height="420" rx="6" />
          </g>
          <g fill={A(0.36)}>
            <rect x="180" y="120" width="150" height="480" rx="8" />
            <rect x="360" y="240" width="170" height="360" rx="8" />
            <rect x="700" y="300" width="80" height="300" rx="6" />
          </g>
          <g fill="rgb(var(--hoa-card) / 0.55)">
            {[0, 1, 2, 3, 4, 5].map((row) =>
              [0, 1, 2].map((col) => (
                <rect
                  key={`${row}-${col}`}
                  x={200 + col * 44}
                  y={160 + row * 62}
                  width="26"
                  height="34"
                  rx="3"
                />
              )),
            )}
          </g>
          <path d="M-400 560 H1200 V600 H-400 Z" fill={A(0.28)} />
        </g>
      );

    case "village":
      return (
        <g>
          <path d="M-400 430 H0 q200 -50 400 -10 t400 -20 H1200 V600 H-400 Z" fill={A(0.16)} />
          {[
            { x: 90, w: 170, h: 150 },
            { x: 320, w: 190, h: 175 },
            { x: 570, w: 160, h: 140 },
          ].map((house) => (
            <g key={house.x}>
              <rect
                x={house.x}
                y={440 - house.h}
                width={house.w}
                height={house.h}
                rx="8"
                fill={A(0.3)}
              />
              <path
                d={`M${house.x - 18} ${440 - house.h} L${house.x + house.w / 2} ${
                  440 - house.h - 62
                } L${house.x + house.w + 18} ${440 - house.h} Z`}
                fill={A(0.45)}
              />
              <rect
                x={house.x + house.w / 2 - 22}
                y={440 - 78}
                width="44"
                height="78"
                rx="5"
                fill={S(0.55)}
              />
            </g>
          ))}
          <g fill={A(0.38)}>
            <circle cx="740" cy="330" r="46" />
            <circle cx="46" cy="352" r="38" />
          </g>
          <path d="M-400 440 H1200 V600 H-400 Z" fill={A(0.1)} />
        </g>
      );

    case "pool":
      return (
        <g>
          <path d="M-400 380 H1200 V600 H-400 Z" fill={S(0.2)} />
          <rect x="90" y="300" width="620" height="230" rx="28" fill={A(0.26)} />
          <g stroke="rgb(var(--hoa-card) / 0.65)" strokeWidth="7" strokeLinecap="round" fill="none">
            <path d="M140 370 q40 -14 80 0 t80 0 t80 0 t80 0 t80 0" />
            <path d="M140 440 q40 -14 80 0 t80 0 t80 0 t80 0 t80 0" />
          </g>
          <g fill={S(0.6)}>
            <rect x="90" y="230" width="120" height="16" rx="8" />
            <rect x="240" y="230" width="120" height="16" rx="8" />
          </g>
          <g fill={A(0.4)}>
            <circle cx="660" cy="180" r="52" />
            <rect x="652" y="180" width="16" height="80" rx="8" />
          </g>
        </g>
      );

    case "clubhouse":
      return (
        <g>
          <path d="M-400 470 H1200 V600 H-400 Z" fill={A(0.14)} />
          <rect x="140" y="270" width="520" height="200" rx="10" fill={A(0.28)} />
          <path d="M104 270 L400 150 L696 270 Z" fill={A(0.45)} />
          <g fill={S(0.55)}>
            {[0, 1, 2, 3].map((i) => (
              <rect key={i} x={210 + i * 110} y="330" width="60" height="140" rx="6" />
            ))}
          </g>
          <rect x="368" y="368" width="64" height="102" rx="6" fill={A(0.5)} />
          <g fill={A(0.32)}>
            <circle cx="86" cy="410" r="52" />
            <circle cx="716" cy="424" r="44" />
          </g>
        </g>
      );

    case "courtyard":
      return (
        <g>
          <path d="M-400 340 H1200 V600 H-400 Z" fill={A(0.2)} />
          <rect x="110" y="380" width="580" height="180" rx="10" fill={A(0.3)} />
          <g stroke="rgb(var(--hoa-card) / 0.7)" strokeWidth="5" fill="none">
            <rect x="140" y="400" width="520" height="140" rx="4" />
            <path d="M400 400 V540" />
            <path d="M140 470 H660" />
          </g>
          <rect x="392" y="330" width="16" height="80" rx="8" fill={S(0.7)} />
          <path d="M300 330 H500" stroke={S(0.7)} strokeWidth="10" strokeLinecap="round" />
          <g fill={A(0.34)}>
            <circle cx="120" cy="250" r="56" />
            <circle cx="690" cy="230" r="46" />
          </g>
        </g>
      );

    case "interior":
    default:
      return (
        <g>
          <path d="M-400 470 H1200 V600 H-400 Z" fill={S(0.28)} />
          <g fill={A(0.24)}>
            <rect x="80" y="120" width="240" height="230" rx="10" />
            <rect x="480" y="120" width="240" height="230" rx="10" />
          </g>
          <g stroke="rgb(var(--hoa-card) / 0.7)" strokeWidth="8" fill="none">
            <path d="M200 120 V350" />
            <path d="M80 235 H320" />
            <path d="M600 120 V350" />
            <path d="M480 235 H720" />
          </g>
          <rect x="250" y="380" width="300" height="90" rx="24" fill={A(0.4)} />
          <rect x="270" y="352" width="260" height="40" rx="18" fill={A(0.28)} />
          <g fill={S(0.6)}>
            <rect x="150" y="420" width="70" height="50" rx="12" />
            <rect x="580" y="420" width="70" height="50" rx="12" />
          </g>
        </g>
      );
  }
}
