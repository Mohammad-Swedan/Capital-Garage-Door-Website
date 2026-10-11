/**
 * Page-group rules engine. Pure: no DOM, no config import — the caller passes
 * the compiled rules so the same code runs in the browser, the Next route and
 * tests.
 *
 * Rules come from the instance file `config/source-tracking.page-groups.json`
 * (see PageGroupRule in ../config.ts for the match types). First match wins;
 * no match → the rules' default ("other").
 */
import type { SourceTrackingConfig } from "../config";
import { isPageGroup, type PageGroup } from "../taxonomy";

/** Path only, lowercased, query/hash stripped, never empty. Trailing slashes are kept (they mean something to the rules). */
export function normalisePath(pathname: string | null | undefined): string {
  if (!pathname) return "/";
  const path = pathname.split(/[?#]/)[0] || "/";
  return (path.startsWith("/") ? path : `/${path}`).toLowerCase();
}

function prefixMatches(path: string, prefix: string): boolean {
  const p = prefix.replace(/\/+$/, "") || "/";
  if (p === "/") return path === "/";
  return path === p || path.startsWith(`${p}/`);
}

export function classifyPageGroup(
  pathname: string | null | undefined,
  pageGroups: SourceTrackingConfig["pageGroups"],
): PageGroup {
  const path = normalisePath(pathname);
  const segments = path.split("/").filter(Boolean);
  const singleSlug = segments.length === 1 && !path.endsWith("/") ? segments[0] : null;

  for (const rule of pageGroups.rules) {
    let hit = false;
    switch (rule.match) {
      case "exact":
        hit = rule.values.includes(path);
        break;
      case "prefix":
        hit = rule.values.some((v) => prefixMatches(path, v));
        break;
      case "regex":
        hit = rule.regexes.some((re) => re.test(path));
        break;
      case "slugPrefix":
        hit =
          singleSlug !== null &&
          rule.values.some((v) => singleSlug.startsWith(v)) &&
          !rule.exclude.includes(singleSlug);
        break;
    }
    if (hit && rule.exclude.length > 0 && rule.match !== "slugPrefix") {
      hit = !rule.exclude.includes(path);
    }
    if (hit) return isPageGroup(rule.group) ? rule.group : "other";
  }

  return isPageGroup(pageGroups.default) ? pageGroups.default : "other";
}
