ARG NODE_VERSION=24.0-alpine

# ==============================================
# Stage 1: Install dependencies and build app
# ==============================================

FROM node:${NODE_VERSION} AS builder

WORKDIR /app

COPY . .

RUN npm i && npm run build

# ==============================================
# Stage 2: Build Final Image
# ==============================================

FROM node:${NODE_VERSION} AS runner

WORKDIR /app

COPY --from=builder /app/.next/standalone .
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/public .

# Create user and group for running container
RUN addgroup next && adduser -S nextuser -G next

USER nextuser

ENTRYPOINT ["node", "server.js"]
