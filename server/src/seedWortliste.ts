import prisma from './prisma.js';
import { goetheWortlisteData } from './curriculumData.js';

export async function importGoetheWortliste() {
  console.log(`📦 Ingesting ${goetheWortlisteData.length} Official Goethe Wortliste Items with 5-Sentences & FSRS...`);

  const user = await prisma.user.findFirst();
  if (!user) throw new Error('No user found in database. Run basic seed first.');

  let insertedCount = 0;

  for (const item of goetheWortlisteData) {
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
      insertedCount++;
    }

    // 3. Insert the 5 sentences if not present
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
      where: { userId: user.id, vocabularyId: vocabRec.id },
    });

    if (!fsrs) {
      await prisma.fsrsProgress.create({
        data: {
          userId: user.id,
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

  const total = await prisma.vocabulary.count();
  console.log(`✅ Finished Ingestion! Newly inserted: ${insertedCount}. Total Vocabulary now in DB: ${total}`);
  return { insertedCount, total };
}

if (process.argv[1]?.includes('seedWortliste')) {
  importGoetheWortliste()
    .then(async () => {
      await prisma.$disconnect();
    })
    .catch(async (e) => {
      console.error(e);
      await prisma.$disconnect();
      process.exit(1);
    });
}
