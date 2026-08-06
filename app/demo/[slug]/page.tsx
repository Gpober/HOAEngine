import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { DemoSite } from "@/components/DemoSite";
import { getAllAssociations, getAssociationBySlug } from "@/lib/associations-source";
import { demoMetadata } from "@/lib/seo";

type PageProps = {
  params: Promise<{ slug: string }>;
};

/**
 * Concepts are prerendered at build time and refreshed periodically, so a demo
 * edited in Supabase goes live without a redeploy while pages still serve as
 * static HTML.
 */
export const revalidate = 300;

/** New database rows resolve on first request rather than 404ing until a rebuild. */
export const dynamicParams = true;

export async function generateStaticParams() {
  const associations = await getAllAssociations();
  return associations.map((association) => ({ slug: association.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const association = await getAssociationBySlug(slug);
  if (!association) return {};
  return demoMetadata(association);
}

export default async function DemoPage({ params }: PageProps) {
  const { slug } = await params;
  const association = await getAssociationBySlug(slug);
  if (!association) notFound();

  return <DemoSite association={association} />;
}
