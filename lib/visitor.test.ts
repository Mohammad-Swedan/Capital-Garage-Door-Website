import { describe, expect, it } from "vitest";
import { isValidVisitorId, VISITOR_COOKIE } from "@/lib/visitor";

describe("visitor id", () => {
  it("uses this site's cookie name", () => {
    expect(VISITOR_COOKIE).toBe("cgd_vid");
  });

  it("accepts only a canonical UUID", () => {
    expect(isValidVisitorId("3f2b8c1e-9a4d-4e7b-8c2f-1a2b3c4d5e6f")).toBe(true);
    expect(isValidVisitorId("3F2B8C1E-9A4D-4E7B-8C2F-1A2B3C4D5E6F")).toBe(true);
    for (const bad of [undefined, null, "", "not-a-uuid", "3f2b8c1e9a4d4e7b8c2f1a2b3c4d5e6f", "3f2b8c1e-9a4d-4e7b-8c2f-1a2b3c4d5e6f;x=1"]) {
      expect(isValidVisitorId(bad)).toBe(false);
    }
  });
});
