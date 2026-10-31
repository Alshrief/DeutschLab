import { useState, useEffect } from 'react';
import {
  Wifi,
  WifiOff,
  BookOpen,
  Cpu,
  ScanLine,
  Mic,
  Award,
  ShieldCheck,
  Flame,
  Zap,
  Sparkles,
  MessageSquare,
  Headphones,
  BookMarked,
  TrendingUp,
  Trophy,
  FileText,
} from 'lucide-react';
import type { AiConnectionStatus, CefrLevel } from './types/index.js';

// Component Views
import { A0FoundationsView } from './components/A0FoundationsView.js';
import { StudyPlanView } from './components/StudyPlanView.js';
import { VocabFactoryView } from './components/VocabFactoryView.js';
import { BrutalGrammarView } from './components/BrutalGrammarView.js';
import { MilestoneStoriesView } from './components/MilestoneStoriesView.js';
import { ScannerView } from './components/ScannerView.js';
import { ShadowingLabView } from './components/ShadowingLabView.js';
import { ExamSimulatorView } from './components/ExamSimulatorView.js';
import { AiProvidersView } from './components/AiProvidersView.js';
import { SecurityDashboardView } from './components/SecurityDashboardView.js';
import { AiTeacherDrawer } from './components/AiTeacherDrawer.js';
import { MobileScannerView } from './components/MobileScannerView.js';
import { RealLifeDialoguesView } from './components/RealLifeDialoguesView.js';
import { DiktatView } from './components/DiktatView.js';
import { ProgressDashboardView } from './components/ProgressDashboardView.js';
import { ChunksAndVerbsView } from './components/ChunksAndVerbsView.js';
import { SprachArenaView } from './components/SprachArenaView.js';
import { BriefMeisterView } from './components/BriefMeisterView.js';
import { LanguageSelector } from './components/LanguageSelector.js';
import { useI18n } from './i18n/I18nContext.js';
import { speechService, type VoiceGender } from './utils/speechService.js';

type TabType =
  | 'a0'
  | 'study'
  | 'vocab'
  | 'grammar'
  | 'stories'
  | 'dialogues'
  | 'diktat'
  | 'chunks'
  | 'arena'
  | 'brief'
  | 'dashboard'
  | 'scanner'
  | 'shadowing'
  | 'exam'
  | 'providers'
  | 'security';

