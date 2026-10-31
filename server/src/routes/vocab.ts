import { Router } from 'express';
import prisma from '../prisma.js';
import { VocabService } from '../learning/vocabService.js';
import { FsrsEngine, type FsrsRating } from '../learning/fsrsEngine.js';

const router = Router();

// GET all Vocabulary Items with Active Sentences & FSRS
router.get('/', async (req, res) => {
  try {
    const { cefrLevel, search, status } = req.query;
    const where: any = {};

    if (cefrLevel) where.cefrLevel = String(cefrLevel);
    if (status) where.status = String(status);
    if (search) {
      where.OR = [
        { word: { contains: String(search) } },
        { lemma: { contains: String(search) } },
        { arabicTranslation: { contains: String(search) } },
      ];
    }

    const items = await prisma.vocabulary.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      include: {
        sentenceHistories: {
          where: { isCurrentActive: true },
          orderBy: { sentenceNumber: 'asc' },
        },
        fsrsProgress: true,
      },
    });

    res.json(items);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// POST Generate new Vocabulary Batch (5-Sentence System & Deduplicated Lemmas)
router.post('/generate', async (req, res) => {
  try {
    const { cefrLevel = 'A1', topic, batchSize = 3, providerId } = req.body;
    const result = await VocabService.generateVocabularyBatch({
      cefrLevel,
      topic,
      batchSize: Number(batchSize),
      providerId,
    });
    res.status(201).json(result);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// POST Non-destructive sentence regeneration for a word
router.post('/:id/regenerate-sentences', async (req, res) => {
  try {
    const { id } = req.params;
    const { providerId } = req.body;
    const newSentences = await VocabService.regenerateSentences(id, providerId);
    res.json(newSentences);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// GET Due FSRS cards for study session
router.get('/fsrs/due', async (_req, res) => {
  try {
    const now = new Date();
    const dueCards = await prisma.fsrsProgress.findMany({
      where: {
        nextReview: { lte: now },
      },
      include: {
        vocabulary: {
          include: {
            sentenceHistories: { where: { isCurrentActive: true } },
          },
        },
        grammarRule: true,
      },
      take: 30,
    });

    res.json(dueCards);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// POST Review FSRS Card (Rating: 1: Again, 2: Hard, 3: Good, 4: Easy)
router.post('/fsrs/review', async (req, res) => {
  try {
    const { cardId, rating } = req.body; // rating: 1 | 2 | 3 | 4
    if (!cardId || ![1, 2, 3, 4].includes(Number(rating))) {
      return res.status(400).json({ error: 'Valid cardId and rating (1-4) required.' });
    }

    const card = await prisma.fsrsProgress.findUnique({ where: { id: cardId } });
    if (!card) return res.status(404).json({ error: 'Card not found.' });

    const updatedState = FsrsEngine.reviewCard(
      {
        state: card.state as any,
        stability: card.stability,
        difficulty: card.difficulty,
        elapsedDays: card.elapsedDays,
        scheduledDays: card.scheduledDays,
        reps: card.reps,
        lapses: card.lapses,
        lastReview: card.lastReview || undefined,
        nextReview: card.nextReview,
      },
      Number(rating) as FsrsRating
    );

    const updated = await prisma.fsrsProgress.update({
      where: { id: cardId },
      data: {
        state: updatedState.state,
        stability: updatedState.stability,
        difficulty: updatedState.difficulty,
        elapsedDays: updatedState.elapsedDays,
        scheduledDays: updatedState.scheduledDays,
        reps: updatedState.reps,
        lapses: updatedState.lapses,
        lastReview: updatedState.lastReview,
        nextReview: updatedState.nextReview,
      },
    });

    // Award XP to user
    await prisma.user.updateMany({
      data: { totalXp: { increment: rating * 5 } },
    });

    res.json(updated);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// POST Bulk Import Goethe Wortliste Pack
router.post('/import-wortliste', async (req, res) => {
  try {
    const { importGoetheWortliste } = await import('../seedWortliste.js');
    const result = await importGoetheWortliste();
    res.json({ success: true, ...result });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
