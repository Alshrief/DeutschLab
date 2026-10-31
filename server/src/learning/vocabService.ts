import prisma from '../prisma.js';
import { executeAiCompletion } from '../ai/aiClient.js';
import { FsrsEngine } from './fsrsEngine.js';

export interface GenerateVocabBatchOptions {
  cefrLevel: 'A0' | 'A1' | 'A2' | 'B1' | 'B2';
  topic?: string;
  batchSize?: number;
  providerId?: string;
}

export class VocabService {
  /**
   * Returns gender color code based on German article.
   */
  static getGenderColor(article?: string | null): string {
    switch (article?.toUpperCase()) {
      case 'DER':
        return '#3b82f6'; // Masculine Blue
      case 'DIE':
        return '#ef4444'; // Feminine Red
      case 'DAS':
        return '#22c55e'; // Neutral Green
      default:
        return '#94a3b8'; // Slate Neutral
    }
  }

  /**
   * Checks if a lemma or conjugated form already exists in the database.
   */
  static async checkDuplicateLemma(lemma: string): Promise<boolean> {
    const normalized = lemma.trim().toLowerCase();
    const existingLemma = await prisma.lemma.findFirst({
      where: { lemma: { equals: normalized } },
    });
    if (existingLemma) return true;

    const existingVocab = await prisma.vocabulary.findFirst({
      where: {
        OR: [{ lemma: { equals: normalized } }, { word: { contains: normalized } }],
      },
    });
    return !!existingVocab;
  }

  /**
   * Generates a batch of deduplicated German vocabulary with the strict 5-Sentence rule.
   */
  static async generateVocabularyBatch(options: GenerateVocabBatchOptions) {
    const count = options.batchSize || 3;
    const existingLemmas = await prisma.lemma.findMany({ select: { lemma: true } });
    const excludedList = existingLemmas.map((l) => l.lemma).slice(-50).join(', ');

    const prompt = `You are a German lexicographer and pedagogue for CEFR Level ${options.cefrLevel}.
Generate exactly ${count} essential German vocabulary items (nouns, verbs, or adjectives) for CEFR ${options.cefrLevel}.
Topic: ${options.topic || 'Daily life, work, society, and travel'}.
IMPORTANT: DO NOT generate any of the following already mastered lemmas: [${excludedList}].

For EACH vocabulary item, you MUST provide:
1. lemma: Base form (e.g. "gehen", "Haus", "schön")
2. word: Display form with article if noun (e.g. "das Haus", "der Tisch", "die Reise", "lernen")
3. article: "DER", "DIE", "DAS", or "NONE"
4. plural: Plural form with article (e.g. "die Häuser") or null
5. partOfSpeech: "NOUN", "VERB", "ADJECTIVE", "ADVERB", or "PREPOSITION"
6. arabicTranslation: Natural accurate Arabic translation
7. englishTranslation: Natural English translation
8. ipaPhonetics: Accurate IPA phonetic transcription
9. verbConjugations: If verb, object with { present: { ich, du, er, wir, ihr, sie }, prateritum: { ich, er }, perfekt: "...", auxiliary: "haben"|"sein" } else null
10. governingCases: Array of cases like ["AKKUSATIV"] or ["DATIV"] or prepositions like ["warten auf + Akk"]
11. sentences: Exactly 5 progressive contextual German sentences highlighting this word. Each sentence MUST have:
    - sentenceNumber: 1 to 5
    - de: German sentence at CEFR ${options.cefrLevel}
    - ar: Natural Arabic translation
    - grammaticalBreakdown: Object detailing { subject, verb, caseAnalysis, syntaxNotes }
    - verbAssociation: How the target word functions in this sentence

Respond ONLY with valid JSON in this exact structure:
{
  "items": [
    {
      "lemma": "...",
      "word": "...",
      "article": "...",
      "plural": "...",
      "partOfSpeech": "...",
      "arabicTranslation": "...",
      "englishTranslation": "...",
      "ipaPhonetics": "...",
      "verbConjugations": null,
      "governingCases": [],
      "sentences": [
        {
          "sentenceNumber": 1,
          "de": "...",
          "ar": "...",
          "grammaticalBreakdown": {},
          "verbAssociation": "..."
        }
      ]
    }
  ]
}`;

    const completion = await executeAiCompletion({
      providerId: options.providerId,
      systemPrompt: 'You are an expert German linguist outputting strict structured JSON.',
      userPrompt: prompt,
      jsonMode: true,
      temperature: 0.2,
    });

    const parsed = JSON.parse(completion.text);
    const createdItems = [];

    const defaultUser = await prisma.user.findFirst();

    for (const item of parsed.items || []) {
      const isDup = await this.checkDuplicateLemma(item.lemma);
      if (isDup) continue;

      // 1. Create Lemma
      const lemmaRec = await prisma.lemma.create({
        data: {
          lemma: item.lemma.trim(),
          partOfSpeech: item.partOfSpeech || 'NOUN',
        },
      });

      // 2. Create Vocabulary
      const colorCode = this.getGenderColor(item.article);
      const vocab = await prisma.vocabulary.create({
        data: {
          lemmaId: lemmaRec.id,
          lemma: item.lemma.trim(),
          word: item.word,
          article: item.article || 'NONE',
          plural: item.plural || null,
          partOfSpeech: item.partOfSpeech || 'NOUN',
          cefrLevel: options.cefrLevel,
          arabicTranslation: item.arabicTranslation,
          englishTranslation: item.englishTranslation || null,
          ipaPhonetics: item.ipaPhonetics || null,
          colorCode,
          verbConjugations: item.verbConjugations ? JSON.stringify(item.verbConjugations) : null,
          governingCases: item.governingCases ? JSON.stringify(item.governingCases) : null,
          status: 'LEARNING',
        },
      });

      // 3. Create 5 Sentences
      if (Array.isArray(item.sentences)) {
        for (const s of item.sentences) {
          await prisma.sentenceHistory.create({
            data: {
              vocabularyId: vocab.id,
              sentenceNumber: s.sentenceNumber || 1,
              sentenceDe: s.de,
              sentenceAr: s.ar,
              grammaticalBreakdown: JSON.stringify(s.grammaticalBreakdown || {}),
              verbAssociation: s.verbAssociation || null,
              cefrLevel: options.cefrLevel,
              isCurrentActive: true,
              versionNumber: 1,
            },
          });
        }
      }

      // 4. Initialize FSRS card
      if (defaultUser) {
        const initialCard = FsrsEngine.createNewCard();
        await prisma.fsrsProgress.create({
          data: {
            userId: defaultUser.id,
            itemType: 'VOCABULARY',
            vocabularyId: vocab.id,
            state: initialCard.state,
            stability: initialCard.stability,
            difficulty: initialCard.difficulty,
            elapsedDays: 0,
            scheduledDays: 1,
            reps: 0,
            lapses: 0,
            nextReview: initialCard.nextReview,
          },
        });
      }

      createdItems.push(vocab);
    }

    return createdItems;
  }

