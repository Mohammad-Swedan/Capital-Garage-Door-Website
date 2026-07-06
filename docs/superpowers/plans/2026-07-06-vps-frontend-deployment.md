# VPS Frontend Deployment Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Serve `capitalgaragedoors.com.au` from the user's VPS as a new isolated Docker stack (`capitalgd`), deployed by GitHub Actions on push to `main`, with Netlify left untouched as a warm standby.

**Architecture:** One Next.js standalone container bound to `127.0.0.1:8082`, fronted by a new nginx server block on the host, behind Cloudflare (proxied, Flexible TLS). The CMS backend stays on MonsterASP (`https://cgd.runasp.net`); the image build prerenders against it and the running container proxies chat/revalidate/pricing to it.

**Tech Stack:** Next.js 16 (standalone output), Docker + Compose v2, GitHub Actions (`appleboy/ssh-action`), nginx (host), Cloudflare DNS/TLS.

## Global Constraints

- **This repo is PUBLIC.** No secret values and no origin server IP may appear in any committed file. Secrets are referenced by pointer: `REVALIDATE_SECRET` = CMS repo `CapitalGarageDoor.Cms.Api/appsettings.Production.json` → `Revalidation:Secret`; `ASSISTANT_PROXY_SECRET` = same file → `Assistant:ProxySecret`. The VPS IP is in `~/Downloads/server deployment file.txt` (referred to below as `$VPS_IP`) and lives only in GitHub secret `VPS_HOST`.
- Next.js 16 + React 19: read `node_modules/next/dist/docs/` before changing config semantics (standalone doc: `01-app/03-api-reference/05-config/01-next-config-js/output.md`).
- The two existing VPS stacks (`ecampus`, `alzoubi`) and all mail/CRM DNS records must not be touched. Re-verify `curl -I http://127.0.0.1:8080` and `:8081` after every server change.
- nginx: always `nginx -t` before `systemctl reload nginx`.
- `npm run build` (and therefore every Docker image build) must be able to reach the CMS at `https://cgd.runasp.net`, or the build fails — which is safe (compose only swaps containers after a successful build).
- The live DNS flip (apex + `www`) happens **only** after test-subdomain verification passes and the user explicitly confirms (hard gate in Task 9).
- Netlify config (`netlify.toml`) is not modified; the Netlify build must remain byte-identical (hence the `DOCKER_BUILD=1` gate).
- Stack naming is fixed: folder `/opt/capitalgd`, compose project `capitalgd`, container `capitalgd_frontend`, network `capitalgd_net`, host port `127.0.0.1:8082`.

---

### Task 1: Gate standalone output in next.config.ts

**Files:**
- Modify: `next.config.ts:3-14`

**Interfaces:**
- Produces: `DOCKER_BUILD=1 npm run build` emits `.next/standalone/server.js` (+ traced `node_modules` incl. sharp). Netlify/plain builds are unchanged.

- [ ] **Step 1: Add the gated config block**

Replace the top of the config object in `next.config.ts`:

```ts
import type { NextConfig } from "next";

// Docker/self-hosted builds run the emitted standalone server (server.js).
// Gated so the Netlify standby build keeps its default output untouched.
const isDockerBuild = process.env.DOCKER_BUILD === "1";

const nextConfig: NextConfig = {
  ...(isDockerBuild
    ? {
        output: "standalone" as const,
        // sharp powers production image optimization; force its platform
        // binaries into the .next/standalone trace (Next docs' own pattern).
        outputFileTracingIncludes: { "/*": ["node_modules/sharp/**/*"] },
      }
    : {}),
  // Lets the dev server's HMR websocket succeed when loading it from a phone
  ...
```

(The existing `allowedDevOrigins`, `experimental.inlineCss`, `images`, and `redirects` blocks stay exactly as they are.)

- [ ] **Step 2: Type-check**

Run: `npx tsc --noEmit`
Expected: exit 0. (If phantom errors appear after branch switches, delete `tsconfig.tsbuildinfo` and re-run.)

