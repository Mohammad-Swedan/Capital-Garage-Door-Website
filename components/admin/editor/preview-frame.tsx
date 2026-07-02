"use client";

import {
  useEffect,
  useRef,
  useState,
  type ReactNode,
  type RefObject,
} from "react";
import { createPortal } from "react-dom";
import { cn } from "@/lib/utils";

/**
 * `<PreviewFrame>` — renders the editor's page preview inside an `<iframe>` so the
 * template's responsive Tailwind breakpoints (`sm:`/`md:`/`lg:` → viewport media
 * queries) key off the **frame width** we choose, not the desktop browser window.
 *
 * Why this exists: the templates are responsive purely via viewport media queries
 * (there are no container queries), so the old `max-w-[430px]` preview `<div>` could
 * never trigger the mobile layout — the window stayed desktop-width. An iframe gets
 * its own viewport, so a 390px-wide frame renders the true phone layout, matching the
 * published page.
 *
 * The template is portaled into the frame's `<body>`, so the live `EditableProvider`
 * draft store + `LazyMotionProvider` flow through the portal unchanged — editing and
 * autosave keep working exactly as before. Parent stylesheets (Tailwind, globals.css,
 * editor.css, next/font) are cloned into the frame head so it looks identical to the
 * live site.
 */

export interface PreviewFrameProps {
  device: "desktop" | "mobile";
  editing: boolean;
  /** Populated with the frame's document once ready, for cross-document lookups (e.g. jumpToIssue). */
  docRef?: RefObject<Document | null>;
  children: ReactNode;
}

/** A representative phone width (iPhone 12–15 logical width). */
const MOBILE_WIDTH = 390;
/** Safety clamp so a runaway layout can never blow the frame height up unbounded. */
const MAX_FRAME_HEIGHT = 40000;

/**
 * Clone every parent stylesheet/`<style>` into the frame `<head>` so Tailwind output,
 * globals.css, editor.css and the next/font `@font-face` rules all apply inside the
 * frame. `<link href>` is resolved to absolute so it loads under the frame's base URL.
 */
function syncStyles(doc: Document) {
  doc.head.querySelectorAll("[data-preview-clone]").forEach((n) => n.remove());
  const nodes = document.head.querySelectorAll<HTMLElement>(
    'style, link[rel="stylesheet"]',
  );
  nodes.forEach((node) => {
    const clone = node.cloneNode(true) as HTMLElement;
    if (node instanceof HTMLLinkElement && clone instanceof HTMLLinkElement) {
      clone.href = node.href; // property read → absolute URL
    }
    clone.setAttribute("data-preview-clone", "");
    doc.head.appendChild(clone);
  });
}

export function PreviewFrame({
  device,
  editing,
  docRef,
  children,
}: PreviewFrameProps) {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [mountNode, setMountNode] = useState<HTMLElement | null>(null);

  useEffect(() => {
    const iframe = iframeRef.current;
    if (!iframe) return;
    const doc = iframe.contentDocument;
    const win = iframe.contentWindow;
    if (!doc || !win) return;

    // <base> so relative url(...) inside copied CSS (fonts/images) resolves to the app origin.
    if (!doc.head.querySelector("base")) {
      const base = doc.createElement("base");
      base.href = `${window.location.origin}/`;
      doc.head.appendChild(base);
    }
    // Parity with the public document (the frame width already drives the layout viewport).
    if (!doc.head.querySelector('meta[name="viewport"]')) {
      const meta = doc.createElement("meta");
      meta.name = "viewport";
      meta.content = "width=device-width, initial-scale=1";
      doc.head.appendChild(meta);
    }

    syncStyles(doc);

    // Carry the next/font variable classes (+ antialiased) onto the frame <html> so the
    // brand fonts resolve — but drop `h-full`, which would tie html height to the frame
    // and fight the auto-height measurement below.
    doc.documentElement.className = document.documentElement.className
      .split(/\s+/)
      .filter((c) => c && c !== "h-full")
      .join(" ");
    doc.body.className = "bg-background text-foreground font-sans overflow-x-hidden";

    let node = doc.getElementById("preview-root") as HTMLElement | null;
    if (!node) {
      node = doc.createElement("div");
      node.id = "preview-root";
      doc.body.appendChild(node);
    }
    setMountNode(node);
    if (docRef) docRef.current = doc;

    // Auto-height: keep the frame exactly as tall as its content so the admin page
    // scrolls naturally (no nested scrollbar), as the old inline preview did.
    const FrameResizeObserver =
      (win as unknown as typeof window).ResizeObserver ?? ResizeObserver;
    const setHeight = () => {
      const h = Math.min(doc.documentElement.scrollHeight, MAX_FRAME_HEIGHT);
      iframe.style.height = `${h}px`;
    };
    const ro = new FrameResizeObserver(setHeight);
    ro.observe(doc.body);
    setHeight();

    // Keep styles in sync across dev HMR (Next re-injects <style> tags on every edit).
    const mo = new MutationObserver(() => syncStyles(doc));
    mo.observe(document.head, { childList: true });

    return () => {
      ro.disconnect();
      mo.disconnect();
      if (docRef) docRef.current = null;
    };
  }, [docRef]);

  return (
    <div
      className={cn(
        device === "mobile"
          ? "mx-auto w-full overflow-hidden rounded-2xl border border-border bg-background shadow-sm"
          : "-mx-4 sm:-mx-6 lg:-mx-8",
      )}
      style={device === "mobile" ? { maxWidth: MOBILE_WIDTH } : undefined}
    >
      <iframe
        ref={iframeRef}
        title="Page preview"
        className="block w-full border-0 bg-background"
        style={{ height: 600 }}
      />
      {mountNode &&
        createPortal(
          <div data-editing={editing ? "true" : "false"}>{children}</div>,
          mountNode,
        )}
    </div>
  );
}
