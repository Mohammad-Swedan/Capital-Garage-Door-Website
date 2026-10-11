import { describe, expect, it } from "vitest";
import { classifyPageGroup } from "@/modules/source-tracking/classify/page-group";
import { sourceTrackingConfig } from "./source-tracking";

/**
 * INSTANCE TEST — Capital Garage Doors routes against config/source-tracking.page-groups.json.
 * Lives outside modules/ because the module directory is byte-identical across
 * sibling repos and their routes differ. One real route per page type (taken
 * from app/ and the live sitemap, Oct 2026).
 */
describe("page groups", () => {
  const groups = sourceTrackingConfig.pageGroups;
  const cases: Array<[string, string]> = [
    ["/", "home"],
    ["/lp/garage-door-repairs", "lp"],
    ["/blog", "blog"],
    ["/blog/are-garage-door-springs-dangerous", "blog"],
    ["/problems", "problems"],
    ["/problems/garage-door-wont-open", "problems"],
    ["/cost-guides", "cost"],
    ["/calculator", "cost"],
    ["/garage-door-repair-cost-perth", "cost"],
    ["/garage-door-installation-cost-perth", "cost"],
    ["/garage-door-spring-replacement-cost-perth", "cost"],
    ["/service-areas", "service-areas"],
    // Suburb pages; the -perth page is the head-term service page.
    ["/garage-door-repairs-southern-river", "suburbs"],
    ["/garage-door-repairs-canning-vale", "suburbs"],
    ["/garage-door-repairs-success", "suburbs"],
    ["/garage-door-repairs-perth", "services"],
    // Flat CMS slugs: service, door-brand, motor-brand and comparison pages.
    ["/services", "services"],
    ["/roller-door-repairs-perth", "services"],
    ["/emergency-garage-door-repairs-perth", "services"],
    ["/garage-door-motors-perth", "services"],
    ["/garage-door-brands-perth", "services"],
    ["/garage-door-motor-brands-perth", "services"],
    ["/merlin-garage-door-motors-perth", "services"],
    ["/b-and-d-garage-doors-perth", "services"],
    ["/roller-door-vs-sectional-door", "services"],
    ["/quote", "quote"],
    ["/contact", "contact"],
    ["/reviews", "reviews"],
    ["/about", "about"],
    ["/gallery", "gallery"],
    ["/case-studies", "gallery"],
    ["/case-studies/some-job", "gallery"],
    ["/privacy", "legal"],
    ["/terms", "legal"],
    ["/warranty", "legal"],
    ["/warranty-registration", "other"],
    ["/admin/pages", "other"],
    ["/wp-content/uploads/x.jpg", "legacy"],
    ["/garage-door-repairs-perth/", "legacy"],
    ["/a/b/c", "other"],
  ];

  it("config is valid", () => {
    expect(sourceTrackingConfig.errors).toEqual([]);
    expect(sourceTrackingConfig.enabled).toBe(true);
  });

  it.each(cases)("%s → %s", (path, group) => {
    expect(classifyPageGroup(path, groups)).toBe(group);
  });
});
