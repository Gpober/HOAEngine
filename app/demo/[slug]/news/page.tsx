import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { DemoSubPage } from "@/components/DemoSubPage";
import { Announcements } from "@/components/site/Announcements";
import { UpcomingMeetings } from "@/components/site/UpcomingMeetings";
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
  return demoSubPageMetadata(association, "News & Meetings", "news");
}

export default async function NewsPage({ params }: PageProps) {
  const { slug } = await params;
  const association = await getAssociationBySlug(slug);
  if (!association) notFound();

  return (
    <DemoSubPage
      association={association}
      title="News & Meetings"
      lede="Announcements and the meeting schedule, all in one place."
    >
      <Announcements association={association} />
      <UpcomingMeetings association={association} />
    </DemoSubPage>
  );
}