export function App() {
  const { t, dir } = useI18n();
  const [activeTab, setActiveTab] = useState<TabType>('study');
  const [cefrLevel, setCefrLevel] = useState<CefrLevel>('A1');
  const [aiStatus, setAiStatus] = useState<AiConnectionStatus>('No AI Key');
  const [connectedProviderName, setConnectedProviderName] = useState<string>('');
  const [latency, setLatency] = useState<number | null>(null);
  const [streakDays] = useState(3);
  const [totalXp] = useState(240);
  const [voiceGender, setVoiceGender] = useState<VoiceGender>(() => speechService.getDefaultGender());

  const handleVoiceGenderChange = (gender: VoiceGender) => {
    speechService.setDefaultGender(gender);
    setVoiceGender(gender);
    speechService.speakGerman(
      gender === 'female' ? 'Weibliche Stimme aktiviert.' : 'Männliche Stimme aktiviert.',
      0.9,
      gender
    );
  };

  // Dedicated Mobile Scanner Fullscreen Route
  const [isMobileScannerMode, setIsMobileScannerMode] = useState<boolean>(() => {
    const params = new URLSearchParams(window.location.search);
    return params.get('mode') === 'scanner' || params.has('token');
  });
  const [mobileToken, setMobileToken] = useState<string>(() => {
    return new URLSearchParams(window.location.search).get('token') || '';
  });

  useEffect(() => {
    const checkParams = () => {
      const params = new URLSearchParams(window.location.search);
      if (params.get('mode') === 'scanner' || params.has('token')) {
        setIsMobileScannerMode(true);
        setMobileToken(params.get('token') || '');
      }
    };
    window.addEventListener('popstate', checkParams);
    return () => window.removeEventListener('popstate', checkParams);
  }, []);

  useEffect(() => {
    const checkStatus = async () => {
      try {
        const start = performance.now();
        const res = await fetch('/api/health');
        const data = await res.json();
        const ping = Math.round(performance.now() - start);
        setLatency(ping);

        if (data.status === 'healthy') {
          // Probe actual AI providers to verify if any real key is configured
          try {
            const pRes = await fetch('/api/providers');
            const providers = await pRes.json();
            const activeDefault = providers.find((p: any) => p.isDefault && p.hasApiKey && p.isActive);
            const anyActive = providers.find((p: any) => p.hasApiKey && p.isActive);
            const chosen = activeDefault || anyActive;

            if (chosen) {
              setAiStatus('AI Connected');
              setConnectedProviderName(chosen.name || chosen.providerType);
              if (chosen.latencyMs) setLatency(chosen.latencyMs);
            } else {
              setAiStatus('No AI Key');
              setConnectedProviderName('');
            }
          } catch {
            setAiStatus('No AI Key');
            setConnectedProviderName('');
          }
        } else {
          setAiStatus('API Error');
        }
      } catch {
        setAiStatus('Offline Mode');
        setLatency(null);
      }
    };

    checkStatus();
    const interval = setInterval(checkStatus, 15000);
    return () => clearInterval(interval);
  }, []);

  const handleLevelChange = (lvl: CefrLevel) => {
    setCefrLevel(lvl);
    if (lvl === 'A0') {
      setActiveTab('a0');
    } else if (activeTab === 'a0') {
      setActiveTab('study');
    }
  };

  // If user opened mobile camera scanner mode (via QR scan or button)
  if (isMobileScannerMode) {
    return (
      <MobileScannerView
        token={mobileToken}
        onBack={() => {
          setIsMobileScannerMode(false);
          const url = new URL(window.location.href);
          url.search = '';
          window.history.replaceState({}, '', url.toString());
        }}
      />
    );
  }

  return (
    <div dir={dir} className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-['Plus_Jakarta_Sans',sans-serif]">
      {/* Top Header */}
      <header className="border-b border-slate-800/80 bg-slate-900/80 backdrop-blur sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-3 sm:px-4">
          {/* Main Top Row */}
          <div className="h-14 sm:h-16 flex items-center justify-between gap-2 sm:gap-4">
            {/* Logo & Platform Info */}
            <div className="flex items-center gap-2.5 sm:gap-3 shrink-0">
              <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-purple-600 flex items-center justify-center font-extrabold text-white text-base sm:text-lg shadow-md shadow-blue-500/20">
                DE
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="font-extrabold text-base sm:text-lg tracking-tight bg-gradient-to-r from-white via-slate-100 to-slate-400 bg-clip-text text-transparent">
                    DeutschLab
                  </span>
                  <span className="text-[9px] sm:text-[10px] font-bold uppercase tracking-wider bg-blue-500/10 text-blue-400 border border-blue-500/20 px-1.5 py-0.5 rounded-md">
                    A0-B2
                  </span>
                </div>
                <p className="hidden md:block text-[11px] text-slate-400 leading-none mt-0.5">
                  {t('app_subtitle', 'Modern German Learning Platform (A0 - B2)')}
                </p>
              </div>
            </div>

            {/* Desktop & Tablet Header Controls */}
            <div className="flex items-center gap-1.5 sm:gap-2.5">
              {/* Desktop CEFR Level Selector */}
              <div className="hidden lg:flex items-center bg-slate-950 border border-slate-800 rounded-xl p-0.5 text-xs">
                {(['A0', 'A1', 'A2', 'B1', 'B2'] as CefrLevel[]).map((lvl) => (
                  <button
                    key={lvl}
                    onClick={() => handleLevelChange(lvl)}
                    className={`px-2 py-1 rounded-lg font-bold transition text-xs ${
                      cefrLevel === lvl
                        ? 'bg-blue-600 text-white shadow-sm'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    {lvl}
                  </button>
                ))}
              </div>

              {/* Language Selector Dropdown */}
              <LanguageSelector />

              {/* Voice Gender Switcher */}
              <div className="flex items-center bg-slate-950 border border-slate-800 rounded-xl p-0.5 text-xs">
                <button
                  onClick={() => handleVoiceGenderChange('female')}
                  title={t('voice_female_title', 'Natural German Female Voice (Katja)')}
                  className={`flex items-center gap-1 px-2 sm:px-2.5 py-1 rounded-lg font-bold transition text-xs ${
                    voiceGender === 'female'
                      ? 'bg-gradient-to-r from-pink-600 to-rose-600 text-white shadow-sm'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <span>👩</span>
                  <span className="hidden sm:inline">{t('voice_female', 'أنثوي')}</span>
                </button>
                <button
                  onClick={() => handleVoiceGenderChange('male')}
                  title={t('voice_male_title', 'Natural German Male Voice (Conrad)')}
                  className={`flex items-center gap-1 px-2 sm:px-2.5 py-1 rounded-lg font-bold transition text-xs ${
                    voiceGender === 'male'
                      ? 'bg-gradient-to-r from-blue-600 to-cyan-600 text-white shadow-sm'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <span>👨</span>
                  <span className="hidden sm:inline">{t('voice_male', 'ذكوري')}</span>
                </button>
              </div>

              {/* Streak & XP (Medium+ screens) */}
              <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-xs shrink-0">
                <span className="flex items-center gap-1 text-amber-400 font-bold">
                  <Flame className="w-3.5 h-3.5 fill-amber-400" /> {streakDays}{t('streak_days', 'd')}
                </span>
                <span className="text-slate-600">•</span>
                <span className="text-blue-400 font-mono font-semibold">{totalXp} XP</span>
              </div>

              {/* AI Status Badge (Desktop & Tablet) */}
              {aiStatus === 'AI Connected' ? (
                <button
                  onClick={() => setActiveTab('providers')}
                  title={t('tab_providers', 'AI Providers')}
                  className="hidden sm:flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-xs font-medium border backdrop-blur transition-all bg-emerald-500/10 border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/20 shrink-0"
                >
                  <Wifi className="w-3.5 h-3.5 animate-pulse text-emerald-400" />
                  <span className="hidden md:inline">{t('ai_connected', 'Connected')} ({connectedProviderName || 'Active'})</span>
                  <span className="md:hidden">{t('ai_connected', 'Connected')}</span>
                  {latency !== null && (
                    <span className="text-[10px] opacity-75 font-mono">({latency}ms)</span>
                  )}
                </button>
              ) : aiStatus === 'No AI Key' ? (
                <button
                  onClick={() => setActiveTab('providers')}
                  title={t('tab_providers', 'AI Providers')}
                  className="hidden sm:flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-xs font-medium border backdrop-blur transition-all bg-amber-500/10 border-amber-500/30 text-amber-300 hover:bg-amber-500/20 group shrink-0"
                >
                  <Cpu className="w-3.5 h-3.5 text-amber-400 group-hover:scale-110 transition-transform" />
                  <span className="font-semibold text-xs">{t('ai_no_key', 'No API Key')}</span>
                  {latency !== null && (
                    <span className="text-[10px] text-slate-400 font-mono hidden md:inline">• {t('server_ping', 'Server')}: {latency}ms</span>
                  )}
                </button>
              ) : (
                <button
                  onClick={() => setActiveTab('providers')}
                  className="hidden sm:flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-xs font-medium border backdrop-blur bg-slate-800/60 border-slate-700 text-slate-400 shrink-0"
                >
                  <WifiOff className="w-3.5 h-3.5" />
                  <span>{t('ai_offline', 'Offline')}</span>
                </button>
              )}
            </div>
          </div>

          {/* Mobile Secondary Toolbar (Visible on screens < lg) */}
          <div className="flex lg:hidden items-center justify-between border-t border-slate-800/60 py-2 gap-2 overflow-x-auto scrollbar-none">
            {/* Mobile CEFR Level Pills */}
            <div className="flex items-center bg-slate-950 border border-slate-800 rounded-lg p-0.5 text-xs shrink-0">
              {(['A0', 'A1', 'A2', 'B1', 'B2'] as CefrLevel[]).map((lvl) => (
                <button
                  key={lvl}
                  onClick={() => handleLevelChange(lvl)}
                  className={`px-2 py-0.5 rounded font-bold text-xs transition ${
                    cefrLevel === lvl
                      ? 'bg-blue-600 text-white shadow-sm'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  {lvl}
                </button>
              ))}
            </div>

            {/* Mobile Streak & AI Status */}
            <div className="flex items-center gap-2 shrink-0">
              <span className="flex sm:hidden items-center gap-1 text-amber-400 font-bold text-xs bg-slate-950 px-2 py-1 rounded-lg border border-slate-800">
                <Flame className="w-3.5 h-3.5 fill-amber-400" /> {streakDays}{t('streak_days', 'd')}
              </span>

              {aiStatus === 'AI Connected' ? (
                <button
                  onClick={() => setActiveTab('providers')}
                  className="flex sm:hidden items-center gap-1 px-2 py-1 rounded-lg text-xs font-medium bg-emerald-500/10 border border-emerald-500/30 text-emerald-400"
                >
                  <Wifi className="w-3 h-3 animate-pulse" />
                  <span>{t('ai_connected', 'Connected')}</span>
                </button>
              ) : (
                <button
                  onClick={() => setActiveTab('providers')}
                  className="flex sm:hidden items-center gap-1 px-2 py-1 rounded-lg text-xs font-medium bg-amber-500/10 border border-amber-500/30 text-amber-300"
                >
                  <Cpu className="w-3 h-3 text-amber-400" />
                  <span>{t('ai_no_key', 'No API Key')}</span>
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Modular Navigation Tabs Bar */}
        <div className="max-w-7xl mx-auto px-2 sm:px-4 border-t border-slate-800/60 overflow-x-auto flex items-center gap-1.5 scrollbar-thin py-2">
          {[
            { id: 'dashboard', label: t('tab_dashboard', 'Progress & Analytics'), icon: TrendingUp },
            { id: 'arena', label: t('tab_arena', 'Practice Arena'), icon: Trophy },
            { id: 'brief', label: t('tab_brief', 'Letter & Email'), icon: FileText },
            { id: 'dialogues', label: t('tab_dialogues', 'Daily Dialogues'), icon: MessageSquare },
            { id: 'diktat', label: t('tab_diktat', 'Dictation (Diktat)'), icon: Headphones },
            { id: 'chunks', label: t('tab_chunks', 'Phrases & Verbs'), icon: BookMarked },
            { id: 'a0', label: t('tab_a0', 'A0 Foundations'), icon: Sparkles },
            { id: 'study', label: t('tab_study', 'Daily Study Plan'), icon: Zap },
            { id: 'vocab', label: t('tab_vocab', 'Vocabulary'), icon: BookOpen },
            { id: 'grammar', label: t('tab_grammar', 'Grammar Rules'), icon: Award },
            { id: 'stories', label: t('tab_stories', 'Reading Stories'), icon: BookOpen },
            { id: 'scanner', label: t('tab_scanner', 'Text Scanner'), icon: ScanLine },
            { id: 'shadowing', label: t('tab_shadowing', 'Shadowing Lab'), icon: Mic },
            { id: 'exam', label: t('tab_exam', 'Exam Simulator'), icon: Award },
            { id: 'providers', label: t('tab_providers', 'AI Providers'), icon: Cpu },
            { id: 'security', label: t('tab_security', 'Data & Backup'), icon: ShieldCheck },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as TabType)}
                className={`whitespace-nowrap px-3 py-1.5 rounded-xl text-xs font-semibold transition flex items-center gap-1.5 shrink-0 ${
                  isActive
                    ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </header>

      {/* Main Content Area */}
      <main className="max-w-7xl mx-auto px-4 py-6 flex-1 w-full">
        {activeTab === 'dashboard' && <ProgressDashboardView />}
        {activeTab === 'arena' && <SprachArenaView />}
        {activeTab === 'brief' && <BriefMeisterView />}
        {activeTab === 'dialogues' && <RealLifeDialoguesView cefrLevel={cefrLevel} />}
        {activeTab === 'diktat' && <DiktatView />}
        {activeTab === 'chunks' && <ChunksAndVerbsView />}
        {activeTab === 'a0' && <A0FoundationsView />}
        {activeTab === 'study' && <StudyPlanView cefrLevel={cefrLevel} />}
        {activeTab === 'vocab' && <VocabFactoryView cefrLevel={cefrLevel} />}
        {activeTab === 'grammar' && <BrutalGrammarView cefrLevel={cefrLevel} />}
        {activeTab === 'stories' && <MilestoneStoriesView cefrLevel={cefrLevel} />}
        {activeTab === 'scanner' && <ScannerView />}
        {activeTab === 'shadowing' && <ShadowingLabView />}
        {activeTab === 'exam' && <ExamSimulatorView cefrLevel={cefrLevel} />}
        {activeTab === 'providers' && <AiProvidersView />}
        {activeTab === 'security' && <SecurityDashboardView />}
      </main>

      {/* Floating Personal AI Teacher Drawer */}
      <AiTeacherDrawer cefrLevel={cefrLevel} />

      {/* Footer */}
      <footer className="border-t border-slate-800/80 bg-slate-950 py-4 text-center text-xs text-slate-500">
        {t('footer_text', 'DeutschLab Architecture • Production Engine • Offline-First PWA • Strict Zero-Trust Security')}
      </footer>
    </div>
  );
}

export default App;
