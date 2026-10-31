import { useState, useEffect } from 'react';
import {
  BookOpen,
  Volume2,
  CheckCircle2,
  XCircle,
  Sparkles,
  RefreshCw,
  Eye,
  EyeOff,
  Languages,
  BookMarked,
  HelpCircle,
  Headphones,
} from 'lucide-react';
import { speechService } from '../utils/speechService.js';

interface MilestoneStoriesViewProps {
  cefrLevel: string;
}

export function MilestoneStoriesView({ cefrLevel: propCefrLevel }: MilestoneStoriesViewProps) {
  const [selectedLevel, setSelectedLevel] = useState<string>(propCefrLevel || 'A1');
  const [stories, setStories] = useState<any[]>([]);
  const [selectedStory, setSelectedStory] = useState<any | null>(null);
  const [readingMode, setReadingMode] = useState<'DUAL' | 'TOGGLE' | 'GERMAN_ONLY'>('DUAL');
  const [revealedSentences, setRevealedSentences] = useState<Record<number, boolean>>({});
  const [quizAnswers, setQuizAnswers] = useState<Record<number, string>>({});
  const [quizScore, setQuizScore] = useState<number | null>(null);
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [loading, setLoading] = useState(true);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);

  useEffect(() => {
    setSelectedLevel(propCefrLevel);
  }, [propCefrLevel]);

  useEffect(() => {
    fetchStories();
  }, [selectedLevel]);

  const fetchStories = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/learning/stories?cefrLevel=${selectedLevel}`);
      const data = await res.json();
      setStories(data);
      if (data.length > 0) {
        setSelectedStory(data[0]);
      } else {
        setSelectedStory(null);
      }
      setQuizScore(null);
      setQuizAnswers({});
      setQuizSubmitted(false);
      setRevealedSentences({});
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateStory = async () => {
    setGenerating(true);
    try {
      const res = await fetch('/api/learning/stories/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ cefrLevel: selectedLevel }),
      });
      const data = await res.json();
      setSelectedStory(data);
      fetchStories();
    } catch (e) {
      console.error(e);
    } finally {
      setGenerating(false);
    }
  };

  const playStoryAudio = (text: string) => {
    setIsPlayingAudio(true);
    speechService.speakGerman(text, 0.85);
    setTimeout(() => setIsPlayingAudio(false), 12000);
  };

  const playArabicStoryAudio = (text: string) => {
    speechService.speakArabic(text, 0.9);
  };

  const playSingleWord = (word: string) => {
    const cleanWord = word.replace(/[^a-zA-ZäöüÄÖÜß]/g, '');
    speechService.speakGerman(cleanWord, 0.8);
  };

  const handleQuizSubmit = (questions: any[]) => {
    let correct = 0;
    questions.forEach((q, i) => {
      if (quizAnswers[i] === q.correctAnswer) correct++;
    });
    setQuizScore(Math.round((correct / questions.length) * 100));
    setQuizSubmitted(true);
  };

  // Helper to parse JSON arrays safely
  const parseJsonSafe = (raw: any, fallback: any[] = []) => {
    if (!raw) return fallback;
    if (Array.isArray(raw)) return raw;
    try {
      return JSON.parse(raw);
    } catch {
      return fallback;
    }
  };

  const unknownWords = selectedStory ? parseJsonSafe(selectedStory.unknownWords) : [];
  const comprehensionQuestions = selectedStory ? parseJsonSafe(selectedStory.comprehensionQuestions) : [];

  return (
    <div className="py-4 space-y-6">
      {/* Header & Controls */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs uppercase font-extrabold tracking-wider px-2 py-0.5 rounded bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
              Leseverstehen & Geschichten
            </span>
            <span className="text-xs font-mono text-slate-500">• {stories.length} نصوص متاحة</span>
          </div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-indigo-400" /> مكتبة قطع القراءة والفهم (Lesetexte Hub)
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            قطع ألمانية واقعية متدرجة، مع النقر المباشر على أي كلمة لسماعها، وترجمة سياقية واختبارات فهم المقروء.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Level Switcher */}
          <div className="flex rounded-xl bg-slate-900 border border-slate-800 p-1 text-xs">
            {['A1', 'A2', 'B1', 'B2'].map((lvl) => (
              <button
                key={lvl}
                onClick={() => setSelectedLevel(lvl)}
                className={`px-3 py-1 rounded-lg font-bold transition ${
                  selectedLevel === lvl
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {lvl}
              </button>
            ))}
          </div>

          {/* Reading Mode Switcher */}
          <div className="flex rounded-xl bg-slate-900 border border-slate-800 p-1 text-xs">
            <button
              onClick={() => setReadingMode('DUAL')}
              className={`px-2.5 py-1 rounded-lg font-semibold transition flex items-center gap-1 ${
                readingMode === 'DUAL' ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-400 hover:text-white'
              }`}
              title="ترجمة موازية تحت كل فقرة"
            >
              <Languages className="w-3.5 h-3.5" /> مزدوجة
            </button>
            <button
              onClick={() => setReadingMode('TOGGLE')}
              className={`px-2.5 py-1 rounded-lg font-semibold transition flex items-center gap-1 ${
                readingMode === 'TOGGLE' ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-400 hover:text-white'
              }`}
              title="نقر لإظهار الترجمة"
            >
              <Eye className="w-3.5 h-3.5" /> نقر للإظهار
            </button>
            <button
              onClick={() => setReadingMode('GERMAN_ONLY')}
              className={`px-2.5 py-1 rounded-lg font-semibold transition flex items-center gap-1 ${
                readingMode === 'GERMAN_ONLY' ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-400 hover:text-white'
              }`}
              title="نص ألماني فقط بدون ترجمة"
            >
              <EyeOff className="w-3.5 h-3.5" /> ألماني فقط
            </button>
          </div>

          {/* AI Generator Button */}
          <button
            onClick={handleGenerateStory}
            disabled={generating}
            className="px-3.5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-medium text-xs transition flex items-center gap-1.5 shadow-lg shadow-indigo-500/20 disabled:opacity-50"
          >
            {generating ? (
              <>
                <RefreshCw className="w-3.5 h-3.5 animate-spin" /> جاري التأليف...
              </>
            ) : (
              <>
                <Sparkles className="w-3.5 h-3.5" /> توليد بالـ AI
              </>
            )}
          </button>
        </div>
      </div>

      {loading ? (
        <div className="text-center py-20 text-slate-500 text-xs">جاري تحميل قطع القراءة...</div>
      ) : stories.length === 0 ? (
        <div className="text-center py-16 bg-slate-900/60 rounded-3xl border border-slate-800 max-w-md mx-auto">
          <BookOpen className="w-12 h-12 text-indigo-400 mx-auto mb-3 opacity-60" />
          <h3 className="text-base font-bold text-white mb-1">لا توجد قطع قراءة للمستوى {selectedLevel}</h3>
          <p className="text-xs text-slate-400 mb-4">
            اضغط على "توليد بالـ AI" لتأليف قطعة مخصصة فوراً.
          </p>
          <button
            onClick={handleGenerateStory}
            disabled={generating}
            className="px-5 py-2.5 rounded-xl bg-indigo-600 text-white text-xs font-semibold"
          >
            تأليف قطعة الآن
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Stories List Column */}
          <div className="space-y-2">
            <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">
              قطع المستوى {selectedLevel}:
            </div>
            {stories.map((story) => (
              <button
                key={story.id}
                onClick={() => {
                  setSelectedStory(story);
                  setQuizScore(null);
                  setQuizSubmitted(false);
                  setQuizAnswers({});
                  setRevealedSentences({});
                }}
                className={`w-full text-right p-4 rounded-2xl border transition text-xs flex flex-col justify-between ${
                  selectedStory?.id === story.id
                    ? 'bg-indigo-600/15 border-indigo-500 text-indigo-300 shadow-lg shadow-indigo-500/10 ring-1 ring-indigo-500/30'
                    : 'bg-slate-900 border-slate-800 text-slate-300 hover:border-slate-700'
                }`}
              >
                <div className="font-bold text-white text-sm mb-1 leading-snug">{story.titleDe}</div>
                <div className="text-slate-400 font-arabic text-[11px] mb-2">{story.titleAr}</div>
                <div className="flex items-center justify-between text-[10px] text-slate-500 font-mono border-t border-slate-800/80 pt-2">
                  <span>CEFR {story.cefrLevel}</span>
                  <span className="text-indigo-400 font-sans">اقرأ الآن ⬅</span>
                </div>
              </button>
            ))}
          </div>

          {/* Story Content & Reading Panel */}
          {selectedStory && (
            <div className="lg:col-span-3 space-y-6">
              <div className="p-6 sm:p-8 rounded-3xl bg-slate-900 border border-slate-800 shadow-xl space-y-6">
                {/* Header of Selected Story */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-5">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded bg-blue-500/10 text-blue-400 border border-blue-500/20">
                        {selectedStory.cefrLevel} Lesetext
                      </span>
                    </div>
                    <h3 className="text-2xl font-extrabold text-white tracking-tight">{selectedStory.titleDe}</h3>
                    <div className="text-sm font-bold text-indigo-400 font-arabic mt-0.5">
                      {selectedStory.titleAr}
                    </div>
                  </div>

                  {/* Audio Players */}
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => playStoryAudio(selectedStory.storyTextDe)}
                      className={`px-4 py-2.5 rounded-xl border transition flex items-center gap-2 text-xs font-bold shadow-md ${
                        isPlayingAudio
                          ? 'bg-indigo-600 text-white border-indigo-400 animate-pulse'
                          : 'bg-indigo-600/10 hover:bg-indigo-600/20 text-indigo-400 border-indigo-500/30'
                      }`}
                      title="استمع للقطعة كاملة بالصوت الألماني"
                    >
                      <Headphones className="w-4 h-4" />
                      <span>{isPlayingAudio ? 'جاري الاستماع...' : '🔊 استماع ألماني (de-DE)'}</span>
                    </button>
                    <button
                      onClick={() => playArabicStoryAudio(selectedStory.storyTextAr)}
                      className="px-3.5 py-2.5 rounded-xl bg-slate-950 hover:bg-slate-800 text-slate-300 border border-slate-800 transition flex items-center gap-1.5 text-xs font-semibold font-arabic"
                      title="استمع للترجمة العربية"
                    >
                      <Volume2 className="w-4 h-4 text-emerald-400" />
                      <span>استماع عربي</span>
                    </button>
                  </div>
                </div>

                {/* Paragraphs with Interactive Word-Clicker */}
                <div className="space-y-4">
                  <div className="text-[11px] text-slate-500 flex items-center gap-1 mb-1 font-arabic">
                    <span>💡 نصيحة: انقر على أي كلمة ألمانية للاستماع إلى نطقها الفوري الصافي.</span>
                  </div>

                  {selectedStory.storyTextDe.split('\n\n').map((paragraph: string, pIdx: number) => {
                    const arParagraphs = selectedStory.storyTextAr.split('\n\n');
                    const arPara = arParagraphs[pIdx] || '';
                    const isRevealed = revealedSentences[pIdx];

                    return (
                      <div
                        key={pIdx}
                        className="p-5 rounded-2xl bg-slate-950/60 border border-slate-800/80 space-y-3 transition hover:border-slate-700"
                      >
                        {/* Interactive Clickable Words */}
                        <div className="text-slate-100 font-medium text-base sm:text-lg leading-relaxed flex flex-wrap gap-x-1.5 gap-y-1">
                          {paragraph.split(' ').map((word: string, wIdx: number) => (
                            <span
                              key={wIdx}
                              onClick={() => playSingleWord(word)}
                              className="cursor-pointer hover:text-indigo-400 hover:bg-indigo-500/10 px-1 py-0.5 rounded transition inline-block select-text"
                              title={`انقر لنطق "${word.replace(/[^a-zA-ZäöüÄÖÜß]/g, '')}"`}
                            >
                              {word}
                            </span>
                          ))}
                        </div>

                        {/* Arabic Translation Rendering based on mode */}
                        {readingMode === 'DUAL' && arPara && (
                          <div className="pt-2 border-t border-slate-800/60 text-xs sm:text-sm text-indigo-300 font-arabic leading-relaxed opacity-90">
                            {arPara}
                          </div>
                        )}

                        {readingMode === 'TOGGLE' && (
                          <div className="pt-2 border-t border-slate-800/60">
                            {isRevealed ? (
                              <div className="text-xs sm:text-sm text-indigo-300 font-arabic leading-relaxed animate-fadeIn">
                                {arPara}
                              </div>
                            ) : (
                              <button
                                onClick={() =>
                                  setRevealedSentences((prev) => ({ ...prev, [pIdx]: true }))
                                }
                                className="text-slate-500 hover:text-indigo-400 text-xs font-arabic flex items-center gap-1.5 transition"
                              >
                                <Eye className="w-3.5 h-3.5" /> إظهار الترجمة العربية لهذه الفقرة
                              </button>
                            )}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>

                {/* Schlüsselwörter (Key Vocabulary of the Text) */}
                {unknownWords.length > 0 && (
                  <div className="pt-6 border-t border-slate-800 space-y-3">
                    <h4 className="text-base font-bold text-white flex items-center gap-2">
                      <BookMarked className="w-4 h-4 text-amber-400" /> مفردات القطعة الأساسية (Schlüsselwörter)
                    </h4>
                    <p className="text-xs text-slate-400 font-arabic">
                      أهم الكلمات والتعبيرات الاصطلاحية المستخدمة في هذا النص:
                    </p>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                      {unknownWords.map((v: any, idx: number) => (
                        <div
                          key={idx}
                          className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 flex items-start justify-between gap-3 text-xs"
                        >
                          <div className="space-y-1">
                            <div className="flex items-center gap-2">
                              <span
                                className={`font-bold text-sm ${
                                  v.article === 'DER'
                                    ? 'text-blue-400'
                                    : v.article === 'DIE'
                                    ? 'text-rose-400'
                                    : v.article === 'DAS'
                                    ? 'text-emerald-400'
                                    : 'text-slate-200'
                                }`}
                              >
                                {v.word}
                              </span>
                              {v.plural && (
                                <span className="text-[10px] text-slate-500 font-mono">({v.plural})</span>
                              )}
                            </div>
                            <div className="text-slate-300 font-arabic font-medium">{v.translation}</div>
                            {v.explanation && (
                              <div className="text-[11px] text-slate-500 font-arabic">{v.explanation}</div>
                            )}
                          </div>

                          <button
                            onClick={() => playSingleWord(v.word)}
                            className="p-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-indigo-400 border border-slate-800 transition"
                            title="استمع لنطق الكلمة"
                          >
                            <Volume2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Comprehension Quiz */}
                {comprehensionQuestions.length > 0 && (
                  <div className="pt-6 border-t border-slate-800 space-y-4">
                    <div className="flex items-center justify-between">
                      <h4 className="text-base font-bold text-white flex items-center gap-2">
                        <HelpCircle className="w-4 h-4 text-emerald-400" /> أسئلة فهم المقروء (Verständnisfragen)
                      </h4>
                      {quizScore !== null && (
                        <div
                          className={`text-sm font-bold font-mono px-3 py-1 rounded-xl border ${
                            quizScore >= 60
                              ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
                              : 'bg-rose-500/10 border-rose-500/30 text-rose-400'
                          }`}
                        >
                          النتيجة: {quizScore}%
                        </div>
                      )}
                    </div>

                    <div className="space-y-4">
                      {comprehensionQuestions.map((q: any, idx: number) => {
                        const isCorrectAnswer = quizAnswers[idx] === q.correctAnswer;
                        return (
                          <div
                            key={idx}
                            className={`p-4 rounded-2xl bg-slate-950 border transition text-xs space-y-3 ${
                              quizSubmitted
                                ? isCorrectAnswer
                                  ? 'border-emerald-500/40'
                                  : 'border-rose-500/40'
                                : 'border-slate-800'
                            }`}
                          >
                            <div>
                              <div className="font-bold text-white text-sm mb-1">{q.questionDe}</div>
                              <div className="text-slate-400 font-arabic">{q.questionAr}</div>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                              {q.options?.map((opt: string) => {
                                const isSelected = quizAnswers[idx] === opt;
                                const isTheRightOpt = opt === q.correctAnswer;
                                return (
                                  <button
                                    key={opt}
                                    disabled={quizSubmitted}
                                    onClick={() => setQuizAnswers((prev) => ({ ...prev, [idx]: opt }))}
                                    className={`p-3 rounded-xl border text-right transition text-xs font-semibold flex items-center justify-between ${
                                      quizSubmitted
                                        ? isTheRightOpt
                                          ? 'bg-emerald-500/20 border-emerald-500 text-emerald-300'
                                          : isSelected
                                          ? 'bg-rose-500/20 border-rose-500 text-rose-300'
                                          : 'bg-slate-900 border-slate-800 text-slate-500 opacity-60'
                                        : isSelected
                                        ? 'bg-indigo-600 border-indigo-500 text-white shadow-md'
                                        : 'bg-slate-900 border-slate-800 text-slate-300 hover:border-slate-700'
                                    }`}
                                  >
                                    <span>{opt}</span>
                                    {quizSubmitted && isTheRightOpt && (
                                      <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                                    )}
                                    {quizSubmitted && isSelected && !isTheRightOpt && (
                                      <XCircle className="w-4 h-4 text-rose-400" />
                                    )}
                                  </button>
                                );
                              })}
                            </div>

                            {/* Arabic explanation after submission */}
                            {quizSubmitted && q.explanationAr && (
                              <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 text-[11px] text-slate-300 font-arabic">
                                💡 <span className="font-bold text-emerald-400">التوضيح:</span> {q.explanationAr}
                              </div>
                            )}
                          </div>
                        );
                      })}

                      <div className="flex items-center justify-end gap-3 pt-2">
                        {quizSubmitted ? (
                          <button
                            onClick={() => {
                              setQuizSubmitted(false);
                              setQuizScore(null);
                              setQuizAnswers({});
                            }}
                            className="px-6 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs transition"
                          >
                            إعادة حل الاختبار 🔄
                          </button>
                        ) : (
                          <button
                            onClick={() => handleQuizSubmit(comprehensionQuestions)}
                            className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs transition shadow-lg shadow-emerald-500/20"
                          >
                            تصحيح الاختبار والحصول على النتيجة
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
