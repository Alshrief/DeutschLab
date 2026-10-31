import { v4 as uuidv4 } from 'uuid';
import prisma from '../prisma.js';
import { executeAiCompletion, type AiRequestOptions } from './aiClient.js';
import { type ClassifiedError } from './errorClassifier.js';
import { io } from '../index.js';

export interface EnqueueTaskOptions {
  taskType: string;
  priority?: number; // 1 = Urgent, 5 = High, 10 = Normal, 20 = Low
  payload: any;
  providerId?: string;
  idempotencyKey?: string;
  totalSteps?: number;
}

class PersistentTaskQueueManager {
  private isProcessing = false;
  private maxConcurrency = 3;
  private runningCount = 0;

  /**
   * Enqueues a new task or returns the existing task if idempotencyKey matches.
   */
  async enqueue(options: EnqueueTaskOptions) {
    if (options.idempotencyKey) {
      const existing = await prisma.taskQueue.findUnique({
        where: { idempotencyKey: options.idempotencyKey },
      });
      if (existing) {
        return existing;
      }
    }

    const task = await prisma.taskQueue.create({
      data: {
        id: uuidv4(),
        idempotencyKey: options.idempotencyKey || null,
        taskType: options.taskType,
        priority: options.priority ?? 10,
        status: 'PENDING',
        providerId: options.providerId || null,
        payload: JSON.stringify(options.payload),
        totalSteps: options.totalSteps ?? 1,
        progressPercent: 0,
      },
    });

    this.broadcastTaskUpdate(task.id, 'PENDING', 0);
    this.triggerProcessing();
    return task;
  }

  /**
   * Resumes a paused, failed, or interrupted task from its last saved checkpoint.
   */
  async resumeTask(taskId: string) {
    const task = await prisma.taskQueue.findUnique({
      where: { id: taskId },
      include: { checkpoints: { orderBy: { pageNumber: 'desc' } } },
    });

    if (!task) throw new Error('Task not found.');

    const latestCheckpoint = task.checkpoints[0];
    const resumeStep = latestCheckpoint?.pageNumber ? latestCheckpoint.pageNumber : task.currentStep;

    const updated = await prisma.taskQueue.update({
      where: { id: taskId },
      data: {
        status: 'PENDING',
        currentStep: resumeStep,
        lastError: null,
        retryAfter: null,
      },
    });

    this.broadcastTaskUpdate(taskId, 'PENDING', updated.progressPercent);
    this.triggerProcessing();
    return updated;
  }

  /**
   * Saves an incremental checkpoint for a long-running batch job (e.g. PDF page 180 of 300).
   */
  async saveCheckpoint(
    taskId: string,
    checkpointType: string,
    pageNumber: number,
    stateSnapshot: any,
    metadata?: any
  ) {
    const checkpoint = await prisma.taskCheckpoint.create({
      data: {
        taskId,
        checkpointType,
        pageNumber,
        stateSnapshot: JSON.stringify(stateSnapshot),
        metadata: metadata ? JSON.stringify(metadata) : null,
      },
    });

    // Update partial progress in TaskQueue
    const task = await prisma.taskQueue.findUnique({ where: { id: taskId } });
    if (task) {
      const total = task.totalSteps > 0 ? task.totalSteps : 1;
      const progress = Math.min(100, Math.round((pageNumber / total) * 100));

      await prisma.taskQueue.update({
        where: { id: taskId },
        data: {
          currentStep: pageNumber,
          progressPercent: progress,
          partialResult: JSON.stringify(stateSnapshot),
        },
      });

      this.broadcastTaskUpdate(taskId, 'RUNNING', progress, { pageNumber });
    }

    return checkpoint;
  }

