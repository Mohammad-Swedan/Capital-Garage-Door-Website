/**
 * The CRM API base (…/api) for the module's server code: the `CRM_API_URL`
 * env var, else the instance config's `crmApiFallbackUrl`. Kept in its own file
 * so server helpers (google-rating.ts) can use it without importing the events
 * route and its module-level rate limiter.
 */
import { sourceTrackingConfig as config } from "@/config/source-tracking";

export function crmApiBase(): string {
  return (process.env.CRM_API_URL || config.crmApiFallbackUrl).replace(/\/+$/, "");
}
