import { useState, useEffect } from 'react';
import {
  MessageSquare,
  Volume2,
  Play,
  Sparkles,
  Eye,
  UserCheck,
  Languages,
} from 'lucide-react';
import { speechService, type VoiceGender } from '../utils/speechService.js';

interface DialogueTurn {
  speaker: string;
  speakerRole: string;
  avatar: string;
  textDe: string;
  textAr: string;
}

interface DialogueChunk {
  de: string;
  ar: string;
  context: string;
  formality: 'FORMAL' | 'INFORMAL' | 'NEUTRAL';
}

interface DialogueItem {
  id: string;
  titleDe: string;
  titleAr: string;
  situation: string;
  cefrLevel: string;
  icon: string;
  turns: DialogueTurn[];
  keyChunks: DialogueChunk[];
}

interface RealLifeDialoguesViewProps {
  cefrLevel?: string;
}

export function RealLifeDialoguesView({ cefrLevel }: RealLifeDialoguesViewProps) {
  const [dialogues, setDialogues] = useState<DialogueItem[]>([]);
  const [selectedDialogue, setSelectedDialogue] = useState<DialogueItem | null>(null);
  const [showArabic, setShowArabic] = useState(true);
  const [roleplayMode, setRoleplayMode] = useState(false);
  const [revealedRoles, setRevealedRoles] = useState<Record<number, boolean>>({});
  const [playingIndex, setPlayingIndex] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDialogues();
  }, [cefrLevel]);

  const fetchDialogues = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/content/dialogues');
      const data = await res.json();
      setDialogues(data);
      if (data.length > 0) {
        setSelectedDialogue(data[0]);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const getTurnGender = (turn: DialogueTurn): VoiceGender => {
    const avatar = turn.avatar || '';
    if (avatar.includes('👩') || avatar.includes('👧') || avatar.includes('👵') || avatar.includes('👱‍♀️')) {
      return 'female';
    }
    if (avatar.includes('👨') || avatar.includes('👦') || avatar.includes('👴') || avatar.includes('🙋‍♂️') || avatar.includes('🧔')) {
      return 'male';
    }
    const roleLower = (turn.speakerRole + ' ' + turn.speaker).toLowerCase();
    if (roleLower.includes('in ') || roleLower.endsWith('in') || roleLower.includes('frau') || roleLower.includes('dame')) {
      return 'female';
    }
    if (roleLower.includes('herr') || roleLower.includes('mann') || roleLower.includes('kunde') || roleLower.includes('arzt') || roleLower.includes('beamter')) {
      return 'male';
    }
    return speechService.getDefaultGender();
  };

  const playTurnAudio = (turn: DialogueTurn, index?: number) => {
    if (index !== undefined) setPlayingIndex(index);
    const gender = getTurnGender(turn);
    speechService.speakGerman(turn.textDe, 0.85, gender);
    setTimeout(() => {
      if (index !== undefined) setPlayingIndex(null);
    }, 3500);
  };

  const playEntireDialogue = async () => {
    if (!selectedDialogue) return;
    for (let i = 0; i < selectedDialogue.turns.length; i++) {
      setPlayingIndex(i);
      const turn = selectedDialogue.turns[i];
      const gender = getTurnGender(turn);
      speechService.speakGerman(turn.textDe, 0.85, gender);
      await new Promise((r) => setTimeout(r, Math.max(3000, turn.textDe.length * 75)));
    }
    setPlayingIndex(null);
  };

  return (
    <div className="py-4 space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs uppercase font-extrabold tracking-wider px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              Alltagsdialoge • حوارات واقعية
            </span>
            <span className="text-xs font-mono text-slate-500">• {dialogues.length} مواقف حية في ألمانيا</span>
          </div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <MessageSquare className="w-5 h-5 text-emerald-400" /> مسرح الحوارات والمحادثات اليومية
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            حوارات تفاعلية بين شخصين في المخبز، مصلحة الأجانب، مع المالك، في البنك، ومقابلات العمل.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Toggle Arabic translations */}
          <button
            onClick={() => setShowArabic(!showArabic)}
            className={`px-3 py-1.5 rounded-xl border text-xs font-semibold transition flex items-center gap-1.5 ${
              showArabic
                ? 'bg-slate-900 border-slate-700 text-slate-200'
                : 'bg-slate-950 border-slate-800 text-slate-500'
            }`}
          >
            <Languages className="w-3.5 h-3.5" />
            <span>{showArabic ? 'إخفاء الترجمة' : 'إظهار الترجمة'}</span>
          </button>

          {/* Toggle Roleplay Mode */}
          <button
            onClick={() => {
              setRoleplayMode(!roleplayMode);
              setRevealedRoles({});
            }}
            className={`px-3.5 py-1.5 rounded-xl border text-xs font-bold transition flex items-center gap-1.5 shadow-sm ${
              roleplayMode
                ? 'bg-amber-500 text-slate-950 border-amber-400 font-extrabold'
                : 'bg-slate-900 border-slate-800 text-amber-400 hover:border-amber-500/40'
            }`}
          >
            <UserCheck className="w-3.5 h-3.5" />
            <span>{roleplayMode ? 'وضع المحاكاة نشط 🎭' : 'تجربة لعب الأدوار (Roleplay)'}</span>
          </button>

          {/* Play Full Dialogue Button */}
          <button
            onClick={playEntireDialogue}
            disabled={!selectedDialogue || playingIndex !== null}
            className="px-4 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition flex items-center gap-1.5 shadow-lg shadow-emerald-500/20 disabled:opacity-50"
          >
            <Play className="w-3.5 h-3.5 fill-current" />
            <span>تشغيل الحوار كاملاً 🔊</span>
          </button>
        </div>
      </div>

      {loading ? (
        <div className="text-center py-20 text-slate-500 text-xs">جاري تحميل الحوارات اليومية...</div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Situations List Column */}
          <div className="space-y-2">
            <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">
              اختر الموقف الحياتي:
            </div>
            {dialogues.map((d) => (
              <button
                key={d.id}
                onClick={() => {
                  setSelectedDialogue(d);
                  setRevealedRoles({});
                  setPlayingIndex(null);
                }}
                className={`w-full text-right p-4 rounded-2xl border transition text-xs flex flex-col justify-between ${
                  selectedDialogue?.id === d.id
                    ? 'bg-emerald-500/15 border-emerald-500 text-emerald-300 shadow-lg shadow-emerald-500/10 ring-1 ring-emerald-500/30'
                    : 'bg-slate-900 border-slate-800 text-slate-300 hover:border-slate-700'
                }`}
              >
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-lg">{d.icon}</span>
                  <span className="font-bold text-white text-sm leading-snug">{d.titleDe.split(':')[0]}</span>
                </div>
                <div className="text-slate-400 font-arabic text-[11px] mb-2">{d.titleAr.split(':')[0]}</div>
                <div className="flex items-center justify-between text-[10px] text-slate-500 font-mono border-t border-slate-800/80 pt-2">
                  <span>CEFR {d.cefrLevel}</span>
                  <span className="text-emerald-400 font-sans">تدرّب الآن ⬅</span>
                </div>
              </button>
            ))}
          </div>

          {/* Dialogue Theater Content */}
          {selectedDialogue && (
            <div className="lg:col-span-3 space-y-6">
              {/* Situation Card */}
              <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 shadow-xl space-y-6">
                <div className="border-b border-slate-800 pb-4">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xl">{selectedDialogue.icon}</span>
                    <span className="text-xs uppercase font-bold px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                      {selectedDialogue.cefrLevel} Alltagsdialog
                    </span>
                  </div>
                  <h3 className="text-2xl font-extrabold text-white">{selectedDialogue.titleDe}</h3>
                  <div className="text-sm font-bold text-emerald-400 font-arabic mt-0.5">
                    {selectedDialogue.titleAr}
                  </div>
                  <p className="text-xs text-slate-400 font-arabic mt-2 bg-slate-950 p-3 rounded-xl border border-slate-800/80">
                    💡 <span className="font-bold text-slate-300">سياق الموقف:</span> {selectedDialogue.situation}
                  </p>
                </div>

                {/* Conversation Turns Chat Bubbles */}
                <div className="space-y-4">
                  {selectedDialogue.turns.map((turn, idx) => {
                    const isEven = idx % 2 === 0;
                    const isPlaying = playingIndex === idx;
                    const isHiddenForRoleplay = roleplayMode && !isEven && !revealedRoles[idx];

                    return (
                      <div
                        key={idx}
                        className={`flex gap-3 ${isEven ? 'justify-start' : 'justify-end'}`}
                      >
                        {isEven && (
                          <div className="w-10 h-10 rounded-2xl bg-slate-800 border border-slate-700 flex items-center justify-center text-xl shrink-0">
                            {turn.avatar}
                          </div>
                        )}

                        <div
                          className={`max-w-xl p-4 rounded-3xl border transition ${
                            isPlaying
                              ? 'ring-2 ring-emerald-400 shadow-lg shadow-emerald-500/20'
                              : ''
                          } ${
                            isEven
                              ? 'bg-slate-950 border-slate-800 text-slate-100 rounded-tl-sm'
                              : 'bg-emerald-950/30 border-emerald-500/40 text-emerald-100 rounded-tr-sm'
                          }`}
                        >
                          <div className="flex items-center justify-between gap-3 mb-1.5 text-xs font-semibold">
                            <span className={isEven ? 'text-indigo-400' : 'text-emerald-400'}>
                              {turn.speaker} • <span className="text-[10px] text-slate-400 font-arabic">{turn.speakerRole}</span>
                            </span>
                            <button
                              onClick={() => playTurnAudio(turn, idx)}
                              className="p-1 rounded-lg text-slate-400 hover:text-white transition"
                              title="استمع لهذه العبارة"
                            >
                              <Volume2 className={`w-3.5 h-3.5 ${isPlaying ? 'text-emerald-400 animate-bounce' : ''}`} />
                            </button>
                          </div>

                          {/* German Text */}
                          {isHiddenForRoleplay ? (
                            <div className="py-2">
                              <div className="text-xs text-amber-300/80 font-arabic mb-2">
                                🎭 دورك في التحدث! حاول قول الجملة الألمانية المناسبة بصوتك قبل الكشف:
                              </div>
                              <button
                                onClick={() => setRevealedRoles((prev) => ({ ...prev, [idx]: true }))}
                                className="px-3 py-1.5 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 text-amber-400 border border-amber-500/30 text-xs font-semibold flex items-center gap-1.5 transition"
                              >
                                <Eye className="w-3.5 h-3.5" /> اكشف إجابة الحوار
                              </button>
                            </div>
                          ) : (
                            <div className="text-sm sm:text-base font-medium leading-relaxed">
                              {turn.textDe}
                            </div>
                          )}

                          {/* Arabic Translation */}
                          {showArabic && !isHiddenForRoleplay && (
                            <div className="pt-2 mt-2 border-t border-slate-800/80 text-xs font-arabic text-slate-400 leading-relaxed">
                              {turn.textAr}
                            </div>
                          )}
                        </div>

                        {!isEven && (
                          <div className="w-10 h-10 rounded-2xl bg-emerald-900/40 border border-emerald-500/30 flex items-center justify-center text-xl shrink-0">
                            {turn.avatar}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>

                {/* Key Chunks & Idioms in this Dialogue */}
                {selectedDialogue.keyChunks?.length > 0 && (
                  <div className="pt-6 border-t border-slate-800 space-y-3">
                    <h4 className="text-base font-bold text-white flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-amber-400" /> أهم التعبيرات اليومية في هذا الموقف (Wichtige Chunks)
                    </h4>
                    <p className="text-xs text-slate-400 font-arabic">
                      تعبيرات ألمانية جاهزة تستخدم دائماً في مثل هذا الموقف دون تغيير:
                    </p>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                      {selectedDialogue.keyChunks.map((chunk, cIdx) => (
                        <div
                          key={cIdx}
                          className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 flex items-start justify-between gap-3 text-xs"
                        >
                          <div className="space-y-1">
                            <div className="font-bold text-sm text-emerald-300 font-mono">
                              {chunk.de}
                            </div>
                            <div className="text-slate-300 font-arabic font-medium">{chunk.ar}</div>
                            <div className="text-[11px] text-slate-500 font-arabic">{chunk.context}</div>
                          </div>
                          <button
                            onClick={() => speechService.speakGerman(chunk.de, 0.85)}
                            className="p-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-emerald-400 border border-slate-800 transition"
                            title="استمع للتعبير"
                          >
                            <Volume2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ))}
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
