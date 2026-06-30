import { NextResponse, type NextRequest } from "next/server";

/**
 * Lead-capture proxy for the Smart Garage Assistant. The in-chat quote form POSTs here on success; we
 * attach the shared secret and forward to the CMS, which records the contact details against the
 * conversation (by sessionId). Same-origin only — the browser never sees the CMS or the secret.
 */

const CMS_API_URL = process.env.CMS_API_URL ?? "http://localhost:5179";

function str(value: unknown, max: number): string | undefined {
  return typeof value === "string" && value.trim().length > 0 ? value.trim().slice(0, max) : undefined;
}

export async function POST(request: NextRequest) {
  const secret = process.env.ASSISTANT_PROXY_SECRET;
  if (!secret) {
    return NextResponse.json({ error: "Not configured." }, { status: 503 });
  }

  const body = (await request.json().catch(() => null)) as Record<string, unknown> | null;
  const sessionId = str(body?.sessionId, 64);
  if (!sessionId) {
    return NextResponse.json({ error: "sessionId is required." }, { status: 400 });
  }

  const payload = {
    sessionId,
    name: str(body?.name, 200),
    phone: str(body?.phone, 50),
    email: str(body?.email, 200),
    suburb: str(body?.suburb, 200),
    type: str(body?.type, 50),
    source: str(body?.source, 300),
  };

  try {
    const res = await fetch(`${CMS_API_URL}/api/assistant/lead`, {
      method: "POST",
      headers: { "Content-Type": "application/json", "x-assistant-secret": secret },
      body: JSON.stringify(payload),
      cache: "no-store",
    });
    // Best-effort: report success/failure but keep it lightweight (the widget ignores the body).
    return NextResponse.json({ ok: res.ok }, { status: res.ok ? 200 : 502 });
  } catch {
    return NextResponse.json({ ok: false }, { status: 502 });
  }
}
