"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { savePageAction } from "@/app/admin/actions";
import {
  AssetUploadField,
  CheckboxField,
  FaqEditor,
  Field,
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
  pricingRows?: { pricingItemId: number; sortOrder: number; noteOverride: string | null }[];
}

function arr<T = any>(v: unknown): T[] {
  return Array.isArray(v) ? (v as T[]) : [];
}

/**
 * Local shape for a pinned cost-table (pricing) row while editing. Cost rows are relational
 * (PagePricingRows): each pins a centralized PricingItem by id (§5.4), with an optional note
 * override. The scenario/price text itself lives on the PricingItem catalog, not here.
 */
interface PricingRowState {
  pricingItemId: string;
  noteOverride: string;
}

/** Editor for the pinned cost-table rows (PricingItem references). Local helper — not a fields.tsx primitive. */
function PricingRowsEditor({
  values,
  onChange,
}: {
  values: PricingRowState[];
  onChange: (v: PricingRowState[]) => void;
}) {
  const inputClass =
    "w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus-visible:ring-3 focus-visible:ring-ring/50";
  const update = (i: number, patch: Partial<PricingRowState>) =>
    onChange(values.map((row, idx) => (idx === i ? { ...row, ...patch } : row)));
  const remove = (i: number) => onChange(values.filter((_, idx) => idx !== i));
  const add = () => onChange([...values, { pricingItemId: "", noteOverride: "" }]);

  return (
    <fieldset className="space-y-3 rounded-lg border border-border p-3">
      <legend className="px-1 text-sm font-medium text-foreground">Cost rows (pricing items)</legend>
      {values.map((row, i) => (
        <div key={i} className="space-y-2 rounded-md border border-border/60 bg-muted/30 p-2">
          <div className="grid grid-cols-2 gap-2">
            <Field label="Pricing item ID" hint="FK to the centralized pricing catalog (§5.4)">
              <input
                className={inputClass}
                type="number"
                value={row.pricingItemId}
                onChange={(e) => update(i, { pricingItemId: e.target.value })}
              />
            </Field>
            <Field label="Note override" hint="Optional per-page note">
              <input className={inputClass} value={row.noteOverride} onChange={(e) => update(i, { noteOverride: e.target.value })} />
            </Field>
          </div>
          <Button type="button" variant="destructive" size="sm" onClick={() => remove(i)}>
            Remove row
          </Button>
        </div>
      ))}
      <Button type="button" variant="outline" size="sm" onClick={add}>
        + Add row
      </Button>
    </fieldset>
  );
}

export function ProblemPageForm({ initial }: { initial?: InitialPage }) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [errors, setErrors] = useState<{ code: string; description: string }[]>([]);

  const d = initial?.data ?? {};
  const emergency = d.emergency ?? {};

  // Page meta. Title -> Pages.Title (the Problem h1/name); SEO title/description -> metaTitle/metaDescription.
  const [slug, setSlug] = useState(initial?.slug ?? "");
  const [title, setTitle] = useState(initial?.title ?? "");
  const [seoTitle, setSeoTitle] = useState(initial?.seoTitle ?? "");
  const [seoDescription, setSeoDescription] = useState(initial?.seoDescription ?? "");
  const [noIndex, setNoIndex] = useState(initial?.noIndex ?? false);
  const [status, setStatus] = useState(initial?.status ?? "Draft");
  const [heroImageAssetId, setHeroImageAssetId] = useState<number | null>(initial?.heroImageAssetId ?? null);
  const [heroPreview, setHeroPreview] = useState<string | null>(null);

  // Body (Data)
  const [heroSubtitle, setHeroSubtitle] = useState<string>(d.heroSubtitle ?? "");
  const [directAnswer, setDirectAnswer] = useState<string>(d.directAnswer ?? "");
  const [causes, setCauses] = useState<Record<string, string>[]>(arr(d.causes));
  const [safeChecks, setSafeChecks] = useState<string[]>(arr<string>(d.safeChecks));
  const [doNotDo, setDoNotDo] = useState<string[]>(arr<string>(d.doNotDo));
  const [callTechnicianSigns, setCallTechnicianSigns] = useState<string[]>(arr<string>(d.callTechnicianSigns));
  const [emergencyHeading, setEmergencyHeading] = useState<string>(emergency.heading ?? "");
  const [emergencyBody, setEmergencyBody] = useState<string>(emergency.body ?? "");

  // Relational pins, hydrated from the detail DTO so they round-trip on edit (UpdatePage replaces
  // all children, so the form must send the complete set back).
  const [pricingRows, setPricingRows] = useState<PricingRowState[]>(
    arr<{ pricingItemId: number; noteOverride: string | null }>(initial?.pricingRows).map((r) => ({
      pricingItemId: String(r.pricingItemId),
      noteOverride: r.noteOverride ?? "",
    })),
  );
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
      templateType: "ProblemPage",
      routeGroup: "Problems",
      slug,
      title,
      seoTitle,
      seoDescription,
      noIndex,
      status,
      heroImageAssetId,
      data: {
        heroSubtitle,
        directAnswer,
        causes,
        safeChecks,
        doNotDo,
        callTechnicianSigns,
        emergency: { heading: emergencyHeading, body: emergencyBody },
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
      pricingRows: pricingRows
        .filter((r) => Number(r.pricingItemId) > 0)
        .map((r, i) => ({
          pricingItemId: Number(r.pricingItemId),
          sortOrder: i,
          noteOverride: r.noteOverride || null,
        })),
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
        <TextField label="Title" value={title} onChange={setTitle} hint="The problem H1 / name (e.g. Garage Door Won't Open?)." />
        <TextField label="Slug" value={slug} onChange={setSlug} hint="URL path under /problems (e.g. garage-door-wont-open)." />
        <TextField label="SEO title" value={seoTitle} onChange={setSeoTitle} hint="The <title> tag (metaTitle)." />
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
        <TextAreaField label="Hero subtitle" value={heroSubtitle} onChange={setHeroSubtitle} />
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
        <RepeaterField
          label="Causes"
          values={causes}
          onChange={setCauses}
          fields={[
            { key: "icon", label: "Icon (lucide name)" },
            { key: "title", label: "Title" },
            { key: "description", label: "Description", type: "textarea" },
          ]}
        />
        <ListField label="Safe checks (what's OK to check yourself)" values={safeChecks} onChange={setSafeChecks} textarea />
        <ListField label="Do not do" values={doNotDo} onChange={setDoNotDo} textarea />
        <ListField label="Call-a-technician signs" values={callTechnicianSigns} onChange={setCallTechnicianSigns} textarea />

        <fieldset className="space-y-3 rounded-lg border border-border p-3">
          <legend className="px-1 text-sm font-medium text-foreground">Emergency block</legend>
          <TextField label="Heading" value={emergencyHeading} onChange={setEmergencyHeading} />
          <TextAreaField label="Body" value={emergencyBody} onChange={setEmergencyBody} />
        </fieldset>

        <PricingRowsEditor values={pricingRows} onChange={setPricingRows} />
      </section>

      <section className="space-y-4">
        <h2 className="text-lg font-semibold">FAQs &amp; service pins</h2>
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
