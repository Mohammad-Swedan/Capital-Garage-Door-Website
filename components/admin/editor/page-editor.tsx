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
import { useAutosave } from "./use-autosave";
import { slugify } from "./editor-helpers";
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

/**
 * Templates that manage their cost/pricing rows INLINE (on the canvas, under the cost table) rather
 * than in the Settings-drawer "Pins" tab. For these, the drawer's pricing section is hidden to keep
 * a single source of truth. ServicePage uses the inline `EditablePricingRows` editor.
 */
const INLINE_PRICING_TEMPLATES = new Set(["ServicePage"]);

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

  const isNewPage = !initial;
  // After autosave CREATEs a brand-new page, remember the id the backend assigned
  // so the NEXT save UPDATEs that same page instead of creating a duplicate.
  const [createdId, setCreatedId] = useState<number | null>(null);
  // The slug auto-derives from the title for new pages until the author edits it
  // by hand (then we stop overriding). Never auto-touch an existing page's slug.
  const slugTouchedRef = useRef(!isNewPage);

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
  // Single source of truth for "what does the editor state currently look like" —
  // used both for the dirty check and as the autosave trigger signature.
  const signature = useMemo(
    () => JSON.stringify({ draft, meta, relatedLinks, pins: { pricingRows, reviews, services } }),
    [draft, meta, relatedLinks, pricingRows, reviews, services],
  );
  const dirty = signature !== seedSnapshot.current;

  // selectAsset writes `hero.imageAssetId` into the draft; prefer it over the loaded value.
  const effectiveHeroAssetId = useMemo(() => {
    const fromDraft = (draft?.hero as { imageAssetId?: number } | undefined)?.imageAssetId;
    return typeof fromDraft === "number" ? fromDraft : heroAssetId;
  }, [draft, heroAssetId]);

  // Meta updates with two niceties: (1) record a manual slug edit so auto-derive
  // backs off, (2) auto-derive the slug from the title for untouched new pages.
  const updateMeta = useCallback(
    (patch: Partial<PageMeta>) => {
      if (patch.slug !== undefined) slugTouchedRef.current = true;
      setMeta((m) => {
        const next = { ...m, ...patch };
        if (patch.title !== undefined && !slugTouchedRef.current) {
          next.slug = slugify(patch.title);
        }
        return next;
      });
    },
    [],
  );

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
    else if (meta.seoTitle.length > 65)
      list.push({ path: "__seoTitle", label: "SEO title", message: `A little long (${meta.seoTitle.length} chars) — aim for ≤ 60 so it isn't truncated in search.` });
    if (!meta.seoDescription.trim())
      list.push({ path: "__seoDescription", label: "SEO description", message: "An SEO description is required (the meta description)." });
    else if (meta.seoDescription.length > 165)
      list.push({ path: "__seoDescription", label: "SEO description", message: `A little long (${meta.seoDescription.length} chars) — aim for 120–160.` });
    return list;
  }, [draft, meta.slug, meta.title, meta.seoTitle, meta.seoDescription]);

  // Hard issues that should BLOCK an autosave/publish (length-only warnings don't).
  const hasBlockingIssues = useMemo(() => {
    if (!meta.title.trim() || !meta.slug.trim() || !/^[a-z0-9-]+$/.test(meta.slug)) return true;
    if (!meta.seoTitle.trim() || !meta.seoDescription.trim()) return true;
    const heroH1 = (draft?.hero as { h1?: string } | undefined)?.h1;
    if (typeof heroH1 === "string" && !heroH1.trim()) return true;
    return false;
  }, [draft, meta.slug, meta.title, meta.seoTitle, meta.seoDescription]);

  // Forward-declare the autosave handle so `save` can mark its result; the hook
  // is created just below and only calls `save` via a ref, so order is fine.
  const autosaveRef = useRef<{ markSaved: (at?: Date) => void; markError: () => void; cancelPending: () => void } | null>(null);

  const save = useCallback(
    (publish: boolean, opts?: { silent?: boolean }) => {
      const silent = opts?.silent ?? false;
      // A manual save/publish supersedes any queued autosave.
      if (!silent) autosaveRef.current?.cancelPending();
      setServerErrors([]);
      if (!entry) {
        setServerErrors([{ code: "Editor", description: `No editor registered for ${templateType}.` }]);
        if (silent) autosaveRef.current?.markError();
        return;
      }
      // The effective id: a loaded page's id, else the id a prior autosave created.
      const effectiveId = initial?.id ?? createdId ?? 0;
      // Merge the live pin state into `initial` so the (unchanged) serializers emit the edited pins
      // (they read pins off `initial`). For a new page, synthesize a minimal initial. Once a prior
      // autosave has created the page, carry its id so we UPDATE rather than create a duplicate.
      const serializerInitial: InitialPage = initial
        ? { ...initial, id: effectiveId, pricingRows, reviews, services }
        : {
            id: effectiveId,
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
      // A new page that has never been saved must serialize WITHOUT an id (id 0 →
      // create); only pass `initial` to the serializer once we truly have one.
      const useInitial = initial || effectiveId > 0 ? serializerInitial : undefined;
      const payload = entry.serialize({
        draft,
        initial: useInitial,
        meta,
        relatedLinks,
        heroImageAssetId: effectiveHeroAssetId,
      });
      // Snapshot the state we're about to persist so a successful SILENT save can
      // reset the dirty baseline to exactly this (edits made mid-flight stay dirty).
      const savedSignature = signature;
      startTransition(async () => {
        const result = await savePageAction(
          payload as unknown as Record<string, unknown> & { id?: number },
          publish,
        );
        if (result.ok) {
          if (silent) {
            // Autosave: stay on the page. Reset the dirty baseline, remember any
            // newly-created id, and flag the chip as saved.
            seedSnapshot.current = savedSignature;
            if (result.id && !initial) setCreatedId(result.id);
            autosaveRef.current?.markSaved(new Date());
          } else {
            // Manual save/publish: clear dirty so the unload guard won't fire, then
            // return to the list (unchanged behaviour).
            seedSnapshot.current = savedSignature;
            router.push("/admin/pages");
            router.refresh();
          }
        } else {
          setServerErrors(result.errors ?? [{ code: "Error", description: "Save failed." }]);
          if (silent) {
            autosaveRef.current?.markError();
          } else {
            setSettingsOpen(true);
          }
        }
      });
    },
    [entry, draft, initial, createdId, meta, relatedLinks, pricingRows, reviews, services, effectiveHeroAssetId, signature, router, templateType],
  );

  // Debounced draft autosave (never publishes; backs off while invalid).
  const autosave = useAutosave({
    enabled: !advanced,
    dirty,
    blocked: hasBlockingIssues,
    saving: pending,
    signature,
    onSave: useCallback(() => save(false, { silent: true }), [save]),
  });
  // Keep the handle current for `save`'s async callbacks (assigned post-render so
  // we never write a ref during render).
  useEffect(() => {
    autosaveRef.current = autosave;
  });

  // Keyboard shortcuts: Ctrl/⌘+S = save draft, Ctrl/⌘+⇧+P = publish.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const mod = e.metaKey || e.ctrlKey;
      if (!mod) return;
      const key = e.key.toLowerCase();
      if (key === "s" && !e.shiftKey) {
        e.preventDefault();
        if (!pending) save(false);
      } else if (key === "p" && e.shiftKey) {
        e.preventDefault();
        if (!pending && !hasBlockingIssues) save(true);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [save, pending, hasBlockingIssues]);

  // Dirty-nav guard: warn before a full unload (close/refresh/external link) ONLY
  // while there are genuinely unsaved edits and nothing is mid-save. A successful
  // save/autosave resets `dirty`, so this detaches itself and won't fire after.
  useEffect(() => {
    if (!dirty || pending) return;
    const handler = (e: BeforeUnloadEvent) => {
      e.preventDefault();
      e.returnValue = "";
    };
    window.addEventListener("beforeunload", handler);
    return () => window.removeEventListener("beforeunload", handler);
  }, [dirty, pending]);

  const discard = useCallback(() => {
    if (typeof window !== "undefined" && window.confirm("Discard all unsaved changes? This can't be undone.")) {
      autosaveRef.current?.cancelPending();
      router.refresh();
    }
  }, [router]);

  // Jump to an issue: on-canvas fields scroll into view + focus; meta-only issues
  // (slug/title/SEO) open the Settings drawer where those fields live.
  const jumpToIssue = useCallback((path: string) => {
    if (path.startsWith("__")) {
      setSettingsOpen(true);
      return;
    }
    setSettingsOpen(false);
    const el = document.querySelector<HTMLElement>(`[data-issue-path="${path}"]`);
    el?.scrollIntoView({ behavior: "smooth", block: "center" });
    el?.querySelector<HTMLElement>("[contenteditable], input, textarea")?.focus();
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
      showPricingPins={!INLINE_PRICING_TEMPLATES.has(templateType)}
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
      saveStatus={autosave.status}
      lastSavedAt={autosave.lastSavedAt}
      issues={issues}
      onJumpToIssue={jumpToIssue}
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
