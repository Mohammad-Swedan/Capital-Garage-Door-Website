"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { savePageAction } from "@/app/admin/actions";
import {
  AssetUploadField,
  CheckboxField,
  FaqEditor,
  ListField,
  RelatedLinksEditor,
  RepeaterField,
  SelectField,
  TextAreaField,
  TextField,
  type FaqItem,
  type RelatedLinkItem,
} from "@/components/admin/fields";

interface InitialPage {
  id: number;
  slug: string;
  title: string;
  seoTitle: string;
  seoDescription: string;
  noIndex: boolean;
  status: string;
  heroImageAssetId: number | null;
  data: Record<string, any>;
  faqs: { question: string; answer: string }[];
  relatedLinks: { targetPageId: number | null; staticHref: string | null; labelOverride: string | null; linkGroup: string }[];
}

function arr<T = any>(v: unknown): T[] {
  return Array.isArray(v) ? (v as T[]) : [];
}

export function ServicePageForm({ initial }: { initial?: InitialPage }) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [errors, setErrors] = useState<{ code: string; description: string }[]>([]);

  const d = initial?.data ?? {};
  const hero = d.hero ?? {};

  // Page meta
  const [slug, setSlug] = useState(initial?.slug ?? "");
  const [title, setTitle] = useState(initial?.title ?? "");
  const [seoTitle, setSeoTitle] = useState(initial?.seoTitle ?? "");
  const [seoDescription, setSeoDescription] = useState(initial?.seoDescription ?? "");
  const [noIndex, setNoIndex] = useState(initial?.noIndex ?? false);
  const [status, setStatus] = useState(initial?.status ?? "Draft");
  const [heroImageAssetId, setHeroImageAssetId] = useState<number | null>(initial?.heroImageAssetId ?? null);
  const [heroPreview, setHeroPreview] = useState<string | null>(null);

  // Hero (Data)
  const [heroH1, setHeroH1] = useState<string>(hero.h1 ?? "");
  const [heroSubtitle, setHeroSubtitle] = useState<string>(hero.subtitle ?? "");
  const [heroImageAlt, setHeroImageAlt] = useState<string>(hero.imageAlt ?? "");
  const [heroFloatingLabel, setHeroFloatingLabel] = useState<string>(hero.floatingCardLabel ?? "");
  const [badges, setBadges] = useState<Record<string, string>[]>(arr(hero.badges));

  // Body (Data)
  const [directAnswer, setDirectAnswer] = useState<string>(d.directAnswer ?? "");
  const [introHeading, setIntroHeading] = useState<string>(d.intro?.heading ?? "");
  const [introParagraphs, setIntroParagraphs] = useState<string[]>(arr<string>(d.intro?.paragraphs));
  const [problems, setProblems] = useState<Record<string, string>[]>(arr(d.problems));
  const [includedItems, setIncludedItems] = useState<string[]>(arr<string>(d.includedItems));
  const [processSteps, setProcessSteps] = useState<Record<string, string>[]>(arr(d.processSteps));
  const [costGuidanceIntro, setCostGuidanceIntro] = useState<string>(d.costGuidanceIntro ?? "");
  const [whyChoose, setWhyChoose] = useState<Record<string, string>[]>(arr(d.whyChoose));
  const [serviceAreas, setServiceAreas] = useState<string[]>(arr<string>(d.serviceAreas));
  const [ctaHeading, setCtaHeading] = useState<string>(d.cta?.heading ?? "");
  const [ctaSubtitle, setCtaSubtitle] = useState<string>(d.cta?.subtitle ?? "");

  // Relational
  const [faqs, setFaqs] = useState<FaqItem[]>(arr<FaqItem>(initial?.faqs));
  const [relatedLinks, setRelatedLinks] = useState<RelatedLinkItem[]>(
    arr(initial?.relatedLinks).map((l) => ({
      targetPageId: l.targetPageId ?? null,
      staticHref: l.staticHref ?? "",
      labelOverride: l.labelOverride ?? "",
      linkGroup: l.linkGroup ?? "RelatedServices",
    })),
  );

  function buildPayload() {
    return {
      ...(initial ? { id: initial.id } : {}),
      templateType: "ServicePage",
      routeGroup: "Flat",
      slug,
      title,
      seoTitle,
      seoDescription,
      noIndex,
      status,
      heroImageAssetId,
      data: {
        hero: {
          h1: heroH1,
          subtitle: heroSubtitle,
          badges,
          imageAlt: heroImageAlt,
          floatingCardLabel: heroFloatingLabel,
        },
        directAnswer,
        intro: { heading: introHeading, paragraphs: introParagraphs },
        problems,
        includedItems,
        processSteps,
        costGuidanceIntro,
        whyChoose,
        serviceAreas,
        cta: { heading: ctaHeading, subtitle: ctaSubtitle },
      },
      faqs: faqs.map((f, i) => ({ question: f.question, answer: f.answer, sortOrder: i })),
      relatedLinks: relatedLinks.map((l, i) => {
        const hasTarget = l.targetPageId != null && l.targetPageId > 0;
        return {
          targetPageId: hasTarget ? l.targetPageId : null,
          staticHref: hasTarget ? null : l.staticHref || null,
          labelOverride: l.labelOverride || null,
          linkGroup: l.linkGroup,
          sortOrder: i,
        };
      }),
      pricingRows: [],
      reviews: [],
      services: [],
    };
  }

  function submit(publish: boolean) {
    setErrors([]);
    startTransition(async () => {
      const result = await savePageAction(buildPayload(), publish);
      if (result.ok) {
        router.push("/admin/pages");
        router.refresh();
      } else {
        setErrors(result.errors ?? [{ code: "Error", description: "Save failed." }]);
      }
    });
  }

  return (
    <form
      className="space-y-8 pb-24"
      onSubmit={(e) => {
        e.preventDefault();
        submit(false);
      }}
    >
      {errors.length > 0 && (
        <div className="rounded-lg border border-destructive/40 bg-destructive/10 p-3 text-sm text-destructive">
          <p className="font-medium">Could not save:</p>
          <ul className="mt-1 list-disc pl-5">
            {errors.map((e, i) => (
              <li key={i}>
                <span className="font-mono text-xs">{e.code}</span> — {e.description}
              </li>
            ))}
          </ul>
        </div>
      )}

      <section className="space-y-4">
        <h2 className="text-lg font-semibold">Page &amp; SEO</h2>
        <TextField label="Title" value={title} onChange={setTitle} hint="Used as the H1 fallback and breadcrumb label." />
        <TextField label="Slug" value={slug} onChange={setSlug} hint="URL path under / (e.g. garage-door-repairs-perth)." />
        <TextField label="SEO title" value={seoTitle} onChange={setSeoTitle} hint="The <title> tag." />
        <TextAreaField label="SEO description" value={seoDescription} onChange={setSeoDescription} hint="The meta description." />
        <div className="grid grid-cols-2 gap-4">
          <SelectField
            label="Status"
            value={status}
            onChange={setStatus}
            options={[
              { value: "Draft", label: "Draft" },
              { value: "Published", label: "Published" },
            ]}
          />
          <div className="flex items-end">
            <CheckboxField label="No-index" checked={noIndex} onChange={setNoIndex} hint="Exclude from search engines" />
          </div>
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="text-lg font-semibold">Hero</h2>
        <AssetUploadField
          label="Hero image"
          assetId={heroImageAssetId}
          previewUrl={heroPreview}
          onUploaded={(id, url) => {
            setHeroImageAssetId(id);
            setHeroPreview(url);
          }}
        />
        <TextField label="Hero H1" value={heroH1} onChange={setHeroH1} />
        <TextAreaField label="Hero subtitle" value={heroSubtitle} onChange={setHeroSubtitle} />
        <TextField label="Hero image alt" value={heroImageAlt} onChange={setHeroImageAlt} />
        <TextField label="Floating card label" value={heroFloatingLabel} onChange={setHeroFloatingLabel} />
        <RepeaterField
          label="Hero badges"
          values={badges}
          onChange={setBadges}
          fields={[
            { key: "icon", label: "Icon (lucide name)" },
            { key: "label", label: "Label" },
          ]}
        />
      </section>

      <section className="space-y-4">
        <h2 className="text-lg font-semibold">Content</h2>
        <TextAreaField
          label="Direct answer"
          value={directAnswer}
          onChange={setDirectAnswer}
          rows={3}
          hint="The concise answer block (powers AEO / answer-engine surfacing)."
        />
        <TextField label="Intro heading" value={introHeading} onChange={setIntroHeading} />
        <ListField label="Intro paragraphs" values={introParagraphs} onChange={setIntroParagraphs} textarea />
        <RepeaterField
          label="Problems"
          values={problems}
          onChange={setProblems}
          fields={[
            { key: "label", label: "Label" },
            { key: "icon", label: "Icon (lucide name)" },
          ]}
        />
        <ListField label="Included items" values={includedItems} onChange={setIncludedItems} />
        <RepeaterField
          label="Process steps"
          values={processSteps}
          onChange={setProcessSteps}
          fields={[
            { key: "title", label: "Title" },
            { key: "description", label: "Description", type: "textarea" },
            { key: "icon", label: "Icon (lucide name)" },
          ]}
        />
        <TextAreaField label="Cost guidance intro" value={costGuidanceIntro} onChange={setCostGuidanceIntro} />
        <RepeaterField
          label="Why choose us"
          values={whyChoose}
          onChange={setWhyChoose}
          fields={[
            { key: "title", label: "Title" },
            { key: "description", label: "Description", type: "textarea" },
            { key: "icon", label: "Icon (lucide name)" },
          ]}
        />
        <ListField label="Service areas" values={serviceAreas} onChange={setServiceAreas} placeholder="Suburb name" />
        <div className="grid grid-cols-1 gap-4">
          <TextField label="CTA heading" value={ctaHeading} onChange={setCtaHeading} />
          <TextField label="CTA subtitle" value={ctaSubtitle} onChange={setCtaSubtitle} />
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="text-lg font-semibold">FAQs &amp; links</h2>
        <FaqEditor values={faqs} onChange={setFaqs} />
        <RelatedLinksEditor values={relatedLinks} onChange={setRelatedLinks} />
      </section>

      <div className="fixed inset-x-0 bottom-0 z-10 border-t border-border bg-background/95 px-6 py-3 backdrop-blur">
        <div className="mx-auto flex max-w-3xl items-center justify-end gap-3">
          <Button type="button" variant="outline" disabled={pending} onClick={() => router.push("/admin/pages")}>
            Cancel
          </Button>
          <Button type="submit" variant="secondary" disabled={pending}>
            {pending ? "Saving…" : "Save draft"}
          </Button>
          <Button type="button" disabled={pending} onClick={() => submit(true)}>
            {pending ? "Saving…" : "Save & publish"}
          </Button>
        </div>
      </div>
    </form>
  );
}
