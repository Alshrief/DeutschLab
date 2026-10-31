import { PrismaClient } from '@prisma/client';

declare global {
  // eslint-disable-next-line no-var
  var __prisma: PrismaClient | undefined;
}

export const prisma =
  global.__prisma ||
  new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['warn', 'error'] : ['error'],
  });

// Optimize SQLite for concurrent reads/writes and prevent locking in production
prisma.$queryRawUnsafe('PRAGMA journal_mode = WAL;').catch(() => {});
prisma.$queryRawUnsafe('PRAGMA synchronous = NORMAL;').catch(() => {});

if (process.env.NODE_ENV !== 'production') {
  global.__prisma = prisma;
}

export default prisma;
