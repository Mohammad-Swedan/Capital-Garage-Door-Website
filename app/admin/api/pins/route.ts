import { NextResponse, type NextRequest } from "next/server";
import { cookies } from "next/headers";
import { CMS_TOKEN_COOKIE } from "@/lib/cms/admin";

const CMS_API_URL = process.env.CMS_API_URL ?? "http://localhost:5179";

// Client-callable proxy so the editor's Settings-drawer pin pickers can list the catalogs and
// create new catalog rows inline (the admin endpoints need the httpOnly JWT, attached here
// server-side). Mirrors app/admin/api/faqs/route.ts.
const ENDPOINTS: Record<string, string> = {
  reviews: "/api/admin/reviews?pageSize=200",
  pricing: "/api/admin/pricing-items",
  services: "/api/admin/services",
};

/** The create endpoint (no querystring) per pin type. */
const CREATE_ENDPOINTS: Record<string, string> = {
  reviews: "/api/admin/reviews",
  pricing: "/api/admin/pricing-items",
  services: "/api/admin/services",
};

export async function GET(request: NextRequest) {
  const token = (await cookies()).get(CMS_TOKEN_COOKIE)?.value;
  if (!token) return NextResponse.json({ error: "unauthorized" }, { status: 401 });

  const type = request.nextUrl.searchParams.get("type") ?? "";
  const path = ENDPOINTS[type];
  if (!path) return NextResponse.json({ error: "unknown type" }, { status: 400 });

  const res = await fetch(`${CMS_API_URL}${path}`, {
    headers: { Authorization: `Bearer ${token}` },
    cache: "no-store",
  });
  const data = await res.json().catch(() => null);
  // Normalize paginated ({items}) vs plain-array responses to a flat array.
  const items = Array.isArray(data) ? data : (data?.items ?? []);
  return NextResponse.json(items, { status: res.ok ? 200 : res.status });
}

/* ------------------------------------------------------------------ *
 * POST — create a catalog row and return it, so the pin picker can attach it.
 * Body: { type: "reviews" | "pricing" | "services", ...fields } where the
 * fields are the flat string values from the CatalogPicker's inline create form.
 * Required fields are validated here (mirrors the backend FluentValidation rules)
 * so we fail fast with a 400 rather than proxying an obviously-bad request.
 * ------------------------------------------------------------------ */

function str(v: unknown): string {
  return typeof v === "string" ? v.trim() : "";
}

/** Parse a money/number string to a number, or null when blank/invalid. */
function num(v: unknown): number | null {
  const s = str(v);
  if (!s) return null;
  const n = Number(s.replace(/[^0-9.]/g, ""));
  return Number.isFinite(n) ? n : null;
}

const SOURCE_TO_ENUM: Record<string, string> = {
  google: "Google",
  facebook: "Facebook",
  website: "Website",
};

/** Build the backend create payload for a pin type, or return an error string. */
function buildCreatePayload(
  type: string,
  body: Record<string, unknown>,
): { payload: Record<string, unknown> } | { error: string } {
  switch (type) {
    case "reviews": {
      const customerName = str(body.customerName);
      const text = str(body.text);
      const rating = num(body.rating);
      if (!customerName) return { error: "Customer name is required." };
      if (!text) return { error: "Review text is required." };
      if (rating == null || rating < 1 || rating > 5) {
        return { error: "Rating must be between 1 and 5." };
      }
      // ReviewDate is required by the backend; default to today (YYYY-MM-DD) when omitted.
      const reviewDate = str(body.reviewDate) || new Date().toISOString().slice(0, 10);
      const payload: Record<string, unknown> = {
        customerName,
        rating: Math.round(rating),
        text,
        reviewDate,
        service: str(body.service) || null,
        suburb: str(body.suburb) || null,
        isFeatured: false,
      };
      const source = SOURCE_TO_ENUM[str(body.sourcePlatform).toLowerCase()];
      if (source) payload.sourcePlatform = source;
      return { payload };
    }
    case "services": {
      const name = str(body.name);
      const slug = str(body.slug);
      const shortDescription = str(body.shortDescription);
      const iconName = str(body.iconName) || "Wrench";
      if (!name) return { error: "Service name is required." };
      if (!slug) return { error: "Service slug is required." };
      if (!shortDescription) return { error: "Service short description is required." };
      return {
        payload: {
          slug,
          name,
          shortDescription,
          iconName,
          sortOrder: 0,
        },
      };
    }
    case "pricing": {
      const scenario = str(body.scenario);
      if (!scenario) return { error: "Pricing scenario is required." };
      const priceMin = num(body.priceMin);
      const priceMax = num(body.priceMax);
      if (priceMin != null && priceMax != null && priceMax < priceMin) {
        return { error: "Price max must be greater than or equal to price min." };
      }
      return {
        payload: {
          scenario,
          priceLabel: str(body.priceLabel) || null,
          priceMin,
          priceMax,
          category: str(body.category) || null,
          note: str(body.note) || null,
          // Admin-only note for the AI assistant — never rendered on the public site.
          internalNote: str(body.internalNote) || null,
        },
      };
    }
    default:
      return { error: "unknown type" };
  }
}

export async function POST(request: NextRequest) {
  const token = (await cookies()).get(CMS_TOKEN_COOKIE)?.value;
  if (!token) return NextResponse.json({ error: "unauthorized" }, { status: 401 });

  const body = (await request.json().catch(() => null)) as Record<string, unknown> | null;
  if (!body || typeof body !== "object") {
    return NextResponse.json({ error: "invalid body" }, { status: 400 });
  }

  const type = str(body.type);
  const path = CREATE_ENDPOINTS[type];
  if (!path) return NextResponse.json({ error: "unknown type" }, { status: 400 });

  const built = buildCreatePayload(type, body);
  if ("error" in built) {
    return NextResponse.json({ error: built.error }, { status: 400 });
  }

  const res = await fetch(`${CMS_API_URL}${path}`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(built.payload),
    cache: "no-store",
  });
  const data = await res.json().catch(() => null);
  return NextResponse.json(data, { status: res.status });
}
