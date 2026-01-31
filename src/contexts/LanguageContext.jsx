import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import en from '@/i18n/en';
import mr from '@/i18n/mr';

const STORAGE_KEY = 'precrime_lang';

const translations = { en, mr };

const LanguageContext = createContext(null);

export function LanguageProvider({ children }) {
  const [lang, setLangState] = useState(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored === 'en' || stored === 'mr') return stored;
    } catch (_) {}
    return null; // null = not chosen yet, show language chooser
  });

  const setLang = useCallback((value) => {
    if (value !== 'en' && value !== 'mr') return;
    setLangState(value);
    try {
      localStorage.setItem(STORAGE_KEY, value);
      if (typeof document !== 'undefined' && document.documentElement) {
        document.documentElement.lang = value === 'mr' ? 'mr' : 'en';
      }
    } catch (_) {}
  }, []);

  useEffect(() => {
    if (typeof document !== 'undefined' && document.documentElement) {
      document.documentElement.lang = (lang || 'en') === 'mr' ? 'mr' : 'en';
    }
  }, [lang]);

  const t = useCallback(
    (key) => {
      const effectiveLang = lang || 'en';
      const dict = translations[effectiveLang];
      return dict && key in dict ? dict[key] : (translations.en[key] ?? key);
    },
    [lang]
  );

  const value = {
    lang: lang || 'en',
    langChosen: lang !== null,
    setLang,
    t,
  };

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error('useLanguage must be used within LanguageProvider');
  return ctx;
}

export function useTranslation() {
  const { t } = useLanguage();
  return t;
}
