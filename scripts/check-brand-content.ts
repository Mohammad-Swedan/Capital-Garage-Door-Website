/**
 * Guard for the brand content type (content/brands/*). Fails the run (exit 1) on any of:
 * duplicate/invalid slugs, unknown entities, dealer wording on non-dealer pages, literal prices,
 * over-long titles/descriptions, missing FAQs, unknown pricing pins or problem slugs, hrefs that
 * don't resolve, nav menu hrefs that don't resolve, non-ISO updatedAt, missing logo files,
 * unlisted prose paths on door pages, and unknown price tokens in hub FAQs.
 *
 *   npx tsx scripts/check-brand-content.ts            # checks hrefs against the LIVE sitemap
 *   npx tsx scripts/check-brand-content.ts --offline  # skips the network check
 */
export {};

import { existsSync } from "node:fs";
import { join } from "node:path";
import { BRAND_ENTITIES } from "../content/brands/entities";
import { BRAND_HUBS } from "../content/brands/hubs";
import { brandPages } from "../content/brands";
import { NAV_MENUS } from "../config/nav-menus";
import { PRICING_BY_ID } from "../components/sections/smart-calculator/pricing-data";
import { serviceSuburbPages } from "../content/service-suburb-pages";

const DEALERS = new Set(["avanti", "b-and-d", "boss", "gliderol", "jaytech", "perth-windsor-doors", "steel-line", "superlift"]);
const PROBLEMS = new Set([
  "garage-door-wont-open", "garage-door-wont-close", "garage-door-stuck-halfway", "garage-door-remote-not-working",
  "garage-door-motor-not-responding", "garage-door-spring-or-cable-broken", "garage-door-off-track", "noisy-garage-door",
]);
const STATIC_ROUTES = new Set(["/", "/services", "/service-areas", "/garage-door-motors-perth", "/cost-guides", "/calculator", "/quote", "/blog", "/problems", "/case-studies", "/gallery", "/reviews", "/warranty", "/warranty-registration", "/about", "/contact", "/privacy", "/terms"]);

// Live sitemap flat slugs as of 2026-08-27 — CMS-only pages that exist in no local registry
// (services, door types, cost guides). Refresh when routes change. Unioned into the URL set in
// BOTH modes, so --offline can validate real hrefs without a network call, and live mode stays a
// strict superset of it.
const KNOWN_LIVE_ROUTES = new Set([
  "/garage-door-repairs-perth",
  "/commercial-garage-doors-perth",
  "/commercial-roller-doors-perth",
  "/custom-garage-doors-perth",
  "/garage-door-installation-perth",
  "/garage-door-maintenance-perth",
  "/garage-door-opener-repair-perth",
  "/garage-door-panel-replacement-perth",
  "/garage-door-remote-replacement-perth",
  "/garage-doors-perth",
  "/garage-door-spring-repair-perth",
  "/industrial-roller-doors-perth",
  "/roller-door-installation-perth",
  "/roller-door-repairs-perth",
  "/roller-doors-perth",
  "/sectional-garage-doors-perth",
  "/tilt-garage-doors-perth",
  "/roller-door-vs-sectional-door",
  "/garage-door-motor-replacement-cost-perth",
  "/garage-door-repair-cost-perth",
  "/garage-door-service-cost-perth",
  "/garage-door-spring-replacement-cost-perth",
]);

// Duplicated from `PROSE_LINKS` in components/sections/brands/brand-parts.tsx (not exported —
// keep these three keys in lockstep with that file's allow-list). Door-page `parts.paragraphs`
// may only reference these paths inline; anything else renders as plain text on the page and is
// a content bug here.
const PARTS_PROSE_LINKS = new Set([
  "/garage-doors-perth",
  "/garage-door-panel-replacement-perth",
  "/garage-door-installation-perth",
]);
/** A hub FAQ's only allowed price tokens — matches the scenario ids the hub copy actually pins. */
const HUB_PRICE_IDS = new Set(["new-standard", "motor-replace", "service"]);

const offline = process.argv.includes("--offline");
const errors: string[] = [];
const fail = (msg: string) => errors.push(msg);

