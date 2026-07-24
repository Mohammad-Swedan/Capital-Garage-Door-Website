/**
 * Corrects fabricated prices across the CMS blog posts.
 *
 * The 2026-07-24 SEO review found that 7 of the 11 published blog posts quote prices
 * that contradict the live price list (`components/sections/smart-calculator/pricing-data.ts`
 * → CMS `PricingItems`), always LOWER, and in the case of springs they contradict each
 * other across three posts. Customers were arriving quoting roughly half the real price
 * from pages that rank — e.g. `/blog/garage-door-motor-replacement-cost-perth` sat at
 * position 19 quoting $450–$1,200 for a job the price list prices at $770–$990.
 *
 * CLAUDE.md's rule is that pricing has ONE source of truth. Every replacement below is
 * taken from a PricingItems scenario:
 *
 *   Broken spring (single)                    $240–$280
 *   Broken springs (×2)                       $440–$550
 *   Springs (×3) / (×4)                       $660–$770 / $880–$1,000
 *   Spring re-fit / re-tension                $280–$330
 *   Cable snapped or off the drum             $280–$550
 *   Motor / opener not working (repair)       $380–$490
 *   Motor / opener replacement                $770–$990   (incl. remotes)
 *   WiFi / smart control                      $280–$380
 *   Door damaged (panel / section)            $550–$1,100 (repair OR replace)
 *   Door off track / stuck                    $440–$770
 *   Safety sensors / photo eyes               $150–$300
 *   New garage door — standard (supply&install) $3,000–$5,000 (roller or sectional)
 *   New door — commercial / custom            $5,000–$15,000
 *   Service / tune-up                         from $140 + parts
 *   Safety check-up / inspection              $120
 *   After-hours / emergency call-out          +$500
 *
 * Figures with no PricingItems backing (panel surcharges, insulation extras) are replaced
 * with "quoted on inspection" rather than invented.
 *
 * Mechanism: exact-substring replacement over the serialised `data` blob and the `faqs`
 * array. That makes it path-independent and naturally idempotent — a replacement whose
 * `from` string is already gone is reported as "already applied" and skipped. Run it twice
 * and the second run is a no-op.
 *
 * Pre-flight (no auth):  CMS_API_URL=https://cgd.runasp.net npx tsx scripts/fix-blog-pricing.ts --check
 * Local CMS (default):   npx tsx scripts/fix-blog-pricing.ts
 * Production (explicit): CMS_API_URL=https://cgd.runasp.net CMS_ADMIN_PASSWORD=… npx tsx scripts/fix-blog-pricing.ts
 * Dry run (needs auth):  add --dry
 *
 * Run `--check` first. It reads the anonymous public resolve endpoint and confirms every
 * `from` string still exists verbatim, which is the failure mode that matters: if upstream
 * copy has been edited, the replacement silently no-ops and a wrong price stays live.
 */

const CMS_API_URL = (process.env.CMS_API_URL ?? "http://localhost:5179").replace(/\/$/, "");
const ADMIN_EMAIL = process.env.CMS_ADMIN_EMAIL ?? "admin@capitalgaragedoor.local";
const ADMIN_PASSWORD = process.env.CMS_ADMIN_PASSWORD ?? "Admin#12345";
const DRY_RUN = process.argv.includes("--dry");
const CHECK_ONLY = process.argv.includes("--check");

interface Fix {
  from: string;
  to: string;
}

/**
 * slug → ordered exact-substring replacements. Strings copied verbatim from the live payloads.
 * Exported so the match-check can be run against the anonymous public resolve endpoint
 * (no admin credentials needed) before anyone runs the write pass.
 */
