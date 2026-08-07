import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { DemoSubPage } from "@/components/DemoSubPage";
import { FaqSection } from "@/components/site/FaqSection";
import { ManagementContact } from "@/components/site/ManagementContact";
import { getAllAssociations, getAssociationBySlug } from "@/lib/associations-source";
import { demoSubPageMetadata } from "@/lib/seo";

type PageProps = {
  params: Promise<{ slug: string }>;
};

export const revalidate = 300;
export const dynamicParams = true;

export async function generateStaticParams() {
  const associations = await getAllAssociations();
  return associations.map((association) => ({ slug: association.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const association = await getAssociationBySlug(slug);
  if (!association) return {};
  return demoSubPageMetadata(association, "Contact", "contact");
}

export default async function ContactPage({ params }: PageProps) {
  const { slug } = await params;
  const association = await getAssociationBySlug(slug);
  if (!association) notFound();

  return (
    <DemoSubPage
      association={association}
      title="Contact"
      lede="How to reach the office and the management company — and the questions residents ask most."
    >
      <ManagementContact association={association} />
      <FaqSection association={association} />
    </DemoSubPage>
  );
}
