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
  RepeaterField,
  SelectField,
  TextAreaField,
  TextField,
  type FaqItem,
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
  reviews?: { reviewId: number; sortOrder: number }[];
}

function arr<T = any>(v: unknown): T[] {
  return Array.isArray(v) ? (v as T[]) : [];
}

const inputClass =
  "w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus-visible:ring-3 focus-visible:ring-ring/50";

/**
 * Local shape for a pinned review while editing. Reviews are relational (PageReviews): each pins a
 * centralized Review by id (§5/§7), with a sort order. The review text/author itself lives on the
 * Reviews catalog, not here.
 */
interface ReviewPinState {
  reviewId: string;
}

/** Editor for the pinned reviews (Review references). Local helper — not a fields.tsx primitive. */
function ReviewsEditor({ values, onChange }: { values: ReviewPinState[]; onChange: (v: ReviewPinState[]) => void }) {
  const update = (i: number, patch: Partial<ReviewPinState>) =>
    onChange(values.map((row, idx) => (idx === i ? { ...row, ...patch } : row)));
  const remove = (i: number) => onChange(values.filter((_, idx) => idx !== i));
  const add = () => onChange([...values, { reviewId: "" }]);

  return (
    <fieldset className="space-y-3 rounded-lg border border-border p-3">
      <legend className="px-1 text-sm font-medium text-foreground">Reviews (pinned by id)</legend>
      {values.map((row, i) => (
        <div key={i} className="space-y-2 rounded-md border border-border/60 bg-muted/30 p-2">
          <Field label="Review ID" hint="FK to the centralized reviews catalog">
            <input
              className={inputClass}
              type="number"
              value={row.reviewId}
              onChange={(e) => update(i, { reviewId: e.target.value })}
            />
          </Field>
          <Button type="button" variant="destructive" size="sm" onClick={() => remove(i)}>
            Remove review
          </Button>
        </div>
      ))}
      <Button type="button" variant="outline" size="sm" onClick={add}>
        + Add review
      </Button>
    </fieldset>
  );
}

