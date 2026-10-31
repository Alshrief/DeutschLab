import { useState, useEffect } from 'react';
import { CheckCircle2, RotateCcw, Volume2, ArrowRight } from 'lucide-react';
import confetti from 'canvas-confetti';
import { speechService } from '../utils/speechService.js';

interface StudyPlanViewProps {
  cefrLevel: string;
}

export function StudyPlanView({ cefrLevel }: StudyPlanViewProps) {
  const [cards, setCards] = useState<any[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [loading, setLoading] = useState(true);
  const [completed, setCompleted] = useState(false);

  useEffect(() => {
    fetchCards();
  }, [cefrLevel]);

  const fetchCards = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/vocab/fsrs/due');
      const data = await res.json();
      if (Array.isArray(data) && data.length > 0) {
        setCards(data);
      } else {
        // Fallback to all vocab if none strictly due
        const vocabRes = await fetch(`/api/vocab?cefrLevel=${cefrLevel}`);
        const vocabData = await vocabRes.json();
        setCards(
          vocabData.map((v: any) => ({
            id: v.fsrsProgress?.[0]?.id || v.id,
            vocabulary: v,
            stability: v.fsrsProgress?.[0]?.stability || 1,
            difficulty: v.fsrsProgress?.[0]?.difficulty || 4.5,
          }))
        );
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleReview = async (rating: number) => {
    const current = cards[currentIndex];
    if (current?.id) {
      try {
        await fetch('/api/vocab/fsrs/review', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ cardId: current.id, rating }),
        });
      } catch (e) {
        console.error(e);
      }
    }

    if (rating >= 3) {
      confetti({ particleCount: 25, spread: 45, origin: { y: 0.8 } });
    }

    if (currentIndex + 1 < cards.length) {
      setCurrentIndex((prev) => prev + 1);
      setIsFlipped(false);
    } else {
      setCompleted(true);
      confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
    }
  };

  const playPronunciation = (text: string) => {
    speechService.speakGerman(text, 0.85);
  };

  const playArabicPronunciation = (text: string) => {
    speechService.speakArabic(text, 0.9);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20 text-slate-400">
        <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin mr-3"></div>
        جاري تحميل جلسة التكرار المتباعد (FSRS)...
      </div>
    );
  }

  if (completed || cards.length === 0) {
    return (
      <div className="bg-slate-900/60 border border-slate-800 rounded-3xl p-12 text-center max-w-xl mx-auto my-8">
        <div className="w-20 h-20 rounded-full bg-emerald-500/10 text-emerald-400 flex items-center justify-center mx-auto mb-6">
          <CheckCircle2 className="w-10 h-10" />
        </div>
        <h2 className="text-2xl font-bold text-white mb-2">رائع! أكملت حصتك اليومية</h2>
        <p className="text-slate-400 text-sm mb-6">
          تم تحديث استقرار الذاكرة (Memory Stability) ومواعيد التكرار القادمة وفق خوارزمية FSRS بدقة.
        </p>
        <button
          onClick={() => {
            setCurrentIndex(0);
            setCompleted(false);
            setIsFlipped(false);
          }}
          className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-medium text-sm transition flex items-center gap-2 mx-auto"
        >
          <RotateCcw className="w-4 h-4" /> مراجعة إضافية الآن
        </button>
      </div>
    );
  }

  const currentCard = cards[currentIndex];
  const vocab = currentCard?.vocabulary;
  const sentence = vocab?.sentenceHistories?.[0];

  return (
    <div className="max-w-2xl mx-auto py-6">
      {/* Progress Header */}
      <div className="flex items-center justify-between mb-4 text-xs text-slate-400">
        <div className="flex items-center gap-2">
          <span className="px-2 py-0.5 rounded bg-blue-500/10 text-blue-400 font-semibold border border-blue-500/20">
            FSRS Adaptive
          </span>
          <span>
            البطاقة {currentIndex + 1} من {cards.length}
          </span>
        </div>
        <div className="font-mono text-emerald-400">مستوى الثبات: {currentCard?.stability || 1}d</div>
      </div>

      {/* Progress Bar */}
      <div className="w-full h-1.5 bg-slate-800 rounded-full mb-6 overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-blue-500 to-indigo-500 transition-all duration-300"
          style={{ width: `${((currentIndex + 1) / cards.length) * 100}%` }}
        />
      </div>

      {/* Flashcard Box */}
      <div
        onClick={() => setIsFlipped(!isFlipped)}
        className="cursor-pointer bg-slate-900 border border-slate-800 hover:border-slate-700 rounded-3xl p-8 min-h-[340px] flex flex-col justify-between transition-all duration-300 shadow-xl relative overflow-hidden group"
      >
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
            {vocab?.partOfSpeech || 'Wort'} • {vocab?.cefrLevel || cefrLevel}
          </span>
          <button
            onClick={(e) => {
              e.stopPropagation();
              playPronunciation(vocab?.word || '');
            }}
            className="p-2 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-300 transition"
          >
            <Volume2 className="w-4 h-4" />
          </button>
        </div>

        {/* Center Content */}
        <div className="text-center py-6">
          <div className="flex items-center justify-center gap-2 mb-2">
            {vocab?.article && vocab.article !== 'NONE' && (
              <span
                className={`text-lg font-bold px-3 py-0.5 rounded-lg border ${
                  vocab.article === 'DER'
                    ? 'text-blue-400 bg-blue-500/10 border-blue-500/30'
                    : vocab.article === 'DIE'
                    ? 'text-rose-400 bg-rose-500/10 border-rose-500/30'
                    : 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30'
                }`}
              >
                {vocab.article.toLowerCase()}
              </span>
            )}
            <h2 className="text-4xl font-extrabold text-white tracking-tight">{vocab?.word}</h2>
          </div>

          {vocab?.ipaPhonetics && (
            <p className="text-xs font-mono text-slate-500">{vocab.ipaPhonetics}</p>
          )}

          {isFlipped ? (
            <div className="mt-6 pt-6 border-t border-slate-800/80 animate-fadeIn">
              <div className="flex items-center justify-center gap-2 mb-3">
                <h3 className="text-2xl font-bold text-emerald-400 font-arabic">
                  {vocab?.arabicTranslation}
                </h3>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    playArabicPronunciation(vocab?.arabicTranslation || '');
                  }}
                  className="p-1.5 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 transition"
                  title="استمع للنطق العربي"
                >
                  <Volume2 className="w-4 h-4" />
                </button>
              </div>
              {vocab?.plural && (
                <p className="text-xs text-amber-400/90 mb-2">الجمع: {vocab.plural}</p>
              )}
              {sentence && (
                <div className="mt-4 p-3 rounded-xl bg-slate-950/60 border border-slate-800/80 text-left">
                  <div className="text-xs text-slate-300 font-medium">{sentence.sentenceDe}</div>
                  <div className="text-xs text-slate-400 font-arabic mt-1 text-right">
                    {sentence.sentenceAr}
                  </div>
                </div>
              )}
            </div>
          ) : (
            <p className="text-xs text-slate-500 mt-8 flex items-center justify-center gap-1">
              انقر لقلب البطاقة وإظهار الترجمة والمثال <ArrowRight className="w-3 h-3" />
            </p>
          )}
        </div>

        <div className="text-center text-[11px] text-slate-600">
          DeutschLab FSRS 4-Rate Memory Optimization
        </div>
      </div>

      {/* FSRS Rating Buttons */}
      {isFlipped && (
        <div className="grid grid-cols-4 gap-3 mt-6">
          <button
            onClick={() => handleReview(1)}
            className="p-3 rounded-2xl bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/30 text-rose-400 transition text-center"
          >
            <div className="text-xs font-bold">Again (1)</div>
            <div className="text-[10px] opacity-75 mt-0.5">نسيتها (&lt;10m)</div>
          </button>
          <button
            onClick={() => handleReview(2)}
            className="p-3 rounded-2xl bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 text-amber-400 transition text-center"
          >
            <div className="text-xs font-bold">Hard (2)</div>
            <div className="text-[10px] opacity-75 mt-0.5">صعبة (1d)</div>
          </button>
          <button
            onClick={() => handleReview(3)}
            className="p-3 rounded-2xl bg-blue-500/10 hover:bg-blue-500/20 border border-blue-500/30 text-blue-400 transition text-center"
          >
            <div className="text-xs font-bold">Good (3)</div>
            <div className="text-[10px] opacity-75 mt-0.5">جيدة (3d)</div>
          </button>
          <button
            onClick={() => handleReview(4)}
            className="p-3 rounded-2xl bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 transition text-center"
          >
            <div className="text-xs font-bold">Easy (4)</div>
            <div className="text-[10px] opacity-75 mt-0.5">سهلة جداً (7d)</div>
          </button>
        </div>
      )}
    </div>
  );
}
