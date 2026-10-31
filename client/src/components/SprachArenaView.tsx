import { useState, useEffect, useRef } from 'react';
import {
  Zap,
  Timer,
  Trophy,
  Flame,
  RotateCcw,
  CheckCircle2,
  XCircle,
  HelpCircle,
  Volume2,
  Sparkles,
  Puzzle,
  ArrowRight,
  Eye,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { speechService } from '../utils/speechService.js';

interface NounItem {
  id: string;
  article: 'der' | 'die' | 'das';
  word: string;
  plural: string;
  translationAr: string;
  cefrLevel: 'A1' | 'A2' | 'B1' | 'B2';
  category: string;
  ruleHint: string;
}

interface SatzbauChallenge {
  id: string;
  cefrLevel: 'A1' | 'A2' | 'B1' | 'B2';
  titleAr: string;
  topic: string;
  correctWords: string[];
  translationAr: string;
  grammarRule: string;
  category: string;
}

export function SprachArenaView() {
  const [arenaMode, setArenaMode] = useState<'DER_DIE_DAS' | 'SATZBAU'>('DER_DIE_DAS');

  // ----------------------------------------------------
  // GAME 1: Der / Die / Das Speed Rush
  // ----------------------------------------------------
  const [nouns, setNouns] = useState<NounItem[]>([]);
  const [currentNounIdx, setCurrentNounIdx] = useState(0);
  const [gameState, setGameState] = useState<'IDLE' | 'PLAYING' | 'FINISHED'>('IDLE');
  const [timeLeft, setTimeLeft] = useState(60);
  const [score, setScore] = useState(0);
  const [combo, setCombo] = useState(0);
  const [maxCombo, setMaxCombo] = useState(0);
  const [highScore, setHighScore] = useState<number>(() => {
    return parseInt(localStorage.getItem('deutschlab_ddd_highscore') || '0', 10);
  });
  const [lastAnswerStatus, setLastAnswerStatus] = useState<'CORRECT' | 'WRONG' | null>(null);
  const [answeredHistory, setAnsweredHistory] = useState<
    Array<{ noun: NounItem; chosen: string; isCorrect: boolean }>
  >([]);
  const [showRulesModal, setShowRulesModal] = useState(false);
  const timerRef = useRef<any>(null);

  useEffect(() => {
    fetch('/api/content/nouns')
      .then((r) => r.json())
      .then((data) => {
        // Shuffle nouns
        setNouns([...data].sort(() => Math.random() - 0.5));
      })
      .catch(console.error);
  }, []);

  const startRushGame = () => {
    setTimeLeft(60);
    setScore(0);
    setCombo(0);
    setMaxCombo(0);
    setAnsweredHistory([]);
    setLastAnswerStatus(null);
    setCurrentNounIdx(0);
    setGameState('PLAYING');

    if (nouns.length > 0) {
      speechService.speakGerman(nouns[0].word, 1.0);
    }

    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timerRef.current);
          finishGame();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const finishGame = () => {
    setGameState('FINISHED');
    if (timerRef.current) clearInterval(timerRef.current);
    confetti({ particleCount: 70, spread: 60, origin: { y: 0.6 } });
  };

  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  const handleArticleGuess = (guessedArticle: 'der' | 'die' | 'das') => {
    if (gameState !== 'PLAYING' || nouns.length === 0) return;

    const currentNoun = nouns[currentNounIdx];
    const isCorrect = currentNoun.article === guessedArticle;

    speechService.speakGerman(`${currentNoun.article} ${currentNoun.word}`, 1.0);

    setAnsweredHistory((prev) => [
      { noun: currentNoun, chosen: guessedArticle, isCorrect },
      ...prev,
    ]);

    if (isCorrect) {
      const addedPoints = 10 + combo * 2;
      const newScore = score + addedPoints;
      const newCombo = combo + 1;
      setScore(newScore);
      setCombo(newCombo);
      if (newCombo > maxCombo) setMaxCombo(newCombo);
      setLastAnswerStatus('CORRECT');

      if (newScore > highScore) {
        setHighScore(newScore);
        localStorage.setItem('deutschlab_ddd_highscore', newScore.toString());
      }
    } else {
      setCombo(0);
      setLastAnswerStatus('WRONG');
    }

    // Advance to next word
    if (currentNounIdx + 1 < nouns.length) {
      setCurrentNounIdx((prev) => prev + 1);
    } else {
      // Loop with re-shuffle
      setNouns([...nouns].sort(() => Math.random() - 0.5));
      setCurrentNounIdx(0);
    }
  };

  // ----------------------------------------------------
  // GAME 2: Satzbau Puzzle
  // ----------------------------------------------------
  const [challenges, setChallenges] = useState<SatzbauChallenge[]>([]);
  const [currentChalIdx, setCurrentChalIdx] = useState(0);
  const [availableTiles, setAvailableTiles] = useState<string[]>([]);
  const [selectedTiles, setSelectedTiles] = useState<string[]>([]);
  const [puzzleEvaluated, setPuzzleEvaluated] = useState(false);
  const [puzzleCorrect, setPuzzleCorrect] = useState(false);
  const [showHint, setShowHint] = useState(false);

  useEffect(() => {
    fetch('/api/content/satzbau')
      .then((r) => r.json())
      .then((data) => {
        setChallenges(data);
        if (data.length > 0) {
          loadChallenge(data[0]);
        }
      })
      .catch(console.error);
  }, []);

  const loadChallenge = (ch: SatzbauChallenge) => {
    // Scramble words
    const scrambled = [...ch.correctWords].sort(() => Math.random() - 0.5);
    setAvailableTiles(scrambled);
    setSelectedTiles([]);
    setPuzzleEvaluated(false);
    setPuzzleCorrect(false);
    setShowHint(false);
  };

  const handleTileClick = (word: string, index: number) => {
    if (puzzleEvaluated) return;
    // Move from available to selected
    const nextAvail = [...availableTiles];
    nextAvail.splice(index, 1);
    setAvailableTiles(nextAvail);
    setSelectedTiles([...selectedTiles, word]);
  };

  const handleRemoveTile = (word: string, index: number) => {
    if (puzzleEvaluated) return;
    // Move from selected back to available
    const nextSel = [...selectedTiles];
    nextSel.splice(index, 1);
    setSelectedTiles(nextSel);
    setAvailableTiles([...availableTiles, word]);
  };

  const checkSatzbau = () => {
    const current = challenges[currentChalIdx];
    const userSentence = selectedTiles.join(' ').replace(/\s+([.,!?])/g, '$1');
    const correctSentence = current.correctWords.join(' ').replace(/\s+([.,!?])/g, '$1');

    const isMatch = userSentence === correctSentence;
    setPuzzleEvaluated(true);
    setPuzzleCorrect(isMatch);

    if (isMatch) {
      speechService.speakGerman(correctSentence, 0.85);
      confetti({ particleCount: 50, spread: 50, origin: { y: 0.7 } });
    }
  };

  const nextSatzbau = () => {
    const nextIdx = (currentChalIdx + 1) % challenges.length;
    setCurrentChalIdx(nextIdx);
    loadChallenge(challenges[nextIdx]);
  };

  const currentNoun = nouns[currentNounIdx];
  const currentChallenge = challenges[currentChalIdx];

  return (
    <div className="py-4 space-y-6 max-w-4xl mx-auto">
      {/* Header & Mode Switcher */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs uppercase font-extrabold tracking-wider px-2 py-0.5 rounded bg-amber-500/10 text-amber-400 border border-amber-500/20">
              Sprach-Arena • ساحة الألعاب اللغوية
            </span>
          </div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Trophy className="w-5 h-5 text-amber-400" /> تحديات السرعة وبازل قواعد الألمانية
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            تثبيت أدوات التعريف (der/die/das) بسرعة رد الفعل، وبازل ترتيب الجملة وتصريف الفعل.
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center bg-slate-900 border border-slate-800 p-1 rounded-2xl">
          <button
            onClick={() => setArenaMode('DER_DIE_DAS')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
              arenaMode === 'DER_DIE_DAS'
                ? 'bg-amber-500 text-slate-950 shadow-md font-extrabold'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Zap className="w-3.5 h-3.5" />
            <span>تحدي الأدوات (60s Rush)</span>
          </button>
          <button
            onClick={() => setArenaMode('SATZBAU')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
              arenaMode === 'SATZBAU'
                ? 'bg-indigo-600 text-white shadow-md font-extrabold'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Puzzle className="w-3.5 h-3.5" />
            <span>بازل ترتيب الجملة (Satzbau)</span>
          </button>
        </div>
      </div>

      {/* ---------------------------------------------------- */}
      {/* ARENA MODE 1: Der / Die / Das Speed Rush             */}
      {/* ---------------------------------------------------- */}
      {arenaMode === 'DER_DIE_DAS' && (
        <div className="space-y-6 animate-fadeIn">
          {/* Top Bar Stats */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-between">
              <div>
                <div className="text-[10px] text-slate-400 font-bold uppercase">المؤقت الزمني</div>
                <div className={`text-2xl font-black font-mono mt-0.5 ${timeLeft <= 10 ? 'text-rose-400 animate-pulse' : 'text-white'}`}>
                  {timeLeft}s
                </div>
              </div>
              <Timer className={`w-6 h-6 ${timeLeft <= 10 ? 'text-rose-400' : 'text-slate-600'}`} />
            </div>

            <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-between">
              <div>
                <div className="text-[10px] text-slate-400 font-bold uppercase">النقاط الحالية</div>
                <div className="text-2xl font-black font-mono text-amber-400 mt-0.5">{score}</div>
              </div>
              <Zap className="w-6 h-6 text-amber-400" />
            </div>

            <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-between">
              <div>
                <div className="text-[10px] text-slate-400 font-bold uppercase">سلسلة التتالي (Combo)</div>
                <div className="text-2xl font-black font-mono text-emerald-400 mt-0.5">{combo}x</div>
              </div>
              <Flame className={`w-6 h-6 ${combo >= 3 ? 'text-amber-400 fill-amber-400 animate-bounce' : 'text-slate-600'}`} />
            </div>

            <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-between">
              <div>
                <div className="text-[10px] text-slate-400 font-bold uppercase">أعلى رقم قياسي</div>
                <div className="text-2xl font-black font-mono text-purple-400 mt-0.5">{highScore}</div>
              </div>
              <Trophy className="w-6 h-6 text-purple-400" />
            </div>
          </div>

          {/* Game Arena Screen */}
          {gameState === 'IDLE' && (
            <div className="p-10 rounded-3xl bg-slate-900 border border-slate-800 text-center space-y-6 shadow-2xl">
              <div className="w-20 h-20 mx-auto rounded-3xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-4xl shadow-lg shadow-amber-500/10">
                ⚡
              </div>
              <div className="space-y-2">
                <h3 className="text-2xl font-extrabold text-white">تحدي سرعة أدوات التعريف (60 ثانية)</h3>
                <p className="text-xs text-slate-400 max-w-md mx-auto leading-relaxed">
                  أمامك دقيقة واحدة لتحديد الأداة الصحيحة (<span className="text-blue-400 font-bold">der</span>، <span className="text-rose-400 font-bold">die</span>، <span className="text-emerald-400 font-bold">das</span>) لأكبر عدد ممكن من الأسماء الألمانية وتثبيتها في عقلك اللاواعي!
                </p>
              </div>

              <div className="flex items-center justify-center gap-3 pt-2">
                <button
                  onClick={startRushGame}
                  className="px-8 py-3.5 rounded-2xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-sm transition transform hover:scale-105 shadow-xl shadow-amber-500/25 flex items-center gap-2"
                >
                  <Zap className="w-4 h-4 fill-current" />
                  <span>ابدأ التحدي الآن (Start 60s)!</span>
                </button>
                <button
                  onClick={() => setShowRulesModal(true)}
                  className="px-4 py-3.5 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold text-xs transition flex items-center gap-1.5"
                >
                  <HelpCircle className="w-4 h-4" />
                  <span>دليل قواعد الأدوات 💡</span>
                </button>
              </div>
            </div>
          )}

          {gameState === 'PLAYING' && currentNoun && (
            <div className="p-8 sm:p-12 rounded-3xl bg-slate-900 border border-slate-800 text-center space-y-8 shadow-2xl relative overflow-hidden">
              {/* Category & Sound Button */}
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono text-slate-400 px-3 py-1 rounded-full bg-slate-950 border border-slate-800">
                  {currentNoun.category} • CEFR {currentNoun.cefrLevel}
                </span>
                <button
                  onClick={() => speechService.speakGerman(currentNoun.word, 1.0)}
                  className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 transition"
                  title="استمع للنطق"
                >
                  <Volume2 className="w-4 h-4" />
                </button>
              </div>

              {/* Word Display */}
              <div className="space-y-3 py-4">
                <div className="text-4xl sm:text-6xl font-black text-white tracking-tight drop-shadow-md">
                  {currentNoun.word}
                </div>
                <div className="text-sm font-arabic font-medium text-slate-400">
                  {currentNoun.translationAr} • <span className="font-mono text-xs text-slate-500">الجمع: {currentNoun.plural}</span>
                </div>
              </div>

              {/* 3 Large Action Buttons */}
              <div className="grid grid-cols-3 gap-3 sm:gap-6 pt-2">
                {/* DER */}
                <button
                  onClick={() => handleArticleGuess('der')}
                  className="py-5 sm:py-6 rounded-2xl bg-blue-600 hover:bg-blue-500 text-white font-black text-xl sm:text-2xl transition transform active:scale-95 shadow-xl shadow-blue-600/30 border-2 border-blue-400"
                >
                  der
                  <span className="block text-[10px] font-normal text-blue-200 mt-0.5">مذكر (Maskulin)</span>
                </button>

                {/* DIE */}
                <button
                  onClick={() => handleArticleGuess('die')}
                  className="py-5 sm:py-6 rounded-2xl bg-rose-600 hover:bg-rose-500 text-white font-black text-xl sm:text-2xl transition transform active:scale-95 shadow-xl shadow-rose-600/30 border-2 border-rose-400"
                >
                  die
                  <span className="block text-[10px] font-normal text-rose-200 mt-0.5">مؤنث (Feminin)</span>
                </button>

                {/* DAS */}
                <button
                  onClick={() => handleArticleGuess('das')}
                  className="py-5 sm:py-6 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xl sm:text-2xl transition transform active:scale-95 shadow-xl shadow-emerald-600/30 border-2 border-emerald-400"
                >
                  das
                  <span className="block text-[10px] font-normal text-emerald-200 mt-0.5">محايد (Neutral)</span>
                </button>
              </div>

              {/* Feedback indicator */}
              {lastAnswerStatus && (
                <div
                  className={`text-xs font-bold py-1.5 px-3 rounded-xl inline-block animate-fadeIn ${
                    lastAnswerStatus === 'CORRECT'
                      ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                      : 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                  }`}
                >
                  {lastAnswerStatus === 'CORRECT' ? '✓ ممتاز! إجابة صحيحة' : '✗ إجابة غير صحيحة، حاول التركيز!'}
                </div>
              )}
            </div>
          )}

          {gameState === 'FINISHED' && (
            <div className="p-8 sm:p-10 rounded-3xl bg-slate-900 border border-slate-800 text-center space-y-6 shadow-2xl animate-scaleUp">
              <div className="w-16 h-16 mx-auto rounded-2xl bg-amber-500/20 text-amber-400 flex items-center justify-center text-3xl">
                🏆
              </div>
              <div>
                <h3 className="text-2xl font-black text-white">انتهت الجولة! نتيجة رائعة</h3>
                <p className="text-xs text-slate-400 mt-1">
                  حققت <span className="text-amber-400 font-bold font-mono">{score} نقطة</span>، مع أعلى تتالي متواصل <span className="text-emerald-400 font-bold font-mono">{maxCombo}x</span>!
                </p>
              </div>

              <div className="flex items-center justify-center gap-3">
                <button
                  onClick={startRushGame}
                  className="px-6 py-3 rounded-2xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs transition flex items-center gap-2 shadow-lg shadow-amber-500/20"
                >
                  <RotateCcw className="w-4 h-4" />
                  <span>العب جولة أخرى (Noch einmal)</span>
                </button>
                <button
                  onClick={() => setShowRulesModal(true)}
                  className="px-4 py-3 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold"
                >
                  مراجعة قواعد الأدوات 💡
                </button>
              </div>

              {/* Answered Words Review Table */}
              <div className="pt-6 border-t border-slate-800 text-right space-y-3">
                <h4 className="text-sm font-bold text-white">مراجعة الكلمات في هذه الجولة ({answeredHistory.length} كلمة):</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-60 overflow-y-auto pr-1">
                  {answeredHistory.map((h, i) => (
                    <div
                      key={i}
                      className={`p-3 rounded-xl border flex items-center justify-between text-xs ${
                        h.isCorrect
                          ? 'bg-slate-950 border-slate-800 text-slate-200'
                          : 'bg-rose-950/20 border-rose-500/40 text-rose-200'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        {h.isCorrect ? (
                          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                        ) : (
                          <XCircle className="w-4 h-4 text-rose-400" />
                        )}
                        <span className="font-bold font-mono">
                          <span
                            className={
                              h.noun.article === 'der'
                                ? 'text-blue-400'
                                : h.noun.article === 'die'
                                ? 'text-rose-400'
                                : 'text-emerald-400'
                            }
                          >
                            {h.noun.article}
                          </span>{' '}
                          {h.noun.word}
                        </span>
                      </div>
                      <span className="text-[11px] text-slate-400 font-arabic">{h.noun.translationAr}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Rules Modal */}
          {showRulesModal && (
            <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
              <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl space-y-4 animate-scaleUp">
                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                  <h3 className="text-base font-bold text-white flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-amber-400" /> دليل النهايات الذهبية لأدوات التعريف الألمانية
                  </h3>
                  <button
                    onClick={() => setShowRulesModal(false)}
                    className="p-1 rounded-lg text-slate-400 hover:text-white"
                  >
                    ✕
                  </button>
                </div>

                <div className="space-y-3 text-xs">
                  <div className="p-3 rounded-2xl bg-blue-950/30 border border-blue-500/30 space-y-1">
                    <div className="font-bold text-blue-400">🔵 متى تكون الكلمة مذكرة (der)؟</div>
                    <p className="text-slate-300">
                      الكلمات المنتهية بـ: <span className="font-mono text-white">-er, -ismus, -ling, -or, -ist</span>، وأيام الأسبوع والأشهر وفصول السنة.
                    </p>
                  </div>

                  <div className="p-3 rounded-2xl bg-rose-950/30 border border-rose-500/30 space-y-1">
                    <div className="font-bold text-rose-400">🔴 متى تكون الكلمة مؤنثة (die)؟</div>
                    <p className="text-slate-300">
                      الكلمات المنتهية بـ: <span className="font-mono text-white">-ung, -heit, -keit, -schaft, -tät, -ion, -ik, -ei, -ur</span>، ومعظم الكلمات المنتهية بـ <span className="font-mono text-white">-e</span>.
                    </p>
                  </div>

                  <div className="p-3 rounded-2xl bg-emerald-950/30 border border-emerald-500/30 space-y-1">
                    <div className="font-bold text-emerald-400">🟢 متى تكون الكلمة محايدة (das)؟</div>
                    <p className="text-slate-300">
                      صيغ التصغير: <span className="font-mono text-white">-chen, -lein</span>، والكلمات اللاتينية: <span className="font-mono text-white">-ment, -um</span>، والكلمات المستعارة المنتهية بـ <span className="font-mono text-white">-o</span>، وكل فعل تم تحويله لاسم (das Essen, das Leben).
                    </p>
                  </div>
                </div>

                <div className="pt-2 text-right">
                  <button
                    onClick={() => setShowRulesModal(false)}
                    className="w-full py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs"
                  >
                    فهمت القواعد، فلنلعب الآن! 🚀
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ---------------------------------------------------- */}
      {/* ARENA MODE 2: Satzbau Word Order Puzzle              */}
      {/* ---------------------------------------------------- */}
      {arenaMode === 'SATZBAU' && currentChallenge && (
        <div className="space-y-6 animate-fadeIn">
          {/* Challenge Selector / Progress */}
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono text-indigo-400 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 font-bold">
              التحدي {currentChalIdx + 1} من {challenges.length} • {currentChallenge.cefrLevel} ({currentChallenge.topic})
            </span>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setShowHint(!showHint)}
                className="px-3 py-1 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-white text-xs font-semibold flex items-center gap-1"
              >
                <Eye className="w-3.5 h-3.5" />
                <span>{showHint ? 'إخفاء المعنى' : 'إظهار المعنى بالعربية'}</span>
              </button>
            </div>
          </div>

          {/* Puzzle Card */}
          <div className="p-6 sm:p-8 rounded-3xl bg-slate-900 border border-slate-800 space-y-6 shadow-xl">
            <div>
              <h3 className="text-lg font-bold text-white">{currentChallenge.titleAr}</h3>
              {showHint && (
                <p className="text-xs text-amber-300 font-arabic mt-1 bg-amber-500/10 p-2.5 rounded-xl border border-amber-500/20">
                  💡 <span className="font-bold">المعنى المطلوب:</span> "{currentChallenge.translationAr}"
                </p>
              )}
            </div>

            {/* Answer Sentence Slot (Dropzone) */}
            <div className="space-y-2">
              <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                جملتك المكتملة (انقر على الكلمة لإزالتها):
              </div>
              <div className="min-h-[70px] p-4 rounded-2xl bg-slate-950 border-2 border-dashed border-slate-700 flex flex-wrap items-center gap-2">
                {selectedTiles.length === 0 ? (
                  <span className="text-xs text-slate-600 font-mono italic">
                    اختر الكلمات من الأسفل بالترتيب النحوي الصحيح لبناء الجملة...
                  </span>
                ) : (
                  selectedTiles.map((word, wIdx) => (
                    <button
                      key={wIdx}
                      onClick={() => handleRemoveTile(word, wIdx)}
                      className="px-3.5 py-2 rounded-xl bg-indigo-600 hover:bg-rose-600 text-white font-bold text-sm transition transform hover:scale-105 shadow-md font-mono"
                    >
                      {word}
                    </button>
                  ))
                )}
              </div>
            </div>

            {/* Available Word Tiles Bank */}
            <div className="space-y-2">
              <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                مكعبات الكلمات المتاحة (انقر بالترتيب):
              </div>
              <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 flex flex-wrap gap-2.5 min-h-[60px]">
                {availableTiles.map((word, aIdx) => (
                  <button
                    key={aIdx}
                    onClick={() => handleTileClick(word, aIdx)}
                    className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white font-bold text-sm transition transform active:scale-95 border border-slate-700 shadow-sm font-mono"
                  >
                    {word}
                  </button>
                ))}
              </div>
            </div>

            {/* Validation & Feedback Box */}
            {puzzleEvaluated && (
              <div
                className={`p-4 rounded-2xl border space-y-2 animate-fadeIn ${
                  puzzleCorrect
                    ? 'bg-emerald-950/30 border-emerald-500/50 text-emerald-200'
                    : 'bg-rose-950/30 border-rose-500/50 text-rose-200'
                }`}
              >
                <div className="flex items-center gap-2 font-bold text-sm">
                  {puzzleCorrect ? (
                    <>
                      <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                      <span>صحيح ومثالي! ترتيب ألماني سليم 100% 🎯</span>
                    </>
                  ) : (
                    <>
                      <XCircle className="w-5 h-5 text-rose-400" />
                      <span>الترتيب غير صحيح! راجع موضع الفعل النحوي.</span>
                    </>
                  )}
                </div>
                <div className="text-xs font-arabic leading-relaxed pt-1 border-t border-slate-800/60">
                  <span className="font-bold">💡 القاعدة النحوية الحاكمة:</span> {currentChallenge.grammarRule}
                </div>
              </div>
            )}

            {/* Actions Bar */}
            <div className="flex items-center justify-between pt-2">
              <button
                onClick={() => loadChallenge(currentChallenge)}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold flex items-center gap-1.5"
              >
                <RotateCcw className="w-3.5 h-3.5" /> إعادة ضبط
              </button>

              <div className="flex items-center gap-2">
                {!puzzleEvaluated ? (
                  <button
                    onClick={checkSatzbau}
                    disabled={selectedTiles.length === 0}
                    className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs transition disabled:opacity-50 shadow-lg shadow-indigo-600/20"
                  >
                    تحقق من صحة الجملة 🔍
                  </button>
                ) : (
                  <button
                    onClick={nextSatzbau}
                    className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs transition flex items-center gap-1.5 shadow-lg shadow-emerald-600/20"
                  >
                    <span>التحدي التالي</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
