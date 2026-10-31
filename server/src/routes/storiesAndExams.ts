import { Router } from 'express';
import prisma from '../prisma.js';
import { ExamAndStoryService } from '../learning/examAndStoryService.js';

const router = Router();

// GET all Stories
router.get('/stories', async (req, res) => {
  try {
    const { cefrLevel } = req.query;
    const where: any = {};
    if (cefrLevel) where.cefrLevel = String(cefrLevel);

    const stories = await prisma.story.findMany({
      where,
      orderBy: { createdAt: 'asc' },
    });
    res.json(stories);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// POST Re-seed Curated Stories & Vocab
router.post('/stories/seed-content', async (_req, res) => {
  try {
    const { seedAllContent } = await import('../seedFullContent.js');
    const result = await seedAllContent();
    res.json({ success: true, ...result });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// POST Generate Milestone Story
router.post('/stories/generate', async (req, res) => {
  try {
    const { cefrLevel = 'A1', providerId } = req.body;
    const user = await prisma.user.findFirst();
    if (!user) return res.status(404).json({ error: 'User not found.' });

    const story = await ExamAndStoryService.generateMilestoneStory(user.id, cefrLevel, providerId);
    res.status(201).json(story);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// POST Shadowing Speech Pronunciation Evaluation
router.post('/shadowing/evaluate', (req, res) => {
  try {
    const { targetSentence, spokenText } = req.body;
    if (!targetSentence || !spokenText) {
      return res.status(400).json({ error: 'Both targetSentence and spokenText are required.' });
    }

    const evaluation = ExamAndStoryService.evaluateShadowingPronunciation(targetSentence, spokenText);
    res.json(evaluation);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// POST Start Goethe/Telc Mock Exam
router.post('/exams/start', async (req, res) => {
  try {
    const { examType = 'GOETHE', cefrLevel = 'A1' } = req.body;
    const user = await prisma.user.findFirst();
    if (!user) return res.status(404).json({ error: 'User not found.' });

    const exam = await ExamAndStoryService.generateExamSession(user.id, examType as any, cefrLevel);
    res.status(201).json(exam);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// POST Submit and Evaluate Exam Session
router.post('/exams/:id/submit', async (req, res) => {
  try {
    const { id } = req.params;
    const { answers, providerId } = req.body;

    const evaluated = await ExamAndStoryService.evaluateExamSession(id, answers, providerId);
    res.json(evaluated);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// GET Exam Sessions
router.get('/exams', async (_req, res) => {
  try {
    const exams = await prisma.examSession.findMany({
      orderBy: { createdAt: 'desc' },
    });
    res.json(exams);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
