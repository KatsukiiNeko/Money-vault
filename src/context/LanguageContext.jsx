import React, { createContext, useContext, useState, useCallback } from 'react';
import { translations } from '../i18n/translations';

const LanguageContext = createContext();

export const useLanguage = () => useContext(LanguageContext);

const LANG_STORAGE_KEY = 'money-vault-lang';

export const LanguageProvider = ({ children }) => {
  const [language, setLanguage] = useState(() => {
    return localStorage.getItem(LANG_STORAGE_KEY) || 'EN';
  });

  const toggleLanguage = useCallback(() => {
    setLanguage(prev => {
      const next = prev === 'EN' ? 'VI' : 'EN';
      localStorage.setItem(LANG_STORAGE_KEY, next);
      return next;
    });
  }, []);

  const t = useCallback((key, params = {}) => {
    const langKey = language === 'EN' ? 'en' : 'vi';
    let value = translations[key]?.[langKey] || translations[key]?.['en'] || key;
    Object.entries(params).forEach(([k, v]) => {
      value = value.replace(`{${k}}`, v);
    });
    return value;
  }, [language]);

  return (
    <LanguageContext.Provider value={{ language, toggleLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};