  /**
   * Non-destructive 5-Sentence regeneration for an existing word.
   */
  static async regenerateSentences(vocabularyId: string, providerId?: string) {
    const vocab = await prisma.vocabulary.findUnique({ where: { id: vocabularyId } });
    if (!vocab) throw new Error('Vocabulary item not found.');

    // Fetch existing highest version
    const existing = await prisma.sentenceHistory.findMany({
      where: { vocabularyId },
      orderBy: { versionNumber: 'desc' },
    });
    const latestVersion = existing[0]?.versionNumber || 1;
    const nextVersion = latestVersion + 1;

    // Archive current active sentences
    await prisma.sentenceHistory.updateMany({
      where: { vocabularyId, isCurrentActive: true },
      data: { isCurrentActive: false },
    });

    const prompt = `Generate 5 BRAND NEW progressive German sentences for: "${vocab.word}" (${vocab.arabicTranslation}) at CEFR ${vocab.cefrLevel}.
Each sentence must have natural Arabic translation and grammatical case analysis.
Output ONLY JSON:
{
  "sentences": [
    {
      "sentenceNumber": 1,
      "de": "...",
      "ar": "...",
      "grammaticalBreakdown": {},
      "verbAssociation": "..."
    }
  ]
}`;

    const completion = await executeAiCompletion({
      providerId,
      systemPrompt: 'You are an expert German teacher.',
      userPrompt: prompt,
      jsonMode: true,
    });

    const parsed = JSON.parse(completion.text);
    const newSentences = [];

    for (const s of parsed.sentences || []) {
      const created = await prisma.sentenceHistory.create({
        data: {
          vocabularyId,
          sentenceNumber: s.sentenceNumber,
          sentenceDe: s.de,
          sentenceAr: s.ar,
          grammaticalBreakdown: JSON.stringify(s.grammaticalBreakdown || {}),
          verbAssociation: s.verbAssociation || null,
          cefrLevel: vocab.cefrLevel,
          isCurrentActive: true,
          versionNumber: nextVersion,
        },
      });
      newSentences.push(created);
    }

    return newSentences;
  }
}