- [ ] **Step 3: Commit**

```bash
git add next.config.ts
git commit -m "Gate standalone output behind DOCKER_BUILD for the VPS image"
```

---

### Task 2: Dockerfile + .dockerignore

**Files:**
- Create: `Dockerfile`
- Create: `.dockerignore`

**Interfaces:**
- Consumes: Task 1's `DOCKER_BUILD` gate.
- Produces: an image exposing port 3000 running `node server.js` as non-root; build arg `NEXT_PUBLIC_SITE_URL` (default `https://capitalgaragedoors.com.au`).

- [ ] **Step 1: Create `.dockerignore`**

```
node_modules
.next
.git
.env*
!.env.example
.claude
.playwright-mcp
.github
docs
tsconfig.tsbuildinfo
netlify.toml
*.png
```

(`public/` must NOT be ignored; `*.png` at repo root only matches the stray screenshot files, not `public/**`.)

- [ ] **Step 2: Create `Dockerfile`**

```dockerfile
# syntax=docker/dockerfile:1

FROM node:22-alpine AS deps
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci

FROM node:22-alpine AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
ARG NEXT_PUBLIC_SITE_URL=https://capitalgaragedoors.com.au
ENV NEXT_PUBLIC_SITE_URL=$NEXT_PUBLIC_SITE_URL \
    DOCKER_BUILD=1 \
    NEXT_TELEMETRY_DISABLED=1
# CMS_API_URL is deliberately unset: the code default is the live CMS
# (https://cgd.runasp.net), which the build must reach to prerender app/[slug].
RUN npm run build

FROM node:22-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production \
    PORT=3000 \
    HOSTNAME=0.0.0.0 \
    NEXT_TELEMETRY_DISABLED=1
RUN addgroup -S -g 1001 nodejs && adduser -S -u 1001 nextjs
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static
COPY --from=builder --chown=nextjs:nodejs /app/public ./public
USER nextjs
EXPOSE 3000
CMD ["node", "server.js"]
```

- [ ] **Step 3: Sanity check (no local Docker daemon — static review only)**

Confirm: `public/` exists at repo root, `package-lock.json` exists, and `.env.example` (not `.env`) is the only env file that will enter the build context. The real build gate is the server-side image build in Task 7, which cannot affect the live site (Netlify still serves production).

- [ ] **Step 4: Commit**

```bash
git add Dockerfile .dockerignore
git commit -m "Add multi-stage Dockerfile for the VPS standalone image"
```

---

### Task 3: docker-compose.yml

**Files:**
- Create: `docker-compose.yml`

**Interfaces:**
- Consumes: Task 2's image (build context `.`), server-side `.env` written by Task 4's workflow.
- Produces: service `frontend`, container `capitalgd_frontend`, host port `127.0.0.1:8082 → 3000`.

- [ ] **Step 1: Create `docker-compose.yml`**

```yaml
# Frontend-only stack for the VPS. The CMS backend lives on MonsterASP —
# there are no db/backend services here on purpose. The .env consumed below
# is written on the server by .github/workflows/deploy.yml from GitHub
# secrets; it is never committed (repo is public).
name: capitalgd

services:
  frontend:
    build:
      context: .
      dockerfile: Dockerfile
      args:
        NEXT_PUBLIC_SITE_URL: ${NEXT_PUBLIC_SITE_URL:-https://capitalgaragedoors.com.au}
    container_name: capitalgd_frontend
    restart: unless-stopped
    ports:
      - "127.0.0.1:8082:3000" # only host nginx reaches it
    env_file:
      - .env
    healthcheck:
      test: ["CMD", "wget", "-qO", "/dev/null", "http://127.0.0.1:3000/"]
      interval: 30s
      timeout: 5s
      retries: 3
      start_period: 30s
    networks:
      - capitalgd_net

networks:
  capitalgd_net:
    driver: bridge
```

