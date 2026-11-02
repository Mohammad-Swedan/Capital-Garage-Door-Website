/**
 * Shared helpers for the Nov-2026 enhancement scripts (scripts/enhance-2026-11/*.ts).
 *
 * Each script owns ONE page's desired state and follows the enhance-clarkson-page.ts contract:
 * dry run by default, `--apply` writes, `CMS_API_URL` is required (no localhost default, because
 * the local :5179 CMS can serve another client's database), the page is looked up with a Flat
 * route-group filter, append-only edits are guarded by markers / normalised questions / hrefs,
 * nothing is written when nothing changes, and after a PUT the page is re-read and re-planned —
 * any remaining change means "written but verification failed" (non-zero exit).
 */

import { readFileSync } from "node:fs";

export const CMS_API_URL = (process.env.CMS_API_URL ?? "").replace(/\/$/, "");
export const IS_PROD = CMS_API_URL.includes("cgd.runasp.net");
export const SITE_URL = (process.env.SITE_URL ?? "https://capitalgaragedoors.com.au").replace(/\/$/, "");
export const APPLY = process.argv.includes("--apply");
const ADMIN_EMAIL = process.env.CMS_ADMIN_EMAIL ?? "admin@capitalgaragedoor.local";
const CMS_APPSETTINGS_PROD =
  "C:\\Users\\Mohammad swedan\\source\\repos\\Capital Garage Door CMS\\CapitalGarageDoor.Cms.Api\\appsettings.Production.json";

export interface AdminPage {
  id: number;
  templateType: string;
  routeGroup: string;
  slug: string;
  title: string;
  status: string;
  noIndex: boolean;
  seoTitle: string;
  seoDescription: string;
  heroImageAssetId: number | null;
  socialImageAssetId: number | null;
  data: Record<string, unknown>;
  faqs: { id: number; question: string; answer: string; sortOrder: number; faqItemId: number | null }[];
  relatedLinks: {
    id: number;
    targetPageId: number | null;
    staticHref: string | null;
    labelOverride: string | null;
    linkGroup: string;
    sortOrder: number;
  }[];
  pricingRows: { pricingItemId: number; sortOrder: number; noteOverride: string | null }[];
  reviews: { reviewId: number; sortOrder: number }[];
  services: { serviceId: number; sortOrder: number }[];
}

export const codePoints = (s: string): number => Array.from(s).length;
export const norm = (s: string): string => s.trim().toLowerCase().replace(/\s+/g, " ");

function resolveAdminPassword(): string {
  if (process.env.CMS_ADMIN_PASSWORD) return process.env.CMS_ADMIN_PASSWORD;
  if (!IS_PROD) throw new Error("CMS_ADMIN_PASSWORD is required for a non-production CMS_API_URL.");
  const raw = readFileSync(CMS_APPSETTINGS_PROD, "utf8").replace(/^\uFEFF/, "");
  const pw = (JSON.parse(raw) as { SeedAdmin?: { Password?: string } }).SeedAdmin?.Password;
  if (!pw) throw new Error("SeedAdmin.Password missing from appsettings.Production.json.");
  return pw;
}

let token = "";

export async function api<T>(path: string, init: RequestInit = {}): Promise<T> {
  const res = await fetch(`${CMS_API_URL}${path}`, {
    ...init,
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}`, ...(init.headers ?? {}) },
  });
  const text = await res.text();
  if (!res.ok) throw new Error(`${init.method ?? "GET"} ${path} failed (${res.status}): ${text.slice(0, 300)}`);
  return (text ? JSON.parse(text) : undefined) as T;
}

export async function login(): Promise<void> {
  if (!CMS_API_URL) throw new Error("CMS_API_URL is required (e.g. https://cgd.runasp.net). No localhost default on purpose.");
  const res = await fetch(`${CMS_API_URL}/api/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email: ADMIN_EMAIL, password: resolveAdminPassword() }),
  });
  if (!res.ok) throw new Error(`Login failed (${res.status}) at ${CMS_API_URL}.`);
  const data = (await res.json()) as { token?: string };
  if (!data.token) throw new Error("Login succeeded but no token was returned.");
  token = data.token;
}