  /**
   * Main queue processing loop respecting priorities and backoff.
   */
  async triggerProcessing() {
    if (this.isProcessing) return;
    this.isProcessing = true;

    try {
      while (this.runningCount < this.maxConcurrency) {
        // Fetch highest priority pending task whose retryAfter has passed
        const now = new Date();
        const nextTask = await prisma.taskQueue.findFirst({
          where: {
            status: 'PENDING',
            OR: [{ retryAfter: null }, { retryAfter: { lte: now } }],
          },
          orderBy: [{ priority: 'asc' }, { scheduledAt: 'asc' }],
        });

        if (!nextTask) break;

        this.runningCount++;
        this.processTask(nextTask.id).finally(() => {
          this.runningCount--;
          this.triggerProcessing();
        });
      }
    } finally {
      this.isProcessing = false;
    }
  }

  private async processTask(taskId: string) {
    const task = await prisma.taskQueue.findUnique({ where: { id: taskId } });
    if (!task || task.status !== 'PENDING') return;

    await prisma.taskQueue.update({
      where: { id: taskId },
      data: {
        status: 'RUNNING',
        startedAt: new Date(),
        attemptCount: { increment: 1 },
      },
    });

    this.broadcastTaskUpdate(taskId, 'RUNNING', task.progressPercent);

    try {
      const payload = JSON.parse(task.payload);

      // Execute AI task
      const result = await executeAiCompletion({
        providerId: task.providerId || undefined,
        systemPrompt: payload.systemPrompt,
        userPrompt: payload.userPrompt,
        temperature: payload.temperature,
        jsonMode: payload.jsonMode,
        taskId: task.id,
      });

      // Mark completed
      await prisma.taskQueue.update({
        where: { id: taskId },
        data: {
          status: 'COMPLETED',
          finalResult: JSON.stringify(result),
          progressPercent: 100,
          finishedAt: new Date(),
          lastError: null,
        },
      });

      this.broadcastTaskUpdate(taskId, 'COMPLETED', 100, result);
    } catch (err: any) {
      const classified: ClassifiedError = err.category
        ? err
        : {
            category: 'UNKNOWN',
            isRetryable: false,
            rawMessage: err.message || String(err),
            humanMessage: 'فشلت المهمة.',
            actionableFix: 'أعد المحاولة.',
          };

      const newAttemptCount = task.attemptCount + 1;
      const canRetry = classified.isRetryable && newAttemptCount < task.maxAttempts;

      if (canRetry) {
        // Exponential backoff: 2^(attempt) * 1000ms + jitter
        const delaySeconds =
          classified.retryAfterSeconds || Math.min(60, Math.pow(2, newAttemptCount));
        const retryDate = new Date(Date.now() + delaySeconds * 1000);

        await prisma.taskQueue.update({
          where: { id: taskId },
          data: {
            status: 'PENDING',
            lastError: `${classified.humanMessage} (${classified.rawMessage})`,
            errorCategory: classified.category,
            retryAfter: retryDate,
          },
        });

        this.broadcastTaskUpdate(taskId, 'PENDING', task.progressPercent, {
          retryAfter: retryDate,
          error: classified.humanMessage,
        });
      } else {
        // Permanent failure
        await prisma.taskQueue.update({
          where: { id: taskId },
          data: {
            status: 'FAILED',
            lastError: `${classified.humanMessage} (${classified.rawMessage})`,
            errorCategory: classified.category,
            finishedAt: new Date(),
          },
        });

        this.broadcastTaskUpdate(taskId, 'FAILED', task.progressPercent, {
          error: classified.humanMessage,
          actionableFix: classified.actionableFix,
        });
      }
    }
  }

  private broadcastTaskUpdate(taskId: string, status: string, progress: number, extra?: any) {
    if (io) {
      io.to(`task:${taskId}`).emit('task_progress', {
        taskId,
        status,
        progress,
        extra,
        timestamp: new Date().toISOString(),
      });
      io.emit('queue_updated', { taskId, status, progress });
    }
  }
}

export const taskQueue = new PersistentTaskQueueManager();
