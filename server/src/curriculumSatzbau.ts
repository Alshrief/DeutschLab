export interface SatzbauChallenge {
  id: string;
  cefrLevel: 'A1' | 'A2' | 'B1' | 'B2';
  titleAr: string;
  topic: string;
  correctWords: string[];
  translationAr: string;
  grammarRule: string;
  category: 'HAUPTSATZ' | 'NEBENSATZ' | 'TRENNBAR' | 'MODALVERB' | 'PASSIV' | 'RELATIVSATZ';
}

export const curatedSatzbauChallenges: SatzbauChallenge[] = [
  {
    id: 'sb1',
    cefrLevel: 'A1',
    titleAr: 'ترتيب الجملة العادية (الفعل موقع 2)',
    topic: 'Hauptsatz - Normalfolge',
    correctWords: ['Ich', 'trinke', 'jeden', 'Morgen', 'einen', 'heißen', 'Kaffee.'],
    translationAr: 'أنا أشرب كل صباح قهوة ساخنة.',
    grammarRule: 'في الجملة الإخبارية الرئيسية، يقع الفعل المصرف (trinke) دائماً وبشكل قطعي في الموقع الثاني (Position 2).',
    category: 'HAUPTSATZ'
  },
  {
    id: 'sb2',
    cefrLevel: 'A1',
    titleAr: 'تقديم ظرف الزمان (Inversion)',
    topic: 'Hauptsatz - Umstellung',
    correctWords: ['Heute', 'fährt', 'mein', 'Bruder', 'mit', 'dem', 'Zug', 'nach', 'Berlin.'],
    translationAr: 'اليوم يسافر أخي بالقطار إلى برلين.',
    grammarRule: 'عندما تبدأ الجملة بظرف (Heute)، يظل الفعل (fährt) ثابتاً في الموقع الثاني، ويأتي الفاعل (mein Bruder) مباشرة بعده.',
    category: 'HAUPTSATZ'
  },
  {
    id: 'sb3',
    cefrLevel: 'A2',
    titleAr: 'الأفعال المنفصلة (Trennbare Verben)',
    topic: 'Trennbare Verben im Präsens',
    correctWords: ['Der', 'Zug', 'kommt', 'um', 'acht', 'Uhr', 'am', 'Bahnhof', 'an.'],
    translationAr: 'يصل القطار في تمام الساعة الثامنة إلى المحطة.',
    grammarRule: 'في الفعل المنفصل (ankommen): يُصرف أصل الفعل في الموقع الثاني (kommt)، وتُلقى البادئة (an) في نهاية الجملة تماماً.',
    category: 'TRENNBAR'
  },
  {
    id: 'sb4',
    cefrLevel: 'A2',
    titleAr: 'الأفعال الناقصة (Modalverben)',
    topic: 'Modalverb + Infinitiv',
    correctWords: ['Ich', 'muss', 'heute', 'Abend', 'noch', 'für', 'die', 'Prüfung', 'lernen.'],
    translationAr: 'يجب عليّ هذا المساء أن أذاكر من أجل الامتحان.',
    grammarRule: 'يُصرف الفعل الناقص (muss) في الموقع الثاني، بينما يأتي الفعل الأساسي في صيغة المصدر (lernen) في نهاية الجملة كإطار (Satzklammer).',
    category: 'MODALVERB'
  },
  {
    id: 'sb5',
    cefrLevel: 'B1',
    titleAr: 'الجملة السببية بعد weil (فعل في النهاية)',
    topic: 'Nebensatz mit weil',
    correctWords: ['Er', 'lernt', 'fleißig,', 'weil', 'er', 'in', 'Deutschland', 'als', 'Arzt', 'arbeiten', 'will.'],
    translationAr: 'هو يتعلم باجتهاد، لأنه يريد العمل في ألمانيا كطبيب.',
    grammarRule: 'الأداة (weil) تنشئ جملة فرعية (Nebensatz) تدفع بالفعل المصرف (will) إلى الموقع الأخير في نهاية الجملة.',
    category: 'NEBENSATZ'
  },
  {
    id: 'sb6',
    cefrLevel: 'B1',
    titleAr: 'الجملة المفعولية بعد dass',
    topic: 'Nebensatz mit dass',
    correctWords: ['Ich', 'hoffe', 'sehr,', 'dass', 'wir', 'uns', 'bald', 'wiedersehen.'],
    translationAr: 'آمل بشدة أن نلتقي ببعضنا البعض قريباً مرة أخرى.',
    grammarRule: 'أداة الربط (dass) تعني "أنّ"، وتجبر الفعل (wiedersehen) على المجيء في نهاية الجملة الفرعية.',
    category: 'NEBENSATZ'
  },
  {
    id: 'sb7',
    cefrLevel: 'B1',
    titleAr: 'الجملة التناقضية بعد obwohl',
    topic: 'Konzessivsatz mit obwohl',
    correctWords: ['Obwohl', 'es', 'stark', 'regnet,', 'geht', 'sie', 'im', 'Park', 'spazieren.'],
    translationAr: 'على الرغم من أنها تمطر بغزارة، إلا أنها تذهب للتنزه في الحديقة.',
    grammarRule: 'إذا بدأت الجملة بـ obwohl، يذهب فعلها للنهاية (regnet)، وتبدأ الجملة الرئيسية بعدها مباشرة بالفعل (geht) تطبيقاً لقاعدة الفعل في الموقع 2.',
    category: 'NEBENSATZ'
  },
  {
    id: 'sb8',
    cefrLevel: 'B2',
    titleAr: 'المبني للمجهول (Passiv Präteritum)',
    topic: 'Vorgangspassiv',
    correctWords: ['Das', 'historische', 'Rathaus', 'wurde', 'im', 'siebzehnten', 'Jahrhundert', 'vollständig', 'erbaut.'],
    translationAr: 'تم بناء مبنى البلدية التاريخي بالكامل في القرن السابع عشر.',
    grammarRule: 'صيغة المبني للمجهول في الماضي تتكون من تصريف (wurde) في الموقع الثاني، متبوعاً بالتصريف الثالث (erbaut) في نهاية الجملة.',
    category: 'PASSIV'
  },
  {
    id: 'sb9',
    cefrLevel: 'B2',
    titleAr: 'جملة الوصل مع حرف جر (Relativsatz)',
    topic: 'Relativsatz mit Präposition',
    correctWords: ['Das', 'ist', 'das', 'Unternehmen,', 'bei', 'dem', 'ich', 'mich', 'beworben', 'habe.'],
    translationAr: 'هذه هي الشركة التي تقدمت إليها بطلب وظيفة.',
    grammarRule: 'في جملة الوصل، يأتي حرف الجر متبوعاً بالضمير الموصول، ويزحف الفعل المساعد المصرف (habe) إلى نهاية الجملة تماماً.',
    category: 'RELATIVSATZ'
  }
];
