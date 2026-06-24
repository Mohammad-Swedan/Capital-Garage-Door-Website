import { SmartCta } from "@/components/sections/smart-cta";
import { CalendarCheck, FileText } from "lucide-react";
import { Breadcrumbs } from "@/components/seo/breadcrumbs";
import { JsonLd } from "@/components/seo/json-ld";
import { Container } from "@/components/layout/container";
import { StickyMobileCta } from "@/components/layout/sticky-mobile-cta";
import { DirectAnswer } from "@/components/sections/direct-answer";
import { CTASection } from "@/components/sections/cta-section";
import { FAQSection } from "@/components/sections/faq-section";
import { ArticleHero } from "@/components/sections/blog/article-hero";
import { TableOfContents } from "@/components/sections/blog/table-of-contents";
import { ArticleContent } from "@/components/sections/blog/article-content";
import { ExpertTipCards } from "@/components/sections/blog/expert-tip-cards";
import { RelatedServicesCta } from "@/components/sections/blog/related-services-cta";
import { RelatedArticles } from "@/components/sections/blog/related-articles";
import { blogArticleSchema } from "@/lib/seo/schema";
import { siteConfig } from "@/config/site";
import type { Article } from "@/types/article";

interface ArticlePageTemplateProps {
  article: Article;
}

/**
 * Reusable template for educational blog/guide articles (e.g.
 * /blog/how-often-should-you-service-a-garage-door). Drop in a new Article
 * content entry (content/articles/) to publish another guide — no component
 * changes needed.
 */
export function ArticlePageTemplate({ article }: ArticlePageTemplateProps) {
  const phone = siteConfig.business.phone;

  return (
    <>
      <JsonLd data={blogArticleSchema(article)} />

      <Container className="pt-6">
        <Breadcrumbs
          items={[
            { name: "Home", url: "/" },
            { name: "Blog", url: "/blog" },
            { name: article.title, url: `/blog/${article.slug}` },
          ]}
        />
      </Container>

      <ArticleHero article={article} />

      <DirectAnswer heading="Short Answer" answer={article.shortAnswer} />

      <section className="bg-background py-10 sm:py-14">
        <Container>
          <div className="mx-auto grid max-w-5xl gap-8 lg:grid-cols-[15rem_1fr] lg:items-start">
            {article.tableOfContents && article.tableOfContents.length > 0 && (
              <TableOfContents items={article.tableOfContents} />
            )}
            <article className="min-w-0">
              <ArticleContent blocks={article.contentBlocks} />
            </article>
          </div>
        </Container>
      </section>

      <ExpertTipCards tips={article.expertTips} />

      <RelatedServicesCta services={article.relatedServices} />

      <FAQSection faqs={article.faqs} heading="Frequently Asked Questions" />

      <RelatedArticles articles={article.relatedArticles} />

      <SmartCta />

      <StickyMobileCta />
    </>
  );
}
