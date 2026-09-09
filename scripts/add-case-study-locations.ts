/**
 * Writes `data.location` ("Street Name, Suburb" — house/unit number STRIPPED) onto the
 * case studies whose manifest entry carries one (the 11 real CRM jobs). Nothing else
 * on the page is touched; status is preserved. Idempotent. PRODUCTION is the default.
 *
 * Rendered by the case-study hero ("Location" stat) and as Article.contentLocation in
 * the JSON-LD (lib/seo/schema.ts caseStudySchema) for street-level local E-E-A-T.
 *
 *   npx tsx scripts/add-case-study-locations.ts [--dry-run]
 */

import { readFileSync } from "node:fs";
import { JOBS } from "./job-pages-2026-08-manifest";

const CMS_API_URL = (process.env.CMS_API_URL ?? "https://cgd.runasp.net").replace(/\/$/, "");
const IS_PROD = CMS_API_URL.includes("cgd.runasp.net");
const ADMIN_EMAIL = process.env.CMS_ADMIN_EMAIL ?? "admin@capitalgaragedoor.local";
const APPSETTINGS =
  "C:\\Users\\Mohammad swedan\\source\\repos\\Capital Garage Door CMS\\CapitalGarageDoor.Cms.Api\\appsettings.Production.json";

interface AdminPage {
  id: number;
  templateType: string;
  slug: string;
  title: string;
  status: string;
  noIndex: boolean;
  seoTitle: string;
  seoDescription: string;
  heroImageAssetId: number | null;
  socialImageAssetId: number | null;
  data: Record<string, unknown>;
  faqs: { question: string; answer: string; sortOrder: number; faqItemId: number | null }[];
  relatedLinks: { targetPageId: number | null; staticHref: string | null; labelOverride: string | null; linkGroup: string; sortOrder: number }[];
  pricingRows: { pricingItemId: number; sortOrder: number; noteOverride: string | null }[];
  reviews: { reviewId: number; sortOrder: number }[];
  services: { serviceId: number; sortOrder: number }[];
}

function password(): string {
  if (process.env.CMS_ADMIN_PASSWORD) return process.env.CMS_ADMIN_PASSWORD;
  if (!IS_PROD) return "Admin#12345";
  const raw = readFileSync(APPSETTINGS, "utf8").replace(/^\uFEFF/, "");
  const pw = (JSON.parse(raw) as { SeedAdmin?: { Password?: string } }).SeedAdmin?.Password;
  if (!pw) throw new Error("SeedAdmin.Password missing");
  return pw;
}

let token = "";
async function api<T>(path: string, init: RequestInit = {}): Promise<T> {
  const res = await fetch(`${CMS_API_URL}${path}`, {
    ...init,
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}`, ...(init.headers ?? {}) },
  });
  const text = await res.text();
  if (!res.ok) throw new Error(`${init.method ?? "GET"} ${path} failed (${res.status}): ${text.slice(0, 300)}`);
  return (text ? JSON.parse(text) : undefined) as T;
}

function toUpdateBody(p: AdminPage) {
  return {
    id: p.id, templateType: p.templateType, slug: p.slug, title: p.title, seoTitle: p.seoTitle,
    seoDescription: p.seoDescription, noIndex: p.noIndex, status: p.status,
    heroImageAssetId: p.heroImageAssetId, socialImageAssetId: p.socialImageAssetId, data: p.data,
    faqs: p.faqs.map((f) => ({ question: f.question, answer: f.answer, sortOrder: f.sortOrder, faqItemId: f.faqItemId })),
    relatedLinks: p.relatedLinks.map((l) => ({ targetPageId: l.targetPageId, staticHref: l.staticHref, labelOverride: l.labelOverride, linkGroup: l.linkGroup, sortOrder: l.sortOrder })),
    pricingRows: p.pricingRows.map((r) => ({ pricingItemId: r.pricingItemId, sortOrder: r.sortOrder, noteOverride: r.noteOverride })),
    reviews: p.reviews.map((r) => ({ reviewId: r.reviewId, sortOrder: r.sortOrder })),
    services: p.services.map((s) => ({ serviceId: s.serviceId, sortOrder: s.sortOrder })),
  };
}

async function main() {
  const dryRun = process.argv.includes("--dry-run");
  const withLocation = JOBS.filter((j) => j.location);
  for (const j of withLocation) {
    if (/\d/.test(j.location!)) throw new Error(`${j.slug}: location contains a digit — house numbers never go on the site`);
  }
  console.log(`Case-study locations (${withLocation.length}) → ${CMS_API_URL}${dryRun ? " (DRY RUN)" : ""}`);

  const login = await fetch(`${CMS_API_URL}/api/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email: ADMIN_EMAIL, password: password() }),
  });
  if (!login.ok) throw new Error(`Login failed (${login.status})`);
  token = ((await login.json()) as { token: string }).token;

  const list = await api<{ items: { id: number; slug: string; routeGroup: string }[] }>("/api/admin/pages?pageSize=500");
  for (const j of withLocation) {
    const ref = list.items.find((p) => p.routeGroup === "CaseStudies" && p.slug === j.slug);
    if (!ref) { console.error(`  ! ${j.slug} not found`); continue; }
    const page = await api<AdminPage>(`/api/admin/pages/${ref.id}`);
    if (page.data.location === j.location) { console.log(`  = ${j.slug}: already "${j.location}"`); continue; }
    page.data.location = j.location;
    if (dryRun) { console.log(`  would set ${j.slug} → "${j.location}"`); continue; }
    await api(`/api/admin/pages/${page.id}`, { method: "PUT", body: JSON.stringify(toUpdateBody(page)) });
    console.log(`  ✓ ${j.slug} [${page.status}] → "${j.location}"`);
  }
}

main().catch((e) => { console.error(e instanceof Error ? e.message : e); process.exit(1); });
