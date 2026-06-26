"use client";

import {
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  type CSSProperties,
  type ReactNode,
} from "react";
import Image, { type ImageProps } from "next/image";
import { ChevronDown, ChevronUp, ImageIcon, Plus, Trash2, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { iconMap, resolveIcon } from "@/lib/icons";
import { useEditable } from "./editable-context";

/**
 * The `<Editable*>` primitives. Written once, reused by every template.
 *
 * CRITICAL CONTRACT: each primitive renders its `children` / plain value
 * VERBATIM when `!editing` (no provider mounted → `editing:false`), so a template
 * that uses them renders byte-for-byte identically on the public site. The editing
 * affordances only switch on when an `EditableProvider` supplies `editing:true`.
 */

const HOVER_RING =
  "rounded-[3px] outline outline-1 outline-dashed outline-transparent transition-[outline-color] hover:outline-primary/40";

/* ------------------------------------------------------------------ *
 * useEditableInherit — copy computed typography onto the inline editor so
 * the textarea/input looks like the surrounding text (per plan §B.3b).
 * ------------------------------------------------------------------ */
const INHERITED_STYLE: CSSProperties = {
  font: "inherit",
  fontWeight: "inherit",
  fontSize: "inherit",
  fontFamily: "inherit",
  lineHeight: "inherit",
  letterSpacing: "inherit",
  color: "inherit",
  textAlign: "inherit",
  background: "transparent",
  border: "none",
  outline: "none",
  margin: 0,
  padding: 0,
  width: "100%",
  resize: "none",
  display: "block",
  // Keep the text-balance / wrapping behaviour of the original element.
  textWrap: "inherit" as CSSProperties["textWrap"],
};

// SSR-safe layout effect: public pages server-render these primitives (as
// passthrough), so avoid React's useLayoutEffect-on-server warning.
const useIsomorphicLayoutEffect =
  typeof window !== "undefined" ? useLayoutEffect : useEffect;

function useAutoGrow(value: string, enabled: boolean) {
  const ref = useRef<HTMLTextAreaElement>(null);
  useIsomorphicLayoutEffect(() => {
    if (!enabled) return;
    const el = ref.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = `${el.scrollHeight}px`;
  }, [value, enabled]);
  return ref;
}

/* ------------------------------------------------------------------ *
 * EditableText
 * ------------------------------------------------------------------ */
export interface EditableTextProps {
  path: string;
  children?: ReactNode;
  /** Render as a single-line input instead of an auto-grow textarea. */
  singleLine?: boolean;
  placeholder?: string;
  className?: string;
  "aria-label"?: string;
}

export function EditableText({
  path,
  children,
  singleLine = false,
  placeholder = "Add text…",
  className,
  "aria-label": ariaLabel,
}: EditableTextProps) {
  const { editing, get, set, errors } = useEditable();

  // Auto-grow ref is created unconditionally (hooks rules); only used in edit mode.
  const raw = editing ? get(path) : undefined;
  const value = typeof raw === "string" ? raw : raw == null ? "" : String(raw);
  const textareaRef = useAutoGrow(value, editing && !singleLine);

  if (!editing) {
    // Public / preview render: verbatim children (the template's own interpolation).
    return <>{children}</>;
  }

  const error = errors[path];
  const commonProps = {
    value,
    placeholder,
    "aria-label": ariaLabel,
    "aria-invalid": error ? (true as const) : undefined,
    style: INHERITED_STYLE,
    className: cn(
      "cursor-text px-0.5 -mx-0.5",
      HOVER_RING,
      "focus:outline focus:outline-1 focus:outline-primary/60",
      error && "outline-destructive! outline-solid!",
      className,
    ),
    onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
      set(path, e.target.value),
  };

  return (
    <span className="relative inline-block w-full align-top" data-issue-path={error ? path : undefined}>
      {singleLine ? (
        <input type="text" {...commonProps} />
      ) : (
        <textarea ref={textareaRef} rows={1} {...commonProps} />
      )}
      {error && (
        <span className="mt-0.5 block text-xs font-normal text-destructive">
          {error}
        </span>
      )}
    </span>
  );
}

/* ------------------------------------------------------------------ *
 * EditableList — repeater with up/down/delete + trailing "+ Add" ghost.
 * NO @dnd-kit; reorder via up/down BUTTONS.
 * ------------------------------------------------------------------ */
export interface EditableListProps<T> {
  path: string;
  items: T[];
  /** Blank item produced by "+ Add". */
  itemTemplate: T | (() => T);
  /** Renders one item (the real card markup). Receives the item's index for path binding. */
  renderItem: (item: T, index: number) => ReactNode;
  /** Wrapper element/classes for each item slot (defaults to a bare fragment). */
  className?: string;
  /** Label shown on the "+ Add" ghost card. */
  addLabel?: string;
  /** Stable key extractor (defaults to index). */
  getKey?: (item: T, index: number) => string | number;
}

export function EditableList<T>({
  path,
  items,
  itemTemplate,
  renderItem,
  className,
  addLabel = "Add item",
  getKey,
}: EditableListProps<T>) {
  const { editing, listOps } = useEditable();
  const ops = listOps(path);

  if (!editing) {
    // Public render: just map as the template always did.
    return (
      <>
        {items.map((item, i) => (
          <PassthroughItem key={getKey ? getKey(item, i) : i}>
            {renderItem(item, i)}
          </PassthroughItem>
        ))}
      </>
    );
  }

  const makeBlank = (): T =>
    typeof itemTemplate === "function"
      ? (itemTemplate as () => T)()
      : structuredCloneSafe(itemTemplate);

  return (
    <>
      {items.map((item, i) => (
        <div
          key={getKey ? getKey(item, i) : i}
          className={cn("group/edit-item relative", className)}
        >
          {/* Item toolbar — appears on hover (top-right of the card). */}
          <div className="absolute -top-3 right-2 z-20 flex items-center gap-1 rounded-md border border-border bg-popover px-1 py-0.5 opacity-0 shadow-sm transition-opacity group-hover/edit-item:opacity-100">
            <ItemButton
              label="Move up"
              disabled={i === 0}
              onClick={() => ops.move(i, i - 1)}
            >
              <ChevronUp className="size-3.5" />
            </ItemButton>
            <ItemButton
              label="Move down"
              disabled={i === items.length - 1}
              onClick={() => ops.move(i, i + 1)}
            >
              <ChevronDown className="size-3.5" />
            </ItemButton>
            <ItemButton label="Delete" destructive onClick={() => ops.removeAt(i)}>
              <Trash2 className="size-3.5" />
            </ItemButton>
          </div>
          {renderItem(item, i)}
        </div>
      ))}

      {/* Trailing ghost "+ Add" card. */}
      <button
        type="button"
        onClick={() => ops.add(makeBlank())}
        className={cn(
          "flex min-h-24 items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-border bg-muted/20 p-5 text-sm font-medium text-muted-foreground transition-colors hover:border-primary/40 hover:text-foreground",
          className,
        )}
      >
        <Plus className="size-4" />
        {addLabel}
      </button>
    </>
  );
}

function PassthroughItem({ children }: { children: ReactNode }) {
  return <>{children}</>;
}

function structuredCloneSafe<T>(v: T): T {
  if (typeof structuredClone === "function") return structuredClone(v);
  return JSON.parse(JSON.stringify(v)) as T;
}

function ItemButton({
  children,
  label,
  onClick,
  disabled,
  destructive,
}: {
  children: ReactNode;
  label: string;
  onClick: () => void;
  disabled?: boolean;
  destructive?: boolean;
}) {
  return (
    <button
      type="button"
      aria-label={label}
      title={label}
      disabled={disabled}
      onClick={onClick}
      className={cn(
        "inline-flex size-6 items-center justify-center rounded text-muted-foreground transition-colors hover:bg-muted hover:text-foreground disabled:pointer-events-none disabled:opacity-30",
        destructive && "hover:bg-destructive/10 hover:text-destructive",
      )}
    >
      {children}
    </button>
  );
}

/* ------------------------------------------------------------------ *
 * EditableListControls — structural add/remove/reorder for a list WITHOUT
 * wrapping each item in a div. Use when the item markup must stay a direct
 * child of its parent (e.g. base-ui Accordion items). Renders nothing when
 * not editing, so the public render is untouched.
 * ------------------------------------------------------------------ */
export interface EditableListControlsProps {
  path: string;
  count: number;
  itemTemplate: unknown | (() => unknown);
  /** Per-row label shown next to its reorder/delete controls. */
  rowLabel?: (index: number) => string;
  addLabel?: string;
}

export function EditableListControls({
  path,
  count,
  itemTemplate,
  rowLabel,
  addLabel = "Add item",
}: EditableListControlsProps) {
  const { editing, listOps } = useEditable();
  if (!editing) return null;
  const ops = listOps(path);
  const makeBlank = () =>
    typeof itemTemplate === "function"
      ? (itemTemplate as () => unknown)()
      : structuredCloneSafe(itemTemplate);

  return (
    <div className="mt-4 space-y-1.5 rounded-xl border border-dashed border-border bg-muted/20 p-3">
      <p className="text-xs font-semibold tracking-wide text-muted-foreground uppercase">
        Manage items
      </p>
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="flex items-center justify-between gap-2 text-sm">
          <span className="truncate text-muted-foreground">
            {rowLabel ? rowLabel(i) : `Item ${i + 1}`}
          </span>
          <span className="flex shrink-0 items-center gap-1">
            <ItemButton label="Move up" disabled={i === 0} onClick={() => ops.move(i, i - 1)}>
              <ChevronUp className="size-3.5" />
            </ItemButton>
            <ItemButton
              label="Move down"
              disabled={i === count - 1}
              onClick={() => ops.move(i, i + 1)}
            >
              <ChevronDown className="size-3.5" />
            </ItemButton>
            <ItemButton label="Delete" destructive onClick={() => ops.removeAt(i)}>
              <Trash2 className="size-3.5" />
            </ItemButton>
          </span>
        </div>
      ))}
      <button
        type="button"
        onClick={() => ops.add(makeBlank())}
        className="mt-1 inline-flex items-center gap-1.5 rounded-md border border-border bg-background px-2.5 py-1 text-xs font-medium text-foreground transition-colors hover:border-primary/40"
      >
        <Plus className="size-3.5" />
        {addLabel}
      </button>
    </div>
  );
}

