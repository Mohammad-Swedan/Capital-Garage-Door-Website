import { test } from "node:test";
import assert from "node:assert/strict";
import { pickBrandCaseStudies } from "../case-study-pick";
import type { BrandEntity } from "../../../types/brand";
import type { CaseStudyPage } from "../../../types/case-study";

const baseEntity: Omit<BrandEntity, "slug" | "name"> = {
  kinds: ["motor"],
  accent: "#000000",
  origin: "Australia",
  dealer: false,
  tags: [],
  summary: "",
  productLines: "",
  sources: [],
};
const merlin: BrandEntity = { ...baseEntity, slug: "merlin", name: "Merlin" };

function cs(slug: string, over: Partial<CaseStudyPage> = {}): CaseStudyPage {
  return {
    slug,
    pageType: "case-study",
    title: `Job ${slug}`,
    subtitle: "",
    service: "Repairs",
    suburb: "Perth",
    doorType: "Sectional",
    jobType: "Repair",
    result: "",
    summary: { problem: "", diagnosis: "", solution: "" },
    problem: { intro: "", points: [] },
    diagnosis: { intro: "", points: [] },
    solution: { intro: "", points: [] },
    images: [{ src: "https://jadara-hub.b-cdn.net/x.webp", alt: "", caption: "" }],
    partsUsed: [],
    relatedServices: [],
    faqs: [],
    seo: { title: "", description: "" },
    updatedAt: "2026-01-01",
    ...over,
  };
}

test("hand-picked slugs win, in manifest order, without needing a brand mention", () => {
  const all = [cs("a"), cs("b"), cs("c")];
  const picked = pickBrandCaseStudies(all, merlin, ["c", "a"]);
  assert.deepEqual(picked.map((p) => p.slug), ["c", "a"]);
});

test("unknown hand-picked slugs are silently skipped", () => {
  const all = [cs("a")];
  const picked = pickBrandCaseStudies(all, merlin, ["ghost", "a"]);
  assert.deepEqual(picked.map((p) => p.slug), ["a"]);
});

test("hand-picked entries without a real (http) photo are excluded", () => {
  const all = [cs("a", { images: [{ src: "/local.webp", alt: "", caption: "" }] }), cs("b")];
  const picked = pickBrandCaseStudies(all, merlin, ["a", "b"]);
  assert.deepEqual(picked.map((p) => p.slug), ["b"]);
});

test("fallback text-match scans partsUsed and solution points", () => {
  const all = [
    cs("parts", { partsUsed: ["Merlin MT100EVO opener"] }),
    cs("points", { solution: { intro: "", points: ["Fitted a new Merlin belt drive"] } }),
    cs("none"),
  ];
  const picked = pickBrandCaseStudies(all, merlin);
  assert.deepEqual(picked.map((p) => p.slug).sort(), ["parts", "points"]);
});

test("fallback respects matchTerms — ordinary-word brands never match prose", () => {
  const nice: BrandEntity = { ...baseEntity, slug: "nice", name: "Nice", matchTerms: ["Nice motor"] };
  const all = [cs("prose", { title: "A nice clean roller door install" }), cs("real", { partsUsed: ["Nice motor unit"] })];
  const picked = pickBrandCaseStudies(all, nice);
  assert.deepEqual(picked.map((p) => p.slug), ["real"]);
});

test("fallback applies the photo filter and both modes cap at 3", () => {
  const noPhoto = cs("np", { title: "Merlin job", images: [] });
  const matched = ["m1", "m2", "m3", "m4"].map((s) => cs(s, { title: `Merlin job ${s}` }));
  assert.equal(pickBrandCaseStudies([noPhoto, ...matched], merlin).length, 3);
  assert.equal(pickBrandCaseStudies(matched, merlin, ["m1", "m2", "m3", "m4"]).length, 3);
});

test("empty when nothing matches and no slugs are given", () => {
  assert.deepEqual(pickBrandCaseStudies([cs("a"), cs("b")], merlin), []);
});
