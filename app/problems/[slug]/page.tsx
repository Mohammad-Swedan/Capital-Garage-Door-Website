import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ProblemPageTemplate } from "@/components/sections/problem/problem-page-template";
import { getProblemBySlug, getProblemSlugs } from "@/lib/data/problems";
import { buildMetadata } from "@/lib/seo/metadata";

interface ProblemPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const slugs = await getProblemSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: ProblemPageProps): Promise<Metadata> {
  const { slug } = await params;
  const problem = await getProblemBySlug(slug);

  if (!problem) {
    return {};
  }

  return buildMetadata({
    title: problem.metaTitle,
    description: problem.metaDescription,
    path: `/problems/${problem.slug}`,
    image: problem.heroImage,
  });
}

export default async function ProblemPage({ params }: ProblemPageProps) {
  const { slug } = await params;
  const problem = await getProblemBySlug(slug);

  if (!problem) {
    notFound();
  }

  return <ProblemPageTemplate problem={problem} />;
}
