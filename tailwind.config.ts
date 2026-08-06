import type { Config } from "tailwindcss";

/**
 * Every colour below resolves to a CSS custom property that is set by the
 * active association theme (see `lib/themes.ts` + `<ThemeProvider>`).
 *
 * That means the exact same component tree renders in five visually distinct
 * palettes without a single conditional class name.
 */
function token(name: string) {
  return `rgb(var(--hoa-${name}) / <alpha-value>)`;
}

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./data/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        surface: token("surface"),
        "surface-alt": token("surface-alt"),
        card: token("card"),
        ink: token("ink"),
        "ink-soft": token("ink-soft"),
        "ink-muted": token("ink-muted"),
        accent: token("accent"),
        "accent-strong": token("accent-strong"),
        "accent-soft": token("accent-soft"),
        "accent-ink": token("accent-ink"),
        secondary: token("secondary"),
        "secondary-soft": token("secondary-soft"),
        "secondary-ink": token("secondary-ink"),
        line: token("line"),
      },
      fontFamily: {
        display: "var(--hoa-font-display)",
        body: "var(--hoa-font-body)",
      },
      borderRadius: {
        card: "var(--hoa-radius-card)",
        pill: "var(--hoa-radius-pill)",
      },
      boxShadow: {
        soft: "0 1px 2px rgb(var(--hoa-shadow) / 0.04), 0 8px 24px -12px rgb(var(--hoa-shadow) / 0.18)",
        lift: "0 2px 4px rgb(var(--hoa-shadow) / 0.05), 0 18px 44px -18px rgb(var(--hoa-shadow) / 0.28)",
        inset: "inset 0 1px 0 0 rgb(255 255 255 / 0.6)",
      },
      maxWidth: {
        shell: "76rem",
        prose: "68ch",
      },
      letterSpacing: {
        eyebrow: "0.16em",
      },
      keyframes: {
        "fade-up": {
          from: { opacity: "0", transform: "translateY(8px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        "fade-in": {
          from: { opacity: "0" },
          to: { opacity: "1" },
        },
      },
      animation: {
        // Deliberately short + subtle: no motion-heavy marketing effects.
        "fade-up": "fade-up 0.5s ease-out both",
        "fade-in": "fade-in 0.3s ease-out both",
      },
    },
  },
  plugins: [],
};

export default config;
