import type { Metadata } from "next";
import { Fraunces, Inter, Manrope, Nunito } from "next/font/google";
import { brand } from "@/lib/brand";
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
  // Absolute URLs for Open Graph images. Set NEXT_PUBLIC_SITE_URL in Vercel to
  // your deployment URL; localhost is only the local development fallback.
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
  ),
  title: {
    default: `${brand.product} — Association Website Concepts by ${brand.name}`,
    template: `%s | ${brand.product}`,
  },
  description:
    "Unofficial website design concepts for homeowner and condominium associations, created for demonstration purposes by HOA Daddy.",
  // These are unofficial concepts — they must never be indexed.
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
