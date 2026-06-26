import { NextResponse } from "next/server";
import { adminRequest, isAuthenticated } from "@/lib/cms/admin";
import type { CreatePagePayload, RegisterAsset } from "@/lib/cms/import/payload";
import { toServicePagePayloads } from "@/lib/cms/import/service-pages";
import { toComparisonPagePayloads } from "@/lib/cms/import/comparison-pages";
import { toCostGuidePagePayloads } from "@/lib/cms/import/cost-guides";
import { toServiceSuburbPagePayloads } from "@/lib/cms/import/service-suburb-pages";
import { toProblemPagePayloads } from "@/lib/cms/import/problems";
import { toLandingPagePayloads } from "@/lib/cms/import/landing-pages";
import { toCaseStudyPagePayloads } from "@/lib/cms/import/case-studies";
import { toArticlePayloads } from "@/lib/cms/import/articles";

export const dynamic = "force-dynamic";

/**
 * One-time content/*.ts → CMS importer (admin-only, dev tool). POST to run it: creates+publishes a
 * CMS page for every local content item (skipping any whose slug already exists), registering each
 * referenced image as an Asset. Returns a summary. After a clean run, flip the CMS_* flags on.
 */
export async function POST() {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  // Dedupe asset registrations by URL across the whole import.
  const assetCache = new Map<string, number>();
  const registerAsset: RegisterAsset = async (cdnUrl, altText) => {
    const existing = assetCache.get(cdnUrl);
    if (existing) return existing;
    const res = await adminRequest<{ id: number }>("/api/admin/assets", {
      method: "POST",
      body: JSON.stringify({ cdnUrl, altText: altText || "image", width: null, height: null }),
    });
    const id = res.data?.id ?? 0;
    assetCache.set(cdnUrl, id);
    return id;
  };

  const builders: { type: string; build: (r: RegisterAsset) => Promise<CreatePagePayload[]> }[] = [
    { type: "ServicePage", build: toServicePagePayloads },
    { type: "ComparisonPage", build: toComparisonPagePayloads },
    { type: "CostGuidePage", build: toCostGuidePagePayloads },
    { type: "ServiceSuburbPage", build: toServiceSuburbPagePayloads },
    { type: "ProblemPage", build: toProblemPagePayloads },
    { type: "LandingPage", build: toLandingPagePayloads },
    { type: "CaseStudyPage", build: toCaseStudyPagePayloads },
    { type: "Article", build: toArticlePayloads },
  ];

  const created: string[] = [];
  const skipped: string[] = [];
  const errors: unknown[] = [];

  for (const b of builders) {
    let payloads: CreatePagePayload[] = [];
    try {
      payloads = await b.build(registerAsset);
    } catch (e) {
      errors.push({ type: b.type, stage: "build", error: String(e) });
      continue;
    }

    for (const p of payloads) {
      try {
        const res = await adminRequest<{ id: number }>("/api/admin/pages", {
          method: "POST",
          body: JSON.stringify(p),
        });
        if (res.ok) created.push(`${p.routeGroup}/${p.slug}`);
        else if (res.status === 409) skipped.push(`${p.routeGroup}/${p.slug}`);
        else errors.push({ slug: p.slug, type: p.templateType, status: res.status, errors: res.errors });
      } catch (e) {
        errors.push({ slug: p.slug, type: p.templateType, error: String(e) });
      }
    }
  }

  return NextResponse.json({
    created,
    skipped,
    errors,
    counts: { created: created.length, skipped: skipped.length, errors: errors.length, assets: assetCache.size },
  });
}