/* ------------------------------------------------------------------ *
 * EditableFaqList — an editing-only Q/A editor for FAQs. Rendered below the
 * real (display-only) FAQ accordion so the accordion's `<button>` trigger
 * structure stays valid and pristine on the public path. Renders nothing when
 * not editing.
 * ------------------------------------------------------------------ */
export interface EditableFaqListProps {
  path: string;
  count: number;
}

export function EditableFaqList({ path, count }: EditableFaqListProps) {
  const { editing, listOps } = useEditable();
  if (!editing) return null;
  const ops = listOps(path);

  return (
    <div className="mt-5 space-y-3 rounded-2xl border border-dashed border-border bg-muted/20 p-4">
      <p className="text-xs font-semibold tracking-wide text-muted-foreground uppercase">
        Edit FAQs
      </p>
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className="group/edit-item relative space-y-2 rounded-lg border border-border bg-background p-3"
        >
          <div className="absolute -top-3 right-2 z-20 flex items-center gap-1 rounded-md border border-border bg-popover px-1 py-0.5 opacity-0 shadow-sm transition-opacity group-hover/edit-item:opacity-100">
            <ItemButton label="Move up" disabled={i === 0} onClick={() => ops.move(i, i - 1)}>
              <ChevronUp className="size-3.5" />
            </ItemButton>
            <ItemButton
              label="Move down"
              disabled={i === count - 1}
              onClick={() => ops.move(i, i + 1)}
            >
              <ChevronDown className="size-3.5" />
            </ItemButton>
            <ItemButton label="Delete" destructive onClick={() => ops.removeAt(i)}>
              <Trash2 className="size-3.5" />
            </ItemButton>
          </div>
          <label className="block text-xs font-medium text-muted-foreground">
            Question
            <span className="mt-1 block font-heading text-base font-semibold text-foreground">
              <EditableText path={`${path}[${i}].question`} placeholder="Question…" />
            </span>
          </label>
          <label className="block text-xs font-medium text-muted-foreground">
            Answer
            <span className="mt-1 block text-sm text-foreground">
              <EditableText path={`${path}[${i}].answer`} placeholder="Answer…" />
            </span>
          </label>
        </div>
      ))}
      <button
        type="button"
        onClick={() => ops.add({ question: "", answer: "" })}
        className="inline-flex items-center gap-1.5 rounded-md border border-border bg-background px-2.5 py-1 text-xs font-medium text-foreground transition-colors hover:border-primary/40"
      >
        <Plus className="size-3.5" />
        Add FAQ
      </button>
    </div>
  );
}

