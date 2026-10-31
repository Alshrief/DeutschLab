# Multi-Stage Production Dockerfile for DeutschLab
# Stage 1: Build Client (Frontend React + Tailwind PWA)
FROM node:22-alpine AS client-builder
WORKDIR /app/client
COPY client/package*.json ./
RUN npm install
COPY client/ ./
RUN npm run build

# Stage 2: Build Server (Backend Express + WebSockets + Prisma)
FROM node:22-alpine AS server-builder
WORKDIR /app/server
COPY server/package*.json ./
RUN npm install
COPY server/ ./
RUN npx prisma generate
RUN npm run build

# Stage 3: Production Runner
FROM node:22-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV PORT=5000

# Copy server build & dependencies
COPY --from=server-builder /app/server/package*.json ./
RUN npm install --omit=dev
COPY --from=server-builder /app/server/dist ./dist
COPY --from=server-builder /app/server/prisma ./prisma
COPY --from=server-builder /app/server/node_modules/.prisma ./node_modules/.prisma
COPY --from=server-builder /app/server/node_modules/@prisma ./node_modules/@prisma

# Copy client static assets into public directory for Express to serve
COPY --from=client-builder /app/client/dist ./public

# Create directories for persistent uploads and database backups
RUN mkdir -p uploads backups

EXPOSE 5000

CMD ["node", "dist/index.js"]
