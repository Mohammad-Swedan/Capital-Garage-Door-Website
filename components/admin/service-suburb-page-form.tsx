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

function num(v: unknown): number | null {
  return typeof v === "number" && Number.isFinite(v) ? v : null;
}

export function ServiceSuburbPageForm({ initial }: { initial?: InitialPage }) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [errors, setErrors] = useState<{ code: string; description: string }[]>([]);

  const d = initial?.data ?? {};
  const hero = d.hero ?? {};
  const cost = d.costGuidance ?? {};

  // Page meta
  const [slug, setSlug] = useState(initial?.slug ?? "");
  const [title, setTitle] = useState(initial?.title ?? "");
  const [seoTitle, setSeoTitle] = useState(initial?.seoTitle ?? "");
  const [seoDescription, setSeoDescription] = useState(initial?.seoDescription ?? "");
  const [noIndex, setNoIndex] = useState(initial?.noIndex ?? false);
  const [status, setStatus] = useState(initial?.status ?? "Draft");
  const [heroImageAssetId, setHeroImageAssetId] = useState<number | null>(initial?.heroImageAssetId ?? null);
  const [heroPreview, setHeroPreview] = useState<string | null>(null);

  // Identity (Data)
  const [service, setService] = useState<string>(d.service ?? "");
  const [suburb, setSuburb] = useState<string>(d.suburb ?? "");
  const [region, setRegion] = useState<string>(d.region ?? "");

  // Hero (Data)
  const [heroSubtitle, setHeroSubtitle] = useState<string>(hero.subtitle ?? "");
  const [trustBadges, setTrustBadges] = useState<string[]>(arr<string>(hero.trustBadges));

  // Body (Data)
  const [directAnswer, setDirectAnswer] = useState<string>(d.directAnswer ?? "");
  const [localIntro, setLocalIntro] = useState<string[]>(arr<string>(d.localIntro));
  const [availableServices, setAvailableServices] = useState<Record<string, string>[]>(arr(d.availableServices));
  const [problems, setProblems] = useState<Record<string, string>[]>(arr(d.problems));
  const [costIntro, setCostIntro] = useState<string>(cost.intro ?? "");
  const [costFactors, setCostFactors] = useState<string[]>(arr<string>(cost.factors));
  const [costNote, setCostNote] = useState<string>(cost.note ?? "");
  const [whyChooseUs, setWhyChooseUs] = useState<Record<string, string>[]>(arr(d.whyChooseUs));
  const [localProof, setLocalProof] = useState<Record<string, string>[]>(arr(d.localProof));

  // Relational
  const [faqs, setFaqs] = useState<FaqItem[]>(arr<FaqItem>(initial?.faqs));
  const [relatedLinks, setRelatedLinks] = useState<RelatedLinkItem[]>(
    arr(initial?.relatedLinks).map((l) => ({
      targetPageId: l.targetPageId ?? null,
      staticHref: l.staticHref ?? "",
      labelOverride: l.labelOverride ?? "",
      linkGroup: l.linkGroup ?? "NearbySuburbs",
    })),
  );

  function buildPayload() {
    return {
      ...(initial ? { id: initial.id } : {}),
      templateType: "ServiceSuburbPage",
      routeGroup: "Flat",
      slug,
      title,
      seoTitle,
      seoDescription,
      noIndex,
      status,
      heroImageAssetId,
      data: {
        service,
        suburb,
        region,
        hero: {
          subtitle: heroSubtitle,
          trustBadges,
        },
        directAnswer,
        localIntro,
        availableServices,
        problems,
        costGuidance: {
          intro: costIntro,
          factors: costFactors,
          note: costNote,
        },
        whyChooseUs,
        localProof: localProof.map((p) => ({
          serviceType: p.serviceType ?? "",
          suburb: p.suburb ?? "",
          problem: p.problem ?? "",
          solution: p.solution ?? "",
          beforeAssetId: num(p.beforeAssetId ? Number(p.beforeAssetId) : null),
          afterAssetId: num(p.afterAssetId ? Number(p.afterAssetId) : null),
        })),
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
        <TextField label="Slug" value={slug} onChange={setSlug} hint="URL path under / (e.g. garage-door-repairs-joondalup)." />
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
        <h2 className="text-lg font-semibold">Local identity</h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <TextField label="Service" value={service} onChange={setService} hint="e.g. Garage Door Repairs" />
          <TextField label="Suburb" value={suburb} onChange={setSuburb} hint="e.g. Joondalup" />
          <TextField label="Region" value={region} onChange={setRegion} hint="e.g. Perth, WA" />
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
        <TextAreaField label="Hero subtitle" value={heroSubtitle} onChange={setHeroSubtitle} />
        <ListField label="Trust badges" values={trustBadges} onChange={setTrustBadges} placeholder="e.g. Fast Response" />
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
        <ListField label="Local intro paragraphs" values={localIntro} onChange={setLocalIntro} textarea />
        <RepeaterField
          label="Available services"
          values={availableServices}
          onChange={setAvailableServices}
          fields={[
            { key: "title", label: "Title" },
            { key: "description", label: "Description", type: "textarea" },
            { key: "icon", label: "Icon (lucide name)" },
          ]}
        />
        <RepeaterField
          label="Local problems"
          values={problems}
          onChange={setProblems}
          fields={[
            { key: "title", label: "Title" },
            { key: "description", label: "Description", type: "textarea" },
            { key: "icon", label: "Icon (lucide name)" },
          ]}
        />
        <fieldset className="space-y-3 rounded-lg border border-border p-3">
          <legend className="px-1 text-sm font-medium text-foreground">Cost guidance</legend>
          <TextAreaField label="Intro" value={costIntro} onChange={setCostIntro} />
          <ListField label="Factors" values={costFactors} onChange={setCostFactors} textarea />
          <TextField label="Note" value={costNote} onChange={setCostNote} />
        </fieldset>
        <RepeaterField
          label="Why choose us"
          values={whyChooseUs}
          onChange={setWhyChooseUs}
          fields={[
            { key: "title", label: "Title" },
            { key: "description", label: "Description", type: "textarea" },
            { key: "icon", label: "Icon (lucide name)" },
          ]}
        />
        <RepeaterField
          label="Local proof (recent work)"
          values={localProof}
          onChange={setLocalProof}
          fields={[
            { key: "serviceType", label: "Service type" },
            { key: "suburb", label: "Suburb" },
            { key: "problem", label: "Problem", type: "textarea" },
            { key: "solution", label: "Solution", type: "textarea" },
            { key: "beforeAssetId", label: "Before asset ID (optional)" },
            { key: "afterAssetId", label: "After asset ID (optional)" },
          ]}
        />
      </section>

      <section className="space-y-4">
        <h2 className="text-lg font-semibold">FAQs &amp; links</h2>
        <FaqEditor values={faqs} onChange={setFaqs} />
        <p className="text-xs text-muted-foreground">
          Use the <span className="font-medium">Nearby suburbs</span> and <span className="font-medium">Related pages</span> groups
          for this page&apos;s internal links.
        </p>
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
