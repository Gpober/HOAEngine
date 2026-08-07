import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { DemoSubPage } from "@/components/DemoSubPage";
import { Amenities } from "@/components/site/Amenities";
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
  return demoSubPageMetadata(association, "Amenities", "amenities");
}

export default async function AmenitiesPage({ params }: PageProps) {
  const { slug } = await params;
  const association = await getAssociationBySlug(slug);
  if (!association) notFound();

  return (
    <DemoSubPage
      association={association}
      title="Amenities"
      lede="The shared spaces that come with living here."
    >
      <Amenities association={association} />
    </DemoSubPage>
  );
}
