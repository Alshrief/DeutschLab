import bcrypt from 'bcryptjs';
import prisma from './prisma.js';

export async function seedDatabase() {
  console.log('🌱 Starting DeutschLab Database Seeding...');

  // 1. Create Default Admin/Learner User
  const defaultPassword = await bcrypt.hash('DeutschLab2026!Secure', 10);
  const user = await prisma.user.upsert({
    where: { email: 'admin@deutschlab.internal' },
    update: {},
    create: {
      email: 'admin@deutschlab.internal',
      username: 'deutschlab_admin',
      passwordHash: defaultPassword,
      role: 'ADMIN',
      cefrLevel: 'A0',
      streakDays: 1,
      totalXp: 100,
      settings: JSON.stringify({
        defaultReadingMode: 'DUAL',
        speechRate: 0.9,
        autoPlayAudio: false,
        theme: 'dark',
      }),
    },
  });
  console.log(`✅ Default user ready: ${user.username} (${user.email})`);

  // 2. Seed AI Providers
  const providers = [
    {
      name: 'Google Gemini (Official)',
      providerType: 'GEMINI',
      baseUrl: 'https://generativelanguage.googleapis.com',
      modelName: 'gemini-2.5-flash',
      isDefault: true,
      isActive: true,
    },
    {
      name: 'OpenAI',
      providerType: 'OPENAI',
      baseUrl: 'https://api.openai.com/v1',
      modelName: 'gpt-4o',
      isDefault: false,
      isActive: false,
    },
    {
      name: 'Anthropic Claude',
      providerType: 'ANTHROPIC',
      baseUrl: 'https://api.anthropic.com/v1',
      modelName: 'claude-3-7-sonnet',
      isDefault: false,
      isActive: false,
    },
    {
      name: 'OpenRouter',
      providerType: 'OPENROUTER',
      baseUrl: 'https://openrouter.ai/api/v1',
      modelName: 'deepseek/deepseek-r1',
      isDefault: false,
      isActive: false,
    },
    {
      name: 'Custom Local vLLM / Ollama',
      providerType: 'CUSTOM',
      baseUrl: 'http://localhost:11434/v1',
      customEndpoint: '/chat/completions',
      modelName: 'mistral-nemo',
      isDefault: false,
      isActive: false,
    },
  ];

  for (const prov of providers) {
    const existing = await prisma.aiProvider.findFirst({
      where: { providerType: prov.providerType },
    });
    if (!existing) {
      await prisma.aiProvider.create({ data: prov });
    }
  }
  console.log(`✅ AI Providers configured (${providers.length} templates)`);

  // 3. Seed Core A0/A1 Grammar Rules with Visual Syntax Formulas
  const grammarRules = [
    {
      title: 'Präsens der regelmäßigen Verben',
      slug: 'praesens-regelmaessige-verben',
      cefrLevel: 'A1',
      category: 'VERB_TENSES',
      formulaSyntax: '[Verbstamm] + [-e / -st / -t / -en / -t / -en]',
      explanationMarkdown:
        'Regelmäßige Verben im Präsens werden gebildet, indem an den Verbstamm die Personalendungen angehängt werden: ich -e, du -st, er/sie/es -t, wir -en, ihr -t, sie/Sie -en.',
      arabicExplanationMarkdown:
        'تصريف الأفعال المنتظمة في زمن المضارع: نحذف النهاية (en) لنحصل على جذر الفعل، ثم نضيف نهايات الضمائر: ich (-e), du (-st), er/sie/es (-t), wir (-en), ihr (-t), sie/Sie (-en).',
      examples: JSON.stringify([
        { de: 'Ich lerne Deutsch.', ar: 'أنا أتعلم الألمانية.', caseInfo: 'Subjekt (Nom) + Verb + Objekt (Akk)' },
        { de: 'Du lernst fleißig.', ar: 'أنت تتعلم بجد.', caseInfo: 'Subjekt + Verb + Adverb' },
      ]),
      visualDiagram: JSON.stringify({
        type: 'syntax_tree',
        nodes: ['Subjekt', 'Verbstamm + Endung', 'Objekt / Rest'],
      }),
    },
    {
      title: 'Akkusativ bei bestimmten und unbestimmten Artikeln',
      slug: 'akkusativ-artikel',
      cefrLevel: 'A1',
      category: 'CASES',
      formulaSyntax: 'der -> den / ein -> einen / kein -> keinen (Maskulin wechselt zu -en; Feminin/Neutral/Plural bleiben unverändert)',
      explanationMarkdown:
        'Der Akkusativ bezeichnet das direkte Objekt der Handlung. Nur maskuline Nomen verändern ihren Artikel: der -> den, ein -> einen, kein -> keinen.',
      arabicExplanationMarkdown:
        'حالة النصب (Akkusativ) للمفعول به المباشر. المذكر فقط هو الذي يتغير: der تصبح den، و ein تصبح einen، و kein تصبح keinen. المؤنث والمحايد والجمع لا تتغير أدواتهم.',
      examples: JSON.stringify([
        { de: 'Ich habe einen Apfel.', ar: 'لدي تفاحة.', caseInfo: 'einen Apfel = Akkusativ Maskulin' },
        { de: 'Er trinkt das Wasser.', ar: 'هو يشرب الماء.', caseInfo: 'das Wasser = Akkusativ Neutral' },
      ]),
      visualDiagram: JSON.stringify({
        type: 'gender_case_matrix',
        highlight: 'maskulin_change',
      }),
    },
    {
      title: 'Satzstruktur im Hauptsatz (Verb an Position 2)',
      slug: 'satzstruktur-hauptsatz-position-2',
      cefrLevel: 'A1',
      category: 'WORD_ORDER',
      formulaSyntax: '[Position 1 (Subjekt/Angabe)] + [Position 2: Konjugiertes Verb] + [Mittelfeld] + [Satzende]',
      explanationMarkdown:
        'Im deutschen Hauptsatz steht das konjugierte Verb immer an Position 2. Wenn eine Zeitangabe an Position 1 steht, folgt sofort das Verb (Inversion).',
      arabicExplanationMarkdown:
        'ترتيب الجملة الرئيسية: الفعل المصرف يأتي دائماً في الموقع الثاني إجبارياً. إذا بدأنا بالظرف الزماني، يأتي الفعل ثانياً ويليه الفاعل (Inversion).',
      examples: JSON.stringify([
        { de: 'Heute lerne ich Deutsch.', ar: 'اليوم أتعلم أنا الألمانية.', caseInfo: 'Pos 1: Heute | Pos 2: lerne | Pos 3: ich' },
      ]),
      visualDiagram: JSON.stringify({
        type: 'slot_matrix',
        slots: ['Position 1', 'Position 2 (Verb)', 'Satzmitte', 'Satzende'],
      }),
    },
  ];

  for (const rule of grammarRules) {
    const r = await prisma.grammarRule.upsert({
      where: { slug: rule.slug },
      update: {},
      create: rule,
    });

    // Seed drill for this rule
    const drillCount = await prisma.grammarDrill.count({ where: { grammarRuleId: r.id } });
    if (drillCount === 0) {
      if (rule.slug === 'praesens-regelmaessige-verben') {
        await prisma.grammarDrill.create({
          data: {
            grammarRuleId: r.id,
            cefrLevel: 'A1',
            drillType: 'FILL_IN_BLANK',
            questionDe: 'Er ___ jeden Tag Deutsch. (lernen)',
            promptAr: 'اختر تصريف الفعل المناسب للضمير er:',
            options: JSON.stringify(['lerne', 'lernst', 'lernt', 'lernen']),
            correctAnswer: 'lernt',
            explanationAr: 'مع الضمير er نضيف اللاحقة -t إلى جذر الفعل: lernt.',
            difficulty: 1,
          },
        });
      } else if (rule.slug === 'akkusativ-artikel') {
        await prisma.grammarDrill.create({
          data: {
            grammarRuleId: r.id,
            cefrLevel: 'A1',
            drillType: 'CASE_SELECTION',
            questionDe: 'Ich sehe ___ Mann. (der Mann)',
            promptAr: 'اختر الأداة الصحيحة في حالة النصب للمذكر:',
            options: JSON.stringify(['der', 'den', 'dem', 'des']),
            correctAnswer: 'den',
            explanationAr: 'الفعل sehen يتطلب حالة Akkusativ، وأداة der تصبح den في حالة النصب.',
            difficulty: 1,
          },
        });
      }
    }
  }
  console.log(`✅ Grammar Rules & Drills seeded (${grammarRules.length} rules)`);

  // 4. Seed Lemmas & Vocabulary with Complete 5-Sentence System
  const vocabularyItems = [
    {
      lemma: 'Haus',
      word: 'das Haus',
      article: 'DAS',
      plural: 'die Häuser',
      partOfSpeech: 'NOUN',
      cefrLevel: 'A1',
      arabicTranslation: 'البيت / المنزل',
      englishTranslation: 'the house',
      ipaPhonetics: '/haʊ̯s/',
      colorCode: '#22c55e', // Green for DAS
      sentences: [
        {
          no: 1,
          de: 'Das Haus ist sehr groß und modern.',
          ar: 'المنزل كبير جداً وحديث.',
          breakdown: JSON.stringify({ subjekt: 'Das Haus (Nominativ Neutral)', verb: 'ist', praedikativ: 'groß und modern' }),
          verbAssoc: 'sein (Präsens 3. P. Sg.)',
        },
        {
          no: 2,
          de: 'Wir kaufen heute ein neues Haus.',
          ar: 'نحن نشتري اليوم منزلاً جديداً.',
          breakdown: JSON.stringify({ subjekt: 'Wir', verb: 'kaufen', zeit: 'heute', akkusativObjekt: 'ein neues Haus (Akk Neutral)' }),
          verbAssoc: 'kaufen + Akkusativ',
        },
        {
          no: 3,
          de: 'Er wohnt in einem schönen Haus.',
          ar: 'هو يسكن في منزل جميل.',
          breakdown: JSON.stringify({ subjekt: 'Er', verb: 'wohnt', praeposition: 'in + Dativ', dativObjekt: 'einem schönen Haus' }),
          verbAssoc: 'wohnen + in (Dativ)',
        },
        {
          no: 4,
          de: 'Die Kinder spielen vor dem Haus.',
          ar: 'الأطفال يلعبون أمام المنزل.',
          breakdown: JSON.stringify({ subjekt: 'Die Kinder (Plural)', verb: 'spielen', ortsangabe: 'vor dem Haus (Dativ)' }),
          verbAssoc: 'spielen + vor (Dativ)',
        },
        {
          no: 5,
          de: 'Ich gehe jetzt nach Hause.',
          ar: 'أنا ذاهب الآن إلى المنزل.',
          breakdown: JSON.stringify({ idiom: 'nach Hause gehen (إلى المنزل)', verb: 'gehe' }),
          verbAssoc: 'gehen + feste Wendung (nach Hause)',
        },
      ],
    },
    {
      lemma: 'lernen',
      word: 'lernen',
      article: 'NONE',
      plural: null,
      partOfSpeech: 'VERB',
      cefrLevel: 'A1',
      arabicTranslation: 'يتعلم / يدرس',
      englishTranslation: 'to learn / study',
      ipaPhonetics: '/ˈlɛʁnən/',
      verbConjugations: JSON.stringify({
        present: { ich: 'lerne', du: 'lernst', er: 'lernt', wir: 'lernen', ihr: 'lernt', sie: 'lernen' },
        prateritum: { ich: 'lernte', er: 'lernte' },
        perfekt: 'hat gelernt',
        auxiliary: 'haben',
      }),
      governingCases: JSON.stringify(['AKKUSATIV']),
      sentences: [
        {
          no: 1,
          de: 'Ich lerne jeden Tag zwei Stunden Deutsch.',
          ar: 'أنا أتعلم الألمانية كل يوم لمدة ساعتين.',
          breakdown: JSON.stringify({ subjekt: 'Ich', verb: 'lerne', zeitangabe: 'jeden Tag', akkusativObjekt: 'Deutsch' }),
          verbAssoc: 'lernen + Akkusativ',
        },
        {
          no: 2,
          de: 'Warum lernst du diese schwere Sprache?',
          ar: 'لماذا تتعلم هذه اللغة الصعبة؟',
          breakdown: JSON.stringify({ fragewort: 'Warum', verb: 'lernst', subjekt: 'du', objekt: 'diese schwere Sprache (Akk Feminin)' }),
          verbAssoc: 'lernen (Fragesatz)',
        },
        {
          no: 3,
          de: 'Er hat gestern fleißig für die Prüfung gelernt.',
          ar: 'لقد درس بجد أمس من أجل الامتحان.',
          breakdown: JSON.stringify({ zeitform: 'Perfekt', hilfsverb: 'hat', partizip2: 'gelernt', praeposition: 'für + Akkusativ' }),
          verbAssoc: 'Perfekt mit haben',
        },
        {
          no: 4,
          de: 'Wir müssen noch viele neue Wörter lernen.',
          ar: 'يجب علينا أن نتعلم الكثير من الكلمات الجديدة بعد.',
          breakdown: JSON.stringify({ modalverb: 'müssen', vollverbInfinitiv: 'lernen (am Satzende)' }),
          verbAssoc: 'Modalverb + Infinitiv am Ende',
        },
        {
          no: 5,
          de: 'Man lernt nie aus.',
          ar: 'الإنسان يتعلم طوال حياته (مثل ألماني).',
          breakdown: JSON.stringify({ subjekt: 'Man (المجهول)', trennbaresVerb: 'auslernen' }),
          verbAssoc: 'Redewendung: auslernen',
        },
      ],
    },
    {
      lemma: 'Tisch',
      word: 'der Tisch',
      article: 'DER',
      plural: 'die Tische',
      partOfSpeech: 'NOUN',
      cefrLevel: 'A1',
      arabicTranslation: 'الطاولة / المنضدة',
      englishTranslation: 'the table',
      ipaPhonetics: '/tɪʃ/',
      colorCode: '#3b82f6', // Blue for DER
      sentences: [
        {
          no: 1,
          de: 'Der Tisch steht mitten im Zimmer.',
          ar: 'الطاولة تقف في منتصف الغرفة.',
          breakdown: JSON.stringify({ subjekt: 'Der Tisch (Nom Maskulin)', verb: 'steht', ort: 'mitten im Zimmer' }),
          verbAssoc: 'stehen + Dativ',
        },
        {
          no: 2,
          de: 'Er stellt die Kaffeetasse auf den Tisch.',
          ar: 'هو يضع فنجان القهوة على الطاولة.',
          breakdown: JSON.stringify({ subjekt: 'Er', verb: 'stellt (Aktion)', akkusativObjekt: 'auf den Tisch (Akkusativ)' }),
          verbAssoc: 'stellen + auf (Akkusativ)',
        },
        {
          no: 3,
          de: 'Wir brauchen einen größeren Tisch für die Küche.',
          ar: 'نحتاج طاولة أكبر للمطبخ.',
          breakdown: JSON.stringify({ subjekt: 'Wir', verb: 'brauchen', akkusativObjekt: 'einen größeren Tisch (Akk Maskulin)' }),
          verbAssoc: 'brauchen + Akkusativ',
        },
        {
          no: 4,
          de: 'Das Buch liegt unter dem Tisch.',
          ar: 'الكتاب موجود تحت الطاولة.',
          breakdown: JSON.stringify({ subjekt: 'Das Buch', verb: 'liegt (Position)', dativObjekt: 'unter dem Tisch (Dativ)' }),
          verbAssoc: 'liegen + unter (Dativ)',
        },
        {
          no: 5,
          de: 'Setzen wir uns bitte an den Tisch!',
          ar: 'دعونا نجلس إلى الطاولة من فضلكم!',
          breakdown: JSON.stringify({ reflexivVerb: 'sich setzen', praeposition: 'an den Tisch (Richtung/Akk)' }),
          verbAssoc: 'sich setzen an + Akkusativ',
        },
      ],
    },
    {
      lemma: 'Frau',
      word: 'die Frau',
      article: 'DIE',
      plural: 'die Frauen',
      partOfSpeech: 'NOUN',
      cefrLevel: 'A1',
      arabicTranslation: 'المرأة / السيدة / الزوجة',
      englishTranslation: 'the woman / Mrs. / wife',
      ipaPhonetics: '/fʁaʊ̯/',
      colorCode: '#ef4444', // Red for DIE
      sentences: [
        {
          no: 1,
          de: 'Die Frau arbeitet als Ärztin in Berlin.',
          ar: 'السيدة تعمل كطبيبة في برلين.',
          breakdown: JSON.stringify({ subjekt: 'Die Frau (Nom Feminin)', verb: 'arbeitet', berufsangabe: 'als Ärztin' }),
          verbAssoc: 'arbeiten als',
        },
        {
          no: 2,
          de: 'Ich kenne diese freundliche Frau sehr gut.',
          ar: 'أنا أعرف هذه السيدة اللطيفة جيداً.',
          breakdown: JSON.stringify({ subjekt: 'Ich', verb: 'kenne', akkusativObjekt: 'diese freundliche Frau (Akk Feminin)' }),
          verbAssoc: 'kennen + Akkusativ',
        },
        {
          no: 3,
          de: 'Er hilft der alten Frau über die Straße.',
          ar: 'هو يساعد السيدة المسنة في عبور الشارع.',
          breakdown: JSON.stringify({ subjekt: 'Er', verb: 'hilft', dativObjekt: 'der alten Frau (Dativ Feminin: der)' }),
          verbAssoc: 'helfen + Dativ',
        },
        {
          no: 4,
          de: 'Guten Tag, Frau Schmidt!',
          ar: 'طاب يومك يا سيدة شميت!',
          breakdown: JSON.stringify({ anrede: 'Höflichkeitsform / Titel' }),
          verbAssoc: 'Anredeform',
        },
        {
          no: 5,
          de: 'Seine Frau spricht drei Sprachen fließend.',
          ar: 'زوجته تتحدث ثلاث لغات بطلاقة.',
          breakdown: JSON.stringify({ possessiv: 'Seine Frau', verb: 'spricht', akkusativ: 'drei Sprachen' }),
          verbAssoc: 'sprechen (Vokalwechsel e->i)',
        },
      ],
    },
  ];

  for (const item of vocabularyItems) {
    // 1. Ensure lemma exists
    const lemmaRecord = await prisma.lemma.upsert({
      where: { lemma: item.lemma },
      update: {},
      create: {
        lemma: item.lemma,
        partOfSpeech: item.partOfSpeech,
      },
    });

    // 2. Create Vocabulary item
    const existingVocab = await prisma.vocabulary.findFirst({
      where: { lemma: item.lemma, word: item.word },
    });

    let vocabId = existingVocab?.id;
    if (!existingVocab) {
      const created = await prisma.vocabulary.create({
        data: {
          lemmaId: lemmaRecord.id,
          lemma: item.lemma,
          word: item.word,
          article: item.article,
          plural: item.plural,
          partOfSpeech: item.partOfSpeech,
          cefrLevel: item.cefrLevel,
          arabicTranslation: item.arabicTranslation,
          englishTranslation: item.englishTranslation,
          ipaPhonetics: item.ipaPhonetics,
          colorCode: item.colorCode,
          verbConjugations: (item as any).verbConjugations || null,
          governingCases: (item as any).governingCases || null,
          status: 'LEARNING',
        },
      });
      vocabId = created.id;
    }

    // 3. Create the 5 contextual sentences for this vocabulary
    if (vocabId) {
      const sentenceCount = await prisma.sentenceHistory.count({ where: { vocabularyId: vocabId } });
      if (sentenceCount === 0) {
        for (const s of item.sentences) {
          await prisma.sentenceHistory.create({
            data: {
              vocabularyId: vocabId,
              sentenceNumber: s.no,
              sentenceDe: s.de,
              sentenceAr: s.ar,
              grammaticalBreakdown: s.breakdown,
              verbAssociation: s.verbAssoc,
              cefrLevel: item.cefrLevel,
              isCurrentActive: true,
              versionNumber: 1,
            },
          });
        }
      }

      // 4. Initialize FSRS progress for this vocabulary item
      const fsrsExists = await prisma.fsrsProgress.findFirst({
        where: { userId: user.id, vocabularyId: vocabId },
      });
      if (!fsrsExists) {
        await prisma.fsrsProgress.create({
          data: {
            userId: user.id,
            itemType: 'VOCABULARY',
            vocabularyId: vocabId,
            state: 'LEARNING',
            stability: 1.0,
            difficulty: 4.5,
            elapsedDays: 0,
            scheduledDays: 1,
            reps: 1,
            lapses: 0,
            nextReview: new Date(Date.now() + 24 * 60 * 60 * 1000), // Next review tomorrow
          },
        });
      }
    }
  }
  console.log(`✅ Vocabulary with 5-Sentence System & FSRS Progress initialized (${vocabularyItems.length} items)`);

  console.log('🎉 DeutschLab Database Seeding Completed Successfully!');
}

// Execute directly if run as script
if (process.argv[1]?.endsWith('seed.ts') || process.argv[1]?.endsWith('seed.js')) {
  seedDatabase()
    .then(async () => {
      await prisma.$disconnect();
    })
    .catch(async (e) => {
      console.error('❌ Seeding failed:', e);
      await prisma.$disconnect();
      process.exit(1);
    });
}