export const FIXES: Record<string, Fix[]> = {
  "how-long-do-garage-door-springs-last": [
    {
      from:
        "As a guide, garage door spring replacement in Perth typically ranges from around $180 to $450 for a standard single-spring job, and roughly $300 to $600 where two torsion springs are replaced together.",
      to:
        "As a guide, garage door spring replacement in Perth is $240 to $280 for a standard single-spring job, and $440 to $550 where two torsion springs are replaced together. Larger or heavier doors needing three or four springs run $660 to $1,000.",
    },
    {
      from:
        "As a guide, expect around $180 to $450 for a single-spring replacement and roughly $300 to $600 for a matched pair of torsion springs. The final price depends on spring type, cycle rating, door weight and your suburb.",
      to:
        "Expect $240 to $280 for a single-spring replacement and $440 to $550 for a matched pair. Larger or heavier doors needing three or four springs run $660 to $1,000. After-hours attendance adds $500.",
    },
  ],

  "garage-door-spring-types-torsion-vs-extension": [
    {
      from: "Single torsion spring, supplied and fitted: roughly AUD $180–$350 as a guide.",
      to: "Single torsion spring, supplied and fitted: $240–$280.",
    },
    {
      from: "Pair of torsion springs (recommended): roughly AUD $300–$500.",
      to: "Pair of torsion springs (recommended): $440–$550.",
    },
    {
      // The price list prices two springs as one scenario and does not split by type.
      from: "Pair of extension springs, supplied and fitted: roughly AUD $150–$350.",
      to: "Pair of extension springs, supplied and fitted: $440–$550.",
    },
  ],

  "are-garage-door-springs-dangerous": [
    {
      from:
        "As a rough guide, replacing a single torsion spring typically runs from around $200 to $400, while replacing a pair - which is recommended, since the second spring is usually not far behind - often falls between $300 and $550. Extension springs are usually a little less.",
      to:
        "Replacing a single torsion spring is $240 to $280, while replacing a pair - which is recommended, since the second spring is usually not far behind - is $440 to $550. Larger doors needing three or four springs run $660 to $1,000, and after-hours attendance adds $500.",
    },
  ],

  "garage-door-cable-repair-signs-and-cost": [
    {
      from:
        "In Perth, expect roughly $150 to $280 to replace both cables, or about $300 to $550 when the springs are done at the same time.",
      to:
        "In Perth, lift cables replaced or re-seated and re-tensioned is $280 to $550; if a spring has broken as well, add $240 to $280 for one spring or $440 to $550 for a pair.",
    },
    {
      from:
        "Re-spooling a cable that has come off the drum (undamaged hardware): around $120 to $200, mostly call-out and labour.",
      to:
        "Re-spooling a cable that has come off the drum (undamaged hardware): $280 to $550, at the lower end of that range when the hardware is sound.",
    },
    {
      from:
        "Garage door cable replacement cost for both cables on a single door: around $150 to $280 fitted.",
      to: "Garage door cable replacement cost for both cables on a single door: $280 to $550 fitted.",
    },
    {
      from: "Cables plus a spring replaced together (the most common repair): around $300 to $550.",
      to:
        "Cables plus a spring replaced together (the most common repair): $280 to $550 for the cables, plus $240 to $280 for a single spring or $440 to $550 for a pair.",
    },
    {
      from:
        "As an indicative guide, replacing both cables on a single door runs around $150 to $280 fitted, while replacing cables and a spring together is roughly $300 to $550. The final price depends on door size, spring type and whether it is an after-hours call-out.",
      to:
        "Replacing both cables on a single door is $280 to $550 fitted. If a spring is replaced at the same time, add $240 to $280 for one spring or $440 to $550 for a pair. After-hours call-outs add $500.",
    },
  ],

  "garage-door-panel-replacement-cost": [
    {
      from:
        "In Perth, garage door panel replacement cost typically runs from about $350 to $900 to supply and fit a single sectional panel, while a full sectional door replacement is usually $1,200 to $3,500 or more depending on size, material and insulation.",
      to:
        "In Perth, repairing or replacing a damaged panel or section is $550 to $1,100 including the hardware, while a full door replacement supplied and installed - old door removal, new tracks and hardware included - is $3,000 to $5,000.",
    },
    {
      from:
        "As a guide, expect to pay roughly $350 to $900 to supply and fit a single replacement panel on a standard Colorbond sectional door in Perth. Larger double-width panels, timber-look or insulated panels, and custom colours sit at the upper end.",
      to:
        "As a guide, expect $550 to $1,100 to repair or replace a single damaged panel or section on a standard Colorbond sectional door in Perth, including the hardware. Larger double-width panels, timber-look or insulated panels, and custom colours sit at the upper end.",
    },
    { from: "Single standard sectional panel: $350 to $900", to: "Single standard sectional panel: $550 to $1,100" },
    {
      from: "Double-width or insulated panel: $600 to $1,200",
      to: "Double-width or insulated panel: $550 to $1,100, at the upper end of the range",
    },
    {
      from: "Two to three matching panels: $900 to $2,000",
      to: "Two to three matching panels: priced per panel at $550 to $1,100 each",
    },
    {
      from: "Full sectional door replacement: $1,200 to $3,500+ (size, material, insulation)",
      to: "Full door replacement, supplied and installed: $3,000 to $5,000 (custom and designer doors $5,000 to $15,000)",
    },
    {
      // No PricingItems scenario covers a colour/discontinued surcharge — don't invent one.
      from: "Custom-colour or discontinued-panel surcharge: add $150 to $400 plus lead time",
      to: "Custom-colour or discontinued panels: quoted on inspection, plus lead time",
    },
    {
      from:
        "A shallow dent in a steel panel can sometimes be pushed or pulled out, filled and repainted, and a minor dented garage door repair cost can be as low as $150 to $350.",
      to:
        "A shallow dent in a steel panel can sometimes be pushed or pulled out, filled and repainted, which sits at the lower end of the $550 to $1,100 damaged-panel range.",
    },
    {
      from:
        "As a guide, a single sectional panel supplied and fitted in Perth typically costs around $350 to $900, with insulated, double-width or custom-colour panels costing more.",
      to:
        "A single damaged panel or section repaired or replaced in Perth is $550 to $1,100 including hardware, with insulated, double-width or custom-colour panels at the upper end.",
    },
    {
      from:
        "A shallow dent repair can cost as little as $150 to $350, which is cheaper than a new panel.",
      to:
        "A shallow dent repair sits at the lower end of the $550 to $1,100 damaged-panel range, below a full panel replacement.",
    },
  ],

  "residential-garage-doors-perth-buying-guide": [
    {
      from:
        "As a guide, expect roughly $1,500-$2,500 for a single sectional door installed and $2,200-$3,800 for a double, with insulation and premium finishes adding more.",
      to:
        "As a guide, expect $3,000-$5,000 for a standard new door supplied and installed - roller or sectional, including removal of the old door, new tracks and hardware - with custom, designer and commercial doors running $5,000-$15,000.",
    },
    {
      from: "Single roller door, installed: roughly $1,200-$2,200",
      to: "Standard roller door, supplied and installed: $3,000-$5,000",
    },
    {
      from: "Single sectional Colorbond door, installed: roughly $1,500-$2,500",
      to: "Standard sectional Colorbond door, supplied and installed: $3,000-$5,000",
    },
    {
      from: "Double sectional Colorbond door, installed: roughly $2,200-$3,800",
      to: "Double sectional Colorbond door, supplied and installed: $3,000-$5,000 (upper end)",
    },
    {
      from: "Add insulated (foam-filled) panels: roughly $300-$800 extra",
      to: "Add insulated (foam-filled) panels: quoted with the door",
    },
    {
      from: "Premium aluminium, glazed or timber-look doors: roughly $4,000-$10,000+",
      to: "Premium aluminium, glazed, timber-look and custom doors: $5,000-$15,000",
    },
    {
      from: "Automatic opener/motor, supplied and fitted: roughly $400-$900",
      to: "Automatic opener/motor, supplied, fitted and programmed including remotes: $770-$990",
    },
    {
      from:
        "As a 2026 guide, a single sectional Colorbond door runs roughly $1,500-$2,500 installed and a double around $2,200-$3,800. Insulation adds about $300-$800 and an automatic motor about $400-$900, supplied and fitted.",
      to:
        "As a 2026 guide, a standard new door supplied and installed is $3,000-$5,000, including removal of the old door, new tracks and hardware. Custom and designer doors run $5,000-$15,000. An automatic motor is $770-$990 supplied, fitted and programmed with remotes; insulation is quoted with the door.",
    },
  ],

  "sectional-vs-roller-vs-tilt-garage-doors": [
    {
      from:
        "As a guide, expect roughly $1,000–$2,500 for a roller, $1,500–$4,000+ for a sectional, and $1,200–$3,000 for a tilt, supplied and installed in Perth.",
      to:
        "As a guide, a standard new door of any of the three types is $3,000–$5,000 supplied and installed in Perth, including removal of the old door, new tracks and hardware; custom and designer doors run $5,000–$15,000.",
    },
    {
      from:
        "Roller door — roughly $1,000–$2,500 for a typical single, more for a double or insulated curtain. The most budget-friendly entry point.",
      to:
        "Roller door — $3,000–$5,000 supplied and installed, at the lower end of that range for a typical single. The most budget-friendly entry point.",
    },
    {
      from:
        "Sectional door — roughly $1,500–$4,000+ depending on insulation, colour, windows and whether it's a single or double. Premium designer and timber-look panels sit at the top of that range.",
      to:
        "Sectional door — $3,000–$5,000 supplied and installed, depending on insulation, colour, windows and whether it's a single or double. Premium designer and timber-look doors run $5,000–$15,000.",
    },
    {
      from:
        "Tilt door — roughly $1,200–$3,000; flat steel sits at the lower end, while custom solid-timber tilt doors can run well above it.",
      to:
        "Tilt door — $3,000–$5,000 supplied and installed; flat steel sits at the lower end, while custom solid-timber tilt doors run $5,000–$15,000. Re-arming an existing tilt door with a new arms kit and springs is $1,200–$1,800.",
    },
    {
      from: "Add a new opener/motor — commonly another $400–$900+ installed if you're upgrading at the same time.",
      to: "Add a new opener/motor — $770–$990 supplied, installed and programmed including remotes.",
    },
    {
      from:
        "As a guide, sectional garage doors in Perth typically run from around $1,500 to $4,000 or more supplied and installed, depending on whether it's a single or double, the insulation, colour, windows and any feature panels. Adding a new motor usually adds several hundred dollars.",
      to:
        "A standard sectional garage door in Perth is $3,000 to $5,000 supplied and installed, including removal of the old door, new tracks and hardware. Custom and designer doors run $5,000 to $15,000. Adding a new motor is $770 to $990.",
    },
  ],

  "common-garage-door-problems-and-fixes": [
    {
      from: "General service and tune-up: $120 to $220",
      to: "Safety check-up and inspection: $120. Full service and tune-up: from $140 plus parts",
    },
    {
      from: "Sensor realignment or roller replacement: $120 to $280",
      to: "Safety sensors replaced and realigned: $150 to $300",
    },
    { from: "Garage door cable replacement: $150 to $350", to: "Garage door cable replacement: $280 to $550" },
    {
      from: "Broken spring replacement: $180 to $450 depending on type and number",
      to: "Broken spring replacement: $240 to $280 for one, $440 to $550 for a pair, up to $1,000 for four",
    },
    {
      from: "Opener or motor repair and replacement: $300 to $800 and up",
      to: "Opener or motor repair: $380 to $490. Full motor replacement: $770 to $990",
    },
    {
      from: "Acting early often turns a $150 job into avoiding a $600 one.",
      to: "Acting early often turns a $140 service into avoiding a $770 motor replacement.",
    },
    {
      from:
        "Most everyday repairs in Perth fall between $120 and $450, depending on the part. A service or sensor fix sits at the lower end, while spring and cable work costs more. Opener replacements typically run $300 and up.",
      to:
        "Most everyday repairs in Perth fall between $120 and $550, depending on the part. A $120 safety check or $150 to $300 sensor fix sits at the lower end, while spring work is $240 to $550 and cable work $280 to $550. Motor repairs are $380 to $490 and full replacements $770 to $990.",
    },
  ],
};

