# Career Connect Backend — Dockerfile
# Multi-stage build: build TS → production image chỉ chứa code đã compile + Prisma Client

# =====================
# Stage 1: Build
# =====================
FROM node:20-alpine AS builder

WORKDIR /app

# Cài OpenSSL — Prisma query engine cần libssl để kết nối PostgreSQL
RUN apk add --no-cache openssl

# Copy dependency files trước để tận dụng Docker layer cache
# (nếu package.json không đổi → npm install sẽ dùng cache)
COPY package.json package-lock.json ./
RUN npm ci

# Copy source + Prisma schema
COPY prisma ./prisma
COPY tsconfig.json ./
COPY src ./src

# Generate Prisma Client (cần thiết trước khi build TS)
RUN npx prisma generate

# Build TypeScript → dist/
RUN npm run build

# =====================
# Stage 2: Production
# =====================
FROM node:20-alpine AS production

WORKDIR /app

# Cài OpenSSL cho production runtime
RUN apk add --no-cache openssl

# Chỉ copy những gì cần cho runtime
COPY package.json package-lock.json ./
RUN npm ci --omit=dev

# Copy Prisma schema + generated client từ builder
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/node_modules/.prisma ./node_modules/.prisma
COPY --from=builder /app/node_modules/@prisma ./node_modules/@prisma

# Copy compiled JS
COPY --from=builder /app/dist ./dist

# Copy startup script
COPY start.sh ./start.sh
RUN chmod +x ./start.sh

# Expose port (Render sẽ tự inject PORT env var)
EXPOSE 4000

# Health check — Render sử dụng endpoint này để kiểm tra container sống
HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
  CMD wget -q --spider http://localhost:${PORT:-4000}/health || exit 1

# Khởi động: chạy migrate → start server (không cần Shell access)
CMD ["sh", "./start.sh"]
