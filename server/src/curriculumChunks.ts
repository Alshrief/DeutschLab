export interface GermanChunk {
  id: string;
  chunkDe: string;
  chunkAr: string;
  category: 'ALLTAG' | 'HOEFLICHKEIT' | 'MEINUNG' | 'BERUF_BEHOERDE' | 'DISKUSSION';
  formality: 'FORMAL' | 'INFORMAL' | 'UNIVERSAL';
  cefrLevel: 'A1' | 'A2' | 'B1' | 'B2';
  exampleDe: string;
  exampleAr: string;
  usageTip: string;
}

export const curatedGermanChunks: GermanChunk[] = [
  // ==========================================
  // LEVEL A1 - Höflichkeit & Alltag
  // ==========================================
  {
    id: 'c1',
    chunkDe: 'Ich hätte gerne...',
    chunkAr: 'أود من فضلك / أرغب في...',
    category: 'HOEFLICHKEIT',
    formality: 'UNIVERSAL',
    cefrLevel: 'A1',
    exampleDe: 'Ich hätte gerne zwei Brötchen und einen Kaffee mit Milch.',
    exampleAr: 'أود من فضلك رغيفين صمّون وفنجان قهوة بالحليب.',
    usageTip: 'أكثر أسلوب مهذب في اللغة الألمانية للطلب في المطاعم والمتاجر، أفضل بكثير من "Ich will".',
  },
  {
    id: 'c2',
    chunkDe: 'Könnten Sie bitte...?',
    chunkAr: 'هل يمكنك من فضلك أن...؟',
    category: 'HOEFLICHKEIT',
    formality: 'FORMAL',
    cefrLevel: 'A1',
    exampleDe: 'Könnten Sie das bitte noch einmal langsam wiederholen?',
    exampleAr: 'هل يمكنك من فضلك إعادة ذلك مرة أخرى ببطء؟',
    usageTip: 'صيغة Konjunktiv II لطلب المساعدة من الغرباء أو المعلمين أو الموظفين بمنتهى اللباقة.',
  },
  {
    id: 'c3',
    chunkDe: 'Es tut mir leid, aber...',
    chunkAr: 'أنا آسف جداً، ولكن...',
    category: 'HOEFLICHKEIT',
    formality: 'UNIVERSAL',
    cefrLevel: 'A1',
    exampleDe: 'Es tut mir leid, aber ich habe Ihren Namen leider nicht verstanden.',
    exampleAr: 'أنا آسف، ولكنني للأسف لم أفهم اسمك.',
    usageTip: 'الافتتاحية الكلاسيكية للاعتذار المتبوع بتبرير مهذب أو توضيح سوء فهم.',
  },
  {
    id: 'c4',
    chunkDe: 'Wie viel kostet...?',
    chunkAr: 'كم يبلغ سعر...؟',
    category: 'ALLTAG',
    formality: 'UNIVERSAL',
    cefrLevel: 'A1',
    exampleDe: 'Wie viel kostet diese Jacke im Angebot?',
    exampleAr: 'كم يبلغ سعر هذه السترة في التخفيضات؟',
    usageTip: 'سؤال السعر الأساسي في الأسواق والمحلات التجارية.',
  },
  {
    id: 'c5',
    chunkDe: 'Ich bin der Meinung, dass...',
    chunkAr: 'أنا أرى / في اعتقادي أن...',
    category: 'MEINUNG',
    formality: 'UNIVERSAL',
    cefrLevel: 'A2',
    exampleDe: 'Ich bin der Meinung, dass man jeden Tag Deutsch sprechen sollte.',
    exampleAr: 'أنا في اعتقادي أنه ينبغي على المرء التحدث بالألمانية يومياً.',
    usageTip: 'تعبير أساسي لإبداء الرأي الشخصي في امتحانات المحادثة الشفوية لجوته (تذكر أن dass تدفع الفعل للنهاية).',
  },

  // ==========================================
  // LEVEL A2/B1 - Meinung & Diskussion
  // ==========================================
  {
    id: 'c6',
    chunkDe: 'Meiner Meinung nach...',
    chunkAr: 'وفقاً لرأيي ووجهة نظري...',
    category: 'MEINUNG',
    formality: 'UNIVERSAL',
    cefrLevel: 'A2',
    exampleDe: 'Meiner Meinung nach ist regelmäßige Bewegung sehr gesund.',
    exampleAr: 'في رأيي الشخصي، الحركة المنتظمة صحية للغاية.',
    usageTip: 'انتبه: بعدها يأتي الفعل المصرف مباشرة في الموقع الثاني (Inversion: Meiner Meinung nach ist...).',
  },
  {
    id: 'c7',
    chunkDe: 'Das kommt darauf an...',
    chunkAr: 'هذا يعتمد على الظروف / يتوقف على...',
    category: 'DISKUSSION',
    formality: 'UNIVERSAL',
    cefrLevel: 'B1',
    exampleDe: 'Das kommt ganz darauf an, wie das Wetter am Wochenende wird.',
    exampleAr: 'الأمر يتوقف تماماً على الكيفية التي سيكون عليها الطقس في عطلة الأسبوع.',
    usageTip: 'إجابة دبلوماسية ممتازة عندما لا تكون الإجابة بنعم أو لا قاطعة.',
  },
  {
    id: 'c8',
    chunkDe: 'Darf ich Sie kurz unterbrechen?',
    chunkAr: 'هل تأذن لي بمقاطعتك للحظة؟',
    category: 'DISKUSSION',
    formality: 'FORMAL',
    cefrLevel: 'B1',
    exampleDe: 'Entschuldigung, darf ich Sie kurz unterbrechen? Ich habe dazu eine dringende Frage.',
    exampleAr: 'عذراً، هل تأذن لي بمقاطعتك للحظة؟ لدي سؤال عاجل بخصوص ذلك.',
    usageTip: 'العبارة الرسمية المعيارية المعتمدة في امتحانات B1/B2 لمقاطعة الزميل بلباقة أثناء النقاش الجماعي.',
  },
  {
    id: 'c9',
    chunkDe: 'Auf der einen Seite... auf der anderen Seite...',
    chunkAr: 'من ناحية... ومن ناحية أخرى...',
    category: 'DISKUSSION',
    formality: 'FORMAL',
    cefrLevel: 'B1',
    exampleDe: 'Auf der einen Seite spart Online-Shopping Zeit, auf der anderen Seite schadet es kleinen Läden.',
    exampleAr: 'من ناحية، يوفر التسوق الإلكتروني الوقت، ومن ناحية أخرى يضر بالمحلات الصغيرة.',
    usageTip: 'أقوى رابط ثنائي لموازنة الإيجابيات والسلبيات (Vor- und Nachteile) في التعبير الكتابي والشفهي.',
  },
  {
    id: 'c10',
    chunkDe: 'Ich stimme Ihnen vollkommen zu.',
    chunkAr: 'أنا أتفق معك في الرأي تماماً وبلا تردد.',
    category: 'DISKUSSION',
    formality: 'FORMAL',
    cefrLevel: 'B1',
    exampleDe: 'Da haben Sie absolut recht, ich stimme Ihnen in diesem Punkt vollkommen zu.',
    exampleAr: 'أنت محق تماماً في ذلك، وأنا أتفق معك في هذه النقطة كلياً.',
    usageTip: 'تأكيد الموافقة التامة في النقاشات والمقابلات الرسمية.',
  },

  // ==========================================
  // LEVEL B2 - Beruf & Behörde & Höhere Sprachkompetenz
  // ==========================================
  {
    id: 'c11',
    chunkDe: 'Ich vertrete den Standpunkt, dass...',
    chunkAr: 'أنا أتبنى الموقف القائل بأن...',
    category: 'MEINUNG',
    formality: 'FORMAL',
    cefrLevel: 'B2',
    exampleDe: 'Ich vertrete fest den Standpunkt, dass Bildung für jeden kostenfrei zugänglich sein muss.',
    exampleAr: 'أنا أتبنى بحزم الموقف القائل بأن التعليم يجب أن يكون متاحاً للجميع مجاناً.',
    usageTip: 'أسلوب راقٍ جداً لإظهار نضج لغوي عالي في امتحانات B2 بدلاً من تكرار "ich denke".',
  },
  {
    id: 'c12',
    chunkDe: 'Aus diesem Grund lässt sich schlussfolgern, dass...',
    chunkAr: 'ولهذا السبب يمكن للمرء أن يستنتج بأن...',
    category: 'DISKUSSION',
    formality: 'FORMAL',
    cefrLevel: 'B2',
    exampleDe: 'Aus diesem Grund lässt sich schlussfolgern, dass nachhaltiges Handeln alternativlos ist.',
    exampleAr: 'ولهذا السبب يمكن الاستنتاج بأن السلوك المستدام خيار لا بديل عنه.',
    usageTip: 'تركيب استنتاجي رفيع لصياغة خاتمة المقالات والتقارير الأكاديمية.',
  },
];