async function liveUrls(): Promise<Set<string>> {
  const urls = new Set<string>(STATIC_ROUTES);
  for (const p of brandPages) urls.add(`/${p.slug}`);
  for (const h of Object.values(BRAND_HUBS)) urls.add(`/${h.slug}`);
  for (const slug of PROBLEMS) urls.add(`/problems/${slug}`);
  for (const route of KNOWN_LIVE_ROUTES) urls.add(route);
  for (const page of serviceSuburbPages) urls.add(`/${page.slug}`);
  if (offline) return urls;
  // This branch isn't deployed yet, so the production sitemap doesn't carry the new brand pages
  // or hubs — union the local registries above (already added) with whatever's live so hrefs to
  // pre-existing pages (services, cost guides, suburb pages, …) still validate against reality.
  // A failed or empty fetch must throw rather than silently pass every href check.
  const res = await fetch("https://capitalgaragedoors.com.au/sitemap.xml");
  if (!res.ok) throw new Error(`Live sitemap fetch failed: HTTP ${res.status}`);
  const xml = await res.text();
  let parsed = 0;
  for (const m of xml.matchAll(/<loc>https:\/\/capitalgaragedoors\.com\.au(\/[^<]*)<\/loc>/g)) {
    urls.add(m[1]);
    parsed++;
  }
  if (parsed === 0) throw new Error("sitemap parsed 0 URLs — network/captive-portal problem?");
  return urls;
}

/** Bare internal paths written in prose, e.g. "…see /garage-doors-perth." Identical to
 * components/sections/brands/brand-parts.tsx's own PATH_TOKEN regex (one-or-more hyphenated
 * segments) so single-segment paths like /blog never false-positive as unlisted references. */
const PATH_TOKEN = /\/[a-z0-9]+(?:-[a-z0-9]+)+/g;

/** Every other plain-text-rendered field on a brand page: a raw path here shows up verbatim on
 * the page (and in FAQPage JSON-LD for the faqs case) with no link — always a content bug. Unlike
 * `parts.paragraphs`, NONE of these may contain a path token, not even the PARTS_PROSE_LINKS set. */
function checkNoPathTokens(where: string, field: string, text: string) {
  for (const token of text.match(PATH_TOKEN) ?? []) {
    fail(`${where}: ${field} references a raw path ${token} (renders as plain text — rewrite as prose)`);
  }
}

