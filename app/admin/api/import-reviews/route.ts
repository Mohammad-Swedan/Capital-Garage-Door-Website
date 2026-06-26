import { NextResponse } from "next/server";
import { adminRequest, isAuthenticated } from "@/lib/cms/admin";
import { reviews as contentReviews } from "@/content/reviews";

export const dynamic = "force-dynamic";

/**
 * One-time reviews importer (admin-only dev tool) — the reviews counterpart to
 * app/admin/api/import-catalogs. POST to run it: seeds the CMS Reviews table from the local
 * content/reviews.ts module so the /reviews page can read from the CMS (GET /api/reviews).
 * It is idempotent — it GETs existing reviews first and skips ones that already exist, keyed on
 * customerName + text. After a clean run, flip CMS_REVIEWS=on in .env.local.
 */

interface AdminReviewRow {
  id: number;
  customerName: string;
  rating: number;
  text: string;
  reviewDate: string;
  service?: string | null;
  suburb?: string | null;
  sourcePlatform?: string | null;
  isFeatured: boolean;
}

interface AdminReviewsPage {
  items: AdminReviewRow[];
  pageNumber: number;
  pageSize: number;
  totalCount: number;
  totalPages: number;
}

// Map the content review `source` string to the CMS ReviewSourcePlatform enum NAME, which the API
// accepts/returns as a string (StringEnumConverter). Unknown / empty values are omitted so the
// backend stores null rather than rejecting the create.
const SOURCE_TO_ENUM: Record<string, string> = {
  google: "Google",
  facebook: "Facebook",
  website: "Website",
};

function mapSource(source: string | undefined): string | undefined {
  if (!source) return undefined;
  return SOURCE_TO_ENUM[source.trim().toLowerCase()];
}

/** Stable idempotency key: customer name + the (trimmed) review text. */
function reviewKey(customerName: string, text: string): string {
  return `${customerName.trim().toLowerCase()}::${text.trim().toLowerCase()}`;
}

export async function POST() {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const created: string[] = [];
  const skipped: string[] = [];
  const errors: unknown[] = [];

  // Build the set of existing reviews (keyed customerName+text) by paging through the admin list.
  const existingKeys = new Set<string>();
  try {
    let pageNumber = 1;
    const pageSize = 100;
    // Guard against runaway loops; the pool is small.
    for (let guard = 0; guard < 100; guard++) {
      const res = await adminRequest<AdminReviewsPage>(
        `/api/admin/reviews?pageNumber=${pageNumber}&pageSize=${pageSize}`,
      );
      if (!res.ok || !res.data) break;
      for (const row of res.data.items) {
        existingKeys.add(reviewKey(row.customerName, row.text));
      }
      if (pageNumber >= res.data.totalPages || res.data.items.length === 0) break;
      pageNumber++;
    }
  } catch (e) {
    errors.push({ stage: "list-existing", error: String(e) });
  }

  for (const review of contentReviews) {
    const key = reviewKey(review.customerName, review.text);
    try {
      if (existingKeys.has(key)) {
        skipped.push(`review/${review.id}`);
        continue;
      }

      const payload: Record<string, unknown> = {
        customerName: review.customerName,
        rating: review.rating,
        text: review.text,
        // content `date` is already an ISO date "YYYY-MM-DD" — matches the backend DateOnly.
        reviewDate: review.date,
        service: review.service || null,
        suburb: review.suburb || null,
        isFeatured: review.featured ?? false,
      };
      const sourcePlatform = mapSource(review.source);
      if (sourcePlatform) payload.sourcePlatform = sourcePlatform;

      const res = await adminRequest<AdminReviewRow>("/api/admin/reviews", {
        method: "POST",
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        created.push(`review/${review.id}`);
        existingKeys.add(key);
      } else if (res.status === 409) {
        skipped.push(`review/${review.id}`);
      } else {
        errors.push({ stage: "review", id: review.id, status: res.status, errors: res.errors });
      }
    } catch (e) {
      errors.push({ stage: "review", id: review.id, error: String(e) });
    }
  }

  return NextResponse.json({
    created,
    skipped,
    errors,
    counts: {
      created: created.length,
      skipped: skipped.length,
      errors: errors.length,
      total: contentReviews.length,
    },
  });
}
