import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ArticlePageTemplate } from "@/components/sections/blog/article-page-template";
import { PageSchema } from "@/components/seo/page-schema";
import { getArticleBySlug, getArticleSlugs } from "@/lib/data/articles";
import { buildMetadata } from "@/lib/seo/metadata";

interface ArticlePageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const slugs = await getArticleSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: ArticlePageProps): Promise<Metadata> {
  const { slug } = await params;
  const article = await getArticleBySlug(slug);

  if (!article) {
    return {};
  }

  return buildMetadata({
    title: article.seo.title,
    description: article.seo.description,
    path: `/blog/${article.slug}`,
    image: article.featuredImage,
    publishedTime: article.publishedAt || undefined,
    lastModified: article.updatedAt || article.publishedAt || undefined,
  });
}

export default async function ArticlePage({ params }: ArticlePageProps) {
  const { slug } = await params;
  const article = await getArticleBySlug(slug);

  if (!article) {
    notFound();
  }

  return (
    <>
      <PageSchema kind="article" data={article} />
      <ArticlePageTemplate article={article} />
    </>
  );
}
