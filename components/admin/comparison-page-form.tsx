"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { savePageAction } from "@/app/admin/actions";
import {
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

/** Local shape for a comparison option while editing (string lists live alongside text fields). */
interface OptionState {
  name: string;
  icon: string;
  summary: string;
  benefits: string[];
  limitations: string[];
  bestFor: string[];
}

function toOptionState(v: unknown): OptionState {
  const o = (v ?? {}) as Record<string, any>;
  return {
    name: o.name ?? "",
    icon: o.icon ?? "",
    summary: o.summary ?? "",
    benefits: arr<string>(o.benefits),
    limitations: arr<string>(o.limitations),
    bestFor: arr<string>(o.bestFor),
  };
}

/** Editor for one comparison option (name/icon/summary + three string lists). Local helper — not a fields.tsx primitive. */
function OptionEditor({
  legend,
  value,
  onChange,
}: {
  legend: string;
  value: OptionState;
  onChange: (v: OptionState) => void;
}) {
  const patch = (p: Partial<OptionState>) => onChange({ ...value, ...p });
  return (
    <fieldset className="space-y-3 rounded-lg border border-border p-3">
      <legend className="px-1 text-sm font-medium text-foreground">{legend}</legend>
      <TextField label="Name" value={value.name} onChange={(v) => patch({ name: v })} />
      <TextField label="Icon (lucide name)" value={value.icon} onChange={(v) => patch({ icon: v })} />
      <TextAreaField label="Summary" value={value.summary} onChange={(v) => patch({ summary: v })} />
      <ListField label="Benefits" values={value.benefits} onChange={(v) => patch({ benefits: v })} textarea />
      <ListField label="Limitations" values={value.limitations} onChange={(v) => patch({ limitations: v })} textarea />
      <ListField label="Best for" values={value.bestFor} onChange={(v) => patch({ bestFor: v })} />
    </fieldset>
  );
}

/** Local shape for a decision card while editing. */
interface DecisionCardState {
  heading: string;
  icon: string;
  tone: string;
  points: string[];
}

function toDecisionCardState(v: unknown): DecisionCardState {
  const c = (v ?? {}) as Record<string, any>;
  return {
    heading: c.heading ?? "",
    icon: c.icon ?? "",
    tone: c.tone ?? "uncertain",
    points: arr<string>(c.points),
  };
}

/** Editor for the decision cards (each has a tone select + a points string list). Local helper. */
function DecisionCardsEditor({
  values,
  onChange,
}: {
  values: DecisionCardState[];
  onChange: (v: DecisionCardState[]) => void;
}) {
  const update = (i: number, patch: Partial<DecisionCardState>) =>
    onChange(values.map((row, idx) => (idx === i ? { ...row, ...patch } : row)));
  const remove = (i: number) => onChange(values.filter((_, idx) => idx !== i));
  const add = () => onChange([...values, { heading: "", icon: "", tone: "uncertain", points: [] }]);

  return (
    <fieldset className="space-y-3 rounded-lg border border-border p-3">
      <legend className="px-1 text-sm font-medium text-foreground">Decision cards</legend>
      {values.map((row, i) => (
        <div key={i} className="space-y-2 rounded-md border border-border/60 bg-muted/30 p-2">
          <TextField label="Heading" value={row.heading} onChange={(v) => update(i, { heading: v })} />
          <TextField label="Icon (lucide name)" value={row.icon} onChange={(v) => update(i, { icon: v })} />
          <SelectField
            label="Tone"
            value={row.tone}
            onChange={(v) => update(i, { tone: v })}
            options={[
              { value: "optionA", label: "Option A" },
              { value: "optionB", label: "Option B" },
              { value: "uncertain", label: "Uncertain" },
            ]}
          />
          <ListField label="Points" values={row.points} onChange={(v) => update(i, { points: v })} textarea />
          <Button type="button" variant="destructive" size="sm" onClick={() => remove(i)}>
            Remove card
          </Button>
        </div>
      ))}
      <Button type="button" variant="outline" size="sm" onClick={add}>
        + Add card
      </Button>
    </fieldset>
  );
}

export function ComparisonPageForm({ initial }: { initial?: InitialPage }) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [errors, setErrors] = useState<{ code: string; description: string }[]>([]);

  const d = initial?.data ?? {};
  const hero = d.hero ?? {};
  const table = d.comparisonTable ?? {};

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
  const [tableOptionALabel, setTableOptionALabel] = useState<string>(table.optionALabel ?? "");
  const [tableOptionBLabel, setTableOptionBLabel] = useState<string>(table.optionBLabel ?? "");
  const [tableRows, setTableRows] = useState<Record<string, string>[]>(arr(table.rows));
  const [optionA, setOptionA] = useState<OptionState>(toOptionState(d.optionA));
  const [optionB, setOptionB] = useState<OptionState>(toOptionState(d.optionB));
  const [decisionCards, setDecisionCards] = useState<DecisionCardState[]>(
    arr(d.decisionCards).map(toDecisionCardState),
  );
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
      templateType: "ComparisonPage",
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
        comparisonTable: {
          optionALabel: tableOptionALabel,
          optionBLabel: tableOptionBLabel,
          rows: tableRows,
        },
        optionA,
        optionB,
        decisionCards,
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
        <TextField label="Slug" value={slug} onChange={setSlug} hint="URL path under / (e.g. roller-door-vs-sectional-door)." />
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
          hint="Short noun phrase for the breadcrumb, schema, and quote form (e.g. Roller Door vs Sectional Door)."
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
          <legend className="px-1 text-sm font-medium text-foreground">Comparison table</legend>
          <div className="grid grid-cols-2 gap-4">
            <TextField label="Option A label" value={tableOptionALabel} onChange={setTableOptionALabel} />
            <TextField label="Option B label" value={tableOptionBLabel} onChange={setTableOptionBLabel} />
          </div>
          <RepeaterField
            label="Rows"
            values={tableRows}
            onChange={setTableRows}
            fields={[
              { key: "feature", label: "Feature" },
              { key: "optionA", label: "Option A", type: "textarea" },
              { key: "optionB", label: "Option B", type: "textarea" },
            ]}
          />
        </fieldset>

        <OptionEditor legend="Option A" value={optionA} onChange={setOptionA} />
        <OptionEditor legend="Option B" value={optionB} onChange={setOptionB} />

        <DecisionCardsEditor values={decisionCards} onChange={setDecisionCards} />

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
