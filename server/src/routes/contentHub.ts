import { Router } from 'express';
import prisma from '../prisma.js';
import { curatedRealLifeDialogues } from '../curriculumDialogues.js';
import { curatedGermanChunks } from '../curriculumChunks.js';
import { curatedVerbDrillItems } from '../curriculumVerbs.js';
import { curatedGermanNouns } from '../curriculumNouns.js';
import { curatedSatzbauChallenges } from '../curriculumSatzbau.js';
import { curatedBriefTemplates } from '../curriculumBriefs.js';
import { executeAiCompletion } from '../ai/aiClient.js';

const router = Router();

// GET all Nouns for Der/Die/Das Speed Rush
router.get('/nouns', (req, res) => {
  const { cefrLevel, category } = req.query;
  let items = curatedGermanNouns;
  if (cefrLevel) items = items.filter((n) => n.cefrLevel === cefrLevel);
  if (category) items = items.filter((n) => n.category === category);
  res.json(items);
});

// GET all Satzbau Word Order Challenges
router.get('/satzbau', (req, res) => {
  const { cefrLevel } = req.query;
  let items = curatedSatzbauChallenges;
  if (cefrLevel) items = items.filter((s) => s.cefrLevel === cefrLevel);
  res.json(items);
});

// GET all Official E-Mail & Brief Templates
router.get('/briefs', (req, res) => {
  const { category, cefrLevel } = req.query;
  let items = curatedBriefTemplates;
  if (category) items = items.filter((b) => b.category === category);
  if (cefrLevel) items = items.filter((b) => b.cefrLevel === cefrLevel);
  res.json(items);
});

