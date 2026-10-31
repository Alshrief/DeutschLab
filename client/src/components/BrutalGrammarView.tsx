import { useState, useEffect } from 'react';
import {
  Activity,
  Zap,
  CheckCircle,
  XCircle,
  AlertTriangle,
  ArrowRight,
  Sparkles,
} from 'lucide-react';

interface BrutalGrammarViewProps {
  cefrLevel: string;
}

export function BrutalGrammarView({ cefrLevel }: BrutalGrammarViewProps) {
  const [rules, setRules] = useState<any[]>([]);
  const [selectedRule, setSelectedRule] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);

  // AI X-Ray state
  const [xrayInput, setXrayInput] = useState('');
  const [xrayLoading, setXrayLoading] = useState(false);
  const [xrayResult, setXrayResult] = useState<any | null>(null);

  // Drill state
  const [drillAnswers, setDrillAnswers] = useState<Record<string, string>>({});
  const [drillFeedback, setDrillFeedback] = useState<Record<string, boolean>>({});

  useEffect(() => {
    fetchRules();
  }, [cefrLevel]);

  const fetchRules = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/grammar/rules?cefrLevel=${cefrLevel}`);
      const data = await res.json();
      setRules(data);
      if (data.length > 0) setSelectedRule(data[0]);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleXRayScan = async () => {
    if (!xrayInput.trim()) return;
    setXrayLoading(true);
    setXrayResult(null);

    try {
      const res = await fetch('/api/grammar/xray', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sentenceDe: xrayInput,
          learnerLevel: cefrLevel,
        }),
      });
      const data = await res.json();
      setXrayResult(data);
    } catch (e) {
      console.error(e);
    } finally {
      setXrayLoading(false);
    }
  };

  const handleSelectDrillOption = (drillId: string, option: string, correct: string) => {
    setDrillAnswers((prev) => ({ ...prev, [drillId]: option }));
    setDrillFeedback((prev) => ({ ...prev, [drillId]: option === correct }));
  };

  return (
    <div className="py-4 space-y-8">
      {/* AI X-Ray Surgical Scanner Section */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-purple-950/40 via-indigo-950/30 to-slate-900 border border-purple-800/30 shadow-xl relative overflow-hidden">
        <div className="flex items-center gap-2 text-purple-400 font-bold text-xs uppercase tracking-wider mb-2">
          <Zap className="w-4 h-4 text-purple-400 animate-pulse" /> AI X-Ray • الفحص الجراحي للأخطاء النحوية
        </div>
        <h2 className="text-xl font-bold text-white mb-1">
          اكتب أي جملة ألمانية لفحص الإعراب، الحالات، ومواقع الأفعال جراحياً
        </h2>
        <p className="text-xs text-slate-400 mb-4 max-w-2xl">
          يقوم المحرك بتفكيك الجملة وفحص الـ Cases (Nominativ, Akkusativ, Dativ) وترتيب الجملة الرئيسية والفرعية مع شرح تفصيلي باللغة العربية.
        </p>

        <div className="flex flex-col sm:flex-row gap-3">
          <input
            type="text"
            placeholder="مثال: Ich habe gestern der Mann im Park gesehen..."
            value={xrayInput}
            onChange={(e) => setXrayInput(e.target.value)}
            className="flex-1 px-4 py-3 rounded-2xl bg-slate-950 border border-slate-800 text-sm text-slate-100 placeholder:text-slate-600 focus:outline-none focus:border-purple-500 shadow-inner"
          />
          <button
            onClick={handleXRayScan}
            disabled={xrayLoading || !xrayInput.trim()}
            className="px-6 py-3 rounded-2xl bg-purple-600 hover:bg-purple-500 text-white font-semibold text-xs transition flex items-center justify-center gap-2 shadow-lg shadow-purple-500/20 disabled:opacity-50"
          >
            {xrayLoading ? (
              <>
                <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                جاري التحليل...
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" /> فحص X-Ray
              </>
            )}
          </button>
        </div>

        {/* X-Ray Results Presentation */}
        {xrayResult && (
          <div className="mt-6 pt-6 border-t border-slate-800 animate-fadeIn space-y-4">
            <div className="flex items-center gap-2">
              {xrayResult.isCorrect ? (
                <div className="flex items-center gap-2 text-emerald-400 text-sm font-bold">
                  <CheckCircle className="w-5 h-5" /> الجملة صحيحة 100% نحوياً!
                </div>
              ) : (
                <div className="flex items-center gap-2 text-rose-400 text-sm font-bold">
                  <AlertTriangle className="w-5 h-5" /> تم رصد أخطاء نحوية تحتاج تصحيحاً:
                </div>
              )}
            </div>

            {/* Corrected version */}
            {!xrayResult.isCorrect && xrayResult.correctedSentence && (
              <div className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800">
                <span className="text-[11px] font-semibold text-slate-500 uppercase">الصياغة السليمة:</span>
                <div className="text-base font-bold text-emerald-400 mt-0.5">
                  {xrayResult.correctedSentence}
                </div>
              </div>
            )}

            {/* Mistakes List */}
            {xrayResult.mistakes?.length > 0 && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {xrayResult.mistakes.map((m: any, idx: number) => (
                  <div key={idx} className="p-3.5 rounded-xl bg-slate-900 border border-rose-500/30 text-xs">
                    <div className="flex items-center justify-between mb-1">
                      <span className="px-2 py-0.5 rounded bg-rose-500/10 text-rose-400 font-mono font-bold">
                        {m.exactWord}
                      </span>
                      <span className="text-[10px] uppercase text-slate-400 font-mono">
                        {m.errorType}
                      </span>
                    </div>
                    <div className="text-slate-300 font-arabic mt-1">{m.surgicalExplanationAr}</div>
                    {m.surgicalExplanationDe && (
                      <div className="text-[11px] text-slate-500 mt-1 italic">{m.surgicalExplanationDe}</div>
                    )}
                  </div>
                ))}
              </div>
            )}

            {/* Syntax Matrix */}
            {xrayResult.syntaxMatrix?.length > 0 && (
              <div>
                <span className="text-xs font-semibold text-slate-400 block mb-2">مخطط الإعراب البصري (Syntax Tree):</span>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {xrayResult.syntaxMatrix.map((slot: any, idx: number) => (
                    <div key={idx} className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-center">
                      <div className="text-[10px] text-slate-500 font-mono">{slot.position}</div>
                      <div className="text-xs font-bold text-white my-0.5">{slot.word}</div>
                      <div className="text-[10px] text-indigo-400 font-arabic">{slot.case || slot.function}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Grammar Rules & Visual Syntax Formulas */}
      <div>
        <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
          <Activity className="w-5 h-5 text-indigo-400" /> القواعد الصارمة والمعادلات النحوية (Visual Formulas)
        </h3>

        {loading ? (
          <div className="text-center py-12 text-slate-500 text-xs">جاري تحميل القواعد...</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Rules Navigation Column */}
            <div className="space-y-2">
              {rules.map((rule) => (
                <button
                  key={rule.id}
                  onClick={() => setSelectedRule(rule)}
                  className={`w-full text-right p-4 rounded-2xl border transition text-xs font-medium flex items-center justify-between ${
                    selectedRule?.id === rule.id
                      ? 'bg-blue-600/10 border-blue-500 text-blue-400 shadow-md'
                      : 'bg-slate-900 border-slate-800 text-slate-300 hover:border-slate-700'
                  }`}
                >
                  <div>
                    <div className="font-bold text-sm text-white mb-0.5">{rule.title}</div>
                    <div className="text-[10px] text-slate-500">{rule.category}</div>
                  </div>
                  <ArrowRight className="w-4 h-4 opacity-50" />
                </button>
              ))}
            </div>

            {/* Selected Rule Details & Drills */}
            {selectedRule && (
              <div className="md:col-span-2 space-y-6">
                {/* Visual Formula Card */}
                <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-blue-400 px-2 py-0.5 rounded bg-blue-500/10 border border-blue-500/20">
                    المعادلة النحوية (Syntax Formula)
                  </span>
                  <div className="mt-3 p-4 rounded-xl bg-slate-950 border border-slate-800 font-mono text-sm text-emerald-400 font-bold overflow-x-auto">
                    {selectedRule.formulaSyntax}
                  </div>
                  <div className="mt-4 text-xs font-arabic text-slate-300 leading-relaxed">
                    {selectedRule.arabicExplanationMarkdown}
                  </div>
                </div>

                {/* Interactive Drills */}
                {selectedRule.drills?.length > 0 && (
                  <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800">
                    <h4 className="text-sm font-bold text-white mb-4">
                      تمارين تدريبية تفاعلية ({selectedRule.drills.length})
                    </h4>

                    <div className="space-y-4">
                      {selectedRule.drills.map((drill: any) => {
                        let optionsArr: string[] = [];
                        try {
                          optionsArr =
                            typeof drill.options === 'string' ? JSON.parse(drill.options) : drill.options;
                        } catch {
                          optionsArr = [];
                        }

                        const selectedAns = drillAnswers[drill.id];
                        const isCorrect = drillFeedback[drill.id];

                        return (
                          <div key={drill.id} className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-xs">
                            <div className="font-bold text-slate-200 text-sm mb-1">{drill.questionDe}</div>
                            <div className="text-slate-400 font-arabic mb-3">{drill.promptAr}</div>

                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                              {optionsArr.map((opt) => (
                                <button
                                  key={opt}
                                  onClick={() => handleSelectDrillOption(drill.id, opt, drill.correctAnswer)}
                                  className={`p-2 rounded-lg border font-mono text-xs transition ${
                                    selectedAns === opt
                                      ? opt === drill.correctAnswer
                                      ? 'bg-emerald-500/20 border-emerald-500 text-emerald-400 font-bold'
                                      : 'bg-rose-500/20 border-rose-500 text-rose-400'
                                      : 'bg-slate-900 border-slate-800 text-slate-300 hover:border-slate-700'
                                  }`}
                                >
                                  {opt}
                                </button>
                              ))}
                            </div>

                            {selectedAns && (
                              <div className="mt-3 text-[11px] font-arabic">
                                {isCorrect ? (
                                  <span className="text-emerald-400 font-semibold flex items-center gap-1">
                                    <CheckCircle className="w-3.5 h-3.5" /> إجابة صحيحة! {drill.explanationAr}
                                  </span>
                                ) : (
                                  <span className="text-rose-400 font-semibold flex items-center gap-1">
                                    <XCircle className="w-3.5 h-3.5" /> إجابة خاطئة! {drill.explanationAr}
                                  </span>
                                )}
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
