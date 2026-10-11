// Source-tracking ingest (module: website/modules/source-tracking). Segment
// config must be declared here — Next does not read re-exported config.
export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export { POST } from "@/modules/source-tracking/server/events-route";
