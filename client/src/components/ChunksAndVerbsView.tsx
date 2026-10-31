import { useState, useEffect } from 'react';
import {
  Sparkles,
  Volume2,
  Filter,
  Search,
  CheckCircle2,
  XCircle,
  RotateCcw,
  BookMarked,
  Zap,
} from 'lucide-react';
import { speechService } from '../utils/speechService.js';

interface GermanChunk {
  id: string;
  chunkDe: string;
  chunkAr: string;
  category: string;
  formality: string;
  cefrLevel: string;
  exampleDe: string;
  exampleAr: string;
  usageTip: string;
}

interface VerbDrillItem {
  infinitive: string;
  translationAr: string;
  type: string;
  auxiliary: string;
  present: Record<string, string>;
  prateritum: Record<string, string>;
  perfektPartizip2: string;
}

export function ChunksAndVerbsView() {
  const [activeSubTab, setActiveSubTab] = useState<'chunks' | 'verbs'>('chunks');

  // Chunks state
  const [chunks, setChunks] = useState<GermanChunk[]>([]);
  const [chunkFilter, setChunkFilter] = useState<string>('ALL');
  const [chunkSearch, setChunkSearch] = useState<string>('');

  // Verbs Drill state
  const [verbs, setVerbs] = useState<VerbDrillItem[]>([]);
  const [currentVerbIndex, setCurrentVerbIndex] = useState<number>(0);
  const [currentPronoun, setCurrentPronoun] = useState<string>('du');
  const [currentTense, setCurrentTense] = useState<'present' | 'prateritum' | 'perfekt'>('present');
  const [userVerbInput, setUserVerbInput] = useState<string>('');
  const [verbFeedback, setVerbFeedback] = useState<'CORRECT' | 'WRONG' | null>(null);
  const [verbStreak, setVerbStreak] = useState<number>(0);

  useEffect(() => {
    fetch('/api/content/chunks')
      .then((res) => res.json())
      .then((data) => setChunks(data))
      .catch(console.error);

    fetch('/api/content/verbs')
      .then((res) => res.json())
      .then((data) => setVerbs(data))
      .catch(console.error);
  }, []);

  const currentVerb = verbs[currentVerbIndex];

  // Pick new random drill challenge
  const setupRandomDrill = () => {
    if (verbs.length === 0) return;
    const vIdx = Math.floor(Math.random() * verbs.length);
    const pKeys = ['ich', 'du', 'er_sie_es', 'wir', 'ihr', 'sie_Sie'];
    const pKey = pKeys[Math.floor(Math.random() * pKeys.length)];
    const tenses: Array<'present' | 'prateritum' | 'perfekt'> = ['present', 'prateritum', 'perfekt'];
    const t = tenses[Math.floor(Math.random() * tenses.length)];

    setCurrentVerbIndex(vIdx);
    setCurrentPronoun(pKey);
    setCurrentTense(t);
    setUserVerbInput('');
    setVerbFeedback(null);
  };

  const getExpectedAnswer = () => {
    if (!currentVerb) return '';
    if (currentTense === 'perfekt') {
      const aux = currentPronoun === 'ich' ? (currentVerb.auxiliary === 'sein' ? 'bin' : 'habe') :
                  currentPronoun === 'du' ? (currentVerb.auxiliary === 'sein' ? 'bist' : 'hast') :
                  currentPronoun === 'er_sie_es' ? (currentVerb.auxiliary === 'sein' ? 'ist' : 'hat') :
                  currentPronoun === 'wir' ? (currentVerb.auxiliary === 'sein' ? 'sind' : 'haben') :
                  currentPronoun === 'ihr' ? (currentVerb.auxiliary === 'sein' ? 'seid' : 'habt') :
                  (currentVerb.auxiliary === 'sein' ? 'sind' : 'haben');
      return `${aux} ${currentVerb.perfektPartizip2}`;
    }
    const map = currentTense === 'present' ? currentVerb.present : currentVerb.prateritum;
    return map[currentPronoun] || '';
  };

  const handleCheckVerb = () => {
    const expected = getExpectedAnswer().toLowerCase().trim();
    const user = userVerbInput.toLowerCase().trim();

    if (user === expected) {
      setVerbFeedback('CORRECT');
      setVerbStreak((s) => s + 1);
      speechService.speakGerman(expected, 0.85);
    } else {
      setVerbFeedback('WRONG');
      setVerbStreak(0);
    }
  };

  const filteredChunks = chunks.filter((c) => {
    const matchesFilter = chunkFilter === 'ALL' || c.formality === chunkFilter || c.cefrLevel === chunkFilter;
    const matchesSearch =
      c.chunkDe.toLowerCase().includes(chunkSearch.toLowerCase()) ||
      c.chunkAr.includes(chunkSearch) ||
      c.exampleDe.toLowerCase().includes(chunkSearch.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  return (
    <div className="py-4 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs uppercase font-extrabold tracking-wider px-2 py-0.5 rounded bg-purple-500/10 text-purple-400 border border-purple-500/20">
              Redewendungen & Konjugationstrainer
            </span>
          </div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <BookMarked className="w-5 h-5 text-purple-400" /> بنك التعبيرات الاصطلاحية ومدرب تصريف الأفعال
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            تعبيرات وجمل جاهزة للمواقف اليومية (Chunks) وتمارين مكثفة وسريعة لتثبيت تصريف الأفعال الشاذة والناقصة.
          </p>
        </div>

        {/* SubTab switcher */}
        <div className="flex rounded-xl bg-slate-900 border border-slate-800 p-1 text-xs">
          <button
            onClick={() => setActiveSubTab('chunks')}
            className={`px-4 py-1.5 rounded-lg font-bold transition flex items-center gap-1.5 ${
              activeSubTab === 'chunks'
                ? 'bg-purple-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" /> بنك التعبيرات ({chunks.length})
          </button>
          <button
            onClick={() => {
              setActiveSubTab('verbs');
              if (verbs.length > 0) setupRandomDrill();
            }}
            className={`px-4 py-1.5 rounded-lg font-bold transition flex items-center gap-1.5 ${
              activeSubTab === 'verbs'
                ? 'bg-purple-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Zap className="w-3.5 h-3.5" /> مدرب تصريف الأفعال
          </button>
        </div>
      </div>

      {/* 1. CHUNKS & REDEWENDUNGEN TAB */}
      {activeSubTab === 'chunks' && (
        <div className="space-y-6">
          {/* Controls Bar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
              <input
                type="text"
                placeholder="ابحث عن تعبير ألماني أو ترجمته بالعربية..."
                value={chunkSearch}
                onChange={(e) => setChunkSearch(e.target.value)}
                className="pl-9 pr-4 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-200 placeholder:text-slate-500 focus:outline-none focus:border-purple-500 w-full sm:w-80"
              />
            </div>

            <div className="flex items-center gap-1.5 text-xs flex-wrap">
              <span className="text-slate-500 flex items-center gap-1">
                <Filter className="w-3.5 h-3.5" /> الأسلوب:
              </span>
              {[
                { id: 'ALL', label: 'الكل' },
                { id: 'FORMAL', label: 'رسمي (Höflich/Formal)' },
                { id: 'UNIVERSAL', label: 'يومي شامل (Universal)' },
                { id: 'B1', label: 'مستوى B1' },
                { id: 'B2', label: 'مستوى B2' },
              ].map((f) => (
                <button
                  key={f.id}
                  onClick={() => setChunkFilter(f.id)}
                  className={`px-3 py-1 rounded-lg font-semibold transition ${
                    chunkFilter === f.id
                      ? 'bg-purple-600 text-white shadow-sm'
                      : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-white'
                  }`}
                >
                  {f.label}
                </button>
              ))}
            </div>
          </div>

          {/* Chunks Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredChunks.map((chunk) => (
              <div
                key={chunk.id}
                className="p-5 rounded-3xl bg-slate-900 border border-slate-800 space-y-3 hover:border-purple-500/50 transition group flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs uppercase font-bold px-2 py-0.5 rounded bg-purple-500/10 text-purple-400 border border-purple-500/20 font-mono">
                      {chunk.cefrLevel} • {chunk.formality}
                    </span>
                    <button
                      onClick={() => speechService.speakGerman(chunk.chunkDe, 0.85)}
                      className="p-2 rounded-xl bg-slate-950 hover:bg-slate-800 text-slate-400 hover:text-purple-400 border border-slate-800 transition"
                      title="استمع لنطق التعبير"
                    >
                      <Volume2 className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <div className="text-lg font-extrabold text-white font-mono group-hover:text-purple-300 transition">
                    {chunk.chunkDe}
                  </div>
                  <div className="text-sm font-arabic text-emerald-400 font-semibold mt-0.5">
                    {chunk.chunkAr}
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-800/80 space-y-2 text-xs">
                  <div className="bg-slate-950 p-3 rounded-2xl border border-slate-800/80 space-y-1">
                    <div className="text-[10px] text-slate-500 uppercase font-mono">مثال في سياق جملة:</div>
                    <div className="text-slate-200 font-medium">{chunk.exampleDe}</div>
                    <div className="text-slate-400 font-arabic text-[11px]">{chunk.exampleAr}</div>
                  </div>

                  <div className="text-[11px] text-slate-400 font-arabic">
                    💡 <span className="font-bold text-amber-400">نصيحة الاستخدام:</span> {chunk.usageTip}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 2. VERBS CONJUGATION TRAINER TAB */}
      {activeSubTab === 'verbs' && currentVerb && (
        <div className="max-w-xl mx-auto p-8 rounded-3xl bg-slate-900 border border-slate-800 shadow-2xl space-y-6">
          <div className="flex items-center justify-between border-b border-slate-800 pb-4">
            <div>
              <div className="text-xs uppercase font-extrabold text-purple-400">تدريب الأفعال الشاذة السريع</div>
              <h3 className="text-lg font-bold text-white">
                صيغة:{' '}
                <span className="text-amber-400 font-mono">
                  {currentTense === 'present'
                    ? 'المضارع (Präsens)'
                    : currentTense === 'prateritum'
                    ? 'الماضي البسيط (Präteritum)'
                    : 'الماضي التام (Perfekt mit Hilfsverb)'}
                </span>
              </h3>
            </div>
            <div className="px-3 py-1 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-mono font-bold flex items-center gap-1">
              <span>🔥 متتالية:</span>
              <span>{verbStreak}</span>
            </div>
          </div>

          {/* Drill Question Card */}
          <div className="text-center p-6 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
            <div className="text-xs text-slate-400 font-arabic">صرّف هذا الفعل مع الضمير المحدد:</div>
            <div className="text-3xl font-extrabold text-white font-mono flex items-center justify-center gap-3">
              <span className="text-purple-400">{currentPronoun}</span>
              <span>+</span>
              <span className="text-emerald-400">{currentVerb.infinitive}</span>
            </div>
            <div className="text-xs text-slate-400 font-arabic">({currentVerb.translationAr})</div>
          </div>

          {/* User Typing Input */}
          <div className="space-y-3">
            <input
              type="text"
              autoFocus
              disabled={verbFeedback !== null}
              placeholder={
                currentTense === 'perfekt'
                  ? 'مثال: hast gesehen / bist gefahren'
                  : 'اكتب التصريف الصحيح هنا...'
              }
              value={userVerbInput}
              onChange={(e) => setUserVerbInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  if (verbFeedback === null) handleCheckVerb();
                  else setupRandomDrill();
                }
              }}
              className="w-full px-4 py-3 rounded-2xl bg-slate-950 border border-slate-800 text-sm font-mono text-center text-white focus:outline-none focus:border-purple-500 transition"
            />

            {/* Feedback View */}
            {verbFeedback && (
              <div
                className={`p-4 rounded-2xl border text-xs font-arabic animate-fadeIn flex items-center justify-between ${
                  verbFeedback === 'CORRECT'
                    ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
                    : 'bg-rose-500/10 border-rose-500/30 text-rose-400'
                }`}
              >
                <div className="flex items-center gap-2">
                  {verbFeedback === 'CORRECT' ? (
                    <>
                      <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                      <span>إجابة صحيحة ومتقنة! 🎉</span>
                    </>
                  ) : (
                    <>
                      <XCircle className="w-5 h-5 text-rose-400" />
                      <span>
                        خطأ! الإجابة الصحيحة هي:{' '}
                        <span className="font-mono font-bold text-white text-sm">{getExpectedAnswer()}</span>
                      </span>
                    </>
                  )}
                </div>
              </div>
            )}

            {/* Action Buttons */}
            {verbFeedback === null ? (
              <button
                onClick={handleCheckVerb}
                disabled={!userVerbInput.trim()}
                className="w-full py-3.5 rounded-2xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-sm transition shadow-lg shadow-purple-500/20 disabled:opacity-50"
              >
                فحص التصريف
              </button>
            ) : (
              <button
                onClick={setupRandomDrill}
                className="w-full py-3.5 rounded-2xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-sm transition flex items-center justify-center gap-2"
              >
                <span>الفعل التالي ⬅</span>
                <RotateCcw className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
