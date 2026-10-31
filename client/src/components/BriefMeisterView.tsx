import { useState, useEffect } from 'react';
import {
  FileText,
  Send,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  Volume2,
  Copy,
  Check,
  RotateCcw,
  BookOpen,
} from 'lucide-react';
import { speechService } from '../utils/speechService.js';

interface BriefTemplate {
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

export function BriefMeisterView() {
  const [templates, setTemplates] = useState<BriefTemplate[]>([]);
  const [selectedTemplate, setSelectedTemplate] = useState<BriefTemplate | null>(null);
  const [studentText, setStudentText] = useState('');
  const [evaluating, setEvaluating] = useState(false);
  const [evalResult, setEvalResult] = useState<any | null>(null);
  const [copiedIdeal, setCopiedIdeal] = useState(false);
  const [showIdealLetter, setShowIdealLetter] = useState(false);

  useEffect(() => {
    fetch('/api/content/briefs')
      .then((r) => r.json())
      .then((data) => {
        setTemplates(data);
        if (data.length > 0) {
          setSelectedTemplate(data[0]);
          setStudentText(`${data[0].sampleAnrede}\n\n\n\n${data[0].sampleGruss}`);
        }
      })
      .catch(console.error);
  }, []);

  const handleSelectTemplate = (tmpl: BriefTemplate) => {
    setSelectedTemplate(tmpl);
    setStudentText(`${tmpl.sampleAnrede}\n\n\n\n${tmpl.sampleGruss}`);
    setEvalResult(null);
    setShowIdealLetter(false);
  };

  const handleInsertRedemittel = (text: string) => {
    setStudentText((prev) => {
      if (!prev.trim()) return text;
      // Insert before greeting or at end
      return prev + '\n' + text;
    });
  };

  const handleEvaluate = async () => {
    if (!studentText.trim() || studentText.trim().length < 15) return;
    setEvaluating(true);
    try {
      const res = await fetch('/api/content/brief/evaluate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          templateId: selectedTemplate?.id,
          studentText,
          targetLevel: selectedTemplate?.cefrLevel,
        }),
      });
      const data = await res.json();
      setEvalResult(data);
    } catch (e) {
      console.error(e);
    } finally {
      setEvaluating(false);
    }
  };

  const wordCount = studentText.trim().split(/\s+/).filter(Boolean).length;

  return (
    <div className="py-4 space-y-6 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs uppercase font-extrabold tracking-wider px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              Brief-Meister • كاتب الإيميلات والرسائل الرسمية
            </span>
          </div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <FileText className="w-5 h-5 text-emerald-400" /> مصحح ومساعد كتابة الرسائل للامتحانات والحياة في ألمانيا
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            نماذج معتمدة لامتحانات جوته وخطابات الحياة اليومية (السكن، العمل، الإلغاء)، مع تصريح وتقييم فوري بالذكاء الاصطناعي.
          </p>
        </div>
      </div>

      {/* Templates Selector Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {templates.map((tmpl) => (
          <button
            key={tmpl.id}
            onClick={() => handleSelectTemplate(tmpl)}
            className={`p-4 rounded-2xl border text-right transition flex flex-col justify-between ${
              selectedTemplate?.id === tmpl.id
                ? 'bg-emerald-500/15 border-emerald-500 text-emerald-300 ring-1 ring-emerald-500/40'
                : 'bg-slate-900 border-slate-800 text-slate-300 hover:border-slate-700'
            }`}
          >
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-950 text-slate-400 border border-slate-800">
                  CEFR {tmpl.cefrLevel}
                </span>
                <span className="text-[10px] text-slate-500 font-mono">{tmpl.category}</span>
              </div>
              <div className="font-bold text-sm text-white">{tmpl.titleDe}</div>
              <div className="text-[11px] text-slate-400 font-arabic mt-0.5">{tmpl.titleAr}</div>
            </div>
            <div className="text-[10px] text-emerald-400 font-semibold pt-3 mt-2 border-t border-slate-800/80">
              اكتب وتدرب ✍️
            </div>
          </button>
        ))}
      </div>

      {selectedTemplate && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column: Editor & Writing Canvas */}
          <div className="lg:col-span-2 space-y-4">
            {/* Situation Card */}
            <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-emerald-400 font-arabic">
                  📋 الموقف والمهمة المطلوبة ({selectedTemplate.cefrLevel}):
                </span>
                <span className="text-xs font-mono text-slate-500">
                  الحد الأدنى المقترح: {selectedTemplate.cefrLevel === 'B2' ? '80' : '45'} كلمة
                </span>
              </div>
              <p className="text-xs text-slate-200 font-sans leading-relaxed">
                {selectedTemplate.situationDe}
              </p>
              <p className="text-xs text-slate-400 font-arabic border-t border-slate-800/80 pt-2">
                {selectedTemplate.situationAr}
              </p>

              <div className="pt-2">
                <div className="text-[11px] font-bold text-slate-300 mb-1.5">النقاط الواجب تغطيتها في الرسالة:</div>
                <ul className="space-y-1 text-xs text-slate-400 font-arabic">
                  {selectedTemplate.pointsToCover.map((pt, pIdx) => (
                    <li key={pIdx} className="flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                      <span>{pt}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Writing Area */}
            <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-3 shadow-xl">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-white flex items-center gap-1.5">
                  <FileText className="w-4 h-4 text-emerald-400" /> مسودة رسالتك:
                </span>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono px-2 py-0.5 rounded bg-slate-950 text-slate-400 border border-slate-800">
                    {wordCount} كلمة
                  </span>
                  <button
                    onClick={() => setStudentText(`${selectedTemplate.sampleAnrede}\n\n\n\n${selectedTemplate.sampleGruss}`)}
                    className="p-1 rounded-lg text-slate-400 hover:text-white"
                    title="إعادة تعيين المسودة"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              <textarea
                rows={10}
                value={studentText}
                onChange={(e) => setStudentText(e.target.value)}
                placeholder="اكتب رسالتك هنا بالألمانية..."
                className="w-full p-4 rounded-xl bg-slate-950 border border-slate-800 text-sm text-slate-100 focus:outline-none focus:border-emerald-500 font-mono leading-relaxed text-left"
                dir="ltr"
              />

              <div className="flex items-center justify-between pt-2">
                <button
                  type="button"
                  onClick={() => setShowIdealLetter(!showIdealLetter)}
                  className="text-xs text-slate-400 hover:text-emerald-400 font-semibold flex items-center gap-1 transition"
                >
                  <BookOpen className="w-3.5 h-3.5" />
                  <span>{showIdealLetter ? 'إخفاء النموذج المثالي' : 'عرض نموذج كتابة مثالي (Musterbrief)'}</span>
                </button>

                <button
                  onClick={handleEvaluate}
                  disabled={evaluating || studentText.trim().length < 15}
                  className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs transition flex items-center gap-2 shadow-lg shadow-emerald-500/20 disabled:opacity-50"
                >
                  {evaluating ? (
                    <>
                      <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      <span>جاري الفحص بالـ AI...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4" />
                      <span>افحص وصحح الرسالة الآن 🪄</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Ideal Sample Letter Reveal */}
            {showIdealLetter && (
              <div className="p-5 rounded-2xl bg-slate-900 border border-emerald-500/40 space-y-3 animate-fadeIn">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-emerald-400 flex items-center gap-1.5">
                    <Sparkles className="w-4 h-4" /> نموذج كتابة مثالي عالي الدرجات (Musterlösung):
                  </span>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => speechService.speakGerman(selectedTemplate.idealSampleText, 0.85)}
                      className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300"
                      title="استمع للخطاب بصوت ألماني"
                    >
                      <Volume2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => {
                        navigator.clipboard.writeText(selectedTemplate.idealSampleText);
                        setCopiedIdeal(true);
                        setTimeout(() => setCopiedIdeal(false), 2000);
                      }}
                      className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300"
                      title="نسخ النموذج"
                    >
                      {copiedIdeal ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                </div>
                <div className="p-4 rounded-xl bg-slate-950 border border-slate-800/80 text-xs font-mono text-slate-200 whitespace-pre-line leading-relaxed text-left" dir="ltr">
                  {selectedTemplate.idealSampleText}
                </div>
              </div>
            )}
          </div>

          {/* Right Column: Key Redemittel Bank & AI Feedback */}
          <div className="space-y-4">
            {/* Key Phrases (Redemittel) Inserter */}
            <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
              <div>
                <h4 className="text-sm font-bold text-white flex items-center gap-1.5">
                  <Send className="w-4 h-4 text-emerald-400" /> تعبيرات جاهزة للاستخدام (Redemittel):
                </h4>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  انقر على أي جملة لإدراجها مباشرة داخل مسودة رسالتك:
                </p>
              </div>

              <div className="space-y-2 max-h-[380px] overflow-y-auto pr-1">
                {selectedTemplate.keyRedemittel.map((r, rIdx) => (
                  <button
                    key={rIdx}
                    onClick={() => handleInsertRedemittel(r.de)}
                    className="w-full text-right p-3 rounded-xl bg-slate-950 border border-slate-800/80 hover:border-emerald-500/50 hover:bg-emerald-950/20 text-xs transition space-y-1 block group"
                  >
                    <div className="font-mono text-emerald-300 text-left font-semibold group-hover:text-emerald-200" dir="ltr">
                      + {r.de}
                    </div>
                    <div className="text-[11px] text-slate-400 font-arabic">{r.ar}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* AI Evaluation Report Result */}
            {evalResult && (
              <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-4 shadow-2xl animate-scaleUp">
                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                  <div>
                    <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">نتيجة التقييم</span>
                    <h4 className="text-base font-extrabold text-white">تقرير فحص الرسالة</h4>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-black font-mono text-emerald-400">{evalResult.overallScore}%</div>
                    <span className="text-[10px] text-slate-500 font-mono">{evalResult.cefrVerdict}</span>
                  </div>
                </div>

                {/* Formality feedback */}
                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-1 text-xs">
                  <span className="font-bold text-slate-200">اللباقة والصيغ الرسمية:</span>
                  <p className="text-slate-400 text-[11px]">{evalResult.formalityVerdict}</p>
                </div>

                {/* Grammar & Corrections */}
                {evalResult.grammarFeedback?.length > 0 && (
                  <div className="space-y-2 text-xs">
                    <span className="font-bold text-slate-200">ملاحظات لغوية وتصويبات:</span>
                    <div className="space-y-1.5">
                      {evalResult.grammarFeedback.map((item: any, idx: number) => (
                        <div key={idx} className="p-2.5 rounded-xl bg-rose-950/20 border border-rose-500/30 text-rose-200 space-y-1">
                          <div className="font-mono text-[11px] text-rose-300 line-through text-left" dir="ltr">
                            {item.error}
                          </div>
                          <div className="font-mono text-[11px] text-emerald-400 font-bold text-left" dir="ltr">
                            ➔ {item.correction}
                          </div>
                          <div className="text-[10px] text-slate-400 font-arabic">{item.explanation}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Strengths */}
                {evalResult.strengths?.length > 0 && (
                  <div className="space-y-1 text-xs">
                    <span className="font-bold text-emerald-400 flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" /> نقاط القوة:
                    </span>
                    <ul className="text-[11px] text-slate-400 font-arabic list-disc list-inside">
                      {evalResult.strengths.map((s: string, sIdx: number) => (
                        <li key={sIdx}>{s}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Tips */}
                {evalResult.tipsForImprovement?.length > 0 && (
                  <div className="space-y-1 text-xs">
                    <span className="font-bold text-amber-400 flex items-center gap-1">
                      <AlertCircle className="w-3.5 h-3.5" /> نصائح لرفع درجتك:
                    </span>
                    <ul className="text-[11px] text-slate-400 font-arabic list-disc list-inside">
                      {evalResult.tipsForImprovement.map((tip: string, tIdx: number) => (
                        <li key={tIdx}>{tip}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
