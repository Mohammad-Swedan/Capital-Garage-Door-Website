"use client";

import { useCallback, useEffect, useMemo, useRef, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { savePageAction } from "@/app/admin/actions";
import type { InitialPage } from "@/components/admin/page-form-types";
import type { RelatedLinkItem } from "@/components/admin/fields";
import { EditableProvider, useEditableDraft } from "./editable-context";
import { AssetPickerHost, useAssetPicker } from "./asset-picker";
import { EditorToolbar } from "./editor-toolbar";
import { SettingsDrawer, type PageMeta } from "./settings-drawer";
import type { ReviewPin, PricingPin, ServicePin } from "./pins-editor";
import { editorRegistry } from "./registry";
import "./editor.css";

/**
 * `<PageEditor>` — the type-agnostic in-place visual editor host. It renders the REAL template for
 * `templateType` (from the registry) as an editable canvas, wires the toolbar / settings drawer /
 * asset picker, and saves via the unchanged `savePageAction` using the registry's per-type
 * serializer. "Advanced view" swaps in that type's classic field form as a fallback.
 */
export interface PageEditorProps {
  templateType: string;
  initialDraft: unknown;
  initial?: InitialPage;
}

function initialMeta(page?: InitialPage): PageMeta {
  return {
    slug: page?.slug ?? "",
    title: page?.title ?? "",
    seoTitle: page?.seoTitle ?? "",
    seoDescription: page?.seoDescription ?? "",
    noIndex: page?.noIndex ?? false,
    status: page?.status ?? "Draft",
  };
}

function initialRelatedLinks(page?: InitialPage): RelatedLinkItem[] {
  return (page?.relatedLinks ?? []).map((l) => ({
    targetPageId: l.targetPageId ?? null,
    staticHref: l.staticHref ?? "",
    labelOverride: l.labelOverride ?? "",
    linkGroup: l.linkGroup ?? "RelatedServices",
  }));
}

/** Light, generic in-place validation: only the hero H1 if the draft has one. */
function computeErrors(draft: unknown): Record<string, string> {
  const d = draft as { hero?: { h1?: string } };
  const errors: Record<string, string> = {};
  if (d?.hero && typeof d.hero.h1 === "string" && !d.hero.h1.trim()) {
    errors["hero.h1"] = "The H1 is required.";
  }
  return errors;
}

export function PageEditor({ templateType, initialDraft, initial }: PageEditorProps) {
  const { controller, hostProps } = useAssetPicker();
  const [editing, setEditing] = useState(true);

  return (
    <EditableProvider
      editing={editing}
      initialDraft={initialDraft}
      computeErrors={computeErrors}
      requestAsset={controller.open}
    >
      <EditorChrome templateType={templateType} initial={initial} editing={editing} setEditing={setEditing} />
      <AssetPickerHost {...hostProps} />
    </EditableProvider>
  );
}

function EditorChrome({
  templateType,
  initial,
  editing,
  setEditing,
}: {
  templateType: string;
  initial?: InitialPage;
  editing: boolean;
  setEditing: (fn: (v: boolean) => boolean) => void;
}) {
  const router = useRouter();
  const draft = useEditableDraft<Record<string, any>>();
  const [pending, startTransition] = useTransition();

  const [advanced, setAdvanced] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [device, setDevice] = useState<"desktop" | "mobile">("desktop");

  const [meta, setMeta] = useState<PageMeta>(() => initialMeta(initial));
  const [relatedLinks, setRelatedLinks] = useState<RelatedLinkItem[]>(() => initialRelatedLinks(initial));
  const [heroAssetId] = useState<number | null>(initial?.heroImageAssetId ?? null);
  const [pricingRows, setPricingRows] = useState<PricingPin[]>(() => initial?.pricingRows ?? []);
  const [reviews, setReviews] = useState<ReviewPin[]>(() => initial?.reviews ?? []);
  const [services, setServices] = useState<ServicePin[]>(() => initial?.services ?? []);
  const [serverErrors, setServerErrors] = useState<{ code: string; description: string }[]>([]);

  const entry = editorRegistry[templateType];

  const seedSnapshot = useRef(
    JSON.stringify({
      draft,
      meta: initialMeta(initial),
      relatedLinks: initialRelatedLinks(initial),
      pins: {
        pricingRows: initial?.pricingRows ?? [],
        reviews: initial?.reviews ?? [],
        services: initial?.services ?? [],
      },
    }),
  );
  const dirty =
    JSON.stringify({ draft, meta, relatedLinks, pins: { pricingRows, reviews, services } }) !== seedSnapshot.current;

  // Dirty-nav guard: warn before a full unload (close/refresh/external link) with unsaved edits.
  useEffect(() => {
    if (!dirty) return;
    const handler = (e: BeforeUnloadEvent) => {
      e.preventDefault();
      e.returnValue = "";
    };
    window.addEventListener("beforeunload", handler);
    return () => window.removeEventListener("beforeunload", handler);
  }, [dirty]);

  // selectAsset writes `hero.imageAssetId` into the draft; prefer it over the loaded value.
  const effectiveHeroAssetId = useMemo(() => {
    const fromDraft = (draft?.hero as { imageAssetId?: number } | undefined)?.imageAssetId;
    return typeof fromDraft === "number" ? fromDraft : heroAssetId;
  }, [draft, heroAssetId]);

  const updateMeta = useCallback((patch: Partial<PageMeta>) => setMeta((m) => ({ ...m, ...patch })), []);

  const issues = useMemo(() => {
    const list: { path: string; label: string; message: string }[] = [];
    const heroH1 = (draft?.hero as { h1?: string } | undefined)?.h1;
    if (typeof heroH1 === "string" && !heroH1.trim()) {
      list.push({ path: "hero.h1", label: "Hero heading", message: "The H1 is required." });
    }
    if (!meta.title.trim()) list.push({ path: "__title", label: "Title", message: "A page title is required." });
    if (!meta.slug.trim()) list.push({ path: "__slug", label: "Slug", message: "A URL slug is required." });
    else if (!/^[a-z0-9-]+$/.test(meta.slug))
      list.push({ path: "__slug", label: "Slug", message: "Use lowercase letters, numbers and dashes only." });
    // SEO title/description are required by the backend for every page type — surface
    // them here so the editor doesn't report "ready to publish" only to be rejected.
    if (!meta.seoTitle.trim())
      list.push({ path: "__seoTitle", label: "SEO title", message: "An SEO title is required (the <title> tag)." });
    if (!meta.seoDescription.trim())
      list.push({ path: "__seoDescription", label: "SEO description", message: "An SEO description is required (the meta description)." });
    return list;
  }, [draft, meta.slug, meta.title, meta.seoTitle, meta.seoDescription]);

  const save = useCallback(
    (publish: boolean) => {
      setServerErrors([]);
      if (!entry) {
        setServerErrors([{ code: "Editor", description: `No editor registered for ${templateType}.` }]);
        return;
      }
      // Merge the live pin state into `initial` so the (unchanged) serializers emit the edited pins
      // (they read pins off `initial`). For a new page, synthesize a minimal initial (id:0 → create).
      const serializerInitial: InitialPage = initial
        ? { ...initial, pricingRows, reviews, services }
        : {
            id: 0,
            slug: meta.slug,
            title: meta.title,
            seoTitle: meta.seoTitle,
            seoDescription: meta.seoDescription,
            noIndex: meta.noIndex,
            status: meta.status,
            heroImageAssetId: effectiveHeroAssetId ?? null,
            data: {},
            faqs: [],
            relatedLinks: [],
            pricingRows,
            reviews,
            services,
          };
      const payload = entry.serialize({
        draft,
        initial: serializerInitial,
        meta,
        relatedLinks,
        heroImageAssetId: effectiveHeroAssetId,
      });
      startTransition(async () => {
        const result = await savePageAction(
          payload as unknown as Record<string, unknown> & { id?: number },
          publish,
        );
        if (result.ok) {
          router.push("/admin/pages");
          router.refresh();
        } else {
          setServerErrors(result.errors ?? [{ code: "Error", description: "Save failed." }]);
          setSettingsOpen(true);
        }
      });
    },
    [entry, draft, initial, meta, relatedLinks, pricingRows, reviews, services, effectiveHeroAssetId, router, templateType],
  );

  const discard = useCallback(() => {
    if (typeof window !== "undefined" && window.confirm("Discard all unsaved changes?")) router.refresh();
  }, [router]);

  const jumpToIssue = useCallback((path: string) => {
    if (path.startsWith("__")) return;
    setSettingsOpen(false);
    document.querySelector<HTMLElement>(`[data-issue-path="${path}"]`)?.scrollIntoView({ behavior: "smooth", block: "center" });
  }, []);

  const drawer = (
    <SettingsDrawer
      open={settingsOpen}
      onOpenChange={setSettingsOpen}
      meta={meta}
      onMetaChange={updateMeta}
      relatedLinks={relatedLinks}
      onRelatedLinksChange={setRelatedLinks}
      reviews={reviews}
      onReviewsChange={setReviews}
      pricingRows={pricingRows}
      onPricingChange={setPricingRows}
      services={services}
      onServicesChange={setServices}
      issues={issues}
      onJumpToIssue={jumpToIssue}
    />
  );

  const toolbar = (
    <EditorToolbar
      title={meta.title}
      status={meta.status}
      editing={editing}
      saving={pending}
      dirty={dirty}
      advanced={advanced}
      device={device}
      onToggleDevice={() => setDevice((d) => (d === "mobile" ? "desktop" : "mobile"))}
      onToggleEditing={() => setEditing((v) => !v)}
      onToggleAdvanced={() => setAdvanced((v) => !v)}
      onOpenSettings={() => setSettingsOpen(true)}
      onSaveDraft={() => save(false)}
      onSavePublish={() => save(true)}
      onDiscard={discard}
    />
  );

  const AdvancedForm = entry?.AdvancedForm;
  if (advanced && AdvancedForm) {
    return (
      <div data-editing="false">
        {toolbar}
        <p className="-mx-4 mb-4 border-b border-amber-300/50 bg-amber-50 px-4 py-2 text-xs text-amber-800 sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8">
          Advanced view uses the classic field form. It saves independently of the in-place canvas above.
        </p>
        <AdvancedForm initial={initial} />
        {drawer}
      </div>
    );
  }

  const Template = entry?.Template;

  return (
    <div data-editing={editing ? "true" : "false"}>
      {toolbar}

      {serverErrors.length > 0 && (
        <div className="-mx-4 mb-4 border-b border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8">
          <p className="font-medium">Could not save:</p>
          <ul className="mt-1 list-disc pl-5">
            {serverErrors.map((e, i) => (
              <li key={i}>
                <span className="font-mono text-xs">{e.code}</span> — {e.description}
              </li>
            ))}
          </ul>
        </div>
      )}

      {device === "mobile" ? (
        <div className="mx-auto w-full max-w-[430px] overflow-hidden rounded-2xl border border-border bg-background shadow-sm">
          {Template ? <Template data={draft} /> : <p className="p-8 text-sm text-muted-foreground">No editor for {templateType}.</p>}
        </div>
      ) : (
        <div className="-mx-4 sm:-mx-6 lg:-mx-8">
          {Template ? <Template data={draft} /> : <p className="p-8 text-sm text-muted-foreground">No editor for {templateType}.</p>}
        </div>
      )}

      {drawer}
    </div>
  );
}