export async function findFlatPage(slug: string, templateType?: string): Promise<AdminPage> {
  const list = await api<{ items: { id: number; slug: string; routeGroup: string; templateType: string }[] }>(
    "/api/admin/pages?pageSize=500",
  );
  const ref = list.items.find((p) => p.routeGroup === "Flat" && p.slug === slug);
  if (!ref) throw new Error(`${slug} (Flat) not found.`);
  if (templateType && ref.templateType !== templateType) {
    throw new Error(`${slug} is a ${ref.templateType}, expected ${templateType}.`);
  }
  return api<AdminPage>(`/api/admin/pages/${ref.id}`);
}

export function toUpdateBody(page: AdminPage) {
  return {
    id: page.id,
    templateType: page.templateType,
    slug: page.slug,
    title: page.title,
    seoTitle: page.seoTitle,
    seoDescription: page.seoDescription,
    noIndex: page.noIndex,
    status: page.status,
    heroImageAssetId: page.heroImageAssetId,
    socialImageAssetId: page.socialImageAssetId,
    data: page.data,
    faqs: page.faqs.map((f) => ({ question: f.question, answer: f.answer, sortOrder: f.sortOrder, faqItemId: f.faqItemId })),
    relatedLinks: page.relatedLinks.map((l) => ({
      targetPageId: l.targetPageId,
      staticHref: l.staticHref,
      labelOverride: l.labelOverride,
      linkGroup: l.linkGroup,
      sortOrder: l.sortOrder,
    })),
    pricingRows: page.pricingRows.map((r) => ({ pricingItemId: r.pricingItemId, sortOrder: r.sortOrder, noteOverride: r.noteOverride })),
    reviews: page.reviews.map((r) => ({ reviewId: r.reviewId, sortOrder: r.sortOrder })),
    services: page.services.map((s) => ({ serviceId: s.serviceId, sortOrder: s.sortOrder })),
  };
}

/** Plain 200 (no redirect) on the live site — the HREF rule for every internal link we add. */
export async function isLive200(href: string): Promise<boolean> {
  try {
    const res = await fetch(`${SITE_URL}${href}`, { method: "HEAD", redirect: "manual" });
    return res.status === 200;
  } catch {
    return false;
  }
}

/* ------------------------------------------------------------------ *
 * Append-only edit helpers (each returns a note when it changed something)
 * ------------------------------------------------------------------ */

export function setSeo(page: AdminPage, seo: { title?: string; description?: string }, notes: string[]): void {
  if (seo.title && page.seoTitle !== seo.title) {
    page.seoTitle = seo.title;
    notes.push("seoTitle");
  }
  if (seo.description && page.seoDescription !== seo.description) {
    page.seoDescription = seo.description;
    notes.push("seoDescription");
  }
}

/** Append a paragraph to `data.intro.paragraphs` (ServicePage) unless its marker is already there. */
export function appendIntroParagraph(page: AdminPage, marker: string, paragraph: string, notes: string[]): void {
  if (!paragraph.includes(marker)) throw new Error("paragraph must contain its marker");
  const intro = (page.data.intro ?? {}) as { heading?: string; paragraphs?: string[] };
  const paragraphs = Array.isArray(intro.paragraphs) ? intro.paragraphs : [];
  if (paragraphs.some((p) => p.includes(marker))) return;
  page.data.intro = { ...intro, paragraphs: [...paragraphs, paragraph] };
  notes.push(`intro.paragraphs += "${marker}" paragraph`);
}

