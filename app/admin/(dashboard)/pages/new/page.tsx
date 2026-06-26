import Link from "next/link";
import {
  ArrowLeft,
  ArrowRight,
  GitCompare,
  DollarSign,
  MapPin,
  Wrench,
  Newspaper,
  Trophy,
  Megaphone,
  type LucideIcon,
} from "lucide-react";
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

interface TemplateType {
  type: string;
  label: string;
  route: string;
  icon: LucideIcon;
  description: string;
}

const TYPES: TemplateType[] = [
  {
    type: "ServicePage",
    label: "Service page",
    route: "/your-slug",
    icon: Wrench,
    description: "A core service: what it covers, the process, pricing and FAQs.",
  },
  {
    type: "ComparisonPage",
    label: "Comparison page",
    route: "/your-slug",
    icon: GitCompare,
    description: "Weigh two options side by side to help customers decide.",
  },
  {
    type: "CostGuidePage",
    label: "Cost guide",
    route: "/your-slug",
    icon: DollarSign,
    description: "Transparent pricing breakdowns and what drives the cost.",
  },
  {
    type: "ServiceSuburbPage",
    label: "Service + suburb page",
    route: "/your-slug",
    icon: MapPin,
    description: "A service tailored to one suburb for local search reach.",
  },
  {
    type: "ProblemPage",
    label: "Problem page",
    route: "/problems/your-slug",
    icon: Wrench,
    description: "Diagnose a common fault and point to the fix.",
  },
  {
    type: "Article",
    label: "Blog article",
    route: "/blog/your-slug",
    icon: Newspaper,
    description: "Long-form content, news or how-tos for the blog.",
  },
  {
    type: "CaseStudyPage",
    label: "Case study",
    route: "/case-studies/your-slug",
    icon: Trophy,
    description: "Show off a real job: the challenge, the work, the result.",
  },
  {
    type: "LandingPage",
    label: "Landing page (paid)",
    route: "/lp/your-slug",
    icon: Megaphone,
    description: "A focused, conversion-first page for paid campaigns.",
  },
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
          <Link
            href="/admin/pages/new"
            className="inline-flex items-center gap-1 text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            <ArrowLeft className="size-4" /> Choose a different type
          </Link>
          <h1 className="cgd-h2 mt-1 text-foreground">New {selected.label.toLowerCase()}</h1>
          <p className="cgd-small text-muted-foreground">Published at {selected.route}</p>
        </div>
        <FormFor type={selected.type} />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <Link
          href="/admin/pages"
          className="inline-flex items-center gap-1 text-sm text-muted-foreground transition-colors hover:text-foreground"
        >
          <ArrowLeft className="size-4" /> Back to pages
        </Link>
        <p className="cgd-eyebrow mt-3 text-brand">Create</p>
        <h1 className="cgd-h1 mt-1 text-foreground">Start a new page</h1>
        <p className="cgd-lead mt-1.5 max-w-prose text-muted-foreground">
          Pick a template to start from. You can change the content and settings once you&apos;re in
          the editor.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {TYPES.map((t) => {
          const Icon = t.icon;
          return (
            <Link
              key={t.type}
              href={`/admin/pages/new?type=${t.type}`}
              className="elevate-card group relative flex flex-col gap-3 rounded-2xl border border-border bg-surface-elevated p-5 outline-none transition-all hover:-translate-y-0.5 hover:border-brand/40 hover:shadow-elevated focus-visible:ring-3 focus-visible:ring-ring/50 motion-reduce:transition-none motion-reduce:hover:translate-y-0"
            >
              <span className="flex size-11 items-center justify-center rounded-xl bg-gradient-brand text-brand-foreground shadow-card transition-transform group-hover:scale-105 motion-reduce:group-hover:scale-100">
                <Icon className="size-5" />
              </span>
              <div className="flex-1">
                <div className="flex items-center gap-1.5">
                  <h2 className="cgd-h3 text-base text-foreground">{t.label}</h2>
                  <ArrowRight className="size-4 -translate-x-1 text-muted-foreground/0 transition-all group-hover:translate-x-0 group-hover:text-brand motion-reduce:transition-none" />
                </div>
                <p className="cgd-small mt-1 text-muted-foreground">{t.description}</p>
              </div>
              <span className="font-mono text-xs text-muted-foreground/80">{t.route}</span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
