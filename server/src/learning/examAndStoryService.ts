import prisma from '../prisma.js';
import { executeAiCompletion } from '../ai/aiClient.js';

export class ExamAndStoryService {
  /**
   * Generates a milestone story constrained to the learner's known vocabulary.
   */
  static async generateMilestoneStory(userId: string, cefrLevel = 'A1', providerId?: string) {
    // Fetch user's mastered/learning words
    const userVocab = await prisma.vocabulary.findMany({
      where: { cefrLevel },
      take: 25,
      select: { word: true, lemma: true, arabicTranslation: true },
    });

    const wordsList = userVocab.map((v) => `${v.word} (${v.arabicTranslation})`).join(', ');

    const prompt = `Write an engaging milestone German story for a CEFR ${cefrLevel} learner.
Strict Requirement: Base the story primarily on these words: [${wordsList}].
Introduce at most 3-4 new contextual words and tag them.

Output ONLY valid JSON:
{
  "titleDe": "German Title",
  "titleAr": "Arabic Title",
  "storyTextDe": "Full German story text (approx 120-200 words)...",
  "storyTextAr": "Full Arabic translation of the story...",
  "vocabularyUsed": ["word1", "word2"],
  "unknownWords": [
    { "word": "der Bahnhof", "translation": "محطة القطار", "explanation": "A2 noun" }
  ],
  "comprehensionQuestions": [
    {
      "questionDe": "...",
      "questionAr": "...",
      "options": ["A", "B", "C", "D"],
      "correctAnswer": "A"
    }
  ]
}`;

    const completion = await executeAiCompletion({
      providerId,
      systemPrompt: 'You are a certified German language curriculum author.',
      userPrompt: prompt,
      jsonMode: true,
      temperature: 0.3,
    });

    const parsed = JSON.parse(completion.text);

    return prisma.story.create({
      data: {
        userId,
        titleDe: parsed.titleDe,
        titleAr: parsed.titleAr,
        cefrLevel,
        storyTextDe: parsed.storyTextDe,
        storyTextAr: parsed.storyTextAr,
        readingModeDefault: 'DUAL',
        vocabularyUsed: JSON.stringify(parsed.vocabularyUsed || []),
        unknownWords: JSON.stringify(parsed.unknownWords || []),
        comprehensionQuestions: JSON.stringify(parsed.comprehensionQuestions || []),
      },
    });
  }

  /**
   * Compares learner's spoken transcription with target sentence (Shadowing Mode).
   */
  static evaluateShadowingPronunciation(targetSentence: string, spokenText: string) {
    const cleanTarget = targetSentence.toLowerCase().replace(/[^a-zäöüß\s]/g, '').trim().split(/\s+/);
    const cleanSpoken = spokenText.toLowerCase().replace(/[^a-zäöüß\s]/g, '').trim().split(/\s+/);

    let matchCount = 0;
    const wordBreakdown: Array<{ word: string; matched: boolean }> = [];

    for (let i = 0; i < cleanTarget.length; i++) {
      const targetWord = cleanTarget[i];
      const spokenWord = cleanSpoken[i];
      if (spokenWord && targetWord === spokenWord) {
        matchCount++;
        wordBreakdown.push({ word: targetWord, matched: true });
      } else {
        wordBreakdown.push({ word: targetWord, matched: false });
      }
    }

    const accuracyScore = Math.round((matchCount / Math.max(1, cleanTarget.length)) * 100);

    let feedback = 'ممتاز! نطق واضح ومطابق للجملة المستهدفة.';
    if (accuracyScore < 50) {
      feedback = 'تحتاج إلى إعادة المحاولة على سرعة 0.75x للتركيز على مخارج الحروف الألمانية وتناغم الجملة.';
    } else if (accuracyScore < 85) {
      feedback = 'أداء جيد جداً، انتبه لنهايات الكلمات والحروف المتحركة المركبة (Diphthongs: ei, eu, au).';
    }

    return {
      accuracyScore,
      targetSentence,
      spokenText,
      wordBreakdown,
      feedback,
    };
  }