interface AdminPage {
  id: number;
  templateType: string;
  slug: string;
  title: string;
  status: string;
  noIndex: boolean;
  seoTitle: string;
  seoDescription: string;
  heroImageAssetId: number | null;
  socialImageAssetId: number | null;
  data: Record<string, unknown>;
  faqs: { question: string; answer: string; sortOrder: number; faqItemId: number | null }[];
  relatedLinks: {
    targetPageId: number | null;
    staticHref: string | null;
    labelOverride: string | null;
    linkGroup: string;
    sortOrder: number;
  }[];
  pricingRows: { pricingItemId: number; sortOrder: number; noteOverride: string | null }[];
  reviews: { reviewId: number; sortOrder: number }[];
  services: { serviceId: number; sortOrder: number }[];
}

let token = "";

async function api<T>(path: string, init: RequestInit = {}): Promise<{ status: number; body: T }> {
  const res = await fetch(`${CMS_API_URL}${path}`, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
      ...(init.headers ?? {}),
    },
  });
  const text = await res.text();
  let body: unknown;
  try {
    body = text ? JSON.parse(text) : undefined;
  } catch {
    body = text;
  }
  if (!res.ok) {
    throw new Error(`${init.method ?? "GET"} ${path} failed (${res.status}): ${text.slice(0, 300)}`);
  }
  return { status: res.status, body: body as T };
}

