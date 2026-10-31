import fs from 'fs/promises';
import fsSync from 'fs';
import path from 'path';
import crypto from 'crypto';
import { config } from '../config.js';
import prisma from '../prisma.js';

export async function createDatabaseBackup(triggerType: 'MANUAL' | 'SCHEDULED' = 'MANUAL') {
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  const filename = `deutschlab_backup_${timestamp}.db`;
  const backupFilePath = path.join(config.backupDir, filename);

  const possiblePaths = [
    path.resolve('prisma/dev.db'),
    path.resolve('dev.db'),
    path.resolve('server/prisma/dev.db'),
  ];
  const dbSourcePath = possiblePaths.find((p) => fsSync.existsSync(p)) || possiblePaths[0];

  try {
    const dbBytes = await fs.readFile(dbSourcePath);
    await fs.writeFile(backupFilePath, dbBytes);

    const checksumSha256 = crypto.createHash('sha256').update(dbBytes).digest('hex');

    const backupRecord = await prisma.databaseBackup.create({
      data: {
        filename,
        filePath: backupFilePath,
        sizeBytes: dbBytes.length,
        checksumSha256,
        triggerType,
        status: 'SUCCESS',
      },
    });

    return backupRecord;
  } catch (err: any) {
    await prisma.databaseBackup.create({
      data: {
        filename,
        filePath: backupFilePath,
        sizeBytes: 0,
        checksumSha256: '',
        triggerType,
        status: 'FAILED',
        error: err.message,
      },
    });
    throw err;
  }
}

export async function restoreDatabaseBackup(backupId: string) {
  const backup = await prisma.databaseBackup.findUnique({ where: { id: backupId } });
  if (!backup) throw new Error('Backup record not found.');

  const backupBytes = await fs.readFile(backup.filePath);

  const possiblePaths = [
    path.resolve('prisma/dev.db'),
    path.resolve('dev.db'),
    path.resolve('server/prisma/dev.db'),
  ];
  const dbSourcePath = possiblePaths.find((p) => fsSync.existsSync(p)) || possiblePaths[0];

  // Overwrite current database with backup snapshot
  await fs.writeFile(dbSourcePath, backupBytes);

  return { success: true, restoredFilename: backup.filename };
}

export async function listBackups() {
  return prisma.databaseBackup.findMany({
    orderBy: { createdAt: 'desc' },
  });
}
