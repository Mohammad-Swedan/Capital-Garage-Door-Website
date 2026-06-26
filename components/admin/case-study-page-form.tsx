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

interface ImageDraft {
  assetId: number | null;
  caption: string;
}

/**
 * Local helper (not in fields.tsx): images repeater. Each row is an asset id (numeric) + caption —
 * RepeaterField only handles plain string fields, so the numeric assetId needs its own editor.
 */
function ImagesEditor({ values, onChange }: { values: ImageDraft[]; onChange: (v: ImageDraft[]) => void }) {
  const patch = (i: number, p: Partial<ImageDraft>) => onChange(values.map((row, idx) => (idx === i ? { ...row, ...p } : row)));
  const remove = (i: number) => onChange(values.filter((_, idx) => idx !== i));
  const add = () => onChange([...values, { assetId: null, caption: "" }]);

  return (
    <fieldset className="space-y-3 rounded-lg border border-border p-3">
      <legend className="px-1 text-sm font-medium text-foreground">Images</legend>
      {values.map((row, i) => (
        <div key={i} className="space-y-2 rounded-md border border-border/60 bg-muted/30 p-2">
          <TextField
            label="Asset ID"
            value={row.assetId != null ? String(row.assetId) : ""}
            onChange={(v) => patch(i, { assetId: v ? Number(v) : null })}
            hint="ID of an uploaded media asset."
          />
          <TextField label="Caption" value={row.caption} onChange={(v) => patch(i, { caption: v })} />
          <Button type="button" variant="destructive" size="sm" onClick={() => remove(i)}>
            Remove image
          </Button>
        </div>
      ))}
      <Button type="button" variant="outline" size="sm" onClick={add}>
        + Add image
      </Button>
    </fieldset>
  );
}

