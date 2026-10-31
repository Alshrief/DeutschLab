import { Router } from 'express';
import prisma from '../prisma.js';
import { createDatabaseBackup, listBackups } from '../security/backupService.js';

const router = Router();

// POST Create Backup
router.post('/backup', async (_req, res) => {
  try {
    const backup = await createDatabaseBackup('MANUAL');
    res.status(201).json(backup);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// POST Restore Backup
router.post('/restore', async (req, res) => {
  try {
    const { backupId } = req.body;
    const { restoreDatabaseBackup } = await import('../security/backupService.js');
    const result = await restoreDatabaseBackup(backupId);
    res.json(result);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// GET Backups List
router.get('/backups', async (_req, res) => {
  try {
    const backups = await listBackups();
    res.json(backups);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// GET Audit Logs
router.get('/audit', async (req, res) => {
  try {
    const { severity } = req.query;
    const where: any = {};
    if (severity) where.severity = String(severity);

    const logs = await prisma.auditLog.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      take: 50,
    });
    res.json(logs);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// GET Sessions & Connected Devices
router.get('/sessions', async (_req, res) => {
  try {
    const sessions = await prisma.session.findMany({
      where: { isValid: true },
      orderBy: { createdAt: 'desc' },
      include: { user: { select: { username: true, email: true, role: true } } },
    });
    res.json(sessions);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