// POST Evaluate Student Written E-Mail
router.post('/brief/evaluate', async (req, res) => {
  try {
    const { templateId, studentText, targetLevel } = req.body;
    if (!studentText || studentText.trim().length < 10) {
      return res.status(400).json({ error: 'الرجاء كتابة نص كافٍ للتقييم (10 أحرف على الأقل).' });
    }

    const template = curatedBriefTemplates.find((b) => b.id === templateId);

    // Heuristic analysis checks
    const hasFormalAnrede =
      studentText.includes('Sehr geehrte Damen und Herren') ||
      studentText.includes('Sehr geehrter') ||
      studentText.includes('Sehr geehrte') ||
      studentText.includes('Lieber') ||
      studentText.includes('Liebe');

    const hasGruss =
      studentText.includes('Mit freundlichen Grüßen') ||
      studentText.includes('Herzliche Grüße') ||
      studentText.includes('Viele Grüße');

    const connectors = ['weil', 'dass', 'obwohl', 'deshalb', 'trotzdem', 'wenn', 'daher', 'sodass'];
    const detectedConnectors = connectors.filter((c) =>
      new RegExp(`\\b${c}\\b`, 'i').test(studentText)
    );

    const wordCount = studentText.trim().split(/\s+/).length;

    // Try AI completion if available
    let aiEvaluation = null;
    try {
      const prompt = `أنت خبير فاحص لغة ألمانية معتمد في امتحانات معهد جوته وتيلك (Goethe/telc Prüfer).
قم بتقييم هذا الخطاب/الإيميل الذي كتبه طالب يتعلم الألمانية.

المستوى المستهدف: ${targetLevel || template?.cefrLevel || 'B1'}
موضوع الرسالة: ${template?.titleDe || 'Offizielle E-Mail'}
المطلوب تغطيته: ${template?.pointsToCover?.join(' | ') || 'Allgemeines Anliegen'}

نص الطالب:
"""
${studentText}
"""

أرجع ردك بصيغة JSON حصراً بدون أي كود ماركداون خارجي، بالحقول التالية:
{
  "overallScore": رقم من 0 إلى 100,
  "cefrVerdict": "مثلاً B1.1 أو A2.2 مع تعليق قصير",
  "formalityVerdict": "تقييم التحية والخاتمة ونبرة الحديث",
  "grammarFeedback": [
    { "error": "الجملة أو الكلمة الخاطئة", "correction": "الصواب", "explanation": "الشرح بالعربية" }
  ],
  "nativeRewrite": "إعادة صياغة ألمانية احترافية وأصيلة لنفس رسالة الطالب",
  "strengths": ["نقاط القوة في النص"],
  "tipsForImprovement": ["نصائح عملية للتحسين باللغة العربية"]
}`;

      const aiRes = await executeAiCompletion({
        userPrompt: prompt,
        temperature: 0.2,
        maxTokens: 2000,
        jsonMode: true,
      });

      try {
        aiEvaluation = JSON.parse(aiRes.text);
      } catch {
        // Fallback JSON extraction
        const jsonMatch = aiRes.text.match(/\{[\s\S]*\}/);
        if (jsonMatch) aiEvaluation = JSON.parse(jsonMatch[0]);
      }
    } catch {
      // AI provider unavailable or unconfigured, fallback to rich rule-based engine
    }

    if (!aiEvaluation) {
      // Rule-based fallback evaluation
      let baseScore = 60;
      if (hasFormalAnrede) baseScore += 10;
      if (hasGruss) baseScore += 10;
      baseScore += Math.min(15, detectedConnectors.length * 5);
      if (wordCount >= 40) baseScore += 5;

      aiEvaluation = {
        overallScore: Math.min(95, baseScore),
        cefrVerdict: `${targetLevel || 'B1'} - تقييم محلي فوري`,
        formalityVerdict: hasFormalAnrede && hasGruss
          ? 'ممتاز! التزمت بصيغة التحية الرسمية والخاتمة المناسبة.'
          : 'انتبه: احرص دائماً على كتابة التحية الرسمية والخاتمة الألمانية.',
        grammarFeedback: [
          {
            error: 'تأكد من صيغة تصريف الفعل في الموقع الثاني',
            correction: 'Hauptsatz: Verb auf Position 2',
            explanation: 'الفعل المصرف يقع دائماً في الموقع الثاني، وفي الجمل الفرعية بعد weil/dass يقع في النهاية.'
          }
        ],
        nativeRewrite: template?.idealSampleText || studentText,
        strengths: [
          hasFormalAnrede ? 'تحية مناسبة' : 'محاولة جيدة',
          detectedConnectors.length > 0 ? `استخدام أدوات الربط: ${detectedConnectors.join(', ')}` : 'وضوح الفكرة'
        ],
        tipsForImprovement: [
          'احرص على كتابة كل الأسماء بحرف كبير (Großschreibung).',
          'استخدم جملاً فرعية مع weil و dass لإظهار تمكنك اللغوي في المستوى B1.'
        ]
      };
    }

    res.json({
      ...aiEvaluation,
      stats: {
        wordCount,
        hasFormalAnrede,
        hasGruss,
        detectedConnectors,
      }
    });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// GET all Real-Life Dialogues
router.get('/dialogues', (req, res) => {
  const { cefrLevel } = req.query;
  let items = curatedRealLifeDialogues;
  if (cefrLevel) {
    items = items.filter((d) => d.cefrLevel === cefrLevel);
  }
  res.json(items);
});

// GET Dialogue by ID
router.get('/dialogues/:id', (req, res) => {
  const found = curatedRealLifeDialogues.find((d) => d.id === req.params.id);
  if (!found) return res.status(404).json({ error: 'Dialogue not found.' });
  res.json(found);
});

// GET all Chunks / Redewendungen
router.get('/chunks', (req, res) => {
  const { category, cefrLevel } = req.query;
  let items = curatedGermanChunks;
  if (category) {
    items = items.filter((c) => c.category === category);
  }
  if (cefrLevel) {
    items = items.filter((c) => c.cefrLevel === cefrLevel);
  }
  res.json(items);
});

// GET Verb Drill Items
router.get('/verbs', (_req, res) => {
  res.json(curatedVerbDrillItems);
});

// GET Learner Progress & Analytics Stats
router.get('/stats', async (_req, res) => {
  try {
    const defaultUser = await prisma.user.findFirst();
    const userId = defaultUser?.id || '';

    const [totalVocab, vocabByLevel, fsrsDueCount, fsrsMastered, grammarCount, storyCount, usageLogs] =
      await Promise.all([
        prisma.vocabulary.count(),
        prisma.vocabulary.groupBy({
          by: ['cefrLevel'],
          _count: { id: true },
        }),
        prisma.fsrsProgress.count({
          where: {
            userId,
            nextReview: { lte: new Date() },
          },
        }),
        prisma.fsrsProgress.count({
          where: {
            userId,
            state: 'REVIEW',
            stability: { gte: 10 },
          },
        }),
        prisma.grammarRule.count(),
        prisma.story.count(),
        prisma.aiUsageLog.findMany({
          take: 10,
          orderBy: { createdAt: 'desc' },
          select: {
            id: true,
            modelName: true,
            totalTokens: true,
            estimatedCostUsd: true,
            createdAt: true,
          },
        }),
      ]);

    const levelCounts: Record<string, number> = { A1: 0, A2: 0, B1: 0, B2: 0 };
    vocabByLevel.forEach((g) => {
      levelCounts[g.cefrLevel] = g._count.id;
    });

    res.json({
      totalVocab,
      levelCounts,
      fsrsDueCount,
      fsrsMastered,
      grammarCount,
      storyCount,
      dialoguesCount: curatedRealLifeDialogues.length,
      chunksCount: curatedGermanChunks.length,
      recentAiUsage: usageLogs,
    });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
