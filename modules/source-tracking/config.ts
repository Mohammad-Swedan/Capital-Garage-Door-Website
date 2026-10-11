/**
 * Instance configuration for the source-tracking module.
 *
 * The module is byte-identical across every garage-door repo; everything that
 * differs per business lives in the host's `config/source-tracking.ts`
 * (cookie names, landing-page prefixes, page-group rules, API fallback URL),
 * which calls `defineSourceTrackingConfig()` from here.
 *
 * Validation never throws: an invalid config logs once and turns the module
 * OFF, because a typo in a tracking config must never take the website down.
 */
import { PAGE_GROUP_VOCABULARY } from "./taxonomy";

export type PageGroupMatch = "exact" | "prefix" | "regex" | "slugPrefix";

/**
 * One page-group rule. First match wins.
 *
 * - `exact`      — path equals the value.
 * - `prefix`     — path equals the value or sits beneath it on a whole segment
 *                  (`/lp` matches `/lp` and `/lp/x`, never `/lpx`).
 * - `regex`      — JavaScript regex source tested against the path (case-insensitive).
 * - `slugPrefix` — single-segment path (`/<slug>`) whose slug starts with the
 *                  value, unless the slug is in `exclude`.
 *
 * `value` may be a list; the rule matches when any entry does.
 */
export interface PageGroupRule {
  group: string;
  match: PageGroupMatch;
  value: string | string[];
  exclude?: string[];
  $comment?: string;
}

export interface PageGroupRules {
  $comment?: string;
  /** Group for paths no rule matches. Defaults to "other". */
  default?: string;
  rules: PageGroupRule[];
}

export interface SourceTrackingConfigInput {
  enabled?: boolean;
  /** Name of the long-lived first-party visitor cookie the host already issues. */
  visitorCookie: string;
  /** Name of the module's own session cookie (client-managed, sliding). */
  sessionCookie: string;
  sessionTimeoutMinutes?: number;
  /** Paid landing-page prefixes (whole-segment match). */
  landingPagePrefixes?: string[];
  /** Query keys whose presence marks a new campaign visit. */
  campaignParams?: string[];
  pageGroups: PageGroupRules;
  /** CRM API base (…/api) used when the CRM_API_URL env var is not set. */
  crmApiFallbackUrl: string;
  /** Regex source (case-insensitive) for bot User-Agents. */
  botUserAgentPattern?: string;
  /** Log every queued/sent batch to the browser console. */
  debug?: boolean;
  /** Same-origin ingest path. */
  endpoint?: string;
  /** Path prefixes (whole segment) where nothing is tracked, e.g. a CMS admin mounted in the same app. */
  excludePathPrefixes?: string[];
  /**
   * Trust `cf-connecting-ip` as the visitor's address. ONLY true when the site
   * is actually behind Cloudflare: the header is client-settable otherwise, and
   * it is forwarded to the CRM as the rate-limit key with the proxy secret.
   * Default false — the right-most `x-forwarded-for` hop (added by the hosting
   * proxy) is used instead.
   */
  trustCloudflareIpHeader?: boolean;
}

export interface CompiledPageGroupRule {
  group: string;
  match: PageGroupMatch;
  values: string[];
  exclude: string[];
  regexes: RegExp[];
}

export interface SourceTrackingConfig {
  enabled: boolean;
  visitorCookie: string;
  sessionCookie: string;
  sessionTimeoutMinutes: number;
  landingPagePrefixes: string[];
  campaignParams: string[];
  pageGroups: { default: string; rules: CompiledPageGroupRule[] };
  crmApiFallbackUrl: string;
  botUserAgentPattern: RegExp;
  debug: boolean;
  endpoint: string;
  excludePathPrefixes: string[];
  trustCloudflareIpHeader: boolean;
  /** Validation problems found in the input; non-empty means `enabled` was forced off. */
  errors: string[];
}

export const DEFAULT_CAMPAIGN_PARAMS = [
  "gclid",
  "gbraid",
  "wbraid",
  "msclkid",
  "fbclid",
  "utm_source",
  "utm_medium",
  "utm_campaign",
  "utm_term",
  "utm_content",
];

export const DEFAULT_BOT_PATTERN =
  "bot|crawl|spider|slurp|bingpreview|facebookexternalhit|embedly|quora link preview|outbrain|pinterest|vkshare|w3c_validator|lighthouse|headlesschrome|phantomjs|puppeteer|playwright|gptbot|oai-searchbot|chatgpt-user|perplexitybot|claudebot|claude-user|claude-searchbot|anthropic-ai|google-extended|googleother|applebot|bytespider|ccbot|amazonbot|meta-externalagent|python-requests|curl/|wget/|go-http-client|node-fetch|axios/";

export const DEFAULT_ENDPOINT = "/api/source-tracking/events";

const VALID_MATCHES: ReadonlySet<string> = new Set(["exact", "prefix", "regex", "slugPrefix"]);
const VOCABULARY: ReadonlySet<string> = new Set(PAGE_GROUP_VOCABULARY);
const COOKIE_NAME_RE = /^[A-Za-z0-9_-]{1,64}$/;

