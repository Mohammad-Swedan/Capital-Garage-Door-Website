import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import ts from "typescript";
import {
  CTR_TITLES_2026_10,
  buildTitleUpdateBody,
  changedBodyKeys,
  toUpdateBody,
  type AdminPage,
} from "../../../scripts/ctr-titles-2026-10";
import { garageDoorRepairCostPerth } from "../../../content/cost-guides/garage-door-repair-cost-perth";
import { garageDoorSpringReplacementCostPerth } from "../../../content/cost-guides/garage-door-spring-replacement-cost-perth";
import { garageDoorServiceCostPerth } from "../../../content/cost-guides/garage-door-service-cost-perth";

/** Title lengths are counted in code points, like `buildMetadata`'s dev warning. */
const chars = (s: string) => Array.from(s).length;

const TITLES = Object.entries(CTR_TITLES_2026_10);

/* ------------------------------------------------------------------ *
 * The desired-state map
 * ------------------------------------------------------------------ */

test("the CTR pass covers exactly the five striking-distance pages, never the motor-cost page", () => {
  assert.deepEqual(Object.keys(CTR_TITLES_2026_10).sort(), [
    "emergency-garage-door-repairs-perth",
    "garage-door-repair-cost-perth",
    "garage-door-service-cost-perth",
    "garage-door-spring-repair-perth",
    "garage-door-spring-replacement-cost-perth",
  ]);
  assert.equal(CTR_TITLES_2026_10["garage-door-motor-replacement-cost-perth"], undefined);
});

test("every title is 1-60 code points, trimmed, distinct, and free of markdown-escape backslashes", () => {
  for (const [slug, title] of TITLES) {
    assert.ok(chars(title) >= 1 && chars(title) <= 60, `${slug}: ${chars(title)} chars: "${title}"`);
    assert.equal(title, title.trim(), `${slug}: edge whitespace`);
    // The brief's markdown table renders the pipe as "\|"; the real title has a bare "|".
    assert.doesNotMatch(title, /\\/, `${slug}: stray backslash in "${title}"`);
  }
  assert.equal(new Set(Object.values(CTR_TITLES_2026_10)).size, TITLES.length, "two pages share a title");
});

/* ------------------------------------------------------------------ *
 * Lockstep: scripts/sync-seo-fixes.ts SEO_FIXES
 * ------------------------------------------------------------------ */

/**
 * slug → the `title` pinned in scripts/sync-seo-fixes.ts `SEO_FIXES`.
 *
 * The script is READ, not imported: it calls `main()` at module load, which would log in to a CMS. Parsing
 * it leaves that script's run semantics untouched (it is the only place a full sync could revert titles).
 * A real parser rather than a regex, so reformatting the table or adding comments can't fool the test.
 */
function readPinnedTitles(): Map<string, string> {
  const text = readFileSync(new URL("../../../scripts/sync-seo-fixes.ts", import.meta.url), "utf8");
  const source = ts.createSourceFile("sync-seo-fixes.ts", text, ts.ScriptTarget.Latest, true, ts.ScriptKind.TS);

  let table: ts.ObjectLiteralExpression | undefined;
  for (const statement of source.statements) {
    if (!ts.isVariableStatement(statement)) continue;
    for (const declaration of statement.declarationList.declarations) {
      if (
        ts.isIdentifier(declaration.name) &&
        declaration.name.text === "SEO_FIXES" &&
        declaration.initializer &&
        ts.isObjectLiteralExpression(declaration.initializer)
      ) {
        table = declaration.initializer;
      }
    }
  }
  assert.ok(table, "scripts/sync-seo-fixes.ts no longer declares a top-level `const SEO_FIXES = { … }`");

  const nameOf = (name: ts.PropertyName) => (ts.isIdentifier(name) || ts.isStringLiteralLike(name) ? name.text : undefined);
  const pinned = new Map<string, string>();
  for (const entry of table.properties) {
    if (!ts.isPropertyAssignment(entry) || !ts.isObjectLiteralExpression(entry.initializer)) continue;
    const slug = nameOf(entry.name);
    for (const field of entry.initializer.properties) {
      if (!ts.isPropertyAssignment(field) || nameOf(field.name) !== "title") continue;
      assert.ok(
        slug !== undefined && ts.isStringLiteralLike(field.initializer),
        `SEO_FIXES["${slug}"].title is not a plain string literal; extend readPinnedTitles()`,
      );
      pinned.set(slug, field.initializer.text);
    }
  }
  return pinned;
}

test("scripts/sync-seo-fixes.ts SEO_FIXES pins the same five titles, so a full sync can't revert them", () => {
  const pinned = readPinnedTitles();
  assert.ok(pinned.size >= TITLES.length, `parsed only ${pinned.size} SEO_FIXES titles`);
  for (const [slug, title] of TITLES) {
    assert.equal(pinned.get(slug), title, `SEO_FIXES["${slug}"].title`);
  }
});