- [ ] **Step 2: Validate compose syntax without an .env**

Run: `docker compose config` is unavailable locally (no daemon needed for config, but compose requires the env_file to exist) — create a throwaway empty `.env` locally, run `docker compose config --quiet` if the compose CLI is installed, otherwise rely on the server run in Task 7. Delete the throwaway `.env` afterwards (it is gitignored either way).

- [ ] **Step 3: Commit**

```bash
git add docker-compose.yml
git commit -m "Add capitalgd compose stack (frontend only, 127.0.0.1:8082)"
```

---

### Task 4: GitHub Actions deploy workflow

**Files:**
- Create: `.github/workflows/deploy.yml`

**Interfaces:**
- Consumes: GitHub repo secrets `VPS_HOST`, `VPS_USER`, `VPS_SSH_KEY`, `REVALIDATE_SECRET`, `ASSISTANT_PROXY_SECRET` (Task 5).
- Produces: on every push to `main` (or manual dispatch), the server's `/opt/capitalgd` is synced and rebuilt.

- [ ] **Step 1: Create `.github/workflows/deploy.yml`**

```yaml
name: Deploy frontend to VPS

on:
  push:
    branches: [main]
  workflow_dispatch:

concurrency:
  group: deploy-vps
  cancel-in-progress: false

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - name: Deploy over SSH
        uses: appleboy/ssh-action@v1.0.3
        with:
          host: ${{ secrets.VPS_HOST }}
          username: ${{ secrets.VPS_USER }}
          key: ${{ secrets.VPS_SSH_KEY }}
          command_timeout: 30m
          script: |
            set -e
            echo "Deploying capitalgd (frontend only)..."
            mkdir -p /opt/capitalgd
            if [ ! -d /opt/capitalgd/.git ]; then
              git clone https://github.com/Mohammad-Swedan/Capital-Garage-Door-Website.git /opt/capitalgd
            fi
            cd /opt/capitalgd
            git fetch origin
            git reset --hard origin/main
            git clean -fd
            # Runtime secrets, kept out of git (repo is public).
            cat > .env << 'ENVEOF'
            NEXT_PUBLIC_SITE_URL=https://capitalgaragedoors.com.au
            REVALIDATE_SECRET=${{ secrets.REVALIDATE_SECRET }}
            ASSISTANT_PROXY_SECRET=${{ secrets.ASSISTANT_PROXY_SECRET }}
            ENVEOF
            docker compose up -d --build
            docker image prune -f
            docker compose ps
            echo "Done."
```

Notes: `up -d --build` swaps the container only after a successful build, so a failed build (e.g. CMS unreachable) leaves the previous version serving. The heredoc is single-quoted for the shell, but `${{ secrets.* }}` is substituted by GitHub before the script reaches the server; GitHub masks those values in the run logs.

