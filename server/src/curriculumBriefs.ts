export interface BriefTemplate {
  id: string;
  cefrLevel: 'A1' | 'A2' | 'B1' | 'B2';
  titleDe: string;
  titleAr: string;
  category: 'WOHNEN' | 'BERUF' | 'BEHÖRDE' | 'REKLAMATION' | 'EXAM';
  situationDe: string;
  situationAr: string;
  pointsToCover: string[];
  sampleAnrede: string;
  sampleGruss: string;
  keyRedemittel: Array<{ de: string; ar: string }>;
  idealSampleText: string;
}

export const curatedBriefTemplates: BriefTemplate[] = [
  {
    id: 'b1',
    cefrLevel: 'A2',
    titleDe: 'Krankmeldung an den Arbeitgeber',
    titleAr: 'إبلاغ رب العمل بالغياب المرضي (Krankmeldung)',
    category: 'BERUF',
    situationDe: 'Sie sind plötzlich krank geworden und können heute nicht zur Arbeit kommen. Schreiben Sie eine E-Mail an Ihren Vorgesetzten Herrn Müller.',
    situationAr: 'أصبت بالمرض فجأة ولا تستطيع الحضور إلى العمل اليوم. اكتب إيميل لرئيسك في العمل السيد مولر.',
    pointsToCover: [
      'سبب الغياب وأعراض المرض الخفيفة',
      'زيارة الطبيب وإرسال التقرير الطبي (AU-Bescheinigung)',
      'المدة المتوقعة للغياب ورقم الهاتف للتواصل الطارئ'
    ],
    sampleAnrede: 'Sehr geehrter Herr Müller,',
    sampleGruss: 'Mit freundlichen Grüßen,\n[Ihr Name]',
    keyRedemittel: [
      { de: 'Ich muss Ihnen leider mitteilen, dass...', ar: 'يؤسفني إبلاغكم بأنني...' },
      { de: 'Ich bin leider erkrankt und kann heute nicht kommen.', ar: 'للأسف أصبت بالمرض ولا أستطيع الحضور اليوم.' },
      { de: 'Ich gehe heute zum Arzt.', ar: 'سأذهب اليوم إلى عيادة الطبيب.' },
      { de: 'Die ärztliche Krankschreibung sende ich Ihnen umgehend per E-Mail.', ar: 'سأرسل لكم التقرير الطبي فوراً عبر الإيميل.' },
      { de: 'Voraussichtlich werde ich ab Montag wieder einsatzbereit sein.', ar: 'من المتوقع أن أكون جاهزاً للعمل مجدداً بدءاً من يوم الاثنين.' }
    ],
    idealSampleText: `Sehr geehrter Herr Müller,

ich muss Ihnen leider mitteilen, dass ich heute Nacht plötzlich erkrankt bin und starke Halsschmerzen und Fieber habe. Daher kann ich heute leider nicht zum Dienst erscheinen.

Ich werde heute Vormittag meinen Hausarzt aufsuchen und Ihnen die ärztliche Arbeitsunfähigkeitsbescheinigung (AU) schnellstmöglich per E-Mail zukommen lassen. Nach jetzigem Stand hoffe ich, am kommenden Montag wieder vollständig gesund im Büro zu sein.

Für dringende Rückfragen bin ich telefonisch oder per E-Mail erreichbar.

Mit freundlichen Grüßen,
[Ihr Name]`
  },
  {
    id: 'b2',
    cefrLevel: 'B1',
    titleDe: 'Mängelanzeige: Heizungsausfall beim Vermieter',
    titleAr: 'إخطار المالك بخلل التدفئة والمياه الساخنة (Heizungsausfall)',
    category: 'WOHNEN',
    situationDe: 'In Ihrer Mietwohnung ist mitten im Winter die Heizung ausgefallen. Das Wasser ist kalt. Schreiben Sie eine formelle Mängelanzeige an Ihre Hausverwaltung.',
    situationAr: 'في شقتك المستأجرة، تعطلت التدفئة تماماً في منتصف فصل الشتاء، والماء بارد. اكتب إخطاراً رسمياً بإصلاح العيب لشركة إدارة العقار.',
    pointsToCover: [
      'وصف العيب: التدفئة لا تعمل والماء بارد',
      'تأثير ذلك على المعيشة وبرودة الغرف',
      'تحديد مهلة زمنية واضحة للإصلاح (Fristsetzung)'
    ],
    sampleAnrede: 'Sehr geehrte Damen und Herren der Hausverwaltung,',
    sampleGruss: 'Mit freundlichen Grüßen,\n[Ihr Name]',
    keyRedemittel: [
      { de: 'Hiermit zeige ich folgenden Mangel in meiner Wohnung an:', ar: 'بموجب هذا أبلغكم بالعيب التالي في شقتي:' },
      { de: 'Die Heizungsanlage funktioniert seit zwei Tagen nicht mehr.', ar: 'نظام التدفئة لا يعمل منذ يومين.' },
      { de: 'Aufgrund der winterlichen Temperaturen ist die Wohnung unbewohnbar.', ar: 'بسبب درجات الحرارة الشتوية أصبحت الشقة غير صالحة للسكن.' },
      { de: 'Ich fordere Sie höflich auf, den Mangel bis zum [Datum] zu beheben.', ar: 'أطالبكم بإصلاح هذا العيب بحلول تاريخ [التاريخ].' }
    ],
    idealSampleText: `Sehr geehrte Damen und Herren,

hiermit zeige ich Ihnen einen dringenden Mangel in meiner Mietwohnung im 2. Obergeschoss (Mietvertragsnummer: 1042) an.

Seit gestern Abend funktioniert in der gesamten Wohnung die Heizung nicht mehr, und auch aus den Leitungen kommt lediglich kaltes Wasser. Angesichts der aktuellen Minusgrade im Winter ist die Raumtemperatur auf unter 14 Grad gesunken, was eine unzumutbare Belastung darstellt.

Ich fordere Sie daher dringend auf, diesen Mangel unverzüglich, spätestens jedoch bis zum [Übermorgen, 12:00 Uhr], durch einen Fachhandwerker beheben zu lassen.

Bitte bestätigen Sie mir kurz den Eingang dieser Nachricht und den Termin des Handwerkers.

Mit freundlichen Grüßen,
[Ihr Name]`
  },
  {
    id: 'b3',
    cefrLevel: 'B1',
    titleDe: 'Goethe B1 Prüfung: Einladung zur Geburtstagsfeier',
    titleAr: 'امتحان جوته B1: دعوة إلى حفل عيد ميلاد والاعتذار لصديق',
    category: 'EXAM',
    situationDe: 'Ihr Freund Michael hat Sie zu seiner Geburtstagsfeier am Samstagabend eingeladen. Schreiben Sie ihm eine Nachricht.',
    situationAr: 'دعاك صديقك ميشائيل إلى حفل عيد ميلاده مساء السبت. اكتب له رسالة ودية غير رسمية.',
    pointsToCover: [
      'شكر الصديق بحرارة على الدعوة',
      'الاعتذار عن عدم الحضور أو التأخر مع ذكر السبب',
      'اقتراح موعد بديل للقاء وتقديم هدية'
    ],
    sampleAnrede: 'Lieber Michael,',
    sampleGruss: 'Herzliche Grüße,\n[Dein Name]',
    keyRedemittel: [
      { de: 'Vielen Dank für die herzliche Einladung zu deiner Feier!', ar: 'شكراً جزيلاً لك على دعوتك الكريمة لحفلك!' },
      { de: 'Es tut mir furchtbar leid, aber ich kann leider nicht kommen.', ar: 'أنا آسف للغاية، ولكنني للأسف لا أستطيع الحضور.' },
      { de: 'Der Grund dafür ist, dass...', ar: 'والسبب في ذلك هو أن...' },
      { de: 'Könnten wir uns nächste Woche treffen?', ar: 'هل يمكننا أن نلتقي الأسبوع القادم؟' }
    ],
    idealSampleText: `Lieber Michael,

vielen herzlichen Dank für deine liebe Einladung zu deiner Geburtstagsfeier am Samstag! Ich habe mich wirklich sehr darüber gefreut.

Leider muss ich dir aber schweren Herzens mitteilen, dass ich an diesem Abend nicht dabei sein kann. Meine Schwester kommt genau an diesem Wochenende überraschend aus Wien zu Besuch, und wir haben schon lange einen Familienabend geplant.

Es tut mir wirklich unendlich leid! Ich möchte aber unbedingt mit dir nachträglich anstoßen. Hättest du vielleicht nächsten Dienstag oder Mittwoch Zeit, damit wir gemeinsam einen Kaffee trinken gehen? Dein Geschenk habe ich natürlich schon!

Ich wünsche dir eine fantastische Feier und ganz viel Spaß mit all deinen Gästen.

Herzliche Grüße,
[Dein Name]`
  },
  {
    id: 'b4',
    cefrLevel: 'B2',
    titleDe: 'Kündigung des Internetvertrags',
    titleAr: 'فسخ عقد خدمة الإنترنت رسمياً (Kündigungsschreiben)',
    category: 'REKLAMATION',
    situationDe: 'Sie möchten Ihren Internet- und Festnetzvertrag fristgerecht zum nächstmöglichen Termin kündigen.',
    situationAr: 'تريد فسخ عقد الإنترنت والهاتف الأرضي مع الشركة في أقرب موعد قانوني متاح.',
    pointsToCover: [
      'ذكر رقم العقد (Vertragsnummer) ورقم العميل (Kundennummer)',
      'الفسخ بالصيغة القانونية الصريحة في أقرب موعد متاح (fristgerecht zum nächstmöglichen Termin)',
      'سحب إذن الخصم البنكي المباشر (SEPA-Lastschriftmandat)',
      'طلب تأكيد خطي بتاريخ انتهاء العقد'
    ],
    sampleAnrede: 'Sehr geehrte Damen und Herren,',
    sampleGruss: 'Mit freundlichen Grüßen,\n[Ihr Name]',
    keyRedemittel: [
      { de: 'Hiermit kündige ich meinen Vertrag fristgerecht zum nächstmöglichen Zeitpunkt.', ar: 'بموجب هذا أفسخ عقدي وفق المدة القانونية في أقرب موعد متاح.' },
      { de: 'Vertragsnummer: [Nummer] / Kundennummer: [Nummer]', ar: 'رقم العقد: [...] / رقم العميل: [...]' },
      { de: 'Mit Wirksamkeit der Kündigung erlischt auch die Einzugsermächtigung.', ar: 'مع سريان الفسخ يسقط أيضاً تفويض الخصم البنكي المباشر.' },
      { de: 'Bitte senden Sie mir eine schriftliche Kündigungsbestätigung.', ar: 'يرجى إرسال تأكيد خطي بإنهاء العقد.' }
    ],
    idealSampleText: `Sehr geehrte Damen und Herren,

hiermit kündige ich den mit Ihnen bestehenden Internet- und Festnetzanschlussvertrag fristgerecht zum nächstmöglichen Zeitpunkt.

Meine Vertragsdaten:
- Kundennummer: KD-892134
- Vertragsnummer: VT-551092

Gleichzeitig widerrufe ich hiermit das Ihnen erteilte SEPA-Lastschriftmandat mit dem Tag des offiziellen Vertragsendes. Bitte buchen Sie nach diesem Datum keine weiteren Beträge mehr von meinem Konto ab.

Ich bitte Sie höflich, mir den Erhalt dieses Schreibens sowie das genaue Datum des Vertragsendes innerhalb von 14 Tagen schriftlich zu bestätigen.

Vielen Dank für Ihre bisherigen Dienste.

Mit freundlichen Grüßen,
[Ihr Name]`
  }
];
