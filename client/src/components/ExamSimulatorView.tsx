import { useState } from 'react';
import { Award, Clock, CheckCircle, AlertCircle, FileText, Send, Headphones, Volume2 } from 'lucide-react';
import { speechService } from '../utils/speechService.js';

interface ExamSimulatorViewProps {
  cefrLevel: string;
}

export function ExamSimulatorView({ cefrLevel }: ExamSimulatorViewProps) {
  const [examType, setExamType] = useState<'GOETHE' | 'TELC'>('GOETHE');
  const [activeExam, setActiveExam] = useState<any | null>(null);
  const [loading, setLoading] = useState(false);
  const [answers, setAnswers] = useState<Record<string, any>>({});
  const [evalResult, setEvalResult] = useState<any | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);

  const startExam = async () => {
    setLoading(true);
    setEvalResult(null);
    setAnswers({});
    try {
      const res = await fetch('/api/learning/exams/start', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ examType, cefrLevel }),
      });
      const data = await res.json();
      setActiveExam(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const submitExam = async () => {
    if (!activeExam?.id) return;
    setSubmitting(true);
    try {
      const res = await fetch(`/api/learning/exams/${activeExam.id}/submit`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ answers }),
      });
      const data = await res.json();
      setEvalResult(data);
      setActiveExam(null);
    } catch (e) {
      console.error(e);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="py-4 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Award className="w-5 h-5 text-amber-400" /> محاكي امتحانات جوته وتلك (Goethe & Telc Simulator)
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            بيئة اختبارات محاكية بدقة للمعايير الرسمية، بتوقيت صارم وتقييم تفصيلي بالـ Rubrics الرسمية.
          </p>
        </div>

        {!activeExam && (
          <div className="flex items-center gap-2">
            <div className="flex rounded-xl bg-slate-900 border border-slate-800 p-1">
              <button
                onClick={() => setExamType('GOETHE')}
                className={`px-3 py-1 rounded-lg text-xs font-semibold transition ${
                  examType === 'GOETHE' ? 'bg-amber-500 text-slate-950 font-bold' : 'text-slate-400'
                }`}
              >
                Goethe-Zertifikat
              </button>
              <button
                onClick={() => setExamType('TELC')}
                className={`px-3 py-1 rounded-lg text-xs font-semibold transition ${
                  examType === 'TELC' ? 'bg-blue-600 text-white font-bold' : 'text-slate-400'
                }`}
              >
                telc Deutsch
              </button>
            </div>
            <button
              onClick={startExam}
              disabled={loading}
              className="px-5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs transition shadow-lg shadow-amber-500/20 disabled:opacity-50"
            >
              {loading ? 'جاري التوليد...' : 'بدء الاختبار الصارم'}
            </button>
          </div>
        )}
      </div>

      {/* Active Exam Interface */}
      {activeExam && (
        <div className="space-y-6 animate-fadeIn">
          {/* Status Bar */}
          <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-between text-xs">
            <div className="flex items-center gap-2 text-amber-400 font-bold">
              <Clock className="w-4 h-4 animate-spin" /> وضع المحاكاة الصارم نشط • ممنوع التلميحات أو الترجمة
            </div>
            <div className="font-mono text-slate-300">
              الامتحان: {activeExam.examType} {activeExam.cefrLevel}
            </div>
          </div>

          {/* Exam Questions */}
          <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-6">
            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800">
              <div className="flex items-center gap-2 text-blue-400 text-xs font-bold uppercase mb-2">
                <FileText className="w-4 h-4" /> Teil 1: Lesen (فهم المقروء)
              </div>
              <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 text-xs leading-relaxed text-slate-300 font-mono mb-4">
                Liebe Kolleginnen und Kollegen, am kommenden Freitag um 14:00 Uhr findet unsere monatliche
                Teambesprechung im Raum 302 statt. Bitte bringen Sie Ihre Projektberichte mit.
              </div>
              <div className="space-y-2">
                <div className="text-xs font-bold text-white">1. Wann findet das Treffen statt?</div>
                {['Freitag um 14 Uhr', 'Freitag um 12 Uhr', 'Samstag um 14 Uhr'].map((opt) => (
                  <label
                    key={opt}
                    className="flex items-center gap-3 p-3 rounded-xl bg-slate-900 border border-slate-800 hover:border-slate-700 cursor-pointer text-xs text-slate-200"
                  >
                    <input
                      type="radio"
                      name="reading_q1"
                      value={opt}
                      checked={answers['reading_q1'] === opt}
                      onChange={(e) => setAnswers({ ...answers, reading_q1: e.target.value })}
                      className="accent-amber-500"
                    />
                    <span>{opt}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Listening Section (Hören) */}
            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2 text-emerald-400 text-xs font-bold uppercase">
                  <Headphones className="w-4 h-4" /> Teil 2: Hören (فهم المسموع الأوتنتيك)
                </div>
                <button
                  onClick={() => {
                    setIsPlayingAudio(true);
                    speechService.speakGerman(
                      'Guten Tag! Ich möchte bitte ein Zugticket nach Hamburg kaufen. Wann fährt der nächste Zug ab? Der nächste ICE fährt um 10 Uhr 45 von Gleis 4. Möchten Sie einen Sitzplatz reservieren? Ja bitte, im Ruhebereich am Fenster. Das macht zusammen 54 Euro.',
                      0.85
                    );
                    setTimeout(() => setIsPlayingAudio(false), 8000);
                  }}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 shadow-lg ${
                    isPlayingAudio
                      ? 'bg-emerald-500 text-slate-950 animate-pulse'
                      : 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-emerald-500/20'
                  }`}
                >
                  <Volume2 className={`w-4 h-4 ${isPlayingAudio ? 'animate-bounce' : ''}`} />
                  {isPlayingAudio ? 'جاري تشغيل المقطع الصوتي...' : '🔊 تشغيل التسجيل الصوتي (Audio abspielen)'}
                </button>
              </div>

              <p className="text-xs text-slate-400 mb-4 font-arabic">
                استمع للمحادثة الصوتية بين المسافر وموظف التذاكر في محطة القطار، ثم أجب عن السؤالين:
              </p>

              <div className="space-y-4">
                {/* Listening Q1 */}
                <div className="space-y-2">
                  <div className="text-xs font-bold text-white">1. Wohin möchte der Reisende fahren?</div>
                  {['Nach Hamburg', 'Nach Berlin', 'Nach München'].map((opt) => (
                    <label
                      key={opt}
                      className="flex items-center gap-3 p-3 rounded-xl bg-slate-900 border border-slate-800 hover:border-slate-700 cursor-pointer text-xs text-slate-200"
                    >
                      <input
                        type="radio"
                        name="listening_q1"
                        value={opt}
                        checked={answers['listening_q1'] === opt}
                        onChange={(e) => setAnswers({ ...answers, listening_q1: e.target.value })}
                        className="accent-emerald-500"
                      />
                      <span>{opt}</span>
                    </label>
                  ))}
                </div>

                {/* Listening Q2 */}
                <div className="space-y-2">
                  <div className="text-xs font-bold text-white">2. Um wie viel Uhr fährt der nächste ICE ab?</div>
                  {['Um 10:45 Uhr', 'Um 11:30 Uhr', 'Um 09:15 Uhr'].map((opt) => (
                    <label
                      key={opt}
                      className="flex items-center gap-3 p-3 rounded-xl bg-slate-900 border border-slate-800 hover:border-slate-700 cursor-pointer text-xs text-slate-200"
                    >
                      <input
                        type="radio"
                        name="listening_q2"
                        value={opt}
                        checked={answers['listening_q2'] === opt}
                        onChange={(e) => setAnswers({ ...answers, listening_q2: e.target.value })}
                        className="accent-emerald-500"
                      />
                      <span>{opt}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>

            {/* Writing Section */}
            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800">
              <div className="flex items-center gap-2 text-purple-400 text-xs font-bold uppercase mb-2">
                <FileText className="w-4 h-4" /> Teil 3: Schreiben (الإنتاج الكتابي)
              </div>
              <div className="text-xs text-slate-400 mb-2 font-arabic">
                المطلوب: اكتب رسالة بريد إلكتروني قصيرة (حوالي 30-40 كلمة) إلى معلمك تشرح فيها سبب غيابك غداً
                بسبب المرض وتعتذر عن ذلك.
              </div>
              <textarea
                rows={4}
                placeholder="Sehr geehrter Herr Müller, ..."
                value={answers['writing_text'] || ''}
                onChange={(e) => setAnswers({ ...answers, writing_text: e.target.value })}
                className="w-full p-4 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-100 placeholder:text-slate-600 focus:outline-none focus:border-amber-500"
              />
            </div>

            <button
              onClick={submitExam}
              disabled={submitting}
              className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold text-sm transition flex items-center justify-center gap-2 shadow-xl shadow-amber-500/20 disabled:opacity-50"
            >
              <Send className="w-4 h-4" /> {submitting ? 'جاري تقييم الامتحان عبر الذكاء الاصطناعي...' : 'تسليم الامتحان والحصول على النتيجة والتقرير'}
            </button>
          </div>
        </div>
      )}

      {/* Completed Exam Evaluation Report */}
      {evalResult && (
        <div className="p-8 rounded-3xl bg-slate-900 border border-slate-800 shadow-2xl animate-fadeIn space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-6">
            <div>
              <div className="text-xs text-slate-400 uppercase tracking-wider mb-1">النتيجة النهائية للاختبار</div>
              <h3 className="text-2xl font-extrabold text-white">
                {evalResult.examType} {evalResult.cefrLevel} Mock Exam Report
              </h3>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-right">
                <div className="text-3xl font-extrabold font-mono text-amber-400">
                  {evalResult.totalScore}/100
                </div>
                <div className="text-xs font-semibold">
                  {evalResult.isPassed ? (
                    <span className="text-emerald-400 flex items-center gap-1 justify-end">
                      <CheckCircle className="w-3.5 h-3.5" /> ناجح (Bestanden)
                    </span>
                  ) : (
                    <span className="text-rose-400 flex items-center gap-1 justify-end">
                      <AlertCircle className="w-3.5 h-3.5" /> لم يجتز (Nicht Bestanden)
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Section Scores */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 text-center">
              <div className="text-[10px] text-slate-500 uppercase">القراءة (Lesen)</div>
              <div className="text-lg font-bold text-slate-100 mt-1">{evalResult.readingScore || 0}/25</div>
            </div>
            <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 text-center">
              <div className="text-[10px] text-slate-500 uppercase">الكتابة (Schreiben)</div>
              <div className="text-lg font-bold text-slate-100 mt-1">{evalResult.writingScore || 0}/25</div>
            </div>
            <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 text-center">
              <div className="text-[10px] text-slate-500 uppercase">الاستماع (Hören)</div>
              <div className="text-lg font-bold text-slate-100 mt-1">{evalResult.listeningScore || 0}/25</div>
            </div>
            <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 text-center">
              <div className="text-[10px] text-slate-500 uppercase">التحدث (Sprechen)</div>
              <div className="text-lg font-bold text-slate-100 mt-1">{evalResult.speakingScore || 0}/25</div>
            </div>
          </div>

          {/* Diagnostic Weakness Analysis */}
          {evalResult.aiWeaknessAnalysis && (
            <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800">
              <div className="text-xs font-bold text-amber-400 uppercase tracking-wider mb-2">
                التقرير التشخيصي للأخطاء وخطة التحسين (Diagnostic Weakness Analysis)
              </div>
              <div className="text-xs text-slate-300 font-arabic leading-relaxed">
                {evalResult.aiWeaknessAnalysis}
              </div>
            </div>
          )}

          <div className="text-[11px] text-slate-500 text-center">
            تنبيه: التقييم التقديري مستخرج بناءً على معايير CEFR الرسمية، ولا يعد شهادة معتمدة من معهد جوته أو تلك.
          </div>
        </div>
      )}
    </div>
  );
}
