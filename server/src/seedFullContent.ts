import prisma from './prisma.js';
import { curatedStories } from './curriculumStories.js';
import { extraWortlisteData } from './curriculumWortlisteExtra.js';
import { goetheWortlisteData } from './curriculumData.js';

export async function seedAllContent() {
  console.log('🚀 Starting Comprehensive Content Seed (Stories & Expanded Wortliste)...');

  const defaultUser = await prisma.user.findFirst();
  if (!defaultUser) throw new Error('Default user not found. Please run basic seed first.');

  // ==========================================
  // 1. INGEST CURATED READING STORIES (12 Stories across A1-B2)
  // ==========================================
  console.log(`📖 Ingesting ${curatedStories.length} Curated Reading Stories...`);
  let storiesInserted = 0;

  for (const story of curatedStories) {
    const existing = await prisma.story.findFirst({
      where: { titleDe: story.titleDe },
    });

    if (!existing) {
      await prisma.story.create({
        data: {
          userId: defaultUser.id,
          titleDe: story.titleDe,
          titleAr: story.titleAr,
          cefrLevel: story.cefrLevel,
          storyTextDe: story.storyTextDe,
          storyTextAr: story.storyTextAr,
          readingModeDefault: 'DUAL',
          vocabularyUsed: JSON.stringify(story.vocabularyUsed),
          unknownWords: JSON.stringify(story.unknownWords),
          comprehensionQuestions: JSON.stringify(story.comprehensionQuestions),
        },
      });
      storiesInserted++;
    }
  }
  const totalStories = await prisma.story.count();
  console.log(`✅ Stories Ingested: Newly inserted ${storiesInserted}. Total in DB: ${totalStories}`);

  // ==========================================
  // 2. INGEST VOCABULARY EXPANSION
  // ==========================================
  const allVocabData = [...goetheWortlisteData, ...extraWortlisteData];
  console.log(`📚 Ingesting ${allVocabData.length} Total Curated Vocabulary Items with 5-Sentences & FSRS...`);

  let vocabInserted = 0;

  for (const item of allVocabData) {
    // 1. Find or create lemma
    const lemmaRec = await prisma.lemma.upsert({
      where: { lemma: item.lemma },
      update: {},
      create: {
        lemma: item.lemma,
        partOfSpeech: item.partOfSpeech,
      },
    });

    // 2. Find or create vocabulary
    let vocabRec = await prisma.vocabulary.findFirst({
      where: { lemma: item.lemma, word: item.word },
    });

    if (!vocabRec) {
      vocabRec = await prisma.vocabulary.create({
        data: {
          lemmaId: lemmaRec.id,
          lemma: item.lemma,
          word: item.word,
          article: item.article,
          plural: item.plural,
          partOfSpeech: item.partOfSpeech,
          cefrLevel: item.cefrLevel,
          arabicTranslation: item.arabicTranslation,
          englishTranslation: item.englishTranslation,
          ipaPhonetics: item.ipaPhonetics,
          colorCode: item.colorCode || null,
          verbConjugations: item.verbConjugations || null,
          governingCases: item.governingCases || null,
          status: 'LEARNING',
        },
      });
      vocabInserted++;
    }

    // 3. Ensure 5 sentences exist
    const sCount = await prisma.sentenceHistory.count({ where: { vocabularyId: vocabRec.id } });
    if (sCount === 0) {
      for (const s of item.sentences) {
        await prisma.sentenceHistory.create({
          data: {
            vocabularyId: vocabRec.id,
            sentenceNumber: s.no,
            sentenceDe: s.de,
            sentenceAr: s.ar,
            grammaticalBreakdown: JSON.stringify(s.breakdown),
            cefrLevel: item.cefrLevel,
            isCurrentActive: true,
            versionNumber: 1,
          },
        });
      }
    }

    // 4. Ensure FSRS Progress exists
    const fsrs = await prisma.fsrsProgress.findFirst({
      where: { userId: defaultUser.id, vocabularyId: vocabRec.id },
    });

    if (!fsrs) {
      await prisma.fsrsProgress.create({
        data: {
          userId: defaultUser.id,
          itemType: 'VOCABULARY',
          vocabularyId: vocabRec.id,
          state: 'LEARNING',
          stability: 1.2,
          difficulty: 4.0,
          elapsedDays: 0,
          scheduledDays: 1,
          reps: 1,
          lapses: 0,
          nextReview: new Date(Date.now() + 24 * 60 * 60 * 1000),
        },
      });
    }
  }

  const totalVocab = await prisma.vocabulary.count();
  const totalSentences = await prisma.sentenceHistory.count();
  console.log(`✅ Finished Ingestion! Newly inserted vocab: ${vocabInserted}. Total Vocab: ${totalVocab}, Total Contextual Sentences: ${totalSentences}`);
  return { storiesInserted, totalStories, vocabInserted, totalVocab, totalSentences };
}

if (process.argv[1]?.includes('seedFullContent')) {
  seedAllContent()
    .then(async () => {
      await prisma.$disconnect();
    })
    .catch(async (e) => {
      console.error(e);
      await prisma.$disconnect();
      process.exit(1);
    });
}
