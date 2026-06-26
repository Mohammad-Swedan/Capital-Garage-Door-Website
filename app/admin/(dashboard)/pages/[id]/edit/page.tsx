import Link from "next/link";
import { notFound } from "next/navigation";
import { getPage } from "@/lib/cms/admin";
import { ServicePageForm } from "@/components/admin/service-page-form";
import { ComparisonPageForm } from "@/components/admin/comparison-page-form";
import { CostGuidePageForm } from "@/components/admin/cost-guide-page-form";
import { ServiceSuburbPageForm } from "@/components/admin/service-suburb-page-form";
import { CaseStudyPageForm } from "@/components/admin/case-study-page-form";
import { ArticleForm } from "@/components/admin/article-form";
import { ProblemPageForm } from "@/components/admin/problem-page-form";
import { LandingPageForm } from "@/components/admin/landing-page-form";
import { PageEditor } from "@/components/admin/editor/page-editor";
import { editorRegistry, isRegisteredTemplateType } from "@/components/admin/editor/registry";

export const dynamic = "force-dynamic";

export default async function EditPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const res = await getPage(Number(id));
  if (!res.ok || !res.data) notFound();

  const p = res.data as Record<string, any>;
  // Full record incl. relational pins so each form can round-trip the children it doesn't manage
  // (UpdatePage replaces all children on save).
  const initial = {
    id: p.id as number,
    slug: (p.slug as string) ?? "",
    title: (p.title as string) ?? "",
    seoTitle: (p.seoTitle as string) ?? "",
    seoDescription: (p.seoDescription as string) ?? "",
    noIndex: Boolean(p.noIndex),
    status: (p.status as string) ?? "Draft",
    heroImageAssetId: (p.heroImageAssetId as number | null) ?? null,
    data: (p.data as Record<string, any>) ?? {},
    faqs: (p.faqs as { question: string; answer: string }[]) ?? [],
    relatedLinks: (p.relatedLinks as any[]) ?? [],
    pricingRows: (p.pricingRows as any[]) ?? [],
    reviews: (p.reviews as any[]) ?? [],
    services: (p.services as any[]) ?? [],
  };

  const templateType = p.templateType as string;

  // Any registered template type uses the in-place visual editor (it owns its own toolbar +
  // settings drawer). Unregistered types fall back to the classic field form below.
  if (isRegisteredTemplateType(templateType)) {
    const heroImageUrl = (p.heroImage as { cdnUrl?: string } | undefined)?.cdnUrl ?? null;
    return (
      <PageEditor
        templateType={templateType}
        initialDraft={editorRegistry[templateType].buildDraft(initial, heroImageUrl)}
        initial={initial}
      />
    );
  }

  function renderForm() {
    switch (templateType) {
      case "ServicePage":
        return <ServicePageForm initial={initial} />;
      case "ComparisonPage":
        return <ComparisonPageForm initial={initial} />;
      case "CostGuidePage":
        return <CostGuidePageForm initial={initial} />;
      case "ServiceSuburbPage":
        return <ServiceSuburbPageForm initial={initial} />;
      case "CaseStudyPage":
        return <CaseStudyPageForm initial={initial} />;
      case "Article":
        return <ArticleForm initial={initial} />;
      case "ProblemPage":
        return <ProblemPageForm initial={initial} />;
      case "LandingPage":
        return <LandingPageForm initial={initial} />;
      default:
        return (
          <div className="rounded-lg border border-border bg-muted/30 p-4 text-sm text-muted-foreground">
            No editor for template type <span className="font-medium">{templateType}</span>.
          </div>
        );
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <Link href="/admin/pages" className="text-sm text-muted-foreground hover:text-foreground">
          ← Back to pages
        </Link>
        <h1 className="mt-1 text-xl font-semibold">Edit: {initial.title}</h1>
        <p className="font-mono text-xs text-muted-foreground">
          {templateType} · /{initial.slug}
        </p>
      </div>
      {renderForm()}
    </div>
  );
}
