import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { DemoSite } from "@/components/DemoSite";
import { associations, getAssociation } from "@/data/associations";
import { demoMetadata } from "@/lib/seo";

type PageProps = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return associations.map((association) => ({ slug: association.slug }));
}

/** Unknown slugs 404 rather than rendering an empty shell. */
export const dynamicParams = false;

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const association = getAssociation(slug);
  if (!association) return {};
  return demoMetadata(association);
}

export default async function DemoPage({ params }: PageProps) {
  const { slug } = await params;
  const association = getAssociation(slug);
  if (!association) notFound();

  return <DemoSite association={association} />;
}
