import React, { createContext, useContext, useState, useEffect } from 'react';
import { SUPPORTED_LANGUAGES, type SupportedLanguage, type LanguageInfo } from './types.js';
import { translations } from './translations.js';

interface I18nContextValue {
  lang: SupportedLanguage;
  setLang: (lang: SupportedLanguage) => void;
  t: (key: string, fallback?: string) => string;
  dir: 'rtl' | 'ltr';
  isRtl: boolean;
  currentLangInfo: LanguageInfo;
}

const I18nContext = createContext<I18nContextValue | null>(null);

export const I18nProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [lang, setLangState] = useState<SupportedLanguage>(() => {
    if (typeof localStorage !== 'undefined') {
      const saved = localStorage.getItem('deutschlab_lang') as SupportedLanguage;
      if (saved && translations[saved]) return saved;
    }
    return 'ar'; // Default to Arabic, user can switch to English, German, Chinese, etc.
  });

  const currentLangInfo =
    SUPPORTED_LANGUAGES.find((l) => l.code === lang) || SUPPORTED_LANGUAGES[0];
  const dir = currentLangInfo.dir;
  const isRtl = dir === 'rtl';

  useEffect(() => {
    if (typeof document !== 'undefined') {
      document.documentElement.lang = lang;
      document.documentElement.dir = dir;
    }
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem('deutschlab_lang', lang);
    }
  }, [lang, dir]);

  const setLang = (newLang: SupportedLanguage) => {
    if (translations[newLang]) {
      setLangState(newLang);
    }
  };

  const t = (key: string, fallback?: string): string => {
    const langDict = translations[lang];
    if (langDict && langDict[key]) {
      return langDict[key];
    }
    // Fallback to English
    if (translations.en && translations.en[key]) {
      return translations.en[key];
    }
    // Fallback to Arabic
    if (translations.ar && translations.ar[key]) {
      return translations.ar[key];
    }
    return fallback || key;
  };

  return (
    <I18nContext.Provider value={{ lang, setLang, t, dir, isRtl, currentLangInfo }}>
      {children}
    </I18nContext.Provider>
  );
};

export const useI18n = () => {
  const context = useContext(I18nContext);
  if (!context) {
    throw new Error('useI18n must be used within an I18nProvider');
  }
  return context;
};