async function login(): Promise<void> {
  const res = await fetch(`${CMS_API_URL}/api/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email: ADMIN_EMAIL, password: ADMIN_PASSWORD }),
  });
  if (!res.ok) throw new Error(`Login failed (${res.status}) at ${CMS_API_URL}.`);
  const data = (await res.json()) as { token?: string };
  if (!data.token) throw new Error("Login succeeded but no token was returned.");
  token = data.token;
}

function toUpdateBody(page: AdminPage) {
  return {
    id: page.id,
    templateType: page.templateType,
    slug: page.slug,
    title: page.title,
    seoTitle: page.seoTitle,
    seoDescription: page.seoDescription,
    noIndex: page.noIndex,
    status: page.status,
    heroImageAssetId: page.heroImageAssetId,
    socialImageAssetId: page.socialImageAssetId,
    data: page.data,
    faqs: page.faqs.map((f) => ({
      question: f.question,
      answer: f.answer,
      sortOrder: f.sortOrder,
      faqItemId: f.faqItemId,
    })),
    relatedLinks: page.relatedLinks.map((l) => ({
      targetPageId: l.targetPageId,
      staticHref: l.staticHref,
      labelOverride: l.labelOverride,
      linkGroup: l.linkGroup,
      sortOrder: l.sortOrder,
    })),
    pricingRows: page.pricingRows.map((r) => ({
      pricingItemId: r.pricingItemId,
      sortOrder: r.sortOrder,
      noteOverride: r.noteOverride,
    })),
    reviews: page.reviews.map((r) => ({ reviewId: r.reviewId, sortOrder: r.sortOrder })),
    services: page.services.map((s) => ({ serviceId: s.serviceId, sortOrder: s.sortOrder })),
  };
}

/**
 * Applies the replacements to a JSON-serialised value. Returns the new value plus which
 * fixes actually fired, so an unmatched `from` is reported rather than failing silently —
 * the usual cause is upstream copy edits, and a silent miss would leave a wrong price live.
 */
function applyFixes<T>(value: T, fixes: Fix[]): { value: T; applied: Set<number> } {
  let json = JSON.stringify(value);
  const applied = new Set<number>();
  fixes.forEach((fix, i) => {
    // JSON-encode the needle so quotes/newlines inside the copy match the serialised form.
    const needle = JSON.stringify(fix.from).slice(1, -1);
    const replacement = JSON.stringify(fix.to).slice(1, -1);
    if (json.includes(needle)) {
      json = json.split(needle).join(replacement);
      applied.add(i);
    }
  });
  return { value: JSON.parse(json) as T, applied };
}

/**
 * Anonymous pre-flight: confirms every `from` string is still present verbatim in the
 * live public payload. Needs no credentials, writes nothing, and exits non-zero on any
 * miss so it can gate the write pass.
 */
async function check(): Promise<never> {
  console.log(`Checking blog pricing fixes against ${CMS_API_URL} (read-only, no auth)\n`);
  let matched = 0;
  let missing = 0;

  for (const [slug, fixes] of Object.entries(FIXES)) {
    const res = await fetch(`${CMS_API_URL}/api/pages/resolve?routeGroup=blog&slug=${slug}`);
    if (!res.ok) {
      console.error(`!! ${slug}: resolve failed (${res.status})`);
      missing += fixes.length;
      continue;
    }
    const dto = (await res.json()) as { data: unknown; faqs?: unknown };
    const hay = JSON.stringify(dto.data) + JSON.stringify(dto.faqs ?? []);

    const misses: string[] = [];
    for (const fix of fixes) {
      if (hay.includes(JSON.stringify(fix.from).slice(1, -1))) matched++;
      else misses.push(fix.from.slice(0, 80));
    }
    missing += misses.length;
    console.log(`${misses.length === 0 ? "OK" : "!!"} ${slug}: ${fixes.length - misses.length}/${fixes.length} matched`);
    misses.forEach((m) => console.log(`     NO MATCH: "${m}…"`));
  }

  console.log(`\n${matched} matched, ${missing} unmatched.`);
  process.exit(missing === 0 ? 0 : 1);
}

async function main() {
  if (CHECK_ONLY) await check();

  console.log(`Correcting blog pricing against ${CMS_API_URL}${DRY_RUN ? "  (DRY RUN — no writes)" : ""}`);
  await login();
  console.log("✓ logged in");

  const { body: pageList } = await api<{
    items: { id: number; slug: string; routeGroup?: string }[];
  }>("/api/admin/pages?pageSize=200");
  const items = pageList.items ?? [];

  let totalApplied = 0;
  let totalMissed = 0;

  for (const [slug, fixes] of Object.entries(FIXES)) {
    const match = items.find(
      (p) => p.slug === slug && (p.routeGroup ?? "").toLowerCase() === "blog",
    );
    if (!match) {
      console.warn(`  ! blog/${slug} not found — skipped`);
      totalMissed += fixes.length;
      continue;
    }

    const { body: page } = await api<AdminPage>(`/api/admin/pages/${match.id}`);

    const dataResult = applyFixes(page.data, fixes);
    const faqResult = applyFixes(page.faqs, fixes);
    const applied = new Set([...dataResult.applied, ...faqResult.applied]);

    if (applied.size === 0) {
      console.log(`  = blog/${slug}: already corrected (0 of ${fixes.length} matched)`);
      continue;
    }

    page.data = dataResult.value;
    page.faqs = faqResult.value;

    if (!DRY_RUN) {
      await api(`/api/admin/pages/${match.id}`, {
        method: "PUT",
        body: JSON.stringify(toUpdateBody(page)),
      });
    }

    totalApplied += applied.size;
    console.log(`  ✓ blog/${slug}: ${applied.size} of ${fixes.length} price(s) corrected`);

    fixes.forEach((fix, i) => {
      if (!applied.has(i)) {
        totalMissed++;
        console.warn(`      ! not found (already fixed, or copy changed): "${fix.from.slice(0, 70)}…"`);
      }
    });
  }

  console.log(
    `\n${DRY_RUN ? "Would correct" : "Corrected"} ${totalApplied} price statement(s).` +
      (totalMissed ? ` ${totalMissed} unmatched — review the warnings above.` : ""),
  );
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
