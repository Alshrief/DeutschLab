import { useState, useEffect } from 'react';
import {
  Search,
  Plus,
  RefreshCw,
  Volume2,
  ChevronDown,
  ChevronUp,
  Layers,
  BookOpen,
  Download,
  Printer,
  Filter,
} from 'lucide-react';
import { speechService } from '../utils/speechService.js';

interface VocabFactoryViewProps {
  cefrLevel: string;
}

export function VocabFactoryView({ cefrLevel }: VocabFactoryViewProps) {
  const [items, setItems] = useState<any[]>([]);
  const [search, setSearch] = useState('');
  const [posFilter, setPosFilter] = useState<'ALL' | 'NOUN' | 'VERB' | 'ADJECTIVE'>('ALL');
  const [themeFilter, setThemeFilter] = useState<
    'ALL' | 'WOHNEN' | 'ESSEN' | 'GESUNDHEIT' | 'ARBEIT' | 'REISEN' | 'BILDUNG'
  >('ALL');
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [selectedVerbConjugation, setSelectedVerbConjugation] = useState<any | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isImporting, setIsImporting] = useState(false);
  const [showCheatSheet, setShowCheatSheet] = useState(false);
  const [topicInput, setTopicInput] = useState('');
  const [showGenModal, setShowGenModal] = useState(false);

  useEffect(() => {
    fetchVocab();
  }, [cefrLevel]);

  const fetchVocab = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/vocab?cefrLevel=${cefrLevel}`);
      const data = await res.json();
      setItems(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateBatch = async () => {
    setIsGenerating(true);
    try {
      const res = await fetch('/api/vocab/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          cefrLevel,
          topic: topicInput || 'Daily life and professional contexts',
          batchSize: 3,
        }),
      });
      if (res.ok) {
        setShowGenModal(false);
        setTopicInput('');
        fetchVocab();
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleRegenerateSentences = async (id: string) => {
    try {
      const res = await fetch(`/api/vocab/${id}/regenerate-sentences`, {
        method: 'POST',
      });
      if (res.ok) {
        fetchVocab();
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleImportWortliste = async () => {
    setIsImporting(true);
    try {
      const res = await fetch('/api/vocab/import-wortliste', { method: 'POST' });
      const data = await res.json();
      if (data.success) {
        alert(`تم بنجاح تحميل باقة مفردات جوته الرسمية! إجمالي الكلمات الآن: ${data.total}`);
        fetchVocab();
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsImporting(false);
    }
  };

  const playPronunciation = (text: string) => {
    speechService.speakGerman(text, 0.85);
  };

  const playArabicPronunciation = (text: string) => {
    speechService.speakArabic(text, 0.9);
  };

  const themeKeywords: Record<string, string[]> = {
    WOHNEN: ['haus', 'zimmer', 'küche', 'schlüssel', 'miete', 'wohnung', 'tisch', 'bett', 'sofa', 'nachbar', 'wohnen', 'balkon', 'منزل', 'غرفة', 'مطبخ', 'مفتاح', 'إيجار', 'سكن'],
    ESSEN: ['essen', 'trinken', 'brot', 'supermarkt', 'bestellen', 'lecker', 'restaurant', 'kaffee', 'suppe', 'kartoffel', 'obst', 'gemüse', 'طعام', 'خبز', 'أكل', 'شرب', 'سوبرماركت', 'لذيذ'],
    GESUNDHEIT: ['arzt', 'krankenhaus', 'kopf', 'medikament', 'apotheke', 'gesund', 'fieber', 'schmerzen', 'patient', 'untersuchen', 'طبيب', 'دواء', 'صحة', 'رأس', 'صيدلية', 'مستشفى'],
    ARBEIT: ['arbeit', 'beruf', 'kollege', 'vertrag', 'gehalt', 'kündigen', 'chef', 'bewerben', 'erfolg', 'verantwortung', 'verhandeln', 'عمل', 'مهنة', 'زميل', 'عقد', 'راتب', 'وظيفة'],
    REISEN: ['reise', 'bahnhof', 'auto', 'flughafen', 'fahrkarte', 'hotel', 'pünktlich', 'zug', 'fahren', 'gleis', 'verspätung', 'سفر', 'مطار', 'قطار', 'تذكرة', 'فندق', 'سيارة'],
    BILDUNG: ['lernen', 'universität', 'prüfung', 'buch', 'bestehen', 'schwierig', 'ausbildung', 'schule', 'sprache', 'verstehen', 'دراسة', 'جامعة', 'امتحان', 'كتاب', 'تعلم', 'لغة'],
  };

  const filteredItems = items.filter((item) => {
    const matchesSearch =
      item.word.toLowerCase().includes(search.toLowerCase()) ||
      item.arabicTranslation.includes(search) ||
      item.lemma.toLowerCase().includes(search.toLowerCase());

    const matchesPos = posFilter === 'ALL' || item.partOfSpeech === posFilter;

    let matchesTheme = true;
    if (themeFilter !== 'ALL') {
      const keywords = themeKeywords[themeFilter] || [];
      matchesTheme = keywords.some(
        (k) =>
          item.word.toLowerCase().includes(k) ||
          item.lemma.toLowerCase().includes(k) ||
          item.arabicTranslation.toLowerCase().includes(k)
      );
    }

    return matchesSearch && matchesPos && matchesTheme;
  });

  return (
    <div className="py-4 space-y-6">
      {/* Header & Controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-blue-400" /> مصنع المفردات ونظام الجمل الخمس (5-Sentences)
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            منع تكرار الـ Lemmas مع تصريفات الأفعال، تمييز أدوات التعريف بالألوان، و 5 جمل سياقية معربة لكل كلمة.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
            <input
              type="text"
              placeholder="ابحث عن كلمة ألمانية أو عربية..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 pr-4 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-200 placeholder:text-slate-500 focus:outline-none focus:border-blue-500 w-52 sm:w-64"
            />
          </div>

          <button
            onClick={() => setShowCheatSheet(true)}
            className="px-3 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 font-medium text-xs transition flex items-center gap-1.5"
            title="طباعة وتصدير ملخص الكلمات"
          >
            <Printer className="w-3.5 h-3.5 text-slate-400" />
            <span className="hidden sm:inline">ملخص المذاكرة</span>
          </button>

          <button
            onClick={handleImportWortliste}
            disabled={isImporting}
            className="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-medium text-xs transition flex items-center gap-1.5 shadow-md shadow-emerald-500/20 disabled:opacity-50"
          >
            <Download className="w-3.5 h-3.5" />
            <span>{isImporting ? 'جاري التحميل...' : 'باقة جوته الرسمية'}</span>
          </button>

          <button
            onClick={() => setShowGenModal(true)}
            className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-medium text-xs transition flex items-center gap-1.5 shadow-lg shadow-blue-500/20"
          >
            <Plus className="w-4 h-4" /> توليد بالـ AI
          </button>
        </div>
      </div>

      {/* Part of Speech Filter Chips */}
      <div className="flex flex-wrap items-center gap-2 border-b border-slate-800/80 pb-3 text-xs">
        <span className="text-slate-500 flex items-center gap-1">
          <Filter className="w-3.5 h-3.5" /> نوع الكلمة:
        </span>
        {[
          { id: 'ALL', label: `الكل (${items.length})` },
          { id: 'NOUN', label: `الأسماء (${items.filter((i) => i.partOfSpeech === 'NOUN').length})` },
          { id: 'VERB', label: `الأفعال (${items.filter((i) => i.partOfSpeech === 'VERB').length})` },
          { id: 'ADJECTIVE', label: `الصفات (${items.filter((i) => i.partOfSpeech === 'ADJECTIVE').length})` },
        ].map((chip) => (
          <button
            key={chip.id}
            onClick={() => setPosFilter(chip.id as any)}
            className={`px-3 py-1 rounded-lg font-semibold transition ${
              posFilter === chip.id
                ? 'bg-blue-600/20 text-blue-400 border border-blue-500/30'
                : 'text-slate-400 hover:text-white bg-slate-900 border border-slate-800'
            }`}
          >
            {chip.label}
          </button>
        ))}
      </div>

      {/* Thematic Life Topics Filter Chips */}
      <div className="flex flex-wrap items-center gap-2 border-b border-slate-800/80 pb-3 text-xs">
        <span className="text-slate-500 flex items-center gap-1">
          <Layers className="w-3.5 h-3.5" /> مواضيع الحياة اليومية:
        </span>
        {[
          { id: 'ALL', label: 'كل المواضيع' },
          { id: 'WOHNEN', label: '🏠 السكن والمنزل' },
          { id: 'ESSEN', label: '🍽️ الطعام والتسوق' },
          { id: 'GESUNDHEIT', label: '🏥 الصحة والطب' },
          { id: 'ARBEIT', label: '💼 العمل والمهن' },
          { id: 'REISEN', label: '🚆 السفر والمواصلات' },
          { id: 'BILDUNG', label: '🎓 التعليم والدراسة' },
        ].map((t) => (
          <button
            key={t.id}
            onClick={() => setThemeFilter(t.id as any)}
            className={`px-3 py-1 rounded-lg font-semibold transition ${
              themeFilter === t.id
                ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                : 'text-slate-400 hover:text-white bg-slate-900 border border-slate-800'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Generation Modal */}
      {showGenModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 max-w-md w-full shadow-2xl animate-scaleUp">
            <h3 className="text-lg font-bold text-white mb-2">توليد مفردات جديدة بالذكاء الاصطناعي</h3>
            <p className="text-xs text-slate-400 mb-4">
              سيقوم النظام بتوليد كلمات للمستوى <span className="font-semibold text-blue-400">{cefrLevel}</span> مع التحقق من عدم تكرار أي Lemma سابقة في قاعدة البيانات.
            </p>
            <input
              type="text"
              placeholder="الموضوع (مثال: بالمستشفى، بالمطار، بالجامعة...)"
              value={topicInput}
              onChange={(e) => setTopicInput(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-200 mb-4 focus:outline-none focus:border-blue-500"
            />
            <div className="flex items-center justify-end gap-3">
              <button
                onClick={() => setShowGenModal(false)}
                className="px-4 py-2 rounded-xl text-xs text-slate-400 hover:text-white transition"
              >
                إلغاء
              </button>
              <button
                onClick={handleGenerateBatch}
                disabled={isGenerating}
                className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-medium text-xs transition flex items-center gap-2 disabled:opacity-50"
              >
                {isGenerating ? (
                  <>
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" /> جاري التوليد...
                  </>
                ) : (
                  'بدء التوليد'
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Vocabulary List */}
      {loading ? (
        <div className="py-20 text-center text-slate-500 text-xs">جاري تحميل المفردات...</div>
      ) : filteredItems.length === 0 ? (
        <div className="py-16 text-center text-slate-500 text-xs bg-slate-900/40 rounded-2xl border border-slate-800">
          لا توجد كلمات مطابقة. اضغط على "توليد دفعة AI جديدة" لإضافة مفردات.
        </div>
      ) : (
        <div className="space-y-4">
          {filteredItems.map((item) => {
            const isExpanded = expandedId === item.id;
            return (
              <div
                key={item.id}
                className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 hover:border-slate-700/80 transition shadow-sm"
              >
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    {/* Gender color pill */}
                    {item.article && item.article !== 'NONE' && (
                      <span
                        className={`text-xs font-bold px-2.5 py-1 rounded-lg border ${
                          item.article === 'DER'
                            ? 'text-blue-400 bg-blue-500/10 border-blue-500/30'
                            : item.article === 'DIE'
                            ? 'text-rose-400 bg-rose-500/10 border-rose-500/30'
                            : 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30'
                        }`}
                      >
                        {item.article.toLowerCase()}
                      </span>
                    )}

                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="text-lg font-bold text-white tracking-tight">{item.word}</h3>
                        <button
                          onClick={() => playPronunciation(item.word)}
                          className="p-1 rounded-md text-slate-400 hover:text-blue-400 transition"
                          title="استمع للنطق"
                        >
                          <Volume2 className="w-4 h-4" />
                        </button>
                      </div>
                      <div className="flex items-center gap-3 text-xs text-slate-400 mt-0.5">
                        <div className="flex items-center gap-1.5">
                          <span className="text-emerald-400 font-arabic font-semibold text-sm">
                            {item.arabicTranslation}
                          </span>
                          <button
                            onClick={() => playArabicPronunciation(item.arabicTranslation)}
                            className="p-1 rounded-md text-slate-500 hover:text-emerald-400 transition"
                            title="استمع للنطق العربي"
                          >
                            <Volume2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                        {item.plural && (
                          <span className="text-amber-400/80 font-mono text-[11px]">
                            الجمع: {item.plural}
                          </span>
                        )}
                        <span className="text-slate-500 text-[11px] font-mono">
                          Lemma: {item.lemma}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    {item.verbConjugations && (
                      <button
                        onClick={() => {
                          try {
                            const conj = typeof item.verbConjugations === 'string' ? JSON.parse(item.verbConjugations) : item.verbConjugations;
                            setSelectedVerbConjugation({ word: item.word, ...conj, cases: item.governingCases });
                          } catch {
                            // ignore
                          }
                        }}
                        className="px-2.5 py-1 rounded-xl bg-purple-500/10 hover:bg-purple-500/20 border border-purple-500/30 text-purple-400 text-xs font-medium transition"
                      >
                        تصريف الفعل
                      </button>
                    )}
                    <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-slate-800 text-slate-400">
                      {item.cefrLevel}
                    </span>
                    <button
                      onClick={() => setExpandedId(isExpanded ? null : item.id)}
                      className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs text-slate-300 font-medium transition flex items-center gap-1.5"
                    >
                      <Layers className="w-3.5 h-3.5 text-blue-400" />
                      الجمل الـ 5 ({item.sentenceHistories?.length || 0})
                      {isExpanded ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                    </button>
                  </div>
                </div>

                {/* 5-Sentences Drawer */}
                {isExpanded && (
                  <div className="mt-5 pt-5 border-t border-slate-800/80 animate-fadeIn">
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                        قاعدة الجمل الخمس والسياق النحوي (The 5-Sentence System)
                      </span>
                      <button
                        onClick={() => handleRegenerateSentences(item.id)}
                        className="text-xs text-blue-400 hover:text-blue-300 flex items-center gap-1 transition"
                      >
                        <RefreshCw className="w-3 h-3" /> إعادة توليد جمل جديدة (حفظ السابق)
                      </button>
                    </div>

                    <div className="space-y-2.5">
                      {item.sentenceHistories?.map((s: any, idx: number) => {
                        let breakdownObj: any = {};
                        try {
                          breakdownObj =
                            typeof s.grammaticalBreakdown === 'string'
                              ? JSON.parse(s.grammaticalBreakdown)
                              : s.grammaticalBreakdown;
                        } catch {
                          breakdownObj = {};
                        }

                        return (
                          <div
                            key={s.id || idx}
                            className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800/80 hover:border-slate-700 transition"
                          >
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                <span className="w-5 h-5 rounded-full bg-blue-500/10 text-blue-400 text-xs font-bold flex items-center justify-center font-mono">
                                  {idx + 1}
                                </span>
                                <span className="text-sm font-semibold text-slate-100">
                                  {s.sentenceDe}
                                </span>
                              </div>
                              <button
                                onClick={() => playPronunciation(s.sentenceDe)}
                                className="p-1 text-slate-500 hover:text-blue-400 transition"
                              >
                                <Volume2 className="w-3.5 h-3.5" />
                              </button>
                            </div>

                            <div className="flex items-center gap-2 text-xs font-arabic text-emerald-400/90 mt-1 pl-7">
                              <span>{s.sentenceAr}</span>
                              <button
                                onClick={() => playArabicPronunciation(s.sentenceAr)}
                                className="p-0.5 text-slate-500 hover:text-emerald-400 transition"
                                title="استمع للنطق العربي"
                              >
                                <Volume2 className="w-3 h-3" />
                              </button>
                            </div>

                            {/* Grammatical Breakdown tags */}
                            {Object.keys(breakdownObj).length > 0 && (
                              <div className="pl-7 mt-2 flex flex-wrap gap-2 text-[11px]">
                                {Object.entries(breakdownObj).map(([k, v]) => (
                                  <span
                                    key={k}
                                    className="px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-slate-400"
                                  >
                                    <span className="text-slate-500">{k}:</span> {String(v)}
                                  </span>
                                ))}
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Verb Conjugation Matrix Modal */}
      {selectedVerbConjugation && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 max-w-lg w-full shadow-2xl animate-scaleUp space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div>
                <span className="text-[10px] text-purple-400 font-mono uppercase font-bold">مصفوفة تصريف الأفعال الألمانية</span>
                <h3 className="text-xl font-bold text-white tracking-tight">{selectedVerbConjugation.word}</h3>
              </div>
              <button
                onClick={() => setSelectedVerbConjugation(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            {/* Präsens Grid */}
            <div>
              <span className="text-xs font-bold text-blue-400 block mb-2">المضارع (Präsens):</span>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs">
                {selectedVerbConjugation.present &&
                  Object.entries(selectedVerbConjugation.present).map(([pronoun, form]) => (
                    <div key={pronoun} className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 flex justify-between">
                      <span className="text-slate-500 font-mono">{pronoun}</span>
                      <span className="font-bold text-white font-mono">{String(form)}</span>
                    </div>
                  ))}
              </div>
            </div>

            {/* Perfekt & Präteritum */}
            <div className="grid grid-cols-2 gap-3 pt-2">
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                <span className="text-[10px] text-slate-500 block">الماضي التام (Perfekt):</span>
                <span className="text-xs font-bold text-emerald-400 font-mono mt-1 block">
                  {selectedVerbConjugation.auxiliary ? `${selectedVerbConjugation.auxiliary} + ` : ''}
                  {selectedVerbConjugation.perfekt || '—'}
                </span>
              </div>

              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                <span className="text-[10px] text-slate-500 block">الماضي البسيط (Präteritum):</span>
                <span className="text-xs font-bold text-amber-400 font-mono mt-1 block">
                  {selectedVerbConjugation.prateritum?.ich || selectedVerbConjugation.prateritum || '—'}
                </span>
              </div>
            </div>

            {/* Governing Cases */}
            {selectedVerbConjugation.cases && (
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs">
                <span className="text-[10px] text-slate-500 block mb-1">حالات الإعراب وحروف الجر المطلوبة:</span>
                <div className="flex flex-wrap gap-1.5">
                  {(typeof selectedVerbConjugation.cases === 'string'
                    ? JSON.parse(selectedVerbConjugation.cases)
                    : selectedVerbConjugation.cases
                  ).map((c: string, idx: number) => (
                    <span key={idx} className="px-2 py-0.5 rounded bg-purple-500/10 text-purple-400 border border-purple-500/20 font-mono">
                      {c}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Printable / Exportable Vocabulary Cheat Sheet Modal */}
      {showCheatSheet && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 max-w-3xl w-full max-h-[85vh] flex flex-col shadow-2xl animate-scaleUp">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4 mb-4">
              <div>
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <Printer className="w-4 h-4 text-emerald-400" /> ملخص مراجعة المفردات للمستوى ({cefrLevel})
                </h3>
                <p className="text-xs text-slate-400">
                  قائمة تلخيصية بأدوات التعريف، صيغ الجمع، والترجمة العربية للمذاكرة السريعة.
                </p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => window.print()}
                  className="px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs transition"
                >
                  🖨️ طباعة
                </button>
                <button
                  onClick={() => setShowCheatSheet(false)}
                  className="px-3.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs transition"
                >
                  إغلاق
                </button>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto space-y-3 pr-1 scrollbar-thin">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {filteredItems.map((item) => (
                  <div
                    key={item.id}
                    className="p-3 rounded-2xl bg-slate-950 border border-slate-800/80 flex items-start justify-between text-xs"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span
                          className={`font-bold ${
                            item.article === 'DER'
                              ? 'text-blue-400'
                              : item.article === 'DIE'
                              ? 'text-rose-400'
                              : item.article === 'DAS'
                              ? 'text-emerald-400'
                              : 'text-slate-200'
                          }`}
                        >
                          {item.word}
                        </span>
                        {item.plural && (
                          <span className="text-[10px] text-slate-500 font-mono">({item.plural})</span>
                        )}
                      </div>
                      <div className="text-slate-400 text-[11px] font-arabic mt-0.5">
                        {item.arabicTranslation}
                      </div>
                    </div>
                    <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-slate-400">
                      {item.partOfSpeech}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
