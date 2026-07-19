#!/bin/sh
# Career Connect — Startup script cho production
# Chạy tự động khi container khởi động trên Render

echo "🔄 Chạy Prisma migrate deploy..."
npx prisma migrate deploy

echo "🚀 Khởi động server..."
node dist/src/index.js
