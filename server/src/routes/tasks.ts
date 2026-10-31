import { Router } from 'express';
import prisma from '../prisma.js';
import { taskQueue } from '../ai/persistentQueue.js';

const router = Router();

// GET all Tasks
router.get('/', async (req, res) => {
  try {
    const { status, limit = 50 } = req.query;
    const where: any = {};
    if (status) where.status = String(status);

    const tasks = await prisma.taskQueue.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      take: Number(limit),
      include: {
        provider: { select: { name: true, providerType: true, modelName: true } },
      },
    });

    res.json(tasks);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// GET Task Details with Checkpoints
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const task = await prisma.taskQueue.findUnique({
      where: { id },
      include: {
        checkpoints: { orderBy: { pageNumber: 'asc' } },
        provider: { select: { name: true, modelName: true } },
      },
    });
    if (!task) return res.status(404).json({ error: 'Task not found.' });
    res.json(task);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// POST Resume task from checkpoint
router.post('/resume/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const updated = await taskQueue.resumeTask(id);
    res.json(updated);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// POST Retry task
router.post('/retry/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const updated = await prisma.taskQueue.update({
      where: { id },
      data: {
        status: 'PENDING',
        attemptCount: 0,
        lastError: null,
        retryAfter: null,
      },
    });
    taskQueue.triggerProcessing();
    res.json(updated);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// POST Cancel task
router.post('/cancel/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const updated = await prisma.taskQueue.update({
      where: { id },
      data: { status: 'CANCELLED', finishedAt: new Date() },
    });
    res.json(updated);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// GET Real-time AI Usage Metrics & Cost breakdown
router.get('/metrics/usage', async (_req, res) => {
  try {
    const totalRequests = await prisma.aiUsageLog.count();
    const successfulRequests = await prisma.aiUsageLog.count({ where: { isSuccess: true } });
    const failedRequests = await prisma.aiUsageLog.count({ where: { isSuccess: false } });

    const tokenAggregates = await prisma.aiUsageLog.aggregate({
      _sum: {
        inputTokens: true,
        outputTokens: true,
        totalTokens: true,
        estimatedCostUsd: true,
      },
      _avg: {
        latencyMs: true,
      },
    });

    const recentLogs = await prisma.aiUsageLog.findMany({
      orderBy: { createdAt: 'desc' },
      take: 20,
      include: { provider: { select: { name: true } } },
    });

    res.json({
      totalRequests,
      successfulRequests,
      failedRequests,
      totalTokens: tokenAggregates._sum.totalTokens || 0,
      inputTokens: tokenAggregates._sum.inputTokens || 0,
      outputTokens: tokenAggregates._sum.outputTokens || 0,
      totalCostUsd: Number((tokenAggregates._sum.estimatedCostUsd || 0).toFixed(6)),
      averageLatencyMs: Math.round(tokenAggregates._avg.latencyMs || 0),
      recentLogs,
    });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
