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
