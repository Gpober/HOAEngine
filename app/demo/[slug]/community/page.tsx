import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { DemoSubPage } from "@/components/DemoSubPage";
import { CommunityOverview } from "@/components/site/CommunityOverview";
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
  return demoSubPageMetadata(association, "Community", "community");
}

export default async function CommunityPage({ params }: PageProps) {
  const { slug } = await params;
  const association = await getAssociationBySlug(slug);
  if (!association) notFound();

  return (
    <DemoSubPage
      association={association}
      title="The Community"
      lede="Who we are, where we are, and what makes this place itself."
    >
      <CommunityOverview association={association} />
    </DemoSubPage>
  );
}
