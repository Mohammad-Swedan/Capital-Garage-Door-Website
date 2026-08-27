import { test } from "node:test";
import assert from "node:assert/strict";
import { brandPattern, textMentionsBrand } from "../match";
import type { BrandEntity } from "../../../types/brand";

const base: Omit<BrandEntity, "slug" | "name"> = {
  kinds: ["motor"],
  accent: "#000000",
  origin: "Australia",
  dealer: false,
  tags: [],
  summary: "",
  productLines: "",
  sources: [],
};

test("matches the name and aliases as whole words, case-insensitively", () => {
  const bd: BrandEntity = { ...base, slug: "b-and-d", name: "B&D", aliases: ["B & D", "B and D"] };
  assert.equal(textMentionsBrand("Replaced a b&d roller door", bd), true);
  assert.equal(textMentionsBrand("A B and D Panel Lift", bd), true);
  assert.equal(textMentionsBrand("Standard door", bd), false);
});

test("does not match inside other words (ATA vs strata/data)", () => {
  const ata: BrandEntity = { ...base, slug: "ata", name: "ATA" };
  assert.equal(textMentionsBrand("strata complex, data logged", ata), false);
  assert.equal(textMentionsBrand("an ATA GDO-9 opener", ata), true);
});

test("matchTerms replaces the name for ordinary-word brands", () => {
  const nice: BrandEntity = { ...base, slug: "nice", name: "Nice", matchTerms: ["Nice motor", "Nice opener"] };
  assert.equal(textMentionsBrand("a nice clean install", nice), false);
  assert.equal(textMentionsBrand("fitted a Nice motor", nice), true);
  assert.equal(brandPattern(nice).flags.includes("i"), true);
});
