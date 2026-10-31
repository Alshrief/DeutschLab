import { useState } from 'react';
import { Volume2, Sparkles, BookOpen, Hash, Radio, HelpCircle, CheckCircle2, XCircle } from 'lucide-react';
import { speechService } from '../utils/speechService.js';

export function A0FoundationsView() {
  const [subTab, setSubTab] = useState<'alphabet' | 'phonetics' | 'numbers' | 'quiz'>('alphabet');
  const [quizIndex, setQuizIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [quizScore, setQuizScore] = useState(0);

  const earTrainingQuestions = [
    {
      prompt: 'استمع للصوت وحدد الكلمة المنطوقة بدقة:',
      audioTarget: 'sie',
      options: ['sie', 'mein', 'nein', 'wie'],
      correctAnswer: 'sie',
      explanation: 'الكلمة المنطوقة هي sie (تُنطق "زي" بياء ممدودة لوجود التركيب ie)، وليست mein أو nein التي تحتوي على ei.',
    },
    {
      prompt: 'استمع وميّز بين صوت الـ ch الخفيفة والقوية:',
      audioTarget: 'ich',
      options: ['ich', 'Buch', 'Nacht', 'auch'],
      correctAnswer: 'ich',
      explanation: 'الصوت المنطوق هو ich (شين خفيفة مرققة لأنها مسبوقة بـ i)، بينما Buch و Nacht تنطقان خاء صريحة.',
    },
    {
      prompt: 'استمع للرقم وميّز بين العشرات والآحاد المركبة:',
      audioTarget: 'dreizehn',
      options: ['13 (dreizehn)', '30 (dreißig)', '3 (drei)', '23 (einundzwanzig)'],
      correctAnswer: '13 (dreizehn)',
      explanation: 'الرقم المنطوق هو 13 (dreizehn وينتهي بـ zehn)، بينما 30 تنتهي بـ ßig (dreißig).',
    },
    {
      prompt: 'استمع وميّز نطق حرف الـ Umlaut (ö):',
      audioTarget: 'schön',
      options: ['schön (جميل)', 'schon (بالفعل)', 'Sonne (شمس)', 'Sohn (ابن)'],
      correctAnswer: 'schön (جميل)',
      explanation: 'الحرف ö في schön ينطق بضم الشفتين وإخراج صوت الياء/الكسرة المدمجة، وليس o العادية مثل schon.',
    },
    {
      prompt: 'استمع وميّز نطق حرف الـ Umlaut (ü):',
      audioTarget: 'müssen',
      options: ['müssen (يجب)', 'Mutter (أم)', 'Muskel (عضلة)', 'Mund (فم)'],
      correctAnswer: 'müssen (يجب)',
      explanation: 'الكلمة هي müssen بصوت الـ ü المضموم الرقيق، وليس u المفخمة في Mutter.',
    },
    {
      prompt: 'استمع وميّز نطق بادئة (sp) في بداية الكلمة:',
      audioTarget: 'Sport',
      options: ['Sport', 'Post', 'Start', 'Obst'],
      correctAnswer: 'Sport',
      explanation: 'الـ sp في بداية الكلمة الألمانية تلفظ دائماً "شب" صريحة (شبورت).',
    },
  ];

  const playSound = (text: string) => {
    speechService.speakGerman(text, 0.85);
  };

  const playArabicSound = (text: string) => {
    speechService.speakArabic(text, 0.9);
  };

  const alphabet = [
    { letter: 'A a', name: 'ah', example: 'der Apfel', ar: 'تفاحة', ipa: '/aː/' },
    { letter: 'B b', name: 'beh', example: 'das Buch', ar: 'كتاب', ipa: '/beː/' },
    { letter: 'C c', name: 'tseh', example: 'das Café', ar: 'مقهى', ipa: '/tseː/' },
    { letter: 'D d', name: 'deh', example: 'das Deutschland', ar: 'ألمانيا', ipa: '/deː/' },
    { letter: 'E e', name: 'eh', example: 'die Erde', ar: 'الأرض', ipa: '/eː/' },
    { letter: 'F f', name: 'eff', example: 'die Familie', ar: 'عائلة', ipa: '/ɛf/' },
    { letter: 'G g', name: 'geh', example: 'das Geld', ar: 'مال / نقود', ipa: '/geː/' },
    { letter: 'H h', name: 'hah', example: 'das Haus', ar: 'منزل', ipa: '/haː/' },
    { letter: 'I i', name: 'ee', example: 'die Insel', ar: 'جزيرة', ipa: '/iː/' },
    { letter: 'J j', name: 'yott', example: 'das Jahr', ar: 'سنة', ipa: '/jɔt/' },
    { letter: 'K k', name: 'kah', example: 'die Katze', ar: 'قطة', ipa: '/kaː/' },
    { letter: 'L l', name: 'ell', example: 'das Leben', ar: 'الحياة', ipa: '/ɛl/' },
    { letter: 'M m', name: 'emm', example: 'der Mann', ar: 'رجل', ipa: '/ɛm/' },
    { letter: 'N n', name: 'enn', example: 'die Nacht', ar: 'ليلة', ipa: '/ɛn/' },
    { letter: 'O o', name: 'oh', example: 'das Obst', ar: 'فواكه', ipa: '/oː/' },
    { letter: 'P p', name: 'peh', example: 'die Post', ar: 'بريد', ipa: '/peː/' },
    { letter: 'Q q', name: 'koo', example: 'die Quelle', ar: 'ينبوع / مصدر', ipa: '/kuː/' },
    { letter: 'R r', name: 'err', example: 'das Radio', ar: 'راديو', ipa: '/ɛʁ/' },
    { letter: 'S s', name: 'ess', example: 'die Sonne', ar: 'شمس', ipa: '/ɛs/' },
    { letter: 'T t', name: 'teh', example: 'der Tag', ar: 'يوم', ipa: '/teː/' },
    { letter: 'U u', name: 'oo', example: 'die Uhr', ar: 'ساعة', ipa: '/uː/' },
    { letter: 'V v', name: 'fow', example: 'der Vater', ar: 'أب', ipa: '/faʊ̯/' },
    { letter: 'W w', name: 'veh', example: 'das Wasser', ar: 'ماء', ipa: '/veː/' },
    { letter: 'X x', name: 'iks', example: 'das Xylophon', ar: 'إكسيلوفون', ipa: '/ɪks/' },
    { letter: 'Y y', name: 'üpsilon', example: 'das Yoga', ar: 'يوغا', ipa: '/ˈʏpsilɔn/' },
    { letter: 'Z z', name: 'tsett', example: 'die Zeit', ar: 'وقت', ipa: '/tsɛt/' },
    { letter: 'Ä ä', name: 'a-umlaut', example: 'der Ärger', ar: 'غضب / إزعاج', ipa: '/ɛː/' },
    { letter: 'Ö ö', name: 'o-umlaut', example: 'das Öl', ar: 'زيت', ipa: '/øː/' },
    { letter: 'Ü ü', name: 'u-umlaut', example: 'die Übung', ar: 'تمرين', ipa: '/yː/' },
    { letter: 'ß', name: 'eszett', example: 'die Straße', ar: 'شارع', ipa: '/ɛsˈtsɛt/' },
  ];

  const phoneticRules = [
    {
      title: 'حرفا الـ (ei) مقابل (ie)',
      rule: 'ei تنطق مثل (Eye) بالإنجليزية | ie تنطق ياء ممدودة طويلة (ee)',
      examples: [
        { de: 'mein (ماين)', ar: 'ملكي / لي' },
        { de: 'nein (ناين)', ar: 'لا' },
        { de: 'sie (زي)', ar: 'هي / هم' },
        { de: 'wie (في)', ar: 'كيف' },
      ],
    },
    {
      title: 'صوتا الـ (ch): الخفيفة (ich) والقوية (ach)',
      rule: 'تنطق كالشين الخفيفة بعد (e, i, ä, ö, ü) وتنطق كالخاء بعد (a, o, u, au)',
      examples: [
        { de: 'ich (إيش)', ar: 'أنا (خفيفة)' },
        { de: 'nicht (نيشت)', ar: 'ليس / نفي (خفيفة)' },
        { de: 'Buch (بوخ)', ar: 'كتاب (قوية)' },
        { de: 'Nacht (ناخت)', ar: 'ليلة (قوية)' },
      ],
    },
    {
      title: 'مجموعات (sp) و (st) في بداية المقطع',
      rule: 'تنطق دائماً (شب / شت) مثل الشين الصريحة',
      examples: [
        { de: 'sprechen (شبريشِن)', ar: 'يتحدث' },
        { de: 'Sport (شبورت)', ar: 'رياضة' },
        { de: 'Stadt (شتات)', ar: 'مدينة' },
        { de: 'stehen (شتيهن)', ar: 'يقف' },
      ],
    },
    {
      title: 'الـ Umlauts الثلاثة (ä, ö, ü)',
      rule: 'ä = فتحة مائلة للألف المرققة | ö = ضم الشفتين ونطق (e) | ü = ضم الشفتين ونطق (i)',
      examples: [
        { de: 'schön', ar: 'جميل' },
        { de: 'müssen', ar: 'يجب' },
        { de: 'Mädchen', ar: 'فتاة' },
      ],
    },
  ];

  const numbers = [
    { num: 0, de: 'null', ar: 'صفر' },
    { num: 1, de: 'eins', ar: 'واحد' },
    { num: 2, de: 'zwei', ar: 'اثنان' },
    { num: 3, de: 'drei', ar: 'ثلاثة' },
    { num: 4, de: 'vier', ar: 'أربعة' },
    { num: 5, de: 'fünf', ar: 'خمسة' },
    { num: 6, de: 'sechs', ar: 'ستة' },
    { num: 7, de: 'sieben', ar: 'سبعة' },
    { num: 8, de: 'acht', ar: 'ثمانية' },
    { num: 9, de: 'neun', ar: 'تسعة' },
    { num: 10, de: 'zehn', ar: 'عشرة' },
    { num: 11, de: 'elf', ar: 'أحد عشر' },
    { num: 12, de: 'zwölf', ar: 'اثنا عشر' },
    { num: 13, de: 'dreizehn', ar: 'ثلاثة عشر' },
    { num: 14, de: 'vierzehn', ar: 'أربعة عشر' },
    { num: 15, de: 'fünfzehn', ar: 'خمسة عشر' },
    { num: 16, de: 'sechzehn', ar: 'ستة عشر' },
    { num: 17, de: 'siebzehn', ar: 'سبعة عشر' },
    { num: 18, de: 'achtzehn', ar: 'ثمانية عشر' },
    { num: 19, de: 'neunzehn', ar: 'تسعة عشر' },
    { num: 20, de: 'zwanzig', ar: 'عشرون' },
    { num: 21, de: 'einundzwanzig', ar: 'واحد وعشرون (واحد و عشرون)' },
    { num: 30, de: 'dreißig', ar: 'ثلاثون' },
    { num: 40, de: 'vierzig', ar: 'أربعون' },
    { num: 50, de: 'fünfzig', ar: 'خمسون' },
    { num: 100, de: 'hundert', ar: 'مئة' },
  ];

  return (
    <div className="py-4 space-y-6">
      {/* Sub tabs */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-4">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-amber-400" /> تأسيس المستوى A0 (الحروف، الصوتيات، والأرقام)
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            وحدة تفاعلية تعمل بالكامل Offline لتثبيت مخارج الحروف الألمانية والأرقام ونظام نطق الـ Umlauts.
          </p>
        </div>

        <div className="flex rounded-xl bg-slate-900 border border-slate-800 p-1 text-xs">
          <button
            onClick={() => setSubTab('alphabet')}
            className={`px-3 py-1.5 rounded-lg font-semibold transition flex items-center gap-1.5 ${
              subTab === 'alphabet' ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-400 hover:text-white'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" /> الأبجدية ({alphabet.length})
          </button>
          <button
            onClick={() => setSubTab('phonetics')}
            className={`px-3 py-1.5 rounded-lg font-semibold transition flex items-center gap-1.5 ${
              subTab === 'phonetics' ? 'bg-purple-600 text-white shadow-sm' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Radio className="w-3.5 h-3.5" /> قواعد النطق والصوتيات
          </button>
          <button
            onClick={() => setSubTab('numbers')}
            className={`px-3 py-1.5 rounded-lg font-semibold transition flex items-center gap-1.5 ${
              subTab === 'numbers' ? 'bg-emerald-600 text-white shadow-sm' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Hash className="w-3.5 h-3.5" /> الأرقام (0-100)
          </button>
          <button
            onClick={() => setSubTab('quiz')}
            className={`px-3 py-1.5 rounded-lg font-semibold transition flex items-center gap-1.5 ${
              subTab === 'quiz' ? 'bg-amber-600 text-white shadow-sm' : 'text-slate-400 hover:text-white'
            }`}
          >
            <HelpCircle className="w-3.5 h-3.5" /> اختبار السمع (Ear-Training)
          </button>
        </div>
      </div>

      {/* 1. Alphabet Grid */}
      {subTab === 'alphabet' && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 lg:grid-cols-6 gap-3 animate-fadeIn">
          {alphabet.map((item) => (
            <div
              key={item.letter}
              onClick={() => playSound(item.letter.split(' ')[0])}
              className="p-4 rounded-2xl bg-slate-900 border border-slate-800 hover:border-blue-500 cursor-pointer transition text-center group flex flex-col justify-between"
            >
              <div className="flex justify-between items-center text-[10px] text-slate-500 font-mono">
                <span>{item.ipa}</span>
                <Volume2 className="w-3.5 h-3.5 text-slate-600 group-hover:text-blue-400 transition" />
              </div>

              <div className="my-2">
                <div className="text-2xl font-extrabold text-white group-hover:scale-105 transition">
                  {item.letter}
                </div>
                <div className="text-[11px] text-blue-400 font-semibold">{item.name}</div>
              </div>

              <div className="pt-2 border-t border-slate-800/80 text-[11px]">
                <div
                  onClick={(e) => {
                    e.stopPropagation();
                    playSound(item.example);
                  }}
                  className="text-slate-200 font-medium hover:text-blue-400"
                >
                  {item.example}
                </div>
                <div
                  onClick={(e) => {
                    e.stopPropagation();
                    playArabicSound(item.ar);
                  }}
                  className="text-slate-500 font-arabic text-[10px] hover:text-emerald-400 mt-0.5"
                  title="استمع بالعربية"
                >
                  {item.ar}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* 2. Phonetics Guide */}
      {subTab === 'phonetics' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 animate-fadeIn">
          {phoneticRules.map((p, idx) => (
            <div key={idx} className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-white">{p.title}</h3>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-purple-500/10 text-purple-400 border border-purple-500/20">
                  Phonetik
                </span>
              </div>
              <p className="text-xs text-slate-300 font-arabic leading-relaxed bg-slate-950/60 p-3 rounded-xl border border-slate-800/80">
                {p.rule}
              </p>
              <div className="grid grid-cols-2 gap-2">
                {p.examples.map((ex, i) => (
                  <button
                    key={i}
                    onClick={() => playSound(ex.de.split(' ')[0])}
                    className="p-2.5 rounded-xl bg-slate-950 border border-slate-800/80 hover:border-purple-500 transition text-right flex items-center justify-between"
                  >
                    <div>
                      <div className="text-xs font-bold text-slate-100">{ex.de}</div>
                      <div className="text-[10px] text-slate-400 font-arabic">{ex.ar}</div>
                    </div>
                    <Volume2 className="w-3.5 h-3.5 text-slate-500" />
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* 3. Numbers Grid */}
      {subTab === 'numbers' && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 animate-fadeIn">
          {numbers.map((n) => (
            <div
              key={n.num}
              onClick={() => playSound(n.de)}
              className="p-3.5 rounded-2xl bg-slate-900 border border-slate-800 hover:border-emerald-500 cursor-pointer transition text-center group"
            >
              <div className="flex items-center justify-between mb-1">
                <span className="text-base font-extrabold text-emerald-400 font-mono">{n.num}</span>
                <Volume2 className="w-3.5 h-3.5 text-slate-600 group-hover:text-emerald-400 transition" />
              </div>
              <div className="text-sm font-bold text-white">{n.de}</div>
              <div className="text-xs text-slate-400 font-arabic mt-0.5">{n.ar}</div>
            </div>
          ))}
        </div>
      )}

      {/* 4. Ear-Training Audio Quiz */}
      {subTab === 'quiz' && (
        <div className="max-w-xl mx-auto p-6 rounded-3xl bg-slate-900 border border-slate-800 shadow-2xl space-y-6 animate-fadeIn">
          <div className="flex items-center justify-between border-b border-slate-800 pb-4">
            <div>
              <div className="text-[10px] uppercase font-bold text-amber-400">تدريب الأذن الألمانية</div>
              <h3 className="text-base font-bold text-white">
                السؤال {quizIndex + 1} من {earTrainingQuestions.length}
              </h3>
            </div>
            <div className="px-3 py-1 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-mono font-bold">
              النتيجة: {quizScore}/{earTrainingQuestions.length}
            </div>
          </div>

          <div className="text-center space-y-4">
            <p className="text-xs text-slate-300 font-arabic">
              {earTrainingQuestions[quizIndex].prompt}
            </p>

            {/* Audio Button */}
            <button
              onClick={() => playSound(earTrainingQuestions[quizIndex].audioTarget)}
              className="px-6 py-4 rounded-2xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-extrabold text-sm transition flex items-center justify-center gap-2 mx-auto shadow-xl shadow-amber-500/20"
            >
              <Volume2 className="w-5 h-5 animate-pulse" /> استمع للصوت الألماني
            </button>
          </div>

          {/* Options */}
          <div className="grid grid-cols-2 gap-3">
            {earTrainingQuestions[quizIndex].options.map((opt) => {
              const isSelected = selectedAnswer === opt;
              const isCorrect = opt === earTrainingQuestions[quizIndex].correctAnswer;
              return (
                <button
                  key={opt}
                  disabled={selectedAnswer !== null}
                  onClick={() => {
                    setSelectedAnswer(opt);
                    if (isCorrect) setQuizScore((s) => s + 1);
                  }}
                  className={`p-3.5 rounded-2xl border text-xs font-bold transition flex items-center justify-between ${
                    selectedAnswer === null
                      ? 'bg-slate-950 border-slate-800 hover:border-amber-500 text-slate-200'
                      : isCorrect
                      ? 'bg-emerald-500/20 border-emerald-500 text-emerald-300'
                      : isSelected
                      ? 'bg-rose-500/20 border-rose-500 text-rose-300'
                      : 'bg-slate-950/40 border-slate-800/40 text-slate-600'
                  }`}
                >
                  <span>{opt}</span>
                  {selectedAnswer !== null && isCorrect && (
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  )}
                  {selectedAnswer !== null && isSelected && !isCorrect && (
                    <XCircle className="w-4 h-4 text-rose-400" />
                  )}
                </button>
              );
            })}
          </div>

          {/* Explanation & Next */}
          {selectedAnswer !== null && (
            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-3 animate-fadeIn">
              <div className="text-xs text-slate-300 font-arabic leading-relaxed">
                💡 <span className="font-bold text-white">التحليل الصوتي:</span>{' '}
                {earTrainingQuestions[quizIndex].explanation}
              </div>
              <button
                onClick={() => {
                  setSelectedAnswer(null);
                  setQuizIndex((i) => (i + 1) % earTrainingQuestions.length);
                }}
                className="w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-100 font-semibold text-xs transition"
              >
                {quizIndex + 1 < earTrainingQuestions.length ? 'السؤال التالي ⬅' : 'إعادة الاختبار من البداية 🔄'}
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
