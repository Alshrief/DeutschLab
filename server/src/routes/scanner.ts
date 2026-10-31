import { Router } from 'express';
import multer from 'multer';
import { v4 as uuidv4 } from 'uuid';
import prisma from '../prisma.js';
import { sanitizeAndSaveFile } from '../security/fileSanitizer.js';
import { executeAiCompletion } from '../ai/aiClient.js';
import { io } from '../index.js';

const router = Router();
const upload = multer({ limits: { fileSize: 25 * 1024 * 1024 } }); // 25MB max

// POST Initialize Phone-as-a-Scanner OTT Pairing
router.post('/pair/init', async (req, res) => {
  try {
    const ott = uuidv4().slice(0, 8); // 8-char short-lived token
    const expiresAt = new Date(Date.now() + 15 * 60 * 1000); // 15 mins validity

    const qrPayload = JSON.stringify({
      token: ott,
      wsUrl: `ws://${req.hostname}:5000`,
      clientUploadUrl: `http://${req.hostname}:5173/mobile-scanner?token=${ott}`,
      expiresAt: expiresAt.toISOString(),
    });

    const pairing = await prisma.devicePairing.create({
      data: {
        token: ott,
        qrPayload,
        status: 'PENDING',
        expiresAt,
      },
    });

    res.json(pairing);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// POST Pair Mobile Device with OTT
router.post('/pair/verify', async (req, res) => {
  try {
    const { token } = req.body;
    const pairing = await prisma.devicePairing.findUnique({ where: { token } });

    if (!pairing || pairing.status !== 'PENDING' || new Date() > pairing.expiresAt) {
      return res.status(400).json({ error: 'Pairing token is invalid or expired.' });
    }

    const updated = await prisma.devicePairing.update({
      where: { token },
      data: { status: 'PAIRED' },
    });

    // Notify PC via WebSockets
    if (io) {
      io.to(`pairing:${token}`).emit('mobile_paired', { token, status: 'PAIRED' });
    }

    res.json(updated);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// POST Upload Image or PDF Scan (from Mobile or PC)
router.post('/upload', upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded.' });
    }

    const { pairingToken, title = 'Textbook Scan', cefrLevel = 'A1', providerId } = req.body;

    // 1. Sanitize file (Verify magic bytes, strip EXIF, re-encode to clean WebP)
    const sanitized = await sanitizeAndSaveFile(req.file.buffer, req.file.originalname);

    // 2. Create Source entry
    const source = await prisma.source.create({
      data: {
        title,
        sourceType: sanitized.isPdf ? 'TEXTBOOK_PDF' : 'IMAGE_SCAN',
        originalFilename: sanitized.originalFilename,
        sanitizedFilePath: sanitized.sanitizedFilePath,
        pageCount: 1,
        checksumSha256: sanitized.checksumSha256,
        fileSizeBytes: sanitized.sizeBytes,
        mimeType: sanitized.mimeType,
      },
    });

    // 3. Extract German vocabulary & grammar via AI Vision / OCR Simulation
    const prompt = `Analyze this textbook scan for German CEFR ${cefrLevel}.
Extract 3 distinct German vocabulary words and 1 grammar rule found in this textbook material.
For each vocabulary item, provide lemma, word, article, plural, translation, and 1 contextual sentence.
For the grammar rule, provide title and formula syntax.

Output ONLY JSON:
{
  "vocabulary": [
    {
      "lemma": "Reise",
      "word": "die Reise",
      "article": "DIE",
      "plural": "die Reisen",
      "partOfSpeech": "NOUN",
      "arabicTranslation": "الرحلة / السفر",
      "contextualSentenceDe": "Die Reise nach Berlin war wunderschön.",
      "contextualSentenceAr": "الرحلة إلى برلين كانت رائعة جداً."
    }
  ],
  "grammar": {
    "title": "Perfekt mit sein",
    "formulaSyntax": "[sein im Präsens] + [Partizip II der Bewegungsverben]"
  }
}`;

    const completion = await executeAiCompletion({
      providerId,
      systemPrompt: 'You are an OCR and textbook document analysis engine.',
      userPrompt: prompt,
      jsonMode: true,
      temperature: 0.1,
    });

    const parsedExtraction = JSON.parse(completion.text);

    // 4. Save into Staging Preview Items
    const stagingItems = [];
    for (const v of parsedExtraction.vocabulary || []) {
      const item = await prisma.stagingPreviewItem.create({
        data: {
          sourceId: source.id,
          pageNumber: 1,
          itemType: 'VOCAB',
          extractedData: JSON.stringify(v),
          status: 'PENDING',
        },
      });
      stagingItems.push(item);
    }

    if (parsedExtraction.grammar) {
      const gItem = await prisma.stagingPreviewItem.create({
        data: {
          sourceId: source.id,
          pageNumber: 1,
          itemType: 'GRAMMAR',
          extractedData: JSON.stringify(parsedExtraction.grammar),
          status: 'PENDING',
        },
      });
      stagingItems.push(gItem);
    }

    // 5. Broadcast to PC via WebSockets
    if (io && pairingToken) {
      io.to(`pairing:${pairingToken}`).emit('scan_uploaded', {
        sourceId: source.id,
        itemsCount: stagingItems.length,
      });
    }

    res.status(201).json({ source, stagingItems });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// GET Staging Items
router.get('/staging', async (_req, res) => {
  try {
    const items = await prisma.stagingPreviewItem.findMany({
      orderBy: { createdAt: 'desc' },
      include: { source: { select: { title: true, sourceType: true } } },
    });
    res.json(items);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// POST Approve Staging Item -> Moves into permanent Vocabulary or GrammarRule
router.post('/staging/:id/approve', async (req, res) => {
  try {
    const { id } = req.params;
    const staged = await prisma.stagingPreviewItem.findUnique({ where: { id } });
    if (!staged) return res.status(404).json({ error: 'Item not found in staging.' });

    const rawData = staged.editedData ? JSON.parse(staged.editedData) : JSON.parse(staged.extractedData);

    if (staged.itemType === 'VOCAB') {
      const lemmaRec = await prisma.lemma.upsert({
        where: { lemma: rawData.lemma.trim() },
        update: {},
        create: { lemma: rawData.lemma.trim(), partOfSpeech: rawData.partOfSpeech || 'NOUN' },
      });

      const colorCode =
        rawData.article === 'DER' ? '#3b82f6' : rawData.article === 'DIE' ? '#ef4444' : rawData.article === 'DAS' ? '#22c55e' : null;

      const vocab = await prisma.vocabulary.create({
        data: {
          lemmaId: lemmaRec.id,
          lemma: rawData.lemma.trim(),
          word: rawData.word,
          article: rawData.article || 'NONE',
          plural: rawData.plural || null,
          partOfSpeech: rawData.partOfSpeech || 'NOUN',
          cefrLevel: 'A1',
          arabicTranslation: rawData.arabicTranslation,
          colorCode,
          sourceId: staged.sourceId,
          status: 'LEARNING',
        },
      });

      if (rawData.contextualSentenceDe) {
        await prisma.sentenceHistory.create({
          data: {
            vocabularyId: vocab.id,
            sentenceNumber: 1,
            sentenceDe: rawData.contextualSentenceDe,
            sentenceAr: rawData.contextualSentenceAr || '',
            grammaticalBreakdown: JSON.stringify({ note: 'Extracted from textbook scan' }),
            cefrLevel: 'A1',
          },
        });
      }
    }

    await prisma.stagingPreviewItem.update({
      where: { id },
      data: { status: 'APPROVED' },
    });

    res.json({ success: true });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE Reject Staging Item
router.delete('/staging/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await prisma.stagingPreviewItem.delete({ where: { id } });
    res.json({ success: true });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
