export interface DialogueTurn {
  speaker: string;
  speakerRole: string; // e.g. 'Kunde', 'Bäckerin', 'Sachbearbeiter'
  avatar: string; // emoji or identifier
  textDe: string;
  textAr: string;
}

export interface DialogueChunk {
  de: string;
  ar: string;
  context: string;
  formality: 'FORMAL' | 'INFORMAL' | 'NEUTRAL';
}

export interface RealLifeDialogue {
  id: string;
  titleDe: string;
  titleAr: string;
  situation: string;
  cefrLevel: 'A1' | 'A2' | 'B1' | 'B2';
  icon: string;
  turns: DialogueTurn[];
  keyChunks: DialogueChunk[];
}

export const curatedRealLifeDialogues: RealLifeDialogue[] = [
  // ==========================================
  // 1. BEIM BÄCKER (عند الخباز) - A1
  // ==========================================
  {
    id: 'beim-baecker-a1',
    titleDe: 'Beim Bäcker: Frisches Brot und Brötchen kaufen',
    titleAr: 'عند الخباز: شراء الخبز الطازج والمعجنات',
    situation: 'شراء الإفطار الصباحي في المخبز الألماني التقليدي، السؤال عن المكونات، والدفع نقداً أو بالبطاقة.',
    cefrLevel: 'A1',
    icon: '🥖',
    turns: [
      {
        speaker: 'Verkäuferin',
        speakerRole: 'البائعة في المخبز',
        avatar: '👩‍🍳',
        textDe: 'Guten Morgen! Der Nächste bitte! Was darf es denn für Sie sein?',
        textAr: 'صباح الخير! التالي من فضلك! ماذا تود أن تطلب اليوم؟',
      },
      {
        speaker: 'Kunde',
        speakerRole: 'المشتري',
        avatar: '🙋‍♂️',
        textDe: 'Guten Morgen! Ich hätte gerne vier normale Weizenbrötchen und zwei Laugenbrezeln.',
        textAr: 'صباح الخير! أود من فضلك أربعة أرغفة بيضاء عادية واثنين من كعك البريتزل المملح.',
      },
      {
        speaker: 'Verkäuferin',
        speakerRole: 'البائعة في المخبز',
        avatar: '👩‍🍳',
        textDe: 'Sehr gerne. Darf es sonst noch etwas sein? Unser Vollkornbrot ist heute ganz frisch aus dem Ofen.',
        textAr: 'بكل سرور. هل تود شيئاً آخر؟ خبز الحبوب الكاملة لدينا خرج لتوه طازجاً من الفرن.',
      },
      {
        speaker: 'Kunde',
        speakerRole: 'المشتري',
        avatar: '🙋‍♂️',
        textDe: 'Ja, das nehme ich auch gerne! Könnten Sie mir das Brot bitte direkt in Scheiben schneiden?',
        textAr: 'نعم، سآخذ منه بكل سرور! هل يمكنك من فضلك تقطيع الخبز لي إلى شرائح مباشرة؟',
      },
      {
        speaker: 'Verkäuferin',
        speakerRole: 'البائعة في المخبز',
        avatar: '👩‍🍳',
        textDe: 'Selbstverständlich, dünne oder dicke Scheiben? - Dünne bitte! - Das macht dann zusammen sechs Euro fünfzig.',
        textAr: 'بالطبع، هل تفضل شرائح رقيقة أم سميكة؟ - رقيقة من فضلك! - الحساب الإجمالي 6 يورو و50 سنتاً.',
      },
      {
        speaker: 'Kunde',
        speakerRole: 'المشتري',
        avatar: '🙋‍♂️',
        textDe: 'Kann ich mit Karte zahlen oder nur bar? Hier sind zehn Euro.',
        textAr: 'هل يمكنني الدفع بالبطاقة البنكية أم نقداً فقط؟ تفضلي، ها هي عشرة يوروهات.',
      },
      {
        speaker: 'Verkäuferin',
        speakerRole: 'البائعة في المخبز',
        avatar: '👩‍🍳',
        textDe: 'Kartenzahlung geht ab fünf Euro auch! Hier sind drei Euro fünfzig zurück und Ihr Kassenbon. Einen schönen Tag noch!',
        textAr: 'الدفع بالبطاقة متاح من أول 5 يورو أيضاً! ها هي ثلاثة يوروهات ونصف متبقية وإيصال الشراء. طاب يومك!',
      },
      {
        speaker: 'Kunde',
        speakerRole: 'المشتري',
        avatar: '🙋‍♂️',
        textDe: 'Vielen Dank, Ihnen ebenfalls! Auf Wiedersehen!',
        textAr: 'شكراً جزيلاً، ولك بالمثل! إلى اللقاء!',
      },
    ],
    keyChunks: [
      { de: 'Ich hätte gerne...', ar: 'أود من فضلك / أرغب في...', context: 'الأسلوب الأكثر تهذيباً للطلب في المتاجر والمطاعم', formality: 'FORMAL' },
      { de: 'Was darf es sein?', ar: 'ماذا تود أن تطلب؟', context: 'سؤال البائعين المعتاد في ألمانيا', formality: 'FORMAL' },
      { de: 'In Scheiben schneiden', ar: 'تقطيع إلى شرائح', context: 'يطلب من الخباز لتقطيع رغيف الخبز في الماكينة', formality: 'NEUTRAL' },
      { de: 'Schönen Tag noch!', ar: 'أتمنى لك يوماً جميلاً متبقياً!', context: 'تحية الوداع اليومية الشائعة جداً بين الألمان', formality: 'NEUTRAL' },
      { de: 'Ihnen ebenfalls!', ar: 'ولك بالمثل / وأنت كذلك!', context: 'الرد الفوري واللبق على أي تمنٍ لطيف', formality: 'FORMAL' },
    ],
  },

  // ==========================================
  // 2. BEI DER AUSLÄNDERBEHÖRDE (في مكتب الأجانب والإقامة) - A2/B1
  // ==========================================
  {
    id: 'auslaenderbehoerde-b1',
    titleDe: 'Bei der Ausländerbehörde: Aufenthaltstitel verlängern',
    titleAr: 'في مصلحة شؤون الأجانب: تمديد تصريح الإقامة',
    situation: 'موعد رسمي لتجديد تصريح الإقامة وتقديم عقود العمل وكشف الحساب البنكي وإثبات التأمين الصحي.',
    cefrLevel: 'A2',
    icon: '🏛️',
    turns: [
      {
        speaker: 'Sachbearbeiter',
        speakerRole: 'الموظف المسؤول',
        avatar: '👨‍💼',
        textDe: 'Guten Tag, Herr Mansour. Nehmen Sie bitte Platz. Sie sind heute hier zur Verlängerung Ihrer Aufenthaltserlaubnis, richtig?',
        textAr: 'طاب يومك يا سيد منصور. تفضل بالجلوس من فضلك. أنت هنا اليوم لتمديد تصريح إقامتك، أليس كذلك؟',
      },
      {
        speaker: 'Antragsteller',
        speakerRole: 'مقدم الطلب',
        avatar: '🙋‍♂️',
        textDe: 'Guten Tag! Ja, genau. Meine aktuelle Aufenthaltserlaubnis läuft in vier Wochen ab.',
        textAr: 'طاب يومك! نعم، بالضبط. تصريح إقامتي الحالي سينتهي خلال أربعة أسابيع.',
      },
      {
        speaker: 'Sachbearbeiter',
        speakerRole: 'الموظف المسؤول',
        avatar: '👨‍💼',
        textDe: 'Gut. Haben Sie alle erforderlichen Unterlagen vollständig mitgebracht? Ich benötige Ihren Reisepass, ein aktuelles biometrisches Passfoto und den Arbeitsvertrag.',
        textAr: 'حسناً. هل أحضرت معك كافة المستندات المطلوبة كاملة؟ أحتاج إلى جواز سفرك، صورة شخصية بيومترية حديثة، وعقد العمل.',
      },
      {
        speaker: 'Antragsteller',
        speakerRole: 'مقدم الطلب',
        avatar: '🙋‍♂️',
        textDe: 'Hier sind mein Pass, das Foto und der Arbeitsvertrag. Außerdem habe ich die Gehaltsabrechnungen der letzten drei Monate und die Mitgliedsbescheinigung der Krankenkasse beigelegt.',
        textAr: 'ها هو جواز سفري، الصورة، وعقد العمل. بالإضافة إلى ذلك أرفقت قسائم الرواتب للأشهر الثلاثة الأخيرة وشهادة عضوية التأمين الصحي.',
      },
      {
        speaker: 'Sachbearbeiter',
        speakerRole: 'الموظف المسؤول',
        avatar: '👨‍💼',
        textDe: 'Sehr vorbildlich, das spart uns viel Zeit. Wie sieht es mit Ihrem Wohnraum aus? Haben Sie die Wohnungsgeberbestätigung dabei?',
        textAr: 'ممتاز ومنظم جداً، هذا يوفر علينا الكثير من الوقت. وماذا عن سكنك؟ هل معك شهادة تأكيد المالك للسكن (Wohnungsgeberbestätigung)؟',
      },
      {
        speaker: 'Antragsteller',
        speakerRole: 'مقدم الطلب',
        avatar: '🙋‍♂️',
        textDe: 'Ja, hier ist das Original vom Vermieter unterschrieben.',
        textAr: 'نعم، ها هي النسخة الأصلية موقعة من مالك العقار.',
      },
      {
        speaker: 'Sachbearbeiter',
        speakerRole: 'الموظف المسؤول',
        avatar: '👨‍💼',
        textDe: 'Alles in bester Ordnung. Wir nehmen jetzt Ihre Fingerabdrücke ab. Die Bearbeitung dauert circa vier bis sechs Wochen. Sie erhalten eine Fiktionsbescheinigung zur Überbrückung.',
        textAr: 'كل شيء على أكمل وجه. سنأخذ الآن بصمات أصابعك. تستغرق المعاملة من 4 إلى 6 أسابيع تقريباً، وستحصل الآن على شهادة إقامة مؤقتة (Fiktionsbescheinigung) لتغطية هذه الفترة.',
      },
      {
        speaker: 'Antragsteller',
        speakerRole: 'مقدم الطلب',
        avatar: '🙋‍♂️',
        textDe: 'Vielen Dank für Ihre freundliche Unterstützung und die reibungslose Abwicklung!',
        textAr: 'شكراً جزيلاً لك على دعمك اللطيف وإتمام الإجراءات بسلاسة!',
      },
    ],
    keyChunks: [
      { de: 'Nehmen Sie bitte Platz!', ar: 'تفضل بالجلوس من فضلك!', context: 'عبارة الضيافة والترحيب الرسمية في الدوائر الحكومية والعيادات', formality: 'FORMAL' },
      { de: 'Die Fiktionsbescheinigung', ar: 'وثيقة الإقامة المؤقتة التجسيرية', context: 'ورقة رسمية قانونية تصدر في ألمانيا أثناء انتظار الكارت البلاستيكي eAT', formality: 'FORMAL' },
      { de: 'Erforderliche Unterlagen', ar: 'المستندات والأوراق المطلوبة', context: 'تعبير بيروقراطي أساسي في كافة المعاملات الرسمية بألمانيا', formality: 'FORMAL' },
      { de: 'Alles in bester Ordnung!', ar: 'كل شيء على ما يرام وبأحسن حال!', context: 'تقال عندما تكون كافة الشروط والأوراق مستوفاة تماماً', formality: 'NEUTRAL' },
      { de: 'Reibungslose Abwicklung', ar: 'إنهاء الإجراءات بسلاسة ويسر', context: 'تعبير راقٍ لشكر الموظفين والشركات على الخدمة السريعة', formality: 'FORMAL' },
    ],
  },

  // ==========================================
  // 3. TELEFONAT MIT DEM VERMIETER (اتصال هاتفي مع المالك) - A2
  // ==========================================
  {
    id: 'vermieter-telefonat-a2',
    titleDe: 'Telefonat mit dem Vermieter: Die Heizung ist ausgefallen',
    titleAr: 'اتصال هاتفي مع المالك: عطل مفاجئ في التدفئة',
    situation: 'إبلاغ مالك الشقة هاتفياً بعطل في جهاز التدفئة والماء الساخن في فصل الشتاء والمطالبة بإرسال فني صيانة.',
    cefrLevel: 'A2',
    icon: '📞',
    turns: [
      {
        speaker: 'Vermieter',
        speakerRole: 'مالك الشقة',
        avatar: '👴',
        textDe: 'Schmidt, guten Tag! Wer spricht da bitte?',
        textAr: 'شميدت، طاب يومك! من المتحدث من فضلك؟',
      },
      {
        speaker: 'Mieter',
        speakerRole: 'المستأجر',
        avatar: '📱',
        textDe: 'Guten Tag Herr Schmidt, hier spricht Tarek Al-Ali aus der Wohnung im zweiten Stock rechts. Ich rufe wegen eines dringenden Problems an.',
        textAr: 'طاب يومك يا سيد شميدت، يتحدث معك طارق العلي من الشقة في الطابق الثاني يميناً. أنا أتصل بسبب مشكلة عاجلة.',
      },
      {
        speaker: 'Vermieter',
        speakerRole: 'مالك الشقة',
        avatar: '👴',
        textDe: 'Hallo Herr Al-Ali. Was ist denn passiert? Gibt es einen Schaden?',
        textAr: 'أهلاً يا سيد العلي. ماذا حدث؟ هل هناك أي ضرر؟',
      },
      {
        speaker: 'Mieter',
        speakerRole: 'المستأجر',
        avatar: '📱',
        textDe: 'Ja leider. Seit heute früh funktioniert die Heizung in der gesamten Wohnung nicht mehr und aus dem Wasserhahn kommt nur eiskaltes Wasser.',
        textAr: 'نعم للأسف. منذ صباح اليوم لا تعمل التدفئة في الشقة بأكملها، ولا يخرج من الصنبور سوى ماء شديد البرودة.',
      },
      {
        speaker: 'Vermieter',
        speakerRole: 'مالك الشقة',
        avatar: '👴',
        textDe: 'Oh, das tut mir leid, besonders bei den kalten Minustemperaturen draußen! Haben Sie schon die Heizkörper entlüftet?',
        textAr: 'أوه، يؤسفني ذلك، خاصة مع درجات الحرارة المتجمدة تحت الصفر بالخارج! هل قمت بتنفيس الهواء من أجهزة التدفئة (Heizkörper)؟',
      },
      {
        speaker: 'Mieter',
        speakerRole: 'المستأجر',
        avatar: '📱',
        textDe: 'Ja, das habe ich sofort versucht, aber die Rohre bleiben völlig kalt. Ich befürchte, dass die Zentralheizung im Keller ausgefallen ist.',
        textAr: 'نعم، جربت ذلك فوراً، لكن الأنابيب تظل باردة تماماً. أخشى أن التدفئة المركزية في القبو قد تعطلت.',
      },
      {
        speaker: 'Vermieter',
        speakerRole: 'مالك الشقة',
        avatar: '👴',
        textDe: 'Verstehe. Ich rufe unverzüglich den Notdienst der Heizungsfirma an. Wann sind Sie heute zu Hause erreichbar, damit der Handwerker in die Wohnung kann?',
        textAr: 'أفهم ذلك. سأتصل فوراً بخدمة طوارئ شركة التدفئة. متى تكون متاحاً في المنزل اليوم حتى يتمكن الفني من الدخول للشقة؟',
      },
      {
        speaker: 'Mieter',
        speakerRole: 'المستأجر',
        avatar: '📱',
        textDe: 'Ich arbeite heute im Homeoffice und bin den ganzen Nachmittag erreichbar. Bitte geben Sie dem Techniker meine Handynummer.',
        textAr: 'أنا أعمل اليوم من المنزل (Homeoffice) ومتاح طوال فترة بعد الظهر. من فضلك أعطِ الفني رقم هاتفي المحمول.',
      },
      {
        speaker: 'Vermieter',
        speakerRole: 'مالك الشقة',
        avatar: '👴',
        textDe: 'Mache ich sofort. Vielen Dank für die schnelle Benachrichtigung Herr Al-Ali. Bis später!',
        textAr: 'سأفعل ذلك فوراً. شكراً جزيلاً لك على إبلاغي السريع يا سيد العلي. إلى اللقاء لاحقاً!',
      },
    ],
    keyChunks: [
      { de: 'Hier spricht [Name]...', ar: 'المتحدث معك هو [الاسم]...', context: 'الصيغة الألمانية القياسية للتعريف بالنفس على الهاتف', formality: 'FORMAL' },
      { de: 'Ich rufe wegen... an', ar: 'أنا أتصل بخصوص / بسبب...', context: 'تحديد سبب المكالمة مباشرة بعد التحية', formality: 'NEUTRAL' },
      { de: 'Die Heizung ist ausgefallen', ar: 'التدفئة تعطلت وتوقفت عن العمل', context: 'من الفعل ausfallen (تعطل جهاز أو انقطعت خدمة)', formality: 'NEUTRAL' },
      { de: 'Unverzüglich', ar: 'دون أي تأخير / فوراً وعلى وجه السرعة', context: 'مصطلح رسمي وقانوني يعبر عن السرعة القصوى', formality: 'FORMAL' },
      { de: 'Den Handwerker beauftragen', ar: 'تكليف فني الصيانة / الحرفي', context: 'إرسال الفني المختص لإصلاح الأعطال في ألمانيا', formality: 'FORMAL' },
    ],
  },

  // ==========================================
  // 4. KONTOERÖFFNUNG BEI DER BANK (فتح حساب بنكي) - A2/B1
  // ==========================================
  {
    id: 'bank-konto-a2',
    titleDe: 'Kontoeröffnung bei der Bank: Ein Girokonto eröffnen',
    titleAr: 'في البنك: فتح حساب جاري (Girokonto) جديد',
    situation: 'زيارة فرع البنك في ألمانيا لفتح حساب جاري لتلقي الراتب وسداد الإيجار وطلب البطاقة البنكية والـ Online-Banking.',
    cefrLevel: 'A2',
    icon: '💳',
    turns: [
      {
        speaker: 'Bankberaterin',
        speakerRole: 'مستشارة البنك',
        avatar: '👩‍💼',
        textDe: 'Guten Tag! Willkommen bei der Sparkasse. Wie kann ich Ihnen heute behilflich sein?',
        textAr: 'طاب يومك! أهلاً بك في مصرف شباركاسه. كيف يمكنني مساعدتك اليوم؟',
      },
      {
        speaker: 'Kunde',
        speakerRole: 'العميل',
        avatar: '🧑',
        textDe: 'Guten Tag! Ich habe vor kurzem eine neue Arbeitsstelle begonnen und möchte gerne ein Girokonto für mein Gehalt eröffnen.',
        textAr: 'طاب يومك! لقد بدأت مؤخراً وظيفة جديدة وأود فتح حساب جاري (Girokonto) لتلقي راتبي الشهري.',
      },
      {
        speaker: 'Bankberaterin',
        speakerRole: 'مستشارة البنك',
        avatar: '👩‍💼',
        textDe: 'Herzlichen Glückwunsch zur neuen Stelle! Das machen wir sehr gerne. Welche Nationalität besitzen Sie und haben Sie Ihren Reisepass sowie die Meldebescheinigung dabei?',
        textAr: 'مبارك الوظيفة الجديدة! سنقوم بذلك بكل سرور. ما هي جنسيتك وهل معك جواز سفرك وشهادة تسجيل العنوان بالسكن (Meldebescheinigung)؟',
      },
      {
        speaker: 'Kunde',
        speakerRole: 'العميل',
        avatar: '🧑',
        textDe: 'Ja, hier sind mein gültiger Pass und die Anmeldebestätigung vom Bürgeramt. Außerdem habe ich meine deutsche Steuer-ID.',
        textAr: 'نعم، ها هو جواز سفري الساري وإشعار التسجيل من دائرة شؤون المواطنين. كما أن معي رقم هويتي الضريبية الألمانية (Steuer-ID).',
      },
      {
        speaker: 'Bankberaterin',
        speakerRole: 'مستشارة البنك',
        avatar: '👩‍💼',
        textDe: 'Perfekt, die Steuer-Identifikationsnummer ist gesetzlich vorgeschrieben. Unser Girokonto kostet vier Euro neunzig monatlich inklusive Girocard und kostenlosem Online-Banking.',
        textAr: 'ممتاز، فالرقم التعريفي الضريبي إلزامي قانوناً. حسابنا الجاري يكلف 4 يورو و90 سنتاً شهرياً شاملاً بطاقة الصراف والخدمات المصرفية عبر الإنترنت مجاناً.',
      },
      {
        speaker: 'Kunde',
        speakerRole: 'العميل',
        avatar: '🧑',
        textDe: 'Kann ich mit der Karte auch an allen Geldautomaten kostenlos Bargeld abheben?',
        textAr: 'هل يمكنني بالبطاقة سحب أموال نقدية مجاناً من جميع أجهزة الصراف الآلي؟',
      },
      {
        speaker: 'Bankberaterin',
        speakerRole: 'مستشارة البنك',
        avatar: '👩‍💼',
        textDe: 'An allen Automaten unseres Verbundes deutschlandweit völlig gebührenfrei. Ihre IBAN erhalten Sie sofort, die Karte und PIN-Nummer kommen per Post in wenigen Tagen.',
        textAr: 'في جميع أجهزة شبكتنا المصرفية في شتى أنحاء ألمانيا دون أية رسوم إطلاقاً. رقم الآيبان (IBAN) ستحصل عليه فوراً، أما البطاقة والرقم السري فسيصلانك عبر البريد خلال أيام قليلة.',
      },
      {
        speaker: 'Kunde',
        speakerRole: 'العميل',
        avatar: '🧑',
        textDe: 'Das klingt wunderbar! Wo muss ich unterschreiben?',
        textAr: 'هذا يبدو رائعاً! أين يجب علي التوقيع؟',
      },
    ],
    keyChunks: [
      { de: 'Ein Girokonto eröffnen', ar: 'فتح حساب بنكي جاري', context: 'المصطلح المصرفي الرسمي للحساب المستخدم في المعاملات اليومية', formality: 'FORMAL' },
      { de: 'Bargeld abheben', ar: 'سحب نقود كاش من الصراف', context: 'عبارة أساسية في التعاملات المالية بألمانيا', formality: 'NEUTRAL' },
      { de: 'Gebührenfrei', ar: 'مجاني تماماً وبدون رسوم', context: 'عكسها gebührenpflichtig (خاضع لرسوم مالية)', formality: 'NEUTRAL' },
      { de: 'Gesetzlich vorgeschrieben', ar: 'منصوص عليه وملزم بقوة القانون', context: 'تعبير رسمي للأشياء الإجبارية بموجب اللوائح', formality: 'FORMAL' },
      { de: 'Wie kann ich Ihnen behilflich sein?', ar: 'كيف يمكنني أن أقدم لك المساعدة؟', context: 'سؤال خدمة العملاء الراقي والمهذب في ألمانيا', formality: 'FORMAL' },
    ],
  },

  // ==========================================
  // 5. IM VORSTELLUNGSGESPRÄCH (في مقابلة العمل) - B1/B2
  // ==========================================
  {
    id: 'vorstellungsgespraech-b1',
    titleDe: 'Im Vorstellungsgespräch: Sich professionell präsentieren',
    titleAr: 'في مقابلة التوظيف: التعريف بالنفس والخبرات بأسلوب احترافي',
    situation: 'مقابلة عمل رسمية مع مدير التوظيف، مناقشة الخبرات السابقة، أسباب التقديم، وثقافة الفريق والراتب المتوقع.',
    cefrLevel: 'B1',
    icon: '💼',
    turns: [
      {
        speaker: 'Interviewer',
        speakerRole: 'مدير التوظيف',
        avatar: '👔',
        textDe: 'Guten Tag, Frau Al-Khatib. Schön, dass Sie den Weg zu uns gefunden haben. Haben Sie gut hergefunden?',
        textAr: 'طاب يومك يا آنسة الخطيب. يسعدنا وصولك إلينا. هل كان الطريق يسيراً ووجدت مقرنا بسهولة؟',
      },
      {
        speaker: 'Bewerberin',
        speakerRole: 'المتقدمة للوظيفة',
        avatar: '👩‍💼',
        textDe: 'Guten Tag, Herr Dr. Weber. Vielen Dank für die freundliche Begrüßung! Ja, die Anbindung mit der S-Bahn war hervorragend.',
        textAr: 'طاب يومك يا دكتور فيبر. شكراً جزيلاً لك على الترحيب اللطيف! نعم، كانت خطوط قطار الضواحي (S-Bahn) ممتازة ومريحة.',
      },
      {
        speaker: 'Interviewer',
        speakerRole: 'مدير التوظيف',
        avatar: '👔',
        textDe: 'Sehr schön. Ihr Profil als Data Analyst hat uns im ersten Screening sofort angesprochen. Was hat Sie konkret an unserer Vakanz motiviert?',
        textAr: 'جميل جداً. ملفك المهني كمحللة بيانات لفت انتباهنا وأعجبنا فوراً في الفرز الأولي. ما الذي حفزك وجذبك تحديداً للتقديم على هذا المنصب الشاغر لدينا؟',
      },
      {
        speaker: 'Bewerberin',
        speakerRole: 'المتقدمة للوظيفة',
        avatar: '👩‍💼',
        textDe: 'Ihr Unternehmen gilt als Vorreiter im Bereich nachhaltiger Mobilitätsdaten. Mich reizt besonders die Chance, komplexe Datenmengen in strategische Handlungsempfehlungen zu transformieren.',
        textAr: 'تُعد شركتكم رائدة في قطاع بيانات التنقل المستدام. وما يستهويني ويجذبني بشكل خاص هو فرصة تحويل مجموعات البيانات المعقدة إلى توصيات عمل استراتيجية ملموسة.',
      },
      {
        speaker: 'Interviewer',
        speakerRole: 'مدير التوظيف',
        avatar: '👔',
        textDe: 'Das passt exakt zu unserer Ausrichtung. Wie gehen Sie persönlich mit unvorhergesehenen Deadlines oder hohem Arbeitsdruck um?',
        textAr: 'هذا يطابق توجهنا تماماً. وكيف تتعاملين شخصياً مع المواعيد النهائية غير المتوقعة أو ضغط العمل المرتفع؟',
      },
      {
        speaker: 'Bewerberin',
        speakerRole: 'المتقدمة للوظيفة',
        avatar: '👩‍💼',
        textDe: 'In solchen Phasen priorisiere ich Aufgaben nach dem Eisenhower-Prinzip und kommuniziere proaktiv mit dem Team, um Engpässe frühzeitig transparent zu machen.',
        textAr: 'في تلك المراحل أرتب أولويات المهام وفق مصفوفة أيزنهاور، وأتواصل بصورة استباقية مع الفريق لجعل أي اختناقات في الإنجاز واضحة وشفافة مبكراً.',
      },
      {
        speaker: 'Interviewer',
        speakerRole: 'مدير التوظيف',
        avatar: '👔',
        textDe: 'Hervorragend. Haben Sie Ihrerseits noch Fragen an uns zur Position oder zum Team?',
        textAr: 'ممتاز جداً. هل لديك من جانبك أية أسئلة تودين توجيهها لنا بخصوص المنصب أو طبيعة الفريق؟',
      },
      {
        speaker: 'Bewerberin',
        speakerRole: 'المتقدمة للوظيفة',
        avatar: '👩‍💼',
        textDe: 'Ja, mich würde interessieren, welche Weiterbildungsmöglichkeiten und individuellen Förderprogramme Sie für Fachkräfte anbieten.',
        textAr: 'نعم، يهمني معرفة ما هي فرص التطوير المهني وبرامج الدعم الفردية التي تقدمونها للكوادر المتخصصة لديكم.',
      },
    ],
    keyChunks: [
      { de: 'Was hat Sie motiviert?', ar: 'ما الذي دفعك / حفزك للتقديم؟', context: 'سؤال كلاسيكي لا تخلو منه مقابلة عمل في ألمانيا', formality: 'FORMAL' },
      { de: 'Ein Profil spricht jemanden an', ar: 'الملف المهني يلفت الانتباه ويعجب الطرف الآخر', context: 'تعبير مهني راقٍ للإعجاب بالسيرة الذاتية', formality: 'FORMAL' },
      { de: 'Mich reizt die Chance...', ar: 'تستهويني وتجذبني فرصة أن...', context: 'أسلوب بلاغي ممتاز للتعبير عن الشغف بالعمل', formality: 'FORMAL' },
      { de: 'Proaktiv kommunizieren', ar: 'التواصل الاستباقي قبل تفاقم المشكلة', context: 'مصطلح من لغة الأعمال الألمانية الحديثة', formality: 'FORMAL' },
      { de: 'Haben Sie Fragen an uns?', ar: 'هل لديك أسئلة توجهها لنا؟', context: 'يجب دائماً تجهيز سؤالين ذكيين لهذه المرحلة في المقابلة', formality: 'FORMAL' },
    ],
  },
];