- [ ] **Step 2: Commit (do NOT push yet — secrets don't exist until Task 5)**

```bash
git add .github/workflows/deploy.yml
git commit -m "Add push-to-main VPS deploy workflow"
```

---

### Task 5: Deploy key + GitHub secrets

**Files:**
- Create (scratchpad only, never committed): `deploy_key`, `deploy_key.pub`

**Interfaces:**
- Produces: the five repo secrets Task 4 consumes; a dedicated ed25519 key that can SSH to the server.

- [ ] **Step 1: Generate a dedicated deploy key (in the session scratchpad)**

```bash
ssh-keygen -t ed25519 -C "deploy-capitalgd" -f "$SCRATCHPAD/deploy_key" -N ""
```

- [ ] **Step 2: Authorize it on the server**

```bash
ssh root@$VPS_IP "cat >> ~/.ssh/authorized_keys" < "$SCRATCHPAD/deploy_key.pub"
ssh -i "$SCRATCHPAD/deploy_key" -o IdentitiesOnly=yes root@$VPS_IP hostname
```

Expected: `srv833288`.

- [ ] **Step 3: Set the GitHub secrets**

```bash
REPO=Mohammad-Swedan/Capital-Garage-Door-Website
gh secret set VPS_HOST -R $REPO -b "$VPS_IP"
gh secret set VPS_USER -R $REPO -b "root"
gh secret set VPS_SSH_KEY -R $REPO < "$SCRATCHPAD/deploy_key"
gh secret set REVALIDATE_SECRET -R $REPO -b "<Revalidation:Secret from CMS appsettings.Production.json>"
gh secret set ASSISTANT_PROXY_SECRET -R $REPO -b "<Assistant:ProxySecret from CMS appsettings.Production.json>"
gh secret list -R $REPO
```

Expected: all five listed. (The two shared-secret values are copied verbatim from the CMS repo's gitignored `appsettings.Production.json` — never from this plan, which is committed to a public repo.)

- [ ] **Step 4: Delete the private key from the scratchpad after Task 7 confirms a green deploy**

---

### Task 6: nginx site on the server

**Files:**
- Create (on server): `/etc/nginx/sites-available/capitalgd.conf` + symlink in `sites-enabled`

**Interfaces:**
- Consumes: container on `127.0.0.1:8082` (may not be running yet — nginx tolerates a dead upstream with 502s).
- Produces: hostname routing for apex + test subdomain; `www` → apex 301.

- [ ] **Step 1: Pre-checks**

```bash
ssh root@$VPS_IP 'docker ps --format "{{.Names}} {{.Status}}"; curl -sI http://127.0.0.1:8080 | head -1; curl -sI http://127.0.0.1:8081 | head -1; ss -tlnp | grep -E ":8082" || echo "8082 free"; df -h / | tail -1; free -h | head -2'
```

Expected: 7 containers Up, two `HTTP/1.1 200`/`301` lines, `8082 free`, ample disk/RAM.

- [ ] **Step 2: Write the site config**

```bash
ssh root@$VPS_IP 'cat > /etc/nginx/sites-available/capitalgd.conf << "EOF"
server {
    listen 80;
    server_name capitalgaragedoors.com.au new.capitalgaragedoors.com.au;

    location / {
        proxy_pass         http://127.0.0.1:8082;
        proxy_http_version 1.1;
        proxy_set_header   Host              $host;
        proxy_set_header   X-Real-IP         $remote_addr;
        proxy_set_header   X-Forwarded-For   $proxy_add_x_forwarded_for;
        # Public scheme is always https (Cloudflare edge + Always Use HTTPS);
        # hardcoded so the app never sees the plain-http origin hop.
        proxy_set_header   X-Forwarded-Proto https;
        proxy_set_header   Upgrade           $http_upgrade;
        proxy_set_header   Connection        "upgrade";
        proxy_cache_bypass $http_upgrade;
        client_max_body_size 100M; # admin media uploads pass through /admin/api/upload
    }
}

server {
    listen 80;
    server_name www.capitalgaragedoors.com.au;
    return 301 https://capitalgaragedoors.com.au$request_uri;
}
EOF'
```

- [ ] **Step 3: Enable, test, reload — then re-verify the existing sites**

```bash
ssh root@$VPS_IP 'ln -sf /etc/nginx/sites-available/capitalgd.conf /etc/nginx/sites-enabled/capitalgd.conf && nginx -t && systemctl reload nginx && curl -sI http://127.0.0.1:8080 | head -1 && curl -sI http://127.0.0.1:8081 | head -1'
```

Expected: `syntax is ok` + `test is successful`, then the same two healthy responses as Step 1. If `nginx -t` fails, fix the file before any reload — the running config is untouched.

---

### Task 7: Push + first deploy + smoke tests

**Interfaces:**
- Consumes: Tasks 1–6.
- Produces: `capitalgd_frontend` Up (healthy) on the server.

- [ ] **Step 1: Push `main`**

```bash
git push origin main
```

- [ ] **Step 2: Watch the Actions run**

```bash
gh run watch -R Mohammad-Swedan/Capital-Garage-Door-Website --exit-status
```

Expected: `Deploy frontend to VPS` succeeds (first image build takes several minutes). Netlify will also build this push — irrelevant, it's the standby.

- [ ] **Step 3: On-server smoke tests**

```bash
ssh root@$VPS_IP 'cd /opt/capitalgd && docker compose ps && curl -sI http://127.0.0.1:8082 | head -3 && curl -sI -H "Host: capitalgaragedoors.com.au" http://127.0.0.1 | head -3 && curl -sI -H "Host: www.capitalgaragedoors.com.au" http://127.0.0.1 | head -3'
```

Expected: container `Up (healthy)`; `HTTP/1.1 200` from :8082 and from the apex Host-header test; `301` + `Location: https://capitalgaragedoors.com.au/` from the www test.

- [ ] **Step 4: Existing sites still fine**

```bash
ssh root@$VPS_IP 'curl -sI http://127.0.0.1:8080 | head -1; curl -sI http://127.0.0.1:8081 | head -1'
curl -sI https://ecampusjo.com | head -1
curl -sI https://alzoubimall.com | head -1
```

Expected: all respond as before.

- [ ] **Step 5: Delete `$SCRATCHPAD/deploy_key` and `deploy_key.pub`**

---

### Task 8: Cloudflare test subdomain (user-driven, guided)

**Interfaces:**
- Consumes: running stack + nginx block (Tasks 6–7).
- Produces: `https://new.capitalgaragedoors.com.au` serving the site through the full Cloudflare→nginx→container chain.

- [ ] **Step 1: Guide the user through three dashboard changes (in this order)**

1. SSL/TLS → Overview → set encryption mode to **Flexible** (origin is port-80 only). This is dormant until a record is proxied; the live (unproxied) Netlify records are unaffected.
2. SSL/TLS → Edge Certificates → **Always Use HTTPS: On** (also only affects proxied hostnames).
3. DNS → Records → Add: **Type A, Name `new`, IPv4 `$VPS_IP`, Proxy status: Proxied (orange)**.

- [ ] **Step 2: Verify DNS + TLS + content**

```bash
curl -s "https://cloudflare-dns.com/dns-query?name=new.capitalgaragedoors.com.au&type=A" -H "accept: application/dns-json"
curl -sI https://new.capitalgaragedoors.com.au | head -5
```

Expected: DoH answer present (Cloudflare edge IPs, not the origin IP — proxied records must never expose the origin); `HTTP/2 200` with a `cf-ray` header.

- [ ] **Step 3: Functional spot-checks over the test subdomain**

```bash
curl -s -o /dev/null -w "%{http_code} /\n"                       https://new.capitalgaragedoors.com.au/
curl -s -o /dev/null -w "%{http_code} /garage-door-repairs-perth\n" https://new.capitalgaragedoors.com.au/garage-door-repairs-perth
curl -s -o /dev/null -w "%{http_code} /sitemap.xml\n"            https://new.capitalgaragedoors.com.au/sitemap.xml
curl -s -o /dev/null -w "%{http_code} /admin\n"                  https://new.capitalgaragedoors.com.au/admin
curl -s https://new.capitalgaragedoors.com.au/api/pricing | head -c 200
```

Expected: `200` for all (admin may 307 to its login route — 3xx acceptable), pricing returns a JSON array.

- [ ] **Step 4: Webhook + chat round-trips (hit the container's Next routes end-to-end)**

```bash
curl -s -X POST https://new.capitalgaragedoors.com.au/api/revalidate \
  -H "content-type: application/json" \
  -H "x-revalidate-secret: <Revalidation:Secret from CMS appsettings.Production.json>" \
  -d '{"path":"/","routeGroup":"flat","slug":"garage-door-repairs-perth"}'
curl -s -X POST https://new.capitalgaragedoors.com.au/api/chat \
  -H "content-type: application/json" \
  -d '{"sessionId":"deploy-test","messages":[{"role":"user","content":"Are you open on Sunday?"}]}'
```

Expected: revalidate → `{"revalidated":true,...}`; chat → a JSON envelope with a `reply` string (proves the ASSISTANT_PROXY_SECRET matches the MonsterASP backend).

---

### Task 9: Live DNS cutover (HARD GATE) + post-flip verification

**Interfaces:**
- Consumes: fully verified test subdomain (Task 8).
- Produces: `capitalgaragedoors.com.au` served from the VPS; Netlify idle standby.

- [ ] **Step 1: HARD GATE — ask the user to confirm the flip** (AskUserQuestion; do not proceed without an explicit yes)

- [ ] **Step 2: User edits two existing A records in Cloudflare DNS**

- `capitalgaragedoors.com.au` (currently `75.2.60.5`, DNS-only) → **`$VPS_IP`, Proxied (orange)**
- `www` (currently `75.2.60.5`, DNS-only) → **`$VPS_IP`, Proxied (orange)**

Nothing else in the zone changes (all mail/CRM records stay).

- [ ] **Step 3: Verify live**

```bash
curl -s "https://cloudflare-dns.com/dns-query?name=capitalgaragedoors.com.au&type=A" -H "accept: application/dns-json"
curl -sI https://capitalgaragedoors.com.au | head -5
curl -sI https://www.capitalgaragedoors.com.au | head -5
curl -sI http://capitalgaragedoors.com.au | head -5
curl -s -o /dev/null -w "%{http_code}\n" https://capitalgaragedoors.com.au/garage-door-repairs-perth
```

Expected: proxied answer (Cloudflare IPs); apex `200` with `cf-ray`; www → `301` to apex; plain http → `301` to https (Always Use HTTPS); flat page `200`.

- [ ] **Step 4: End-to-end ISR proof on the live domain**

Repeat the Task 8 Step 4 revalidate POST against `https://capitalgaragedoors.com.au/api/revalidate` → `{"revalidated":true}`. Optionally have the user make a small CMS admin edit and watch it appear within seconds.

- [ ] **Step 5: Collateral checks**

```bash
curl -sI https://ecampusjo.com | head -1
curl -sI https://alzoubimall.com | head -1
```

Expected: unaffected. Rollback if anything is wrong: revert the two A records to `75.2.60.5`, proxy OFF → Netlify serves again within seconds.

---

### Task 10: Documentation + memory

**Files:**
- Modify: `CLAUDE.md` (deployment topology mentions)
- Modify: auto-memory `deployment-topology.md`

**Interfaces:**
- Consumes: the completed cutover.

- [ ] **Step 1: Update `CLAUDE.md`** — in the CMS section's deployment notes, record: production frontend now serves from the user's VPS as the `capitalgd` Docker stack (`/opt/capitalgd`, port 8082, nginx + Cloudflare Flexible TLS), deployed by `.github/workflows/deploy.yml` on push to `main`; Netlify (`cgdperth.netlify.app`) remains a warm standby (rollback = repoint the two Cloudflare A records); pushing to `main` now triggers a real production deploy.

- [ ] **Step 2: Update the `deployment-topology` memory file** with the same facts (plus: deploy secrets live in GitHub repo secrets; shared-secret source of truth is the CMS `appsettings.Production.json`).

- [ ] **Step 3: Commit and push** (this push itself re-exercises the deploy pipeline)

```bash
git add CLAUDE.md docs/superpowers/plans/2026-07-06-vps-frontend-deployment.md docs/superpowers/specs/2026-07-06-vps-frontend-deployment-design.md
git commit -m "Document VPS deployment topology"
git push origin main
gh run watch -R Mohammad-Swedan/Capital-Garage-Door-Website --exit-status
```

- [ ] **Step 4: Aftercare notes for the user** — after a stable day or two: delete the `new` test A record; later hardening (separate changes): Cloudflare Full (strict) + origin cert, 4 GB swap file on the VPS, GHCR prebuilt images.
