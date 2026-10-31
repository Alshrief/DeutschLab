import { Router } from 'express';
import prisma from '../prisma.js';
import { GrammarService } from '../learning/grammarService.js';

const router = Router();

// GET all Grammar Rules
router.get('/rules', async (req, res) => {
  try {
    const { cefrLevel, category } = req.query;
    const where: any = {};
    if (cefrLevel) where.cefrLevel = String(cefrLevel);
    if (category) where.category = String(category);

    const rules = await prisma.grammarRule.findMany({
      where,
      orderBy: { createdAt: 'asc' },
      include: { drills: true },
    });

    res.json(rules);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// POST "AI X-Ray" Surgical Error Correction
router.post('/xray', async (req, res) => {
  try {
    const { sentenceDe, learnerLevel = 'A1', context, providerId } = req.body;
    if (!sentenceDe) {
      return res.status(400).json({ error: 'German sentence is required for X-Ray analysis.' });
    }

    const report = await GrammarService.analyzeSentenceXRay({
      sentenceDe,
      learnerLevel,
      context,
      providerId,
    });

    res.json(report);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// POST Generate Drills for Rule
router.post('/rules/:id/drills/generate', async (req, res) => {
  try {
    const { id } = req.params;
    const { count = 3, providerId } = req.body;
    const drills = await GrammarService.generateDrillsForRule(id, Number(count), providerId);
    res.status(201).json(drills);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
