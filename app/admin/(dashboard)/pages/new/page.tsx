import Link from "next/link";
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

const TYPES: { type: string; label: string; route: string }[] = [
  { type: "ServicePage", label: "Service page", route: "/your-slug" },
  { type: "ComparisonPage", label: "Comparison page", route: "/your-slug" },
  { type: "CostGuidePage", label: "Cost guide", route: "/your-slug" },
  { type: "ServiceSuburbPage", label: "Service + suburb page", route: "/your-slug" },
  { type: "ProblemPage", label: "Problem page", route: "/problems/your-slug" },
  { type: "Article", label: "Blog article", route: "/blog/your-slug" },
  { type: "CaseStudyPage", label: "Case study", route: "/case-studies/your-slug" },
  { type: "LandingPage", label: "Landing page (paid)", route: "/lp/your-slug" },
];

function FormFor({ type }: { type: string }) {
  switch (type) {
    case "ServicePage":
      return <ServicePageForm />;
    case "ComparisonPage":
      return <ComparisonPageForm />;
    case "CostGuidePage":
      return <CostGuidePageForm />;
    case "ServiceSuburbPage":
      return <ServiceSuburbPageForm />;
    case "CaseStudyPage":
      return <CaseStudyPageForm />;
    case "Article":
      return <ArticleForm />;
    case "ProblemPage":
      return <ProblemPageForm />;
    case "LandingPage":
      return <LandingPageForm />;
    default:
      return null;
  }
}

export default async function NewPage({ searchParams }: { searchParams: Promise<{ type?: string }> }) {
  const { type } = await searchParams;
  const selected = TYPES.find((t) => t.type === type);

  // Any registered template type → the in-place visual editor seeded with a blank draft.
  if (selected && isRegisteredTemplateType(selected.type)) {
    return (
      <PageEditor
        templateType={selected.type}
        initialDraft={editorRegistry[selected.type].seedBlank()}
      />
    );
  }

  if (selected) {
    return (
      <div className="space-y-6">
        <div>
          <Link href="/admin/pages/new" className="text-sm text-muted-foreground hover:text-foreground">
            ← Choose a different type
          </Link>
          <h1 className="mt-1 text-xl font-semibold">New {selected.label.toLowerCase()}</h1>
          <p className="text-sm text-muted-foreground">Published at {selected.route}</p>
        </div>
        <FormFor type={selected.type} />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <Link href="/admin/pages" className="text-sm text-muted-foreground hover:text-foreground">
          ← Back to pages
        </Link>
        <h1 className="mt-1 text-xl font-semibold">New page</h1>
        <p className="text-sm text-muted-foreground">Pick a template type to create.</p>
      </div>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        {TYPES.map((t) => (
          <Link
            key={t.type}
            href={`/admin/pages/new?type=${t.type}`}
            className="rounded-xl border border-border bg-card p-4 transition-colors hover:bg-muted/40"
          >
            <div className="font-medium">{t.label}</div>
            <div className="font-mono text-xs text-muted-foreground">{t.route}</div>
          </Link>
        ))}
      </div>
    </div>
  );
}
