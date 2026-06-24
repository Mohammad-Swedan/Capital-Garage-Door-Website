import type { Metadata } from "next";
import { Phone, FileText, Star } from "lucide-react";
import { Container } from "@/components/layout/container";
import { Reveal } from "@/components/motion/reveal";
import { StickyMobileCta } from "@/components/layout/sticky-mobile-cta";
import { Breadcrumbs } from "@/components/seo/breadcrumbs";
import { JsonLd } from "@/components/seo/json-ld";
import { PageHero } from "@/components/sections/page-hero";
import { CTASection } from "@/components/sections/cta-section";
import { ArticleCard } from "@/components/sections/blog/article-card";
import { BlogCategoryFilter } from "@/components/sections/blog/blog-category-filter";
import type { ArticleTeaser } from "@/components/sections/blog/article-teaser-card";
import { getArticles, getArticleBySlug } from "@/lib/data/articles";
import { collectionPageSchema } from "@/lib/seo/schema";
import { buildMetadata } from "@/lib/seo/metadata";
import { siteConfig } from "@/config/site";

export const metadata: Metadata = buildMetadata({
  title: "Garage Door Blog | Maintenance, Repairs & Cost Guides Perth",
  description:
    "Practical guides on garage door servicing, repairs, motors, and costs for Perth homeowners — written by Capital Garage Door's local technicians.",
  path: "/blog",
});

const BLOG_CATEGORIES = ["Maintenance", "Repairs", "Motors", "Costs", "Buying Guides", "Troubleshooting"] as const;

const UPCOMING_TOPICS: ArticleTeaser[] = [
  {
    category: "Repairs",
    title: "Garage Door Off Its Tracks? What to Check Before You Call",
    description: "Safe checks you can do yourself, and the signs that mean it's time to call a technician.",
  },
  {
    category: "Motors",
    title: "Chain, Belt, or Direct Drive: Choosing a Garage Door Motor",
    description: "A plain-language comparison of motor types for Perth homes, including noise and maintenance.",
  },
  {
    category: "Costs",
    title: "Garage Door Repair Cost Guide for Perth Homeowners",
    description: "Typical price ranges for common repairs, and what changes the final quote.",
  },
  {
    category: "Buying Guides",
    title: "Sectional vs Roller Doors: Which Is Right for Your Home?",
    description: "Weighing up space, budget, and street appeal when choosing a new garage door.",
  },
  {
    category: "Troubleshooting",
    title: "Why Is My Garage Door Remote Not Working?",
    description: "The most common causes of remote and sensor issues, from batteries to interference.",
  },
];

export default async function BlogPage() {
  const phone = siteConfig.business.phone;
  const [articles, featuredArticle] = await Promise.all([
    getArticles(),
    getArticleBySlug("how-often-should-you-service-a-garage-door"),
  ]);

  return (
    <>
      <JsonLd
        data={collectionPageSchema({
          name: "Garage Door Blog",
          description: "Maintenance, repair, motor, and cost guides for Perth homeowners.",
          path: "/blog",
        })}
      />

      <Container className="pt-6">
        <Breadcrumbs items={[{ name: "Home", url: "/" }, { name: "Blog", url: "/blog" }]} />
      </Container>

      <PageHero
        eyebrow="Expert Guides"
        title="Garage Door Advice, Costs & Maintenance Guides"
        subtitle="Practical, no-nonsense guides to help Perth homeowners understand repairs, servicing, motors, and garage door costs — written by our local technicians."
        ctas={[
          { label: "Call Now", href: `tel:${phone}`, icon: <Phone className="h-4 w-4" aria-hidden="true" /> },
          { label: "Request a Quote", href: "/contact", variant: "outline", icon: <FileText className="h-4 w-4" aria-hidden="true" /> },
        ]}
      />

      <section className="bg-background pb-2 sm:pb-4">
        <Container>
          <Reveal>
            <p className="max-w-3xl text-base leading-relaxed text-muted-foreground sm:text-lg">
              Whether your door is making a strange noise, your motor&apos;s playing up, or you&apos;re just
              trying to work out what a fair repair quote looks like, this is where we share what we tell our own
              customers — clear answers, no jargon, and no pressure to book anything.
            </p>
          </Reveal>
        </Container>
      </section>

      {featuredArticle && (
        <section className="bg-background py-10 sm:py-14">
          <Container>
            <Reveal>
              <span className="mb-4 inline-flex items-center gap-1.5 rounded-full border border-cta/20 bg-cta/5 px-3 py-1 text-xs font-bold tracking-wide text-cta uppercase">
                <Star className="h-3.5 w-3.5" aria-hidden="true" />
                Featured Article
              </span>
            </Reveal>
            <Reveal delay={0.05} className="max-w-2xl">
              <ArticleCard article={featuredArticle} featured />
            </Reveal>
          </Container>
        </section>
      )}

      <BlogCategoryFilter articles={articles} teasers={UPCOMING_TOPICS} categories={BLOG_CATEGORIES} />

      <CTASection
        heading="Need Garage Door Help in Perth?"
        body="Skip the research — call our local team or request a quote and we'll sort it out for you."
        buttons={[
          { label: "Call Now", href: `tel:${phone}`, icon: <Phone className="h-4 w-4" aria-hidden="true" /> },
          { label: "Request a Quote", href: "/contact", variant: "outline", icon: <FileText className="h-4 w-4" aria-hidden="true" /> },
        ]}
      />

      <StickyMobileCta />
    </>
  );
}
