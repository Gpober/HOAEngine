import type { Metadata } from "next";
import { Fraunces, Inter, Manrope, Nunito } from "next/font/google";
import { site } from "@/lib/site";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

const fraunces = Fraunces({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-fraunces",
  axes: ["SOFT", "WONK", "opsz"],
});

const manrope = Manrope({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-manrope",
});

const nunito = Nunito({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-nunito",
});

export const metadata: Metadata = {
  // Canonical origin, so Open Graph images and canonicals resolve absolutely.
  metadataBase: new URL(site.url),
  title: {
    default: `${site.name} — ${site.tagline}`,
    template: `%s | ${site.name}`,
  },
  description: site.tagline,
  /**
   * `noindex` is the DEFAULT here on purpose, not a blanket ban.
   *
   * Most routes in this app are unofficial concepts naming real associations
   * and must never be indexed. Making that the default means a page added later
   * fails safe. Pages that genuinely should rank — currently just the marketing
   * homepage — opt in by setting `robots: { index: true, follow: true }` in
   * their own metadata, which replaces this.
   */
  robots: {
    index: false,
    follow: false,
    nocache: true,
    googleBot: { index: false, follow: false },
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${fraunces.variable} ${manrope.variable} ${nunito.variable}`}
    >
      <body className="min-h-screen bg-surface font-body text-base text-ink antialiased">
        {children}
      </body>
    </html>
  );
}
