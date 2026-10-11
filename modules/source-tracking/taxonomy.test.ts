import { existsSync, readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";
import {
  CLIENT_ACTION_EVENTS,
  CLIENT_EVENT_TYPES,
  PAGE_GROUP_VOCABULARY,
  RAW_EVENTS,
  SERVER_ONLY_ACTION_TYPES,
  isClientEventType,
} from "./taxonomy";
import { TAXONOMY_VERSION } from "./version";
import { BRIDGE_RULES } from "./client/analytics-bridge";
import { sourceTrackingConfig } from "@/config/source-tracking";

/**
 * <repo>/modules/source-tracking/taxonomy.json — the single source of truth —
 * found by walking up from this file to the repo root (the directory holding .git).
 *
 * In a split-repo target (website/ in its own git repo, see INTEGRATION.md) the
 * JSON sits in the primary repo, so this part has none: the drift checks are
 * skipped there. They still run in the canonical repo, and `module-sync check`
 * proves this file is byte-identical to it. A monorepo (crm-api/ next to
 * website/) without the JSON is broken, so that still fails.
 */
function findTaxonomyJson(): string | null {
  let dir = dirname(fileURLToPath(import.meta.url));
  for (;;) {
    const candidate = resolve(dir, "modules/source-tracking/taxonomy.json");
    if (existsSync(candidate)) return candidate;
    if (existsSync(resolve(dir, ".git"))) {
      if (existsSync(resolve(dir, "crm-api"))) throw new Error("modules/source-tracking/taxonomy.json missing in " + dir);
      return null;
    }
    const parent = dirname(dir);
    if (parent === dir) return null;
    dir = parent;
  }
}

const TAXONOMY_PATH = findTaxonomyJson();

interface Taxonomy {
  taxonomyVersion: number;
  actionTypes: Array<{ key: string; createsAction: boolean }>;
  rawEvents: Array<{ key: string }>;
  pageGroupVocabulary: string[];
}

const taxonomy = (TAXONOMY_PATH ? JSON.parse(readFileSync(TAXONOMY_PATH, "utf8")) : undefined) as Taxonomy;
const sorted = (xs: readonly string[]) => [...xs].sort();

describe.skipIf(!TAXONOMY_PATH)("taxonomy drift (modules/source-tracking/taxonomy.json)", () => {
  it("has the same taxonomy version", () => {
    expect(TAXONOMY_VERSION).toBe(taxonomy.taxonomyVersion);
  });

  it("client action events = action types with createsAction", () => {
    const expected = taxonomy.actionTypes.filter((a) => a.createsAction).map((a) => a.key);
    expect(sorted(CLIENT_ACTION_EVENTS)).toEqual(sorted(expected));
  });

  it("server-only action types = action types without createsAction", () => {
    const expected = taxonomy.actionTypes.filter((a) => !a.createsAction).map((a) => a.key);
    expect(sorted(SERVER_ONLY_ACTION_TYPES)).toEqual(sorted(expected));
    for (const key of expected) expect(isClientEventType(key)).toBe(false);
  });

  it("raw events match", () => {
    expect(sorted(RAW_EVENTS)).toEqual(sorted(taxonomy.rawEvents.map((e) => e.key)));
  });

  it("page-group vocabulary matches", () => {
    expect(sorted(PAGE_GROUP_VOCABULARY)).toEqual(sorted(taxonomy.pageGroupVocabulary));
  });
});

describe("analytics bridge", () => {
  it("every event the analytics bridge forwards is a client event type", () => {
    for (const key of Object.keys(BRIDGE_RULES)) expect(CLIENT_EVENT_TYPES).toContain(key);
  });
});

describe("instance config (config/source-tracking.ts)", () => {
  it("is valid, so tracking is enabled", () => {
    expect(sourceTrackingConfig.errors).toEqual([]);
    expect(sourceTrackingConfig.enabled).toBe(true);
  });

  it("only uses page groups from the vocabulary", () => {
    for (const rule of sourceTrackingConfig.pageGroups.rules) {
      expect(PAGE_GROUP_VOCABULARY).toContain(rule.group);
    }
  });
});
