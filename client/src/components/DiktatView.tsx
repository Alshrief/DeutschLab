import { useState, useEffect } from 'react';
import {
  Headphones,
  Volume2,
  CheckCircle2,
  XCircle,
  ArrowRight,
} from 'lucide-react';
import { speechService } from '../utils/speechService.js';

interface DiktatItem {
  id: string;
  sentenceDe: string;
  sentenceAr: string;
  focusRule: string;
  cefrLevel: string;
}

export function DiktatView() {
  const [items] = useState<DiktatItem[]>([
    {
      id: 'd1',
      sentenceDe: 'Der Arzt untersucht den Patienten sehr gründlich.',
      sentenceAr: 'الطبيب يفحص المريض بدقة شديدة.',
      focusRule: 'الأسماء الألمانية تكتب دائماً بحرف كبير (Großschreibung: Der Arzt, den Patienten).',
      cefrLevel: 'A1',
    },
    {
      id: 'd2',
      sentenceDe: 'Wir müssen heute pünktlich am Hauptbahnhof ankommen.',
      sentenceAr: 'يجب أن نصل اليوم في الموعد المحدد تماماً إلى محطة القطار المركزية.',
      focusRule: 'حرف الـ Umlaut في müssen، والاسم المركب der Hauptbahnhof.',
      cefrLevel: 'A1',
    },
    {
      id: 'd3',
      sentenceDe: 'Ich trinke jeden Morgen eine Tasse heißen Kaffee mit Milch.',
      sentenceAr: 'أشرب كل صباح فنجاناً من القهوة الساخنة مع الحليب.',
      focusRule: 'صوت الـ ch الخفيفة في Ich والتنوين في heiß-en Kaffee.',
      cefrLevel: 'A1',
    },
    {
      id: 'd4',
      sentenceDe: 'Könnten Sie mir bitte die Speisekarte bringen?',
      sentenceAr: 'هل يمكنك من فضلك إحضار قائمة الطعام لي؟',
      focusRule: 'صيغة الرجاء والطلب المهذب Könnten Sie مع الـ Umlaut ö.',
      cefrLevel: 'A2',
    },
    {
      id: 'd5',
      sentenceDe: 'Weil er krank ist, kann er heute nicht zur Arbeit gehen.',
      sentenceAr: 'لأنه مريض، لا يستطيع الذهاب إلى العمل اليوم.',
      focusRule: 'موقع الفعل في نهاية الجملة الفرعية بعد weil (ist am Ende).',
      cefrLevel: 'A2',
    },
    {
      id: 'd6',
      sentenceDe: 'Das duale Ausbildungssystem ist weltweit hoch anerkannt.',
      sentenceAr: 'نظام التأهيل المهني المزدوج معترف به عالمياً على نطاق واسع.',
      focusRule: 'المصطلحات المهنية المركبة ونهاية الصفات (duale Ausbildung).',
      cefrLevel: 'B1',
    },
    {
      id: 'd7',
      sentenceDe: 'Die künstliche Intelligenz verändert die moderne Arbeitswelt rasant.',
      sentenceAr: 'الذكاء الاصطناعي يغير بيئة العمل الحديثة بسرعة فائقة.',
      focusRule: 'حرف الـ Umlaut في künstliche والتاء المربوطة بالألمانية -tät.',
      cefrLevel: 'B2',
    },
  ]);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [userInput, setUserInput] = useState('');
  const [speed, setSpeed] = useState<number>(0.85);
  const [evaluated, setEvaluated] = useState(false);
  const [accuracyScore, setAccuracyScore] = useState(0);
  const [diffTokens, setDiffTokens] = useState<Array<{ token: string; status: 'CORRECT' | 'ERROR' | 'CAPITALIZATION' | 'UMLAUT' }>>([]);
  const [streak, setStreak] = useState(0);

  const currentItem = items[currentIndex];

  const playAudio = (customSpeed?: number) => {
    speechService.speakGerman(currentItem.sentenceDe, customSpeed ?? speed);
  };

  useEffect(() => {
    // Play sentence on first switch
    playAudio();
  }, [currentIndex]);

  const cleanPunctuation = (s: string) => s.replace(/[.,/#!$%^&*;:{}=\-_`~()?"']/g, '').trim();

  const handleEvaluate = () => {
    const targetWords = currentItem.sentenceDe.trim().split(/\s+/);
    const userWords = userInput.trim().split(/\s+/);

    let matchCount = 0;
    const diffs: Array<{ token: string; status: 'CORRECT' | 'ERROR' | 'CAPITALIZATION' | 'UMLAUT' }> = [];

    for (let i = 0; i < targetWords.length; i++) {
      const target = targetWords[i];
      const user = userWords[i] || '';

      const targetClean = cleanPunctuation(target);
      const userClean = cleanPunctuation(user);

      if (targetClean === userClean) {
        // 100% exact match including case
        matchCount++;
        diffs.push({ token: user || target, status: 'CORRECT' });
      } else if (targetClean.toLowerCase() === userClean.toLowerCase()) {
        // Capitalization error (e.g. wrote 'arzt' instead of 'Arzt')
        diffs.push({ token: user || target, status: 'CAPITALIZATION' });
      } else {
        // Check if umlaut missing (e.g. mussen vs müssen)
        const normalizeUmlauts = (str: string) =>
          str.replace(/ä/g, 'a').replace(/ö/g, 'o').replace(/ü/g, 'u').replace(/ß/g, 'ss');
        if (normalizeUmlauts(targetClean.toLowerCase()) === normalizeUmlauts(userClean.toLowerCase())) {
          diffs.push({ token: user || target, status: 'UMLAUT' });
        } else {
          diffs.push({ token: user || '____', status: 'ERROR' });
        }
      }
    }

    const calculatedScore = Math.round((matchCount / targetWords.length) * 100);
    setAccuracyScore(calculatedScore);
    setDiffTokens(diffs);
    setEvaluated(true);

    if (calculatedScore >= 85) {
      setStreak((s) => s + 1);
    } else {
      setStreak(0);
    }
  };

  const handleNext = () => {
    setUserInput('');
    setEvaluated(false);
    setDiffTokens([]);
    setCurrentIndex((prev) => (prev + 1) % items.length);
  };

  return (
    <div className="py-4 space-y-6 max-w-3xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs uppercase font-extrabold tracking-wider px-2 py-0.5 rounded bg-blue-500/10 text-blue-400 border border-blue-500/20">
              Diktat-Modus • تدريب الإملاء الصوتي
            </span>
            <span className="text-xs font-mono text-slate-500">• جملة {currentIndex + 1} من {items.length}</span>
          </div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Headphones className="w-5 h-5 text-blue-400" /> وضع الإملاء الصوتي واكتشاف أخطاء الكتابة
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            استمع للجملة الألمانية بدقة، اكتب ما تسمعه، ودع النظام يحلل لك أخطاء الـ Umlauts والـ Capitalization حرفاً بحرف.
          </p>
        </div>

        {/* Streak */}
        <div className="flex items-center gap-3">
          <div className="px-3.5 py-1.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-400 font-mono text-xs font-bold flex items-center gap-1.5">
            <span>🔥 التتابع:</span>
            <span>{streak} متتالية</span>
          </div>
        </div>
      </div>

      {/* Main Dictation Box */}
      <div className="p-8 rounded-3xl bg-slate-900 border border-slate-800 shadow-2xl space-y-6">
        {/* Audio Control Row */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-2xl bg-slate-950 border border-slate-800">
          <button
            onClick={() => playAudio()}
            className="px-6 py-3.5 rounded-2xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-sm transition flex items-center justify-center gap-2 shadow-lg shadow-blue-500/20"
          >
            <Volume2 className="w-5 h-5 animate-pulse" />
            <span>🔊 استمع للجملة الألمانية</span>
          </button>

          {/* Speed Selector */}
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-400">السرعة:</span>
            {[
              { label: '0.75x', val: 0.75 },
              { label: '0.85x', val: 0.85 },
              { label: '1.0x', val: 1.0 },
            ].map((s) => (
              <button
                key={s.label}
                onClick={() => {
                  setSpeed(s.val);
                  playAudio(s.val);
                }}
                className={`px-3 py-1 rounded-xl text-xs font-bold transition ${
                  speed === s.val
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'bg-slate-900 text-slate-400 hover:text-white'
                }`}
              >
                {s.label}
              </button>
            ))}
          </div>
        </div>

        {/* Typing Input */}
        <div className="space-y-2">
          <label className="text-xs text-slate-400 block font-arabic">
            اكتب الجملة الألمانية التي سمعتها هنا (انتبه للحروف الكبيرة وصيغ الـ Umlaut):
          </label>
          <textarea
            rows={3}
            disabled={evaluated}
            placeholder="مثال: Der Arzt untersucht..."
            value={userInput}
            onChange={(e) => setUserInput(e.target.value)}
            className="w-full p-4 rounded-2xl bg-slate-950 border border-slate-800 text-sm text-slate-100 placeholder:text-slate-600 focus:outline-none focus:border-blue-500 font-mono transition"
          />
        </div>

        {/* Umlaut quick buttons bar */}
        {!evaluated && (
          <div className="flex items-center gap-2 flex-wrap text-xs">
            <span className="text-slate-500 text-[11px]">مفاتيح سريعة للأحرف الألمانية:</span>
            {['ä', 'ö', 'ü', 'Ä', 'Ö', 'Ü', 'ß'].map((char) => (
              <button
                key={char}
                onClick={() => setUserInput((prev) => prev + char)}
                className="w-8 h-8 rounded-xl bg-slate-950 border border-slate-800 hover:border-blue-500 text-slate-200 font-mono font-bold transition flex items-center justify-center text-sm"
              >
                {char}
              </button>
            ))}
          </div>
        )}

        {/* Action Button */}
        {!evaluated ? (
          <button
            onClick={handleEvaluate}
            disabled={!userInput.trim()}
            className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold text-sm transition shadow-xl shadow-blue-500/20 disabled:opacity-50"
          >
            فحص الإملاء واكتشاف الأخطاء (Diktat prüfen) ✨
          </button>
        ) : (
          <div className="space-y-6 animate-fadeIn">
            {/* Accuracy Score Banner */}
            <div
              className={`p-4 rounded-2xl border flex items-center justify-between text-xs ${
                accuracyScore >= 85
                  ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
                  : 'bg-rose-500/10 border-rose-500/30 text-rose-400'
              }`}
            >
              <div className="flex items-center gap-2 font-bold text-sm">
                {accuracyScore >= 85 ? (
                  <>
                    <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                    <span>إملاء ممتاز! تطابق عالي مع النطق الألماني</span>
                  </>
                ) : (
                  <>
                    <XCircle className="w-5 h-5 text-rose-400" />
                    <span>توجد أخطاء إملائية أو في الحروف الكبيرة والـ Umlauts</span>
                  </>
                )}
              </div>
              <div className="text-lg font-mono font-extrabold">{accuracyScore}%</div>
            </div>

            {/* Word-by-Word Diff View */}
            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
              <div className="text-xs text-slate-400 font-arabic">التحليل التفصيلي لكلماتك:</div>
              <div className="flex flex-wrap gap-2 text-sm font-mono leading-relaxed">
                {diffTokens.map((token, tIdx) => (
                  <span
                    key={tIdx}
                    className={`px-2.5 py-1 rounded-xl border font-bold ${
                      token.status === 'CORRECT'
                        ? 'bg-emerald-500/20 border-emerald-500/40 text-emerald-300'
                        : token.status === 'CAPITALIZATION'
                        ? 'bg-amber-500/20 border-amber-500/40 text-amber-300'
                        : token.status === 'UMLAUT'
                        ? 'bg-purple-500/20 border-purple-500/40 text-purple-300'
                        : 'bg-rose-500/20 border-rose-500/40 text-rose-300'
                    }`}
                  >
                    {token.token}
                  </span>
                ))}
              </div>

              {/* Legend */}
              <div className="flex flex-wrap items-center gap-3 pt-2 text-[10px] text-slate-400 border-t border-slate-800/80">
                <span className="flex items-center gap-1">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-400" /> صحيح
                </span>
                <span className="flex items-center gap-1">
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-400" /> خطأ بالحرف الكبير (Capitalization)
                </span>
                <span className="flex items-center gap-1">
                  <span className="w-2.5 h-2.5 rounded-full bg-purple-400" /> خطأ Umlaut (ä/ö/ü)
                </span>
                <span className="flex items-center gap-1">
                  <span className="w-2.5 h-2.5 rounded-full bg-rose-400" /> خطأ إملائي
                </span>
              </div>
            </div>

            {/* Target Sentence & Translation */}
            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2 text-xs">
              <div>
                <span className="text-slate-500 block mb-0.5">الجملة الأصلية الصحيحة:</span>
                <span className="font-mono text-sm font-bold text-white">{currentItem.sentenceDe}</span>
              </div>
              <div>
                <span className="text-slate-500 block mb-0.5">الترجمة العربية:</span>
                <span className="font-arabic text-emerald-400 font-medium">{currentItem.sentenceAr}</span>
              </div>
              <div className="pt-2 border-t border-slate-800/80 font-arabic text-slate-300">
                💡 <span className="font-bold text-amber-400">قاعدة الإملاء المستهدفة:</span> {currentItem.focusRule}
              </div>
            </div>

            {/* Next Button */}
            <button
              onClick={handleNext}
              className="w-full py-3 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs transition flex items-center justify-center gap-2"
            >
              <span>الجملة التالية</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
