import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { translations } from '@/i18n/translations';

const STORAGE_KEY = 'app_language';

const LanguageContext = createContext(null);

export const LanguageProvider = ({ children }) => {
  const [language, setLanguageState] = useState(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored === 'en' || stored === 'hi' || stored === 'mr') return stored;
    } catch (_) { }
    // We default to 'en' so the UI isn't broken, but langChosen will be false
    return 'en';
  });

  const [langChosen, setLangChosen] = useState(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      return !!(stored === 'en' || stored === 'hi' || stored === 'mr');
    } catch (_) {
      return false;
    }
  });

  const setLanguage = useCallback((value) => {
    if (value !== 'en' && value !== 'hi' && value !== 'mr') return;
    setLanguageState(value);
    setLangChosen(true);
    try {
      localStorage.setItem(STORAGE_KEY, value);
      if (typeof document !== 'undefined' && document.documentElement) {
        document.documentElement.lang = value;
      }
    } catch (_) { }
  }, []);

  useEffect(() => {
    if (typeof document !== 'undefined' && document.documentElement) {
      document.documentElement.lang = language;
    }
  }, [language]);

  const t = useCallback((key) => {
    if (!translations[language]) return key;
    const translation = translations[language][key];
    if (translation) return translation;
    if (language !== 'en' && translations.en[key]) {
      return translations.en[key];
    }
    return key;
  }, [language]);

  const value = {
    language,
    setLanguage,
    setLang: setLanguage, // Aliasing for components using setLang
    langChosen,
    t,
  };

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
