import { useState, useEffect } from 'react';
import {
  TrendingUp,
  Flame,
  Zap,
  BookOpen,
  Award,
  CheckCircle2,
  AlertCircle,
  BarChart3,
  Layers,
} from 'lucide-react';

export function ProgressDashboardView() {
  const [stats, setStats] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/content/stats');
      const data = await res.json();
      setStats(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  // Generate 28-day simulated activity heatmap
  const activityDays = Array.from({ length: 28 }, (_, i) => {
    const day = 28 - i;
    // Higher activity on recent days
    const level = i < 7 ? Math.min(4, Math.floor(Math.random() * 3) + 2) : Math.floor(Math.random() * 3);
    return { day, level };
  }).reverse();

  return (
    <div className="py-4 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs uppercase font-extrabold tracking-wider px-2 py-0.5 rounded bg-blue-500/10 text-blue-400 border border-blue-500/20">
              Fortschritts-Dashboard • لوحة الإنجاز
            </span>
          </div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-blue-400" /> لوحة متابعة تقدم المتعلم ونقاط الضعف
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            رصد بياني لمستواك في مفردات جوته، خريطة الاستمرارية اليومية (Streak Heatmap)، والتشخيص النحوي.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="px-4 py-2 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-400 font-bold text-xs flex items-center gap-2">
            <Flame className="w-4 h-4 fill-amber-400" />
            <span>3 أيام متواصلة</span>
          </div>
          <div className="px-4 py-2 rounded-2xl bg-blue-600/10 border border-blue-500/30 text-blue-400 font-bold text-xs font-mono">
            <span>240 XP</span>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="text-center py-20 text-slate-500 text-xs">جاري تحميل إحصائياتك...</div>
      ) : (
        <div className="space-y-6">
          {/* Top 4 KPI Metrics Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="p-5 rounded-3xl bg-slate-900 border border-slate-800 flex flex-col justify-between">
              <div className="text-[11px] text-slate-400 uppercase font-semibold flex items-center gap-1.5">
                <BookOpen className="w-4 h-4 text-blue-400" /> إجمالي المفردات النشطة
              </div>
              <div className="mt-3">
                <div className="text-3xl font-extrabold text-white font-mono">{stats?.totalVocab || 60}</div>
                <div className="text-[11px] text-emerald-400 mt-1 flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" /> 300 جملة سياقية معربة
                </div>
              </div>
            </div>

            <div className="p-5 rounded-3xl bg-slate-900 border border-slate-800 flex flex-col justify-between">
              <div className="text-[11px] text-slate-400 uppercase font-semibold flex items-center gap-1.5">
                <Zap className="w-4 h-4 text-amber-400" /> بطاقات مراجعة اليوم (FSRS)
              </div>
              <div className="mt-3">
                <div className="text-3xl font-extrabold text-amber-400 font-mono">
                  {stats?.fsrsDueCount ?? 8}
                </div>
                <div className="text-[11px] text-slate-400 mt-1">تكرار متباعد جاهز للمراجعة</div>
              </div>
            </div>

            <div className="p-5 rounded-3xl bg-slate-900 border border-slate-800 flex flex-col justify-between">
              <div className="text-[11px] text-slate-400 uppercase font-semibold flex items-center gap-1.5">
                <Layers className="w-4 h-4 text-purple-400" /> القواعد والصيغ المحفوظة
              </div>
              <div className="mt-3">
                <div className="text-3xl font-extrabold text-purple-400 font-mono">{stats?.grammarCount || 12}</div>
                <div className="text-[11px] text-slate-400 mt-1">صيغ بصرية مع تمارين تشخيصية</div>
              </div>
            </div>

            <div className="p-5 rounded-3xl bg-slate-900 border border-slate-800 flex flex-col justify-between">
              <div className="text-[11px] text-slate-400 uppercase font-semibold flex items-center gap-1.5">
                <Award className="w-4 h-4 text-emerald-400" /> القطع والحوارات الواقعية
              </div>
              <div className="mt-3">
                <div className="text-3xl font-extrabold text-emerald-400 font-mono">
                  {(stats?.storyCount || 12) + (stats?.dialoguesCount || 5)}
                </div>
                <div className="text-[11px] text-slate-400 mt-1">12 قطعة قراءة + 5 حوارات حية</div>
              </div>
            </div>
          </div>

          {/* CEFR Level Progress Breakdown */}
          <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-4">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-indigo-400" /> التوزيع المعجمي عبر مستويات الإطار الأوروبي (A1 → B2)
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
              {[
                { level: 'A1', name: 'الأساسيات اليومية', count: stats?.levelCounts?.A1 || 24, target: 40, color: 'blue' },
                { level: 'A2', name: 'المواقف والمشاوير', count: stats?.levelCounts?.A2 || 16, target: 35, color: 'emerald' },
                { level: 'B1', name: 'الحياة المهنية', count: stats?.levelCounts?.B1 || 12, target: 30, color: 'purple' },
                { level: 'B2', name: 'الكفاءة والطلاقة', count: stats?.levelCounts?.B2 || 8, target: 25, color: 'amber' },
              ].map((lvl) => {
                const percent = Math.min(100, Math.round((lvl.count / lvl.target) * 100));
                return (
                  <div key={lvl.level} className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-extrabold text-white text-base">{lvl.level}</span>
                      <span className="text-[11px] font-mono text-slate-400">
                        {lvl.count}/{lvl.target}
                      </span>
                    </div>
                    <div className="text-[11px] text-slate-400 font-arabic">{lvl.name}</div>
                    <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                      <div
                        className={`h-full transition-all duration-500 ${
                          lvl.color === 'blue'
                            ? 'bg-blue-500'
                            : lvl.color === 'emerald'
                            ? 'bg-emerald-500'
                            : lvl.color === 'purple'
                            ? 'bg-purple-500'
                            : 'bg-amber-500'
                        }`}
                        style={{ width: `${percent}%` }}
                      />
                    </div>
                    <div className="text-[10px] text-right font-mono text-slate-500">{percent}% إنجاز</div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Activity Heatmap (GitHub Contribution Grid) */}
          <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <Flame className="w-5 h-5 text-amber-400" /> خريطة الاستمرارية والنشاط اليومي (28 يوماً)
                </h3>
                <p className="text-xs text-slate-400">
                  كل مربع يمثل يوماً من أيام المذاكرة وممارسة اللغة؛ كلما كان اللون أدكن زاد عدد الكلمات والجمل المكتسبة.
                </p>
              </div>
              <div className="flex items-center gap-1.5 text-[10px] text-slate-400">
                <span>أقل</span>
                <span className="w-3 h-3 rounded bg-slate-800" />
                <span className="w-3 h-3 rounded bg-emerald-950 border border-emerald-800/40" />
                <span className="w-3 h-3 rounded bg-emerald-700" />
                <span className="w-3 h-3 rounded bg-emerald-500" />
                <span className="w-3 h-3 rounded bg-emerald-400" />
                <span>أكثر</span>
              </div>
            </div>

            {/* Heatmap Grid */}
            <div className="flex gap-2 justify-between overflow-x-auto p-4 rounded-2xl bg-slate-950 border border-slate-800/80">
              {activityDays.map((d, idx) => (
                <div key={idx} className="flex flex-col items-center gap-1.5 shrink-0">
                  <div
                    className={`w-7 h-7 rounded-lg transition-transform hover:scale-125 cursor-pointer ${
                      d.level === 0
                        ? 'bg-slate-800/70 border border-slate-700/30'
                        : d.level === 1
                        ? 'bg-emerald-950 border border-emerald-800/40'
                        : d.level === 2
                        ? 'bg-emerald-700'
                        : d.level === 3
                        ? 'bg-emerald-500'
                        : 'bg-emerald-400 shadow-md shadow-emerald-400/20'
                    }`}
                    title={`اليوم ${idx + 1}: نشاط تدريبي بمستوى ${d.level}`}
                  />
                  <span className="text-[9px] text-slate-500 font-mono">{idx + 1}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Grammar & Weakness Radar Diagnostic */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-4">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-emerald-400" /> نقاط القوة اللغوية المؤكدة (Stärken)
              </h3>
              <div className="space-y-3">
                <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800/80 flex items-center justify-between text-xs">
                  <div>
                    <div className="font-bold text-white">ترتيب الجملة الرئيسية (Hauptsatz Pos 2)</div>
                    <div className="text-slate-400 font-arabic text-[11px]">موضع الفعل المصرف في الموقع الثاني مضمون بنسبة 95%</div>
                  </div>
                  <span className="text-emerald-400 font-mono font-bold">95%</span>
                </div>
                <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800/80 flex items-center justify-between text-xs">
                  <div>
                    <div className="font-bold text-white">أدوات النفي (nicht vs kein)</div>
                    <div className="text-slate-400 font-arabic text-[11px]">التمييز السليم بين نفي الأسماء المنكرة والأفعال/الصفات</div>
                  </div>
                  <span className="text-emerald-400 font-mono font-bold">90%</span>
                </div>
                <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800/80 flex items-center justify-between text-xs">
                  <div>
                    <div className="font-bold text-white">الأفعال المنفصلة (Trennbare Verben)</div>
                    <div className="text-slate-400 font-arabic text-[11px]">إلقاء البادئة في نهاية الجملة بتلقائية</div>
                  </div>
                  <span className="text-emerald-400 font-mono font-bold">88%</span>
                </div>
              </div>
            </div>

            <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-4">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <AlertCircle className="w-5 h-5 text-amber-400" /> مجالات التركيز والتحسين (Fokusbereiche)
              </h3>
              <div className="space-y-3">
                <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800/80 flex items-center justify-between text-xs">
                  <div>
                    <div className="font-bold text-white">حروف الجر المشتركة (Wechselpräpositionen)</div>
                    <div className="text-slate-400 font-arabic text-[11px]">الخلط بين Akkusativ (حركة) و Dativ (سكون وموقع)</div>
                  </div>
                  <span className="text-amber-400 font-mono font-bold">62%</span>
                </div>
                <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800/80 flex items-center justify-between text-xs">
                  <div>
                    <div className="font-bold text-white">إعراب الصفات (Adjektivdeklination)</div>
                    <div className="text-slate-400 font-arabic text-[11px]">نهايات الصفات بعد أدوات المعرفة والنكرة</div>
                  </div>
                  <span className="text-amber-400 font-mono font-bold">58%</span>
                </div>
                <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800/80 flex items-center justify-between text-xs">
                  <div>
                    <div className="font-bold text-white">متلازمات الأسماء والأفعال B2 (Funktionsverbgefüge)</div>
                    <div className="text-slate-400 font-arabic text-[11px]">استخدام التراكيب الاصطلاحية الرسمية</div>
                  </div>
                  <span className="text-rose-400 font-mono font-bold">45%</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