/** Replace a substring inside any `data.intro.paragraphs` entry (ServicePage) — for correcting a sentence already live. */
export function replaceInIntro(page: AdminPage, from: string, to: string, notes: string[]): void {
  const intro = (page.data.intro ?? {}) as { heading?: string; paragraphs?: string[] };
  const paragraphs = Array.isArray(intro.paragraphs) ? intro.paragraphs : [];
  if (!paragraphs.some((p) => p.includes(from))) return;
  page.data.intro = { ...intro, paragraphs: paragraphs.map((p) => p.split(from).join(to)) };
  notes.push(`intro.paragraphs: "${from.slice(0, 40)}…" → "${to.slice(0, 40)}…"`);
}

export function appendFaqs(page: AdminPage, faqs: { question: string; answer: string }[], notes: string[]): void {
  const questions = new Set(page.faqs.map((f) => norm(f.question)));
  let sort = page.faqs.reduce((m, f) => Math.max(m, f.sortOrder), -1) + 1;
  for (const f of faqs) {
    if (questions.has(norm(f.question))) continue;
    page.faqs.push({ id: 0, question: f.question, answer: f.answer, sortOrder: sort++, faqItemId: null });
    questions.add(norm(f.question));
    notes.push(`faq: ${f.question}`);
  }
}

export function appendRelatedLinks(
  page: AdminPage,
  links: { label: string; href: string }[],
  notes: string[],
  linkGroup = "RelatedServices",
): void {
  let sort = page.relatedLinks.reduce((m, l) => Math.max(m, l.sortOrder), -1) + 1;
  for (const l of links) {
    if (page.relatedLinks.some((x) => x.linkGroup === linkGroup && x.staticHref === l.href)) continue;
    page.relatedLinks.push({ id: 0, targetPageId: null, staticHref: l.href, labelOverride: l.label, linkGroup, sortOrder: sort++ });
    notes.push(`${linkGroup}: ${l.href}`);
  }
}

/* ------------------------------------------------------------------ *
 * Guards + driver
 * ------------------------------------------------------------------ */

export function guardCopy(copy: unknown, seo?: { title?: string; description?: string }): void {
  const json = JSON.stringify(copy);
  if (/\$\s?\d/.test(json)) throw new Error("Copy contains a dollar figure — prices come only from the catalog pins.");
  if (/licensed|insured|lifetime|#1\b|authori[sz]ed dealer/i.test(json)) {
    throw new Error("Copy contains an unverified claim (licensed/insured/lifetime/#1/dealer).");
  }
  if (seo?.title && codePoints(seo.title) > 60) throw new Error(`seoTitle ${codePoints(seo.title)} code points (>60)`);
  if (seo?.description && codePoints(seo.description) > 160) throw new Error(`seoDescription ${codePoints(seo.description)} code points (>160)`);
}

/**
 * Run one page's enhancement: fetch → plan (mutates the page in memory, returns notes) → PUT when
 * `--apply` and something changed → re-read and re-plan; leftover notes = verification failure.
 */
export async function runEnhancement(opts: {
  name: string;
  slug: string;
  templateType?: string;
  plan: (page: AdminPage) => Promise<string[]> | string[];
}): Promise<void> {
  console.log(`${APPLY ? "APPLY" : "DRY RUN"}: ${opts.name} → ${CMS_API_URL}`);
  await login();
  console.log("✓ logged in");
  const page = await findFlatPage(opts.slug, opts.templateType);
  const notes = await opts.plan(page);
  if (!notes.length) {
    console.log("  = already at desired state — nothing to do");
    return;
  }
  console.log(`  ${APPLY ? "applying" : "would apply"} to ${opts.slug} [${page.status}]:\n    - ${notes.join("\n    - ")}`);
  if (!APPLY) return;
  await api(`/api/admin/pages/${page.id}`, { method: "PUT", body: JSON.stringify(toUpdateBody(page)) });
  const after = await findFlatPage(opts.slug);
  const drift = await opts.plan(after);
  if (drift.length) {
    process.exitCode = 1;
    console.error(`  ! written but verification failed — still pending: ${drift.join(", ")}`);
  } else {
    console.log("  ✓ written and verified");
  }
}