  /**
   * Generates a Goethe/Telc mock examination module.
   */
  static async generateExamSession(userId: string, examType: 'GOETHE' | 'TELC', cefrLevel: string) {
    const examData = {
      examType,
      cefrLevel,
      timeLimitMinutes: 45,
      sections: [
        {
          id: 'reading_part_1',
          name: 'Lesen Teil 1 (Reading Comprehension)',
          instructionsDe: 'Lesen Sie die Texte und die Aufgaben 1-5. Wählen Sie die richtige Lösung.',
          instructionsAr: 'اقرأ النصوص والأسئلة من 1 إلى 5. اختر الإجابة الصحيحة.',
          text: 'Liebe Kolleginnen und Kollegen,\nam kommenden Freitag um 14:00 Uhr findet unsere monatliche Teambesprechung im Raum 302 statt. Bitte bringen Sie Ihre Projektberichte mit.',
          questions: [
            {
              id: 'q1',
              question: 'Wann findet das Treffen statt?',
              options: ['Freitag um 14 Uhr', 'Freitag um 12 Uhr', 'Samstag um 14 Uhr'],
              correctAnswer: 'Freitag um 14 Uhr',
            },
          ],
        },
        {
          id: 'listening_part_1',
          name: 'Hören Teil 1 (Listening Comprehension)',
          instructionsDe: 'Sie hören ein kurzes Alltagsgespräch. Hören Sie aufmerksam zu und lösen Sie die Aufgaben.',
          instructionsAr: 'استمع إلى المحادثة الصوتية بدقة بالضغط على زر التشغيل ثم أجب عن الأسئلة.',
          audioDialogue: 'Guten Tag! Ich möchte bitte ein Zugticket nach Hamburg kaufen. Wann fährt der nächste Zug ab? - Der nächste ICE fährt um 10:45 Uhr von Gleis 4. Möchten Sie einen Sitzplatz reservieren? - Ja bitte, im Ruhebereich am Fenster. Das macht zusammen 54 Euro.',
          dialogueActors: [
            { speaker: 'Kunde', text: 'Guten Tag! Ich möchte bitte ein Zugticket nach Hamburg kaufen. Wann fährt der nächste Zug ab?' },
            { speaker: 'Bahnbeamter', text: 'Der nächste ICE fährt um 10:45 Uhr von Gleis 4. Möchten Sie einen Sitzplatz reservieren?' },
            { speaker: 'Kunde', text: 'Ja bitte, im Ruhebereich am Fenster.' },
            { speaker: 'Bahnbeamter', text: 'Sehr gern. Das macht zusammen 54 Euro.' },
          ],
          questions: [
            {
              id: 'lq1',
              question: 'Wohin möchte der Reisende fahren?',
              options: ['Nach Hamburg', 'Nach Berlin', 'Nach München'],
              correctAnswer: 'Nach Hamburg',
            },
            {
              id: 'lq2',
              question: 'Um wie viel Uhr fährt der nächste Zug ab?',
              options: ['Um 10:45 Uhr', 'Um 11:30 Uhr', 'Um 09:15 Uhr'],
              correctAnswer: 'Um 10:45 Uhr',
            },
          ],
        },
        {
          id: 'writing_part_1',
          name: 'Schreiben Teil 1 (Written Production)',
          instructionsDe: 'Schreiben Sie eine kurze E-Mail (ca. 30-40 Wörter) an Ihren Deutschlehrer, Herr Müller.',
          instructionsAr: 'اكتب بريداً إلكترونياً قصيراً (حوالي 30-40 كلمة) إلى معلمك تخبره باعتذارك عن حضور درس الغد بسبب المرض.',
          prompt: 'Entschuldigung für die Abwesenheit wegen Krankheit.',
        },
      ],
    };

    return prisma.examSession.create({
      data: {
        userId,
        examType,
        cefrLevel,
        status: 'IN_PROGRESS',
        examData: JSON.stringify(examData),
        disclaimerAcknowledged: true,
      },
    });
  }

  /**
   * Evaluates a completed Goethe/Telc exam with rubric scoring and AI weakness diagnostic.
   */
  static async evaluateExamSession(examSessionId: string, userAnswers: any, providerId?: string) {
    const exam = await prisma.examSession.findUnique({ where: { id: examSessionId } });
    if (!exam) throw new Error('Exam session not found.');

    const prompt = `Evaluate this completed ${exam.examType} ${exam.cefrLevel} German examination.
Exam Content:
${exam.examData}

Learner's Submitted Answers:
${JSON.stringify(userAnswers)}

Provide:
1. readingScore: Score out of 25
2. listeningScore: Score out of 25 (or null if not taken)
3. writingScore: Score out of 25
4. speakingScore: Score out of 25 (or null)
5. totalScore: Total calculated score out of 100
6. isPassed: boolean (>= 60 points)
7. detailedRubric: Section-by-section standardized Goethe/Telc rubric breakdown
8. aiWeaknessAnalysis: Surgical diagnostic report in Arabic identifying weak linguistic areas (e.g. Dativ/Akkusativ confusion, word order in subordinate clauses) and targeted recommendations.

Respond ONLY with valid JSON:
{
  "readingScore": 22,
  "writingScore": 18,
  "listeningScore": 20,
  "speakingScore": 19,
  "totalScore": 79,
  "isPassed": true,
  "detailedRubric": {},
  "aiWeaknessAnalysis": "..."
}`;

    const completion = await executeAiCompletion({
      providerId,
      systemPrompt: 'You are an accredited Goethe-Institut / Telc certified examiner.',
      userPrompt: prompt,
      jsonMode: true,
      temperature: 0.1,
    });

    const parsed = JSON.parse(completion.text);

    return prisma.examSession.update({
      where: { id: examSessionId },
      data: {
        status: 'EVALUATED',
        userAnswers: JSON.stringify(userAnswers),
        readingScore: parsed.readingScore,
        writingScore: parsed.writingScore,
        listeningScore: parsed.listeningScore,
        speakingScore: parsed.speakingScore,
        totalScore: parsed.totalScore,
        isPassed: parsed.isPassed,
        detailedRubric: JSON.stringify(parsed.detailedRubric || {}),
        aiWeaknessAnalysis: parsed.aiWeaknessAnalysis,
        completedAt: new Date(),
      },
    });
  }
}
