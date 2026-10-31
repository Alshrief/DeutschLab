import React, { useState, useRef, useEffect } from 'react';
import { Globe, Check, ChevronDown } from 'lucide-react';
import { useI18n } from '../i18n/I18nContext.js';
import { SUPPORTED_LANGUAGES, type SupportedLanguage } from '../i18n/types.js';

export const LanguageSelector: React.FC = () => {
  const { lang, setLang, currentLangInfo, isRtl, t } = useI18n();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = (code: SupportedLanguage) => {
    setLang(code);
    setIsOpen(false);
  };

  return (
    <div className="relative inline-block text-left" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        title={t('btn_select_lang', 'Language')}
        className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-xs font-semibold bg-slate-900 border border-slate-800 text-slate-200 hover:border-slate-700 hover:text-white transition shadow-sm"
      >
        <span className="text-sm">{currentLangInfo.flag}</span>
        <span className="font-medium hidden md:inline">{currentLangInfo.nativeName}</span>
        <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
      </button>

      {isOpen && (
        <div
          className={`absolute mt-2 w-52 max-w-[calc(100vw-2rem)] rounded-2xl bg-slate-900 border border-slate-800 shadow-2xl p-1.5 z-50 animate-in fade-in zoom-in-95 duration-100 ${
            isRtl ? 'left-0' : 'right-0'
          }`}
        >
          <div className="px-3 py-2 text-[11px] font-bold uppercase tracking-wider text-slate-400 border-b border-slate-800/80 flex items-center gap-1.5">
            <Globe className="w-3.5 h-3.5 text-blue-400" />
            <span>{t('btn_select_lang', 'Language')}</span>
          </div>
          <div className="py-1 max-h-72 overflow-y-auto space-y-0.5 scrollbar-thin">
            {SUPPORTED_LANGUAGES.map((l) => {
              const isSelected = l.code === lang;
              return (
                <button
                  key={l.code}
                  onClick={() => handleSelect(l.code)}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition text-left ${
                    isSelected
                      ? 'bg-blue-600/20 text-blue-400 border border-blue-500/30'
                      : 'text-slate-300 hover:bg-slate-800/70 hover:text-white'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <span className="text-base">{l.flag}</span>
                    <span className="font-semibold">{l.nativeName}</span>
                    <span className="text-[10px] text-slate-500 font-sans">({l.name})</span>
                  </div>
                  {isSelected && <Check className="w-3.5 h-3.5 text-blue-400" />}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
