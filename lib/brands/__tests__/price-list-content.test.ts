import { test } from "node:test";
import assert from "node:assert/strict";
import { PRICE_LIST } from "../../../content/price-list";
import { META_DESCRIPTION_MAX, priceListKeys, renderPriceList } from "../../data/price-list";
import { mergeCostGuideCards } from "../../data/cost-guides";
import { assertNoLiteralPrices, buildPricingRows, resolvePriceRows } from "../pricing";
import { buildSeedRows } from "../../../components/sections/smart-calculator/pricing-data";
import { iconMap } from "../../icons";
import { BUSINESS_ID, WEBSITE_ID, priceListSchemas } from "../../seo/schema";
import type { CmsPublicPricingItem } from "../../cms/pricing-client";
import type { CostGuidePage } from "../../../types/cost-guide";
import type { PriceListContent } from "../../../types/price-list";

/** Meta lengths are counted in code points (an en dash is one character, not three bytes). */
const chars = (s: string) => Array.from(s).length;
const words = (s: string) => s.trim().split(/\s+/).length;

const POLICY = "Estimates & quotes (how we price)";

/** JSON-LD nodes are read loosely in the schema assertions. */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Json = any;

/** Every string in a JSON-shaped value. */
function allStrings(value: unknown, out: string[] = []): string[] {
  if (typeof value === "string") out.push(value);
  else if (Array.isArray(value)) value.forEach((v) => allStrings(v, out));
  else if (value !== null && typeof value === "object") Object.values(value).forEach((v) => allStrings(v, out));
  return out;
}

/** The seeded catalog as the live API returns it, with a fixed updatedAt on every row. */
function liveCatalog(updatedAt = "2026-07-11T16:58:03.7453214+00:00"): CmsPublicPricingItem[] {
  return buildSeedRows().map((row, i) => ({
    id: i + 1,
    scenario: row.scenario,
    priceMin: row.priceMin,
    priceMax: row.priceMax,
    priceLabel: row.priceLabel,
    note: row.note,
    category: row.category,
    includes: row.includes,
    updatedAt,
  }));
}

const rowKeys = () => PRICE_LIST.groups.flatMap((group) => group.rows.map((row) => row.key));

/** A deep copy of the content to break in one place. */
const copyOf = (): PriceListContent => JSON.parse(JSON.stringify(PRICE_LIST));

test("completeness: every catalog scenario except the pricing policy is exactly one price-list row", () => {
  const seedNames = buildSeedRows().map((row) => row.scenario);
  assert.equal(seedNames.length, 27, "the seeded catalog has 27 rows");
  const expected = seedNames.filter((name) => name !== POLICY);

  const keys = rowKeys();
  assert.equal(PRICE_LIST.groups.length, 7);
  assert.equal(keys.length, 26);
  // resolvePriceRows labels each row with its baked scenario name, the name the live row carries.
  const names = resolvePriceRows(keys, []).map((row) => row.label);
  assert.equal(new Set(names).size, names.length, "a scenario appears in two rows");
  assert.deepEqual([...names].sort(), [...expected].sort());
});

test("the groups, anchors and row links are the agreed ones", () => {
  assert.deepEqual(
    PRICE_LIST.groups.map((group) => group.id),
    ["new-doors", "repairs", "springs-cables", "motors", "servicing", "commercial", "after-hours"],
  );
  for (const group of PRICE_LIST.groups) {
    assert.match(group.id, /^[a-z][a-z0-9-]*$/);
    assert.ok(group.intro.trim().length > 0, `#${group.id} has no intro`);
    if (group.guide) assert.match(group.guide.href, /^\/[a-z0-9]/, `#${group.id} guide link`);
    for (const row of group.rows) {
      assert.match(row.href, /^\/[a-z0-9]/, `${row.key} href must be a site path: ${row.href}`);
    }
  }
  const hrefOf = new Map(PRICE_LIST.groups.flatMap((group) => group.rows.map((row) => [row.key, row.href])));
  assert.equal(hrefOf.get("new-standard"), "/garage-door-installation-cost-perth");
  assert.equal(hrefOf.get("spring-x2"), "/garage-door-spring-replacement-cost-perth");
  assert.equal(hrefOf.get("spring-refit"), "/garage-door-spring-repair-perth");
  assert.equal(hrefOf.get("after-hours"), "/emergency-garage-door-repairs-perth");
  const commercial = PRICE_LIST.groups.find((group) => group.id === "commercial");
  assert.equal(commercial?.guide?.href, "/commercial-garage-doors-perth");
});