(async () => {
  const urls = await liveUrls();
  const entityBySlug = new Map(BRAND_ENTITIES.map((e) => [e.slug, e]));

  // Entities
  const seenEntity = new Set<string>();
  for (const e of BRAND_ENTITIES) {
    if (seenEntity.has(e.slug)) fail(`duplicate entity slug ${e.slug}`);
    seenEntity.add(e.slug);
    if (e.dealer !== DEALERS.has(e.slug)) fail(`entity ${e.slug}: dealer flag must be ${DEALERS.has(e.slug)}`);
    if (e.logo && e.logo.startsWith("/") && !existsSync(join(process.cwd(), "public", e.logo))) fail(`entity ${e.slug}: logo file missing ${e.logo}`);
    if (e.url && !/^https:\/\//.test(e.url)) fail(`entity ${e.slug}: url must be https`);
    if (!/^#[0-9a-f]{6}$/i.test(e.accent)) fail(`entity ${e.slug}: accent must be a 6-digit hex`);
    if (e.summary.length > 120) fail(`entity ${e.slug}: summary > 120 chars`);
    if (e.sources.length === 0) fail(`entity ${e.slug}: no sources`);
  }
  for (const slug of DEALERS) if (!entityBySlug.has(slug)) fail(`dealer entity ${slug} missing`);

  // Pages
  const seenSlug = new Set<string>();
  for (const p of brandPages) {
    const where = `page ${p.slug}`;
    if (seenSlug.has(p.slug)) fail(`${where}: duplicate slug`);
    seenSlug.add(p.slug);
    const entity = entityBySlug.get(p.brand);
    if (!entity) { fail(`${where}: unknown entity ${p.brand}`); continue; }
    if (!entity.kinds.includes(p.kind)) fail(`${where}: entity ${p.brand} has no kind ${p.kind}`);
    const expected = p.kind === "motor" ? `${p.brand}-garage-door-motors-perth` : `${p.brand}-garage-doors-perth`;
    if (p.slug !== expected && p.brand !== "perth-windsor-doors") fail(`${where}: slug should be ${expected}`);
    if (!/^\d{4}-\d{2}-\d{2}$/.test(p.updatedAt)) fail(`${where}: updatedAt must be YYYY-MM-DD`);
    if (p.seo.title.length > 60) fail(`${where}: title ${p.seo.title.length} > 60`);
    if (p.seo.description.length > 160) fail(`${where}: description ${p.seo.description.length} > 160`);
    const json = JSON.stringify(p);
    if (/\$\s?\d/.test(json)) fail(`${where}: literal price — use {{price:id}}`);
    if (!entity.dealer && /authori[sz]ed|dealer/i.test(json)) fail(`${where}: dealer wording on a non-dealer brand`);
    if (p.faqs.length < 6) fail(`${where}: ${p.faqs.length} FAQs (< 6)`);
    if (p.services.length !== 4) fail(`${where}: services must be exactly 4`);
    if (p.intro.paragraphs.length < 2) fail(`${where}: intro needs ≥2 paragraphs`);
    for (const id of p.pricingPins) if (!PRICING_BY_ID.has(id)) fail(`${where}: unknown pricing pin ${id}`);
    for (const m of json.matchAll(/\{\{price:([a-z0-9-]+)\}\}/g)) {
      if (!p.pricingPins.includes(m[1]) && !(p.kind === "motor" && m[1] === "motor-replace")) fail(`${where}: token ${m[1]} not pinned`);
    }
    for (const f of p.faults) if (f.problemSlug && !PROBLEMS.has(f.problemSlug)) fail(`${where}: unknown problem slug ${f.problemSlug}`);
    if (p.kind === "motor" && !p.decision) fail(`${where}: motor page needs decision`);
    if (p.kind === "door" && !p.parts) fail(`${where}: door page needs parts`);
    if (p.kind === "door" && p.parts) {
      for (const paragraph of p.parts.paragraphs) {
        for (const token of paragraph.match(PATH_TOKEN) ?? []) {
          if (!PARTS_PROSE_LINKS.has(token)) fail(`${where}: parts paragraph references unlisted path ${token}`);
        }
      }
    }
    checkNoPathTokens(where, "directAnswer", p.directAnswer);
    for (const paragraph of p.intro.paragraphs) checkNoPathTokens(where, "intro.paragraphs", paragraph);
    checkNoPathTokens(where, "costIntro", p.costIntro);
    for (const factor of p.costFactors) checkNoPathTokens(where, "costFactors", factor);
    for (const line of p.decision?.repairWhen ?? []) checkNoPathTokens(where, "decision.repairWhen", line);
    for (const line of p.decision?.replaceWhen ?? []) checkNoPathTokens(where, "decision.replaceWhen", line);
    checkNoPathTokens(where, "cta.heading", p.cta.heading);
    checkNoPathTokens(where, "cta.subtitle", p.cta.subtitle);
    for (const f of p.faqs) checkNoPathTokens(where, "faqs[].answer", f.answer);
    for (const r of p.relatedBrands) {
      if (!entityBySlug.has(r)) fail(`${where}: relatedBrands unknown ${r}`);
    }
    for (const l of [...p.services.map((s) => s.href), ...p.relatedServices.map((l) => l.href)]) {
      if (!urls.has(l)) fail(`${where}: href does not resolve ${l}`);
    }
    if (!p.relatedServices.some((l) => l.href === `/${BRAND_HUBS[p.kind].slug}`)) fail(`${where}: relatedServices must link its hub`);
  }

  // Hubs
  for (const h of Object.values(BRAND_HUBS)) {
    if (h.seo.title.length > 60) fail(`hub ${h.slug}: title > 60`);
    if (h.seo.description.length > 160) fail(`hub ${h.slug}: description > 160`);
    if (h.faqs.length < 5) fail(`hub ${h.slug}: < 5 FAQs`);
    if (h.intro.length < 1) fail(`hub ${h.slug}: no intro`);
    if (/\$\s?\d/.test(JSON.stringify(h))) fail(`hub ${h.slug}: literal price`);
    for (const faq of h.faqs) {
      for (const m of faq.answer.matchAll(/\{\{price:([a-z0-9-]+)\}\}/g)) {
        if (!HUB_PRICE_IDS.has(m[1])) fail(`hub ${h.slug}: FAQ token ${m[1]} not one of ${[...HUB_PRICE_IDS].join(", ")}`);
      }
    }
  }

  // Nav
  for (const menu of Object.values(NAV_MENUS)) {
    const hrefs = [
      ...menu.columns.flatMap((c) => c.links.map((l) => l.href)),
      ...(menu.brands ? [...menu.brands.items.map((b) => b.href), menu.brands.allHref] : []),
      menu.footer.href,
    ];
    for (const h of hrefs) if (!urls.has(h)) fail(`nav ${menu.key}: href does not resolve ${h}`);
    for (const b of menu.brands?.items ?? []) if (!entityBySlug.has(b.entity)) fail(`nav ${menu.key}: unknown entity ${b.entity}`);
  }

  if (errors.length) {
    console.error(`✗ ${errors.length} problem(s):\n- ` + errors.join("\n- "));
    process.exit(1);
  }
  console.log(`✓ ${BRAND_ENTITIES.length} entities, ${brandPages.length} brand pages, 2 hubs, ${Object.keys(NAV_MENUS).length} menus OK`);
})();
