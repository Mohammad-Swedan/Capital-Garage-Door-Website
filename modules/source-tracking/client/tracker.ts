/**
 * Page lifecycle events:
 *
 * - `page_view` on the first load and on every App Router pathname/search
 *   change. props: title, viewportW, viewportH, and the session-start
 *   referrer on the first view of a session that started on this page.
 * - `page_leave`, exactly once per page — on the next route change, or when
 *   the page is hidden/unloaded, whichever comes first. props: engagedMs
 *   (visible and not idle > 30 s), maxScrollPct, milestones [25,50,75,90]
 *   reached, durationMs.
 * - `web_vitals` via Next's useReportWebVitals (wired in provider.tsx; the
 *   callback lives here so its identity is stable). props: name, value,
 *   rating, navigationType.
 */
import { cleanText } from "../shared";
import { createEngagementClock, milestonesReached, scrollPercent, type EngagementClock } from "./engagement";
import { isExcludedPath, enqueue } from "./sink";
import { markNavigated, takeFirstViewReferrer } from "./session";

interface PageState {
  key: string;
  path: string;
  startedAt: number;
  clock: EngagementClock;
  maxScrollPct: number;
  leaveSent: boolean;
}

let page: PageState | null = null;
let lifecycleInstalled = false;
let lastActivityMark = 0;
let scrollFrame = 0;

function now(): number {
  return Date.now();
}

function measureScroll(): void {
  if (!page) return;
  const doc = document.documentElement;
  const height = Math.max(doc.scrollHeight, document.body ? document.body.scrollHeight : 0);
  const pct = scrollPercent(window.scrollY || doc.scrollTop || 0, window.innerHeight, height);
  if (pct > page.maxScrollPct) page.maxScrollPct = pct;
}

function sendPageLeave(state: PageState): void {
  if (state.leaveSent) return;
  state.leaveSent = true;
  if (state === page) measureScroll();
  const t = now();
  enqueue("page_leave", {
    path: state.path,
    props: {
      engagedMs: state.clock.total(t),
      maxScrollPct: state.maxScrollPct,
      milestones: milestonesReached(state.maxScrollPct),
      durationMs: Math.max(0, t - state.startedAt),
    },
  });
}

function startPage(key: string, path: string): void {
  const t = now();
  page = {
    key,
    path,
    startedAt: t,
    clock: createEngagementClock(t, document.visibilityState !== "hidden"),
    maxScrollPct: 0,
    leaveSent: false,
  };
  const current = page;

  // Let the new route commit its <title> and layout before reading them.
  setTimeout(() => {
    const referrer = takeFirstViewReferrer();
    enqueue("page_view", {
      path: current.path,
      props: {
        title: cleanText(document.title, 120),
        viewportW: window.innerWidth,
        viewportH: window.innerHeight,
        ...(referrer ? { referrer: referrer.slice(0, 300) } : {}),
      },
    });
    if (page === current) measureScroll();
  }, 50);
}

function onActivity(): void {
  const t = now();
  // Throttled: the clock only needs a mark every second or so.
  if (t - lastActivityMark < 1000) return;
  lastActivityMark = t;
  page?.clock.activity(t);
}

function installLifecycle(): void {
  if (lifecycleInstalled) return;
  lifecycleInstalled = true;

  window.addEventListener(
    "scroll",
    () => {
      onActivity();
      if (!scrollFrame) {
        scrollFrame = requestAnimationFrame(() => {
          scrollFrame = 0;
          measureScroll();
        });
      }
    },
    { passive: true },
  );
  for (const type of ["pointerdown", "keydown", "touchstart", "mousemove", "wheel"]) {
    window.addEventListener(type, onActivity, { passive: true, capture: true });
  }
  document.addEventListener("visibilitychange", () => {
    const hidden = document.visibilityState === "hidden";
    page?.clock.visibility(!hidden, now());
    if (hidden && page) sendPageLeave(page);
  });
  window.addEventListener("pagehide", () => {
    if (page) sendPageLeave(page);
  });
  window.addEventListener("pageshow", (event) => {
    // Restored from the back/forward cache: the old page's leave was already
    // sent, so this is a fresh view of the same URL.
    if (event.persisted && page) startPage(page.key, page.path);
  });
}

/**
 * Called by the provider on mount and on every pathname/search change.
 * Duplicate calls for the same URL (React StrictMode, re-renders) are ignored.
 */
export function trackRoute(pathname: string, search: string): void {
  try {
    if (typeof window === "undefined") return;
    const path = pathname || "/";
    const key = search ? `${path}?${search}` : path;
    if (page && page.key === key) return;

    if (page) {
      sendPageLeave(page);
      markNavigated();
    }
    if (isExcludedPath(path)) {
      page = null;
      return;
    }
    installLifecycle();
    startPage(key, path);
  } catch {
    // Never let tracking break navigation.
  }
}

const VITAL_NAMES: ReadonlySet<string> = new Set(["LCP", "INP", "CLS", "FCP", "TTFB"]);

export interface VitalMetric {
  name: string;
  value: number;
  rating?: string;
  navigationType?: string;
}

/** Stable callback for useReportWebVitals. */
export function reportWebVital(metric: VitalMetric): void {
  try {
    if (!VITAL_NAMES.has(metric.name) || !Number.isFinite(metric.value)) return;
    const value = metric.name === "CLS" ? Math.round(metric.value * 10_000) / 10_000 : Math.round(metric.value);
    enqueue("web_vitals", {
      label: metric.name,
      props: {
        name: metric.name,
        value,
        rating: metric.rating ?? null,
        navigationType: metric.navigationType ?? null,
      },
    });
  } catch {
    // ignore
  }
}
