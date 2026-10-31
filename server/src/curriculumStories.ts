export interface CurriculumStoryItem {
  titleDe: string;
  titleAr: string;
  cefrLevel: 'A1' | 'A2' | 'B1' | 'B2';
  topic: string;
  storyTextDe: string;
  storyTextAr: string;
  vocabularyUsed: string[];
  unknownWords: Array<{
    word: string;
    article?: string;
    plural?: string;
    translation: string;
    explanation: string;
  }>;
  comprehensionQuestions: Array<{
    id: string;
    questionDe: string;
    questionAr: string;
    options: string[];
    correctAnswer: string;
    explanationAr: string;
  }>;
}

export const curatedStories: CurriculumStoryItem[] = [
  // ==========================================
  // LEVEL A1 - 3 Passages
  // ==========================================
  {
    titleDe: 'Mein Alltag in Berlin',
    titleAr: 'يومي المعتاد في برلين',
    cefrLevel: 'A1',
    topic: 'Tagesablauf & Alltag (الروتين اليومي)',
    storyTextDe: `Hallo! Ich heiße Omar und ich wohne seit drei Monaten in Berlin. Mein Tag beginnt früh um sieben Uhr morgens. Zuerst trinke ich eine große Tasse Kaffee und esse ein frisches Brötchen mit Käse.

Um acht Uhr nehme ich die U-Bahn und fahre zur Sprachschule. Dort lerne ich von neun bis zwölf Uhr Deutsch. Meine Lehrerin heißt Frau Weber und sie ist sehr nett und geduldig. Nach dem Unterricht gehe ich mit meinen Freunden in ein kleines Café im Stadtzentrum. Wir sprechen zusammen Deutsch und trinken Tee.

Am Nachmittag kaufe ich im Supermarkt Obst, Gemüse und Brot ein. Am Abend koche ich ein leckeres Abendessen und lerne neue deutsche Vokabeln für den nächsten Tag. Um dreiundzwanzig Uhr gehe ich schlafen. Ich mag mein neues Leben in Berlin sehr!`,
    storyTextAr: `مرحباً! اسمي عمر وأنا أعيش منذ ثلاثة أشهر في برلين. يبدأ يومي مبكراً في تمام الساعة السابعة صباحاً. أولاً أشرب فنجاناً كبيراً من القهوة وآكل خبزاً طازجاً (Brötchen) مع الجبن.

في الساعة الثامنة أستقل قطار الأنفاق (U-Bahn) وأتوجه إلى مدرسة اللغة. هناك أتعلم الألمانية من الساعة التاسعة حتى الثانية عشرة ظهراً. مدرستي اسمها السيدة فيبر وهي لطيفة وصبورة للغاية. بعد انتهاء الدرس أذهب مع أصدقائي إلى مقهى صغير في وسط المدينة. نتحدث معاً بالألمانية ونشرب الشاي.

بعد الظهر أتسوق في السوبرماركت وأشتري الفواكه والخضار والخبز. وفي المساء أطبخ عشاءً لذيذاً وأحفظ مفردات ألمانية جديدة لليوم التالي. وفي الساعة الحادية عشرة ليلاً أذهب للنوم. أنا أحب حياتي الجديدة في برلين كثيراً!`,
    vocabularyUsed: ['wohnen', 'beginnen', 'trinken', 'essen', 'fahren', 'lernen', 'kaufen', 'kochen', 'schlafen'],
    unknownWords: [
      { word: 'das Brötchen', article: 'DAS', plural: 'die Brötchen', translation: 'خبز صغير / صمون', explanation: 'تصغير ألماني مشهور للخبز' },
      { word: 'die U-Bahn', article: 'DIE', plural: 'die U-Bahnen', translation: 'مترو الأنفاق', explanation: 'اختصار لـ Untergrundbahn' },
      { word: 'geduldig', translation: 'صبور', explanation: 'صفة مشتقة من die Geduld (الصبر)' },
      { word: 'der Unterricht', article: 'DER', plural: 'die Unterrichte', translation: 'الدرس / الحصة', explanation: 'اسم مذكر يعبر عن الحصة التعليمية' },
    ],
    comprehensionQuestions: [
      {
        id: 'q1',
        questionDe: 'Wann beginnt Omars Tag?',
        questionAr: 'متى يبدأ يوم عمر؟',
        options: ['Um 7 Uhr morgens', 'Um 8 Uhr morgens', 'Um 9 Uhr morgens', 'Um 12 Uhr mittags'],
        correctAnswer: 'Um 7 Uhr morgens',
        explanationAr: 'ذكر في النص: "Mein Tag beginnt früh um sieben Uhr morgens".',
      },
      {
        id: 'q2',
        questionDe: 'Wie fährt Omar zur Sprachschule?',
        questionAr: 'كيف يذهب عمر إلى مدرسة اللغة؟',
        options: ['Mit der U-Bahn', 'Mit dem Fahrrad', 'Zu Fuß', 'Mit dem Taxi'],
        correctAnswer: 'Mit der U-Bahn',
        explanationAr: 'ذكر في النص: "nehme ich die U-Bahn und fahre zur Sprachschule".',
      },
      {
        id: 'q3',
        questionDe: 'Was macht Omar nach dem Unterricht?',
        questionAr: 'ماذا يفعل عمر بعد انتهاء الدرس؟',
        options: ['Er geht mit Freunden ins Café', 'Er geht direkt schlafen', 'Er arbeitet im Supermarkt', 'Er fährt nach Hause'],
        correctAnswer: 'Er geht mit Freunden ins Café',
        explanationAr: 'ذكر في النص: "gehe ich mit meinen Freunden in ein kleines Café im Stadtzentrum".',
      },
    ],
  },
  {
    titleDe: 'Ein Abend im deutschen Restaurant',
    titleAr: 'أمسية في مطعم ألماني',
    cefrLevel: 'A1',
    topic: 'Essen & Restaurant (المطاعم وطلب الطعام)',
    storyTextDe: `Heute Abend gehen Sarah und Lukas in ein traditionelles Restaurant in Köln. Das Restaurant heißt "Zum alten Brauhaus" und ist sehr gemütlich. Viele Menschen sitzen an den Holztischen und sprechen laut.

Der Kellner kommt schnell an den Tisch und sagt: "Guten Abend! Was möchten Sie trinken?" Sarah bestellt ein kaltes Mineralwasser ohne Kohlensäure und Lukas bestellt einen Apfelsaft. 

Danach schauen sie in die Speisekarte. Sarah wählt eine Gemüsesuppe mit Kartoffeln und Brot. Lukas möchte Schnitzel mit Pommes frites und einem frischen Salat essen. Das Essen kommt nach zwanzig Minuten. Es schmeckt wirklich ausgezeichnet!

Am Ende ruft Lukas den Kellner: "Wir möchten bitte bezahlen!" Der Kellner fragt: "Zusammen oder getrennt?" Lukas antwortet: "Zusammen bitte, ich lade meine Freundin ein." Das Abendessen kostet vierunddreißig Euro und Lukas gibt zwei Euro Trinkgeld.`,
    storyTextAr: `مساء اليوم يذهب سارة ولوكاس إلى مطعم تقليدي في مدينة كولونيا. المطعم يسمى "Zum alten Brauhaus" وهو دافئ ومريح للغاية. يجلس الكثير من الناس حول الطاولات الخشبية ويتحدثون بصوت مسموع.

يأتي النادل سريعاً إلى الطاولة ويقول: "مساء الخير! ماذا تودون أن تشربوا؟" تطلب سارة ماءً معدنياً بارداً بدون غازات، بينما يطلب لوكاس عصير تفاح.

بعد ذلك يطالعان قائمة الطعام. تختار سارة حساء خضروات مع البطاطس والخبز. ويرغب لوكاس في تناول الشنيتزل مع البطاطس المقلية وسلطة طازجة. يصل الطعام بعد عشرين دقيقة. مذاقه رائع وممتاز بحق!

في النهاية ينادي لوكاس النادل: "نود الحساب من فضلك!" يسأل النادل: "معاً أم منفصلين؟" يجيب لوكاس: "معاً من فضلك، أنا أعزم صديقتي." كلف العشاء أربعة وثلاثين يورو وقدم لوكاس إكرامية (Trinkgeld) بقيمة يوروين.`,
    vocabularyUsed: ['gehen', 'bestellen', 'trinken', 'essen', 'schmecken', 'bezahlen', 'kosten'],
    unknownWords: [
      { word: 'gemütlich', translation: 'مريح / دافئ الأجواء', explanation: 'صفة ألمانية شهيرة لوصف الأماكن المريحة' },
      { word: 'die Speisekarte', article: 'DIE', plural: 'die Speisekarten', translation: 'قائمة الطعام', explanation: 'مركبة من Speise (طعام) و Karte (قائمة)' },
      { word: 'getrennt', translation: 'منفصل', explanation: 'تستخدم في المطاعم لدفع كل شخص حسابه بمفرده' },
      { word: 'das Trinkgeld', article: 'DAS', plural: 'die Trinkgelder', translation: 'البقشيش / الإكرامية', explanation: 'مركبة من trinken (شرب) و Geld (مال)' },
    ],
    comprehensionQuestions: [
      {
        id: 'q1',
        questionDe: 'Was bestellt Sarah zu trinken?',
        questionAr: 'ماذا طلبت سارة للشرب؟',
        options: ['Mineralwasser ohne Kohlensäure', 'Apfelsaft', 'Schwarzen Tee', 'Kaffee mit Milch'],
        correctAnswer: 'Mineralwasser ohne Kohlensäure',
        explanationAr: 'ذكر في النص: "Sarah bestellt ein kaltes Mineralwasser ohne Kohlensäure".',
      },
      {
        id: 'q2',
        questionDe: 'Was fragt der Kellner beim Bezahlen?',
        questionAr: 'ماذا سأل النادل عند دفع الحساب؟',
        options: ['Zusammen oder getrennt?', 'Bar oder mit Karte?', 'Hat es geschmeckt?', 'Möchten Sie noch ein Dessert?'],
        correctAnswer: 'Zusammen oder getrennt?',
        explanationAr: 'السؤال الشهير في المطاعم الألمانية: "Der Kellner fragt: Zusammen oder getrennt?".',
      },
      {
        id: 'q3',
        questionDe: 'Wie viel Trinkgeld gibt Lukas?',
        questionAr: 'كم قيمة الإكرامية التي دفعها لوكاس؟',
        options: ['Zwei Euro', 'Fünf Euro', 'Zehn Euro', 'Kein Trinkgeld'],
        correctAnswer: 'Zwei Euro',
        explanationAr: 'ذكر في النص: "Lukas gibt zwei Euro Trinkgeld".',
      },
    ],
  },
  {
    titleDe: 'Meine neue Wohnung',
    titleAr: 'شقتي السكنية الجديدة',
    cefrLevel: 'A1',
    topic: 'Wohnen & Möbel (السكن والأثاث)',
    storyTextDe: `Endlich habe ich eine schöne Wohnung in Hamburg gefunden! Die Wohnung liegt im dritten Stock eines alten, ruhigen Hauses. Sie hat zwei Zimmer, eine Küche, ein Bad und einen kleinen Balkon mit Blick auf den Park.

Das Wohnzimmer ist hell und groß. An der Wand steht ein bequemes blaues Sofa. Gegenüber dem Sofa steht ein Tisch mit vier Stühlen und ein modernes Bücherregal. Im Schlafzimmer habe ich ein großes Bett und einen weißen Kleiderschrank.

Die Küche ist modern eingerichtet. Es gibt einen Herd, einen großen Kühlschrank und eine Kaffeemaschine. Am Morgen trinke ich meinen Kaffee gern auf dem Balkon und beobachte die Vögel im Park.

Die Warmmiete beträgt sechshundertfünfzig Euro im Monat. Das ist für Hamburg wirklich ein fairer Preis. Meine Nachbarn sind freundlich und ruhig. Ich fühle mich hier wie zu Hause!`,
    storyTextAr: `أخيراً وجدت شقة جميلة في مدينة هامبورغ! تقع الشقة في الطابق الثالث من مبنى قديم وهادئ. تتكون من غرفتين، مطبخ، حمام، وشرفة صغيرة تطل على الحديقة العامة.

غرفة المعيشة مضيئة وواسعة. وبجوار الحائط توجد أريكة زرقاء مريحة. في مقابل الأريكة توجد طاولة بأربعة كراسي ورف كتب حديث. وفي غرفة النوم لدي سرير كبير وخزانة ملابس بيضاء.

المطبخ مجهز بطريقة عصرية؛ حيث يوجد موقد، ثلاجة كبيرة، وآلة لصنع القهوة. في الصباح أحب شرب قهوتي على الشرفة ومراقبة الطيور في الحديقة.

الإيجار الدافئ (شاملاً التدفئة والمرافق) يبلغ 650 يورو شهرياً، وهذا في هامبورغ يعد سعراً عادلاً ومناسباً حقاً. جيراني ودودون وهادئون. أشعر هنا وكأنني في منزلي!`,
    vocabularyUsed: ['finden', 'liegen', 'haben', 'stehen', 'trinken', 'kosten', 'fühlen'],
    unknownWords: [
      { word: 'der Stock', article: 'DER', plural: 'die Stockwerke', translation: 'الطابق / الدور', explanation: 'im dritten Stock = في الطابق الثالث' },
      { word: 'das Sofa', article: 'DAS', plural: 'die Sofas', translation: 'الأريكة / الكنبة', explanation: 'اسم محايد من أصل أجنبي' },
      { word: 'die Warmmiete', article: 'DIE', plural: 'die Warmmieten', translation: 'الإيجار الدافئ (شامل الخدمات والتدفئة)', explanation: 'عكسها Kaltmiete (الإيجار الصافي بدون تدفئة)' },
      { word: 'der Nachbar', article: 'DER', plural: 'die Nachbarn', translation: 'الجار', explanation: 'اسم مذكر يتبع الـ N-Deklination' },
    ],
    comprehensionQuestions: [
      {
        id: 'q1',
        questionDe: 'In welchem Stock liegt die Wohnung?',
        questionAr: 'في أي طابق تقع الشقة؟',
        options: ['Im dritten Stock', 'Im ersten Stock', 'Im Erdgeschoss', 'Im fünften Stock'],
        correctAnswer: 'Im dritten Stock',
        explanationAr: 'ذكر في النص: "Die Wohnung liegt im dritten Stock".',
      },
      {
        id: 'q2',
        questionDe: 'Was steht im Wohnzimmer gegenüber dem Sofa?',
        questionAr: 'ماذا يوجد في غرفة المعيشة في مقابل الأريكة؟',
        options: ['Ein Tisch mit vier Stühlen und ein Bücherregal', 'Ein großes Bett', 'Ein Kühlschrank', 'Ein Kleiderschrank'],
        correctAnswer: 'Ein Tisch mit vier Stühlen und ein Bücherregal',
        explanationAr: 'ذكر في النص: "Gegenüber dem Sofa steht ein Tisch mit vier Stühlen und ein modernes Bücherregal".',
      },
      {
        id: 'q3',
        questionDe: 'Wie hoch ist die Warmmiete pro Monat?',
        questionAr: 'كم يبلغ الإيجار الدافئ شهرياً؟',
        options: ['650 Euro', '500 Euro', '850 Euro', '1000 Euro'],
        correctAnswer: '650 Euro',
        explanationAr: 'ذكر في النص: "Die Warmmiete beträgt sechshundertfünfzig Euro im Monat".',
      },
    ],
  },

  // ==========================================
  // LEVEL A2 - 3 Passages
  // ==========================================
  {
    titleDe: 'Die Reise mit dem ICE nach München',
    titleAr: 'الرحلة بقطار الـ ICE السريع إلى ميونيخ',
    cefrLevel: 'A2',
    topic: 'Reisen & Bahnverkehr (السفر والمحطات)',
    storyTextDe: `Letzte Woche musste Florian für ein wichtiges Vorstellungsgespräch von Frankfurt nach München reisen. Am Freitagmorgen kam er eine halbe Stunde vor der Abfahrt am Frankfurter Hauptbahnhof an. Der Bahnhof war voller Menschen mit Koffern und Rucksäcken.

Florian schaute auf die große Anzeigetafel. Sein ICE nach München sollte um 08:35 Uhr von Gleis 7 abfahren. Plötzlich ertönte eine Durchsage über die Lautsprecher: "Achtung an Gleis 7! Der ICE 612 nach München Hauptbahnhof hat wegen einer Weichenstörung circa zwanzig Minuten Verspätung." Florian seufzte, aber er kaufte sich am Kiosk eine Brezel und einen Kaffee.

Als der Zug schließlich einfuhr, stieg er schnell ein und suchte seinen reservierten Sitzplatz im Großraumwagen. Die Fahrt war sehr angenehm und leise. Florian öffnete seinen Laptop und wiederholte seine Notizen für das Gespräch. 

Obwohl der Zug mit Verspätung losgefahren war, holte der Lokführer auf der Hochgeschwindigkeitsstrecke Zeit auf. Florian kam pünktlich in München an und das Vorstellungsgespräch war ein voller Erfolg!`,
    storyTextAr: `في الأسبوع الماضي تعين على فلوريان السفر من فرانكفورت إلى ميونيخ لحضور مقابلة عمل هامة. صباح الجمعة وصل قبل موعد الانطلاق بنصف ساعة إلى محطة القطارات المركزية في فرانكفورت. كانت المحطة تعج بالمسافرين الحاملين للحقائب وحقائب الظهر.

نظر فلوريان إلى لوحة المواعيد الإلكترونية الكبيرة. كان من المفترض أن ينطلق قطار الـ ICE المتجه لميونيخ في الساعة 08:35 من الرصيف رقم 7. وفجأة دوى إعلان صوتي عبر مكبرات الصوت: "انتباه على الرصيف 7! قطار ICE 612 المتجه لمحطة ميونيخ المركزية متأخر قرابة عشرين دقيقة بسبب عطل في تحويلة السكة." تنهد فلوريان، لكنه اشترى من الكشك كعكة بريتزل وفنجان قهوة.

وعندما دخل القطار أخيراً المحطة، صعد مسرعاً وبحث عن مقعده المحجوز في عربة الركاب المفتوحة. كانت الرحلة مريحة وهادئة جداً. فتح فلوريان حاسوبه المحمول وراجع ملاحظاته استعداداً للمقابلة.

وعلى الرغم من انطلاق القطار متأخراً، استطاع السائق تعويض الوقت على خط السرعة العالية. وصل فلوريان إلى ميونيخ في الموعد تماماً وكانت مقابلة العمل نجاحاً باهراً!`,
    vocabularyUsed: ['reisen', 'ankommen', 'abfahren', 'warten', 'einsteigen', 'wiederholen', 'aufholen'],
    unknownWords: [
      { word: 'die Durchsage', article: 'DIE', plural: 'die Durchsagen', translation: 'الإعلان الصوتي عبر المكبرات', explanation: 'من الفعل durchsagen (أعلن شفوياً)' },
      { word: 'das Gleis', article: 'DAS', plural: 'die Gleise', translation: 'رصيف القطار / خط السكة', explanation: 'يستخدم لتحديد مسار القطار (auf Gleis 7)' },
      { word: 'die Verspätung', article: 'DIE', plural: 'die Verspätungen', translation: 'التأخير', explanation: 'صفة spät (متأخر) تحولت لاسم مع البادئة ver-' },
      { word: 'angenehm', translation: 'ممتع / مريح', explanation: 'صفة تعبر عن الشعور بالارتياح والقبول' },
    ],
    comprehensionQuestions: [
      {
        id: 'q1',
        questionDe: 'Warum reiste Florian nach München?',
        questionAr: 'لماذا سافر فلوريان إلى ميونيخ؟',
        options: ['Für ein Vorstellungsgespräch', 'Um Urlaub zu machen', 'Um Freunde zu besuchen', 'Für ein Konzert'],
        correctAnswer: 'Für ein Vorstellungsgespräch',
        explanationAr: 'ذكر في النص: "musste Florian für ein wichtiges Vorstellungsgespräch... reisen".',
      },
      {
        id: 'q2',
        questionDe: 'Warum hatte der Zug Verspätung?',
        questionAr: 'لماذا تأخر القطار؟',
        options: ['Wegen einer Weichenstörung', 'Wegen schlechten Wetters', 'Wegen eines Streiks', 'Wegen zu vieler Passagiere'],
        correctAnswer: 'Wegen einer Weichenstörung',
        explanationAr: 'ذكر في الإعلان الصوتي: "hat wegen einer Weichenstörung circa zwanzig Minuten Verspätung".',
      },
      {
        id: 'q3',
        questionDe: 'Kam Florian rechtzeitig zu seinem Termin an?',
        questionAr: 'هل وصل فلوريان في الوقت المناسب لموعده؟',
        options: ['Ja, er kam pünktlich an', 'Nein, er hat den Termin verpasst', 'Er musste den Termin absagen', 'Er kam zwei Stunden zu spät'],
        correctAnswer: 'Ja, er kam pünktlich an',
        explanationAr: 'ذكر في النص: "Florian kam pünktlich in München an".',
      },
    ],
  },
  {
    titleDe: 'Ein unerwarteter Arztbesuch',
    titleAr: 'زيارة غير متوقعة لعيادة الطبيب',
    cefrLevel: 'A2',
    topic: 'Gesundheit & Krankheit (الصحة والأعراض المرضية)',
    storyTextDe: `Seit gestern Abend fühlte sich Karim gar nicht wohl. Er hatte starke Halsschmerzen, hohes Fieber und fühlte sich völlig kraftlos. Am nächsten Morgen rief er früh in der Praxis von Dr. Becker an, um einen Notfalltermin zu vereinbaren.

Die Arzthelferin sagte ihm am Telefon: "Kommen Sie bitte direkt um neun Uhr vorbei, bringen Sie aber etwas Wartezeit mit." Karim zog seine warme Winterjacke an und ging langsam zur Arztpraxis um die Ecke.

Im Wartezimmer saßen bereits mehrere Patienten. Nach einer halben Stunde rief die Sprechstundenhilfe seinen Namen auf. Herr Dr. Becker untersuchte Karims Hals, maß die Temperatur und hörte seine Lunge mit dem Stethoskop ab. 

"Sie haben eine akute Mandelentzündung", erklärte der Arzt freundlich. "Ich verschreibe Ihnen ein Antibiotikum und Tabletten gegen das Fieber. Sie müssen viel warmen Tee trinken und mindestens fünf Tage im Bett bleiben." Dr. Becker stellte ihm auch eine Arbeitsunfähigkeitsbescheinigung (die sogenannte Krankschreibung) für seinen Arbeitgeber aus. 

Karim holte die Medikamente sofort in der Apotheke nebenan und legte sich zu Hause ins Bett. Nach drei Tagen Ruhe ging es ihm schon deutlich besser.`,
    storyTextAr: `منذ مساء أمس لم يكن كريم يشعر بأنه على ما يرام على الإطلاق. كان يعاني من آلام شديدة بالحلق، حمى مرتفعة، وشعور تام بفقدان الطاقة. وفي الصباح الباكر اتصل بعيادة الدكتور بيكر لحجز موعد طارئ.

قالت له مساعدة الطبيب عبر الهاتف: "تفضل بالحضور في تمام الساعة التاسعة، ولكن توقع بعض وقت الانتظار." ارتدى كريم سترته الشتوية الدافئة وتوجه ببطء نحو العيادة الواقعة عند زاوية الشارع.

في غرفة الانتظار كان يجلس بالفعل عدد من المرضى. وبعد نصف ساعة نادت الممرضة على اسمه. فحص الدكتور بيكر حلق كريم، وقاس درجة حرارته، واستمع إلى رئتيه بالسماعة الطبية.

أوضح الطبيب بلطف: "أنت مصاب بالتهاب لوزتين حاد. سأكتب لك مضاداً حيوياً وحبوباً خافضة للحرارة. يجب عليك شرب الكثير من الشاي الدافئ والبقاء في السرير لمدة خمسة أيام على الأقل." كما حرر له الطبيب شهادة إجازة مرضية (Krankschreibung) لتقديمها لجهة عمله.

استلم كريم الأدوية فوراً من الصيدلية المجاورة واستلقى في سريره بالمنزل. وبعد ثلاثة أيام من الراحة التامة تحسنت حالته بشكل ملحوظ.`,
    vocabularyUsed: ['fühlen', 'anrufen', 'vereinbaren', 'untersuchen', 'verschreiben', 'bleiben', 'ausstellen'],
    unknownWords: [
      { word: 'die Halsschmerzen', article: 'DIE', plural: 'Pluralwort', translation: 'آلام الحلق والزور', explanation: 'مركبة من Hals (رقبة/حلق) و Schmerzen (آلام)' },
      { word: 'die Krankschreibung', article: 'DIE', plural: 'die Krankschreibungen', translation: 'التقرير الطبي للإجازة المرضية', explanation: 'الوثيقة الرسمية التي تقدم للشركة في ألمانيا' },
      { word: 'verschreiben', translation: 'يصف دواءً (روشيتة)', explanation: 'فعل قوي: verschrieb, hat verschrieben' },
      { word: 'die Mandelentzündung', article: 'DIE', plural: 'die Mandelentzündungen', translation: 'التهاب اللوزتين', explanation: 'die Mandeln (اللوزتان) + die Entzündung (الالتهاب)' },
    ],
    comprehensionQuestions: [
      {
        id: 'q1',
        questionDe: 'Welche Symptome hatte Karim?',
        questionAr: 'ما هي الأعراض التي عانى منها كريم؟',
        options: ['Halsschmerzen, hohes Fieber und Schwäche', 'Magenschmerzen und Übelkeit', 'Ein gebrochenes Bein', 'Zahnschmerzen'],
        correctAnswer: 'Halsschmerzen, hohes Fieber und Schwäche',
        explanationAr: 'ذكر في النص: "starke Halsschmerzen, hohes Fieber und fühlte sich völlig kraftlos".',
      },
      {
        id: 'q2',
        questionDe: 'Was diagnostizierte Dr. Becker?',
        questionAr: 'ما هو تشخيص الدكتور بيكر للحالة؟',
        options: ['Eine akute Mandelentzündung', 'Eine leichte Allergie', 'Nur eine Erkältung', 'Einen Knochenbruch'],
        correctAnswer: 'Eine akute Mandelentzündung',
        explanationAr: 'ذكر الطبيب: "Sie haben eine akute Mandelentzündung".',
      },
      {
        id: 'q3',
        questionDe: 'Wie lange soll Karim im Bett bleiben?',
        questionAr: 'كم المدة التي يجب أن يلازم فيها كريم الفراش؟',
        options: ['Mindestens fünf Tage', 'Zwei Wochen', 'Nur einen Tag', 'Zehn Tage'],
        correctAnswer: 'Mindestens fünf Tage',
        explanationAr: 'ذكر في النص: "mindestens fünf Tage im Bett bleiben".',
      },
    ],
  },
  {
    titleDe: 'Mein erster Arbeitstag in Hamburg',
    titleAr: 'يومي الأول في العمل بمدينة هامبورغ',
    cefrLevel: 'A2',
    topic: 'Arbeit & Kollegen (العمل والزملاء الجدد)',
    storyTextDe: `Heute war ein ganz besonderer Tag für Youssef: Sein erster Arbeitstag als Junior-Webentwickler bei einer bekannten Digitalagentur im Herzen von Hamburg. Er war am Morgen sehr aufgeregt, zog ein sauberes Hemd an und kam überpünktlich um Viertel vor neun im Büro an.

Am Empfang begrüßte ihn Frau Lehmann, die Personalmanagerin. Sie führte ihn durch das Großraumbüro und stellte ihn den neuen Kolleginnen und Kollegen vor. Alle waren sehr aufgeschlossen und sagten sofort: "Bei uns duzen sich alle, wir sind ein junges und dynamisches Team!" Das erleichterte Youssef sehr.

An seinem Arbeitsplatz stand bereits ein nagelneuer Laptop mit zwei Bildschirmen bereit. Sein Teamleiter Jan erklärte ihm die aktuellen Projekte und zeigte ihm das interne Softwaresystem. Um zwölf Uhr dreißig gingen alle gemeinsam in die Kantine zum Mittagessen.

Am Nachmittag durfte Youssef bereits seine erste kleine Programmieraufgabe lösen. Wenn er Fragen hatte, half ihm seine Kollegin Anna sofort weiter. Um siebzehn Uhr endete der Arbeitstag. Youssef ging mit einem breiten Lächeln nach Hause – er wusste, dass er die richtige Entscheidung getroffen hatte.`,
    storyTextAr: `اليوم كان يوماً استثنائياً وخاصاً جداً بالنسبة ليوسف: إنه يوم عمله الأول كمطور ويب مبتدئ لدى وكالة رقمية شهيرة في قلب مدينة هامبورغ. كان متحمساً وقلقاً بعض الشيء في الصباح، فارتدى قميصاً أنيقاً ووصل قبل الموعد في التاسعة إلا ربع إلى المكتب.

عند مكتب الاستقبال رحبت به السيدة ليمان، مديرة الموارد البشرية. اصطحبته في جولة عبر صالة المكاتب المفتوحة وقدمته للزملاء والزميلات الجدد. كان الجميع ودودين ومنفتحين للغاية وقالوا فوراً: "هنا نخاطب بعضنا بـ (du) بدلاً من الرسميات، فنحن فريق شاب ومتحمس!" وهذا أشعر يوسف بارتياح كبير.

وعلى مكتبه كان هناك حاسوب محمول جديد كلياً مع شاشتين جاهزاً للعمل. شرح له رئيس الفريق يان المشاريع الحالية ودربه على النظام الداخلي للشركة. وفي تمام الساعة الثانية عشرة والنصف ذهب الجميع معاً إلى المطعم الداخلي لتناول وجبة الغداء.

وبعد الظهر سُمح ليوسف بالبدء في حل أول مهمة برمجية صغيرة. وعندما كانت تواجهه أسئلة، كانت زميلته آنا تسارع لمساعدته. وفي الخامسة مساءً انتهى يوم العمل. عاد يوسف إلى منزله بابتسامة عريضة، وهو موقن بأنه اتخذ القرار الصحيح.`,
    vocabularyUsed: ['beginnen', 'begrüßen', 'vorstellen', 'erklären', 'helfen', 'entscheiden'],
    unknownWords: [
      { word: 'aufgeregt', translation: 'منفعل / متوتر بحماس', explanation: 'مشتقة من الفعل aufregen (أثار / وتر)' },
      { word: 'duzen', translation: 'يخاطب بصيغة du الودية غير الرسمية', explanation: 'عكسها siezen (المخاطبة بصيغة Sie الرسمية)' },
      { word: 'der Bildschirm', article: 'DER', plural: 'die Bildschirme', translation: 'شاشة العرض', explanation: 'مركبة من Bild (صورة) و Schirm (مظلة/حاجب)' },
      { word: 'die Entscheidung', article: 'DIE', plural: 'die Entscheidungen', translation: 'القرار', explanation: 'التعبير الشهير: eine Entscheidung treffen (اتخذ قراراً)' },
    ],
    comprehensionQuestions: [
      {
        id: 'q1',
        questionDe: 'Als was arbeitet Youssef?',
        questionAr: 'ما هي وظيفة يوسف الجديدة؟',
        options: ['Junior-Webentwickler', 'Personalmanager', 'Kellner', 'Buchhalter'],
        correctAnswer: 'Junior-Webentwickler',
        explanationAr: 'ذكر في النص: "Sein erster Arbeitstag als Junior-Webentwickler".',
      },
      {
        id: 'q2',
        questionDe: 'Wie sprechen die Kollegen miteinander im Büro?',
        questionAr: 'كيف يخاطب الزملاء بعضهم في المكتب؟',
        options: ['Sie duzen sich (informell)', 'Sie siezen sich streng', 'Sie sprechen nur Englisch', 'Sie sprechen überhaupt nicht'],
        correctAnswer: 'Sie duzen sich (informell)',
        explanationAr: 'ذكر في النص: "Bei uns duzen sich alle, wir sind ein junges Team".',
      },
      {
        id: 'q3',
        questionDe: 'Wer half Youssef bei seinen Programmierfragen?',
        questionAr: 'من ساعد يوسف عندما كانت تواجهه أسئلة برمجية؟',
        options: ['Seine Kollegin Anna', 'Frau Lehmann', 'Niemand', 'Der Hausmeister'],
        correctAnswer: 'Seine Kollegin Anna',
        explanationAr: 'ذكر في النص: "half ihm seine Kollegin Anna sofort weiter".',
      },
    ],
  },

  // ==========================================
  // LEVEL B1 - 3 Passages
  // ==========================================
  {
    titleDe: 'Das duale Ausbildungssystem in Deutschland',
    titleAr: 'نظام التأهيل المهني المزدوج في ألمانيا',
    cefrLevel: 'B1',
    topic: 'Ausbildung & Karriere (التكوين المهني وسوق العمل)',
    storyTextDe: `Das duale Ausbildungssystem gilt weltweit als eines der erfolgreichsten Modelle zur Bekämpfung von Jugendarbeitslosigkeit und zur Sicherung von qualifizierten Fachkräften. Doch was bedeutet "dual" eigentlich in diesem Zusammenhang?

Der Begriff "dual" bezeichnet die enge Verzahnung von Theorie und Praxis. Die Auszubildenden (oft kurz "Azubis" genannt) lernen an zwei unterschiedlichen Lernorten: Im Ausbildungsbetrieb erwerben sie praktische Fertigkeiten und arbeiten direkt an realen Aufträgen mit. Parallel dazu besuchen sie an ein bis zwei Tagen pro Woche – oder im Blockunterricht – die Berufsschule, wo theoretische Fachkenntnisse und allgemeinbildende Fächer vermittelt werden.

Ein entscheidender Vorteil für die Jugendlichen besteht darin, dass sie vom ersten Monat an eine gesetzlich geregelte monاتliche Ausbildungsvergütung erhalten. Dadurch sind sie finanziell unabhängiger als reine Studenten an Universitäten. Die Ausbildungsdauer liegt in der Regel zwischen zwei und dreieinhalb Jahren, abhängig vom jeweiligen Berufsbild und den schulischen Vorleistungen.

Nach erfolgreichem Bestehen der Abschlussprüfung vor der Industrie- und Handelskammer (IHK) oder der Handwerkskammer (HWK) stehen die Chancen auf eine direkte Übernahme durch den Betrieb hervorragend. Viele Facharbeiter nutzen diese solide Basis, um später eine Weiterbildung zum Meister oder Techniker zu absolvieren.`,
    storyTextAr: `يُعد نظام التأهيل المهني المزدوج عالمياً أحد أنجح النماذج لمكافحة بطالة الشباب وضمان توفير الكفاءات المهنية المؤهلة لسوق العمل. ولكن ما الذي تعنيه كلمة "مزدوج" في هذا السياق؟

يشير مصطلح "مزدوج" إلى التشابك والتكامل الوثيق بين الجانبين النظري والعملي. حيث يتعلم المتدربون (الذين يطلق عليهم اختصاراً Azubis) في موقعين تعليميين مختلفين: في شركة التدريب يكتسبون المهارات العملية ويشاركون مباشرة في تنفيذ طلبات حقيقية. وبالتوازي مع ذلك، يداومون يوماً أو يومين أسبوعياً في المدرسة المهنية (Berufsschule)، حيث يتم تدريس المعارف التخصصية النظرية والمواد العامة.

وتتمثل الميزة الحاسمة للشباب في حصولهم منذ الشهر الأول على مكافأة تدريب شهرية محددة قانونياً، مما يجعلهم أكثر استقلالية مالية مقارنة بطلاب الجامعات التقليديين. وتتراوح مدة التأهيل المهني عادة بين سنتين إلى ثلاث سنوات ونصف، اعتماداً على التخصص والمؤهلات الدراسية المسبقة.

وبعد اجتياز الامتحان النهائي بنجاح أمام غرفة التجارة والصناعة (IHK) أو غرفة الحرف اليدوية (HWK)، تكون فرص التعيين والتثبيت المباشر بالشركة ممتازة للغاية. كما يستفيد العديد من المهنيين من هذه القاعدة الصلبة لاستكمال دراسات عليا لاحقاً لنيل لقب "خبير مهني رئيسي" (Meister) أو فني معتمد (Techniker).`,
    vocabularyUsed: ['gelten', 'bezeichnen', 'erwerben', 'vermitteln', 'bestehen', 'übernehmen', 'absolvieren'],
    unknownWords: [
      { word: 'die Fachkraft', article: 'DIE', plural: 'die Fachkräfte', translation: 'العامل المؤهل / صاحب الكفاءة المهنية', explanation: 'تعبير اقتصادي مركبة من Fach (تخصص) و Kraft (طاقة/عامل)' },
      { word: 'die Verzahnung', article: 'DIE', plural: 'die Verzahnungen', translation: 'التشابك والتكامل المتداخل', explanation: 'مستعارة مجازياً من تروس الآلات المتشابكة' },
      { word: 'die Ausbildungsvergütung', article: 'DIE', plural: 'die Vergütungen', translation: 'مكافأة التدريب المالي', explanation: 'الراتب المالي الذي يتقاضاه المتدرب أثناء فترة دراسته' },
      { word: 'die Übernahme', article: 'DIE', plural: 'die Übernahmen', translation: 'التثبيت في الوظيفة / التعاقد الدائم بعد التدريب', explanation: 'من الفعل übernehmen (تبنى / وظف رسمياً)' },
    ],
    comprehensionQuestions: [
      {
        id: 'q1',
        questionDe: 'Was bedeutet das Wort "dual" im Ausbildungssystem?',
        questionAr: 'ماذا تعني كلمة "مزدوج" في نظام التأهيل المهني؟',
        options: ['Lernen an zwei Orten: Betrieb und Berufsschule', 'Zwei Prüfungen an einem Tag', 'Arbeiten in zwei Firmen gleichzeitig', 'Zwei verschiedene Berufe erlernen'],
        correctAnswer: 'Lernen an zwei Orten: Betrieb und Berufsschule',
        explanationAr: 'ذكر في النص: "Lernen an zwei unterschiedlichen Lernorten: Im Betrieb und in der Berufsschule".',
      },
      {
        id: 'q2',
        questionDe: 'Welchen finanziellen Vorteil haben Azubis gegenüber Studenten?',
        questionAr: 'ما هي الميزة المالية للمتدربين مقارنة بالطلاب الجامعيين؟',
        options: ['Sie erhalten ab dem ersten Monat eine Ausbildungsvergütung', 'Sie zahlen keine Steuern', 'Sie bekommen kostenlose Wohnungen', 'Sie fahren umsonst mit dem Taxi'],
        correctAnswer: 'Sie erhalten ab dem ersten Monat eine Ausbildungsvergütung',
        explanationAr: 'ذكر في النص: "dass sie vom ersten Monat an eine monatliche Ausbildungsvergütung erhalten".',
      },
      {
        id: 'q3',
        questionDe: 'Vor welcher Institution wird die Abschlussprüfung abgelegt?',
        questionAr: 'أمام أي مؤسسة رسمية يتم أداء الامتحان النهائي؟',
        options: ['IHK oder HWK', 'Vor der Bundespolizei', 'Beim Auswärtigen Amt', 'Beim Arbeitsamt'],
        correctAnswer: 'IHK oder HWK',
        explanationAr: 'ذكر في النص: "vor der Industrie- und Handelskammer (IHK) oder der Handwerkskammer (HWK)".',
      },
    ],
  },
  {
    titleDe: 'Umweltschutz und Mülltrennung im deutschen Alltag',
    titleAr: 'حماية البيئة وفرز النفايات في الحياة اليومية الألمانية',
    cefrLevel: 'B1',
    topic: 'Umwelt & Nachhaltigkeit (البيئة وإعادة التدوير)',
    storyTextDe: `Wer neu nach Deutschland zieht, ist zu Beginn oft überrascht oder sogar überfordert von den vielen verschiedenen Mülltonnen im Innenhof. Doch was auf den ersten Blick kompliziert erscheint, ist das Resultat eines jahrzehntelangen Umweltbewusstseins: Die strikte Mülltrennung und das Recyclingsystem.

In fast jedem deutschen Haushalt gibt es mindestens vier verschiedene Behälter: Die blaue Tonne ist ausschließlich für Altpapier und Pappe reserviert. In die gelbe Tonne (oder den "Gelben Sack") gehören Leichtverpackungen aus Plastik, Metall und Verbundstoffen, die mit dem "Grünen Punkt" gekennzeichnet sind. Organische Küchenabfälle wie Obstschalen und Kaffeesatz wandern in die braune Biotonne, aus der später wertvoller Kompost entsteht. Alles, was nicht recycelt werden kann, kommt in die schwarze oder graue Restmülltonne.

Ein weiteres Herzstück der deutschen Kreislaufwirtschaft ist das sogenannte "Pfandsystem". Beim Kauf von Getränken in Plastik- oder Glasflaschen sowie Dosen zahlt der Kunde ein Pfand (zwischen 8 und 25 Cent pro Flasche). Bringt man das Leergut an den Automaten im Supermarkt zurück, erhält man sein Geld vollständig erstattet.

Durch dieses konsequente System werden wertvolle Rohstoffe geschont, der Energieverbrauch gesenkt und die Umwelt nachhaltig vor Plastikmüll geschützt. Für die Bürger ist es längst zu einer selbstverständlichen Gewohnheit geworden.`,
    storyTextAr: `إن كل من ينتقل حديثاً للعيش في ألمانيا غالباً ما يفاجأ أو يشعر بالحيرة في البداية أمام كثرة حاويات القمامة المتعددة في باحة البناية. ولكن ما يبدو معقداً للوهلة الأولى هو في الواقع نتاج لعقود من الوعي البيئي المتقدم: إنه نظام الفرز الصارم للنفايات وإعادة التدوير.

في كل منزل ألماني تقريباً توجد أربع حاويات مختلفة على الأقل: الحاوية الزرقاء مخصصة حصرياً للأوراق القديمة والكرتون. وفي الحاوية الصفراء (أو الكيس الأصفر) توضع العبوات البلاستيكية الخفيفة والمعادن والمواد المركبة التي تحمل علامة "النقطة الخضراء". أما بقايا الطعام العضوية مثل قشور الفواكه وثفل القهوة فتوضع في الحاوية البنية الحيوية (Biotonne) التي يُصنع منها لاحقاً سماد زراعي ثمين. وكل ما لا يمكن تدويره يُلقى في حاوية النفايات المتبقية السوداء أو الرمادية (Restmüll).

ومن الركائز الأساسية للاقتصاد الدائري في ألمانيا نظام "الرهن وإعادة القوارير" (Pfandsystem). فعند شراء المشروبات في زجاجات بلاستيكية أو زجاجية أو علب معدنية يدفع المشتري مبلغ رهن مالي إضافي (بين 8 إلى 25 سنتاً للعبوة). وعند إعادة القوارير الفارغة إلى الأجهزة المخصصة بالسوبرماركت، يسترد العميل أمواله بالكامل.

وبفضل هذا النظام الحازم يتم الحفاظ على الموارد الطبيعية الثمينة، وخفض استهلاك الطاقة، وحماية البيئة بشكل مستدام من التلوث البلاستيكي. وقد أصبح هذا السلوك لدى المواطنين عادة يومية بديهية وملازمة لحياتهم.`,
    vocabularyUsed: ['überraschen', 'gehören', 'schonen', 'senken', 'erstatten', 'schützen'],
    unknownWords: [
      { word: 'die Mülltrennung', article: 'DIE', plural: 'die Mülltrennungen', translation: 'فرز القمامة وفصل النفايات', explanation: 'مركبة من Müll (قمامة) و Trennung (فصل/عزل)' },
      { word: 'das Pfand', article: 'DAS', plural: 'die Pfänder', translation: 'الرهن المالي المسترد على القوارير', explanation: 'مبلغ يدفع ويسترد عند إرجاع العبوة الفارغة للماكينة' },
      { word: 'das Leergut', article: 'DAS', plural: 'kein Plural', translation: 'القوارير والعلب الفارغة المرتجعة', explanation: 'مركبة من leer (فارغ) و Gut (بضاعة/سلع)' },
      { word: 'die Kreislaufwirtschaft', article: 'DIE', plural: 'die Wirtschaften', translation: 'الاقتصاد الدائري القائم على إعادة التدوير', explanation: 'Kreislauf (دورة) + Wirtschaft (اقتصاد)' },
    ],
    comprehensionQuestions: [
      {
        id: 'q1',
        questionDe: 'Was gehört in die blaue Mülltonne?',
        questionAr: 'ما الذي يوضع في الحاوية الزرقاء؟',
        options: ['Altpapier und Pappe', 'Plastikflaschen', 'Bananenschalen', 'Restmüll'],
        correctAnswer: 'Altpapier und Pappe',
        explanationAr: 'ذكر في النص: "Die blaue Tonne ist ausschließlich für Altpapier und Pappe reserviert".',
      },
      {
        id: 'q2',
        questionDe: 'Wie viel Pfand zahlt man typischerweise pro Flasche oder Dose?',
        questionAr: 'كم يبلغ مبلغ الرهن (Pfand) عادة لكل عبوة؟',
        options: ['Zwischen 8 und 25 Cent', '1 Euro bis 2 Euro', '50 Cent pauschal', 'Überhaupt kein Pfand'],
        correctAnswer: 'Zwischen 8 und 25 Cent',
        explanationAr: 'ذكر في النص: "zahlt der Kunde ein Pfand (zwischen 8 und 25 Cent pro Flasche)".',
      },
      {
        id: 'q3',
        questionDe: 'Was entsteht später aus den organischen Bioabfällen?',
        questionAr: 'ما الذي ينتج لاحقاً من المخلفات العضوية الحيوية؟',
        options: ['Wertvoller Kompost (سماد طبيعي)', 'Plastiktüten', 'Neues Papier', 'Glasflaschen'],
        correctAnswer: 'Wertvoller Kompost (سماد طبيعي)',
        explanationAr: 'ذكر في النص: "aus der später wertvoller Kompost entsteht".',
      },
    ],
  },
  {
    titleDe: 'Das erfolgreiche Vorstellungsgespräch',
    titleAr: 'مقابلة العمل الناجحة والخطوات الحاسمة',
    cefrLevel: 'B1',
    topic: 'Bewerbung & Arbeitsmarkt (التقديم للوظائف)',
    storyTextDe: `Ein Vorstellungsgespräch in Deutschland erfordert eine gründliche und strukturierte Vorbereitung. Als Layla die Einladung zu einem persönlichen Gespräch bei einem renommierten Softwarehaus in Stuttgart erhielt, wusste sie, dass nun jeder Schritt zählte.

Zunächst recherchierte sie intensiv über die Unternehmensphilosophie, die aktuellen Produkte und die Marktkonkurrenten der Firma. Am Tag des Gesprächs wählte sie gepflegte Business-Kleidung und traf zwanzig Minuten vor dem vereinbarten Termin am Firmengebäude ein. Pünktlichkeit ist in der deutschen Arbeitskultur schließlich das oberste Gebot.

Das Gespräch führten der Abteilungsleiter Herr Dr. Krause und die Personalleiterin Frau Sommer. Nach einer kurzen Begrüßung und etwas Smalltalk bat man Layla: "Erzählen Sie uns bitte in fünf Minuten von Ihrem bisherigen Werdegang und Ihren größten beruflichen Erfolgen." 

Layla antwortete ruhig, flüssig und strukturiert. Anstatt nur Stationen ihres Lebenslaufs aufzuzählen, betonte sie konkrete Probleme, die sie in vergangenen Projekten gelöst hatte. Als die unvermeidliche Frage nach ihren Schwächen gestellt wurde, zeigte sie Selbstreflexion: "Manchmal neige ich zu Perfektionismus, weshalb ich gelernt habe, klare Prioritäten zu setzen und Aufgaben rechtzeitig zu delegieren."

Am Ende stellte Layla selbst zwei fundierte Fragen zur Teamstruktur und den Weiterbildungsmöglichkeiten. Zwei Tage später klingelte ihr Telefon: Sie hatte die Stelle bekommen!`,
    storyTextAr: `تتطلب مقابلة العمل في ألمانيا تحضيراً دقيقاً ومنهجياً. وعندما تلقت ليلى دعوة لإجراء مقابلة شخصية لدى شركة برمجيات مرموقة في شتوتغارت، أدركت أن كل خطوة تحسب بدقة.

في البداية، قامت ببحث مكثف حول فلسفة الشركة ومنتجاتها الحالية ومنافسيها في السوق. وفي يوم المقابلة اختارت ملابس عمل رسمية وأنيقة ووصلت قبل الموعد بعشرين دقيقة إلى مقر الشركة؛ فالانضباط في المواعيد يعتبر في ثقافة العمل الألمانية المبدأ الأسمى.

أدار المقابلة رئيس القسم الدكتور كلاوزه ومديرة الموارد البشرية السيدة زومر. وبعد ترحيب قصير ودردشة ودية خفيفة، طُلب من ليلى: "حدثينا في خمس دقائق عن مسيرتك المهنية السابقة وأبرز نجاحاتك."

أجابت ليلى بهدوء وطلاقة وبشكل منظم. وعوضاً عن مجرد سرد محطات سيرتها الذاتية، ركزت على مشكلات حقيقية وملموسة نجحت في حلها خلال مشاريعها السابقة. وعندما طُرح عليها السؤال التقليدي عن نقاط ضعفها، أظهرت وعياً ذاتياً ونضجاً: "أحياناً أميل للرغبة في الكمال الزائد، ولذلك تعلمت وضع أولويات واضحة وتفويض المهام في الوقت المناسب."

وفي ختام المقابلة، طرحت ليلى بنفسها سؤالين عميقين حول هيكل الفريق وفرص التطوير المهني. وبعد يومين رن هاتفها: لقد تم قبولها في الوظيفة!`,
    vocabularyUsed: ['erfordern', 'recherchieren', 'erzählen', 'betonen', 'lösen', 'delegieren', 'bekommen'],
    unknownWords: [
      { word: 'das Vorstellungsgespräch', article: 'DAS', plural: 'die Vorstellungsgespräche', translation: 'مقابلة العمل الشخصية', explanation: 'مركبة من Vorstellung (تعريف بالنفس) و Gespräch (محادثة)' },
      { word: 'der Werdegang', article: 'DER', plural: 'die Werdegänge', translation: 'المسيرة والتطور المهني والشخصي', explanation: 'من الفعل werden (يصبح) و Gang (مسار)' },
      { word: 'die Selbstreflexion', article: 'DIE', plural: 'die Reflexionen', translation: 'مراجعة وتقييم الذات بموضوعية', explanation: 'القدرة على فهم نقاط القوة والضعف في النفس' },
      { word: 'das Gebot', article: 'DAS', plural: 'die Gebote', translation: 'الوصية / المبدأ الإلزامي الأسمى', explanation: 'das oberste Gebot = الأولوية القصوى التي لا تنازل عنها' },
    ],
    comprehensionQuestions: [
      {
        id: 'q1',
        questionDe: 'Wie bereitete sich Layla auf das Vorstellungsgespräch vor?',
        questionAr: 'كيف استعدت ليلى لمقابلة العمل؟',
        options: ['Sie recherchierte intensiv über die Firma und Produkte', 'Sie lernte die ganze Nacht Grammatik', 'Sie ging ohne Vorbereitung hin', 'Sie rief vorher die Konkurrenz an'],
        correctAnswer: 'Sie recherchierte intensiv über die Firma und Produkte',
        explanationAr: 'ذكر في النص: "recherchierte sie intensiv über die Unternehmensphilosophie, die Produkte...".',
      },
      {
        id: 'q2',
        questionDe: 'Wie reagierte Layla auf die Frage nach ihren Schwächen?',
        questionAr: 'كيف تصرفت ليلى عند سؤالها عن نقاط ضعفها؟',
        options: ['Mit Selbstreflexion über ihren Hang zum Perfektionismus', 'Sie sagte, sie habe überhaupt keine Schwächen', 'Sie weigerte sich zu antworten', 'Sie fing an zu weinen'],
        correctAnswer: 'Mit Selbstreflexion über ihren Hang zum Perfektionismus',
        explanationAr: 'أظهرت نضجاً بذكر ميلها للكمال وكيف عالجت ذلك بوضع الأولويات.',
      },
      {
        id: 'q3',
        questionDe: 'Wann erfuhr Layla das Ergebnis des Gesprächs?',
        questionAr: 'متى علمت ليلى بنتيجة المقابلة؟',
        options: ['Zwei Tage später per Telefonanruf', 'Sofort im Raum', 'Erst nach zwei Monaten', 'Per Brief nach einem Jahr'],
        correctAnswer: 'Zwei Tage später per Telefonanruf',
        explanationAr: 'ذكر في النص: "Zwei Tage später klingelte ihr Telefon: Sie hatte die Stelle bekommen!".',
      },
    ],
  },

  // ==========================================
  // LEVEL B2 - 3 Passages
  // ==========================================
  {
    titleDe: 'Künstliche Intelligenz und die Transformation der Arbeitswelt',
    titleAr: 'الذكاء الاصطناعي والتحول الجذري في بيئة العمل المعاصرة',
    cefrLevel: 'B2',
    topic: 'Technologie & Wirtschaft (الذكاء الاصطناعي والاقتصاد)',
    storyTextDe: `Der unaufhaltsame Vormarsch generativer künstlicher Intelligenz markiert eine fundamentale Zäsur in der Geschichte der industriellen und digitalen Entwicklung. Was vor wenigen Jahren noch als Science-Fiction galt, revolutioniert heutzutage rasant nahezu sämtliche Berufsfelder – von der Medizin über das Ingenieurwesen bis hin zur Rechtsberatung.

Wirtschaftswissenschaftler und Soziologen debattieren kontrovers über die sozioökonomischen Implikationen dieser Technologie. Skeptiker befürchten eine beispiellose Welle von Arbeitsplatzverlusten, da repetitive kognitive Tätigkeiten zunehmend automatisiert werden. Auf der anderen Seite argumentieren Optimisten, dass durch die Freisetzung von Ressourcen völlig neue Berufsfelder entstehen und menschliche Arbeitskräfte von monotonen Routineaufgaben entlastet werden, um sich kreativen und strategischen Herausforderungen widmen zu können.

In Deutschland betonen Experten vor allem die Notwendigkeit kontinuierlicher Weiterbildung (das sogenannte lebenslange Lernen). Reine Fachkenntnisse veralten heutzutage in rasantem Tempo; entscheidend werden zunehmend metakognitive Fähigkeiten, kritisches Urteilsvermögen und ethische Urteilskraft im Umgang mit KI-Systemen.

Unternehmen stehen vor der anspruchsvollen Aufgabe, KI-Lösungen strategisch zu implementieren, ohne dabei die Datensouveränität und den Arbeitnehmerschutz zu vernachlässigen. Der Schlüssel zu einer erfolgreichen Zukunft liegt folglich nicht im blinden Widerstand gegen den Fortschritt, sondern in der kompetenten und verantwortungsbewussten Symbiose aus menschlicher und künstlicher Intelligenz.`,
    storyTextAr: `يمثل الزحف الذي لا يمكن إيقافه للذكاء الاصطناعي التوليدي نقطة تحول جوهرية وحاسمة في تاريخ التطور الصناعي والرقمي. فما كان يُعد قبل سنوات قلائل مجرد خيال علمي، أصبح اليوم يحدث ثورة متسارعة في كافة المجالات المهنية تقريباً، بدءاً من الطب والهندسة وصولاً إلى الاستشارات القانونية.

ويخوض علماء الاقتصاد والاجتماع نقاشات محتدمة حول التداعيات الاجتماعية والاقتصادية لهذه التكنولوجيا. إذ يخشى المتشككون من موجة غير مسبوقة لفقدان الوظائف نتيجة لأتمتة المهام الذهنية المتكررة. وفي المقابل، يرى المتفائلون أن تحرير الموارد سيؤدي لنشوء مجالات وظيفية جديدة كلياً وتخفيف الأعباء الروتينية الرتيبة عن الكوادر البشرية لتكريس طاقاتهم للإبداع والمهام الاستراتيجية.

وفي ألمانيا، يشدد الخبراء على ضرورة التدريب والتأهيل المستمر (المعروف بـ التعلم مدى الحياة). فالمعارف التخصصية البحتة أصبحت تتقادم وتفقد قيمتها بسرعة فائقة؛ مما جعل المهارات الإدراكية العليا، والتفكير النقدي، والمسؤولية الأخلاقية في التعامل مع أنظمة الذكاء الاصطناعي هي المعايير الحاسمة للنجاح.

وتواجه الشركات اليوم التحدي المعقد المتمثل في تطبيق حلول الذكاء الاصطناعي استراتيجياً دون التفريط في سيادة البيانات أو التعدي على حقوق حماية العمال. وبالتالي، فإن مفتاح المستقبل الناجح لا يكمن في المقاومة العمياء للتقدم، بل في بناء تكامل واعٍ ومسؤول بين الذكاء البشري والاصطناعي.`,
    vocabularyUsed: ['markieren', 'revolutionieren', 'debattieren', 'automatisieren', 'entlasten', 'widmen', 'implementieren'],
    unknownWords: [
      { word: 'die Zäsur', article: 'DIE', plural: 'die Zäsuren', translation: 'نقطة التحول التاريخية الفاصلة', explanation: 'حدث بارز يفصل بين عصرين مختلفين تماماً' },
      { word: 'die Implikation', article: 'DIE', plural: 'die Implikationen', translation: 'التداعيات والانعكاسات المترتبة', explanation: 'مصطلح أكاديمي واقتصادي رفيع المستوى' },
      { word: 'metakognitiv', translation: 'ما وراء المعرفة / الإدراك التحليلي', explanation: 'القدرة على التفكير في طريقة التفكير والتعلم الذاتي' },
      { word: 'die Datensouveränität', article: 'DIE', plural: 'die Souveränitäten', translation: 'سيادة وأمان البيانات واستقلاليتها', explanation: 'مفهوم ألماني وأوروبي لحماية البيانات الوطنية والشخصية' },
    ],
    comprehensionQuestions: [
      {
        id: 'q1',
        questionDe: 'Was befürchten Skeptiker bezüglich künstlicher Intelligenz?',
        questionAr: 'ماذا يخشى المتشككون بخصوص انتشار الذكاء الاصطناعي؟',
        options: ['Den Verlust von Arbeitsplätzen durch Automatisierung', 'Dass Computer zu teuer werden', 'Einen weltweiten Stromausfall', 'Dass niemand mehr studieren will'],
        correctAnswer: 'Den Verlust von Arbeitsplätzen durch Automatisierung',
        explanationAr: 'ذكر في النص: "Skeptiker befürchten eine beispiellose Welle von Arbeitsplatzverlusten".',
      },
      {
        id: 'q2',
        questionDe: 'Welche menschlichen Fähigkeiten gewinnen im Zeitalter der KI an Bedeutung?',
        questionAr: 'ما هي القدرات البشرية التي تزداد أهميتها في عصر الذكاء الاصطناعي؟',
        options: ['Kritisches Urteilsvermögen und ethische Urteilskraft', 'Schnelles Auswendiglernen von Zahlen', 'Körperliche Ausdauer am Fließband', 'Alleiniges Wiederholen von Formeln'],
        correctAnswer: 'Kritisches Urteilsvermögen und ethische Urteilskraft',
        explanationAr: 'ذكر في النص: "kritisches Urteilsvermögen und ethische Urteilskraft im Umgang mit KI".',
      },
      {
        id: 'q3',
        questionDe: 'Worin liegt laut dem Text der Schlüssel zu einer erfolgreichen Zukunft?',
        questionAr: 'أين يكمن مفتاح المستقبل الناجح وفقاً لما ورد في النص؟',
        options: ['In einer Symbiose aus menschlicher und künstlicher Intelligenz', 'Im totalen Verbot von Algorithmen', 'In der Abschaffung aller Technologie', 'Im Verzicht auf Weiterbildung'],
        correctAnswer: 'In einer Symbiose aus menschlicher und künstlicher Intelligenz',
        explanationAr: 'ذكر في الخاتمة: "in der kompetenten Symbiose aus menschlicher und künstlicher Intelligenz".',
      },
    ],
  },
  {
    titleDe: 'Urbane Mobilität und nachhaltige Stadtentwicklung',
    titleAr: 'التنقل الحضري والتنمية المستدامة للمدن الحديثة',
    cefrLevel: 'B2',
    topic: 'Stadtplanung & Mobilität (تخطيط المدن والبيئة)',
    storyTextDe: `Europäische Metropolen wie Berlin, Wien und Kopenhagen stehen vor einer der gravierendsten Herausforderungen des einundzwanzigsten Jahrhunderts: Wie lässt sich wachsende urbane Mobilität gewährleisten, ohne die Lebensqualität der Einwohner durch Luftverschmutzung, Lärmbelastung und Dauerstaus zu ruinieren?

Die Antwort fortschrittlicher Stadtplaner lautet "Verkehrswende". Dieses Konzept zielt darauf ab, den motorisierten Individualverkehr drastisch zu reduzieren und stattdessen den öffentlichen Personennahverkehr (ÖPNV), Radschnellwege und Sharing-Konzepte konsequent auszubauen. Das Ziel ist die sogenannte "15-Minuten-Stadt", in der alle essenziellen Einrichtungen des täglichen Bedarfs – Arbeitsplätze, Ärzte, Supermärkte und Schulen – innerhalb einer Viertelstunde zu Fuß oder mit dem Fahrrad erreichbar sind.

Pilotprojekte wie autofreie Innenstadtzonen und vergünstigte Jahrestickets (wie das Deutschlandticket für monatlich 49 Euro) stoßen jedoch nicht überall auf ungeteilte Begeisterung. Gewerbetreibende und Pendler aus dem ländlichen Raum monieren oft, dass die Anbindung an die Randgebiete unzureichend sei und das Auto für sie nach wie vor alternativlos bleibe.

Um die Verkehrswende sozial gerecht und ökonomisch tragfähig zu gestalten, bedarf es folglich massiver Investitionen in die Schieneninfrastruktur und einer engen Kooperation zwischen Politik, Wirtschaft und Bürgern. Nur so kann der Wandel von einer autozentrierten zu einer menschengerechten Stadt gelingen.`,
    storyTextAr: `تقف العواصم والمدن الكبرى مثل برلين، فيينا، وكوبنهاغن أمام أحد أخطر تحديات القرن الحادي والعشرين: كيف يمكن ضمان سهولة التنقل الحضري المتنامي دون تدمير جودة حياة السكان بفعل تلوث الهواء، التلوث الضوضائي، والاختناقات المرورية المزمنة؟

وتتلخص إجابة مخططي المدن التقدميين في مصطلح "التحول في قطاع النقل" (Verkehrswende). ويهدف هذا المفهوم إلى تقليص الاعتماد على السيارات الخاصة الفردية بشكل جذري، والاستعاضة عنها بالتوسع المكثف في شبكات النقل العام (ÖPNV)، ومسارات الدراجات السريعة، ونماذج التشارك في المركبات. والهدف النهائي هو تحقيق ما يعرف بـ "مدينة الـ 15 دقيقة"، حيث يمكن الوصول لكافة المرافق الحيوية اليومية من أماكن عمل، أطباء، مدارس، ومتاجر في غضون ربع ساعة سيراً أو بالدراجة.

غير أن المشاريع التجريبية مثل المناطق الخالية من السيارات في مراكز المدن والاشتراكات المخفضة (مثل تذكرة ألمانيا Deutschlandticket بـ 49 يورو شهرياً) لا تلقى قبولاً مطلقاً من الجميع. حيث يشكو أصحاب المتاجر والمسافرون يومياً من المناطق الريفية من عدم كفاية خطوط الربط في الضواحي، وأن السيارة تظل بالنسبة لهم خياراً لا بديل عنه.

ولكي يكون هذا التحول عادلاً اجتماعياً وقابلاً للاستدامة اقتصادياً، يتطلب الأمر استثمارات ضخمة في البنية التحتية للسكك الحديدية وتعاوناً وثيقاً بين السياسة وقطاع الأعمال والمواطنين. وبهذا فقط يمكن إنجاح التحول من مدن تتمحور حول السيارات إلى مدن مصممة لخدمة الإنسان ورفاهيته.`,
    vocabularyUsed: ['gewährleisten', 'ruinieren', 'reduzieren', 'ausbauen', 'stoßen', 'monieren', 'bedürfen', 'gelingen'],
    unknownWords: [
      { word: 'die Verkehrswende', article: 'DIE', plural: 'die Verkehrswenden', translation: 'التحول الشامل في منظومة النقل والمواصلات', explanation: 'التحول من السيارات الخاصة إلى النقل العام والدراجات' },
      { word: 'der ÖPNV', article: 'DER', translation: 'النقل العام للركاب (مترو، قطارات، حافلات)', explanation: 'اختصار شهير لـ Öffentlicher Personennahverkehr' },
      { word: 'der Pendler', article: 'DER', plural: 'die Pendler', translation: 'المسافر يومياً بين محل السكن ومقر العمل', explanation: 'من الفعل pendeln (تنقل ذهاباً وإياباً بانتظام)' },
      { word: 'menschengerecht', translation: 'ملائم لكرامة واحتياجات الإنسان', explanation: 'صفة تعبر عن التصميم الحضري الذي يضع صحة الإنسان أولاً' },
    ],
    comprehensionQuestions: [
      {
        id: 'q1',
        questionDe: 'Was ist das Kernziel des Konzepts der "15-Minuten-Stadt"?',
        questionAr: 'ما هو الهدف الأساسي لمفهوم "مدينة الـ 15 دقيقة"؟',
        options: ['Alle wichtigen Orte in 15 Minuten zu Fuß oder per Rad zu erreichen', 'Dass alle Ampeln nach 15 Minuten umschalten', 'Dass man nur 15 Minuten am Tag arbeiten darf', 'Dass die U-Bahn alle 15 Minuten fährt'],
        correctAnswer: 'Alle wichtigen Orte in 15 Minuten zu Fuß oder per Rad zu erreichen',
        explanationAr: 'ذكر في النص: "alle essenziellen Einrichtungen... innerhalb einer Viertelstunde zu Fuß oder mit dem Fahrrad erreichbar sind".',
      },
      {
        id: 'q2',
        questionDe: 'Was kritisieren Pendler aus dem ländlichen Raum?',
        questionAr: 'ما هو مأخذ وشكوى المسافرين القادمين من المناطق الريفية؟',
        options: ['Die unzureichende Anbindung des ÖPNV an die Randgebiete', 'Dass Benzin zu billig sei', 'Dass es zu viele Fahrradwege gebe', 'Dass Fahrkarten kostenlos seien'],
        correctAnswer: 'Die unzureichende Anbindung des ÖPNV an die Randgebiete',
        explanationAr: 'ذكر في النص: "monieren oft, dass die Anbindung an die Randgebiete unzureichend sei".',
      },
      {
        id: 'q3',
        questionDe: 'Was kostet das bundesweite "Deutschlandticket" pro Monat?',
        questionAr: 'كم يبلغ سعر تذكرة ألمانيا (Deutschlandticket) شهرياً؟',
        options: ['49 Euro', '100 Euro', '15 Euro', 'Kostenlos'],
        correctAnswer: '49 Euro',
        explanationAr: 'ذكر في النص: "Deutschlandticket für monatlich 49 Euro".',
      },
    ],
  },
  {
    titleDe: 'Berufliche Anerkennung und kulturelle Integration',
    titleAr: 'المعادلة والاعتراف المهني والاندماج الثقافي في ألمانيا',
    cefrLevel: 'B2',
    topic: 'Integration & Berufsanerkennung (معادلة الشهادات والاندماج)',
    storyTextDe: `Der bürokratische Weg zur beruflichen Anerkennung ausländischer Studien- und Berufsabschlüsse in der Bundesrepublik Deutschland stellt für viele zugewanderte Fachkräfte ein anspruchsvolles Unterfangen dar. Dies erlebte auch Dr. Amira Mansour, eine erfahrene Fachärztin für Innere Medizin aus Kairo.

Obwohl Amira über exzellente medizinische Fachkenntnisse und mehrjährige Berufserfahrung an renommierten Universitätskliniken verfügte, stand sie in Deutschland vor einem langwierigen Prozess: Zunächst musste sie ihre Dokumente beglaubigen und von vereidigten Übersetzern ins Deutsche übertragen lassen. Anschließend forderte die zuständige Landesärztekammer den Nachweis verhandlungssicherer Sprachkenntnisse auf C1-Niveau sowie das Bestehen einer praxisnahen Fachsprachenprüfung (FSP).

Die größte Hürde bildete jedoch die sogenannte Gleichwertigkeitsprüfung. Um die deutsche Vollapprobation zu erlangen, musste Amira in einer mündlich-praktischen Kenntnisprüfung nachweisen, dass ihr medizinisches Wissen dem eines deutschen Universitätsabsolventen vollumfänglich entspricht. 

Amira ließ sich von den bürokratischen Hürden nicht entmutigen. Sie lernte monatelang intensiv medizinische Fachterminologie und hospitierte an einer Klinik in Hannover. Das Ergebnis: Sie bestand die Kenntnisprüfung mit Bravour und leitet heute als Oberärztin eine kardiologische Station. Ihre Geschichte verdeutlicht, dass Durchhaltevermögen, gezielte Vorbereitung und sprachliche Perfektion die entscheidenden Pfeiler für eine erfolgreiche Integration in den deutschen Arbeitsmarkt darstellen.`,
    storyTextAr: `يمثل المسار البيروقراطي للاعتراف المهني بالشهادات الجامعية والمهنية الأجنبية في جمهورية ألمانيا الاتحادية مهمة شاقة وتحدياً كبيراً للعديد من الكفاءات الوافدة. وكان هذا بالضبط ما خاضته الدكتورة أميرة منصور، وهي طبيبة استشارية في الأمراض الباطنية ذات خبرة واسعة من القاهرة.

فعلى الرغم من امتلاك أميرة لمعارف طبية ممتازة وسنوات من الخبرة السريرية في مستشفيات جامعية مرموقة، واجهت في ألمانيا مساراً طويلاً: كان عليها أولاً تصديق جميع أوراقها وترجمتها عبر مترجمين محلفين ومعتمدين. بعد ذلك، طلبت نقابة الأطباء في الولاية إثبات كفاءة لغوية تفاوضية على مستوى C1 واجتياز امتحان اللغة الطبية التخصصية (FSP).

لكن العقبة الكبرى تمثلت في اختبار المعادلة وتكافؤ الشهادات (Gleichwertigkeitsprüfung). وللحصول على ترخيص مزاولة المهنة الألماني الدائم (Approbation)، كان يتعين على أميرة أن تثبت في امتحان عملي وشفوي (Kenntnisprüfung) أن مستواها الطبي يطابق تماماً خريجي الجامعات الألمانية.

ولم تستسلم أميرة أمام تلك العقبات البيروقراطية؛ بل واصلت دراسة المصطلحات الطبية المتخصصة لأشهر طويلة وتدربت كطبيبة زائرة (Hospitantin) بمستشفى في هانوفر. والنتيجة: اجتازت الامتحان بتفوق باهر وتعمل اليوم كطبيبة أولى (Oberärztin) تدير قسماً لأمراض القلب. وتؤكد قصتها أن الإصرار والتحضير المركز وإتقان اللغة يمثلون الركائز الأساسية للاندماج الناجح في سوق العمل الألماني.`,
    vocabularyUsed: ['verfügen', 'beglaubigen', 'fordern', 'erlangen', 'entsprechen', 'entmutigen', 'hospitieren'],
    unknownWords: [
      { word: 'die Approbation', article: 'DIE', plural: 'die Approbationen', translation: 'ترخيص مزاولة المهنة الطبية الرسمي والدائم', explanation: 'الإذن الحكومي الذي يتيح للطبيب العمل المستقل بألمانيا' },
      { word: 'die Gleichwertigkeitsprüfung', article: 'DIE', plural: 'die Prüfungen', translation: 'فحص معادلة وتكافؤ الشهادة الأجنبية بالألمانية', explanation: 'Gleichwertig (مكافئ) + Prüfung (فحص/امتحان)' },
      { word: 'das Durchhaltevermögen', article: 'DAS', translation: 'قوة التحمل والمثابرة وعدم الاستسلام', explanation: 'durchhalten (صمد/ثابر) + Vermögen (قدرة)' },
      { word: 'hospitieren', translation: 'يقضي فترة تدريب وملاحظة سريرية كطبيب زائر', explanation: 'فعل لاتيني الأصل مستخدم في المشافي الألمانية' },
    ],
    comprehensionQuestions: [
      {
        id: 'q1',
        questionDe: 'Was ist die Approbation in Deutschland?',
        questionAr: 'ما هي الـ Approbation في ألمانيا؟',
        options: ['Die staatliche Zulassung zur uneingeschränkten Berufsausübung als Arzt', 'Ein einfaches Touristenvisum', 'Ein Sprachzertifikat für A1', 'Eine Gebühr für das Parken'],
        correctAnswer: 'Die staatliche Zulassung zur uneingeschränkten Berufsausübung als Arzt',
        explanationAr: 'هي ترخيص مزاولة المهنة الرسمي لممارسة الطب دون قيود.',
      },
      {
        id: 'q2',
        questionDe: 'Welche Sprachprüfung musste Dr. Amira vor der Ärztekammer ablegen?',
        questionAr: 'ما هو الامتحان اللغوي الذي توجب على الدكتورة أميرة اجتيازه؟',
        options: ['Die Fachsprachenprüfung (FSP) auf C1-Niveau', 'Einen A1-Kinderkurs', 'Einen Englischtest', 'Nur ein kurzes Telefonat'],
        correctAnswer: 'Die Fachsprachenprüfung (FSP) auf C1-Niveau',
        explanationAr: 'ذكر في النص: "eine praxisnahe Fachsprachenprüfung (FSP) auf C1-Niveau".',
      },
      {
        id: 'q3',
        questionDe: 'Welche Position hat Dr. Amira heute inne?',
        questionAr: 'ما هو المنصب الذي تشغله الدكتورة أميرة اليوم؟',
        options: ['Oberärztin einer kardiologischen Station', 'Praktikantin im Labor', 'Sekretärin am Empfang', 'Übersetzerin beim Gericht'],
        correctAnswer: 'Oberärztin einer kardiologischen Station',
        explanationAr: 'ذكر في الخاتمة: "leitet heute als Oberärztin eine kardiologische Station".',
      },
    ],
  },
];