test("no string in content/price-list.ts carries a literal price", () => {
  for (const s of allStrings(PRICE_LIST)) {
    assert.doesNotThrow(() => assertNoLiteralPrices(s, "content/price-list.ts"), s);
  }
});

test("every token in the content resolves, offline", () => {
  assert.doesNotThrow(() => resolvePriceRows(priceListKeys(PRICE_LIST), []));
  const list = renderPriceList(PRICE_LIST, []);
  assert.doesNotMatch(JSON.stringify(list), /\{\{/, "an unrendered token reached the page");
  assert.doesNotMatch(allStrings(list).join("\n"), /\{\{|\}\}|price:/, "a token fragment reached the page");
  assert.equal(list.source, "baked");
  // Baked pricing-data.ts figures stand in for the live catalog.
  assert.match(list.directAnswer, /\$240–\$280/);
  assert.match(list.directAnswer, /\$3,000–\$5,000/);
});

test("rendered title is ≤60 characters and the description ≤160", () => {
  const list = renderPriceList(PRICE_LIST, []);
  assert.equal(list.title, "Garage Door Prices Perth | 2026 Price List & Cost Guides");
  assert.ok(chars(list.title) <= 60, `title is ${chars(list.title)} chars`);
  assert.equal(list.hero.h1, "Garage Door Prices Perth — 2026 Price List");
  assert.equal(list.hero.eyebrow, "Updated Sep 2026 · Perth price list");
  assert.ok(chars(list.metaDescription) <= META_DESCRIPTION_MAX, `description is ${chars(list.metaDescription)} chars`);
  // Offline the priced template fits, so it is used rather than the static fallback.
  assert.notEqual(list.metaDescription, PRICE_LIST.seo.descriptionFallback);
  assert.match(list.metaDescription, /^Garage door prices in Perth/);
  assert.ok(chars(PRICE_LIST.seo.descriptionFallback) <= META_DESCRIPTION_MAX);
  assert.doesNotMatch(PRICE_LIST.seo.descriptionFallback, /\{\{/);
});

test("the live catalog renders the same way and fits the same limits", () => {
  const list = renderPriceList(PRICE_LIST, liveCatalog());
  assert.equal(list.source, "catalog");
  assert.ok(chars(list.title) <= 60);
  assert.ok(chars(list.metaDescription) <= META_DESCRIPTION_MAX);
  assert.equal(list.groups.flatMap((group) => group.rows).length, 26);
  assert.equal(list.policyNote, buildSeedRows().find((row) => row.scenario === POLICY)?.note);
});

test("copy shape: direct answer, FAQs, factors and repair vs replace", () => {
  const list = renderPriceList(PRICE_LIST, []);
  const answerWords = words(list.directAnswer);
  assert.ok(answerWords >= 60 && answerWords <= 90, `direct answer is ${answerWords} words`);
  assert.match(list.directAnswer, /confirmed with a fixed quote before any work starts\.$/);

  assert.deepEqual(
    list.faqs.map((faq) => faq.question),
    [
      "What are typical garage door prices in Perth?",
      "How much does a new garage door cost in Perth?",
      "How much should I budget for a new garage door?",
      "How much does it cost to replace a garage door in Australia?",
      "How much does a B&D garage door cost?",
      "How much does garage door repair cost in Perth?",
      "Do after-hours call-outs cost more?",
      "Are these prices fixed?",
    ],
  );
  for (const faq of list.faqs) {
    const n = words(faq.answer);
    assert.ok(n >= 40 && n <= 90, `"${faq.question}" answer is ${n} words`);
    assert.doesNotMatch(faq.answer, /(^|\s)\/[a-z]/, `"${faq.question}" answer holds a raw URL path`);
  }
  // The budget FAQ adds door, motor and smart control; the Australia FAQ uses the refit prices.
  const source = (q: string) => PRICE_LIST.faqs.find((faq) => faq.question.startsWith(q))?.answer ?? "";
  for (const key of ["new-standard", "motor-replace", "wifi"]) {
    assert.ok(source("How much should I budget").includes(`{{price:${key}}}`), key);
  }
  for (const key of ["roller-reinstall", "sectional-reinstall"]) {
    assert.ok(source("How much does it cost to replace").includes(`{{price:${key}}}`), key);
  }

  assert.deepEqual(
    list.factors.items.map((factor) => factor.icon),
    ["Ruler", "Layers", "Cpu", "Settings", "Truck", "Siren"],
  );
  for (const factor of list.factors.items) assert.ok(iconMap[factor.icon], `icon ${factor.icon} is not in iconMap`);
  assert.ok(list.repairVsReplace.repairWhen.length > 0 && list.repairVsReplace.replaceWhen.length > 0);
});

test("claims: dealer wording only for B&D, and no licence, insurance, rating or warranty-term claims", () => {
  const copy = allStrings(PRICE_LIST).join("\n");
  assert.doesNotMatch(copy, /licen[cs]ed|insured|#1|\bbest (?:in|garage|price)|years? (?:of experience|in business)|\d+\s*-?\s*years?\b|star rating|reviews?\b|warranty/i);
  for (const match of copy.matchAll(/[^.]*\bdealer\b[^.]*/gi)) {
    assert.match(match[0], /B&D/, `dealer wording outside the B&D answer: ${match[0]}`);
  }
  // Before dispatch only the surcharge can be confirmed; the job price comes after diagnosis, on site.
  for (const sentence of copy.split(/(?<=[.!?])\s+/)) {
    if (/\b(sent|dispatch)/i.test(sentence)) {
      assert.doesNotMatch(sentence, /\b(total|full price|exact price)\b/i, `pre-dispatch price promise: ${sentence}`);
    }
  }
});

test("the table price is the row's resolved price: a range beats a label, as on every other page", () => {
  const catalog = liveCatalog();
  const offtrack = catalog.find((row) => row.scenario === "Door off track / stuck")!;
  offtrack.priceMin = 450;
  offtrack.priceMax = 800;
  offtrack.priceLabel = "Call for a price";
  const list = renderPriceList(PRICE_LIST, catalog);
  const row = list.groups.flatMap((group) => group.rows).find((r) => r.id === "offtrack")!;
  assert.equal(row.price, "$450–$800");
  assert.equal(row.price, buildPricingRows(["offtrack"], catalog)[0].price);
  assert.equal(row.label, "Door off its tracks or jammed");
  assert.equal(row.href, "/problems/garage-door-off-track");
});

test("lastUpdated and year follow the newest shown catalog row, never an unshown one", () => {
  // Every shown row older than reviewedAt: the review date stands.
  assert.equal(renderPriceList(PRICE_LIST, liveCatalog()).lastUpdated, PRICE_LIST.reviewedAt);

  const catalog = liveCatalog();
  catalog.find((row) => row.scenario === "Broken springs (×2)")!.updatedAt = "2027-01-15T09:00:00+00:00";
  const list = renderPriceList(PRICE_LIST, catalog);
  assert.equal(list.lastUpdated, "2027-01-15");
  assert.equal(list.year, 2027);
  assert.equal(list.title, "Garage Door Prices Perth | 2027 Price List & Cost Guides");
  assert.equal(list.hero.eyebrow, "Updated Jan 2027 · Perth price list");

  const extra = [
    ...liveCatalog(),
    { id: 99, scenario: "Garage door painting", priceMin: 100, priceMax: 200, updatedAt: "2028-03-01T00:00:00+00:00" },
  ];
  assert.equal(renderPriceList(PRICE_LIST, extra).lastUpdated, PRICE_LIST.reviewedAt);
});

test("an over-long description template falls back to the static description", () => {
  const content = copyOf();
  content.seo.descriptionTemplate = `${content.seo.descriptionTemplate} ${"More words to push it over the limit. ".repeat(3)}`;
  assert.equal(renderPriceList(content, []).metaDescription, content.seo.descriptionFallback);
});

test("content bugs throw instead of shipping", () => {
  const literal = copyOf();
  literal.directAnswer = "A spring is $240.";
  assert.throws(() => renderPriceList(literal, []), /Literal price/);

  const duplicate = copyOf();
  duplicate.groups[1].rows.push({ key: "cable", href: "/garage-door-repair-cost-perth" });
  assert.throws(() => renderPriceList(duplicate, []), /two rows/);

  const unknown = copyOf();
  unknown.faqs[0].answer = "It costs {{price:not-a-key}}.";
  assert.throws(() => renderPriceList(unknown, []), /Unknown pricing key/);

  const malformed = copyOf();
  malformed.directAnswer = "It costs {{price:New-Standard}}.";
  assert.throws(() => renderPriceList(malformed, []), /unrendered/);

  const badDate = copyOf();
  badDate.reviewedAt = "30/09/2026";
  assert.throws(() => renderPriceList(badDate, []), /reviewedAt/);

  const longFallback = copyOf();
  longFallback.seo.descriptionFallback = "x".repeat(161);
  assert.throws(() => renderPriceList(longFallback, []), /descriptionFallback/);
});

test("priceListSchemas: a CollectionPage plus a Service whose Offers are priced from numbers only", () => {
  const list = renderPriceList(PRICE_LIST, liveCatalog());
  const [page, service] = priceListSchemas({
    path: "/cost-guides",
    title: list.title,
    description: list.metaDescription,
    year: list.year,
    lastUpdated: list.lastUpdated,
    groups: list.groups,
    guides: [{ title: "Garage Door Repair Cost Perth", href: "/garage-door-repair-cost-perth" }],
  }) as unknown as [Json, Json];

  assert.equal(page["@type"], "CollectionPage");
  assert.equal(page["@id"], "https://capitalgaragedoors.com.au/cost-guides#webpage");
  assert.deepEqual(page.isPartOf, { "@id": WEBSITE_ID });
  assert.deepEqual(page.about, { "@id": BUSINESS_ID });
  assert.equal(page.dateModified, list.lastUpdated);
  assert.deepEqual(page.mainEntity, { "@id": "https://capitalgaragedoors.com.au/cost-guides#price-list" });
  assert.deepEqual(page.speakable.cssSelector, ["h1", "#direct-answer"]);
  assert.equal(page.hasPart[0].url, "https://capitalgaragedoors.com.au/garage-door-repair-cost-perth");

  assert.equal(service["@type"], "Service");
  assert.equal(service.provider["@id"], BUSINESS_ID);
  assert.deepEqual(service.areaServed, { "@type": "City", name: "Perth" });
  const catalog = service.hasOfferCatalog;
  assert.equal(catalog["@id"], page.mainEntity["@id"]);
  assert.equal(catalog.itemListElement.length, 7);

  const offers = catalog.itemListElement.flatMap((group: { itemListElement: object[] }) => group.itemListElement);
  assert.equal(offers.length, 26);
  const offer = (name: string) => offers.find((o: { name: string }) => o.name === name);
  for (const o of offers) {
    assert.equal(o.priceCurrency, "AUD");
    assert.match(o.url, /^https:\/\/capitalgaragedoors\.com\.au\//);
    assert.equal(o.itemOffered["@type"], "Service");
  }
  // A single price is `price`; a range is minPrice/maxPrice.
  assert.deepEqual(offer("Safety inspection & written report").priceSpecification, {
    "@type": "PriceSpecification",
    priceCurrency: "AUD",
    price: 120,
  });
  const newDoor = offer("New garage door — standard size, supplied & installed");
  assert.equal(newDoor.priceSpecification.minPrice, 3000);
  assert.equal(newDoor.priceSpecification.maxPrice, 5000);
  assert.match(newDoor.description, /^\$3,000–\$5,000 — /);
  // Label-only rows are described, never parsed into numbers.
  for (const name of [
    "Full service & tune-up",
    "Worn hinges, rollers or wheels",
    "Extra or replacement remote",
    "After-hours or emergency call-out (on top of the job)",
  ]) {
    assert.ok(offer(name), name);
    assert.equal(offer(name).priceSpecification, undefined, name);
    assert.ok(offer(name).description.length > 0);
  }
});

test("cost-guide cards: static guides win a slug clash, and the five guides lead in order", () => {
  const guide = (slug: string, h1: string): CostGuidePage =>
    ({ slug, hero: { h1, subtitle: `${h1} subtitle` }, updatedAt: "2026-08-01" }) as CostGuidePage;
  const cards = mergeCostGuideCards(
    [
      guide("garage-door-service-cost-perth", "Service"),
      guide("garage-door-gate-cost-perth", "Other"),
      guide("garage-door-motor-replacement-cost-perth", "Motor"),
      guide("garage-door-installation-cost-perth", "CMS installation"),
      guide("garage-door-repair-cost-perth", "Repair"),
      guide("garage-door-spring-replacement-cost-perth", "Springs"),
    ],
    [guide("garage-door-installation-cost-perth", "Static installation")],
  );
  assert.deepEqual(
    cards.map((card) => card.title),
    ["Static installation", "Repair", "Springs", "Motor", "Service", "Other"],
  );
  assert.deepEqual(cards[0], {
    href: "/garage-door-installation-cost-perth",
    title: "Static installation",
    description: "Static installation subtitle",
    updatedAt: "2026-08-01",
  });
});
