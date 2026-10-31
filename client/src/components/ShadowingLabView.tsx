import { useState } from 'react';
import { Mic, Volume2, Award } from 'lucide-react';
import { speechService } from '../utils/speechService.js';

export function ShadowingLabView() {
  const [speed, setSpeed] = useState<number>(0.85);
  const targetSentence = 'Ich möchte fließend Deutsch sprechen und in Deutschland arbeiten.';
  const [spokenInput, setSpokenInput] = useState('');
  const [evalResult, setEvalResult] = useState<any | null>(null);
  const [evaluating, setEvaluating] = useState(false);
  const [isRecording, setIsRecording] = useState(false);

  const playTargetAudio = () => {
    speechService.speakGerman(targetSentence, speed);
  };

  const handleStartSpeechRecognition = () => {
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.lang = 'de-DE';
      recognition.interimResults = false;

      setIsRecording(true);
      recognition.start();

      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setSpokenInput(transcript);
        setIsRecording(false);
        runEvaluation(transcript);
      };

      recognition.onerror = () => {
        setIsRecording(false);
      };

      recognition.onend = () => {
        setIsRecording(false);
      };
    } else {
      // Fallback: prompt user to type or notice
      alert('المتصفح لا يدعم ميكروفون الـ Web Speech مباشرة، يمكنك كتابة أو لصق ما نطقته في الحقل بالأسفل للمقارنة.');
    }
  };

  const runEvaluation = async (text: string) => {
    setEvaluating(true);
    try {
      const res = await fetch('/api/learning/shadowing/evaluate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          targetSentence,
          spokenText: text,
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

  return (
    <div className="max-w-2xl mx-auto py-6 space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-white tracking-tight">مختبر التظليل الصوتي (Shadowing Mode)</h2>
        <p className="text-xs text-slate-400 mt-1">
          استمع للجملة الألمانية، كررها بنفس النغمة والسرعة، وسيقوم النظام بمقارنة دقة مخارج الحروف فورياً.
        </p>
      </div>

      {/* Target Sentence Card */}
      <div className="p-8 rounded-3xl bg-slate-900 border border-slate-800 text-center shadow-xl">
        <div className="flex items-center justify-center gap-3 mb-4">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">الجملة المستهدفة:</span>
          <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-950 border border-slate-800 text-xs text-slate-300">
            <span>السرعة:</span>
            {[0.75, 0.85, 1.0].map((s) => (
              <button
                key={s}
                onClick={() => setSpeed(s)}
                className={`px-1.5 py-0.5 rounded text-[11px] font-mono transition ${
                  speed === s ? 'bg-blue-600 text-white font-bold' : 'text-slate-400 hover:text-white'
                }`}
              >
                {s}x
              </button>
            ))}
          </div>
        </div>

        <h3 className="text-2xl font-extrabold text-white leading-relaxed mb-4">
          "{targetSentence}"
        </h3>

        <button
          onClick={playTargetAudio}
          className="px-6 py-3 rounded-2xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs transition inline-flex items-center gap-2 shadow-lg shadow-blue-500/20"
        >
          <Volume2 className="w-4 h-4" /> استمع للنطق النموذجي ({speed}x)
        </button>
      </div>

      {/* Recording & Input Controls */}
      <div className="p-6 rounded-3xl bg-slate-900/60 border border-slate-800 text-center space-y-4">
        <button
          onClick={handleStartSpeechRecognition}
          className={`w-20 h-20 rounded-full flex items-center justify-center mx-auto transition shadow-lg ${
            isRecording
              ? 'bg-rose-600 text-white animate-ping'
              : 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-emerald-500/20'
          }`}
        >
          <Mic className="w-8 h-8" />
        </button>
        <div className="text-xs text-slate-400">
          {isRecording ? 'جاري الاستماع... تحدث الآن بالألمانية' : 'اضغط على الميكروفون وتحدث الآن'}
        </div>

        {/* Text Input Fallback */}
        <div className="flex gap-2 max-w-md mx-auto pt-2">
          <input
            type="text"
            placeholder="أو اكتب ما نطقت للمقارنة..."
            value={spokenInput}
            onChange={(e) => setSpokenInput(e.target.value)}
            className="flex-1 px-4 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-200 focus:outline-none focus:border-blue-500"
          />
          <button
            onClick={() => runEvaluation(spokenInput)}
            disabled={evaluating || !spokenInput}
            className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs text-white font-medium transition disabled:opacity-50"
          >
            تقييم
          </button>
        </div>
      </div>

      {/* Evaluation Results */}
      {evalResult && (
        <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 animate-fadeIn space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Award className="w-5 h-5 text-amber-400" />
              <span className="text-sm font-bold text-white">تقرير دقة النطق والصوت</span>
            </div>
            <div className="text-2xl font-extrabold text-emerald-400 font-mono">
              {evalResult.accuracyScore}%
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 text-xs leading-relaxed">
            <div className="text-slate-400 mb-2">تطابق الكلمات:</div>
            <div className="flex flex-wrap gap-1.5">
              {evalResult.wordBreakdown?.map((wb: any, i: number) => (
                <span
                  key={i}
                  className={`px-2 py-1 rounded-lg font-mono text-xs ${
                    wb.matched
                      ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                      : 'bg-rose-500/10 text-rose-400 border border-rose-500/30'
                  }`}
                >
                  {wb.word}
                </span>
              ))}
            </div>
          </div>

          <p className="text-xs font-arabic text-slate-300 bg-slate-950/60 p-3.5 rounded-xl border border-slate-800/80">
            💡 {evalResult.feedback}
          </p>
        </div>
      )}
    </div>
  );
}
