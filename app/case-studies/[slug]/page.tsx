import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CaseStudyPageTemplate } from "@/components/sections/case-study/case-study-page-template";
import { getCaseStudyBySlug, getCaseStudySlugs } from "@/lib/data/case-studies";
import { buildMetadata } from "@/lib/seo/metadata";

interface CaseStudyPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const slugs = await getCaseStudySlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: CaseStudyPageProps): Promise<Metadata> {
  const { slug } = await params;
  const caseStudy = await getCaseStudyBySlug(slug);

  if (!caseStudy) {
    return {};
  }

  return buildMetadata({
    title: caseStudy.seo.title,
    description: caseStudy.seo.description,
    path: `/case-studies/${caseStudy.slug}`,
  });
}

export default async function CaseStudyPage({ params }: CaseStudyPageProps) {
  const { slug } = await params;
  const caseStudy = await getCaseStudyBySlug(slug);

  if (!caseStudy) {
    notFound();
  }

  return <CaseStudyPageTemplate data={caseStudy} />;
}
