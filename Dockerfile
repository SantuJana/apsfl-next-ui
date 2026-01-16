# ===============================
# Build stage
# ===============================
FROM node:slim AS builder

WORKDIR /app

# ---- Build-time env (for SSG) ----
ARG API_URL
ENV API_URL=$API_URL

COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build


# ===============================
# Runtime stage
# ===============================
FROM node:slim

WORKDIR /app

ENV NODE_ENV=production

# ---- Runtime env (for SSR) ----
ENV API_URL=$API_URL

# Copy standalone output (recommended)
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/public ./public

EXPOSE 3000

CMD ["node", "server.js"]
