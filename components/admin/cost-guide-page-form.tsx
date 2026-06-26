"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { savePageAction } from "@/app/admin/actions";
import {
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
 * Local shape for a pinned pricing row while editing. The cost-table rows are relational
 * (PagePricingRows): each pins a centralized PricingItem by id (§5.4), with an optional note
 * override. The scenario/price/includes text itself lives on the PricingItem catalog, not here.
 */
interface PricingRowState {
  pricingItemId: string;
  noteOverride: string;
}

/** Editor for the pinned pricing rows (PricingItem references). Local helper — not a fields.tsx primitive. */
function PricingRowsEditor({
  values,
  onChange,
}: {
  values: PricingRowState[];
  onChange: (v: PricingRowState[]) => void;
}) {
  const update = (i: number, patch: Partial<PricingRowState>) =>
    onChange(values.map((row, idx) => (idx === i ? { ...row, ...patch } : row)));
  const remove = (i: number) => onChange(values.filter((_, idx) => idx !== i));
  const add = () => onChange([...values, { pricingItemId: "", noteOverride: "" }]);

  return (
    <fieldset className="space-y-3 rounded-lg border border-border p-3">
      <legend className="px-1 text-sm font-medium text-foreground">Cost table rows (pricing items)</legend>
      {values.map((row, i) => (
        <div key={i} className="space-y-2 rounded-md border border-border/60 bg-muted/30 p-2">
          <div className="grid grid-cols-2 gap-2">
            <Field label="Pricing item ID" hint="FK to the centralized pricing catalog (§5.4)">
              <input
                className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
                type="number"
                value={row.pricingItemId}
                onChange={(e) => update(i, { pricingItemId: e.target.value })}
              />
            </Field>
            <Field label="Note override" hint="Optional per-page note">
              <input
                className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
                value={row.noteOverride}
                onChange={(e) => update(i, { noteOverride: e.target.value })}
              />
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

export function CostGuidePageForm({ initial }: { initial?: InitialPage }) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [errors, setErrors] = useState<{ code: string; description: string }[]>([]);

  const d = initial?.data ?? {};
  const hero = d.hero ?? {};
  const costTable = d.costTable ?? {};
  const factors = d.factors ?? {};
  const scenarios = d.scenarios ?? {};
  const repairVsReplace = d.repairVsReplace ?? {};
  const howToQuote = d.howToQuote ?? {};

  // Page meta
  const [slug, setSlug] = useState(initial?.slug ?? "");
  const [title, setTitle] = useState(initial?.title ?? "");
  const [seoTitle, setSeoTitle] = useState(initial?.seoTitle ?? "");
  const [seoDescription, setSeoDescription] = useState(initial?.seoDescription ?? "");
  const [noIndex, setNoIndex] = useState(initial?.noIndex ?? false);
  const [status, setStatus] = useState(initial?.status ?? "Draft");

  // Hero / topic (Data)
  const [topicLabel, setTopicLabel] = useState<string>(d.topicLabel ?? "");
  const [heroH1, setHeroH1] = useState<string>(hero.h1 ?? "");
  const [heroSubtitle, setHeroSubtitle] = useState<string>(hero.subtitle ?? "");

  // Body (Data)
  const [directAnswer, setDirectAnswer] = useState<string>(d.directAnswer ?? "");
  const [costTableHeading, setCostTableHeading] = useState<string>(costTable.heading ?? "");
  const [costTableIntro, setCostTableIntro] = useState<string>(costTable.intro ?? "");
  const [costTableDisclaimer, setCostTableDisclaimer] = useState<string>(costTable.disclaimer ?? "");
  const [factorsHeading, setFactorsHeading] = useState<string>(factors.heading ?? "");
  const [factorsItems, setFactorsItems] = useState<Record<string, string>[]>(arr(factors.items));
  const [scenariosHeading, setScenariosHeading] = useState<string>(scenarios.heading ?? "");
  const [scenariosItems, setScenariosItems] = useState<Record<string, string>[]>(arr(scenarios.items));
  const [repairHeading, setRepairHeading] = useState<string>(repairVsReplace.heading ?? "");
  const [repairIntro, setRepairIntro] = useState<string>(repairVsReplace.intro ?? "");
  const [repairWhen, setRepairWhen] = useState<string[]>(arr<string>(repairVsReplace.repairWhen));
  const [replaceWhen, setReplaceWhen] = useState<string[]>(arr<string>(repairVsReplace.replaceWhen));
  const [howToQuoteHeading, setHowToQuoteHeading] = useState<string>(howToQuote.heading ?? "");
  const [howToQuoteSteps, setHowToQuoteSteps] = useState<Record<string, string>[]>(arr(howToQuote.steps));
  const [ctaHeading, setCtaHeading] = useState<string>(d.cta?.heading ?? "");
  const [ctaSubtitle, setCtaSubtitle] = useState<string>(d.cta?.subtitle ?? "");

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
      templateType: "CostGuidePage",
      routeGroup: "Flat",
      slug,
      title,
      seoTitle,
      seoDescription,
      noIndex,
      status,
      heroImageAssetId: initial?.heroImageAssetId ?? null,
      data: {
        topicLabel,
        hero: { h1: heroH1, subtitle: heroSubtitle },
        directAnswer,
        costTable: {
          heading: costTableHeading,
          intro: costTableIntro,
          disclaimer: costTableDisclaimer,
        },
        factors: { heading: factorsHeading, items: factorsItems },
        scenarios: { heading: scenariosHeading, items: scenariosItems },
        repairVsReplace: {
          heading: repairHeading,
          intro: repairIntro,
          repairWhen,
          replaceWhen,
        },
        howToQuote: { heading: howToQuoteHeading, steps: howToQuoteSteps },
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
        <TextField label="Title" value={title} onChange={setTitle} hint="Used as the H1 fallback and breadcrumb label." />
        <TextField label="Slug" value={slug} onChange={setSlug} hint="URL path under / (e.g. garage-door-repair-cost-perth)." />
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
        <TextField
          label="Topic label"
          value={topicLabel}
          onChange={setTopicLabel}
          hint="Short noun phrase for the breadcrumb and quote form (e.g. Garage Door Repair)."
        />
        <TextField label="Hero H1" value={heroH1} onChange={setHeroH1} />
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

        <fieldset className="space-y-3 rounded-lg border border-border p-3">
          <legend className="px-1 text-sm font-medium text-foreground">Cost table</legend>
          <TextField label="Heading" value={costTableHeading} onChange={setCostTableHeading} />
          <TextAreaField label="Intro" value={costTableIntro} onChange={setCostTableIntro} />
          <TextAreaField label="Disclaimer" value={costTableDisclaimer} onChange={setCostTableDisclaimer} />
        </fieldset>

        <PricingRowsEditor values={pricingRows} onChange={setPricingRows} />

        <fieldset className="space-y-3 rounded-lg border border-border p-3">
          <legend className="px-1 text-sm font-medium text-foreground">Factors that affect cost</legend>
          <TextField label="Heading" value={factorsHeading} onChange={setFactorsHeading} />
          <RepeaterField
            label="Items"
            values={factorsItems}
            onChange={setFactorsItems}
            fields={[
              { key: "icon", label: "Icon (lucide name)" },
              { key: "title", label: "Title" },
              { key: "description", label: "Description", type: "textarea" },
            ]}
          />
        </fieldset>

        <fieldset className="space-y-3 rounded-lg border border-border p-3">
          <legend className="px-1 text-sm font-medium text-foreground">Scenarios</legend>
          <TextField label="Heading" value={scenariosHeading} onChange={setScenariosHeading} />
          <RepeaterField
            label="Items"
            values={scenariosItems}
            onChange={setScenariosItems}
            fields={[
              { key: "icon", label: "Icon (lucide name)" },
              { key: "title", label: "Title" },
              { key: "mayAffectQuote", label: "May affect quote", type: "textarea" },
            ]}
          />
        </fieldset>

        <fieldset className="space-y-3 rounded-lg border border-border p-3">
          <legend className="px-1 text-sm font-medium text-foreground">Repair vs replace</legend>
          <TextField label="Heading" value={repairHeading} onChange={setRepairHeading} />
          <TextAreaField label="Intro" value={repairIntro} onChange={setRepairIntro} />
          <ListField label="Repair when" values={repairWhen} onChange={setRepairWhen} textarea />
          <ListField label="Replace when" values={replaceWhen} onChange={setReplaceWhen} textarea />
        </fieldset>

        <fieldset className="space-y-3 rounded-lg border border-border p-3">
          <legend className="px-1 text-sm font-medium text-foreground">How to get a quote</legend>
          <TextField label="Heading" value={howToQuoteHeading} onChange={setHowToQuoteHeading} />
          <RepeaterField
            label="Steps"
            values={howToQuoteSteps}
            onChange={setHowToQuoteSteps}
            fields={[
              { key: "icon", label: "Icon (lucide name)" },
              { key: "title", label: "Title" },
              { key: "description", label: "Description", type: "textarea" },
            ]}
          />
        </fieldset>

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