/* ------------------------------------------------------------------ *
 * EditableImage — hover "Change image" overlay → asset picker.
 * ------------------------------------------------------------------ */
export interface EditableImageProps extends Omit<ImageProps, "src"> {
  /** Draft path holding the preview URL (e.g. "hero.image"). */
  path: string;
  src: string;
}

export function EditableImage({ path, src, alt, ...rest }: EditableImageProps) {
  const { editing, get, selectAsset } = useEditable();

  if (!editing) {
    return <Image src={src} alt={alt} {...rest} />;
  }

  const draftUrl = get(path);
  const liveSrc = typeof draftUrl === "string" && draftUrl ? draftUrl : src;

  return (
    <>
      <Image src={liveSrc} alt={alt} {...rest} />
      <button
        type="button"
        onClick={() => void selectAsset(path)}
        className="absolute inset-0 z-20 flex items-center justify-center gap-2 bg-foreground/40 text-sm font-semibold text-white opacity-0 backdrop-blur-[2px] transition-opacity hover:opacity-100 focus-visible:opacity-100"
      >
        <ImageIcon className="size-4" />
        Change image
      </button>
    </>
  );
}

/* ------------------------------------------------------------------ *
 * EditableIcon — picker over the closed lib/icons.ts map.
 * ------------------------------------------------------------------ */
