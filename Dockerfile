# Multi-stage Docker build for VeeFore
FROM node:18-alpine AS base

# Install dependencies only when needed
FROM base AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app

# Install dependencies based on the preferred package manager
COPY package.json package-lock.json* ./
COPY client/package.json ./client/
COPY server/package.json ./server/
RUN npm ci

# Build client
FROM base AS client-builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY --from=deps /app/client/node_modules ./client/node_modules
COPY client ./client
COPY shared ./shared
RUN cd client && npm run build

# Build server
FROM base AS server-builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY --from=deps /app/server/node_modules ./server/node_modules
COPY server ./server
COPY shared ./shared
RUN cd server && npm run build

# Production image
FROM base AS runner
WORKDIR /app

ENV NODE_ENV production
ENV PORT 5000

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nodejs

# Copy built applications
COPY --from=client-builder --chown=nodejs:nodejs /app/client/dist ./client/dist
COPY --from=server-builder --chown=nodejs:nodejs /app/server/dist ./server/dist
COPY --from=server-builder --chown=nodejs:nodejs /app/server/package.json ./server/
COPY --from=deps --chown=nodejs:nodejs /app/server/node_modules ./server/node_modules

USER nodejs

EXPOSE 5000

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD curl -f http://localhost:5000/api/health || exit 1

CMD ["node", "server/dist/index.js"]