function toList(value: string | string[] | undefined): string[] {
  if (value === undefined) return [];
  return (Array.isArray(value) ? value : [value]).filter((v): v is string => typeof v === "string");
}

function compileRules(input: PageGroupRules | undefined, errors: string[]): SourceTrackingConfig["pageGroups"] {
  const fallback = input?.default ?? "other";
  if (!VOCABULARY.has(fallback)) errors.push(`pageGroups.default "${fallback}" is not in pageGroupVocabulary`);

  const rules: CompiledPageGroupRule[] = [];
  const list = Array.isArray(input?.rules) ? input!.rules : [];
  if (!Array.isArray(input?.rules)) errors.push("pageGroups.rules must be an array");

  list.forEach((rule, i) => {
    const where = `pageGroups.rules[${i}]`;
    if (!rule || typeof rule !== "object") {
      errors.push(`${where} is not an object`);
      return;
    }
    if (!VOCABULARY.has(rule.group)) errors.push(`${where}.group "${rule.group}" is not in pageGroupVocabulary`);
    if (!VALID_MATCHES.has(rule.match)) errors.push(`${where}.match "${rule.match}" is not a valid match type`);
    const values = toList(rule.value);
    if (values.length === 0) errors.push(`${where}.value is empty`);

    const regexes: RegExp[] = [];
    if (rule.match === "regex") {
      for (const source of values) {
        try {
          regexes.push(new RegExp(source, "i"));
        } catch {
          errors.push(`${where}.value "${source}" is not a valid regex`);
        }
      }
    }
    if ((rule.match === "exact" || rule.match === "prefix") && values.some((v) => !v.startsWith("/"))) {
      errors.push(`${where}.value must start with "/" for match "${rule.match}"`);
    }

    rules.push({
      group: rule.group,
      match: rule.match,
      values: values.map((v) => (rule.match === "regex" ? v : v.toLowerCase())),
      exclude: toList(rule.exclude).map((v) => v.toLowerCase()),
      regexes,
    });
  });

  return { default: VOCABULARY.has(fallback) ? fallback : "other", rules };
}

/** Validate and fill defaults. Never throws. */
export function defineSourceTrackingConfig(input: SourceTrackingConfigInput): SourceTrackingConfig {
  const errors: string[] = [];

  if (!COOKIE_NAME_RE.test(input.visitorCookie ?? "")) errors.push("visitorCookie must be a plain cookie name");
  if (!COOKIE_NAME_RE.test(input.sessionCookie ?? "")) errors.push("sessionCookie must be a plain cookie name");
  if (input.visitorCookie && input.visitorCookie === input.sessionCookie) {
    errors.push("sessionCookie must differ from visitorCookie");
  }

  const timeout = input.sessionTimeoutMinutes ?? 30;
  if (!Number.isFinite(timeout) || timeout < 1 || timeout > 24 * 60) {
    errors.push("sessionTimeoutMinutes must be between 1 and 1440");
  }

  const landingPagePrefixes = input.landingPagePrefixes ?? ["/lp"];
  if (landingPagePrefixes.some((p) => typeof p !== "string" || !p.startsWith("/"))) {
    errors.push('landingPagePrefixes entries must start with "/"');
  }

  const campaignParams = (input.campaignParams ?? DEFAULT_CAMPAIGN_PARAMS).filter(
    (p) => typeof p === "string" && p.length > 0,
  );

  if (typeof input.crmApiFallbackUrl !== "string" || !/^https?:\/\//.test(input.crmApiFallbackUrl)) {
    errors.push("crmApiFallbackUrl must be an http(s) URL");
  }

  let botUserAgentPattern = new RegExp(DEFAULT_BOT_PATTERN, "i");
  if (input.botUserAgentPattern !== undefined) {
    try {
      botUserAgentPattern = new RegExp(input.botUserAgentPattern, "i");
    } catch {
      errors.push("botUserAgentPattern is not a valid regex");
    }
  }

  const endpoint = input.endpoint ?? DEFAULT_ENDPOINT;
  if (!endpoint.startsWith("/")) errors.push('endpoint must be a same-origin path starting with "/"');

  const excludePathPrefixes = input.excludePathPrefixes ?? [];
  if (excludePathPrefixes.some((p) => typeof p !== "string" || !p.startsWith("/") || p === "/")) {
    errors.push('excludePathPrefixes entries must start with "/" and must not be "/"');
  }

  const pageGroups = compileRules(input.pageGroups, errors);

  if (errors.length > 0 && typeof console !== "undefined") {
    console.error(`[source-tracking] config invalid, tracking disabled:\n  - ${errors.join("\n  - ")}`);
  }

  return {
    enabled: (input.enabled ?? true) && errors.length === 0,
    visitorCookie: input.visitorCookie,
    sessionCookie: input.sessionCookie,
    sessionTimeoutMinutes: Number.isFinite(timeout) ? timeout : 30,
    landingPagePrefixes,
    campaignParams,
    pageGroups,
    crmApiFallbackUrl: (input.crmApiFallbackUrl ?? "").replace(/\/+$/, ""),
    botUserAgentPattern,
    debug: input.debug ?? false,
    endpoint,
    excludePathPrefixes,
    trustCloudflareIpHeader: input.trustCloudflareIpHeader === true,
    errors,
  };
}