export interface EditableIconProps {
  path: string;
  /** The rendered icon node when not editing (and behind the picker when editing). */
  children: ReactNode;
}

export function EditableIcon({ path, children }: EditableIconProps) {
  const { editing, get, set } = useEditable();
  const [open, setOpen] = useState(false);

  if (!editing) return <>{children}</>;

  const current = typeof get(path) === "string" ? (get(path) as string) : "";
  const names = Object.keys(iconMap);

  return (
    <span className="relative inline-flex">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-label="Change icon"
        title="Change icon"
        className={cn("contents", HOVER_RING)}
      >
        {children}
      </button>
      {open && (
        <>
          <span
            className="fixed inset-0 z-30"
            onClick={() => setOpen(false)}
            aria-hidden="true"
          />
          <span className="absolute top-full left-0 z-40 mt-1 grid w-64 grid-cols-6 gap-1 rounded-lg border border-border bg-popover p-2 shadow-lg">
            {names.map((name) => {
              const Icon = resolveIcon(name);
              return (
                <button
                  key={name}
                  type="button"
                  title={name}
                  onClick={() => {
                    set(path, name);
                    setOpen(false);
                  }}
                  className={cn(
                    "flex size-8 items-center justify-center rounded text-muted-foreground transition-colors hover:bg-muted hover:text-foreground",
                    current === name && "bg-primary/10 text-primary ring-1 ring-primary/40",
                  )}
                >
                  <Icon className="size-4" />
                </button>
              );
            })}
          </span>
        </>
      )}
    </span>
  );
}

/* ------------------------------------------------------------------ *
 * EditableGroup — optional hover chrome that labels a whole section.
 * ------------------------------------------------------------------ */
export interface EditableGroupProps {
  label: string;
  children: ReactNode;
  className?: string;
}

export function EditableGroup({ label, children, className }: EditableGroupProps) {
  const { editing } = useEditable();
  if (!editing) return <>{children}</>;

  return (
    <div className={cn("group/edit-group relative", className)}>
      <span className="pointer-events-none absolute -top-2 left-3 z-10 rounded bg-primary px-1.5 py-0.5 text-[10px] font-semibold tracking-wide text-primary-foreground uppercase opacity-0 transition-opacity group-hover/edit-group:opacity-100">
        {label}
      </span>
      {children}
    </div>
  );
}

/* ------------------------------------------------------------------ *
 * EditableRichText — minimal multi-line plain text (v1; no rich lib).
 * Splits/joins on blank lines so the template can keep `.map`-ing paragraphs.
 * ------------------------------------------------------------------ */
export interface EditableRichTextProps {
  path: string;
  children?: ReactNode;
  placeholder?: string;
  className?: string;
}

export function EditableRichText({
  path,
  children,
  placeholder = "Add text…",
  className,
}: EditableRichTextProps) {
  // For v1 this is just a multi-line EditableText; kept as a separate export so
  // Article (Phase 4) can swap in a richer editor later without touching templates.
  const { editing } = useEditable();
  if (!editing) return <>{children}</>;
  return (
    <EditableText path={path} placeholder={placeholder} className={className} />
  );
}

/** Re-export for convenience in a settings/library context. */
export { X as CloseIcon };
