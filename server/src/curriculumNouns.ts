export interface NounItem {
  id: string;
  article: 'der' | 'die' | 'das';
  word: string;
  plural: string;
  translationAr: string;
  cefrLevel: 'A1' | 'A2' | 'B1' | 'B2';
  category: string;
  ruleHint: string;
}

export const curatedGermanNouns: NounItem[] = [
  // --- MASCULINE (der) ---
  {
    id: 'n1',
    article: 'der',
    word: 'Tisch',
    plural: 'die Tische',
    translationAr: 'طاولة',
    cefrLevel: 'A1',
    category: 'Wohnen',
    ruleHint: 'أغلب قطع الأثاث الكبيرة تأخذ der أو das (der Tisch, der Schrank, der Stuhl).'
  },
  {
    id: 'n2',
    article: 'der',
    word: 'Schlüssel',
    plural: 'die Schlüssel',
    translationAr: 'مفتاح',
    cefrLevel: 'A1',
    category: 'Alltag',
    ruleHint: 'الكلمات المنتهية بـ -el المشتقة من أدوات غالباً تأخذ der (der Schlüssel, der Löffel).'
  },
  {
    id: 'n3',
    article: 'der',
    word: 'Bahnhof',
    plural: 'die Bahnhöfe',
    translationAr: 'محطة قطار',
    cefrLevel: 'A1',
    category: 'Reisen',
    ruleHint: 'الأسماء المركبة تأخذ أداة الكلمة الأخيرة: der Hof ➔ der Bahnhof.'
  },
  {
    id: 'n4',
    article: 'der',
    word: 'Kopf',
    plural: 'die Köpfe',
    translationAr: 'رأس',
    cefrLevel: 'A1',
    category: 'Körper',
    ruleHint: 'معظم أعضاء الجسم المفردة أحادية المقطع تأخذ der (der Kopf, der Arm, der Fuß).'
  },
  {
    id: 'n5',
    article: 'der',
    word: 'Lehrer',
    plural: 'die Lehrer',
    translationAr: 'معلم',
    cefrLevel: 'A1',
    category: 'Beruf',
    ruleHint: 'أسماء المهن المذكرة المنتهية بـ -er تأخذ دائماً der (der Lehrer, der Fahrer, der Bäcker).'
  },
  {
    id: 'n6',
    article: 'der',
    word: 'Frühling',
    plural: 'die Frühlinge',
    translationAr: 'فصل الربيع',
    cefrLevel: 'A1',
    category: 'Natur',
    ruleHint: 'فصول السنة الأربعة والأشهر وأيام الأسبوع تأخذ دائماً der (der Frühling, der Montag, der Januar).'
  },
  {
    id: 'n7',
    article: 'der',
    word: 'Kuchen',
    plural: 'die Kuchen',
    translationAr: 'كعكة / كيك',
    cefrLevel: 'A1',
    category: 'Essen',
    ruleHint: 'الكلمات المنتهية بـ -en (غير المصدرية) غالباً مذكر (der Kuchen, der Garten, der Wagen).'
  },
  {
    id: 'n8',
    article: 'der',
    word: 'Computer',
    plural: 'die Computer',
    translationAr: 'حاسوب',
    cefrLevel: 'A2',
    category: 'Technik',
    ruleHint: 'الأجهزة الفاعلة المنتهية بـ -er تأخذ دائماً der (der Computer, der Drucker, der Toaster).'
  },
  {
    id: 'n9',
    article: 'der',
    word: 'Optimismus',
    plural: '—',
    translationAr: 'تفاؤل',
    cefrLevel: 'B1',
    category: 'Gefühle',
    ruleHint: 'قاعدة ثابتة 100%: الكلمات المنتهية باللاحقة -ismus تأخذ دائماً der (der Optimismus, der Realismus).'
  },
  {
    id: 'n10',
    article: 'der',
    word: 'Motor',
    plural: 'die Motoren',
    translationAr: 'محرك',
    cefrLevel: 'B1',
    category: 'Technik',
    ruleHint: 'قاعدة ثابتة: الكلمات الأجنبية المنتهية بـ -or تأخذ دائماً der (der Motor, der Faktor, der Autor).'
  },
  {
    id: 'n11',
    article: 'der',
    word: 'Flüchtling',
    plural: 'die Flüchtlinge',
    translationAr: 'لاجئ',
    cefrLevel: 'B2',
    category: 'Gesellschaft',
    ruleHint: 'قاعدة ثابتة 100%: الكلمات المنتهية باللاحقة -ling تأخذ دائماً der (der Lehrling, der Schmetterling).'
  },
  {
    id: 'n12',
    article: 'der',
    word: 'Vertrag',
    plural: 'die Verträge',
    translationAr: 'عقد / اتفاقية',
    cefrLevel: 'A2',
    category: 'Recht',
    ruleHint: 'الأسماء المشتقة من جذور الأفعال بدون بادئة أو لاحقة تأخذ der غالباً (der Vertrag, der Antrag, der Beitrag).'
  },

  // --- FEMININE (die) ---
  {
    id: 'n13',
    article: 'die',
    word: 'Sonne',
    plural: 'die Sonnen',
    translationAr: 'شمس',
    cefrLevel: 'A1',
    category: 'Natur',
    ruleHint: 'أكثر من 90% من الكلمات ذات المقطعين المنتهية بالحرف -e تأخذ die (die Sonne, die Blume, die Lampe).'
  },
  {
    id: 'n14',
    article: 'die',
    word: 'Wohnung',
    plural: 'die Wohnungen',
    translationAr: 'شقة سكنية',
    cefrLevel: 'A1',
    category: 'Wohnen',
    ruleHint: 'قاعدة ذهبية 100%: كل كلمة تنتهي بـ -ung تأخذ دائماً die (die Wohnung, die Zeitung, die Rechnung).'
  },
  {
    id: 'n15',
    article: 'die',
    word: 'Freiheit',
    plural: 'die Freiheiten',
    translationAr: 'حرية',
    cefrLevel: 'A2',
    category: 'Abstrakt',
    ruleHint: 'قاعدة ذهبية 100%: كل كلمة تنتهي بـ -heit تأخذ دائماً die (die Freiheit, die Gesundheit, die Krankheit).'
  },
  {
    id: 'n16',
    article: 'die',
    word: 'Möglichkeit',
    plural: 'die Möglichkeiten',
    translationAr: 'إمكانية / فرصة',
    cefrLevel: 'A2',
    category: 'Abstrakt',
    ruleHint: 'قاعدة ذهبية 100%: كل كلمة تنتهي بـ -keit تأخذ دائماً die (die Möglichkeit, die Pünktlichkeit).'
  },
  {
    id: 'n17',
    article: 'die',
    word: 'Universität',
    plural: 'die Universitäten',
    translationAr: 'جامعة',
    cefrLevel: 'A2',
    category: 'Bildung',
    ruleHint: 'قاعدة ذهبية 100%: كل كلمة تنتهي بـ -tät تأخذ دائماً die (die Universität, die Realität, die Qualität).'
  },
  {
    id: 'n18',
    article: 'die',
    word: 'Station',
    plural: 'die Stationen',
    translationAr: 'محطة',
    cefrLevel: 'A2',
    category: 'Reisen',
    ruleHint: 'قاعدة ذهبية 100%: كل كلمة تنتهي بـ -tion تأخذ دائماً die (die Station, die Information, die Tradition).'
  },
  {
    id: 'n19',
    article: 'die',
    word: 'Freundschaft',
    plural: 'die Freundschaften',
    translationAr: 'صداقة',
    cefrLevel: 'B1',
    category: 'Gefühle',
    ruleHint: 'قاعدة ذهبية 100%: كل كلمة تنتهي بـ -schaft تأخذ دائماً die (die Freundschaft, die Mannschaft, die Landschaft).'
  },
  {
    id: 'n20',
    article: 'die',
    word: 'Bäckerei',
    plural: 'die Bäckereien',
    translationAr: 'مخبز',
    cefrLevel: 'A1',
    category: 'Essen',
    ruleHint: 'قاعدة ذهبية 100%: كل كلمة تنتهي بـ -ei للمحلات والأنشطة تأخذ die (die Bäckerei, die Metzgerei, die Polizei).'
  },
  {
    id: 'n21',
    article: 'die',
    word: 'Musik',
    plural: '—',
    translationAr: 'موسيقى',
    cefrLevel: 'A1',
    category: 'Kultur',
    ruleHint: 'قاعدة ثابتة: الكلمات المنتهية باللاحقة -ik تأخذ دائماً die (die Musik, die Politik, die Kritik).'
  },
  {
    id: 'n22',
    article: 'die',
    word: 'Lehrerin',
    plural: 'die Lehrerinnen',
    translationAr: 'معلمة',
    cefrLevel: 'A1',
    category: 'Beruf',
    ruleHint: 'قاعدة ذهبية 100%: أسماء المهن المؤنثة المنتهية بـ -in تأخذ دائماً die (die Ärztin, die Lehrerin, die Studentin).'
  },
  {
    id: 'n23',
    article: 'die',
    word: 'Kultur',
    plural: 'die Kulturen',
    translationAr: 'ثقافة',
    cefrLevel: 'B1',
    category: 'Kultur',
    ruleHint: 'الكلمات المنتهية بـ -ur تأخذ غالباً die (die Kultur, die Natur, die Struktur).'
  },
  {
    id: 'n24',
    article: 'die',
    word: 'Existenz',
    plural: 'die Existenzen',
    translationAr: 'وجود / كيان',
    cefrLevel: 'B2',
    category: 'Philosophie',
    ruleHint: 'الكلمات المنتهية بـ -enz أو -anz تأخذ دائماً die (die Existenz, die Konferenz, die Distanz).'
  },

  // --- NEUTER (das) ---
  {
    id: 'n25',
    article: 'das',
    word: 'Auto',
    plural: 'die Autos',
    translationAr: 'سيارة',
    cefrLevel: 'A1',
    category: 'Verkehr',
    ruleHint: 'الكلمات المستعارة المنتهية بحرف علة -o تأخذ غالباً das (das Auto, das Radio, das Kino, das Foto).'
  },
  {
    id: 'n26',
    article: 'das',
    word: 'Mädchen',
    plural: 'die Mädchen',
    translationAr: 'فتاة / بنت',
    cefrLevel: 'A1',
    category: 'Mensch',
    ruleHint: 'قاعدة ذهبية 100%: صيغ التصغير المنتهية بـ -chen تأخذ دائماً das حتى لو دلت على عاقل (das Mädchen, das Brötchen).'
  },
  {
    id: 'n27',
    article: 'das',
    word: 'Fräulein',
    plural: 'die Fräulein',
    translationAr: 'آنسة',
    cefrLevel: 'A2',
    category: 'Mensch',
    ruleHint: 'قاعدة ذهبية 100%: صيغ التصغير المنتهية بـ -lein تأخذ دائماً das (das Fräulein, das Kindlein).'
  },
  {
    id: 'n28',
    article: 'das',
    word: 'Buch',
    plural: 'die Bücher',
    translationAr: 'كتاب',
    cefrLevel: 'A1',
    category: 'Bildung',
    ruleHint: 'أدوات الدراسة والمواد الجامدة أحادية المقطع غالباً ما تكون محايدة (das Buch, das Blatt, das Heft).'
  },
  {
    id: 'n29',
    article: 'das',
    word: 'Dokument',
    plural: 'die Dokumente',
    translationAr: 'وثيقة / مستند',
    cefrLevel: 'A2',
    category: 'Büro',
    ruleHint: 'قاعدة ذهبية 100%: كل كلمة تنتهي باللاحقة -ment تأخذ دائماً das (das Dokument, das Medikament, das Instrument).'
  },
  {
    id: 'n30',
    article: 'das',
    word: 'Zentrum',
    plural: 'die Zentren',
    translationAr: 'مركز / وسط المدينة',
    cefrLevel: 'A2',
    category: 'Ort',
    ruleHint: 'قاعدة ذهبية 100%: الكلمات اللاتينية المنتهية بـ -um تأخذ دائماً das (das Zentrum, das Museum, das Datum).'
  },
  {
    id: 'n31',
    article: 'das',
    word: 'Essen',
    plural: '—',
    translationAr: 'طعام / الأكل',
    cefrLevel: 'A1',
    category: 'Essen',
    ruleHint: 'قاعدة ذهبية 100%: الأفعال المحولة لأسماء (Substantivierte Verben) تأخذ دائماً das (das Essen, das Leben, das Lernen).'
  },
  {
    id: 'n32',
    article: 'das',
    word: 'Gebäude',
    plural: 'die Gebäude',
    translationAr: 'مبنى / عمارة',
    cefrLevel: 'B1',
    category: 'Stadt',
    ruleHint: 'الأسماء التي تبدأ بالبادئة Ge- وتنتهي بـ -e غالباً تأخذ das (das Gebäude, das Gemälde, das Gebirge).'
  },
  {
    id: 'n33',
    article: 'das',
    word: 'Problem',
    plural: 'die Probleme',
    translationAr: 'مشكلة',
    cefrLevel: 'A1',
    category: 'Alltag',
    ruleHint: 'الكلمات اليونانية الأصل المنتهية بـ -em أو -ma تأخذ das (das Problem, das System, das Thema).'
  },
  {
    id: 'n34',
    article: 'das',
    word: 'Hotel',
    plural: 'die Hotels',
    translationAr: 'فندق',
    cefrLevel: 'A1',
    category: 'Reisen',
    ruleHint: 'الكلمات المستعارة من الفرنسية أو الإنجليزية غالباً تأخذ das (das Hotel, das Restaurant, das Café).'
  },
  {
    id: 'n35',
    article: 'das',
    word: 'Wasser',
    plural: '—',
    translationAr: 'ماء',
    cefrLevel: 'A1',
    category: 'Essen',
    ruleHint: 'أغلب المواد والسوائل والمعادن الأساسية تأخذ das (das Wasser, das Bier, das Gold, das Silber).'
  },
  {
    id: 'n36',
    article: 'das',
    word: 'Ergebnis',
    plural: 'die Ergebnisse',
    translationAr: 'نتيجة',
    cefrLevel: 'B1',
    category: 'Wissenschaft',
    ruleHint: 'الكلمات المنتهية بـ -nis تأخذ das غالباً (das Ergebnis, das Zeugnis, das Geheimnis).'
  }
];