export function LandingPageForm({ initial }: { initial?: InitialPage }) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [errors, setErrors] = useState<{ code: string; description: string }[]>([]);

  const d = initial?.data ?? {};
  const hero = d.hero ?? {};
  const form = d.form ?? {};
  const problems = d.problems ?? {};
  const whyChoose = d.whyChoose ?? {};
  const serviceAreas = d.serviceAreas ?? {};
  const finalCta = d.finalCta ?? {};

  // Page meta. LandingPages are paid-traffic only, so no-index defaults true.
  const [slug, setSlug] = useState(initial?.slug ?? "");
  const [title, setTitle] = useState(initial?.title ?? "");
  const [seoTitle, setSeoTitle] = useState(initial?.seoTitle ?? "");
  const [seoDescription, setSeoDescription] = useState(initial?.seoDescription ?? "");
  const [noIndex, setNoIndex] = useState(initial?.noIndex ?? true);
  const [status, setStatus] = useState(initial?.status ?? "Draft");

  // Top-level (Data)
  const [pageType, setPageType] = useState<string>(d.pageType ?? "");
  const [serviceLabel, setServiceLabel] = useState<string>(d.serviceLabel ?? "");

  // Hero (Data)
  const [heroEyebrow, setHeroEyebrow] = useState<string>(hero.eyebrow ?? "");
  const [heroH1, setHeroH1] = useState<string>(hero.h1 ?? "");
  const [heroSubtitle, setHeroSubtitle] = useState<string>(hero.subtitle ?? "");
  const [badges, setBadges] = useState<Record<string, string>[]>(arr(hero.badges));

  // Body (Data)
  const [directAnswer, setDirectAnswer] = useState<string>(d.directAnswer ?? "");
  const [formHeading, setFormHeading] = useState<string>(form.heading ?? "");
  const [formSubheading, setFormSubheading] = useState<string>(form.subheading ?? "");
  const [problemsEyebrow, setProblemsEyebrow] = useState<string>(problems.eyebrow ?? "");
  const [problemsHeading, setProblemsHeading] = useState<string>(problems.heading ?? "");
  const [problemsDescription, setProblemsDescription] = useState<string>(problems.description ?? "");
  const [problemsItems, setProblemsItems] = useState<Record<string, string>[]>(arr(problems.items));
  const [whyChooseEyebrow, setWhyChooseEyebrow] = useState<string>(whyChoose.eyebrow ?? "");
  const [whyChooseHeading, setWhyChooseHeading] = useState<string>(whyChoose.heading ?? "");
  const [whyChooseDescription, setWhyChooseDescription] = useState<string>(whyChoose.description ?? "");
  const [whyChooseItems, setWhyChooseItems] = useState<Record<string, string>[]>(arr(whyChoose.items));
  const [serviceAreasHeading, setServiceAreasHeading] = useState<string>(serviceAreas.heading ?? "");
  const [serviceAreasDescription, setServiceAreasDescription] = useState<string>(serviceAreas.description ?? "");
  const [suburbs, setSuburbs] = useState<string[]>(arr<string>(serviceAreas.suburbs));
  const [reviewsHeading, setReviewsHeading] = useState<string>(d.reviewsHeading ?? "");
  const [finalCtaHeading, setFinalCtaHeading] = useState<string>(finalCta.heading ?? "");
  const [finalCtaBody, setFinalCtaBody] = useState<string>(finalCta.body ?? "");

  // Relational pins, hydrated from the detail DTO so they round-trip on edit (UpdatePage replaces
  // all children, so the form must send the complete set back).
  const [reviews, setReviews] = useState<ReviewPinState[]>(
    arr<{ reviewId: number; sortOrder: number }>(initial?.reviews).map((r) => ({
      reviewId: String(r.reviewId),
    })),
  );
  const [faqs, setFaqs] = useState<FaqItem[]>(arr<FaqItem>(initial?.faqs));

  function buildPayload() {
    return {
      ...(initial ? { id: initial.id } : {}),
      templateType: "LandingPage",
      routeGroup: "Lp",
      slug,
      title,
      seoTitle,
      seoDescription,
      noIndex,
      status,
      heroImageAssetId: initial?.heroImageAssetId ?? null,
      data: {
        pageType,
        serviceLabel,
        hero: { eyebrow: heroEyebrow, h1: heroH1, subtitle: heroSubtitle, badges },
        directAnswer,
        form: { heading: formHeading, subheading: formSubheading },
        problems: {
          eyebrow: problemsEyebrow,
          heading: problemsHeading,
          description: problemsDescription,
          items: problemsItems,
        },
        whyChoose: {
          eyebrow: whyChooseEyebrow,
          heading: whyChooseHeading,
          description: whyChooseDescription,
          items: whyChooseItems,
        },
        serviceAreas: { heading: serviceAreasHeading, description: serviceAreasDescription, suburbs },
        reviewsHeading,
        finalCta: { heading: finalCtaHeading, body: finalCtaBody },
      },
      faqs: faqs.map((f, i) => ({ question: f.question, answer: f.answer, sortOrder: i })),
      relatedLinks: [],
      pricingRows: [],
      reviews: reviews
        .filter((r) => Number(r.reviewId) > 0)
        .map((r, i) => ({ reviewId: Number(r.reviewId), sortOrder: i })),
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
        <TextField label="Slug" value={slug} onChange={setSlug} hint="URL path under /lp (e.g. emergency-garage-door-repair)." />
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
            <CheckboxField label="No-index" checked={noIndex} onChange={setNoIndex} hint="Paid traffic only — defaults on" />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <TextField label="Page type" value={pageType} onChange={setPageType} hint="Tracking value, e.g. LandingPage:Emergency." />
          <TextField label="Service label" value={serviceLabel} onChange={setServiceLabel} hint="Prefilled form service + Service JSON-LD name." />
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="text-lg font-semibold">Hero</h2>
        <TextField label="Eyebrow" value={heroEyebrow} onChange={setHeroEyebrow} />
        <TextField label="Hero H1" value={heroH1} onChange={setHeroH1} />
        <TextAreaField label="Hero subtitle" value={heroSubtitle} onChange={setHeroSubtitle} />
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

        <fieldset className="space-y-3 rounded-lg border border-border p-3">
          <legend className="px-1 text-sm font-medium text-foreground">Lead form</legend>
          <TextField label="Heading" value={formHeading} onChange={setFormHeading} />
          <TextField label="Subheading" value={formSubheading} onChange={setFormSubheading} />
        </fieldset>

        <fieldset className="space-y-3 rounded-lg border border-border p-3">
          <legend className="px-1 text-sm font-medium text-foreground">Problems</legend>
          <TextField label="Eyebrow" value={problemsEyebrow} onChange={setProblemsEyebrow} />
          <TextField label="Heading" value={problemsHeading} onChange={setProblemsHeading} />
          <TextAreaField label="Description" value={problemsDescription} onChange={setProblemsDescription} />
          <RepeaterField
            label="Items"
            values={problemsItems}
            onChange={setProblemsItems}
            fields={[
              { key: "icon", label: "Icon (lucide name)" },
              { key: "title", label: "Title" },
              { key: "description", label: "Description", type: "textarea" },
            ]}
          />
        </fieldset>

        <fieldset className="space-y-3 rounded-lg border border-border p-3">
          <legend className="px-1 text-sm font-medium text-foreground">Why choose us</legend>
          <TextField label="Eyebrow" value={whyChooseEyebrow} onChange={setWhyChooseEyebrow} />
          <TextField label="Heading" value={whyChooseHeading} onChange={setWhyChooseHeading} />
          <TextAreaField label="Description" value={whyChooseDescription} onChange={setWhyChooseDescription} />
          <RepeaterField
            label="Items"
            values={whyChooseItems}
            onChange={setWhyChooseItems}
            fields={[
              { key: "icon", label: "Icon (lucide name)" },
              { key: "title", label: "Title" },
              { key: "description", label: "Description", type: "textarea" },
            ]}
          />
        </fieldset>

        <fieldset className="space-y-3 rounded-lg border border-border p-3">
          <legend className="px-1 text-sm font-medium text-foreground">Service areas</legend>
          <TextField label="Heading" value={serviceAreasHeading} onChange={setServiceAreasHeading} />
          <TextAreaField label="Description" value={serviceAreasDescription} onChange={setServiceAreasDescription} />
          <ListField label="Suburbs" values={suburbs} onChange={setSuburbs} placeholder="Suburb name" />
        </fieldset>

        <div className="grid grid-cols-1 gap-4">
          <TextField label="Final CTA heading" value={finalCtaHeading} onChange={setFinalCtaHeading} />
          <TextField label="Final CTA body" value={finalCtaBody} onChange={setFinalCtaBody} />
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="text-lg font-semibold">Reviews &amp; FAQs</h2>
        <TextField label="Reviews heading" value={reviewsHeading} onChange={setReviewsHeading} />
        <ReviewsEditor values={reviews} onChange={setReviews} />
        <FaqEditor values={faqs} onChange={setFaqs} />
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
