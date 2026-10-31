import prisma from './prisma.js';

export async function seedFullCurriculum() {
  console.log('📚 Starting Full CEFR Curriculum Ingestion (A1 -> B2)...');

  const defaultUser = await prisma.user.findFirst();
  if (!defaultUser) throw new Error('Default user not found. Run basic seed first.');

  // ==========================================
  // 1. COMPREHENSIVE GRAMMAR RULES (A1 to B2)
  // ==========================================
  const advancedRules = [
    // --- A1 ---
    {
      title: 'Trennbare Verben (الأفعال المنفصلة)',
      slug: 'trennbare-verben-a1',
      cefrLevel: 'A1',
      category: 'VERB_TENSES',
      formulaSyntax: '[Subjekt] + [Verbstamm (konjugiert an Pos 2)] + ... + [Präfix (am Satzende)]',
      explanationMarkdown: 'Bei trennbaren Verben (ab-, an-, auf-, aus-, ein-, mit-, vor-, zu-) steht das Präfix im Hauptsatz ganz am Ende.',
      arabicExplanationMarkdown: 'الأفعال المنفصلة تتكون من بادئة وجذر. في الجملة الرئيسية، يُصرف جذر الفعل في الموقع الثاني، بينما تُلقى البادئة إجبارياً في أقصى نهاية الجملة.',
      examples: JSON.stringify([
        { de: 'Ich stehe jeden Tag um 7 Uhr auf.', ar: 'أنا أستيقظ كل يوم في الساعة السابعة.', caseInfo: 'aufstehen -> stehe ... auf' },
        { de: 'Er kauft im Supermarkt ein.', ar: 'هو يتسوق في السوبرماركت.', caseInfo: 'einkaufen -> kauft ... ein' },
      ]),
      visualDiagram: JSON.stringify({ type: 'bracket', left: 'Verbstamm (Pos 2)', right: 'Präfix (Ende)' }),
      drill: {
        drillType: 'FILL_IN_BLANK',
        questionDe: 'Der Zug kommt pünktlich um 10 Uhr ___ . (ankommen)',
        promptAr: 'اختر البادئة المناسبة لنهاية الجملة:',
        options: JSON.stringify(['an', 'auf', 'aus', 'ein']),
        correctAnswer: 'an',
        explanationAr: 'الفعل ankommen فعل منفصل، وبادئته هي an وتأتي في نهاية الجملة.',
      },
    },
    {
      title: 'Modalverben im Präsens (الأفعال الناقصة)',
      slug: 'modalverben-praesens-a1',
      cefrLevel: 'A1',
      category: 'MODAL_VERBS',
      formulaSyntax: '[Subjekt] + [Modalverb (konjugiert Pos 2)] + [Objekte/Angaben] + [Vollverb im Infinitiv (am Satzende)]',
      explanationMarkdown: 'Modalverben (können, müssen, wollen, dürfen, sollen, möchten) stehen an Position 2. Das Vollverb steht im Infinitiv am Ende.',
      arabicExplanationMarkdown: 'الأفعال الناقصة تصرف في الموقع الثاني وتفرض مجيء الفعل الأصلي في صيغة المصدر (Infinitiv) في أقصى نهاية الجملة.',
      examples: JSON.stringify([
        { de: 'Ich kann sehr gut Deutsch sprechen.', ar: 'أستطيع التحدث بالألمانية جيداً جداً.', caseInfo: 'kann (Pos 2) ... sprechen (Infinitiv am Ende)' },
      ]),
      visualDiagram: JSON.stringify({ type: 'modal_bracket' }),
      drill: {
        drillType: 'FILL_IN_BLANK',
        questionDe: 'Wir müssen heute viel Deutsch ___ .',
        promptAr: 'اختر شكل الفعل الصحيح في نهاية الجملة:',
        options: JSON.stringify(['lernen', 'lernt', 'lernte', 'gelernt']),
        correctAnswer: 'lernen',
        explanationAr: 'الفعل الناقص müssen يتطلب مصدراً (Infinitiv) ينتهي بـ -en في نهاية الجملة.',
      },
    },

    // --- A2 ---
    {
      title: 'Wechselpräpositionen (حروف الجر المكانية المشتركة)',
      slug: 'wechselpraepositionen-a2',
      cefrLevel: 'A2',
      category: 'CASES',
      formulaSyntax: 'Wohin? (حركة/اتجاه) -> Akkusativ | Wo? (سكون/موقع ثابت) -> Dativ',
      explanationMarkdown: 'Die 9 Wechselpräpositionen (an, auf, hinter, in, neben, über, unter, vor, zwischen) verlangen Akkusativ bei Bewegung (Wohin?) und Dativ bei Position (Wo?).',
      arabicExplanationMarkdown: 'حروف الجر التسعة المشتركة: إذا كانت الجملة تدل على انتقال أو حركة (إلى أين؟ Wohin) نستخدم Akkusativ. أما إذا دلت على موقع ثابت وسكون (أين؟ Wo) نستخدم Dativ.',
      examples: JSON.stringify([
        { de: 'Ich lege das Buch auf den Tisch. (Wohin? -> Akk)', ar: 'أنا أضع الكتاب على الطاولة (حركة -> Akkusativ).' },
        { de: 'Das Buch liegt auf dem Tisch. (Wo? -> Dat)', ar: 'الكتاب موجود على الطاولة (سكون -> Dativ).' },
      ]),
      visualDiagram: JSON.stringify({ type: 'case_switch' }),
      drill: {
        drillType: 'CASE_SELECTION',
        questionDe: 'Das Bild hängt an ___ Wand. (die Wand - Wo?)',
        promptAr: 'اختر الأداة الصحيحة في حالة السكون (Dativ للمؤنث):',
        options: JSON.stringify(['der', 'die', 'den', 'dem']),
        correctAnswer: 'der',
        explanationAr: 'السؤال عن الموقع الثابت Wo? يتطلب Dativ، وأداة die للمؤنث تصبح der في Dativ.',
      },
    },
    {
      title: 'Nebensätze mit "weil" und "dass" (الجمل الفرعية)',
      slug: 'nebensaetze-weil-dass-a2',
      cefrLevel: 'A2',
      category: 'WORD_ORDER',
      formulaSyntax: '[Hauptsatz] + , + [weil / dass] + [Subjekt] + ... + [Konjugiertes Verb (ganz am Satzende)]',
      explanationMarkdown: 'Konnektoren wie "weil" (لأن) und "dass" (أن) leiten einen Nebensatz ein. Das konjugierte Verb wandert ans Satzende.',
      arabicExplanationMarkdown: 'أدوات الربط الفرعية مثل weil و dass تدفع بالفعل المصرف إجبارياً إلى نهاية الجملة الفرعية تماماً.',
      examples: JSON.stringify([
        { de: 'Ich lerne Deutsch, weil ich in Berlin arbeiten will.', ar: 'أتعلم الألمانية لأنني أريد العمل في برلين.' },
      ]),
      visualDiagram: JSON.stringify({ type: 'verb_end_order' }),
      drill: {
        drillType: 'REORDER_WORDS',
        questionDe: 'Er kommt nicht, weil er krank ___ .',
        promptAr: 'اختر الفعل وموقعه الصحيح:',
        options: JSON.stringify(['ist', 'sein', 'wird', 'hat']),
        correctAnswer: 'ist',
        explanationAr: 'الفعل المصرف ist يأتي في نهاية الجملة الفرعية بعد weil.',
      },
    },

    // --- B1 ---
    {
      title: 'Passiv Präsens (المبني للمجهول في المضارع)',
      slug: 'passiv-praesens-b1',
      cefrLevel: 'B1',
      category: 'PASSIV',
      formulaSyntax: '[Objekt als Subjekt] + [werden (konjugiert)] + (von + Dativ) + [Partizip II (am Satzende)]',
      explanationMarkdown: 'Das Vorgangspassiv betont die Handlung, nicht den Täter: werden (im Präsens) + Partizip II am Satzende.',
      arabicExplanationMarkdown: 'المبني للمجهول يركز على الحدث نفسه. يتكون من تصريف الفعل werden في الموقع الثاني + اسم المفعول Partizip II في نهاية الجملة.',
      examples: JSON.stringify([
        { de: 'Das Haus wird gebaut.', ar: 'المنزل يُبنى (الآن).' },
        { de: 'Der Brief wird vom Chef unterschrieben.', ar: 'الخطاب يُوقَّع بواسطة المدير.' },
      ]),
      visualDiagram: JSON.stringify({ type: 'passive_tree' }),
      drill: {
        drillType: 'FILL_IN_BLANK',
        questionDe: 'Die E-Mails ___ täglich vom Sekretariat beantwortet.',
        promptAr: 'اختر تصريف werden المناسب للجمع (Die E-Mails):',
        options: JSON.stringify(['werden', 'wird', 'wurden', 'worden']),
        correctAnswer: 'werden',
        explanationAr: 'الفاعل جمع (Die E-Mails)، وتصريف werden في المضارع مع الجمع هو werden.',
      },
    },
    {
      title: 'Relativsätze im Nominativ, Akkusativ und Dativ (الجمل الموصولة)',
      slug: 'relativsaetze-b1',
      cefrLevel: 'B1',
      category: 'RELATIVSATZ',
      formulaSyntax: '[Bezugswort] + , + [Relativpronomen (Genus & Numerus vom Bezugswort, Kasus von der Funktion)] + ... + [Verb am Ende]',
      explanationMarkdown: 'Das Relativpronomen richtet sich in Genus und Numerus nach dem Bezugswort, im Kasus nach seiner Rolle im Nebensatz.',
      arabicExplanationMarkdown: 'ضمير الوصل يطابق الاسم الموصوف في الجنس والعدد، وتتحدد حالته الإعرابية (Nom/Akk/Dat) حسب موقعه داخل الجملة الموصولة، مع مجيء الفعل في النهاية.',
      examples: JSON.stringify([
        { de: 'Das ist der Mann, der hier wohnt. (Nominativ)', ar: 'هذا هو الرجل الذي يسكن هنا.' },
        { de: 'Das ist der Mann, den ich gestern gesehen habe. (Akkusativ)', ar: 'هذا هو الرجل الذي رأيته أمس.' },
        { de: 'Das ist der Mann, dem ich helfe. (Dativ)', ar: 'هذا هو الرجل الذي أساعده.' },
      ]),
      visualDiagram: JSON.stringify({ type: 'relative_matrix' }),
      drill: {
        drillType: 'CASE_SELECTION',
        questionDe: 'Hier ist das Buch, ___ ich seit Wochen suche.',
        promptAr: 'اختر ضمير الوصل الصحيح (das Buch - Akkusativ):',
        options: JSON.stringify(['das', 'dem', 'dessen', 'den']),
        correctAnswer: 'das',
        explanationAr: 'الاسم الموصوف محايد (das Buch) وفي الجملة الموصولة هو مفعول به للفعل suchen (Akkusativ Neutral: das).',
      },
    },
    {
      title: 'Konjunktiv II der Höflichkeit und Wünsche (صيغة التمني والطلب المهذب)',
      slug: 'konjunktiv-2-b1',
      cefrLevel: 'B1',
      category: 'KONJUNKTIV',
      formulaSyntax: 'Höflichkeit: würde + Infinitiv / hätte / wäre / könnte',
      explanationMarkdown: 'Der Konjunktiv II wird verwendet für höfliche Bitten, Ratschläge (sollte) und irreale Wünsche.',
      arabicExplanationMarkdown: 'تُستخدم صيغة Konjunktiv II للتعبير عن الطلب المهذب الشديد (würde gern / könnten Sie) وللتعبير عن التمني والأمور غير الواقعية (لو كان لدي / لو كنت).',
      examples: JSON.stringify([
        { de: 'Ich hätte gern einen Kaffee, bitte.', ar: 'أود الحصول على قهوة من فضلك (طلب مهذب).' },
        { de: 'Könnten Sie mir bitte helfen?', ar: 'هل يمكن لحضرتك مساعدتي من فضلك؟' },
        { de: 'Wenn ich reich wäre, würde ich eine Weltreise machen.', ar: 'لو كنت ثرياً لقمت برحلة حول العالم.' },
      ]),
      visualDiagram: JSON.stringify({ type: 'konjunktiv_formula' }),
      drill: {
        drillType: 'FILL_IN_BLANK',
        questionDe: '___ Sie mir bitte das Salz geben?',
        promptAr: 'اختر صيغة الطلب المهذب (Konjunktiv II):',
        options: JSON.stringify(['Könnten', 'Können', 'Kann', 'Konnten']),
        correctAnswer: 'Könnten',
        explanationAr: 'Könnten هي صيغة Konjunktiv II للفعل können للطلب في منتهى اللباقة.',
      },
    },

    // --- B2 ---
    {
      title: 'Passiv-Ersatzformen (بدائل المبني للمجهول)',
      slug: 'passiv-ersatzformen-b2',
      cefrLevel: 'B2',
      category: 'PASSIV',
      formulaSyntax: 'sich lassen + Infinitiv  <=>  sein + zu + Infinitiv  <=>  -bar / -lich Adjektive',
      explanationMarkdown: 'Im gehobenen Deutsch (B2/C1) wird das Passiv oft durch elegante Ersatzformen ausgedrückt (z.B. Das Problem lässt sich leicht lösen = Das Problem kann leicht gelöst werden).',
      arabicExplanationMarkdown: 'في اللغة الأكاديمية والمهنية المتقدمة B2، تُستبدل صيغة Passiv ببدائل أكثر بلاغة مثل: sich lassen + المصدر، أو sein + zu + المصدر، أو الصفات المنتهية بـ -bar.',
      examples: JSON.stringify([
        { de: 'Diese Aufgabe lässt sich einfach lösen.', ar: 'هذه المهمة قابلة للحل بسهولة (= يمكن حلها).' },
        { de: 'Die Regeln sind genau zu beachten.', ar: 'يجب مراعاة القواعد بدقة (= müssen beachtet werden).' },
      ]),
      visualDiagram: JSON.stringify({ type: 'substitution_flowchart' }),
      drill: {
        drillType: 'FILL_IN_BLANK',
        questionDe: 'Das Dokument ___ sich leider nicht öffnen.',
        promptAr: 'اختر الفعل البديل المناسب (sich lassen):',
        options: JSON.stringify(['lässt', 'wird', 'macht', 'kann']),
        correctAnswer: 'lässt',
        explanationAr: 'التركيب هو sich lassen + Infinitiv ويعني (يمكن / يستطاع).',
      },
    },
    {
      title: 'Feste Nomen-Verb-Verbindungen (التراكيب الفعلية الاصطلاحية)',
      slug: 'nomen-verb-verbindungen-b2',
      cefrLevel: 'B2',
      category: 'IDIOMS',
      formulaSyntax: '[Nomen mit Präposition] + [Funktionsverb] (z.B. eine Entscheidung treffen = entscheiden)',
      explanationMarkdown: 'Funktionsverbgefüge sind feste Kombinationen aus Nomen und Verben, die oft ein einfaches Verb ersetzen.',
      arabicExplanationMarkdown: 'متلازمات الأسماء والأفعال الاصطلاحية في المستوى B2: استبدال الفعل البسيط بتركيب بلاغي راقٍ (مثال: بدلاً من entscheiden نستخدم eine Entscheidung treffen أي اتخذ قراراً).',
      examples: JSON.stringify([
        { de: 'Wir müssen bald eine Entscheidung treffen.', ar: 'علينا اتخاذ قرار قريباً (= entscheiden).' },
        { de: 'Das Angebot steht Ihnen jederzeit zur Verfügung.', ar: 'العرض متاح تحت تصرفك في أي وقت (= ist verfügbar).' },
      ]),
      visualDiagram: JSON.stringify({ type: 'collocation_pair' }),
      drill: {
        drillType: 'FILL_IN_BLANK',
        questionDe: 'Die Ergebnisse stehen noch nicht zur ___ .',
        promptAr: 'أكمل المتلازمة الاصطلاحية zur ___ stehen:',
        options: JSON.stringify(['Verfügung', 'Entscheidung', 'Absicht', 'Befehl']),
        correctAnswer: 'Verfügung',
        explanationAr: 'التعبير الاصطلاحي هو zur Verfügung stehen وتعني متاح / قيد التصرف.',
      },
    },
  ];

  for (const r of advancedRules) {
    const existing = await prisma.grammarRule.findUnique({ where: { slug: r.slug } });
    let ruleId = existing?.id;
    if (!existing) {
      const created = await prisma.grammarRule.create({
        data: {
          title: r.title,
          slug: r.slug,
          cefrLevel: r.cefrLevel,
          category: r.category,
          formulaSyntax: r.formulaSyntax,
          explanationMarkdown: r.explanationMarkdown,
          arabicExplanationMarkdown: r.arabicExplanationMarkdown,
          examples: r.examples,
          visualDiagram: r.visualDiagram,
        },
      });
      ruleId = created.id;
    }

    if (ruleId && r.drill) {
      const dCount = await prisma.grammarDrill.count({ where: { grammarRuleId: ruleId } });
      if (dCount === 0) {
        await prisma.grammarDrill.create({
          data: {
            grammarRuleId: ruleId,
            cefrLevel: r.cefrLevel,
            drillType: r.drill.drillType,
            questionDe: r.drill.questionDe,
            promptAr: r.drill.promptAr,
            options: r.drill.options,
            correctAnswer: r.drill.correctAnswer,
            explanationAr: r.drill.explanationAr,
            difficulty: 2,
          },
        });
      }
    }
  }
  console.log(`✅ Loaded ${advancedRules.length} Advanced CEFR Grammar Rules & Drills`);

  // ==========================================
  // 2. HIGH-YIELD GOETHE VOCABULARY (A1, A2, B1, B2)
  // Each with the complete 5-Sentence Rule
  // ==========================================
  const curriculumVocab = [
    // --- A1 ---
    {
      lemma: 'arbeiten',
      word: 'arbeiten',
      article: 'NONE',
      plural: null,
      partOfSpeech: 'VERB',
      cefrLevel: 'A1',
      arabicTranslation: 'يعمل / يشتغل',
      englishTranslation: 'to work',
      ipaPhonetics: '/ˈaʁbaɪ̯tn̩/',
      verbConjugations: JSON.stringify({
        present: { ich: 'arbeite', du: 'arbeitest', er: 'arbeitet', wir: 'arbeiten', ihr: 'arbeitet', sie: 'arbeiten' },
        perfekt: 'hat gearbeitet',
        auxiliary: 'haben',
      }),
      governingCases: JSON.stringify(['als + Berufsbezeichnung', 'bei + Dativ (Firma)']),
      sentences: [
        { no: 1, de: 'Ich arbeite als Softwareentwickler in Frankfurt.', ar: 'أعمل كمطور برمجيات في فرانكفورت.', breakdown: { subjekt: 'Ich', verb: 'arbeite', beruf: 'als Softwareentwickler' } },
        { no: 2, de: 'Wo arbeitest du zurzeit?', ar: 'أين تعمل في الوقت الحالي؟', breakdown: { fragewort: 'Wo', verb: 'arbeitest', zeit: 'zurzeit' } },
        { no: 3, de: 'Er arbeitet bei einer großen internationalen Firma.', ar: 'هو يعمل لدى شركة دولية كبيرة.', breakdown: { praeposition: 'bei + Dativ', dativ: 'einer großen Firma' } },
        { no: 4, de: 'Wir haben gestern bis spät in die Nacht gearbeitet.', ar: 'لقد عملنا أمس حتى وقت متأخر من الليل.', breakdown: { zeitform: 'Perfekt', hilfsverb: 'haben', partizip2: 'gearbeitet' } },
        { no: 5, de: 'Am Wochenende möchte ich nicht arbeiten.', ar: 'في عطلة نهاية الأسبوع لا أود العمل.', breakdown: { modalverb: 'möchte', infinitiv: 'arbeiten' } },
      ],
    },
    {
      lemma: 'Auto',
      word: 'das Auto',
      article: 'DAS',
      plural: 'die Autos',
      partOfSpeech: 'NOUN',
      cefrLevel: 'A1',
      arabicTranslation: 'السيارة',
      englishTranslation: 'the car',
      ipaPhonetics: '/ˈaʊ̯to/',
      colorCode: '#22c55e',
      sentences: [
        { no: 1, de: 'Das Auto ist neu und sehr sparsam.', ar: 'السيارة جديدة واقتصادية جداً في استهلاك الوقود.', breakdown: { subjekt: 'Das Auto (Nom Neutral)', verb: 'ist' } },
        { no: 2, de: 'Ich fahre mit dem Auto zur Arbeit.', ar: 'أنا أذهب بالسيارة إلى العمل.', breakdown: { praeposition: 'mit + Dativ', dativ: 'dem Auto' } },
        { no: 3, de: 'Er repariert heute sein altes Auto.', ar: 'هو يصلح سيارته القديمة اليوم.', breakdown: { akkusativ: 'sein altes Auto' } },
        { no: 4, de: 'Wo kann ich mein Auto parken?', ar: 'أين يمكنني ركن سيارتي؟', breakdown: { modalverb: 'kann', verb: 'parken' } },
        { no: 5, de: 'Vor dem Haus stehen drei deutsche Autos.', ar: 'أمام المنزل تقف ثلاث سيارات ألمانية.', breakdown: { plural: 'drei Autos' } },
      ],
    },

    // --- A2 ---
    {
      lemma: 'Reise',
      word: 'die Reise',
      article: 'DIE',
      plural: 'die Reisen',
      partOfSpeech: 'NOUN',
      cefrLevel: 'A2',
      arabicTranslation: 'الرحلة / السفر',
      englishTranslation: 'the trip / journey',
      ipaPhonetics: '/ˈʁaɪ̯zə/',
      colorCode: '#ef4444',
      sentences: [
        { no: 1, de: 'Die Reise nach München dauert vier Stunden mit dem Zug.', ar: 'الرحلة إلى ميونخ تستغرق أربع ساعات بالقطار.', breakdown: { subjekt: 'Die Reise (Nom Feminin)', verb: 'dauert' } },
        { no: 2, de: 'Ich wünsche dir eine gute und sichere Reise!', ar: 'أتمنى لك رحلة موفقة وآمنة!', breakdown: { dativ: 'dir', akkusativ: 'eine gute Reise (Akk Feminin)' } },
        { no: 3, de: 'Wir haben die ganze Reise online gebucht.', ar: 'لقد حجزنا الرحلة بأكملها عبر الإنترنت.', breakdown: { zeitform: 'Perfekt', hilfsverb: 'haben', partizip2: 'gebucht' } },
        { no: 4, de: 'Auf meiner letzten Reise habe ich viele nette Menschen kennengelernt.', ar: 'في رحلتي الأخيرة تعرفت على الكثير من الأشخاص اللطفاء.', breakdown: { praeposition: 'auf + Dativ', dativ: 'meiner letzten Reise' } },
        { no: 5, de: 'Reisen bildet den Geist und öffnet den Horizont.', ar: 'السفر يثري العقل ويفتح الآفاق (مثل ألماني).', breakdown: { substantiviertesVerb: 'Reisen' } },
      ],
    },
    {
      lemma: 'entscheiden',
      word: 'entscheiden',
      article: 'NONE',
      plural: null,
      partOfSpeech: 'VERB',
      cefrLevel: 'A2',
      arabicTranslation: 'يقرر / يحسم الأمر',
      englishTranslation: 'to decide',
      ipaPhonetics: '/ɛntˈʃaɪ̯dn̩/',
      verbConjugations: JSON.stringify({
        present: { ich: 'entscheide', du: 'entscheidest', er: 'entscheidet', wir: 'entscheiden' },
        perfekt: 'hat entschieden',
        auxiliary: 'haben',
      }),
      governingCases: JSON.stringify(['über + Akkusativ', 'sich entscheiden für + Akkusativ']),
      sentences: [
        { no: 1, de: 'Ich kann mich noch nicht entscheiden.', ar: 'لا أستطيع اتخاذ قراري بعد.', breakdown: { reflexiv: 'mich entscheiden', modalverb: 'kann' } },
        { no: 2, de: 'Er hat sich für das Studium in Deutschland entschieden.', ar: 'لقد اختار وقرر الدراسة في ألمانيا.', breakdown: { praeposition: 'für + Akkusativ', perfekt: 'hat entschieden' } },
        { no: 3, de: 'Der Chef muss heute über das neue Projekt entscheiden.', ar: 'يجب على المدير أن يحسم الأمر اليوم بشأن المشروع الجديد.', breakdown: { praeposition: 'über + Akkusativ' } },
        { no: 4, de: 'Wer entscheidet in dieser wichtigen Frage?', ar: 'من يقرر في هذه المسألة المهمة؟', breakdown: { fragewort: 'Wer (Nominativ)' } },
        { no: 5, de: 'Diese Erfahrung hat über seine ganze Zukunft entschieden.', ar: 'هذه التجربة حسمت مستقبله بالكامل.', breakdown: { praeposition: 'über + Akkusativ' } },
      ],
    },

    // --- B1 ---
    {
      lemma: 'Erfolg',
      word: 'der Erfolg',
      article: 'DER',
      plural: 'die Erfolge',
      partOfSpeech: 'NOUN',
      cefrLevel: 'B1',
      arabicTranslation: 'النجاح / الإنجاز',
      englishTranslation: 'the success',
      ipaPhonetics: '/ɛɐ̯ˈfɔlk/',
      colorCode: '#3b82f6',
      sentences: [
        { no: 1, de: 'Der Erfolg hängt von harter und kontinuierlicher Arbeit ab.', ar: 'النجاح يعتمد على العمل الجاد والمستمر.', breakdown: { trennbaresVerb: 'abhängen von + Dativ' } },
        { no: 2, de: 'Ich wünsche Ihnen viel Erfolg bei der B1-Prüfung!', ar: 'أتمنى لحضرتك الكثير من النجاح في امتحان B1!', breakdown: { akkusativ: 'viel Erfolg', praeposition: 'bei + Dativ' } },
        { no: 3, de: 'Das neue Produkt war ein riesiger Erfolg auf dem Markt.', ar: 'المنتج الجديد حقق نجاحاً هائلاً في السوق.', breakdown: { praedikativ: 'ein riesiger Erfolg' } },
        { no: 4, de: 'Ohne Disziplin kann man keinen langfristigen Erfolg erzielen.', ar: 'بدون انضباط لا يمكن للمرء تحقيق نجاح طويل الأمد.', breakdown: { praeposition: 'ohne + Akkusativ', akkusativ: 'keinen Erfolg' } },
        { no: 5, de: 'Wir feiern heute den gemeinsamen Erfolg unseres Teams.', ar: 'نحن نحتفل اليوم بالنجاح المشترك لفريقنا.', breakdown: { akkusativ: 'den gemeinsamen Erfolg (Akk Maskulin)' } },
      ],
    },
    {
      lemma: 'verbessern',
      word: 'verbessern',
      article: 'NONE',
      plural: null,
      partOfSpeech: 'VERB',
      cefrLevel: 'B1',
      arabicTranslation: 'يحسّن / يطوّر / يصوّب',
      englishTranslation: 'to improve / enhance',
      ipaPhonetics: '/fɛɐ̯ˈbɛsɐn/',
      verbConjugations: JSON.stringify({
        present: { ich: 'verbessere', du: 'verbesserst', er: 'verbessert', wir: 'verbessern' },
        perfekt: 'hat verbessert',
        auxiliary: 'haben',
      }),
      governingCases: JSON.stringify(['AKKUSATIV', 'sich verbessern in + Dativ']),
      sentences: [
        { no: 1, de: 'Ich möchte meine Aussprache und Grammatik verbessern.', ar: 'أود أن أحسّن نطقي وقواعدي.', breakdown: { akkusativObjekt: 'meine Aussprache (Akk Feminin)' } },
        { no: 2, de: 'Mit täglicher Übung hat er sein Deutsch deutlich verbessert.', ar: 'مع الممارسة اليومية حسّن لغته الألمانية بشكل ملحوظ.', breakdown: { zeitform: 'Perfekt', hilfsverb: 'hat' } },
        { no: 3, de: 'Die neue Software verbessert die Produktivität des gesamten Teams.', ar: 'البرنامج الجديد يرفع إنتاجية الفريق بأكمله.', breakdown: { genitiv: 'des gesamten Teams' } },
        { no: 4, de: 'Er hat sich im Hörverstehen stark verbessert.', ar: 'لقد تطور مستواه كثيراً في مهارة فهم المسموع.', breakdown: { reflexiv: 'sich verbessern in + Dativ' } },
        { no: 5, de: 'Es gibt immer etwas, das man noch verbessern kann.', ar: 'هناك دائماً شيء يمكن للمرء تحسينه أيضاً.', breakdown: { relativsatz: 'das man noch verbessern kann' } },
      ],
    },

    // --- B2 ---
    {
      lemma: 'Verantwortung',
      word: 'die Verantwortung',
      article: 'DIE',
      plural: 'die Verantwortungen',
      partOfSpeech: 'NOUN',
      cefrLevel: 'B2',
      arabicTranslation: 'المسؤولية',
      englishTranslation: 'the responsibility',
      ipaPhonetics: '/fɛɐ̯ˈʔantvɔʁtʊŋ/',
      colorCode: '#ef4444',
      sentences: [
        { no: 1, de: 'In dieser Führungsposition trage ich eine hohe Verantwortung.', ar: 'في هذا المنصب القيادي أحمل على عاتقي مسؤولية كبيرة.', breakdown: { kollokation: 'Verantwortung tragen (يحمل مسؤولية)' } },
        { no: 2, de: 'Jeder Bürger muss Verantwortung für den Umweltschutz übernehmen.', ar: 'يجب على كل مواطن أن يتحمل المسؤولية تجاه حماية البيئة.', breakdown: { kollokation: 'Verantwortung übernehmen für + Akkusativ' } },
        { no: 3, de: 'Er weigert sich beharrlich, die Verantwortung für den Fehler zu tragen.', ar: 'هو يرفض بإصرار تحمل مسؤولية هذا الخطأ.', breakdown: { infinitivsatz: 'Verantwortung zu tragen' } },
        { no: 4, de: 'Wir handeln stets im vollen Bewusstsein unserer gesellschaftlichen Verantwortung.', ar: 'نحن نتصرف دائماً بإدراك كامل لمسؤوليتنا المجتمعية.', breakdown: { genitiv: 'unserer Verantwortung (Genitiv Feminin)' } },
        { no: 5, de: 'Wer ein Team leitet, steht in einer besonderen ethischen Verantwortung.', ar: 'من يقود فريقاً يقع على عاتقه التزام ومسؤولية أخلاقية خاصة.', breakdown: { relativsatz: 'Wer ... leitet' } },
      ],
    },
    {
      lemma: 'verhandeln',
      word: 'verhandeln',
      article: 'NONE',
      plural: null,
      partOfSpeech: 'VERB',
      cefrLevel: 'B2',
      arabicTranslation: 'يتفاوض / يتباحث في أمر',
      englishTranslation: 'to negotiate',
      ipaPhonetics: '/fɛɐ̯ˈhandl̩n/',
      verbConjugations: JSON.stringify({
        present: { ich: 'verhandle', du: 'verhandelst', er: 'verhandelt', wir: 'verhandeln' },
        perfekt: 'hat verhandelt',
        auxiliary: 'haben',
      }),
      governingCases: JSON.stringify(['über + Akkusativ', 'mit + Dativ']),
      sentences: [
        { no: 1, de: 'Die beiden Delegationen verhandeln über einen neuen Friedensvertrag.', ar: 'الوفدان يتفاوضان حول معاهدة سلام جديدة.', breakdown: { praeposition: 'über + Akkusativ' } },
        { no: 2, de: 'Ich habe gestern erfolgreich über mein Gehalt verhandelt.', ar: 'لقد تفاوضت بالأمس بنجاح بشأن راتبي.', breakdown: { zeitform: 'Perfekt', hilfsverb: 'haben' } },
        { no: 3, de: 'Wir müssen mit den Lieferanten über die aktuellen Lieferkonditionen verhandeln.', ar: 'علينا التفاوض مع الموردين حول شروط التوريد الحالية.', breakdown: { praeposition: 'mit + Dativ (Lieferanten)' } },
        { no: 4, de: 'Über diesen strittigen Punkt lässt sich nicht mehr verhandeln.', ar: 'هذه النقطة الخلافية لم تعد قابلة للتفاوض (= Passiv-Ersatzform).', breakdown: { passivErsatz: 'lässt sich verhandeln' } },
        { no: 5, de: 'Er versteht es meisterhaft, unter hohem Druck souverän zu verhandeln.', ar: 'إنه يتقن ببراعة التفاوض بثقة وثبات تحت الضغوط الشديدة.', breakdown: { infinitivsatz: 'souverän zu verhandeln' } },
      ],
    },
  ];

  for (const item of curriculumVocab) {
    const lemmaRec = await prisma.lemma.upsert({
      where: { lemma: item.lemma },
      update: {},
      create: { lemma: item.lemma, partOfSpeech: item.partOfSpeech },
    });

    const existingVocab = await prisma.vocabulary.findFirst({
      where: { lemma: item.lemma, word: item.word },
    });

    let vocabId = existingVocab?.id;
    if (!existingVocab) {
      const created = await prisma.vocabulary.create({
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
          verbConjugations: (item as any).verbConjugations || null,
          governingCases: (item as any).governingCases || null,
          status: 'LEARNING',
        },
      });
      vocabId = created.id;
    }

    if (vocabId) {
      const sCount = await prisma.sentenceHistory.count({ where: { vocabularyId: vocabId } });
      if (sCount === 0) {
        for (const s of item.sentences) {
          await prisma.sentenceHistory.create({
            data: {
              vocabularyId: vocabId,
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

      // Schedule in FSRS
      const fsrsExists = await prisma.fsrsProgress.findFirst({
        where: { userId: defaultUser.id, vocabularyId: vocabId },
      });
      if (!fsrsExists) {
        await prisma.fsrsProgress.create({
          data: {
            userId: defaultUser.id,
            itemType: 'VOCABULARY',
            vocabularyId: vocabId,
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
  }

  console.log(`✅ Loaded ${curriculumVocab.length} Multi-level Vocabulary Items with 5-Sentences & FSRS`);
  console.log('🎉 Full Curriculum Ingestion Completed Successfully!');
}

if (process.argv[1]?.includes('curriculumSeed')) {
  seedFullCurriculum()
    .then(async () => {
      await prisma.$disconnect();
    })
    .catch(async (e) => {
      console.error(e);
      await prisma.$disconnect();
      process.exit(1);
    });
}
