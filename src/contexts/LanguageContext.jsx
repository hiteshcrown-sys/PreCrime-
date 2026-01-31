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
    return 'en'; // Default to English instead of null to avoid blocking UI if not wanted
  });

  const setLanguage = useCallback((value) => {
    if (value !== 'en' && value !== 'hi' && value !== 'mr') return;
    setLanguageState(value);
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

  const value = {
    language,
    setLanguage,
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