export function CaseStudyPageForm({ initial }: { initial?: InitialPage }) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [errors, setErrors] = useState<{ code: string; description: string }[]>([]);

  const d = initial?.data ?? {};
  const summary = d.summary ?? {};

  // Page meta
  const [slug, setSlug] = useState(initial?.slug ?? "");
  const [title, setTitle] = useState(initial?.title ?? "");
  const [seoTitle, setSeoTitle] = useState(initial?.seoTitle ?? "");
  const [seoDescription, setSeoDescription] = useState(initial?.seoDescription ?? "");
  const [noIndex, setNoIndex] = useState(initial?.noIndex ?? false);
  const [status, setStatus] = useState(initial?.status ?? "Draft");
  const [heroImageAssetId, setHeroImageAssetId] = useState<number | null>(initial?.heroImageAssetId ?? null);
  const [heroPreview, setHeroPreview] = useState<string | null>(null);

  // Job meta (Data)
  const [dataTitle, setDataTitle] = useState<string>(d.title ?? "");
  const [subtitle, setSubtitle] = useState<string>(d.subtitle ?? "");
  const [service, setService] = useState<string>(d.service ?? "");
  const [suburb, setSuburb] = useState<string>(d.suburb ?? "");
  const [doorType, setDoorType] = useState<string>(d.doorType ?? "");
  const [jobType, setJobType] = useState<string>(d.jobType ?? "");
  const [result, setResult] = useState<string>(d.result ?? "");

  // Summary (Data)
  const [summaryProblem, setSummaryProblem] = useState<string>(summary.problem ?? "");
  const [summaryDiagnosis, setSummaryDiagnosis] = useState<string>(summary.diagnosis ?? "");
  const [summarySolution, setSummarySolution] = useState<string>(summary.solution ?? "");

  // Detail blocks (Data)
  const [problemIntro, setProblemIntro] = useState<string>(d.problem?.intro ?? "");
  const [problemPoints, setProblemPoints] = useState<string[]>(arr<string>(d.problem?.points));
  const [diagnosisIntro, setDiagnosisIntro] = useState<string>(d.diagnosis?.intro ?? "");
  const [diagnosisPoints, setDiagnosisPoints] = useState<string[]>(arr<string>(d.diagnosis?.points));
  const [solutionIntro, setSolutionIntro] = useState<string>(d.solution?.intro ?? "");
  const [solutionPoints, setSolutionPoints] = useState<string[]>(arr<string>(d.solution?.points));

  // Images + parts (Data)
  const [images, setImages] = useState<ImageDraft[]>(
    arr<any>(d.images).map((img) => ({
      assetId: typeof img.assetId === "number" ? img.assetId : null,
      caption: typeof img.caption === "string" ? img.caption : "",
    })),
  );
  const [partsUsed, setPartsUsed] = useState<string[]>(arr<string>(d.partsUsed));

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
      templateType: "CaseStudyPage",
      routeGroup: "CaseStudies",
      slug,
      title,
      seoTitle,
      seoDescription,
      noIndex,
      status,
      heroImageAssetId,
      data: {
        title: dataTitle,
        subtitle,
        service,
        suburb,
        doorType,
        jobType,
        result,
        summary: { problem: summaryProblem, diagnosis: summaryDiagnosis, solution: summarySolution },
        problem: { intro: problemIntro, points: problemPoints },
        diagnosis: { intro: diagnosisIntro, points: diagnosisPoints },
        solution: { intro: solutionIntro, points: solutionPoints },
        images: images.map((img) => ({ assetId: img.assetId ?? 0, caption: img.caption })),
        partsUsed,
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
        <TextField label="Title" value={title} onChange={setTitle} hint="Used as the breadcrumb label and H1 fallback." />
        <TextField label="Slug" value={slug} onChange={setSlug} hint="URL path under /case-studies/ (e.g. roller-door-repair-canning-vale)." />
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
        <h2 className="text-lg font-semibold">Hero image</h2>
        <AssetUploadField
          label="Hero image"
          assetId={heroImageAssetId}
          previewUrl={heroPreview}
          onUploaded={(id, url) => {
            setHeroImageAssetId(id);
            setHeroPreview(url);
          }}
        />
      </section>

      <section className="space-y-4">
        <h2 className="text-lg font-semibold">Job details</h2>
        <TextField label="Heading (title)" value={dataTitle} onChange={setDataTitle} />
        <TextAreaField label="Subtitle" value={subtitle} onChange={setSubtitle} />
        <div className="grid grid-cols-2 gap-4">
          <TextField label="Service" value={service} onChange={setService} hint="e.g. Motor Replacement." />
          <TextField label="Suburb" value={suburb} onChange={setSuburb} />
          <TextField label="Door type" value={doorType} onChange={setDoorType} hint="e.g. Sectional Door." />
          <TextField label="Job type" value={jobType} onChange={setJobType} hint="e.g. Residential." />
        </div>
        <TextField label="Result" value={result} onChange={setResult} hint="Headline outcome, e.g. Smooth automatic operation restored." />
      </section>

      <section className="space-y-4">
        <h2 className="text-lg font-semibold">Summary</h2>
        <TextAreaField label="Problem" value={summaryProblem} onChange={setSummaryProblem} />
        <TextAreaField label="Diagnosis" value={summaryDiagnosis} onChange={setSummaryDiagnosis} />
        <TextAreaField label="Solution" value={summarySolution} onChange={setSummarySolution} />
      </section>

      <section className="space-y-4">
        <h2 className="text-lg font-semibold">Problem</h2>
        <TextAreaField label="Intro" value={problemIntro} onChange={setProblemIntro} />
        <ListField label="Points" values={problemPoints} onChange={setProblemPoints} />
      </section>

      <section className="space-y-4">
        <h2 className="text-lg font-semibold">Diagnosis</h2>
        <TextAreaField label="Intro" value={diagnosisIntro} onChange={setDiagnosisIntro} />
        <ListField label="Points" values={diagnosisPoints} onChange={setDiagnosisPoints} />
      </section>

      <section className="space-y-4">
        <h2 className="text-lg font-semibold">Solution</h2>
        <TextAreaField label="Intro" value={solutionIntro} onChange={setSolutionIntro} />
        <ListField label="Points" values={solutionPoints} onChange={setSolutionPoints} />
      </section>

      <section className="space-y-4">
        <h2 className="text-lg font-semibold">Images &amp; parts</h2>
        <ImagesEditor values={images} onChange={setImages} />
        <ListField label="Parts used" values={partsUsed} onChange={setPartsUsed} placeholder="e.g. Motor replacement" />
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