/* ------------------------------------------------------------------ *
 * Lockstep: content/cost-guides fallbacks (also the importers' source)
 * ------------------------------------------------------------------ */

test("the three cost-guide content fallbacks carry the same titles", () => {
  const guides = [garageDoorRepairCostPerth, garageDoorSpringReplacementCostPerth, garageDoorServiceCostPerth];
  for (const guide of guides) {
    assert.notEqual(CTR_TITLES_2026_10[guide.slug], undefined, `${guide.slug} is not in the CTR map`);
    assert.equal(guide.seo.title, CTR_TITLES_2026_10[guide.slug], `content/cost-guides ${guide.slug} seo.title`);
  }
});

/* ------------------------------------------------------------------ *
 * The PUT body changes seoTitle and nothing else
 * ------------------------------------------------------------------ */

/** A published page with every child collection populated, shaped like GET /api/admin/pages/{id}. */
const PAGE: AdminPage = {
  id: 42,
  templateType: "CostGuidePage",
  routeGroup: "Flat",
  slug: "garage-door-repair-cost-perth",
  title: "Garage Door Repair Cost Perth",
  status: "Published",
  noIndex: false,
  seoTitle: "Old title",
  seoDescription: "Old description, deliberately left alone.",
  heroImageAssetId: 7,
  socialImageAssetId: null,
  data: { hero: { h1: "Garage Door Repair Cost Perth" }, costTable: { intro: "Intro", disclaimer: "" } },
  faqs: [
    { id: 1, question: "Q1", answer: "A1", sortOrder: 0, faqItemId: null },
    { id: 2, question: "Q2", answer: "A2", sortOrder: 1, faqItemId: 9 },
  ],
  relatedLinks: [
    { id: 3, targetPageId: null, staticHref: "/garage-door-repairs-perth", labelOverride: "Repairs", linkGroup: "RelatedServices", sortOrder: 0 },
    { id: 4, targetPageId: 5, staticHref: null, labelOverride: null, linkGroup: "RelatedPages", sortOrder: 1 },
  ],
  pricingRows: [
    { pricingItemId: 11, sortOrder: 0, noteOverride: null },
    { pricingItemId: 12, sortOrder: 1, noteOverride: "note" },
  ],
  reviews: [{ reviewId: 21, sortOrder: 0 }],
  services: [{ serviceId: 31, sortOrder: 0 }],
};

test("the title-only PUT body is a plain round trip of the page with just seoTitle swapped", () => {
  const body = buildTitleUpdateBody(PAGE, "New title");

  assert.equal(body.seoTitle, "New title");
  assert.deepEqual({ ...body, seoTitle: PAGE.seoTitle }, toUpdateBody(PAGE));
  // Every UpdatePageCommand field is sent: the PUT replaces all children, so a missing one would delete them.
  assert.deepEqual(Object.keys(body), [
    "id", "templateType", "slug", "title", "seoTitle", "seoDescription", "noIndex", "status",
    "heroImageAssetId", "socialImageAssetId", "data", "faqs", "relatedLinks", "pricingRows", "reviews", "services",
  ]);
  assert.equal(body.status, "Published");
  assert.equal(body.seoDescription, PAGE.seoDescription);
  assert.equal(body.heroImageAssetId, 7);
  assert.deepEqual(body.data, PAGE.data);
  assert.deepEqual(body.faqs, [
    { question: "Q1", answer: "A1", sortOrder: 0, faqItemId: null },
    { question: "Q2", answer: "A2", sortOrder: 1, faqItemId: 9 },
  ]);
  assert.deepEqual(body.relatedLinks, [
    { targetPageId: null, staticHref: "/garage-door-repairs-perth", labelOverride: "Repairs", linkGroup: "RelatedServices", sortOrder: 0 },
    { targetPageId: 5, staticHref: null, labelOverride: null, linkGroup: "RelatedPages", sortOrder: 1 },
  ]);
  assert.deepEqual(body.pricingRows, [
    { pricingItemId: 11, sortOrder: 0, noteOverride: null },
    { pricingItemId: 12, sortOrder: 1, noteOverride: "note" },
  ]);
  assert.deepEqual(body.reviews, [{ reviewId: 21, sortOrder: 0 }]);
  assert.deepEqual(body.services, [{ serviceId: 31, sortOrder: 0 }]);
});

test("changedBodyKeys names exactly the fields that moved, so a lossy PUT is caught", () => {
  assert.deepEqual(changedBodyKeys(PAGE, { ...PAGE, seoTitle: "New title" }), ["seoTitle"]);
  assert.deepEqual(changedBodyKeys(PAGE, { ...PAGE }), []);
  // A response that lost children or flipped status would be flagged alongside seoTitle.
  assert.deepEqual(
    changedBodyKeys(PAGE, { ...PAGE, seoTitle: "New title", faqs: [], pricingRows: [], status: "Draft" }),
    ["seoTitle", "status", "faqs", "pricingRows"],
  );
});
