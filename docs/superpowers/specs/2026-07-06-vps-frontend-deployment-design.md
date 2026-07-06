# VPS Frontend Deployment — Design

**Date:** 2026-07-06
**Status:** Approved (user: "do the best choice and the safest")

## Goal

Move the public Next.js frontend from Netlify to the user's own VPS (Ubuntu 24.04, Docker,
host nginx behind Cloudflare) without disturbing the two existing Docker stacks already
running there. The CMS backend **stays on MonsterASP** (`https://cgd.runasp.net`) — this
deployment is frontend-only. Netlify remains deployed as a warm standby for instant rollback.

Domain: `capitalgaragedoors.com.au` (managed in Cloudflare; currently DNS-only A records
pointing at Netlify's load balancer `75.2.60.5`).

## Non-goals

- No backend or database containers on the VPS (the server guide's ports 5003/1435 stay unused).
- No changes to the existing stacks, their nginx configs, or the mail/CRM DNS records.
- No Cloudflare SSL-mode overhaul (Full-strict + origin cert is listed as future hardening).
- Netlify is not decommissioned in this change.

## Architecture

```
User → Cloudflare (TLS, proxied) → VPS nginx :80 (server_name match)
     → 127.0.0.1:8082 → capitalgd_frontend container (Next.js standalone, :3000)
     → outbound HTTPS to the CMS on MonsterASP (build-time prerender + runtime ISR/API proxies)
```

One new, fully namespaced Docker Compose stack `capitalgd` in `/opt/capitalgd`:
single `frontend` service, container `capitalgd_frontend`, network `capitalgd_net`,
host port `127.0.0.1:8082 → 3000`. Deploys via GitHub Actions on push to `main`
(SSH → git reset → `docker compose up -d --build`), mirroring the server's existing pattern.

## Components

### Repo additions/changes

| File | Purpose |
|---|---|
| `next.config.ts` | `output: "standalone"` gated on `DOCKER_BUILD=1` so the Netlify standby build is unchanged |
| `Dockerfile` | Multi-stage `node:22-alpine`: deps → build (`DOCKER_BUILD=1`, reaches the live CMS) → minimal runner, non-root, port 3000 |
| `.dockerignore` | Excludes `node_modules`, `.next`, `.git`, `.env*`, `.claude`, docs |
| `docker-compose.yml` | The `capitalgd` stack described above; runtime env from server-side `.env`; `restart: unless-stopped` |
| `.github/workflows/deploy.yml` | Push-to-main deploy: SSH in, sync `/opt/capitalgd`, write `.env` from GitHub secrets, `docker compose up -d --build`, prune |

A failed image build leaves the previous container running (compose swaps only after a
successful build), so a CMS outage at deploy time fails the deploy without downtime.

### Environment / secrets

GitHub Actions repo secrets (repo is public — no values in git, ever):
`VPS_HOST`, `VPS_USER`, `VPS_SSH_KEY` (new dedicated ed25519 deploy key),
`REVALIDATE_SECRET` and `ASSISTANT_PROXY_SECRET` (must equal the CMS production
`Revalidation:Secret` / `Assistant:ProxySecret`). `CMS_API_URL` and
`NEXT_PUBLIC_SITE_URL` code defaults are already the production values; the site URL is
still written to `.env` explicitly.

### Server (nginx)

New `/etc/nginx/sites-available/capitalgd.conf` only:

- Block 1: `capitalgaragedoors.com.au` + test subdomain → `proxy_pass http://127.0.0.1:8082`
  (websocket headers, `client_max_body_size 100M` for admin media uploads).
- Block 2: `www.capitalgaragedoors.com.au` → 301 to the apex (canonical URLs are apex;
  Netlify performed this redirect before).
- **No** `/api → backend` location: this app's `/api/*` (chat proxy, revalidate webhook,
  pricing) are Next.js routes that must reach the container.
- `nginx -t` before every reload; a failing config never interrupts the existing sites.

### Cloudflare (user-driven in dashboard, guided + verified)

1. Zone SSL/TLS mode → **Flexible** (origin is port-80 only) + **Always Use HTTPS**.
   Checked *before* anything is proxied — a Full/Strict leftover would 5xx the site at cutover.
2. Test record `new.capitalgaragedoors.com.au` → VPS IP, proxied ON → full-chain verification
   with real TLS while production still serves from Netlify.
3. Cutover: apex + `www` A records → VPS IP, proxied ON (TTL is Auto → near-instant).
4. Mail/CRM records (Google, Zoho, SendGrid, AhaSend, SES, DKIM/SPF/DMARC) untouched.

## Verification

- On-server: `curl -I 127.0.0.1:8082`, Host-header test through nginx :80, existing sites
  re-checked after every step (`127.0.0.1:8080`, `:8081`, then their public domains).
- Test subdomain over HTTPS: home page, one CMS-driven flat page, `/api/pricing`,
  `sitemap.xml`, `/admin` login screen.
- Post-flip: same on the live domain, plus an end-to-end ISR test (CMS edit → page updates;
  the CMS webhook already targets `capitalgaragedoors.com.au/api/revalidate`) and a chat
  widget round-trip (`/api/chat` → MonsterASP → DeepSeek).
- **Hard gate:** the live DNS flip happens only after test-subdomain verification passes and
  the user confirms.

## Rollback

- **Site:** revert apex + `www` A records to `75.2.60.5`, proxy OFF → Netlify serves again
  within seconds.
- **Stack:** `cd /opt/capitalgd && docker compose down` (touches nothing else).
- **nginx:** remove the one symlink, `nginx -t`, reload.

## Known trade-offs

- Image builds run on the server (minutes of CPU; no swap configured — avoid deploying while
  the other stacks are rebuilding; a 4 GB swap file is listed as future hardening).
- Cloudflare→origin is plain HTTP under Flexible (identical to the existing sites);
  upgrade path is Full (strict) + origin certificate as a separate change.
- ISR cache lives inside the container: every deploy starts from freshly built pages and
  CMS revalidations repopulate from there.
- Aftercare: remove the `new` test record once stable; optionally move image builds to GHCR later.
