/**
 * Source-tracking module — public surface for the host app.
 *
 *   app/layout.tsx          <SourceTrackingProvider />
 *   lib/analytics.ts        captureFromAnalytics(event, payload) inside track()
 *   app/not-found.tsx       <NotFoundReporter />
 *   app/api/source-tracking/events/route.ts
 *                           export { POST } from "@/modules/source-tracking/server/events-route"
 *
 * Contract: docs/source-tracking/DESIGN.md. Vocabulary:
 * modules/source-tracking/taxonomy.json. Business values live only in the
 * instance files config/source-tracking.ts + config/source-tracking.page-groups.json.
 *
 * The server route is deliberately NOT re-exported here, so client bundles
 * that import this file never pull in server code.
 */
export { SourceTrackingProvider } from "./client/provider";
export { NotFoundReporter } from "./client/not-found-reporter";
export { captureFromAnalytics } from "./client/analytics-bridge";
export { defineSourceTrackingConfig } from "./config";
export type { SourceTrackingConfig, SourceTrackingConfigInput, PageGroupRule, PageGroupRules } from "./config";
export type { WireBatch, WireEvent, WireEntry, ForwardedBatch, WireContext, DeviceType } from "./types";
export type { ClientEventType, PageGroup } from "./taxonomy";
export { MODULE_VERSION, TAXONOMY_VERSION } from "./version";
